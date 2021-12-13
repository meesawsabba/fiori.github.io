/*!
 * SAPUI5
  (c) Copyright 2009-2021 SAP SE. All rights reserved
 */
/*global sap*/
sap.ui.define(
[
"sap/zen/dsh/firefly/ff2220.ui.program"
],
function(oFF)
{
"use strict";

oFF.DayUiModel = function() {};
oFF.DayUiModel.prototype = new oFF.XObject();
oFF.DayUiModel.prototype._ff_c = "DayUiModel";

oFF.DayUiModel.create = function(dayNumberAsString, isPartOfCurrentMonth, isWeekend)
{
	var obj = new oFF.DayUiModel();
	obj.m_dayNumberAsString = dayNumberAsString;
	obj.m_isPartOfCurrentMonth = isPartOfCurrentMonth;
	obj.m_isWeekend = isWeekend;
	return obj;
};
oFF.DayUiModel.prototype.m_dayNumberAsString = null;
oFF.DayUiModel.prototype.m_isPartOfCurrentMonth = false;
oFF.DayUiModel.prototype.m_isWeekend = false;
oFF.DayUiModel.prototype.getDayNumber = function()
{
	return this.m_dayNumberAsString;
};
oFF.DayUiModel.prototype.isPartOfCurrentMode = function()
{
	return this.m_isPartOfCurrentMonth;
};
oFF.DayUiModel.prototype.isWeekend = function()
{
	return this.m_isWeekend;
};

oFF.MonthUiModel = function() {};
oFF.MonthUiModel.prototype = new oFF.XObject();
oFF.MonthUiModel.prototype._ff_c = "MonthUiModel";

oFF.MonthUiModel.createWithYearAndMonth = function(year, month)
{
	var obj = new oFF.MonthUiModel();
	obj.m_calendar = oFF.XGregorianCalendar.createWithYearMonthDay(year, month, 1);
	obj.m_calendar.setFirstDayOfWeek(oFF.DateConstants.SUNDAY);
	obj.m_calendar.setMinimalDaysInFirstWeek(4);
	obj.createMonthNames();
	obj.createWeekNames();
	obj.setWeeks();
	return obj;
};
oFF.MonthUiModel.create = function()
{
	var currentTimeInMilli = oFF.XSystemUtils.getCurrentTimeInMilliseconds();
	var obj = new oFF.MonthUiModel();
	obj.m_calendar = oFF.XGregorianCalendar.create();
	obj.m_calendar.setTimeInMillis(currentTimeInMilli);
	obj.m_calendar.setFirstDayOfWeek(oFF.DateConstants.SUNDAY);
	obj.m_calendar.setMinimalDaysInFirstWeek(4);
	obj.createMonthNames();
	obj.createWeekNames();
	obj.setWeeks();
	return obj;
};
oFF.MonthUiModel.prototype.m_monthNames = null;
oFF.MonthUiModel.prototype.m_weekdayNames = null;
oFF.MonthUiModel.prototype.m_calendar = null;
oFF.MonthUiModel.prototype.m_weeks = null;
oFF.MonthUiModel.prototype.createWeekNames = function()
{
	this.m_weekdayNames = oFF.XArrayOfString.create(7);
	this.m_weekdayNames.set(0, "Sun");
	this.m_weekdayNames.set(1, "Mon");
	this.m_weekdayNames.set(2, "Tue");
	this.m_weekdayNames.set(3, "Wed");
	this.m_weekdayNames.set(4, "Thu");
	this.m_weekdayNames.set(5, "Fri");
	this.m_weekdayNames.set(6, "Sat");
};
oFF.MonthUiModel.prototype.createMonthNames = function()
{
	this.m_monthNames = oFF.XArrayOfString.create(12);
	this.m_monthNames.set(0, "January");
	this.m_monthNames.set(1, "February");
	this.m_monthNames.set(2, "March");
	this.m_monthNames.set(3, "April");
	this.m_monthNames.set(4, "May");
	this.m_monthNames.set(5, "June");
	this.m_monthNames.set(6, "July");
	this.m_monthNames.set(7, "August");
	this.m_monthNames.set(8, "September");
	this.m_monthNames.set(9, "October");
	this.m_monthNames.set(10, "November");
	this.m_monthNames.set(11, "December");
};
oFF.MonthUiModel.prototype.getMonthString = function()
{
	return this.m_monthNames.get(this.m_calendar.get(oFF.DateConstants.MONTH) - 1);
};
oFF.MonthUiModel.prototype.addOneMonth = function()
{
	this.m_calendar.add(oFF.DateConstants.MONTH, 1);
	this.setWeeks();
};
oFF.MonthUiModel.prototype.subtractOneMonth = function()
{
	this.m_calendar.add(oFF.DateConstants.MONTH, -1);
	this.setWeeks();
};
oFF.MonthUiModel.prototype.setWeeks = function()
{
	oFF.XObjectExt.release(this.m_weeks);
	var weeks = oFF.XList.create();
	var currentMonth = oFF.XGregorianCalendar.createWithYearMonthDay(this.m_calendar.get(oFF.DateConstants.YEAR), this.m_calendar.get(oFF.DateConstants.MONTH), 1);
	currentMonth.setMinimalDaysInFirstWeek(this.m_calendar.getMinimalDaysInFirstWeek());
	currentMonth.setFirstDayOfWeek(this.m_calendar.getFirstDayOfWeek());
	var dayOfWeekFirstDayOfMonth = currentMonth.get(oFF.DateConstants.DAY_OF_WEEK);
	currentMonth.add(oFF.DateConstants.DAY_OF_MONTH, -dayOfWeekFirstDayOfMonth);
	while (currentMonth.get(oFF.DateConstants.MONTH) <= this.m_calendar.get(oFF.DateConstants.MONTH) || this.m_calendar.get(oFF.DateConstants.MONTH) === oFF.DateConstants.JANUARY && currentMonth.get(oFF.DateConstants.MONTH) === oFF.DateConstants.DECEMBER)
	{
		if (this.m_calendar.get(oFF.DateConstants.MONTH) === oFF.DateConstants.DECEMBER && currentMonth.get(oFF.DateConstants.YEAR) > this.m_calendar.get(oFF.DateConstants.YEAR))
		{
			break;
		}
		var daysOfWeek = oFF.XArray.create(7);
		for (var i = 0; i < 7; i++)
		{
			currentMonth.add(oFF.DateConstants.DAY_OF_MONTH, 1);
			var isPartOfCurrentMonth = currentMonth.get(oFF.DateConstants.MONTH) === this.m_calendar.get(oFF.DateConstants.MONTH);
			var isWeekend = currentMonth.get(oFF.DateConstants.DAY_OF_WEEK) === oFF.DateConstants.SATURDAY || currentMonth.get(oFF.DateConstants.DAY_OF_WEEK) === oFF.DateConstants.SUNDAY;
			var dayUiModel = oFF.DayUiModel.create(oFF.XInteger.convertToString(currentMonth.get(oFF.DateConstants.DAY_OF_MONTH)), isPartOfCurrentMonth, isWeekend);
			daysOfWeek.set(i, dayUiModel);
		}
		var weekNumber = currentMonth.get(oFF.DateConstants.WEEK_OF_YEAR);
		var week = oFF.WeekUiModel.create(weekNumber, daysOfWeek);
		if (!this.isAllWeekNotPartOfMonth(daysOfWeek))
		{
			weeks.add(week);
		}
	}
	this.m_weeks = weeks;
};
oFF.MonthUiModel.prototype.isAllWeekNotPartOfMonth = function(week)
{
	for (var i = 0; i < week.size(); i++)
	{
		if (week.get(i).isPartOfCurrentMode())
		{
			return false;
		}
	}
	return true;
};
oFF.MonthUiModel.prototype.getWeeks = function()
{
	return this.m_weeks;
};
oFF.MonthUiModel.prototype.getYear = function()
{
	return this.m_calendar.get(oFF.DateConstants.YEAR);
};
oFF.MonthUiModel.prototype.getYearString = function()
{
	return oFF.XInteger.convertToString(this.m_calendar.get(oFF.DateConstants.YEAR));
};
oFF.MonthUiModel.prototype.getWeekdayNames = function()
{
	return this.m_weekdayNames;
};
oFF.MonthUiModel.prototype.getMonth = function()
{
	return this.m_calendar.get(oFF.DateConstants.MONTH);
};

oFF.WeekUiModel = function() {};
oFF.WeekUiModel.prototype = new oFF.XObject();
oFF.WeekUiModel.prototype._ff_c = "WeekUiModel";

oFF.WeekUiModel.create = function(weekOfYear, days)
{
	var obj = new oFF.WeekUiModel();
	obj.m_weekOfYear = weekOfYear;
	obj.m_days = days;
	return obj;
};
oFF.WeekUiModel.prototype.m_weekOfYear = 0;
oFF.WeekUiModel.prototype.m_days = null;
oFF.WeekUiModel.prototype.getWeekOfYearNumber = function()
{
	return oFF.XInteger.convertToString(this.m_weekOfYear);
};
oFF.WeekUiModel.prototype.getWeekDays = function()
{
	return this.m_days;
};

oFF.YearSelectionUiModel = function() {};
oFF.YearSelectionUiModel.prototype = new oFF.XObject();
oFF.YearSelectionUiModel.prototype._ff_c = "YearSelectionUiModel";

oFF.YearSelectionUiModel.create = function(year)
{
	var obj = new oFF.YearSelectionUiModel();
	obj.m_year = year;
	obj.calculateFirstAndLastYear();
	return obj;
};
oFF.YearSelectionUiModel.prototype.m_firstYear = 0;
oFF.YearSelectionUiModel.prototype.m_year = 0;
oFF.YearSelectionUiModel.prototype.m_lastYear = 0;
oFF.YearSelectionUiModel.prototype.getFirstYear = function()
{
	return this.m_firstYear;
};
oFF.YearSelectionUiModel.prototype.getLastYear = function()
{
	return this.m_lastYear;
};
oFF.YearSelectionUiModel.prototype.getYear = function()
{
	return this.m_year;
};
oFF.YearSelectionUiModel.prototype.toString = function()
{
	var firstYearString = oFF.XInteger.convertToString(this.m_firstYear);
	var lastYearString = oFF.XInteger.convertToString(this.m_lastYear);
	return oFF.XStringUtils.concatenate3(firstYearString, " - ", lastYearString);
};
oFF.YearSelectionUiModel.prototype.calculateFirstAndLastYear = function()
{
	this.m_firstYear = this.m_year - 10;
	this.m_lastYear = this.m_year + 9;
};
oFF.YearSelectionUiModel.prototype.subtractYears = function()
{
	this.m_year = this.m_year - 20;
	this.calculateFirstAndLastYear();
};
oFF.YearSelectionUiModel.prototype.addYears = function()
{
	this.m_year = this.m_year + 20;
	this.calculateFirstAndLastYear();
};

oFF.YearUiModel = function() {};
oFF.YearUiModel.prototype = new oFF.XObject();
oFF.YearUiModel.prototype._ff_c = "YearUiModel";

oFF.YearUiModel.create = function()
{
	var currentTimeInMilli = oFF.XSystemUtils.getCurrentTimeInMilliseconds();
	var obj = new oFF.YearUiModel();
	var calendar = oFF.XGregorianCalendar.create();
	calendar.setTimeInMillis(currentTimeInMilli);
	obj.m_year = calendar.get(oFF.DateConstants.YEAR);
	obj.setMonths();
	return obj;
};
oFF.YearUiModel.createWithYear = function(year)
{
	var obj = new oFF.YearUiModel();
	obj.m_year = year;
	obj.setMonths();
	return obj;
};
oFF.YearUiModel.prototype.m_year = 0;
oFF.YearUiModel.prototype.m_months = null;
oFF.YearUiModel.prototype.setMonths = function()
{
	oFF.XObjectExt.release(this.m_months);
	this.m_months = oFF.XArray.create(12);
	for (var i = oFF.DateConstants.JANUARY; i <= oFF.DateConstants.DECEMBER; i++)
	{
		this.m_months.set(i - 1, oFF.MonthUiModel.createWithYearAndMonth(this.m_year, i));
	}
};
oFF.YearUiModel.prototype.getYearString = function()
{
	return oFF.XInteger.convertToString(this.m_year);
};
oFF.YearUiModel.prototype.getMonths = function()
{
	return this.m_months;
};

oFF.WeekView = function() {};
oFF.WeekView.prototype = new oFF.XObject();
oFF.WeekView.prototype._ff_c = "WeekView";

oFF.WeekView.create = function(uiGenesis, weekUiModel)
{
	var obj = new oFF.WeekView();
	obj.m_weekUiModel = weekUiModel;
	obj.m_uiGenesis = uiGenesis;
	obj.buildUi();
	return obj;
};
oFF.WeekView.prototype.m_uiGenesis = null;
oFF.WeekView.prototype.m_root = null;
oFF.WeekView.prototype.m_weekUiModel = null;
oFF.WeekView.prototype.buildUi = function()
{
	this.m_root = this.m_uiGenesis.newControl(oFF.UiType.FLEX_LAYOUT);
	this.m_root.setDirection(oFF.UiFlexDirection.ROW);
	var weekNumberLayout = this.m_root.addNewItemOfType(oFF.UiType.FLEX_LAYOUT);
	weekNumberLayout.setDirection(oFF.UiFlexDirection.COLUMN_REVERSE);
	weekNumberLayout.setJustifyContent(oFF.UiFlexJustifyContent.CENTER);
	weekNumberLayout.setWidth(oFF.UiCssLength.create("100%"));
	weekNumberLayout.setFlex("1");
	var weekNumberButton = weekNumberLayout.addNewItemOfType(oFF.UiType.BUTTON);
	weekNumberButton.setText(this.m_weekUiModel.getWeekOfYearNumber());
	weekNumberButton.setButtonType(oFF.UiButtonType.TRANSPARENT);
	weekNumberButton.setEnabled(false);
	weekNumberButton.setWidth(oFF.UiCssLength.create("100%"));
	weekNumberButton.setHeight(oFF.UiCssLength.create("100%"));
	weekNumberButton.setPadding(oFF.UiCssBoxEdges.create("0px"));
	for (var i = 0; i < this.m_weekUiModel.getWeekDays().size(); i++)
	{
		var dayUiModel = this.m_weekUiModel.getWeekDays().get(i);
		var dayButton = this.m_root.addNewItemOfType(oFF.UiType.BUTTON);
		dayButton.setText(dayUiModel.getDayNumber());
		dayButton.setButtonType(oFF.UiButtonType.TRANSPARENT);
		dayButton.setWidth(oFF.UiCssLength.create("100%"));
		dayButton.setHeight(oFF.UiCssLength.create("100%"));
		dayButton.setPadding(oFF.UiCssBoxEdges.create("0px"));
		dayButton.setFlex("1");
		if (!dayUiModel.isPartOfCurrentMode())
		{
			dayButton.setEnabled(false);
		}
		if (dayUiModel.isPartOfCurrentMode() && dayUiModel.isWeekend())
		{
			dayButton.setBackgroundColor(oFF.UiColor.create("#dedede"));
		}
	}
};
oFF.WeekView.prototype.getRoot = function()
{
	return this.m_root;
};

oFF.YearView = function() {};
oFF.YearView.prototype = new oFF.XObject();
oFF.YearView.prototype._ff_c = "YearView";

oFF.YearView.MONTHS_PER_LINE = 3;
oFF.YearView.NUMBER_OF_LINES = 4;
oFF.YearView.create = function(genesis, uiModel)
{
	var obj = new oFF.YearView();
	obj.m_uiGenesis = genesis;
	obj.m_uiModel = uiModel;
	obj.buildUi();
	return obj;
};
oFF.YearView.prototype.m_uiGenesis = null;
oFF.YearView.prototype.m_uiModel = null;
oFF.YearView.prototype.m_root = null;
oFF.YearView.prototype.m_topLayout = null;
oFF.YearView.prototype.m_yearLabel = null;
oFF.YearView.prototype.m_yearLayout = null;
oFF.YearView.prototype.buildUi = function()
{
	this.m_root = this.m_uiGenesis.newControl(oFF.UiType.VERTICAL_LAYOUT);
	this.m_topLayout = this.m_root.addNewItemOfType(oFF.UiType.HORIZONTAL_LAYOUT);
	this.m_topLayout.setAlignSelf(oFF.UiFlexAlignSelf.CENTER);
	this.m_yearLabel = this.m_topLayout.addNewItemOfType(oFF.UiType.LABEL);
	this.m_yearLayout = this.m_root.addNewItemOfType(oFF.UiType.MATRIX_LAYOUT);
	this.setContent();
};
oFF.YearView.prototype.setContent = function()
{
	this.m_yearLabel.setText(this.m_uiModel.getYearString());
	this.setYearGrid();
};
oFF.YearView.prototype.setYearGrid = function()
{
	this.buildYearGrid();
	var months = this.m_uiModel.getMonths();
	var monthIndex = 0;
	for (var i = 0; i < oFF.YearView.NUMBER_OF_LINES; i++)
	{
		var monthRow = this.m_yearLayout.getMatrixLayoutRow(i);
		for (var j = 0; j < oFF.YearView.MONTHS_PER_LINE; j++)
		{
			var monthCell = monthRow.getMatrixLayoutCell(j);
			var monthView = oFF.FlexMonthView.create(this.m_uiGenesis, months.get(monthIndex), false);
			var cellLayout = this.m_uiGenesis.newControl(oFF.UiType.VERTICAL_LAYOUT);
			cellLayout.addItem(monthView.getRoot());
			monthCell.setContent(cellLayout);
			monthIndex++;
		}
	}
};
oFF.YearView.prototype.buildYearGrid = function()
{
	for (var i = 0; i < oFF.YearView.NUMBER_OF_LINES; i++)
	{
		var row = this.m_yearLayout.getMatrixLayoutRow(i);
		this.m_yearLayout.removeMatrixLayoutRow(row);
		oFF.XObjectExt.release(row);
	}
	for (var k = 0; k < oFF.YearView.NUMBER_OF_LINES; k++)
	{
		var monthsRow = this.m_yearLayout.addNewMatrixLayoutRow();
		for (var j = 0; j < oFF.YearView.MONTHS_PER_LINE; j++)
		{
			monthsRow.addNewMatrixLayoutCell();
		}
	}
};
oFF.YearView.prototype.getRoot = function()
{
	return this.m_root;
};

oFF.FeApolloDialog = function() {};
oFF.FeApolloDialog.prototype = new oFF.XObject();
oFF.FeApolloDialog.prototype._ff_c = "FeApolloDialog";

oFF.FeApolloDialog.createFileExplorer = function()
{
	var obj = new oFF.FeApolloDialog();
	obj.setupDialog();
	return obj;
};
oFF.FeApolloDialog.prototype.m_application = null;
oFF.FeApolloDialog.prototype.m_fileExplorerWindowContainer = null;
oFF.FeApolloDialog.prototype.setupDialog = function()
{
	this.m_application = oFF.ApplicationFactory.createDefaultApplication();
	var session = this.m_application.getSession();
	var newApolloPrg = oFF.FeApollo.createNewApollo();
	newApolloPrg.setProcess(session);
	var appProgram = newApolloPrg;
	appProgram.setApplication(this.m_application);
	this.m_fileExplorerWindowContainer = oFF.UiPrgContainerWindow.createExt(null, newApolloPrg);
	this.m_fileExplorerWindowContainer.setTitle("File Explorer");
};
oFF.FeApolloDialog.prototype.releaseObject = function()
{
	this.m_fileExplorerWindowContainer = oFF.XObjectExt.release(this.m_fileExplorerWindowContainer);
	this.m_application = oFF.XObjectExt.release(this.m_application);
	oFF.XObject.prototype.releaseObject.call( this );
};
oFF.FeApolloDialog.prototype.open = function()
{
	if (oFF.notNull(this.m_fileExplorerWindowContainer) && this.m_fileExplorerWindowContainer.isContainerOpen() === false)
	{
		var uiManager = this.m_application.getUiManager();
		this.m_fileExplorerWindowContainer.openAndRun(uiManager);
	}
};

oFF.FeApolloFileExtension = function() {};
oFF.FeApolloFileExtension.prototype = new oFF.XObject();
oFF.FeApolloFileExtension.prototype._ff_c = "FeApolloFileExtension";

oFF.FeApolloFileExtension.s_apolloExtenstions = null;
oFF.FeApolloFileExtension.s_defaultApolloExtension = null;
oFF.FeApolloFileExtension.s_prgApolloExtension = null;
oFF.FeApolloFileExtension.staticSetup = function()
{
	if (oFF.notNull(oFF.FeApolloFileExtension.s_apolloExtenstions))
	{
		return;
	}
	oFF.FeApolloFileExtension.s_apolloExtenstions = oFF.XHashMapByString.create();
	oFF.FeApolloFileExtension.registerNewExtension("qsa", "Quasar", "Quasar Viewer");
	oFF.FeApolloFileExtension.registerNewExtension("pos", "Poseidon", "Poseidon Viewer");
	oFF.FeApolloFileExtension.registerNewExtension("gsp", "GalaxyStudio", "Galaxy Studio");
	oFF.FeApolloFileExtension.registerNewExtension("krs", "Kreios", "Kreios Viewer");
	oFF.FeApolloFileExtension.registerNewExtension("asd", "Atlas", "SAC Story Renderer");
	oFF.FeApolloFileExtension.registerNewExtension("gdf", "GalaxyDataStudio", "Galaxy Data Studio");
	oFF.FeApolloFileExtension.registerNewExtension("txt", oFF.TeAthena.DEFAULT_PROGRAM_NAME, "Text Editor").addArgument(oFF.TeAthena.PARAM_TYPE, "text").setDefault();
	oFF.FeApolloFileExtension.registerNewExtension("json", oFF.TeAthena.DEFAULT_PROGRAM_NAME, "JSON Editor").addArgument(oFF.TeAthena.PARAM_TYPE, "json");
	oFF.FeApolloFileExtension.registerNewExtension("js", oFF.TeAthena.DEFAULT_PROGRAM_NAME, "JavaScript Editor").addArgument(oFF.TeAthena.PARAM_TYPE, "javascript");
	oFF.FeApolloFileExtension.registerNewExtension("java", oFF.TeAthena.DEFAULT_PROGRAM_NAME, "Java Editor").addArgument(oFF.TeAthena.PARAM_TYPE, "java");
	oFF.FeApolloFileExtension.registerNewExtension("ts", oFF.TeAthena.DEFAULT_PROGRAM_NAME, "Typescript Editor").addArgument(oFF.TeAthena.PARAM_TYPE, "ts");
	oFF.FeApolloFileExtension.registerNewExtension("css", oFF.TeAthena.DEFAULT_PROGRAM_NAME, "CSS Editor").addArgument(oFF.TeAthena.PARAM_TYPE, "css");
	oFF.FeApolloFileExtension.registerNewExtension("html", oFF.TeAthena.DEFAULT_PROGRAM_NAME, "HTML Editor").addArgument(oFF.TeAthena.PARAM_TYPE, "html");
	oFF.FeApolloFileExtension.registerNewExtension("cpp", oFF.TeAthena.DEFAULT_PROGRAM_NAME, "C++ Editor").addArgument(oFF.TeAthena.PARAM_TYPE, "c_cpp");
	oFF.FeApolloFileExtension.registerNewExtension("swift", oFF.TeAthena.DEFAULT_PROGRAM_NAME, "Swift Editor").addArgument(oFF.TeAthena.PARAM_TYPE, "swift");
	oFF.FeApolloFileExtension.registerNewExtension("m", oFF.TeAthena.DEFAULT_PROGRAM_NAME, "ObjC Editor").addArgument(oFF.TeAthena.PARAM_TYPE, "objectivec");
	oFF.FeApolloFileExtension.assignAdditionalApolloExtensionToExtension("qsa", "pos");
	oFF.FeApolloFileExtension.assignAdditionalApolloExtensionToExtension("qsa", "gsp");
	oFF.FeApolloFileExtension.assignAdditionalApolloExtensionToExtension("qsa", "krs");
	oFF.FeApolloFileExtension.assignAdditionalApolloExtensionToExtension("qsa", "json");
	oFF.FeApolloFileExtension.assignAdditionalApolloExtensionToExtension("gdf", "json");
	oFF.FeApolloFileExtension.s_prgApolloExtension = oFF.FeApolloFileExtension.registerNewExtension("prg", null, "Program");
};
oFF.FeApolloFileExtension.registerNewExtension = function(extension, programName, friendlyName)
{
	var newConstant = new oFF.FeApolloFileExtension();
	newConstant.setupInternal(extension, programName, friendlyName);
	return newConstant;
};
oFF.FeApolloFileExtension.assignAdditionalApolloExtensionToExtension = function(extension, additionalExtension)
{
	var apolloFileExtension = oFF.FeApolloFileExtension.lookup(extension);
	var additionalApolloFileExtension = oFF.FeApolloFileExtension.lookup(additionalExtension);
	if (oFF.isNull(apolloFileExtension))
	{
		throw oFF.XException.createIllegalArgumentException(oFF.XStringUtils.concatenate3("Could not find the extension ", extension, ". Do you try to add additional apollo extension to a non registered exntension?"));
	}
	if (oFF.isNull(additionalApolloFileExtension))
	{
		throw oFF.XException.createIllegalArgumentException(oFF.XStringUtils.concatenate3("Could not find the additional extension ", additionalExtension, ". Does the apollo extension exist?"));
	}
	apolloFileExtension.addAdditionalApolloExtension(additionalApolloFileExtension);
};
oFF.FeApolloFileExtension.lookup = function(name)
{
	var valueLower = oFF.XString.toLowerCase(name);
	return oFF.FeApolloFileExtension.s_apolloExtenstions.getByKey(valueLower);
};
oFF.FeApolloFileExtension.getApolloExtensionForFile = function(file)
{
	if (oFF.isNull(file) || file.getFileType() === oFF.XFileType.DIR)
	{
		return null;
	}
	if (file.getFileType() === oFF.XFileType.PRG)
	{
		return oFF.FeApolloFileExtension.s_prgApolloExtension;
	}
	var fileName = file.getName();
	var extension = null;
	var extPoint = oFF.XString.lastIndexOf(fileName, ".");
	if (extPoint !== -1)
	{
		extension = oFF.XString.substring(fileName, extPoint + 1, -1);
	}
	var fileExtRegistration = oFF.FeApolloFileExtension.lookup(extension);
	if (oFF.isNull(fileExtRegistration))
	{
		fileExtRegistration = oFF.FeApolloFileExtension.s_defaultApolloExtension;
	}
	if (oFF.notNull(fileExtRegistration))
	{
		return fileExtRegistration;
	}
	return null;
};
oFF.FeApolloFileExtension.prototype.m_extension = null;
oFF.FeApolloFileExtension.prototype.m_programName = null;
oFF.FeApolloFileExtension.prototype.m_friendlyName = null;
oFF.FeApolloFileExtension.prototype.m_additionalApolloExtensions = null;
oFF.FeApolloFileExtension.prototype.m_argumentsStructure = null;
oFF.FeApolloFileExtension.prototype.releaseObject = function()
{
	this.m_additionalApolloExtensions.clear();
	this.m_additionalApolloExtensions = oFF.XObjectExt.release(this.m_additionalApolloExtensions);
	this.m_argumentsStructure = oFF.XObjectExt.release(this.m_argumentsStructure);
	oFF.XObject.prototype.releaseObject.call( this );
};
oFF.FeApolloFileExtension.prototype.getExtension = function()
{
	return this.m_extension;
};
oFF.FeApolloFileExtension.prototype.getProgramName = function()
{
	return this.m_programName;
};
oFF.FeApolloFileExtension.prototype.getFriendlyName = function()
{
	return this.m_friendlyName;
};
oFF.FeApolloFileExtension.prototype.getAdditionalApolloExtensions = function()
{
	return this.m_additionalApolloExtensions;
};
oFF.FeApolloFileExtension.prototype.getProgramManifest = function()
{
	if (this.isExecutable())
	{
		return null;
	}
	var prgManifest = oFF.ProgramRegistration.getProgramManifest(this.m_programName);
	if (oFF.notNull(prgManifest))
	{
		return prgManifest;
	}
	return null;
};
oFF.FeApolloFileExtension.prototype.getDefaultArguments = function()
{
	var prgArgs = oFF.ProgramArgs.create();
	if (oFF.notNull(this.m_argumentsStructure) && this.m_argumentsStructure.size() > 0)
	{
		prgArgs.getArgumentStructure().putAll(this.m_argumentsStructure);
	}
	return prgArgs;
};
oFF.FeApolloFileExtension.prototype.isExecutable = function()
{
	return oFF.XString.isEqual("prg", this.getExtension());
};
oFF.FeApolloFileExtension.prototype.setupInternal = function(extension, programName, friendlyName)
{
	this.m_extension = extension;
	this.m_programName = programName;
	this.m_friendlyName = friendlyName;
	this.m_additionalApolloExtensions = oFF.XList.create();
	this.m_argumentsStructure = oFF.PrFactory.createStructure();
	if (oFF.FeApolloFileExtension.s_apolloExtenstions.containsKey(extension))
	{
		throw oFF.XException.createIllegalArgumentException(oFF.XStringUtils.concatenate3("The extension ", extension, " is already registered!"));
	}
	oFF.FeApolloFileExtension.s_apolloExtenstions.put(oFF.XString.toLowerCase(extension), this);
};
oFF.FeApolloFileExtension.prototype.addArgument = function(key, value)
{
	this.m_argumentsStructure.putString(key, value);
	return this;
};
oFF.FeApolloFileExtension.prototype.addAdditionalApolloExtension = function(additionalApolloFileExtension)
{
	if (oFF.notNull(this.m_additionalApolloExtensions) && oFF.notNull(additionalApolloFileExtension))
	{
		this.m_additionalApolloExtensions.add(additionalApolloFileExtension);
	}
};
oFF.FeApolloFileExtension.prototype.setDefault = function()
{
	oFF.FeApolloFileExtension.s_defaultApolloExtension = this;
};

oFF.SleMetisSystemItem = function() {};
oFF.SleMetisSystemItem.prototype = new oFF.XObject();
oFF.SleMetisSystemItem.prototype._ff_c = "SleMetisSystemItem";

oFF.SleMetisSystemItem.DEFAULT_SYSTEM_ICON_NAME = "locked";
oFF.SleMetisSystemItem.USER_SPECIFIED_SYSTEM_ICON_NAME = "user-settings";
oFF.SleMetisSystemItem.EDIT_SYSTEM_ICON_NAME = "edit";
oFF.SleMetisSystemItem.createSystemItem = function(name, listItem, systemDescription, isUserSpecified)
{
	if (oFF.isNull(listItem))
	{
		throw oFF.XException.createRuntimeException("Missing list item ui control. Cannot create system item!");
	}
	var systemItem = new oFF.SleMetisSystemItem();
	systemItem.setupInternal(name, listItem, systemDescription, isUserSpecified);
	return systemItem;
};
oFF.SleMetisSystemItem.prototype.m_listItem = null;
oFF.SleMetisSystemItem.prototype.m_systemDescription = null;
oFF.SleMetisSystemItem.prototype.m_isUserSpecified = false;
oFF.SleMetisSystemItem.prototype.m_isInEdit = false;
oFF.SleMetisSystemItem.prototype.releaseObject = function()
{
	this.m_listItem = oFF.XObjectExt.release(this.m_listItem);
	this.m_systemDescription = null;
	oFF.XObject.prototype.releaseObject.call( this );
};
oFF.SleMetisSystemItem.prototype.setupInternal = function(name, listItem, systemDescription, isUserSpecified)
{
	this.m_listItem = listItem;
	this.m_systemDescription = systemDescription;
	this.m_isUserSpecified = isUserSpecified;
	this.m_isInEdit = false;
	this.m_listItem.setCustomObject(this);
	if (oFF.notNull(systemDescription))
	{
		this.setText(systemDescription.getSystemName());
	}
	else
	{
		this.setText(name);
	}
	if (isUserSpecified)
	{
		this.m_listItem.setIcon(oFF.SleMetisSystemItem.USER_SPECIFIED_SYSTEM_ICON_NAME);
	}
	else
	{
		this.m_listItem.setIcon(oFF.SleMetisSystemItem.DEFAULT_SYSTEM_ICON_NAME);
	}
};
oFF.SleMetisSystemItem.prototype.setText = function(text)
{
	var newText = text;
	if (this.isInEdit() && oFF.XString.endsWith(newText, "*") === false)
	{
		newText = oFF.XStringUtils.concatenate2(newText, "*");
	}
	if (this.isInEdit() === false && oFF.XString.endsWith(newText, "*"))
	{
		newText = oFF.XStringUtils.stripRight(text, 1);
	}
	this.m_listItem.setText(newText);
};
oFF.SleMetisSystemItem.prototype.getText = function()
{
	var text = this.m_listItem.getText();
	if (this.isInEdit() && oFF.XString.endsWith(text, "*"))
	{
		text = oFF.XStringUtils.stripRight(text, 1);
	}
	return text;
};
oFF.SleMetisSystemItem.prototype.setListItem = function(listItem)
{
	this.m_listItem = listItem;
};
oFF.SleMetisSystemItem.prototype.getListItem = function()
{
	return this.m_listItem;
};
oFF.SleMetisSystemItem.prototype.setSystemDescription = function(systemDescription)
{
	this.m_systemDescription = systemDescription;
};
oFF.SleMetisSystemItem.prototype.getSystemDescription = function()
{
	return this.m_systemDescription;
};
oFF.SleMetisSystemItem.prototype.setIsUserSpecified = function(isUserSpecified)
{
	this.m_isUserSpecified = isUserSpecified;
	this.updateListItemIcon();
};
oFF.SleMetisSystemItem.prototype.isUserSpecified = function()
{
	return this.m_isUserSpecified;
};
oFF.SleMetisSystemItem.prototype.setIsInEdit = function(isInEdit)
{
	this.m_isInEdit = isInEdit;
	this.updateEditStatus();
};
oFF.SleMetisSystemItem.prototype.isInEdit = function()
{
	return this.m_isInEdit;
};
oFF.SleMetisSystemItem.prototype.updateListItemIcon = function()
{
	if (oFF.notNull(this.m_listItem))
	{
		if (this.isUserSpecified())
		{
			this.m_listItem.setIcon(oFF.SleMetisSystemItem.USER_SPECIFIED_SYSTEM_ICON_NAME);
		}
		else
		{
			this.m_listItem.setIcon(oFF.SleMetisSystemItem.DEFAULT_SYSTEM_ICON_NAME);
		}
	}
};
oFF.SleMetisSystemItem.prototype.updateEditStatus = function()
{
	if (this.isInEdit())
	{
		this.m_listItem.setIcon(oFF.SleMetisSystemItem.EDIT_SYSTEM_ICON_NAME);
	}
	else
	{
		this.updateListItemIcon();
	}
	this.setText(this.m_listItem.getText());
};

oFF.AddMonthListener = function() {};
oFF.AddMonthListener.prototype = new oFF.XObject();
oFF.AddMonthListener.prototype._ff_c = "AddMonthListener";

oFF.AddMonthListener.create = function(calendarDialog)
{
	var obj = new oFF.AddMonthListener();
	obj.m_calendarDialog = calendarDialog;
	return obj;
};
oFF.AddMonthListener.prototype.m_calendarDialog = null;
oFF.AddMonthListener.prototype.onPress = function(event)
{
	this.m_calendarDialog.addOneMonth();
};

oFF.OpenMonthSelectionViewListener = function() {};
oFF.OpenMonthSelectionViewListener.prototype = new oFF.XObject();
oFF.OpenMonthSelectionViewListener.prototype._ff_c = "OpenMonthSelectionViewListener";

oFF.OpenMonthSelectionViewListener.create = function(uiGenesis, calendarDialog)
{
	var obj = new oFF.OpenMonthSelectionViewListener();
	obj.m_uiGenesis = uiGenesis;
	obj.m_calendarDialog = calendarDialog;
	return obj;
};
oFF.OpenMonthSelectionViewListener.prototype.m_uiGenesis = null;
oFF.OpenMonthSelectionViewListener.prototype.m_calendarDialog = null;
oFF.OpenMonthSelectionViewListener.prototype.onPress = function(event)
{
	var selectionView = oFF.MonthSelectionView.create(this.m_uiGenesis, this.m_calendarDialog);
	this.m_calendarDialog.replaceCalendarDialogContent(selectionView);
};

oFF.OpenMultiYearSelectionViewListener = function() {};
oFF.OpenMultiYearSelectionViewListener.prototype = new oFF.XObject();
oFF.OpenMultiYearSelectionViewListener.prototype._ff_c = "OpenMultiYearSelectionViewListener";

oFF.OpenMultiYearSelectionViewListener.create = function(uiGenesis, calendarDialog, uiModel)
{
	var obj = new oFF.OpenMultiYearSelectionViewListener();
	obj.m_uiGenesis = uiGenesis;
	obj.m_calendarDialog = calendarDialog;
	obj.m_uiModel = uiModel;
	return obj;
};
oFF.OpenMultiYearSelectionViewListener.prototype.m_uiGenesis = null;
oFF.OpenMultiYearSelectionViewListener.prototype.m_calendarDialog = null;
oFF.OpenMultiYearSelectionViewListener.prototype.m_uiModel = null;
oFF.OpenMultiYearSelectionViewListener.prototype.onPress = function(event)
{
	var selectionView = oFF.MultiYearSelectionView.create(this.m_uiGenesis, this.m_calendarDialog, this.m_uiModel);
	this.m_calendarDialog.replaceCalendarDialogContent(selectionView);
};

oFF.OpenYearSelectionViewListener = function() {};
oFF.OpenYearSelectionViewListener.prototype = new oFF.XObject();
oFF.OpenYearSelectionViewListener.prototype._ff_c = "OpenYearSelectionViewListener";

oFF.OpenYearSelectionViewListener.create = function(uiGenesis, calendarDialog, uiModel)
{
	var obj = new oFF.OpenYearSelectionViewListener();
	obj.m_uiGenesis = uiGenesis;
	obj.m_calendarDialog = calendarDialog;
	obj.m_uiModel = uiModel;
	return obj;
};
oFF.OpenYearSelectionViewListener.prototype.m_uiGenesis = null;
oFF.OpenYearSelectionViewListener.prototype.m_calendarDialog = null;
oFF.OpenYearSelectionViewListener.prototype.m_uiModel = null;
oFF.OpenYearSelectionViewListener.prototype.onPress = function(event)
{
	var selectionView = oFF.YearSelectionView.create(this.m_uiGenesis, this.m_calendarDialog, this.m_uiModel);
	this.m_calendarDialog.replaceCalendarDialogContent(selectionView);
};

oFF.SelectMonthListener = function() {};
oFF.SelectMonthListener.prototype = new oFF.XObject();
oFF.SelectMonthListener.prototype._ff_c = "SelectMonthListener";

oFF.SelectMonthListener.create = function(monthSelectionView, month)
{
	var obj = new oFF.SelectMonthListener();
	obj.m_month = month;
	obj.m_monthSelectionView = monthSelectionView;
	return obj;
};
oFF.SelectMonthListener.prototype.m_month = 0;
oFF.SelectMonthListener.prototype.m_monthSelectionView = null;
oFF.SelectMonthListener.prototype.onPress = function(event)
{
	this.m_monthSelectionView.selectMonth(this.m_month);
};

oFF.SubtractMonthListener = function() {};
oFF.SubtractMonthListener.prototype = new oFF.XObject();
oFF.SubtractMonthListener.prototype._ff_c = "SubtractMonthListener";

oFF.SubtractMonthListener.create = function(calendarDialog)
{
	var obj = new oFF.SubtractMonthListener();
	obj.m_calendarDialog = calendarDialog;
	return obj;
};
oFF.SubtractMonthListener.prototype.m_calendarDialog = null;
oFF.SubtractMonthListener.prototype.onPress = function(event)
{
	this.m_calendarDialog.subtractOneMonth();
};

oFF.FlexMonthView = function() {};
oFF.FlexMonthView.prototype = new oFF.XObject();
oFF.FlexMonthView.prototype._ff_c = "FlexMonthView";

oFF.FlexMonthView.create = function(uiGenesis, uiModel, displayHeader)
{
	var obj = new oFF.FlexMonthView();
	obj.m_uiGenesis = uiGenesis;
	obj.m_uiModel = uiModel;
	obj.m_displayHeader = displayHeader;
	obj.buildUi();
	return obj;
};
oFF.FlexMonthView.prototype.m_uiGenesis = null;
oFF.FlexMonthView.prototype.m_uiModel = null;
oFF.FlexMonthView.prototype.m_root = null;
oFF.FlexMonthView.prototype.m_yearButton = null;
oFF.FlexMonthView.prototype.m_monthButton = null;
oFF.FlexMonthView.prototype.m_previousMonthButton = null;
oFF.FlexMonthView.prototype.m_nextMonthButton = null;
oFF.FlexMonthView.prototype.m_monthLayout = null;
oFF.FlexMonthView.prototype.m_displayHeader = false;
oFF.FlexMonthView.prototype.buildUi = function()
{
	this.m_root = this.m_uiGenesis.newControl(oFF.UiType.VERTICAL_LAYOUT);
	this.m_root.setAlignSelf(oFF.UiFlexAlignSelf.CENTER);
	this.m_root.setPadding(oFF.UiCssBoxEdges.create("20px"));
	if (this.m_displayHeader)
	{
		var headerLayout = this.m_root.addNewItemOfType(oFF.UiType.FLEX_LAYOUT);
		headerLayout.setJustifyContent(oFF.UiFlexJustifyContent.SPACE_BETWEEN);
		headerLayout.setWidth(oFF.UiCssLength.create("100%"));
		headerLayout.setWrap(oFF.UiFlexWrap.NO_WRAP);
		this.m_previousMonthButton = headerLayout.addNewItemOfType(oFF.UiType.BUTTON);
		this.m_previousMonthButton.setButtonType(oFF.UiButtonType.TRANSPARENT);
		this.m_previousMonthButton.setText("<");
		this.m_previousMonthButton.setFlex("1");
		this.m_monthButton = headerLayout.addNewItemOfType(oFF.UiType.BUTTON);
		this.m_monthButton.setButtonType(oFF.UiButtonType.TRANSPARENT);
		this.m_monthButton.setFlex("3");
		this.m_yearButton = headerLayout.addNewItemOfType(oFF.UiType.BUTTON);
		this.m_yearButton.setButtonType(oFF.UiButtonType.TRANSPARENT);
		this.m_yearButton.setFlex("2");
		this.m_nextMonthButton = headerLayout.addNewItemOfType(oFF.UiType.BUTTON);
		this.m_nextMonthButton.setButtonType(oFF.UiButtonType.TRANSPARENT);
		this.m_nextMonthButton.setText(">");
		this.m_nextMonthButton.setFlex("1");
	}
	else
	{
		var monthHeaderLayout = this.m_root.addNewItemOfType(oFF.UiType.FLEX_LAYOUT);
		monthHeaderLayout.setJustifyContent(oFF.UiFlexJustifyContent.CENTER);
		monthHeaderLayout.setWidth(oFF.UiCssLength.create("100%"));
		monthHeaderLayout.setWrap(oFF.UiFlexWrap.NO_WRAP);
		this.m_monthButton = monthHeaderLayout.addNewItemOfType(oFF.UiType.BUTTON);
		this.m_monthButton.setButtonType(oFF.UiButtonType.TRANSPARENT);
		this.m_monthButton.setEnabled(false);
		this.m_monthButton.setFlex("1");
	}
	this.m_monthLayout = this.m_root.addNewItemOfType(oFF.UiType.FLEX_LAYOUT);
	this.m_monthLayout.setDirection(oFF.UiFlexDirection.COLUMN);
	this.m_monthLayout.setJustifyContent(oFF.UiFlexJustifyContent.CENTER);
	this.addWeekdayHeader();
	this.refreshContent();
};
oFF.FlexMonthView.prototype.addWeekdayHeader = function()
{
	var weekHeaderLayout = this.m_monthLayout.addNewItemOfType(oFF.UiType.FLEX_LAYOUT);
	weekHeaderLayout.setDirection(oFF.UiFlexDirection.ROW);
	var emptyLabel = weekHeaderLayout.addNewItemOfType(oFF.UiType.LABEL);
	emptyLabel.setFlex("1");
	for (var i = 0; i < this.m_uiModel.getWeekdayNames().size(); i++)
	{
		var weekDayLabel = weekHeaderLayout.addNewItemOfType(oFF.UiType.LABEL);
		weekDayLabel.setFlex("1");
		weekDayLabel.setTextAlign(oFF.UiTextAlign.CENTER);
		weekDayLabel.setText(this.m_uiModel.getWeekdayNames().get(i));
	}
};
oFF.FlexMonthView.prototype.refreshContent = function()
{
	this.setContent();
};
oFF.FlexMonthView.prototype.setContent = function()
{
	if (this.m_displayHeader)
	{
		this.m_yearButton.setText(this.m_uiModel.getYearString());
	}
	this.m_monthButton.setText(this.m_uiModel.getMonthString());
	this.setMonthGrid();
};
oFF.FlexMonthView.prototype.setMonthGrid = function()
{
	for (var i = this.m_monthLayout.getItemCount(); i > 1; i--)
	{
		var item = this.m_monthLayout.getItem(i - 1);
		this.m_monthLayout.removeItem(item);
	}
	for (var j = 0; j < this.m_uiModel.getWeeks().size(); j++)
	{
		var weekUiModel = this.m_uiModel.getWeeks().get(j);
		var weekView = oFF.WeekView.create(this.m_uiGenesis, weekUiModel);
		this.m_monthLayout.addItem(weekView.getRoot());
	}
};
oFF.FlexMonthView.prototype.setUiModel = function(monthUiModel)
{
	this.m_uiModel = monthUiModel;
};
oFF.FlexMonthView.prototype.getRoot = function()
{
	return this.m_root;
};
oFF.FlexMonthView.prototype.registerAddMonthListener = function(addMonthListener)
{
	this.m_nextMonthButton.registerOnPress(addMonthListener);
};
oFF.FlexMonthView.prototype.registerSubtractMonthListener = function(subtractMonthListener)
{
	this.m_previousMonthButton.registerOnPress(subtractMonthListener);
};
oFF.FlexMonthView.prototype.registerOpenMonthSelectionListener = function(openMonthSelectionListener)
{
	this.m_monthButton.registerOnPress(openMonthSelectionListener);
};
oFF.FlexMonthView.prototype.registerOpenYearSelectionListener = function(openYearSelectionListener)
{
	this.m_yearButton.registerOnPress(openYearSelectionListener);
};

oFF.MonthSelectionView = function() {};
oFF.MonthSelectionView.prototype = new oFF.XObject();
oFF.MonthSelectionView.prototype._ff_c = "MonthSelectionView";

oFF.MonthSelectionView.create = function(uiGenesis, calendarDialog)
{
	var obj = new oFF.MonthSelectionView();
	obj.m_uiGenesis = uiGenesis;
	obj.m_calendarDialog = calendarDialog;
	obj.m_year = calendarDialog.getYear();
	obj.initMonthNames();
	obj.buildUi();
	return obj;
};
oFF.MonthSelectionView.prototype.m_monthNames = null;
oFF.MonthSelectionView.prototype.m_uiGenesis = null;
oFF.MonthSelectionView.prototype.m_year = 0;
oFF.MonthSelectionView.prototype.m_calendarDialog = null;
oFF.MonthSelectionView.prototype.m_root = null;
oFF.MonthSelectionView.prototype.m_previousYearButton = null;
oFF.MonthSelectionView.prototype.m_yearButton = null;
oFF.MonthSelectionView.prototype.m_nextYearButton = null;
oFF.MonthSelectionView.prototype.m_monthsLayout = null;
oFF.MonthSelectionView.prototype.initMonthNames = function()
{
	this.m_monthNames = oFF.XArrayOfString.create(12);
	this.m_monthNames.set(0, "January");
	this.m_monthNames.set(1, "February");
	this.m_monthNames.set(2, "March");
	this.m_monthNames.set(3, "April");
	this.m_monthNames.set(4, "May");
	this.m_monthNames.set(5, "June");
	this.m_monthNames.set(6, "July");
	this.m_monthNames.set(7, "August");
	this.m_monthNames.set(8, "September");
	this.m_monthNames.set(9, "October");
	this.m_monthNames.set(10, "November");
	this.m_monthNames.set(11, "December");
};
oFF.MonthSelectionView.prototype.buildUi = function()
{
	this.m_root = this.m_uiGenesis.newControl(oFF.UiType.VERTICAL_LAYOUT);
	this.m_root.setAlignSelf(oFF.UiFlexAlignSelf.CENTER);
	var headerLayout = this.m_root.addNewItemOfType(oFF.UiType.FLEX_LAYOUT);
	headerLayout.setJustifyContent(oFF.UiFlexJustifyContent.SPACE_BETWEEN);
	headerLayout.setWidth(oFF.UiCssLength.create("100%"));
	headerLayout.setWrap(oFF.UiFlexWrap.NO_WRAP);
	this.m_previousYearButton = headerLayout.addNewItemOfType(oFF.UiType.BUTTON);
	this.m_previousYearButton.setButtonType(oFF.UiButtonType.TRANSPARENT);
	this.m_previousYearButton.setText("<");
	this.m_previousYearButton.setFlex("1");
	this.m_previousYearButton.registerOnPress(this);
	this.m_yearButton = headerLayout.addNewItemOfType(oFF.UiType.BUTTON);
	this.m_yearButton.setButtonType(oFF.UiButtonType.TRANSPARENT);
	this.m_yearButton.setFlex("5");
	this.m_yearButton.setText(oFF.XInteger.convertToString(this.m_year));
	this.m_nextYearButton = headerLayout.addNewItemOfType(oFF.UiType.BUTTON);
	this.m_nextYearButton.setButtonType(oFF.UiButtonType.TRANSPARENT);
	this.m_nextYearButton.setText(">");
	this.m_nextYearButton.setFlex("1");
	this.m_nextYearButton.registerOnPress(this);
	this.m_monthsLayout = this.m_root.addNewItemOfType(oFF.UiType.FLEX_LAYOUT);
	this.m_monthsLayout.setDirection(oFF.UiFlexDirection.COLUMN);
	this.m_monthsLayout.setJustifyContent(oFF.UiFlexJustifyContent.CENTER);
	var i = 0;
	while (i < this.m_monthNames.size())
	{
		var rowLayout = this.m_monthsLayout.addNewItemOfType(oFF.UiType.FLEX_LAYOUT);
		rowLayout.setWidth(oFF.UiCssLength.create("100%"));
		for (var j = 0; j < 3; j++)
		{
			var selectMonthButton = rowLayout.addNewItemOfType(oFF.UiType.BUTTON);
			selectMonthButton.setButtonType(oFF.UiButtonType.TRANSPARENT);
			selectMonthButton.setFlex("1");
			selectMonthButton.setText(this.m_monthNames.get(i));
			var selectMonthListener = oFF.SelectMonthListener.create(this, i + 1);
			selectMonthButton.registerOnPress(selectMonthListener);
			i++;
		}
	}
};
oFF.MonthSelectionView.prototype.getRoot = function()
{
	return this.m_root;
};
oFF.MonthSelectionView.prototype.selectMonth = function(month)
{
	this.m_calendarDialog.selectMonth(this.m_year, month);
};
oFF.MonthSelectionView.prototype.onPress = function(event)
{
	if (event.getControl() === this.m_nextYearButton)
	{
		this.m_year = this.m_year + 1;
	}
	else if (event.getControl() === this.m_previousYearButton)
	{
		this.m_year = this.m_year - 1;
	}
	this.m_yearButton.setText(oFF.XInteger.convertToString(this.m_year));
};

oFF.MultiYearSelectionView = function() {};
oFF.MultiYearSelectionView.prototype = new oFF.XObject();
oFF.MultiYearSelectionView.prototype._ff_c = "MultiYearSelectionView";

oFF.MultiYearSelectionView.create = function(uiGenesis, calendarDialog, yearSelectionUiModel)
{
	var obj = new oFF.MultiYearSelectionView();
	obj.m_uiGenesis = uiGenesis;
	obj.m_calendarDialog = calendarDialog;
	obj.m_startingYear = yearSelectionUiModel.getYear();
	obj.buildMonthSelectionModels();
	obj.buildUi();
	return obj;
};
oFF.MultiYearSelectionView.prototype.m_uiGenesis = null;
oFF.MultiYearSelectionView.prototype.m_calendarDialog = null;
oFF.MultiYearSelectionView.prototype.m_monthSelectionModels = null;
oFF.MultiYearSelectionView.prototype.m_root = null;
oFF.MultiYearSelectionView.prototype.m_previousYearsButton = null;
oFF.MultiYearSelectionView.prototype.m_headerSpacer = null;
oFF.MultiYearSelectionView.prototype.m_nextYearsButton = null;
oFF.MultiYearSelectionView.prototype.m_yearsLayout = null;
oFF.MultiYearSelectionView.prototype.m_startingYear = 0;
oFF.MultiYearSelectionView.prototype.buildMonthSelectionModels = function()
{
	this.m_monthSelectionModels = oFF.XList.create();
	var year = this.m_startingYear - 20 * 4;
	for (var i = 0; i < 9; i++)
	{
		this.m_monthSelectionModels.add(oFF.YearSelectionUiModel.create(year));
		year = year + 20;
	}
};
oFF.MultiYearSelectionView.prototype.buildUi = function()
{
	this.m_root = this.m_uiGenesis.newControl(oFF.UiType.VERTICAL_LAYOUT);
	this.m_root.setAlignSelf(oFF.UiFlexAlignSelf.CENTER);
	var headerLayout = this.m_root.addNewItemOfType(oFF.UiType.FLEX_LAYOUT);
	headerLayout.setJustifyContent(oFF.UiFlexJustifyContent.SPACE_BETWEEN);
	headerLayout.setWidth(oFF.UiCssLength.create("100%"));
	headerLayout.setWrap(oFF.UiFlexWrap.NO_WRAP);
	this.m_previousYearsButton = headerLayout.addNewItemOfType(oFF.UiType.BUTTON);
	this.m_previousYearsButton.setButtonType(oFF.UiButtonType.TRANSPARENT);
	this.m_previousYearsButton.setText("<");
	this.m_previousYearsButton.setFlex("1");
	this.m_previousYearsButton.registerOnPress(this);
	this.m_headerSpacer = headerLayout.addNewItemOfType(oFF.UiType.SPACER);
	this.m_headerSpacer.setFlex("5");
	this.m_nextYearsButton = headerLayout.addNewItemOfType(oFF.UiType.BUTTON);
	this.m_nextYearsButton.setButtonType(oFF.UiButtonType.TRANSPARENT);
	this.m_nextYearsButton.setText(">");
	this.m_nextYearsButton.setFlex("1");
	this.m_nextYearsButton.registerOnPress(this);
	this.m_yearsLayout = this.m_root.addNewItemOfType(oFF.UiType.FLEX_LAYOUT);
	this.m_yearsLayout.setDirection(oFF.UiFlexDirection.COLUMN);
	this.m_yearsLayout.setJustifyContent(oFF.UiFlexJustifyContent.CENTER);
	this.refreshContent();
};
oFF.MultiYearSelectionView.prototype.refreshContent = function()
{
	var rows = this.m_yearsLayout.getItems();
	var rowsSize = rows.size();
	for (var i = rowsSize - 1; i >= 0; i--)
	{
		var row = rows.get(i);
		this.m_yearsLayout.removeItem(row);
		oFF.XObjectExt.release(row);
	}
	var index = 0;
	for (var rowIdx = 0; rowIdx < 3; rowIdx++)
	{
		var rowLayout = this.m_yearsLayout.addNewItemOfType(oFF.UiType.FLEX_LAYOUT);
		rowLayout.setWidth(oFF.UiCssLength.create("100%"));
		rowLayout.setDirection(oFF.UiFlexDirection.ROW);
		for (var columnIdx = 0; columnIdx < 3; columnIdx++)
		{
			var selectYearsButton = rowLayout.addNewItemOfType(oFF.UiType.BUTTON);
			selectYearsButton.setButtonType(oFF.UiButtonType.TRANSPARENT);
			selectYearsButton.setFlex("1");
			selectYearsButton.setText(this.m_monthSelectionModels.get(index).toString());
			selectYearsButton.registerOnPress(oFF.OpenYearSelectionViewListener.create(this.m_uiGenesis, this.m_calendarDialog, this.m_monthSelectionModels.get(index)));
			index++;
		}
	}
};
oFF.MultiYearSelectionView.prototype.getRoot = function()
{
	return this.m_root;
};
oFF.MultiYearSelectionView.prototype.onPress = function(event)
{
	if (event.getControl() === this.m_previousYearsButton)
	{
		this.m_startingYear = this.m_startingYear - 180;
	}
	else if (event.getControl() === this.m_nextYearsButton)
	{
		this.m_startingYear = this.m_startingYear + 180;
	}
	this.buildMonthSelectionModels();
	this.refreshContent();
};

oFF.YearSelectionView = function() {};
oFF.YearSelectionView.prototype = new oFF.XObject();
oFF.YearSelectionView.prototype._ff_c = "YearSelectionView";

oFF.YearSelectionView.create = function(uiGenesis, calendarDialog, uiModel)
{
	var obj = new oFF.YearSelectionView();
	obj.m_uiGenesis = uiGenesis;
	obj.m_calendarDialog = calendarDialog;
	obj.m_uiModel = uiModel;
	obj.buildUi();
	return obj;
};
oFF.YearSelectionView.prototype.m_uiGenesis = null;
oFF.YearSelectionView.prototype.m_calendarDialog = null;
oFF.YearSelectionView.prototype.m_uiModel = null;
oFF.YearSelectionView.prototype.m_root = null;
oFF.YearSelectionView.prototype.m_previousYearsButton = null;
oFF.YearSelectionView.prototype.m_yearsButton = null;
oFF.YearSelectionView.prototype.m_nextYearsButton = null;
oFF.YearSelectionView.prototype.m_yearsLayout = null;
oFF.YearSelectionView.prototype.buildUi = function()
{
	this.m_root = this.m_uiGenesis.newControl(oFF.UiType.VERTICAL_LAYOUT);
	this.m_root.setAlignSelf(oFF.UiFlexAlignSelf.CENTER);
	var headerLayout = this.m_root.addNewItemOfType(oFF.UiType.FLEX_LAYOUT);
	headerLayout.setJustifyContent(oFF.UiFlexJustifyContent.SPACE_BETWEEN);
	headerLayout.setWidth(oFF.UiCssLength.create("100%"));
	headerLayout.setWrap(oFF.UiFlexWrap.NO_WRAP);
	this.m_previousYearsButton = headerLayout.addNewItemOfType(oFF.UiType.BUTTON);
	this.m_previousYearsButton.setButtonType(oFF.UiButtonType.TRANSPARENT);
	this.m_previousYearsButton.setText("<");
	this.m_previousYearsButton.setFlex("1");
	this.m_previousYearsButton.registerOnPress(this);
	this.m_yearsButton = headerLayout.addNewItemOfType(oFF.UiType.BUTTON);
	this.m_yearsButton.setButtonType(oFF.UiButtonType.TRANSPARENT);
	this.m_yearsButton.setFlex("5");
	this.m_yearsButton.registerOnPress(oFF.OpenMultiYearSelectionViewListener.create(this.m_uiGenesis, this.m_calendarDialog, this.m_uiModel));
	this.m_nextYearsButton = headerLayout.addNewItemOfType(oFF.UiType.BUTTON);
	this.m_nextYearsButton.setButtonType(oFF.UiButtonType.TRANSPARENT);
	this.m_nextYearsButton.setText(">");
	this.m_nextYearsButton.setFlex("1");
	this.m_nextYearsButton.registerOnPress(this);
	this.m_yearsLayout = this.m_root.addNewItemOfType(oFF.UiType.FLEX_LAYOUT);
	this.m_yearsLayout.setDirection(oFF.UiFlexDirection.COLUMN);
	this.m_yearsLayout.setJustifyContent(oFF.UiFlexJustifyContent.CENTER);
	this.refreshContent();
};
oFF.YearSelectionView.prototype.refreshContent = function()
{
	var rows = this.m_yearsLayout.getItems();
	var rowsSize = rows.size();
	for (var i = rowsSize - 1; i >= 0; i--)
	{
		var row = rows.get(i);
		this.m_yearsLayout.removeItem(row);
		oFF.XObjectExt.release(row);
	}
	this.m_yearsButton.setText(this.m_uiModel.toString());
	var year = this.m_uiModel.getFirstYear();
	for (var rowIdx = 0; rowIdx < 5; rowIdx++)
	{
		var rowLayout = this.m_yearsLayout.addNewItemOfType(oFF.UiType.FLEX_LAYOUT);
		rowLayout.setWidth(oFF.UiCssLength.create("100%"));
		rowLayout.setDirection(oFF.UiFlexDirection.ROW);
		for (var columnIdx = 0; columnIdx < 4; columnIdx++)
		{
			var selectYearButton = rowLayout.addNewItemOfType(oFF.UiType.BUTTON);
			selectYearButton.setButtonType(oFF.UiButtonType.TRANSPARENT);
			selectYearButton.setFlex("1");
			selectYearButton.setText(oFF.XInteger.convertToString(year));
			var selectYearListener = oFF.SelectYearListener.create(this, year);
			selectYearButton.registerOnPress(selectYearListener);
			year++;
		}
	}
};
oFF.YearSelectionView.prototype.getRoot = function()
{
	return this.m_root;
};
oFF.YearSelectionView.prototype.selectYear = function(year)
{
	this.m_calendarDialog.selectYear(year);
};
oFF.YearSelectionView.prototype.onPress = function(event)
{
	if (event.getControl() === this.m_previousYearsButton)
	{
		this.m_uiModel.subtractYears();
	}
	else if (event.getControl() === this.m_nextYearsButton)
	{
		this.m_uiModel.addYears();
	}
	this.refreshContent();
};

oFF.UiCredentialsDialog = function() {};
oFF.UiCredentialsDialog.prototype = new oFF.XObject();
oFF.UiCredentialsDialog.prototype._ff_c = "UiCredentialsDialog";

oFF.UiCredentialsDialog.showCredentialsDialog = function(context, title, message, username, password, listener)
{
	var newCredentialsDialog = new oFF.UiCredentialsDialog();
	newCredentialsDialog.setupInternal(context, listener);
	newCredentialsDialog.showCredentialsDialogInternal(title, message, username, password);
};
oFF.UiCredentialsDialog.showToastWithMessage = function(context, message)
{
	var newCredentialsDialog = new oFF.UiCredentialsDialog();
	newCredentialsDialog.setupInternal(context, null);
	newCredentialsDialog.getFreeGenesis().showInfoToast(message);
};
oFF.UiCredentialsDialog.showAlertWithTitleAndMessage = function(context, title, message)
{
	var newCredentialsDialog = new oFF.UiCredentialsDialog();
	newCredentialsDialog.setupInternal(context, null);
	newCredentialsDialog.showAlertInternal(title, message);
};
oFF.UiCredentialsDialog.prototype.m_context = null;
oFF.UiCredentialsDialog.prototype.m_listener = null;
oFF.UiCredentialsDialog.prototype.m_dialog = null;
oFF.UiCredentialsDialog.prototype.m_userInput = null;
oFF.UiCredentialsDialog.prototype.m_passwordInput = null;
oFF.UiCredentialsDialog.prototype.setupInternal = function(context, listener)
{
	this.m_context = context;
	this.m_listener = listener;
};
oFF.UiCredentialsDialog.prototype.showCredentialsDialogInternal = function(title, message, username, password)
{
	var dialogLayout = this.getFreeGenesis().newControl(oFF.UiType.FLEX_LAYOUT);
	dialogLayout.setName("dialogLayout");
	dialogLayout.setDirection(oFF.UiFlexDirection.COLUMN);
	dialogLayout.useMaxSpace();
	var infoTextLbl = this.getFreeGenesis().newControl(oFF.UiType.LABEL);
	infoTextLbl.setName("infoText");
	infoTextLbl.setText(message);
	infoTextLbl.setWidth(oFF.UiCssLength.create("100%"));
	infoTextLbl.setTextAlign(oFF.UiTextAlign.CENTER);
	dialogLayout.addItem(infoTextLbl);
	this.m_userInput = this.getFreeGenesis().newControl(oFF.UiType.INPUT);
	this.m_userInput.setName("userInput");
	this.m_userInput.setWidth(oFF.UiCssLength.create("100%"));
	this.m_userInput.setText(username);
	this.m_userInput.setPlaceholder("Username");
	this.m_userInput.registerOnLiveChange(this);
	this.m_userInput.registerOnEnter(this);
	dialogLayout.addItem(this.m_userInput);
	this.m_passwordInput = this.getFreeGenesis().newControl(oFF.UiType.INPUT);
	this.m_passwordInput.setName("passwordInput");
	this.m_passwordInput.setWidth(oFF.UiCssLength.create("100%"));
	this.m_passwordInput.setInputType(oFF.UiInputType.PASSWORD);
	this.m_passwordInput.setText(password);
	this.m_passwordInput.setPlaceholder("Password");
	this.m_passwordInput.registerOnLiveChange(this);
	this.m_passwordInput.registerOnEnter(this);
	dialogLayout.addItem(this.m_passwordInput);
	this.m_dialog = this.getFreeGenesis().newControl(oFF.UiType.DIALOG);
	this.m_dialog.setName(oFF.XStringUtils.concatenate2("credentialsDialog_", title));
	this.m_dialog.setTitle(title);
	this.m_dialog.setWidth(oFF.UiCssLength.create("400px"));
	this.m_dialog.setPadding(oFF.UiCssBoxEdges.create("15px"));
	this.m_dialog.setContent(dialogLayout);
	this.m_dialog.registerOnAfterOpen(this);
	if (this.getFreeGenesis().getUiManager().getDeviceInfo().isIOs())
	{
		this.m_dialog.setHeight(oFF.UiCssLength.create("260px"));
	}
	var loginBtn = this.m_dialog.addNewDialogButton();
	loginBtn.setName("loginBtn");
	loginBtn.setText("Login");
	loginBtn.setEnabled(oFF.XString.size(username) > 0 && oFF.XString.size(password) > 0);
	loginBtn.registerOnPress(this);
	var cancelBtn = this.m_dialog.addNewDialogButton();
	cancelBtn.setName("cancelBtn");
	cancelBtn.setText("Cancel");
	cancelBtn.registerOnPress(this);
	this.m_dialog.open();
};
oFF.UiCredentialsDialog.prototype.showAlertInternal = function(title, message)
{
	var newAlert = this.getFreeGenesis().newControl(oFF.UiType.ALERT);
	newAlert.setName("infoAlert");
	newAlert.setTitle(title);
	newAlert.setText(message);
	newAlert.open();
};
oFF.UiCredentialsDialog.prototype.getFreeGenesis = function()
{
	var uiManager = this.m_context.getProcess().getUiManager();
	var freeGenesis = uiManager.getFreeGenesis();
	return freeGenesis;
};
oFF.UiCredentialsDialog.prototype.onLiveChange = function(event)
{
	if (event.getControl() === this.m_userInput || event.getControl() === this.m_passwordInput)
	{
		var tmpUser = this.m_userInput.getText();
		var tmpPass = this.m_passwordInput.getText();
		var tmpLoginBtn = this.m_dialog.getDialogButtonByName("loginBtn");
		if (oFF.notNull(tmpLoginBtn))
		{
			tmpLoginBtn.setEnabled(oFF.XString.size(tmpUser) > 0 && oFF.XString.size(tmpPass) > 0);
		}
	}
};
oFF.UiCredentialsDialog.prototype.onPress = function(event)
{
	if (oFF.XString.isEqual(event.getControl().getName(), "loginBtn"))
	{
		if (oFF.notNull(this.m_listener))
		{
			var newUser = this.m_userInput.getText();
			var newPassword = this.m_passwordInput.getText();
			this.m_listener.onLogin(newUser, newPassword);
		}
		this.m_dialog.close();
	}
	else if (oFF.XString.isEqual(event.getControl().getName(), "cancelBtn"))
	{
		if (oFF.notNull(this.m_listener))
		{
			this.m_listener.onCancel();
		}
		this.m_dialog.close();
	}
};
oFF.UiCredentialsDialog.prototype.onEnter = function(event)
{
	if (oFF.notNull(this.m_listener))
	{
		var newUser = this.m_userInput.getText();
		var newPassword = this.m_passwordInput.getText();
		this.m_listener.onLogin(newUser, newPassword);
	}
	this.m_dialog.close();
};
oFF.UiCredentialsDialog.prototype.onAfterOpen = function(event)
{
	this.m_userInput.focus();
};

oFF.UiCredentialsFactory = function() {};
oFF.UiCredentialsFactory.prototype = new oFF.CredentialsFactory();
oFF.UiCredentialsFactory.prototype._ff_c = "UiCredentialsFactory";

oFF.UiCredentialsFactory.staticSetup = function()
{
	var newFactory = new oFF.UiCredentialsFactory();
	oFF.CredentialsFactory.registerFactory(oFF.CredentialsFactory.UI_CREDENTIALS_PROVIDER, newFactory);
};
oFF.UiCredentialsFactory.prototype.newCredentialsProvider = function(runtimeUserManager)
{
	var newCredentialsProvider = new oFF.UiCredentialsProvider();
	newCredentialsProvider.setRuntimeUserManager(runtimeUserManager);
	return newCredentialsProvider;
};

oFF.FeApolloView = function() {};
oFF.FeApolloView.prototype = new oFF.XObject();
oFF.FeApolloView.prototype._ff_c = "FeApolloView";

oFF.FeApolloView.TREE_FOLDER_ICON_NAME = "folder-full";
oFF.FeApolloView.TOOLBAR_ITEM_SPACING = "10px";
oFF.FeApolloView.APOLLO_SHOW_HIDDEN_ITEMS_KEY = "apollo_showHiddenItems";
oFF.FeApolloView.APOLLO_ITEMS_SORT_DIRECTION_KEY = "apollo_itemsSortDirection";
oFF.FeApolloView.create = function(directoryManager, fileHandler, genesis, apolloPrg)
{
	var newView = new oFF.FeApolloView();
	if (oFF.isNull(directoryManager))
	{
		throw oFF.XException.createRuntimeException("Cannot create a Apollo View instance without a directoryManager. Please sepcify a directoryManager!");
	}
	if (oFF.isNull(fileHandler))
	{
		throw oFF.XException.createRuntimeException("Cannot create a Apollo View instance without a fileHandler. Please sepcify a fileHandler!");
	}
	if (oFF.isNull(genesis))
	{
		throw oFF.XException.createRuntimeException("Cannot create a Apollo View instance without a genesis. Please sepcify a genesis!");
	}
	if (oFF.isNull(apolloPrg))
	{
		throw oFF.XException.createRuntimeException("Apollo program instance is requiried to create an Apollo View. Please sepcify an Apollo Program instance!");
	}
	newView.setupView(directoryManager, fileHandler, genesis, apolloPrg);
	return newView;
};
oFF.FeApolloView.prototype.m_directoryManager = null;
oFF.FeApolloView.prototype.m_fileHandler = null;
oFF.FeApolloView.prototype.m_genesis = null;
oFF.FeApolloView.prototype.m_application = null;
oFF.FeApolloView.prototype.m_mainLayout = null;
oFF.FeApolloView.prototype.m_tileContainerWrapper = null;
oFF.FeApolloView.prototype.m_hierrarchyTree = null;
oFF.FeApolloView.prototype.m_activeHierrarchyTreeItem = null;
oFF.FeApolloView.prototype.m_homeToolbarBtn = null;
oFF.FeApolloView.prototype.m_previousToolbarBtn = null;
oFF.FeApolloView.prototype.m_nextToolbarBtn = null;
oFF.FeApolloView.prototype.m_upOneLevelToolbarBtn = null;
oFF.FeApolloView.prototype.m_refreshToolbarBtn = null;
oFF.FeApolloView.prototype.m_subHeaderBreadcrumbPathLbl = null;
oFF.FeApolloView.prototype.m_apolloListener = null;
oFF.FeApolloView.prototype.m_directoryHistory = null;
oFF.FeApolloView.prototype.m_folderIconSrc = null;
oFF.FeApolloView.prototype.m_fileIconSrc = null;
oFF.FeApolloView.prototype.m_showHiddenItems = true;
oFF.FeApolloView.prototype.m_itemsSortDirection = null;
oFF.FeApolloView.prototype.releaseObject = function()
{
	this.m_directoryManager = null;
	this.m_fileHandler = null;
	this.m_genesis = null;
	this.m_application = null;
	this.m_mainLayout = oFF.XObjectExt.release(this.m_mainLayout);
	this.m_tileContainerWrapper = oFF.XObjectExt.release(this.m_tileContainerWrapper);
	this.m_hierrarchyTree = oFF.XObjectExt.release(this.m_hierrarchyTree);
	this.m_activeHierrarchyTreeItem = oFF.XObjectExt.release(this.m_activeHierrarchyTreeItem);
	this.m_homeToolbarBtn = oFF.XObjectExt.release(this.m_homeToolbarBtn);
	this.m_previousToolbarBtn = oFF.XObjectExt.release(this.m_previousToolbarBtn);
	this.m_nextToolbarBtn = oFF.XObjectExt.release(this.m_nextToolbarBtn);
	this.m_upOneLevelToolbarBtn = oFF.XObjectExt.release(this.m_upOneLevelToolbarBtn);
	this.m_refreshToolbarBtn = oFF.XObjectExt.release(this.m_refreshToolbarBtn);
	this.m_subHeaderBreadcrumbPathLbl = oFF.XObjectExt.release(this.m_subHeaderBreadcrumbPathLbl);
	this.m_directoryHistory = oFF.XObjectExt.release(this.m_directoryHistory);
	this.m_apolloListener = null;
	oFF.XObject.prototype.releaseObject.call( this );
};
oFF.FeApolloView.prototype.getMainLayout = function()
{
	return this.m_mainLayout;
};
oFF.FeApolloView.prototype.setApolloListener = function(listener)
{
	this.m_apolloListener = listener;
};
oFF.FeApolloView.prototype.setupView = function(directoryManager, fileHandler, genesis, apolloPrg)
{
	this.m_directoryManager = directoryManager;
	this.m_fileHandler = fileHandler;
	this.m_genesis = genesis;
	this.m_application = apolloPrg.getApplication();
	this.m_directoryHistory = oFF.FeApolloDirectoryNavigationHistory.createDirectoryHistory();
	this.m_folderIconSrc = apolloPrg.getSession().resolvePath("${ff_mimes}/images/apolloFileExplorer/folder.png");
	this.m_fileIconSrc = apolloPrg.getSession().resolvePath("${ff_mimes}/images/apolloFileExplorer/file.png");
	this.m_itemsSortDirection = oFF.XSortDirection.ASCENDING;
	this.m_showHiddenItems = true;
	this.initSettings();
	if (oFF.notNull(this.m_genesis))
	{
		this.buildView(this.m_genesis);
	}
};
oFF.FeApolloView.prototype.buildView = function(genesis)
{
	this.m_mainLayout = genesis.newControl(oFF.UiType.FLEX_LAYOUT);
	this.m_mainLayout.setName("feMainLayout");
	this.m_mainLayout.useMaxSpace();
	this.m_mainLayout.setDirection(oFF.UiFlexDirection.COLUMN);
	this.m_mainLayout.setWrap(oFF.UiFlexWrap.NO_WRAP);
	this.m_mainLayout.setBackgroundColor(oFF.UiColor.create("#f9fafc"));
	if (this.m_directoryManager.getActiveDirectory() === null)
	{
		this.m_mainLayout.setAlignItems(oFF.UiFlexAlignItems.CENTER);
		this.m_mainLayout.setDirection(oFF.UiFlexDirection.COLUMN);
		var noActiveFileSystemLbl = this.m_mainLayout.addNewItemOfType(oFF.UiType.LABEL);
		noActiveFileSystemLbl.setText("No active file system found!");
		noActiveFileSystemLbl.setFontSize(oFF.UiCssLength.create("19px"));
		noActiveFileSystemLbl.setFontWeight(oFF.UiFontWeight.BOLD);
		return;
	}
	this.createHeaderToolbar(this.m_mainLayout);
	var viewLayout = this.m_mainLayout.addNewItemOfType(oFF.UiType.FLEX_LAYOUT);
	viewLayout.setName("feViewLayout");
	viewLayout.useMaxSpace();
	viewLayout.setDirection(oFF.UiFlexDirection.ROW);
	viewLayout.setAlignItems(oFF.UiFlexAlignItems.CENTER);
	viewLayout.setJustifyContent(oFF.UiFlexJustifyContent.CENTER);
	viewLayout.setWrap(oFF.UiFlexWrap.NO_WRAP);
	this.m_hierrarchyTree = viewLayout.addNewItemOfType(oFF.UiType.TREE);
	this.m_hierrarchyTree.setName("feNavView");
	this.m_hierrarchyTree.setHeight(oFF.UiCssLength.create("100%"));
	this.m_hierrarchyTree.setWidth(oFF.UiCssLength.create("200px"));
	this.m_hierrarchyTree.setFlex("200px 0 0");
	this.m_hierrarchyTree.registerOnSelect(this);
	this.m_hierrarchyTree.setSelectionMode(oFF.UiSelectionMode.SINGLE_SELECT_MASTER);
	var rootItem = this.m_hierrarchyTree.addNewItem();
	rootItem.setText("/");
	rootItem.setIcon("folder-full");
	rootItem.registerOnContextMenu(this);
	this.m_activeHierrarchyTreeItem = rootItem;
	this.m_directoryManager.getRootDirectory().setAssociatedTreeItem(rootItem);
	this.m_activeHierrarchyTreeItem.setCustomObject(this.m_directoryManager.getRootDirectory());
	this.m_activeHierrarchyTreeItem.setSelected(true);
	var viewSeperator = viewLayout.addNewItemOfType(oFF.UiType.SPACER);
	viewSeperator.setWidth(oFF.UiCssLength.create("1px"));
	viewSeperator.setHeight(oFF.UiCssLength.create("100%"));
	viewSeperator.setBackgroundColor(oFF.UiColor.create("rgb(204, 204, 204)"));
	this.m_tileContainerWrapper = viewLayout.addNewItemOfType(oFF.UiType.PAGE);
	this.m_tileContainerWrapper.setName("feDirViewArea");
	this.m_tileContainerWrapper.setShowHeader(false);
	this.m_tileContainerWrapper.setShowNavButton(false);
	var tileView = this.m_tileContainerWrapper.setNewContent(oFF.UiType.TILE_CONTAINER);
	tileView.setName("apolloTileContainer");
	tileView.registerOnContextMenu(this);
	tileView.useMaxSpace();
	this.renderActiveDirectoryContent();
	this.renderInitialHierarchyTree();
	this.handleDirectoryHistoryUpdate();
};
oFF.FeApolloView.prototype.createHeaderToolbar = function(mainLayout)
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
	this.m_homeToolbarBtn = headerToolbarLayout.addNewItemOfType(oFF.UiType.BUTTON);
	this.m_homeToolbarBtn.setName("homeToolbarBtn");
	this.m_homeToolbarBtn.setIcon("home");
	this.m_homeToolbarBtn.registerOnPress(this);
	var homePrevSpacer = headerToolbarLayout.addNewItemOfType(oFF.UiType.SPACER);
	homePrevSpacer.setWidth(oFF.UiCssLength.create(oFF.FeApolloView.TOOLBAR_ITEM_SPACING));
	this.m_previousToolbarBtn = headerToolbarLayout.addNewItemOfType(oFF.UiType.BUTTON);
	this.m_previousToolbarBtn.setName("previousToolbarBtn");
	this.m_previousToolbarBtn.setIcon("arrow-left");
	this.m_previousToolbarBtn.setEnabled(false);
	this.m_previousToolbarBtn.registerOnPress(this);
	var prevNextSpacer = headerToolbarLayout.addNewItemOfType(oFF.UiType.SPACER);
	prevNextSpacer.setWidth(oFF.UiCssLength.create(oFF.FeApolloView.TOOLBAR_ITEM_SPACING));
	this.m_nextToolbarBtn = headerToolbarLayout.addNewItemOfType(oFF.UiType.BUTTON);
	this.m_nextToolbarBtn.setName("nextToolbarBtn");
	this.m_nextToolbarBtn.setIcon("arrow-right");
	this.m_nextToolbarBtn.setEnabled(false);
	this.m_nextToolbarBtn.registerOnPress(this);
	var nextUpSpacer = headerToolbarLayout.addNewItemOfType(oFF.UiType.SPACER);
	nextUpSpacer.setWidth(oFF.UiCssLength.create(oFF.FeApolloView.TOOLBAR_ITEM_SPACING));
	this.m_upOneLevelToolbarBtn = headerToolbarLayout.addNewItemOfType(oFF.UiType.BUTTON);
	this.m_upOneLevelToolbarBtn.setName("upOneLevelToolbarBtn");
	this.m_upOneLevelToolbarBtn.setIcon("arrow-top");
	this.m_upOneLevelToolbarBtn.registerOnPress(this);
	var upSeparatorSpacer = headerToolbarLayout.addNewItemOfType(oFF.UiType.SPACER);
	upSeparatorSpacer.setWidth(oFF.UiCssLength.create(oFF.FeApolloView.TOOLBAR_ITEM_SPACING));
	var addtitionalActionSectionSeparator = headerToolbarLayout.addNewItemOfType(oFF.UiType.SPACER);
	addtitionalActionSectionSeparator.setWidth(oFF.UiCssLength.create("1px"));
	addtitionalActionSectionSeparator.setHeight(oFF.UiCssLength.create("60%"));
	addtitionalActionSectionSeparator.setBackgroundColor(oFF.UiColor.create("#999999"));
	var separatorRefreshSpacer = headerToolbarLayout.addNewItemOfType(oFF.UiType.SPACER);
	separatorRefreshSpacer.setWidth(oFF.UiCssLength.create(oFF.FeApolloView.TOOLBAR_ITEM_SPACING));
	this.m_refreshToolbarBtn = headerToolbarLayout.addNewItemOfType(oFF.UiType.BUTTON);
	this.m_refreshToolbarBtn.setName("refreshToolbarBtn");
	this.m_refreshToolbarBtn.setIcon("refresh");
	this.m_refreshToolbarBtn.setTooltip("Refresh active directory");
	this.m_refreshToolbarBtn.registerOnPress(this);
	var refreshSeparatorSpacer = headerToolbarLayout.addNewItemOfType(oFF.UiType.SPACER);
	refreshSeparatorSpacer.setWidth(oFF.UiCssLength.create(oFF.FeApolloView.TOOLBAR_ITEM_SPACING));
	var buttonBreadcrumpSectionSeparator = headerToolbarLayout.addNewItemOfType(oFF.UiType.SPACER);
	buttonBreadcrumpSectionSeparator.setWidth(oFF.UiCssLength.create("1px"));
	buttonBreadcrumpSectionSeparator.setHeight(oFF.UiCssLength.create("60%"));
	buttonBreadcrumpSectionSeparator.setBackgroundColor(oFF.UiColor.create("#999999"));
	var separatorPathSpacer = headerToolbarLayout.addNewItemOfType(oFF.UiType.SPACER);
	separatorPathSpacer.setWidth(oFF.UiCssLength.create(oFF.FeApolloView.TOOLBAR_ITEM_SPACING));
	this.m_subHeaderBreadcrumbPathLbl = headerToolbarLayout.addNewItemOfType(oFF.UiType.LABEL);
	this.m_subHeaderBreadcrumbPathLbl.setName("breadcrumbPathLbl");
	this.m_subHeaderBreadcrumbPathLbl.setWidth(oFF.UiCssLength.create("100%"));
	this.m_subHeaderBreadcrumbPathLbl.setFontSize(oFF.UiCssLength.create("15px"));
	this.m_subHeaderBreadcrumbPathLbl.setText("/");
};
oFF.FeApolloView.prototype.renderActiveDirectoryContent = function()
{
	var tileView = this.m_tileContainerWrapper.getContent();
	tileView.clearItems();
	var activeDir = this.m_directoryManager.getActiveDirectory();
	var childItems = activeDir.getChildItems();
	childItems.sortByDirection(this.m_itemsSortDirection);
	var childIterator = childItems.getIterator();
	while (childIterator.hasNext())
	{
		var apolloItem = childIterator.next();
		if (this.m_showHiddenItems === false && apolloItem.isHidden())
		{
			continue;
		}
		var name = apolloItem.getName();
		var extension = null;
		var iconSrc = apolloItem.isDirectory() ? this.m_folderIconSrc : this.m_fileIconSrc;
		if (apolloItem.isDirectory() === false)
		{
			var tmpfile = apolloItem;
			extension = tmpfile.getApolloFileExtension().getExtension();
			if (tmpfile.isExecutable())
			{
				var tmpFileIconSrc = tmpfile.getResolvedFileIconPath(this.m_application.getSession());
				if (oFF.XStringUtils.isNotNullAndNotEmpty(tmpFileIconSrc))
				{
					iconSrc = tmpFileIconSrc;
					extension = null;
				}
			}
		}
		tileView.addNewItem().setText(name).setDescription(extension).setSrc(iconSrc).registerOnContextMenu(this).registerOnDoubleClick(this).setCustomObject(apolloItem);
	}
	this.updateToolbarItems();
};
oFF.FeApolloView.prototype.recursiveRenderDirectoryHierarchyTree = function(dirToRender)
{
	this.m_activeHierrarchyTreeItem = dirToRender.getAssociatedTreeItem();
	if (oFF.notNull(this.m_activeHierrarchyTreeItem))
	{
		if (this.m_activeHierrarchyTreeItem.hasItems() === false)
		{
			var childItems = dirToRender.getChildItems();
			var childIterator = childItems.getIterator();
			while (childIterator.hasNext())
			{
				var apolloItem = childIterator.next();
				if (apolloItem.isDirectory())
				{
					var apolloDir = apolloItem;
					this.addNewHierarchyTreeDirectory(apolloDir, dirToRender);
				}
			}
		}
		this.m_activeHierrarchyTreeItem.setSelected(true);
		this.m_activeHierrarchyTreeItem.expand();
	}
};
oFF.FeApolloView.prototype.addNewHierarchyTreeDirectory = function(apolloDir, activeDir)
{
	if (oFF.notNull(apolloDir) && oFF.notNull(activeDir))
	{
		var name = apolloDir.getName();
		var newTreeItem = this.m_activeHierrarchyTreeItem.addNewItem().setText(name).setIcon(oFF.FeApolloView.TREE_FOLDER_ICON_NAME).registerOnClick(this).registerOnContextMenu(this).setCustomObject(apolloDir);
		apolloDir.setAssociatedTreeItem(newTreeItem);
		if (apolloDir.isContentLoaded() && activeDir !== this.m_directoryManager.getActiveDirectory())
		{
			this.recursiveRenderDirectoryHierarchyTree(apolloDir);
			this.m_activeHierrarchyTreeItem.setSelected(true);
		}
	}
};
oFF.FeApolloView.prototype.renderInitialHierarchyTree = function()
{
	var rootDir = this.m_directoryManager.getRootDirectory();
	this.recursiveRenderDirectoryHierarchyTree(rootDir);
};
oFF.FeApolloView.prototype.renderActiveDirectoryHierarchyTree = function()
{
	var activeDir = this.m_directoryManager.getActiveDirectory();
	this.recursiveRenderDirectoryHierarchyTree(activeDir);
};
oFF.FeApolloView.prototype.updateActiveDirectoryHierarchyTree = function(apolloItem)
{
	var activeDir = this.m_directoryManager.getActiveDirectory();
	if (oFF.isNull(apolloItem))
	{
		var lastApolloItem = activeDir.getChildItems().get(activeDir.getChildItems().size() - 1);
		if (lastApolloItem.isDirectory() && lastApolloItem.getAssociatedTreeItem() === null)
		{
			var apolloDir = lastApolloItem;
			this.addNewHierarchyTreeDirectory(apolloDir, activeDir);
		}
	}
	else if (apolloItem.isDirectory() === true)
	{
		if (apolloItem.getAssociatedTreeItem() !== null)
		{
			var treeItem = apolloItem.getAssociatedTreeItem();
			if (treeItem.getParent() !== null)
			{
				treeItem.getParent().removeItem(treeItem);
			}
		}
		else
		{
			var newDir = apolloItem;
			this.addNewHierarchyTreeDirectory(newDir, activeDir);
		}
	}
};
oFF.FeApolloView.prototype.createNewDirectoryItem = function(name, isFile)
{
	var success = this.m_directoryManager.createNewDirectoryItemInActiveDirectory(name, isFile);
	if (success)
	{
		this.renderActiveDirectoryContent();
		if (isFile === false)
		{
			this.updateActiveDirectoryHierarchyTree(null);
		}
	}
	else
	{
		var warningMsg = "Failed to create folder! Does the folder already exist?";
		if (isFile === true)
		{
			warningMsg = "Failed to create file! Does the file already exist?";
		}
		this.showWarningToastWithMessage(warningMsg);
	}
	return success;
};
oFF.FeApolloView.prototype.handleNewDirectoryItemAction = function(control)
{
	var pressedDialogBtn = null;
	if (control.getUiType() === oFF.UiType.INPUT)
	{
		pressedDialogBtn = control.getCustomObject();
	}
	else
	{
		pressedDialogBtn = control;
	}
	var newDirItemDialog = pressedDialogBtn.getCustomObject();
	if (oFF.notNull(newDirItemDialog))
	{
		if (oFF.XString.isEqual(pressedDialogBtn.getName(), "newDirectoryItemDialogCancelBtn"))
		{
			newDirItemDialog.close();
			return;
		}
		var newDirItemNameInput = newDirItemDialog.getContent();
		if (oFF.notNull(newDirItemNameInput) && oFF.XStringUtils.isNotNullAndNotEmpty(newDirItemNameInput.getText()))
		{
			var isFile = false;
			if (oFF.XString.isEqual(pressedDialogBtn.getName(), "newDirectoryItemDialogCreateFileBtn"))
			{
				isFile = true;
			}
			var success = this.createNewDirectoryItem(newDirItemNameInput.getText(), isFile);
			if (success)
			{
				newDirItemDialog.close();
			}
		}
		else
		{
			var warningMsg = "Please specify a folder name";
			if (oFF.XString.isEqual(control.getName(), "newDirectoryItemDialogCreateFileBtn"))
			{
				warningMsg = "Please specify a file name";
			}
			this.showWarningToastWithMessage(warningMsg);
		}
	}
};
oFF.FeApolloView.prototype.deleteApolloItem = function(apolloItem)
{
	var success = this.m_directoryManager.deleteApolloItemFromActiveDirectory(apolloItem);
	if (success)
	{
		this.renderActiveDirectoryContent();
		if (apolloItem.isDirectory() === true)
		{
			this.updateActiveDirectoryHierarchyTree(apolloItem);
		}
	}
	else
	{
		var warningMsg = oFF.XStringUtils.concatenate2("Failed to delete the file with name ", apolloItem.getName());
		if (apolloItem.isDirectory() === true)
		{
			warningMsg = oFF.XStringUtils.concatenate2("Failed to delete the folder with name ", apolloItem.getName());
		}
		this.showWarningToastWithMessage(warningMsg);
	}
	return success;
};
oFF.FeApolloView.prototype.handleDeleteDirectoryItemAction = function(control)
{
	var deleteItemDialog = control.getCustomObject();
	if (oFF.notNull(deleteItemDialog))
	{
		if (oFF.XString.isEqual(control.getName(), "deleteDirectoryItemDialogCancelBtn"))
		{
			deleteItemDialog.close();
			return;
		}
		var apolloItem = deleteItemDialog.getCustomObject();
		if (oFF.notNull(apolloItem) && oFF.XString.isEqual(control.getName(), "deleteDirectoryItemDialogDeleteBtn"))
		{
			var success = this.deleteApolloItem(apolloItem);
			if (success === false)
			{
				this.showWarningToastWithMessage(oFF.XStringUtils.concatenate3("Something went wrong when trying to remove ", apolloItem.getName(), "!"));
			}
			deleteItemDialog.close();
		}
		else
		{
			this.showWarningToastWithMessage("Failed to remove the item!");
		}
	}
};
oFF.FeApolloView.prototype.renameDirectoryItem = function(apolloItem, newName)
{
	var success = this.m_directoryManager.renameApolloItemFromActiveDirectory(apolloItem, newName);
	if (success)
	{
		this.renderActiveDirectoryContent();
		if (apolloItem.isDirectory() === true)
		{
			this.updateActiveDirectoryHierarchyTree(apolloItem);
			this.updateActiveDirectoryHierarchyTree(null);
		}
	}
	else
	{
		this.showWarningToastWithMessage("Failed to rename item!");
	}
	return success;
};
oFF.FeApolloView.prototype.handleRenameDirectoryItemAction = function(control)
{
	var pressedDialogBtn = null;
	if (control.getUiType() === oFF.UiType.INPUT)
	{
		pressedDialogBtn = control.getCustomObject();
	}
	else
	{
		pressedDialogBtn = control;
	}
	var renameDirItemDialog = pressedDialogBtn.getCustomObject();
	if (oFF.notNull(renameDirItemDialog))
	{
		if (oFF.XString.isEqual(pressedDialogBtn.getName(), "renameDirectoryItemDialogCancelBtn"))
		{
			renameDirItemDialog.close();
			return;
		}
		var apolloItem = renameDirItemDialog.getCustomObject();
		var renameDirItemNameInput = renameDirItemDialog.getContent();
		if (oFF.notNull(apolloItem) && oFF.notNull(renameDirItemNameInput) && oFF.XStringUtils.isNotNullAndNotEmpty(renameDirItemNameInput.getText()))
		{
			if (oFF.XString.isEqual(pressedDialogBtn.getName(), "renameDirectoryItemDialogRenameBtn"))
			{
				var success = this.renameDirectoryItem(apolloItem, renameDirItemNameInput.getText());
				if (success)
				{
					renameDirItemDialog.close();
				}
			}
		}
		else
		{
			this.showWarningToastWithMessage("Please specify a new name!");
		}
	}
};
oFF.FeApolloView.prototype.openHelpAlert = function()
{
	var helpAlert = this.m_genesis.newControl(oFF.UiType.ALERT);
	helpAlert.setName("feHelpAlert");
	helpAlert.setTitle("Help");
	helpAlert.setText("Apollo File Explorer v0.52!");
	helpAlert.open();
};
oFF.FeApolloView.prototype.openCreateNewItemDialog = function(isFile)
{
	var title = "New folder";
	var placeholder = "Enter the new folder name";
	var createBtnName = "newDirectoryItemDialogCreateFolderBtn";
	if (isFile)
	{
		title = "New file";
		placeholder = "Enter the new file name";
		createBtnName = "newDirectoryItemDialogCreateFileBtn";
	}
	var newItemName = this.m_directoryManager.getNextFreeItemNameForActiveDir(title);
	var newDirectoryItemDialog = this.m_genesis.newControl(oFF.UiType.DIALOG);
	newDirectoryItemDialog.setName("newDirectoryItemDialog");
	newDirectoryItemDialog.setTitle(title);
	newDirectoryItemDialog.setWidth(oFF.UiCssLength.create("500px"));
	newDirectoryItemDialog.setPadding(oFF.UiCssBoxEdges.create("20px"));
	newDirectoryItemDialog.registerOnAfterOpen(this);
	var newDirectoryItemDialogCancelBtn = newDirectoryItemDialog.addNewDialogButton();
	newDirectoryItemDialogCancelBtn.setName("newDirectoryItemDialogCancelBtn");
	newDirectoryItemDialogCancelBtn.setText("Cancel");
	newDirectoryItemDialogCancelBtn.registerOnPress(this);
	var newDirectoryItemDialogCreateBtn = newDirectoryItemDialog.addNewDialogButton();
	newDirectoryItemDialogCreateBtn.setName(createBtnName);
	newDirectoryItemDialogCreateBtn.setText("Create");
	newDirectoryItemDialogCreateBtn.setButtonType(oFF.UiButtonType.PRIMARY);
	newDirectoryItemDialogCreateBtn.registerOnPress(this);
	var newDirectoryItemNameInput = newDirectoryItemDialog.setNewContent(oFF.UiType.INPUT);
	newDirectoryItemNameInput.setName("newDirectoryItemNameInput");
	newDirectoryItemNameInput.setPlaceholder(placeholder);
	newDirectoryItemNameInput.setText(newItemName);
	newDirectoryItemNameInput.registerOnEnter(this);
	newDirectoryItemDialogCreateBtn.setCustomObject(newDirectoryItemDialog);
	newDirectoryItemDialogCancelBtn.setCustomObject(newDirectoryItemDialog);
	newDirectoryItemNameInput.setCustomObject(newDirectoryItemDialogCreateBtn);
	newDirectoryItemDialog.setCustomObject(newDirectoryItemNameInput);
	newDirectoryItemDialog.open();
};
oFF.FeApolloView.prototype.openDeleteItemDialog = function(apolloItem)
{
	var title = "Delete folder";
	var text = oFF.XStringUtils.concatenate3("Are you sure that you want to delete the folder ", apolloItem.getName(), " and its content? This cannot be undone!");
	if (apolloItem.isDirectory() === false)
	{
		title = "Delete file";
		text = oFF.XStringUtils.concatenate3("Are you sure that you want to delete the file ", apolloItem.getName(), "? This cannot be undone!");
	}
	var deleteDirectoryItemDialog = this.m_genesis.newControl(oFF.UiType.DIALOG);
	deleteDirectoryItemDialog.setName("deleteDirectoryItemDialog");
	deleteDirectoryItemDialog.setTitle(title);
	deleteDirectoryItemDialog.setWidth(oFF.UiCssLength.create("500px"));
	deleteDirectoryItemDialog.setPadding(oFF.UiCssBoxEdges.create("20px"));
	deleteDirectoryItemDialog.registerOnAfterOpen(this);
	var deleteDirectoryItemDialogCancelBtn = deleteDirectoryItemDialog.addNewDialogButton();
	deleteDirectoryItemDialogCancelBtn.setName("deleteDirectoryItemDialogCancelBtn");
	deleteDirectoryItemDialogCancelBtn.setText("Cancel");
	deleteDirectoryItemDialogCancelBtn.registerOnPress(this);
	var deleteDirectoryItemDialogDeleteBtn = deleteDirectoryItemDialog.addNewDialogButton();
	deleteDirectoryItemDialogDeleteBtn.setName("deleteDirectoryItemDialogDeleteBtn");
	deleteDirectoryItemDialogDeleteBtn.setText("Delete");
	deleteDirectoryItemDialogDeleteBtn.setButtonType(oFF.UiButtonType.DESTRUCTIVE);
	deleteDirectoryItemDialogDeleteBtn.registerOnPress(this);
	var deleteDirectoryItemDialogInfoLabel = deleteDirectoryItemDialog.setNewContent(oFF.UiType.LABEL);
	deleteDirectoryItemDialogInfoLabel.setName("newDirectoryItemNameInput");
	deleteDirectoryItemDialogInfoLabel.setText(text);
	deleteDirectoryItemDialogInfoLabel.setWrapping(true);
	deleteDirectoryItemDialogDeleteBtn.setCustomObject(deleteDirectoryItemDialog);
	deleteDirectoryItemDialogCancelBtn.setCustomObject(deleteDirectoryItemDialog);
	deleteDirectoryItemDialog.setCustomObject(apolloItem);
	deleteDirectoryItemDialog.open();
};
oFF.FeApolloView.prototype.openRenameItemDialog = function(apolloItem)
{
	var title = "Rename folder";
	if (apolloItem.isDirectory() === false)
	{
		title = "Rename file";
	}
	var renameDirectoryItemDialog = this.m_genesis.newControl(oFF.UiType.DIALOG);
	renameDirectoryItemDialog.setName("renameDirectoryItemDialog");
	renameDirectoryItemDialog.setTitle(title);
	renameDirectoryItemDialog.setWidth(oFF.UiCssLength.create("500px"));
	renameDirectoryItemDialog.setPadding(oFF.UiCssBoxEdges.create("20px"));
	renameDirectoryItemDialog.registerOnAfterOpen(this);
	var renameDirectoryItemDialogCancelBtn = renameDirectoryItemDialog.addNewDialogButton();
	renameDirectoryItemDialogCancelBtn.setName("renameDirectoryItemDialogCancelBtn");
	renameDirectoryItemDialogCancelBtn.setText("Cancel");
	renameDirectoryItemDialogCancelBtn.registerOnPress(this);
	var renameDirectoryItemDialogRenameBtn = renameDirectoryItemDialog.addNewDialogButton();
	renameDirectoryItemDialogRenameBtn.setName("renameDirectoryItemDialogRenameBtn");
	renameDirectoryItemDialogRenameBtn.setText("Rename");
	renameDirectoryItemDialogRenameBtn.setButtonType(oFF.UiButtonType.PRIMARY);
	renameDirectoryItemDialogRenameBtn.registerOnPress(this);
	var renameDirectoryItemNameInput = renameDirectoryItemDialog.setNewContent(oFF.UiType.INPUT);
	renameDirectoryItemNameInput.setName("renameDirectoryItemNameInput");
	renameDirectoryItemNameInput.setPlaceholder("Please enter a new name");
	renameDirectoryItemNameInput.setText(apolloItem.getName());
	renameDirectoryItemNameInput.registerOnEnter(this);
	renameDirectoryItemDialogRenameBtn.setCustomObject(renameDirectoryItemDialog);
	renameDirectoryItemDialogCancelBtn.setCustomObject(renameDirectoryItemDialog);
	renameDirectoryItemNameInput.setCustomObject(renameDirectoryItemDialogRenameBtn);
	renameDirectoryItemDialog.setCustomObject(apolloItem);
	renameDirectoryItemDialog.open();
};
oFF.FeApolloView.prototype.createTileItemContextMenu = function(tileItem)
{
	var apolloItem = tileItem.getCustomObject();
	var contextMenu = this.m_genesis.newControl(oFF.UiType.MENU);
	contextMenu.setName("tileContextMenu");
	contextMenu.addNewItem().setName("contextMenuOpen").setText("Open").registerOnPress(this).setCustomObject(tileItem);
	if (apolloItem.isDirectory() === false)
	{
		var apolloFile = apolloItem;
		var openWithMenuItem = contextMenu.addNewItem().setName("contextMenuOpenWith");
		openWithMenuItem.setText("Open with...");
		openWithMenuItem.setCustomObject(tileItem);
		var defaultApolloExtension = apolloFile.getApolloFileExtension();
		var defaultFriendlyName = oFF.XStringUtils.concatenate2(defaultApolloExtension.getFriendlyName(), " (Default)");
		openWithMenuItem.addNewItem().setText(defaultFriendlyName).registerOnPress(this).setCustomObject(defaultApolloExtension);
		var additionalProgramsIterator = defaultApolloExtension.getAdditionalApolloExtensions().getIterator();
		while (additionalProgramsIterator.hasNext())
		{
			var tmpApolloExtension = additionalProgramsIterator.next();
			var friendlyName = tmpApolloExtension.getFriendlyName();
			openWithMenuItem.addNewItem().setText(friendlyName).registerOnPress(this).setCustomObject(tmpApolloExtension);
		}
		if (openWithMenuItem.getItemCount() > 1)
		{
			var tmpMenuItem = openWithMenuItem.getItem(1);
			tmpMenuItem.setSectionStart(true);
		}
	}
	contextMenu.addNewItem().setName("contextMenuPaste").setText("Paste").setEnabled(false).registerOnPress(this).setCustomObject(tileItem).setSectionStart(true);
	contextMenu.addNewItem().setName("contextMenuCopy").setText("Copy").registerOnPress(this).setCustomObject(tileItem);
	contextMenu.addNewItem().setName("contextMenuCut").setText("Cut").registerOnPress(this).setCustomObject(tileItem);
	contextMenu.addNewItem().setName("contextMenuRename").setText("Rename").setEnabled(true).registerOnPress(this).setCustomObject(tileItem).setSectionStart(true);
	contextMenu.addNewItem().setName("contextMenuDelete").setText("Delete").setEnabled(true).registerOnPress(this).setCustomObject(tileItem);
	contextMenu.addNewItem().setName("contextMenuInfo").setText("Info").registerOnPress(this).setCustomObject(tileItem).setSectionStart(true);
	return contextMenu;
};
oFF.FeApolloView.prototype.createTileContainerContextMenu = function(tileContainer)
{
	var contextMenu = this.m_genesis.newControl(oFF.UiType.MENU);
	contextMenu.setName("tileContainerContextMenu");
	contextMenu.addNewItem().setName("tileContainerMenuNewFile").setText("New file").registerOnPress(this).setCustomObject(tileContainer);
	contextMenu.addNewItem().setName("tileContainerMenuNewFolder").setText("New folder").registerOnPress(this).setCustomObject(tileContainer);
	return contextMenu;
};
oFF.FeApolloView.prototype.createTreeItemContextMenu = function(treeItem)
{
	var contextMenu = this.m_genesis.newControl(oFF.UiType.MENU);
	contextMenu.setName("treeItemContextMenu");
	contextMenu.addNewItem().setName("treeItemMenuExpand").setText("Expand").registerOnPress(this).setCustomObject(treeItem);
	contextMenu.addNewItem().setName("treeItemMenuCollapse").setText("Collapse").registerOnPress(this).setCustomObject(treeItem);
	return contextMenu;
};
oFF.FeApolloView.prototype.createViewMenu = function(viewBtn)
{
	var viewToolbarMenu = this.m_genesis.newControl(oFF.UiType.MENU);
	viewToolbarMenu.setName("viewToolbarMenu");
	var hiddenItemsMenu = viewToolbarMenu.addNewItem().setName("viewToolbarSubMenuHiddenItems").setText("Hidden Items");
	var showHiddenItem = hiddenItemsMenu.addNewItem().setName("viewToolbarSubMenuShowHiddenItems").setText("Show").registerOnPress(this);
	var hideHiddenItem = hiddenItemsMenu.addNewItem().setName("viewToolbarSubMenuHideHiddenItems").setText("Hide").registerOnPress(this);
	if (this.m_showHiddenItems === true)
	{
		showHiddenItem.setIcon("accept");
		hideHiddenItem.setIcon("");
	}
	else
	{
		showHiddenItem.setIcon("");
		hideHiddenItem.setIcon("accept");
	}
	var sortingMenu = viewToolbarMenu.addNewItem().setName("viewToolbarSubMenuSorting").setText("Sorting");
	var ascendingItem = sortingMenu.addNewItem().setName("viewToolbarSubMenuSortingAscending").setText("Ascending").registerOnPress(this);
	var descendingItem = sortingMenu.addNewItem().setName("viewToolbarSubMenuSortingDescending").setText("Descending").registerOnPress(this);
	if (this.m_itemsSortDirection === oFF.XSortDirection.ASCENDING)
	{
		ascendingItem.setIcon("accept");
		descendingItem.setIcon("");
	}
	else
	{
		ascendingItem.setIcon("");
		descendingItem.setIcon("accept");
	}
	viewToolbarMenu.openAt(viewBtn);
};
oFF.FeApolloView.prototype.createFileMenu = function(fileBtn)
{
	var fileToolbarMenu = this.m_genesis.newControl(oFF.UiType.MENU);
	fileToolbarMenu.setName("fileToolbarMenu");
	fileToolbarMenu.addNewItem().setName("fileToolbarMenuNewFile").setText("New file").registerOnPress(this);
	fileToolbarMenu.addNewItem().setName("fileToolbarMenuNewFolder").setText("New folder").registerOnPress(this);
	fileToolbarMenu.openAt(fileBtn);
};
oFF.FeApolloView.prototype.showTileInfo = function(tileItem)
{
	var apolloItem = tileItem.getCustomObject();
	var isFolder = apolloItem.isDirectory();
	var isExecutable = apolloItem.isExecutable();
	var itemType = "File";
	if (isFolder)
	{
		itemType = "Folder";
	}
	else if (isExecutable)
	{
		itemType = "Program";
	}
	var tileInfoPopover = this.m_genesis.newControl(oFF.UiType.POPOVER);
	tileInfoPopover.setName(oFF.XStringUtils.concatenate2("tileInfoPopover_", tileItem.getName()));
	tileInfoPopover.setSize(oFF.UiSize.createByCss("250px", "250px"));
	var popoverMainLayout = tileInfoPopover.setNewContent(oFF.UiType.FLEX_LAYOUT);
	popoverMainLayout.useMaxSpace();
	popoverMainLayout.setDirection(oFF.UiFlexDirection.COLUMN);
	popoverMainLayout.setAlignContent(oFF.UiFlexAlignContent.CENTER);
	popoverMainLayout.setJustifyContent(oFF.UiFlexJustifyContent.SPACE_AROUND);
	popoverMainLayout.setPadding(oFF.UiCssBoxEdges.create("10px"));
	var popoverTileImage = popoverMainLayout.addNewItemOfType(oFF.UiType.IMAGE);
	popoverTileImage.setName("popoverTileImage");
	popoverTileImage.setSrc(tileItem.getSrc());
	popoverTileImage.setSize(oFF.UiSize.createByCss("70px", "70px"));
	var popoverImageNameSpacer = popoverMainLayout.addNewItemOfType(oFF.UiType.SPACER);
	popoverImageNameSpacer.setHeight(oFF.UiCssLength.create("10px"));
	var popoverTileNameLbl = popoverMainLayout.addNewItemOfType(oFF.UiType.LABEL);
	popoverTileNameLbl.setName("popoverTileNameLbl");
	popoverTileNameLbl.setWidth(oFF.UiCssLength.create("230px"));
	popoverTileNameLbl.setWrapping(true);
	popoverTileNameLbl.setText(tileItem.getText());
	popoverTileNameLbl.setTextAlign(oFF.UiTextAlign.CENTER);
	popoverTileNameLbl.setFontSize(oFF.UiCssLength.create("18px"));
	popoverTileNameLbl.setFontWeight(oFF.UiFontWeight.BOLD);
	var popoverNameTypeSpacer = popoverMainLayout.addNewItemOfType(oFF.UiType.SPACER);
	popoverNameTypeSpacer.setHeight(oFF.UiCssLength.create("20px"));
	var popoverTileTypeLbl = popoverMainLayout.addNewItemOfType(oFF.UiType.LABEL);
	popoverTileTypeLbl.setName("popoverTileTypeLbl");
	popoverTileTypeLbl.setWidth(oFF.UiCssLength.create("230px"));
	popoverTileTypeLbl.setWrapping(true);
	popoverTileTypeLbl.setText(oFF.XStringUtils.concatenate2("Type: ", itemType));
	popoverTileTypeLbl.setTextAlign(oFF.UiTextAlign.CENTER);
	if (isFolder === false && isExecutable === false)
	{
		var apolloFile = apolloItem;
		var popoverTypeProgramSpacer = popoverMainLayout.addNewItemOfType(oFF.UiType.SPACER);
		popoverTypeProgramSpacer.setHeight(oFF.UiCssLength.create("5px"));
		var popoverProgramNameLbl = popoverMainLayout.addNewItemOfType(oFF.UiType.LABEL);
		popoverProgramNameLbl.setName("popoverProgramNameLbl");
		popoverProgramNameLbl.setWidth(oFF.UiCssLength.create("230px"));
		popoverProgramNameLbl.setWrapping(true);
		popoverProgramNameLbl.setText(oFF.XStringUtils.concatenate2("Default program: ", apolloFile.getApolloFileExtension().getFriendlyName()));
		popoverProgramNameLbl.setTextAlign(oFF.UiTextAlign.CENTER);
	}
	tileInfoPopover.openAt(tileItem);
};
oFF.FeApolloView.prototype.openApolloItem = function(apolloItem)
{
	if (oFF.notNull(apolloItem))
	{
		if (apolloItem.isDirectory())
		{
			this.openFolderAndAddToHistory(apolloItem);
		}
		else
		{
			this.openFile(apolloItem);
		}
	}
};
oFF.FeApolloView.prototype.openFile = function(apolloFile)
{
	var didSuccess = false;
	if (oFF.notNull(this.m_fileHandler) && oFF.notNull(apolloFile))
	{
		didSuccess = this.m_fileHandler.openFile(apolloFile);
		if (oFF.notNull(this.m_apolloListener))
		{
			this.m_apolloListener.onApolloFileOpen(apolloFile);
		}
	}
	if (didSuccess === false)
	{
		this.m_genesis.showAlert("Error", "There was an error launching the file. Please try again!");
	}
};
oFF.FeApolloView.prototype.openFileWithApolloExtension = function(apolloFile, apolloExtension)
{
	var didSuccess = false;
	if (oFF.notNull(this.m_fileHandler) && oFF.notNull(apolloFile) && oFF.notNull(apolloExtension))
	{
		didSuccess = this.m_fileHandler.openFileWithApolloExtension(apolloFile, apolloExtension);
		if (oFF.notNull(this.m_apolloListener))
		{
			this.m_apolloListener.onApolloFileOpen(apolloFile);
		}
	}
	if (didSuccess === false)
	{
		this.m_genesis.showAlert("Error", "There was an error launching the file. Please try again!");
	}
};
oFF.FeApolloView.prototype.openFolder = function(apolloDir)
{
	if (oFF.notNull(this.m_directoryManager) && oFF.notNull(apolloDir))
	{
		if (oFF.notNull(this.m_apolloListener))
		{
			this.m_apolloListener.onApolloDirectoryOpen(apolloDir);
		}
		this.m_directoryManager.openDirectory(apolloDir);
		this.renderActiveDirectoryContent();
		this.renderActiveDirectoryHierarchyTree();
	}
};
oFF.FeApolloView.prototype.openFolderAndAddToHistory = function(apolloDir)
{
	this.openFolder(apolloDir);
	this.handleDirectoryHistoryUpdate();
};
oFF.FeApolloView.prototype.menuBarItemClick = function(menuItem)
{
	if (oFF.notNull(this.m_apolloListener) && oFF.notNull(menuItem))
	{
		this.m_apolloListener.onApolloMenuBarItemClick(menuItem.getName());
	}
};
oFF.FeApolloView.prototype.showWarningToastWithMessage = function(msg)
{
	if (oFF.notNull(this.m_genesis))
	{
		this.m_genesis.showWarningToast(msg);
	}
};
oFF.FeApolloView.prototype.handleDirectoryHistoryUpdate = function()
{
	this.m_directoryHistory.addHistoryEntry(this.m_directoryManager.getActiveDirectory());
	this.updateToolbarItems();
};
oFF.FeApolloView.prototype.updateToolbarItems = function()
{
	if (oFF.notNull(this.m_previousToolbarBtn))
	{
		if (this.m_directoryHistory.canGoToPrevious())
		{
			this.m_previousToolbarBtn.setEnabled(true);
		}
		else
		{
			this.m_previousToolbarBtn.setEnabled(false);
		}
	}
	if (oFF.notNull(this.m_nextToolbarBtn))
	{
		if (this.m_directoryHistory.canGoToNext())
		{
			this.m_nextToolbarBtn.setEnabled(true);
		}
		else
		{
			this.m_nextToolbarBtn.setEnabled(false);
		}
	}
	if (oFF.notNull(this.m_upOneLevelToolbarBtn))
	{
		this.m_upOneLevelToolbarBtn.setEnabled(this.m_directoryManager.isTopLevel() === false);
	}
	if (oFF.notNull(this.m_subHeaderBreadcrumbPathLbl))
	{
		this.m_subHeaderBreadcrumbPathLbl.setText(this.m_directoryManager.getCurrentPath());
	}
};
oFF.FeApolloView.prototype.goToHome = function()
{
	if (!this.m_directoryManager.isTopLevel())
	{
		this.openFolderAndAddToHistory(this.m_directoryManager.getRootDirectory());
	}
};
oFF.FeApolloView.prototype.goToPreviousHistDir = function()
{
	if (this.m_directoryHistory.canGoToPrevious())
	{
		var previousDir = this.m_directoryHistory.goToPrevious();
		this.openFolder(previousDir);
	}
};
oFF.FeApolloView.prototype.goToNextHistDir = function()
{
	if (this.m_directoryHistory.canGoToNext())
	{
		var nextDir = this.m_directoryHistory.goToNext();
		this.openFolder(nextDir);
	}
};
oFF.FeApolloView.prototype.upOneLevel = function()
{
	if (oFF.notNull(this.m_directoryManager) && this.m_directoryManager.getActiveDirectory().getParentDir() !== null)
	{
		this.openFolderAndAddToHistory(this.m_directoryManager.getActiveDirectory().getParentDir());
	}
};
oFF.FeApolloView.prototype.refreshCurrentDirectory = function()
{
	if (oFF.notNull(this.m_directoryManager))
	{
		this.m_directoryManager.refreshActiveDirectory();
		this.renderActiveDirectoryContent();
	}
};
oFF.FeApolloView.prototype.initSettings = function()
{
	if (oFF.notNull(this.m_application))
	{
		this.m_showHiddenItems = this.m_application.getUserManager().getUserSettings().getBooleanByKeyExt(oFF.FeApolloView.APOLLO_SHOW_HIDDEN_ITEMS_KEY, true);
		var sortDirection = this.m_application.getUserManager().getUserSettings().getIntegerByKeyExt(oFF.FeApolloView.APOLLO_ITEMS_SORT_DIRECTION_KEY, 0);
		this.m_itemsSortDirection = sortDirection === 0 ? oFF.XSortDirection.ASCENDING : oFF.XSortDirection.DESCENDING;
	}
};
oFF.FeApolloView.prototype.updateShowHiddenItemsSetting = function(newValue)
{
	this.m_showHiddenItems = newValue;
	if (oFF.notNull(this.m_application))
	{
		this.m_application.getUserManager().getUserSettings().putBoolean(oFF.FeApolloView.APOLLO_SHOW_HIDDEN_ITEMS_KEY, newValue);
	}
};
oFF.FeApolloView.prototype.updateItemSortDirectionSetting = function(newDirection)
{
	this.m_itemsSortDirection = newDirection;
	if (oFF.notNull(this.m_application))
	{
		var sortDirection = newDirection === oFF.XSortDirection.ASCENDING ? 0 : 1;
		this.m_application.getUserManager().getUserSettings().putInteger(oFF.FeApolloView.APOLLO_ITEMS_SORT_DIRECTION_KEY, sortDirection);
	}
};
oFF.FeApolloView.prototype.onPress = function(event)
{
	var control = event.getControl();
	var controlParent = control.getParent();
	if (event.getControl() === this.m_homeToolbarBtn)
	{
		this.goToHome();
	}
	if (event.getControl() === this.m_previousToolbarBtn)
	{
		this.goToPreviousHistDir();
	}
	if (event.getControl() === this.m_nextToolbarBtn)
	{
		this.goToNextHistDir();
	}
	if (event.getControl() === this.m_upOneLevelToolbarBtn)
	{
		this.upOneLevel();
	}
	if (event.getControl() === this.m_refreshToolbarBtn)
	{
		this.refreshCurrentDirectory();
	}
	if (oFF.notNull(controlParent) && controlParent.getUiType() === oFF.UiType.TOOLBAR)
	{
		switch (control.getName())
		{
			case "feMainMenuFileBtn":
				this.createFileMenu(control);
				break;

			case "feMainMenuEditBtn":
				break;

			case "feMainMenuViewBtn":
				this.createViewMenu(control);
				break;

			case "feMainMenuHelpBtn":
				this.openHelpAlert();
				break;

			default:
		}
	}
	if (oFF.notNull(controlParent) && controlParent.getUiType() === oFF.UiType.MENU)
	{
		if (oFF.XString.isEqual(controlParent.getName(), "treeItemContextMenu"))
		{
			var tmpTreeItem = control.getCustomObject();
			switch (control.getName())
			{
				case "treeItemMenuExpand":
					tmpTreeItem.expand();
					break;

				case "treeItemMenuCollapse":
					tmpTreeItem.collapse();
					break;

				default:
			}
		}
		else if (oFF.XString.isEqual(controlParent.getName(), "tileContextMenu"))
		{
			var tmpTileItem = control.getCustomObject();
			var apolloItem = tmpTileItem.getCustomObject();
			switch (control.getName())
			{
				case "contextMenuOpen":
					this.openApolloItem(apolloItem);
					break;

				case "contextMenuOpenWith":
					break;

				case "contextMenuPaste":
					break;

				case "contextMenuCopy":
					break;

				case "contextMenuCut":
					break;

				case "contextMenuRename":
					this.openRenameItemDialog(apolloItem);
					break;

				case "contextMenuDelete":
					this.openDeleteItemDialog(apolloItem);
					break;

				case "contextMenuInfo":
					this.showTileInfo(tmpTileItem);
					break;

				default:
			}
		}
		else if (oFF.XString.isEqual(controlParent.getName(), "fileToolbarMenu"))
		{
			switch (control.getName())
			{
				case "fileToolbarMenuNewFile":
					this.menuBarItemClick(control);
					this.openCreateNewItemDialog(true);
					break;

				case "fileToolbarMenuNewFolder":
					this.menuBarItemClick(control);
					this.openCreateNewItemDialog(false);
					break;

				default:
			}
		}
		else if (oFF.XString.isEqual(controlParent.getName(), "tileContainerContextMenu"))
		{
			switch (control.getName())
			{
				case "tileContainerMenuNewFile":
					this.openCreateNewItemDialog(true);
					break;

				case "tileContainerMenuNewFolder":
					this.openCreateNewItemDialog(false);
					break;

				default:
			}
		}
	}
	else if (oFF.notNull(controlParent) && controlParent.getUiType() === oFF.UiType.MENU_ITEM)
	{
		if (oFF.XString.isEqual(controlParent.getName(), "contextMenuOpenWith"))
		{
			var tileItem = controlParent.getCustomObject();
			var apolloFile = tileItem.getCustomObject();
			var tmpApolloExtension = event.getControl().getCustomObject();
			this.openFileWithApolloExtension(apolloFile, tmpApolloExtension);
		}
		else if (oFF.XString.isEqual(controlParent.getName(), "viewToolbarSubMenuHiddenItems"))
		{
			switch (control.getName())
			{
				case "viewToolbarSubMenuShowHiddenItems":
					this.menuBarItemClick(control);
					this.updateShowHiddenItemsSetting(true);
					this.renderActiveDirectoryContent();
					break;

				case "viewToolbarSubMenuHideHiddenItems":
					this.menuBarItemClick(control);
					this.updateShowHiddenItemsSetting(false);
					this.renderActiveDirectoryContent();
					break;

				default:
			}
		}
		else if (oFF.XString.isEqual(controlParent.getName(), "viewToolbarSubMenuSorting"))
		{
			switch (control.getName())
			{
				case "viewToolbarSubMenuSortingAscending":
					this.menuBarItemClick(control);
					this.updateItemSortDirectionSetting(oFF.XSortDirection.ASCENDING);
					this.renderActiveDirectoryContent();
					break;

				case "viewToolbarSubMenuSortingDescending":
					this.menuBarItemClick(control);
					this.updateItemSortDirectionSetting(oFF.XSortDirection.DESCENDING);
					this.renderActiveDirectoryContent();
					break;

				default:
			}
		}
	}
	if (control.getUiType() === oFF.UiType.DIALOG_BUTTON)
	{
		if (oFF.notNull(controlParent) && oFF.XString.isEqual(controlParent.getName(), "newDirectoryItemDialog"))
		{
			this.handleNewDirectoryItemAction(control);
		}
		if (oFF.notNull(controlParent) && oFF.XString.isEqual(controlParent.getName(), "deleteDirectoryItemDialog"))
		{
			this.handleDeleteDirectoryItemAction(control);
		}
		if (oFF.notNull(controlParent) && oFF.XString.isEqual(controlParent.getName(), "renameDirectoryItemDialog"))
		{
			this.handleRenameDirectoryItemAction(control);
		}
	}
};
oFF.FeApolloView.prototype.onContextMenu = function(event)
{
	var control = event.getControl();
	var posX = event.getParameters().getIntegerByKeyExt(oFF.UiControlEvent.PARAM_CLICK_X, 0);
	var posY = event.getParameters().getIntegerByKeyExt(oFF.UiControlEvent.PARAM_CLICK_Y, 0);
	var contextMenu = null;
	if (control.getUiType() === oFF.UiType.TILE_ITEM)
	{
		contextMenu = this.createTileItemContextMenu(event.getControl());
	}
	else if (control.getUiType() === oFF.UiType.TILE_CONTAINER)
	{
		contextMenu = this.createTileContainerContextMenu(event.getControl());
	}
	else if (control.getUiType() === oFF.UiType.TREE_ITEM)
	{
		contextMenu = this.createTreeItemContextMenu(event.getControl());
	}
	if (oFF.notNull(contextMenu))
	{
		if (posX === 0 && posY === 0)
		{
			contextMenu.openAt(event.getControl());
		}
		else
		{
			contextMenu.openAtPosition(posX, posY);
		}
	}
};
oFF.FeApolloView.prototype.onDoubleClick = function(event)
{
	var apolloItem = event.getControl().getCustomObject();
	this.openApolloItem(apolloItem);
};
oFF.FeApolloView.prototype.onClick = function(event) {};
oFF.FeApolloView.prototype.onSelect = function(event)
{
	var selectedTreeItem = event.getSelectedItem();
	var apolloDir = selectedTreeItem.getCustomObject();
	if (oFF.notNull(apolloDir))
	{
		this.openApolloItem(apolloDir);
	}
};
oFF.FeApolloView.prototype.onEnter = function(event)
{
	var control = event.getControl();
	if (oFF.XString.isEqual(control.getName(), "newDirectoryItemNameInput"))
	{
		this.handleNewDirectoryItemAction(control);
	}
	if (oFF.XString.isEqual(control.getName(), "renameDirectoryItemNameInput"))
	{
		this.handleRenameDirectoryItemAction(control);
	}
};
oFF.FeApolloView.prototype.onAfterOpen = function(event)
{
	var control = event.getControl();
	if (oFF.XString.isEqual(control.getName(), "newDirectoryItemDialog"))
	{
		var itemNameInput = control.getCustomObject();
		if (oFF.notNull(itemNameInput))
		{
			itemNameInput.focus();
			itemNameInput.selectText(0, -1);
		}
	}
	if (oFF.XString.isEqual(control.getName(), "deleteDirectoryItemDialog"))
	{
		var deleteItemDialog = control;
		var deleteDialogCancelBtn = deleteItemDialog.getDialogButtonByName("deleteDirectoryItemDialogCancelBtn");
		if (oFF.notNull(deleteDialogCancelBtn))
		{
			deleteDialogCancelBtn.focus();
		}
	}
	if (oFF.XString.isEqual(control.getName(), "renameDirectoryItemDialog"))
	{
		var renameItemNameInput = control.getContent();
		if (oFF.notNull(renameItemNameInput))
		{
			renameItemNameInput.focus();
			renameItemNameInput.selectText(0, -1);
		}
	}
};

oFF.FutVulcanUiControlsView = function() {};
oFF.FutVulcanUiControlsView.prototype = new oFF.XObject();
oFF.FutVulcanUiControlsView.prototype._ff_c = "FutVulcanUiControlsView";

oFF.FutVulcanUiControlsView.CHARACTERISTIC_PROPERTIES = 0;
oFF.FutVulcanUiControlsView.CHARACTERISTIC_AGGREGATIONS = 1;
oFF.FutVulcanUiControlsView.CHARACTERISTIC_METHODS = 2;
oFF.FutVulcanUiControlsView.CHARACTERISTIC_EVENTS = 3;
oFF.FutVulcanUiControlsView.CHARACTERISTIC_INTERFACES = 4;
oFF.FutVulcanUiControlsView.createUiControlsPageView = function(genesis)
{
	if (oFF.isNull(genesis))
	{
		throw oFF.XException.createRuntimeException("You need to specify a genesis instance in order to create a Vulcan Ui Controls View!");
	}
	var newUiControlsView = new oFF.FutVulcanUiControlsView();
	newUiControlsView.setupInternal(genesis);
	return newUiControlsView;
};
oFF.FutVulcanUiControlsView.prototype.m_genesis = null;
oFF.FutVulcanUiControlsView.prototype.m_viewPage = null;
oFF.FutVulcanUiControlsView.prototype.m_controlList = null;
oFF.FutVulcanUiControlsView.prototype.m_searchInput = null;
oFF.FutVulcanUiControlsView.prototype.m_currentControlListItems = null;
oFF.FutVulcanUiControlsView.prototype.m_controlDetailsContainer = null;
oFF.FutVulcanUiControlsView.prototype.releaseObject = function()
{
	oFF.XObject.prototype.releaseObject.call( this );
	this.m_genesis = null;
	this.m_controlList = oFF.XObjectExt.release(this.m_controlList);
	this.m_controlDetailsContainer = oFF.XObjectExt.release(this.m_controlDetailsContainer);
	this.m_viewPage = oFF.XObjectExt.release(this.m_viewPage);
	this.m_currentControlListItems.clear();
	this.m_currentControlListItems = oFF.XObjectExt.release(this.m_currentControlListItems);
};
oFF.FutVulcanUiControlsView.prototype.setupInternal = function(genesis)
{
	this.m_genesis = genesis;
	this.m_currentControlListItems = oFF.XList.create();
	this.createView(genesis);
	this.loadUiControlDefs();
	this.updateControlList();
	if (this.m_currentControlListItems.hasElements() === true && oFF.notNull(this.m_controlList))
	{
		var tmpListItem = this.m_currentControlListItems.get(0);
		this.m_controlList.setSelectedItem(tmpListItem);
		var tmpUiType = tmpListItem.getCustomObject();
		this.updateControlDetailsSection(tmpUiType);
	}
};
oFF.FutVulcanUiControlsView.prototype.createView = function(genesis)
{
	this.m_viewPage = genesis.newControl(oFF.UiType.PAGE);
	this.m_viewPage.setName("futVulcanUiControlsViewPage");
	this.m_viewPage.setShowHeader(true);
	this.m_viewPage.setText("Ui Controls");
	this.m_viewPage.useMaxSpace();
	var mainLayout = this.m_viewPage.setNewContent(oFF.UiType.FLEX_LAYOUT);
	mainLayout.setName("futVulcanUiControlsViewPageLayout");
	mainLayout.useMaxSpace();
	mainLayout.setDirection(oFF.UiFlexDirection.ROW);
	mainLayout.setAlignItems(oFF.UiFlexAlignItems.CENTER);
	mainLayout.setJustifyContent(oFF.UiFlexJustifyContent.CENTER);
	mainLayout.setWrap(oFF.UiFlexWrap.NO_WRAP);
	mainLayout.setBackgroundColor(oFF.UiColor.create("#f9fafc"));
	var systemListWrapper = mainLayout.addNewItemOfType(oFF.UiType.FLEX_LAYOUT);
	systemListWrapper.setName("futVulcanUiControlsViewListWrapper");
	systemListWrapper.setDirection(oFF.UiFlexDirection.COLUMN);
	systemListWrapper.setHeight(oFF.UiCssLength.create("100%"));
	systemListWrapper.setWidth(oFF.UiCssLength.create("300px"));
	systemListWrapper.setFlex("0 1 300px ");
	this.m_searchInput = systemListWrapper.addNewItemOfType(oFF.UiType.SEARCH_FIELD);
	this.m_searchInput.setName("futVulcanUiControlsViewControlListSearchField");
	this.m_searchInput.setPlaceholder("Search control...");
	this.m_searchInput.setPadding(oFF.UiCssBoxEdges.create("5px"));
	this.m_searchInput.setHeight(oFF.UiCssLength.create("40px"));
	this.m_searchInput.registerOnSearch(this);
	this.m_searchInput.registerOnLiveChange(this);
	this.m_searchInput.setDebounceTime(1000);
	this.m_controlList = systemListWrapper.addNewItemOfType(oFF.UiType.LIST);
	this.m_controlList.setName("futVulcanUiControlsViewControlList");
	this.m_controlList.useMaxWidth();
	this.m_controlList.setHeight(oFF.UiCssLength.create("auto"));
	this.m_controlList.registerOnSelect(this);
	this.m_controlList.setSelectionMode(oFF.UiSelectionMode.SINGLE_SELECT_MASTER);
	this.m_controlList.setBorderWidth(oFF.UiCssBoxEdges.create("0px"));
	var systemListFormSpacer = mainLayout.addNewItemOfType(oFF.UiType.SPACER);
	systemListFormSpacer.setWidth(oFF.UiCssLength.create("1px"));
	systemListFormSpacer.setHeight(oFF.UiCssLength.create("100%"));
	systemListFormSpacer.setBackgroundColor(oFF.UiColor.GREY);
	this.m_controlDetailsContainer = mainLayout.addNewItemOfType(oFF.UiType.FLEX_LAYOUT);
	this.m_controlDetailsContainer.setName("futVulcanUiControlsViewDetailsContainer");
	this.m_controlDetailsContainer.useMaxHeight();
	this.m_controlDetailsContainer.setDirection(oFF.UiFlexDirection.COLUMN);
	this.m_controlDetailsContainer.setJustifyContent(oFF.UiFlexJustifyContent.START);
	this.m_controlDetailsContainer.setAlignItems(oFF.UiFlexAlignItems.START);
	this.m_controlDetailsContainer.setWidth(oFF.UiCssLength.create("80%"));
	this.m_controlDetailsContainer.setFlex("1 1 80%");
	this.m_controlDetailsContainer.setBackgroundColor(oFF.UiColor.WHITE);
};
oFF.FutVulcanUiControlsView.prototype.getPage = function()
{
	return this.m_viewPage;
};
oFF.FutVulcanUiControlsView.prototype.updateControlList = function()
{
	this.m_controlList.clearItems();
	this.m_controlList.addAllItems(this.m_currentControlListItems);
};
oFF.FutVulcanUiControlsView.prototype.loadUiControlDefs = function()
{
	if (oFF.notNull(this.m_controlList))
	{
		var sortedUiTypeNameList = oFF.UiType.getAllUiTypeNamesSorted();
		var sortedUiTypeNamesIterator = sortedUiTypeNameList.getIterator();
		while (sortedUiTypeNamesIterator.hasNext())
		{
			var uiTypeName = sortedUiTypeNamesIterator.next();
			var tmpUiType = oFF.UiType.lookupUiType(uiTypeName);
			if (oFF.notNull(tmpUiType))
			{
				var newListItem = this.m_controlList.newItem();
				newListItem.setName(tmpUiType.getName());
				newListItem.setText(tmpUiType.getName());
				newListItem.setCustomObject(tmpUiType);
				if (tmpUiType.isAbstractControl())
				{
					newListItem.setIcon("database");
					newListItem.setTooltip("Abstract interface");
				}
				else
				{
					newListItem.setIcon("product");
					newListItem.setTooltip("Ui Element");
				}
				this.m_currentControlListItems.add(newListItem);
			}
		}
	}
};
oFF.FutVulcanUiControlsView.prototype.filterControlList = function(searchText, clearButtonPressed)
{
	this.m_controlList.clearItems();
	if (clearButtonPressed === false)
	{
		for (var a = 0; a < this.m_currentControlListItems.size(); a++)
		{
			var tmpListItem = this.m_currentControlListItems.get(a);
			if (oFF.XString.containsString(oFF.XString.toLowerCase(tmpListItem.getText()), oFF.XString.toLowerCase(searchText)))
			{
				this.m_controlList.addItem(tmpListItem);
			}
		}
	}
	else
	{
		this.m_controlList.addAllItems(this.m_currentControlListItems);
	}
};
oFF.FutVulcanUiControlsView.prototype.updateControlDetailsSection = function(uiType)
{
	if (oFF.notNull(this.m_controlDetailsContainer) && oFF.notNull(uiType))
	{
		this.m_controlDetailsContainer.clearItems();
		this.createOverviewSection(uiType);
		this.createUiTypeDetailsTabStrip(uiType);
	}
};
oFF.FutVulcanUiControlsView.prototype.createOverviewSection = function(uiType)
{
	if (oFF.notNull(this.m_controlDetailsContainer))
	{
		var overviewLayout = this.m_controlDetailsContainer.addNewItemOfType(oFF.UiType.FLEX_LAYOUT);
		overviewLayout.setDirection(oFF.UiFlexDirection.COLUMN);
		overviewLayout.useMaxWidth();
		overviewLayout.setHeight(oFF.UiCssLength.create("160px"));
		overviewLayout.setFlex("0 0 160px");
		overviewLayout.setPadding(oFF.UiCssBoxEdges.create("10px"));
		var controlNameLbl = overviewLayout.addNewItemOfType(oFF.UiType.LABEL);
		controlNameLbl.setText(uiType.getName());
		controlNameLbl.setFontWeight(oFF.UiFontWeight.BOLD);
		controlNameLbl.setFontSize(oFF.UiCssLength.create("20px"));
		controlNameLbl.setMargin(oFF.UiCssBoxEdges.create("10px"));
		controlNameLbl.setFlex("0 0 23px");
		var titleSpacer = overviewLayout.addNewItemOfType(oFF.UiType.SPACER);
		titleSpacer.setHeight(oFF.UiCssLength.create("1px"));
		titleSpacer.setWidth(oFF.UiCssLength.create("auto"));
		titleSpacer.setBackgroundColor(oFF.UiColor.GREY);
		var superType = uiType.getSuperType();
		var superclassNameLbl = null;
		if (oFF.notNull(superType))
		{
			superclassNameLbl = this.createNewHeaderLabel("Superclass", superType.getName(), false, true, superType);
		}
		else
		{
			superclassNameLbl = this.createNewHeaderLabel("Superclass", "-", false, false, null);
		}
		overviewLayout.addItem(superclassNameLbl);
		var typeStr = uiType.isAbstractControl() ? "Interface" : "Class";
		var typeLbl = this.createNewHeaderLabel("Type", typeStr, true, false, null);
		overviewLayout.addItem(typeLbl);
		var descriptionLbl = this.createNewHeaderLabel("Description", uiType.getDescription(), true, false, null);
		overviewLayout.addItem(descriptionLbl);
	}
};
oFF.FutVulcanUiControlsView.prototype.createUiTypeDetailsTabStrip = function(uiType)
{
	var controlDetailsTabStrip = this.m_controlDetailsContainer.addNewItemOfType(oFF.UiType.ICON_TAB_BAR);
	controlDetailsTabStrip.setHeight(oFF.UiCssLength.create("auto"));
	controlDetailsTabStrip.setWidth(oFF.UiCssLength.create("100%"));
	controlDetailsTabStrip.setFlex("1 1 auto");
	var propertiesTab = this.createUiTypeCharacteristicsTab(uiType, "Properties", oFF.FutVulcanUiControlsView.CHARACTERISTIC_PROPERTIES);
	controlDetailsTabStrip.addItem(propertiesTab);
	var aggregationsTab = this.createUiTypeCharacteristicsTab(uiType, "Aggregations", oFF.FutVulcanUiControlsView.CHARACTERISTIC_AGGREGATIONS);
	controlDetailsTabStrip.addItem(aggregationsTab);
	var methodsTab = this.createUiTypeCharacteristicsTab(uiType, "Methods", oFF.FutVulcanUiControlsView.CHARACTERISTIC_METHODS);
	controlDetailsTabStrip.addItem(methodsTab);
	var eventsTab = this.createUiTypeCharacteristicsTab(uiType, "Events", oFF.FutVulcanUiControlsView.CHARACTERISTIC_EVENTS);
	controlDetailsTabStrip.addItem(eventsTab);
	var interfacesTab = this.createUiTypeCharacteristicsTab(uiType, "Interfaces", oFF.FutVulcanUiControlsView.CHARACTERISTIC_INTERFACES);
	controlDetailsTabStrip.addItem(interfacesTab);
};
oFF.FutVulcanUiControlsView.prototype.createNewHeaderLabel = function(label, text, wrapping, isLink, linkedUiType)
{
	var labelLayout = this.m_genesis.newControl(oFF.UiType.FLEX_LAYOUT);
	labelLayout.setDirection(oFF.UiFlexDirection.ROW);
	labelLayout.setMargin(oFF.UiCssBoxEdges.create("5px"));
	var tmpLabelLbl = labelLayout.addNewItemOfType(oFF.UiType.LABEL);
	tmpLabelLbl.setText(oFF.XStringUtils.concatenate2(label, ": "));
	tmpLabelLbl.setFlex("0 0 100px");
	if (isLink)
	{
		var tmpTextLink = labelLayout.addNewItemOfType(oFF.UiType.LINK);
		tmpTextLink.setText(text);
		tmpTextLink.setFontWeight(oFF.UiFontWeight.BOLD);
		tmpTextLink.setWrapping(wrapping);
		tmpTextLink.registerOnPress(this);
		tmpTextLink.setCustomObject(linkedUiType);
	}
	else
	{
		var tmpTextLbl = labelLayout.addNewItemOfType(oFF.UiType.LABEL);
		tmpTextLbl.setText(text);
		tmpTextLbl.setFontWeight(oFF.UiFontWeight.BOLD);
		tmpTextLbl.setWrapping(wrapping);
	}
	return labelLayout;
};
oFF.FutVulcanUiControlsView.prototype.createUiTypeCharacteristicsTab = function(uiType, title, characteristic)
{
	var tmpTabItem = this.m_genesis.newControl(oFF.UiType.ICON_TAB_BAR_ITEM);
	tmpTabItem.setText(title);
	var tabWrapperFlexLayout = tmpTabItem.setNewContent(oFF.UiType.FLEX_LAYOUT);
	tabWrapperFlexLayout.setDirection(oFF.UiFlexDirection.COLUMN);
	var ownCharacteristicsListStr = this.getUiTypeCharacteristicAsString(uiType, characteristic);
	var ownLbl = tabWrapperFlexLayout.addNewItemOfType(oFF.UiType.LABEL);
	ownLbl.setWrapping(true);
	ownLbl.setFlex("0 0 auto");
	ownLbl.setMargin(oFF.UiCssBoxEdges.create("10px"));
	ownLbl.setText(ownCharacteristicsListStr);
	var superType = uiType.getSuperType();
	var inheritedLbl = null;
	if (oFF.notNull(superType))
	{
		inheritedLbl = tabWrapperFlexLayout.addNewItemOfType(oFF.UiType.LABEL);
		inheritedLbl.setWrapping(true);
		inheritedLbl.setFlex("0 0 auto");
		inheritedLbl.setMargin(oFF.UiCssBoxEdges.create("10px"));
		inheritedLbl.setFontSize(oFF.UiCssLength.create("17px"));
		inheritedLbl.setFontWeight(oFF.UiFontWeight.BOLD);
		inheritedLbl.setText("Inherited:");
	}
	var isSomethingInherited = false;
	while (oFF.notNull(superType))
	{
		var tmpCharacteristicsSortedStr = this.getUiTypeCharacteristicAsString(superType, characteristic);
		if (!oFF.XString.isEqual(tmpCharacteristicsSortedStr, "-"))
		{
			this.addUiTypeTabSection(tabWrapperFlexLayout, superType, tmpCharacteristicsSortedStr);
			isSomethingInherited = true;
		}
		superType = superType.getSuperType();
	}
	if (!isSomethingInherited && oFF.notNull(inheritedLbl))
	{
		tabWrapperFlexLayout.removeItem(inheritedLbl);
	}
	return tmpTabItem;
};
oFF.FutVulcanUiControlsView.prototype.addUiTypeTabSection = function(tabFlexLayout, uiType, text)
{
	if (oFF.notNull(uiType))
	{
		var tmpPanel = tabFlexLayout.addNewItemOfType(oFF.UiType.PANEL);
		tmpPanel.setFlex("0 0 75px");
		var tmpPanelHeaderLink = tmpPanel.setNewHeader(oFF.UiType.LINK);
		tmpPanelHeaderLink.setText(uiType.getName());
		tmpPanelHeaderLink.setFontSize(oFF.UiCssLength.create("16px"));
		tmpPanelHeaderLink.setFontWeight(oFF.UiFontWeight.BOLD);
		tmpPanelHeaderLink.setWrapping(false);
		tmpPanelHeaderLink.registerOnPress(this);
		tmpPanelHeaderLink.setCustomObject(uiType);
		var propertiesLbl = tmpPanel.setNewContent(oFF.UiType.LABEL);
		propertiesLbl.useMaxSpace();
		propertiesLbl.setWrapping(true);
		propertiesLbl.setText(text);
	}
};
oFF.FutVulcanUiControlsView.prototype.getUiTypeCharacteristicAsString = function(tmpType, characteristic)
{
	var tmpCharaceristicsListSorted = null;
	if (oFF.notNull(tmpType))
	{
		if (characteristic === oFF.FutVulcanUiControlsView.CHARACTERISTIC_PROPERTIES)
		{
			tmpCharaceristicsListSorted = tmpType.getOwnPropertyNamesSorted();
		}
		else if (characteristic === oFF.FutVulcanUiControlsView.CHARACTERISTIC_AGGREGATIONS)
		{
			tmpCharaceristicsListSorted = tmpType.getOwnAggregationNamesSorted();
		}
		else if (characteristic === oFF.FutVulcanUiControlsView.CHARACTERISTIC_METHODS)
		{
			tmpCharaceristicsListSorted = tmpType.getOwnMethodNamesSorted();
		}
		else if (characteristic === oFF.FutVulcanUiControlsView.CHARACTERISTIC_EVENTS)
		{
			tmpCharaceristicsListSorted = tmpType.getOwnEventNamesSorted();
		}
		else if (characteristic === oFF.FutVulcanUiControlsView.CHARACTERISTIC_INTERFACES)
		{
			tmpCharaceristicsListSorted = tmpType.getOwnInterfaceNamesSorted();
		}
	}
	var tmpPropsSortedStr = this.generateCharacteristicItemsString(tmpCharaceristicsListSorted);
	return tmpPropsSortedStr;
};
oFF.FutVulcanUiControlsView.prototype.generateCharacteristicItemsString = function(itemsList)
{
	if (oFF.notNull(itemsList) && !itemsList.isEmpty())
	{
		var strBuffer = oFF.XStringBuffer.create();
		var itemIterator = itemsList.getIterator();
		while (itemIterator.hasNext())
		{
			var prop = itemIterator.next();
			strBuffer.append(prop);
			if (itemIterator.hasNext())
			{
				strBuffer.append(", ");
			}
		}
		return strBuffer.toString();
	}
	return "-";
};
oFF.FutVulcanUiControlsView.prototype.openUiTypeDetailsForLink = function(link)
{
	if (oFF.notNull(link))
	{
		var linkedType = link.getCustomObject();
		if (oFF.notNull(linkedType))
		{
			var linkedTypeName = linkedType.getName();
			if (oFF.notNull(this.m_controlList))
			{
				this.m_controlList.setSelectedName(linkedTypeName);
				this.updateControlDetailsSection(linkedType);
			}
		}
	}
};
oFF.FutVulcanUiControlsView.prototype.onSelect = function(event)
{
	var selectedListItem = event.getSelectedItem();
	var tmpUiType = selectedListItem.getCustomObject();
	this.updateControlDetailsSection(tmpUiType);
};
oFF.FutVulcanUiControlsView.prototype.onLiveChange = function(event)
{
	if (event.getControl() === this.m_searchInput)
	{
		this.filterControlList(event.getControl().getText(), false);
	}
};
oFF.FutVulcanUiControlsView.prototype.onSearch = function(event)
{
	var didPressClearButton = event.getParameters().getBooleanByKeyExt(oFF.UiControlEvent.PARAM_CLEAR_BUTTON_PRESSED, false);
	var searchText = event.getParameters().getStringByKeyExt(oFF.UiControlEvent.PARAM_SEARCH_TEXT, "");
	this.filterControlList(searchText, didPressClearButton);
};
oFF.FutVulcanUiControlsView.prototype.onPress = function(event)
{
	var element = event.getControl();
	if (element.getUiType() === oFF.UiType.LINK)
	{
		var tmpLink = element;
		this.openUiTypeDetailsForLink(tmpLink);
	}
};

oFF.FutVulcanUiPopupsView = function() {};
oFF.FutVulcanUiPopupsView.prototype = new oFF.XObject();
oFF.FutVulcanUiPopupsView.prototype._ff_c = "FutVulcanUiPopupsView";

oFF.FutVulcanUiPopupsView.createUiControlsPageView = function(genesis)
{
	if (oFF.isNull(genesis))
	{
		throw oFF.XException.createRuntimeException("You need to specify a genesis instance in order to create a Vulcan Ui Popups View!");
	}
	var newView = new oFF.FutVulcanUiPopupsView();
	newView.setupInternal(genesis);
	return newView;
};
oFF.FutVulcanUiPopupsView.prototype.m_genesis = null;
oFF.FutVulcanUiPopupsView.prototype.m_viewPage = null;
oFF.FutVulcanUiPopupsView.prototype.releaseObject = function()
{
	oFF.XObject.prototype.releaseObject.call( this );
	this.m_genesis = null;
	this.m_viewPage = oFF.XObjectExt.release(this.m_viewPage);
};
oFF.FutVulcanUiPopupsView.prototype.setupInternal = function(genesis)
{
	this.m_genesis = genesis;
	this.createView(genesis);
};
oFF.FutVulcanUiPopupsView.prototype.createView = function(genesis)
{
	this.m_viewPage = this.m_genesis.newControl(oFF.UiType.PAGE);
	this.m_viewPage.setName("futVulcanUiPopupsViewPage");
	this.m_viewPage.setShowHeader(true);
	this.m_viewPage.setText("Ui Popups");
	this.m_viewPage.useMaxSpace();
	var mainLayout = this.m_viewPage.setNewContent(oFF.UiType.FLEX_LAYOUT);
	mainLayout.setName("futVulcanUiPopupsViewPageLayout");
	mainLayout.useMaxSpace();
	mainLayout.setDirection(oFF.UiFlexDirection.ROW);
	mainLayout.setAlignItems(oFF.UiFlexAlignItems.CENTER);
	mainLayout.setJustifyContent(oFF.UiFlexJustifyContent.CENTER);
	mainLayout.setWrap(oFF.UiFlexWrap.NO_WRAP);
	mainLayout.setBackgroundColor(oFF.UiColor.create("#f9fafc"));
	this.createPopupButtons(mainLayout);
};
oFF.FutVulcanUiPopupsView.prototype.getPage = function()
{
	return this.m_viewPage;
};
oFF.FutVulcanUiPopupsView.prototype.createPopupButtons = function(layout)
{
	var confirmPopupBtn = layout.addNewItemOfType(oFF.UiType.BUTTON);
	confirmPopupBtn.setName("futVulcanUiPopupsConfirmBtn");
	confirmPopupBtn.setText("Confirm Popup");
	confirmPopupBtn.setIcon("accept");
	confirmPopupBtn.registerOnPress(this);
	confirmPopupBtn.setMargin(oFF.UiCssBoxEdges.create("10px"));
	var inputPopupBtn = layout.addNewItemOfType(oFF.UiType.BUTTON);
	inputPopupBtn.setName("futVulcanUiPopupsInputBtn");
	inputPopupBtn.setText("Input Popup");
	inputPopupBtn.setIcon("text");
	inputPopupBtn.registerOnPress(this);
	inputPopupBtn.setMargin(oFF.UiCssBoxEdges.create("10px"));
	var formPopupBtn = layout.addNewItemOfType(oFF.UiType.BUTTON);
	formPopupBtn.setName("futVulcanUiPopupsFormBtn");
	formPopupBtn.setText("Form Popup");
	formPopupBtn.setIcon("form");
	formPopupBtn.registerOnPress(this);
	formPopupBtn.setMargin(oFF.UiCssBoxEdges.create("10px"));
};
oFF.FutVulcanUiPopupsView.prototype.openConfirmPopup = function()
{
	var newConfirmPopup = oFF.UiConfirmPopup.create(this.m_genesis, "Really?", "Are you sure that you want to delete the internet?");
	newConfirmPopup.setConfirmButtonText("Delete it!");
	newConfirmPopup.setConfirmButtonIcon("delete");
	newConfirmPopup.setConfirmButtonType(oFF.UiButtonType.DESTRUCTIVE);
	newConfirmPopup.setConfirmProcedure( function(){
		this.m_genesis.showSuccessToast("You have sucessfully deleted the internet!");
	}.bind(this));
	newConfirmPopup.open();
};
oFF.FutVulcanUiPopupsView.prototype.openInputPopup = function()
{
	var newInputPoptup = oFF.UiInputPopup.create(this.m_genesis, "Save as...", "Please specify the file");
	newInputPoptup.setInputPlaceholder("File path");
	newInputPoptup.setInputValue("");
	newInputPoptup.setOkButtonText("Save");
	newInputPoptup.setOkButtonIcon("save");
	newInputPoptup.setInputConsumer( function(text){
		this.m_genesis.showSuccessToast(oFF.XStringUtils.concatenate2("File: ", text));
	}.bind(this));
	newInputPoptup.open();
};
oFF.FutVulcanUiPopupsView.prototype.openFormMenu = function(control)
{
	var formMenu = this.m_genesis.newControl(oFF.UiType.MENU);
	var formItemsMenuItem = formMenu.addNewItem();
	formItemsMenuItem.setName("formItemsMenuItem");
	formItemsMenuItem.setText("Form items");
	formItemsMenuItem.registerOnPress(this);
	var complexFormMenuItem = formMenu.addNewItem();
	complexFormMenuItem.setName("complexFormMenuItem");
	complexFormMenuItem.setText("Complex form");
	complexFormMenuItem.registerOnPress(this);
	var centralFormLabelsMenuItem = formMenu.addNewItem();
	centralFormLabelsMenuItem.setName("centralFormLabelsMenuItem");
	centralFormLabelsMenuItem.setText("Central form labels");
	centralFormLabelsMenuItem.registerOnPress(this);
	formMenu.openAt(control);
};
oFF.FutVulcanUiPopupsView.prototype.openFormItemsFormPopup = function()
{
	var ddDummyEntries = oFF.XHashMapOfStringByString.create();
	ddDummyEntries.put("entry1", "Entry 1");
	ddDummyEntries.put("entry2", "Entry 2");
	var formPopup = oFF.UiFormPopup.create(this.m_genesis, "Form items", this);
	var modelIncludedSection = formPopup.addFormSection("modelIncludedSection", "Included in model", false);
	modelIncludedSection.showSectionMarker(true);
	modelIncludedSection.addInput("input", "", "Input", false, "", null);
	modelIncludedSection.addDropdown("dropdown", "entry1", "Dropdown", false, ddDummyEntries, false);
	modelIncludedSection.addSwitch("switch", false, "Switch");
	var dumbControlSection = formPopup.addFormSection("dumbControlSection", "Dumb controls", false);
	dumbControlSection.showSectionMarker(true);
	dumbControlSection.addFormLabel("label", "Just a label", "Label");
	dumbControlSection.addFormButton("button", "Just a button", "button", null,  function(){
		this.m_genesis.showInfoToast("Button pressed");
	}.bind(this));
	formPopup.open();
};
oFF.FutVulcanUiPopupsView.prototype.openComplexFormPopup = function()
{
	var regionMap = oFF.XHashMapOfStringByString.create();
	regionMap.put("de", "Germany");
	regionMap.put("us", "USA");
	regionMap.put("uk", "UK");
	regionMap.put("fr", "France");
	var formPopup = oFF.UiFormPopup.create(this.m_genesis, "Complex form", this);
	var labelSection = formPopup.addFormSection(null, null, true);
	labelSection.addFormLabel("lbl1", "Test label", "Tooltip");
	labelSection.addFormLabel("lbl2", "Required labbel", "IS required").setRequired(true);
	labelSection.addFormLabel("lbl3", "One more", "Tooltip");
	var firstName = formPopup.addInput("firstName", "", "First name", false, "", null);
	firstName.setCustomValidator( function(formItem0){
		if (firstName.isEmpty() || oFF.XString.size(oFF.XValueUtil.getString(firstName.getValue())) < 4)
		{
			formItem0.setInvalid("First name must be at least 4 characters long");
		}
		else
		{
			formItem0.setValid();
		}
	}.bind(this));
	var lastName = formPopup.addInput("lastName", "", "Last name", true, "", null);
	var pwdField1 = formPopup.addInput("password", "", "Super secret password", true, "", oFF.UiInputType.PASSWORD);
	var pwdField2 = formPopup.addInput("passwordRepeat", "", "Repeat password", false, "", oFF.UiInputType.PASSWORD);
	pwdField2.setCustomValidator( function(formItem){
		if (!pwdField1.getValue().isEqualTo(pwdField2.getValue()))
		{
			formItem.setInvalid("Passwords are not equal!");
		}
		else
		{
			formItem.setValid();
		}
	}.bind(this));
	var regionDd = formPopup.addDropdown("region", null, "Region", true, regionMap, true);
	regionDd.registerOnFormItemEvents(this);
	var shareDataSwitch = formPopup.addSwitch("shareData", false, "Share data?");
	var tmpSection = formPopup.addFormSection("address", "This is an example description of a form section", true);
	var adrStreet = tmpSection.addInput("street", "", "", true, "Street", null);
	adrStreet.setFlex("29%");
	var adrHousenum = tmpSection.addInput("number", "", "", true, "House number", null);
	adrHousenum.setCustomRequiredText("Not so fast! This is required!");
	adrHousenum.setFlex("29%");
	var adrCity = tmpSection.addInput("city", "", "", true, "City", null);
	adrCity.setFlex("29%");
	tmpSection.addFormButton(null, "", "Remove this section!", "delete",  function(){
		formPopup.removeFormItemByKey("address");
	}.bind(this));
	var phoneSection = formPopup.addFormSection("phone", null, true);
	phoneSection.showSectionMarker(true);
	var phoneHome = phoneSection.addInput("homePhone", "", "Home phone", false, "", oFF.UiInputType.NUMBER);
	phoneHome.setFlex("1 1 25%");
	var phoneMobile = phoneSection.addInput("mobilePhone", "", "Mobile phone", false, "", oFF.UiInputType.NUMBER);
	phoneMobile.setFlex("1 1 25%");
	var isPrivate = phoneSection.addSwitch("isPrivate", false, "Is private?");
	isPrivate.setFlex("1 1 46%");
	phoneSection.setCustomRequiredText("");
	phoneSection.setCustomValidator( function(formItem3){
		if (isPrivate.getValue().isEqualTo(oFF.XBooleanValue.create(false)))
		{
			formItem3.setInvalid("Private switch must be ON in order to proceed!");
		}
		else
		{
			formItem3.setValid();
		}
	}.bind(this));
	var autoFillBtn = formPopup.addFormButton(null, "Autofill form", "Autofill form", "car-rental",  function(){
		firstName.setValue(oFF.XStringValue.create("This is my first name"));
		lastName.setValue(oFF.XStringValue.create("This should be my last name"));
		pwdField1.setValue(oFF.XStringValue.create("secretPWd"));
		pwdField2.setValue(oFF.XStringValue.create("secretPWd"));
		regionDd.setValue(oFF.XStringValue.create("us"));
		shareDataSwitch.setValue(oFF.XBooleanValue.create(true));
		adrStreet.setValue(oFF.XStringValue.create("Some street"));
		adrHousenum.setValue(oFF.XStringValue.create("666"));
		adrCity.setValue(oFF.XStringValue.create("Funny city"));
		phoneHome.setValue(oFF.XStringValue.create("6666666655"));
		phoneMobile.setValue(oFF.XStringValue.create("123456343"));
		isPrivate.setValue(oFF.XBooleanValue.create(true));
		tmpSection.validate();
		phoneSection.validate();
	}.bind(this));
	autoFillBtn.setButtonType(oFF.UiButtonType.PRIMARY);
	formPopup.open();
};
oFF.FutVulcanUiPopupsView.prototype.openCentralLabelsFormPopup = function()
{
	var formPopup = oFF.UiFormPopup.create(this.m_genesis, "Central form labels", this);
	var labelSection = formPopup.addFormSection(null, null, true);
	labelSection.addFormLabel("lbl1", "Name", null).setFlex("2 0 190px");
	labelSection.addFormLabel("lbl2", "Type", null).setFlex("1 0 110px");
	labelSection.addFormLabel("lbl3", "Technical Name", null).setFlex("2 0 190px");
	labelSection.addFormLabel("dummyLbl", null, null).setFlex("0 0 32px");
	var fieldsSection = formPopup.addFormSection("fields", null, true);
	var textItem = fieldsSection.addInput("name", null, "Name", true, "", null);
	textItem.setFlex("2 0 190px");
	textItem.setShowLabel(false);
	var scopeItem = fieldsSection.addDropdown("type", null, "Type", false, null, false);
	scopeItem.setFlex("1 0 110px");
	scopeItem.setShowLabel(false);
	var nameItem = fieldsSection.addInput("technicalName", null, "Technical Name", true, "", null);
	nameItem.setFlex("2 0 190px");
	nameItem.setShowLabel(false);
	var buttonItem = fieldsSection.addFormButton("delete", null, null, "delete", null);
	buttonItem.setFlex("0 0 auto");
	var fieldsSection2 = formPopup.addFormSection("fields", null, true);
	var textItem2 = fieldsSection2.addInput("name", null, "Name", true, "", null);
	textItem2.setFlex("2 0 190px");
	textItem2.setShowLabel(false);
	var scopeItem2 = fieldsSection2.addDropdown("type", null, "Type", false, null, false);
	scopeItem2.setFlex("1 0 110px");
	scopeItem2.setShowLabel(false);
	var nameItem2 = fieldsSection2.addInput("technicalName", null, "Technical Name", true, "", null);
	nameItem2.setFlex("2 0 190px");
	nameItem2.setShowLabel(false);
	var buttonItem2 = fieldsSection2.addFormButton("delete", null, null, "delete", null);
	buttonItem2.setFlex("0 0 auto");
	formPopup.open();
};
oFF.FutVulcanUiPopupsView.prototype.onPress = function(event)
{
	var element = event.getControl();
	if (element.getUiType() === oFF.UiType.BUTTON)
	{
		switch (element.getName())
		{
			case "futVulcanUiPopupsConfirmBtn":
				this.openConfirmPopup();
				break;

			case "futVulcanUiPopupsInputBtn":
				this.openInputPopup();
				break;

			case "futVulcanUiPopupsFormBtn":
				this.openFormMenu(event.getControl());
				break;

			default:
				break;
		}
	}
	else if (element.getUiType() === oFF.UiType.MENU_ITEM)
	{
		switch (element.getName())
		{
			case "formItemsMenuItem":
				this.openFormItemsFormPopup();
				break;

			case "complexFormMenuItem":
				this.openComplexFormPopup();
				break;

			case "centralFormLabelsMenuItem":
				this.openCentralLabelsFormPopup();
				break;

			default:
				break;
		}
	}
};
oFF.FutVulcanUiPopupsView.prototype.onFormPopupSubmit = function(popup, prefsStruct)
{
	this.m_genesis.showSuccessToast(oFF.XStringUtils.concatenate2("Model: ", prefsStruct.toString()));
};
oFF.FutVulcanUiPopupsView.prototype.onFormItemValueChanged = function(item, key, newValue)
{
	if (oFF.notNull(newValue))
	{
		this.m_genesis.showWarningToast(newValue.toString());
	}
};
oFF.FutVulcanUiPopupsView.prototype.onFormItemEnteredPressed = function(formItem) {};

oFF.SleMetisFormItem = function() {};
oFF.SleMetisFormItem.prototype = new oFF.XObject();
oFF.SleMetisFormItem.prototype._ff_c = "SleMetisFormItem";

oFF.SleMetisFormItem.createFormItem = function(formLayout, text, inputType, cssWidth, liveChangeListener)
{
	if (oFF.isNull(formLayout))
	{
		throw oFF.XException.createRuntimeException("Missing parent form layout. Cannot create form item!");
	}
	var formItem = new oFF.SleMetisFormItem();
	formItem.setupInternal(formLayout, text, inputType, cssWidth, liveChangeListener);
	return formItem;
};
oFF.SleMetisFormItem.prototype.m_itemWrapper = null;
oFF.SleMetisFormItem.prototype.m_itemLabel = null;
oFF.SleMetisFormItem.prototype.m_itemInput = null;
oFF.SleMetisFormItem.prototype.m_liveChangeListener = null;
oFF.SleMetisFormItem.prototype.releaseObject = function()
{
	this.m_itemWrapper = oFF.XObjectExt.release(this.m_itemWrapper);
	this.m_itemLabel = oFF.XObjectExt.release(this.m_itemLabel);
	this.m_itemInput = oFF.XObjectExt.release(this.m_itemInput);
	this.m_liveChangeListener = oFF.XObjectExt.release(this.m_liveChangeListener);
	oFF.XObject.prototype.releaseObject.call( this );
};
oFF.SleMetisFormItem.prototype.setupInternal = function(formLayout, text, inputType, cssWidth, liveChangeListener)
{
	var itemName = oFF.XString.replace(text, " ", "");
	itemName = oFF.XString.toLowerCase(itemName);
	this.m_itemWrapper = formLayout.addNewItemOfType(oFF.UiType.VERTICAL_LAYOUT);
	this.m_itemWrapper.setName(oFF.XStringUtils.concatenate2(itemName, "_wrapper"));
	this.m_itemWrapper.setWidth(oFF.UiCssLength.create(cssWidth));
	this.m_itemWrapper.setFlex(oFF.XStringUtils.concatenate2("1 1 ", cssWidth));
	this.m_itemWrapper.setPadding(oFF.UiCssBoxEdges.create("10px"));
	this.m_itemLabel = this.m_itemWrapper.addNewItemOfType(oFF.UiType.LABEL);
	this.m_itemLabel.setName(oFF.XStringUtils.concatenate2(itemName, "_label"));
	this.m_itemLabel.setText(oFF.XStringUtils.concatenate2(text, ":"));
	this.m_itemLabel.setFontWeight(oFF.UiFontWeight.BOLD);
	this.m_itemInput = this.m_itemWrapper.addNewItemOfType(oFF.UiType.INPUT);
	this.m_itemInput.setName(oFF.XStringUtils.concatenate2(itemName, "_input"));
	this.m_itemInput.setInputType(oFF.isNull(inputType) ? oFF.UiInputType.TEXT : inputType);
	this.m_itemInput.setPlaceholder("");
	this.m_itemInput.setEditable(false);
	this.m_itemInput.registerOnLiveChange(this);
	if (inputType === oFF.UiInputType.PASSWORD)
	{
		var showPasswordBtn = this.m_itemInput.addNewEndIcon();
		showPasswordBtn.setName(oFF.XStringUtils.concatenate2(itemName, "_showPwdEndIcon"));
		showPasswordBtn.setTag("showPwdEndIcon");
		showPasswordBtn.setIcon("show");
		showPasswordBtn.setTooltip("Show password");
		showPasswordBtn.registerOnPress(this);
	}
	this.m_liveChangeListener = liveChangeListener;
};
oFF.SleMetisFormItem.prototype.setText = function(text)
{
	this.m_itemInput.setText(text);
};
oFF.SleMetisFormItem.prototype.getText = function()
{
	return this.m_itemInput.getText();
};
oFF.SleMetisFormItem.prototype.setRequired = function(required)
{
	this.m_itemInput.setRequired(required);
	this.m_itemLabel.setRequired(required);
};
oFF.SleMetisFormItem.prototype.isRequired = function()
{
	return this.m_itemInput.isRequired();
};
oFF.SleMetisFormItem.prototype.setEditable = function(editable)
{
	this.m_itemInput.setEditable(editable);
};
oFF.SleMetisFormItem.prototype.isEditable = function()
{
	return this.m_itemInput.isEditable();
};
oFF.SleMetisFormItem.prototype.setInvalid = function()
{
	this.m_itemInput.setBorderStyle(oFF.UiBorderStyle.SOLID);
	this.m_itemInput.setBorderColor(oFF.UiColor.RED);
	this.m_itemInput.setBorderWidth(oFF.UiCssBoxEdges.create("1px"));
	this.m_itemInput.setBackgroundColor(oFF.UiColor.createByRgba(200, 20, 20, 0.1));
};
oFF.SleMetisFormItem.prototype.setValid = function()
{
	this.m_itemInput.setBorderStyle(null);
	this.m_itemInput.setBorderColor(null);
	this.m_itemInput.setBorderWidth(null);
	this.m_itemInput.setBackgroundColor(null);
};
oFF.SleMetisFormItem.prototype.focus = function()
{
	this.m_itemInput.focus();
};
oFF.SleMetisFormItem.prototype.onLiveChange = function(event)
{
	if (oFF.notNull(this.m_liveChangeListener))
	{
		this.m_liveChangeListener.onMetisFormItemLiveChange(this);
	}
};
oFF.SleMetisFormItem.prototype.onPress = function(event)
{
	if (oFF.notNull(this.m_itemInput) && this.m_itemInput.hasEndIcons())
	{
		var tmpEndIcon = this.m_itemInput.getEndIcon(0);
		if (oFF.notNull(tmpEndIcon))
		{
			var isPwdVisible = !oFF.XString.isEqual(tmpEndIcon.getIcon(), "show");
			if (!isPwdVisible)
			{
				this.m_itemInput.setInputType(oFF.UiInputType.TEXT);
				tmpEndIcon.setIcon("hide");
				tmpEndIcon.setTooltip("Hide password");
			}
			else
			{
				this.m_itemInput.setInputType(oFF.UiInputType.PASSWORD);
				tmpEndIcon.setIcon("show");
				tmpEndIcon.setTooltip("Show password");
			}
		}
	}
};

oFF.SleMetisImporter = function() {};
oFF.SleMetisImporter.prototype = new oFF.XObject();
oFF.SleMetisImporter.prototype._ff_c = "SleMetisImporter";

oFF.SleMetisImporter.createNewMetisImporter = function(application, genesis, listener)
{
	var prg = new oFF.SleMetisImporter();
	if (oFF.isNull(application))
	{
		throw oFF.XException.createRuntimeException("Cannot create a Metis importer instance without an application. Please sepcify an application!");
	}
	if (oFF.isNull(genesis))
	{
		throw oFF.XException.createRuntimeException("Cannot create a Metis importer instance without a genesis object. Please sepcify a genesis object!");
	}
	prg.setupImporter(application, genesis, listener);
	return prg;
};
oFF.SleMetisImporter.prototype.m_application = null;
oFF.SleMetisImporter.prototype.m_genesis = null;
oFF.SleMetisImporter.prototype.m_listener = null;
oFF.SleMetisImporter.prototype.m_dialog = null;
oFF.SleMetisImporter.prototype.m_urlInput = null;
oFF.SleMetisImporter.prototype.m_systemNameInput = null;
oFF.SleMetisImporter.prototype.releaseObject = function()
{
	oFF.XObject.prototype.releaseObject.call( this );
	this.m_application = null;
	this.m_genesis = null;
	this.m_listener = null;
	this.m_dialog = oFF.XObjectExt.release(this.m_dialog);
	this.m_urlInput = oFF.XObjectExt.release(this.m_urlInput);
	this.m_systemNameInput = oFF.XObjectExt.release(this.m_systemNameInput);
};
oFF.SleMetisImporter.prototype.setupImporter = function(application, genesis, listener)
{
	this.m_application = application;
	this.m_genesis = genesis;
	this.m_listener = listener;
	this.buildView(this.m_genesis);
};
oFF.SleMetisImporter.prototype.open = function()
{
	if (oFF.notNull(this.m_dialog))
	{
		this.m_dialog.open();
	}
};
oFF.SleMetisImporter.prototype.close = function()
{
	if (oFF.notNull(this.m_dialog))
	{
		this.m_dialog.close();
	}
};
oFF.SleMetisImporter.prototype.startImport = function()
{
	var slUrl = this.m_urlInput.getText();
	if (oFF.XStringUtils.isNotNullAndNotEmpty(slUrl))
	{
		var tmpUri = oFF.XUri.createFromUrl(slUrl);
		var systemName = this.m_systemNameInput.getText();
		if (oFF.XStringUtils.isNullOrEmpty(systemName))
		{
			systemName = tmpUri.getQueryMap().getByKey("systemName");
		}
		if (oFF.XStringUtils.isNotNullAndNotEmpty(systemName))
		{
			var sysDesc = this.m_application.getSystemLandscape().getSystemDescription(systemName);
			if (oFF.notNull(sysDesc))
			{
				tmpUri.setUser(sysDesc.getUser());
				tmpUri.setPassword(sysDesc.getPassword());
			}
		}
		var slFile = oFF.XFile.createByUri(this.m_application.getSession(), tmpUri);
		if (oFF.notNull(slFile))
		{
			this.m_dialog.getContent().setBusy(true);
			this.m_dialog.getDialogButtonByName("sleMetisImporterDialogOkBtn").setEnabled(false);
			slFile.processLoad(oFF.SyncType.NON_BLOCKING, this, null, oFF.CompressionType.NONE);
		}
		else
		{
			this.m_urlInput.setValueState(oFF.UiValueState.ERROR);
			this.m_urlInput.setValueStateText("Wrong url format");
			this.showErrorMessage("Wrong url format!");
		}
	}
	else
	{
		this.m_urlInput.setValueState(oFF.UiValueState.ERROR);
		this.m_urlInput.setValueStateText("URL cannot be empty");
		this.showErrorMessage("Missing url!");
	}
};
oFF.SleMetisImporter.prototype.parseSystemLadscape = function(systems)
{
	var systemsStructure = systems.getStructureByKey("Systems");
	if (oFF.notNull(systemsStructure))
	{
		var systemLandscape = this.m_application.getSystemLandscape();
		oFF.SystemLandscapeLoadAction.setSystems(systemsStructure, systemLandscape);
		this.m_dialog.close();
		this.showSuccessMessage("Systems successfully loaded!");
		if (oFF.notNull(this.m_listener))
		{
			this.m_listener.onMetisImportSuccess();
		}
	}
	else
	{
		this.showErrorMessage("Missing 'Systems' property. Is the specified JSON in the correct format?");
	}
};
oFF.SleMetisImporter.prototype.showSuccessMessage = function(text)
{
	if (oFF.notNull(this.m_genesis))
	{
		this.m_genesis.showSuccessToast(text);
	}
};
oFF.SleMetisImporter.prototype.showErrorMessage = function(text)
{
	this.m_genesis.showErrorToast(text);
	this.m_dialog.getContent().setBusy(false);
	this.m_dialog.getDialogButtonByName("sleMetisImporterDialogOkBtn").setEnabled(true);
};
oFF.SleMetisImporter.prototype.buildView = function(genesis)
{
	this.m_dialog = genesis.newControl(oFF.UiType.DIALOG);
	this.m_dialog.setName("sleMetisImporterDialog");
	this.m_dialog.setTitle("System Landscape importer");
	this.m_dialog.setPadding(oFF.UiCssBoxEdges.create("20px"));
	this.m_dialog.setWidth(oFF.UiCssLength.create("600px"));
	this.m_dialog.registerOnAfterOpen(this);
	this.m_dialog.registerOnAfterClose(this);
	var okButton = this.m_dialog.addNewDialogButton();
	okButton.setName("sleMetisImporterDialogOkBtn");
	okButton.setText("Import");
	okButton.setButtonType(oFF.UiButtonType.PRIMARY);
	okButton.registerOnPress(this);
	var cancelButton = this.m_dialog.addNewDialogButton();
	cancelButton.setName("sleMetisImporterDialogCancelBtn");
	cancelButton.setText("Cancel");
	cancelButton.setButtonType(oFF.UiButtonType.DEFAULT);
	cancelButton.registerOnPress(this);
	var mainLayout = genesis.newControl(oFF.UiType.FLEX_LAYOUT);
	mainLayout.setDirection(oFF.UiFlexDirection.COLUMN);
	var importLabel = mainLayout.addNewItemOfType(oFF.UiType.LABEL);
	importLabel.setName("sleImportLbl");
	importLabel.setWrapping(true);
	importLabel.setText("Import systems from the specified URL into the system landscape. Specify a system name to retrieve the credentials for the specified URL.");
	this.m_urlInput = mainLayout.addNewItemOfType(oFF.UiType.INPUT);
	this.m_urlInput.setName("sleUrlInput");
	this.m_urlInput.setPlaceholder("System landscape url");
	this.m_urlInput.setRequired(true);
	this.m_urlInput.registerOnLiveChange(this);
	this.m_systemNameInput = mainLayout.addNewItemOfType(oFF.UiType.INPUT);
	this.m_systemNameInput.setName("sleSystemNameInput");
	this.m_systemNameInput.setPlaceholder("System name");
	this.m_dialog.setContent(mainLayout);
};
oFF.SleMetisImporter.prototype.onPress = function(event)
{
	switch (event.getControl().getName())
	{
		case "sleMetisImporterDialogOkBtn":
			this.startImport();
			break;

		case "sleMetisImporterDialogCancelBtn":
			this.m_dialog.close();
			break;

		default:
	}
};
oFF.SleMetisImporter.prototype.onFileLoaded = function(extResult, file, fileContent, customIdentifier)
{
	if (extResult.isValid())
	{
		if (oFF.notNull(fileContent))
		{
			var jsonContent = fileContent.getJsonContent();
			if (oFF.notNull(jsonContent) && jsonContent.isStructure())
			{
				var systems = jsonContent;
				this.parseSystemLadscape(systems);
			}
			else
			{
				this.showErrorMessage("Failed to parse the response!");
			}
		}
		else
		{
			this.showErrorMessage("No json in the response!");
		}
	}
	else
	{
		this.showErrorMessage("Could not retrieve system landscape!");
	}
};
oFF.SleMetisImporter.prototype.onLiveChange = function(event)
{
	if (event.getControl() === this.m_urlInput)
	{
		this.m_urlInput.setValueState(oFF.UiValueState.NONE);
	}
};
oFF.SleMetisImporter.prototype.onAfterOpen = function(event)
{
	this.m_urlInput.focus();
};
oFF.SleMetisImporter.prototype.onAfterClose = function(event)
{
	this.m_dialog.getContent().setBusy(false);
	this.m_dialog.getDialogButtonByName("sleMetisImporterDialogOkBtn").setEnabled(true);
	this.m_urlInput.setValueState(oFF.UiValueState.NONE);
	this.m_urlInput.setText("");
	this.m_systemNameInput.setText("");
};

oFF.SelectYearListener = function() {};
oFF.SelectYearListener.prototype = new oFF.XObjectExt();
oFF.SelectYearListener.prototype._ff_c = "SelectYearListener";

oFF.SelectYearListener.create = function(yearSelectionView, year)
{
	var obj = new oFF.SelectYearListener();
	obj.m_year = year;
	obj.m_yearSelectionView = yearSelectionView;
	return obj;
};
oFF.SelectYearListener.prototype.m_year = 0;
oFF.SelectYearListener.prototype.m_yearSelectionView = null;
oFF.SelectYearListener.prototype.onPress = function(event)
{
	this.m_yearSelectionView.selectYear(this.m_year);
};

oFF.FeApolloItemBase = function() {};
oFF.FeApolloItemBase.prototype = new oFF.XObjectExt();
oFF.FeApolloItemBase.prototype._ff_c = "FeApolloItemBase";

oFF.FeApolloItemBase.prototype.m_associatedFile = null;
oFF.FeApolloItemBase.prototype.m_parent = null;
oFF.FeApolloItemBase.prototype.m_associatedTreeItem = null;
oFF.FeApolloItemBase.prototype.compareTo = function(objectToCompare)
{
	var fileToComapre = objectToCompare;
	return oFF.XString.compare(oFF.XString.toLowerCase(this.getName()), oFF.XString.toLowerCase(fileToComapre.getName()));
};
oFF.FeApolloItemBase.prototype.getAssociatedFileObj = function()
{
	return this.m_associatedFile;
};
oFF.FeApolloItemBase.prototype.getParentDir = function()
{
	return this.m_parent;
};
oFF.FeApolloItemBase.prototype.isDirectory = function()
{
	return this.m_associatedFile.isDirectory();
};
oFF.FeApolloItemBase.prototype.isHidden = function()
{
	return this.m_associatedFile.isHidden();
};
oFF.FeApolloItemBase.prototype.isExecutable = function()
{
	return this.m_associatedFile.getFileType() === oFF.XFileType.PRG;
};
oFF.FeApolloItemBase.prototype.getName = function()
{
	var fileName = this.m_associatedFile.getName();
	if (oFF.XStringUtils.isNotNullAndNotEmpty(fileName))
	{
		return fileName;
	}
	return this.m_associatedFile.getVfsUri().getPath();
};
oFF.FeApolloItemBase.prototype.setAssociatedTreeItem = function(treeItem)
{
	this.m_associatedTreeItem = treeItem;
};
oFF.FeApolloItemBase.prototype.getAssociatedTreeItem = function()
{
	return this.m_associatedTreeItem;
};
oFF.FeApolloItemBase.prototype.setParent = function(parent)
{
	var curParent = this.getParentDir();
	if (oFF.notNull(curParent))
	{
		curParent.removeChildItem(this);
	}
	this.m_parent = parent;
	if (oFF.notNull(parent))
	{
		parent.addChildItem(this);
	}
};
oFF.FeApolloItemBase.prototype.setupApolloItem = function(file, parent)
{
	this.m_associatedFile = file;
	this.setParent(parent);
};

oFF.FeApolloDirectoryManager = function() {};
oFF.FeApolloDirectoryManager.prototype = new oFF.XObjectExt();
oFF.FeApolloDirectoryManager.prototype._ff_c = "FeApolloDirectoryManager";

oFF.FeApolloDirectoryManager.createDirectoryManager = function(session, startingPath)
{
	var fileHandler = new oFF.FeApolloDirectoryManager();
	if (oFF.isNull(session))
	{
		throw oFF.XException.createRuntimeException("Cannot create a Apollo Directory Manager instance without a session. Please sepcify a session!");
	}
	fileHandler.setupDirectoryManager(session, startingPath);
	return fileHandler;
};
oFF.FeApolloDirectoryManager.prototype.m_session = null;
oFF.FeApolloDirectoryManager.prototype.m_rootDirectory = null;
oFF.FeApolloDirectoryManager.prototype.m_activeDirectory = null;
oFF.FeApolloDirectoryManager.prototype.releaseObject = function()
{
	this.m_session = null;
	this.m_rootDirectory = oFF.XObjectExt.release(this.m_rootDirectory);
	this.m_activeDirectory = oFF.XObjectExt.release(this.m_activeDirectory);
	oFF.XObjectExt.prototype.releaseObject.call( this );
};
oFF.FeApolloDirectoryManager.prototype.getLogSeverity = function()
{
	return oFF.Severity.PRINT;
};
oFF.FeApolloDirectoryManager.prototype.setupDirectoryManager = function(session, startingPath)
{
	this.m_session = session;
	var fileSystemManager = this.m_session.getFileSystemManager();
	var activeFileSystem = fileSystemManager.getActiveFileSystem();
	if (oFF.notNull(activeFileSystem))
	{
		var rootFile = activeFileSystem.getRootDirectory();
		if (oFF.notNull(rootFile))
		{
			this.m_rootDirectory = oFF.FeApolloDir.createNewDir(rootFile, null);
			this.setActiveDirectory(this.m_rootDirectory);
		}
	}
};
oFF.FeApolloDirectoryManager.prototype.getActiveDirectory = function()
{
	return this.m_activeDirectory;
};
oFF.FeApolloDirectoryManager.prototype.getRootDirectory = function()
{
	return this.m_rootDirectory;
};
oFF.FeApolloDirectoryManager.prototype.openDirectory = function(directory)
{
	this.setActiveDirectory(directory);
};
oFF.FeApolloDirectoryManager.prototype.refreshActiveDirectory = function()
{
	if (this.getActiveDirectory() !== null)
	{
		this.getActiveDirectory().setContentLoaded(false);
		this.getActiveDirectory().clearChildItems();
		this.loadActiveDirectoryContent();
	}
};
oFF.FeApolloDirectoryManager.prototype.upOneLevel = function()
{
	if (this.m_activeDirectory.getParentDir() !== null)
	{
		this.setActiveDirectory(this.m_activeDirectory.getParentDir());
		return true;
	}
	return false;
};
oFF.FeApolloDirectoryManager.prototype.isTopLevel = function()
{
	if (this.m_activeDirectory.getParentDir() === null)
	{
		return true;
	}
	return false;
};
oFF.FeApolloDirectoryManager.prototype.getCurrentPath = function()
{
	var path = "";
	var directory = this.m_activeDirectory;
	while (oFF.notNull(directory))
	{
		if (directory !== this.m_rootDirectory)
		{
			path = oFF.XStringUtils.concatenate2(oFF.XStringUtils.concatenate2("/", directory.getName()), path);
		}
		directory = directory.getParentDir();
	}
	if (oFF.XString.startsWith(path, "/") === false)
	{
		path = oFF.XStringUtils.concatenate2("/", path);
	}
	return path;
};
oFF.FeApolloDirectoryManager.prototype.itemExistsInActiveDirectory = function(name)
{
	var activeDirFile = this.getActiveDirectory().getAssociatedFileObj();
	var newFile = activeDirFile.newChild(oFF.XString.trim(name));
	if (oFF.isNull(newFile))
	{
		return false;
	}
	return newFile.isExisting();
};
oFF.FeApolloDirectoryManager.prototype.createNewDirectoryItemInActiveDirectory = function(name, isFile)
{
	if (oFF.XStringUtils.isNullOrEmpty(name))
	{
		return false;
	}
	if (this.itemExistsInActiveDirectory(name) === true)
	{
		return false;
	}
	var activeDirFile = this.getActiveDirectory().getAssociatedFileObj();
	var newFile = activeDirFile.newChild(oFF.XString.trim(name));
	if (isFile === true)
	{
		var fileContentToSave = oFF.XByteArray.convertFromString("");
		newFile.saveByteArray(fileContentToSave);
	}
	else
	{
		newFile.mkdir();
	}
	if (newFile.hasErrors())
	{
		return false;
	}
	this.addNewItemToActiveDirectory(newFile);
	return true;
};
oFF.FeApolloDirectoryManager.prototype.getNextFreeItemNameForActiveDir = function(itemName)
{
	var freeItemName = itemName;
	var counter = 0;
	while (this.itemExistsInActiveDirectory(freeItemName))
	{
		counter++;
		freeItemName = oFF.XStringUtils.concatenate3(itemName, " ", oFF.XInteger.convertToString(counter));
	}
	return freeItemName;
};
oFF.FeApolloDirectoryManager.prototype.deleteApolloItemFromActiveDirectory = function(apolloItem)
{
	if (oFF.isNull(apolloItem))
	{
		return false;
	}
	var fileToDelete = apolloItem.getAssociatedFileObj();
	fileToDelete.deleteRecursive();
	if (fileToDelete.hasErrors())
	{
		return false;
	}
	if (fileToDelete.isExisting() === true)
	{
		return false;
	}
	this.removeItemFromActiveDirectory(apolloItem);
	return true;
};
oFF.FeApolloDirectoryManager.prototype.renameApolloItemFromActiveDirectory = function(apolloItem, newName)
{
	if (oFF.isNull(apolloItem))
	{
		return false;
	}
	var fileToRename = apolloItem.getAssociatedFileObj();
	if (fileToRename.isExisting() === false)
	{
		return false;
	}
	var newFile = fileToRename.rename(newName);
	var valid = newFile.isValid();
	if (valid)
	{
		this.removeItemFromActiveDirectory(apolloItem);
		this.addNewItemToActiveDirectory(newFile);
	}
	return valid;
};
oFF.FeApolloDirectoryManager.prototype.setActiveDirectory = function(directory)
{
	if (oFF.notNull(directory))
	{
		this.m_activeDirectory = directory;
		this.loadActiveDirectoryContent();
	}
};
oFF.FeApolloDirectoryManager.prototype.loadActiveDirectoryContent = function()
{
	var currentDir = this.m_activeDirectory;
	if (oFF.notNull(currentDir) && currentDir.isContentLoaded() === false)
	{
		var currentFile = currentDir.getAssociatedFileObj();
		var childrenIterator = currentFile.getChildren().getIterator();
		while (childrenIterator.hasNext())
		{
			var childFile = childrenIterator.next();
			if (childFile.isExisting())
			{
				if (childFile.isDirectory())
				{
					oFF.FeApolloDir.createNewDir(childFile, currentDir);
				}
				else
				{
					oFF.FeApolloFile.createNewFile(childFile, currentDir);
				}
			}
		}
		currentDir.setContentLoaded(true);
	}
};
oFF.FeApolloDirectoryManager.prototype.addNewItemToActiveDirectory = function(newChildFile)
{
	if (oFF.notNull(newChildFile))
	{
		if (newChildFile.isDirectory())
		{
			oFF.FeApolloDir.createNewDir(newChildFile, this.m_activeDirectory);
		}
		else
		{
			oFF.FeApolloFile.createNewFile(newChildFile, this.m_activeDirectory);
		}
	}
};
oFF.FeApolloDirectoryManager.prototype.removeItemFromActiveDirectory = function(apolloItem)
{
	if (oFF.notNull(apolloItem))
	{
		var currentDir = this.m_activeDirectory;
		currentDir.removeChildItem(apolloItem);
	}
};

oFF.FeApolloFileHandler = function() {};
oFF.FeApolloFileHandler.prototype = new oFF.XObjectExt();
oFF.FeApolloFileHandler.prototype._ff_c = "FeApolloFileHandler";

oFF.FeApolloFileHandler.createFileHandler = function(session)
{
	var fileHandler = new oFF.FeApolloFileHandler();
	if (oFF.isNull(session))
	{
		throw oFF.XException.createRuntimeException("Cannot create a Apollo File Handler instance without a session. Please sepcify a session!");
	}
	fileHandler.setupFileHandler(session);
	return fileHandler;
};
oFF.FeApolloFileHandler.prototype.m_session = null;
oFF.FeApolloFileHandler.prototype.releaseObject = function()
{
	this.m_session = null;
	oFF.XObjectExt.prototype.releaseObject.call( this );
};
oFF.FeApolloFileHandler.prototype.getLogSeverity = function()
{
	return oFF.Severity.PRINT;
};
oFF.FeApolloFileHandler.prototype.openFile = function(apolloFile)
{
	return this.handleFileWithApolloExtension(apolloFile, null);
};
oFF.FeApolloFileHandler.prototype.openFileWithApolloExtension = function(apolloFile, apolloExtension)
{
	return this.handleFileWithApolloExtension(apolloFile, apolloExtension);
};
oFF.FeApolloFileHandler.prototype.setupFileHandler = function(session)
{
	this.m_session = session;
};
oFF.FeApolloFileHandler.prototype.handleFileWithApolloExtension = function(apolloFile, apolloExtension)
{
	var prgManifest = null;
	var prgTitle = null;
	var prgArgs = null;
	var fileName = apolloFile.getName();
	var openFileExtension = apolloFile.getApolloFileExtension();
	if (oFF.notNull(apolloExtension))
	{
		openFileExtension = apolloExtension;
	}
	if (oFF.notNull(openFileExtension))
	{
		if (openFileExtension.isExecutable())
		{
			var programName = apolloFile.getFileNameWithoutExtension();
			if (oFF.ProgramRegistration.getAllEntries().containsKey(programName))
			{
				prgManifest = oFF.ProgramRegistration.getProgramManifest(programName);
				prgTitle = prgManifest.getInitialTitle();
			}
		}
		else
		{
			prgManifest = openFileExtension.getProgramManifest();
			prgTitle = fileName;
			prgArgs = openFileExtension.getDefaultArguments();
			prgArgs.getArgumentStructure().putString(oFF.DfProgram.PARAM_FILE, apolloFile.getAssociatedFileObj().getVfsUri().getUrl());
		}
	}
	if (oFF.notNull(prgManifest))
	{
		var parentProcess = this.m_session;
		if (oFF.notNull(parentProcess))
		{
			var startCfgBase = oFF.ProgramStartCfg.create(parentProcess, prgManifest.getName(), prgTitle, prgArgs);
			startCfgBase.setIsNewConsoleNeeded(true);
			startCfgBase.processExecution(oFF.SyncType.NON_BLOCKING, null, null);
			return true;
		}
	}
	return false;
};

oFF.FeApolloDirectoryNavigationHistory = function() {};
oFF.FeApolloDirectoryNavigationHistory.prototype = new oFF.XObjectExt();
oFF.FeApolloDirectoryNavigationHistory.prototype._ff_c = "FeApolloDirectoryNavigationHistory";

oFF.FeApolloDirectoryNavigationHistory.createDirectoryHistory = function()
{
	var newHist = new oFF.FeApolloDirectoryNavigationHistory();
	newHist.setup();
	newHist.setupInternal();
	return newHist;
};
oFF.FeApolloDirectoryNavigationHistory.prototype.m_directoryHistory = null;
oFF.FeApolloDirectoryNavigationHistory.prototype.m_curHistoryIndex = 0;
oFF.FeApolloDirectoryNavigationHistory.prototype.releaseObject = function()
{
	this.m_directoryHistory.clear();
	this.m_directoryHistory = oFF.XObjectExt.release(this.m_directoryHistory);
	oFF.XObjectExt.prototype.releaseObject.call( this );
};
oFF.FeApolloDirectoryNavigationHistory.prototype.addHistoryEntry = function(apolloDir)
{
	if (this.canGoToNext())
	{
		var newHistList = oFF.XListUtils.sublist(this.m_directoryHistory, oFF.XList.create(), 0, this.m_curHistoryIndex);
		this.m_directoryHistory.clear();
		this.m_directoryHistory.addAll(newHistList);
		newHistList.clear();
	}
	this.m_directoryHistory.add(apolloDir);
	this.m_curHistoryIndex = this.m_directoryHistory.size() - 1;
};
oFF.FeApolloDirectoryNavigationHistory.prototype.canGoToPrevious = function()
{
	if (this.m_directoryHistory.size() > 1 && this.m_curHistoryIndex > 0)
	{
		return true;
	}
	return false;
};
oFF.FeApolloDirectoryNavigationHistory.prototype.goToPrevious = function()
{
	if (this.canGoToPrevious())
	{
		this.m_curHistoryIndex--;
		return this.m_directoryHistory.get(this.m_curHistoryIndex);
	}
	return null;
};
oFF.FeApolloDirectoryNavigationHistory.prototype.canGoToNext = function()
{
	if (this.m_directoryHistory.size() > 1 && this.m_directoryHistory.size() - 1 > this.m_curHistoryIndex)
	{
		return true;
	}
	return false;
};
oFF.FeApolloDirectoryNavigationHistory.prototype.goToNext = function()
{
	if (this.canGoToNext())
	{
		this.m_curHistoryIndex++;
		return this.m_directoryHistory.get(this.m_curHistoryIndex);
	}
	return null;
};
oFF.FeApolloDirectoryNavigationHistory.prototype.clearHistory = function()
{
	this.m_directoryHistory.clear();
	this.m_curHistoryIndex = -1;
};
oFF.FeApolloDirectoryNavigationHistory.prototype.setupInternal = function()
{
	this.m_directoryHistory = oFF.XList.create();
	this.m_curHistoryIndex = -1;
};

oFF.FeApolloDir = function() {};
oFF.FeApolloDir.prototype = new oFF.FeApolloItemBase();
oFF.FeApolloDir.prototype._ff_c = "FeApolloDir";

oFF.FeApolloDir.createNewDir = function(file, parent)
{
	var newDir = new oFF.FeApolloDir();
	newDir.setupApolloItem(file, parent);
	return newDir;
};
oFF.FeApolloDir.prototype.m_children = null;
oFF.FeApolloDir.prototype.m_isContentLoad = false;
oFF.FeApolloDir.prototype.releaseObject = function()
{
	this.m_children.clear();
	this.m_children = oFF.XObjectExt.release(this.m_children);
	oFF.FeApolloItemBase.prototype.releaseObject.call( this );
};
oFF.FeApolloDir.prototype.setupApolloItem = function(file, parent)
{
	oFF.FeApolloItemBase.prototype.setupApolloItem.call( this , file, parent);
	this.m_children = oFF.XList.create();
	this.m_isContentLoad = false;
};
oFF.FeApolloDir.prototype.isDirectory = function()
{
	return true;
};
oFF.FeApolloDir.prototype.addChildItem = function(feItem)
{
	if (oFF.notNull(feItem))
	{
		this.m_children.add(feItem);
	}
};
oFF.FeApolloDir.prototype.removeChildItem = function(feItem)
{
	if (oFF.notNull(feItem))
	{
		this.m_children.removeElement(feItem);
	}
};
oFF.FeApolloDir.prototype.clearChildItems = function()
{
	this.m_children.clear();
};
oFF.FeApolloDir.prototype.getChildItems = function()
{
	return this.m_children;
};
oFF.FeApolloDir.prototype.isContentLoaded = function()
{
	return this.m_isContentLoad;
};
oFF.FeApolloDir.prototype.setContentLoaded = function(isContentLoaded)
{
	this.m_isContentLoad = isContentLoaded;
};

oFF.FeApolloFile = function() {};
oFF.FeApolloFile.prototype = new oFF.FeApolloItemBase();
oFF.FeApolloFile.prototype._ff_c = "FeApolloFile";

oFF.FeApolloFile.createNewFile = function(file, parent)
{
	var newFile = new oFF.FeApolloFile();
	newFile.setupApolloItem(file, parent);
	return newFile;
};
oFF.FeApolloFile.prototype.m_apolloFileExtension = null;
oFF.FeApolloFile.prototype.m_extensionStr = null;
oFF.FeApolloFile.prototype.m_nameWithoutExtensionStr = null;
oFF.FeApolloFile.prototype.setupApolloItem = function(file, parent)
{
	oFF.FeApolloItemBase.prototype.setupApolloItem.call( this , file, parent);
	this.extractFileExtensionAndName();
	this.m_apolloFileExtension = oFF.FeApolloFileExtension.getApolloExtensionForFile(file);
};
oFF.FeApolloFile.prototype.isDirectory = function()
{
	return false;
};
oFF.FeApolloFile.prototype.releaseObject = function()
{
	this.m_apolloFileExtension = null;
	oFF.FeApolloItemBase.prototype.releaseObject.call( this );
};
oFF.FeApolloFile.prototype.getExtension = function()
{
	return this.m_extensionStr;
};
oFF.FeApolloFile.prototype.getApolloFileExtension = function()
{
	return this.m_apolloFileExtension;
};
oFF.FeApolloFile.prototype.getFileNameWithoutExtension = function()
{
	return this.m_nameWithoutExtensionStr;
};
oFF.FeApolloFile.prototype.getResolvedFileIconPath = function(session)
{
	var prgName = null;
	var iconPath = null;
	if (this.getApolloFileExtension().isExecutable())
	{
		prgName = this.getFileNameWithoutExtension();
	}
	else
	{
		prgName = this.getApolloFileExtension().getProgramName();
	}
	var prgManifest = oFF.ProgramRegistration.getProgramManifest(prgName);
	if (oFF.notNull(prgManifest))
	{
		iconPath = prgManifest.getResolvedIconPath(session);
	}
	return iconPath;
};
oFF.FeApolloFile.prototype.extractFileExtensionAndName = function()
{
	var fileName = this.getName();
	var extPoint = oFF.XString.lastIndexOf(fileName, ".");
	if (extPoint !== -1)
	{
		this.m_nameWithoutExtensionStr = oFF.XString.substring(fileName, 0, extPoint);
		this.m_extensionStr = oFF.XString.substring(fileName, extPoint + 1, -1);
	}
	else
	{
		this.m_nameWithoutExtensionStr = fileName;
		this.m_extensionStr = null;
	}
};

oFF.UiCredentialsProvider = function() {};
oFF.UiCredentialsProvider.prototype = new oFF.DfCredentialsProvider();
oFF.UiCredentialsProvider.prototype._ff_c = "UiCredentialsProvider";

oFF.UiCredentialsProvider.prototype.m_runtimeUserManager = null;
oFF.UiCredentialsProvider.prototype.processGetCredentials = function(syncType, listener, customIdentifier, connection, credentialsCallCounter, response, messages, changedType)
{
	return oFF.UiCredentialsProviderSyncAction.createAndRun(this, syncType, listener, customIdentifier, connection, credentialsCallCounter, response, messages, changedType);
};
oFF.UiCredentialsProvider.prototype.notifyCredentialsSuccess = function(connection) {};
oFF.UiCredentialsProvider.prototype.supportsOnErrorHandling = function()
{
	return true;
};
oFF.UiCredentialsProvider.prototype.releaseObject = function()
{
	this.m_runtimeUserManager = null;
	oFF.DfCredentialsProvider.prototype.releaseObject.call( this );
};
oFF.UiCredentialsProvider.prototype.setRuntimeUserManager = function(runtimeUserManager)
{
	this.m_runtimeUserManager = runtimeUserManager;
	var tmpUserManager = this.m_runtimeUserManager;
	this.setSession(tmpUserManager.getSession());
};
oFF.UiCredentialsProvider.prototype.getRuntimeUserManager = function()
{
	return this.m_runtimeUserManager;
};

oFF.UiCredentialsProviderSyncAction = function() {};
oFF.UiCredentialsProviderSyncAction.prototype = new oFF.SyncAction();
oFF.UiCredentialsProviderSyncAction.prototype._ff_c = "UiCredentialsProviderSyncAction";

oFF.UiCredentialsProviderSyncAction.GLOBAL_CREDENTIALS = null;
oFF.UiCredentialsProviderSyncAction.USER_KEY = "user";
oFF.UiCredentialsProviderSyncAction.PASSWORD_KEY = "password";
oFF.UiCredentialsProviderSyncAction.createAndRun = function(context, syncType, listener, customIdentifier, connection, credentialsCallCounter, response, messages, changedType)
{
	var newCredentialsProviderSyncAction = new oFF.UiCredentialsProviderSyncAction();
	newCredentialsProviderSyncAction.m_connection = connection;
	newCredentialsProviderSyncAction.m_credentialsCallCounter = credentialsCallCounter;
	newCredentialsProviderSyncAction.m_rpcMessages = messages;
	newCredentialsProviderSyncAction.m_context = context;
	newCredentialsProviderSyncAction.m_response = response;
	newCredentialsProviderSyncAction.m_changedAuthType = changedType;
	newCredentialsProviderSyncAction.setupActionAndRun(syncType, listener, customIdentifier, context);
	return newCredentialsProviderSyncAction;
};
oFF.UiCredentialsProviderSyncAction.prototype.m_connection = null;
oFF.UiCredentialsProviderSyncAction.prototype.m_credentialsCallCounter = 0;
oFF.UiCredentialsProviderSyncAction.prototype.m_rpcMessages = null;
oFF.UiCredentialsProviderSyncAction.prototype.m_context = null;
oFF.UiCredentialsProviderSyncAction.prototype.m_response = null;
oFF.UiCredentialsProviderSyncAction.prototype.m_changedAuthType = null;
oFF.UiCredentialsProviderSyncAction.prototype.processSynchronization = function(syncType)
{
	if (oFF.isNull(oFF.UiCredentialsProviderSyncAction.GLOBAL_CREDENTIALS))
	{
		oFF.UiCredentialsProviderSyncAction.GLOBAL_CREDENTIALS = oFF.XHashMapByString.create();
	}
	if (this.hasError())
	{
		this.handleError();
	}
	else
	{
		this.handleLogin();
	}
	return true;
};
oFF.UiCredentialsProviderSyncAction.prototype.callListener = function(extResult, listener, data, customIdentifier)
{
	listener.onCredentialsReady(extResult, data, customIdentifier);
};
oFF.UiCredentialsProviderSyncAction.prototype.hasError = function()
{
	if (this.m_connection.getSystemDescription().getHost() === null)
	{
		return true;
	}
	if (oFF.notNull(this.m_response))
	{
		return true;
	}
	if (oFF.notNull(this.m_rpcMessages))
	{
		return true;
	}
	if (this.m_credentialsCallCounter > 5)
	{
		return true;
	}
	return false;
};
oFF.UiCredentialsProviderSyncAction.prototype.handleLogin = function()
{
	var systemName = this.m_connection.getSystemDescription().getSystemName();
	var newPersonalization = this.m_context.getRuntimeUserManager().newMergedPersonalization(systemName);
	if (oFF.notNull(this.m_changedAuthType))
	{
		newPersonalization.setAuthenticationType(this.m_changedAuthType);
	}
	oFF.XObjectExt.assertNotNull(newPersonalization);
	if (newPersonalization.getAuthenticationType() !== oFF.AuthenticationType.NONE)
	{
		var curUser = newPersonalization.getUser();
		var curPass = newPersonalization.getPassword();
		var systemId = this.getSystemId();
		var savedCredentials = oFF.UiCredentialsProviderSyncAction.GLOBAL_CREDENTIALS.getByKey(systemId);
		if (oFF.notNull(savedCredentials))
		{
			newPersonalization.setUser(savedCredentials.getByKey(oFF.UiCredentialsProviderSyncAction.USER_KEY));
			newPersonalization.setPassword(savedCredentials.getByKey(oFF.UiCredentialsProviderSyncAction.PASSWORD_KEY));
			this.setData(newPersonalization);
			this.endSync();
		}
		else if (oFF.XStringUtils.isNotNullAndNotEmpty(curUser) && oFF.XStringUtils.isNotNullAndNotEmpty(curPass))
		{
			this.setData(newPersonalization);
			this.endSync();
		}
		else
		{
			this.showLoginDialogWithMessage("Enter credentials");
		}
	}
	else
	{
		this.setData(newPersonalization);
		this.endSync();
	}
};
oFF.UiCredentialsProviderSyncAction.prototype.handleError = function()
{
	var title = "Error";
	if (oFF.XStringUtils.isNullOrEmpty(this.m_connection.getSystemDescription().getHost()))
	{
		oFF.UiCredentialsDialog.showAlertWithTitleAndMessage(this.m_context, title, "Wrong host or host is missing.");
		this.addError(0, "Wrong host or host is missing.");
		this.endSync();
		return;
	}
	var errorMessage = oFF.XStringUtils.concatenate2(this.m_connection.getSystemDescription().getHost(), " - ");
	if (oFF.notNull(this.m_response))
	{
		var statusCode = this.m_response.getStatusCode();
		var statusCodeDetails = this.m_response.getStatusCodeDetails();
		if (statusCode === 303 || statusCode === 401)
		{
			this.showLoginDialogWithMessage("Wrong username or password");
		}
		else
		{
			if (statusCode === 503)
			{
				errorMessage = oFF.XStringUtils.concatenate2(errorMessage, "The service is currently unavailable.");
			}
			else if (statusCode === 0)
			{
				errorMessage = oFF.XStringUtils.concatenate2(errorMessage, "The request timed out.");
			}
			else if (oFF.XStringUtils.isNotNullAndNotEmpty(statusCodeDetails))
			{
				errorMessage = oFF.XStringUtils.concatenate2(errorMessage, statusCodeDetails);
			}
			else
			{
				errorMessage = oFF.XStringUtils.concatenate2(errorMessage, "Unknown error occured. Please try again!");
			}
			oFF.UiCredentialsDialog.showAlertWithTitleAndMessage(this.m_context, title, errorMessage);
			this.addError(statusCode, errorMessage);
			this.endSync();
		}
	}
	else if (oFF.notNull(this.m_rpcMessages))
	{
		var firstErrorText = this.m_rpcMessages.getFirstError().getText();
		errorMessage = oFF.XStringUtils.concatenate2(errorMessage, firstErrorText);
		oFF.UiCredentialsDialog.showAlertWithTitleAndMessage(this.m_context, title, errorMessage);
		this.addError(0, errorMessage);
		this.endSync();
	}
	else
	{
		errorMessage = oFF.XStringUtils.concatenate2(errorMessage, "Unknown error occured. Please try again!");
		oFF.UiCredentialsDialog.showAlertWithTitleAndMessage(this.m_context, title, errorMessage);
		this.addError(0, errorMessage);
		this.endSync();
	}
};
oFF.UiCredentialsProviderSyncAction.prototype.getSystemId = function()
{
	var prefix = this.m_connection.getSystemDescription().getPrefix();
	if (oFF.isNull(prefix))
	{
		prefix = "";
	}
	return oFF.XStringUtils.concatenate4(this.m_connection.getSystemDescription().getName(), ":", this.m_connection.getSystemDescription().getHost(), prefix);
};
oFF.UiCredentialsProviderSyncAction.prototype.tryToLogin = function(newUsername, newPassword)
{
	var systemName = this.m_connection.getSystemDescription().getSystemName();
	var newPersonalization = this.m_context.getRuntimeUserManager().newMergedPersonalization(systemName);
	if (oFF.notNull(newPersonalization))
	{
		newPersonalization.setUser(newUsername);
		newPersonalization.setPassword(newPassword);
		var systemId = this.getSystemId();
		var newCreds = oFF.XHashMapOfStringByString.create();
		newCreds.put(oFF.UiCredentialsProviderSyncAction.USER_KEY, newUsername);
		newCreds.put(oFF.UiCredentialsProviderSyncAction.PASSWORD_KEY, newPassword);
		oFF.UiCredentialsProviderSyncAction.GLOBAL_CREDENTIALS.put(systemId, newCreds);
		this.setData(newPersonalization);
		this.endSync();
		oFF.UiCredentialsDialog.showToastWithMessage(this.m_context, "Logging in...");
	}
	else
	{
		oFF.UiCredentialsDialog.showToastWithMessage(this.m_context, "Error occured while logging in!");
	}
};
oFF.UiCredentialsProviderSyncAction.prototype.showLoginDialogWithMessage = function(message)
{
	var systemId = this.getSystemId();
	var username = "";
	var password = "";
	var savedCredentials = oFF.UiCredentialsProviderSyncAction.GLOBAL_CREDENTIALS.getByKey(systemId);
	if (oFF.notNull(savedCredentials))
	{
		username = savedCredentials.getByKey(oFF.UiCredentialsProviderSyncAction.USER_KEY);
		password = savedCredentials.getByKey(oFF.UiCredentialsProviderSyncAction.PASSWORD_KEY);
	}
	oFF.UiCredentialsDialog.showCredentialsDialog(this.m_context, this.m_connection.getSystemDescription().getSystemName(), message, username, password, this);
};
oFF.UiCredentialsProviderSyncAction.prototype.onLogin = function(username, password)
{
	this.tryToLogin(username, password);
};
oFF.UiCredentialsProviderSyncAction.prototype.onCancel = function()
{
	this.addError(0, "User canceled login!");
	this.endSync();
};

oFF.SuCalendarDialog = function() {};
oFF.SuCalendarDialog.prototype = new oFF.DfUiProgram();
oFF.SuCalendarDialog.prototype._ff_c = "SuCalendarDialog";

oFF.SuCalendarDialog.DEFAULT_PROGRAM_NAME = "CalendarDialog";
oFF.SuCalendarDialog.createRunner = function()
{
	var runner = oFF.KernelBoot.createByName(oFF.SuCalendarDialog.DEFAULT_PROGRAM_NAME);
	return runner;
};
oFF.SuCalendarDialog.createNewCalendarDialogProgram = function()
{
	var prg = new oFF.SuCalendarDialog();
	prg.setup();
	return prg;
};
oFF.SuCalendarDialog.prototype.m_uiModel = null;
oFF.SuCalendarDialog.prototype.m_monthView = null;
oFF.SuCalendarDialog.prototype.newProgram = function()
{
	var prg = new oFF.SuCalendarDialog();
	prg.setup();
	return prg;
};
oFF.SuCalendarDialog.prototype.doSetupProgramMetadata = function(metadata)
{
	oFF.DfUiProgram.prototype.doSetupProgramMetadata.call( this , metadata);
};
oFF.SuCalendarDialog.prototype.evalArguments = function()
{
	oFF.DfUiProgram.prototype.evalArguments.call( this );
};
oFF.SuCalendarDialog.prototype.initializeProgram = function()
{
	oFF.DfUiProgram.prototype.initializeProgram.call( this );
	this.setupInternal();
};
oFF.SuCalendarDialog.prototype.releaseObject = function()
{
	oFF.DfUiProgram.prototype.releaseObject.call( this );
};
oFF.SuCalendarDialog.prototype.getLogSeverity = function()
{
	return oFF.DfUiProgram.prototype.getLogSeverity.call( this );
};
oFF.SuCalendarDialog.prototype.getDefaultProgramDevice = function()
{
	return oFF.ProgramDevice.DIALOG;
};
oFF.SuCalendarDialog.prototype.getMenuBarDisplayName = function()
{
	return oFF.SuCalendarDialog.DEFAULT_PROGRAM_NAME;
};
oFF.SuCalendarDialog.prototype.isShowMenuBar = function()
{
	return false;
};
oFF.SuCalendarDialog.prototype.getDialogButtons = function(genesis)
{
	return null;
};
oFF.SuCalendarDialog.prototype.getDefaultContainerSize = function()
{
	return oFF.UiSize.createByCss("330px", "220px");
};
oFF.SuCalendarDialog.prototype.setupInternal = function()
{
	this.setTitle("Calendar");
};
oFF.SuCalendarDialog.prototype.buildUi = function(genesis)
{
	oFF.DfUiProgram.prototype.buildUi.call( this , genesis);
	this.m_uiModel = oFF.MonthUiModel.create();
	this.createCalendarView();
	genesis.setRoot(this.m_monthView.getRoot());
};
oFF.SuCalendarDialog.prototype.replaceCalendarDialogContent = function(view)
{
	this.getGenesis().setRoot(view.getRoot());
};
oFF.SuCalendarDialog.prototype.addOneMonth = function()
{
	this.m_uiModel.addOneMonth();
	this.m_monthView.refreshContent();
};
oFF.SuCalendarDialog.prototype.subtractOneMonth = function()
{
	this.m_uiModel.subtractOneMonth();
	this.m_monthView.refreshContent();
};
oFF.SuCalendarDialog.prototype.getYear = function()
{
	return this.m_uiModel.getYear();
};
oFF.SuCalendarDialog.prototype.selectMonth = function(year, month)
{
	this.m_uiModel = oFF.XObjectExt.release(this.m_uiModel);
	this.m_uiModel = oFF.MonthUiModel.createWithYearAndMonth(year, month);
	this.createCalendarView();
	this.getGenesis().setRoot(this.m_monthView.getRoot());
};
oFF.SuCalendarDialog.prototype.selectYear = function(year)
{
	var month = this.m_uiModel.getMonth();
	this.m_uiModel = oFF.XObjectExt.release(this.m_uiModel);
	this.m_uiModel = oFF.MonthUiModel.createWithYearAndMonth(year, month);
	this.createCalendarView();
	this.getGenesis().setRoot(this.m_monthView.getRoot());
};
oFF.SuCalendarDialog.prototype.createCalendarView = function()
{
	this.m_monthView = oFF.FlexMonthView.create(this.getGenesis(), this.m_uiModel, true);
	var addMonthListener = oFF.AddMonthListener.create(this);
	var subtractMonthListener = oFF.SubtractMonthListener.create(this);
	var openMonthSelectionListener = oFF.OpenMonthSelectionViewListener.create(this.getGenesis(), this);
	var openYearSelectionListener = oFF.OpenYearSelectionViewListener.create(this.getGenesis(), this, oFF.YearSelectionUiModel.create(this.getYear()));
	this.m_monthView.registerAddMonthListener(addMonthListener);
	this.m_monthView.registerSubtractMonthListener(subtractMonthListener);
	this.m_monthView.registerOpenMonthSelectionListener(openMonthSelectionListener);
	this.m_monthView.registerOpenYearSelectionListener(openYearSelectionListener);
};

oFF.SuConnectionTestDialog = function() {};
oFF.SuConnectionTestDialog.prototype = new oFF.DfUiProgram();
oFF.SuConnectionTestDialog.prototype._ff_c = "SuConnectionTestDialog";

oFF.SuConnectionTestDialog.DEFAULT_PROGRAM_NAME = "ConnectionTestDialog";
oFF.SuConnectionTestDialog.GREY_COLOR = "#7f8c8d";
oFF.SuConnectionTestDialog.GREEN_COLOR = "#27ae60";
oFF.SuConnectionTestDialog.RED_COLOR = "#c0392b";
oFF.SuConnectionTestDialog.ORANGE_COLOR = "#d35400";
oFF.SuConnectionTestDialog.PARAM_SYSTEM = "system";
oFF.SuConnectionTestDialog.createRunner = function()
{
	var runner = oFF.KernelBoot.createByName(oFF.SuConnectionTestDialog.DEFAULT_PROGRAM_NAME);
	return runner;
};
oFF.SuConnectionTestDialog.createNewTestDialogProgram = function()
{
	var prg = new oFF.SuConnectionTestDialog();
	prg.setup();
	return prg;
};
oFF.SuConnectionTestDialog.prototype.m_testButton = null;
oFF.SuConnectionTestDialog.prototype.m_resultLayout = null;
oFF.SuConnectionTestDialog.prototype.m_statusLbl = null;
oFF.SuConnectionTestDialog.prototype.m_systemInfoText = null;
oFF.SuConnectionTestDialog.prototype.m_serverResponseText = null;
oFF.SuConnectionTestDialog.prototype.m_serverMetadataText = null;
oFF.SuConnectionTestDialog.prototype.m_systemName = null;
oFF.SuConnectionTestDialog.prototype.newProgram = function()
{
	var prg = new oFF.SuConnectionTestDialog();
	prg.setup();
	return prg;
};
oFF.SuConnectionTestDialog.prototype.doSetupProgramMetadata = function(metadata)
{
	oFF.DfUiProgram.prototype.doSetupProgramMetadata.call( this , metadata);
	metadata.addParameter(oFF.SuConnectionTestDialog.PARAM_SYSTEM, "The system name which should be tested.");
};
oFF.SuConnectionTestDialog.prototype.evalArguments = function()
{
	oFF.DfUiProgram.prototype.evalArguments.call( this );
	var argStruct = this.getArgumentStructure();
	this.m_systemName = argStruct.getStringByKeyExt(oFF.SuConnectionTestDialog.PARAM_SYSTEM, null);
};
oFF.SuConnectionTestDialog.prototype.initializeProgram = function()
{
	oFF.DfUiProgram.prototype.initializeProgram.call( this );
	this.setupInternal();
};
oFF.SuConnectionTestDialog.prototype.releaseObject = function()
{
	this.m_statusLbl = oFF.XObjectExt.release(this.m_statusLbl);
	this.m_systemInfoText = oFF.XObjectExt.release(this.m_systemInfoText);
	this.m_serverResponseText = oFF.XObjectExt.release(this.m_serverResponseText);
	this.m_serverMetadataText = oFF.XObjectExt.release(this.m_serverMetadataText);
	this.m_resultLayout = oFF.XObjectExt.release(this.m_resultLayout);
	this.m_testButton = oFF.XObjectExt.release(this.m_testButton);
	oFF.DfUiProgram.prototype.releaseObject.call( this );
};
oFF.SuConnectionTestDialog.prototype.getLogSeverity = function()
{
	return oFF.Severity.PRINT;
};
oFF.SuConnectionTestDialog.prototype.getDefaultProgramDevice = function()
{
	return oFF.ProgramDevice.DIALOG;
};
oFF.SuConnectionTestDialog.prototype.getMenuBarDisplayName = function()
{
	return oFF.SuConnectionTestDialog.DEFAULT_PROGRAM_NAME;
};
oFF.SuConnectionTestDialog.prototype.isShowMenuBar = function()
{
	return false;
};
oFF.SuConnectionTestDialog.prototype.getDialogButtons = function(genesis)
{
	this.m_testButton = genesis.newControl(oFF.UiType.DIALOG_BUTTON);
	this.m_testButton.setName("suConnectionTestDialogTestBtn");
	this.m_testButton.setText("Test");
	this.m_testButton.setButtonType(oFF.UiButtonType.PRIMARY);
	this.m_testButton.setEnabled(false);
	this.m_testButton.registerOnPress(this);
	var closeBtn = genesis.newControl(oFF.UiType.DIALOG_BUTTON);
	closeBtn.setName("suConnectionTestDialogCloseBtn");
	closeBtn.setText("Close");
	closeBtn.registerOnPress(this);
	var tmpList = oFF.XList.create();
	tmpList.add(this.m_testButton);
	tmpList.add(closeBtn);
	return tmpList;
};
oFF.SuConnectionTestDialog.prototype.getDefaultContainerSize = function()
{
	return oFF.UiSize.createByCss("600px", "750px");
};
oFF.SuConnectionTestDialog.prototype.setupInternal = function()
{
	if (oFF.XStringUtils.isNotNullAndNotEmpty(this.m_systemName))
	{
		this.setTitle(oFF.XStringUtils.concatenate2("Connection test - ", this.m_systemName));
	}
	else
	{
		this.setTitle("Missing system!");
	}
	this.registerOnProgramContainerClose(this);
	this.registerOnProgramContainerOpen(this);
};
oFF.SuConnectionTestDialog.prototype.buildUi = function(genesis)
{
	oFF.DfUiProgram.prototype.buildUi.call( this , genesis);
	var mainLayout = genesis.newControl(oFF.UiType.FLEX_LAYOUT);
	mainLayout.setPadding(oFF.UiCssBoxEdges.create("20px"));
	mainLayout.setDirection(oFF.UiFlexDirection.COLUMN);
	this.m_statusLbl = mainLayout.addNewItemOfType(oFF.UiType.LABEL);
	this.m_statusLbl.setName("suConnectionTestStatusLbl");
	this.m_statusLbl.setWidth(oFF.UiCssLength.create("auto"));
	this.m_statusLbl.setFontSize(oFF.UiCssLength.create("16px"));
	this.m_statusLbl.setPadding(oFF.UiCssBoxEdges.create("10px"));
	this.m_statusLbl.setFontColor(oFF.UiColor.WHITE);
	this.m_statusLbl.setWrapping(true);
	this.m_statusLbl.setCornerRadius(oFF.UiCssBoxEdges.create("5px"));
	this.m_statusLbl.setTextAlign(oFF.UiTextAlign.CENTER);
	this.m_resultLayout = mainLayout.addNewItemOfType(oFF.UiType.FLEX_LAYOUT);
	this.m_resultLayout.setDirection(oFF.UiFlexDirection.COLUMN);
	var statusSystemInfoSpacer = this.m_resultLayout.addNewItemOfType(oFF.UiType.SPACER);
	statusSystemInfoSpacer.setHeight(oFF.UiCssLength.create("10px"));
	var systemInfoLbl = this.m_resultLayout.addNewItemOfType(oFF.UiType.LABEL);
	systemInfoLbl.setText("System info:");
	this.m_systemInfoText = this.m_resultLayout.addNewItemOfType(oFF.UiType.TEXT);
	this.m_systemInfoText.setName("suConnectionTestSystemInfoText");
	this.m_systemInfoText.setWidth(oFF.UiCssLength.create("auto"));
	this.m_systemInfoText.setHeight(oFF.UiCssLength.create("85px"));
	var systemInfoResponseSpacer = this.m_resultLayout.addNewItemOfType(oFF.UiType.SPACER);
	systemInfoResponseSpacer.setHeight(oFF.UiCssLength.create("10px"));
	var serverResponseLbl = this.m_resultLayout.addNewItemOfType(oFF.UiType.LABEL);
	serverResponseLbl.setText("Server response:");
	this.m_serverResponseText = this.m_resultLayout.addNewItemOfType(oFF.UiType.TEXT);
	this.m_serverResponseText.setName("suConnectionTestServerResponseText");
	this.m_serverResponseText.setWidth(oFF.UiCssLength.create("auto"));
	this.m_serverResponseText.setHeight(oFF.UiCssLength.create("220px"));
	var responseMetadataSpacer = this.m_resultLayout.addNewItemOfType(oFF.UiType.SPACER);
	responseMetadataSpacer.setHeight(oFF.UiCssLength.create("10px"));
	var serverMetadataLbl = this.m_resultLayout.addNewItemOfType(oFF.UiType.LABEL);
	serverMetadataLbl.setText("Server metadata:");
	this.m_serverMetadataText = this.m_resultLayout.addNewItemOfType(oFF.UiType.TEXT);
	this.m_serverMetadataText.setName("suConnectionTestServerMetadataText");
	this.m_serverMetadataText.setWidth(oFF.UiCssLength.create("auto"));
	this.m_serverMetadataText.setHeight(oFF.UiCssLength.create("260px"));
	if (oFF.XStringUtils.isNotNullAndNotEmpty(this.m_systemName))
	{
		this.prepareTest();
	}
	else
	{
		this.setStatusLabelWarning("Missing system. Please specify a system!");
	}
	genesis.setRoot(mainLayout);
};
oFF.SuConnectionTestDialog.prototype.startTest = function()
{
	if (oFF.XStringUtils.isNotNullAndNotEmpty(this.m_systemName))
	{
		var doesSystemExist = this.getApplication().getSystemLandscape().existsSystemName(this.m_systemName);
		if (doesSystemExist)
		{
			var connectionPool = this.getApplication().getConnectionPool();
			var connContainer = connectionPool.getConnection(this.m_systemName);
			this.generateSystemInfo(connContainer.getSystemDescription());
			if (oFF.XStringUtils.isNullOrEmpty(connContainer.getSystemDescription().getSystemType().getServerInfoPath()))
			{
				this.setStatusLabelWarning("Invalid system! Please try again!");
				this.testFinished();
			}
			else
			{
				connContainer.getServerMetadataExt(oFF.SyncType.NON_BLOCKING, this, null, true);
			}
		}
		else
		{
			this.setStatusLabelWarning("Could not find a system with the specified name!");
			this.testFinished();
		}
	}
	else
	{
		this.setStatusLabelWarning("Missing system name! Cannot test!");
		this.testFinished();
	}
};
oFF.SuConnectionTestDialog.prototype.setStatusLabel = function(text, bgColor)
{
	this.m_statusLbl.setBackgroundColor(bgColor);
	this.m_statusLbl.setText(text);
	this.m_systemInfoText.setBackgroundColor(bgColor.newColorWithAlpha(0.2));
};
oFF.SuConnectionTestDialog.prototype.setStatusLabelInfo = function(text)
{
	this.setStatusLabel(text, oFF.UiColor.create(oFF.SuConnectionTestDialog.GREY_COLOR));
};
oFF.SuConnectionTestDialog.prototype.setStatusLabelSuccess = function(text)
{
	this.setStatusLabel(text, oFF.UiColor.create(oFF.SuConnectionTestDialog.GREEN_COLOR));
};
oFF.SuConnectionTestDialog.prototype.setStatusLabelError = function(text)
{
	this.setStatusLabel(text, oFF.UiColor.create(oFF.SuConnectionTestDialog.RED_COLOR));
};
oFF.SuConnectionTestDialog.prototype.setStatusLabelWarning = function(text)
{
	this.setStatusLabel(text, oFF.UiColor.create(oFF.SuConnectionTestDialog.ORANGE_COLOR));
};
oFF.SuConnectionTestDialog.prototype.generateSystemInfo = function(systemDesc)
{
	if (oFF.notNull(systemDesc))
	{
		var systemInfoStrBuffer = oFF.XStringBuffer.create();
		systemInfoStrBuffer.append("[Url]: ");
		systemInfoStrBuffer.appendLine(systemDesc.getUrlStringWithoutAuthentication());
		systemInfoStrBuffer.append("[Server info path]: ");
		systemInfoStrBuffer.appendLine(systemDesc.getSystemType().getServerInfoPath());
		systemInfoStrBuffer.append("[System type]: ");
		systemInfoStrBuffer.appendLine(systemDesc.getSystemType().getName());
		systemInfoStrBuffer.append("[User]: ");
		systemInfoStrBuffer.append(systemDesc.getUser());
		this.m_systemInfoText.setText(systemInfoStrBuffer.toString());
	}
	else
	{
		this.m_systemInfoText.setText("No system description found!");
	}
};
oFF.SuConnectionTestDialog.prototype.generateServerResponse = function(extResult)
{
	if (oFF.notNull(extResult))
	{
		var responseStrBuffer = oFF.XStringBuffer.create();
		if (extResult.getClientStatusCode() !== 0)
		{
			responseStrBuffer.append("[Status code]: ");
			responseStrBuffer.appendLine(oFF.XInteger.convertToString(extResult.getClientStatusCode()));
		}
		if (oFF.XStringUtils.isNotNullAndNotEmpty(extResult.getServerStatusDetails()))
		{
			responseStrBuffer.append("[Status]: ");
			responseStrBuffer.appendLine(extResult.getServerStatusDetails());
		}
		if (extResult.hasErrors())
		{
			responseStrBuffer.append(extResult.getSummary());
		}
		else if (extResult.getData() !== null)
		{
			responseStrBuffer.append("[Raw]: ");
			responseStrBuffer.append(extResult.getData().toString());
		}
		this.m_serverResponseText.setText(responseStrBuffer.toString());
	}
	else
	{
		this.m_serverResponseText.setText("Something went terribly wrong...");
	}
};
oFF.SuConnectionTestDialog.prototype.generateServerMetadata = function(serverMetadata)
{
	if (oFF.notNull(serverMetadata))
	{
		var metadataStrBuffer = oFF.XStringBuffer.create();
		if (oFF.XStringUtils.isNotNullAndNotEmpty(serverMetadata.getBuildTime()))
		{
			metadataStrBuffer.append("[Build time]: ");
			metadataStrBuffer.appendLine(serverMetadata.getBuildTime());
		}
		if (oFF.XStringUtils.isNotNullAndNotEmpty(serverMetadata.getClient()))
		{
			metadataStrBuffer.append("[Client]: ");
			metadataStrBuffer.appendLine(serverMetadata.getClient());
		}
		if (oFF.XStringUtils.isNotNullAndNotEmpty(serverMetadata.getId()))
		{
			metadataStrBuffer.append("[Id]: ");
			metadataStrBuffer.appendLine(serverMetadata.getId());
		}
		if (oFF.XStringUtils.isNotNullAndNotEmpty(serverMetadata.getOrcaPublicUrl()))
		{
			metadataStrBuffer.append("[Orca publication url]: ");
			metadataStrBuffer.appendLine(serverMetadata.getOrcaPublicUrl());
		}
		if (oFF.XStringUtils.isNotNullAndNotEmpty(serverMetadata.getOrcaUserName()))
		{
			metadataStrBuffer.append("[Orca username]: ");
			metadataStrBuffer.appendLine(serverMetadata.getOrcaUserName());
		}
		if (oFF.XStringUtils.isNotNullAndNotEmpty(serverMetadata.getTenantId()))
		{
			metadataStrBuffer.append("[Tenant id]: ");
			metadataStrBuffer.appendLine(serverMetadata.getTenantId());
		}
		if (oFF.XStringUtils.isNotNullAndNotEmpty(serverMetadata.getType()))
		{
			metadataStrBuffer.append("[Type]: ");
			metadataStrBuffer.appendLine(serverMetadata.getType());
		}
		if (oFF.XStringUtils.isNotNullAndNotEmpty(serverMetadata.getUserLanguage()))
		{
			metadataStrBuffer.append("[User language]: ");
			metadataStrBuffer.appendLine(serverMetadata.getUserLanguage());
		}
		if (oFF.XStringUtils.isNotNullAndNotEmpty(serverMetadata.getVersion()))
		{
			metadataStrBuffer.append("[Version]: ");
			metadataStrBuffer.appendLine(serverMetadata.getVersion());
		}
		metadataStrBuffer.append("[Services]: ");
		metadataStrBuffer.appendLine(serverMetadata.getServices().toString());
		if (oFF.XStringUtils.isNotNullAndNotEmpty(serverMetadata.getReentranceTicket()))
		{
			metadataStrBuffer.append("[Reentrance ticket]: ");
			metadataStrBuffer.appendLine(serverMetadata.getReentranceTicket());
		}
		this.m_serverMetadataText.setText(metadataStrBuffer.toString());
	}
	else
	{
		this.m_serverResponseText.setText("Missing server metadata!");
	}
};
oFF.SuConnectionTestDialog.prototype.prepareTest = function()
{
	this.m_systemInfoText.setBackgroundColor(null);
	this.m_serverResponseText.setText("");
	this.m_serverMetadataText.setText("");
	this.m_resultLayout.setBusy(true);
	this.m_testButton.setEnabled(false);
	this.setStatusLabelInfo(oFF.XStringUtils.concatenate3("Connecting to ", this.m_systemName, "..."));
};
oFF.SuConnectionTestDialog.prototype.testFinished = function()
{
	this.m_resultLayout.setBusy(false);
	this.m_testButton.setEnabled(true);
};
oFF.SuConnectionTestDialog.prototype.testSuccess = function(serverMetadata)
{
	this.setStatusLabelSuccess("Connection success!");
	this.generateServerMetadata(serverMetadata);
};
oFF.SuConnectionTestDialog.prototype.testFailed = function()
{
	this.setStatusLabelError("Connection failed!");
	this.m_serverMetadataText.setText("Could not retrieve server metadata...");
};
oFF.SuConnectionTestDialog.prototype.onPress = function(event)
{
	oFF.DfUiProgram.prototype.onPress.call( this , event);
	switch (event.getControl().getName())
	{
		case "suConnectionTestDialogTestBtn":
			this.prepareTest();
			this.startTest();
			break;

		case "suConnectionTestDialogCloseBtn":
			this.exitNow(0);
			break;

		default:
	}
};
oFF.SuConnectionTestDialog.prototype.onProgramContainerOpen = function(prgContainer)
{
	if (oFF.XStringUtils.isNotNullAndNotEmpty(this.m_systemName))
	{
		this.prepareTest();
		this.startTest();
	}
};
oFF.SuConnectionTestDialog.prototype.onProgramContainerClose = function(prgContainer)
{
	this.testFinished();
};
oFF.SuConnectionTestDialog.prototype.onServerMetadataLoaded = function(extResult, serverMetadata, customIdentifier)
{
	if (extResult.isValid() && oFF.notNull(serverMetadata))
	{
		this.testSuccess(serverMetadata);
	}
	else
	{
		this.testFailed();
	}
	this.generateServerResponse(extResult);
	this.testFinished();
};

oFF.DialogTestProgram = function() {};
oFF.DialogTestProgram.prototype = new oFF.DfUiProgram();
oFF.DialogTestProgram.prototype._ff_c = "DialogTestProgram";

oFF.DialogTestProgram.DEFAULT_PROGRAM_NAME = "DialogTestProgram";
oFF.DialogTestProgram.createRunner = function()
{
	var runner = oFF.KernelBoot.createByName(oFF.DialogTestProgram.DEFAULT_PROGRAM_NAME);
	return runner;
};
oFF.DialogTestProgram.createNewTestDialogProgram = function()
{
	var prg = new oFF.DialogTestProgram();
	prg.setup();
	return prg;
};
oFF.DialogTestProgram.prototype.newProgram = function()
{
	var prg = new oFF.DialogTestProgram();
	prg.setup();
	return prg;
};
oFF.DialogTestProgram.prototype.doSetupProgramMetadata = function(metadata)
{
	oFF.DfUiProgram.prototype.doSetupProgramMetadata.call( this , metadata);
};
oFF.DialogTestProgram.prototype.evalArguments = function()
{
	oFF.DfUiProgram.prototype.evalArguments.call( this );
};
oFF.DialogTestProgram.prototype.initializeProgram = function()
{
	oFF.DfUiProgram.prototype.initializeProgram.call( this );
	this.setupInternal();
};
oFF.DialogTestProgram.prototype.releaseObject = function()
{
	oFF.DfUiProgram.prototype.releaseObject.call( this );
};
oFF.DialogTestProgram.prototype.getLogSeverity = function()
{
	return oFF.Severity.PRINT;
};
oFF.DialogTestProgram.prototype.getDefaultProgramDevice = function()
{
	return oFF.ProgramDevice.DIALOG;
};
oFF.DialogTestProgram.prototype.getMenuBarDisplayName = function()
{
	return oFF.DialogTestProgram.DEFAULT_PROGRAM_NAME;
};
oFF.DialogTestProgram.prototype.isShowMenuBar = function()
{
	return true;
};
oFF.DialogTestProgram.prototype.getDialogButtons = function(genesis)
{
	var okBtn = genesis.newControl(oFF.UiType.DIALOG_BUTTON);
	okBtn.setText("Ok");
	okBtn.setButtonType(oFF.UiButtonType.PRIMARY);
	okBtn.registerOnPress(this);
	var cancelBtn = genesis.newControl(oFF.UiType.DIALOG_BUTTON);
	cancelBtn.setText("Cancel");
	cancelBtn.registerOnPress(this);
	var tmpList = oFF.XList.create();
	tmpList.add(okBtn);
	tmpList.add(cancelBtn);
	return tmpList;
};
oFF.DialogTestProgram.prototype.setupInternal = function()
{
	this.log("hello world from a dialog program!");
};
oFF.DialogTestProgram.prototype.buildUi = function(genesis)
{
	oFF.DfUiProgram.prototype.buildUi.call( this , genesis);
	var tmpLabel = genesis.newRoot(oFF.UiType.LABEL);
	tmpLabel.setText("This is a dialog test program! It should open in a modal dialog window!");
	tmpLabel.setWidth(oFF.UiCssLength.create("100%"));
	tmpLabel.setHeight(oFF.UiCssLength.create("50px"));
	tmpLabel.setPadding(oFF.UiCssBoxEdges.create("10px"));
	tmpLabel.setBackgroundColor(oFF.UiColor.LAVENDER.newColorWithAlpha(0.3));
	tmpLabel.setTextAlign(oFF.UiTextAlign.CENTER);
};
oFF.DialogTestProgram.prototype.onPress = function(event)
{
	oFF.DfUiProgram.prototype.onPress.call( this , event);
	this.exitNow(0);
};

oFF.SuJavadocDialog = function() {};
oFF.SuJavadocDialog.prototype = new oFF.DfUiProgram();
oFF.SuJavadocDialog.prototype._ff_c = "SuJavadocDialog";

oFF.SuJavadocDialog.JAVA_DOC_URL = "";
oFF.SuJavadocDialog.DEFAULT_PROGRAM_NAME = "JavadocDialog";
oFF.SuJavadocDialog.createRunner = function()
{
	var runner = oFF.KernelBoot.createByName(oFF.SuJavadocDialog.DEFAULT_PROGRAM_NAME);
	return runner;
};
oFF.SuJavadocDialog.createNewJavadocDialogProgram = function()
{
	var prg = new oFF.SuJavadocDialog();
	prg.setup();
	return prg;
};
oFF.SuJavadocDialog.prototype.newProgram = function()
{
	var prg = new oFF.SuJavadocDialog();
	prg.setup();
	return prg;
};
oFF.SuJavadocDialog.prototype.doSetupProgramMetadata = function(metadata)
{
	oFF.DfUiProgram.prototype.doSetupProgramMetadata.call( this , metadata);
};
oFF.SuJavadocDialog.prototype.evalArguments = function()
{
	oFF.DfUiProgram.prototype.evalArguments.call( this );
};
oFF.SuJavadocDialog.prototype.initializeProgram = function()
{
	oFF.DfUiProgram.prototype.initializeProgram.call( this );
	this.setupInternal();
};
oFF.SuJavadocDialog.prototype.releaseObject = function()
{
	oFF.DfUiProgram.prototype.releaseObject.call( this );
};
oFF.SuJavadocDialog.prototype.getLogSeverity = function()
{
	return oFF.DfUiProgram.prototype.getLogSeverity.call( this );
};
oFF.SuJavadocDialog.prototype.getDefaultProgramDevice = function()
{
	return oFF.ProgramDevice.DIALOG;
};
oFF.SuJavadocDialog.prototype.getMenuBarDisplayName = function()
{
	return oFF.SuJavadocDialog.DEFAULT_PROGRAM_NAME;
};
oFF.SuJavadocDialog.prototype.isShowMenuBar = function()
{
	return false;
};
oFF.SuJavadocDialog.prototype.getDialogButtons = function(genesis)
{
	return null;
};
oFF.SuJavadocDialog.prototype.getDefaultContainerSize = function()
{
	return oFF.UiSize.createByCss("90vw", "80vh");
};
oFF.SuJavadocDialog.prototype.setupInternal = function()
{
	oFF.SuJavadocDialog.JAVA_DOC_URL = oFF.XStringUtils.concatenate5("https", "://fir", "efly.w", "df.sa", "p.corp/apidoc/");
	this.setTitle("Firefly Javadoc");
};
oFF.SuJavadocDialog.prototype.buildUi = function(genesis)
{
	oFF.DfUiProgram.prototype.buildUi.call( this , genesis);
	var javaDocHtml = genesis.newControl(oFF.UiType.HTML);
	javaDocHtml.setName("javaDocHtmlFrame");
	javaDocHtml.setWidth(oFF.UiCssLength.create("100%"));
	javaDocHtml.setHeight(oFF.UiCssLength.create("100%"));
	javaDocHtml.setValue(oFF.SuJavadocDialog.JAVA_DOC_URL);
	genesis.setRoot(javaDocHtml);
};

oFF.SuUserProfileDialog = function() {};
oFF.SuUserProfileDialog.prototype = new oFF.DfUiProgram();
oFF.SuUserProfileDialog.prototype._ff_c = "SuUserProfileDialog";

oFF.SuUserProfileDialog.DEFAULT_PROGRAM_NAME = "UserProfileDialog";
oFF.SuUserProfileDialog.createRunner = function()
{
	var runner = oFF.KernelBoot.createByName(oFF.SuUserProfileDialog.DEFAULT_PROGRAM_NAME);
	return runner;
};
oFF.SuUserProfileDialog.createNewUserProfileDialogProgram = function()
{
	var prg = new oFF.SuUserProfileDialog();
	prg.setup();
	return prg;
};
oFF.SuUserProfileDialog.prototype.m_userProfile = null;
oFF.SuUserProfileDialog.prototype.newProgram = function()
{
	var prg = new oFF.SuUserProfileDialog();
	prg.setup();
	return prg;
};
oFF.SuUserProfileDialog.prototype.doSetupProgramMetadata = function(metadata)
{
	oFF.DfUiProgram.prototype.doSetupProgramMetadata.call( this , metadata);
};
oFF.SuUserProfileDialog.prototype.evalArguments = function()
{
	oFF.DfUiProgram.prototype.evalArguments.call( this );
};
oFF.SuUserProfileDialog.prototype.initializeProgram = function()
{
	oFF.DfUiProgram.prototype.initializeProgram.call( this );
	this.setupInternal();
};
oFF.SuUserProfileDialog.prototype.releaseObject = function()
{
	this.m_userProfile = null;
	oFF.DfUiProgram.prototype.releaseObject.call( this );
};
oFF.SuUserProfileDialog.prototype.getLogSeverity = function()
{
	return oFF.DfUiProgram.prototype.getLogSeverity.call( this );
};
oFF.SuUserProfileDialog.prototype.getDefaultProgramDevice = function()
{
	return oFF.ProgramDevice.DIALOG;
};
oFF.SuUserProfileDialog.prototype.getMenuBarDisplayName = function()
{
	return oFF.SuUserProfileDialog.DEFAULT_PROGRAM_NAME;
};
oFF.SuUserProfileDialog.prototype.isShowMenuBar = function()
{
	return true;
};
oFF.SuUserProfileDialog.prototype.getDialogButtons = function(genesis)
{
	return null;
};
oFF.SuUserProfileDialog.prototype.getDefaultContainerSize = function()
{
	return oFF.UiSize.createByCss("60%", "60vh");
};
oFF.SuUserProfileDialog.prototype.setupInternal = function()
{
	this.m_userProfile = this.getArguments().getXObjectByKey("userProfile");
	if (oFF.notNull(this.m_userProfile))
	{
		this.setTitle(oFF.XStringUtils.concatenate2("User profile for ", this.m_userProfile.getFullName()));
	}
	else
	{
		this.setTitle("Unknown user");
	}
};
oFF.SuUserProfileDialog.prototype.buildUi = function(genesis)
{
	oFF.DfUiProgram.prototype.buildUi.call( this , genesis);
	var userInfoMatrixLayout = genesis.newControl(oFF.UiType.MATRIX_LAYOUT);
	var loginMatrixLayout = genesis.newControl(oFF.UiType.MATRIX_LAYOUT);
	var addrPersonMatrixLayout = genesis.newControl(oFF.UiType.MATRIX_LAYOUT);
	var addrWorkCenterMatrixLayout = genesis.newControl(oFF.UiType.MATRIX_LAYOUT);
	var addrCommunicationMatrixLayout = genesis.newControl(oFF.UiType.MATRIX_LAYOUT);
	var addrCompanyMatrixLayout = genesis.newControl(oFF.UiType.MATRIX_LAYOUT);
	var defaultMatrixLayout = genesis.newControl(oFF.UiType.MATRIX_LAYOUT);
	var verticalLayout = genesis.newControl(oFF.UiType.VERTICAL_LAYOUT);
	var verticalAddressLayout = genesis.newControl(oFF.UiType.VERTICAL_LAYOUT);
	var parameterTable = genesis.newControl(oFF.UiType.TABLE);
	var rolesTable = genesis.newControl(oFF.UiType.TABLE);
	var profilesTable = genesis.newControl(oFF.UiType.TABLE);
	var groupsTable = genesis.newControl(oFF.UiType.TABLE);
	var personalizationTable = genesis.newControl(oFF.UiType.TABLE);
	var dlgCloseButton = genesis.newControl(oFF.UiType.BUTTON);
	dlgCloseButton.setName("closeUserProfileBtn");
	dlgCloseButton.setText("Close");
	dlgCloseButton.registerOnPress(this);
	if (oFF.notNull(this.m_userProfile))
	{
		var matrixRow1 = userInfoMatrixLayout.addNewMatrixLayoutRow();
		matrixRow1.addNewMatrixLayoutCell().setNewContent(oFF.UiType.IMAGE).setHeight(oFF.UiCssLength.create("80px")).setWidth(oFF.UiCssLength.create("80px")).setCornerRadius(oFF.UiCssBoxEdges.create("50%")).setSrc(this.m_userProfile.getThumbnailPhotoEncoded());
		matrixRow1.addNewMatrixLayoutCell().setNewContent(oFF.UiType.LABEL).setText(this.m_userProfile.getFullName());
		matrixRow1.addNewMatrixLayoutCell().setNewContent(oFF.UiType.LABEL).setText("");
		var matrixRow2 = userInfoMatrixLayout.addNewMatrixLayoutRow();
		matrixRow2.addNewMatrixLayoutCell().setNewContent(oFF.UiType.LABEL).setText("");
		matrixRow2.addNewMatrixLayoutCell().setNewContent(oFF.UiType.LABEL).setText("First Name");
		matrixRow2.addNewMatrixLayoutCell().setNewContent(oFF.UiType.LABEL).setText(this.m_userProfile.getFirstName());
		var matrixRow3 = userInfoMatrixLayout.addNewMatrixLayoutRow();
		matrixRow3.addNewMatrixLayoutCell().setNewContent(oFF.UiType.LABEL).setText("");
		matrixRow3.addNewMatrixLayoutCell().setNewContent(oFF.UiType.LABEL).setText("Last Name");
		matrixRow3.addNewMatrixLayoutCell().setNewContent(oFF.UiType.LABEL).setText(this.m_userProfile.getLastName());
		var matrixRow4 = userInfoMatrixLayout.addNewMatrixLayoutRow();
		matrixRow4.addNewMatrixLayoutCell().setNewContent(oFF.UiType.LABEL).setText("");
		matrixRow4.addNewMatrixLayoutCell().setNewContent(oFF.UiType.LABEL).setText("Email");
		matrixRow4.addNewMatrixLayoutCell().setNewContent(oFF.UiType.LABEL).setText(this.m_userProfile.getEmailAddress());
		var matrixRow5 = userInfoMatrixLayout.addNewMatrixLayoutRow();
		matrixRow5.addNewMatrixLayoutCell().setNewContent(oFF.UiType.LABEL).setText("");
		matrixRow5.addNewMatrixLayoutCell().setNewContent(oFF.UiType.LABEL).setText("Phone number");
		matrixRow5.addNewMatrixLayoutCell().setNewContent(oFF.UiType.LABEL).setText(this.m_userProfile.getPhoneNumber());
		var matrixRow6 = userInfoMatrixLayout.addNewMatrixLayoutRow();
		matrixRow6.addNewMatrixLayoutCell().setNewContent(oFF.UiType.LABEL).setText("");
		matrixRow6.addNewMatrixLayoutCell().setNewContent(oFF.UiType.LABEL).setText("Mobile number");
		matrixRow6.addNewMatrixLayoutCell().setNewContent(oFF.UiType.LABEL).setText(this.m_userProfile.getMobilePhoneNumber());
		var matrixRow7 = userInfoMatrixLayout.addNewMatrixLayoutRow();
		matrixRow7.addNewMatrixLayoutCell().setNewContent(oFF.UiType.LABEL).setText("");
		matrixRow7.addNewMatrixLayoutCell().setNewContent(oFF.UiType.LABEL).setText("Department");
		matrixRow7.addNewMatrixLayoutCell().setNewContent(oFF.UiType.LABEL).setText(this.m_userProfile.getDepartment());
		var matrixRow8 = userInfoMatrixLayout.addNewMatrixLayoutRow();
		matrixRow8.addNewMatrixLayoutCell().setNewContent(oFF.UiType.LABEL).setText("");
		matrixRow8.addNewMatrixLayoutCell().setNewContent(oFF.UiType.LABEL).setText("Room number");
		matrixRow8.addNewMatrixLayoutCell().setNewContent(oFF.UiType.LABEL).setText(this.m_userProfile.getRoomNumber());
		loginMatrixLayout.setName("loginMatrixLayout");
		var loginMatrixRow1 = loginMatrixLayout.addNewMatrixLayoutRow();
		loginMatrixRow1.addNewMatrixLayoutCell().setNewContent(oFF.UiType.LABEL).setText("Alias:");
		loginMatrixRow1.addNewMatrixLayoutCell().setNewContent(oFF.UiType.LABEL).setText(this.m_userProfile.getSAPName());
		var loginMatrixRow2 = loginMatrixLayout.addNewMatrixLayoutRow();
		loginMatrixRow2.addNewMatrixLayoutCell().setNewContent(oFF.UiType.LABEL).setText("User Type:");
		loginMatrixRow2.addNewMatrixLayoutCell().setNewContent(oFF.UiType.LABEL).setText(this.m_userProfile.getSamaAccountType());
		var loginMatrixRow3 = loginMatrixLayout.addNewMatrixLayoutRow();
		loginMatrixRow3.addNewMatrixLayoutCell().setNewContent(oFF.UiType.LABEL).setText("Manager:");
		loginMatrixRow3.addNewMatrixLayoutCell().setNewContent(oFF.UiType.LABEL).setText(this.m_userProfile.getManagerPersonNumber());
		var loginMatrixRow4 = loginMatrixLayout.addNewMatrixLayoutRow();
		loginMatrixRow4.addNewMatrixLayoutCell().setNewContent(oFF.UiType.LABEL).setText("Password:");
		loginMatrixRow4.addNewMatrixLayoutCell().setNewContent(oFF.UiType.LABEL).setText("**************************************");
		var loginMatrixRow5 = loginMatrixLayout.addNewMatrixLayoutRow();
		loginMatrixRow5.addNewMatrixLayoutCell().setNewContent(oFF.UiType.LABEL).setText("Repeat Password:");
		loginMatrixRow5.addNewMatrixLayoutCell().setNewContent(oFF.UiType.LABEL).setText("**************************************");
		var loginMatrixRow6 = loginMatrixLayout.addNewMatrixLayoutRow();
		loginMatrixRow6.addNewMatrixLayoutCell().setNewContent(oFF.UiType.LABEL).setText("Password Status:");
		loginMatrixRow6.addNewMatrixLayoutCell().setNewContent(oFF.UiType.LABEL).setText("Productive Password");
		var loginMatrixRow7 = loginMatrixLayout.addNewMatrixLayoutRow();
		loginMatrixRow7.addNewMatrixLayoutCell().setNewContent(oFF.UiType.LABEL).setText("Valid from:");
		loginMatrixRow7.addNewMatrixLayoutCell().setNewContent(oFF.UiType.LABEL).setText("01.01.1990");
		var loginMatrixRow8 = loginMatrixLayout.addNewMatrixLayoutRow();
		loginMatrixRow8.addNewMatrixLayoutCell().setNewContent(oFF.UiType.LABEL).setText("Valid to:");
		loginMatrixRow8.addNewMatrixLayoutCell().setNewContent(oFF.UiType.LABEL).setText("31.12.9999");
		var loginMatrixRow9 = loginMatrixLayout.addNewMatrixLayoutRow();
		loginMatrixRow9.addNewMatrixLayoutCell().setNewContent(oFF.UiType.LABEL).setText("Account no.:");
		loginMatrixRow9.addNewMatrixLayoutCell().setNewContent(oFF.UiType.LABEL).setText(this.m_userProfile.getPersonNumber());
		var loginMatrixRow10 = loginMatrixLayout.addNewMatrixLayoutRow();
		loginMatrixRow10.addNewMatrixLayoutCell().setNewContent(oFF.UiType.LABEL).setText("Cost Center");
		loginMatrixRow10.addNewMatrixLayoutCell().setNewContent(oFF.UiType.LABEL).setText(this.m_userProfile.getCostCenter());
		var headerLabel = genesis.newControl(oFF.UiType.LABEL);
		headerLabel.setName("Person");
		headerLabel.setText("Person");
		headerLabel.setFontSize(oFF.UiCssLength.createExt(14, oFF.UiCssSizeUnit.PIXEL));
		headerLabel.setFontWeight(oFF.UiFontWeight.BOLD);
		verticalAddressLayout.addItem(headerLabel);
		verticalAddressLayout.addItem(genesis.newControl(oFF.UiType.SPACER).setBackgroundColor(oFF.UiColor.GREY).setHeight(oFF.UiCssLength.create("1px")).setWidth(oFF.UiCssLength.create("100%")));
		addrPersonMatrixLayout.setName("addrPersonMatrixLayout");
		var addressPersonMatrixRow1 = addrPersonMatrixLayout.addNewMatrixLayoutRow();
		addressPersonMatrixRow1.addNewMatrixLayoutCell().setNewContent(oFF.UiType.LABEL).setText("Title:");
		addressPersonMatrixRow1.addNewMatrixLayoutCell().setNewContent(oFF.UiType.LABEL).setText(this.m_userProfile.getDescription());
		var addressPersonMatrixRow2 = addrPersonMatrixLayout.addNewMatrixLayoutRow();
		addressPersonMatrixRow2.addNewMatrixLayoutCell().setNewContent(oFF.UiType.LABEL).setText("Last Name:");
		addressPersonMatrixRow2.addNewMatrixLayoutCell().setNewContent(oFF.UiType.LABEL).setText(this.m_userProfile.getLastName());
		var addressPersonMatrixRow3 = addrPersonMatrixLayout.addNewMatrixLayoutRow();
		addressPersonMatrixRow3.addNewMatrixLayoutCell().setNewContent(oFF.UiType.LABEL).setText("First Name:");
		addressPersonMatrixRow3.addNewMatrixLayoutCell().setNewContent(oFF.UiType.LABEL).setText(this.m_userProfile.getFirstName());
		var addressPersonMatrixRow4 = addrPersonMatrixLayout.addNewMatrixLayoutRow();
		addressPersonMatrixRow4.addNewMatrixLayoutCell().setNewContent(oFF.UiType.LABEL).setText("Academic Title:");
		addressPersonMatrixRow4.addNewMatrixLayoutCell().setNewContent(oFF.UiType.LABEL).setText(this.m_userProfile.getTitle());
		var addressPersonMatrixRow5 = addrPersonMatrixLayout.addNewMatrixLayoutRow();
		addressPersonMatrixRow5.addNewMatrixLayoutCell().setNewContent(oFF.UiType.LABEL).setText("Full Name:");
		addressPersonMatrixRow5.addNewMatrixLayoutCell().setNewContent(oFF.UiType.LABEL).setText(this.m_userProfile.getFullName());
		var addressPersonMatrixRow6 = addrPersonMatrixLayout.addNewMatrixLayoutRow();
		addressPersonMatrixRow6.addNewMatrixLayoutCell().setNewContent(oFF.UiType.LABEL).setText("Language:");
		addressPersonMatrixRow6.addNewMatrixLayoutCell().setNewContent(oFF.UiType.LABEL).setText(this.m_userProfile.getLanguage());
		verticalAddressLayout.addItem(addrPersonMatrixLayout);
		var headerWorkCenterLabel = genesis.newControl(oFF.UiType.LABEL);
		headerWorkCenterLabel.setName("WorkCenter");
		headerWorkCenterLabel.setText("Work Center");
		headerWorkCenterLabel.setFontSize(oFF.UiCssLength.createExt(14, oFF.UiCssSizeUnit.PIXEL));
		headerWorkCenterLabel.setFontWeight(oFF.UiFontWeight.BOLD);
		verticalAddressLayout.addItem(genesis.newControl(oFF.UiType.SPACER));
		verticalAddressLayout.addItem(headerWorkCenterLabel);
		verticalAddressLayout.addItem(genesis.newControl(oFF.UiType.SPACER).setBackgroundColor(oFF.UiColor.GREY).setHeight(oFF.UiCssLength.create("1px")).setWidth(oFF.UiCssLength.create("100%")));
		addrWorkCenterMatrixLayout.setName("addrWorkCenterMatrixLayout");
		var addressWorkCenterMatrixRow1 = addrWorkCenterMatrixLayout.addNewMatrixLayoutRow();
		addressWorkCenterMatrixRow1.addNewMatrixLayoutCell().setNewContent(oFF.UiType.LABEL).setText("Function:");
		addressWorkCenterMatrixRow1.addNewMatrixLayoutCell().setNewContent(oFF.UiType.LABEL).setText(this.m_userProfile.getDescription());
		var addressWorkCenterMatrixRow2 = addrWorkCenterMatrixLayout.addNewMatrixLayoutRow();
		addressWorkCenterMatrixRow2.addNewMatrixLayoutCell().setNewContent(oFF.UiType.LABEL).setText("Department:");
		addressWorkCenterMatrixRow2.addNewMatrixLayoutCell().setNewContent(oFF.UiType.LABEL).setText(this.m_userProfile.getDepartment());
		var addressWorkCenterMatrixRow3 = addrWorkCenterMatrixLayout.addNewMatrixLayoutRow();
		addressWorkCenterMatrixRow3.addNewMatrixLayoutCell().setNewContent(oFF.UiType.LABEL).setText("Room Number:");
		addressWorkCenterMatrixRow3.addNewMatrixLayoutCell().setNewContent(oFF.UiType.LABEL).setText(this.m_userProfile.getRoomNumber());
		var addressWorkCenterMatrixRow4 = addrWorkCenterMatrixLayout.addNewMatrixLayoutRow();
		addressWorkCenterMatrixRow4.addNewMatrixLayoutCell().setNewContent(oFF.UiType.LABEL).setText("Floor:");
		var floor = null;
		var roomNumber = this.m_userProfile.getRoomNumber();
		if (oFF.notNull(roomNumber) && oFF.XString.containsString(roomNumber, ",") && oFF.XString.containsString(roomNumber, "."))
		{
			floor = oFF.XString.substring(roomNumber, oFF.XString.lastIndexOf(roomNumber, ",") + 1, oFF.XString.lastIndexOf(roomNumber, "."));
		}
		addressWorkCenterMatrixRow4.addNewMatrixLayoutCell().setNewContent(oFF.UiType.LABEL).setText(floor);
		var addressWorkCenterMatrixRow5 = addrWorkCenterMatrixLayout.addNewMatrixLayoutRow();
		addressWorkCenterMatrixRow5.addNewMatrixLayoutCell().setNewContent(oFF.UiType.LABEL).setText("Building Code:");
		var buildingCode = null;
		if (oFF.notNull(roomNumber) && oFF.XString.containsString(roomNumber, ","))
		{
			buildingCode = oFF.XString.substring(roomNumber, 0, oFF.XString.lastIndexOf(roomNumber, ","));
		}
		addressWorkCenterMatrixRow5.addNewMatrixLayoutCell().setNewContent(oFF.UiType.LABEL).setText(buildingCode);
		verticalAddressLayout.addItem(addrWorkCenterMatrixLayout);
		var headerCommuncationLabel = genesis.newControl(oFF.UiType.LABEL);
		headerCommuncationLabel.setName("Communication");
		headerCommuncationLabel.setText("Communication");
		headerCommuncationLabel.setFontSize(oFF.UiCssLength.createExt(14, oFF.UiCssSizeUnit.PIXEL));
		headerCommuncationLabel.setFontWeight(oFF.UiFontWeight.BOLD);
		verticalAddressLayout.addItem(genesis.newControl(oFF.UiType.SPACER));
		verticalAddressLayout.addItem(headerCommuncationLabel);
		verticalAddressLayout.addItem(genesis.newControl(oFF.UiType.SPACER).setBackgroundColor(oFF.UiColor.GREY).setHeight(oFF.UiCssLength.create("1px")).setWidth(oFF.UiCssLength.create("100%")));
		var addressCommunicationMatrixRow1 = addrCommunicationMatrixLayout.addNewMatrixLayoutRow();
		addressCommunicationMatrixRow1.addNewMatrixLayoutCell().setNewContent(oFF.UiType.LABEL).setText("Telephone:");
		addressCommunicationMatrixRow1.addNewMatrixLayoutCell().setNewContent(oFF.UiType.LABEL).setText(this.m_userProfile.getPhoneNumber());
		var addressCommunicationMatrixRow3 = addrCommunicationMatrixLayout.addNewMatrixLayoutRow();
		addressCommunicationMatrixRow3.addNewMatrixLayoutCell().setNewContent(oFF.UiType.LABEL).setText("Cell Phone:");
		addressCommunicationMatrixRow3.addNewMatrixLayoutCell().setNewContent(oFF.UiType.LABEL).setText(this.m_userProfile.getMobilePhoneNumber());
		var addressCommunicationMatrixRow4 = addrCommunicationMatrixLayout.addNewMatrixLayoutRow();
		addressCommunicationMatrixRow4.addNewMatrixLayoutCell().setNewContent(oFF.UiType.LABEL).setText("Fax:");
		addressCommunicationMatrixRow4.addNewMatrixLayoutCell().setNewContent(oFF.UiType.LABEL).setText(this.m_userProfile.getFaxNumber());
		var addressCommunicationMatrixRow6 = addrCommunicationMatrixLayout.addNewMatrixLayoutRow();
		addressCommunicationMatrixRow6.addNewMatrixLayoutCell().setNewContent(oFF.UiType.LABEL).setText("Email Address:");
		addressCommunicationMatrixRow6.addNewMatrixLayoutCell().setNewContent(oFF.UiType.LABEL).setText(this.m_userProfile.getEmailAddress());
		var addressCommunicationMatrixRow7 = addrCommunicationMatrixLayout.addNewMatrixLayoutRow();
		addressCommunicationMatrixRow7.addNewMatrixLayoutCell().setNewContent(oFF.UiType.LABEL).setText("Telephone Assistant");
		addressCommunicationMatrixRow7.addNewMatrixLayoutCell().setNewContent(oFF.UiType.LABEL).setText(this.m_userProfile.getTelephoneAssistant());
		verticalAddressLayout.addItem(addrCommunicationMatrixLayout);
		var headerCompanyLabel = genesis.newControl(oFF.UiType.LABEL);
		headerCompanyLabel.setName("Company");
		headerCompanyLabel.setText("Company");
		headerCompanyLabel.setFontSize(oFF.UiCssLength.createExt(14, oFF.UiCssSizeUnit.PIXEL));
		headerCompanyLabel.setFontWeight(oFF.UiFontWeight.BOLD);
		verticalAddressLayout.addItem(genesis.newControl(oFF.UiType.SPACER));
		verticalAddressLayout.addItem(headerCompanyLabel);
		verticalAddressLayout.addItem(genesis.newControl(oFF.UiType.SPACER).setBackgroundColor(oFF.UiColor.GREY).setHeight(oFF.UiCssLength.create("1px")).setWidth(oFF.UiCssLength.create("100%")));
		var addressCompanyMatrixRow1 = addrCompanyMatrixLayout.addNewMatrixLayoutRow();
		addressCompanyMatrixRow1.addNewMatrixLayoutCell().setNewContent(oFF.UiType.LABEL).setText("Company:");
		addressCompanyMatrixRow1.addNewMatrixLayoutCell().setNewContent(oFF.UiType.LABEL).setText(this.m_userProfile.getCompany());
		verticalAddressLayout.addItem(addrCompanyMatrixLayout);
		defaultMatrixLayout.setName("defaultMatrixLayout");
		var defaultMatrixRow1 = defaultMatrixLayout.addNewMatrixLayoutRow();
		defaultMatrixRow1.addNewMatrixLayoutCell().setNewContent(oFF.UiType.LABEL).setText("Language:");
		defaultMatrixRow1.addNewMatrixLayoutCell().setNewContent(oFF.UiType.LABEL).setText(this.m_userProfile.getLanguage());
		var defaultMatrixRow2 = defaultMatrixLayout.addNewMatrixLayoutRow();
		defaultMatrixRow2.addNewMatrixLayoutCell().setNewContent(oFF.UiType.LABEL).setText("Data Access Language:");
		defaultMatrixRow2.addNewMatrixLayoutCell().setNewContent(oFF.UiType.LABEL).setText(this.m_userProfile.getDataAccessLanguage());
		var defaultMatrixRow3 = defaultMatrixLayout.addNewMatrixLayoutRow();
		defaultMatrixRow3.addNewMatrixLayoutCell().setNewContent(oFF.UiType.LABEL).setText("Date Formatting:");
		defaultMatrixRow3.addNewMatrixLayoutCell().setNewContent(oFF.UiType.LABEL).setText(this.m_userProfile.getDateFormatting());
		var defaultMatrixRow4 = defaultMatrixLayout.addNewMatrixLayoutRow();
		defaultMatrixRow4.addNewMatrixLayoutCell().setNewContent(oFF.UiType.LABEL).setText("Time Formatting:");
		defaultMatrixRow4.addNewMatrixLayoutCell().setNewContent(oFF.UiType.LABEL).setText(this.m_userProfile.getTimeFormatting());
		var defaultMatrixRow5 = defaultMatrixLayout.addNewMatrixLayoutRow();
		defaultMatrixRow5.addNewMatrixLayoutCell().setNewContent(oFF.UiType.LABEL).setText("Number Formatting:");
		defaultMatrixRow5.addNewMatrixLayoutCell().setNewContent(oFF.UiType.LABEL).setText(this.m_userProfile.getDecimalFormatExample());
		var defaultMatrixRow6 = defaultMatrixLayout.addNewMatrixLayoutRow();
		defaultMatrixRow6.addNewMatrixLayoutCell().setNewContent(oFF.UiType.LABEL).setText("Scale Formatting:");
		defaultMatrixRow6.addNewMatrixLayoutCell().setNewContent(oFF.UiType.LABEL).setText(this.m_userProfile.getScaleFormatting());
		var defaultMatrixRow7 = defaultMatrixLayout.addNewMatrixLayoutRow();
		defaultMatrixRow7.addNewMatrixLayoutCell().setNewContent(oFF.UiType.LABEL).setText("Currency Position:");
		defaultMatrixRow7.addNewMatrixLayoutCell().setNewContent(oFF.UiType.LABEL).setText(this.m_userProfile.getCurrencyPosition());
		var defaultMatrixRow8 = defaultMatrixLayout.addNewMatrixLayoutRow();
		defaultMatrixRow8.addNewMatrixLayoutCell().setNewContent(oFF.UiType.LABEL).setText("Default Application:");
		defaultMatrixRow8.addNewMatrixLayoutCell().setNewContent(oFF.UiType.LABEL).setText(this.m_userProfile.getMainApplication());
		var defaultMatrixRow9 = defaultMatrixLayout.addNewMatrixLayoutRow();
		defaultMatrixRow9.addNewMatrixLayoutCell().setNewContent(oFF.UiType.LABEL).setText("Clean up notification:");
		defaultMatrixRow9.addNewMatrixLayoutCell().setNewContent(oFF.UiType.LABEL).setText(this.m_userProfile.getCleanUpNotification());
		var defaultMatrixRow10 = defaultMatrixLayout.addNewMatrixLayoutRow();
		defaultMatrixRow10.addNewMatrixLayoutCell().setNewContent(oFF.UiType.LABEL).setText("Email notification:");
		defaultMatrixRow10.addNewMatrixLayoutCell().setNewContent(oFF.UiType.LABEL).setText(this.m_userProfile.getEmailSystemNotification());
		var defaultMatrixRow11 = defaultMatrixLayout.addNewMatrixLayoutRow();
		defaultMatrixRow11.addNewMatrixLayoutCell().setNewContent(oFF.UiType.LABEL).setText("");
		defaultMatrixRow11.addNewMatrixLayoutCell().setNewContent(oFF.UiType.LABEL).setText(this.m_userProfile.getEmailProductUpdateNotification());
		var defaultMatrixRow12 = loginMatrixLayout.addNewMatrixLayoutRow();
		defaultMatrixRow12.addNewMatrixLayoutCell().setNewContent(oFF.UiType.LABEL).setText("Unix Home Directory:");
		defaultMatrixRow12.addNewMatrixLayoutCell().setNewContent(oFF.UiType.LABEL).setText(this.m_userProfile.getUnixHomeDirectory());
	}
	else
	{
		userInfoMatrixLayout.setName("userInfoMatrixLayout");
		var matrixRow11 = userInfoMatrixLayout.addNewMatrixLayoutRow();
		matrixRow11.addNewMatrixLayoutCell().setNewContent(oFF.UiType.IMAGE).setHeight(oFF.UiCssLength.create("80px")).setWidth(oFF.UiCssLength.create("80px")).setCornerRadius(oFF.UiCssBoxEdges.create("50%")).setSrc("data:image/jpeg;base64,/9j/4AAQSkZJRgABAQEBKwErAAD/2wBDAAEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQH/wAALCABkAGQBAREA/8QAHgABAAICAgMBAAAAAAAAAAAAAAoLCAkGBwEDBQL/xAAwEAAABgIBAgMHBAMBAAAAAAABAgMEBQYABwgJEgoRExQVFiFSktMiMTJBFxhRI//aAAgBAQAAPwCfxjGMYxjGMYxjGMZq/wCqD1bOKHSi1Kz2DyCnXszdbWR8jq3SlOMzdbF2Q/YlD2lVg1dLJNYOsx6yiKUxbZpRCKYGWTbNwkJJVtHLwKuS/jH+pVs+fkS8eKhpTjPShWXJENUqqTa95BoJzA3UlrNd++urPPS7RV92UmNRIoIlJ3lADGw8g/FQ9bGGk05FblFXZ1MigHPFTmjtMrRiwAPmKSibGkx7sqY/xH0XiSgB/E5R+ebyun14z+xOrVX6D1HNJ1lCsSbltHud9aFZyrBzXDLKFSGWturZaQmglotLz9V+5qM0zftkgOdlW5I5SoDPU1ns3X259f1DauqbhA37XN9gmFmp1yrEgjJwVhgpNEq7OQj3iBhIomoQRIomcCLtlyKtnKSLlFVInOsYxjGM+DabLC0usWO42V8jF12pwMvZZ+TcGAqEdCwUe4lJV8uYfICos2LVdwoYfkBEzDlJb1ReeuwupBzV3Lycu8m/UhbBY30JqmsuXCh2VE1HBPXLSi1eNbGN6TUycV2Sk0ZEpPeFjkpeTV81XZxzXvjGTyvBn9Rm0Nr7tLprbFsLqSqM3XZjdXHtCRcqLfDdhhF23+TqZEeqcfRjbBFPEbo3j0e1BrIQdjepkBWWcmGwuxjGMYzU511NmSOo+kNz+ucQ6UZSZuPdoqDJ0kcU1UVdjuY7XZjpnKIGKcqNpUEogID5h8spasYxm33oG7Mf6o6w3ASyMXarQsvviE17I+mcSAvE7PjpTXsg3V8hDvTOjZBMJB+QmIQf3AMue8YxjGM0u+IfqcncujBz4i4lJVZ3H6ljLUdJEomOMfTL/T7XLn8igI9iETDvXCn/ABNIwj8gHKanGMZs96K9Rk7x1ZentARCSirv/anU02oCZRMKcfVLG2tUu4N5fME20TCvXCpv2Kmkcw/IMuu8YxjGM6z3Tqqsb00/tLSt1bg7qG2te3HXFmQEhVBPCXSvyFekhTKf9PrJtZBRREw/xVIQwCAgAhRvcuOM+w+HPJXdHGTakavHXXTd9nabIisidJKWZMXRjwVkj+8A9aItEErHWCIck8yOI6SbKlH9XkGOmMZMe8HJwSnNwc1LvzdssKqGs+LVTlq1UJV02H2OX3TsqJWhUWkeqcAIsrVaE7sMlJil3HYuZyuGN2+1kHLNrGMYxjGRbfER9AZr1Oaoz5IcbUoOuc0tbV33QLCRVbxMJvulRoLOGNOnZU4EbxlygzqLFpdkfmBkog4Urs2u3jhjpCHq7Ny6Q2/x32FP6o3nra5ao2PV3irGdp15gX9fm2KyRzJ+p7M+RSB0zWEonaSLI7iPfIiVwzcroHIobqzNsHS96OXMLqnbPiq5pykydX08ylGyWx+Q9siXzPWlIigVL7eVnIKEQJb7X7OCnu2o19ZzIOHApHkVIqN9eSQt2OCXCTSXT04ya54t6EiDsaZRGB1JKbfEQGw3q3yPYvZ71anKBCFdz9jkCmcL9oA3YNCM4hgRKOjmaCeYGMYxjPBjAUBERAAABEREfIAAP3ER/ryzQF1K/Ee9PPp1knKUW6l5JchI0q7Yml9LScbMBCyiYeRW2w78U7mrUoqSggV7H+tM2luAGEKyf9wj58NfGnzEpu6yxvOnjxAVjRFpl0hpdl0MWXl7bqZh5FRBvboixyhx2THmKHtL6Ug/huYarCsZjASSJ0GDeU3F7r6MvV1osYR5auHPLaJVbJizrd/SpTzYlc9pJ3mbfDFzQjdj1J2UTmKqVFlHH9UBEpz/AKTjxWH6JPRH1TIkvheFHFuHNHqA/LJXQ6s9XWhkh9QHAxt5sstWk00x/UHexBIgB8gAoeWdQcx/ECdJbpv0VemVfZ9C2rcauxVj6px64pJ1uxJs3DdM3s0U9lquKWtqDHEVAE3Ht8qk8bJ9x2sK+VAqB45fGvxr16NvOyk5Y8Wa2nx2slg86mtpaUfqbQ1bAmMmgiSZJaH5ILaBiJgLuQUbBRXXrmW9gTURBBgWa9wy6hHD3qA0FLYfFDeNP2lHJt0FpyvM3gxl9p6y5CCDK5USVK0s9ccEOf0gUfxpGLk5TGYPHaPaqbM7GMZwfZuxqfp/XN82vsGYb1+i62qFivNwm3ZykbxVbq0S6mpl8oJjFAfZ2DJdQqYCBlTgVMnmc4ANT/1SvEvc7ufs3dNfaxuMlxh4tvpCSjYbXWsX7qFutwq3rqIs1No7BaLJz8o5k2QJrSddgnMLVkzLKMlY+SKl7WtHCOc6hzqKHMdQ5jHOc5hMcxzCJjGMYwiYxjGERMYRERERERERz8Z7EllUFCLIKqIrJmAyaqRzJqJmD9jEOQQMUwf0JRAQz7j622qUbAyk7NYJFmUO0rR9NSTtsUPL5ACDhyokAB/wCeWcfxnaGnd2be4936E2lo3Zd11NsSuOCOYW40KxSVanmRyHKcUwfRjhuou0WEoFdMXPrMnifmi6brJGMQbEjw5fiOtx839yR3Bnm+NVl9sS9SlJTTO8Idi0rEjsKSqTEZGZpd6gGXowStocV5u/nIedr7OJSkgiJJk/ijvlmzpabBjGRAfGCdQH/XzhLVOGlIm/ZNk8wJdT4wSZuOx9F6Kor1k/sXrgT/0RRutqGCraXcJU38SztLX9RSKFysFxjGMYxnc3Hfel74yb21FyE1lIqRd901sGr7DrDoihiENI1mVbSQMXXb81I+URRWjJNAfMrmPeOm5wEipgG8O4n8jqLy842aT5M61dkdUzdWu63fIkhVCqqRisuwTPLQDwxf4yVcmSSEDKJD5GRkI5ykYAEg5kJnodOmzJs4evF0WrNogq6dOnChUUGzZBMyq666qglIkiikQyiihzAUhCmMYQABHKYXrlc+HHUV6kG+N2xcos/wBWViYNqLRyIqGFojqzXjp5FxUq0SE5iJ/GMseZuy/aAG9SxCkfzBEvlqIxjGMYxjLE/wAGH1AvizWO6enTe5v1JrWLp1vDRiD1wAqr0Syv2zHZdYjyqH7jI123OoyzoNkgEe24zCwFBJqcSzqc0H+JU5mWnhd0od3WChGeNL5vGQh+N9ZnWRzoqVkmz2UyFrniuE/1IOm9GhLOzjFiGKojMPo9cgh6QiFPvjGMYxjGMz36YPMO28Dud/G7k3UzO1iUXYkQyuEM0VOn8T66tSvwzfq2oUogVUZOsSkiDIqgGIlKJMHQF9RuQQu+WjhJ61bPEe/0XbdFyj3gYh/SXTKqn3k8/Mpuw4dxR+YD5gP7Zg31KOHmkedHDPdGgd+wsjK0qRrTy2sHsE/SirLWLdS2rmdrVnrUouzkEGMvGvW4pgZywfM3bB0+jnzNyyeOET0omxKTFVG+XGrxriQXj69ZJeHZLPlWyrxVtHvlmyJ3SiDRsgdcyaYCqZJuimY4iJUiB5FDhnutv9a33E/Hj3W3+tb7ifjx7rb/AFrfcT8ePdbf61vuJ+PHutv9a33E/Hj3W3+tb7ifjx7rb/Wt9xPx491t/rW+4n48e62/1rfcT8eSHfDT8DtAc1uoZV4jf0bYLJWdTR/+V4mqM5RmwgLHYqg5Qk4ZhcEDRTp7KV0r9Bu4exTJ9F+8Cog0eOFmKrhqtbdgBe0oAUoABQAAAAAAAA+QAH9AH9B/Wf/Z");
		matrixRow11.addNewMatrixLayoutCell().setNewContent(oFF.UiType.LABEL).setText("Albert Einstein");
		matrixRow11.addNewMatrixLayoutCell().setNewContent(oFF.UiType.LABEL).setText("");
		var matrixRow12 = userInfoMatrixLayout.addNewMatrixLayoutRow();
		matrixRow12.addNewMatrixLayoutCell().setNewContent(oFF.UiType.LABEL).setText("");
		matrixRow12.addNewMatrixLayoutCell().setNewContent(oFF.UiType.LABEL).setText("First Name:");
		matrixRow12.addNewMatrixLayoutCell().setNewContent(oFF.UiType.LABEL).setText("Albert");
		var matrixRow13 = userInfoMatrixLayout.addNewMatrixLayoutRow();
		matrixRow13.addNewMatrixLayoutCell().setNewContent(oFF.UiType.LABEL).setText("");
		matrixRow13.addNewMatrixLayoutCell().setNewContent(oFF.UiType.LABEL).setText("Last Name:");
		matrixRow13.addNewMatrixLayoutCell().setNewContent(oFF.UiType.LABEL).setText("Einstein");
		var matrixRow14 = userInfoMatrixLayout.addNewMatrixLayoutRow();
		matrixRow14.addNewMatrixLayoutCell().setNewContent(oFF.UiType.LABEL).setText("");
		matrixRow14.addNewMatrixLayoutCell().setNewContent(oFF.UiType.LABEL).setText("Email:");
		matrixRow14.addNewMatrixLayoutCell().setNewContent(oFF.UiType.LABEL).setText("albert.einstein@sap.com");
		var matrixRow15 = userInfoMatrixLayout.addNewMatrixLayoutRow();
		matrixRow15.addNewMatrixLayoutCell().setNewContent(oFF.UiType.LABEL).setText("");
		matrixRow15.addNewMatrixLayoutCell().setNewContent(oFF.UiType.LABEL).setText("Department:");
		matrixRow15.addNewMatrixLayoutCell().setNewContent(oFF.UiType.LABEL).setText("Area 51");
		var matrixRow16 = userInfoMatrixLayout.addNewMatrixLayoutRow();
		matrixRow16.addNewMatrixLayoutCell().setNewContent(oFF.UiType.LABEL).setText("");
		matrixRow16.addNewMatrixLayoutCell().setNewContent(oFF.UiType.LABEL).setText("Room Number:");
		matrixRow16.addNewMatrixLayoutCell().setNewContent(oFF.UiType.LABEL).setText("panic room");
		loginMatrixLayout.setName("loginMatrixLayout");
		var loginMatrixRow1_1 = loginMatrixLayout.addNewMatrixLayoutRow();
		loginMatrixRow1_1.addNewMatrixLayoutCell().setNewContent(oFF.UiType.LABEL).setText("Alias:");
		loginMatrixRow1_1.addNewMatrixLayoutCell().setNewContent(oFF.UiType.LABEL).setText("");
		var loginMatrixRow1_2 = loginMatrixLayout.addNewMatrixLayoutRow();
		loginMatrixRow1_2.addNewMatrixLayoutCell().setNewContent(oFF.UiType.LABEL).setText("User Type:");
		loginMatrixRow1_2.addNewMatrixLayoutCell().setNewContent(oFF.UiType.LABEL).setText("Dialog");
		var loginMatrixRow1_3 = loginMatrixLayout.addNewMatrixLayoutRow();
		loginMatrixRow1_3.addNewMatrixLayoutCell().setNewContent(oFF.UiType.LABEL).setText("Security Policy:");
		loginMatrixRow1_3.addNewMatrixLayoutCell().setNewContent(oFF.UiType.LABEL).setText("");
		var loginMatrixRow1_4 = loginMatrixLayout.addNewMatrixLayoutRow();
		loginMatrixRow1_4.addNewMatrixLayoutCell().setNewContent(oFF.UiType.LABEL).setText("Password:");
		loginMatrixRow1_4.addNewMatrixLayoutCell().setNewContent(oFF.UiType.LABEL).setText("**************************************");
		var loginMatrixRow1_5 = loginMatrixLayout.addNewMatrixLayoutRow();
		loginMatrixRow1_5.addNewMatrixLayoutCell().setNewContent(oFF.UiType.LABEL).setText("Repeat Password:");
		loginMatrixRow1_5.addNewMatrixLayoutCell().setNewContent(oFF.UiType.LABEL).setText("**************************************");
		var loginMatrixRow1_6 = loginMatrixLayout.addNewMatrixLayoutRow();
		loginMatrixRow1_6.addNewMatrixLayoutCell().setNewContent(oFF.UiType.LABEL).setText("Password Status:");
		loginMatrixRow1_6.addNewMatrixLayoutCell().setNewContent(oFF.UiType.LABEL).setText("Productive Password");
		var loginMatrixRow1_7 = loginMatrixLayout.addNewMatrixLayoutRow();
		loginMatrixRow1_7.addNewMatrixLayoutCell().setNewContent(oFF.UiType.LABEL).setText("User group:");
		loginMatrixRow1_7.addNewMatrixLayoutCell().setNewContent(oFF.UiType.LABEL).setText("");
		var loginMatrixRow1_8 = loginMatrixLayout.addNewMatrixLayoutRow();
		loginMatrixRow1_8.addNewMatrixLayoutCell().setNewContent(oFF.UiType.LABEL).setText("Valid from:");
		loginMatrixRow1_8.addNewMatrixLayoutCell().setNewContent(oFF.UiType.LABEL).setText("01.01.1990");
		var loginMatrixRow1_9 = loginMatrixLayout.addNewMatrixLayoutRow();
		loginMatrixRow1_9.addNewMatrixLayoutCell().setNewContent(oFF.UiType.LABEL).setText("Valid to:");
		loginMatrixRow1_9.addNewMatrixLayoutCell().setNewContent(oFF.UiType.LABEL).setText("31.12.9999");
		var loginMatrixRow1_10 = loginMatrixLayout.addNewMatrixLayoutRow();
		loginMatrixRow1_10.addNewMatrixLayoutCell().setNewContent(oFF.UiType.LABEL).setText("Account no.:");
		loginMatrixRow1_10.addNewMatrixLayoutCell().setNewContent(oFF.UiType.LABEL).setText("DXXXXXXX");
		var loginMatrixRow1_11 = loginMatrixLayout.addNewMatrixLayoutRow();
		loginMatrixRow1_11.addNewMatrixLayoutCell().setNewContent(oFF.UiType.LABEL).setText("Cost Center");
		loginMatrixRow1_11.addNewMatrixLayoutCell().setNewContent(oFF.UiType.LABEL).setText("");
		var headerLabel11 = genesis.newControl(oFF.UiType.LABEL);
		headerLabel11.setName("Person");
		headerLabel11.setText("Person");
		headerLabel11.setFontSize(oFF.UiCssLength.createExt(14, oFF.UiCssSizeUnit.PIXEL));
		headerLabel11.setFontWeight(oFF.UiFontWeight.BOLD);
		verticalAddressLayout.addItem(headerLabel11);
		verticalAddressLayout.addItem(genesis.newControl(oFF.UiType.SPACER).setBackgroundColor(oFF.UiColor.GREY).setHeight(oFF.UiCssLength.create("1px")).setWidth(oFF.UiCssLength.create("100%")));
		addrPersonMatrixLayout.setName("addrPersonMatrixLayout");
		var addressPersonMatrixRow1_1 = addrPersonMatrixLayout.addNewMatrixLayoutRow();
		addressPersonMatrixRow1_1.addNewMatrixLayoutCell().setNewContent(oFF.UiType.LABEL).setText("Title:");
		addressPersonMatrixRow1_1.addNewMatrixLayoutCell().setNewContent(oFF.UiType.LABEL).setText("Scientist");
		var addressPersonMatrixRow1_2 = addrPersonMatrixLayout.addNewMatrixLayoutRow();
		addressPersonMatrixRow1_2.addNewMatrixLayoutCell().setNewContent(oFF.UiType.LABEL).setText("Last Name:");
		addressPersonMatrixRow1_2.addNewMatrixLayoutCell().setNewContent(oFF.UiType.LABEL).setText("Einstein");
		var addressPersonMatrixRow1_3 = addrPersonMatrixLayout.addNewMatrixLayoutRow();
		addressPersonMatrixRow1_3.addNewMatrixLayoutCell().setNewContent(oFF.UiType.LABEL).setText("First Name:");
		addressPersonMatrixRow1_3.addNewMatrixLayoutCell().setNewContent(oFF.UiType.LABEL).setText("Albert");
		var addressPersonMatrixRow1_4 = addrPersonMatrixLayout.addNewMatrixLayoutRow();
		addressPersonMatrixRow1_4.addNewMatrixLayoutCell().setNewContent(oFF.UiType.LABEL).setText("Academic Title:");
		addressPersonMatrixRow1_4.addNewMatrixLayoutCell().setNewContent(oFF.UiType.LABEL).setText("Dr.");
		var addressPersonMatrixRow1_5 = addrPersonMatrixLayout.addNewMatrixLayoutRow();
		addressPersonMatrixRow1_5.addNewMatrixLayoutCell().setNewContent(oFF.UiType.LABEL).setText("Full Name:");
		addressPersonMatrixRow1_5.addNewMatrixLayoutCell().setNewContent(oFF.UiType.LABEL).setText("Einstein, Albert");
		var addressPersonMatrixRow1_6 = addrPersonMatrixLayout.addNewMatrixLayoutRow();
		addressPersonMatrixRow1_6.addNewMatrixLayoutCell().setNewContent(oFF.UiType.LABEL).setText("Language:");
		addressPersonMatrixRow1_6.addNewMatrixLayoutCell().setNewContent(oFF.UiType.LABEL).setText("DE");
		verticalAddressLayout.addItem(addrPersonMatrixLayout);
		var headerWorkCenterLabe1_1 = genesis.newControl(oFF.UiType.LABEL);
		headerWorkCenterLabe1_1.setName("WorkCenter");
		headerWorkCenterLabe1_1.setText("Work Center");
		headerWorkCenterLabe1_1.setFontSize(oFF.UiCssLength.createExt(14, oFF.UiCssSizeUnit.PIXEL));
		headerWorkCenterLabe1_1.setFontWeight(oFF.UiFontWeight.BOLD);
		verticalAddressLayout.addItem(genesis.newControl(oFF.UiType.SPACER));
		verticalAddressLayout.addItem(headerWorkCenterLabe1_1);
		verticalAddressLayout.addItem(genesis.newControl(oFF.UiType.SPACER).setBackgroundColor(oFF.UiColor.GREY).setHeight(oFF.UiCssLength.create("1px")).setWidth(oFF.UiCssLength.create("100%")));
		addrWorkCenterMatrixLayout.setName("addrWorkCenterMatrixLayout");
		var addressWorkCenterMatrixRow1_1 = addrWorkCenterMatrixLayout.addNewMatrixLayoutRow();
		addressWorkCenterMatrixRow1_1.addNewMatrixLayoutCell().setNewContent(oFF.UiType.LABEL).setText("Function:");
		addressWorkCenterMatrixRow1_1.addNewMatrixLayoutCell().setNewContent(oFF.UiType.LABEL).setText("Scientist");
		var addressWorkCenterMatrixRow1_2 = addrWorkCenterMatrixLayout.addNewMatrixLayoutRow();
		addressWorkCenterMatrixRow1_2.addNewMatrixLayoutCell().setNewContent(oFF.UiType.LABEL).setText("Department:");
		addressWorkCenterMatrixRow1_2.addNewMatrixLayoutCell().setNewContent(oFF.UiType.LABEL).setText("TI HA PLatf. and OEM Embedding");
		var addressWorkCenterMatrixRow1_3 = addrWorkCenterMatrixLayout.addNewMatrixLayoutRow();
		addressWorkCenterMatrixRow1_3.addNewMatrixLayoutCell().setNewContent(oFF.UiType.LABEL).setText("Room Number:");
		addressWorkCenterMatrixRow1_3.addNewMatrixLayoutCell().setNewContent(oFF.UiType.LABEL).setText("E2.06");
		var addressWorkCenterMatrixRow1_4 = addrWorkCenterMatrixLayout.addNewMatrixLayoutRow();
		addressWorkCenterMatrixRow1_4.addNewMatrixLayoutCell().setNewContent(oFF.UiType.LABEL).setText("Floor:");
		addressWorkCenterMatrixRow1_4.addNewMatrixLayoutCell().setNewContent(oFF.UiType.LABEL).setText("2nd");
		var addressWorkCenterMatrixRow1_5 = addrWorkCenterMatrixLayout.addNewMatrixLayoutRow();
		addressWorkCenterMatrixRow1_5.addNewMatrixLayoutCell().setNewContent(oFF.UiType.LABEL).setText("Building Code:");
		addressWorkCenterMatrixRow1_5.addNewMatrixLayoutCell().setNewContent(oFF.UiType.LABEL).setText("WDF13");
		verticalAddressLayout.addItem(addrWorkCenterMatrixLayout);
		var headerCommuncationLabel1 = genesis.newControl(oFF.UiType.LABEL);
		headerCommuncationLabel1.setName("Communication");
		headerCommuncationLabel1.setText("Communication");
		headerCommuncationLabel1.setFontSize(oFF.UiCssLength.createExt(14, oFF.UiCssSizeUnit.PIXEL));
		headerCommuncationLabel1.setFontWeight(oFF.UiFontWeight.BOLD);
		verticalAddressLayout.addItem(genesis.newControl(oFF.UiType.SPACER));
		verticalAddressLayout.addItem(headerCommuncationLabel1);
		verticalAddressLayout.addItem(genesis.newControl(oFF.UiType.SPACER).setBackgroundColor(oFF.UiColor.GREY).setHeight(oFF.UiCssLength.create("1px")).setWidth(oFF.UiCssLength.create("100%")));
		var addressCommunicationMatrixRow11 = addrCommunicationMatrixLayout.addNewMatrixLayoutRow();
		addressCommunicationMatrixRow11.addNewMatrixLayoutCell().setNewContent(oFF.UiType.LABEL).setText("Telephone:");
		addressCommunicationMatrixRow11.addNewMatrixLayoutCell().setNewContent(oFF.UiType.LABEL).setText("+49 6227 7");
		var addressCommunicationMatrixRow12 = addrCommunicationMatrixLayout.addNewMatrixLayoutRow();
		addressCommunicationMatrixRow12.addNewMatrixLayoutCell().setNewContent(oFF.UiType.LABEL).setText("Extension:");
		addressCommunicationMatrixRow12.addNewMatrixLayoutCell().setNewContent(oFF.UiType.LABEL).setText("47474");
		var addressCommunicationMatrixRow13 = addrCommunicationMatrixLayout.addNewMatrixLayoutRow();
		addressCommunicationMatrixRow13.addNewMatrixLayoutCell().setNewContent(oFF.UiType.LABEL).setText("Cell Phone:");
		addressCommunicationMatrixRow13.addNewMatrixLayoutCell().setNewContent(oFF.UiType.LABEL).setText("+49 169 123456789");
		var addressCommunicationMatrixRow14 = addrCommunicationMatrixLayout.addNewMatrixLayoutRow();
		addressCommunicationMatrixRow14.addNewMatrixLayoutCell().setNewContent(oFF.UiType.LABEL).setText("Fax:");
		addressCommunicationMatrixRow14.addNewMatrixLayoutCell().setNewContent(oFF.UiType.LABEL).setText("+49 78");
		var addressCommunicationMatrixRow15 = addrCommunicationMatrixLayout.addNewMatrixLayoutRow();
		addressCommunicationMatrixRow15.addNewMatrixLayoutCell().setNewContent(oFF.UiType.LABEL).setText("Extension:");
		addressCommunicationMatrixRow15.addNewMatrixLayoutCell().setNewContent(oFF.UiType.LABEL).setText("47474");
		var addressCommunicationMatrixRow16 = addrCommunicationMatrixLayout.addNewMatrixLayoutRow();
		addressCommunicationMatrixRow16.addNewMatrixLayoutCell().setNewContent(oFF.UiType.LABEL).setText("Email Address:");
		addressCommunicationMatrixRow16.addNewMatrixLayoutCell().setNewContent(oFF.UiType.LABEL).setText("albert.einstein@sap.com");
		verticalAddressLayout.addItem(addrCommunicationMatrixLayout);
		var headerCompanyLabel1_1 = genesis.newControl(oFF.UiType.LABEL);
		headerCompanyLabel1_1.setName("Company");
		headerCompanyLabel1_1.setText("Company");
		headerCompanyLabel1_1.setFontSize(oFF.UiCssLength.createExt(14, oFF.UiCssSizeUnit.PIXEL));
		headerCompanyLabel1_1.setFontWeight(oFF.UiFontWeight.BOLD);
		verticalAddressLayout.addItem(genesis.newControl(oFF.UiType.SPACER));
		verticalAddressLayout.addItem(headerCompanyLabel1_1);
		verticalAddressLayout.addItem(genesis.newControl(oFF.UiType.SPACER).setBackgroundColor(oFF.UiColor.GREY).setHeight(oFF.UiCssLength.create("1px")).setWidth(oFF.UiCssLength.create("100%")));
		var addressCompanyMatrixRow2_1 = addrCompanyMatrixLayout.addNewMatrixLayoutRow();
		addressCompanyMatrixRow2_1.addNewMatrixLayoutCell().setNewContent(oFF.UiType.LABEL).setText("Company:");
		addressCompanyMatrixRow2_1.addNewMatrixLayoutCell().setNewContent(oFF.UiType.LABEL).setText("SAP SE");
		verticalAddressLayout.addItem(addrCompanyMatrixLayout);
		defaultMatrixLayout.setName("defaultMatrixLayout");
		var defaultMatrixRow2_1 = defaultMatrixLayout.addNewMatrixLayoutRow();
		defaultMatrixRow2_1.addNewMatrixLayoutCell().setNewContent(oFF.UiType.LABEL).setText("Language:");
		defaultMatrixRow2_1.addNewMatrixLayoutCell().setNewContent(oFF.UiType.LABEL).setText("DE");
		var defaultMatrixRow2_2 = defaultMatrixLayout.addNewMatrixLayoutRow();
		defaultMatrixRow2_2.addNewMatrixLayoutCell().setNewContent(oFF.UiType.LABEL).setText("Data Access Language:");
		defaultMatrixRow2_2.addNewMatrixLayoutCell().setNewContent(oFF.UiType.LABEL).setText("");
		var defaultMatrixRow2_3 = defaultMatrixLayout.addNewMatrixLayoutRow();
		defaultMatrixRow2_3.addNewMatrixLayoutCell().setNewContent(oFF.UiType.LABEL).setText("Date Formatting:");
		defaultMatrixRow2_3.addNewMatrixLayoutCell().setNewContent(oFF.UiType.LABEL).setText("");
		var defaultMatrixRow2_4 = defaultMatrixLayout.addNewMatrixLayoutRow();
		defaultMatrixRow2_4.addNewMatrixLayoutCell().setNewContent(oFF.UiType.LABEL).setText("Time Formatting:");
		defaultMatrixRow2_4.addNewMatrixLayoutCell().setNewContent(oFF.UiType.LABEL).setText("");
		var defaultMatrixRow2_5 = defaultMatrixLayout.addNewMatrixLayoutRow();
		defaultMatrixRow2_5.addNewMatrixLayoutCell().setNewContent(oFF.UiType.LABEL).setText("Number Formatting:");
		defaultMatrixRow2_5.addNewMatrixLayoutCell().setNewContent(oFF.UiType.LABEL).setText("");
		var defaultMatrixRow2_6 = defaultMatrixLayout.addNewMatrixLayoutRow();
		defaultMatrixRow2_6.addNewMatrixLayoutCell().setNewContent(oFF.UiType.LABEL).setText("Scale Formatting:");
		defaultMatrixRow2_6.addNewMatrixLayoutCell().setNewContent(oFF.UiType.LABEL).setText("");
		var defaultMatrixRow2_7 = defaultMatrixLayout.addNewMatrixLayoutRow();
		defaultMatrixRow2_7.addNewMatrixLayoutCell().setNewContent(oFF.UiType.LABEL).setText("Currency Position:");
		defaultMatrixRow2_7.addNewMatrixLayoutCell().setNewContent(oFF.UiType.LABEL).setText("");
		var defaultMatrixRow2_8 = defaultMatrixLayout.addNewMatrixLayoutRow();
		defaultMatrixRow2_8.addNewMatrixLayoutCell().setNewContent(oFF.UiType.LABEL).setText("Default Application:");
		defaultMatrixRow2_8.addNewMatrixLayoutCell().setNewContent(oFF.UiType.LABEL).setText("");
		var defaultMatrixRow2_9 = defaultMatrixLayout.addNewMatrixLayoutRow();
		defaultMatrixRow2_9.addNewMatrixLayoutCell().setNewContent(oFF.UiType.LABEL).setText("Clean up notification:");
		defaultMatrixRow2_9.addNewMatrixLayoutCell().setNewContent(oFF.UiType.LABEL).setText("");
		var defaultMatrixRow2_10 = defaultMatrixLayout.addNewMatrixLayoutRow();
		defaultMatrixRow2_10.addNewMatrixLayoutCell().setNewContent(oFF.UiType.LABEL).setText("Email notification:");
		defaultMatrixRow2_10.addNewMatrixLayoutCell().setNewContent(oFF.UiType.LABEL).setText("");
		var defaultMatrixRow2_11 = defaultMatrixLayout.addNewMatrixLayoutRow();
		defaultMatrixRow2_11.addNewMatrixLayoutCell().setNewContent(oFF.UiType.LABEL).setText("");
		defaultMatrixRow2_11.addNewMatrixLayoutCell().setNewContent(oFF.UiType.LABEL).setText("");
	}
	parameterTable.setTitle("Parameters");
	parameterTable.addNewColumn().setTitle("SET/GET Parameter ID");
	parameterTable.addNewColumn().setTitle("Parameter Value");
	parameterTable.addNewColumn().setTitle("Short Description");
	var parameterTableRow1 = parameterTable.addNewRow();
	parameterTableRow1.addNewCell().setText("");
	var parameterTableRow2 = parameterTable.addNewRow();
	parameterTableRow2.addNewCell().setText("");
	var parameterTableRow3 = parameterTable.addNewRow();
	parameterTableRow3.addNewCell().setText("");
	var parameterTableRow4 = parameterTable.addNewRow();
	parameterTableRow4.addNewCell().setText("");
	var parameterTableRow5 = parameterTable.addNewRow();
	parameterTableRow5.addNewCell().setText("");
	var parameterTableRow6 = parameterTable.addNewRow();
	parameterTableRow6.addNewCell().setText("");
	var parameterTableRow7 = parameterTable.addNewRow();
	parameterTableRow7.addNewCell().setText("");
	var parameterTableRow8 = parameterTable.addNewRow();
	parameterTableRow8.addNewCell().setText("");
	var parameterTableRow9 = parameterTable.addNewRow();
	parameterTableRow9.addNewCell().setText("");
	var parameterTableRow10 = parameterTable.addNewRow();
	parameterTableRow10.addNewCell().setText("");
	rolesTable.setTitle("Role Assignments");
	rolesTable.addNewColumn().setTitle("Status");
	rolesTable.addNewColumn().setTitle("Role");
	rolesTable.addNewColumn().setTitle("Role Type");
	rolesTable.addNewColumn().setTitle("Start Date");
	rolesTable.addNewColumn().setTitle("End Date");
	rolesTable.addNewColumn().setTitle("Short Role Description");
	rolesTable.addNewColumn().setTitle("Indirect Assignment");
	var rolesTableRow1 = rolesTable.addNewRow();
	rolesTableRow1.addNewCell().setText("");
	var rolesTableRow2 = rolesTable.addNewRow();
	rolesTableRow2.addNewCell().setText("");
	var rolesTableRow3 = rolesTable.addNewRow();
	rolesTableRow3.addNewCell().setText("");
	var rolesTableRow4 = rolesTable.addNewRow();
	rolesTableRow4.addNewCell().setText("");
	var rolesTableRow5 = rolesTable.addNewRow();
	rolesTableRow5.addNewCell().setText("");
	var rolesTableRow6 = rolesTable.addNewRow();
	rolesTableRow6.addNewCell().setText("");
	var rolesTableRow7 = rolesTable.addNewRow();
	rolesTableRow7.addNewCell().setText("");
	var rolesTableRow8 = rolesTable.addNewRow();
	rolesTableRow8.addNewCell().setText("");
	var rolesTableRow9 = rolesTable.addNewRow();
	rolesTableRow9.addNewCell().setText("");
	var rolesTableRow10 = rolesTable.addNewRow();
	rolesTableRow10.addNewCell().setText("");
	profilesTable.setTitle("Assigned Authorization Profiles");
	profilesTable.addNewColumn().setTitle("Profile");
	profilesTable.addNewColumn().setTitle("Type");
	profilesTable.addNewColumn().setTitle("Text");
	var profilesTableRow1 = profilesTable.addNewRow();
	profilesTableRow1.addNewCell().setText("");
	var profilesTableRow2 = profilesTable.addNewRow();
	profilesTableRow2.addNewCell().setText("");
	var profilesTableRow3 = profilesTable.addNewRow();
	profilesTableRow3.addNewCell().setText("");
	var profilesTableRow4 = profilesTable.addNewRow();
	profilesTableRow4.addNewCell().setText("");
	var profilesTableRow5 = profilesTable.addNewRow();
	profilesTableRow5.addNewCell().setText("");
	var profilesTableRow6 = profilesTable.addNewRow();
	profilesTableRow6.addNewCell().setText("");
	var profilesTableRow7 = profilesTable.addNewRow();
	profilesTableRow7.addNewCell().setText("");
	var profilesTableRow8 = profilesTable.addNewRow();
	profilesTableRow8.addNewCell().setText("");
	var profilesTableRow9 = profilesTable.addNewRow();
	profilesTableRow9.addNewCell().setText("");
	var profilesTableRow10 = profilesTable.addNewRow();
	profilesTableRow10.addNewCell().setText("");
	groupsTable.setTitle("User Group Assignments");
	groupsTable.addNewColumn().setTitle("User group");
	groupsTable.addNewColumn().setTitle("User Group Description");
	var groupsTableRow1 = groupsTable.addNewRow();
	groupsTableRow1.addNewCell().setText("");
	var groupsTableRow2 = groupsTable.addNewRow();
	groupsTableRow2.addNewCell().setText("");
	var groupsTableRow3 = groupsTable.addNewRow();
	groupsTableRow3.addNewCell().setText("");
	var groupsTableRow4 = groupsTable.addNewRow();
	groupsTableRow4.addNewCell().setText("");
	var groupsTableRow5 = groupsTable.addNewRow();
	groupsTableRow5.addNewCell().setText("");
	var groupsTableRow6 = groupsTable.addNewRow();
	groupsTableRow6.addNewCell().setText("");
	var groupsTableRow7 = groupsTable.addNewRow();
	groupsTableRow7.addNewCell().setText("");
	var groupsTableRow8 = groupsTable.addNewRow();
	groupsTableRow8.addNewCell().setText("");
	var groupsTableRow9 = groupsTable.addNewRow();
	groupsTableRow9.addNewCell().setText("");
	var groupsTableRow10 = groupsTable.addNewRow();
	groupsTableRow10.addNewCell().setText("");
	personalizationTable.setTitle("Personalization");
	personalizationTable.addNewColumn().setTitle("Description");
	personalizationTable.addNewColumn().setTitle("Personalization object key");
	var personalizationTableRow1 = personalizationTable.addNewRow();
	personalizationTableRow1.addNewCell().setText("");
	var personalizationTableRow2 = personalizationTable.addNewRow();
	personalizationTableRow2.addNewCell().setText("");
	var personalizationTableRow3 = personalizationTable.addNewRow();
	personalizationTableRow3.addNewCell().setText("");
	var personalizationTableRow4 = personalizationTable.addNewRow();
	personalizationTableRow4.addNewCell().setText("");
	var personalizationTableRow5 = personalizationTable.addNewRow();
	personalizationTableRow5.addNewCell().setText("");
	var personalizationTableRow6 = personalizationTable.addNewRow();
	personalizationTableRow6.addNewCell().setText("");
	var personalizationTableRow7 = personalizationTable.addNewRow();
	personalizationTableRow7.addNewCell().setText("");
	var personalizationTableRow8 = personalizationTable.addNewRow();
	personalizationTableRow8.addNewCell().setText("");
	var personalizationTableRow9 = personalizationTable.addNewRow();
	personalizationTableRow9.addNewCell().setText("");
	var personalizationTableRow10 = personalizationTable.addNewRow();
	personalizationTableRow10.addNewCell().setText("");
	var userInfoHeaderWrapper = genesis.newControl(oFF.UiType.FLEX_LAYOUT);
	userInfoHeaderWrapper.useMaxSpace();
	userInfoHeaderWrapper.setPadding(oFF.UiCssBoxEdges.create("10px"));
	userInfoHeaderWrapper.addItem(userInfoMatrixLayout);
	verticalLayout.addItem(userInfoHeaderWrapper);
	var defaultTabStrip = genesis.newControl(oFF.UiType.ICON_TAB_BAR);
	defaultTabStrip.setName("defaultTabStrip");
	defaultTabStrip.useMaxWidth();
	defaultTabStrip.setHeight(oFF.UiCssLength.create("400px"));
	var tabStripItem1 = defaultTabStrip.addNewItem();
	tabStripItem1.setName("TabStripItem2");
	tabStripItem1.setText("Logon Data");
	tabStripItem1.setIcon("visits");
	tabStripItem1.setContent(loginMatrixLayout);
	var tabStripItem2 = defaultTabStrip.addNewItem();
	tabStripItem2.setName("TabStripItem2");
	tabStripItem2.setText("Address ");
	tabStripItem2.setIcon("business-card");
	tabStripItem2.setContent(verticalAddressLayout);
	var tabStripItem3 = defaultTabStrip.addNewItem();
	tabStripItem3.setName("TabStripItem2");
	tabStripItem3.setText("Defaults");
	tabStripItem3.setIcon("action-settings");
	tabStripItem3.setContent(defaultMatrixLayout);
	var tabStripItem4 = defaultTabStrip.addNewItem();
	tabStripItem4.setName("TabStripItem2");
	tabStripItem4.setText("Parameters");
	tabStripItem4.setIcon("customize");
	tabStripItem4.setContent(parameterTable);
	var tabStripItem5 = defaultTabStrip.addNewItem();
	tabStripItem5.setName("TabStripItem2");
	tabStripItem5.setText("Roles");
	tabStripItem5.setIcon("role");
	tabStripItem5.setContent(rolesTable);
	var tabStripItem6 = defaultTabStrip.addNewItem();
	tabStripItem6.setName("TabStripItem2");
	tabStripItem6.setText("Profiles");
	tabStripItem6.setIcon("customer");
	tabStripItem6.setContent(profilesTable);
	var tabStripItem7 = defaultTabStrip.addNewItem();
	tabStripItem7.setName("TabStripItem2");
	tabStripItem7.setText("Groups");
	tabStripItem7.setIcon("group");
	tabStripItem7.setContent(groupsTable);
	var tabStripItem8 = defaultTabStrip.addNewItem();
	tabStripItem8.setName("TabStripItem2");
	tabStripItem8.setText("Personalization");
	tabStripItem8.setIcon("account");
	tabStripItem8.setContent(personalizationTable);
	verticalLayout.addItem(defaultTabStrip);
	genesis.setRoot(verticalLayout);
};
oFF.SuUserProfileDialog.prototype.onPress = function(event)
{
	oFF.DfUiProgram.prototype.onPress.call( this , event);
	this.exitNow(0);
};

oFF.Chronos = function() {};
oFF.Chronos.prototype = new oFF.DfUiProgram();
oFF.Chronos.prototype._ff_c = "Chronos";

oFF.Chronos.DEFAULT_PROGRAM_NAME = "Chronos";
oFF.Chronos.prototype.m_buttonMonth = null;
oFF.Chronos.prototype.m_buttonYear = null;
oFF.Chronos.prototype.m_buttonUi5 = null;
oFF.Chronos.prototype.m_dialog = null;
oFF.Chronos.prototype.m_dialogButton = null;
oFF.Chronos.prototype.newProgram = function()
{
	var program = new oFF.Chronos();
	program.setup();
	return program;
};
oFF.Chronos.prototype.buildUi = function(genesis)
{
	oFF.DfUiProgram.prototype.buildUi.call( this , genesis);
	var layout = genesis.newRoot(oFF.UiType.VERTICAL_LAYOUT);
	this.m_buttonMonth = layout.addNewItemOfType(oFF.UiType.BUTTON);
	this.m_buttonMonth.setText("Month Calendar");
	this.m_buttonMonth.setWidth(oFF.UiCssLength.create("100px"));
	this.m_buttonMonth.registerOnPress(this);
	this.m_buttonYear = layout.addNewItemOfType(oFF.UiType.BUTTON);
	this.m_buttonYear.setText("Year Calendar");
	this.m_buttonMonth.setWidth(oFF.UiCssLength.create("100px"));
	this.m_buttonYear.registerOnPress(this);
	this.m_buttonUi5 = layout.addNewItemOfType(oFF.UiType.BUTTON);
	this.m_buttonUi5.setText("UI5 Calendar");
	this.m_buttonUi5.setWidth(oFF.UiCssLength.create("100px"));
	this.m_buttonUi5.registerOnPress(this);
};
oFF.Chronos.prototype.onPress = function(event)
{
	oFF.DfUiProgram.prototype.onPress.call( this , event);
	if (event.getControl() === this.m_dialogButton)
	{
		this.m_dialog.close();
		this.buildUi(this.m_genesis);
	}
	else
	{
		if (event.getControl() === this.m_buttonMonth)
		{
			this.openMonthCalendarDialog();
		}
		else if (event.getControl() === this.m_buttonYear)
		{
			this.m_dialog = this.createYearCalendarDialog();
			this.m_dialog.open();
			this.m_dialogButton = this.m_dialog.addNewDialogButton();
			this.m_dialogButton.setText("Close");
			this.m_dialogButton.registerOnPress(this);
		}
		else if (event.getControl() === this.m_buttonUi5)
		{
			this.m_dialog = this.createUi5Dialog();
			this.m_dialog.open();
			this.m_dialogButton = this.m_dialog.addNewDialogButton();
			this.m_dialogButton.setText("Close");
			this.m_dialogButton.registerOnPress(this);
		}
	}
};
oFF.Chronos.prototype.createUi5Dialog = function()
{
	var calendarDialog = this.m_genesis.newControl(oFF.UiType.DIALOG);
	calendarDialog.setTitle("Calendar");
	calendarDialog.setNewContent(oFF.UiType.CALENDAR);
	return calendarDialog;
};
oFF.Chronos.prototype.openMonthCalendarDialog = function()
{
	var calendarDlgStartCfg = oFF.ProgramStartCfg.create(this.getProcess(), oFF.SuCalendarDialog.DEFAULT_PROGRAM_NAME, null, null);
	calendarDlgStartCfg.setParentProcess(this.getProcess());
	calendarDlgStartCfg.setIsNewConsoleNeeded(true);
	calendarDlgStartCfg.setIsCreatingChildProcess(true);
	calendarDlgStartCfg.processExecution(oFF.SyncType.NON_BLOCKING, null, null);
};
oFF.Chronos.prototype.createYearCalendarDialog = function()
{
	var calendarDialog = this.m_genesis.newControl(oFF.UiType.DIALOG);
	calendarDialog.setTitle("Calendar");
	calendarDialog.setContent(oFF.YearView.create(this.m_genesis, oFF.YearUiModel.create()).getRoot());
	return calendarDialog;
};

oFF.CoronaInfo = function() {};
oFF.CoronaInfo.prototype = new oFF.DfUiProgram();
oFF.CoronaInfo.prototype._ff_c = "CoronaInfo";

oFF.CoronaInfo.GERMANY_ENDPOINT = "https://api.corona-zahlen.org/germany";
oFF.CoronaInfo.REGIONS_ENDPOINT = "https://api.corona-zahlen.org/states";
oFF.CoronaInfo.DEFAULT_PROGRAM_NAME = "Corona";
oFF.CoronaInfo.createRunner = function()
{
	var runner = oFF.KernelBoot.createByName(oFF.CoronaInfo.DEFAULT_PROGRAM_NAME);
	return runner;
};
oFF.CoronaInfo.createNewAthena = function()
{
	var prg = new oFF.CoronaInfo();
	prg.setup();
	return prg;
};
oFF.CoronaInfo.prototype.m_mainLayout = null;
oFF.CoronaInfo.prototype.m_coronaJsonStruct = null;
oFF.CoronaInfo.prototype.m_regionMap = null;
oFF.CoronaInfo.prototype.m_selectedRegion = null;
oFF.CoronaInfo.prototype.newProgram = function()
{
	var prg = new oFF.CoronaInfo();
	prg.setup();
	return prg;
};
oFF.CoronaInfo.prototype.doSetupProgramMetadata = function(metadata)
{
	oFF.DfUiProgram.prototype.doSetupProgramMetadata.call( this , metadata);
};
oFF.CoronaInfo.prototype.evalArguments = function()
{
	oFF.DfUiProgram.prototype.evalArguments.call( this );
};
oFF.CoronaInfo.prototype.initializeProgram = function()
{
	this.setupInternal();
	oFF.DfUiProgram.prototype.initializeProgram.call( this );
};
oFF.CoronaInfo.prototype.releaseObject = function()
{
	oFF.DfUiProgram.prototype.releaseObject.call( this );
};
oFF.CoronaInfo.prototype.getLogSeverity = function()
{
	return oFF.DfUiProgram.prototype.getLogSeverity.call( this );
};
oFF.CoronaInfo.prototype.getDefaultContainerSize = function()
{
	return oFF.UiSize.createByCss("60%", "60%");
};
oFF.CoronaInfo.prototype.isShowMenuBar = function()
{
	return true;
};
oFF.CoronaInfo.prototype.getMenuBarDisplayName = function()
{
	return oFF.CoronaInfo.DEFAULT_PROGRAM_NAME;
};
oFF.CoronaInfo.prototype.setupInternal = function()
{
	this.m_regionMap = oFF.XHashMapOfStringByString.create();
	this.m_regionMap.put("all", "All");
	this.m_regionMap.put("BW", "Baden-W\u00FCrttemberg");
	this.m_regionMap.put("BY", "Bayern");
	this.m_regionMap.put("BE", "Berlin");
	this.m_regionMap.put("BB", "Brandenburg");
	this.m_regionMap.put("HB", "Bremen");
	this.m_regionMap.put("HH", "Hamburg");
	this.m_regionMap.put("HE", "Hessen");
	this.m_regionMap.put("MV", "Mecklenburg-Vorpommern");
	this.m_regionMap.put("NI", "Niedersachsen");
	this.m_regionMap.put("NW", "Nordrhein-Westfalen");
	this.m_regionMap.put("RP", "Rheinland-Pfalz");
	this.m_regionMap.put("SL", "Saarland");
	this.m_regionMap.put("SN", "Sachsen");
	this.m_regionMap.put("ST", "Sachsen-Anhalt");
	this.m_regionMap.put("SH", "Schleswig-Holstein");
	this.m_regionMap.put("TH", "Th\u00FCringen");
	this.m_selectedRegion = "all";
};
oFF.CoronaInfo.prototype.buildUi = function(genesis)
{
	oFF.DfUiProgram.prototype.buildUi.call( this , genesis);
	this.setTitle("Corona");
	this.m_mainLayout = genesis.newControl(oFF.UiType.FLEX_LAYOUT);
	this.m_mainLayout.useMaxSpace();
	this.m_mainLayout.setDirection(oFF.UiFlexDirection.COLUMN);
	this.m_mainLayout.setAlignItems(oFF.UiFlexAlignItems.CENTER);
	this.m_mainLayout.setJustifyContent(oFF.UiFlexJustifyContent.START);
	genesis.setRoot(this.m_mainLayout);
	this.addMenuBarButton("regionToolbarBtn", null, "Region", null, this);
	this.addMenuBarButton("refreshToolbarBtn", null, "Refresh", "refresh", this);
	this.getCoronaData(this.m_selectedRegion);
};
oFF.CoronaInfo.prototype.getCoronaData = function(region)
{
	this.m_mainLayout.clearItems();
	this.m_mainLayout.setJustifyContent(oFF.UiFlexJustifyContent.START);
	this.m_mainLayout.setBusy(true);
	var loadingLbl = this.m_mainLayout.addNewItemOfType(oFF.UiType.LABEL);
	loadingLbl.setText("Loading...");
	loadingLbl.setFontSize(oFF.UiCssLength.create("18px"));
	loadingLbl.setMargin(oFF.UiCssBoxEdges.create("20px"));
	var endpoint = oFF.CoronaInfo.GERMANY_ENDPOINT;
	if (!this.isAllRegion(region))
	{
		endpoint = oFF.CoronaInfo.REGIONS_ENDPOINT;
		if (oFF.XStringUtils.isNotNullAndNotEmpty(this.m_selectedRegion))
		{
			endpoint = oFF.XStringUtils.concatenate3(endpoint, "/", this.m_selectedRegion);
		}
	}
	var endpointUri = oFF.XUri.createFromUrl(endpoint);
	this.log2("Getting corona data from: ", endpointUri.toString());
	var httpClient = oFF.HttpClientFactory.newInstanceByConnection(this.getSession(), endpointUri);
	if (oFF.notNull(httpClient))
	{
		var request = httpClient.getRequest();
		request.setFromUri(endpointUri);
		request.setCorsSecured(false);
		httpClient.processHttpRequest(oFF.SyncType.NON_BLOCKING, this, null);
	}
	else
	{
		this.log("Cannot create connection");
	}
};
oFF.CoronaInfo.prototype.getStructureForSelectedRegion = function()
{
	if (oFF.isNull(this.m_coronaJsonStruct) || this.m_coronaJsonStruct.isEmpty())
	{
		return null;
	}
	if (this.m_coronaJsonStruct.containsKey("error"))
	{
		return this.m_coronaJsonStruct;
	}
	if (this.isAllRegion(this.m_selectedRegion))
	{
		return this.m_coronaJsonStruct;
	}
	var dataStructure = this.m_coronaJsonStruct.getStructureByKey("data");
	if (oFF.notNull(dataStructure))
	{
		var regionStructure = dataStructure.getStructureByKey(this.m_selectedRegion);
		if (oFF.notNull(regionStructure))
		{
			return regionStructure;
		}
	}
	return null;
};
oFF.CoronaInfo.prototype.displayCoronaData = function()
{
	var coronaDataStructure = this.getStructureForSelectedRegion();
	if (oFF.notNull(coronaDataStructure))
	{
		if (coronaDataStructure.containsKey("error"))
		{
			var errorStruct = coronaDataStructure.getStructureByKey("error");
			var errorMsg = this.parseError(errorStruct);
			this.displayError(errorMsg);
		}
		else
		{
			var testLogCases = oFF.XInteger.convertToString(coronaDataStructure.getStructureByKey("delta").getIntegerByKeyExt("cases", 0));
			this.log(testLogCases);
			var casesTotal = coronaDataStructure.getIntegerByKeyExt("cases", 0);
			var recoveredTotal = coronaDataStructure.getIntegerByKeyExt("recovered", 0);
			var deathsTotal = coronaDataStructure.getIntegerByKeyExt("deaths", 0);
			var casesToday = 0;
			var recoveredToday = 0;
			var deathsToday = 0;
			var coronaDelta = coronaDataStructure.getStructureByKey("delta");
			if (oFF.notNull(coronaDelta))
			{
				casesToday = coronaDelta.getIntegerByKeyExt("cases", 0);
				recoveredToday = coronaDelta.getIntegerByKeyExt("recovered", 0);
				deathsToday = coronaDelta.getIntegerByKeyExt("deaths", 0);
			}
			var weekIncidence = coronaDataStructure.getDoubleByKeyExt("weekIncidence", 0);
			var casesPerWeek = coronaDataStructure.getIntegerByKeyExt("casesPerWeek", 0);
			var deathsPerWeek = coronaDataStructure.getIntegerByKeyExt("deathsPerWeek", -1);
			var casesPer100k = coronaDataStructure.getDoubleByKeyExt("casesPer100k", 0);
			var region = coronaDataStructure.getStringByKeyExt("name", "All");
			var lastUpdateStr = "Unknown";
			var source = "";
			if (oFF.notNull(this.m_coronaJsonStruct))
			{
				var coronaMeta = this.m_coronaJsonStruct.getStructureByKey("meta");
				if (oFF.notNull(coronaMeta))
				{
					var tempStr = coronaMeta.getStringByKeyExt("lastCheckedForUpdate", "");
					var lastUpdate = oFF.XDateTime.createDateTimeSafe(tempStr);
					if (oFF.notNull(lastUpdate))
					{
						lastUpdate.setMillisecondOfSecond(0);
						lastUpdateStr = lastUpdate.getDate().getStringRepresentation();
						lastUpdateStr = oFF.XStringUtils.concatenate3(lastUpdateStr, " ", lastUpdate.getTime().getStringRepresentation());
					}
					source = coronaMeta.getStringByKeyExt("source", "");
				}
			}
			this.m_mainLayout.clearItems();
			var coronaInfoLayout = this.m_mainLayout.addNewItemOfType(oFF.UiType.FLEX_LAYOUT);
			coronaInfoLayout.setDirection(oFF.UiFlexDirection.ROW);
			coronaInfoLayout.setAlignItems(oFF.UiFlexAlignItems.CENTER);
			coronaInfoLayout.setWidth(oFF.UiCssLength.create("100%"));
			coronaInfoLayout.setHeight(oFF.UiCssLength.create("45%"));
			coronaInfoLayout.setJustifyContent(oFF.UiFlexJustifyContent.SPACE_AROUND);
			var casesLayout = coronaInfoLayout.addNewItemOfType(oFF.UiType.FLEX_LAYOUT);
			this.insertLargeInfoNumber(casesLayout, "Cases", casesTotal, casesToday);
			var recoveredLayout = coronaInfoLayout.addNewItemOfType(oFF.UiType.FLEX_LAYOUT);
			this.insertLargeInfoNumber(recoveredLayout, "Recovered", recoveredTotal, recoveredToday);
			var deathsLayout = coronaInfoLayout.addNewItemOfType(oFF.UiType.FLEX_LAYOUT);
			this.insertLargeInfoNumber(deathsLayout, "Deaths", deathsTotal, deathsToday);
			var coronaWeekSpacer = this.m_mainLayout.addNewItemOfType(oFF.UiType.FLEX_LAYOUT);
			coronaWeekSpacer.setHeight(oFF.UiCssLength.create("1px"));
			coronaWeekSpacer.setWidth(oFF.UiCssLength.create("100%"));
			coronaWeekSpacer.setBackgroundColor(oFF.UiColor.GREY);
			var weekInfoLayout = this.m_mainLayout.addNewItemOfType(oFF.UiType.FLEX_LAYOUT);
			weekInfoLayout.setDirection(oFF.UiFlexDirection.ROW);
			weekInfoLayout.setAlignItems(oFF.UiFlexAlignItems.CENTER);
			weekInfoLayout.setWidth(oFF.UiCssLength.create("100%"));
			weekInfoLayout.setHeight(oFF.UiCssLength.create("45%"));
			weekInfoLayout.setJustifyContent(oFF.UiFlexJustifyContent.SPACE_AROUND);
			var weekIncidenceLayout = weekInfoLayout.addNewItemOfType(oFF.UiType.FLEX_LAYOUT);
			this.insertNormalInfoNumber(weekIncidenceLayout, "Week Incidence", oFF.XDouble.convertToInt(weekIncidence), 0);
			var casesPerWeekLayout = weekInfoLayout.addNewItemOfType(oFF.UiType.FLEX_LAYOUT);
			this.insertNormalInfoNumber(casesPerWeekLayout, "Cases per week", casesPerWeek, 0);
			if (deathsPerWeek >= 0)
			{
				var deathsPerWeekLayout = weekInfoLayout.addNewItemOfType(oFF.UiType.FLEX_LAYOUT);
				this.insertNormalInfoNumber(deathsPerWeekLayout, "Deaths per week", deathsPerWeek, 0);
			}
			var casesPer100kLayout = weekInfoLayout.addNewItemOfType(oFF.UiType.FLEX_LAYOUT);
			this.insertNormalInfoNumber(casesPer100kLayout, "Cases per 100k", oFF.XDouble.convertToInt(casesPer100k), 0);
			var weekDataSpacer = this.m_mainLayout.addNewItemOfType(oFF.UiType.FLEX_LAYOUT);
			weekDataSpacer.setHeight(oFF.UiCssLength.create("1px"));
			weekDataSpacer.setWidth(oFF.UiCssLength.create("100%"));
			weekDataSpacer.setBackgroundColor(oFF.UiColor.GREY);
			var metaInfoLayout = this.m_mainLayout.addNewItemOfType(oFF.UiType.FLEX_LAYOUT);
			metaInfoLayout.setDirection(oFF.UiFlexDirection.ROW);
			metaInfoLayout.setAlignItems(oFF.UiFlexAlignItems.CENTER);
			metaInfoLayout.setWidth(oFF.UiCssLength.create("100%"));
			metaInfoLayout.setHeight(oFF.UiCssLength.create("10%"));
			metaInfoLayout.setJustifyContent(oFF.UiFlexJustifyContent.SPACE_AROUND);
			var lastUpdateLayout = metaInfoLayout.addNewItemOfType(oFF.UiType.FLEX_LAYOUT);
			this.insertSmallInfoText(lastUpdateLayout, "Last update", lastUpdateStr);
			var countryLayout = metaInfoLayout.addNewItemOfType(oFF.UiType.FLEX_LAYOUT);
			this.insertSmallInfoText(countryLayout, "Country", "Germany");
			var regionLayout = metaInfoLayout.addNewItemOfType(oFF.UiType.FLEX_LAYOUT);
			this.insertSmallInfoText(regionLayout, "Region", region);
			var sourceLayout = metaInfoLayout.addNewItemOfType(oFF.UiType.FLEX_LAYOUT);
			this.insertSmallInfoText(sourceLayout, "Source", source);
		}
	}
	else
	{
		this.displayError("Unknown error occured! Could not retrieve data!");
	}
};
oFF.CoronaInfo.prototype.parseError = function(errorStruct)
{
	var errorMsg = errorStruct.getStringByKeyExt("message", "Unknown error!");
	if (errorStruct.containsKey("rkiError"))
	{
		var rkiErrorStruct = errorStruct.getStructureByKey("rkiError");
		if (rkiErrorStruct.containsKey("details"))
		{
			errorMsg = rkiErrorStruct.getListByKey("details").getStringAtExt(0, errorMsg);
		}
		else
		{
			errorMsg = rkiErrorStruct.getStringByKeyExt("message", errorMsg);
		}
	}
	return errorMsg;
};
oFF.CoronaInfo.prototype.displayError = function(message)
{
	this.log(message);
	this.m_mainLayout.clearItems();
	var errorLbl = this.m_mainLayout.addNewItemOfType(oFF.UiType.LABEL);
	errorLbl.setText("Failed to retrieve the data!");
	errorLbl.setFontSize(oFF.UiCssLength.create("20px"));
	if (oFF.XStringUtils.isNotNullAndNotEmpty(message))
	{
		var messageLbl = this.m_mainLayout.addNewItemOfType(oFF.UiType.LABEL);
		messageLbl.setText(message);
		messageLbl.setFontSize(oFF.UiCssLength.create("18px"));
		messageLbl.setMargin(oFF.UiCssBoxEdges.create("10px"));
		messageLbl.setFontColor(oFF.UiColor.RED);
	}
};
oFF.CoronaInfo.prototype.insertInfoNumber = function(layout, label, total, today, titleSizeCss, totalSizeCss, todaySizeCss)
{
	layout.setDirection(oFF.UiFlexDirection.COLUMN);
	var titleLbl = layout.addNewItemOfType(oFF.UiType.LABEL);
	titleLbl.setText(label);
	titleLbl.setFontSize(oFF.UiCssLength.create(titleSizeCss));
	titleLbl.setFontWeight(oFF.UiFontWeight.BOLD);
	titleLbl.setFontColor(oFF.UiColor.GREY);
	var totalLbl = layout.addNewItemOfType(oFF.UiType.LABEL);
	totalLbl.setText(oFF.XInteger.convertToString(total));
	totalLbl.setFontSize(oFF.UiCssLength.create(totalSizeCss));
	if (today > 0)
	{
		var todayLbl = layout.addNewItemOfType(oFF.UiType.LABEL);
		todayLbl.setText(oFF.XStringUtils.concatenate2("+", oFF.XInteger.convertToString(today)));
		todayLbl.setFontSize(oFF.UiCssLength.create(todaySizeCss));
		todayLbl.setFontColor(oFF.UiColor.RED);
	}
};
oFF.CoronaInfo.prototype.insertLargeInfoNumber = function(layout, label, total, today)
{
	this.insertInfoNumber(layout, label, total, today, "22px", "36px", "18px");
};
oFF.CoronaInfo.prototype.insertNormalInfoNumber = function(layout, label, total, today)
{
	this.insertInfoNumber(layout, label, total, today, "18px", "30px", "14px");
};
oFF.CoronaInfo.prototype.insertInfoText = function(layout, label, text, titleSizeCss, textSizeCss)
{
	layout.setDirection(oFF.UiFlexDirection.COLUMN);
	var titleLbl = layout.addNewItemOfType(oFF.UiType.LABEL);
	titleLbl.setText(label);
	titleLbl.setFontSize(oFF.UiCssLength.create(titleSizeCss));
	titleLbl.setFontWeight(oFF.UiFontWeight.BOLD);
	titleLbl.setFontColor(oFF.UiColor.GREY);
	var textLbl = layout.addNewItemOfType(oFF.UiType.LABEL);
	textLbl.setText(text);
	textLbl.setFontSize(oFF.UiCssLength.create(textSizeCss));
};
oFF.CoronaInfo.prototype.insertSmallInfoText = function(layout, label, text)
{
	this.insertInfoText(layout, label, text, "12px", "18px");
};
oFF.CoronaInfo.prototype.isAllRegion = function(curRegion)
{
	return oFF.XString.isEqual(curRegion, "all");
};
oFF.CoronaInfo.prototype.createRegionToolbarMenu = function(regionBtn)
{
	var regionToolbarMenu = this.m_genesis.newControl(oFF.UiType.MENU);
	regionToolbarMenu.setName("regionToolbarMenu");
	var regionSize = this.m_regionMap.size();
	for (var a = 0; a < regionSize; a++)
	{
		var key = this.m_regionMap.getKeysAsReadOnlyListOfString().get(a);
		var value = this.m_regionMap.getByKey(key);
		var tmpMenuItem = regionToolbarMenu.addNewItem();
		tmpMenuItem.setName(key);
		tmpMenuItem.setTag("regioMenuItem");
		tmpMenuItem.setText(value);
		tmpMenuItem.setSectionStart(oFF.XString.isEqual(key, "all"));
		tmpMenuItem.setIcon(oFF.XString.isEqual(key, this.m_selectedRegion) ? "accept" : "");
		tmpMenuItem.registerOnPress(this);
	}
	regionToolbarMenu.openAt(regionBtn);
};
oFF.CoronaInfo.prototype.onHttpResponse = function(extResult, response, customIdentifier)
{
	this.m_mainLayout.setJustifyContent(oFF.UiFlexJustifyContent.CENTER);
	this.m_mainLayout.setBusy(false);
	if (extResult.isValid())
	{
		var data = extResult.getData();
		if (oFF.notNull(data))
		{
			var jsonContent = data.getJsonContent();
			if (oFF.notNull(jsonContent))
			{
				this.m_coronaJsonStruct = jsonContent.asStructure();
				this.displayCoronaData();
			}
			else
			{
				this.displayError("No json in response!");
			}
		}
		else
		{
			this.displayError("No data available!");
		}
	}
	else
	{
		this.displayError(extResult.getSummary());
	}
};
oFF.CoronaInfo.prototype.onPress = function(event)
{
	oFF.DfUiProgram.prototype.onPress.call( this , event);
	var control = event.getControl();
	var controlParent = control.getParent();
	if (oFF.notNull(controlParent) && controlParent.getUiType() === oFF.UiType.TOOLBAR)
	{
		switch (control.getName())
		{
			case "refreshToolbarBtn":
				this.getCoronaData(this.m_selectedRegion);
				break;

			case "regionToolbarBtn":
				this.createRegionToolbarMenu(control);
				break;

			default:
		}
	}
	if (oFF.notNull(controlParent) && controlParent.getUiType() === oFF.UiType.MENU && oFF.XString.isEqual(controlParent.getName(), "regionToolbarMenu"))
	{
		var region = control.getName();
		if (oFF.XStringUtils.isNotNullAndNotEmpty(region) && this.m_regionMap.containsKey(region))
		{
			this.m_selectedRegion = region;
			this.getCoronaData(region);
		}
		else
		{
			oFF.UiMessageUtils.showWarningToast(this.m_genesis, "Region does not exist!");
		}
	}
};

oFF.WasmDoom1 = function() {};
oFF.WasmDoom1.prototype = new oFF.DfUiProgram();
oFF.WasmDoom1.prototype._ff_c = "WasmDoom1";

oFF.WasmDoom1.DEFAULT_PROGRAM_NAME = "Doom1";
oFF.WasmDoom1.createRunner = function()
{
	var runner = oFF.KernelBoot.createByName(oFF.WasmDoom1.DEFAULT_PROGRAM_NAME);
	return runner;
};
oFF.WasmDoom1.createNewVulcan = function()
{
	var prg = new oFF.WasmDoom1();
	prg.setup();
	return prg;
};
oFF.WasmDoom1.prototype.m_doom1Container = null;
oFF.WasmDoom1.prototype.newProgram = function()
{
	var prg = new oFF.WasmDoom1();
	prg.setup();
	return prg;
};
oFF.WasmDoom1.prototype.doSetupProgramMetadata = function(metadata)
{
	oFF.DfUiProgram.prototype.doSetupProgramMetadata.call( this , metadata);
};
oFF.WasmDoom1.prototype.evalArguments = function()
{
	oFF.DfUiProgram.prototype.evalArguments.call( this );
};
oFF.WasmDoom1.prototype.initializeProgram = function()
{
	oFF.DfUiProgram.prototype.initializeProgram.call( this );
	this.setupInternal();
};
oFF.WasmDoom1.prototype.releaseObject = function()
{
	oFF.DfUiProgram.prototype.releaseObject.call( this );
	this.m_doom1Container = oFF.XObjectExt.release(this.m_doom1Container);
};
oFF.WasmDoom1.prototype.getLogSeverity = function()
{
	return oFF.DfUiProgram.prototype.getLogSeverity.call( this );
};
oFF.WasmDoom1.prototype.isShowMenuBar = function()
{
	return true;
};
oFF.WasmDoom1.prototype.getDefaultContainerSize = function()
{
	return oFF.UiSize.createByCss("60vw", "60vh");
};
oFF.WasmDoom1.prototype.getMenuBarDisplayName = function()
{
	return oFF.WasmDoom1.DEFAULT_PROGRAM_NAME;
};
oFF.WasmDoom1.prototype.setupInternal = function()
{
	this.log("Setting up the doom1 container");
};
oFF.WasmDoom1.prototype.buildUi = function(genesis)
{
	oFF.DfUiProgram.prototype.buildUi.call( this , genesis);
	var doom1ResourcesSrc = oFF.XStringUtils.concatenate2("https://firefly.wdf.s", "ap.corp/resources/doom1/");
	this.m_doom1Container = genesis.newControl(oFF.UiType.WEB_ASSEMBLY);
	this.m_doom1Container.useMaxSpace();
	this.m_doom1Container.setSrc(doom1ResourcesSrc);
	this.m_doom1Container.registerOnError(this);
	genesis.setRoot(this.m_doom1Container);
	this.addMenuBarButton("doom1FullscreenBtn", null, "Fullscreen", "sys-monitor", this);
	this.addMenuBarButton("doom1HelpBtn", null, "Help", "hint", this);
};
oFF.WasmDoom1.prototype.openHelpAlert = function()
{
	var helpAlert = this.m_genesis.newControl(oFF.UiType.ALERT);
	helpAlert.setName("doom1HelpAlert");
	helpAlert.setTitle("Help");
	helpAlert.setText("Doom1 WebAssembly port!");
	helpAlert.open();
};
oFF.WasmDoom1.prototype.onPress = function(event)
{
	oFF.DfUiProgram.prototype.onPress.call( this , event);
	var control = event.getControl();
	var controlParent = control.getParent();
	if (oFF.notNull(controlParent) && controlParent.getUiType() === oFF.UiType.TOOLBAR)
	{
		switch (event.getControl().getName())
		{
			case "doom1HelpBtn":
				this.openHelpAlert();
				break;

			case "doom1FullscreenBtn":
				this.m_doom1Container.fullscreen();
				break;

			default:
		}
	}
};
oFF.WasmDoom1.prototype.onError = function(event)
{
	var msg = event.getParameters().getStringByKeyExt(oFF.UiControlEvent.PARAM_MSG, "Unknown error!");
	oFF.UiMessageUtils.showErrorWithMessage(this.getGenesis(), msg);
};

oFF.FeApollo = function() {};
oFF.FeApollo.prototype = new oFF.DfUiProgram();
oFF.FeApollo.prototype._ff_c = "FeApollo";

oFF.FeApollo.DEFAULT_PROGRAM_NAME = "Apollo";
oFF.FeApollo.PARAM_PATH = "path";
oFF.FeApollo.createRunner = function()
{
	var runner = oFF.KernelBoot.createByName(oFF.FeApollo.DEFAULT_PROGRAM_NAME);
	return runner;
};
oFF.FeApollo.createNewApollo = function()
{
	var prg = new oFF.FeApollo();
	prg.setup();
	return prg;
};
oFF.FeApollo.prototype.m_fileHandler = null;
oFF.FeApollo.prototype.m_directoryManager = null;
oFF.FeApollo.prototype.m_initialPath = null;
oFF.FeApollo.prototype.newProgram = function()
{
	var prg = new oFF.FeApollo();
	prg.setup();
	return prg;
};
oFF.FeApollo.prototype.doSetupProgramMetadata = function(metadata)
{
	oFF.DfUiProgram.prototype.doSetupProgramMetadata.call( this , metadata);
	metadata.addOption(oFF.FeApollo.PARAM_PATH, "Specify the path of the initial location to display", "Path to the working directory ", oFF.XValueType.STRING);
};
oFF.FeApollo.prototype.evalArguments = function()
{
	oFF.DfUiProgram.prototype.evalArguments.call( this );
	var argStruct = this.getArgumentStructure();
	var path = argStruct.getStringByKey(oFF.FeApollo.PARAM_PATH);
	if (oFF.XStringUtils.isNotNullAndNotEmpty(path) === true)
	{
		this.m_initialPath = path;
	}
};
oFF.FeApollo.prototype.initializeProgram = function()
{
	oFF.DfUiProgram.prototype.initializeProgram.call( this );
	this.setupInternal();
};
oFF.FeApollo.prototype.releaseObject = function()
{
	oFF.DfUiProgram.prototype.releaseObject.call( this );
};
oFF.FeApollo.prototype.getLogSeverity = function()
{
	return oFF.Severity.PRINT;
};
oFF.FeApollo.prototype.isShowMenuBar = function()
{
	return true;
};
oFF.FeApollo.prototype.getMenuBarDisplayName = function()
{
	return oFF.FeApollo.DEFAULT_PROGRAM_NAME;
};
oFF.FeApollo.prototype.setupInternal = function()
{
	this.m_directoryManager = oFF.FeApolloDirectoryManager.createDirectoryManager(this.getSession(), this.m_initialPath);
	this.m_fileHandler = oFF.FeApolloFileHandler.createFileHandler(this.getSession());
};
oFF.FeApollo.prototype.buildUi = function(genesis)
{
	oFF.DfUiProgram.prototype.buildUi.call( this , genesis);
	var newFileExplorerView = oFF.FeApolloView.create(this.m_directoryManager, this.m_fileHandler, genesis, this);
	newFileExplorerView.setApolloListener(this);
	genesis.setRoot(newFileExplorerView.getMainLayout());
	this.addMenuBarButton("feMainMenuFileBtn", null, "File", null, newFileExplorerView);
	this.addMenuBarButton("feMainMenuEditBtn", null, "Edit", null, newFileExplorerView);
	this.addMenuBarButton("feMainMenuViewBtn", null, "View", null, newFileExplorerView);
	this.addMenuBarButton("feMainMenuHelpBtn", null, "Help", "hint", newFileExplorerView);
	this.setTitle(this.m_directoryManager.getRootDirectory().getName());
};
oFF.FeApollo.prototype.onApolloFileOpen = function(apolloFile) {};
oFF.FeApollo.prototype.onApolloDirectoryOpen = function(apolloDir)
{
	this.setTitle(apolloDir.getName());
};
oFF.FeApollo.prototype.onApolloMenuBarItemClick = function(itemName)
{
	if (oFF.XString.isEqual(itemName, "apolloToolbarMenuExit"))
	{
		this.exitNow(0);
	}
};
oFF.FeApollo.prototype.onChildFetched = function(extResult, result, fetchedChildren, customIdentifier)
{
	this.log("fetched");
	this.log(result.getHierarchyParentNode().getChildSetState().getName());
};

oFF.FutVulcan = function() {};
oFF.FutVulcan.prototype = new oFF.DfUiProgram();
oFF.FutVulcan.prototype._ff_c = "FutVulcan";

oFF.FutVulcan.DEFAULT_PROGRAM_NAME = "Vulcan";
oFF.FutVulcan.BG_COLOR = "#F7F9FB";
oFF.FutVulcan.TILE_TEXT_COLOR = "#F7F9FB";
oFF.FutVulcan.createRunner = function()
{
	var runner = oFF.KernelBoot.createByName(oFF.FutVulcan.DEFAULT_PROGRAM_NAME);
	return runner;
};
oFF.FutVulcan.createNewVulcan = function()
{
	var prg = new oFF.FutVulcan();
	prg.setup();
	return prg;
};
oFF.FutVulcan.prototype.m_uiControlsView = null;
oFF.FutVulcan.prototype.m_uiPopupsView = null;
oFF.FutVulcan.prototype.m_mainNavigationContainer = null;
oFF.FutVulcan.prototype.newProgram = function()
{
	var prg = new oFF.FutVulcan();
	prg.setup();
	return prg;
};
oFF.FutVulcan.prototype.doSetupProgramMetadata = function(metadata)
{
	oFF.DfUiProgram.prototype.doSetupProgramMetadata.call( this , metadata);
};
oFF.FutVulcan.prototype.evalArguments = function()
{
	oFF.DfUiProgram.prototype.evalArguments.call( this );
};
oFF.FutVulcan.prototype.initializeProgram = function()
{
	oFF.DfUiProgram.prototype.initializeProgram.call( this );
	this.setupInternal();
};
oFF.FutVulcan.prototype.releaseObject = function()
{
	oFF.DfUiProgram.prototype.releaseObject.call( this );
	this.m_uiControlsView = oFF.XObjectExt.release(this.m_uiControlsView);
	this.m_uiPopupsView = oFF.XObjectExt.release(this.m_uiPopupsView);
	this.m_mainNavigationContainer = oFF.XObjectExt.release(this.m_mainNavigationContainer);
};
oFF.FutVulcan.prototype.getLogSeverity = function()
{
	return oFF.DfUiProgram.prototype.getLogSeverity.call( this );
};
oFF.FutVulcan.prototype.isShowMenuBar = function()
{
	return true;
};
oFF.FutVulcan.prototype.getDefaultContainerSize = function()
{
	return oFF.UiSize.createByCss("60vw", "60vh");
};
oFF.FutVulcan.prototype.getMenuBarDisplayName = function()
{
	return oFF.FutVulcan.DEFAULT_PROGRAM_NAME;
};
oFF.FutVulcan.prototype.setupInternal = function()
{
	this.log("Setting up toolkit!");
};
oFF.FutVulcan.prototype.buildUi = function(genesis)
{
	oFF.DfUiProgram.prototype.buildUi.call( this , genesis);
	this.m_mainNavigationContainer = genesis.newControl(oFF.UiType.NAVIGATION_CONTAINER);
	this.m_mainNavigationContainer.useMaxSpace();
	var homePage = this.m_mainNavigationContainer.pushNewPage();
	homePage.useMaxSpace();
	homePage.setShowHeader(false);
	var homePageLayout = homePage.setNewContent(oFF.UiType.FLEX_LAYOUT);
	homePageLayout.setName("futVulcanHomePage");
	homePageLayout.useMaxSpace();
	homePageLayout.setDirection(oFF.UiFlexDirection.ROW);
	homePageLayout.setAlignItems(oFF.UiFlexAlignItems.CENTER);
	homePageLayout.setJustifyContent(oFF.UiFlexJustifyContent.SPACE_AROUND);
	homePageLayout.setWrap(oFF.UiFlexWrap.WRAP);
	homePageLayout.setBackgroundColor(oFF.UiColor.create(oFF.FutVulcan.BG_COLOR));
	this.createViewButtons(homePageLayout);
	genesis.setRoot(this.m_mainNavigationContainer);
	this.addMenuBarButton("futVulcanHelpBtn", null, "Help", "hint", this);
};
oFF.FutVulcan.prototype.createViewButtons = function(parentLayout)
{
	var uiControlsCanvasBtn = this.createCustomTileButton("futVulcanUiControlsBtn", "Ui Controls", "background", oFF.UiColor.create("#FA7445"), oFF.UiColor.create("#EB5121"));
	parentLayout.addItem(uiControlsCanvasBtn);
	var popupsCanvasBtn = this.createCustomTileButton("futVulcanPopupBtn", "Ui Popups", "popup-window", oFF.UiColor.create("#685C88"), oFF.UiColor.create("#B888AC"));
	parentLayout.addItem(popupsCanvasBtn);
};
oFF.FutVulcan.prototype.createCustomTileButton = function(name, text, icon, bgColor, borderColor)
{
	var wrapperCanvasLayout = this.getGenesis().newControl(oFF.UiType.CANVAS_LAYOUT);
	wrapperCanvasLayout.setSize(oFF.UiSize.createByCss("200px", "200px"));
	wrapperCanvasLayout.setBackgroundColor(bgColor);
	if (oFF.notNull(borderColor))
	{
		wrapperCanvasLayout.setBorderStyle(oFF.UiBorderStyle.SOLID);
		wrapperCanvasLayout.setBorderColor(borderColor);
		wrapperCanvasLayout.setBorderWidth(oFF.UiCssBoxEdges.create("1px"));
	}
	var canvasIcon = wrapperCanvasLayout.addNewItemOfType(oFF.UiType.ICON);
	canvasIcon.setIcon(icon);
	canvasIcon.setSize(oFF.UiSize.createByCss("100%", "100px"));
	canvasIcon.setPosition(oFF.UiPosition.createByCss("0px", "30px"));
	canvasIcon.setColor(oFF.UiColor.create(oFF.FutVulcan.TILE_TEXT_COLOR));
	canvasIcon.setEnabled(false);
	var canvasLbl = wrapperCanvasLayout.addNewItemOfType(oFF.UiType.LABEL);
	canvasLbl.setText(text);
	canvasLbl.setSize(oFF.UiSize.createByCss("100%", "50px"));
	canvasLbl.setPosition(oFF.UiPosition.createByCss("0px", "150px"));
	canvasLbl.setWrapping(true);
	canvasLbl.setTextAlign(oFF.UiTextAlign.CENTER);
	canvasLbl.setFontSize(oFF.UiCssLength.create("18px"));
	canvasLbl.setFontColor(oFF.UiColor.create(oFF.FutVulcan.TILE_TEXT_COLOR));
	var canvasTransparentButton = wrapperCanvasLayout.addNewItemOfType(oFF.UiType.BUTTON);
	canvasTransparentButton.setName(name);
	canvasTransparentButton.setText("");
	canvasTransparentButton.setBackgroundColor(oFF.UiColor.create("rgba(0,0,0,0)"));
	canvasTransparentButton.setSize(oFF.UiSize.createByCss("200px", "200px"));
	canvasTransparentButton.setPadding(oFF.UiCssBoxEdges.create("0px"));
	canvasTransparentButton.setPosition(oFF.UiPosition.createByCss("0px", "0px"));
	canvasTransparentButton.registerOnPress(this);
	return wrapperCanvasLayout;
};
oFF.FutVulcan.prototype.openHelpAlert = function()
{
	var helpAlert = this.m_genesis.newControl(oFF.UiType.ALERT);
	helpAlert.setName("futVulcanHelpAlert");
	helpAlert.setTitle("Help");
	helpAlert.setText("Firefly UI Toolit v0.1 alpha!");
	helpAlert.open();
};
oFF.FutVulcan.prototype.onPress = function(event)
{
	oFF.DfUiProgram.prototype.onPress.call( this , event);
	var control = event.getControl();
	var controlParent = control.getParent();
	if (oFF.XString.isEqual("futVulcanUiControlsBtn", control.getName()))
	{
		if (oFF.isNull(this.m_uiControlsView))
		{
			this.m_uiControlsView = oFF.FutVulcanUiControlsView.createUiControlsPageView(this.getGenesis());
		}
		this.m_mainNavigationContainer.pushPage(this.m_uiControlsView.getPage());
	}
	if (oFF.XString.isEqual("futVulcanPopupBtn", control.getName()))
	{
		if (oFF.isNull(this.m_uiPopupsView))
		{
			this.m_uiPopupsView = oFF.FutVulcanUiPopupsView.createUiControlsPageView(this.getGenesis());
		}
		this.m_mainNavigationContainer.pushPage(this.m_uiPopupsView.getPage());
	}
	if (oFF.notNull(controlParent) && controlParent.getUiType() === oFF.UiType.TOOLBAR)
	{
		switch (event.getControl().getName())
		{
			case "futVulcanHelpBtn":
				this.openHelpAlert();
				break;

			default:
		}
	}
};

oFF.SleMetis = function() {};
oFF.SleMetis.prototype = new oFF.DfUiProgram();
oFF.SleMetis.prototype._ff_c = "SleMetis";

oFF.SleMetis.DEFAULT_PROGRAM_NAME = "Metis";
oFF.SleMetis.USER_SPECIFIED_SYSTEMS_KEY = "metis_userSpecifiedSystems";
oFF.SleMetis.METIS_SYSTEM_SEPARATOR = "/.sys./";
oFF.SleMetis.s_userSpecifiedSystems = null;
oFF.SleMetis.createRunner = function()
{
	var runner = oFF.KernelBoot.createByName(oFF.SleMetis.DEFAULT_PROGRAM_NAME);
	return runner;
};
oFF.SleMetis.createNewMetis = function()
{
	var prg = new oFF.SleMetis();
	prg.setup();
	return prg;
};
oFF.SleMetis.initUserSpecifiedSystems = function(application)
{
	oFF.SleMetis.s_userSpecifiedSystems = null;
	if (oFF.isNull(oFF.SleMetis.s_userSpecifiedSystems))
	{
		oFF.SleMetis.s_userSpecifiedSystems = oFF.XList.create();
		var userSpecifiedSystems = application.getUserManager().getUserSettings().getStringByKeyExt(oFF.SleMetis.USER_SPECIFIED_SYSTEMS_KEY, "");
		var serializedSystemDescs = oFF.XStringTokenizer.splitString(userSpecifiedSystems, oFF.SleMetis.METIS_SYSTEM_SEPARATOR);
		if (oFF.notNull(serializedSystemDescs))
		{
			for (var i = 0; i < serializedSystemDescs.size(); i++)
			{
				var serializedSysDesc = serializedSystemDescs.get(i);
				if (oFF.XStringUtils.isNotNullAndNotEmpty(serializedSysDesc))
				{
					var tmpSysProps = oFF.XProperties.create();
					tmpSysProps.deserialize(serializedSysDesc);
					var newSysDesc = oFF.SystemDescription.create(application.getSystemLandscape(), null, tmpSysProps);
					oFF.SleMetis.s_userSpecifiedSystems.add(newSysDesc);
				}
			}
		}
	}
	var systemLandscape = application.getSystemLandscape();
	if (oFF.notNull(systemLandscape))
	{
		for (var j = 0; j < oFF.SleMetis.s_userSpecifiedSystems.size(); j++)
		{
			var systemDesc = oFF.SleMetis.s_userSpecifiedSystems.get(j);
			systemLandscape.setSystemByDescription(systemDesc);
		}
	}
};
oFF.SleMetis.prototype.m_metisImporter = null;
oFF.SleMetis.prototype.m_systemsList = null;
oFF.SleMetis.prototype.m_searchInput = null;
oFF.SleMetis.prototype.m_currentSystemListItems = null;
oFF.SleMetis.prototype.m_formLayout = null;
oFF.SleMetis.prototype.m_formToolbar = null;
oFF.SleMetis.prototype.m_allFormItems = null;
oFF.SleMetis.prototype.m_systemNameFormItem = null;
oFF.SleMetis.prototype.m_systemDescriptionFormItem = null;
oFF.SleMetis.prototype.m_clientFormItem = null;
oFF.SleMetis.prototype.m_urlFormItem = null;
oFF.SleMetis.prototype.m_secureUrlFormItem = null;
oFF.SleMetis.prototype.m_systemTypeFormItem = null;
oFF.SleMetis.prototype.m_tagsFormItem = null;
oFF.SleMetis.prototype.m_timeoutFormItem = null;
oFF.SleMetis.prototype.m_sessionCarrierTypeFormItem = null;
oFF.SleMetis.prototype.m_originFormItem = null;
oFF.SleMetis.prototype.m_tenantIdFormItem = null;
oFF.SleMetis.prototype.m_prefixFormItem = null;
oFF.SleMetis.prototype.m_pathFormItem = null;
oFF.SleMetis.prototype.m_webdispatcherUriFormItem = null;
oFF.SleMetis.prototype.m_authTypeFormItem = null;
oFF.SleMetis.prototype.m_languageFormItem = null;
oFF.SleMetis.prototype.m_userFormItem = null;
oFF.SleMetis.prototype.m_passwordFormItem = null;
oFF.SleMetis.prototype.m_systemLandscape = null;
oFF.SleMetis.prototype.m_isEditMode = false;
oFF.SleMetis.prototype.m_selectedItem = null;
oFF.SleMetis.prototype.newProgram = function()
{
	var prg = new oFF.SleMetis();
	prg.setup();
	return prg;
};
oFF.SleMetis.prototype.doSetupProgramMetadata = function(metadata)
{
	oFF.DfUiProgram.prototype.doSetupProgramMetadata.call( this , metadata);
};
oFF.SleMetis.prototype.evalArguments = function()
{
	oFF.DfUiProgram.prototype.evalArguments.call( this );
};
oFF.SleMetis.prototype.initializeProgram = function()
{
	oFF.DfUiProgram.prototype.initializeProgram.call( this );
	this.setupInternal();
};
oFF.SleMetis.prototype.releaseObject = function()
{
	oFF.DfUiProgram.prototype.releaseObject.call( this );
	this.m_systemLandscape = null;
	this.m_selectedItem = null;
	this.m_metisImporter = oFF.XObjectExt.release(this.m_metisImporter);
	this.m_systemsList = oFF.XObjectExt.release(this.m_systemsList);
	this.m_formLayout = oFF.XObjectExt.release(this.m_formLayout);
	this.m_formToolbar = oFF.XObjectExt.release(this.m_formToolbar);
	this.m_allFormItems.clear();
	this.m_allFormItems = oFF.XObjectExt.release(this.m_allFormItems);
	this.m_systemNameFormItem = oFF.XObjectExt.release(this.m_systemNameFormItem);
	this.m_systemDescriptionFormItem = oFF.XObjectExt.release(this.m_systemDescriptionFormItem);
	this.m_clientFormItem = oFF.XObjectExt.release(this.m_clientFormItem);
	this.m_urlFormItem = oFF.XObjectExt.release(this.m_urlFormItem);
	this.m_secureUrlFormItem = oFF.XObjectExt.release(this.m_secureUrlFormItem);
	this.m_systemTypeFormItem = oFF.XObjectExt.release(this.m_systemTypeFormItem);
	this.m_tagsFormItem = oFF.XObjectExt.release(this.m_tagsFormItem);
	this.m_timeoutFormItem = oFF.XObjectExt.release(this.m_timeoutFormItem);
	this.m_sessionCarrierTypeFormItem = oFF.XObjectExt.release(this.m_sessionCarrierTypeFormItem);
	this.m_originFormItem = oFF.XObjectExt.release(this.m_originFormItem);
	this.m_tenantIdFormItem = oFF.XObjectExt.release(this.m_tenantIdFormItem);
	this.m_prefixFormItem = oFF.XObjectExt.release(this.m_prefixFormItem);
	this.m_pathFormItem = oFF.XObjectExt.release(this.m_pathFormItem);
	this.m_webdispatcherUriFormItem = oFF.XObjectExt.release(this.m_webdispatcherUriFormItem);
	this.m_authTypeFormItem = oFF.XObjectExt.release(this.m_authTypeFormItem);
	this.m_languageFormItem = oFF.XObjectExt.release(this.m_languageFormItem);
	this.m_userFormItem = oFF.XObjectExt.release(this.m_userFormItem);
	this.m_passwordFormItem = oFF.XObjectExt.release(this.m_passwordFormItem);
	this.m_currentSystemListItems.clear();
	this.m_currentSystemListItems = oFF.XObjectExt.release(this.m_currentSystemListItems);
};
oFF.SleMetis.prototype.getLogSeverity = function()
{
	return oFF.Severity.PRINT;
};
oFF.SleMetis.prototype.isShowMenuBar = function()
{
	return true;
};
oFF.SleMetis.prototype.getDefaultContainerSize = function()
{
	return oFF.UiSize.createByCss("60vw", "60vh");
};
oFF.SleMetis.prototype.getMenuBarDisplayName = function()
{
	return oFF.SleMetis.DEFAULT_PROGRAM_NAME;
};
oFF.SleMetis.prototype.setupInternal = function()
{
	this.m_currentSystemListItems = oFF.XList.create();
	this.m_allFormItems = oFF.XList.create();
	this.m_systemLandscape = this.getProcess().getSystemLandscape();
	oFF.SleMetis.initUserSpecifiedSystems(this.getApplication());
};
oFF.SleMetis.prototype.buildUi = function(genesis)
{
	oFF.DfUiProgram.prototype.buildUi.call( this , genesis);
	var mainLayout = genesis.newControl(oFF.UiType.FLEX_LAYOUT);
	mainLayout.setName("sleMetisMainLayout");
	mainLayout.useMaxSpace();
	mainLayout.setDirection(oFF.UiFlexDirection.ROW);
	mainLayout.setAlignItems(oFF.UiFlexAlignItems.CENTER);
	mainLayout.setJustifyContent(oFF.UiFlexJustifyContent.CENTER);
	mainLayout.setWrap(oFF.UiFlexWrap.NO_WRAP);
	mainLayout.setBackgroundColor(oFF.UiColor.create("#f9fafc"));
	var systemListWrapper = mainLayout.addNewItemOfType(oFF.UiType.FLEX_LAYOUT);
	systemListWrapper.setName("sleMetisSystemListWrapper");
	systemListWrapper.setDirection(oFF.UiFlexDirection.COLUMN);
	systemListWrapper.setHeight(oFF.UiCssLength.create("100%"));
	systemListWrapper.setWidth(oFF.UiCssLength.create("300px"));
	systemListWrapper.setFlex("0 1 300px ");
	this.m_searchInput = systemListWrapper.addNewItemOfType(oFF.UiType.SEARCH_FIELD);
	this.m_searchInput.setName("sleMetisSystemListSearchField");
	this.m_searchInput.setPlaceholder("Search system...");
	this.m_searchInput.setPadding(oFF.UiCssBoxEdges.create("5px"));
	this.m_searchInput.setHeight(oFF.UiCssLength.create("40px"));
	this.m_searchInput.registerOnSearch(this);
	this.m_searchInput.registerOnLiveChange(this);
	this.m_searchInput.setDebounceTime(1000);
	this.m_systemsList = systemListWrapper.addNewItemOfType(oFF.UiType.LIST);
	this.m_systemsList.setName("sleMetisSystemList");
	this.m_systemsList.useMaxWidth();
	this.m_systemsList.setHeight(oFF.UiCssLength.create("auto"));
	this.m_systemsList.registerOnSelect(this);
	this.m_systemsList.setSelectionMode(oFF.UiSelectionMode.SINGLE_SELECT_MASTER);
	this.m_systemsList.setBorderWidth(oFF.UiCssBoxEdges.create("0px"));
	var systemListFormSpacer = mainLayout.addNewItemOfType(oFF.UiType.SPACER);
	systemListFormSpacer.setWidth(oFF.UiCssLength.create("1px"));
	systemListFormSpacer.setHeight(oFF.UiCssLength.create("100%"));
	systemListFormSpacer.setBackgroundColor(oFF.UiColor.GREY);
	var formWrapper = mainLayout.addNewItemOfType(oFF.UiType.FLEX_LAYOUT);
	formWrapper.useMaxHeight();
	formWrapper.setWidth(oFF.UiCssLength.create("80%"));
	formWrapper.setFlex("1 1 80%");
	formWrapper.setDirection(oFF.UiFlexDirection.COLUMN);
	this.m_formToolbar = formWrapper.addNewItemOfType(oFF.UiType.TOOLBAR);
	this.m_formToolbar.setHeight(oFF.UiCssLength.create("40px"));
	this.m_formToolbar.setVisible(false);
	var toolbarLayout = this.m_formToolbar.addNewItemOfType(oFF.UiType.FLEX_LAYOUT);
	toolbarLayout.setDirection(oFF.UiFlexDirection.ROW_REVERSE);
	toolbarLayout.setAlignItems(oFF.UiFlexAlignItems.CENTER);
	toolbarLayout.useMaxSpace();
	toolbarLayout.setBackgroundColor(oFF.UiColor.create("rgba(128, 128, 128, 0.15)"));
	var formSaveBtn = toolbarLayout.addNewItemOfType(oFF.UiType.BUTTON);
	formSaveBtn.setName("formSaveBtn");
	formSaveBtn.setButtonType(oFF.UiButtonType.SUCCESS);
	formSaveBtn.setText("Save");
	formSaveBtn.setIcon("save");
	formSaveBtn.registerOnPress(this);
	toolbarLayout.addNewItemOfType(oFF.UiType.SPACER).setWidth(oFF.UiCssLength.create("10px"));
	var formCancelBtn = toolbarLayout.addNewItemOfType(oFF.UiType.BUTTON);
	formCancelBtn.setName("formCancelBtn");
	formCancelBtn.setButtonType(oFF.UiButtonType.DESTRUCTIVE);
	formCancelBtn.setText("Cancel");
	formCancelBtn.setIcon("cancel");
	formCancelBtn.registerOnPress(this);
	this.m_formLayout = formWrapper.addNewItemOfType(oFF.UiType.FLEX_LAYOUT);
	this.m_formLayout.setName("sleMetisFormContainer");
	this.m_formLayout.useMaxHeight();
	this.m_formLayout.setWrap(oFF.UiFlexWrap.WRAP);
	this.m_formLayout.setJustifyContent(oFF.UiFlexJustifyContent.START);
	this.m_formLayout.setAlignItems(oFF.UiFlexAlignItems.START);
	this.m_formLayout.setAlignContent(oFF.UiFlexAlignContent.SPACE_AROUND);
	genesis.setRoot(mainLayout);
	this.addMenuBarButton("sleMetisToolbarEditBtn", null, "Edit", null, this);
	this.addMenuBarButton("sleMetisToolbarToolsBtn", null, "Tools", null, this);
	this.prepareSystemForm();
	this.loadSystems();
	this.updateSystemList();
	this.selectFirstSystemInList();
	this.m_isEditMode = false;
};
oFF.SleMetis.prototype.updateSystemList = function()
{
	var tmpListItems = oFF.XList.create();
	var systemItemsIterator = this.m_currentSystemListItems.getIterator();
	while (systemItemsIterator.hasNext())
	{
		var tmpSystemItem = systemItemsIterator.next();
		tmpListItems.add(tmpSystemItem.getListItem());
	}
	this.m_systemsList.clearItems();
	this.m_systemsList.addAllItems(tmpListItems);
	tmpListItems.clear();
};
oFF.SleMetis.prototype.loadSystems = function()
{
	if (oFF.notNull(this.m_systemsList))
	{
		if (oFF.notNull(this.m_systemLandscape))
		{
			var allSystemNames = this.m_systemLandscape.getSystemNames();
			if (oFF.notNull(allSystemNames) && allSystemNames.hasElements())
			{
				this.m_currentSystemListItems.clear();
				var allSystemNamesIterator = allSystemNames.getIterator();
				while (allSystemNamesIterator.hasNext())
				{
					var systemName = allSystemNamesIterator.next();
					var systemDesc = this.m_systemLandscape.getSystemDescription(systemName);
					var tmpSystemItem = oFF.SleMetisSystemItem.createSystemItem(systemName, this.m_systemsList.newItem(), systemDesc, false);
					this.m_currentSystemListItems.add(tmpSystemItem);
					if (oFF.SleMetis.s_userSpecifiedSystems.contains(systemDesc))
					{
						tmpSystemItem.setIsUserSpecified(true);
					}
				}
			}
		}
	}
};
oFF.SleMetis.prototype.filterSystemList = function(searchText, clearButtonPressed)
{
	if (clearButtonPressed === false)
	{
		this.m_systemsList.clearItems();
		for (var a = 0; a < this.m_currentSystemListItems.size() - 1; a++)
		{
			var tmpSystemItem = this.m_currentSystemListItems.get(a);
			if (oFF.XString.containsString(oFF.XString.toLowerCase(tmpSystemItem.getText()), oFF.XString.toLowerCase(searchText)))
			{
				this.m_systemsList.addItem(tmpSystemItem.getListItem());
			}
		}
	}
	else
	{
		this.updateSystemList();
	}
	if (oFF.notNull(this.m_selectedItem) && this.m_systemsList.getItems().contains(this.m_selectedItem.getListItem()))
	{
		this.m_systemsList.setSelectedItem(this.m_selectedItem.getListItem());
	}
};
oFF.SleMetis.prototype.isSystemListFiltered = function()
{
	if (this.m_systemsList.getItemCount() !== this.m_currentSystemListItems.size() || oFF.XStringUtils.isNotNullAndNotEmpty(this.m_searchInput.getText()))
	{
		return true;
	}
	return false;
};
oFF.SleMetis.prototype.selectFirstSystemInList = function()
{
	if (oFF.notNull(this.m_systemsList) && this.m_systemsList.hasItems())
	{
		var tmpListItem = this.m_systemsList.getItem(0);
		tmpListItem.setSelected(true);
		var systemItem = tmpListItem.getCustomObject();
		this.showSystemDetails(systemItem);
		this.m_selectedItem = systemItem;
	}
};
oFF.SleMetis.prototype.addNewFormElement = function(text, inputType, cssWidth, breakLine)
{
	var newFormItem = oFF.SleMetisFormItem.createFormItem(this.m_formLayout, text, inputType, cssWidth, this);
	if (breakLine === true)
	{
		var breakLineSpacer = this.m_formLayout.addNewItemOfType(oFF.UiType.SPACER);
		breakLineSpacer.setWidth(oFF.UiCssLength.create("100%"));
		breakLineSpacer.setHeight(oFF.UiCssLength.create("0"));
		breakLineSpacer.setFlex("1 1 100%");
	}
	this.m_allFormItems.add(newFormItem);
	return newFormItem;
};
oFF.SleMetis.prototype.prepareSystemForm = function()
{
	if (oFF.notNull(this.m_formLayout))
	{
		this.m_systemNameFormItem = this.addNewFormElement("System name", oFF.UiInputType.TEXT, "200px", false);
		this.m_systemDescriptionFormItem = this.addNewFormElement("Description", oFF.UiInputType.TEXT, "300px", false);
		this.m_systemTypeFormItem = this.addNewFormElement("System type", oFF.UiInputType.TEXT, "100px", true);
		this.m_urlFormItem = this.addNewFormElement("URL", oFF.UiInputType.URL, "270px", false);
		this.m_secureUrlFormItem = this.addNewFormElement("Secure URL", oFF.UiInputType.URL, "270px", false);
		this.m_clientFormItem = this.addNewFormElement("client", oFF.UiInputType.NUMBER, "60px", true);
		this.m_userFormItem = this.addNewFormElement("User", oFF.UiInputType.TEXT, "300px", false);
		this.m_passwordFormItem = this.addNewFormElement("Password", oFF.UiInputType.PASSWORD, "300px", false);
		this.m_authTypeFormItem = this.addNewFormElement("Authentication type", oFF.UiInputType.TEXT, "180px", true);
		this.m_pathFormItem = this.addNewFormElement("Path", oFF.UiInputType.TEXT, "300px", false);
		this.m_webdispatcherUriFormItem = this.addNewFormElement("Webdispatcher URI", oFF.UiInputType.TEXT, "400px", true);
		this.m_languageFormItem = this.addNewFormElement("Language", oFF.UiInputType.TEXT, "100px", false);
		this.m_timeoutFormItem = this.addNewFormElement("Timeout", oFF.UiInputType.NUMBER, "100px", false);
		this.m_sessionCarrierTypeFormItem = this.addNewFormElement("Session carrier type", oFF.UiInputType.TEXT, "300px", false);
		this.m_originFormItem = this.addNewFormElement("Origin", oFF.UiInputType.TEXT, "150px", true);
		this.m_prefixFormItem = this.addNewFormElement("Prefix", oFF.UiInputType.TEXT, "200px", false);
		this.m_tenantIdFormItem = this.addNewFormElement("Tenant ID", oFF.UiInputType.TEXT, "200px", true);
		this.m_tagsFormItem = this.addNewFormElement("Tags", oFF.UiInputType.TEXT, "400px", false);
	}
};
oFF.SleMetis.prototype.showSystemDetails = function(systemItem)
{
	var tmpSystemDescription = systemItem.getSystemDescription();
	if (oFF.notNull(tmpSystemDescription))
	{
		this.m_systemNameFormItem.setText(tmpSystemDescription.getSystemName());
		this.m_systemDescriptionFormItem.setText(tmpSystemDescription.getSystemText());
		this.m_systemTypeFormItem.setText(tmpSystemDescription.getSystemType().getName());
		this.m_urlFormItem.setText(tmpSystemDescription.getProperties().getByKey(oFF.ConnectionParameters.URL));
		this.m_secureUrlFormItem.setText(tmpSystemDescription.getProperties().getByKey(oFF.ConnectionParameters.SECURE));
		this.m_clientFormItem.setText(tmpSystemDescription.getClient());
		this.m_userFormItem.setText(tmpSystemDescription.getUser());
		this.m_passwordFormItem.setText(tmpSystemDescription.getPassword());
		this.m_authTypeFormItem.setText(tmpSystemDescription.getAuthenticationType() !== null ? tmpSystemDescription.getAuthenticationType().getName() : "");
		this.m_pathFormItem.setText(tmpSystemDescription.getPath());
		this.m_webdispatcherUriFormItem.setText(tmpSystemDescription.getWebdispatcherTemplate());
		this.m_languageFormItem.setText(tmpSystemDescription.getLanguage());
		this.m_timeoutFormItem.setText(oFF.XInteger.convertToString(tmpSystemDescription.getTimeout()));
		this.m_sessionCarrierTypeFormItem.setText(tmpSystemDescription.getSessionCarrierType() !== null ? tmpSystemDescription.getSessionCarrierType().getName() : "");
		this.m_originFormItem.setText(tmpSystemDescription.getProperties().getByKey(oFF.ConnectionParameters.ORIGIN));
		var tagsStr = tmpSystemDescription.getTags().toString();
		tagsStr = oFF.XString.replace(tagsStr, "[", "");
		tagsStr = oFF.XString.replace(tagsStr, "]", "");
		this.m_tagsFormItem.setText(tagsStr);
		this.m_prefixFormItem.setText(tmpSystemDescription.getPrefix());
		this.m_tenantIdFormItem.setText(tmpSystemDescription.getTenantId());
	}
	else
	{
		this.m_systemNameFormItem.setText("");
		this.m_systemDescriptionFormItem.setText("");
		this.m_systemTypeFormItem.setText("");
		this.m_urlFormItem.setText("");
		this.m_secureUrlFormItem.setText("");
		this.m_clientFormItem.setText("");
		this.m_userFormItem.setText("");
		this.m_passwordFormItem.setText("");
		this.m_authTypeFormItem.setText("");
		this.m_pathFormItem.setText("");
		this.m_webdispatcherUriFormItem.setText("");
		this.m_languageFormItem.setText("");
		this.m_timeoutFormItem.setText("");
		this.m_sessionCarrierTypeFormItem.setText("");
		this.m_originFormItem.setText("");
		this.m_tagsFormItem.setText("");
		this.m_prefixFormItem.setText("");
		this.m_tenantIdFormItem.setText("");
	}
};
oFF.SleMetis.prototype.setFormItemEditable = function(formItem, editable, required)
{
	formItem.setEditable(editable);
	formItem.setRequired(required ? editable : false);
	if (editable === false)
	{
		formItem.setValid();
	}
};
oFF.SleMetis.prototype.setEditMode = function(editable)
{
	this.m_isEditMode = editable;
	this.setFormItemEditable(this.m_systemNameFormItem, editable, true);
	this.setFormItemEditable(this.m_systemDescriptionFormItem, editable, false);
	this.setFormItemEditable(this.m_systemTypeFormItem, editable, false);
	this.setFormItemEditable(this.m_clientFormItem, editable, false);
	this.setFormItemEditable(this.m_urlFormItem, editable, true);
	this.setFormItemEditable(this.m_secureUrlFormItem, editable, false);
	this.setFormItemEditable(this.m_userFormItem, editable, false);
	this.setFormItemEditable(this.m_passwordFormItem, editable, false);
	this.setFormItemEditable(this.m_authTypeFormItem, editable, true);
	this.setFormItemEditable(this.m_pathFormItem, editable, false);
	this.setFormItemEditable(this.m_webdispatcherUriFormItem, editable, false);
	this.setFormItemEditable(this.m_languageFormItem, editable, false);
	this.setFormItemEditable(this.m_timeoutFormItem, editable, false);
	this.setFormItemEditable(this.m_sessionCarrierTypeFormItem, editable, false);
	this.setFormItemEditable(this.m_originFormItem, editable, false);
	this.setFormItemEditable(this.m_prefixFormItem, editable, false);
	this.setFormItemEditable(this.m_tenantIdFormItem, editable, false);
	this.setFormItemEditable(this.m_tagsFormItem, editable, false);
};
oFF.SleMetis.prototype.isFormEditMode = function()
{
	return this.m_isEditMode;
};
oFF.SleMetis.prototype.validateSystemForm = function()
{
	var isFormValid = true;
	var allFormItems = this.m_allFormItems.getIterator();
	while (allFormItems.hasNext())
	{
		var tmpFormItem = allFormItems.next();
		if (tmpFormItem.isRequired() && oFF.XStringUtils.isNullOrEmpty(tmpFormItem.getText()))
		{
			tmpFormItem.setInvalid();
			isFormValid = false;
		}
		else
		{
			tmpFormItem.setValid();
		}
	}
	if (isFormValid === false)
	{
		this.getGenesis().showErrorToast("Some form entries are invalid! Cannot save!");
		return false;
	}
	var existingSystemDesc = this.m_systemLandscape.getSystemDescription(this.m_systemNameFormItem.getText());
	if (oFF.notNull(existingSystemDesc))
	{
		this.getGenesis().showErrorToast("A system with the specified name already exists in the system landscape!");
		return false;
	}
	return true;
};
oFF.SleMetis.prototype.updateNewSystemNameInList = function(newName)
{
	if (this.isFormEditMode())
	{
		var tmpSystemItem = this.m_currentSystemListItems.get(0);
		tmpSystemItem.setText(newName);
	}
};
oFF.SleMetis.prototype.saveAndCreateNewSystem = function()
{
	var isFormValid = this.validateSystemForm();
	if (isFormValid)
	{
		this.setEditMode(false);
		this.m_formToolbar.setVisible(false);
		var newSystemDescProps = oFF.XProperties.create();
		newSystemDescProps.put(oFF.ConnectionParameters.NAME, this.m_systemNameFormItem.getText());
		newSystemDescProps.put(oFF.ConnectionParameters.DESCRIPTION, this.m_systemDescriptionFormItem.getText());
		newSystemDescProps.put(oFF.ConnectionParameters.SYSTEM_TYPE, this.m_systemTypeFormItem.getText());
		newSystemDescProps.put(oFF.ConnectionParameters.URL, this.m_urlFormItem.getText());
		newSystemDescProps.put(oFF.ConnectionParameters.SECURE, this.m_secureUrlFormItem.getText());
		newSystemDescProps.put(oFF.ConnectionParameters.CLIENT, this.m_clientFormItem.getText());
		newSystemDescProps.put(oFF.ConnectionParameters.USER, this.m_userFormItem.getText());
		newSystemDescProps.put(oFF.ConnectionParameters.PASSWORD, this.m_passwordFormItem.getText());
		newSystemDescProps.put(oFF.ConnectionParameters.AUTHENTICATION_TYPE, this.m_authTypeFormItem.getText());
		newSystemDescProps.put(oFF.ConnectionParameters.PATH, this.m_pathFormItem.getText());
		newSystemDescProps.put(oFF.ConnectionParameters.WEBDISPATCHER_URI, this.m_webdispatcherUriFormItem.getText());
		newSystemDescProps.put(oFF.ConnectionParameters.LANGUAGE, this.m_languageFormItem.getText());
		newSystemDescProps.put(oFF.ConnectionParameters.TIMEOUT, this.m_timeoutFormItem.getText());
		newSystemDescProps.put(oFF.ConnectionParameters.SESSION_CARRIER_TYPE, this.m_sessionCarrierTypeFormItem.getText());
		newSystemDescProps.put(oFF.ConnectionParameters.ORIGIN, this.m_originFormItem.getText());
		newSystemDescProps.put(oFF.ConnectionParameters.PREFIX, this.m_prefixFormItem.getText());
		newSystemDescProps.put(oFF.ConnectionParameters.TENANT_ID, this.m_tenantIdFormItem.getText());
		newSystemDescProps.put(oFF.ConnectionParameters.TAGS, this.m_tagsFormItem.getText());
		var newSysDesc = oFF.SystemDescription.create(this.m_systemLandscape, this.m_systemNameFormItem.getText(), newSystemDescProps);
		this.m_systemLandscape.setSystemByDescription(newSysDesc);
		var tmpSystemItem = this.m_currentSystemListItems.get(0);
		tmpSystemItem.setSystemDescription(newSysDesc);
		tmpSystemItem.setIsUserSpecified(true);
		tmpSystemItem.setIsInEdit(false);
		this.getGenesis().showSuccessToast("New system description successfully created!");
		this.saveSystemInLocalStorage(newSysDesc);
	}
};
oFF.SleMetis.prototype.cancelNewSystemCreate = function()
{
	this.setEditMode(false);
	this.m_formToolbar.setVisible(false);
	this.m_currentSystemListItems.removeAt(0);
	this.updateSystemList();
	this.selectFirstSystemInList();
};
oFF.SleMetis.prototype.createEditMenu = function(editBtn)
{
	var editToolbarMenu = this.m_genesis.newControl(oFF.UiType.MENU);
	editToolbarMenu.setName("editToolbarMenu");
	editToolbarMenu.addNewItem().setName("editToolbarMenuAddBtn").setText("Add").setIcon("add").registerOnPress(this);
	editToolbarMenu.addNewItem().setName("editToolbarMenuImportBtn").setText("Import").setIcon("cause").registerOnPress(this);
	editToolbarMenu.addNewItem().setName("editToolbarMenuClearUserSystemsBtn").setText("Clear user systems").setIcon("delete").registerOnPress(this);
	editToolbarMenu.openAt(editBtn);
};
oFF.SleMetis.prototype.createToolsMenu = function(toolsBtn)
{
	var toolsToolbarMenu = this.m_genesis.newControl(oFF.UiType.MENU);
	toolsToolbarMenu.setName("toolsToolbarMenu");
	toolsToolbarMenu.addNewItem().setName("toolsToolbarMenuConnectBtn").setText("Connection Test").setIcon("connected").registerOnPress(this).setEnabled(!this.isFormEditMode() && oFF.notNull(this.m_selectedItem));
	toolsToolbarMenu.openAt(toolsBtn);
};
oFF.SleMetis.prototype.performAddNewSystem = function()
{
	this.setEditMode(true);
	this.m_formToolbar.setVisible(true);
	var newSystemItem = oFF.SleMetisSystemItem.createSystemItem("new system", this.m_systemsList.newItem(), null, true);
	newSystemItem.setIsInEdit(true);
	this.m_currentSystemListItems.insert(0, newSystemItem);
	this.updateSystemList();
	this.selectFirstSystemInList();
	this.m_systemNameFormItem.focus();
};
oFF.SleMetis.prototype.openMetisImporter = function()
{
	if (oFF.isNull(this.m_metisImporter))
	{
		this.m_metisImporter = oFF.SleMetisImporter.createNewMetisImporter(this.getApplication(), this.m_genesis, this);
	}
	this.m_metisImporter.open();
};
oFF.SleMetis.prototype.performClearUserSystems = function()
{
	this.clearUSerSpecifiedSystemsFromLocalStorage();
	var itemsToRemove = oFF.XList.create();
	var systemItemsIterator = this.m_currentSystemListItems.getIterator();
	while (systemItemsIterator.hasNext())
	{
		var tmpSystemItem = systemItemsIterator.next();
		var tmpListItem = tmpSystemItem.getListItem();
		var tmpSysDesc = tmpSystemItem.getSystemDescription();
		if (tmpSystemItem.isUserSpecified())
		{
			this.m_systemLandscape.removeSystem(tmpSysDesc.getSystemName());
			this.m_systemsList.removeItem(tmpListItem);
			itemsToRemove.add(tmpSystemItem);
		}
	}
	for (var a = 0; a < itemsToRemove.size(); a++)
	{
		this.m_currentSystemListItems.removeElement(itemsToRemove.get(a));
	}
	itemsToRemove.clear();
	this.updateSystemList();
	this.selectFirstSystemInList();
	oFF.SleMetis.s_userSpecifiedSystems.clear();
	this.getGenesis().showInfoToast("User specified systems removed!");
};
oFF.SleMetis.prototype.performConnectionTest = function()
{
	if (oFF.isNull(this.m_selectedItem) && this.m_selectedItem.getSystemDescription() !== null)
	{
		this.getGenesis().showWarningToast("Please select a system!");
	}
	else
	{
		var systemDesc = this.m_selectedItem.getSystemDescription();
		var connectionTestDlgManifest = oFF.ProgramRegistration.getProgramManifest(oFF.SuConnectionTestDialog.DEFAULT_PROGRAM_NAME);
		var connectionTestDlgStartCfg = oFF.ProgramStartCfg.create(this.getProcess(), connectionTestDlgManifest.getName(), null, null);
		var tmpArgs = connectionTestDlgStartCfg.getArguments();
		tmpArgs.putString(oFF.SuConnectionTestDialog.PARAM_SYSTEM, systemDesc.getName());
		connectionTestDlgStartCfg.setIsCreatingChildProcess(true);
		connectionTestDlgStartCfg.processExecution(oFF.SyncType.NON_BLOCKING, null, null);
	}
};
oFF.SleMetis.prototype.saveSystemInLocalStorage = function(sysDesc)
{
	var tempSystemProps = sysDesc.getProperties();
	var serializedSystemDesc = tempSystemProps.serialize();
	var userSpecifiedSystems = this.getApplication().getUserManager().getUserSettings().getStringByKeyExt(oFF.SleMetis.USER_SPECIFIED_SYSTEMS_KEY, "");
	userSpecifiedSystems = oFF.XStringUtils.concatenate3(userSpecifiedSystems, oFF.SleMetis.METIS_SYSTEM_SEPARATOR, serializedSystemDesc);
	this.getApplication().getUserManager().getUserSettings().putString(oFF.SleMetis.USER_SPECIFIED_SYSTEMS_KEY, userSpecifiedSystems);
	oFF.SleMetis.s_userSpecifiedSystems.add(sysDesc);
};
oFF.SleMetis.prototype.clearUSerSpecifiedSystemsFromLocalStorage = function()
{
	this.getApplication().getUserManager().getUserSettings().putString(oFF.SleMetis.USER_SPECIFIED_SYSTEMS_KEY, "");
};
oFF.SleMetis.prototype.onPress = function(event)
{
	oFF.DfUiProgram.prototype.onPress.call( this , event);
	var control = event.getControl();
	var controlParent = control.getParent();
	if (oFF.XString.isEqual(control.getName(), "formCancelBtn"))
	{
		this.cancelNewSystemCreate();
		return;
	}
	else if (oFF.XString.isEqual(control.getName(), "formSaveBtn"))
	{
		this.saveAndCreateNewSystem();
		return;
	}
	if (oFF.notNull(controlParent) && controlParent.getUiType() === oFF.UiType.TOOLBAR)
	{
		switch (control.getName())
		{
			case "sleMetisToolbarEditBtn":
				this.createEditMenu(control);
				break;

			case "sleMetisToolbarToolsBtn":
				this.createToolsMenu(control);
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
					this.performAddNewSystem();
					break;

				case "editToolbarMenuImportBtn":
					this.openMetisImporter();
					break;

				case "editToolbarMenuClearUserSystemsBtn":
					this.performClearUserSystems();
					break;

				default:
			}
		}
		else if (oFF.XString.isEqual(controlParent.getName(), "toolsToolbarMenu"))
		{
			switch (control.getName())
			{
				case "toolsToolbarMenuConnectBtn":
					this.performConnectionTest();
					break;

				default:
			}
		}
	}
};
oFF.SleMetis.prototype.onMetisImportSuccess = function()
{
	this.log("System landscape import success");
	this.loadSystems();
	if (this.isSystemListFiltered())
	{
		this.filterSystemList(this.m_searchInput.getText(), false);
	}
	else
	{
		this.updateSystemList();
	}
};
oFF.SleMetis.prototype.onSelect = function(event)
{
	var selectedListItem = event.getSelectedItem();
	var systemItem = selectedListItem.getCustomObject();
	this.showSystemDetails(systemItem);
	this.m_selectedItem = systemItem;
	if (this.isFormEditMode())
	{
		this.cancelNewSystemCreate();
	}
};
oFF.SleMetis.prototype.onLiveChange = function(event)
{
	var control = event.getControl();
	if (control === this.m_searchInput)
	{
		this.filterSystemList(event.getControl().getText(), false);
	}
};
oFF.SleMetis.prototype.onSearch = function(event)
{
	var didPressClearButton = event.getParameters().getBooleanByKeyExt(oFF.UiControlEvent.PARAM_CLEAR_BUTTON_PRESSED, false);
	var searchText = event.getParameters().getStringByKeyExt(oFF.UiControlEvent.PARAM_SEARCH_TEXT, "");
	this.filterSystemList(searchText, didPressClearButton);
};
oFF.SleMetis.prototype.onMetisFormItemLiveChange = function(formItem)
{
	if (formItem === this.m_systemNameFormItem)
	{
		this.updateNewSystemNameInList(this.m_systemNameFormItem.getText());
		return;
	}
};

oFF.TeAthena = function() {};
oFF.TeAthena.prototype = new oFF.DfUiProgram();
oFF.TeAthena.prototype._ff_c = "TeAthena";

oFF.TeAthena.DEFAULT_PROGRAM_NAME = "Athena";
oFF.TeAthena.MENU_BAR_FILE_BTN = "athenaFileMenubarBtn";
oFF.TeAthena.MENU_BAR_EDIT_BTN = "athenaEditMenubarBtn";
oFF.TeAthena.MENU_BAR_CONTENT_TYPE_BTN = "athenaContentTypeMenubarBtn";
oFF.TeAthena.FILE_MENU_NAME = "athenaFileMenubarMenu";
oFF.TeAthena.FILE_MENU_NEW_NAME = "athenaMenubarMenuNew";
oFF.TeAthena.FILE_MENU_OPEN_NAME = "athenaMenubarMenuOpen";
oFF.TeAthena.FILE_MENU_SAVE_NAME = "athenaMenubarMenuSave";
oFF.TeAthena.FILE_MENU_SAVE_AS_NAME = "athenaMenubarMenuSaveAs";
oFF.TeAthena.EDIT_MENU_NAME = "athenaEditMenubarMenu";
oFF.TeAthena.EDIT_MENU_DISCARD_CHANGES_NAME = "athenaMenubarMenuDiscardChanges";
oFF.TeAthena.CONTENT_TYPE_MENU_NAME = "athenaContentTypeMenubarMenu";
oFF.TeAthena.CONTENT_TYPE_MENU_ITEM_TAG = "athenaContentTypeMenubarMenuItem";
oFF.TeAthena.CODE_TYPES = "abap,abc,actionscript,ada,apache_conf,applescript,asciidoc,assembly_x86,autohotkey,batchfile,bro,c9search,c_cpp,cirru,clojure,cobol,coffee,coldfusion,csharp,css,curly,d,dart,diff,django,dockerfile,dot,drools,eiffel,ejs,elixir,elm,erlang,forth,fortran,ftl,gcode,gherkin,gitignore,glsl,gobstones,golang,groovy,haml,handlebars,haskell,haskell_cabal,haxe,hjson,html,html_elixir,html_ruby,ini,io,jack,jade,java,javascript,json,jsoniq,jsp,jsx,julia,kotlin,latex,lean,less,liquid,lisp,live_script,livescript,logiql,lsl,lua,luapage,lucene,makefile,markdown,mask,matlab,mavens_mate_log,maze,mel,mips_assembler,mipsassembler,mushcode,mysql,nix,nsis,objectivec,ocaml,pascal,perl,pgsql,php,plain_text,powershell,praat,prolog,properties,protobuf,python,r,razor,rdoc,rhtml,rst,ruby,rust,sass,scad,scala,scheme,scss,sh,sjs,smarty,snippets,soy_template,space,sql,sqlserver,stylus,svg,swift,swig,tcl,tex,text,textile,toml,tsx,twig,typescript,vala,vbscript,velocity,verilog,vhdl,wollok,xml,xquery,yaml,terraform,slim,redshift,red,puppet,php_laravel_blade,mixal,jssm,fsharp,edifact,csp,cssound_score,cssound_orchestra,cssound_document";
oFF.TeAthena.PARAM_TYPE = "type";
oFF.TeAthena.createRunner = function()
{
	var runner = oFF.KernelBoot.createByName(oFF.TeAthena.DEFAULT_PROGRAM_NAME);
	return runner;
};
oFF.TeAthena.prototype.m_file = null;
oFF.TeAthena.prototype.m_initialValue = null;
oFF.TeAthena.prototype.m_codeType = null;
oFF.TeAthena.prototype.m_codeEditor = null;
oFF.TeAthena.prototype.m_codeTypes = null;
oFF.TeAthena.prototype.m_isModified = false;
oFF.TeAthena.prototype.newProgram = function()
{
	var prg = new oFF.TeAthena();
	prg.setup();
	return prg;
};
oFF.TeAthena.prototype.doSetupProgramMetadata = function(metadata)
{
	oFF.DfUiProgram.prototype.doSetupProgramMetadata.call( this , metadata);
	metadata.addOption(oFF.DfProgram.PARAM_FILE, "Specify the file to open", "Path to the file ", oFF.XValueType.STRING);
	metadata.addOption(oFF.TeAthena.PARAM_TYPE, "Specify the content type of the file", "The content type as a string ", oFF.XValueType.STRING);
};
oFF.TeAthena.prototype.evalArguments = function()
{
	oFF.DfUiProgram.prototype.evalArguments.call( this );
	var argStruct = this.getArgumentStructure();
	var fileName = argStruct.getStringByKey(oFF.DfProgram.PARAM_FILE);
	if (oFF.XStringUtils.isNotNullAndNotEmpty(fileName))
	{
		this.prepareFileByPath(fileName);
	}
	var contentType = argStruct.getStringByKey(oFF.TeAthena.PARAM_TYPE);
	if (oFF.XStringUtils.isNotNullAndNotEmpty(contentType))
	{
		this.setContentType(contentType);
	}
};
oFF.TeAthena.prototype.initializeProgram = function()
{
	oFF.DfUiProgram.prototype.initializeProgram.call( this );
	this.setupInternal();
};
oFF.TeAthena.prototype.releaseObject = function()
{
	this.m_file = null;
	this.m_codeEditor = oFF.XObjectExt.release(this.m_codeEditor);
	this.m_codeTypes = oFF.XObjectExt.release(this.m_codeTypes);
	oFF.DfUiProgram.prototype.releaseObject.call( this );
};
oFF.TeAthena.prototype.getLogSeverity = function()
{
	return oFF.DfUiProgram.prototype.getLogSeverity.call( this );
};
oFF.TeAthena.prototype.getDefaultContainerSize = function()
{
	return oFF.UiSize.createByCss("60%", "60%");
};
oFF.TeAthena.prototype.isShowMenuBar = function()
{
	return true;
};
oFF.TeAthena.prototype.getMenuBarDisplayName = function()
{
	return oFF.TeAthena.DEFAULT_PROGRAM_NAME;
};
oFF.TeAthena.prototype.canExit = function()
{
	var canExit = true;
	if (this.isModified())
	{
		this.presentExitConfirmPopup("Unsaved changes!", "Your unsaved changes will be lost! Are you sure that you want to exit?");
		canExit = false;
	}
	return canExit;
};
oFF.TeAthena.prototype.setupInternal = function()
{
	this.m_initialValue = "";
	if (oFF.XStringUtils.isNullOrEmpty(this.m_codeType))
	{
		this.setContentType("text");
	}
	this.m_isModified = false;
	this.m_codeTypes = oFF.XStringTokenizer.splitString(oFF.TeAthena.CODE_TYPES, ",");
	this.registerOnProgramContainerClose(this);
};
oFF.TeAthena.prototype.buildUi = function(genesis)
{
	oFF.DfUiProgram.prototype.buildUi.call( this , genesis);
	this.m_codeEditor = genesis.newRoot(oFF.UiType.CODE_EDITOR);
	this.m_codeEditor.useMaxSpace();
	this.m_codeEditor.setCodeType(this.m_codeType);
	this.m_codeEditor.registerOnLiveChange(this);
	this.m_codeEditor.registerOnFileDrop(this);
	this.m_codeEditor.focus();
	this.addMenuBarButton(oFF.TeAthena.MENU_BAR_FILE_BTN, null, "File", null, this);
	this.addMenuBarButton(oFF.TeAthena.MENU_BAR_EDIT_BTN, null, "Edit", null, this);
	this.addMenuBarButton(oFF.TeAthena.MENU_BAR_CONTENT_TYPE_BTN, null, "Content type", null, this);
	if (oFF.notNull(this.m_file))
	{
		this.loadFileContent(this.m_file);
	}
	else
	{
		this.newDocument();
	}
};
oFF.TeAthena.prototype.prepareFileByPath = function(filePath)
{
	if (oFF.notNull(filePath))
	{
		var session = this.getSession();
		var file = oFF.XFile.createExt(session, filePath, oFF.PathFormat.AUTO_DETECT, oFF.VarResolveMode.DOLLAR);
		if (oFF.isNull(file))
		{
			this.log2("Error while loading file: ", filePath);
			return;
		}
		this.setFile(file);
	}
};
oFF.TeAthena.prototype.setContentType = function(type)
{
	this.m_codeType = type;
	if (oFF.notNull(this.m_codeEditor))
	{
		this.m_codeEditor.setCodeType(this.m_codeType);
	}
	this.updateContentTypeParam(type);
};
oFF.TeAthena.prototype.setFile = function(file)
{
	this.m_file = file;
};
oFF.TeAthena.prototype.loadFileContent = function(file)
{
	if (oFF.notNull(file) && oFF.notNull(this.m_codeEditor))
	{
		this.m_codeEditor.setBusy(true);
		file.processLoad(oFF.SyncType.NON_BLOCKING, this, null, oFF.CompressionType.NONE);
	}
};
oFF.TeAthena.prototype.newDocument = function()
{
	if (oFF.notNull(this.m_codeEditor))
	{
		this.m_codeEditor.setText("");
	}
	this.m_initialValue = "";
	this.updateDocumentModifiedState("");
	this.setTitle("untitled");
	this.m_file = oFF.XObjectExt.release(this.m_file);
};
oFF.TeAthena.prototype.openFile = function() {};
oFF.TeAthena.prototype.saveToFile = function(file)
{
	if (oFF.isNull(file))
	{
		this.getGenesis().showErrorToast("Error during file saving!");
		return;
	}
	var editorContent = this.m_codeEditor.getText() !== null ? this.m_codeEditor.getText() : "";
	var fileContent = oFF.XContent.createStringContent(oFF.ContentType.TEXT, editorContent);
	file.processSave(oFF.SyncType.BLOCKING, null, null, fileContent, oFF.CompressionType.NONE);
	if (file.hasErrors())
	{
		this.getGenesis().showErrorToast(file.getSummary());
	}
	else
	{
		this.getGenesis().showSuccessToast(oFF.XStringUtils.concatenate2("Saved at ", file.getVfsUri().getPath()));
		this.m_file = file;
		this.m_initialValue = this.m_codeEditor.getText();
		this.updateDocumentModifiedState(this.m_codeEditor.getText());
		this.updateFileParam(file.getVfsUri().getPath());
		this.setTitle(file.getName());
	}
};
oFF.TeAthena.prototype.saveContentToCurrentFile = function()
{
	if (oFF.notNull(this.m_file))
	{
		this.saveToFile(this.m_file);
	}
	else
	{
		this.getGenesis().showErrorToast("Cannot save, missing file!");
	}
};
oFF.TeAthena.prototype.saveContentAs = function()
{
	var defaultDir = "${ff_sdk}/";
	var generatedFilePath = this.m_codeEditor.getText();
	if (oFF.XString.size(generatedFilePath) > 10)
	{
		generatedFilePath = oFF.XString.substring(generatedFilePath, 0, 9);
		generatedFilePath = oFF.XString.toLowerCase(generatedFilePath);
		generatedFilePath = oFF.XString.replace(generatedFilePath, " ", "_");
	}
	else
	{
		generatedFilePath = "document";
	}
	generatedFilePath = oFF.XStringUtils.concatenate2(generatedFilePath, ".txt");
	generatedFilePath = oFF.XStringUtils.concatenate2(defaultDir, generatedFilePath);
	var newInputPoptup = oFF.UiInputPopup.create(this.getGenesis(), "Save as...", "Please specify the file");
	newInputPoptup.setInputPlaceholder("File path");
	newInputPoptup.setInputValue(generatedFilePath);
	newInputPoptup.setOkButtonText("Save");
	newInputPoptup.setOkButtonIcon("save");
	newInputPoptup.setInputConsumer( function(text){
		if (oFF.XStringUtils.isNotNullAndNotEmpty(text))
		{
			var session = this.getSession();
			var tmpFile = oFF.XFile.createExt(session, text, oFF.PathFormat.AUTO_DETECT, oFF.VarResolveMode.DOLLAR);
			this.saveToFile(tmpFile);
		}
		else
		{
			this.getGenesis().showWarningToast("Cannot save! No file specified!");
		}
	}.bind(this));
	newInputPoptup.open();
	newInputPoptup.selectText(oFF.XString.size(defaultDir), oFF.XString.size(generatedFilePath));
};
oFF.TeAthena.prototype.updateDocumentModifiedState = function(curValue)
{
	var oldModified = this.m_isModified;
	if (oFF.XStringUtils.isNotNullAndNotEmpty(curValue))
	{
		if (oFF.XStringUtils.isNotNullAndNotEmpty(this.m_initialValue))
		{
			if (oFF.XString.isEqual(this.m_initialValue, curValue))
			{
				this.m_isModified = false;
			}
			else
			{
				this.m_isModified = true;
			}
		}
		else
		{
			this.m_isModified = true;
		}
	}
	else if (oFF.XStringUtils.isNullOrEmpty(curValue))
	{
		if (oFF.XStringUtils.isNullOrEmpty(this.m_initialValue))
		{
			this.m_isModified = false;
		}
		else
		{
			this.m_isModified = true;
		}
	}
	if (oldModified !== this.m_isModified)
	{
		this.markDocumentModified();
	}
};
oFF.TeAthena.prototype.markDocumentModified = function()
{
	if (this.m_isModified && !oFF.XString.startsWith(this.getTitle(), "*"))
	{
		var modifiedTitle = oFF.XStringUtils.concatenate2("*", this.getTitle());
		this.setTitle(modifiedTitle);
	}
	else if (!this.m_isModified && oFF.XString.startsWith(this.getTitle(), "*"))
	{
		var defaultTitle = oFF.XString.substring(this.getTitle(), 1, -1);
		this.setTitle(defaultTitle);
	}
};
oFF.TeAthena.prototype.isModified = function()
{
	return this.m_isModified;
};
oFF.TeAthena.prototype.discardDocumentChanges = function()
{
	if (oFF.notNull(this.m_codeEditor))
	{
		this.m_codeEditor.setText(this.m_initialValue);
		this.updateDocumentModifiedState(this.m_codeEditor.getText());
	}
};
oFF.TeAthena.prototype.updateContentTypeParam = function(contentType)
{
	if (oFF.XStringUtils.isNotNullAndNotEmpty(contentType))
	{
		this.getArgumentStructure().putString(oFF.TeAthena.PARAM_TYPE, contentType);
	}
	else
	{
		this.getArgumentStructure().remove(oFF.TeAthena.PARAM_TYPE);
	}
	this.getProcess().notifyProcessEvent(oFF.ProcessEventType.START_CFG_CHANGED);
};
oFF.TeAthena.prototype.createFileMenu = function(fileBtn)
{
	var fileMenu = this.m_genesis.newControl(oFF.UiType.MENU);
	fileMenu.setName(oFF.TeAthena.FILE_MENU_NAME);
	fileMenu.addNewItem().setName(oFF.TeAthena.FILE_MENU_NEW_NAME).setText("New").setIcon("document").registerOnPress(this);
	fileMenu.addNewItem().setName(oFF.TeAthena.FILE_MENU_OPEN_NAME).setText("Open...").setIcon("open-folder").registerOnPress(this).setEnabled(false);
	fileMenu.addNewItem().setName(oFF.TeAthena.FILE_MENU_SAVE_NAME).setText("Save").setIcon("save").registerOnPress(this).setSectionStart(true).setEnabled(oFF.notNull(this.m_file));
	fileMenu.addNewItem().setName(oFF.TeAthena.FILE_MENU_SAVE_AS_NAME).setText("Save as...").setIcon("save").registerOnPress(this);
	fileMenu.openAt(fileBtn);
};
oFF.TeAthena.prototype.createEditMenu = function(editBtn)
{
	var editMenu = this.m_genesis.newControl(oFF.UiType.MENU);
	editMenu.setName(oFF.TeAthena.EDIT_MENU_NAME);
	editMenu.addNewItem().setName(oFF.TeAthena.EDIT_MENU_DISCARD_CHANGES_NAME).setText("Discard changes").setIcon("eraser").registerOnPress(this);
	editMenu.openAt(editBtn);
};
oFF.TeAthena.prototype.createContentTypeMenu = function(contentTypeBtn)
{
	var contentTypeMenu = this.m_genesis.newControl(oFF.UiType.MENU);
	contentTypeMenu.setName(oFF.TeAthena.CONTENT_TYPE_MENU_NAME);
	this.log(this.m_codeType);
	if (oFF.notNull(this.m_codeTypes))
	{
		var codeTypesIterator = this.m_codeTypes.getIterator();
		while (codeTypesIterator.hasNext())
		{
			var tmpCodeType = codeTypesIterator.next();
			contentTypeMenu.addNewItem().setTag(oFF.TeAthena.CONTENT_TYPE_MENU_ITEM_TAG).setText(tmpCodeType).setIcon(oFF.XString.isEqual(tmpCodeType, this.m_codeType) ? "accept" : null).registerOnPress(this);
		}
	}
	contentTypeMenu.openAt(contentTypeBtn);
};
oFF.TeAthena.prototype.onFileLoaded = function(extResult, file, fileContent, customIdentifier)
{
	this.log("File loaded!");
	if (extResult.isValid())
	{
		if (oFF.notNull(fileContent) && oFF.notNull(this.m_codeEditor))
		{
			var stringContent = fileContent.getString();
			this.m_codeEditor.setText(stringContent);
			this.m_initialValue = stringContent;
			this.setTitle(file.getName());
		}
	}
	else
	{
		this.getGenesis().showErrorToast(oFF.XStringUtils.concatenate2("Could not load file! ", extResult.getSummary()));
	}
	this.m_codeEditor.setBusy(false);
};
oFF.TeAthena.prototype.onPress = function(event)
{
	oFF.DfUiProgram.prototype.onPress.call( this , event);
	var control = event.getControl();
	var controlParent = control.getParent();
	if (oFF.notNull(controlParent) && controlParent.getUiType() === oFF.UiType.TOOLBAR)
	{
		switch (control.getName())
		{
			case oFF.TeAthena.MENU_BAR_FILE_BTN:
				this.createFileMenu(control);
				break;

			case oFF.TeAthena.MENU_BAR_EDIT_BTN:
				this.createEditMenu(control);
				break;

			case oFF.TeAthena.MENU_BAR_CONTENT_TYPE_BTN:
				this.createContentTypeMenu(control);
				break;

			default:
		}
	}
	if (oFF.notNull(controlParent) && controlParent.getUiType() === oFF.UiType.MENU && oFF.XString.isEqual(controlParent.getName(), oFF.TeAthena.FILE_MENU_NAME))
	{
		switch (control.getName())
		{
			case oFF.TeAthena.FILE_MENU_NEW_NAME:
				this.newDocument();
				break;

			case oFF.TeAthena.FILE_MENU_OPEN_NAME:
				this.openFile();
				break;

			case oFF.TeAthena.FILE_MENU_SAVE_NAME:
				this.saveContentToCurrentFile();
				break;

			case oFF.TeAthena.FILE_MENU_SAVE_AS_NAME:
				this.saveContentAs();
				break;

			default:
		}
	}
	if (oFF.notNull(controlParent) && controlParent.getUiType() === oFF.UiType.MENU && oFF.XString.isEqual(controlParent.getName(), oFF.TeAthena.EDIT_MENU_NAME))
	{
		switch (control.getName())
		{
			case oFF.TeAthena.EDIT_MENU_DISCARD_CHANGES_NAME:
				this.discardDocumentChanges();
				break;

			default:
		}
	}
	if (oFF.notNull(controlParent) && controlParent.getUiType() === oFF.UiType.MENU && oFF.XString.isEqual(controlParent.getName(), oFF.TeAthena.CONTENT_TYPE_MENU_NAME))
	{
		var tmpItem = control;
		this.setContentType(tmpItem.getText());
	}
};
oFF.TeAthena.prototype.onLiveChange = function(event)
{
	var newValue = event.getParameters().getStringByKeyExt(oFF.UiControlEvent.PARAM_VALUE, null);
	this.updateDocumentModifiedState(newValue);
};
oFF.TeAthena.prototype.onFileDrop = function(event)
{
	var fileContent = event.getParameters().getStringByKeyExt(oFF.UiControlEvent.PARAM_FILE_CONTENT, null);
	if (oFF.XStringUtils.isNotNullAndNotEmpty(fileContent))
	{
		this.m_codeEditor.setText(fileContent);
		this.updateDocumentModifiedState(this.m_codeEditor.getText());
	}
};
oFF.TeAthena.prototype.onProgramContainerClose = function(prgContainer) {};

oFF.SystemUiModule = function() {};
oFF.SystemUiModule.prototype = new oFF.DfModule();
oFF.SystemUiModule.prototype._ff_c = "SystemUiModule";

oFF.SystemUiModule.s_module = null;
oFF.SystemUiModule.getInstance = function()
{
	if (oFF.isNull(oFF.SystemUiModule.s_module))
	{
		oFF.DfModule.checkInitialized(oFF.UiProgramModule.getInstance());
		oFF.SystemUiModule.s_module = oFF.DfModule.startExt(new oFF.SystemUiModule());
		oFF.UiCredentialsFactory.staticSetup();
		oFF.FeApolloFileExtension.staticSetup();
		oFF.ProgramRegistration.setProgramFactory(oFF.FeApollo.DEFAULT_PROGRAM_NAME, new oFF.FeApollo());
		oFF.ProgramRegistration.setProgramFactory(oFF.SleMetis.DEFAULT_PROGRAM_NAME, new oFF.SleMetis());
		oFF.ProgramRegistration.setProgramFactory(oFF.TeAthena.DEFAULT_PROGRAM_NAME, new oFF.TeAthena());
		oFF.ProgramRegistration.setProgramFactory(oFF.FutVulcan.DEFAULT_PROGRAM_NAME, new oFF.FutVulcan());
		oFF.ProgramRegistration.setProgramFactory(oFF.WasmDoom1.DEFAULT_PROGRAM_NAME, new oFF.WasmDoom1());
		oFF.ProgramRegistration.setProgramFactory(oFF.CoronaInfo.DEFAULT_PROGRAM_NAME, new oFF.CoronaInfo());
		oFF.ProgramRegistration.setProgramFactory(oFF.DialogTestProgram.DEFAULT_PROGRAM_NAME, new oFF.DialogTestProgram());
		oFF.ProgramRegistration.setProgramFactory(oFF.SuUserProfileDialog.DEFAULT_PROGRAM_NAME, new oFF.SuUserProfileDialog());
		oFF.ProgramRegistration.setProgramFactory(oFF.SuJavadocDialog.DEFAULT_PROGRAM_NAME, new oFF.SuJavadocDialog());
		oFF.ProgramRegistration.setProgramFactory(oFF.SuCalendarDialog.DEFAULT_PROGRAM_NAME, new oFF.SuCalendarDialog());
		oFF.ProgramRegistration.setProgramFactory(oFF.SuConnectionTestDialog.DEFAULT_PROGRAM_NAME, new oFF.SuConnectionTestDialog());
		oFF.ProgramRegistration.setProgramFactory(oFF.Chronos.DEFAULT_PROGRAM_NAME, new oFF.Chronos());
		oFF.DfModule.stopExt(oFF.SystemUiModule.s_module);
	}
	return oFF.SystemUiModule.s_module;
};
oFF.SystemUiModule.prototype.getName = function()
{
	return "ff3100.system.ui";
};

oFF.SystemUiModule.getInstance();

return sap.firefly;
	} );