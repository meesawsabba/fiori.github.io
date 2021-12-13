/*!
 * SAPUI5
  (c) Copyright 2009-2021 SAP SE. All rights reserved
 */
/*global sap*/
sap.ui.define(
[
"sap/zen/dsh/firefly/ff3100.system.ui","sap/zen/dsh/firefly/ff8000.quasar","sap/zen/dsh/firefly/ff4200.olap.api","sap/zen/dsh/firefly/ff5500.story","sap/zen/dsh/firefly/ff8010.olap.ui"
],
function(oFF)
{
"use strict";

oFF.AuGdsContants = {

	GDF_FILE_EXTENSION:"gdf",
	GDF_FILE_DOC_TYPE:"docType",
	GDF_FILE_DOC_NAME:"docName",
	GDF_DOC_TYPE_PROJECT:"project",
	GDF_DOC_TYPE_QUERY_DESIGNER:"querydesigner",
	GDF_DEFAULT_SAVE_DIR:"${ff_sdk}/production/queries/gds/"
};

oFF.AuGdsQdDimensionViewModel = function() {};
oFF.AuGdsQdDimensionViewModel.prototype = new oFF.XObject();
oFF.AuGdsQdDimensionViewModel.prototype._ff_c = "AuGdsQdDimensionViewModel";

oFF.AuGdsQdDimensionViewModel.createStructureForNavPanel = function(structure, members, label, rowIcon, colIcon, allCb)
{
	var obj = new oFF.AuGdsQdDimensionViewModel();
	obj.setupExt(structure, members, oFF.UiContextDummy.getSingleton(), label, rowIcon, colIcon, allCb);
	return obj;
};
oFF.AuGdsQdDimensionViewModel.createStructureForBuildPanel = function(structure, members, label)
{
	var obj = new oFF.AuGdsQdDimensionViewModel();
	var dummy = oFF.UiContextDummy.getSingleton();
	obj.setupExt(structure, members, dummy, label, dummy, dummy, dummy);
	return obj;
};
oFF.AuGdsQdDimensionViewModel.createDimensionForNavPanel = function(dimension, root, label, rowIcon, colIcon)
{
	var obj = new oFF.AuGdsQdDimensionViewModel();
	obj.setupExt(dimension, oFF.XList.create(), root, label, rowIcon, colIcon, oFF.UiContextDummy.getSingleton());
	return obj;
};
oFF.AuGdsQdDimensionViewModel.createDimensionForBuildPanel = function(dimension, label)
{
	var obj = new oFF.AuGdsQdDimensionViewModel();
	var dummy = oFF.UiContextDummy.getSingleton();
	obj.setupExt(dimension, oFF.XList.create(), dummy, label, dummy, dummy, dummy);
	return obj;
};
oFF.AuGdsQdDimensionViewModel.prototype.m_dimension = null;
oFF.AuGdsQdDimensionViewModel.prototype.m_members = null;
oFF.AuGdsQdDimensionViewModel.prototype.m_root = null;
oFF.AuGdsQdDimensionViewModel.prototype.m_label = null;
oFF.AuGdsQdDimensionViewModel.prototype.m_allCb = null;
oFF.AuGdsQdDimensionViewModel.prototype.m_rowIco = null;
oFF.AuGdsQdDimensionViewModel.prototype.m_colIco = null;
oFF.AuGdsQdDimensionViewModel.prototype.setupExt = function(dimension, members, root, label, rowIcon, colIcon, allCb)
{
	this.m_dimension = dimension;
	this.m_root = root;
	this.m_label = label;
	this.m_allCb = allCb;
	this.m_rowIco = rowIcon;
	this.m_colIco = colIcon;
	this.m_members = members;
};
oFF.AuGdsQdDimensionViewModel.prototype.releaseObject = function()
{
	this.m_dimension = null;
	this.m_label = null;
	this.m_allCb = null;
	this.m_rowIco = null;
	this.m_colIco = null;
	oFF.XCollectionUtils.releaseEntriesAndCollectionIfNotNull(this.m_members);
	oFF.XObject.prototype.releaseObject.call( this );
};
oFF.AuGdsQdDimensionViewModel.prototype.getDimension = function()
{
	return this.m_dimension;
};
oFF.AuGdsQdDimensionViewModel.prototype.getRoot = function()
{
	return this.m_root;
};
oFF.AuGdsQdDimensionViewModel.prototype.getLabel = function()
{
	return this.m_label;
};
oFF.AuGdsQdDimensionViewModel.prototype.getAllCb = function()
{
	return this.m_allCb;
};
oFF.AuGdsQdDimensionViewModel.prototype.getRowIcon = function()
{
	return this.m_rowIco;
};
oFF.AuGdsQdDimensionViewModel.prototype.getColumnIcon = function()
{
	return this.m_colIco;
};
oFF.AuGdsQdDimensionViewModel.prototype.getMembers = function()
{
	return this.m_members;
};

oFF.AuGdsQdMemberViewModel = function() {};
oFF.AuGdsQdMemberViewModel.prototype = new oFF.XObject();
oFF.AuGdsQdMemberViewModel.prototype._ff_c = "AuGdsQdMemberViewModel";

oFF.AuGdsQdMemberViewModel.createMemberForNavPanel = function(member, root, label, checkbox)
{
	var obj = new oFF.AuGdsQdMemberViewModel();
	obj.setupExt(member, root, label, checkbox);
	return obj;
};
oFF.AuGdsQdMemberViewModel.createMemberForBuildPanel = function(member, label)
{
	var obj = new oFF.AuGdsQdMemberViewModel();
	obj.setupExt(member, oFF.UiContextDummy.getSingleton(), label, oFF.UiContextDummy.getSingleton());
	return obj;
};
oFF.AuGdsQdMemberViewModel.prototype.m_member = null;
oFF.AuGdsQdMemberViewModel.prototype.m_root = null;
oFF.AuGdsQdMemberViewModel.prototype.m_label = null;
oFF.AuGdsQdMemberViewModel.prototype.m_checkbox = null;
oFF.AuGdsQdMemberViewModel.prototype.setupExt = function(member, root, label, checkbox)
{
	this.m_member = member;
	this.m_root = root;
	this.m_label = label;
	this.m_checkbox = checkbox;
};
oFF.AuGdsQdMemberViewModel.prototype.releaseObject = function()
{
	this.m_member = null;
	this.m_label = null;
	this.m_checkbox = null;
	oFF.XObject.prototype.releaseObject.call( this );
};
oFF.AuGdsQdMemberViewModel.prototype.getMember = function()
{
	return this.m_member;
};
oFF.AuGdsQdMemberViewModel.prototype.getRoot = function()
{
	return this.m_root;
};
oFF.AuGdsQdMemberViewModel.prototype.getLabel = function()
{
	return this.m_label;
};
oFF.AuGdsQdMemberViewModel.prototype.getCheckbox = function()
{
	return this.m_checkbox;
};

oFF.AuGdsLambdaDialogCloseListener = function() {};
oFF.AuGdsLambdaDialogCloseListener.prototype = new oFF.XObject();
oFF.AuGdsLambdaDialogCloseListener.prototype._ff_c = "AuGdsLambdaDialogCloseListener";

oFF.AuGdsLambdaDialogCloseListener.create = function(onOk, onClose)
{
	var result = new oFF.AuGdsLambdaDialogCloseListener();
	result.m_closeProcedure = onClose;
	result.m_okProcedure = onOk;
	return result;
};
oFF.AuGdsLambdaDialogCloseListener.prototype.m_closeProcedure = null;
oFF.AuGdsLambdaDialogCloseListener.prototype.m_okProcedure = null;
oFF.AuGdsLambdaDialogCloseListener.prototype.onDataCellOk = function()
{
	if (oFF.notNull(this.m_okProcedure))
	{
		this.m_okProcedure();
	}
};
oFF.AuGdsLambdaDialogCloseListener.prototype.onDataCellClose = function()
{
	if (oFF.notNull(this.m_closeProcedure))
	{
		this.m_closeProcedure();
	}
};
oFF.AuGdsLambdaDialogCloseListener.prototype.onSubmit = function()
{
	if (oFF.notNull(this.m_okProcedure))
	{
		this.m_okProcedure();
	}
};
oFF.AuGdsLambdaDialogCloseListener.prototype.onClose = function()
{
	if (oFF.notNull(this.m_closeProcedure))
	{
		this.m_closeProcedure();
	}
};
oFF.AuGdsLambdaDialogCloseListener.prototype.releaseObject = function()
{
	this.m_closeProcedure = null;
	this.m_okProcedure = null;
	oFF.XObject.prototype.releaseObject.call( this );
};

oFF.AuGdsLambdaFdCloseListener = function() {};
oFF.AuGdsLambdaFdCloseListener.prototype = new oFF.XObject();
oFF.AuGdsLambdaFdCloseListener.prototype._ff_c = "AuGdsLambdaFdCloseListener";

oFF.AuGdsLambdaFdCloseListener.create = function(onOk, onClose)
{
	var result = new oFF.AuGdsLambdaFdCloseListener();
	result.m_closeProcedure = onClose;
	result.m_okProcedure = onOk;
	return result;
};
oFF.AuGdsLambdaFdCloseListener.prototype.m_closeProcedure = null;
oFF.AuGdsLambdaFdCloseListener.prototype.m_okProcedure = null;
oFF.AuGdsLambdaFdCloseListener.prototype.onFilterDialogOk = function(selection)
{
	if (oFF.notNull(this.m_okProcedure))
	{
		this.m_okProcedure(selection);
	}
};
oFF.AuGdsLambdaFdCloseListener.prototype.onFilterDialogCancel = function()
{
	if (oFF.notNull(this.m_closeProcedure))
	{
		this.m_closeProcedure();
	}
};
oFF.AuGdsLambdaFdCloseListener.prototype.releaseObject = function()
{
	this.m_closeProcedure = null;
	this.m_okProcedure = null;
	oFF.XObject.prototype.releaseObject.call( this );
};

oFF.AuGdsLambdaSetParameterListener = function() {};
oFF.AuGdsLambdaSetParameterListener.prototype = new oFF.XObject();
oFF.AuGdsLambdaSetParameterListener.prototype._ff_c = "AuGdsLambdaSetParameterListener";

oFF.AuGdsLambdaSetParameterListener.create = function(biFunction)
{
	var obj = new oFF.AuGdsLambdaSetParameterListener();
	obj.m_function = biFunction;
	return obj;
};
oFF.AuGdsLambdaSetParameterListener.prototype.m_function = null;
oFF.AuGdsLambdaSetParameterListener.prototype.setObject = function(parameter, object)
{
	if (oFF.notNull(this.m_function))
	{
		this.m_function(oFF.XStringValue.create(parameter), object);
	}
};
oFF.AuGdsLambdaSetParameterListener.prototype.releaseObject = function()
{
	this.m_function = null;
	oFF.XObject.prototype.releaseObject.call( this );
};

oFF.ShCell = function() {};
oFF.ShCell.prototype = new oFF.XObject();
oFF.ShCell.prototype._ff_c = "ShCell";

oFF.ShCell.create = function(doc, x, y)
{
	var cell = new oFF.ShCell();
	cell.setPosition(x, y);
	cell.m_document = doc;
	return cell;
};
oFF.ShCell.convertToAZ = function(column)
{
	var buffer = oFF.XStringBuffer.create();
	if (column < 26)
	{
		buffer.appendChar(65 + column);
	}
	else
	{
		buffer.append("ZZ");
	}
	return buffer;
};
oFF.ShCell.prototype.m_x = 0;
oFF.ShCell.prototype.m_y = 0;
oFF.ShCell.prototype.m_name = null;
oFF.ShCell.prototype.m_key = null;
oFF.ShCell.prototype.m_value = null;
oFF.ShCell.prototype.m_text = null;
oFF.ShCell.prototype.m_expression = null;
oFF.ShCell.prototype.m_int = 0;
oFF.ShCell.prototype.m_double = 0.0;
oFF.ShCell.prototype.m_type = null;
oFF.ShCell.prototype.m_document = null;
oFF.ShCell.prototype.setPosition = function(x, y)
{
	this.m_x = x;
	this.m_y = y;
	var buffer = oFF.ShCell.convertToAZ(this.m_x);
	buffer.appendInt(this.m_y);
	this.m_name = buffer.toString();
	var buffer2 = oFF.XStringBuffer.create();
	buffer2.appendInt(this.m_x);
	buffer2.append("_");
	buffer2.appendInt(this.m_y);
	this.m_key = buffer2.toString();
};
oFF.ShCell.prototype.setInteger = function(value)
{
	this.m_int = value;
	this.m_value = oFF.XInteger.convertToString(this.m_int);
	this.m_type = oFF.XValueType.INTEGER;
	return this;
};
oFF.ShCell.prototype.getInteger = function()
{
	return this.m_int;
};
oFF.ShCell.prototype.setDouble = function(value)
{
	this.m_double = value;
	this.m_value = oFF.XDouble.convertToString(this.m_double);
	this.m_type = oFF.XValueType.DOUBLE;
	return this;
};
oFF.ShCell.prototype.getDouble = function()
{
	return this.m_double;
};
oFF.ShCell.prototype.setText = function(text)
{
	this.m_text = text;
	this.m_value = this.m_text;
	this.m_type = oFF.XValueType.STRING;
	return this;
};
oFF.ShCell.prototype.setExpression = function(expression)
{
	this.m_expression = expression;
	this.m_value = this.m_expression;
	this.m_type = oFF.XComponentType._DATASOURCE;
	return this;
};
oFF.ShCell.prototype.getName = function()
{
	return this.m_name;
};
oFF.ShCell.prototype.getKey = function()
{
	return this.m_key;
};
oFF.ShCell.prototype.hasExpression = function()
{
	return oFF.notNull(this.m_expression);
};
oFF.ShCell.prototype.hasNumber = function()
{
	return this.m_type.isTypeOf(oFF.XValueType.NUMBER);
};
oFF.ShCell.prototype.getValueType = function()
{
	return this.m_type;
};
oFF.ShCell.prototype.getExpression = function()
{
	return this.m_expression;
};
oFF.ShCell.prototype.beforeScriptExecution = function(interpreter) {};
oFF.ShCell.prototype.afterScriptExecution = function(interpreter) {};
oFF.ShCell.prototype.nativeCall = function(interpreter, name, registerObj, stack, parameterCount)
{
	var offset = stack.size() - parameterCount;
	var result = null;
	var stackObj = stack.get(offset);
	var componentType;
	if (oFF.XString.isEqual("set", name))
	{
		if (oFF.notNull(stackObj))
		{
			componentType = stackObj.getComponentType();
			if (componentType === oFF.XValueType.STRING)
			{
				this.setText(stackObj.getString());
			}
			else if (componentType === oFF.XValueType.INTEGER)
			{
				var intValue = stackObj;
				this.setInteger(intValue.getInteger());
			}
		}
	}
	else if (oFF.XString.isEqual("sum", name))
	{
		if (oFF.notNull(stackObj))
		{
			componentType = stackObj.getComponentType();
			if (componentType === oFF.XValueType.STRING)
			{
				var stringValue = stackObj.getString();
				var selection = this.parseSelection(stringValue);
				var cells = this.m_document.select(selection);
				var theSum = 0.0;
				for (var i = 0; i < cells.size(); i++)
				{
					var current = cells.get(i);
					var valueType = current.getValueType();
					if (valueType === oFF.XValueType.INTEGER)
					{
						var currentInt = current.getInteger();
						theSum = theSum + currentInt;
					}
					else if (valueType === oFF.XValueType.DOUBLE)
					{
						var currentDouble = current.getDouble();
						theSum = theSum + currentDouble;
					}
				}
				this.setDouble(theSum);
			}
		}
	}
	return result;
};
oFF.ShCell.prototype.parseSelection = function(query)
{
	var sep = oFF.XString.indexOf(query, ":");
	var first = null;
	var second = null;
	if (sep !== -1)
	{
		first = oFF.XString.substring(query, 0, sep);
		second = oFF.XString.substring(query, sep + 1, -1);
	}
	else
	{
		first = query;
	}
	var selection = oFF.ShSelection.create();
	var firstPosition = this.parsePosition(first);
	selection.setStart(firstPosition);
	if (oFF.notNull(second))
	{
		var secondPosition = this.parsePosition(second);
		selection.setEnd(secondPosition);
	}
	return selection;
};
oFF.ShCell.prototype.parsePosition = function(value)
{
	var letter = oFF.XString.getCharAt(value, 0);
	var number = oFF.XString.getCharAt(value, 1);
	var x = letter - 65;
	var y = number - 49;
	return oFF.ShPosition.create(x, y);
};
oFF.ShCell.prototype.toString = function()
{
	return this.m_value;
};

oFF.ShDocument = function() {};
oFF.ShDocument.prototype = new oFF.XObject();
oFF.ShDocument.prototype._ff_c = "ShDocument";

oFF.ShDocument.create = function()
{
	var newObj = new oFF.ShDocument();
	newObj.setup();
	return newObj;
};
oFF.ShDocument.prototype.m_rowCount = 0;
oFF.ShDocument.prototype.m_colCount = 0;
oFF.ShDocument.prototype.m_emptyCell = null;
oFF.ShDocument.prototype.m_cells = null;
oFF.ShDocument.prototype.setup = function()
{
	oFF.XObject.prototype.setup.call( this );
	this.m_emptyCell = oFF.ShCell.create(this, 0, 0);
	this.m_cells = oFF.XHashMapByString.create();
};
oFF.ShDocument.prototype.newCell = function(x, y)
{
	var cell = oFF.ShCell.create(this, x, y);
	var key = cell.getKey();
	this.m_cells.put(key, cell);
	if (x >= this.m_colCount)
	{
		this.m_colCount = x + 1;
	}
	if (y >= this.m_rowCount)
	{
		this.m_rowCount = y + 1;
	}
	return cell;
};
oFF.ShDocument.prototype.getCell = function(x, y)
{
	var key = oFF.XStringBuffer.create().appendInt(x).append("_").appendInt(y).toString();
	var cell = this.m_cells.getByKey(key);
	if (oFF.isNull(cell))
	{
		cell = this.m_emptyCell;
	}
	return cell;
};
oFF.ShDocument.prototype.evaluate = function()
{
	var cells = this.m_cells.getIterator();
	var cellsWithExpressions = oFF.XList.create();
	while (cells.hasNext())
	{
		var current = cells.next();
		if (current.hasExpression())
		{
			cellsWithExpressions.add(current);
		}
	}
	for (var i = 0; i < cellsWithExpressions.size(); i++)
	{
		var cell = cellsWithExpressions.get(i);
		this.evaluateCell(cell);
	}
};
oFF.ShDocument.prototype.evaluateCell = function(cell)
{
	var script = cell.getExpression();
	var interpreter = oFF.ScriptEngine.create();
	interpreter.setVmCallback(cell);
	interpreter.compile(script);
	if (interpreter.isValid())
	{
		interpreter.execute();
	}
};
oFF.ShDocument.prototype.select = function(selection)
{
	var cells = oFF.XList.create();
	var startX = selection.getStartX();
	var startY = selection.getStartX();
	var endX = selection.getEndX();
	var endY = selection.getEndY();
	if (startX === -1)
	{
		startX = 0;
	}
	if (startY === -1)
	{
		startY = 0;
	}
	if (endX === -1)
	{
		endX = this.m_colCount - 1;
	}
	if (endY === -1)
	{
		endY = this.m_rowCount - 1;
	}
	var cell;
	for (var y = startY; y <= endY; y++)
	{
		for (var x = startX; x <= endX; x++)
		{
			cell = this.getCell(x, y);
			cells.add(cell);
		}
	}
	return cells;
};
oFF.ShDocument.prototype.toGridStructure = function()
{
	var model = oFF.PrFactory.createStructure();
	model.putInteger("RowCount", this.m_rowCount + 1);
	model.putInteger("ColCount", this.m_colCount + 1);
	var cells = model.putNewList("Cells");
	for (var y = 0; y < this.m_rowCount + 1; y++)
	{
		for (var x = 0; x < this.m_colCount + 1; x++)
		{
			var cellTarget = cells.addNewStructure();
			cellTarget.putString("Type", "Text");
			if (x > 0 && y > 0)
			{
				var cell = this.getCell(x - 1, y - 1);
				cellTarget.putString("Value", cell.toString());
				cellTarget.putString("Color", "#AABBCC");
			}
			else if (x === 0 && y > 0)
			{
				cellTarget.putString("Value", oFF.XInteger.convertToString(y));
				cellTarget.putString("Color", "#AABB00");
			}
			else if (y === 0 && x > 0)
			{
				cellTarget.putString("Value", oFF.ShCell.convertToAZ(x - 1).toString());
				cellTarget.putString("Color", "#00BB00");
			}
			else
			{
				cellTarget.putString("Value", "");
				cellTarget.putString("Color", "#00BB00");
			}
		}
	}
	return model;
};
oFF.ShDocument.prototype.toString = function()
{
	var cell;
	var content;
	var size;
	var colWidth = oFF.XArrayOfInt.create(this.m_colCount + 1);
	for (var y = 0; y < this.m_rowCount + 1; y++)
	{
		for (var x = 0; x < this.m_colCount + 1; x++)
		{
			if (x > 0 && y > 0)
			{
				cell = this.getCell(x - 1, y - 1);
				content = cell.toString();
			}
			else if (x === 0 && y > 0)
			{
				content = oFF.XInteger.convertToString(y);
			}
			else if (y === 0 && x > 0)
			{
				content = oFF.ShCell.convertToAZ(x - 1).toString();
			}
			else
			{
				content = "";
			}
			if (oFF.isNull(content))
			{
				size = 0;
			}
			else
			{
				size = oFF.XString.size(content);
			}
			if (size > colWidth.get(x))
			{
				colWidth.set(x, size);
			}
		}
	}
	var buffer = oFF.XStringBuffer.create();
	for (var ii = 0; ii < this.m_rowCount + 1; ii++)
	{
		if (ii > 0)
		{
			buffer.appendNewLine();
		}
		for (var jj = 0; jj < this.m_colCount + 1; jj++)
		{
			if (jj > 0)
			{
				buffer.append(" | ");
			}
			if (jj > 0 && ii > 0)
			{
				cell = this.getCell(jj - 1, ii - 1);
				content = cell.toString();
			}
			else if (jj === 0 && ii > 0)
			{
				content = oFF.XInteger.convertToString(ii);
			}
			else if (ii === 0 && jj > 0)
			{
				content = oFF.ShCell.convertToAZ(jj - 1).toString();
			}
			else
			{
				content = "";
			}
			if (oFF.isNull(content))
			{
				size = 0;
			}
			else
			{
				size = oFF.XString.size(content);
			}
			var delta = colWidth.get(jj) - size;
			for (var k = 0; k < delta; k++)
			{
				buffer.append(" ");
			}
			buffer.append(content);
		}
	}
	return buffer.toString();
};

oFF.ShPosition = function() {};
oFF.ShPosition.prototype = new oFF.XObject();
oFF.ShPosition.prototype._ff_c = "ShPosition";

oFF.ShPosition.create = function(x, y)
{
	var newObj = new oFF.ShPosition();
	newObj.m_x = x;
	newObj.m_y = y;
	return newObj;
};
oFF.ShPosition.prototype.m_x = 0;
oFF.ShPosition.prototype.m_y = 0;
oFF.ShPosition.prototype.getX = function()
{
	return this.m_x;
};
oFF.ShPosition.prototype.getY = function()
{
	return this.m_y;
};
oFF.ShPosition.prototype.toString = function()
{
	return oFF.XStringBuffer.create().append("X: ").appendInt(this.m_x).append(" Y: ").appendInt(this.m_y).toString();
};

oFF.ShSelection = function() {};
oFF.ShSelection.prototype = new oFF.XObject();
oFF.ShSelection.prototype._ff_c = "ShSelection";

oFF.ShSelection.create = function()
{
	var newObj = new oFF.ShSelection();
	newObj.setup();
	return newObj;
};
oFF.ShSelection.prototype.m_startX = 0;
oFF.ShSelection.prototype.m_startY = 0;
oFF.ShSelection.prototype.m_endX = 0;
oFF.ShSelection.prototype.m_endY = 0;
oFF.ShSelection.prototype.setup = function()
{
	this.m_startX = -1;
	this.m_startY = -1;
	this.m_endX = -1;
	this.m_endY = -1;
};
oFF.ShSelection.prototype.setStart = function(position)
{
	this.m_startX = position.getX();
	this.m_startY = position.getY();
};
oFF.ShSelection.prototype.setEnd = function(position)
{
	this.m_endX = position.getX();
	this.m_endY = position.getY();
};
oFF.ShSelection.prototype.getStartX = function()
{
	return this.m_startX;
};
oFF.ShSelection.prototype.getStartY = function()
{
	return this.m_startY;
};
oFF.ShSelection.prototype.getEndX = function()
{
	return this.m_endX;
};
oFF.ShSelection.prototype.getEndY = function()
{
	return this.m_endY;
};

oFF.GyrosNumberFormatter = function() {};
oFF.GyrosNumberFormatter.prototype = new oFF.XObject();
oFF.GyrosNumberFormatter.prototype._ff_c = "GyrosNumberFormatter";

oFF.GyrosNumberFormatter.create = function()
{
	return new oFF.GyrosNumberFormatter();
};
oFF.GyrosNumberFormatter.prototype.format = function(value)
{
	try
	{
		return oFF.XNumberFormatter.formatDoubleToString(oFF.XDouble.convertFromString(value), "#,#.###");
	}
	catch (e)
	{
		return value;
	}
};
oFF.GyrosNumberFormatter.prototype.parseFormattedNumber = function(value)
{
	if (oFF.XStringUtils.isNullOrEmpty(value))
	{
		return value;
	}
	var parsedValue = oFF.XString.replace(value, ",", "");
	try
	{
		var dValue = oFF.XDouble.convertFromString(parsedValue);
		return oFF.XDouble.convertToString(dValue);
	}
	catch (e)
	{
		return null;
	}
};
oFF.GyrosNumberFormatter.prototype.formatTextForDateTimeKey = function(textValue, keyValue, keyValueType)
{
	if (oFF.notNull(keyValue) && !oFF.XString.isEqual(textValue, "#") && keyValueType === oFF.XValueType.TIME || keyValueType === oFF.XValueType.DATE)
	{
		return oFF.XStringUtils.concatenate4(textValue, " [GyrosFormatted:", keyValue, "]");
	}
	return textValue;
};

oFF.UiFeatureToggleDialog = function() {};
oFF.UiFeatureToggleDialog.prototype = new oFF.XObject();
oFF.UiFeatureToggleDialog.prototype._ff_c = "UiFeatureToggleDialog";

oFF.UiFeatureToggleDialog.createFeatureDialog = function(session, uiMgr, listener)
{
	var obj = new oFF.UiFeatureToggleDialog();
	obj.setupExt(session, uiMgr, listener);
	return obj;
};
oFF.UiFeatureToggleDialog.prototype.m_dialog = null;
oFF.UiFeatureToggleDialog.prototype.m_okBtn = null;
oFF.UiFeatureToggleDialog.prototype.m_cancelBtn = null;
oFF.UiFeatureToggleDialog.prototype.m_featureList = null;
oFF.UiFeatureToggleDialog.prototype.m_listener = null;
oFF.UiFeatureToggleDialog.prototype.m_selectedToggles = null;
oFF.UiFeatureToggleDialog.prototype.setupExt = function(session, uiMgr, listener)
{
	this.m_listener = listener;
	this.m_dialog = uiMgr.newControl(oFF.UiType.DIALOG);
	this.m_dialog.setTitle("FeatureToggles");
	this.m_dialog.registerOnAfterClose(this);
	this.m_okBtn = this.m_dialog.addNewDialogButton();
	this.m_okBtn.setName("featureToggleOk");
	this.m_okBtn.setText("Ok");
	this.m_okBtn.registerOnPress(this);
	this.m_cancelBtn = this.m_dialog.addNewDialogButton();
	this.m_cancelBtn.setName("featureToggleCancel");
	this.m_cancelBtn.setText("Cancel");
	this.m_cancelBtn.registerOnPress(this);
	var dialogGenesis = oFF.UiGenesis.create(this.m_dialog, oFF.UiItemPosition.CONTENT, oFF.UiOperation.SET, 0, 0);
	this.m_featureList = oFF.UiFeatureToggleList.createFeatureList(session);
	this.m_featureList.buildUi(dialogGenesis);
	this.m_dialog.setWidth(oFF.UiCssLength.create("40%"));
};
oFF.UiFeatureToggleDialog.prototype.open = function()
{
	return this.m_dialog.open();
};
oFF.UiFeatureToggleDialog.prototype.onAfterClose = function(event)
{
	this.m_listener.onFeatureToggleDialogClose(this.m_selectedToggles);
};
oFF.UiFeatureToggleDialog.prototype.onPress = function(event)
{
	var control = event.getControl();
	if (control === this.m_okBtn)
	{
		this.m_selectedToggles = this.m_featureList.getSelectedToggles();
		this.m_dialog.close();
	}
	else if (control === this.m_cancelBtn)
	{
		this.m_selectedToggles = null;
		this.m_dialog.close();
	}
};
oFF.UiFeatureToggleDialog.prototype.releaseObject = function()
{
	this.m_dialog = oFF.XObjectExt.release(this.m_dialog);
	this.m_okBtn = null;
	this.m_cancelBtn = null;
	this.m_featureList = oFF.XObjectExt.release(this.m_featureList);
	this.m_selectedToggles = oFF.XObjectExt.release(this.m_selectedToggles);
	this.m_listener = null;
	oFF.XObject.prototype.releaseObject.call( this );
};

oFF.UiFeatureToggleList = function() {};
oFF.UiFeatureToggleList.prototype = new oFF.XObject();
oFF.UiFeatureToggleList.prototype._ff_c = "UiFeatureToggleList";

oFF.UiFeatureToggleList.createFeatureList = function(session)
{
	var obj = new oFF.UiFeatureToggleList();
	obj.setupExt(session);
	return obj;
};
oFF.UiFeatureToggleList.prototype.m_session = null;
oFF.UiFeatureToggleList.prototype.m_layout = null;
oFF.UiFeatureToggleList.prototype.m_searchField = null;
oFF.UiFeatureToggleList.prototype.m_list = null;
oFF.UiFeatureToggleList.prototype.m_allToggles = null;
oFF.UiFeatureToggleList.prototype.m_selectedToggles = null;
oFF.UiFeatureToggleList.prototype.setupExt = function(session)
{
	this.m_session = session;
	this.m_allToggles = oFF.FeatureToggleOlap.getAllFeatureToggles();
	this.m_selectedToggles = oFF.XSetOfNameObject.create();
	var iterator = this.m_allToggles.getIterator();
	while (iterator.hasNext())
	{
		var toggle = iterator.next();
		if (this.m_session.hasFeature(toggle))
		{
			this.m_selectedToggles.add(toggle);
		}
	}
};
oFF.UiFeatureToggleList.prototype.buildUi = function(genesis)
{
	this.m_layout = genesis.newRoot(oFF.UiType.FLEX_LAYOUT);
	this.m_layout.setDirection(oFF.UiFlexDirection.COLUMN);
	this.m_layout.setHeight(oFF.UiCssLength.create("650px"));
	this.m_layout.setMargin(oFF.UiCssBoxEdges.create("4px"));
	this.m_searchField = this.m_layout.addNewItemOfType(oFF.UiType.SEARCH_FIELD);
	this.m_searchField.registerOnSearch(this);
	var infoLayout = this.m_layout.addNewItemOfType(oFF.UiType.FLEX_LAYOUT);
	infoLayout.setMargin(oFF.UiCssBoxEdges.create("6px"));
	infoLayout.setFlex("0 0 auto");
	infoLayout.addNewItemOfType(oFF.UiType.ICON).setIcon("message-information");
	infoLayout.addNewItemOfType(oFF.UiType.SPACER).setWidth(oFF.UiCssLength.create("12px"));
	infoLayout.addNewItemOfType(oFF.UiType.LABEL).setText("Toggles past the current XVersion cannot be disabled anymore.");
	var scroll = this.m_layout.addNewItemOfType(oFF.UiType.SCROLL_CONTAINER);
	scroll.setFlex("1 1 auto");
	this.m_list = scroll.setNewContent(oFF.UiType.LIST);
	this.m_list.setName("featureToggleList");
	this.m_list.setSelectionMode(oFF.UiSelectionMode.MULTI_SELECT);
	this.m_list.setBorderWidth(oFF.UiCssBoxEdges.create("0px"));
	this.m_list.registerOnSelectionChange(this);
	this.update(this.m_allToggles);
};
oFF.UiFeatureToggleList.prototype.update = function(toggles)
{
	this.m_list.clearItems();
	var iterator = toggles.getKeysAsIteratorOfString();
	while (iterator.hasNext())
	{
		var featureToggle = toggles.getByKey(iterator.next());
		var listItem = this.m_list.addNewItem();
		listItem.setText(featureToggle.getName());
		listItem.setCustomObject(featureToggle);
		listItem.setEnabled(featureToggle.getMaxXVersion() > this.m_session.getXVersion());
		listItem.setSelected(this.m_selectedToggles.contains(featureToggle));
	}
	oFF.XObjectExt.release(iterator);
};
oFF.UiFeatureToggleList.prototype.getSelectedToggles = function()
{
	return this.m_selectedToggles;
};
oFF.UiFeatureToggleList.prototype.onSearch = function(event)
{
	var clearButtonPressed = event.getParameters().getBooleanByKeyExt(oFF.UiControlEvent.PARAM_CLEAR_BUTTON_PRESSED, false);
	if (clearButtonPressed)
	{
		this.update(this.m_allToggles);
	}
	else
	{
		var searchText = event.getParameters().getStringByKeyExt(oFF.UiControlEvent.PARAM_SEARCH_TEXT, "");
		var toggles = oFF.XSetOfNameObject.create();
		var iterator = this.m_allToggles.getIterator();
		while (iterator.hasNext())
		{
			var toggle = iterator.next();
			if (oFF.XString.containsString(oFF.XString.toLowerCase(toggle.getName()), oFF.XString.toLowerCase(searchText)))
			{
				toggles.add(toggle);
			}
		}
		oFF.XObjectExt.release(iterator);
		this.update(toggles);
	}
};
oFF.UiFeatureToggleList.prototype.onSelectionChange = function(event)
{
	var displayedItems = this.m_list.getItems();
	var selectedItems = this.m_list.getSelectedItems();
	for (var i = 0; i < displayedItems.size(); i++)
	{
		var item = displayedItems.get(i);
		var toggle = item.getCustomObject();
		if (selectedItems.contains(item))
		{
			this.m_selectedToggles.add(toggle);
		}
		else
		{
			this.m_selectedToggles.removeElement(toggle);
		}
	}
};
oFF.UiFeatureToggleList.prototype.releaseObject = function()
{
	this.m_session = null;
	this.m_list = null;
	this.m_searchField = null;
	this.m_layout = oFF.XObjectExt.release(this.m_layout);
	this.m_selectedToggles = oFF.XObjectExt.release(this.m_selectedToggles);
	this.m_allToggles = null;
	oFF.XObject.prototype.releaseObject.call( this );
};

oFF.OqdController = function() {};
oFF.OqdController.prototype = new oFF.XObject();
oFF.OqdController.prototype._ff_c = "OqdController";

oFF.OqdController.create = function(application, uiManager, listener)
{
	var obj = new oFF.OqdController();
	obj.setupController(application, uiManager, listener);
	return obj;
};
oFF.OqdController.prototype.m_application = null;
oFF.OqdController.prototype.m_uiManager = null;
oFF.OqdController.prototype.m_listener = null;
oFF.OqdController.prototype.m_openQueryDialog = null;
oFF.OqdController.prototype.m_cancelBtn = null;
oFF.OqdController.prototype.m_systemsCombobox = null;
oFF.OqdController.prototype.m_queryListTable = null;
oFF.OqdController.prototype.m_searchInput = null;
oFF.OqdController.prototype.m_fullQueryNames = null;
oFF.OqdController.prototype.setupController = function(application, uiManager, listener)
{
	if (oFF.isNull(application))
	{
		throw oFF.XException.createRuntimeException("Cannot create a Open Query Dialog instance without an application. Please sepcify a application!");
	}
	if (oFF.isNull(uiManager))
	{
		throw oFF.XException.createRuntimeException("Cannot create a Open Query Dialog instance without a uiManager. Please sepcify a uiManager!");
	}
	this.m_application = application;
	this.m_uiManager = uiManager;
	this.m_listener = listener;
	this.m_fullQueryNames = oFF.XHashMapOfStringByString.create();
	var i18n = this.m_uiManager.getLocalization();
	var freeGenesis = this.m_uiManager.getFreeGenesis();
	this.m_openQueryDialog = freeGenesis.newControl(oFF.UiType.DIALOG);
	this.m_openQueryDialog.setName("OpenQueryDialog");
	this.m_openQueryDialog.setTitle(i18n.getText(oFF.OpenQueryDialogI18n.I18N_OD_TITLE));
	this.m_openQueryDialog.setHeight(oFF.UiCssLength.createExt(50, oFF.UiCssSizeUnit.PERCENT));
	this.m_openQueryDialog.setWidth(oFF.UiCssLength.createExt(800, oFF.UiCssSizeUnit.PIXEL));
	this.m_openQueryDialog.setPadding(oFF.UiCssBoxEdges.create("20px"));
	this.m_openQueryDialog.registerOnBeforeOpen(this);
	this.m_openQueryDialog.registerOnAfterOpen(this);
	this.m_cancelBtn = this.m_openQueryDialog.addNewDialogButton();
	this.m_cancelBtn.setText(i18n.getText(oFF.OlapUiI18n.I18N_CANCEL));
	this.m_cancelBtn.setName("OpenQueryDialogCancelBtn");
	this.m_cancelBtn.registerOnPress(this);
	this.createDialogContent(this.m_openQueryDialog, i18n);
};
oFF.OqdController.prototype.createDialogContent = function(dialog, i18n)
{
	var aMainLayout = dialog.setNewContent(oFF.UiType.FLEX_LAYOUT);
	aMainLayout.setHeight(oFF.UiCssLength.create("100%"));
	aMainLayout.setDirection(oFF.UiFlexDirection.COLUMN);
	var aHeaderLayout = aMainLayout.addNewItemOfType(oFF.UiType.FLEX_LAYOUT);
	aHeaderLayout.setHeight(oFF.UiCssLength.create("40px"));
	aHeaderLayout.setAlignItems(oFF.UiFlexAlignItems.CENTER);
	aHeaderLayout.setJustifyContent(oFF.UiFlexJustifyContent.SPACE_BETWEEN);
	var aHeaderTitleLabel = aHeaderLayout.addNewItemOfType(oFF.UiType.LABEL);
	aHeaderTitleLabel.setText(i18n.getText(oFF.OpenQueryDialogI18n.I18N_OD_QUERIES));
	aHeaderTitleLabel.setFontSize(oFF.UiCssLength.create("20px"));
	var aSearchSectionLayout = aHeaderLayout.addNewItemOfType(oFF.UiType.HORIZONTAL_LAYOUT);
	this.m_systemsCombobox = aSearchSectionLayout.addNewItemOfType(oFF.UiType.COMBO_BOX);
	this.m_systemsCombobox.setWidth(oFF.UiCssLength.create("230px"));
	var aSysList = this.m_application.getSystemLandscape().getSystemNames();
	var aMasterName = this.m_application.getSystemLandscape().getMasterSystemName();
	for (var aIndex = 0; aIndex < aSysList.size(); ++aIndex)
	{
		var aSys = aSysList.get(aIndex);
		var aItem = this.m_systemsCombobox.addNewItem();
		aItem.setName(oFF.XString.toLowerCase(aSys));
		aItem.setText(aSys);
		if (oFF.XString.isEqual(aSys, aMasterName))
		{
			this.m_systemsCombobox.setSelectedItem(aItem);
		}
	}
	var aSystemDdSearchSpacer = aSearchSectionLayout.addNewItemOfType(oFF.UiType.SPACER);
	aSystemDdSearchSpacer.setWidth(oFF.UiCssLength.create("10px"));
	this.m_searchInput = aSearchSectionLayout.addNewItemOfType(oFF.UiType.SEARCH_FIELD);
	this.m_searchInput.setWidth(oFF.UiCssLength.create("230px"));
	this.m_searchInput.setPlaceholder(i18n.getText(oFF.OpenQueryDialogI18n.I18N_OD_SEARCH_DESCR_PLACEHOLDER));
	this.m_searchInput.setTooltip(i18n.getText(oFF.OpenQueryDialogI18n.I18N_OD_SEARCH));
	this.m_searchInput.registerOnSearch(this);
	this.m_queryListTable = aMainLayout.addNewItemOfType(oFF.UiType.TABLE);
	this.m_queryListTable.setWidth(oFF.UiCssLength.create("100%"));
	this.m_queryListTable.setHeight(oFF.UiCssLength.create("100%"));
	this.m_queryListTable.setFlex("auto");
	this.m_queryListTable.setVisibleRowCountMode(oFF.UiVisibleRowCountMode.AUTO);
	this.m_queryListTable.setMinRowCount(2);
	this.m_queryListTable.setSelectionBehavior(oFF.UiSelectionBehavior.ROW_ONLY);
	this.m_queryListTable.setSelectionMode(oFF.UiSelectionMode.SINGLE_SELECT);
	this.m_queryListTable.registerOnSelect(this);
	this.m_queryListTable.addNewColumn().setTitle(i18n.getText(oFF.OpenQueryDialogI18n.I18N_OD_KEY));
	this.m_queryListTable.addNewColumn().setTitle(i18n.getText(oFF.OpenQueryDialogI18n.I18N_OD_DESCRIPTION));
};
oFF.OqdController.prototype.releaseObject = function()
{
	this.m_application = null;
	this.m_uiManager = null;
	this.m_listener = null;
	this.m_openQueryDialog = oFF.XObjectExt.release(this.m_openQueryDialog);
	this.m_fullQueryNames = oFF.XObjectExt.release(this.m_fullQueryNames);
	this.m_cancelBtn = oFF.XObjectExt.release(this.m_cancelBtn);
	this.m_systemsCombobox = oFF.XObjectExt.release(this.m_systemsCombobox);
	this.m_queryListTable = oFF.XObjectExt.release(this.m_queryListTable);
	this.m_searchInput = oFF.XObjectExt.release(this.m_searchInput);
	oFF.XObject.prototype.releaseObject.call( this );
};
oFF.OqdController.prototype.isOpen = function()
{
	return this.m_openQueryDialog.isOpen();
};
oFF.OqdController.prototype.open = function()
{
	this.m_openQueryDialog.open();
};
oFF.OqdController.prototype.close = function()
{
	this.m_openQueryDialog.close();
};
oFF.OqdController.prototype.onBeforeOpen = function(event)
{
	this.search();
};
oFF.OqdController.prototype.onAfterOpen = function(event) {};
oFF.OqdController.prototype.onPress = function(event)
{
	this.m_openQueryDialog.close();
	if (oFF.notNull(this.m_listener))
	{
		this.m_listener.onQuerySelectCancel();
	}
};
oFF.OqdController.prototype.onSelect = function(event)
{
	this.m_openQueryDialog.close();
	if (oFF.notNull(this.m_listener))
	{
		var systemName = this.m_systemsCombobox.getSelectedItem().getText();
		var queryName = event.getSelectedItem().getCell(0).getText();
		var fullQueryName = this.m_fullQueryNames.getByKey(queryName);
		this.m_listener.onQuerySelect(systemName, queryName, fullQueryName);
	}
};
oFF.OqdController.prototype.onSearch = function(event)
{
	this.search();
};
oFF.OqdController.prototype.search = function()
{
	var serviceConfig = oFF.OlapCatalogApiModule.SERVICE_TYPE_OLAP_CATALOG.createServiceConfig(this.m_application);
	if (this.m_systemsCombobox.getSelectedItem() === null)
	{
		return;
	}
	this.m_queryListTable.setBusy(true);
	serviceConfig.setSystemName(this.m_systemsCombobox.getSelectedItem().getText());
	serviceConfig.processOlapCatalogManagerCreation(oFF.SyncType.NON_BLOCKING, this, null);
};
oFF.OqdController.prototype.onOlapCatalogManagerCreated = function(extResult, olapCatalogManager, customIdentifier)
{
	if (extResult.hasErrors())
	{
		throw oFF.XException.createRuntimeException(extResult.getSummary());
	}
	var catalogManager = extResult.getData();
	catalogManager.setResultOffset(0);
	catalogManager.setResultMaxSize(10000);
	catalogManager.setSelectedType(oFF.MetaObjectType.QUERY);
	if (this.m_searchInput.getText() !== null && oFF.XString.compare(this.m_searchInput.getText(), "") !== 0)
	{
		catalogManager.setSearchOnText(true);
		catalogManager.setSearchFilter(oFF.XStringUtils.concatenate2(this.m_searchInput.getText(), "*"));
	}
	catalogManager.processGetResult(oFF.SyncType.NON_BLOCKING, this, null);
};
oFF.OqdController.prototype.onOlapCatalogResult = function(extResult, result, customIdentifier)
{
	if (extResult.hasErrors())
	{
		throw oFF.XException.createRuntimeException(extResult.getSummary());
	}
	this.m_queryListTable.clearRows();
	this.m_fullQueryNames.clear();
	var catalogItems = result.getObjectsList();
	for (var i = 0; i < catalogItems.size(); i++)
	{
		var tmpCatalogItem = catalogItems.get(i);
		var aRow = this.m_queryListTable.addNewRow();
		aRow.addNewCell().setText(tmpCatalogItem.getName());
		aRow.addNewCell().setText(tmpCatalogItem.getText());
		this.m_fullQueryNames.put(tmpCatalogItem.getName(), tmpCatalogItem.getFullQualifiedName());
	}
	this.m_queryListTable.setBusy(false);
};

oFF.SuTextEntryDialog = function() {};
oFF.SuTextEntryDialog.prototype = new oFF.XObject();
oFF.SuTextEntryDialog.prototype._ff_c = "SuTextEntryDialog";

oFF.SuTextEntryDialog.createDialog = function(genesis, title, codeType, text, listener)
{
	if (oFF.isNull(genesis))
	{
		throw oFF.XException.createRuntimeException("Cannot create a Chiron dialog instance without a genesis. Please sepcify a genesis!");
	}
	var newDialog = new oFF.SuTextEntryDialog();
	newDialog.setupDialog(genesis, title, codeType, text, listener);
	return newDialog;
};
oFF.SuTextEntryDialog.prototype.m_textEntryDialog = null;
oFF.SuTextEntryDialog.prototype.m_codeEditor = null;
oFF.SuTextEntryDialog.prototype.m_genesis = null;
oFF.SuTextEntryDialog.prototype.m_title = null;
oFF.SuTextEntryDialog.prototype.m_codeType = null;
oFF.SuTextEntryDialog.prototype.m_text = null;
oFF.SuTextEntryDialog.prototype.m_listener = null;
oFF.SuTextEntryDialog.prototype.releaseObject = function()
{
	this.m_codeEditor = oFF.XObjectExt.release(this.m_codeEditor);
	this.m_textEntryDialog = oFF.XObjectExt.release(this.m_textEntryDialog);
	this.m_listener = oFF.XObjectExt.release(this.m_listener);
	this.m_genesis = null;
	oFF.XObject.prototype.releaseObject.call( this );
};
oFF.SuTextEntryDialog.prototype.setupDialog = function(genesis, title, codeType, text, listener)
{
	this.m_genesis = genesis;
	this.m_title = title;
	this.m_codeType = codeType;
	this.m_text = text;
	this.m_listener = listener;
	if (oFF.XStringUtils.isNullOrEmpty(this.m_title))
	{
		this.m_title = "Text entry";
	}
	if (oFF.XStringUtils.isNullOrEmpty(this.m_codeType))
	{
		this.m_codeType = "text";
	}
	this.buildDialogUi(this.m_genesis);
};
oFF.SuTextEntryDialog.prototype.buildDialogUi = function(genesis)
{
	this.m_textEntryDialog = this.m_genesis.newControl(oFF.UiType.DIALOG);
	this.m_textEntryDialog.setName("chironTextEntryDialog");
	this.m_textEntryDialog.setTitle(this.m_title);
	this.m_textEntryDialog.setWidth(oFF.UiCssLength.create("70vw"));
	this.m_textEntryDialog.setHeight(oFF.UiCssLength.create("60vh"));
	this.m_textEntryDialog.setPadding(oFF.UiCssBoxEdges.create("20px"));
	this.m_textEntryDialog.registerOnAfterOpen(this);
	var closeDialogBtn = this.m_textEntryDialog.addNewDialogButton();
	closeDialogBtn.setName("closeTextEntryDialogBtn");
	closeDialogBtn.setText("Close");
	closeDialogBtn.registerOnPress(this);
	var applyDialogBtn = this.m_textEntryDialog.addNewDialogButton();
	applyDialogBtn.setName("applyTextEntryDialogBtn");
	applyDialogBtn.setText("Apply");
	applyDialogBtn.setButtonType(oFF.UiButtonType.PRIMARY);
	applyDialogBtn.registerOnPress(this);
	this.m_codeEditor = this.m_textEntryDialog.setNewContent(oFF.UiType.CODE_EDITOR);
	this.m_codeEditor.setName("textEntryDialogCodeEditor");
	this.m_codeEditor.setWidth(oFF.UiCssLength.create("100%"));
	this.m_codeEditor.setHeight(oFF.UiCssLength.create("100%"));
	this.m_codeEditor.setCodeType(this.m_codeType);
	this.m_codeEditor.setText(this.m_text);
};
oFF.SuTextEntryDialog.prototype.openDialog = function()
{
	this.m_textEntryDialog.open();
};
oFF.SuTextEntryDialog.prototype.onPress = function(event)
{
	var name = event.getControl().getName();
	if (oFF.XString.isEqual("closeTextEntryDialogBtn", name))
	{
		this.m_textEntryDialog.close();
		if (oFF.notNull(this.m_listener))
		{
			this.m_listener.onTextEntryCancel();
		}
	}
	if (oFF.XString.isEqual("applyTextEntryDialogBtn", name))
	{
		this.m_textEntryDialog.close();
		if (oFF.notNull(this.m_listener))
		{
			this.m_listener.onTextEntryFinished(this.m_codeEditor.getText());
		}
	}
};
oFF.SuTextEntryDialog.prototype.onAfterOpen = function(event)
{
	this.m_codeEditor.focus();
};

oFF.FilterDialogProgramLayout = function() {};
oFF.FilterDialogProgramLayout.prototype = new oFF.XObject();
oFF.FilterDialogProgramLayout.prototype._ff_c = "FilterDialogProgramLayout";

oFF.FilterDialogProgramLayout.create = function(genesis, toolbar, onPressListener, onSelectListener)
{
	var layout = new oFF.FilterDialogProgramLayout();
	layout.m_genesis = genesis;
	layout.m_toolbar = toolbar;
	layout.m_onPressListener = onPressListener;
	layout.m_onSelectListener = onSelectListener;
	return layout;
};
oFF.FilterDialogProgramLayout.prototype.m_genesis = null;
oFF.FilterDialogProgramLayout.prototype.m_toolbar = null;
oFF.FilterDialogProgramLayout.prototype.m_onPressListener = null;
oFF.FilterDialogProgramLayout.prototype.m_onSelectListener = null;
oFF.FilterDialogProgramLayout.prototype.m_changeDataSourceBtn = null;
oFF.FilterDialogProgramLayout.prototype.m_editToggleBtn = null;
oFF.FilterDialogProgramLayout.prototype.m_setVariablesBtn = null;
oFF.FilterDialogProgramLayout.prototype.m_openFilterDialogBtn = null;
oFF.FilterDialogProgramLayout.prototype.m_dataObjectDimensionRadioBtn = null;
oFF.FilterDialogProgramLayout.prototype.m_dataObjectVariableRadioBtn = null;
oFF.FilterDialogProgramLayout.prototype.m_dimensionDropdown = null;
oFF.FilterDialogProgramLayout.prototype.m_variableDropdown = null;
oFF.FilterDialogProgramLayout.prototype.m_hierarchyInput = null;
oFF.FilterDialogProgramLayout.prototype.m_entryPointDefaultRadioBtn = null;
oFF.FilterDialogProgramLayout.prototype.m_entryPointSacRadioBtn = null;
oFF.FilterDialogProgramLayout.prototype.m_useDynamicFilterCheckbox = null;
oFF.FilterDialogProgramLayout.prototype.m_displayInfoDropdown = null;
oFF.FilterDialogProgramLayout.prototype.m_pageSizeInput = null;
oFF.FilterDialogProgramLayout.prototype.m_multiSelectionModeCheckbox = null;
oFF.FilterDialogProgramLayout.prototype.m_showSelectionContainerCheckBox = null;
oFF.FilterDialogProgramLayout.prototype.m_nonBlockingCheckbox = null;
oFF.FilterDialogProgramLayout.prototype.m_selectionTextArea = null;
oFF.FilterDialogProgramLayout.prototype.m_outputTextArea = null;
oFF.FilterDialogProgramLayout.prototype.m_featureToggleReadMode = null;
oFF.FilterDialogProgramLayout.prototype.releaseObject = function()
{
	oFF.XObject.prototype.releaseObject.call( this );
	this.m_genesis = null;
	this.m_toolbar = null;
	this.m_onPressListener = null;
	this.m_onSelectListener = null;
	this.m_changeDataSourceBtn = oFF.XObjectExt.release(this.m_changeDataSourceBtn);
	this.m_editToggleBtn = oFF.XObjectExt.release(this.m_editToggleBtn);
	this.m_setVariablesBtn = oFF.XObjectExt.release(this.m_setVariablesBtn);
	this.m_openFilterDialogBtn = oFF.XObjectExt.release(this.m_openFilterDialogBtn);
	this.m_dimensionDropdown = oFF.XObjectExt.release(this.m_dimensionDropdown);
	this.m_variableDropdown = oFF.XObjectExt.release(this.m_variableDropdown);
	this.m_dataObjectDimensionRadioBtn = oFF.XObjectExt.release(this.m_dataObjectDimensionRadioBtn);
	this.m_dataObjectVariableRadioBtn = oFF.XObjectExt.release(this.m_dataObjectVariableRadioBtn);
	this.m_hierarchyInput = oFF.XObjectExt.release(this.m_hierarchyInput);
	this.m_entryPointDefaultRadioBtn = oFF.XObjectExt.release(this.m_entryPointDefaultRadioBtn);
	this.m_entryPointSacRadioBtn = oFF.XObjectExt.release(this.m_entryPointSacRadioBtn);
	this.m_useDynamicFilterCheckbox = oFF.XObjectExt.release(this.m_useDynamicFilterCheckbox);
	this.m_displayInfoDropdown = oFF.XObjectExt.release(this.m_displayInfoDropdown);
	this.m_pageSizeInput = oFF.XObjectExt.release(this.m_pageSizeInput);
	this.m_multiSelectionModeCheckbox = oFF.XObjectExt.release(this.m_multiSelectionModeCheckbox);
	this.m_showSelectionContainerCheckBox = oFF.XObjectExt.release(this.m_showSelectionContainerCheckBox);
	this.m_nonBlockingCheckbox = oFF.XObjectExt.release(this.m_nonBlockingCheckbox);
	this.m_selectionTextArea = oFF.XObjectExt.release(this.m_selectionTextArea);
	this.m_outputTextArea = oFF.XObjectExt.release(this.m_outputTextArea);
	this.m_featureToggleReadMode = oFF.XObjectExt.release(this.m_featureToggleReadMode);
};
oFF.FilterDialogProgramLayout.prototype.showActivityIndicator = function()
{
	this.m_genesis.clearUi();
	this.m_genesis.newRoot(oFF.UiType.ACTIVITY_INDICATOR).useMaxSpace();
};
oFF.FilterDialogProgramLayout.prototype.showErrorToast = function(message)
{
	var toast = this.m_genesis.newControl(oFF.UiType.TOAST);
	toast.setText(message);
	toast.setMessageType(oFF.UiMessageType.ERROR);
	toast.open();
};
oFF.FilterDialogProgramLayout.prototype.showUi = function(queryManager, queryText, dimension, hierarchy, variable)
{
	this.m_genesis.clearUi();
	this.setupToolbar(queryManager, queryText);
	var root = this.m_genesis.newControl(oFF.UiType.FLEX_LAYOUT);
	root.setDirection(oFF.UiFlexDirection.COLUMN);
	this.m_genesis.setRoot(root);
	root.addNewItemOfType(oFF.UiType.SPACER).setHeight(oFF.UiCssLength.create("5px"));
	this.m_openFilterDialogBtn = root.addNewItemOfType(oFF.UiType.BUTTON);
	this.m_openFilterDialogBtn.setName("openBtn").setText("Open Filter Dialog").setButtonType(oFF.UiButtonType.PRIMARY);
	this.m_openFilterDialogBtn.registerOnPress(this.m_onPressListener);
	root.addNewItemOfType(oFF.UiType.SPACER).setHeight(oFF.UiCssLength.create("5px"));
	var configLayout = root.addNewItemOfType(oFF.UiType.FLEX_LAYOUT);
	configLayout.setDirection(oFF.UiFlexDirection.ROW);
	configLayout.setJustifyContent(oFF.UiFlexJustifyContent.SPACE_BETWEEN);
	configLayout.setPadding(oFF.UiCssBoxEdges.create("5px"));
	configLayout.setFlex("1 0 auto");
	this.setupLeftLayout(configLayout, queryManager, dimension, hierarchy, variable);
	configLayout.addNewItemOfType(oFF.UiType.SPACER).setWidth(oFF.UiCssLength.create("20px"));
	this.setupRightLayout(configLayout);
};
oFF.FilterDialogProgramLayout.prototype.setupToolbar = function(queryManager, queryText)
{
	this.m_toolbar.clearItems();
	this.m_changeDataSourceBtn = this.m_toolbar.addNewItemOfType(oFF.UiType.BUTTON);
	this.m_changeDataSourceBtn.setName("changeDataSourceBtn").setText(queryText);
	this.m_changeDataSourceBtn.registerOnPress(this.m_onPressListener);
	this.m_editToggleBtn = this.m_toolbar.addNewItemOfType(oFF.UiType.BUTTON);
	this.m_editToggleBtn.setName("editTogglesBtn").setText("Edit Feature Toggles");
	this.m_editToggleBtn.registerOnPress(this.m_onPressListener);
	this.m_setVariablesBtn = this.m_toolbar.addNewItemOfType(oFF.UiType.BUTTON);
	this.m_setVariablesBtn.setName("setVariablesBtn").setText("Set variables");
	this.m_setVariablesBtn.registerOnPress(this.m_onPressListener);
	this.m_setVariablesBtn.setEnabled(queryManager.hasVariables());
};
oFF.FilterDialogProgramLayout.prototype.setupLeftLayout = function(parent, queryManager, dimension, hierarchy, variable)
{
	var left = parent.addNewItemOfType(oFF.UiType.FLEX_LAYOUT);
	left.setDirection(oFF.UiFlexDirection.COLUMN);
	left.setWidth(oFF.UiCssLength.create("35%"));
	this.addSectionLabel(left, "Data Object", false);
	var hasVariables = oFF.notNull(queryManager) && queryManager.hasVariables();
	var dataObjectGroup = left.addNewItemOfType(oFF.UiType.RADIO_BUTTON_GROUP);
	dataObjectGroup.setColumnCount(2);
	this.m_dataObjectDimensionRadioBtn = dataObjectGroup.addNewRadioButton();
	this.m_dataObjectDimensionRadioBtn.setName("dataObjectDimension").setText("Dimension");
	this.m_dataObjectDimensionRadioBtn.registerOnChange(this);
	this.m_dataObjectDimensionRadioBtn.setSelected(oFF.XStringUtils.isNotNullAndNotEmpty(dimension) || !hasVariables || oFF.XStringUtils.isNullOrEmpty(variable));
	this.m_dimensionDropdown = this.createItem(left, "Dimension", oFF.UiType.DROPDOWN);
	this.m_dimensionDropdown.registerOnSelect(this.m_onSelectListener);
	this.m_dimensionDropdown.getParent().setVisible(this.m_dataObjectDimensionRadioBtn.isSelected());
	this.fillDimensionDropdown(queryManager, dimension);
	this.m_hierarchyInput = this.createItem(left, "Hierarchy", oFF.UiType.INPUT);
	this.m_hierarchyInput.setText(hierarchy);
	this.m_hierarchyInput.getParent().setVisible(this.m_dataObjectDimensionRadioBtn.isSelected());
	this.m_dataObjectVariableRadioBtn = dataObjectGroup.addNewRadioButton();
	this.m_dataObjectVariableRadioBtn.setName("dataObjectVariable").setText("Variable");
	this.m_dataObjectVariableRadioBtn.registerOnChange(this);
	this.m_dataObjectVariableRadioBtn.setEnabled(hasVariables);
	if (!this.m_dataObjectDimensionRadioBtn.isSelected())
	{
		this.m_dataObjectVariableRadioBtn.setSelected(true);
	}
	this.m_variableDropdown = this.createItem(left, "Variable", oFF.UiType.DROPDOWN);
	this.m_variableDropdown.registerOnSelect(this.m_onSelectListener);
	this.m_variableDropdown.getParent().setVisible(this.m_dataObjectVariableRadioBtn.isSelected());
	this.fillVariableDropdown(queryManager, variable);
	this.addSectionLabel(left, "Entry Point", true);
	var entryPointGroup = left.addNewItemOfType(oFF.UiType.RADIO_BUTTON_GROUP);
	entryPointGroup.setColumnCount(2);
	this.m_entryPointDefaultRadioBtn = entryPointGroup.addNewRadioButton();
	this.m_entryPointDefaultRadioBtn.setName("entryPointDefault").setText("Default");
	this.m_entryPointDefaultRadioBtn.registerOnChange(this);
	this.m_entryPointDefaultRadioBtn.setSelected(true);
	this.m_useDynamicFilterCheckbox = this.createItem(left, "Use Dynamic Filter", oFF.UiType.CHECKBOX);
	this.m_entryPointSacRadioBtn = entryPointGroup.addNewRadioButton();
	this.m_entryPointSacRadioBtn.setName("entryPointSac").setText("SAC");
	this.m_entryPointSacRadioBtn.registerOnChange(this);
	this.addSectionLabel(left, "Filter Dialog Configuration", true);
	this.m_displayInfoDropdown = this.createItem(left, "Display Info", oFF.UiType.DROPDOWN);
	this.m_displayInfoDropdown.addNewItem().setText("Dimension default");
	this.m_displayInfoDropdown.addNewItem().setText("Description").setCustomObject(oFF.FdDimensionDisplayInfo.DESCRIPTION);
	this.m_displayInfoDropdown.addNewItem().setText("ID").setCustomObject(oFF.FdDimensionDisplayInfo.ID);
	this.m_displayInfoDropdown.addNewItem().setText("ID and Description").setCustomObject(oFF.FdDimensionDisplayInfo.ID_AND_DESCRIPTION);
	this.m_pageSizeInput = this.createItem(left, "Page Size", oFF.UiType.INPUT);
	this.m_pageSizeInput.setText(oFF.XInteger.convertToString(oFF.FdConfiguration.DEFAULT_PAGE_SIZE));
	this.m_multiSelectionModeCheckbox = this.createItem(left, "MultiSelect", oFF.UiType.CHECKBOX).setChecked(true);
	this.m_showSelectionContainerCheckBox = this.createItem(left, "Show Selection Container", oFF.UiType.CHECKBOX).setChecked(false);
	this.m_nonBlockingCheckbox = this.createItem(left, "NonBlocking", oFF.UiType.CHECKBOX);
	this.m_featureToggleReadMode = this.createItem(left, "ReadModeSwitch", oFF.UiType.CHECKBOX).setChecked(true);
};
oFF.FilterDialogProgramLayout.prototype.addSectionLabel = function(left, label, showSpacer)
{
	if (showSpacer)
	{
		left.addNewItemOfType(oFF.UiType.SPACER);
	}
	left.addNewItemOfType(oFF.UiType.LABEL).setText(label).setFontWeight(oFF.UiFontWeight.BOLD).setHeight(oFF.UiCssLength.create("20px"));
};
oFF.FilterDialogProgramLayout.prototype.createItem = function(parent, name, type)
{
	var container = parent.addNewItemOfType(oFF.UiType.FLEX_LAYOUT);
	container.setDirection(oFF.UiFlexDirection.ROW);
	container.setAlignItems(oFF.UiFlexAlignItems.CENTER);
	container.addNewItemOfType(oFF.UiType.LABEL).setText(name).setWidth(oFF.UiCssLength.create("180px"));
	return container.addNewItemOfType(type).useMaxWidth().setName(oFF.XString.replace(name, " ", ""));
};
oFF.FilterDialogProgramLayout.prototype.fillDimensionDropdown = function(queryManager, dimensionName)
{
	this.m_dimensionDropdown.clearItems();
	if (oFF.notNull(queryManager))
	{
		var dimensions = queryManager.getDimensionAccessor().getDimensions();
		for (var i = 0; i < dimensions.size(); i++)
		{
			var dimension = dimensions.get(i);
			if (!dimension.isUniversalDisplayHierarchyDimension())
			{
				this.m_dimensionDropdown.addNewItem().setName(dimension.getName()).setText(dimension.getName());
			}
		}
		var dim = dimensionName;
		if (oFF.XStringUtils.isNullOrEmpty(dim) || queryManager.getDimensionAccessor().getDimensionByName(dim) === null)
		{
			dim = dimensions.get(0).getName();
		}
		this.m_dimensionDropdown.setSelectedName(dim);
	}
};
oFF.FilterDialogProgramLayout.prototype.fillVariableDropdown = function(queryManager, variableName)
{
	this.m_variableDropdown.clearItems();
	if (oFF.notNull(queryManager) && queryManager.hasVariables())
	{
		var variables = queryManager.getInputEnabledAndNonTechnicalVariables();
		for (var i = 0; i < variables.size(); i++)
		{
			var variable = variables.get(i);
			this.m_variableDropdown.addNewItem().setName(variable.getName()).setText(variable.getName());
		}
		var _var = variableName;
		if (oFF.XStringUtils.isNullOrEmpty(_var) || queryManager.getVariable(_var) === null)
		{
			_var = variables.get(0).getName();
		}
		this.m_variableDropdown.setSelectedName(_var);
	}
};
oFF.FilterDialogProgramLayout.prototype.onChange = function(event)
{
	this.m_useDynamicFilterCheckbox.getParent().setVisible(this.m_entryPointDefaultRadioBtn.isSelected());
	this.m_dimensionDropdown.getParent().setVisible(this.m_dataObjectDimensionRadioBtn.isSelected());
	this.m_hierarchyInput.getParent().setVisible(this.m_dataObjectDimensionRadioBtn.isSelected());
	this.m_variableDropdown.getParent().setVisible(this.m_dataObjectVariableRadioBtn.isSelected());
	this.m_displayInfoDropdown.getParent().setVisible(!this.m_entryPointSacRadioBtn.isSelected());
	this.m_pageSizeInput.getParent().setVisible(!this.m_entryPointSacRadioBtn.isSelected());
	this.m_multiSelectionModeCheckbox.getParent().setVisible(!this.m_entryPointSacRadioBtn.isSelected());
	this.m_showSelectionContainerCheckBox.getParent().setVisible(!this.m_entryPointSacRadioBtn.isSelected());
};
oFF.FilterDialogProgramLayout.prototype.setupRightLayout = function(parent)
{
	var right = parent.addNewItemOfType(oFF.UiType.FLEX_LAYOUT);
	right.setDirection(oFF.UiFlexDirection.COLUMN);
	right.setWidth(oFF.UiCssLength.create("65%"));
	var textArea1Container = right.addNewItemOfType(oFF.UiType.FLEX_LAYOUT);
	textArea1Container.setDirection(oFF.UiFlexDirection.COLUMN);
	textArea1Container.setFlex("1 1 auto");
	textArea1Container.addNewItemOfType(oFF.UiType.LABEL).setText("Selection:").setHeight(oFF.UiCssLength.create("20px"));
	this.m_selectionTextArea = textArea1Container.addNewItemOfType(oFF.UiType.TEXT_AREA);
	this.m_selectionTextArea.setName("SelectionData");
	this.m_selectionTextArea.setBackgroundColor(oFF.UiColor.WHITE);
	this.m_selectionTextArea.setSize(oFF.UiSize.createByCss("100%", "100%"));
	right.addNewItemOfType(oFF.UiType.SPACER);
	var textArea2Container = right.addNewItemOfType(oFF.UiType.FLEX_LAYOUT);
	textArea2Container.setDirection(oFF.UiFlexDirection.COLUMN);
	textArea2Container.setFlex("4 1 auto");
	textArea2Container.addNewItemOfType(oFF.UiType.LABEL).setText("Output:").setHeight(oFF.UiCssLength.create("20px"));
	this.m_outputTextArea = textArea2Container.addNewItemOfType(oFF.UiType.TEXT_AREA);
	this.m_outputTextArea.setName("OutputData");
	this.m_outputTextArea.setBackgroundColor(oFF.UiColor.WHITE);
	this.m_outputTextArea.setSize(oFF.UiSize.createByCss("100%", "100%"));
};
oFF.FilterDialogProgramLayout.prototype.showChangeDataSourceButton = function()
{
	this.m_genesis.clearUi();
	this.m_changeDataSourceBtn = this.m_genesis.newControl(oFF.UiType.BUTTON);
	this.m_changeDataSourceBtn.setName("changeDataSourceBtn").setText("Change data source").useMaxSpace();
	this.m_changeDataSourceBtn.registerOnPress(this.m_onPressListener);
	this.m_genesis.setRoot(this.m_changeDataSourceBtn);
};
oFF.FilterDialogProgramLayout.prototype.getOpenFilterDialogBtn = function()
{
	return this.m_openFilterDialogBtn;
};
oFF.FilterDialogProgramLayout.prototype.getChangeDataSourceBtn = function()
{
	return this.m_changeDataSourceBtn;
};
oFF.FilterDialogProgramLayout.prototype.getFeatureTogglesBtn = function()
{
	return this.m_editToggleBtn;
};
oFF.FilterDialogProgramLayout.prototype.getSetVariablesBtn = function()
{
	return this.m_setVariablesBtn;
};
oFF.FilterDialogProgramLayout.prototype.getDataObjectDimensionRadioBtn = function()
{
	return this.m_dataObjectDimensionRadioBtn;
};
oFF.FilterDialogProgramLayout.prototype.getDataObjectVariableRadioBtn = function()
{
	return this.m_dataObjectVariableRadioBtn;
};
oFF.FilterDialogProgramLayout.prototype.getDimensionDropdown = function()
{
	return this.m_dimensionDropdown;
};
oFF.FilterDialogProgramLayout.prototype.getVariableDropdown = function()
{
	return this.m_variableDropdown;
};
oFF.FilterDialogProgramLayout.prototype.getHierarchyInput = function()
{
	return this.m_hierarchyInput;
};
oFF.FilterDialogProgramLayout.prototype.getDisplayInfoDropdown = function()
{
	return this.m_displayInfoDropdown;
};
oFF.FilterDialogProgramLayout.prototype.getPageSizeInput = function()
{
	return this.m_pageSizeInput;
};
oFF.FilterDialogProgramLayout.prototype.getMultiSelectionModeCheckbox = function()
{
	return this.m_multiSelectionModeCheckbox;
};
oFF.FilterDialogProgramLayout.prototype.getShowSelectionContainerCheckBox = function()
{
	return this.m_showSelectionContainerCheckBox;
};
oFF.FilterDialogProgramLayout.prototype.getNonBlockingCheckbox = function()
{
	return this.m_nonBlockingCheckbox;
};
oFF.FilterDialogProgramLayout.prototype.getUseDynamicFilterCheckbox = function()
{
	return this.m_useDynamicFilterCheckbox;
};
oFF.FilterDialogProgramLayout.prototype.getEntryPointDefaultRadioBtn = function()
{
	return this.m_entryPointDefaultRadioBtn;
};
oFF.FilterDialogProgramLayout.prototype.getEntryPointSacRadioBtn = function()
{
	return this.m_entryPointSacRadioBtn;
};
oFF.FilterDialogProgramLayout.prototype.getSelectionTextArea = function()
{
	return this.m_selectionTextArea;
};
oFF.FilterDialogProgramLayout.prototype.getOutputTextArea = function()
{
	return this.m_outputTextArea;
};
oFF.FilterDialogProgramLayout.prototype.getFeatureToggleReadMode = function()
{
	return this.m_featureToggleReadMode;
};

oFF.AuGdsQdHomeView = function() {};
oFF.AuGdsQdHomeView.prototype = new oFF.XObject();
oFF.AuGdsQdHomeView.prototype._ff_c = "AuGdsQdHomeView";

oFF.AuGdsQdHomeView.GDS_HW_LARGE_FONT_SIZE = "22px";
oFF.AuGdsQdHomeView.GDS_HW_MIDDLE_FONT_SIZE = "16px";
oFF.AuGdsQdHomeView.GDS_HW_SMALL_FONT_SIZE = "14px";
oFF.AuGdsQdHomeView.GDS_HW_WELCOME_BG = "#eff4f9";
oFF.AuGdsQdHomeView.GDS_HW_SELECTION_ICON_FONT_SIZE = "42px";
oFF.AuGdsQdHomeView.GDS_HW_SELECTION_ICON_COLOR = "#bfbfbf";
oFF.AuGdsQdHomeView.GDS_HW_SELECTION_TILE_MARGIN = "8px 24px 8px 1px";
oFF.AuGdsQdHomeView.GDS_HW_SELECT_DATA_SOURCE_TILE = "gdsHvSelectDataSourceTile";
oFF.AuGdsQdHomeView.GDS_HW_SELECT_FROM_MODEK_TILE = "gdsHvSelectFromModelTile";
oFF.AuGdsQdHomeView.GDS_HW_RECENT_FILES_TABLE_NAME = "gdsHvRecentFileTable";
oFF.AuGdsQdHomeView.GDS_HW_RECENT_FILES_ITEM_TAG = "gdsHvRecentFileItem";
oFF.AuGdsQdHomeView.create = function(genesis, listener)
{
	var newView = new oFF.AuGdsQdHomeView();
	if (oFF.isNull(genesis))
	{
		throw oFF.XException.createIllegalStateException("Missing genesis object! Cannot create a gds home view!");
	}
	newView.setupInternal(genesis, listener);
	return newView;
};
oFF.AuGdsQdHomeView.prototype.m_genesis = null;
oFF.AuGdsQdHomeView.prototype.m_listener = null;
oFF.AuGdsQdHomeView.prototype.m_mainView = null;
oFF.AuGdsQdHomeView.prototype.m_recentFileTable = null;
oFF.AuGdsQdHomeView.prototype.m_recentFileLabel = null;
oFF.AuGdsQdHomeView.prototype.releaseObject = function()
{
	this.m_genesis = null;
	this.m_listener = null;
	this.m_recentFileTable = oFF.XObjectExt.release(this.m_recentFileTable);
	this.m_recentFileLabel = oFF.XObjectExt.release(this.m_recentFileLabel);
	this.m_mainView = oFF.XObjectExt.release(this.m_mainView);
	oFF.XObject.prototype.releaseObject.call( this );
};
oFF.AuGdsQdHomeView.prototype.setupInternal = function(genesis, listener)
{
	this.m_genesis = genesis;
	this.m_listener = listener;
	this.prepareUi(genesis);
};
oFF.AuGdsQdHomeView.prototype.getGenesis = function()
{
	return this.m_genesis;
};
oFF.AuGdsQdHomeView.prototype.getView = function()
{
	return this.m_mainView;
};
oFF.AuGdsQdHomeView.prototype.prepareUi = function(genesis)
{
	this.m_mainView = genesis.newControl(oFF.UiType.FLEX_LAYOUT);
	this.m_mainView.setDirection(oFF.UiFlexDirection.COLUMN);
	this.m_mainView.setAlignItems(oFF.UiFlexAlignItems.START);
	this.m_mainView.useMaxSpace();
	this.createHeader();
	this.createContent();
	this.createRecentFilesFooter();
};
oFF.AuGdsQdHomeView.prototype.createHeader = function()
{
	var headerWrapper = this.m_mainView.addNewItemOfType(oFF.UiType.FLEX_LAYOUT);
	headerWrapper.setFlex("0 0 auto");
	headerWrapper.setDirection(oFF.UiFlexDirection.COLUMN);
	headerWrapper.setBackgroundColor(oFF.UiColor.create(oFF.AuGdsQdHomeView.GDS_HW_WELCOME_BG));
	headerWrapper.useMaxWidth();
	headerWrapper.setPadding(oFF.UiCssBoxEdges.create("10px 0px 0px 32px"));
	var headerTitleLbl = headerWrapper.addNewItemOfType(oFF.UiType.LABEL);
	headerTitleLbl.setText("Welcome to Galaxy Data Studio!");
	headerTitleLbl.setFontSize(oFF.UiCssLength.create(oFF.AuGdsQdHomeView.GDS_HW_LARGE_FONT_SIZE));
	headerTitleLbl.setTextAlign(oFF.UiTextAlign.LEFT);
	headerTitleLbl.setMargin(oFF.UiCssBoxEdges.create("10px"));
	var headerDescriptionLbl = headerWrapper.addNewItemOfType(oFF.UiType.LABEL);
	headerDescriptionLbl.setText("Instantly explore your data");
	headerDescriptionLbl.setFontSize(oFF.UiCssLength.create(oFF.AuGdsQdHomeView.GDS_HW_SMALL_FONT_SIZE));
	headerDescriptionLbl.setMargin(oFF.UiCssBoxEdges.create("0px 10px 10px 10px"));
	headerDescriptionLbl.setTextAlign(oFF.UiTextAlign.LEFT);
	var headerSplitter = this.m_mainView.addNewItemOfType(oFF.UiType.SPACER);
	headerSplitter.setHeight(oFF.UiCssLength.create("2px"));
	headerSplitter.useMaxWidth().setBackgroundColor(oFF.UiColor.create("#d1e0ee"));
};
oFF.AuGdsQdHomeView.prototype.createContent = function()
{
	var contentContainer = this.m_mainView.addNewItemOfType(oFF.UiType.FLEX_LAYOUT);
	contentContainer.setDirection(oFF.UiFlexDirection.COLUMN);
	contentContainer.setAlignItems(oFF.UiFlexAlignItems.START);
	contentContainer.useMaxWidth();
	contentContainer.setFlex("0 0 auto");
	contentContainer.setPadding(oFF.UiCssBoxEdges.create("24px 32px"));
	var createNewLabel = contentContainer.addNewItemOfType(oFF.UiType.LABEL);
	createNewLabel.setText("Start New");
	createNewLabel.setFontSize(oFF.UiCssLength.create(oFF.AuGdsQdHomeView.GDS_HW_MIDDLE_FONT_SIZE));
	var dsTilesWrapper = contentContainer.addNewItemOfType(oFF.UiType.FLEX_LAYOUT);
	dsTilesWrapper.setDirection(oFF.UiFlexDirection.ROW);
	var selectDataSourceTile = this.createSelectionTile(oFF.AuGdsQdHomeView.GDS_HW_SELECT_DATA_SOURCE_TILE, "From a Data Source", "database", this);
	dsTilesWrapper.addItem(selectDataSourceTile);
	var selectFromModelTile = this.createSelectionTile(oFF.AuGdsQdHomeView.GDS_HW_SELECT_FROM_MODEK_TILE, "From a Model", "database", this);
	selectFromModelTile.setLoadState(oFF.UiLoadState.DISABLED);
	dsTilesWrapper.addItem(selectFromModelTile);
};
oFF.AuGdsQdHomeView.prototype.createRecentFilesFooter = function()
{
	this.m_recentFileTable = this.m_mainView.addNewItemOfType(oFF.UiType.RESPONSIVE_TABLE);
	this.m_recentFileTable.setFlex("1 1 250px");
	this.m_recentFileTable.addNewResponsiveTableColumn().setTitle("Name");
	this.m_recentFileTable.addNewResponsiveTableColumn().setTitle("Description");
	this.m_recentFileTable.registerOnSelect(this);
	this.m_recentFileTable.setName(oFF.AuGdsQdHomeView.GDS_HW_RECENT_FILES_TABLE_NAME);
	this.m_recentFileTable.setSelectionMode(oFF.UiSelectionMode.SINGLE_SELECT_MASTER);
	var tableHeaderWrapper = this.m_recentFileTable.setNewHeader(oFF.UiType.FLEX_LAYOUT);
	tableHeaderWrapper.useMaxSpace();
	tableHeaderWrapper.setAlignItems(oFF.UiFlexAlignItems.CENTER);
	this.m_recentFileLabel = tableHeaderWrapper.addNewItemOfType(oFF.UiType.LABEL);
	this.m_recentFileLabel.setText("Recent Files (0)");
	this.m_recentFileLabel.setFontSize(oFF.UiCssLength.create(oFF.AuGdsQdHomeView.GDS_HW_MIDDLE_FONT_SIZE));
	this.m_recentFileLabel.useMaxWidth();
	var searchField = tableHeaderWrapper.addNewItemOfType(oFF.UiType.SEARCH_FIELD);
	searchField.setWidth(oFF.UiCssLength.create("320px"));
	searchField.setPlaceholder("Search in: Recent Files");
};
oFF.AuGdsQdHomeView.prototype.createSelectionTile = function(name, text, icon, listener)
{
	var iconWrapper = this.getGenesis().newControl(oFF.UiType.FLEX_LAYOUT);
	iconWrapper.useMaxSpace();
	iconWrapper.setDirection(oFF.UiFlexDirection.COLUMN);
	iconWrapper.setAlignItems(oFF.UiFlexAlignItems.CENTER);
	iconWrapper.setJustifyContent(oFF.UiFlexJustifyContent.CENTER);
	var tileIcon = iconWrapper.addNewItemOfType(oFF.UiType.ICON);
	tileIcon.setIcon(icon);
	tileIcon.setEnabled(false);
	tileIcon.setIconSize(oFF.UiCssLength.create(oFF.AuGdsQdHomeView.GDS_HW_SELECTION_ICON_FONT_SIZE));
	tileIcon.setColor(oFF.UiColor.create(oFF.AuGdsQdHomeView.GDS_HW_SELECTION_ICON_COLOR));
	tileIcon.useMaxWidth();
	tileIcon.setMargin(oFF.UiCssBoxEdges.create("0px 0px 5px 0px"));
	var tileLbl = iconWrapper.addNewItemOfType(oFF.UiType.LABEL);
	tileLbl.setText(text);
	tileLbl.setFontSize(oFF.UiCssLength.create(oFF.AuGdsQdHomeView.GDS_HW_SMALL_FONT_SIZE));
	var tile = this.getGenesis().newControl(oFF.UiType.TILE);
	tile.setName(name);
	tile.setContent(iconWrapper);
	tile.setFrameType(oFF.UiFrameType.ONE_BY_HALF);
	tile.setMargin(oFF.UiCssBoxEdges.create(oFF.AuGdsQdHomeView.GDS_HW_SELECTION_TILE_MARGIN));
	tile.registerOnPress(listener);
	return tile;
};
oFF.AuGdsQdHomeView.prototype.updateRecentFilesList = function(recentFiles)
{
	if (oFF.notNull(this.m_recentFileTable))
	{
		this.m_recentFileTable.clearResponsiveTableRows();
		var recentFilesIterator = recentFiles.getIterator();
		while (recentFilesIterator.hasNext())
		{
			var filePathStr = recentFilesIterator.next();
			var tmpListItem = this.m_recentFileTable.addNewResponsiveTableRow();
			tmpListItem.setTag(oFF.AuGdsQdHomeView.GDS_HW_RECENT_FILES_ITEM_TAG);
			var cell = tmpListItem.addNewResponsiveTableCell();
			cell.setText(filePathStr);
			cell = tmpListItem.addNewResponsiveTableCell();
			cell.setText("");
		}
		this.updateRecentFilesCount(recentFiles.size());
	}
};
oFF.AuGdsQdHomeView.prototype.selectDataSourcePressed = function()
{
	if (oFF.notNull(this.m_listener))
	{
		this.m_listener.onGdsHvSelectDataSourcePress(this);
	}
};
oFF.AuGdsQdHomeView.prototype.recentFileSelected = function(selectedRow)
{
	if (oFF.notNull(this.m_listener) && oFF.notNull(selectedRow))
	{
		this.m_listener.onGdsHvRecentFileSelect(this, selectedRow.getResponsiveTableCell(0).getText());
	}
};
oFF.AuGdsQdHomeView.prototype.updateRecentFilesCount = function(count)
{
	if (oFF.notNull(this.m_recentFileLabel))
	{
		var text = oFF.XStringUtils.concatenate3("Recent Files (", oFF.XInteger.convertToString(count), ")");
		this.m_recentFileLabel.setText(text);
	}
};
oFF.AuGdsQdHomeView.prototype.onSelect = function(event)
{
	var control = event.getControl();
	if (oFF.XString.isEqual(control.getName(), oFF.AuGdsQdHomeView.GDS_HW_RECENT_FILES_TABLE_NAME))
	{
		var tmpItem = event.getSelectedItem();
		this.recentFileSelected(tmpItem);
	}
};
oFF.AuGdsQdHomeView.prototype.onPress = function(event)
{
	var control = event.getControl();
	if (oFF.XString.isEqual(control.getName(), oFF.AuGdsQdHomeView.GDS_HW_SELECT_DATA_SOURCE_TILE))
	{
		this.selectDataSourcePressed();
	}
};

oFF.AuGdsLambdaDropListener = function() {};
oFF.AuGdsLambdaDropListener.prototype = new oFF.XObject();
oFF.AuGdsLambdaDropListener.prototype._ff_c = "AuGdsLambdaDropListener";

oFF.AuGdsLambdaDropListener.create = function(consumer)
{
	var obj = new oFF.AuGdsLambdaDropListener();
	obj.m_consumer = consumer;
	return obj;
};
oFF.AuGdsLambdaDropListener.prototype.m_consumer = null;
oFF.AuGdsLambdaDropListener.prototype.onDrop = function(event)
{
	this.m_consumer(event);
};
oFF.AuGdsLambdaDropListener.prototype.releaseObject = function()
{
	this.m_consumer = null;
	oFF.XObject.prototype.releaseObject.call( this );
};

oFF.AuGdsLambdaHierarchyCatalogManagerCreatedListener = function() {};
oFF.AuGdsLambdaHierarchyCatalogManagerCreatedListener.prototype = new oFF.XObject();
oFF.AuGdsLambdaHierarchyCatalogManagerCreatedListener.prototype._ff_c = "AuGdsLambdaHierarchyCatalogManagerCreatedListener";

oFF.AuGdsLambdaHierarchyCatalogManagerCreatedListener.create = function(consumer)
{
	var obj = new oFF.AuGdsLambdaHierarchyCatalogManagerCreatedListener();
	obj.m_consumer = consumer;
	return obj;
};
oFF.AuGdsLambdaHierarchyCatalogManagerCreatedListener.prototype.m_consumer = null;
oFF.AuGdsLambdaHierarchyCatalogManagerCreatedListener.prototype.onHierarchyCatalogManagerCreated = function(extResult, hierarchyCatalogManager, customIdentifier)
{
	if (oFF.notNull(this.m_consumer))
	{
		this.m_consumer(extResult);
	}
};
oFF.AuGdsLambdaHierarchyCatalogManagerCreatedListener.prototype.releaseObject = function()
{
	this.m_consumer = null;
	oFF.XObject.prototype.releaseObject.call( this );
};

oFF.AuGdsLambdaListener = function() {};
oFF.AuGdsLambdaListener.prototype = new oFF.XObject();
oFF.AuGdsLambdaListener.prototype._ff_c = "AuGdsLambdaListener";

oFF.AuGdsLambdaListener.create = function(procedure)
{
	var obj = new oFF.AuGdsLambdaListener();
	obj.m_action = procedure;
	return obj;
};
oFF.AuGdsLambdaListener.prototype.m_action = null;
oFF.AuGdsLambdaListener.prototype.releaseObject = function()
{
	this.m_action = null;
	oFF.XObject.prototype.releaseObject.call( this );
};
oFF.AuGdsLambdaListener.prototype.onPress = function(event)
{
	this.m_action();
};
oFF.AuGdsLambdaListener.prototype.onChange = function(event)
{
	this.m_action();
};
oFF.AuGdsLambdaListener.prototype.onContextMenu = function(event)
{
	this.m_action();
};
oFF.AuGdsLambdaListener.prototype.onSearch = function(event)
{
	this.m_action();
};
oFF.AuGdsLambdaListener.prototype.onLiveChange = function(event)
{
	this.m_action();
};

oFF.AuGdsLambdaListenerWithEvent = function() {};
oFF.AuGdsLambdaListenerWithEvent.prototype = new oFF.XObject();
oFF.AuGdsLambdaListenerWithEvent.prototype._ff_c = "AuGdsLambdaListenerWithEvent";

oFF.AuGdsLambdaListenerWithEvent.create = function(action)
{
	var obj = new oFF.AuGdsLambdaListenerWithEvent();
	obj.m_action = action;
	return obj;
};
oFF.AuGdsLambdaListenerWithEvent.prototype.m_action = null;
oFF.AuGdsLambdaListenerWithEvent.prototype.releaseObject = function()
{
	this.m_action = null;
	oFF.XObject.prototype.releaseObject.call( this );
};
oFF.AuGdsLambdaListenerWithEvent.prototype.onPress = function(event)
{
	this.m_action(event);
};
oFF.AuGdsLambdaListenerWithEvent.prototype.onChange = function(event)
{
	this.m_action(event);
};
oFF.AuGdsLambdaListenerWithEvent.prototype.onContextMenu = function(event)
{
	this.m_action(event);
};
oFF.AuGdsLambdaListenerWithEvent.prototype.onSearch = function(event)
{
	this.m_action(event);
};
oFF.AuGdsLambdaListenerWithEvent.prototype.onLiveChange = function(event)
{
	this.m_action(event);
};

oFF.AuGdsLambdaSyncListener = function() {};
oFF.AuGdsLambdaSyncListener.prototype = new oFF.XObject();
oFF.AuGdsLambdaSyncListener.prototype._ff_c = "AuGdsLambdaSyncListener";

oFF.AuGdsLambdaSyncListener.create = function(procedure)
{
	var obj = new oFF.AuGdsLambdaSyncListener();
	obj.m_action = procedure;
	return obj;
};
oFF.AuGdsLambdaSyncListener.prototype.m_action = null;
oFF.AuGdsLambdaSyncListener.prototype.releaseObject = function()
{
	this.m_action = null;
	oFF.XObject.prototype.releaseObject.call( this );
};
oFF.AuGdsLambdaSyncListener.prototype.onSynchronized = function(messages, data, customIdentifier)
{
	this.m_action(messages, data);
};

oFF.ScAtlasDashboardView = function() {};
oFF.ScAtlasDashboardView.prototype = new oFF.XObject();
oFF.ScAtlasDashboardView.prototype._ff_c = "ScAtlasDashboardView";

oFF.ScAtlasDashboardView.createDashboardView = function(genesis, application, story, widgetIdsList, name)
{
	if (oFF.isNull(genesis))
	{
		throw oFF.XException.createRuntimeException("You need to specify a genesis instance in order to create a Atlas Dashboard View!");
	}
	if (oFF.isNull(application))
	{
		throw oFF.XException.createRuntimeException("You need to specify a application instance in order to create a Atlas Dashboard View!");
	}
	if (oFF.isNull(story))
	{
		var errorMsg = "Missing story. Cannot create Atlas Dashboard View!";
		genesis.showErrorToast(errorMsg);
		throw oFF.XException.createRuntimeException(errorMsg);
	}
	var newUiControlsView = new oFF.ScAtlasDashboardView();
	newUiControlsView.setupInternal(genesis, application, story, widgetIdsList, name);
	return newUiControlsView;
};
oFF.ScAtlasDashboardView.prototype.m_genesis = null;
oFF.ScAtlasDashboardView.prototype.m_story = null;
oFF.ScAtlasDashboardView.prototype.m_application = null;
oFF.ScAtlasDashboardView.prototype.m_widgetIdsList = null;
oFF.ScAtlasDashboardView.prototype.m_dashboardName = null;
oFF.ScAtlasDashboardView.prototype.m_viewPage = null;
oFF.ScAtlasDashboardView.prototype.m_flexLayout = null;
oFF.ScAtlasDashboardView.prototype.releaseObject = function()
{
	oFF.XObject.prototype.releaseObject.call( this );
	this.m_genesis = null;
	this.m_application = null;
	this.m_story = null;
	this.m_widgetIdsList = null;
	this.m_viewPage = oFF.XObjectExt.release(this.m_viewPage);
};
oFF.ScAtlasDashboardView.prototype.setupInternal = function(genesis, application, story, widgetIdsList, name)
{
	this.m_genesis = genesis;
	this.m_application = application;
	this.m_story = story;
	this.m_widgetIdsList = widgetIdsList;
	this.m_dashboardName = name;
	this.createView(genesis);
};
oFF.ScAtlasDashboardView.prototype.getPage = function()
{
	return this.m_viewPage;
};
oFF.ScAtlasDashboardView.prototype.createView = function(genesis)
{
	this.m_viewPage = genesis.newControl(oFF.UiType.PAGE);
	this.m_viewPage.setName("scAtlasDashboardViewPage");
	this.m_viewPage.setShowHeader(true);
	this.m_viewPage.setText(oFF.XStringUtils.isNotNullAndNotEmpty(this.m_dashboardName) ? this.m_dashboardName : this.m_story.getName());
	this.m_viewPage.useMaxSpace();
	this.m_flexLayout = this.m_viewPage.setNewContent(oFF.UiType.FLEX_LAYOUT);
	this.m_viewPage.setName("scAtlasDashboardViewTileContainer");
	this.m_flexLayout.setPadding(oFF.UiCssBoxEdges.create("10px"));
	this.m_flexLayout.useMaxSpace();
	this.renderDashboard();
};
oFF.ScAtlasDashboardView.prototype.renderDashboard = function()
{
	var quasarStory = oFF.OcQuasarStory.create(this.m_story);
	quasarStory.setQuasarChartType(oFF.OcChartType.MICRO_CHART);
	var messages = quasarStory.getMessages();
	if (messages.hasErrors())
	{
		var error = messages.getFirstError();
		this.m_genesis.showErrorToast(error.getText());
	}
	else if (messages.getMessages().hasElements())
	{
		var firstWarning = messages.getFirstWithSeverity(oFF.Severity.WARNING);
		if (oFF.notNull(firstWarning))
		{
			this.m_genesis.showWarningToast(firstWarning.getText());
		}
	}
	if (oFF.notNull(this.m_widgetIdsList) && this.m_widgetIdsList.size() > 0)
	{
		var widgetsIterator = this.m_widgetIdsList.getIterator();
		while (widgetsIterator.hasNext())
		{
			var widgetId = widgetsIterator.next();
			var widgetDef = quasarStory.getQuasarWidgetDocument(widgetId);
			if (oFF.notNull(widgetDef))
			{
				var tmpDashboardTile = this.m_flexLayout.addNewItemOfType(oFF.UiType.TILE);
				tmpDashboardTile.setTitle(this.m_story.getName());
				tmpDashboardTile.setSubtitle(widgetId);
				tmpDashboardTile.setMargin(oFF.UiCssBoxEdges.create("10px"));
				var tmpQsaEngine = oFF.QuasarEngine.create(this.m_application);
				var tmpQuasarGeneis = oFF.UiGenesis.create(tmpDashboardTile, oFF.UiItemPosition.CONTENT, oFF.UiOperation.SET, 0, 0);
				tmpQsaEngine.setDocument(widgetDef);
				tmpQsaEngine.renderUi(tmpQuasarGeneis);
			}
		}
	}
	else
	{
		var errorText = this.m_viewPage.setNewContent(oFF.UiType.TEXT);
		errorText.setText("No widgets found!");
		errorText.useMaxSpace();
		errorText.setBackgroundColor(oFF.UiColor.create("#cc0033"));
		errorText.setFontColor(oFF.UiColor.create("#ffffff"));
		errorText.setFontSize(oFF.UiCssLength.createExt(15, oFF.UiCssSizeUnit.PIXEL));
	}
};
oFF.ScAtlasDashboardView.prototype.onSelect = function(event) {};
oFF.ScAtlasDashboardView.prototype.onLiveChange = function(event) {};
oFF.ScAtlasDashboardView.prototype.onSearch = function(event) {};
oFF.ScAtlasDashboardView.prototype.onPress = function(event)
{
	this.m_genesis.showInfoToast("Works!");
};

oFF.ScAtlasStoryListView = function() {};
oFF.ScAtlasStoryListView.prototype = new oFF.XObject();
oFF.ScAtlasStoryListView.prototype._ff_c = "ScAtlasStoryListView";

oFF.ScAtlasStoryListView.createStoryListView = function(genesis, storyCatalog, listener)
{
	if (oFF.isNull(genesis))
	{
		throw oFF.XException.createRuntimeException("You need to specify a genesis instance in order to create a Atlas Story List View!");
	}
	if (oFF.isNull(storyCatalog))
	{
		var errorMsg = "Missing story catalog. Cannot create Atlas Story List View!";
		genesis.showErrorToast(errorMsg);
		throw oFF.XException.createRuntimeException(errorMsg);
	}
	var newUiControlsView = new oFF.ScAtlasStoryListView();
	newUiControlsView.setupInternal(genesis, storyCatalog, listener);
	return newUiControlsView;
};
oFF.ScAtlasStoryListView.prototype.m_genesis = null;
oFF.ScAtlasStoryListView.prototype.m_storyCatalog = null;
oFF.ScAtlasStoryListView.prototype.m_viewPage = null;
oFF.ScAtlasStoryListView.prototype.m_storyList = null;
oFF.ScAtlasStoryListView.prototype.m_storySearchField = null;
oFF.ScAtlasStoryListView.prototype.m_allStoryListItems = null;
oFF.ScAtlasStoryListView.prototype.m_storyCatalogItemSelectListener = null;
oFF.ScAtlasStoryListView.prototype.releaseObject = function()
{
	oFF.XObject.prototype.releaseObject.call( this );
	this.m_genesis = null;
	this.m_storyCatalog = null;
	this.m_storyCatalogItemSelectListener = null;
	this.m_storySearchField = oFF.XObjectExt.release(this.m_storySearchField);
	if (oFF.notNull(this.m_allStoryListItems))
	{
		this.m_allStoryListItems.clear();
		this.m_allStoryListItems = oFF.XObjectExt.release(this.m_allStoryListItems);
	}
	this.m_storyList = oFF.XObjectExt.release(this.m_storyList);
	this.m_viewPage = oFF.XObjectExt.release(this.m_viewPage);
};
oFF.ScAtlasStoryListView.prototype.setupInternal = function(genesis, storyCatalog, listener)
{
	this.m_genesis = genesis;
	this.m_storyCatalog = storyCatalog;
	this.m_storyCatalogItemSelectListener = listener;
	this.m_allStoryListItems = oFF.XList.create();
	this.createView(genesis);
};
oFF.ScAtlasStoryListView.prototype.createView = function(genesis)
{
	this.m_viewPage = genesis.newControl(oFF.UiType.PAGE);
	this.m_viewPage.setName("scAtlasStoryListViewPage");
	this.m_viewPage.setShowHeader(true);
	this.m_viewPage.setText("All stories");
	this.m_viewPage.useMaxSpace();
	this.m_storySearchField = this.m_viewPage.setNewSubHeader(oFF.UiType.SEARCH_FIELD);
	this.m_storySearchField.setName("scAtlasStoryListViewSearchField");
	this.m_storySearchField.setPlaceholder("Search story...");
	this.m_storySearchField.registerOnSearch(this);
	this.m_storySearchField.registerOnLiveChange(this);
	this.m_storySearchField.setDebounceTime(1000);
	var refreshAction = this.m_viewPage.addNewPageButton();
	refreshAction.setName("scAtlasStoryListViewPageRefreshList");
	refreshAction.setText("Refresh");
	refreshAction.setIcon("refresh");
	refreshAction.registerOnPress(this);
	var favoritesAction = this.m_viewPage.addNewPageButton();
	favoritesAction.setName("scAtlasStoryListViewPageGetFavorites");
	favoritesAction.setText("Favorites");
	favoritesAction.setIcon("favorite");
	favoritesAction.registerOnPress(this);
	this.m_storyList = this.m_viewPage.setNewContent(oFF.UiType.LIST);
	this.m_storyList.setName("scAtlasStoryListViewStoryList");
	this.m_storyList.setSelectionMode(oFF.UiSelectionMode.NONE);
	this.m_storyList.useMaxSpace();
	this.fillStoryList();
	this.m_genesis.showInfoToast("Story catalog loaded!");
};
oFF.ScAtlasStoryListView.prototype.getPage = function()
{
	return this.m_viewPage;
};
oFF.ScAtlasStoryListView.prototype.fillStoryList = function()
{
	if (oFF.notNull(this.m_storyList))
	{
		this.m_storyList.clearItems();
		this.m_allStoryListItems.clear();
		var iterator = this.m_storyCatalog.getCatalogItems().getIterator();
		while (iterator.hasNext())
		{
			var tmpStory = iterator.next();
			var desc = tmpStory.getDescription();
			var modifiedBy = tmpStory.getModifiedByDisplayName();
			if (oFF.XStringUtils.isNullOrEmpty(modifiedBy))
			{
				modifiedBy = tmpStory.getModifiedBy();
			}
			var modify = oFF.XStringUtils.concatenate2(oFF.XStringUtils.concatenate2("Modified: ", tmpStory.getModifiedTime()), oFF.XStringUtils.concatenate2(" by ", modifiedBy));
			var fullDesc = oFF.XStringUtils.concatenate3(modify, "\n", desc);
			var listItem = this.m_storyList.addNewItem();
			listItem.setText(tmpStory.getName());
			listItem.setListItemType(oFF.UiListType.NAVIGATION);
			listItem.registerOnPress(this);
			listItem.setDescription(fullDesc);
			listItem.setCustomObject(tmpStory);
			listItem.setIcon("business-objects-experience");
			this.m_allStoryListItems.add(listItem);
		}
	}
};
oFF.ScAtlasStoryListView.prototype.filterStoryList = function(searchText, clearButtonPressed)
{
	if (oFF.notNull(this.m_storyList))
	{
		this.m_storyList.clearItems();
		if (clearButtonPressed === false)
		{
			for (var a = 0; a < this.m_allStoryListItems.size(); a++)
			{
				var tmpListItem = this.m_allStoryListItems.get(a);
				if (oFF.XString.containsString(oFF.XString.toLowerCase(tmpListItem.getText()), oFF.XString.toLowerCase(searchText)))
				{
					this.m_storyList.addItem(tmpListItem);
				}
			}
		}
		else
		{
			this.m_storyList.addAllItems(this.m_allStoryListItems);
		}
	}
};
oFF.ScAtlasStoryListView.prototype.onSelect = function(event) {};
oFF.ScAtlasStoryListView.prototype.onLiveChange = function(event)
{
	if (event.getControl() === this.m_storySearchField)
	{
		this.filterStoryList(event.getControl().getText(), false);
	}
};
oFF.ScAtlasStoryListView.prototype.onSearch = function(event)
{
	var didPressClearButton = event.getParameters().getBooleanByKeyExt(oFF.UiControlEvent.PARAM_CLEAR_BUTTON_PRESSED, false);
	var searchText = event.getParameters().getStringByKeyExt(oFF.UiControlEvent.PARAM_SEARCH_TEXT, "");
	this.filterStoryList(searchText, didPressClearButton);
};
oFF.ScAtlasStoryListView.prototype.onPress = function(event)
{
	var storyCatalogItem = event.getControl().getCustomObject();
	if (oFF.notNull(this.m_storyCatalogItemSelectListener) && oFF.notNull(storyCatalogItem))
	{
		this.m_storyCatalogItemSelectListener.onStoryCatalogItemSelected(storyCatalogItem);
	}
};

oFF.ScAtlasStoryView = function() {};
oFF.ScAtlasStoryView.prototype = new oFF.XObject();
oFF.ScAtlasStoryView.prototype._ff_c = "ScAtlasStoryView";

oFF.ScAtlasStoryView.createStoryView = function(genesis, application, story, layoutType, chartType)
{
	if (oFF.isNull(genesis))
	{
		throw oFF.XException.createRuntimeException("You need to specify a genesis instance in order to create a Atlas Story View!");
	}
	if (oFF.isNull(application))
	{
		throw oFF.XException.createRuntimeException("You need to specify a application instance in order to create a Atlas Story View!");
	}
	if (oFF.isNull(story))
	{
		var errorMsg = "Missing story. Cannot create Atlas Story View!";
		genesis.showErrorToast(errorMsg);
		throw oFF.XException.createRuntimeException(errorMsg);
	}
	var newUiControlsView = new oFF.ScAtlasStoryView();
	newUiControlsView.setupInternal(genesis, application, story, layoutType, chartType);
	return newUiControlsView;
};
oFF.ScAtlasStoryView.prototype.m_genesis = null;
oFF.ScAtlasStoryView.prototype.m_story = null;
oFF.ScAtlasStoryView.prototype.m_layoutType = null;
oFF.ScAtlasStoryView.prototype.m_chartType = null;
oFF.ScAtlasStoryView.prototype.m_application = null;
oFF.ScAtlasStoryView.prototype.m_viewPage = null;
oFF.ScAtlasStoryView.prototype.releaseObject = function()
{
	oFF.XObject.prototype.releaseObject.call( this );
	this.m_genesis = null;
	this.m_application = null;
	this.m_story = null;
	this.m_layoutType = null;
	this.m_chartType = null;
	this.m_viewPage = oFF.XObjectExt.release(this.m_viewPage);
};
oFF.ScAtlasStoryView.prototype.setupInternal = function(genesis, application, story, layoutType, chartType)
{
	this.m_genesis = genesis;
	this.m_application = application;
	this.m_story = story;
	this.m_layoutType = oFF.notNull(layoutType) ? layoutType : oFF.OcLayoutType.CANVAS;
	this.m_chartType = oFF.notNull(chartType) ? chartType : oFF.OcChartType.HIGHCHARTS;
	this.createView(genesis);
};
oFF.ScAtlasStoryView.prototype.getPage = function()
{
	return this.m_viewPage;
};
oFF.ScAtlasStoryView.prototype.createView = function(genesis)
{
	this.m_viewPage = genesis.newControl(oFF.UiType.PAGE);
	this.m_viewPage.setName("scAtlasStoryViewPage");
	this.m_viewPage.setShowHeader(true);
	this.m_viewPage.setText(this.m_story.getName());
	this.m_viewPage.useMaxSpace();
	this.renderStory();
};
oFF.ScAtlasStoryView.prototype.renderStory = function()
{
	var quasarStory = oFF.OcQuasarStory.create(this.m_story);
	quasarStory.setQuasarMainLayoutType(this.m_layoutType);
	quasarStory.setQuasarChartType(this.m_chartType);
	var pageList = quasarStory.getQuasarPages();
	var messages = quasarStory.getMessages();
	if (messages.hasErrors())
	{
		var error = messages.getFirstError();
		this.m_genesis.showErrorToast(error.getText());
	}
	else if (messages.getMessages().hasElements())
	{
		var firstWarning = messages.getFirstWithSeverity(oFF.Severity.WARNING);
		if (oFF.notNull(firstWarning))
		{
			this.m_genesis.showWarningToast(firstWarning.getText());
		}
	}
	var pageCount = pageList.size();
	if (pageCount > 0)
	{
		var tabBar = this.m_viewPage.setNewContent(oFF.UiType.ICON_TAB_BAR);
		tabBar.useMaxSpace();
		tabBar.setName(quasarStory.getName());
		tabBar.setCustomObject(quasarStory);
		tabBar.registerOnSelect(this);
		for (var pageIndex = 0; pageIndex < pageCount; pageIndex++)
		{
			var newPage = pageList.get(pageIndex);
			var tabBarItem = tabBar.addNew(oFF.UiType.ICON_TAB_BAR_ITEM);
			tabBarItem.setName(newPage.getId());
			tabBarItem.setText(newPage.getName());
			tabBarItem.setIcon("document");
			tabBarItem.setNewContent(oFF.UiType.ACTIVITY_INDICATOR).setText("Loading page...").useMaxSpace();
			var storyDef = newPage.getPageContent();
			if (oFF.isNull(storyDef))
			{
				var textItem = this.m_viewPage.setNewContent(oFF.UiType.TEXT).setText("This page has no widgets!");
				textItem.setBackgroundColor(oFF.UiColor.create("#cc0033"));
				textItem.setFontColor(oFF.UiColor.create("#ffffff"));
				textItem.setFontSize(oFF.UiCssLength.createExt(15, oFF.UiCssSizeUnit.PIXEL));
			}
			else
			{
				var tmpQsaEngine = oFF.QuasarEngine.create(this.m_application);
				var tmpQuasarGeneis = oFF.UiGenesis.create(tabBarItem, oFF.UiItemPosition.CONTENT, oFF.UiOperation.SET, 0, 0);
				tmpQsaEngine.setDocument(storyDef);
				tmpQsaEngine.renderUi(tmpQuasarGeneis);
			}
		}
	}
	else
	{
		var textItem2 = this.m_viewPage.setNewContent(oFF.UiType.TEXT).setText("This story has no content!");
		textItem2.setBackgroundColor(oFF.UiColor.create("#cc0033"));
		textItem2.setFontColor(oFF.UiColor.create("#ffffff"));
		textItem2.setFontSize(oFF.UiCssLength.createExt(15, oFF.UiCssSizeUnit.PIXEL));
	}
};
oFF.ScAtlasStoryView.prototype.onSelect = function(event) {};
oFF.ScAtlasStoryView.prototype.onLiveChange = function(event) {};
oFF.ScAtlasStoryView.prototype.onSearch = function(event) {};
oFF.ScAtlasStoryView.prototype.onPress = function(event)
{
	this.m_genesis.showInfoToast("Works!");
};

oFF.OpenQueryDialogI18n = function() {};
oFF.OpenQueryDialogI18n.prototype = new oFF.OlapUiI18n();
oFF.OpenQueryDialogI18n.prototype._ff_c = "OpenQueryDialogI18n";

oFF.OpenQueryDialogI18n.I18N_OD_TITLE = "I18N_OD_TITLE";
oFF.OpenQueryDialogI18n.I18N_OD_KEY = "I18N_OD_KEY";
oFF.OpenQueryDialogI18n.I18N_OD_DESCRIPTION = "I18N_OD_DESCRIPTION";
oFF.OpenQueryDialogI18n.I18N_OD_SEARCH_KEY_PLACEHOLDER = "I18N_OD_SEARCH_KEY_PLACEHOLDER";
oFF.OpenQueryDialogI18n.I18N_OD_SEARCH_DESCR_PLACEHOLDER = "I18N_OD_SEARCH_DESCR_PLACEHOLDER";
oFF.OpenQueryDialogI18n.I18N_OD_SEARCH = "I18N_OD_SEARCH";
oFF.OpenQueryDialogI18n.I18N_OD_SYSTEM = "I18N_OD_SYSTEM";
oFF.OpenQueryDialogI18n.I18N_OD_QUERIES = "I18N_OD_QUERIES";
oFF.OpenQueryDialogI18n.createOpenQueryDialogI18n = function()
{
	return new oFF.OpenQueryDialogI18n();
};
oFF.OpenQueryDialogI18n.staticSetupOqd = function()
{
	oFF.OlapUiI18n.addDefaultValue(oFF.OpenQueryDialogI18n.I18N_OD_TITLE, "Open Query");
	oFF.OlapUiI18n.addDefaultValue(oFF.OpenQueryDialogI18n.I18N_OD_DESCRIPTION, "Description");
	oFF.OlapUiI18n.addDefaultValue(oFF.OpenQueryDialogI18n.I18N_OD_KEY, "Technical Name");
	oFF.OlapUiI18n.addDefaultValue(oFF.OpenQueryDialogI18n.I18N_OD_SEARCH_KEY_PLACEHOLDER, "Search by Technical Name");
	oFF.OlapUiI18n.addDefaultValue(oFF.OpenQueryDialogI18n.I18N_OD_SEARCH_DESCR_PLACEHOLDER, "Search by Description");
	oFF.OlapUiI18n.addDefaultValue(oFF.OpenQueryDialogI18n.I18N_OD_SEARCH, "Search");
	oFF.OlapUiI18n.addDefaultValue(oFF.OpenQueryDialogI18n.I18N_OD_SYSTEM, "System");
	oFF.OlapUiI18n.addDefaultValue(oFF.OpenQueryDialogI18n.I18N_OD_QUERIES, "Queries");
};

oFF.AuGdsDfDocument = function() {};
oFF.AuGdsDfDocument.prototype = new oFF.XObjectExt();
oFF.AuGdsDfDocument.prototype._ff_c = "AuGdsDfDocument";

oFF.AuGdsDfDocument.prototype.m_controller = null;
oFF.AuGdsDfDocument.prototype.m_genesis = null;
oFF.AuGdsDfDocument.prototype.m_listener = null;
oFF.AuGdsDfDocument.prototype.m_documentSubApplication = null;
oFF.AuGdsDfDocument.prototype.m_containerTabItem = null;
oFF.AuGdsDfDocument.prototype.m_menuButtons = null;
oFF.AuGdsDfDocument.prototype.m_toolbarItems = null;
oFF.AuGdsDfDocument.prototype.m_uuid = null;
oFF.AuGdsDfDocument.prototype.m_file = null;
oFF.AuGdsDfDocument.prototype.m_docName = null;
oFF.AuGdsDfDocument.prototype.m_statusMesseage = null;
oFF.AuGdsDfDocument.prototype.m_statusMessageType = null;
oFF.AuGdsDfDocument.prototype.setupDocument = function(controller, listener)
{
	if (oFF.isNull(controller))
	{
		throw oFF.XException.createRuntimeException("Error while creating a gds document. Missing controller!");
	}
	this.m_uuid = oFF.XGuid.getGuid();
	this.m_controller = controller;
	this.m_listener = listener;
	var mainApplication = controller.getProcess().getApplication();
	this.m_documentSubApplication = mainApplication.newSubApplication(controller.getProcess().newChildProcess(oFF.ProcessType.SERVICE));
	this.m_menuButtons = oFF.XList.create();
	this.m_toolbarItems = oFF.XList.create();
	this.createTabItem(controller.getGenesis());
	if (oFF.notNull(this.m_containerTabItem))
	{
		var innerGenesis = oFF.UiGenesis.create(this.m_containerTabItem, oFF.UiItemPosition.CONTENT, oFF.UiOperation.SET, 0, 0);
		this.buildUi(innerGenesis);
	}
	this.log(this.getProcess().getProcessId());
};
oFF.AuGdsDfDocument.prototype.releaseObject = function()
{
	this.m_documentSubApplication = null;
	this.m_controller = null;
	this.m_listener = null;
	this.m_containerTabItem = null;
	this.m_file = null;
	this.m_statusMessageType = null;
	this.m_genesis = oFF.XObjectExt.release(this.m_genesis);
	this.m_menuButtons = oFF.XObjectExt.release(this.m_menuButtons);
	this.m_toolbarItems = oFF.XObjectExt.release(this.m_toolbarItems);
	oFF.XObjectExt.prototype.releaseObject.call( this );
};
oFF.AuGdsDfDocument.prototype.getUuid = function()
{
	return this.m_uuid;
};
oFF.AuGdsDfDocument.prototype.getTitle = function()
{
	var title = null;
	if (oFF.notNull(this.m_containerTabItem))
	{
		title = this.m_containerTabItem.getText();
	}
	return title;
};
oFF.AuGdsDfDocument.prototype.getStatusMessage = function()
{
	return this.m_statusMesseage;
};
oFF.AuGdsDfDocument.prototype.getStatusMessageType = function()
{
	return this.m_statusMessageType;
};
oFF.AuGdsDfDocument.prototype.getMenuButtons = function()
{
	return this.m_menuButtons;
};
oFF.AuGdsDfDocument.prototype.getToolbarItems = function()
{
	return this.m_toolbarItems;
};
oFF.AuGdsDfDocument.prototype.hasUndoSteps = function()
{
	return this.getApplication() !== null && this.getApplication().getUndoManager().getAvailableUndoStepCount() > 0;
};
oFF.AuGdsDfDocument.prototype.hasRedoSteps = function()
{
	return this.getApplication() !== null && this.getApplication().getUndoManager().getAvailableRedoStepCount() > 0;
};
oFF.AuGdsDfDocument.prototype.getFile = function()
{
	return this.m_file;
};
oFF.AuGdsDfDocument.prototype.setFile = function(file)
{
	this.m_file = file;
	if (oFF.notNull(file))
	{
		this.getController().updateFileArgument(file.getVfsUri().getPath());
		if (oFF.notNull(this.m_containerTabItem))
		{
			this.m_containerTabItem.setTooltip(file.getVfsUri().getPath());
		}
	}
};
oFF.AuGdsDfDocument.prototype.hasFile = function()
{
	return oFF.notNull(this.m_file);
};
oFF.AuGdsDfDocument.prototype.executeSave = function()
{
	if (this.hasFile() && this.hasSaveData())
	{
		var fileContent = oFF.XContent.createJsonObjectContent(oFF.ContentType.JSON, this.getSaveData());
		this.getController().saveContentToGdfFile(this.getFile(), fileContent);
	}
};
oFF.AuGdsDfDocument.prototype.executeSaveAs = function()
{
	if (this.hasSaveData())
	{
		var savePath = this.getSaveFileName();
		savePath = oFF.XStringUtils.concatenate2(oFF.AuGdsContants.GDF_DEFAULT_SAVE_DIR, savePath);
		this.getController().presentSaveAsPopup(savePath,  function(text){
			this.handleSaveAs(text);
		}.bind(this));
	}
};
oFF.AuGdsDfDocument.prototype.isPristine = function()
{
	return !this.getTabItem().isModified();
};
oFF.AuGdsDfDocument.prototype.isDirty = function()
{
	return this.getTabItem().isModified();
};
oFF.AuGdsDfDocument.prototype.buildUi = function(genesis)
{
	this.m_genesis = genesis;
};
oFF.AuGdsDfDocument.prototype.setDocumentName = function(docName)
{
	this.m_docName = docName;
	if (oFF.XStringUtils.isNotNullAndNotEmpty(docName))
	{
		this.setTitle(docName);
	}
};
oFF.AuGdsDfDocument.prototype.getDocumentName = function()
{
	return this.m_docName;
};
oFF.AuGdsDfDocument.prototype.setTitle = function(title)
{
	if (oFF.notNull(this.m_containerTabItem))
	{
		this.m_containerTabItem.setText(title);
		if (oFF.notNull(this.m_listener))
		{
			this.m_listener.onDocumentTitleChanged(this, title);
		}
	}
};
oFF.AuGdsDfDocument.prototype.setIcon = function(icon)
{
	if (oFF.notNull(this.m_containerTabItem))
	{
		this.m_containerTabItem.setIcon(icon);
	}
};
oFF.AuGdsDfDocument.prototype.setStatus = function(newMessage, newMessageType)
{
	this.m_statusMesseage = newMessage;
	this.m_statusMessageType = newMessageType;
	if (oFF.notNull(this.m_listener))
	{
		this.m_listener.onDocumentStatusChanged(this, newMessage, newMessageType);
	}
};
oFF.AuGdsDfDocument.prototype.getUserSettings = function()
{
	return this.getProcess().getUserManager().getUserSettings();
};
oFF.AuGdsDfDocument.prototype.addMenuBarButton = function(name, tag, text, icon, listner)
{
	if (this.getGenesis() !== null)
	{
		var tmpMenuBarButton = this.getGenesis().newControl(oFF.UiType.BUTTON);
		tmpMenuBarButton.setButtonType(oFF.UiButtonType.TRANSPARENT);
		tmpMenuBarButton.setName(name);
		tmpMenuBarButton.setTag(tag);
		tmpMenuBarButton.setText(text);
		tmpMenuBarButton.setIcon(icon);
		tmpMenuBarButton.registerOnPress(listner);
		this.m_menuButtons.add(tmpMenuBarButton);
		return tmpMenuBarButton;
	}
	return null;
};
oFF.AuGdsDfDocument.prototype.addToolbarItem = function(newItem)
{
	if (oFF.notNull(this.m_toolbarItems) && oFF.notNull(newItem))
	{
		this.m_toolbarItems.add(newItem);
	}
};
oFF.AuGdsDfDocument.prototype.addToolbarSectionSeparator = function()
{
	if (oFF.notNull(this.m_toolbarItems) && this.getController() !== null)
	{
		this.m_toolbarItems.add(this.getController().newToolbarSeparator());
	}
};
oFF.AuGdsDfDocument.prototype.markPristine = function()
{
	this.getTabItem().setModified(false);
};
oFF.AuGdsDfDocument.prototype.markDirty = function()
{
	this.getTabItem().setModified(true);
};
oFF.AuGdsDfDocument.prototype.notifySaveStateChanged = function()
{
	if (oFF.notNull(this.m_listener))
	{
		this.m_listener.onUndoSaveDataStateChanged(this, this.hasSaveData(), this.getSaveData());
	}
};
oFF.AuGdsDfDocument.prototype.notifyUndoRedoStateChanged = function()
{
	if (oFF.notNull(this.m_listener))
	{
		this.m_listener.onUndoRedoStateChanged(this, this.hasUndoSteps(), this.hasRedoSteps());
	}
};
oFF.AuGdsDfDocument.prototype.resetStatusMessage = function()
{
	this.setStatus(null, null);
};
oFF.AuGdsDfDocument.prototype.setStatusWarning = function(message)
{
	this.setStatus(message, oFF.UiMessageType.WARNING);
};
oFF.AuGdsDfDocument.prototype.setStatusError = function(message)
{
	this.setStatus(message, oFF.UiMessageType.ERROR);
};
oFF.AuGdsDfDocument.prototype.setStatusInfo = function(message)
{
	this.setStatus(message, oFF.UiMessageType.INFORMATION);
};
oFF.AuGdsDfDocument.prototype.setStatusSuccess = function(message)
{
	this.setStatus(message, oFF.UiMessageType.SUCCESS);
};
oFF.AuGdsDfDocument.prototype.onFileSavedSuccessfully = function(file)
{
	this.setFile(file);
	this.markPristine();
};
oFF.AuGdsDfDocument.prototype.showNetworkActivityIndicator = function()
{
	this.getController().setNetworkActivityIndicatorVisible(true);
};
oFF.AuGdsDfDocument.prototype.hideNetworkActivityIndicator = function()
{
	this.getController().setNetworkActivityIndicatorVisible(false);
};
oFF.AuGdsDfDocument.prototype.getGenesis = function()
{
	return this.m_genesis;
};
oFF.AuGdsDfDocument.prototype.getTabItem = function()
{
	return this.m_containerTabItem;
};
oFF.AuGdsDfDocument.prototype.getController = function()
{
	return this.m_controller;
};
oFF.AuGdsDfDocument.prototype.getProcess = function()
{
	return this.m_controller.getProcess();
};
oFF.AuGdsDfDocument.prototype.getApplication = function()
{
	return this.m_documentSubApplication;
};
oFF.AuGdsDfDocument.prototype.getSession = function()
{
	return this.getProcess();
};
oFF.AuGdsDfDocument.prototype.createTabItem = function(genesis)
{
	if (oFF.notNull(genesis))
	{
		this.m_containerTabItem = genesis.newControl(oFF.UiType.TAB_BAR_ITEM);
		this.m_containerTabItem.setName(this.m_uuid);
		this.m_containerTabItem.setText("Unnamed");
	}
};
oFF.AuGdsDfDocument.prototype.handleSaveAs = function(path)
{
	if (oFF.XStringUtils.isNotNullAndNotEmpty(path))
	{
		var tmpFile = this.getController().createFileByPath(path);
		if (oFF.notNull(tmpFile))
		{
			var fileContent = oFF.XContent.createJsonObjectContent(oFF.ContentType.JSON, this.getSaveData());
			var success = this.getController().saveContentToGdfFile(tmpFile, fileContent);
			if (success)
			{
				this.onFileSavedSuccessfully(tmpFile);
			}
		}
	}
	else
	{
		this.getGenesis().showWarningToast("Cannot save! No file specified!");
	}
};

oFF.AuGdsPanel = function() {};
oFF.AuGdsPanel.prototype = new oFF.XObjectExt();
oFF.AuGdsPanel.prototype._ff_c = "AuGdsPanel";

oFF.AuGdsPanel.GDS_PANEL_TARGET_WIDTH = "370px";
oFF.AuGdsPanel.GDS_PANEL_FLEX = "0 5 370px";
oFF.AuGdsPanel.GDS_PANEL_HEADER_FLEX = "0 0 42px";
oFF.AuGdsPanel.GDS_PANEL_HEADER_PADDING = "0px 12px";
oFF.AuGdsPanel.GDS_PANEL_HEADER_FONT_SIZE = "16px";
oFF.AuGdsPanel.GDS_PANEL_HEADER_ICON_SIZE = "18px";
oFF.AuGdsPanel.GDS_PANEL_BG_COLOR = "#427cac";
oFF.AuGdsPanel.createPanel = function(genesis, listener)
{
	var obj = new oFF.AuGdsPanel();
	obj.setupExt(genesis, listener);
	return obj;
};
oFF.AuGdsPanel.prototype.m_genesis = null;
oFF.AuGdsPanel.prototype.m_listener = null;
oFF.AuGdsPanel.prototype.m_content = null;
oFF.AuGdsPanel.prototype.m_mainLayout = null;
oFF.AuGdsPanel.prototype.m_contentContainer = null;
oFF.AuGdsPanel.prototype.m_headerWrapper = null;
oFF.AuGdsPanel.prototype.m_titleLbl = null;
oFF.AuGdsPanel.prototype.m_headerIcon = null;
oFF.AuGdsPanel.prototype.m_moreIcon = null;
oFF.AuGdsPanel.prototype.releaseObject = function()
{
	this.m_genesis = null;
	this.m_listener = null;
	this.m_content = null;
	this.m_moreIcon = oFF.XObjectExt.release(this.m_moreIcon);
	this.m_titleLbl = oFF.XObjectExt.release(this.m_titleLbl);
	this.m_headerIcon = oFF.XObjectExt.release(this.m_headerIcon);
	this.m_headerWrapper = oFF.XObjectExt.release(this.m_headerWrapper);
	this.m_contentContainer = oFF.XObjectExt.release(this.m_contentContainer);
	this.m_mainLayout = oFF.XObjectExt.release(this.m_mainLayout);
	oFF.XObjectExt.prototype.releaseObject.call( this );
};
oFF.AuGdsPanel.prototype.setupExt = function(genesis, listener)
{
	this.m_genesis = genesis;
	this.m_listener = listener;
	this.m_mainLayout = this.m_genesis.newControl(oFF.UiType.FLEX_LAYOUT);
	this.m_mainLayout.useMaxHeight();
	this.m_mainLayout.setWidth(oFF.UiCssLength.create(oFF.AuGdsPanel.GDS_PANEL_TARGET_WIDTH));
	this.m_mainLayout.setFlex(oFF.AuGdsPanel.GDS_PANEL_FLEX);
	this.m_mainLayout.setDirection(oFF.UiFlexDirection.COLUMN);
	this.m_mainLayout.setBorderStyle(oFF.UiBorderStyle.SOLID);
	this.m_mainLayout.setBorderWidth(oFF.UiCssBoxEdges.create("1px"));
	this.m_mainLayout.setBorderColor(oFF.UiColor.GREY.newBrighterColor(0.2));
	this.m_headerWrapper = this.m_mainLayout.addNewItemOfType(oFF.UiType.FLEX_LAYOUT);
	this.m_headerWrapper.useMaxWidth();
	this.m_headerWrapper.setFlex(oFF.AuGdsPanel.GDS_PANEL_HEADER_FLEX);
	this.m_headerWrapper.setPadding(oFF.UiCssBoxEdges.create(oFF.AuGdsPanel.GDS_PANEL_HEADER_PADDING));
	this.m_headerWrapper.setDirection(oFF.UiFlexDirection.ROW);
	this.m_headerWrapper.setAlignItems(oFF.UiFlexAlignItems.CENTER);
	this.m_headerWrapper.setJustifyContent(oFF.UiFlexJustifyContent.SPACE_BETWEEN);
	this.m_headerWrapper.setBackgroundColor(oFF.UiColor.create(oFF.AuGdsPanel.GDS_PANEL_BG_COLOR));
	var iconTitleWrapper = this.m_headerWrapper.addNewItemOfType(oFF.UiType.FLEX_LAYOUT);
	iconTitleWrapper.setDirection(oFF.UiFlexDirection.ROW);
	iconTitleWrapper.setAlignItems(oFF.UiFlexAlignItems.CENTER);
	this.m_headerIcon = iconTitleWrapper.addNewItemOfType(oFF.UiType.ICON);
	this.m_headerIcon.setColor(oFF.UiColor.WHITE);
	this.m_headerIcon.setIconSize(oFF.UiCssLength.create(oFF.AuGdsPanel.GDS_PANEL_HEADER_ICON_SIZE));
	this.m_headerIcon.setVisible(false);
	this.m_headerIcon.setEnabled(false);
	var iconTitleSpacer = iconTitleWrapper.addNewItemOfType(oFF.UiType.SPACER);
	iconTitleSpacer.setWidth(oFF.UiCssLength.create("10px"));
	this.m_titleLbl = iconTitleWrapper.addNewItemOfType(oFF.UiType.LABEL);
	this.m_titleLbl.setFontColor(oFF.UiColor.WHITE);
	this.m_titleLbl.setFontSize(oFF.UiCssLength.create(oFF.AuGdsPanel.GDS_PANEL_HEADER_FONT_SIZE));
	if (oFF.notNull(this.m_listener))
	{
		this.createMoreIconIfNeeded();
	}
	this.m_contentContainer = this.m_mainLayout.addNewItemOfType(oFF.UiType.SCROLL_CONTAINER);
	this.m_contentContainer.useMaxSpace();
};
oFF.AuGdsPanel.prototype.getView = function()
{
	return this.m_mainLayout;
};
oFF.AuGdsPanel.prototype.getGenesis = function()
{
	return this.m_genesis;
};
oFF.AuGdsPanel.prototype.setTitle = function(title)
{
	if (oFF.notNull(this.m_titleLbl))
	{
		this.m_titleLbl.setText(title);
	}
};
oFF.AuGdsPanel.prototype.setIcon = function(icon)
{
	if (oFF.notNull(this.m_headerIcon))
	{
		this.m_headerIcon.setVisible(oFF.XStringUtils.isNotNullAndNotEmpty(icon));
		this.m_headerIcon.setIcon(icon);
	}
};
oFF.AuGdsPanel.prototype.setContent = function(content)
{
	this.m_content = content;
	if (oFF.notNull(this.m_contentContainer))
	{
		this.m_contentContainer.setContent(this.m_content);
	}
};
oFF.AuGdsPanel.prototype.registerOnPanelActionsListener = function(listener)
{
	this.m_listener = listener;
	if (oFF.notNull(this.m_listener))
	{
		this.createMoreIconIfNeeded();
	}
};
oFF.AuGdsPanel.prototype.createMoreIconIfNeeded = function()
{
	if (oFF.notNull(this.m_headerWrapper) && oFF.isNull(this.m_moreIcon))
	{
		this.m_moreIcon = this.m_headerWrapper.addNewItemOfType(oFF.UiType.ICON);
		this.m_moreIcon.setIcon("overflow");
		this.m_moreIcon.setTooltip("More");
		this.m_moreIcon.setColor(oFF.UiColor.WHITE);
		this.m_moreIcon.setIconSize(oFF.UiCssLength.create(oFF.AuGdsPanel.GDS_PANEL_HEADER_FONT_SIZE));
		this.m_moreIcon.registerOnPress(this);
	}
};
oFF.AuGdsPanel.prototype.onPress = function(event)
{
	if (oFF.notNull(this.m_listener))
	{
		this.m_listener.onMoreButtonPressed(this, this.m_moreIcon);
	}
};

oFF.AuGdsQdUserActionItem = function() {};
oFF.AuGdsQdUserActionItem.prototype = new oFF.XObjectExt();
oFF.AuGdsQdUserActionItem.prototype._ff_c = "AuGdsQdUserActionItem";

oFF.AuGdsQdUserActionItem.prototype.m_name = null;
oFF.AuGdsQdUserActionItem.prototype.m_text = null;
oFF.AuGdsQdUserActionItem.prototype.m_icon = null;
oFF.AuGdsQdUserActionItem.prototype.m_enablementSupplier = null;
oFF.AuGdsQdUserActionItem.prototype.m_visibilitySupplier = null;
oFF.AuGdsQdUserActionItem.prototype.getName = function()
{
	return this.m_name;
};
oFF.AuGdsQdUserActionItem.prototype.setName = function(name)
{
	this.m_name = name;
};
oFF.AuGdsQdUserActionItem.prototype.getText = function()
{
	return this.m_text;
};
oFF.AuGdsQdUserActionItem.prototype.setText = function(text)
{
	this.m_text = text;
};
oFF.AuGdsQdUserActionItem.prototype.getActionGroup = function()
{
	return null;
};
oFF.AuGdsQdUserActionItem.prototype.getActionLeaf = function()
{
	return null;
};
oFF.AuGdsQdUserActionItem.prototype.getIcon = function()
{
	return this.m_icon;
};
oFF.AuGdsQdUserActionItem.prototype.setIcon = function(icon)
{
	this.m_icon = icon;
};
oFF.AuGdsQdUserActionItem.prototype.getEnablementSupplier = function()
{
	return this.m_enablementSupplier;
};
oFF.AuGdsQdUserActionItem.prototype.setEnablementSupplier = function(enablementSupplier)
{
	this.m_enablementSupplier = enablementSupplier;
};
oFF.AuGdsQdUserActionItem.prototype.getVisibilitySupplier = function()
{
	return this.m_visibilitySupplier;
};
oFF.AuGdsQdUserActionItem.prototype.setVisibilitySupplier = function(visibilitySupplier)
{
	this.m_visibilitySupplier = visibilitySupplier;
};

oFF.AuGdsQdContextMenuUtil = function() {};
oFF.AuGdsQdContextMenuUtil.prototype = new oFF.XObjectExt();
oFF.AuGdsQdContextMenuUtil.prototype._ff_c = "AuGdsQdContextMenuUtil";

oFF.AuGdsQdContextMenuUtil.renderSubMenuItems = function(menuToPopulate, userActionGroup)
{
	var subItems = userActionGroup.getSubItems();
	var sectionStart = true;
	for (var i = 0; i < subItems.size(); i++)
	{
		var subItem = subItems.get(i);
		if (subItem.getVisibilitySupplier() === null || subItem.getVisibilitySupplier()().getBoolean())
		{
			var group = subItem.getActionGroup();
			if (oFF.notNull(group) && oFF.XStringUtils.isNullOrEmpty(group.getName()))
			{
				oFF.AuGdsQdContextMenuUtil.renderSubMenuItems(menuToPopulate, group);
				sectionStart = true;
			}
			else
			{
				var menuItem = menuToPopulate.addNewItem();
				menuItem.setSectionStart(sectionStart);
				sectionStart = false;
				menuItem.setName(subItem.getName());
				menuItem.setText(subItem.getText());
				menuItem.setIcon(subItem.getIcon());
				menuItem.setEnabled(subItem.getEnablementSupplier() === null || subItem.getEnablementSupplier()().getBoolean());
				if (oFF.notNull(group))
				{
					oFF.AuGdsQdContextMenuUtil.renderSubMenuItems(menuItem, group);
				}
				var leaf = subItem.getActionLeaf();
				if (oFF.notNull(leaf))
				{
					menuItem.registerOnPress(oFF.AuGdsLambdaListener.create(leaf.getCommand()));
					if (subItem.getIcon() === null && leaf.getStatusSupplier() !== null)
					{
						if (leaf.getStatusSupplier()().getBoolean())
						{
							menuItem.setIcon("accept");
						}
					}
				}
			}
		}
	}
};
oFF.AuGdsQdContextMenuUtil.renderToolbarItems = function(toolbarToPopulate, userActionGroup)
{
	var subItems = userActionGroup.getSubItems();
	for (var i = 0; i < subItems.size(); i++)
	{
		var subItem = subItems.get(i);
		if (subItem.getVisibilitySupplier() === null || subItem.getVisibilitySupplier()().getBoolean())
		{
			var group = subItem.getActionGroup();
			var leaf = subItem.getActionLeaf();
			if (oFF.notNull(group))
			{
				oFF.AuGdsQdContextMenuUtil.renderToolbarItems(toolbarToPopulate, group);
			}
			else if (oFF.notNull(leaf))
			{
				if (i === 0)
				{
					toolbarToPopulate.addNewItemOfType(oFF.UiType.SPACER);
				}
				var button;
				if (leaf.getStatusSupplier() !== null)
				{
					button = toolbarToPopulate.addNewItemOfType(oFF.UiType.TOGGLE_BUTTON).setPressed(leaf.getStatusSupplier()().getBoolean());
				}
				else
				{
					button = toolbarToPopulate.addNewItemOfType(oFF.UiType.BUTTON);
				}
				button.setName(subItem.getName());
				button.setTooltip(subItem.getText());
				button.setIcon(subItem.getIcon());
				button.setEnabled(subItem.getEnablementSupplier() === null || subItem.getEnablementSupplier()().getBoolean());
				button.registerOnPress(oFF.AuGdsLambdaListener.create(leaf.getCommand()));
			}
		}
	}
};

oFF.AuGdsQdFilterPanel = function() {};
oFF.AuGdsQdFilterPanel.prototype = new oFF.XObjectExt();
oFF.AuGdsQdFilterPanel.prototype._ff_c = "AuGdsQdFilterPanel";

oFF.AuGdsQdFilterPanel.createFilterPanel = function(genesis)
{
	var obj = new oFF.AuGdsQdFilterPanel();
	obj.setupExt(genesis);
	return obj;
};
oFF.AuGdsQdFilterPanel.prototype.m_genesis = null;
oFF.AuGdsQdFilterPanel.prototype.m_filterList = null;
oFF.AuGdsQdFilterPanel.prototype.m_queryManager = null;
oFF.AuGdsQdFilterPanel.prototype.m_panel = null;
oFF.AuGdsQdFilterPanel.prototype.m_editActionListeners = null;
oFF.AuGdsQdFilterPanel.prototype.setupExt = function(genesis)
{
	this.m_genesis = genesis;
	this.m_editActionListeners = oFF.XList.create();
	this.m_filterList = this.m_genesis.newControl(oFF.UiType.LIST);
	this.m_filterList.useMaxSpace();
	this.m_filterList.setSelectionMode(oFF.UiSelectionMode.NONE);
	this.m_filterList.setBorderWidth(oFF.UiCssBoxEdges.create("0px"));
	this.m_panel = oFF.AuGdsPanel.createPanel(this.m_genesis, null);
	this.m_panel.setTitle("Filters");
	this.m_panel.setIcon("filter");
	this.m_panel.setContent(this.m_filterList);
};
oFF.AuGdsQdFilterPanel.prototype.releaseObject = function()
{
	this.m_editActionListeners.clear();
	this.m_editActionListeners = oFF.XObjectExt.release(this.m_editActionListeners);
	this.m_queryManager = null;
	this.m_genesis = null;
	this.m_filterList = oFF.XObjectExt.release(this.m_filterList);
	this.m_panel = oFF.XObjectExt.release(this.m_panel);
	oFF.XObjectExt.prototype.releaseObject.call( this );
};
oFF.AuGdsQdFilterPanel.prototype.addEditActionListener = function(editActionListener)
{
	this.m_editActionListeners.add(editActionListener);
};
oFF.AuGdsQdFilterPanel.prototype.removeEditActionListener = function(editActionListener)
{
	this.m_editActionListeners.removeElement(editActionListener);
};
oFF.AuGdsQdFilterPanel.prototype.getQueryManager = function()
{
	return this.m_queryManager;
};
oFF.AuGdsQdFilterPanel.prototype.getView = function()
{
	return this.m_panel.getView();
};
oFF.AuGdsQdFilterPanel.prototype.getGenesis = function()
{
	return this.m_genesis;
};
oFF.AuGdsQdFilterPanel.prototype.setQueryManager = function(manager)
{
	if (oFF.notNull(this.m_queryManager))
	{
		this.m_queryManager.getQueryModel().getFilter().unregisterChangedListener(this);
	}
	this.m_queryManager = manager;
	this.m_queryManager.getQueryModel().getFilter().registerChangedListener(this, null);
	this.m_filterList.clearItems();
	if (!this.m_queryManager.isSubmitNeeded())
	{
		this.updateFilterPanel();
	}
};
oFF.AuGdsQdFilterPanel.prototype.updateFilterPanel = function()
{
	this.m_filterList.clearItems();
	if (oFF.isNull(this.m_queryManager))
	{
		return;
	}
	var filter = this.m_queryManager.getQueryModel().getFilter();
	var dynamicFilter = filter.getDynamicFilter();
	if (dynamicFilter.isCartesianProduct() && dynamicFilter.getCartesianProduct() !== null)
	{
		var cartesianProduct = dynamicFilter.getCartesianProduct();
		for (var i = 0; i < cartesianProduct.size(); i++)
		{
			var cartesianChild = cartesianProduct.getCartesianChild(i);
			var dimensionEntry = this.createDimensionEntry(cartesianProduct, cartesianChild);
			this.m_filterList.addItem(dimensionEntry);
			for (var j = 0; j < cartesianChild.size(); j++)
			{
				var cartesianElement = cartesianChild.getOp(j);
				var filterEntry = this.createFilterEntry(cartesianProduct, cartesianChild, cartesianElement);
				if (oFF.isNull(filterEntry))
				{
					continue;
				}
				this.m_filterList.addItem(filterEntry);
			}
		}
	}
};
oFF.AuGdsQdFilterPanel.prototype.createDimensionEntry = function(parent, cartesianList)
{
	var dimension = cartesianList.getDimension();
	var dimensionItem = this.m_genesis.newControl(oFF.UiType.CUSTOM_LIST_ITEM);
	var content = dimensionItem.setNewContent(oFF.UiType.FLEX_LAYOUT);
	content.setJustifyContent(oFF.UiFlexJustifyContent.SPACE_BETWEEN);
	content.setAlignContent(oFF.UiFlexAlignContent.CENTER);
	content.useMaxWidth();
	content.setHeight(oFF.UiCssLength.create("48px"));
	content.setPadding(oFF.UiCssBoxEdges.create("5px"));
	content.setBackgroundColor(oFF.UiColor.GREY.newBrighterColor(0.3));
	var title = content.addNewItemOfType(oFF.UiType.LABEL);
	title.setText(dimension.getText());
	title.setFontWeight(oFF.UiFontWeight.BOLD);
	title.setMargin(oFF.UiCssBoxEdges.create("5px"));
	var deleteIco = content.addNewItemOfType(oFF.UiType.ICON);
	deleteIco.setIcon("sys-cancel");
	deleteIco.setTooltip("Remove all dimension filters");
	deleteIco.setColor(oFF.UiColor.RED.newDarkerColor(0.2));
	deleteIco.setSize(oFF.UiSize.createByCss("16px", "16px"));
	deleteIco.registerOnPress(oFF.AuGdsLambdaListener.create( function(){
		parent.removeElement(cartesianList);
		this.notifyEditActionListeners();
	}.bind(this)));
	return dimensionItem;
};
oFF.AuGdsQdFilterPanel.prototype.createFilterEntry = function(grandParent, parent, element)
{
	var dimension = parent.getDimension();
	var filterEntry = this.m_genesis.newControl(oFF.UiType.CUSTOM_LIST_ITEM);
	var content = filterEntry.setNewContent(oFF.UiType.FLEX_LAYOUT);
	content.setJustifyContent(oFF.UiFlexJustifyContent.SPACE_BETWEEN);
	content.setAlignContent(oFF.UiFlexAlignContent.CENTER);
	content.setHeight(oFF.UiCssLength.create("32px"));
	content.setPadding(oFF.UiCssBoxEdges.create("5px"));
	var startSpacer = content.addNewItemOfType(oFF.UiType.SPACER);
	startSpacer.setFlex("0 0 20px");
	var comparisonOperator = element.getComparisonOperator();
	if (oFF.isNull(comparisonOperator))
	{
		return null;
	}
	var setSign = element.getSetSign();
	if (setSign === oFF.SetSign.EXCLUDING)
	{
		if (comparisonOperator === oFF.ComparisonOperator.EQUAL)
		{
			comparisonOperator = oFF.ComparisonOperator.NOT_EQUAL;
		}
		if (comparisonOperator === oFF.ComparisonOperator.BETWEEN)
		{
			comparisonOperator = oFF.ComparisonOperator.NOT_BETWEEN;
		}
	}
	var operatorLbl = content.addNewItemOfType(oFF.UiType.LABEL);
	operatorLbl.setText(comparisonOperator.getName());
	operatorLbl.setFlex("1 0 40%");
	var lowLbl = content.addNewItemOfType(oFF.UiType.LABEL);
	lowLbl.setFlex("1 1 30%");
	var low = element.getLow();
	var lowText = this.getDisplayText(dimension, low);
	if (oFF.notNull(lowText))
	{
		lowLbl.setText(lowText);
	}
	var highLbl = content.addNewItemOfType(oFF.UiType.LABEL);
	highLbl.setFlex("1 1 30%");
	var high = element.getHigh();
	var highText = this.getDisplayText(dimension, high);
	if (oFF.notNull(highText))
	{
		highLbl.setText(highText);
	}
	var deleteIco = content.addNewItemOfType(oFF.UiType.ICON);
	deleteIco.setIcon("sys-cancel");
	deleteIco.setTooltip("Remove filter");
	deleteIco.setColor(oFF.UiColor.ORANGE.newDarkerColor(0.2));
	deleteIco.setHeight(oFF.UiCssLength.create("16px"));
	deleteIco.setFlex("0 0 16px");
	deleteIco.registerOnPress(oFF.AuGdsLambdaListener.create( function(){
		parent.removeElement(element);
		if (parent.size() === 0)
		{
			grandParent.removeElement(parent);
		}
		this.notifyEditActionListeners();
	}.bind(this)));
	return filterEntry;
};
oFF.AuGdsQdFilterPanel.prototype.notifyEditActionListeners = function()
{
	for (var i = 0; i < this.m_editActionListeners.size(); i++)
	{
		this.m_editActionListeners.get(i).notifyEditAction();
	}
};
oFF.AuGdsQdFilterPanel.prototype.getDisplayText = function(dimension, bag)
{
	var textField = dimension.getTextField();
	if (oFF.notNull(textField))
	{
		var text = bag.getSupplementValueString(textField.getName());
		if (oFF.XStringUtils.isNotNullAndNotEmpty(text))
		{
			return text;
		}
	}
	var value = bag.getValue();
	if (oFF.notNull(value))
	{
		return value.getStringRepresentation();
	}
	return null;
};
oFF.AuGdsQdFilterPanel.prototype.onModelComponentChanged = function(modelComponent, customIdentifier)
{
	this.updateFilterPanel();
};
oFF.AuGdsQdFilterPanel.prototype.clearEditActionListeners = function()
{
	this.m_editActionListeners.clear();
};

oFF.AuGdsQdTableConfig = function() {};
oFF.AuGdsQdTableConfig.prototype = new oFF.XObjectExt();
oFF.AuGdsQdTableConfig.prototype._ff_c = "AuGdsQdTableConfig";

oFF.AuGdsQdTableConfig.create = function()
{
	var instance = new oFF.AuGdsQdTableConfig();
	instance.setShowDimensionTitles(true);
	instance.setShowTableDetails(false);
	instance.setShowTableTitle(false);
	instance.setShowSubTitle(false);
	instance.setWidth(1257);
	instance.setHeight(451);
	return instance;
};
oFF.AuGdsQdTableConfig.prototype.m_freezeRows = false;
oFF.AuGdsQdTableConfig.prototype.m_freezeColumns = false;
oFF.AuGdsQdTableConfig.prototype.m_showGrid = false;
oFF.AuGdsQdTableConfig.prototype.m_showTableTitle = false;
oFF.AuGdsQdTableConfig.prototype.m_showSubTitle = false;
oFF.AuGdsQdTableConfig.prototype.m_showTableDetails = false;
oFF.AuGdsQdTableConfig.prototype.m_showFreezeLines = false;
oFF.AuGdsQdTableConfig.prototype.m_title = null;
oFF.AuGdsQdTableConfig.prototype.m_totalLevel6Color = null;
oFF.AuGdsQdTableConfig.prototype.m_totalLevel5Color = null;
oFF.AuGdsQdTableConfig.prototype.m_totalLevel4Color = null;
oFF.AuGdsQdTableConfig.prototype.m_totalLevel3Color = null;
oFF.AuGdsQdTableConfig.prototype.m_totalLevel2Color = null;
oFF.AuGdsQdTableConfig.prototype.m_totalLevel1Color = null;
oFF.AuGdsQdTableConfig.prototype.m_totalLevel0Color = null;
oFF.AuGdsQdTableConfig.prototype.m_headerColor = null;
oFF.AuGdsQdTableConfig.prototype.m_showFormulas = false;
oFF.AuGdsQdTableConfig.prototype.m_showDimensionTitles = false;
oFF.AuGdsQdTableConfig.prototype.m_showReferences = false;
oFF.AuGdsQdTableConfig.prototype.m_showCoordinateHeader = false;
oFF.AuGdsQdTableConfig.prototype.m_repetitiveMemberNames = false;
oFF.AuGdsQdTableConfig.prototype.m_width = 0;
oFF.AuGdsQdTableConfig.prototype.m_height = 0;
oFF.AuGdsQdTableConfig.prototype.isFreezeRows = function()
{
	return this.m_freezeRows;
};
oFF.AuGdsQdTableConfig.prototype.setFreezeRows = function(freezeRows)
{
	this.m_freezeRows = freezeRows;
};
oFF.AuGdsQdTableConfig.prototype.isFreezeColumns = function()
{
	return this.m_freezeColumns;
};
oFF.AuGdsQdTableConfig.prototype.setFreezeColumns = function(freezeColumns)
{
	this.m_freezeColumns = freezeColumns;
};
oFF.AuGdsQdTableConfig.prototype.isFreeze = function()
{
	return this.m_freezeColumns || this.m_freezeRows;
};
oFF.AuGdsQdTableConfig.prototype.setFreeze = function(freeze)
{
	this.m_freezeColumns = freeze;
	this.m_freezeRows = freeze;
};
oFF.AuGdsQdTableConfig.prototype.isShowGrid = function()
{
	return this.m_showGrid;
};
oFF.AuGdsQdTableConfig.prototype.setShowGrid = function(showGrid)
{
	this.m_showGrid = showGrid;
};
oFF.AuGdsQdTableConfig.prototype.isShowTableTitle = function()
{
	return this.m_showTableTitle;
};
oFF.AuGdsQdTableConfig.prototype.setShowTableTitle = function(showTableTitle)
{
	this.m_showTableTitle = showTableTitle;
};
oFF.AuGdsQdTableConfig.prototype.isShowSubTitle = function()
{
	return this.m_showSubTitle;
};
oFF.AuGdsQdTableConfig.prototype.setShowSubTitle = function(showSubTitle)
{
	this.m_showSubTitle = showSubTitle;
};
oFF.AuGdsQdTableConfig.prototype.isShowTableDetails = function()
{
	return this.m_showTableDetails;
};
oFF.AuGdsQdTableConfig.prototype.setShowTableDetails = function(showTableDetails)
{
	this.m_showTableDetails = showTableDetails;
};
oFF.AuGdsQdTableConfig.prototype.isShowFormulas = function()
{
	return this.m_showFormulas;
};
oFF.AuGdsQdTableConfig.prototype.setShowFormulas = function(showFormulas)
{
	this.m_showFormulas = showFormulas;
};
oFF.AuGdsQdTableConfig.prototype.isShowDimensionTitles = function()
{
	return this.m_showDimensionTitles;
};
oFF.AuGdsQdTableConfig.prototype.setShowDimensionTitles = function(showDimensionTitles)
{
	this.m_showDimensionTitles = showDimensionTitles;
};
oFF.AuGdsQdTableConfig.prototype.isShowCoordinateHeader = function()
{
	return this.m_showCoordinateHeader;
};
oFF.AuGdsQdTableConfig.prototype.setShowCoordinateHeader = function(showSpreadSheetHeaders)
{
	this.m_showCoordinateHeader = showSpreadSheetHeaders;
};
oFF.AuGdsQdTableConfig.prototype.isColorateDimensionTitles = function()
{
	return oFF.XStringUtils.isNotNullAndNotEmpty(this.m_headerColor);
};
oFF.AuGdsQdTableConfig.prototype.setColorateDimensionTitles = function(colorateDimensionTitles)
{
	this.m_headerColor = colorateDimensionTitles ? "rgba(173, 212, 216, 1)" : null;
};
oFF.AuGdsQdTableConfig.prototype.isColorateTotals = function()
{
	return oFF.XStringUtils.isNotNullAndNotEmpty(this.m_totalLevel0Color) && oFF.XStringUtils.isNotNullAndNotEmpty(this.m_totalLevel1Color) && oFF.XStringUtils.isNotNullAndNotEmpty(this.m_totalLevel2Color) && oFF.XStringUtils.isNotNullAndNotEmpty(this.m_totalLevel3Color) && oFF.XStringUtils.isNotNullAndNotEmpty(this.m_totalLevel4Color) && oFF.XStringUtils.isNotNullAndNotEmpty(this.m_totalLevel5Color);
};
oFF.AuGdsQdTableConfig.prototype.setColorateTotals = function(colorateTotals)
{
	this.m_totalLevel5Color = colorateTotals ? "rgba(220,220,150,0,3)" : null;
	this.m_totalLevel4Color = colorateTotals ? "rgba(230,230,150,0,4)" : null;
	this.m_totalLevel3Color = colorateTotals ? "rgba(220,220,135,0.4)" : null;
	this.m_totalLevel2Color = colorateTotals ? "rgba(220,220,135,0.5)" : null;
	this.m_totalLevel1Color = colorateTotals ? "rgba(220,220,220,1)" : null;
	this.m_totalLevel0Color = colorateTotals ? "rgba(204,204,204,1)" : null;
};
oFF.AuGdsQdTableConfig.prototype.isRepetitiveMemberNames = function()
{
	return this.m_repetitiveMemberNames;
};
oFF.AuGdsQdTableConfig.prototype.setRepetitiveMemberNames = function(repetitiveMemberNames)
{
	this.m_repetitiveMemberNames = repetitiveMemberNames;
};
oFF.AuGdsQdTableConfig.prototype.isShowFreezeLines = function()
{
	return this.m_showFreezeLines;
};
oFF.AuGdsQdTableConfig.prototype.setShowFreezeLines = function(showFreezeLines)
{
	this.m_showFreezeLines = showFreezeLines;
};
oFF.AuGdsQdTableConfig.prototype.isShowReferences = function()
{
	return this.m_showReferences;
};
oFF.AuGdsQdTableConfig.prototype.setShowReferences = function(showReferences)
{
	this.m_showReferences = showReferences;
};
oFF.AuGdsQdTableConfig.prototype.getWidth = function()
{
	return this.m_width;
};
oFF.AuGdsQdTableConfig.prototype.setWidth = function(width)
{
	this.m_width = width;
};
oFF.AuGdsQdTableConfig.prototype.getHeight = function()
{
	return this.m_height;
};
oFF.AuGdsQdTableConfig.prototype.setHeight = function(height)
{
	this.m_height = height;
};
oFF.AuGdsQdTableConfig.prototype.getTotalLevel6Color = function()
{
	return this.m_totalLevel6Color;
};
oFF.AuGdsQdTableConfig.prototype.setTotalLevel6Color = function(totalLevel6Color)
{
	this.m_totalLevel6Color = totalLevel6Color;
};
oFF.AuGdsQdTableConfig.prototype.getTotalLevel5Color = function()
{
	return this.m_totalLevel5Color;
};
oFF.AuGdsQdTableConfig.prototype.setTotalLevel5Color = function(totalLevel5Color)
{
	this.m_totalLevel5Color = totalLevel5Color;
};
oFF.AuGdsQdTableConfig.prototype.getTotalLevel4Color = function()
{
	return this.m_totalLevel4Color;
};
oFF.AuGdsQdTableConfig.prototype.setTotalLevel4Color = function(totalLevel4Color)
{
	this.m_totalLevel4Color = totalLevel4Color;
};
oFF.AuGdsQdTableConfig.prototype.getTotalLevel3Color = function()
{
	return this.m_totalLevel3Color;
};
oFF.AuGdsQdTableConfig.prototype.setTotalLevel3Color = function(totalLevel3Color)
{
	this.m_totalLevel3Color = totalLevel3Color;
};
oFF.AuGdsQdTableConfig.prototype.getTotalLevel2Color = function()
{
	return this.m_totalLevel2Color;
};
oFF.AuGdsQdTableConfig.prototype.setTotalLevel2Color = function(totalLevel2Color)
{
	this.m_totalLevel2Color = totalLevel2Color;
};
oFF.AuGdsQdTableConfig.prototype.getTotalLevel1Color = function()
{
	return this.m_totalLevel1Color;
};
oFF.AuGdsQdTableConfig.prototype.setTotalLevel1Color = function(totalLevel1Color)
{
	this.m_totalLevel1Color = totalLevel1Color;
};
oFF.AuGdsQdTableConfig.prototype.getTotalLevel0Color = function()
{
	return this.m_totalLevel0Color;
};
oFF.AuGdsQdTableConfig.prototype.setTotalLevel0Color = function(totalLevel0Color)
{
	this.m_totalLevel0Color = totalLevel0Color;
};
oFF.AuGdsQdTableConfig.prototype.getHeaderColor = function()
{
	return this.m_headerColor;
};
oFF.AuGdsQdTableConfig.prototype.setHeaderColor = function(m_headerColor)
{
	this.m_headerColor = m_headerColor;
};
oFF.AuGdsQdTableConfig.prototype.getTitle = function()
{
	return this.m_title;
};
oFF.AuGdsQdTableConfig.prototype.setTitle = function(title)
{
	this.m_title = title;
};
oFF.AuGdsQdTableConfig.prototype.serializeToStructure = function()
{
	var result = oFF.PrFactory.createStructure();
	result.putBoolean(oFF.SacTableConstants.B_FREEZE_ROWS, this.m_freezeRows);
	result.putBoolean(oFF.SacTableConstants.B_FREEZE_COLUMNS, this.m_freezeColumns);
	result.putBoolean(oFF.SacTableConstants.B_SHOW_FREEZE_LINES, this.m_showFreezeLines);
	result.putBoolean(oFF.SacTableConstants.B_SHOW_GRID, this.m_showGrid);
	result.putBoolean(oFF.SacTableConstants.B_SHOW_TABLE_TITLE, this.m_showTableTitle);
	result.putBoolean(oFF.SacTableConstants.B_SHOW_TABLE_DETAILS, this.m_showTableDetails);
	result.putBoolean(oFF.SacTableConstants.B_SHOW_SUBTITLE, this.m_showSubTitle);
	result.putBoolean(oFF.SacTableConstants.B_SHOW_FORMULAS, this.m_showFormulas);
	result.putBoolean(oFF.SacTableConstants.B_DIMENSION_TITLES, this.m_showDimensionTitles);
	result.putBoolean(oFF.SacTableConstants.B_REPETITIVE_MEMBER_NAMES, this.m_repetitiveMemberNames);
	result.putBoolean(oFF.SacTableConstants.B_COORDINATE_HEADER, this.m_showCoordinateHeader);
	result.putBoolean(oFF.SacTableConstants.B_SHOW_REFERENCES, this.m_showCoordinateHeader);
	result.putInteger(oFF.SacTableConstants.I_WIDTH, this.m_width);
	result.putInteger(oFF.SacTableConstants.I_HEIGHT, this.m_height);
	result.putStringNotNullAndNotEmpty(oFF.SacTableConstants.S_HEADER_COLOR, this.m_headerColor);
	result.putStringNotNullAndNotEmpty(oFF.SacTableConstants.S_TOTAL_LEVEL_6_COLOR, this.m_totalLevel6Color);
	result.putStringNotNullAndNotEmpty(oFF.SacTableConstants.S_TOTAL_LEVEL_5_COLOR, this.m_totalLevel5Color);
	result.putStringNotNullAndNotEmpty(oFF.SacTableConstants.S_TOTAL_LEVEL_4_COLOR, this.m_totalLevel4Color);
	result.putStringNotNullAndNotEmpty(oFF.SacTableConstants.S_TOTAL_LEVEL_3_COLOR, this.m_totalLevel3Color);
	result.putStringNotNullAndNotEmpty(oFF.SacTableConstants.S_TOTAL_LEVEL_2_COLOR, this.m_totalLevel2Color);
	result.putStringNotNullAndNotEmpty(oFF.SacTableConstants.S_TOTAL_LEVEL_1_COLOR, this.m_totalLevel1Color);
	result.putStringNotNullAndNotEmpty(oFF.SacTableConstants.S_TOTAL_LEVEL_0_COLOR, this.m_totalLevel0Color);
	result.putStringNotNullAndNotEmpty(oFF.SacTableConstants.S_TITLE, this.m_title);
	return result;
};
oFF.AuGdsQdTableConfig.prototype.serializeToString = function()
{
	return oFF.PrUtils.serialize(this.serializeToStructure(), true, false, 0);
};
oFF.AuGdsQdTableConfig.prototype.deserializeFromString = function(string)
{
	return this.deserializeFromStructre(oFF.JsonParserFactory.createFromString(string).asStructure());
};
oFF.AuGdsQdTableConfig.prototype.deserializeFromStructre = function(structure)
{
	this.m_freezeRows = structure.getBooleanByKey(oFF.SacTableConstants.B_FREEZE_ROWS);
	this.m_freezeColumns = structure.getBooleanByKey(oFF.SacTableConstants.B_FREEZE_COLUMNS);
	this.m_showFreezeLines = structure.getBooleanByKey(oFF.SacTableConstants.B_SHOW_FREEZE_LINES);
	this.m_showGrid = structure.getBooleanByKey(oFF.SacTableConstants.B_SHOW_GRID);
	this.m_showTableTitle = structure.getBooleanByKeyExt(oFF.SacTableConstants.B_SHOW_TABLE_TITLE, true);
	this.m_showTableDetails = structure.getBooleanByKeyExt(oFF.SacTableConstants.B_SHOW_TABLE_DETAILS, false);
	this.m_showSubTitle = structure.getBooleanByKeyExt(oFF.SacTableConstants.B_SHOW_SUBTITLE, false);
	this.m_showFormulas = structure.getBooleanByKey(oFF.SacTableConstants.B_SHOW_FORMULAS);
	this.m_showDimensionTitles = structure.getBooleanByKeyExt(oFF.SacTableConstants.B_DIMENSION_TITLES, true);
	this.m_repetitiveMemberNames = structure.getBooleanByKey(oFF.SacTableConstants.B_REPETITIVE_MEMBER_NAMES);
	this.m_showCoordinateHeader = structure.getBooleanByKey(oFF.SacTableConstants.B_COORDINATE_HEADER);
	this.m_showCoordinateHeader = structure.getBooleanByKey(oFF.SacTableConstants.B_SHOW_REFERENCES);
	this.m_headerColor = structure.getStringByKey(oFF.SacTableConstants.S_HEADER_COLOR);
	this.m_totalLevel6Color = structure.getStringByKey(oFF.SacTableConstants.S_TOTAL_LEVEL_6_COLOR);
	this.m_totalLevel5Color = structure.getStringByKey(oFF.SacTableConstants.S_TOTAL_LEVEL_5_COLOR);
	this.m_totalLevel4Color = structure.getStringByKey(oFF.SacTableConstants.S_TOTAL_LEVEL_4_COLOR);
	this.m_totalLevel3Color = structure.getStringByKey(oFF.SacTableConstants.S_TOTAL_LEVEL_3_COLOR);
	this.m_totalLevel2Color = structure.getStringByKey(oFF.SacTableConstants.S_TOTAL_LEVEL_2_COLOR);
	this.m_totalLevel1Color = structure.getStringByKey(oFF.SacTableConstants.S_TOTAL_LEVEL_1_COLOR);
	this.m_totalLevel0Color = structure.getStringByKey(oFF.SacTableConstants.S_TOTAL_LEVEL_0_COLOR);
	this.m_title = structure.getStringByKey(oFF.SacTableConstants.S_TITLE);
	this.m_width = structure.getIntegerByKeyExt(oFF.SacTableConstants.I_WIDTH, 1257);
	this.m_height = structure.getIntegerByKeyExt(oFF.SacTableConstants.I_HEIGHT, 451);
	return this;
};
oFF.AuGdsQdTableConfig.prototype.setSacStyle = function()
{
	this.setColorateTotals(false);
	this.setColorateDimensionTitles(false);
	this.setShowSubTitle(true);
	this.setShowTableDetails(true);
	this.setShowDimensionTitles(true);
	this.setRepetitiveMemberNames(false);
	this.setShowFormulas(false);
	this.setShowGrid(false);
	this.setShowFreezeLines(false);
	this.setFreezeRows(false);
	this.setFreezeColumns(false);
	this.setShowCoordinateHeader(false);
};
oFF.AuGdsQdTableConfig.prototype.setSpreadsheetStyle = function()
{
	this.setColorateTotals(false);
	this.setColorateDimensionTitles(false);
	this.setShowSubTitle(false);
	this.setShowTableDetails(false);
	this.setShowDimensionTitles(true);
	this.setRepetitiveMemberNames(true);
	this.setShowFormulas(false);
	this.setShowGrid(true);
	this.setShowFreezeLines(false);
	this.setFreezeRows(false);
	this.setFreezeColumns(false);
	this.setShowCoordinateHeader(true);
};
oFF.AuGdsQdTableConfig.prototype.setFinanceStyle = function()
{
	this.setColorateTotals(true);
	this.setColorateDimensionTitles(true);
	this.setShowSubTitle(false);
	this.setShowTableDetails(false);
	this.setShowDimensionTitles(false);
	this.setRepetitiveMemberNames(false);
	this.setShowFormulas(false);
	this.setShowGrid(false);
	this.setShowFreezeLines(true);
	this.setFreezeRows(true);
	this.setFreezeColumns(true);
	this.setShowCoordinateHeader(false);
};

oFF.AuGdsQdInteractiveTableContextActionsHelper = function() {};
oFF.AuGdsQdInteractiveTableContextActionsHelper.prototype = new oFF.XObjectExt();
oFF.AuGdsQdInteractiveTableContextActionsHelper.prototype._ff_c = "AuGdsQdInteractiveTableContextActionsHelper";

oFF.AuGdsQdInteractiveTableContextActionsHelper.MOVE_CONTEXT_MENU = "moveContextMenu";
oFF.AuGdsQdInteractiveTableContextActionsHelper.HIERARCHY_CONTEXT_MENU = "hierarchyContextMenu";
oFF.AuGdsQdInteractiveTableContextActionsHelper.TOTALS_CONTEXT_MENU = "totalsContextMenu";
oFF.AuGdsQdInteractiveTableContextActionsHelper.SORT_CONTEXT_MENU = "sortContextMenu";
oFF.AuGdsQdInteractiveTableContextActionsHelper.GRID_SETTINGS_MENU = "GRID_SETTINGS_MENU";
oFF.AuGdsQdInteractiveTableContextActionsHelper.FREEZE_ROWS_MENU = "FREEZE_ROWS";
oFF.AuGdsQdInteractiveTableContextActionsHelper.FREEZE_ALL_MENU = "FREEZE_ALL";
oFF.AuGdsQdInteractiveTableContextActionsHelper.FREEZE_COLUMNS_MENU = "FREEZE_COLUMNS";
oFF.AuGdsQdInteractiveTableContextActionsHelper.FREEZE_MENU = "freezeMenu";
oFF.AuGdsQdInteractiveTableContextActionsHelper.SHOW_HIDE_MENU = "showHideMenu";
oFF.AuGdsQdInteractiveTableContextActionsHelper.SHOW_GRID_MENU = "SHOW_GRID";
oFF.AuGdsQdInteractiveTableContextActionsHelper.SHOW_TABLE_TITLE_MENU = "SHOW_TABLE_TITLE";
oFF.AuGdsQdInteractiveTableContextActionsHelper.SHOW_TABLE_DETAILS_MENU = "SHOW_TABLE_DETAILS";
oFF.AuGdsQdInteractiveTableContextActionsHelper.DIMENSION_TITLES_MENU = "SHOW_DIMENSION_TITLES";
oFF.AuGdsQdInteractiveTableContextActionsHelper.REPETITIVE_MEMBER_NAMES_MENU = "SHOW_REPETITIVE_MEMBER_NAMES";
oFF.AuGdsQdInteractiveTableContextActionsHelper.COORDINATE_HEADER_MENU = "SHOW_COORDINATE_HEADER";
oFF.AuGdsQdInteractiveTableContextActionsHelper.FREEZE_LINES_MENU = "freezeLinesMenu";
oFF.AuGdsQdInteractiveTableContextActionsHelper.COLORATE_DIMENSION_TITLES_MENU = "colorateDimensionTitlesMenu";
oFF.AuGdsQdInteractiveTableContextActionsHelper.COLORATE_TOTALS_MENU = "colorateTotalsMenu";
oFF.AuGdsQdInteractiveTableContextActionsHelper.THEME_MENU = "ThemeMenu";
oFF.AuGdsQdInteractiveTableContextActionsHelper.SELECT_CONVERSION_MENU = "selectConversionMenu";
oFF.AuGdsQdInteractiveTableContextActionsHelper.SAC_STYLE_MENU = "SACStyleMenu";
oFF.AuGdsQdInteractiveTableContextActionsHelper.SPREADSHEET_STYLE_MENU = "SpreadSheetStyleMenu";
oFF.AuGdsQdInteractiveTableContextActionsHelper.AUDITORS_STYLE_MENU = "AuditorsSheetStyleMenu";
oFF.AuGdsQdInteractiveTableContextActionsHelper.EXPAND_MENU = "expand";
oFF.AuGdsQdInteractiveTableContextActionsHelper.DRILL_MENU = "drill";
oFF.AuGdsQdInteractiveTableContextActionsHelper.COLLAPSE_MENU = "collapse";
oFF.AuGdsQdInteractiveTableContextActionsHelper.DIMENSION_CONTEXT_MENU = "dimensionContextMenu";
oFF.AuGdsQdInteractiveTableContextActionsHelper.LAYOUT_BTN = "layoutBtn";
oFF.AuGdsQdInteractiveTableContextActionsHelper.MEASURE_SETTINGS_MENU = "measureSettings";
oFF.AuGdsQdInteractiveTableContextActionsHelper.SECONDARY_STRUCTURE_MEMBER_SETTINGS_MENU = "secondaryStructureMemberSettings";
oFF.AuGdsQdInteractiveTableContextActionsHelper.ACTIVATE_UDH_MENU = "activateUdhMenu";
oFF.AuGdsQdInteractiveTableContextActionsHelper.TOTALS_ABOVE_MENU = "totalsAboveMenu";
oFF.AuGdsQdInteractiveTableContextActionsHelper.TOTALS_ABOVE_AND_BELOW_MENU = "totalsAboveAndBelowMenu";
oFF.AuGdsQdInteractiveTableContextActionsHelper.TOTALS_BELOW_MENU = "totalsBelowMenu";
oFF.AuGdsQdInteractiveTableContextActionsHelper.HIDE_TOTALS_MENU = "hideTotalsMenu";
oFF.AuGdsQdInteractiveTableContextActionsHelper.SUPPRESS_ZEROS_MENU = "suppressZerosMenu";
oFF.AuGdsQdInteractiveTableContextActionsHelper.MOVE_TO_COL_MENU = "moveToColMenu";
oFF.AuGdsQdInteractiveTableContextActionsHelper.MOVE_TO_ROW_MENU = "moveToRowMenu";
oFF.AuGdsQdInteractiveTableContextActionsHelper.MOVE_TO_FREE_MENU = "moveToFreeMenu";
oFF.AuGdsQdInteractiveTableContextActionsHelper.LEVEL_UP_MENU = "levelUpMenu";
oFF.AuGdsQdInteractiveTableContextActionsHelper.LEVEL_DOWN_MENU = "levelDownMenu";
oFF.AuGdsQdInteractiveTableContextActionsHelper.FILTER_CONTEXT_MENU = "filterContextMenu";
oFF.AuGdsQdInteractiveTableContextActionsHelper.FILTER_SELECTION_CONTEXT_MENU = "filterSelectionContextMenu";
oFF.AuGdsQdInteractiveTableContextActionsHelper.FILTER_CLEAR_MENU = "filterClearMenu";
oFF.AuGdsQdInteractiveTableContextActionsHelper.SORT_ASC_MENU = "sortAscMenu";
oFF.AuGdsQdInteractiveTableContextActionsHelper.SORT_DESC_MENU = "sortDescMenu";
oFF.AuGdsQdInteractiveTableContextActionsHelper.SORT_DEFAULT_MENU = "sortDefaultMenu";
oFF.AuGdsQdInteractiveTableContextActionsHelper.FLAT_PRESENTATION_MENU = "flatPresentationMenu";
oFF.AuGdsQdInteractiveTableContextActionsHelper.EXPAND_BOTTOM_UP_MENU = "expandBottomUpMenu";
oFF.AuGdsQdInteractiveTableContextActionsHelper.ACTIVATE_NODE_CONDENSATION_MENU = "activateNodeCondensationMenu";
oFF.AuGdsQdInteractiveTableContextActionsHelper.SHOW_POSTED_NODES_MENU = "showPostedNodesMenu";
oFF.AuGdsQdInteractiveTableContextActionsHelper.MEMBER_TO_LEFT_MENU = "memberLeftMenu";
oFF.AuGdsQdInteractiveTableContextActionsHelper.MEMBER_TO_RIGHT_MENU = "memberRightMenu";
oFF.AuGdsQdInteractiveTableContextActionsHelper.SWAP_AXIS = "swapAxis";
oFF.AuGdsQdInteractiveTableContextActionsHelper.ROW_CONTEXT_MENU = "rowContextMenu";
oFF.AuGdsQdInteractiveTableContextActionsHelper.COLUMN_CONTEXT_MENU = "columnContextMenu";
oFF.AuGdsQdInteractiveTableContextActionsHelper.QUERY_CONTEXT_MENU = "queryContextMenu";
oFF.AuGdsQdInteractiveTableContextActionsHelper.READMODE_CONTEXT_MENU = "readmodeContextMenu";
oFF.AuGdsQdInteractiveTableContextActionsHelper.PRESENTATION_MENU = "presentationMenu";
oFF.AuGdsQdInteractiveTableContextActionsHelper.PRESENTATION_SORT_MENU = "presentationSortMenu";
oFF.AuGdsQdInteractiveTableContextActionsHelper.NO_PRESENTATION = "noPresentation";
oFF.AuGdsQdInteractiveTableContextActionsHelper.KEY_PRESENTATION = "keyPresentation";
oFF.AuGdsQdInteractiveTableContextActionsHelper.TEXT_PRESENTATION = "textPresentation";
oFF.AuGdsQdInteractiveTableContextActionsHelper.KEY_TEXT_PRESENTATION = "keyTextPresentation";
oFF.AuGdsQdInteractiveTableContextActionsHelper.TEXT_KEY_PRESENTATION = "textKeyPresentation";
oFF.AuGdsQdInteractiveTableContextActionsHelper.KEY_VIEWS = "keyViews";
oFF.AuGdsQdInteractiveTableContextActionsHelper.TEXT_VIEWS = "textViews";
oFF.AuGdsQdInteractiveTableContextActionsHelper.ATTRIBUTES_MENU = "attributesMenu";
oFF.AuGdsQdInteractiveTableContextActionsHelper.FIELD_MENU = "fieldsMenu";
oFF.AuGdsQdInteractiveTableContextActionsHelper.DIMENSIONS_CONTEXT_MENU = "DimensionsContextMenu";
oFF.AuGdsQdInteractiveTableContextActionsHelper.FULL_EXPANSION_MENU = "fullExpansionMenu";
oFF.AuGdsQdInteractiveTableContextActionsHelper.ROOT_NODE_EXPANSION_MENU = "rootNodeExpansionMenu";
oFF.AuGdsQdInteractiveTableContextActionsHelper.L1_NODE_EXPANSION_MENU = "l1NodeExpansionMenu";
oFF.AuGdsQdInteractiveTableContextActionsHelper.L2_NODE_EXPANSION_MENU = "l2NodeExpansionMenu";
oFF.AuGdsQdInteractiveTableContextActionsHelper.L3_NODE_EXPANSION_MENU = "l3NodeExpansionMenu";
oFF.AuGdsQdInteractiveTableContextActionsHelper.L4_NODE_EXPANSION_MENU = "l4NodeExpansionMenu";
oFF.AuGdsQdInteractiveTableContextActionsHelper.L5_NODE_EXPANSION_MENU = "l5NodeExpansionMenu";
oFF.AuGdsQdInteractiveTableContextActionsHelper.FULL_P_EXPANSION_MENU = "fullPExpansionMenu";
oFF.AuGdsQdInteractiveTableContextActionsHelper.UDH_SUBMENU = "udhSubmenu";
oFF.AuGdsQdInteractiveTableContextActionsHelper.UDH_FULL_EXPAND_MENU = "udhFullExpansionMenu";
oFF.AuGdsQdInteractiveTableContextActionsHelper.UDH_ROOT_EXPAND_MENU = "udhRootExpansionMenu";
oFF.AuGdsQdInteractiveTableContextActionsHelper.UDH_L1_EXPAND_MENU = "udhL1ExpansionMenu";
oFF.AuGdsQdInteractiveTableContextActionsHelper.UDH_L2_EXPAND_MENU = "udhL2ExpansionMenu";
oFF.AuGdsQdInteractiveTableContextActionsHelper.UDH_L3_EXPAND_MENU = "udhL3ExpansionMenu";
oFF.AuGdsQdInteractiveTableContextActionsHelper.UDH_L4_EXPAND_MENU = "udhL4ExpansionMenu";
oFF.AuGdsQdInteractiveTableContextActionsHelper.UDH_L5_EXPAND_MENU = "udhL5ExpansionMenu";
oFF.AuGdsQdInteractiveTableContextActionsHelper.HIERARCHY_DIALOG = "hierarchyDialog";
oFF.AuGdsQdInteractiveTableContextActionsHelper.EXPAND_MENU_LEVEL = "expandMenuLevel";
oFF.AuGdsQdInteractiveTableContextActionsHelper.EXPAND_MENU_UDH = "expandMenuUdh";
oFF.AuGdsQdInteractiveTableContextActionsHelper.FILTER_MENU = "filterMenu";
oFF.AuGdsQdInteractiveTableContextActionsHelper.MAX_PAGE_SIZE = 15;
oFF.AuGdsQdInteractiveTableContextActionsHelper.remap = function(tableView, dimensions)
{
	return oFF.XStream.of(dimensions).map( function(orig){
		return tableView.getQueryManager().getQueryModel().getDimensionByName(orig.getName());
	}.bind(this)).collect(oFF.XStreamCollector.toList());
};
oFF.AuGdsQdInteractiveTableContextActionsHelper.getStandaloneDimensionMenu = function(application, context, dimension, updateCommand)
{
	var startGroup = oFF.AuGdsQdUserActionGroup.create();
	var subGroup = startGroup.addNewGroup();
	var dimensions = oFF.XList.create();
	dimensions.add(dimension);
	oFF.AuGdsQdInteractiveTableContextActionsHelper.createDimensionMenu(application, context, subGroup, dimensions, dimensions, dimension.getKeyField().getName(), false, updateCommand, null, true);
	var queryModel = context.getQueryModel();
	oFF.AuGdsQdInteractiveTableContextActionsHelper.createSubAxisMenus(application, context, dimension.getAxisType(), startGroup, queryModel, updateCommand);
	subGroup = startGroup.addNewGroup();
	subGroup.setText("Query");
	subGroup.setName(oFF.AuGdsQdInteractiveTableContextActionsHelper.QUERY_CONTEXT_MENU);
	subGroup.setIcon("overview-chart");
	oFF.AuGdsQdInteractiveTableContextActionsHelper.createQueryMenu(application, queryModel, subGroup, updateCommand);
	return startGroup;
};
oFF.AuGdsQdInteractiveTableContextActionsHelper.getStandaloneAxisMenu = function(application, context, axis, updateCommand)
{
	var startGroup = oFF.AuGdsQdUserActionGroup.create();
	var subGroup;
	var queryModel = context.getQueryModel();
	oFF.AuGdsQdInteractiveTableContextActionsHelper.createSubAxisMenus(application, context, axis.getType(), startGroup, queryModel, updateCommand);
	subGroup = startGroup.addNewGroup();
	subGroup.setText("Query");
	subGroup.setName(oFF.AuGdsQdInteractiveTableContextActionsHelper.QUERY_CONTEXT_MENU);
	subGroup.setIcon("overview-chart");
	oFF.AuGdsQdInteractiveTableContextActionsHelper.createQueryMenu(application, queryModel, subGroup, updateCommand);
	return startGroup;
};
oFF.AuGdsQdInteractiveTableContextActionsHelper.getStandaloneQueryMenu = function(application, context, updateCommand)
{
	var startGroup = oFF.AuGdsQdUserActionGroup.create();
	var subGroup = startGroup.addNewGroup();
	var queryModel = context.getQueryModel();
	oFF.AuGdsQdInteractiveTableContextActionsHelper.createSubAxisMenus(application, context, null, subGroup, queryModel, updateCommand);
	subGroup = startGroup.addNewGroup();
	subGroup.setText("Query");
	subGroup.setName(oFF.AuGdsQdInteractiveTableContextActionsHelper.QUERY_CONTEXT_MENU);
	subGroup.setIcon("overview-chart");
	oFF.AuGdsQdInteractiveTableContextActionsHelper.createQueryMenu(application, queryModel, subGroup, updateCommand);
	return startGroup;
};
oFF.AuGdsQdInteractiveTableContextActionsHelper.getStandaloneMeasureMenu = function(application, context, measure, updateCommand)
{
	var startGroup = oFF.AuGdsQdUserActionGroup.create();
	var subGroup = startGroup.addNewGroup();
	oFF.AuGdsQdInteractiveTableContextActionsHelper.createCellMenu(application, context, subGroup, measure, null, updateCommand);
	return startGroup;
};
oFF.AuGdsQdInteractiveTableContextActionsHelper.createSubAxisMenus = function(application, context, axisType, startGroup, queryModel, updateCommand)
{
	var subGroup;
	if (axisType !== oFF.AxisType.COLUMNS)
	{
		subGroup = startGroup.addNewGroup();
		subGroup.setText("Rows");
		subGroup.setName(oFF.AuGdsQdInteractiveTableContextActionsHelper.ROW_CONTEXT_MENU);
		subGroup.setIcon("table-row");
		oFF.AuGdsQdInteractiveTableContextActionsHelper.createAxisMenu(application, context, subGroup, queryModel.getRowsAxis(), updateCommand);
	}
	if (axisType !== oFF.AxisType.ROWS)
	{
		subGroup = startGroup.addNewGroup();
		subGroup.setText("Columns");
		subGroup.setName(oFF.AuGdsQdInteractiveTableContextActionsHelper.COLUMN_CONTEXT_MENU);
		subGroup.setIcon("table-column");
		oFF.AuGdsQdInteractiveTableContextActionsHelper.createAxisMenu(application, context, subGroup, queryModel.getColumnsAxis(), updateCommand);
	}
};
oFF.AuGdsQdInteractiveTableContextActionsHelper.getTableContextMenu = function(tableView)
{
	var application = tableView.getApplication();
	var context = tableView.getQueryManager();
	var queryModel = context.getQueryModel();
	var updateCommand =  function(){
		tableView.updateTable();
	}.bind(this);
	var isMultiSelectWithGaps = tableView.isIsMultiSelectWithGaps();
	var dimensions;
	var dimensionsWithGaps;
	var tupleElementsWithGaps;
	var columnTuples = tableView.getColumnTuplesLastSelected();
	var rowTuples = tableView.getRowTuplesLastSelected();
	var fieldNamesSelected;
	var fieldName;
	if (tableView.isOnHeaderRows() && !tableView.isOnEmptyHeaderSection())
	{
		dimensions = oFF.AuGdsQdInteractiveTableContextActionsHelper.remap(tableView, tableView.getColumnDimensionsLastSelected());
		dimensionsWithGaps = oFF.AuGdsQdInteractiveTableContextActionsHelper.remap(tableView, tableView.getColumnDimensionsLastSelected());
		tupleElementsWithGaps = tableView.getColumnTupleElementsAllSelected();
		fieldName = tableView.getSelectedColumnTupleFieldName();
		fieldNamesSelected = tableView.getColumnFieldNamesLastSelected();
	}
	else if (tableView.isOnHeaderColumns() && !tableView.isOnHeaderRows() && !tableView.isOnEmptyHeaderSection())
	{
		dimensions = oFF.AuGdsQdInteractiveTableContextActionsHelper.remap(tableView, tableView.getRowDimensionsLastSelected());
		dimensionsWithGaps = oFF.AuGdsQdInteractiveTableContextActionsHelper.remap(tableView, tableView.getRowDimensionsAllSelected());
		tupleElementsWithGaps = tableView.getRowTupleElementsAllSelected();
		fieldName = tableView.getSelectedRowTupleFieldName();
		fieldNamesSelected = tableView.getRowFieldNamesLastSelected();
	}
	else
	{
		dimensions = null;
		dimensionsWithGaps = null;
		tupleElementsWithGaps = null;
		fieldName = null;
		fieldNamesSelected = null;
	}
	var result = oFF.AuGdsQdUserActionGroup.create();
	var subGroup;
	var restGroup;
	var selectedMeasure = tableView.getSelectedMeasure();
	subGroup = result.addNewGroup();
	if (tableView.isOnDataColumns() && tableView.isOnDataRows() || oFF.XCollectionUtils.hasElements(dimensionsWithGaps) && dimensions.size() === 1 && dimensions.get(0).isStructure())
	{
		oFF.AuGdsQdInteractiveTableContextActionsHelper.createCellMenu(application, context, subGroup, selectedMeasure, tableView.getSelectedSecondaryStructureMember(), updateCommand);
	}
	if (oFF.XCollectionUtils.hasElements(tupleElementsWithGaps) && oFF.XCollectionUtils.hasElements(dimensionsWithGaps) && dimensionsWithGaps.size() === 1)
	{
		var dimension = dimensionsWithGaps.get(0);
		oFF.AuGdsQdInteractiveTableContextActionsHelper.createTupleElementMenu(application, context, result, tupleElementsWithGaps, dimension, fieldName, selectedMeasure, isMultiSelectWithGaps, updateCommand);
		restGroup = result.addNewGroup();
		if (!isMultiSelectWithGaps && oFF.XCollectionUtils.hasElements(dimensionsWithGaps) && dimensionsWithGaps.size() === 1 && oFF.XCollectionUtils.hasElements(fieldNamesSelected))
		{
			oFF.AuGdsQdInteractiveTableContextActionsHelper.createAttributeOrFieldMenu(application, context, restGroup, dimensionsWithGaps.get(0), fieldNamesSelected, updateCommand);
		}
		restGroup = result.addNewGroup();
		subGroup = restGroup.addNewGroup();
		subGroup.setText(oFF.AuGdsQdInteractiveTableContextActionsHelper.mapDimensionType(dimension.getDimensionType()));
		subGroup.setName(oFF.AuGdsQdInteractiveTableContextActionsHelper.DIMENSION_CONTEXT_MENU);
		subGroup.setIcon("dimension");
		oFF.AuGdsQdInteractiveTableContextActionsHelper.createDimensionMenu(application, context, subGroup, dimensionsWithGaps, dimensions, fieldName, isMultiSelectWithGaps, updateCommand, fieldNamesSelected, false);
		oFF.AuGdsQdInteractiveTableContextActionsHelper.createSubAxisMenus(application, context, dimension.getAxisType(), restGroup, queryModel, updateCommand);
		subGroup = restGroup.addNewGroup();
		subGroup.setText("Query");
		subGroup.setName(oFF.AuGdsQdInteractiveTableContextActionsHelper.QUERY_CONTEXT_MENU);
		subGroup.setIcon("overview-chart");
		oFF.AuGdsQdInteractiveTableContextActionsHelper.createQueryMenu(application, queryModel, subGroup, updateCommand);
	}
	else if (oFF.XCollectionUtils.hasElements(dimensionsWithGaps) && (!oFF.XCollectionUtils.hasElements(rowTuples) || rowTuples.size() === 1) && (!oFF.XCollectionUtils.hasElements(columnTuples) || columnTuples.size() === 1))
	{
		if (!isMultiSelectWithGaps && oFF.XCollectionUtils.hasElements(dimensionsWithGaps) && dimensionsWithGaps.size() === 1 && oFF.XCollectionUtils.hasElements(fieldNamesSelected))
		{
			oFF.AuGdsQdInteractiveTableContextActionsHelper.createAttributeOrFieldMenu(application, context, subGroup, dimensionsWithGaps.get(0), fieldNamesSelected, updateCommand);
		}
		oFF.AuGdsQdInteractiveTableContextActionsHelper.createDimensionMenu(application, context, result, dimensionsWithGaps, dimensions, fieldName, isMultiSelectWithGaps, updateCommand, fieldNamesSelected, true);
		restGroup = result.addNewGroup();
		oFF.AuGdsQdInteractiveTableContextActionsHelper.createSubAxisMenus(application, context, dimensions.get(0).getAxisType(), restGroup, queryModel, updateCommand);
		subGroup = restGroup.addNewGroup();
		subGroup.setText("Query");
		subGroup.setName(oFF.AuGdsQdInteractiveTableContextActionsHelper.QUERY_CONTEXT_MENU);
		subGroup.setIcon("overview-chart");
		oFF.AuGdsQdInteractiveTableContextActionsHelper.createQueryMenu(application, queryModel, subGroup, updateCommand);
	}
	else
	{
		if (!isMultiSelectWithGaps && oFF.XCollectionUtils.hasElements(dimensionsWithGaps) && dimensionsWithGaps.size() === 1 && oFF.XCollectionUtils.hasElements(fieldNamesSelected))
		{
			oFF.AuGdsQdInteractiveTableContextActionsHelper.createAttributeOrFieldMenu(application, context, subGroup, dimensionsWithGaps.get(0), fieldNamesSelected, updateCommand);
		}
		restGroup = result.addNewGroup();
		oFF.AuGdsQdInteractiveTableContextActionsHelper.createSubAxisMenus(application, context, null, restGroup, queryModel, updateCommand);
		subGroup = restGroup.addNewGroup();
		subGroup.setText("Query");
		subGroup.setName(oFF.AuGdsQdInteractiveTableContextActionsHelper.QUERY_CONTEXT_MENU);
		subGroup.setIcon("overview-chart");
		oFF.AuGdsQdInteractiveTableContextActionsHelper.createQueryMenu(application, queryModel, subGroup, updateCommand);
	}
	subGroup = result.addNewGroup();
	oFF.AuGdsQdInteractiveTableContextActionsHelper.getGridSettingsMenu(tableView, subGroup);
	return result;
};
oFF.AuGdsQdInteractiveTableContextActionsHelper.createMemberMoveMenu = function(application, context, result, structureMember, updateCommand)
{
	var caps = context.getModelCapabilities();
	if (oFF.notNull(structureMember) && caps.supportsDimensionSorting(structureMember.getDimension(), oFF.SortType.MEMBER_KEY))
	{
		var structureDimension = structureMember.getDimension();
		var allStructureMembers = structureDimension.getStructureLayout();
		var asmSize = allStructureMembers.size();
		if (asmSize > 1)
		{
			var subGroup = result.addNewGroup();
			subGroup.setText("Move");
			subGroup.setName(oFF.AuGdsQdInteractiveTableContextActionsHelper.MOVE_CONTEXT_MENU);
			subGroup.setIcon("move");
			var smIndex = allStructureMembers.getIndex(structureMember);
			var leaf;
			leaf = subGroup.addNewLeaf();
			leaf.setEnablementSupplier( function(){
				return oFF.XBooleanValue.create(smIndex > 0);
			}.bind(this));
			if (structureDimension.getAxisType() === oFF.AxisType.COLUMNS)
			{
				leaf.setText("Left");
				leaf.setIcon("arrow-left");
			}
			else
			{
				leaf.setText("Up");
				leaf.setIcon("arrow-top");
			}
			leaf.setName(oFF.AuGdsQdInteractiveTableContextActionsHelper.MEMBER_TO_LEFT_MENU);
			leaf.setCommand( function(){
				oFF.AuGdsQdInteractiveTableContextActionsHelper.moveStructureMember(context, structureMember, -1);
				updateCommand();
			}.bind(this));
			leaf = subGroup.addNewLeaf();
			leaf.setEnablementSupplier( function(){
				return oFF.XBooleanValue.create(smIndex < asmSize - 1);
			}.bind(this));
			if (structureDimension.getAxisType() === oFF.AxisType.COLUMNS)
			{
				leaf.setText("Right");
				leaf.setIcon("arrow-right");
			}
			else
			{
				leaf.setText("Down");
				leaf.setIcon("arrow-bottom");
			}
			leaf.setName(oFF.AuGdsQdInteractiveTableContextActionsHelper.MEMBER_TO_RIGHT_MENU);
			leaf.setCommand( function(){
				oFF.AuGdsQdInteractiveTableContextActionsHelper.moveStructureMember(context, structureMember, +1);
				updateCommand();
			}.bind(this));
		}
	}
};
oFF.AuGdsQdInteractiveTableContextActionsHelper.createTupleElementMenu = function(application, context, result, tupleElementsWithGaps, dimension, fieldName, selectedMeasure, isMultiSelectWithGaps, updateCommand)
{
	var filterableItems = oFF.XStream.of(tupleElementsWithGaps).filter( function(fe){
		return fe.getDimensionMember().getMemberType() !== oFF.MemberType.RESULT;
	}.bind(this)).collect(oFF.XStreamCollector.toList());
	var leaf;
	var subGroup = result.addNewGroup();
	if (oFF.XCollectionUtils.hasElements(filterableItems))
	{
		if (!dimension.isUniversalDisplayHierarchyDimension())
		{
			leaf = subGroup.addNewLeaf();
			leaf.setText(filterableItems.size() > 1 ? "Filter Members" : "Filter Member");
			leaf.setIcon("filter");
			leaf.setName(oFF.AuGdsQdInteractiveTableContextActionsHelper.FILTER_SELECTION_CONTEXT_MENU);
			leaf.setCommand( function(){
				oFF.AuGdsQdInteractiveTableContextActionsHelper.filterOnSelection(context, filterableItems);
				updateCommand();
			}.bind(this));
			oFF.AuGdsQdInteractiveTableContextActionsHelper.createReadModeMenu(application, context, subGroup, dimension, updateCommand);
		}
		else
		{
			var elements1 = oFF.XStream.of(tupleElementsWithGaps).filter( function(te){
				return oFF.AuGdsQdInteractiveTableView.supportsTupleElementExpand(te);
			}.bind(this)).collect(oFF.XStreamCollector.toList());
			if (oFF.XCollectionUtils.hasElements(elements1) && elements1.size() > 1)
			{
				leaf = subGroup.addNewLeaf();
				leaf.setText("Expand");
				leaf.setIcon("expand-all");
				leaf.setName(oFF.AuGdsQdInteractiveTableContextActionsHelper.EXPAND_MENU);
				leaf.setCommand( function(){
					oFF.AuGdsQdInteractiveTableContextActionsHelper.applyDrillToElements(elements1, oFF.DrillState.EXPANDED);
					updateCommand();
				}.bind(this));
			}
			var elements2 = oFF.XStream.of(tupleElementsWithGaps).filter( function(te2){
				return oFF.AuGdsQdInteractiveTableView.supportsTupleElementDrill(te2);
			}.bind(this)).collect(oFF.XStreamCollector.toList());
			if (oFF.XCollectionUtils.hasElements(elements2) && elements2.size() > 1)
			{
				leaf = subGroup.addNewLeaf();
				leaf.setText("Drill");
				leaf.setIcon("expand-all");
				leaf.setName(oFF.AuGdsQdInteractiveTableContextActionsHelper.DRILL_MENU);
				leaf.setCommand( function(){
					oFF.AuGdsQdInteractiveTableContextActionsHelper.applyDrillToElements(elements2, oFF.DrillState.DRILLED);
					updateCommand();
				}.bind(this));
			}
			var elements3 = oFF.XStream.of(tupleElementsWithGaps).filter( function(te3){
				return oFF.AuGdsQdInteractiveTableView.supportsTupleElementCollapse(te3);
			}.bind(this)).collect(oFF.XStreamCollector.toList());
			if (oFF.XCollectionUtils.hasElements(elements3) && elements3.size() > 1)
			{
				leaf = subGroup.addNewLeaf();
				leaf.setText("Collapse");
				leaf.setIcon("collapse-all");
				leaf.setName(oFF.AuGdsQdInteractiveTableContextActionsHelper.COLLAPSE_MENU);
				leaf.setCommand( function(){
					oFF.AuGdsQdInteractiveTableContextActionsHelper.applyDrillToElements(elements3, oFF.DrillState.COLLAPSED);
					updateCommand();
				}.bind(this));
			}
		}
	}
	if (oFF.XCollectionUtils.hasElements(tupleElementsWithGaps) && tupleElementsWithGaps.size() === 1)
	{
		oFF.AuGdsQdInteractiveTableContextActionsHelper.createSortingMenu(application, context, result, dimension, fieldName, tupleElementsWithGaps.getValuesAsReadOnlyList().get(0).getFirstTuple(), selectedMeasure, updateCommand);
	}
	if (!oFF.XCollectionUtils.hasElements(filterableItems) && !dimension.isUniversalDisplayHierarchyDimension())
	{
		var resultStructureController = dimension.getResultStructureController();
		oFF.AuGdsQdInteractiveTableContextActionsHelper.createTotalsMenu(application, context, result, resultStructureController, dimension.getAxisType(), updateCommand);
	}
};
oFF.AuGdsQdInteractiveTableContextActionsHelper.createSortingMenu = function(application, context, result, dimension, fieldName, tuple, selectedMeasure, updateCommand)
{
	var caps = context.getModelCapabilities();
	var field;
	var selectedSortPath;
	var finalSelectedMeasure;
	if (oFF.notNull(tuple))
	{
		field = null;
		if (caps.supportsDataCellSorting())
		{
			finalSelectedMeasure = null;
			selectedSortPath = oFF.XStream.of(tuple.getTupleElementAt(tuple.getElements().size() - 1).getDrillPath()).map( function(pathElement){
				return pathElement;
			}.bind(this)).collect(oFF.XStreamCollector.toList());
		}
		else
		{
			selectedSortPath = null;
			if (caps.supportsMeasureSorting() && tuple.getElements().size() === 1 && tuple.getElements().get(0).getDimension().isMeasureStructure())
			{
				finalSelectedMeasure = selectedMeasure;
			}
			else
			{
				finalSelectedMeasure = null;
			}
		}
	}
	else
	{
		finalSelectedMeasure = null;
		selectedSortPath = null;
		field = dimension.getFieldByName(fieldName);
	}
	var subGroup = result.addNewGroup();
	if (oFF.notNull(field) && (caps.supportsFieldSorting(field) || caps.supportsDimensionSorting(field.getDimension(), field.getPresentationType().isTypeOf(oFF.PresentationType.ABSTRACT_TEXT) ? oFF.SortType.MEMBER_TEXT : oFF.SortType.MEMBER_KEY) && field.getAttribute() === field.getDimension().getMainAttribute()) || oFF.notNull(finalSelectedMeasure) && caps.supportsMeasureSorting() || oFF.notNull(selectedSortPath) && caps.supportsDataCellSorting())
	{
		oFF.AuGdsQdInteractiveTableContextActionsHelper.createSortingSubMenu(context, subGroup, field, selectedSortPath, finalSelectedMeasure, updateCommand);
	}
	var intermediateGroup = subGroup.addNewGroup();
	if (oFF.notNull(field))
	{
		var leaf;
		var keyField = dimension.getKeyField();
		var keySortDirection = oFF.AuGdsQdInteractiveTableContextActionsHelper.getSortDirection(context, keyField, selectedSortPath, finalSelectedMeasure);
		var textField = dimension.getTextField();
		var textSortDirection = oFF.AuGdsQdInteractiveTableContextActionsHelper.getSortDirection(context, textField, selectedSortPath, finalSelectedMeasure);
		if (!caps.supportsFieldSorting(dimension.getKeyField()) && caps.supportsDimensionSorting(dimension, oFF.SortType.MEMBER_KEY))
		{
			leaf = intermediateGroup.addNewLeaf();
			leaf.setText("Ascending by Key");
			leaf.setStatusSupplier( function(){
				return oFF.XBooleanValue.create(keySortDirection === oFF.XSortDirection.ASCENDING);
			}.bind(this));
			leaf.setCommand( function(){
				oFF.AuGdsQdInteractiveTableContextActionsHelper.sortInDirection(context, oFF.XSortDirection.ASCENDING, keyField, selectedSortPath, finalSelectedMeasure);
				updateCommand();
			}.bind(this));
			leaf.setName(oFF.AuGdsQdInteractiveTableContextActionsHelper.SORT_ASC_MENU);
			leaf = intermediateGroup.addNewLeaf();
			leaf.setText("Descending by Key");
			leaf.setStatusSupplier( function(){
				return oFF.XBooleanValue.create(keySortDirection === oFF.XSortDirection.DESCENDING);
			}.bind(this));
			leaf.setCommand( function(){
				oFF.AuGdsQdInteractiveTableContextActionsHelper.sortInDirection(context, oFF.XSortDirection.DESCENDING, keyField, selectedSortPath, finalSelectedMeasure);
				updateCommand();
			}.bind(this));
			leaf.setName(oFF.AuGdsQdInteractiveTableContextActionsHelper.SORT_DESC_MENU);
		}
		if (!caps.supportsFieldSorting(dimension.getTextField()) && caps.supportsDimensionSorting(dimension, oFF.SortType.MEMBER_TEXT))
		{
			leaf = intermediateGroup.addNewLeaf();
			leaf.setText("Ascending by Text");
			leaf.setStatusSupplier( function(){
				return oFF.XBooleanValue.create(textSortDirection === oFF.XSortDirection.ASCENDING);
			}.bind(this));
			leaf.setCommand( function(){
				oFF.AuGdsQdInteractiveTableContextActionsHelper.sortInDirection(context, oFF.XSortDirection.ASCENDING, textField, selectedSortPath, finalSelectedMeasure);
				updateCommand();
			}.bind(this));
			leaf.setName(oFF.AuGdsQdInteractiveTableContextActionsHelper.SORT_ASC_MENU);
			leaf = intermediateGroup.addNewLeaf();
			leaf.setText("Descending by Text");
			leaf.setStatusSupplier( function(){
				return oFF.XBooleanValue.create(textSortDirection === oFF.XSortDirection.DESCENDING);
			}.bind(this));
			leaf.setCommand( function(){
				oFF.AuGdsQdInteractiveTableContextActionsHelper.sortInDirection(context, oFF.XSortDirection.DESCENDING, textField, selectedSortPath, finalSelectedMeasure);
				updateCommand();
			}.bind(this));
			leaf.setName(oFF.AuGdsQdInteractiveTableContextActionsHelper.SORT_DESC_MENU);
		}
		if (oFF.XCollectionUtils.hasElements(intermediateGroup.getSubItems()))
		{
			leaf = intermediateGroup.addNewLeaf();
			leaf.setText("Default Order");
			leaf.setStatusSupplier( function(){
				return oFF.XBooleanValue.create(keySortDirection === oFF.XSortDirection.DEFAULT_VALUE && textSortDirection === oFF.XSortDirection.DEFAULT_VALUE);
			}.bind(this));
			leaf.setCommand( function(){
				oFF.AuGdsQdInteractiveTableContextActionsHelper.sortInDirection(context, oFF.XSortDirection.DEFAULT_VALUE, textField, selectedSortPath, finalSelectedMeasure);
				oFF.AuGdsQdInteractiveTableContextActionsHelper.sortInDirection(context, oFF.XSortDirection.DEFAULT_VALUE, keyField, selectedSortPath, finalSelectedMeasure);
				updateCommand();
			}.bind(this));
			leaf.setName(oFF.AuGdsQdInteractiveTableContextActionsHelper.SORT_ASC_MENU);
		}
		var fields = dimension.getFields();
		for (var i = 0; i < fields.size(); i++)
		{
			field = fields.get(i);
			if (caps.supportsFieldSorting(field))
			{
				var subSubGroup = intermediateGroup.addNewGroup();
				subSubGroup.setText(field.getText());
				subSubGroup.setName(field.getName());
				oFF.AuGdsQdInteractiveTableContextActionsHelper.createSortingSubMenu(context, subSubGroup, field, null, null, updateCommand);
			}
		}
	}
	if (subGroup.getSubItems().size() + intermediateGroup.getSubItems().size() > 1)
	{
		if (subGroup.getSubItems().size() > 1 && oFF.XCollectionUtils.hasElements(intermediateGroup.getSubItems()))
		{
			intermediateGroup.setName(oFF.AuGdsQdInteractiveTableContextActionsHelper.PRESENTATION_SORT_MENU);
			intermediateGroup.setText("Advanced");
			intermediateGroup.setIcon("sort");
		}
		subGroup.setText("Sorting");
		subGroup.setName(oFF.AuGdsQdInteractiveTableContextActionsHelper.SORT_CONTEXT_MENU);
		subGroup.setIcon("sort");
	}
};
oFF.AuGdsQdInteractiveTableContextActionsHelper.createSortingSubMenu = function(context, subGroup, field, selectedSortPath, finalSelectedMeasure, updateCommand)
{
	var leaf = subGroup.addNewLeaf();
	leaf.setText("Ascending");
	leaf.setStatusSupplier( function(){
		return oFF.XBooleanValue.create(oFF.AuGdsQdInteractiveTableContextActionsHelper.getSortDirection(context, field, selectedSortPath, finalSelectedMeasure) === oFF.XSortDirection.ASCENDING);
	}.bind(this));
	leaf.setCommand( function(){
		oFF.AuGdsQdInteractiveTableContextActionsHelper.sortInDirection(context, oFF.XSortDirection.ASCENDING, field, selectedSortPath, finalSelectedMeasure);
		updateCommand();
	}.bind(this));
	leaf.setName(oFF.AuGdsQdInteractiveTableContextActionsHelper.SORT_ASC_MENU);
	leaf = subGroup.addNewLeaf();
	leaf.setText("Descending");
	leaf.setStatusSupplier( function(){
		return oFF.XBooleanValue.create(oFF.AuGdsQdInteractiveTableContextActionsHelper.getSortDirection(context, field, selectedSortPath, finalSelectedMeasure) === oFF.XSortDirection.DESCENDING);
	}.bind(this));
	leaf.setCommand( function(){
		oFF.AuGdsQdInteractiveTableContextActionsHelper.sortInDirection(context, oFF.XSortDirection.DESCENDING, field, selectedSortPath, finalSelectedMeasure);
		updateCommand();
	}.bind(this));
	leaf.setName(oFF.AuGdsQdInteractiveTableContextActionsHelper.SORT_DESC_MENU);
	leaf = subGroup.addNewLeaf();
	leaf.setText("Default Order");
	leaf.setStatusSupplier( function(){
		return oFF.XBooleanValue.create(oFF.AuGdsQdInteractiveTableContextActionsHelper.getSortDirection(context, field, selectedSortPath, finalSelectedMeasure) === oFF.XSortDirection.DEFAULT_VALUE);
	}.bind(this));
	leaf.setCommand( function(){
		oFF.AuGdsQdInteractiveTableContextActionsHelper.sortInDirection(context, oFF.XSortDirection.DEFAULT_VALUE, field, selectedSortPath, finalSelectedMeasure);
		updateCommand();
	}.bind(this));
	leaf.setName(oFF.AuGdsQdInteractiveTableContextActionsHelper.SORT_DEFAULT_MENU);
};
oFF.AuGdsQdInteractiveTableContextActionsHelper.createReadModeMenu = function(application, context, result, dimension, updateCommand)
{
	var subGroup = result.addNewGroup();
	subGroup.setText("Read Mode");
	subGroup.setName(oFF.AuGdsQdInteractiveTableContextActionsHelper.READMODE_CONTEXT_MENU);
	var readmodes = dimension.getSupportedReadModes(oFF.QContextType.RESULT_SET).getIterator();
	while (readmodes.hasNext())
	{
		var readmode = readmodes.next();
		oFF.AuGdsQdInteractiveTableContextActionsHelper.addReadModeAction(subGroup, dimension, readmode, updateCommand);
	}
};
oFF.AuGdsQdInteractiveTableContextActionsHelper.addReadModeAction = function(subGroup, dimension, readmode, updateCommand)
{
	var leaf = subGroup.addNewLeaf();
	var isActive = dimension.getReadMode(oFF.QContextType.RESULT_SET) === readmode;
	var rmstsu =  function(){
		return oFF.XBooleanValue.create(isActive);
	}.bind(this);
	leaf.setName(readmode.getName());
	leaf.setText(oFF.AuGdsQdInteractiveTableContextActionsHelper.mapReadMode(readmode));
	leaf.setStatusSupplier(rmstsu);
	leaf.setCommand( function(){
		dimension.setReadModeGraceful(oFF.QContextType.RESULT_SET, readmode);
		updateCommand();
	}.bind(this));
};
oFF.AuGdsQdInteractiveTableContextActionsHelper.createTotalsMenu = function(application, context, result, resultStructureController, axisType, updateCommand)
{
	var intermediateGroup = result.addNewGroup();
	var caps = context.getModelCapabilities();
	intermediateGroup.setIcon("sum");
	intermediateGroup.setText("Totals");
	intermediateGroup.setName(oFF.AuGdsQdInteractiveTableContextActionsHelper.TOTALS_CONTEXT_MENU);
	var subGroup;
	var leaf;
	if (resultStructureController.supportsResultAlignment())
	{
		var resultAlignments = context.getModelCapabilities().getSupportedResultAlignments();
		var resultAlignment = resultStructureController.getResultAlignment();
		subGroup = intermediateGroup.addNewGroup();
		if (oFF.XCollectionUtils.hasElements(resultAlignments) && resultAlignments.size() > 1)
		{
			if (resultAlignments.contains(oFF.ResultAlignment.BOTTOM))
			{
				leaf = subGroup.addNewLeaf();
				if (axisType !== oFF.AxisType.COLUMNS)
				{
					leaf.setText("Bottom");
				}
				else
				{
					leaf.setText("Right");
				}
				leaf.setName(oFF.AuGdsQdInteractiveTableContextActionsHelper.TOTALS_BELOW_MENU);
				leaf.setStatusSupplier( function(){
					return oFF.XBooleanValue.create(resultStructureController.getResultAlignment() === oFF.ResultAlignment.BOTTOM);
				}.bind(this));
				leaf.setCommand( function(){
					resultStructureController.setResultAlignment(oFF.ResultAlignment.BOTTOM);
					updateCommand();
				}.bind(this));
			}
			if (resultAlignments.contains(oFF.ResultAlignment.TOP))
			{
				leaf = subGroup.addNewLeaf();
				if (axisType !== oFF.AxisType.COLUMNS)
				{
					leaf.setText("Top");
				}
				else
				{
					leaf.setText("Left");
				}
				leaf.setName(oFF.AuGdsQdInteractiveTableContextActionsHelper.TOTALS_ABOVE_MENU);
				leaf.setStatusSupplier( function(){
					return oFF.XBooleanValue.create(resultStructureController.getResultAlignment() === oFF.ResultAlignment.TOP);
				}.bind(this));
				leaf.setCommand( function(){
					resultStructureController.setResultAlignment(oFF.ResultAlignment.TOP);
					updateCommand();
				}.bind(this));
			}
			if (resultAlignments.contains(oFF.ResultAlignment.TOPBOTTOM))
			{
				leaf = subGroup.addNewLeaf();
				if (axisType !== oFF.AxisType.COLUMNS)
				{
					leaf.setText("Top & Bottom");
				}
				else
				{
					leaf.setText("Left & Right");
				}
				leaf.setName(oFF.AuGdsQdInteractiveTableContextActionsHelper.TOTALS_ABOVE_AND_BELOW_MENU);
				leaf.setStatusSupplier( function(){
					return oFF.XBooleanValue.create(resultAlignment === oFF.ResultAlignment.TOPBOTTOM);
				}.bind(this));
				leaf.setCommand( function(){
					resultStructureController.setResultAlignment(oFF.ResultAlignment.TOPBOTTOM);
					updateCommand();
				}.bind(this));
			}
			leaf = subGroup.addNewLeaf();
			leaf.setText("Hide Totals");
			leaf.setName(oFF.AuGdsQdInteractiveTableContextActionsHelper.HIDE_TOTALS_MENU);
			leaf.setStatusSupplier( function(){
				return oFF.XBooleanValue.create(resultStructureController.getResultAlignment() === oFF.ResultAlignment.NONE);
			}.bind(this));
			leaf.setCommand( function(){
				resultStructureController.setResultAlignment(oFF.ResultAlignment.NONE);
				updateCommand();
			}.bind(this));
		}
	}
	oFF.AuGdsQdInteractiveTableContextActionsHelper.hideOrShowTotalsMenuSection(caps, resultStructureController, oFF.ResultStructureElement.TOTAL, intermediateGroup, updateCommand);
	if (caps.supportsConditionalResults())
	{
		var supportedResults = caps.getSupportedConditionalResults();
		if (supportedResults.contains(oFF.ResultStructureElement.TOTAL_INCLUDED_MEMBERS))
		{
			subGroup = intermediateGroup.addNewGroup();
			subGroup.setName(oFF.ResultStructureElement.TOTAL_INCLUDED_MEMBERS.getName());
			subGroup.setText("Totals Including");
			oFF.AuGdsQdInteractiveTableContextActionsHelper.hideOrShowTotalsMenuSection(caps, resultStructureController, oFF.ResultStructureElement.TOTAL_INCLUDED_MEMBERS, subGroup, updateCommand);
		}
		if (supportedResults.contains(oFF.ResultStructureElement.TOTAL_REMAINING_MEMBERS))
		{
			subGroup = intermediateGroup.addNewGroup();
			subGroup.setName(oFF.ResultStructureElement.TOTAL_REMAINING_MEMBERS.getName());
			subGroup.setText("Totals Remaining");
			oFF.AuGdsQdInteractiveTableContextActionsHelper.hideOrShowTotalsMenuSection(caps, resultStructureController, oFF.ResultStructureElement.TOTAL_REMAINING_MEMBERS, subGroup, updateCommand);
		}
	}
};
oFF.AuGdsQdInteractiveTableContextActionsHelper.hideOrShowTotalsMenuSection = function(caps, resultStructureController, total, intermediateGroup, updateCommand)
{
	var resultVisibility = resultStructureController.getResultVisibilityByElement(total);
	var subGroup = intermediateGroup.addNewGroup();
	var leaf = subGroup.addNewLeaf();
	leaf.setText("Visible Always");
	leaf.setStatusSupplier( function(){
		return oFF.XBooleanValue.create(resultVisibility === oFF.ResultVisibility.ALWAYS);
	}.bind(this));
	leaf.setCommand( function(){
		resultStructureController.setResultVisibilityByElement(total, oFF.ResultVisibility.ALWAYS);
		updateCommand();
	}.bind(this));
	if (caps.supportsConditionalResultVisibility())
	{
		leaf = subGroup.addNewLeaf();
		leaf.setText("Visible if More than One Member");
		leaf.setStatusSupplier( function(){
			return oFF.XBooleanValue.create(resultVisibility === oFF.ResultVisibility.CONDITIONAL);
		}.bind(this));
		leaf.setCommand( function(){
			resultStructureController.setResultVisibilityByElement(total, oFF.ResultVisibility.CONDITIONAL);
			updateCommand();
		}.bind(this));
	}
	leaf = subGroup.addNewLeaf();
	leaf.setText("Suppress");
	leaf.setStatusSupplier( function(){
		return oFF.XBooleanValue.create(resultVisibility === oFF.ResultVisibility.HIDDEN);
	}.bind(this));
	leaf.setCommand( function(){
		resultStructureController.setResultVisibilityByElement(total, oFF.ResultVisibility.HIDDEN);
		updateCommand();
	}.bind(this));
};
oFF.AuGdsQdInteractiveTableContextActionsHelper.createDimensionMenu = function(application, context, result, dimensionsWithGaps, dimensions, fieldName, isMultiSelectWithGaps, updateCommand, fieldNamesSelected, flat)
{
	if (oFF.XCollectionUtils.hasElements(dimensions) && !dimensions.get(0).isUniversalDisplayHierarchyDimension())
	{
		var leaf;
		var subGroup;
		var dimension = dimensions.get(0);
		if (dimensions.size() === 1)
		{
			var dimensionHeadingByType = oFF.AuGdsQdInteractiveTableContextActionsHelper.mapDimensionType(dimension.getDimensionType());
			oFF.AuGdsQdInteractiveTableContextActionsHelper.createDimensionDialogMenu(application, result, dimension, flat ? dimensionHeadingByType : "Properties", "dimension", updateCommand);
		}
		else
		{
			for (var i = 0; i < dimensions.size(); i++)
			{
				subGroup = result.addNewGroup();
				subGroup.setText("Dimensions");
				subGroup.setIcon("dimension");
				subGroup.setName(oFF.AuGdsQdInteractiveTableContextActionsHelper.DIMENSION_CONTEXT_MENU);
				var subDim = dimensions.get(i);
				oFF.AuGdsQdInteractiveTableContextActionsHelper.createDimensionDialogMenu(application, subGroup, subDim, subDim.getText(), null, updateCommand);
			}
		}
		oFF.AuGdsQdInteractiveTableContextActionsHelper.createDimensionMoveMenu(application, context, result, dimensionsWithGaps, dimensions, isMultiSelectWithGaps, updateCommand, fieldNamesSelected);
		if (dimensions.size() === 1)
		{
			var isShown = dimension.getAxisType() === oFF.AxisType.ROWS || dimension.getAxisType() === oFF.AxisType.COLUMNS;
			if (isShown)
			{
				oFF.AuGdsQdInteractiveTableContextActionsHelper.createSortingMenu(application, context, result, dimension, fieldName, null, null, updateCommand);
				oFF.AuGdsQdInteractiveTableContextActionsHelper.createTotalsMenu(application, context, result, dimension.getResultStructureController(), dimension.getAxisType(), updateCommand);
				oFF.AuGdsQdInteractiveTableContextActionsHelper.createPresentationMenu(application, context, result, dimension, dimension.getAxisType(), updateCommand);
			}
			if (isShown)
			{
				oFF.AuGdsQdInteractiveTableContextActionsHelper.createReadModeMenu(application, context, result, dimension, updateCommand);
				if (dimension.supportsHierarchy())
				{
					oFF.AuGdsQdInteractiveTableContextActionsHelper.createHierarchyMenu(application, context, result, dimension, updateCommand);
				}
			}
			subGroup = result.addNewGroup();
			if (isShown)
			{
				oFF.AuGdsQdInteractiveTableContextActionsHelper.createFieldsOrAttributesMenu(application, context, subGroup, dimension, dimension.getAxisType(), updateCommand);
			}
			var filterGroup = subGroup.addNewGroup();
			filterGroup.setName(oFF.AuGdsQdInteractiveTableContextActionsHelper.FILTER_MENU);
			filterGroup.setText("Filter");
			filterGroup.setIcon("filter");
			leaf = filterGroup.addNewLeaf();
			leaf.setText("Edit ...");
			leaf.setIcon("add-filter");
			leaf.setName(oFF.AuGdsQdInteractiveTableContextActionsHelper.FILTER_CONTEXT_MENU);
			leaf.setCommand( function(){
				oFF.AuGdsQdInteractiveTableContextActionsHelper.openFilterDialog(application, context, dimension, updateCommand);
			}.bind(this));
			leaf = filterGroup.addNewLeaf();
			leaf.setText("Clear");
			leaf.setIcon("clear-filter");
			leaf.setEnablementSupplier( function(){
				return oFF.XBooleanValue.create(oFF.AuGdsQdInteractiveTableContextActionsHelper.hasFilterOnDimension(context, dimension));
			}.bind(this));
			leaf.setName(oFF.AuGdsQdInteractiveTableContextActionsHelper.FILTER_CLEAR_MENU);
			leaf.setCommand( function(){
				oFF.AuGdsQdInteractiveTableContextActionsHelper.clearFilter(context, dimension);
				updateCommand();
			}.bind(this));
		}
	}
};
oFF.AuGdsQdInteractiveTableContextActionsHelper.createDimensionDialogMenu = function(application, result, dimension, label, icon, updateCommand)
{
	var leaf = result.addNewLeaf();
	leaf.setName(oFF.AuGdsQdInteractiveTableContextActionsHelper.DIMENSION_CONTEXT_MENU);
	leaf.setText(oFF.XStringUtils.concatenate2(label, " ..."));
	leaf.setIcon(icon);
	leaf.setCommand( function(){
		oFF.DdEntryPoint.createEntryPoint(application).openDimensionDialog(oFF.XStringUtils.concatenate3(dimension.getName(), "/", dimension.getText()), dimension, oFF.AuGdsLambdaDialogCloseListener.create(updateCommand, null));
	}.bind(this));
};
oFF.AuGdsQdInteractiveTableContextActionsHelper.createPresentationMenu = function(application, context, result, dimension, axisType, updateCommand)
{
	var intermediateGroup = result.addNewGroup();
	intermediateGroup.setName(oFF.AuGdsQdInteractiveTableContextActionsHelper.PRESENTATION_MENU);
	intermediateGroup.setText("Presentations");
	intermediateGroup.setIcon("show");
	var mainAttributeModel;
	var mainAttribute = dimension.getMainAttribute();
	if (oFF.isNull(mainAttribute))
	{
		mainAttributeModel = oFF.DdModelFieldContainer.createFromFieldContainer(dimension, null, null);
	}
	else
	{
		mainAttributeModel = oFF.DdModelFieldContainer.createFromFieldContainer(mainAttribute, null, null);
		var mainRsAttribute = oFF.XStream.of(dimension.getResultSetAttributes()).filter( function(a){
			return oFF.XString.isEqual(a.getName(), mainAttribute.getName());
		}.bind(this)).findAny();
		mainRsAttribute.ifPresent( function(att){
			mainAttributeModel.applyResultSetSettings(att);
		}.bind(this));
	}
	if (dimension.getFieldLayoutType() === oFF.FieldLayoutType.FIELD_BASED)
	{
		oFF.AuGdsQdInteractiveTableContextActionsHelper.createPresentationSubMenu(context, dimension, mainAttributeModel, intermediateGroup, updateCommand);
	}
	else
	{
		oFF.AuGdsQdInteractiveTableContextActionsHelper.createPresentationSubMenu(context, dimension, mainAttributeModel, intermediateGroup, updateCommand);
	}
};
oFF.AuGdsQdInteractiveTableContextActionsHelper.createFieldsOrAttributesMenu = function(application, context, result, dimension, axisType, updateCommand)
{
	var mainAttributeModel;
	var mainAttribute = dimension.getMainAttribute();
	if (oFF.isNull(mainAttribute))
	{
		mainAttributeModel = oFF.DdModelFieldContainer.createFromFieldContainer(dimension, null, null);
	}
	else
	{
		mainAttributeModel = oFF.DdModelFieldContainer.createFromFieldContainer(mainAttribute, null, null);
		var mainRsAttribute = oFF.XStream.of(dimension.getResultSetAttributes()).filter( function(a){
			return oFF.XString.isEqual(a.getName(), mainAttribute.getName());
		}.bind(this)).findAny();
		mainRsAttribute.ifPresent( function(att){
			mainAttributeModel.applyResultSetSettings(att);
		}.bind(this));
	}
	var detailsGroup;
	var i;
	if (dimension.getFieldLayoutType() === oFF.FieldLayoutType.FIELD_BASED)
	{
		detailsGroup = result.addNewGroup();
		var uniqueTexts = oFF.XStream.of(dimension.getFields()).collect(oFF.XStreamCollector.toSetOfString( function(fin){
			return fin.getText();
		}.bind(this))).size() === dimension.getFields().size();
		var nonMainAttributeFields = oFF.AuGdsQdInteractiveTableContextActionsHelper.getNonMainAttributeFields(mainAttributeModel, dimension);
		for (i = 0; i < nonMainAttributeFields.size(); i++)
		{
			var rfi = nonMainAttributeFields.get(i);
			oFF.AuGdsQdInteractiveTableContextActionsHelper.addFieldAction(detailsGroup, context, dimension, rfi, uniqueTexts, updateCommand);
		}
		if (detailsGroup.getSubItems().size() > 0)
		{
			detailsGroup.setName(oFF.AuGdsQdInteractiveTableContextActionsHelper.FIELD_MENU);
			detailsGroup.setText("Fields");
		}
	}
	else
	{
		detailsGroup = result.addNewGroup();
		var nma = oFF.AuGdsQdInteractiveTableContextActionsHelper.getNonMainAttributes(dimension);
		for (i = 0; i < nma.size(); i++)
		{
			var raModel = nma.get(i);
			var subGroup = detailsGroup.addNewGroup();
			subGroup.setName(raModel.getComponentName());
			var text = raModel.getComponentText();
			if (oFF.XStringUtils.isNullOrEmpty(text))
			{
				text = raModel.getComponentName();
			}
			subGroup.setText(text);
			oFF.AuGdsQdInteractiveTableContextActionsHelper.createPresentationSubMenu(context, dimension, raModel, subGroup, updateCommand);
		}
		if (detailsGroup.getSubItems().size() > 0)
		{
			detailsGroup.setName(oFF.AuGdsQdInteractiveTableContextActionsHelper.ATTRIBUTES_MENU);
			detailsGroup.setText("Attributes");
		}
	}
};
oFF.AuGdsQdInteractiveTableContextActionsHelper.addFieldAction = function(detailsGroup, context, dimension, rfi, uniqueTexts, updateCommand)
{
	var leaf = detailsGroup.addNewLeaf();
	leaf.setName(rfi.getName());
	var attText = rfi.getText();
	if (!uniqueTexts || oFF.XStringUtils.isNullOrEmpty(attText))
	{
		attText = rfi.getName();
	}
	leaf.setText(attText);
	var isPresent = oFF.XStream.of(dimension.getResultSetFields()).anyMatch( function(rsfi){
		return oFF.XString.isEqual(rsfi.getName(), rfi.getName());
	}.bind(this));
	leaf.setStatusSupplier( function(){
		return oFF.XBooleanValue.create(isPresent);
	}.bind(this));
	leaf.setCommand( function(){
		if (isPresent)
		{
			context.getQueryModel().getConvenienceCommands().removeField(dimension.getDimensionType(), dimension.getName(), rfi.getPresentationType(), rfi.getName(), oFF.QContextType.RESULT_SET);
		}
		else
		{
			context.getQueryModel().getConvenienceCommands().addField(dimension.getDimensionType(), dimension.getName(), rfi.getPresentationType(), rfi.getName(), oFF.QContextType.RESULT_SET);
		}
		updateCommand();
	}.bind(this));
};
oFF.AuGdsQdInteractiveTableContextActionsHelper.getKeyFieldName = function(mainAttributeModel, dimension)
{
	var keyView = mainAttributeModel.getKeyView();
	var keyField = dimension.getFieldByPresentationType(keyView);
	if (oFF.isNull(keyField))
	{
		keyField = dimension.getDisplayKeyField();
	}
	if (oFF.isNull(keyField))
	{
		keyField = dimension.getKeyField();
	}
	var keyFieldName = null;
	if (oFF.notNull(keyField))
	{
		keyFieldName = keyField.getName();
	}
	return keyFieldName;
};
oFF.AuGdsQdInteractiveTableContextActionsHelper.getTextFieldName = function(mainAttributeModel, dimension)
{
	var textView = mainAttributeModel.getTextView();
	var textField = dimension.getFieldByPresentationType(textView);
	if (oFF.isNull(textField))
	{
		textField = dimension.getTextField();
	}
	var textFieldName = null;
	if (oFF.notNull(textField))
	{
		textFieldName = textField.getName();
	}
	return textFieldName;
};
oFF.AuGdsQdInteractiveTableContextActionsHelper.getNonMainAttributes = function(dimension)
{
	var resultSetAttributes = oFF.XStream.of(dimension.getResultSetAttributes()).filter( function(rA){
		return rA !== dimension.getMainAttribute();
	}.bind(this)).collect(oFF.XStreamCollector.toList());
	var remainingAttributes = oFF.XStream.of(dimension.getAttributes()).filter( function(rSA){
		return !resultSetAttributes.contains(rSA) && rSA !== dimension.getMainAttribute();
	}.bind(this)).collect(oFF.XStreamCollector.toList());
	var result = oFF.XList.create();
	result.addAll(oFF.XStream.of(resultSetAttributes).map( function(mra){
		var raModel = oFF.DdModelFieldContainer.createFromFieldContainer(mra, null, null);
		raModel.applyResultSetSettings(mra);
		return raModel;
	}.bind(this)).collect(oFF.XStreamCollector.toList()));
	result.addAll(oFF.XStream.of(remainingAttributes).map( function(mrsa){
		var mraModel = oFF.DdModelFieldContainer.createFromFieldContainer(mrsa, null, null);
		return mraModel;
	}.bind(this)).collect(oFF.XStreamCollector.toList()));
	return result;
};
oFF.AuGdsQdInteractiveTableContextActionsHelper.getNonMainAttributeFields = function(mainAttributeModel, dimension)
{
	var result = oFF.XList.create();
	var list1 = oFF.AuGdsQdInteractiveTableContextActionsHelper.getNonMainAttributeRsFields(mainAttributeModel, dimension);
	var list2 = oFF.XStream.of(dimension.getFields()).filter( function(fi){
		return !list1.contains(fi) && !oFF.XString.isEqual(oFF.AuGdsQdInteractiveTableContextActionsHelper.getKeyFieldName(mainAttributeModel, dimension), fi.getName()) && !oFF.XString.isEqual(oFF.AuGdsQdInteractiveTableContextActionsHelper.getTextFieldName(mainAttributeModel, dimension), fi.getName());
	}.bind(this)).collect(oFF.XStreamCollector.toList());
	result.addAll(list1);
	result.addAll(list2);
	return result;
};
oFF.AuGdsQdInteractiveTableContextActionsHelper.getNonMainAttributeRsFields = function(mainAttributeModel, dimension)
{
	return oFF.XStream.of(dimension.getResultSetFields()).filter( function(fi){
		return !oFF.XString.isEqual(oFF.AuGdsQdInteractiveTableContextActionsHelper.getKeyFieldName(mainAttributeModel, dimension), fi.getName()) && !oFF.XString.isEqual(oFF.AuGdsQdInteractiveTableContextActionsHelper.getTextFieldName(mainAttributeModel, dimension), fi.getName());
	}.bind(this)).collect(oFF.XStreamCollector.toList());
};
oFF.AuGdsQdInteractiveTableContextActionsHelper.applyMainAttributeForFieldLayout = function(context, dimension, mainAttributeModel)
{
	var textFieldName;
	var keyFieldName;
	dimension.setFieldLayoutType(oFF.FieldLayoutType.FIELD_BASED);
	var nmarfs = oFF.AuGdsQdInteractiveTableContextActionsHelper.getNonMainAttributeRsFields(mainAttributeModel, dimension);
	var convenienceCommands = context.getQueryModel().getConvenienceCommands();
	convenienceCommands.clearAllResultSetFields(dimension.getName());
	if (mainAttributeModel.isDisplayKey() && mainAttributeModel.isDisplayText())
	{
		textFieldName = oFF.AuGdsQdInteractiveTableContextActionsHelper.getTextFieldName(mainAttributeModel, dimension);
		keyFieldName = oFF.AuGdsQdInteractiveTableContextActionsHelper.getKeyFieldName(mainAttributeModel, dimension);
		if (!mainAttributeModel.isDisplayKeyBeforeText())
		{
			if (oFF.XStringUtils.isNotNullAndNotEmpty(textFieldName))
			{
				convenienceCommands.addField(null, dimension.getName(), null, textFieldName, oFF.QContextType.RESULT_SET);
			}
			if (oFF.XStringUtils.isNotNullAndNotEmpty(keyFieldName))
			{
				convenienceCommands.addField(null, dimension.getName(), null, keyFieldName, oFF.QContextType.RESULT_SET);
			}
		}
		else if (mainAttributeModel.isDisplayKey() && mainAttributeModel.isDisplayText())
		{
			if (oFF.XStringUtils.isNotNullAndNotEmpty(keyFieldName))
			{
				convenienceCommands.addField(null, dimension.getName(), null, keyFieldName, oFF.QContextType.RESULT_SET);
			}
			if (oFF.XStringUtils.isNotNullAndNotEmpty(textFieldName))
			{
				convenienceCommands.addField(null, dimension.getName(), null, textFieldName, oFF.QContextType.RESULT_SET);
			}
		}
	}
	else if (mainAttributeModel.isDisplayKey())
	{
		keyFieldName = oFF.AuGdsQdInteractiveTableContextActionsHelper.getKeyFieldName(mainAttributeModel, dimension);
		if (oFF.XStringUtils.isNotNullAndNotEmpty(keyFieldName))
		{
			convenienceCommands.addField(null, dimension.getName(), null, keyFieldName, oFF.QContextType.RESULT_SET);
		}
	}
	else if (mainAttributeModel.isDisplayText())
	{
		textFieldName = oFF.AuGdsQdInteractiveTableContextActionsHelper.getTextFieldName(mainAttributeModel, dimension);
		if (oFF.XStringUtils.isNotNullAndNotEmpty(textFieldName))
		{
			convenienceCommands.addField(null, dimension.getName(), null, textFieldName, oFF.QContextType.RESULT_SET);
		}
	}
	for (var i = 0; i < nmarfs.size(); i++)
	{
		convenienceCommands.addField(null, dimension.getName(), null, nmarfs.get(i).getName(), oFF.QContextType.RESULT_SET);
	}
};
oFF.AuGdsQdInteractiveTableContextActionsHelper.createPresentationSubMenu = function(context, dimension, mainAttributeModel, intermediateGroup, updateCommand)
{
	var subGroup = intermediateGroup.addNewGroup();
	var leaf = subGroup.addNewLeaf();
	var isFieldLayout = dimension.getFieldLayoutType() === oFF.FieldLayoutType.FIELD_BASED;
	leaf.setName(oFF.AuGdsQdInteractiveTableContextActionsHelper.NO_PRESENTATION);
	leaf.setText("No Display");
	leaf.setStatusSupplier( function(){
		return oFF.XBooleanValue.create(mainAttributeModel.getDisplayAs() === oFF.DdDisplayAs.NO_DISPLAY);
	}.bind(this));
	leaf.setCommand( function(){
		mainAttributeModel.setDisplayAs(oFF.DdDisplayAs.NO_DISPLAY);
		oFF.AuGdsQdInteractiveTableContextActionsHelper.applyAttribute(context, dimension, mainAttributeModel, isFieldLayout);
		updateCommand();
	}.bind(this));
	if (mainAttributeModel.isMayDisplayKey())
	{
		leaf = subGroup.addNewLeaf();
		leaf.setName(oFF.AuGdsQdInteractiveTableContextActionsHelper.KEY_PRESENTATION);
		leaf.setText("Key");
		leaf.setStatusSupplier( function(){
			return oFF.XBooleanValue.create(mainAttributeModel.getDisplayAs() === oFF.DdDisplayAs.KEY);
		}.bind(this));
		leaf.setCommand( function(){
			mainAttributeModel.setDisplayAs(oFF.DdDisplayAs.KEY);
			oFF.AuGdsQdInteractiveTableContextActionsHelper.applyAttribute(context, dimension, mainAttributeModel, isFieldLayout);
			updateCommand();
		}.bind(this));
	}
	if (mainAttributeModel.isMayDisplayText())
	{
		leaf = subGroup.addNewLeaf();
		leaf.setName(oFF.AuGdsQdInteractiveTableContextActionsHelper.TEXT_PRESENTATION);
		leaf.setText("Text");
		leaf.setStatusSupplier( function(){
			return oFF.XBooleanValue.create(mainAttributeModel.getDisplayAs() === oFF.DdDisplayAs.TEXT);
		}.bind(this));
		leaf.setCommand( function(){
			mainAttributeModel.setDisplayAs(oFF.DdDisplayAs.TEXT);
			oFF.AuGdsQdInteractiveTableContextActionsHelper.applyAttribute(context, dimension, mainAttributeModel, isFieldLayout);
			updateCommand();
		}.bind(this));
	}
	if (mainAttributeModel.isMayDisplayKey() && mainAttributeModel.isMayDisplayText())
	{
		leaf = subGroup.addNewLeaf();
		leaf.setName(oFF.AuGdsQdInteractiveTableContextActionsHelper.KEY_TEXT_PRESENTATION);
		leaf.setText("Key and Text");
		leaf.setStatusSupplier( function(){
			return oFF.XBooleanValue.create(mainAttributeModel.getDisplayAs() === oFF.DdDisplayAs.KEY_AND_TEXT);
		}.bind(this));
		leaf.setCommand( function(){
			mainAttributeModel.setDisplayAs(oFF.DdDisplayAs.KEY_AND_TEXT);
			oFF.AuGdsQdInteractiveTableContextActionsHelper.applyAttribute(context, dimension, mainAttributeModel, isFieldLayout);
			updateCommand();
		}.bind(this));
		leaf = subGroup.addNewLeaf();
		leaf.setName(oFF.AuGdsQdInteractiveTableContextActionsHelper.TEXT_KEY_PRESENTATION);
		leaf.setText("Text and Key");
		leaf.setStatusSupplier( function(){
			return oFF.XBooleanValue.create(mainAttributeModel.getDisplayAs() === oFF.DdDisplayAs.TEXT_AND_KEY);
		}.bind(this));
		leaf.setCommand( function(){
			mainAttributeModel.setDisplayAs(oFF.DdDisplayAs.TEXT_AND_KEY);
			mainAttributeModel.applyToQueryModel(context.getQueryModel(), dimension.getName());
			oFF.AuGdsQdInteractiveTableContextActionsHelper.applyAttribute(context, dimension, mainAttributeModel, isFieldLayout);
			updateCommand();
		}.bind(this));
	}
	var i;
	if (!isFieldLayout)
	{
		var keyViews = mainAttributeModel.getKeyViewsAvailable();
		if (mainAttributeModel.isDisplayKey() && oFF.XCollectionUtils.hasElements(keyViews) && keyViews.size() > 1)
		{
			subGroup = intermediateGroup.addNewGroup();
			subGroup.setName(oFF.AuGdsQdInteractiveTableContextActionsHelper.KEY_VIEWS);
			subGroup.setText("Key Type");
			for (i = 0; i < keyViews.size(); i++)
			{
				var keyView = keyViews.get(i);
				oFF.AuGdsQdInteractiveTableContextActionsHelper.addPresentationsKeyViewSubMenu(subGroup, context, dimension, keyView, mainAttributeModel, updateCommand);
			}
		}
		var textViews = mainAttributeModel.getTextViewsAvailable();
		if (mainAttributeModel.isDisplayText() && oFF.XCollectionUtils.hasElements(textViews) && textViews.size() > 1)
		{
			subGroup = intermediateGroup.addNewGroup();
			subGroup.setName(oFF.AuGdsQdInteractiveTableContextActionsHelper.TEXT_VIEWS);
			subGroup.setText("Text Type");
			for (i = 0; i < textViews.size(); i++)
			{
				var textView = textViews.get(i);
				oFF.AuGdsQdInteractiveTableContextActionsHelper.addPresentationsTextViewSubMenu(subGroup, context, dimension, textView, mainAttributeModel, updateCommand);
			}
		}
	}
};
oFF.AuGdsQdInteractiveTableContextActionsHelper.addPresentationsKeyViewSubMenu = function(subGroup, context, dimension, keyView, mainAttributeModel, updateCommand)
{
	var leaf = subGroup.addNewLeaf();
	leaf.setName(keyView.getName());
	leaf.setText(oFF.AuGdsQdInteractiveTableContextActionsHelper.mapPresentationType(keyView));
	var kvstsu =  function(){
		return oFF.XBooleanValue.create(mainAttributeModel.getKeyView() === keyView);
	}.bind(this);
	leaf.setStatusSupplier(kvstsu);
	leaf.setCommand( function(){
		mainAttributeModel.setKeyView(keyView);
		mainAttributeModel.applyToQueryModel(context.getQueryModel(), dimension.getName());
		updateCommand();
	}.bind(this));
};
oFF.AuGdsQdInteractiveTableContextActionsHelper.addPresentationsTextViewSubMenu = function(subGroup, context, dimension, textView, mainAttributeModel, updateCommand)
{
	var leaf = subGroup.addNewLeaf();
	leaf.setName(textView.getName());
	leaf.setText(oFF.AuGdsQdInteractiveTableContextActionsHelper.mapPresentationType(textView));
	var kvstsu =  function(){
		return oFF.XBooleanValue.create(mainAttributeModel.getTextView() === textView);
	}.bind(this);
	leaf.setStatusSupplier(kvstsu);
	leaf.setCommand( function(){
		mainAttributeModel.setTextView(textView);
		mainAttributeModel.applyToQueryModel(context.getQueryModel(), dimension.getName());
		updateCommand();
	}.bind(this));
};
oFF.AuGdsQdInteractiveTableContextActionsHelper.applyAttribute = function(context, dimension, mainAttributeModel, isFieldLayout)
{
	context.getQueryModel().getConvenienceCommands().clearAllAttributeFields(dimension.getName(), mainAttributeModel.getComponentName(), oFF.QContextType.RESULT_SET);
	mainAttributeModel.applyToQueryModel(context.getQueryModel(), dimension.getName());
	if (isFieldLayout)
	{
		oFF.AuGdsQdInteractiveTableContextActionsHelper.applyMainAttributeForFieldLayout(context, dimension, mainAttributeModel);
	}
};
oFF.AuGdsQdInteractiveTableContextActionsHelper.createHierarchyMenu = function(application, context, result, dimension, updateCommand)
{
	var caps = context.getModelCapabilities();
	var leaf;
	var intermediateGroup = result.addNewGroup();
	intermediateGroup.setText("Hierarchy");
	intermediateGroup.setName(oFF.AuGdsQdInteractiveTableContextActionsHelper.HIERARCHY_CONTEXT_MENU);
	intermediateGroup.setIcon("tree");
	var subGroup = intermediateGroup.addNewGroup();
	var hierarchyCatalogResult = dimension.getHierarchies();
	var hit = false;
	if (oFF.notNull(hierarchyCatalogResult))
	{
		var hierarchies = hierarchyCatalogResult.getObjects();
		if (oFF.XCollectionUtils.hasElements(hierarchies))
		{
			for (var i = 0; i < hierarchies.size(); i++)
			{
				var curHierarchy = hierarchies.get(i);
				hit = oFF.AuGdsQdInteractiveTableContextActionsHelper.createHierarchySelectionActions(subGroup, dimension, curHierarchy, updateCommand) || hit;
			}
		}
	}
	var customHierarchies = dimension.getCustomHierarchies();
	if (oFF.XCollectionUtils.hasElements(customHierarchies))
	{
		for (var j = 0; j < customHierarchies.size(); j++)
		{
			var customHierarchy = customHierarchies.get(j);
			hit = oFF.AuGdsQdInteractiveTableContextActionsHelper.createCustomHierarchySelectionActions(subGroup, dimension, customHierarchy, updateCommand) || hit;
		}
	}
	if (!hit && oFF.XStringUtils.isNotNullAndNotEmpty(dimension.getHierarchyName()))
	{
		leaf = subGroup.addNewLeaf();
		var localHierarchyName = dimension.getHierarchyName();
		leaf.setName(localHierarchyName);
		leaf.setText(localHierarchyName);
		leaf.setStatusSupplier( function(){
			return oFF.XBooleanValue.create(true);
		}.bind(this));
	}
	leaf = subGroup.addNewLeaf();
	leaf.setName(oFF.AuGdsQdInteractiveTableContextActionsHelper.HIERARCHY_DIALOG);
	leaf.setText("Select Hierarchy ...");
	var setParameterListener = oFF.AuGdsLambdaSetParameterListener.create( function(_key, _value){
		dimension.setHierarchyName(_value.getHierarchyName());
		dimension.setHierarchyActive(true);
		updateCommand();
		return _value;
	}.bind(this));
	var catalogManagerCreatedListener = oFF.AuGdsLambdaHierarchyCatalogManagerCreatedListener.create( function(_hcm){
		var catalogManager = _hcm.getData();
		var displayManager = oFF.OlapUiDisplayFactory.createFactoryForDialog(application.getProcess().getUiManager());
		var uiContext = oFF.OlapUiContext.createContext(application.getProcess().getUiManager(), displayManager);
		var hierarchyCatalogController = oFF.HierarchyCatalogController.create(uiContext);
		hierarchyCatalogController.openDialog("Hierarchy", catalogManager, setParameterListener, "hierarchy", null, null);
	}.bind(this));
	leaf.setCommand( function(){
		var serviceConfig = oFF.OlapApiModule.SERVICE_TYPE_HIERARCHY_CATALOG.createServiceConfig(application);
		serviceConfig.setSystemName(dimension.getQueryModel().getSystemName());
		var dataSource = dimension.getQueryModel().getDataSource().getFullQualifiedName();
		serviceConfig.setDataSourceName(dataSource);
		serviceConfig.setDimension(dimension);
		serviceConfig.processHierarchyCatalogManagerCreation(oFF.SyncType.NON_BLOCKING, catalogManagerCreatedListener, null).getData();
	}.bind(this));
	var hasHierarchy = oFF.XBooleanValue.create(oFF.XStringUtils.isNotNullAndNotEmpty(dimension.getHierarchyName()));
	subGroup = intermediateGroup.addNewGroup();
	leaf = subGroup.addNewLeaf();
	leaf.setText("Flat Presentation");
	leaf.setName(oFF.AuGdsQdInteractiveTableContextActionsHelper.FLAT_PRESENTATION_MENU);
	leaf.setEnablementSupplier( function(){
		return hasHierarchy;
	}.bind(this));
	leaf.setStatusSupplier( function(){
		return oFF.XBooleanValue.create(!dimension.isHierarchyActive());
	}.bind(this));
	leaf.setCommand( function(){
		dimension.setHierarchyActive(!dimension.isHierarchyActive());
		updateCommand();
	}.bind(this));
	subGroup = intermediateGroup.addNewGroup();
	subGroup.setName(oFF.AuGdsQdInteractiveTableContextActionsHelper.EXPAND_MENU_LEVEL);
	subGroup.setIcon("expand");
	subGroup.setText("Initial Display Level");
	leaf = subGroup.addNewLeaf();
	leaf.setText("All Nodes");
	leaf.setName(oFF.AuGdsQdInteractiveTableContextActionsHelper.FULL_EXPANSION_MENU);
	var dimensionHierarchyActiveSupplier =  function(){
		return oFF.XBooleanValue.create(dimension.isHierarchyActive());
	}.bind(this);
	leaf.setStatusSupplier( function(){
		return oFF.XBooleanValue.create(dimension.isHierarchyActive() && dimension.getInitialDrillLevel() === -1);
	}.bind(this));
	leaf.setEnablementSupplier(dimensionHierarchyActiveSupplier);
	leaf.setCommand( function(){
		dimension.setInitialDrillLevel(-1);
		updateCommand();
	}.bind(this));
	leaf = subGroup.addNewLeaf();
	leaf.setText("All Nodes +");
	leaf.setName(oFF.AuGdsQdInteractiveTableContextActionsHelper.FULL_P_EXPANSION_MENU);
	leaf.setStatusSupplier( function(){
		return oFF.XBooleanValue.create(dimension.isHierarchyActive() && dimension.getInitialDrillLevel() === -2);
	}.bind(this));
	leaf.setEnablementSupplier(dimensionHierarchyActiveSupplier);
	leaf.setCommand( function(){
		dimension.setInitialDrillLevel(-2);
		updateCommand();
	}.bind(this));
	leaf = subGroup.addNewLeaf();
	leaf.setText("Root Level");
	leaf.setName(oFF.AuGdsQdInteractiveTableContextActionsHelper.ROOT_NODE_EXPANSION_MENU);
	leaf.setStatusSupplier( function(){
		return oFF.XBooleanValue.create(dimension.isHierarchyActive() && dimension.getInitialDrillLevel() === 0);
	}.bind(this));
	leaf.setEnablementSupplier(dimensionHierarchyActiveSupplier);
	leaf.setCommand( function(){
		dimension.setInitialDrillLevel(0);
		updateCommand();
	}.bind(this));
	leaf = subGroup.addNewLeaf();
	leaf.setText("Root + 1 Child Level");
	leaf.setName(oFF.AuGdsQdInteractiveTableContextActionsHelper.L1_NODE_EXPANSION_MENU);
	leaf.setStatusSupplier( function(){
		return oFF.XBooleanValue.create(dimension.isHierarchyActive() && dimension.getInitialDrillLevel() === 1);
	}.bind(this));
	leaf.setEnablementSupplier(dimensionHierarchyActiveSupplier);
	leaf.setCommand( function(){
		dimension.setInitialDrillLevel(1);
		updateCommand();
	}.bind(this));
	leaf = subGroup.addNewLeaf();
	leaf.setText("Root + 2 Child Levels");
	leaf.setName(oFF.AuGdsQdInteractiveTableContextActionsHelper.L2_NODE_EXPANSION_MENU);
	leaf.setStatusSupplier( function(){
		return oFF.XBooleanValue.create(dimension.isHierarchyActive() && dimension.getInitialDrillLevel() === 2);
	}.bind(this));
	leaf.setEnablementSupplier(dimensionHierarchyActiveSupplier);
	leaf.setCommand( function(){
		dimension.setInitialDrillLevel(2);
		updateCommand();
	}.bind(this));
	leaf = subGroup.addNewLeaf();
	leaf.setText("Root + 3 Child Levels");
	leaf.setName(oFF.AuGdsQdInteractiveTableContextActionsHelper.L3_NODE_EXPANSION_MENU);
	leaf.setStatusSupplier( function(){
		return oFF.XBooleanValue.create(dimension.isHierarchyActive() && dimension.getInitialDrillLevel() === 3);
	}.bind(this));
	leaf.setEnablementSupplier(dimensionHierarchyActiveSupplier);
	leaf.setCommand( function(){
		dimension.setInitialDrillLevel(3);
		updateCommand();
	}.bind(this));
	leaf = subGroup.addNewLeaf();
	leaf.setText("Root + 4 Child Levels");
	leaf.setName(oFF.AuGdsQdInteractiveTableContextActionsHelper.L4_NODE_EXPANSION_MENU);
	leaf.setStatusSupplier( function(){
		return oFF.XBooleanValue.create(dimension.isHierarchyActive() && dimension.getInitialDrillLevel() === 4);
	}.bind(this));
	leaf.setEnablementSupplier(dimensionHierarchyActiveSupplier);
	leaf.setCommand( function(){
		dimension.setInitialDrillLevel(4);
		updateCommand();
	}.bind(this));
	leaf = subGroup.addNewLeaf();
	leaf.setText("Root + 5 Child Levels");
	leaf.setName(oFF.AuGdsQdInteractiveTableContextActionsHelper.L5_NODE_EXPANSION_MENU);
	leaf.setStatusSupplier( function(){
		return oFF.XBooleanValue.create(dimension.isHierarchyActive() && dimension.getInitialDrillLevel() === 5);
	}.bind(this));
	leaf.setEnablementSupplier(dimensionHierarchyActiveSupplier);
	leaf.setCommand( function(){
		dimension.setInitialDrillLevel(5);
		updateCommand();
	}.bind(this));
	subGroup = intermediateGroup.addNewGroup();
	if (caps.supportsExpandBottomUp())
	{
		leaf = subGroup.addNewLeaf();
		leaf.setText("Children above Parent");
		leaf.setName(oFF.AuGdsQdInteractiveTableContextActionsHelper.EXPAND_BOTTOM_UP_MENU);
		leaf.setStatusSupplier( function(){
			return oFF.XBooleanValue.create(dimension.getLowerLevelNodeAlignment() === oFF.Alignment.CHILDREN_ABOVE_PARENT);
		}.bind(this));
		leaf.setEnablementSupplier(dimensionHierarchyActiveSupplier);
		leaf.setCommand( function(){
			dimension.setLowerLevelNodeAlignment(dimension.getLowerLevelNodeAlignment() === oFF.Alignment.CHILDREN_ABOVE_PARENT ? oFF.Alignment.CHILDREN_BELOW_PARENT : oFF.Alignment.CHILDREN_ABOVE_PARENT);
			updateCommand();
		}.bind(this));
	}
	leaf = subGroup.addNewLeaf();
	leaf.setText("Node Condensation");
	leaf.setName(oFF.AuGdsQdInteractiveTableContextActionsHelper.ACTIVATE_NODE_CONDENSATION_MENU);
	leaf.setStatusSupplier( function(){
		return oFF.XBooleanValue.create(dimension.hasNodeCondensation());
	}.bind(this));
	leaf.setEnablementSupplier(dimensionHierarchyActiveSupplier);
	leaf.setCommand( function(){
		dimension.setHasNodeCondensation(!dimension.hasNodeCondensation());
		updateCommand();
	}.bind(this));
	leaf = subGroup.addNewLeaf();
	leaf.setText("Show Posted Nodes");
	leaf.setName(oFF.AuGdsQdInteractiveTableContextActionsHelper.SHOW_POSTED_NODES_MENU);
	leaf.setStatusSupplier( function(){
		return oFF.XBooleanValue.create(dimension.getMemberOfPostedNodeVisibility() === oFF.ResultVisibility.ALWAYS);
	}.bind(this));
	leaf.setEnablementSupplier(dimensionHierarchyActiveSupplier);
	leaf.setCommand( function(){
		dimension.setMemberOfPostedNodeVisibility(dimension.getMemberOfPostedNodeVisibility() === oFF.ResultVisibility.ALWAYS ? oFF.ResultVisibility.HIDDEN : oFF.ResultVisibility.ALWAYS);
		updateCommand();
	}.bind(this));
};
oFF.AuGdsQdInteractiveTableContextActionsHelper.createCustomHierarchySelectionActions = function(subGroup, dimension, customHierarchy, updateCommand)
{
	var leaf = subGroup.addNewLeaf();
	var localHierarchyName = customHierarchy.getHierarchyName();
	var localHierarchyText = customHierarchy.getHierarchyDescription();
	if (oFF.XStringUtils.isNullOrEmpty(localHierarchyText))
	{
		localHierarchyText = localHierarchyName;
	}
	var activ = oFF.XString.isEqual(dimension.getHierarchyName(), customHierarchy.getHierarchyName());
	leaf.setName(localHierarchyName);
	leaf.setText(localHierarchyText);
	leaf.setStatusSupplier( function(){
		return oFF.XBooleanValue.create(activ);
	}.bind(this));
	leaf.setCommand( function(){
		dimension.setHierarchyName(customHierarchy.getHierarchyName());
		dimension.setHierarchyActive(true);
		updateCommand();
	}.bind(this));
	return activ;
};
oFF.AuGdsQdInteractiveTableContextActionsHelper.createHierarchySelectionActions = function(subGroup, dimension, curHierarchy, updateCommand)
{
	var leaf = subGroup.addNewLeaf();
	var localHierarchyName = curHierarchy.getHierarchyName();
	var localHierarchyText = curHierarchy.getHierarchyDescription();
	if (oFF.XStringUtils.isNullOrEmpty(localHierarchyText))
	{
		localHierarchyText = localHierarchyName;
	}
	var active = oFF.XString.isEqual(dimension.getHierarchyName(), curHierarchy.getHierarchyName());
	leaf.setName(localHierarchyName);
	leaf.setText(localHierarchyText);
	leaf.setStatusSupplier( function(){
		return oFF.XBooleanValue.create(active);
	}.bind(this));
	leaf.setCommand( function(){
		dimension.setHierarchyName(curHierarchy.getHierarchyName());
		dimension.setHierarchyActive(true);
		updateCommand();
	}.bind(this));
	return active;
};
oFF.AuGdsQdInteractiveTableContextActionsHelper.createAttributeOrFieldMenu = function(application, context, result, dimension, fieldNameList, updateCommand)
{
	var fieldList = oFF.XStream.ofString(fieldNameList).map( function(se){
		return dimension.getFieldByName(se.getString());
	}.bind(this)).collect(oFF.XStreamCollector.toList());
	var leaf;
	var group;
	var attributeBasedLayout = dimension.getFieldLayoutType() === oFF.FieldLayoutType.ATTRIBUTE_BASED;
	var axisType = dimension.getAxisType();
	if (!oFF.XStream.of(fieldList).anyMatch( function(fi){
		return fi.getAttribute() === dimension.getMainAttribute() && (attributeBasedLayout || fi === dimension.getTextField() || fi === dimension.getKeyField());
	}.bind(this)))
	{
		var firstNonMainAttributeIndex;
		var mayMoveUp;
		if (attributeBasedLayout)
		{
			leaf = result.addNewLeaf();
			leaf.setText("Attributes");
			leaf.setEnablementSupplier( function(){
				return oFF.XBooleanValue.create(false);
			}.bind(this));
			group = result.addNewGroup();
			group.setText("Move");
			group.setName(oFF.AuGdsQdInteractiveTableContextActionsHelper.MOVE_CONTEXT_MENU);
			group.setIcon("move");
			var attributeSet = oFF.XLinkedMap.createLinkedMap();
			var attributeList = oFF.XStream.of(fieldList).map( function(fil){
				return fil.getAttribute();
			}.bind(this)).collect(oFF.XStreamCollector.to(attributeSet));
			var resultSetAttributes = dimension.getResultSetAttributes();
			firstNonMainAttributeIndex = resultSetAttributes.get(0) === dimension.getMainAttribute() ? 1 : 0;
			leaf = group.addNewLeaf();
			mayMoveUp = resultSetAttributes.getIndex(attributeSet.get(0)) > firstNonMainAttributeIndex;
			leaf.setEnablementSupplier( function(){
				return oFF.XBooleanValue.create(mayMoveUp);
			}.bind(this));
			if (axisType === oFF.AxisType.ROWS)
			{
				leaf.setText("Left");
				leaf.setIcon("arrow-left");
			}
			else
			{
				leaf.setText("Up");
				leaf.setIcon("arrow-top");
			}
			leaf.setName(oFF.AuGdsQdInteractiveTableContextActionsHelper.LEVEL_UP_MENU);
			leaf.setCommand( function(){
				oFF.AuGdsQdInteractiveTableContextActionsHelper.moveAttributes(dimension, attributeList, -1);
				updateCommand();
			}.bind(this));
			leaf = group.addNewLeaf();
			leaf.setEnablementSupplier( function(){
				return oFF.XBooleanValue.create(resultSetAttributes.getIndex(attributeSet.get(attributeSet.size() - 1)) < resultSetAttributes.size() - 1);
			}.bind(this));
			if (axisType === oFF.AxisType.ROWS)
			{
				leaf.setText("Right");
				leaf.setIcon("arrow-right");
			}
			else
			{
				leaf.setText("Down");
				leaf.setIcon("arrow-bottom");
			}
			leaf.setName(oFF.AuGdsQdInteractiveTableContextActionsHelper.LEVEL_DOWN_MENU);
			leaf.setCommand( function(){
				oFF.AuGdsQdInteractiveTableContextActionsHelper.moveAttributes(dimension, attributeList, 1);
				updateCommand();
			}.bind(this));
		}
		else
		{
			var resultSetFields = dimension.getResultSetFields();
			for (firstNonMainAttributeIndex = 0; firstNonMainAttributeIndex < resultSetFields.size(); firstNonMainAttributeIndex++)
			{
				var fnmaf = resultSetFields.get(firstNonMainAttributeIndex);
				if (fnmaf.getAttribute() !== dimension.getMainAttribute() || (fnmaf !== dimension.getKeyField() && fnmaf !== dimension.getTextField()))
				{
					break;
				}
			}
			leaf = result.addNewLeaf();
			leaf.setText("Fields");
			leaf.setEnablementSupplier( function(){
				return oFF.XBooleanValue.create(false);
			}.bind(this));
			group = result.addNewGroup();
			group.setText("Move");
			group.setName(oFF.AuGdsQdInteractiveTableContextActionsHelper.MOVE_CONTEXT_MENU);
			group.setIcon("move");
			leaf = group.addNewLeaf();
			mayMoveUp = resultSetFields.getIndex(fieldList.get(0)) > firstNonMainAttributeIndex;
			leaf.setEnablementSupplier( function(){
				return oFF.XBooleanValue.create(mayMoveUp);
			}.bind(this));
			if (axisType === oFF.AxisType.ROWS)
			{
				leaf.setText("Left");
				leaf.setIcon("arrow-left");
			}
			else
			{
				leaf.setText("Up");
				leaf.setIcon("arrow-top");
			}
			leaf.setName(oFF.AuGdsQdInteractiveTableContextActionsHelper.LEVEL_UP_MENU);
			leaf.setCommand( function(){
				oFF.AuGdsQdInteractiveTableContextActionsHelper.moveFields(dimension, fieldList, -1);
				updateCommand();
			}.bind(this));
			leaf = group.addNewLeaf();
			leaf.setEnablementSupplier( function(){
				return oFF.XBooleanValue.create(resultSetFields.getIndex(fieldList.get(fieldList.size() - 1)) < resultSetFields.size() - 1);
			}.bind(this));
			if (axisType === oFF.AxisType.ROWS)
			{
				leaf.setText("Right");
				leaf.setIcon("arrow-right");
			}
			else
			{
				leaf.setText("Down");
				leaf.setIcon("arrow-bottom");
			}
			leaf.setName(oFF.AuGdsQdInteractiveTableContextActionsHelper.LEVEL_DOWN_MENU);
			leaf.setCommand( function(){
				oFF.AuGdsQdInteractiveTableContextActionsHelper.moveFields(dimension, fieldList, 1);
				updateCommand();
			}.bind(this));
		}
	}
};
oFF.AuGdsQdInteractiveTableContextActionsHelper.createDimensionMoveMenu = function(application, context, result, dimensionsWithGaps, dimensions, isMultiSelectWithGaps, updateCommand, fieldNamesSelected)
{
	if (oFF.XCollectionUtils.hasElements(dimensions))
	{
		var axis = dimensions.get(0).getAxis();
		var subGroup = null;
		if ((axis.getType() === oFF.AxisType.ROWS || axis.getType() === oFF.AxisType.COLUMNS))
		{
			subGroup = result.addNewGroup();
			subGroup.setText("Move");
			subGroup.setName(oFF.AuGdsQdInteractiveTableContextActionsHelper.MOVE_CONTEXT_MENU);
			subGroup.setIcon("move");
		}
		var axisSize = axis.size();
		var leaf;
		if (axisSize > 1 && !isMultiSelectWithGaps && (axis.getType() === oFF.AxisType.ROWS || axis.getType() === oFF.AxisType.COLUMNS))
		{
			var axisIndexMin = axis.getIndex(dimensions.get(0));
			var axisIndexMax = axis.getIndex(dimensions.get(dimensions.size() - 1));
			leaf = subGroup.addNewLeaf();
			leaf.setEnablementSupplier( function(){
				return oFF.XBooleanValue.create(axisIndexMin > 0);
			}.bind(this));
			if (axis.getType() === oFF.AxisType.ROWS)
			{
				leaf.setText("Left");
				leaf.setIcon("arrow-left");
			}
			else
			{
				leaf.setText("Up");
				leaf.setIcon("arrow-top");
			}
			leaf.setName(oFF.AuGdsQdInteractiveTableContextActionsHelper.LEVEL_UP_MENU);
			leaf.setCommand( function(){
				oFF.AuGdsQdInteractiveTableContextActionsHelper.moveDimensions(dimensions, -1);
				updateCommand();
			}.bind(this));
			leaf = subGroup.addNewLeaf();
			leaf.setEnablementSupplier( function(){
				return oFF.XBooleanValue.create(axisIndexMax < axisSize - 1);
			}.bind(this));
			if (axis.getType() === oFF.AxisType.ROWS)
			{
				leaf.setText("Right");
				leaf.setIcon("arrow-right");
			}
			else
			{
				leaf.setText("Down");
				leaf.setIcon("arrow-bottom");
			}
			leaf.setName(oFF.AuGdsQdInteractiveTableContextActionsHelper.LEVEL_DOWN_MENU);
			leaf.setCommand( function(){
				oFF.AuGdsQdInteractiveTableContextActionsHelper.moveDimensions(dimensions, 1);
				updateCommand();
			}.bind(this));
		}
		var dimensionsToMoveCol = axis.getType() === oFF.AxisType.COLUMNS ? null : oFF.XStream.of(dimensionsWithGaps).filter( function(rmFF){
			return rmFF.supportsAxis(oFF.AxisType.COLUMNS);
		}.bind(this)).collect(oFF.XStreamCollector.toList());
		var mayMoveToCol = oFF.XCollectionUtils.hasElements(dimensionsToMoveCol);
		if (axis.getType() === oFF.AxisType.ROWS || axis.getType() === oFF.AxisType.COLUMNS)
		{
			leaf = subGroup.addNewLeaf();
			leaf.setText("To Columns");
		}
		else
		{
			leaf = result.addNewLeaf();
			leaf.setText("Move to Columns");
		}
		leaf.setEnablementSupplier( function(){
			return oFF.XBooleanValue.create(mayMoveToCol);
		}.bind(this));
		leaf.setIcon("table-column");
		leaf.setName(oFF.AuGdsQdInteractiveTableContextActionsHelper.MOVE_TO_COL_MENU);
		leaf.setCommand( function(){
			oFF.AuGdsQdInteractiveTableContextActionsHelper.moveToAxis(context, dimensionsToMoveCol, oFF.AxisType.COLUMNS);
			updateCommand();
		}.bind(this));
		var dimensionsToMoveRow = axis.getType() === oFF.AxisType.ROWS ? null : oFF.XStream.of(dimensionsWithGaps).filter( function(rmFF1){
			return rmFF1.supportsAxis(oFF.AxisType.ROWS);
		}.bind(this)).collect(oFF.XStreamCollector.toList());
		var mayMoveToRow = oFF.XCollectionUtils.hasElements(dimensionsToMoveRow);
		if (axis.getType() === oFF.AxisType.ROWS || axis.getType() === oFF.AxisType.COLUMNS)
		{
			leaf = subGroup.addNewLeaf();
			leaf.setText("To Rows");
		}
		else
		{
			leaf = result.addNewLeaf();
			leaf.setText("Move to Rows");
		}
		leaf.setEnablementSupplier( function(){
			return oFF.XBooleanValue.create(mayMoveToRow);
		}.bind(this));
		leaf.setIcon("table-row");
		leaf.setName(oFF.AuGdsQdInteractiveTableContextActionsHelper.MOVE_TO_ROW_MENU);
		leaf.setCommand( function(){
			oFF.AuGdsQdInteractiveTableContextActionsHelper.moveToAxis(context, dimensionsToMoveRow, oFF.AxisType.ROWS);
			updateCommand();
		}.bind(this));
		var dimensionsToMoveFree = oFF.XStream.of(dimensionsWithGaps).filter( function(rmFF2){
			return rmFF2.supportsAxis(oFF.AxisType.FREE);
		}.bind(this)).collect(oFF.XStreamCollector.toList());
		if ((axis.getType() === oFF.AxisType.ROWS || axis.getType() === oFF.AxisType.COLUMNS))
		{
			var mayMoveToFree = oFF.XCollectionUtils.hasElements(dimensionsToMoveFree);
			leaf = result.addNewLeaf();
			leaf.setEnablementSupplier( function(){
				return oFF.XBooleanValue.create(mayMoveToFree);
			}.bind(this));
			leaf.setText("Remove");
			leaf.setIcon("delete");
			leaf.setName(oFF.AuGdsQdInteractiveTableContextActionsHelper.MOVE_TO_FREE_MENU);
			leaf.setCommand( function(){
				oFF.AuGdsQdInteractiveTableContextActionsHelper.moveToAxis(context, dimensionsToMoveFree, oFF.AxisType.FREE);
				updateCommand();
			}.bind(this));
		}
	}
};
oFF.AuGdsQdInteractiveTableContextActionsHelper.createAxisMenu = function(application, context, result, axis, updateCommand)
{
	oFF.AuGdsQdInteractiveTableContextActionsHelper.createTotalsMenu(application, context, result, axis.getResultStructureController(), axis.getType(), updateCommand);
	var zeroSuppressionTypes = axis.getAvailableZeroSuppressionTypes();
	var leaf;
	if (oFF.XCollectionUtils.hasElements(zeroSuppressionTypes))
	{
		var subGroup = result.addNewGroup();
		subGroup.setText("Zero Suppression");
		subGroup.setName(oFF.AuGdsQdInteractiveTableContextActionsHelper.SUPPRESS_ZEROS_MENU);
		for (var i = 0; i < zeroSuppressionTypes.size(); i++)
		{
			var zeroSuppressionType = zeroSuppressionTypes.get(i);
			oFF.AuGdsQdInteractiveTableContextActionsHelper.addZeroSuppressionItem(subGroup, axis, zeroSuppressionType, updateCommand);
		}
	}
	if (context.getModelCapabilities().supportsUniversalDisplayHierarchies())
	{
		var enablement =  function(){
			return oFF.XBooleanValue.create(axis.size() > 1);
		}.bind(this);
		var intermediateGroup = result.addNewGroup();
		intermediateGroup.setName(oFF.AuGdsQdInteractiveTableContextActionsHelper.UDH_SUBMENU);
		intermediateGroup.setText("Hierarchy");
		intermediateGroup.setIcon("tree");
		var subgroup = intermediateGroup.addNewGroup();
		leaf = subgroup.addNewLeaf();
		leaf.setName(oFF.AuGdsQdInteractiveTableContextActionsHelper.ACTIVATE_UDH_MENU);
		leaf.setEnablementSupplier(enablement);
		leaf.setText("Display Axis Hierarchically");
		var udh = context.getQueryModel().getUniversalDisplayHierarchies().getByAxisType(axis.getType());
		leaf.setStatusSupplier( function(){
			return oFF.XBooleanValue.create(oFF.notNull(udh) && udh.isActive());
		}.bind(this));
		leaf.setCommand( function(){
			if (oFF.notNull(udh))
			{
				udh.setActive(!udh.isActive());
			}
			else
			{
				context.getQueryManager().getConvenienceCommands().setUniversalDisplayHierarchy(axis.getDimensionNames().createListOfStringCopy(), -1, true);
			}
			updateCommand();
		}.bind(this));
		if (context.getModelCapabilities().supportsExpandBottomUp())
		{
			subgroup = intermediateGroup.addNewGroup();
			leaf = subgroup.addNewLeaf();
			leaf.setText("Children above Parent");
			leaf.setName(oFF.AuGdsQdInteractiveTableContextActionsHelper.EXPAND_BOTTOM_UP_MENU);
			leaf.setStatusSupplier( function(){
				return oFF.XBooleanValue.create(oFF.notNull(udh) && udh.getAlignment() === oFF.Alignment.CHILDREN_ABOVE_PARENT);
			}.bind(this));
			leaf.setEnablementSupplier( function(){
				return oFF.XBooleanValue.create(oFF.notNull(udh) && udh.isActive());
			}.bind(this));
			leaf.setCommand( function(){
				if (oFF.notNull(udh))
				{
					udh.setAlignment(udh.getAlignment() === oFF.Alignment.CHILDREN_ABOVE_PARENT ? oFF.Alignment.CHILDREN_BELOW_PARENT : oFF.Alignment.CHILDREN_ABOVE_PARENT);
				}
				updateCommand();
			}.bind(this));
		}
		subgroup = intermediateGroup.addNewGroup();
		subgroup.setName(oFF.AuGdsQdInteractiveTableContextActionsHelper.EXPAND_MENU_UDH);
		subgroup.setText("Initial Display Level");
		subgroup.setIcon("expand");
		leaf = subgroup.addNewLeaf();
		leaf.setName(oFF.AuGdsQdInteractiveTableContextActionsHelper.UDH_FULL_EXPAND_MENU);
		leaf.setText("All Nodes");
		leaf.setStatusSupplier( function(){
			return oFF.XBooleanValue.create(oFF.notNull(udh) && udh.getInitialDrillLevel() === -1);
		}.bind(this));
		leaf.setEnablementSupplier( function(){
			return oFF.XBooleanValue.create(oFF.notNull(udh) && udh.isActive());
		}.bind(this));
		leaf.setCommand( function(){
			if (oFF.notNull(udh))
			{
				udh.setInitialDrillLevel(-1);
			}
			updateCommand();
		}.bind(this));
		leaf = subgroup.addNewLeaf();
		leaf.setName(oFF.AuGdsQdInteractiveTableContextActionsHelper.UDH_ROOT_EXPAND_MENU);
		leaf.setText("Root Level");
		leaf.setStatusSupplier( function(){
			return oFF.XBooleanValue.create(oFF.notNull(udh) && udh.getInitialDrillLevel() === 0);
		}.bind(this));
		leaf.setEnablementSupplier( function(){
			return oFF.XBooleanValue.create(oFF.notNull(udh) && udh.isActive());
		}.bind(this));
		leaf.setCommand( function(){
			if (oFF.notNull(udh))
			{
				udh.setInitialDrillLevel(0);
			}
			updateCommand();
		}.bind(this));
		leaf = subgroup.addNewLeaf();
		leaf.setName(oFF.AuGdsQdInteractiveTableContextActionsHelper.UDH_L1_EXPAND_MENU);
		leaf.setText("Root + 1 Child Level");
		leaf.setStatusSupplier( function(){
			return oFF.XBooleanValue.create(oFF.notNull(udh) && udh.getInitialDrillLevel() === 1);
		}.bind(this));
		leaf.setEnablementSupplier( function(){
			return oFF.XBooleanValue.create(oFF.notNull(udh) && udh.isActive());
		}.bind(this));
		leaf.setCommand( function(){
			if (oFF.notNull(udh))
			{
				udh.setInitialDrillLevel(1);
			}
			updateCommand();
		}.bind(this));
		leaf = subgroup.addNewLeaf();
		leaf.setName(oFF.AuGdsQdInteractiveTableContextActionsHelper.UDH_L2_EXPAND_MENU);
		leaf.setText("Root + 2 Child Levels");
		leaf.setStatusSupplier( function(){
			return oFF.XBooleanValue.create(oFF.notNull(udh) && udh.getInitialDrillLevel() === 2);
		}.bind(this));
		leaf.setEnablementSupplier( function(){
			return oFF.XBooleanValue.create(oFF.notNull(udh) && udh.isActive());
		}.bind(this));
		leaf.setCommand( function(){
			if (oFF.notNull(udh))
			{
				udh.setInitialDrillLevel(2);
			}
			updateCommand();
		}.bind(this));
		leaf = subgroup.addNewLeaf();
		leaf.setName(oFF.AuGdsQdInteractiveTableContextActionsHelper.UDH_L3_EXPAND_MENU);
		leaf.setText("Root + 3 Child Levels");
		leaf.setStatusSupplier( function(){
			return oFF.XBooleanValue.create(oFF.notNull(udh) && udh.getInitialDrillLevel() === 3);
		}.bind(this));
		leaf.setEnablementSupplier( function(){
			return oFF.XBooleanValue.create(oFF.notNull(udh) && udh.isActive());
		}.bind(this));
		leaf.setCommand( function(){
			if (oFF.notNull(udh))
			{
				udh.setInitialDrillLevel(3);
			}
			updateCommand();
		}.bind(this));
		leaf = subgroup.addNewLeaf();
		leaf.setName(oFF.AuGdsQdInteractiveTableContextActionsHelper.UDH_L4_EXPAND_MENU);
		leaf.setText("Root + 4 Child Levels");
		leaf.setStatusSupplier( function(){
			return oFF.XBooleanValue.create(oFF.notNull(udh) && udh.getInitialDrillLevel() === 4);
		}.bind(this));
		leaf.setEnablementSupplier( function(){
			return oFF.XBooleanValue.create(oFF.notNull(udh) && udh.isActive());
		}.bind(this));
		leaf.setCommand( function(){
			if (oFF.notNull(udh))
			{
				udh.setInitialDrillLevel(4);
			}
			updateCommand();
		}.bind(this));
		leaf = subgroup.addNewLeaf();
		leaf.setName(oFF.AuGdsQdInteractiveTableContextActionsHelper.UDH_L5_EXPAND_MENU);
		leaf.setText("Root + 5 Child Levels");
		leaf.setStatusSupplier( function(){
			return oFF.XBooleanValue.create(oFF.notNull(udh) && udh.getInitialDrillLevel() === 5);
		}.bind(this));
		leaf.setEnablementSupplier( function(){
			return oFF.XBooleanValue.create(oFF.notNull(udh) && udh.isActive());
		}.bind(this));
		leaf.setCommand( function(){
			if (oFF.notNull(udh))
			{
				udh.setInitialDrillLevel(5);
			}
			updateCommand();
		}.bind(this));
	}
};
oFF.AuGdsQdInteractiveTableContextActionsHelper.addZeroSuppressionItem = function(subGroup, axis, zeroSuppressionType, updateCommand)
{
	var leaf = subGroup.addNewLeaf();
	leaf.setName(zeroSuppressionType.getName());
	leaf.setText(oFF.AuGdsQdInteractiveTableContextActionsHelper.mapZeroSuppressionType(zeroSuppressionType));
	var isActive = axis.getZeroSuppressionType() === zeroSuppressionType;
	var zsstsu =  function(){
		return oFF.XBooleanValue.create(isActive);
	}.bind(this);
	leaf.setStatusSupplier(zsstsu);
	leaf.setCommand( function(){
		axis.setZeroSuppressionType(zeroSuppressionType);
		updateCommand();
	}.bind(this));
};
oFF.AuGdsQdInteractiveTableContextActionsHelper.createQueryMenu = function(application, queryModel, subGroup, updateCommand)
{
	oFF.AuGdsQdInteractiveTableContextActionsHelper.createTotalsMenu(application, queryModel, subGroup, queryModel.getResultStructureController(), null, updateCommand);
	var caps = queryModel.getModelCapabilities();
	var leaf;
	leaf = subGroup.addNewLeaf();
	leaf.setName(oFF.AuGdsQdInteractiveTableContextActionsHelper.SWAP_AXIS);
	leaf.setIcon("journey-change");
	leaf.setText("Swap Axes");
	leaf.setCommand( function(){
		queryModel.getConvenienceCommands().switchAxes();
		updateCommand();
	}.bind(this));
	if (caps.supportsQueryCurrencyTranslation())
	{
		leaf = subGroup.addNewLeaf();
		leaf.setName(oFF.AuGdsQdInteractiveTableContextActionsHelper.SELECT_CONVERSION_MENU);
		leaf.setIcon("collections-insight");
		leaf.setText("Currency Conversion ...");
		leaf.setCommand( function(){
			oFF.AuGdsQdInteractiveTableContextActionsHelper.openCurrencyDialog(application, queryModel, updateCommand);
		}.bind(this));
	}
	leaf = subGroup.addNewLeaf();
	leaf.setName(oFF.AuGdsQdInteractiveTableContextActionsHelper.LAYOUT_BTN);
	leaf.setText("Layout ...");
	leaf.setIcon("chart-axis");
	leaf.setCommand( function(){
		oFF.AuGdsQdInteractiveTableContextActionsHelper.openLayoutDialog(application, queryModel, updateCommand);
	}.bind(this));
	var dimensionsMenu = subGroup.addNewGroup();
	dimensionsMenu.setName(oFF.AuGdsQdInteractiveTableContextActionsHelper.DIMENSIONS_CONTEXT_MENU);
	dimensionsMenu.setText("Dimensions");
	dimensionsMenu.setIcon("dimension");
	var counter = 0;
	var dimsIterator = queryModel.getDimensions().getIterator();
	while (dimsIterator.hasNext())
	{
		var dim = dimsIterator.next();
		if (dim.isUniversalDisplayHierarchyDimension() || !dim.supportsAxis(oFF.AxisType.COLUMNS) && !dim.supportsAxis(oFF.AxisType.ROWS))
		{
			continue;
		}
		if (counter === oFF.AuGdsQdInteractiveTableContextActionsHelper.MAX_PAGE_SIZE)
		{
			counter = 0;
			dimensionsMenu = dimensionsMenu.addNewGroup();
			dimensionsMenu.setName(oFF.AuGdsQdInteractiveTableContextActionsHelper.DIMENSIONS_CONTEXT_MENU);
			dimensionsMenu.setText("Next Page");
		}
		counter++;
		var dimMenu = dimensionsMenu.addNewGroup();
		dimMenu.setName(dim.getName());
		dimMenu.setText(dim.getText());
		var dimList = oFF.XList.create();
		dimList.add(dim);
		oFF.AuGdsQdInteractiveTableContextActionsHelper.createDimensionMenu(application, queryModel, dimMenu, dimList, dimList, null, false, updateCommand, null, false);
	}
};
oFF.AuGdsQdInteractiveTableContextActionsHelper.createCellMenu = function(application, context, subGroup, selectedMeasure, selectedNonMeasureStructure, updateProcedure)
{
	var leaf;
	if (oFF.notNull(selectedMeasure))
	{
		leaf = subGroup.addNewLeaf();
		leaf.setName(oFF.AuGdsQdInteractiveTableContextActionsHelper.MEASURE_SETTINGS_MENU);
		leaf.setIcon("action-settings");
		leaf.setText("Measure ...");
		leaf.setCommand( function(){
			oFF.AuGdsQdInteractiveTableContextActionsHelper.openDataCellDialogForMember(application, context, selectedMeasure, null, updateProcedure);
		}.bind(this));
		oFF.AuGdsQdInteractiveTableContextActionsHelper.createMemberMoveMenu(application, context, subGroup, selectedMeasure, updateProcedure);
		var subSubGroup = subGroup.addNewGroup();
		if (oFF.notNull(selectedNonMeasureStructure))
		{
			leaf = subSubGroup.addNewLeaf();
			leaf.setName(oFF.AuGdsQdInteractiveTableContextActionsHelper.SECONDARY_STRUCTURE_MEMBER_SETTINGS_MENU);
			leaf.setIcon("action-settings");
			leaf.setText("Cell ...");
			leaf.setCommand( function(){
				oFF.AuGdsQdInteractiveTableContextActionsHelper.openDataCellDialogForMember(application, context, selectedMeasure, selectedNonMeasureStructure, updateProcedure);
			}.bind(this));
		}
	}
};
oFF.AuGdsQdInteractiveTableContextActionsHelper.getGridSettingsMenu = function(tableView, result)
{
	var userActionGroup = result;
	if (tableView.isOnHeaderColumns() || tableView.isOnHeaderRows() || tableView.isOnDataColumns() || tableView.isOnDataRows())
	{
		userActionGroup = result.addNewGroup();
		userActionGroup.setIcon("provision");
		userActionGroup.setName(oFF.AuGdsQdInteractiveTableContextActionsHelper.GRID_SETTINGS_MENU);
		userActionGroup.setName("Grid Settings");
		userActionGroup.setText("Grid");
	}
	var freezeGroup = userActionGroup.addNewGroup();
	freezeGroup.setName(oFF.AuGdsQdInteractiveTableContextActionsHelper.FREEZE_MENU);
	freezeGroup.setText("Freeze");
	freezeGroup.setIcon("locked");
	oFF.AuGdsQdInteractiveTableContextActionsHelper.createFreezeMenu(tableView, freezeGroup);
	var showGroup = userActionGroup.addNewGroup();
	showGroup.setText("Show/Hide");
	showGroup.setIcon("show");
	showGroup.setName(oFF.AuGdsQdInteractiveTableContextActionsHelper.SHOW_HIDE_MENU);
	oFF.AuGdsQdInteractiveTableContextActionsHelper.createShowGridMenu(tableView, showGroup);
	var themeGroup = userActionGroup.addNewGroup();
	themeGroup.setName(oFF.AuGdsQdInteractiveTableContextActionsHelper.THEME_MENU);
	themeGroup.setText("Themes");
	themeGroup.setIcon("palette");
	oFF.AuGdsQdInteractiveTableContextActionsHelper.createThemeMenu(tableView, themeGroup);
	return userActionGroup;
};
oFF.AuGdsQdInteractiveTableContextActionsHelper.createFreezeMenu = function(tableView, freezeGroup)
{
	var freezer = freezeGroup.addNewLeaf();
	freezer.setName(oFF.AuGdsQdInteractiveTableContextActionsHelper.FREEZE_COLUMNS_MENU);
	freezer.setText("Freeze Column Headers");
	freezer.setStatusSupplier( function(){
		return oFF.XBooleanValue.create(tableView.getTableConfig().isFreezeRows());
	}.bind(this));
	freezer.setCommand( function(){
		tableView.getTableConfig().setFreezeRows(!tableView.getTableConfig().isFreezeRows());
		tableView.reRenderTitleAndGenericSettings(true);
	}.bind(this));
	freezer = freezeGroup.addNewLeaf();
	freezer.setName(oFF.AuGdsQdInteractiveTableContextActionsHelper.FREEZE_ROWS_MENU);
	freezer.setText("Freeze Row Headers");
	freezer.setStatusSupplier( function(){
		return oFF.XBooleanValue.create(tableView.getTableConfig().isFreezeColumns());
	}.bind(this));
	freezer.setCommand( function(){
		tableView.getTableConfig().setFreezeColumns(!tableView.getTableConfig().isFreezeColumns());
		tableView.reRenderTitleAndGenericSettings(true);
	}.bind(this));
	freezer = freezeGroup.addNewLeaf();
	freezer.setName(oFF.AuGdsQdInteractiveTableContextActionsHelper.FREEZE_ALL_MENU);
	freezer.setText("Freeze Headers");
	freezer.setStatusSupplier( function(){
		return oFF.XBooleanValue.create(tableView.getTableConfig().isFreeze());
	}.bind(this));
	freezer.setCommand( function(){
		tableView.getTableConfig().setFreeze(!tableView.getTableConfig().isFreeze());
		tableView.reRenderTitleAndGenericSettings(true);
	}.bind(this));
};
oFF.AuGdsQdInteractiveTableContextActionsHelper.createShowGridMenu = function(tableView, showGroup)
{
	var showSection = showGroup.addNewGroup();
	var shower = showSection.addNewLeaf();
	shower.setText("Grid");
	shower.setName(oFF.AuGdsQdInteractiveTableContextActionsHelper.SHOW_GRID_MENU);
	shower.setStatusSupplier( function(){
		return oFF.XBooleanValue.create(tableView.getTableConfig().isShowGrid());
	}.bind(this));
	shower.setCommand( function(){
		tableView.getTableConfig().setShowGrid(!tableView.getTableConfig().isShowGrid());
		tableView.reRenderTitleAndGenericSettings(false);
	}.bind(this));
	shower = showSection.addNewLeaf();
	shower.setText("Column/Row Headers");
	shower.setName(oFF.AuGdsQdInteractiveTableContextActionsHelper.COORDINATE_HEADER_MENU);
	shower.setStatusSupplier( function(){
		return oFF.XBooleanValue.create(tableView.getTableConfig().isShowCoordinateHeader());
	}.bind(this));
	shower.setCommand( function(){
		tableView.getTableConfig().setShowCoordinateHeader(!tableView.getTableConfig().isShowCoordinateHeader());
		tableView.reRenderTitleAndGenericSettings(false);
	}.bind(this));
	shower = showSection.addNewLeaf();
	shower.setText("Freeze Lines");
	shower.setName(oFF.AuGdsQdInteractiveTableContextActionsHelper.FREEZE_LINES_MENU);
	shower.setStatusSupplier( function(){
		return oFF.XBooleanValue.create(tableView.getTableConfig().isShowFreezeLines());
	}.bind(this));
	shower.setCommand( function(){
		tableView.getTableConfig().setShowFreezeLines(!tableView.getTableConfig().isShowFreezeLines());
		tableView.reRenderTitleAndGenericSettings(false);
	}.bind(this));
	showSection = showGroup.addNewGroup();
	shower = showSection.addNewLeaf();
	shower.setText("Table Title");
	shower.setName(oFF.AuGdsQdInteractiveTableContextActionsHelper.SHOW_TABLE_TITLE_MENU);
	shower.setStatusSupplier( function(){
		return oFF.XBooleanValue.create(tableView.getTableConfig().isShowTableTitle());
	}.bind(this));
	shower.setCommand( function(){
		tableView.getTableConfig().setShowTableTitle(!tableView.getTableConfig().isShowTableTitle());
		tableView.reRenderTitleAndGenericSettings(false);
	}.bind(this));
	shower = showSection.addNewLeaf();
	shower.setText("Table Details");
	shower.setName(oFF.AuGdsQdInteractiveTableContextActionsHelper.SHOW_TABLE_DETAILS_MENU);
	shower.setStatusSupplier( function(){
		return oFF.XBooleanValue.create(tableView.getTableConfig().isShowTableDetails());
	}.bind(this));
	shower.setCommand( function(){
		tableView.getTableConfig().setShowTableDetails(!tableView.getTableConfig().isShowTableDetails());
		tableView.reRenderTitleAndGenericSettings(false);
	}.bind(this));
	showSection = showGroup.addNewGroup();
	shower = showSection.addNewLeaf();
	shower.setText("Dimension Headers");
	shower.setName(oFF.AuGdsQdInteractiveTableContextActionsHelper.DIMENSION_TITLES_MENU);
	shower.setStatusSupplier( function(){
		return oFF.XBooleanValue.create(tableView.getTableConfig().isShowDimensionTitles());
	}.bind(this));
	shower.setCommand( function(){
		tableView.getTableConfig().setShowDimensionTitles(!tableView.getTableConfig().isShowDimensionTitles());
		tableView.reFormatTableHeaders();
	}.bind(this));
	shower = showSection.addNewLeaf();
	shower.setText("Highlight Headers");
	shower.setName(oFF.AuGdsQdInteractiveTableContextActionsHelper.COLORATE_DIMENSION_TITLES_MENU);
	shower.setStatusSupplier( function(){
		return oFF.XBooleanValue.create(tableView.getTableConfig().isColorateDimensionTitles());
	}.bind(this));
	shower.setCommand( function(){
		tableView.getTableConfig().setColorateDimensionTitles(!tableView.getTableConfig().isColorateDimensionTitles());
		tableView.reFormatTableHeaders();
	}.bind(this));
	shower = showSection.addNewLeaf();
	shower.setText("Highlight Totals");
	shower.setName(oFF.AuGdsQdInteractiveTableContextActionsHelper.COLORATE_TOTALS_MENU);
	shower.setStatusSupplier( function(){
		return oFF.XBooleanValue.create(tableView.getTableConfig().isColorateTotals());
	}.bind(this));
	shower.setCommand( function(){
		tableView.getTableConfig().setColorateTotals(!tableView.getTableConfig().isColorateTotals());
		tableView.reRenderTotalFormatting();
	}.bind(this));
	shower = showSection.addNewLeaf();
	shower.setText("Repetitive Member Names");
	shower.setName(oFF.AuGdsQdInteractiveTableContextActionsHelper.REPETITIVE_MEMBER_NAMES_MENU);
	shower.setStatusSupplier( function(){
		return oFF.XBooleanValue.create(tableView.getTableConfig().isRepetitiveMemberNames());
	}.bind(this));
	shower.setCommand( function(){
		tableView.getTableConfig().setRepetitiveMemberNames(!tableView.getTableConfig().isRepetitiveMemberNames());
		tableView.reFormatTableHeaders();
	}.bind(this));
};
oFF.AuGdsQdInteractiveTableContextActionsHelper.createThemeMenu = function(tableView, themeGroup)
{
	var themer = themeGroup.addNewLeaf();
	themer.setText("Sac Style");
	themer.setName(oFF.AuGdsQdInteractiveTableContextActionsHelper.SAC_STYLE_MENU);
	themer.setCommand( function(){
		tableView.getTableConfig().setSacStyle();
		tableView.reFormatTableHeaders();
	}.bind(this));
	themer = themeGroup.addNewLeaf();
	themer.setText("Spreadsheet Style");
	themer.setName(oFF.AuGdsQdInteractiveTableContextActionsHelper.SPREADSHEET_STYLE_MENU);
	themer.setCommand( function(){
		tableView.getTableConfig().setSpreadsheetStyle();
		tableView.reFormatTableHeaders();
	}.bind(this));
	themer = themeGroup.addNewLeaf();
	themer.setText("Finance Style");
	themer.setName(oFF.AuGdsQdInteractiveTableContextActionsHelper.AUDITORS_STYLE_MENU);
	themer.setCommand( function(){
		tableView.getTableConfig().setFinanceStyle();
		tableView.reFormatTableHeaders();
	}.bind(this));
};
oFF.AuGdsQdInteractiveTableContextActionsHelper.openLayoutDialog = function(application, queryModel, updateCommand)
{
	var aldOceanEntryPoint = oFF.AldEntryPoint.createEntryPoint(application);
	aldOceanEntryPoint.openAldDialog("Axis Layout", queryModel, oFF.AuGdsLambdaDialogCloseListener.create(updateCommand, null));
};
oFF.AuGdsQdInteractiveTableContextActionsHelper.openFilterDialog = function(application, context, dimension, updateCommand)
{
	var entryPoint = oFF.FdEntryPoint.createEntryPoint(application, oFF.XStringUtils.concatenate3(dimension.getName(), "/", dimension.getText()));
	entryPoint.getConfiguration().setSelectionMode(oFF.UiSelectionMode.MULTI_SELECT);
	entryPoint.getConfiguration().setDetermineSelectionFromContext(true);
	var evaluationCommand =  function(selection){
		if (oFF.XCollectionUtils.hasElements(selection))
		{
			var cartesianList = context.getQueryModel().getFilter().getDynamicFilter().getCartesianProductWithDefault().getCartesianListWithDefault(dimension);
			for (var i = 0; i < selection.size(); i++)
			{
				var item = selection.get(i);
				var member = item.getNode().getDimensionMember();
				var cartesianElement = cartesianList.addNewCartesianElement();
				cartesianElement.setComparisonOperator(oFF.ComparisonOperator.EQUAL);
				cartesianElement.getLow().addSupplementValue(dimension.getDisplayKeyField().getName(), item.getDisplayKey());
				cartesianElement.getLow().addSupplementValue(dimension.getTextField().getName(), item.getText());
				cartesianElement.getLow().setDimensionMember(member);
			}
		}
		updateCommand();
	}.bind(this);
	entryPoint.openWithDimension(dimension, oFF.AuGdsLambdaFdCloseListener.create(evaluationCommand, null));
};
oFF.AuGdsQdInteractiveTableContextActionsHelper.openCurrencyDialog = function(application, queryModel, updateCommand)
{
	var qccEntryPoint = oFF.CtEntryPoint.createEntryPoint(application);
	qccEntryPoint.openQCTDialog("Currency Conversion", queryModel.getCurrencyTranslationManager(), oFF.AuGdsLambdaDialogCloseListener.create(updateCommand, null));
};
oFF.AuGdsQdInteractiveTableContextActionsHelper.filterOnSelection = function(context, tupleElements)
{
	var dimension = tupleElements.get(0).getDimension();
	var cartesianList = context.getQueryModel().getFilter().getDynamicFilter().getCartesianProductWithDefault().getCartesianListWithDefault(dimension);
	cartesianList.clear();
	for (var i = 0; i < tupleElements.size(); i++)
	{
		var element = tupleElements.get(i);
		var member = element.getDimensionMember();
		if (!member.getMemberType().isTypeOf(oFF.OlapComponentType.TOTALS) && !member.getMemberType().isTypeOf(oFF.MemberType.RESULT))
		{
			var cartesianElement = cartesianList.addNewCartesianElement();
			cartesianElement.setComparisonOperator(oFF.ComparisonOperator.EQUAL);
			var textField = dimension.getTextField();
			var displayKeyField = dimension.getDisplayKeyField();
			var fieldValue;
			if (oFF.notNull(textField))
			{
				fieldValue = member.getFieldValue(textField);
				if (oFF.notNull(fieldValue) && fieldValue.hasValue())
				{
					cartesianElement.getLow().addSupplementValue(textField.getName(), fieldValue.getValue().getStringRepresentation());
				}
			}
			if (oFF.notNull(displayKeyField))
			{
				fieldValue = member.getFieldValue(displayKeyField);
				if (oFF.notNull(fieldValue) && fieldValue.hasValue())
				{
					cartesianElement.getLow().addSupplementValue(displayKeyField.getName(), fieldValue.getValue().getStringRepresentation());
				}
			}
			cartesianElement.getLow().setDimensionMember(member);
		}
	}
};
oFF.AuGdsQdInteractiveTableContextActionsHelper.applyDrillToElements = function(elements, drillState)
{
	for (var i = 0; i < elements.size(); i++)
	{
		elements.get(i).setNextDrillState(drillState);
	}
};
oFF.AuGdsQdInteractiveTableContextActionsHelper.moveToAxis = function(context, dimensions, axisType)
{
	var cmd = context.getQueryManager().getConvenienceCommands();
	for (var i = 0; i < dimensions.size(); i++)
	{
		cmd.moveDimensionToAxis(dimensions.get(i).getName(), axisType);
	}
};
oFF.AuGdsQdInteractiveTableContextActionsHelper.moveStructureMember = function(context, structureMember, offset)
{
	var dimension = structureMember.getDimension();
	var structureLayout = oFF.XListOfNameObject.create();
	structureLayout.addAll(dimension.getStructureLayout());
	var index = structureLayout.getIndex(structureMember);
	structureLayout.removeAt(index);
	structureLayout.insert(index + offset, structureMember);
	dimension.setStructuredLayout(structureLayout);
	if (context.getQueryManager().getSystemType().isTypeOf(oFF.SystemType.BW))
	{
		var dimensionSorting = context.getQueryModel().getSortingManager().getDimensionSorting(dimension, true);
		dimensionSorting.setSortByKey();
		dimensionSorting.setDirection(oFF.XSortDirection.ASCENDING);
		dimensionSorting.setCustomSort(oFF.XStream.of(structureLayout).collect(oFF.XStreamCollector.toListOfString( function(input){
			return input.getName();
		}.bind(this))));
	}
	else
	{
		context.getQueryModel().getSortingManager().removeDimensionSorting(dimension);
	}
};
oFF.AuGdsQdInteractiveTableContextActionsHelper.moveFields = function(dimension, fieldList, offset)
{
	var resultSetFields = dimension.getResultSetFields();
	var index = 0;
	var i;
	for (i = fieldList.size() - 1; i >= 0; i--)
	{
		var field = fieldList.get(i);
		index = resultSetFields.getIndex(field);
		resultSetFields.removeAt(index);
	}
	for (i = 0; i < fieldList.size(); i++)
	{
		resultSetFields.insert(index + offset + i, fieldList.get(i));
	}
};
oFF.AuGdsQdInteractiveTableContextActionsHelper.moveAttributes = function(dimension, attributeList, offset)
{
	var resultSetAttributes = dimension.getResultSetAttributes();
	var index = 0;
	var i;
	for (i = attributeList.size() - 1; i >= 0; i--)
	{
		var attribute = attributeList.get(i);
		index = resultSetAttributes.getIndex(attribute);
		resultSetAttributes.removeAt(index);
	}
	for (i = 0; i < attributeList.size(); i++)
	{
		resultSetAttributes.insert(index + offset + i, attributeList.get(i));
	}
};
oFF.AuGdsQdInteractiveTableContextActionsHelper.moveDimensions = function(dimensionList, offset)
{
	var axis = dimensionList.get(0).getAxis();
	var dimension;
	var index = 0;
	var i;
	for (i = dimensionList.size() - 1; i >= 0; i--)
	{
		dimension = dimensionList.get(i);
		index = axis.getIndex(dimension);
		axis.removeAt(index);
	}
	for (i = 0; i < dimensionList.size(); i++)
	{
		axis.insert(index + offset + i, dimensionList.get(i));
	}
};
oFF.AuGdsQdInteractiveTableContextActionsHelper.sortInDirection = function(context, direction, field, sortPath, measure)
{
	var caps = context.getModelCapabilities();
	if (oFF.notNull(sortPath) && caps.supportsDataCellSorting())
	{
		var datacellSorting = context.getQueryModel().getSortingManager().getDataCellSorting(sortPath, true);
		datacellSorting.setDirection(direction);
	}
	else if (oFF.notNull(measure) && caps.supportsMeasureSorting())
	{
		var measureSorting = context.getQueryModel().getSortingManager().getMeasureSorting(measure, true);
		measureSorting.setDirection(direction);
	}
	else if (oFF.notNull(field))
	{
		var dimension = field.getDimension();
		var presentationType = field.getPresentationType();
		var dimSortType = oFF.AuGdsQdInteractiveTableContextActionsHelper.resolveDimensionSortType(field);
		if (caps.supportsFieldSorting(field))
		{
			context.getQueryManager().getConvenienceCommands().sort(oFF.SortType.FIELD, dimension.getDimensionType(), dimension.getName(), presentationType, field.getName(), null, direction);
		}
		else if (oFF.notNull(dimSortType) && caps.supportsDimensionSorting(dimension, dimSortType))
		{
			context.getQueryManager().getConvenienceCommands().sort(dimSortType, dimension.getDimensionType(), dimension.getName(), presentationType, null, null, direction);
		}
	}
};
oFF.AuGdsQdInteractiveTableContextActionsHelper.getSortDirection = function(context, field, sortPath, measure)
{
	var caps = context.getModelCapabilities();
	var direction = oFF.XSortDirection.DEFAULT_VALUE;
	if (oFF.notNull(sortPath) && caps.supportsDataCellSorting())
	{
		var datacellSorting = context.getQueryModel().getSortingManager().getDataCellSorting(sortPath, false);
		if (oFF.notNull(datacellSorting))
		{
			direction = datacellSorting.getDirection();
		}
	}
	else if (oFF.notNull(measure) && caps.supportsMeasureSorting())
	{
		var measureSorting = context.getQueryModel().getSortingManager().getMeasureSorting(measure, false);
		if (oFF.notNull(measureSorting))
		{
			direction = measureSorting.getDirection();
		}
	}
	else if (oFF.notNull(field))
	{
		var dimension = field.getDimension();
		var dimSortType = oFF.AuGdsQdInteractiveTableContextActionsHelper.resolveDimensionSortType(field);
		if (caps.supportsFieldSorting(field))
		{
			var fieldSorting = context.getQueryModel().getSortingManager().getFieldSorting(field, false);
			if (oFF.notNull(fieldSorting))
			{
				direction = fieldSorting.getDirection();
			}
		}
		if (direction === oFF.XSortDirection.DEFAULT_VALUE && caps.supportsDimensionSorting(dimension, dimSortType))
		{
			var dimensionSorting = context.getQueryModel().getSortingManager().getDimensionSorting(dimension, false);
			if (oFF.notNull(dimensionSorting) && dimensionSorting.getSortingType() === dimSortType)
			{
				direction = dimensionSorting.getDirection();
			}
		}
	}
	return direction;
};
oFF.AuGdsQdInteractiveTableContextActionsHelper.clearFilter = function(context, dimension)
{
	context.getQueryModel().getFilter().getDynamicFilter().getCartesianProductWithDefault().removeByDimensionName(dimension.getName());
};
oFF.AuGdsQdInteractiveTableContextActionsHelper.openDataCellDialogForMember = function(application, qmContext, measureMember, secondaryMember, updateProcedure)
{
	var displayManager = oFF.OlapUiDisplayFactory.createFactoryForDialog(application.getProcess().getUiManager());
	var context = oFF.OlapUiContext.createContext(application.getProcess().getUiManager(), displayManager);
	var ddController = oFF.DataCellController.create(context);
	var aldcl = oFF.AuGdsLambdaDialogCloseListener.create(updateProcedure,  function(){
		ddController.close();
	}.bind(this));
	if (oFF.isNull(secondaryMember))
	{
		ddController.openDataCellPropertiesDialog(aldcl, qmContext.getQueryManager(), measureMember.getName(), null, false);
	}
	else
	{
		ddController.openDataCellPropertiesDialog(aldcl, qmContext.getQueryManager(), measureMember.getName(), secondaryMember.getName(), true);
	}
};
oFF.AuGdsQdInteractiveTableContextActionsHelper.resolveDimensionSortType = function(field)
{
	var dimension = field.getDimension();
	if (field === dimension.getKeyField())
	{
		return oFF.SortType.MEMBER_KEY;
	}
	if (field === dimension.getTextField())
	{
		return oFF.SortType.MEMBER_TEXT;
	}
	if (dimension.getMainAttribute() !== null && dimension.getMainAttribute().getFields().contains(field))
	{
		var pt = field.getPresentationType();
		if (pt.isTypeOf(oFF.PresentationType.ABSTRACT_TEXT))
		{
			return oFF.SortType.MEMBER_TEXT;
		}
		if (pt.isTypeOf(oFF.PresentationType.ABSTRACT_KEY))
		{
			return oFF.SortType.MEMBER_KEY;
		}
	}
	return null;
};
oFF.AuGdsQdInteractiveTableContextActionsHelper.hasFilterOnDimension = function(context, dimension)
{
	var cartesianProduct = context.getQueryModel().getFilter().getDynamicFilter().getCartesianProduct();
	return oFF.notNull(cartesianProduct) && oFF.XCollectionUtils.hasElements(cartesianProduct.getCartesianList(dimension));
};
oFF.AuGdsQdInteractiveTableContextActionsHelper.mapReadMode = function(mrm)
{
	if (mrm === oFF.QMemberReadMode.BOOKED)
	{
		return "Booked";
	}
	if (mrm === oFF.QMemberReadMode.BOOKED_AND_SPACE)
	{
		return "Booked and Space";
	}
	if (mrm === oFF.QMemberReadMode.BOOKED_AND_SPACE_AND_STATE)
	{
		return "Booked and Space and State";
	}
	if (mrm === oFF.QMemberReadMode.MASTER)
	{
		return "Master";
	}
	if (mrm === oFF.QMemberReadMode.MASTER_AND_SPACE)
	{
		return "Master and Space";
	}
	if (mrm === oFF.QMemberReadMode.MASTER_AND_SPACE_AND_STATE)
	{
		return "Master and Space and State";
	}
	if (mrm === oFF.QMemberReadMode.UNDEFINED)
	{
		return "Undefined";
	}
	if (mrm === oFF.QMemberReadMode.REL_BOOKED)
	{
		return "Rel Booked";
	}
	if (mrm === oFF.QMemberReadMode.REL_BOOKED_AND_SPACE)
	{
		return "Rel Booked and Space";
	}
	if (mrm === oFF.QMemberReadMode.REL_BOOKED_AND_SPACE_AND_STATE)
	{
		return "Rel Booked and Space and State";
	}
	if (mrm === oFF.QMemberReadMode.REL_MASTER)
	{
		return "Rel Master";
	}
	if (mrm === oFF.QMemberReadMode.REL_MASTER_AND_SPACE)
	{
		return "Rel Master and Space";
	}
	if (mrm === oFF.QMemberReadMode.REL_MASTER_AND_SPACE_AND_STATE)
	{
		return "Rel Master and Space and State";
	}
	return "";
};
oFF.AuGdsQdInteractiveTableContextActionsHelper.mapZeroSuppressionType = function(zst)
{
	if (zst === oFF.ZeroSuppressionType.ALL_CELLS_ARE_NULL)
	{
		return "All Cells are Null";
	}
	if (zst === oFF.ZeroSuppressionType.ALL_CELLS_ARE_ZERO)
	{
		return "All Cells are Zero";
	}
	if (zst === oFF.ZeroSuppressionType.TOTAL_IS_ZERO)
	{
		return "Total is Zero";
	}
	if (zst === oFF.ZeroSuppressionType.NONE)
	{
		return "None";
	}
	return "";
};
oFF.AuGdsQdInteractiveTableContextActionsHelper.mapResultStructureElement = function(rse)
{
	if (rse === oFF.ResultStructureElement.MEMBERS)
	{
		return "Members";
	}
	if (rse === oFF.ResultStructureElement.TOTAL)
	{
		return "Total";
	}
	if (rse === oFF.ResultStructureElement.TOTAL_INCLUDED_MEMBERS)
	{
		return "Total Included Members";
	}
	if (rse === oFF.ResultStructureElement.TOTAL_REMAINING_MEMBERS)
	{
		return "Total Remaining Members";
	}
	return "";
};
oFF.AuGdsQdInteractiveTableContextActionsHelper.mapPresentationType = function(pt)
{
	if (pt === oFF.PresentationType.VALUE)
	{
		return "Value";
	}
	if (pt === oFF.PresentationType.ABSTRACT_KEY)
	{
		return "Abstract Key";
	}
	if (pt === oFF.PresentationType.ABSTRACT_TEXT)
	{
		return "Abstract Text";
	}
	if (pt === oFF.PresentationType.ACTIVE_DISPLAY_KEY)
	{
		return "Active Display Key";
	}
	if (pt === oFF.PresentationType.ACTIVE_KEY)
	{
		return "Active Key";
	}
	if (pt === oFF.PresentationType.ACTIVE_TEXT)
	{
		return "Active Text";
	}
	if (pt === oFF.PresentationType.BLOB)
	{
		return "Blob";
	}
	if (pt === oFF.PresentationType.BUSINESS_OBJECT_NODE_IDENTIFIER)
	{
		return "Business Object Node Identifier";
	}
	if (pt === oFF.PresentationType.DEFAULT_CONTENT)
	{
		return "Default Content";
	}
	if (pt === oFF.PresentationType.DISPLAY_KEY)
	{
		return "Display Key";
	}
	if (pt === oFF.PresentationType.DISPLAY_KEY_MIXED_COMPOUNDMENT)
	{
		return "Display Key Mixed Compoundment";
	}
	if (pt === oFF.PresentationType.DISPLAY_KEY_NOT_COMPOUND)
	{
		return "Display Key Not Compound";
	}
	if (pt === oFF.PresentationType.DOCUMENT_LINK)
	{
		return "Document Link";
	}
	if (pt === oFF.PresentationType.HIERARCHY_DISPLAY_KEY)
	{
		return "Hierarchy Display Key";
	}
	if (pt === oFF.PresentationType.HIERARCHY_KEY)
	{
		return "Hierarchy Key";
	}
	if (pt === oFF.PresentationType.HIERARCHY_PATH)
	{
		return "Hierarchy Path";
	}
	if (pt === oFF.PresentationType.HIERARCHY_TEXT)
	{
		return "Hierarchy Text";
	}
	if (pt === oFF.PresentationType.ID)
	{
		return "Id";
	}
	if (pt === oFF.PresentationType.KEY)
	{
		return "Key";
	}
	if (pt === oFF.PresentationType.KEY_NOT_COMPOUND)
	{
		return "Key Not Compound";
	}
	if (pt === oFF.PresentationType.LONG_TEXT)
	{
		return "Long Text";
	}
	if (pt === oFF.PresentationType.MEDIUM_TEXT)
	{
		return "Medium Text";
	}
	if (pt === oFF.PresentationType.SHORT_TEXT)
	{
		return "Short Text";
	}
	if (pt === oFF.PresentationType.RELATED_ACTIONS)
	{
		return "Related Actions";
	}
	if (pt === oFF.PresentationType.SELF)
	{
		return "Self";
	}
	if (pt === oFF.PresentationType.TEXT)
	{
		return "Text";
	}
	if (pt === oFF.PresentationType.UNDEFINED)
	{
		return "Undefined";
	}
	if (pt === oFF.PresentationType.URL)
	{
		return "Url";
	}
	if (pt === oFF.PresentationType.WHY_FOUND)
	{
		return "Why Found";
	}
	if (pt === oFF.PresentationType.XL_LONG_TEXT)
	{
		return "XL Long Text";
	}
	return "";
};
oFF.AuGdsQdInteractiveTableContextActionsHelper.mapDimensionType = function(dimensionType)
{
	if (dimensionType === oFF.DimensionType.MEASURE_STRUCTURE)
	{
		return "Measure Structure";
	}
	if (dimensionType === oFF.DimensionType.SECONDARY_STRUCTURE)
	{
		return "Secondary Structure";
	}
	if (dimensionType === oFF.DimensionType.ACCOUNT)
	{
		return "Account Dimension";
	}
	if (dimensionType === oFF.DimensionType.CALCULATED_DIMENSION)
	{
		return "Calculated Dimension";
	}
	return "Dimension";
};

oFF.AuGdsQdInteractiveTableView = function() {};
oFF.AuGdsQdInteractiveTableView.prototype = new oFF.XObject();
oFF.AuGdsQdInteractiveTableView.prototype._ff_c = "AuGdsQdInteractiveTableView";

oFF.AuGdsQdInteractiveTableView.ATTRIBUTE_DROPDOWN = "attributeDropdown";
oFF.AuGdsQdInteractiveTableView.ATTRIBUTE_DROPDOWN_KEY = "attributeDropdownKey";
oFF.AuGdsQdInteractiveTableView.ATTRIBUTE_DROPDOWN_TEXT = "attributeDropdownText";
oFF.AuGdsQdInteractiveTableView.ATTRIBUTE_DROPDOWN_TEXT_KEY = "attributeDropdownTextKey";
oFF.AuGdsQdInteractiveTableView.ATTRIBUTE_DROPDOWN_KEY_TEXT = "attributeDropdownKeyText";
oFF.AuGdsQdInteractiveTableView.UNDO_REDO_ACTION_ID = "undoRedoActionTrigger";
oFF.AuGdsQdInteractiveTableView.CONTEXT_MENU = "contextMenu";
oFF.AuGdsQdInteractiveTableView.create = function(application, queryManager, genesis, tableListener)
{
	var instance = new oFF.AuGdsQdInteractiveTableView();
	instance.setupInternal(application, queryManager, genesis, tableListener);
	return instance;
};
oFF.AuGdsQdInteractiveTableView.supportsTupleElementExpand = function(tupleElement)
{
	var drillState = tupleElement.getDrillState();
	var isUniversalDisplayHierarchy = tupleElement.getDimension().isUniversalDisplayHierarchyDimension();
	return drillState === oFF.DrillState.COLLAPSED && !isUniversalDisplayHierarchy || drillState === oFF.DrillState.COLLAPSED_EXPAND_AND_DRILLDOWN_ALLOWED || drillState === oFF.DrillState.LEAF_UDH_EXPAND_ALLOWED;
};
oFF.AuGdsQdInteractiveTableView.supportsTupleElementDrill = function(tupleElement)
{
	var drillState = tupleElement.getDrillState();
	var isUniversalDisplayHierarchy = tupleElement.getDimension().isUniversalDisplayHierarchyDimension();
	return drillState === oFF.DrillState.COLLAPSED_EXPAND_AND_DRILLDOWN_ALLOWED || drillState === oFF.DrillState.COLLAPSED && isUniversalDisplayHierarchy || drillState === oFF.DrillState.LEAF_DRILLDOWN_ALLOWED;
};
oFF.AuGdsQdInteractiveTableView.supportsTupleElementCollapse = function(tupleElement)
{
	var drillState = tupleElement.getDrillState();
	return drillState === oFF.DrillState.EXPANDED || drillState === oFF.DrillState.DRILLED || drillState === oFF.DrillState.DRILL_DOWN;
};
oFF.AuGdsQdInteractiveTableView.getFirstNonMainAttributeFieldIndex = function(dimension, resultSetFields)
{
	var firstNonMainAttributeIndex = 0;
	for (; firstNonMainAttributeIndex < resultSetFields.size(); firstNonMainAttributeIndex++)
	{
		var fnmaf = resultSetFields.get(firstNonMainAttributeIndex);
		if (fnmaf.getAttribute() !== dimension.getMainAttribute() || fnmaf !== dimension.getKeyField() && fnmaf !== dimension.getTextField())
		{
			break;
		}
	}
	return firstNonMainAttributeIndex;
};
oFF.AuGdsQdInteractiveTableView.prototype.m_application = null;
oFF.AuGdsQdInteractiveTableView.prototype.m_queryManager = null;
oFF.AuGdsQdInteractiveTableView.prototype.m_genesis = null;
oFF.AuGdsQdInteractiveTableView.prototype.m_listener = null;
oFF.AuGdsQdInteractiveTableView.prototype.m_sacTable = null;
oFF.AuGdsQdInteractiveTableView.prototype.m_contextMenu = null;
oFF.AuGdsQdInteractiveTableView.prototype.m_rowMin = 0;
oFF.AuGdsQdInteractiveTableView.prototype.m_rowMax = 0;
oFF.AuGdsQdInteractiveTableView.prototype.m_columnMin = 0;
oFF.AuGdsQdInteractiveTableView.prototype.m_columnMax = 0;
oFF.AuGdsQdInteractiveTableView.prototype.m_columnsWindowSize = 0;
oFF.AuGdsQdInteractiveTableView.prototype.m_rowsWindowSize = 0;
oFF.AuGdsQdInteractiveTableView.prototype.m_maxRowsWindowSize = 0;
oFF.AuGdsQdInteractiveTableView.prototype.m_tableConfig = null;
oFF.AuGdsQdInteractiveTableView.prototype.m_selectedMeasure = null;
oFF.AuGdsQdInteractiveTableView.prototype.m_onHeaderRows = false;
oFF.AuGdsQdInteractiveTableView.prototype.m_onHeaderColumns = false;
oFF.AuGdsQdInteractiveTableView.prototype.m_onDataRows = false;
oFF.AuGdsQdInteractiveTableView.prototype.m_onDataColumns = false;
oFF.AuGdsQdInteractiveTableView.prototype.m_onEmptyHeaderSection = false;
oFF.AuGdsQdInteractiveTableView.prototype.m_isMultiSelectWithGaps = false;
oFF.AuGdsQdInteractiveTableView.prototype.m_rowDimensionsLastSelected = null;
oFF.AuGdsQdInteractiveTableView.prototype.m_columnDimensionsLastSelected = null;
oFF.AuGdsQdInteractiveTableView.prototype.m_rowDimensionsAllSelected = null;
oFF.AuGdsQdInteractiveTableView.prototype.m_columnDimensionsAllSelected = null;
oFF.AuGdsQdInteractiveTableView.prototype.m_rowTuplesLastSelected = null;
oFF.AuGdsQdInteractiveTableView.prototype.m_columnTuplesLastSelected = null;
oFF.AuGdsQdInteractiveTableView.prototype.m_rowTuplesAllSelected = null;
oFF.AuGdsQdInteractiveTableView.prototype.m_columnTuplesAllSelected = null;
oFF.AuGdsQdInteractiveTableView.prototype.m_columnFieldNamesLastSelected = null;
oFF.AuGdsQdInteractiveTableView.prototype.m_rowFieldNamesLastSelected = null;
oFF.AuGdsQdInteractiveTableView.prototype.m_rowTupleElementsLastSelected = null;
oFF.AuGdsQdInteractiveTableView.prototype.m_columnTupleElementsLastSelected = null;
oFF.AuGdsQdInteractiveTableView.prototype.m_rowTupleElementsAllSelected = null;
oFF.AuGdsQdInteractiveTableView.prototype.m_columnTupleElementsAllSelected = null;
oFF.AuGdsQdInteractiveTableView.prototype.m_selectedColumnTupleFieldName = null;
oFF.AuGdsQdInteractiveTableView.prototype.m_selectedRowTupleFieldName = null;
oFF.AuGdsQdInteractiveTableView.prototype.m_selectedSecondaryStructureMember = null;
oFF.AuGdsQdInteractiveTableView.prototype.m_numberOfSelectedCells = 0;
oFF.AuGdsQdInteractiveTableView.prototype.m_updatesPaused = false;
oFF.AuGdsQdInteractiveTableView.prototype.m_pendingUpdates = false;
oFF.AuGdsQdInteractiveTableView.prototype.m_resolver = null;
oFF.AuGdsQdInteractiveTableView.prototype.m_renderer = null;
oFF.AuGdsQdInteractiveTableView.prototype.m_columnsCountTotal = 0;
oFF.AuGdsQdInteractiveTableView.prototype.m_rowsCountTotal = 0;
oFF.AuGdsQdInteractiveTableView.prototype.m_columnsCountLoaded = 0;
oFF.AuGdsQdInteractiveTableView.prototype.m_rowsCountLoaded = 0;
oFF.AuGdsQdInteractiveTableView.prototype.m_activeSynchronizer = null;
oFF.AuGdsQdInteractiveTableView.prototype.m_pendingTableUpdates = null;
oFF.AuGdsQdInteractiveTableView.prototype.m_pendingScrolls = null;
oFF.AuGdsQdInteractiveTableView.prototype.m_rescheduled = false;
oFF.AuGdsQdInteractiveTableView.prototype.m_scrollWindowMax = 0;
oFF.AuGdsQdInteractiveTableView.prototype.m_pendingFullTableReRendering = false;
oFF.AuGdsQdInteractiveTableView.prototype.m_pendingTableReConfiguration = false;
oFF.AuGdsQdInteractiveTableView.prototype.m_scrollWindowMin = 0;
oFF.AuGdsQdInteractiveTableView.prototype.m_newMax = 0;
oFF.AuGdsQdInteractiveTableView.prototype.m_newMin = 0;
oFF.AuGdsQdInteractiveTableView.prototype.m_pendingScrollPoint = 0;
oFF.AuGdsQdInteractiveTableView.prototype.m_canceledUpdate = false;
oFF.AuGdsQdInteractiveTableView.prototype.m_dataRowsCountTotal = 0;
oFF.AuGdsQdInteractiveTableView.prototype.m_dataColumnsCountTotal = 0;
oFF.AuGdsQdInteractiveTableView.prototype.setupInternal = function(application, queryManager, genesis, tableListener)
{
	this.m_genesis = genesis;
	this.m_application = application;
	this.m_queryManager = queryManager;
	this.m_listener = tableListener;
	this.m_renderer = oFF.GridRendererFactory.createRenderer(oFF.ProtocolBindingType.SAC_TABLE_GRID);
	this.m_resolver = oFF.GridResolverFactory.createResolver(oFF.ProtocolBindingType.SAC_TABLE_GRID);
	this.m_sacTable = this.m_genesis.newControl(oFF.UiType.SAC_TABLE_GRID);
	this.m_sacTable.useMaxSpace();
	this.m_sacTable.registerOnContextMenu(this);
	this.m_sacTable.registerOnButtonPress(this);
	this.m_sacTable.registerOnClick(this);
	this.m_sacTable.registerOnResize(this);
	this.m_sacTable.registerOnTableDragAndDrop(this);
	this.m_sacTable.registerOnLoadFinished(this);
	this.m_sacTable.registerOnScrollLoad(this);
	this.m_contextMenu = this.m_genesis.newControl(oFF.UiType.MENU);
	this.m_contextMenu.setName(oFF.AuGdsQdInteractiveTableView.CONTEXT_MENU);
	this.m_tableConfig = oFF.AuGdsQdTableConfig.create();
	this.m_rowDimensionsAllSelected = oFF.XSetOfNameObject.create();
	this.m_columnDimensionsAllSelected = oFF.XSetOfNameObject.create();
	this.m_rowTuplesAllSelected = oFF.XList.create();
	this.m_columnTuplesAllSelected = oFF.XList.create();
	this.m_rowTupleElementsAllSelected = oFF.XList.create();
	this.m_columnTupleElementsAllSelected = oFF.XList.create();
	this.m_columnFieldNamesLastSelected = oFF.XListOfString.create();
	this.m_rowFieldNamesLastSelected = oFF.XListOfString.create();
	this.m_rowMax = -1;
	this.m_columnMax = -1;
	this.m_pendingScrollPoint = -1;
	this.m_columnsWindowSize = 30;
	this.m_rowsWindowSize = 50;
	this.m_maxRowsWindowSize = 10000;
};
oFF.AuGdsQdInteractiveTableView.prototype.registerOnSelectionChange = function(listener)
{
	this.m_sacTable.registerOnSelectionChange(listener);
};
oFF.AuGdsQdInteractiveTableView.prototype.releaseObject = function()
{
	this.m_application = null;
	this.m_queryManager = null;
	this.m_genesis = null;
	this.m_listener = null;
	this.m_sacTable = oFF.XObjectExt.release(this.m_sacTable);
	this.m_tableConfig = oFF.XObjectExt.release(this.m_tableConfig);
	oFF.XObject.prototype.releaseObject.call( this );
};
oFF.AuGdsQdInteractiveTableView.prototype.setQueryManager = function(queryManager)
{
	this.m_queryManager = queryManager;
};
oFF.AuGdsQdInteractiveTableView.prototype.getQueryManager = function()
{
	return this.m_queryManager;
};
oFF.AuGdsQdInteractiveTableView.prototype.getView = function()
{
	return this.m_sacTable;
};
oFF.AuGdsQdInteractiveTableView.prototype.getGenesis = function()
{
	return this.m_genesis;
};
oFF.AuGdsQdInteractiveTableView.prototype.clearTable = function()
{
	this.m_sacTable.setModelJson(null);
};
oFF.AuGdsQdInteractiveTableView.prototype.updateTable = function()
{
	if (oFF.notNull(this.m_sacTable) && oFF.notNull(this.m_queryManager))
	{
		if (!this.m_updatesPaused)
		{
			this.m_sacTable.setBusy(true);
			if ((this.isSyncActionProcessing() || this.hasPendingTableUpdates()) && !this.m_rescheduled)
			{
				this.rescheduleTableUpdate();
			}
			else
			{
				this.m_rescheduled = false;
				this.m_activeSynchronizer = this.m_queryManager.getActiveResultSetContainer();
				this.resetPaging();
				this.m_canceledUpdate = false;
				this.processQueryExecutionWindow(0, this.m_rowsWindowSize * 3, 0, this.m_columnsWindowSize);
			}
		}
		else
		{
			this.m_pendingUpdates = true;
		}
	}
};
oFF.AuGdsQdInteractiveTableView.prototype.resetPaging = function()
{
	this.m_scrollWindowMax = 0;
	this.m_scrollWindowMin = 0;
	var cmd = this.m_queryManager.getConvenienceCommands();
	cmd.setOffsetRows(0);
	if (this.m_rowsWindowSize > 0)
	{
		cmd.setMaxRows(this.m_rowsWindowSize * 3);
	}
};
oFF.AuGdsQdInteractiveTableView.prototype.processQueryExecutionWindow = function(startRow, sizeRow, startCol, sizeCol)
{
	var cmd = this.m_queryManager.getConvenienceCommands();
	if (sizeRow > 0)
	{
		cmd.setOffsetRows(startRow);
		cmd.setMaxRows(sizeRow);
	}
	else
	{
		this.resetPaging();
	}
	if (sizeCol > 0)
	{
		cmd.setOffsetColumns(startCol);
		cmd.setMaxColumns(sizeCol);
	}
	this.m_listener.onBackendRequestStarted();
	this.m_queryManager.processQueryExecution(oFF.SyncType.NON_BLOCKING, this, null);
};
oFF.AuGdsQdInteractiveTableView.prototype.executeUndo = function()
{
	this.m_sacTable.setBusy(true);
	this.m_activeSynchronizer = this.m_queryManager.getActiveResultSetContainer();
	this.resetPaging();
	this.m_listener.onBackendRequestStarted();
	this.m_application.getUndoManager().processUndo(oFF.SyncType.NON_BLOCKING, this, null);
};
oFF.AuGdsQdInteractiveTableView.prototype.executeRedo = function()
{
	this.m_sacTable.setBusy(true);
	this.m_activeSynchronizer = this.m_queryManager.getActiveResultSetContainer();
	this.resetPaging();
	this.m_listener.onBackendRequestStarted();
	this.m_application.getUndoManager().processRedo(oFF.SyncType.NON_BLOCKING, this, null);
};
oFF.AuGdsQdInteractiveTableView.prototype.setTitle = function(title)
{
	this.m_tableConfig.setTitle(title);
	this.reRenderTitleAndGenericSettings(false);
};
oFF.AuGdsQdInteractiveTableView.prototype.getTitle = function()
{
	return this.m_tableConfig.getTitle();
};
oFF.AuGdsQdInteractiveTableView.prototype.getTableConfigAsStructure = function()
{
	if (oFF.notNull(this.m_tableConfig))
	{
		return this.m_tableConfig.serializeToStructure();
	}
	return null;
};
oFF.AuGdsQdInteractiveTableView.prototype.setTableConfigFromStructure = function(tableCfgJson)
{
	if (oFF.isNull(this.m_tableConfig))
	{
		this.m_tableConfig = oFF.AuGdsQdTableConfig.create();
	}
	this.m_tableConfig.deserializeFromStructre(tableCfgJson);
};
oFF.AuGdsQdInteractiveTableView.prototype.getNumberOfSelectedCells = function()
{
	return this.m_numberOfSelectedCells;
};
oFF.AuGdsQdInteractiveTableView.prototype.reFormatTableHeaders = function()
{
	if (!this.hasPendingTableUpdates() && oFF.isNull(this.m_pendingScrolls))
	{
		var nullListener = null;
		this.m_sacTable.setBusy(true);
		var renderAction = oFF.AuGdsLambdaSyncAction.create(this.getApplication().getSession(), nullListener,  function(){
			var modelJson = null;
			this.m_renderer.setGridConfigration(this.m_tableConfig.serializeToStructure());
			if (!this.hasPendingTableUpdates() && oFF.isNull(this.m_pendingScrolls))
			{
				modelJson = this.m_renderer.reFormatHeaders();
				if (!this.hasPendingTableUpdates() && oFF.isNull(this.m_pendingScrolls))
				{
					this.m_resolver.updateModel(null, modelJson.asStructure(), this.m_renderer.getFullRowList());
					this.m_activeSynchronizer = null;
					this.m_sacTable.setModelJson(modelJson);
				}
			}
			return modelJson;
		}.bind(this), 10);
		this.m_activeSynchronizer = renderAction;
		renderAction.attachListener(oFF.AuGdsLambdaSyncListener.create( function(messages, data){
			this.checkPendingReRendering();
			return oFF.XBooleanValue.create(true);
		}.bind(this)), oFF.ListenerType.SYNC_LISTENER, null);
		renderAction.processSyncAction(oFF.SyncType.NON_BLOCKING, null, null);
	}
};
oFF.AuGdsQdInteractiveTableView.prototype.reRenderTable = function(resultSet, resultSetContainer)
{
	this.m_tableConfig.setWidth(this.m_sacTable.getOffsetWidth());
	this.m_tableConfig.setHeight(this.m_sacTable.getOffsetHeight());
	this.m_sacTable.setBusy(true);
	var nullListener = null;
	var renderAction = oFF.AuGdsLambdaSyncAction.create(this.getApplication().getSession(), nullListener,  function(){
		this.m_renderer.setGridConfigration(this.m_tableConfig.serializeToStructure());
		var offsetRows = this.m_queryManager.getConvenienceCommands().getOffsetRows();
		var modelJson = null;
		var hasData = true;
		if (offsetRows === 0)
		{
			hasData = this.m_renderer.preRender(resultSet);
		}
		if (!this.hasPendingTableUpdates())
		{
			if (hasData)
			{
				modelJson = this.m_renderer.renderOffset(resultSet, offsetRows, offsetRows > 0);
			}
			if (!this.hasPendingTableUpdates())
			{
				this.m_resolver.updateModel(resultSetContainer.getClassicResultSet(), modelJson, this.m_renderer.getFullRowList());
				this.m_columnsCountTotal = this.m_renderer.getColumnsTotalCount();
				this.m_columnsCountLoaded = this.m_renderer.getColumnsLoadedCount();
				this.m_rowsCountTotal = this.m_renderer.getRowsTotalCount();
				this.m_dataRowsCountTotal = this.m_renderer.getDataRowsTotalCount();
				this.m_dataColumnsCountTotal = this.m_renderer.getDataColumnsTotalCount();
				this.m_rowsCountLoaded = this.m_renderer.getRowsLoadedCount();
				this.m_sacTable.setCustomObject(this.m_resolver);
				this.m_activeSynchronizer = null;
				this.m_sacTable.setModelJson(modelJson);
			}
			else
			{
				oFF.XLogger.println("Do not render, as table updates are pending (INNER)");
			}
		}
		else
		{
			oFF.XLogger.println("Do not render, as table updates are pending (OUTER)");
		}
		return modelJson;
	}.bind(this), 10);
	this.m_activeSynchronizer = renderAction;
	renderAction.attachListener(oFF.AuGdsLambdaSyncListener.create( function(messages, data){
		this.checkPendingReRendering();
		return oFF.XBooleanValue.create(true);
	}.bind(this)), oFF.ListenerType.SYNC_LISTENER, null);
	renderAction.processSyncAction(oFF.SyncType.NON_BLOCKING, null, null);
};
oFF.AuGdsQdInteractiveTableView.prototype.hasPendingTableUpdates = function()
{
	return oFF.notNull(this.m_pendingTableUpdates);
};
oFF.AuGdsQdInteractiveTableView.prototype.reRenderTitleAndGenericSettings = function(fullReRender)
{
	if (this.isSyncActionProcessing() || this.hasPendingTableUpdates())
	{
		if (fullReRender)
		{
			this.m_pendingFullTableReRendering = true;
		}
		else
		{
			this.m_pendingTableReConfiguration = true;
		}
	}
	else
	{
		this.m_sacTable.setBusy(true);
		this.m_tableConfig.setWidth(this.m_sacTable.getOffsetWidth());
		this.m_tableConfig.setHeight(this.m_sacTable.getOffsetHeight());
		this.m_renderer.setGridConfigration(this.m_tableConfig.serializeToStructure());
		var modelJson = this.m_renderer.reRenderTitleAndGenericSettings(fullReRender);
		this.m_sacTable.setModelJson(modelJson);
	}
};
oFF.AuGdsQdInteractiveTableView.prototype.reRenderTotalFormatting = function()
{
	if (this.isSyncActionProcessing() || this.hasPendingTableUpdates())
	{
		this.m_pendingFullTableReRendering = true;
	}
	else
	{
		this.m_renderer.setGridConfigration(this.m_tableConfig.serializeToStructure());
		this.m_sacTable.setModelJson(this.m_renderer.reRenderTotalFormatting());
	}
};
oFF.AuGdsQdInteractiveTableView.prototype.clearMenuItems = function()
{
	this.m_contextMenu.clearItems();
};
oFF.AuGdsQdInteractiveTableView.prototype.onContextMenu = function(event)
{
	this.clearMenuItems();
	if (event.getParameters().getByKey(oFF.UiControlEvent.PARAM_COLUMN) !== null && event.getParameters().getByKey(oFF.UiControlEvent.PARAM_ROW) !== null)
	{
		if (this.m_columnMin === -1 || this.m_columnMax === -1 || this.m_rowMin === -1 || this.m_rowMax === -1)
		{
			var column = event.getParameters().getIntegerByKey(oFF.UiControlEvent.PARAM_COLUMN);
			var row = event.getParameters().getIntegerByKey(oFF.UiControlEvent.PARAM_ROW);
			this.resetSelectionStructure();
			this.m_columnMin = column;
			this.m_columnMax = column;
			this.m_rowMin = row;
			this.m_rowMax = row;
			this.updateSelectionObjects();
		}
	}
	var tableContextItems = oFF.AuGdsQdInteractiveTableContextActionsHelper.getTableContextMenu(this);
	oFF.AuGdsQdContextMenuUtil.renderSubMenuItems(this.m_contextMenu, tableContextItems);
	var clickX = event.getParameters().getIntegerByKeyExt(oFF.UiControlEvent.PARAM_CLICK_X, 0);
	var clickY = event.getParameters().getIntegerByKeyExt(oFF.UiControlEvent.PARAM_CLICK_Y, 0);
	this.m_contextMenu.openAtPosition(clickX, clickY);
};
oFF.AuGdsQdInteractiveTableView.prototype.getStructureMember = function(tuple)
{
	var structureMember = null;
	if (oFF.notNull(tuple))
	{
		for (var i = 0; i < tuple.size(); i++)
		{
			var tupleElement = tuple.getTupleElementAt(i);
			var dimensionMember = tupleElement.getDimensionMember();
			structureMember = tupleElement.getDimension().getStructureMember(dimensionMember.getName());
			if (oFF.notNull(structureMember))
			{
				break;
			}
		}
	}
	return structureMember;
};
oFF.AuGdsQdInteractiveTableView.prototype.toggleUdh = function(axisType, active)
{
	if (active)
	{
		this.getQueryManager().getConvenienceCommands().setUniversalDisplayHierarchy(this.getQueryManager().getQueryModel().getAxis(axisType).getDimensionNames().createListOfStringCopy(), -1, true);
	}
	else
	{
		this.getQueryManager().getQueryModel().getUniversalDisplayHierarchies().getByAxisType(axisType).setActive(false);
	}
	this.updateTable();
};
oFF.AuGdsQdInteractiveTableView.prototype.processSelectionChangeEvent = function(event)
{
	var selectionString = event.getParameters().getStringByKey(oFF.UiControlEvent.PARAM_SELECTION_AREA);
	if (oFF.XStringUtils.isNotNullAndNotEmpty(selectionString))
	{
		var selectionElement = oFF.JsonParserFactory.createFromString(selectionString);
		if (!this.trySetupSelection(selectionElement))
		{
			this.m_columnMax = -1;
			this.m_rowMax = -1;
		}
	}
	else
	{
		this.m_columnMax = -1;
		this.m_rowMax = -1;
		this.resetSelectionStructure();
	}
};
oFF.AuGdsQdInteractiveTableView.prototype.trySetupSelection = function(selectionElement)
{
	var success = false;
	this.resetSelectionStructure();
	if (oFF.notNull(selectionElement))
	{
		if (selectionElement.isStructure())
		{
			this.analyseSelectionStructure(selectionElement.asStructure());
			success = true;
		}
		else if (selectionElement.isList())
		{
			var selectionList = selectionElement.asList();
			if (oFF.XCollectionUtils.hasElements(selectionList))
			{
				this.m_isMultiSelectWithGaps = selectionList.size() > 1;
				for (var i = 0; i < selectionList.size(); i++)
				{
					this.analyseSelectionStructure(selectionList.getStructureAt(i));
				}
				if (this.m_isMultiSelectWithGaps)
				{
					this.m_selectedMeasure = null;
					this.m_selectedSecondaryStructureMember = null;
				}
				success = true;
			}
		}
	}
	return success;
};
oFF.AuGdsQdInteractiveTableView.prototype.analyseSelectionStructure = function(selectionStructure)
{
	var startCol = selectionStructure.getIntegerByKey(oFF.SacTableConstants.CCD_N_START_COL);
	var endCol = selectionStructure.getIntegerByKey(oFF.SacTableConstants.CCD_N_END_COL);
	var startRow = selectionStructure.getIntegerByKey(oFF.SacTableConstants.CCD_N_START_ROW);
	var endRow = selectionStructure.getIntegerByKey(oFF.SacTableConstants.CCD_N_END_ROW);
	this.m_columnMin = oFF.XMath.min(startCol, endCol);
	this.m_columnMax = oFF.XMath.max(startCol, endCol);
	this.m_rowMin = oFF.XMath.min(startRow, endRow);
	this.m_rowMax = oFF.XMath.max(startRow, endRow);
	this.updateSelectionObjects();
};
oFF.AuGdsQdInteractiveTableView.prototype.updateSelectionObjects = function()
{
	if (this.m_rowMax > -1 && this.m_rowMin > -1 && this.m_columnMax > -1 && this.m_columnMin > -1)
	{
		var resolver = this.m_sacTable.getCustomObject();
		this.m_onEmptyHeaderSection = this.m_onEmptyHeaderSection && resolver.isEmptyHeaderCell(this.m_columnMax, this.m_rowMax);
		this.m_onHeaderRows = this.m_onHeaderRows || resolver.isOnHeaderRow(this.m_rowMax);
		this.m_onHeaderColumns = this.m_onHeaderColumns || resolver.isOnHeaderColumn(this.m_columnMax);
		this.m_onDataRows = this.m_onDataRows || resolver.isOnDataRow(this.m_rowMin);
		this.m_onDataColumns = this.m_onDataColumns || resolver.isOnDataColumn(this.m_columnMin);
		this.m_columnDimensionsLastSelected = resolver.getColumnDimensions(this.m_rowMin, this.m_rowMax);
		this.m_columnDimensionsAllSelected.addAll(this.m_columnDimensionsLastSelected);
		this.m_rowDimensionsLastSelected = resolver.getRowDimensions(this.m_columnMin, this.m_columnMax);
		this.m_rowDimensionsAllSelected.addAll(this.m_rowDimensionsLastSelected);
		this.m_rowTuplesLastSelected = resolver.getRowTuples(this.m_rowMin, this.m_rowMax);
		this.addAllTuplesIfNotContains(this.m_rowTuplesAllSelected, this.m_rowTuplesLastSelected);
		this.m_columnTuplesLastSelected = resolver.getColumnTuples(this.m_columnMin, this.m_columnMax);
		this.addAllTuplesIfNotContains(this.m_columnTuplesAllSelected, this.m_columnTuplesLastSelected);
		this.m_rowTupleElementsLastSelected = resolver.getRowTupleElements(this.m_columnMin, this.m_rowMin, this.m_rowMax);
		this.addAllTupleElementsIfNotContains(this.m_rowTupleElementsAllSelected, this.m_rowTupleElementsLastSelected);
		this.m_columnTupleElementsLastSelected = resolver.getColumnTupleElements(this.m_columnMin, this.m_columnMax, this.m_rowMin);
		this.addAllTupleElementsIfNotContains(this.m_columnTupleElementsAllSelected, this.m_columnTupleElementsLastSelected);
		this.m_columnFieldNamesLastSelected = resolver.getColumnTupleFieldNames(this.m_rowMin, this.m_rowMax, true);
		this.m_rowFieldNamesLastSelected = resolver.getRowTupleFieldNames(this.m_columnMin, this.m_columnMax, true);
		this.m_selectedColumnTupleFieldName = resolver.getColumnTupleFieldName(this.m_rowMax);
		this.m_selectedRowTupleFieldName = resolver.getRowTupleFieldName(this.m_columnMax);
		this.m_selectedMeasure = null;
		this.m_selectedSecondaryStructureMember = null;
		var structureMember;
		if (oFF.XCollectionUtils.hasElements(this.m_rowTuplesLastSelected) && this.m_rowTuplesLastSelected.size() === 1)
		{
			structureMember = this.getStructureMember(this.m_rowTuplesLastSelected.get(0));
			if (oFF.notNull(structureMember) && structureMember.getDimension().isMeasureStructure())
			{
				this.m_selectedMeasure = structureMember;
			}
			else
			{
				this.m_selectedSecondaryStructureMember = structureMember;
			}
		}
		if (oFF.XCollectionUtils.hasElements(this.m_columnTuplesLastSelected) && this.m_columnTuplesLastSelected.size() === 1)
		{
			structureMember = this.getStructureMember(this.m_columnTuplesLastSelected.get(0));
			if (oFF.notNull(structureMember) && structureMember.getDimension().isMeasureStructure())
			{
				this.m_selectedMeasure = structureMember;
			}
			else
			{
				this.m_selectedSecondaryStructureMember = structureMember;
			}
		}
		this.m_numberOfSelectedCells = (this.m_rowMax + 1 - this.m_rowMin) * (this.m_columnMax + 1 - this.m_columnMin) + this.m_numberOfSelectedCells;
	}
};
oFF.AuGdsQdInteractiveTableView.prototype.addAllTupleElementsIfNotContains = function(receivingCollection, toAdd)
{
	if (oFF.XCollectionUtils.hasElements(toAdd))
	{
		for (var i = 0; i < toAdd.size(); i++)
		{
			var element = toAdd.get(i);
			if (!receivingCollection.contains(element))
			{
				receivingCollection.add(element);
			}
		}
	}
};
oFF.AuGdsQdInteractiveTableView.prototype.addAllTuplesIfNotContains = function(receivingCollection, toAdd)
{
	if (oFF.XCollectionUtils.hasElements(toAdd))
	{
		for (var i = 0; i < toAdd.size(); i++)
		{
			var element = toAdd.get(i);
			if (!receivingCollection.contains(element))
			{
				receivingCollection.add(element);
			}
		}
	}
};
oFF.AuGdsQdInteractiveTableView.prototype.resetSelectionStructure = function()
{
	this.m_onHeaderRows = false;
	this.m_onHeaderColumns = false;
	this.m_onDataRows = false;
	this.m_onDataColumns = false;
	this.m_isMultiSelectWithGaps = false;
	this.m_onEmptyHeaderSection = true;
	this.m_selectedRowTupleFieldName = null;
	this.m_selectedColumnTupleFieldName = null;
	this.m_selectedMeasure = null;
	this.m_selectedSecondaryStructureMember = null;
	this.m_columnDimensionsAllSelected.clear();
	this.m_rowDimensionsAllSelected.clear();
	this.m_columnTuplesAllSelected.clear();
	this.m_rowTuplesAllSelected.clear();
	this.m_columnTupleElementsAllSelected.clear();
	this.m_rowTupleElementsAllSelected.clear();
	this.m_columnDimensionsLastSelected = null;
	this.m_rowDimensionsLastSelected = null;
	this.m_columnTuplesLastSelected = null;
	this.m_rowTuplesLastSelected = null;
	this.m_columnTupleElementsLastSelected = null;
	this.m_rowTupleElementsLastSelected = null;
	this.m_numberOfSelectedCells = 0;
};
oFF.AuGdsQdInteractiveTableView.prototype.onClick = function(event) {};
oFF.AuGdsQdInteractiveTableView.prototype.onButtonPress = function(event)
{
	var parameters = event.getParameters();
	var pressedButtonType = oFF.UiPressedButtonType.lookup(parameters.getStringByKey(oFF.UiControlEvent.PARAM_PRESSED_BUTTON_TYPE));
	var column = parameters.getIntegerByKey(oFF.UiControlEvent.PARAM_COLUMN);
	var row = parameters.getIntegerByKey(oFF.UiControlEvent.PARAM_ROW);
	var resolver = event.getControl().getCustomObject();
	if (pressedButtonType === oFF.UiPressedButtonType.DRILL)
	{
		var tupleElement = resolver.getColumnTupleElement(column, row);
		if (oFF.isNull(tupleElement))
		{
			tupleElement = resolver.getRowTupleElement(column, row);
		}
		if (oFF.notNull(tupleElement))
		{
			if (oFF.AuGdsQdInteractiveTableView.supportsTupleElementCollapse(tupleElement))
			{
				tupleElement.setNextDrillState(oFF.DrillState.COLLAPSED);
			}
			else if (oFF.AuGdsQdInteractiveTableView.supportsTupleElementDrill(tupleElement))
			{
				tupleElement.setNextDrillState(oFF.DrillState.DRILLED);
			}
			else if (oFF.AuGdsQdInteractiveTableView.supportsTupleElementExpand(tupleElement))
			{
				tupleElement.setNextDrillState(oFF.DrillState.EXPANDED);
			}
		}
		this.updateTable();
	}
	else if (pressedButtonType === oFF.UiPressedButtonType.ICON)
	{
		var tuple = resolver.getRowTuple(row);
		if (oFF.isNull(tuple))
		{
			tuple = resolver.getColumnTuple(column);
		}
		var fieldName = resolver.getColumnTupleFieldName(row);
		if (oFF.isNull(fieldName))
		{
			fieldName = resolver.getRowTupleFieldName(column);
		}
		var finalSelectedMeasure = null;
		var selectedSortPath = null;
		var caps = this.m_queryManager.getModelCapabilities();
		if (oFF.notNull(tuple))
		{
			if (caps.supportsDataCellSorting())
			{
				selectedSortPath = oFF.XStream.of(tuple.getTupleElementAt(tuple.getElements().size() - 1).getDrillPath()).map( function(pathElement){
					return pathElement;
				}.bind(this)).collect(oFF.XStreamCollector.toList());
			}
			else if (caps.supportsMeasureSorting())
			{
				finalSelectedMeasure = this.getStructureMember(tuple);
				if (oFF.notNull(finalSelectedMeasure) && !finalSelectedMeasure.getDimension().isMeasureStructure())
				{
					finalSelectedMeasure = null;
				}
			}
		}
		var field = this.m_queryManager.getQueryModel().getFieldByName(fieldName);
		var sortDirection = oFF.AuGdsQdInteractiveTableContextActionsHelper.getSortDirection(this.m_queryManager, field, selectedSortPath, finalSelectedMeasure);
		var targetSortDirection = sortDirection === oFF.XSortDirection.ASCENDING ? oFF.XSortDirection.DESCENDING : oFF.XSortDirection.ASCENDING;
		oFF.AuGdsQdInteractiveTableContextActionsHelper.sortInDirection(this.m_queryManager, targetSortDirection, field, selectedSortPath, finalSelectedMeasure);
		this.updateTable();
	}
};
oFF.AuGdsQdInteractiveTableView.prototype.onQueryExecuted = function(extResult, resultSetContainer, customIdentifier)
{
	this.m_listener.onBackendRequestFinished();
	if (oFF.isNull(this.m_activeSynchronizer))
	{
		oFF.XLogger.println("Request was canceled on purpose.");
	}
	else
	{
		if (extResult.hasErrors())
		{
			this.m_activeSynchronizer = null;
			this.m_genesis.showErrorToast(extResult.getSummary());
			if (!this.m_canceledUpdate)
			{
				oFF.XLogger.println(oFF.XStringUtils.concatenate2("ext result has errors: ", extResult.getSummary()));
			}
		}
		else
		{
			if (resultSetContainer.getSyncState().isInSync() && !resultSetContainer.hasErrors())
			{
				var resultSet = resultSetContainer.getCursorResultSet();
				var state = resultSet.getState();
				if (state.hasData() && !this.hasPendingTableUpdates())
				{
					this.reRenderTable(resultSet, resultSetContainer);
				}
				else
				{
					this.m_activeSynchronizer = null;
					if (!this.m_canceledUpdate)
					{
						this.m_sacTable.setModelJson(this.m_renderer.reRenderTitleAndGenericSettings(false));
						this.m_genesis.showErrorToast(oFF.XStringUtils.concatenate2("No result was returned: ", state.getName()));
						oFF.XLogger.println(oFF.XStringUtils.concatenate2("No result was returned: ", state.getName()));
					}
				}
			}
			else
			{
				oFF.XLogger.println("Result set container is not in sync");
				this.m_activeSynchronizer = null;
				this.m_sacTable.setModelJson(this.m_renderer.reRenderTitleAndGenericSettings(false));
			}
			if (this.m_queryManager.getConvenienceCommands().getOffsetRows() === 0)
			{
				var customIdentifierStrVal = customIdentifier;
				if (oFF.isNull(customIdentifierStrVal) || !oFF.XString.isEqual(customIdentifierStrVal.getString(), oFF.AuGdsQdInteractiveTableView.UNDO_REDO_ACTION_ID))
				{
					this.m_application.getProcess().notifyInterruptStep(oFF.XInterruptStep.create(), false);
				}
				this.m_listener.onTableQMChanged();
			}
		}
	}
	this.m_canceledUpdate = false;
};
oFF.AuGdsQdInteractiveTableView.prototype.undoRedoActionFinished = function(extResult, undoSupport, customIdentifier)
{
	this.m_queryManager.getActiveResultSetContainer().processExecution(oFF.SyncType.NON_BLOCKING, this, oFF.XStringValue.create(oFF.AuGdsQdInteractiveTableView.UNDO_REDO_ACTION_ID));
};
oFF.AuGdsQdInteractiveTableView.prototype.onSelect = function(event)
{
	var control = event.getControl();
	switch (control.getName())
	{
		case oFF.AuGdsQdInteractiveTableView.ATTRIBUTE_DROPDOWN:
			var dim = control.getCustomObject();
			var cmd = this.getQueryManager().getConvenienceCommands();
			var dimName = dim.getName();
			var attName = dim.getMainAttribute().getName();
			cmd.clearAllAttributeFields(dimName, attName, oFF.QContextType.RESULT_SET);
			var keyView = dim.getKeyField() !== null ? dim.getKeyField().getPresentationType() : null;
			var textView = dim.getTextField() !== null ? dim.getTextField().getPresentationType() : null;
			switch (control.getSelectedItem().getName())
			{
				case oFF.AuGdsQdInteractiveTableView.ATTRIBUTE_DROPDOWN_KEY:
					cmd.addAttributeField(null, dimName, attName, keyView, null, oFF.QContextType.RESULT_SET);
					break;

				case oFF.AuGdsQdInteractiveTableView.ATTRIBUTE_DROPDOWN_TEXT:
					cmd.addAttributeField(null, dimName, attName, textView, null, oFF.QContextType.RESULT_SET);
					break;

				case oFF.AuGdsQdInteractiveTableView.ATTRIBUTE_DROPDOWN_KEY_TEXT:
					cmd.addAttributeField(null, dimName, attName, keyView, null, oFF.QContextType.RESULT_SET);
					cmd.addAttributeField(null, dimName, attName, textView, null, oFF.QContextType.RESULT_SET);
					break;

				case oFF.AuGdsQdInteractiveTableView.ATTRIBUTE_DROPDOWN_TEXT_KEY:
					cmd.addAttributeField(null, dimName, attName, textView, null, oFF.QContextType.RESULT_SET);
					cmd.addAttributeField(null, dimName, attName, keyView, null, oFF.QContextType.RESULT_SET);
					break;
			}
			this.updateTable();
			break;

		default:
	}
};
oFF.AuGdsQdInteractiveTableView.prototype.onResize = function(event)
{
	this.reRenderTitleAndGenericSettings(false);
};
oFF.AuGdsQdInteractiveTableView.prototype.onLoadFinished = function(event)
{
	if (!this.isSyncActionProcessing() && !this.hasPendingTableUpdates() && oFF.isNull(this.m_pendingScrolls))
	{
		if (oFF.notNull(this.m_sacTable))
		{
			this.m_sacTable.setBusy(false);
		}
		if (oFF.notNull(this.m_listener))
		{
			this.m_listener.onTableDataUpdated(this);
		}
	}
};
oFF.AuGdsQdInteractiveTableView.prototype.getTableConfig = function()
{
	return this.m_tableConfig;
};
oFF.AuGdsQdInteractiveTableView.prototype.getApplication = function()
{
	return this.m_application;
};
oFF.AuGdsQdInteractiveTableView.prototype.getSelectedMeasure = function()
{
	return this.m_selectedMeasure;
};
oFF.AuGdsQdInteractiveTableView.prototype.isOnHeaderRows = function()
{
	return this.m_onHeaderRows;
};
oFF.AuGdsQdInteractiveTableView.prototype.isOnHeaderColumns = function()
{
	return this.m_onHeaderColumns;
};
oFF.AuGdsQdInteractiveTableView.prototype.isOnDataRows = function()
{
	return this.m_onDataRows;
};
oFF.AuGdsQdInteractiveTableView.prototype.isOnDataColumns = function()
{
	return this.m_onDataColumns;
};
oFF.AuGdsQdInteractiveTableView.prototype.isIsMultiSelectWithGaps = function()
{
	return this.m_isMultiSelectWithGaps;
};
oFF.AuGdsQdInteractiveTableView.prototype.getRowDimensionsLastSelected = function()
{
	return this.m_rowDimensionsLastSelected;
};
oFF.AuGdsQdInteractiveTableView.prototype.getColumnDimensionsLastSelected = function()
{
	return this.m_columnDimensionsLastSelected;
};
oFF.AuGdsQdInteractiveTableView.prototype.getRowDimensionsAllSelected = function()
{
	return this.m_rowDimensionsAllSelected;
};
oFF.AuGdsQdInteractiveTableView.prototype.getColumnDimensionsAllSelected = function()
{
	return this.m_columnDimensionsAllSelected;
};
oFF.AuGdsQdInteractiveTableView.prototype.getRowTuplesLastSelected = function()
{
	return this.m_rowTuplesLastSelected;
};
oFF.AuGdsQdInteractiveTableView.prototype.getColumnTuplesLastSelected = function()
{
	return this.m_columnTuplesLastSelected;
};
oFF.AuGdsQdInteractiveTableView.prototype.getRowTuplesAllSelected = function()
{
	return this.m_rowTuplesAllSelected;
};
oFF.AuGdsQdInteractiveTableView.prototype.getColumnTuplesAllSelected = function()
{
	return this.m_columnTuplesAllSelected;
};
oFF.AuGdsQdInteractiveTableView.prototype.getRowTupleElementsLastSelected = function()
{
	return this.m_rowTupleElementsLastSelected;
};
oFF.AuGdsQdInteractiveTableView.prototype.getColumnTupleElementsLastSelected = function()
{
	return this.m_columnTupleElementsLastSelected;
};
oFF.AuGdsQdInteractiveTableView.prototype.getRowTupleElementsAllSelected = function()
{
	return this.m_rowTupleElementsAllSelected;
};
oFF.AuGdsQdInteractiveTableView.prototype.getColumnTupleElementsAllSelected = function()
{
	return this.m_columnTupleElementsAllSelected;
};
oFF.AuGdsQdInteractiveTableView.prototype.getSelectedColumnTupleFieldName = function()
{
	return this.m_selectedColumnTupleFieldName;
};
oFF.AuGdsQdInteractiveTableView.prototype.getSelectedRowTupleFieldName = function()
{
	return this.m_selectedRowTupleFieldName;
};
oFF.AuGdsQdInteractiveTableView.prototype.getSelectedSecondaryStructureMember = function()
{
	return this.m_selectedSecondaryStructureMember;
};
oFF.AuGdsQdInteractiveTableView.prototype.getDimensionsLastSelectedRemapped = function()
{
	var dimensions;
	if (this.isOnHeaderRows())
	{
		dimensions = this.getColumnDimensionsLastSelected();
	}
	else if (this.isOnHeaderColumns() && !this.isOnHeaderRows())
	{
		dimensions = this.getRowDimensionsLastSelected();
	}
	else
	{
		dimensions = null;
	}
	var dimensionsRemapped;
	if (oFF.notNull(dimensions))
	{
		dimensionsRemapped = oFF.XStream.of(dimensions).map( function(orig){
			return this.getQueryManager().getQueryModel().getDimensionByName(orig.getName());
		}.bind(this)).filter( function(d){
			return !d.isUniversalDisplayHierarchyDimension();
		}.bind(this)).collect(oFF.XStreamCollector.toList());
	}
	else
	{
		dimensionsRemapped = null;
	}
	return dimensionsRemapped;
};
oFF.AuGdsQdInteractiveTableView.prototype.getDimensionsAllSelectedRemapped = function(allowedTargetAxisType)
{
	var dimensions;
	if (this.isOnHeaderRows())
	{
		dimensions = this.getColumnDimensionsAllSelected();
	}
	else if (this.isOnHeaderColumns() && !this.isOnHeaderRows())
	{
		dimensions = this.getRowDimensionsAllSelected();
	}
	else
	{
		dimensions = null;
	}
	var dimensionsRemapped;
	if (oFF.notNull(dimensions))
	{
		dimensionsRemapped = oFF.XStream.of(dimensions).map( function(orig){
			return this.getQueryManager().getQueryModel().getDimensionByName(orig.getName());
		}.bind(this)).filter( function(d){
			return !d.isUniversalDisplayHierarchyDimension() && d.getSupportedAxesTypes().contains(allowedTargetAxisType);
		}.bind(this)).collect(oFF.XStreamCollector.toList());
	}
	else
	{
		dimensionsRemapped = null;
	}
	return dimensionsRemapped;
};
oFF.AuGdsQdInteractiveTableView.prototype.getSingleSelectedDimension = function()
{
	var dimensions;
	if (this.isOnHeaderRows())
	{
		dimensions = this.getColumnDimensionsAllSelected();
	}
	else if (this.isOnHeaderColumns() && !this.isOnHeaderRows())
	{
		dimensions = this.getRowDimensionsAllSelected();
	}
	else
	{
		dimensions = null;
	}
	var dimensionsRemapped;
	if (oFF.notNull(dimensions))
	{
		dimensionsRemapped = oFF.XStream.of(dimensions).map( function(orig){
			return this.getQueryManager().getQueryModel().getDimensionByName(orig.getName());
		}.bind(this)).filter( function(d){
			return !d.isUniversalDisplayHierarchyDimension();
		}.bind(this)).collect(oFF.XStreamCollector.toList());
	}
	else
	{
		dimensionsRemapped = null;
	}
	return oFF.notNull(dimensionsRemapped) && dimensionsRemapped.size() === 1 ? dimensionsRemapped.get(0) : null;
};
oFF.AuGdsQdInteractiveTableView.prototype.getSelectedTupleElements = function()
{
	var selectedTupleElements;
	if (this.isOnHeaderRows())
	{
		selectedTupleElements = this.getColumnTupleElementsAllSelected();
	}
	else if (this.isOnHeaderColumns() && !this.isOnHeaderRows())
	{
		selectedTupleElements = this.getRowTupleElementsAllSelected();
	}
	else
	{
		selectedTupleElements = null;
	}
	return selectedTupleElements;
};
oFF.AuGdsQdInteractiveTableView.prototype.getColumnFieldNamesLastSelected = function()
{
	return this.m_columnFieldNamesLastSelected;
};
oFF.AuGdsQdInteractiveTableView.prototype.getRowFieldNamesLastSelected = function()
{
	return this.m_rowFieldNamesLastSelected;
};
oFF.AuGdsQdInteractiveTableView.prototype.isOnEmptyHeaderSection = function()
{
	return this.m_onEmptyHeaderSection;
};
oFF.AuGdsQdInteractiveTableView.prototype.onTableDragAndDrop = function(event)
{
	var parameters = event.getParameters();
	var sourceColumn = parameters.getIntegerByKeyExt(oFF.UiControlEvent.PARAM_SOURCE_COLUMN, -1);
	var sourceRow = parameters.getIntegerByKeyExt(oFF.UiControlEvent.PARAM_SOURCE_ROW, -1);
	var targetColumn = parameters.getIntegerByKeyExt(oFF.UiControlEvent.PARAM_TARGET_COLUMN, -1);
	var targetRow = parameters.getIntegerByKeyExt(oFF.UiControlEvent.PARAM_TARGET_ROW, -1);
	var beforeCell = parameters.getBooleanByKey(oFF.UiControlEvent.PARAM_BEFORE_CELL);
	var resolver = event.getControl().getCustomObject();
	var queryModel = this.m_queryManager.getQueryModel();
	var sourceFieldName = this.getFieldName(resolver, sourceColumn, sourceRow);
	var targetFieldName = this.getFieldName(resolver, targetColumn, targetRow);
	var sourceField = queryModel.getFieldByName(sourceFieldName);
	var targetField = queryModel.getFieldByName(targetFieldName);
	if (oFF.notNull(sourceField) && oFF.notNull(targetField))
	{
		var sourceDimension = sourceField.getDimension();
		var targetDimension = targetField.getDimension();
		var sourceAxis = sourceDimension.getAxis();
		var targetAxis = targetDimension.getAxis();
		if (sourceDimension === targetDimension)
		{
			this.moveFields(beforeCell, sourceField, targetField, sourceDimension);
		}
		else if (sourceAxis === targetAxis && beforeCell && sourceAxis.getIndex(targetDimension) === sourceAxis.getIndex(sourceDimension) + 1)
		{
			this.moveFieldToEnd(sourceField, sourceDimension);
		}
		else if (sourceAxis === targetAxis && !beforeCell && sourceAxis.getIndex(targetDimension) === sourceAxis.getIndex(sourceDimension) - 1)
		{
			this.moveFieldToStart(sourceField, sourceDimension);
		}
		else
		{
			this.moveDimensions(beforeCell, sourceDimension, targetDimension);
		}
	}
};
oFF.AuGdsQdInteractiveTableView.prototype.moveFields = function(beforeCell, sourceField, targetField, sourceDimension)
{
	if (sourceDimension.getFieldLayoutType() === oFF.FieldLayoutType.ATTRIBUTE_BASED)
	{
		var sourceAttribute = sourceField.getAttribute();
		var targetAttribute = targetField.getAttribute();
		var rsAttributes = sourceDimension.getResultSetAttributes();
		var sourceRsFields = sourceAttribute.getResultSetFields();
		if (sourceAttribute === targetAttribute)
		{
			if (sourceField !== targetField && sourceRsFields.getIndex(targetField) > -1)
			{
				sourceRsFields.removeElement(sourceField);
				sourceRsFields.insert(sourceRsFields.getIndex(targetField) + (beforeCell ? 0 : 1), sourceField);
			}
		}
		else if (beforeCell && rsAttributes.getIndex(sourceAttribute) === rsAttributes.getIndex(targetAttribute) - 1)
		{
			sourceRsFields.removeElement(sourceField);
			sourceRsFields.add(sourceField);
		}
		else if (!beforeCell && rsAttributes.getIndex(sourceAttribute) === rsAttributes.getIndex(targetAttribute) + 1)
		{
			sourceRsFields.removeElement(sourceField);
			sourceRsFields.insert(0, sourceField);
		}
		else
		{
			if (sourceAttribute !== targetAttribute && rsAttributes.getIndex(targetAttribute) > -1)
			{
				rsAttributes.removeElement(sourceAttribute);
				rsAttributes.insert(rsAttributes.getIndex(targetAttribute) + (beforeCell ? 0 : 1), sourceAttribute);
			}
		}
	}
	else
	{
		var rsFields = sourceDimension.getResultSetFields();
		var sourceMainAttributeField = sourceField.getAttribute() !== sourceDimension.getMainAttribute() || sourceField !== sourceDimension.getKeyField() && sourceField !== sourceDimension.getTextField();
		var targetMainAttributeField = targetField.getAttribute() !== sourceDimension.getMainAttribute() || targetField !== sourceDimension.getKeyField() && targetField !== sourceDimension.getTextField();
		if (targetMainAttributeField === sourceMainAttributeField)
		{
			if (sourceField !== targetField && rsFields.getIndex(targetField) > -1)
			{
				rsFields.removeElement(sourceField);
				rsFields.insert(rsFields.getIndex(targetField) + (beforeCell ? 0 : 1), sourceField);
			}
		}
		else
		{
			rsFields.removeElement(sourceField);
			rsFields.insert(oFF.AuGdsQdInteractiveTableView.getFirstNonMainAttributeFieldIndex(sourceDimension, rsFields), sourceField);
		}
	}
	this.updateTable();
};
oFF.AuGdsQdInteractiveTableView.prototype.moveFieldToEnd = function(sourceField, sourceDimension)
{
	if (sourceDimension.getFieldLayoutType() === oFF.FieldLayoutType.ATTRIBUTE_BASED)
	{
		var sourceAttribute = sourceField.getAttribute();
		if (sourceAttribute !== sourceDimension.getMainAttribute())
		{
			var rsAttributes = sourceDimension.getResultSetAttributes();
			rsAttributes.removeElement(sourceAttribute);
			rsAttributes.add(sourceAttribute);
		}
		var sourceAttributeFields = sourceAttribute.getResultSetFields();
		sourceAttributeFields.removeElement(sourceField);
		sourceAttributeFields.add(sourceField);
	}
	else
	{
		var rsFields = sourceDimension.getResultSetFields();
		rsFields.removeElement(sourceField);
		if (sourceField.getAttribute() !== sourceDimension.getMainAttribute() || sourceField !== sourceDimension.getKeyField() && sourceField !== sourceDimension.getTextField())
		{
			rsFields.add(sourceField);
		}
		else
		{
			rsFields.insert(oFF.AuGdsQdInteractiveTableView.getFirstNonMainAttributeFieldIndex(sourceDimension, rsFields), sourceField);
		}
	}
	this.updateTable();
};
oFF.AuGdsQdInteractiveTableView.prototype.moveFieldToStart = function(sourceField, sourceDimension)
{
	if (sourceDimension.getFieldLayoutType() === oFF.FieldLayoutType.ATTRIBUTE_BASED)
	{
		var sourceAttribute = sourceField.getAttribute();
		if (sourceAttribute !== sourceDimension.getMainAttribute())
		{
			var rsAttributes = sourceDimension.getResultSetAttributes();
			rsAttributes.removeElement(sourceAttribute);
			rsAttributes.insert(rsAttributes.get(0) === sourceDimension.getMainAttribute() ? 1 : 0, sourceAttribute);
		}
		var sourceAttributeFields = sourceAttribute.getResultSetFields();
		sourceAttributeFields.removeElement(sourceField);
		sourceAttributeFields.insert(0, sourceField);
	}
	else
	{
		var rsFields = sourceDimension.getResultSetFields();
		rsFields.removeElement(sourceField);
		if (sourceField.getAttribute() !== sourceDimension.getMainAttribute() || sourceField !== sourceDimension.getKeyField() && sourceField !== sourceDimension.getTextField())
		{
			rsFields.insert(oFF.AuGdsQdInteractiveTableView.getFirstNonMainAttributeFieldIndex(sourceDimension, rsFields), sourceField);
		}
		else
		{
			rsFields.add(sourceField);
		}
	}
	this.updateTable();
};
oFF.AuGdsQdInteractiveTableView.prototype.moveDimensions = function(beforeCell, sourceDimension, targetDimension)
{
	var targetAxis = targetDimension.getAxis();
	if (sourceDimension !== targetDimension && targetAxis.getIndex(targetDimension) > -1)
	{
		sourceDimension.getAxis().removeElement(sourceDimension);
		var targetIndex = targetAxis.getIndex(targetDimension) + (beforeCell ? 0 : 1);
		targetAxis.insert(targetIndex, sourceDimension);
		this.updateTable();
	}
};
oFF.AuGdsQdInteractiveTableView.prototype.getFieldName = function(resolver, column, row)
{
	var fieldName = resolver.getColumnTupleFieldName(row);
	if (oFF.isNull(fieldName))
	{
		fieldName = resolver.getRowTupleFieldName(column);
	}
	return fieldName;
};
oFF.AuGdsQdInteractiveTableView.prototype.togglePauseUpdates = function()
{
	this.m_updatesPaused = !this.m_updatesPaused;
	if (!this.m_updatesPaused)
	{
		if (this.m_pendingUpdates)
		{
			this.m_sacTable.setBusy(true);
			this.updateTable();
		}
		else if (this.m_pendingScrollPoint > -1)
		{
			this.m_sacTable.setBusy(true);
			this.reschedulePendingScroll(this.m_pendingScrollPoint);
		}
		else
		{
			this.checkPendingReRendering();
		}
		this.m_pendingUpdates = false;
		this.m_pendingScrollPoint = -1;
	}
	else
	{
		this.cancelProcessing();
	}
	return this.m_updatesPaused;
};
oFF.AuGdsQdInteractiveTableView.prototype.isSyncActionProcessing = function()
{
	return oFF.notNull(this.m_activeSynchronizer);
};
oFF.AuGdsQdInteractiveTableView.prototype.cancelProcessing = function()
{
	this.cancelPendingUpdates();
	this.cancelUpdates();
	this.m_sacTable.setBusy(false);
};
oFF.AuGdsQdInteractiveTableView.prototype.cancelUpdates = function()
{
	if (oFF.notNull(this.m_activeSynchronizer))
	{
		try
		{
			var synchronizer = this.m_activeSynchronizer;
			this.m_activeSynchronizer = null;
			synchronizer.cancelSynchronization();
		}
		catch (t)
		{
			oFF.XLogger.println(oFF.XException.getStackTrace(t, 0));
		}
	}
};
oFF.AuGdsQdInteractiveTableView.prototype.rescheduleTableUpdate = function()
{
	this.cancelPendingUpdates();
	this.cancelPendingScrolls();
	var nullListener = null;
	this.m_pendingTableUpdates = oFF.AuGdsLambdaSyncAction.create(this.getApplication().getSession(), nullListener,  function(){
		this.m_canceledUpdate = true;
		this.cancelUpdates();
		this.m_rescheduled = true;
		this.updateTable();
		this.m_rescheduled = false;
		return oFF.XBooleanValue.create(true);
	}.bind(this), 1000);
	this.m_pendingTableUpdates.attachListener(oFF.AuGdsLambdaSyncListener.create( function(mc, res){
		if (!mc.hasErrors())
		{
			this.m_pendingTableUpdates = null;
		}
		return oFF.XBooleanValue.create(true);
	}.bind(this)), oFF.ListenerType.SYNC_LISTENER, null);
	this.m_pendingTableUpdates.processSyncAction(oFF.SyncType.NON_BLOCKING, null, null);
};
oFF.AuGdsQdInteractiveTableView.prototype.reschedulePendingScroll = function(referencePoint)
{
	if (!this.m_updatesPaused)
	{
		this.m_pendingScrollPoint = -1;
		var newMinOrig = oFF.XMath.max(0, referencePoint - this.m_rowsWindowSize * 2);
		var newMin = this.m_renderer.getIndexOfFirstUndefinedRowAfter(newMinOrig);
		var newMaxOrig = oFF.XMath.min(this.m_dataRowsCountTotal, referencePoint + this.m_rowsWindowSize * 2);
		var newMax = this.m_renderer.getIndexOfLastUndefinedRowBefore(newMaxOrig);
		if (newMax >= newMin && newMax - newMin < this.m_rowsWindowSize * 3)
		{
			if (newMax === newMaxOrig)
			{
				newMax = this.m_renderer.getIndexOfLastUndefinedRowBefore(oFF.XMath.min(this.m_dataRowsCountTotal - 1, newMin + this.m_rowsWindowSize * 3));
			}
			if (newMin === newMinOrig)
			{
				newMin = this.m_renderer.getIndexOfFirstUndefinedRowAfter(oFF.XMath.max(0, newMax - this.m_rowsWindowSize * 3));
			}
		}
		if (newMin <= newMaxOrig && newMax >= newMinOrig && newMin <= newMax && newMin < this.m_dataRowsCountTotal && newMax < this.m_dataRowsCountTotal && newMin > -1 && newMax > -1)
		{
			var smallWinStart = referencePoint - 2 * this.m_rowsWindowSize;
			var smallWinEnd = referencePoint + 2 * this.m_rowsWindowSize;
			if (newMin < smallWinEnd && newMin > smallWinStart || newMax < smallWinEnd && newMax > smallWinStart || newMin < smallWinStart && newMax > smallWinEnd)
			{
				this.m_sacTable.setBusy(true);
			}
			this.m_newMin = newMin;
			this.m_newMax = newMax;
			if (oFF.isNull(this.m_pendingScrolls) || newMin + this.m_rowsWindowSize > this.m_scrollWindowMax || newMax - this.m_rowsWindowSize < this.m_scrollWindowMin)
			{
				this.m_scrollWindowMin = newMin;
				this.m_scrollWindowMax = newMax;
				var nullListener = null;
				this.cancelPendingScrolls();
				this.m_pendingScrolls = oFF.AuGdsLambdaSyncAction.create(this.getApplication().getSession(), nullListener,  function(){
					if (!this.hasPendingTableUpdates() && !this.isSyncActionProcessing())
					{
						this.m_activeSynchronizer = this.m_queryManager.getActiveResultSetContainer();
						this.m_pendingScrolls = null;
						this.processQueryExecutionWindow(this.m_newMin, this.m_newMax - this.m_newMin + 1, 0, this.m_columnsWindowSize);
					}
					else
					{
						oFF.XLogger.println(oFF.XStringUtils.concatenate2("Internal rescheduling to ", oFF.XInteger.convertToString(referencePoint)));
						this.reschedulePendingScroll(referencePoint);
					}
					return oFF.XBooleanValue.create(true);
				}.bind(this), 500);
				this.m_pendingScrolls.processSyncAction(oFF.SyncType.NON_BLOCKING, null, null);
			}
		}
		else
		{
			this.cancelPendingScrolls();
		}
	}
	else
	{
		this.m_pendingScrollPoint = referencePoint;
	}
};
oFF.AuGdsQdInteractiveTableView.prototype.cancelPendingScrolls = function()
{
	if (oFF.notNull(this.m_pendingScrolls))
	{
		try
		{
			this.m_pendingScrolls.cancelSynchronization();
		}
		catch (t)
		{
			oFF.XLogger.println(oFF.XException.getStackTrace(t, 0));
		}
		this.m_pendingScrolls = null;
	}
};
oFF.AuGdsQdInteractiveTableView.prototype.cancelPendingUpdates = function()
{
	if (oFF.notNull(this.m_pendingTableUpdates))
	{
		try
		{
			this.m_pendingTableUpdates.cancelSynchronization();
		}
		catch (t)
		{
			oFF.XLogger.println(oFF.XException.getStackTrace(t, 0));
		}
		this.m_pendingTableUpdates = null;
	}
};
oFF.AuGdsQdInteractiveTableView.prototype.isPauseUpdates = function()
{
	return this.m_updatesPaused;
};
oFF.AuGdsQdInteractiveTableView.prototype.getColumnsCountTotal = function()
{
	return this.m_columnsCountTotal;
};
oFF.AuGdsQdInteractiveTableView.prototype.getRowsCountTotal = function()
{
	return this.m_rowsCountTotal;
};
oFF.AuGdsQdInteractiveTableView.prototype.getColumnsCountLoaded = function()
{
	return this.m_columnsCountLoaded;
};
oFF.AuGdsQdInteractiveTableView.prototype.getRowsCountLoaded = function()
{
	return this.m_rowsCountLoaded;
};
oFF.AuGdsQdInteractiveTableView.prototype.getColumnsWindowSize = function()
{
	return this.m_columnsWindowSize;
};
oFF.AuGdsQdInteractiveTableView.prototype.setColumnsWindowSize = function(columnsWindowSize)
{
	this.m_columnsWindowSize = columnsWindowSize;
};
oFF.AuGdsQdInteractiveTableView.prototype.getRowsWindowSize = function()
{
	return this.m_rowsWindowSize;
};
oFF.AuGdsQdInteractiveTableView.prototype.setRowsWindowSize = function(rowsWindowSize)
{
	this.m_rowsWindowSize = rowsWindowSize;
};
oFF.AuGdsQdInteractiveTableView.prototype.getMaxRowsWindowSize = function()
{
	return this.m_maxRowsWindowSize;
};
oFF.AuGdsQdInteractiveTableView.prototype.setMaxRowsWindowSize = function(maxRowsWindowSize)
{
	this.m_maxRowsWindowSize = maxRowsWindowSize;
};
oFF.AuGdsQdInteractiveTableView.prototype.onScrollLoad = function(event)
{
	var scrollTop = oFF.XMath.div(event.getParameters().getIntegerByKey(oFF.UiControlEvent.PARAM_SCROLL_TOP), 1000) + 1;
	var totalHeight = oFF.XMath.div(this.m_renderer.getTableJson().getIntegerByKey(oFF.SacTableConstants.TD_N_TOTAL_HEIGHT), 1000) + 1;
	var referencePoint = oFF.XMath.div(this.m_rowsCountTotal * scrollTop, totalHeight);
	this.reschedulePendingScroll(referencePoint);
	this.m_sacTable.setModelJson(this.m_renderer.reRenderTitleAndGenericSettings(false));
};
oFF.AuGdsQdInteractiveTableView.prototype.checkPendingReRendering = function()
{
	var rerendered = true;
	if (this.m_pendingFullTableReRendering)
	{
		this.m_sacTable.setBusy(true);
		this.m_renderer.setGridConfigration(this.m_tableConfig.serializeToStructure());
		this.m_renderer.reRenderTotalFormatting();
		this.m_sacTable.setModelJson(this.m_renderer.reRenderTitleAndGenericSettings(true));
	}
	else if (this.m_pendingTableReConfiguration)
	{
		this.m_renderer.setGridConfigration(this.m_tableConfig.serializeToStructure());
		this.m_sacTable.setModelJson(this.m_renderer.reRenderTitleAndGenericSettings(false));
	}
	else
	{
		rerendered = false;
	}
	this.m_pendingFullTableReRendering = false;
	this.m_pendingTableReConfiguration = false;
	return rerendered;
};
oFF.AuGdsQdInteractiveTableView.prototype.getDataRowsCountTotal = function()
{
	return this.m_dataRowsCountTotal;
};
oFF.AuGdsQdInteractiveTableView.prototype.getDataColumnsCountTotal = function()
{
	return this.m_dataColumnsCountTotal;
};

oFF.AuProteusEngine = function() {};
oFF.AuProteusEngine.prototype = new oFF.XObjectExt();
oFF.AuProteusEngine.prototype._ff_c = "AuProteusEngine";

oFF.AuProteusEngine.HTML_TEMPLATE = "<!DOCTYPE html>\r\n<html>\r\n   <head>\r\n      <meta http-equiv=\"X-UA-Compatible\" content=\"IE=edge\"/>\r\n      <meta charset=\"UTF-8\">\r\n      <title>Proteus output</title>\r\n      <script\r\n         id=\"sap-ui-bootstrap\"\r\n         src=\"https://sapui5.hana.ondemand.com/resources/sap-ui-core.js\"\r\n         data-sap-ui-theme=\"sap_bluecrystal\"\r\n         data-sap-ui-libs=\"sap.m\"\r\n         data-sap-ui-compatVersion=\"edge\"\r\n         data-sap-ui-preload=\"async\"\r\n         data-sap-ui-resourceroots='{\r\n            \"sap.ui.demo.wt\": \"./\"\r\n         }' >\r\n      </script>\r\n      <script>\r\n         sap.ui.getCore().attachInit(function () {\r\n            sap.ui.xmlview({\r\n               viewName : \"sap.ui.demo.wt.views.Main\"\r\n            }).placeAt(\"content\");\r\n         });\r\n      </script>\r\n   </head>\r\n   <body class=\"sapUiBody\" id=\"content\">\r\n   </body>\r\n</html>\r\n";
oFF.AuProteusEngine.createEngine = function(quasarDocContent)
{
	var newEngine = new oFF.AuProteusEngine();
	newEngine.setupEngine(quasarDocContent);
	return newEngine;
};
oFF.AuProteusEngine.prototype.m_quasarJsonContent = null;
oFF.AuProteusEngine.prototype.m_parsingErrors = null;
oFF.AuProteusEngine.prototype.m_xmlViewContent = null;
oFF.AuProteusEngine.prototype.m_parsingDepth = 0;
oFF.AuProteusEngine.prototype.releaseObject = function()
{
	this.m_quasarJsonContent = null;
	this.m_xmlViewContent = null;
	this.m_parsingErrors = oFF.XObjectExt.release(this.m_parsingErrors);
	oFF.XObjectExt.prototype.releaseObject.call( this );
};
oFF.AuProteusEngine.prototype.getLogSeverity = function()
{
	return oFF.Severity.PRINT;
};
oFF.AuProteusEngine.prototype.convert = function()
{
	this.m_xmlViewContent = this.parseDocument();
};
oFF.AuProteusEngine.prototype.getHtmlFileContent = function()
{
	return oFF.AuProteusEngine.HTML_TEMPLATE;
};
oFF.AuProteusEngine.prototype.getXmlViewContent = function()
{
	if (oFF.isNull(this.m_xmlViewContent))
	{
		this.m_xmlViewContent = this.parseDocument();
	}
	return this.m_xmlViewContent;
};
oFF.AuProteusEngine.prototype.setQuasarDocumentJson = function(quasarDocContent)
{
	this.m_quasarJsonContent = quasarDocContent;
};
oFF.AuProteusEngine.prototype.getParsingErrors = function()
{
	return this.m_parsingErrors;
};
oFF.AuProteusEngine.prototype.hasErrors = function()
{
	return this.m_parsingErrors.size() > 0;
};
oFF.AuProteusEngine.prototype.setupEngine = function(quasarDocContent)
{
	this.m_quasarJsonContent = quasarDocContent;
	this.m_parsingErrors = oFF.XListOfString.create();
};
oFF.AuProteusEngine.prototype.parseDocument = function()
{
	this.m_parsingErrors.clear();
	if (oFF.notNull(this.m_quasarJsonContent))
	{
		var strBuf = oFF.XStringBuffer.create();
		strBuf.appendLine("<mvc:View");
		strBuf.appendLine("\txmlns=\"sap.m\"");
		strBuf.appendLine("\txmlns:core=\"sap.ui.core\"");
		strBuf.appendLine("\txmlns:mvc=\"sap.ui.core.mvc\">");
		var contentElement = this.m_quasarJsonContent.getStructureByKey(oFF.UiConstants.QSA_CONTENT);
		if (oFF.isNull(contentElement))
		{
			contentElement = this.m_quasarJsonContent;
		}
		this.m_parsingDepth = 1;
		this.parseControl(contentElement, strBuf, null);
		strBuf.appendLine("</mvc:View>");
		return strBuf.toString();
	}
	else
	{
		this.addParsingError("Missing quasar json document!");
	}
	return null;
};
oFF.AuProteusEngine.prototype.parseControl = function(controlElement, strBuf, itemType)
{
	var controlNameStr = controlElement.getStringByKey(oFF.UiConstants.QSA_CTYPE);
	var uiType = oFF.UiType.lookupUiType(controlNameStr);
	if (oFF.isNull(uiType) && oFF.notNull(itemType))
	{
		uiType = itemType;
	}
	if (oFF.notNull(uiType))
	{
		var ui5PControlStr = this.getUi5NameForUiType(uiType);
		if (oFF.XStringUtils.isNotNullAndNotEmpty(ui5PControlStr))
		{
			var hasAggregations = false;
			var indents = oFF.XStringUtils.leftPad("", "\t", this.m_parsingDepth);
			strBuf.append(oFF.XStringUtils.concatenate2(indents, "<"));
			strBuf.append(ui5PControlStr);
			var keys = controlElement.getKeysAsReadOnlyListOfString();
			for (var i = 0; i < keys.size(); i++)
			{
				var key = keys.get(i);
				var tmpProp = oFF.UiProperty.lookup(key);
				var value = oFF.UiUtils.getElementAsString(controlElement, key);
				if (oFF.notNull(tmpProp) && tmpProp !== oFF.UiProperty.ID)
				{
					this.parseProperty(tmpProp, value, strBuf);
				}
				var tmpAgr = oFF.UiAggregation.lookup(key);
				if (oFF.notNull(tmpAgr))
				{
					if (hasAggregations === false)
					{
						this.m_parsingDepth++;
						hasAggregations = true;
						strBuf.appendLine(">");
					}
					var aggregationItems = controlElement.getListByKey(key);
					if (oFF.notNull(aggregationItems) && aggregationItems.size() > 0)
					{
						for (var m = 0; m < aggregationItems.size(); m++)
						{
							var docAgrItem = aggregationItems.getStructureAt(m);
							this.parseControl(docAgrItem, strBuf, uiType.getDefaultItemType());
						}
						this.m_parsingDepth--;
					}
				}
			}
			if (hasAggregations)
			{
				strBuf.append(oFF.XStringUtils.concatenate2(indents, "<"));
				strBuf.append("/");
				strBuf.append(ui5PControlStr);
				strBuf.appendLine(">");
			}
			else
			{
				strBuf.appendLine("/>");
			}
		}
		else
		{
			this.addParsingError(oFF.XStringUtils.concatenate2("Cannot parse control: ", controlNameStr));
		}
	}
	else
	{
		this.addParsingError(oFF.XStringUtils.concatenate2("Cannot find control: ", controlNameStr));
	}
};
oFF.AuProteusEngine.prototype.parseProperty = function(uiProp, value, strBuf)
{
	var ui5PropStr = this.getUi5PropertyForUiProperty(uiProp);
	var propValue = value;
	if (oFF.XStringUtils.isNotNullAndNotEmpty(ui5PropStr))
	{
		if (uiProp === oFF.UiProperty.ICON && oFF.XString.startsWith(value, "http") === false)
		{
			propValue = oFF.XStringUtils.concatenate2("sap-icon://", propValue);
		}
		strBuf.append(" ");
		strBuf.append(ui5PropStr);
		strBuf.append("=\"");
		strBuf.append(propValue);
		strBuf.append("\"");
	}
	else
	{
		this.addParsingError(oFF.XStringUtils.concatenate2("Cannot parse property: ", uiProp.getName()));
	}
};
oFF.AuProteusEngine.prototype.getUi5NameForUiType = function(uiType)
{
	if (uiType === oFF.UiType.LABEL)
	{
		return "Label";
	}
	else if (uiType === oFF.UiType.BUTTON)
	{
		return "Button";
	}
	else if (uiType === oFF.UiType.TEXT)
	{
		return "Text";
	}
	else if (uiType === oFF.UiType.INPUT)
	{
		return "Input";
	}
	else if (uiType === oFF.UiType.DROPDOWN)
	{
		return "ActionSelect";
	}
	else if (uiType === oFF.UiType.DROPDOWN_ITEM)
	{
		return "core:ListItem";
	}
	else if (uiType === oFF.UiType.FLEX_LAYOUT)
	{
		return "FlexBox";
	}
	return null;
};
oFF.AuProteusEngine.prototype.getUi5PropertyForUiProperty = function(uiProp)
{
	if (uiProp === oFF.UiProperty.NAME)
	{
		return "id";
	}
	else if (uiProp === oFF.UiProperty.TEXT)
	{
		return "text";
	}
	else if (uiProp === oFF.UiProperty.ICON)
	{
		return "icon";
	}
	else if (uiProp === oFF.UiProperty.PLACEHOLDER)
	{
		return "placeholder";
	}
	else if (uiProp === oFF.UiProperty.WIDTH)
	{
		return "width";
	}
	else if (uiProp === oFF.UiProperty.HEIGHT)
	{
		return "height";
	}
	else if (uiProp === oFF.UiProperty.DIRECTION)
	{
		return "direction";
	}
	return null;
};
oFF.AuProteusEngine.prototype.addParsingError = function(parsingError)
{
	this.m_parsingErrors.add(parsingError);
};

oFF.AuGdsQueryDesignerDocument = function() {};
oFF.AuGdsQueryDesignerDocument.prototype = new oFF.AuGdsDfDocument();
oFF.AuGdsQueryDesignerDocument.prototype._ff_c = "AuGdsQueryDesignerDocument";

oFF.AuGdsQueryDesignerDocument.MENU_BAR_PANELS_BTN = "gdsViewMenuBarBtn";
oFF.AuGdsQueryDesignerDocument.MENU_BAR_DATA_SOURCE_BTN = "gdsDataSourceMenuBarBtn";
oFF.AuGdsQueryDesignerDocument.MENU_BAR_VIEW_MENU = "gdsViewMenuBarMenu";
oFF.AuGdsQueryDesignerDocument.MENU_BAR_VIEW_MENU_FILTER_PANEL = "gdsViewMenuBarMenuFilterPanel";
oFF.AuGdsQueryDesignerDocument.MENU_BAR_VIEW_MENU_DESIGNER_PANELS = "gdsViewMenuBarMenuDesignerPanels";
oFF.AuGdsQueryDesignerDocument.MENU_BAR_DATA_SOURCE_MENU = "gdsDataSourceMenuBarMenu";
oFF.AuGdsQueryDesignerDocument.MENU_BAR_DATA_SOURCE_MENU_CHANGE_DATA_SOURCE = "gdsMenuBarDataSourceMenuChangeDataSource";
oFF.AuGdsQueryDesignerDocument.MENU_BAR_DATA_SOURCE_MENU_DATA_SOURCE_INFO = "gdsMenuBarDataSourceMenuDataSourceInfo";
oFF.AuGdsQueryDesignerDocument.MENU_BAR_DATA_SOURCE_MENU_RESET = "gdsMenuBarDataSourceMenuReset";
oFF.AuGdsQueryDesignerDocument.MENU_BAR_DATA_SOURCE_MENU_REFRESH = "gdsMenuBarDataSourceMenuRefresh";
oFF.AuGdsQueryDesignerDocument.MENU_BAR_DATA_SOURCE_MENU_PAUSE_UPDATES = "gdsMenuBarDataSourceMenuPauseUpdates";
oFF.AuGdsQueryDesignerDocument.MENU_BAR_DATA_SOURCE_MENU_VARIABLES = "gdsMenuBarDataSourceMenuVariables";
oFF.AuGdsQueryDesignerDocument.QUICK_ACTION_TOOLBAR_SELECT_DATA_SOURCE = "gdsQuickActionToolbarSelectDataSource";
oFF.AuGdsQueryDesignerDocument.QUICK_ACTION_TOOLBAR_RESET = "gdsQuickActionToolbarReset";
oFF.AuGdsQueryDesignerDocument.QUICK_ACTION_TOOLBAR_REFRESH = "gdsQuickActionToolbarRefresh";
oFF.AuGdsQueryDesignerDocument.QUICK_ACTION_TOOLBAR_VARIABLES = "gdsQuickActionToolbarVariables";
oFF.AuGdsQueryDesignerDocument.QUICK_ACTION_TOOLBAR_LAYOUT = "gdsQuickActionToolbarLayout";
oFF.AuGdsQueryDesignerDocument.QUICK_ACTION_TOOLBAR_UDH_ROW = "gdsQuickActionToolbarUdhRow";
oFF.AuGdsQueryDesignerDocument.QUICK_ACTION_TOOLBAR_MOVE_UP = "gdsQuickActionToolbarMoveUp";
oFF.AuGdsQueryDesignerDocument.QUICK_ACTION_TOOLBAR_MOVE_LEFT = "gdsQuickActionToolbarMoveLeft";
oFF.AuGdsQueryDesignerDocument.QUICK_ACTION_TOOLBAR_MOVE_DOWN = "gdsQuickActionToolbarMoveDown";
oFF.AuGdsQueryDesignerDocument.QUICK_ACTION_TOOLBAR_MOVE_RIGHT = "gdsQuickActionToolbarMoveRight";
oFF.AuGdsQueryDesignerDocument.QUICK_ACTION_TOOLBAR_COL = "gdsQuickActionToolbarCol";
oFF.AuGdsQueryDesignerDocument.QUICK_ACTION_TOOLBAR_ROW = "gdsQuickActionToolbarRow";
oFF.AuGdsQueryDesignerDocument.QUICK_ACTION_TOOLBAR_FREE = "gdsQuickActionToolbarFree";
oFF.AuGdsQueryDesignerDocument.QUICK_ACTION_TOOLBAR_FILTER_CLEAR = "gdsQuickActionToolbarFilterClear";
oFF.AuGdsQueryDesignerDocument.QUICK_ACTION_TOOLBAR_FILTER_ADD = "gdsQuickActionToolbarFilterAdd";
oFF.AuGdsQueryDesignerDocument.QUICK_ACTION_TOOLBAR_FILTER_SELECTION = "gdsQuickActionToolbarFilterSelection";
oFF.AuGdsQueryDesignerDocument.QUICK_ACTION_TOOLBAR_DIMENSION = "gdsQuickActionToolbarDimension";
oFF.AuGdsQueryDesignerDocument.QUICK_ACTION_TOOLBAR_PAUSE_UPDATES = "gdsQuickActionToolbarPauseUpdates";
oFF.AuGdsQueryDesignerDocument.QUICK_ACTION_TOOLBAR_SHOW_DESIGNER = "gdsQuickActionToolbarShowDesigner";
oFF.AuGdsQueryDesignerDocument.GDF_QD_FILE_SYSTEM_KEY = "system";
oFF.AuGdsQueryDesignerDocument.GDF_QD_FILE_DATA_SOURCE_KEY = "dataSource";
oFF.AuGdsQueryDesignerDocument.GDF_QD_FILE_INA_REPO_KEY = "inaRepo";
oFF.AuGdsQueryDesignerDocument.GDF_QD_FILE_TABLE_CFG = "tableCfg";
oFF.AuGdsQueryDesignerDocument.GDS_QD_RECENT_FILES_SEPARATOR = ",";
oFF.AuGdsQueryDesignerDocument.GDS_QD_RECENT_FILES_KEY = "galaxyDataStudio_queryDesigner_recentFiles";
oFF.AuGdsQueryDesignerDocument.GDS_QD_AUTO_OPEN_NAVIGATION_PANEL_KEY = "galaxyDataStudio_queryDesigner_autoOpenNavigationPanel";
oFF.AuGdsQueryDesignerDocument.GDS_QD_AUTO_OPEN_FILTER_PANEL_KEY = "galaxyDataStudio_queryDesigner_autoOpenFilterPanel";
oFF.AuGdsQueryDesignerDocument.GDS_QD_PREFS_DOC_NAME_KEY = "doc_name";
oFF.AuGdsQueryDesignerDocument.GDS_QD_PREFS_TABLE_TITLE_KEY = "table_title";
oFF.AuGdsQueryDesignerDocument.GDS_QD_PREFS_ROWS_PAGE_SIZE = "table_rows_page_size";
oFF.AuGdsQueryDesignerDocument.GDS_QD_PREFS_COLUMNS_PAGE_SIZE = "table_columns_page_size";
oFF.AuGdsQueryDesignerDocument.CONTENT_ACTIVITY_INDICATOR = "gdsContentActivityIndicator";
oFF.AuGdsQueryDesignerDocument.create = function(controller, file, system, dataSource, listener)
{
	var newQdDocument = new oFF.AuGdsQueryDesignerDocument();
	newQdDocument.setupInternal(controller, file, system, dataSource, listener);
	return newQdDocument;
};
oFF.AuGdsQueryDesignerDocument.prototype.m_contentLayout = null;
oFF.AuGdsQueryDesignerDocument.prototype.m_system = null;
oFF.AuGdsQueryDesignerDocument.prototype.m_dataSource = null;
oFF.AuGdsQueryDesignerDocument.prototype.m_inaRepoJson = null;
oFF.AuGdsQueryDesignerDocument.prototype.m_tableConfigJson = null;
oFF.AuGdsQueryDesignerDocument.prototype.m_messageManager = null;
oFF.AuGdsQueryDesignerDocument.prototype.m_queryManager = null;
oFF.AuGdsQueryDesignerDocument.prototype.m_interactiveTable = null;
oFF.AuGdsQueryDesignerDocument.prototype.m_homeView = null;
oFF.AuGdsQueryDesignerDocument.prototype.m_filterPanel = null;
oFF.AuGdsQueryDesignerDocument.prototype.m_navigationPanel = null;
oFF.AuGdsQueryDesignerDocument.prototype.m_builderPanel = null;
oFF.AuGdsQueryDesignerDocument.prototype.m_variableDialog = null;
oFF.AuGdsQueryDesignerDocument.prototype.m_autoOpenDesignerPanels = false;
oFF.AuGdsQueryDesignerDocument.prototype.m_autoOpenFilterPanel = false;
oFF.AuGdsQueryDesignerDocument.prototype.m_toolbarSelectDataSourceBtn = null;
oFF.AuGdsQueryDesignerDocument.prototype.m_toolbarResetBtn = null;
oFF.AuGdsQueryDesignerDocument.prototype.m_toolbarRefreshBtn = null;
oFF.AuGdsQueryDesignerDocument.prototype.m_toolbarVariablesBtn = null;
oFF.AuGdsQueryDesignerDocument.prototype.m_toolbarLayoutBtn = null;
oFF.AuGdsQueryDesignerDocument.prototype.m_toolbarUdhRowBtn = null;
oFF.AuGdsQueryDesignerDocument.prototype.m_toolbarMoveLeftBtn = null;
oFF.AuGdsQueryDesignerDocument.prototype.m_toolbarMoveUpBtn = null;
oFF.AuGdsQueryDesignerDocument.prototype.m_toolbarMoveRightBtn = null;
oFF.AuGdsQueryDesignerDocument.prototype.m_toolbarMoveDownBtn = null;
oFF.AuGdsQueryDesignerDocument.prototype.m_toolbarTableColumnBtn = null;
oFF.AuGdsQueryDesignerDocument.prototype.m_toolbarTableRowBtn = null;
oFF.AuGdsQueryDesignerDocument.prototype.m_toolbarTableFreeBtn = null;
oFF.AuGdsQueryDesignerDocument.prototype.m_toolbarClearFilterBtn = null;
oFF.AuGdsQueryDesignerDocument.prototype.m_toolbarAddFilterBtn = null;
oFF.AuGdsQueryDesignerDocument.prototype.m_toolbarFilterSelectionBtn = null;
oFF.AuGdsQueryDesignerDocument.prototype.m_toolbarDimensionSettingsBtn = null;
oFF.AuGdsQueryDesignerDocument.prototype.m_pauseUpdatesToggleBtn = null;
oFF.AuGdsQueryDesignerDocument.prototype.m_toolbarDesignerPanelToggleBtn = null;
oFF.AuGdsQueryDesignerDocument.prototype.m_recentFiles = null;
oFF.AuGdsQueryDesignerDocument.prototype.releaseObject = function()
{
	this.m_recentFiles = oFF.XObjectExt.release(this.m_recentFiles);
	this.m_toolbarSelectDataSourceBtn = oFF.XObjectExt.release(this.m_toolbarSelectDataSourceBtn);
	this.m_toolbarResetBtn = oFF.XObjectExt.release(this.m_toolbarResetBtn);
	this.m_toolbarRefreshBtn = oFF.XObjectExt.release(this.m_toolbarRefreshBtn);
	this.m_toolbarVariablesBtn = oFF.XObjectExt.release(this.m_toolbarVariablesBtn);
	this.m_toolbarLayoutBtn = oFF.XObjectExt.release(this.m_toolbarLayoutBtn);
	this.m_toolbarUdhRowBtn = oFF.XObjectExt.release(this.m_toolbarUdhRowBtn);
	this.m_toolbarMoveLeftBtn = oFF.XObjectExt.release(this.m_toolbarMoveLeftBtn);
	this.m_toolbarMoveUpBtn = oFF.XObjectExt.release(this.m_toolbarMoveUpBtn);
	this.m_toolbarMoveRightBtn = oFF.XObjectExt.release(this.m_toolbarMoveRightBtn);
	this.m_toolbarMoveDownBtn = oFF.XObjectExt.release(this.m_toolbarMoveDownBtn);
	this.m_toolbarTableColumnBtn = oFF.XObjectExt.release(this.m_toolbarTableColumnBtn);
	this.m_toolbarTableRowBtn = oFF.XObjectExt.release(this.m_toolbarTableRowBtn);
	this.m_toolbarTableFreeBtn = oFF.XObjectExt.release(this.m_toolbarTableFreeBtn);
	this.m_toolbarClearFilterBtn = oFF.XObjectExt.release(this.m_toolbarClearFilterBtn);
	this.m_toolbarAddFilterBtn = oFF.XObjectExt.release(this.m_toolbarAddFilterBtn);
	this.m_toolbarFilterSelectionBtn = oFF.XObjectExt.release(this.m_toolbarFilterSelectionBtn);
	this.m_toolbarDimensionSettingsBtn = oFF.XObjectExt.release(this.m_toolbarDimensionSettingsBtn);
	this.m_pauseUpdatesToggleBtn = oFF.XObjectExt.release(this.m_pauseUpdatesToggleBtn);
	this.m_toolbarDesignerPanelToggleBtn = oFF.XObjectExt.release(this.m_toolbarDesignerPanelToggleBtn);
	this.m_contentLayout = oFF.XObjectExt.release(this.m_contentLayout);
	this.m_filterPanel = oFF.XObjectExt.release(this.m_filterPanel);
	this.m_navigationPanel = oFF.XObjectExt.release(this.m_navigationPanel);
	this.m_builderPanel = oFF.XObjectExt.release(this.m_builderPanel);
	this.m_homeView = oFF.XObjectExt.release(this.m_homeView);
	this.m_interactiveTable = oFF.XObjectExt.release(this.m_interactiveTable);
	oFF.AuGdsDfDocument.prototype.releaseObject.call( this );
};
oFF.AuGdsQueryDesignerDocument.prototype.setupInternal = function(controller, file, system, dataSource, listener)
{
	this.setupDocument(controller, listener);
	this.setTitle("Home");
	this.setIcon("home");
	this.setFile(file);
	this.m_system = system;
	this.m_dataSource = dataSource;
	this.initSettings();
	this.prepareMainMenu();
	this.preapareToolbarItems();
	this.initInitialView();
};
oFF.AuGdsQueryDesignerDocument.prototype.initSettings = function()
{
	this.initRecentFiles();
	this.m_autoOpenDesignerPanels = this.getUserSettings().getBooleanByKeyExt(oFF.AuGdsQueryDesignerDocument.GDS_QD_AUTO_OPEN_NAVIGATION_PANEL_KEY, false);
	this.m_autoOpenFilterPanel = this.getUserSettings().getBooleanByKeyExt(oFF.AuGdsQueryDesignerDocument.GDS_QD_AUTO_OPEN_FILTER_PANEL_KEY, false);
};
oFF.AuGdsQueryDesignerDocument.prototype.prepareMainMenu = function()
{
	this.addMenuBarButton(oFF.AuGdsQueryDesignerDocument.MENU_BAR_PANELS_BTN, null, "Panels", null, this);
	this.addMenuBarButton(oFF.AuGdsQueryDesignerDocument.MENU_BAR_DATA_SOURCE_BTN, null, "Data Source", null, this);
};
oFF.AuGdsQueryDesignerDocument.prototype.preapareToolbarItems = function()
{
	this.m_toolbarSelectDataSourceBtn = this.getGenesis().newControl(oFF.UiType.BUTTON);
	this.m_toolbarSelectDataSourceBtn.setName(oFF.AuGdsQueryDesignerDocument.QUICK_ACTION_TOOLBAR_SELECT_DATA_SOURCE);
	this.m_toolbarSelectDataSourceBtn.setTooltip("Select Data Source");
	this.m_toolbarSelectDataSourceBtn.setIcon("database");
	this.m_toolbarSelectDataSourceBtn.registerOnPress(this);
	this.m_toolbarSelectDataSourceBtn.setEnabled(true);
	this.addToolbarItem(this.m_toolbarSelectDataSourceBtn);
	this.m_toolbarResetBtn = this.getGenesis().newControl(oFF.UiType.BUTTON);
	this.m_toolbarResetBtn.setName(oFF.AuGdsQueryDesignerDocument.QUICK_ACTION_TOOLBAR_RESET);
	this.m_toolbarResetBtn.setTooltip("Reset");
	this.m_toolbarResetBtn.setIcon("reset");
	this.m_toolbarResetBtn.registerOnPress(this);
	this.m_toolbarResetBtn.setEnabled(false);
	this.addToolbarItem(this.m_toolbarResetBtn);
	this.m_toolbarRefreshBtn = this.getGenesis().newControl(oFF.UiType.BUTTON);
	this.m_toolbarRefreshBtn.setName(oFF.AuGdsQueryDesignerDocument.QUICK_ACTION_TOOLBAR_REFRESH);
	this.m_toolbarRefreshBtn.setTooltip("Refresh the data from backend");
	this.m_toolbarRefreshBtn.setIcon("refresh");
	this.m_toolbarRefreshBtn.registerOnPress(this);
	this.m_toolbarRefreshBtn.setEnabled(false);
	this.addToolbarItem(this.m_toolbarRefreshBtn);
	this.m_toolbarVariablesBtn = this.getGenesis().newControl(oFF.UiType.BUTTON);
	this.m_toolbarVariablesBtn.setName(oFF.AuGdsQueryDesignerDocument.QUICK_ACTION_TOOLBAR_VARIABLES);
	this.m_toolbarVariablesBtn.setTooltip("Set Variables");
	this.m_toolbarVariablesBtn.setIcon("customize");
	this.m_toolbarVariablesBtn.registerOnPress(this);
	this.m_toolbarVariablesBtn.setEnabled(false);
	this.addToolbarItem(this.m_toolbarVariablesBtn);
	this.addToolbarSectionSeparator();
	this.m_toolbarLayoutBtn = this.getGenesis().newControl(oFF.UiType.BUTTON);
	this.m_toolbarLayoutBtn.setName(oFF.AuGdsQueryDesignerDocument.QUICK_ACTION_TOOLBAR_LAYOUT);
	this.m_toolbarLayoutBtn.setTooltip("Layout ...");
	this.m_toolbarLayoutBtn.setIcon("chart-axis");
	this.m_toolbarLayoutBtn.registerOnPress(oFF.AuGdsLambdaListener.create( function(){
		oFF.AuGdsQdInteractiveTableContextActionsHelper.openLayoutDialog(this.getApplication(), this.m_queryManager.getQueryModel(),  function(){
			this.m_interactiveTable.updateTable();
		}.bind(this));
	}.bind(this)));
	this.m_toolbarLayoutBtn.setEnabled(false);
	this.addToolbarItem(this.m_toolbarLayoutBtn);
	this.m_toolbarUdhRowBtn = this.getGenesis().newControl(oFF.UiType.TOGGLE_BUTTON);
	this.m_toolbarUdhRowBtn.setName(oFF.AuGdsQueryDesignerDocument.QUICK_ACTION_TOOLBAR_UDH_ROW);
	this.m_toolbarUdhRowBtn.setTooltip("Activate UDH on rows");
	this.m_toolbarUdhRowBtn.setIcon("tree");
	this.m_toolbarUdhRowBtn.registerOnPress(oFF.AuGdsLambdaListener.create( function(){
		this.m_interactiveTable.toggleUdh(oFF.AxisType.ROWS, !this.m_queryManager.getQueryModel().getUniversalDisplayHierarchies().getByAxisType(oFF.AxisType.ROWS).isActive());
	}.bind(this)));
	this.m_toolbarUdhRowBtn.setEnabled(false);
	this.addToolbarItem(this.m_toolbarUdhRowBtn);
	this.addToolbarSectionSeparator();
	this.m_toolbarMoveUpBtn = this.getGenesis().newControl(oFF.UiType.BUTTON);
	this.m_toolbarMoveUpBtn.setName(oFF.AuGdsQueryDesignerDocument.QUICK_ACTION_TOOLBAR_MOVE_UP);
	this.m_toolbarMoveUpBtn.setTooltip("Move up ...");
	this.m_toolbarMoveUpBtn.setIcon("arrow-top");
	this.m_toolbarMoveUpBtn.registerOnPress(oFF.AuGdsLambdaListener.create( function(){
		oFF.AuGdsQdInteractiveTableContextActionsHelper.moveDimensions(this.m_interactiveTable.getDimensionsLastSelectedRemapped(), -1);
		this.m_interactiveTable.updateTable();
	}.bind(this)));
	this.m_toolbarMoveUpBtn.setEnabled(false);
	this.addToolbarItem(this.m_toolbarMoveUpBtn);
	this.m_toolbarMoveLeftBtn = this.getGenesis().newControl(oFF.UiType.BUTTON);
	this.m_toolbarMoveLeftBtn.setName(oFF.AuGdsQueryDesignerDocument.QUICK_ACTION_TOOLBAR_MOVE_LEFT);
	this.m_toolbarMoveLeftBtn.setTooltip("Move left ...");
	this.m_toolbarMoveLeftBtn.setIcon("arrow-left");
	this.m_toolbarMoveLeftBtn.registerOnPress(oFF.AuGdsLambdaListener.create( function(){
		oFF.AuGdsQdInteractiveTableContextActionsHelper.moveDimensions(this.m_interactiveTable.getDimensionsLastSelectedRemapped(), -1);
		this.m_interactiveTable.updateTable();
	}.bind(this)));
	this.m_toolbarMoveLeftBtn.setEnabled(false);
	this.addToolbarItem(this.m_toolbarMoveLeftBtn);
	this.m_toolbarMoveDownBtn = this.getGenesis().newControl(oFF.UiType.BUTTON);
	this.m_toolbarMoveDownBtn.setName(oFF.AuGdsQueryDesignerDocument.QUICK_ACTION_TOOLBAR_MOVE_DOWN);
	this.m_toolbarMoveDownBtn.setTooltip("Move down ...");
	this.m_toolbarMoveDownBtn.setIcon("arrow-bottom");
	this.m_toolbarMoveDownBtn.registerOnPress(oFF.AuGdsLambdaListener.create( function(){
		oFF.AuGdsQdInteractiveTableContextActionsHelper.moveDimensions(this.m_interactiveTable.getDimensionsLastSelectedRemapped(), +1);
		this.m_interactiveTable.updateTable();
	}.bind(this)));
	this.m_toolbarMoveDownBtn.setEnabled(false);
	this.addToolbarItem(this.m_toolbarMoveDownBtn);
	this.m_toolbarMoveRightBtn = this.getGenesis().newControl(oFF.UiType.BUTTON);
	this.m_toolbarMoveRightBtn.setName(oFF.AuGdsQueryDesignerDocument.QUICK_ACTION_TOOLBAR_MOVE_RIGHT);
	this.m_toolbarMoveRightBtn.setTooltip("Move right ...");
	this.m_toolbarMoveRightBtn.setIcon("arrow-right");
	this.m_toolbarMoveRightBtn.registerOnPress(oFF.AuGdsLambdaListener.create( function(){
		oFF.AuGdsQdInteractiveTableContextActionsHelper.moveDimensions(this.m_interactiveTable.getDimensionsLastSelectedRemapped(), +1);
		this.m_interactiveTable.updateTable();
	}.bind(this)));
	this.m_toolbarMoveRightBtn.setEnabled(false);
	this.addToolbarItem(this.m_toolbarMoveRightBtn);
	this.addToolbarSectionSeparator();
	this.m_toolbarTableColumnBtn = this.getGenesis().newControl(oFF.UiType.BUTTON);
	this.m_toolbarTableColumnBtn.setName(oFF.AuGdsQueryDesignerDocument.QUICK_ACTION_TOOLBAR_COL);
	this.m_toolbarTableColumnBtn.setTooltip("Move to columns");
	this.m_toolbarTableColumnBtn.setIcon("table-column");
	this.m_toolbarTableColumnBtn.registerOnPress(oFF.AuGdsLambdaListener.create( function(){
		oFF.AuGdsQdInteractiveTableContextActionsHelper.moveToAxis(this.m_queryManager, this.m_interactiveTable.getDimensionsAllSelectedRemapped(oFF.AxisType.COLUMNS), oFF.AxisType.COLUMNS);
		this.m_interactiveTable.updateTable();
	}.bind(this)));
	this.m_toolbarTableColumnBtn.setEnabled(false);
	this.addToolbarItem(this.m_toolbarTableColumnBtn);
	this.m_toolbarTableRowBtn = this.getGenesis().newControl(oFF.UiType.BUTTON);
	this.m_toolbarTableRowBtn.setName(oFF.AuGdsQueryDesignerDocument.QUICK_ACTION_TOOLBAR_ROW);
	this.m_toolbarTableRowBtn.setTooltip("Move to rows");
	this.m_toolbarTableRowBtn.setIcon("table-row");
	this.m_toolbarTableRowBtn.registerOnPress(oFF.AuGdsLambdaListener.create( function(){
		oFF.AuGdsQdInteractiveTableContextActionsHelper.moveToAxis(this.m_queryManager, this.m_interactiveTable.getDimensionsAllSelectedRemapped(oFF.AxisType.ROWS), oFF.AxisType.ROWS);
		this.m_interactiveTable.updateTable();
	}.bind(this)));
	this.m_toolbarTableRowBtn.setEnabled(false);
	this.addToolbarItem(this.m_toolbarTableRowBtn);
	this.m_toolbarTableFreeBtn = this.getGenesis().newControl(oFF.UiType.BUTTON);
	this.m_toolbarTableFreeBtn.setName(oFF.AuGdsQueryDesignerDocument.QUICK_ACTION_TOOLBAR_FREE);
	this.m_toolbarTableFreeBtn.setTooltip("Remove from axis");
	this.m_toolbarTableFreeBtn.setIcon("delete");
	this.m_toolbarTableFreeBtn.registerOnPress(oFF.AuGdsLambdaListener.create( function(){
		oFF.AuGdsQdInteractiveTableContextActionsHelper.moveToAxis(this.m_queryManager, this.m_interactiveTable.getDimensionsAllSelectedRemapped(oFF.AxisType.FREE), oFF.AxisType.FREE);
		this.m_interactiveTable.updateTable();
	}.bind(this)));
	this.m_toolbarTableFreeBtn.setEnabled(false);
	this.addToolbarItem(this.m_toolbarTableFreeBtn);
	this.addToolbarSectionSeparator();
	this.m_toolbarClearFilterBtn = this.getGenesis().newControl(oFF.UiType.BUTTON);
	this.m_toolbarClearFilterBtn.setName(oFF.AuGdsQueryDesignerDocument.QUICK_ACTION_TOOLBAR_FILTER_CLEAR);
	this.m_toolbarClearFilterBtn.setTooltip("Clear filter");
	this.m_toolbarClearFilterBtn.setIcon("clear-filter");
	this.m_toolbarClearFilterBtn.registerOnPress(oFF.AuGdsLambdaListener.create( function(){
		oFF.AuGdsQdInteractiveTableContextActionsHelper.clearFilter(this.m_queryManager, this.m_interactiveTable.getSingleSelectedDimension());
		this.m_interactiveTable.updateTable();
	}.bind(this)));
	this.m_toolbarClearFilterBtn.setEnabled(false);
	this.addToolbarItem(this.m_toolbarClearFilterBtn);
	this.m_toolbarAddFilterBtn = this.getGenesis().newControl(oFF.UiType.BUTTON);
	this.m_toolbarAddFilterBtn.setName(oFF.AuGdsQueryDesignerDocument.QUICK_ACTION_TOOLBAR_FILTER_ADD);
	this.m_toolbarAddFilterBtn.setTooltip("Add filter");
	this.m_toolbarAddFilterBtn.setIcon("add-filter");
	this.m_toolbarAddFilterBtn.registerOnPress(oFF.AuGdsLambdaListener.create( function(){
		oFF.AuGdsQdInteractiveTableContextActionsHelper.openFilterDialog(this.getApplication(), this.m_queryManager, this.m_interactiveTable.getSingleSelectedDimension(),  function(){
			this.m_interactiveTable.updateTable();
		}.bind(this));
	}.bind(this)));
	this.m_toolbarAddFilterBtn.setEnabled(false);
	this.addToolbarItem(this.m_toolbarAddFilterBtn);
	this.m_toolbarFilterSelectionBtn = this.getGenesis().newControl(oFF.UiType.BUTTON);
	this.m_toolbarFilterSelectionBtn.setName(oFF.AuGdsQueryDesignerDocument.QUICK_ACTION_TOOLBAR_FILTER_SELECTION);
	this.m_toolbarFilterSelectionBtn.setTooltip("Filter selection");
	this.m_toolbarFilterSelectionBtn.setIcon("filter");
	this.m_toolbarFilterSelectionBtn.registerOnPress(oFF.AuGdsLambdaListener.create( function(){
		oFF.AuGdsQdInteractiveTableContextActionsHelper.filterOnSelection(this.m_queryManager, this.m_interactiveTable.getSelectedTupleElements().getValuesAsReadOnlyList());
		this.m_interactiveTable.updateTable();
	}.bind(this)));
	this.m_toolbarFilterSelectionBtn.setEnabled(false);
	this.addToolbarItem(this.m_toolbarFilterSelectionBtn);
	this.addToolbarSectionSeparator();
	this.m_toolbarDimensionSettingsBtn = this.getGenesis().newControl(oFF.UiType.BUTTON);
	this.m_toolbarDimensionSettingsBtn.setName(oFF.AuGdsQueryDesignerDocument.QUICK_ACTION_TOOLBAR_DIMENSION);
	this.m_toolbarDimensionSettingsBtn.setTooltip("Dimension settings ...");
	this.m_toolbarDimensionSettingsBtn.setIcon("dimension");
	this.m_toolbarDimensionSettingsBtn.registerOnPress(oFF.AuGdsLambdaListener.create( function(){
		var dimension = this.m_interactiveTable.getSingleSelectedDimension();
		oFF.DdEntryPoint.createEntryPoint(this.m_interactiveTable.getApplication()).openDimensionDialog(oFF.XStringUtils.concatenate3(dimension.getName(), "/", dimension.getText()), dimension, oFF.AuGdsLambdaDialogCloseListener.create( function(){
			this.m_interactiveTable.updateTable();
		}.bind(this), null));
	}.bind(this)));
	this.m_toolbarDimensionSettingsBtn.setEnabled(false);
	this.addToolbarItem(this.m_toolbarDimensionSettingsBtn);
	this.addToolbarSectionSeparator();
	this.m_pauseUpdatesToggleBtn = this.getGenesis().newControl(oFF.UiType.TOGGLE_BUTTON);
	this.m_pauseUpdatesToggleBtn.setName(oFF.AuGdsQueryDesignerDocument.QUICK_ACTION_TOOLBAR_PAUSE_UPDATES);
	this.m_pauseUpdatesToggleBtn.setTooltip("Pause updates");
	this.m_pauseUpdatesToggleBtn.setIcon("pause");
	this.m_pauseUpdatesToggleBtn.registerOnPress(this);
	this.m_pauseUpdatesToggleBtn.setEnabled(false);
	this.addToolbarItem(this.m_pauseUpdatesToggleBtn);
	this.m_toolbarDesignerPanelToggleBtn = this.getGenesis().newControl(oFF.UiType.TOGGLE_BUTTON);
	this.m_toolbarDesignerPanelToggleBtn.setName(oFF.AuGdsQueryDesignerDocument.QUICK_ACTION_TOOLBAR_SHOW_DESIGNER);
	this.m_toolbarDesignerPanelToggleBtn.setTooltip("Show the designer panel");
	this.m_toolbarDesignerPanelToggleBtn.setText("Designer");
	this.m_toolbarDesignerPanelToggleBtn.setIcon("wrench");
	this.m_toolbarDesignerPanelToggleBtn.registerOnPress(this);
	this.m_toolbarDesignerPanelToggleBtn.setMargin(oFF.UiCssBoxEdges.create("0px 0px 0px auto"));
	this.m_toolbarDesignerPanelToggleBtn.setVisible(false);
	this.addToolbarItem(this.m_toolbarDesignerPanelToggleBtn);
};
oFF.AuGdsQueryDesignerDocument.prototype.setupQueryManager = function()
{
	this.m_messageManager = oFF.MessageManagerSimple.createMessageManager();
	if (oFF.XStringUtils.isNullOrEmpty(this.m_system) || oFF.XStringUtils.isNullOrEmpty(this.m_dataSource))
	{
		this.setStatusError("Please specify a data source!");
		return;
	}
	this.setContentBusy("Loading query...");
	this.onBackendRequestStarted();
	var serviceConfig = oFF.QueryServiceConfig.createWithDataSourceName(this.getApplication(), this.m_system, this.m_dataSource);
	serviceConfig.processQueryManagerCreation(oFF.SyncType.NON_BLOCKING, this, null);
};
oFF.AuGdsQueryDesignerDocument.prototype.buildUi = function(genesis)
{
	oFF.AuGdsDfDocument.prototype.buildUi.call( this , genesis);
	this.m_contentLayout = genesis.newControl(oFF.UiType.FLEX_LAYOUT);
	this.m_contentLayout.setDirection(oFF.UiFlexDirection.ROW);
	this.m_contentLayout.useMaxSpace();
	genesis.setRoot(this.m_contentLayout);
};
oFF.AuGdsQueryDesignerDocument.prototype.executeUndo = function()
{
	if (oFF.notNull(this.m_interactiveTable))
	{
		this.m_interactiveTable.executeUndo();
	}
};
oFF.AuGdsQueryDesignerDocument.prototype.executeRedo = function()
{
	if (oFF.notNull(this.m_interactiveTable))
	{
		this.m_interactiveTable.executeRedo();
	}
};
oFF.AuGdsQueryDesignerDocument.prototype.getSaveData = function()
{
	var queryDesignerJson = null;
	if (oFF.notNull(this.m_queryManager))
	{
		var inaRepoJson = this.m_queryManager.getQueryModel().serializeToElement(oFF.QModelFormat.INA_REPOSITORY);
		var tableConfigJson = oFF.notNull(this.m_interactiveTable) ? this.m_interactiveTable.getTableConfigAsStructure() : null;
		queryDesignerJson = oFF.PrStructure.create();
		queryDesignerJson.putString(oFF.AuGdsContants.GDF_FILE_DOC_TYPE, oFF.AuGdsContants.GDF_DOC_TYPE_QUERY_DESIGNER);
		queryDesignerJson.putString(oFF.AuGdsContants.GDF_FILE_DOC_NAME, this.getDocumentName());
		queryDesignerJson.putString(oFF.AuGdsQueryDesignerDocument.GDF_QD_FILE_SYSTEM_KEY, this.m_system);
		queryDesignerJson.putString(oFF.AuGdsQueryDesignerDocument.GDF_QD_FILE_DATA_SOURCE_KEY, this.m_dataSource);
		queryDesignerJson.put(oFF.AuGdsQueryDesignerDocument.GDF_QD_FILE_INA_REPO_KEY, inaRepoJson);
		queryDesignerJson.put(oFF.AuGdsQueryDesignerDocument.GDF_QD_FILE_TABLE_CFG, tableConfigJson);
	}
	return queryDesignerJson;
};
oFF.AuGdsQueryDesignerDocument.prototype.hasSaveData = function()
{
	return oFF.notNull(this.m_queryManager);
};
oFF.AuGdsQueryDesignerDocument.prototype.setFile = function(file)
{
	oFF.AuGdsDfDocument.prototype.setFile.call( this , file);
};
oFF.AuGdsQueryDesignerDocument.prototype.loadByJsonData = function(jsonData)
{
	this.loadQueryDesignerDocFromJson(null, jsonData);
};
oFF.AuGdsQueryDesignerDocument.prototype.loadFromFile = function(file)
{
	if (oFF.notNull(file))
	{
		if (file.getFileContent() !== null)
		{
			var jsonObj = this.getController().getJsonObjFromLoadedFileContent(file.getFileContent());
			if (oFF.notNull(jsonObj))
			{
				this.loadQueryDesignerDocFromJson(file, jsonObj);
			}
		}
		else
		{
			file.processLoad(oFF.SyncType.NON_BLOCKING, this, null, oFF.CompressionType.NONE);
		}
	}
};
oFF.AuGdsQueryDesignerDocument.prototype.notifyBecameVisible = function()
{
	if (this.hasFile())
	{
		this.getController().updateFileArgument(this.getFile().getVfsUri().getPath());
	}
	else if (oFF.XStringUtils.isNotNullAndNotEmpty(this.m_system) && oFF.XStringUtils.isNotNullAndNotEmpty(this.m_dataSource))
	{
		this.getController().updateSystemDatasourceArguments(this.m_system, this.m_dataSource);
	}
	else
	{
		this.getController().clearAllArguments();
	}
};
oFF.AuGdsQueryDesignerDocument.prototype.notifyEnteredBackground = function() {};
oFF.AuGdsQueryDesignerDocument.prototype.canPresentPreferences = function()
{
	return oFF.notNull(this.m_queryManager);
};
oFF.AuGdsQueryDesignerDocument.prototype.presentPreferences = function()
{
	var tableTitle = oFF.notNull(this.m_interactiveTable) ? this.m_interactiveTable.getTitle() : null;
	var formPopup = oFF.UiFormPopup.create(this.getGenesis(), "Query Designer Preferences", this);
	formPopup.setSubmitButtonText("Save");
	formPopup.setSubmitButtonIcon("save");
	formPopup.addInput(oFF.AuGdsQueryDesignerDocument.GDS_QD_PREFS_DOC_NAME_KEY, this.getDocumentName(), "Document name", false, "", null);
	formPopup.addInput(oFF.AuGdsQueryDesignerDocument.GDS_QD_PREFS_TABLE_TITLE_KEY, tableTitle, "Table title", false, "", null);
	formPopup.addInput(oFF.AuGdsQueryDesignerDocument.GDS_QD_PREFS_ROWS_PAGE_SIZE, "50", "Page size for rows", false, "", oFF.UiInputType.NUMBER).setEditable(false);
	formPopup.addInput(oFF.AuGdsQueryDesignerDocument.GDS_QD_PREFS_COLUMNS_PAGE_SIZE, "30", "Page size for columns", false, "", oFF.UiInputType.NUMBER).setEditable(false);
	formPopup.open();
};
oFF.AuGdsQueryDesignerDocument.prototype.setTitle = function(title)
{
	oFF.AuGdsDfDocument.prototype.setTitle.call( this , title);
	if (oFF.XStringUtils.isNullOrEmpty(title))
	{
		if (this.hasFile())
		{
			this.setTitle(this.getFile().getVfsUri().getFileName());
		}
		else if (oFF.XStringUtils.isNotNullAndNotEmpty(this.m_system) && oFF.XStringUtils.isNotNullAndNotEmpty(this.m_dataSource))
		{
			this.setTitle(oFF.XStringUtils.concatenate3(this.m_system, " - ", this.m_dataSource));
		}
		else
		{
			this.setTitle("Unnamed");
		}
	}
};
oFF.AuGdsQueryDesignerDocument.prototype.getSaveFileName = function()
{
	var filename = oFF.XStringUtils.concatenate2("unnamned.", oFF.AuGdsContants.GDF_FILE_EXTENSION);
	if (this.hasFile())
	{
		filename = this.getFile().getVfsUri().getFileName();
	}
	else if (oFF.notNull(this.m_queryManager))
	{
		filename = oFF.XStringUtils.concatenate3(this.m_system, "_", this.m_queryManager.getQueryModel().getDataSource().getName());
		filename = oFF.XString.toLowerCase(filename);
		filename = oFF.XStringUtils.concatenate3(filename, ".", oFF.AuGdsContants.GDF_FILE_EXTENSION);
	}
	return filename;
};
oFF.AuGdsQueryDesignerDocument.prototype.onFileSavedSuccessfully = function(file)
{
	oFF.AuGdsDfDocument.prototype.onFileSavedSuccessfully.call( this , file);
	if (oFF.XStringUtils.isNullOrEmpty(this.getDocumentName()))
	{
		this.setTitle(file.getVfsUri().getFileName());
	}
	this.addRecentFileEntry(file);
};
oFF.AuGdsQueryDesignerDocument.prototype.loadFromDataSource = function(system, dataSource)
{
	this.m_system = system;
	this.m_dataSource = dataSource;
	if (oFF.XStringUtils.isNotNullAndNotEmpty(this.m_system) && oFF.XStringUtils.isNotNullAndNotEmpty(this.m_dataSource))
	{
		this.updateQuickActionToolbar();
		this.setupQueryManager();
		this.updateTable();
	}
};
oFF.AuGdsQueryDesignerDocument.prototype.initInitialView = function()
{
	if (this.hasFile())
	{
		this.loadFromFile(this.getFile());
	}
	else if (oFF.XStringUtils.isNotNullAndNotEmpty(this.m_system) && oFF.XStringUtils.isNotNullAndNotEmpty(this.m_dataSource))
	{
		this.setTitle(oFF.XStringUtils.concatenate3(this.m_system, " - ", this.m_dataSource));
		this.setIcon("table-view");
		this.markDirty();
		this.setupQueryManager();
		this.setStatusError(this.m_messageManager.getSummary());
		this.updateTable();
	}
	else
	{
		this.showHomeView();
	}
};
oFF.AuGdsQueryDesignerDocument.prototype.showHomeView = function()
{
	this.m_contentLayout.clearItems();
	this.m_filterPanel = oFF.XObjectExt.release(this.m_filterPanel);
	this.m_navigationPanel = oFF.XObjectExt.release(this.m_navigationPanel);
	this.m_builderPanel = oFF.XObjectExt.release(this.m_builderPanel);
	this.m_interactiveTable = oFF.XObjectExt.release(this.m_interactiveTable);
	this.m_queryManager = oFF.XObjectExt.release(this.m_queryManager);
	this.m_system = null;
	this.m_dataSource = null;
	this.m_inaRepoJson = null;
	this.m_tableConfigJson = null;
	if (oFF.isNull(this.m_homeView))
	{
		this.m_homeView = oFF.AuGdsQdHomeView.create(this.getGenesis(), this);
		this.reloadRecentFilesList();
	}
	this.m_contentLayout.addItem(this.m_homeView.getView());
	this.setTitle("Home");
	this.setIcon("home");
	this.setStatusInfo("Create a new document from a query or open an existing one...");
	this.updateQuickActionToolbar();
};
oFF.AuGdsQueryDesignerDocument.prototype.setContentBusy = function(text)
{
	this.resetStatusMessage();
	var contentActivityIndicator = this.m_contentLayout.getItemByName(oFF.AuGdsQueryDesignerDocument.CONTENT_ACTIVITY_INDICATOR);
	if (oFF.isNull(contentActivityIndicator))
	{
		this.m_contentLayout.clearItems();
		if (oFF.notNull(this.m_interactiveTable))
		{
			this.m_interactiveTable = oFF.XObjectExt.release(this.m_interactiveTable);
		}
		contentActivityIndicator = this.m_contentLayout.addNewItemOfType(oFF.UiType.ACTIVITY_INDICATOR);
		contentActivityIndicator.useMaxSpace();
		contentActivityIndicator.setIconSize(oFF.UiCssLength.create("1.5rem"));
	}
	contentActivityIndicator.setText(text);
};
oFF.AuGdsQueryDesignerDocument.prototype.setCriticalError = function(text)
{
	this.m_contentLayout.clearItems();
	if (oFF.notNull(this.m_interactiveTable))
	{
		this.m_interactiveTable = oFF.XObjectExt.release(this.m_interactiveTable);
	}
	this.m_contentLayout.addItem(this.getController().getCriticalErrorLabelWithText(text));
	this.setStatusError("Error");
};
oFF.AuGdsQueryDesignerDocument.prototype.updateTable = function()
{
	if (oFF.isNull(this.m_interactiveTable))
	{
		return;
	}
	if (oFF.isNull(this.m_queryManager))
	{
		this.setStatusError("No QueryManager.");
		return;
	}
	var activeResultSet = this.m_queryManager.getActiveResultSetContainer();
	if (oFF.isNull(activeResultSet))
	{
		this.setStatusError("Cannot fetch results.");
		return;
	}
	if (activeResultSet.hasErrors())
	{
		this.setStatusError(activeResultSet.getSummary());
		return;
	}
	this.m_interactiveTable.updateTable();
};
oFF.AuGdsQueryDesignerDocument.prototype.updateViews = function()
{
	if (oFF.isNull(this.m_interactiveTable))
	{
		this.m_contentLayout.clearItems();
		this.m_interactiveTable = oFF.AuGdsQdInteractiveTableView.create(this.getApplication(), this.m_queryManager, this.getGenesis(), this);
		this.m_interactiveTable.getView().setWidth(oFF.UiCssLength.create("100%"));
		this.m_interactiveTable.getView().setFlex("3 1 60%");
		this.m_interactiveTable.registerOnSelectionChange(this);
		this.m_contentLayout.addItem(this.m_interactiveTable.getView());
		if (oFF.notNull(this.m_tableConfigJson))
		{
			this.m_interactiveTable.setTableConfigFromStructure(this.m_tableConfigJson);
			this.m_tableConfigJson = null;
		}
	}
	else
	{
		this.m_interactiveTable.setQueryManager(this.m_queryManager);
	}
	if (oFF.notNull(this.m_filterPanel))
	{
		this.m_filterPanel.setQueryManager(this.m_queryManager);
	}
	if (oFF.notNull(this.m_navigationPanel))
	{
		this.m_navigationPanel.setQueryManager(this.m_queryManager);
	}
	if (oFF.notNull(this.m_builderPanel))
	{
		this.m_builderPanel.setQueryManager(this.m_queryManager);
	}
	if (this.m_autoOpenFilterPanel)
	{
		this.toggleFilterPanel();
	}
	if (this.m_autoOpenDesignerPanels)
	{
		this.toggleDesignerPanels();
	}
	var hasVariables = this.m_queryManager.hasInputEnabledVariables();
	this.m_variableDialog = oFF.XObjectExt.release(this.m_variableDialog);
	if (hasVariables && this.m_queryManager.isSubmitNeeded())
	{
		this.m_variableDialog = oFF.VdUqmEntryPoint.createEntryPoint("Variable Dialog", this.m_queryManager, this);
		this.m_variableDialog.open();
		this.setStatusWarning("Please select mandatory variables!");
		return;
	}
	this.updateTable();
	this.notifySaveStateChanged();
};
oFF.AuGdsQueryDesignerDocument.prototype.loadQueryDesignerDocFromJson = function(file, gdfJson)
{
	if (this.isValidGdsQueryDesignerDocument(gdfJson))
	{
		if (oFF.notNull(file))
		{
			this.setFile(file);
			this.setTitle(file.getName());
			this.addRecentFileEntry(file);
		}
		else
		{
			this.setTitle(null);
		}
		this.setIcon("table-view");
		this.markPristine();
		var documentName = gdfJson.getStringByKey(oFF.AuGdsContants.GDF_FILE_DOC_NAME);
		this.m_system = gdfJson.getStringByKey(oFF.AuGdsQueryDesignerDocument.GDF_QD_FILE_SYSTEM_KEY);
		this.m_dataSource = gdfJson.getStringByKey(oFF.AuGdsQueryDesignerDocument.GDF_QD_FILE_DATA_SOURCE_KEY);
		this.m_inaRepoJson = this.extracJsonPropFromFileJson(gdfJson, oFF.AuGdsQueryDesignerDocument.GDF_QD_FILE_INA_REPO_KEY, "Failed to parse ina repository from file! The file might be damaged!");
		this.m_tableConfigJson = this.extracJsonPropFromFileJson(gdfJson, oFF.AuGdsQueryDesignerDocument.GDF_QD_FILE_TABLE_CFG, "Failed to parse table config from file! The file might be damaged!");
		if (oFF.XStringUtils.isNotNullAndNotEmpty(documentName))
		{
			this.setDocumentName(documentName);
		}
		this.setupQueryManager();
	}
	else
	{
		this.getGenesis().showErrorToast("Not a Galaxy Data Studio query designer file!");
	}
};
oFF.AuGdsQueryDesignerDocument.prototype.extracJsonPropFromFileJson = function(gdfJson, key, warningMsg)
{
	if (gdfJson.containsKey(key))
	{
		if (gdfJson.getElementTypeByKey(key) === oFF.PrElementType.STRUCTURE)
		{
			return gdfJson.getStructureByKey(key);
		}
		else
		{
			var tmpInaRepoStr = gdfJson.getStringByKey(key);
			var jsonParser = oFF.JsonParserFactory.newInstance();
			var tmpInaRepoJson = jsonParser.parse(tmpInaRepoStr);
			if (jsonParser.hasErrors())
			{
				this.getGenesis().showWarningToast(warningMsg);
			}
			oFF.XObjectExt.release(jsonParser);
			if (oFF.notNull(tmpInaRepoJson) && tmpInaRepoJson.isStructure())
			{
				return tmpInaRepoJson.asStructure();
			}
		}
	}
	return null;
};
oFF.AuGdsQueryDesignerDocument.prototype.isValidGdsQueryDesignerDocument = function(docJson)
{
	if (oFF.isNull(docJson))
	{
		return false;
	}
	if (!docJson.containsKey(oFF.AuGdsContants.GDF_FILE_DOC_TYPE))
	{
		return false;
	}
	if (!oFF.XString.isEqual(docJson.getStringByKey(oFF.AuGdsContants.GDF_FILE_DOC_TYPE), oFF.AuGdsContants.GDF_DOC_TYPE_QUERY_DESIGNER))
	{
		return false;
	}
	if (!docJson.containsKey(oFF.AuGdsQueryDesignerDocument.GDF_QD_FILE_SYSTEM_KEY))
	{
		return false;
	}
	if (!docJson.containsKey(oFF.AuGdsQueryDesignerDocument.GDF_QD_FILE_DATA_SOURCE_KEY))
	{
		return false;
	}
	return true;
};
oFF.AuGdsQueryDesignerDocument.prototype.initRecentFiles = function()
{
	if (oFF.notNull(this.m_recentFiles))
	{
		this.m_recentFiles.clear();
		this.m_recentFiles = oFF.XObjectExt.release(this.m_recentFiles);
	}
	var recentItemsStr = this.getUserSettings().getStringByKeyExt(oFF.AuGdsQueryDesignerDocument.GDS_QD_RECENT_FILES_KEY, "");
	if (oFF.XStringUtils.isNotNullAndNotEmpty(recentItemsStr))
	{
		this.m_recentFiles = oFF.XStringTokenizer.splitString(recentItemsStr, oFF.AuGdsQueryDesignerDocument.GDS_QD_RECENT_FILES_SEPARATOR);
	}
	else
	{
		this.m_recentFiles = oFF.XListOfString.create();
	}
};
oFF.AuGdsQueryDesignerDocument.prototype.reloadRecentFilesList = function()
{
	if (oFF.notNull(this.m_homeView) && oFF.notNull(this.m_recentFiles))
	{
		this.m_homeView.updateRecentFilesList(this.m_recentFiles);
	}
};
oFF.AuGdsQueryDesignerDocument.prototype.saveRecentFilesToUserSettings = function()
{
	if (oFF.notNull(this.m_recentFiles))
	{
		var recentItemsStr = "";
		for (var a = 0; a < this.m_recentFiles.size(); a++)
		{
			var tmpRecentStr = this.m_recentFiles.get(a);
			recentItemsStr = oFF.XStringUtils.concatenate2(recentItemsStr, tmpRecentStr);
			if (a !== this.m_recentFiles.size() - 1)
			{
				recentItemsStr = oFF.XStringUtils.concatenate2(recentItemsStr, oFF.AuGdsQueryDesignerDocument.GDS_QD_RECENT_FILES_SEPARATOR);
			}
		}
		this.getProcess().getUserManager().getUserSettings().putString(oFF.AuGdsQueryDesignerDocument.GDS_QD_RECENT_FILES_KEY, recentItemsStr);
		this.initRecentFiles();
	}
};
oFF.AuGdsQueryDesignerDocument.prototype.addRecentFileEntry = function(file)
{
	if (oFF.notNull(file) && oFF.notNull(this.m_recentFiles))
	{
		var filePathStr = file.getVfsUri().getUrl();
		this.m_recentFiles.removeElement(filePathStr);
		this.m_recentFiles.insert(0, filePathStr);
		this.reloadRecentFilesList();
		this.saveRecentFilesToUserSettings();
	}
};
oFF.AuGdsQueryDesignerDocument.prototype.removeRecentFileEntry = function(filePathStr)
{
	if (oFF.notNull(this.m_recentFiles))
	{
		this.m_recentFiles.removeElement(filePathStr);
		this.reloadRecentFilesList();
		this.saveRecentFilesToUserSettings();
	}
};
oFF.AuGdsQueryDesignerDocument.prototype.clearRecentFiles = function()
{
	this.getProcess().getUserManager().getUserSettings().removeKey(oFF.AuGdsQueryDesignerDocument.GDS_QD_RECENT_FILES_KEY);
	this.m_recentFiles.clear();
	if (oFF.notNull(this.m_homeView))
	{
		this.m_homeView.updateRecentFilesList(null);
	}
	this.getGenesis().showSuccessToast("Recent files successfully cleared!");
};
oFF.AuGdsQueryDesignerDocument.prototype.showStatusTableInfo = function()
{
	if (oFF.notNull(this.m_interactiveTable))
	{
		var numOfRows = this.m_interactiveTable.getRowsCountTotal();
		var numOfColumns = this.m_interactiveTable.getColumnsCountTotal();
		var totalCells = numOfColumns * numOfRows;
		var numOfLoadedRows = this.m_interactiveTable.getRowsCountLoaded();
		var numOfLoadedColumns = this.m_interactiveTable.getColumnsCountLoaded();
		var tableInfoStr = oFF.XStringUtils.concatenate2("Total rows: ", oFF.XInteger.convertToString(numOfRows));
		tableInfoStr = oFF.XStringUtils.concatenate3(tableInfoStr, " | Total columns: ", oFF.XInteger.convertToString(numOfColumns));
		tableInfoStr = oFF.XStringUtils.concatenate3(tableInfoStr, " | Total cells: ", oFF.XInteger.convertToString(totalCells));
		tableInfoStr = oFF.XStringUtils.concatenate3(tableInfoStr, " | Loaded rows: ", oFF.XInteger.convertToString(numOfLoadedRows));
		tableInfoStr = oFF.XStringUtils.concatenate3(tableInfoStr, " | Loaded columns: ", oFF.XInteger.convertToString(numOfLoadedColumns));
		this.setStatusInfo(tableInfoStr);
	}
	else
	{
		this.resetStatusMessage();
	}
};
oFF.AuGdsQueryDesignerDocument.prototype.createPanelsMenuBarMenu = function(fileBtn)
{
	var viewToolbarMenu = this.getGenesis().newControl(oFF.UiType.MENU);
	viewToolbarMenu.setName(oFF.AuGdsQueryDesignerDocument.MENU_BAR_VIEW_MENU);
	viewToolbarMenu.addNewItem().setName(oFF.AuGdsQueryDesignerDocument.MENU_BAR_VIEW_MENU_FILTER_PANEL).setText("Show Filter").setIcon(oFF.notNull(this.m_filterPanel) && this.m_filterPanel.getView().getParent() === this.m_contentLayout ? "accept" : null).registerOnPress(this).setEnabled(oFF.notNull(this.m_queryManager));
	viewToolbarMenu.addNewItem().setName(oFF.AuGdsQueryDesignerDocument.MENU_BAR_VIEW_MENU_DESIGNER_PANELS).setText("Show Designer").setIcon(oFF.notNull(this.m_builderPanel) && this.m_builderPanel.getView().getParent() === this.m_contentLayout ? "accept" : null).registerOnPress(this).setEnabled(oFF.notNull(this.m_queryManager));
	viewToolbarMenu.openAt(fileBtn);
};
oFF.AuGdsQueryDesignerDocument.prototype.createDataSourceMenuBarMenu = function(fileBtn)
{
	var dataSourceToolbarMenu = this.getGenesis().newControl(oFF.UiType.MENU);
	dataSourceToolbarMenu.setName(oFF.AuGdsQueryDesignerDocument.MENU_BAR_DATA_SOURCE_MENU);
	dataSourceToolbarMenu.addNewItem().setName(oFF.AuGdsQueryDesignerDocument.MENU_BAR_DATA_SOURCE_MENU_CHANGE_DATA_SOURCE).setText("Change Data Source...").setIcon("database").registerOnPress(this).setEnabled(oFF.notNull(this.m_queryManager));
	dataSourceToolbarMenu.addNewItem().setName(oFF.AuGdsQueryDesignerDocument.MENU_BAR_DATA_SOURCE_MENU_DATA_SOURCE_INFO).setText("Data Source Info...").setIcon("information").registerOnPress(this).setEnabled(oFF.notNull(this.m_queryManager));
	dataSourceToolbarMenu.addNewItem().setName(oFF.AuGdsQueryDesignerDocument.MENU_BAR_DATA_SOURCE_MENU_RESET).setText("Reset").setIcon("reset").registerOnPress(this).setEnabled(oFF.notNull(this.m_queryManager));
	dataSourceToolbarMenu.addNewItem().setName(oFF.AuGdsQueryDesignerDocument.MENU_BAR_DATA_SOURCE_MENU_REFRESH).setText("Refresh").setIcon("refresh").registerOnPress(this).setSectionStart(true).setEnabled(oFF.notNull(this.m_queryManager));
	dataSourceToolbarMenu.addNewItem().setName(oFF.AuGdsQueryDesignerDocument.MENU_BAR_DATA_SOURCE_MENU_PAUSE_UPDATES).setText("Pause updates").setIcon(oFF.notNull(this.m_interactiveTable) && this.m_interactiveTable.isPauseUpdates() ? "accept" : "").registerOnPress(this).setEnabled(oFF.notNull(this.m_queryManager));
	dataSourceToolbarMenu.addNewItem().setName(oFF.AuGdsQueryDesignerDocument.MENU_BAR_DATA_SOURCE_MENU_VARIABLES).setText("Set Variables...").setIcon("customize").registerOnPress(this).setSectionStart(true).setEnabled(oFF.notNull(this.m_queryManager) && this.m_queryManager.hasInputEnabledVariables());
	dataSourceToolbarMenu.openAt(fileBtn);
};
oFF.AuGdsQueryDesignerDocument.prototype.updateQuickActionToolbar = function()
{
	if (oFF.notNull(this.m_toolbarResetBtn))
	{
		this.m_toolbarResetBtn.setEnabled(oFF.notNull(this.m_queryManager));
	}
	if (oFF.notNull(this.m_toolbarRefreshBtn))
	{
		this.m_toolbarRefreshBtn.setEnabled(oFF.notNull(this.m_queryManager));
	}
	if (oFF.notNull(this.m_toolbarVariablesBtn))
	{
		this.m_toolbarVariablesBtn.setEnabled(oFF.notNull(this.m_queryManager) && this.m_queryManager.hasInputEnabledVariables());
	}
	if (oFF.notNull(this.m_toolbarLayoutBtn))
	{
		this.m_toolbarLayoutBtn.setEnabled(oFF.notNull(this.m_queryManager));
	}
	if (oFF.notNull(this.m_toolbarUdhRowBtn))
	{
		this.m_toolbarUdhRowBtn.setEnabled(oFF.notNull(this.m_queryManager) && this.m_queryManager.getModelCapabilities().supportsUniversalDisplayHierarchies() && this.m_queryManager.getQueryModel().getRowsAxis().getDimensions().size() > 1);
		this.m_toolbarUdhRowBtn.setPressed(oFF.notNull(this.m_queryManager) && this.m_queryManager.getModelCapabilities().supportsUniversalDisplayHierarchies() && this.m_queryManager.getQueryModel().getUniversalDisplayHierarchies().getByAxisType(oFF.AxisType.ROWS).isActive());
	}
	var axis = null;
	var lastSelected = null;
	var firstElement = null;
	var lastElement = null;
	if (oFF.notNull(this.m_toolbarMoveUpBtn) && oFF.notNull(this.m_toolbarMoveDownBtn) && oFF.notNull(this.m_interactiveTable) && oFF.notNull(this.m_queryManager))
	{
		lastSelected = this.m_interactiveTable.getColumnDimensionsLastSelected();
		if (oFF.XCollectionUtils.hasElements(lastSelected))
		{
			firstElement = this.m_queryManager.getQueryModel().getDimensionByName(lastSelected.get(0).getName());
			lastElement = this.m_queryManager.getQueryModel().getDimensionByName(lastSelected.get(lastSelected.size() - 1).getName());
			axis = firstElement.getAxis();
		}
		this.m_toolbarMoveUpBtn.setEnabled(oFF.notNull(this.m_queryManager) && !this.m_interactiveTable.isIsMultiSelectWithGaps() && !this.m_interactiveTable.isOnEmptyHeaderSection() && oFF.notNull(axis) && axis.getIndex(firstElement) > 0);
		this.m_toolbarMoveDownBtn.setEnabled(oFF.notNull(this.m_queryManager) && !this.m_interactiveTable.isIsMultiSelectWithGaps() && !this.m_interactiveTable.isOnEmptyHeaderSection() && oFF.notNull(axis) && axis.getIndex(lastElement) < axis.size() - 1);
	}
	if (oFF.notNull(this.m_toolbarMoveLeftBtn) && oFF.notNull(this.m_toolbarMoveRightBtn) && oFF.notNull(this.m_interactiveTable) && oFF.notNull(this.m_queryManager))
	{
		axis = null;
		lastSelected = this.m_interactiveTable.getRowDimensionsLastSelected();
		if (oFF.XCollectionUtils.hasElements(lastSelected))
		{
			firstElement = this.m_queryManager.getQueryModel().getDimensionByName(lastSelected.get(0).getName());
			lastElement = this.m_queryManager.getQueryModel().getDimensionByName(lastSelected.get(lastSelected.size() - 1).getName());
			axis = firstElement.getAxis();
		}
		this.m_toolbarMoveLeftBtn.setEnabled(oFF.notNull(this.m_queryManager) && !this.m_interactiveTable.isIsMultiSelectWithGaps() && !this.m_interactiveTable.isOnEmptyHeaderSection() && !this.m_interactiveTable.isOnHeaderRows() && oFF.notNull(axis) && axis.getIndex(firstElement) > 0);
		this.m_toolbarMoveRightBtn.setEnabled(oFF.notNull(this.m_queryManager) && !this.m_interactiveTable.isIsMultiSelectWithGaps() && !this.m_interactiveTable.isOnEmptyHeaderSection() && !this.m_interactiveTable.isOnHeaderRows() && oFF.notNull(axis) && axis.getIndex(lastElement) < axis.size() - 1);
	}
	var remappedDims;
	if (oFF.notNull(this.m_toolbarTableColumnBtn) && oFF.notNull(this.m_interactiveTable) && oFF.notNull(this.m_queryManager))
	{
		remappedDims = this.m_interactiveTable.getDimensionsAllSelectedRemapped(oFF.AxisType.COLUMNS);
		this.m_toolbarTableColumnBtn.setEnabled(oFF.notNull(this.m_queryManager) && oFF.XCollectionUtils.hasElements(remappedDims) && !this.m_interactiveTable.isOnEmptyHeaderSection() && remappedDims.get(0).getAxisType() !== oFF.AxisType.COLUMNS);
	}
	if (oFF.notNull(this.m_toolbarTableRowBtn) && oFF.notNull(this.m_interactiveTable) && oFF.notNull(this.m_queryManager))
	{
		remappedDims = this.m_interactiveTable.getDimensionsAllSelectedRemapped(oFF.AxisType.ROWS);
		this.m_toolbarTableRowBtn.setEnabled(oFF.notNull(this.m_queryManager) && oFF.XCollectionUtils.hasElements(remappedDims) && !this.m_interactiveTable.isOnEmptyHeaderSection() && remappedDims.get(0).getAxisType() !== oFF.AxisType.ROWS);
	}
	if (oFF.notNull(this.m_toolbarTableFreeBtn))
	{
		this.m_toolbarTableFreeBtn.setEnabled(oFF.notNull(this.m_queryManager) && !this.m_interactiveTable.isOnEmptyHeaderSection() && oFF.XCollectionUtils.hasElements(this.m_interactiveTable.getDimensionsAllSelectedRemapped(oFF.AxisType.FREE)));
	}
	if (oFF.notNull(this.m_toolbarClearFilterBtn) && oFF.notNull(this.m_toolbarAddFilterBtn) && oFF.notNull(this.m_toolbarFilterSelectionBtn) && oFF.notNull(this.m_toolbarDimensionSettingsBtn) && oFF.notNull(this.m_interactiveTable) && oFF.notNull(this.m_queryManager))
	{
		var singleDimension = this.m_interactiveTable.getSingleSelectedDimension();
		this.m_toolbarClearFilterBtn.setEnabled(oFF.notNull(singleDimension) && !this.m_interactiveTable.isOnEmptyHeaderSection() && oFF.AuGdsQdInteractiveTableContextActionsHelper.hasFilterOnDimension(this.m_queryManager, singleDimension));
		this.m_toolbarAddFilterBtn.setEnabled(oFF.notNull(singleDimension) && !this.m_interactiveTable.isOnEmptyHeaderSection());
		this.m_toolbarFilterSelectionBtn.setEnabled(oFF.notNull(singleDimension) && !this.m_interactiveTable.isOnEmptyHeaderSection() && oFF.XCollectionUtils.hasElements(this.m_interactiveTable.getSelectedTupleElements()));
		this.m_toolbarDimensionSettingsBtn.setEnabled(oFF.notNull(singleDimension) && !this.m_interactiveTable.isOnEmptyHeaderSection());
	}
	if (oFF.notNull(this.m_pauseUpdatesToggleBtn))
	{
		this.m_pauseUpdatesToggleBtn.setEnabled(oFF.notNull(this.m_queryManager));
	}
	if (oFF.notNull(this.m_toolbarDesignerPanelToggleBtn))
	{
		this.m_toolbarDesignerPanelToggleBtn.setVisible(oFF.notNull(this.m_queryManager));
	}
};
oFF.AuGdsQueryDesignerDocument.prototype.showDataSourcePicker = function()
{
	var appStoreDlgManifest = oFF.ProgramRegistration.getProgramManifest(oFF.AuDatasourcePicker.DEFAULT_PROGRAM_NAME);
	var appStoreDlgStartCfg = oFF.ProgramStartCfg.create(this.getProcess(), appStoreDlgManifest.getName(), null, null);
	var tmpArgs = appStoreDlgStartCfg.getArguments();
	tmpArgs.putString(oFF.AuDatasourcePicker.PARAM_SYSTEM, this.m_system);
	tmpArgs.putXObject(oFF.AuDatasourcePicker.PARAM_LISTENER, this);
	tmpArgs.putXObject(oFF.AuDatasourcePicker.PARAM_APPLICATION, this.getApplication());
	appStoreDlgStartCfg.setParentProcess(this.getProcess());
	appStoreDlgStartCfg.setIsCreatingChildProcess(true);
	appStoreDlgStartCfg.processExecution(oFF.SyncType.NON_BLOCKING, null, null);
};
oFF.AuGdsQueryDesignerDocument.prototype.showDataSourceInfo = function()
{
	var dataSourceInfoFormPopup = oFF.UiFormPopup.create(this.getGenesis(), "Data Source Info", null);
	dataSourceInfoFormPopup.setReadOnly();
	dataSourceInfoFormPopup.setPopupState(oFF.UiValueState.INFORMATION);
	dataSourceInfoFormPopup.addInput(null, this.m_system, "System name", false, null, null);
	dataSourceInfoFormPopup.addInput(null, this.m_queryManager.getDataSource().getName(), "Model name", false, null, null);
	dataSourceInfoFormPopup.addSwitch(null, this.m_queryManager.hasVariables(), "Has variables?");
	dataSourceInfoFormPopup.open();
};
oFF.AuGdsQueryDesignerDocument.prototype.loadRecentFile = function(filePath)
{
	var tmpFile = this.getController().createFileByPath(filePath);
	if (oFF.notNull(tmpFile) && tmpFile.isExisting())
	{
		this.loadFromFile(tmpFile);
	}
	else
	{
		this.removeRecentFileEntry(filePath);
		this.getGenesis().showWarningToast(oFF.XStringUtils.concatenate3("File ", filePath, " does not exist!"));
	}
};
oFF.AuGdsQueryDesignerDocument.prototype.onResetDataSourcePressed = function()
{
	if (oFF.notNull(this.m_queryManager) && oFF.notNull(this.m_interactiveTable))
	{
		this.m_queryManager.getConvenienceCommands().resetToDefault();
		this.updateTable();
	}
};
oFF.AuGdsQueryDesignerDocument.prototype.refreshDataSource = function()
{
	if (oFF.notNull(this.m_queryManager) && oFF.notNull(this.m_interactiveTable))
	{
		this.m_queryManager.invalidateState();
		this.updateTable();
	}
};
oFF.AuGdsQueryDesignerDocument.prototype.onOpenVariableDialogPressed = function()
{
	this.m_variableDialog = oFF.XObjectExt.release(this.m_variableDialog);
	this.m_variableDialog = oFF.VdUqmEntryPoint.createEntryPoint("Variable Dialog", this.m_queryManager, this);
	this.m_variableDialog.open();
};
oFF.AuGdsQueryDesignerDocument.prototype.toggleFilterPanel = function()
{
	if (oFF.isNull(this.m_filterPanel))
	{
		this.m_filterPanel = oFF.AuGdsQdFilterPanel.createFilterPanel(this.getGenesis());
		this.m_filterPanel.setQueryManager(this.m_queryManager);
		this.m_filterPanel.addEditActionListener(this);
	}
	if (this.m_filterPanel.getView().getParent() !== null)
	{
		this.m_contentLayout.removeItem(this.m_filterPanel.getView());
		this.m_autoOpenFilterPanel = false;
	}
	else
	{
		this.m_contentLayout.addItem(this.m_filterPanel.getView());
		this.m_autoOpenFilterPanel = true;
	}
	this.getProcess().getUserManager().getUserSettings().putBoolean(oFF.AuGdsQueryDesignerDocument.GDS_QD_AUTO_OPEN_FILTER_PANEL_KEY, this.m_autoOpenFilterPanel);
};
oFF.AuGdsQueryDesignerDocument.prototype.toggleDesignerPanels = function()
{
	if (oFF.isNull(this.m_navigationPanel))
	{
		this.m_navigationPanel = oFF.AuGdsQdNavigationPanel.createNavPanel(this.getGenesis());
		this.m_navigationPanel.setQueryManager(this.m_queryManager);
		this.m_navigationPanel.addEditActionListener(this);
	}
	if (oFF.isNull(this.m_builderPanel))
	{
		this.m_builderPanel = oFF.AuGdsQdBuilderPanel.createBuilderPanel(this.getGenesis());
		this.m_builderPanel.setQueryManager(this.m_queryManager);
		this.m_builderPanel.addEditActionListener(this);
	}
	if (this.m_builderPanel.getView().getParent() !== null || this.m_navigationPanel.getView().getParent() !== null)
	{
		this.m_contentLayout.removeItem(this.m_navigationPanel.getView());
		this.m_contentLayout.removeItem(this.m_builderPanel.getView());
		this.m_autoOpenDesignerPanels = false;
	}
	else
	{
		this.m_contentLayout.addItem(this.m_navigationPanel.getView());
		this.m_contentLayout.addItem(this.m_builderPanel.getView());
		this.m_autoOpenDesignerPanels = true;
	}
	this.getProcess().getUserManager().getUserSettings().putBoolean(oFF.AuGdsQueryDesignerDocument.GDS_QD_AUTO_OPEN_NAVIGATION_PANEL_KEY, this.m_autoOpenDesignerPanels);
	if (oFF.notNull(this.m_toolbarDesignerPanelToggleBtn))
	{
		this.m_toolbarDesignerPanelToggleBtn.setPressed(this.m_autoOpenDesignerPanels);
	}
};
oFF.AuGdsQueryDesignerDocument.prototype.togglePauseUpdates = function()
{
	var returnValue = false;
	if (oFF.notNull(this.m_interactiveTable))
	{
		returnValue = this.m_interactiveTable.togglePauseUpdates();
	}
	this.m_pauseUpdatesToggleBtn.setPressed(returnValue);
	return returnValue;
};
oFF.AuGdsQueryDesignerDocument.prototype.onDatasourceSelected = function(dataSource)
{
	if (oFF.isNull(dataSource))
	{
		return;
	}
	if (oFF.notNull(this.m_interactiveTable))
	{
		this.m_interactiveTable.clearTable();
	}
	this.m_system = dataSource.getSystemName();
	this.m_dataSource = dataSource.getFullQualifiedName();
	this.setTitle(oFF.XStringUtils.concatenate3(this.m_system, " - ", dataSource.getName()));
	this.setIcon("table-view");
	this.markDirty();
	this.setupQueryManager();
	if (oFF.XStringUtils.isNotNullAndNotEmpty(this.m_system) && oFF.XStringUtils.isNotNullAndNotEmpty(this.m_dataSource))
	{
		this.getController().updateSystemDatasourceArguments(this.m_system, this.m_dataSource);
	}
};
oFF.AuGdsQueryDesignerDocument.prototype.onQueryManagerCreated = function(extResult, queryManager, customIdentifier)
{
	if (extResult.hasErrors())
	{
		this.m_messageManager.addAllMessages(extResult);
		this.setCriticalError(this.m_messageManager.getSummary());
		return;
	}
	this.m_queryManager = extResult.getData();
	this.m_queryManager.getTagging().put(oFF.QStateConstants.TAG_UNDO_INCLUDE, "true");
	this.m_queryManager.getApplication().getUndoManager().reset();
	this.m_queryManager.disableReturnedDataSelection(oFF.ReturnedDataSelection.CELL_EXPLAIN);
	if (oFF.notNull(this.m_inaRepoJson))
	{
		this.m_queryManager.getQueryModel().getVariableContainer().deserializeFromElementExt(oFF.QModelFormat.INA_REPOSITORY, this.m_inaRepoJson);
		this.m_queryManager.submitVariables(oFF.SyncType.NON_BLOCKING, this, null);
	}
	else
	{
		this.updateViews();
	}
};
oFF.AuGdsQueryDesignerDocument.prototype.onVariableProcessorExecuted = function(extResult, result, customIdentifier)
{
	if (extResult.hasErrors())
	{
		this.getGenesis().showWarningToast("Could not submit variables!");
	}
	else
	{
		this.m_queryManager.getQueryModel().deserializeFromElementExt(oFF.QModelFormat.INA_REPOSITORY_NO_VARS, this.m_inaRepoJson);
	}
	this.m_inaRepoJson = null;
	this.updateViews();
};
oFF.AuGdsQueryDesignerDocument.prototype.onPress = function(event)
{
	var control = event.getControl();
	var controlParent = control.getParent();
	if (oFF.notNull(controlParent) && controlParent.getUiType() === oFF.UiType.TOOLBAR && this.getMenuButtons().contains(control))
	{
		switch (control.getName())
		{
			case oFF.AuGdsQueryDesignerDocument.MENU_BAR_PANELS_BTN:
				this.createPanelsMenuBarMenu(control);
				break;

			case oFF.AuGdsQueryDesignerDocument.MENU_BAR_DATA_SOURCE_BTN:
				this.createDataSourceMenuBarMenu(control);
				break;

			default:
		}
	}
	if (oFF.notNull(controlParent) && controlParent.getUiType() === oFF.UiType.MENU && oFF.XString.isEqual(controlParent.getName(), oFF.AuGdsQueryDesignerDocument.MENU_BAR_VIEW_MENU))
	{
		switch (control.getName())
		{
			case oFF.AuGdsQueryDesignerDocument.MENU_BAR_VIEW_MENU_FILTER_PANEL:
				this.toggleFilterPanel();
				break;

			case oFF.AuGdsQueryDesignerDocument.MENU_BAR_VIEW_MENU_DESIGNER_PANELS:
				this.toggleDesignerPanels();
				break;

			default:
		}
	}
	if (oFF.notNull(controlParent) && controlParent.getUiType() === oFF.UiType.MENU && oFF.XString.isEqual(controlParent.getName(), oFF.AuGdsQueryDesignerDocument.MENU_BAR_DATA_SOURCE_MENU))
	{
		switch (control.getName())
		{
			case oFF.AuGdsQueryDesignerDocument.MENU_BAR_DATA_SOURCE_MENU_CHANGE_DATA_SOURCE:
				this.showDataSourcePicker();
				break;

			case oFF.AuGdsQueryDesignerDocument.MENU_BAR_DATA_SOURCE_MENU_DATA_SOURCE_INFO:
				this.showDataSourceInfo();
				break;

			case oFF.AuGdsQueryDesignerDocument.MENU_BAR_DATA_SOURCE_MENU_RESET:
				this.onResetDataSourcePressed();
				break;

			case oFF.AuGdsQueryDesignerDocument.MENU_BAR_DATA_SOURCE_MENU_REFRESH:
				this.refreshDataSource();
				break;

			case oFF.AuGdsQueryDesignerDocument.MENU_BAR_DATA_SOURCE_MENU_PAUSE_UPDATES:
				this.togglePauseUpdates();
				break;

			case oFF.AuGdsQueryDesignerDocument.MENU_BAR_DATA_SOURCE_MENU_VARIABLES:
				this.onOpenVariableDialogPressed();
				break;

			default:
		}
	}
	if (control === this.m_toolbarSelectDataSourceBtn)
	{
		this.showDataSourcePicker();
	}
	else if (control === this.m_toolbarResetBtn)
	{
		this.onResetDataSourcePressed();
	}
	else if (control === this.m_toolbarRefreshBtn)
	{
		this.refreshDataSource();
	}
	else if (control === this.m_toolbarVariablesBtn)
	{
		this.onOpenVariableDialogPressed();
	}
	else if (control === this.m_pauseUpdatesToggleBtn)
	{
		this.togglePauseUpdates();
	}
	else if (control === this.m_toolbarDesignerPanelToggleBtn)
	{
		this.toggleDesignerPanels();
	}
};
oFF.AuGdsQueryDesignerDocument.prototype.onOk = function()
{
	this.updateTable();
};
oFF.AuGdsQueryDesignerDocument.prototype.onCancel = function()
{
	if (this.m_queryManager.isSubmitNeeded())
	{
		this.setStatusError("Variables not set.");
	}
};
oFF.AuGdsQueryDesignerDocument.prototype.onFileLoaded = function(extResult, file, fileContent, customIdentifier)
{
	if (oFF.isNull(extResult) || extResult.isValid())
	{
		var jsonObj = this.getController().getJsonObjFromLoadedFileContent(fileContent);
		if (oFF.notNull(jsonObj))
		{
			this.loadQueryDesignerDocFromJson(file, jsonObj);
		}
	}
	else
	{
		this.getGenesis().showErrorToast("Error while fetching the specified file!");
	}
};
oFF.AuGdsQueryDesignerDocument.prototype.onSelectionChange = function(event)
{
	this.m_interactiveTable.processSelectionChangeEvent(event);
	this.updateQuickActionToolbar();
	var numOfSelectedCells = this.m_interactiveTable.getNumberOfSelectedCells();
	if (numOfSelectedCells > 0)
	{
		var cellsStr = numOfSelectedCells > 1 ? " cells" : " cell";
		this.setStatusInfo(oFF.XStringUtils.concatenate3(oFF.XInteger.convertToString(numOfSelectedCells), cellsStr, " selected"));
	}
	else
	{
		this.showStatusTableInfo();
	}
};
oFF.AuGdsQueryDesignerDocument.prototype.notifyEditAction = function()
{
	this.updateTable();
};
oFF.AuGdsQueryDesignerDocument.prototype.onGdsHvSelectDataSourcePress = function(homeView)
{
	this.showDataSourcePicker();
};
oFF.AuGdsQueryDesignerDocument.prototype.onGdsHvRecentFileSelect = function(homeView, filePath)
{
	this.loadRecentFile(filePath);
};
oFF.AuGdsQueryDesignerDocument.prototype.onGdsHvRecentFilesClear = function(homeView)
{
	this.clearRecentFiles();
};
oFF.AuGdsQueryDesignerDocument.prototype.onFormPopupSubmit = function(popup, prefsStruct)
{
	this.markDirty();
	this.setDocumentName(prefsStruct.getStringByKeyExt(oFF.AuGdsQueryDesignerDocument.GDS_QD_PREFS_DOC_NAME_KEY, this.getDocumentName()));
	if (oFF.notNull(this.m_interactiveTable) && prefsStruct.containsKey(oFF.AuGdsQueryDesignerDocument.GDS_QD_PREFS_TABLE_TITLE_KEY))
	{
		this.m_interactiveTable.setTitle(prefsStruct.getStringByKey(oFF.AuGdsQueryDesignerDocument.GDS_QD_PREFS_TABLE_TITLE_KEY));
	}
};
oFF.AuGdsQueryDesignerDocument.prototype.onTableDataUpdated = function(table)
{
	this.showStatusTableInfo();
};
oFF.AuGdsQueryDesignerDocument.prototype.onTableQMChanged = function()
{
	this.updateQuickActionToolbar();
	if (oFF.notNull(this.m_queryManager))
	{
		this.notifyUndoRedoStateChanged();
		if (this.m_queryManager.getApplication().getUndoManager().getAvailableUndoStepCount() > 0)
		{
			this.markDirty();
		}
	}
};
oFF.AuGdsQueryDesignerDocument.prototype.onBackendRequestStarted = function()
{
	this.showNetworkActivityIndicator();
};
oFF.AuGdsQueryDesignerDocument.prototype.onBackendRequestFinished = function()
{
	this.hideNetworkActivityIndicator();
};

oFF.AuGdsQdUserActionGroup = function() {};
oFF.AuGdsQdUserActionGroup.prototype = new oFF.AuGdsQdUserActionItem();
oFF.AuGdsQdUserActionGroup.prototype._ff_c = "AuGdsQdUserActionGroup";

oFF.AuGdsQdUserActionGroup.create = function()
{
	var instance = new oFF.AuGdsQdUserActionGroup();
	instance.setup();
	return instance;
};
oFF.AuGdsQdUserActionGroup.prototype.m_subItems = null;
oFF.AuGdsQdUserActionGroup.prototype.addNewGroup = function()
{
	var newInstance = oFF.AuGdsQdUserActionGroup.create();
	this.addSubItem(newInstance);
	return newInstance;
};
oFF.AuGdsQdUserActionGroup.prototype.addNewLeaf = function()
{
	var newInstance = oFF.AuGdsQdUserActionLeaf.create();
	this.addSubItem(newInstance);
	return newInstance;
};
oFF.AuGdsQdUserActionGroup.prototype.setup = function()
{
	this.m_subItems = oFF.XList.create();
};
oFF.AuGdsQdUserActionGroup.prototype.getSubItems = function()
{
	return this.m_subItems;
};
oFF.AuGdsQdUserActionGroup.prototype.addSubItem = function(actionItem)
{
	this.m_subItems.add(actionItem);
};
oFF.AuGdsQdUserActionGroup.prototype.getActionGroup = function()
{
	return this;
};

oFF.AuGdsQdUserActionLeaf = function() {};
oFF.AuGdsQdUserActionLeaf.prototype = new oFF.AuGdsQdUserActionItem();
oFF.AuGdsQdUserActionLeaf.prototype._ff_c = "AuGdsQdUserActionLeaf";

oFF.AuGdsQdUserActionLeaf.create = function()
{
	var instance = new oFF.AuGdsQdUserActionLeaf();
	instance.setup();
	return instance;
};
oFF.AuGdsQdUserActionLeaf.prototype.m_command = null;
oFF.AuGdsQdUserActionLeaf.prototype.m_statusSupplier = null;
oFF.AuGdsQdUserActionLeaf.prototype.getCommand = function()
{
	return this.m_command;
};
oFF.AuGdsQdUserActionLeaf.prototype.setCommand = function(command)
{
	this.m_command = command;
};
oFF.AuGdsQdUserActionLeaf.prototype.getStatusSupplier = function()
{
	return this.m_statusSupplier;
};
oFF.AuGdsQdUserActionLeaf.prototype.setStatusSupplier = function(renderingSupplier)
{
	this.m_statusSupplier = renderingSupplier;
};
oFF.AuGdsQdUserActionLeaf.prototype.getActionLeaf = function()
{
	return this;
};

oFF.AuGdsQdPanelWithPresentation = function() {};
oFF.AuGdsQdPanelWithPresentation.prototype = new oFF.AuGdsPanel();
oFF.AuGdsQdPanelWithPresentation.prototype._ff_c = "AuGdsQdPanelWithPresentation";

oFF.AuGdsQdPanelWithPresentation.prototype.m_presentationType = null;
oFF.AuGdsQdPanelWithPresentation.prototype.m_menu = null;
oFF.AuGdsQdPanelWithPresentation.prototype.releaseObject = function()
{
	this.m_presentationType = null;
	this.m_menu = oFF.XObjectExt.release(this.m_menu);
	oFF.AuGdsPanel.prototype.releaseObject.call( this );
};
oFF.AuGdsQdPanelWithPresentation.prototype.setupPresentationPanel = function(genesis, listener)
{
	this.setupExt(genesis, listener);
	this.m_presentationType = oFF.AuGdsQdPanelPresentation.DESCRIPTION;
	this.m_menu = genesis.newControl(oFF.UiType.MENU);
};
oFF.AuGdsQdPanelWithPresentation.prototype.getPresentationType = function()
{
	return this.m_presentationType;
};
oFF.AuGdsQdPanelWithPresentation.prototype.extendMenuWithDisplayOptions = function(menu, onPresentationChange)
{
	var displayOptions = menu.addNewItem();
	displayOptions.setText("Display Options");
	displayOptions.setIcon("wrench");
	this.createPresentationMenuItem(displayOptions, "Description", oFF.AuGdsQdPanelPresentation.DESCRIPTION, onPresentationChange);
	this.createPresentationMenuItem(displayOptions, "ID", oFF.AuGdsQdPanelPresentation.ID, onPresentationChange);
	this.createPresentationMenuItem(displayOptions, "ID and Description", oFF.AuGdsQdPanelPresentation.ID_AND_DESCRIPTION, onPresentationChange);
	this.createPresentationMenuItem(displayOptions, "Description and ID", oFF.AuGdsQdPanelPresentation.DESCRIPTION_AND_ID, onPresentationChange);
};
oFF.AuGdsQdPanelWithPresentation.prototype.createPresentationMenuItem = function(parent, text, presentationType, listener)
{
	var item = parent.addNewItem().setText(text);
	item.setIcon(this.m_presentationType === presentationType ? "accept" : null);
	item.registerOnPress(oFF.AuGdsLambdaListener.create( function(){
		this.m_presentationType = presentationType;
		listener();
	}.bind(this)));
};
oFF.AuGdsQdPanelWithPresentation.prototype.showDimMenu = function(evt, dim)
{
	var application = dim.getApplication();
	var context = dim.getContext();
	this.m_menu.clearItems();
	var actionGroup = oFF.AuGdsQdInteractiveTableContextActionsHelper.getStandaloneDimensionMenu(application, context, dim,  function(){
		this.onMenuAction();
	}.bind(this));
	oFF.AuGdsQdContextMenuUtil.renderSubMenuItems(this.m_menu, actionGroup);
	var clickX = evt.getParameters().getIntegerByKeyExt(oFF.UiControlEvent.PARAM_CLICK_X, 0);
	var clickY = evt.getParameters().getIntegerByKeyExt(oFF.UiControlEvent.PARAM_CLICK_Y, 0);
	this.m_menu.openAtPosition(clickX, clickY);
};
oFF.AuGdsQdPanelWithPresentation.prototype.showMemberMenu = function(evt, member)
{
	var application = member.getApplication();
	var context = member.getContext();
	this.m_menu.clearItems();
	var actionGroup = oFF.AuGdsQdInteractiveTableContextActionsHelper.getStandaloneMeasureMenu(application, context, member,  function(){
		this.onMenuAction();
	}.bind(this));
	oFF.AuGdsQdContextMenuUtil.renderSubMenuItems(this.m_menu, actionGroup);
	var clickX = evt.getParameters().getIntegerByKeyExt(oFF.UiControlEvent.PARAM_CLICK_X, 0);
	var clickY = evt.getParameters().getIntegerByKeyExt(oFF.UiControlEvent.PARAM_CLICK_Y, 0);
	this.m_menu.openAtPosition(clickX, clickY);
};

oFF.AuGdsQdBuilderPanel = function() {};
oFF.AuGdsQdBuilderPanel.prototype = new oFF.AuGdsQdPanelWithPresentation();
oFF.AuGdsQdBuilderPanel.prototype._ff_c = "AuGdsQdBuilderPanel";

oFF.AuGdsQdBuilderPanel.DARK_BLUE = null;
oFF.AuGdsQdBuilderPanel.LIGHT_GRAY = null;
oFF.AuGdsQdBuilderPanel.LIGHTER_GRAY = null;
oFF.AuGdsQdBuilderPanel.DIM_TAG = "dimension";
oFF.AuGdsQdBuilderPanel.createBuilderPanel = function(genesis)
{
	var obj = new oFF.AuGdsQdBuilderPanel();
	obj.setupBuilder(genesis);
	return obj;
};
oFF.AuGdsQdBuilderPanel.prototype.m_queryManager = null;
oFF.AuGdsQdBuilderPanel.prototype.m_root = null;
oFF.AuGdsQdBuilderPanel.prototype.m_ignoreEvent = false;
oFF.AuGdsQdBuilderPanel.prototype.m_editActionListeners = null;
oFF.AuGdsQdBuilderPanel.prototype.m_rows = null;
oFF.AuGdsQdBuilderPanel.prototype.m_columns = null;
oFF.AuGdsQdBuilderPanel.prototype.m_dimComponents = null;
oFF.AuGdsQdBuilderPanel.prototype.setupBuilder = function(genesis)
{
	if (oFF.isNull(oFF.AuGdsQdBuilderPanel.DARK_BLUE))
	{
		oFF.AuGdsQdBuilderPanel.DARK_BLUE = oFF.UiColor.create("#346187");
	}
	if (oFF.isNull(oFF.AuGdsQdBuilderPanel.LIGHT_GRAY))
	{
		oFF.AuGdsQdBuilderPanel.LIGHT_GRAY = oFF.UiColor.GREY.newBrighterColor(0.24);
	}
	if (oFF.isNull(oFF.AuGdsQdBuilderPanel.LIGHTER_GRAY))
	{
		oFF.AuGdsQdBuilderPanel.LIGHTER_GRAY = oFF.UiColor.GREY.newBrighterColor(0.32);
	}
	this.setupPresentationPanel(genesis, null);
	this.m_editActionListeners = oFF.XList.create();
	this.m_root = this.getGenesis().newControl(oFF.UiType.FLEX_LAYOUT);
	this.m_root.setDirection(oFF.UiFlexDirection.COLUMN);
	this.m_root.useMaxSpace();
	this.m_root.setPadding(oFF.UiCssBoxEdges.create("8px"));
	this.m_rows = this.buildAxisList(this.m_root, "Rows", oFF.AxisType.ROWS);
	this.m_columns = this.buildAxisList(this.m_root, "Columns", oFF.AxisType.COLUMNS);
	this.setTitle("Builder");
	this.setIcon("wrench");
	this.setContent(this.m_root);
	this.registerOnPanelActionsListener(this);
};
oFF.AuGdsQdBuilderPanel.prototype.buildAxisList = function(container, text, axisType)
{
	var listLayout = container.addNewItemOfType(oFF.UiType.FLEX_LAYOUT);
	listLayout.setDirection(oFF.UiFlexDirection.COLUMN);
	listLayout.setFlex("1 1 50%");
	if (axisType === oFF.AxisType.COLUMNS)
	{
		listLayout.setMargin(oFF.UiCssBoxEdges.create("10px 0 0 0"));
	}
	var label = listLayout.addNewItemOfType(oFF.UiType.LABEL);
	label.setText(text);
	label.setFontWeight(oFF.UiFontWeight.BOLD);
	label.setFontSize(oFF.UiCssLength.create("1rem"));
	label.setMargin(oFF.UiCssBoxEdges.create("5px"));
	var list = listLayout.addNewItemOfType(oFF.UiType.LIST);
	list.setSelectionMode(oFF.UiSelectionMode.NONE);
	list.setBorderWidth(oFF.UiCssBoxEdges.create("0px"));
	list.setDropInfo(oFF.UiDropInfo.create(oFF.UiDropPosition.BETWEEN, oFF.UiDropEffect.MOVE, oFF.UiDropLayout.DEFAULT, oFF.UiAggregation.ITEMS, null, oFF.AuGdsQdBuilderPanel.DIM_TAG));
	list.registerOnDrop(oFF.AuGdsLambdaDropListener.create( function(event){
		this.handleDimDrop(event, axisType);
	}.bind(this)));
	return list;
};
oFF.AuGdsQdBuilderPanel.prototype.releaseObject = function()
{
	this.m_rows = null;
	this.m_columns = null;
	this.m_dimComponents = oFF.XCollectionUtils.releaseEntriesAndCollectionIfNotNull(this.m_dimComponents);
	this.m_editActionListeners.clear();
	this.m_editActionListeners = oFF.XObjectExt.release(this.m_editActionListeners);
	this.m_queryManager = null;
	this.m_root = oFF.XObjectExt.release(this.m_root);
	oFF.AuGdsQdPanelWithPresentation.prototype.releaseObject.call( this );
};
oFF.AuGdsQdBuilderPanel.prototype.handleDimDrop = function(event, targetAxis)
{
	if (event.getDroppedControl() === event.getDraggedControl())
	{
		return;
	}
	var draggedControl = event.getDraggedControl();
	var dim = draggedControl.getCustomObject();
	var moveItem = null;
	if (draggedControl.getParent() !== this.m_rows && draggedControl.getParent() !== this.m_columns)
	{
		moveItem = this.tryFindItemByDim(dim);
		if (oFF.isNull(moveItem))
		{
			moveItem = this.buildDimItem(dim);
		}
	}
	else
	{
		moveItem = draggedControl;
	}
	var list = event.getControl();
	var dropIndex = this.calcDropIndex(event);
	this.moveItem(list, moveItem, dropIndex);
	var names = this.collectEntityNames(list);
	var queryModel = this.m_queryManager.getQueryModel();
	var dims = oFF.XStream.ofString(names).map( function(name){
		return queryModel.getDimensionByName(name.getString());
	}.bind(this)).collect(oFF.XStreamCollector.toList());
	this.m_ignoreEvent = true;
	var axis = queryModel.getAxis(targetAxis);
	axis.clear();
	axis.addAll(dims);
	this.notifyEditActionListeners();
	this.m_ignoreEvent = false;
};
oFF.AuGdsQdBuilderPanel.prototype.calcDropIndex = function(event)
{
	var dropPosition = event.getRelativeDropPosition();
	var list = event.getControl();
	var dropIndex = list.getIndexOfItem(event.getDroppedControl());
	dropIndex = dropPosition === oFF.UiRelativeDropPosition.BEFORE ? dropIndex : dropIndex + 1;
	var oldIndex = list.getIndexOfItem(event.getDraggedControl());
	if (oldIndex !== -1 && oldIndex < dropIndex)
	{
		dropIndex--;
	}
	return dropIndex;
};
oFF.AuGdsQdBuilderPanel.prototype.moveItem = function(list, listItem, insertIndex)
{
	if (listItem.getParent() !== null)
	{
		listItem.getParent().removeItem(listItem);
	}
	if (insertIndex >= list.getItemCount())
	{
		list.addItem(listItem);
	}
	else
	{
		list.insertItem(listItem, insertIndex);
	}
};
oFF.AuGdsQdBuilderPanel.prototype.collectEntityNames = function(list)
{
	var result = oFF.XListOfString.create();
	var items = list.getItems();
	for (var i = 0; i < items.size(); i++)
	{
		var obj = items.get(i).getCustomObject();
		result.add(obj.getName());
	}
	return result;
};
oFF.AuGdsQdBuilderPanel.prototype.addEditActionListener = function(editActionListener)
{
	this.m_editActionListeners.add(editActionListener);
};
oFF.AuGdsQdBuilderPanel.prototype.removeEditActionListener = function(editActionListener)
{
	this.m_editActionListeners.removeElement(editActionListener);
};
oFF.AuGdsQdBuilderPanel.prototype.getQueryManager = function()
{
	return this.m_queryManager;
};
oFF.AuGdsQdBuilderPanel.prototype.setQueryManager = function(manager)
{
	this.unregisterQm();
	this.m_queryManager = manager;
	this.registerQm();
	this.updateBuilderPanel();
};
oFF.AuGdsQdBuilderPanel.prototype.updateBuilderPanel = function()
{
	this.m_dimComponents = oFF.XCollectionUtils.releaseEntriesAndCollectionIfNotNull(this.m_dimComponents);
	this.m_dimComponents = oFF.XList.create();
	this.m_rows.clearItems();
	this.m_columns.clearItems();
	if (oFF.isNull(this.m_queryManager))
	{
		return;
	}
	this.updateAxisList(this.m_rows, this.m_queryManager.getQueryModel().getRowsAxis());
	this.updateAxisList(this.m_columns, this.m_queryManager.getQueryModel().getColumnsAxis());
	this.updateLabels();
};
oFF.AuGdsQdBuilderPanel.prototype.updateAxisList = function(list, axis)
{
	for (var i = 0; i < axis.size(); i++)
	{
		var dim = axis.get(i);
		var dragItem = this.buildDimItem(dim);
		list.addItem(dragItem);
	}
};
oFF.AuGdsQdBuilderPanel.prototype.buildMemberList = function(dim, container)
{
	var memberListLayout = container.addNewItemOfType(oFF.UiType.FLEX_LAYOUT);
	memberListLayout.setDirection(oFF.UiFlexDirection.COLUMN);
	memberListLayout.setPadding(oFF.UiCssBoxEdges.create("6px"));
	var label = memberListLayout.addNewItemOfType(oFF.UiType.LABEL);
	label.setText(dim.isMeasureStructure() ? "Measures" : dim.getText());
	label.setFontWeight(oFF.UiFontWeight.BOLD);
	label.setPadding(oFF.UiCssBoxEdges.create("4px"));
	var memberList = memberListLayout.addNewItemOfType(oFF.UiType.LIST);
	memberList.setBorderWidth(oFF.UiCssBoxEdges.create("0px"));
	memberList.setSelectionMode(oFF.UiSelectionMode.NONE);
	memberList.useMaxSpace();
	memberList.setDropInfo(oFF.UiDropInfo.create(oFF.UiDropPosition.BETWEEN, oFF.UiDropEffect.MOVE, oFF.UiDropLayout.DEFAULT, oFF.UiAggregation.ITEMS, null, dim.getName()));
	memberList.registerOnDrop(oFF.AuGdsLambdaDropListener.create( function(event){
		this.handleMemberDrop(event, dim);
	}.bind(this)));
	var members = this.getListOfMembers(dim);
	var memberComponents = oFF.XList.create();
	for (var j = 0; j < members.size(); j++)
	{
		var member = members.get(j);
		if (member.getResultVisibility() === oFF.ResultVisibility.VISIBLE)
		{
			var memberItem = this.buildDragItem(true);
			memberItem.setTag(member.getDimension().getName());
			memberItem.setCustomObject(member);
			memberItem.registerOnContextMenu(oFF.AuGdsLambdaListenerWithEvent.create( function(evt){
				this.showMemberMenu(evt, member);
			}.bind(this)));
			var memberLabel = this.buildLabelAndIcon(memberItem.getContent(), member,  function(){
				this.removeMember(member, memberItem);
			}.bind(this));
			memberList.addItem(memberItem);
			memberComponents.add(oFF.AuGdsQdMemberViewModel.createMemberForBuildPanel(member, memberLabel));
		}
	}
	this.m_dimComponents.add(oFF.AuGdsQdDimensionViewModel.createStructureForBuildPanel(dim, memberComponents, label));
};
oFF.AuGdsQdBuilderPanel.prototype.getListOfMembers = function(dim)
{
	var members = dim.getAllStructureMembers();
	var dimensionSorting = this.getQueryManager().getQueryModel().getSortingManager().getDimensionSorting(dim, false);
	if (oFF.isNull(dimensionSorting))
	{
		return members;
	}
	var customSort = dimensionSorting.getCustomSort();
	return oFF.XStream.ofString(customSort).map( function(s){
		return members.getByKey(s.getString());
	}.bind(this)).collect(oFF.XStreamCollector.toListOfNameObject());
};
oFF.AuGdsQdBuilderPanel.prototype.handleMemberDrop = function(event, measureDim)
{
	var draggedControl = event.getDraggedControl();
	if (event.getDroppedControl() === draggedControl)
	{
		return;
	}
	var list = event.getControl();
	var moveItem = null;
	if (draggedControl.getParent() !== event.getDroppedControl().getParent())
	{
		var member = draggedControl.getCustomObject();
		moveItem = this.tryFindItemByObject(list, member);
	}
	else
	{
		moveItem = draggedControl;
	}
	var dropIndex = this.calcDropIndex(event);
	this.moveItem(list, moveItem, dropIndex);
	var names = this.collectEntityNames(list);
	var members = oFF.XStream.ofString(names).map( function(name){
		return measureDim.getStructureMember(name.getString());
	}.bind(this)).collect(oFF.XStreamCollector.toListOfNameObject());
	this.m_ignoreEvent = true;
	measureDim.setStructuredLayout(members);
	if (this.getQueryManager().getSystemType().isTypeOf(oFF.SystemType.BW))
	{
		var dimensionSorting = this.getQueryManager().getQueryModel().getSortingManager().getDimensionSorting(measureDim, true);
		dimensionSorting.setSortByKey();
		dimensionSorting.setDirection(oFF.XSortDirection.ASCENDING);
		dimensionSorting.setCustomSort(oFF.XStream.of(members).collect(oFF.XStreamCollector.toListOfString( function(input){
			return input.getName();
		}.bind(this))));
	}
	else
	{
		this.getQueryManager().getQueryModel().getSortingManager().removeDimensionSorting(measureDim);
	}
	this.notifyEditActionListeners();
	this.m_ignoreEvent = false;
};
oFF.AuGdsQdBuilderPanel.prototype.buildLabelAndIcon = function(container, obj, onRemove)
{
	var nameLbl = container.addNewItemOfType(oFF.UiType.LABEL);
	nameLbl.setText(this.getPresentationType().getDisplayValue(obj));
	nameLbl.setFlex("1 0 0");
	nameLbl.setFontColor(oFF.AuGdsQdBuilderPanel.DARK_BLUE);
	var removeIcon = container.addNewItemOfType(oFF.UiType.ICON);
	removeIcon.setIcon("sys-cancel");
	removeIcon.setHeight(oFF.UiCssLength.create("16px"));
	removeIcon.setPadding(oFF.UiCssBoxEdges.create("8px"));
	removeIcon.setColor(oFF.AuGdsQdBuilderPanel.DARK_BLUE);
	removeIcon.registerOnPress(oFF.AuGdsLambdaListener.create(onRemove));
	return nameLbl;
};
oFF.AuGdsQdBuilderPanel.prototype.removeMember = function(member, item)
{
	this.m_ignoreEvent = true;
	member.setResultVisibility(oFF.ResultVisibility.HIDDEN);
	this.m_ignoreEvent = false;
	item.getParent().removeItem(item);
	this.notifyEditActionListeners();
};
oFF.AuGdsQdBuilderPanel.prototype.removeDimension = function(dim, item)
{
	this.m_ignoreEvent = true;
	dim.getAxis().removeElement(dim);
	this.m_ignoreEvent = false;
	item.getParent().removeItem(item);
	this.notifyEditActionListeners();
};
oFF.AuGdsQdBuilderPanel.prototype.tryFindItemByDim = function(dim)
{
	var list = null;
	var axisType = dim.getAxisType();
	if (axisType === oFF.AxisType.ROWS)
	{
		list = this.m_rows;
	}
	else if (axisType === oFF.AxisType.COLUMNS)
	{
		list = this.m_columns;
	}
	return this.tryFindItemByObject(list, dim);
};
oFF.AuGdsQdBuilderPanel.prototype.tryFindItemByObject = function(listToSearch, obj)
{
	if (oFF.isNull(listToSearch))
	{
		return null;
	}
	var items = listToSearch.getItems();
	for (var i = 0; i < items.size(); i++)
	{
		var item = items.get(i);
		if (item.getCustomObject() === obj)
		{
			return item;
		}
	}
	return null;
};
oFF.AuGdsQdBuilderPanel.prototype.updateLabels = function()
{
	for (var i = 0; i < this.m_dimComponents.size(); i++)
	{
		var dimensionComponent = this.m_dimComponents.get(i);
		var dim = dimensionComponent.getDimension();
		dimensionComponent.getLabel().setText(this.getPresentationType().getDisplayValue(dim));
		var members = dimensionComponent.getMembers();
		for (var j = 0; j < members.size(); j++)
		{
			var memberComponent = members.get(j);
			var member = memberComponent.getMember();
			memberComponent.getLabel().setText(this.getPresentationType().getDisplayValue(member));
		}
	}
};
oFF.AuGdsQdBuilderPanel.prototype.buildDimItem = function(dim)
{
	var dimItem = this.buildDragItem(false);
	dimItem.setTag(oFF.AuGdsQdBuilderPanel.DIM_TAG);
	dimItem.setCustomObject(dim);
	dimItem.registerOnContextMenu(oFF.AuGdsLambdaListenerWithEvent.create( function(evt){
		this.showDimMenu(evt, dim);
	}.bind(this)));
	if (dim.isStructure())
	{
		var dragFlex = dimItem.getContent();
		this.buildMemberList(dim, dragFlex);
	}
	else
	{
		var label = this.buildLabelAndIcon(dimItem.getContent(), dim,  function(){
			this.removeDimension(dim, dimItem);
		}.bind(this));
		this.m_dimComponents.add(oFF.AuGdsQdDimensionViewModel.createDimensionForBuildPanel(dim, label));
	}
	return dimItem;
};
oFF.AuGdsQdBuilderPanel.prototype.buildDragItem = function(nested)
{
	var dragItem = this.getGenesis().newControl(oFF.UiType.CUSTOM_LIST_ITEM);
	dragItem.setDraggable(true);
	dragItem.setBorderWidth(oFF.UiCssBoxEdges.create("0px"));
	dragItem.setPadding(oFF.UiCssBoxEdges.create("4px"));
	if (nested)
	{
		dragItem.setBackgroundColor(oFF.AuGdsQdBuilderPanel.LIGHTER_GRAY);
	}
	var flex = dragItem.setNewContent(oFF.UiType.FLEX_LAYOUT);
	flex.useMaxWidth();
	flex.setAlignItems(oFF.UiFlexAlignItems.CENTER);
	flex.setBorderStyle(oFF.UiBorderStyle.SOLID);
	flex.setBorderWidth(oFF.UiCssBoxEdges.create("1px"));
	flex.setBorderColor(oFF.AuGdsQdBuilderPanel.LIGHT_GRAY);
	flex.setBackgroundColor(nested ? oFF.UiColor.WHITE : oFF.AuGdsQdBuilderPanel.LIGHTER_GRAY);
	var dragIcon = flex.addNewItemOfType(oFF.UiType.ICON);
	dragIcon.setIcon("vertical-grip");
	dragIcon.setHeight(oFF.UiCssLength.create("16px"));
	dragIcon.setPadding(oFF.UiCssBoxEdges.create("8px"));
	dragIcon.setColor(oFF.AuGdsQdBuilderPanel.DARK_BLUE);
	return dragItem;
};
oFF.AuGdsQdBuilderPanel.prototype.registerQm = function()
{
	if (oFF.notNull(this.m_queryManager))
	{
		var queryModel = this.m_queryManager.getQueryModel();
		queryModel.getRowsAxis().registerChangedListener(this, null);
		queryModel.getColumnsAxis().registerChangedListener(this, null);
		queryModel.getMeasureDimension().registerChangedListener(this, null);
		var dimensions = queryModel.getDimensions();
		for (var i = 0; i < dimensions.size(); i++)
		{
			var dimension = dimensions.get(i);
			if (!dimension.isStructure())
			{
				continue;
			}
			var allStructureMembers = dimension.getAllStructureMembers();
			for (var j = 0; j < allStructureMembers.size(); j++)
			{
				allStructureMembers.get(j).registerChangedListener(this, null);
			}
		}
	}
};
oFF.AuGdsQdBuilderPanel.prototype.unregisterQm = function()
{
	if (oFF.notNull(this.m_queryManager))
	{
		var queryModel = this.m_queryManager.getQueryModel();
		queryModel.getRowsAxis().unregisterChangedListener(this);
		queryModel.getColumnsAxis().unregisterChangedListener(this);
		queryModel.getMeasureDimension().unregisterChangedListener(this);
		var dimensions = queryModel.getDimensions();
		for (var i = 0; i < dimensions.size(); i++)
		{
			var dimension = dimensions.get(i);
			if (!dimension.isStructure())
			{
				continue;
			}
			var allStructureMembers = dimension.getAllStructureMembers();
			for (var j = 0; j < allStructureMembers.size(); j++)
			{
				allStructureMembers.get(j).unregisterChangedListener(this);
			}
		}
	}
};
oFF.AuGdsQdBuilderPanel.prototype.onMenuAction = function()
{
	this.updateBuilderPanel();
	this.notifyEditActionListeners();
};
oFF.AuGdsQdBuilderPanel.prototype.notifyEditActionListeners = function()
{
	for (var i = 0; i < this.m_editActionListeners.size(); i++)
	{
		this.m_editActionListeners.get(i).notifyEditAction();
	}
};
oFF.AuGdsQdBuilderPanel.prototype.clearEditActionListeners = function()
{
	this.m_editActionListeners.clear();
};
oFF.AuGdsQdBuilderPanel.prototype.onModelComponentChanged = function(modelComponent, customIdentifier)
{
	if (this.m_ignoreEvent)
	{
		return;
	}
	this.updateBuilderPanel();
};
oFF.AuGdsQdBuilderPanel.prototype.onMoreButtonPressed = function(panel, clickedIcon)
{
	var menu = this.getGenesis().newControl(oFF.UiType.MENU);
	this.extendMenuWithDisplayOptions(menu,  function(){
		this.updateLabels();
	}.bind(this));
	menu.openAt(clickedIcon);
};

oFF.AuGdsQdNavigationPanel = function() {};
oFF.AuGdsQdNavigationPanel.prototype = new oFF.AuGdsQdPanelWithPresentation();
oFF.AuGdsQdNavigationPanel.prototype._ff_c = "AuGdsQdNavigationPanel";

oFF.AuGdsQdNavigationPanel.DARK_BLUE = null;
oFF.AuGdsQdNavigationPanel.TRANSPARENT_GREY = null;
oFF.AuGdsQdNavigationPanel.createNavPanel = function(genesis)
{
	var obj = new oFF.AuGdsQdNavigationPanel();
	obj.setupNav(genesis);
	return obj;
};
oFF.AuGdsQdNavigationPanel.prototype.m_queryManager = null;
oFF.AuGdsQdNavigationPanel.prototype.m_root = null;
oFF.AuGdsQdNavigationPanel.prototype.m_ignoreEvent = false;
oFF.AuGdsQdNavigationPanel.prototype.m_editActionListeners = null;
oFF.AuGdsQdNavigationPanel.prototype.m_searchField = null;
oFF.AuGdsQdNavigationPanel.prototype.m_measureSpace = null;
oFF.AuGdsQdNavigationPanel.prototype.m_structureSpace = null;
oFF.AuGdsQdNavigationPanel.prototype.m_dimensions = null;
oFF.AuGdsQdNavigationPanel.prototype.m_dimComponents = null;
oFF.AuGdsQdNavigationPanel.prototype.setupNav = function(genesis)
{
	if (oFF.isNull(oFF.AuGdsQdNavigationPanel.DARK_BLUE))
	{
		oFF.AuGdsQdNavigationPanel.DARK_BLUE = oFF.UiColor.BLUE.newDarkerColor(0.2);
	}
	if (oFF.isNull(oFF.AuGdsQdNavigationPanel.TRANSPARENT_GREY))
	{
		oFF.AuGdsQdNavigationPanel.TRANSPARENT_GREY = oFF.UiColor.GREY.newColorWithAlpha(0.4);
	}
	oFF.AuGdsQdPanelWithPresentation.prototype.setupPresentationPanel.call( this , genesis, null);
	this.m_editActionListeners = oFF.XList.create();
	this.m_root = this.getGenesis().newControl(oFF.UiType.FLEX_LAYOUT);
	this.m_root.setDirection(oFF.UiFlexDirection.COLUMN);
	this.m_root.useMaxSpace();
	this.m_root.setPadding(oFF.UiCssBoxEdges.create("8px"));
	var onSearch = oFF.AuGdsLambdaListener.create( function(){
		this.doSearch(this.m_searchField.getText());
	}.bind(this));
	this.m_searchField = this.m_root.addNewItemOfType(oFF.UiType.SEARCH_FIELD);
	this.m_searchField.setMargin(oFF.UiCssBoxEdges.create("0px 0px 5px 0px"));
	this.m_searchField.setFlex("0 1 auto");
	this.m_searchField.registerOnSearch(onSearch);
	this.m_searchField.registerOnLiveChange(onSearch);
	this.m_measureSpace = this.m_root.addNewItemOfType(oFF.UiType.FLEX_LAYOUT);
	this.m_measureSpace.setDirection(oFF.UiFlexDirection.COLUMN);
	this.m_measureSpace.setMargin(oFF.UiCssBoxEdges.create("0px 0px 5px 0px"));
	this.m_measureSpace.setFlex("1 1 50%");
	this.m_measureSpace.setVisible(false);
	this.m_structureSpace = this.m_root.addNewItemOfType(oFF.UiType.FLEX_LAYOUT);
	this.m_structureSpace.setFlex("0 1 auto");
	this.m_structureSpace.setDirection(oFF.UiFlexDirection.COLUMN);
	this.m_structureSpace.setMargin(oFF.UiCssBoxEdges.create("0px 0px 5px 0px"));
	this.m_structureSpace.setFlex("1 1 50%");
	this.m_structureSpace.setVisible(false);
	var dimLayout = this.m_root.addNewItemOfType(oFF.UiType.FLEX_LAYOUT);
	dimLayout.setFlex("1 1 50%");
	dimLayout.setDirection(oFF.UiFlexDirection.COLUMN);
	var dimLabel = dimLayout.addNewItemOfType(oFF.UiType.LABEL);
	dimLabel.setText("Dimensions");
	dimLabel.setFontSize(oFF.UiCssLength.create("1rem"));
	dimLabel.setFontWeight(oFF.UiFontWeight.BOLD);
	dimLabel.setPadding(oFF.UiCssBoxEdges.create("4px"));
	dimLabel.setFlex("0 0 auto");
	dimLabel.setBorderWidth(oFF.UiCssBoxEdges.create("1px 0 0 0"));
	dimLabel.setBorderStyle(oFF.UiBorderStyle.SOLID);
	dimLabel.setBorderColor(oFF.UiTheme.getCurrentTheme().getLightGrayColor());
	this.m_dimensions = dimLayout.addNewItemOfType(oFF.UiType.LIST);
	this.m_dimensions.setFlex("0 1 100%");
	this.m_dimensions.setSelectionMode(oFF.UiSelectionMode.NONE);
	this.m_dimensions.setBorderWidth(oFF.UiCssBoxEdges.create("0px"));
	this.setTitle("Available Items");
	this.setIcon("menu");
	this.setContent(this.m_root);
	this.registerOnPanelActionsListener(this);
};
oFF.AuGdsQdNavigationPanel.prototype.releaseObject = function()
{
	this.m_searchField = null;
	this.m_measureSpace = null;
	this.m_structureSpace = null;
	this.m_dimensions = null;
	this.m_dimComponents = oFF.XCollectionUtils.releaseEntriesAndCollectionIfNotNull(this.m_dimComponents);
	this.m_editActionListeners.clear();
	this.m_editActionListeners = oFF.XObjectExt.release(this.m_editActionListeners);
	this.m_queryManager = null;
	this.m_root = oFF.XObjectExt.release(this.m_root);
	oFF.AuGdsQdPanelWithPresentation.prototype.releaseObject.call( this );
};
oFF.AuGdsQdNavigationPanel.prototype.doSearch = function(searchText)
{
	var isEmpty = oFF.XStringUtils.isNullOrEmpty(searchText);
	for (var i = 0; i < this.m_dimComponents.size(); i++)
	{
		var dimComponent = this.m_dimComponents.get(i);
		if (dimComponent.getDimension().isStructure())
		{
			var members = dimComponent.getMembers();
			for (var j = 0; j < members.size(); j++)
			{
				var memberViewModel = members.get(j);
				memberViewModel.getRoot().setVisible(isEmpty || oFF.XStringUtils.containsString(memberViewModel.getLabel().getText(), searchText, true));
			}
		}
		else
		{
			dimComponent.getRoot().setVisible(isEmpty || oFF.XStringUtils.containsString(dimComponent.getLabel().getText(), searchText, true));
		}
	}
};
oFF.AuGdsQdNavigationPanel.prototype.addEditActionListener = function(editActionListener)
{
	this.m_editActionListeners.add(editActionListener);
};
oFF.AuGdsQdNavigationPanel.prototype.removeEditActionListener = function(editActionListener)
{
	this.m_editActionListeners.removeElement(editActionListener);
};
oFF.AuGdsQdNavigationPanel.prototype.getQueryManager = function()
{
	return this.m_queryManager;
};
oFF.AuGdsQdNavigationPanel.prototype.setQueryManager = function(manager)
{
	this.unregisterQm();
	this.m_queryManager = manager;
	this.registerQm();
	this.updateNavPanel();
};
oFF.AuGdsQdNavigationPanel.prototype.updateNavPanel = function()
{
	this.m_dimComponents = oFF.XCollectionUtils.releaseEntriesAndCollectionIfNotNull(this.m_dimComponents);
	this.m_dimComponents = oFF.XList.create();
	this.m_measureSpace.clearItems();
	this.m_structureSpace.clearItems();
	this.m_dimensions.clearItems();
	var dimensions = this.m_queryManager.getDimensionAccessor().getDimensions();
	for (var i = 0; i < dimensions.size(); i++)
	{
		var dim = dimensions.get(i);
		if (!dim.supportsAxis(oFF.AxisType.ROWS) && !dim.supportsAxis(oFF.AxisType.COLUMNS))
		{
			continue;
		}
		if (dim.isMeasureStructure())
		{
			this.buildStructurePanel(this.m_measureSpace, dim, "Measures");
		}
		else if (dim.isStructure())
		{
			this.buildStructurePanel(this.m_structureSpace, dim, dim.getText());
		}
		else
		{
			this.addDimensionItem(this.m_dimensions, dim);
		}
	}
	this.updateLabels();
	this.updateCheckboxes();
	this.updateIcons();
};
oFF.AuGdsQdNavigationPanel.prototype.buildStructurePanel = function(space, dim, text)
{
	var header = space.addNewItemOfType(oFF.UiType.FLEX_LAYOUT);
	header.setDirection(oFF.UiFlexDirection.ROW);
	header.setAlignContent(oFF.UiFlexAlignContent.CENTER);
	header.setFlex("0 0 auto");
	header.setBorderWidth(oFF.UiCssBoxEdges.create("1px 0 0 0"));
	header.setBorderStyle(oFF.UiBorderStyle.SOLID);
	header.setBorderColor(oFF.UiTheme.getCurrentTheme().getLightGrayColor());
	var allCheckbox = header.addNewItemOfType(oFF.UiType.CHECKBOX);
	allCheckbox.registerOnChange(oFF.AuGdsLambdaListener.create( function(){
		this.handleSelectAll(allCheckbox, dim);
	}.bind(this)));
	var icons = this.createIcons(header, dim);
	var label = header.addNewItemOfType(oFF.UiType.LABEL);
	label.setText(text);
	label.setFontSize(oFF.UiCssLength.create("1rem"));
	label.setFontWeight(oFF.UiFontWeight.BOLD);
	label.useMaxWidth();
	label.setTag(oFF.AuGdsQdBuilderPanel.DIM_TAG);
	label.setCustomObject(dim);
	label.setDraggable(true);
	var list = space.addNewItemOfType(oFF.UiType.LIST);
	list.setSelectionMode(oFF.UiSelectionMode.NONE);
	list.setBorderWidth(oFF.UiCssBoxEdges.create("0px"));
	var members = dim.getAllStructureMembers();
	var memberComponents = oFF.XList.create();
	for (var j = 0; j < members.size(); j++)
	{
		memberComponents.add(this.addMemberItem(list, members.get(j)));
	}
	if (members.size() > 0)
	{
		space.setVisible(true);
	}
	this.m_dimComponents.add(oFF.AuGdsQdDimensionViewModel.createStructureForNavPanel(dim, memberComponents, label, icons.getFirstObject(), icons.getSecondObject(), allCheckbox));
};
oFF.AuGdsQdNavigationPanel.prototype.addMemberItem = function(list, member)
{
	var measureItem = this.getGenesis().newControl(oFF.UiType.CUSTOM_LIST_ITEM);
	measureItem.setBorderWidth(oFF.UiCssBoxEdges.create("0px"));
	measureItem.registerOnContextMenu(oFF.AuGdsLambdaListenerWithEvent.create( function(evt){
		this.showMemberMenu(evt, member);
	}.bind(this)));
	var measureItemContent = measureItem.setNewContent(oFF.UiType.FLEX_LAYOUT);
	measureItemContent.setAlignContent(oFF.UiFlexAlignContent.CENTER);
	var checkBox = measureItemContent.addNewItemOfType(oFF.UiType.CHECKBOX);
	checkBox.registerOnChange(oFF.AuGdsLambdaListener.create( function(){
		member.setResultVisibility(checkBox.isChecked() ? oFF.ResultVisibility.VISIBLE : oFF.ResultVisibility.HIDDEN);
		this.notifyEditActionListeners();
	}.bind(this)));
	var label = measureItemContent.addNewItemOfType(oFF.UiType.LABEL);
	label.setTag(member.getDimension().getName());
	label.useMaxWidth();
	label.setDraggable(true);
	label.setCustomObject(member);
	list.addItem(measureItem);
	return oFF.AuGdsQdMemberViewModel.createMemberForNavPanel(member, measureItem, label, checkBox);
};
oFF.AuGdsQdNavigationPanel.prototype.addDimensionItem = function(list, dim)
{
	var dimItem = this.getGenesis().newControl(oFF.UiType.CUSTOM_LIST_ITEM);
	dimItem.setBorderWidth(oFF.UiCssBoxEdges.create("0px"));
	dimItem.setTag(oFF.AuGdsQdBuilderPanel.DIM_TAG);
	dimItem.setCustomObject(dim);
	dimItem.setDraggable(true);
	dimItem.registerOnContextMenu(oFF.AuGdsLambdaListenerWithEvent.create( function(evt){
		this.showDimMenu(evt, dim);
	}.bind(this)));
	var dimItemContent = dimItem.setNewContent(oFF.UiType.FLEX_LAYOUT);
	dimItemContent.useMaxWidth();
	dimItemContent.setHeight(oFF.UiCssLength.create("28px"));
	dimItemContent.setPadding(oFF.UiCssBoxEdges.create("4px"));
	dimItemContent.setAlignContent(oFF.UiFlexAlignContent.CENTER);
	var icons = this.createIcons(dimItemContent, dim);
	var label = dimItemContent.addNewItemOfType(oFF.UiType.LABEL);
	list.addItem(dimItem);
	this.m_dimComponents.add(oFF.AuGdsQdDimensionViewModel.createDimensionForNavPanel(dim, dimItem, label, icons.getFirstObject(), icons.getSecondObject()));
};
oFF.AuGdsQdNavigationPanel.prototype.createIcons = function(container, dim)
{
	var rowIcon = container.addNewItemOfType(oFF.UiType.ICON);
	rowIcon.setIcon("table-row").setHeight(oFF.UiCssLength.create("16px"));
	rowIcon.setEnabled(dim.supportsAxis(oFF.AxisType.ROWS));
	rowIcon.registerOnPress(oFF.AuGdsLambdaListener.create( function(){
		this.toggleDimemsionAxis(dim, oFF.AxisType.ROWS);
	}.bind(this)));
	container.addNewItemOfType(oFF.UiType.SPACER).setWidth(oFF.UiCssLength.create("4px"));
	var colIcon = container.addNewItemOfType(oFF.UiType.ICON);
	colIcon.setIcon("table-column").setHeight(oFF.UiCssLength.create("16px"));
	colIcon.setEnabled(dim.supportsAxis(oFF.AxisType.COLUMNS));
	colIcon.registerOnPress(oFF.AuGdsLambdaListener.create( function(){
		this.toggleDimemsionAxis(dim, oFF.AxisType.COLUMNS);
	}.bind(this)));
	container.addNewItemOfType(oFF.UiType.SPACER).setWidth(oFF.UiCssLength.create("10px"));
	return oFF.XPair.create(rowIcon, colIcon);
};
oFF.AuGdsQdNavigationPanel.prototype.toggleDimemsionAxis = function(dim, selectedAxis)
{
	if (dim.getAxisType() === selectedAxis)
	{
		dim.getConvenienceCommands().moveDimensionToFree(dim.getName());
	}
	else
	{
		dim.getConvenienceCommands().moveDimensionToAxis(dim.getName(), selectedAxis);
	}
	this.notifyEditActionListeners();
};
oFF.AuGdsQdNavigationPanel.prototype.handleSelectAll = function(checkbox, dimension)
{
	this.m_ignoreEvent = true;
	var members = dimension.getAllStructureMembers();
	for (var k = 0; k < members.size(); k++)
	{
		members.get(k).setResultVisibility(checkbox.isChecked() ? oFF.ResultVisibility.VISIBLE : oFF.ResultVisibility.HIDDEN);
	}
	this.m_ignoreEvent = false;
	this.onModelComponentChanged(null, null);
	this.notifyEditActionListeners();
};
oFF.AuGdsQdNavigationPanel.prototype.registerQm = function()
{
	if (oFF.notNull(this.m_queryManager))
	{
		var queryModel = this.m_queryManager.getQueryModel();
		queryModel.getRowsAxis().registerChangedListener(this, null);
		queryModel.getColumnsAxis().registerChangedListener(this, null);
		queryModel.getFreeAxis().registerChangedListener(this, null);
		queryModel.getMeasureDimension().registerChangedListener(this, null);
		var dimensions = queryModel.getDimensions();
		for (var i = 0; i < dimensions.size(); i++)
		{
			var dimension = dimensions.get(i);
			if (!dimension.isStructure())
			{
				continue;
			}
			var allStructureMembers = dimension.getAllStructureMembers();
			for (var j = 0; j < allStructureMembers.size(); j++)
			{
				allStructureMembers.get(j).registerChangedListener(this, null);
			}
		}
	}
};
oFF.AuGdsQdNavigationPanel.prototype.unregisterQm = function()
{
	if (oFF.notNull(this.m_queryManager))
	{
		var queryModel = this.m_queryManager.getQueryModel();
		queryModel.getRowsAxis().unregisterChangedListener(this);
		queryModel.getColumnsAxis().unregisterChangedListener(this);
		queryModel.getFreeAxis().unregisterChangedListener(this);
		queryModel.getMeasureDimension().unregisterChangedListener(this);
		var dimensions = queryModel.getDimensions();
		for (var i = 0; i < dimensions.size(); i++)
		{
			var dimension = dimensions.get(i);
			if (!dimension.isStructure())
			{
				continue;
			}
			var allStructureMembers = dimension.getAllStructureMembers();
			for (var j = 0; j < allStructureMembers.size(); j++)
			{
				allStructureMembers.get(j).unregisterChangedListener(this);
			}
		}
	}
};
oFF.AuGdsQdNavigationPanel.prototype.onMenuAction = function()
{
	this.notifyEditActionListeners();
};
oFF.AuGdsQdNavigationPanel.prototype.notifyEditActionListeners = function()
{
	for (var i = 0; i < this.m_editActionListeners.size(); i++)
	{
		this.m_editActionListeners.get(i).notifyEditAction();
	}
};
oFF.AuGdsQdNavigationPanel.prototype.onModelComponentChanged = function(modelComponent, customIdentifier)
{
	if (this.m_ignoreEvent)
	{
		return;
	}
	this.updateIcons();
	this.updateCheckboxes();
};
oFF.AuGdsQdNavigationPanel.prototype.updateLabels = function()
{
	for (var i = 0; i < this.m_dimComponents.size(); i++)
	{
		var structureComponent = this.m_dimComponents.get(i);
		var dimension = structureComponent.getDimension();
		if (!dimension.isMeasureStructure())
		{
			structureComponent.getLabel().setText(this.getPresentationType().getDisplayValue(dimension));
		}
		var members = structureComponent.getMembers();
		for (var j = 0; j < members.size(); j++)
		{
			var memberComponent = members.get(j);
			var member = memberComponent.getMember();
			memberComponent.getLabel().setText(this.getPresentationType().getDisplayValue(member));
		}
	}
};
oFF.AuGdsQdNavigationPanel.prototype.updateIcons = function()
{
	for (var i = 0; i < this.m_dimComponents.size(); i++)
	{
		var structureComponent = this.m_dimComponents.get(i);
		var dim = structureComponent.getDimension();
		var rowIcon = structureComponent.getRowIcon();
		if (!rowIcon.isEnabled())
		{
			rowIcon.setColor(oFF.AuGdsQdNavigationPanel.TRANSPARENT_GREY);
		}
		else
		{
			rowIcon.setColor(dim.getAxisType() === oFF.AxisType.ROWS ? oFF.AuGdsQdNavigationPanel.DARK_BLUE : oFF.UiColor.GREY);
		}
		var colIcon = structureComponent.getColumnIcon();
		if (!colIcon.isEnabled())
		{
			colIcon.setColor(oFF.AuGdsQdNavigationPanel.TRANSPARENT_GREY);
		}
		else
		{
			colIcon.setColor(dim.getAxisType() === oFF.AxisType.COLUMNS ? oFF.AuGdsQdNavigationPanel.DARK_BLUE : oFF.UiColor.GREY);
		}
	}
};
oFF.AuGdsQdNavigationPanel.prototype.updateCheckboxes = function()
{
	for (var i = 0; i < this.m_dimComponents.size(); i++)
	{
		var structureComponent = this.m_dimComponents.get(i);
		this.updateMasterCheckbox(structureComponent);
		var members = structureComponent.getMembers();
		for (var j = 0; j < members.size(); j++)
		{
			var memberComponent = members.get(j);
			var member = memberComponent.getMember();
			var checkbox = memberComponent.getCheckbox();
			checkbox.setChecked(member.getResultVisibility() !== oFF.ResultVisibility.HIDDEN);
		}
	}
};
oFF.AuGdsQdNavigationPanel.prototype.updateMasterCheckbox = function(structureComponent)
{
	var oneChecked = false;
	var allChecked = true;
	var memberComponents = structureComponent.getMembers();
	for (var i = 0; i < memberComponents.size(); i++)
	{
		var memberComponent = memberComponents.get(i);
		var visible = memberComponent.getMember().getResultVisibility() === oFF.ResultVisibility.VISIBLE;
		oneChecked = oneChecked || visible;
		allChecked = allChecked && visible;
	}
	var allCb = structureComponent.getAllCb();
	allCb.setChecked(oneChecked);
	allCb.setPartiallyChecked(!allChecked);
};
oFF.AuGdsQdNavigationPanel.prototype.clearEditActionListeners = function()
{
	this.m_editActionListeners.clear();
};
oFF.AuGdsQdNavigationPanel.prototype.onMoreButtonPressed = function(panel, clickedIcon)
{
	var menu = this.getGenesis().newControl(oFF.UiType.MENU);
	this.extendMenuWithDisplayOptions(menu,  function(){
		this.updateLabels();
	}.bind(this));
	menu.openAt(clickedIcon);
};

oFF.AuGdsQdPanelPresentation = function() {};
oFF.AuGdsQdPanelPresentation.prototype = new oFF.XConstant();
oFF.AuGdsQdPanelPresentation.prototype._ff_c = "AuGdsQdPanelPresentation";

oFF.AuGdsQdPanelPresentation.ID = null;
oFF.AuGdsQdPanelPresentation.DESCRIPTION = null;
oFF.AuGdsQdPanelPresentation.ID_AND_DESCRIPTION = null;
oFF.AuGdsQdPanelPresentation.DESCRIPTION_AND_ID = null;
oFF.AuGdsQdPanelPresentation.staticSetup = function()
{
	oFF.AuGdsQdPanelPresentation.ID = oFF.XConstant.setupName(new oFF.AuGdsQdPanelPresentation(), "id");
	oFF.AuGdsQdPanelPresentation.DESCRIPTION = oFF.XConstant.setupName(new oFF.AuGdsQdPanelPresentation(), "description");
	oFF.AuGdsQdPanelPresentation.ID_AND_DESCRIPTION = oFF.XConstant.setupName(new oFF.AuGdsQdPanelPresentation(), "idAndDescription");
	oFF.AuGdsQdPanelPresentation.DESCRIPTION_AND_ID = oFF.XConstant.setupName(new oFF.AuGdsQdPanelPresentation(), "descriptionAndId");
};
oFF.AuGdsQdPanelPresentation.prototype.getDisplayValue = function(obj)
{
	if (this === oFF.AuGdsQdPanelPresentation.ID)
	{
		return obj.getName();
	}
	else if (this === oFF.AuGdsQdPanelPresentation.DESCRIPTION)
	{
		return obj.getText();
	}
	else if (this === oFF.AuGdsQdPanelPresentation.ID_AND_DESCRIPTION)
	{
		return oFF.XStringUtils.concatenate4(obj.getName(), " (", obj.getText(), ")");
	}
	else if (this === oFF.AuGdsQdPanelPresentation.DESCRIPTION_AND_ID)
	{
		return oFF.XStringUtils.concatenate4(obj.getText(), " (", obj.getName(), ")");
	}
	throw oFF.XException.createIllegalArgumentException("unknown presentation type");
};

oFF.AuProteusShell = function() {};
oFF.AuProteusShell.prototype = new oFF.DfProgram();
oFF.AuProteusShell.prototype._ff_c = "AuProteusShell";

oFF.AuProteusShell.DEFAULT_PROGRAM_NAME = "Proteus";
oFF.AuProteusShell.OUTPUT_DIR = "output";
oFF.AuProteusShell.prototype.m_proteusEngine = null;
oFF.AuProteusShell.prototype.m_quasarJsonDocument = null;
oFF.AuProteusShell.prototype.m_inputFile = null;
oFF.AuProteusShell.prototype.m_outputDir = null;
oFF.AuProteusShell.prototype.newProgram = function()
{
	var newPrg = new oFF.AuProteusShell();
	newPrg.setup();
	return newPrg;
};
oFF.AuProteusShell.prototype.doSetupProgramMetadata = function(metadata)
{
	oFF.DfProgram.prototype.doSetupProgramMetadata.call( this , metadata);
	metadata.addOption(oFF.DfProgram.PARAM_FILE, "Specify the quasar file", "Path to the file", oFF.XValueType.STRING);
	metadata.addOption(oFF.AuProteusShell.OUTPUT_DIR, "Specify the output directory", "The path to the output directory", oFF.XValueType.STRING);
};
oFF.AuProteusShell.prototype.evalArguments = function()
{
	oFF.DfProgram.prototype.evalArguments.call( this );
	var session = this.getSession();
	var argStruct = this.getArgumentStructure();
	var inputFile = argStruct.getStringByKey(oFF.DfProgram.PARAM_FILE);
	if (oFF.XStringUtils.isNotNullAndNotEmpty(inputFile) === true)
	{
		this.m_inputFile = oFF.XFile.createExt(session, inputFile, oFF.PathFormat.AUTO_DETECT, oFF.VarResolveMode.DOLLAR);
	}
	var outputDir = argStruct.getStringByKey(oFF.TeAthena.PARAM_TYPE);
	if (oFF.XStringUtils.isNotNullAndNotEmpty(outputDir) === true)
	{
		this.m_outputDir = oFF.XFile.createExt(session, outputDir, oFF.PathFormat.AUTO_DETECT, oFF.VarResolveMode.DOLLAR);
	}
	if (oFF.isNull(this.m_outputDir))
	{
		this.m_outputDir = oFF.XFile.createExt(session, "${ff_tmp}/proteus/", oFF.PathFormat.AUTO_DETECT, oFF.VarResolveMode.DOLLAR);
	}
};
oFF.AuProteusShell.prototype.releaseObject = function()
{
	this.m_quasarJsonDocument = null;
	this.m_inputFile = oFF.XObjectExt.release(this.m_inputFile);
	this.m_outputDir = oFF.XObjectExt.release(this.m_outputDir);
	this.m_proteusEngine = oFF.XObjectExt.release(this.m_proteusEngine);
	oFF.DfProgram.prototype.releaseObject.call( this );
};
oFF.AuProteusShell.prototype.runProcess = function()
{
	this.println("Proteus quasar -> ui5 converter tool");
	this.loadQuasarFile();
	this.exitNow(0);
	return false;
};
oFF.AuProteusShell.prototype.loadQuasarFile = function()
{
	if (oFF.isNull(this.m_inputFile))
	{
		var filePath = "${ff_sdk}/production/queries/proteus/simple_quasar.qsa";
		var session = this.getSession();
		this.m_inputFile = oFF.XFile.createExt(session, filePath, oFF.PathFormat.AUTO_DETECT, oFF.VarResolveMode.DOLLAR);
	}
	this.m_inputFile.processLoad(oFF.SyncType.NON_BLOCKING, this, null, oFF.CompressionType.NONE);
};
oFF.AuProteusShell.prototype.createEngineAndRun = function()
{
	if (oFF.notNull(this.m_quasarJsonDocument) && this.m_quasarJsonDocument.size() > 0)
	{
		this.println("Processing document!");
		this.m_proteusEngine = oFF.AuProteusEngine.createEngine(this.m_quasarJsonDocument);
		this.m_proteusEngine.convert();
	}
	else
	{
		this.println("Specified file is empty or not a quasar document");
	}
};
oFF.AuProteusShell.prototype.saveOutput = function()
{
	if (oFF.notNull(this.m_proteusEngine))
	{
		if (this.m_proteusEngine.hasErrors())
		{
			var errorsIterator = this.m_proteusEngine.getParsingErrors().getIterator();
			while (errorsIterator.hasNext())
			{
				this.println(errorsIterator.next());
			}
		}
		else
		{
			this.println("Quasar document successfully converted!");
		}
		this.println(oFF.XStringUtils.concatenate2("Saving output to: ", this.m_outputDir.getNativePath()));
		this.saveIndexHtmlTempalteToFile();
		this.saveViewFile(this.m_proteusEngine.getXmlViewContent());
		this.println("Successfully saved!");
	}
};
oFF.AuProteusShell.prototype.saveIndexHtmlTempalteToFile = function()
{
	if (oFF.isNull(this.m_outputDir))
	{
		this.println("Output directory cannot be found!");
	}
	else
	{
		if (this.m_outputDir.isExisting() === false)
		{
			this.m_outputDir.mkdirs();
		}
		var file = this.m_outputDir.newChild("index.html");
		if (oFF.isNull(file))
		{
			this.println("Cannot save!");
		}
		else
		{
			var fileContentToSave = oFF.XByteArray.convertFromString(this.m_proteusEngine.getHtmlFileContent());
			file.saveByteArray(fileContentToSave);
			this.println("HTML file saved!");
		}
	}
};
oFF.AuProteusShell.prototype.saveViewFile = function(viewStr)
{
	if (oFF.isNull(this.m_outputDir))
	{
		this.println("Output directory cannot be found!");
	}
	else
	{
		var viewDir = this.m_outputDir.newChild("views/");
		if (viewDir.isExisting() === false)
		{
			viewDir.mkdirs();
		}
		var viewfile = viewDir.newChild("Main.view.xml");
		if (oFF.isNull(viewfile))
		{
			this.println("Cannot save!");
		}
		else
		{
			var fileContentToSave = oFF.XByteArray.convertFromString(viewStr);
			viewfile.saveByteArray(fileContentToSave);
			this.println("View file saved!");
		}
	}
};
oFF.AuProteusShell.prototype.onFileLoaded = function(extResult, file, fileContent, customIdentifier)
{
	if (extResult.isValid())
	{
		if (oFF.notNull(fileContent))
		{
			var stringContent = fileContent.getString();
			if (oFF.XStringUtils.isNotNullAndNotEmpty(stringContent))
			{
				var parser = oFF.JsonParserFactory.newInstance();
				var jsonContent = parser.parse(stringContent);
				if (oFF.notNull(jsonContent))
				{
					if (parser.hasErrors())
					{
						this.print("Could not read document!");
					}
					else
					{
						oFF.XObjectExt.release(parser);
						if (jsonContent.isStructure())
						{
							this.println("File loaded!");
							this.m_quasarJsonDocument = jsonContent;
							this.createEngineAndRun();
							this.saveOutput();
						}
					}
				}
				else
				{
					this.println("Document is not a json!");
				}
			}
		}
	}
	else
	{
		this.println("Failed to laod file!");
	}
};

oFF.GyrosCommand = function() {};
oFF.GyrosCommand.prototype = new oFF.XConstant();
oFF.GyrosCommand.prototype._ff_c = "GyrosCommand";

oFF.GyrosCommand.s_commands = null;
oFF.GyrosCommand.SET_HIERARCHY_ON_COUNTRY_DIM = null;
oFF.GyrosCommand.FILTER_ON_AUSTRALIA = null;
oFF.GyrosCommand.FILTER_TYPE_ON_GERMANY = null;
oFF.GyrosCommand.DUPLICATE_AND_LINK_INTERSECT = null;
oFF.GyrosCommand.DUPLICATE_AND_LINK_UNION = null;
oFF.GyrosCommand.LINK_BICS_ATTRIBUTE_VARIABLES_INTERSECT = null;
oFF.GyrosCommand.LINK_BICS_ATTRIBUTE_VARIABLES_UNION = null;
oFF.GyrosCommand.LINK_NONSENSE = null;
oFF.GyrosCommand.LINK_CUSTOMER_ON_DIFFERENT_HIERARCHIES = null;
oFF.GyrosCommand.CLONE_QUERY_MANAGER = null;
oFF.GyrosCommand.SET_VARIABLES_VALUE_Q0005_MS = null;
oFF.GyrosCommand.ADD_MATCH_FILTER = null;
oFF.GyrosCommand.AUGMENT_CURRENCY_VARIABLE = null;
oFF.GyrosCommand.CLEAR_DYNAMIC_FILTER = null;
oFF.GyrosCommand.PURGE_TEST_VARIANTS = null;
oFF.GyrosCommand.staticSetupGyrosCommands = function()
{
	oFF.GyrosCommand.s_commands = oFF.XListOfNameObject.create();
	oFF.GyrosCommand.SET_HIERARCHY_ON_COUNTRY_DIM = oFF.GyrosCommand.createCommand("SetHierarchyOnCountryDim", "Set hierarchy on dim 0BC_COUN");
	oFF.GyrosCommand.FILTER_ON_AUSTRALIA = oFF.GyrosCommand.createCommand("FilterOnAustralia", "Filter on country Australia");
	oFF.GyrosCommand.FILTER_TYPE_ON_GERMANY = oFF.GyrosCommand.createCommand("FilterTypeOnGermany", "Filter type on country Germany");
	oFF.GyrosCommand.DUPLICATE_AND_LINK_INTERSECT = oFF.GyrosCommand.createCommand("DuplicateAndLinkIntersect", "Duplicate and link intersect");
	oFF.GyrosCommand.DUPLICATE_AND_LINK_UNION = oFF.GyrosCommand.createCommand("DuplicateAndLinkUnion", "Duplicate and link union");
	oFF.GyrosCommand.LINK_BICS_ATTRIBUTE_VARIABLES_INTERSECT = oFF.GyrosCommand.createCommand("BicsAttributeVariablesIntersect", "Intersect link BICS_ATTRIBUTE_VARIABLES");
	oFF.GyrosCommand.LINK_BICS_ATTRIBUTE_VARIABLES_UNION = oFF.GyrosCommand.createCommand("BicsAttributeVariablesUnion", "Union link BICS_ATTRIBUTE_VARIABLES");
	oFF.GyrosCommand.LINK_NONSENSE = oFF.GyrosCommand.createCommand("NonsenseIntersect", "Intersect completely different variables");
	oFF.GyrosCommand.LINK_CUSTOMER_ON_DIFFERENT_HIERARCHIES = oFF.GyrosCommand.createCommand("LinkCustomerOnDifferentHierarchies", "Link customer variable with hierarchy 0BICS_HIER_CUST_TIME_DEP_2");
	oFF.GyrosCommand.CLONE_QUERY_MANAGER = oFF.GyrosCommand.createCommand("CloneQueryManager", "Clone the Gyros QueryManager");
	oFF.GyrosCommand.SET_VARIABLES_VALUE_Q0005_MS = oFF.GyrosCommand.createCommand("SetVariableValueQ0005MS", "Set variable values for query 0BICS_C03_BICSTEST_Q0005_MS");
	oFF.GyrosCommand.ADD_MATCH_FILTER = oFF.GyrosCommand.createCommand("AddMatchFilter", "Add match filter on variable 0BC_TYPE_SE");
	oFF.GyrosCommand.AUGMENT_CURRENCY_VARIABLE = oFF.GyrosCommand.createCommand("AugmentCurrencyVariable", "Add a currency variable");
	oFF.GyrosCommand.CLEAR_DYNAMIC_FILTER = oFF.GyrosCommand.createCommand("ClearDynamicFilter", "Clear dynamic filter");
	oFF.GyrosCommand.PURGE_TEST_VARIANTS = oFF.GyrosCommand.createCommand("PurgeTestVariants", oFF.XStringUtils.concatenate3("Delete all test variants (", oFF.Gyros.TEST_VARIANT_PREFIX, "...)"));
};
oFF.GyrosCommand.createCommand = function(name, description)
{
	var cmd = new oFF.GyrosCommand();
	cmd._setupInternal(name);
	cmd.m_description = description;
	oFF.GyrosCommand.s_commands.add(cmd);
	return cmd;
};
oFF.GyrosCommand.getAllCommands = function()
{
	return oFF.GyrosCommand.s_commands;
};
oFF.GyrosCommand.getByName = function(name)
{
	return oFF.GyrosCommand.s_commands.getByKey(name);
};
oFF.GyrosCommand.prototype.m_description = null;
oFF.GyrosCommand.prototype.execute = function(gyros)
{
	var queryManager = gyros.getQueryManager();
	if (oFF.notNull(queryManager))
	{
		var queryModel = queryManager.getQueryModel();
		var name = this.getName();
		if (oFF.XString.isEqual(name, oFF.GyrosCommand.SET_HIERARCHY_ON_COUNTRY_DIM.getName()))
		{
			queryModel.getConvenienceCommands().setDimensionHierarchy("0BC_COUN", "0BICS_COUN_DEEP_4", true, 0);
			if (!queryModel.getDimensionByName("0BC_COUN").isHierarchyActive())
			{
				throw oFF.XException.createIllegalStateException("Hierarchy could not be set.");
			}
		}
		else if (oFF.XString.isEqual(name, oFF.GyrosCommand.FILTER_ON_AUSTRALIA.getName()))
		{
			queryModel.getConvenienceCommands().addSingleMemberFilterByDimensionName("0BC_COUN", "AUS", oFF.ComparisonOperator.EQUAL);
		}
		else if (oFF.XString.isEqual(name, oFF.GyrosCommand.FILTER_TYPE_ON_GERMANY.getName()))
		{
			queryModel.getConvenienceCommands().addSingleMemberFilterByDimensionName("0BC_TYPE", "0HIER_NODE!DE", oFF.ComparisonOperator.EQUAL);
		}
		else if (oFF.XString.isEqual(name, oFF.GyrosCommand.DUPLICATE_AND_LINK_INTERSECT.getName()) || oFF.XString.isEqual(name, oFF.GyrosCommand.DUPLICATE_AND_LINK_UNION.getName()))
		{
			var isIntersect = oFF.XString.isEqual(name, oFF.GyrosCommand.DUPLICATE_AND_LINK_INTERSECT.getName());
			gyros.setLinkage(this.createDuplicateLinkage(gyros, isIntersect ? oFF.OrcaLinkVarJoinMode.INTERSECT : oFF.OrcaLinkVarJoinMode.UNION));
		}
		else if (oFF.XString.isEqual(name, oFF.GyrosCommand.LINK_BICS_ATTRIBUTE_VARIABLES_INTERSECT.getName()) || oFF.XString.isEqual(name, oFF.GyrosCommand.LINK_BICS_ATTRIBUTE_VARIABLES_UNION.getName()))
		{
			var isIntersect1 = oFF.XString.isEqual(name, oFF.GyrosCommand.LINK_BICS_ATTRIBUTE_VARIABLES_INTERSECT.getName());
			gyros.setLinkage(this.createBicsAttributeVariablesLinkage(gyros, isIntersect1 ? oFF.OrcaLinkVarJoinMode.INTERSECT : oFF.OrcaLinkVarJoinMode.UNION));
		}
		else if (oFF.XString.isEqual(name, oFF.GyrosCommand.LINK_NONSENSE.getName()))
		{
			gyros.setLinkage(this.createNonsenseLink(gyros, oFF.OrcaLinkVarJoinMode.INTERSECT));
		}
		else if (oFF.XString.isEqual(name, oFF.GyrosCommand.LINK_CUSTOMER_ON_DIFFERENT_HIERARCHIES.getName()))
		{
			gyros.setLinkage(this.createDifferentHierarchyLinkage(gyros));
		}
		else if (oFF.XString.isEqual(name, oFF.GyrosCommand.CLONE_QUERY_MANAGER.getName()))
		{
			gyros.getQueryManager().cloneQueryManager();
		}
		else if (oFF.XString.isEqual(name, oFF.GyrosCommand.SET_VARIABLES_VALUE_Q0005_MS.getName()))
		{
			var variableProcessor = gyros.getQueryManager().getVariableProcessor();
			var varCountry = variableProcessor.getVariable("0BC_COUN_WERTEBEREICH");
			varCountry.setValueByString("DE");
		}
		else if (oFF.XString.isEqual(name, oFF.GyrosCommand.ADD_MATCH_FILTER.getName()))
		{
			this.addMatchFilter(queryModel);
		}
		else if (oFF.XString.isEqual(name, oFF.GyrosCommand.AUGMENT_CURRENCY_VARIABLE.getName()))
		{
			var path = "${ff_sdk}/production/queries/test/olap/fusion/TestOlapFusionCustomVariableCurrencyConversion/minimalAugment.json";
			var file = oFF.XFile.createExt(queryManager.getSession(), path, oFF.PathFormat.AUTO_DETECT, oFF.VarResolveMode.DOLLAR);
			if (oFF.isNull(file) || !file.isExisting())
			{
				throw oFF.XException.createIllegalStateException("File for augment not found.");
			}
			var syncAction = file.processLoad(oFF.SyncType.BLOCKING, null, null, oFF.CompressionType.NONE);
			if (syncAction.hasErrors() || file.getFileContent().getString() === null)
			{
				throw oFF.XException.createIllegalStateException("File for augment could not be loaded.");
			}
			var jsonModel = file.getFileContent().getJsonContent();
			var modellerResponse = oFF.XContent.createJsonObjectContent(oFF.QModelFormat.SFX, jsonModel);
			var docConverter = oFF.DocConverterFactory.createDocConverter(oFF.QModelFormat.SFX, oFF.QModelFormat.INA_REPOSITORY);
			var extConverterResult = docConverter.convert(queryManager.getApplication(), modellerResponse, oFF.QModelFormat.INA_REPOSITORY);
			var inaRepoData = extConverterResult.getData();
			queryManager.getQueryModel().deserializeExt(oFF.QModelFormat.INA_REPOSITORY, inaRepoData.toString());
		}
		else if (oFF.XString.isEqual(name, oFF.GyrosCommand.CLEAR_DYNAMIC_FILTER.getName()))
		{
			queryModel.getConvenienceCommands().clearFilters();
		}
		else if (oFF.XString.isEqual(name, oFF.GyrosCommand.PURGE_TEST_VARIANTS.getName()))
		{
			oFF.XStream.of(queryManager.getVariableVariants()).filter( function(v1){
				return oFF.XString.startsWith(v1.getName(), oFF.Gyros.TEST_VARIANT_PREFIX) || oFF.XString.startsWith(v1.getText(), oFF.Gyros.TEST_VARIANT_PREFIX);
			}.bind(this)).forEach( function(v2){
				queryManager.deleteVariableVariant(v2, oFF.SyncType.BLOCKING, null, null);
			}.bind(this));
		}
	}
};
oFF.GyrosCommand.prototype.addMatchFilter = function(queryModel)
{
	var variable = queryModel.getVariable("0BC_TYPE_SE");
	var dimension = variable.getDimension();
	var memberFilter = variable.getMemberFilter();
	memberFilter.addSupplementField(dimension.getDisplayKeyField());
	memberFilter.addSupplementField(dimension.getTextField());
	var filter = memberFilter.addNewCartesianElement();
	filter.setComparisonOperator(oFF.ComparisonOperator.MATCH);
	filter.setField(dimension.getKeyField());
	var low = filter.getLow();
	low.setString("C");
	low.addSupplementValue(dimension.getDisplayKeyField().getName(), "C");
	low.addSupplementValue(dimension.getTextField().getName(), "NSW Soft");
};
oFF.GyrosCommand.prototype.createBicsAttributeVariablesLinkage = function(gyros, mode)
{
	var result = oFF.XHashMapByString.create();
	var queryManager = gyros.getQueryManager();
	var application = queryManager.getApplication();
	var dataSourceName = queryManager.getDataSource().getFullQualifiedName();
	if (!oFF.XString.isEqual(dataSourceName, "view:[_SYS_BIC][bics.variables][BICS_ATTRIBUTE_VARIABLES]"))
	{
		return result;
	}
	var systemName = queryManager.getSystemName();
	var serviceConfig = oFF.QueryServiceConfig.createWithDataSourceName(application, systemName, "view:[_SYS_BIC][bics.other][BICS_MEMBERS_WITH_EMPTY_AND_NULL_KEYS]");
	var syncAction = serviceConfig.processQueryManagerCreation(oFF.SyncType.BLOCKING, null, null);
	if (syncAction.hasErrors())
	{
		return result;
	}
	var linkQueryManager = syncAction.getData();
	var linkVar = linkQueryManager.getVariable("INT_ID_VAR");
	var mainVar1 = queryManager.getVariable("CUSTOMER_M_S");
	result.put(mainVar1.getName(), oFF.XPair.create(mode, oFF.XCollectionUtils.singletonList(linkVar)));
	var mainVar2 = queryManager.getVariable("PRODUCT_M_I");
	result.put(mainVar2.getName(), oFF.XPair.create(mode, oFF.XCollectionUtils.singletonList(linkVar)));
	return result;
};
oFF.GyrosCommand.prototype.createDuplicateLinkage = function(gyros, mode)
{
	var result = oFF.XHashMapByString.create();
	var mainQueryManager = gyros.getQueryManager();
	var systemName = mainQueryManager.getSystemName();
	var dataSource = mainQueryManager.getDataSource();
	var serviceConfig = oFF.QueryServiceConfig.createWithDataSourceName(gyros.getApplication(), systemName, dataSource.getFullQualifiedName());
	var syncAction = serviceConfig.processQueryManagerCreation(oFF.SyncType.BLOCKING, null, null);
	if (syncAction.hasErrors())
	{
		return result;
	}
	var linkQueryManager = syncAction.getData();
	var variables = mainQueryManager.getInputEnabledAndNonTechnicalVariables();
	for (var i = 0; i < variables.size(); i++)
	{
		var mainVariable = variables.get(i);
		var varName = mainVariable.getName();
		var linkedVariable = linkQueryManager.getVariable(varName);
		result.put(varName, oFF.XPair.create(mode, oFF.XCollectionUtils.singletonList(linkedVariable)));
	}
	return result;
};
oFF.GyrosCommand.prototype.createDifferentHierarchyLinkage = function(gyros)
{
	var result = oFF.XHashMapByString.create();
	var mainQueryManager = gyros.getQueryManager();
	var systemName = mainQueryManager.getSystemName();
	var dataSource = mainQueryManager.getDataSource();
	var serviceConfig = oFF.QueryServiceConfig.createWithDataSourceName(gyros.getApplication(), systemName, dataSource.getFullQualifiedName());
	var syncAction = serviceConfig.processQueryManagerCreation(oFF.SyncType.BLOCKING, null, null);
	if (syncAction.hasErrors())
	{
		return result;
	}
	var linkQueryManager = syncAction.getData();
	linkQueryManager.getVariable("0BC_CUST_HIERARCHY_INPUT").setValueByString("0BICS_HIER_CUST_TIME_DEP_2");
	result.put("0BC_CUST_NODE", oFF.XPair.create(oFF.OrcaLinkVarJoinMode.INTERSECT, oFF.XCollectionUtils.singletonList(linkQueryManager.getVariable("0BC_CUST_NODE"))));
	return result;
};
oFF.GyrosCommand.prototype.createNonsenseLink = function(gyros, mode)
{
	var result = oFF.XHashMapByString.create();
	var mainQueryManager = gyros.getQueryManager();
	if (!oFF.XString.isEqual(mainQueryManager.getDataSource().getFullQualifiedName(), "query:[][][0BOC_TEST_VARIABLE_TYPES_1]"))
	{
		return result;
	}
	var systemName = mainQueryManager.getSystemName();
	var serviceConfig = oFF.QueryServiceConfig.createWithDataSourceName(gyros.getApplication(), systemName, "query:[0BOC_TEST_VARIABLE_TYPES_2]");
	var syncAction = serviceConfig.processQueryManagerCreation(oFF.SyncType.BLOCKING, null, null);
	if (syncAction.hasErrors())
	{
		return result;
	}
	var mainVariable = mainQueryManager.getVariable("0BICS_PCOUN");
	var linkedVariable = syncAction.getData().getVariable("0BC_CUST_HIERARCHY_INPUT");
	result.put(mainVariable.getName(), oFF.XPair.create(mode, oFF.XCollectionUtils.singletonList(linkedVariable)));
	return result;
};
oFF.GyrosCommand.prototype.getDescription = function()
{
	return this.m_description;
};

oFF.AnalyticCardsProgram = function() {};
oFF.AnalyticCardsProgram.prototype = new oFF.DfApplicationProgram();
oFF.AnalyticCardsProgram.prototype._ff_c = "AnalyticCardsProgram";

oFF.AnalyticCardsProgram.DEFAULT_PROGRAM_NAME = "AnalyticCards";
oFF.AnalyticCardsProgram.SYSTEM_NAME = "system";
oFF.AnalyticCardsProgram.STORY_ID = "story";
oFF.AnalyticCardsProgram.CHART_WIDTH = "width";
oFF.AnalyticCardsProgram.CHART_HEIGHT = "height";
oFF.AnalyticCardsProgram.main = function()
{
	oFF.ApplicationUiModule.getInstance();
	var anaCard = oFF.KernelBoot.createByName(oFF.AnalyticCardsProgram.DEFAULT_PROGRAM_NAME);
	anaCard.setArgument("story", "87FE2F7A2943E2C3804B171509035B7");
	anaCard.setArgument("system", "starkiller");
	anaCard.setDefaultSyncType(oFF.SyncType.BLOCKING);
	anaCard.runFull();
};
oFF.AnalyticCardsProgram.prototype.m_systemName = null;
oFF.AnalyticCardsProgram.prototype.m_storyId = null;
oFF.AnalyticCardsProgram.prototype.m_chartHeight = 0;
oFF.AnalyticCardsProgram.prototype.m_chartWidth = 0;
oFF.AnalyticCardsProgram.prototype.m_orcaService = null;
oFF.AnalyticCardsProgram.prototype.newProgram = function()
{
	var newPrg = new oFF.AnalyticCardsProgram();
	newPrg.setup();
	return newPrg;
};
oFF.AnalyticCardsProgram.prototype.doSetupProgramMetadata = function(metadata)
{
	oFF.DfApplicationProgram.prototype.doSetupProgramMetadata.call( this , metadata);
	metadata.addOption(oFF.AnalyticCardsProgram.SYSTEM_NAME, "The system name", "", oFF.XValueType.STRING);
	metadata.addOption(oFF.AnalyticCardsProgram.STORY_ID, "The story id name", "", oFF.XValueType.STRING);
	metadata.addOption(oFF.AnalyticCardsProgram.CHART_HEIGHT, "The chart height in px", "", oFF.XValueType.STRING);
	metadata.addOption(oFF.AnalyticCardsProgram.CHART_WIDTH, "The chart width in px", "", oFF.XValueType.STRING);
};
oFF.AnalyticCardsProgram.prototype.runProcess = function()
{
	var initArguments = this.getArgumentStructure();
	if (oFF.notNull(initArguments))
	{
		this.m_systemName = initArguments.getStringByKey(oFF.AnalyticCardsProgram.SYSTEM_NAME);
		this.m_storyId = initArguments.getStringByKey(oFF.AnalyticCardsProgram.STORY_ID);
		this.m_chartHeight = oFF.XInteger.convertFromString(initArguments.getStringByKeyExt(oFF.AnalyticCardsProgram.CHART_HEIGHT, "0"));
		this.m_chartWidth = oFF.XInteger.convertFromString(initArguments.getStringByKeyExt(oFF.AnalyticCardsProgram.CHART_WIDTH, "0"));
		var systemLandscape = this.getApplication().getSystemLandscape();
		if (oFF.XStringUtils.containsString(this.m_systemName, "http://", true) || oFF.XStringUtils.containsString(this.m_systemName, "https://", true))
		{
			var sysUri = oFF.XUri.createFromUrl(this.m_systemName);
			this.m_systemName = oFF.OcOrcaServiceConfig.ORCA_MASTER_SYSTEM_NAME;
			systemLandscape.setSystemByUri(this.m_systemName, sysUri, null);
		}
		else
		{
			systemLandscape.setMasterSystemName(this.m_systemName);
		}
		var config = oFF.OcOrcaServiceConfig.create(this.getApplication(), this.m_systemName);
		var orcaAction = config.processOrcaServiceCreation(oFF.SyncType.BLOCKING, null, null);
		this.log(orcaAction.getSummary());
		if (orcaAction.isValid())
		{
			this.m_orcaService = orcaAction.getData();
			if (oFF.notNull(this.m_orcaService))
			{
				var landscapeLoadAction = this.m_orcaService.processSystemLandscapeLoad(oFF.SyncType.BLOCKING, null, null, null);
				this.log(landscapeLoadAction.getSummary());
				var systems = landscapeLoadAction.getData();
				for (var i = 0; i < systems.size(); i++)
				{
					var systemDescription = systems.get(i);
					systemLandscape.setSystemByDescription(systemDescription);
				}
				var storyAction = this.m_orcaService.processStoryLoad(null, null, null, this.m_storyId);
				this.log(storyAction.getSummary());
				var story = storyAction.getData();
				var quasarStory = oFF.OcQuasarStory.create(story);
				quasarStory.setQuasarMainLayoutType(oFF.OcLayoutType.CANVAS);
				var storyDef = quasarStory.getQuasarCompositeAnalyticalCardDocument();
				var quasarEngine = oFF.QuasarEngine.create(this.getApplication());
				quasarEngine.setDocument(storyDef);
				var uiManager = oFF.UiServerManager.create(this.getSession(), oFF.XPlatform.GENERIC);
				var process = this.getProcess();
				process.setEntity(oFF.ProcessEntity.GUI, uiManager);
				var selector = process.getSelector();
				selector.registerSelector(oFF.SigSelDomain.UI, uiManager.getSigSelProviderSelector());
				selector.registerSelector(oFF.SigSelDomain.DIALOG, uiManager.getSigSelProviderSelector());
				var genesis = oFF.UiGenesis.create(uiManager.getAnchor(), oFF.UiItemPosition.CONTENT, oFF.UiOperation.SET, 0, 0);
				quasarEngine.buildUi(genesis);
				var output = this.constructOutput(uiManager);
				var content = oFF.XContent.createContent();
				this.addDimensionsToChartJson(output, this.m_chartHeight, this.m_chartWidth);
				content.setJsonObject(output);
				this.getProgramContainer().setExitContent(content);
				this.println(output.toString());
			}
		}
		else
		{
			oFF.XLogger.println(orcaAction.getSummary());
		}
		return false;
	}
	return false;
};
oFF.AnalyticCardsProgram.prototype.addDimensionsToChartJson = function(output, height, width)
{
	if (oFF.notNull(output) && output.containsKey("chart"))
	{
		var chartStructure = output.getStructureByKey("chart");
		if (oFF.notNull(chartStructure))
		{
			var subChartStructure = chartStructure.getStructureByKey("chart");
			if (oFF.notNull(subChartStructure))
			{
				if (width > 0)
				{
					subChartStructure.putInteger("width", width);
				}
				if (height > 0)
				{
					subChartStructure.putInteger("height", height);
				}
			}
		}
	}
};
oFF.AnalyticCardsProgram.prototype.constructOutput = function(uiManager)
{
	var output = oFF.PrFactory.createStructure();
	var selector = uiManager.getSelector();
	var components = selector.selectComponentsByExpr("ui:.Chart", oFF.SigSelDomain.UI, null, 2);
	var uiItem;
	var modelJson;
	if (oFF.notNull(components) && components.size() > 0)
	{
		uiItem = components.get(0);
		modelJson = uiItem.getModelJson();
		output.put("chart", modelJson);
	}
	components = selector.selectComponentsByExpr("ui:.Card", oFF.SigSelDomain.UI, null, 2);
	if (oFF.notNull(components) && components.size() > 0)
	{
		uiItem = components.get(0);
		modelJson = uiItem.getModelJson();
		var modelJsonStruc = modelJson;
		modelJsonStruc = modelJsonStruc.getStructureByKey("sap.card");
		if (oFF.notNull(modelJsonStruc))
		{
			modelJsonStruc = modelJsonStruc.getStructureByKey("header");
			if (oFF.notNull(modelJsonStruc))
			{
				output.put("kpi", modelJsonStruc);
			}
		}
	}
	components = selector.selectComponentsByExpr("ui:.VizGrid", oFF.SigSelDomain.UI, null, 2);
	if (oFF.notNull(components) && components.size() > 0)
	{
		uiItem = components.get(0);
		modelJson = uiItem.getModelJson();
		output.put("grid", modelJson);
	}
	components = selector.selectComponentsByExpr("ui:.Text", oFF.SigSelDomain.UI, null, 2);
	if (oFF.notNull(components) && components.size() > 0)
	{
		var header = output.putNewStructure("header");
		uiItem = components.get(0);
		var text = uiItem.getText();
		header.putString("title", text);
		header.putString("description", text);
		header.putString("publicUrl", components.get(1).getText());
	}
	return output;
};

oFF.LoadSystemsProgram = function() {};
oFF.LoadSystemsProgram.prototype = new oFF.DfApplicationProgram();
oFF.LoadSystemsProgram.prototype._ff_c = "LoadSystemsProgram";

oFF.LoadSystemsProgram.DEFAULT_PROGRAM_NAME = "LoadSystems";
oFF.LoadSystemsProgram.SYSTEM_NAME = "system";
oFF.LoadSystemsProgram.main = function()
{
	oFF.ApplicationUiModule.getInstance();
	oFF.RpcHttpFunction.PRINT_REQUESTS = true;
	oFF.RpcHttpFunction.PRINT_RESPONSES = true;
	oFF.XLogger.getInstance().setLogFilterLevel(3);
	var anaCard = oFF.KernelBoot.createByName(oFF.LoadSystemsProgram.DEFAULT_PROGRAM_NAME);
	anaCard.setArgument("system", "starkiller");
	anaCard.setArgument("loglevel", "0");
	anaCard.setDefaultSyncType(oFF.SyncType.BLOCKING);
	anaCard.runFull();
};
oFF.LoadSystemsProgram.prototype.m_systemName = null;
oFF.LoadSystemsProgram.prototype.m_orcaService = null;
oFF.LoadSystemsProgram.prototype.newProgram = function()
{
	var newPrg = new oFF.LoadSystemsProgram();
	newPrg.setup();
	return newPrg;
};
oFF.LoadSystemsProgram.prototype.doSetupProgramMetadata = function(metadata)
{
	oFF.DfApplicationProgram.prototype.doSetupProgramMetadata.call( this , metadata);
	metadata.addOption(oFF.LoadSystemsProgram.SYSTEM_NAME, "The system name", "", oFF.XValueType.STRING);
};
oFF.LoadSystemsProgram.prototype.runProcess = function()
{
	var initArguments = this.getArgumentStructure();
	if (oFF.notNull(initArguments))
	{
		this.m_systemName = initArguments.getStringByKey(oFF.LoadSystemsProgram.SYSTEM_NAME);
		var systemLandscape = this.getApplication().getSystemLandscape();
		if (oFF.XStringUtils.containsString(this.m_systemName, "http://", true) || oFF.XStringUtils.containsString(this.m_systemName, "https://", true))
		{
			var sysUri = oFF.XUri.createFromUrl(this.m_systemName);
			this.m_systemName = oFF.OcOrcaServiceConfig.ORCA_MASTER_SYSTEM_NAME;
			systemLandscape.setSystemByUri(this.m_systemName, sysUri, null);
		}
		else
		{
			systemLandscape.setMasterSystemName(this.m_systemName);
		}
		var config = oFF.OcOrcaServiceConfig.create(this.getApplication(), this.m_systemName);
		var orcaAction = config.processOrcaServiceCreation(oFF.SyncType.BLOCKING, null, null);
		this.log(orcaAction.getSummary());
		if (orcaAction.isValid())
		{
			this.m_orcaService = orcaAction.getData();
			if (oFF.notNull(this.m_orcaService))
			{
				var landscapeLoadAction = this.m_orcaService.processSystemLandscapeLoad(oFF.SyncType.BLOCKING, null, null, oFF.OrcaSystemConverter.CLIENT_CONTEXT);
				this.log(landscapeLoadAction.getSummary());
				var systems = landscapeLoadAction.getData();
				for (var i = 0; i < systems.size(); i++)
				{
					var systemDescription = systems.get(i);
					systemLandscape.setSystemByDescription(systemDescription);
				}
				var output = this.constructOutput(systemLandscape);
				var content = oFF.XContent.createContent();
				content.setJsonObject(output);
				this.getProgramContainer().setExitContent(content);
				this.println(output.toString());
			}
		}
		else
		{
			oFF.XLogger.println(orcaAction.getSummary());
		}
		return false;
	}
	return false;
};
oFF.LoadSystemsProgram.prototype.constructOutput = function(systemLandscape)
{
	var output = oFF.PrFactory.createStructure();
	var systems = output.putNewStructure("Systems");
	var systemNames = systemLandscape.getSystemNames();
	var systemNamesIterator = systemNames.getIterator();
	while (systemNamesIterator.hasNext())
	{
		var systemName = systemNamesIterator.next();
		var systemDescription = systemLandscape.getSystemDescription(systemName);
		var system = systems.putNewStructure(systemName);
		var properties = systemDescription.getProperties();
		var keys = properties.getKeysAsIteratorOfString();
		while (keys.hasNext())
		{
			var key = keys.next();
			system.putString(key, properties.getByKey(key));
		}
	}
	return output;
};

oFF.AuGdsLambdaSyncAction = function() {};
oFF.AuGdsLambdaSyncAction.prototype = new oFF.SyncAction();
oFF.AuGdsLambdaSyncAction.prototype._ff_c = "AuGdsLambdaSyncAction";

oFF.AuGdsLambdaSyncAction.create = function(context, listener, supplier, delayInMillis)
{
	var instance = new oFF.AuGdsLambdaSyncAction();
	instance.setupAction(oFF.SyncType.NON_BLOCKING, listener, null, context);
	instance.m_resultSupplier = supplier;
	instance.m_delayInMillis = delayInMillis;
	return instance;
};
oFF.AuGdsLambdaSyncAction.prototype.m_resultSupplier = null;
oFF.AuGdsLambdaSyncAction.prototype.m_delayInMillis = 0;
oFF.AuGdsLambdaSyncAction.prototype.m_timerHanlde = null;
oFF.AuGdsLambdaSyncAction.prototype.processSynchronization = function(syncType)
{
	this.m_timerHanlde = oFF.Dispatcher.getInstance().registerTimer(this.m_delayInMillis, this, null);
	return syncType !== oFF.SyncType.BLOCKING;
};
oFF.AuGdsLambdaSyncAction.prototype.releaseObject = function()
{
	this.m_resultSupplier = null;
	oFF.SyncAction.prototype.releaseObject.call( this );
};
oFF.AuGdsLambdaSyncAction.prototype.onTimerEvent = function(timerHandle, customIdentifier)
{
	try
	{
		oFF.Dispatcher.getInstance().unregisterTimer(this.m_timerHanlde);
		var data = this.m_resultSupplier();
		if (this.isSyncCanceled())
		{
			this.addError(2, "Action has been canceled");
		}
		else
		{
			this.setData(data);
		}
		this.endSync();
	}
	catch (t)
	{
		this.addError(1, oFF.XException.getStackTrace(t, 0));
	}
};
oFF.AuGdsLambdaSyncAction.prototype.cancelSynchronization = function()
{
	oFF.Dispatcher.getInstance().unregisterTimer(this.m_timerHanlde);
	this.addError(0, "Canceled");
	oFF.SyncAction.prototype.cancelSynchronization.call( this );
};

oFF.McCellType = function() {};
oFF.McCellType.prototype = new oFF.XConstantWithParent();
oFF.McCellType.prototype._ff_c = "McCellType";

oFF.McCellType.INITIAL = null;
oFF.McCellType.VALUE = null;
oFF.McCellType.STRING = null;
oFF.McCellType.DOUBLE = null;
oFF.McCellType.EXPRESSION = null;
oFF.McCellType.staticSetup = function()
{
	oFF.McCellType.INITIAL = oFF.McCellType.create("Initial", null);
	oFF.McCellType.VALUE = oFF.McCellType.create("Value", null);
	oFF.McCellType.STRING = oFF.McCellType.create("String", oFF.McCellType.VALUE);
	oFF.McCellType.DOUBLE = oFF.McCellType.create("Double", oFF.McCellType.DOUBLE);
	oFF.McCellType.EXPRESSION = oFF.McCellType.create("Expression", null);
};
oFF.McCellType.create = function(name, parent)
{
	var type = new oFF.McCellType();
	type.setupExt(name, parent);
	return type;
};

oFF.AuDatasourcePicker = function() {};
oFF.AuDatasourcePicker.prototype = new oFF.DfUiProgram();
oFF.AuDatasourcePicker.prototype._ff_c = "AuDatasourcePicker";

oFF.AuDatasourcePicker.DEFAULT_PROGRAM_NAME = "DatasourcePicker";
oFF.AuDatasourcePicker.PAGE_SIZE = 25;
oFF.AuDatasourcePicker.MAX_RECENT_RECORDS = 15;
oFF.AuDatasourcePicker.PARAM_APPLICATION = "application";
oFF.AuDatasourcePicker.PARAM_SYSTEM = "system";
oFF.AuDatasourcePicker.PARAM_LISTENER = "listener";
oFF.AuDatasourcePicker.DS_PICKER_RECENT = "dsPicker_recent";
oFF.AuDatasourcePicker.prototype.m_app = null;
oFF.AuDatasourcePicker.prototype.m_systemsByType = null;
oFF.AuDatasourcePicker.prototype.m_currentCatalogManager = null;
oFF.AuDatasourcePicker.prototype.m_currentData = null;
oFF.AuDatasourcePicker.prototype.m_currentPage = 0;
oFF.AuDatasourcePicker.prototype.m_startSystemName = null;
oFF.AuDatasourcePicker.prototype.m_root = null;
oFF.AuDatasourcePicker.prototype.m_systemTypeDd = null;
oFF.AuDatasourcePicker.prototype.m_systemDd = null;
oFF.AuDatasourcePicker.prototype.m_querySearch = null;
oFF.AuDatasourcePicker.prototype.m_queryTbl = null;
oFF.AuDatasourcePicker.prototype.m_left = null;
oFF.AuDatasourcePicker.prototype.m_right = null;
oFF.AuDatasourcePicker.prototype.m_recentTbl = null;
oFF.AuDatasourcePicker.prototype.m_cancelBtn = null;
oFF.AuDatasourcePicker.prototype.m_listener = null;
oFF.AuDatasourcePicker.prototype.newProgram = function()
{
	var prg = new oFF.AuDatasourcePicker();
	prg.setup();
	return prg;
};
oFF.AuDatasourcePicker.prototype.getDefaultProgramDevice = function()
{
	return oFF.ProgramDevice.DIALOG;
};
oFF.AuDatasourcePicker.prototype.doSetupProgramMetadata = function(metadata)
{
	oFF.DfUiProgram.prototype.doSetupProgramMetadata.call( this , metadata);
	metadata.addParameter(oFF.AuDatasourcePicker.PARAM_APPLICATION, "The application to use.");
	metadata.addParameter(oFF.AuDatasourcePicker.PARAM_SYSTEM, "The system that was picked earlier.");
	metadata.addParameter(oFF.AuDatasourcePicker.PARAM_LISTENER, "The system that was picked earlier.");
};
oFF.AuDatasourcePicker.prototype.evalArguments = function()
{
	oFF.DfUiProgram.prototype.evalArguments.call( this );
	this.m_app = this.getArguments().getXObjectByKey(oFF.AuDatasourcePicker.PARAM_APPLICATION);
	this.m_startSystemName = this.getArgumentStructure().getStringByKeyExt(oFF.AuDatasourcePicker.PARAM_SYSTEM, null);
	this.m_listener = this.getArguments().getXObjectByKey(oFF.AuDatasourcePicker.PARAM_LISTENER);
};
oFF.AuDatasourcePicker.prototype.initializeProgram = function()
{
	oFF.DfUiProgram.prototype.initializeProgram.call( this );
	if (oFF.isNull(this.m_app))
	{
		this.m_app = this.getApplication();
	}
	this.m_systemsByType = oFF.XHashMapByString.create();
	var systemLandscape = this.getProcess().getSystemLandscape();
	var systemIt = systemLandscape.getSystemNames().getIterator();
	while (systemIt.hasNext())
	{
		var systemName = systemIt.next();
		var systemDescription = systemLandscape.getSystemDescription(systemName);
		var systemTypeName = systemDescription.getSystemType().getName();
		var systems = this.m_systemsByType.getByKey(systemTypeName);
		if (oFF.isNull(systems))
		{
			systems = oFF.XList.create();
			this.m_systemsByType.put(systemTypeName, systems);
		}
		systems.add(systemDescription);
	}
	oFF.XObjectExt.release(systemIt);
};
oFF.AuDatasourcePicker.prototype.buildUi = function(genesis)
{
	this.m_root = genesis.newRoot(oFF.UiType.FLEX_LAYOUT);
	this.m_root.setDirection(oFF.UiFlexDirection.COLUMN);
	this.m_root.useMaxSpace();
	this.m_root.setPadding(oFF.UiCssBoxEdges.create("10px"));
	var strip = this.m_root.addNewItemOfType(oFF.UiType.ICON_TAB_BAR);
	this.buildCatalogUi(strip.addNewItem());
	this.buildRecentUi(strip.addNewItem());
	var startSystemDescription = this.m_app.getSystemLandscape().getSystemDescription(this.m_startSystemName);
	this.fillSystemTypes();
	if (oFF.notNull(startSystemDescription))
	{
		this.m_systemTypeDd.setSelectedName(startSystemDescription.getSystemType().getName());
	}
	this.fillSystems();
	if (oFF.notNull(startSystemDescription))
	{
		this.m_systemDd.setSelectedName(startSystemDescription.getSystemName());
	}
	this.fillQueries();
};
oFF.AuDatasourcePicker.prototype.buildCatalogUi = function(catalogTab)
{
	catalogTab.setText("Catalog");
	var catalogContent = catalogTab.setNewContent(oFF.UiType.FLEX_LAYOUT);
	catalogContent.setDirection(oFF.UiFlexDirection.COLUMN);
	var header = catalogContent.addNewItemOfType(oFF.UiType.FLEX_LAYOUT);
	header.setJustifyContent(oFF.UiFlexJustifyContent.START);
	header.setAlignContent(oFF.UiFlexAlignContent.CENTER);
	this.m_systemTypeDd = header.addNewItemOfType(oFF.UiType.COMBO_BOX);
	this.m_systemTypeDd.setWidth(oFF.UiCssLength.create("180px"));
	this.m_systemTypeDd.setMargin(oFF.UiCssBoxEdges.create("5px"));
	this.m_systemTypeDd.setFlex("1 0 auto");
	this.m_systemTypeDd.registerOnSelectionChange(this);
	this.m_systemDd = header.addNewItemOfType(oFF.UiType.COMBO_BOX);
	this.m_systemDd.setWidth(oFF.UiCssLength.create("180px"));
	this.m_systemDd.setMargin(oFF.UiCssBoxEdges.create("5px"));
	this.m_systemDd.setFlex("1 0 auto");
	this.m_systemDd.registerOnSelectionChange(this);
	this.m_querySearch = header.addNewItemOfType(oFF.UiType.SEARCH_FIELD);
	this.m_querySearch.setWidth(oFF.UiCssLength.create("220px"));
	this.m_querySearch.setMargin(oFF.UiCssBoxEdges.create("5px"));
	this.m_querySearch.setFlex("2 0 auto");
	this.m_querySearch.registerOnSearch(this);
	this.m_querySearch.setName("DataSourcePickerSearch");
	this.m_queryTbl = catalogContent.addNewItemOfType(oFF.UiType.TABLE);
	this.m_queryTbl.setName("DataSourcePickerTable");
	this.m_queryTbl.setFlex("auto");
	this.m_queryTbl.setSelectionMode(oFF.UiSelectionMode.SINGLE_SELECT);
	this.m_queryTbl.setSelectionBehavior(oFF.UiSelectionBehavior.ROW);
	this.m_queryTbl.setVisibleRowCountMode(oFF.UiVisibleRowCountMode.AUTO);
	this.m_queryTbl.setMinRowCount(2);
	this.m_queryTbl.addNewColumn().setTitle("Name");
	this.m_queryTbl.addNewColumn().setTitle("Description");
	this.m_queryTbl.registerOnSelectionChange(this);
	var footer = catalogContent.addNewItemOfType(oFF.UiType.FLEX_LAYOUT);
	footer.setJustifyContent(oFF.UiFlexJustifyContent.CENTER);
	this.m_left = footer.addNewItemOfType(oFF.UiType.BUTTON);
	this.m_left.setIcon("navigation-left-arrow");
	this.m_left.setPadding(oFF.UiCssBoxEdges.create("4px"));
	this.m_left.registerOnPress(this);
	this.m_right = footer.addNewItemOfType(oFF.UiType.BUTTON);
	this.m_right.setIcon("navigation-right-arrow");
	this.m_right.setPadding(oFF.UiCssBoxEdges.create("4px"));
	this.m_right.registerOnPress(this);
};
oFF.AuDatasourcePicker.prototype.buildRecentUi = function(recentTab)
{
	recentTab.setText("Recent");
	var recentContent = recentTab.setNewContent(oFF.UiType.FLEX_LAYOUT);
	recentContent.setDirection(oFF.UiFlexDirection.COLUMN);
	this.m_recentTbl = recentContent.addNewItemOfType(oFF.UiType.TABLE);
	this.m_recentTbl.setFlex("auto");
	this.m_recentTbl.setSelectionMode(oFF.UiSelectionMode.SINGLE_SELECT);
	this.m_recentTbl.setSelectionBehavior(oFF.UiSelectionBehavior.ROW);
	this.m_recentTbl.setVisibleRowCountMode(oFF.UiVisibleRowCountMode.AUTO);
	this.m_recentTbl.setMinRowCount(2);
	this.m_recentTbl.addNewColumn().setTitle("Name");
	this.m_recentTbl.addNewColumn().setTitle("Description");
	this.m_recentTbl.registerOnSelectionChange(this);
	this.m_recentTbl.setName("DataSourcePickerTable");
	this.loadRecent();
};
oFF.AuDatasourcePicker.prototype.getDialogButtons = function(genesis)
{
	this.m_cancelBtn = genesis.newControl(oFF.UiType.DIALOG_BUTTON);
	this.m_cancelBtn.setName("DataSourcePickerCancel");
	this.m_cancelBtn.setText("Cancel");
	this.m_cancelBtn.registerOnPress(this);
	var tmpList = oFF.XList.create();
	tmpList.add(this.m_cancelBtn);
	return tmpList;
};
oFF.AuDatasourcePicker.prototype.onSearch = function(event)
{
	var control = event.getControl();
	if (control === this.m_querySearch)
	{
		this.m_currentPage = 0;
		this.processFetch();
	}
};
oFF.AuDatasourcePicker.prototype.onPress = function(event)
{
	var control = event.getControl();
	if (control === this.m_left)
	{
		this.m_currentPage = this.m_currentPage - 1;
		this.processFetch();
	}
	else if (control === this.m_right)
	{
		this.m_currentPage = this.m_currentPage + 1;
		this.processFetch();
	}
	else if (control === this.m_cancelBtn)
	{
		this.saveRecent(null);
		this.exitNow(0);
	}
};
oFF.AuDatasourcePicker.prototype.loadRecent = function()
{
	this.m_recentTbl.clearRows();
	var recent = this.getProcess().getUserManager().getUserSettings().getStringByKey(oFF.AuDatasourcePicker.DS_PICKER_RECENT);
	if (oFF.XStringUtils.isNullOrEmpty(recent))
	{
		return;
	}
	var entries = oFF.XStringTokenizer.splitString(recent, ";");
	for (var i = 0; i < entries.size(); i++)
	{
		var entry = oFF.XStringTokenizer.splitString(entries.get(i), ",");
		if (oFF.isNull(entry) || entry.size() < 2)
		{
			continue;
		}
		var system = entry.get(0);
		var fullQualifiedName = entry.get(1);
		if (oFF.XStringUtils.isNullOrEmpty(system) || oFF.XStringUtils.isNullOrEmpty(fullQualifiedName))
		{
			continue;
		}
		var dataSource = oFF.QFactory.createDataSourceWithFqn(fullQualifiedName);
		dataSource.setSystemName(system);
		var row = this.m_recentTbl.addNewRow();
		row.addNewCell().setText(system);
		row.addNewCell().setText(dataSource.getName());
		row.setCustomObject(dataSource);
	}
};
oFF.AuDatasourcePicker.prototype.saveRecent = function(newDatasource)
{
	var buffer = oFF.XStringBuffer.create();
	var entries = oFF.XHashSetOfString.create();
	if (oFF.notNull(newDatasource))
	{
		var newEntry = oFF.XStringUtils.concatenate3(newDatasource.getSystemName(), ",", newDatasource.getFullQualifiedName());
		buffer.append(newEntry);
		entries.add(newEntry);
	}
	var rows = this.m_recentTbl.getRows();
	for (var i = 0; i < rows.size() && i < oFF.AuDatasourcePicker.MAX_RECENT_RECORDS - 1; i++)
	{
		var row = rows.get(i);
		var datasource = row.getCustomObject();
		var entry = oFF.XStringUtils.concatenate3(datasource.getSystemName(), ",", datasource.getFullQualifiedName());
		if (entries.contains(entry))
		{
			continue;
		}
		buffer.append(";").append(entry);
	}
	this.getProcess().getUserManager().getUserSettings().putString(oFF.AuDatasourcePicker.DS_PICKER_RECENT, buffer.toString());
};
oFF.AuDatasourcePicker.prototype.onSelectionChange = function(event)
{
	var control = event.getControl();
	var selectedItem = control.getSelectedItem();
	if (control === this.m_queryTbl)
	{
		var catalogItem = selectedItem.getCustomObject();
		var dataSource = oFF.QFactory.createDataSource();
		dataSource.setSystemName(this.m_systemDd.getSelectedName());
		dataSource.setType(catalogItem.getType());
		dataSource.setEnvironmentName(catalogItem.getEnvironmentName());
		dataSource.setSchemaName(catalogItem.getSchemaName());
		dataSource.setPackageName(catalogItem.getPackageName());
		dataSource.setObjectName(catalogItem.getObjectName());
		this.saveRecent(dataSource);
		this.m_listener.onDatasourceSelected(dataSource);
		this.exitNow(0);
	}
	else if (control === this.m_recentTbl)
	{
		var selectedDatasource = selectedItem.getCustomObject();
		this.saveRecent(selectedDatasource);
		this.m_listener.onDatasourceSelected(selectedDatasource);
		this.exitNow(0);
	}
	else if (control === this.m_systemTypeDd)
	{
		this.fillSystems();
		this.fillQueries();
	}
	else if (control === this.m_systemDd)
	{
		this.fillQueries();
	}
};
oFF.AuDatasourcePicker.prototype.fillSystemTypes = function()
{
	this.m_systemTypeDd.clearItems();
	this.m_systemTypeDd.addNewItem();
	var systemTypeNames = this.m_systemsByType.getKeysAsReadOnlyListOfString();
	for (var i = 0; i < systemTypeNames.size(); i++)
	{
		var systemTypeName = systemTypeNames.get(i);
		var item = this.m_systemTypeDd.addNewItem();
		item.setName(systemTypeName).setText(systemTypeName);
	}
};
oFF.AuDatasourcePicker.prototype.fillSystems = function()
{
	this.m_systemDd.setEnabled(false);
	this.m_systemDd.clearItems();
	var systemTypeName = this.m_systemTypeDd.getSelectedName();
	if (oFF.XStringUtils.isNullOrEmpty(systemTypeName))
	{
		return;
	}
	this.m_systemDd.addNewItem();
	var systems = this.m_systemsByType.getByKey(systemTypeName);
	for (var i = 0; i < systems.size(); i++)
	{
		var system = systems.get(i);
		var item = this.m_systemDd.addNewItem();
		item.setName(system.getName()).setText(system.getName());
	}
	this.m_systemDd.setEnabled(true);
};
oFF.AuDatasourcePicker.prototype.fillQueries = function()
{
	this.m_querySearch.setEnabled(false);
	this.m_left.setEnabled(false);
	this.m_right.setEnabled(false);
	this.m_currentPage = 0;
	this.m_queryTbl.clearRows();
	oFF.XObjectExt.release(this.m_currentCatalogManager);
	var systemName = this.m_systemDd.getSelectedName();
	if (oFF.XStringUtils.isNullOrEmpty(systemName))
	{
		return;
	}
	this.createCatalogManager();
};
oFF.AuDatasourcePicker.prototype.createCatalogManager = function()
{
	var systemTypeName = this.m_systemTypeDd.getSelectedName();
	var systems = this.m_systemsByType.getByKey(systemTypeName);
	if (oFF.isNull(systems))
	{
		return;
	}
	var systemName = this.m_systemDd.getSelectedName();
	var system = this.findSystem(systems, systemName);
	if (oFF.isNull(system))
	{
		return;
	}
	var serviceConfig = oFF.OlapCatalogApiModule.SERVICE_TYPE_OLAP_CATALOG.createServiceConfig(this.m_app);
	serviceConfig.setSystemName(systemName);
	this.m_queryTbl.setBusy(true);
	serviceConfig.processOlapCatalogManagerCreation(oFF.SyncType.NON_BLOCKING, this, null);
};
oFF.AuDatasourcePicker.prototype.onOlapCatalogManagerCreated = function(extResult, olapCatalogManager, customIdentifier)
{
	this.m_queryTbl.setBusy(false);
	if (extResult.hasErrors())
	{
		this.showError(extResult.getSummary());
		return;
	}
	this.m_currentCatalogManager = extResult.getData();
	var systemType = oFF.SystemType.lookup(this.m_systemTypeDd.getSelectedName());
	if (systemType.isTypeOf(oFF.SystemType.ABAP))
	{
		this.m_currentCatalogManager.setSelectedType(oFF.MetaObjectType.QUERY);
	}
	else if (systemType.isTypeOf(oFF.SystemType.HANA))
	{
		this.m_currentCatalogManager.setSelectedType(oFF.MetaObjectType.DBVIEW);
	}
	else if (systemType.isTypeOf(oFF.SystemType.UNV))
	{
		this.m_currentCatalogManager.setSelectedType(oFF.MetaObjectType.UNX);
	}
	else
	{
		throw oFF.XException.createIllegalArgumentException(oFF.XStringUtils.concatenate2("no meta object type for system ", this.m_systemTypeDd.getSelectedName()));
	}
	this.m_currentCatalogManager.setResultMaxSize(oFF.AuDatasourcePicker.PAGE_SIZE + 1);
	this.processFetch();
	this.m_querySearch.setEnabled(true);
};
oFF.AuDatasourcePicker.prototype.findSystem = function(systems, systemName)
{
	for (var i = 0; i < systems.size(); i++)
	{
		var system = systems.get(i);
		if (oFF.XString.isEqual(systemName, system.getName()))
		{
			return system;
		}
	}
	return null;
};
oFF.AuDatasourcePicker.prototype.processFetch = function()
{
	this.m_currentCatalogManager.setSearchFilter(null);
	if (oFF.XStringUtils.isNotNullAndNotEmpty(this.m_querySearch.getText()))
	{
		var searchString = oFF.XStringUtils.concatenate3("*", this.m_querySearch.getText(), "*");
		this.m_currentCatalogManager.setSearchFilter(searchString);
		this.m_currentCatalogManager.setSearchOnName(true);
	}
	this.m_currentCatalogManager.setResultOffset(this.m_currentPage * oFF.AuDatasourcePicker.PAGE_SIZE);
	this.m_queryTbl.setBusy(true);
	this.m_currentCatalogManager.processGetResult(oFF.SyncType.NON_BLOCKING, this, null);
};
oFF.AuDatasourcePicker.prototype.onOlapCatalogResult = function(extResult, result, customIdentifier)
{
	this.m_queryTbl.setBusy(false);
	if (extResult.hasErrors())
	{
		this.showError(extResult.getSummary());
		return;
	}
	this.m_currentData = extResult.getData().getObjectsList();
	this.updateTable();
};
oFF.AuDatasourcePicker.prototype.updateTable = function()
{
	this.m_queryTbl.clearRows();
	for (var i = 0; i < this.m_currentData.size(); i++)
	{
		if (i >= oFF.AuDatasourcePicker.PAGE_SIZE)
		{
			break;
		}
		var catalogItem = this.m_currentData.get(i);
		var row = this.m_queryTbl.addNewRow();
		row.addNewCell().setText(catalogItem.getName());
		row.addNewCell().setText(catalogItem.getText());
		row.setCustomObject(catalogItem);
	}
	this.updatePageButtons();
};
oFF.AuDatasourcePicker.prototype.updatePageButtons = function()
{
	this.m_left.setEnabled(this.m_currentPage > 0);
	this.m_right.setEnabled(this.m_currentData.size() > oFF.AuDatasourcePicker.PAGE_SIZE);
};
oFF.AuDatasourcePicker.prototype.showError = function(msg)
{
	this.getGenesis().showErrorToast(msg);
};
oFF.AuDatasourcePicker.prototype.releaseObject = function()
{
	this.m_systemsByType = oFF.XObjectExt.release(this.m_systemsByType);
	this.m_currentCatalogManager = oFF.XObjectExt.release(this.m_currentCatalogManager);
	this.m_currentData = oFF.XObjectExt.release(this.m_currentData);
	this.m_startSystemName = null;
	this.m_root = oFF.XObjectExt.release(this.m_root);
	this.m_systemTypeDd = null;
	this.m_systemDd = null;
	this.m_querySearch = null;
	this.m_queryTbl = null;
	this.m_left = null;
	this.m_right = null;
	this.m_recentTbl = null;
	this.m_cancelBtn = null;
	this.m_listener = null;
	oFF.DfUiProgram.prototype.releaseObject.call( this );
};

oFF.CatalogDialogDummyProgram = function() {};
oFF.CatalogDialogDummyProgram.prototype = new oFF.DfUiProgram();
oFF.CatalogDialogDummyProgram.prototype._ff_c = "CatalogDialogDummyProgram";

oFF.CatalogDialogDummyProgram.DEFAULT_PROGRAM_NAME = "Catalog";
oFF.CatalogDialogDummyProgram.CURRENCY_CATALOG_BUTTON = "currencyCatalogButton";
oFF.CatalogDialogDummyProgram.CURRENCY_TRANSLATION_CATALOG_BUTTON = "currencyTranslationCatalogButton";
oFF.CatalogDialogDummyProgram.HIERARCHY_CATALOG_BUTTON = "hierarchyCatalogButton";
oFF.CatalogDialogDummyProgram.PARAM_SYSTEM = "system";
oFF.CatalogDialogDummyProgram.PARAM_DATASOURCE = "datasource";
oFF.CatalogDialogDummyProgram.PARAM_DIMENSION = "dimension";
oFF.CatalogDialogDummyProgram.prototype.m_root = null;
oFF.CatalogDialogDummyProgram.prototype.m_system = null;
oFF.CatalogDialogDummyProgram.prototype.m_datasource = null;
oFF.CatalogDialogDummyProgram.prototype.m_dimension = null;
oFF.CatalogDialogDummyProgram.prototype.m_messageManager = null;
oFF.CatalogDialogDummyProgram.prototype.m_queryManager = null;
oFF.CatalogDialogDummyProgram.prototype.m_layout = null;
oFF.CatalogDialogDummyProgram.prototype.m_systemInput = null;
oFF.CatalogDialogDummyProgram.prototype.m_dataSourceInput = null;
oFF.CatalogDialogDummyProgram.prototype.m_dimensionInput = null;
oFF.CatalogDialogDummyProgram.prototype.m_currencyCatalogButton = null;
oFF.CatalogDialogDummyProgram.prototype.m_currencyTranslationCatalogButton = null;
oFF.CatalogDialogDummyProgram.prototype.m_hierarchyCatalogButton = null;
oFF.CatalogDialogDummyProgram.prototype.m_currencyCatalogController = null;
oFF.CatalogDialogDummyProgram.prototype.m_currencyTranslationCatalogController = null;
oFF.CatalogDialogDummyProgram.prototype.m_hierarchyCatalogController = null;
oFF.CatalogDialogDummyProgram.prototype.getParameterValue = function(name)
{
	var value = this.getSession().getEnvironment().getStringByKey(name);
	if (oFF.XStringUtils.isNullOrEmpty(value))
	{
		value = this.getArgumentStructure().getStringByKey(name);
	}
	return value;
};
oFF.CatalogDialogDummyProgram.prototype.evalArguments = function()
{
	oFF.DfUiProgram.prototype.evalArguments.call( this );
	this.m_system = this.getParameterValue(oFF.CatalogDialogDummyProgram.PARAM_SYSTEM);
	this.m_datasource = this.getParameterValue(oFF.CatalogDialogDummyProgram.PARAM_DATASOURCE);
	this.m_dimension = this.getParameterValue(oFF.CatalogDialogDummyProgram.PARAM_DIMENSION);
	if (oFF.XStringUtils.isNullOrEmpty(this.m_system) && oFF.XStringUtils.isNullOrEmpty(this.m_datasource))
	{
		this.m_system = "KIW";
		this.m_datasource = "query:[0BICS_C03_BICSTEST_Q0020]";
		this.m_dimension = "0BC_CUST";
	}
};
oFF.CatalogDialogDummyProgram.prototype.newProgram = function()
{
	var prg = new oFF.CatalogDialogDummyProgram();
	prg.setup();
	return prg;
};
oFF.CatalogDialogDummyProgram.prototype.buildUi = function(genesis)
{
	oFF.DfUiProgram.prototype.buildUi.call( this , genesis);
	var displayManager = oFF.OlapUiDisplayFactory.createFactoryForDialog(this.getUiManager());
	var context = oFF.OlapUiContext.createContext(this.getUiManager(), displayManager);
	this.m_currencyCatalogController = oFF.CurrencyCatalogController.create(context);
	this.m_currencyTranslationCatalogController = oFF.CurrencyTranslationCatalogController.create(context);
	this.m_hierarchyCatalogController = oFF.HierarchyCatalogController.create(context);
	this.m_root = this.buildTree(genesis);
	genesis.setRoot(this.m_root);
	this.setTitle("\u03C0\u03BF\u03B4\u03B7\u03BB\u03AC\u03C4\u03B7\u03C2 client");
};
oFF.CatalogDialogDummyProgram.prototype.buildTree = function(genesis)
{
	this.m_layout = genesis.newControl(oFF.UiType.VERTICAL_LAYOUT);
	this.m_systemInput = genesis.newControl(oFF.UiType.INPUT);
	this.m_dataSourceInput = genesis.newControl(oFF.UiType.INPUT);
	this.m_dimensionInput = genesis.newControl(oFF.UiType.INPUT);
	this.m_systemInput.registerOnLiveChange(this);
	this.m_dataSourceInput.registerOnLiveChange(this);
	this.m_dimensionInput.registerOnLiveChange(this);
	this.m_currencyTranslationCatalogButton = this.m_layout.addNewItemOfType(oFF.UiType.BUTTON);
	this.m_currencyTranslationCatalogButton.setText("Currency Translations ...");
	this.m_currencyTranslationCatalogButton.setName(oFF.CatalogDialogDummyProgram.CURRENCY_TRANSLATION_CATALOG_BUTTON);
	this.m_currencyTranslationCatalogButton.registerOnPress(this);
	this.m_currencyCatalogButton = this.m_layout.addNewItemOfType(oFF.UiType.BUTTON);
	this.m_currencyCatalogButton.setText("Target Currencies ...");
	this.m_currencyCatalogButton.setName(oFF.CatalogDialogDummyProgram.CURRENCY_CATALOG_BUTTON);
	this.m_currencyCatalogButton.registerOnPress(this);
	this.m_hierarchyCatalogButton = this.m_layout.addNewItemOfType(oFF.UiType.BUTTON);
	this.m_hierarchyCatalogButton.setText("Hierarchies ...");
	this.m_hierarchyCatalogButton.setName(oFF.CatalogDialogDummyProgram.HIERARCHY_CATALOG_BUTTON);
	this.m_hierarchyCatalogButton.registerOnPress(this);
	this.fillDataSourceSeletWidgets();
	return this.m_layout;
};
oFF.CatalogDialogDummyProgram.prototype.fillDataSourceSeletWidgets = function()
{
	this.m_systemInput.setText(this.m_system);
	this.m_dataSourceInput.setText(this.m_datasource);
};
oFF.CatalogDialogDummyProgram.prototype.initializeProgram = function()
{
	oFF.DfUiProgram.prototype.initializeProgram.call( this );
	oFF.ApplicationUiModule.getInstance();
	this.m_messageManager = oFF.MessageManager.createMessageManagerExt(this.getSession());
	oFF.OlapUiValueHelpAbstract.s_syncType = oFF.SyncType.BLOCKING;
	var traceInfo = oFF.TraceInfo.create();
	traceInfo.setTraceType(oFF.TraceType.URL);
	traceInfo.setTraceName("catalog dialog");
	this.getApplication().getConnectionPool().setTraceInfo(this.m_system, traceInfo);
};
oFF.CatalogDialogDummyProgram.prototype.onPress = function(event)
{
	var control = event.getControl();
	var controlName = control.getName();
	switch (controlName)
	{
		case oFF.CatalogDialogDummyProgram.CURRENCY_CATALOG_BUTTON:
			this.createCurrencyCatalog();
			break;

		case oFF.CatalogDialogDummyProgram.CURRENCY_TRANSLATION_CATALOG_BUTTON:
			this.createCurrencyTranslationCatalog();
			break;

		case oFF.CatalogDialogDummyProgram.HIERARCHY_CATALOG_BUTTON:
			this.createHierarchyCatalog();
			break;
	}
};
oFF.CatalogDialogDummyProgram.prototype.createCurrencyCatalog = function()
{
	var serviceConfig = oFF.OlapCatalogApiModule.SERVICE_TYPE_OLAP_CATALOG.createServiceConfig(this.getApplication());
	serviceConfig.setSystemName(this.m_system);
	serviceConfig.processCurrencyCatalogManagerCreation(oFF.SyncType.NON_BLOCKING, this, oFF.XStringValue.create("currencyCatalog"));
};
oFF.CatalogDialogDummyProgram.prototype.createCurrencyTranslationCatalog = function()
{
	var serviceConfig = oFF.OlapCatalogApiModule.SERVICE_TYPE_OLAP_CATALOG.createServiceConfig(this.getApplication());
	serviceConfig.setSystemName(this.m_system);
	serviceConfig.processCurrencyTranslationCatalogManagerCreation(oFF.SyncType.NON_BLOCKING, this, null);
};
oFF.CatalogDialogDummyProgram.prototype.createHierarchyCatalog = function()
{
	if (oFF.XStringUtils.isNotNullAndNotEmpty(this.m_datasource))
	{
		var serviceConfigQuery = oFF.QueryServiceConfig.createWithDataSourceName(this.getApplication(), this.m_system, this.m_datasource);
		var syncAction = serviceConfigQuery.processQueryManagerCreation(oFF.SyncType.BLOCKING, null, null);
		if (syncAction.hasErrors())
		{
			this.m_messageManager.addAllMessages(syncAction);
			return;
		}
		this.m_queryManager = syncAction.getData();
	}
	var queryModel = this.m_queryManager.getQueryModel();
	var serviceConfig = oFF.OlapApiModule.SERVICE_TYPE_HIERARCHY_CATALOG.createServiceConfig(this.getApplication());
	serviceConfig.setSystemName(this.m_system);
	var dataSource = queryModel.getDataSource().getFullQualifiedName();
	serviceConfig.setDataSourceName(dataSource);
	serviceConfig.setDimension(queryModel.getDimensionByName(this.m_dimension));
	serviceConfig.processHierarchyCatalogManagerCreation(oFF.SyncType.NON_BLOCKING, this, null).getData();
};
oFF.CatalogDialogDummyProgram.prototype.onSubmit = function() {};
oFF.CatalogDialogDummyProgram.prototype.onClose = function() {};
oFF.CatalogDialogDummyProgram.prototype.onLiveChange = function(event) {};
oFF.CatalogDialogDummyProgram.prototype.onHierarchyCatalogManagerCreated = function(extResult, hierarchyCatalogManager, customIdentifier)
{
	var catalogManager = extResult.getData();
	this.m_hierarchyCatalogController.openDialog("Hierarchy", catalogManager, null, null, this, null);
};
oFF.CatalogDialogDummyProgram.prototype.onOlapCatalogManagerCreated = function(extResult, olapCatalogManager, customIdentifier)
{
	var catalogManager = extResult.getData();
	if (oFF.isNull(customIdentifier))
	{
		this.m_currencyTranslationCatalogController.openDialog("Select your currency conversion", catalogManager, null, null, this);
	}
	else
	{
		this.m_currencyCatalogController.openDialog("Select your target currency", catalogManager, null, null, this);
	}
};

oFF.DimensionDialogTestProgram = function() {};
oFF.DimensionDialogTestProgram.prototype = new oFF.DfUiProgram();
oFF.DimensionDialogTestProgram.prototype._ff_c = "DimensionDialogTestProgram";

oFF.DimensionDialogTestProgram.DEFAULT_PROGRAM_NAME = "Podilates";
oFF.DimensionDialogTestProgram.UIE_ID_BTN_CONDITIONS = "BtnConditions";
oFF.DimensionDialogTestProgram.CONTEXT_MENU = "contextMenu";
oFF.DimensionDialogTestProgram.EXPAND_MENU = "expand";
oFF.DimensionDialogTestProgram.DRILL_MENU = "drill";
oFF.DimensionDialogTestProgram.COLLAPSE_MENU = "collapse";
oFF.DimensionDialogTestProgram.DIMENSION_CONTEXT_MENU = "dimensionContextMenu";
oFF.DimensionDialogTestProgram.FILTER_CONTEXT_MENU = "filterContextMenu";
oFF.DimensionDialogTestProgram.DATACELL_MENU = "datacellMenu";
oFF.DimensionDialogTestProgram.DIMENSION_MENU = "dimensionMenu";
oFF.DimensionDialogTestProgram.DIMENSION_EXHAUSTIVE_MENU = "dimensionExhaustiveMenu";
oFF.DimensionDialogTestProgram.DIMENSION_BTN = "dimensionBtn";
oFF.DimensionDialogTestProgram.DIMENSION_EXH_BTN = "dimensionExhBtn";
oFF.DimensionDialogTestProgram.LAYOUT_BTN = "layoutBtn";
oFF.DimensionDialogTestProgram.SELECT_SYSTEM_BTN = "selectSystemBtn";
oFF.DimensionDialogTestProgram.SELECT_SYSTEM_BW_MENU = "selectSystemBwMenu";
oFF.DimensionDialogTestProgram.SELECT_SYSTEM_BW_2STRUCTURES = "selectSystemBw2StrcutMenu";
oFF.DimensionDialogTestProgram.SELECT_SYSTEM_GIPSY_MENU = "selectSystemGips<Menu";
oFF.DimensionDialogTestProgram.SELECT_SYSTEM_MDS_MENU = "selectSystemMdsMenu";
oFF.DimensionDialogTestProgram.SELECT_SYSTEM_MDS_LEGACY_CUR_TRANS = "selectSystemMdsLegacyCurTrans";
oFF.DimensionDialogTestProgram.SELECT_SYSTEM_MDS_ACCOUNT_WITH_MD = "selectSystemMdsAccountWithMd";
oFF.DimensionDialogTestProgram.SELECT_SYSTEM_MDS_MEASURE_WITHOUT_MD = "selectSystemMdsMeasureWithoutMd";
oFF.DimensionDialogTestProgram.QUERY_BUTTON = "queryButton";
oFF.DimensionDialogTestProgram.CUR_CONV_BUTTON = "curConvButton";
oFF.DimensionDialogTestProgram.PARAM_SYSTEM = "system";
oFF.DimensionDialogTestProgram.PARAM_DATASOURCE = "datasource";
oFF.DimensionDialogTestProgram.PARAM_TEST = "test";
oFF.DimensionDialogTestProgram.createRunner = function()
{
	return oFF.KernelBoot.createByName(oFF.DimensionDialogTestProgram.DEFAULT_PROGRAM_NAME);
};
oFF.DimensionDialogTestProgram.getResultSet = function(queryManager)
{
	var resultSetContainer = queryManager.getActiveResultSetContainer();
	if (oFF.isNull(resultSetContainer))
	{
		throw oFF.XException.createRuntimeException("ResultSetContainer null");
	}
	if (resultSetContainer.hasErrors())
	{
		throw oFF.XException.createRuntimeException(resultSetContainer.getSummary());
	}
	var resultSet = resultSetContainer.getClassicResultSet();
	if (oFF.isNull(resultSet))
	{
		if (resultSetContainer.hasErrors())
		{
			throw oFF.XException.createRuntimeException(resultSetContainer.getSummary());
		}
		throw oFF.XException.createRuntimeException("ResultSet null");
	}
	if (resultSet.hasErrors())
	{
		throw oFF.XException.createRuntimeException(resultSet.getSummary());
	}
	return resultSet;
};
oFF.DimensionDialogTestProgram.prototype.m_oUIEBtnConditions = null;
oFF.DimensionDialogTestProgram.prototype.m_root = null;
oFF.DimensionDialogTestProgram.prototype.m_system = null;
oFF.DimensionDialogTestProgram.prototype.m_datasource = null;
oFF.DimensionDialogTestProgram.prototype.m_messageManager = null;
oFF.DimensionDialogTestProgram.prototype.m_queryManager = null;
oFF.DimensionDialogTestProgram.prototype.m_grid = null;
oFF.DimensionDialogTestProgram.prototype.m_layout = null;
oFF.DimensionDialogTestProgram.prototype.m_dimPropBtn = null;
oFF.DimensionDialogTestProgram.prototype.m_dimExhPropBtn = null;
oFF.DimensionDialogTestProgram.prototype.m_dimPropMenu = null;
oFF.DimensionDialogTestProgram.prototype.m_dimExhPropMenu = null;
oFF.DimensionDialogTestProgram.prototype.m_layoutBtn = null;
oFF.DimensionDialogTestProgram.prototype.m_systemBtn = null;
oFF.DimensionDialogTestProgram.prototype.m_systemInput = null;
oFF.DimensionDialogTestProgram.prototype.m_dataSourceInput = null;
oFF.DimensionDialogTestProgram.prototype.m_queryButton = null;
oFF.DimensionDialogTestProgram.prototype.m_curConvBtn = null;
oFF.DimensionDialogTestProgram.prototype.m_datacellBtn = null;
oFF.DimensionDialogTestProgram.prototype.m_datacellBtn2 = null;
oFF.DimensionDialogTestProgram.prototype.m_test = null;
oFF.DimensionDialogTestProgram.prototype.m_argumentStructure = null;
oFF.DimensionDialogTestProgram.prototype.m_contextMenu = null;
oFF.DimensionDialogTestProgram.prototype.getParameterValue = function(name)
{
	var value = this.getSession().getEnvironment().getStringByKey(name);
	if (oFF.XStringUtils.isNullOrEmpty(value))
	{
		value = this.m_argumentStructure.getStringByKey(name);
	}
	return value;
};
oFF.DimensionDialogTestProgram.prototype.getDefaultContainerSize = function()
{
	return oFF.UiSize.createByCss("60%", "60%");
};
oFF.DimensionDialogTestProgram.prototype.evalArguments = function()
{
	this.m_argumentStructure = this.getArgumentStructure();
	if (this.m_argumentStructure.getIntegerByKeyExt(oFF.DfProgram.PARAM_XVERSION, -1) === -1)
	{
		this.m_argumentStructure.putInteger(oFF.DfProgram.PARAM_XVERSION, oFF.XVersion.V140_REPOSITORY_PERSIST_PAGING);
	}
	oFF.DfUiProgram.prototype.evalArguments.call( this );
	this.m_system = this.getParameterValue(oFF.DimensionDialogTestProgram.PARAM_SYSTEM);
	this.m_datasource = this.getParameterValue(oFF.DimensionDialogTestProgram.PARAM_DATASOURCE);
	this.m_test = this.getParameterValue(oFF.DimensionDialogTestProgram.PARAM_TEST);
	if (oFF.XStringUtils.isNullOrEmpty(this.m_system) && oFF.XStringUtils.isNullOrEmpty(this.m_datasource))
	{
		this.m_system = "KIW";
		this.m_datasource = "query:[0BICS_C03_BICSTEST_Q0020]";
	}
};
oFF.DimensionDialogTestProgram.prototype.newProgram = function()
{
	var prg = new oFF.DimensionDialogTestProgram();
	prg.setup();
	return prg;
};
oFF.DimensionDialogTestProgram.prototype.doSetupProgramMetadata = function(metadata)
{
	oFF.DfUiProgram.prototype.doSetupProgramMetadata.call( this , metadata);
	metadata.addParameter(oFF.DimensionDialogTestProgram.PARAM_SYSTEM, "The system to connect to.");
	metadata.addParameter(oFF.DimensionDialogTestProgram.PARAM_DATASOURCE, "The datasource to be used (Can be empty for planning sequences).");
	metadata.addParameter(oFF.DimensionDialogTestProgram.PARAM_TEST, "The name of the running test (Optional).");
};
oFF.DimensionDialogTestProgram.prototype.isShowMenuBar = function()
{
	return true;
};
oFF.DimensionDialogTestProgram.prototype.buildUi = function(genesis)
{
	oFF.DfUiProgram.prototype.buildUi.call( this , genesis);
	this.m_root = this.buildTree(genesis);
	genesis.setRoot(this.m_root);
	this.setTitle("\u03C0\u03BF\u03B4\u03B7\u03BB\u03AC\u03C4\u03B7\u03C2 client");
};
oFF.DimensionDialogTestProgram.prototype.buildTree = function(genesis)
{
	this.m_layout = genesis.newControl(oFF.UiType.VERTICAL_LAYOUT);
	var programToolbar = this.getMenuBar();
	this.m_layoutBtn = programToolbar.addNewItemOfType(oFF.UiType.BUTTON);
	this.m_layoutBtn.setButtonType(oFF.UiButtonType.TRANSPARENT);
	this.m_layoutBtn.setName(oFF.DimensionDialogTestProgram.LAYOUT_BTN);
	this.m_layoutBtn.setText("Dimension Layout...");
	this.m_layoutBtn.registerOnPress(this);
	this.m_dimPropBtn = programToolbar.addNewItemOfType(oFF.UiType.BUTTON);
	this.m_dimPropBtn.setButtonType(oFF.UiButtonType.TRANSPARENT);
	this.m_dimPropBtn.setName(oFF.DimensionDialogTestProgram.DIMENSION_BTN);
	this.m_dimPropBtn.setText("Dimension Properties");
	this.m_dimPropBtn.registerOnPress(this);
	this.m_dimExhPropBtn = programToolbar.addNewItemOfType(oFF.UiType.BUTTON);
	this.m_dimExhPropBtn.setButtonType(oFF.UiButtonType.TRANSPARENT);
	this.m_dimExhPropBtn.setName(oFF.DimensionDialogTestProgram.DIMENSION_EXH_BTN);
	this.m_dimExhPropBtn.setText("Dimension Props Exhaustive");
	this.m_dimExhPropBtn.registerOnPress(this);
	this.m_dimPropMenu = genesis.newControl(oFF.UiType.MENU);
	this.m_dimPropMenu.setName(oFF.DimensionDialogTestProgram.DIMENSION_MENU);
	this.m_dimExhPropMenu = genesis.newControl(oFF.UiType.MENU);
	this.m_dimExhPropMenu.setName(oFF.DimensionDialogTestProgram.DIMENSION_EXHAUSTIVE_MENU);
	this.m_curConvBtn = programToolbar.addNewItemOfType(oFF.UiType.BUTTON);
	this.m_curConvBtn.setButtonType(oFF.UiButtonType.TRANSPARENT);
	this.m_curConvBtn.setName(oFF.DimensionDialogTestProgram.CUR_CONV_BUTTON);
	this.m_curConvBtn.setText("Currency Conversion ...");
	this.m_curConvBtn.registerOnPress(this);
	this.m_oUIEBtnConditions = programToolbar.addNewItemOfType(oFF.UiType.BUTTON);
	this.m_oUIEBtnConditions.setButtonType(oFF.UiButtonType.TRANSPARENT);
	this.m_oUIEBtnConditions.setName(oFF.DimensionDialogTestProgram.UIE_ID_BTN_CONDITIONS);
	this.m_oUIEBtnConditions.setText("Conditions");
	this.m_oUIEBtnConditions.registerOnPress(this);
	this.m_datacellBtn = programToolbar.addNewItemOfType(oFF.UiType.BUTTON);
	this.m_datacellBtn.setButtonType(oFF.UiButtonType.TRANSPARENT);
	this.m_datacellBtn.setName("DataCellProps");
	this.m_datacellBtn.setText("DataCell Props");
	this.m_datacellBtn.registerOnPress(this);
	this.m_datacellBtn2 = programToolbar.addNewItemOfType(oFF.UiType.BUTTON);
	this.m_datacellBtn2.setButtonType(oFF.UiButtonType.TRANSPARENT);
	this.m_datacellBtn2.setName("DataCellProps2");
	this.m_datacellBtn2.setText("DataCell Props2");
	this.m_datacellBtn2.registerOnPress(this);
	this.m_systemBtn = programToolbar.addNewItemOfType(oFF.UiType.BUTTON);
	this.m_systemBtn.setButtonType(oFF.UiButtonType.TRANSPARENT);
	this.m_systemBtn.setName(oFF.DimensionDialogTestProgram.SELECT_SYSTEM_BTN);
	this.m_systemBtn.setText("Select System ...");
	this.m_systemBtn.registerOnPress(this);
	this.m_systemInput = genesis.newControl(oFF.UiType.INPUT);
	this.m_systemInput.setName("systemInputName");
	this.m_dataSourceInput = genesis.newControl(oFF.UiType.INPUT);
	this.m_dataSourceInput.setName("dataSourceInputName");
	this.m_systemInput.registerOnLiveChange(this);
	this.m_dataSourceInput.registerOnLiveChange(this);
	oFF.DdControllerAbstract.addEditablePropertyVerticalLayout(this.m_layout, "System", "System", this.m_systemInput);
	oFF.DdControllerAbstract.addEditablePropertyVerticalLayout(this.m_layout, "Datasource", "Datasource", this.m_dataSourceInput);
	this.m_queryButton = this.m_layout.addNewItemOfType(oFF.UiType.BUTTON);
	this.m_queryButton.setText("Perform Query");
	this.m_queryButton.setName(oFF.DimensionDialogTestProgram.QUERY_BUTTON);
	this.m_queryButton.registerOnPress(this);
	this.m_grid = this.m_layout.addNewItemOfType(oFF.UiType.SAC_TABLE_GRID).setWidth(oFF.UiCssLength.create("100%")).setHeight(oFF.UiCssLength.createExt(50, oFF.UiCssSizeUnit.EM));
	this.m_grid.registerOnClick(this);
	this.m_grid.registerOnContextMenu(this);
	this.m_grid.setEnabled(true);
	this.fillDataSourceSeletWidgets();
	this.m_contextMenu = genesis.newControl(oFF.UiType.MENU);
	this.m_contextMenu.setName(oFF.DimensionDialogTestProgram.CONTEXT_MENU);
	return this.m_layout;
};
oFF.DimensionDialogTestProgram.prototype.doQuery = function()
{
	this.m_queryButton.setEnabled(false);
	this.updateQueryModel();
	this.updateGrid();
	this.updateDimensionMenu();
	this.m_oUIEBtnConditions.setEnabled(true);
	this.m_dimPropMenu.setEnabled(true);
	this.m_dimExhPropMenu.setEnabled(true);
	this.m_curConvBtn.setEnabled(true);
	this.m_dimPropBtn.setEnabled(true);
	this.m_dimExhPropBtn.setEnabled(true);
	this.m_layoutBtn.setEnabled(true);
};
oFF.DimensionDialogTestProgram.prototype.fillDataSourceSeletWidgets = function()
{
	this.m_systemInput.setText(this.m_system);
	this.m_dataSourceInput.setText(this.m_datasource);
	this.needsQuery();
};
oFF.DimensionDialogTestProgram.prototype.updateQueryModel = function()
{
	if (oFF.XStringUtils.isNotNullAndNotEmpty(this.m_datasource))
	{
		this.getSession().activateFeatureToggle(oFF.FeatureToggleOlap.DEVELOPMENT_MODE);
		this.getSession().activateFeatureToggle(oFF.FeatureToggleOlap.CURRENCY_TRANSLATION);
		this.getSession().activateFeatureToggle(oFF.FeatureToggleOlap.MEASURE_MEMBER_CURRENCY_TRANSLATIONS);
		var serviceConfig = oFF.QueryServiceConfig.createWithDataSourceName(this.getApplication(), this.m_system, this.m_datasource);
		var syncAction = serviceConfig.processQueryManagerCreation(oFF.SyncType.BLOCKING, null, null);
		if (syncAction.hasErrors())
		{
			this.m_messageManager.addAllMessages(syncAction);
			return;
		}
		this.m_queryManager = syncAction.getData();
	}
	var queryModel = this.m_queryManager.getQueryModel();
	var acc = queryModel.getAccountDimension();
	if (oFF.notNull(acc))
	{
		acc.setHierarchyName("parentId");
		acc.setHierarchyActive(true);
		queryModel.getColumnsAxis().add(acc);
	}
	var curTransMan = queryModel.getCurrencyTranslationManager();
	if (queryModel.getModelCapabilities().supportsCurrencyTranslation() && oFF.notNull(curTransMan) && !oFF.XCollectionUtils.hasElements(curTransMan.getAvailableCurrencies()))
	{
		curTransMan.addAvailableCurrency("EUR", "Euro");
		curTransMan.addAvailableCurrency("USD", "Dollar");
		curTransMan.addAvailableCurrency("INR", "\u0930\u0941\u092A\u092F\u093E");
		curTransMan.addAvailableCurrency("RUB", "\u0420\u0443\u0431\u043B\u0435\u0439");
		var curTrans = curTransMan.addNewMeasureCurrencyTranslation("RUB", "\u0420\u0443\u0431\u043B\u0435\u0439");
		curTrans.setFixedTargetCurrencyByString("RUB");
		curTrans.setFixedReferenceDateByString("2020-05-05");
		curTrans.setFixedRateNameByString("EURX");
		curTrans = curTransMan.addNewMeasureCurrencyTranslation("EUR", "Euro");
		curTrans.setFixedTargetCurrencyByString("EUR");
		curTrans.setFixedReferenceDateByString("2020-05-05");
		curTrans.setFixedRateNameByString("EURX");
		curTrans = curTransMan.addNewMeasureCurrencyTranslation("INR", "\u0930\u0941\u092A\u092F\u093E");
		curTrans.setFixedTargetCurrencyByString("INR");
		curTrans.setFixedReferenceDateByString("2020-05-05");
		curTrans.setFixedRateNameByString("EURX");
	}
	this.m_layoutBtn.setCustomObject(queryModel);
};
oFF.DimensionDialogTestProgram.prototype.updateDimensionMenu = function()
{
	this.m_dimPropMenu.clearItems();
	this.m_dimExhPropMenu.clearItems();
	this.decorateDimensionMenues(this.m_queryManager.getQueryModel().getRowsAxis().getDimensions());
	this.decorateDimensionMenues(this.m_queryManager.getQueryModel().getColumnsAxis().getDimensions());
};
oFF.DimensionDialogTestProgram.prototype.decorateDimensionMenues = function(dimensions)
{
	for (var i = 0; i < dimensions.size(); i++)
	{
		var dimension = dimensions.getDimensionAt(i);
		var menuItem = this.m_dimPropMenu.addNewItem().setText(oFF.XStringUtils.concatenate3(dimension.getName(), " / ", dimension.getText()));
		menuItem.registerOnPress(this);
		menuItem.setCustomObject(dimension);
		menuItem.setName(dimension.getName());
		menuItem = this.m_dimExhPropMenu.addNewItem().setText(oFF.XStringUtils.concatenate3(dimension.getName(), " / ", dimension.getText()));
		menuItem.registerOnPress(this);
		menuItem.setCustomObject(dimension);
		menuItem.setName(dimension.getName());
	}
};
oFF.DimensionDialogTestProgram.prototype.updateGrid = function()
{
	var resultSet = oFF.DimensionDialogTestProgram.getResultSet(this.m_queryManager);
	var renderer = oFF.GridRendererFactory.createRenderer(oFF.ProtocolBindingType.SAC_TABLE_GRID);
	var modelJson = renderer.render(resultSet.getCursorResultSet());
	var resolver = oFF.GridResolverFactory.createResolver(oFF.ProtocolBindingType.SAC_TABLE_GRID);
	resolver.updateModel(resultSet, modelJson.asStructure(), renderer.getFullRowList());
	this.m_grid.setCustomObject(resolver);
	this.m_grid.setModelJson(modelJson);
};
oFF.DimensionDialogTestProgram.prototype.initializeProgram = function()
{
	oFF.DfUiProgram.prototype.initializeProgram.call( this );
	oFF.ApplicationUiModule.getInstance();
	this.m_messageManager = oFF.MessageManager.createMessageManagerExt(this.getSession());
	oFF.OlapUiValueHelpAbstract.s_syncType = oFF.SyncType.BLOCKING;
	var traceInfo = oFF.TraceInfo.create();
	traceInfo.setTraceType(oFF.TraceType.URL);
	traceInfo.setTraceName(this.m_test);
	this.getApplication().getConnectionPool().setTraceInfo(this.m_system, traceInfo);
};
oFF.DimensionDialogTestProgram.prototype.onPress = function(event)
{
	var control = event.getControl();
	var controlName = control.getName();
	var controlParentName = control.getParent().getName();
	var customObject = control.getCustomObject();
	switch (controlName)
	{
		case oFF.DimensionDialogTestProgram.UIE_ID_BTN_CONDITIONS:
			this.openConditionsDialog();
			break;

		case oFF.DimensionDialogTestProgram.LAYOUT_BTN:
			this.openLayoutDialog();
			break;

		case oFF.DimensionDialogTestProgram.CUR_CONV_BUTTON:
			this.openCurrencyDialog();
			break;

		case oFF.DimensionDialogTestProgram.DIMENSION_BTN:
			this.m_dimPropMenu.openAt(event.getControl());
			break;

		case oFF.DimensionDialogTestProgram.DIMENSION_EXH_BTN:
			this.m_dimExhPropMenu.openAt(event.getControl());
			break;

		case oFF.DimensionDialogTestProgram.SELECT_SYSTEM_BTN:
			var tmpMenu = this.m_genesis.newControl(oFF.UiType.MENU);
			tmpMenu.addNewItem().setText("Bw Sample System").setName(oFF.DimensionDialogTestProgram.SELECT_SYSTEM_BW_MENU).registerOnPress(this);
			tmpMenu.addNewItem().setText("Bw Sample System 2 Struct").setName(oFF.DimensionDialogTestProgram.SELECT_SYSTEM_BW_2STRUCTURES).registerOnPress(this);
			tmpMenu.addNewItem().setText("Gipsy with CaseSensitive Sorting").setName(oFF.DimensionDialogTestProgram.SELECT_SYSTEM_GIPSY_MENU).registerOnPress(this);
			tmpMenu.addNewItem().setText("Mds Sample System").setName(oFF.DimensionDialogTestProgram.SELECT_SYSTEM_MDS_MENU).registerOnPress(this);
			tmpMenu.addNewItem().setText("Mds Legacy CurTrans").setName(oFF.DimensionDialogTestProgram.SELECT_SYSTEM_MDS_LEGACY_CUR_TRANS).registerOnPress(this);
			tmpMenu.addNewItem().setText("Mds Account CurTrans").setName(oFF.DimensionDialogTestProgram.SELECT_SYSTEM_MDS_ACCOUNT_WITH_MD).registerOnPress(this);
			tmpMenu.addNewItem().setText("Mds Measure CurTrans").setName(oFF.DimensionDialogTestProgram.SELECT_SYSTEM_MDS_MEASURE_WITHOUT_MD).registerOnPress(this);
			tmpMenu.openAt(event.getControl());
			break;

		case oFF.DimensionDialogTestProgram.SELECT_SYSTEM_BW_MENU:
			this.m_system = "KIW";
			this.m_datasource = "query:[0BICS_C03_BICSTEST_Q0020]";
			this.fillDataSourceSeletWidgets();
			break;

		case oFF.DimensionDialogTestProgram.SELECT_SYSTEM_BW_2STRUCTURES:
			this.m_system = "KIW";
			this.m_datasource = "query:[0BICS_009_BICSTEST_Q0001]";
			this.fillDataSourceSeletWidgets();
			break;

		case oFF.DimensionDialogTestProgram.SELECT_SYSTEM_GIPSY_MENU:
			this.m_system = "gipsy";
			this.m_datasource = "view:[_SYS_BIC][mdstest.music][MUSICSALES]";
			this.fillDataSourceSeletWidgets();
			break;

		case oFF.DimensionDialogTestProgram.SELECT_SYSTEM_MDS_MENU:
			this.m_system = "apollo";
			this.m_datasource = "planning:[TENANT_TEST][][/t.TEST/ACT_ANA_income_qs]";
			this.fillDataSourceSeletWidgets();
			break;

		case oFF.DimensionDialogTestProgram.SELECT_SYSTEM_MDS_LEGACY_CUR_TRANS:
			this.m_system = "apollo";
			this.m_datasource = "sfx:[t.TEST.APDCurConv_Ext_Model:APDCurConv_Ext_Model]";
			this.fillDataSourceSeletWidgets();
			break;

		case oFF.DimensionDialogTestProgram.SELECT_SYSTEM_MDS_ACCOUNT_WITH_MD:
			this.m_system = "gipsy";
			this.m_datasource = "inamodel:[MDS_REPO][][MDS_BusinessPlanning_withAccountAndMeasureMembers]";
			this.fillDataSourceSeletWidgets();
			break;

		case oFF.DimensionDialogTestProgram.SELECT_SYSTEM_MDS_MEASURE_WITHOUT_MD:
			this.m_system = "gipsy";
			this.m_datasource = "inamodel:[MDSTEST][][AN_PAID_INVOICES_WITH_CC]";
			this.fillDataSourceSeletWidgets();
			break;

		case oFF.DimensionDialogTestProgram.QUERY_BUTTON:
			this.m_system = this.m_systemInput.getText();
			this.m_datasource = this.m_dataSourceInput.getText();
			this.doQuery();
			break;

		case "DataCellProps":
			this.doOpenDataCellDialog();
			break;

		case "DataCellProps2":
			this.doOpenDataCellDialog2();
			break;

		case oFF.DimensionDialogTestProgram.DATACELL_MENU:
			this.openDataCellDialogForMember(customObject);
			break;

		case oFF.DimensionDialogTestProgram.DIMENSION_CONTEXT_MENU:
			oFF.DdEntryPoint.createEntryPoint(this.getApplication()).openDimensionDialog(oFF.XStringUtils.concatenate3(customObject.getName(), "/", customObject.getText()), customObject, this);
			break;

		case oFF.DimensionDialogTestProgram.FILTER_CONTEXT_MENU:
			oFF.FdEntryPoint.createEntryPoint(this.getApplication(), oFF.XStringUtils.concatenate3(customObject.getName(), "/", customObject.getText())).openWithDimension(customObject, this);
			break;

		case oFF.DimensionDialogTestProgram.COLLAPSE_MENU:
			control.getCustomObject().setNextDrillState(oFF.DrillState.COLLAPSED);
			this.updateGrid();
			break;

		case oFF.DimensionDialogTestProgram.DRILL_MENU:
			control.getCustomObject().setNextDrillState(oFF.DrillState.DRILLED);
			this.updateGrid();
			break;

		case oFF.DimensionDialogTestProgram.EXPAND_MENU:
			control.getCustomObject().setNextDrillState(oFF.DrillState.EXPANDED);
			this.updateGrid();
			break;

		default:
			switch (controlParentName)
			{
				case oFF.DimensionDialogTestProgram.DIMENSION_MENU:
					oFF.DdEntryPoint.createEntryPoint(this.getApplication()).openDimensionDialog(oFF.XStringUtils.concatenate3(customObject.getName(), "/", customObject.getText()), customObject, this);
					break;

				case oFF.DimensionDialogTestProgram.DIMENSION_EXHAUSTIVE_MENU:
					oFF.DdExhaustiveEntryPoint.createEntryPoint(this.getApplication()).openDimensionDialog(oFF.XStringUtils.concatenate3(customObject.getName(), "/", customObject.getText()), customObject, this);
					break;

				default:
					break;
			}
	}
};
oFF.DimensionDialogTestProgram.prototype.openConditionsDialog = function()
{
	var loEntryPoint = oFF.OuEntryPointConditions.sCreateConditionsDialogEntryPoint(this.getApplication());
	var loQueryModel = null;
	if (oFF.notNull(this.m_queryManager))
	{
		loQueryModel = this.m_queryManager.getQueryModel();
	}
	loEntryPoint.openConditions(loQueryModel);
};
oFF.DimensionDialogTestProgram.prototype.m_dcController = null;
oFF.DimensionDialogTestProgram.prototype.openLayoutDialog = function()
{
	var aldOceanEntryPoint = oFF.AldEntryPoint.createEntryPoint(this.getApplication());
	aldOceanEntryPoint.openAldDialog("Axis layout", this.m_queryManager.getQueryModel(), this);
};
oFF.DimensionDialogTestProgram.prototype.openDataCellDialogForMember = function(structureMember)
{
	var displayManager = oFF.OlapUiDisplayFactory.createFactoryForDialog(this.getUiManager());
	var context = oFF.OlapUiContext.createContext(this.getUiManager(), displayManager);
	if (oFF.isNull(this.m_dcController))
	{
		this.m_dcController = oFF.DataCellController.create(context);
	}
	if (structureMember.getDimension().isMeasureStructure())
	{
		this.m_dcController.openDataCellPropertiesDialog(this, this.m_queryManager, structureMember.getName(), null, false);
	}
	else
	{
		this.m_dcController.openDataCellPropertiesDialog(this, this.m_queryManager, null, structureMember.getName(), true);
	}
};
oFF.DimensionDialogTestProgram.prototype.doOpenDataCellDialog = function()
{
	var displayManager = oFF.OlapUiDisplayFactory.createFactoryForDialog(this.getUiManager());
	var context = oFF.OlapUiContext.createContext(this.getUiManager(), displayManager);
	if (oFF.isNull(this.m_dcController))
	{
		this.m_dcController = oFF.DataCellController.create(context);
	}
	var measure1 = this.m_queryManager.getQueryModel().getMeasureDimension().getAllStructureMembers().get(0);
	this.m_dcController.openDataCellPropertiesDialog(this, this.m_queryManager, measure1.getName(), null, false);
};
oFF.DimensionDialogTestProgram.prototype.doOpenDataCellDialog2 = function()
{
	var displayManager = oFF.OlapUiDisplayFactory.createFactoryForDialog(this.getUiManager());
	var context = oFF.OlapUiContext.createContext(this.getUiManager(), displayManager);
	if (oFF.isNull(this.m_dcController))
	{
		this.m_dcController = oFF.DataCellController.create(context);
	}
	var measure1 = this.m_queryManager.getQueryModel().getMeasureDimension().getAllStructureMembers().get(0);
	var structure1 = null;
	var nonMeasureDimension = this.m_queryManager.getQueryModel().getNonMeasureDimension();
	if (oFF.notNull(nonMeasureDimension) && nonMeasureDimension.getAllStructureMembers().size() > 1)
	{
		structure1 = nonMeasureDimension.getAllStructureMembers().get(2);
	}
	this.m_dcController.openDataCellPropertiesDialog(this, this.m_queryManager, measure1.getName(), oFF.isNull(structure1) ? null : structure1.getName(), true);
};
oFF.DimensionDialogTestProgram.prototype.onDataCellOk = function()
{
	this.updateGrid();
};
oFF.DimensionDialogTestProgram.prototype.onDataCellClose = function()
{
	this.m_dcController.close();
};
oFF.DimensionDialogTestProgram.prototype.openCurrencyDialog = function()
{
	var qccEntryPoint = oFF.CtEntryPoint.createEntryPoint(this.getApplication());
	qccEntryPoint.openQCTDialog("Currency conversion", this.m_queryManager.getQueryModel().getCurrencyTranslationManager(), this);
};
oFF.DimensionDialogTestProgram.prototype.onSubmit = function()
{
	this.updateGrid();
	this.updateDimensionMenu();
};
oFF.DimensionDialogTestProgram.prototype.onClose = function() {};
oFF.DimensionDialogTestProgram.prototype.onLiveChange = function(event)
{
	this.needsQuery();
};
oFF.DimensionDialogTestProgram.prototype.needsQuery = function()
{
	this.m_oUIEBtnConditions.setEnabled(false);
	this.m_dimPropMenu.setEnabled(false);
	this.m_dimExhPropMenu.setEnabled(false);
	this.m_curConvBtn.setEnabled(false);
	this.m_dimPropBtn.setEnabled(false);
	this.m_dimExhPropBtn.setEnabled(false);
	this.m_layoutBtn.setEnabled(false);
	this.m_queryButton.setEnabled(true);
};
oFF.DimensionDialogTestProgram.prototype.onClick = function(event) {};
oFF.DimensionDialogTestProgram.prototype.onContextMenu = function(event)
{
	oFF.XLogger.println(event.getControl().toString());
	var column = event.getParameters().getIntegerByKey(oFF.UiControlEvent.PARAM_COLUMN);
	var row = event.getParameters().getIntegerByKey(oFF.UiControlEvent.PARAM_ROW);
	var resolver = event.getControl().getCustomObject();
	this.m_contextMenu.clearItems();
	var menuItem = this.m_contextMenu.addNewItem();
	menuItem.setText("Layout ...");
	menuItem.setName(oFF.DimensionDialogTestProgram.LAYOUT_BTN);
	menuItem.registerOnPress(this);
	var tupleElement = resolver.getColumnTupleElement(column, row);
	if (oFF.isNull(tupleElement))
	{
		tupleElement = resolver.getRowTupleElement(column, row);
	}
	if (oFF.notNull(tupleElement))
	{
		var drillState = tupleElement.getDrillState();
		if (drillState === oFF.DrillState.COLLAPSED || drillState === oFF.DrillState.COLLAPSED_EXPAND_AND_DRILLDOWN_ALLOWED || drillState === oFF.DrillState.LEAF_UDH_EXPAND_ALLOWED)
		{
			menuItem = this.m_contextMenu.addNewItem();
			menuItem.setText("Expand node");
			menuItem.setName(oFF.DimensionDialogTestProgram.EXPAND_MENU);
			menuItem.setCustomObject(tupleElement);
			menuItem.registerOnPress(this);
		}
		if (drillState === oFF.DrillState.COLLAPSED_EXPAND_AND_DRILLDOWN_ALLOWED || drillState === oFF.DrillState.LEAF_DRILLDOWN_ALLOWED)
		{
			menuItem = this.m_contextMenu.addNewItem();
			menuItem.setText("Drill node");
			menuItem.setName(oFF.DimensionDialogTestProgram.DRILL_MENU);
			menuItem.setCustomObject(tupleElement);
			menuItem.registerOnPress(this);
		}
		if (drillState === oFF.DrillState.EXPANDED || drillState === oFF.DrillState.DRILLED || drillState === oFF.DrillState.DRILL_DOWN)
		{
			menuItem = this.m_contextMenu.addNewItem();
			menuItem.setText("Collapse node");
			menuItem.setName(oFF.DimensionDialogTestProgram.COLLAPSE_MENU);
			menuItem.setCustomObject(tupleElement);
			menuItem.registerOnPress(this);
		}
	}
	var dimension = resolver.getColumnDimension(row);
	if (oFF.isNull(dimension))
	{
		dimension = resolver.getRowDimension(column);
	}
	if (oFF.notNull(dimension))
	{
		dimension = this.m_queryManager.getQueryModel().getDimensionByName(dimension.getName());
		if (!dimension.isUniversalDisplayHierarchyDimension())
		{
			menuItem = this.m_contextMenu.addNewItem();
			menuItem.setText(oFF.XStringUtils.concatenate2("Settings for dimension ", dimension.getText()));
			menuItem.setName(oFF.DimensionDialogTestProgram.DIMENSION_CONTEXT_MENU);
			menuItem.setCustomObject(dimension);
			menuItem.registerOnPress(this);
			menuItem = this.m_contextMenu.addNewItem();
			menuItem.setText(oFF.XStringUtils.concatenate2("Filter on dimension ", dimension.getText()));
			menuItem.setName(oFF.DimensionDialogTestProgram.FILTER_CONTEXT_MENU);
			menuItem.setCustomObject(dimension);
			menuItem.registerOnPress(this);
		}
	}
	var dimensionMember;
	var i;
	var tuple = resolver.getRowTuple(row);
	var structureMember;
	if (oFF.notNull(tuple))
	{
		for (i = 0; i < tuple.size(); i++)
		{
			tupleElement = tuple.getTupleElementAt(i);
			dimensionMember = tupleElement.getDimensionMember();
			structureMember = tupleElement.getDimension().getStructureMember(dimensionMember.getName());
			if (oFF.notNull(structureMember))
			{
				menuItem = this.m_contextMenu.addNewItem();
				menuItem.setText(oFF.XStringUtils.concatenate2("Properties for ", dimensionMember.getText()));
				menuItem.setName(oFF.DimensionDialogTestProgram.DATACELL_MENU);
				menuItem.setCustomObject(structureMember);
				menuItem.registerOnPress(this);
				break;
			}
		}
	}
	tuple = resolver.getColumnTuple(column);
	if (oFF.notNull(tuple))
	{
		for (i = 0; i < tuple.size(); i++)
		{
			tupleElement = tuple.getTupleElementAt(i);
			dimensionMember = tupleElement.getDimensionMember();
			structureMember = tupleElement.getDimension().getStructureMember(dimensionMember.getName());
			if (oFF.notNull(structureMember))
			{
				menuItem = this.m_contextMenu.addNewItem();
				menuItem.setText(oFF.XStringUtils.concatenate2("Properties for ", dimensionMember.getText()));
				menuItem.setName(oFF.DimensionDialogTestProgram.DATACELL_MENU);
				menuItem.setCustomObject(structureMember);
				menuItem.registerOnPress(this);
				break;
			}
		}
	}
	var clickX = event.getParameters().getIntegerByKeyExt(oFF.UiControlEvent.PARAM_CLICK_X, 0);
	var clickY = event.getParameters().getIntegerByKeyExt(oFF.UiControlEvent.PARAM_CLICK_Y, 0);
	this.m_contextMenu.openAtPosition(clickX, clickY);
};
oFF.DimensionDialogTestProgram.prototype.onFilterDialogOk = function(selection)
{
	if (oFF.XCollectionUtils.hasElements(selection))
	{
		var member = selection.get(0).getNode().getDimensionMember();
		var dimension = member.getDimension();
		var cartesianList = this.m_queryManager.getQueryModel().getFilter().getDynamicFilter().getCartesianProductWithDefault().getCartesianListWithDefault(dimension);
		cartesianList.addNewCartesianElement().configureSingleParameterExpression(member.getFieldValue(dimension.getKeyField()).getValue(), oFF.ComparisonOperator.EQUAL);
		this.updateGrid();
	}
};
oFF.DimensionDialogTestProgram.prototype.onFilterDialogCancel = function() {};

oFF.FilterDialogProgram = function() {};
oFF.FilterDialogProgram.prototype = new oFF.DfUiProgram();
oFF.FilterDialogProgram.prototype._ff_c = "FilterDialogProgram";

oFF.FilterDialogProgram.DEFAULT_PROGRAM_NAME = "FilterDialog";
oFF.FilterDialogProgram.PARAM_SYSTEM = "system";
oFF.FilterDialogProgram.PARAM_DATASOURCE = "datasource";
oFF.FilterDialogProgram.PARAM_DIMENSION = "dimension";
oFF.FilterDialogProgram.PARAM_VARIABLE = "variable";
oFF.FilterDialogProgram.PARAM_HIERARCHY = "hierarchy";
oFF.FilterDialogProgram.PARAM_TEST = "test";
oFF.FilterDialogProgram.createRunner = function()
{
	return oFF.KernelBoot.createByName(oFF.FilterDialogProgram.DEFAULT_PROGRAM_NAME);
};
oFF.FilterDialogProgram.prototype.m_system = null;
oFF.FilterDialogProgram.prototype.m_datasource = null;
oFF.FilterDialogProgram.prototype.m_dimension = null;
oFF.FilterDialogProgram.prototype.m_variable = null;
oFF.FilterDialogProgram.prototype.m_hierarchy = null;
oFF.FilterDialogProgram.prototype.m_test = null;
oFF.FilterDialogProgram.prototype.m_programLayout = null;
oFF.FilterDialogProgram.prototype.m_featureTogglesDialog = null;
oFF.FilterDialogProgram.prototype.m_queryManager = null;
oFF.FilterDialogProgram.prototype.m_entryPoint = null;
oFF.FilterDialogProgram.prototype.m_fdOrcaEntryPoint = null;
oFF.FilterDialogProgram.prototype.releaseObject = function()
{
	oFF.DfUiProgram.prototype.releaseObject.call( this );
	this.m_system = null;
	this.m_datasource = null;
	this.m_dimension = null;
	this.m_variable = null;
	this.m_hierarchy = null;
	this.m_test = null;
	this.m_queryManager = oFF.XObjectExt.release(this.m_queryManager);
	this.m_entryPoint = oFF.XObjectExt.release(this.m_entryPoint);
	this.m_featureTogglesDialog = oFF.XObjectExt.release(this.m_featureTogglesDialog);
	this.m_programLayout = oFF.XObjectExt.release(this.m_programLayout);
	this.m_fdOrcaEntryPoint = oFF.XObjectExt.release(this.m_fdOrcaEntryPoint);
};
oFF.FilterDialogProgram.prototype.newProgram = function()
{
	var filterDialogProgram = new oFF.FilterDialogProgram();
	filterDialogProgram.setup();
	return filterDialogProgram;
};
oFF.FilterDialogProgram.prototype.doSetupProgramMetadata = function(metadata)
{
	oFF.DfUiProgram.prototype.doSetupProgramMetadata.call( this , metadata);
	metadata.addParameter(oFF.FilterDialogProgram.PARAM_SYSTEM, "The system to connect to.");
	metadata.addParameter(oFF.FilterDialogProgram.PARAM_DATASOURCE, "The datasource to be used (Can be empty for planning sequences).");
	metadata.addParameter(oFF.FilterDialogProgram.PARAM_DIMENSION, "The dimension to be used.");
	metadata.addParameter(oFF.FilterDialogProgram.PARAM_VARIABLE, "The variable to be used.");
	metadata.addParameter(oFF.FilterDialogProgram.PARAM_HIERARCHY, "The hierarchy to used.");
	metadata.addParameter(oFF.FilterDialogProgram.PARAM_TEST, "The name of the running test (Optional).");
};
oFF.FilterDialogProgram.prototype.evalArguments = function()
{
	var argumentStructure = this.getArgumentStructure();
	if (argumentStructure.getIntegerByKeyExt(oFF.DfProgram.PARAM_XVERSION, -1) === -1)
	{
		argumentStructure.putInteger(oFF.DfProgram.PARAM_XVERSION, oFF.XVersion.V140_REPOSITORY_PERSIST_PAGING);
	}
	oFF.DfUiProgram.prototype.evalArguments.call( this );
	this.m_system = this.getParameterValue(oFF.FilterDialogProgram.PARAM_SYSTEM);
	this.m_datasource = this.getParameterValue(oFF.FilterDialogProgram.PARAM_DATASOURCE);
	this.m_dimension = this.getParameterValue(oFF.FilterDialogProgram.PARAM_DIMENSION);
	this.m_variable = this.getParameterValue(oFF.FilterDialogProgram.PARAM_VARIABLE);
	this.m_hierarchy = this.getParameterValue(oFF.FilterDialogProgram.PARAM_HIERARCHY);
	this.m_test = this.getParameterValue(oFF.FilterDialogProgram.PARAM_TEST);
	if (oFF.XStringUtils.isNullOrEmpty(this.m_system) || oFF.XStringUtils.isNullOrEmpty(this.m_datasource))
	{
		this.m_system = "KIW";
		this.m_datasource = "query:[0BOC_TEST_VARIABLE_TYPES_1]";
		this.m_dimension = "0BC_CUST";
		this.m_variable = null;
		this.m_hierarchy = null;
	}
};
oFF.FilterDialogProgram.prototype.getParameterValue = function(name)
{
	var value = this.getSession().getEnvironment().getStringByKey(name);
	return oFF.XStringUtils.isNotNullAndNotEmpty(value) ? value : this.getArgumentStructure().getStringByKey(name);
};
oFF.FilterDialogProgram.prototype.initializeProgram = function()
{
	oFF.DfUiProgram.prototype.initializeProgram.call( this );
	oFF.ApplicationUiModule.getInstance();
	var traceInfo = oFF.TraceInfo.create();
	traceInfo.setTraceType(oFF.TraceType.URL);
	traceInfo.setTraceName(this.m_test);
	this.getApplication().getConnectionPool().setTraceInfo(this.m_system, traceInfo);
};
oFF.FilterDialogProgram.prototype.isShowMenuBar = function()
{
	return true;
};
oFF.FilterDialogProgram.prototype.buildUi = function(genesis)
{
	oFF.DfUiProgram.prototype.buildUi.call( this , genesis);
	this.m_programLayout = oFF.FilterDialogProgramLayout.create(genesis, this.getMenuBar(), this, this);
	this.setupQueryManager();
};
oFF.FilterDialogProgram.prototype.setupQueryManager = function()
{
	this.m_programLayout.showActivityIndicator();
	this.m_queryManager = oFF.XObjectExt.release(this.m_queryManager);
	var serviceConfig = oFF.QueryServiceConfig.createWithDataSourceName(this.getApplication(), this.m_system, this.m_datasource);
	serviceConfig.processQueryManagerCreation(oFF.SyncType.NON_BLOCKING, this, null);
};
oFF.FilterDialogProgram.prototype.onQueryManagerCreated = function(extResult, queryManager, customIdentifier)
{
	if (extResult.hasErrors())
	{
		this.m_programLayout.showChangeDataSourceButton();
		this.m_programLayout.showErrorToast(extResult.getSummary());
		return;
	}
	this.m_queryManager = extResult.getData();
	this.m_programLayout.showUi(queryManager, oFF.XStringUtils.concatenate3(this.m_system, " - ", this.m_datasource), this.m_dimension, this.m_hierarchy, this.m_variable);
	this.m_dimension = this.m_programLayout.getDimensionDropdown().getSelectedName();
	this.m_variable = this.m_programLayout.getVariableDropdown().getSelectedName();
};
oFF.FilterDialogProgram.prototype.onSelect = function(event)
{
	this.m_programLayout.getSelectionTextArea().setText(null);
	this.m_programLayout.getOutputTextArea().setText(null);
	if (event.getControl() === this.m_programLayout.getDimensionDropdown())
	{
		this.m_dimension = this.m_programLayout.getDimensionDropdown().getSelectedItem().getText();
		var dimension = this.m_queryManager.getDimensionAccessor().getDimensionByName(this.m_dimension);
		this.m_programLayout.getHierarchyInput().setText(oFF.notNull(dimension) ? dimension.getHierarchyName() : null);
	}
	else if (event.getControl() === this.m_programLayout.getVariableDropdown())
	{
		this.m_variable = this.m_programLayout.getVariableDropdown().getSelectedItem().getText();
	}
};
oFF.FilterDialogProgram.prototype.onPress = function(event)
{
	var control = event.getControl();
	if (control === this.m_programLayout.getOpenFilterDialogBtn())
	{
		this.openFilterDialog();
	}
	else if (control === this.m_programLayout.getChangeDataSourceBtn())
	{
		this.openDataSourceDialog();
	}
	else if (control === this.m_programLayout.getFeatureTogglesBtn())
	{
		this.openFeatureTogglesDialog();
	}
	else if (control === this.m_programLayout.getSetVariablesBtn())
	{
		oFF.VdUqmEntryPoint.createEntryPoint("Set Variables", this.m_queryManager.getVariableProcessor(), this).open();
	}
};
oFF.FilterDialogProgram.prototype.openFilterDialog = function()
{
	oFF.OlapUiValueHelpAbstract.s_syncType = this.m_programLayout.getNonBlockingCheckbox().isChecked() ? oFF.SyncType.NON_BLOCKING : oFF.SyncType.BLOCKING;
	this.m_entryPoint = oFF.XObjectExt.release(this.m_entryPoint);
	if (this.m_programLayout.getDataObjectDimensionRadioBtn().isSelected() && this.m_queryManager.hasVariables() && this.m_queryManager.isSubmitNeeded())
	{
		this.m_queryManager.submitVariables(oFF.SyncType.BLOCKING, null, null);
	}
	else if (this.m_programLayout.getDataObjectVariableRadioBtn().isSelected() && !this.m_programLayout.getEntryPointSacRadioBtn().isSelected() && this.m_queryManager.isReinitNeeded())
	{
		this.m_queryManager.reInitVariablesAfterSubmit(oFF.SyncType.BLOCKING, null, null);
	}
	if (this.m_programLayout.getEntryPointDefaultRadioBtn().isSelected())
	{
		var selectedItems = oFF.XList.create();
		var selectionText = this.m_programLayout.getSelectionTextArea().getText();
		if (oFF.XStringUtils.isNotNullAndNotEmpty(selectionText))
		{
			var selectedValues = oFF.XStringTokenizer.splitString(selectionText, ",");
			for (var i = 0; i < selectedValues.size(); i++)
			{
				selectedItems.add(oFF.FdItemFactory.createItemByKey(null, oFF.XString.trim(selectedValues.get(i)), null));
			}
		}
		this.openFilterDialogWithFdEntryPoint(selectedItems);
	}
	else if (this.m_programLayout.getEntryPointSacRadioBtn().isSelected())
	{
		this.openFilterDialogWithFdOrcaEntryPoint();
	}
};
oFF.FilterDialogProgram.prototype.openFilterDialogWithFdEntryPoint = function(selectedItems)
{
	this.m_entryPoint = oFF.FdEntryPoint.createEntryPoint(this.getApplication(), "Filter Dialog");
	this.m_entryPoint.setFeatureToggleProvider(this);
	var config = this.m_entryPoint.getConfiguration();
	config.setMultiSelection(this.m_programLayout.getMultiSelectionModeCheckbox().isChecked());
	config.setAlwaysShowSelectionContainer(this.m_programLayout.getShowSelectionContainerCheckBox().isChecked());
	config.setSelection(selectedItems);
	config.setDimensionDisplayInfo(this.m_programLayout.getDisplayInfoDropdown().getSelectedItem().getCustomObject());
	config.setPageSize(oFF.XInteger.convertFromStringWithDefault(this.m_programLayout.getPageSizeInput().getText(), oFF.FdConfiguration.DEFAULT_PAGE_SIZE));
	config.setFunctionalValuesEnabled(true);
	if (this.m_programLayout.getDataObjectDimensionRadioBtn().isSelected())
	{
		var dimension = this.getSelectedDimension();
		if (oFF.notNull(dimension))
		{
			if (this.m_programLayout.getUseDynamicFilterCheckbox().isChecked())
			{
				this.m_entryPoint.openWithDynamicFilter(dimension, this);
			}
			else
			{
				this.m_entryPoint.openWithDimension(dimension, this);
			}
		}
	}
	else if (this.m_programLayout.getDataObjectVariableRadioBtn().isSelected())
	{
		var variable = this.getSelectedVariable();
		if (oFF.notNull(variable))
		{
			this.m_entryPoint.openWithVariable(variable, this);
		}
	}
};
oFF.FilterDialogProgram.prototype.getSelectedDimension = function()
{
	var selectedDimension = this.m_programLayout.getDimensionDropdown().getSelectedItem();
	var dimension = oFF.notNull(selectedDimension) ? this.m_queryManager.getDimensionAccessor().getDimensionByName(selectedDimension.getText()) : null;
	if (oFF.isNull(dimension))
	{
		this.m_programLayout.showErrorToast("Invalid dimension");
		return null;
	}
	var hierarchy = this.m_programLayout.getHierarchyInput().getText();
	if (oFF.XStringUtils.isNotNullAndNotEmpty(hierarchy))
	{
		dimension.setHierarchyName(hierarchy);
		dimension.setHierarchyActive(true);
	}
	else if (dimension.supportsHierarchy())
	{
		dimension.setHierarchyActive(false);
	}
	return dimension;
};
oFF.FilterDialogProgram.prototype.getSelectedVariable = function()
{
	var selectedVariable = this.m_programLayout.getVariableDropdown().getSelectedItem();
	var variable = oFF.notNull(selectedVariable) ? this.m_queryManager.getVariable(selectedVariable.getText()) : null;
	if (oFF.isNull(variable))
	{
		this.m_programLayout.showErrorToast("Invalid variable");
		return null;
	}
	return variable;
};
oFF.FilterDialogProgram.prototype.openFilterDialogWithFdOrcaEntryPoint = function()
{
	if (this.m_programLayout.getDataObjectDimensionRadioBtn().isSelected())
	{
		this.m_programLayout.showErrorToast("Opening filter dialog for dimension with SAC entry point is not yet supported");
	}
	else if (this.m_programLayout.getDataObjectVariableRadioBtn().isSelected())
	{
		var variable = this.getSelectedVariable();
		if (oFF.notNull(variable))
		{
			if (oFF.isNull(this.m_fdOrcaEntryPoint))
			{
				this.m_fdOrcaEntryPoint = oFF.FdOrcaEntryPoint.create(this.getApplication(), null, oFF.GyrosNumberFormatter.create(), this, null);
			}
			this.m_fdOrcaEntryPoint.prepareVariableProcessorState(variable, this);
		}
	}
};
oFF.FilterDialogProgram.prototype.onVariableProcessorExecuted = function(extResult, result, customIdentifier)
{
	var selectedDataAsJson;
	try
	{
		var selectedData = this.m_programLayout.getSelectionTextArea().getText();
		selectedDataAsJson = oFF.XStringUtils.isNotNullAndNotEmpty(selectedData) ? oFF.JsonParserFactory.createFromString(selectedData).asStructure() : null;
	}
	catch (e)
	{
		this.m_programLayout.showErrorToast("Json is not a valid structure");
		return;
	}
	if (!this.m_fdOrcaEntryPoint.openForVariable(this.getSelectedVariable(), selectedDataAsJson, this))
	{
		this.m_programLayout.showErrorToast("Opening the dialog failed");
	}
};
oFF.FilterDialogProgram.prototype.isActive = function(text)
{
	if (oFF.XString.isEqual(text, oFF.OlapUiFeatureToggle.MEMBERSELECTOR_READMODE_SWITCH))
	{
		return this.m_programLayout.getFeatureToggleReadMode().isChecked();
	}
	return true;
};
oFF.FilterDialogProgram.prototype.onOk = function() {};
oFF.FilterDialogProgram.prototype.onCancel = function() {};
oFF.FilterDialogProgram.prototype.openDataSourceDialog = function()
{
	var appStoreDlgManifest = oFF.ProgramRegistration.getProgramManifest(oFF.AuDatasourcePicker.DEFAULT_PROGRAM_NAME);
	var appStoreDlgStartCfg = oFF.ProgramStartCfg.create(this.getProcess(), appStoreDlgManifest.getName(), null, null);
	var tmpArgs = appStoreDlgStartCfg.getArguments();
	tmpArgs.putString(oFF.AuDatasourcePicker.PARAM_SYSTEM, this.m_system);
	tmpArgs.putXObject(oFF.AuDatasourcePicker.PARAM_LISTENER, this);
	appStoreDlgStartCfg.setParentProcess(this.getProcess());
	appStoreDlgStartCfg.setIsCreatingChildProcess(true);
	appStoreDlgStartCfg.processExecution(oFF.SyncType.NON_BLOCKING, null, null);
};
oFF.FilterDialogProgram.prototype.onDatasourceSelected = function(dataSource)
{
	if (oFF.notNull(dataSource))
	{
		this.m_system = dataSource.getSystemName();
		this.m_datasource = dataSource.getFullQualifiedName();
		this.setupQueryManager();
	}
};
oFF.FilterDialogProgram.prototype.openFeatureTogglesDialog = function()
{
	oFF.XObjectExt.release(this.m_featureTogglesDialog);
	this.m_featureTogglesDialog = oFF.UiFeatureToggleDialog.createFeatureDialog(this.getSession(), this.getUiManager(), this);
	this.m_featureTogglesDialog.open();
};
oFF.FilterDialogProgram.prototype.onFeatureToggleDialogClose = function(selectedToggles)
{
	if (oFF.notNull(selectedToggles))
	{
		var session = this.getSession();
		session.clearAllFeatureToggles();
		session.activateFeatureToggleSet(selectedToggles);
		this.setupQueryManager();
	}
};
oFF.FilterDialogProgram.prototype.onFilterDialogOk = function(selection)
{
	var varMemberFilter = null;
	if (this.m_programLayout.getDataObjectVariableRadioBtn().isSelected() && this.getSelectedVariable() !== null)
	{
		varMemberFilter = this.getSelectedVariable().getMemberFilter();
		varMemberFilter.clear();
	}
	var selectedDisplayKeys = oFF.XStringBuffer.create();
	var outputText = "No elements selected";
	if (oFF.XCollectionUtils.hasElements(selection))
	{
		var output = oFF.XStringBuffer.create();
		for (var i = 0; i < selection.size(); i++)
		{
			if (i > 0)
			{
				selectedDisplayKeys.append(",");
				output.appendNewLine();
			}
			var item = selection.get(i);
			var displayKey = item.getDisplayKey();
			var text = item.getText();
			selectedDisplayKeys.append(displayKey);
			output.append(displayKey);
			output.append(" - ");
			output.append(text);
			if (oFF.notNull(varMemberFilter))
			{
				varMemberFilter.addNewCartesianElement().getLow().setString(item.getKey());
			}
		}
		outputText = output.toString();
	}
	this.m_programLayout.getSelectionTextArea().setText(selectedDisplayKeys.toString());
	this.m_programLayout.getOutputTextArea().setText(outputText);
};
oFF.FilterDialogProgram.prototype.onFilterDialogCancel = function()
{
	this.m_programLayout.getOutputTextArea().setText("Selection canceled");
};
oFF.FilterDialogProgram.prototype.onOrcaFilterDialogOk = function(selection)
{
	var parsedResult = oFF.JsonParserFactory.createFromString(selection).asStructure();
	var prettyPrintedSelection = oFF.PrUtils.serialize(parsedResult, false, true, 2);
	this.m_programLayout.getSelectionTextArea().setText(selection);
	this.m_programLayout.getOutputTextArea().setText(oFF.XStringUtils.concatenate2("Selection changed:\n\n", prettyPrintedSelection));
	if (this.m_programLayout.getDataObjectVariableRadioBtn().isSelected() && this.getSelectedVariable() !== null)
	{
		var varMemberFilter = this.getSelectedVariable().getMemberFilter();
		varMemberFilter.clear();
		var selectedData = parsedResult.getListByKey(oFF.OrcaConstants.SELECTED_DATA);
		for (var i = 0; i < selectedData.size(); i++)
		{
			var selectedKey = selectedData.getStructureAt(i).getStringByKey(oFF.OrcaConstants.NAME);
			varMemberFilter.addNewCartesianElement().getLow().setString(selectedKey);
		}
	}
};
oFF.FilterDialogProgram.prototype.onOrcaFilterDialogCancel = function()
{
	this.m_programLayout.getOutputTextArea().setText("Selection canceled");
};
oFF.FilterDialogProgram.prototype.onFilterUpdated = function(filterChanged)
{
	var output = oFF.XStringBuffer.create();
	output.append(filterChanged ? "Filter changed:" : "Filter has not been changed:").appendNewLine();
	var selectedDimension = this.m_programLayout.getDimensionDropdown().getSelectedItem();
	var dimension = oFF.notNull(selectedDimension) ? this.m_queryManager.getDimensionAccessor().getDimensionByName(selectedDimension.getText()) : null;
	if (oFF.notNull(dimension))
	{
		var filter = dimension.getFilter();
		if (oFF.notNull(filter))
		{
			output.appendNewLine().append(filter.serializeToString(oFF.QModelFormat.INA_DATA));
		}
		else
		{
			output.append("No filter set for dimension");
		}
	}
	else
	{
		output.append("Invalid dimension");
	}
	this.m_programLayout.getSelectionTextArea().setText(null);
	this.m_programLayout.getOutputTextArea().setText(output.toString());
};

oFF.GsGalaxyStudio = function() {};
oFF.GsGalaxyStudio.prototype = new oFF.DfUiProgram();
oFF.GsGalaxyStudio.prototype._ff_c = "GsGalaxyStudio";

oFF.GsGalaxyStudio.DEFAULT_PROGRAM_NAME = "GalaxyStudio";
oFF.GsGalaxyStudio.ACTION_BAR_ITEM_SPACING = "10px";
oFF.GsGalaxyStudio.RECENT_FILES_SEPARATOR = ",";
oFF.GsGalaxyStudio.GALAXY_RECENT_FILES_KEY = "galaxy_recentFiles";
oFF.GsGalaxyStudio.createRunner = function()
{
	var runner = oFF.KernelBoot.createByName(oFF.GsGalaxyStudio.DEFAULT_PROGRAM_NAME);
	return runner;
};
oFF.GsGalaxyStudio.createNewVulcan = function()
{
	var prg = new oFF.GsGalaxyStudio();
	prg.setup();
	return prg;
};
oFF.GsGalaxyStudio.prototype.m_file = null;
oFF.GsGalaxyStudio.prototype.m_mainLayout = null;
oFF.GsGalaxyStudio.prototype.m_runActionBarBtn = null;
oFF.GsGalaxyStudio.prototype.m_stopActionBarBtn = null;
oFF.GsGalaxyStudio.prototype.m_splitActionBarBtn = null;
oFF.GsGalaxyStudio.prototype.m_codeEditor = null;
oFF.GsGalaxyStudio.prototype.m_appContainerWrapper = null;
oFF.GsGalaxyStudio.prototype.m_appContainer = null;
oFF.GsGalaxyStudio.prototype.m_quasarEngine = null;
oFF.GsGalaxyStudio.prototype.m_quasarEngineGenesis = null;
oFF.GsGalaxyStudio.prototype.m_recentFiles = null;
oFF.GsGalaxyStudio.prototype.newProgram = function()
{
	var prg = new oFF.GsGalaxyStudio();
	prg.setup();
	return prg;
};
oFF.GsGalaxyStudio.prototype.doSetupProgramMetadata = function(metadata)
{
	oFF.DfUiProgram.prototype.doSetupProgramMetadata.call( this , metadata);
	metadata.addOption(oFF.DfProgram.PARAM_FILE, "Specify the file to open", "Path to the file ", oFF.XValueType.STRING);
};
oFF.GsGalaxyStudio.prototype.evalArguments = function()
{
	oFF.DfUiProgram.prototype.evalArguments.call( this );
	var argStruct = this.getArgumentStructure();
	var fileName = argStruct.getStringByKey(oFF.DfProgram.PARAM_FILE);
	if (oFF.XStringUtils.isNotNullAndNotEmpty(fileName) === true)
	{
		this.openFileByPath(fileName);
	}
};
oFF.GsGalaxyStudio.prototype.initializeProgram = function()
{
	oFF.DfUiProgram.prototype.initializeProgram.call( this );
	this.setupInternal();
};
oFF.GsGalaxyStudio.prototype.releaseObject = function()
{
	oFF.DfUiProgram.prototype.releaseObject.call( this );
	this.m_file = null;
	this.m_recentFiles = oFF.XObjectExt.release(this.m_recentFiles);
	this.m_runActionBarBtn = oFF.XObjectExt.release(this.m_runActionBarBtn);
	this.m_stopActionBarBtn = oFF.XObjectExt.release(this.m_stopActionBarBtn);
	this.m_splitActionBarBtn = oFF.XObjectExt.release(this.m_splitActionBarBtn);
	this.m_appContainer = oFF.XObjectExt.release(this.m_appContainer);
	this.m_appContainerWrapper = oFF.XObjectExt.release(this.m_appContainerWrapper);
	this.m_codeEditor = oFF.XObjectExt.release(this.m_codeEditor);
	this.m_mainLayout = oFF.XObjectExt.release(this.m_mainLayout);
	this.m_quasarEngineGenesis = oFF.XObjectExt.release(this.m_quasarEngineGenesis);
	this.m_quasarEngine = oFF.XObjectExt.release(this.m_quasarEngine);
};
oFF.GsGalaxyStudio.prototype.getLogSeverity = function()
{
	return oFF.DfUiProgram.prototype.getLogSeverity.call( this );
};
oFF.GsGalaxyStudio.prototype.isShowMenuBar = function()
{
	return true;
};
oFF.GsGalaxyStudio.prototype.getDefaultContainerSize = function()
{
	return oFF.UiSize.createByCss("70vw", "70vh");
};
oFF.GsGalaxyStudio.prototype.getMenuBarDisplayName = function()
{
	return oFF.GsGalaxyStudio.DEFAULT_PROGRAM_NAME;
};
oFF.GsGalaxyStudio.prototype.setupInternal = function()
{
	this.initSettings();
};
oFF.GsGalaxyStudio.prototype.buildUi = function(genesis)
{
	oFF.DfUiProgram.prototype.buildUi.call( this , genesis);
	this.m_mainLayout = genesis.newControl(oFF.UiType.FLEX_LAYOUT);
	this.m_mainLayout.setName("gsMainLayout");
	this.m_mainLayout.useMaxSpace();
	this.m_mainLayout.setDirection(oFF.UiFlexDirection.COLUMN);
	this.m_mainLayout.setWrap(oFF.UiFlexWrap.NO_WRAP);
	this.createHeaderToolbar(this.m_mainLayout);
	var viewLayout = this.m_mainLayout.addNewItemOfType(oFF.UiType.FLEX_LAYOUT);
	viewLayout.setName("gsViewLayout");
	viewLayout.useMaxSpace();
	viewLayout.setDirection(oFF.UiFlexDirection.ROW);
	viewLayout.setAlignItems(oFF.UiFlexAlignItems.CENTER);
	viewLayout.setJustifyContent(oFF.UiFlexJustifyContent.CENTER);
	viewLayout.setWrap(oFF.UiFlexWrap.NO_WRAP);
	this.m_codeEditor = viewLayout.addNewItemOfType(oFF.UiType.CODE_EDITOR);
	this.m_codeEditor.useMaxHeight();
	this.m_codeEditor.setWidth(oFF.UiCssLength.create("100%"));
	this.m_codeEditor.setCodeType("json");
	this.m_codeEditor.registerOnLiveChange(this);
	this.m_codeEditor.registerOnFileDrop(this);
	this.m_codeEditor.setDebounceTime(2000);
	this.m_codeEditor.focus();
	this.m_appContainerWrapper = viewLayout.addNewItemOfType(oFF.UiType.FLEX_LAYOUT);
	this.m_appContainerWrapper.useMaxSpace();
	this.m_appContainerWrapper.setDirection(oFF.UiFlexDirection.ROW);
	this.m_appContainerWrapper.setVisible(false);
	var codeEditorQuasarSpacer = this.m_appContainerWrapper.addNewItemOfType(oFF.UiType.SPACER);
	codeEditorQuasarSpacer.useMaxHeight();
	codeEditorQuasarSpacer.setWidth(oFF.UiCssLength.create("3px"));
	codeEditorQuasarSpacer.setBackgroundColor(oFF.UiColor.create("#A8AAAA"));
	this.m_appContainer = this.m_appContainerWrapper.addNewItemOfType(oFF.UiType.SCROLL_CONTAINER);
	this.m_appContainer.useMaxHeight();
	this.m_appContainer.setWidth(oFF.UiCssLength.create("100%"));
	this.createNotRunningContent(this.m_appContainer);
	genesis.setRoot(this.m_mainLayout);
	this.addMenuBarButton("gsFileToolbarBtn", null, "File", null, this);
	this.addMenuBarButton("gsToolsToolbarBtn", null, "Tools", null, this).setEnabled(false);
	this.addMenuBarButton("gsToolbarHelpBtn", null, "Help", "hint", this);
	this.updateEditorStatus();
};
oFF.GsGalaxyStudio.prototype.createHeaderToolbar = function(mainLayout)
{
	var headerToolbar = mainLayout.addNewItemOfType(oFF.UiType.TOOLBAR);
	headerToolbar.setName("headerToolbar");
	headerToolbar.setWidth(oFF.UiCssLength.create("100%"));
	headerToolbar.setHeight(oFF.UiCssLength.create("40px"));
	headerToolbar.setPadding(oFF.UiCssBoxEdges.create("0px"));
	var headerToolbarLayout = headerToolbar.addNewItemOfType(oFF.UiType.FLEX_LAYOUT);
	headerToolbarLayout.setName("headerToolbarLayout");
	headerToolbarLayout.useMaxSpace();
	headerToolbarLayout.setAlignItems(oFF.UiFlexAlignItems.CENTER);
	headerToolbarLayout.setBackgroundColor(oFF.UiColor.WHITE);
	this.m_runActionBarBtn = headerToolbarLayout.addNewItemOfType(oFF.UiType.TOGGLE_BUTTON);
	this.m_runActionBarBtn.setName("runActionBarBtn");
	this.m_runActionBarBtn.setIcon("media-play");
	this.m_runActionBarBtn.registerOnPress(this);
	var playStopSpacer = headerToolbarLayout.addNewItemOfType(oFF.UiType.SPACER);
	playStopSpacer.setWidth(oFF.UiCssLength.create(oFF.GsGalaxyStudio.ACTION_BAR_ITEM_SPACING));
	this.m_stopActionBarBtn = headerToolbarLayout.addNewItemOfType(oFF.UiType.BUTTON);
	this.m_stopActionBarBtn.setName("stopActionBarBtn");
	this.m_stopActionBarBtn.setIcon("stop");
	this.m_stopActionBarBtn.registerOnPress(this);
	var viewSection1 = headerToolbarLayout.addNewItemOfType(oFF.UiType.SPACER);
	viewSection1.setWidth(oFF.UiCssLength.create(oFF.GsGalaxyStudio.ACTION_BAR_ITEM_SPACING));
	var viewSectionSeprarator = headerToolbarLayout.addNewItemOfType(oFF.UiType.SPACER);
	viewSectionSeprarator.setWidth(oFF.UiCssLength.create("1px"));
	viewSectionSeprarator.setHeight(oFF.UiCssLength.create("60%"));
	viewSectionSeprarator.setBackgroundColor(oFF.UiColor.create("#A8AAAA"));
	var viewSection2 = headerToolbarLayout.addNewItemOfType(oFF.UiType.SPACER);
	viewSection2.setWidth(oFF.UiCssLength.create(oFF.GsGalaxyStudio.ACTION_BAR_ITEM_SPACING));
	this.m_splitActionBarBtn = headerToolbarLayout.addNewItemOfType(oFF.UiType.TOGGLE_BUTTON);
	this.m_splitActionBarBtn.setName("splitActionBarTglBtn");
	this.m_splitActionBarBtn.setIcon("screen-split-two");
	this.m_splitActionBarBtn.registerOnPress(this);
};
oFF.GsGalaxyStudio.prototype.createNotRunningContent = function(appContainer)
{
	var wrapperLayout = appContainer.setNewContent(oFF.UiType.FLEX_LAYOUT);
	wrapperLayout.useMaxSpace();
	wrapperLayout.setAlignItems(oFF.UiFlexAlignItems.CENTER);
	wrapperLayout.setJustifyContent(oFF.UiFlexJustifyContent.CENTER);
	var notRunningLbl = wrapperLayout.addNewItemOfType(oFF.UiType.LABEL);
	notRunningLbl.setText("Not running...");
	notRunningLbl.setFontSize(oFF.UiCssLength.create("18px"));
	notRunningLbl.setMargin(oFF.UiCssBoxEdges.create("20px"));
};
oFF.GsGalaxyStudio.prototype.openFileByPath = function(filePath)
{
	if (oFF.notNull(filePath))
	{
		var session = this.getSession();
		var file = oFF.XFile.createExt(session, filePath, oFF.PathFormat.AUTO_DETECT, oFF.VarResolveMode.DOLLAR);
		if (oFF.isNull(file) || file.isExisting() === false)
		{
			this.log2("File does not exist: ", filePath);
			return;
		}
		this.setFile(file);
	}
};
oFF.GsGalaxyStudio.prototype.initSettings = function()
{
	if (this.getProcess() !== null)
	{
		var recentItemsStr = this.getProcess().getUserManager().getUserSettings().getStringByKeyExt(oFF.GsGalaxyStudio.GALAXY_RECENT_FILES_KEY, "");
		if (oFF.XStringUtils.isNotNullAndNotEmpty(recentItemsStr))
		{
			this.m_recentFiles = oFF.XStringTokenizer.splitString(recentItemsStr, oFF.GsGalaxyStudio.RECENT_FILES_SEPARATOR);
		}
		else
		{
			this.m_recentFiles = oFF.XListOfString.create();
		}
	}
};
oFF.GsGalaxyStudio.prototype.updateEditorStatus = function()
{
	if (oFF.notNull(this.m_file))
	{
		this.loadFileContent(this.m_file);
		this.setTitle(this.m_file.getName());
	}
	else
	{
		this.setTitle("untitled");
	}
};
oFF.GsGalaxyStudio.prototype.setFile = function(file)
{
	this.m_file = file;
	this.loadFileContent(file);
};
oFF.GsGalaxyStudio.prototype.loadFileContent = function(file)
{
	if (oFF.notNull(file) && file.isExisting() && oFF.notNull(this.m_codeEditor))
	{
		file.processLoad(oFF.SyncType.NON_BLOCKING, this, null, oFF.CompressionType.NONE);
	}
	return null;
};
oFF.GsGalaxyStudio.prototype.showAppContainer = function(show)
{
	if (oFF.notNull(this.m_appContainerWrapper))
	{
		this.m_appContainerWrapper.setVisible(show);
		this.m_splitActionBarBtn.setPressed(show);
	}
};
oFF.GsGalaxyStudio.prototype.addRecentFileToUserSettings = function(file)
{
	if (oFF.notNull(file))
	{
		var filePathStr = file.getVfsUri().getUrl();
		var recentItemsStr = this.getProcess().getUserManager().getUserSettings().getStringByKeyExt(oFF.GsGalaxyStudio.GALAXY_RECENT_FILES_KEY, "");
		if (!oFF.XStringUtils.containsString(recentItemsStr, filePathStr, true))
		{
			if (oFF.XStringUtils.isNotNullAndNotEmpty(recentItemsStr))
			{
				recentItemsStr = oFF.XStringUtils.concatenate3(recentItemsStr, oFF.GsGalaxyStudio.RECENT_FILES_SEPARATOR, filePathStr);
			}
			else
			{
				recentItemsStr = filePathStr;
			}
			this.getProcess().getUserManager().getUserSettings().putString(oFF.GsGalaxyStudio.GALAXY_RECENT_FILES_KEY, recentItemsStr);
			if (oFF.notNull(this.m_recentFiles))
			{
				this.m_recentFiles.add(filePathStr);
			}
		}
	}
};
oFF.GsGalaxyStudio.prototype.executeApp = function(docStr)
{
	if (oFF.isNull(this.m_quasarEngine))
	{
		this.m_quasarEngine = oFF.QuasarEngine.create(this.getApplication());
	}
	if (oFF.isNull(this.m_quasarEngineGenesis))
	{
		this.m_quasarEngineGenesis = oFF.UiGenesis.create(this.m_appContainer, oFF.UiItemPosition.CONTENT, oFF.UiOperation.SET, 0, 0);
	}
	if (oFF.XStringUtils.isNotNullAndNotEmpty(docStr))
	{
		var parser = oFF.JsonParserFactory.newInstance();
		var jsonContent = parser.parse(docStr);
		if (oFF.notNull(jsonContent))
		{
			if (parser.hasErrors())
			{
				this.m_genesis.showErrorToast("Document is not a quasar document!");
				this.m_runActionBarBtn.setPressed(false);
			}
			else
			{
				oFF.XObjectExt.release(parser);
				if (jsonContent.isStructure())
				{
					this.showAppContainer(true);
					this.m_runActionBarBtn.setPressed(true);
					this.m_quasarEngine.reset();
					this.m_quasarEngine.setDocument(jsonContent);
					this.m_quasarEngine.renderUi(this.m_quasarEngineGenesis);
				}
			}
		}
		else
		{
			this.m_genesis.showErrorToast("Document is not a json!");
			this.m_runActionBarBtn.setPressed(false);
		}
	}
	else
	{
		this.m_genesis.showErrorToast("Document is empty!");
		this.m_runActionBarBtn.setPressed(false);
	}
};
oFF.GsGalaxyStudio.prototype.stopExecution = function()
{
	if (oFF.notNull(this.m_quasarEngine))
	{
		this.m_quasarEngine = oFF.XObjectExt.release(this.m_quasarEngine);
	}
	if (oFF.notNull(this.m_quasarEngineGenesis))
	{
		this.m_quasarEngineGenesis = oFF.XObjectExt.release(this.m_quasarEngineGenesis);
	}
	this.createNotRunningContent(this.m_appContainer);
	this.m_runActionBarBtn.setPressed(false);
};
oFF.GsGalaxyStudio.prototype.isRunning = function()
{
	return this.m_runActionBarBtn.isPressed() && oFF.notNull(this.m_quasarEngine) && oFF.notNull(this.m_appContainerWrapper);
};
oFF.GsGalaxyStudio.prototype.createFileToolbarMenu = function(fileBtn)
{
	var fileToolbarMenu = this.m_genesis.newControl(oFF.UiType.MENU);
	fileToolbarMenu.setName("gsFileToolbarMenu");
	fileToolbarMenu.addNewItem().setName("gsToolbarMenuNew").setText("New").setIcon("document").registerOnPress(this);
	fileToolbarMenu.addNewItem().setName("gsToolbarMenuOpen").setText("Open").setIcon("open-folder").registerOnPress(this).setEnabled(false);
	var recentFilesMenuItem = fileToolbarMenu.addNewItem().setName("gsToolbarMenuRecent").setText("Recent").setIcon("history").registerOnPress(this);
	fileToolbarMenu.addNewItem().setName("gsToolbarMenuSave").setText("Save").setIcon("save").registerOnPress(this).setSectionStart(true).setEnabled(false);
	fileToolbarMenu.addNewItem().setName("gsToolbarMenuSaveAs").setText("Save as...").setIcon("save").registerOnPress(this).setEnabled(false);
	this.createRecentFilesMenu(recentFilesMenuItem);
	fileToolbarMenu.openAt(fileBtn);
};
oFF.GsGalaxyStudio.prototype.createToolsToolbarMenu = function(toolsBtn)
{
	var toolsToolbarMenu = this.m_genesis.newControl(oFF.UiType.MENU);
	toolsToolbarMenu.setName("gsToolsToolbarMenu");
	toolsToolbarMenu.addNewItem().setName("gsToolbarMenuDiscardChanges").setText("Discard changes").setIcon("eraser").registerOnPress(this);
	toolsToolbarMenu.openAt(toolsBtn);
};
oFF.GsGalaxyStudio.prototype.createRecentFilesMenu = function(recentFilesMenu)
{
	if (oFF.notNull(recentFilesMenu))
	{
		if (this.m_recentFiles.size() > 0)
		{
			var recentFilesIterator = this.m_recentFiles.getIterator();
			while (recentFilesIterator.hasNext())
			{
				var filePathStr = recentFilesIterator.next();
				recentFilesMenu.addNewItem().setTag("gsToolbarSubMenuRecentFiles").setText(filePathStr).setIcon("timesheet").registerOnPress(this);
			}
		}
		else
		{
			recentFilesMenu.addNewItem().setTag("gsToolbarSubMenuRecentFiles").setText("None").setIcon(null).setEnabled(false);
		}
		recentFilesMenu.addNewItem().setName("gsToolbarSubMenuRecentFilesClear").setText("Clear").setIcon("delete").setSectionStart(true).registerOnPress(this);
	}
};
oFF.GsGalaxyStudio.prototype.newProject = function()
{
	if (oFF.notNull(this.m_codeEditor))
	{
		this.m_codeEditor.setText("{\r\n \"DocType\": \"FireflyApp\",\r\n \"Content\": {\r\n     \"CType\": \"Label\",\r\n     \"Text\": \"Hello world!\"\r\n },\r\n  \"DataProviders\": [],\r\n  \"Bindings\": []\r\n}");
	}
};
oFF.GsGalaxyStudio.prototype.openRecentFile = function(filePath)
{
	if (oFF.XStringUtils.isNotNullAndNotEmpty(filePath))
	{
		this.openFileByPath(filePath);
	}
};
oFF.GsGalaxyStudio.prototype.clearRecentFiles = function()
{
	this.getProcess().getUserManager().getUserSettings().removeKey(oFF.GsGalaxyStudio.GALAXY_RECENT_FILES_KEY);
	this.m_recentFiles.clear();
};
oFF.GsGalaxyStudio.prototype.openHelpAlert = function()
{
	var helpAlert = this.m_genesis.newControl(oFF.UiType.ALERT);
	helpAlert.setName("gsHelpAlert");
	helpAlert.setTitle("Help");
	helpAlert.setText("Galaxy Studio v0.1 Alpha! \n Proudly brought to you by Firefly!");
	helpAlert.open();
};
oFF.GsGalaxyStudio.prototype.onFileLoaded = function(extResult, file, fileContent, customIdentifier)
{
	if (extResult.isValid() && oFF.notNull(this.m_codeEditor))
	{
		if (oFF.notNull(fileContent))
		{
			this.addRecentFileToUserSettings(file);
			var stringContent = fileContent.getString();
			this.m_codeEditor.setText(stringContent);
			this.setTitle(file.getName());
		}
	}
};
oFF.GsGalaxyStudio.prototype.onPress = function(event)
{
	oFF.DfUiProgram.prototype.onPress.call( this , event);
	var control = event.getControl();
	var controlParent = control.getParent();
	if (event.getControl() === this.m_runActionBarBtn)
	{
		if (this.m_runActionBarBtn.isPressed())
		{
			this.executeApp(this.m_codeEditor.getText());
		}
		else
		{
			this.stopExecution();
		}
	}
	else if (event.getControl() === this.m_stopActionBarBtn)
	{
		this.stopExecution();
	}
	else if (event.getControl() === this.m_splitActionBarBtn)
	{
		if (this.m_splitActionBarBtn.isPressed())
		{
			this.showAppContainer(true);
		}
		else
		{
			this.showAppContainer(false);
		}
	}
	if (oFF.notNull(controlParent) && controlParent.getUiType() === oFF.UiType.TOOLBAR)
	{
		switch (control.getName())
		{
			case "gsFileToolbarBtn":
				this.createFileToolbarMenu(control);
				break;

			case "gsToolsToolbarBtn":
				this.createToolsToolbarMenu(control);
				break;

			case "gsToolbarHelpBtn":
				this.openHelpAlert();
				break;

			default:
		}
	}
	if (oFF.notNull(controlParent) && controlParent.getUiType() === oFF.UiType.MENU && oFF.XString.isEqual(controlParent.getName(), "gsFileToolbarMenu"))
	{
		switch (control.getName())
		{
			case "gsToolbarMenuNew":
				this.newProject();
				break;

			case "gsToolbarMenuSave":
				this.m_genesis.showInfoToast("Save pressed");
				break;

			default:
		}
	}
	if (oFF.notNull(controlParent) && controlParent.getUiType() === oFF.UiType.MENU && oFF.XString.isEqual(controlParent.getName(), "gsToolsToolbarMenu"))
	{
		switch (control.getName())
		{
			case "gsToolbarMenuDiscardChanges":
				this.m_genesis.showInfoToast("Discard changes pressed");
				break;

			default:
		}
	}
	if (oFF.notNull(controlParent) && controlParent.getUiType() === oFF.UiType.MENU_ITEM && oFF.XString.isEqual(controlParent.getName(), "gsToolbarMenuRecent"))
	{
		if (oFF.XString.isEqual(control.getName(), "gsToolbarSubMenuRecentFilesClear"))
		{
			this.clearRecentFiles();
		}
		else if (oFF.XString.isEqual(control.getTag(), "gsToolbarSubMenuRecentFiles"))
		{
			this.openRecentFile(control.getText());
		}
	}
};
oFF.GsGalaxyStudio.prototype.onFileDrop = function(event)
{
	var fileContent = event.getParameters().getStringByKeyExt(oFF.UiControlEvent.PARAM_FILE_CONTENT, null);
	if (oFF.XStringUtils.isNotNullAndNotEmpty(fileContent))
	{
		this.m_codeEditor.setText(fileContent);
	}
};
oFF.GsGalaxyStudio.prototype.onLiveChange = function(event)
{
	var documentStr = event.getParameters().getStringByKeyExt(oFF.UiControlEvent.PARAM_VALUE, null);
	if (this.isRunning())
	{
		this.executeApp(documentStr);
	}
};

oFF.AuGalaxyDataStudio = function() {};
oFF.AuGalaxyDataStudio.prototype = new oFF.DfUiProgram();
oFF.AuGalaxyDataStudio.prototype._ff_c = "AuGalaxyDataStudio";

oFF.AuGalaxyDataStudio.DEFAULT_PROGRAM_NAME = "GalaxyDataStudio";
oFF.AuGalaxyDataStudio.MAIN_TAB_BAR_NAME = "gdsMainTabBar";
oFF.AuGalaxyDataStudio.MENU_BAR_FILE_BTN = "gdsFileMenuBarBtn";
oFF.AuGalaxyDataStudio.MENU_BAR_EDIT_BTN = "gdsEditMenuBarBtn";
oFF.AuGalaxyDataStudio.MENU_BAR_FILE_MENU = "gdsFileMenuBarMenu";
oFF.AuGalaxyDataStudio.MENU_BAR_FILE_MENU_NEW = "gdsMenuBarMenuNew";
oFF.AuGalaxyDataStudio.MENU_BAR_FILE_MENU_OPEN = "gdsMenuBarMenuOpen";
oFF.AuGalaxyDataStudio.MENU_BAR_FILE_MENU_CLOSE = "gdsMenuBarMenuClose";
oFF.AuGalaxyDataStudio.MENU_BAR_FILE_MENU_CLOSE_ALL = "gdsMenuBarMenuCloseAll";
oFF.AuGalaxyDataStudio.MENU_BAR_FILE_MENU_SAVE = "gdsMenuBarMenuSave";
oFF.AuGalaxyDataStudio.MENU_BAR_FILE_MENU_SAVE_AS = "gdsMenuBarMenuSaveAs";
oFF.AuGalaxyDataStudio.MENU_BAR_FILE_MENU_SAVE_ALL = "gdsMenuBarMenuSaveAll";
oFF.AuGalaxyDataStudio.MENU_BAR_FILE_MENU_EXIT = "gdsMenuBarMenuExit";
oFF.AuGalaxyDataStudio.MENU_BAR_EDIT_MENU = "gdsEditMenuBarMenu";
oFF.AuGalaxyDataStudio.MENU_BAR_EDIT_MENU_UNDO = "gdsMenuBarEditMenuUndo";
oFF.AuGalaxyDataStudio.MENU_BAR_EDIT_MENU_REDO = "gdsMenuBarEditMenuRedo";
oFF.AuGalaxyDataStudio.MENU_BAR_EDIT_MENU_CUT = "gdsMenuBarEditMenuCut";
oFF.AuGalaxyDataStudio.MENU_BAR_EDIT_MENU_COPY = "gdsMenuBarEditMenuCopy";
oFF.AuGalaxyDataStudio.MENU_BAR_EDIT_MENU_PASTE = "gdsMenuBarEditMenuPaste";
oFF.AuGalaxyDataStudio.MENU_BAR_EDIT_MENU_CLEAR_RECENTS = "gdsMenuBarEditMenuClearRecents";
oFF.AuGalaxyDataStudio.MENU_BAR_EDIT_MENU_PREFERENCES = "gdsMenuBarEditMenuPreferences";
oFF.AuGalaxyDataStudio.QUICK_ACTION_TOOLBAR = "gdsQuickActionToolbar";
oFF.AuGalaxyDataStudio.QUICK_ACTION_TOOLBAR_NEW = "gdsQuickActionToolbarNew";
oFF.AuGalaxyDataStudio.QUICK_ACTION_TOOLBAR_OPEN = "gdsQuickActionToolbarOpen";
oFF.AuGalaxyDataStudio.QUICK_ACTION_TOOLBAR_SAVE_AS = "gdsQuickActionToolbarSaveAs";
oFF.AuGalaxyDataStudio.QUICK_ACTION_TOOLBAR_CLOSE_DOCUMENT = "gdsQuickActionToolbarCloseDocument";
oFF.AuGalaxyDataStudio.QUICK_ACTION_TOOLBAR_UNDO = "gdsQuickActionToolbarUndo";
oFF.AuGalaxyDataStudio.QUICK_ACTION_TOOLBAR_REDO = "gdsQuickActionToolbarRedo";
oFF.AuGalaxyDataStudio.PARAM_SYSTEM = "system";
oFF.AuGalaxyDataStudio.PARAM_DATASOURCE = "datasource";
oFF.AuGalaxyDataStudio.createRunner = function()
{
	var runner = oFF.KernelBoot.createByName(oFF.AuGalaxyDataStudio.DEFAULT_PROGRAM_NAME);
	return runner;
};
oFF.AuGalaxyDataStudio.prototype.m_mainLayout = null;
oFF.AuGalaxyDataStudio.prototype.m_toolbar = null;
oFF.AuGalaxyDataStudio.prototype.m_contentLayout = null;
oFF.AuGalaxyDataStudio.prototype.m_tabBar = null;
oFF.AuGalaxyDataStudio.prototype.m_statusLabel = null;
oFF.AuGalaxyDataStudio.prototype.m_networkActivityIndicator = null;
oFF.AuGalaxyDataStudio.prototype.m_activeDocument = null;
oFF.AuGalaxyDataStudio.prototype.m_openDocuments = null;
oFF.AuGalaxyDataStudio.prototype.m_toolbarNewBtn = null;
oFF.AuGalaxyDataStudio.prototype.m_toolbarOpenBtn = null;
oFF.AuGalaxyDataStudio.prototype.m_toolbarSaveAsBtn = null;
oFF.AuGalaxyDataStudio.prototype.m_toolbarCloseDocBtn = null;
oFF.AuGalaxyDataStudio.prototype.m_toolbarUndoBtn = null;
oFF.AuGalaxyDataStudio.prototype.m_toolbarRedoBtn = null;
oFF.AuGalaxyDataStudio.prototype.newProgram = function()
{
	var prg = new oFF.AuGalaxyDataStudio();
	prg.setup();
	return prg;
};
oFF.AuGalaxyDataStudio.prototype.doSetupProgramMetadata = function(metadata)
{
	oFF.DfUiProgram.prototype.doSetupProgramMetadata.call( this , metadata);
	metadata.addOption(oFF.DfProgram.PARAM_FILE, "Specify a gds file", "Relative URI", oFF.XValueType.STRING);
	metadata.addParameter(oFF.AuGalaxyDataStudio.PARAM_SYSTEM, "The system to connect to.");
	metadata.addParameter(oFF.AuGalaxyDataStudio.PARAM_DATASOURCE, "The datasource to be used.");
};
oFF.AuGalaxyDataStudio.prototype.evalArguments = function()
{
	oFF.DfUiProgram.prototype.evalArguments.call( this );
};
oFF.AuGalaxyDataStudio.prototype.initializeProgram = function()
{
	oFF.DfUiProgram.prototype.initializeProgram.call( this );
	this.setupInternal();
};
oFF.AuGalaxyDataStudio.prototype.releaseObject = function()
{
	this.m_toolbarNewBtn = oFF.XObjectExt.release(this.m_toolbarNewBtn);
	this.m_toolbarOpenBtn = oFF.XObjectExt.release(this.m_toolbarOpenBtn);
	this.m_toolbarSaveAsBtn = oFF.XObjectExt.release(this.m_toolbarSaveAsBtn);
	this.m_toolbarCloseDocBtn = oFF.XObjectExt.release(this.m_toolbarCloseDocBtn);
	this.m_toolbarUndoBtn = oFF.XObjectExt.release(this.m_toolbarUndoBtn);
	this.m_toolbarRedoBtn = oFF.XObjectExt.release(this.m_toolbarRedoBtn);
	this.m_networkActivityIndicator = oFF.XObjectExt.release(this.m_networkActivityIndicator);
	this.m_statusLabel = oFF.XObjectExt.release(this.m_statusLabel);
	this.m_tabBar = oFF.XObjectExt.release(this.m_tabBar);
	this.m_contentLayout = oFF.XObjectExt.release(this.m_contentLayout);
	this.m_toolbar = oFF.XObjectExt.release(this.m_toolbar);
	this.m_mainLayout = oFF.XObjectExt.release(this.m_mainLayout);
	this.m_openDocuments = oFF.XObjectExt.release(this.m_openDocuments);
	this.m_activeDocument = null;
	oFF.DfUiProgram.prototype.releaseObject.call( this );
};
oFF.AuGalaxyDataStudio.prototype.getLogSeverity = function()
{
	return oFF.DfUiProgram.prototype.getLogSeverity.call( this );
};
oFF.AuGalaxyDataStudio.prototype.isShowMenuBar = function()
{
	return true;
};
oFF.AuGalaxyDataStudio.prototype.getDefaultContainerSize = function()
{
	return oFF.UiSize.createByCss("70vw", "70vh");
};
oFF.AuGalaxyDataStudio.prototype.isOpenContainerMaximized = function()
{
	return true;
};
oFF.AuGalaxyDataStudio.prototype.getMenuBarDisplayName = function()
{
	return null;
};
oFF.AuGalaxyDataStudio.prototype.canExit = function()
{
	var canExit = true;
	if (this.hasUnsavedChanges())
	{
		this.presentExitConfirmPopup("Unsaved changes!", "Some documents have unsaved changes! Are you sure that you want to exit?");
		canExit = false;
	}
	return canExit;
};
oFF.AuGalaxyDataStudio.prototype.setupInternal = function()
{
	this.m_openDocuments = oFF.XHashMapByString.create();
};
oFF.AuGalaxyDataStudio.prototype.buildUi = function(genesis)
{
	oFF.DfUiProgram.prototype.buildUi.call( this , genesis);
	this.m_mainLayout = genesis.newControl(oFF.UiType.FLEX_LAYOUT);
	this.m_mainLayout.setDirection(oFF.UiFlexDirection.COLUMN);
	this.m_mainLayout.useMaxSpace();
	this.m_mainLayout.setBackgroundColor(oFF.UiColor.WHITE);
	this.m_toolbar = this.m_mainLayout.addNewItemOfType(oFF.UiType.TOOLBAR);
	this.m_toolbar.setName(oFF.AuGalaxyDataStudio.QUICK_ACTION_TOOLBAR);
	this.m_toolbar.setWidth(oFF.UiCssLength.create("100%"));
	this.m_toolbar.setFlex("0 0 40px");
	this.m_contentLayout = this.m_mainLayout.addNewItemOfType(oFF.UiType.FLEX_LAYOUT);
	this.m_contentLayout.setDirection(oFF.UiFlexDirection.COLUMN);
	this.m_contentLayout.useMaxSpace();
	this.m_contentLayout.registerOnFileDrop(this);
	this.m_tabBar = this.m_contentLayout.addNewItemOfType(oFF.UiType.TAB_BAR);
	this.m_tabBar.setName(oFF.AuGalaxyDataStudio.MAIN_TAB_BAR_NAME);
	this.m_tabBar.useMaxSpace();
	this.m_tabBar.setShowAddNewButton(true);
	this.m_tabBar.registerOnItemSelect(this);
	this.m_tabBar.registerOnItemClose(this);
	this.m_tabBar.registerOnButtonPress(this);
	var statusBarWrapper = this.m_mainLayout.addNewItemOfType(oFF.UiType.FLEX_LAYOUT);
	statusBarWrapper.setAlignItems(oFF.UiFlexAlignItems.CENTER);
	statusBarWrapper.setFlex("0 0 auto");
	statusBarWrapper.setBackgroundColor(oFF.UiColor.GREY.newBrighterColor(0.28));
	statusBarWrapper.setPadding(oFF.UiCssBoxEdges.create("5px"));
	this.m_statusLabel = statusBarWrapper.addNewItemOfType(oFF.UiType.LABEL);
	this.m_statusLabel.setFlex("auto");
	this.m_networkActivityIndicator = statusBarWrapper.addNewItemOfType(oFF.UiType.ACTIVITY_INDICATOR);
	this.m_networkActivityIndicator.setIconSize(oFF.UiCssLength.create("1rem"));
	this.m_networkActivityIndicator.setSrc(oFF.UiTheme.getCurrentTheme().getCustomActivityIndicatorIcon());
	this.m_networkActivityIndicator.setTooltip("Requesting backend data...");
	this.m_networkActivityIndicator.setMargin(oFF.UiCssBoxEdges.create("0 0 0 auto"));
	this.m_networkActivityIndicator.setFlex("0 0 auto");
	this.m_networkActivityIndicator.setVisible(false);
	genesis.setRoot(this.m_mainLayout);
	this.addMenuBarButton(oFF.AuGalaxyDataStudio.MENU_BAR_FILE_BTN, null, "File", null, this);
	this.addMenuBarButton(oFF.AuGalaxyDataStudio.MENU_BAR_EDIT_BTN, null, "Edit", null, this);
	this.prepareToolbarItems();
	this.presentInitialView();
};
oFF.AuGalaxyDataStudio.prototype.createFileByPath = function(filePathStr)
{
	var gdfFile = null;
	if (oFF.XStringUtils.isNotNullAndNotEmpty(filePathStr))
	{
		var session = this.getSession();
		gdfFile = oFF.XFile.createExt(session, filePathStr, oFF.PathFormat.AUTO_DETECT, oFF.VarResolveMode.DOLLAR);
		if (oFF.isNull(gdfFile))
		{
			this.log2("Error while creating the file: ", filePathStr);
		}
	}
	return gdfFile;
};
oFF.AuGalaxyDataStudio.prototype.getJsonObjFromLoadedFileContent = function(fileContent)
{
	var jsonObj = null;
	if (oFF.notNull(fileContent))
	{
		var jsonContent = fileContent.getJsonContent();
		if (oFF.notNull(jsonContent))
		{
			jsonObj = jsonContent.asStructure();
		}
		else
		{
			this.getGenesis().showErrorToast("Not a json document!");
		}
	}
	else
	{
		this.showCriticalError("Something went wrong! File content is empty!");
	}
	return jsonObj;
};
oFF.AuGalaxyDataStudio.prototype.newToolbarSeparator = function()
{
	var tmpSpacer = this.getGenesis().newControl(oFF.UiType.SPACER);
	tmpSpacer.setSize(oFF.UiSize.createByCss("1px", "50%"));
	tmpSpacer.setBackgroundColor(oFF.UiColor.GREY);
	return tmpSpacer;
};
oFF.AuGalaxyDataStudio.prototype.presentSaveAsPopup = function(filePath, consumer)
{
	if (oFF.notNull(this.m_activeDocument) && this.m_activeDocument.hasSaveData())
	{
		var lastSlash = oFF.XString.lastIndexOf(filePath, "/");
		var lastDot = oFF.XString.lastIndexOf(filePath, ".");
		lastDot = lastDot === -1 ? oFF.XString.size(filePath) : lastDot;
		var newInputPoptup = oFF.UiInputPopup.create(this.getGenesis(), "Save as...", "Please specify the file");
		newInputPoptup.setInputPlaceholder("File path");
		newInputPoptup.setInputValue(filePath);
		newInputPoptup.setOkButtonText("Save");
		newInputPoptup.setOkButtonIcon("save");
		newInputPoptup.setInputConsumer(consumer);
		newInputPoptup.open();
		newInputPoptup.selectText(lastSlash + 1, lastDot);
	}
};
oFF.AuGalaxyDataStudio.prototype.saveContentToGdfFile = function(outputFile, contentToSave)
{
	if (oFF.isNull(outputFile) || oFF.isNull(contentToSave))
	{
		this.getGenesis().showErrorToast("Error during file saving!");
		return false;
	}
	outputFile.processSave(oFF.SyncType.BLOCKING, null, null, contentToSave, oFF.CompressionType.NONE);
	if (outputFile.hasErrors())
	{
		this.getGenesis().showErrorToast(outputFile.getSummary());
		return false;
	}
	else
	{
		var msg = oFF.XStringUtils.concatenate3("File ", outputFile.getVfsUri().getFileName(), " saved successfully!");
		this.getGenesis().showSuccessToast(msg);
	}
	return true;
};
oFF.AuGalaxyDataStudio.prototype.updateSystemDatasourceArguments = function(system, datasource)
{
	this.getArgumentStructure().putString(oFF.AuGalaxyDataStudio.PARAM_SYSTEM, system);
	this.getArgumentStructure().putString(oFF.AuGalaxyDataStudio.PARAM_DATASOURCE, datasource);
	this.getArgumentStructure().remove(oFF.DfProgram.PARAM_FILE);
	this.getProcess().notifyProcessEvent(oFF.ProcessEventType.START_CFG_CHANGED);
};
oFF.AuGalaxyDataStudio.prototype.updateFileArgument = function(newFilePath)
{
	this.getArgumentStructure().remove(oFF.AuGalaxyDataStudio.PARAM_SYSTEM);
	this.getArgumentStructure().remove(oFF.AuGalaxyDataStudio.PARAM_DATASOURCE);
	this.updateFileParam(newFilePath);
};
oFF.AuGalaxyDataStudio.prototype.clearAllArguments = function()
{
	this.getArgumentStructure().remove(oFF.AuGalaxyDataStudio.PARAM_SYSTEM);
	this.getArgumentStructure().remove(oFF.AuGalaxyDataStudio.PARAM_DATASOURCE);
	this.getArgumentStructure().remove(oFF.DfProgram.PARAM_FILE);
	this.getProcess().notifyProcessEvent(oFF.ProcessEventType.START_CFG_CHANGED);
};
oFF.AuGalaxyDataStudio.prototype.getCriticalErrorLabelWithText = function(text)
{
	var errorLabel = this.getGenesis().newControl(oFF.UiType.LABEL);
	errorLabel.useMaxWidth();
	errorLabel.setPadding(oFF.UiCssBoxEdges.create("20px"));
	errorLabel.setTextAlign(oFF.UiTextAlign.CENTER);
	errorLabel.setFontColor(oFF.UiColor.RED);
	errorLabel.setText(text);
	return errorLabel;
};
oFF.AuGalaxyDataStudio.prototype.setNetworkActivityIndicatorVisible = function(visible)
{
	if (oFF.notNull(this.m_networkActivityIndicator))
	{
		this.m_networkActivityIndicator.setVisible(visible);
	}
};
oFF.AuGalaxyDataStudio.prototype.presentInitialView = function()
{
	var validArgsFound = this.processProgramArguments();
	if (!validArgsFound)
	{
		this.openEmptyQueryDesignerDocument();
	}
};
oFF.AuGalaxyDataStudio.prototype.processProgramArguments = function()
{
	var argStruct = this.getArgumentStructure();
	var filePathStr = argStruct.getStringByKey(oFF.DfProgram.PARAM_FILE);
	var system = argStruct.getStringByKeyExt(oFF.AuGalaxyDataStudio.PARAM_SYSTEM, null);
	var dataSource = argStruct.getStringByKeyExt(oFF.AuGalaxyDataStudio.PARAM_DATASOURCE, null);
	var gdfFile = this.createFileByPath(filePathStr);
	if (oFF.notNull(gdfFile))
	{
		this.setContentBusy(true);
		gdfFile.processLoad(oFF.SyncType.NON_BLOCKING, this, null, oFF.CompressionType.NONE);
		return true;
	}
	if (oFF.XStringUtils.isNotNullAndNotEmpty(system) && oFF.XStringUtils.isNotNullAndNotEmpty(dataSource))
	{
		this.openNewQueryDesignerDocument(null, system, dataSource);
		return true;
	}
	return false;
};
oFF.AuGalaxyDataStudio.prototype.showNoDocumentsOpen = function()
{
	this.clearDocumentsMenuButtons();
	this.clearDocumentToolbarItems();
	this.setTitle("Galaxy Data Studio");
	this.m_toolbarSaveAsBtn.setEnabled(false);
	this.m_toolbarCloseDocBtn.setEnabled(false);
	this.m_toolbarUndoBtn.setEnabled(false);
	this.m_toolbarRedoBtn.setEnabled(false);
	this.setStatusMessage("No document open!", oFF.UiMessageType.INFORMATION);
	if (oFF.notNull(this.m_tabBar) && !this.m_tabBar.hasItems())
	{
		this.m_contentLayout.removeItem(this.m_tabBar);
		var infoLabel = this.m_contentLayout.addNewItemOfType(oFF.UiType.LABEL);
		infoLabel.useMaxWidth();
		infoLabel.setPadding(oFF.UiCssBoxEdges.create("20px"));
		infoLabel.setFontSize(oFF.UiCssLength.create("1.5rem"));
		infoLabel.setTextAlign(oFF.UiTextAlign.CENTER);
		infoLabel.setText("Please open a document or create a new one!");
	}
};
oFF.AuGalaxyDataStudio.prototype.openEmptyQueryDesignerDocument = function()
{
	this.openNewQueryDesignerDocument(null, null, null);
};
oFF.AuGalaxyDataStudio.prototype.addNewDocumentTab = function(document)
{
	if (this.m_tabBar.getParent() === null)
	{
		this.m_contentLayout.clearItems();
		this.m_contentLayout.addItem(this.m_tabBar);
	}
	this.m_tabBar.addItem(document.getTabItem());
	this.m_openDocuments.put(document.getUuid(), document);
	this.m_tabBar.setSelectedItem(document.getTabItem());
	this.activeDocumentChanged(document);
	this.m_toolbarCloseDocBtn.setEnabled(true);
};
oFF.AuGalaxyDataStudio.prototype.openNewQueryDesignerDocument = function(file, system, dataSource)
{
	var queryDesignerPerspecticve = oFF.AuGdsQueryDesignerDocument.create(this, file, system, dataSource, this);
	if (oFF.notNull(queryDesignerPerspecticve))
	{
		this.addNewDocumentTab(queryDesignerPerspecticve);
	}
	return queryDesignerPerspecticve;
};
oFF.AuGalaxyDataStudio.prototype.closeDocument = function(document)
{
	if (oFF.notNull(document))
	{
		var closedIndex = this.m_tabBar.getIndexOfItem(document.getTabItem());
		this.m_tabBar.removeItem(document.getTabItem());
		var closedDocument = this.m_openDocuments.remove(document.getUuid());
		var newActiveIndex = closedIndex === 0 ? closedIndex : closedIndex - 1;
		if (this.m_openDocuments.hasElements())
		{
			var newSelectedDocument = this.m_openDocuments.getByKey(this.m_tabBar.getItem(newActiveIndex).getName());
			this.m_tabBar.setSelectedItem(newSelectedDocument.getTabItem());
			this.activeDocumentChanged(newSelectedDocument);
		}
		else
		{
			this.showNoDocumentsOpen();
		}
		oFF.XObjectExt.release(closedDocument);
	}
};
oFF.AuGalaxyDataStudio.prototype.closeDocumentSafe = function(document)
{
	if (oFF.notNull(document))
	{
		if (this.m_activeDocument.isDirty())
		{
			this.presentDocumentUnsavedChangesPopup(document);
		}
		else
		{
			this.closeDocument(document);
		}
	}
};
oFF.AuGalaxyDataStudio.prototype.closeActiveDocument = function()
{
	if (oFF.notNull(this.m_activeDocument))
	{
		this.closeDocument(this.m_activeDocument);
	}
};
oFF.AuGalaxyDataStudio.prototype.closeActiveDocumentSafe = function()
{
	if (oFF.notNull(this.m_activeDocument))
	{
		if (this.m_activeDocument.isDirty())
		{
			this.presentDocumentUnsavedChangesPopup(this.m_activeDocument);
		}
		else
		{
			this.closeActiveDocument();
		}
	}
};
oFF.AuGalaxyDataStudio.prototype.closeAllDocuments = function()
{
	var openDocumentsKeys = this.m_openDocuments.getKeysAsIteratorOfString();
	while (openDocumentsKeys.hasNext())
	{
		var tmpDocKey = openDocumentsKeys.next();
		var tmpDocument = this.m_openDocuments.getByKey(tmpDocKey);
		this.closeDocument(tmpDocument);
	}
};
oFF.AuGalaxyDataStudio.prototype.clearDocumentsMenuButtons = function()
{
	while (this.getMenuBar().getItemCount() > 1)
	{
		var lastIndex = this.getMenuBar().getItemCount() - 1;
		var lastBtn = this.getMenuBar().getItem(lastIndex);
		if (oFF.notNull(lastBtn) && oFF.XString.isEqual(lastBtn.getName(), oFF.AuGalaxyDataStudio.MENU_BAR_EDIT_BTN))
		{
			break;
		}
		this.getMenuBar().removeItem(lastBtn);
	}
};
oFF.AuGalaxyDataStudio.prototype.clearDocumentToolbarItems = function()
{
	if (oFF.notNull(this.m_toolbar))
	{
		while (this.m_toolbar.getItemCount() > 7)
		{
			var lastIndex = this.m_toolbar.getItemCount() - 1;
			var lastControl = this.m_toolbar.getItem(lastIndex);
			if (oFF.notNull(lastControl) && oFF.XString.isEqual(lastControl.getName(), oFF.AuGalaxyDataStudio.QUICK_ACTION_TOOLBAR_REDO))
			{
				break;
			}
			this.m_toolbar.removeItem(lastControl);
		}
	}
};
oFF.AuGalaxyDataStudio.prototype.activeDocumentChanged = function(document)
{
	if (oFF.notNull(document) && this.m_activeDocument !== document)
	{
		this.setTitle(document.getTitle());
		this.clearDocumentsMenuButtons();
		var menuButtonIterator = document.getMenuButtons().getIterator();
		while (menuButtonIterator.hasNext())
		{
			var tmpMenuBtn = menuButtonIterator.next();
			this.getMenuBar().addItem(tmpMenuBtn);
		}
		this.clearDocumentToolbarItems();
		if (document.getToolbarItems().size() > 0)
		{
			this.addToolbarSectionSeparator();
		}
		var toolbarItemsIterator = document.getToolbarItems().getIterator();
		while (toolbarItemsIterator.hasNext())
		{
			var tmpControl = toolbarItemsIterator.next();
			this.m_toolbar.addItem(tmpControl);
		}
		this.m_toolbarUndoBtn.setEnabled(document.hasUndoSteps());
		this.m_toolbarRedoBtn.setEnabled(document.hasRedoSteps());
		this.m_toolbarSaveAsBtn.setEnabled(document.hasSaveData());
		this.setStatusMessage(document.getStatusMessage(), document.getStatusMessageType());
		document.notifyBecameVisible();
		if (oFF.notNull(this.m_activeDocument))
		{
			this.m_activeDocument.notifyEnteredBackground();
		}
		this.m_activeDocument = document;
	}
};
oFF.AuGalaxyDataStudio.prototype.presentDocumentUnsavedChangesPopup = function(document)
{
	var unsavedPopup = oFF.UiConfirmPopup.create(this.getGenesis(), "Unsaved changes!", "The document which you are trying to close has unsaved changes. Are you sure you want to close it?");
	unsavedPopup.setConfirmButtonText("Close without saving");
	unsavedPopup.setConfirmButtonIcon("delete");
	unsavedPopup.setConfirmButtonType(oFF.UiButtonType.DESTRUCTIVE);
	unsavedPopup.setConfirmProcedure( function(){
		this.closeDocument(document);
	}.bind(this));
	unsavedPopup.open();
};
oFF.AuGalaxyDataStudio.prototype.setContentBusy = function(busy)
{
	this.m_contentLayout.setBusy(busy);
};
oFF.AuGalaxyDataStudio.prototype.showCriticalError = function(text)
{
	if (oFF.notNull(this.m_tabBar) && !this.m_tabBar.hasItems())
	{
		this.m_contentLayout.removeItem(this.m_tabBar);
		this.m_contentLayout.addItem(this.getCriticalErrorLabelWithText(text));
	}
	else
	{
		this.getGenesis().showErrorToast(text);
	}
};
oFF.AuGalaxyDataStudio.prototype.setStatusMessage = function(message, messageType)
{
	if (oFF.XStringUtils.isNullOrEmpty(message))
	{
		this.resetStatusMessage();
	}
	else if (messageType === oFF.UiMessageType.ERROR)
	{
		this.showErrorStatusMessage(message);
	}
	else if (messageType === oFF.UiMessageType.WARNING)
	{
		this.showWarningStatusMessage(message);
	}
	else if (messageType === oFF.UiMessageType.SUCCESS)
	{
		this.showSuccessStatusMessage(message);
	}
	else
	{
		this.showInfoStatusMessage(message);
	}
};
oFF.AuGalaxyDataStudio.prototype.updateStatusLabel = function(message, color)
{
	this.m_statusLabel.setText(message);
	this.m_statusLabel.setFontColor(color);
};
oFF.AuGalaxyDataStudio.prototype.resetStatusMessage = function()
{
	this.updateStatusLabel(null, null);
};
oFF.AuGalaxyDataStudio.prototype.showWarningStatusMessage = function(message)
{
	this.updateStatusLabel(message, oFF.UiColor.YELLOW.newDarkerColor(0.22));
};
oFF.AuGalaxyDataStudio.prototype.showErrorStatusMessage = function(message)
{
	this.updateStatusLabel(message, oFF.UiColor.RED);
};
oFF.AuGalaxyDataStudio.prototype.showInfoStatusMessage = function(message)
{
	this.updateStatusLabel(message, oFF.UiColor.BLACK.newBrighterColor(0.2));
};
oFF.AuGalaxyDataStudio.prototype.showSuccessStatusMessage = function(message)
{
	this.updateStatusLabel(message, oFF.UiColor.GREEN.newBrighterColor(0.2));
};
oFF.AuGalaxyDataStudio.prototype.processGdfFile = function(file, gdfJson)
{
	if (this.isGdfJsonFileValid(gdfJson))
	{
		var tmpGdsQdDocument = this.openNewQueryDesignerDocument(file, null, null);
		if (oFF.isNull(file))
		{
			tmpGdsQdDocument.loadByJsonData(gdfJson);
		}
	}
	else
	{
		this.showErrorStatusMessage("Invalid file!");
		this.showCriticalError("The specified file is not a Galaxy Data Studio document file!");
	}
};
oFF.AuGalaxyDataStudio.prototype.isGdfJsonFileValid = function(gdfJson)
{
	if (oFF.isNull(gdfJson))
	{
		return false;
	}
	if (!gdfJson.containsKey(oFF.AuGdsContants.GDF_FILE_DOC_TYPE))
	{
		return false;
	}
	return true;
};
oFF.AuGalaxyDataStudio.prototype.hasUnsavedChanges = function()
{
	if (oFF.notNull(this.m_openDocuments))
	{
		var openDocumentsKeys = this.m_openDocuments.getKeysAsIteratorOfString();
		while (openDocumentsKeys.hasNext())
		{
			var tmpDocKey = openDocumentsKeys.next();
			var tmpDocument = this.m_openDocuments.getByKey(tmpDocKey);
			if (tmpDocument.isDirty())
			{
				return true;
			}
		}
	}
	return false;
};
oFF.AuGalaxyDataStudio.prototype.createFileMenuBarMenu = function(fileBtn)
{
	var fileToolbarMenu = this.getGenesis().newControl(oFF.UiType.MENU);
	fileToolbarMenu.setName(oFF.AuGalaxyDataStudio.MENU_BAR_FILE_MENU);
	fileToolbarMenu.addNewItem().setName(oFF.AuGalaxyDataStudio.MENU_BAR_FILE_MENU_NEW).setText("New").setIcon("document").registerOnPress(this);
	fileToolbarMenu.addNewItem().setName(oFF.AuGalaxyDataStudio.MENU_BAR_FILE_MENU_OPEN).setText("Open...").setIcon("open-folder").registerOnPress(this).setEnabled(false);
	fileToolbarMenu.addNewItem().setName(oFF.AuGalaxyDataStudio.MENU_BAR_FILE_MENU_CLOSE).setText("Close").setIcon("decline").registerOnPress(this).setEnabled(true).setSectionStart(true);
	fileToolbarMenu.addNewItem().setName(oFF.AuGalaxyDataStudio.MENU_BAR_FILE_MENU_CLOSE_ALL).setText("Close All").setIcon("clear-all").registerOnPress(this).setEnabled(true);
	fileToolbarMenu.addNewItem().setName(oFF.AuGalaxyDataStudio.MENU_BAR_FILE_MENU_SAVE).setText("Save").setIcon("save").registerOnPress(this).setSectionStart(true).setEnabled(oFF.notNull(this.m_activeDocument) && this.m_activeDocument.hasFile());
	fileToolbarMenu.addNewItem().setName(oFF.AuGalaxyDataStudio.MENU_BAR_FILE_MENU_SAVE_AS).setText("Save As...").setIcon("save").registerOnPress(this).setEnabled(oFF.notNull(this.m_activeDocument) && this.m_activeDocument.hasSaveData());
	fileToolbarMenu.addNewItem().setName(oFF.AuGalaxyDataStudio.MENU_BAR_FILE_MENU_SAVE_ALL).setText("Save All").setIcon("save").registerOnPress(this).setEnabled(false);
	fileToolbarMenu.addNewItem().setName(oFF.AuGalaxyDataStudio.MENU_BAR_FILE_MENU_EXIT).setText("Exit").setIcon("decline").registerOnPress(this).setEnabled(true).setSectionStart(true);
	fileToolbarMenu.openAt(fileBtn);
};
oFF.AuGalaxyDataStudio.prototype.createEditMenuBarMenu = function(fileBtn)
{
	var editToolbarMenu = this.getGenesis().newControl(oFF.UiType.MENU);
	editToolbarMenu.setName(oFF.AuGalaxyDataStudio.MENU_BAR_EDIT_MENU);
	editToolbarMenu.addNewItem().setName(oFF.AuGalaxyDataStudio.MENU_BAR_EDIT_MENU_UNDO).setText("Undo").setIcon("undo").registerOnPress(this).setEnabled(oFF.notNull(this.m_activeDocument) && this.m_activeDocument.hasUndoSteps());
	editToolbarMenu.addNewItem().setName(oFF.AuGalaxyDataStudio.MENU_BAR_EDIT_MENU_REDO).setText("Redo").setIcon("redo").registerOnPress(this).setEnabled(oFF.notNull(this.m_activeDocument) && this.m_activeDocument.hasRedoSteps());
	editToolbarMenu.addNewItem().setName(oFF.AuGalaxyDataStudio.MENU_BAR_EDIT_MENU_CUT).setText("Cut").setIcon("scissors").registerOnPress(this).setSectionStart(true).setEnabled(false);
	editToolbarMenu.addNewItem().setName(oFF.AuGalaxyDataStudio.MENU_BAR_EDIT_MENU_COPY).setText("Copy").setIcon("copy").registerOnPress(this).setEnabled(false);
	editToolbarMenu.addNewItem().setName(oFF.AuGalaxyDataStudio.MENU_BAR_EDIT_MENU_PASTE).setText("Paste").setIcon("paste").registerOnPress(this).setEnabled(false);
	editToolbarMenu.addNewItem().setName(oFF.AuGalaxyDataStudio.MENU_BAR_EDIT_MENU_PREFERENCES).setText("Preferences...").setIcon("action-settings").registerOnPress(this).setSectionStart(true).setEnabled(oFF.notNull(this.m_activeDocument) && this.m_activeDocument.canPresentPreferences());
	editToolbarMenu.openAt(fileBtn);
};
oFF.AuGalaxyDataStudio.prototype.prepareToolbarItems = function()
{
	this.m_toolbarNewBtn = this.m_toolbar.addNewItemOfType(oFF.UiType.BUTTON).setName(oFF.AuGalaxyDataStudio.QUICK_ACTION_TOOLBAR_NEW).setTooltip("New").setIcon("document").registerOnPress(this);
	this.m_toolbarOpenBtn = this.m_toolbar.addNewItemOfType(oFF.UiType.BUTTON).setName(oFF.AuGalaxyDataStudio.QUICK_ACTION_TOOLBAR_OPEN).setTooltip("Open").setIcon("open-folder").registerOnPress(this).setEnabled(false);
	this.m_toolbarSaveAsBtn = this.m_toolbar.addNewItemOfType(oFF.UiType.BUTTON).setName(oFF.AuGalaxyDataStudio.QUICK_ACTION_TOOLBAR_SAVE_AS).setTooltip("Save as...").setIcon("save").registerOnPress(this).setEnabled(oFF.notNull(this.m_activeDocument) && this.m_activeDocument.hasSaveData());
	this.m_toolbarCloseDocBtn = this.m_toolbar.addNewItemOfType(oFF.UiType.BUTTON).setName(oFF.AuGalaxyDataStudio.QUICK_ACTION_TOOLBAR_CLOSE_DOCUMENT).setTooltip("Close document").setIcon("decline").registerOnPress(this).setEnabled(oFF.notNull(this.m_activeDocument));
	this.addToolbarSectionSeparator();
	this.m_toolbarUndoBtn = this.m_toolbar.addNewItemOfType(oFF.UiType.BUTTON).setName(oFF.AuGalaxyDataStudio.QUICK_ACTION_TOOLBAR_UNDO).setTooltip("Undo last action...").setIcon("undo").registerOnPress(this).setEnabled(false);
	this.m_toolbarRedoBtn = this.m_toolbar.addNewItemOfType(oFF.UiType.BUTTON).setName(oFF.AuGalaxyDataStudio.QUICK_ACTION_TOOLBAR_REDO).setTooltip("Redo last action...").setIcon("redo").registerOnPress(this).setEnabled(false);
};
oFF.AuGalaxyDataStudio.prototype.addToolbarSectionSeparator = function()
{
	this.m_toolbar.addItem(this.newToolbarSeparator());
};
oFF.AuGalaxyDataStudio.prototype.openPressed = function() {};
oFF.AuGalaxyDataStudio.prototype.savePressed = function()
{
	if (oFF.notNull(this.m_activeDocument) && this.m_activeDocument.hasFile())
	{
		this.m_activeDocument.executeSave();
	}
};
oFF.AuGalaxyDataStudio.prototype.saveAsPressed = function()
{
	if (oFF.notNull(this.m_activeDocument) && this.m_activeDocument.hasSaveData())
	{
		this.m_activeDocument.executeSaveAs();
	}
};
oFF.AuGalaxyDataStudio.prototype.undoPressed = function()
{
	if (oFF.notNull(this.m_activeDocument))
	{
		this.m_activeDocument.executeUndo();
	}
};
oFF.AuGalaxyDataStudio.prototype.redoPressed = function()
{
	if (oFF.notNull(this.m_activeDocument))
	{
		this.m_activeDocument.executeRedo();
	}
};
oFF.AuGalaxyDataStudio.prototype.openPreferencesDialog = function()
{
	if (oFF.notNull(this.m_activeDocument) && this.m_activeDocument.canPresentPreferences())
	{
		this.m_activeDocument.presentPreferences();
	}
};
oFF.AuGalaxyDataStudio.prototype.onPress = function(event)
{
	oFF.DfUiProgram.prototype.onPress.call( this , event);
	var control = event.getControl();
	var controlParent = control.getParent();
	if (oFF.notNull(controlParent) && controlParent.getUiType() === oFF.UiType.TOOLBAR && controlParent === this.getMenuBar())
	{
		switch (control.getName())
		{
			case oFF.AuGalaxyDataStudio.MENU_BAR_FILE_BTN:
				this.createFileMenuBarMenu(control);
				break;

			case oFF.AuGalaxyDataStudio.MENU_BAR_EDIT_BTN:
				this.createEditMenuBarMenu(control);
				break;

			default:
		}
	}
	if (oFF.notNull(controlParent) && controlParent.getUiType() === oFF.UiType.MENU && oFF.XString.isEqual(controlParent.getName(), oFF.AuGalaxyDataStudio.MENU_BAR_FILE_MENU))
	{
		switch (control.getName())
		{
			case oFF.AuGalaxyDataStudio.MENU_BAR_FILE_MENU_NEW:
				this.openEmptyQueryDesignerDocument();
				break;

			case oFF.AuGalaxyDataStudio.MENU_BAR_FILE_MENU_OPEN:
				this.openPressed();
				break;

			case oFF.AuGalaxyDataStudio.MENU_BAR_FILE_MENU_CLOSE:
				this.closeActiveDocumentSafe();
				break;

			case oFF.AuGalaxyDataStudio.MENU_BAR_FILE_MENU_CLOSE_ALL:
				this.closeAllDocuments();
				break;

			case oFF.AuGalaxyDataStudio.MENU_BAR_FILE_MENU_SAVE:
				this.savePressed();
				break;

			case oFF.AuGalaxyDataStudio.MENU_BAR_FILE_MENU_SAVE_AS:
				this.saveAsPressed();
				break;

			case oFF.AuGalaxyDataStudio.MENU_BAR_FILE_MENU_SAVE_ALL:
				break;

			case oFF.AuGalaxyDataStudio.MENU_BAR_FILE_MENU_EXIT:
				this.requestExit();
				break;

			default:
		}
	}
	if (oFF.notNull(controlParent) && controlParent.getUiType() === oFF.UiType.MENU && oFF.XString.isEqual(controlParent.getName(), oFF.AuGalaxyDataStudio.MENU_BAR_EDIT_MENU))
	{
		switch (control.getName())
		{
			case oFF.AuGalaxyDataStudio.MENU_BAR_EDIT_MENU_UNDO:
				this.undoPressed();
				break;

			case oFF.AuGalaxyDataStudio.MENU_BAR_EDIT_MENU_REDO:
				this.redoPressed();
				break;

			case oFF.AuGalaxyDataStudio.MENU_BAR_EDIT_MENU_CUT:
				break;

			case oFF.AuGalaxyDataStudio.MENU_BAR_EDIT_MENU_COPY:
				break;

			case oFF.AuGalaxyDataStudio.MENU_BAR_EDIT_MENU_PASTE:
				break;

			case oFF.AuGalaxyDataStudio.MENU_BAR_EDIT_MENU_CLEAR_RECENTS:
				break;

			case oFF.AuGalaxyDataStudio.MENU_BAR_EDIT_MENU_PREFERENCES:
				this.openPreferencesDialog();
				break;

			default:
		}
	}
	if (oFF.notNull(controlParent) && controlParent.getUiType() === oFF.UiType.TOOLBAR && oFF.XString.isEqual(controlParent.getName(), oFF.AuGalaxyDataStudio.QUICK_ACTION_TOOLBAR))
	{
		switch (control.getName())
		{
			case oFF.AuGalaxyDataStudio.QUICK_ACTION_TOOLBAR_NEW:
				this.openEmptyQueryDesignerDocument();
				break;

			case oFF.AuGalaxyDataStudio.QUICK_ACTION_TOOLBAR_OPEN:
				this.openPressed();
				break;

			case oFF.AuGalaxyDataStudio.QUICK_ACTION_TOOLBAR_SAVE_AS:
				this.saveAsPressed();
				break;

			case oFF.AuGalaxyDataStudio.QUICK_ACTION_TOOLBAR_CLOSE_DOCUMENT:
				this.closeActiveDocumentSafe();
				break;

			case oFF.AuGalaxyDataStudio.QUICK_ACTION_TOOLBAR_UNDO:
				this.undoPressed();
				break;

			case oFF.AuGalaxyDataStudio.QUICK_ACTION_TOOLBAR_REDO:
				this.redoPressed();
				break;

			default:
		}
	}
};
oFF.AuGalaxyDataStudio.prototype.onFileLoaded = function(extResult, file, fileContent, customIdentifier)
{
	this.log("File loaded!");
	if (oFF.isNull(extResult) || extResult.isValid())
	{
		var jsonObj = this.getJsonObjFromLoadedFileContent(fileContent);
		if (oFF.notNull(jsonObj))
		{
			this.processGdfFile(file, jsonObj);
		}
	}
	else
	{
		this.getGenesis().showErrorToast("Error while fetching the specified file!");
	}
	this.setContentBusy(false);
};
oFF.AuGalaxyDataStudio.prototype.onFileDrop = function(event)
{
	var fileContent = event.getParameters().getStringByKeyExt(oFF.UiControlEvent.PARAM_FILE_CONTENT, null);
	if (oFF.XStringUtils.isNotNullAndNotEmpty(fileContent))
	{
		var parser = oFF.JsonParserFactory.newInstance();
		var tmpElement = parser.parse(fileContent);
		var jsonObj = null;
		if (oFF.notNull(tmpElement) && tmpElement.isStructure())
		{
			jsonObj = tmpElement;
		}
		this.processGdfFile(null, jsonObj);
		parser = oFF.XObjectExt.release(parser);
	}
};
oFF.AuGalaxyDataStudio.prototype.onItemClose = function(event)
{
	var control = event.getControl();
	if (control.getUiType() === oFF.UiType.TAB_BAR && oFF.XString.isEqual(control.getName(), oFF.AuGalaxyDataStudio.MAIN_TAB_BAR_NAME) && event.getAffectedItem() !== null)
	{
		var tmpDocument = this.m_openDocuments.getByKey(event.getAffectedItem().getName());
		this.closeDocumentSafe(tmpDocument);
	}
};
oFF.AuGalaxyDataStudio.prototype.onItemSelect = function(event)
{
	var control = event.getControl();
	if (control.getUiType() === oFF.UiType.TAB_BAR && oFF.XString.isEqual(control.getName(), oFF.AuGalaxyDataStudio.MAIN_TAB_BAR_NAME) && event.getAffectedItem() !== null)
	{
		var tmpDocument = this.m_openDocuments.getByKey(event.getAffectedItem().getName());
		this.activeDocumentChanged(tmpDocument);
	}
};
oFF.AuGalaxyDataStudio.prototype.onButtonPress = function(event)
{
	var pressedButtonType = oFF.UiPressedButtonType.lookup(event.getParameters().getStringByKey(oFF.UiControlEvent.PARAM_PRESSED_BUTTON_TYPE));
	if (pressedButtonType === oFF.UiPressedButtonType.ADD)
	{
		this.openEmptyQueryDesignerDocument();
	}
};
oFF.AuGalaxyDataStudio.prototype.onDocumentTitleChanged = function(document, newTitle)
{
	if (this.m_activeDocument === document)
	{
		this.setTitle(newTitle);
	}
};
oFF.AuGalaxyDataStudio.prototype.onDocumentStatusChanged = function(document, statusMessage, statusMessageType)
{
	if (this.m_activeDocument === document)
	{
		this.setStatusMessage(statusMessage, statusMessageType);
	}
};
oFF.AuGalaxyDataStudio.prototype.onUndoRedoStateChanged = function(document, hasUndoSteps, hasRedoSteps)
{
	if (oFF.notNull(this.m_toolbarUndoBtn))
	{
		this.m_toolbarUndoBtn.setEnabled(hasUndoSteps);
	}
	if (oFF.notNull(this.m_toolbarRedoBtn))
	{
		this.m_toolbarRedoBtn.setEnabled(hasRedoSteps);
	}
};
oFF.AuGalaxyDataStudio.prototype.onUndoSaveDataStateChanged = function(document, hasSaveData, saveData)
{
	if (oFF.notNull(this.m_toolbarSaveAsBtn))
	{
		this.m_toolbarSaveAsBtn.setEnabled(hasSaveData);
	}
};

oFF.Gyros = function() {};
oFF.Gyros.prototype = new oFF.DfUiProgram();
oFF.Gyros.prototype._ff_c = "Gyros";

oFF.Gyros.DEFAULT_PROGRAM_NAME = "Gyros";
oFF.Gyros.TEST_VARIANT_PREFIX = "FF_UI_TEST_";
oFF.Gyros.PARAM_SYSTEM = "system";
oFF.Gyros.PARAM_DATASOURCE = "datasource";
oFF.Gyros.PARAM_PLANNING_SEQUENCE = "planningSequence";
oFF.Gyros.PARAM_TEST = "test";
oFF.Gyros.PROPERTY_USE_OLAP_ENV = "useOlapEnv";
oFF.Gyros.PROPERTY_FUNCTIONAL_VALUES = "enableFunctionalValues";
oFF.Gyros.PROPERTY_DATE_PICKER_VALUE_HELP = "enableDatePickerValueHelp";
oFF.Gyros.PROPERTY_NON_BLOCKING_REQUESTS = "nonBlockingRequests";
oFF.Gyros.PROPERTY_USE_CUSTOM_STORY_LEVEL_TEXT = "useCustomStoryLevelText";
oFF.Gyros.createRunner = function()
{
	return oFF.KernelBoot.createByName(oFF.Gyros.DEFAULT_PROGRAM_NAME);
};
oFF.Gyros.prototype.m_argumentStructure = null;
oFF.Gyros.prototype.m_system = null;
oFF.Gyros.prototype.m_datasource = null;
oFF.Gyros.prototype.m_planningSequence = null;
oFF.Gyros.prototype.m_test = null;
oFF.Gyros.prototype.m_defaultRb = null;
oFF.Gyros.prototype.m_storyRb = null;
oFF.Gyros.prototype.m_appRb = null;
oFF.Gyros.prototype.m_brRb = null;
oFF.Gyros.prototype.m_storyEditableCb = null;
oFF.Gyros.prototype.m_readonlyCb = null;
oFF.Gyros.prototype.m_uqmCb = null;
oFF.Gyros.prototype.m_noneRb = null;
oFF.Gyros.prototype.m_chartRb = null;
oFF.Gyros.prototype.m_tableRb = null;
oFF.Gyros.prototype.m_explorerRb = null;
oFF.Gyros.prototype.m_filterRb = null;
oFF.Gyros.prototype.m_displayMcb = null;
oFF.Gyros.prototype.m_linkMcb = null;
oFF.Gyros.prototype.m_commandMcb = null;
oFF.Gyros.prototype.m_optionsIcon = null;
oFF.Gyros.prototype.m_options = null;
oFF.Gyros.prototype.m_optionsPopover = null;
oFF.Gyros.prototype.m_changeDsBtn = null;
oFF.Gyros.prototype.m_editToggleBtn = null;
oFF.Gyros.prototype.m_mobileValueHelpBtn = null;
oFF.Gyros.prototype.m_openBtn = null;
oFF.Gyros.prototype.m_optimizedBtn = null;
oFF.Gyros.prototype.m_storyTa = null;
oFF.Gyros.prototype.m_widgetTa = null;
oFF.Gyros.prototype.m_sacDataTa = null;
oFF.Gyros.prototype.m_tokenPopover = null;
oFF.Gyros.prototype.m_messageManager = null;
oFF.Gyros.prototype.m_queryManager = null;
oFF.Gyros.prototype.m_variableProcessor = null;
oFF.Gyros.prototype.m_vdDialog = null;
oFF.Gyros.prototype.m_vdToken = null;
oFF.Gyros.prototype.m_orcaFunctions = null;
oFF.Gyros.prototype.m_orcaDialog = null;
oFF.Gyros.prototype.m_orcaToken = null;
oFF.Gyros.prototype.m_linkage = null;
oFF.Gyros.prototype.m_isPlanningSequence = false;
oFF.Gyros.prototype.m_forcePrompt = false;
oFF.Gyros.prototype.m_disableExitVariables = false;
oFF.Gyros.prototype.m_disableDynamicVariablesInStory = false;
oFF.Gyros.prototype.m_disableDynamicVariablesInWidget = false;
oFF.Gyros.prototype.m_featureDialog = null;
oFF.Gyros.prototype.newProgram = function()
{
	var gyros = new oFF.Gyros();
	gyros.setup();
	return gyros;
};
oFF.Gyros.prototype.isShowMenuBar = function()
{
	return true;
};
oFF.Gyros.prototype.doSetupProgramMetadata = function(metadata)
{
	oFF.DfUiProgram.prototype.doSetupProgramMetadata.call( this , metadata);
	metadata.addParameter(oFF.Gyros.PARAM_SYSTEM, "The system to connect to.");
	metadata.addParameter(oFF.Gyros.PARAM_DATASOURCE, "The datasource to be used (Can be empty for planning sequences).");
	metadata.addParameter(oFF.Gyros.PARAM_PLANNING_SEQUENCE, "The planning sequence to be used (Optional).");
	metadata.addParameter(oFF.Gyros.PARAM_TEST, "The name of the running test (Optional).");
};
oFF.Gyros.prototype.evalArguments = function()
{
	this.m_argumentStructure = this.getArgumentStructure();
	if (this.m_argumentStructure.getIntegerByKeyExt(oFF.DfProgram.PARAM_XVERSION, -3) === -3)
	{
		this.m_argumentStructure.putInteger(oFF.DfProgram.PARAM_XVERSION, oFF.XVersion.V140_REPOSITORY_PERSIST_PAGING);
	}
	var features = this.getParameterValue(oFF.DfProgram.PARAM_FEATURES);
	if (oFF.XStringUtils.isNullOrEmpty(this.m_argumentStructure.getStringByKey(oFF.DfProgram.PARAM_FEATURES)))
	{
		this.m_argumentStructure.putString(oFF.DfProgram.PARAM_FEATURES, features);
	}
	oFF.DfUiProgram.prototype.evalArguments.call( this );
	this.m_system = this.getParameterValue(oFF.Gyros.PARAM_SYSTEM);
	this.m_datasource = this.getParameterValue(oFF.Gyros.PARAM_DATASOURCE);
	this.m_planningSequence = this.getParameterValue(oFF.Gyros.PARAM_PLANNING_SEQUENCE);
	this.m_test = this.getParameterValue(oFF.Gyros.PARAM_TEST);
	if (oFF.XStringUtils.isNullOrEmpty(this.m_system) || oFF.XStringUtils.isNullOrEmpty(this.m_planningSequence) && oFF.XStringUtils.isNullOrEmpty(this.m_datasource))
	{
		this.m_system = "KIW";
		this.m_datasource = "query:[0BOC_TEST_VARIABLE_TYPES_1]";
	}
};
oFF.Gyros.prototype.getParameterValue = function(name)
{
	var value = this.getSession().getEnvironment().getStringByKey(name);
	if (oFF.XStringUtils.isNullOrEmpty(value))
	{
		value = this.m_argumentStructure.getStringByKey(name);
	}
	return value;
};
oFF.Gyros.prototype.initializeProgram = function()
{
	oFF.DfUiProgram.prototype.initializeProgram.call( this );
	oFF.ApplicationUiModule.getInstance();
	this.m_messageManager = oFF.MessageManager.createMessageManagerExt(this.getSession());
	this.m_linkage = oFF.XHashMapByString.create();
	this.m_disableDynamicVariablesInStory = true;
	this.m_disableDynamicVariablesInWidget = true;
	oFF.VdVariableModel.CURRENT_DATE = oFF.XDate.createDateSafe("2017-04-18");
	var traceInfo = oFF.TraceInfo.create();
	traceInfo.setTraceType(oFF.TraceType.URL);
	traceInfo.setTraceName(this.m_test);
	this.getApplication().getConnectionPool().setTraceInfo(this.m_system, traceInfo);
	this.setupDatasource();
	this.m_options = oFF.OlapUiPropertyListHelper.create(this.getUiManager());
	this.m_options.addBooleanProperty(oFF.Gyros.PROPERTY_USE_OLAP_ENV, "Use Olap Env", false);
	this.m_options.addBooleanProperty(oFF.Gyros.PROPERTY_FUNCTIONAL_VALUES, "Enable Functional Values", false);
	this.m_options.addBooleanProperty(oFF.Gyros.PROPERTY_DATE_PICKER_VALUE_HELP, "Enable DatePicker with ValueHelp", false);
	this.m_options.addBooleanProperty(oFF.Gyros.PROPERTY_NON_BLOCKING_REQUESTS, "Send Non-Blocking requests", false);
	this.m_options.addBooleanProperty(oFF.Gyros.PROPERTY_USE_CUSTOM_STORY_LEVEL_TEXT, "Use custom story level text", false);
};
oFF.Gyros.prototype.setupDatasource = function()
{
	if (oFF.XStringUtils.isNotNullAndNotEmpty(this.m_datasource))
	{
		var serviceConfig = oFF.QueryServiceConfig.createWithDataSourceName(this.getApplication(), this.m_system, this.m_datasource);
		var syncAction = serviceConfig.processQueryManagerCreation(oFF.SyncType.BLOCKING, null, null);
		if (syncAction.hasErrors())
		{
			this.m_messageManager.addAllMessages(syncAction);
			return;
		}
		this.m_queryManager = syncAction.getData();
	}
	if (oFF.XStringUtils.isNotNullAndNotEmpty(this.m_planningSequence))
	{
		var planningServiceDataSource = oFF.QFactory.createDataSource();
		planningServiceDataSource.setFullQualifiedName("$[][][MY_DATA_AREA]");
		var planningServiceConfig = oFF.OlapApiModule.SERVICE_TYPE_PLANNING.createServiceConfig(this.getApplication());
		planningServiceConfig.setSystemName(this.m_system);
		planningServiceConfig.setDataSource(planningServiceDataSource);
		planningServiceConfig.getProperties().putStringNotNull(oFF.PlanningConstants.PERSISTENCE_TYPE, oFF.CellLockingType.DEFAULT_SETTING_BACKEND.getName());
		var result = planningServiceConfig.processServiceCreation(oFF.SyncType.BLOCKING, null, null);
		if (result.hasErrors())
		{
			this.m_messageManager.addAllMessages(result);
			return;
		}
		var planningService = result.getData();
		var dataArea = planningService.getPlanningContext();
		var commandIdentifier = dataArea.createPlanningSequenceIdentifier(this.m_planningSequence);
		var creator = dataArea.createPlanningCommand(commandIdentifier);
		if (creator.hasErrors())
		{
			this.m_messageManager.addAllMessages(creator);
			return;
		}
		var planningCommand = creator.getData();
		var planningSequence = planningCommand.getCreatedPlanningCommandWithId();
		this.m_variableProcessor = planningSequence.getVariableProcessor();
		this.m_isPlanningSequence = true;
	}
};
oFF.Gyros.prototype.buildUi = function(genesis)
{
	this.m_changeDsBtn = this.addMenuBarButton("changeDatasourceBtn", null, "Change Datasource", null, this);
	this.m_editToggleBtn = this.addMenuBarButton("editTogglesBtn", null, "Edit Feature Toggles", null, this);
	this.m_mobileValueHelpBtn = this.addMenuBarButton("mobileValueHelpBtn", null, "Mobile Value Help", null, this);
	var root = genesis.newRoot(oFF.UiType.FLEX_LAYOUT);
	root.setDirection(oFF.UiFlexDirection.COLUMN);
	root.setPadding(oFF.UiCssBoxEdges.create("5px"));
	if (this.m_messageManager.hasErrors() || this.getVariableProcessor() === null)
	{
		this.buildGyrosErrorOutput(root);
		return;
	}
	var inner = root.addNewItemOfType(oFF.UiType.FLEX_LAYOUT);
	inner.setJustifyContent(oFF.UiFlexJustifyContent.SPACE_BETWEEN);
	inner.setFlex("0 0 auto");
	var left = inner.addNewItemOfType(oFF.UiType.VERTICAL_LAYOUT);
	left.setWidth(oFF.UiCssLength.create("33%"));
	this.buildContextSection(left);
	this.buildLevelSection(left);
	var checkboxes = left.addNewItemOfType(oFF.UiType.HORIZONTAL_LAYOUT);
	this.m_storyEditableCb = checkboxes.addNewItemOfType(oFF.UiType.CHECKBOX);
	this.m_storyEditableCb.setName("storyEditable").setText("Story Editable").setChecked(true);
	this.m_readonlyCb = checkboxes.addNewItemOfType(oFF.UiType.CHECKBOX);
	this.m_readonlyCb.setName("readonlyCb").setText("Readonly");
	this.m_uqmCb = checkboxes.addNewItemOfType(oFF.UiType.CHECKBOX);
	this.m_uqmCb.setName("uqmCb").setText("UQM");
	left.addNewItemOfType(oFF.UiType.SPACER);
	this.buildDisplaySection(left);
	this.buildLinkSection(left);
	this.buildCommandSection(left);
	this.m_optionsIcon = left.addNewItemOfType(oFF.UiType.BUTTON);
	this.m_optionsIcon.setName("options").setText("More Options");
	this.m_optionsIcon.registerOnPress(this);
	var right = inner.addNewItemOfType(oFF.UiType.FLEX_LAYOUT);
	right.setDirection(oFF.UiFlexDirection.COLUMN);
	right.setWidth(oFF.UiCssLength.create("66%"));
	this.m_openBtn = right.addNewItemOfType(oFF.UiType.BUTTON);
	this.m_openBtn.setName("openBtn").setText("Open Variable Dialog");
	this.m_openBtn.registerOnPress(this);
	this.m_optimizedBtn = right.addNewItemOfType(oFF.UiType.BUTTON);
	this.m_optimizedBtn.setName("optimizedBtn").setText("Perform Story Filter Optimization");
	this.m_optimizedBtn.registerOnPress(this);
	var outputSection = right.addNewItemOfType(oFF.UiType.FLEX_LAYOUT);
	outputSection.setHeight(oFF.UiCssLength.create("100%"));
	outputSection.setFlex("auto");
	var output1 = outputSection.addNewItemOfType(oFF.UiType.FLEX_LAYOUT);
	output1.setFlex("auto");
	output1.setDirection(oFF.UiFlexDirection.COLUMN);
	output1.setAlignItems(oFF.UiFlexAlignItems.CENTER);
	output1.addNewItemOfType(oFF.UiType.LABEL).setText("I/O Default/Story").setHeight(oFF.UiCssLength.create("7%"));
	this.m_storyTa = output1.addNewItemOfType(oFF.UiType.TEXT_AREA);
	this.m_storyTa.setName("storyTa");
	this.m_storyTa.setBackgroundColor(oFF.UiColor.WHITE);
	this.m_storyTa.setSize(oFF.UiSize.createByCss("100%", "100%"));
	var output2 = outputSection.addNewItemOfType(oFF.UiType.FLEX_LAYOUT);
	output2.setFlex("auto");
	output2.setDirection(oFF.UiFlexDirection.COLUMN);
	output2.setAlignItems(oFF.UiFlexAlignItems.CENTER);
	output2.addNewItemOfType(oFF.UiType.LABEL).setText("I/O Widget").setHeight(oFF.UiCssLength.create("7%"));
	this.m_widgetTa = output2.addNewItemOfType(oFF.UiType.TEXT_AREA);
	this.m_widgetTa.setName("widgetTa");
	this.m_widgetTa.setBackgroundColor(oFF.UiColor.WHITE);
	this.m_widgetTa.setSize(oFF.UiSize.createByCss("100%", "100%"));
	var output3 = outputSection.addNewItemOfType(oFF.UiType.FLEX_LAYOUT);
	output3.setFlex("auto");
	output3.setDirection(oFF.UiFlexDirection.COLUMN);
	output3.setAlignItems(oFF.UiFlexAlignItems.CENTER);
	output3.addNewItemOfType(oFF.UiType.LABEL).setText("SAC Data").setHeight(oFF.UiCssLength.create("7%"));
	this.m_sacDataTa = output3.addNewItemOfType(oFF.UiType.TEXT_AREA);
	this.m_sacDataTa.setName("sacDataTa");
	this.m_sacDataTa.setBackgroundColor(oFF.UiColor.WHITE);
	this.m_sacDataTa.setSize(oFF.UiSize.createByCss("100%", "100%"));
	this.setupUi();
	this.updateState();
};
oFF.Gyros.prototype.buildGyrosErrorOutput = function(parent)
{
	var errorLabel = parent.addNewItemOfType(oFF.UiType.TEXT_AREA);
	errorLabel.setName("gyrosErrorOutput");
	errorLabel.setEnabled(false);
	errorLabel.setBackgroundColor(oFF.UiColor.TRANSPARENT);
	errorLabel.setWidth(oFF.UiCssLength.create("100%"));
	errorLabel.setHeight(oFF.UiCssLength.create("100%"));
	var buffer = oFF.XStringBuffer.create();
	buffer.append("Gyros could not create a variable processor to work with. Reason:\n");
	buffer.append(this.m_messageManager.getSummary());
	errorLabel.setText(buffer.toString());
};
oFF.Gyros.prototype.buildContextSection = function(parent)
{
	parent.addNewItemOfType(oFF.UiType.LABEL).setText("Context:");
	var group = parent.addNewItemOfType(oFF.UiType.RADIO_BUTTON_GROUP);
	group.setColumnCount(2);
	this.m_defaultRb = group.addNewRadioButton();
	this.m_defaultRb.setName("defaultRb").setText("Default");
	this.m_defaultRb.registerOnChange(this);
	this.m_defaultRb.setSelected(true);
	this.m_storyRb = group.addNewRadioButton();
	this.m_storyRb.setName("storyRb").setText("Story");
	this.m_storyRb.registerOnChange(this);
	this.m_appRb = group.addNewRadioButton();
	this.m_appRb.setName("appRb").setText("AnalyticApp");
	this.m_brRb = group.addNewRadioButton();
	this.m_brRb.setName("brRb").setText("Board Room");
};
oFF.Gyros.prototype.buildLevelSection = function(parent)
{
	parent.addNewItemOfType(oFF.UiType.LABEL).setText("Level:");
	var group = parent.addNewItemOfType(oFF.UiType.RADIO_BUTTON_GROUP);
	group.setColumnCount(3);
	this.m_noneRb = group.addNewRadioButton();
	this.m_noneRb.setName("noneRb").setText("None");
	this.m_noneRb.setSelected(true);
	this.m_chartRb = group.addNewRadioButton();
	this.m_chartRb.setName("chartRb").setText("Chart");
	this.m_tableRb = group.addNewRadioButton();
	this.m_tableRb.setName("tableRb").setText("Table");
	this.m_explorerRb = group.addNewRadioButton();
	this.m_explorerRb.setName("explorerRb").setText("Explorer");
	this.m_filterRb = group.addNewRadioButton();
	this.m_filterRb.setName("filterRb").setText("Filter");
};
oFF.Gyros.prototype.buildDisplaySection = function(parent)
{
	var layout = parent.addNewItemOfType(oFF.UiType.VERTICAL_LAYOUT);
	layout.addNewItemOfType(oFF.UiType.LABEL).setText("Display Variables:");
	this.m_displayMcb = layout.addNewItemOfType(oFF.UiType.MULTI_COMBO_BOX);
	this.m_displayMcb.setName("displayVariablesMcb");
};
oFF.Gyros.prototype.buildLinkSection = function(parent)
{
	var layout = parent.addNewItemOfType(oFF.UiType.VERTICAL_LAYOUT);
	var horizontal = layout.addNewItemOfType(oFF.UiType.HORIZONTAL_LAYOUT);
	horizontal.addNewItemOfType(oFF.UiType.LABEL).setText("Show Link Variable Tooltips:");
	var icon = horizontal.addNewItemOfType(oFF.UiType.ICON).setIcon("message-information").setPadding(oFF.UiCssBoxEdges.create("3px"));
	icon.setTooltip("Only setting the tooltip will be interpreted as a missing link (FPA10-3392) and instead of linked valueHelp, the default will be used.");
	this.m_linkMcb = layout.addNewItemOfType(oFF.UiType.MULTI_COMBO_BOX);
	this.m_linkMcb.setName("linkVariablesMcb");
};
oFF.Gyros.prototype.buildCommandSection = function(parent)
{
	var layout = parent.addNewItemOfType(oFF.UiType.VERTICAL_LAYOUT);
	layout.addNewItemOfType(oFF.UiType.LABEL).setText("Commands:");
	this.m_commandMcb = layout.addNewItemOfType(oFF.UiType.MULTI_COMBO_BOX);
	this.m_commandMcb.setName("commandMcb");
	this.m_commandMcb.registerOnSelectionChange(this);
	var commands = oFF.GyrosCommand.getAllCommands();
	for (var i = 0; i < commands.size(); i++)
	{
		var command = commands.get(i);
		var item = this.m_commandMcb.addNewItem();
		item.setName(command.getName());
		item.setText(command.getDescription());
	}
};
oFF.Gyros.prototype.setupUi = function()
{
	var variables = this.getVariableProcessor().getInputEnabledVariables();
	this.m_displayMcb.clearItems();
	this.m_linkMcb.clearItems();
	for (var i = 0; i < variables.size(); i++)
	{
		var variable = variables.get(i);
		var displayItem = this.m_displayMcb.addNewItem();
		displayItem.setName(variable.getName());
		displayItem.setText(variable.getText());
		displayItem.setSelected(true);
		var linkItem = this.m_linkMcb.addNewItem();
		linkItem.setName(variable.getName());
		linkItem.setText(variable.getText());
	}
};
oFF.Gyros.prototype.showVariablePrompt = function(anchor, optimized)
{
	oFF.OlapUiValueHelpAbstract.s_syncType = this.m_options.getBooleanValue(oFF.Gyros.PROPERTY_NON_BLOCKING_REQUESTS) ? oFF.SyncType.NON_BLOCKING : oFF.SyncType.BLOCKING;
	var commands = this.m_commandMcb.getSelectedItems();
	for (var i = 0; i < commands.size(); i++)
	{
		var cmdName = commands.get(i).getName();
		oFF.GyrosCommand.getByName(cmdName).execute(this);
	}
	if (this.m_storyRb.isSelected() && this.getVariableProcessor().isReinitNeeded())
	{
		var listener = oFF.VariableProcessorCallbackLambda.createSingleUse( function(result){
			if (result.isValid())
			{
				this.showVariablePrompt(anchor, optimized);
			}
		}.bind(this));
		this.getVariableProcessor().reInitVariablesAfterSubmit(oFF.OlapUiValueHelpAbstract.s_syncType, listener, anchor);
		return;
	}
	var variablesToDisplay = oFF.XHashSetOfString.create();
	var selectedItems1 = this.m_displayMcb.getSelectedItems();
	for (var j = 0; j < selectedItems1.size(); j++)
	{
		variablesToDisplay.add(selectedItems1.get(j).getName());
	}
	if (this.m_defaultRb.isSelected())
	{
		this.showDefaultPrompt(anchor, variablesToDisplay, optimized);
	}
	else if (this.m_uqmCb.isChecked())
	{
		this.showUqmPrompt(anchor, variablesToDisplay, optimized);
	}
	else
	{
		this.showOrcaPrompt(anchor, variablesToDisplay);
	}
};
oFF.Gyros.prototype.showDefaultPrompt = function(anchor, variablesToDisplay, optimized)
{
	this.m_vdToken = oFF.XObjectExt.release(this.m_vdToken);
	this.m_vdDialog = oFF.XObjectExt.release(this.m_vdDialog);
	var displayManager = oFF.OlapUiDisplayFactory.createFactoryForDialog(this.getUiManager());
	var context = oFF.OlapUiContext.createContext(this.getUiManager(), displayManager);
	var config = oFF.VdConfiguration.createConfig("Variables", this.getVariableProcessor());
	config.setVariablesToDisplay(variablesToDisplay);
	config.setEnterOnFocusLeave(false);
	config.setFunctionalValuesEnabled(this.m_options.getBooleanValue(oFF.Gyros.PROPERTY_FUNCTIONAL_VALUES));
	config.setUseDatePickerValueHelp(this.m_options.getBooleanValue(oFF.Gyros.PROPERTY_DATE_PICKER_VALUE_HELP));
	config.setUseDatePicker(oFF.isNull(this.m_queryManager) || this.m_queryManager.getSystemType().isTypeOf(oFF.SystemType.ABAP));
	var controller;
	if (oFF.notNull(anchor))
	{
		controller = this.m_vdToken = oFF.VdVariableForm.createAsToken(context, config);
	}
	else
	{
		controller = this.m_vdDialog = oFF.VdVariableDialog.createAsDisplay(context, config, this);
	}
	this.m_vdDialog.registerSubmitListener(this);
	var firstVarName = this.getFirstVarName(variablesToDisplay);
	if (optimized && controller.supportsStoryFilterOptimization(firstVarName))
	{
		controller.performStoryFilterOptimizationWorkflow(firstVarName);
	}
	else if (oFF.notNull(this.m_vdToken))
	{
		var genesis = oFF.UiGenesis.create(anchor, oFF.UiItemPosition.CONTENT, oFF.UiOperation.SET, 0, 0);
		this.m_vdToken.buildUi(genesis);
	}
	else if (oFF.notNull(this.m_vdDialog))
	{
		this.m_vdDialog.open();
	}
};
oFF.Gyros.prototype.showOrcaPrompt = function(anchor, variablesToDisplay)
{
	this.m_orcaToken = oFF.XObjectExt.release(this.m_orcaToken);
	this.m_orcaDialog = oFF.XObjectExt.release(this.m_orcaDialog);
	this.m_orcaFunctions = oFF.XObjectExt.release(this.m_orcaFunctions);
	var i18n = this.getUiManager().getLocalization();
	var params = oFF.VdOrcaNativeParams.create();
	params.queryManager = oFF.isNull(this.m_variableProcessor) ? this.m_queryManager : null;
	params.varProcessor = this.getVariableProcessor();
	params.numberFormatter = oFF.GyrosNumberFormatter.create();
	params.dateDisplayFormat = "MMM d, y";
	params.storyEditable = this.m_storyEditableCb.isChecked();
	params.readOnly = this.m_readonlyCb.isChecked();
	params.showChartVariables = this.m_chartRb.isSelected() || this.m_tableRb.isSelected();
	params.isWidget = this.m_chartRb.isSelected() || this.m_tableRb.isSelected() || this.m_explorerRb.isSelected();
	params.useTableMessage = this.m_tableRb.isSelected();
	params.analyticApp = this.m_appRb.isSelected();
	params.variablesToDisplay = variablesToDisplay;
	params.customStoryButtonText = this.m_options.getBooleanValue(oFF.Gyros.PROPERTY_USE_CUSTOM_STORY_LEVEL_TEXT) ? oFF.Gyros.PROPERTY_USE_CUSTOM_STORY_LEVEL_TEXT : null;
	params.presetVariablesButtonText = this.m_brRb.isSelected() ? i18n.getText(oFF.VariableDialogI18n.I18N_VD_SET_FOR_CURRENT_PAGE) : null;
	params.datasetVariablesButtonText = this.m_brRb.isSelected() ? i18n.getText(oFF.VariableDialogI18n.I18N_VD_SET_FOR_ALL_PAGES) : null;
	params.preSetVariablesEditable = this.m_brRb.isSelected() && this.m_noneRb.isSelected();
	params.datasetVariablesEditable = this.m_brRb.isSelected() && this.m_noneRb.isSelected();
	params.showVariantSection = this.m_brRb.isSelected() && this.m_noneRb.isSelected();
	params.isPlanningSequence = this.m_isPlanningSequence;
	params.forcePrompt = this.m_forcePrompt;
	params.disableExitVariables = this.m_disableExitVariables;
	params.isStoryUsingDynamicVariables = !this.m_disableDynamicVariablesInStory;
	params.isWidgetUsingDynamicVariables = !this.m_disableDynamicVariablesInWidget;
	params.linkage = this.m_linkage;
	params.linkTooltips = this.createLinkTooltips();
	if (oFF.XStringUtils.isNotNullAndNotEmpty(this.m_storyTa.getText()))
	{
		params.datasetVariables = oFF.JsonParserFactory.createFromSafeString(this.m_storyTa.getText());
	}
	if (oFF.XStringUtils.isNotNullAndNotEmpty(this.m_widgetTa.getText()))
	{
		params.preSetVariables = oFF.JsonParserFactory.createFromSafeString(this.m_widgetTa.getText());
	}
	var sacData = this.m_sacDataTa.getText();
	if (oFF.XStringUtils.isNotNullAndNotEmpty(sacData))
	{
		var sacDataStructure = oFF.JsonParserFactory.createFromSafeString(sacData);
		params.filterVariables = sacDataStructure.getStructureByKey("Filter");
		params.dimensionDisplayInfo = sacDataStructure.getStructureByKey("DimensionDisplayInfo");
	}
	var variables = this.getVariableProcessor().getInputEnabledAndNonTechnicalVariables();
	if (this.m_filterRb.isSelected())
	{
		if (variablesToDisplay.size() === 1)
		{
			params.singleVariableKey = variablesToDisplay.getValuesAsReadOnlyListOfString().get(0);
		}
		else if (variables.size() >= 1)
		{
			var singleVarName = variables.get(0).getName();
			params.singleVariableKey = singleVarName;
			params.variablesToDisplay = oFF.XHashSetOfString.create();
			params.variablesToDisplay.add(singleVarName);
		}
	}
	if (oFF.notNull(anchor))
	{
		this.m_orcaFunctions = this.m_orcaToken = oFF.VdOrcaEntryPoint.createEntryPointToken(null, params);
		this.m_orcaFunctions.registerSubmitListener(this);
		this.m_orcaToken.buildUiOnControl(anchor);
	}
	else
	{
		this.m_orcaFunctions = this.m_orcaDialog = oFF.VdOrcaEntryPoint.createEntryPointDisplay(null, params, this);
		this.m_orcaFunctions.registerSubmitListener(this);
		this.m_orcaDialog.open();
	}
};
oFF.Gyros.prototype.showUqmPrompt = function(anchor, variablesToDisplay, optimized)
{
	this.m_orcaToken = oFF.XObjectExt.release(this.m_orcaToken);
	this.m_orcaDialog = oFF.XObjectExt.release(this.m_orcaDialog);
	this.m_orcaFunctions = oFF.XObjectExt.release(this.m_orcaFunctions);
	var application = this.getApplication();
	var params = oFF.PrFactory.createStructure();
	if (oFF.notNull(this.m_queryManager))
	{
		var gyrosId = "gyrosId";
		this.m_queryManager.getTagging().put(oFF.VdStandalone.VARIABLE_PROCESSOR_ID, gyrosId);
		params.putString(oFF.VdStandalone.VARIABLE_PROCESSOR_ID, gyrosId);
	}
	var isBw = this.isBw();
	params.putString(oFF.VdStandalone.TITLE, this.getTitle());
	params.putString(oFF.VdStandalone.DATE_DISPLAY_FORMAT, "MMM d, y");
	params.putString(oFF.VdStandalone.SCENARIO, this.getScenario().getName());
	params.putString(oFF.VdStandalone.LEVEL, this.getLevel().getName());
	params.putBoolean(oFF.VdStandalone.UPDATE_DYNAMIC_VARIABLES_ON_START, false);
	params.putBoolean(oFF.VdStandalone.USE_DATEPICKER, isBw);
	params.putBoolean(oFF.VdStandalone.HIDE_OPERATOR_NOT_BEWEEN, !isBw);
	params.putBoolean(oFF.VdStandalone.HIDE_LEVEL_SECTION, this.getScenario() === oFF.VdOrcaScenario.ANALYTIC_APP && !this.m_storyEditableCb.isChecked());
	params.putBoolean(oFF.VdStandalone.STORY_EDITABLE, this.m_storyEditableCb.isChecked());
	params.putBoolean(oFF.VdStandalone.READ_ONLY, this.m_readonlyCb.isChecked());
	params.putBoolean(oFF.VdStandalone.DISABLE_EXIT, this.m_disableExitVariables);
	params.putBoolean(oFF.VdStandalone.TOP_LEVEL_DYNAMIC_VARIABLES, !this.m_disableDynamicVariablesInStory);
	params.putBoolean(oFF.VdStandalone.BOTTOM_LEVEL_DYNAMIC_VARIABLES, !this.m_disableDynamicVariablesInWidget);
	var list = params.putNewList(oFF.VdStandalone.VARIABLE_NAMES);
	var it = variablesToDisplay.getIterator();
	while (it.hasNext())
	{
		list.addString(it.next());
	}
	oFF.XObjectExt.release(it);
	params.putString(oFF.VdStandalone.START_VALUES_FORMAT, oFF.VdValueFormat.DATA_QUERY_MODEL.getName());
	if (oFF.XStringUtils.isNotNullAndNotEmpty(this.m_storyTa.getText()))
	{
		params.put(oFF.VdStandalone.TOP_LEVEL_VALUES, oFF.JsonParserFactory.createFromSafeString(this.m_storyTa.getText()));
	}
	if (oFF.XStringUtils.isNotNullAndNotEmpty(this.m_widgetTa.getText()))
	{
		params.put(oFF.VdStandalone.BOTTOM_LEVEL_VALUES, oFF.JsonParserFactory.createFromSafeString(this.m_widgetTa.getText()));
	}
	if (oFF.notNull(anchor))
	{
		this.m_orcaFunctions = this.m_orcaToken = oFF.VdStandalone.createTokenWithParameters(application, null, params);
	}
	else
	{
		this.m_orcaFunctions = this.m_orcaDialog = oFF.VdStandalone.createDisplayWithParameters(application, null, params, this);
	}
	this.m_orcaFunctions.registerSubmitListener(this);
	var firstVarName = this.getFirstVarName(variablesToDisplay);
	if (optimized && this.m_orcaFunctions.supportsStoryFilterOptimization(firstVarName))
	{
		this.m_orcaFunctions.performStoryFilterOptimizationWorkflow(firstVarName);
	}
	else if (oFF.notNull(this.m_orcaToken))
	{
		this.m_orcaToken.buildUiOnControl(anchor);
	}
	else if (oFF.notNull(this.m_orcaDialog))
	{
		this.m_orcaDialog.open();
	}
};
oFF.Gyros.prototype.getFirstVarName = function(varNames)
{
	if (oFF.XCollectionUtils.hasElements(varNames))
	{
		var it = varNames.getIterator();
		var varName = it.next();
		oFF.XObjectExt.release(it);
		if (oFF.notNull(varName))
		{
			return varName;
		}
	}
	return this.getVariableProcessor().getInputEnabledAndNonTechnicalVariables().get(0).getName();
};
oFF.Gyros.prototype.createLinkTooltips = function()
{
	var variablesWithLink = oFF.XHashMapByString.create();
	var selectedItems2 = this.m_linkMcb.getSelectedItems();
	for (var i = 0; i < selectedItems2.size(); i++)
	{
		var varName = oFF.XStringUtils.concatenate2("varNamePlaceholder", oFF.XInteger.convertToString(i));
		var modelName = oFF.XStringUtils.concatenate2("modelNamePlaceholder", oFF.XInteger.convertToString(i));
		var tooltipLines = oFF.XCollectionUtils.singletonList(oFF.XPairOfString.create(varName, modelName));
		variablesWithLink.put(selectedItems2.get(i).getName(), tooltipLines);
	}
	var keys = this.m_linkage.getKeysAsIteratorOfString();
	while (keys.hasNext())
	{
		var nextVarName = keys.next();
		variablesWithLink.put(nextVarName, oFF.XCollectionUtils.singletonList(oFF.XPairOfString.create(nextVarName, "modelNamePlaceholder")));
	}
	return variablesWithLink;
};
oFF.Gyros.prototype.onChange = function(event)
{
	this.updateState();
};
oFF.Gyros.prototype.updateState = function()
{
	if (this.m_defaultRb.isSelected())
	{
		this.m_noneRb.setSelected(true);
		this.m_uqmCb.setChecked(false);
	}
	if (!this.m_storyRb.isSelected() && (this.m_explorerRb.isSelected() || this.m_filterRb.isSelected()))
	{
		this.m_noneRb.setSelected(true);
	}
	this.m_chartRb.setEnabled(!this.m_defaultRb.isSelected());
	this.m_tableRb.setEnabled(!this.m_defaultRb.isSelected());
	this.m_explorerRb.setEnabled(this.m_storyRb.isSelected());
	this.m_filterRb.setEnabled(this.m_storyRb.isSelected());
	this.m_linkMcb.setEnabled(!this.m_defaultRb.isSelected());
	this.m_storyTa.setEnabled(!this.m_defaultRb.isSelected());
	this.m_widgetTa.setEnabled(!this.m_defaultRb.isSelected());
	this.m_sacDataTa.setEnabled(!this.m_defaultRb.isSelected());
	this.m_uqmCb.setEnabled(!this.m_defaultRb.isSelected());
};
oFF.Gyros.prototype.getVariableProcessor = function()
{
	if (oFF.notNull(this.m_variableProcessor))
	{
		return this.m_variableProcessor;
	}
	if (this.m_options.getBooleanValue(oFF.Gyros.PROPERTY_USE_OLAP_ENV))
	{
		return this.m_queryManager.getOlapEnv().getVariableProcessor();
	}
	return this.m_queryManager;
};
oFF.Gyros.prototype.getQueryManager = function()
{
	return this.m_queryManager;
};
oFF.Gyros.prototype.setLinkage = function(linkage)
{
	this.m_linkage = linkage;
};
oFF.Gyros.prototype.onPress = function(event)
{
	var control = event.getControl();
	if (control === this.m_openBtn)
	{
		if (oFF.notNull(this.m_tokenPopover) && this.m_tokenPopover.isOpen())
		{
			this.m_tokenPopover.close();
			return;
		}
		if (this.m_filterRb.isSelected())
		{
			this.m_tokenPopover = this.getUiManager().newControl(oFF.UiType.POPOVER);
			this.m_tokenPopover.openAt(this.m_openBtn);
			this.m_tokenPopover.setWidth(oFF.UiCssLength.create("800px"));
			this.m_tokenPopover.setPadding(oFF.UiCssBoxEdges.create("8px"));
			this.m_tokenPopover.registerOnAfterClose(this);
			this.showVariablePrompt(this.m_tokenPopover, false);
		}
		else
		{
			this.showVariablePrompt(null, false);
		}
	}
	else if (control === this.m_optimizedBtn)
	{
		this.showVariablePrompt(null, true);
	}
	else if (control === this.m_optionsIcon)
	{
		this.openOptionsDialog();
	}
	else if (control === this.m_changeDsBtn)
	{
		this.openDatasourcePickerDialog();
	}
	else if (control === this.m_editToggleBtn)
	{
		oFF.XObjectExt.release(this.m_featureDialog);
		this.m_featureDialog = oFF.UiFeatureToggleDialog.createFeatureDialog(this.getSession(), this.getUiManager(), this);
		this.m_featureDialog.open();
	}
	else if (control === this.m_mobileValueHelpBtn)
	{
		this.createMobileValueHelpMenu(control);
	}
	else if (control.getUiType() === oFF.UiType.MENU_ITEM && oFF.XString.isEqual(control.getParent().getName(), "gyrosMobileValueHelpMenu"))
	{
		this.handleMobileValueHelpMenuItemPress(control);
	}
};
oFF.Gyros.prototype.onAfterClose = function(event)
{
	this.m_tokenPopover = oFF.XObjectExt.release(this.m_tokenPopover);
	if (oFF.notNull(this.m_vdToken))
	{
		this.m_vdToken.attemptSubmit();
	}
	else if (oFF.notNull(this.m_orcaToken))
	{
		this.m_orcaToken.attemptSubmit();
	}
};
oFF.Gyros.prototype.openOptionsDialog = function()
{
	if (oFF.isNull(this.m_optionsPopover))
	{
		this.m_optionsPopover = this.getUiManager().newControl(oFF.UiType.POPOVER);
		this.m_optionsPopover.setWidth(oFF.UiCssLength.create("320px"));
		this.m_optionsPopover.setPadding(oFF.UiCssBoxEdges.create("15px"));
		this.m_options.buildUi(oFF.UiGenesis.create(this.m_optionsPopover, oFF.UiItemPosition.CONTENT, oFF.UiOperation.SET, 0, 0));
	}
	this.m_optionsPopover.openAt(this.m_optionsIcon);
};
oFF.Gyros.prototype.openDatasourcePickerDialog = function()
{
	var appStoreDlgManifest = oFF.ProgramRegistration.getProgramManifest(oFF.AuDatasourcePicker.DEFAULT_PROGRAM_NAME);
	var appStoreDlgStartCfg = oFF.ProgramStartCfg.create(this.getProcess(), appStoreDlgManifest.getName(), null, null);
	var tmpArgs = appStoreDlgStartCfg.getArguments();
	tmpArgs.putXObject(oFF.AuDatasourcePicker.PARAM_APPLICATION, this.getApplication());
	tmpArgs.putString(oFF.AuDatasourcePicker.PARAM_SYSTEM, this.m_system);
	tmpArgs.putXObject(oFF.AuDatasourcePicker.PARAM_LISTENER, this);
	appStoreDlgStartCfg.setParentProcess(this.getProcess());
	appStoreDlgStartCfg.setIsCreatingChildProcess(true);
	appStoreDlgStartCfg.processExecution(oFF.SyncType.NON_BLOCKING, null, null);
};
oFF.Gyros.prototype.onSelectionChange = function(event)
{
	this.m_linkage = oFF.XHashMapByString.create();
};
oFF.Gyros.prototype.onBeforeSubmit = function(values, valuesJson) {};
oFF.Gyros.prototype.onAfterSubmit = function(success, extResult, values, valuesJson)
{
	var varProcessor = this.getVariableProcessor();
	var allValues = values;
	if (this.m_options.getBooleanValue(oFF.Gyros.PROPERTY_FUNCTIONAL_VALUES))
	{
		allValues = oFF.VdImportExport.getValuesFromProcessor(varProcessor);
	}
	var _export = oFF.VdOrcaValueParser.exportVariables(varProcessor, allValues, this.m_linkage.getKeysAsReadOnlyListOfString());
	if (oFF.notNull(_export))
	{
		if (oFF.notNull(this.m_orcaFunctions) && this.m_orcaFunctions.isWidgetSelected())
		{
			this.m_widgetTa.setText(oFF.PrUtils.serialize(_export, true, true, 4));
		}
		else
		{
			this.m_storyTa.setText(oFF.PrUtils.serialize(_export, true, true, 4));
		}
	}
};
oFF.Gyros.prototype.onOk = function()
{
	if (oFF.notNull(this.m_orcaFunctions))
	{
		this.m_forcePrompt = this.m_orcaFunctions.isForcePrompt();
		this.m_disableExitVariables = this.m_orcaFunctions.isDisablingExitVariables();
		if (this.m_chartRb.isSelected() || this.m_tableRb.isSelected() || this.m_explorerRb.isSelected())
		{
			this.m_disableDynamicVariablesInWidget = this.m_orcaFunctions.isDisablingDynamicVariables();
		}
		else
		{
			this.m_disableDynamicVariablesInStory = this.m_orcaFunctions.isDisablingDynamicVariables();
		}
	}
	if (oFF.notNull(this.m_queryManager) && this.m_queryManager.supportsDirectVariableTransfer())
	{
		this.m_queryManager.processQueryExecution(oFF.SyncType.BLOCKING, null, null);
	}
};
oFF.Gyros.prototype.onCancel = function() {};
oFF.Gyros.prototype.onDatasourceSelected = function(dataSource)
{
	if (oFF.isNull(dataSource))
	{
		return;
	}
	this.m_system = dataSource.getSystemName();
	this.m_datasource = dataSource.getFullQualifiedName();
	this.m_planningSequence = null;
	oFF.XObjectExt.release(this.m_queryManager);
	oFF.XObjectExt.release(this.m_variableProcessor);
	this.setupDatasource();
	this.setupUi();
};
oFF.Gyros.prototype.onFeatureToggleDialogClose = function(selectedToggles)
{
	if (oFF.isNull(selectedToggles))
	{
		return;
	}
	var session = this.getSession();
	session.clearAllFeatureToggles();
	session.activateFeatureToggleSet(selectedToggles);
	oFF.XObjectExt.release(this.m_queryManager);
	oFF.XObjectExt.release(this.m_variableProcessor);
	this.setupDatasource();
	this.setupUi();
};
oFF.Gyros.prototype.getScenario = function()
{
	if (this.m_storyRb.isSelected())
	{
		return oFF.VdOrcaScenario.STORY;
	}
	if (this.m_appRb.isSelected())
	{
		return oFF.VdOrcaScenario.ANALYTIC_APP;
	}
	if (this.m_brRb.isSelected())
	{
		return oFF.VdOrcaScenario.BOARD_ROOM;
	}
	return null;
};
oFF.Gyros.prototype.getLevel = function()
{
	if (this.m_tableRb.isSelected())
	{
		return oFF.VdOrcaLevel.TABLE;
	}
	if (this.m_chartRb.isSelected())
	{
		return oFF.VdOrcaLevel.CHART;
	}
	if (this.m_explorerRb.isSelected())
	{
		return oFF.VdOrcaLevel.EXPLORER;
	}
	if (this.m_filterRb.isSelected())
	{
		return oFF.VdOrcaLevel.FILTER;
	}
	return oFF.VdOrcaLevel.DEFAULT;
};
oFF.Gyros.prototype.isBw = function()
{
	if (this.m_isPlanningSequence)
	{
		return true;
	}
	return oFF.notNull(this.m_queryManager) && this.m_queryManager.getSystemType().isTypeOf(oFF.SystemType.ABAP);
};
oFF.Gyros.prototype.createMobileValueHelpMenu = function(mobileValueHelpBtn)
{
	var mobileValueHelpMenu = this.m_genesis.newControl(oFF.UiType.MENU);
	mobileValueHelpMenu.setName("gyrosMobileValueHelpMenu");
	mobileValueHelpMenu.addNewItem().setName("gyrosMobileValueHelpCalendarSingle").setText("Calendar Single").setIcon("value-help").registerOnPress(this);
	mobileValueHelpMenu.addNewItem().setName("gyrosMobileValueHelpCalendarRange").setText("Calendar Range").setIcon("value-help").registerOnPress(this);
	mobileValueHelpMenu.addNewItem().setName("gyrosMobileValueHelpOperatorList").setText("Operator List").setIcon("value-help").registerOnPress(this);
	mobileValueHelpMenu.addNewItem().setName("gyrosMobileValueHelpSimpleList").setText("Simple List").setIcon("value-help").registerOnPress(this);
	mobileValueHelpMenu.addNewItem().setName("gyrosMobileValueHelpMemberSelector").setText("Member Selector").setIcon("value-help").registerOnPress(this);
	mobileValueHelpMenu.addNewItem().setName("gyrosMobileValueHelpOperatorWorkflow").setText("Operator Workflow").setIcon("value-help").registerOnPress(this);
	mobileValueHelpMenu.openAt(mobileValueHelpBtn);
};
oFF.Gyros.prototype.getFirstVarFromQueryManager = function()
{
	if (this.getQueryManager() !== null)
	{
		if (this.getQueryManager().hasVariables())
		{
			return this.getQueryManager().getVariables().get(1);
		}
		this.getGenesis().showWarningToast("The specified data source has no variables!");
		return null;
	}
	this.getGenesis().showErrorToast("No data source specified!");
	return null;
};
oFF.Gyros.prototype.handleMobileValueHelpMenuItemPress = function(menuItem)
{
	var firstVar = null;
	switch (menuItem.getName())
	{
		case "gyrosMobileValueHelpCalendarSingle":
			oFF.VdVhMobileTester.testCalendarSingle(this.getApplication());
			break;

		case "gyrosMobileValueHelpCalendarRange":
			oFF.VdVhMobileTester.testCalendarRange(this.getApplication());
			break;

		case "gyrosMobileValueHelpOperatorList":
			oFF.VdVhMobileTester.testOperatorList(this.getApplication());
			break;

		case "gyrosMobileValueHelpSimpleList":
			oFF.VdVhMobileTester.testSimpleList(this.getApplication());
			break;

		case "gyrosMobileValueHelpMemberSelector":
			firstVar = this.getFirstVarFromQueryManager();
			if (oFF.notNull(firstVar))
			{
				oFF.VdVhMobileTester.testMemberSelector(this.getApplication(), firstVar);
			}
			break;

		case "gyrosMobileValueHelpOperatorWorkflow":
			firstVar = this.getFirstVarFromQueryManager();
			if (oFF.notNull(firstVar))
			{
				oFF.VdVhMobileTester.testOperatorWorkflow(this.getApplication(), firstVar);
			}
			break;

		default:
	}
};

oFF.QvKratos = function() {};
oFF.QvKratos.prototype = new oFF.DfUiProgram();
oFF.QvKratos.prototype._ff_c = "QvKratos";

oFF.QvKratos.DEFAULT_PROGRAM_NAME = "Kratos";
oFF.QvKratos.createRunner = function()
{
	var runner = oFF.KernelBoot.createByName(oFF.QvKratos.DEFAULT_PROGRAM_NAME);
	return runner;
};
oFF.QvKratos.createNewMetis = function()
{
	var prg = new oFF.QvKratos();
	prg.setup();
	return prg;
};
oFF.QvKratos.prototype.m_queryName = null;
oFF.QvKratos.prototype.m_queryManager = null;
oFF.QvKratos.prototype.newProgram = function()
{
	var prg = new oFF.QvKratos();
	prg.setup();
	return prg;
};
oFF.QvKratos.prototype.doSetupProgramMetadata = function(metadata)
{
	oFF.DfUiProgram.prototype.doSetupProgramMetadata.call( this , metadata);
};
oFF.QvKratos.prototype.evalArguments = function()
{
	oFF.DfUiProgram.prototype.evalArguments.call( this );
};
oFF.QvKratos.prototype.initializeProgram = function()
{
	oFF.DfUiProgram.prototype.initializeProgram.call( this );
	this.setupInternal();
};
oFF.QvKratos.prototype.releaseObject = function()
{
	oFF.DfUiProgram.prototype.releaseObject.call( this );
	this.m_queryManager = oFF.XObjectExt.release(this.m_queryManager);
};
oFF.QvKratos.prototype.getLogSeverity = function()
{
	return oFF.Severity.PRINT;
};
oFF.QvKratos.prototype.isShowMenuBar = function()
{
	return true;
};
oFF.QvKratos.prototype.getDefaultContainerSize = function()
{
	return oFF.UiSize.createByCss("60vw", "60vh");
};
oFF.QvKratos.prototype.getMenuBarDisplayName = function()
{
	return oFF.QvKratos.DEFAULT_PROGRAM_NAME;
};
oFF.QvKratos.prototype.setupInternal = function() {};
oFF.QvKratos.prototype.buildUi = function(genesis)
{
	oFF.DfUiProgram.prototype.buildUi.call( this , genesis);
	var startLayout = genesis.newControl(oFF.UiType.FLEX_LAYOUT);
	startLayout.setName("sleMetisMainLayout");
	startLayout.useMaxSpace();
	startLayout.setDirection(oFF.UiFlexDirection.ROW);
	startLayout.setAlignItems(oFF.UiFlexAlignItems.CENTER);
	startLayout.setJustifyContent(oFF.UiFlexJustifyContent.CENTER);
	startLayout.setWrap(oFF.UiFlexWrap.NO_WRAP);
	startLayout.setBackgroundColor(oFF.UiColor.create("#f9fafc"));
	var selectQueryBtn = startLayout.addNewItemOfType(oFF.UiType.BUTTON);
	selectQueryBtn.setName("selectQueryBtn");
	selectQueryBtn.setText("Select Query");
	selectQueryBtn.registerOnPress(this);
	genesis.setRoot(startLayout);
	this.addMenuBarButton("qvKratosToolbarQueryBtn", null, "Query", null, this);
	this.addMenuBarButton("qvKratosToolbarVariableDialogBtn", null, "Variable Dialog", null, this).setEnabled(false);
};
oFF.QvKratos.prototype.showQuerySelectionDialog = function()
{
	oFF.OqdController.create(this.getApplication(), this.getUiManager(), this).open();
};
oFF.QvKratos.prototype.showVariableDialogForcurrentQuery = function()
{
	var entryPoint = oFF.VdUqmEntryPoint.createEntryPoint(this.m_queryName, this.m_queryManager.getOlapEnv().getVariableProcessor(), this);
	entryPoint.open();
};
oFF.QvKratos.prototype.createQueryManager = function(systemName, queryName, fullQueryName)
{
	this.showLoadingIndicator();
	this.m_queryName = queryName;
	var qc = oFF.QueryServiceConfig.createWithDataSourceName(this.getApplication(), systemName, fullQueryName);
	qc.processQueryManagerCreation(oFF.SyncType.NON_BLOCKING, this, null);
};
oFF.QvKratos.prototype.createQueryUi = function()
{
	if (oFF.isNull(this.m_queryManager))
	{
		this.getGenesis().showErrorToast("Missing Query Manager! Something went wrong!");
		return;
	}
	var toolBarBtn = this.getMenuBar().getItemByName("qvKratosToolbarVariableDialogBtn");
	if (this.m_queryManager.getQueryModel().hasVariables())
	{
		toolBarBtn.setEnabled(true);
	}
	else
	{
		toolBarBtn.setEnabled(false);
	}
	var mainTabBar = this.m_genesis.newControl(oFF.UiType.ICON_TAB_BAR);
	mainTabBar.setName("mainTabBar");
	this.createSheetDefinitionTab(mainTabBar);
	this.createVariablesTab(mainTabBar);
	this.m_genesis.setRoot(mainTabBar);
};
oFF.QvKratos.prototype.showLoadingIndicator = function()
{
	this.m_genesis.clearUi();
	var toolBarBtn = this.getMenuBar().getItemByName("qvKratosToolbarVariableDialogBtn");
	toolBarBtn.setEnabled(false);
	var activityIndicator = this.m_genesis.newControl(oFF.UiType.ACTIVITY_INDICATOR);
	activityIndicator.useMaxSpace();
	this.m_genesis.setRoot(activityIndicator);
};
oFF.QvKratos.prototype.addNewTabLayout = function(tabStrip, text, icon, name)
{
	var newTab = tabStrip.addNewItem();
	newTab.setName(name);
	newTab.setText(text);
	newTab.setIcon(icon);
	var tabLayout = newTab.setNewContent(oFF.UiType.FLEX_LAYOUT);
	tabLayout.setDirection(oFF.UiFlexDirection.ROW);
	return tabLayout;
};
oFF.QvKratos.prototype.addNewListLayout = function(layout, title, name)
{
	var tmpVerticalLayout = layout.addNewItemOfType(oFF.UiType.VERTICAL_LAYOUT);
	var listTitle = tmpVerticalLayout.addNewItemOfType(oFF.UiType.LABEL);
	listTitle.setText(title);
	var listScrollContainer = tmpVerticalLayout.addNewItemOfType(oFF.UiType.SCROLL_CONTAINER);
	var tmpList = listScrollContainer.setNewContent(oFF.UiType.LIST);
	tmpList.setName(name);
	tmpList.setSelectionMode(oFF.UiSelectionMode.NONE);
	return tmpList;
};
oFF.QvKratos.prototype.createSheetDefinitionTab = function(tabBar)
{
	var sheetDefinitionLayout = this.addNewTabLayout(tabBar, "Sheet Definition", "document-text", "sheetDefinitionTab");
	var columnsList = this.addNewListLayout(sheetDefinitionLayout, "Columns", "columnsList");
	var rowsList = this.addNewListLayout(sheetDefinitionLayout, "Rows", "rowsList");
	var freeList = this.addNewListLayout(sheetDefinitionLayout, "Free", "freeList");
	var columnsAxis = this.m_queryManager.getQueryModel().getColumnsAxis();
	var colAxisDimList = columnsAxis.getDimensions();
	var colAxisDimIterator = colAxisDimList.getIterator();
	while (colAxisDimIterator.hasNext())
	{
		var tmpColDim = colAxisDimIterator.next();
		var colDimListItem = columnsList.addNewItem();
		colDimListItem.setText(tmpColDim.getText());
		colDimListItem.setDescription(tmpColDim.getName());
	}
	var rowsAxis = this.m_queryManager.getQueryModel().getRowsAxis();
	var rowAxisDimList = rowsAxis.getDimensions();
	var rowAxisDimIterator = rowAxisDimList.getIterator();
	while (rowAxisDimIterator.hasNext())
	{
		var tmpRowDim = rowAxisDimIterator.next();
		var rowDimListItem = rowsList.addNewItem();
		rowDimListItem.setText(tmpRowDim.getText());
		rowDimListItem.setDescription(tmpRowDim.getName());
	}
	var freeAxis = this.m_queryManager.getQueryModel().getFreeAxis();
	var freeAxisDimList = freeAxis.getDimensions();
	var freeAxisDimIterator = freeAxisDimList.getIterator();
	while (freeAxisDimIterator.hasNext())
	{
		var tmpFreeDim = freeAxisDimIterator.next();
		var freeDimListItem = freeList.addNewItem();
		freeDimListItem.setText(tmpFreeDim.getText());
		freeDimListItem.setDescription(tmpFreeDim.getName());
	}
};
oFF.QvKratos.prototype.createVariablesTab = function(tabBar)
{
	var variablesLayout = this.addNewTabLayout(tabBar, "Variables", "request", "variablesTab");
	var variablesList = this.addNewListLayout(variablesLayout, "Variables", "variablesList");
	var varList = this.m_queryManager.getQueryModel().getVariables();
	var varIterator = varList.getIterator();
	while (varIterator.hasNext())
	{
		var tmpVariable = varIterator.next();
		var varListItem = variablesList.addNewItem();
		varListItem.setText(tmpVariable.getText());
		varListItem.setDescription(tmpVariable.getVariableType().getName());
	}
};
oFF.QvKratos.prototype.onPress = function(event)
{
	oFF.DfUiProgram.prototype.onPress.call( this , event);
	var control = event.getControl();
	var controlParent = control.getParent();
	if (oFF.notNull(controlParent) && controlParent.getUiType() === oFF.UiType.TOOLBAR)
	{
		switch (event.getControl().getName())
		{
			case "qvKratosToolbarQueryBtn":
				this.showQuerySelectionDialog();
				break;

			case "qvKratosToolbarVariableDialogBtn":
				this.showVariableDialogForcurrentQuery();
				break;

			default:
		}
	}
	if (control.getUiType() === oFF.UiType.BUTTON && oFF.XString.isEqual(control.getName(), "selectQueryBtn"))
	{
		this.showQuerySelectionDialog();
	}
};
oFF.QvKratos.prototype.onQuerySelectCancel = function() {};
oFF.QvKratos.prototype.onQuerySelect = function(systemName, queryName, fullQueryName)
{
	this.createQueryManager(systemName, queryName, fullQueryName);
};
oFF.QvKratos.prototype.onQueryManagerCreated = function(extResult, queryManager, customIdentifier)
{
	if (extResult.isValid())
	{
		this.m_queryManager = extResult.getData();
		this.createQueryUi();
	}
	if (extResult.hasErrors())
	{
		throw oFF.XException.createRuntimeException(extResult.getSummary());
	}
};
oFF.QvKratos.prototype.onOk = function() {};
oFF.QvKratos.prototype.onCancel = function() {};

oFF.StdAidos = function() {};
oFF.StdAidos.prototype = new oFF.DfUiProgram();
oFF.StdAidos.prototype._ff_c = "StdAidos";

oFF.StdAidos.DEFAULT_PROGRAM_NAME = "Aidos";
oFF.StdAidos.AIDOS_DEFAULT_QUERY_NAME_KEY = "aidos_defaultQueryName";
oFF.StdAidos.AIDOS_DEFAULT_SYSTEM_NAME_KEY = "aidos_defaultSystemName";
oFF.StdAidos.AIDOS_DEFAULT_FULL_QUERY_NAME_KEY = "aidos_defaultFullQueryName";
oFF.StdAidos.createRunner = function()
{
	var runner = oFF.KernelBoot.createByName(oFF.StdAidos.DEFAULT_PROGRAM_NAME);
	return runner;
};
oFF.StdAidos.createNewMetis = function()
{
	var prg = new oFF.StdAidos();
	prg.setup();
	return prg;
};
oFF.StdAidos.prototype.m_sacTable = null;
oFF.StdAidos.prototype.m_dataSourceNameLbl = null;
oFF.StdAidos.prototype.m_queryName = null;
oFF.StdAidos.prototype.m_systemName = null;
oFF.StdAidos.prototype.m_fullQueryName = null;
oFF.StdAidos.prototype.newProgram = function()
{
	var prg = new oFF.StdAidos();
	prg.setup();
	return prg;
};
oFF.StdAidos.prototype.doSetupProgramMetadata = function(metadata)
{
	oFF.DfUiProgram.prototype.doSetupProgramMetadata.call( this , metadata);
};
oFF.StdAidos.prototype.evalArguments = function()
{
	oFF.DfUiProgram.prototype.evalArguments.call( this );
};
oFF.StdAidos.prototype.initializeProgram = function()
{
	oFF.DfUiProgram.prototype.initializeProgram.call( this );
	this.setupInternal();
};
oFF.StdAidos.prototype.releaseObject = function()
{
	this.m_sacTable = oFF.XObjectExt.release(this.m_sacTable);
	oFF.DfUiProgram.prototype.releaseObject.call( this );
};
oFF.StdAidos.prototype.getLogSeverity = function()
{
	return oFF.Severity.PRINT;
};
oFF.StdAidos.prototype.isShowMenuBar = function()
{
	return true;
};
oFF.StdAidos.prototype.getDefaultContainerSize = function()
{
	return oFF.UiSize.createByCss("75vw", "60vh");
};
oFF.StdAidos.prototype.getMenuBarDisplayName = function()
{
	return oFF.StdAidos.DEFAULT_PROGRAM_NAME;
};
oFF.StdAidos.prototype.setupInternal = function()
{
	this.m_queryName = this.getApplication().getUserManager().getUserSettings().getStringByKeyExt(oFF.StdAidos.AIDOS_DEFAULT_QUERY_NAME_KEY, "");
	this.m_systemName = this.getApplication().getUserManager().getUserSettings().getStringByKeyExt(oFF.StdAidos.AIDOS_DEFAULT_SYSTEM_NAME_KEY, "");
	this.m_fullQueryName = this.getApplication().getUserManager().getUserSettings().getStringByKeyExt(oFF.StdAidos.AIDOS_DEFAULT_FULL_QUERY_NAME_KEY, "");
};
oFF.StdAidos.prototype.buildUi = function(genesis)
{
	oFF.DfUiProgram.prototype.buildUi.call( this , genesis);
	var mainLayout = genesis.newControl(oFF.UiType.FLEX_LAYOUT);
	mainLayout.setName("stGridDemoMainLayout");
	mainLayout.useMaxSpace();
	mainLayout.setDirection(oFF.UiFlexDirection.COLUMN);
	mainLayout.setAlignItems(oFF.UiFlexAlignItems.CENTER);
	mainLayout.setJustifyContent(oFF.UiFlexJustifyContent.CENTER);
	mainLayout.setWrap(oFF.UiFlexWrap.NO_WRAP);
	mainLayout.setBackgroundColor(oFF.UiColor.create("#f9fafc"));
	var titleSection = mainLayout.addNewItemOfType(oFF.UiType.FLEX_LAYOUT);
	titleSection.setName("stGridDemoMainLayout");
	titleSection.setWidth(oFF.UiCssLength.create("100%"));
	titleSection.setHeight(oFF.UiCssLength.create("42px"));
	titleSection.setFlex("0 0 42px");
	titleSection.setDirection(oFF.UiFlexDirection.ROW);
	titleSection.setAlignItems(oFF.UiFlexAlignItems.CENTER);
	titleSection.setJustifyContent(oFF.UiFlexJustifyContent.CENTER);
	titleSection.setWrap(oFF.UiFlexWrap.NO_WRAP);
	var dataSourceLbl = titleSection.addNewItemOfType(oFF.UiType.LABEL);
	dataSourceLbl.setName("dataSourceLabel");
	dataSourceLbl.setText("Data source: ");
	dataSourceLbl.setFontSize(oFF.UiCssLength.create("18px"));
	titleSection.addNewItemOfType(oFF.UiType.SPACER).setWidth(oFF.UiCssLength.create("5px"));
	this.m_dataSourceNameLbl = titleSection.addNewItemOfType(oFF.UiType.LABEL);
	this.m_dataSourceNameLbl.setName("dataSourceNameLabel");
	this.m_dataSourceNameLbl.setText("table mock data");
	this.m_dataSourceNameLbl.setFontWeight(oFF.UiFontWeight.BOLD);
	this.m_dataSourceNameLbl.setFontSize(oFF.UiCssLength.create("18px"));
	this.m_sacTable = mainLayout.addNewItemOfType(oFF.UiType.SAC_TABLE_GRID);
	this.m_sacTable.setName("sacTableGrid");
	this.m_sacTable.setWidth(oFF.UiCssLength.create("100%"));
	this.m_sacTable.setHeight(oFF.UiCssLength.create("100%"));
	this.m_sacTable.registerOnClick(this);
	this.m_sacTable.registerOnContextMenu(this);
	this.m_sacTable.registerOnSelectionChange(this);
	this.m_sacTable.registerOnButtonPress(this);
	genesis.setRoot(mainLayout);
	this.addMenuBarButton("stdAidosJsonModelBtn", null, "JSON Model", "table-view", this);
	this.addMenuBarButton("stdAidosRenderQueryBtn", null, "Render Query", "media-play", this);
	this.addMenuBarButton("stdAidosDefaultQueryBtn", null, "Default Query", null, this);
	this.addMenuBarButton("stdAidosTableSizeBtn", null, "Table Size", "resize", this);
	if (oFF.XStringUtils.isNotNullAndNotEmpty(this.m_queryName) && oFF.XStringUtils.isNotNullAndNotEmpty(this.m_systemName) && oFF.XStringUtils.isNotNullAndNotEmpty(this.m_fullQueryName))
	{
		this.createQueryManager(this.m_systemName, this.m_queryName, this.m_fullQueryName);
	}
};
oFF.StdAidos.prototype.showJsonEntryDialog = function()
{
	var curText = "";
	if (this.m_sacTable.getModelJson() !== null)
	{
		curText = oFF.PrUtils.serialize(this.m_sacTable.getModelJson(), false, true, 2);
	}
	oFF.SuTextEntryDialog.createDialog(this.m_genesis, "SAC Table json", "json", curText, this).openDialog();
};
oFF.StdAidos.prototype.showQuerySelectionDialog = function()
{
	oFF.OqdController.create(this.getApplication(), this.getUiManager(), this).open();
};
oFF.StdAidos.prototype.showSacTableSize = function()
{
	var offsetHeight = this.m_sacTable.getOffsetHeight();
	var offsetWidth = this.m_sacTable.getOffsetWidth();
	var sizeStr = oFF.XStringUtils.concatenate5("Table size! ", "Height: ", oFF.XInteger.convertToString(offsetHeight), " Width: ", oFF.XInteger.convertToString(offsetWidth));
	this.getGenesis().showInfoToast(sizeStr);
};
oFF.StdAidos.prototype.showLoadingIndicator = function()
{
	this.setBusy(true);
};
oFF.StdAidos.prototype.hideLoadingIndicator = function()
{
	this.setBusy(false);
};
oFF.StdAidos.prototype.setDataSourceName = function(name)
{
	if (oFF.notNull(this.m_dataSourceNameLbl))
	{
		this.m_dataSourceNameLbl.setText(name);
	}
};
oFF.StdAidos.prototype.updateTableData = function(sourceName, modelJson)
{
	this.m_sacTable.setModelJson(modelJson);
	this.hideLoadingIndicator();
	this.setDataSourceName(sourceName);
};
oFF.StdAidos.prototype.createDefaultQueryMenu = function(queryMenuBtn)
{
	var queryToolbarMenu = this.m_genesis.newControl(oFF.UiType.MENU);
	queryToolbarMenu.setName("queryToolbarMenu");
	queryToolbarMenu.setTag("queryToolbarMenu");
	queryToolbarMenu.addNewItem().setName("queryToolbarMenuSetAsDefault").setText("Set current query as default").setIcon("favorite").registerOnPress(this).setEnabled(oFF.XStringUtils.isNotNullAndNotEmpty(this.m_fullQueryName));
	queryToolbarMenu.addNewItem().setName("queryToolbarMenuClearDefault").setText("Clear default query").setIcon("unfavorite").registerOnPress(this);
	queryToolbarMenu.openAt(queryMenuBtn);
};
oFF.StdAidos.prototype.setCurrentQueryAsDefault = function()
{
	this.getApplication().getUserManager().getUserSettings().putString(oFF.StdAidos.AIDOS_DEFAULT_QUERY_NAME_KEY, this.m_queryName);
	this.getApplication().getUserManager().getUserSettings().putString(oFF.StdAidos.AIDOS_DEFAULT_SYSTEM_NAME_KEY, this.m_systemName);
	this.getApplication().getUserManager().getUserSettings().putString(oFF.StdAidos.AIDOS_DEFAULT_FULL_QUERY_NAME_KEY, this.m_fullQueryName);
	this.getGenesis().showInfoToast(oFF.XStringUtils.concatenate3("Query: ", this.m_queryName, " saved as default!"));
};
oFF.StdAidos.prototype.clearDefaultQuery = function()
{
	this.getApplication().getUserManager().getUserSettings().removeKey(oFF.StdAidos.AIDOS_DEFAULT_QUERY_NAME_KEY);
	this.getApplication().getUserManager().getUserSettings().removeKey(oFF.StdAidos.AIDOS_DEFAULT_SYSTEM_NAME_KEY);
	this.getApplication().getUserManager().getUserSettings().removeKey(oFF.StdAidos.AIDOS_DEFAULT_FULL_QUERY_NAME_KEY);
	this.getGenesis().showInfoToast("Cleared default query!");
};
oFF.StdAidos.prototype.updateSacTableWithJson = function(jsonStr)
{
	if (oFF.XStringUtils.isNotNullAndNotEmpty(jsonStr))
	{
		this.showLoadingIndicator();
		var parser = oFF.JsonParserFactory.newInstance();
		var proxyDocument = parser.parse(jsonStr);
		this.updateTableData("JSON", proxyDocument);
		this.m_systemName = "";
		this.m_queryName = "";
		this.m_fullQueryName = "";
	}
};
oFF.StdAidos.prototype.createQueryManager = function(systemName, queryName, fullQueryName)
{
	this.showLoadingIndicator();
	this.m_systemName = systemName;
	this.m_queryName = queryName;
	this.m_fullQueryName = fullQueryName;
	var qc = oFF.QueryServiceConfig.createWithDataSourceName(this.getApplication(), systemName, fullQueryName);
	qc.processQueryManagerCreation(oFF.SyncType.NON_BLOCKING, this, null);
};
oFF.StdAidos.prototype.updateSacTableWithQuery = function(queryManager)
{
	var resultSet = this.getCursorResultSet(queryManager);
	var modelJson = oFF.GridRendererFactory.createRenderer(oFF.ProtocolBindingType.SAC_TABLE_GRID).render(resultSet);
	this.updateTableData(oFF.XStringUtils.concatenate3(this.m_systemName, ": ", this.m_queryName), modelJson);
};
oFF.StdAidos.prototype.getCursorResultSet = function(queryManager)
{
	var resultSet = null;
	var resultSetContainer = queryManager.getActiveResultSetContainer();
	if (oFF.isNull(resultSetContainer))
	{
		this.queryLoadingError("ResultSetContainer null");
	}
	else if (resultSetContainer.hasErrors())
	{
		this.queryLoadingError(resultSetContainer.getSummary());
	}
	else
	{
		resultSet = resultSetContainer.getCursorResultSet();
		if (oFF.isNull(resultSet))
		{
			if (resultSetContainer.hasErrors())
			{
				this.queryLoadingError(resultSetContainer.getSummary());
			}
			else
			{
				this.queryLoadingError("ResultSet null");
			}
		}
		else if (resultSet.hasErrors())
		{
			this.queryLoadingError(resultSet.getSummary());
		}
	}
	return resultSet;
};
oFF.StdAidos.prototype.queryLoadingError = function(message)
{
	this.hideLoadingIndicator();
	this.setDataSourceName("Error");
	this.getGenesis().showErrorToast(message);
	this.m_systemName = "";
	this.m_queryName = "";
	this.m_fullQueryName = "";
	throw oFF.XException.createRuntimeException(message);
};
oFF.StdAidos.prototype.onPress = function(event)
{
	oFF.DfUiProgram.prototype.onPress.call( this , event);
	var control = event.getControl();
	var controlParent = control.getParent();
	if (oFF.notNull(controlParent) && controlParent.getUiType() === oFF.UiType.TOOLBAR && oFF.XString.isEqual(control.getName(), "stdAidosDefaultQueryBtn"))
	{
		this.createDefaultQueryMenu(control);
	}
	if (oFF.notNull(controlParent) && controlParent.getUiType() === oFF.UiType.TOOLBAR)
	{
		switch (event.getControl().getName())
		{
			case "stdAidosJsonModelBtn":
				this.showJsonEntryDialog();
				break;

			case "stdAidosRenderQueryBtn":
				this.showQuerySelectionDialog();
				break;

			case "stdAidosTableSizeBtn":
				this.showSacTableSize();
				break;

			default:
		}
	}
	if (oFF.notNull(controlParent) && controlParent.getUiType() === oFF.UiType.MENU)
	{
		switch (control.getName())
		{
			case "queryToolbarMenuSetAsDefault":
				this.setCurrentQueryAsDefault();
				break;

			case "queryToolbarMenuClearDefault":
				this.clearDefaultQuery();
				break;

			default:
		}
	}
};
oFF.StdAidos.prototype.onTextEntryCancel = function() {};
oFF.StdAidos.prototype.onTextEntryFinished = function(text)
{
	this.updateSacTableWithJson(text);
};
oFF.StdAidos.prototype.onQuerySelectCancel = function() {};
oFF.StdAidos.prototype.onQuerySelect = function(systemName, queryName, fullQueryName)
{
	this.createQueryManager(systemName, queryName, fullQueryName);
};
oFF.StdAidos.prototype.onQueryManagerCreated = function(extResult, queryManager, customIdentifier)
{
	if (extResult.isValid())
	{
		var tmpQueryManager = extResult.getData();
		this.updateSacTableWithQuery(tmpQueryManager);
	}
	if (extResult.hasErrors())
	{
		this.queryLoadingError(extResult.getSummary());
	}
};
oFF.StdAidos.prototype.onClick = function(event) {};
oFF.StdAidos.prototype.onContextMenu = function(event)
{
	var clickX = event.getParameters().getIntegerByKeyExt(oFF.UiControlEvent.PARAM_CLICK_X, 0);
	var clickY = event.getParameters().getIntegerByKeyExt(oFF.UiControlEvent.PARAM_CLICK_Y, 0);
	var tmpMenu = this.getGenesis().newControl(oFF.UiType.MENU);
	var tmpMenuItem = tmpMenu.addNewItem();
	tmpMenuItem.setText("Test Cell action!");
	tmpMenu.openAtPosition(clickX, clickY);
};
oFF.StdAidos.prototype.onSelectionChange = function(event)
{
	var selectionArea = event.getParameters().getStringByKeyExt(oFF.UiControlEvent.PARAM_SELECTION_AREA, "");
	var parser = oFF.JsonParserFactory.newInstance();
	var selectionAreaJson = parser.parse(selectionArea);
	if (oFF.notNull(selectionAreaJson) && selectionAreaJson.isStructure())
	{
		var tmpJson = selectionAreaJson;
		var startCol = tmpJson.getIntegerByKey("startCol");
		this.getGenesis().showWarningToast(oFF.XInteger.convertToString(startCol));
	}
};
oFF.StdAidos.prototype.onButtonPress = function(event)
{
	var pressedButtonName = event.getParameters().getStringByKeyExt(oFF.UiControlEvent.PARAM_PRESSED_BUTTON_TYPE, null);
	var pressedButtonType = oFF.UiPressedButtonType.lookup(pressedButtonName);
	if (oFF.notNull(pressedButtonType) && pressedButtonType === oFF.UiPressedButtonType.DRILL)
	{
		this.getGenesis().showInfoToast("Drill icon clicked!");
	}
};

oFF.Spreadsheet = function() {};
oFF.Spreadsheet.prototype = new oFF.DfUiProgram();
oFF.Spreadsheet.prototype._ff_c = "Spreadsheet";

oFF.Spreadsheet.prototype.m_fileName = null;
oFF.Spreadsheet.prototype.newProgram = function()
{
	var newObj = new oFF.Spreadsheet();
	newObj.setup();
	return newObj;
};
oFF.Spreadsheet.prototype.doSetupProgramMetadata = function(metadata)
{
	oFF.DfUiProgram.prototype.doSetupProgramMetadata.call( this , metadata);
	metadata.addParameter(oFF.DfProgram.PARAM_FILE, "The file");
};
oFF.Spreadsheet.prototype.evalArguments = function()
{
	oFF.DfUiProgram.prototype.evalArguments.call( this );
	this.m_fileName = this.getArgumentStructure().getStringByKey(oFF.DfProgram.PARAM_FILE);
};
oFF.Spreadsheet.prototype.buildUi = function(genesis)
{
	oFF.DfUiProgram.prototype.buildUi.call( this , genesis);
	var doc = oFF.ShDocument.create();
	if (oFF.notNull(this.m_fileName))
	{
		var file = oFF.XFile.create(this.getSession(), this.m_fileName);
		var content = file.load();
		var jsonContent = content.getJsonContent().asStructure();
		var cellList = jsonContent.getListByKey("Cells");
		for (var i = 0; i < cellList.size(); i++)
		{
			var cell = cellList.getStructureAt(i);
			var x = cell.getIntegerByKey("x");
			var y = cell.getIntegerByKey("y");
			var docCell = doc.newCell(x, y);
			var theType = cell.getStringByKey("type");
			if (oFF.XString.isEqual(theType, "text"))
			{
				docCell.setText(cell.getStringByKey("text"));
			}
			else if (oFF.XString.isEqual(theType, "double"))
			{
				docCell.setDouble(cell.getDoubleByKey("dvalue"));
			}
			else if (oFF.XString.isEqual(theType, "int"))
			{
				docCell.setInteger(cell.getIntegerByKey("ivalue"));
			}
			else if (oFF.XString.isEqual(theType, "expr"))
			{
				docCell.setExpression(cell.getStringByKey("expr"));
			}
		}
	}
	else
	{
		doc.newCell(0, 0).setText("Example Grid");
		doc.newCell(0, 1).setDouble(23.71);
		doc.newCell(1, 1).setInteger(1729);
		doc.newCell(0, 2).setExpression("set('Hello world!');");
		doc.newCell(1, 2).setExpression("set(23);");
		doc.newCell(1, 3).setExpression("set(sum(A2:B3));");
	}
	doc.evaluate();
	var model = doc.toGridStructure();
	var vl = genesis.newRoot(oFF.UiType.VERTICAL_LAYOUT);
	var vizGrid = vl.addNewItemOfType(oFF.UiType.VIZ_GRID);
	vizGrid.setModelJson(model);
	vl.addNewItemOfType(oFF.UiType.BUTTON).setText("Hello");
};

oFF.ScAtlas = function() {};
oFF.ScAtlas.prototype = new oFF.DfUiProgram();
oFF.ScAtlas.prototype._ff_c = "ScAtlas";

oFF.ScAtlas.DEFAULT_PROGRAM_NAME = "Atlas";
oFF.ScAtlas.ASD_FILE_NAME_KEY = "name";
oFF.ScAtlas.ASD_FILE_SYSTEM_NAME_KEY = "systemName";
oFF.ScAtlas.ASD_FILE_SYSTEM_URL_KEY = "systemUrl";
oFF.ScAtlas.ASD_FILE_STORY_ID_KEY = "storyId";
oFF.ScAtlas.ASD_FILE_TYPE_KEY = "type";
oFF.ScAtlas.ASD_FILE_WIDGET_IDS_KEY = "widgetIds";
oFF.ScAtlas.ASD_FILE_LAYOUT_TYPE_KEY = "layoutType";
oFF.ScAtlas.ASD_FILE_CHART_TYPE_KEY = "chartType";
oFF.ScAtlas.ASD_FILE_TYPE_DASHBOARD = "dashboard";
oFF.ScAtlas.ASD_WIDGET_SEPARATOR_TOKEN = ",";
oFF.ScAtlas.createRunner = function()
{
	var runner = oFF.KernelBoot.createByName(oFF.ScAtlas.DEFAULT_PROGRAM_NAME);
	return runner;
};
oFF.ScAtlas.createNewAtlasProgram = function()
{
	var prg = new oFF.ScAtlas();
	prg.setup();
	return prg;
};
oFF.ScAtlas.prototype.m_sacUrl = null;
oFF.ScAtlas.prototype.m_layout = null;
oFF.ScAtlas.prototype.m_chartType = null;
oFF.ScAtlas.prototype.m_systemDict = null;
oFF.ScAtlas.prototype.m_mainNavigationContainer = null;
oFF.ScAtlas.prototype.m_startPage = null;
oFF.ScAtlas.prototype.m_urlInput = null;
oFF.ScAtlas.prototype.m_orcaService = null;
oFF.ScAtlas.prototype.m_file = null;
oFF.ScAtlas.prototype.m_storyFileJson = null;
oFF.ScAtlas.prototype.newProgram = function()
{
	var prg = new oFF.ScAtlas();
	prg.setup();
	return prg;
};
oFF.ScAtlas.prototype.doSetupProgramMetadata = function(metadata)
{
	oFF.DfUiProgram.prototype.doSetupProgramMetadata.call( this , metadata);
	metadata.addOption(oFF.DfProgram.PARAM_FILE, "Specify a atlas story file", "Relative URI", oFF.XValueType.STRING);
};
oFF.ScAtlas.prototype.evalArguments = function()
{
	oFF.DfUiProgram.prototype.evalArguments.call( this );
	var argStruct = this.getArgumentStructure();
	var filePathStr = argStruct.getStringByKey(oFF.DfProgram.PARAM_FILE);
	if (oFF.notNull(filePathStr))
	{
		var session = this.getSession();
		var storyFile = oFF.XFile.createExt(session, filePathStr, oFF.PathFormat.AUTO_DETECT, oFF.VarResolveMode.DOLLAR);
		if (oFF.isNull(storyFile) || storyFile.isExisting() === false)
		{
			this.log2("File does not exist: ", filePathStr);
		}
		else
		{
			this.m_file = storyFile;
		}
	}
};
oFF.ScAtlas.prototype.initializeProgram = function()
{
	oFF.DfUiProgram.prototype.initializeProgram.call( this );
	this.setupInternal();
};
oFF.ScAtlas.prototype.releaseObject = function()
{
	oFF.DfUiProgram.prototype.releaseObject.call( this );
	this.m_startPage = oFF.XObjectExt.release(this.m_startPage);
	this.m_mainNavigationContainer = oFF.XObjectExt.release(this.m_mainNavigationContainer);
	this.m_urlInput = oFF.XObjectExt.release(this.m_urlInput);
	this.m_orcaService = oFF.XObjectExt.release(this.m_orcaService);
	if (oFF.notNull(this.m_systemDict))
	{
		this.m_systemDict.clear();
		this.m_systemDict = oFF.XObjectExt.release(this.m_systemDict);
	}
	this.m_layout = null;
	this.m_chartType = null;
	this.m_file = oFF.XObjectExt.release(this.m_file);
	this.m_storyFileJson = null;
};
oFF.ScAtlas.prototype.getLogSeverity = function()
{
	return oFF.Severity.PRINT;
};
oFF.ScAtlas.prototype.isShowMenuBar = function()
{
	return true;
};
oFF.ScAtlas.prototype.getDefaultContainerSize = function()
{
	return oFF.UiSize.createByCss("60vw", "60vh");
};
oFF.ScAtlas.prototype.getMenuBarDisplayName = function()
{
	return oFF.ScAtlas.DEFAULT_PROGRAM_NAME;
};
oFF.ScAtlas.prototype.setupInternal = function()
{
	this.m_layout = oFF.OcLayoutType.CANVAS;
	this.m_chartType = oFF.OcChartType.HIGHCHARTS;
	this.m_systemDict = oFF.XHashMapOfStringByString.create();
	this.m_systemDict.put("apollo", oFF.XStringUtils.concatenate5("http:", "//TEST_Admin:Admin123Admin123:", "basic@apollo.oe", "mapi.only.sa", "p:8000?system_type=orca"));
	this.m_systemDict.put("monsun", oFF.XStringUtils.concatenate5("http:", "//TEST_firefly:Welcome1:", "basic@bw.ac", "ioem.c.eu-de-1.cloud.s", "ap:8001?system_type=orca"));
};
oFF.ScAtlas.prototype.buildUi = function(genesis)
{
	oFF.DfUiProgram.prototype.buildUi.call( this , genesis);
	this.addMenuBarButton("scAtlasToolbarStoryBtn", null, "Story", null, this).setEnabled(false);
	this.addMenuBarButton("scAtlasToolbarLogoutBtn", null, "Logout", "log", this).setEnabled(false);
	this.m_mainNavigationContainer = genesis.newControl(oFF.UiType.NAVIGATION_CONTAINER);
	this.m_mainNavigationContainer.useMaxSpace();
	this.m_mainNavigationContainer.registerOnBack(this);
	if (oFF.notNull(this.m_file))
	{
		this.openStoryFromFile(this.m_file);
	}
	else
	{
		this.createStartPage();
		this.m_urlInput.setText(this.m_systemDict.getByKey("apollo"));
		this.setOrcaUrl(this.m_systemDict.getByKey("apollo"));
	}
	genesis.setRoot(this.m_mainNavigationContainer);
};
oFF.ScAtlas.prototype.createStartPage = function()
{
	if (oFF.isNull(this.m_startPage) && oFF.notNull(this.m_mainNavigationContainer))
	{
		this.m_startPage = this.m_mainNavigationContainer.pushNewPage();
		this.m_startPage.setName("scAtlasMainContainer");
		this.m_startPage.setText("SAC Story Connector");
		this.m_startPage.setShowHeader(false);
		var startTabBar = this.m_startPage.setNewContent(oFF.UiType.ICON_TAB_BAR);
		startTabBar.useMaxSpace();
		startTabBar.setName("scAtlasStartPageTabBar");
		var tabBarItemHome = startTabBar.addNewItem();
		tabBarItemHome.setName("scAtlasHomeTab");
		tabBarItemHome.setText("Home");
		tabBarItemHome.setIcon("home");
		this.createHomeTab(tabBarItemHome);
		var tabBarItemSettings = startTabBar.addNewItem();
		tabBarItemSettings.setName("scAtlasSettingsTab");
		tabBarItemSettings.setText("Settings");
		tabBarItemSettings.setIcon("settings");
		this.createSettingsTab(tabBarItemSettings);
	}
};
oFF.ScAtlas.prototype.createHomeTab = function(tabBar)
{
	var homeFloatingLayoutVert = tabBar.setNewContent(oFF.UiType.FLEX_LAYOUT);
	homeFloatingLayoutVert.useMaxSpace();
	homeFloatingLayoutVert.setDirection(oFF.UiFlexDirection.COLUMN);
	homeFloatingLayoutVert.setAlignItems(oFF.UiFlexAlignItems.CENTER);
	homeFloatingLayoutVert.addNewItemOfType(oFF.UiType.SPACER).setWidth(oFF.UiCssLength.create("100%"));
	homeFloatingLayoutVert.addNewItemOfType(oFF.UiType.SPACER).setHeight(oFF.UiCssLength.create("10px"));
	homeFloatingLayoutVert.addNewItemOfType(oFF.UiType.LABEL).setText("Select server");
	var hostDropdown = homeFloatingLayoutVert.addNewItemOfType(oFF.UiType.DROPDOWN);
	hostDropdown.setName("hostDropdown");
	hostDropdown.setWidth(oFF.UiCssLength.createExt(350, oFF.UiCssSizeUnit.PIXEL));
	hostDropdown.setHeight(oFF.UiCssLength.createExt(200, oFF.UiCssSizeUnit.PIXEL));
	hostDropdown.registerOnSelect(this);
	var customDdItem = hostDropdown.addNewItem();
	customDdItem.setName("custom");
	customDdItem.setText("Custom");
	var systemNameIterator = this.m_systemDict.getKeysAsIteratorOfString();
	while (systemNameIterator.hasNext())
	{
		var tmpSysName = systemNameIterator.next();
		var tmpDdItem = hostDropdown.addNewItem();
		tmpDdItem.setName(tmpSysName);
		tmpDdItem.setText(tmpSysName);
	}
	hostDropdown.setSelectedName("apollo");
	homeFloatingLayoutVert.addNewItemOfType(oFF.UiType.LABEL).setText("Orca URL");
	this.m_urlInput = homeFloatingLayoutVert.addNewItemOfType(oFF.UiType.INPUT);
	this.m_urlInput.setName("scAtlasUrlInput");
	this.m_urlInput.setPlaceholder("URL");
	this.m_urlInput.setText(this.m_sacUrl);
	this.m_urlInput.setWidth(oFF.UiCssLength.createExt(350, oFF.UiCssSizeUnit.PIXEL));
	this.m_urlInput.registerOnLiveChange(this);
	this.m_urlInput.registerOnEnter(this);
	var loginBtn = homeFloatingLayoutVert.addNewItemOfType(oFF.UiType.BUTTON);
	loginBtn.setName("scAtlasLoginBtn");
	loginBtn.setText("Login");
	loginBtn.setIcon("visits");
	loginBtn.registerOnPress(this);
};
oFF.ScAtlas.prototype.createSettingsTab = function(tabBar)
{
	var settingsFloatingLayoutVert = tabBar.setNewContent(oFF.UiType.FLEX_LAYOUT);
	settingsFloatingLayoutVert.useMaxSpace();
	settingsFloatingLayoutVert.setDirection(oFF.UiFlexDirection.COLUMN);
	settingsFloatingLayoutVert.setAlignItems(oFF.UiFlexAlignItems.CENTER);
	settingsFloatingLayoutVert.addNewItemOfType(oFF.UiType.SPACER).setWidth(oFF.UiCssLength.create("100%"));
	settingsFloatingLayoutVert.addNewItemOfType(oFF.UiType.SPACER).setHeight(oFF.UiCssLength.create("10px"));
	var clearCacheBtn = settingsFloatingLayoutVert.addNewItemOfType(oFF.UiType.BUTTON);
	clearCacheBtn.setName("scAtlasClearCacheBtn");
	clearCacheBtn.setText("Clear Cache");
	clearCacheBtn.setIcon("delete");
	clearCacheBtn.setButtonType(oFF.UiButtonType.DESTRUCTIVE);
	clearCacheBtn.registerOnPress(this);
	var spacerCaccheBtn = settingsFloatingLayoutVert.addNewItemOfType(oFF.UiType.SPACER);
	spacerCaccheBtn.setName("spacerCaccheBtn");
	spacerCaccheBtn.setHeight(oFF.UiCssLength.createExt(20, oFF.UiCssSizeUnit.PIXEL));
	settingsFloatingLayoutVert.addNewItemOfType(oFF.UiType.LABEL).setText("Select layout");
	var layoutDropdown = settingsFloatingLayoutVert.addNewItemOfType(oFF.UiType.DROPDOWN);
	layoutDropdown.setName("scAtlasLayoutDropdown");
	layoutDropdown.setWidth(oFF.UiCssLength.createExt(350, oFF.UiCssSizeUnit.PIXEL));
	layoutDropdown.setHeight(oFF.UiCssLength.createExt(125, oFF.UiCssSizeUnit.PIXEL));
	layoutDropdown.registerOnSelect(this);
	layoutDropdown.addNewItem().setText("Canvas").setName(oFF.OcLayoutType.CANVAS.getName());
	layoutDropdown.addNewItem().setText("Flow").setName(oFF.OcLayoutType.FLOW.getName());
	layoutDropdown.addNewItem().setText("Flow simple (only charts and data grids)").setName(oFF.OcLayoutType.FLOW_SIMPLE.getName());
	layoutDropdown.setSelectedName(this.m_layout.getName());
	var spacerLayoutDd = settingsFloatingLayoutVert.addNewItemOfType(oFF.UiType.SPACER);
	spacerLayoutDd.setName("spacerLayoutDd");
	spacerLayoutDd.setHeight(oFF.UiCssLength.createExt(20, oFF.UiCssSizeUnit.PIXEL));
	settingsFloatingLayoutVert.addNewItemOfType(oFF.UiType.LABEL).setText("Select chart type");
	var chartDropdown = settingsFloatingLayoutVert.addNewItemOfType(oFF.UiType.DROPDOWN);
	chartDropdown.setName("scAtlasChartDropdown");
	chartDropdown.setWidth(oFF.UiCssLength.createExt(350, oFF.UiCssSizeUnit.PIXEL));
	chartDropdown.setHeight(oFF.UiCssLength.createExt(125, oFF.UiCssSizeUnit.PIXEL));
	chartDropdown.registerOnSelect(this);
	chartDropdown.addNewItem().setText("Highcharts").setName(oFF.OcChartType.HIGHCHARTS.getName());
	chartDropdown.addNewItem().setText("MicroChart").setName(oFF.OcChartType.MICRO_CHART.getName());
	chartDropdown.setSelectedName(this.m_chartType.getName());
};
oFF.ScAtlas.prototype.setOrcaUrl = function(orcaUrl)
{
	this.m_sacUrl = orcaUrl;
	var sysUri = oFF.XUri.createFromUrl(orcaUrl);
	var systemLandscape = this.getApplication().getSystemLandscape();
	systemLandscape.setSystemByUri(oFF.OcOrcaServiceConfig.ORCA_MASTER_SYSTEM_NAME, sysUri, null);
};
oFF.ScAtlas.prototype.loginToSac = function(setBusy)
{
	if (setBusy)
	{
		this.m_mainNavigationContainer.setBusy(true);
	}
	var config = oFF.OcOrcaServiceConfig.create(this.getApplication(), oFF.OcOrcaServiceConfig.ORCA_MASTER_SYSTEM_NAME);
	config.processOrcaServiceCreation(oFF.SyncType.NON_BLOCKING, this, null);
};
oFF.ScAtlas.prototype.goToStoryListPage = function(storyCatalog)
{
	var storyListView = oFF.ScAtlasStoryListView.createStoryListView(this.getGenesis(), storyCatalog, this);
	if (oFF.notNull(storyListView))
	{
		this.m_mainNavigationContainer.pushPage(storyListView.getPage());
	}
};
oFF.ScAtlas.prototype.renderStory = function(story)
{
	if (oFF.notNull(this.m_storyFileJson))
	{
		this.renderFromFile(story);
	}
	else
	{
		var storyView = oFF.ScAtlasStoryView.createStoryView(this.getGenesis(), this.getApplication(), story, this.m_layout, this.m_chartType);
		this.m_mainNavigationContainer.pushPage(storyView.getPage());
	}
};
oFF.ScAtlas.prototype.openStoryFromFile = function(storyFile)
{
	if (storyFile.isExisting())
	{
		var storyFilePage = this.m_mainNavigationContainer.pushNewPage();
		storyFilePage.setName("scAtlasStoryFilePage");
		storyFilePage.setText("Story");
		storyFilePage.setBackgroundColor(oFF.UiColor.WHITE);
		storyFilePage.setShowHeader(false);
		var activityIndicator = storyFilePage.setNewContent(oFF.UiType.ACTIVITY_INDICATOR);
		activityIndicator.setText("Loading story...");
		activityIndicator.useMaxSpace();
		storyFile.processLoad(oFF.SyncType.NON_BLOCKING, this, null, oFF.CompressionType.NONE);
	}
};
oFF.ScAtlas.prototype.loadStoryFromFileJson = function(storyJson)
{
	if (this.isStoryJsonFileValid(storyJson))
	{
		this.m_storyFileJson = storyJson;
		this.setOrcaUrl(this.m_storyFileJson.getStringByKey("systemUrl"));
		this.loginToSac(false);
	}
	else
	{
		this.getGenesis().showErrorToast("Invalid story file!");
		this.m_storyFileJson = null;
	}
};
oFF.ScAtlas.prototype.isStoryJsonFileValid = function(storyJson)
{
	if (oFF.isNull(storyJson))
	{
		return false;
	}
	if (!storyJson.containsKey(oFF.ScAtlas.ASD_FILE_SYSTEM_NAME_KEY))
	{
		return false;
	}
	if (!storyJson.containsKey(oFF.ScAtlas.ASD_FILE_SYSTEM_URL_KEY))
	{
		return false;
	}
	if (!storyJson.containsKey(oFF.ScAtlas.ASD_FILE_STORY_ID_KEY))
	{
		return false;
	}
	return true;
};
oFF.ScAtlas.prototype.renderFromFile = function(story)
{
	this.m_mainNavigationContainer.clearPages();
	this.setTitle(this.m_file.getName());
	var name = this.m_storyFileJson.getStringByKeyExt(oFF.ScAtlas.ASD_FILE_NAME_KEY, null);
	var tmpLayout = oFF.OcLayoutType.getByName(this.m_storyFileJson.getStringByKey(oFF.ScAtlas.ASD_FILE_LAYOUT_TYPE_KEY));
	if (oFF.isNull(tmpLayout))
	{
		tmpLayout = this.m_layout;
	}
	var tmpChart = oFF.OcChartType.lookup(this.m_storyFileJson.getStringByKey(oFF.ScAtlas.ASD_FILE_CHART_TYPE_KEY));
	if (oFF.isNull(tmpChart))
	{
		tmpChart = this.m_chartType;
	}
	var type = this.m_storyFileJson.getStringByKeyExt(oFF.ScAtlas.ASD_FILE_TYPE_KEY, null);
	if (oFF.XString.isEqual(type, oFF.ScAtlas.ASD_FILE_TYPE_DASHBOARD))
	{
		var widgetIds = this.m_storyFileJson.getStringByKeyExt(oFF.ScAtlas.ASD_FILE_WIDGET_IDS_KEY, null);
		var widgetIdsList = oFF.XStringTokenizer.splitString(widgetIds, oFF.ScAtlas.ASD_WIDGET_SEPARATOR_TOKEN);
		var dashboardView = oFF.ScAtlasDashboardView.createDashboardView(this.getGenesis(), this.getApplication(), story, widgetIdsList, name);
		this.m_mainNavigationContainer.pushPage(dashboardView.getPage());
	}
	else
	{
		var storyView = oFF.ScAtlasStoryView.createStoryView(this.getGenesis(), this.getApplication(), story, tmpLayout, tmpChart);
		this.m_mainNavigationContainer.pushPage(storyView.getPage());
	}
};
oFF.ScAtlas.prototype.createStoryToolbarMenu = function(fileBtn)
{
	var storyToolbarMenu = this.m_genesis.newControl(oFF.UiType.MENU);
	storyToolbarMenu.setName("storyToolbarMenu");
	storyToolbarMenu.addNewItem().setName("atlasStoryToolbarMenuSave").setText("Save").setIcon("save").registerOnPress(this);
	storyToolbarMenu.openAt(fileBtn);
};
oFF.ScAtlas.prototype.onOrcaServiceCreated = function(extResult, orcaService, customIdentifier)
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
		this.getGenesis().showErrorToast("Logon failed!");
	}
};
oFF.ScAtlas.prototype.onSystemsLoaded = function(extResult, systems, customIdentifier)
{
	if (extResult.isValid())
	{
		this.log("#2 success system loaded");
		var systemLandscape = this.getApplication().getSystemLandscape();
		for (var i = 0; i < systems.size(); i++)
		{
			var systemDescription = systems.get(i);
			systemLandscape.setSystemByDescription(systemDescription);
		}
		if (oFF.notNull(this.m_storyFileJson))
		{
			this.m_orcaService.processStoryLoad(oFF.SyncType.NON_BLOCKING, this, null, this.m_storyFileJson.getStringByKey(oFF.ScAtlas.ASD_FILE_STORY_ID_KEY));
		}
		else
		{
			this.m_orcaService.processStoryCatalogLoad(oFF.SyncType.NON_BLOCKING, this, null, null);
		}
	}
	else
	{
		this.log("#2 failure system loaded");
		this.log(extResult.getSummary());
		this.getGenesis().showErrorToast("System load failed!");
	}
};
oFF.ScAtlas.prototype.onStoryCatalogLoaded = function(extResult, storyCatalog, customIdentifier)
{
	this.m_mainNavigationContainer.setBusy(false);
	if (extResult.isValid())
	{
		this.log("#3 success story catalog loaded");
		this.goToStoryListPage(extResult.getData());
	}
	else
	{
		this.log("#3 failure story catalog loaded");
		this.log(extResult.getSummary());
		this.getGenesis().showErrorToast("System catalog load failed!");
	}
};
oFF.ScAtlas.prototype.onStoryLoaded = function(extResult, story, customIdentifier)
{
	this.m_mainNavigationContainer.setBusy(false);
	if (extResult.isValid())
	{
		this.log("#4 success story loaded");
		this.renderStory(story);
	}
	else
	{
		this.log("#4 failure story loaded");
		this.log(extResult.getSummary());
		this.getGenesis().showErrorToast("Story load failed!");
	}
};
oFF.ScAtlas.prototype.onFileLoaded = function(extResult, file, fileContent, customIdentifier)
{
	this.log("File loaded!");
	if (extResult.isValid())
	{
		if (oFF.notNull(fileContent))
		{
			var jsonContent = fileContent.getJsonContent();
			if (oFF.notNull(jsonContent))
			{
				this.loadStoryFromFileJson(jsonContent.asStructure());
			}
			else
			{
				this.getGenesis().showErrorToast("Not a json document!");
			}
		}
		else
		{
			this.getGenesis().showErrorToast("Something went wrong! File content is empty!");
		}
	}
	else
	{
		this.getGenesis().showErrorToast("Error while fetching the specified file!");
	}
};
oFF.ScAtlas.prototype.onStoryCatalogItemSelected = function(storyCatalogItem)
{
	if (oFF.notNull(storyCatalogItem))
	{
		this.m_mainNavigationContainer.setBusy(true);
		this.m_orcaService.processStoryLoad(oFF.SyncType.NON_BLOCKING, this, null, storyCatalogItem.getId());
		this.log(storyCatalogItem.getId());
	}
};
oFF.ScAtlas.prototype.onPress = function(event)
{
	oFF.DfUiProgram.prototype.onPress.call( this , event);
	var control = event.getControl();
	var controlParent = control.getParent();
	if (oFF.XString.isEqual(control.getName(), "scAtlasLoginBtn"))
	{
		this.setOrcaUrl(this.m_urlInput.getText());
		this.loginToSac(true);
		return;
	}
	if (oFF.notNull(controlParent) && controlParent.getUiType() === oFF.UiType.TOOLBAR)
	{
		switch (control.getName())
		{
			case "scAtlasToolbarStoryBtn":
				this.createStoryToolbarMenu(control);
				break;

			case "scAtlasToolbarLogoutBtn":
				this.getGenesis().showInfoToast("It works! Fake logout!");
				break;

			default:
		}
	}
	if (oFF.notNull(controlParent) && controlParent.getUiType() === oFF.UiType.MENU)
	{
		if (oFF.XString.isEqual(controlParent.getName(), "editToolbarMenu"))
		{
			switch (control.getName())
			{
				case "editToolbarMenuAddBtn":
					break;

				case "editToolbarMenuImportBtn":
					break;

				case "editToolbarMenuClearUserSystemsBtn":
					break;

				default:
			}
		}
		else if (oFF.XString.isEqual(controlParent.getName(), "toolsToolbarMenu"))
		{
			switch (control.getName())
			{
				case "toolsToolbarMenuConnectBtn":
					break;

				default:
			}
		}
	}
};
oFF.ScAtlas.prototype.onSelect = function(event)
{
	if (event.getControl().getUiType() === oFF.UiType.DROPDOWN)
	{
		var selectedItem = event.getSelectedItem();
		if (oFF.XString.isEqual(event.getControl().getName(), "hostDropdown"))
		{
			var tmpSysName = selectedItem.getName();
			if (this.m_systemDict.containsKey(tmpSysName))
			{
				this.m_urlInput.setText(this.m_systemDict.getByKey(tmpSysName));
				this.setOrcaUrl(this.m_systemDict.getByKey(tmpSysName));
			}
			else
			{
				this.m_urlInput.setText("");
				this.setOrcaUrl("");
			}
		}
		else if (oFF.XString.isEqual(event.getControl().getName(), "scAtlasChartDropdown"))
		{
			var chartTypeName = selectedItem.getName();
			this.m_chartType = oFF.OcChartType.lookup(chartTypeName);
		}
	}
};
oFF.ScAtlas.prototype.onLiveChange = function(event) {};
oFF.ScAtlas.prototype.onEnter = function(event) {};
oFF.ScAtlas.prototype.onBack = function(event) {};

oFF.FirstAidTestProgram = function() {};
oFF.FirstAidTestProgram.prototype = new oFF.DfUiProgram();
oFF.FirstAidTestProgram.prototype._ff_c = "FirstAidTestProgram";

oFF.FirstAidTestProgram.DEFAULT_PROGRAM_NAME = "FirstAidTest";
oFF.FirstAidTestProgram.prototype.m_createQmBtn = null;
oFF.FirstAidTestProgram.prototype.m_cloneQmBtn = null;
oFF.FirstAidTestProgram.prototype.m_overviewBtn = null;
oFF.FirstAidTestProgram.prototype.m_shellBtn = null;
oFF.FirstAidTestProgram.prototype.m_overview = null;
oFF.FirstAidTestProgram.prototype.newProgram = function()
{
	var program = new oFF.FirstAidTestProgram();
	program.setup();
	return program;
};
oFF.FirstAidTestProgram.prototype.buildUi = function(genesis)
{
	oFF.DfUiProgram.prototype.buildUi.call( this , genesis);
	var root = genesis.newRoot(oFF.UiType.VERTICAL_LAYOUT);
	this.m_createQmBtn = root.addNewItemOfType(oFF.UiType.BUTTON);
	this.m_createQmBtn.setText("Create QM...");
	this.m_createQmBtn.registerOnPress(this);
	this.m_cloneQmBtn = root.addNewItemOfType(oFF.UiType.BUTTON);
	this.m_cloneQmBtn.setText("Clone last QM");
	this.m_cloneQmBtn.setEnabled(false);
	this.m_cloneQmBtn.registerOnPress(this);
	this.m_overviewBtn = root.addNewItemOfType(oFF.UiType.BUTTON);
	this.m_overviewBtn.setText("FirstAid Dialog");
	this.m_overviewBtn.registerOnPress(this);
	this.m_shellBtn = root.addNewItemOfType(oFF.UiType.BUTTON);
	this.m_shellBtn.setText("FirstAid Shell");
	this.m_shellBtn.registerOnPress(this);
	var dataSource = oFF.QFactory.createDataSource();
	dataSource.setSystemName("KIW");
	dataSource.setFullQualifiedName("query:[0BOC_TEST_VARIABLE_TYPES_1]");
	this.onDatasourceSelected(dataSource);
};
oFF.FirstAidTestProgram.prototype.onPress = function(event)
{
	oFF.DfUiProgram.prototype.onPress.call( this , event);
	var control = event.getControl();
	if (control === this.m_overviewBtn)
	{
		oFF.XObjectExt.release(this.m_overview);
		this.m_overview = oFF.FirstAidDialog.createFirstAidDialog(this.getApplication(), this.getUiManager());
		this.m_overview.open();
	}
	else if (control === this.m_shellBtn)
	{
		var process = this.getApplication().getProcess();
		if (oFF.notNull(process))
		{
			var newArgs = oFF.ProgramArgs.create();
			var startCfgBase = oFF.ProgramStartCfg.create(process, "shell", null, newArgs);
			startCfgBase.setIsNewConsoleNeeded(true);
			startCfgBase.setIsCreatingChildProcess(false);
			startCfgBase.processExecution(oFF.SyncType.NON_BLOCKING, null, null);
		}
	}
	else if (control === this.m_createQmBtn)
	{
		this.createQm();
	}
	else if (control === this.m_cloneQmBtn)
	{
		var olapEnv = this.getApplication().getOlapEnvironment();
		var allQms = olapEnv.getAllAreaQueryManager();
		var lastQm = allQms.get(allQms.size() - 1);
		lastQm.cloneQueryManager();
	}
};
oFF.FirstAidTestProgram.prototype.createQm = function()
{
	var appStoreDlgManifest = oFF.ProgramRegistration.getProgramManifest(oFF.AuDatasourcePicker.DEFAULT_PROGRAM_NAME);
	var appStoreDlgStartCfg = oFF.ProgramStartCfg.create(this.getProcess(), appStoreDlgManifest.getName(), null, null);
	var tmpArgs = appStoreDlgStartCfg.getArguments();
	tmpArgs.putXObject(oFF.AuDatasourcePicker.PARAM_LISTENER, this);
	appStoreDlgStartCfg.setParentProcess(this.getProcess());
	appStoreDlgStartCfg.setIsCreatingChildProcess(true);
	appStoreDlgStartCfg.processExecution(oFF.SyncType.NON_BLOCKING, null, null);
};
oFF.FirstAidTestProgram.prototype.onDatasourceSelected = function(dataSource)
{
	if (oFF.isNull(dataSource))
	{
		return;
	}
	var serviceConfig = oFF.QueryServiceConfig.createWithDataSource(this.getApplication(), dataSource.getSystemName(), dataSource);
	var result = serviceConfig.processQueryManagerCreation(oFF.SyncType.BLOCKING, null, null);
	if (result.hasErrors())
	{
		this.logError(result.getSummary());
	}
	else
	{
		result.getData().getTagging().put("myTag", "hoi");
		result.getData().getTagging().put("myTag1", "hoi");
		result.getData().getTagging().put("myTag2", "hoi");
		result.getData().getTagging().put("myTag3", "hoi");
		result.getData().getTagging().put("myTag4", "hoi");
		this.m_cloneQmBtn.setEnabled(true);
	}
};

oFF.ApplicationUiModule = function() {};
oFF.ApplicationUiModule.prototype = new oFF.DfModule();
oFF.ApplicationUiModule.prototype._ff_c = "ApplicationUiModule";

oFF.ApplicationUiModule.s_module = null;
oFF.ApplicationUiModule.getInstance = function()
{
	if (oFF.isNull(oFF.ApplicationUiModule.s_module))
	{
		oFF.DfModule.checkInitialized(oFF.SystemUiModule.getInstance());
		oFF.DfModule.checkInitialized(oFF.OlapApiModule.getInstance());
		oFF.DfModule.checkInitialized(oFF.StoryModule.getInstance());
		oFF.DfModule.checkInitialized(oFF.QuasarModule.getInstance());
		oFF.DfModule.checkInitialized(oFF.OlapUiModule.getInstance());
		oFF.ApplicationUiModule.s_module = oFF.DfModule.startExt(new oFF.ApplicationUiModule());
		oFF.ProgramRegistration.setProgramFactory(oFF.AnalyticCardsProgram.DEFAULT_PROGRAM_NAME, new oFF.AnalyticCardsProgram());
		oFF.ProgramRegistration.setProgramFactory(oFF.Gyros.DEFAULT_PROGRAM_NAME, new oFF.Gyros());
		oFF.ProgramRegistration.setProgramFactory(oFF.FirstAidTestProgram.DEFAULT_PROGRAM_NAME, new oFF.FirstAidTestProgram());
		oFF.ProgramRegistration.setProgramFactory(oFF.FilterDialogProgram.DEFAULT_PROGRAM_NAME, new oFF.FilterDialogProgram());
		oFF.ProgramRegistration.setProgramFactory(oFF.DimensionDialogTestProgram.DEFAULT_PROGRAM_NAME, new oFF.DimensionDialogTestProgram());
		oFF.ProgramRegistration.setProgramFactory(oFF.CatalogDialogDummyProgram.DEFAULT_PROGRAM_NAME, new oFF.CatalogDialogDummyProgram());
		oFF.ProgramRegistration.setProgramFactory(oFF.QvKratos.DEFAULT_PROGRAM_NAME, new oFF.QvKratos());
		oFF.ProgramRegistration.setProgramFactory(oFF.StdAidos.DEFAULT_PROGRAM_NAME, new oFF.StdAidos());
		oFF.ProgramRegistration.setProgramFactory(oFF.GsGalaxyStudio.DEFAULT_PROGRAM_NAME, new oFF.GsGalaxyStudio());
		oFF.ProgramRegistration.setProgramFactory(oFF.ScAtlas.DEFAULT_PROGRAM_NAME, new oFF.ScAtlas());
		oFF.ProgramRegistration.setProgramFactory(oFF.AuProteusShell.DEFAULT_PROGRAM_NAME, new oFF.AuProteusShell());
		oFF.ProgramRegistration.setProgramFactory(oFF.AuGalaxyDataStudio.DEFAULT_PROGRAM_NAME, new oFF.AuGalaxyDataStudio());
		oFF.GyrosCommand.staticSetupGyrosCommands();
		oFF.OpenQueryDialogI18n.staticSetupOqd();
		oFF.AuGdsQdPanelPresentation.staticSetup();
		oFF.DfModule.stopExt(oFF.ApplicationUiModule.s_module);
	}
	return oFF.ApplicationUiModule.s_module;
};
oFF.ApplicationUiModule.prototype.getName = function()
{
	return "ff8050.application.ui";
};

oFF.ApplicationUiModule.getInstance();

return sap.firefly;
	} );