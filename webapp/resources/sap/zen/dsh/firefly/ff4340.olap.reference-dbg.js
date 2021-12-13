/*!
 * SAPUI5
  (c) Copyright 2009-2021 SAP SE. All rights reserved
 */
/*global sap*/
sap.ui.define(
[
"sap/zen/dsh/firefly/ff4310.olap.impl"
],
function(oFF)
{
"use strict";

oFF.BindingUtils = {

	getBindingSoureList:function(vizDef, feedName)
	{
			var chartDefBindings = vizDef.getStructureByKey(oFF.VizDefConstants.K_CHART).getListByKey(oFF.VizDefConstants.K_BINDINGS);
		var ids = oFF.XListOfString.create();
		for (var i = 0; i < chartDefBindings.size(); ++i)
		{
			var binding = chartDefBindings.getStructureAt(i);
			if (oFF.XString.isEqual(binding.getStringByKey(oFF.VizDefConstants.K_FEED), feedName))
			{
				var source = binding.getListByKey(oFF.VizDefConstants.K_SOURCE);
				for (var j = 0; j < source.size(); ++j)
				{
					ids.add(source.getStructureAt(j).getStringByKey(oFF.VizDefConstants.K_ID));
				}
			}
		}
		return ids;
	}
};

oFF.ChartRendererFactoryImpl = function() {};
oFF.ChartRendererFactoryImpl.prototype = new oFF.XObject();
oFF.ChartRendererFactoryImpl.prototype._ff_c = "ChartRendererFactoryImpl";

oFF.ChartRendererFactoryImpl.create = function()
{
	return new oFF.ChartRendererFactoryImpl();
};
oFF.ChartRendererFactoryImpl.prototype.newRenderer = function(protocolType)
{
	if (protocolType.isTypeOf(oFF.ProtocolBindingType.GOOGLE_CHART_PROTOCOL))
	{
		return oFF.RsGoogleChartRenderer.create();
	}
	if (protocolType.isTypeOf(oFF.ProtocolBindingType.VIZ_FRAME_PROTOCOL))
	{
		return oFF.RsVizFrameRenderer.create();
	}
	if (protocolType.isTypeOf(oFF.ProtocolBindingType.MICRO_CHART_PROTOCOL))
	{
		return oFF.RsMicroChartRenderer.create();
	}
	return oFF.RsHiChartRenderer.create();
};

oFF.RsHiChartRenderer = function() {};
oFF.RsHiChartRenderer.prototype = new oFF.XObject();
oFF.RsHiChartRenderer.prototype._ff_c = "RsHiChartRenderer";

oFF.RsHiChartRenderer.create = function()
{
	return new oFF.RsHiChartRenderer();
};
oFF.RsHiChartRenderer.getDoubleValueExtended = function(structure, name, defaultValue)
{
	var result = defaultValue;
	var number2beConverted = structure.getStringByKeyExt(name, "0");
	if (structure.getElementTypeByKey(name).isNumber())
	{
		result = structure.getByKey(name).asNumber().getDouble();
	}
	else if (oFF.notNull(number2beConverted) && oFF.XString.containsString(number2beConverted, "E"))
	{
		var number2be = oFF.XDouble.convertFromString(oFF.XString.substring(number2beConverted, 0, oFF.XString.indexOf(number2beConverted, "E")));
		var exponotialComponent = oFF.XInteger.convertFromString(oFF.XString.substring(number2beConverted, oFF.XString.indexOf(number2beConverted, "E"), oFF.XString.size(number2beConverted)));
		result = number2be * oFF.XMath.pow(10, exponotialComponent);
	}
	else if (oFF.notNull(number2beConverted))
	{
		try
		{
			result = oFF.XDouble.convertFromString(number2beConverted);
		}
		catch (t)
		{
			result = defaultValue;
		}
	}
	return result;
};
oFF.RsHiChartRenderer.prototype.render = function(type, rs)
{
	if (oFF.notNull(rs))
	{
		var helper = oFF.RsHiChartRenderHelper.create(type, rs);
		return helper.getChartData();
	}
	return null;
};

oFF.RsHiChartUtils = {

	create:function()
	{
			return new oFF.RsHiChartUtils();
	},
	axisPloter:function(vizAxis, axisChart, ChartType, defaultlabeling)
	{
			var isVisible = true;
		var isVisibleLabels = defaultlabeling;
		var isAxisTickVisible = false;
		var axisColor = "#FFFFFF";
		var vizPropAxisLine = vizAxis.getStructureByKey(oFF.VizDefConstants.K_AXIS_LINE);
		if (vizAxis.getElementTypeByKey(oFF.VizDefConstants.K_VISIBLE) === oFF.PrElementType.BOOLEAN)
		{
			isVisibleLabels = vizAxis.getBooleanByKeyExt(oFF.VizDefConstants.K_VISIBLE, defaultlabeling);
		}
		var vizPropAxisTick = vizAxis.getStructureByKey(oFF.VizDefConstants.K_AXIS_TICK);
		if (oFF.notNull(vizPropAxisLine))
		{
			if (vizPropAxisLine.containsKey(oFF.VizDefConstants.K_SIZE))
			{
				var axisLineSize = vizPropAxisLine.getIntegerByKeyExt(oFF.VizDefConstants.K_SIZE, 0);
				axisChart.putInteger(oFF.VizDefConstants.K_LINE_WIDTH, axisLineSize);
			}
			isVisible = vizPropAxisLine.getBooleanByKeyExt(oFF.VizDefConstants.K_VISIBLE, true);
		}
		if (oFF.notNull(vizPropAxisTick))
		{
			isAxisTickVisible = vizPropAxisTick.getBooleanByKeyExt(oFF.VizDefConstants.K_VISIBLE, false);
		}
		var isShowLabelGrids = vizAxis.getBooleanByKeyExt(oFF.VizDefConstants.K_SHOW_LABEL_GRIDS, true);
		if (!oFF.XString.isEqual(oFF.VizDefConstants.K_HEATMAP, ChartType) && vizAxis.hasStringByKey(oFF.VizDefConstants.K_COLOR) && isVisible)
		{
			axisColor = vizAxis.getStringByKeyExt(oFF.VizDefConstants.K_COLOR, "#FFFFFF");
		}
		axisChart.putString(oFF.VizDefConstants.K_LINE_COLOR, axisColor);
		var vizAxisLabel = vizAxis.getStructureByKey(oFF.VizDefConstants.K_LABEL);
		if (oFF.notNull(vizAxisLabel))
		{
			var vizAxisLabelStyle = vizAxisLabel.getStructureByKey(oFF.VizDefConstants.K_STYLE);
			if (oFF.notNull(vizAxisLabelStyle))
			{
				var axisLabelColor = vizAxisLabelStyle.getStringByKey(oFF.VizDefConstants.K_COLOR);
				var axisLabelFontFamily = vizAxisLabelStyle.getStringByKey(oFF.VizDefConstants.K_FONT_FAMILY);
				var axisLabelFontsize = vizAxisLabelStyle.getStringByKey(oFF.VizDefConstants.K_FONT_SIZE);
				var xAxisLabels = axisChart.putNewStructure(oFF.VizDefConstants.K_LABELS);
				if (isShowLabelGrids)
				{
					xAxisLabels.putInteger(oFF.VizDefConstants.K_X, -5);
					var xAxisLabelsStyle = xAxisLabels.putNewStructure(oFF.VizDefConstants.K_STYLE);
					xAxisLabelsStyle.putString(oFF.VizDefConstants.K_FONT_SIZE, axisLabelFontsize);
					xAxisLabelsStyle.putString(oFF.VizDefConstants.K_FILL, axisLabelColor);
					if (oFF.XString.isEqual(ChartType, oFF.VizDefConstants.V_CHART_TYPE_BOXPLOT))
					{
						xAxisLabelsStyle.putString(oFF.VizDefConstants.K_COLOR, axisLabelColor);
					}
					xAxisLabelsStyle.putString(oFF.VizDefConstants.K_FONT_FAMILY, axisLabelFontFamily);
				}
				xAxisLabels.putBoolean(oFF.VizDefConstants.K_ENABLED, isVisibleLabels);
			}
		}
		if (!isAxisTickVisible)
		{
			axisChart.putInteger(oFF.VizDefConstants.K_GRIDLINE_WIDTH, 0);
			axisChart.putString(oFF.VizDefConstants.K_TICK_COLOR, "rgb(166, 168, 171)");
			axisChart.putInteger(oFF.VizDefConstants.K_TICK_WIDTH, 0);
		}
		return axisChart;
	},
	responsiveBuilder:function(chartType, theChartData)
	{
			var responsive = theChartData.putNewStructure(oFF.VizDefConstants.K_RESPONSIVE);
		var rules = responsive.putNewList(oFF.VizDefConstants.K_RULES);
		var rules3Object = rules.addNewStructure();
		var conditionStruct3 = rules3Object.putNewStructure(oFF.VizDefConstants.K_CONDITION);
		conditionStruct3.putInteger(oFF.VizDefConstants.K_MAX_HEIGHT, 176);
		var chartOptions3Rules = rules3Object.putNewStructure(oFF.VizDefConstants.K_CHART_OPTIONS);
		var chartOptionsLegend3 = chartOptions3Rules.putNewStructure(oFF.VizDefConstants.K_LEGEND);
		chartOptionsLegend3.putBoolean(oFF.VizDefConstants.K_ENABLED, false);
		var chartOptions3yAxis = chartOptions3Rules.putNewStructure(oFF.VizDefConstants.K_Y_AXIS);
		var chartOptions3yAxisLabel = chartOptions3yAxis.putNewStructure(oFF.VizDefConstants.K_LABELS);
		chartOptions3yAxisLabel.putInteger(oFF.VizDefConstants.K_ROTATION, 344);
		chartOptions3yAxisLabel.putInteger(oFF.VizDefConstants.K_X, 10);
		var rules1Object = rules.addNewStructure();
		var conditionStruct = rules1Object.putNewStructure(oFF.VizDefConstants.K_CONDITION);
		conditionStruct.putInteger(oFF.VizDefConstants.K_MAX_WIDTH, 359);
		conditionStruct.putInteger(oFF.VizDefConstants.K_MIN_HEIGHT, 70);
		var chartOptions1Rules = rules1Object.putNewStructure(oFF.VizDefConstants.K_CHART_OPTIONS);
		var chartInfo = chartOptions1Rules.putNewStructure(oFF.VizDefConstants.K_CHART);
		chartInfo.putBoolean(oFF.VizDefConstants.K_ANIMATION, false);
		var chartOptionsPlotOptions = chartOptions1Rules.putNewStructure(oFF.VizDefConstants.K_PLOT_OPTIONS);
		var chartOptionsPlotOptionsSeries = chartOptionsPlotOptions.putNewStructure(oFF.VizDefConstants.K_SERIES);
		var chartOptionsDatalabels = chartOptionsPlotOptionsSeries.putNewStructure(oFF.VizDefConstants.K_DATA_LABELS);
		var chartOptionsDatalabelsStyle = chartOptionsDatalabels.putNewStructure(oFF.VizDefConstants.K_STYLE);
		if (oFF.XString.isEqual(chartType, oFF.VizDefConstants.K_PIE))
		{
			chartOptionsDatalabelsStyle.putString(oFF.VizDefConstants.K_FONT_SIZE, "9px");
			chartOptionsDatalabels.putInteger(oFF.VizDefConstants.K_CONNECTOR_WIDTH, 0);
			chartOptionsDatalabels.putInteger(oFF.VizDefConstants.K_DISTANCE, -30);
			chartOptionsDatalabels.putBoolean(oFF.VizDefConstants.K_INSIDE, true);
			chartInfo.putInteger(oFF.VizDefConstants.K_MARGIN_TOP, 40);
		}
		else
		{
			chartInfo.putInteger(oFF.VizDefConstants.K_MARGIN_TOP, 50);
			chartOptionsDatalabelsStyle.putString(oFF.VizDefConstants.K_FONT_SIZE, "9px");
		}
		var chartOptionsTitle = chartOptions1Rules.putNewStructure(oFF.VizDefConstants.K_TITLE);
		var chartOptionsTitleStyle = chartOptionsTitle.putNewStructure(oFF.VizDefConstants.K_STYLE);
		chartOptionsTitleStyle.putString(oFF.VizDefConstants.K_FONT_SIZE, "13px");
		chartOptionsTitleStyle.putBoolean(oFF.VizDefConstants.K_FLOATING, true);
		var chartOptions1subTitle = chartOptions1Rules.putNewStructure(oFF.VizDefConstants.K_SUBTITLE);
		chartOptions1subTitle.putString(oFF.VizDefConstants.K_TEXT, "");
		var chartOptionsxAxis = chartOptions1Rules.putNewStructure(oFF.VizDefConstants.K_X_AXIS);
		var chartOptionsxAxisLabel = chartOptionsxAxis.putNewStructure(oFF.VizDefConstants.K_LABELS);
		var chartOptionsxAxisLabelStyle = chartOptionsxAxisLabel.putNewStructure(oFF.VizDefConstants.K_STYLE);
		chartOptionsxAxisLabelStyle.putString(oFF.VizDefConstants.K_FONT_SIZE, "10px");
		var chartOptionsyAxis = chartOptions1Rules.putNewStructure(oFF.VizDefConstants.K_Y_AXIS);
		var chartOptionsyAxisLabel = chartOptionsyAxis.putNewStructure(oFF.VizDefConstants.K_LABELS);
		var chartOptionsyAxisLabelStyle = chartOptionsyAxisLabel.putNewStructure(oFF.VizDefConstants.K_STYLE);
		chartOptionsyAxisLabelStyle.putString(oFF.VizDefConstants.K_FONT_SIZE, "10px");
		var rules2Object = rules.addNewStructure();
		var condition2Struct = rules2Object.putNewStructure(oFF.VizDefConstants.K_CONDITION);
		condition2Struct.putInteger(oFF.VizDefConstants.K_MAX_WIDTH, 176);
		var chartOptions2Rules = rules2Object.putNewStructure(oFF.VizDefConstants.K_CHART_OPTIONS);
		var chart2Info = chartOptions2Rules.putNewStructure(oFF.VizDefConstants.K_CHART);
		chart2Info.putBoolean(oFF.VizDefConstants.K_ANIMATION, false);
		var chartOptionsLegend2 = chartOptions2Rules.putNewStructure(oFF.VizDefConstants.K_LEGEND);
		chartOptionsLegend2.putBoolean(oFF.VizDefConstants.K_ENABLED, false);
		chartOptionsLegend2.putInteger(oFF.VizDefConstants.K_Y, 25);
		var chartOptions2PlotOptions = chartOptions2Rules.putNewStructure(oFF.VizDefConstants.K_PLOT_OPTIONS);
		var chartOptions2PlotOptionsPie = chartOptions2PlotOptions.putNewStructure(oFF.VizDefConstants.K_SERIES);
		chartOptions2PlotOptionsPie.putInteger(oFF.VizDefConstants.K_MIN_SIZE, 100);
		var chartOptions2Datalabels = chartOptions2PlotOptionsPie.putNewStructure(oFF.VizDefConstants.K_DATA_LABELS);
		chartOptions2Datalabels.putInteger(oFF.VizDefConstants.K_CONNECTOR_WIDTH, 0);
		chartOptions2Datalabels.putInteger(oFF.VizDefConstants.K_DISTANCE, -25);
		var chartOptions2DatalabelsStyle = chartOptions2Datalabels.putNewStructure(oFF.VizDefConstants.K_STYLE);
		chartOptions2DatalabelsStyle.putString(oFF.VizDefConstants.K_FONT_SIZE, "8px");
		chart2Info.putInteger(oFF.VizDefConstants.K_MARGIN_TOP, 40);
		var chartOptions2Title = chartOptions2Rules.putNewStructure(oFF.VizDefConstants.K_TITLE);
		var chartOptions2TitleStyle = chartOptions2Title.putNewStructure(oFF.VizDefConstants.K_STYLE);
		chartOptions2TitleStyle.putString(oFF.VizDefConstants.K_FONT_SIZE, "10px");
		var chartOptions2subTitle = chartOptions2Rules.putNewStructure(oFF.VizDefConstants.K_SUBTITLE);
		chartOptions2subTitle.putString(oFF.VizDefConstants.K_TEXT, "");
		var chartOptions2xAxis = chartOptions2Rules.putNewStructure(oFF.VizDefConstants.K_X_AXIS);
		var chartOptions2xAxisLabel = chartOptions2xAxis.putNewStructure(oFF.VizDefConstants.K_LABELS);
		var chartOptions2xAxisLabelStyle = chartOptions2xAxisLabel.putNewStructure(oFF.VizDefConstants.K_STYLE);
		chartOptions2xAxisLabelStyle.putString(oFF.VizDefConstants.K_FONT_SIZE, "9px");
		var chartOptions2yAxis = chartOptions2Rules.putNewStructure(oFF.VizDefConstants.K_Y_AXIS);
		var chartOptions2yAxisLabel = chartOptions2yAxis.putNewStructure(oFF.VizDefConstants.K_LABELS);
		var chartOptions2yAxisLabelStyle = chartOptions2yAxisLabel.putNewStructure(oFF.VizDefConstants.K_STYLE);
		chartOptions2yAxisLabelStyle.putString(oFF.VizDefConstants.K_FONT_SIZE, "9px");
	}
};

oFF.RsGoogleChartConfig = {

	s_charts:null,
	staticSetup:function()
	{
			if (oFF.isNull(oFF.RsGoogleChartConfig.s_charts))
		{
			oFF.RsGoogleChartConfig.s_charts = oFF.XSimpleMap.create();
			oFF.RsGoogleChartConfig.s_charts.put(oFF.SemanticBindingType.BAR, oFF.GoogleChartBar.create());
			oFF.RsGoogleChartConfig.s_charts.put(oFF.SemanticBindingType.COLUMN, oFF.GoogleChartColumn.create());
			oFF.RsGoogleChartConfig.s_charts.put(oFF.SemanticBindingType.LINE, oFF.GoogleChartLine.create());
		}
	},
	createOptions:function(vizDef)
	{
			var chart = oFF.RsGoogleChartConfig.s_charts.getByKey(oFF.RsGoogleChartConfig.getChartType(vizDef));
		if (oFF.notNull(chart))
		{
			return chart.createOptions(vizDef);
		}
		return oFF.PrFactory.createStructure();
	},
	createMetadata:function(vizDef, columns)
	{
			var chart = oFF.RsGoogleChartConfig.s_charts.getByKey(oFF.RsGoogleChartConfig.getChartType(vizDef));
		if (oFF.notNull(chart))
		{
			return chart.createMetadata(columns);
		}
		return oFF.PrFactory.createStructure();
	},
	getChartType:function(vizDef)
	{
			var vizDefChart = vizDef.getStructureByKey(oFF.VizDefConstants.K_CHART);
		var type = vizDefChart.getStringByKey(oFF.VizDefConstants.K_TYPE);
		if (oFF.XString.isEqual(type, oFF.VizDefConstants.V_CHART_TYPE_BAR) || oFF.XString.isEqual(type, oFF.VizDefConstants.V_STACKED_BAR))
		{
			return oFF.SemanticBindingType.BAR;
		}
		if (oFF.XString.isEqual(type, oFF.VizDefConstants.V_CHART_TYPE_COLUMN) || oFF.XString.isEqual(type, oFF.VizDefConstants.V_STACKED_COLUMN))
		{
			return oFF.SemanticBindingType.COLUMN;
		}
		if (oFF.XString.isEqual(type, oFF.VizDefConstants.V_TYPE_BARCOLUMN))
		{
			var properties = vizDefChart.getStructureByKey(oFF.VizDefConstants.K_PROPERTIES);
			var propertiesGeneral = properties.getStructureByKey(oFF.VizDefConstants.K_GENERAL);
			if (oFF.notNull(propertiesGeneral) && propertiesGeneral.getBooleanByKeyExt(oFF.VizDefConstants.K_INVERTED, false))
			{
				return oFF.SemanticBindingType.BAR;
			}
			return oFF.SemanticBindingType.COLUMN;
		}
		if (oFF.XString.isEqual(type, oFF.VizDefConstants.K_LINE))
		{
			return oFF.SemanticBindingType.LINE;
		}
		return null;
	}
};

oFF.RsGoogleChartRenderer = function() {};
oFF.RsGoogleChartRenderer.prototype = new oFF.XObject();
oFF.RsGoogleChartRenderer.prototype._ff_c = "RsGoogleChartRenderer";

oFF.RsGoogleChartRenderer.create = function()
{
	return new oFF.RsGoogleChartRenderer();
};
oFF.RsGoogleChartRenderer.prototype.render = function(type, rs)
{
	var structure = oFF.PrFactory.createStructure();
	var vizDef = rs.getQueryModel().getVizManager().getVizDef();
	if (oFF.notNull(vizDef) && vizDef.containsKey(oFF.VizDefConstants.K_CHART) && rs.getAvailableDataCellCount() > 0)
	{
		var rowsAxis = rs.getCursorRowsAxis();
		var columnsAxis = rs.getCursorColumnsAxis();
		var dataStructure = structure.putNewStructure(oFF.GoogleConstants.K_DATA);
		var cols = dataStructure.putNewList(oFF.GoogleConstants.K_COLS);
		var rows = dataStructure.putNewList(oFF.GoogleConstants.K_ROWS);
		this.addHeaderForDimensionColumns(rowsAxis, cols);
		this.addHeaderForMeasureColumns(columnsAxis, cols);
		this.addRows(rowsAxis, rows, rs);
		structure.put(oFF.GoogleConstants.K_OPTIONS, oFF.RsGoogleChartConfig.createOptions(vizDef));
		structure.put(oFF.GoogleConstants.K_METADATA, oFF.RsGoogleChartConfig.createMetadata(vizDef, cols));
	}
	return structure;
};
oFF.RsGoogleChartRenderer.prototype.addHeaderForDimensionColumns = function(rowsAxis, cols)
{
	rowsAxis.setTupleCursorBeforeStart();
	rowsAxis.nextTuple();
	for (var i = 0; i < rowsAxis.getTupleElementsCount(); i++)
	{
		rowsAxis.nextTupleElement();
		rowsAxis.nextFieldValue();
		var dimension = rowsAxis.getField().getDimension();
		this.addHeader(cols, dimension.getText(), oFF.GoogleConstants.V_TYPE_STRING);
	}
};
oFF.RsGoogleChartRenderer.prototype.addHeaderForMeasureColumns = function(columnsAxis, cols)
{
	columnsAxis.setTupleCursorBeforeStart();
	while (columnsAxis.hasNextTuple())
	{
		columnsAxis.nextTuple();
		var header = oFF.XStringBuffer.create();
		while (columnsAxis.hasNextTupleElement())
		{
			columnsAxis.nextTupleElement();
			if (header.length() > 0)
			{
				header.append("/");
			}
			header.append(this.getMemberName(columnsAxis));
		}
		this.addHeader(cols, header.toString(), oFF.GoogleConstants.V_TYPE_NUMBER);
	}
};
oFF.RsGoogleChartRenderer.prototype.addHeader = function(cols, label, type)
{
	var columnStructure = cols.addNewStructure();
	columnStructure.putString(oFF.GoogleConstants.K_TYPE, type);
	columnStructure.putString(oFF.GoogleConstants.K_LABEL, label);
};
oFF.RsGoogleChartRenderer.prototype.addRows = function(rowsAxis, rows, rs)
{
	var tuplesRows = rowsAxis.getTuplesCount();
	rowsAxis.setTupleCursorBeforeStart();
	for (var tupleIndex = 0; tupleIndex < tuplesRows; tupleIndex++)
	{
		rowsAxis.nextTuple();
		if (!this.isResultRow(rowsAxis))
		{
			var rowStructure = rows.addNewStructure();
			var list = rowStructure.putNewList(oFF.GoogleConstants.K_C);
			while (rowsAxis.hasNextTupleElement())
			{
				rowsAxis.nextTupleElement();
				this.addRowCell(list, oFF.XStringValue.create(this.getMemberName(rowsAxis)));
			}
			for (var cellIndex = 0; cellIndex < rs.getDataColumns(); cellIndex++)
			{
				var dataCell = rs.getDataCell(cellIndex, tupleIndex);
				this.addRowCell(list, this.getCellValue(dataCell));
			}
		}
	}
};
oFF.RsGoogleChartRenderer.prototype.isResultRow = function(rowsAxis)
{
	if (rowsAxis.hasNextTupleElement())
	{
		rowsAxis.nextTupleElement();
		if (rowsAxis.getDimensionMemberType() === oFF.MemberType.RESULT)
		{
			return true;
		}
		rowsAxis.setTupleElementCursorBeforeStart();
	}
	return false;
};
oFF.RsGoogleChartRenderer.prototype.getMemberName = function(axis)
{
	var member = null;
	while (axis.hasNextFieldValue())
	{
		var fieldValue = axis.nextFieldValue();
		if (oFF.isNull(member) || oFF.PresentationType.isTextPresentation(fieldValue.getField().getPresentationType()))
		{
			member = fieldValue.getValue().getStringRepresentation();
		}
	}
	return member;
};
oFF.RsGoogleChartRenderer.prototype.getCellValue = function(dataCell)
{
	var valueException = dataCell.getValueException();
	if (valueException === oFF.ValueException.NULL_VALUE || valueException === oFF.ValueException.UNDEFINED)
	{
		return oFF.XStringValue.create(null);
	}
	if (valueException === oFF.ValueException.ZERO)
	{
		return oFF.XIntegerValue.create(0);
	}
	return dataCell.getXValue();
};
oFF.RsGoogleChartRenderer.prototype.addRowCell = function(list, value)
{
	var structure = list.addNewStructure();
	var valueType = value.getValueType();
	if (valueType === oFF.XValueType.STRING)
	{
		structure.putString(oFF.GoogleConstants.K_V, value.getStringRepresentation());
	}
	else if (valueType === oFF.XValueType.INTEGER)
	{
		structure.putInteger(oFF.GoogleConstants.K_V, value.getInteger());
	}
	else if (valueType === oFF.XValueType.DOUBLE)
	{
		structure.putDouble(oFF.GoogleConstants.K_V, value.getDouble());
	}
	else if (valueType === oFF.XValueType.LONG)
	{
		structure.putLong(oFF.GoogleConstants.K_V, value.getLong());
	}
	else if (valueType === oFF.XValueType.BOOLEAN)
	{
		structure.putBoolean(oFF.GoogleConstants.K_V, value.getBoolean());
	}
};

oFF.GoogleChart = function() {};
oFF.GoogleChart.prototype = new oFF.XObject();
oFF.GoogleChart.prototype._ff_c = "GoogleChart";

oFF.GoogleChart.LEGEND_MAX_LINES = 3;
oFF.GoogleChart.WIDTH = 600;
oFF.GoogleChart.HEIGHT = 500;
oFF.GoogleChart.HEIGHT_CHART_AREA = 380;
oFF.GoogleChart.ANIMATION_DURATION = 750;
oFF.GoogleChart.prototype.createOptions = function(vizDef)
{
	var structure = oFF.PrFactory.createStructure();
	var vizDefChart = vizDef.getStructureByKey(oFF.VizDefConstants.K_CHART);
	var vdProperties = vizDefChart.getStructureByKey(oFF.VizDefConstants.K_PROPERTIES);
	structure.putString(oFF.GoogleConstants.K_TITLE, vizDefChart.getStringByKeyExt(oFF.VizDefConstants.K_TITLE, ""));
	structure.putNewStructure(oFF.GoogleConstants.K_SERIES);
	var vdLegend = vdProperties.getStructureByKey(oFF.VizDefConstants.K_LEGEND);
	var vdLegendLabel = vdLegend.getStructureByKey(oFF.VizDefConstants.K_LABEL);
	var vdLegendLabelStyle = vdLegendLabel.getStructureByKey(oFF.VizDefConstants.K_STYLE);
	var vdLegendGroup = vdProperties.getStructureByKey(oFF.VizDefConstants.K_LEGEND_GROUP);
	var vdLegendGroupLayout = vdLegendGroup.getStructureByKey(oFF.VizDefConstants.K_LAYOUT);
	var vdLegendGroupPosition = vdLegendGroupLayout.getStringByKeyExt(oFF.VizDefConstants.K_POSITION, oFF.GoogleConstants.V_POSITION_NONE);
	var legend = structure.putNewStructure(oFF.GoogleConstants.K_LEGEND);
	this.setTextStyle(legend, vdLegendLabelStyle);
	legend.putString(oFF.GoogleConstants.K_POSITION, vdLegendGroupPosition);
	legend.putString(oFF.GoogleConstants.K_ALIGNMENT, oFF.GoogleConstants.V_CENTER);
	legend.putInteger(oFF.GoogleConstants.K_MAX_LINES, oFF.GoogleChart.LEGEND_MAX_LINES);
	structure.putInteger(oFF.GoogleConstants.K_WIDTH, oFF.GoogleChart.WIDTH);
	structure.putInteger(oFF.GoogleConstants.K_HEIGHT, oFF.GoogleChart.HEIGHT);
	var chartArea = structure.putNewStructure(oFF.GoogleConstants.K_CHART_AREA);
	chartArea.putInteger(oFF.GoogleConstants.K_HEIGHT, oFF.GoogleChart.HEIGHT_CHART_AREA);
	var animation = structure.putNewStructure(oFF.GoogleConstants.K_ANIMATION);
	animation.putBoolean(oFF.GoogleConstants.K_STARTUP, true);
	animation.putInteger(oFF.GoogleConstants.K_DURATION, oFF.GoogleChart.ANIMATION_DURATION);
	animation.putString(oFF.GoogleConstants.K_EASING, oFF.GoogleConstants.V_EASING_LINEAR);
	var vdPlotArea = vdProperties.getStructureByKey(oFF.VizDefConstants.K_PLOT_AREA);
	var vdPlotAreaColumnLabel = vdPlotArea.getStructureByKey(oFF.VizDefConstants.K_STACK_COLUMN_LABEL);
	var vdPlotAreaColumnLabelStyle = vdPlotAreaColumnLabel.getStructureByKey(oFF.VizDefConstants.K_STYLE);
	var annotations = structure.putNewStructure(oFF.GoogleConstants.K_ROLE_ANNOTATIONS);
	annotations.putBoolean(oFF.GoogleConstants.K_HIGH_CONTRAST, true);
	this.setTextStyle(annotations, vdPlotAreaColumnLabelStyle);
	var stem = annotations.putNewStructure(oFF.GoogleConstants.K_STEM);
	stem.putInteger(oFF.GoogleConstants.K_LENGTH, 2);
	var tooltip = structure.putNewStructure(oFF.GoogleConstants.K_TOOLTIP);
	this.setTextStyle(tooltip, vdPlotAreaColumnLabelStyle);
	this.addChartSpecificOptions(structure, vizDef);
	return structure;
};
oFF.GoogleChart.prototype.createMetadata = function(columns)
{
	var structure = oFF.PrFactory.createStructure();
	structure.putString(oFF.GoogleConstants.K_CHART_TYPE, this.getChartName());
	var cols = structure.putNewList(oFF.GoogleConstants.K_COLS);
	for (var i = 0; i < columns.size(); i++)
	{
		cols.addInteger(i);
		var columnType = columns.getStructureAt(i).getStringByKey(oFF.GoogleConstants.K_TYPE);
		if (oFF.XString.isEqual(columnType, oFF.GoogleConstants.K_NUMBER))
		{
			var colAnnotation = cols.addNewStructure();
			colAnnotation.putString(oFF.GoogleConstants.K_ROLE, oFF.GoogleConstants.V_ROLE_ANNOTATION);
			colAnnotation.putString(oFF.GoogleConstants.K_TYPE, oFF.GoogleConstants.V_TYPE_STRING);
			colAnnotation.putString(oFF.GoogleConstants.K_CALC, oFF.GoogleConstants.V_CALC_STRINGIFY);
			colAnnotation.putInteger(oFF.GoogleConstants.K_SOURCE_COLUMN, i);
		}
	}
	return structure;
};
oFF.GoogleChart.prototype.setTextStyle = function(structure, vizDefStyle)
{
	var textStyle = structure.putNewStructure(oFF.GoogleConstants.K_TEXT_STYLE);
	textStyle.putString(oFF.GoogleConstants.K_FONT_NAME, vizDefStyle.getStringByKeyExt(oFF.VizDefConstants.K_FONT_FAMILY, ""));
	textStyle.putString(oFF.GoogleConstants.K_COLOR, vizDefStyle.getStringByKeyExt(oFF.VizDefConstants.K_COLOR, "rgb(0,0,0)"));
	var fontSize = vizDefStyle.getStringByKey(oFF.VizDefConstants.K_FONT_SIZE);
	if (oFF.notNull(fontSize))
	{
		textStyle.putString(oFF.GoogleConstants.K_FONT_SIZE, oFF.XString.replace(fontSize, "px", ""));
	}
	var fontWeight = vizDefStyle.getStringByKey(oFF.VizDefConstants.K_FONT_WEIGHT);
	if (oFF.XString.isEqual(fontWeight, oFF.VizDefConstants.V_FONT_WEIGHT_BOLD))
	{
		textStyle.putBoolean(oFF.GoogleConstants.K_BOLD, true);
	}
};
oFF.GoogleChart.prototype.setAxisStyle = function(axis, vizDef, axisName, showLabels)
{
	var vdChart = vizDef.getStructureByKey(oFF.VizDefConstants.K_CHART);
	var vdProperties = vdChart.getStructureByKey(oFF.VizDefConstants.K_PROPERTIES);
	var vdAxis = vdProperties.getStructureByKey(axisName);
	var vdAxisLabel = vdAxis.getStructureByKey(oFF.VizDefConstants.K_LABEL);
	var vdOtherAxis = this.getOppositeAxis(axisName, vdProperties);
	this.setTextStyle(axis, vdAxisLabel.getStructureByKey(oFF.VizDefConstants.K_STYLE));
	if (!showLabels)
	{
		axis.putString(oFF.GoogleConstants.K_TEXT_POSITION, oFF.GoogleConstants.V_POSITION_NONE);
	}
	var vdAxisLine = vdOtherAxis.getStructureByKey(oFF.VizDefConstants.K_AXIS_LINE);
	if (oFF.notNull(vdAxisLine) && vdAxisLine.getBooleanByKeyExt(oFF.VizDefConstants.K_VISIBLE, true))
	{
		axis.putInteger(oFF.GoogleConstants.K_BASELINE, 0);
	}
	var vdAxisReferenceLines = this.getAxisReferenceLines(vizDef, axisName);
	if (oFF.notNull(vdAxisReferenceLines))
	{
		var ticks = axis.putNewList(oFF.GoogleConstants.K_TICKS);
		for (var i = 0; i < vdAxisReferenceLines.size(); i++)
		{
			ticks.addString(vdAxisReferenceLines.getStructureAt(i).getStringByKey(oFF.VizDefConstants.K_VALUE));
		}
	}
	else if (!this.isTicksVisible(vdOtherAxis))
	{
		axis.putNewList(oFF.GoogleConstants.K_TICKS);
	}
};
oFF.GoogleChart.prototype.getOppositeAxis = function(axisName, vdProperties)
{
	if (oFF.XString.isEqual(axisName, oFF.VizDefConstants.K_CATEGORY_AXIS))
	{
		return vdProperties.getStructureByKey(oFF.VizDefConstants.K_VALUE_AXIS);
	}
	return vdProperties.getStructureByKey(oFF.VizDefConstants.K_CATEGORY_AXIS);
};
oFF.GoogleChart.prototype.getAxisReferenceLines = function(vizDef, axisName)
{
	var vdAnalyticObjects = vizDef.getStructureByKey(oFF.VizDefConstants.K_ANALYTIC_OBJECTS);
	var vdReferenceLines = vdAnalyticObjects.getListByKey(oFF.VizDefConstants.K_REFERENCELINES);
	if (oFF.notNull(vdReferenceLines))
	{
		for (var i = 0; i < vdReferenceLines.size(); i++)
		{
			var feed = vdReferenceLines.getStructureAt(i);
			if (oFF.XString.isEqual(feed.getStringByKey(oFF.VizDefConstants.K_FEED), axisName))
			{
				var markers = feed.getListByKey(oFF.VizDefConstants.K_MARKERS);
				if (!oFF.PrUtils.isListEmpty(markers))
				{
					return markers;
				}
			}
		}
	}
	return null;
};
oFF.GoogleChart.prototype.isTicksVisible = function(vdAxis)
{
	var vdAxisTick = vdAxis.getStructureByKey(oFF.VizDefConstants.K_AXIS_TICK);
	return oFF.notNull(vdAxisTick) && vdAxisTick.getBooleanByKeyExt(oFF.VizDefConstants.K_VISIBLE, false);
};

oFF.RsHiChartRenderHelper = function() {};
oFF.RsHiChartRenderHelper.prototype = new oFF.XObject();
oFF.RsHiChartRenderHelper.prototype._ff_c = "RsHiChartRenderHelper";

oFF.RsHiChartRenderHelper.create = function(type, rs)
{
	var helper = null;
	var userPrefrence = null;
	if (oFF.notNull(rs))
	{
		var intermediatechartType = null;
		var vizDef = rs.getQueryModel().getVizManager().getVizDef();
		var globalDef = rs.getQueryModel().getVizManager().getGlobalDef();
		var chartType = oFF.XString.toLowerCase(type.getName());
		var secondChart = null;
		var isPolar = false;
		var isTimeseries = false;
		var innerRadius = "0%";
		var stackingType = null;
		if (oFF.XString.isEqual(chartType, oFF.VizDefConstants.K_COMB_BCL))
		{
			chartType = oFF.VizDefConstants.V_CHART_TYPE_COLUMN;
			secondChart = oFF.VizDefConstants.K_LINE;
		}
		else if (oFF.XString.isEqual(chartType, oFF.VizDefConstants.K_RADAR))
		{
			chartType = oFF.VizDefConstants.K_LINE;
			isPolar = true;
		}
		var inverted = false;
		if (oFF.notNull(vizDef))
		{
			var chart = vizDef.getStructureByKey(oFF.VizDefConstants.K_CHART);
			userPrefrence = vizDef.getStructureByKey(oFF.VizDefConstants.K_USER_PREFERENCES);
			if (oFF.notNull(chart))
			{
				intermediatechartType = chart.getStringByKey(oFF.VizDefConstants.K_TYPE);
				if (oFF.XString.isEqual(intermediatechartType, oFF.VizDefConstants.V_CHART_TYPE_BAR) || oFF.XString.isEqual(intermediatechartType, oFF.VizDefConstants.V_STACKED_BAR))
				{
					inverted = true;
				}
			}
			var chartPropertiesGeneral;
			var chartProperties = chart.getStructureByKey(oFF.VizDefConstants.K_PROPERTIES);
			if (oFF.notNull(chartProperties))
			{
				chartPropertiesGeneral = chartProperties.getStructureByKey(oFF.VizDefConstants.K_GENERAL);
				if (oFF.notNull(chartPropertiesGeneral))
				{
					if (chartPropertiesGeneral.containsKey(oFF.VizDefConstants.K_INVERTED))
					{
						inverted = chartPropertiesGeneral.getBooleanByKey(oFF.VizDefConstants.K_INVERTED);
					}
					if (chartPropertiesGeneral.containsKey(oFF.VizDefConstants.K_ORIENTATION))
					{
						inverted = oFF.XString.isEqual(chartPropertiesGeneral.getStringByKey(oFF.VizDefConstants.K_ORIENTATION), oFF.VizDefConstants.V_HORIZONTAL);
					}
					stackingType = chartPropertiesGeneral.getStringByKey(oFF.VizDefConstants.K_FULL_STACKING);
				}
			}
			if (oFF.notNull(userPrefrence))
			{
				chartPropertiesGeneral = userPrefrence.getStructureByKey(oFF.VizDefConstants.K_GENERAL);
				if (oFF.notNull(chartPropertiesGeneral))
				{
					if (chartPropertiesGeneral.containsKey(oFF.VizDefConstants.K_INVERTED))
					{
						inverted = chartPropertiesGeneral.getBooleanByKey(oFF.VizDefConstants.K_INVERTED);
					}
					if (chartPropertiesGeneral.containsKey(oFF.VizDefConstants.K_ORIENTATION))
					{
						inverted = oFF.XString.isEqual(chartPropertiesGeneral.getStringByKey(oFF.VizDefConstants.K_ORIENTATION), oFF.VizDefConstants.V_HORIZONTAL);
					}
					if (chartPropertiesGeneral.containsKey(oFF.VizDefConstants.K_FULL_STACKING))
					{
						stackingType = chartPropertiesGeneral.getStringByKey(oFF.VizDefConstants.K_FULL_STACKING);
					}
				}
			}
			if (oFF.XString.isEqual(intermediatechartType, oFF.VizDefConstants.K_MARIMEKKO))
			{
				chartType = oFF.VizDefConstants.K_VARIWIDE;
				stackingType = oFF.VizDefConstants.V_NORMAL;
				inverted = false;
			}
			else if (oFF.XString.isEqual(intermediatechartType, oFF.VizDefConstants.K_BAR_COLUMN))
			{
				stackingType = null;
				if (!inverted)
				{
					chartType = oFF.VizDefConstants.V_CHART_TYPE_COLUMN;
				}
				else
				{
					chartType = oFF.VizDefConstants.V_CHART_TYPE_BAR;
				}
			}
			else if (oFF.XString.isEqual(intermediatechartType, oFF.VizDefConstants.V_TYPE_CHART_DONUT))
			{
				stackingType = null;
				inverted = false;
				chartType = oFF.VizDefConstants.K_PIE;
				innerRadius = "50%";
			}
			else if (oFF.XString.isEqual(intermediatechartType, oFF.VizDefConstants.K_SCATTER_PLOT))
			{
				stackingType = null;
				inverted = false;
				chartType = oFF.VizDefConstants.K_SCATTER;
			}
			else if (oFF.XString.isEqual(intermediatechartType, oFF.VizDefConstants.K_RADAR))
			{
				stackingType = null;
				inverted = false;
				chartType = oFF.VizDefConstants.K_LINE;
				isPolar = true;
			}
			else if (oFF.XString.isEqual(intermediatechartType, oFF.VizDefConstants.K_METRIC))
			{
				stackingType = null;
				inverted = false;
				chartType = oFF.VizDefConstants.K_SOLID_GAUGE;
			}
			else if (oFF.XString.isEqual(intermediatechartType, oFF.VizDefConstants.K_AREA))
			{
				inverted = false;
				stackingType = oFF.VizDefConstants.V_NORMAL;
				chartType = oFF.VizDefConstants.K_AREA;
			}
			else if (oFF.XString.isEqual(intermediatechartType, oFF.VizDefConstants.K_STACKED_BAR) || oFF.XString.isEqual(intermediatechartType, oFF.VizDefConstants.K_STACKED_COLUMN))
			{
				if (oFF.isNull(stackingType))
				{
					stackingType = oFF.VizDefConstants.V_NORMAL;
				}
				if (oFF.XString.isEqual(intermediatechartType, oFF.VizDefConstants.K_STACKED_COLUMN) && !inverted)
				{
					chartType = oFF.VizDefConstants.V_CHART_TYPE_COLUMN;
				}
				else if (oFF.XString.isEqual(intermediatechartType, oFF.VizDefConstants.K_STACKED_BAR) && inverted)
				{
					chartType = oFF.VizDefConstants.V_CHART_TYPE_BAR;
				}
				else
				{
					chartType = oFF.VizDefConstants.V_CHART_TYPE_COLUMN;
				}
			}
			else if (oFF.XString.isEqual(intermediatechartType, oFF.VizDefConstants.K_COMB_STACKED_BCL))
			{
				chartType = oFF.VizDefConstants.V_CHART_TYPE_COLUMN;
				secondChart = oFF.VizDefConstants.K_LINE;
				stackingType = oFF.VizDefConstants.V_NORMAL;
			}
			else if (oFF.XString.isEqual(intermediatechartType, oFF.VizDefConstants.K_COMB_BCL))
			{
				chartType = oFF.VizDefConstants.V_CHART_TYPE_COLUMN;
				secondChart = oFF.VizDefConstants.K_LINE;
				stackingType = null;
			}
			else if (oFF.XString.isEqual(intermediatechartType, oFF.VizDefConstants.V_CHART_TYPE_BOXPLOT))
			{
				chartType = oFF.VizDefConstants.V_CHART_TYPE_BOXPLOT;
				stackingType = null;
				inverted = false;
			}
			else if (oFF.XString.isEqual(intermediatechartType, oFF.VizDefConstants.K_TIME_SERIES))
			{
				isTimeseries = true;
				chartType = oFF.VizDefConstants.K_LINE;
				stackingType = null;
				inverted = false;
			}
			else if (oFF.XString.isEqual(intermediatechartType, oFF.VizDefConstants.K_CLUSTER_BUBBLE))
			{
				chartType = oFF.VizDefConstants.K_PACKED_BUBBLE;
				stackingType = null;
				inverted = false;
			}
			else
			{
				chartType = oFF.XString.toLowerCase(vizDef.getStructureByKey(oFF.VizDefConstants.K_CHART).getStringByKey(oFF.VizDefConstants.K_TYPE));
				stackingType = null;
				inverted = false;
			}
		}
		var isCombinationChart = !oFF.XString.isEqual(null, secondChart);
		var isColumn = oFF.XString.isEqual(chartType, oFF.VizDefConstants.V_CHART_TYPE_COLUMN);
		var isBellcurve = oFF.XString.isEqual(chartType, oFF.VizDefConstants.V_CHART_TYPE_BELLCURVE);
		var isLine = oFF.XString.isEqual(chartType, oFF.VizDefConstants.K_LINE);
		var isBar = oFF.XString.isEqual(chartType, oFF.VizDefConstants.V_CHART_TYPE_BAR);
		var isSpline = oFF.XString.isEqual(chartType, oFF.VizDefConstants.K_SPLINE);
		var isArea = oFF.XString.isEqual(chartType, oFF.VizDefConstants.K_AREA);
		var isPie = oFF.XString.isEqual(chartType, oFF.VizDefConstants.K_PIE);
		var isWordcloud = oFF.XString.isEqual(chartType, oFF.VizDefConstants.K_WORDCLOUD);
		var isVariablepie = oFF.XString.isEqual(chartType, oFF.VizDefConstants.K_VARIPIE);
		var isVariwide = oFF.XString.isEqual(chartType, oFF.VizDefConstants.K_VARIWIDE);
		var isScatter = oFF.XString.isEqual(chartType, oFF.VizDefConstants.K_SCATTER);
		var isBubble = oFF.XString.isEqual(chartType, oFF.VizDefConstants.V_CHART_TYPE_BUBBLE);
		var isPackedBubble = oFF.XString.isEqual(chartType, oFF.VizDefConstants.K_PACKED_BUBBLE);
		var isHeatMap = oFF.XString.isEqual(chartType, oFF.VizDefConstants.K_HEATMAP);
		var isTreeMap = oFF.XString.isEqual(chartType, oFF.VizDefConstants.K_TREEMAP);
		var isBoxPlot = oFF.XString.isEqual(chartType, oFF.VizDefConstants.V_CHART_TYPE_BOXPLOT);
		var isMetric = oFF.XString.isEqual(chartType, oFF.VizDefConstants.K_SOLID_GAUGE);
		if (isLine || isBar || isSpline || isBellcurve || isColumn || isArea || isCombinationChart)
		{
			if (isTimeseries)
			{
				helper = new oFF.RsHiChartTimeSeriesHelper();
			}
			else
			{
				helper = new oFF.RsHiChartCategorialSeriesHelper();
			}
		}
		else if (isWordcloud)
		{
			helper = new oFF.RsHiChartWordcloudHelper();
		}
		else if (isPie || isVariablepie || isWordcloud)
		{
			helper = new oFF.RsHiChartPieHelper();
		}
		else if (isBoxPlot)
		{
			helper = new oFF.RsHiChartBoxplotHelper();
		}
		else if (isBubble || isScatter)
		{
			helper = new oFF.RsHiChartCorrelationHelper();
		}
		else if (isHeatMap)
		{
			helper = new oFF.RsHiChartHeatmapHelper();
		}
		else if (isTreeMap)
		{
			helper = new oFF.RsHiChartTreemapHelper();
		}
		else if (isMetric)
		{
			helper = new oFF.RsHiChartMetricHelper();
		}
		else if (isVariwide)
		{
			helper = new oFF.RsHiChartMarimekkoHelper();
		}
		else if (isPackedBubble)
		{
			helper = new oFF.RsHiChartClusterBubbleHelper();
		}
		else
		{
			helper = new oFF.RsHiChartUnsupportedHelper();
		}
		helper.setupBase(vizDef, globalDef, rs, chartType, secondChart, stackingType, innerRadius, isPolar, isCombinationChart, inverted);
		if (oFF.notNull(userPrefrence))
		{
			oFF.RsHiChartVizUserPrefrence.userPrefrence(helper.getChartData(), userPrefrence, chartType);
		}
	}
	return helper;
};
oFF.RsHiChartRenderHelper.prototype.m_vizDef = null;
oFF.RsHiChartRenderHelper.prototype.m_globalDef = null;
oFF.RsHiChartRenderHelper.prototype.m_chartType = null;
oFF.RsHiChartRenderHelper.prototype.m_polar = false;
oFF.RsHiChartRenderHelper.prototype.m_innerRadius = null;
oFF.RsHiChartRenderHelper.prototype.m_theChartData = null;
oFF.RsHiChartRenderHelper.prototype.m_inverted = false;
oFF.RsHiChartRenderHelper.prototype.m_stackingType = null;
oFF.RsHiChartRenderHelper.prototype.m_showLegend = false;
oFF.RsHiChartRenderHelper.prototype.m_colors = null;
oFF.RsHiChartRenderHelper.prototype.m_colorIndex = 0;
oFF.RsHiChartRenderHelper.prototype.getStackingType = function()
{
	return this.m_stackingType;
};
oFF.RsHiChartRenderHelper.prototype.isInverted = function()
{
	return this.m_inverted;
};
oFF.RsHiChartRenderHelper.prototype.getVizDef = function()
{
	return this.m_vizDef;
};
oFF.RsHiChartRenderHelper.prototype.isPolar = function()
{
	return this.m_polar;
};
oFF.RsHiChartRenderHelper.prototype.getGlobalDef = function()
{
	return this.m_globalDef;
};
oFF.RsHiChartRenderHelper.prototype.getChartData = function()
{
	return this.m_theChartData;
};
oFF.RsHiChartRenderHelper.prototype.getChartType = function()
{
	return this.m_chartType;
};
oFF.RsHiChartRenderHelper.prototype.isUnsupported = function()
{
	return false;
};
oFF.RsHiChartRenderHelper.prototype.isResponsive = function()
{
	return true;
};
oFF.RsHiChartRenderHelper.prototype.getInnerRadius = function()
{
	return this.m_innerRadius;
};
oFF.RsHiChartRenderHelper.prototype.m_secondChart = null;
oFF.RsHiChartRenderHelper.prototype.getSecondChart = function()
{
	return this.m_secondChart;
};
oFF.RsHiChartRenderHelper.prototype.setupBase = function(vizDef, globalDef, rs, chartType, secondChart, stackingTpye, innerRadius, isPolar, isCombinationChart, inverted)
{
	this.m_polar = isPolar;
	this.m_chartType = chartType;
	this.m_secondChart = secondChart;
	this.m_innerRadius = innerRadius;
	this.m_vizDef = vizDef;
	this.m_globalDef = globalDef;
	this.m_theChartData = oFF.PrFactory.createStructure();
	this.m_inverted = inverted;
	this.m_stackingType = stackingTpye;
	this.m_colorIndex = -1;
	var chartTypeInfo = this.m_theChartData.putNewStructure(oFF.VizDefConstants.K_CHART);
	if (this.m_inverted && !oFF.XString.isEqual(this.m_chartType, oFF.VizDefConstants.V_CHART_TYPE_BAR))
	{
		chartTypeInfo.putBoolean(oFF.VizDefConstants.K_INVERTED, true);
	}
	chartTypeInfo.putBoolean(oFF.VizDefConstants.K_POLAR, isPolar);
	chartTypeInfo.putString(oFF.VizDefConstants.K_TYPE, chartType);
	chartTypeInfo.putBoolean(oFF.VizDefConstants.K_ANIMATION, false);
	var chartlang = this.m_theChartData.putNewStructure(oFF.VizDefConstants.K_LANG);
	chartlang.putString(oFF.VizDefConstants.K_DECIMAL_POINT, ",");
	chartlang.putString(oFF.VizDefConstants.K_THOUSANDS_SEP, ".");
	var backgroundColor = "rgba(0,0,0,0)";
	chartTypeInfo.putString(oFF.VizDefConstants.K_BACKGROUND_COLOR, backgroundColor);
	if (oFF.notNull(vizDef))
	{
		backgroundColor = vizDef.getStringByKey(oFF.VizDefConstants.K_BBACKGROUND_COLOR);
		if (oFF.notNull(backgroundColor))
		{
			if (oFF.XString.size(backgroundColor) > 0)
			{
				chartTypeInfo.putString(oFF.VizDefConstants.K_BACKGROUND_COLOR, backgroundColor);
			}
		}
	}
	var chartTypeInfostyle = chartTypeInfo.putNewStructure(oFF.VizDefConstants.K_STYLE);
	chartTypeInfostyle.putString(oFF.VizDefConstants.K_FONT_FAMILY, "LatoWeb, 'Open Sans', 'Helvetica Neue', Helvetica, Arial, 'sans serif'");
	var boost = this.m_theChartData.putNewStructure(oFF.VizDefConstants.K_BOOST);
	var credits = this.m_theChartData.putNewStructure(oFF.VizDefConstants.K_CREDITS);
	credits.putBoolean(oFF.VizDefConstants.K_ENABLED, false);
	boost.putBoolean(oFF.VizDefConstants.K_USER_GPU_TRANSLATIONS, true);
	if (this.isUnsupported())
	{
		chartlang.putString(oFF.VizDefConstants.K_NO_DATA, "Chart not supported ");
		this.getChartData().putBoolean("fullscreenEnabled", false);
		return;
	}
	if (rs.hasErrors())
	{
		chartlang.putString(oFF.VizDefConstants.K_NO_DATA, "Olap query returned with errors ");
		this.getChartData().putBoolean(oFF.VizDefConstants.K_FULL_SCREEN_ENABLED, false);
		return;
	}
	oFF.RsHiChartVizUtils.vizProcessor(vizDef, chartTypeInfostyle, this.m_theChartData, chartType);
	if (this.isResponsive())
	{
		oFF.RsHiChartUtils.responsiveBuilder(chartType, this.m_theChartData);
	}
	var customFormatting = null;
	var feedMembers = null;
	if (oFF.notNull(vizDef))
	{
		customFormatting = oFF.RsVizAxisExtractor.extractCustomFormatting(vizDef, globalDef);
		feedMembers = vizDef.getStructureByKey("feedMembers");
	}
	if (oFF.isNull(feedMembers))
	{
		feedMembers = oFF.RsVizAxisExtractor.guessFeedMembers(rs, chartType, isCombinationChart);
	}
	var columnTuples = oFF.RsVizAxisExtractor.getTuplesFromColumnAxis(rs, feedMembers, customFormatting);
	var rowTuples = oFF.RsVizAxisExtractor.getTuplesFromRowAxis(rs, feedMembers, customFormatting);
	this.initializeColorList();
	this.prepareRendering();
	this.readResultSetData(columnTuples, rowTuples, rs);
	this.reiterateResultSet(columnTuples, rowTuples, rs);
	this.addColorList();
	oFF.RsHiChartVizUtils.addColorGradient(globalDef, vizDef, this.m_theChartData);
	oFF.RsHiChartVizUtils.checkShowLegend(vizDef, this.m_theChartData, chartType, this.isShowLegend());
	this.finishRendering();
};
oFF.RsHiChartRenderHelper.prototype.addColorList = function()
{
	var colors = this.m_theChartData.putNewList(oFF.VizDefConstants.K_COLORS);
	for (var cls = 0; cls < this.m_colors.size(); cls++)
	{
		colors.addString(this.m_colors.get(cls));
	}
};
oFF.RsHiChartRenderHelper.prototype.getCurrentColor = function()
{
	return this.getColorAt(this.m_colorIndex);
};
oFF.RsHiChartRenderHelper.prototype.getColorAt = function(index)
{
	if (index > 0 && this.m_colors.size() > index)
	{
		return this.m_colors.get(index);
	}
	return null;
};
oFF.RsHiChartRenderHelper.prototype.initializeColorList = function()
{
	this.m_colors = oFF.XListOfString.create();
	var colorCollector = oFF.XListOfString.create();
	if (oFF.notNull(this.m_vizDef))
	{
		var colorScheme = this.m_vizDef.getStructureByKey(oFF.VizDefConstants.K_COLOR_SCHEME);
		var colorSet = oFF.XHashSetOfString.create();
		var colorSync = this.m_globalDef.getStructureByKey(oFF.VizDefConstants.K_COLOR_SYNC);
		var colorBindingName = oFF.XStringBuffer.create();
		var chartDefBindings = this.m_vizDef.getStructureByKey(oFF.VizDefConstants.K_CHART).getListByKey(oFF.VizDefConstants.K_BINDINGS);
		for (var i = 0; i < chartDefBindings.size(); ++i)
		{
			var binding = chartDefBindings.getStructureAt(i);
			if (oFF.XString.isEqual(binding.getStringByKey(oFF.VizDefConstants.K_FEED), oFF.VizDefConstants.K_COLOR))
			{
				var colorSource = binding.getListByKey(oFF.VizDefConstants.K_SOURCE);
				if (colorSource.size() > 0)
				{
					for (var j = 0; j < colorSource.size(); ++j)
					{
						if (colorSource.getStructureAt(j).hasStringByKey(oFF.VizDefConstants.K_ID))
						{
							if (colorBindingName.length() !== 0)
							{
								colorBindingName.append("/");
							}
							var curColorSource = colorSource.getStructureAt(j);
							if (curColorSource.containsKey(oFF.VizDefConstants.K_DIMENSION))
							{
								colorBindingName.append(curColorSource.getStringByKey(oFF.VizDefConstants.K_DIMENSION));
							}
							else
							{
								colorBindingName.append(curColorSource.getStringByKey(oFF.VizDefConstants.K_ID));
							}
						}
					}
				}
			}
		}
		if (!this.m_vizDef.getStructureByKey(oFF.VizDefConstants.K_CHART).getBooleanByKeyExt(oFF.VizDefConstants.K_IS_EXCLUDE_COLOR_SYNC, false))
		{
			if (oFF.XStringUtils.isNotNullAndNotEmpty(colorBindingName.toString()) && oFF.XCollectionUtils.hasElements(colorSync))
			{
				var colorMap = colorSync.getStructureByKey(colorBindingName.toString());
				if (oFF.notNull(colorMap))
				{
					var curColors = colorMap.getListByKey(oFF.VizDefConstants.K_COLORS);
					for (var k = 0; k < curColors.size(); ++k)
					{
						colorCollector.add(curColors.getStringAt(k));
					}
				}
			}
		}
		if (oFF.XCollectionUtils.hasElements(colorScheme))
		{
			var palleteColors = colorScheme.getListByKey(oFF.VizDefConstants.K_PALETTE_COLORS);
			if (oFF.notNull(palleteColors))
			{
				for (var y = 0; y < palleteColors.size(); y++)
				{
					colorCollector.add(palleteColors.getStringAt(y));
				}
			}
		}
		if (colorCollector.size() < 5 && oFF.XCollectionUtils.hasElements(colorSync))
		{
			var colorKeys = colorSync.getKeysAsReadOnlyListOfStringSorted();
			for (var cki = 0; cki < colorKeys.size(); cki++)
			{
				var curColorKey = colorKeys.get(cki);
				if (!oFF.XString.isEqual(curColorKey, colorBindingName.toString()))
				{
					var colourMap = colorSync.getStructureByKey(curColorKey);
					if (oFF.notNull(colourMap))
					{
						var curColours = colourMap.getListByKey(oFF.VizDefConstants.K_COLORS);
						for (var z = 0; z < curColours.size(); ++z)
						{
							colorCollector.add(curColours.getStringAt(z));
						}
					}
				}
			}
		}
		if (colorCollector.size() < 5)
		{
			colorCollector.add(oFF.VizDefConstants.V_COLOR_1);
			colorCollector.add(oFF.VizDefConstants.V_COLOR_2);
			colorCollector.add(oFF.VizDefConstants.V_COLOR_3);
			colorCollector.add(oFF.VizDefConstants.V_COLOR_4);
			colorCollector.add(oFF.VizDefConstants.V_COLOR_5);
			colorCollector.add(oFF.VizDefConstants.V_COLOR_6);
			colorCollector.add(oFF.VizDefConstants.V_COLOR_7);
			colorCollector.add(oFF.VizDefConstants.V_COLOR_8);
			colorCollector.add(oFF.VizDefConstants.V_COLOR_9);
			colorCollector.add(oFF.VizDefConstants.V_COLOR_10);
			colorCollector.add(oFF.VizDefConstants.V_COLOR_11);
			colorCollector.add(oFF.VizDefConstants.V_COLOR_12);
			colorCollector.add(oFF.VizDefConstants.V_COLOR_13);
			colorCollector.add(oFF.VizDefConstants.V_COLOR_14);
			colorCollector.add(oFF.VizDefConstants.V_COLOR_15);
			colorCollector.add(oFF.VizDefConstants.V_COLOR_16);
			colorCollector.add(oFF.VizDefConstants.V_COLOR_17);
			colorCollector.add(oFF.VizDefConstants.V_COLOR_18);
		}
		colorSet.addAll(colorCollector);
		for (var cls = 0; cls < colorCollector.size(); cls++)
		{
			var curColor = colorCollector.get(cls);
			if (colorSet.contains(curColor))
			{
				colorSet.removeElement(curColor);
				this.m_colors.add(curColor);
			}
		}
	}
	else
	{
		this.m_colors.add(oFF.VizDefConstants.V_COLOR_1);
		this.m_colors.add(oFF.VizDefConstants.V_COLOR_2);
		this.m_colors.add(oFF.VizDefConstants.V_COLOR_3);
		this.m_colors.add(oFF.VizDefConstants.V_COLOR_4);
		this.m_colors.add(oFF.VizDefConstants.V_COLOR_5);
		this.m_colors.add(oFF.VizDefConstants.V_COLOR_6);
		this.m_colors.add(oFF.VizDefConstants.V_COLOR_7);
		this.m_colors.add(oFF.VizDefConstants.V_COLOR_8);
		this.m_colors.add(oFF.VizDefConstants.V_COLOR_9);
		this.m_colors.add(oFF.VizDefConstants.V_COLOR_10);
		this.m_colors.add(oFF.VizDefConstants.V_COLOR_11);
		this.m_colors.add(oFF.VizDefConstants.V_COLOR_12);
		this.m_colors.add(oFF.VizDefConstants.V_COLOR_13);
		this.m_colors.add(oFF.VizDefConstants.V_COLOR_14);
		this.m_colors.add(oFF.VizDefConstants.V_COLOR_15);
		this.m_colors.add(oFF.VizDefConstants.V_COLOR_16);
		this.m_colors.add(oFF.VizDefConstants.V_COLOR_17);
		this.m_colors.add(oFF.VizDefConstants.V_COLOR_18);
	}
};
oFF.RsHiChartRenderHelper.prototype.addColorAndPattern = function(colorOrig, pattern, dataLayer, chartType, individualDataPoint)
{
	if (!individualDataPoint)
	{
		this.m_colorIndex++;
	}
	var color = colorOrig;
	if (oFF.XStringUtils.isNullOrEmpty(color) && this.m_colorIndex < this.m_colors.size())
	{
		color = this.m_colors.get(this.m_colorIndex);
	}
	if (!oFF.XString.isEqual(chartType, oFF.VizDefConstants.K_LINE) && oFF.XStringUtils.isNotNullAndNotEmpty(pattern))
	{
		dataLayer.putStringNotNullAndNotEmpty(oFF.VizDefConstants.K_BORDER_COLOR, color);
		if (oFF.XString.isEqual(pattern, oFF.VizDefConstants.K_PATTERN_NON_FILL))
		{
			if (individualDataPoint && !oFF.XString.isEqual(chartType, oFF.VizDefConstants.K_AREA))
			{
				dataLayer.putString(oFF.VizDefConstants.K_COLOR, "#ffffff");
			}
			else
			{
				dataLayer.putStringNotNullAndNotEmpty(oFF.VizDefConstants.K_COLOR, color);
			}
		}
		else
		{
			var size = 0;
			var path = "";
			if (oFF.XString.isEqual(pattern, oFF.VizDefConstants.K_PATTERN_HATCHING1))
			{
				size = oFF.VizDefConstants.V_PATTERN_SIZE_HATCHING1;
				path = oFF.VizDefConstants.V_PATTERN_PATH_HATCHING1;
			}
			else if (oFF.XString.isEqual(pattern, oFF.VizDefConstants.K_PATTERN_HATCHING2))
			{
				size = oFF.VizDefConstants.V_PATTERN_SIZE_HATCHING2;
				path = oFF.VizDefConstants.V_PATTERN_PATH_HATCHING2;
			}
			else if (oFF.XString.isEqual(pattern, oFF.VizDefConstants.K_PATTERN_HATCHING3))
			{
				size = oFF.VizDefConstants.V_PATTERN_SIZE_HATCHING3;
				path = oFF.VizDefConstants.V_PATTERN_PATH_HATCHING3;
			}
			else if (oFF.XString.isEqual(pattern, oFF.VizDefConstants.K_PATTERN_HATCHING4))
			{
				size = oFF.VizDefConstants.V_PATTERN_SIZE_HATCHING4;
				path = oFF.VizDefConstants.V_PATTERN_PATH_HATCHING4;
			}
			else if (oFF.XString.isEqual(pattern, oFF.VizDefConstants.K_PATTERN_HATCHING5))
			{
				size = oFF.VizDefConstants.V_PATTERN_SIZE_HATCHING5;
				path = oFF.VizDefConstants.V_PATTERN_PATH_HATCHING5;
			}
			else if (oFF.XString.isEqual(pattern, oFF.VizDefConstants.K_PATTERN_HATCHING6))
			{
				size = oFF.VizDefConstants.V_PATTERN_SIZE_HATCHING6;
				path = oFF.VizDefConstants.V_PATTERN_PATH_HATCHING6;
			}
			else if (oFF.XString.isEqual(pattern, oFF.VizDefConstants.K_PATTERN_HATCHING7))
			{
				size = oFF.VizDefConstants.V_PATTERN_SIZE_HATCHING7;
				path = oFF.VizDefConstants.V_PATTERN_PATH_HATCHING7;
			}
			else if (oFF.XString.isEqual(pattern, oFF.VizDefConstants.K_PATTERN_HATCHING8))
			{
				size = oFF.VizDefConstants.V_PATTERN_SIZE_HATCHING8;
				path = oFF.VizDefConstants.V_PATTERN_PATH_HATCHING8;
			}
			if (size > 0 && oFF.XStringUtils.isNotNullAndNotEmpty(path))
			{
				var patternStructure = dataLayer.putNewStructure(oFF.VizDefConstants.K_COLOR).putNewStructure(oFF.VizDefConstants.K_PATTERN);
				patternStructure.putStringNotNullAndNotEmpty(oFF.VizDefConstants.K_COLOR, color);
				patternStructure.putInteger(oFF.VizDefConstants.K_WIDTH, size);
				patternStructure.putInteger(oFF.VizDefConstants.K_HEIGHT, size);
				patternStructure.putString(oFF.VizDefConstants.K_PATH, path);
			}
		}
	}
	else
	{
		dataLayer.putStringNotNullAndNotEmpty(oFF.VizDefConstants.K_COLOR, color);
	}
};
oFF.RsHiChartRenderHelper.prototype.reiterateResultSet = function(columnAxis, rowAxis, rs) {};
oFF.RsHiChartRenderHelper.prototype.isShowLegend = function()
{
	return this.m_showLegend;
};
oFF.RsHiChartRenderHelper.prototype.setShowLegend = function(showLegend)
{
	this.m_showLegend = showLegend;
};

oFF.RsMicroChartRenderer = function() {};
oFF.RsMicroChartRenderer.prototype = new oFF.XObject();
oFF.RsMicroChartRenderer.prototype._ff_c = "RsMicroChartRenderer";

oFF.RsMicroChartRenderer.create = function()
{
	return new oFF.RsMicroChartRenderer();
};
oFF.RsMicroChartRenderer.prototype.m_valueAxis = null;
oFF.RsMicroChartRenderer.prototype.m_seriesFilColor = null;
oFF.RsMicroChartRenderer.prototype.render = function(type, rs)
{
	var vizDef = rs.getQueryModel().getVizManager().getVizDef();
	var globalDef = rs.getQueryModel().getVizManager().getGlobalDef();
	var chartJson = oFF.PrFactory.createStructure();
	if (oFF.notNull(vizDef))
	{
		var chartDef = vizDef.getStructureByKey("chart");
		if (oFF.notNull(chartDef))
		{
			if (oFF.XString.isEqual(chartDef.getStringByKey("type"), "barcolumn"))
			{
				this.renderColumnChart(rs, chartJson, vizDef);
			}
		}
		chartJson.put("vizDef", vizDef);
		chartJson.put("globalDef", globalDef);
	}
	else
	{
		this.renderColumnChart(rs, chartJson, null);
	}
	return chartJson;
};
oFF.RsMicroChartRenderer.prototype.renderColumnChart = function(rs, chartJson, vizDef)
{
	chartJson.putString("chart", "Column");
	chartJson.putBoolean("allowColumnLabels", true);
	var columnList = chartJson.putNewList("columns");
	this.extractValueAxisFromVizDef(vizDef);
	this.extractSeriesColorsFromVizDef(vizDef);
	this.generateColumns(rs, columnList);
};
oFF.RsMicroChartRenderer.prototype.generateColumns = function(rs, columnList)
{
	var colAxis = rs.getCursorColumnsAxis();
	colAxis.setTupleCursorBeforeStart();
	var colCounter = 0;
	while (colAxis.hasNextTuple())
	{
		var colLabel = null;
		var colVal = 0;
		var colDisplayVal = null;
		var colHierarchyKey = null;
		var debugAllFieldValues = "";
		colAxis.nextTuple();
		while (colAxis.hasNextTupleElement())
		{
			colAxis.nextTupleElement();
			while (colAxis.hasNextFieldValue())
			{
				colAxis.nextFieldValue();
				var pt = colAxis.getField().getPresentationType();
				var formattedValue = colAxis.getFormattedValue();
				debugAllFieldValues = oFF.XStringUtils.concatenate5(pt.getName(), ":", formattedValue, " - ", debugAllFieldValues);
				if (pt.isTypeOf(oFF.PresentationType.SHORT_TEXT) || pt.isTypeOf(oFF.PresentationType.LONG_TEXT) || pt.isTypeOf(oFF.PresentationType.MEDIUM_TEXT) || pt.isTypeOf(oFF.PresentationType.HIERARCHY_TEXT))
				{
					colLabel = formattedValue;
				}
				else if (oFF.isNull(colLabel) && pt.isTypeOf(oFF.PresentationType.DISPLAY_KEY))
				{
					colLabel = formattedValue;
				}
				if (pt.isTypeOf(oFF.PresentationType.HIERARCHY_KEY))
				{
					colHierarchyKey = formattedValue;
				}
			}
		}
		var tmpDataCell = rs.getDataCell(colCounter, 0);
		colVal = tmpDataCell.getDouble();
		colDisplayVal = tmpDataCell.getFormattedValue();
		colCounter++;
		var memberIndex = this.getIndexOfMember(colHierarchyKey);
		var columnColor = this.getColorForMember(colHierarchyKey);
		var tmpCol = oFF.PrStructure.create();
		if (memberIndex !== -1 && columnList.size() > memberIndex)
		{
			columnList.insert(memberIndex, tmpCol);
		}
		else
		{
			columnList.add(tmpCol);
		}
		tmpCol.putDouble("value", colVal);
		tmpCol.putString("displayValue", colDisplayVal);
		tmpCol.putString("label", colLabel);
		if (oFF.notNull(columnColor))
		{
			tmpCol.putString("color", columnColor);
		}
		tmpCol.putString("hierarchyKey", colHierarchyKey);
	}
};
oFF.RsMicroChartRenderer.prototype.extractValueAxisFromVizDef = function(vizDef)
{
	if (oFF.notNull(vizDef))
	{
		var feedMembers = vizDef.getStructureByKey("feedMembers");
		if (oFF.notNull(feedMembers))
		{
			this.m_valueAxis = feedMembers.getListByKey("valueAxis");
		}
	}
};
oFF.RsMicroChartRenderer.prototype.getIndexOfMember = function(hierarchyKey)
{
	if (oFF.notNull(this.m_valueAxis))
	{
		return this.m_valueAxis.getIndex(oFF.PrString.createWithValue(hierarchyKey));
	}
	return -1;
};
oFF.RsMicroChartRenderer.prototype.extractSeriesColorsFromVizDef = function(vizDef)
{
	this.m_seriesFilColor = oFF.PrStructure.create();
	if (oFF.notNull(vizDef))
	{
		var userPreferences = vizDef.getStructureByKey("userPreferences");
		if (oFF.notNull(userPreferences))
		{
			var series = userPreferences.getStructureByKey("series");
			if (oFF.notNull(series))
			{
				var fillColor = series.getStructureByKey("fillColor");
				if (oFF.notNull(fillColor))
				{
					var fillColorKeysIterator = fillColor.getKeysAsIteratorOfString();
					while (fillColorKeysIterator.hasNext())
					{
						var tmpFillColorKey = fillColorKeysIterator.next();
						var tmpColorList = fillColor.getListByKey(tmpFillColorKey);
						for (var a = 0; a < tmpColorList.size(); a++)
						{
							var tmpSecondaryList = tmpColorList.getListAt(a);
							if (tmpSecondaryList.size() > 0)
							{
								var tmpThirdList = tmpSecondaryList.getListAt(0);
								if (tmpThirdList.size() > 0)
								{
									var tmpColorMember = tmpThirdList.getStructureAt(0);
									if (oFF.notNull(tmpColorMember))
									{
										var tmpEntityId = tmpColorMember.getStructureByKey("entityId");
										if (oFF.notNull(tmpEntityId))
										{
											var memberId = tmpEntityId.getStringByKeyExt("id", null);
											if (oFF.notNull(memberId))
											{
												var validColor = oFF.XString.replace(tmpFillColorKey, "\"", "");
												this.m_seriesFilColor.putString(memberId, validColor);
											}
										}
									}
								}
							}
						}
					}
				}
			}
		}
	}
};
oFF.RsMicroChartRenderer.prototype.getColorForMember = function(hierarchyKey)
{
	if (oFF.notNull(this.m_seriesFilColor) && this.m_seriesFilColor.size() > 0)
	{
		return this.m_seriesFilColor.getStringByKey(hierarchyKey);
	}
	return null;
};

oFF.RsHiChartVizEvents = {

	create:function()
	{
			return new oFF.RsHiChartVizEvents();
	},
	addEvents:function(theChartData, chartType, vizDef)
	{
			if (oFF.XString.isEqual(chartType, oFF.VizDefConstants.V_CHART_TYPE_BUBBLE) || oFF.XString.isEqual(chartType, oFF.VizDefConstants.K_SCATTER))
		{
			var onLoadFuncStr = "function(){var newXMinArr=[];var newXMaxArr=[];var newYMinArr=[];var newYMaxArr=[];for(var tmpSeriesIndex in this.series){newXMinArr.push(Math.min.apply(Math,this.series[tmpSeriesIndex].xData));newXMaxArr.push(Math.max.apply(Math,this.series[tmpSeriesIndex].xData));newYMinArr.push(Math.min.apply(Math,this.series[tmpSeriesIndex].yData));newYMaxArr.push(Math.max.apply(Math,this.series[tmpSeriesIndex].yData))} let maxX=Math.max.apply(Math,newXMaxArr);let minX=Math.min.apply(Math,newXMinArr);let maxY=Math.max.apply(Math,newYMaxArr);let minY=Math.min.apply(Math,newYMinArr);var intervalX=this.xAxis[0].tickInterval;var intervalY=this.yAxis[0].tickInterval;this.xAxis[0].update({max:1.1*maxX,min:Math.min(0,(minX)-intervalX/2)},!1);this.yAxis[0].update({max:1.1*maxY,min:Math.min(0,(minY)-intervalY/2)},!1);this.redraw(!1)}";
			var chartStruct = theChartData.getStructureByKey(oFF.VizDefConstants.K_CHART);
			if (oFF.notNull(chartStruct))
			{
				var eventsStruct = chartStruct.putNewStructure("events");
				eventsStruct.putString("load", onLoadFuncStr);
			}
		}
		return theChartData;
	}
};

oFF.RsVizAxis = function() {};
oFF.RsVizAxis.prototype = new oFF.XObject();
oFF.RsVizAxis.prototype._ff_c = "RsVizAxis";

oFF.RsVizAxis.create = function()
{
	var newInstance = new oFF.RsVizAxis();
	newInstance.m_numberFormatingInfosByFeed = oFF.XHashMapByString.create();
	newInstance.m_elements = oFF.XList.create();
	newInstance.m_availableFeedTypes = oFF.XHashSetOfString.create();
	return newInstance;
};
oFF.RsVizAxis.prototype.m_elements = null;
oFF.RsVizAxis.prototype.m_availableFeedTypes = null;
oFF.RsVizAxis.prototype.m_numberFormatingInfosByFeed = null;
oFF.RsVizAxis.prototype.m_numberFormattingInfo = null;
oFF.RsVizAxis.prototype.releaseObject = function()
{
	this.m_elements = oFF.XObjectExt.release(this.m_elements);
	this.m_availableFeedTypes = oFF.XObjectExt.release(this.m_availableFeedTypes);
	this.m_numberFormattingInfo = null;
	oFF.XObject.prototype.releaseObject.call( this );
};
oFF.RsVizAxis.prototype.getFormattedValue = function(baseFeed, feedTuple, dataCell)
{
	var fallBackFormattingInfo = this.m_numberFormatingInfosByFeed.getByKey(baseFeed);
	return oFF.RsVizAxisExtractor.getFormattedValue(dataCell, feedTuple.getNumberFormattingInfo(), fallBackFormattingInfo);
};
oFF.RsVizAxis.prototype.getDecimalPlaces = function(baseFeed)
{
	var selectedNumberFormattingInfo = this.m_numberFormatingInfosByFeed.getByKey(baseFeed);
	if (oFF.notNull(selectedNumberFormattingInfo))
	{
		return selectedNumberFormattingInfo.getMaxDecimalPlaces();
	}
	return this.m_numberFormattingInfo.getMaxDecimalPlaces();
};
oFF.RsVizAxis.prototype.getNumericShift = function(baseFeed)
{
	var selectedNumberFormattingInfo = this.m_numberFormatingInfosByFeed.getByKey(baseFeed);
	if (oFF.notNull(selectedNumberFormattingInfo))
	{
		return selectedNumberFormattingInfo.getNumericShift();
	}
	return this.m_numberFormattingInfo.getNumericShift();
};
oFF.RsVizAxis.prototype.getScaledValue = function(baseFeed, feedTuple, dataCell)
{
	var fallBackFormattingInfo = this.m_numberFormatingInfosByFeed.getByKey(baseFeed);
	return oFF.RsVizAxisExtractor.getScaledValue(dataCell, feedTuple.getNumberFormattingInfo(), fallBackFormattingInfo);
};
oFF.RsVizAxis.prototype.addElement = function(element)
{
	this.m_elements.add(element);
	var availableFeedTypes = element.getAvailableFeedTypes();
	this.m_availableFeedTypes.addAll(availableFeedTypes);
	var newNumberFormattingInfo = element.getNumberFormattingInfo();
	if (oFF.isNull(this.m_numberFormattingInfo) || this.m_numberFormattingInfo.isUseFormattingFromDataCell())
	{
		this.m_numberFormattingInfo = newNumberFormattingInfo;
	}
	var feedTypeIterator = availableFeedTypes.getIterator();
	while (feedTypeIterator.hasNext())
	{
		var curFeedType = feedTypeIterator.next();
		var curNumberFormattingInfo = this.m_numberFormatingInfosByFeed.getByKey(curFeedType);
		if (oFF.isNull(curNumberFormattingInfo) || curNumberFormattingInfo.isUseFormattingFromDataCell())
		{
			this.m_numberFormatingInfosByFeed.put(curFeedType, newNumberFormattingInfo);
		}
	}
};
oFF.RsVizAxis.prototype.getExtendedPrettyNamesForFeed = function(unique, includeTotals, feedSelector, extensions)
{
	var list = oFF.XListOfString.create();
	if (oFF.XStringUtils.isNotNullAndNotEmpty(feedSelector))
	{
		list.add(feedSelector);
	}
	return this.getExtendedPrettyNamesForFeeds(unique, includeTotals, list, extensions);
};
oFF.RsVizAxis.prototype.getExtendedPrettyNamesForFeeds = function(unique, includeTotals, feedSelectorOrig, extensions)
{
	var feedSelector = oFF.XListOfString.create();
	feedSelector.addAll(feedSelectorOrig);
	var availableFeedIterator;
	if (oFF.XCollectionUtils.hasElements(extensions))
	{
		availableFeedIterator = extensions.getIterator();
	}
	else
	{
		availableFeedIterator = this.m_availableFeedTypes.getIterator();
	}
	while (availableFeedIterator.hasNext())
	{
		var feed = availableFeedIterator.next();
		if (!feedSelectorOrig.contains(feed) && this.getPrettyNamesForFeed(true, includeTotals, feed).size() > 1)
		{
			feedSelector.add(feed);
		}
	}
	return this.getPrettyNamesForFeeds(unique, includeTotals, feedSelector);
};
oFF.RsVizAxis.prototype.getPrettyNamesForFeeds = function(unique, includeTotals, feedSelector)
{
	var result = oFF.XListOfString.create();
	var keyResult = oFF.XListOfString.create();
	for (var i = 0; i < this.m_elements.size(); i++)
	{
		var prettyResult = this.m_elements.get(i).getPrettyText(feedSelector);
		var prettyKeyResult = this.m_elements.get(i).getPrettyKeyText(feedSelector);
		if (oFF.XStringUtils.isNotNullAndNotEmpty(prettyResult))
		{
			if (!unique || !keyResult.contains(prettyKeyResult) && (includeTotals || !this.m_elements.get(i).isTotal()))
			{
				result.add(prettyResult);
				keyResult.add(prettyKeyResult);
			}
		}
	}
	return result;
};
oFF.RsVizAxis.prototype.getFormattedNamesForFeeds = function(unique, includeTotals, feedSelector)
{
	var result = oFF.XListOfString.create();
	var keyResult = oFF.XListOfString.create();
	for (var i = 0; i < this.m_elements.size(); i++)
	{
		var prettyResult = this.m_elements.get(i).getFormattedText(feedSelector);
		var prettyKeyResult = this.m_elements.get(i).getPrettyKeyText(feedSelector);
		if (oFF.XStringUtils.isNotNullAndNotEmpty(prettyResult))
		{
			if (!unique || !keyResult.contains(prettyKeyResult) && (includeTotals || !this.m_elements.get(i).isTotal()))
			{
				result.add(prettyResult);
				keyResult.add(prettyKeyResult);
			}
		}
	}
	return result;
};
oFF.RsVizAxis.prototype.getPrettyNamesForFeedsExclude = function(unique, includeTotals, feedSelector, excludeFeeds)
{
	var result = oFF.XListOfString.create();
	var keyResult = oFF.XListOfString.create();
	for (var i = 0; i < this.m_elements.size(); i++)
	{
		var prettyResult = this.m_elements.get(i).getPrettyTextExclude(feedSelector, excludeFeeds);
		var prettyKeyResult = this.m_elements.get(i).getPrettyKeyText(feedSelector);
		if (oFF.XStringUtils.isNotNullAndNotEmpty(prettyResult))
		{
			if (!unique || !keyResult.contains(prettyKeyResult) && (includeTotals || !this.m_elements.get(i).isTotal()))
			{
				result.add(prettyResult);
				keyResult.add(prettyKeyResult);
			}
		}
	}
	return result;
};
oFF.RsVizAxis.prototype.getMatchingFeedSubList = function(feedSelector)
{
	var result = oFF.XListOfString.create();
	for (var j = 0; j < feedSelector.size(); j++)
	{
		for (var i = 0; i < this.m_elements.size(); i++)
		{
			if (this.m_elements.get(i).isSelectedByString(feedSelector.get(j)))
			{
				result.add(feedSelector.get(j));
				break;
			}
		}
	}
	return result;
};
oFF.RsVizAxis.prototype.hasTupleForFeed = function(feed)
{
	for (var i = 0; i < this.m_elements.size(); i++)
	{
		if (this.m_elements.get(i).isSelectedByString(feed))
		{
			return true;
		}
	}
	return false;
};
oFF.RsVizAxis.prototype.getTupleForFeed = function(feed)
{
	for (var i = 0; i < this.m_elements.size(); i++)
	{
		if (this.m_elements.get(i).isSelectedByString(feed))
		{
			return this.m_elements.get(i);
		}
	}
	return null;
};
oFF.RsVizAxis.prototype.getMatchingTupleIndicesForMemberNameAndFeed = function(memberNames, feed)
{
	var result = oFF.XList.create();
	for (var h = 0; h < this.m_elements.size(); h++)
	{
		var selected = 2;
		var curElement = this.m_elements.get(h);
		if (curElement.isSelectedByString(feed))
		{
			for (var j = 0; j < memberNames.size(); j++)
			{
				var curMemberName = memberNames.get(j);
				if (!curElement.getMemberKeys().contains(curMemberName))
				{
					selected--;
				}
			}
			if (selected > 0)
			{
				result.add(oFF.XIntegerValue.create(h));
			}
		}
	}
	return result;
};
oFF.RsVizAxis.prototype.getMatchingTupleIndicesForMemberNamesAndSuffix = function(memberNames, suffix)
{
	for (var i = 0; i < this.m_elements.size(); i++)
	{
		var selected = true;
		var matchSuffix = false;
		var curElement = this.m_elements.get(i);
		for (var j = 0; j < memberNames.size(); j++)
		{
			var curFeedSelector = memberNames.get(j);
			var matchCurrentSuffix = curElement.isSelectedByString(oFF.XStringUtils.concatenate2(curFeedSelector, suffix));
			matchSuffix = matchCurrentSuffix || matchSuffix;
			if (!curElement.getMemberKeys().contains(curFeedSelector) && !matchCurrentSuffix)
			{
				selected = false;
				break;
			}
		}
		if (selected && matchSuffix)
		{
			return i;
		}
	}
	return -1;
};
oFF.RsVizAxis.prototype.getTupleIndexForMemberName = function(memberName)
{
	var list = oFF.XList.create();
	for (var i = 0; i < this.m_elements.size(); i++)
	{
		if (this.m_elements.get(i).getMemberKeys().contains(memberName))
		{
			list.add(oFF.XIntegerValue.create(i));
		}
	}
	return list;
};
oFF.RsVizAxis.prototype.getTupleIndexForMemberNames = function(memberNames)
{
	var list = oFF.XList.create();
	for (var i = 0; i < this.m_elements.size(); i++)
	{
		var candidate = true;
		for (var j = 0; j < memberNames.size(); j++)
		{
			var member = memberNames.get(j);
			if (!this.m_elements.get(i).getMemberKeys().contains(member))
			{
				candidate = false;
				break;
			}
		}
		if (candidate)
		{
			list.add(oFF.XIntegerValue.create(i));
		}
	}
	return list;
};
oFF.RsVizAxis.prototype.getIndicesGroupedByFeed = function(groupingFeed)
{
	var map = oFF.XHashMapByString.create();
	for (var i = 0; i < this.getTuplesCount(); i++)
	{
		var currentTuple = this.getTupleAt(i);
		var currentGroupingFeed = currentTuple.getPrettyText(groupingFeed);
		if (!map.containsKey(currentGroupingFeed))
		{
			map.put(currentGroupingFeed, oFF.XList.create());
		}
		map.getByKey(currentGroupingFeed).add(oFF.XIntegerValue.create(i));
	}
	return map;
};
oFF.RsVizAxis.prototype.getIndicesGroupedByFeedAndOrdered = function(groupingFeed, orderingFeed)
{
	var map = oFF.XHashMapByString.create();
	var list = this.getIndicesByFeedOrder(orderingFeed);
	for (var i = 0; i < list.size(); i++)
	{
		var currentIndex = list.get(i);
		var currentTuple = this.getTupleAt(currentIndex.getInteger());
		var currentGroupingFeed = currentTuple.getPrettyText(groupingFeed);
		if (!map.containsKey(currentGroupingFeed))
		{
			map.put(currentGroupingFeed, oFF.XList.create());
		}
		map.getByKey(currentGroupingFeed).add(currentIndex);
	}
	return map;
};
oFF.RsVizAxis.prototype.getIndicesByFeedOrder = function(feedSelector)
{
	var list = oFF.XList.create();
	for (var h = 0; h < feedSelector.size(); h++)
	{
		var currentFeed = feedSelector.get(h);
		var currentBorder = list.size();
		for (var i = 0; i < this.m_elements.size(); i++)
		{
			var currentElement = this.m_elements.get(i);
			if (currentElement.isSelectedByString(currentFeed))
			{
				var j = list.size();
				while (j > currentBorder && currentElement.compareTo(this.m_elements.get(list.get(j - 1).getInteger())) < 0)
				{
					j--;
				}
				list.insert(j, oFF.XIntegerValue.create(i));
			}
		}
	}
	return list;
};
oFF.RsVizAxis.prototype.getPrettyNamesForFeed = function(unique, includeTotals, feedSelector)
{
	var list = oFF.XListOfString.create();
	if (oFF.XStringUtils.isNotNullAndNotEmpty(feedSelector))
	{
		list.add(feedSelector);
	}
	return this.getPrettyNamesForFeeds(unique, includeTotals, list);
};
oFF.RsVizAxis.prototype.getFormattedNamesForFeed = function(unique, includeTotals, feedSelector)
{
	var list = oFF.XListOfString.create();
	if (oFF.XStringUtils.isNotNullAndNotEmpty(feedSelector))
	{
		list.add(feedSelector);
	}
	return this.getFormattedNamesForFeeds(unique, includeTotals, list);
};
oFF.RsVizAxis.prototype.getPrettyNamesForFeedExclude = function(unique, includeTotals, feedSelector, excludeFeeds)
{
	var list = oFF.XListOfString.create();
	if (oFF.XStringUtils.isNotNullAndNotEmpty(feedSelector))
	{
		list.add(feedSelector);
	}
	return this.getPrettyNamesForFeedsExclude(unique, includeTotals, list, excludeFeeds);
};
oFF.RsVizAxis.prototype.getLabelsForFeed = function(unique, includeTotals, withHierarchy, feedSelector)
{
	var list = oFF.XListOfString.create();
	if (oFF.XStringUtils.isNotNullAndNotEmpty(feedSelector))
	{
		list.add(feedSelector);
	}
	return this.getLabelsForFeeds(unique, includeTotals, withHierarchy, list);
};
oFF.RsVizAxis.prototype.getLabelsForFeeds = function(unique, includeTotals, withHierarchy, feedSelector)
{
	var container = oFF.XHashSetOfString.create();
	var result = oFF.XList.create();
	for (var i = 0; i < this.m_elements.size(); i++)
	{
		var prettyResult = this.m_elements.get(i).getLabel(withHierarchy ? this : null, feedSelector);
		if (oFF.notNull(prettyResult))
		{
			if (!unique || !container.contains(prettyResult.getCompoundId()) && (includeTotals || !this.m_elements.get(i).isTotal()))
			{
				result.add(prettyResult);
				container.add(prettyResult.getCompoundId());
			}
		}
	}
	return result;
};
oFF.RsVizAxis.prototype.getLabels = function(unique, includeTotals, withHierarchy)
{
	var container = oFF.XHashSetOfString.create();
	var result = oFF.XList.create();
	for (var i = 0; i < this.m_elements.size(); i++)
	{
		var prettyResult = this.m_elements.get(i).getLabel(withHierarchy ? this : null, null);
		if (oFF.isNull(prettyResult))
		{
			prettyResult = this.m_elements.get(i).getDefaultLabel(withHierarchy ? this : null);
		}
		if (oFF.notNull(prettyResult))
		{
			if (!unique || !container.contains(prettyResult.getCompoundId()) && (includeTotals || !this.m_elements.get(i).isTotal()))
			{
				container.add(prettyResult.getCompoundId());
				result.add(prettyResult);
			}
		}
	}
	return result;
};
oFF.RsVizAxis.prototype.getPrettyNames = function(unique, includeTotals)
{
	var result = oFF.XListOfString.create();
	for (var i = 0; i < this.m_elements.size(); i++)
	{
		var prettyResult = this.m_elements.get(i).getPrettyText(null);
		if (oFF.XStringUtils.isNullOrEmpty(prettyResult))
		{
			prettyResult = this.m_elements.get(i).getPrettyDefaultText();
		}
		if (oFF.XStringUtils.isNotNullAndNotEmpty(prettyResult))
		{
			if (!unique || !result.contains(prettyResult) && (includeTotals || !this.m_elements.get(i).isTotal()))
			{
				result.add(prettyResult);
			}
		}
	}
	return result;
};
oFF.RsVizAxis.prototype.getFormattedNames = function(unique, includeTotals)
{
	var result = oFF.XListOfString.create();
	for (var i = 0; i < this.m_elements.size(); i++)
	{
		var prettyResult = this.m_elements.get(i).getFormattedText(null);
		if (oFF.XStringUtils.isNullOrEmpty(prettyResult))
		{
			prettyResult = this.m_elements.get(i).getFormattedDefaultText();
		}
		if (oFF.XStringUtils.isNotNullAndNotEmpty(prettyResult))
		{
			if (!unique || !result.contains(prettyResult) && (includeTotals || !this.m_elements.get(i).isTotal()))
			{
				result.add(prettyResult);
			}
		}
	}
	return result;
};
oFF.RsVizAxis.prototype.getExtendedPrettyNames = function(unique, includeTotals)
{
	return this.getExtendedPrettyNamesForFeed(unique, includeTotals, null, null);
};
oFF.RsVizAxis.prototype.toString = function()
{
	return oFF.XStringUtils.concatenate3(this.m_elements.toString(), ":::", this.m_availableFeedTypes.toString());
};
oFF.RsVizAxis.prototype.getTuplesCount = function()
{
	return this.m_elements.size();
};
oFF.RsVizAxis.prototype.getTupleAt = function(i)
{
	return i > -1 && i < this.m_elements.size() ? this.m_elements.get(i) : null;
};
oFF.RsVizAxis.prototype.getFormattedDateList = function()
{
	var result = oFF.XListOfString.create();
	var i = 0;
	var dateFound = false;
	for (i = 0; i < this.m_elements.size(); i++)
	{
		var curDate = this.m_elements.get(i).getFormattedDate();
		if (oFF.notNull(curDate))
		{
			dateFound = true;
		}
		result.add(curDate);
	}
	if (dateFound)
	{
		return result;
	}
	return null;
};
oFF.RsVizAxis.prototype.getDateList = function()
{
	var i = 0;
	var fallbackLevel = 0;
	var dateFound = false;
	for (; fallbackLevel < 4; fallbackLevel++)
	{
		var result = oFF.XList.create();
		for (i = 0; i < this.m_elements.size(); i++)
		{
			var curDate = this.m_elements.get(i).getDate(fallbackLevel);
			if (oFF.notNull(curDate))
			{
				dateFound = true;
			}
			result.add(curDate);
		}
		if (dateFound)
		{
			return result;
		}
	}
	return null;
};
oFF.RsVizAxis.prototype.getDimensionsForFeed = function(feed)
{
	var list = oFF.XListOfString.create();
	list.add(feed);
	return this.getDimensionsForFeeds(list);
};
oFF.RsVizAxis.prototype.getDimensionsForFeeds = function(feeds)
{
	var result = oFF.XListOfString.create();
	for (var i = 0; i < this.m_elements.size(); i++)
	{
		var subDimensions = this.m_elements.get(i).getDimensionTextsForFeeds(feeds);
		for (var j = 0; j < subDimensions.size(); j++)
		{
			if (!result.contains(subDimensions.get(j)))
			{
				result.add(subDimensions.get(j));
			}
		}
	}
	return result;
};
oFF.RsVizAxis.prototype.getFeedDimensionTuple = function(selectorList)
{
	for (var i = 0; i < this.m_elements.size(); i++)
	{
		var dimensionNames = this.m_elements.get(i).getDimensionNamesForFeeds(selectorList);
		var resultBuffer = oFF.XStringBuffer.create();
		for (var j = 0; j < dimensionNames.size(); j++)
		{
			resultBuffer.append(dimensionNames.get(j));
			resultBuffer.append("/");
		}
		var resultString = resultBuffer.toString();
		if (oFF.XStringUtils.isNotNullAndNotEmpty(resultString))
		{
			return oFF.XString.substring(resultString, 0, oFF.XString.size(resultString) - 1);
		}
	}
	return "";
};

oFF.RsVizAxisExtractor = {

	getTuplesFromRowAxis:function(rs, feedMembers, customFormatting)
	{
			return oFF.RsVizAxisExtractor.getTuplesFromAxis(rs, rs.getCursorRowsAxis(), true, feedMembers, customFormatting);
	},
	getTuplesFromColumnAxis:function(rs, feedMembers, customFormatting)
	{
			return oFF.RsVizAxisExtractor.getTuplesFromAxis(rs, rs.getCursorColumnsAxis(), false, feedMembers, customFormatting);
	},
	getTuplesFromAxis:function(rs, cursorAxis, isRow, feedMembers, customFormatting)
	{
			var result = oFF.RsVizAxis.create();
		var dimensionForMeasures = rs.getQueryModel().getAccountDimension();
		if (oFF.isNull(dimensionForMeasures))
		{
			dimensionForMeasures = rs.getQueryModel().getMeasureDimension();
		}
		cursorAxis.setTupleCursorBeforeStart();
		var i = 0;
		while (cursorAxis.hasNextTuple())
		{
			cursorAxis.nextTuple();
			var cellPrototype = null;
			if (isRow)
			{
				cellPrototype = rs.getDataCell(0, i);
			}
			else
			{
				cellPrototype = rs.getDataCell(i, 0);
			}
			var decimalPlaces = cellPrototype.getDecimalPlaces();
			var scalingFactor = cellPrototype.getScalingFactor();
			var showSignAs = cellPrototype.getFormatString();
			var defaultFormatting = oFF.RsVizNumberFormattingInfo.createNumberFormat(scalingFactor, decimalPlaces, decimalPlaces, showSignAs, scalingFactor === 0);
			var feedTuple = oFF.RsVizFeedTuple.createTuple();
			feedTuple.setNumberFormattingInfo(defaultFormatting);
			while (cursorAxis.hasNextTupleElement())
			{
				var memberType = cursorAxis.nextTupleElement().getDimensionMemberType();
				var subFeedTypes = oFF.RsVizAxisExtractor.getAxisMemberFeedTypes(cursorAxis, feedMembers);
				feedTuple.addElement(oFF.RsVizAxisExtractor.createTupleElement(cursorAxis, dimensionForMeasures, subFeedTypes, customFormatting, feedTuple, memberType));
			}
			result.addElement(feedTuple);
			i++;
		}
		return result;
	},
	createTupleElement:function(cursorAxis, dimensionForMeasures, subFeedTypes, memberFormatMap, feedTuple, memberType)
	{
			cursorAxis.setFieldValueCursorBeforeStart();
		var text = "";
		var key = "";
		var dimensionmember = null;
		var displayLevel = 0;
		var parentIndex = -1;
		var drillState = oFF.DrillState.LEAF;
		var formattedValueList = oFF.XListOfString.create();
		var valueList = oFF.XList.create();
		var valueTypeList = oFF.XList.create();
		var presentationTypeList = oFF.XList.create();
		var textValidity = 0;
		var keyValidity = 0;
		while (cursorAxis.hasNextFieldValue())
		{
			cursorAxis.nextFieldValue();
			var pt = cursorAxis.getField().getPresentationType();
			var formattedValue = cursorAxis.getFormattedValue();
			formattedValueList.add(formattedValue);
			presentationTypeList.add(pt);
			var cvt = cursorAxis.getValueType();
			if (cursorAxis.getValue() !== null)
			{
				valueList.add(cursorAxis.getValue().clone());
			}
			valueTypeList.add(cvt);
			if (pt.isTypeOf(oFF.PresentationType.SHORT_TEXT) || pt.isTypeOf(oFF.PresentationType.LONG_TEXT) || pt.isTypeOf(oFF.PresentationType.MEDIUM_TEXT))
			{
				if (textValidity < 5 && oFF.XStringUtils.isNotNullAndNotEmpty(formattedValue))
				{
					text = formattedValue;
					textValidity = 5;
				}
			}
			else if (pt.isTypeOf(oFF.PresentationType.HIERARCHY_TEXT) && textValidity < 4 && oFF.XStringUtils.isNotNullAndNotEmpty(formattedValue))
			{
				text = formattedValue;
				textValidity = 4;
			}
			else if (pt.isTypeOf(oFF.PresentationType.HIERARCHY_DISPLAY_KEY) && textValidity < 3 && oFF.XStringUtils.isNotNullAndNotEmpty(formattedValue))
			{
				text = formattedValue;
				textValidity = 3;
			}
			else if (pt.isTypeOf(oFF.PresentationType.DISPLAY_KEY) && textValidity < 2 && oFF.XStringUtils.isNotNullAndNotEmpty(formattedValue))
			{
				text = formattedValue;
				textValidity = 2;
			}
			else if (textValidity <= 1 && oFF.PresentationType.isTextPresentation(pt) && oFF.XStringUtils.isNotNullAndNotEmpty(formattedValue))
			{
				text = formattedValue;
				textValidity = 1;
			}
			if (keyValidity <= 4 && pt.isTypeOf(oFF.PresentationType.HIERARCHY_KEY) && !pt.isTypeOf(oFF.PresentationType.HIERARCHY_DISPLAY_KEY) && oFF.XStringUtils.isNotNullAndNotEmpty(formattedValue))
			{
				key = formattedValue;
				keyValidity = 4;
			}
			else if (keyValidity <= 3 && pt.isTypeOf(oFF.PresentationType.HIERARCHY_KEY) && oFF.XStringUtils.isNotNullAndNotEmpty(formattedValue))
			{
				key = formattedValue;
				keyValidity = 3;
			}
			else if (keyValidity <= 2 && pt.isTypeOf(oFF.PresentationType.KEY) && !pt.isTypeOf(oFF.PresentationType.DISPLAY_KEY) && oFF.XStringUtils.isNotNullAndNotEmpty(formattedValue))
			{
				key = formattedValue;
				keyValidity = 2;
			}
			else if (keyValidity <= 1 && oFF.PresentationType.isKeyPresentation(pt) && oFF.XStringUtils.isNotNullAndNotEmpty(formattedValue))
			{
				key = formattedValue;
				keyValidity = 1;
			}
		}
		if (dimensionForMeasures.containsStructureMember(key) && oFF.XStringUtils.isNotNullAndNotEmpty(dimensionForMeasures.getStructureMember(key).getText()))
		{
			text = dimensionForMeasures.getStructureMember(key).getText();
		}
		if (!cursorAxis.getRsDimensionAtCurrentPosition().isMeasureStructure())
		{
			dimensionmember = cursorAxis.getField().getDimension().getDimensionMember(cursorAxis.getDimensionMemberName());
			displayLevel = cursorAxis.getDisplayLevel();
			parentIndex = cursorAxis.getParentNodeIndex();
			drillState = cursorAxis.getDrillState();
			if (oFF.XStringUtils.isNullOrEmpty(text))
			{
				text = dimensionmember.getText();
				key = dimensionmember.getName();
			}
		}
		var formatelement = null;
		var showSignAs = "()";
		var decimalPlaces = -1;
		var color = null;
		var pattern = null;
		if (oFF.notNull(memberFormatMap))
		{
			var vi;
			var formatMap = memberFormatMap.getStructureByKey(oFF.VizDefConstants.K_NUMBER_FORMATTING);
			if (oFF.notNull(formatMap))
			{
				formatelement = formatMap.getByKey(key);
				for (vi = 0; oFF.isNull(formatelement) && vi < valueList.size(); vi++)
				{
					formatelement = formatMap.getByKey(valueList.get(vi).getStringRepresentation());
				}
			}
			formatMap = memberFormatMap.getStructureByKey(oFF.VizDefConstants.K_SHOW_SIGN_AS);
			if (oFF.notNull(formatMap))
			{
				showSignAs = formatMap.getStringByKey(key);
				for (vi = 0; oFF.isNull(formatelement) && vi < valueList.size(); vi++)
				{
					showSignAs = formatMap.getStringByKey(valueList.get(vi).getStringRepresentation());
				}
			}
			formatMap = memberFormatMap.getStructureByKey(oFF.VizDefConstants.K_DECIMAL_PLACES);
			if (oFF.notNull(formatMap))
			{
				decimalPlaces = formatMap.getIntegerByKey(key);
				for (vi = 0; oFF.isNull(formatelement) && vi < valueList.size(); vi++)
				{
					decimalPlaces = formatMap.getIntegerByKey(valueList.get(vi).getStringRepresentation());
				}
			}
			formatMap = memberFormatMap.getStructureByKey(oFF.VizDefConstants.K_PATTERN_FORMATTING);
			if (oFF.notNull(formatMap))
			{
				pattern = formatMap.getStringByKey(key);
				for (vi = 0; oFF.isNull(pattern) && vi < valueList.size(); vi++)
				{
					pattern = formatMap.getStringByKey(valueList.get(vi).getStringRepresentation());
				}
			}
			formatMap = memberFormatMap.getStructureByKey(oFF.VizDefConstants.K_COLOR_FORMATTING);
			if (oFF.notNull(formatMap))
			{
				color = formatMap.getStringByKey(key);
				for (vi = 0; oFF.isNull(color) && vi < valueList.size(); vi++)
				{
					color = formatMap.getStringByKey(valueList.get(vi).getStringRepresentation());
				}
			}
		}
		feedTuple.setColor(color);
		feedTuple.setPattern(pattern);
		if (oFF.notNull(formatelement))
		{
			var numericShift = 0;
			var numericScale = 2;
			var numericScaleMin = 0;
			if (formatelement.isStructure())
			{
				var formatStructure = formatelement.asStructure();
				var options = formatStructure.getStructureByKey(oFF.VizDefConstants.K_OPTIONS);
				var multiplier = formatStructure.getStructureByKey(oFF.VizDefConstants.K_SCALE).getStringByKey(oFF.VizDefConstants.K_MULTIPLIER);
				if (oFF.XString.startsWith(multiplier, "1E"))
				{
					numericShift = oFF.XInteger.convertFromString(oFF.XString.substring(multiplier, 2, oFF.XString.size(multiplier)));
				}
				if (options.containsKey(oFF.VizDefConstants.K_MINIMUM_FRACTION_DIGITS))
				{
					numericScaleMin = options.getIntegerByKey(oFF.VizDefConstants.K_MINIMUM_FRACTION_DIGITS);
				}
				if (options.containsKey(oFF.VizDefConstants.K_MAXIMUM_FRACTION_DIGITS))
				{
					numericScale = options.getIntegerByKey(oFF.VizDefConstants.K_MAXIMUM_FRACTION_DIGITS) - numericScaleMin;
				}
			}
			else if (formatelement.isInteger())
			{
				numericShift = formatelement.asInteger().getInteger();
			}
			if (decimalPlaces > -1)
			{
				numericScale = decimalPlaces;
				numericScaleMin = decimalPlaces;
			}
			var overriddenInfo = oFF.RsVizNumberFormattingInfo.createNumberFormat(numericShift, numericScaleMin, numericScale, showSignAs, false);
			feedTuple.setNumberFormattingInfo(overriddenInfo);
		}
		if (oFF.XStringUtils.isNullOrEmpty(text))
		{
			text = key;
		}
		return oFF.RsVizTupleElement.createTupleElement(dimensionmember, displayLevel, parentIndex, drillState, key, text, subFeedTypes, formattedValueList, valueList, valueTypeList, presentationTypeList, memberType);
	},
	getAxisMemberFeedTypes:function(cursorAxis, feedTypes)
	{
			var result = oFF.XLinkedHashMapByString.create();
		cursorAxis.setFieldValueCursorBeforeStart();
		var keys = feedTypes.getKeysAsReadOnlyListOfString();
		while (cursorAxis.hasNextFieldValue())
		{
			cursorAxis.nextFieldValue();
			var fieldValueV = cursorAxis.getFieldValue();
			var dimName = fieldValueV.getField().getDimension().getName();
			var memberName = cursorAxis.getDimensionMemberName();
			var memberAlias = "";
			if (oFF.XStringUtils.isNotNullAndNotEmpty(memberName))
			{
				var structureMember = cursorAxis.getField().getDimension().getStructureMember(memberName);
				if (oFF.notNull(structureMember))
				{
					memberAlias = structureMember.getAliasName();
				}
			}
			for (var i = 0; i < keys.size(); i++)
			{
				var feedType = keys.get(i);
				var feedMembers = feedTypes.getListByKey(feedType);
				for (var j = 0; j < feedMembers.size(); j++)
				{
					var currentFeedName = feedMembers.getStringAt(j);
					if (oFF.XString.isEqual(memberAlias, currentFeedName) || oFF.XString.isEqual(memberName, currentFeedName) || oFF.XString.isEqual(fieldValueV.toString(), currentFeedName) || oFF.XString.isEqual(fieldValueV.getFormattedValue(), currentFeedName) || oFF.XString.isEqual(dimName, currentFeedName))
					{
						if (!result.containsKey(feedType))
						{
							result.put(feedType, oFF.XIntegerValue.create(j));
						}
						break;
					}
				}
			}
		}
		cursorAxis.setFieldValueCursorBeforeStart();
		return result;
	},
	getFormattedValue:function(dataCell, numberFormattingInfo, numberFormattingInfoDefault)
	{
			var currentNumberFormattingInfo = numberFormattingInfo;
		if (oFF.isNull(currentNumberFormattingInfo) || currentNumberFormattingInfo.isUseFormattingFromDataCell())
		{
			if (dataCell.getScalingFactor() === 0 && oFF.notNull(numberFormattingInfoDefault) && !numberFormattingInfoDefault.isUseFormattingFromDataCell())
			{
				currentNumberFormattingInfo = numberFormattingInfoDefault;
			}
		}
		if (oFF.notNull(currentNumberFormattingInfo) && !currentNumberFormattingInfo.isUseFormattingFromDataCell())
		{
			if (!dataCell.getValueException().isValidValue() && dataCell.getValueException() !== oFF.ValueException.MIXED_CURRENCIES_OR_UNITS)
			{
				return "";
			}
			var prefix = currentNumberFormattingInfo.isShowPlusSign() ? "+" : "";
			var numericShift = currentNumberFormattingInfo.getNumericShift();
			var numericScaleMin = currentNumberFormattingInfo.getMinDecimalPlaces();
			var numericScale = currentNumberFormattingInfo.getMaxDecimalPlaces() - numericScaleMin;
			try
			{
				var baseValue = dataCell.getDouble() * oFF.XMath.pow(10, numericShift);
				var formatString = "#";
				formatString = "#,#";
				if (numericScale > 0 || numericScaleMin > 0)
				{
					formatString = "#,#.";
					var i;
					for (i = 0; i < numericScaleMin; i++)
					{
						formatString = oFF.XStringUtils.concatenate2(formatString, "0");
					}
					for (i = 0; i < numericScale; i++)
					{
						formatString = oFF.XStringUtils.concatenate2(formatString, "#");
					}
				}
				return oFF.XStringUtils.concatenate2(prefix, oFF.XNumberFormatter.formatDoubleToString(baseValue, formatString));
			}
			catch (t)
			{
				return dataCell.getFormattedValue();
			}
		}
		else
		{
			var formattedValue = dataCell.getFormattedValue();
			if (oFF.XStringUtils.isNullOrEmpty(formattedValue) && dataCell.getValueException() === oFF.ValueException.NORMAL)
			{
				formattedValue = oFF.XDouble.convertToString(dataCell.getDouble());
			}
			return formattedValue;
		}
	},
	getScaledValue:function(dataCell, numberFormattingInfo, numberFormattingInfoDefault)
	{
			var currentNumberFormattingInfo = numberFormattingInfo;
		if (oFF.isNull(currentNumberFormattingInfo) || currentNumberFormattingInfo.isUseFormattingFromDataCell())
		{
			if (dataCell.getScalingFactor() === 0 && oFF.notNull(numberFormattingInfoDefault) && !numberFormattingInfoDefault.isUseFormattingFromDataCell())
			{
				currentNumberFormattingInfo = numberFormattingInfoDefault;
			}
		}
		var numericShift;
		if (oFF.notNull(currentNumberFormattingInfo) && !currentNumberFormattingInfo.isUseFormattingFromDataCell())
		{
			numericShift = currentNumberFormattingInfo.getNumericShift();
		}
		else
		{
			numericShift = dataCell.getScalingFactor();
		}
		if (!dataCell.getValueException().isValidValue() && dataCell.getValueException() !== oFF.ValueException.MIXED_CURRENCIES_OR_UNITS)
		{
			return 0;
		}
		try
		{
			return dataCell.getDouble() * oFF.XMath.pow(10, numericShift);
		}
		catch (t)
		{
			return 0;
		}
	},
	guessFeedMembers:function(rs, chartType, isCombinationChart)
	{
			var isColumn = oFF.XString.isEqual(chartType, oFF.VizDefConstants.V_CHART_TYPE_COLUMN);
		var isBellcurve = oFF.XString.isEqual(chartType, oFF.VizDefConstants.V_CHART_TYPE_BELLCURVE);
		var isLine = oFF.XString.isEqual(chartType, oFF.VizDefConstants.K_LINE);
		var isBar = oFF.XString.isEqual(chartType, oFF.VizDefConstants.V_CHART_TYPE_BAR);
		var isSpline = oFF.XString.isEqual(chartType, oFF.VizDefConstants.K_SPLINE);
		var isArea = oFF.XString.isEqual(chartType, oFF.VizDefConstants.K_AREA);
		var isPie = oFF.XString.isEqual(chartType, oFF.VizDefConstants.K_PIE);
		var isWordcloud = oFF.XString.isEqual(chartType, oFF.VizDefConstants.K_WORDCLOUD);
		var isVariablepie = oFF.XString.isEqual(chartType, oFF.VizDefConstants.K_VARIPIE);
		var isVariwide = oFF.XString.isEqual(chartType, oFF.VizDefConstants.K_VARIWIDE);
		var isScatter = oFF.XString.isEqual(chartType, oFF.VizDefConstants.K_SCATTER);
		var isBubble = oFF.XString.isEqual(chartType, oFF.VizDefConstants.V_CHART_TYPE_BUBBLE);
		var isPackedBubble = oFF.XString.isEqual(chartType, oFF.VizDefConstants.K_PACKED_BUBBLE);
		var isHeatMap = oFF.XString.isEqual(chartType, oFF.VizDefConstants.K_HEATMAP);
		var isTreeMap = oFF.XString.isEqual(chartType, oFF.VizDefConstants.K_TREEMAP);
		var isBoxPlot = oFF.XString.isEqual(chartType, oFF.VizDefConstants.V_CHART_TYPE_BOXPLOT);
		var isMetric = oFF.XString.isEqual(chartType, oFF.VizDefConstants.K_SOLID_GAUGE);
		var feedMembersMap = oFF.PrFactory.createStructure();
		var rowAxis = rs.getCursorRowsAxis();
		var colAxis = rs.getCursorColumnsAxis();
		var categoryList = feedMembersMap.putNewList(oFF.VizDefConstants.K_CATEGORY_AXIS);
		var categoryList2 = feedMembersMap.putNewList(oFF.VizDefConstants.K_CATEGORY_AXIS2);
		var valueList = feedMembersMap.putNewList(oFF.VizDefConstants.K_VALUE_AXIS);
		var valueList2 = feedMembersMap.putNewList(oFF.VizDefConstants.K_VALUE_AXIS2);
		var bubbleList = feedMembersMap.putNewList(oFF.VizDefConstants.K_BUBBLE_WIDTH);
		var weightList = feedMembersMap.putNewList(oFF.VizDefConstants.K_WEIGHT);
		var sizeList = feedMembersMap.putNewList(oFF.VizDefConstants.K_SIZE);
		var timeList = feedMembersMap.putNewList(oFF.VizDefConstants.K_TIME_AXIS);
		var colorList = feedMembersMap.putNewList(oFF.VizDefConstants.K_COLOR);
		var colDimStack = oFF.RsVizAxisExtractor.getDimensionStack(colAxis);
		var rowDimStack = oFF.RsVizAxisExtractor.getDimensionStack(rowAxis);
		var measureStack = oFF.RsVizAxisExtractor.getMemberStack(colAxis, colDimStack.size());
		if (rowDimStack.size() > 0)
		{
			timeList.addString(rowDimStack.get(rowDimStack.size() - 1));
			colorList.addString(rowDimStack.get(rowDimStack.size() - 1));
			categoryList.addString(rowDimStack.get(rowDimStack.size() - 1));
		}
		if (colDimStack.size() > 1)
		{
			if (isHeatMap)
			{
				categoryList2.addString(colDimStack.get(colDimStack.size() - 2));
			}
			else
			{
				colorList.addString(colDimStack.get(colDimStack.size() - 2));
			}
		}
		if (isLine || isBar || isSpline || isBellcurve || isColumn || isArea || isCombinationChart || isMetric || isBoxPlot)
		{
			var size = measureStack.size();
			if (isCombinationChart && measureStack.size() > 1)
			{
				size--;
				valueList2.addString(measureStack.get(measureStack.size() - 1));
			}
			for (var i = 0; i < size; i++)
			{
				valueList.addString(measureStack.get(i));
			}
		}
		else if (isPie || isVariablepie || isWordcloud || isBubble || isScatter || isTreeMap || isVariwide || isPackedBubble)
		{
			if (measureStack.size() > 0)
			{
				weightList.addString(measureStack.get(0));
				valueList.addString(measureStack.get(0));
				sizeList.addString(measureStack.get(measureStack.size() - 1));
			}
			if (measureStack.size() > 1)
			{
				valueList2.addString(measureStack.get(1));
			}
			if (measureStack.size() > 2)
			{
				bubbleList.addString(measureStack.get(2));
			}
		}
		else if (isHeatMap)
		{
			if (measureStack.size() > 0)
			{
				colorList.addString(measureStack.get(0));
			}
		}
		return feedMembersMap;
	},
	getDimensionStack:function(axis)
	{
			var resultList = oFF.XListOfString.create();
		axis.setFieldValueCursorBeforeStart();
		axis.setTupleElementCursorBeforeStart();
		axis.setTupleCursorBeforeStart();
		if (axis.hasNextTuple())
		{
			axis.nextTuple();
			while (axis.hasNextTupleElement())
			{
				axis.nextTupleElement();
				if (axis.hasNextFieldValue())
				{
					axis.nextFieldValue();
				}
				resultList.add(axis.getRsDimensionAtCurrentPosition().getName());
				if (axis.getRsDimensionAtCurrentPosition().getDimensionType() === oFF.DimensionType.ACCOUNT)
				{
					break;
				}
			}
		}
		axis.setFieldValueCursorBeforeStart();
		axis.setTupleElementCursorBeforeStart();
		axis.setTupleCursorBeforeStart();
		return resultList;
	},
	getMemberStack:function(axis, position)
	{
			var resultList = oFF.XListOfString.create();
		axis.setFieldValueCursorBeforeStart();
		axis.setTupleElementCursorBeforeStart();
		axis.setTupleCursorBeforeStart();
		while (axis.hasNextTuple())
		{
			axis.nextTuple();
			axis.setTupleElementCursorBeforeStart();
			var tupleIndex = 0;
			while (axis.hasNextTupleElement() && tupleIndex++ < position)
			{
				axis.nextTupleElement();
			}
			if (axis.hasNextFieldValue())
			{
				axis.nextFieldValue();
			}
			resultList.add(axis.getDimensionMemberName());
		}
		axis.setFieldValueCursorBeforeStart();
		axis.setTupleElementCursorBeforeStart();
		axis.setTupleCursorBeforeStart();
		return resultList;
	},
	extractCustomFormatting:function(vizDef, globalDef)
	{
			if (oFF.isNull(vizDef))
		{
			return null;
		}
		var customFormatting = vizDef.getStructureByKey(oFF.VizDefConstants.K_CUSTOM_FORMATTING);
		var placeholders2Id = vizDef.getStructureByKey(oFF.VizDefConstants.K_PLACEHOLDER_2_ID);
		var measureSync = oFF.isNull(globalDef) ? null : globalDef.getListByKey(oFF.VizDefConstants.K_MEASURE_SYNC);
		if (oFF.isNull(customFormatting))
		{
			customFormatting = vizDef.putNewStructure(oFF.VizDefConstants.K_CUSTOM_FORMATTING);
		}
		var patternFormatting = customFormatting.getStructureByKey(oFF.VizDefConstants.K_PATTERN_FORMATTING);
		if (oFF.isNull(patternFormatting))
		{
			patternFormatting = customFormatting.putNewStructure(oFF.VizDefConstants.K_PATTERN_FORMATTING);
		}
		var colorFormatting = customFormatting.getStructureByKey(oFF.VizDefConstants.K_COLOR_FORMATTING);
		if (oFF.isNull(colorFormatting))
		{
			colorFormatting = customFormatting.putNewStructure(oFF.VizDefConstants.K_COLOR_FORMATTING);
		}
		var upIds = oFF.XHashSetOfString.create();
		if (!vizDef.getStructureByKey(oFF.VizDefConstants.K_CHART).getBooleanByKeyExt(oFF.VizDefConstants.K_IS_EXCLUDE_COLOR_SYNC, false))
		{
			if (oFF.notNull(measureSync))
			{
				for (var h = 0; h < measureSync.size(); h++)
				{
					var ms = measureSync.getStructureAt(h);
					var idStruct = ms.getStructureByKey(oFF.VizDefConstants.K_ID);
					var idName = idStruct.getStringByKey(oFF.VizDefConstants.K_ID);
					if (!colorFormatting.containsKey(idName))
					{
						colorFormatting.putStringNotNullAndNotEmpty(idName, ms.getStringByKey(oFF.VizDefConstants.K_COLOR));
					}
					if (!patternFormatting.containsKey(idName))
					{
						patternFormatting.putStringNotNullAndNotEmpty(idName, ms.getStringByKey(oFF.VizDefConstants.K_PATTERN));
					}
				}
			}
		}
		else
		{
			var feedMembers = vizDef.getStructureByKey(oFF.VizDefConstants.K_FEED_MEMBERS);
			var feedKeys = feedMembers.getKeysAsReadOnlyListOfString();
			for (var fi = 0; fi < feedKeys.size(); fi++)
			{
				var curFeedKey = feedKeys.get(fi);
				if (!oFF.XString.containsString(curFeedKey, oFF.VizDefConstants.K_ERRORBAR_INFIX))
				{
					var deleteValue = feedMembers.getListByKey(curFeedKey);
					for (var dvi = 0; dvi < deleteValue.size(); dvi++)
					{
						colorFormatting.remove(deleteValue.getStringAt(dvi));
					}
				}
			}
			patternFormatting.clear();
			var userPrefrence = vizDef.getStructureByKey(oFF.VizDefConstants.K_USER_PREFERENCES);
			if (oFF.notNull(userPrefrence))
			{
				var measuresStructure = userPrefrence.getStructureByKey(oFF.VizDefConstants.K_MEASURE);
				if (oFF.notNull(measuresStructure))
				{
					var measureColors = measuresStructure.getListByKey(oFF.VizDefConstants.K_COLORS);
					if (oFF.notNull(measureColors))
					{
						for (var g = 0; g < measureColors.size(); g++)
						{
							var msUp = measureColors.getStructureAt(g);
							var idStructUp = msUp.getStructureByKey(oFF.VizDefConstants.K_ID);
							var idNameUp = idStructUp.getStringByKey(oFF.VizDefConstants.K_ID);
							colorFormatting.putStringNotNullAndNotEmpty(idNameUp, msUp.getStringByKey(oFF.VizDefConstants.K_COLOR));
							patternFormatting.putStringNotNullAndNotEmpty(idNameUp, msUp.getStringByKey(oFF.VizDefConstants.K_PATTERN));
							upIds.add(idNameUp);
						}
					}
				}
			}
		}
		if (oFF.notNull(placeholders2Id))
		{
			var placeholders = placeholders2Id.getKeysAsReadOnlyListOfString();
			for (var i = 0; i < placeholders.size(); i++)
			{
				var placeholder = placeholders.get(i);
				var mappedId = placeholders2Id.getStringByKey(placeholder);
				if (colorFormatting.containsKey(placeholder) && (!colorFormatting.containsKey(mappedId) || upIds.contains(placeholder)))
				{
					colorFormatting.putString(mappedId, colorFormatting.getStringByKey(placeholder));
				}
				if (patternFormatting.containsKey(placeholder) && !patternFormatting.containsKey(mappedId))
				{
					patternFormatting.putString(mappedId, patternFormatting.getStringByKey(placeholder));
				}
				if (colorFormatting.containsKey(mappedId) && (!colorFormatting.containsKey(placeholder) || upIds.contains(mappedId)))
				{
					colorFormatting.putString(placeholder, colorFormatting.getStringByKey(mappedId));
				}
				if (patternFormatting.containsKey(mappedId) && !patternFormatting.containsKey(placeholder))
				{
					patternFormatting.putString(placeholder, patternFormatting.getStringByKey(mappedId));
				}
			}
		}
		return customFormatting;
	}
};

oFF.RsVizFeedTuple = function() {};
oFF.RsVizFeedTuple.prototype = new oFF.XObject();
oFF.RsVizFeedTuple.prototype._ff_c = "RsVizFeedTuple";

oFF.RsVizFeedTuple.createTuple = function()
{
	var newInstance = new oFF.RsVizFeedTuple();
	newInstance.m_elements = oFF.XList.create();
	newInstance.m_availableFeedTypes = oFF.XHashSetOfString.create();
	return newInstance;
};
oFF.RsVizFeedTuple.prototype.m_elements = null;
oFF.RsVizFeedTuple.prototype.m_availableFeedTypes = null;
oFF.RsVizFeedTuple.prototype.m_numberFormattingInfo = null;
oFF.RsVizFeedTuple.prototype.m_pattern = null;
oFF.RsVizFeedTuple.prototype.m_color = null;
oFF.RsVizFeedTuple.prototype.getPattern = function()
{
	return this.m_pattern;
};
oFF.RsVizFeedTuple.prototype.getColor = function()
{
	return this.m_color;
};
oFF.RsVizFeedTuple.prototype.releaseObject = function()
{
	this.m_elements = oFF.XObjectExt.release(this.m_elements);
	this.m_availableFeedTypes = oFF.XObjectExt.release(this.m_availableFeedTypes);
	this.m_numberFormattingInfo = null;
	oFF.XObject.prototype.releaseObject.call( this );
};
oFF.RsVizFeedTuple.prototype.getMemberKeysForFeedsOtherThan = function(feed)
{
	var result = oFF.XListOfString.create();
	for (var i = 0; i < this.m_elements.size(); i++)
	{
		if (!this.m_elements.get(i).isSelectedByString(feed))
		{
			result.add(this.m_elements.get(i).getKey());
		}
	}
	return result;
};
oFF.RsVizFeedTuple.prototype.getMemberKeys = function()
{
	var result = oFF.XListOfString.create();
	for (var i = 0; i < this.m_elements.size(); i++)
	{
		result.add(this.m_elements.get(i).getKey());
	}
	return result;
};
oFF.RsVizFeedTuple.prototype.setNumberFormattingInfo = function(value)
{
	this.m_numberFormattingInfo = value;
};
oFF.RsVizFeedTuple.prototype.getNumberFormattingInfo = function()
{
	return this.m_numberFormattingInfo;
};
oFF.RsVizFeedTuple.prototype.addElement = function(element)
{
	this.m_elements.add(element);
	this.m_availableFeedTypes.addAll(element.getFeedTypes());
};
oFF.RsVizFeedTuple.prototype.isTotal = function()
{
	for (var i = 0; i < this.m_elements.size(); i++)
	{
		if (this.m_elements.get(i).isTotal())
		{
			return true;
		}
	}
	return false;
};
oFF.RsVizFeedTuple.prototype.getPrettyDefaultText = function()
{
	var val = oFF.XStringBuffer.create();
	for (var i = 0; i < this.m_elements.size(); i++)
	{
		if (!oFF.XCollectionUtils.hasElements(this.m_availableFeedTypes) || oFF.XCollectionUtils.hasElements(this.m_elements.get(i).getFeedTypes()))
		{
			val.append("/");
			val.append(this.m_elements.get(i).getText());
		}
	}
	var result = val.toString();
	if (oFF.XString.size(result) > 1)
	{
		return oFF.XString.substring(result, 1, oFF.XString.size(result));
	}
	return null;
};
oFF.RsVizFeedTuple.prototype.getDefaultLabel = function(axisForHierarchyLookup)
{
	var result = null;
	for (var i = 0; i < this.m_elements.size(); i++)
	{
		if (!oFF.XCollectionUtils.hasElements(this.m_availableFeedTypes) || oFF.XCollectionUtils.hasElements(this.m_elements.get(i).getFeedTypes()))
		{
			result = this.createVizLabel(i, axisForHierarchyLookup, result);
		}
	}
	return result;
};
oFF.RsVizFeedTuple.prototype.createVizLabel = function(i, axisForHierarchyLookup, parent)
{
	var result = parent;
	var currentElement = this.m_elements.get(i);
	if (oFF.notNull(axisForHierarchyLookup) && currentElement.getParentIndex() > -1 && currentElement.getParentIndex() < axisForHierarchyLookup.getTuplesCount())
	{
		result = axisForHierarchyLookup.getTupleAt(currentElement.getParentIndex()).createVizLabel(i, axisForHierarchyLookup, result);
	}
	return oFF.RsVizLabel.create(currentElement.getKey(), currentElement.getText(), currentElement.getFormattedText(), result, currentElement.getDisplayLevel(), currentElement.getDrillState());
};
oFF.RsVizFeedTuple.prototype.getFormattedDefaultText = function()
{
	var val = oFF.XStringBuffer.create();
	for (var i = 0; i < this.m_elements.size(); i++)
	{
		if (!oFF.XCollectionUtils.hasElements(this.m_availableFeedTypes) || oFF.XCollectionUtils.hasElements(this.m_elements.get(i).getFeedTypes()))
		{
			val.append("/");
			val.append(this.m_elements.get(i).getFormattedText());
		}
	}
	var result = val.toString();
	if (oFF.XString.size(result) > 1)
	{
		return oFF.XString.substring(result, 1, oFF.XString.size(result));
	}
	return null;
};
oFF.RsVizFeedTuple.prototype.setPattern = function(pattern)
{
	this.m_pattern = pattern;
};
oFF.RsVizFeedTuple.prototype.setColor = function(color)
{
	this.m_color = color;
};
oFF.RsVizFeedTuple.prototype.getPrettyTextForFeed = function(feedSelector)
{
	var feeds = oFF.XListOfString.create();
	feeds.add(feedSelector);
	return this.getPrettyText(feeds);
};
oFF.RsVizFeedTuple.prototype.getPrettyText = function(feedSelector)
{
	if (!oFF.XCollectionUtils.hasElements(this.m_availableFeedTypes))
	{
		return null;
	}
	var val = oFF.XStringBuffer.create();
	for (var i = 0; i < this.m_elements.size(); i++)
	{
		if (this.m_elements.get(i).isSelectedByList(feedSelector))
		{
			val.append("/");
			val.append(this.m_elements.get(i).getText());
		}
	}
	var result = val.toString();
	if (oFF.XString.size(result) > 1)
	{
		return oFF.XString.substring(result, 1, oFF.XString.size(result));
	}
	return null;
};
oFF.RsVizFeedTuple.prototype.getLabel = function(axisForHierarchyLookup, feedSelector)
{
	if (!oFF.XCollectionUtils.hasElements(this.m_availableFeedTypes))
	{
		return null;
	}
	var result = null;
	for (var i = 0; i < this.m_elements.size(); i++)
	{
		if (this.m_elements.get(i).isSelectedByList(feedSelector))
		{
			result = this.createVizLabel(i, axisForHierarchyLookup, result);
		}
	}
	return result;
};
oFF.RsVizFeedTuple.prototype.getFormattedText = function(feedSelector)
{
	if (!oFF.XCollectionUtils.hasElements(this.m_availableFeedTypes))
	{
		return null;
	}
	var val = oFF.XStringBuffer.create();
	for (var i = 0; i < this.m_elements.size(); i++)
	{
		if (this.m_elements.get(i).isSelectedByList(feedSelector))
		{
			val.append("/");
			val.append(this.m_elements.get(i).getFormattedText());
		}
	}
	var result = val.toString();
	if (oFF.XString.size(result) > 1)
	{
		return oFF.XString.substring(result, 1, oFF.XString.size(result));
	}
	return null;
};
oFF.RsVizFeedTuple.prototype.getPrettyTextExclude = function(feedSelector, feedExclude)
{
	if (!oFF.XCollectionUtils.hasElements(this.m_availableFeedTypes))
	{
		return null;
	}
	var val = oFF.XStringBuffer.create();
	for (var i = 0; i < this.m_elements.size(); i++)
	{
		if (this.m_elements.get(i).isSelectedByList(feedSelector) && !this.m_elements.get(i).isSelectedByList(feedExclude))
		{
			val.append("/");
			val.append(this.m_elements.get(i).getText());
		}
	}
	var result = val.toString();
	if (oFF.XString.size(result) > 1)
	{
		return oFF.XString.substring(result, 1, oFF.XString.size(result));
	}
	return null;
};
oFF.RsVizFeedTuple.prototype.getPrettyKeyText = function(feedSelector)
{
	if (!oFF.XCollectionUtils.hasElements(this.m_availableFeedTypes))
	{
		return null;
	}
	var val = oFF.XStringBuffer.create();
	for (var i = 0; i < this.m_elements.size(); i++)
	{
		if (this.m_elements.get(i).isSelectedByList(feedSelector))
		{
			val.append("/");
			val.append(this.m_elements.get(i).getKey());
		}
	}
	var result = val.toString();
	if (oFF.XString.size(result) > 1)
	{
		return oFF.XString.substring(result, 1, oFF.XString.size(result));
	}
	return null;
};
oFF.RsVizFeedTuple.prototype.toString = function()
{
	return oFF.XStringUtils.concatenate3(this.m_elements.toString(), ":::", this.m_availableFeedTypes.toString());
};
oFF.RsVizFeedTuple.prototype.getAvailableFeedTypes = function()
{
	return this.m_availableFeedTypes;
};
oFF.RsVizFeedTuple.prototype.isSelectedByList = function(feedSelector)
{
	if (oFF.XCollectionUtils.hasElements(this.m_availableFeedTypes) && !oFF.XCollectionUtils.hasElements(feedSelector))
	{
		return true;
	}
	for (var i = 0; i < feedSelector.size(); i++)
	{
		if (this.m_availableFeedTypes.contains(feedSelector.get(i)))
		{
			return true;
		}
	}
	return false;
};
oFF.RsVizFeedTuple.prototype.isSelectedByString = function(feedSelector)
{
	return oFF.XStringUtils.isNullOrEmpty(feedSelector) || this.m_availableFeedTypes.contains(feedSelector);
};
oFF.RsVizFeedTuple.prototype.getDate = function(fallbackLevel)
{
	for (var i = 0; i < this.m_elements.size(); i++)
	{
		var date = this.m_elements.get(i).getDate(fallbackLevel);
		if (oFF.notNull(date))
		{
			return date;
		}
	}
	return null;
};
oFF.RsVizFeedTuple.prototype.getFormattedDate = function()
{
	for (var i = 0; i < this.m_elements.size(); i++)
	{
		var date = this.m_elements.get(i).getFormattedDate();
		if (oFF.notNull(date))
		{
			return date;
		}
	}
	return null;
};
oFF.RsVizFeedTuple.prototype.getDimensionTextsForFeeds = function(feeds)
{
	var result = oFF.XListOfString.create();
	for (var i = 0; i < this.m_elements.size(); i++)
	{
		var curElement = this.m_elements.get(i);
		if (curElement.getDimensionMember() !== null && curElement.getDimensionMember().getDimension() !== null && curElement.isSelectedByList(feeds) && !result.contains(curElement.getDimensionMember().getDimension().getName()))
		{
			result.add(curElement.getDimensionMember().getDimension().getText());
		}
	}
	return result;
};
oFF.RsVizFeedTuple.prototype.getDimensionNamesForFeeds = function(feeds)
{
	var result = oFF.XListOfString.create();
	for (var i = 0; i < this.m_elements.size(); i++)
	{
		var curElement = this.m_elements.get(i);
		if (curElement.getDimensionMember() !== null && curElement.getDimensionMember().getDimension() !== null && curElement.isSelectedByList(feeds) && !result.contains(curElement.getDimensionMember().getDimension().getName()))
		{
			result.add(curElement.getDimensionMember().getDimension().getName());
		}
	}
	return result;
};
oFF.RsVizFeedTuple.prototype.compareTo = function(objectToCompare)
{
	if (oFF.isNull(objectToCompare))
	{
		return 1;
	}
	var otherObject = objectToCompare;
	var size = oFF.XMath.min(this.m_elements.size(), otherObject.m_elements.size());
	for (var i = 0; i < size; i++)
	{
		var compVal = this.m_elements.get(i).compareTo(otherObject.m_elements.get(i));
		if (compVal !== 0)
		{
			return compVal;
		}
	}
	return 0;
};
oFF.RsVizFeedTuple.prototype.getFormattedValue = function(dataCell)
{
	return oFF.RsVizAxisExtractor.getFormattedValue(dataCell, this.getNumberFormattingInfo(), null);
};
oFF.RsVizFeedTuple.prototype.getDecimalPlaces = function()
{
	return this.m_numberFormattingInfo.getMaxDecimalPlaces();
};
oFF.RsVizFeedTuple.prototype.getNumericShift = function()
{
	return this.m_numberFormattingInfo.getNumericShift();
};
oFF.RsVizFeedTuple.prototype.getScaledValue = function(dataCell)
{
	return oFF.RsVizAxisExtractor.getScaledValue(dataCell, this.getNumberFormattingInfo(), null);
};

oFF.RsVizLabel = function() {};
oFF.RsVizLabel.prototype = new oFF.XObject();
oFF.RsVizLabel.prototype._ff_c = "RsVizLabel";

oFF.RsVizLabel.create = function(id, label, formattedLabel, parent, displayLevel, drillState)
{
	var newInstance = new oFF.RsVizLabel();
	newInstance.m_id = id;
	newInstance.m_label = label;
	newInstance.m_formattedLabel = formattedLabel;
	newInstance.m_parent = parent;
	newInstance.m_leafOrCollapsed = oFF.isNull(drillState) || drillState === oFF.DrillState.LEAF || drillState === oFF.DrillState.COLLAPSED || drillState === oFF.DrillState.COLLAPSED_EXPAND_AND_DRILLDOWN_ALLOWED;
	newInstance.m_displayLevel = displayLevel;
	if (oFF.notNull(parent))
	{
		parent.m_leafOrCollapsed = false;
	}
	return newInstance;
};
oFF.RsVizLabel.prototype.m_id = null;
oFF.RsVizLabel.prototype.m_label = null;
oFF.RsVizLabel.prototype.m_formattedLabel = null;
oFF.RsVizLabel.prototype.m_compoundId = null;
oFF.RsVizLabel.prototype.m_compoundLabel = null;
oFF.RsVizLabel.prototype.m_compoundFormattedLabel = null;
oFF.RsVizLabel.prototype.m_leafOrCollapsed = false;
oFF.RsVizLabel.prototype.m_displayLevel = 0;
oFF.RsVizLabel.prototype.m_parent = null;
oFF.RsVizLabel.prototype.releaseObject = function()
{
	this.m_id = null;
	this.m_label = null;
	this.m_formattedLabel = null;
	this.m_parent = null;
	this.m_compoundFormattedLabel = null;
	this.m_compoundId = null;
	this.m_compoundLabel = null;
	oFF.XObject.prototype.releaseObject.call( this );
};
oFF.RsVizLabel.prototype.getId = function()
{
	return this.m_id;
};
oFF.RsVizLabel.prototype.getLabel = function()
{
	return this.m_label;
};
oFF.RsVizLabel.prototype.getParent = function()
{
	return this.m_parent;
};
oFF.RsVizLabel.prototype.getCompoundLabel = function()
{
	if (oFF.isNull(this.m_compoundLabel))
	{
		if (oFF.notNull(this.m_parent))
		{
			this.m_compoundLabel = oFF.XStringUtils.concatenate3(this.m_parent.getCompoundLabel(), "/", this.m_label);
		}
		else
		{
			this.m_compoundLabel = this.m_label;
		}
	}
	return this.m_compoundLabel;
};
oFF.RsVizLabel.prototype.getCompoundFormattedLabel = function()
{
	if (oFF.isNull(this.m_compoundFormattedLabel))
	{
		if (oFF.notNull(this.m_parent))
		{
			this.m_compoundFormattedLabel = oFF.XStringUtils.concatenate3(this.m_parent.getCompoundFormattedLabel(), "/", this.m_formattedLabel);
		}
		else
		{
			this.m_compoundFormattedLabel = this.m_formattedLabel;
		}
	}
	return this.m_compoundFormattedLabel;
};
oFF.RsVizLabel.prototype.getCompoundId = function()
{
	if (oFF.isNull(this.m_compoundId))
	{
		if (oFF.notNull(this.m_parent))
		{
			this.m_compoundId = oFF.XStringUtils.concatenate3(this.m_parent.getCompoundId(), "/", this.m_id);
		}
		else
		{
			this.m_compoundId = this.m_id;
		}
	}
	return this.m_compoundId;
};
oFF.RsVizLabel.prototype.getFormattedLabel = function()
{
	return this.m_formattedLabel;
};
oFF.RsVizLabel.prototype.isLeafOrCollapsed = function()
{
	return this.m_leafOrCollapsed;
};
oFF.RsVizLabel.prototype.getDisplayLevel = function()
{
	return this.m_displayLevel;
};

oFF.RsVizNumberFormattingInfo = function() {};
oFF.RsVizNumberFormattingInfo.prototype = new oFF.XObject();
oFF.RsVizNumberFormattingInfo.prototype._ff_c = "RsVizNumberFormattingInfo";

oFF.RsVizNumberFormattingInfo.createNumberFormat = function(numericShift, minDecimalPlaces, maxDecimalPlaces, showSignAs, useFormattingFromDataCell)
{
	var newInstance = new oFF.RsVizNumberFormattingInfo();
	newInstance.m_numericShift = numericShift;
	newInstance.m_minDecimalPlaces = minDecimalPlaces;
	newInstance.m_maxDecimalPlaces = maxDecimalPlaces;
	newInstance.m_useFormattingFromDataCell = useFormattingFromDataCell;
	newInstance.m_showSignAs = showSignAs;
	return newInstance;
};
oFF.RsVizNumberFormattingInfo.prototype.m_numericShift = 0;
oFF.RsVizNumberFormattingInfo.prototype.m_minDecimalPlaces = 0;
oFF.RsVizNumberFormattingInfo.prototype.m_maxDecimalPlaces = 0;
oFF.RsVizNumberFormattingInfo.prototype.m_useFormattingFromDataCell = false;
oFF.RsVizNumberFormattingInfo.prototype.m_showSignAs = null;
oFF.RsVizNumberFormattingInfo.prototype.releaseObject = function()
{
	this.m_showSignAs = null;
	oFF.XObject.prototype.releaseObject.call( this );
};
oFF.RsVizNumberFormattingInfo.prototype.getNumericShift = function()
{
	return this.m_numericShift;
};
oFF.RsVizNumberFormattingInfo.prototype.getMinDecimalPlaces = function()
{
	return this.m_minDecimalPlaces;
};
oFF.RsVizNumberFormattingInfo.prototype.getMaxDecimalPlaces = function()
{
	return this.m_maxDecimalPlaces;
};
oFF.RsVizNumberFormattingInfo.prototype.isShowPlusSign = function()
{
	return oFF.XStringUtils.isNotNullAndNotEmpty(this.m_showSignAs) && oFF.XString.startsWith(this.m_showSignAs, "+");
};
oFF.RsVizNumberFormattingInfo.prototype.isUseFormattingFromDataCell = function()
{
	return this.m_useFormattingFromDataCell;
};
oFF.RsVizNumberFormattingInfo.prototype.getShowSignAs = function()
{
	return this.m_showSignAs;
};

oFF.RsVizTupleElement = function() {};
oFF.RsVizTupleElement.prototype = new oFF.XObject();
oFF.RsVizTupleElement.prototype._ff_c = "RsVizTupleElement";

oFF.RsVizTupleElement.createTupleElement = function(dimensionMember, displayLevel, parentIndex, drillState, key, text, feedTypes, formattedValueList, valueList, valueTypeList, presentationTypeList, memberType)
{
	var newInstance = new oFF.RsVizTupleElement();
	newInstance.m_displayLevel = displayLevel;
	newInstance.m_drillState = drillState;
	newInstance.m_member = dimensionMember;
	newInstance.m_parentIndex = parentIndex;
	newInstance.m_key = key;
	newInstance.m_text = text;
	newInstance.m_feedTypes = feedTypes;
	newInstance.m_formattedValueList = formattedValueList;
	newInstance.m_valueList = valueList;
	newInstance.m_valueTypeList = valueTypeList;
	newInstance.m_presentationTypeList = presentationTypeList;
	newInstance.m_memberType = memberType;
	return newInstance;
};
oFF.RsVizTupleElement.prototype.m_feedTypes = null;
oFF.RsVizTupleElement.prototype.m_member = null;
oFF.RsVizTupleElement.prototype.m_parentIndex = 0;
oFF.RsVizTupleElement.prototype.m_key = null;
oFF.RsVizTupleElement.prototype.m_text = null;
oFF.RsVizTupleElement.prototype.m_formattedValueList = null;
oFF.RsVizTupleElement.prototype.m_valueList = null;
oFF.RsVizTupleElement.prototype.m_valueTypeList = null;
oFF.RsVizTupleElement.prototype.m_presentationTypeList = null;
oFF.RsVizTupleElement.prototype.m_memberType = null;
oFF.RsVizTupleElement.prototype.m_drillState = null;
oFF.RsVizTupleElement.prototype.m_displayLevel = 0;
oFF.RsVizTupleElement.prototype.releaseObject = function()
{
	this.m_member = null;
	this.m_key = null;
	this.m_text = null;
	this.m_feedTypes = oFF.XObjectExt.release(this.m_feedTypes);
	this.m_formattedValueList = oFF.XObjectExt.release(this.m_formattedValueList);
	this.m_valueList = oFF.XObjectExt.release(this.m_valueList);
	this.m_valueTypeList = oFF.XObjectExt.release(this.m_valueTypeList);
	this.m_presentationTypeList = oFF.XObjectExt.release(this.m_presentationTypeList);
	this.m_memberType = null;
	oFF.XObject.prototype.releaseObject.call( this );
};
oFF.RsVizTupleElement.prototype.getParentIndex = function()
{
	return this.m_parentIndex;
};
oFF.RsVizTupleElement.prototype.getFormattedValueList = function()
{
	return this.m_formattedValueList;
};
oFF.RsVizTupleElement.prototype.getValueTypeList = function()
{
	return this.m_valueTypeList;
};
oFF.RsVizTupleElement.prototype.getPresentationTypeList = function()
{
	return this.m_presentationTypeList;
};
oFF.RsVizTupleElement.prototype.getKey = function()
{
	return this.m_key;
};
oFF.RsVizTupleElement.prototype.getFormattedText = function()
{
	var prefix = "";
	var suffix = "";
	if (oFF.notNull(this.m_drillState) && this.m_drillState !== oFF.DrillState.LEAF && this.m_drillState !== oFF.DrillState.LEAF_UDH)
	{
		if (this.m_displayLevel === 0)
		{
			prefix = "<b>";
			suffix = "</b>";
		}
		else if (this.m_displayLevel === 1)
		{
			prefix = "<b><em>";
			suffix = "</em></b>";
		}
		else if (this.m_displayLevel === 2)
		{
			prefix = "<em>";
			suffix = "</em>";
		}
	}
	return oFF.XStringUtils.concatenate3(prefix, this.m_text, suffix);
};
oFF.RsVizTupleElement.prototype.getText = function()
{
	return this.m_text;
};
oFF.RsVizTupleElement.prototype.getDimensionMember = function()
{
	return this.m_member;
};
oFF.RsVizTupleElement.prototype.toString = function()
{
	return oFF.XStringUtils.concatenate5(this.m_feedTypes.toString(), "::<", this.m_key, ">::", this.m_text);
};
oFF.RsVizTupleElement.prototype.isSelectedByList = function(feedSelector)
{
	var feedTypes = this.m_feedTypes.getKeysAsReadOnlyListOfString();
	if (oFF.XCollectionUtils.hasElements(this.m_feedTypes) && !oFF.XCollectionUtils.hasElements(feedSelector))
	{
		return true;
	}
	for (var i = 0; i < this.m_feedTypes.size(); i++)
	{
		if (feedSelector.contains(feedTypes.get(i)))
		{
			return true;
		}
	}
	return false;
};
oFF.RsVizTupleElement.prototype.isSelectedByString = function(feedSelector)
{
	return oFF.XStringUtils.isNullOrEmpty(feedSelector) || this.m_feedTypes.containsKey(feedSelector);
};
oFF.RsVizTupleElement.prototype.getFeedTypes = function()
{
	return this.m_feedTypes.getKeysAsReadOnlyListOfString();
};
oFF.RsVizTupleElement.prototype.isTotal = function()
{
	return oFF.notNull(this.m_memberType) && this.m_memberType.isTypeOf(oFF.MemberType.RESULT);
};
oFF.RsVizTupleElement.prototype.getDate = function(fallbackLevel)
{
	if (oFF.isNull(this.m_member))
	{
		return null;
	}
	for (var i = 0; i < this.m_valueList.size(); i++)
	{
		var fieldValue = this.m_valueList.get(i);
		if (fieldValue.getValueType() === oFF.XValueType.DATE)
		{
			return fieldValue;
		}
		if (fallbackLevel === 0)
		{
			return null;
		}
		var rep = fieldValue.getStringRepresentation();
		if (fallbackLevel === 2)
		{
			rep = oFF.XStringUtils.concatenate2(rep, "01");
		}
		else if (fallbackLevel === 3)
		{
			rep = oFF.XStringUtils.concatenate2(rep, "0101");
		}
		try
		{
			if (oFF.XString.startsWith(rep, "!") && oFF.XString.size(rep) === 9)
			{
				return oFF.XDate.createDateFromString(oFF.XString.substring(rep, 1, 9), oFF.DateTimeFormat.SAP);
			}
			else if (oFF.XString.size(rep) === 8)
			{
				return oFF.XDate.createDateFromString(rep, oFF.DateTimeFormat.SAP);
			}
			else if (oFF.XString.startsWith(rep, "!") && oFF.XString.size(rep) === 11)
			{
				return oFF.XDate.createDateFromString(oFF.XString.substring(rep, 1, 11), oFF.DateTimeFormat.ISO);
			}
			else if (oFF.XString.size(rep) === 10)
			{
				return oFF.XDate.createDateFromString(rep, oFF.DateTimeFormat.ISO);
			}
		}
		catch (t)
		{
			continue;
		}
	}
	return null;
};
oFF.RsVizTupleElement.prototype.getFormattedDate = function()
{
	if (oFF.isNull(this.m_member))
	{
		return null;
	}
	for (var i = 0; i < this.m_valueList.size(); i++)
	{
		var fieldValue = this.m_valueList.get(i);
		if (fieldValue.getValueType() === oFF.XValueType.DATE)
		{
			return fieldValue.toString();
		}
	}
	return this.m_text;
};
oFF.RsVizTupleElement.prototype.compareTo = function(objectToCompare)
{
	if (oFF.isNull(objectToCompare))
	{
		return 1;
	}
	var otherObject = objectToCompare;
	var keys = this.m_feedTypes.getKeysAsReadOnlyListOfString();
	var size = keys.size();
	for (var i = 0; i < size; i++)
	{
		var key = keys.get(i);
		var ftThis = this.m_feedTypes.getByKey(key);
		var ftThat = otherObject.m_feedTypes.getByKey(key);
		if (oFF.isNull(ftThat))
		{
			return 1;
		}
		var compVal = ftThis.getInteger() - ftThat.getInteger();
		if (compVal !== 0)
		{
			return compVal;
		}
	}
	return oFF.XString.isEqual(this.getKey(), otherObject.getKey()) ? 0 : 1;
};
oFF.RsVizTupleElement.prototype.getDrillState = function()
{
	return this.m_drillState;
};
oFF.RsVizTupleElement.prototype.getDisplayLevel = function()
{
	return this.m_displayLevel;
};

oFF.RsVizFrameRenderer = function() {};
oFF.RsVizFrameRenderer.prototype = new oFF.XObject();
oFF.RsVizFrameRenderer.prototype._ff_c = "RsVizFrameRenderer";

oFF.RsVizFrameRenderer.create = function()
{
	return new oFF.RsVizFrameRenderer();
};
oFF.RsVizFrameRenderer.prototype.render = function(type, rs)
{
	var structure = oFF.PrFactory.createStructure();
	var vizDef = rs.getQueryModel().getVizManager().getVizDef();
	if (oFF.notNull(vizDef) && vizDef.containsKey(oFF.VizDefConstants.K_CHART) && rs.getAvailableDataCellCount() > 0)
	{
		structure.putString("test", "testValue");
	}
	structure.putString("test2", "testValue2");
	return structure;
};

oFF.RsHiChartVizUserPrefrence = {

	create:function()
	{
			return new oFF.RsHiChartVizUserPrefrence();
	},
	userPrefrence:function(theChartData, userPrefrence, chartType)
	{
			if (!oFF.XString.isEqual(chartType, oFF.VizDefConstants.K_SOLID_GAUGE))
		{
			var userDatalabels = userPrefrence.getStructureByKey(oFF.VizDefConstants.K_DATA_LABEL);
			if (oFF.notNull(userDatalabels))
			{
				var userDatalabelsStyle = userDatalabels.getStructureByKey(oFF.VizDefConstants.K_STYLE);
				var userDatalabelsStyleColor = userDatalabelsStyle.getStringByKey(oFF.VizDefConstants.K_COLOR);
				var userDatalabelsStyleFontWeight = userDatalabelsStyle.getStringByKey(oFF.VizDefConstants.K_FONT_WEIGHT);
				var userDatalabelsStyleforSize = userDatalabelsStyle.getStringByKey(oFF.VizDefConstants.K_FONT_SIZE);
				var plotOptions = theChartData.getStructureByKey(oFF.VizDefConstants.K_PLOT_OPTIONS);
				if (oFF.notNull(plotOptions))
				{
					var plotOptionChartTypeStructureSeries = plotOptions.getStructureByKey(chartType);
					if (oFF.notNull(plotOptionChartTypeStructureSeries))
					{
						var plotOptionChartTypeStructureDatalabels = plotOptionChartTypeStructureSeries.getStructureByKey(oFF.VizDefConstants.K_DATA_LABELS);
						var yAxis = theChartData.getListByKey(oFF.VizDefConstants.K_Y_AXIS);
						if (oFF.notNull(yAxis))
						{
							var yAxisStack = yAxis.getStructureAt(0);
							if (oFF.notNull(yAxisStack))
							{
								if (yAxisStack.containsKey(oFF.VizDefConstants.K_STACK_LABELS))
								{
									var stackLabelsHi = yAxisStack.putNewStructure(oFF.VizDefConstants.K_STACK_LABELS);
									stackLabelsHi.putBoolean(oFF.VizDefConstants.K_ENABLED, true);
									var stackLabelsHiStyle = stackLabelsHi.putNewStructure(oFF.VizDefConstants.K_STYLE);
									if (oFF.notNull(userDatalabelsStyleColor))
									{
										stackLabelsHiStyle.putString(oFF.VizDefConstants.K_COLOR, userDatalabelsStyleColor);
										stackLabelsHiStyle.putString(oFF.VizDefConstants.K_FILL, userDatalabelsStyleColor);
									}
									stackLabelsHiStyle.putString(oFF.VizDefConstants.K_FONT_WEIGHT, userDatalabelsStyleFontWeight);
									stackLabelsHiStyle.putString(oFF.VizDefConstants.K_FONT_SIZE, userDatalabelsStyleforSize);
								}
							}
						}
						if (oFF.notNull(plotOptionChartTypeStructureDatalabels))
						{
							var plotOptionChartTypeStructureDatalabelsStyle = plotOptionChartTypeStructureDatalabels.getStructureByKey(oFF.VizDefConstants.K_STYLE);
							if (oFF.notNull(plotOptionChartTypeStructureDatalabelsStyle))
							{
								if (oFF.notNull(userDatalabelsStyleColor))
								{
									plotOptionChartTypeStructureDatalabelsStyle.putString(oFF.VizDefConstants.K_COLOR, userDatalabelsStyleColor);
									plotOptionChartTypeStructureDatalabelsStyle.putString(oFF.VizDefConstants.K_FILL, userDatalabelsStyleColor);
								}
								plotOptionChartTypeStructureDatalabelsStyle.putString(oFF.VizDefConstants.K_FONT_WEIGHT, userDatalabelsStyleFontWeight);
								plotOptionChartTypeStructureDatalabelsStyle.putString(oFF.VizDefConstants.K_FONT_SIZE, userDatalabelsStyleforSize);
							}
						}
					}
				}
			}
			var userTitle = userPrefrence.getStructureByKey(oFF.VizDefConstants.K_TITLE);
			if (oFF.notNull(userTitle))
			{
				var isTitleVisible = userTitle.getBooleanByKeyExt(oFF.VizDefConstants.K_VISIBLE, true);
				var title = theChartData.getStructureByKey(oFF.VizDefConstants.K_TITLE);
				if (oFF.notNull(title))
				{
					if (isTitleVisible === false)
					{
						title.putString(oFF.VizDefConstants.K_TEXT, "");
					}
					var userPrefsTitleStyle = userTitle.getStructureByKey(oFF.VizDefConstants.K_STYLE);
					if (oFF.notNull(userPrefsTitleStyle))
					{
						title.put(oFF.VizDefConstants.K_STYLE, userPrefsTitleStyle);
					}
				}
			}
			var userSubTitle = userPrefrence.getStructureByKey(oFF.VizDefConstants.K_SUB_TITLE);
			if (oFF.notNull(userSubTitle))
			{
				var isSubTitleVisible = userSubTitle.getBooleanByKeyExt(oFF.VizDefConstants.K_VISIBLE, true);
				var subTitle = theChartData.getStructureByKey(oFF.VizDefConstants.K_SUBTITLE);
				if (oFF.notNull(subTitle))
				{
					if (isSubTitleVisible === false)
					{
						subTitle.putString(oFF.VizDefConstants.K_TEXT, "");
					}
					var userPrefsSubTitleStyle = userSubTitle.getStructureByKey(oFF.VizDefConstants.K_STYLE);
					if (oFF.notNull(userPrefsSubTitleStyle))
					{
						subTitle.put(oFF.VizDefConstants.K_STYLE, userPrefsSubTitleStyle);
					}
				}
			}
			var xAxisElement = theChartData.getByKey(oFF.VizDefConstants.K_X_AXIS);
			var xAxis = oFF.notNull(xAxisElement) && xAxisElement.isList() ? xAxisElement.asList() : null;
			var xAxisStruct = oFF.notNull(xAxisElement) && xAxisElement.isStructure() ? xAxisElement.asStructure() : oFF.XCollectionUtils.hasElements(xAxis) ? xAxis.getStructureAt(0) : null;
			var generalUserPrefs = userPrefrence.getStructureByKey(oFF.VizDefConstants.K_GENERAL);
			if (oFF.notNull(generalUserPrefs))
			{
				var axisLabel = generalUserPrefs.getStructureByKey(oFF.VizDefConstants.K_AXIS_LABEL);
				if (oFF.notNull(axisLabel))
				{
					if (oFF.notNull(xAxisStruct))
					{
						var xAxisStructLabels = xAxisStruct.getStructureByKey(oFF.VizDefConstants.K_LABELS);
						if (oFF.isNull(xAxisStructLabels))
						{
							xAxisStructLabels = xAxisStruct.putNewStructure(oFF.VizDefConstants.K_LABELS);
						}
						var userAxisLabelsStyle = axisLabel.getStructureByKey(oFF.VizDefConstants.K_STYLE);
						if (oFF.notNull(userAxisLabelsStyle))
						{
							xAxisStructLabels.put(oFF.VizDefConstants.K_STYLE, userAxisLabelsStyle);
						}
					}
				}
			}
			var chartlegend = theChartData.getStructureByKey(oFF.VizDefConstants.K_LEGEND);
			if (oFF.notNull(chartlegend))
			{
				var userLegend = userPrefrence.getStructureByKey(oFF.VizDefConstants.K_LEGEND);
				if (oFF.notNull(userLegend))
				{
					var userLegendLabels = userLegend.getStructureByKey(oFF.VizDefConstants.K_LABEL);
					if (oFF.notNull(userLegendLabels))
					{
						var userLegendStyle = userLegendLabels.getStructureByKey(oFF.VizDefConstants.K_STYLE);
						if (oFF.notNull(userLegendStyle))
						{
							chartlegend.put(oFF.VizDefConstants.K_ITEM_STYLE, userLegendStyle);
						}
					}
				}
			}
		}
		return theChartData;
	}
};

oFF.RsHiChartVizUtils = {

	create:function()
	{
			return new oFF.RsHiChartVizUtils();
	},
	chartTitleBuilder:function(theChartData, charTtitle, chartSubtitle)
	{
			if (oFF.notNull(charTtitle))
		{
			var title = theChartData.putNewStructure(oFF.VizDefConstants.K_TITLE);
			title.putString(oFF.VizDefConstants.K_TEXT, charTtitle);
			title.putString(oFF.VizDefConstants.K_ALIGN, oFF.VizDefConstants.V_LEFT);
		}
		if (oFF.notNull(chartSubtitle))
		{
			var subtitle = theChartData.putNewStructure(oFF.VizDefConstants.K_SUBTITLE);
			subtitle.putString(oFF.VizDefConstants.K_TEXT, chartSubtitle);
			subtitle.putString(oFF.VizDefConstants.K_ALIGN, oFF.VizDefConstants.V_LEFT);
		}
	},
	chartLegendBuilder:function(theChartData)
	{
			var legend = theChartData.putNewStructure(oFF.VizDefConstants.K_LEGEND);
		legend.putBoolean(oFF.VizDefConstants.K_ENABLED, true);
		legend.putInteger(oFF.VizDefConstants.K_SYMBOL_RADIUS, 0);
		legend.putString(oFF.VizDefConstants.K_LAYOUT, oFF.VizDefConstants.V_VERTICAL);
		legend.putString(oFF.VizDefConstants.K_ALIGN, oFF.VizDefConstants.V_RIGHT);
		legend.putString(oFF.VizDefConstants.K_VERTICAL_ALIGN, oFF.VizDefConstants.V_POSITION_TOP);
		legend.putBoolean(oFF.VizDefConstants.K_SQUARE_SYMBOL, true);
		var legenditemStyle = legend.putNewStructure(oFF.VizDefConstants.K_ITEM_STYLE);
		legenditemStyle.putString(oFF.VizDefConstants.K_FONT_SIZE, "12px");
		legenditemStyle.putString(oFF.VizDefConstants.K_FONT_WEIGHT, oFF.VizDefConstants.V_NORMAL);
		legenditemStyle.putString(oFF.VizDefConstants.K_FONT_SIZE, "12px");
	},
	chartPlotBuilder:function(theChartData, chartType, plotArea)
	{
			var isDataLabels = true;
		if (oFF.notNull(plotArea) && plotArea.hasElements())
		{
			var dataLabelPlotArea = plotArea.getStructureByKey(oFF.VizDefConstants.K_DATA_LABEL);
			isDataLabels = dataLabelPlotArea.getBooleanByKeyExt(oFF.VizDefConstants.K_VISIBLE, false);
		}
		var plotOptions = theChartData.putNewStructure(oFF.VizDefConstants.K_PLOT_OPTIONS);
		var plotOptionsSeries = plotOptions.putNewStructure(oFF.VizDefConstants.K_SERIES);
		plotOptionsSeries.putInteger(oFF.VizDefConstants.K_CROP_THRESHOLD, 1000);
		var plotOptionChartTypeStructure = plotOptions.putNewStructure(chartType);
		plotOptionChartTypeStructure.putBoolean(oFF.VizDefConstants.K_GROUPING, true);
		var dataLabels = plotOptionChartTypeStructure.putNewStructure(oFF.VizDefConstants.K_DATA_LABELS);
		dataLabels.putBoolean(oFF.VizDefConstants.K_ENABLED, isDataLabels);
		dataLabels.putString(oFF.VizDefConstants.K_FORMAT, "{point.yFormatted} ");
		var dataLabelsStyle = dataLabels.putNewStructure(oFF.VizDefConstants.K_STYLE);
		dataLabelsStyle.putString(oFF.VizDefConstants.K_FONT_WEIGHT, oFF.VizDefConstants.V_FONT_WEIGHT_BOLD);
		dataLabelsStyle.putString(oFF.VizDefConstants.K_FONT_FAMILY, "LatoWeb, 'Open Sans', 'Helvetica Neue', Helvetica, Arial, 'sans serif'");
		dataLabelsStyle.putString(oFF.VizDefConstants.K_FONT_SIZE, "12px");
		dataLabelsStyle.putString(oFF.VizDefConstants.K_COLOR, "rgb(88,89,91)");
	},
	checkShowLegend:function(vizDef, theChartData, chartType, isShowLegendInitial)
	{
			var plotOptions = theChartData.getStructureByKey(oFF.VizDefConstants.K_PLOT_OPTIONS);
		var plotOptionChartTypeStructure = plotOptions.getStructureByKey(chartType);
		plotOptionChartTypeStructure.putBoolean(oFF.VizDefConstants.K_SHOW_IN_LEGEND, isShowLegendInitial);
		var legendViz = theChartData.getStructureByKey(oFF.VizDefConstants.K_LEGEND);
		legendViz.putBoolean(oFF.VizDefConstants.K_ENABLED, isShowLegendInitial);
		if (oFF.isNull(vizDef))
		{
			return;
		}
		var chartObject = vizDef.getStructureByKey(oFF.VizDefConstants.K_CHART);
		if (oFF.isNull(chartObject))
		{
			return;
		}
		var isShowLegend = false;
		var isShowLegendFinal = isShowLegendInitial;
		var chartProperties = chartObject.getStructureByKey(oFF.VizDefConstants.K_PROPERTIES);
		if (oFF.notNull(chartProperties))
		{
			var legendGroup = chartProperties.getStructureByKey(oFF.VizDefConstants.K_LEGEND_GROUP);
			if (oFF.notNull(legendGroup))
			{
				if (legendGroup.getElementTypeByKey(oFF.VizDefConstants.K_VISIBLE) === oFF.PrElementType.BOOLEAN)
				{
					isShowLegend = legendGroup.getBooleanByKeyExt(oFF.VizDefConstants.K_VISIBLE, isShowLegendInitial);
				}
				else if (legendGroup.getElementTypeByKey(oFF.VizDefConstants.K_VISIBLE) === oFF.PrElementType.STRING)
				{
					isShowLegend = oFF.XBoolean.convertFromStringWithDefault(legendGroup.getStringByKey(oFF.VizDefConstants.K_VISIBLE), isShowLegendInitial);
				}
				else
				{
					isShowLegend = isShowLegendInitial;
				}
				var isResponsiveLegend = legendGroup.getBooleanByKeyExt(oFF.VizDefConstants.K_RESPONSIVE, true);
				isShowLegendFinal = isShowLegend && !isResponsiveLegend || isShowLegendInitial && isResponsiveLegend;
				legendViz.putBoolean(oFF.VizDefConstants.K_ENABLED, isShowLegendFinal);
			}
		}
		plotOptionChartTypeStructure.putBoolean(oFF.VizDefConstants.K_SHOW_IN_LEGEND, isShowLegendInitial);
	},
	vizProcessor:function(vizDef, chartTypeInfo, theChartData, chartType)
	{
			var chartTitle = null;
		var chartSubTitle = null;
		var chartProperties;
		var legendlObject;
		var layoutObject;
		var legendGroup;
		var plotArea = oFF.PrFactory.createStructure();
		if (oFF.notNull(vizDef))
		{
			var chartObject = vizDef.getStructureByKey(oFF.VizDefConstants.K_CHART);
			var legendViz = theChartData.putNewStructure(oFF.VizDefConstants.K_LEGEND);
			if (oFF.notNull(chartObject))
			{
				chartTitle = chartObject.getStringByKey(oFF.VizDefConstants.K_TITLE);
				chartSubTitle = chartObject.getStringByKey(oFF.VizDefConstants.K_SUB_TITLE);
				oFF.RsHiChartVizUtils.chartTitleBuilder(theChartData, chartTitle, chartSubTitle);
				var plotOptionChart = theChartData.putNewStructure(oFF.VizDefConstants.K_PLOT_OPTIONS);
				var plotOptionChartTypeStructure = plotOptionChart.putNewStructure(chartType);
				var plotOptionsSeries = plotOptionChart.putNewStructure(oFF.VizDefConstants.K_SERIES);
				plotOptionsSeries.putString(oFF.VizDefConstants.K_BORDER_COLOR, oFF.VizDefConstants.K_TRANSPARENT);
				var dataLabels = plotOptionChartTypeStructure.putNewStructure(oFF.VizDefConstants.K_DATA_LABELS);
				chartProperties = chartObject.getStructureByKey(oFF.VizDefConstants.K_PROPERTIES);
				if (oFF.notNull(chartProperties))
				{
					var generalObject = chartProperties.getStructureByKey(oFF.VizDefConstants.K_GENERAL);
					if (oFF.notNull(generalObject))
					{
						layoutObject = generalObject.getStructureByKey(oFF.VizDefConstants.K_LAYOUT);
						if (oFF.notNull(layoutObject))
						{
							var spacingBottom = layoutObject.getIntegerByKey(oFF.VizDefConstants.K_PADDING_BOTTOM);
							chartTypeInfo.putInteger(oFF.VizDefConstants.K_SPACING_BOTTOM, spacingBottom);
						}
						else
						{
							chartTypeInfo.putInteger(oFF.VizDefConstants.K_SPACING_BOTTOM, 0);
						}
					}
					legendlObject = chartProperties.getStructureByKey(oFF.VizDefConstants.K_LEGEND);
					if (oFF.notNull(legendlObject))
					{
						legendViz = theChartData.putNewStructure(oFF.VizDefConstants.K_LEGEND);
						var legendLabel = legendlObject.getStructureByKey(oFF.VizDefConstants.K_LABEL);
						if (oFF.notNull(legendLabel))
						{
							var legendlayoutStyle = legendLabel.getStructureByKey(oFF.VizDefConstants.K_STYLE);
							if (oFF.notNull(legendlayoutStyle))
							{
								var fontFamily = legendlayoutStyle.getStringByKey(oFF.VizDefConstants.K_FONT_FAMILY);
								var fontSize = legendlayoutStyle.getStringByKey(oFF.VizDefConstants.K_FONT_SIZE);
								var fontWeight = legendlayoutStyle.getStringByKey(oFF.VizDefConstants.K_FONT_WEIGHT);
								var legenditemStyle = legendViz.putNewStructure(oFF.VizDefConstants.K_ITEM_STYLE);
								legenditemStyle.putString(oFF.VizDefConstants.K_FONT_FAMILY, fontFamily);
								legenditemStyle.putString(oFF.VizDefConstants.K_FONT_WEIGHT, fontWeight);
								legenditemStyle.putString(oFF.VizDefConstants.K_FONT_SIZE, fontSize);
							}
						}
					}
					legendGroup = chartProperties.getStructureByKey(oFF.VizDefConstants.K_LEGEND_GROUP);
					if (oFF.notNull(legendGroup))
					{
						var legendGrouplayout = legendGroup.getStructureByKey(oFF.VizDefConstants.K_LAYOUT);
						if (oFF.notNull(legendGrouplayout))
						{
							var legendgroupPosition = legendGrouplayout.getStringByKey(oFF.VizDefConstants.K_POSITION);
							legendViz.putString(oFF.VizDefConstants.K_VERTICAL_ALIGN, legendgroupPosition);
						}
					}
					plotArea = chartProperties.getStructureByKey(oFF.VizDefConstants.K_PLOT_AREA);
					if (oFF.notNull(plotArea))
					{
						var vizDatalabel = plotArea.getStructureByKey(oFF.VizDefConstants.K_DATA_LABEL);
						if (oFF.notNull(vizDatalabel))
						{
							dataLabels = oFF.RsHiChartVizUtils.datalabelPloter(vizDatalabel, dataLabels);
						}
						var seriesDataLabels = plotOptionsSeries.putNewStructure(oFF.VizDefConstants.K_DATA_LABELS);
						seriesDataLabels.putString(oFF.VizDefConstants.K_FORMAT, "{point.yFormatted}");
					}
				}
			}
		}
		else
		{
			legendlObject = theChartData.putNewStructure(oFF.VizDefConstants.K_LEGEND);
			legendlObject.putBoolean(oFF.VizDefConstants.K_ENABLED, true);
			chartTypeInfo.putInteger(oFF.VizDefConstants.K_SPACING_TOP, 0);
			oFF.RsHiChartVizUtils.chartTitleBuilder(theChartData, chartTitle, chartSubTitle);
			oFF.RsHiChartVizUtils.chartLegendBuilder(theChartData);
			oFF.RsHiChartVizUtils.chartPlotBuilder(theChartData, chartType, plotArea);
		}
	},
	datalabelPloter:function(vizDatalabel, datalabelChart)
	{
			var isDataLabels = vizDatalabel.getBooleanByKeyExt(oFF.VizDefConstants.K_VISIBLE, true);
		var isHideWhenOverlap = vizDatalabel.getBooleanByKeyExt(oFF.VizDefConstants.K_IS_HIDDEN_WHEN_OVERLAP, true);
		var datalabelStyle = vizDatalabel.getStructureByKey(oFF.VizDefConstants.K_STYLE);
		var fontSize = datalabelStyle.getStringByKey(oFF.VizDefConstants.K_FONT_SIZE);
		var fontWeight = datalabelStyle.getStringByKey(oFF.VizDefConstants.K_FONT_WEIGHT);
		var fontFamily = datalabelStyle.getStringByKey(oFF.VizDefConstants.K_FONT_FAMILY);
		var color = datalabelStyle.getStringByKey(oFF.VizDefConstants.K_COLOR);
		datalabelChart.putBoolean(oFF.VizDefConstants.K_ENABLED, isDataLabels);
		datalabelChart.putBoolean(oFF.VizDefConstants.K_HIDE_WHEN_OVERLAP, isHideWhenOverlap);
		var dataLabelsStyle = datalabelChart.putNewStructure(oFF.VizDefConstants.K_STYLE);
		dataLabelsStyle.putString(oFF.VizDefConstants.K_FONT_FAMILY, fontFamily);
		dataLabelsStyle.putString(oFF.VizDefConstants.K_FONT_SIZE, fontSize);
		dataLabelsStyle.putString(oFF.VizDefConstants.K_FONT_WEIGHT, fontWeight);
		if (!oFF.XString.isEqual(color, null))
		{
			dataLabelsStyle.putString("fill", color);
			dataLabelsStyle.putString(oFF.VizDefConstants.K_COLOR, color);
		}
		dataLabelsStyle.putString("textOutline", "0px");
		return datalabelChart;
	},
	addColorGradient:function(globalDef, vizDef, theChartData)
	{
			if (oFF.notNull(vizDef))
		{
			var colorScheme = vizDef.getStructureByKey(oFF.VizDefConstants.K_COLOR_SCHEME);
			var colorSync = globalDef.getStructureByKey(oFF.VizDefConstants.K_COLOR_SYNC);
			if (!vizDef.getStructureByKey(oFF.VizDefConstants.K_CHART).getBooleanByKeyExt(oFF.VizDefConstants.K_IS_EXCLUDE_COLOR_SYNC, false))
			{
				if (oFF.XCollectionUtils.hasElements(colorScheme))
				{
					var palleteDesc = colorScheme.getStructureByKey(oFF.VizDefConstants.K_PALETTE_DESC);
					if (oFF.notNull(palleteDesc))
					{
						var palette = theChartData.putNewStructure(oFF.VizDefConstants.K_PALETTE);
						var keysList = palette.putNewList(oFF.VizDefConstants.K_GRADIENT_KEYS);
						var gradientstruct = palleteDesc.getStructureByKey(oFF.VizDefConstants.K_GRADIENT);
						if (oFF.notNull(gradientstruct))
						{
							var gradientKeys = gradientstruct.getKeysAsReadOnlyListOfString();
							var listofKeys = oFF.XList.create();
							for (var yyy = 0; yyy < gradientKeys.size(); yyy++)
							{
								listofKeys.add(oFF.XDoubleValue.create(oFF.XDouble.convertFromString(gradientKeys.get(yyy))));
							}
							listofKeys.sortByComparator(new oFF.XComparatorDouble());
							for (var yfc = 0; yfc < listofKeys.size(); yfc++)
							{
								keysList.addDouble(listofKeys.get(yfc).getDouble());
							}
							palette.put(oFF.VizDefConstants.K_GRADIENT, gradientstruct);
						}
					}
				}
			}
			var feedStruct;
			var colorSyncColordim;
			var colordimensionId = null;
			var chartObject = vizDef.getStructureByKey(oFF.VizDefConstants.K_CHART);
			if (oFF.notNull(chartObject))
			{
				var bindingsList = chartObject.getListByKey(oFF.VizDefConstants.K_BINDINGS);
				for (var bIndex = 0; bIndex < bindingsList.size(); bIndex++)
				{
					feedStruct = bindingsList.getStructureAt(bIndex);
					if (oFF.XString.isEqual(feedStruct.getStringByKey(oFF.VizDefConstants.K_FEED), oFF.VizDefConstants.K_COLOR))
					{
						var sourceList = feedStruct.getListByKey(oFF.VizDefConstants.K_SOURCE);
						if (sourceList.size() > 0)
						{
							colordimensionId = sourceList.getStructureAt(0).getStringByKey(oFF.VizDefConstants.K_ID);
						}
						break;
					}
				}
				var storyWideSettings = globalDef.getStructureByKey(oFF.VizDefConstants.K_STORY_WIDE_SETTINGS);
				if (oFF.notNull(storyWideSettings))
				{
					var customColorPalette = storyWideSettings.getListByKey(oFF.VizDefConstants.K_CUSTOM_COLOR_PALETTES);
					if (oFF.notNull(customColorPalette))
					{
						var customColorPaletteGradient = customColorPalette.getStructureAt(0).getStructureByKey(oFF.VizDefConstants.K_GRADIENT);
						var strcut = customColorPaletteGradient.getKeysAsReadOnlyListOfString();
						var stopList = oFF.PrFactory.createList();
						for (var oo = 0; oo < strcut.size(); oo++)
						{
							var list = oFF.PrFactory.createList();
							list.addString(strcut.get(oo));
							list.addString(customColorPaletteGradient.getStringByKey(strcut.get(oo)));
							stopList.add(list);
						}
					}
				}
				if (oFF.notNull(colorSync))
				{
					colorSyncColordim = colorSync.getStructureByKey(colordimensionId);
					if (oFF.notNull(colorSyncColordim))
					{
						var explicitColorAssignments = colorSyncColordim.getStructureByKey(oFF.VizDefConstants.K_EXPLICIT_COLOR_ASSIGNMENTS);
						theChartData.put(oFF.VizDefConstants.K_EXPLICIT_COLOR_ASSIGNMENTS, explicitColorAssignments);
					}
				}
			}
		}
	}
};

oFF.RsHiChartVizUtilsCorrelation = {

	create:function()
	{
			return new oFF.RsHiChartVizUtilsCorrelation();
	},
	renderValueAxis:function(axisData, axisDef, bAlignTitle)
	{
			var axisTitle = axisData.putNewStructure(oFF.VizDefConstants.K_TITLE);
		axisData.putInteger(oFF.VizDefConstants.K_GRIDLINE_WIDTH, 0);
		if (oFF.isNull(axisDef))
		{
			return;
		}
		axisData.putBoolean(oFF.VizDefConstants.K_VISIBLE, axisDef.getBooleanByKey(oFF.VizDefConstants.K_VISIBLE));
		var axisLine = axisDef.getStructureByKey(oFF.VizDefConstants.K_AXIS_LINE);
		axisData.putInteger(oFF.VizDefConstants.K_LINE_WIDTH, axisLine.getBooleanByKey(oFF.VizDefConstants.K_VISIBLE) ? 3 : 0);
		axisData.putString(oFF.VizDefConstants.K_LINE_COLOR, "#bbbdbf");
		var axisTick = axisDef.getStructureByKey(oFF.VizDefConstants.K_AXIS_TICK);
		var iTickLen = 0;
		if (oFF.notNull(axisTick) && axisTick.getBooleanByKey(oFF.VizDefConstants.K_VISIBLE))
		{
			iTickLen = axisTick.getIntegerByKey(oFF.VizDefConstants.K_SIZE);
		}
		axisData.putInteger(oFF.VizDefConstants.K_TICK_LENGTH, iTickLen);
		axisData.putString(oFF.VizDefConstants.K_TICK_COLOR, "rgb(166, 168, 171)");
		var axisLabelProperties = axisDef.getStructureByKey(oFF.VizDefConstants.K_LABEL);
		var axisLabel = axisData.putNewStructure(oFF.VizDefConstants.K_LABEL);
		axisLabel.putBoolean(oFF.VizDefConstants.K_ENABLED, axisLabelProperties.getBooleanByKey(oFF.VizDefConstants.K_VISIBLE));
		var labelFont = axisData.putNewStructure(oFF.VizDefConstants.K_STYLE);
		var labelProperties = axisLabelProperties.getStructureByKey(oFF.VizDefConstants.K_STYLE);
		labelFont.putString(oFF.VizDefConstants.K_COLOR, labelProperties.getStringByKey(oFF.VizDefConstants.K_COLOR));
		labelFont.putString(oFF.VizDefConstants.K_FONT_FAMILY, axisLabelProperties.getStringByKey(oFF.VizDefConstants.K_FONT_FAMILY));
		labelFont.putString(oFF.VizDefConstants.K_FONT_SIZE, axisLabelProperties.getStringByKey(oFF.VizDefConstants.K_FONT_SIZE));
		var titleProperties = axisDef.getStructureByKey(oFF.VizDefConstants.K_TITLE);
		axisTitle.putBoolean(oFF.VizDefConstants.K_ENABLED, titleProperties.getBooleanByKey(oFF.VizDefConstants.K_VISIBLE));
		if (bAlignTitle)
		{
			axisTitle.putString(oFF.VizDefConstants.K_ALIGN, oFF.VizDefConstants.V_MIDDLE);
		}
		var axisTitleStyle = axisTitle.putNewStructure(oFF.VizDefConstants.K_STYLE);
		var titleFont = titleProperties.getStructureByKey(oFF.VizDefConstants.K_STYLE);
		axisTitleStyle.putString(oFF.VizDefConstants.K_COLOR, "#000000");
		axisTitleStyle.putString(oFF.VizDefConstants.K_FONT_WEIGHT, oFF.VizDefConstants.K_BOLD);
		labelFont.putString(oFF.VizDefConstants.K_COLOR, titleFont.getStringByKey(oFF.VizDefConstants.K_COLOR));
		labelFont.putString(oFF.VizDefConstants.K_FONT_FAMILY, titleFont.getStringByKey(oFF.VizDefConstants.K_FONT_FAMILY));
		labelFont.putString(oFF.VizDefConstants.K_FONT_SIZE, titleFont.getStringByKey(oFF.VizDefConstants.K_FONT_SIZE));
	},
	legendStyler:function(theChartData)
	{
			var legend = theChartData.putNewStructure(oFF.VizDefConstants.K_LEGEND);
		legend.putBoolean(oFF.VizDefConstants.K_ENABLED, true);
		legend.putBoolean(oFF.VizDefConstants.K_SQUARE_SYMBOL, true);
		legend.putInteger(oFF.VizDefConstants.K_SYMBOL_RADIUS, 0);
		legend.putString(oFF.VizDefConstants.K_LAYOUT, oFF.VizDefConstants.V_HORIZONTAL);
		legend.putString(oFF.VizDefConstants.K_ALIGN, oFF.VizDefConstants.V_CENTER);
		legend.putString(oFF.VizDefConstants.K_VERTICAL_ALIGN, oFF.VizDefConstants.V_POSITION_TOP);
		var legenditemStyle = legend.putNewStructure(oFF.VizDefConstants.K_ITEM_STYLE);
		legenditemStyle.putString(oFF.VizDefConstants.K_FONT_SIZE, "12px");
		legenditemStyle.putString(oFF.VizDefConstants.K_FONT_WEIGHT, oFF.VizDefConstants.V_NORMAL);
		legenditemStyle.putString(oFF.VizDefConstants.K_FONT_SIZE, "12px");
	}
};

oFF.RsHiChartVizUtilsHeatmap = {

	create:function()
	{
			return new oFF.RsHiChartVizUtilsHeatmap();
	},
	rendrerHeatmap:function(theChartData, chartType, vizDef, globalDef)
	{
			var plotOptions = theChartData.getStructureByKey(oFF.VizDefConstants.K_PLOT_OPTIONS);
		if (oFF.isNull(plotOptions))
		{
			plotOptions = theChartData.putNewStructure(oFF.VizDefConstants.K_PLOT_OPTIONS);
		}
		var plotOptionChartTypeStructure = plotOptions.getStructureByKey(chartType);
		plotOptionChartTypeStructure.putBoolean(oFF.VizDefConstants.K_COLOR_BY_POINT, false);
		var chartTypeInfo = theChartData.getStructureByKey(oFF.VizDefConstants.K_CHART);
		chartTypeInfo.putString(oFF.VizDefConstants.K_TYPE, chartType);
		var isInverted = true;
		chartTypeInfo.putBoolean(oFF.VizDefConstants.K_INVERTED, isInverted);
		var colorAxis = theChartData.putNewStructure(oFF.VizDefConstants.K_COLOR_AXIS);
		var paletteChart = theChartData.getStructureByKey(oFF.VizDefConstants.K_PALETTE);
		if (oFF.notNull(paletteChart))
		{
			var thresholdList1 = oFF.PrFactory.createList();
			var altValue = 0;
			var colorInt = "#FFFFFF";
			var gradientKeys = paletteChart.getListByKey(oFF.VizDefConstants.K_GRADIENT_KEYS);
			var gradientStructure = paletteChart.getStructureByKey(oFF.VizDefConstants.K_GRADIENT);
			for (var gk = 0; gk < gradientKeys.size(); gk++)
			{
				var intervalList1 = oFF.PrFactory.createList();
				altValue = gradientKeys.getDoubleAt(gk) / 100;
				colorInt = gradientStructure.getStringByKey(oFF.XDouble.convertToString(gradientKeys.getDoubleAt(gradientKeys.size() - 1 - gk)));
				intervalList1.addDouble(altValue);
				intervalList1.addString(colorInt);
				thresholdList1.add(intervalList1);
			}
			colorAxis.put(oFF.VizDefConstants.K_STOPS, thresholdList1);
		}
		var isHeatmap = oFF.XString.isEqual(chartType, oFF.VizDefConstants.K_HEATMAP);
		if (oFF.notNull(globalDef))
		{
			var intervalStructure = oFF.PrFactory.createStructure();
			var minInterval = 0;
			var gradiantValue = 0;
			var intervalColor = "#FFFFFF";
			var thresholdIntervals = globalDef.getListByKey(oFF.VizDefConstants.K_THRESHOLDS);
			if (oFF.notNull(thresholdIntervals) && isHeatmap)
			{
				var thresholdList = oFF.PrFactory.createList();
				var maxElement = 1;
				if (theChartData.containsKey(oFF.VizDefConstants.K_MAX_ELEMENT))
				{
					maxElement = oFF.XMath.max(oFF.XDouble.convertToInt(theChartData.getDoubleByKey(oFF.VizDefConstants.K_MAX_ELEMENT)), oFF.XDouble.convertToInt(theChartData.getDoubleByKey(oFF.VizDefConstants.K_MAX_ELEMENT)) * -1);
				}
				for (var ti = 0; ti < thresholdIntervals.size(); ti++)
				{
					intervalStructure = thresholdIntervals.getStructureAt(ti);
					var intervalList = oFF.PrFactory.createList();
					minInterval = intervalStructure.getDoubleByKey(oFF.VizDefConstants.K_LOW);
					intervalColor = intervalStructure.getStringByKey(oFF.VizDefConstants.K_COLOR);
					gradiantValue = minInterval / maxElement;
					intervalList.addDouble(gradiantValue);
					intervalList.addString(intervalColor);
					thresholdList.add(intervalList);
				}
				colorAxis.put(oFF.VizDefConstants.K_STOPS, thresholdList);
			}
		}
		var legend = theChartData.getStructureByKey(oFF.VizDefConstants.K_LEGEND);
		var xAxis = oFF.PrFactory.createList();
		var xAxisStruct = oFF.PrFactory.createStructure();
		var yAxis = oFF.PrFactory.createList();
		var yAxisStruct = oFF.PrFactory.createStructure();
		if (isHeatmap)
		{
			xAxis = theChartData.getListByKey(oFF.VizDefConstants.K_X_AXIS);
			if (oFF.isNull(xAxis))
			{
				xAxis = theChartData.putNewList(oFF.VizDefConstants.K_X_AXIS);
				xAxisStruct = xAxis.addNewStructure();
			}
			else
			{
				xAxisStruct = xAxis.getStructureAt(0);
			}
			yAxis = theChartData.getListByKey(oFF.VizDefConstants.K_Y_AXIS);
			if (oFF.isNull(yAxis))
			{
				yAxis = theChartData.putNewList(oFF.VizDefConstants.K_Y_AXIS);
				yAxisStruct = yAxis.addNewStructure();
			}
			else
			{
				yAxisStruct = yAxis.getStructureAt(0);
			}
		}
		var dataLabels = plotOptionChartTypeStructure.getStructureByKey(oFF.VizDefConstants.K_DATA_LABELS);
		var yAxisTitle = yAxisStruct.putNewStructure(oFF.VizDefConstants.K_TITLE);
		var xAxisTitle = xAxisStruct.putNewStructure(oFF.VizDefConstants.K_TITLE);
		yAxisTitle.putString(oFF.VizDefConstants.K_TEXT, "");
		xAxisTitle.putString(oFF.VizDefConstants.K_TEXT, "");
		var minColor = "#a0f3ff";
		var maxColor = "#003c6b";
		var isDataLabels = true;
		if (oFF.notNull(vizDef))
		{
			var colorScheme = vizDef.getStructureByKey(oFF.VizDefConstants.K_COLOR_SCHEME);
			if (oFF.notNull(colorScheme))
			{
				var paletteColors = colorScheme.getListByKey(oFF.VizDefConstants.K_PALETTE_COLORS);
				if (oFF.notNull(paletteColors))
				{
					if (paletteColors.size() > 0)
					{
						maxColor = paletteColors.getStringAt(0);
						minColor = paletteColors.getStringAt(paletteColors.size() - 1);
					}
				}
			}
			var vizProp = vizDef.getStructureByKey(oFF.VizDefConstants.K_CHART).getStructureByKey(oFF.VizDefConstants.K_PROPERTIES);
			if (oFF.notNull(vizProp))
			{
				var vizPropCategoryAxis = vizProp.getStructureByKey(oFF.VizDefConstants.K_CATEGORY_AXIS2);
				if (oFF.notNull(vizPropCategoryAxis))
				{
					xAxisStruct = oFF.RsHiChartUtils.axisPloter(vizPropCategoryAxis, xAxisStruct, chartType, true);
				}
				var vizPropCategoryAxis2 = vizProp.getStructureByKey(oFF.VizDefConstants.K_CATEGORY_AXIS);
				if (oFF.notNull(vizPropCategoryAxis2))
				{
					yAxisStruct = oFF.RsHiChartUtils.axisPloter(vizPropCategoryAxis2, yAxisStruct, chartType, true);
				}
				var vizPlotArea = vizProp.getStructureByKey(oFF.VizDefConstants.K_PLOT_AREA);
				if (oFF.notNull(vizPlotArea))
				{
					dataLabels.putBoolean(oFF.VizDefConstants.K_ENABLED, isDataLabels);
				}
			}
			colorAxis.putString(oFF.VizDefConstants.K_MIN_COLOR, minColor);
			colorAxis.putString(oFF.VizDefConstants.K_MAX_COLOR, maxColor);
			colorAxis.putBoolean(oFF.VizDefConstants.K_REVERSED, false);
		}
		else
		{
			var yAxisLabels = yAxisStruct.putNewStructure(oFF.VizDefConstants.K_LABELS);
			var yAxisLabelsStyle = yAxisLabels.putNewStructure(oFF.VizDefConstants.K_STYLE);
			yAxisLabelsStyle.putString(oFF.VizDefConstants.K_FONT_SIZE, "13px");
			yAxisLabelsStyle.putString(oFF.VizDefConstants.K_FILL, "rgb(166, 168, 171)");
			yAxisLabelsStyle.putString(oFF.VizDefConstants.K_FONT_WEIGHT, oFF.VizDefConstants.V_FONT_WEIGHT_NORMAL);
			xAxisStruct.putString(oFF.VizDefConstants.K_LINE_COLOR, "#FFFFFF");
			var xAxisLabels1 = xAxisStruct.putNewStructure(oFF.VizDefConstants.K_LABELS);
			var xAxisLabelsStyle1 = xAxisLabels1.putNewStructure(oFF.VizDefConstants.K_STYLE);
			xAxisLabelsStyle1.putString(oFF.VizDefConstants.K_FONT_SIZE, "13px");
			xAxisLabelsStyle1.putString(oFF.VizDefConstants.K_FILL, "rgb(166, 168, 171)");
			xAxisLabelsStyle1.putString(oFF.VizDefConstants.K_FONT_WEIGHT, oFF.VizDefConstants.V_FONT_WEIGHT_NORMAL);
			colorAxis.putString(oFF.VizDefConstants.K_MIN_COLOR, minColor);
			colorAxis.putString(oFF.VizDefConstants.K_MAX_COLOR, maxColor);
			colorAxis.putInteger(oFF.VizDefConstants.K_MIN, 1);
		}
		var isTreemap = oFF.XString.isEqual(chartType, oFF.VizDefConstants.K_TREEMAP);
		if (isTreemap)
		{
			plotOptionChartTypeStructure.putString(oFF.VizDefConstants.K_TYPE, chartType);
			var objectLevels = plotOptionChartTypeStructure.putNewList(oFF.VizDefConstants.K_LEVELS);
			var objectLevel1 = objectLevels.addNewStructure();
			objectLevel1.putInteger(oFF.VizDefConstants.K_LEVEL, 1);
			objectLevel1.putInteger(oFF.VizDefConstants.K_BORDER_WIDTH, 6);
			var objectLeveldatalabels = objectLevel1.putNewStructure(oFF.VizDefConstants.K_DATA_LABELS);
			objectLeveldatalabels.putBoolean(oFF.VizDefConstants.K_ENABLED, true);
			objectLeveldatalabels.putString(oFF.VizDefConstants.K_FORMAT, "<div>{point.name}</div><br/>");
			objectLeveldatalabels.putString(oFF.VizDefConstants.K_ALIGN, oFF.VizDefConstants.V_LEFT);
			objectLeveldatalabels.putString(oFF.VizDefConstants.K_VERTICAL_ALIGN, oFF.VizDefConstants.V_POSITION_TOP);
			var objectLeveldatalabelsStyle = objectLeveldatalabels.putNewStructure(oFF.VizDefConstants.K_STYLE);
			objectLeveldatalabelsStyle.putString(oFF.VizDefConstants.K_FONT_SIZE, "14px");
			var objectLevel2 = objectLevels.addNewStructure();
			objectLevel2.putInteger(oFF.VizDefConstants.K_LEVEL, 2);
			var objectLeveldatalabels1 = objectLevel2.putNewStructure(oFF.VizDefConstants.K_DATA_LABELS);
			objectLeveldatalabels1.putBoolean(oFF.VizDefConstants.K_ENABLED, true);
			objectLeveldatalabels1.putString(oFF.VizDefConstants.K_FORMAT, "<div>{point.name}</div><br/><div>{point.valueFormatted}</div >");
			legend.putInteger(oFF.VizDefConstants.K_Y, 25);
		}
		dataLabels.putBoolean(oFF.VizDefConstants.K_ENABLED, isDataLabels);
		dataLabels.putBoolean(oFF.VizDefConstants.K_HIDE_WHEN_OVERLAP, true);
		var dataLabelsStyle = dataLabels.putNewStructure(oFF.VizDefConstants.K_STYLE);
		dataLabelsStyle.putString(oFF.VizDefConstants.K_FONT_FAMILY, "LatoWeb, 'Open Sans', 'Helvetica Neue', Helvetica, Arial, 'sans serif'");
		dataLabelsStyle.putString(oFF.VizDefConstants.K_FONT_SIZE, "10px");
		dataLabelsStyle.putString(oFF.VizDefConstants.K_FONT_WEIGHT, oFF.VizDefConstants.V_FONT_WEIGHT_NORMAL);
		dataLabelsStyle.putString(oFF.VizDefConstants.K_FILL, "black");
		dataLabelsStyle.putString(oFF.VizDefConstants.K_COLOR, "black");
		dataLabelsStyle.putString(oFF.VizDefConstants.K_TEXT_OUTLINE, "0px");
		dataLabels.putString(oFF.VizDefConstants.K_ALIGN, oFF.VizDefConstants.V_CENTER);
		legend.putBoolean(oFF.VizDefConstants.K_ENABLED, true);
		legend.putString(oFF.VizDefConstants.K_LAYOUT, oFF.VizDefConstants.V_VERTICAL);
		legend.putString(oFF.VizDefConstants.K_ALIGN, oFF.VizDefConstants.V_RIGHT);
		legend.putString(oFF.VizDefConstants.K_VERTICAL_ALIGN, oFF.VizDefConstants.V_MIDDLE);
		legend.putInteger("x", 15);
		var legendStyle = legend.putNewStructure(oFF.VizDefConstants.K_STYLE);
		legendStyle.putString(oFF.VizDefConstants.K_FONT_FAMILY, "LatoWeb, 'Open Sans', 'Helvetica Neue', Helvetica, Arial, 'sans serif'");
		return theChartData;
	}
};

oFF.RsHiChartVizUtilsSimple = {

	create:function()
	{
			return new oFF.RsHiChartVizUtilsSimple();
	},
	legendStyler:function(theChartData)
	{
			var legend = theChartData.getStructureByKey(oFF.VizDefConstants.K_LEGEND);
		if (oFF.notNull(legend))
		{
			legend.putBoolean(oFF.VizDefConstants.K_SQUARE_SYMBOL, true);
			legend.putInteger(oFF.VizDefConstants.K_SYMBOL_RADIUS, 0);
			legend.putString(oFF.VizDefConstants.K_LAYOUT, oFF.VizDefConstants.V_HORIZONTAL);
			legend.putString(oFF.VizDefConstants.K_ALIGN, oFF.VizDefConstants.V_CENTER);
			legend.putInteger(oFF.VizDefConstants.K_Y, 20);
			legend.putString(oFF.VizDefConstants.K_VERTICAL_ALIGN, oFF.VizDefConstants.V_POSITION_TOP);
			var legenditemStyle = legend.putNewStructure(oFF.VizDefConstants.K_ITEM_STYLE);
			legenditemStyle.putString(oFF.VizDefConstants.K_FONT_SIZE, "12px");
			legenditemStyle.putString(oFF.VizDefConstants.K_FONT_WEIGHT, oFF.VizDefConstants.V_NORMAL);
			legenditemStyle.putString(oFF.VizDefConstants.K_FONT_SIZE, "12px");
		}
	},
	plotOptionChart:function(yAxis, chartType, stackingTypeN, plotOptions, yNumber, fillColor)
	{
			var yAxisTitle = yAxis.putNewStructure(oFF.VizDefConstants.K_TITLE);
		yAxisTitle.putString(oFF.VizDefConstants.K_TEXT, "");
		yAxis.putInteger(oFF.VizDefConstants.K_GRID_LINE_WIDTH, 0);
		var plotOptionChartTypeStructure;
		plotOptionChartTypeStructure = plotOptions.getStructureByKey(chartType);
		if (yNumber === 1 || oFF.isNull(plotOptionChartTypeStructure))
		{
			plotOptionChartTypeStructure = plotOptions.putNewStructure(chartType);
		}
		if (oFF.XStringUtils.isNotNullAndNotEmpty(stackingTypeN) && !oFF.XString.isEqual(stackingTypeN, "null"))
		{
			plotOptionChartTypeStructure.putString(oFF.VizDefConstants.K_STACKING, stackingTypeN);
		}
		plotOptionChartTypeStructure.putInteger(oFF.VizDefConstants.K_Y_AXIS, yNumber);
		plotOptionChartTypeStructure.putBoolean(oFF.VizDefConstants.K_COLOR_BY_POINT, false);
		plotOptionChartTypeStructure.putDouble(oFF.VizDefConstants.K_POINT_PADDING, 0);
		if (oFF.XString.isEqual(oFF.VizDefConstants.V_CHART_TYPE_BOXPLOT, chartType))
		{
			plotOptionChartTypeStructure.putString(oFF.VizDefConstants.K_FILL_COLOR, fillColor);
			yAxis.putInteger(oFF.VizDefConstants.K_TICK_AMOUNT, 4);
		}
		var dataLabels = plotOptionChartTypeStructure.getStructureByKey(oFF.VizDefConstants.K_DATA_LABELS);
		if (oFF.isNull(dataLabels))
		{
			dataLabels = plotOptionChartTypeStructure.putNewStructure(oFF.VizDefConstants.K_DATA_LABELS);
		}
		oFF.RsHiChartVizUtilsSimple.dataLabelBuilder(dataLabels);
	},
	addReferenceLine:function(vizDef, valueAxisStruct, valueAxis2Struct, colAxis, rowAxis, crs)
	{
			var hasReferenceLines = false;
		var analyticObjects = vizDef.getStructureByKey(oFF.VizDefConstants.K_ANALYTIC_OBJECTS);
		if (oFF.notNull(analyticObjects))
		{
			var referenceLineList = analyticObjects.getListByKey(oFF.VizDefConstants.K_REFERENCELINES);
			if (oFF.notNull(referenceLineList))
			{
				if (referenceLineList.hasElements())
				{
					hasReferenceLines = true;
					for (var i = 0; i < referenceLineList.size(); i++)
					{
						var referenceLine = referenceLineList.getStructureAt(i);
						var referenceLineMarkers = referenceLine.getListByKey(oFF.VizDefConstants.K_MARKERS);
						var referenceLineFeed = referenceLine.getStringByKey(oFF.VizDefConstants.K_FEED);
						for (var qq = 0; qq < referenceLineMarkers.size(); qq++)
						{
							var referenceLineMarkersStruct = referenceLineMarkers.getStructureAt(qq);
							var plotLineValue = 0;
							if (referenceLineMarkersStruct.containsKey(oFF.VizDefConstants.K_DYNAMIC_VALUE))
							{
								var dnStruct = referenceLineMarkersStruct.getStructureByKey(oFF.VizDefConstants.K_DYNAMIC_VALUE);
								var aggType = dnStruct.getStringByKey(oFF.VizDefConstants.K_AGGREGATION_TYPE);
								var measureId = dnStruct.getStructureByKey(oFF.VizDefConstants.K_MEASURE).getStructureByKey(oFF.VizDefConstants.K_ID).getStringByKey(oFF.VizDefConstants.K_ID);
								var colId = colAxis.getTupleIndexForMemberName(measureId);
								if (!oFF.XCollectionUtils.hasElements(colId))
								{
									var rowId = rowAxis.getTupleIndexForMemberName(measureId);
									if (oFF.XCollectionUtils.hasElements(rowId))
									{
										plotLineValue = oFF.RsHiChartVizUtilsSimple.getAggregateValue(rowId, colAxis, aggType, false, crs);
									}
								}
								else
								{
									plotLineValue = oFF.RsHiChartVizUtilsSimple.getAggregateValue(colId, rowAxis, aggType, true, crs);
								}
							}
							else
							{
								plotLineValue = oFF.RsHiChartRenderer.getDoubleValueExtended(referenceLineMarkersStruct, oFF.VizDefConstants.K_VALUE, 0);
							}
							var color = oFF.VizDefConstants.V_BLACK;
							if (referenceLineMarkersStruct.hasStringByKey(oFF.VizDefConstants.K_COLOR))
							{
								color = referenceLineMarkersStruct.getStringByKey(oFF.VizDefConstants.K_COLOR);
							}
							var colorBelow = referenceLineMarkersStruct.getStringByKey("belowColor");
							var colorAbove = referenceLineMarkersStruct.getStringByKey("aboveColor");
							var referenceLineLabel = referenceLineMarkersStruct.getStructureByKey(oFF.VizDefConstants.K_LABEL);
							var text = referenceLineLabel.getStringByKey(oFF.VizDefConstants.K_TEXT);
							var referenceLineLabelStyle = referenceLineLabel.getStructureByKey(oFF.VizDefConstants.K_STYLE);
							if (oFF.XString.isEqual(oFF.VizDefConstants.K_VALUE_AXIS, referenceLineFeed))
							{
								oFF.RsHiChartVizUtilsSimple.ploLineBuilder(valueAxisStruct, plotLineValue, colorBelow, colorAbove, color, text, referenceLineLabelStyle);
							}
							if (oFF.XString.isEqual(oFF.VizDefConstants.K_VALUE_AXIS2, referenceLineFeed))
							{
								oFF.RsHiChartVizUtilsSimple.ploLineBuilder(valueAxis2Struct, plotLineValue, colorBelow, colorAbove, color, text, referenceLineLabelStyle);
							}
						}
					}
				}
			}
		}
		return hasReferenceLines;
	},
	ploLineBuilder:function(yAxis, Value, belowColor, aboveColor, color, text, styleStructure)
	{
			var colorB = "#000000";
		var plotLines = yAxis.containsKey(oFF.VizDefConstants.K_PLOT_LINES) ? yAxis.getListByKey(oFF.VizDefConstants.K_PLOT_LINES) : yAxis.putNewList(oFF.VizDefConstants.K_PLOT_LINES);
		var plotLinepProp = plotLines.addNewStructure();
		if (oFF.notNull(color))
		{
			colorB = color;
		}
		plotLinepProp.putString(oFF.VizDefConstants.K_COLOR, colorB);
		var plotLineslabels = plotLinepProp.putNewStructure(oFF.VizDefConstants.K_LABEL);
		if (oFF.notNull(text))
		{
			plotLineslabels.putString(oFF.VizDefConstants.K_TEXT, text);
		}
		else
		{
			plotLineslabels.putString(oFF.VizDefConstants.K_TEXT, oFF.XDouble.convertToString(Value));
		}
		var plotLinepPropStrucStyle = plotLineslabels.putNewStructure(oFF.VizDefConstants.K_STYLE);
		plotLinepPropStrucStyle.putString(oFF.VizDefConstants.K_COLOR, styleStructure.getStringByKey(oFF.VizDefConstants.K_COLOR));
		plotLinepProp.putString(oFF.VizDefConstants.K_DASH_STYLE, oFF.VizDefConstants.K_SHORT_DOT);
		plotLineslabels.putInteger(oFF.VizDefConstants.K_ROTATION, 0);
		plotLinepProp.putDouble(oFF.VizDefConstants.K_VALUE, Value);
		plotLinepProp.putInteger(oFF.VizDefConstants.K_WIDTH, 2);
		var plotBands = yAxis.containsKey(oFF.VizDefConstants.K_PLOT_BANDS) ? yAxis.getListByKey(oFF.VizDefConstants.K_PLOT_BANDS) : yAxis.putNewList(oFF.VizDefConstants.K_PLOT_BANDS);
		if (oFF.notNull(belowColor))
		{
			var plotBandsProp = plotBands.addNewStructure();
			plotBandsProp.putString(oFF.VizDefConstants.K_COLOR, oFF.RsHiChartVizUtilsSimple.setColorAlpha(belowColor, 0.2));
			plotBandsProp.putDouble(oFF.VizDefConstants.K_FROM, 0);
			plotBandsProp.putDouble(oFF.VizDefConstants.K_TO, Value);
		}
		if (oFF.notNull(aboveColor))
		{
			var plotBandsProp1 = plotBands.addNewStructure();
			plotBandsProp1.putString(oFF.VizDefConstants.K_COLOR, oFF.RsHiChartVizUtilsSimple.setColorAlpha(aboveColor, 0.2));
			plotBandsProp1.putDouble(oFF.VizDefConstants.K_FROM, Value);
			plotBandsProp1.putDouble(oFF.VizDefConstants.K_TO, Value * 100);
		}
	},
	setColorAlpha:function(colorString, alpha)
	{
			var newColor = null;
		var alphaString = oFF.XDouble.convertToString(alpha);
		if (oFF.notNull(colorString))
		{
			if (oFF.XString.startsWith(colorString, "rgb"))
			{
				var end = oFF.XString.indexOf(colorString, ")");
				if (end > 0)
				{
					newColor = oFF.XString.replace(colorString, "rgb", "rgba");
					var alphaToAdd = oFF.XStringUtils.concatenate3(",", alphaString, ")");
					newColor = oFF.XString.replace(newColor, ")", alphaToAdd);
				}
			}
			else if (oFF.XString.isEqual(colorString, "transparent"))
			{
				newColor = oFF.XStringUtils.concatenate3("rgba(255,255,255,", alphaString, ")");
			}
			else
			{
				newColor = colorString;
			}
		}
		return newColor;
	},
	dataLabelBuilder:function(dataLabels)
	{
			var dataLabelsStyle = dataLabels.putNewStructure(oFF.VizDefConstants.K_STYLE);
		dataLabels.putBoolean(oFF.VizDefConstants.K_ENABLED, true);
		dataLabels.putBoolean(oFF.VizDefConstants.K_HIDE_WHEN_OVERLAP, true);
		dataLabels.putString(oFF.VizDefConstants.K_FORMAT, "{point.yFormatted} ");
		dataLabelsStyle.putString(oFF.VizDefConstants.K_FILL, "black");
		dataLabelsStyle.putString(oFF.VizDefConstants.K_COLOR, "black");
		dataLabelsStyle.putString(oFF.VizDefConstants.K_FONT_FAMILY, "LatoWeb, 'Open Sans', 'Helvetica Neue', Helvetica, Arial, 'sans serif'");
		dataLabelsStyle.putString(oFF.VizDefConstants.K_FONT_SIZE, "12px");
		dataLabelsStyle.putString(oFF.VizDefConstants.K_FONT_WEIGHT, oFF.VizDefConstants.V_NORMAL);
		dataLabelsStyle.putString(oFF.VizDefConstants.K_TEXT_OUTLINE, "0px");
	},
	dataLabelAlignment:function(yAxis, chartType, decimalPlaces, showStackingLabel)
	{
			var axisStackLabels = yAxis.putNewStructure(oFF.VizDefConstants.K_STACK_LABELS);
		axisStackLabels.putBoolean(oFF.VizDefConstants.K_ENABLED, showStackingLabel);
		axisStackLabels.putString(oFF.VizDefConstants.K_FORMAT, oFF.XStringUtils.concatenate3("{total:,.", oFF.XInteger.convertToString(decimalPlaces), "f}"));
		if (oFF.XString.isEqual(oFF.VizDefConstants.V_CHART_TYPE_BAR, chartType))
		{
			var stackLabelsStlye = axisStackLabels.putNewStructure(oFF.VizDefConstants.K_STYLE);
			stackLabelsStlye.putString(oFF.VizDefConstants.K_COLOR, "rgb(88,89,91)");
			stackLabelsStlye.putString(oFF.VizDefConstants.K_FONT_SIZE, "12px");
			stackLabelsStlye.putString(oFF.VizDefConstants.K_FONT_STYLE, oFF.VizDefConstants.V_NORMAL);
			stackLabelsStlye.putString(oFF.VizDefConstants.K_FONT_WEIGHT, oFF.VizDefConstants.K_BOLD);
		}
		else if (oFF.XString.isEqual(oFF.VizDefConstants.V_CHART_TYPE_COLUMN, chartType))
		{
			axisStackLabels.putString(oFF.VizDefConstants.K_ALIGN, oFF.VizDefConstants.V_CENTER);
			axisStackLabels.putString(oFF.VizDefConstants.K_VERTICAL_ALIGN, oFF.VizDefConstants.V_POSITION_TOP);
			axisStackLabels.putInteger(oFF.VizDefConstants.K_Y, -20);
			axisStackLabels.putInteger(oFF.VizDefConstants.K_X, 5);
		}
		else
		{
			axisStackLabels.putString(oFF.VizDefConstants.K_ALIGN, oFF.VizDefConstants.V_CENTER);
			axisStackLabels.putInteger(oFF.VizDefConstants.K_Y, -20);
		}
	},
	getAggregateValue:function(indexList, axis, aggType, rowIteration, crs)
	{
			var counter = 0;
		var aggregator = 0;
		for (var i = 0; i < axis.getTuplesCount(); i++)
		{
			if (!axis.getTupleAt(i).isTotal())
			{
				for (var j = 0; j < indexList.size(); j++)
				{
					var index = indexList.get(j).getInteger();
					var curDataCell;
					if (rowIteration)
					{
						curDataCell = crs.getDataCell(index, i);
					}
					else
					{
						curDataCell = crs.getDataCell(i, index);
					}
					if (curDataCell.getValueException() !== oFF.ValueException.NORMAL)
					{
						continue;
					}
					var curValue = curDataCell.getDouble();
					if (counter === 0)
					{
						aggregator = curValue;
					}
					else if (oFF.XString.isEqual(aggType, "max"))
					{
						if (aggregator < curValue)
						{
							aggregator = curValue;
						}
					}
					else if (oFF.XString.isEqual(aggType, "min"))
					{
						if (aggregator > curValue)
						{
							aggregator = curValue;
						}
					}
					else
					{
						aggregator = aggregator + curValue;
					}
					counter++;
				}
			}
		}
		if (oFF.XString.isEqual(aggType, "average") || oFF.XString.isEqual(aggType, "avg"))
		{
			return aggregator / counter;
		}
		return aggregator;
	}
};

oFF.GridRendererFactoryImpl = function() {};
oFF.GridRendererFactoryImpl.prototype = new oFF.XObject();
oFF.GridRendererFactoryImpl.prototype._ff_c = "GridRendererFactoryImpl";

oFF.GridRendererFactoryImpl.create = function()
{
	return new oFF.GridRendererFactoryImpl();
};
oFF.GridRendererFactoryImpl.prototype.newRenderer = function(protocolType)
{
	return oFF.RsSacTableRenderer.create();
};

oFF.GridResolverFactoryImpl = function() {};
oFF.GridResolverFactoryImpl.prototype = new oFF.XObject();
oFF.GridResolverFactoryImpl.prototype._ff_c = "GridResolverFactoryImpl";

oFF.GridResolverFactoryImpl.create = function()
{
	return new oFF.GridResolverFactoryImpl();
};
oFF.GridResolverFactoryImpl.prototype.newResolver = function(protocolType)
{
	return oFF.RsSacTableContextResolver._create();
};

oFF.RsSacTableContextResolver = function() {};
oFF.RsSacTableContextResolver.prototype = new oFF.XObject();
oFF.RsSacTableContextResolver.prototype._ff_c = "RsSacTableContextResolver";

oFF.RsSacTableContextResolver._create = function()
{
	var instance = new oFF.RsSacTableContextResolver();
	instance.setupTupleLists();
	return instance;
};
oFF.RsSacTableContextResolver.prototype.m_modelJson = null;
oFF.RsSacTableContextResolver.prototype.m_rowList = null;
oFF.RsSacTableContextResolver.prototype.m_columnTuples = null;
oFF.RsSacTableContextResolver.prototype.m_rowTuples = null;
oFF.RsSacTableContextResolver.prototype.m_columnDimensions = null;
oFF.RsSacTableContextResolver.prototype.m_rowDimensions = null;
oFF.RsSacTableContextResolver.prototype.setupTupleLists = function()
{
	this.m_columnTuples = oFF.XList.create();
	this.m_rowTuples = oFF.XList.create();
};
oFF.RsSacTableContextResolver.prototype.updateModel = function(classicResultSet, modelJson, rowList)
{
	this.m_modelJson = modelJson;
	this.m_rowList = rowList;
	if (oFF.notNull(classicResultSet))
	{
		var rcc = classicResultSet.getResultSetContainer();
		var offsetColumns = rcc.getOffsetColumns();
		if (offsetColumns === 0)
		{
			this.m_columnTuples.clear();
			this.m_columnDimensions = classicResultSet.getColumnsAxis().getRsDimensions();
		}
		this.fillAxis(offsetColumns, classicResultSet.getColumnsAxis(), this.m_columnTuples);
		var offsetRows = rcc.getOffsetRows();
		if (offsetRows === 0)
		{
			this.m_rowTuples.clear();
			this.m_rowDimensions = classicResultSet.getRowsAxis().getRsDimensions();
		}
		this.fillAxis(offsetRows, classicResultSet.getRowsAxis(), this.m_rowTuples);
	}
};
oFF.RsSacTableContextResolver.prototype.fillAxis = function(offset, axis, tuples)
{
	var i = 0;
	var tuplesSize = tuples.size();
	var tuplesCount = axis.getTuplesCount();
	if (offset > tuplesSize)
	{
		for (var h = tuplesSize; h < offset; h++)
		{
			tuples.add(null);
		}
	}
	else if (offset < tuplesSize)
	{
		for (; i < tuplesCount && i + offset < tuplesSize; i++)
		{
			tuples.set(i + offset, axis.getTupleAt(i));
		}
	}
	for (; i < tuplesCount; i++)
	{
		tuples.add(axis.getTupleAt(i));
	}
};
oFF.RsSacTableContextResolver.prototype.getCell = function(column, row)
{
	if (column > -1 && row > -1 && row < this.m_rowList.size())
	{
		var rowStructure = this.m_rowList.get(row);
		if (oFF.notNull(rowStructure))
		{
			if (rowStructure.getIntegerByKey(oFF.SacTableConstants.R_N_ROW) !== row)
			{
				throw oFF.XException.createIllegalStateException("Invalid model: Inconsistent row index");
			}
			var cellList = rowStructure.getListByKey(oFF.SacTableConstants.R_L_CELLS);
			if (column < cellList.size())
			{
				var cellStructure = cellList.getStructureAt(column);
				if (cellStructure.getIntegerByKey(oFF.SacTableConstants.C_N_ROW) !== row)
				{
					throw oFF.XException.createIllegalStateException("Invalid model: Inconsistent row index");
				}
				if (cellStructure.getIntegerByKey(oFF.SacTableConstants.C_N_COLUMN) !== column)
				{
					throw oFF.XException.createIllegalStateException("Invalid model: Inconsistent column index");
				}
				return cellStructure;
			}
		}
	}
	return null;
};
oFF.RsSacTableContextResolver.prototype.getDataRegionCornerCol = function()
{
	return this.m_modelJson.getIntegerByKey(oFF.SacTableConstants.TD_N_DATA_REGION_CORNER_COL);
};
oFF.RsSacTableContextResolver.prototype.getDataRegionHeaderEndRow = function()
{
	return this.m_modelJson.getIntegerByKey(oFF.SacTableConstants.TD_N_DATA_REGION_HEADER_END_ROW);
};
oFF.RsSacTableContextResolver.prototype.getDataRegionCornerRow = function()
{
	return this.m_modelJson.getIntegerByKey(oFF.SacTableConstants.TD_N_DATA_REGION_CORNER_ROW);
};
oFF.RsSacTableContextResolver.prototype.isEmptyHeaderCell = function(column, row)
{
	var cell = this.getCell(column, row);
	return row <= this.getDataRegionHeaderEndRow() && this.hasRowDimensions() && column <= this.getDataRegionCornerCol() && oFF.notNull(cell) && cell.getIntegerByKey(oFF.SacTableConstants.C_N_TYPE) === oFF.SacTableConstants.CT_HEADER;
};
oFF.RsSacTableContextResolver.prototype.isOnHeaderColumn = function(column)
{
	return this.hasRowDimensions() && column <= this.getDataRegionCornerCol();
};
oFF.RsSacTableContextResolver.prototype.isOnDataColumn = function(column)
{
	return column > this.getDataRegionCornerCol();
};
oFF.RsSacTableContextResolver.prototype.isOnHeaderRow = function(row)
{
	return row <= this.getDataRegionHeaderEndRow();
};
oFF.RsSacTableContextResolver.prototype.isOnDataRow = function(row)
{
	return row > this.getDataRegionCornerRow();
};
oFF.RsSacTableContextResolver.prototype.getColumnTuple = function(column)
{
	var correctedColumn = column - this.getDataRegionCornerCol() - 1;
	if (correctedColumn > -1 && correctedColumn < this.m_columnTuples.size())
	{
		return this.m_columnTuples.get(correctedColumn);
	}
	return null;
};
oFF.RsSacTableContextResolver.prototype.getColumnTuples = function(columnMin, columnMax)
{
	var result = oFF.XList.create();
	var correctedColumnMin = columnMin - this.getDataRegionCornerCol() - 1;
	var correctedColumnMax = columnMax - this.getDataRegionCornerCol() - 1;
	if (correctedColumnMin > -1 && correctedColumnMax < this.m_columnTuples.size())
	{
		for (var i = correctedColumnMin; i <= correctedColumnMax; i++)
		{
			result.add(this.m_columnTuples.get(i));
		}
	}
	return result;
};
oFF.RsSacTableContextResolver.prototype.getRowTuple = function(row)
{
	var correctedRow = row - this.getDataRegionCornerRow() - 1;
	if (correctedRow > -1 && correctedRow < this.m_rowTuples.size())
	{
		return this.m_rowTuples.get(correctedRow);
	}
	return null;
};
oFF.RsSacTableContextResolver.prototype.getRowTuples = function(rowMin, rowMax)
{
	var result = oFF.XList.create();
	var correctedRowMin = rowMin - this.getDataRegionCornerRow() - 1;
	var correctedRowMax = rowMax - this.getDataRegionCornerRow() - 1;
	if (correctedRowMin > -1 && correctedRowMax < this.m_rowTuples.size())
	{
		for (var i = correctedRowMin; i <= correctedRowMax; i++)
		{
			result.add(this.m_rowTuples.get(i));
		}
	}
	return result;
};
oFF.RsSacTableContextResolver.prototype.getColumnTupleElement = function(column, row)
{
	var correctedColumn = column - this.getDataRegionCornerCol() - 1;
	if (correctedColumn > -1 && correctedColumn < this.m_columnTuples.size() && this.isOnHeaderRow(row))
	{
		var cell = this.getCell(this.getDataRegionCornerCol(), row);
		if (oFF.notNull(cell))
		{
			var dimIndex = cell.getIntegerByKey(oFF.SacTableConstants.RCS_N_INDEX);
			var columnTuple = this.m_columnTuples.get(correctedColumn);
			if (oFF.notNull(columnTuple))
			{
				return columnTuple.getTupleElementAt(dimIndex);
			}
		}
	}
	return null;
};
oFF.RsSacTableContextResolver.prototype.getColumnTupleElements = function(columnMin, columnMax, row)
{
	var result = oFF.XList.create();
	var correctedColumnMin = columnMin - this.getDataRegionCornerCol() - 1;
	var correctedColumnMax = columnMax - this.getDataRegionCornerCol() - 1;
	if (correctedColumnMin > -1 && correctedColumnMax < this.m_columnTuples.size() && this.isOnHeaderRow(row))
	{
		var cell = this.getCell(this.getDataRegionCornerCol(), row);
		if (oFF.notNull(cell))
		{
			var dimIndex = cell.getIntegerByKey(oFF.SacTableConstants.RCS_N_INDEX);
			for (var i = correctedColumnMin; i <= correctedColumnMax; i++)
			{
				var columnTuple = this.m_columnTuples.get(i);
				if (oFF.notNull(columnTuple))
				{
					var tupleElement = columnTuple.getTupleElementAt(dimIndex);
					if (!result.contains(tupleElement))
					{
						result.add(tupleElement);
					}
				}
			}
		}
	}
	return result;
};
oFF.RsSacTableContextResolver.prototype.getRowTupleElement = function(column, row)
{
	var correctedRow = row - this.getDataRegionCornerRow() - 1;
	if (correctedRow > -1 && correctedRow < this.m_rowTuples.size() && this.isOnHeaderColumn(column))
	{
		var cell = this.getCell(column, this.getDataRegionCornerRow());
		if (oFF.notNull(cell))
		{
			var dimIndex = cell.getIntegerByKey(oFF.SacTableConstants.RCS_N_INDEX);
			var rowTuple = this.m_rowTuples.get(correctedRow);
			if (oFF.notNull(rowTuple))
			{
				return rowTuple.getTupleElementAt(dimIndex);
			}
		}
	}
	return null;
};
oFF.RsSacTableContextResolver.prototype.getRowTupleElements = function(column, rowMin, rowMax)
{
	var result = oFF.XList.create();
	var correctedRowMin = rowMin - this.getDataRegionCornerRow() - 1;
	var correctedRowMax = rowMax - this.getDataRegionCornerRow() - 1;
	if (correctedRowMin > -1 && correctedRowMax < this.m_rowTuples.size() && this.isOnHeaderColumn(column))
	{
		var cell = this.getCell(column, this.getDataRegionCornerRow());
		if (oFF.notNull(cell))
		{
			var dimIndex = cell.getIntegerByKey(oFF.SacTableConstants.RCS_N_INDEX);
			for (var i = correctedRowMin; i <= correctedRowMax; i++)
			{
				var rowTuple = this.m_rowTuples.get(i);
				if (oFF.notNull(rowTuple))
				{
					var tupleElement = rowTuple.getTupleElementAt(dimIndex);
					if (!result.contains(tupleElement))
					{
						result.add(rowTuple.getTupleElementAt(dimIndex));
					}
				}
			}
		}
	}
	return result;
};
oFF.RsSacTableContextResolver.prototype.getColumnTupleFieldName = function(row)
{
	if (this.isOnHeaderRow(row))
	{
		var cell = this.getCell(this.getDataRegionCornerCol(), row);
		if (oFF.notNull(cell))
		{
			return cell.getStringByKey(oFF.SacTableConstants.C_SN_FIELD);
		}
	}
	return null;
};
oFF.RsSacTableContextResolver.prototype.getColumnTupleFieldNames = function(rowMin, rowMax, enforceSameDimension)
{
	var cornerCol = this.getDataRegionCornerCol();
	var cellMin = this.getCell(cornerCol, rowMin);
	var cellMax = this.getCell(cornerCol, rowMax);
	if (!enforceSameDimension || oFF.notNull(cellMin) && oFF.notNull(cellMax) && cellMin.getIntegerByKey(oFF.SacTableConstants.RCS_N_INDEX) === cellMax.getIntegerByKey(oFF.SacTableConstants.RCS_N_INDEX))
	{
		var result = oFF.XListOfString.create();
		for (var i = rowMin; i <= rowMax; i++)
		{
			var cell = this.getCell(cornerCol, i);
			if (oFF.notNull(cell))
			{
				result.add(cell.getStringByKey(oFF.SacTableConstants.C_SN_FIELD));
			}
		}
		return result;
	}
	return null;
};
oFF.RsSacTableContextResolver.prototype.getRowTupleFieldName = function(column)
{
	if (this.isOnHeaderColumn(column))
	{
		var cell = this.getCell(column, this.getDataRegionCornerRow());
		if (oFF.notNull(cell))
		{
			return cell.getStringByKey(oFF.SacTableConstants.C_SN_FIELD);
		}
	}
	return null;
};
oFF.RsSacTableContextResolver.prototype.getRowTupleFieldNames = function(columnMin, columnMax, enforceSameDimension)
{
	var cornerRow = this.getDataRegionCornerRow();
	var cellMin = this.getCell(columnMin, cornerRow);
	var cellMax = this.getCell(columnMax, cornerRow);
	if (!enforceSameDimension || oFF.notNull(cellMin) && oFF.notNull(cellMax) && cellMin.getIntegerByKey(oFF.SacTableConstants.RCS_N_INDEX) === cellMax.getIntegerByKey(oFF.SacTableConstants.RCS_N_INDEX))
	{
		var result = oFF.XListOfString.create();
		for (var i = columnMin; i <= columnMax; i++)
		{
			var cell = this.getCell(i, cornerRow);
			if (oFF.notNull(cell))
			{
				result.add(cell.getStringByKey(oFF.SacTableConstants.C_SN_FIELD));
			}
		}
		return result;
	}
	return null;
};
oFF.RsSacTableContextResolver.prototype.getColumnDimensionStrict = function(column, row)
{
	if (column === this.getDataRegionCornerCol())
	{
		return this.getColumnDimension(row);
	}
	return null;
};
oFF.RsSacTableContextResolver.prototype.getColumnDimension = function(row)
{
	if (this.isOnHeaderRow(row))
	{
		var cell = this.getCell(this.getDataRegionCornerCol(), row);
		if (oFF.notNull(cell))
		{
			var dimIndex = cell.getIntegerByKey(oFF.SacTableConstants.RCS_N_INDEX);
			return this.m_columnDimensions.get(dimIndex);
		}
	}
	return null;
};
oFF.RsSacTableContextResolver.prototype.getColumnDimensions = function(rowMin, rowMax)
{
	var result = oFF.XList.create();
	if (this.isOnHeaderRow(rowMax))
	{
		var cornerCol = this.getDataRegionCornerCol();
		for (var i = rowMin; i <= rowMax; i++)
		{
			var cell = this.getCell(cornerCol, i);
			if (oFF.notNull(cell))
			{
				var dimIndex = cell.getIntegerByKey(oFF.SacTableConstants.RCS_N_INDEX);
				var curDim = this.m_columnDimensions.get(dimIndex);
				if (!result.contains(curDim))
				{
					result.add(curDim);
				}
			}
		}
	}
	return result;
};
oFF.RsSacTableContextResolver.prototype.getRowDimensionStrict = function(column, row)
{
	if (row === this.getDataRegionCornerRow())
	{
		return this.getRowDimension(column);
	}
	return null;
};
oFF.RsSacTableContextResolver.prototype.getRowDimension = function(column)
{
	if (this.isOnHeaderColumn(column))
	{
		var cell = this.getCell(column, this.getDataRegionCornerRow());
		if (oFF.notNull(cell))
		{
			var dimIndex = cell.getIntegerByKey(oFF.SacTableConstants.RCS_N_INDEX);
			return this.m_rowDimensions.get(dimIndex);
		}
	}
	return null;
};
oFF.RsSacTableContextResolver.prototype.getRowDimensions = function(columnMin, columnMax)
{
	var result = oFF.XList.create();
	if (this.isOnHeaderColumn(columnMax))
	{
		var cornerRow = this.getDataRegionCornerRow();
		for (var i = columnMin; i <= columnMax; i++)
		{
			var cell = this.getCell(i, cornerRow);
			if (oFF.notNull(cell))
			{
				var dimIndex = cell.getIntegerByKey(oFF.SacTableConstants.RCS_N_INDEX);
				var curDim = this.m_rowDimensions.get(dimIndex);
				if (!result.contains(curDim))
				{
					result.add(curDim);
				}
			}
		}
	}
	return result;
};
oFF.RsSacTableContextResolver.prototype.hasRowDimensions = function()
{
	return this.m_rowDimensions.hasElements();
};
oFF.RsSacTableContextResolver.prototype.releaseObject = function()
{
	this.m_modelJson = null;
	this.m_rowList = null;
	this.m_columnTuples = null;
	this.m_rowTuples = null;
	this.m_rowList = null;
	this.m_columnDimensions = null;
	this.m_rowDimensions = null;
	oFF.XObject.prototype.releaseObject.call( this );
};

oFF.RsSacTableRenderer = function() {};
oFF.RsSacTableRenderer.prototype = new oFF.XObject();
oFF.RsSacTableRenderer.prototype._ff_c = "RsSacTableRenderer";

oFF.RsSacTableRenderer.create = function()
{
	return new oFF.RsSacTableRenderer();
};
oFF.RsSacTableRenderer.prototype.m_rowList = null;
oFF.RsSacTableRenderer.prototype.m_headerRowList = null;
oFF.RsSacTableRenderer.prototype.m_preColumnsAmount = 0;
oFF.RsSacTableRenderer.prototype.m_lastRowToFetch = 0;
oFF.RsSacTableRenderer.prototype.m_headerRowAmount = 0;
oFF.RsSacTableRenderer.prototype.m_columnTuplesCount = 0;
oFF.RsSacTableRenderer.prototype.m_columnsTotalCount = 0;
oFF.RsSacTableRenderer.prototype.m_rowsTotalCount = 0;
oFF.RsSacTableRenderer.prototype.m_tableJson = null;
oFF.RsSacTableRenderer.prototype.m_emptyRowDimensions = false;
oFF.RsSacTableRenderer.prototype.m_columnHeaderAggregation = null;
oFF.RsSacTableRenderer.prototype.m_rowHeaderAggregation = null;
oFF.RsSacTableRenderer.prototype.m_rowKeys = null;
oFF.RsSacTableRenderer.prototype.m_columnKeys = null;
oFF.RsSacTableRenderer.prototype.m_caps = null;
oFF.RsSacTableRenderer.prototype.m_columnValueAggregations = null;
oFF.RsSacTableRenderer.prototype.m_rowValueAggregations = null;
oFF.RsSacTableRenderer.prototype.m_columnWidths = null;
oFF.RsSacTableRenderer.prototype.m_totalRowIndexes = null;
oFF.RsSacTableRenderer.prototype.m_totalColumnIndexes = null;
oFF.RsSacTableRenderer.prototype.m_gridConfig = null;
oFF.RsSacTableRenderer.prototype.m_sortDirections = null;
oFF.RsSacTableRenderer.prototype.m_queryModel = null;
oFF.RsSacTableRenderer.prototype.m_hasDataForRows = false;
oFF.RsSacTableRenderer.prototype.m_hasDataForColumns = false;
oFF.RsSacTableRenderer.prototype.m_hasData = false;
oFF.RsSacTableRenderer.prototype.setGridConfigration = function(gridConfig)
{
	this.m_gridConfig = oFF.XObjectExt.release(this.m_gridConfig);
	this.m_gridConfig = gridConfig;
};
oFF.RsSacTableRenderer.prototype.getBooleanConfigProperty = function(property)
{
	return oFF.notNull(this.m_gridConfig) ? this.m_gridConfig.getBooleanByKeyExt(property, false) : false;
};
oFF.RsSacTableRenderer.prototype.getStringConfigProperty = function(property)
{
	return oFF.notNull(this.m_gridConfig) ? this.m_gridConfig.getStringByKeyExt(property, null) : null;
};
oFF.RsSacTableRenderer.prototype.getStringConfigPropertyExt = function(property, defaultValue)
{
	return oFF.notNull(this.m_gridConfig) ? this.m_gridConfig.getStringByKeyExt(property, defaultValue) : defaultValue;
};
oFF.RsSacTableRenderer.prototype.getIntegerConfigProperty = function(property, defaultValue)
{
	return oFF.notNull(this.m_gridConfig) ? this.m_gridConfig.getIntegerByKeyExt(property, defaultValue) : defaultValue;
};
oFF.RsSacTableRenderer.prototype.getIndexOfFirstUndefinedRowAfter = function(rowIndex)
{
	var result = rowIndex;
	var rowsSize = this.m_rowList.size();
	while (result < rowsSize && this.m_rowList.get(result) !== null)
	{
		result++;
	}
	return result;
};
oFF.RsSacTableRenderer.prototype.getIndexOfLastUndefinedRowBefore = function(rowIndex)
{
	var result = rowIndex;
	var rowsSize = this.m_rowList.size();
	while (result < rowsSize && result > -1 && this.m_rowList.get(result) !== null)
	{
		result--;
	}
	return result;
};
oFF.RsSacTableRenderer.prototype.render = function(rs)
{
	this.preRender(rs);
	this.preRenderAxis(rs.getCursorRowsAxis(), this.m_rowHeaderAggregation, this.m_rowValueAggregations, 0);
	this.renderOffsetInternal(rs, 0, false);
	return this.getFlatTableJsonCopy();
};
oFF.RsSacTableRenderer.prototype.reRenderAllLoadedData = function()
{
	if (oFF.notNull(this.m_tableJson))
	{
		this.m_tableJson.remove(oFF.SacTableConstants.TD_N_TOTAL_ROWS_DIFF);
		this.m_tableJson.putBoolean(oFF.SacTableConstants.TD_B_PARTIAL, true);
		this.m_tableJson.putBoolean(oFF.SacTableConstants.TD_B_SCROLL_TO_TOP, false);
		var prRowList = this.m_tableJson.putNewList(oFF.SacTableConstants.TD_L_ROWS);
		oFF.XStream.of(this.m_headerRowList).forEach( function(hre){
			prRowList.add(hre);
		}.bind(this));
		oFF.XStream.of(this.m_rowList).filter( function(el){
			return oFF.notNull(el);
		}.bind(this)).forEach( function(gre){
			prRowList.add(gre);
		}.bind(this));
	}
	return this.getFlatTableJsonCopy();
};
oFF.RsSacTableRenderer.prototype.fillWithRowsUpToFirstGap = function(prRowList)
{
	for (var i = 0; i < this.m_rowList.size(); i++)
	{
		var row = this.m_rowList.get(i);
		if (oFF.isNull(row))
		{
			break;
		}
		prRowList.add(row);
	}
};
oFF.RsSacTableRenderer.prototype.preRender = function(rs)
{
	this.releaseStaleData();
	var columnDimensionCount = rs.getCursorColumnsAxis().getRsDimensions().size();
	var rowDimensionCount = rs.getCursorRowsAxis().getRsDimensions().size();
	var rowTuplesCountLocal = rs.getCursorRowsAxis().getTuplesCount();
	this.m_columnTuplesCount = rs.getCursorColumnsAxis().getTuplesCount();
	this.m_hasDataForRows = rowTuplesCountLocal > 0 && (this.m_columnTuplesCount > 0 || rowDimensionCount > 0);
	this.m_hasDataForColumns = this.m_columnTuplesCount > 0 && (rowTuplesCountLocal > 0 || columnDimensionCount > 0);
	this.m_hasData = this.m_columnTuplesCount > 0 && columnDimensionCount > 0 || rowTuplesCountLocal > 0 && rowDimensionCount > 0;
	this.m_tableJson = oFF.PrFactory.createStructure();
	this.m_tableJson.putNewStructure(oFF.SacTableConstants.TD_M_FEATURE_TOGGLES);
	var style = this.m_tableJson.putNewStructure(oFF.SacTableConstants.TD_M_STYLE);
	var font = style.putNewStructure(oFF.SacTableConstants.ST_M_FONT);
	font.putInteger(oFF.SacTableConstants.FS_N_SIZE, 42);
	this.m_rowsTotalCount = -1;
	this.m_columnsTotalCount = -1;
	this.m_columnWidths = oFF.XList.create();
	this.m_totalColumnIndexes = oFF.XSimpleMap.create();
	this.m_totalRowIndexes = oFF.XSimpleMap.create();
	this.m_sortDirections = oFF.XHashMapByString.create();
	this.m_rowList = oFF.XList.create();
	this.m_headerRowList = oFF.XList.create();
	this.m_columnValueAggregations = oFF.XList.create();
	this.m_rowValueAggregations = oFF.XList.create();
	this.m_queryModel = rs.getQueryModel();
	this.m_caps = this.m_queryModel.getModelCapabilities();
	this.m_lastRowToFetch = oFF.XMath.max(1, rowTuplesCountLocal);
	this.renderDetails();
	this.m_rowHeaderAggregation = oFF.SacTableAggregation.getDimHeader(rs.getCursorRowsAxis(), this.m_queryModel);
	this.m_columnHeaderAggregation = oFF.SacTableAggregation.getDimHeader(rs.getCursorColumnsAxis(), this.m_queryModel);
	this.m_columnKeys = this.m_columnHeaderAggregation.getKeysAsReadOnlyListOfString();
	this.m_rowKeys = this.m_rowHeaderAggregation.getKeysAsReadOnlyListOfString();
	this.preRenderAxis(rs.getCursorColumnsAxis(), this.m_columnHeaderAggregation, this.m_columnValueAggregations, 0);
	this.renderHeaderRows();
	return this.m_hasData;
};
oFF.RsSacTableRenderer.prototype.reFormatHeaders = function()
{
	if (oFF.notNull(this.m_tableJson))
	{
		oFF.XCollectionUtils.releaseEntriesFromCollection(this.m_headerRowList);
		this.m_tableJson.remove(oFF.SacTableConstants.TD_N_TOTAL_ROWS_DIFF);
		this.m_headerRowList.clear();
		this.renderHeaderRows();
		this.reformatRowHeaders();
		this.reRenderTitleAndGenericSettingsInternal();
		this.reRenderTotalFormattingInternal();
		var prRowList = this.m_tableJson.putNewList(oFF.SacTableConstants.TD_L_ROWS);
		this.m_tableJson.putBoolean(oFF.SacTableConstants.TD_B_PARTIAL, true);
		this.m_tableJson.putBoolean(oFF.SacTableConstants.TD_B_SCROLL_TO_TOP, false);
		oFF.XStream.of(this.m_headerRowList).forEach( function(hre){
			prRowList.add(hre);
		}.bind(this));
		oFF.XStream.of(this.m_rowList).filter( function(el){
			return oFF.notNull(el);
		}.bind(this)).forEach( function(gre){
			prRowList.add(gre);
		}.bind(this));
	}
	return this.getFlatTableJsonCopy();
};
oFF.RsSacTableRenderer.prototype.renderOffset = function(rs, offset, partial)
{
	this.preRenderAxis(rs.getCursorRowsAxis(), this.m_rowHeaderAggregation, this.m_rowValueAggregations, offset);
	this.renderOffsetInternal(rs, offset, partial);
	return this.getFlatTableJsonCopy();
};
oFF.RsSacTableRenderer.prototype.renderOffsetInternal = function(rs, offset, partial)
{
	this.m_lastRowToFetch = oFF.XMath.max(1, offset + rs.getCursorRowsAxis().getTuplesCount());
	if (this.m_rowsTotalCount === -1 || this.m_rowsTotalCount > offset)
	{
		this.renderRows(rs, offset, partial);
		this.reRenderTitleAndGenericSettingsInternal();
		this.reRenderTotalFormattingInternal();
	}
	else
	{
		oFF.XLogger.println("Strange superfluous rendering beyond table size");
	}
};
oFF.RsSacTableRenderer.prototype.renderDetails = function()
{
	if (oFF.notNull(this.m_tableJson))
	{
		var title = this.m_tableJson.putNewStructure(oFF.SacTableConstants.TD_M_TITLE);
		var titleStyle = title.putNewStructure(oFF.SacTableConstants.TD_M_TITLE_STYLE);
		title.putNewStructure(oFF.SacTableConstants.TD_M_SUBTITLE_STYLE);
		var titleFont = titleStyle.putNewStructure(oFF.SacTableConstants.ST_M_FONT);
		titleFont.putInteger(oFF.SacTableConstants.FS_N_SIZE, 17);
		var titleText = this.getStringConfigPropertyExt(oFF.SacTableConstants.S_TITLE, this.m_queryModel.getText());
		title.putStringNotNullAndNotEmpty(oFF.SacTableConstants.TD_S_TITLE_TEXT, titleText);
		if (oFF.XStringUtils.isNotNullAndNotEmpty(titleText))
		{
			title.putNewList(oFF.SacTableConstants.TD_L_TITLE_CHUNKS).addString(titleText);
		}
		var titleTokens = title.putNewStructure(oFF.SacTableConstants.TD_M_TOKEN_DATA);
		var titelTokenStyles = titleTokens.putNewStructure(oFF.SacTableConstants.TE_O_STYLES);
		titelTokenStyles.putString("line-height", "");
		titelTokenStyles.putString("text-align", "left");
		titelTokenStyles.putString("font-size", "13px");
		titelTokenStyles.putString("align-items", "center");
		titelTokenStyles.putString("margin-top", "3px");
		titleTokens.putNewStructure(oFF.SacTableConstants.TE_O_ATTRIBUTES);
		titleTokens.putNewList(oFF.SacTableConstants.TE_L_CLASSES).addString("sapReportEngineTokenContainer");
		titleTokens.putString(oFF.SacTableConstants.TE_S_TAG, "div");
		var tokenList = titleTokens.putNewList(oFF.SacTableConstants.TE_L_CHILDREN);
		var classesIcon = oFF.XListOfString.create();
		classesIcon.add("sapUiIcon");
		classesIcon.add("sapUiIconMirrorInRTL");
		classesIcon.add("sapUiIconColorDefault");
		var classesSep = oFF.XListOfString.create();
		classesSep.add("sapReportEngineTokenSeparator");
		var classes = oFF.XListOfString.create();
		classes.add("sapReportEngineFilterTokenText");
		classes.add("sapReportEngineTokenLinkText");
		var icon;
		var i;
		var sortingOperations = this.m_queryModel.getSortingManager().getSortingOperations();
		for (i = 0; i < sortingOperations.size(); i++)
		{
			var sortOp = sortingOperations.get(i);
			var direction = sortOp.getDirection();
			if (direction === oFF.XSortDirection.ASCENDING)
			{
				icon = " \uE1FD ";
			}
			else if (direction === oFF.XSortDirection.DESCENDING)
			{
				icon = " \uE1FC ";
			}
			else
			{
				continue;
			}
			if (sortOp.getSortingType().isTypeOf(oFF.SortType.MEMBER_KEY))
			{
				if (this.m_queryModel.getRowsAxis().contains(sortOp.getDimension()) || this.m_queryModel.getColumnsAxis().contains(sortOp.getDimension()))
				{
					oFF.XStream.of(sortOp.getDimension().getMainAttribute().getFields()).filter( function(fi){
						return fi.getPresentationType().isTypeOf(oFF.PresentationType.ABSTRACT_KEY);
					}.bind(this)).forEach( function(fil){
						this.m_sortDirections.put(fil.getName(), direction);
					}.bind(this));
					this.addTableDetail("div", tokenList, classesSep, null);
					this.addTableIcon(tokenList, classes, classesIcon, icon, sortOp.getDimension().getText(), oFF.XStringUtils.concatenate3("Sort on ", sortOp.getDimension().getText(), ".Key"));
				}
			}
			else if (sortOp.getSortingType().isTypeOf(oFF.SortType.MEMBER_TEXT))
			{
				if (this.m_queryModel.getRowsAxis().contains(sortOp.getDimension()) || this.m_queryModel.getColumnsAxis().contains(sortOp.getDimension()))
				{
					oFF.XStream.of(sortOp.getDimension().getMainAttribute().getFields()).filter( function(fi2){
						return fi2.getPresentationType().isTypeOf(oFF.PresentationType.ABSTRACT_TEXT);
					}.bind(this)).forEach( function(fil2){
						this.m_sortDirections.put(fil2.getName(), direction);
					}.bind(this));
					this.addTableDetail("div", tokenList, classesSep, null);
					this.addTableIcon(tokenList, classes, classesIcon, icon, sortOp.getDimension().getText(), oFF.XStringUtils.concatenate3("Sort on ", sortOp.getDimension().getText(), ".Text"));
				}
			}
			else if (sortOp.getSortingType().isTypeOf(oFF.SortType.FIELD))
			{
				var field = sortOp.getField();
				if (this.m_queryModel.getRowsAxis().contains(field.getDimension()) || this.m_queryModel.getColumnsAxis().contains(field.getDimension()))
				{
					this.m_sortDirections.put(field.getName(), direction);
					this.addTableDetail("div", tokenList, classesSep, null);
					this.addTableIcon(tokenList, classes, classesIcon, icon, field.getDimension().getText(), oFF.XStringUtils.concatenate2("Sort on ", field.getText()));
				}
			}
			else if (sortOp.getSortingType().isTypeOf(oFF.SortType.DATA_CELL_VALUE))
			{
				var pathUniqueName = oFF.SacTableAggregation.getSimplifiedUniqueName(sortOp.getElementPath());
				this.m_sortDirections.put(pathUniqueName, direction);
				this.addTableDetail("div", tokenList, classesSep, null);
				this.addTableIcon(tokenList, classes, classesIcon, icon, "Cell", oFF.XStringUtils.concatenate2("Sort on ", pathUniqueName));
			}
			else if (sortOp.getSortingType().isTypeOf(oFF.SortType.MEASURE))
			{
				var measure = sortOp.getMeasure();
				this.m_sortDirections.put(measure.getName(), direction);
				this.addTableDetail("div", tokenList, classesSep, null);
				this.addTableIcon(tokenList, classes, classesIcon, icon, measure.getText(), oFF.XStringUtils.concatenate2("Sort on Key figure ", measure.getText()));
			}
		}
		icon = " \uE076 ";
		if (this.m_queryModel.getFilter().getDynamicFilter().isCartesianProduct())
		{
			var cartesianProduct = this.m_queryModel.getFilter().getDynamicFilter().getCartesianProduct();
			for (i = 0; i < cartesianProduct.size(); i++)
			{
				this.addTableDetail("div", tokenList, classesSep, null);
				var cartesianChild = cartesianProduct.getCartesianChild(i);
				var filterDetail = oFF.XCollectionUtils.join(oFF.XStream.of(cartesianChild).collect(oFF.XStreamCollector.toListOfString( function(fo){
					var fiOp = fo;
					var low = fiOp.getLow();
					var high = fiOp.getHigh();
					if (oFF.notNull(high))
					{
						return oFF.XStringUtils.concatenate5(fiOp.getComparisonOperator().getName(), " ", low.getString(), ":", high.getString());
					}
					if (oFF.notNull(low))
					{
						return oFF.XStringUtils.concatenate3(fiOp.getComparisonOperator().getName(), " ", low.getString());
					}
					return "";
				}.bind(this))), ", ");
				this.addTableIcon(tokenList, classes, classesIcon, icon, cartesianChild.getDimension().getText(), filterDetail);
			}
		}
	}
};
oFF.RsSacTableRenderer.prototype.reRenderTotalFormatting = function()
{
	this.reRenderTotalFormattingInternal();
	return this.reRenderAllLoadedData();
};
oFF.RsSacTableRenderer.prototype.reRenderTotalFormattingInternal = function()
{
	if (oFF.notNull(this.m_tableJson) && oFF.notNull(this.m_totalRowIndexes))
	{
		var iterator = this.m_totalRowIndexes.getKeysAsIterator();
		var style;
		var formatKey;
		var level;
		var subIterator;
		var cells;
		var rowStructure;
		var formatString;
		while (iterator.hasNext())
		{
			level = iterator.next();
			switch (level.getInteger())
			{
				case 0:
					formatKey = oFF.SacTableConstants.S_TOTAL_LEVEL_0_COLOR;
					break;

				case 1:
					formatKey = oFF.SacTableConstants.S_TOTAL_LEVEL_1_COLOR;
					break;

				case 2:
					formatKey = oFF.SacTableConstants.S_TOTAL_LEVEL_2_COLOR;
					break;

				case 3:
					formatKey = oFF.SacTableConstants.S_TOTAL_LEVEL_3_COLOR;
					break;

				case 4:
					formatKey = oFF.SacTableConstants.S_TOTAL_LEVEL_4_COLOR;
					break;

				case 5:
					formatKey = oFF.SacTableConstants.S_TOTAL_LEVEL_5_COLOR;
					break;

				case 6:
					formatKey = oFF.SacTableConstants.S_TOTAL_LEVEL_6_COLOR;
					break;

				default:
					formatKey = null;
			}
			formatString = this.getStringConfigProperty(formatKey);
			if (oFF.notNull(formatKey))
			{
				subIterator = this.m_totalRowIndexes.getByKey(level).getIterator();
				while (subIterator.hasNext())
				{
					var rowIndex = subIterator.next().getInteger();
					rowStructure = this.m_rowList.get(rowIndex);
					if (oFF.notNull(rowStructure))
					{
						cells = rowStructure.getListByKey(oFF.SacTableConstants.R_L_CELLS);
						var cellsSize = cells.size();
						for (var col = this.m_preColumnsAmount; col < cellsSize; col++)
						{
							style = cells.getStructureAt(col).getStructureByKey(oFF.SacTableConstants.C_M_STYLE);
							style.putString(oFF.SacTableConstants.ST_S_FILL_COLOR, formatString);
							style.putNewStructure(oFF.SacTableConstants.ST_M_FONT).putBoolean(oFF.SacTableConstants.FS_B_BOLD, true);
						}
					}
				}
			}
		}
		iterator = this.m_totalColumnIndexes.getKeysAsIterator();
		while (iterator.hasNext())
		{
			level = iterator.next();
			switch (level.getInteger())
			{
				case 0:
					formatKey = oFF.SacTableConstants.S_TOTAL_LEVEL_0_COLOR;
					break;

				case 1:
					formatKey = oFF.SacTableConstants.S_TOTAL_LEVEL_1_COLOR;
					break;

				case 2:
					formatKey = oFF.SacTableConstants.S_TOTAL_LEVEL_2_COLOR;
					break;

				case 3:
					formatKey = oFF.SacTableConstants.S_TOTAL_LEVEL_3_COLOR;
					break;

				case 4:
					formatKey = oFF.SacTableConstants.S_TOTAL_LEVEL_4_COLOR;
					break;

				case 5:
					formatKey = oFF.SacTableConstants.S_TOTAL_LEVEL_5_COLOR;
					break;

				case 6:
					formatKey = oFF.SacTableConstants.S_TOTAL_LEVEL_6_COLOR;
					break;

				default:
					formatKey = null;
			}
			formatString = this.getStringConfigProperty(formatKey);
			if (oFF.notNull(formatKey))
			{
				var rowSize = this.m_rowList.size();
				var subList = this.m_totalColumnIndexes.getByKey(level);
				for (var row = 0; row < rowSize; row++)
				{
					rowStructure = this.m_rowList.get(row);
					if (oFF.notNull(rowStructure))
					{
						cells = rowStructure.getListByKey(oFF.SacTableConstants.R_L_CELLS);
						for (var i = 0; i < subList.size(); i++)
						{
							var columnIndex = subList.get(i).getInteger();
							style = cells.getStructureAt(columnIndex).getStructureByKey(oFF.SacTableConstants.C_M_STYLE);
							style.putString(oFF.SacTableConstants.ST_S_FILL_COLOR, formatString);
							style.putNewStructure(oFF.SacTableConstants.ST_M_FONT).putBoolean(oFF.SacTableConstants.FS_B_BOLD, true);
						}
					}
				}
			}
		}
	}
};
oFF.RsSacTableRenderer.prototype.reRenderTitleAndGenericSettings = function(fullReload)
{
	if (oFF.notNull(this.m_tableJson))
	{
		this.m_tableJson.remove(oFF.SacTableConstants.TD_N_TOTAL_ROWS_DIFF);
		this.m_tableJson.putBoolean(oFF.SacTableConstants.TD_B_PARTIAL, true);
		this.m_tableJson.putBoolean(oFF.SacTableConstants.TD_B_SCROLL_TO_TOP, false);
		var prRowList = this.m_tableJson.putNewList(oFF.SacTableConstants.TD_L_ROWS);
		if (fullReload)
		{
			oFF.XStream.of(this.m_headerRowList).forEach( function(hre){
				prRowList.add(hre);
			}.bind(this));
			oFF.XStream.of(this.m_rowList).filter( function(el){
				return oFF.notNull(el);
			}.bind(this)).forEach( function(gre){
				prRowList.add(gre);
			}.bind(this));
		}
		this.reRenderTitleAndGenericSettingsInternal();
	}
	return this.getFlatTableJsonCopy();
};
oFF.RsSacTableRenderer.prototype.getFlatTableJsonCopy = function()
{
	var newTableJson = oFF.PrFactory.createStructure();
	if (oFF.notNull(this.m_tableJson))
	{
		var keyIterator = this.m_tableJson.getKeysAsIteratorOfString();
		while (keyIterator.hasNext())
		{
			var key = keyIterator.next();
			newTableJson.put(key, this.m_tableJson.getByKey(key));
		}
	}
	return newTableJson;
};
oFF.RsSacTableRenderer.prototype.reRenderTitleAndGenericSettingsInternal = function()
{
	var title = this.m_tableJson.getStructureByKey(oFF.SacTableConstants.TD_M_TITLE);
	if (oFF.notNull(title))
	{
		var titleStyle = title.getStructureByKey(oFF.SacTableConstants.TD_M_TITLE_STYLE);
		var titleVisible = this.getBooleanConfigProperty(oFF.SacTableConstants.B_SHOW_TABLE_TITLE);
		var subtitleVisible = this.getBooleanConfigProperty(oFF.SacTableConstants.B_SHOW_SUBTITLE);
		var detailsVisible = this.getBooleanConfigProperty(oFF.SacTableConstants.B_SHOW_TABLE_DETAILS);
		title.putBoolean(oFF.SacTableConstants.TD_B_TITLE_VISIBLE, titleVisible);
		title.putBoolean(oFF.SacTableConstants.TD_B_SUBTITLE_VISIBLE, subtitleVisible);
		title.putBoolean(oFF.SacTableConstants.TD_B_DETAILS_VISIBLE, detailsVisible);
		title.putBoolean(oFF.SacTableConstants.TD_B_EDITABLE, false);
		var titleAreaHeight = 40;
		if (titleVisible && (detailsVisible || subtitleVisible))
		{
			titleAreaHeight = 52;
		}
		else if (!titleVisible && !detailsVisible && !subtitleVisible)
		{
			titleAreaHeight = 0;
		}
		titleStyle.putInteger(oFF.SacTableConstants.TS_N_HEIGHT, titleAreaHeight);
	}
	var i;
	this.m_tableJson.putInteger(oFF.SacTableConstants.TD_N_WIDGET_HEIGHT, this.getIntegerConfigProperty(oFF.SacTableConstants.I_HEIGHT, 451));
	this.m_tableJson.putInteger(oFF.SacTableConstants.TD_N_WIDGET_WIDTH, this.getIntegerConfigProperty(oFF.SacTableConstants.I_WIDTH, 1257));
	var showGrid = this.getBooleanConfigProperty(oFF.SacTableConstants.B_SHOW_GRID);
	var freezing = false;
	if (this.getBooleanConfigProperty(oFF.SacTableConstants.B_FREEZE_COLUMNS))
	{
		this.m_tableJson.putInteger(oFF.SacTableConstants.TD_N_FREEZE_END_COL, this.m_preColumnsAmount - 1);
		freezing = true;
	}
	else
	{
		this.m_tableJson.putInteger(oFF.SacTableConstants.TD_N_FREEZE_END_COL, -1);
	}
	var frozenRows = this.getBooleanConfigProperty(oFF.SacTableConstants.B_FREEZE_ROWS);
	if (frozenRows)
	{
		this.m_tableJson.putInteger(oFF.SacTableConstants.TD_N_FREEZE_END_ROW, this.m_headerRowAmount - 1);
		freezing = true;
	}
	else
	{
		this.m_tableJson.putInteger(oFF.SacTableConstants.TD_N_FREEZE_END_ROW, -1);
	}
	this.m_tableJson.putBoolean(oFF.SacTableConstants.TD_B_SHOW_FREEZE_LINES, freezing && this.getBooleanConfigProperty(oFF.SacTableConstants.B_SHOW_FREEZE_LINES));
	this.m_tableJson.putBoolean(oFF.SacTableConstants.TD_B_HAS_FIXED_ROWS_COLS, freezing);
	this.m_tableJson.putBoolean(oFF.SacTableConstants.TD_B_SHOW_GRID, showGrid);
	this.m_tableJson.putBoolean(oFF.SacTableConstants.TD_B_SHOW_COORDINATE_HEADER, this.getBooleanConfigProperty(oFF.SacTableConstants.B_COORDINATE_HEADER));
	this.m_tableJson.putBoolean(oFF.SacTableConstants.TD_B_SUBTITLE_VISIBLE, this.getBooleanConfigProperty(oFF.SacTableConstants.B_SHOW_SUBTITLE));
	this.m_tableJson.putBoolean(oFF.SacTableConstants.TD_B_TITLE_VISIBLE, this.getBooleanConfigProperty(oFF.SacTableConstants.B_SHOW_TABLE_TITLE));
	this.m_tableJson.putBoolean(oFF.SacTableConstants.TD_B_DETAILS_VISIBLE, this.getBooleanConfigProperty(oFF.SacTableConstants.B_SHOW_TABLE_DETAILS));
	var columnSettings = this.m_tableJson.putNewList(oFF.SacTableConstants.TD_L_COLUMN_SETTINGS);
	var overallSizeUnits = oFF.XStream.of(this.m_columnWidths).reduce(oFF.XIntegerValue.create(1),  function(a, b){
		return oFF.XIntegerValue.create(a.getInteger() + b.getInteger());
	}.bind(this)).getInteger();
	var factor = oFF.XMath.max((this.m_tableJson.getIntegerByKey(oFF.SacTableConstants.TD_N_WIDGET_WIDTH) - 20) / overallSizeUnits, 8);
	if (factor > 14)
	{
		factor = 14;
		this.m_tableJson.putInteger(oFF.SacTableConstants.TD_N_WIDGET_WIDTH, factor * overallSizeUnits + 20);
	}
	var totalWidth = 20;
	var columnStructure;
	var preciseWidth;
	for (i = 0; i < this.m_preColumnsAmount; i++)
	{
		preciseWidth = 80;
		if (i < this.m_columnWidths.size())
		{
			preciseWidth = oFF.XMath.max(this.m_columnWidths.get(i).getInteger() * factor, preciseWidth);
		}
		totalWidth = totalWidth + preciseWidth;
		columnStructure = columnSettings.addNewStructure();
		columnStructure.putInteger(oFF.SacTableConstants.CS_N_COLUMN, i);
		columnStructure.putInteger(oFF.SacTableConstants.CS_N_MIN_WIDTH, 75);
		columnStructure.putInteger(oFF.SacTableConstants.CS_N_WIDTH, preciseWidth);
		columnStructure.putString(oFF.SacTableConstants.CS_S_ID, oFF.XInteger.convertToHexString(i));
		columnStructure.putBoolean(oFF.SacTableConstants.CS_B_FIXED, false);
		columnStructure.putBoolean(oFF.SacTableConstants.CS_B_HAS_WRAP_CELL, false);
		columnStructure.putBoolean(oFF.SacTableConstants.CS_B_EMPTY_COLUMN, false);
		columnStructure.putBoolean(oFF.SacTableConstants.CS_B_FIXED, this.getBooleanConfigProperty(oFF.SacTableConstants.B_FREEZE_COLUMNS));
	}
	if (this.m_hasDataForColumns)
	{
		for (; i < this.m_preColumnsAmount + this.m_columnTuplesCount; i++)
		{
			preciseWidth = 50;
			if (i < this.m_columnWidths.size())
			{
				preciseWidth = oFF.XMath.max(this.m_columnWidths.get(i).getInteger() * factor, preciseWidth);
			}
			totalWidth = totalWidth + preciseWidth;
			columnStructure = columnSettings.addNewStructure();
			columnStructure.putInteger(oFF.SacTableConstants.CS_N_COLUMN, i);
			columnStructure.putInteger(oFF.SacTableConstants.CS_N_MIN_WIDTH, 35);
			columnStructure.putInteger(oFF.SacTableConstants.CS_N_WIDTH, preciseWidth);
			columnStructure.putString(oFF.SacTableConstants.CS_S_ID, oFF.XInteger.convertToHexString(i));
			columnStructure.putBoolean(oFF.SacTableConstants.CS_B_FIXED, false);
			columnStructure.putBoolean(oFF.SacTableConstants.CS_B_HAS_WRAP_CELL, false);
			columnStructure.putBoolean(oFF.SacTableConstants.CS_B_EMPTY_COLUMN, false);
		}
	}
	var totalHeight = 20 + this.m_rowsTotalCount * oFF.SacTableConstants.DF_R_N_HEIGHT;
	if (showGrid)
	{
		totalHeight = totalHeight + this.m_rowsTotalCount;
	}
	for (i = 0; i < this.m_headerRowAmount; i++)
	{
		var currentRowStruct = this.m_headerRowList.get(i);
		currentRowStruct.putBoolean(oFF.SacTableConstants.R_B_FIXED, frozenRows);
		totalHeight = totalHeight + currentRowStruct.getIntegerByKey(oFF.SacTableConstants.R_N_HEIGHT);
		if (showGrid)
		{
			totalHeight = totalHeight + 1;
		}
	}
	this.m_tableJson.putInteger(oFF.SacTableConstants.TD_N_TOTAL_WIDTH, totalWidth);
	this.m_tableJson.putInteger(oFF.SacTableConstants.TD_N_TOTAL_HEIGHT, totalHeight);
};
oFF.RsSacTableRenderer.prototype.addTableIcon = function(tokenList, surroundingClasses, classes, iconString, text, title)
{
	var detailStructure = tokenList.addNewStructure();
	detailStructure.putNewStructure(oFF.SacTableConstants.TE_O_STYLES);
	detailStructure.putNewStructure(oFF.SacTableConstants.TE_O_ATTRIBUTES);
	detailStructure.putNewList(oFF.SacTableConstants.TE_L_CLASSES).addAllStrings(surroundingClasses);
	detailStructure.putString(oFF.SacTableConstants.TE_S_TAG, "a");
	var detailChildren = detailStructure.putNewList(oFF.SacTableConstants.TE_L_CHILDREN);
	detailStructure = detailChildren.addNewStructure();
	var styles = detailStructure.putNewStructure(oFF.SacTableConstants.TE_O_STYLES);
	styles.putString("font-family", "SAP-icons");
	styles.putString("margin-right", "5px");
	detailStructure.putNewStructure(oFF.SacTableConstants.TE_O_ATTRIBUTES);
	detailStructure.putNewList(oFF.SacTableConstants.TE_L_CLASSES).addAllStrings(classes);
	detailStructure.putString(oFF.SacTableConstants.TE_S_TAG, "span");
	var attributes = detailStructure.putNewStructure(oFF.SacTableConstants.TE_O_ATTRIBUTES);
	attributes.putString("data-sap-ui-icon-content", iconString);
	attributes.putString("aria-hidden", "true");
	attributes.putStringNotNullAndNotEmpty("title", title);
	var iconChildren = detailStructure.putNewList(oFF.SacTableConstants.TE_L_CHILDREN);
	iconChildren.addString("");
	detailChildren.addString(text);
};
oFF.RsSacTableRenderer.prototype.addTableDetail = function(tag, tokenList, classes, information)
{
	var detailStructure = tokenList.addNewStructure();
	detailStructure.putNewStructure(oFF.SacTableConstants.TE_O_STYLES);
	detailStructure.putNewStructure(oFF.SacTableConstants.TE_O_ATTRIBUTES);
	detailStructure.putNewList(oFF.SacTableConstants.TE_L_CLASSES).addAllStrings(classes);
	detailStructure.putString(oFF.SacTableConstants.TE_S_TAG, tag);
	var detailChildren = detailStructure.putNewList(oFF.SacTableConstants.TE_L_CHILDREN);
	if (oFF.XStringUtils.isNotNullAndNotEmpty(information))
	{
		detailChildren.addString(information);
	}
};
oFF.RsSacTableRenderer.prototype.renderHeaderRows = function()
{
	if (oFF.notNull(this.m_tableJson))
	{
		var repetitiveMemberNames = this.getBooleanConfigProperty(oFF.SacTableConstants.B_REPETITIVE_MEMBER_NAMES);
		var dimensionMemberType;
		var valueAggregationElement;
		var showDimensionHeaders = this.getBooleanConfigProperty(oFF.SacTableConstants.B_DIMENSION_TITLES);
		this.m_preColumnsAmount = this.m_rowKeys.size();
		this.m_emptyRowDimensions = this.m_preColumnsAmount === 0;
		if (this.m_emptyRowDimensions && showDimensionHeaders)
		{
			this.m_preColumnsAmount = 1;
		}
		var preRowAmount = this.m_columnKeys.size();
		this.m_headerRowAmount = preRowAmount + (this.m_emptyRowDimensions || !showDimensionHeaders ? 0 : 1);
		var i;
		var j;
		var cellsList;
		var rowStructure;
		var frozenRows = this.getBooleanConfigProperty(oFF.SacTableConstants.B_FREEZE_ROWS);
		for (i = 0; i < preRowAmount; i++)
		{
			rowStructure = oFF.PrFactory.createStructure();
			this.m_headerRowList.add(rowStructure);
			rowStructure.putInteger(oFF.SacTableConstants.R_N_ROW, i);
			rowStructure.putInteger(oFF.SacTableConstants.R_N_HEIGHT, oFF.SacTableConstants.DF_R_N_HEIGHT);
			rowStructure.putBoolean(oFF.SacTableConstants.R_B_FIXED, frozenRows);
			cellsList = rowStructure.putNewList(oFF.SacTableConstants.R_L_CELLS);
			for (j = 0; j < this.m_preColumnsAmount - 1; j++)
			{
				this.addNewEmptyHeaderCell(cellsList, i, j, i === preRowAmount - 1 ? "rgb(63,81,97)" : null);
			}
		}
		if (this.m_preColumnsAmount > 0)
		{
			if (showDimensionHeaders)
			{
				for (i = 0; i < preRowAmount; i++)
				{
					cellsList = this.m_headerRowList.get(i).getListByKey(oFF.SacTableConstants.R_L_CELLS);
					this.addHeaderCell(cellsList, i, this.m_preColumnsAmount - 1, this.m_columnHeaderAggregation.getByKey(this.m_columnKeys.get(i)), oFF.SacTableConstants.CT_COL_DIM_HEADER, oFF.SacTableConstants.CT_ATTRIBUTE_COL_DIM_HEADER, oFF.SacTableConstants.C_N_HIERARCHY_PADDING_TOP, oFF.SacTableConstants.DF_C_N_HIERARCHY_PADDING_TOP, repetitiveMemberNames, i === preRowAmount - 1 ? "rgb(63,81,97)" : null);
				}
			}
			else
			{
				for (i = 0; i < preRowAmount; i++)
				{
					cellsList = this.m_headerRowList.get(i).getListByKey(oFF.SacTableConstants.R_L_CELLS);
					this.addNewEmptyHeaderCell(cellsList, i, this.m_preColumnsAmount - 1, i === preRowAmount - 1 ? "rgb(63,81,97)" : null);
				}
			}
		}
		var valueAggregation = null;
		j = this.m_preColumnsAmount;
		for (var h = 0; h < this.m_columnValueAggregations.size(); h++)
		{
			valueAggregation = this.m_columnValueAggregations.get(h);
			for (i = 0; i < preRowAmount; i++)
			{
				valueAggregationElement = valueAggregation.getByKey(this.m_columnKeys.get(i));
				rowStructure = this.m_headerRowList.get(i);
				var newHeight = oFF.SacTableConstants.DF_R_N_HEIGHT / 3 * (3 + valueAggregationElement.getDisplayLevel());
				if (rowStructure.getIntegerByKeyExt(oFF.SacTableConstants.R_N_HEIGHT, 0) < newHeight)
				{
					rowStructure.putInteger(oFF.SacTableConstants.R_N_HEIGHT, newHeight);
				}
				dimensionMemberType = valueAggregationElement.getDimensionMemberType();
				if (dimensionMemberType === oFF.MemberType.RESULT || oFF.OlapComponentType.TOTALS === dimensionMemberType)
				{
					this.addToIntMap(this.m_totalColumnIndexes, i, j);
				}
				cellsList = this.m_headerRowList.get(i).getListByKey(oFF.SacTableConstants.R_L_CELLS);
				this.addHeaderCell(cellsList, i, j, valueAggregationElement, oFF.SacTableConstants.CT_COL_DIM_MEMBER, oFF.SacTableConstants.CT_ATTRIBUTE_COL_DIM_MEMBER, oFF.SacTableConstants.C_N_HIERARCHY_PADDING_TOP, oFF.SacTableConstants.DF_C_N_HIERARCHY_PADDING_TOP, repetitiveMemberNames, i === preRowAmount - 1 ? "rgb(63,81,97)" : null);
			}
			j++;
		}
		if (!this.m_emptyRowDimensions)
		{
			if (showDimensionHeaders)
			{
				rowStructure = oFF.PrFactory.createStructure();
				this.m_headerRowList.add(rowStructure);
				rowStructure.putInteger(oFF.SacTableConstants.R_N_ROW, preRowAmount);
				rowStructure.putInteger(oFF.SacTableConstants.R_N_HEIGHT, oFF.SacTableConstants.DF_R_N_HEIGHT);
				rowStructure.putBoolean(oFF.SacTableConstants.R_B_FIXED, frozenRows);
				cellsList = rowStructure.putNewList(oFF.SacTableConstants.R_L_CELLS);
				for (i = 0; i < this.m_preColumnsAmount; i++)
				{
					this.addHeaderCell(cellsList, preRowAmount, i, this.m_rowHeaderAggregation.getByKey(this.m_rowKeys.get(i)), oFF.SacTableConstants.CT_ROW_DIM_HEADER, oFF.SacTableConstants.CT_ATTRIBUTE_ROW_DIM_HEADER, oFF.SacTableConstants.C_N_HIERARCHY_PADDING_LEFT, oFF.SacTableConstants.DF_C_N_HIERARCHY_PADDING_LEFT, repetitiveMemberNames, null);
				}
				if (this.m_hasDataForColumns)
				{
					for (i = 0; i < this.m_columnTuplesCount; i++)
					{
						this.addNewEmptyHeaderCell(cellsList, preRowAmount, this.m_preColumnsAmount + i, null);
					}
				}
			}
		}
		this.m_tableJson.putInteger(oFF.SacTableConstants.TD_N_DATA_REGION_START_COL, 0);
		this.m_tableJson.putInteger(oFF.SacTableConstants.TD_N_DATA_REGION_START_ROW, 0);
		this.m_tableJson.putInteger(oFF.SacTableConstants.TD_N_DATA_REGION_CORNER_COL, this.m_preColumnsAmount - 1);
		this.m_tableJson.putInteger(oFF.SacTableConstants.TD_N_DATA_REGION_CORNER_ROW, this.m_headerRowAmount - 1);
		this.m_tableJson.putInteger(oFF.SacTableConstants.TD_N_DATA_REGION_HEADER_END_ROW, preRowAmount - 1);
	}
};
oFF.RsSacTableRenderer.prototype.preRenderAxis = function(cursorAxis, headerAggregation, valueAggregations, offset)
{
	cursorAxis.setTupleCursorBeforeStart();
	if (offset === 0)
	{
		oFF.XCollectionUtils.releaseEntriesFromCollection(valueAggregations);
		valueAggregations.clear();
	}
	var aggSize = valueAggregations.size();
	var lastAggregation = null;
	if (cursorAxis.hasNextTuple())
	{
		if (offset === aggSize)
		{
			if (aggSize > 0)
			{
				lastAggregation = valueAggregations.get(aggSize - 1);
			}
		}
		else
		{
			for (var i = aggSize; i <= offset; i++)
			{
				valueAggregations.add(null);
			}
			var startWithOffset = false;
			if (offset < aggSize)
			{
				lastAggregation = valueAggregations.get(offset - 1);
				if (oFF.notNull(lastAggregation))
				{
					startWithOffset = true;
				}
			}
			cursorAxis.nextTuple();
			lastAggregation = oFF.SacTableAggregation.getMemberHeader(cursorAxis, headerAggregation, lastAggregation);
			if (startWithOffset)
			{
				valueAggregations.set(offset, lastAggregation);
			}
			var index = offset + 1;
			while (cursorAxis.hasNextTuple() && index < aggSize)
			{
				cursorAxis.nextTuple();
				lastAggregation = oFF.SacTableAggregation.getMemberHeader(cursorAxis, headerAggregation, lastAggregation);
				valueAggregations.set(index, lastAggregation);
				index++;
			}
		}
		while (cursorAxis.hasNextTuple())
		{
			cursorAxis.nextTuple();
			lastAggregation = oFF.SacTableAggregation.getMemberHeader(cursorAxis, headerAggregation, lastAggregation);
			valueAggregations.add(lastAggregation);
		}
	}
};
oFF.RsSacTableRenderer.prototype.reformatRowHeaders = function()
{
	var showDimensionHeaders = this.getBooleanConfigProperty(oFF.SacTableConstants.B_DIMENSION_TITLES);
	var repetitiveMemberNames = this.getBooleanConfigProperty(oFF.SacTableConstants.B_REPETITIVE_MEMBER_NAMES);
	var valueAggregationElement;
	var i;
	var rowStructure;
	var cellsList;
	var cell;
	var totalRowsDiff = 0;
	if (!this.m_emptyRowDimensions)
	{
		for (var h = 0; h < this.m_rowValueAggregations.size(); h++)
		{
			var rowValueAggregation = this.m_rowValueAggregations.get(h);
			rowStructure = this.m_rowList.get(h);
			if (oFF.notNull(rowStructure))
			{
				var actualRow = h + this.m_headerRowAmount;
				totalRowsDiff = actualRow - rowStructure.getIntegerByKey(oFF.SacTableConstants.R_N_ROW);
				rowStructure.putInteger(oFF.SacTableConstants.R_N_ROW, actualRow);
				cellsList = rowStructure.getListByKey(oFF.SacTableConstants.R_L_CELLS);
				this.adjustCellListIndices(cellsList, actualRow);
				for (i = 0; i < this.m_preColumnsAmount; i++)
				{
					var rowKey = this.m_rowKeys.get(i);
					valueAggregationElement = rowValueAggregation.getByKey(rowKey);
					cell = cellsList.getStructureAt(i);
					this.formatCell(cell, valueAggregationElement, repetitiveMemberNames, "rgba(204,204,240,1)");
				}
			}
		}
	}
	else
	{
		rowStructure = this.m_rowList.get(0);
		if (oFF.notNull(rowStructure))
		{
			rowStructure.putInteger(oFF.SacTableConstants.R_N_ROW, this.m_headerRowAmount);
			cellsList = rowStructure.getListByKey(oFF.SacTableConstants.R_L_CELLS);
			if (showDimensionHeaders)
			{
				if (cellsList.size() === 0 || cellsList.getStructureAt(0).getIntegerByKey(oFF.SacTableConstants.C_N_TYPE) !== oFF.SacTableConstants.CT_HEADER)
				{
					this.insertNewEmptyHeaderCell(rowStructure.getListByKey(oFF.SacTableConstants.R_L_CELLS), this.m_headerRowAmount, 0, "rgba(204,204,240,1)");
				}
			}
			else
			{
				if (cellsList.size() > 0 && cellsList.getStructureAt(0).getIntegerByKey(oFF.SacTableConstants.C_N_TYPE) === oFF.SacTableConstants.CT_HEADER)
				{
					cellsList.removeAt(0);
				}
			}
			this.adjustCellListIndices(cellsList, this.m_headerRowAmount);
		}
	}
	if (totalRowsDiff < 0)
	{
		this.m_tableJson.putInteger(oFF.SacTableConstants.TD_N_TOTAL_ROWS_DIFF, totalRowsDiff);
	}
	this.m_tableJson.putInteger(oFF.SacTableConstants.TD_N_DATA_REGION_END_COL, this.m_preColumnsAmount + this.m_columnsTotalCount - 1);
	this.m_tableJson.putInteger(oFF.SacTableConstants.TD_N_DATA_REGION_END_ROW, this.m_headerRowAmount + this.m_rowsTotalCount - 1);
	this.m_tableJson.putInteger(oFF.SacTableConstants.TD_N_LAST_ROW_INDEX, this.m_headerRowAmount + this.m_rowsTotalCount - 1);
};
oFF.RsSacTableRenderer.prototype.adjustCellListIndices = function(cellsList, actualRow)
{
	for (var i = 0; i < cellsList.size(); i++)
	{
		var cell = cellsList.getStructureAt(i);
		cell.putInteger(oFF.SacTableConstants.C_N_COLUMN, i);
		cell.putInteger(oFF.SacTableConstants.C_N_ROW, actualRow);
	}
};
oFF.RsSacTableRenderer.prototype.renderRows = function(rs, offsetOrig, partial)
{
	if (oFF.notNull(this.m_tableJson))
	{
		var localRowList = oFF.XList.create();
		var offset = offsetOrig;
		if (this.m_hasDataForRows)
		{
			if (!this.m_emptyRowDimensions && this.m_rowValueAggregations.get(offsetOrig) === null)
			{
				offset = offsetOrig + 1;
			}
			var showDimensionHeaders = this.getBooleanConfigProperty(oFF.SacTableConstants.B_DIMENSION_TITLES);
			var repetitiveMemberNames = this.getBooleanConfigProperty(oFF.SacTableConstants.B_REPETITIVE_MEMBER_NAMES);
			var valueAggregationElement;
			var j = this.m_headerRowAmount + offset;
			var i;
			var rowStructure;
			var cellsList;
			var h;
			var rowSize = this.m_rowList.size();
			for (i = rowSize; i < offset; i++)
			{
				this.m_rowList.add(null);
			}
			for (h = offset; h < this.m_lastRowToFetch; h++)
			{
				var rowValueAggregation = this.m_emptyRowDimensions ? null : this.m_rowValueAggregations.get(h);
				rowStructure = oFF.PrFactory.createStructure();
				if (h >= rowSize)
				{
					this.m_rowList.add(rowStructure);
				}
				else
				{
					this.m_rowList.set(h, rowStructure);
				}
				localRowList.add(rowStructure);
				rowStructure.putInteger(oFF.SacTableConstants.R_N_ROW, j);
				rowStructure.putInteger(oFF.SacTableConstants.R_N_HEIGHT, oFF.SacTableConstants.DF_R_N_HEIGHT);
				cellsList = rowStructure.putNewList(oFF.SacTableConstants.R_L_CELLS);
				if (!this.m_emptyRowDimensions)
				{
					for (i = 0; i < this.m_preColumnsAmount; i++)
					{
						var rowKey = this.m_rowKeys.get(i);
						valueAggregationElement = rowValueAggregation.getByKey(rowKey);
						var dimensionMemberType = valueAggregationElement.getDimensionMemberType();
						if (dimensionMemberType === oFF.MemberType.RESULT || oFF.OlapComponentType.TOTALS === dimensionMemberType)
						{
							this.addToIntMap(this.m_totalRowIndexes, i, h);
						}
						this.addHeaderCell(cellsList, j, i, valueAggregationElement, oFF.SacTableConstants.CT_ROW_DIM_MEMBER, oFF.SacTableConstants.CT_ATTRIBUTE_ROW_DIM_MEMBER, oFF.SacTableConstants.C_N_HIERARCHY_PADDING_LEFT, oFF.SacTableConstants.DF_C_N_HIERARCHY_PADDING_LEFT, repetitiveMemberNames, "rgba(204,204,240,1)");
					}
				}
				else if (showDimensionHeaders)
				{
					this.addNewEmptyHeaderCell(rowStructure.getListByKey(oFF.SacTableConstants.R_L_CELLS), j, 0, "rgba(204,204,240,1)");
				}
				j++;
			}
			var actualRow;
			var dataColumnsAmount = rs.getDataColumns();
			for (actualRow = offset; actualRow < this.m_lastRowToFetch; actualRow++)
			{
				cellsList = this.m_rowList.get(actualRow).getListByKey(oFF.SacTableConstants.R_L_CELLS);
				for (j = 0; j < dataColumnsAmount; j++)
				{
					this.addDataCell(cellsList, rs.getDataCell(j, actualRow - offset), j + this.m_preColumnsAmount, this.m_headerRowAmount + actualRow);
				}
			}
		}
		this.m_columnsTotalCount = rs.getCursorColumnsAxis().getTuplesCountTotal();
		if (this.m_columnsTotalCount < 0)
		{
			this.m_columnsTotalCount = this.m_columnTuplesCount + 10;
		}
		this.m_rowsTotalCount = rs.getCursorRowsAxis().getTuplesCountTotal();
		if (this.m_rowsTotalCount < 0)
		{
			this.m_rowsTotalCount = this.m_lastRowToFetch + 10;
		}
		this.m_tableJson.putInteger(oFF.SacTableConstants.TD_N_DATA_REGION_END_COL, this.m_preColumnsAmount + this.m_columnsTotalCount - 1);
		this.m_tableJson.putInteger(oFF.SacTableConstants.TD_N_DATA_REGION_END_ROW, this.m_headerRowAmount + this.m_rowsTotalCount - 1);
		this.m_tableJson.putInteger(oFF.SacTableConstants.TD_N_LAST_ROW_INDEX, this.m_headerRowAmount + this.m_rowsTotalCount - 1);
		this.m_tableJson.remove(oFF.SacTableConstants.TD_N_TOTAL_ROWS_DIFF);
		if (partial)
		{
			this.m_tableJson.putBoolean(oFF.SacTableConstants.TD_B_PARTIAL, partial);
		}
		else
		{
			var partialStructure = this.m_tableJson.putNewStructure(oFF.SacTableConstants.TD_B_PARTIAL);
			if (this.m_hasDataForRows)
			{
				partialStructure.putInteger(oFF.SacTableConstants.TDP_N_TOTAL_ROWS, this.m_headerRowAmount + this.m_rowsTotalCount);
			}
			else
			{
				partialStructure.putInteger(oFF.SacTableConstants.TDP_N_TOTAL_ROWS, this.m_headerRowAmount);
			}
			partialStructure.putInteger(oFF.SacTableConstants.TDP_N_ROW_HEIGHT, oFF.SacTableConstants.DF_R_N_HEIGHT);
		}
		this.m_tableJson.putBoolean(oFF.SacTableConstants.TD_B_SCROLL_TO_TOP, !partial);
		var prRowList = this.m_tableJson.putNewList(oFF.SacTableConstants.TD_L_ROWS);
		if (partial)
		{
			oFF.XStream.of(localRowList).forEach( function(lre){
				prRowList.add(lre);
			}.bind(this));
		}
		else
		{
			oFF.XStream.of(this.m_headerRowList).forEach( function(hre){
				prRowList.add(hre);
			}.bind(this));
			this.fillWithRowsUpToFirstGap(prRowList);
		}
		return this.m_rowsTotalCount > this.m_lastRowToFetch + offset || this.m_rowsTotalCount < 0;
	}
	return false;
};
oFF.RsSacTableRenderer.prototype.addToIntMap = function(indexes, i, j)
{
	var index = oFF.XIntegerValue.create(i);
	if (!indexes.containsKey(index))
	{
		indexes.put(index, oFF.XList.create());
	}
	indexes.getByKey(index).add(oFF.XIntegerValue.create(j));
};
oFF.RsSacTableRenderer.prototype.addDataCell = function(cellsList, dataCell, column, row)
{
	var cell = cellsList.addNewStructure();
	cell.putInteger(oFF.SacTableConstants.C_N_ROW, row);
	cell.putInteger(oFF.SacTableConstants.C_N_COLUMN, column);
	if (dataCell.isDataEntryEnabled())
	{
		cell.putInteger(oFF.SacTableConstants.C_N_TYPE, oFF.SacTableConstants.CT_INPUT);
	}
	else
	{
		cell.putInteger(oFF.SacTableConstants.C_N_TYPE, oFF.SacTableConstants.CT_VALUE);
	}
	var formattedValue = dataCell.getFormattedValue();
	var currencyUnit = dataCell.getCurrencyUnit();
	if (currencyUnit.hasPrefix())
	{
		formattedValue = oFF.XStringUtils.concatenate3(currencyUnit.getPrefix(), " ", formattedValue);
	}
	if (currencyUnit.hasSuffix())
	{
		formattedValue = oFF.XStringUtils.concatenate3(formattedValue, " ", currencyUnit.getSuffix());
	}
	this.ensureWidth(column, formattedValue, 2);
	var valueException = dataCell.getValueException();
	if (valueException === oFF.ValueException.UNDEFINED)
	{
		formattedValue = "\u2012";
	}
	else if (valueException !== oFF.ValueException.NORMAL && valueException !== oFF.ValueException.ZERO)
	{
		cell.putInteger(oFF.SacTableConstants.C_N_TYPE, oFF.SacTableConstants.CT_UNBOOKED);
		formattedValue = oFF.XStringUtils.concatenate3(valueException.getName(), ": ", formattedValue);
	}
	cell.putString(oFF.SacTableConstants.C_S_FORMATTED, formattedValue);
	if (valueException !== oFF.ValueException.UNDEFINED && valueException !== oFF.ValueException.NULL_VALUE)
	{
		if (dataCell.getValueType().isNumber())
		{
			cell.putDouble(oFF.SacTableConstants.C_SN_PLAIN, dataCell.getDouble());
		}
		else
		{
			cell.putString(oFF.SacTableConstants.C_SN_PLAIN, dataCell.getStringRepresentation());
		}
	}
	var style = cell.putNewStructure(oFF.SacTableConstants.C_M_STYLE);
	cell.putBoolean(oFF.SacTableConstants.C_B_STYLE_UPDATED_BY_USER, true);
	var bottomColor = "rgba(204,204,204,1)";
	this.addBottomLines(style, bottomColor);
};
oFF.RsSacTableRenderer.prototype.addHeaderCell = function(cellsList, row, col, headerAggregation, mainType, sideType, hierarchyPaddingElement, hierarchyPaddingValue, repetitiveMemberNames, bottomColor)
{
	var field = headerAggregation.getField();
	var cell = cellsList.addNewStructure();
	cell.putString(oFF.SacTableConstants.C_SN_FIELD, field.getName());
	cell.putInteger(oFF.SacTableConstants.C_N_ROW, row);
	cell.putInteger(oFF.SacTableConstants.C_N_COLUMN, col);
	cell.putBoolean(oFF.SacTableConstants.C_B_ALLOW_DRAG_DROP, true);
	var isMainAttribute = headerAggregation.isMainAttribute();
	cell.putInteger(oFF.SacTableConstants.C_N_TYPE, isMainAttribute ? mainType : sideType);
	var formattedValue = headerAggregation.getText();
	var lengthAddition = 2;
	if (this.addSortIcon(cell, headerAggregation, headerAggregation.getDimension(), field, isMainAttribute, mainType))
	{
		lengthAddition = 5;
	}
	cell.putString(oFF.SacTableConstants.C_SN_PLAIN, headerAggregation.getPlain());
	cell.putInteger(oFF.SacTableConstants.RCS_N_INDEX, headerAggregation.getDimensionIndex());
	var style = this.formatCell(cell, headerAggregation, repetitiveMemberNames, bottomColor);
	var drillState = headerAggregation.getDrillState();
	var dimensionMemberType = headerAggregation.getDimensionMemberType();
	if (oFF.MemberType.RESULT === dimensionMemberType || oFF.OlapComponentType.TOTALS === dimensionMemberType)
	{
		style.putNewStructure(oFF.SacTableConstants.ST_M_FONT).putBoolean(oFF.SacTableConstants.FS_B_BOLD, true);
		cell.putBoolean(oFF.SacTableConstants.C_B_IS_INA_TOTALS_CONTEXT, true);
	}
	var headerDimension = headerAggregation.getDimension();
	var hierarchyActive = headerDimension.isHierarchyActive() || headerDimension.isUniversalDisplayHierarchyDimension();
	var reversedHierarchy = headerDimension.getLowerLevelNodeAlignment() === oFF.Alignment.CHILDREN_ABOVE_PARENT;
	this.m_tableJson.putBoolean(oFF.SacTableConstants.TD_B_REVERSED_HIERARCHY, reversedHierarchy);
	var isInHierarchy = oFF.notNull(drillState) && hierarchyActive;
	if (isInHierarchy)
	{
		var displayLevel = headerAggregation.getDisplayLevel();
		lengthAddition = (displayLevel === 0 ? 10 : 2 * displayLevel) + lengthAddition;
		cell.putBoolean(oFF.SacTableConstants.C_B_IS_IN_HIERARCHY, true);
		cell.putInteger(oFF.SacTableConstants.C_N_LEVEL, displayLevel);
		cell.putInteger(hierarchyPaddingElement, hierarchyPaddingValue * (1 + displayLevel));
		cell.putBoolean(oFF.SacTableConstants.C_B_SHOW_DRILL_ICON, oFF.notNull(drillState) && drillState !== oFF.DrillState.LEAF && oFF.MemberType.RESULT !== dimensionMemberType && oFF.OlapComponentType.TOTALS !== dimensionMemberType);
		cell.putBoolean(oFF.SacTableConstants.C_B_EXPANDED, drillState === oFF.DrillState.EXPANDED || drillState === oFF.DrillState.DRILLED);
	}
	this.ensureWidth(col, formattedValue, lengthAddition);
};
oFF.RsSacTableRenderer.prototype.formatCell = function(cell, headerAggregation, repetitiveMemberNames, bottomColor)
{
	cell.putString(oFF.SacTableConstants.C_S_FORMATTED, !repetitiveMemberNames && headerAggregation.isRepeatedMemberName() ? "" : headerAggregation.getText());
	var style = cell.putNewStructure(oFF.SacTableConstants.C_M_STYLE);
	style.putStringNotNullAndNotEmpty(oFF.SacTableConstants.ST_S_FILL_COLOR, this.getStringConfigProperty(oFF.SacTableConstants.S_HEADER_COLOR));
	if (oFF.notNull(bottomColor))
	{
		this.addBottomLines(style, bottomColor);
	}
	cell.putBoolean(oFF.SacTableConstants.C_B_STYLE_UPDATED_BY_USER, true);
	cell.putBoolean(oFF.SacTableConstants.C_B_REPEATED_MEMBER_NAME, headerAggregation.isRepeatedMemberName());
	return style;
};
oFF.RsSacTableRenderer.prototype.addSortIcon = function(cell, headerAggregation, dimension, field, isMainAttribute, mainType)
{
	var sortDirection = null;
	if (mainType === oFF.SacTableConstants.CT_COL_DIM_HEADER || mainType === oFF.SacTableConstants.CT_ROW_DIM_HEADER)
	{
		if (isMainAttribute && this.m_caps.supportsDimensionSorting(dimension, field.getPresentationType().isTypeOf(oFF.PresentationType.ABSTRACT_KEY) ? oFF.SortType.MEMBER_KEY : oFF.SortType.MEMBER_TEXT) || this.m_caps.supportsFieldSorting(field))
		{
			sortDirection = this.m_sortDirections.getByKey(field.getName());
			if (oFF.isNull(sortDirection))
			{
				sortDirection = oFF.XSortDirection.DEFAULT_VALUE;
			}
		}
	}
	else
	{
		if (this.m_caps.supportsDataCellSorting() || this.m_caps.supportsMeasureSorting() && dimension.isMeasureStructure())
		{
			sortDirection = this.m_sortDirections.getByKey(headerAggregation.getPathKey());
			if (oFF.isNull(sortDirection) || sortDirection === oFF.XSortDirection.DEFAULT_VALUE)
			{
				sortDirection = this.m_sortDirections.getByKey(headerAggregation.getDimensionMemberName());
			}
			if (oFF.isNull(sortDirection))
			{
				sortDirection = oFF.XSortDirection.DEFAULT_VALUE;
			}
		}
	}
	if (oFF.notNull(sortDirection))
	{
		var iconContent = null;
		if (sortDirection === oFF.XSortDirection.DEFAULT_VALUE)
		{
			iconContent = "\uE095";
		}
		else if (sortDirection === oFF.XSortDirection.ASCENDING)
		{
			iconContent = "\uE1FD";
		}
		else if (sortDirection === oFF.XSortDirection.DESCENDING)
		{
			iconContent = "\uE1FC";
		}
		var cellIcon = cell.putNewStructure(oFF.SacTableConstants.C_M_CELL_ICON);
		cellIcon.putString(oFF.SacTableConstants.CI_S_CLASS_NAME, oFF.SacTableConstants.CI_SV_CLASS_NAME_SAP_UI_ICON);
		var cellIconAttribute = cellIcon.putNewStructure(oFF.SacTableConstants.CI_M_ATTRIBUTES);
		cellIconAttribute.putString(oFF.SacTableConstants.CIA_S_DATA_SAP_UI_ICON_CONTENT, iconContent);
		var cellIconStyle = cellIcon.putNewStructure(oFF.SacTableConstants.CI_M_STYLE);
		cellIconStyle.putString(oFF.SacTableConstants.CIS_S_FONT_FAMILY, oFF.SacTableConstants.CIS_SV_SAP_ICONS);
		cellIconStyle.putInteger(oFF.SacTableConstants.CIS_N_MARGIN_LEFT, oFF.SacTableConstants.CIS_NV_MARGIN_RIGHT);
		cellIcon.putBoolean(oFF.SacTableConstants.CI_B_ICON_AFTER, true);
	}
	return oFF.notNull(sortDirection);
};
oFF.RsSacTableRenderer.prototype.addBottomLines = function(style, color)
{
	var lines = style.putNewList(oFF.SacTableConstants.ST_L_LINES);
	var line = lines.addNewStructure();
	line.putString(oFF.SacTableConstants.SL_S_COLOR, color);
	line.putInteger(oFF.SacTableConstants.SL_N_SIZE, 1);
	line.putInteger(oFF.SacTableConstants.SL_N_STYLE, 1);
	line.putInteger(oFF.SacTableConstants.SL_N_POSITION, oFF.SacTableConstants.LP_BOTTOM);
	var padding = line.putNewStructure(oFF.SacTableConstants.SL_M_PADDING);
	padding.putInteger(oFF.SacTableConstants.SLP_N_RIGHT, oFF.SacTableConstants.LP_RIGHT);
	padding.putInteger(oFF.SacTableConstants.SLP_N_LEFT, oFF.SacTableConstants.LP_RIGHT);
};
oFF.RsSacTableRenderer.prototype.ensureWidth = function(col, formattedValue, addition)
{
	while (this.m_columnWidths.size() < col)
	{
		this.m_columnWidths.add(oFF.XIntegerValue.create(0));
	}
	var newLength = oFF.XString.size(formattedValue) + addition;
	if (col === this.m_columnWidths.size())
	{
		this.m_columnWidths.add(oFF.XIntegerValue.create(newLength));
	}
	else if (this.m_columnWidths.get(col).getInteger() < newLength)
	{
		this.m_columnWidths.set(col, oFF.XIntegerValue.create(newLength));
	}
};
oFF.RsSacTableRenderer.prototype.addNewEmptyHeaderCell = function(cellsList, row, column, bottomColor)
{
	var cell = cellsList.addNewStructure();
	cell.putInteger(oFF.SacTableConstants.C_N_ROW, row);
	cell.putInteger(oFF.SacTableConstants.C_N_COLUMN, column);
	cell.putInteger(oFF.SacTableConstants.C_N_TYPE, oFF.SacTableConstants.CT_HEADER);
	cell.putBoolean(oFF.SacTableConstants.C_B_STYLE_UPDATED_BY_USER, true);
	var style = cell.putNewStructure(oFF.SacTableConstants.C_M_STYLE);
	style.putStringNotNullAndNotEmpty(oFF.SacTableConstants.ST_S_FILL_COLOR, this.getStringConfigProperty(oFF.SacTableConstants.S_HEADER_COLOR));
	if (oFF.notNull(bottomColor))
	{
		this.addBottomLines(style, bottomColor);
	}
};
oFF.RsSacTableRenderer.prototype.insertNewEmptyHeaderCell = function(cellsList, row, column, bottomColor)
{
	var cell = oFF.PrFactory.createStructure();
	cell.putInteger(oFF.SacTableConstants.C_N_ROW, row);
	cell.putInteger(oFF.SacTableConstants.C_N_COLUMN, column);
	cell.putInteger(oFF.SacTableConstants.C_N_TYPE, oFF.SacTableConstants.CT_HEADER);
	cell.putBoolean(oFF.SacTableConstants.C_B_STYLE_UPDATED_BY_USER, true);
	var style = cell.putNewStructure(oFF.SacTableConstants.C_M_STYLE);
	style.putStringNotNullAndNotEmpty(oFF.SacTableConstants.ST_S_FILL_COLOR, this.getStringConfigProperty(oFF.SacTableConstants.S_HEADER_COLOR));
	if (oFF.notNull(bottomColor))
	{
		this.addBottomLines(style, bottomColor);
	}
	cellsList.insert(0, cell);
};
oFF.RsSacTableRenderer.prototype.getColumnsTotalCount = function()
{
	return this.m_hasData ? oFF.XMath.max(0, this.m_preColumnsAmount) + oFF.XMath.max(0, this.m_columnsTotalCount) : 0;
};
oFF.RsSacTableRenderer.prototype.getDataColumnsTotalCount = function()
{
	return this.m_hasData ? oFF.XMath.max(0, this.m_columnsTotalCount) : 0;
};
oFF.RsSacTableRenderer.prototype.getRowsTotalCount = function()
{
	return this.m_hasData ? oFF.XMath.max(0, this.m_headerRowAmount) + oFF.XMath.max(0, this.m_rowsTotalCount) : 0;
};
oFF.RsSacTableRenderer.prototype.getDataRowsTotalCount = function()
{
	return this.m_hasData ? oFF.XMath.max(0, this.m_rowsTotalCount) : 0;
};
oFF.RsSacTableRenderer.prototype.getColumnsLoadedCount = function()
{
	return this.m_hasData ? oFF.XMath.max(0, this.m_preColumnsAmount) + oFF.XMath.max(0, this.m_columnTuplesCount) : 0;
};
oFF.RsSacTableRenderer.prototype.getRowsLoadedCount = function()
{
	return this.m_hasData ? oFF.XMath.max(0, this.m_headerRowAmount) + (oFF.XCollectionUtils.hasElements(this.m_rowList) ? oFF.XStream.of(this.m_rowList).filter( function(val){
		return oFF.notNull(val);
	}.bind(this)).countItems() : 0) : 0;
};
oFF.RsSacTableRenderer.prototype.getFullRowList = function()
{
	var rowList = oFF.XList.create();
	rowList.addAll(this.m_headerRowList);
	rowList.addAll(this.m_rowList);
	return rowList;
};
oFF.RsSacTableRenderer.prototype.releaseObject = function()
{
	this.m_gridConfig = oFF.XObjectExt.release(this.m_gridConfig);
	this.releaseStaleData();
	oFF.XObject.prototype.releaseObject.call( this );
};
oFF.RsSacTableRenderer.prototype.releaseStaleData = function()
{
	this.m_preColumnsAmount = 0;
	this.m_lastRowToFetch = 0;
	this.m_headerRowAmount = 0;
	this.m_columnTuplesCount = 0;
	this.m_columnsTotalCount = 0;
	this.m_rowsTotalCount = 0;
	this.m_caps = null;
	this.m_emptyRowDimensions = false;
	this.m_rowList = oFF.XObjectExt.release(this.m_rowList);
	this.m_headerRowList = oFF.XObjectExt.release(this.m_headerRowList);
	this.m_columnWidths = oFF.XObjectExt.release(this.m_columnWidths);
	this.m_totalRowIndexes = oFF.XObjectExt.release(this.m_totalRowIndexes);
	this.m_totalColumnIndexes = oFF.XObjectExt.release(this.m_totalColumnIndexes);
	this.m_sortDirections = oFF.XObjectExt.release(this.m_sortDirections);
	this.m_tableJson = oFF.XObjectExt.release(this.m_tableJson);
	this.m_columnHeaderAggregation = oFF.XCollectionUtils.releaseEntriesAndCollectionIfNotNull(this.m_columnHeaderAggregation);
	this.m_rowHeaderAggregation = oFF.XCollectionUtils.releaseEntriesAndCollectionIfNotNull(this.m_rowHeaderAggregation);
	this.m_rowValueAggregations = oFF.XCollectionUtils.releaseEntriesAndCollectionIfNotNull(this.m_rowValueAggregations);
	this.m_columnValueAggregations = oFF.XCollectionUtils.releaseEntriesAndCollectionIfNotNull(this.m_columnValueAggregations);
	this.m_queryModel = null;
	this.m_columnKeys = oFF.XObjectExt.release(this.m_columnKeys);
	this.m_rowKeys = oFF.XObjectExt.release(this.m_rowKeys);
};
oFF.RsSacTableRenderer.prototype.getTableJson = function()
{
	return this.m_tableJson;
};

oFF.SacTableAggregation = function() {};
oFF.SacTableAggregation.prototype = new oFF.XObject();
oFF.SacTableAggregation.prototype._ff_c = "SacTableAggregation";

oFF.SacTableAggregation.create = function(text, plain, dimension, dimensionMemberType, drillState, displayLevel, field, index, isMainAttribute, dimensionIndex, dimensionMemberName, pathKey, repeatedMemberName)
{
	var result = new oFF.SacTableAggregation();
	result.m_text = text;
	result.m_plain = plain;
	result.m_dimension = dimension;
	result.m_drillState = drillState;
	result.m_displayLevel = displayLevel;
	result.m_field = field;
	result.m_index = index;
	result.m_isMainAttribute = isMainAttribute;
	result.m_dimensionIndex = dimensionIndex;
	result.m_dimensionMemberType = dimensionMemberType;
	result.m_dimensionMemberName = dimensionMemberName;
	result.m_pathKey = pathKey;
	result.m_repeatedMemberName = repeatedMemberName;
	return result;
};
oFF.SacTableAggregation.getMemberHeader = function(cursorAxis, dimHeader, previousHeader)
{
	var repeatedMemberName = true;
	var result = oFF.XLinkedHashMapByString.create();
	var pathKey = "";
	while (cursorAxis.hasNextTupleElement())
	{
		var tupleElement = cursorAxis.nextTupleElement();
		var dimensionMemberName = tupleElement.getDimensionMemberName();
		pathKey = oFF.XStringUtils.concatenate5(pathKey, "::[", tupleElement.getRsDimensionAtCurrentPosition().getName(), "]==>", dimensionMemberName);
		while (cursorAxis.hasNextFieldValue())
		{
			var fieldValue = cursorAxis.nextFieldValue();
			var field = fieldValue.getField();
			var fieldName = field.getName();
			if (!dimHeader.containsKey(fieldName))
			{
				continue;
			}
			var header = dimHeader.getByKey(fieldName);
			var displayLevel = tupleElement.getDisplayLevel();
			var plain = oFF.XValueUtil.getString(fieldValue.getValue());
			if (oFF.isNull(previousHeader) || !previousHeader.containsKey(fieldName))
			{
				repeatedMemberName = false;
			}
			else if (!oFF.XString.isEqual(previousHeader.getByKey(fieldName).getPlain(), plain) || previousHeader.getByKey(fieldName).getDisplayLevel() !== displayLevel)
			{
				repeatedMemberName = false;
			}
			var formattedValue = fieldValue.getFormattedValue();
			result.put(fieldName, oFF.SacTableAggregation.create(formattedValue, plain, header.getDimension(), tupleElement.getDimensionMemberType(), tupleElement.getDrillState(), displayLevel, header.getField(), header.getIndex(), header.isMainAttribute(), header.getDimensionIndex(), dimensionMemberName, pathKey, repeatedMemberName));
		}
	}
	return result;
};
oFF.SacTableAggregation.getDimHeader = function(cursorAxis, queryModel)
{
	var i;
	var j;
	var dimensions = cursorAxis.getRsDimensions();
	var size = dimensions.size();
	var result = oFF.XLinkedHashMapByString.create();
	var index = 0;
	var text;
	for (i = 0; i < size; i++)
	{
		var baseDimension = dimensions.get(i);
		var dimension = queryModel.getDimensionByName(baseDimension.getName());
		var mainAttribute = dimension.getMainAttribute();
		var resultSetFields;
		text = dimension.getText();
		var rsfSize;
		var field;
		if (dimension.isUniversalDisplayHierarchyDimension())
		{
			resultSetFields = baseDimension.getResultSetFields();
			rsfSize = resultSetFields.size();
			for (j = 0; j < rsfSize; j++)
			{
				field = dimension.getFieldByName(resultSetFields.get(j).getName());
				if (j > 0)
				{
					text = "";
				}
				result.put(field.getName(), oFF.SacTableAggregation.create(text, field.getName(), dimension, null, null, -1, field, index, true, i, null, null, false));
				index++;
			}
		}
		else if (dimension.getFieldLayoutType() === oFF.FieldLayoutType.FIELD_BASED)
		{
			resultSetFields = dimension.getResultSetFields();
			var mainFields = mainAttribute.getResultSetFields();
			var mainText = mainAttribute.getText();
			rsfSize = resultSetFields.size();
			for (j = 0; j < rsfSize; j++)
			{
				field = dimension.getFieldByName(resultSetFields.get(j).getName());
				if (field.getObtainability() === oFF.ObtainabilityType.USER_INTERFACE)
				{
					continue;
				}
				var inMainFields = mainFields.contains(field);
				if (inMainFields)
				{
					text = mainText;
					mainText = "";
				}
				else
				{
					text = field.getText();
				}
				result.put(field.getName(), oFF.SacTableAggregation.create(text, field.getName(), dimension, null, null, -1, field, index, inMainFields, i, null, null, false));
				index++;
			}
		}
		else
		{
			var resultSetAttributes = dimension.getResultSetAttributes();
			var rsaSize = resultSetAttributes.size();
			for (j = 0; j < rsaSize; j++)
			{
				var attribute = resultSetAttributes.get(j);
				var isMainAttribute = attribute === mainAttribute;
				var subFields = attribute.getResultSetFields();
				var attributeFieldSize = subFields.size();
				text = attribute.getText();
				for (var k = 0; k < attributeFieldSize; k++)
				{
					var attributeField = dimension.getFieldByName(subFields.get(k).getName());
					if (attributeField.getObtainability() !== oFF.ObtainabilityType.USER_INTERFACE)
					{
						if (dimension.isHierarchyActive() && attributeField === dimension.getFlatKeyField())
						{
							attributeField = dimension.getKeyField();
						}
						if (!dimension.isHierarchyActive() && attributeField === dimension.getHierarchyKeyField())
						{
							attributeField = dimension.getKeyField();
						}
						result.put(attributeField.getName(), oFF.SacTableAggregation.create(text, attributeField.getName(), dimension, null, null, -1, attributeField, index, isMainAttribute, i, null, null, false));
						text = "";
						index++;
					}
				}
			}
		}
	}
	return result;
};
oFF.SacTableAggregation.getSimplifiedUniqueName = function(elementPath)
{
	var simplifiedName = "";
	for (var i = 0; i < elementPath.size(); i++)
	{
		var pathElement = elementPath.get(i);
		simplifiedName = oFF.XStringUtils.concatenate5(simplifiedName, "::[", pathElement.getDimension().getName(), "]==>", pathElement.getName());
	}
	return simplifiedName;
};
oFF.SacTableAggregation.prototype.m_drillState = null;
oFF.SacTableAggregation.prototype.m_displayLevel = 0;
oFF.SacTableAggregation.prototype.m_text = null;
oFF.SacTableAggregation.prototype.m_plain = null;
oFF.SacTableAggregation.prototype.m_dimension = null;
oFF.SacTableAggregation.prototype.m_field = null;
oFF.SacTableAggregation.prototype.m_index = 0;
oFF.SacTableAggregation.prototype.m_dimensionIndex = 0;
oFF.SacTableAggregation.prototype.m_isMainAttribute = false;
oFF.SacTableAggregation.prototype.m_dimensionMemberType = null;
oFF.SacTableAggregation.prototype.m_dimensionMemberName = null;
oFF.SacTableAggregation.prototype.m_pathKey = null;
oFF.SacTableAggregation.prototype.isRepeatedMemberName = function()
{
	return this.m_repeatedMemberName;
};
oFF.SacTableAggregation.prototype.m_repeatedMemberName = false;
oFF.SacTableAggregation.prototype.getText = function()
{
	return this.m_text;
};
oFF.SacTableAggregation.prototype.getPlain = function()
{
	return this.m_plain;
};
oFF.SacTableAggregation.prototype.getDimension = function()
{
	return this.m_dimension;
};
oFF.SacTableAggregation.prototype.getIndex = function()
{
	return this.m_index;
};
oFF.SacTableAggregation.prototype.isMainAttribute = function()
{
	return this.m_isMainAttribute;
};
oFF.SacTableAggregation.prototype.getDimensionIndex = function()
{
	return this.m_dimensionIndex;
};
oFF.SacTableAggregation.prototype.getField = function()
{
	return this.m_field;
};
oFF.SacTableAggregation.prototype.getDrillState = function()
{
	return this.m_drillState;
};
oFF.SacTableAggregation.prototype.getDisplayLevel = function()
{
	return this.m_displayLevel;
};
oFF.SacTableAggregation.prototype.getDimensionMemberType = function()
{
	return this.m_dimensionMemberType;
};
oFF.SacTableAggregation.prototype.getDimensionMemberName = function()
{
	return this.m_dimensionMemberName;
};
oFF.SacTableAggregation.prototype.getPathKey = function()
{
	return this.m_pathKey;
};
oFF.SacTableAggregation.prototype.releaseObject = function()
{
	this.m_drillState = null;
	this.m_displayLevel = 0;
	this.m_text = null;
	this.m_plain = null;
	this.m_dimension = null;
	this.m_field = null;
	this.m_index = 0;
	this.m_dimensionIndex = 0;
	this.m_isMainAttribute = false;
	this.m_dimensionMemberType = null;
	this.m_dimensionMemberName = null;
	this.m_pathKey = null;
	oFF.XObject.prototype.releaseObject.call( this );
};

oFF.FioriGrid = function() {};
oFF.FioriGrid.prototype = new oFF.XObject();
oFF.FioriGrid.prototype._ff_c = "FioriGrid";

oFF.FioriGrid.MAGIC_CELL_DIV = "/";
oFF.FioriGrid.create = function(resultSet)
{
	var grid = new oFF.FioriGrid();
	grid.setupGrid(resultSet);
	return grid;
};
oFF.FioriGrid.prototype.m_cells = null;
oFF.FioriGrid.prototype.m_rowDefs = null;
oFF.FioriGrid.prototype.m_colDefs = null;
oFF.FioriGrid.prototype.m_fixedWidth = 0;
oFF.FioriGrid.prototype.m_fixedHeight = 0;
oFF.FioriGrid.prototype.m_resultSet = null;
oFF.FioriGrid.prototype.m_semStyles = null;
oFF.FioriGrid.prototype.m_withDetails = false;
oFF.FioriGrid.prototype.m_fixedHeightOff = 0;
oFF.FioriGrid.prototype.m_fixedWidthOff = 0;
oFF.FioriGrid.prototype.m_offsetRows = 0;
oFF.FioriGrid.prototype.m_offsetColumns = 0;
oFF.FioriGrid.prototype.m_suppressRepetition = true;
oFF.FioriGrid.prototype.m_suppress_unit = null;
oFF.FioriGrid.prototype.setupGrid = function(resultSet)
{
	this.m_resultSet = resultSet;
	this.m_withDetails = true;
	this.m_semStyles = new oFF.XHashMapOfStringByString();
};
oFF.FioriGrid.prototype.releaseObject = function()
{
	if (oFF.notNull(this.m_cells))
	{
		var size0 = this.m_cells.size0();
		for (var x = 0; x < size0; x++)
		{
			var size1 = this.m_cells.size1();
			for (var y = 0; y < size1; y++)
			{
				var cell = this.m_cells.getByIndices(x, y);
				if (oFF.notNull(cell))
				{
					oFF.XObjectExt.release(cell);
					this.m_cells.setByIndices(x, y, null);
				}
			}
		}
		oFF.XObjectExt.release(this.m_cells);
		this.m_cells = null;
	}
	this.m_colDefs = null;
	this.m_rowDefs = null;
	this.m_resultSet = null;
	oFF.XObject.prototype.releaseObject.call( this );
};
oFF.FioriGrid.prototype.prepareCellStructure = function()
{
	if (oFF.isNull(this.m_cells) && oFF.notNull(this.m_resultSet))
	{
		this.prepareStructure();
	}
};
oFF.FioriGrid.prototype.prepareStructure = function()
{
	var columnsAxis = this.m_resultSet.getColumnsAxis();
	var colMaxCount = oFF.XMath.max(columnsAxis.getDataCount(), columnsAxis.getTuplesCount());
	var rowsAxis = this.m_resultSet.getRowsAxis();
	this.m_fixedHeight = oFF.XMath.max(this.getEffectiveFieldSizeCol(columnsAxis), this.getEffectiveFieldSizeRow(rowsAxis) === 0 ? 0 : 1);
	var rowDataCount = rowsAxis.getDataCount();
	var rowTupleCount = rowsAxis.getTuplesCount();
	var rowMaxCount = oFF.XMath.max(rowDataCount, rowTupleCount);
	this.m_fixedWidth = oFF.XMath.max(this.getEffectiveFieldSizeRow(rowsAxis), 1);
	var totalColumns = this.m_fixedWidth + colMaxCount;
	var totalRows = this.m_fixedHeight + rowMaxCount;
	this.m_offsetColumns = this.m_resultSet.getQueryManager().getOffsetColumns();
	this.m_offsetRows = this.m_resultSet.getQueryManager().getOffsetRows();
	this.m_cells = oFF.XArray2Dim.create(totalColumns, totalRows);
	this.m_rowDefs = oFF.XList.create();
	this.m_colDefs = oFF.XList.create();
	for (var x = 0; x < totalColumns; x++)
	{
		this.m_colDefs.add(oFF.FioriLineDef.create());
	}
	for (var y = 0; y < totalRows; y++)
	{
		this.m_rowDefs.add(oFF.FioriLineDef.create());
	}
	this.setTitleCells(rowsAxis, oFF.XMath.max(this.m_fixedHeight - 1, 0), columnsAxis.getRsDimensions().isEmpty());
	this.setTitleCells(columnsAxis, oFF.XMath.max(this.m_fixedWidth - 1, 0), rowsAxis.getRsDimensions().isEmpty());
	var fixedHeight = this.m_fixedHeight - this.m_fixedHeightOff;
	this.setHeaderCells(rowsAxis, fixedHeight);
	var fixedWidth = this.m_fixedWidth - this.m_fixedWidthOff;
	this.setHeaderCells(columnsAxis, fixedWidth);
	this.setDataCells();
};
oFF.FioriGrid.prototype.getMaxDisplayLevel = function(columns, rsDim)
{
	var tuplesCount = columns.getTuplesCount();
	var result = 0;
	for (var tupleIndex = 0; tupleIndex < tuplesCount; tupleIndex++)
	{
		var tuple = columns.getTupleAt(tupleIndex);
		result = oFF.XMath.max(result, tuple.getTupleElementByDimension(rsDim).getDisplayLevel());
	}
	return result;
};
oFF.FioriGrid.prototype.getEffectiveFieldSizeCol = function(axis)
{
	var effectiveSize = 0;
	var rsDimensions = axis.getRsDimensions();
	var dimensionSize = rsDimensions.size();
	for (var idxDim = 0; idxDim < dimensionSize; idxDim++)
	{
		effectiveSize = effectiveSize + rsDimensions.get(idxDim).getResultSetFields().size();
		effectiveSize = effectiveSize + this.getMaxDisplayLevel(axis, rsDimensions.get(idxDim));
	}
	return effectiveSize;
};
oFF.FioriGrid.prototype.getEffectiveFieldSizeRow = function(axis)
{
	var effectiveSize = 0;
	var rsDimensions = axis.getRsDimensions();
	var dimensionSize = rsDimensions.size();
	for (var idxDim = 0; idxDim < dimensionSize; idxDim++)
	{
		effectiveSize = effectiveSize + rsDimensions.get(idxDim).getResultSetFields().size();
	}
	return effectiveSize;
};
oFF.FioriGrid.prototype.setTitleCells = function(axis, offset, complementaryAxisEmpty)
{
	var type = axis.getType();
	var rsDimensions = axis.getRsDimensions();
	var position = 0;
	var buffer = oFF.XStringBuffer.create();
	var bufferDV = oFF.XStringBuffer.create();
	var dimSize = rsDimensions.size();
	for (var idxDim = 0; idxDim < dimSize; idxDim++)
	{
		var rsDimension = rsDimensions.get(idxDim);
		var visibleFields = rsDimension.getResultSetFields();
		var fieldSize = visibleFields.size();
		for (var idxField = 0; idxField < fieldSize; idxField++)
		{
			var fieldName = visibleFields.get(idxField).getName();
			if (oFF.XStringUtils.isNullOrEmpty(rsDimension.getName()))
			{
				buffer.append("[").append(fieldName).append("]");
			}
			else
			{
				if (idxField === 0)
				{
					bufferDV.append(rsDimension.getText());
				}
				if (rsDimension.isMeasureStructure())
				{
					if (idxField === 0)
					{
						buffer.append("Measures");
					}
				}
				else if (rsDimension.isStructure())
				{
					if (idxField === 0)
					{
						buffer.append("Structure");
					}
				}
				else
				{
					if (idxField === 0)
					{
						buffer.append(rsDimension.getName()).append(".[");
					}
					else
					{
						buffer.append("[");
					}
					buffer.append(fieldName).append("]");
				}
			}
			if (type === oFF.AxisType.ROWS)
			{
				if (!(rsDimension.isStructure() && dimSize === idxDim + 1))
				{
					var titleCell = oFF.FioriGridCell.create(buffer.toString(), oFF.FioriCellType.TITLE);
					titleCell.setDisplayValue(bufferDV.toString());
					var extName1 = this.m_resultSet.getQueryModel().getDimensionByName(rsDimension.getName()).getExternalName();
					if (oFF.notNull(extName1))
					{
						titleCell.setDimension(extName1);
					}
					else
					{
						titleCell.setDimension(rsDimension.getName());
					}
					titleCell.setRow(offset);
					titleCell.setColumn(position);
					this.setCell(position, offset, titleCell);
				}
			}
			else
			{
				if (!(rsDimension.isStructure() && dimSize === idxDim + 1))
				{
					var existingCell = this.m_cells.getByIndices(offset, position);
					if (oFF.notNull(existingCell))
					{
						var simpleName = buffer.toString();
						buffer.clear();
						bufferDV.clear();
						buffer.append(existingCell.toString());
						buffer.append(oFF.FioriGrid.MAGIC_CELL_DIV);
						buffer.append(simpleName);
						bufferDV.append(existingCell.getDisplayValue());
						if (idxField === 0 && !rsDimension.isStructure())
						{
							bufferDV.append(oFF.FioriGrid.MAGIC_CELL_DIV);
							bufferDV.append(rsDimension.getText());
						}
					}
					var titCell = oFF.FioriGridCell.create(buffer.toString(), oFF.FioriCellType.TITLE);
					titCell.setRow(position);
					titCell.setColumn(offset);
					titCell.setDisplayValue(bufferDV.toString());
					if (oFF.notNull(existingCell))
					{
						titCell.setDimension(existingCell.getDimension());
						var extName2 = this.m_resultSet.getQueryModel().getDimensionByName(rsDimension.getName()).getExternalName();
						if (oFF.notNull(extName2))
						{
							titCell.setDimensionOther(extName2);
						}
						else
						{
							titCell.setDimensionOther(rsDimension.getName());
						}
					}
					else
					{
						var extNameO = this.m_resultSet.getQueryModel().getDimensionByName(rsDimension.getName()).getExternalName();
						if (oFF.notNull(extNameO))
						{
							titCell.setDimension(extNameO);
						}
						else
						{
							titCell.setDimension(rsDimension.getName());
						}
					}
					this.setCell(offset, position, titCell);
				}
				else if (complementaryAxisEmpty)
				{
					this.m_fixedWidthOff = 1;
				}
			}
			buffer.clear();
			bufferDV.clear();
			position++;
		}
	}
};
oFF.FioriGrid.prototype.setDataCells = function()
{
	var readinessStates = this.m_resultSet.getInputReadinessStates();
	var dc = this.m_resultSet.getDataColumns();
	var dr = this.m_resultSet.getDataRows();
	var sb = oFF.XStringBuffer.create();
	for (var y = 0; y < dr; y++)
	{
		for (var x = 0; x < dc; x++)
		{
			var dataCell = this.m_resultSet.getDataCell(x, y);
			var cell;
			if (this.m_withDetails)
			{
				cell = oFF.FioriGridCell.create(this.getCellValueWithDetails(dataCell, readinessStates), oFF.FioriCellType.DATA);
			}
			else
			{
				cell = oFF.FioriGridCell.create(this.getCellValue(this.formatDataCellValue(dataCell), dataCell), oFF.FioriCellType.DATA);
			}
			sb.clear();
			this.appendPrefixValueSuffix(dataCell.getCurrencyUnit(), dataCell, sb);
			cell.setDisplayValue(sb.toString());
			cell.setAlertLevel(dataCell.getMaxAlertLevel().getName());
			cell.setInput(dataCell.isDataEntryEnabled());
			var rsDC = dataCell.getDataCell();
			if (oFF.notNull(rsDC))
			{
				sb.clear();
				var refStr = rsDC.getReferenceStructureElement1();
				if (oFF.notNull(refStr))
				{
					sb.append("mem-");
					sb.append(refStr.getFieldValue(refStr.getDimension().getDisplayKeyField()).getString());
					if (refStr.getFieldValue(refStr.getDimension().getDisplayKeyField()) !== null)
					{
						cell.setMember(refStr.getFieldValue(refStr.getDimension().getDisplayKeyField()).getString());
					}
					else
					{
						cell.setMember(refStr.getName());
					}
				}
				refStr = rsDC.getReferenceStructureElement2();
				if (oFF.notNull(refStr))
				{
					sb.append("-mem-");
					sb.append(refStr.getFieldValue(refStr.getDimension().getDisplayKeyField()).getString());
					if (refStr.getFieldValue(refStr.getDimension().getDisplayKeyField()) !== null)
					{
						cell.setMember2(refStr.getFieldValue(refStr.getDimension().getDisplayKeyField()).getString());
					}
					else
					{
						cell.setMember(refStr.getName());
					}
				}
				var s3 = dataCell.getDocumentId();
				if (oFF.XStringUtils.isNotNullAndNotEmpty(s3))
				{
					cell.setDataValueId(oFF.XStringUtils.concatenate3("docId", "-", s3));
				}
			}
			cell.setRow(y + this.m_fixedHeight - this.m_fixedHeightOff + this.m_offsetRows);
			cell.setColumn(x + this.m_fixedWidth - this.m_fixedWidthOff + this.m_offsetColumns);
			this.setCell(x + this.m_fixedWidth - this.m_fixedWidthOff, y + this.m_fixedHeight - this.m_fixedHeightOff, cell);
		}
	}
};
oFF.FioriGrid.prototype.formatDataCellValue = function(dataCell)
{
	return dataCell.getFormattedValue();
};
oFF.FioriGrid.prototype.getCellValueWithDetails = function(dataCell, readinessStates)
{
	var sb = oFF.XStringBuffer.create();
	var qDataCell = dataCell.getDataCell();
	if (oFF.notNull(qDataCell))
	{
		sb.append("(DataCell->").append(qDataCell.getName()).append(")");
	}
	var decimalPlaces = dataCell.getDecimalPlaces();
	if (decimalPlaces !== 0)
	{
		sb.append("(Decimal Places=").appendInt(decimalPlaces).append(")");
	}
	if (dataCell.isDataEntryEnabled())
	{
		sb.append("I:");
	}
	if (dataCell.isValueLocked())
	{
		sb.append("L:");
	}
	var currencyUnit = dataCell.getCurrencyUnit();
	this.appendPrefixValueSuffix(currencyUnit, dataCell, sb);
	this.appendValueException(dataCell, sb);
	this.appendAlertLevel(dataCell, sb);
	this.appendValueChanged(dataCell, sb);
	sb.append("|").append(dataCell.getValueType().getName());
	sb.append("|").append(dataCell.getFormatString());
	this.appendCurrencyUnit(currencyUnit, sb);
	this.appendInputReadiness(dataCell, readinessStates, sb);
	return sb.toString();
};
oFF.FioriGrid.prototype.appendPrefixValueSuffix = function(currencyUnit, dataCell, sb)
{
	if (oFF.notNull(currencyUnit) && oFF.XString.compare(this.m_suppress_unit, currencyUnit.getFormatted()) === 0)
	{
		sb.append(this.formatDataCellValue(dataCell));
	}
	else
	{
		if (oFF.notNull(currencyUnit) && currencyUnit.hasPrefix())
		{
			sb.append(currencyUnit.getPrefix()).append(" ");
		}
		sb.append(this.formatDataCellValue(dataCell));
		if (oFF.notNull(currencyUnit) && currencyUnit.hasSuffix())
		{
			sb.append(" ").append(currencyUnit.getSuffix());
		}
	}
};
oFF.FioriGrid.prototype.appendValueException = function(dataCell, sb)
{
	var valueException = dataCell.getValueException();
	if (valueException !== oFF.ValueException.NORMAL)
	{
		sb.append("|");
		if (oFF.isNull(valueException))
		{
			sb.append("<null>");
		}
		else
		{
			sb.append(valueException.getName());
		}
	}
};
oFF.FioriGrid.prototype.appendInputReadiness = function(dataCell, readinessStates, sb)
{
	var queryManager = dataCell.getQueryModel().getQueryManager();
	if (queryManager.supportsInputReadinessStates() && dataCell.getQueryModel().isDataEntryEnabled())
	{
		var inputReadinessState = dataCell.getInputReadinessState();
		if (oFF.notNull(inputReadinessState))
		{
			var readinessState = readinessStates.get(inputReadinessState.getIndex());
			var inputReadinessTypes = readinessState.getInputReadinessTypes();
			var types = oFF.XListOfString.create();
			for (var i = 0; i < inputReadinessTypes.size(); i++)
			{
				types.add(inputReadinessTypes.get(i).getShortcut());
			}
			sb.append("|S:").append(oFF.XCollectionUtils.join(types, ","));
		}
	}
};
oFF.FioriGrid.prototype.appendAlertLevel = function(dataCell, sb)
{
	var maxAlertLevel = dataCell.getMaxAlertLevel();
	if (maxAlertLevel !== oFF.AlertLevel.NORMAL)
	{
		sb.append("|[");
		sb.append(oFF.isNull(maxAlertLevel) ? "<null>" : maxAlertLevel.getName());
		sb.append("]");
	}
};
oFF.FioriGrid.prototype.appendValueChanged = function(dataCell, sb)
{
	if (dataCell.isValueChanged())
	{
		sb.append("|N:");
		var newValue = dataCell.getXValue();
		if (oFF.isNull(newValue))
		{
			sb.append("<null>");
		}
		else
		{
			sb.append(newValue.getValueType().getName());
			if (newValue.getValueType() === oFF.XValueType.STRING)
			{
				sb.append(" ").append(newValue.getString());
			}
		}
	}
	if (dataCell.isNewValueForced())
	{
		sb.append("|F:");
	}
};
oFF.FioriGrid.prototype.appendCurrencyUnit = function(currencyUnit, sb)
{
	if (oFF.notNull(currencyUnit) && !currencyUnit.isEmpty())
	{
		sb.append("|");
		if (currencyUnit.isMixed())
		{
			sb.append("M:");
		}
		else if (currencyUnit.hasUnit())
		{
			sb.append("U:");
		}
		else if (currencyUnit.hasCurrency())
		{
			sb.append("C:");
		}
		if (currencyUnit.hasFormatted())
		{
			sb.append(currencyUnit.getFormatted());
		}
		else
		{
			sb.append("<null>");
		}
	}
};
oFF.FioriGrid.prototype.getCellValue = function(formattedValue, dataCell)
{
	var valueException = dataCell.getValueException();
	if (valueException === oFF.ValueException.NULL_VALUE || valueException === oFF.ValueException.UNDEFINED)
	{
		return "";
	}
	var exceptionText = null;
	if (valueException !== oFF.ValueException.NORMAL && valueException !== oFF.ValueException.ZERO)
	{
		exceptionText = valueException.getName();
	}
	var alertLevelText = null;
	var maxAlertLevel = dataCell.getMaxAlertLevel();
	if (maxAlertLevel !== oFF.AlertLevel.NORMAL)
	{
		alertLevelText = maxAlertLevel.getName();
	}
	if (oFF.notNull(exceptionText) || oFF.notNull(alertLevelText))
	{
		var buffer = oFF.XStringBuffer.create();
		buffer.append(formattedValue);
		if (oFF.notNull(alertLevelText))
		{
			buffer.append(" [").append(alertLevelText).append("]");
		}
		if (oFF.notNull(exceptionText))
		{
			buffer.append(" [").append(exceptionText).append("]");
		}
		return buffer.toString();
	}
	return formattedValue;
};
oFF.FioriGrid.prototype.setHeaderCells = function(axis, tupleOffset)
{
	var rsDimensions = axis.getRsDimensions();
	var axisType = axis.getType();
	var tuplesCount = axis.getTuplesCount();
	var formattedValue = oFF.XStringBuffer.create();
	var displayValue = oFF.XStringBuffer.create();
	var isColAxis = axis.getType() === oFF.AxisType.COLUMNS;
	for (var tupleIndex = 0; tupleIndex < tuplesCount; tupleIndex++)
	{
		var tuple = axis.getTupleAt(tupleIndex);
		var position = 0;
		var tupleSize = tuple.size();
		for (var tupleElementIndex = 0; tupleElementIndex < tupleSize; tupleElementIndex++)
		{
			var rsDimension = rsDimensions.get(tupleElementIndex);
			var element = tuple.get(tupleElementIndex);
			var adjustDispLevel = isColAxis ? element.getDisplayLevel() : 0;
			var rsVisibleFields = rsDimension.getResultSetFields();
			var visibleFieldCount = rsVisibleFields.size();
			var dimensionMember = element.getDimensionMember();
			formattedValue.clear();
			var maxDispLevel = isColAxis && visibleFieldCount > 0 ? this.getMaxDisplayLevel(axis, rsDimension) : 0;
			if (isColAxis && visibleFieldCount > 0 && maxDispLevel > 0)
			{
				for (var fillIndex = 0; fillIndex <= maxDispLevel; ++fillIndex)
				{
					var fillCell = oFF.FioriGridCell.create("", oFF.FioriCellType.HEADER);
					fillCell.setDisplayValue("");
					var extName3 = this.m_resultSet.getQueryModel().getDimensionByName(rsDimension.getName()).getExternalName();
					if (oFF.notNull(extName3))
					{
						fillCell.setDimension(extName3);
					}
					else
					{
						fillCell.setDimension(rsDimension.getName());
					}
					if (dimensionMember.getName() !== null && rsDimension.isStructure() && dimensionMember.getDimension().getStructureMember(dimensionMember.getName()).getFieldValue(dimensionMember.getDimension().getDisplayKeyField()) !== null)
					{
						fillCell.setMember(dimensionMember.getDimension().getStructureMember(dimensionMember.getName()).getFieldValue(dimensionMember.getDimension().getDisplayKeyField()).getString());
					}
					else
					{
						fillCell.setMember(dimensionMember.getName());
					}
					fillCell.setRow(position + fillIndex);
					fillCell.setColumn(tupleIndex + tupleOffset);
					this.setCell(tupleIndex + tupleOffset, position + fillIndex, fillCell);
				}
			}
			for (var fieldIndex = 0; fieldIndex < visibleFieldCount; fieldIndex++)
			{
				var fieldValue = dimensionMember.getAllFieldValues().getByKey(rsVisibleFields.get(fieldIndex).getName());
				formattedValue.append(this.formatFieldValue(fieldValue));
				displayValue.append(this.formatFieldValue(fieldValue));
				if (fieldIndex === 0)
				{
					this.prependToFirstField(element, formattedValue);
					this.appendAlertLevelToValue(element, formattedValue);
				}
				var gridCell = oFF.FioriGridCell.create(formattedValue.toString(), oFF.FioriCellType.HEADER);
				if (!this.m_suppressRepetition || element.getFirstTuple() === tuple)
				{
					gridCell.setDisplayValue(displayValue.toString());
				}
				var extName5 = this.m_resultSet.getQueryModel().getDimensionByName(rsDimension.getName()).getExternalName();
				if (oFF.notNull(extName5))
				{
					gridCell.setDimension(extName5);
				}
				else
				{
					gridCell.setDimension(rsDimension.getName());
				}
				if (rsDimension.isStructure() && dimensionMember.getDimension().getStructureMember(dimensionMember.getName()).getFieldValue(dimensionMember.getDimension().getDisplayKeyField()) !== null)
				{
					gridCell.setMember(dimensionMember.getDimension().getStructureMember(dimensionMember.getName()).getFieldValue(dimensionMember.getDimension().getDisplayKeyField()).getString());
					var sM = gridCell.getMember();
					if (oFF.notNull(sM))
					{
						gridCell.setSemantic(this.m_semStyles.getByKey(sM));
					}
				}
				else
				{
					gridCell.setMember(dimensionMember.getName());
				}
				if (axis === this.m_resultSet.getRowsAxis())
				{
					gridCell.setRowTupleIndex(tupleIndex);
				}
				else
				{
					gridCell.setColumnTupleIndex(tupleIndex);
				}
				if (fieldIndex === 0 && element.getFirstTuple() === tuple)
				{
					gridCell.setDisplayLevel(isColAxis ? 0 : element.getDisplayLevel());
					var drillState = element.getDrillState();
					var icon = "";
					if (drillState === oFF.DrillState.EXPANDED || drillState === oFF.DrillState.DRILLED)
					{
						gridCell.setDrillState("Expanded");
						if (rsDimension.getLowerLevelNodeAlignment() === oFF.Alignment.CHILDREN_ABOVE_PARENT)
						{
							if (axisType === oFF.AxisType.ROWS)
							{
								icon = "sap-icon://slim-arrow-up";
							}
							else
							{
								icon = "sap-icon://slim-arrow-left";
							}
						}
						else
						{
							if (axisType === oFF.AxisType.ROWS)
							{
								icon = "sap-icon://slim-arrow-down";
							}
							else
							{
								icon = "sap-icon://slim-arrow-down";
							}
						}
					}
					else if (drillState === oFF.DrillState.COLLAPSED || drillState === oFF.DrillState.LEAF_UDH_EXPAND_ALLOWED)
					{
						gridCell.setDrillState("Collapsed");
						if (rsDimension.getLowerLevelNodeAlignment() === oFF.Alignment.CHILDREN_ABOVE_PARENT)
						{
							if (axisType === oFF.AxisType.ROWS)
							{
								icon = "sap-icon://slim-arrow-right";
							}
							else
							{
								icon = "sap-icon://slim-arrow-up";
							}
						}
						else
						{
							if (axisType === oFF.AxisType.ROWS)
							{
								icon = "sap-icon://slim-arrow-right";
							}
							else
							{
								icon = "sap-icon://slim-arrow-right";
							}
						}
					}
					else
					{
						gridCell.setDrillState("None");
						icon = "";
					}
					gridCell.setIcon(icon);
				}
				var sMember = gridCell.getMember();
				if (oFF.notNull(sMember) && this.m_semStyles.getByKey(sMember) !== null)
				{
					gridCell.setSemantic(this.m_semStyles.getByKey(sMember));
				}
				formattedValue.clear();
				displayValue.clear();
				this.addCell(axisType, position + adjustDispLevel, tupleIndex, tupleOffset, gridCell);
				position++;
			}
		}
	}
};
oFF.FioriGrid.prototype.formatFieldValue = function(fieldValue)
{
	if (oFF.isNull(fieldValue))
	{
		return "";
	}
	else
	{
		if (fieldValue.getValueType() === oFF.XValueType.DOUBLE)
		{
			var value = fieldValue.getDouble();
			return oFF.XNumberFormatter.formatDoubleToString(value, "#.0000");
		}
		else
		{
			return fieldValue.getFormattedValue();
		}
	}
};
oFF.FioriGrid.prototype.appendAlertLevelToValue = function(element, formattedValue)
{
	if (oFF.XStringUtils.isNotNullAndNotEmpty(element.getExceptionName()))
	{
		formattedValue.append(" [").appendInt(element.getAlertLevel()).append("]");
	}
};
oFF.FioriGrid.prototype.prependToFirstField = function(element, formattedValue)
{
	var displayLevel = element.getDisplayLevel();
	var drillState = element.getDrillState();
	if (displayLevel > 0 || drillState !== oFF.DrillState.LEAF)
	{
		var oldValue = formattedValue.toString();
		formattedValue.clear();
		for (var i = 0; i < displayLevel; i++)
		{
			formattedValue.append("  ");
		}
		if (drillState === oFF.DrillState.COLLAPSED || drillState === oFF.DrillState.LEAF_DRILLDOWN_ALLOWED || drillState === oFF.DrillState.LEAF_UDH_EXPAND_ALLOWED || drillState === oFF.DrillState.COLLAPSED_EXPAND_AND_DRILLDOWN_ALLOWED)
		{
			formattedValue.append("+ ");
		}
		else if (drillState === oFF.DrillState.EXPANDED || drillState === oFF.DrillState.DRILLED || drillState === oFF.DrillState.LEAF_UDH)
		{
			formattedValue.append("- ");
		}
		formattedValue.append(oldValue);
	}
};
oFF.FioriGrid.prototype.addCell = function(axisType, position, tupleIndex, tupleOffset, cell)
{
	if (axisType === oFF.AxisType.ROWS)
	{
		cell.setRow(tupleIndex + tupleOffset + this.m_offsetRows);
		cell.setColumn(position);
		this.setCell(position, tupleIndex + tupleOffset, cell);
	}
	else
	{
		cell.setRow(position);
		cell.setColumn(tupleIndex + tupleOffset + this.m_offsetColumns);
		this.setCell(tupleIndex + tupleOffset, position, cell);
	}
};
oFF.FioriGrid.prototype.setCell = function(x, y, cell)
{
	if (this.m_rowDefs.get(y).hasTotals() || this.m_colDefs.get(x).hasTotals())
	{
		cell.setIsTotal(true);
	}
	this.m_cells.setByIndices(x, y, cell);
};
oFF.FioriGrid.prototype.getColumnCount = function()
{
	return this.m_cells.size0();
};
oFF.FioriGrid.prototype.getRowCount = function()
{
	return this.m_cells.size1();
};
oFF.FioriGrid.prototype.getFixedColumnsCount = function()
{
	return this.m_fixedWidth;
};
oFF.FioriGrid.prototype.getFixedRowsCount = function()
{
	return this.m_fixedHeight;
};
oFF.FioriGrid.prototype.getColumnMaxCharacters = function(column, rowStart, maxRowCount)
{
	var max = 0;
	var totalRows = this.m_cells.size1();
	var rowCounter = 0;
	for (var row = rowStart; row < totalRows && (maxRowCount === -1 || rowCounter < maxRowCount); row++)
	{
		var cell = this.m_cells.getByIndices(column, row);
		if (oFF.notNull(cell))
		{
			max = oFF.XMath.max(cell.getCharacterCount(), max);
		}
		rowCounter++;
	}
	return max;
};
oFF.FioriGrid.prototype.getSimpleCell = function(column, row)
{
	return this.m_cells.getByIndices(column, row);
};
oFF.FioriGrid.prototype.setSuppressUnit = function(unit)
{
	this.m_suppress_unit = unit;
};
oFF.FioriGrid.prototype.addSemanticStyle = function(member, semantic)
{
	this.m_semStyles.put(member, semantic);
};
oFF.FioriGrid.prototype.exportToFireflyGrid = function(suppressRepetition)
{
	this.m_suppressRepetition = suppressRepetition;
	this.prepareCellStructure();
	var colCount = this.getColumnCount();
	var rowCount = this.getRowCount();
	var fixedRows = this.getFixedRowsCount();
	var fixedCols = this.getFixedColumnsCount();
	var layer1 = oFF.PrFactory.createStructure();
	layer1.putString("Type", "Grid");
	layer1.putString("ApplicationName", this.m_resultSet.getApplication().getApplicationName());
	layer1.putInteger("RowCount", rowCount);
	layer1.putInteger("ColCount", colCount);
	layer1.putInteger("FixedRows", fixedRows);
	layer1.putInteger("FixedColumns", fixedCols);
	var layer1Cells = layer1.putNewList("Cells");
	for (var y = 0; y < rowCount; y++)
	{
		for (var x = 0; x < colCount; x++)
		{
			var gridCell = this.getSimpleCell(x, y);
			if (oFF.notNull(gridCell))
			{
				var cell = layer1Cells.addNewStructure();
				cell.putString("Type", "Text");
				cell.putString("DisplayValue", gridCell.getDisplayValue());
				cell.putString("Value", gridCell.getText(-1));
				cell.putInteger("Row", gridCell.getRow());
				cell.putInteger("Column", gridCell.getColumn());
				cell.putString("DrillState", gridCell.getDrillState());
				cell.putString("DataValueId", gridCell.getDataValueId());
				cell.putInteger("DisplayLevel", gridCell.getDisplayLevel());
				cell.putInteger("RowTupleIndex", gridCell.getRowTupleIndex());
				cell.putInteger("ColumnTupleIndex", gridCell.getColumnTupleIndex());
				cell.putInteger("TupleIndex", gridCell.getRowTupleIndex() > 0 ? gridCell.getRowTupleIndex() : gridCell.getColumnTupleIndex());
				cell.putString("Icon", gridCell.getIcon());
				cell.putString("AlertLevel", gridCell.getAlertLevel());
				cell.putBoolean("Input", gridCell.getInput());
				if (gridCell.isTotals())
				{
					cell.putBoolean("Totals", true);
				}
				var cellType = gridCell.getCellType();
				if (cellType === oFF.FioriCellType.HEADER)
				{
					cell.putString("Semantic", "Header");
					cell.putString("Dimension", gridCell.getDimension());
					cell.putString("Member", gridCell.getMember());
					cell.putString("SemanticClass", gridCell.getSemantic());
				}
				else if (cellType === oFF.FioriCellType.TITLE)
				{
					cell.putString("Semantic", "Title");
					cell.putString("Dimension", gridCell.getDimension());
					if (gridCell.getDimensionOther() !== null)
					{
						cell.putString("DimensionOther", gridCell.getDimensionOther());
					}
				}
				else if (cellType === oFF.FioriCellType.DATA)
				{
					cell.putInteger("DataRow", y - fixedRows);
					cell.putInteger("DataColumn", x - fixedCols);
					cell.putString("Member", gridCell.getMember());
					cell.putString("Member2", gridCell.getMember2());
					cell.putString("Semantic", gridCell.isTotals() ? "Result" : "Standard");
				}
				else
				{
					cell.putString("Semantic", "Empty");
					cell.putString("GridPart", "Empty");
				}
			}
		}
	}
	return layer1;
};

oFF.FioriGridCell = function() {};
oFF.FioriGridCell.prototype = new oFF.XObject();
oFF.FioriGridCell.prototype._ff_c = "FioriGridCell";

oFF.FioriGridCell.create = function(content, cellType)
{
	var object = new oFF.FioriGridCell();
	object.setupExt(content, cellType);
	return object;
};
oFF.FioriGridCell.prototype.m_content = null;
oFF.FioriGridCell.prototype.m_isLeftAligned = false;
oFF.FioriGridCell.prototype.m_isTotal = false;
oFF.FioriGridCell.prototype.m_drillState = null;
oFF.FioriGridCell.prototype.m_displayLevel = 0;
oFF.FioriGridCell.prototype.m_displayValue = null;
oFF.FioriGridCell.prototype.m_cellType = null;
oFF.FioriGridCell.prototype.m_dataValueId = null;
oFF.FioriGridCell.prototype.m_oDimName = null;
oFF.FioriGridCell.prototype.m_isRep = false;
oFF.FioriGridCell.prototype.m_dimName = null;
oFF.FioriGridCell.prototype.m_memName = null;
oFF.FioriGridCell.prototype.m_memName2 = null;
oFF.FioriGridCell.prototype.m_rowIndex = 0;
oFF.FioriGridCell.prototype.m_colIndex = 0;
oFF.FioriGridCell.prototype.m_icon = null;
oFF.FioriGridCell.prototype.m_alertLevel = null;
oFF.FioriGridCell.prototype.m_input = false;
oFF.FioriGridCell.prototype.m_semantic = null;
oFF.FioriGridCell.prototype.m_row = 0;
oFF.FioriGridCell.prototype.m_col = 0;
oFF.FioriGridCell.prototype.setupExt = function(content, cellType)
{
	this.m_content = content;
	this.m_isLeftAligned = cellType !== oFF.FioriCellType.DATA;
	this.m_cellType = cellType;
};
oFF.FioriGridCell.prototype.releaseObject = function()
{
	this.m_content = null;
	this.m_cellType = null;
	oFF.XObject.prototype.releaseObject.call( this );
};
oFF.FioriGridCell.prototype.getCharacterCount = function()
{
	if (oFF.isNull(this.m_content))
	{
		return 0;
	}
	return oFF.XString.size(this.m_content);
};
oFF.FioriGridCell.prototype.isLeftAligned = function()
{
	return this.m_isLeftAligned;
};
oFF.FioriGridCell.prototype.getText = function(max)
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
oFF.FioriGridCell.prototype.getCellType = function()
{
	return this.m_cellType;
};
oFF.FioriGridCell.prototype.isTotals = function()
{
	return this.m_isTotal;
};
oFF.FioriGridCell.prototype.setIsTotal = function(isTotal)
{
	this.m_isTotal = isTotal;
};
oFF.FioriGridCell.prototype.setDisplayLevel = function(displayLevel)
{
	this.m_displayLevel = displayLevel;
};
oFF.FioriGridCell.prototype.setDrillState = function(drillState)
{
	this.m_drillState = drillState;
};
oFF.FioriGridCell.prototype.toString = function()
{
	if (oFF.isNull(this.m_content))
	{
		return "";
	}
	return this.m_content;
};
oFF.FioriGridCell.prototype.getDisplayLevel = function()
{
	return this.m_displayLevel;
};
oFF.FioriGridCell.prototype.getDrillState = function()
{
	return this.m_drillState;
};
oFF.FioriGridCell.prototype.setDisplayValue = function(displayValue)
{
	this.m_displayValue = displayValue;
};
oFF.FioriGridCell.prototype.getDisplayValue = function()
{
	return this.m_displayValue;
};
oFF.FioriGridCell.prototype.setDataValueId = function(dataValueId)
{
	this.m_dataValueId = dataValueId;
};
oFF.FioriGridCell.prototype.getDataValueId = function()
{
	return this.m_dataValueId;
};
oFF.FioriGridCell.prototype.getDimension = function()
{
	return this.m_dimName;
};
oFF.FioriGridCell.prototype.setDimension = function(value)
{
	this.m_dimName = value;
};
oFF.FioriGridCell.prototype.getMember = function()
{
	return this.m_memName;
};
oFF.FioriGridCell.prototype.setMember = function(value)
{
	this.m_memName = value;
};
oFF.FioriGridCell.prototype.getMember2 = function()
{
	return this.m_memName2;
};
oFF.FioriGridCell.prototype.setMember2 = function(value)
{
	this.m_memName2 = value;
};
oFF.FioriGridCell.prototype.getRowTupleIndex = function()
{
	return this.m_rowIndex;
};
oFF.FioriGridCell.prototype.setRowTupleIndex = function(index)
{
	this.m_rowIndex = index;
};
oFF.FioriGridCell.prototype.getColumnTupleIndex = function()
{
	return this.m_colIndex;
};
oFF.FioriGridCell.prototype.setColumnTupleIndex = function(index)
{
	this.m_colIndex = index;
};
oFF.FioriGridCell.prototype.getIcon = function()
{
	return this.m_icon;
};
oFF.FioriGridCell.prototype.setIcon = function(icon)
{
	this.m_icon = icon;
};
oFF.FioriGridCell.prototype.getAlertLevel = function()
{
	return this.m_alertLevel;
};
oFF.FioriGridCell.prototype.setAlertLevel = function(alertLevel)
{
	this.m_alertLevel = alertLevel;
};
oFF.FioriGridCell.prototype.getInput = function()
{
	return this.m_input;
};
oFF.FioriGridCell.prototype.setInput = function(bInput)
{
	this.m_input = bInput;
};
oFF.FioriGridCell.prototype.getColumn = function()
{
	return this.m_col;
};
oFF.FioriGridCell.prototype.setColumn = function(column)
{
	this.m_col = column;
};
oFF.FioriGridCell.prototype.getRow = function()
{
	return this.m_row;
};
oFF.FioriGridCell.prototype.setRow = function(row)
{
	this.m_row = row;
};
oFF.FioriGridCell.prototype.getDimensionOther = function()
{
	return this.m_oDimName;
};
oFF.FioriGridCell.prototype.setDimensionOther = function(value)
{
	this.m_oDimName = value;
};
oFF.FioriGridCell.prototype.getIsRepetition = function()
{
	return this.m_isRep;
};
oFF.FioriGridCell.prototype.setIsRepetition = function(value)
{
	this.m_isRep = value;
};
oFF.FioriGridCell.prototype.setSemantic = function(semantic)
{
	this.m_semantic = semantic;
};
oFF.FioriGridCell.prototype.getSemantic = function()
{
	return this.m_semantic;
};

oFF.FioriGridFactoryImpl = function() {};
oFF.FioriGridFactoryImpl.prototype = new oFF.XObject();
oFF.FioriGridFactoryImpl.prototype._ff_c = "FioriGridFactoryImpl";

oFF.FioriGridFactoryImpl.create = function()
{
	return new oFF.FioriGridFactoryImpl();
};
oFF.FioriGridFactoryImpl.prototype.createFioriGrid = function(resultSet)
{
	return oFF.FioriGrid.create(resultSet);
};

oFF.FioriLineDef = function() {};
oFF.FioriLineDef.prototype = new oFF.XObject();
oFF.FioriLineDef.prototype._ff_c = "FioriLineDef";

oFF.FioriLineDef.create = function()
{
	return new oFF.FioriLineDef();
};
oFF.FioriLineDef.prototype.m_hasTotals = false;
oFF.FioriLineDef.prototype.hasTotals = function()
{
	return this.m_hasTotals;
};
oFF.FioriLineDef.prototype.setHasTotals = function(hasTotals)
{
	this.m_hasTotals = hasTotals;
};
oFF.FioriLineDef.prototype.toString = function()
{
	return oFF.XStringBuffer.create().append("Totals:").appendBoolean(this.m_hasTotals).toString();
};

oFF.ReferenceGridFactoryImpl = function() {};
oFF.ReferenceGridFactoryImpl.prototype = new oFF.XObject();
oFF.ReferenceGridFactoryImpl.prototype._ff_c = "ReferenceGridFactoryImpl";

oFF.ReferenceGridFactoryImpl.create = function()
{
	return new oFF.ReferenceGridFactoryImpl();
};
oFF.ReferenceGridFactoryImpl.prototype.createReferenceGridSimple = function(resultSet)
{
	return oFF.ReferenceGrid.create(resultSet);
};
oFF.ReferenceGridFactoryImpl.prototype.createReferenceGridWithDetails = function(resultSet)
{
	return oFF.ReferenceGrid.createWithDetails(resultSet);
};
oFF.ReferenceGridFactoryImpl.prototype.createReferenceGrid = function(resultSet, withDetails)
{
	if (withDetails)
	{
		return this.createReferenceGridWithDetails(resultSet);
	}
	return this.createReferenceGridSimple(resultSet);
};
oFF.ReferenceGridFactoryImpl.prototype.createReferenceGridWithName = function(name, resultSet)
{
	if (oFF.notNull(name) && oFF.XString.endsWith(name, "_gen"))
	{
		return oFF.ReferenceGrid2.createWithName2(name, resultSet);
	}
	return oFF.ReferenceGrid.createWithName(name, resultSet);
};
oFF.ReferenceGridFactoryImpl.prototype.createReferenceGridWithNameAndDetails = function(name, resultSet)
{
	return oFF.ReferenceGrid.createWithNameAndDetails(name, resultSet);
};
oFF.ReferenceGridFactoryImpl.prototype.createForVizGrid = function(resultSet)
{
	return oFF.ReferenceGrid.createForVizGrid(resultSet);
};

oFF.KpiRendererFactoryImpl = function() {};
oFF.KpiRendererFactoryImpl.prototype = new oFF.XObject();
oFF.KpiRendererFactoryImpl.prototype._ff_c = "KpiRendererFactoryImpl";

oFF.KpiRendererFactoryImpl.create = function()
{
	return new oFF.KpiRendererFactoryImpl();
};
oFF.KpiRendererFactoryImpl.prototype.newRenderer = function(protocolType)
{
	return oFF.RsKpiRenderer.create();
};

oFF.RsKpiRenderer = function() {};
oFF.RsKpiRenderer.prototype = new oFF.XObject();
oFF.RsKpiRenderer.prototype._ff_c = "RsKpiRenderer";

oFF.RsKpiRenderer.create = function()
{
	return new oFF.RsKpiRenderer();
};
oFF.RsKpiRenderer.processMetricData = function(columnAxis, rs, vizDef)
{
	var theChartData = oFF.PrFactory.createStructure();
	var chartInfo = theChartData.putNewStructure(oFF.VizDefConstants.K_CHART);
	chartInfo.putString(oFF.VizDefConstants.K_TYPE, oFF.SapKpiConstants.K_METRIC);
	var sapCard = theChartData.putNewStructure(oFF.SapKpiConstants.K_SAP_CARD);
	sapCard.putString(oFF.VizDefConstants.K_TYPE, oFF.SapKpiConstants.K_ANALYTICAL);
	var header = sapCard.putNewStructure(oFF.SapKpiConstants.K_HEADER);
	header.putString(oFF.VizDefConstants.K_TYPE, oFF.SapKpiConstants.K_NUMERIC);
	header.putString(oFF.VizDefConstants.K_TITLE, vizDef.getStructureByKey(oFF.VizDefConstants.K_CHART).getStringByKey(oFF.VizDefConstants.K_TITLE));
	header.putString(oFF.VizDefConstants.K_SUB_TITLE, vizDef.getStructureByKey(oFF.VizDefConstants.K_CHART).getStringByKey(oFF.VizDefConstants.K_SUB_TITLE));
	var feedSelector = oFF.XListOfString.create();
	feedSelector.add(oFF.VizDefConstants.K_VALUE_AXIS);
	feedSelector.add(oFF.VizDefConstants.K_VALUE_AXIS2);
	feedSelector.add(oFF.VizDefConstants.K_THRESHOLD_REFERENCE);
	feedSelector.add(oFF.VizDefConstants.K_VARIANCE);
	var columnIndices = columnAxis.getIndicesByFeedOrder(feedSelector);
	var needProcessPrimary = columnAxis.hasTupleForFeed(oFF.VizDefConstants.K_VALUE_AXIS);
	var sideInds = header.putNewList(oFF.SapKpiConstants.K_SIDEINDICATORS);
	var mainInd = null;
	var state = "";
	var trend = "";
	for (var i = 0; i < columnIndices.size(); i++)
	{
		var ij = columnIndices.get(i).getInteger();
		var currentTuple = columnAxis.getTupleAt(ij);
		var currentMeasureName = currentTuple.getPrettyText(feedSelector);
		var dataCell1 = rs.getDataCell(ij, 0);
		if (needProcessPrimary && currentTuple.isSelectedByString(oFF.VizDefConstants.K_VALUE_AXIS))
		{
			header.putString(oFF.SapKpiConstants.K_UNIT_OF_MEASUREMENT, dataCell1.getCurrencyUnit().getFormatted());
			header.putString(oFF.VizDefConstants.K_SUB_TITLE, currentMeasureName);
			mainInd = header.putNewStructure(oFF.SapKpiConstants.K_MAININDICATOR);
			oFF.RsKpiRenderer.addIndicatorContent(currentTuple, dataCell1, mainInd);
			needProcessPrimary = false;
		}
		else if (currentTuple.isSelectedByString(oFF.VizDefConstants.K_VALUE_AXIS2))
		{
			var side = sideInds.addNewStructure();
			side.putString(oFF.VizDefConstants.K_TITLE, currentMeasureName);
			oFF.RsKpiRenderer.addIndicatorContent(currentTuple, dataCell1, side);
		}
		if (currentTuple.isSelectedByString(oFF.VizDefConstants.K_THRESHOLD_REFERENCE))
		{
			var val = oFF.XInteger.convertToString((dataCell1.getExceptionSettingPriorityByName(oFF.ExceptionSetting.ALERT_LEVEL.getName()).getInteger() - 1) / 3);
			if (oFF.RsKpiRenderer.getStateMap().containsKey(val))
			{
				state = oFF.RsKpiRenderer.getStateMap().getStringByKey(val);
			}
		}
		if (currentTuple.isSelectedByString(oFF.VizDefConstants.K_VARIANCE))
		{
			var doubleVal = dataCell1.getDouble();
			if (doubleVal !== 0)
			{
				trend = doubleVal > 0 ? oFF.SapKpiConstants.V_UP : oFF.SapKpiConstants.V_DOWN;
			}
		}
	}
	if (oFF.notNull(mainInd))
	{
		if (!oFF.XString.isEqual(state, ""))
		{
			mainInd.putString(oFF.SapKpiConstants.K_STATE, state);
		}
		if (!oFF.XString.isEqual(trend, ""))
		{
			mainInd.putString(oFF.SapKpiConstants.K_TREND, trend);
		}
	}
	return theChartData;
};
oFF.RsKpiRenderer.unitMap = null;
oFF.RsKpiRenderer.stateMap = null;
oFF.RsKpiRenderer.getStateMap = function()
{
	if (oFF.isNull(oFF.RsKpiRenderer.stateMap))
	{
		oFF.RsKpiRenderer.stateMap = oFF.PrFactory.createStructure();
		oFF.RsKpiRenderer.stateMap.putString("0", oFF.SapKpiConstants.V_GOOD);
		oFF.RsKpiRenderer.stateMap.putString("1", oFF.SapKpiConstants.V_CRITICAL);
		oFF.RsKpiRenderer.stateMap.putString("2", oFF.SapKpiConstants.V_ERROR);
	}
	return oFF.RsKpiRenderer.stateMap;
};
oFF.RsKpiRenderer.getUnitMap = function()
{
	if (oFF.isNull(oFF.RsKpiRenderer.unitMap))
	{
		oFF.RsKpiRenderer.unitMap = oFF.PrFactory.createStructure();
		oFF.RsKpiRenderer.unitMap.putString("-3", "K");
		oFF.RsKpiRenderer.unitMap.putString("-6", "M");
		oFF.RsKpiRenderer.unitMap.putString("-9", "B");
	}
	return oFF.RsKpiRenderer.unitMap;
};
oFF.RsKpiRenderer.addIndicatorContent = function(tuple, dataCell1, indicator)
{
	var unitMap = oFF.RsKpiRenderer.getUnitMap();
	var unit = "";
	var scaleFactor = oFF.XInteger.convertToString(tuple.getNumericShift());
	if (unitMap.containsKey(scaleFactor))
	{
		unit = unitMap.getStringByKey(scaleFactor);
	}
	var numberValue = oFF.XStringBuffer.create();
	numberValue.append(!dataCell1.getCurrencyUnit().isEmpty() ? dataCell1.getCurrencyUnit().getSuffix() : "");
	numberValue.append(tuple.getFormattedValue(dataCell1));
	indicator.putString(oFF.SapKpiConstants.K_UNIT, unit);
	indicator.putString(oFF.SapKpiConstants.K_NUMBER, numberValue.toString());
};
oFF.RsKpiRenderer.prototype.render = function(rs)
{
	var vizDef = rs.getQueryModel().getVizManager().getVizDef();
	var globalDef = rs.getQueryModel().getVizManager().getGlobalDef();
	if (oFF.notNull(vizDef) && vizDef.containsKey(oFF.VizDefConstants.K_CHART) && rs.getAvailableDataCellCount() > 0)
	{
		var chart = vizDef.getStructureByKey(oFF.VizDefConstants.K_CHART);
		if (oFF.XString.isEqual(chart.getStringByKey(oFF.VizDefConstants.K_TYPE), oFF.SapKpiConstants.K_METRIC))
		{
			var customFormatting = oFF.RsVizAxisExtractor.extractCustomFormatting(vizDef, globalDef);
			var feedMembers = vizDef.getStructureByKey("feedMembers");
			var columnTuples = oFF.RsVizAxisExtractor.getTuplesFromColumnAxis(rs, feedMembers, customFormatting);
			return oFF.RsKpiRenderer.processMetricData(columnTuples, rs, vizDef);
		}
	}
	return oFF.PrFactory.createStructure();
};

oFF.SapKpiConstants = {

	K_METRIC:"metric",
	K_SAP_CARD:"sap.card",
	K_ANALYTICAL:"Analytical",
	K_HEADER:"header",
	K_NUMERIC:"Numeric",
	K_SIDEINDICATORS:"sideIndicators",
	K_UNIT_OF_MEASUREMENT:"unitOfMeasurement",
	K_MAININDICATOR:"mainIndicator",
	K_UNIT:"unit",
	K_NUMBER:"number",
	K_THRESHOLDREFERENCE:"thresholdReference",
	K_VARIANCE:"variance",
	K_STATE:"state",
	K_TREND:"trend",
	K_FEEDMEMBERS:"feedMembers",
	K_GLOBALOBJECTS:"GlobalObjects",
	K_CALCULATIONS:"Calculations",
	V_GOOD:"Good",
	V_CRITICAL:"Critical",
	V_ERROR:"Error",
	V_CALCULATION:"calculation",
	V_UP:"Up",
	V_DOWN:"Down"
};

oFF.GoogleChartBar = function() {};
oFF.GoogleChartBar.prototype = new oFF.GoogleChart();
oFF.GoogleChartBar.prototype._ff_c = "GoogleChartBar";

oFF.GoogleChartBar.create = function()
{
	return new oFF.GoogleChartBar();
};
oFF.GoogleChartBar.prototype.getChartName = function()
{
	return "BarChart";
};
oFF.GoogleChartBar.prototype.addChartSpecificOptions = function(structure, vizDef)
{
	var vizDefChart = vizDef.getStructureByKey(oFF.VizDefConstants.K_CHART);
	var vdType = vizDefChart.getStringByKey(oFF.VizDefConstants.K_TYPE);
	structure.putBoolean(oFF.GoogleConstants.K_STACKED, oFF.XString.isEqual(vdType, oFF.VizDefConstants.V_STACKED_BAR));
	var bar = structure.putNewStructure(oFF.GoogleConstants.K_BAR);
	bar.putString(oFF.GoogleConstants.K_GROUP_WIDTH, "50%");
	this.setAxisStyle(structure.putNewStructure(oFF.GoogleConstants.K_VERTICAL_AXIS), vizDef, oFF.VizDefConstants.K_CATEGORY_AXIS, true);
	this.setAxisStyle(structure.putNewStructure(oFF.GoogleConstants.K_HORIZONTAL_AXIS), vizDef, oFF.VizDefConstants.K_VALUE_AXIS, false);
};

oFF.GoogleChartColumn = function() {};
oFF.GoogleChartColumn.prototype = new oFF.GoogleChart();
oFF.GoogleChartColumn.prototype._ff_c = "GoogleChartColumn";

oFF.GoogleChartColumn.create = function()
{
	return new oFF.GoogleChartColumn();
};
oFF.GoogleChartColumn.prototype.getChartName = function()
{
	return "ColumnChart";
};
oFF.GoogleChartColumn.prototype.addChartSpecificOptions = function(structure, vizDef)
{
	var vizDefChart = vizDef.getStructureByKey(oFF.VizDefConstants.K_CHART);
	var vdType = vizDefChart.getStringByKey(oFF.VizDefConstants.K_TYPE);
	structure.putBoolean(oFF.GoogleConstants.K_STACKED, oFF.XString.isEqual(vdType, oFF.VizDefConstants.V_STACKED_BAR));
	var bar = structure.putNewStructure(oFF.GoogleConstants.K_BAR);
	bar.putString(oFF.GoogleConstants.K_GROUP_WIDTH, "50%");
	this.setAxisStyle(structure.putNewStructure(oFF.GoogleConstants.K_VERTICAL_AXIS), vizDef, oFF.VizDefConstants.K_VALUE_AXIS, false);
	this.setAxisStyle(structure.putNewStructure(oFF.GoogleConstants.K_HORIZONTAL_AXIS), vizDef, oFF.VizDefConstants.K_CATEGORY_AXIS, true);
};

oFF.GoogleChartLine = function() {};
oFF.GoogleChartLine.prototype = new oFF.GoogleChart();
oFF.GoogleChartLine.prototype._ff_c = "GoogleChartLine";

oFF.GoogleChartLine.POINT_SIZE = 3;
oFF.GoogleChartLine.create = function()
{
	return new oFF.GoogleChartLine();
};
oFF.GoogleChartLine.prototype.getChartName = function()
{
	return "LineChart";
};
oFF.GoogleChartLine.prototype.addChartSpecificOptions = function(structure, vizDef)
{
	structure.putInteger(oFF.GoogleConstants.K_POINT_SIZE, oFF.GoogleChartLine.POINT_SIZE);
	this.setAxisStyle(structure.putNewStructure(oFF.GoogleConstants.K_VERTICAL_AXIS), vizDef, oFF.VizDefConstants.K_VALUE_AXIS, false);
	this.setAxisStyle(structure.putNewStructure(oFF.GoogleConstants.K_HORIZONTAL_AXIS), vizDef, oFF.VizDefConstants.K_CATEGORY_AXIS, true);
};

oFF.RsHiChartCovariationHelper = function() {};
oFF.RsHiChartCovariationHelper.prototype = new oFF.RsHiChartRenderHelper();
oFF.RsHiChartCovariationHelper.prototype._ff_c = "RsHiChartCovariationHelper";

oFF.RsHiChartCovariationHelper.prototype.m_xMeasures = null;
oFF.RsHiChartCovariationHelper.prototype.m_yMeasures = null;
oFF.RsHiChartCovariationHelper.prototype.m_zMeasures = null;
oFF.RsHiChartCovariationHelper.prototype.m_xColors = null;
oFF.RsHiChartCovariationHelper.prototype.m_yColors = null;
oFF.RsHiChartCovariationHelper.prototype.m_zColors = null;
oFF.RsHiChartCovariationHelper.prototype.m_xPatterns = null;
oFF.RsHiChartCovariationHelper.prototype.m_yPatterns = null;
oFF.RsHiChartCovariationHelper.prototype.m_zPatterns = null;
oFF.RsHiChartCovariationHelper.prototype.m_xList = null;
oFF.RsHiChartCovariationHelper.prototype.m_yList = null;
oFF.RsHiChartCovariationHelper.prototype.m_zList = null;
oFF.RsHiChartCovariationHelper.prototype.m_xListFormatted = null;
oFF.RsHiChartCovariationHelper.prototype.m_yListFormatted = null;
oFF.RsHiChartCovariationHelper.prototype.m_zListFormatted = null;
oFF.RsHiChartCovariationHelper.prototype.m_categoriesList = null;
oFF.RsHiChartCovariationHelper.prototype.m_categoryLabels = null;
oFF.RsHiChartCovariationHelper.prototype.m_tooltipValueMeasures = null;
oFF.RsHiChartCovariationHelper.prototype.m_tooltipList = null;
oFF.RsHiChartCovariationHelper.prototype.m_tooltipListFormatted = null;
oFF.RsHiChartCovariationHelper.prototype.m_colorList = null;
oFF.RsHiChartCovariationHelper.prototype.getColorList = function()
{
	return this.m_colorList;
};
oFF.RsHiChartCovariationHelper.prototype.getCategoriesList = function()
{
	return this.m_categoriesList;
};
oFF.RsHiChartCovariationHelper.prototype.getCategoryLabels = function()
{
	return this.m_categoryLabels;
};
oFF.RsHiChartCovariationHelper.prototype.getXMeasures = function()
{
	return this.m_xMeasures;
};
oFF.RsHiChartCovariationHelper.prototype.getYMeasures = function()
{
	return this.m_yMeasures;
};
oFF.RsHiChartCovariationHelper.prototype.getZMeasures = function()
{
	return this.m_zMeasures;
};
oFF.RsHiChartCovariationHelper.prototype.getXColors = function()
{
	return this.m_xColors;
};
oFF.RsHiChartCovariationHelper.prototype.getYColors = function()
{
	return this.m_yColors;
};
oFF.RsHiChartCovariationHelper.prototype.getZColors = function()
{
	return this.m_zColors;
};
oFF.RsHiChartCovariationHelper.prototype.getXPatterns = function()
{
	return this.m_xPatterns;
};
oFF.RsHiChartCovariationHelper.prototype.getYPatterns = function()
{
	return this.m_yPatterns;
};
oFF.RsHiChartCovariationHelper.prototype.getZPatterns = function()
{
	return this.m_zPatterns;
};
oFF.RsHiChartCovariationHelper.prototype.getXList = function()
{
	return this.m_xList;
};
oFF.RsHiChartCovariationHelper.prototype.getXListRemapped = function()
{
	if (oFF.XCollectionUtils.hasElements(this.m_xList))
	{
		return this.m_xList.getListAt(0);
	}
	return null;
};
oFF.RsHiChartCovariationHelper.prototype.getYListRemapped = function()
{
	if (oFF.XCollectionUtils.hasElements(this.m_yList))
	{
		return this.m_yList.getListAt(0);
	}
	return this.getXListRemapped();
};
oFF.RsHiChartCovariationHelper.prototype.getZListRemapped = function()
{
	if (oFF.XCollectionUtils.hasElements(this.m_zList))
	{
		return this.m_zList.getListAt(0);
	}
	return this.getYListRemapped();
};
oFF.RsHiChartCovariationHelper.prototype.getXListFormattedRemapped = function()
{
	if (oFF.XCollectionUtils.hasElements(this.m_xListFormatted))
	{
		return this.m_xListFormatted.getListAt(0);
	}
	return null;
};
oFF.RsHiChartCovariationHelper.prototype.getYListFormattedRemapped = function()
{
	if (oFF.XCollectionUtils.hasElements(this.m_yListFormatted))
	{
		return this.m_yListFormatted.getListAt(0);
	}
	return this.getXListFormattedRemapped();
};
oFF.RsHiChartCovariationHelper.prototype.getZListFormattedRemapped = function()
{
	if (oFF.XCollectionUtils.hasElements(this.m_zListFormatted))
	{
		return this.m_zListFormatted.getListAt(0);
	}
	return this.getYListFormattedRemapped();
};
oFF.RsHiChartCovariationHelper.prototype.getYList = function()
{
	return this.m_yList;
};
oFF.RsHiChartCovariationHelper.prototype.getZList = function()
{
	return this.m_zList;
};
oFF.RsHiChartCovariationHelper.prototype.getXListFormatted = function()
{
	return this.m_xListFormatted;
};
oFF.RsHiChartCovariationHelper.prototype.getYListFormatted = function()
{
	return this.m_yListFormatted;
};
oFF.RsHiChartCovariationHelper.prototype.getZListFormatted = function()
{
	return this.m_zListFormatted;
};
oFF.RsHiChartCovariationHelper.prototype.readResultSetData = function(columnAxis, rowAxis, rs)
{
	var theChartData = this.getChartData();
	var hideTotalOnRows = true;
	if (rs.getAvailableDataCellCount() > 0)
	{
		this.m_xMeasures = oFF.XListOfString.create();
		this.m_yMeasures = oFF.XListOfString.create();
		this.m_zMeasures = oFF.XListOfString.create();
		this.m_xPatterns = oFF.XListOfString.create();
		this.m_yPatterns = oFF.XListOfString.create();
		this.m_zPatterns = oFF.XListOfString.create();
		this.m_xColors = oFF.XListOfString.create();
		this.m_yColors = oFF.XListOfString.create();
		this.m_zColors = oFF.XListOfString.create();
		var colFeeds = oFF.XListOfString.create();
		if (oFF.XStringUtils.isNotNullAndNotEmpty(this.getXFeed()))
		{
			colFeeds.add(this.getXFeed());
		}
		if (oFF.XStringUtils.isNotNullAndNotEmpty(this.getYFeed()))
		{
			colFeeds.add(this.getYFeed());
		}
		if (oFF.XStringUtils.isNotNullAndNotEmpty(this.getZFeed()))
		{
			colFeeds.add(this.getZFeed());
		}
		this.m_tooltipValueMeasures = oFF.XListOfString.create();
		colFeeds.add(oFF.VizDefConstants.K_TOOLTIP_VALUE_AXIS);
		this.m_colorList = columnAxis.getPrettyNamesForFeed(true, !hideTotalOnRows, oFF.VizDefConstants.K_COLOR);
		this.m_categoriesList = rowAxis.getPrettyNames(true, !hideTotalOnRows);
		this.m_categoryLabels = rowAxis.getLabels(true, !hideTotalOnRows, true);
		if (!oFF.XCollectionUtils.hasElements(this.m_categoriesList))
		{
			this.m_categoriesList = oFF.XListOfString.create();
			this.m_categoriesList.add("");
		}
		this.m_xList = oFF.PrFactory.createList();
		this.m_yList = oFF.PrFactory.createList();
		this.m_zList = oFF.PrFactory.createList();
		this.m_tooltipList = oFF.PrFactory.createList();
		this.m_xListFormatted = oFF.PrFactory.createList();
		this.m_yListFormatted = oFF.PrFactory.createList();
		this.m_zListFormatted = oFF.PrFactory.createList();
		this.m_tooltipListFormatted = oFF.PrFactory.createList();
		var curList;
		var curListFormatted;
		var curFeed;
		var rowSelector = oFF.XListOfString.create();
		rowSelector.add(oFF.VizDefConstants.K_CATEGORY_AXIS);
		rowSelector.add(oFF.VizDefConstants.K_COLOR);
		var indices = columnAxis.getIndicesByFeedOrder(colFeeds);
		for (var ij = 0; ij < indices.size(); ij++)
		{
			var i = indices.get(ij).getInteger();
			var columnTuple = columnAxis.getTupleAt(i);
			if (columnTuple.isSelectedByString(this.getXFeed()))
			{
				var xTitle = columnTuple.getPrettyTextForFeed(this.getXFeed());
				if (!this.m_xMeasures.contains(xTitle))
				{
					this.m_xMeasures.add(xTitle);
					this.m_xPatterns.add(columnTuple.getPattern());
					this.m_xColors.add(columnTuple.getColor());
				}
				curList = this.m_xList.addNewList();
				curListFormatted = this.m_xListFormatted.addNewList();
				curFeed = this.getXFeed();
			}
			else if (this.getYFeed() !== null && columnTuple.isSelectedByString(this.getYFeed()))
			{
				var yTitle = columnTuple.getPrettyTextForFeed(this.getYFeed());
				if (!this.m_yMeasures.contains(yTitle))
				{
					this.m_yMeasures.add(yTitle);
					this.m_yPatterns.add(columnTuple.getPattern());
					this.m_yColors.add(columnTuple.getColor());
				}
				curList = this.m_yList.addNewList();
				curListFormatted = this.m_yListFormatted.addNewList();
				curFeed = this.getYFeed();
			}
			else if (this.getZFeed() !== null && columnTuple.isSelectedByString(this.getZFeed()))
			{
				var zTitle = columnTuple.getPrettyTextForFeed(this.getZFeed());
				if (!this.m_zMeasures.contains(zTitle))
				{
					this.m_zMeasures.add(zTitle);
					this.m_zPatterns.add(columnTuple.getPattern());
					this.m_zColors.add(columnTuple.getColor());
				}
				curList = this.m_zList.addNewList();
				curListFormatted = this.m_zListFormatted.addNewList();
				curFeed = this.getZFeed();
			}
			else if (columnTuple.isSelectedByString(oFF.VizDefConstants.K_TOOLTIP_VALUE_AXIS))
			{
				var tTitle = columnTuple.getPrettyTextForFeed(oFF.VizDefConstants.K_TOOLTIP_VALUE_AXIS);
				if (!this.m_tooltipValueMeasures.contains(tTitle))
				{
					this.m_tooltipValueMeasures.add(tTitle);
				}
				curList = this.m_tooltipList.addNewList();
				curListFormatted = this.m_tooltipListFormatted.addNewList();
				curFeed = "";
			}
			else
			{
				continue;
			}
			if (rowAxis.getTuplesCount() > 0)
			{
				for (var j = 0; j < rowAxis.getTuplesCount(); j++)
				{
					if (hideTotalOnRows && rowAxis.getTupleAt(j).isTotal())
					{
						continue;
					}
					this.addValueToList(rs, i, j, curList, curListFormatted, curFeed, columnAxis, columnTuple);
				}
			}
			else
			{
				this.addValueToList(rs, i, 0, curList, curListFormatted, curFeed, columnAxis, columnTuple);
			}
		}
		var tooltipBuffer = oFF.XStringBuffer.create();
		tooltipBuffer.append("<b>{series.name}</b><br/>");
		this.decorateToolTip(tooltipBuffer);
		for (var ti = 0; ti < this.m_tooltipListFormatted.size(); ti++)
		{
			tooltipBuffer.append("<b>{point.tHeader");
			tooltipBuffer.append(oFF.XInteger.convertToString(ti));
			tooltipBuffer.append("}</b>  {point.tFormatted");
			tooltipBuffer.append(oFF.XInteger.convertToString(ti));
			tooltipBuffer.append("}<br/>");
		}
		tooltipBuffer.append("{point.errorRange}");
		var ttStruct = theChartData.putNewStructure(oFF.VizDefConstants.K_TOOLTIP);
		ttStruct.putString(oFF.VizDefConstants.K_POINT_FORMAT, tooltipBuffer.toString());
		ttStruct.putString(oFF.VizDefConstants.K_HEADER_FORMAT, "");
	}
	this.setShowLegend(this.getXList().size() > 1);
};
oFF.RsHiChartCovariationHelper.prototype.decorateToolTip = function(stringBuffer) {};
oFF.RsHiChartCovariationHelper.prototype.addValueToList = function(rs, i, j, curList, curListFormatted, curFeed, columnAxis, columnTuple)
{
	var dataCellS = rs.getDataCell(i, j);
	var valueTypeS = dataCellS.getValueType();
	if (valueTypeS === oFF.XValueType.DOUBLE || valueTypeS === oFF.XValueType.DECIMAL_FLOAT)
	{
		if (dataCellS.getXValue() === null)
		{
			curList.addDouble(0);
		}
		else
		{
			curList.addDouble(dataCellS.getDouble());
		}
		var formattedValue = columnAxis.getFormattedValue(curFeed, columnTuple, dataCellS);
		curListFormatted.addString(formattedValue);
	}
};
oFF.RsHiChartCovariationHelper.prototype.addToolTipsToSeries = function(newStructure, xOffset, rowIndex)
{
	if (oFF.XCollectionUtils.hasElements(this.m_tooltipValueMeasures))
	{
		var tsize = this.m_tooltipValueMeasures.size();
		for (var j = 0; j < tsize; j++)
		{
			newStructure.putString(oFF.XStringUtils.concatenate2(oFF.VizDefConstants.K_T_HEADER, oFF.XInteger.convertToString(j)), this.m_tooltipValueMeasures.get(j));
			newStructure.putString(oFF.XStringUtils.concatenate2(oFF.VizDefConstants.K_T_FORMATTED, oFF.XInteger.convertToString(j)), this.m_tooltipListFormatted.getListAt(xOffset * tsize + j).getStringAt(rowIndex));
		}
	}
};

oFF.RsHiChartHeatmapHelper = function() {};
oFF.RsHiChartHeatmapHelper.prototype = new oFF.RsHiChartRenderHelper();
oFF.RsHiChartHeatmapHelper.prototype._ff_c = "RsHiChartHeatmapHelper";

oFF.RsHiChartHeatmapHelper.prototype.isShowLegend = function()
{
	return false;
};
oFF.RsHiChartHeatmapHelper.prototype.prepareRendering = function() {};
oFF.RsHiChartHeatmapHelper.prototype.readResultSetData = function(columnAxis, rowAxis, rs)
{
	var theChartData = this.getChartData();
	var listOfDoubles = oFF.XList.create();
	var chartlang = theChartData.putNewStructure(oFF.VizDefConstants.K_LANG);
	if (rs.getAvailableDataCellCount() > 0)
	{
		var hideTotalOnRows = true;
		var xAxis = theChartData.putNewList(oFF.VizDefConstants.K_X_AXIS);
		var yAxis = theChartData.putNewList(oFF.VizDefConstants.K_Y_AXIS);
		var xAxisStruct = xAxis.addNewStructure();
		var yAxisStruct = yAxis.addNewStructure();
		var yDList = yAxisStruct.putNewList(oFF.VizDefConstants.K_CATEGORIES);
		var xDList = xAxisStruct.putNewList(oFF.VizDefConstants.K_CATEGORIES);
		var seriesList = theChartData.putNewList(oFF.VizDefConstants.K_SERIES);
		var seriesListStructure = seriesList.addNewStructure();
		var dataLabels = seriesListStructure.putNewStructure(oFF.VizDefConstants.K_DATA_LABELS);
		dataLabels.putString(oFF.VizDefConstants.K_POINT_FORMAT, "{point.valueFormatted}");
		var dataLayerList = seriesListStructure.putNewList(oFF.VizDefConstants.K_DATA);
		var tooltipBuffer = oFF.XStringBuffer.create();
		var columnSelectors = oFF.XListOfString.create();
		columnSelectors.add(oFF.VizDefConstants.K_COLOR);
		var colorList = oFF.XListOfString.create();
		tooltipBuffer.append("<b>{point.xCategory} / {point.yCategory}</b><br/><b>{point.series.name}</b>:  {point.valueFormatted}<br/>");
		var columnIterator = columnAxis.getPrettyNamesForFeed(true, !hideTotalOnRows, oFF.VizDefConstants.K_CATEGORY_AXIS2).getIterator();
		while (columnIterator.hasNext())
		{
			xDList.addString(columnIterator.next());
		}
		var straightOrdering = oFF.XCollectionUtils.hasElements(xDList) && xDList.size() > 1;
		var rowIterator = rowAxis.getPrettyNamesForFeed(true, !hideTotalOnRows, oFF.VizDefConstants.K_CATEGORY_AXIS).getIterator();
		var tooltipHeaders = columnAxis.getPrettyNamesForFeed(true, false, oFF.VizDefConstants.K_TOOLTIP_VALUE_AXIS);
		for (var h = 0; h < tooltipHeaders.size(); h++)
		{
			tooltipBuffer.append("<b>{point.tHeader");
			tooltipBuffer.append(oFF.XInteger.convertToString(h));
			tooltipBuffer.append("}</b>:  {point.tFormatted");
			tooltipBuffer.append(oFF.XInteger.convertToString(h));
			tooltipBuffer.append("}<br/>");
		}
		while (rowIterator.hasNext())
		{
			yDList.addString(rowIterator.next());
		}
		if (xDList.isEmpty())
		{
			xDList.addString("");
		}
		if (yDList.isEmpty())
		{
			yDList.addString("");
		}
		var ii = 0;
		var indices = columnAxis.getIndicesByFeedOrder(columnSelectors);
		for (var ij = 0; ij < indices.size(); ij++)
		{
			var i = indices.get(ij).getInteger();
			var columnTuple = columnAxis.getTupleAt(i);
			if (!columnTuple.isSelectedByString(oFF.VizDefConstants.K_COLOR))
			{
				continue;
			}
			if (hideTotalOnRows && columnAxis.getTupleAt(i).isTotal())
			{
				continue;
			}
			colorList.add(columnTuple.getPrettyTextForFeed(oFF.VizDefConstants.K_COLOR));
			var memberNames = columnTuple.getMemberKeys();
			var tooltipIndices = null;
			var tooltipValues = null;
			if (oFF.XCollectionUtils.hasElements(memberNames))
			{
				tooltipIndices = columnAxis.getMatchingTupleIndicesForMemberNameAndFeed(memberNames, oFF.VizDefConstants.K_TOOLTIP_VALUE_AXIS);
			}
			var jj = 0;
			for (var j = 0; j < rowAxis.getTuplesCount(); j++)
			{
				if (!rowAxis.getTupleAt(j).isSelectedByString(oFF.VizDefConstants.K_CATEGORY_AXIS))
				{
					continue;
				}
				if (oFF.XCollectionUtils.hasElements(tooltipIndices))
				{
					tooltipValues = oFF.XListOfString.create();
					for (var ttindex = 0; ttindex < tooltipIndices.size(); ttindex++)
					{
						var tooltipIndex = tooltipIndices.get(ttindex).getInteger();
						tooltipValues.add(columnAxis.getFormattedValue(oFF.VizDefConstants.K_COLOR, columnAxis.getTupleAt(tooltipIndex), rs.getDataCell(tooltipIndex, j)));
					}
				}
				var dataCell1 = rs.getDataCell(i, j);
				var dataList = oFF.PrFactory.createStructure();
				var xValue = dataCell1.getXValue();
				if (!hideTotalOnRows || !rowAxis.getTupleAt(j).isTotal())
				{
					if (oFF.notNull(xValue))
					{
						dataList.putInteger(oFF.VizDefConstants.K_X, straightOrdering ? ii : jj);
						dataList.putInteger(oFF.VizDefConstants.K_Y, straightOrdering ? jj : ii);
						dataList.putDouble(oFF.VizDefConstants.K_VALUE, dataCell1.getDouble());
						dataList.putString(oFF.VizDefConstants.K_VALUE_FORMATTED, dataCell1.getFormattedValue());
						dataList.putString(oFF.VizDefConstants.K_X_CATEGORY, oFF.XCollectionUtils.hasElements(xDList) && ii < xDList.size() ? xDList.getStringAt(ii) : "");
						dataList.putString(oFF.VizDefConstants.K_Y_CATEGORY, oFF.XCollectionUtils.hasElements(yDList) && jj < yDList.size() ? yDList.getStringAt(jj) : "");
						if (oFF.XCollectionUtils.hasElements(tooltipHeaders))
						{
							for (var th = 0; th < tooltipHeaders.size(); th++)
							{
								dataList.putString(oFF.XStringUtils.concatenate2(oFF.VizDefConstants.K_T_HEADER, oFF.XInteger.convertToString(th)), tooltipHeaders.get(th));
							}
						}
						if (oFF.XCollectionUtils.hasElements(tooltipValues))
						{
							for (var tv = 0; tv < tooltipValues.size(); tv++)
							{
								dataList.putString(oFF.XStringUtils.concatenate2(oFF.VizDefConstants.K_T_FORMATTED, oFF.XInteger.convertToString(tv)), tooltipValues.get(tv));
							}
						}
						dataLayerList.add(dataList);
						listOfDoubles.add(oFF.XDoubleValue.create(dataCell1.getDouble()));
					}
				}
				jj++;
			}
			ii++;
		}
		if (!straightOrdering)
		{
			yAxisStruct.put(oFF.VizDefConstants.K_CATEGORIES, xDList);
			xAxisStruct.put(oFF.VizDefConstants.K_CATEGORIES, yDList);
		}
		if (oFF.XCollectionUtils.hasElements(colorList))
		{
			seriesListStructure.putString(oFF.VizDefConstants.K_NAME, colorList.get(0));
		}
		var maxelement = oFF.XDoubleValue.create(1);
		if (listOfDoubles.size() > 1)
		{
			listOfDoubles.sortByComparator(new oFF.XComparatorDouble());
			maxelement = listOfDoubles.get(listOfDoubles.size() - 1);
		}
		seriesListStructure.putInteger(oFF.VizDefConstants.K_BORDER_WIDTH, 2);
		seriesListStructure.putString(oFF.VizDefConstants.K_BORDER_COLOR, "white");
		theChartData.putDouble(oFF.VizDefConstants.K_MIN_ELEMENT, listOfDoubles.get(0).getDouble());
		theChartData.putDouble(oFF.VizDefConstants.K_MAX_ELEMENT, maxelement.getDouble());
		var tooltip = theChartData.putNewStructure(oFF.VizDefConstants.K_TOOLTIP);
		tooltip.putString(oFF.VizDefConstants.K_POINT_FORMAT, tooltipBuffer.toString());
		tooltip.putString(oFF.VizDefConstants.K_HEADER_FORMAT, "");
		oFF.RsHiChartVizUtilsHeatmap.rendrerHeatmap(theChartData, this.getChartType(), this.getVizDef(), this.getGlobalDef());
	}
	else
	{
		theChartData.putBoolean(oFF.VizDefConstants.K_FULL_SCREEN_ENABLED, false);
		chartlang.putString(oFF.VizDefConstants.K_NO_DATA, "FireFly Resultset is empty.");
	}
};
oFF.RsHiChartHeatmapHelper.prototype.finishRendering = function()
{
	oFF.RsHiChartVizUtilsHeatmap.rendrerHeatmap(this.getChartData(), this.getChartType(), this.getVizDef(), this.getGlobalDef());
};

oFF.RsHiChartSeriesHelper = function() {};
oFF.RsHiChartSeriesHelper.prototype = new oFF.RsHiChartRenderHelper();
oFF.RsHiChartSeriesHelper.prototype._ff_c = "RsHiChartSeriesHelper";

oFF.RsHiChartSeriesHelper.prototype.getChartWidth = function()
{
	return this.m_chartWidth;
};
oFF.RsHiChartSeriesHelper.prototype.setChartWidth = function(chartWidth)
{
	this.m_chartWidth = chartWidth;
};
oFF.RsHiChartSeriesHelper.prototype.m_hasVariance = false;
oFF.RsHiChartSeriesHelper.prototype.m_widthScale = 0;
oFF.RsHiChartSeriesHelper.prototype.m_chartWidth = 0;
oFF.RsHiChartSeriesHelper.prototype.isTimeseries = function()
{
	return false;
};
oFF.RsHiChartSeriesHelper.prototype.isCombinationChart = function()
{
	return oFF.XStringUtils.isNotNullAndNotEmpty(this.getSecondChart());
};
oFF.RsHiChartSeriesHelper.prototype.reiterateResultSet = function(columnAxis, rowAxis, rs)
{
	var theChartData = this.getChartData();
	var hasValueAxis2 = columnAxis.hasTupleForFeed(oFF.VizDefConstants.K_VALUE_AXIS2);
	var yAxisList = theChartData.putNewList(oFF.VizDefConstants.K_Y_AXIS);
	var yAxis = yAxisList.addNewStructure();
	var xAxis;
	var xAxisStruct;
	var plotOptions = oFF.PrFactory.createStructure();
	plotOptions = theChartData.getStructureByKey(oFF.VizDefConstants.K_PLOT_OPTIONS);
	var fillColor = oFF.VizDefConstants.K_TRANSPARENT;
	if (theChartData.getListByKey(oFF.VizDefConstants.K_COLORS) !== null)
	{
		if (theChartData.getListByKey(oFF.VizDefConstants.K_COLORS).size() > 0)
		{
			fillColor = theChartData.getListByKey(oFF.VizDefConstants.K_COLORS).getStringAt(0);
		}
	}
	if (oFF.isNull(plotOptions))
	{
		plotOptions = theChartData.putNewStructure(oFF.VizDefConstants.K_PLOT_OPTIONS);
	}
	var series = theChartData.getListByKey(oFF.VizDefConstants.K_SERIES);
	var seriesType = null;
	var errorBarIndex = 0;
	if (this.isTimeseries())
	{
		xAxis = theChartData.putNewList(oFF.VizDefConstants.K_X_AXIS);
		xAxisStruct = xAxis.addNewStructure();
		xAxisStruct.putString(oFF.VizDefConstants.K_TYPE, oFF.VizDefConstants.K_DATE_TIME);
	}
	else
	{
		xAxis = theChartData.getListByKey(oFF.VizDefConstants.K_X_AXIS);
		if (oFF.isNull(xAxis))
		{
			xAxis = theChartData.putNewList(oFF.VizDefConstants.K_X_AXIS);
		}
		xAxisStruct = xAxis.getStructureAt(0);
		if (oFF.isNull(xAxisStruct))
		{
			xAxisStruct = xAxis.addNewStructure();
		}
	}
	var yAxis1 = null;
	if (hasValueAxis2)
	{
		yAxis1 = yAxisList.addNewStructure();
		oFF.RsHiChartVizUtilsSimple.plotOptionChart(yAxis1, this.getSecondChart(), null, plotOptions, 1, fillColor);
		yAxis1.putBoolean(oFF.VizDefConstants.K_OPPOSITE, true);
		if (this.isHasVariance())
		{
			if (this.isInverted())
			{
				yAxis1.putString(oFF.VizDefConstants.K_WIDTH, "50%");
			}
			else
			{
				yAxis1.putString(oFF.VizDefConstants.K_WIDTH, "50%");
				yAxis.putString(oFF.VizDefConstants.V_POSITION_TOP, "50%");
			}
		}
		oFF.RsHiChartVizUtilsSimple.dataLabelAlignment(yAxis1, this.getSecondChart(), columnAxis.getDecimalPlaces(oFF.VizDefConstants.K_VALUE_AXIS2), false);
	}
	var seriesStruct;
	var seriesStructPrevious;
	var hasErrorBar = false;
	var vizProp = null;
	if (this.getVizDef() !== null)
	{
		vizProp = this.getVizDef().getStructureByKey(oFF.VizDefConstants.K_CHART).getStructureByKey(oFF.VizDefConstants.K_PROPERTIES);
		if (oFF.notNull(vizProp))
		{
			var vizPropCategoryAxis = vizProp.getStructureByKey(oFF.VizDefConstants.K_CATEGORY_AXIS);
			if (oFF.notNull(vizPropCategoryAxis) && !this.isPolar())
			{
				xAxisStruct = oFF.RsHiChartUtils.axisPloter(vizPropCategoryAxis, xAxisStruct, this.getChartType(), true);
			}
			var vizPropValueAxis = vizProp.getStructureByKey(oFF.VizDefConstants.K_VALUE_AXIS);
			if (oFF.notNull(vizPropValueAxis) && !this.isPolar())
			{
				yAxis = oFF.RsHiChartUtils.axisPloter(vizPropValueAxis, yAxis, this.getChartType(), false);
			}
			oFF.RsHiChartVizUtilsSimple.addReferenceLine(this.getVizDef(), yAxis, yAxis1, columnAxis, rowAxis, rs);
		}
	}
	if (this.isHasVariance())
	{
		var yAxis2 = yAxisList.addNewStructure();
		if (this.isInverted())
		{
			yAxis.putString(oFF.VizDefConstants.K_WIDTH, "50%");
			yAxis2.putString(oFF.VizDefConstants.K_WIDTH, "50%");
			yAxis2.putString(oFF.VizDefConstants.V_LEFT, "50%");
		}
		else
		{
			yAxis.putString(oFF.VizDefConstants.K_HEIGHT, "50%");
			yAxis2.putString(oFF.VizDefConstants.K_HEIGHT, "50%");
			yAxis.putString(oFF.VizDefConstants.V_POSITION_TOP, "50%");
		}
		if (oFF.notNull(vizProp))
		{
			var valAxis = vizProp.getStructureByKey(oFF.VizDefConstants.K_VALUE_AXIS);
			if (oFF.notNull(valAxis))
			{
				oFF.RsHiChartUtils.axisPloter(valAxis, yAxis2, this.getChartType(), false);
			}
		}
		oFF.RsHiChartVizUtilsSimple.plotOptionChart(yAxis2, this.getChartType(), null, plotOptions, this.isCombinationChart() ? 2 : 1, fillColor);
	}
	oFF.RsHiChartVizUtilsSimple.legendStyler(theChartData);
	if (hasErrorBar)
	{
		for (var z = 0; z < series.size(); z++)
		{
			oFF.RsHiChartVizUtilsSimple.plotOptionChart(yAxis, this.getChartType(), this.getStackingType(), plotOptions, 0, fillColor);
			seriesStruct = series.getStructureAt(z);
			seriesType = seriesStruct.getStringByKey(oFF.VizDefConstants.K_TYPE);
			if (oFF.XString.isEqual(seriesType, oFF.VizDefConstants.K_ERRORBAR))
			{
				errorBarIndex = z;
				seriesStructPrevious = series.getStructureAt(errorBarIndex - 1);
				var dataLabelsSeriesStruct = seriesStruct.putNewStructure(oFF.VizDefConstants.K_DATA_LABELS);
				dataLabelsSeriesStruct.putBoolean(oFF.VizDefConstants.K_ENABLED, true);
				var dataLabelsSeriesStructStyle = dataLabelsSeriesStruct.putNewStructure(oFF.VizDefConstants.K_STYLE);
				dataLabelsSeriesStructStyle.putString(oFF.VizDefConstants.K_FILL, "black");
				dataLabelsSeriesStructStyle.putString(oFF.VizDefConstants.K_COLOR, "black");
				var dataLabelsSeriesStructPrevious = seriesStructPrevious.putNewStructure(oFF.VizDefConstants.K_DATA_LABELS);
				dataLabelsSeriesStructPrevious.putBoolean(oFF.VizDefConstants.K_ENABLED, false);
			}
		}
	}
	else
	{
		oFF.RsHiChartVizUtilsSimple.plotOptionChart(yAxis, this.getChartType(), this.getStackingType(), plotOptions, 0, fillColor);
	}
	var showStackingLabels = oFF.XStringUtils.isNullOrEmpty(this.getSecondChart()) && oFF.XString.isEqual(oFF.VizDefConstants.V_NORMAL, this.getStackingType()) && (oFF.XString.isEqual(this.getChartType(), oFF.VizDefConstants.V_CHART_TYPE_BAR) || oFF.XString.isEqual(this.getChartType(), oFF.VizDefConstants.V_CHART_TYPE_COLUMN));
	oFF.RsHiChartVizUtilsSimple.dataLabelAlignment(yAxis, this.getChartType(), columnAxis.getDecimalPlaces(oFF.VizDefConstants.K_VALUE_AXIS), showStackingLabels);
	var isLine = oFF.XString.isEqual(oFF.VizDefConstants.K_LINE, this.getChartType());
	var isArea = oFF.XString.isEqual(oFF.VizDefConstants.K_AREA, this.getChartType());
	if (!this.isPolar() && !this.isTimeseries() && !isLine && !isArea)
	{
		if (this.getChartWidth() > 3 && this.getChartWidth() * this.getWidthScale() > 20)
		{
			var scrollbaronxAxis = xAxisStruct.putNewStructure(oFF.VizDefConstants.K_SCROLL_BAR);
			scrollbaronxAxis.putBoolean(oFF.VizDefConstants.K_SHOW_FULL, false);
			scrollbaronxAxis.putBoolean(oFF.VizDefConstants.K_ENABLED, true);
			xAxisStruct.putInteger(oFF.VizDefConstants.K_MIN, 0);
			xAxisStruct.putInteger(oFF.VizDefConstants.K_MAX, oFF.XMath.max(1, oFF.XMath.div(oFF.XMath.min(13, this.getChartWidth()), oFF.XMath.max(1, this.getWidthScale()))));
		}
	}
	var isBar = oFF.XString.isEqual(oFF.VizDefConstants.V_CHART_TYPE_BAR, this.getChartType());
	if (isBar)
	{
		var plotLines = yAxis.containsKey(oFF.VizDefConstants.K_PLOT_LINES) ? yAxis.getListByKey(oFF.VizDefConstants.K_PLOT_LINES) : yAxis.putNewList(oFF.VizDefConstants.K_PLOT_LINES);
		var plotLinepProp = plotLines.addNewStructure();
		plotLinepProp.putString(oFF.VizDefConstants.K_COLOR, oFF.VizDefConstants.V_BLACK);
		plotLinepProp.putInteger(oFF.VizDefConstants.K_WIDTH, 2);
		plotLinepProp.putInteger(oFF.VizDefConstants.K_VALUE, 0);
		plotLinepProp.putString(oFF.VizDefConstants.K_ID, oFF.VizDefConstants.V_BASE_PLOTLINE_ID);
		plotLinepProp.putInteger(oFF.VizDefConstants.K_Z_INDEX, 6);
	}
};
oFF.RsHiChartSeriesHelper.prototype.getWidthScale = function()
{
	return this.m_widthScale;
};
oFF.RsHiChartSeriesHelper.prototype.setWidthScale = function(widthScale)
{
	this.m_widthScale = widthScale;
};
oFF.RsHiChartSeriesHelper.prototype.isHasVariance = function()
{
	return this.m_hasVariance;
};
oFF.RsHiChartSeriesHelper.prototype.setHasVariance = function(hasVariance)
{
	this.m_hasVariance = hasVariance;
};

oFF.RsHiChartUnsupportedHelper = function() {};
oFF.RsHiChartUnsupportedHelper.prototype = new oFF.RsHiChartRenderHelper();
oFF.RsHiChartUnsupportedHelper.prototype._ff_c = "RsHiChartUnsupportedHelper";

oFF.RsHiChartUnsupportedHelper.prototype.prepareRendering = function() {};
oFF.RsHiChartUnsupportedHelper.prototype.isUnsupported = function()
{
	return true;
};
oFF.RsHiChartUnsupportedHelper.prototype.readResultSetData = function(columnAxis, rowAxis, rs) {};
oFF.RsHiChartUnsupportedHelper.prototype.finishRendering = function() {};

oFF.ReferenceGrid = function() {};
oFF.ReferenceGrid.prototype = new oFF.XObject();
oFF.ReferenceGrid.prototype._ff_c = "ReferenceGrid";

oFF.ReferenceGrid.MAGIC_CELL_DIV = "/";
oFF.ReferenceGrid.create = function(resultSet)
{
	var grid = new oFF.ReferenceGrid();
	grid.setupSimpleGrid(resultSet, false, false);
	return grid;
};
oFF.ReferenceGrid.createWithDetails = function(resultSet)
{
	var grid = new oFF.ReferenceGrid();
	grid.setupSimpleGrid(resultSet, true, false);
	return grid;
};
oFF.ReferenceGrid.createWithName = function(gridName, resultSet)
{
	var grid = new oFF.ReferenceGrid();
	grid.setupSimpleGrid(resultSet, false, false);
	return grid;
};
oFF.ReferenceGrid.createWithNameAndDetails = function(gridName, resultSet)
{
	var grid = new oFF.ReferenceGrid();
	grid.setupSimpleGrid(resultSet, true, false);
	return grid;
};
oFF.ReferenceGrid.createForVizGrid = function(resultSet)
{
	var grid = new oFF.ReferenceGrid();
	grid.setupSimpleGrid(resultSet, false, true);
	return grid;
};
oFF.ReferenceGrid.prototype.m_resultSet = null;
oFF.ReferenceGrid.prototype.m_withDetails = false;
oFF.ReferenceGrid.prototype.m_defineAllCells = false;
oFF.ReferenceGrid.prototype.m_renderForFireflyGrid = false;
oFF.ReferenceGrid.prototype.m_fixedHeightOff = 0;
oFF.ReferenceGrid.prototype.m_fixedWidthOff = 0;
oFF.ReferenceGrid.prototype.m_offsetRows = 0;
oFF.ReferenceGrid.prototype.m_offsetColumns = 0;
oFF.ReferenceGrid.prototype.m_grid = null;
oFF.ReferenceGrid.prototype.setupSimpleGrid = function(resultSet, withDetails, defineAllCells)
{
	this.setup();
	this.m_withDetails = withDetails;
	this.m_defineAllCells = defineAllCells;
	this.m_resultSet = resultSet;
	this.m_grid = oFF.XReferenceGrid.create();
};
oFF.ReferenceGrid.prototype.releaseObject = function()
{
	this.m_resultSet = null;
	oFF.XObject.prototype.releaseObject.call( this );
};
oFF.ReferenceGrid.prototype.prepareCellStructure = function(useRowsHeaderPane, useColumnsHeaderPane)
{
	if (this.m_grid.hasCells() === false && oFF.notNull(this.m_resultSet))
	{
		this.prepareStructure(useRowsHeaderPane, useColumnsHeaderPane);
	}
};
oFF.ReferenceGrid.prototype.prepareStructure = function(useRowsHeaderPane, useColumnsHeaderPane)
{
	var columnsAxis = this.m_resultSet.getColumnsAxis();
	var colMaxCount = oFF.XMath.max(columnsAxis.getDataCount(), columnsAxis.getTuplesCount());
	var rowsAxis = this.m_resultSet.getRowsAxis();
	if (useColumnsHeaderPane)
	{
		this.m_grid.setFixedHeight(oFF.XMath.max(this.getEffectiveFieldSize(columnsAxis), this.m_renderForFireflyGrid && this.getEffectiveFieldSize(rowsAxis) === 0 ? 0 : 1));
	}
	else
	{
		this.m_grid.setFixedHeight(0);
	}
	var rowDataCount = rowsAxis.getDataCount();
	var rowTupleCount = rowsAxis.getTuplesCount();
	var rowMaxCount = oFF.XMath.max(rowDataCount, rowTupleCount);
	if (useRowsHeaderPane)
	{
		this.m_grid.setFixedWidth(oFF.XMath.max(this.getEffectiveFieldSize(rowsAxis), 1));
	}
	else
	{
		this.m_grid.setFixedWidth(0);
	}
	var totalColumns = this.m_grid.getFixedWidth() + colMaxCount;
	var totalRows = this.m_grid.getFixedHeight() + rowMaxCount;
	this.m_offsetColumns = this.m_resultSet.getQueryManager().getOffsetColumns();
	this.m_offsetRows = this.m_resultSet.getQueryManager().getOffsetRows();
	this.m_grid.setFullSize(totalColumns, totalRows);
	for (var x = 0; x < totalColumns; x++)
	{
		this.m_grid.addColumnsDef(oFF.XReferenceGridLine.create());
	}
	for (var y = 0; y < totalRows; y++)
	{
		this.m_grid.addRowsDef(oFF.XReferenceGridLine.create());
	}
	if (useRowsHeaderPane && useColumnsHeaderPane)
	{
		this.setTitleCells(rowsAxis, oFF.XMath.max(this.getFixedHeight() - 1, 0), columnsAxis.getRsDimensions().isEmpty());
		this.setTitleCells(columnsAxis, oFF.XMath.max(this.getFixedWidth() - 1, 0), rowsAxis.getRsDimensions().isEmpty());
	}
	if (useRowsHeaderPane)
	{
		var fixedHeight = this.m_grid.getFixedHeight() - this.m_fixedHeightOff;
		this.setHeaderCells(rowsAxis, fixedHeight);
	}
	if (useColumnsHeaderPane)
	{
		var fixedWidth = this.m_grid.getFixedWidth() - this.m_fixedWidthOff;
		this.setHeaderCells(columnsAxis, fixedWidth);
	}
	this.setDataCells();
};
oFF.ReferenceGrid.prototype.getEffectiveFieldSize = function(axis)
{
	var effectiveSize = 0;
	var rsDimensions = axis.getRsDimensions();
	var dimensionSize = rsDimensions.size();
	for (var idxDim = 0; idxDim < dimensionSize; idxDim++)
	{
		effectiveSize = effectiveSize + rsDimensions.get(idxDim).getResultSetFields().size();
	}
	return effectiveSize;
};
oFF.ReferenceGrid.prototype.setTitleCells = function(axis, row, complementaryAxisEmpty)
{
	var type = axis.getType();
	var rsDimensions = axis.getRsDimensions();
	var column = 0;
	var buffer = oFF.XStringBuffer.create();
	var bufferDV = oFF.XStringBuffer.create();
	var dimSize = rsDimensions.size();
	for (var idxDim = 0; idxDim < dimSize; idxDim++)
	{
		var rsDimension = rsDimensions.get(idxDim);
		var visibleFields = rsDimension.getResultSetFields();
		var fieldSize = visibleFields.size();
		for (var idxField = 0; idxField < fieldSize; idxField++)
		{
			var fieldName = visibleFields.get(idxField).getName();
			if (oFF.XStringUtils.isNullOrEmpty(rsDimension.getName()))
			{
				buffer.append("[").append(fieldName).append("]");
			}
			else
			{
				if (idxField === 0)
				{
					bufferDV.append(rsDimension.getText());
				}
				if (rsDimension.isMeasureStructure())
				{
					if (idxField === 0)
					{
						buffer.append("Measures");
					}
				}
				else if (rsDimension.isStructure())
				{
					if (idxField === 0)
					{
						buffer.append("Structure");
					}
				}
				else
				{
					if (idxField === 0)
					{
						buffer.append(rsDimension.getName()).append(".[");
					}
					else
					{
						buffer.append("[");
					}
					buffer.append(fieldName).append("]");
				}
			}
			if (type === oFF.AxisType.ROWS)
			{
				if (!(this.m_renderForFireflyGrid && rsDimension.isStructure() && dimSize === idxDim + 1))
				{
					var titleCell = oFF.XReferenceGridCell.create(buffer.toString(), oFF.RgCellType.TITLE);
					titleCell.setDisplayValue(bufferDV.toString());
					titleCell.setDimension(rsDimension.getName());
					titleCell.setPart("Rows");
					titleCell.setRow(row);
					titleCell.setColumn(column);
					this.m_grid.setCell(column, row, titleCell, false);
				}
				else if (complementaryAxisEmpty && !this.m_renderForFireflyGrid)
				{
					this.m_fixedHeightOff = 1;
				}
			}
			else
			{
				if (!(this.m_renderForFireflyGrid && rsDimension.isStructure() && dimSize === idxDim + 1))
				{
					var existingCell = this.m_grid.getSimpleCell(row, column);
					if (oFF.notNull(existingCell))
					{
						var simpleName = buffer.toString();
						buffer.clear();
						bufferDV.clear();
						buffer.append(existingCell.toString());
						buffer.append(oFF.ReferenceGrid.MAGIC_CELL_DIV);
						buffer.append(simpleName);
						if (this.m_renderForFireflyGrid)
						{
							bufferDV.append(existingCell.getDisplayValue());
						}
						if (idxField === 0 && !rsDimension.isStructure())
						{
							bufferDV.append(oFF.ReferenceGrid.MAGIC_CELL_DIV);
							bufferDV.append(rsDimension.getText());
						}
					}
					var titCell = oFF.XReferenceGridCell.create(buffer.toString(), oFF.RgCellType.TITLE);
					if (this.m_renderForFireflyGrid)
					{
						titCell.setRow(row);
						titCell.setColumn(column);
						titCell.setDisplayValue(bufferDV.toString());
						if (oFF.notNull(existingCell))
						{
							titCell.setPart("Mixed");
						}
						else
						{
							titCell.setPart("Columns");
						}
						if (oFF.notNull(existingCell))
						{
							titCell.setDimension(existingCell.getDimension());
						}
						else
						{
							titCell.setDimension(rsDimension.getName());
						}
					}
					else
					{
						titCell.setDimension(rsDimension.getName());
					}
					this.m_grid.setCell(row, column, titCell, true);
				}
				else if (complementaryAxisEmpty)
				{
					this.m_fixedWidthOff = 1;
				}
			}
			buffer.clear();
			bufferDV.clear();
			column++;
		}
	}
};
oFF.ReferenceGrid.prototype.setDataCells = function()
{
	var readinessStates = this.m_resultSet.getInputReadinessStates();
	var dc = this.m_resultSet.getDataColumns();
	var dr = this.m_resultSet.getDataRows();
	var sb = oFF.XStringBuffer.create();
	for (var y = 0; y < dr; y++)
	{
		for (var x = 0; x < dc; x++)
		{
			var dataCell = this.m_resultSet.getDataCell(x, y);
			var cell;
			if (this.m_withDetails)
			{
				cell = oFF.XReferenceGridCell.create(this.getCellValueWithDetails(dataCell, readinessStates), oFF.RgCellType.DATA);
			}
			else
			{
				cell = oFF.XReferenceGridCell.create(this.getCellValue(this.formatDataCellValue(dataCell), dataCell), oFF.RgCellType.DATA);
			}
			if (this.m_renderForFireflyGrid)
			{
				sb.clear();
				this.appendPrefixValueSuffix(dataCell.getCurrencyUnit(), dataCell, sb);
				cell.setDisplayValue(sb.toString());
				cell.setPart("Data");
				cell.setAlertLeve(dataCell.getMaxAlertLevel().getName());
				cell.setIsInputEnabled(dataCell.isDataEntryEnabled());
				var rsDC = dataCell.getDataCell();
				if (oFF.notNull(rsDC))
				{
					var s1 = dataCell.getQueryModel().getDataSource().getName();
					sb.clear();
					var refStr = rsDC.getReferenceStructureElement1();
					if (oFF.notNull(refStr))
					{
						sb.append("mem-");
						sb.append(refStr.getFieldValue(refStr.getDimension().getDisplayKeyField()).getString());
						if (refStr.getFieldValue(refStr.getDimension().getDisplayKeyField()) !== null)
						{
							cell.setMember(refStr.getFieldValue(refStr.getDimension().getDisplayKeyField()).getString());
						}
						else
						{
							cell.setMember(refStr.getName());
						}
					}
					refStr = rsDC.getReferenceStructureElement2();
					if (oFF.notNull(refStr))
					{
						sb.append("-mem-");
						sb.append(refStr.getFieldValue(refStr.getDimension().getDisplayKeyField()).getString());
						if (refStr.getFieldValue(refStr.getDimension().getDisplayKeyField()) !== null)
						{
							cell.setMember2(refStr.getFieldValue(refStr.getDimension().getDisplayKeyField()).getString());
						}
						else
						{
							cell.setMember(refStr.getName());
						}
					}
					var s2 = sb.toString();
					var s3 = dataCell.getValueException().isValidValue() && dataCell.getValueException() !== oFF.ValueException.NULL_VALUE ? oFF.XNumberFormatter.formatDoubleToString(dataCell.getDouble(), "0.####") : "";
					sb.clear();
					cell.setDataValueId(oFF.XStringUtils.concatenate5(s1, "-", s2, "-", s3));
				}
				cell.setRow(y + this.m_grid.getFixedHeight() - this.m_fixedHeightOff + this.m_offsetRows);
				cell.setColumn(x + this.m_grid.getFixedWidth() - this.m_fixedWidthOff + this.m_offsetColumns);
			}
			this.m_grid.setCell(x + this.m_grid.getFixedWidth() - this.m_fixedWidthOff, y + this.m_grid.getFixedHeight() - this.m_fixedHeightOff, cell, false);
		}
	}
};
oFF.ReferenceGrid.prototype.formatDataCellValue = function(dataCell)
{
	return dataCell.getFormattedValue();
};
oFF.ReferenceGrid.prototype.getCellValueWithDetails = function(dataCell, readinessStates)
{
	var sb = oFF.XStringBuffer.create();
	var qDataCell = dataCell.getDataCell();
	if (oFF.notNull(qDataCell))
	{
		sb.append("(DataCell->").append(qDataCell.getName()).append(")");
	}
	var decimalPlaces = dataCell.getDecimalPlaces();
	if (decimalPlaces !== 0)
	{
		sb.append("(Decimal Places=").appendInt(decimalPlaces).append(")");
	}
	if (dataCell.isDataEntryEnabled())
	{
		sb.append("I:");
	}
	if (dataCell.isValueLocked())
	{
		sb.append("L:");
	}
	var currencyUnit = dataCell.getCurrencyUnit();
	this.appendPrefixValueSuffix(currencyUnit, dataCell, sb);
	this.appendValueException(dataCell, sb);
	this.appendAlertLevel(dataCell, sb);
	this.appendValueChanged(dataCell, sb);
	sb.append("|").append(dataCell.getValueType().getName());
	sb.append("|").append(dataCell.getFormatString());
	this.appendCurrencyUnit(currencyUnit, sb);
	this.appendInputReadiness(dataCell, readinessStates, sb);
	return sb.toString();
};
oFF.ReferenceGrid.prototype.appendPrefixValueSuffix = function(currencyUnit, dataCell, sb)
{
	if (oFF.notNull(currencyUnit) && currencyUnit.hasPrefix())
	{
		sb.append(currencyUnit.getPrefix()).append(" ");
	}
	sb.append(this.formatDataCellValue(dataCell));
	if (oFF.notNull(currencyUnit) && currencyUnit.hasSuffix())
	{
		sb.append(" ").append(currencyUnit.getSuffix());
	}
};
oFF.ReferenceGrid.prototype.appendValueException = function(dataCell, sb)
{
	var valueException = dataCell.getValueException();
	if (valueException !== oFF.ValueException.NORMAL)
	{
		sb.append("|");
		if (oFF.isNull(valueException))
		{
			sb.append("<null>");
		}
		else
		{
			sb.append(valueException.getName());
		}
	}
};
oFF.ReferenceGrid.prototype.appendInputReadiness = function(dataCell, readinessStates, sb)
{
	var queryManager = dataCell.getQueryModel().getQueryManager();
	if (queryManager.supportsInputReadinessStates() && dataCell.getQueryModel().isDataEntryEnabled())
	{
		var inputReadinessState = dataCell.getInputReadinessState();
		if (oFF.notNull(inputReadinessState))
		{
			var readinessState = readinessStates.get(inputReadinessState.getIndex());
			var inputReadinessTypes = readinessState.getInputReadinessTypes();
			var types = oFF.XListOfString.create();
			for (var i = 0; i < inputReadinessTypes.size(); i++)
			{
				types.add(inputReadinessTypes.get(i).getShortcut());
			}
			sb.append("|S:").append(oFF.XCollectionUtils.join(types, ","));
		}
	}
};
oFF.ReferenceGrid.prototype.appendAlertLevel = function(dataCell, sb)
{
	var maxAlertLevel = dataCell.getMaxAlertLevel();
	if (maxAlertLevel !== oFF.AlertLevel.NORMAL)
	{
		sb.append("|[");
		sb.append(oFF.isNull(maxAlertLevel) ? "<null>" : maxAlertLevel.getName());
		sb.append("]");
	}
};
oFF.ReferenceGrid.prototype.appendValueChanged = function(dataCell, sb)
{
	if (dataCell.isValueChanged())
	{
		sb.append("|N:");
		var newValue = dataCell.getXValue();
		if (oFF.isNull(newValue))
		{
			sb.append("<null>");
		}
		else
		{
			sb.append(newValue.getValueType().getName());
			if (newValue.getValueType() === oFF.XValueType.STRING)
			{
				sb.append(" ").append(newValue.getString());
			}
		}
	}
	if (dataCell.isNewValueForced())
	{
		sb.append("|F:");
	}
};
oFF.ReferenceGrid.prototype.appendCurrencyUnit = function(currencyUnit, sb)
{
	if (oFF.notNull(currencyUnit) && !currencyUnit.isEmpty())
	{
		sb.append("|");
		if (currencyUnit.isMixed())
		{
			sb.append("M:");
		}
		else if (currencyUnit.hasUnit())
		{
			sb.append("U:");
		}
		else if (currencyUnit.hasCurrency())
		{
			sb.append("C:");
		}
		if (currencyUnit.hasFormatted())
		{
			sb.append(currencyUnit.getFormatted());
		}
		else
		{
			sb.append("<null>");
		}
	}
};
oFF.ReferenceGrid.prototype.getCellValue = function(formattedValue, dataCell)
{
	var valueException = dataCell.getValueException();
	if (valueException === oFF.ValueException.NULL_VALUE || valueException === oFF.ValueException.UNDEFINED)
	{
		return "";
	}
	var exceptionText = null;
	if (valueException !== oFF.ValueException.NORMAL && valueException !== oFF.ValueException.ZERO)
	{
		exceptionText = valueException.getName();
	}
	var alertLevelText = null;
	var maxAlertLevel = dataCell.getMaxAlertLevel();
	if (maxAlertLevel !== oFF.AlertLevel.NORMAL)
	{
		alertLevelText = maxAlertLevel.getName();
	}
	if (oFF.notNull(exceptionText) || oFF.notNull(alertLevelText))
	{
		var buffer = oFF.XStringBuffer.create();
		buffer.append(formattedValue);
		if (oFF.notNull(alertLevelText))
		{
			buffer.append(" [").append(alertLevelText).append("]");
		}
		if (oFF.notNull(exceptionText))
		{
			buffer.append(" [").append(exceptionText).append("]");
		}
		return buffer.toString();
	}
	return formattedValue;
};
oFF.ReferenceGrid.prototype.setHeaderCells = function(axis, tupleOffset)
{
	var rsDimensions = axis.getRsDimensions();
	var axisType = axis.getType();
	var tuplesCount = axis.getTuplesCount();
	var formattedValue = oFF.XStringBuffer.create();
	var displayValue = oFF.XStringBuffer.create();
	var emptyHeaderCell = oFF.XReferenceGridCell.create(null, oFF.RgCellType.HEADER);
	var emptyHeaderTotalsCell = oFF.XReferenceGridCell.create(null, oFF.RgCellType.HEADER);
	for (var tupleIndex = 0; tupleIndex < tuplesCount; tupleIndex++)
	{
		var tuple = axis.getTupleAt(tupleIndex);
		var position = 0;
		var hasTotals = false;
		var tupleSize = tuple.size();
		for (var tupleElementIndex = 0; tupleElementIndex < tupleSize; tupleElementIndex++)
		{
			var rsDimension = rsDimensions.get(tupleElementIndex);
			var element = tuple.get(tupleElementIndex);
			var rsVisibleFields = rsDimension.getResultSetFields();
			var visibleFieldCount = rsVisibleFields.size();
			if (element.getFirstTuple() === tuple || this.m_renderForFireflyGrid === true)
			{
				var dimensionMember = element.getDimensionMember();
				formattedValue.clear();
				var memberType = dimensionMember.getMemberType();
				if (memberType.isResult())
				{
					this.enableTotals(axisType, tupleIndex + tupleOffset);
					if (visibleFieldCount > 0)
					{
						var added = 0;
						if (!hasTotals)
						{
							if (memberType === oFF.MemberType.CONDITION_RESULT)
							{
								formattedValue.append("[Totals Included]");
								displayValue.append("[Totals Included]");
							}
							else if (memberType === oFF.MemberType.CONDITION_OTHERS_RESULT)
							{
								formattedValue.append("[Totals Remaining]");
								displayValue.append("[Totals Remaining]");
							}
							else
							{
								formattedValue.append("[Totals]");
								displayValue.append("[Totals]");
							}
							this.appendAlertLevelToValue(element, formattedValue);
							var totalsCell = oFF.XReferenceGridCell.create(formattedValue.toString(), oFF.RgCellType.HEADER);
							if (this.m_renderForFireflyGrid)
							{
								if (element.getFirstTuple() === tuple)
								{
									totalsCell.setDisplayValue(displayValue.toString());
								}
								totalsCell.setDimension(rsDimension.getName());
								if (rsDimension.isStructure() && dimensionMember.getDimension().getStructureMember(dimensionMember.getName()).getFieldValue(dimensionMember.getDimension().getDisplayKeyField()) !== null)
								{
									totalsCell.setMember(dimensionMember.getDimension().getStructureMember(dimensionMember.getName()).getFieldValue(dimensionMember.getDimension().getDisplayKeyField()).getString());
								}
								else
								{
									totalsCell.setMember(dimensionMember.getName());
								}
								if (axis === this.m_resultSet.getRowsAxis())
								{
									totalsCell.setPart("Rows");
									totalsCell.setRowTupleIndex(tupleIndex);
								}
								else
								{
									totalsCell.setPart("Columns");
									totalsCell.setColumnTupleIndex(tupleIndex);
								}
							}
							this.addCell(axisType, position, tupleIndex, tupleOffset, totalsCell);
							formattedValue.clear();
							displayValue.clear();
							added = 1;
						}
						if (this.m_defineAllCells)
						{
							position = position + added;
							for (var x = added; x < visibleFieldCount; x++)
							{
								this.addCell(axisType, position, tupleIndex, tupleOffset, emptyHeaderTotalsCell);
								position++;
							}
						}
						else
						{
							position = position + visibleFieldCount;
						}
					}
					hasTotals = true;
				}
				else
				{
					for (var fieldIndex = 0; fieldIndex < visibleFieldCount; fieldIndex++)
					{
						var fieldValue = dimensionMember.getAllFieldValues().getByKey(rsVisibleFields.get(fieldIndex).getName());
						formattedValue.append(this.formatFieldValue(fieldValue));
						displayValue.append(this.formatFieldValue(fieldValue));
						if (fieldIndex === 0)
						{
							this.prependToFirstField(element, formattedValue);
							this.appendAlertLevelToValue(element, formattedValue);
						}
						var gridCell = oFF.XReferenceGridCell.create(formattedValue.toString(), oFF.RgCellType.HEADER);
						if (this.m_renderForFireflyGrid)
						{
							if (axisType === oFF.AxisType.ROWS)
							{
								gridCell.setPart("Rows");
							}
							else
							{
								gridCell.setPart("Columns");
							}
							if (element.getFirstTuple() === tuple)
							{
								gridCell.setDisplayValue(displayValue.toString());
							}
							gridCell.setDimension(rsDimension.getName());
							if (rsDimension.isStructure() && dimensionMember.getDimension().getStructureMember(dimensionMember.getName()).getFieldValue(dimensionMember.getDimension().getDisplayKeyField()) !== null)
							{
								gridCell.setMember(dimensionMember.getDimension().getStructureMember(dimensionMember.getName()).getFieldValue(dimensionMember.getDimension().getDisplayKeyField()).getString());
							}
							else
							{
								gridCell.setMember(dimensionMember.getName());
							}
							if (axis === this.m_resultSet.getRowsAxis())
							{
								gridCell.setRowTupleIndex(tupleIndex);
							}
							else
							{
								gridCell.setColumnTupleIndex(tupleIndex);
							}
						}
						if (fieldIndex === 0 && element.getFirstTuple() === tuple)
						{
							gridCell.setDisplayLevel(element.getDisplayLevel());
							var drillState = element.getDrillState();
							var icon = "";
							if (drillState === oFF.DrillState.EXPANDED || drillState === oFF.DrillState.DRILLED)
							{
								gridCell.setDrillState("Expanded");
								if (rsDimension.getLowerLevelNodeAlignment() === oFF.Alignment.CHILDREN_ABOVE_PARENT)
								{
									if (axisType === oFF.AxisType.ROWS)
									{
										icon = "sap-icon://slim-arrow-up";
									}
									else
									{
										icon = "sap-icon://slim-arrow-left";
									}
								}
								else
								{
									if (axisType === oFF.AxisType.ROWS)
									{
										icon = "sap-icon://slim-arrow-down";
									}
									else
									{
										icon = "sap-icon://slim-arrow-down";
									}
								}
							}
							else if (drillState === oFF.DrillState.COLLAPSED || drillState === oFF.DrillState.LEAF_UDH_EXPAND_ALLOWED)
							{
								gridCell.setDrillState("Collapsed");
								if (rsDimension.getLowerLevelNodeAlignment() === oFF.Alignment.CHILDREN_ABOVE_PARENT)
								{
									if (axisType === oFF.AxisType.ROWS)
									{
										icon = "sap-icon://slim-arrow-right";
									}
									else
									{
										icon = "sap-icon://slim-arrow-up";
									}
								}
								else
								{
									if (axisType === oFF.AxisType.ROWS)
									{
										icon = "sap-icon://slim-arrow-right";
									}
									else
									{
										icon = "sap-icon://slim-arrow-right";
									}
								}
							}
							else
							{
								gridCell.setDrillState("None");
								icon = "";
							}
							gridCell.setIcon(icon);
						}
						formattedValue.clear();
						displayValue.clear();
						this.addCell(axisType, position, tupleIndex, tupleOffset, gridCell);
						position++;
					}
				}
			}
			else
			{
				if (this.m_defineAllCells)
				{
					for (var m = 0; m < visibleFieldCount; m++)
					{
						this.addCell(axisType, position, tupleIndex, tupleOffset, emptyHeaderCell);
						position++;
					}
				}
				else
				{
					position = position + visibleFieldCount;
				}
			}
		}
	}
};
oFF.ReferenceGrid.prototype.formatFieldValue = function(fieldValue)
{
	if (oFF.isNull(fieldValue))
	{
		return "[null]";
	}
	else
	{
		if (fieldValue.getValueType() === oFF.XValueType.DOUBLE)
		{
			var value = fieldValue.getDouble();
			return oFF.XNumberFormatter.formatDoubleToString(value, "#.0000");
		}
		else
		{
			return fieldValue.getFormattedValue();
		}
	}
};
oFF.ReferenceGrid.prototype.appendAlertLevelToValue = function(element, formattedValue)
{
	if (oFF.XStringUtils.isNotNullAndNotEmpty(element.getExceptionName()))
	{
		formattedValue.append(" [").appendInt(element.getAlertLevel()).append("]");
	}
};
oFF.ReferenceGrid.prototype.prependToFirstField = function(element, formattedValue)
{
	var displayLevel = element.getDisplayLevel();
	var drillState = element.getDrillState();
	if (displayLevel > 0 || drillState !== oFF.DrillState.LEAF)
	{
		var oldValue = formattedValue.toString();
		formattedValue.clear();
		for (var i = 0; i < displayLevel; i++)
		{
			formattedValue.append("  ");
		}
		if (drillState === oFF.DrillState.COLLAPSED || drillState === oFF.DrillState.LEAF_DRILLDOWN_ALLOWED || drillState === oFF.DrillState.LEAF_UDH_EXPAND_ALLOWED || drillState === oFF.DrillState.COLLAPSED_EXPAND_AND_DRILLDOWN_ALLOWED)
		{
			formattedValue.append("+ ");
		}
		else if (drillState === oFF.DrillState.EXPANDED || drillState === oFF.DrillState.DRILLED || drillState === oFF.DrillState.LEAF_UDH)
		{
			formattedValue.append("- ");
		}
		formattedValue.append(oldValue);
	}
};
oFF.ReferenceGrid.prototype.addCell = function(axisType, position, tupleIndex, tupleOffset, cell)
{
	if (axisType === oFF.AxisType.ROWS)
	{
		cell.setRow(tupleIndex + tupleOffset + this.m_offsetRows);
		cell.setColumn(position + this.m_offsetColumns);
		this.m_grid.setCell(position, tupleIndex + tupleOffset, cell, false);
	}
	else
	{
		cell.setRow(position);
		cell.setColumn(tupleIndex + tupleOffset);
		this.m_grid.setCell(tupleIndex + tupleOffset, position, cell, false);
	}
};
oFF.ReferenceGrid.prototype.enableTotals = function(axisType, position)
{
	var rgLineDef;
	if (axisType === oFF.AxisType.ROWS)
	{
		rgLineDef = this.m_grid.getRowsDef(position);
	}
	else
	{
		rgLineDef = this.m_grid.getColumnDef(position);
	}
	if (oFF.notNull(rgLineDef))
	{
		rgLineDef.setHasTotals(true);
	}
};
oFF.ReferenceGrid.prototype.exportForProtocol = function(protocolType)
{
	if (protocolType.isTypeOf(oFF.ProtocolBindingType.FIREFLY_GRID))
	{
		return this.exportToFireflyGrid();
	}
	return this.exportToVizGrid();
};
oFF.ReferenceGrid.prototype.exportToVizGrid = function()
{
	this.prepareCellStructure(true, true);
	var colCount = this.m_grid.getColumnCount();
	var rowCount = this.m_grid.getRowCount();
	var layer1 = oFF.PrFactory.createStructure();
	layer1.putString("Type", "Grid");
	layer1.putInteger("RowCount", rowCount);
	layer1.putInteger("ColCount", colCount);
	var layer1Cells = layer1.putNewList("Cells");
	for (var y = 0; y < rowCount; y++)
	{
		for (var x = 0; x < colCount; x++)
		{
			var cell = layer1Cells.addNewStructure();
			var gridCell = this.m_grid.getSimpleCell(x, y);
			if (oFF.notNull(gridCell))
			{
				cell.putString("Type", "Text");
				cell.putString("Value", gridCell.getText(50));
				if (!gridCell.isLeftAligned())
				{
					cell.putString("HAlign", "End");
				}
				if (gridCell.isTotals())
				{
					cell.putBoolean("Totals", true);
				}
				var cellType = gridCell.getCellType();
				if (cellType === oFF.RgCellType.HEADER)
				{
					cell.putString("Semantic", "Header");
				}
				else if (cellType === oFF.RgCellType.TITLE)
				{
					cell.putString("Semantic", "Title");
				}
			}
			else
			{
				cell.putString("Type", "Empty");
			}
		}
	}
	return layer1;
};
oFF.ReferenceGrid.prototype.exportToFireflyGrid = function()
{
	this.m_renderForFireflyGrid = true;
	this.prepareCellStructure(true, true);
	var colCount = this.m_grid.getColumnCount();
	var rowCount = this.m_grid.getRowCount();
	var fixedRows = this.m_grid.getFixedRowsCount();
	var fixedCols = this.m_grid.getFixedColumnsCount();
	var layer1 = oFF.PrFactory.createStructure();
	layer1.putString("Type", "Grid");
	layer1.putString("ApplicationName", this.m_resultSet.getApplication().getApplicationName());
	layer1.putInteger("RowCount", rowCount);
	layer1.putInteger("ColCount", colCount);
	layer1.putInteger("FixedRows", fixedRows);
	layer1.putInteger("FixedColumns", fixedCols);
	var layer1Cells = layer1.putNewList("Cells");
	for (var y = 0; y < rowCount; y++)
	{
		for (var x = 0; x < colCount; x++)
		{
			var gridCell = this.m_grid.getSimpleCell(x, y);
			if (oFF.notNull(gridCell))
			{
				var cell = layer1Cells.addNewStructure();
				cell.putString("GridPart", gridCell.getPart());
				cell.putString("Type", "Text");
				cell.putString("DisplayValue", gridCell.getDisplayValue());
				cell.putString("Value", gridCell.getText(-1));
				cell.putInteger("Row", gridCell.getRow());
				cell.putInteger("Column", gridCell.getColumn());
				cell.putString("DrillState", gridCell.getDrillState());
				cell.putString("DataValueId", gridCell.getDataValueId());
				cell.putInteger("DisplayLevel", gridCell.getDisplayLevel());
				cell.putInteger("RowTupleIndex", gridCell.getRowTupleIndex());
				cell.putInteger("ColumnTupleIndex", gridCell.getColumnTupleIndex());
				cell.putString("Icon", gridCell.getIcon());
				cell.putString("AlertLevel", gridCell.getAlertLevel());
				cell.putBoolean("Input", gridCell.isInputEnabled());
				if (gridCell.isTotals())
				{
					cell.putBoolean("Totals", true);
				}
				var cellType = gridCell.getCellType();
				if (cellType === oFF.RgCellType.HEADER)
				{
					cell.putString("Semantic", "Header");
					cell.putString("Dimension", gridCell.getDimension());
					cell.putString("Member", gridCell.getMember());
				}
				else if (cellType === oFF.RgCellType.TITLE)
				{
					cell.putString("Semantic", "Title");
					cell.putString("Dimension", gridCell.getDimension());
				}
				else if (cellType === oFF.RgCellType.DATA)
				{
					cell.putInteger("DataRow", y - fixedRows);
					cell.putInteger("DataColumn", x - fixedCols);
					cell.putString("Member", gridCell.getMember());
					cell.putString("Member2", gridCell.getMember2());
					cell.putString("Semantic", gridCell.isTotals() ? "Result" : "Standard");
				}
				else
				{
					cell.putString("Semantic", "Empty");
					cell.putString("GridPart", "Empty");
				}
			}
		}
	}
	this.m_renderForFireflyGrid = false;
	return layer1;
};
oFF.ReferenceGrid.prototype.getRowCount = function()
{
	return this.m_grid.getRowCount();
};
oFF.ReferenceGrid.prototype.getColumnCount = function()
{
	return this.m_grid.getColumnCount();
};
oFF.ReferenceGrid.prototype.getFixedRowsCount = function()
{
	return this.m_grid.getFixedRowsCount();
};
oFF.ReferenceGrid.prototype.getFixedColumnsCount = function()
{
	return this.m_grid.getFixedColumnsCount();
};
oFF.ReferenceGrid.prototype.getColumnMaxCharacters = function(column, rowStart, maxRowCount)
{
	return this.m_grid.getColumnMaxCharacters(column, rowStart, maxRowCount);
};
oFF.ReferenceGrid.prototype.addRowsDef = function(line)
{
	this.m_grid.addRowsDef(line);
};
oFF.ReferenceGrid.prototype.getRowsDef = function(index)
{
	return this.m_grid.getRowsDef(index);
};
oFF.ReferenceGrid.prototype.addColumnsDef = function(line)
{
	this.m_grid.addColumnsDef(line);
};
oFF.ReferenceGrid.prototype.getColumnDef = function(index)
{
	return this.m_grid.getColumnDef(index);
};
oFF.ReferenceGrid.prototype.getSimpleCell = function(column, row)
{
	return this.m_grid.getSimpleCell(column, row);
};
oFF.ReferenceGrid.prototype.setCell = function(x, y, cell, overwriteAllowed)
{
	this.m_grid.setCell(x, y, cell, overwriteAllowed);
};
oFF.ReferenceGrid.prototype.exportToAscii = function(maxCellSize)
{
	return this.exportToAsciiExt(maxCellSize, true, true, 0, -1, 0, -1);
};
oFF.ReferenceGrid.prototype.exportBodyColumns = function(maxCellSize, useColumnsHeaderPane, columnStart, maxColumnCount)
{
	return this.exportToAsciiExt(maxCellSize, false, useColumnsHeaderPane, 0, -1, columnStart, maxColumnCount);
};
oFF.ReferenceGrid.prototype.exportBodyRows = function(maxCellSize, useRowsHeaderPane, rowStart, maxRowCount)
{
	return this.exportToAsciiExt(maxCellSize, useRowsHeaderPane, false, rowStart, maxRowCount, 0, -1);
};
oFF.ReferenceGrid.prototype.exportToAsciiExt = function(maxCellSize, useRowsHeaderPane, useColumnsHeaderPane, rowStart, maxRowCount, columnStart, maxColumnCount)
{
	this.prepareCellStructure(useRowsHeaderPane, useColumnsHeaderPane);
	return this.m_grid.exportToAsciiExt(maxCellSize, useRowsHeaderPane, useColumnsHeaderPane, rowStart, maxRowCount, columnStart, maxColumnCount);
};
oFF.ReferenceGrid.prototype.exportToFingerprint = function()
{
	this.m_grid.setFingerprintMode();
	this.prepareCellStructure(true, true);
	return this.m_grid.getFingerprint();
};
oFF.ReferenceGrid.prototype.getFixedHeight = function()
{
	return this.m_grid.getFixedHeight();
};
oFF.ReferenceGrid.prototype.setFixedHeight = function(fixedHeight)
{
	this.m_grid.setFixedHeight(fixedHeight);
};
oFF.ReferenceGrid.prototype.getFixedWidth = function()
{
	return this.m_grid.getFixedWidth();
};
oFF.ReferenceGrid.prototype.setFixedWidth = function(fixedWidth)
{
	this.m_grid.setFixedWidth(fixedWidth);
};
oFF.ReferenceGrid.prototype.setFullSize = function(totalColumns, totalRows)
{
	this.m_grid.setFullSize(totalColumns, totalRows);
};
oFF.ReferenceGrid.prototype.hasCells = function()
{
	return this.m_grid.hasCells();
};
oFF.ReferenceGrid.prototype.getFingerprint = oFF.noSupport;
oFF.ReferenceGrid.prototype.setFingerprintMode = oFF.noSupport;

oFF.RsHiChartBoxplotHelper = function() {};
oFF.RsHiChartBoxplotHelper.prototype = new oFF.RsHiChartSeriesHelper();
oFF.RsHiChartBoxplotHelper.prototype._ff_c = "RsHiChartBoxplotHelper";

oFF.RsHiChartBoxplotHelper.prototype.prepareRendering = function() {};
oFF.RsHiChartBoxplotHelper.prototype.readResultSetData = function(columnAxis, rowAxis, rs)
{
	var theChartData = this.getChartData();
	var xAxis = theChartData.putNewList(oFF.VizDefConstants.K_X_AXIS);
	var xAxisStruct = xAxis.addNewStructure();
	var chartlang = theChartData.putNewStructure(oFF.VizDefConstants.K_LANG);
	var decimalPlaceString = oFF.XInteger.convertToString(columnAxis.getDecimalPlaces(oFF.VizDefConstants.K_VALUE_AXIS));
	if (rs.getAvailableDataCellCount() > 0)
	{
		var seriesList = theChartData.putNewList(oFF.VizDefConstants.K_SERIES);
		var buff = oFF.XStringBuffer.create();
		buff.append("<b>{series.name}</b><br/><b>Distribution</b> <br/>");
		buff.append("Maximum: {point.high:,.");
		buff.append(decimalPlaceString);
		buff.append("f} <br/>Upper Quartile: {point.q3:,.");
		buff.append(decimalPlaceString);
		buff.append("f} <br/>Median: {point.median:,.");
		buff.append(decimalPlaceString);
		buff.append("f} <br/>Lower Quartile: {point.q1:,.");
		buff.append(decimalPlaceString);
		buff.append("f} <br/>Minimum: {point.low:,.");
		buff.append(decimalPlaceString);
		buff.append("f}");
		var categoriesList = xAxisStruct.putNewList(oFF.VizDefConstants.K_CATEGORIES);
		var rowHeadings = rowAxis.getPrettyNamesForFeed(true, false, oFF.VizDefConstants.K_CATEGORY_AXIS);
		var columnSelectors = oFF.XListOfString.create();
		columnSelectors.add(oFF.VizDefConstants.K_VALUE_AXIS);
		columnSelectors.add(oFF.VizDefConstants.K_VALUE_AXIS2);
		columnSelectors.add(oFF.VizDefConstants.K_VARIANCE);
		for (var h = 0; h < rowHeadings.size(); h++)
		{
			categoriesList.addString(rowHeadings.get(h));
		}
		var numberOfSubSeries = columnAxis.getPrettyNamesForFeeds(true, false, columnSelectors).size();
		var indices = columnAxis.getIndicesByFeedOrder(columnSelectors);
		var contextFeed = oFF.VizDefConstants.V_FEED_COLOR;
		columnSelectors.add(oFF.VizDefConstants.K_COLOR);
		var pureColors = columnAxis.getPrettyNamesForFeed(true, false, oFF.VizDefConstants.K_COLOR);
		var overwriteColors = pureColors.size() < 2;
		if (columnAxis.hasTupleForFeed(oFF.VizDefConstants.V_FEED_DATA_CONTEXT) && columnAxis.getPrettyNamesForFeed(true, false, oFF.VizDefConstants.V_FEED_DATA_CONTEXT).size() > 1)
		{
			contextFeed = oFF.VizDefConstants.V_FEED_DATA_CONTEXT;
			numberOfSubSeries = columnAxis.getPrettyNamesForFeeds(true, false, columnSelectors).size();
		}
		var alreadyHandledIndices = oFF.XList.create();
		var ix = -1;
		for (var ij = 0; ij < indices.size(); ij++)
		{
			var curInt = indices.get(ij);
			if (alreadyHandledIndices.contains(curInt))
			{
				continue;
			}
			ix = ix + 1;
			var i = curInt.getInteger();
			var columnTuple = columnAxis.getTupleAt(i);
			var currentContextMembers = columnTuple.getMemberKeysForFeedsOtherThan(contextFeed);
			var aggregatableIndices = columnAxis.getTupleIndexForMemberNames(currentContextMembers);
			alreadyHandledIndices.addAll(aggregatableIndices);
			this.setShowLegend(numberOfSubSeries > 1);
			var compositeMeasureName = columnTuple.getPrettyText(columnSelectors);
			var dataLayer = seriesList.addNewStructure();
			var boxplotData = dataLayer.putNewList(oFF.VizDefConstants.K_DATA);
			var dolt = dataLayer.putNewStructure(oFF.VizDefConstants.K_TOOLTIP);
			dolt.putString(oFF.VizDefConstants.K_POINT_FORMAT, buff.toString());
			dolt.putString(oFF.VizDefConstants.K_HEADER_FORMAT, "");
			dataLayer.putBoolean(oFF.VizDefConstants.K_SHOW_IN_LEGEND, true);
			dataLayer.putString(oFF.VizDefConstants.K_TYPE, oFF.VizDefConstants.V_CHART_TYPE_BOXPLOT);
			dataLayer.putString(oFF.VizDefConstants.K_NAME, compositeMeasureName);
			var dataLayerOutlier = seriesList.addNewStructure();
			dataLayerOutlier.putString(oFF.VizDefConstants.K_TYPE, oFF.VizDefConstants.K_SCATTER);
			dataLayerOutlier.putString(oFF.VizDefConstants.K_NAME, compositeMeasureName);
			dataLayerOutlier.putString("linkedTo", ":previous");
			var dataLayerOutlierMarkers = dataLayerOutlier.putNewStructure(oFF.VizDefConstants.K_MARKER);
			dataLayerOutlierMarkers.putString(oFF.VizDefConstants.K_FILL_COLOR, oFF.VizDefConstants.K_TRANSPARENT);
			dataLayerOutlierMarkers.putInteger(oFF.VizDefConstants.K_LINE_WIDTH, 1);
			var outlier = dataLayerOutlier.putNewList(oFF.VizDefConstants.K_DATA);
			var dott = dataLayerOutlier.putNewStructure(oFF.VizDefConstants.K_TOOLTIP);
			dott.putString(oFF.VizDefConstants.K_POINT_FORMAT, oFF.XStringUtils.concatenate3("<b>{series.name}</b><br/><b>Outliers</b><br/><br/> {point.categoryName}: {point.y:,.", decimalPlaceString, "f}"));
			dott.putString(oFF.VizDefConstants.K_HEADER_FORMAT, "");
			if (overwriteColors)
			{
				this.addColorAndPattern(columnTuple.getColor(), columnTuple.getPattern(), dataLayer, oFF.VizDefConstants.V_CHART_TYPE_BOXPLOT, false);
				this.addColorAndPattern(columnTuple.getColor(), columnTuple.getPattern(), dataLayerOutlier, oFF.VizDefConstants.K_SCATTER, true);
				dataLayerOutlierMarkers.putString(oFF.VizDefConstants.K_LINE_COLOR, this.getCurrentColor());
			}
			else
			{
				dataLayerOutlierMarkers.putString(oFF.VizDefConstants.K_LINE_COLOR, this.getColorAt(0));
			}
			for (var j = 0; j < rowAxis.getTuplesCount(); j++)
			{
				if (!rowAxis.getTupleAt(j).isSelectedByString(oFF.VizDefConstants.K_CATEGORY_AXIS))
				{
					continue;
				}
				if (rowAxis.getTupleAt(j).isTotal())
				{
					continue;
				}
				var listOfDoubles = oFF.XList.create();
				for (var kj = 0; kj < aggregatableIndices.size(); kj++)
				{
					var k = aggregatableIndices.get(kj).getInteger();
					var currentTuple = columnAxis.getTupleAt(i);
					if (!currentTuple.isSelectedByString(oFF.VizDefConstants.K_VALUE_AXIS))
					{
						continue;
					}
					var dataCell = rs.getDataCell(k, j);
					var doubleValue = 0;
					var valueType = dataCell.getValueType();
					if (valueType === oFF.XValueType.DOUBLE || valueType === oFF.XValueType.DECIMAL_FLOAT)
					{
						if (dataCell.getXValue() !== null)
						{
							doubleValue = columnAxis.getScaledValue(oFF.VizDefConstants.K_VALUE_AXIS, currentTuple, dataCell);
							listOfDoubles.add(oFF.XDoubleValue.create(doubleValue));
						}
					}
				}
				if (listOfDoubles.size() === 0)
				{
					continue;
				}
				listOfDoubles.sortByComparator(oFF.XComparatorDouble.create());
				var boxPlotDataStructure = boxplotData.addNewStructure();
				var firstQuarter = 0;
				var thirdQuarter = 0;
				var intervalQuartile = 0;
				var median = 0;
				var element = 0;
				var min = 0;
				var max = 0;
				var divNumber = listOfDoubles.size() - 1;
				var quarter1Index = divNumber / 4;
				var quarter2Index = divNumber / 2;
				var quarter3Index = divNumber * 3 / 4;
				firstQuarter = listOfDoubles.get(oFF.XDouble.convertToInt(quarter1Index)).getDouble();
				median = listOfDoubles.get(oFF.XDouble.convertToInt(quarter2Index)).getDouble();
				thirdQuarter = listOfDoubles.get(oFF.XDouble.convertToInt(quarter3Index)).getDouble();
				intervalQuartile = (thirdQuarter - firstQuarter) * 1.5;
				max = listOfDoubles.get(0).getDouble();
				min = listOfDoubles.get(listOfDoubles.size() - 1).getDouble();
				for (var ld = 0; ld < listOfDoubles.size(); ld++)
				{
					element = listOfDoubles.get(ld).getDouble();
					if (thirdQuarter + intervalQuartile < element || firstQuarter - intervalQuartile > element)
					{
						var outlierStruct = outlier.addNewStructure();
						outlierStruct.putDouble(oFF.VizDefConstants.K_X, j - 0.25 + (0.5 + ix) / numberOfSubSeries / 2);
						outlierStruct.putDouble(oFF.VizDefConstants.K_Y, element);
						outlierStruct.putString(oFF.VizDefConstants.K_CATEGORY_NAME, rowHeadings.get(j));
						if (overwriteColors)
						{
							this.addColorAndPattern(columnTuple.getColor(), columnTuple.getPattern(), outlierStruct, oFF.VizDefConstants.K_SCATTER, true);
						}
					}
					else
					{
						if (element < min)
						{
							min = element;
						}
						if (element > max)
						{
							max = element;
						}
					}
				}
				boxPlotDataStructure.putDouble("low", min);
				boxPlotDataStructure.putDouble("q1", firstQuarter);
				boxPlotDataStructure.putDouble("median", median);
				boxPlotDataStructure.putDouble("q3", thirdQuarter);
				boxPlotDataStructure.putDouble("high", max);
				if (overwriteColors)
				{
					this.addColorAndPattern(columnTuple.getColor(), columnTuple.getPattern(), boxPlotDataStructure, oFF.VizDefConstants.K_SCATTER, true);
				}
			}
		}
	}
	else
	{
		theChartData.putBoolean(oFF.VizDefConstants.K_FULL_SCREEN_ENABLED, false);
		chartlang.putString(oFF.VizDefConstants.K_NO_DATA, "Firefly Resultset is Empty.");
	}
};
oFF.RsHiChartBoxplotHelper.prototype.finishRendering = function() {};

oFF.RsHiChartCategorialSeriesHelper = function() {};
oFF.RsHiChartCategorialSeriesHelper.prototype = new oFF.RsHiChartSeriesHelper();
oFF.RsHiChartCategorialSeriesHelper.prototype._ff_c = "RsHiChartCategorialSeriesHelper";

oFF.RsHiChartCategorialSeriesHelper.prototype.prepareRendering = function() {};
oFF.RsHiChartCategorialSeriesHelper.prototype.readResultSetData = function(columnAxis, rowAxis, rs)
{
	var theChartData = this.getChartData();
	var dataList;
	var dataLayer;
	var errorLayer;
	var errorList;
	var compositemeasureName = null;
	var hasVariance = false;
	var hideTotalOnRows = true;
	var xAxis = theChartData.putNewList(oFF.VizDefConstants.K_X_AXIS);
	var xAxisStruct = xAxis.addNewStructure();
	var chartlang = theChartData.putNewStructure(oFF.VizDefConstants.K_LANG);
	var seriesList = theChartData.putNewList(oFF.VizDefConstants.K_SERIES);
	var customColor = theChartData.getStructureByKey(oFF.VizDefConstants.K_EXPLICIT_COLOR_ASSIGNMENTS);
	if (oFF.notNull(customColor))
	{
		theChartData.getListByKey(oFF.VizDefConstants.K_COLORS).clear();
	}
	var tooltipBuffer = oFF.XStringBuffer.create();
	tooltipBuffer.append("<b>{series.name}</b> / ");
	tooltipBuffer.append("{point.category}<br/><b>{point.name}</b>  {point.yFormatted}<br/>");
	if (rs.getAvailableDataCellCount() > 0)
	{
		var explicitCategories = true;
		var rowCategories = rowAxis.getFormattedNamesForFeed(true, !hideTotalOnRows, oFF.VizDefConstants.K_CATEGORY_AXIS);
		if (rowCategories.size() === 0)
		{
			rowCategories = rowAxis.getFormattedNames(true, !hideTotalOnRows);
			explicitCategories = false;
		}
		var columnSelectors = oFF.XListOfString.create();
		columnSelectors.add(oFF.VizDefConstants.K_VALUE_AXIS);
		columnSelectors.add(oFF.VizDefConstants.K_VALUE_AXIS2);
		columnSelectors.add(oFF.VizDefConstants.K_VARIANCE);
		var rowSelector = oFF.XListOfString.create();
		rowSelector.add(oFF.VizDefConstants.K_CATEGORY_AXIS);
		var pureColors = columnAxis.getPrettyNamesForFeed(true, !hideTotalOnRows, oFF.VizDefConstants.K_COLOR);
		var pureMeasures = columnAxis.getPrettyNamesForFeeds(true, !hideTotalOnRows, columnSelectors);
		var overwriteColors = pureColors.size() < 2;
		var rowCategoryCount = rowCategories.size();
		var chartTitle;
		if (rowCategoryCount > 0)
		{
			chartTitle = oFF.XStringUtils.concatenate3(oFF.XCollectionUtils.join(pureMeasures, ", "), " Per ", oFF.XCollectionUtils.join(rowAxis.getDimensionsForFeed(oFF.VizDefConstants.K_CATEGORY_AXIS), ", "));
			var categoriesList = xAxisStruct.putNewList(oFF.VizDefConstants.K_CATEGORIES);
			for (var k = 0; k < rowCategories.size(); k++)
			{
				categoriesList.addString(rowCategories.get(k));
			}
		}
		else
		{
			xAxisStruct.putString(oFF.VizDefConstants.K_TYPE, oFF.VizDefConstants.K_CATEGORY);
			chartTitle = oFF.XCollectionUtils.join(pureMeasures, ", ");
		}
		var title = theChartData.getStructureByKey(oFF.VizDefConstants.K_TITLE);
		if (oFF.isNull(title))
		{
			title = theChartData.putNewStructure(oFF.VizDefConstants.K_TITLE);
			title.putString(oFF.VizDefConstants.K_TEXT, chartTitle);
		}
		else
		{
			var titletext = title.getStringByKey(oFF.VizDefConstants.K_TEXT);
			if (oFF.isNull(titletext))
			{
				title.putString(oFF.VizDefConstants.K_TEXT, chartTitle);
			}
		}
		var selectorList = oFF.XListOfString.create();
		if (pureColors.size() > 1)
		{
			selectorList.add(oFF.VizDefConstants.K_COLOR);
		}
		if (pureMeasures.size() > 1)
		{
			selectorList.addAll(columnSelectors);
		}
		var tooltipHeaders = columnAxis.getPrettyNamesForFeed(true, false, oFF.VizDefConstants.K_TOOLTIP_VALUE_AXIS);
		for (var ti = 0; ti < tooltipHeaders.size(); ti++)
		{
			tooltipBuffer.append("<b>{point.tHeader");
			tooltipBuffer.append(oFF.XInteger.convertToString(ti));
			tooltipBuffer.append("}</b>  {point.tFormatted");
			tooltipBuffer.append(oFF.XInteger.convertToString(ti));
			tooltipBuffer.append("}<br/>");
		}
		tooltipBuffer.append("{point.errorRange}");
		var indices = columnAxis.getIndicesByFeedOrder(columnSelectors);
		this.setShowLegend(indices.size() > 1);
		for (var ij = 0; ij < indices.size(); ij++)
		{
			var i = indices.get(ij).getInteger();
			var columnTuple = columnAxis.getTupleAt(i);
			if (!columnTuple.isSelectedByList(columnSelectors))
			{
				continue;
			}
			dataLayer = seriesList.addNewStructure();
			var variance = columnTuple.isSelectedByString(oFF.VizDefConstants.K_VARIANCE);
			var valueAxis2 = !variance && columnTuple.isSelectedByString(oFF.VizDefConstants.K_VALUE_AXIS2);
			var axisIndex = valueAxis2 ? 1 : variance ? this.isCombinationChart() ? 2 : 1 : 0;
			compositemeasureName = variance ? "\u0394" : columnTuple.getPrettyText(selectorList);
			dataLayer.putString(oFF.VizDefConstants.K_NAME, compositemeasureName);
			var simpleMeasureName = variance ? "" : columnTuple.getPrettyText(columnSelectors);
			var seriesChartType = valueAxis2 ? this.getSecondChart() : this.getChartType();
			dataLayer.putString(oFF.VizDefConstants.K_TYPE, seriesChartType);
			dataLayer.putInteger(oFF.VizDefConstants.K_Y_AXIS, axisIndex);
			var currentFeedType = variance ? oFF.VizDefConstants.K_VARIANCE : valueAxis2 ? oFF.VizDefConstants.K_VALUE_AXIS2 : oFF.VizDefConstants.K_VALUE_AXIS;
			dataLayer.putString(oFF.VizDefConstants.K_AXIS, currentFeedType);
			hasVariance = hasVariance || variance;
			dataList = dataLayer.putNewList(oFF.VizDefConstants.K_DATA);
			var memberNames = columnTuple.getMemberKeys();
			errorList = null;
			var errorIndex1 = i;
			var errorIndex2 = i;
			var hasErrorBar = false;
			var tooltipIndices = null;
			var tooltipValues = null;
			if (oFF.XCollectionUtils.hasElements(memberNames))
			{
				tooltipIndices = columnAxis.getMatchingTupleIndicesForMemberNameAndFeed(memberNames, oFF.VizDefConstants.K_TOOLTIP_VALUE_AXIS);
				var errorIndex = columnAxis.getMatchingTupleIndicesForMemberNamesAndSuffix(memberNames, oFF.VizDefConstants.K_ERRORBAR_MIN);
				if (errorIndex !== -1)
				{
					errorIndex1 = errorIndex;
					hasErrorBar = true;
				}
				errorIndex = columnAxis.getMatchingTupleIndicesForMemberNamesAndSuffix(memberNames, oFF.VizDefConstants.K_ERRORBAR_MAX);
				if (errorIndex !== -1)
				{
					errorIndex2 = errorIndex;
					hasErrorBar = true;
				}
				if (hasErrorBar)
				{
					errorLayer = seriesList.addNewStructure();
					errorList = errorLayer.putNewList(oFF.VizDefConstants.K_DATA);
					errorLayer.putInteger(oFF.VizDefConstants.K_Y_AXIS, axisIndex);
					errorLayer.putString(oFF.VizDefConstants.K_TYPE, oFF.VizDefConstants.K_ERRORBAR);
					errorLayer.putStringNotNullAndNotEmpty(oFF.VizDefConstants.K_COLOR, columnAxis.getTupleAt(oFF.XMath.max(errorIndex1, errorIndex2)).getColor());
				}
			}
			var dataCell;
			var error1 = 0;
			var error2 = 0;
			var error1Formatted = "";
			var error2Formatted = "";
			if (overwriteColors)
			{
				this.addColorAndPattern(columnTuple.getColor(), columnTuple.getPattern(), dataLayer, seriesChartType, false);
			}
			if (rowCategoryCount > 0)
			{
				for (var j = 0; j < rowAxis.getTuplesCount(); j++)
				{
					if (explicitCategories && !rowAxis.getTupleAt(j).isSelectedByString(oFF.VizDefConstants.K_CATEGORY_AXIS))
					{
						continue;
					}
					if (!hideTotalOnRows || !rowAxis.getTupleAt(j).isTotal())
					{
						if (hasErrorBar)
						{
							error1 = columnAxis.getScaledValue(currentFeedType, columnAxis.getTupleAt(errorIndex1), rs.getDataCell(errorIndex1, j));
							error1Formatted = columnAxis.getFormattedValue(currentFeedType, columnAxis.getTupleAt(errorIndex1), rs.getDataCell(errorIndex1, j));
							error2 = columnAxis.getScaledValue(currentFeedType, columnAxis.getTupleAt(errorIndex2), rs.getDataCell(errorIndex2, j));
							error2Formatted = columnAxis.getFormattedValue(currentFeedType, columnAxis.getTupleAt(errorIndex2), rs.getDataCell(errorIndex2, j));
						}
						if (oFF.XCollectionUtils.hasElements(tooltipIndices))
						{
							tooltipValues = oFF.XListOfString.create();
							for (var ttindex = 0; ttindex < tooltipIndices.size(); ttindex++)
							{
								var tooltipIndex = tooltipIndices.get(ttindex).getInteger();
								tooltipValues.add(columnAxis.getFormattedValue("", columnAxis.getTupleAt(tooltipIndex), rs.getDataCell(tooltipIndex, j)));
							}
						}
						dataCell = rs.getDataCell(i, j);
						this.addValue(currentFeedType, dataList, dataCell, columnAxis, columnTuple, simpleMeasureName, errorList, error1, error2, rowAxis.getTupleAt(j).getPrettyText(rowSelector), tooltipHeaders, tooltipValues, error1Formatted, error2Formatted, overwriteColors, seriesChartType);
					}
				}
			}
			else if (rs.getDataRows() > 0)
			{
				for (var jj = 0; jj < rs.getDataRows(); jj++)
				{
					if (hasErrorBar)
					{
						error1 = columnAxis.getScaledValue(currentFeedType, columnAxis.getTupleAt(errorIndex1), rs.getDataCell(errorIndex1, jj));
						error1Formatted = columnAxis.getFormattedValue(currentFeedType, columnAxis.getTupleAt(errorIndex1), rs.getDataCell(errorIndex1, jj));
						error2 = columnAxis.getScaledValue(currentFeedType, columnAxis.getTupleAt(errorIndex2), rs.getDataCell(errorIndex2, jj));
						error2Formatted = columnAxis.getFormattedValue(currentFeedType, columnAxis.getTupleAt(errorIndex2), rs.getDataCell(errorIndex2, jj));
					}
					if (oFF.XCollectionUtils.hasElements(tooltipIndices))
					{
						tooltipValues = oFF.XListOfString.create();
						for (var tt1index = 0; tt1index < tooltipIndices.size(); tt1index++)
						{
							var tooltipIndex1 = tooltipIndices.get(tt1index).getInteger();
							tooltipValues.add(columnAxis.getFormattedValue("", columnAxis.getTupleAt(tooltipIndex1), rs.getDataCell(tooltipIndex1, jj)));
						}
					}
					dataCell = rs.getDataCell(i, jj);
					this.addValue(currentFeedType, dataList, dataCell, columnAxis, columnTuple, simpleMeasureName, errorList, error1, error2, null, tooltipHeaders, tooltipValues, error1Formatted, error2Formatted, overwriteColors, seriesChartType);
				}
			}
		}
		if (rowCategoryCount < 2)
		{
			if (pureColors.size() < 2)
			{
				this.setChartWidth(rowCategories.size());
			}
			else
			{
				this.setChartWidth(pureColors.size());
			}
		}
		else
		{
			this.setChartWidth(rowCategoryCount);
		}
		this.setWidthScale(1);
		if (oFF.XStringUtils.isNullOrEmpty(this.getStackingType()) || !oFF.XString.isEqual(this.getChartType(), oFF.VizDefConstants.V_CHART_TYPE_BAR) && !oFF.XString.isEqual(this.getChartType(), oFF.VizDefConstants.V_CHART_TYPE_COLUMN))
		{
			var divisor = this.isCombinationChart() ? 2 : 1;
			if (rowCategoryCount > 1)
			{
				this.setWidthScale(indices.size() / divisor);
			}
			else if (pureColors.size() > 1)
			{
				this.setWidthScale(oFF.XMath.max(1, pureMeasures.size() / divisor));
			}
		}
		if (seriesList.size() === 0)
		{
			chartlang.putString(oFF.VizDefConstants.K_NO_DATA, "At least one measure is required to build a chart.");
		}
	}
	var tooltip = theChartData.putNewStructure(oFF.VizDefConstants.K_TOOLTIP);
	tooltip.putString(oFF.VizDefConstants.K_POINT_FORMAT, tooltipBuffer.toString());
	tooltip.putString(oFF.VizDefConstants.K_HEADER_FORMAT, "");
	this.setHasVariance(hasVariance);
};
oFF.RsHiChartCategorialSeriesHelper.prototype.finishRendering = function() {};
oFF.RsHiChartCategorialSeriesHelper.prototype.addValue = function(currentFeedType, dataList, dataCell, axis, tuple, measureName, errorList, error1, error2, categoryName, tooltipHeaders, tooltipValues, error1Formatted, error2Formatted, enforceColor, seriesChartType)
{
	var doubleValue = 0;
	var valueType = dataCell.getValueType();
	var intermediateStructure = dataList.addNewStructure();
	if (valueType === oFF.XValueType.DOUBLE || valueType === oFF.XValueType.DECIMAL_FLOAT)
	{
		if (dataCell.getXValue() !== null)
		{
			doubleValue = axis.getScaledValue(currentFeedType, tuple, dataCell);
			intermediateStructure.putDouble(oFF.VizDefConstants.K_Y, doubleValue);
			intermediateStructure.putString(oFF.VizDefConstants.K_Y_FORMATTED, axis.getFormattedValue(currentFeedType, tuple, dataCell));
		}
		else
		{
			intermediateStructure.putString(oFF.VizDefConstants.K_Y, null);
			intermediateStructure.putString(oFF.VizDefConstants.K_Y_FORMATTED, null);
		}
		if (enforceColor)
		{
			this.addColorAndPattern(tuple.getColor(), tuple.getPattern(), intermediateStructure, seriesChartType, true);
		}
		intermediateStructure.putString(oFF.VizDefConstants.K_NAME, measureName);
		if (oFF.notNull(categoryName))
		{
			intermediateStructure.putString(oFF.VizDefConstants.K_CATEGORY, categoryName);
		}
	}
	if (oFF.notNull(errorList))
	{
		var subList = errorList.addNewList();
		subList.addDouble(error1);
		subList.addDouble(error2);
		if (error1 < error2)
		{
			intermediateStructure.putString(oFF.VizDefConstants.K_ERROR_RANGE, oFF.XStringUtils.concatenate3(oFF.XDouble.convertToString(error1), " .. ", error2Formatted));
		}
		else
		{
			intermediateStructure.putString(oFF.VizDefConstants.K_ERROR_RANGE, oFF.XStringUtils.concatenate3(oFF.XDouble.convertToString(error2), " .. ", error1Formatted));
		}
	}
	if (oFF.XCollectionUtils.hasElements(tooltipHeaders))
	{
		for (var j = 0; j < tooltipHeaders.size(); j++)
		{
			intermediateStructure.putString(oFF.XStringUtils.concatenate2(oFF.VizDefConstants.K_T_HEADER, oFF.XInteger.convertToString(j)), tooltipHeaders.get(j));
		}
	}
	if (oFF.XCollectionUtils.hasElements(tooltipValues))
	{
		for (var i = 0; i < tooltipValues.size(); i++)
		{
			intermediateStructure.putString(oFF.XStringUtils.concatenate2(oFF.VizDefConstants.K_T_FORMATTED, oFF.XInteger.convertToString(i)), tooltipValues.get(i));
		}
	}
};

oFF.RsHiChartClusterBubbleHelper = function() {};
oFF.RsHiChartClusterBubbleHelper.prototype = new oFF.RsHiChartCovariationHelper();
oFF.RsHiChartClusterBubbleHelper.prototype._ff_c = "RsHiChartClusterBubbleHelper";

oFF.RsHiChartClusterBubbleHelper.prototype.getXFeed = function()
{
	return oFF.VizDefConstants.K_VALUE_AXIS;
};
oFF.RsHiChartClusterBubbleHelper.prototype.getYFeed = function()
{
	return oFF.VizDefConstants.K_VALUE_AXIS2;
};
oFF.RsHiChartClusterBubbleHelper.prototype.getZFeed = function()
{
	return oFF.VizDefConstants.K_BUBBLE_WIDTH;
};
oFF.RsHiChartClusterBubbleHelper.prototype.decorateToolTip = function(stringBuffer)
{
	stringBuffer.append("<b>{point.name}</b>: {point.valueFormatted} <br/>");
};
oFF.RsHiChartClusterBubbleHelper.prototype.prepareRendering = function() {};
oFF.RsHiChartClusterBubbleHelper.prototype.reiterateResultSet = function(columnAxis, rowAxis, rs)
{
	var theChartData = this.getChartData();
	var yAxisList = theChartData.putNewList(oFF.VizDefConstants.K_Y_AXIS);
	var yAxis = yAxisList.addNewStructure();
	var xAxisList = theChartData.putNewList(oFF.VizDefConstants.K_X_AXIS);
	var xAxisStruct = xAxisList.addNewStructure();
	var vizProp = null;
	if (this.getVizDef() !== null)
	{
		vizProp = this.getVizDef().getStructureByKey(oFF.VizDefConstants.K_CHART).getStructureByKey(oFF.VizDefConstants.K_PROPERTIES);
		if (oFF.notNull(vizProp))
		{
			var vizPropCategoryAxis = vizProp.getStructureByKey(oFF.VizDefConstants.K_CATEGORY_AXIS);
			if (oFF.notNull(vizPropCategoryAxis))
			{
				oFF.RsHiChartUtils.axisPloter(vizPropCategoryAxis, xAxisStruct, this.getChartType(), true);
			}
			var vizPropValueAxis = vizProp.getStructureByKey(oFF.VizDefConstants.K_VALUE_AXIS);
			if (oFF.notNull(vizPropValueAxis))
			{
				yAxis = oFF.RsHiChartUtils.axisPloter(vizPropValueAxis, yAxis, this.getChartType(), false);
			}
		}
	}
	oFF.RsHiChartVizUtilsSimple.legendStyler(theChartData);
	var plotOptions = oFF.PrFactory.createStructure();
	plotOptions = theChartData.getStructureByKey(oFF.VizDefConstants.K_PLOT_OPTIONS);
	var fillColor = oFF.VizDefConstants.K_TRANSPARENT;
	if (theChartData.getListByKey(oFF.VizDefConstants.K_COLORS) !== null)
	{
		if (theChartData.getListByKey(oFF.VizDefConstants.K_COLORS).size() > 0)
		{
			fillColor = theChartData.getListByKey(oFF.VizDefConstants.K_COLORS).getStringAt(0);
		}
	}
	if (oFF.isNull(plotOptions))
	{
		plotOptions = theChartData.putNewStructure(oFF.VizDefConstants.K_PLOT_OPTIONS);
	}
	if (!oFF.XString.isEqual(this.getStackingType(), null))
	{
		oFF.RsHiChartVizUtilsSimple.dataLabelAlignment(yAxis, this.getChartType(), columnAxis.getDecimalPlaces(this.getXFeed()), false);
	}
	oFF.RsHiChartVizUtilsSimple.plotOptionChart(yAxis, this.getChartType(), this.getStackingType(), plotOptions, 0, fillColor);
	oFF.RsHiChartVizUtilsSimple.dataLabelAlignment(yAxis, this.getChartType(), columnAxis.getDecimalPlaces(this.getXFeed()), false);
};
oFF.RsHiChartClusterBubbleHelper.prototype.finishRendering = function()
{
	var theChartData = this.getChartData();
	var seriesList = theChartData.putNewList(oFF.VizDefConstants.K_SERIES);
	var intermediateList = oFF.PrFactory.createList();
	intermediateList.addAll(this.getXList());
	intermediateList.addAll(this.getYList());
	intermediateList.addAll(this.getZList());
	var intermediateListFormatted = oFF.PrFactory.createList();
	intermediateListFormatted.addAll(this.getXListFormatted());
	intermediateListFormatted.addAll(this.getYListFormatted());
	intermediateListFormatted.addAll(this.getZListFormatted());
	var measureList = oFF.XListOfString.create();
	measureList.addAll(this.getXMeasures());
	measureList.addAll(this.getYMeasures());
	measureList.addAll(this.getZMeasures());
	for (var g = 0; g < intermediateList.size(); g++)
	{
		var polarLayer = seriesList.addNewStructure();
		var newList = polarLayer.putNewList(oFF.VizDefConstants.K_DATA);
		polarLayer.putString(oFF.VizDefConstants.K_NAME, this.getColorList().get(g));
		var subList = intermediateList.getListAt(g);
		var subListFormatted = intermediateListFormatted.getListAt(g);
		for (var e = 0; e < subList.size(); e++)
		{
			var subStructure = newList.addNewStructure();
			subStructure.putDouble(oFF.VizDefConstants.K_VALUE, subList.getDoubleAt(e));
			subStructure.putString(oFF.VizDefConstants.K_VALUE_FORMATTED, subListFormatted.getStringAt(e));
			if (oFF.XCollectionUtils.hasElements(measureList))
			{
				subStructure.putString(oFF.VizDefConstants.K_NAME, measureList.get(0));
			}
			else
			{
				subStructure.putString(oFF.VizDefConstants.K_NAME, "");
			}
			this.addToolTipsToSeries(subStructure, g, e);
		}
	}
};

oFF.RsHiChartCorrelationHelper = function() {};
oFF.RsHiChartCorrelationHelper.prototype = new oFF.RsHiChartCovariationHelper();
oFF.RsHiChartCorrelationHelper.prototype._ff_c = "RsHiChartCorrelationHelper";

oFF.RsHiChartCorrelationHelper.prototype.getXFeed = function()
{
	return oFF.VizDefConstants.K_VALUE_AXIS;
};
oFF.RsHiChartCorrelationHelper.prototype.getYFeed = function()
{
	return oFF.VizDefConstants.K_VALUE_AXIS2;
};
oFF.RsHiChartCorrelationHelper.prototype.getZFeed = function()
{
	return oFF.VizDefConstants.K_BUBBLE_WIDTH;
};
oFF.RsHiChartCorrelationHelper.prototype.decorateToolTip = function(stringBuffer)
{
	stringBuffer.append("<b>{point.name}</b> <br/>");
	stringBuffer.append("<b>{point.SeriesX}</b>: {point.xFormatted} <br/>");
	stringBuffer.append("<b>{point.SeriesY}</b>: {point.yFormatted} <br/>");
	if (oFF.XCollectionUtils.hasElements(this.getZMeasures()))
	{
		stringBuffer.append("<b>{point.SeriesZ}</b>: {point.zFormatted} <br/>");
	}
};
oFF.RsHiChartCorrelationHelper.prototype.reiterateResultSet = function(columnAxis, rowAxis, rs)
{
	var theChartData = this.getChartData();
	var vizDef = this.getVizDef();
	var bubbleColor = "#FFAA49";
	var dashStyle = "Dash";
	var yAxis = theChartData.putNewList(oFF.VizDefConstants.K_Y_AXIS);
	var xAxis = theChartData.putNewList(oFF.VizDefConstants.K_X_AXIS);
	var xAxisStruct = xAxis.addNewStructure();
	var yAxisStruct = yAxis.addNewStructure();
	if (oFF.notNull(vizDef))
	{
		oFF.RsHiChartVizUtilsSimple.addReferenceLine(vizDef, xAxisStruct, yAxisStruct, columnAxis, rowAxis, rs);
		if (vizDef.containsKey(oFF.VizDefConstants.K_BUBBLE_STYLING))
		{
			var BubbleStyle = vizDef.getStructureByKey(oFF.VizDefConstants.K_BUBBLE_STYLING);
			if (oFF.notNull(BubbleStyle))
			{
				dashStyle = BubbleStyle.getStringByKey(oFF.VizDefConstants.K_PATTERN);
				bubbleColor = BubbleStyle.getStringByKey(oFF.VizDefConstants.K_COLOR);
			}
		}
	}
	var chartTypeInfo = theChartData.getStructureByKey(oFF.VizDefConstants.K_CHART);
	chartTypeInfo.putString(oFF.VizDefConstants.K_TYPE, this.getChartType());
	var chartTypeInfostyle = chartTypeInfo.putNewStructure(oFF.VizDefConstants.K_STYLE);
	chartTypeInfostyle.putString(oFF.VizDefConstants.K_FONT_FAMILY, "LatoWeb, 'Open Sans', 'Helvetica Neue', Helvetica, Arial, 'sans serif'");
	chartTypeInfostyle.putString(oFF.VizDefConstants.K_FONT_SIZE, "13px");
	chartTypeInfo.putInteger(oFF.VizDefConstants.K_MARGIN_TOP, 100);
	var valueAxisProperties = null;
	if (oFF.notNull(vizDef))
	{
		valueAxisProperties = vizDef.getStructureByKey(oFF.VizDefConstants.K_CHART).getStructureByKey(oFF.VizDefConstants.K_PROPERTIES).getStructureByKey(oFF.VizDefConstants.K_VALUE_AXIS);
	}
	oFF.RsHiChartVizUtilsCorrelation.renderValueAxis(xAxisStruct, valueAxisProperties, false);
	if (oFF.notNull(vizDef))
	{
		valueAxisProperties = vizDef.getStructureByKey(oFF.VizDefConstants.K_CHART).getStructureByKey(oFF.VizDefConstants.K_PROPERTIES).getStructureByKey(oFF.VizDefConstants.K_VALUE_AXIS2);
	}
	oFF.RsHiChartVizUtilsCorrelation.renderValueAxis(yAxisStruct, valueAxisProperties, true);
	var legend = theChartData.getStructureByKey(oFF.VizDefConstants.K_LEGEND);
	legend.putBoolean(oFF.VizDefConstants.K_SQUARE_SYMBOL, true);
	legend.putString(oFF.VizDefConstants.K_LAYOUT, oFF.VizDefConstants.V_VERTICAL);
	legend.putInteger(oFF.VizDefConstants.K_MAX_HEIGHT, 50);
	legend.putInteger(oFF.VizDefConstants.K_Y, 20);
	legend.putString(oFF.VizDefConstants.K_ALIGN, oFF.VizDefConstants.V_CENTER);
	legend.putString(oFF.VizDefConstants.K_VERTICAL_ALIGN, oFF.VizDefConstants.V_POSITION_TOP);
	var legenditemStyle = legend.putNewStructure(oFF.VizDefConstants.K_ITEM_STYLE);
	legenditemStyle.putString(oFF.VizDefConstants.K_FONT_SIZE, "12px");
	legenditemStyle.putString(oFF.VizDefConstants.K_FONT_WEIGHT, oFF.VizDefConstants.V_NORMAL);
	var plotOptions = theChartData.putNewStructure(oFF.VizDefConstants.K_PLOT_OPTIONS);
	var plotOptionChartTypeStructure = plotOptions.putNewStructure(this.getChartType());
	var plotOptionChartMarkerStructure = plotOptionChartTypeStructure.putNewStructure(oFF.VizDefConstants.K_MARKER);
	plotOptionChartMarkerStructure.putString(oFF.VizDefConstants.K_SYMBOL, oFF.VizDefConstants.V_CIRCLE);
	var shapeOptions = theChartData.putNewStructure(oFF.VizDefConstants.K_SHAPE_OPTIONS);
	if (this.getXList().size() > 1)
	{
		oFF.RsHiChartVizUtilsCorrelation.legendStyler(theChartData);
	}
	else
	{
		plotOptionChartTypeStructure.putString(oFF.VizDefConstants.K_DASH_STYLE, dashStyle);
		plotOptionChartTypeStructure.putString(oFF.VizDefConstants.K_COLOR, bubbleColor);
		plotOptionChartTypeStructure.putString(oFF.VizDefConstants.K_STROKE, bubbleColor);
		plotOptionChartTypeStructure.putString(oFF.VizDefConstants.K_FILL, bubbleColor);
		shapeOptions.putString(oFF.VizDefConstants.K_FILL, bubbleColor);
	}
	var dataLabels = plotOptionChartTypeStructure.putNewStructure(oFF.VizDefConstants.K_DATA_LABELS);
	dataLabels.putBoolean(oFF.VizDefConstants.K_ENABLED, false);
	this.addPadding(this.getXList(), xAxisStruct);
	this.addPadding(this.getYList(), yAxisStruct);
};
oFF.RsHiChartCorrelationHelper.prototype.addPadding = function(valueList, axisStruct)
{
	var valueSet = false;
	var min = 0;
	var max = 0;
	var index;
	var subIndex;
	var curValue;
	var curList;
	for (index = 0; index < valueList.size(); index++)
	{
		curList = valueList.getListAt(index);
		for (subIndex = 0; subIndex < curList.size(); subIndex++)
		{
			curValue = curList.getDoubleAt(subIndex);
			if (!valueSet || curValue > max)
			{
				max = curValue;
			}
			if (!valueSet || curValue < min)
			{
				min = curValue;
			}
			valueSet = true;
		}
	}
	var paddingMargin = (max - min) / 10;
	if (max + paddingMargin < 0)
	{
		axisStruct.putDouble(oFF.VizDefConstants.K_MAX, 0);
	}
	else
	{
		axisStruct.putDouble(oFF.VizDefConstants.K_MAX_PADDING, 0.05);
	}
	if (min - paddingMargin > 0)
	{
		axisStruct.putDouble(oFF.VizDefConstants.K_MIN, 0);
	}
	else
	{
		axisStruct.putDouble(oFF.VizDefConstants.K_MIN_PADDING, 0.05);
	}
};
oFF.RsHiChartCorrelationHelper.prototype.prepareRendering = function() {};
oFF.RsHiChartCorrelationHelper.prototype.finishRendering = function()
{
	var theChartData = this.getChartData();
	var seriesList = theChartData.putNewList(oFF.VizDefConstants.K_SERIES);
	var xList = this.getXList();
	var yList = this.getYList();
	var zList = this.getZList();
	var xListFormatted = this.getXListFormatted();
	var yListFormatted = this.getYListFormatted();
	var zListFormatted = this.getZListFormatted();
	var xtitle = oFF.XCollectionUtils.hasElements(this.getXMeasures()) ? this.getXMeasures().get(0) : "";
	var ytitle = oFF.XCollectionUtils.hasElements(this.getYMeasures()) ? this.getYMeasures().get(0) : "";
	var ztitle = oFF.XCollectionUtils.hasElements(this.getZMeasures()) ? this.getZMeasures().get(0) : "";
	if (oFF.XStringUtils.isNotNullAndNotEmpty(xtitle) || oFF.XStringUtils.isNotNullAndNotEmpty(ytitle))
	{
		var xAxistitle = this.getChartData().getListByKey(oFF.VizDefConstants.K_X_AXIS).getStructureAt(0).getStructureByKey(oFF.VizDefConstants.K_TITLE);
		xAxistitle.putString(oFF.VizDefConstants.K_TEXT, xtitle);
		var yAxistitle = this.getChartData().getListByKey(oFF.VizDefConstants.K_Y_AXIS).getStructureAt(0).getStructureByKey(oFF.VizDefConstants.K_TITLE);
		yAxistitle.putString(oFF.VizDefConstants.K_TEXT, ytitle);
	}
	var valueSizeC = 0;
	var valueY = 0;
	var valueX = 0;
	var valueSizeCFormatted = "0";
	var valueYFormatted = "0";
	var valueXFormatted = "0";
	var zListinterim = oFF.PrFactory.createList();
	var zListFormattedinterim = oFF.PrFactory.createList();
	for (var count = 0; count < xList.size(); count++)
	{
		var newdataStruct = seriesList.addNewStructure();
		var newdatalist = newdataStruct.putNewList(oFF.VizDefConstants.K_DATA);
		newdataStruct.putString(oFF.VizDefConstants.K_TYPE, this.getChartType());
		if (oFF.XCollectionUtils.hasElements(this.getColorList()))
		{
			newdataStruct.putString(oFF.VizDefConstants.K_NAME, this.getColorList().get(count));
		}
		else
		{
			newdataStruct.putString(oFF.VizDefConstants.K_NAME, "");
		}
		newdataStruct.putBoolean(oFF.VizDefConstants.K_SIZE_BY_ABSOLUTE_VALUE, true);
		var xListinterim = xList.getListAt(count);
		var xListFormattedinterim = xListFormatted.getListAt(count);
		var yListinterim = yList.getListAt(count);
		var yListFormattedinterim = yListFormatted.getListAt(count);
		if (zList.size() > 0)
		{
			zListinterim = zList.getListAt(count);
		}
		if (zListFormatted.size() > 0)
		{
			zListFormattedinterim = zListFormatted.getListAt(count);
		}
		for (var a = 0; a < this.getCategoriesList().size(); a++)
		{
			var nestedlist = oFF.PrFactory.createStructure();
			valueX = xListinterim.getDoubleAt(a);
			valueY = yListinterim.getDoubleAt(a);
			valueXFormatted = xListFormattedinterim.getStringAt(a);
			valueYFormatted = yListFormattedinterim.getStringAt(a);
			var name = this.getCategoriesList().get(a);
			nestedlist.putString(oFF.VizDefConstants.K_NAME, name);
			nestedlist.putDouble(oFF.VizDefConstants.K_X, valueX);
			nestedlist.putDouble(oFF.VizDefConstants.K_Y, valueY);
			nestedlist.putString(oFF.VizDefConstants.K_X_FORMATTED, valueXFormatted);
			nestedlist.putString(oFF.VizDefConstants.K_Y_FORMATTED, valueYFormatted);
			if (oFF.notNull(zListinterim))
			{
				if (zListinterim.size() > a)
				{
					valueSizeC = zListinterim.getDoubleAt(a);
					nestedlist.putDouble(oFF.VizDefConstants.K_Z, valueSizeC);
				}
			}
			if (oFF.notNull(zListFormattedinterim))
			{
				if (zListFormattedinterim.size() > a)
				{
					valueSizeCFormatted = zListFormattedinterim.getStringAt(a);
					nestedlist.putString(oFF.VizDefConstants.K_Z_FORMATTED, valueSizeCFormatted);
				}
			}
			nestedlist.putString(oFF.VizDefConstants.K_SERIES_X, xtitle);
			nestedlist.putString(oFF.VizDefConstants.K_SERIES_Y, ytitle);
			nestedlist.putString(oFF.VizDefConstants.K_SERIES_Z, ztitle);
			if (!(valueSizeC === 0 && valueX === 0 && valueY === 0))
			{
				newdatalist.add(nestedlist);
			}
			this.addToolTipsToSeries(nestedlist, count, a);
		}
	}
};

oFF.RsHiChartMarimekkoHelper = function() {};
oFF.RsHiChartMarimekkoHelper.prototype = new oFF.RsHiChartCovariationHelper();
oFF.RsHiChartMarimekkoHelper.prototype._ff_c = "RsHiChartMarimekkoHelper";

oFF.RsHiChartMarimekkoHelper.prototype.getXFeed = function()
{
	return oFF.VizDefConstants.K_VALUE_AXIS;
};
oFF.RsHiChartMarimekkoHelper.prototype.getYFeed = function()
{
	return oFF.VizDefConstants.K_VALUE_AXIS2;
};
oFF.RsHiChartMarimekkoHelper.prototype.getZFeed = function()
{
	return oFF.VizDefConstants.K_BUBBLE_WIDTH;
};
oFF.RsHiChartMarimekkoHelper.prototype.reiterateResultSet = function(columnAxis, rowAxis, rs)
{
	var theChartData = this.getChartData();
	var yAxisList = theChartData.putNewList(oFF.VizDefConstants.K_Y_AXIS);
	var yAxis = yAxisList.addNewStructure();
	var xAxisList = theChartData.putNewList(oFF.VizDefConstants.K_X_AXIS);
	var xAxisStruct = xAxisList.addNewStructure();
	xAxisStruct.putString(oFF.VizDefConstants.K_TYPE, oFF.VizDefConstants.K_CATEGORY);
	var vizProp = null;
	if (this.getVizDef() !== null)
	{
		vizProp = this.getVizDef().getStructureByKey(oFF.VizDefConstants.K_CHART).getStructureByKey(oFF.VizDefConstants.K_PROPERTIES);
		if (oFF.notNull(vizProp))
		{
			var vizPropCategoryAxis = vizProp.getStructureByKey(oFF.VizDefConstants.K_CATEGORY_AXIS);
			if (oFF.notNull(vizPropCategoryAxis))
			{
				xAxisStruct = oFF.RsHiChartUtils.axisPloter(vizPropCategoryAxis, xAxisStruct, this.getChartType(), true);
			}
			var vizPropValueAxis = vizProp.getStructureByKey(oFF.VizDefConstants.K_VALUE_AXIS);
			if (oFF.notNull(vizPropValueAxis))
			{
				yAxis = oFF.RsHiChartUtils.axisPloter(vizPropValueAxis, yAxis, this.getChartType(), false);
			}
			oFF.RsHiChartVizUtilsSimple.addReferenceLine(this.getVizDef(), yAxis, yAxis, columnAxis, rowAxis, rs);
		}
	}
	oFF.RsHiChartVizUtilsSimple.legendStyler(theChartData);
	var plotOptions = oFF.PrFactory.createStructure();
	plotOptions = theChartData.getStructureByKey(oFF.VizDefConstants.K_PLOT_OPTIONS);
	var fillColor = oFF.VizDefConstants.K_TRANSPARENT;
	if (theChartData.getListByKey(oFF.VizDefConstants.K_COLORS) !== null)
	{
		if (theChartData.getListByKey(oFF.VizDefConstants.K_COLORS).size() > 0)
		{
			fillColor = theChartData.getListByKey(oFF.VizDefConstants.K_COLORS).getStringAt(0);
		}
	}
	if (oFF.isNull(plotOptions))
	{
		plotOptions = theChartData.putNewStructure(oFF.VizDefConstants.K_PLOT_OPTIONS);
	}
	if (!oFF.XString.isEqual(this.getStackingType(), null))
	{
		oFF.RsHiChartVizUtilsSimple.dataLabelAlignment(yAxis, this.getChartType(), columnAxis.getDecimalPlaces(this.getXFeed()), false);
	}
	oFF.RsHiChartVizUtilsSimple.plotOptionChart(yAxis, this.getChartType(), this.getStackingType(), plotOptions, 0, fillColor);
	oFF.RsHiChartVizUtilsSimple.dataLabelAlignment(yAxis, this.getChartType(), columnAxis.getDecimalPlaces(this.getXFeed()), false);
};
oFF.RsHiChartMarimekkoHelper.prototype.decorateToolTip = function(stringBuffer)
{
	stringBuffer.append("<b>{point.xName}</b> <br/>");
	stringBuffer.append("<b>{point.yName}</b>: {point.yFormatted} <br/>");
	if (oFF.XCollectionUtils.hasElements(this.getYMeasures()))
	{
		stringBuffer.append("<b>{point.zName}</b>: {point.zFormatted} <br/>");
	}
};
oFF.RsHiChartMarimekkoHelper.prototype.prepareRendering = function() {};
oFF.RsHiChartMarimekkoHelper.prototype.finishRendering = function()
{
	var theChartData = this.getChartData();
	var seriesList = theChartData.putNewList(oFF.VizDefConstants.K_SERIES);
	var xAxisStruct = this.getChartData().putNewStructure(oFF.VizDefConstants.K_X_AXIS);
	xAxisStruct.putString(oFF.VizDefConstants.K_TYPE, oFF.VizDefConstants.K_CATEGORY);
	var xDList = xAxisStruct.putNewList(oFF.VizDefConstants.K_CATEGORIES);
	for (var i = 0; i < this.getCategoriesList().size(); i++)
	{
		xDList.addString(this.getCategoriesList().get(i));
	}
	seriesList.clear();
	if (oFF.XCollectionUtils.hasElements(this.getColorList()))
	{
		if (this.getYMeasures().size() === 0)
		{
			this.createOneDimensionalColorSeries(seriesList);
		}
		else
		{
			this.createTwoDimensionalColorSeries(seriesList);
		}
	}
	else
	{
		if (this.getYMeasures().size() === 0)
		{
			this.createOneDimensionalSeries(seriesList);
		}
		else
		{
			this.createTwoDimensionalSeries(seriesList);
		}
	}
};
oFF.RsHiChartMarimekkoHelper.prototype.createOneDimensionalSeries = function(seriesList)
{
	for (var ww = 0; ww < this.getXMeasures().size(); ww++)
	{
		var polarLayer = seriesList.addNewStructure();
		var dataLabels = polarLayer.putNewStructure(oFF.VizDefConstants.K_DATA_LABELS);
		dataLabels.putBoolean(oFF.VizDefConstants.K_ENABLED, true);
		polarLayer.putString(oFF.VizDefConstants.K_NAME, this.getXMeasures().get(ww));
		this.addColorAndPattern(this.getXColors().get(ww), this.getXPatterns().get(ww), polarLayer, oFF.VizDefConstants.K_VARIWIDE, false);
		var newList = polarLayer.putNewList(oFF.VizDefConstants.K_DATA);
		for (var uu = 0; uu < this.getCategoriesList().size(); uu++)
		{
			var ml = newList.addNewStructure();
			ml.putInteger(oFF.VizDefConstants.K_X, uu);
			ml.putDouble(oFF.VizDefConstants.K_Y, this.getXList().getListAt(ww).getDoubleAt(uu));
			ml.putDouble(oFF.VizDefConstants.K_Z, this.getXList().getListAt(ww).getDoubleAt(uu));
			ml.putString(oFF.VizDefConstants.K_Y_FORMATTED, this.getXListFormatted().getListAt(ww).getStringAt(uu));
			ml.putString(oFF.VizDefConstants.K_Z_FORMATTED, this.getXListFormatted().getListAt(ww).getStringAt(uu));
			ml.putString(oFF.VizDefConstants.K_X_NAME, this.getCategoriesList().get(uu));
			ml.putString(oFF.VizDefConstants.K_Y_NAME, this.getXMeasures().get(ww));
			ml.putString(oFF.VizDefConstants.K_Z_NAME, this.getXMeasures().get(ww));
			this.addColorAndPattern(this.getXColors().get(ww), this.getXPatterns().get(ww), ml, oFF.VizDefConstants.K_VARIWIDE, true);
			this.addToolTipsToSeries(ml, 0, uu);
		}
	}
};
oFF.RsHiChartMarimekkoHelper.prototype.createTwoDimensionalSeries = function(seriesList)
{
	for (var ww = 0; ww < this.getXMeasures().size(); ww++)
	{
		for (var vv = 0; vv < this.getYMeasures().size(); vv++)
		{
			var polarLayer = seriesList.addNewStructure();
			var dataLabels = polarLayer.putNewStructure(oFF.VizDefConstants.K_DATA_LABELS);
			dataLabels.putBoolean(oFF.VizDefConstants.K_ENABLED, true);
			polarLayer.putString(oFF.VizDefConstants.K_NAME, oFF.XStringUtils.concatenate3(this.getXMeasures().get(ww), "/", this.getYMeasures().get(vv)));
			this.addColorAndPattern(this.getXColors().get(ww), this.getXPatterns().get(ww), polarLayer, oFF.VizDefConstants.K_VARIWIDE, false);
			var newList = polarLayer.putNewList(oFF.VizDefConstants.K_DATA);
			for (var uu = 0; uu < this.getCategoriesList().size(); uu++)
			{
				var ml = newList.addNewStructure();
				this.addColorAndPattern(this.getXColors().get(ww), this.getXPatterns().get(ww), ml, oFF.VizDefConstants.K_VARIWIDE, true);
				ml.putInteger(oFF.VizDefConstants.K_X, uu);
				ml.putDouble(oFF.VizDefConstants.K_Y, this.getXList().getListAt(ww).getDoubleAt(uu));
				ml.putDouble(oFF.VizDefConstants.K_Z, this.getYList().getListAt(vv).getDoubleAt(uu));
				ml.putString(oFF.VizDefConstants.K_X_NAME, this.getCategoriesList().get(uu));
				ml.putString(oFF.VizDefConstants.K_Y_FORMATTED, this.getXListFormatted().getListAt(ww).getStringAt(uu));
				ml.putString(oFF.VizDefConstants.K_Z_FORMATTED, this.getYListFormatted().getListAt(vv).getStringAt(uu));
				ml.putString(oFF.VizDefConstants.K_Y_NAME, this.getXMeasures().get(ww));
				ml.putString(oFF.VizDefConstants.K_Z_NAME, this.getYMeasures().get(vv));
				this.addToolTipsToSeries(ml, 0, uu);
			}
		}
	}
};
oFF.RsHiChartMarimekkoHelper.prototype.createTwoDimensionalColorSeries = function(seriesList)
{
	var yListSize = this.getYList().size();
	var yMeasuresSize = this.getYMeasures().size();
	for (var cc = 0; cc < this.getColorList().size(); cc++)
	{
		var color = this.getColorList().get(cc);
		for (var ww = 0; ww < this.getXMeasures().size(); ww++)
		{
			var polarLayer = seriesList.addNewStructure();
			var dataLabels = polarLayer.putNewStructure(oFF.VizDefConstants.K_DATA_LABELS);
			dataLabels.putBoolean(oFF.VizDefConstants.K_ENABLED, true);
			polarLayer.putString(oFF.VizDefConstants.K_NAME, oFF.XStringUtils.concatenate3(color, "/", this.getXMeasures().get(ww)));
			var newList = polarLayer.putNewList(oFF.VizDefConstants.K_DATA);
			for (var uu = 0; uu < this.getCategoriesList().size(); uu++)
			{
				var xmeasure = this.getXList().getListAt(this.getXMeasures().size() * cc + ww).getDoubleAt(uu);
				var xmeasureFormatted = this.getXListFormatted().getListAt(this.getXMeasures().size() * cc + ww).getStringAt(uu);
				var ymeasureFormatted = "";
				var xName = this.getXMeasures().get(ww);
				var yName = "";
				var ymeasure = 0;
				var vv;
				for (vv = 0; vv < yListSize; vv++)
				{
					ymeasure = this.getYList().getListAt(vv).getDoubleAt(uu);
					ymeasureFormatted = this.getYListFormatted().getListAt(vv).getStringAt(uu);
					yName = this.getYMeasures().get(0);
					if (ymeasure !== 0)
					{
						break;
					}
				}
				var ml = newList.addNewStructure();
				ml.putInteger(oFF.VizDefConstants.K_X, uu);
				ml.putDouble(oFF.VizDefConstants.K_Y, xmeasure);
				ml.putDouble(oFF.VizDefConstants.K_Z, ymeasure);
				ml.putString(oFF.VizDefConstants.K_Y_FORMATTED, xmeasureFormatted);
				ml.putString(oFF.VizDefConstants.K_Z_FORMATTED, ymeasureFormatted);
				ml.putString(oFF.VizDefConstants.K_X_NAME, this.getCategoriesList().get(uu));
				ml.putString(oFF.VizDefConstants.K_Y_NAME, xName);
				ml.putString(oFF.VizDefConstants.K_Z_NAME, yName);
				this.addToolTipsToSeries(ml, oFF.XMath.div(vv, yMeasuresSize), uu);
			}
		}
	}
};
oFF.RsHiChartMarimekkoHelper.prototype.createOneDimensionalColorSeries = function(seriesList)
{
	var xMeasuresSize = this.getXMeasures().size();
	for (var cc = 0; cc < this.getColorList().size(); cc++)
	{
		var color = this.getColorList().get(cc);
		for (var ww = 0; ww < this.getXMeasures().size(); ww++)
		{
			var polarLayer = seriesList.addNewStructure();
			var dataLabels = polarLayer.putNewStructure(oFF.VizDefConstants.K_DATA_LABELS);
			dataLabels.putBoolean(oFF.VizDefConstants.K_ENABLED, true);
			polarLayer.putString(oFF.VizDefConstants.K_NAME, oFF.XStringUtils.concatenate3(color, "/", this.getXMeasures().get(ww)));
			var newList = polarLayer.putNewList(oFF.VizDefConstants.K_DATA);
			for (var uu = 0; uu < this.getCategoriesList().size(); uu++)
			{
				var xmeasure = this.getXList().getListAt(this.getXMeasures().size() * cc + ww).getDoubleAt(uu);
				var ymeasure = 0;
				var vv;
				for (vv = 0; vv < this.getXList().size(); vv++)
				{
					ymeasure = this.getXList().getListAt(vv).getDoubleAt(uu);
					if (ymeasure !== 0)
					{
						break;
					}
				}
				var xmeasureFormatted = this.getXListFormatted().getListAt(this.getXMeasures().size() * cc + ww).getStringAt(uu);
				var xName = this.getXMeasures().get(ww);
				var ml = newList.addNewStructure();
				ml.putInteger(oFF.VizDefConstants.K_X, uu);
				ml.putDouble(oFF.VizDefConstants.K_Y, xmeasure);
				ml.putDouble(oFF.VizDefConstants.K_Z, ymeasure);
				ml.putString(oFF.VizDefConstants.K_Y_FORMATTED, xmeasureFormatted);
				ml.putString(oFF.VizDefConstants.K_X_NAME, this.getCategoriesList().get(uu));
				ml.putString(oFF.VizDefConstants.K_Y_NAME, xName);
				this.addToolTipsToSeries(ml, oFF.XMath.div(vv, xMeasuresSize), uu);
			}
		}
	}
};

oFF.RsHiChartMetricHelper = function() {};
oFF.RsHiChartMetricHelper.prototype = new oFF.RsHiChartCovariationHelper();
oFF.RsHiChartMetricHelper.prototype._ff_c = "RsHiChartMetricHelper";

oFF.RsHiChartMetricHelper.prototype.isResponsive = function()
{
	return false;
};
oFF.RsHiChartMetricHelper.prototype.prepareRendering = function() {};
oFF.RsHiChartMetricHelper.prototype.finishRendering = function()
{
	var xList = this.getXList();
	if (!oFF.XCollectionUtils.hasElements(xList))
	{
		return;
	}
	var zList = this.getZList();
	var xListFormatted = this.getXListFormatted();
	var yListFormatted = this.getYListFormatted();
	var zListFormatted = this.getZListFormatted();
	if (!oFF.XCollectionUtils.hasElements(xListFormatted))
	{
		return;
	}
	var theChartData = this.getChartData();
	var seriesList = theChartData.putNewList(oFF.VizDefConstants.K_SERIES);
	var polarLayer = seriesList.addNewStructure();
	var newList = polarLayer.putNewList(oFF.VizDefConstants.K_DATA);
	var valueAxisAxisStyleFontSize = "120px";
	var categoryAxisStyleFontSize = "30px";
	var sideAxisStyleFontSize = "40px";
	var categoryAxisStyleFontColor = oFF.VizDefConstants.V_BLACK;
	var valueAxisAxisStyleFontColor = oFF.VizDefConstants.V_BLACK;
	var yStructure = newList.addNewStructure();
	yStructure.putString(oFF.VizDefConstants.K_VALUE_FORMATTED, xListFormatted.getListAt(0).getStringAt(0));
	yStructure.putDouble(oFF.VizDefConstants.K_Y, xList.getListAt(0).getDoubleAt(0));
	yStructure.putString(oFF.VizDefConstants.K_NAME, this.getXMeasures().get(0));
	var i = 0;
	var targetValues = yStructure.putNewList(oFF.VizDefConstants.K_TARGET_VALUES);
	var sb = oFF.XStringBuffer.create();
	if (yListFormatted.size() + zListFormatted.size() > 0)
	{
		sb.append("<br/><div style=\"font-size:");
		sb.append(sideAxisStyleFontSize);
		sb.append("\">");
	}
	var maxLabelSize = 0;
	var maxNumberLength = 0;
	for (i = 0; i < yListFormatted.size(); i++)
	{
		maxNumberLength = oFF.XMath.max(maxNumberLength, oFF.XString.size(yListFormatted.getListAt(i).getStringAt(0)));
		if (i < this.getYMeasures().size())
		{
			maxLabelSize = oFF.XMath.max(maxLabelSize, oFF.XString.size(this.getYMeasures().get(i)));
		}
	}
	if (zListFormatted.size() > 0)
	{
		maxNumberLength = oFF.XMath.max(maxNumberLength, oFF.XString.size(zListFormatted.getListAt(0).getStringAt(0)));
	}
	for (i = 0; i < yListFormatted.size(); i++)
	{
		var tvs = targetValues.addNewStructure();
		tvs.putString(oFF.VizDefConstants.K_TARGET_FORMATTED, yListFormatted.getListAt(i).getStringAt(0));
		var yMeasureString = "";
		if (i < this.getYMeasures().size())
		{
			yMeasureString = this.getYMeasures().get(i);
		}
		tvs.putString(oFF.VizDefConstants.K_NAME, yMeasureString);
		sb.append("<br/><div><span style=\"text-align:left;font-size:");
		sb.append(sideAxisStyleFontSize);
		sb.append(";width:");
		var spacing = 3 + maxNumberLength - oFF.XString.size(yMeasureString);
		sb.append(oFF.XInteger.convertToString(spacing));
		sb.append("em;\">{point.targetValues.");
		sb.append(oFF.XInteger.convertToString(i));
		sb.append(".targetFormatted}");
		for (var j = 0; j < spacing; j++)
		{
			sb.append("\u00A0");
		}
		sb.append(" </span><span style=\"text-align:right;font-size:");
		sb.append(sideAxisStyleFontSize);
		sb.append(";\">{point.targetValues.");
		sb.append(oFF.XInteger.convertToString(i));
		sb.append(".name}</span></div>");
	}
	if (zListFormatted.size() > 0)
	{
		yStructure.putString(oFF.VizDefConstants.K_VARIANCE, zListFormatted.getListAt(0).getStringAt(0));
		sb.append("<br/><div><span style=\"font-size:");
		sb.append(sideAxisStyleFontSize);
		sb.append(";width:");
		var tabbing = 3 + maxLabelSize + maxNumberLength - oFF.XString.size(zListFormatted.getListAt(0).getStringAt(0));
		sb.append(oFF.XInteger.convertToString(tabbing));
		sb.append("em;\">");
		sb.append(zList.getListAt(0).getDoubleAt(0) < 0 ? "\u21E9" : zList.getListAt(0).getDoubleAt(0) === 0 ? "\u21E8" : "\u21E7");
		sb.append("\u00A0{point.variance}");
		sb.append("</span><span style=\"text-align:right;font-size:");
		sb.append(sideAxisStyleFontSize);
		sb.append(";\"></span></div>");
	}
	if (yListFormatted.size() + zListFormatted.size() > 0)
	{
		sb.append("</div>");
	}
	var chartTypeInfo = theChartData.getStructureByKey(oFF.VizDefConstants.K_CHART);
	var chartLang = theChartData.putNewStructure(oFF.VizDefConstants.K_LANG);
	chartLang.putString(oFF.VizDefConstants.K_THOUSANDS_SEP, ",");
	chartTypeInfo.putInteger(oFF.VizDefConstants.K_MARGIN_TOP, 110);
	var tooltip = theChartData.putNewStructure(oFF.VizDefConstants.K_TOOLTIP);
	tooltip.putBoolean(oFF.VizDefConstants.K_ENABLED, false);
	var pane = theChartData.putNewStructure(oFF.VizDefConstants.K_PANE);
	var paneBackground = pane.putNewList(oFF.VizDefConstants.K_BACKGROUND).addNewStructure();
	paneBackground.putString(oFF.VizDefConstants.K_BACKGROUND_COLOR, "rgba(0,0,0,0)");
	paneBackground.putString(oFF.VizDefConstants.K_INNER_RADIUS, "0%");
	paneBackground.putString(oFF.VizDefConstants.K_OUTER_RADIUS, "0%");
	paneBackground.putString(oFF.VizDefConstants.K_SHAPE, oFF.VizDefConstants.V_ARC);
	pane.putInteger(oFF.VizDefConstants.K_END_ANGLE, 0);
	pane.putInteger(oFF.VizDefConstants.K_START_ANGLE, 0);
	pane.putInteger(oFF.VizDefConstants.K_SIZE, 0);
	var centerPane = pane.putNewList(oFF.VizDefConstants.V_CENTER);
	centerPane.addString("0%");
	centerPane.addString("0%");
	var yAxis = theChartData.putNewList(oFF.VizDefConstants.K_Y_AXIS);
	var yAxisStruct = yAxis.addNewStructure();
	yAxisStruct.putInteger(oFF.VizDefConstants.K_LINE_WIDTH, 0);
	yAxisStruct.putInteger(oFF.VizDefConstants.K_GRIDLINE_WIDTH, 0);
	yAxisStruct.putBoolean(oFF.VizDefConstants.K_VISIBLE, false);
	var legend = theChartData.putNewStructure(oFF.VizDefConstants.K_LEGEND);
	legend.putBoolean(oFF.VizDefConstants.K_ENABLED, false);
	var plotOptions = theChartData.putNewStructure(oFF.VizDefConstants.K_PLOT_OPTIONS);
	var plotOptionChartTypeStructure = plotOptions.putNewStructure(oFF.VizDefConstants.K_SERIES);
	var dataLabels = plotOptionChartTypeStructure.putNewStructure(oFF.VizDefConstants.K_DATA_LABELS);
	dataLabels.putBoolean(oFF.VizDefConstants.K_ENABLED, true);
	dataLabels.putString(oFF.VizDefConstants.K_ALIGN, oFF.VizDefConstants.V_RIGHT);
	dataLabels.putString(oFF.VizDefConstants.K_VERTICAL_ALIGN, oFF.VizDefConstants.V_MIDDLE);
	dataLabels.putInteger(oFF.VizDefConstants.K_Y, 0);
	dataLabels.putInteger(oFF.VizDefConstants.K_BORDER_WIDTH, 0);
	var valueAxisformat = ";\">{point.valueFormatted}</span>";
	var categoryAxisformat = ";\">{point.name}</span></div>";
	theChartData.putBoolean(oFF.VizDefConstants.K_FULL_SCREEN_ENABLED, false);
	var formatCategoryAxis = null;
	var formatValueAxis = null;
	var format = null;
	formatCategoryAxis = oFF.XStringUtils.concatenate5("<div><span style=\"font-size:", categoryAxisStyleFontSize, ";color:", categoryAxisStyleFontColor, categoryAxisformat);
	formatValueAxis = oFF.XStringUtils.concatenate5("<span style=\"font-size:", valueAxisAxisStyleFontSize, ";color:", valueAxisAxisStyleFontColor, valueAxisformat);
	var formatTerciaryAxis = sb.toString();
	format = oFF.XStringUtils.concatenate4(formatValueAxis, "<br/>", formatCategoryAxis, formatTerciaryAxis);
	dataLabels.putString(oFF.VizDefConstants.K_FORMAT, format);
	var styleDatalabels = dataLabels.putNewStructure(oFF.VizDefConstants.K_STYLE);
	styleDatalabels.putString(oFF.VizDefConstants.K_TEXT_OUTLINE, "0px");
	var plotOptionSolidGauge = plotOptions.putNewStructure(oFF.VizDefConstants.K_SOLID_GAUGE);
	plotOptionSolidGauge.putBoolean(oFF.VizDefConstants.K_ANIMATION, false);
};
oFF.RsHiChartMetricHelper.prototype.getXFeed = function()
{
	return oFF.VizDefConstants.K_VALUE_AXIS;
};
oFF.RsHiChartMetricHelper.prototype.getYFeed = function()
{
	return oFF.VizDefConstants.K_VALUE_AXIS2;
};
oFF.RsHiChartMetricHelper.prototype.getZFeed = function()
{
	return oFF.VizDefConstants.K_VARIANCE;
};

oFF.RsHiChartPieHelper = function() {};
oFF.RsHiChartPieHelper.prototype = new oFF.RsHiChartCovariationHelper();
oFF.RsHiChartPieHelper.prototype._ff_c = "RsHiChartPieHelper";

oFF.RsHiChartPieHelper.prototype.isShowLegend = function()
{
	return true;
};
oFF.RsHiChartPieHelper.prototype.getXFeed = function()
{
	return oFF.VizDefConstants.K_SIZE;
};
oFF.RsHiChartPieHelper.prototype.getYFeed = function()
{
	return null;
};
oFF.RsHiChartPieHelper.prototype.getZFeed = function()
{
	return null;
};
oFF.RsHiChartPieHelper.prototype.decorateToolTip = function(stringBuffer)
{
	stringBuffer.append("<b>{point.name}</b>: {point.yFormatted} <br/>");
};
oFF.RsHiChartPieHelper.prototype.prepareRendering = function()
{
	var theChartData = this.getChartData();
	var chartTypeInfo = theChartData.getStructureByKey(oFF.VizDefConstants.K_CHART);
	var chartTypeInfostyle = chartTypeInfo.putNewStructure(oFF.VizDefConstants.K_STYLE);
	chartTypeInfostyle.putString(oFF.VizDefConstants.K_FONT_FAMILY, "LatoWeb, 'Open Sans', 'Helvetica Neue', Helvetica, Arial, 'sans serif'");
	chartTypeInfostyle.putString(oFF.VizDefConstants.K_FONT_SIZE, "13px");
	var legend = theChartData.getStructureByKey(oFF.VizDefConstants.K_LEGEND);
	legend.putBoolean(oFF.VizDefConstants.K_SQUARE_SYMBOL, true);
	legend.putInteger(oFF.VizDefConstants.K_SYMBOL_RADIUS, 0);
	legend.putString(oFF.VizDefConstants.K_LAYOUT, oFF.VizDefConstants.V_HORIZONTAL);
	legend.putString(oFF.VizDefConstants.K_ALIGN, oFF.VizDefConstants.V_CENTER);
	legend.putString(oFF.VizDefConstants.K_VERTICAL_ALIGN, oFF.VizDefConstants.V_POSITION_TOP);
	var plotOptions = theChartData.putNewStructure(oFF.VizDefConstants.K_PLOT_OPTIONS);
	var yAxis = theChartData.putNewList(oFF.VizDefConstants.K_Y_AXIS);
	var yAxisStruct = yAxis.addNewStructure();
	var yAxisTitle = yAxisStruct.putNewStructure(oFF.VizDefConstants.K_TITLE);
	yAxisTitle.putString(oFF.VizDefConstants.K_TEXT, "");
	var plotOptionChartTypeStructure = plotOptions.putNewStructure(this.getChartType());
	plotOptionChartTypeStructure.putBoolean(oFF.VizDefConstants.K_SHOW_IN_LEGEND, true);
	plotOptionChartTypeStructure.putString(oFF.VizDefConstants.K_INNER_SIZE, this.getInnerRadius());
	var dataLabels = plotOptionChartTypeStructure.putNewStructure(oFF.VizDefConstants.K_DATA_LABELS);
	dataLabels.putBoolean(oFF.VizDefConstants.K_ENABLED, true);
	dataLabels.putString(oFF.VizDefConstants.K_FORMAT, "{point.percentage:.2f} %");
	dataLabels.putBoolean(oFF.VizDefConstants.K_HIDE_WHEN_OVERLAP, true);
	dataLabels.putInteger(oFF.VizDefConstants.K_DISTANCE, 15);
	var dataLabelsStyle = dataLabels.putNewStructure(oFF.VizDefConstants.K_STYLE);
	dataLabelsStyle.putString(oFF.VizDefConstants.K_FONT_WEIGHT, oFF.VizDefConstants.V_FONT_WEIGHT_BOLD);
	dataLabelsStyle.putString(oFF.VizDefConstants.K_FONT_FAMILY, "LatoWeb, 'Open Sans', 'Helvetica Neue', Helvetica, Arial, 'sans serif'");
	dataLabelsStyle.putString(oFF.VizDefConstants.K_FONT_SIZE, "12px");
	dataLabelsStyle.putString(oFF.VizDefConstants.K_COLOR, "rgb(88,89,91)");
};
oFF.RsHiChartPieHelper.prototype.finishRendering = function()
{
	var theChartData = this.getChartData();
	var seriesList = theChartData.putNewList(oFF.VizDefConstants.K_SERIES);
	var polarLayer = seriesList.addNewStructure();
	var newList = polarLayer.putNewList(oFF.VizDefConstants.K_DATA);
	if (this.getXList().size() === 0)
	{
		return;
	}
	polarLayer.putString(oFF.VizDefConstants.K_NAME, this.getXMeasures().get(0));
	var xList = this.getXListRemapped();
	var yList = this.getYListRemapped();
	var xListFormatted = this.getXListFormattedRemapped();
	var yListFormatted = this.getYListFormattedRemapped();
	var categoriesList = this.getCategoriesList();
	for (var p = 0; p < xList.size(); p++)
	{
		var newstruct = newList.addNewStructure();
		var yValue = xList.getDoubleAt(p);
		var yValueFormatted = oFF.XDouble.convertToString(yValue);
		var zValue = 0.0;
		var zValueFormatted = "0.0";
		if (p < xListFormatted.size())
		{
			yValueFormatted = xListFormatted.getStringAt(p);
		}
		if (p < yList.size())
		{
			zValue = yList.getDoubleAt(p);
			zValueFormatted = oFF.XDouble.convertToString(zValue);
		}
		if (p < yListFormatted.size())
		{
			zValueFormatted = yListFormatted.getStringAt(p);
		}
		newstruct.putString(oFF.VizDefConstants.K_Y_FORMATTED, yValueFormatted);
		newstruct.putString(oFF.VizDefConstants.K_Z_FORMATTED, zValueFormatted);
		newstruct.putDouble(oFF.VizDefConstants.K_Y, yValue);
		newstruct.putDouble(oFF.VizDefConstants.K_Z, zValue);
		this.addToolTipsToSeries(newstruct, 0, p);
		if (categoriesList.size() > p)
		{
			var s = categoriesList.get(p);
			newstruct.putString(oFF.VizDefConstants.K_NAME, s);
		}
	}
};

oFF.RsHiChartTimeSeriesHelper = function() {};
oFF.RsHiChartTimeSeriesHelper.prototype = new oFF.RsHiChartSeriesHelper();
oFF.RsHiChartTimeSeriesHelper.prototype._ff_c = "RsHiChartTimeSeriesHelper";

oFF.RsHiChartTimeSeriesHelper.addValue = function(dataList, date, dataCell, axis, tuple, measureName, errorList, error1, error2, categoryName, tooltipHeaders, tooltipValues, error1Formatted, error2Formatted, enforceColor)
{
	var doubleValue = 0;
	var valueType = dataCell.getValueType();
	var intermediateStructure = dataList.addNewStructure();
	if (valueType === oFF.XValueType.DOUBLE || valueType === oFF.XValueType.DECIMAL_FLOAT)
	{
		intermediateStructure.putDouble(oFF.VizDefConstants.K_X, date.getMilliseconds());
		if (dataCell.getXValue() !== null)
		{
			doubleValue = dataCell.getDouble();
			intermediateStructure.putDouble(oFF.VizDefConstants.K_Y, doubleValue);
			intermediateStructure.putString(oFF.VizDefConstants.K_Y_FORM, axis.getFormattedValue(oFF.VizDefConstants.K_VALUE_AXIS, tuple, dataCell));
			intermediateStructure.putDouble(oFF.VizDefConstants.K_PERCENT, doubleValue * 100);
		}
		else
		{
			intermediateStructure.putString(oFF.VizDefConstants.K_Y, null);
			intermediateStructure.putString(oFF.VizDefConstants.K_Y_FORM, null);
		}
		if (enforceColor)
		{
			intermediateStructure.putStringNotNullAndNotEmpty(oFF.VizDefConstants.K_COLOR, tuple.getColor());
		}
		intermediateStructure.putString(oFF.VizDefConstants.K_NAME, measureName);
		if (oFF.notNull(categoryName))
		{
			intermediateStructure.putString(oFF.VizDefConstants.K_CATEGORY_FORM, categoryName);
		}
	}
	if (oFF.notNull(errorList))
	{
		var subList = errorList.addNewList();
		subList.addDouble(error1);
		subList.addDouble(error2);
		if (error1 < error2)
		{
			intermediateStructure.putString(oFF.VizDefConstants.K_ERROR_RANGE, oFF.XStringUtils.concatenate3(oFF.XDouble.convertToString(error1), " .. ", error2Formatted));
		}
		else
		{
			intermediateStructure.putString(oFF.VizDefConstants.K_ERROR_RANGE, oFF.XStringUtils.concatenate3(oFF.XDouble.convertToString(error2), " .. ", error1Formatted));
		}
	}
	if (oFF.XCollectionUtils.hasElements(tooltipHeaders))
	{
		for (var j = 0; j < tooltipHeaders.size(); j++)
		{
			intermediateStructure.putString(oFF.XStringUtils.concatenate2(oFF.VizDefConstants.K_T_HEADER, oFF.XInteger.convertToString(j)), tooltipHeaders.get(j));
		}
	}
	if (oFF.XCollectionUtils.hasElements(tooltipValues))
	{
		for (var i = 0; i < tooltipValues.size(); i++)
		{
			intermediateStructure.putString(oFF.XStringUtils.concatenate2(oFF.VizDefConstants.K_T_FORMATTED, oFF.XInteger.convertToString(i)), tooltipValues.get(i));
		}
	}
};
oFF.RsHiChartTimeSeriesHelper.prototype.isTimeseries = function()
{
	return true;
};
oFF.RsHiChartTimeSeriesHelper.prototype.prepareRendering = function() {};
oFF.RsHiChartTimeSeriesHelper.prototype.readResultSetData = function(columnAxis, rowAxis, rs)
{
	var theChartData = this.getChartData();
	var dataList = null;
	var dataLayer = null;
	var chartlang = theChartData.putNewStructure(oFF.VizDefConstants.K_LANG);
	var seriesList = theChartData.putNewList(oFF.VizDefConstants.K_SERIES);
	var tooltipBuffer = oFF.XStringBuffer.create();
	tooltipBuffer.append("<b>{series.name}</b><br/>");
	var errorList;
	tooltipBuffer.append("<b>{point.name}</b>:  {point.yForm}<br/>");
	var dataAvailable = false;
	var columnSelectors = oFF.XListOfString.create();
	columnSelectors.add(oFF.VizDefConstants.K_VALUE_AXIS);
	columnSelectors.add(oFF.VizDefConstants.K_VALUE_AXIS2);
	columnSelectors.add(oFF.VizDefConstants.K_VARIANCE);
	var pureColors = columnAxis.getPrettyNamesForFeed(true, false, oFF.VizDefConstants.K_COLOR);
	if (rs.getAvailableDataCellCount() > 0)
	{
		var tooltipHeaders = columnAxis.getPrettyNamesForFeed(true, false, oFF.VizDefConstants.K_TOOLTIP_VALUE_AXIS);
		for (var ti = 0; ti < tooltipHeaders.size(); ti++)
		{
			tooltipBuffer.append("<b>{point.tHeader");
			tooltipBuffer.append(oFF.XInteger.convertToString(ti));
			tooltipBuffer.append("}</b>:  {point.tFormatted");
			tooltipBuffer.append(oFF.XInteger.convertToString(ti));
			tooltipBuffer.append("}<br/>");
		}
		tooltipBuffer.append("{point.errorRange}<br/>");
		tooltipBuffer.append("{point.categoryForm}<br/>");
		var rowList = rowAxis.getDateList();
		var rowFormattedList = rowAxis.getFormattedDateList();
		if (oFF.XCollectionUtils.hasElements(rowList))
		{
			var indices = columnAxis.getIndicesByFeedOrder(columnSelectors);
			var selectorList = oFF.XListOfString.create();
			selectorList.add(oFF.VizDefConstants.K_COLOR);
			selectorList.addAll(columnSelectors);
			this.setShowLegend(indices.size() > 1);
			for (var ij = 0; ij < indices.size(); ij++)
			{
				var i = indices.get(ij).getInteger();
				var columnTuple = columnAxis.getTupleAt(i);
				if (!columnTuple.isSelectedByString(oFF.VizDefConstants.K_VALUE_AXIS))
				{
					continue;
				}
				var overwriteColors = pureColors.size() < 2;
				dataLayer = seriesList.addNewStructure();
				dataLayer.putString(oFF.VizDefConstants.K_NAME, columnTuple.getPrettyDefaultText());
				dataList = dataLayer.putNewList(oFF.VizDefConstants.K_DATA);
				if (overwriteColors)
				{
					dataLayer.putStringNotNullAndNotEmpty(oFF.VizDefConstants.K_COLOR, columnTuple.getColor());
				}
				var memberNames = columnTuple.getMemberKeys();
				errorList = null;
				var errorIndex1 = i;
				var errorIndex2 = i;
				var hasErrorBar = false;
				var tooltipIndices = null;
				var tooltipValues = null;
				if (oFF.XCollectionUtils.hasElements(memberNames))
				{
					tooltipIndices = columnAxis.getMatchingTupleIndicesForMemberNameAndFeed(memberNames, oFF.VizDefConstants.K_TOOLTIP_VALUE_AXIS);
					var errorIndex = columnAxis.getMatchingTupleIndicesForMemberNamesAndSuffix(memberNames, oFF.VizDefConstants.K_ERRORBAR_MIN);
					if (errorIndex !== -1)
					{
						errorIndex1 = errorIndex;
						hasErrorBar = true;
					}
					errorIndex = columnAxis.getMatchingTupleIndicesForMemberNamesAndSuffix(memberNames, oFF.VizDefConstants.K_ERRORBAR_MAX);
					if (errorIndex !== -1)
					{
						errorIndex2 = errorIndex;
						hasErrorBar = true;
					}
					if (hasErrorBar)
					{
						var errorLayer = seriesList.addNewStructure();
						errorList = errorLayer.putNewList(oFF.VizDefConstants.K_DATA);
						errorLayer.putString(oFF.VizDefConstants.K_TYPE, oFF.VizDefConstants.K_ERRORBAR);
					}
				}
				for (var j = 0; j < rowAxis.getTuplesCount(); j++)
				{
					if (!rowAxis.getTupleAt(j).isSelectedByString(oFF.VizDefConstants.K_TIME_AXIS))
					{
						continue;
					}
					var date = rowList.get(j);
					var error1 = 0;
					var error2 = 0;
					var error1Formatted = "";
					var error2Formatted = "";
					if (oFF.notNull(date))
					{
						if (hasErrorBar)
						{
							error1 = rs.getDataCell(errorIndex1, j).getDouble();
							error1Formatted = columnAxis.getFormattedValue(oFF.VizDefConstants.K_VALUE_AXIS, columnAxis.getTupleAt(errorIndex1), rs.getDataCell(errorIndex1, j));
							error2 = rs.getDataCell(errorIndex2, j).getDouble();
							error2Formatted = columnAxis.getFormattedValue(oFF.VizDefConstants.K_VALUE_AXIS, columnAxis.getTupleAt(errorIndex2), rs.getDataCell(errorIndex2, j));
						}
						if (oFF.XCollectionUtils.hasElements(tooltipIndices))
						{
							tooltipValues = oFF.XListOfString.create();
							for (var ttindex = 0; ttindex < tooltipIndices.size(); ttindex++)
							{
								var tooltipIndex = tooltipIndices.get(ttindex).getInteger();
								tooltipValues.add(columnAxis.getFormattedValue("", columnAxis.getTupleAt(tooltipIndex), rs.getDataCell(tooltipIndex, j)));
							}
						}
						var dataCell = rs.getDataCell(i, j);
						if (!rowAxis.getTupleAt(j).isTotal())
						{
							oFF.RsHiChartTimeSeriesHelper.addValue(dataList, date, dataCell, columnAxis, columnTuple, columnTuple.getPrettyDefaultText(), errorList, error1, error2, rowFormattedList.get(j), tooltipHeaders, tooltipValues, error1Formatted, error2Formatted, overwriteColors);
							dataAvailable = true;
						}
					}
				}
			}
			var tooltip = theChartData.putNewStructure(oFF.VizDefConstants.K_TOOLTIP);
			tooltip.putString(oFF.VizDefConstants.K_POINT_FORMAT, tooltipBuffer.toString());
			tooltip.putString(oFF.VizDefConstants.K_HEADER_FORMAT, "");
		}
	}
	if (!dataAvailable)
	{
		chartlang.putString(oFF.VizDefConstants.K_NO_DATA, "Firefly Resultset is Empty.");
		theChartData.putBoolean(oFF.VizDefConstants.K_FULL_SCREEN_ENABLED, false);
	}
};
oFF.RsHiChartTimeSeriesHelper.prototype.finishRendering = function()
{
	this.getChartData().putBoolean(oFF.VizDefConstants.K_IS_TIME_SERIES, true);
};

oFF.RsHiChartTreemapHelper = function() {};
oFF.RsHiChartTreemapHelper.prototype = new oFF.RsHiChartCovariationHelper();
oFF.RsHiChartTreemapHelper.prototype._ff_c = "RsHiChartTreemapHelper";

oFF.RsHiChartTreemapHelper.prototype.prepareRendering = function() {};
oFF.RsHiChartTreemapHelper.prototype.finishRendering = function()
{
	var theChartData = this.getChartData();
	var seriesList = theChartData.putNewList(oFF.VizDefConstants.K_SERIES);
	var polarLayer = seriesList.addNewStructure();
	polarLayer.putString(oFF.VizDefConstants.K_LAYOUT_ALGORITHM, oFF.VizDefConstants.V_TREEMAP_LAYOUT_STRIP);
	var newList = polarLayer.putNewList(oFF.VizDefConstants.K_DATA);
	if (this.getXList().size() === 0)
	{
		return;
	}
	if (this.getYMeasures().size() > 0)
	{
		polarLayer.putString(oFF.VizDefConstants.K_NAME, this.getYMeasures().get(0));
	}
	else if (this.getXMeasures().size() > 0)
	{
		polarLayer.putString(oFF.VizDefConstants.K_NAME, this.getXMeasures().get(0));
	}
	else
	{
		polarLayer.putString(oFF.VizDefConstants.K_NAME, "");
	}
	var xList = this.getXListRemapped();
	var yList = this.getYListRemapped();
	var xListFormatted = this.getXListFormattedRemapped();
	var yListFormatted = this.getYListFormattedRemapped();
	var xMeasures = this.getXMeasures();
	var yMeasures = this.getYMeasures();
	var categoriesLabels = this.getCategoryLabels();
	var twoDimensional = oFF.XCollectionUtils.hasElements(yMeasures);
	if (!twoDimensional)
	{
		yList = xList;
		yListFormatted = xListFormatted;
		yMeasures = xMeasures;
	}
	var dataLabels = polarLayer.putNewStructure(oFF.VizDefConstants.K_DATA_LABELS);
	dataLabels.putString(oFF.VizDefConstants.K_POINT_FORMAT, "<b>{point.name}</b><br/> {point.valueFormatted}");
	var xValues = 0;
	var yValues = 0;
	var xValuesFormatted = "0";
	var yValuesFormatted = "0";
	var keySet = oFF.XHashSetOfString.create();
	for (var k = 0; k < categoriesLabels.size(); k++)
	{
		var element = categoriesLabels.get(k);
		xValues = xList.getDoubleAt(k);
		yValues = yList.getDoubleAt(k);
		xValuesFormatted = xListFormatted.getStringAt(k);
		yValuesFormatted = yListFormatted.getStringAt(k);
		var newStructure = this.getNewLabeledStructure(newList, element, keySet);
		if (element.isLeafOrCollapsed())
		{
			newStructure.putDouble(oFF.VizDefConstants.K_VALUE, xValues);
			newStructure.putDouble(oFF.VizDefConstants.K_COLOR_VALUE, yValues);
		}
		newStructure.putString(oFF.VizDefConstants.K_VALUE_FORMATTED, xValuesFormatted);
		newStructure.putString(oFF.VizDefConstants.K_COLOR_VALUE_FORMATTED, yValuesFormatted);
		newStructure.putString(oFF.VizDefConstants.K_COLOR_NAME, yMeasures.get(0));
		newStructure.putString(oFF.VizDefConstants.K_VALUE_NAME, xMeasures.get(0));
		newStructure.putString(oFF.VizDefConstants.K_TYPE, this.getChartType());
		this.addToolTipsToSeries(newStructure, 0, k);
	}
	oFF.RsHiChartVizUtilsHeatmap.rendrerHeatmap(this.getChartData(), this.getChartType(), this.getVizDef(), this.getGlobalDef());
};
oFF.RsHiChartTreemapHelper.prototype.getNewLabeledStructure = function(newList, element, keySet)
{
	if (keySet.contains(element.getCompoundId()))
	{
		return null;
	}
	if (element.getParent() !== null)
	{
		this.getNewLabeledStructure(newList, element.getParent(), keySet);
	}
	keySet.add(element.getCompoundId());
	var newStructure = newList.addNewStructure();
	newStructure.putString(oFF.VizDefConstants.K_ID, element.getCompoundId());
	if (element.getParent() !== null)
	{
		newStructure.putString(oFF.VizDefConstants.K_PARENT, element.getParent().getCompoundId());
	}
	newStructure.putString(oFF.VizDefConstants.K_NAME, element.getLabel());
	if (!element.isLeafOrCollapsed())
	{
		newStructure.putInteger(oFF.VizDefConstants.K_BORDER_WIDTH, oFF.XMath.div(6, element.getDisplayLevel() + 1));
		newStructure.putString(oFF.VizDefConstants.K_BORDER_COLOR, "grey");
	}
	return newStructure;
};
oFF.RsHiChartTreemapHelper.prototype.getXFeed = function()
{
	return oFF.VizDefConstants.K_WEIGHT;
};
oFF.RsHiChartTreemapHelper.prototype.getYFeed = function()
{
	return oFF.VizDefConstants.K_COLOR;
};
oFF.RsHiChartTreemapHelper.prototype.getZFeed = function()
{
	return null;
};
oFF.RsHiChartTreemapHelper.prototype.decorateToolTip = function(stringBuffer)
{
	stringBuffer.append("<b>{point.name}</b><br/><b>{point.valueName}</b>: {point.valueFormatted} <br/>");
	if (oFF.XCollectionUtils.hasElements(this.getYMeasures()))
	{
		stringBuffer.append("<b>{point.colorName}</b>: {point.colorValueFormatted} <br/>");
	}
};

oFF.RsHiChartWordcloudHelper = function() {};
oFF.RsHiChartWordcloudHelper.prototype = new oFF.RsHiChartCovariationHelper();
oFF.RsHiChartWordcloudHelper.prototype._ff_c = "RsHiChartWordcloudHelper";

oFF.RsHiChartWordcloudHelper.prototype.getXFeed = function()
{
	return oFF.VizDefConstants.K_SIZE;
};
oFF.RsHiChartWordcloudHelper.prototype.getYFeed = function()
{
	return null;
};
oFF.RsHiChartWordcloudHelper.prototype.getZFeed = function()
{
	return null;
};
oFF.RsHiChartWordcloudHelper.prototype.decorateToolTip = function(stringBuffer)
{
	stringBuffer.append("<b>{point.name}</b>: {point.weightFormatted}  <br/>");
};
oFF.RsHiChartWordcloudHelper.prototype.prepareRendering = function()
{
	var theChartData = this.getChartData();
	var chartTypeInfo = theChartData.getStructureByKey(oFF.VizDefConstants.K_CHART);
	var chartTypeInfostyle = chartTypeInfo.putNewStructure(oFF.VizDefConstants.K_STYLE);
	chartTypeInfostyle.putString(oFF.VizDefConstants.K_FONT_FAMILY, "LatoWeb, 'Open Sans', 'Helvetica Neue', Helvetica, Arial, 'sans serif'");
	chartTypeInfostyle.putString(oFF.VizDefConstants.K_FONT_SIZE, "13px");
	var legend = theChartData.getStructureByKey(oFF.VizDefConstants.K_LEGEND);
	legend.putBoolean(oFF.VizDefConstants.K_SQUARE_SYMBOL, true);
	legend.putInteger(oFF.VizDefConstants.K_SYMBOL_RADIUS, 0);
	legend.putString(oFF.VizDefConstants.K_LAYOUT, oFF.VizDefConstants.V_HORIZONTAL);
	legend.putString(oFF.VizDefConstants.K_ALIGN, oFF.VizDefConstants.V_CENTER);
	legend.putString(oFF.VizDefConstants.K_VERTICAL_ALIGN, oFF.VizDefConstants.V_POSITION_TOP);
	var plotOptions = theChartData.putNewStructure(oFF.VizDefConstants.K_PLOT_OPTIONS);
	var yAxis = theChartData.putNewList(oFF.VizDefConstants.K_Y_AXIS);
	var yAxisStruct = yAxis.addNewStructure();
	var yAxisTitle = yAxisStruct.putNewStructure(oFF.VizDefConstants.K_TITLE);
	yAxisTitle.putString(oFF.VizDefConstants.K_TEXT, "");
	var plotOptionChartTypeStructure = plotOptions.putNewStructure(this.getChartType());
	var plotOptionChartTypeStructureStyle = plotOptionChartTypeStructure.putNewStructure(oFF.VizDefConstants.K_STYLE);
	plotOptionChartTypeStructureStyle.putString(oFF.VizDefConstants.K_FONT_FAMILY, "LatoWeb, 'Open Sans', 'Helvetica Neue', Helvetica, Arial, 'sans serif'");
	var plotOptionChartTypeStructureRotation = plotOptionChartTypeStructure.putNewStructure(oFF.VizDefConstants.K_ROTATION);
	plotOptionChartTypeStructureRotation.putInteger(oFF.VizDefConstants.K_FROM, -45);
	plotOptionChartTypeStructureRotation.putInteger(oFF.VizDefConstants.K_TO, 25);
	plotOptionChartTypeStructure.putString(oFF.VizDefConstants.K_PLACEMENT_STRATEGY, "center");
	plotOptionChartTypeStructure.putBoolean(oFF.VizDefConstants.K_SHOW_IN_LEGEND, true);
	var dataLabels = plotOptionChartTypeStructure.putNewStructure(oFF.VizDefConstants.K_DATA_LABELS);
	dataLabels.putBoolean(oFF.VizDefConstants.K_ENABLED, true);
	dataLabels.putString(oFF.VizDefConstants.K_FORMAT, "{point.percentage:.2f} %");
	dataLabels.putBoolean(oFF.VizDefConstants.K_HIDE_WHEN_OVERLAP, true);
	dataLabels.putInteger(oFF.VizDefConstants.K_DISTANCE, 15);
	var dataLabelsStyle = dataLabels.putNewStructure(oFF.VizDefConstants.K_STYLE);
	dataLabelsStyle.putString(oFF.VizDefConstants.K_FONT_WEIGHT, oFF.VizDefConstants.K_BOLD);
	dataLabelsStyle.putString(oFF.VizDefConstants.K_FONT_FAMILY, "LatoWeb, 'Open Sans', 'Helvetica Neue', Helvetica, Arial, 'sans serif'");
	dataLabelsStyle.putString(oFF.VizDefConstants.K_FONT_SIZE, "12px");
	dataLabelsStyle.putString(oFF.VizDefConstants.K_COLOR, "rgb(88,89,91)");
};
oFF.RsHiChartWordcloudHelper.prototype.finishRendering = function()
{
	var theChartData = this.getChartData();
	var seriesList = theChartData.putNewList(oFF.VizDefConstants.K_SERIES);
	var xList = this.getXList();
	var xlistFormatted = this.getXListFormatted();
	var listSize = xList.size();
	for (var o = 0; o < listSize; o++)
	{
		var polarLayer = seriesList.addNewStructure();
		polarLayer.putString(oFF.VizDefConstants.K_NAME, this.getXMeasures().get(o));
		var newList = polarLayer.putNewList(oFF.VizDefConstants.K_DATA);
		var xListSub = xList.getListAt(o);
		var xListFormattedSub = xlistFormatted.getListAt(o);
		for (var p = 0; p < xListSub.size(); p++)
		{
			var newStruct = newList.addNewStructure();
			var yValue = xListSub.getDoubleAt(p);
			var yValueFormatted = oFF.XDouble.convertToString(yValue);
			if (p < xListFormattedSub.size())
			{
				yValueFormatted = xListFormattedSub.getStringAt(p);
			}
			newStruct.putDouble(oFF.VizDefConstants.K_WEIGHT, yValue);
			newStruct.putString(oFF.VizDefConstants.K_WEIGHT_FORMATTED, yValueFormatted);
			var nameString = this.getCategoriesList().get(p);
			newStruct.putString(oFF.VizDefConstants.K_NAME, nameString);
			newStruct.putString(oFF.VizDefConstants.K_TYPE, this.getChartType());
			this.addToolTipsToSeries(newStruct, o, p);
		}
	}
};

oFF.ReferenceGrid2 = function() {};
oFF.ReferenceGrid2.prototype = new oFF.ReferenceGrid();
oFF.ReferenceGrid2.prototype._ff_c = "ReferenceGrid2";

oFF.ReferenceGrid2.createWithName2 = function(gridName, resultSet)
{
	var grid = new oFF.ReferenceGrid2();
	grid.setupSimpleGrid(resultSet, false, false);
	return grid;
};
oFF.ReferenceGrid2.prototype.prepareCellStructure = function(useRowsHeaderPane, useColumnsHeaderPane)
{
	if (oFF.notNull(this.m_resultSet))
	{
		this.prepareStructure(useRowsHeaderPane, useColumnsHeaderPane);
	}
};
oFF.ReferenceGrid2.prototype.formatDataCellValue = function(dataCell)
{
	var value;
	if (dataCell.getXValue() !== null && dataCell.getXValue().getValueType() === oFF.XValueType.DOUBLE)
	{
		var stringRepresentation = dataCell.getXValue().getStringRepresentation();
		value = oFF.XNumberFormatter.formatDoubleToString(oFF.XDouble.convertFromString(stringRepresentation), "#,#.###");
	}
	else
	{
		value = dataCell.getFormattedValue();
	}
	return value;
};

oFF.OlapDataPrg = function() {};
oFF.OlapDataPrg.prototype = new oFF.DfApplicationProgram();
oFF.OlapDataPrg.prototype._ff_c = "OlapDataPrg";

oFF.OlapDataPrg.SYSTEM_NAME = "system";
oFF.OlapDataPrg.QUERY = "query";
oFF.OlapDataPrg.OUTPUT = "output";
oFF.OlapDataPrg.main = function()
{
	oFF.KernelNativeModule.getInstance();
	var kernelBoot = oFF.KernelBoot.createByName("olapdata");
	kernelBoot.setArgument("system", "KIW");
	kernelBoot.setArgument("query", "query:[0BICS_C03_BICSTEST_Q0000]");
	kernelBoot.setDefaultSyncType(oFF.SyncType.BLOCKING);
	kernelBoot.runFull();
};
oFF.OlapDataPrg.prototype.newProgram = function()
{
	var newPrg = new oFF.OlapDataPrg();
	newPrg.setup();
	return newPrg;
};
oFF.OlapDataPrg.prototype.doSetupProgramMetadata = function(metadata)
{
	oFF.DfApplicationProgram.prototype.doSetupProgramMetadata.call( this , metadata);
	metadata.addMandatoryOption(oFF.OlapDataPrg.SYSTEM_NAME, "The system name", "", oFF.XValueType.STRING);
	metadata.addMandatoryOption(oFF.OlapDataPrg.QUERY, "The query name", "", oFF.XValueType.STRING);
	metadata.addOption(oFF.OlapDataPrg.OUTPUT, "Output DOM id. If not given, the output is written on the console", "", oFF.XValueType.STRING);
};
oFF.OlapDataPrg.prototype.runProcess = function()
{
	this.writeToOutput("Initializing Query Manager...");
	var application = this.getApplication();
	var args = this.getArguments();
	var systemName = args.getStringByKey(oFF.OlapDataPrg.SYSTEM_NAME);
	var queryName = args.getStringByKey(oFF.OlapDataPrg.QUERY);
	var serviceCfg = oFF.QueryServiceConfig.createWithDataSourceName(application, systemName, queryName);
	serviceCfg.processQueryManagerCreation(null, this, null);
	return false;
};
oFF.OlapDataPrg.prototype.onQueryManagerCreated = function(extResult, queryManager, customIdentifier)
{
	if (extResult.hasErrors())
	{
		this.writeToOutput(extResult.getSummary());
	}
	else
	{
		this.writeToOutput("Loading Resultset...");
		queryManager.processQueryExecution(null, this, null);
	}
};
oFF.OlapDataPrg.prototype.onQueryExecuted = function(extResult, resultSetContainer, customIdentifier)
{
	if (extResult.hasErrors())
	{
		this.writeToOutput(extResult.getSummary());
	}
	else
	{
		var classicResultSet = resultSetContainer.getClassicResultSet();
		var grid = oFF.ReferenceGrid.create(classicResultSet);
		var ascii = grid.exportToAscii(30);
		this.writeToOutput(oFF.XStringUtils.concatenate3("<pre>", ascii, "</pre>"));
	}
};
oFF.OlapDataPrg.prototype.writeToOutput = function(text)
{
	var args = this.getArguments();
	var output = args.getStringByKey(oFF.OlapDataPrg.OUTPUT);
	if (oFF.XStringUtils.isNotNullAndNotEmpty(output))
	{
		oFF.DocumentEnv.setStringAtId(output, text);
	}
	else
	{
		this.println(text);
	}
};

oFF.OlapReferenceModule = function() {};
oFF.OlapReferenceModule.prototype = new oFF.DfModule();
oFF.OlapReferenceModule.prototype._ff_c = "OlapReferenceModule";

oFF.OlapReferenceModule.s_module = null;
oFF.OlapReferenceModule.getInstance = function()
{
	if (oFF.isNull(oFF.OlapReferenceModule.s_module))
	{
		oFF.DfModule.checkInitialized(oFF.OlapApiModule.getInstance());
		oFF.OlapReferenceModule.s_module = oFF.DfModule.startExt(new oFF.OlapReferenceModule());
		oFF.ReferenceGridFactory.setInstance(oFF.ReferenceGridFactoryImpl.create());
		oFF.FioriGridFactory.setInstance(oFF.FioriGridFactoryImpl.create());
		oFF.RsGoogleChartConfig.staticSetup();
		oFF.ChartRendererFactory.setInstance(oFF.ChartRendererFactoryImpl.create());
		oFF.KpiRendererFactory.setInstance(oFF.KpiRendererFactoryImpl.create());
		oFF.GridRendererFactory.setInstance(oFF.GridRendererFactoryImpl.create());
		oFF.GridResolverFactory.setInstance(oFF.GridResolverFactoryImpl.create());
		oFF.DfModule.stopExt(oFF.OlapReferenceModule.s_module);
	}
	return oFF.OlapReferenceModule.s_module;
};
oFF.OlapReferenceModule.prototype.getName = function()
{
	return "ff4340.olap.reference";
};

oFF.OlapReferenceModule.getInstance();

return sap.firefly;
	} );