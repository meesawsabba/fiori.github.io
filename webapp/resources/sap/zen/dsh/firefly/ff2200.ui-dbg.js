/*!
 * SAPUI5
  (c) Copyright 2009-2021 SAP SE. All rights reserved
 */
/*global sap*/
sap.ui.define(
[
"sap/zen/dsh/firefly/ff1040.kernel.native","sap/zen/dsh/firefly/ff2010.binding"
],
function(oFF)
{
"use strict";

oFF.UiManagerFactory = function() {};
oFF.UiManagerFactory.prototype = new oFF.XObject();
oFF.UiManagerFactory.prototype._ff_c = "UiManagerFactory";

oFF.UiManagerFactory.s_uiManagerFactory = null;
oFF.UiManagerFactory.newInstance = function(process)
{
	if (oFF.isNull(oFF.UiManagerFactory.s_uiManagerFactory))
	{
		return null;
	}
	return oFF.UiManagerFactory.s_uiManagerFactory.newUiManagerInstance(process);
};
oFF.UiManagerFactory.registerFactory = function(factory)
{
	oFF.UiManagerFactory.s_uiManagerFactory = factory;
};

oFF.UiAnalyticalCardFactory = function() {};
oFF.UiAnalyticalCardFactory.prototype = new oFF.XObject();
oFF.UiAnalyticalCardFactory.prototype._ff_c = "UiAnalyticalCardFactory";

oFF.UiAnalyticalCardFactory.prototype.newInstance = function()
{
	return oFF.UiAnalyticalCard.create();
};

oFF.UiFancyButtonFactory = function() {};
oFF.UiFancyButtonFactory.prototype = new oFF.XObject();
oFF.UiFancyButtonFactory.prototype._ff_c = "UiFancyButtonFactory";

oFF.UiFancyButtonFactory.prototype.newInstance = function()
{
	return oFF.UiFancyButton.create();
};

oFF.UiDeviceInfo = function() {};
oFF.UiDeviceInfo.prototype = new oFF.XObject();
oFF.UiDeviceInfo.prototype._ff_c = "UiDeviceInfo";

oFF.UiDeviceInfo.create = function()
{
	var newObj = new oFF.UiDeviceInfo();
	newObj.m_type = oFF.UiDeviceType.UNKNOWN;
	newObj.m_os = oFF.UiDeviceOs.UNKNOWN;
	newObj.m_environment = oFF.UiDeviceEnvironment.UNKNOWN;
	newObj.m_framework = oFF.UiDeviceFramework.UNKNOWN;
	newObj.m_screenHeight = 0;
	newObj.m_screenWidth = 0;
	newObj.m_screenScale = 1;
	newObj.m_maxTouchPoints = 1;
	return newObj;
};
oFF.UiDeviceInfo.createWithInfo = function(deviceType, deviceOs, deviceEnv, deviceFramework, screenHeight, screenWidth, screenScale, maxTouchPoints)
{
	var newObj = new oFF.UiDeviceInfo();
	newObj.m_type = deviceType;
	newObj.m_os = deviceOs;
	newObj.m_environment = deviceEnv;
	newObj.m_framework = deviceFramework;
	newObj.m_screenHeight = screenHeight;
	newObj.m_screenWidth = screenWidth;
	newObj.m_screenScale = screenScale;
	newObj.m_maxTouchPoints = maxTouchPoints;
	return newObj;
};
oFF.UiDeviceInfo.createWithUserAgentAndPlatform = function(userAgent, platform, deviceEnv, deviceFramework, screenHeight, screenWidth, screenScale, maxTouchPoints)
{
	var newObj = new oFF.UiDeviceInfo();
	newObj.m_environment = deviceEnv;
	newObj.m_framework = deviceFramework;
	newObj.m_screenHeight = screenHeight;
	newObj.m_screenWidth = screenWidth;
	newObj.m_screenScale = screenScale;
	newObj.m_maxTouchPoints = maxTouchPoints;
	newObj.m_os = newObj.getDeviceOsFromUserAgentAndPlatform(userAgent, platform);
	newObj.m_type = newObj.getDeviceTypeFromUserAgent(userAgent);
	return newObj;
};
oFF.UiDeviceInfo.createFromString = function(devInfoString)
{
	var newObj = new oFF.UiDeviceInfo();
	var infos = oFF.XStringTokenizer.splitString(devInfoString, oFF.UiRemoteProtocol.MULTI_ITEM_SEPARATOR);
	if (oFF.notNull(infos) && infos.size() > 0)
	{
		newObj.m_type = oFF.UiDeviceType.lookupWithDefault(infos.get(0), oFF.UiDeviceType.UNKNOWN);
		newObj.m_os = oFF.UiDeviceOs.lookupWithDefault(infos.get(1), oFF.UiDeviceOs.UNKNOWN);
		newObj.m_environment = oFF.UiDeviceEnvironment.lookupWithDefault(infos.get(2), oFF.UiDeviceEnvironment.UNKNOWN);
		newObj.m_framework = oFF.UiDeviceFramework.lookupWithDefault(infos.get(3), oFF.UiDeviceFramework.UNKNOWN);
		newObj.m_screenHeight = oFF.XInteger.convertFromStringWithDefault(infos.get(4), 0);
		newObj.m_screenWidth = oFF.XInteger.convertFromStringWithDefault(infos.get(5), 0);
		newObj.m_screenScale = oFF.XDouble.convertFromStringWithDefault(infos.get(6), 1);
		newObj.m_maxTouchPoints = oFF.XInteger.convertFromStringWithDefault(infos.get(7), 1);
	}
	return newObj;
};
oFF.UiDeviceInfo.prototype.m_type = null;
oFF.UiDeviceInfo.prototype.m_os = null;
oFF.UiDeviceInfo.prototype.m_environment = null;
oFF.UiDeviceInfo.prototype.m_framework = null;
oFF.UiDeviceInfo.prototype.m_screenHeight = 0;
oFF.UiDeviceInfo.prototype.m_screenWidth = 0;
oFF.UiDeviceInfo.prototype.m_screenScale = 0.0;
oFF.UiDeviceInfo.prototype.m_maxTouchPoints = 0;
oFF.UiDeviceInfo.prototype.getType = function()
{
	if (oFF.isNull(this.m_type))
	{
		return oFF.UiDeviceType.UNKNOWN;
	}
	return this.m_type;
};
oFF.UiDeviceInfo.prototype.getOs = function()
{
	return this.m_os;
};
oFF.UiDeviceInfo.prototype.getEnvironment = function()
{
	return this.m_environment;
};
oFF.UiDeviceInfo.prototype.getFramework = function()
{
	return this.m_framework;
};
oFF.UiDeviceInfo.prototype.getScreenHeight = function()
{
	return this.m_screenHeight;
};
oFF.UiDeviceInfo.prototype.getScreenWidth = function()
{
	return this.m_screenWidth;
};
oFF.UiDeviceInfo.prototype.getScreenScale = function()
{
	return this.m_screenScale;
};
oFF.UiDeviceInfo.prototype.getMaxTouchPoints = function()
{
	return this.m_maxTouchPoints;
};
oFF.UiDeviceInfo.prototype.getDeviceInfoString = function()
{
	var typeStr = this.getType().getName();
	var osStr = this.getOs().getName();
	var envStr = this.getEnvironment().getName();
	var frameworkStr = this.getFramework().getName();
	var heightStr = oFF.XInteger.convertToString(this.getScreenHeight());
	var widthStr = oFF.XInteger.convertToString(this.getScreenWidth());
	var scaleStr = oFF.XDouble.convertToString(this.getScreenScale());
	var maxTouchPointsStr = oFF.XInteger.convertToString(this.getMaxTouchPoints());
	var deviceInfoStrBuf = oFF.XStringBuffer.create();
	deviceInfoStrBuf.append(typeStr);
	deviceInfoStrBuf.append(oFF.UiRemoteProtocol.MULTI_ITEM_SEPARATOR);
	deviceInfoStrBuf.append(osStr);
	deviceInfoStrBuf.append(oFF.UiRemoteProtocol.MULTI_ITEM_SEPARATOR);
	deviceInfoStrBuf.append(envStr);
	deviceInfoStrBuf.append(oFF.UiRemoteProtocol.MULTI_ITEM_SEPARATOR);
	deviceInfoStrBuf.append(frameworkStr);
	deviceInfoStrBuf.append(oFF.UiRemoteProtocol.MULTI_ITEM_SEPARATOR);
	deviceInfoStrBuf.append(heightStr);
	deviceInfoStrBuf.append(oFF.UiRemoteProtocol.MULTI_ITEM_SEPARATOR);
	deviceInfoStrBuf.append(widthStr);
	deviceInfoStrBuf.append(oFF.UiRemoteProtocol.MULTI_ITEM_SEPARATOR);
	deviceInfoStrBuf.append(scaleStr);
	deviceInfoStrBuf.append(oFF.UiRemoteProtocol.MULTI_ITEM_SEPARATOR);
	deviceInfoStrBuf.append(maxTouchPointsStr);
	return deviceInfoStrBuf.toString();
};
oFF.UiDeviceInfo.prototype.isMobile = function()
{
	if (this.getType().isEqualTo(oFF.UiDeviceType.SMARTPHONE) || this.getType().isEqualTo(oFF.UiDeviceType.TABLET))
	{
		return true;
	}
	return false;
};
oFF.UiDeviceInfo.prototype.isSmartphone = function()
{
	if (this.getType().isEqualTo(oFF.UiDeviceType.SMARTPHONE))
	{
		return true;
	}
	return false;
};
oFF.UiDeviceInfo.prototype.isTablet = function()
{
	if (this.getType().isEqualTo(oFF.UiDeviceType.TABLET))
	{
		return true;
	}
	return false;
};
oFF.UiDeviceInfo.prototype.isIPhone = function()
{
	if (this.getType().isEqualTo(oFF.UiDeviceType.SMARTPHONE) && this.getOs().isEqualTo(oFF.UiDeviceOs.IOS))
	{
		return true;
	}
	return false;
};
oFF.UiDeviceInfo.prototype.isIPad = function()
{
	if (this.getType().isEqualTo(oFF.UiDeviceType.TABLET) && this.getOs().isEqualTo(oFF.UiDeviceOs.IOS))
	{
		return true;
	}
	return false;
};
oFF.UiDeviceInfo.prototype.isIOs = function()
{
	if (this.getOs().isEqualTo(oFF.UiDeviceOs.IOS))
	{
		return true;
	}
	return false;
};
oFF.UiDeviceInfo.prototype.getDeviceTypeFromUserAgent = function(userAgent)
{
	var userAgentLower = oFF.XString.toLowerCase(userAgent);
	var tmpDeviceType = oFF.UiDeviceType.UNKNOWN;
	var tabletRegex = "(ipad|tablet(?! pc )|(android(?!.*mobile))|kindle|playbook|silk|(puffin(?!.*(ip|ap|wp))))";
	var mobileRegex = "android|webos|iphone|ipod|iemobile|opera mini";
	var isTablet = oFF.XString.match(userAgentLower, tabletRegex);
	var isiPadSafariInDesktopMode = oFF.XString.match(userAgentLower, "(ipad)") || this.getOs() === oFF.UiDeviceOs.MACOS && this.getMaxTouchPoints() > 1;
	var isMobile = oFF.XString.match(userAgentLower, mobileRegex);
	if (isTablet || isiPadSafariInDesktopMode)
	{
		tmpDeviceType = oFF.UiDeviceType.TABLET;
	}
	else if (isMobile)
	{
		tmpDeviceType = oFF.UiDeviceType.SMARTPHONE;
	}
	else
	{
		tmpDeviceType = oFF.UiDeviceType.DESKTOP;
	}
	return tmpDeviceType;
};
oFF.UiDeviceInfo.prototype.getDeviceOsFromUserAgentAndPlatform = function(userAgent, platform)
{
	var userAgentLower = oFF.XString.toLowerCase(userAgent);
	var tmpOs = oFF.UiDeviceOs.UNKNOWN;
	var macosPlatforms = oFF.XListOfString.create();
	macosPlatforms.add("Macintosh");
	macosPlatforms.add("MacIntel");
	macosPlatforms.add("MacPPC");
	macosPlatforms.add("Mac68K");
	var windowsPlatforms = oFF.XListOfString.create();
	windowsPlatforms.add("Win32");
	windowsPlatforms.add("Win64");
	windowsPlatforms.add("Windows");
	windowsPlatforms.add("WinCE");
	var iosPlatforms = oFF.XListOfString.create();
	iosPlatforms.add("iPhone");
	iosPlatforms.add("iPad");
	iosPlatforms.add("iPod");
	if (macosPlatforms.contains(platform))
	{
		tmpOs = oFF.UiDeviceOs.MACOS;
	}
	else if (iosPlatforms.contains(platform))
	{
		tmpOs = oFF.UiDeviceOs.IOS;
	}
	else if (windowsPlatforms.contains(platform))
	{
		tmpOs = oFF.UiDeviceOs.WINDOWS;
	}
	else if (oFF.XString.match(userAgentLower, "Android"))
	{
		tmpOs = oFF.UiDeviceOs.ANDROID;
	}
	else if (oFF.XString.match(userAgentLower, "Linux"))
	{
		tmpOs = oFF.UiDeviceOs.LINUX;
	}
	return tmpOs;
};

oFF.UiAppDialogFactory = function() {};
oFF.UiAppDialogFactory.prototype = new oFF.XObject();
oFF.UiAppDialogFactory.prototype._ff_c = "UiAppDialogFactory";

oFF.UiAppDialogFactory.s_factories = null;
oFF.UiAppDialogFactory.staticSetup = function()
{
	oFF.UiAppDialogFactory.s_factories = oFF.XHashMapByString.create();
};
oFF.UiAppDialogFactory.registerFactory = function(name, factory)
{
	oFF.UiAppDialogFactory.s_factories.put(name, factory);
};
oFF.UiAppDialogFactory.create = function(uiManager, name)
{
	var theFactory = oFF.UiAppDialogFactory.s_factories.getByKey(name);
	var dialog = null;
	if (oFF.notNull(theFactory))
	{
		dialog = theFactory.newAppDialog(uiManager, name);
	}
	return dialog;
};

oFF.UiAttributes = {

	NAME:"name",
	TEXT:"text",
	WIDTH_IN_PIXEL:"widthPx",
	COLUMNS:"columns",
	ROWS:"rows",
	ROW_CELLS:"rowCells",
	COLUMN_NAME:"column"
};

oFF.UiConstants = {

	QSA_CTYPE:"CType",
	QSA_BINDING:"Binding",
	QSA_BINDINGS:"Bindings",
	QSA_CONTENT:"Content",
	QSA_CACHE_ID:"CacheId",
	QSA_DATA_PROVIDER:"DataProvider",
	QSA_DATA_PROVIDERS:"DataProviders",
	QSA_DATA_SOURCE:"DataSource",
	QSA_ENDPOINT:"Endpoint",
	QSA_GLOBAL_OBJECTS:"GlobalObjects",
	QSA_GLOBAL_OBJECTS_CALCULATIONS:"Calculations",
	QSA_GLOBAL_OBJECTS_CALCULATION_VARIABLES:"CalculationVariables",
	QSA_GLOBAL_OBJECTS_FIELD_SELECTIONS:"FieldSelections",
	QSA_GLOBAL_OBJECTS_PAGE_FILTERS:"PageFilters",
	QSA_GLOBAL_OBJECTS_STORY_FILTERS:"StoryFilters",
	QSA_DOLLAR:"$",
	QSA_DOLLAR_D:"$d",
	QSA_FF_QUERY:"ffQuery",
	QSA_GLOBAL_DEF:"GlobalDef",
	QSA_GLOBAL_DEFS:"GlobalDefs",
	QSA_FLOATING_CONTROLS:"FloatingControls",
	QSA_ID:"Id",
	QSA_SUPPORTED_PLATFORMS:"SupportedPlatforms",
	QSA_MASTER_SYSTEM:"MasterSystem",
	QSA_MAX_SHARED_CONNECTIONS:"MaxSharedConnections",
	QSA_NAME:"Name",
	QSA_SELECTED_NAME:"SelectedName",
	QSA_PERCENT:"%",
	QSA_RESOURCE_REF:"ResourceRef",
	QSA_SOURCE:"Source",
	QSA_STYLE:"Style",
	QSA_SYSTEM:"System",
	QSA_MODE:"Mode",
	QSA_TYPE:"Type",
	QSA_TARGET:"Target",
	QSA_VIZ_DEF:"VizDef",
	QSA_TEMPLATE_STRATEGY:"TemplateStrategy",
	VQS_TEMPLATE_STRATEGY_SEPARATE_ITEM:"SeparateItems",
	QSA_TEMPLATE_NAME:"TemplateName",
	QSA_CUSTOM_CONTROL:"CustomControl",
	VARIABLES:"Variables",
	staticSetup:function() {}
};

oFF.UiControlEvent = function() {};
oFF.UiControlEvent.prototype = new oFF.XObject();
oFF.UiControlEvent.prototype._ff_c = "UiControlEvent";

oFF.UiControlEvent.PARAM_KEY_CODE = "keyCode";
oFF.UiControlEvent.PARAM_COMMAND = "command";
oFF.UiControlEvent.PARAM_FIRST_VISIBLE_ROW_NAME = "firstVisibleRowName";
oFF.UiControlEvent.PARAM_PASTED_DATA = "pastedData";
oFF.UiControlEvent.PARAM_SEARCH_TEXT = "searchText";
oFF.UiControlEvent.PARAM_CLEAR_BUTTON_PRESSED = "clearButtonPressed";
oFF.UiControlEvent.PARAM_CLICK_X = "clickX";
oFF.UiControlEvent.PARAM_CLICK_Y = "clickY";
oFF.UiControlEvent.PARAM_VALUE = "value";
oFF.UiControlEvent.PARAM_PRESSED_BUTTON_TYPE = "pressedButtonType";
oFF.UiControlEvent.PARAM_MSG = "msg";
oFF.UiControlEvent.PARAM_CELL = "cell";
oFF.UiControlEvent.PARAM_COLUMN = "column";
oFF.UiControlEvent.PARAM_ROW = "row";
oFF.UiControlEvent.PARAM_SELECTED_CELL = "selectedCell";
oFF.UiControlEvent.PARAM_SELECTION_AREA = "selectionArea";
oFF.UiControlEvent.PARAM_IS_TITLE = "isTitle";
oFF.UiControlEvent.PARAM_SOURCE_ROW = "sourceRow";
oFF.UiControlEvent.PARAM_SOURCE_COLUMN = "sourceColumn";
oFF.UiControlEvent.PARAM_TARGET_ROW = "targetRow";
oFF.UiControlEvent.PARAM_TARGET_COLUMN = "targetColumn";
oFF.UiControlEvent.PARAM_BEFORE_CELL = "beforeCell";
oFF.UiControlEvent.PARAM_LINE = "line";
oFF.UiControlEvent.PARAM_FILE_NAME = "fileName";
oFF.UiControlEvent.PARAM_FILE_TYPE = "fileType";
oFF.UiControlEvent.PARAM_FILE_CONTENT = "fileContent";
oFF.UiControlEvent.PARAM_FILE_SIZE = "fileSize";
oFF.UiControlEvent.PARAM_FILE_LAST_MODIFIED = "fileLastModified";
oFF.UiControlEvent.PARAM_SCROLL_TOP = "scrollTop";
oFF.UiControlEvent.create = function(control, parameters)
{
	var newObject = new oFF.UiControlEvent();
	newObject.setupEvent(control, parameters);
	return newObject;
};
oFF.UiControlEvent.prototype.m_control = null;
oFF.UiControlEvent.prototype.m_parameters = null;
oFF.UiControlEvent.prototype.setupEvent = function(control, parameters)
{
	this.m_control = control;
	this.setParameters(parameters);
};
oFF.UiControlEvent.prototype.getControl = function()
{
	return this.m_control;
};
oFF.UiControlEvent.prototype.getParameters = function()
{
	return this.m_parameters;
};
oFF.UiControlEvent.prototype.setParameters = function(parameters)
{
	if (oFF.isNull(parameters))
	{
		this.m_parameters = oFF.XProperties.create();
	}
	else
	{
		this.m_parameters = parameters;
	}
};

oFF.I18nFactory = function() {};
oFF.I18nFactory.prototype = new oFF.XObject();
oFF.I18nFactory.prototype._ff_c = "I18nFactory";

oFF.I18nFactory.s_i18nFactory = null;
oFF.I18nFactory.newInstance = function()
{
	if (oFF.isNull(oFF.I18nFactory.s_i18nFactory))
	{
		return null;
	}
	return oFF.I18nFactory.s_i18nFactory.newI18nInstance();
};
oFF.I18nFactory.registerFactory = function(factory)
{
	oFF.I18nFactory.s_i18nFactory = factory;
};

oFF.UiControlSetFactory = function() {};
oFF.UiControlSetFactory.prototype = new oFF.XObject();
oFF.UiControlSetFactory.prototype._ff_c = "UiControlSetFactory";

oFF.UiControlSetFactory.create = function()
{
	var newObj = new oFF.UiControlSetFactory();
	newObj.m_uiFactories = oFF.XHashMapByString.create();
	return newObj;
};
oFF.UiControlSetFactory.prototype.m_uiFactories = null;
oFF.UiControlSetFactory.prototype.setFactoryAllStyles = function(type, uiFactory)
{
	this.setFactoryExt(type, uiFactory, oFF.UiStyleClass.DESKTOP);
	this.setFactoryExt(type, uiFactory, oFF.UiStyleClass.MOBILE);
};
oFF.UiControlSetFactory.prototype.setFactoryExt = function(type, uiFactory, styleClass)
{
	var myStyleClass = styleClass;
	oFF.XObjectExt.assertNotNullExt(myStyleClass, "No style class given");
	var uiFactoriesByStyle = this.m_uiFactories.getByKey(type.getName());
	if (oFF.isNull(uiFactoriesByStyle))
	{
		uiFactoriesByStyle = oFF.XHashMapByString.create();
		this.m_uiFactories.put(type.getName(), uiFactoriesByStyle);
	}
	uiFactoriesByStyle.put(myStyleClass.getName(), uiFactory);
};
oFF.UiControlSetFactory.prototype.getFactory = function(type, styleClass)
{
	oFF.XObjectExt.assertNotNullExt(styleClass, "Missing style class");
	var uiFactoriesByStyle = this.m_uiFactories.getByKey(type.getName());
	var controlFactory = null;
	if (oFF.notNull(uiFactoriesByStyle))
	{
		controlFactory = uiFactoriesByStyle.getByKey(styleClass.getName());
	}
	if (oFF.isNull(controlFactory))
	{
		var fallbackType = type.getFallbackType();
		if (oFF.notNull(fallbackType))
		{
			controlFactory = this.getFactory(fallbackType, styleClass);
		}
	}
	return controlFactory;
};

oFF.UiRemoteProtocol = {

	INSTANCE_ID:"InstanceId",
	OPERATIONS:"Operations",
	TIMER:"Timer",
	EVENTS:"Events",
	INTEGRITY_CHECK:"IntegrityCheck",
	TOTAL_CONTROLS:"TotalControls",
	FRAGMENT:"Fragment",
	INIT_PROGRAM_NAME:"ProgramName",
	INIT_ARGS_STRUCTURE:"InitArgsStructure",
	INIT_ARGS_STRING:"InitArgsString",
	INIT_PROGRAM_DEVICE:"ProgramDevice",
	INIT_TRACE_NAME:"TraceName",
	INIT_PLATFORM:"Platform",
	INIT_STYLE:"Style",
	INIT_DEVICE_INFO:"DeviceInfo",
	CAPABILITY_FLAGS:"CapabilityFlags",
	OP_GET_ROOT:"getRoot",
	OP_GET_CTYPE:"getCType",
	OP_NEW_CONTROL:"newControl",
	OP_NEW_UI_CONTROL:"newUiControl",
	OP_RELEASE_CONTROL:"releaseControl",
	OP_SET_BASE_CONTROL:"setBaseControl",
	OP_SET_SELECTED_NAME:"setSelectedName",
	OP_SET_SELECTED_ITEM:"setSelectedItem",
	OP_SET_SELECTED_ITEMS:"setSelectedItems",
	OP_ADD_SELECTED_ITEM:"addSelectedItem",
	OP_REMOVE_SELECTED_ITEM:"removeSelectedItem",
	OP_CLEAR_SELECTED_ITEMS:"clearSelectedItems",
	OP_GET_SELECTED_NAME:"getSelectedName",
	OP_GET_SELECTED_ITEM:"getSelectedItem",
	OP_GET_SELECTED_ITEMS:"getSelectedItems",
	OP_ADD:"add",
	OP_INSERT:"insert",
	OP_REMOVE_AT:"removeAt",
	OP_CLEAR_CHILD_ITEMS:"clearChildItems",
	OP_SET_BOTTOM_ELEMENT:"setBottomElement",
	OP_SET_BOTTOM_LEFT_ELEMENT:"setBottomLeftElement",
	OP_SET_BOTTOM_RIGHT_ELEMENT:"setBottomRightElement",
	OP_SET_CENTER_ELEMENT:"setCenterElement",
	OP_SET_FIRST_ELEMENT:"setFirstElement",
	OP_SET_RIGHT_ELEMENT:"setRightElement",
	OP_SET_LEFT_ELEMENT:"setLeftElement",
	OP_SET_TOP_ELEMENT:"setTopElement",
	OP_SET_TOP_LEFT_ELEMENT:"setTopLeftElement",
	OP_SET_TOP_RIGHT_ELEMENT:"setTopRightElement",
	OP_SET_COLUMN_WIDTHS:"setColumnWidths",
	OP_UI_MGR_SET_THEME:"setUiMgrTheme",
	EV_INITIALIZE:"initialize",
	EV_TERMINATE:"terminate",
	EV_ON_SIT_AND_WAIT:"onSitAndWait",
	EV_ON_CHANGED_VALUE:"onChangedValue",
	EV_ON_READ_ONLY_PROPERTY_SYNC:"readOnlyPropertySync",
	EV_ON_TRANSFER_START:"onTransferStart",
	EV_ON_TRANSFER_END:"onTransferEnd",
	MULTI_ITEM_SEPARATOR:","
};

oFF.UiAllOperations = {

	s_opMap:null,
	s_propSetterMap:null,
	s_propGetterMap:null,
	s_listenerMap:null,
	staticSetupLazy:function()
	{
			if (oFF.isNull(oFF.UiAllOperations.s_opMap))
		{
			oFF.UiAllOperations.s_opMap = oFF.XSetOfNameObject.create();
			oFF.UiAllOperations.s_propSetterMap = oFF.XHashMapByString.create();
			oFF.UiAllOperations.s_propGetterMap = oFF.XHashMapByString.create();
			oFF.UiAllOperations.s_listenerMap = oFF.XHashMapByString.create();
			oFF.UiAllOperations.addProp(oFF.UiProperty.ID, new oFF.UiClientPropId(), null);
			oFF.UiAllOperations.addProp(oFF.UiProperty.NAME, new oFF.UiClientPropName(), new oFF.UiClientPropName());
			oFF.UiAllOperations.addProp(oFF.UiProperty.TEXT, new oFF.UiClientPropText(), new oFF.UiClientPropText());
			oFF.UiAllOperations.addProp(oFF.UiProperty.TITLE, new oFF.UiClientPropTitle(), new oFF.UiClientPropTitle());
			oFF.UiAllOperations.addProp(oFF.UiProperty.SUBTITLE, new oFF.UiClientPropSubtitle(), new oFF.UiClientPropSubtitle());
			oFF.UiAllOperations.addProp(oFF.UiProperty.DESCRIPTION, new oFF.UiClientPropDescription(), new oFF.UiClientPropDescription());
			oFF.UiAllOperations.addProp(oFF.UiProperty.LABEL, new oFF.UiClientPropLabel(), new oFF.UiClientPropLabel());
			oFF.UiAllOperations.addProp(oFF.UiProperty.TOOLTIP, new oFF.UiClientPropTooltip(), new oFF.UiClientPropTooltip());
			oFF.UiAllOperations.addProp(oFF.UiProperty.ENABLED, new oFF.UiClientPropEnabled(), new oFF.UiClientPropEnabled());
			oFF.UiAllOperations.addProp(oFF.UiProperty.VISIBLE, new oFF.UiClientPropVisible(), new oFF.UiClientPropVisible());
			oFF.UiAllOperations.addProp(oFF.UiProperty.EDITABLE, new oFF.UiClientPropEditable(), new oFF.UiClientPropEditable());
			oFF.UiAllOperations.addProp(oFF.UiProperty.WIDTH, new oFF.UiClientPropWidth(), new oFF.UiClientPropWidth());
			oFF.UiAllOperations.addProp(oFF.UiProperty.HEIGHT, new oFF.UiClientPropHeight(), new oFF.UiClientPropHeight());
			oFF.UiAllOperations.addProp(oFF.UiProperty.MIN_WIDTH, new oFF.UiClientPropMinWidth(), new oFF.UiClientPropMinWidth());
			oFF.UiAllOperations.addProp(oFF.UiProperty.MAX_WIDTH, new oFF.UiClientPropMaxWidth(), new oFF.UiClientPropMaxWidth());
			oFF.UiAllOperations.addProp(oFF.UiProperty.MIN_HEIGHT, new oFF.UiClientPropMinHeight(), new oFF.UiClientPropMinHeight());
			oFF.UiAllOperations.addProp(oFF.UiProperty.MAX_HEIGHT, new oFF.UiClientPropMaxHeight(), new oFF.UiClientPropMaxHeight());
			oFF.UiAllOperations.addProp(oFF.UiProperty.PADDING, new oFF.UiClientPropPadding(), new oFF.UiClientPropPadding());
			oFF.UiAllOperations.addProp(oFF.UiProperty.MARGIN, new oFF.UiClientPropMargin(), new oFF.UiClientPropMargin());
			oFF.UiAllOperations.addProp(oFF.UiProperty.ROW_COUNT, new oFF.UiClientPropRowCount(), new oFF.UiClientPropRowCount());
			oFF.UiAllOperations.addProp(oFF.UiProperty.COLUMN_COUNT, new oFF.UiClientPropColumnCount(), new oFF.UiClientPropColumnCount());
			oFF.UiAllOperations.addProp(oFF.UiProperty.ROW_SPAN, new oFF.UiClientPropRowSpan(), new oFF.UiClientPropRowSpan());
			oFF.UiAllOperations.addProp(oFF.UiProperty.COLUMN_SPAN, new oFF.UiClientPropColumnSpan(), new oFF.UiClientPropColumnSpan());
			oFF.UiAllOperations.addProp(oFF.UiProperty.CHECKED, new oFF.UiClientPropChecked(), new oFF.UiClientPropChecked());
			oFF.UiAllOperations.addProp(oFF.UiProperty.SELECTED, new oFF.UiClientPropSelected(), new oFF.UiClientPropSelected());
			oFF.UiAllOperations.addProp(oFF.UiProperty.X_POS, new oFF.UiClientPropXPos(), new oFF.UiClientPropXPos());
			oFF.UiAllOperations.addProp(oFF.UiProperty.Y_POS, new oFF.UiClientPropYPos(), new oFF.UiClientPropYPos());
			oFF.UiAllOperations.addProp(oFF.UiProperty.PLACEHOLDER, new oFF.UiClientPropPlaceholder(), new oFF.UiClientPropPlaceholder());
			oFF.UiAllOperations.addProp(oFF.UiProperty.ICON, new oFF.UiClientPropIcon(), new oFF.UiClientPropIcon());
			oFF.UiAllOperations.addProp(oFF.UiProperty.VALUE, new oFF.UiClientPropValue(), new oFF.UiClientPropValue());
			oFF.UiAllOperations.addProp(oFF.UiProperty.SLIDER_VALUE, new oFF.UiClientPropSliderValue(), new oFF.UiClientPropSliderValue());
			oFF.UiAllOperations.addProp(oFF.UiProperty.SLIDER_UPPER_VALUE, new oFF.UiClientPropSliderUpperValue(), new oFF.UiClientPropSliderUpperValue());
			oFF.UiAllOperations.addProp(oFF.UiProperty.SLIDER_MINIMUM, new oFF.UiClientPropSliderMinimum(), new oFF.UiClientPropSliderMinimum());
			oFF.UiAllOperations.addProp(oFF.UiProperty.SLIDER_MAXIMUM, new oFF.UiClientPropSliderMaximum(), new oFF.UiClientPropSliderMaximum());
			oFF.UiAllOperations.addProp(oFF.UiProperty.SLIDER_STEP, new oFF.UiClientPropSliderStep(), new oFF.UiClientPropSliderStep());
			oFF.UiAllOperations.addProp(oFF.UiProperty.ROTATION, new oFF.UiClientPropRotation(), new oFF.UiClientPropRotation());
			oFF.UiAllOperations.addProp(oFF.UiProperty.SRC, new oFF.UiClientPropSrc(), new oFF.UiClientPropSrc());
			oFF.UiAllOperations.addProp(oFF.UiProperty.BACKGROUND_IMAGE_SRC, new oFF.UiClientPropBackgroundImageSrc(), new oFF.UiClientPropBackgroundImageSrc());
			oFF.UiAllOperations.addProp(oFF.UiProperty.BACKGROUND_COLOR, new oFF.UiClientPropBackgroundColor(), new oFF.UiClientPropBackgroundColor());
			oFF.UiAllOperations.addProp(oFF.UiProperty.FONT_COLOR, new oFF.UiClientPropFontColor(), new oFF.UiClientPropFontColor());
			oFF.UiAllOperations.addProp(oFF.UiProperty.FONT_SIZE, new oFF.UiClientPropFontSize(), new oFF.UiClientPropFontSize());
			oFF.UiAllOperations.addProp(oFF.UiProperty.CORNER_RADIUS, new oFF.UiClientPropCornerRadius(), new oFF.UiClientPropCornerRadius());
			oFF.UiAllOperations.addProp(oFF.UiProperty.BORDER_COLOR, new oFF.UiClientPropBorderColor(), new oFF.UiClientPropBorderColor());
			oFF.UiAllOperations.addProp(oFF.UiProperty.BORDER_WIDTH, new oFF.UiClientPropBorderWidth(), new oFF.UiClientPropBorderWidth());
			oFF.UiAllOperations.addProp(oFF.UiProperty.INPUT_TYPE, new oFF.UiClientPropInputType(), new oFF.UiClientPropInputType());
			oFF.UiAllOperations.addProp(oFF.UiProperty.BUTTON_TYPE, new oFF.UiClientPropButtonType(), new oFF.UiClientPropButtonType());
			oFF.UiAllOperations.addProp(oFF.UiProperty.TEXT_DECORATION, new oFF.UiClientPropTextDecoration(), new oFF.UiClientPropTextDecoration());
			oFF.UiAllOperations.addProp(oFF.UiProperty.SPLITTER_POSITION, new oFF.UiClientPropSplitterPosition(), new oFF.UiClientPropSplitterPosition());
			oFF.UiAllOperations.addProp(oFF.UiProperty.EXPANDED, new oFF.UiClientPropExpanded(), new oFF.UiClientPropExpanded());
			oFF.UiAllOperations.addProp(oFF.UiProperty.NODE, new oFF.UiClientPropNode(), new oFF.UiClientPropNode());
			oFF.UiAllOperations.addProp(oFF.UiProperty.CLOSEABLE, new oFF.UiClientPropCloseable(), new oFF.UiClientPropCloseable());
			oFF.UiAllOperations.addProp(oFF.UiProperty.SECTION_START, new oFF.UiClientPropSectionStart(), new oFF.UiClientPropSectionStart());
			oFF.UiAllOperations.addProp(oFF.UiProperty.LIST_ITEM_TYPE, new oFF.UiClientPropListItemType(), new oFF.UiClientPropListItemType());
			oFF.UiAllOperations.addProp(oFF.UiProperty.MODEL_JSON, new oFF.UiClientPropModelJson(), new oFF.UiClientPropModelJson());
			oFF.UiAllOperations.addProp(oFF.UiProperty.DATA_MANIFEST, new oFF.UiClientPropDataManifest(), new oFF.UiClientPropDataManifest());
			oFF.UiAllOperations.addProp(oFF.UiProperty.SELECTION_MODE, new oFF.UiClientPropSelectionMode(), new oFF.UiClientPropSelectionMode());
			oFF.UiAllOperations.addProp(oFF.UiProperty.SELECTION_BEHAVIOR, new oFF.UiClientPropSelectionBehavior(), new oFF.UiClientPropSelectionBehavior());
			oFF.UiAllOperations.addProp(oFF.UiProperty.REQUIRED, new oFF.UiClientPropRequired(), new oFF.UiClientPropRequired());
			oFF.UiAllOperations.addProp(oFF.UiProperty.MAX_DATE, new oFF.UiClientPropMaxDate(), new oFF.UiClientPropMaxDate());
			oFF.UiAllOperations.addProp(oFF.UiProperty.MIN_DATE, new oFF.UiClientPropMinDate(), new oFF.UiClientPropMinDate());
			oFF.UiAllOperations.addProp(oFF.UiProperty.VALUE_FORMAT, new oFF.UiClientPropValueFormat(), new oFF.UiClientPropValueFormat());
			oFF.UiAllOperations.addProp(oFF.UiProperty.DISPLAY_FORMAT, new oFF.UiClientPropDisplayFormat(), new oFF.UiClientPropDisplayFormat());
			oFF.UiAllOperations.addProp(oFF.UiProperty.MINUTES_INTERVAL, new oFF.UiClientPropMinutesInterval(), new oFF.UiClientPropMinutesInterval());
			oFF.UiAllOperations.addProp(oFF.UiProperty.SECONDS_INTERVAL, new oFF.UiClientPropSecondsInterval(), new oFF.UiClientPropSecondsInterval());
			oFF.UiAllOperations.addProp(oFF.UiProperty.MAX_LENGTH, new oFF.UiClientPropMaxLength(), new oFF.UiClientPropMaxLength());
			oFF.UiAllOperations.addProp(oFF.UiProperty.TEXT_ALIGN, new oFF.UiClientPropTextAlign(), new oFF.UiClientPropTextAlign());
			oFF.UiAllOperations.addProp(oFF.UiProperty.FONT_STYLE, new oFF.UiClientPropFontStyle(), new oFF.UiClientPropFontStyle());
			oFF.UiAllOperations.addProp(oFF.UiProperty.FONT_WEIGHT, new oFF.UiClientPropFontWeight(), new oFF.UiClientPropFontWeight());
			oFF.UiAllOperations.addProp(oFF.UiProperty.OPEN, new oFF.UiClientPropOpen(), null);
			oFF.UiAllOperations.addProp(oFF.UiProperty.PATH, new oFF.UiClientPropPath(), new oFF.UiClientPropPath());
			oFF.UiAllOperations.addProp(oFF.UiProperty.BUSY, new oFF.UiClientPropBusy(), new oFF.UiClientPropBusy());
			oFF.UiAllOperations.addProp(oFF.UiProperty.COUNTER, new oFF.UiClientPropCounter(), new oFF.UiClientPropCounter());
			oFF.UiAllOperations.addProp(oFF.UiProperty.HIGHLIGHT, new oFF.UiClientPropHighlight(), new oFF.UiClientPropHighlight());
			oFF.UiAllOperations.addProp(oFF.UiProperty.MESSAGE_TYPE, new oFF.UiClientPropMessageType(), new oFF.UiClientPropMessageType());
			oFF.UiAllOperations.addProp(oFF.UiProperty.VISIBLE_ROW_COUNT, new oFF.UiClientPropVisibleRowCount(), new oFF.UiClientPropVisibleRowCount());
			oFF.UiAllOperations.addProp(oFF.UiProperty.VISIBLE_ROW_COUNT_MODE, new oFF.UiClientPropVisibleRowCountMode(), new oFF.UiClientPropVisibleRowCountMode());
			oFF.UiAllOperations.addProp(oFF.UiProperty.MIN_ROW_COUNT, new oFF.UiClientPropMinRowCount(), new oFF.UiClientPropMinRowCount());
			oFF.UiAllOperations.addProp(oFF.UiProperty.DEBOUNCE_TIME, new oFF.UiClientPropDebounceTime(), new oFF.UiClientPropDebounceTime());
			oFF.UiAllOperations.addProp(oFF.UiProperty.DIRECTION, new oFF.UiClientPropDirection(), new oFF.UiClientPropDirection());
			oFF.UiAllOperations.addProp(oFF.UiProperty.ALIGN_ITEMS, new oFF.UiClientPropAlignItems(), new oFF.UiClientPropAlignItems());
			oFF.UiAllOperations.addProp(oFF.UiProperty.ALIGN_CONTENT, new oFF.UiClientPropAlignContent(), new oFF.UiClientPropAlignContent());
			oFF.UiAllOperations.addProp(oFF.UiProperty.JUSTIFY_CONTENT, new oFF.UiClientPropJustifyContent(), new oFF.UiClientPropJustifyContent());
			oFF.UiAllOperations.addProp(oFF.UiProperty.WRAP, new oFF.UiClientPropWrap(), new oFF.UiClientPropWrap());
			oFF.UiAllOperations.addProp(oFF.UiProperty.FLEX, new oFF.UiClientPropFlex(), new oFF.UiClientPropFlex());
			oFF.UiAllOperations.addProp(oFF.UiProperty.ALIGN_SELF, new oFF.UiClientPropAlignSelf(), new oFF.UiClientPropAlignSelf());
			oFF.UiAllOperations.addProp(oFF.UiProperty.ORDER, new oFF.UiClientPropOrder(), new oFF.UiClientPropOrder());
			oFF.UiAllOperations.addProp(oFF.UiProperty.ENABLE_SELECT_ALL, new oFF.UiClientPropEnableSelectAll(), new oFF.UiClientPropEnableSelectAll());
			oFF.UiAllOperations.addProp(oFF.UiProperty.WRAPPING, new oFF.UiClientPropWrapping(), new oFF.UiClientPropWrapping());
			oFF.UiAllOperations.addProp(oFF.UiProperty.VALUE_STATE, new oFF.UiClientPropValueState(), new oFF.UiClientPropValueState());
			oFF.UiAllOperations.addProp(oFF.UiProperty.VALUE_STATE_TEXT, new oFF.UiClientPropValueStateText(), new oFF.UiClientPropValueStateText());
			oFF.UiAllOperations.addProp(oFF.UiProperty.PLACEMENT, new oFF.UiClientPropPlacement(), new oFF.UiClientPropPlacement());
			oFF.UiAllOperations.addProp(oFF.UiProperty.SHOW_NAV_BUTTON, new oFF.UiClientPropShowNavButton(), new oFF.UiClientPropShowNavButton());
			oFF.UiAllOperations.addProp(oFF.UiProperty.SHOW_HEADER, new oFF.UiClientPropShowHeader(), new oFF.UiClientPropShowHeader());
			oFF.UiAllOperations.addProp(oFF.UiProperty.ON, new oFF.UiClientPropOn(), new oFF.UiClientPropOn());
			oFF.UiAllOperations.addProp(oFF.UiProperty.TAG, new oFF.UiClientPropTag(), new oFF.UiClientPropTag());
			oFF.UiAllOperations.addProp(oFF.UiProperty.ON_TEXT, new oFF.UiClientPropOnText(), new oFF.UiClientPropOnText());
			oFF.UiAllOperations.addProp(oFF.UiProperty.OFF_TEXT, new oFF.UiClientPropOffText(), new oFF.UiClientPropOffText());
			oFF.UiAllOperations.addProp(oFF.UiProperty.CODE_TYPE, new oFF.UiClientPropCodeType(), new oFF.UiClientPropCodeType());
			oFF.UiAllOperations.addProp(oFF.UiProperty.CUSTOM_PARAMETERS, new oFF.UiClientPropCustomParameters(), new oFF.UiClientPropCustomParameters());
			oFF.UiAllOperations.addProp(oFF.UiProperty.MAXIMIZED, new oFF.UiClientPropMaximized(), null);
			oFF.UiAllOperations.addProp(oFF.UiProperty.HIDDEN, new oFF.UiClientPropHidden(), null);
			oFF.UiAllOperations.addProp(oFF.UiProperty.EXPANDABLE, new oFF.UiClientPropExpandable(), new oFF.UiClientPropExpandable());
			oFF.UiAllOperations.addProp(oFF.UiProperty.INTERVAL_SELECTION, new oFF.UiClientPropIntervalSelection(), new oFF.UiClientPropIntervalSelection());
			oFF.UiAllOperations.addProp(oFF.UiProperty.START_DATE, new oFF.UiClientPropStartDate(), new oFF.UiClientPropStartDate());
			oFF.UiAllOperations.addProp(oFF.UiProperty.END_DATE, new oFF.UiClientPropEndDate(), new oFF.UiClientPropEndDate());
			oFF.UiAllOperations.addProp(oFF.UiProperty.PRESSED, new oFF.UiClientPropPressed(), new oFF.UiClientPropPressed());
			oFF.UiAllOperations.addProp(oFF.UiProperty.HEADER_HEIGHT, new oFF.UiClientPropHeaderHeight(), new oFF.UiClientPropHeaderHeight());
			oFF.UiAllOperations.addProp(oFF.UiProperty.FOOTER_HEIGHT, new oFF.UiClientPropFooterHeight(), new oFF.UiClientPropFooterHeight());
			oFF.UiAllOperations.addProp(oFF.UiProperty.OPACITY, new oFF.UiClientPropOpacity(), new oFF.UiClientPropOpacity());
			oFF.UiAllOperations.addProp(oFF.UiProperty.PROMPT, new oFF.UiClientPropPrompt(), new oFF.UiClientPropPrompt());
			oFF.UiAllOperations.addProp(oFF.UiProperty.SHOW_SORTING, new oFF.UiClientPropShowSorting(), new oFF.UiClientPropShowSorting());
			oFF.UiAllOperations.addProp(oFF.UiProperty.SHOW_VALUE, new oFF.UiClientPropShowValue(), new oFF.UiClientPropShowValue());
			oFF.UiAllOperations.addProp(oFF.UiProperty.ANIMATED, new oFF.UiClientPropAnimated(), new oFF.UiClientPropAnimated());
			oFF.UiAllOperations.addProp(oFF.UiProperty.PERCENT_VALUE, new oFF.UiClientPropPercentValue(), new oFF.UiClientPropPercentValue());
			oFF.UiAllOperations.addProp(oFF.UiProperty.COLOR, new oFF.UiClientPropColor(), new oFF.UiClientPropColor());
			oFF.UiAllOperations.addProp(oFF.UiProperty.OVERFLOW, new oFF.UiClientPropOverflow(), new oFF.UiClientPropOverflow());
			oFF.UiAllOperations.addProp(oFF.UiProperty.LOAD_STATE, new oFF.UiClientPropLoadState(), new oFF.UiClientPropLoadState());
			oFF.UiAllOperations.addProp(oFF.UiProperty.FRAME_TYPE, new oFF.UiClientPropFrameType(), new oFF.UiClientPropFrameType());
			oFF.UiAllOperations.addProp(oFF.UiProperty.TILE_MODE, new oFF.UiClientPropTileMode(), new oFF.UiClientPropTileMode());
			oFF.UiAllOperations.addProp(oFF.UiProperty.DRAGGABLE, new oFF.UiClientPropDraggable(), new oFF.UiClientPropDraggable());
			oFF.UiAllOperations.addProp(oFF.UiProperty.OFFSET_HEIGHT, new oFF.UiClientPropOffsetHeight(), null);
			oFF.UiAllOperations.addProp(oFF.UiProperty.OFFSET_WIDTH, new oFF.UiClientPropOffsetWidth(), null);
			oFF.UiAllOperations.addProp(oFF.UiProperty.DROP_INFO, new oFF.UiClientPropDropInfo(), new oFF.UiClientPropDropInfo());
			oFF.UiAllOperations.addProp(oFF.UiProperty.CSS_CLASS, new oFF.UiClientPropCssClass(), new oFF.UiClientPropCssClass());
			oFF.UiAllOperations.addProp(oFF.UiProperty.PARTIALLY_CHECKED, new oFF.UiClientPropPartiallyChecked(), new oFF.UiClientPropPartiallyChecked());
			oFF.UiAllOperations.addProp(oFF.UiProperty.APPLY_CONTENT_PADDING, new oFF.UiClientPropApplyContentPadding(), new oFF.UiClientPropApplyContentPadding());
			oFF.UiAllOperations.addProp(oFF.UiProperty.ENABLE_REORDERING, new oFF.UiClientPropEnableReordering(), new oFF.UiClientPropEnableReordering());
			oFF.UiAllOperations.addProp(oFF.UiProperty.HEADER_MODE, new oFF.UiClientPropHeaderMode(), new oFF.UiClientPropHeaderMode());
			oFF.UiAllOperations.addProp(oFF.UiProperty.COUNT, new oFF.UiClientPropCount(), new oFF.UiClientPropCount());
			oFF.UiAllOperations.addProp(oFF.UiProperty.SHOW_ADD_NEW_BUTTON, new oFF.UiClientPropShowAddNewButton(), new oFF.UiClientPropShowAddNewButton());
			oFF.UiAllOperations.addProp(oFF.UiProperty.MODIFIED, new oFF.UiClientPropModified(), new oFF.UiClientPropModified());
			oFF.UiAllOperations.addProp(oFF.UiProperty.RESIZABLE, new oFF.UiClientPropResizable(), new oFF.UiClientPropResizable());
			oFF.UiAllOperations.addProp(oFF.UiProperty.BORDER_STYLE, new oFF.UiClientPropBorderStyle(), new oFF.UiClientPropBorderStyle());
			oFF.UiAllOperations.addProp(oFF.UiProperty.STATE, new oFF.UiClientPropState(), new oFF.UiClientPropState());
			oFF.UiAllOperations.addProp(oFF.UiProperty.ICON_SIZE, new oFF.UiClientPropIconSize(), new oFF.UiClientPropIconSize());
			oFF.UiAllOperations.addProp(oFF.UiProperty.ANIMATION_DURATION, new oFF.UiClientPropAnimationDuration(), new oFF.UiClientPropAnimationDuration());
			oFF.UiAllOperations.addOpWithName(oFF.UiConstants.QSA_SELECTED_NAME, new oFF.UiClientQuasarSelectedName(), new oFF.UiClientQuasarSelectedName(), oFF.UiRemoteProtocol.OP_GET_SELECTED_NAME, oFF.UiRemoteProtocol.OP_SET_SELECTED_NAME);
			oFF.UiAllOperations.addAggregation(oFF.UiAggregation.ITEMS, new oFF.UiClientAggrItems(), new oFF.UiClientAggrItems(), new oFF.UiClientAggrItems(), new oFF.UiClientAggrItems());
			oFF.UiAllOperations.addAggregation(oFF.UiAggregation.BUTTONS, new oFF.UiClientAggrButtons(), new oFF.UiClientAggrButtons(), new oFF.UiClientAggrButtons(), new oFF.UiClientAggrButtons());
			oFF.UiAllOperations.addAggregation(oFF.UiAggregation.DIALOG_BUTTONS, new oFF.UiClientAggrDialogButtons(), new oFF.UiClientAggrDialogButtons(), new oFF.UiClientAggrDialogButtons(), new oFF.UiClientAggrDialogButtons());
			oFF.UiAllOperations.addAggregation(oFF.UiAggregation.PAGE_BUTTONS, new oFF.UiClientAggrPageButtons(), new oFF.UiClientAggrPageButtons(), new oFF.UiClientAggrPageButtons(), new oFF.UiClientAggrPageButtons());
			oFF.UiAllOperations.addAggregation(oFF.UiAggregation.SUGGESTIONS, new oFF.UiClientAggrSuggestions(), new oFF.UiClientAggrSuggestions(), new oFF.UiClientAggrSuggestions(), new oFF.UiClientAggrSuggestions());
			oFF.UiAllOperations.addAggregation(oFF.UiAggregation.COLUMNS, new oFF.UiClientAggrColumns(), new oFF.UiClientAggrColumns(), new oFF.UiClientAggrColumns(), new oFF.UiClientAggrColumns());
			oFF.UiAllOperations.addAggregation(oFF.UiAggregation.ROWS, new oFF.UiClientAggrRows(), new oFF.UiClientAggrRows(), new oFF.UiClientAggrRows(), new oFF.UiClientAggrRows());
			oFF.UiAllOperations.addAggregation(oFF.UiAggregation.TREE_TABLE_ROWS, new oFF.UiClientAggrTreeTableRows(), new oFF.UiClientAggrTreeTableRows(), new oFF.UiClientAggrTreeTableRows(), new oFF.UiClientAggrTreeTableRows());
			oFF.UiAllOperations.addAggregation(oFF.UiAggregation.CELLS, new oFF.UiClientAggrCells(), new oFF.UiClientAggrCells(), new oFF.UiClientAggrCells(), new oFF.UiClientAggrCells());
			oFF.UiAllOperations.addAggregation(oFF.UiAggregation.END_ICONS, new oFF.UiClientAggrEndIcons(), new oFF.UiClientAggrEndIcons(), new oFF.UiClientAggrEndIcons(), new oFF.UiClientAggrEndIcons());
			oFF.UiAllOperations.addAggregation(oFF.UiAggregation.RADIO_BUTTONS, new oFF.UiClientAggrRadioButtons(), new oFF.UiClientAggrRadioButtons(), new oFF.UiClientAggrRadioButtons(), new oFF.UiClientAggrRadioButtons());
			oFF.UiAllOperations.addAggregation(oFF.UiAggregation.MATRIX_LAYOUT_CELLS, new oFF.UiClientAggrMatrixLayoutCells(), new oFF.UiClientAggrMatrixLayoutCells(), new oFF.UiClientAggrMatrixLayoutCells(), new oFF.UiClientAggrMatrixLayoutCells());
			oFF.UiAllOperations.addAggregation(oFF.UiAggregation.MATRIX_LAYOUT_ROWS, new oFF.UiClientAggrMatrixLayoutRows(), new oFF.UiClientAggrMatrixLayoutRows(), new oFF.UiClientAggrMatrixLayoutRows(), new oFF.UiClientAggrMatrixLayoutRows());
			oFF.UiAllOperations.addAggregation(oFF.UiAggregation.RESPONSIVE_TABLE_COLUMNS, new oFF.UiClientAggrResponsiveTableColumns(), new oFF.UiClientAggrResponsiveTableColumns(), new oFF.UiClientAggrResponsiveTableColumns(), new oFF.UiClientAggrResponsiveTableColumns());
			oFF.UiAllOperations.addAggregation(oFF.UiAggregation.RESPONSIVE_TABLE_ROWS, new oFF.UiClientAggrResponsiveTableRows(), new oFF.UiClientAggrResponsiveTableRows(), new oFF.UiClientAggrResponsiveTableRows(), new oFF.UiClientAggrResponsiveTableRows());
			oFF.UiAllOperations.addAggregation(oFF.UiAggregation.RESPONSIVE_TABLE_CELLS, new oFF.UiClientAggrResponsiveTableCells(), new oFF.UiClientAggrResponsiveTableCells(), new oFF.UiClientAggrResponsiveTableCells(), new oFF.UiClientAggrResponsiveTableCells());
			oFF.UiAllOperations.addAggregation(oFF.UiAggregation.PAGES, new oFF.UiClientAggrPages(), new oFF.UiClientAggrPages(), new oFF.UiClientAggrPages(), new oFF.UiClientAggrPages());
			oFF.UiAllOperations.add(new oFF.UiClientOpOpenAt());
			oFF.UiAllOperations.add(new oFF.UiClientOpOpenAtPosition());
			oFF.UiAllOperations.add(new oFF.UiClientOpOpen());
			oFF.UiAllOperations.add(new oFF.UiClientOpClose());
			oFF.UiAllOperations.add(new oFF.UiClientOpPrint());
			oFF.UiAllOperations.add(new oFF.UiClientOpPrintln());
			oFF.UiAllOperations.add(new oFF.UiClientOpExpandToLevel());
			oFF.UiAllOperations.add(new oFF.UiClientOpCollapseAll());
			oFF.UiAllOperations.add(new oFF.UiClientOpFocus());
			oFF.UiAllOperations.add(new oFF.UiClientOpShake());
			oFF.UiAllOperations.add(new oFF.UiClientOpShowSuggestions());
			oFF.UiAllOperations.add(new oFF.UiClientOpCloseSuggestions());
			oFF.UiAllOperations.add(new oFF.UiClientOpBack());
			oFF.UiAllOperations.add(new oFF.UiClientOpScrollTo());
			oFF.UiAllOperations.add(new oFF.UiClientOpScrollToControl());
			oFF.UiAllOperations.add(new oFF.UiClientOpPopToPage());
			oFF.UiAllOperations.add(new oFF.UiClientOpMaximize());
			oFF.UiAllOperations.add(new oFF.UiClientOpRestore());
			oFF.UiAllOperations.add(new oFF.UiClientOpHide());
			oFF.UiAllOperations.add(new oFF.UiClientOpShow());
			oFF.UiAllOperations.add(new oFF.UiClientOpSelectText());
			oFF.UiAllOperations.add(new oFF.UiClientOpFullscreen());
			oFF.UiAllOperations.add(new oFF.UiClientOpStartReadLine());
			oFF.UiAllOperations.add(new oFF.UiClientOpBringToFront());
			oFF.UiAllOperations.add(new oFF.UiClientOpSetFooter());
			oFF.UiAllOperations.add(new oFF.UiClientOpClearFooter());
			oFF.UiAllOperations.add(new oFF.UiClientOpSetFirstVisibleRow());
			oFF.UiAllOperations.add(new oFF.UiClientOpSetSubHeader());
			oFF.UiAllOperations.add(new oFF.UiClientOpClearSubHeader());
			oFF.UiAllOperations.add(new oFF.UiClientOpSetHeader());
			oFF.UiAllOperations.add(new oFF.UiClientOpClearHeader());
			oFF.UiAllOperations.add(new oFF.UiClientOpNewUiControl());
			oFF.UiAllOperations.add(new oFF.UiClientOpSetBaseControl());
			oFF.UiAllOperations.add(new oFF.UiClientOpAdd());
			oFF.UiAllOperations.add(new oFF.UiClientOpInsert());
			oFF.UiAllOperations.add(new oFF.UiClientOpRemoveAt());
			oFF.UiAllOperations.add(new oFF.UiClientOpClearChildItems());
			oFF.UiAllOperations.add(new oFF.UiClientOpGetRoot());
			oFF.UiAllOperations.add(new oFF.UiClientOpSetContent());
			oFF.UiAllOperations.add(new oFF.UiClientOpClearContent());
			oFF.UiAllOperations.add(new oFF.UiClientOpReleaseControl());
			oFF.UiAllOperations.add(new oFF.UiClientOpSetCommandHistory());
			oFF.UiAllOperations.add(new oFF.UiClientOpUiMgrSetTheme());
			oFF.UiAllOperations.addEventListener(oFF.UiEvent.ON_SELECT, new oFF.UiClientOpRegisterOnSelect());
			oFF.UiAllOperations.addEventListener(oFF.UiEvent.ON_SELECTION_CHANGE, new oFF.UiClientOpRegisterOnSelectionChange());
			oFF.UiAllOperations.addEventListener(oFF.UiEvent.ON_CLICK, new oFF.UiClientOpRegisterOnClick());
			oFF.UiAllOperations.addEventListener(oFF.UiEvent.ON_DOUBLE_CLICK, new oFF.UiClientOpRegisterOnDoubleClick());
			oFF.UiAllOperations.addEventListener(oFF.UiEvent.ON_OPEN, new oFF.UiClientOpRegisterOnOpen());
			oFF.UiAllOperations.addEventListener(oFF.UiEvent.ON_CLOSE, new oFF.UiClientOpRegisterOnClose());
			oFF.UiAllOperations.addEventListener(oFF.UiEvent.ON_BEFORE_OPEN, new oFF.UiClientOpRegisterOnBeforeOpen());
			oFF.UiAllOperations.addEventListener(oFF.UiEvent.ON_BEFORE_CLOSE, new oFF.UiClientOpRegisterOnBeforeClose());
			oFF.UiAllOperations.addEventListener(oFF.UiEvent.ON_AFTER_OPEN, new oFF.UiClientOpRegisterOnAfterOpen());
			oFF.UiAllOperations.addEventListener(oFF.UiEvent.ON_AFTER_CLOSE, new oFF.UiClientOpRegisterOnAfterClose());
			oFF.UiAllOperations.addEventListener(oFF.UiEvent.ON_CHANGE, new oFF.UiClientOpRegisterOnChange());
			oFF.UiAllOperations.addEventListener(oFF.UiEvent.ON_LIVE_CHANGE, new oFF.UiClientOpRegisterOnLiveChange());
			oFF.UiAllOperations.addEventListener(oFF.UiEvent.ON_ENTER, new oFF.UiClientOpRegisterOnEnter());
			oFF.UiAllOperations.addEventListener(oFF.UiEvent.ON_CONTEXT_MENU, new oFF.UiClientOpRegisterOnContextMenu());
			oFF.UiAllOperations.addEventListener(oFF.UiEvent.ON_COLLAPSE, new oFF.UiClientOpRegisterOnCollapse());
			oFF.UiAllOperations.addEventListener(oFF.UiEvent.ON_EXPAND, new oFF.UiClientOpRegisterOnExpand());
			oFF.UiAllOperations.addEventListener(oFF.UiEvent.ON_PRESS, new oFF.UiClientOpRegisterOnPress());
			oFF.UiAllOperations.addEventListener(oFF.UiEvent.ON_LOAD_FINISHED, new oFF.UiClientOpRegisterOnLoadFinished());
			oFF.UiAllOperations.addEventListener(oFF.UiEvent.ON_DELETE, new oFF.UiClientOpRegisterOnDelete());
			oFF.UiAllOperations.addEventListener(oFF.UiEvent.ON_DETAIL_PRESS, new oFF.UiClientOpRegisterOnDetailPress());
			oFF.UiAllOperations.addEventListener(oFF.UiEvent.ON_EDITING_BEGIN, new oFF.UiClientOpRegisterOnEditingBegin());
			oFF.UiAllOperations.addEventListener(oFF.UiEvent.ON_EDITING_END, new oFF.UiClientOpRegisterOnEditingEnd());
			oFF.UiAllOperations.addEventListener(oFF.UiEvent.ON_BACK, new oFF.UiClientOpRegisterOnBack());
			oFF.UiAllOperations.addEventListener(oFF.UiEvent.ON_REFRESH, new oFF.UiClientOpRegisterOnRefresh());
			oFF.UiAllOperations.addEventListener(oFF.UiEvent.ON_MOVE, new oFF.UiClientOpRegisterOnMove());
			oFF.UiAllOperations.addEventListener(oFF.UiEvent.ON_MOVE_START, new oFF.UiClientOpRegisterOnMoveStart());
			oFF.UiAllOperations.addEventListener(oFF.UiEvent.ON_MOVE_END, new oFF.UiClientOpRegisterOnMoveEnd());
			oFF.UiAllOperations.addEventListener(oFF.UiEvent.ON_RESIZE, new oFF.UiClientOpRegisterOnResize());
			oFF.UiAllOperations.addEventListener(oFF.UiEvent.ON_SUGGESTION_SELECT, new oFF.UiClientOpRegisterOnSuggestionSelect());
			oFF.UiAllOperations.addEventListener(oFF.UiEvent.ON_SCROLL, new oFF.UiClientOpRegisterOnScroll());
			oFF.UiAllOperations.addEventListener(oFF.UiEvent.ON_SCROLL_LOAD, new oFF.UiClientOpRegisterOnScrollLoad());
			oFF.UiAllOperations.addEventListener(oFF.UiEvent.ON_HOVER, new oFF.UiClientOpRegisterOnHover());
			oFF.UiAllOperations.addEventListener(oFF.UiEvent.ON_HOVER_END, new oFF.UiClientOpRegisterOnHoverEnd());
			oFF.UiAllOperations.addEventListener(oFF.UiEvent.ON_PASTE, new oFF.UiClientOpRegisterOnPaste());
			oFF.UiAllOperations.addEventListener(oFF.UiEvent.ON_SELECTION_FINISH, new oFF.UiClientOpRegisterOnSelectionFinish());
			oFF.UiAllOperations.addEventListener(oFF.UiEvent.ON_SEARCH, new oFF.UiClientOpRegisterOnSearch());
			oFF.UiAllOperations.addEventListener(oFF.UiEvent.ON_BUTTON_PRESS, new oFF.UiClientOpRegisterOnButtonPress());
			oFF.UiAllOperations.addEventListener(oFF.UiEvent.ON_ERROR, new oFF.UiClientOpRegisterOnError());
			oFF.UiAllOperations.addEventListener(oFF.UiEvent.ON_READ_LINE_FINISHED, new oFF.UiClientOpRegisterOnReadLineFinished());
			oFF.UiAllOperations.addEventListener(oFF.UiEvent.ON_EXECUTE, new oFF.UiClientOpRegisterOnExecute());
			oFF.UiAllOperations.addEventListener(oFF.UiEvent.ON_TERMINATE, new oFF.UiClientOpRegisterOnTerminate());
			oFF.UiAllOperations.addEventListener(oFF.UiEvent.ON_FILE_DROP, new oFF.UiClientOpRegisterOnFileDrop());
			oFF.UiAllOperations.addEventListener(oFF.UiEvent.ON_DROP, new oFF.UiClientOpRegisterOnDrop());
			oFF.UiAllOperations.addEventListener(oFF.UiEvent.ON_ITEM_CLOSE, new oFF.UiClientOpRegisterOnItemClose());
			oFF.UiAllOperations.addEventListener(oFF.UiEvent.ON_ITEM_SELECT, new oFF.UiClientOpRegisterOnItemSelect());
			oFF.UiAllOperations.addEventListener(oFF.UiEvent.ON_TABLE_DRAG_AND_DROP, new oFF.UiClientOpRegisterOnTableDragAndDrop());
			oFF.UiAllOperations.add(new oFF.UiClientOpGetSelectedItem());
			oFF.UiAllOperations.add(new oFF.UiClientOpSetSelectedItem());
			oFF.UiAllOperations.add(new oFF.UiClientOpGetSelectedItems());
			oFF.UiAllOperations.add(new oFF.UiClientOpSetSelectedItems());
			oFF.UiAllOperations.add(new oFF.UiClientOpAddSelectedItem());
			oFF.UiAllOperations.add(new oFF.UiClientOpRemoveSelectedItem());
			oFF.UiAllOperations.add(new oFF.UiClientOpClearSelectedItems());
		}
	},
	addEventListener:function(eventDef, operation)
	{
			oFF.UiAllOperations.add(operation);
		oFF.UiAllOperations.s_listenerMap.put(eventDef.getName(), operation);
	},
	addOpWithName:function(name, getter, setter, getterFunctionName, setterFunctionName)
	{
			if (oFF.notNull(getter))
		{
			getter.setIsSetter(false);
			getter.setName(getterFunctionName);
			getter.setPropertyName(name);
			oFF.UiAllOperations.add(getter);
			oFF.UiAllOperations.s_propGetterMap.put(name, getter);
		}
		if (oFF.notNull(setter))
		{
			setter.setIsSetter(true);
			setter.setName(setterFunctionName);
			setter.setPropertyName(name);
			oFF.UiAllOperations.add(setter);
			oFF.UiAllOperations.s_propSetterMap.put(name, setter);
		}
	},
	addProp:function(property, getter, setter)
	{
			oFF.UiAllOperations.addOpWithName(property.getName(), getter, setter, property.getGetterMethodName(), property.getSetterMethodName());
	},
	addAggregation:function(aggrDef, agrAddOp, agrInsertOp, agrRemoveOp, agrClearOp)
	{
			if (oFF.notNull(agrAddOp))
		{
			agrAddOp.setIsAddAggregationOp(aggrDef);
			oFF.UiAllOperations.add(agrAddOp);
		}
		if (oFF.notNull(agrInsertOp))
		{
			agrInsertOp.setIsInsertAggregationOp(aggrDef);
			oFF.UiAllOperations.add(agrInsertOp);
		}
		if (oFF.notNull(agrRemoveOp))
		{
			agrRemoveOp.setIsRemoveAggregationOp(aggrDef);
			oFF.UiAllOperations.add(agrRemoveOp);
		}
		if (oFF.notNull(agrClearOp))
		{
			agrClearOp.setIsClearAggregationOp(aggrDef);
			oFF.UiAllOperations.add(agrClearOp);
		}
	},
	add:function(op)
	{
			if (oFF.notNull(op))
		{
			if (op.getName() === null)
			{
				throw oFF.XException.createIllegalStateException("No name given");
			}
			oFF.UiAllOperations.s_opMap.add(op);
		}
	},
	lookupOp:function(name)
	{
			oFF.UiAllOperations.staticSetupLazy();
		return oFF.UiAllOperations.s_opMap.getByKey(name);
	},
	lookupSetterProperty:function(name)
	{
			oFF.UiAllOperations.staticSetupLazy();
		return oFF.UiAllOperations.s_propSetterMap.getByKey(name);
	},
	lookupGetterProperty:function(name)
	{
			oFF.UiAllOperations.staticSetupLazy();
		return oFF.UiAllOperations.s_propGetterMap.getByKey(name);
	},
	lookupListener:function(name)
	{
			oFF.UiAllOperations.staticSetupLazy();
		return oFF.UiAllOperations.s_listenerMap.getByKey(name);
	},
	getAllGetterProperties:function()
	{
			oFF.UiAllOperations.staticSetupLazy();
		return oFF.UiAllOperations.s_propGetterMap.getKeysAsReadOnlyListOfString();
	}
};

oFF.UiClientOperation = function() {};
oFF.UiClientOperation.prototype = new oFF.XObject();
oFF.UiClientOperation.prototype._ff_c = "UiClientOperation";

oFF.UiClientOperation.prototype.executeOperation = oFF.noSupport;
oFF.UiClientOperation.prototype.getName = oFF.noSupport;
oFF.UiClientOperation.prototype.toString = function()
{
	return this.getName();
};

oFF.UiParamCode = function() {};
oFF.UiParamCode.prototype = new oFF.XObject();
oFF.UiParamCode.prototype._ff_c = "UiParamCode";

oFF.UiParamCode.s_lookup = null;
oFF.UiParamCode.PRIO_0_CONSTANTS = 0;
oFF.UiParamCode.PRIO_1_LAYOUT_METADATA = 1;
oFF.UiParamCode.PRIO_2_DATA = 2;
oFF.UiParamCode.staticSetupUiParam = function()
{
	oFF.UiParamCode.s_lookup = oFF.XSetOfNameObject.create();
};
oFF.UiParamCode.add = function(uiParam)
{
	oFF.UiParamCode.s_lookup.add(uiParam);
};
oFF.UiParamCode.compileExecutable = function(name, parameter)
{
	var uiParamCode = oFF.UiParamCode.s_lookup.getByKey(name);
	if (oFF.isNull(uiParamCode))
	{
		return null;
	}
	return oFF.UiParamExecutable.create(uiParamCode, parameter);
};
oFF.UiParamCode.prototype.doDeserialize = oFF.noSupport;
oFF.UiParamCode.prototype.getName = oFF.noSupport;
oFF.UiParamCode.prototype.getPriority = function()
{
	return oFF.UiParamCode.PRIO_2_DATA;
};
oFF.UiParamCode.prototype.toString = function()
{
	return this.getName();
};

oFF.UiParamExecutable = function() {};
oFF.UiParamExecutable.prototype = new oFF.XObject();
oFF.UiParamExecutable.prototype._ff_c = "UiParamExecutable";

oFF.UiParamExecutable.create = function(paramCode, parameter)
{
	var newObject = new oFF.UiParamExecutable();
	newObject.m_paramCode = paramCode;
	newObject.m_parameter = parameter;
	return newObject;
};
oFF.UiParamExecutable.prototype.m_paramCode = null;
oFF.UiParamExecutable.prototype.m_parameter = null;
oFF.UiParamExecutable.prototype.apply = function(context)
{
	this.m_paramCode.doDeserialize(context, this.m_parameter);
};
oFF.UiParamExecutable.prototype.getPriority = function()
{
	return this.m_paramCode.getPriority();
};

oFF.UiFoundationGenerator = {

	main:function()
	{
			oFF.UiModule.getInstance();
		oFF.XLogger.println("*** Generating base ui foundation stuff ***");
		oFF.XLogger.println("*** ------------------------------------- ***");
		oFF.UiInterfaceGenerator.generate();
		oFF.UiControlGenerator.generate();
		oFF.XLogger.println("*** ------------------------------------- ***");
		oFF.XLogger.println("*** Done - generated base ui foundation stuff successfully ***");
	}
};

oFF.UiGeneratorBase = function() {};
oFF.UiGeneratorBase.prototype = new oFF.XObject();
oFF.UiGeneratorBase.prototype._ff_c = "UiGeneratorBase";

oFF.UiGeneratorBase.prototype.makeAggregation = function(session, outputDir, thePackage, theClassName, listOfInterfaces, friendlyName)
{
	var allInterfacesString = oFF.XStringUtils.concatenate3(" * All ", friendlyName, " interfaces.");
	var sourceCode = oFF.XStringBuffer.create();
	sourceCode.append("package ");
	sourceCode.append(thePackage);
	sourceCode.appendLine(";");
	sourceCode.appendNewLine();
	sourceCode.appendNewLine();
	sourceCode.appendLine("/**");
	sourceCode.appendLine(allInterfacesString);
	sourceCode.appendLine(" */");
	sourceCode.append("public interface ");
	sourceCode.append(theClassName);
	sourceCode.appendLine(" extends //");
	var counter = 0;
	for (var i = 0; i < listOfInterfaces.size(); i++)
	{
		var value = listOfInterfaces.get(i);
		sourceCode.append(value);
		if (i < listOfInterfaces.size() - 1)
		{
			sourceCode.append(", ");
		}
		if (counter === 4)
		{
			sourceCode.appendLine(" //");
			counter = 0;
		}
		else
		{
			counter++;
		}
	}
	sourceCode.appendNewLine();
	sourceCode.appendLine("{");
	sourceCode.appendLine("}");
	this.writeClass(session, outputDir, theClassName, sourceCode.toString());
};
oFF.UiGeneratorBase.prototype.writeClass = function(session, outputDir, theClassName, content)
{
	if (oFF.isNull(session))
	{
		oFF.XLogger.println("*** Missing session ***");
		return;
	}
	if (oFF.XStringUtils.isNullOrEmpty(session.getEnvironment().getStringByKey(oFF.XEnvironmentConstants.FIREFLY_SDK)))
	{
		oFF.XLogger.println("*** FIREFLY_SDK (ff_sdk) environment variable not set! ***");
		oFF.XLogger.println("*** Generating failed! ***");
		oFF.XSystemUtils.exit(0);
	}
	var outputPath = oFF.XStringUtils.concatenate3(outputDir, theClassName, ".java");
	var outputFile = oFF.XFile.createExt(session, outputPath, oFF.PathFormat.AUTO_DETECT, oFF.VarResolveMode.DOLLAR);
	outputFile.getParent().mkdirs();
	outputFile.saveByteArray(oFF.XByteArray.convertFromString(content));
};
oFF.UiGeneratorBase.prototype.appendInterfaces = function(sourceCode, sortedInterfaceNames, appendNewLine)
{
	if (sortedInterfaceNames.size() > 0)
	{
		if (appendNewLine)
		{
			sourceCode.appendLine(", //");
		}
		for (var i = 0; i < sortedInterfaceNames.size(); i++)
		{
			if (i > 0)
			{
				sourceCode.append(", ");
			}
			var value = sortedInterfaceNames.get(i);
			var interfaceName = oFF.XStringUtils.concatenate2("IUiInterface", value);
			sourceCode.append(interfaceName);
		}
		return true;
	}
	return false;
};
oFF.UiGeneratorBase.prototype.appendProperties = function(sourceCode, sortedPropertyNames)
{
	if (sortedPropertyNames.size() > 0)
	{
		sourceCode.appendLine(", //");
		for (var i = 0; i < sortedPropertyNames.size(); i++)
		{
			if (i > 0)
			{
				sourceCode.append(", ");
			}
			var value = sortedPropertyNames.get(i);
			sourceCode.append("IUiProperty").append(value);
		}
		return true;
	}
	return false;
};
oFF.UiGeneratorBase.prototype.appendAggregations = function(sourceCode, sortedAggregationNames)
{
	if (sortedAggregationNames.size() > 0)
	{
		sourceCode.appendLine(", //");
		for (var i = 0; i < sortedAggregationNames.size(); i++)
		{
			if (i > 0)
			{
				sourceCode.append(", ");
			}
			var tmpAggrName = sortedAggregationNames.get(i);
			sourceCode.append("IUiAggregation").append(tmpAggrName);
		}
		return true;
	}
	return false;
};
oFF.UiGeneratorBase.prototype.appendMethods = function(sourceCode, sortedMethodNames)
{
	if (sortedMethodNames.size() > 0)
	{
		sourceCode.appendLine(", //");
		for (var i = 0; i < sortedMethodNames.size(); i++)
		{
			if (i > 0)
			{
				sourceCode.append(", ");
			}
			var tmpMethodName = sortedMethodNames.get(i);
			sourceCode.append("IUiMethod").append(tmpMethodName);
		}
		return true;
	}
	return false;
};
oFF.UiGeneratorBase.prototype.appendEvents = function(sourceCode, sortedEventNames)
{
	if (sortedEventNames.size() > 0)
	{
		sourceCode.appendLine(", //");
		for (var k = 0; k < sortedEventNames.size(); k++)
		{
			if (k > 0)
			{
				sourceCode.append(", ");
			}
			var eventValue = sortedEventNames.get(k);
			sourceCode.append("IUiRegister").append(eventValue);
		}
		return true;
	}
	return false;
};

oFF.UiUtils = {

	exportToStructure:function(control)
	{
			var structure = oFF.PrFactory.createStructure();
		var childItems = control.getChildItems();
		if (childItems.size() > 0)
		{
			var children = structure.putNewList("Items");
			for (var i = 0; i < childItems.size(); i++)
			{
				var item = childItems.get(i);
				var itemStructure = oFF.UiUtils.exportToStructure(item);
				children.add(itemStructure);
			}
		}
		var content = control.getContent();
		if (oFF.notNull(content))
		{
			var contentStruct = structure.putNewStructure("Content");
			var tmpContentStructure = oFF.UiUtils.exportToStructure(content);
			contentStruct.put(content.getName(), tmpContentStructure);
		}
		var allProperties = oFF.UiAllOperations.getAllGetterProperties();
		for (var m = 0; m < allProperties.size(); m++)
		{
			oFF.UiUtils.exportProperty(control, structure, allProperties.get(m));
		}
		return structure;
	},
	exportToHtml:function(control, template)
	{
			var buffer = oFF.XStringBuffer.create();
		var script = oFF.XStringBuffer.create();
		oFF.UiUtils.exportToHtmlInternal(control, buffer, script, oFF.XIntegerValue.create(0));
		var theTemplate = template;
		if (oFF.isNull(theTemplate))
		{
			var master = oFF.XStringBuffer.create();
			master.append("<html>");
			master.append("<head>");
			master.append("<script>");
			master.append("function initJs()");
			master.append("{");
			master.append("%SCRIPTING%");
			master.append("}");
			master.append("</script>");
			master.append("</head>");
			master.append("<body onload=\"initJs()\">");
			master.append("%BODY%");
			master.append("</body>");
			master.append("</html>");
			theTemplate = master.toString();
		}
		var result = oFF.XString.replace(theTemplate, "%SCRIPTING%", script.toString());
		result = oFF.XString.replace(result, "%BODY%", buffer.toString());
		return result;
	},
	exportToHtmlInternal:function(control, buffer, script, counter)
	{
			var uiType = control.getUiType();
		if (uiType === oFF.UiType.ROOT)
		{
			var content = control.getContent();
			oFF.UiUtils.exportToHtmlInternal(content, buffer, script, counter);
		}
		else if (uiType === oFF.UiType.BUTTON)
		{
			buffer.append("<button type=\"button\">");
			buffer.append(control.getText());
			buffer.append("</button>");
		}
		else if (uiType === oFF.UiType.FLEX_LAYOUT)
		{
			buffer.append("<div style=\"display:flex\">");
			for (var a = 0; a < control.size(); a++)
			{
				var flexLayoutChild = control.get(a);
				oFF.UiUtils.exportToHtmlInternal(flexLayoutChild, buffer, script, counter);
			}
			buffer.append("</div>");
		}
		else if (uiType === oFF.UiType.CANVAS_LAYOUT)
		{
			buffer.append("<div>");
			for (var i = 0; i < control.size(); i++)
			{
				var child = control.get(i);
				oFF.UiUtils.exportToHtmlInternal(child, buffer, script, counter);
			}
			buffer.append("</div>");
		}
		else if (uiType === oFF.UiType.CHART)
		{
			var theId = oFF.XStringBuffer.create().append("chartid").appendInt(counter.getInteger()).toString();
			counter.setInteger(counter.getInteger() + 1);
			buffer.append("<div id=\"");
			buffer.append(theId);
			buffer.append("\" style=\"width:100%; height:400px;\">");
			buffer.append("</div>");
			var modelJson = control.getModelJson();
			var json = null;
			if (oFF.notNull(modelJson))
			{
				json = modelJson.toString();
			}
			else
			{
				json = "null";
			}
			script.append("var myChart = Highcharts.chart( \"");
			script.append(theId);
			script.append("\", ");
			script.append(json);
			script.append(");");
		}
		else if (uiType === oFF.UiType.CODE_EDITOR)
		{
			buffer.append("<textarea rows=\"4\" cols=\"50\">");
			buffer.append(control.getText());
			buffer.append("</textarea>");
		}
		else
		{
			buffer.append("Could not parse control!");
		}
	},
	setPropertyStringValue:function(control, property, value)
	{
			var propertyOp = oFF.UiAllOperations.lookupSetterProperty(property);
		if (oFF.notNull(propertyOp) && oFF.notNull(control))
		{
			propertyOp.importProperty(control, value);
		}
	},
	exportProperty:function(source, target, property)
	{
			var propertyOp = oFF.UiAllOperations.lookupGetterProperty(property);
		if (oFF.notNull(propertyOp))
		{
			propertyOp.exportProperty(source, target);
		}
	},
	getElementAsString:function(content, key)
	{
			var value = null;
		var prType = content.getElementTypeByKey(key);
		if (prType === oFF.PrElementType.STRING)
		{
			value = content.getStringByKey(key);
		}
		else if (prType === oFF.PrElementType.INTEGER)
		{
			value = oFF.XInteger.convertToString(content.getIntegerByKey(key));
		}
		else if (prType === oFF.PrElementType.LONG)
		{
			value = oFF.XLong.convertToString(content.getLongByKey(key));
		}
		else if (prType === oFF.PrElementType.DOUBLE)
		{
			value = oFF.XDouble.convertToString(content.getDoubleByKey(key));
		}
		else if (prType === oFF.PrElementType.BOOLEAN)
		{
			value = oFF.XBoolean.convertToString(content.getBooleanByKey(key));
		}
		else if (prType === oFF.PrElementType.STRUCTURE)
		{
			value = content.getStructureByKey(key).getStringRepresentation();
		}
		return value;
	}
};

oFF.UiTheme = {

	s_singeltonInstance:null,
	s_themeMap:null,
	DEFAULT:null,
	staticSetup:function()
	{
			oFF.UiTheme.s_themeMap = oFF.XHashMapByString.create();
		oFF.UiTheme.DEFAULT = oFF.UiTheme.create(oFF.UiThemeDefault.create(), "default");
	},
	create:function(theme, name)
	{
			if (oFF.UiTheme.s_themeMap.containsKey(name))
		{
			throw oFF.XException.createIllegalArgumentException(oFF.XStringUtils.concatenate2("Theme already exists: ", name));
		}
		oFF.UiTheme.s_themeMap.put(name, theme);
		oFF.UiTheme.s_themeMap.put(oFF.XString.toLowerCase(name), theme);
		oFF.UiTheme.s_themeMap.put(oFF.XString.toUpperCase(name), theme);
		return theme;
	},
	lookup:function(value)
	{
			return oFF.UiTheme.s_themeMap.getByKey(value);
	},
	getCurrentTheme:function()
	{
			if (oFF.isNull(oFF.UiTheme.s_singeltonInstance))
		{
			oFF.UiTheme.setCurrentTheme(oFF.UiTheme.DEFAULT);
		}
		return oFF.UiTheme.s_singeltonInstance;
	},
	setCurrentTheme:function(themeInstance)
	{
			if (oFF.notNull(oFF.UiTheme.s_singeltonInstance))
		{
			oFF.UiTheme.s_singeltonInstance = oFF.XObjectExt.release(oFF.UiTheme.s_singeltonInstance);
		}
		oFF.UiTheme.s_singeltonInstance = themeInstance;
	}
};

oFF.UiThemeDefault = function() {};
oFF.UiThemeDefault.prototype = new oFF.XObject();
oFF.UiThemeDefault.prototype._ff_c = "UiThemeDefault";

oFF.UiThemeDefault.DIALOG_BTN_MIN_WIDTH = "80px";
oFF.UiThemeDefault.create = function()
{
	var newUiTheme = new oFF.UiThemeDefault();
	return newUiTheme;
};
oFF.UiThemeDefault.prototype.getDialogBtnMinWidth = function()
{
	return oFF.UiCssLength.create(oFF.UiThemeDefault.DIALOG_BTN_MIN_WIDTH);
};
oFF.UiThemeDefault.prototype.getLightGrayColor = function()
{
	return oFF.UiColor.create("#cbc2c2");
};
oFF.UiThemeDefault.prototype.getSuccessColor = function()
{
	return oFF.UiColor.create("#38a238");
};
oFF.UiThemeDefault.prototype.getInformationColor = function()
{
	return oFF.UiColor.create("#427cac");
};
oFF.UiThemeDefault.prototype.getWarningColor = function()
{
	return oFF.UiColor.create("#f9a429");
};
oFF.UiThemeDefault.prototype.getErrorColor = function()
{
	return oFF.UiColor.create("#e00");
};
oFF.UiThemeDefault.prototype.getCustomActivityIndicatorIcon = function()
{
	return "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAYCAYAAADgdz34AAAABHNCSVQICAgIfAhkiAAAAAlwSFlzAAAAsQAAALEBxi1JjQAAABl0RVh0U29mdHdhcmUAd3d3Lmlua3NjYXBlLm9yZ5vuPBoAAAMUSURBVEiJrZZLbFVVFIa/f5/Ti7UWq4bYFNHgQEwkyqAiieiAxGBMjGmJqEQiAx048ZmYaNL2WkwLEZSXGlNmTUysASJOQElQGBGMKWEAxoF1QlQMYNPXvfec/TvoU0ofof2Ha6/z/Wutfc7ZW8ykom9RyH8XnIjmMLXJMd7R8Iz5M0gzruzzEl3L+4D6scigxNG4Ktl6+jGaJb7AvLT+Pv0wm0G4YfTDrEnX8l+nwAFqiFxhs3IFlgJ3ElgG8O0FNx885zfn7sBWaM92W3p7vGqgBkDmy9iavI5kgJ8v+dbGBg0dP+eagSXu7+tH764N0wr+XyC055+NwS37Y8ekEUCiayocoLFBQwAbH9HgPyUdWlpQ1+wdtGevCrqAaLONtrR7bFzP4+QQRcUbAaaq86zvHyn5yL9l/bRng94ASAEoul7knwIYvU9b0j3xVFv6zVzgcWUl1lwZ0cPG6cRUAILyD4DbgDPEsGu+wOvVsl6HC4FNaaLHx2Maex3/BOosb6Sl6vubNRjX1uNeeXmIF9edY2fK1exJpDrgEnl6YqFwgBD5/HLFT59crZGUEBqxEZzyPDZyPvpjhGOJWHF7HV+lIXq5Bdi/LQYc4Mcm7QX2AqSIaoAYQmmxDB7o8fKBgXx/JefrFPsvJIJdvyjzASplmoczNUVzbxoV+oQxrFokPlcrdAexuhDDLlH0gwr5BaDimNRT1JXFMgIIFHURdB6oIomvLBSYHqg8lezOhsKOyp5RA8BwAEB2Kx1etqCKS7rbw65GapiM9jhRe96r9sxqz06yz0tuiv6eR/ex03eMhyb/psXyGoVwCqgFvnNMXqao/nmBP3F1GMgPesRbHDnKjqrnJjqaNCj0Wt4MlIFnFbKzbM+emRO+vbJBA/GMM7ZQGj2Lpi5PP5M/Kq9TDD3AitEM/WJzBOJplP4NZMTsHhQelb0JWEvZUCK64LfoKOyf3QCgw3eFctbqoNdg9EufJgNlw4hMlc9b6Qt06uL1aTPfKgBa/BAx2ybpCeyVNrXKVUAexBp2iCdR1U461DsT4j8tvEUHScegaAAAAABJRU5ErkJggg==";
};
oFF.UiThemeDefault.prototype.getCustomActivityIndicatorIconAlt = function()
{
	return "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAYCAYAAADgdz34AAAABHNCSVQICAgIfAhkiAAAAAlwSFlzAAAAsQAAALEBxi1JjQAAABl0RVh0U29mdHdhcmUAd3d3Lmlua3NjYXBlLm9yZ5vuPBoAAAOgSURBVEiJnZVvTNVlFMc/57k/hHTYBVkRpqzJ8EUNa7iFLuLmi3Bt+aKCRRK0srBpKxxZbZW3tl4UswihPwaJU8Hl5qauFm8aW5PlnAOkco4UUTIJ5Z8wg/u7z+mN9/a7VyTg++p3znPO93vOc357jjBLPFlWthzXVyfwqAqXRXXH0eamQ/+XJ7MhDwSCzuKMC6dAcjxuK0YDR/Y3/TxTrhPvKAoGFyQNjWf7jNvfVFMzAuDP6F1lMTlxoUYtzwEzChiv8cLWqsDCqxN9xkq3ugmD5Vu2vwNgrWOnTxeNfA0OXy+4MjRa0turSdMKFBUV+RRpAdKj3Yl+VLalas3YlWXdQEccuxXLfoCBq6PPW2vbRGlelDwWM5eoQHLaikwPebREAw+3tQVdR3wbgMMKQ6CnReSZIwf3tAOIaEEkQYWAlyA6Ayc8dCnsu3MYSIkp02e6AA4faOgHno6/JACrNIuwEUgSaIyp0GuUb92+AXQfsBhQoGZvXfW26UjjMTAwfnfYp6kZaclnbisA8FJlZao7lfAQRi/s3VV9bjbkXpy7PLQc3M1gxkIJWi+v1dYm+qect0QpRPjTqHwYfPPVX+dKDNDT05Moi/xngUwAEY6Z1MmET0X5AFiLUmTRtmD1l3fNR8Dc4c+MkAOoUmAUfTYubkkYfXw+AheXpp0HfovYAkcd4BqQ6g0U4dp8BB4Tcfv6RvJDzlQpxowNpy9pdozo21alBVhwM67VjP/dOh8BgMxM/zCwK1oswLsff7HSiKxDbL+ZGPw+GAze5mmYGb909eQh0gjcA9Tl5WS9H/Ob1u/5Lj3khgtEufT6KyXtcxY4/cdZIDtiWzQQfSo+/+ZAbsh1z4AeVNHjNbubv5oLuaoKyFKvTzD3RgUs5j3A7zmtqGnct3K2AiKiCrujgnDRxfnBsw/Uf0uW69zq86D1+MkHCJtyREZDOPVrclZsO9HZ04pIunUSj+Xfv2w4OoPPGlpeFNXoQyXQnWSv56akZCfekH92CJIHetJMarC09ImxH9tPZUmYLmDhzQI7R/86v7q4uDjsLSJ6RZWbSr5FtBhoUeWTkGVdRUVF6IZM1gpSBTwCUmkT5WsALOv/IweQB5Mz7suK7zJmZb6xaeMhIH6RF8aaUgggYX6P3YeMmIkF/fECJt4RD1HpjPVoB0BhQe5PilaB9qrQoaJPFRaumpixg+nghtmc4GiDImsVToialyNn6/NX7wR2zpT/L/sqUVMZd9+sAAAAAElFTkSuQmCC";
};

oFF.UiFormItemLambdaListener = function() {};
oFF.UiFormItemLambdaListener.prototype = new oFF.XObject();
oFF.UiFormItemLambdaListener.prototype._ff_c = "UiFormItemLambdaListener";

oFF.UiFormItemLambdaListener.createLambda = function(consumer)
{
	var obj = new oFF.UiFormItemLambdaListener();
	obj.m_consumer = consumer;
	return obj;
};
oFF.UiFormItemLambdaListener.prototype.m_consumer = null;
oFF.UiFormItemLambdaListener.prototype.onFormItemValueChanged = function(item, key, newValue)
{
	this.m_consumer(item);
};
oFF.UiFormItemLambdaListener.prototype.onFormItemEnteredPressed = function(formItem)
{
	this.m_consumer(formItem);
};

oFF.UiDropInfo = function() {};
oFF.UiDropInfo.prototype = new oFF.XObject();
oFF.UiDropInfo.prototype._ff_c = "UiDropInfo";

oFF.UiDropInfo.ITEM_SEPARATOR = ",";
oFF.UiDropInfo.create = function(dropPosition, dropEffect, dropLayout, targetAggregation, allowedElementType, allowedElementTag)
{
	var newObject = new oFF.UiDropInfo();
	newObject.setupInternal(dropPosition, dropEffect, dropLayout, targetAggregation, allowedElementType, allowedElementTag);
	return newObject;
};
oFF.UiDropInfo.createByDropInfoString = function(dropInfoStr)
{
	var newObj = new oFF.UiDropInfo();
	newObj.setupInternal(null, null, null, null, null, null);
	newObj.setByString(dropInfoStr);
	return newObj;
};
oFF.UiDropInfo.prototype.m_dropPosition = null;
oFF.UiDropInfo.prototype.m_dropEffect = null;
oFF.UiDropInfo.prototype.m_dropLayout = null;
oFF.UiDropInfo.prototype.m_targetAggregation = null;
oFF.UiDropInfo.prototype.m_allowedElementType = null;
oFF.UiDropInfo.prototype.m_allowedElementTag = null;
oFF.UiDropInfo.prototype.setupInternal = function(dropPosition, dropEffect, dropLayout, targetAggregation, allowedElementType, allowedElementTag)
{
	this.setDropPosition(oFF.notNull(dropPosition) ? dropPosition : oFF.UiDropPosition.ON);
	this.setDropEffect(oFF.notNull(dropEffect) ? dropEffect : oFF.UiDropEffect.MOVE);
	this.setDropLayout(oFF.notNull(dropLayout) ? dropLayout : oFF.UiDropLayout.DEFAULT);
	this.setTargetAggregation(targetAggregation);
	this.setAllowedElementType(allowedElementType);
	this.setAllowedElementTag(allowedElementTag);
};
oFF.UiDropInfo.prototype.setDropPosition = function(dropPosition)
{
	this.m_dropPosition = dropPosition;
};
oFF.UiDropInfo.prototype.getDropPosition = function()
{
	return this.m_dropPosition;
};
oFF.UiDropInfo.prototype.setDropEffect = function(dropEffect)
{
	this.m_dropEffect = dropEffect;
};
oFF.UiDropInfo.prototype.getDropEffect = function()
{
	return this.m_dropEffect;
};
oFF.UiDropInfo.prototype.setDropLayout = function(dropLayout)
{
	this.m_dropLayout = dropLayout;
};
oFF.UiDropInfo.prototype.getDropLayout = function()
{
	return this.m_dropLayout;
};
oFF.UiDropInfo.prototype.setTargetAggregation = function(targetAggregation)
{
	this.m_targetAggregation = targetAggregation;
};
oFF.UiDropInfo.prototype.getTargetAggregation = function()
{
	return this.m_targetAggregation;
};
oFF.UiDropInfo.prototype.setAllowedElementType = function(allowedElementType)
{
	this.m_allowedElementType = allowedElementType;
};
oFF.UiDropInfo.prototype.getAllowedElementType = function()
{
	return this.m_allowedElementType;
};
oFF.UiDropInfo.prototype.setAllowedElementTag = function(allowedElementTag)
{
	this.m_allowedElementTag = allowedElementTag;
};
oFF.UiDropInfo.prototype.getAllowedElementTag = function()
{
	return this.m_allowedElementTag;
};
oFF.UiDropInfo.prototype.getAsString = function()
{
	var dropPositionStr = null;
	var dropEffectStr = null;
	var dropLayoutStr = null;
	var targetAggregationStr = null;
	var allowedUiElementTypeStr = null;
	var allowedUiElementTagStr = null;
	if (this.getDropPosition() !== null)
	{
		dropPositionStr = this.getDropPosition().getName();
	}
	if (this.getDropEffect() !== null)
	{
		dropEffectStr = this.getDropEffect().getName();
	}
	if (this.getDropLayout() !== null)
	{
		dropLayoutStr = this.getDropLayout().getName();
	}
	if (this.getTargetAggregation() !== null)
	{
		targetAggregationStr = this.getTargetAggregation().getName();
	}
	if (this.getAllowedElementType() !== null)
	{
		allowedUiElementTypeStr = this.getAllowedElementType().getName();
	}
	allowedUiElementTagStr = this.getAllowedElementTag();
	var tmpBuf = oFF.XStringBuffer.create();
	tmpBuf.append(dropPositionStr);
	tmpBuf.append(oFF.UiDropInfo.ITEM_SEPARATOR);
	tmpBuf.append(dropEffectStr);
	tmpBuf.append(oFF.UiDropInfo.ITEM_SEPARATOR);
	tmpBuf.append(dropLayoutStr);
	tmpBuf.append(oFF.UiDropInfo.ITEM_SEPARATOR);
	tmpBuf.append(targetAggregationStr);
	tmpBuf.append(oFF.UiDropInfo.ITEM_SEPARATOR);
	tmpBuf.append(allowedUiElementTypeStr);
	tmpBuf.append(oFF.UiDropInfo.ITEM_SEPARATOR);
	tmpBuf.append(allowedUiElementTagStr);
	return tmpBuf.toString();
};
oFF.UiDropInfo.prototype.setByString = function(strValue)
{
	var dropInfoItems = oFF.XStringTokenizer.splitString(strValue, oFF.UiDropInfo.ITEM_SEPARATOR);
	if (oFF.notNull(dropInfoItems) && dropInfoItems.size() === 6)
	{
		var dropPositionStr = dropInfoItems.get(0);
		var dropEffectStr = dropInfoItems.get(1);
		var dropLayoutStr = dropInfoItems.get(2);
		var targetAggregationStr = dropInfoItems.get(3);
		var allowedUiElementTypeStr = dropInfoItems.get(4);
		var allowedUiElementTagStr = dropInfoItems.get(5);
		var tmpDropPosition = oFF.UiDropPosition.lookup(dropPositionStr);
		if (oFF.notNull(tmpDropPosition))
		{
			this.setDropPosition(tmpDropPosition);
		}
		var tmpDropEffect = oFF.UiDropEffect.lookup(dropEffectStr);
		if (oFF.notNull(tmpDropEffect))
		{
			this.setDropEffect(tmpDropEffect);
		}
		var tmpDropLayout = oFF.UiDropLayout.lookup(dropLayoutStr);
		if (oFF.notNull(tmpDropLayout))
		{
			this.setDropLayout(tmpDropLayout);
		}
		var tmpAggregation = oFF.UiAggregation.lookup(targetAggregationStr);
		this.setTargetAggregation(tmpAggregation);
		var tmpUiElementType = oFF.UiType.lookupUiType(allowedUiElementTypeStr);
		this.setAllowedElementType(tmpUiElementType);
		this.setAllowedElementTag(allowedUiElementTagStr);
	}
};

oFF.UiCssShorthand = function() {};
oFF.UiCssShorthand.prototype = new oFF.XObject();
oFF.UiCssShorthand.prototype._ff_c = "UiCssShorthand";

oFF.UiCssShorthand.CSS_VALUE_SEPARATOR = " ";
oFF.UiCssShorthand.prototype.setCssValue = function(cssValue)
{
	var cssValues = oFF.XStringTokenizer.splitString(cssValue, oFF.UiCssShorthand.CSS_VALUE_SEPARATOR);
	this.parseShorthandStringValues(cssValues);
};
oFF.UiCssShorthand.prototype.getCssValue = function()
{
	return this.convertToShorthandString();
};
oFF.UiCssShorthand.prototype.setByString = function(strValue)
{
	this.setCssValue(strValue);
};
oFF.UiCssShorthand.prototype.getAsString = function()
{
	return this.getCssValue();
};

oFF.UiDropEvent = function() {};
oFF.UiDropEvent.prototype = new oFF.UiControlEvent();
oFF.UiDropEvent.prototype._ff_c = "UiDropEvent";

oFF.UiDropEvent.createDrop = function(control, newParameters, draggedControl, droppedControl, relativeDropPosition)
{
	var newObject = new oFF.UiDropEvent();
	newObject.setupEvent(control, newParameters);
	newObject.m_draggedControl = draggedControl;
	newObject.m_droppedControl = droppedControl;
	newObject.m_relativeDropPosition = relativeDropPosition;
	return newObject;
};
oFF.UiDropEvent.prototype.m_draggedControl = null;
oFF.UiDropEvent.prototype.m_droppedControl = null;
oFF.UiDropEvent.prototype.m_relativeDropPosition = null;
oFF.UiDropEvent.prototype.getDraggedControl = function()
{
	return this.m_draggedControl;
};
oFF.UiDropEvent.prototype.getDroppedControl = function()
{
	return this.m_droppedControl;
};
oFF.UiDropEvent.prototype.getRelativeDropPosition = function()
{
	return this.m_relativeDropPosition;
};

oFF.UiItemEvent = function() {};
oFF.UiItemEvent.prototype = new oFF.UiControlEvent();
oFF.UiItemEvent.prototype._ff_c = "UiItemEvent";

oFF.UiItemEvent.createItem = function(control, newParameters, affectedItem)
{
	var newObject = new oFF.UiItemEvent();
	newObject.setupEvent(control, newParameters);
	newObject.m_affectedItem = affectedItem;
	return newObject;
};
oFF.UiItemEvent.prototype.m_affectedItem = null;
oFF.UiItemEvent.prototype.getAffectedItem = function()
{
	return this.m_affectedItem;
};

oFF.UiMoveEvent = function() {};
oFF.UiMoveEvent.prototype = new oFF.UiControlEvent();
oFF.UiMoveEvent.prototype._ff_c = "UiMoveEvent";

oFF.UiMoveEvent.createMove = function(control, newParameters, offsetX, offsetY)
{
	var newObject = new oFF.UiMoveEvent();
	newObject.setupEvent(control, newParameters);
	newObject.setOffsetX(offsetX);
	newObject.setOffsetY(offsetY);
	return newObject;
};
oFF.UiMoveEvent.prototype.m_offsetX = 0;
oFF.UiMoveEvent.prototype.m_offsetY = 0;
oFF.UiMoveEvent.prototype.setOffsetX = function(offsetX)
{
	this.m_offsetX = offsetX;
};
oFF.UiMoveEvent.prototype.getOffsetX = function()
{
	return this.m_offsetX;
};
oFF.UiMoveEvent.prototype.setOffsetY = function(offsetY)
{
	this.m_offsetY = offsetY;
};
oFF.UiMoveEvent.prototype.getOffsetY = function()
{
	return this.m_offsetY;
};

oFF.UiResizeEvent = function() {};
oFF.UiResizeEvent.prototype = new oFF.UiControlEvent();
oFF.UiResizeEvent.prototype._ff_c = "UiResizeEvent";

oFF.UiResizeEvent.createResize = function(control, newParameters, offsetWidth, offsetHeight)
{
	var newObject = new oFF.UiResizeEvent();
	newObject.setupEvent(control, newParameters);
	newObject.setOffsetWidth(offsetWidth);
	newObject.setOffsetHeight(offsetHeight);
	return newObject;
};
oFF.UiResizeEvent.prototype.m_offsetWidth = 0;
oFF.UiResizeEvent.prototype.m_offsetHeight = 0;
oFF.UiResizeEvent.prototype.setOffsetWidth = function(offsetWidth)
{
	this.m_offsetWidth = offsetWidth;
};
oFF.UiResizeEvent.prototype.getOffsetHeight = function()
{
	return this.m_offsetWidth;
};
oFF.UiResizeEvent.prototype.setOffsetHeight = function(offsetHeight)
{
	this.m_offsetHeight = offsetHeight;
};
oFF.UiResizeEvent.prototype.getOffsetWidth = function()
{
	return this.m_offsetHeight;
};

oFF.UiSelectionEvent = function() {};
oFF.UiSelectionEvent.prototype = new oFF.UiControlEvent();
oFF.UiSelectionEvent.prototype._ff_c = "UiSelectionEvent";

oFF.UiSelectionEvent.PARAM_SELECT_ALL = "selectAll";
oFF.UiSelectionEvent.PARAM_DESELECT_ALL = "deselectAll";
oFF.UiSelectionEvent.PARAM_SELECT = "select";
oFF.UiSelectionEvent.createEmptySelection = function(control, newParameters)
{
	var newObject = new oFF.UiSelectionEvent();
	newObject.setupEvent(control, newParameters);
	return newObject;
};
oFF.UiSelectionEvent.createSingleSelection = function(control, newParameters, selectedItem)
{
	var newObject = new oFF.UiSelectionEvent();
	newObject.setupEvent(control, newParameters);
	if (oFF.notNull(selectedItem))
	{
		newObject.m_selectedItems.add(selectedItem);
	}
	return newObject;
};
oFF.UiSelectionEvent.createMultiSelection = function(control, newParameters, selectedItems)
{
	var newObject = new oFF.UiSelectionEvent();
	newObject.setupEvent(control, newParameters);
	newObject.m_selectedItems.addAll(selectedItems);
	return newObject;
};
oFF.UiSelectionEvent.prototype.m_selectedItems = null;
oFF.UiSelectionEvent.prototype.setupEvent = function(control, parameters)
{
	oFF.UiControlEvent.prototype.setupEvent.call( this , control, parameters);
	this.m_selectedItems = oFF.XList.create();
};
oFF.UiSelectionEvent.prototype.getSelectedItem = function()
{
	if (this.m_selectedItems.size() === 0)
	{
		return null;
	}
	return this.m_selectedItems.get(0);
};
oFF.UiSelectionEvent.prototype.getSelectedName = function()
{
	var selectedItem = this.getSelectedItem();
	if (oFF.notNull(selectedItem))
	{
		return selectedItem.getName();
	}
	return null;
};
oFF.UiSelectionEvent.prototype.getSelectedItemCount = function()
{
	return this.m_selectedItems.size();
};
oFF.UiSelectionEvent.prototype.hasSelectedItems = function()
{
	return this.m_selectedItems.hasElements();
};
oFF.UiSelectionEvent.prototype.getSelectedItems = function()
{
	return this.m_selectedItems;
};

oFF.UiPosition = function() {};
oFF.UiPosition.prototype = new oFF.XObject();
oFF.UiPosition.prototype._ff_c = "UiPosition";

oFF.UiPosition.POSITION_SEPARATOR = ",";
oFF.UiPosition.create = function(xValue, yValue)
{
	var newObj = new oFF.UiPosition();
	newObj.setX(oFF.UiCssLength.createByValue(xValue));
	newObj.setY(oFF.UiCssLength.createByValue(yValue));
	return newObj;
};
oFF.UiPosition.createExt = function(x, y)
{
	var newObj = new oFF.UiPosition();
	newObj.setX(x);
	newObj.setY(y);
	return newObj;
};
oFF.UiPosition.createByCss = function(xCss, yCss)
{
	var newObj = new oFF.UiPosition();
	newObj.setX(oFF.UiCssLength.create(xCss));
	newObj.setY(oFF.UiCssLength.create(yCss));
	return newObj;
};
oFF.UiPosition.createByString = function(positionStr)
{
	var newObj = new oFF.UiPosition();
	newObj.setByString(positionStr);
	return newObj;
};
oFF.UiPosition.createEmpty = function()
{
	return oFF.UiPosition.createByString(null);
};
oFF.UiPosition.prototype.m_x = null;
oFF.UiPosition.prototype.m_y = null;
oFF.UiPosition.prototype.setByValue = function(xValue, yValue)
{
	this.setX(oFF.UiCssLength.createByValue(xValue));
	this.setY(oFF.UiCssLength.createByValue(yValue));
};
oFF.UiPosition.prototype.setByCss = function(xCss, yCss)
{
	this.setX(oFF.UiCssLength.create(xCss));
	this.setY(oFF.UiCssLength.create(yCss));
};
oFF.UiPosition.prototype.setX = function(x)
{
	this.m_x = x;
};
oFF.UiPosition.prototype.getX = function()
{
	return this.m_x;
};
oFF.UiPosition.prototype.setY = function(y)
{
	this.m_y = y;
};
oFF.UiPosition.prototype.getY = function()
{
	return this.m_y;
};
oFF.UiPosition.prototype.getAsString = function()
{
	var xStr = null;
	var yStr = null;
	if (this.getX() !== null)
	{
		xStr = this.getX().getCssValue();
	}
	if (this.getY() !== null)
	{
		yStr = this.getY().getCssValue();
	}
	return oFF.XStringUtils.concatenate3(xStr, oFF.UiPosition.POSITION_SEPARATOR, yStr);
};
oFF.UiPosition.prototype.setByString = function(strValue)
{
	var positions = oFF.XStringTokenizer.splitString(strValue, oFF.UiPosition.POSITION_SEPARATOR);
	if (oFF.notNull(positions) && positions.size() === 2)
	{
		var newPosX = positions.get(0);
		var newPosY = positions.get(1);
		this.setX(oFF.UiCssLength.create(newPosX));
		this.setY(oFF.UiCssLength.create(newPosY));
	}
};

oFF.UiSize = function() {};
oFF.UiSize.prototype = new oFF.XObject();
oFF.UiSize.prototype._ff_c = "UiSize";

oFF.UiSize.SIZE_SEPARATOR = ",";
oFF.UiSize.create = function(widthValue, heightValue)
{
	var newObj = new oFF.UiSize();
	newObj.setWidth(oFF.UiCssLength.createByValue(widthValue));
	newObj.setHeight(oFF.UiCssLength.createByValue(heightValue));
	return newObj;
};
oFF.UiSize.createExt = function(width, height)
{
	var newObj = new oFF.UiSize();
	newObj.setWidth(width);
	newObj.setHeight(height);
	return newObj;
};
oFF.UiSize.createByCss = function(widthCss, heightCss)
{
	var newObj = new oFF.UiSize();
	newObj.setWidth(oFF.XStringUtils.isNotNullAndNotEmpty(heightCss) ? oFF.UiCssLength.create(widthCss) : null);
	newObj.setHeight(oFF.XStringUtils.isNotNullAndNotEmpty(heightCss) ? oFF.UiCssLength.create(heightCss) : null);
	return newObj;
};
oFF.UiSize.createByString = function(sizeStr)
{
	var newObj = new oFF.UiSize();
	newObj.setByString(sizeStr);
	return newObj;
};
oFF.UiSize.createEmpty = function()
{
	return oFF.UiSize.createByString(null);
};
oFF.UiSize.createMax = function()
{
	var newObj = new oFF.UiSize();
	newObj.setWidth(oFF.UiCssLength.create("100%"));
	newObj.setHeight(oFF.UiCssLength.create("100%"));
	return newObj;
};
oFF.UiSize.prototype.m_width = null;
oFF.UiSize.prototype.m_height = null;
oFF.UiSize.prototype.setByValue = function(widthValue, heightValue)
{
	this.setWidth(oFF.UiCssLength.createByValue(widthValue));
	this.setHeight(oFF.UiCssLength.createByValue(heightValue));
};
oFF.UiSize.prototype.setByCss = function(widthCss, heightCss)
{
	this.setWidth(oFF.XStringUtils.isNotNullAndNotEmpty(heightCss) ? oFF.UiCssLength.create(widthCss) : null);
	this.setHeight(oFF.XStringUtils.isNotNullAndNotEmpty(heightCss) ? oFF.UiCssLength.create(heightCss) : null);
};
oFF.UiSize.prototype.getWidth = function()
{
	return this.m_width;
};
oFF.UiSize.prototype.setWidth = function(width)
{
	this.m_width = width;
};
oFF.UiSize.prototype.getHeight = function()
{
	return this.m_height;
};
oFF.UiSize.prototype.setHeight = function(height)
{
	this.m_height = height;
};
oFF.UiSize.prototype.getAsString = function()
{
	var widthStr = null;
	var heightStr = null;
	if (this.getWidth() !== null)
	{
		widthStr = this.getWidth().getCssValue();
	}
	if (this.getHeight() !== null)
	{
		heightStr = this.getHeight().getCssValue();
	}
	return oFF.XStringUtils.concatenate3(widthStr, oFF.UiSize.SIZE_SEPARATOR, heightStr);
};
oFF.UiSize.prototype.setByString = function(strValue)
{
	var sizes = oFF.XStringTokenizer.splitString(strValue, oFF.UiSize.SIZE_SEPARATOR);
	if (oFF.notNull(sizes) && sizes.size() === 2)
	{
		var newWidth = sizes.get(0);
		var newHeight = sizes.get(1);
		this.setWidth(oFF.UiCssLength.create(newWidth));
		this.setHeight(oFF.UiCssLength.create(newHeight));
	}
};
oFF.UiSize.prototype.isMax = function()
{
	return this.getWidth() !== null && oFF.XString.isEqual(this.getWidth().getCssValue(), "100%") && this.getHeight() !== null && oFF.XString.isEqual(this.getHeight().getCssValue(), "100%");
};

oFF.UiGenesisGeneric = function() {};
oFF.UiGenesisGeneric.prototype = new oFF.XObject();
oFF.UiGenesisGeneric.prototype._ff_c = "UiGenesisGeneric";

oFF.UiGenesisGeneric.prototype.releaseObject = function()
{
	oFF.XObject.prototype.releaseObject.call( this );
};
oFF.UiGenesisGeneric.prototype.newControl = function(uiType)
{
	oFF.XException.createUnsupportedOperationException();
	return null;
};
oFF.UiGenesisGeneric.prototype.newBasicControl = function(uiType, styleClass, identifier, name)
{
	oFF.XException.createUnsupportedOperationException();
	return null;
};
oFF.UiGenesisGeneric.prototype.newControlExt = function(uiType, styleClass, identifier, name, parent, operation, position, firstIndex, secondIndex)
{
	oFF.XException.createUnsupportedOperationException();
	return null;
};
oFF.UiGenesisGeneric.prototype.getUiManager = function()
{
	oFF.XException.createUnsupportedOperationException();
	return null;
};
oFF.UiGenesisGeneric.prototype.showErrorToast = function(message)
{
	oFF.UiMessageUtils.showErrorToast(this, message);
};
oFF.UiGenesisGeneric.prototype.showSuccessToast = function(message)
{
	oFF.UiMessageUtils.showSuccessToast(this, message);
};
oFF.UiGenesisGeneric.prototype.showWarningToast = function(message)
{
	oFF.UiMessageUtils.showWarningToast(this, message);
};
oFF.UiGenesisGeneric.prototype.showInfoToast = function(message)
{
	oFF.UiMessageUtils.showInfoToast(this, message);
};
oFF.UiGenesisGeneric.prototype.showAlert = function(title, message)
{
	oFF.UiMessageUtils.showAlert(this, title, message);
};

oFF.UiManagerSubSystemFactory = function() {};
oFF.UiManagerSubSystemFactory.prototype = new oFF.SubSystemFactory();
oFF.UiManagerSubSystemFactory.prototype._ff_c = "UiManagerSubSystemFactory";

oFF.UiManagerSubSystemFactory.staticSetup = function()
{
	oFF.SubSystemFactory.registerFactory(oFF.SubSystemType.GUI, new oFF.UiManagerSubSystemFactory());
};
oFF.UiManagerSubSystemFactory.prototype.newSubSystem = function(process)
{
	var uiManager = oFF.UiManagerFactory.newInstance(process);
	return uiManager;
};

oFF.UiClientOperationAggregation = function() {};
oFF.UiClientOperationAggregation.prototype = new oFF.UiClientOperation();
oFF.UiClientOperationAggregation.prototype._ff_c = "UiClientOperationAggregation";

oFF.UiClientOperationAggregation.AGGREGATION_OP_TYPE_ADD = "Add";
oFF.UiClientOperationAggregation.AGGREGATION_OP_TYPE_INSERT = "Insert";
oFF.UiClientOperationAggregation.AGGREGATION_OP_TYPE_REMOVE = "Remove";
oFF.UiClientOperationAggregation.AGGREGATION_OP_TYPE_CLEAR = "Clear";
oFF.UiClientOperationAggregation.prototype.m_aggregationDef = null;
oFF.UiClientOperationAggregation.prototype.m_operationName = null;
oFF.UiClientOperationAggregation.prototype.m_aggregationOpType = null;
oFF.UiClientOperationAggregation.prototype.getAggregationItemType = function()
{
	if (oFF.notNull(this.m_aggregationDef))
	{
		return this.m_aggregationDef.getItemType();
	}
	return null;
};
oFF.UiClientOperationAggregation.prototype.getAggregationDef = function()
{
	return this.m_aggregationDef;
};
oFF.UiClientOperationAggregation.prototype.setAggregationDef = function(aggrDef)
{
	this.m_aggregationDef = aggrDef;
};
oFF.UiClientOperationAggregation.prototype.getName = function()
{
	return this.m_operationName;
};
oFF.UiClientOperationAggregation.prototype.setName = function(name)
{
	this.m_operationName = name;
};
oFF.UiClientOperationAggregation.prototype.setIsAddAggregationOp = function(aggrDef)
{
	this.setAggregationDef(aggrDef);
	this.setName(aggrDef.getAddMethodName());
	this.m_aggregationOpType = oFF.UiClientOperationAggregation.AGGREGATION_OP_TYPE_ADD;
};
oFF.UiClientOperationAggregation.prototype.setIsInsertAggregationOp = function(aggrDef)
{
	this.setAggregationDef(aggrDef);
	this.setName(aggrDef.getInsertMethodName());
	this.m_aggregationOpType = oFF.UiClientOperationAggregation.AGGREGATION_OP_TYPE_INSERT;
};
oFF.UiClientOperationAggregation.prototype.setIsRemoveAggregationOp = function(aggrDef)
{
	this.setAggregationDef(aggrDef);
	this.setName(aggrDef.getRemoveMethodName());
	this.m_aggregationOpType = oFF.UiClientOperationAggregation.AGGREGATION_OP_TYPE_REMOVE;
};
oFF.UiClientOperationAggregation.prototype.setIsClearAggregationOp = function(aggrDef)
{
	this.setAggregationDef(aggrDef);
	this.setName(aggrDef.getClearMethodName());
	this.m_aggregationOpType = oFF.UiClientOperationAggregation.AGGREGATION_OP_TYPE_CLEAR;
};
oFF.UiClientOperationAggregation.prototype.executeOperation = function(client, uiContext, operation, offset)
{
	var paramId = operation.getStringAt(offset);
	var control = client.getContext(paramId);
	if (oFF.XString.isEqual(this.m_aggregationOpType, oFF.UiClientOperationAggregation.AGGREGATION_OP_TYPE_ADD))
	{
		this.executeAddIntoAggregation(uiContext, control);
		return null;
	}
	else if (oFF.XString.isEqual(this.m_aggregationOpType, oFF.UiClientOperationAggregation.AGGREGATION_OP_TYPE_INSERT))
	{
		var index = operation.getIntegerAt(offset + 1);
		this.executeInsertIntoAggregation(uiContext, control, index);
		return null;
	}
	else if (oFF.XString.isEqual(this.m_aggregationOpType, oFF.UiClientOperationAggregation.AGGREGATION_OP_TYPE_REMOVE))
	{
		this.executeRemoveFromAggregation(uiContext, control);
		return control;
	}
	else if (oFF.XString.isEqual(this.m_aggregationOpType, oFF.UiClientOperationAggregation.AGGREGATION_OP_TYPE_CLEAR))
	{
		this.executeClearAggregation(uiContext);
		return uiContext;
	}
	throw oFF.XException.createRuntimeException("Failed to execute aggregation operation.");
};

oFF.UiClientOperationListener = function() {};
oFF.UiClientOperationListener.prototype = new oFF.UiClientOperation();
oFF.UiClientOperationListener.prototype._ff_c = "UiClientOperationListener";

oFF.UiClientOperationListener.prototype.executeOperation = function(client, uiContext, operation, offset)
{
	return this.executeRegisterListener(uiContext, client);
};
oFF.UiClientOperationListener.prototype.getEventType = oFF.noSupport;
oFF.UiClientOperationListener.prototype.getName = function()
{
	var tmpEvent = this.getEventType();
	if (oFF.notNull(tmpEvent))
	{
		return tmpEvent.getRegisterMethodName();
	}
	throw oFF.XException.createRuntimeException("Missing event type for listener registration. Check events registration!");
};

oFF.UiClientOperationProp = function() {};
oFF.UiClientOperationProp.prototype = new oFF.UiClientOperation();
oFF.UiClientOperationProp.prototype._ff_c = "UiClientOperationProp";

oFF.UiClientOperationProp.prototype.m_operationName = null;
oFF.UiClientOperationProp.prototype.m_propertyName = null;
oFF.UiClientOperationProp.prototype.m_isSetter = false;
oFF.UiClientOperationProp.prototype.getName = function()
{
	return this.m_operationName;
};
oFF.UiClientOperationProp.prototype.setName = function(name)
{
	this.m_operationName = name;
};
oFF.UiClientOperationProp.prototype.getPropertyName = function()
{
	return this.m_propertyName;
};
oFF.UiClientOperationProp.prototype.setPropertyName = function(propertyName)
{
	this.m_propertyName = propertyName;
};
oFF.UiClientOperationProp.prototype.isSetter = function()
{
	return this.m_isSetter;
};
oFF.UiClientOperationProp.prototype.setIsSetter = function(isSetter)
{
	this.m_isSetter = isSetter;
};
oFF.UiClientOperationProp.prototype.importProperty = function(target, value)
{
	return target;
};
oFF.UiClientOperationProp.prototype.exportProperty = function(source, target) {};
oFF.UiClientOperationProp.prototype.executeOperation = function(client, uiContext, operation, offset)
{
	if (this.m_isSetter)
	{
		return this.executeSetterOperation(client, uiContext, operation, offset);
	}
	return this.executeGetterOperation(client, uiContext, operation, offset);
};

oFF.UiClientOpSetCommandHistory = function() {};
oFF.UiClientOpSetCommandHistory.prototype = new oFF.UiClientOperation();
oFF.UiClientOpSetCommandHistory.prototype._ff_c = "UiClientOpSetCommandHistory";

oFF.UiClientOpSetCommandHistory.prototype.getName = function()
{
	return oFF.UiProperty.COMMAND_HISTORY.getSetterMethodName();
};
oFF.UiClientOpSetCommandHistory.prototype.executeOperation = function(client, uiContext, operation, offset)
{
	var commandsStr = operation.getStringAt(offset);
	var commandsList = oFF.XStringTokenizer.splitString(commandsStr, oFF.UiRemoteProtocol.MULTI_ITEM_SEPARATOR);
	var uiReturnContext = null;
	if (oFF.notNull(uiContext))
	{
		uiReturnContext = uiContext.setCommandHistory(commandsList);
	}
	return uiReturnContext;
};

oFF.UiClientOpSetFirstVisibleRow = function() {};
oFF.UiClientOpSetFirstVisibleRow.prototype = new oFF.UiClientOperation();
oFF.UiClientOpSetFirstVisibleRow.prototype._ff_c = "UiClientOpSetFirstVisibleRow";

oFF.UiClientOpSetFirstVisibleRow.prototype.getName = function()
{
	return oFF.UiProperty.FIRST_VISIBLE_ROW.getSetterMethodName();
};
oFF.UiClientOpSetFirstVisibleRow.prototype.executeOperation = function(client, uiContext, operation, offset)
{
	var uiReturnContext = null;
	var paramId = operation.getStringAt(offset);
	uiReturnContext = uiContext.setFirstVisibleRow(client.getContext(paramId));
	return uiReturnContext;
};

oFF.UiClientOpClearFooter = function() {};
oFF.UiClientOpClearFooter.prototype = new oFF.UiClientOperation();
oFF.UiClientOpClearFooter.prototype._ff_c = "UiClientOpClearFooter";

oFF.UiClientOpClearFooter.prototype.getName = function()
{
	return oFF.UiProperty.FOOTER.getClearMethodName();
};
oFF.UiClientOpClearFooter.prototype.executeOperation = function(client, uiContext, operation, offset)
{
	uiContext.clearFooter();
	return uiContext;
};

oFF.UiClientOpSetFooter = function() {};
oFF.UiClientOpSetFooter.prototype = new oFF.UiClientOperation();
oFF.UiClientOpSetFooter.prototype._ff_c = "UiClientOpSetFooter";

oFF.UiClientOpSetFooter.prototype.getName = function()
{
	return oFF.UiProperty.FOOTER.getSetterMethodName();
};
oFF.UiClientOpSetFooter.prototype.executeOperation = function(client, uiContext, operation, offset)
{
	var uiReturnContext = null;
	var paramId = operation.getStringAt(offset);
	uiReturnContext = uiContext.setFooter(client.getContext(paramId));
	return uiReturnContext;
};

oFF.UiClientOpClearHeader = function() {};
oFF.UiClientOpClearHeader.prototype = new oFF.UiClientOperation();
oFF.UiClientOpClearHeader.prototype._ff_c = "UiClientOpClearHeader";

oFF.UiClientOpClearHeader.prototype.getName = function()
{
	return oFF.UiProperty.HEADER.getClearMethodName();
};
oFF.UiClientOpClearHeader.prototype.executeOperation = function(client, uiContext, operation, offset)
{
	uiContext.clearHeader();
	return uiContext;
};

oFF.UiClientOpSetHeader = function() {};
oFF.UiClientOpSetHeader.prototype = new oFF.UiClientOperation();
oFF.UiClientOpSetHeader.prototype._ff_c = "UiClientOpSetHeader";

oFF.UiClientOpSetHeader.prototype.getName = function()
{
	return oFF.UiProperty.HEADER.getSetterMethodName();
};
oFF.UiClientOpSetHeader.prototype.executeOperation = function(client, uiContext, operation, offset)
{
	var uiReturnContext = null;
	var paramId = operation.getStringAt(offset);
	uiReturnContext = uiContext.setHeader(client.getContext(paramId));
	return uiReturnContext;
};

oFF.UiClientOpBack = function() {};
oFF.UiClientOpBack.prototype = new oFF.UiClientOperation();
oFF.UiClientOpBack.prototype._ff_c = "UiClientOpBack";

oFF.UiClientOpBack.prototype.getName = function()
{
	return oFF.UiMethod.BACK.getMethodName();
};
oFF.UiClientOpBack.prototype.executeOperation = function(client, uiContext, operation, offset)
{
	if (oFF.notNull(uiContext))
	{
		uiContext.back();
	}
	return uiContext;
};

oFF.UiClientOpBringToFront = function() {};
oFF.UiClientOpBringToFront.prototype = new oFF.UiClientOperation();
oFF.UiClientOpBringToFront.prototype._ff_c = "UiClientOpBringToFront";

oFF.UiClientOpBringToFront.prototype.getName = function()
{
	return oFF.UiMethod.BRING_TO_FRONT.getMethodName();
};
oFF.UiClientOpBringToFront.prototype.executeOperation = function(client, uiContext, operation, offset)
{
	if (oFF.notNull(uiContext))
	{
		uiContext.bringToFront();
	}
	return uiContext;
};

oFF.UiClientOpClose = function() {};
oFF.UiClientOpClose.prototype = new oFF.UiClientOperation();
oFF.UiClientOpClose.prototype._ff_c = "UiClientOpClose";

oFF.UiClientOpClose.prototype.getName = function()
{
	return oFF.UiMethod.CLOSE.getMethodName();
};
oFF.UiClientOpClose.prototype.executeOperation = function(client, uiContext, operation, offset)
{
	if (oFF.notNull(uiContext))
	{
		uiContext.close();
	}
	return uiContext;
};

oFF.UiClientOpCloseSuggestions = function() {};
oFF.UiClientOpCloseSuggestions.prototype = new oFF.UiClientOperation();
oFF.UiClientOpCloseSuggestions.prototype._ff_c = "UiClientOpCloseSuggestions";

oFF.UiClientOpCloseSuggestions.prototype.getName = function()
{
	return oFF.UiMethod.CLOSE_SUGGESTIONS.getMethodName();
};
oFF.UiClientOpCloseSuggestions.prototype.executeOperation = function(client, uiContext, operation, offset)
{
	if (oFF.notNull(uiContext))
	{
		uiContext.closeSuggestions();
	}
	return uiContext;
};

oFF.UiClientOpCollapseAll = function() {};
oFF.UiClientOpCollapseAll.prototype = new oFF.UiClientOperation();
oFF.UiClientOpCollapseAll.prototype._ff_c = "UiClientOpCollapseAll";

oFF.UiClientOpCollapseAll.prototype.getName = function()
{
	return oFF.UiMethod.COLLAPSE_ALL.getMethodName();
};
oFF.UiClientOpCollapseAll.prototype.executeOperation = function(client, uiContext, operation, offset)
{
	if (oFF.notNull(uiContext))
	{
		uiContext.collapseAll();
	}
	return uiContext;
};

oFF.UiClientOpExpandToLevel = function() {};
oFF.UiClientOpExpandToLevel.prototype = new oFF.UiClientOperation();
oFF.UiClientOpExpandToLevel.prototype._ff_c = "UiClientOpExpandToLevel";

oFF.UiClientOpExpandToLevel.prototype.getName = function()
{
	return oFF.UiMethod.EXPAND_TO_LEVEL.getMethodName();
};
oFF.UiClientOpExpandToLevel.prototype.executeOperation = function(client, uiContext, operation, offset)
{
	var level = 0;
	if (operation.size() > offset)
	{
		level = operation.getIntegerAt(offset);
	}
	if (oFF.notNull(uiContext))
	{
		uiContext.expandToLevel(level);
	}
	return uiContext;
};

oFF.UiClientOpFocus = function() {};
oFF.UiClientOpFocus.prototype = new oFF.UiClientOperation();
oFF.UiClientOpFocus.prototype._ff_c = "UiClientOpFocus";

oFF.UiClientOpFocus.prototype.getName = function()
{
	return oFF.UiMethod.FOCUS.getMethodName();
};
oFF.UiClientOpFocus.prototype.executeOperation = function(client, uiContext, operation, offset)
{
	if (oFF.notNull(uiContext))
	{
		uiContext.focus();
	}
	return uiContext;
};

oFF.UiClientOpFullscreen = function() {};
oFF.UiClientOpFullscreen.prototype = new oFF.UiClientOperation();
oFF.UiClientOpFullscreen.prototype._ff_c = "UiClientOpFullscreen";

oFF.UiClientOpFullscreen.prototype.getName = function()
{
	return oFF.UiMethod.FULLSCREEN.getMethodName();
};
oFF.UiClientOpFullscreen.prototype.executeOperation = function(client, uiContext, operation, offset)
{
	if (oFF.notNull(uiContext))
	{
		uiContext.fullscreen();
	}
	return uiContext;
};

oFF.UiClientOpHide = function() {};
oFF.UiClientOpHide.prototype = new oFF.UiClientOperation();
oFF.UiClientOpHide.prototype._ff_c = "UiClientOpHide";

oFF.UiClientOpHide.prototype.getName = function()
{
	return oFF.UiMethod.HIDE.getMethodName();
};
oFF.UiClientOpHide.prototype.executeOperation = function(client, uiContext, operation, offset)
{
	var animated = true;
	var refControl = null;
	if (operation.size() > offset)
	{
		animated = operation.getBooleanAt(offset);
		var paramId = operation.getStringAt(offset + 1);
		if (oFF.notNull(client))
		{
			refControl = client.getContext(paramId);
		}
	}
	if (oFF.notNull(uiContext))
	{
		uiContext.hide(animated, refControl);
	}
	return uiContext;
};

oFF.UiClientOpMaximize = function() {};
oFF.UiClientOpMaximize.prototype = new oFF.UiClientOperation();
oFF.UiClientOpMaximize.prototype._ff_c = "UiClientOpMaximize";

oFF.UiClientOpMaximize.prototype.getName = function()
{
	return oFF.UiMethod.MAXIMIZE.getMethodName();
};
oFF.UiClientOpMaximize.prototype.executeOperation = function(client, uiContext, operation, offset)
{
	var animated = true;
	if (operation.size() > offset)
	{
		animated = operation.getBooleanAt(offset);
	}
	if (oFF.notNull(uiContext))
	{
		uiContext.maximize(animated);
	}
	return uiContext;
};

oFF.UiClientOpOpen = function() {};
oFF.UiClientOpOpen.prototype = new oFF.UiClientOperation();
oFF.UiClientOpOpen.prototype._ff_c = "UiClientOpOpen";

oFF.UiClientOpOpen.prototype.getName = function()
{
	return oFF.UiMethod.OPEN.getMethodName();
};
oFF.UiClientOpOpen.prototype.executeOperation = function(client, uiContext, operation, offset)
{
	if (oFF.notNull(uiContext))
	{
		uiContext.open();
	}
	return uiContext;
};

oFF.UiClientOpOpenAt = function() {};
oFF.UiClientOpOpenAt.prototype = new oFF.UiClientOperation();
oFF.UiClientOpOpenAt.prototype._ff_c = "UiClientOpOpenAt";

oFF.UiClientOpOpenAt.prototype.getName = function()
{
	return oFF.UiMethod.OPEN_AT.getMethodName();
};
oFF.UiClientOpOpenAt.prototype.executeOperation = function(client, uiContext, operation, offset)
{
	var control = null;
	if (operation.size() > offset)
	{
		var paramId = operation.getStringAt(offset);
		if (oFF.notNull(client))
		{
			control = client.getContext(paramId);
		}
	}
	if (oFF.notNull(uiContext))
	{
		uiContext.openAt(control);
	}
	return uiContext;
};

oFF.UiClientOpOpenAtPosition = function() {};
oFF.UiClientOpOpenAtPosition.prototype = new oFF.UiClientOperation();
oFF.UiClientOpOpenAtPosition.prototype._ff_c = "UiClientOpOpenAtPosition";

oFF.UiClientOpOpenAtPosition.prototype.getName = function()
{
	return oFF.UiMethod.OPEN_AT_POSITION.getMethodName();
};
oFF.UiClientOpOpenAtPosition.prototype.executeOperation = function(client, uiContext, operation, offset)
{
	var posX = 0;
	var posY = 0;
	if (operation.size() > offset)
	{
		posX = operation.getIntegerAtExt(offset, 0);
		posY = operation.getIntegerAtExt(offset + 1, 0);
	}
	if (oFF.notNull(uiContext))
	{
		uiContext.openAtPosition(posX, posY);
	}
	return uiContext;
};

oFF.UiClientOpPopToPage = function() {};
oFF.UiClientOpPopToPage.prototype = new oFF.UiClientOperation();
oFF.UiClientOpPopToPage.prototype._ff_c = "UiClientOpPopToPage";

oFF.UiClientOpPopToPage.prototype.getName = function()
{
	return oFF.UiMethod.POP_TO_PAGE.getMethodName();
};
oFF.UiClientOpPopToPage.prototype.executeOperation = function(client, uiContext, operation, offset)
{
	var navigationPage = null;
	if (operation.size() > offset)
	{
		var paramId = operation.getStringAt(offset);
		if (oFF.notNull(client))
		{
			navigationPage = client.getContext(paramId);
		}
	}
	if (oFF.notNull(uiContext))
	{
		uiContext.popToPage(navigationPage);
	}
	return uiContext;
};

oFF.UiClientOpPrint = function() {};
oFF.UiClientOpPrint.prototype = new oFF.UiClientOperation();
oFF.UiClientOpPrint.prototype._ff_c = "UiClientOpPrint";

oFF.UiClientOpPrint.prototype.getName = function()
{
	return oFF.UiMethod.PRINT.getMethodName();
};
oFF.UiClientOpPrint.prototype.executeOperation = function(client, uiContext, operation, offset)
{
	var text = null;
	if (operation.size() > offset)
	{
		text = operation.getStringAt(offset);
	}
	if (oFF.notNull(uiContext))
	{
		uiContext.print(text);
	}
	return uiContext;
};

oFF.UiClientOpPrintln = function() {};
oFF.UiClientOpPrintln.prototype = new oFF.UiClientOperation();
oFF.UiClientOpPrintln.prototype._ff_c = "UiClientOpPrintln";

oFF.UiClientOpPrintln.prototype.getName = function()
{
	return oFF.UiMethod.PRINTLN.getMethodName();
};
oFF.UiClientOpPrintln.prototype.executeOperation = function(client, uiContext, operation, offset)
{
	var text = null;
	if (operation.size() > offset)
	{
		text = operation.getStringAt(offset);
	}
	if (oFF.notNull(uiContext))
	{
		uiContext.println(text);
	}
	return uiContext;
};

oFF.UiClientOpRestore = function() {};
oFF.UiClientOpRestore.prototype = new oFF.UiClientOperation();
oFF.UiClientOpRestore.prototype._ff_c = "UiClientOpRestore";

oFF.UiClientOpRestore.prototype.getName = function()
{
	return oFF.UiMethod.RESTORE.getMethodName();
};
oFF.UiClientOpRestore.prototype.executeOperation = function(client, uiContext, operation, offset)
{
	var animated = true;
	if (operation.size() > offset)
	{
		animated = operation.getBooleanAt(offset);
	}
	if (oFF.notNull(uiContext))
	{
		uiContext.restore(animated);
	}
	return uiContext;
};

oFF.UiClientOpScrollTo = function() {};
oFF.UiClientOpScrollTo.prototype = new oFF.UiClientOperation();
oFF.UiClientOpScrollTo.prototype._ff_c = "UiClientOpScrollTo";

oFF.UiClientOpScrollTo.prototype.getName = function()
{
	return oFF.UiMethod.SCROLL_TO.getMethodName();
};
oFF.UiClientOpScrollTo.prototype.executeOperation = function(client, uiContext, operation, offset)
{
	var x = 0;
	var y = 0;
	var duration = 0;
	if (operation.size() > offset)
	{
		x = operation.getIntegerAtExt(offset, 0);
		y = operation.getIntegerAtExt(offset + 1, 0);
		duration = operation.getIntegerAtExt(offset + 2, 0);
	}
	if (oFF.notNull(uiContext))
	{
		uiContext.scrollTo(x, y, duration);
	}
	return uiContext;
};

oFF.UiClientOpScrollToControl = function() {};
oFF.UiClientOpScrollToControl.prototype = new oFF.UiClientOperation();
oFF.UiClientOpScrollToControl.prototype._ff_c = "UiClientOpScrollToControl";

oFF.UiClientOpScrollToControl.prototype.getName = function()
{
	return oFF.UiMethod.SCROLL_TO_CONTROL.getMethodName();
};
oFF.UiClientOpScrollToControl.prototype.executeOperation = function(client, uiContext, operation, offset)
{
	var control = null;
	var duration = 0;
	if (operation.size() > offset)
	{
		var paramId = operation.getStringAt(offset);
		if (oFF.notNull(client))
		{
			control = client.getContext(paramId);
		}
		duration = operation.getIntegerAtExt(offset + 1, 0);
	}
	if (oFF.notNull(uiContext))
	{
		uiContext.scrollToControl(control, duration);
	}
	return uiContext;
};

oFF.UiClientOpSelectText = function() {};
oFF.UiClientOpSelectText.prototype = new oFF.UiClientOperation();
oFF.UiClientOpSelectText.prototype._ff_c = "UiClientOpSelectText";

oFF.UiClientOpSelectText.prototype.getName = function()
{
	return oFF.UiMethod.SELECT_TEXT.getMethodName();
};
oFF.UiClientOpSelectText.prototype.executeOperation = function(client, uiContext, operation, offset)
{
	var startIndex = 0;
	var endIndex = 0;
	if (operation.size() > offset)
	{
		startIndex = operation.getIntegerAtExt(offset, 0);
		endIndex = operation.getIntegerAtExt(offset + 1, 0);
	}
	if (oFF.notNull(uiContext))
	{
		uiContext.selectText(startIndex, endIndex);
	}
	return uiContext;
};

oFF.UiClientOpShake = function() {};
oFF.UiClientOpShake.prototype = new oFF.UiClientOperation();
oFF.UiClientOpShake.prototype._ff_c = "UiClientOpShake";

oFF.UiClientOpShake.prototype.getName = function()
{
	return oFF.UiMethod.SHAKE.getMethodName();
};
oFF.UiClientOpShake.prototype.executeOperation = function(client, uiContext, operation, offset)
{
	if (oFF.notNull(uiContext))
	{
		uiContext.shake();
	}
	return uiContext;
};

oFF.UiClientOpShow = function() {};
oFF.UiClientOpShow.prototype = new oFF.UiClientOperation();
oFF.UiClientOpShow.prototype._ff_c = "UiClientOpShow";

oFF.UiClientOpShow.prototype.getName = function()
{
	return oFF.UiMethod.SHOW.getMethodName();
};
oFF.UiClientOpShow.prototype.executeOperation = function(client, uiContext, operation, offset)
{
	var animated = true;
	var refControl = null;
	if (operation.size() > offset)
	{
		animated = operation.getBooleanAt(offset);
		var paramId = operation.getStringAt(offset);
		if (oFF.notNull(client))
		{
			refControl = client.getContext(paramId);
		}
	}
	if (oFF.notNull(uiContext))
	{
		uiContext.show(animated, refControl);
	}
	return uiContext;
};

oFF.UiClientOpShowSuggestions = function() {};
oFF.UiClientOpShowSuggestions.prototype = new oFF.UiClientOperation();
oFF.UiClientOpShowSuggestions.prototype._ff_c = "UiClientOpShowSuggestions";

oFF.UiClientOpShowSuggestions.prototype.getName = function()
{
	return oFF.UiMethod.SHOW_SUGGESTIONS.getMethodName();
};
oFF.UiClientOpShowSuggestions.prototype.executeOperation = function(client, uiContext, operation, offset)
{
	if (oFF.notNull(uiContext))
	{
		uiContext.showSuggestions();
	}
	return uiContext;
};

oFF.UiClientOpStartReadLine = function() {};
oFF.UiClientOpStartReadLine.prototype = new oFF.UiClientOperation();
oFF.UiClientOpStartReadLine.prototype._ff_c = "UiClientOpStartReadLine";

oFF.UiClientOpStartReadLine.prototype.getName = function()
{
	return oFF.UiMethod.START_READ_LINE.getMethodName();
};
oFF.UiClientOpStartReadLine.prototype.executeOperation = function(client, uiContext, operation, offset)
{
	var text = null;
	var numOfChars = 0;
	if (operation.size() > offset)
	{
		text = operation.getStringAtExt(offset, null);
		numOfChars = operation.getIntegerAtExt(offset + 1, 0);
	}
	if (oFF.notNull(uiContext))
	{
		uiContext.startReadLine(text, numOfChars);
	}
	return uiContext;
};

oFF.UiClientOpAdd = function() {};
oFF.UiClientOpAdd.prototype = new oFF.UiClientOperation();
oFF.UiClientOpAdd.prototype._ff_c = "UiClientOpAdd";

oFF.UiClientOpAdd.prototype.getName = function()
{
	return oFF.UiRemoteProtocol.OP_ADD;
};
oFF.UiClientOpAdd.prototype.executeOperation = function(client, uiContext, operation, offset)
{
	var paramId = operation.getStringAt(offset);
	uiContext.add(client.getContext(paramId));
	return null;
};

oFF.UiClientOpClearChildItems = function() {};
oFF.UiClientOpClearChildItems.prototype = new oFF.UiClientOperation();
oFF.UiClientOpClearChildItems.prototype._ff_c = "UiClientOpClearChildItems";

oFF.UiClientOpClearChildItems.prototype.getName = function()
{
	return oFF.UiRemoteProtocol.OP_CLEAR_CHILD_ITEMS;
};
oFF.UiClientOpClearChildItems.prototype.executeOperation = function(client, uiContext, operation, offset)
{
	uiContext.clearChildItems();
	return uiContext;
};

oFF.UiClientOpClearContent = function() {};
oFF.UiClientOpClearContent.prototype = new oFF.UiClientOperation();
oFF.UiClientOpClearContent.prototype._ff_c = "UiClientOpClearContent";

oFF.UiClientOpClearContent.prototype.getName = function()
{
	return oFF.UiProperty.CONTENT.getClearMethodName();
};
oFF.UiClientOpClearContent.prototype.executeOperation = function(client, uiContext, operation, offset)
{
	uiContext.clearContent();
	return uiContext;
};

oFF.UiClientOpGetRoot = function() {};
oFF.UiClientOpGetRoot.prototype = new oFF.UiClientOperation();
oFF.UiClientOpGetRoot.prototype._ff_c = "UiClientOpGetRoot";

oFF.UiClientOpGetRoot.prototype.getName = function()
{
	return oFF.UiRemoteProtocol.OP_GET_ROOT;
};
oFF.UiClientOpGetRoot.prototype.executeOperation = function(client, uiContext, operation, offset)
{
	var root = client.getGenesis().getAnchor();
	return root;
};

oFF.UiClientOpInsert = function() {};
oFF.UiClientOpInsert.prototype = new oFF.UiClientOperation();
oFF.UiClientOpInsert.prototype._ff_c = "UiClientOpInsert";

oFF.UiClientOpInsert.prototype.getName = function()
{
	return oFF.UiRemoteProtocol.OP_INSERT;
};
oFF.UiClientOpInsert.prototype.executeOperation = function(client, uiContext, operation, offset)
{
	var paramId = operation.getStringAt(offset);
	var element = client.getContext(paramId);
	var index = operation.getIntegerAt(offset + 1);
	uiContext.insert(index, element);
	return null;
};

oFF.UiClientOpNewControlAt = function() {};
oFF.UiClientOpNewControlAt.prototype = new oFF.UiClientOperation();
oFF.UiClientOpNewControlAt.prototype._ff_c = "UiClientOpNewControlAt";

oFF.UiClientOpNewControlAt.prototype.getName = function()
{
	return oFF.UiRemoteProtocol.OP_NEW_CONTROL;
};
oFF.UiClientOpNewControlAt.prototype.executeOperation = function(client, uiContext, operation, offset)
{
	var identifier = operation.getStringAt(offset);
	var name = operation.getStringAt(offset + 1);
	var type = oFF.UiType.lookupUiType(operation.getStringAt(offset + 2));
	var styleClass = oFF.UiStyleClass.lookup(operation.getStringAt(offset + 3));
	var parentId = operation.getStringAt(offset + 4);
	var parent = client.getContext(parentId);
	var position = oFF.UiItemPosition.lookup(operation.getStringAt(offset + 5));
	var theOperation = oFF.UiOperation.lookup(operation.getStringAt(offset + 6));
	var firstIndex = operation.getIntegerAt(offset + 7);
	var secondIndex = operation.getIntegerAt(offset + 8);
	var uiReturnContext = uiContext.newControlExt(type, styleClass, identifier, name, parent, theOperation, position, firstIndex, secondIndex);
	return uiReturnContext;
};

oFF.UiClientOpNewUiControl = function() {};
oFF.UiClientOpNewUiControl.prototype = new oFF.UiClientOperation();
oFF.UiClientOpNewUiControl.prototype._ff_c = "UiClientOpNewUiControl";

oFF.UiClientOpNewUiControl.prototype.getName = function()
{
	return oFF.UiRemoteProtocol.OP_NEW_UI_CONTROL;
};
oFF.UiClientOpNewUiControl.prototype.executeOperation = function(client, uiContext, operation, offset)
{
	var identifier = null;
	var name = operation.getStringAt(offset + 1);
	var type = oFF.UiType.lookupUiType(operation.getStringAt(offset + 2));
	var styleClass = oFF.UiStyleClass.lookup(operation.getStringAt(offset + 3));
	var genesis = client.getGenesis();
	var uiReturnContext = genesis.newBasicControl(type, styleClass, identifier, name);
	return uiReturnContext;
};

oFF.UiClientOpReleaseControl = function() {};
oFF.UiClientOpReleaseControl.prototype = new oFF.UiClientOperation();
oFF.UiClientOpReleaseControl.prototype._ff_c = "UiClientOpReleaseControl";

oFF.UiClientOpReleaseControl.prototype.getName = function()
{
	return oFF.UiRemoteProtocol.OP_RELEASE_CONTROL;
};
oFF.UiClientOpReleaseControl.prototype.executeOperation = function(client, uiContext, operation, offset)
{
	oFF.XObjectExt.release(uiContext);
	return uiContext;
};

oFF.UiClientOpRemoveAt = function() {};
oFF.UiClientOpRemoveAt.prototype = new oFF.UiClientOperation();
oFF.UiClientOpRemoveAt.prototype._ff_c = "UiClientOpRemoveAt";

oFF.UiClientOpRemoveAt.prototype.getName = function()
{
	return oFF.UiRemoteProtocol.OP_REMOVE_AT;
};
oFF.UiClientOpRemoveAt.prototype.executeOperation = function(client, uiContext, operation, offset)
{
	var uiReturnContext = null;
	var index = operation.getIntegerAt(offset);
	uiReturnContext = uiContext.removeAt(index);
	return uiReturnContext;
};

oFF.UiClientOpSetBaseControl = function() {};
oFF.UiClientOpSetBaseControl.prototype = new oFF.UiClientOperation();
oFF.UiClientOpSetBaseControl.prototype._ff_c = "UiClientOpSetBaseControl";

oFF.UiClientOpSetBaseControl.prototype.getName = function()
{
	return oFF.UiRemoteProtocol.OP_SET_BASE_CONTROL;
};
oFF.UiClientOpSetBaseControl.prototype.executeOperation = function(client, uiContext, operation, offset)
{
	var uiReturnContext = null;
	var paramId = operation.getStringAt(offset);
	var baseControl = client.getContext(paramId);
	if (uiContext.isCompositeControl())
	{
		uiReturnContext = uiContext.setBaseControl(baseControl);
	}
	else
	{
		throw oFF.XException.createIllegalStateException("Error! Context is not a composite control. Cannot set base control!");
	}
	return uiReturnContext;
};

oFF.UiClientOpSetContent = function() {};
oFF.UiClientOpSetContent.prototype = new oFF.UiClientOperation();
oFF.UiClientOpSetContent.prototype._ff_c = "UiClientOpSetContent";

oFF.UiClientOpSetContent.prototype.getName = function()
{
	return oFF.UiProperty.CONTENT.getSetterMethodName();
};
oFF.UiClientOpSetContent.prototype.executeOperation = function(client, uiContext, operation, offset)
{
	var uiReturnContext = null;
	var paramId = operation.getStringAt(offset);
	uiReturnContext = uiContext.setContent(client.getContext(paramId));
	return uiReturnContext;
};

oFF.UiClientOpAddSelectedItem = function() {};
oFF.UiClientOpAddSelectedItem.prototype = new oFF.UiClientOperation();
oFF.UiClientOpAddSelectedItem.prototype._ff_c = "UiClientOpAddSelectedItem";

oFF.UiClientOpAddSelectedItem.prototype.getName = function()
{
	return oFF.UiRemoteProtocol.OP_ADD_SELECTED_ITEM;
};
oFF.UiClientOpAddSelectedItem.prototype.executeOperation = function(client, uiContext, operation, offset)
{
	var selectedItemId = operation.getStringAt(offset);
	var uiReturnContext = null;
	if (oFF.notNull(client))
	{
		var item = client.getContext(selectedItemId);
		if (oFF.notNull(uiContext))
		{
			uiReturnContext = uiContext.addSelectedItem(item);
		}
	}
	return uiReturnContext;
};

oFF.UiClientOpClearSelectedItems = function() {};
oFF.UiClientOpClearSelectedItems.prototype = new oFF.UiClientOperation();
oFF.UiClientOpClearSelectedItems.prototype._ff_c = "UiClientOpClearSelectedItems";

oFF.UiClientOpClearSelectedItems.prototype.getName = function()
{
	return oFF.UiRemoteProtocol.OP_CLEAR_SELECTED_ITEMS;
};
oFF.UiClientOpClearSelectedItems.prototype.executeOperation = function(client, uiContext, operation, offset)
{
	var uiReturnContext = null;
	if (oFF.notNull(uiContext))
	{
		uiReturnContext = uiContext.clearSelectedItems();
	}
	return uiReturnContext;
};

oFF.UiClientOpGetSelectedItem = function() {};
oFF.UiClientOpGetSelectedItem.prototype = new oFF.UiClientOperation();
oFF.UiClientOpGetSelectedItem.prototype._ff_c = "UiClientOpGetSelectedItem";

oFF.UiClientOpGetSelectedItem.prototype.getName = function()
{
	return oFF.UiRemoteProtocol.OP_GET_SELECTED_ITEM;
};
oFF.UiClientOpGetSelectedItem.prototype.executeOperation = function(client, uiContext, operation, offset)
{
	var uiReturnContext = null;
	if (oFF.notNull(uiContext))
	{
		uiReturnContext = uiContext.getSelectedItem();
	}
	return uiReturnContext;
};

oFF.UiClientOpGetSelectedItems = function() {};
oFF.UiClientOpGetSelectedItems.prototype = new oFF.UiClientOperation();
oFF.UiClientOpGetSelectedItems.prototype._ff_c = "UiClientOpGetSelectedItems";

oFF.UiClientOpGetSelectedItems.prototype.getName = function()
{
	return oFF.UiRemoteProtocol.OP_GET_SELECTED_ITEMS;
};
oFF.UiClientOpGetSelectedItems.prototype.executeOperation = function(client, uiContext, operation, offset)
{
	var uiReturnContext = null;
	if (oFF.notNull(uiContext))
	{
		uiReturnContext = uiContext.getSelectedItem();
	}
	return uiReturnContext;
};

oFF.UiClientOpRemoveSelectedItem = function() {};
oFF.UiClientOpRemoveSelectedItem.prototype = new oFF.UiClientOperation();
oFF.UiClientOpRemoveSelectedItem.prototype._ff_c = "UiClientOpRemoveSelectedItem";

oFF.UiClientOpRemoveSelectedItem.prototype.getName = function()
{
	return oFF.UiRemoteProtocol.OP_REMOVE_SELECTED_ITEM;
};
oFF.UiClientOpRemoveSelectedItem.prototype.executeOperation = function(client, uiContext, operation, offset)
{
	var selectedItemId = operation.getStringAt(offset);
	var uiReturnContext = null;
	if (oFF.notNull(client))
	{
		var item = client.getContext(selectedItemId);
		if (oFF.notNull(uiContext))
		{
			uiReturnContext = uiContext.removeSelectedItem(item);
		}
	}
	return uiReturnContext;
};

oFF.UiClientOpSetSelectedItem = function() {};
oFF.UiClientOpSetSelectedItem.prototype = new oFF.UiClientOperation();
oFF.UiClientOpSetSelectedItem.prototype._ff_c = "UiClientOpSetSelectedItem";

oFF.UiClientOpSetSelectedItem.prototype.getName = function()
{
	return oFF.UiRemoteProtocol.OP_SET_SELECTED_ITEM;
};
oFF.UiClientOpSetSelectedItem.prototype.executeOperation = function(client, uiContext, operation, offset)
{
	var selectedItemId = operation.getStringAt(offset);
	var uiReturnContext = null;
	if (oFF.notNull(client))
	{
		var item = client.getContext(selectedItemId);
		if (oFF.notNull(uiContext))
		{
			uiReturnContext = uiContext.setSelectedItem(item);
		}
	}
	return uiReturnContext;
};

oFF.UiClientOpSetSelectedItems = function() {};
oFF.UiClientOpSetSelectedItems.prototype = new oFF.UiClientOperation();
oFF.UiClientOpSetSelectedItems.prototype._ff_c = "UiClientOpSetSelectedItems";

oFF.UiClientOpSetSelectedItems.prototype.getName = function()
{
	return oFF.UiRemoteProtocol.OP_SET_SELECTED_ITEMS;
};
oFF.UiClientOpSetSelectedItems.prototype.executeOperation = function(client, uiContext, operation, offset)
{
	var selectedItemIds = operation.getStringAt(offset);
	var uiReturnContext = null;
	if (oFF.notNull(client))
	{
		var selectedItems = oFF.XList.create();
		if (oFF.XStringUtils.isNotNullAndNotEmpty(selectedItemIds))
		{
			var selectedIds = oFF.XStringTokenizer.splitString(selectedItemIds, oFF.UiRemoteProtocol.MULTI_ITEM_SEPARATOR);
			var idsIterator = selectedIds.getIterator();
			while (idsIterator.hasNext())
			{
				var tmpSelectedId = idsIterator.next();
				var tmpSelectedItem = client.getContext(tmpSelectedId);
				selectedItems.add(tmpSelectedItem);
			}
		}
		if (oFF.notNull(uiContext))
		{
			uiReturnContext = uiContext.setSelectedItems(selectedItems);
		}
	}
	return uiReturnContext;
};

oFF.UiClientOpClearSubHeader = function() {};
oFF.UiClientOpClearSubHeader.prototype = new oFF.UiClientOperation();
oFF.UiClientOpClearSubHeader.prototype._ff_c = "UiClientOpClearSubHeader";

oFF.UiClientOpClearSubHeader.prototype.getName = function()
{
	return oFF.UiProperty.SUB_HEADER.getClearMethodName();
};
oFF.UiClientOpClearSubHeader.prototype.executeOperation = function(client, uiContext, operation, offset)
{
	uiContext.clearSubHeader();
	return uiContext;
};

oFF.UiClientOpSetSubHeader = function() {};
oFF.UiClientOpSetSubHeader.prototype = new oFF.UiClientOperation();
oFF.UiClientOpSetSubHeader.prototype._ff_c = "UiClientOpSetSubHeader";

oFF.UiClientOpSetSubHeader.prototype.getName = function()
{
	return oFF.UiProperty.SUB_HEADER.getSetterMethodName();
};
oFF.UiClientOpSetSubHeader.prototype.executeOperation = function(client, uiContext, operation, offset)
{
	var uiReturnContext = null;
	var paramId = operation.getStringAt(offset);
	uiReturnContext = uiContext.setSubHeader(client.getContext(paramId));
	return uiReturnContext;
};

oFF.UiClientOpUiMgrSetTheme = function() {};
oFF.UiClientOpUiMgrSetTheme.prototype = new oFF.UiClientOperation();
oFF.UiClientOpUiMgrSetTheme.prototype._ff_c = "UiClientOpUiMgrSetTheme";

oFF.UiClientOpUiMgrSetTheme.prototype.getName = function()
{
	return oFF.UiRemoteProtocol.OP_UI_MGR_SET_THEME;
};
oFF.UiClientOpUiMgrSetTheme.prototype.executeOperation = function(client, uiContext, operation, offset)
{
	var themeName = operation.getStringAt(offset);
	var baseThemeUrl = operation.getStringAt(offset + 1);
	client.getUiManager().setTheme(themeName, baseThemeUrl);
	return null;
};

oFF.UiParam = function() {};
oFF.UiParam.prototype = new oFF.XJson();
oFF.UiParam.prototype._ff_c = "UiParam";

oFF.UiParam.create = function(name)
{
	var newObject = oFF.UiParam.json(null);
	if (oFF.notNull(name))
	{
		newObject.name(name);
	}
	return newObject;
};
oFF.UiParam.json = function(jsonValue)
{
	var newObject = new oFF.UiParam();
	if (oFF.notNull(jsonValue))
	{
		var json = oFF.XString.replace(jsonValue, "'", "\"");
		var parser = oFF.JsonParserFactory.newInstance();
		var rootElement = parser.parse(json);
		if (parser.isValid() && oFF.notNull(rootElement) && rootElement.getType() === oFF.PrElementType.STRUCTURE)
		{
			oFF.XObjectExt.release(parser);
			newObject.m_rootElement = rootElement;
		}
		else
		{
			throw oFF.XException.createIllegalArgumentException(parser.getSummary());
		}
	}
	else
	{
		newObject.m_rootElement = oFF.PrFactory.createStructure();
	}
	return newObject;
};
oFF.UiParam.prototype.m_rootElement = null;
oFF.UiParam.prototype.name = function(name)
{
	this.m_rootElement.putString(oFF.UiAttributes.NAME, name);
	return this;
};
oFF.UiParam.prototype.getElement = function()
{
	return this.m_rootElement;
};
oFF.UiParam.prototype.toString = function()
{
	return this.m_rootElement.toString();
};

oFF.UiParamAxColumnName = function() {};
oFF.UiParamAxColumnName.prototype = new oFF.UiParamCode();
oFF.UiParamAxColumnName.prototype._ff_c = "UiParamAxColumnName";

oFF.UiParamAxColumnName.staticSetup = function()
{
	var newObject = new oFF.UiParamAxColumnName();
	oFF.UiParamCode.add(newObject);
};
oFF.UiParamAxColumnName.prototype.getName = function()
{
	return oFF.UiAttributes.COLUMN_NAME;
};
oFF.UiParamAxColumnName.prototype.doDeserialize = function(context, parameter)
{
	if (parameter.isString())
	{
		var value = parameter;
		value.toString();
	}
};

oFF.UiParamAxColumns = function() {};
oFF.UiParamAxColumns.prototype = new oFF.UiParamCode();
oFF.UiParamAxColumns.prototype._ff_c = "UiParamAxColumns";

oFF.UiParamAxColumns.staticSetup = function()
{
	var newObject = new oFF.UiParamAxColumns();
	oFF.UiParamCode.add(newObject);
};
oFF.UiParamAxColumns.prototype.getName = function()
{
	return oFF.UiAttributes.COLUMNS;
};
oFF.UiParamAxColumns.prototype.getPriority = function()
{
	return oFF.UiParamCode.PRIO_1_LAYOUT_METADATA;
};
oFF.UiParamAxColumns.prototype.doDeserialize = function(context, parameter) {};

oFF.UiParamAxName = function() {};
oFF.UiParamAxName.prototype = new oFF.UiParamCode();
oFF.UiParamAxName.prototype._ff_c = "UiParamAxName";

oFF.UiParamAxName.staticSetup = function()
{
	var newObject = new oFF.UiParamAxName();
	oFF.UiParamCode.add(newObject);
};
oFF.UiParamAxName.prototype.getName = function()
{
	return oFF.UiAttributes.NAME;
};
oFF.UiParamAxName.prototype.getPriority = function()
{
	return oFF.UiParamCode.PRIO_0_CONSTANTS;
};
oFF.UiParamAxName.prototype.doDeserialize = function(context, parameter)
{
	if (parameter.isString())
	{
		var value = parameter;
		context.setName(value.getString());
	}
};

oFF.UiParamAxRowCells = function() {};
oFF.UiParamAxRowCells.prototype = new oFF.UiParamCode();
oFF.UiParamAxRowCells.prototype._ff_c = "UiParamAxRowCells";

oFF.UiParamAxRowCells.staticSetup = function()
{
	var newObject = new oFF.UiParamAxRowCells();
	oFF.UiParamCode.add(newObject);
};
oFF.UiParamAxRowCells.prototype.getName = function()
{
	return oFF.UiAttributes.ROW_CELLS;
};
oFF.UiParamAxRowCells.prototype.doDeserialize = function(context, parameter) {};

oFF.UiParamAxRows = function() {};
oFF.UiParamAxRows.prototype = new oFF.UiParamCode();
oFF.UiParamAxRows.prototype._ff_c = "UiParamAxRows";

oFF.UiParamAxRows.staticSetup = function()
{
	var newObject = new oFF.UiParamAxRows();
	oFF.UiParamCode.add(newObject);
};
oFF.UiParamAxRows.prototype.getName = function()
{
	return oFF.UiAttributes.ROWS;
};
oFF.UiParamAxRows.prototype.doDeserialize = function(context, parameter) {};

oFF.UiParamAxText = function() {};
oFF.UiParamAxText.prototype = new oFF.UiParamCode();
oFF.UiParamAxText.prototype._ff_c = "UiParamAxText";

oFF.UiParamAxText.staticSetup = function()
{
	var newObject = new oFF.UiParamAxText();
	oFF.UiParamCode.add(newObject);
};
oFF.UiParamAxText.prototype.getName = function()
{
	return oFF.UiAttributes.TEXT;
};
oFF.UiParamAxText.prototype.doDeserialize = function(context, parameter)
{
	if (parameter.isString())
	{
		var value = parameter;
		context.setText(value.getString());
	}
};

oFF.UiParamAxWidthInPixel = function() {};
oFF.UiParamAxWidthInPixel.prototype = new oFF.UiParamCode();
oFF.UiParamAxWidthInPixel.prototype._ff_c = "UiParamAxWidthInPixel";

oFF.UiParamAxWidthInPixel.staticSetup = function()
{
	var newObject = new oFF.UiParamAxWidthInPixel();
	oFF.UiParamCode.add(newObject);
};
oFF.UiParamAxWidthInPixel.prototype.getName = function()
{
	return oFF.UiAttributes.WIDTH_IN_PIXEL;
};
oFF.UiParamAxWidthInPixel.prototype.doDeserialize = function(context, parameter)
{
	if (parameter.isInteger())
	{
		var value = parameter;
		context.setWidth(oFF.UiCssLength.createExt(value.getInteger(), oFF.UiCssSizeUnit.PIXEL));
	}
};

oFF.UiControlGenerator = function() {};
oFF.UiControlGenerator.prototype = new oFF.UiGeneratorBase();
oFF.UiControlGenerator.prototype._ff_c = "UiControlGenerator";

oFF.UiControlGenerator.main = function()
{
	oFF.UiModule.getInstance();
	oFF.UiControlGenerator.generate();
};
oFF.UiControlGenerator.generate = function()
{
	oFF.XLogger.println("*** Generating ui controls ***");
	var engine = oFF.UiControlGenerator.create();
	var outputDir = "${ff_sdk}/sources/ff2200.ui/java/com/sap/firefly/ui/foundation/controls/";
	var thePackage = "com.oFF.ui.foundation.controls";
	var allUiTypes = oFF.UiType.getAllUiTypes();
	var listOfInterfaces = oFF.XListOfString.create();
	while (allUiTypes.hasNext())
	{
		var uiType = allUiTypes.next();
		engine.makeControlInterface(outputDir, thePackage, uiType, listOfInterfaces);
	}
	listOfInterfaces.sortByDirection(oFF.XSortDirection.ASCENDING);
	engine.makeAggregation(engine.m_session, outputDir, thePackage, "IUiControlAggregation", listOfInterfaces, "control");
	oFF.XLogger.println("*** Done ui controls ***");
};
oFF.UiControlGenerator.create = function()
{
	var newGenerator = new oFF.UiControlGenerator();
	newGenerator.setupEngine();
	return newGenerator;
};
oFF.UiControlGenerator.prototype.m_session = null;
oFF.UiControlGenerator.prototype.setupEngine = function()
{
	this.m_session = oFF.DefaultSession.create();
};
oFF.UiControlGenerator.prototype.makeControlInterface = function(outputDir, thePackage, uiType, listOfInterfaces)
{
	var sortedInterfaceNames = uiType.getOwnInterfaceNamesSorted();
	var sortedPropertyNames = uiType.getOwnPropertyNamesSorted();
	var sortedAggregationNames = uiType.getOwnAggregationNamesSorted();
	var sortedMethodNames = uiType.getOwnMethodNamesSorted();
	var sortedEventNames = uiType.getOwnEventNamesSorted();
	sortedEventNames.sortByDirection(oFF.XSortDirection.ASCENDING);
	var name = uiType.getName();
	var theClassName = oFF.XStringUtils.concatenate2("IUi", name);
	listOfInterfaces.add(theClassName);
	var constantName = oFF.XStringUtils.camelCaseToUpperCase(name);
	var displayName = oFF.XStringUtils.camelCaseToDisplayText(name);
	var sourceCode = oFF.XStringBuffer.create();
	sourceCode.append("package ");
	sourceCode.append(thePackage);
	sourceCode.appendLine(";");
	sourceCode.appendNewLine();
	sourceCode.appendLine("import com.oFF.ui.node.*;");
	sourceCode.appendLine("import com.oFF.ui.foundation.interfaces.*;");
	sourceCode.appendLine("import com.oFF.ui.foundation.properties.*;");
	sourceCode.appendLine("import com.oFF.ui.foundation.aggregations.*;");
	sourceCode.appendLine("import com.oFF.ui.foundation.methods.*;");
	sourceCode.appendLine("import com.oFF.ui.foundation.events.registration.*;");
	sourceCode.appendNewLine();
	sourceCode.appendLine("/**");
	sourceCode.append(" * ");
	sourceCode.append(displayName);
	if (uiType.isAbstractControl())
	{
		sourceCode.appendLine(" abstract control.");
	}
	else
	{
		sourceCode.appendLine(" control.");
		sourceCode.append(" * @see com.oFF.ui.foundation.UiType#");
		sourceCode.appendLine(constantName);
	}
	sourceCode.appendLine(" */");
	sourceCode.append("public interface ");
	sourceCode.append(theClassName);
	sourceCode.append(" extends ");
	if (!uiType.hasSuperType())
	{
		sourceCode.append("IUiAbstractContext");
	}
	else
	{
		var superTypeName = uiType.getSuperType().getName();
		var superClassName = oFF.XStringUtils.concatenate2("IUi", superTypeName);
		sourceCode.append(superClassName);
		if (uiType.hasIndexedChildren())
		{
			sourceCode.append(", IUiIndexOperations");
			if (uiType.getDefaultItemType() !== null)
			{
				sourceCode.append(", IUiItemOperations");
			}
		}
		if (uiType.hasNamedChildren())
		{
			sourceCode.append(", IUiChildMap");
		}
		if (this.isItemContainerWithDefaultItem(uiType))
		{
			sourceCode.append(", IUiItemNewOperations");
		}
		else if (this.isLayout(uiType))
		{
			sourceCode.append(", IUiItemsNewOfTypeOperations");
		}
		if (uiType.supportsSelection())
		{
			sourceCode.append(", IUiSingleSelection");
		}
		if (uiType.supportsMultiSelection())
		{
			sourceCode.append(", IUiMultiSelection");
		}
	}
	this.appendInterfaces(sourceCode, sortedInterfaceNames, true);
	this.appendProperties(sourceCode, sortedPropertyNames);
	this.appendAggregations(sourceCode, sortedAggregationNames);
	this.appendMethods(sourceCode, sortedMethodNames);
	this.appendEvents(sourceCode, sortedEventNames);
	sourceCode.appendNewLine();
	sourceCode.appendLine("{");
	sourceCode.appendLine("}");
	this.writeClass(this.m_session, outputDir, theClassName, sourceCode.toString());
};
oFF.UiControlGenerator.prototype.isItemContainerWithDefaultItem = function(uiType)
{
	return uiType.getOwnAggregations().contains(oFF.UiAggregation.ITEMS) && uiType.getDefaultItemType() !== null;
};
oFF.UiControlGenerator.prototype.isLayout = function(uiType)
{
	return uiType.getOwnAggregations().contains(oFF.UiAggregation.ITEMS) && uiType.getDefaultItemType() === null;
};

oFF.UiInterfaceGenerator = function() {};
oFF.UiInterfaceGenerator.prototype = new oFF.UiGeneratorBase();
oFF.UiInterfaceGenerator.prototype._ff_c = "UiInterfaceGenerator";

oFF.UiInterfaceGenerator.main = function()
{
	oFF.UiModule.getInstance();
	oFF.UiInterfaceGenerator.generate();
};
oFF.UiInterfaceGenerator.generate = function()
{
	oFF.XLogger.println("*** Generating ui interfaces ***");
	var engine = oFF.UiInterfaceGenerator.create();
	var outputDir = "${ff_sdk}/sources/ff2200.ui/java/com/sap/firefly/ui/foundation/interfaces/";
	var thePackage = "com.oFF.ui.foundation.interfaces";
	engine.generateInterfaceDummy(outputDir, thePackage, "IUiInterface", "interfaces");
	var allUiInterfaces = oFF.UiInterface.getAllUiInterfaces();
	var listOfInterfaces = oFF.XListOfString.create();
	while (allUiInterfaces.hasNext())
	{
		var uiInterface = allUiInterfaces.next();
		engine.makeInterface(outputDir, thePackage, uiInterface, listOfInterfaces);
	}
	listOfInterfaces.sortByDirection(oFF.XSortDirection.ASCENDING);
	engine.makeAggregation(engine.m_session, outputDir, thePackage, "IUiInterfaceAggregation", listOfInterfaces, "interface");
	oFF.XLogger.println("*** Done ui interfaces ***");
};
oFF.UiInterfaceGenerator.create = function()
{
	var newGenerator = new oFF.UiInterfaceGenerator();
	newGenerator.setupEngine();
	return newGenerator;
};
oFF.UiInterfaceGenerator.prototype.m_session = null;
oFF.UiInterfaceGenerator.prototype.setupEngine = function()
{
	this.m_session = oFF.DefaultSession.create();
};
oFF.UiInterfaceGenerator.prototype.generateInterfaceDummy = function(outputDir, thePackage, name, friendlyName)
{
	var sourceCode = oFF.XStringBuffer.create();
	sourceCode.append("package ");
	sourceCode.append(thePackage);
	sourceCode.appendLine(";");
	sourceCode.appendNewLine();
	sourceCode.appendLine("/**");
	sourceCode.append(" * ");
	sourceCode.append(friendlyName);
	sourceCode.appendLine(" base interface.");
	sourceCode.appendLine(" */");
	sourceCode.append("public interface ");
	sourceCode.append(name);
	sourceCode.appendLine(" extends IXObject");
	sourceCode.appendNewLine();
	sourceCode.appendLine("{");
	sourceCode.appendLine("}");
	this.writeClass(this.m_session, outputDir, name, sourceCode.toString());
};
oFF.UiInterfaceGenerator.prototype.makeInterface = function(outputDir, thePackage, uiInterface, listOfInterfaces)
{
	var sortedInterfaceNames = uiInterface.getInterfaceNamesSorted();
	var sortedPropertyNames = uiInterface.getPropertyNamesSorted();
	var sortedAggregationNames = uiInterface.getAggregationNamesSorted();
	var sortedMethodNames = uiInterface.getMethodNamesSorted();
	var sortedEventNames = uiInterface.getEventNamesSorted();
	sortedEventNames.sortByDirection(oFF.XSortDirection.ASCENDING);
	var name = uiInterface.getName();
	var theClassName = oFF.XStringUtils.concatenate2("IUiInterface", name);
	listOfInterfaces.add(theClassName);
	var constantName = oFF.XStringUtils.camelCaseToUpperCase(name);
	var displayName = oFF.XStringUtils.camelCaseToDisplayText(name);
	var sourceCode = oFF.XStringBuffer.create();
	sourceCode.append("package ");
	sourceCode.append(thePackage);
	sourceCode.appendLine(";");
	sourceCode.appendNewLine();
	sourceCode.appendLine("import com.oFF.ui.node.*;");
	sourceCode.appendLine("import com.oFF.ui.foundation.interfaces.*;");
	sourceCode.appendLine("import com.oFF.ui.foundation.properties.*;");
	sourceCode.appendLine("import com.oFF.ui.foundation.aggregations.*;");
	sourceCode.appendLine("import com.oFF.ui.foundation.methods.*;");
	sourceCode.appendLine("import com.oFF.ui.foundation.events.registration.*;");
	sourceCode.appendNewLine();
	sourceCode.appendLine("/**");
	sourceCode.append(" * ");
	sourceCode.append(displayName);
	sourceCode.appendLine(" interface.");
	sourceCode.append(" * @see com.oFF.ui.foundation.UiInterface#");
	sourceCode.appendLine(constantName);
	sourceCode.appendLine(" */");
	sourceCode.append("public interface ");
	sourceCode.append(theClassName);
	sourceCode.append(" extends ");
	if (this.appendInterfaces(sourceCode, sortedInterfaceNames, false) === false)
	{
		sourceCode.append(" IUiInterface");
	}
	this.appendProperties(sourceCode, sortedPropertyNames);
	this.appendAggregations(sourceCode, sortedAggregationNames);
	this.appendMethods(sourceCode, sortedMethodNames);
	this.appendEvents(sourceCode, sortedEventNames);
	sourceCode.appendNewLine();
	sourceCode.appendLine("{");
	sourceCode.appendLine("}");
	this.writeClass(this.m_session, outputDir, theClassName, sourceCode.toString());
};

oFF.DfUiFormControl = function() {};
oFF.DfUiFormControl.prototype = new oFF.XObject();
oFF.DfUiFormControl.prototype._ff_c = "DfUiFormControl";

oFF.DfUiFormControl.prototype.m_genesis = null;
oFF.DfUiFormControl.prototype.m_customObject = null;
oFF.DfUiFormControl.prototype.m_control = null;
oFF.DfUiFormControl.prototype.setupFormControl = function(genesis)
{
	if (oFF.isNull(genesis))
	{
		throw oFF.XException.createRuntimeException("Cannot create a form item. Please sepcify a genesis object!");
	}
	this.m_genesis = genesis;
	this.m_control = this.createFormControlUi(genesis);
};
oFF.DfUiFormControl.prototype.releaseObject = function()
{
	this.m_genesis = null;
	this.m_customObject = null;
	this.m_control = oFF.XObjectExt.release(this.m_control);
	oFF.XObject.prototype.releaseObject.call( this );
};
oFF.DfUiFormControl.prototype.getCustomObject2 = function()
{
	return this.m_customObject;
};
oFF.DfUiFormControl.prototype.setCustomObject2 = function(customObject)
{
	this.m_customObject = customObject;
};
oFF.DfUiFormControl.prototype.setFlex = function(flex)
{
	this.getFormControl().setFlex(flex);
	return this;
};
oFF.DfUiFormControl.prototype.getFormControl = function()
{
	return this.m_control;
};
oFF.DfUiFormControl.prototype.setSpacing = function(isHorizontal)
{
	if (isHorizontal)
	{
		this.getFormControl().setMargin(oFF.UiCssBoxEdges.create("0px 10px 0px 0px"));
	}
	else
	{
		this.getFormControl().setMargin(oFF.UiCssBoxEdges.create("0px 0px 10px 0px"));
	}
};
oFF.DfUiFormControl.prototype.getGenesis = function()
{
	return this.m_genesis;
};
oFF.DfUiFormControl.prototype.isSection = function()
{
	return false;
};

oFF.UiColor = function() {};
oFF.UiColor.prototype = new oFF.XObject();
oFF.UiColor.prototype._ff_c = "UiColor";

oFF.UiColor.RED = null;
oFF.UiColor.GREEN = null;
oFF.UiColor.BLUE = null;
oFF.UiColor.YELLOW = null;
oFF.UiColor.ORANGE = null;
oFF.UiColor.PURPLE = null;
oFF.UiColor.CYAN = null;
oFF.UiColor.MAGENTA = null;
oFF.UiColor.LIME = null;
oFF.UiColor.PINK = null;
oFF.UiColor.TEAL = null;
oFF.UiColor.LAVENDER = null;
oFF.UiColor.BROWN = null;
oFF.UiColor.BEIGE = null;
oFF.UiColor.MAROON = null;
oFF.UiColor.MINT = null;
oFF.UiColor.OLIVE = null;
oFF.UiColor.APRICOT = null;
oFF.UiColor.NAVY = null;
oFF.UiColor.GREY = null;
oFF.UiColor.BLACK = null;
oFF.UiColor.WHITE = null;
oFF.UiColor.TRANSPARENT = null;
oFF.UiColor.PRIMARY = null;
oFF.UiColor.SECONDARY = null;
oFF.UiColor.ERROR = null;
oFF.UiColor.WARNING = null;
oFF.UiColor.INFO = null;
oFF.UiColor.SUCCESS = null;
oFF.UiColor.s_lookup = null;
oFF.UiColor.staticSetup = function()
{
	oFF.UiColor.s_lookup = oFF.XHashMapByString.create();
	oFF.UiColor.RED = oFF.UiColor.createLocked(230, 25, 75, 1.0, "red");
	oFF.UiColor.GREEN = oFF.UiColor.createLocked(60, 180, 75, 1.0, "green");
	oFF.UiColor.BLUE = oFF.UiColor.createLocked(67, 99, 216, 1.0, "blue");
	oFF.UiColor.YELLOW = oFF.UiColor.createLocked(255, 225, 25, 1.0, "yellow");
	oFF.UiColor.ORANGE = oFF.UiColor.createLocked(245, 130, 49, 1.0, "orange");
	oFF.UiColor.PURPLE = oFF.UiColor.createLocked(145, 30, 180, 1.0, "purple");
	oFF.UiColor.CYAN = oFF.UiColor.createLocked(66, 212, 244, 1.0, "cyan");
	oFF.UiColor.MAGENTA = oFF.UiColor.createLocked(240, 50, 230, 1.0, "magenta");
	oFF.UiColor.LIME = oFF.UiColor.createLocked(191, 239, 69, 1.0, "lime");
	oFF.UiColor.PINK = oFF.UiColor.createLocked(250, 190, 190, 1.0, "pink");
	oFF.UiColor.TEAL = oFF.UiColor.createLocked(70, 153, 144, 1.0, "teal");
	oFF.UiColor.LAVENDER = oFF.UiColor.createLocked(230, 190, 255, 1.0, "lavender");
	oFF.UiColor.BROWN = oFF.UiColor.createLocked(154, 99, 36, 1.0, "brown");
	oFF.UiColor.BEIGE = oFF.UiColor.createLocked(255, 250, 200, 1.0, "beige");
	oFF.UiColor.MAROON = oFF.UiColor.createLocked(128, 0, 0, 1.0, "maroon");
	oFF.UiColor.MINT = oFF.UiColor.createLocked(170, 255, 195, 1.0, "mint");
	oFF.UiColor.OLIVE = oFF.UiColor.createLocked(128, 128, 0, 1.0, "olive");
	oFF.UiColor.APRICOT = oFF.UiColor.createLocked(255, 216, 177, 1.0, "apricot");
	oFF.UiColor.NAVY = oFF.UiColor.createLocked(0, 0, 117, 1.0, "navy");
	oFF.UiColor.GREY = oFF.UiColor.createLocked(169, 169, 169, 1.0, "grey");
	oFF.UiColor.BLACK = oFF.UiColor.createLocked(0, 0, 0, 1.0, "black");
	oFF.UiColor.WHITE = oFF.UiColor.createLocked(255, 255, 255, 1.0, "white");
	oFF.UiColor.TRANSPARENT = oFF.UiColor.createLocked(255, 255, 255, 0.0, "transparent");
	oFF.UiColor.PRIMARY = oFF.UiColor.createLocked(144, 202, 249, 1.0, "primary");
	oFF.UiColor.SECONDARY = oFF.UiColor.createLocked(244, 143, 177, 1.0, "secondary");
	oFF.UiColor.ERROR = oFF.UiColor.createLocked(244, 67, 54, 1.0, "error");
	oFF.UiColor.WARNING = oFF.UiColor.createLocked(255, 152, 0, 1.0, "warning");
	oFF.UiColor.INFO = oFF.UiColor.createLocked(33, 150, 243, 1.0, "info");
	oFF.UiColor.SUCCESS = oFF.UiColor.createLocked(76, 175, 80, 1.0, "success");
};
oFF.UiColor.createLocked = function(red, green, blue, alpha, colorName)
{
	var staticColor = oFF.UiColor.createByRgba(red, green, blue, alpha);
	staticColor.lock();
	if (oFF.UiColor.s_lookup.containsKey(colorName))
	{
		throw oFF.XException.createIllegalArgumentException(oFF.XStringUtils.concatenate2("Color with the specified name already exists: ", colorName));
	}
	oFF.UiColor.s_lookup.put(colorName, staticColor);
	return staticColor;
};
oFF.UiColor.lookup = function(value)
{
	var valueLower = oFF.XString.toLowerCase(value);
	return oFF.UiColor.s_lookup.getByKey(valueLower);
};
oFF.UiColor.create = function(cssValue)
{
	if (oFF.XStringUtils.isNullOrEmpty(cssValue))
	{
		return null;
	}
	var newColor = new oFF.UiColor();
	newColor.setCssValue(cssValue);
	return newColor;
};
oFF.UiColor.createByRgba = function(red, green, blue, alpha)
{
	var newColor = new oFF.UiColor();
	newColor.setColor(red, green, blue, alpha);
	return newColor;
};
oFF.UiColor.prototype.m_red = 0;
oFF.UiColor.prototype.m_green = 0;
oFF.UiColor.prototype.m_blue = 0;
oFF.UiColor.prototype.m_alpha = 0.0;
oFF.UiColor.prototype.m_isLocked = false;
oFF.UiColor.prototype.m_originalCssValue = null;
oFF.UiColor.prototype.newColorWithAlpha = function(alpha)
{
	return oFF.UiColor.createByRgba(this.getRed(), this.getGreen(), this.getBlue(), alpha);
};
oFF.UiColor.prototype.newBrighterColor = function(factor)
{
	var newRed = this.applyColorFactor(this.getRed(), factor);
	var newGreen = this.applyColorFactor(this.getGreen(), factor);
	var newBlue = this.applyColorFactor(this.getBlue(), factor);
	return oFF.UiColor.createByRgba(newRed, newGreen, newBlue, this.getAlpha());
};
oFF.UiColor.prototype.newDarkerColor = function(factor)
{
	var newRed = this.applyColorFactor(this.getRed(), -factor);
	var newGreen = this.applyColorFactor(this.getGreen(), -factor);
	var newBlue = this.applyColorFactor(this.getBlue(), -factor);
	return oFF.UiColor.createByRgba(newRed, newGreen, newBlue, this.getAlpha());
};
oFF.UiColor.prototype.reset = function()
{
	this.setColor(0, 0, 0, 0);
};
oFF.UiColor.prototype.lock = function()
{
	this.m_isLocked = true;
};
oFF.UiColor.prototype.setColor = function(red, green, blue, alpha)
{
	if (this.m_isLocked)
	{
		throw oFF.XException.createIllegalStateException("Color is locked and cannot be changed");
	}
	this.m_red = red;
	this.m_green = green;
	this.m_blue = blue;
	if (alpha > 1.0)
	{
		this.m_alpha = 1.0;
	}
	else
	{
		this.m_alpha = alpha;
	}
	return this;
};
oFF.UiColor.prototype.getCssValue = function()
{
	if (oFF.XStringUtils.isNotNullAndNotEmpty(this.getOriginalCssValue()))
	{
		return this.getOriginalCssValue();
	}
	return this.getRgbaColor();
};
oFF.UiColor.prototype.setCssValue = function(cssValue)
{
	if (oFF.notNull(cssValue))
	{
		if (oFF.XString.startsWith(cssValue, "#"))
		{
			this.setColorByHex(cssValue);
		}
		else if (oFF.XString.startsWith(cssValue, "rgb") || oFF.XString.startsWith(cssValue, "rgba"))
		{
			this.setColorByRgb(cssValue);
		}
		else
		{
			var tmpColor = oFF.UiColor.lookup(cssValue);
			if (oFF.notNull(tmpColor))
			{
				this.setColor(tmpColor.getRed(), tmpColor.getGreen(), tmpColor.getBlue(), tmpColor.getAlpha());
			}
		}
	}
};
oFF.UiColor.prototype.setByString = function(strValue)
{
	this.setCssValue(strValue);
};
oFF.UiColor.prototype.getAsString = function()
{
	return this.getCssValue();
};
oFF.UiColor.prototype.setAlpha = function(alpha)
{
	return this.setColor(this.getRed(), this.getGreen(), this.getBlue(), alpha);
};
oFF.UiColor.prototype.setRed = function(red)
{
	return this.setColor(red, this.getGreen(), this.getBlue(), this.getAlpha());
};
oFF.UiColor.prototype.setGreen = function(green)
{
	return this.setColor(this.getRed(), green, this.getBlue(), this.getAlpha());
};
oFF.UiColor.prototype.setBlue = function(blue)
{
	return this.setColor(this.getRed(), this.getGreen(), blue, this.getAlpha());
};
oFF.UiColor.prototype.getAlpha = function()
{
	return this.m_alpha;
};
oFF.UiColor.prototype.getRed = function()
{
	return this.m_red;
};
oFF.UiColor.prototype.getGreen = function()
{
	return this.m_green;
};
oFF.UiColor.prototype.getBlue = function()
{
	return this.m_blue;
};
oFF.UiColor.prototype.brighter = function(factor)
{
	var newRed = this.applyColorFactor(this.getRed(), factor);
	var newGreen = this.applyColorFactor(this.getGreen(), factor);
	var newBlue = this.applyColorFactor(this.getBlue(), factor);
	return this.setColor(newRed, newGreen, newBlue, this.getAlpha());
};
oFF.UiColor.prototype.darker = function(factor)
{
	var newRed = this.applyColorFactor(this.getRed(), -factor);
	var newGreen = this.applyColorFactor(this.getGreen(), -factor);
	var newBlue = this.applyColorFactor(this.getBlue(), -factor);
	return this.setColor(newRed, newGreen, newBlue, this.getAlpha());
};
oFF.UiColor.prototype.getHexColor = function()
{
	var rStr1 = oFF.XInteger.convertToHexString(this.m_red);
	var gStr1 = oFF.XInteger.convertToHexString(this.m_green);
	var bStr1 = oFF.XInteger.convertToHexString(this.m_blue);
	return oFF.XStringUtils.concatenate4("#", rStr1, gStr1, bStr1);
};
oFF.UiColor.prototype.getHexColorWithAlpha = function()
{
	var newAlpha = oFF.XDouble.convertToInt(this.m_alpha * 255);
	var alphaStr2 = oFF.XInteger.convertToHexString(newAlpha);
	var rStr2 = oFF.XInteger.convertToHexString(this.m_red);
	var gStr2 = oFF.XInteger.convertToHexString(this.m_green);
	var bStr2 = oFF.XInteger.convertToHexString(this.m_blue);
	return oFF.XStringUtils.concatenate5("#", alphaStr2, rStr2, gStr2, bStr2);
};
oFF.UiColor.prototype.getRgbColor = function()
{
	var rStr3 = oFF.XStringUtils.concatenate2(oFF.XInteger.convertToString(this.m_red), ",");
	var gStr3 = oFF.XStringUtils.concatenate2(oFF.XInteger.convertToString(this.m_green), ",");
	var bStr3 = oFF.XInteger.convertToString(this.m_blue);
	return oFF.XStringUtils.concatenate5("rgb(", rStr3, gStr3, bStr3, ")");
};
oFF.UiColor.prototype.getRgbaColor = function()
{
	var rStr4 = oFF.XStringUtils.concatenate2(oFF.XInteger.convertToString(this.m_red), ",");
	var gStr4 = oFF.XStringUtils.concatenate2(oFF.XInteger.convertToString(this.m_green), ",");
	var bStr4 = oFF.XStringUtils.concatenate2(oFF.XInteger.convertToString(this.m_blue), ",");
	var alphaStr4 = oFF.XStringUtils.concatenate2(oFF.XDouble.convertToString(oFF.XMath.round(this.m_alpha, 2)), ")");
	return oFF.XStringUtils.concatenate5("rgba(", rStr4, gStr4, bStr4, alphaStr4);
};
oFF.UiColor.prototype.setOriginalCssString = function(originalCssValue)
{
	this.m_originalCssValue = originalCssValue;
};
oFF.UiColor.prototype.getOriginalCssValue = function()
{
	return this.m_originalCssValue;
};
oFF.UiColor.prototype.setColorByHex = function(hexString)
{
	var offset = 1;
	if (oFF.XString.size(hexString) === 3 + offset)
	{
		var rStr = oFF.XString.substring(hexString, 0 + offset, 1 + offset);
		rStr = oFF.XStringUtils.repeat(rStr, 2);
		var gStr = oFF.XString.substring(hexString, 1 + offset, 2 + offset);
		gStr = oFF.XStringUtils.repeat(gStr, 2);
		var bStr = oFF.XString.substring(hexString, 2 + offset, 3 + offset);
		bStr = oFF.XStringUtils.repeat(bStr, 2);
		var rCol1 = oFF.XInteger.convertFromStringWithRadix(rStr, 16);
		var gCol1 = oFF.XInteger.convertFromStringWithRadix(gStr, 16);
		var bCol1 = oFF.XInteger.convertFromStringWithRadix(bStr, 16);
		this.setColor(rCol1, gCol1, bCol1, 1.0);
		this.setOriginalCssString(hexString);
	}
	else if (oFF.XString.size(hexString) === 6 + offset)
	{
		var rCol2 = oFF.XInteger.convertFromStringWithRadix(oFF.XString.substring(hexString, 0 + offset, 2 + offset), 16);
		var gCol2 = oFF.XInteger.convertFromStringWithRadix(oFF.XString.substring(hexString, 2 + offset, 4 + offset), 16);
		var bCol2 = oFF.XInteger.convertFromStringWithRadix(oFF.XString.substring(hexString, 4 + offset, 6 + offset), 16);
		this.setColor(rCol2, gCol2, bCol2, 1.0);
		this.setOriginalCssString(hexString);
	}
	else if (oFF.XString.size(hexString) === 8 + offset)
	{
		var rCol3 = oFF.XInteger.convertFromStringWithRadix(oFF.XString.substring(hexString, 0 + offset, 2 + offset), 16);
		var gCol3 = oFF.XInteger.convertFromStringWithRadix(oFF.XString.substring(hexString, 2 + offset, 4 + offset), 16);
		var bCol3 = oFF.XInteger.convertFromStringWithRadix(oFF.XString.substring(hexString, 4 + offset, 6 + offset), 16);
		var alpha3 = oFF.XInteger.convertFromStringWithRadix(oFF.XString.substring(hexString, 6 + offset, 8 + offset), 16);
		var newAlpha = alpha3 / 255.0;
		this.setColor(rCol3, gCol3, bCol3, newAlpha);
		this.setOriginalCssString(hexString);
	}
	return this;
};
oFF.UiColor.prototype.setColorByRgb = function(rgbString)
{
	if (this.m_isLocked)
	{
		throw oFF.XException.createIllegalStateException("Color is locked and cannot be changed");
	}
	if (oFF.XString.startsWith(rgbString, "rgb") === false && oFF.XString.startsWith(rgbString, "rgba") === false)
	{
		return this;
	}
	var start = oFF.XString.indexOf(rgbString, "(");
	var end = oFF.XString.indexOf(rgbString, ")");
	if (start !== 0 && end !== 0 && start < end)
	{
		var newString = oFF.XString.substring(rgbString, start + 1, end);
		var colorList = oFF.XStringTokenizer.splitString(newString, ",");
		if (colorList.size() === 3)
		{
			var rCol1 = oFF.XInteger.convertFromString(colorList.get(0));
			var gCol1 = oFF.XInteger.convertFromString(colorList.get(1));
			var bCol1 = oFF.XInteger.convertFromString(colorList.get(2));
			this.setColor(rCol1, gCol1, bCol1, 1.0);
			this.setOriginalCssString(rgbString);
		}
		else if (colorList.size() === 4)
		{
			var rCol2 = oFF.XInteger.convertFromString(colorList.get(0));
			var gCol2 = oFF.XInteger.convertFromString(colorList.get(1));
			var bCol2 = oFF.XInteger.convertFromString(colorList.get(2));
			var alpha = oFF.XDouble.convertFromString(colorList.get(3));
			if (alpha > 1.0)
			{
				alpha = 1.0;
			}
			this.setColor(rCol2, gCol2, bCol2, alpha);
			this.setOriginalCssString(rgbString);
		}
	}
	return this;
};
oFF.UiColor.prototype.applyColorFactor = function(colValue, factor)
{
	var correctionFactor = factor;
	if (correctionFactor > 1.0)
	{
		correctionFactor = 1.0;
	}
	if (correctionFactor < -1.0)
	{
		correctionFactor = -1.0;
	}
	return oFF.XMath.max(0, oFF.XMath.min(255, oFF.XDouble.convertToInt(colValue + 255 * correctionFactor)));
};

oFF.UiCssLength = function() {};
oFF.UiCssLength.prototype = new oFF.XObject();
oFF.UiCssLength.prototype._ff_c = "UiCssLength";

oFF.UiCssLength.INHERIT_VALUE = -99997;
oFF.UiCssLength.INHERIT_STR = "inherit";
oFF.UiCssLength.INITIAL_VALUE = -99998;
oFF.UiCssLength.INITIAL_STR = "initial";
oFF.UiCssLength.AUTO_VALUE = -99999;
oFF.UiCssLength.AUTO_STR = "auto";
oFF.UiCssLength.create = function(cssValue)
{
	if (oFF.XStringUtils.isNullOrEmpty(cssValue))
	{
		return null;
	}
	var newObject = new oFF.UiCssLength();
	newObject.setCssValue(cssValue);
	return newObject;
};
oFF.UiCssLength.createExt = function(value, unit)
{
	var newObject = new oFF.UiCssLength();
	newObject.setValue(value);
	if (oFF.notNull(unit))
	{
		newObject.setUnit(unit);
	}
	else
	{
		newObject.setUnit(oFF.UiCssSizeUnit.PIXEL);
	}
	return newObject;
};
oFF.UiCssLength.createByValue = function(value)
{
	var newObject = new oFF.UiCssLength();
	newObject.setValue(value);
	newObject.setUnit(oFF.UiCssSizeUnit.PIXEL);
	return newObject;
};
oFF.UiCssLength.createAuto = function()
{
	var newObject = new oFF.UiCssLength();
	newObject.setIsAuto();
	return newObject;
};
oFF.UiCssLength.createInitial = function()
{
	var newObject = new oFF.UiCssLength();
	newObject.setIsInitial();
	return newObject;
};
oFF.UiCssLength.createInherit = function()
{
	var newObject = new oFF.UiCssLength();
	newObject.setIsInherit();
	return newObject;
};
oFF.UiCssLength.prototype.m_value = 0.0;
oFF.UiCssLength.prototype.m_unit = null;
oFF.UiCssLength.prototype.getValue = function()
{
	return this.m_value;
};
oFF.UiCssLength.prototype.setValue = function(value)
{
	this.m_value = value;
};
oFF.UiCssLength.prototype.getUnit = function()
{
	return this.m_unit;
};
oFF.UiCssLength.prototype.setUnit = function(unit)
{
	this.m_unit = unit;
};
oFF.UiCssLength.prototype.setCssValue = function(cssValue)
{
	var trimmedCssValue = oFF.XString.trim(cssValue);
	if (oFF.XString.isEqual(trimmedCssValue, oFF.UiCssLength.AUTO_STR))
	{
		this.setIsAuto();
	}
	else if (oFF.XString.isEqual(trimmedCssValue, oFF.UiCssLength.INITIAL_STR))
	{
		this.setIsInitial();
	}
	else if (oFF.XString.isEqual(trimmedCssValue, oFF.UiCssLength.INHERIT_STR))
	{
		this.setIsInherit();
	}
	else
	{
		this.parseLengthCssString(trimmedCssValue);
	}
};
oFF.UiCssLength.prototype.getCssValue = function()
{
	if (this.isAuto())
	{
		return oFF.UiCssLength.AUTO_STR;
	}
	if (this.isInitial())
	{
		return oFF.UiCssLength.INITIAL_STR;
	}
	if (this.isInherit())
	{
		return oFF.UiCssLength.INHERIT_STR;
	}
	var buffer = oFF.XStringBuffer.create().appendDouble(this.m_value);
	if (oFF.notNull(this.m_unit))
	{
		buffer.append(this.m_unit.getDocumentName());
	}
	else
	{
		buffer.append(oFF.UiCssSizeUnit.PIXEL.getDocumentName());
	}
	var cssValue = buffer.toString();
	return cssValue;
};
oFF.UiCssLength.prototype.setByString = function(strValue)
{
	this.setCssValue(strValue);
};
oFF.UiCssLength.prototype.getAsString = function()
{
	return this.getCssValue();
};
oFF.UiCssLength.prototype.isAuto = function()
{
	return this.m_value === oFF.UiCssLength.AUTO_VALUE && oFF.isNull(this.m_unit);
};
oFF.UiCssLength.prototype.isInitial = function()
{
	return this.m_value === oFF.UiCssLength.INITIAL_VALUE && oFF.isNull(this.m_unit);
};
oFF.UiCssLength.prototype.isInherit = function()
{
	return this.m_value === oFF.UiCssLength.INHERIT_VALUE && oFF.isNull(this.m_unit);
};
oFF.UiCssLength.prototype.toString = function()
{
	var cssValue = this.getCssValue();
	if (oFF.notNull(cssValue))
	{
		return cssValue;
	}
	else if (oFF.notNull(this.m_unit))
	{
		return this.m_unit.getDocumentName();
	}
	else
	{
		return null;
	}
};
oFF.UiCssLength.prototype.parseLengthCssString = function(cssString)
{
	var size = oFF.XString.size(cssString);
	var startNotNumber = size;
	for (var i = 0; i < size; i++)
	{
		var c = oFF.XString.getCharAt(cssString, i);
		if (c !== 45 && c !== 46 && (c <= 47 || c >= 58))
		{
			startNotNumber = i;
			break;
		}
	}
	var number = oFF.XString.substring(cssString, 0, startNotNumber);
	var numberValue = 0;
	if (oFF.XStringUtils.isNotNullAndNotEmpty(number) && !oFF.XString.isEqual(number, "-") && !oFF.XString.isEqual(number, "."))
	{
		numberValue = oFF.XDouble.convertFromString(number);
	}
	var unit = oFF.XString.substring(cssString, startNotNumber, -1);
	var unitValue = null;
	if (oFF.XStringUtils.isNotNullAndNotEmpty(unit))
	{
		unitValue = oFF.UiCssSizeUnit.lookup(unit);
	}
	if (oFF.isNull(unitValue))
	{
		unitValue = oFF.UiCssSizeUnit.PIXEL;
	}
	this.m_value = numberValue;
	this.m_unit = unitValue;
};
oFF.UiCssLength.prototype.setIsAuto = function()
{
	this.m_value = oFF.UiCssLength.AUTO_VALUE;
	this.m_unit = null;
};
oFF.UiCssLength.prototype.setIsInitial = function()
{
	this.m_value = oFF.UiCssLength.INITIAL_VALUE;
	this.m_unit = null;
};
oFF.UiCssLength.prototype.setIsInherit = function()
{
	this.m_value = oFF.UiCssLength.INHERIT_VALUE;
	this.m_unit = null;
};

oFF.UiCssBoxEdges = function() {};
oFF.UiCssBoxEdges.prototype = new oFF.UiCssShorthand();
oFF.UiCssBoxEdges.prototype._ff_c = "UiCssBoxEdges";

oFF.UiCssBoxEdges.create = function(shorthandCss)
{
	if (oFF.XStringUtils.isNullOrEmpty(shorthandCss))
	{
		return null;
	}
	var newObj = new oFF.UiCssBoxEdges();
	newObj.setCssValue(shorthandCss);
	return newObj;
};
oFF.UiCssBoxEdges.createByCssValues = function(topCss, rightCss, bottomCss, leftCss)
{
	var newObj = new oFF.UiCssBoxEdges();
	newObj.setByCssValues(topCss, rightCss, bottomCss, leftCss);
	return newObj;
};
oFF.UiCssBoxEdges.createByPixelValues = function(topValue, rightValue, bottomValue, leftValue)
{
	var newObj = new oFF.UiCssBoxEdges();
	newObj.setByPixelValues(topValue, rightValue, bottomValue, leftValue);
	return newObj;
};
oFF.UiCssBoxEdges.createExt = function(top, right, bottom, left)
{
	var newObj = new oFF.UiCssBoxEdges();
	newObj.setTop(top);
	newObj.setRight(right);
	newObj.setBottom(bottom);
	newObj.setLeft(left);
	return newObj;
};
oFF.UiCssBoxEdges.createEmpty = function()
{
	return oFF.UiCssBoxEdges.create(null);
};
oFF.UiCssBoxEdges.prototype.m_top = null;
oFF.UiCssBoxEdges.prototype.m_right = null;
oFF.UiCssBoxEdges.prototype.m_bottom = null;
oFF.UiCssBoxEdges.prototype.m_left = null;
oFF.UiCssBoxEdges.prototype.setTop = function(top)
{
	this.m_top = top;
};
oFF.UiCssBoxEdges.prototype.getTop = function()
{
	return this.m_top;
};
oFF.UiCssBoxEdges.prototype.setRight = function(right)
{
	this.m_right = right;
};
oFF.UiCssBoxEdges.prototype.getRight = function()
{
	return this.m_right;
};
oFF.UiCssBoxEdges.prototype.setBottom = function(bottom)
{
	this.m_bottom = bottom;
};
oFF.UiCssBoxEdges.prototype.getBottom = function()
{
	return this.m_bottom;
};
oFF.UiCssBoxEdges.prototype.setLeft = function(left)
{
	this.m_left = left;
};
oFF.UiCssBoxEdges.prototype.getLeft = function()
{
	return this.m_left;
};
oFF.UiCssBoxEdges.prototype.setByPixelValues = function(topValue, rightValue, bottomValue, leftValue)
{
	this.setTop(oFF.UiCssLength.createExt(topValue, oFF.UiCssSizeUnit.PIXEL));
	this.setRight(oFF.UiCssLength.createExt(rightValue, oFF.UiCssSizeUnit.PIXEL));
	this.setBottom(oFF.UiCssLength.createExt(bottomValue, oFF.UiCssSizeUnit.PIXEL));
	this.setLeft(oFF.UiCssLength.createExt(leftValue, oFF.UiCssSizeUnit.PIXEL));
};
oFF.UiCssBoxEdges.prototype.setByCssValues = function(topCss, rightCss, bottomCss, leftCss)
{
	this.setTop(oFF.UiCssLength.create(topCss));
	this.setRight(oFF.UiCssLength.create(rightCss));
	this.setBottom(oFF.UiCssLength.create(bottomCss));
	this.setLeft(oFF.UiCssLength.create(leftCss));
};
oFF.UiCssBoxEdges.prototype.parseShorthandStringValues = function(cssValues)
{
	var topCssStr = null;
	var rightCssStr = null;
	var bottomCssStr = null;
	var leftCssStr = null;
	if (oFF.notNull(cssValues) && cssValues.size() > 0)
	{
		if (cssValues.size() === 1)
		{
			topCssStr = cssValues.get(0);
			rightCssStr = cssValues.get(0);
			bottomCssStr = cssValues.get(0);
			leftCssStr = cssValues.get(0);
		}
		else if (cssValues.size() === 2)
		{
			topCssStr = cssValues.get(0);
			rightCssStr = cssValues.get(1);
			bottomCssStr = cssValues.get(0);
			leftCssStr = cssValues.get(1);
		}
		else if (cssValues.size() === 3)
		{
			topCssStr = cssValues.get(0);
			rightCssStr = cssValues.get(1);
			bottomCssStr = cssValues.get(2);
			leftCssStr = cssValues.get(1);
		}
		else
		{
			topCssStr = cssValues.get(0);
			rightCssStr = cssValues.get(1);
			bottomCssStr = cssValues.get(2);
			leftCssStr = cssValues.get(3);
		}
	}
	this.setTop(oFF.UiCssLength.create(topCssStr));
	this.setRight(oFF.UiCssLength.create(rightCssStr));
	this.setBottom(oFF.UiCssLength.create(bottomCssStr));
	this.setLeft(oFF.UiCssLength.create(leftCssStr));
};
oFF.UiCssBoxEdges.prototype.convertToShorthandString = function()
{
	var topStr = null;
	var rightStr = null;
	var bottomStr = null;
	var leftStr = null;
	var shorthandCssStr = "";
	if (this.getTop() !== null)
	{
		topStr = this.getTop().getCssValue();
	}
	if (this.getRight() !== null)
	{
		rightStr = this.getRight().getCssValue();
	}
	if (this.getBottom() !== null)
	{
		bottomStr = this.getBottom().getCssValue();
	}
	if (this.getLeft() !== null)
	{
		leftStr = this.getLeft().getCssValue();
	}
	if (oFF.XString.isEqual(topStr, rightStr) && oFF.XString.isEqual(topStr, bottomStr) && oFF.XString.isEqual(topStr, leftStr))
	{
		shorthandCssStr = topStr;
	}
	else if (oFF.XString.isEqual(topStr, bottomStr) && oFF.XString.isEqual(rightStr, leftStr))
	{
		shorthandCssStr = oFF.XStringUtils.concatenate3(topStr, oFF.UiCssShorthand.CSS_VALUE_SEPARATOR, rightStr);
	}
	else if (!oFF.XString.isEqual(topStr, bottomStr) && oFF.XString.isEqual(rightStr, leftStr))
	{
		shorthandCssStr = oFF.XStringUtils.concatenate5(topStr, oFF.UiCssShorthand.CSS_VALUE_SEPARATOR, rightStr, oFF.UiCssShorthand.CSS_VALUE_SEPARATOR, bottomStr);
	}
	else
	{
		shorthandCssStr = oFF.XStringUtils.concatenate4(topStr, oFF.UiCssShorthand.CSS_VALUE_SEPARATOR, rightStr, oFF.UiCssShorthand.CSS_VALUE_SEPARATOR);
		shorthandCssStr = oFF.XStringUtils.concatenate4(shorthandCssStr, bottomStr, oFF.UiCssShorthand.CSS_VALUE_SEPARATOR, leftStr);
	}
	return shorthandCssStr;
};

oFF.UiCssTextDecoration = function() {};
oFF.UiCssTextDecoration.prototype = new oFF.UiCssShorthand();
oFF.UiCssTextDecoration.prototype._ff_c = "UiCssTextDecoration";

oFF.UiCssTextDecoration.create = function(shorthandCss)
{
	if (oFF.XStringUtils.isNullOrEmpty(shorthandCss))
	{
		return null;
	}
	var newObj = new oFF.UiCssTextDecoration();
	newObj.setCssValue(shorthandCss);
	return newObj;
};
oFF.UiCssTextDecoration.createByCssValues = function(lineCss, styleCss, colorCss)
{
	var newObj = new oFF.UiCssTextDecoration();
	newObj.setLine(oFF.UiTextDecorationLine.lookup(lineCss));
	newObj.setStyle(oFF.UiTextDecorationStyle.lookup(styleCss));
	newObj.setColor(oFF.UiColor.create(colorCss));
	return newObj;
};
oFF.UiCssTextDecoration.createByValues = function(line, style, color)
{
	var newObj = new oFF.UiCssTextDecoration();
	newObj.setLine(line);
	newObj.setStyle(style);
	newObj.setColor(color);
	return newObj;
};
oFF.UiCssTextDecoration.createEmpty = function()
{
	return oFF.UiCssTextDecoration.create(null);
};
oFF.UiCssTextDecoration.prototype.m_line = null;
oFF.UiCssTextDecoration.prototype.m_style = null;
oFF.UiCssTextDecoration.prototype.m_color = null;
oFF.UiCssTextDecoration.prototype.setLine = function(line)
{
	this.m_line = line;
};
oFF.UiCssTextDecoration.prototype.getLine = function()
{
	return this.m_line;
};
oFF.UiCssTextDecoration.prototype.setStyle = function(style)
{
	this.m_style = style;
};
oFF.UiCssTextDecoration.prototype.getStyle = function()
{
	return this.m_style;
};
oFF.UiCssTextDecoration.prototype.setColor = function(color)
{
	this.m_color = color;
};
oFF.UiCssTextDecoration.prototype.getColor = function()
{
	return this.m_color;
};
oFF.UiCssTextDecoration.prototype.parseShorthandStringValues = function(cssValues)
{
	var lineCssStr = null;
	var styleCssStr = null;
	var colorCssStr = null;
	if (oFF.notNull(cssValues) && cssValues.size() > 0)
	{
		if (cssValues.size() === 1)
		{
			lineCssStr = cssValues.get(0);
		}
		else if (cssValues.size() === 2)
		{
			lineCssStr = cssValues.get(0);
			styleCssStr = cssValues.get(1);
		}
		else
		{
			lineCssStr = cssValues.get(0);
			styleCssStr = cssValues.get(1);
			colorCssStr = cssValues.get(2);
		}
	}
	this.setLine(oFF.UiTextDecorationLine.lookup(lineCssStr));
	this.setStyle(oFF.UiTextDecorationStyle.lookup(styleCssStr));
	this.setColor(oFF.UiColor.create(colorCssStr));
};
oFF.UiCssTextDecoration.prototype.convertToShorthandString = function()
{
	var lineCssStr = null;
	var styleCssStr = null;
	var colorCssStr = null;
	var shorthandCssStr = "";
	if (this.getLine() !== null)
	{
		lineCssStr = this.getLine().getCssValue();
	}
	if (this.getStyle() !== null)
	{
		styleCssStr = this.getStyle().getCssValue();
	}
	if (this.getColor() !== null)
	{
		colorCssStr = this.getColor().getCssValue();
	}
	shorthandCssStr = this.addCssString(shorthandCssStr, lineCssStr);
	shorthandCssStr = this.addCssString(shorthandCssStr, styleCssStr);
	shorthandCssStr = this.addCssString(shorthandCssStr, colorCssStr);
	return shorthandCssStr;
};
oFF.UiCssTextDecoration.prototype.addCssString = function(shorthand, cssToAdd)
{
	var result = "";
	if (oFF.XStringUtils.isNotNullAndNotEmpty(cssToAdd))
	{
		if (oFF.XString.size(shorthand) === 0)
		{
			result = cssToAdd;
		}
		else
		{
			if (oFF.XString.startsWith(shorthand, oFF.UiCssShorthand.CSS_VALUE_SEPARATOR))
			{
				result = oFF.XStringUtils.concatenate2(shorthand, cssToAdd);
			}
			else
			{
				result = oFF.XStringUtils.concatenate3(shorthand, oFF.UiCssShorthand.CSS_VALUE_SEPARATOR, cssToAdd);
			}
		}
	}
	else if (oFF.XStringUtils.isNotNullAndNotEmpty(shorthand))
	{
		result = shorthand;
	}
	return result;
};

oFF.UiFreeGenesis = function() {};
oFF.UiFreeGenesis.prototype = new oFF.UiGenesisGeneric();
oFF.UiFreeGenesis.prototype._ff_c = "UiFreeGenesis";

oFF.UiFreeGenesis.create = function(uiManager)
{
	var genesis = new oFF.UiFreeGenesis();
	genesis.m_uiManager = uiManager;
	return genesis;
};
oFF.UiFreeGenesis.prototype.m_uiManager = null;
oFF.UiFreeGenesis.prototype.newControlExt = function(uiType, styleClass, identifier, name, parent, operation, position, firstIndex, secondIndex)
{
	return this.m_uiManager.newControlExt(uiType, styleClass, identifier, name, parent, operation, position, firstIndex, secondIndex);
};
oFF.UiFreeGenesis.prototype.newControl = function(uiType)
{
	return this.m_uiManager.newControl(uiType);
};
oFF.UiFreeGenesis.prototype.newBasicControl = function(uiType, styleClass, identifier, name)
{
	return this.m_uiManager.newBasicControl(uiType, styleClass, identifier, name);
};
oFF.UiFreeGenesis.prototype.getUiManager = function()
{
	return this.m_uiManager;
};
oFF.UiFreeGenesis.prototype.releaseObject = function()
{
	this.m_uiManager = null;
	oFF.UiGenesisGeneric.prototype.releaseObject.call( this );
};

oFF.UiClientPropBool = function() {};
oFF.UiClientPropBool.prototype = new oFF.UiClientOperationProp();
oFF.UiClientPropBool.prototype._ff_c = "UiClientPropBool";

oFF.UiClientPropBool.prototype.getComponentType = function()
{
	return oFF.UiComponentType.UI_PROPERTY_OP_BOOL;
};
oFF.UiClientPropBool.prototype.exportProperty = function(source, target)
{
	target.putBoolean(this.getPropertyName(), this.getBoolValue(source));
};
oFF.UiClientPropBool.prototype.importProperty = function(target, value)
{
	var boolValue = oFF.XBoolean.convertFromString(value);
	this.setBoolValue(target, boolValue);
	return target;
};
oFF.UiClientPropBool.prototype.executeGetterOperation = function(client, uiContext, operation, offset)
{
	var uiReturnContext = null;
	if (oFF.notNull(uiContext))
	{
		var boolValue = this.getBoolValue(uiContext);
		uiReturnContext = oFF.XBooleanValue.create(boolValue);
	}
	return uiReturnContext;
};
oFF.UiClientPropBool.prototype.executeSetterOperation = function(client, uiContext, operation, offset)
{
	var boolValue;
	var element = operation.get(offset);
	var type = element.getType();
	if (type === oFF.PrElementType.STRING)
	{
		var tmpString = element.asString().getString();
		if (oFF.notNull(tmpString) && oFF.XString.size(tmpString) > 0)
		{
			boolValue = oFF.XBoolean.convertFromString(tmpString);
			this.setBoolValue(uiContext, boolValue);
		}
	}
	else if (type === oFF.PrElementType.BOOLEAN)
	{
		boolValue = element.asBoolean().getBoolean();
		this.setBoolValue(uiContext, boolValue);
	}
	return uiContext;
};

oFF.UiClientPropDouble = function() {};
oFF.UiClientPropDouble.prototype = new oFF.UiClientOperationProp();
oFF.UiClientPropDouble.prototype._ff_c = "UiClientPropDouble";

oFF.UiClientPropDouble.prototype.getComponentType = function()
{
	return oFF.UiComponentType.UI_PROPERTY_OP_DOUBLE;
};
oFF.UiClientPropDouble.prototype.exportProperty = function(source, target)
{
	target.putDouble(this.getPropertyName(), this.getDoubleValue(source));
};
oFF.UiClientPropDouble.prototype.importProperty = function(target, value)
{
	var doubleValue = oFF.XDouble.convertFromString(value);
	this.setDoubleValue(target, doubleValue);
	return target;
};
oFF.UiClientPropDouble.prototype.executeSetterOperation = function(client, uiContext, operation, offset)
{
	var doubleValue;
	var element = operation.get(offset);
	var type = element.getType();
	if (type === oFF.PrElementType.STRING)
	{
		var tmpString = element.asString().getString();
		if (oFF.notNull(tmpString) && oFF.XString.size(tmpString) > 0)
		{
			doubleValue = oFF.XDouble.convertFromString(tmpString);
			this.setDoubleValue(uiContext, doubleValue);
		}
	}
	else if (type.isNumber())
	{
		doubleValue = element.asDouble().getDouble();
		this.setDoubleValue(uiContext, doubleValue);
	}
	return uiContext;
};
oFF.UiClientPropDouble.prototype.executeGetterOperation = function(client, uiContext, operation, offset)
{
	var uiReturnContext = null;
	if (oFF.notNull(uiContext))
	{
		var doubleValue = this.getDoubleValue(uiContext);
		uiReturnContext = oFF.XDoubleValue.create(doubleValue);
	}
	return uiReturnContext;
};

oFF.UiClientPropInt = function() {};
oFF.UiClientPropInt.prototype = new oFF.UiClientOperationProp();
oFF.UiClientPropInt.prototype._ff_c = "UiClientPropInt";

oFF.UiClientPropInt.prototype.getComponentType = function()
{
	return oFF.UiComponentType.UI_PROPERTY_OP_INT;
};
oFF.UiClientPropInt.prototype.exportProperty = function(source, target)
{
	target.putInteger(this.getPropertyName(), this.getIntValue(source));
};
oFF.UiClientPropInt.prototype.importProperty = function(target, value)
{
	var intValue = oFF.XInteger.convertFromString(value);
	this.setIntValue(target, intValue);
	return target;
};
oFF.UiClientPropInt.prototype.executeSetterOperation = function(client, uiContext, operation, offset)
{
	var intValue;
	var element = operation.get(offset);
	var type = element.getType();
	if (type === oFF.PrElementType.STRING)
	{
		var tmpString = element.asString().getString();
		if (oFF.notNull(tmpString) && oFF.XString.size(tmpString) > 0)
		{
			intValue = oFF.XInteger.convertFromString(tmpString);
			this.setIntValue(uiContext, intValue);
		}
	}
	else if (type.isNumber())
	{
		intValue = element.asInteger().getInteger();
		this.setIntValue(uiContext, intValue);
	}
	return uiContext;
};
oFF.UiClientPropInt.prototype.executeGetterOperation = function(client, uiContext, operation, offset)
{
	var uiReturnContext = null;
	if (oFF.notNull(uiContext))
	{
		var intValue = this.getIntValue(uiContext);
		uiReturnContext = oFF.XIntegerValue.create(intValue);
	}
	return uiReturnContext;
};

oFF.UiClientPropJson = function() {};
oFF.UiClientPropJson.prototype = new oFF.UiClientOperationProp();
oFF.UiClientPropJson.prototype._ff_c = "UiClientPropJson";

oFF.UiClientPropJson.prototype.getComponentType = function()
{
	return oFF.UiComponentType.UI_PROPERTY_OP_JSON;
};
oFF.UiClientPropJson.prototype.exportProperty = function(source, target)
{
	var jsonValue = this.getJsonValue(source);
	if (oFF.notNull(jsonValue))
	{
		target.put(this.getPropertyName(), jsonValue);
	}
	else
	{
		target.putNull(this.getPropertyName());
	}
};
oFF.UiClientPropJson.prototype.importProperty = function(target, value)
{
	var jsonValue = oFF.JsonParserFactory.createFromString(value);
	this.setJsonValue(target, jsonValue);
	return target;
};
oFF.UiClientPropJson.prototype.executeSetterOperation = function(client, uiContext, operation, offset)
{
	var paramJson = operation.get(offset);
	this.setJsonValue(uiContext, paramJson);
	return uiContext;
};
oFF.UiClientPropJson.prototype.executeGetterOperation = function(client, uiContext, operation, offset)
{
	var uiReturnContext = null;
	if (oFF.notNull(uiContext))
	{
		uiReturnContext = this.getJsonValue(uiContext);
	}
	return uiReturnContext;
};

oFF.UiClientPropString = function() {};
oFF.UiClientPropString.prototype = new oFF.UiClientOperationProp();
oFF.UiClientPropString.prototype._ff_c = "UiClientPropString";

oFF.UiClientPropString.prototype.getComponentType = function()
{
	return oFF.UiComponentType.UI_PROPERTY_OP_STRING;
};
oFF.UiClientPropString.prototype.importProperty = function(target, value)
{
	this.setString(target, value);
	return target;
};
oFF.UiClientPropString.prototype.exportProperty = function(source, target)
{
	var value = this.getString(source);
	if (oFF.notNull(value))
	{
		target.putString(this.getPropertyName(), value);
	}
	else
	{
		target.putNull(this.getPropertyName());
	}
};
oFF.UiClientPropString.prototype.executeSetterOperation = function(client, uiContext, operation, offset)
{
	if (oFF.notNull(uiContext))
	{
		var paramText = null;
		if (offset < operation.size())
		{
			var element = operation.get(offset);
			if (oFF.notNull(element))
			{
				paramText = element.asString().getString();
			}
			this.importProperty(uiContext, paramText);
		}
	}
	return uiContext;
};
oFF.UiClientPropString.prototype.executeGetterOperation = function(client, uiContext, operation, offset)
{
	var uiReturnContext = null;
	if (oFF.notNull(uiContext))
	{
		var text = this.getString(uiContext);
		if (oFF.notNull(text))
		{
			uiReturnContext = oFF.XStringValue.create(text);
		}
	}
	return uiReturnContext;
};

oFF.UiClientAggrButtons = function() {};
oFF.UiClientAggrButtons.prototype = new oFF.UiClientOperationAggregation();
oFF.UiClientAggrButtons.prototype._ff_c = "UiClientAggrButtons";

oFF.UiClientAggrButtons.prototype.executeAddIntoAggregation = function(uiContext, control)
{
	uiContext.addButton(control);
};
oFF.UiClientAggrButtons.prototype.executeInsertIntoAggregation = function(uiContext, control, index)
{
	uiContext.insertButton(control, index);
};
oFF.UiClientAggrButtons.prototype.executeRemoveFromAggregation = function(uiContext, control)
{
	uiContext.removeButton(control);
};
oFF.UiClientAggrButtons.prototype.executeClearAggregation = function(uiContext)
{
	uiContext.clearButtons();
};

oFF.UiClientAggrCells = function() {};
oFF.UiClientAggrCells.prototype = new oFF.UiClientOperationAggregation();
oFF.UiClientAggrCells.prototype._ff_c = "UiClientAggrCells";

oFF.UiClientAggrCells.prototype.executeAddIntoAggregation = function(uiContext, control)
{
	uiContext.addCell(control);
};
oFF.UiClientAggrCells.prototype.executeInsertIntoAggregation = function(uiContext, control, index)
{
	uiContext.insertCell(control, index);
};
oFF.UiClientAggrCells.prototype.executeRemoveFromAggregation = function(uiContext, control)
{
	uiContext.removeCell(control);
};
oFF.UiClientAggrCells.prototype.executeClearAggregation = function(uiContext)
{
	uiContext.clearCells();
};

oFF.UiClientAggrColumns = function() {};
oFF.UiClientAggrColumns.prototype = new oFF.UiClientOperationAggregation();
oFF.UiClientAggrColumns.prototype._ff_c = "UiClientAggrColumns";

oFF.UiClientAggrColumns.prototype.executeAddIntoAggregation = function(uiContext, control)
{
	uiContext.addColumn(control);
};
oFF.UiClientAggrColumns.prototype.executeInsertIntoAggregation = function(uiContext, control, index)
{
	uiContext.insertColumn(control, index);
};
oFF.UiClientAggrColumns.prototype.executeRemoveFromAggregation = function(uiContext, control)
{
	uiContext.removeColumn(control);
};
oFF.UiClientAggrColumns.prototype.executeClearAggregation = function(uiContext)
{
	uiContext.clearColumns();
};

oFF.UiClientAggrDialogButtons = function() {};
oFF.UiClientAggrDialogButtons.prototype = new oFF.UiClientOperationAggregation();
oFF.UiClientAggrDialogButtons.prototype._ff_c = "UiClientAggrDialogButtons";

oFF.UiClientAggrDialogButtons.prototype.executeAddIntoAggregation = function(uiContext, control)
{
	uiContext.addDialogButton(control);
};
oFF.UiClientAggrDialogButtons.prototype.executeInsertIntoAggregation = function(uiContext, control, index)
{
	uiContext.insertDialogButton(control, index);
};
oFF.UiClientAggrDialogButtons.prototype.executeRemoveFromAggregation = function(uiContext, control)
{
	uiContext.removeDialogButton(control);
};
oFF.UiClientAggrDialogButtons.prototype.executeClearAggregation = function(uiContext)
{
	uiContext.clearDialogButtons();
};

oFF.UiClientAggrEndIcons = function() {};
oFF.UiClientAggrEndIcons.prototype = new oFF.UiClientOperationAggregation();
oFF.UiClientAggrEndIcons.prototype._ff_c = "UiClientAggrEndIcons";

oFF.UiClientAggrEndIcons.prototype.executeAddIntoAggregation = function(uiContext, control)
{
	uiContext.addEndIcon(control);
};
oFF.UiClientAggrEndIcons.prototype.executeInsertIntoAggregation = function(uiContext, control, index)
{
	uiContext.insertEndIcon(control, index);
};
oFF.UiClientAggrEndIcons.prototype.executeRemoveFromAggregation = function(uiContext, control)
{
	uiContext.removeEndIcon(control);
};
oFF.UiClientAggrEndIcons.prototype.executeClearAggregation = function(uiContext)
{
	uiContext.clearEndIcons();
};

oFF.UiClientAggrItems = function() {};
oFF.UiClientAggrItems.prototype = new oFF.UiClientOperationAggregation();
oFF.UiClientAggrItems.prototype._ff_c = "UiClientAggrItems";

oFF.UiClientAggrItems.prototype.executeAddIntoAggregation = function(uiContext, control)
{
	uiContext.addItem(control);
};
oFF.UiClientAggrItems.prototype.executeInsertIntoAggregation = function(uiContext, control, index)
{
	uiContext.insertItem(control, index);
};
oFF.UiClientAggrItems.prototype.executeRemoveFromAggregation = function(uiContext, control)
{
	uiContext.removeItem(control);
};
oFF.UiClientAggrItems.prototype.executeClearAggregation = function(uiContext)
{
	uiContext.clearItems();
};

oFF.UiClientAggrMatrixLayoutCells = function() {};
oFF.UiClientAggrMatrixLayoutCells.prototype = new oFF.UiClientOperationAggregation();
oFF.UiClientAggrMatrixLayoutCells.prototype._ff_c = "UiClientAggrMatrixLayoutCells";

oFF.UiClientAggrMatrixLayoutCells.prototype.executeAddIntoAggregation = function(uiContext, control)
{
	uiContext.addMatrixLayoutCell(control);
};
oFF.UiClientAggrMatrixLayoutCells.prototype.executeInsertIntoAggregation = function(uiContext, control, index)
{
	uiContext.insertMatrixLayoutCell(control, index);
};
oFF.UiClientAggrMatrixLayoutCells.prototype.executeRemoveFromAggregation = function(uiContext, control)
{
	uiContext.removeMatrixLayoutCell(control);
};
oFF.UiClientAggrMatrixLayoutCells.prototype.executeClearAggregation = function(uiContext)
{
	uiContext.clearMatrixLayoutCells();
};

oFF.UiClientAggrMatrixLayoutRows = function() {};
oFF.UiClientAggrMatrixLayoutRows.prototype = new oFF.UiClientOperationAggregation();
oFF.UiClientAggrMatrixLayoutRows.prototype._ff_c = "UiClientAggrMatrixLayoutRows";

oFF.UiClientAggrMatrixLayoutRows.prototype.executeAddIntoAggregation = function(uiContext, control)
{
	uiContext.addMatrixLayoutRow(control);
};
oFF.UiClientAggrMatrixLayoutRows.prototype.executeInsertIntoAggregation = function(uiContext, control, index)
{
	uiContext.insertMatrixLayoutRow(control, index);
};
oFF.UiClientAggrMatrixLayoutRows.prototype.executeRemoveFromAggregation = function(uiContext, control)
{
	uiContext.removeMatrixLayoutRow(control);
};
oFF.UiClientAggrMatrixLayoutRows.prototype.executeClearAggregation = function(uiContext)
{
	uiContext.clearMatrixLayoutRows();
};

oFF.UiClientAggrPageButtons = function() {};
oFF.UiClientAggrPageButtons.prototype = new oFF.UiClientOperationAggregation();
oFF.UiClientAggrPageButtons.prototype._ff_c = "UiClientAggrPageButtons";

oFF.UiClientAggrPageButtons.prototype.executeAddIntoAggregation = function(uiContext, control)
{
	uiContext.addPageButton(control);
};
oFF.UiClientAggrPageButtons.prototype.executeInsertIntoAggregation = function(uiContext, control, index)
{
	uiContext.insertPageButton(control, index);
};
oFF.UiClientAggrPageButtons.prototype.executeRemoveFromAggregation = function(uiContext, control)
{
	uiContext.removePageButton(control);
};
oFF.UiClientAggrPageButtons.prototype.executeClearAggregation = function(uiContext)
{
	uiContext.clearPageButtons();
};

oFF.UiClientAggrPages = function() {};
oFF.UiClientAggrPages.prototype = new oFF.UiClientOperationAggregation();
oFF.UiClientAggrPages.prototype._ff_c = "UiClientAggrPages";

oFF.UiClientAggrPages.prototype.executeAddIntoAggregation = function(uiContext, control)
{
	uiContext.pushPage(control);
};
oFF.UiClientAggrPages.prototype.executeInsertIntoAggregation = function(uiContext, control, index)
{
	oFF.XException.createUnsupportedOperationException();
};
oFF.UiClientAggrPages.prototype.executeRemoveFromAggregation = function(uiContext, control)
{
	if (uiContext.getPages().contains(control))
	{
		uiContext.popPage();
	}
};
oFF.UiClientAggrPages.prototype.executeClearAggregation = function(uiContext)
{
	uiContext.clearPages();
};

oFF.UiClientAggrRadioButtons = function() {};
oFF.UiClientAggrRadioButtons.prototype = new oFF.UiClientOperationAggregation();
oFF.UiClientAggrRadioButtons.prototype._ff_c = "UiClientAggrRadioButtons";

oFF.UiClientAggrRadioButtons.prototype.executeAddIntoAggregation = function(uiContext, control)
{
	uiContext.addRadioButton(control);
};
oFF.UiClientAggrRadioButtons.prototype.executeInsertIntoAggregation = function(uiContext, control, index)
{
	uiContext.insertRadioButton(control, index);
};
oFF.UiClientAggrRadioButtons.prototype.executeRemoveFromAggregation = function(uiContext, control)
{
	uiContext.removeRadioButton(control);
};
oFF.UiClientAggrRadioButtons.prototype.executeClearAggregation = function(uiContext)
{
	uiContext.clearRadioButtons();
};

oFF.UiClientAggrResponsiveTableCells = function() {};
oFF.UiClientAggrResponsiveTableCells.prototype = new oFF.UiClientOperationAggregation();
oFF.UiClientAggrResponsiveTableCells.prototype._ff_c = "UiClientAggrResponsiveTableCells";

oFF.UiClientAggrResponsiveTableCells.prototype.executeAddIntoAggregation = function(uiContext, control)
{
	uiContext.addResponsiveTableCell(control);
};
oFF.UiClientAggrResponsiveTableCells.prototype.executeInsertIntoAggregation = function(uiContext, control, index)
{
	uiContext.insertResponsiveTableCell(control, index);
};
oFF.UiClientAggrResponsiveTableCells.prototype.executeRemoveFromAggregation = function(uiContext, control)
{
	uiContext.removeResponsiveTableCell(control);
};
oFF.UiClientAggrResponsiveTableCells.prototype.executeClearAggregation = function(uiContext)
{
	uiContext.clearResponsiveTableCells();
};

oFF.UiClientAggrResponsiveTableColumns = function() {};
oFF.UiClientAggrResponsiveTableColumns.prototype = new oFF.UiClientOperationAggregation();
oFF.UiClientAggrResponsiveTableColumns.prototype._ff_c = "UiClientAggrResponsiveTableColumns";

oFF.UiClientAggrResponsiveTableColumns.prototype.executeAddIntoAggregation = function(uiContext, control)
{
	uiContext.addResponsiveTableColumn(control);
};
oFF.UiClientAggrResponsiveTableColumns.prototype.executeInsertIntoAggregation = function(uiContext, control, index)
{
	uiContext.insertResponsiveTableColumn(control, index);
};
oFF.UiClientAggrResponsiveTableColumns.prototype.executeRemoveFromAggregation = function(uiContext, control)
{
	uiContext.removeResponsiveTableColumn(control);
};
oFF.UiClientAggrResponsiveTableColumns.prototype.executeClearAggregation = function(uiContext)
{
	uiContext.clearResponsiveTableColumns();
};

oFF.UiClientAggrResponsiveTableRows = function() {};
oFF.UiClientAggrResponsiveTableRows.prototype = new oFF.UiClientOperationAggregation();
oFF.UiClientAggrResponsiveTableRows.prototype._ff_c = "UiClientAggrResponsiveTableRows";

oFF.UiClientAggrResponsiveTableRows.prototype.executeAddIntoAggregation = function(uiContext, control)
{
	uiContext.addResponsiveTableRow(control);
};
oFF.UiClientAggrResponsiveTableRows.prototype.executeInsertIntoAggregation = function(uiContext, control, index)
{
	uiContext.insertResponsiveTableRow(control, index);
};
oFF.UiClientAggrResponsiveTableRows.prototype.executeRemoveFromAggregation = function(uiContext, control)
{
	uiContext.removeResponsiveTableRow(control);
};
oFF.UiClientAggrResponsiveTableRows.prototype.executeClearAggregation = function(uiContext)
{
	uiContext.clearResponsiveTableRows();
};

oFF.UiClientAggrRows = function() {};
oFF.UiClientAggrRows.prototype = new oFF.UiClientOperationAggregation();
oFF.UiClientAggrRows.prototype._ff_c = "UiClientAggrRows";

oFF.UiClientAggrRows.prototype.executeAddIntoAggregation = function(uiContext, control)
{
	uiContext.addRow(control);
};
oFF.UiClientAggrRows.prototype.executeInsertIntoAggregation = function(uiContext, control, index)
{
	uiContext.insertRow(control, index);
};
oFF.UiClientAggrRows.prototype.executeRemoveFromAggregation = function(uiContext, control)
{
	uiContext.removeRow(control);
};
oFF.UiClientAggrRows.prototype.executeClearAggregation = function(uiContext)
{
	uiContext.clearRows();
};

oFF.UiClientAggrSuggestions = function() {};
oFF.UiClientAggrSuggestions.prototype = new oFF.UiClientOperationAggregation();
oFF.UiClientAggrSuggestions.prototype._ff_c = "UiClientAggrSuggestions";

oFF.UiClientAggrSuggestions.prototype.executeAddIntoAggregation = function(uiContext, control)
{
	uiContext.addSuggestion(control);
};
oFF.UiClientAggrSuggestions.prototype.executeInsertIntoAggregation = function(uiContext, control, index)
{
	uiContext.insertSuggestion(control, index);
};
oFF.UiClientAggrSuggestions.prototype.executeRemoveFromAggregation = function(uiContext, control)
{
	uiContext.removeSuggestion(control);
};
oFF.UiClientAggrSuggestions.prototype.executeClearAggregation = function(uiContext)
{
	uiContext.clearSuggestions();
};

oFF.UiClientAggrTreeTableRows = function() {};
oFF.UiClientAggrTreeTableRows.prototype = new oFF.UiClientOperationAggregation();
oFF.UiClientAggrTreeTableRows.prototype._ff_c = "UiClientAggrTreeTableRows";

oFF.UiClientAggrTreeTableRows.prototype.executeAddIntoAggregation = function(uiContext, control)
{
	uiContext.addTreeTableRow(control);
};
oFF.UiClientAggrTreeTableRows.prototype.executeInsertIntoAggregation = function(uiContext, control, index)
{
	uiContext.insertTreeTableRow(control, index);
};
oFF.UiClientAggrTreeTableRows.prototype.executeRemoveFromAggregation = function(uiContext, control)
{
	uiContext.removeTreeTableRow(control);
};
oFF.UiClientAggrTreeTableRows.prototype.executeClearAggregation = function(uiContext)
{
	uiContext.clearTreeTableRows();
};

oFF.UiClientOpRegisterOnAfterClose = function() {};
oFF.UiClientOpRegisterOnAfterClose.prototype = new oFF.UiClientOperationListener();
oFF.UiClientOpRegisterOnAfterClose.prototype._ff_c = "UiClientOpRegisterOnAfterClose";

oFF.UiClientOpRegisterOnAfterClose.prototype.getEventType = function()
{
	return oFF.UiEvent.ON_AFTER_CLOSE;
};
oFF.UiClientOpRegisterOnAfterClose.prototype.executeRegisterListener = function(uiContext, listenerAggregation)
{
	return uiContext.registerOnAfterClose(listenerAggregation);
};

oFF.UiClientOpRegisterOnAfterOpen = function() {};
oFF.UiClientOpRegisterOnAfterOpen.prototype = new oFF.UiClientOperationListener();
oFF.UiClientOpRegisterOnAfterOpen.prototype._ff_c = "UiClientOpRegisterOnAfterOpen";

oFF.UiClientOpRegisterOnAfterOpen.prototype.getEventType = function()
{
	return oFF.UiEvent.ON_AFTER_OPEN;
};
oFF.UiClientOpRegisterOnAfterOpen.prototype.executeRegisterListener = function(uiContext, listenerAggregation)
{
	return uiContext.registerOnAfterOpen(listenerAggregation);
};

oFF.UiClientOpRegisterOnBack = function() {};
oFF.UiClientOpRegisterOnBack.prototype = new oFF.UiClientOperationListener();
oFF.UiClientOpRegisterOnBack.prototype._ff_c = "UiClientOpRegisterOnBack";

oFF.UiClientOpRegisterOnBack.prototype.getEventType = function()
{
	return oFF.UiEvent.ON_BACK;
};
oFF.UiClientOpRegisterOnBack.prototype.executeRegisterListener = function(uiContext, listenerAggregation)
{
	return uiContext.registerOnBack(listenerAggregation);
};

oFF.UiClientOpRegisterOnBeforeClose = function() {};
oFF.UiClientOpRegisterOnBeforeClose.prototype = new oFF.UiClientOperationListener();
oFF.UiClientOpRegisterOnBeforeClose.prototype._ff_c = "UiClientOpRegisterOnBeforeClose";

oFF.UiClientOpRegisterOnBeforeClose.prototype.getEventType = function()
{
	return oFF.UiEvent.ON_BEFORE_CLOSE;
};
oFF.UiClientOpRegisterOnBeforeClose.prototype.executeRegisterListener = function(uiContext, listenerAggregation)
{
	return uiContext.registerOnBeforeClose(listenerAggregation);
};

oFF.UiClientOpRegisterOnBeforeOpen = function() {};
oFF.UiClientOpRegisterOnBeforeOpen.prototype = new oFF.UiClientOperationListener();
oFF.UiClientOpRegisterOnBeforeOpen.prototype._ff_c = "UiClientOpRegisterOnBeforeOpen";

oFF.UiClientOpRegisterOnBeforeOpen.prototype.getEventType = function()
{
	return oFF.UiEvent.ON_BEFORE_OPEN;
};
oFF.UiClientOpRegisterOnBeforeOpen.prototype.executeRegisterListener = function(uiContext, listenerAggregation)
{
	return uiContext.registerOnBeforeOpen(listenerAggregation);
};

oFF.UiClientOpRegisterOnButtonPress = function() {};
oFF.UiClientOpRegisterOnButtonPress.prototype = new oFF.UiClientOperationListener();
oFF.UiClientOpRegisterOnButtonPress.prototype._ff_c = "UiClientOpRegisterOnButtonPress";

oFF.UiClientOpRegisterOnButtonPress.prototype.getEventType = function()
{
	return oFF.UiEvent.ON_BUTTON_PRESS;
};
oFF.UiClientOpRegisterOnButtonPress.prototype.executeRegisterListener = function(uiContext, listenerAggregation)
{
	return uiContext.registerOnButtonPress(listenerAggregation);
};

oFF.UiClientOpRegisterOnChange = function() {};
oFF.UiClientOpRegisterOnChange.prototype = new oFF.UiClientOperationListener();
oFF.UiClientOpRegisterOnChange.prototype._ff_c = "UiClientOpRegisterOnChange";

oFF.UiClientOpRegisterOnChange.prototype.getEventType = function()
{
	return oFF.UiEvent.ON_CHANGE;
};
oFF.UiClientOpRegisterOnChange.prototype.executeRegisterListener = function(uiContext, listenerAggregation)
{
	return uiContext.registerOnChange(listenerAggregation);
};

oFF.UiClientOpRegisterOnClick = function() {};
oFF.UiClientOpRegisterOnClick.prototype = new oFF.UiClientOperationListener();
oFF.UiClientOpRegisterOnClick.prototype._ff_c = "UiClientOpRegisterOnClick";

oFF.UiClientOpRegisterOnClick.prototype.getEventType = function()
{
	return oFF.UiEvent.ON_CLICK;
};
oFF.UiClientOpRegisterOnClick.prototype.executeRegisterListener = function(uiContext, listenerAggregation)
{
	return uiContext.registerOnClick(listenerAggregation);
};

oFF.UiClientOpRegisterOnClose = function() {};
oFF.UiClientOpRegisterOnClose.prototype = new oFF.UiClientOperationListener();
oFF.UiClientOpRegisterOnClose.prototype._ff_c = "UiClientOpRegisterOnClose";

oFF.UiClientOpRegisterOnClose.prototype.getEventType = function()
{
	return oFF.UiEvent.ON_CLOSE;
};
oFF.UiClientOpRegisterOnClose.prototype.executeRegisterListener = function(uiContext, listenerAggregation)
{
	return uiContext.registerOnClose(listenerAggregation);
};

oFF.UiClientOpRegisterOnCollapse = function() {};
oFF.UiClientOpRegisterOnCollapse.prototype = new oFF.UiClientOperationListener();
oFF.UiClientOpRegisterOnCollapse.prototype._ff_c = "UiClientOpRegisterOnCollapse";

oFF.UiClientOpRegisterOnCollapse.prototype.getEventType = function()
{
	return oFF.UiEvent.ON_COLLAPSE;
};
oFF.UiClientOpRegisterOnCollapse.prototype.executeRegisterListener = function(uiContext, listenerAggregation)
{
	return uiContext.registerOnCollapse(listenerAggregation);
};

oFF.UiClientOpRegisterOnContextMenu = function() {};
oFF.UiClientOpRegisterOnContextMenu.prototype = new oFF.UiClientOperationListener();
oFF.UiClientOpRegisterOnContextMenu.prototype._ff_c = "UiClientOpRegisterOnContextMenu";

oFF.UiClientOpRegisterOnContextMenu.prototype.getEventType = function()
{
	return oFF.UiEvent.ON_CONTEXT_MENU;
};
oFF.UiClientOpRegisterOnContextMenu.prototype.executeRegisterListener = function(uiContext, listenerAggregation)
{
	return uiContext.registerOnContextMenu(listenerAggregation);
};

oFF.UiClientOpRegisterOnDelete = function() {};
oFF.UiClientOpRegisterOnDelete.prototype = new oFF.UiClientOperationListener();
oFF.UiClientOpRegisterOnDelete.prototype._ff_c = "UiClientOpRegisterOnDelete";

oFF.UiClientOpRegisterOnDelete.prototype.getEventType = function()
{
	return oFF.UiEvent.ON_DELETE;
};
oFF.UiClientOpRegisterOnDelete.prototype.executeRegisterListener = function(uiContext, listenerAggregation)
{
	return uiContext.registerOnDelete(listenerAggregation);
};

oFF.UiClientOpRegisterOnDetailPress = function() {};
oFF.UiClientOpRegisterOnDetailPress.prototype = new oFF.UiClientOperationListener();
oFF.UiClientOpRegisterOnDetailPress.prototype._ff_c = "UiClientOpRegisterOnDetailPress";

oFF.UiClientOpRegisterOnDetailPress.prototype.getEventType = function()
{
	return oFF.UiEvent.ON_DETAIL_PRESS;
};
oFF.UiClientOpRegisterOnDetailPress.prototype.executeRegisterListener = function(uiContext, listenerAggregation)
{
	return uiContext.registerOnDetailPress(listenerAggregation);
};

oFF.UiClientOpRegisterOnDoubleClick = function() {};
oFF.UiClientOpRegisterOnDoubleClick.prototype = new oFF.UiClientOperationListener();
oFF.UiClientOpRegisterOnDoubleClick.prototype._ff_c = "UiClientOpRegisterOnDoubleClick";

oFF.UiClientOpRegisterOnDoubleClick.prototype.getEventType = function()
{
	return oFF.UiEvent.ON_DOUBLE_CLICK;
};
oFF.UiClientOpRegisterOnDoubleClick.prototype.executeRegisterListener = function(uiContext, listenerAggregation)
{
	return uiContext.registerOnDoubleClick(listenerAggregation);
};

oFF.UiClientOpRegisterOnDrop = function() {};
oFF.UiClientOpRegisterOnDrop.prototype = new oFF.UiClientOperationListener();
oFF.UiClientOpRegisterOnDrop.prototype._ff_c = "UiClientOpRegisterOnDrop";

oFF.UiClientOpRegisterOnDrop.prototype.getEventType = function()
{
	return oFF.UiEvent.ON_DROP;
};
oFF.UiClientOpRegisterOnDrop.prototype.executeRegisterListener = function(uiContext, listenerAggregation)
{
	return uiContext.registerOnDrop(listenerAggregation);
};

oFF.UiClientOpRegisterOnEditingBegin = function() {};
oFF.UiClientOpRegisterOnEditingBegin.prototype = new oFF.UiClientOperationListener();
oFF.UiClientOpRegisterOnEditingBegin.prototype._ff_c = "UiClientOpRegisterOnEditingBegin";

oFF.UiClientOpRegisterOnEditingBegin.prototype.getEventType = function()
{
	return oFF.UiEvent.ON_EDITING_BEGIN;
};
oFF.UiClientOpRegisterOnEditingBegin.prototype.executeRegisterListener = function(uiContext, listenerAggregation)
{
	return uiContext.registerOnEditingBegin(listenerAggregation);
};

oFF.UiClientOpRegisterOnEditingEnd = function() {};
oFF.UiClientOpRegisterOnEditingEnd.prototype = new oFF.UiClientOperationListener();
oFF.UiClientOpRegisterOnEditingEnd.prototype._ff_c = "UiClientOpRegisterOnEditingEnd";

oFF.UiClientOpRegisterOnEditingEnd.prototype.getEventType = function()
{
	return oFF.UiEvent.ON_EDITING_END;
};
oFF.UiClientOpRegisterOnEditingEnd.prototype.executeRegisterListener = function(uiContext, listenerAggregation)
{
	return uiContext.registerOnEditingEnd(listenerAggregation);
};

oFF.UiClientOpRegisterOnEnter = function() {};
oFF.UiClientOpRegisterOnEnter.prototype = new oFF.UiClientOperationListener();
oFF.UiClientOpRegisterOnEnter.prototype._ff_c = "UiClientOpRegisterOnEnter";

oFF.UiClientOpRegisterOnEnter.prototype.getEventType = function()
{
	return oFF.UiEvent.ON_ENTER;
};
oFF.UiClientOpRegisterOnEnter.prototype.executeRegisterListener = function(uiContext, listenerAggregation)
{
	return uiContext.registerOnEnter(listenerAggregation);
};

oFF.UiClientOpRegisterOnError = function() {};
oFF.UiClientOpRegisterOnError.prototype = new oFF.UiClientOperationListener();
oFF.UiClientOpRegisterOnError.prototype._ff_c = "UiClientOpRegisterOnError";

oFF.UiClientOpRegisterOnError.prototype.getEventType = function()
{
	return oFF.UiEvent.ON_ERROR;
};
oFF.UiClientOpRegisterOnError.prototype.executeRegisterListener = function(uiContext, listenerAggregation)
{
	return uiContext.registerOnError(listenerAggregation);
};

oFF.UiClientOpRegisterOnExecute = function() {};
oFF.UiClientOpRegisterOnExecute.prototype = new oFF.UiClientOperationListener();
oFF.UiClientOpRegisterOnExecute.prototype._ff_c = "UiClientOpRegisterOnExecute";

oFF.UiClientOpRegisterOnExecute.prototype.getEventType = function()
{
	return oFF.UiEvent.ON_EXECUTE;
};
oFF.UiClientOpRegisterOnExecute.prototype.executeRegisterListener = function(uiContext, listenerAggregation)
{
	return uiContext.registerOnExecute(listenerAggregation);
};

oFF.UiClientOpRegisterOnExpand = function() {};
oFF.UiClientOpRegisterOnExpand.prototype = new oFF.UiClientOperationListener();
oFF.UiClientOpRegisterOnExpand.prototype._ff_c = "UiClientOpRegisterOnExpand";

oFF.UiClientOpRegisterOnExpand.prototype.getEventType = function()
{
	return oFF.UiEvent.ON_EXPAND;
};
oFF.UiClientOpRegisterOnExpand.prototype.executeRegisterListener = function(uiContext, listenerAggregation)
{
	return uiContext.registerOnExpand(listenerAggregation);
};

oFF.UiClientOpRegisterOnFileDrop = function() {};
oFF.UiClientOpRegisterOnFileDrop.prototype = new oFF.UiClientOperationListener();
oFF.UiClientOpRegisterOnFileDrop.prototype._ff_c = "UiClientOpRegisterOnFileDrop";

oFF.UiClientOpRegisterOnFileDrop.prototype.getEventType = function()
{
	return oFF.UiEvent.ON_FILE_DROP;
};
oFF.UiClientOpRegisterOnFileDrop.prototype.executeRegisterListener = function(uiContext, listenerAggregation)
{
	return uiContext.registerOnFileDrop(listenerAggregation);
};

oFF.UiClientOpRegisterOnHover = function() {};
oFF.UiClientOpRegisterOnHover.prototype = new oFF.UiClientOperationListener();
oFF.UiClientOpRegisterOnHover.prototype._ff_c = "UiClientOpRegisterOnHover";

oFF.UiClientOpRegisterOnHover.prototype.getEventType = function()
{
	return oFF.UiEvent.ON_HOVER;
};
oFF.UiClientOpRegisterOnHover.prototype.executeRegisterListener = function(uiContext, listenerAggregation)
{
	return uiContext.registerOnHover(listenerAggregation);
};

oFF.UiClientOpRegisterOnHoverEnd = function() {};
oFF.UiClientOpRegisterOnHoverEnd.prototype = new oFF.UiClientOperationListener();
oFF.UiClientOpRegisterOnHoverEnd.prototype._ff_c = "UiClientOpRegisterOnHoverEnd";

oFF.UiClientOpRegisterOnHoverEnd.prototype.getEventType = function()
{
	return oFF.UiEvent.ON_HOVER_END;
};
oFF.UiClientOpRegisterOnHoverEnd.prototype.executeRegisterListener = function(uiContext, listenerAggregation)
{
	return uiContext.registerOnHoverEnd(listenerAggregation);
};

oFF.UiClientOpRegisterOnItemClose = function() {};
oFF.UiClientOpRegisterOnItemClose.prototype = new oFF.UiClientOperationListener();
oFF.UiClientOpRegisterOnItemClose.prototype._ff_c = "UiClientOpRegisterOnItemClose";

oFF.UiClientOpRegisterOnItemClose.prototype.getEventType = function()
{
	return oFF.UiEvent.ON_ITEM_CLOSE;
};
oFF.UiClientOpRegisterOnItemClose.prototype.executeRegisterListener = function(uiContext, listenerAggregation)
{
	return uiContext.registerOnItemClose(listenerAggregation);
};

oFF.UiClientOpRegisterOnItemSelect = function() {};
oFF.UiClientOpRegisterOnItemSelect.prototype = new oFF.UiClientOperationListener();
oFF.UiClientOpRegisterOnItemSelect.prototype._ff_c = "UiClientOpRegisterOnItemSelect";

oFF.UiClientOpRegisterOnItemSelect.prototype.getEventType = function()
{
	return oFF.UiEvent.ON_ITEM_SELECT;
};
oFF.UiClientOpRegisterOnItemSelect.prototype.executeRegisterListener = function(uiContext, listenerAggregation)
{
	return uiContext.registerOnItemSelect(listenerAggregation);
};

oFF.UiClientOpRegisterOnLiveChange = function() {};
oFF.UiClientOpRegisterOnLiveChange.prototype = new oFF.UiClientOperationListener();
oFF.UiClientOpRegisterOnLiveChange.prototype._ff_c = "UiClientOpRegisterOnLiveChange";

oFF.UiClientOpRegisterOnLiveChange.prototype.getEventType = function()
{
	return oFF.UiEvent.ON_LIVE_CHANGE;
};
oFF.UiClientOpRegisterOnLiveChange.prototype.executeRegisterListener = function(uiContext, listenerAggregation)
{
	return uiContext.registerOnLiveChange(listenerAggregation);
};

oFF.UiClientOpRegisterOnLoadFinished = function() {};
oFF.UiClientOpRegisterOnLoadFinished.prototype = new oFF.UiClientOperationListener();
oFF.UiClientOpRegisterOnLoadFinished.prototype._ff_c = "UiClientOpRegisterOnLoadFinished";

oFF.UiClientOpRegisterOnLoadFinished.prototype.getEventType = function()
{
	return oFF.UiEvent.ON_LOAD_FINISHED;
};
oFF.UiClientOpRegisterOnLoadFinished.prototype.executeRegisterListener = function(uiContext, listenerAggregation)
{
	return uiContext.registerOnLoadFinished(listenerAggregation);
};

oFF.UiClientOpRegisterOnMove = function() {};
oFF.UiClientOpRegisterOnMove.prototype = new oFF.UiClientOperationListener();
oFF.UiClientOpRegisterOnMove.prototype._ff_c = "UiClientOpRegisterOnMove";

oFF.UiClientOpRegisterOnMove.prototype.getEventType = function()
{
	return oFF.UiEvent.ON_MOVE;
};
oFF.UiClientOpRegisterOnMove.prototype.executeRegisterListener = function(uiContext, listenerAggregation)
{
	return uiContext.registerOnMove(listenerAggregation);
};

oFF.UiClientOpRegisterOnMoveEnd = function() {};
oFF.UiClientOpRegisterOnMoveEnd.prototype = new oFF.UiClientOperationListener();
oFF.UiClientOpRegisterOnMoveEnd.prototype._ff_c = "UiClientOpRegisterOnMoveEnd";

oFF.UiClientOpRegisterOnMoveEnd.prototype.getEventType = function()
{
	return oFF.UiEvent.ON_MOVE_END;
};
oFF.UiClientOpRegisterOnMoveEnd.prototype.executeRegisterListener = function(uiContext, listenerAggregation)
{
	return uiContext.registerOnMoveEnd(listenerAggregation);
};

oFF.UiClientOpRegisterOnMoveStart = function() {};
oFF.UiClientOpRegisterOnMoveStart.prototype = new oFF.UiClientOperationListener();
oFF.UiClientOpRegisterOnMoveStart.prototype._ff_c = "UiClientOpRegisterOnMoveStart";

oFF.UiClientOpRegisterOnMoveStart.prototype.getEventType = function()
{
	return oFF.UiEvent.ON_MOVE_START;
};
oFF.UiClientOpRegisterOnMoveStart.prototype.executeRegisterListener = function(uiContext, listenerAggregation)
{
	return uiContext.registerOnMoveStart(listenerAggregation);
};

oFF.UiClientOpRegisterOnOpen = function() {};
oFF.UiClientOpRegisterOnOpen.prototype = new oFF.UiClientOperationListener();
oFF.UiClientOpRegisterOnOpen.prototype._ff_c = "UiClientOpRegisterOnOpen";

oFF.UiClientOpRegisterOnOpen.prototype.getEventType = function()
{
	return oFF.UiEvent.ON_OPEN;
};
oFF.UiClientOpRegisterOnOpen.prototype.executeRegisterListener = function(uiContext, listenerAggregation)
{
	return uiContext.registerOnOpen(listenerAggregation);
};

oFF.UiClientOpRegisterOnPaste = function() {};
oFF.UiClientOpRegisterOnPaste.prototype = new oFF.UiClientOperationListener();
oFF.UiClientOpRegisterOnPaste.prototype._ff_c = "UiClientOpRegisterOnPaste";

oFF.UiClientOpRegisterOnPaste.prototype.getEventType = function()
{
	return oFF.UiEvent.ON_PASTE;
};
oFF.UiClientOpRegisterOnPaste.prototype.executeRegisterListener = function(uiContext, listenerAggregation)
{
	return uiContext.registerOnPaste(listenerAggregation);
};

oFF.UiClientOpRegisterOnPress = function() {};
oFF.UiClientOpRegisterOnPress.prototype = new oFF.UiClientOperationListener();
oFF.UiClientOpRegisterOnPress.prototype._ff_c = "UiClientOpRegisterOnPress";

oFF.UiClientOpRegisterOnPress.prototype.getEventType = function()
{
	return oFF.UiEvent.ON_PRESS;
};
oFF.UiClientOpRegisterOnPress.prototype.executeRegisterListener = function(uiContext, listenerAggregation)
{
	return uiContext.registerOnPress(listenerAggregation);
};

oFF.UiClientOpRegisterOnReadLineFinished = function() {};
oFF.UiClientOpRegisterOnReadLineFinished.prototype = new oFF.UiClientOperationListener();
oFF.UiClientOpRegisterOnReadLineFinished.prototype._ff_c = "UiClientOpRegisterOnReadLineFinished";

oFF.UiClientOpRegisterOnReadLineFinished.prototype.getEventType = function()
{
	return oFF.UiEvent.ON_READ_LINE_FINISHED;
};
oFF.UiClientOpRegisterOnReadLineFinished.prototype.executeRegisterListener = function(uiContext, listenerAggregation)
{
	return uiContext.registerOnReadLineFinished(listenerAggregation);
};

oFF.UiClientOpRegisterOnRefresh = function() {};
oFF.UiClientOpRegisterOnRefresh.prototype = new oFF.UiClientOperationListener();
oFF.UiClientOpRegisterOnRefresh.prototype._ff_c = "UiClientOpRegisterOnRefresh";

oFF.UiClientOpRegisterOnRefresh.prototype.getEventType = function()
{
	return oFF.UiEvent.ON_REFRESH;
};
oFF.UiClientOpRegisterOnRefresh.prototype.executeRegisterListener = function(uiContext, listenerAggregation)
{
	return uiContext.registerOnRefresh(listenerAggregation);
};

oFF.UiClientOpRegisterOnResize = function() {};
oFF.UiClientOpRegisterOnResize.prototype = new oFF.UiClientOperationListener();
oFF.UiClientOpRegisterOnResize.prototype._ff_c = "UiClientOpRegisterOnResize";

oFF.UiClientOpRegisterOnResize.prototype.getEventType = function()
{
	return oFF.UiEvent.ON_RESIZE;
};
oFF.UiClientOpRegisterOnResize.prototype.executeRegisterListener = function(uiContext, listenerAggregation)
{
	return uiContext.registerOnResize(listenerAggregation);
};

oFF.UiClientOpRegisterOnScroll = function() {};
oFF.UiClientOpRegisterOnScroll.prototype = new oFF.UiClientOperationListener();
oFF.UiClientOpRegisterOnScroll.prototype._ff_c = "UiClientOpRegisterOnScroll";

oFF.UiClientOpRegisterOnScroll.prototype.getEventType = function()
{
	return oFF.UiEvent.ON_SCROLL;
};
oFF.UiClientOpRegisterOnScroll.prototype.executeRegisterListener = function(uiContext, listenerAggregation)
{
	return uiContext.registerOnScroll(listenerAggregation);
};

oFF.UiClientOpRegisterOnScrollLoad = function() {};
oFF.UiClientOpRegisterOnScrollLoad.prototype = new oFF.UiClientOperationListener();
oFF.UiClientOpRegisterOnScrollLoad.prototype._ff_c = "UiClientOpRegisterOnScrollLoad";

oFF.UiClientOpRegisterOnScrollLoad.prototype.getEventType = function()
{
	return oFF.UiEvent.ON_SCROLL_LOAD;
};
oFF.UiClientOpRegisterOnScrollLoad.prototype.executeRegisterListener = function(uiContext, listenerAggregation)
{
	return uiContext.registerOnScrollLoad(listenerAggregation);
};

oFF.UiClientOpRegisterOnSearch = function() {};
oFF.UiClientOpRegisterOnSearch.prototype = new oFF.UiClientOperationListener();
oFF.UiClientOpRegisterOnSearch.prototype._ff_c = "UiClientOpRegisterOnSearch";

oFF.UiClientOpRegisterOnSearch.prototype.getEventType = function()
{
	return oFF.UiEvent.ON_SEARCH;
};
oFF.UiClientOpRegisterOnSearch.prototype.executeRegisterListener = function(uiContext, listenerAggregation)
{
	return uiContext.registerOnSearch(listenerAggregation);
};

oFF.UiClientOpRegisterOnSelect = function() {};
oFF.UiClientOpRegisterOnSelect.prototype = new oFF.UiClientOperationListener();
oFF.UiClientOpRegisterOnSelect.prototype._ff_c = "UiClientOpRegisterOnSelect";

oFF.UiClientOpRegisterOnSelect.prototype.getEventType = function()
{
	return oFF.UiEvent.ON_SELECT;
};
oFF.UiClientOpRegisterOnSelect.prototype.executeRegisterListener = function(uiContext, listenerAggregation)
{
	return uiContext.registerOnSelect(listenerAggregation);
};

oFF.UiClientOpRegisterOnSelectionChange = function() {};
oFF.UiClientOpRegisterOnSelectionChange.prototype = new oFF.UiClientOperationListener();
oFF.UiClientOpRegisterOnSelectionChange.prototype._ff_c = "UiClientOpRegisterOnSelectionChange";

oFF.UiClientOpRegisterOnSelectionChange.prototype.getEventType = function()
{
	return oFF.UiEvent.ON_SELECTION_CHANGE;
};
oFF.UiClientOpRegisterOnSelectionChange.prototype.executeRegisterListener = function(uiContext, listenerAggregation)
{
	return uiContext.registerOnSelectionChange(listenerAggregation);
};

oFF.UiClientOpRegisterOnSelectionFinish = function() {};
oFF.UiClientOpRegisterOnSelectionFinish.prototype = new oFF.UiClientOperationListener();
oFF.UiClientOpRegisterOnSelectionFinish.prototype._ff_c = "UiClientOpRegisterOnSelectionFinish";

oFF.UiClientOpRegisterOnSelectionFinish.prototype.getEventType = function()
{
	return oFF.UiEvent.ON_SELECTION_FINISH;
};
oFF.UiClientOpRegisterOnSelectionFinish.prototype.executeRegisterListener = function(uiContext, listenerAggregation)
{
	return uiContext.registerOnSelectionFinish(listenerAggregation);
};

oFF.UiClientOpRegisterOnSuggestionSelect = function() {};
oFF.UiClientOpRegisterOnSuggestionSelect.prototype = new oFF.UiClientOperationListener();
oFF.UiClientOpRegisterOnSuggestionSelect.prototype._ff_c = "UiClientOpRegisterOnSuggestionSelect";

oFF.UiClientOpRegisterOnSuggestionSelect.prototype.getEventType = function()
{
	return oFF.UiEvent.ON_SUGGESTION_SELECT;
};
oFF.UiClientOpRegisterOnSuggestionSelect.prototype.executeRegisterListener = function(uiContext, listenerAggregation)
{
	return uiContext.registerOnSuggestionSelect(listenerAggregation);
};

oFF.UiClientOpRegisterOnTableDragAndDrop = function() {};
oFF.UiClientOpRegisterOnTableDragAndDrop.prototype = new oFF.UiClientOperationListener();
oFF.UiClientOpRegisterOnTableDragAndDrop.prototype._ff_c = "UiClientOpRegisterOnTableDragAndDrop";

oFF.UiClientOpRegisterOnTableDragAndDrop.prototype.getEventType = function()
{
	return oFF.UiEvent.ON_TABLE_DRAG_AND_DROP;
};
oFF.UiClientOpRegisterOnTableDragAndDrop.prototype.executeRegisterListener = function(uiContext, listenerAggregation)
{
	return uiContext.registerOnTableDragAndDrop(listenerAggregation);
};

oFF.UiClientOpRegisterOnTerminate = function() {};
oFF.UiClientOpRegisterOnTerminate.prototype = new oFF.UiClientOperationListener();
oFF.UiClientOpRegisterOnTerminate.prototype._ff_c = "UiClientOpRegisterOnTerminate";

oFF.UiClientOpRegisterOnTerminate.prototype.getEventType = function()
{
	return oFF.UiEvent.ON_TERMINATE;
};
oFF.UiClientOpRegisterOnTerminate.prototype.executeRegisterListener = function(uiContext, listenerAggregation)
{
	return uiContext.registerOnTerminate(listenerAggregation);
};

oFF.UiMessageUtils = function() {};
oFF.UiMessageUtils.prototype = new oFF.XObjectExt();
oFF.UiMessageUtils.prototype._ff_c = "UiMessageUtils";

oFF.UiMessageUtils.showErrorWithMessage = function(genesis, message)
{
	oFF.UiMessageUtils.showFullscreenMessageInternal(genesis, message, null, oFF.UiCssLength.create("15px"), oFF.UiColor.ERROR.newDarkerColor(0.2), oFF.UiColor.ERROR.newBrighterColor(0.7));
};
oFF.UiMessageUtils.showWarningWithMessage = function(genesis, message)
{
	oFF.UiMessageUtils.showFullscreenMessageInternal(genesis, message, null, oFF.UiCssLength.create("15px"), oFF.UiColor.WARNING.newDarkerColor(0.3), oFF.UiColor.WARNING.newBrighterColor(0.75));
};
oFF.UiMessageUtils.showInfoWithMessage = function(genesis, message)
{
	oFF.UiMessageUtils.showFullscreenMessageInternal(genesis, message, null, oFF.UiCssLength.create("15px"), oFF.UiColor.INFO.newDarkerColor(0.3), oFF.UiColor.INFO.newBrighterColor(0.65));
};
oFF.UiMessageUtils.showErrorToast = function(genesis, message)
{
	oFF.UiMessageUtils.showToastInternal(genesis, message, oFF.UiMessageType.ERROR);
};
oFF.UiMessageUtils.showSuccessToast = function(genesis, message)
{
	oFF.UiMessageUtils.showToastInternal(genesis, message, oFF.UiMessageType.SUCCESS);
};
oFF.UiMessageUtils.showWarningToast = function(genesis, message)
{
	oFF.UiMessageUtils.showToastInternal(genesis, message, oFF.UiMessageType.WARNING);
};
oFF.UiMessageUtils.showInfoToast = function(genesis, message)
{
	oFF.UiMessageUtils.showToastInternal(genesis, message, oFF.UiMessageType.INFORMATION);
};
oFF.UiMessageUtils.showAlert = function(genesis, title, message)
{
	if (oFF.notNull(genesis))
	{
		var tmpAlert = genesis.newControl(oFF.UiType.ALERT);
		tmpAlert.setTitle(title);
		tmpAlert.setText(message);
		tmpAlert.open();
	}
};
oFF.UiMessageUtils.showFullscreenMessageInternal = function(genesis, message, description, fontSize, textCol, bgColor)
{
	if (oFF.notNull(genesis))
	{
		var mainLayout = genesis.newControl(oFF.UiType.FLEX_LAYOUT);
		mainLayout.useMaxSpace();
		mainLayout.setDirection(oFF.UiFlexDirection.COLUMN);
		mainLayout.setAlignItems(oFF.UiFlexAlignItems.CENTER);
		mainLayout.setJustifyContent(oFF.UiFlexJustifyContent.CENTER);
		var msgLabel = mainLayout.addNewItemOfType(oFF.UiType.LABEL);
		msgLabel.setText(message);
		msgLabel.setBackgroundColor(bgColor);
		msgLabel.setFontColor(textCol);
		msgLabel.setFontSize(fontSize);
		msgLabel.setPadding(oFF.UiCssBoxEdges.createExt(fontSize, fontSize, fontSize, fontSize));
		msgLabel.setBorderStyle(oFF.UiBorderStyle.SOLID);
		msgLabel.setBorderWidth(oFF.UiCssBoxEdges.create("1px"));
		msgLabel.setBorderColor(textCol);
		msgLabel.setWrapping(true);
		if (oFF.XStringUtils.isNotNullAndNotEmpty(description))
		{
			var descFontSize = oFF.UiCssLength.createExt(fontSize.getValue() - 2, fontSize.getUnit());
			var descriptionLabel = mainLayout.addNewItemOfType(oFF.UiType.LABEL);
			descriptionLabel.setText(description);
			descriptionLabel.setBackgroundColor(bgColor);
			descriptionLabel.setFontColor(textCol);
			descriptionLabel.setFontSize(descFontSize);
			descriptionLabel.setPadding(oFF.UiCssBoxEdges.createExt(descFontSize, descFontSize, fontSize, descFontSize));
			descriptionLabel.setMargin(oFF.UiCssBoxEdges.create("5px"));
			descriptionLabel.setBorderStyle(oFF.UiBorderStyle.SOLID);
			descriptionLabel.setBorderWidth(oFF.UiCssBoxEdges.create("1px"));
			descriptionLabel.setBorderColor(textCol);
			descriptionLabel.setWrapping(true);
		}
		genesis.setRoot(mainLayout);
	}
};
oFF.UiMessageUtils.showToastInternal = function(genesis, message, msgType)
{
	if (oFF.notNull(genesis))
	{
		var tmpToast = genesis.newControl(oFF.UiType.TOAST);
		tmpToast.setMessageType(msgType);
		tmpToast.setText(message);
		tmpToast.open();
	}
};

oFF.DfUiFormItem = function() {};
oFF.DfUiFormItem.prototype = new oFF.DfUiFormControl();
oFF.DfUiFormItem.prototype._ff_c = "DfUiFormItem";

oFF.DfUiFormItem.VALUE_REQUIRED_TEXT = "The value is required";
oFF.DfUiFormItem.REQUIRED_TEXT = " is required";
oFF.DfUiFormItem.prototype.m_listeners = null;
oFF.DfUiFormItem.prototype.m_key = null;
oFF.DfUiFormItem.prototype.m_value = null;
oFF.DfUiFormItem.prototype.m_text = null;
oFF.DfUiFormItem.prototype.m_isRequired = false;
oFF.DfUiFormItem.prototype.m_customRequiredText = null;
oFF.DfUiFormItem.prototype.m_customValidator = null;
oFF.DfUiFormItem.prototype.m_formItemControl = null;
oFF.DfUiFormItem.prototype.m_labelFormControl = null;
oFF.DfUiFormItem.prototype.m_isValid = false;
oFF.DfUiFormItem.prototype.setupFormItem = function(genesis, key, value, text, isRequired)
{
	this.m_listeners = oFF.XList.create();
	this.m_key = key;
	this.setValueSafe(value);
	this.m_text = text;
	this.m_isRequired = isRequired;
	this.setupFormControl(genesis);
	this.m_formItemControl = this.createFormItemUi(genesis);
	var wrapperLayout = this.getFormControl();
	wrapperLayout.setName(key);
	if (this.isSection())
	{
		wrapperLayout.insertItem(this.m_formItemControl, 0);
	}
	else
	{
		wrapperLayout.addItem(this.m_formItemControl);
	}
	if (oFF.XStringUtils.isNullOrEmpty(key))
	{
		this.setEditable(false);
	}
	this.m_isValid = true;
};
oFF.DfUiFormItem.prototype.releaseObject = function()
{
	this.m_listeners = oFF.XObjectExt.release(this.m_listeners);
	this.m_value = oFF.XObjectExt.release(this.m_value);
	this.m_formItemControl = oFF.XObjectExt.release(this.m_formItemControl);
	this.m_labelFormControl = oFF.XObjectExt.release(this.m_labelFormControl);
	this.m_customValidator = null;
	oFF.DfUiFormControl.prototype.releaseObject.call( this );
};
oFF.DfUiFormItem.prototype.createFormControlUi = function(genesis)
{
	var formItemWrapper = genesis.newControl(oFF.UiType.FLEX_LAYOUT);
	formItemWrapper.setDirection(oFF.UiFlexDirection.COLUMN);
	formItemWrapper.setFlex("auto");
	this.m_labelFormControl = oFF.UiFormLabel.create(genesis, null, this.getFormattedText(), this.getText());
	this.m_labelFormControl.getFormControl().setMargin(oFF.UiCssBoxEdges.create("0px 0px 3px 0px"));
	this.m_labelFormControl.setRequired(this.isRequired());
	this.m_labelFormControl.setVisible(oFF.XStringUtils.isNotNullAndNotEmpty(this.getText()));
	this.m_labelFormControl.setFontWeight(oFF.UiFontWeight.BOLD);
	formItemWrapper.addItem(this.m_labelFormControl.getFormControl());
	return formItemWrapper;
};
oFF.DfUiFormItem.prototype.getName = function()
{
	return this.getKey();
};
oFF.DfUiFormItem.prototype.isValid = function()
{
	return this.m_isValid;
};
oFF.DfUiFormItem.prototype.validate = function()
{
	this.refreshModelValue();
	if (!this.isRequiredValid())
	{
		this.setInvalid(this.getValueRequiredText());
		return;
	}
	else
	{
		this.setValid();
	}
	this.executeCustomValidator();
};
oFF.DfUiFormItem.prototype.getKey = function()
{
	return this.m_key;
};
oFF.DfUiFormItem.prototype.getValue = function()
{
	return this.m_value;
};
oFF.DfUiFormItem.prototype.setValue = function(value)
{
	this.setValueSafe(value);
	this.updateControlValue();
	this.validate();
	this.notifyValueChanged();
};
oFF.DfUiFormItem.prototype.getText = function()
{
	return this.m_text;
};
oFF.DfUiFormItem.prototype.setText = function(text)
{
	this.m_text = text;
	if (oFF.notNull(this.m_labelFormControl))
	{
		this.m_labelFormControl.setText(this.getFormattedText());
	}
};
oFF.DfUiFormItem.prototype.isRequired = function()
{
	return this.m_isRequired;
};
oFF.DfUiFormItem.prototype.isEmpty = function()
{
	return this.getValueType() === oFF.XValueType.STRING && oFF.XStringUtils.isNullOrEmpty(this.getModelValueAsString());
};
oFF.DfUiFormItem.prototype.setShowLabel = function(showLabel)
{
	if (oFF.notNull(this.m_labelFormControl))
	{
		this.m_labelFormControl.setVisible(showLabel);
	}
};
oFF.DfUiFormItem.prototype.focus = function()
{
	if (this.getFormItemControl() !== null)
	{
		this.getFormItemControl().focus();
	}
};
oFF.DfUiFormItem.prototype.setVisible = function(visible)
{
	if (this.getFormItemControl() !== null)
	{
		this.getFormItemControl().setVisible(visible);
	}
};
oFF.DfUiFormItem.prototype.setCustomRequiredText = function(requiredText)
{
	this.m_customRequiredText = requiredText;
};
oFF.DfUiFormItem.prototype.setCustomValidator = function(consumer)
{
	this.m_customValidator = consumer;
};
oFF.DfUiFormItem.prototype.registerOnFormItemEvents = function(listener)
{
	this.m_listeners.add(listener);
};
oFF.DfUiFormItem.prototype.unregisterOnFormItemEvents = function(listener)
{
	this.m_listeners.removeElement(listener);
};
oFF.DfUiFormItem.prototype.setInvalid = function(reason)
{
	this.m_isValid = false;
	this.setInvalidState(reason);
};
oFF.DfUiFormItem.prototype.setValid = function()
{
	this.m_isValid = true;
	this.setValidState();
};
oFF.DfUiFormItem.prototype.isRequiredValid = function()
{
	if (this.isRequired() && this.isEmpty())
	{
		return false;
	}
	return true;
};
oFF.DfUiFormItem.prototype.executeCustomValidator = function()
{
	if (oFF.notNull(this.m_customValidator))
	{
		this.m_customValidator(this);
	}
};
oFF.DfUiFormItem.prototype.getFormItemControl = function()
{
	return this.m_formItemControl;
};
oFF.DfUiFormItem.prototype.notifyValueChanged = function()
{
	if (oFF.notNull(this.m_listeners))
	{
		oFF.XCollectionUtils.forEach(this.m_listeners,  function(listener){
			listener.onFormItemValueChanged(this, this.getKey(), this.getValue());
		}.bind(this));
	}
};
oFF.DfUiFormItem.prototype.notifyEnterPressed = function()
{
	if (oFF.notNull(this.m_listeners))
	{
		oFF.XCollectionUtils.forEach(this.m_listeners,  function(listener){
			listener.onFormItemEnteredPressed(this);
		}.bind(this));
	}
};
oFF.DfUiFormItem.prototype.getValueRequiredText = function()
{
	if (oFF.XStringUtils.isNotNullAndNotEmpty(this.getCustomRequiredText()))
	{
		return this.getCustomRequiredText();
	}
	else if (oFF.XStringUtils.isNotNullAndNotEmpty(this.getText()))
	{
		return oFF.XStringUtils.concatenate2(this.getText(), oFF.DfUiFormItem.REQUIRED_TEXT);
	}
	return oFF.DfUiFormItem.VALUE_REQUIRED_TEXT;
};
oFF.DfUiFormItem.prototype.getCustomRequiredText = function()
{
	return this.m_customRequiredText;
};
oFF.DfUiFormItem.prototype.getFormLabelControl = function()
{
	return this.m_labelFormControl;
};
oFF.DfUiFormItem.prototype.getModelValueAsString = function()
{
	if (oFF.notNull(this.m_value))
	{
		return oFF.XValueUtil.getString(this.m_value);
	}
	return null;
};
oFF.DfUiFormItem.prototype.updateModelValueByString = function(newValue)
{
	if (oFF.XStringUtils.isNotNullAndNotEmpty(newValue))
	{
		if (oFF.notNull(this.m_value))
		{
			var tmpStrVal = this.m_value;
			tmpStrVal.setString(newValue);
		}
		else
		{
			this.m_value = oFF.XStringValue.create(newValue);
		}
	}
	else
	{
		this.m_value = oFF.XStringValue.create(null);
	}
};
oFF.DfUiFormItem.prototype.getModelValueAsBoolean = function()
{
	if (oFF.notNull(this.m_value))
	{
		return oFF.XValueUtil.getBoolean(this.m_value, false, true);
	}
	return false;
};
oFF.DfUiFormItem.prototype.updateModelValueByBoolean = function(newValue)
{
	if (oFF.notNull(this.m_value))
	{
		var tmpBoolVal = this.m_value;
		tmpBoolVal.setBoolean(newValue);
	}
	else
	{
		this.m_value = oFF.XBooleanValue.create(newValue);
	}
};
oFF.DfUiFormItem.prototype.isSection = function()
{
	return false;
};
oFF.DfUiFormItem.prototype.setValueSafe = function(value)
{
	if (oFF.notNull(value) && value.getValueType() !== this.getValueType())
	{
		var errMsg = oFF.XStringUtils.concatenate4("Error! Cannot set form item value! Invalid value type, expected: ", this.getValueType().getName(), " but got: ", value.getValueType().getName());
		throw oFF.XException.createRuntimeException(errMsg);
	}
	this.m_value = value;
};
oFF.DfUiFormItem.prototype.getFormattedText = function()
{
	var formattedText = this.getText();
	if (!this.isSection() && oFF.XStringUtils.isNotNullAndNotEmpty(formattedText))
	{
		formattedText = !oFF.XString.endsWith(formattedText, ":") && !oFF.XString.endsWith(formattedText, "?") ? oFF.XStringUtils.concatenate2(formattedText, ":") : formattedText;
	}
	return formattedText;
};

oFF.UiForm = function() {};
oFF.UiForm.prototype = new oFF.XObject();
oFF.UiForm.prototype._ff_c = "UiForm";

oFF.UiForm.create = function(genesis, listener)
{
	var form = new oFF.UiForm();
	form.setupform(genesis, listener);
	return form;
};
oFF.UiForm.prototype.m_genesis = null;
oFF.UiForm.prototype.m_listener = null;
oFF.UiForm.prototype.m_formLayout = null;
oFF.UiForm.prototype.m_dataModel = null;
oFF.UiForm.prototype.m_formItemMap = null;
oFF.UiForm.prototype.m_lastFormControl = null;
oFF.UiForm.prototype.m_isHorizontal = false;
oFF.UiForm.prototype.releaseObject = function()
{
	this.m_genesis = null;
	this.m_listener = null;
	this.m_lastFormControl = null;
	this.m_dataModel = oFF.XObjectExt.release(this.m_dataModel);
	this.m_formItemMap = oFF.XObjectExt.release(this.m_formItemMap);
	this.m_formLayout = oFF.XObjectExt.release(this.m_formLayout);
	oFF.XObject.prototype.releaseObject.call( this );
};
oFF.UiForm.prototype.setupform = function(genesis, listener)
{
	this.m_genesis = genesis;
	this.m_listener = listener;
	this.m_dataModel = oFF.PrStructure.create();
	this.m_formItemMap = oFF.XLinkedHashMapByString.create();
	this.m_isHorizontal = false;
	this.m_formLayout = this.createFormWrapper(genesis);
};
oFF.UiForm.prototype.createFormWrapper = function(genesis)
{
	var layout = genesis.newControl(oFF.UiType.FLEX_LAYOUT);
	layout.useMaxSpace();
	layout.setDirection(oFF.UiFlexDirection.COLUMN);
	layout.setWrap(oFF.UiFlexWrap.NO_WRAP);
	layout.setAlignItems(oFF.UiFlexAlignItems.STRETCH);
	return layout;
};
oFF.UiForm.prototype.isValid = function()
{
	var isValid = true;
	var formItemIterator = this.m_formItemMap.getIterator();
	while (formItemIterator.hasNext())
	{
		var formItem = formItemIterator.next();
		isValid = formItem.isValid();
		if (!isValid)
		{
			break;
		}
	}
	return isValid;
};
oFF.UiForm.prototype.validate = function()
{
	var formItemIterator = this.m_formItemMap.getIterator();
	while (formItemIterator.hasNext())
	{
		var formItem = formItemIterator.next();
		formItem.validate();
	}
};
oFF.UiForm.prototype.getJsonModel = function()
{
	this.updateModel();
	return this.m_dataModel;
};
oFF.UiForm.prototype.getFormWrapper = function()
{
	return this.m_formLayout;
};
oFF.UiForm.prototype.submit = function(afterSubmitConsumer)
{
	this.validate();
	if (this.isValid() && oFF.notNull(afterSubmitConsumer))
	{
		afterSubmitConsumer(this.getJsonModel());
	}
};
oFF.UiForm.prototype.getAllFormItems = function()
{
	return this.m_formItemMap.getValuesAsReadOnlyList();
};
oFF.UiForm.prototype.getFormItemByKey = function(key)
{
	return this.m_formItemMap.getByKey(key);
};
oFF.UiForm.prototype.removeFormItemByKey = function(key)
{
	this.m_dataModel.remove(key);
	var formItem = this.m_formItemMap.remove(key);
	if (oFF.notNull(formItem))
	{
		var tmpFormControl = formItem;
		this.m_formLayout.removeItem(tmpFormControl.getFormControl());
		formItem.unregisterOnFormItemEvents(this);
	}
	return formItem;
};
oFF.UiForm.prototype.hasFormItems = function()
{
	return this.m_formItemMap.hasElements();
};
oFF.UiForm.prototype.clearFormItems = function()
{
	var keysIterator = this.m_formItemMap.getKeysAsIteratorOfString();
	while (keysIterator.hasNext())
	{
		var tmpKey = keysIterator.next();
		this.removeFormItemByKey(tmpKey);
	}
};
oFF.UiForm.prototype.addInput = function(key, value, text, isRequired, placeholder, inputType)
{
	var inputFormItem = oFF.UiFormItemInput.create(this.m_genesis, key, oFF.XStringValue.create(value), text, isRequired, placeholder, inputType);
	this.addFormItem(inputFormItem);
	return inputFormItem;
};
oFF.UiForm.prototype.addSwitch = function(key, value, text)
{
	var switchFormItem = oFF.UiFormItemSwitch.create(this.m_genesis, key, oFF.XBooleanValue.create(value), text);
	this.addFormItem(switchFormItem);
	return switchFormItem;
};
oFF.UiForm.prototype.addDropdown = function(key, value, text, isRequired, dropdownItems, addEmptyItem)
{
	var dropdownFormItem = oFF.UiFormItemDropdown.create(this.m_genesis, key, oFF.XStringValue.create(value), text, isRequired, dropdownItems, addEmptyItem);
	this.addFormItem(dropdownFormItem);
	return dropdownFormItem;
};
oFF.UiForm.prototype.addFormSection = function(key, text, isHorizontal)
{
	var formSection = oFF.UiFormSection.create(this.m_genesis, key, text, isHorizontal);
	this.addFormItem(formSection);
	return formSection;
};
oFF.UiForm.prototype.addFormButton = function(name, text, tooltip, icon, pressProcedure)
{
	var formButton = oFF.UiFormButton.create(this.m_genesis, name, text, tooltip, icon, pressProcedure);
	this.addFormControl(formButton);
	return formButton;
};
oFF.UiForm.prototype.addFormLabel = function(name, text, tooltip)
{
	var formLabel = oFF.UiFormLabel.create(this.m_genesis, name, text, tooltip);
	this.addFormControl(formLabel);
	return formLabel;
};
oFF.UiForm.prototype.addFormControl = function(formControl)
{
	if (oFF.notNull(formControl))
	{
		this.adjustPreviousFormItemSpacing();
		var tmpFormControl = formControl;
		var formControlControl = tmpFormControl.getFormControl();
		this.m_formLayout.addItem(formControlControl);
		this.m_lastFormControl = formControl;
	}
};
oFF.UiForm.prototype.addFormItem = function(formItem)
{
	if (oFF.notNull(formItem))
	{
		this.addFormControl(formItem);
		var key = formItem.getKey();
		if (oFF.XStringUtils.isNotNullAndNotEmpty(key) && !this.m_formItemMap.containsKey(key))
		{
			this.m_formItemMap.put(key, formItem);
			this.updateModelValue(key, formItem.getValue());
			formItem.registerOnFormItemEvents(this);
		}
	}
};
oFF.UiForm.prototype.setHorizontal = function(isHorizontal)
{
	this.m_isHorizontal = isHorizontal;
	if (isHorizontal)
	{
		this.m_formLayout.setDirection(oFF.UiFlexDirection.ROW);
		this.m_formLayout.setWrap(oFF.UiFlexWrap.WRAP);
		this.m_formLayout.setAlignItems(oFF.UiFlexAlignItems.END);
		this.m_formLayout.setSize(oFF.UiSize.createByCss("100%", "auto"));
	}
	else
	{
		this.m_formLayout.setDirection(oFF.UiFlexDirection.COLUMN);
		this.m_formLayout.setWrap(oFF.UiFlexWrap.NO_WRAP);
		this.m_formLayout.setAlignItems(oFF.UiFlexAlignItems.STRETCH);
		this.m_formLayout.useMaxSpace();
	}
};
oFF.UiForm.prototype.adjustPreviousFormItemSpacing = function()
{
	if (oFF.notNull(this.m_lastFormControl))
	{
		var lastFormControl = this.m_lastFormControl;
		lastFormControl.setSpacing(this.m_isHorizontal);
	}
};
oFF.UiForm.prototype.updateModel = function()
{
	var keyIterator = this.m_formItemMap.getKeysAsIteratorOfString();
	while (keyIterator.hasNext())
	{
		var key = keyIterator.next();
		var formItem = this.m_formItemMap.getByKey(key);
		this.updateModelValue(key, formItem.getValue());
	}
};
oFF.UiForm.prototype.updateModelValue = function(key, value)
{
	if (oFF.XStringUtils.isNotNullAndNotEmpty(key))
	{
		if (oFF.notNull(value))
		{
			var valueType = value.getValueType();
			if (valueType === oFF.XValueType.STRING)
			{
				var strVal = value;
				this.m_dataModel.putString(key, strVal.getString());
			}
			else if (valueType === oFF.XValueType.BOOLEAN)
			{
				var boolVal = value;
				this.m_dataModel.putBoolean(key, boolVal.getBoolean());
			}
			else if (valueType === oFF.XValueType.STRUCTURE)
			{
				var structValue = value;
				this.m_dataModel.put(key, structValue);
			}
		}
		else
		{
			this.m_dataModel.putNull(key);
		}
	}
};
oFF.UiForm.prototype.onFormItemValueChanged = function(item, key, newValue)
{
	this.updateModelValue(key, newValue);
	if (oFF.notNull(this.m_listener))
	{
		this.m_listener.onFormModelChanged(this, this.m_dataModel);
	}
};
oFF.UiForm.prototype.onFormItemEnteredPressed = function(formItem)
{
	if (oFF.notNull(this.m_listener))
	{
		this.m_listener.onFormEnteredPressed(this);
	}
};

oFF.UiFormButton = function() {};
oFF.UiFormButton.prototype = new oFF.DfUiFormControl();
oFF.UiFormButton.prototype._ff_c = "UiFormButton";

oFF.UiFormButton.create = function(genesis, name, text, tooltip, icon, pressProcedure)
{
	var newFormItem = new oFF.UiFormButton();
	newFormItem.setupFormButton(genesis, name, text, tooltip, icon, pressProcedure);
	return newFormItem;
};
oFF.UiFormButton.prototype.m_name = null;
oFF.UiFormButton.prototype.m_text = null;
oFF.UiFormButton.prototype.m_tooltip = null;
oFF.UiFormButton.prototype.m_icon = null;
oFF.UiFormButton.prototype.m_pressProcedure = null;
oFF.UiFormButton.prototype.setupFormButton = function(genesis, name, text, tooltip, icon, pressProcedure)
{
	this.m_name = name;
	this.m_text = text;
	this.m_tooltip = tooltip;
	this.m_icon = icon;
	this.m_pressProcedure = pressProcedure;
	this.setupFormControl(genesis);
};
oFF.UiFormButton.prototype.releaseObject = function()
{
	this.m_pressProcedure = null;
	oFF.DfUiFormControl.prototype.releaseObject.call( this );
};
oFF.UiFormButton.prototype.createFormControlUi = function(genesis)
{
	var newBtn = genesis.newControl(oFF.UiType.BUTTON);
	newBtn.setName(this.m_name);
	newBtn.setText(this.m_text);
	newBtn.setTooltip(this.m_tooltip);
	newBtn.setIcon(this.m_icon);
	newBtn.setFlex("none");
	newBtn.registerOnPress(this);
	return newBtn;
};
oFF.UiFormButton.prototype.getName = function()
{
	return this.m_name;
};
oFF.UiFormButton.prototype.setButtonType = function(buttonType)
{
	this.getButtonControl().setButtonType(buttonType);
	return this;
};
oFF.UiFormButton.prototype.getButtonControl = function()
{
	return this.getFormControl();
};
oFF.UiFormButton.prototype.onPress = function(event)
{
	if (oFF.notNull(this.m_pressProcedure))
	{
		this.m_pressProcedure();
	}
};

oFF.UiFormLabel = function() {};
oFF.UiFormLabel.prototype = new oFF.DfUiFormControl();
oFF.UiFormLabel.prototype._ff_c = "UiFormLabel";

oFF.UiFormLabel.create = function(genesis, name, text, tooltip)
{
	var newFormItem = new oFF.UiFormLabel();
	newFormItem.setupFormLabel(genesis, name, text, tooltip);
	return newFormItem;
};
oFF.UiFormLabel.prototype.m_name = null;
oFF.UiFormLabel.prototype.m_text = null;
oFF.UiFormLabel.prototype.m_tooltip = null;
oFF.UiFormLabel.prototype.setupFormLabel = function(genesis, name, text, tooltip)
{
	this.m_name = name;
	this.m_text = text;
	this.m_tooltip = tooltip;
	this.setupFormControl(genesis);
};
oFF.UiFormLabel.prototype.releaseObject = function()
{
	oFF.DfUiFormControl.prototype.releaseObject.call( this );
};
oFF.UiFormLabel.prototype.createFormControlUi = function(genesis)
{
	var newLbl = genesis.newControl(oFF.UiType.LABEL);
	newLbl.setName(this.m_name);
	newLbl.setText(this.m_text);
	newLbl.setTooltip(this.m_tooltip);
	newLbl.setFlex("auto");
	newLbl.setFontWeight(oFF.UiFontWeight.BOLD);
	return newLbl;
};
oFF.UiFormLabel.prototype.getName = function()
{
	return this.m_name;
};
oFF.UiFormLabel.prototype.setText = function(text)
{
	this.getLabelControl().setText(text);
	return this;
};
oFF.UiFormLabel.prototype.setTooltip = function(tooltip)
{
	this.getLabelControl().setTooltip(tooltip);
	return this;
};
oFF.UiFormLabel.prototype.setVisible = function(isVisible)
{
	this.getLabelControl().setVisible(isVisible);
	return this;
};
oFF.UiFormLabel.prototype.setRequired = function(isRequired)
{
	this.getLabelControl().setRequired(isRequired);
	return this;
};
oFF.UiFormLabel.prototype.setFontWeight = function(fontWeight)
{
	this.getLabelControl().setFontWeight(fontWeight);
	return this;
};
oFF.UiFormLabel.prototype.setTextDecoration = function(textDecoration)
{
	this.getLabelControl().setTextDecoration(textDecoration);
	return this;
};
oFF.UiFormLabel.prototype.setTextAlign = function(textAlign)
{
	this.getLabelControl().setTextAlign(textAlign);
	return this;
};
oFF.UiFormLabel.prototype.getLabelControl = function()
{
	return this.getFormControl();
};

oFF.DfUiPopup = function() {};
oFF.DfUiPopup.prototype = new oFF.XObject();
oFF.DfUiPopup.prototype._ff_c = "DfUiPopup";

oFF.DfUiPopup.prototype.m_genesis = null;
oFF.DfUiPopup.prototype.m_dialog = null;
oFF.DfUiPopup.prototype.m_customObject = null;
oFF.DfUiPopup.prototype.setupPopup = function(genesis)
{
	if (oFF.isNull(genesis))
	{
		throw oFF.XException.createRuntimeException("Cannot create a popup. Please sepcify a genesis object!");
	}
	this.createDialog(genesis);
	if (oFF.notNull(this.m_dialog))
	{
		this.configurePopup(this.m_dialog);
		var innerGenesis = oFF.UiGenesis.create(this.m_dialog, oFF.UiItemPosition.CONTENT, oFF.UiOperation.SET, 0, 0);
		this.m_genesis = innerGenesis;
		this.buildPopupContent(innerGenesis);
	}
};
oFF.DfUiPopup.prototype.releaseObject = function()
{
	this.m_dialog = oFF.XObjectExt.release(this.m_dialog);
	this.m_genesis = oFF.XObjectExt.release(this.m_genesis);
	this.m_customObject = null;
	oFF.XObject.prototype.releaseObject.call( this );
};
oFF.DfUiPopup.prototype.getCustomObject2 = function()
{
	return this.m_customObject;
};
oFF.DfUiPopup.prototype.setCustomObject2 = function(customObject)
{
	this.m_customObject = customObject;
};
oFF.DfUiPopup.prototype.open = function()
{
	if (oFF.notNull(this.m_dialog))
	{
		this.m_dialog.open();
	}
};
oFF.DfUiPopup.prototype.close = function()
{
	if (oFF.notNull(this.m_dialog))
	{
		this.m_dialog.close();
	}
};
oFF.DfUiPopup.prototype.shake = function()
{
	if (oFF.notNull(this.m_dialog))
	{
		this.m_dialog.shake();
	}
};
oFF.DfUiPopup.prototype.setBusy = function(busy)
{
	if (oFF.notNull(this.m_dialog))
	{
		this.m_dialog.setBusy(busy);
	}
};
oFF.DfUiPopup.prototype.getGenesis = function()
{
	return this.m_genesis;
};
oFF.DfUiPopup.prototype.getDialog = function()
{
	return this.m_dialog;
};
oFF.DfUiPopup.prototype.setContent = function(content)
{
	if (oFF.notNull(this.m_dialog))
	{
		this.m_dialog.setContent(content);
	}
};
oFF.DfUiPopup.prototype.getContent = function()
{
	if (oFF.notNull(this.m_dialog))
	{
		return this.m_dialog.getContent();
	}
	return oFF.UiContextDummy.getSingleton().getContent();
};
oFF.DfUiPopup.prototype.addButton = function(name, btnType, text, icon, listner)
{
	if (oFF.notNull(this.m_dialog))
	{
		var tmpDialogBtn = this.m_dialog.addNewDialogButton();
		tmpDialogBtn.setName(name);
		tmpDialogBtn.setButtonType(oFF.notNull(btnType) ? btnType : oFF.UiButtonType.DEFAULT);
		tmpDialogBtn.setMinWidth(oFF.UiTheme.getCurrentTheme().getDialogBtnMinWidth());
		tmpDialogBtn.setText(text);
		tmpDialogBtn.setIcon(icon);
		tmpDialogBtn.registerOnPress(listner);
		return tmpDialogBtn;
	}
	return oFF.UiContextDummy.getSingleton().getContent();
};
oFF.DfUiPopup.prototype.createDialog = function(genesis)
{
	if (oFF.notNull(genesis))
	{
		this.m_dialog = genesis.newControl(oFF.UiType.DIALOG);
		this.m_dialog.setPadding(oFF.UiCssBoxEdges.create("20px"));
		this.m_dialog.registerOnAfterOpen(this);
		this.m_dialog.registerOnAfterClose(this);
	}
};

oFF.UiAnchorContainer = function() {};
oFF.UiAnchorContainer.prototype = new oFF.DfNameObject();
oFF.UiAnchorContainer.prototype._ff_c = "UiAnchorContainer";

oFF.UiAnchorContainer.create = function(name, nativeAnchorId, nativeAnchorObject)
{
	var newObj = new oFF.UiAnchorContainer();
	newObj.setNativeAnchor(name, nativeAnchorId, nativeAnchorObject);
	return newObj;
};
oFF.UiAnchorContainer.prototype.m_anchor = null;
oFF.UiAnchorContainer.prototype.m_nativeAnchorId = null;
oFF.UiAnchorContainer.prototype.m_nativeAnchorObject = null;
oFF.UiAnchorContainer.prototype.getAnchor = function()
{
	return this.m_anchor;
};
oFF.UiAnchorContainer.prototype.setAnchor = function(root)
{
	this.m_anchor = root;
};
oFF.UiAnchorContainer.prototype.setNativeAnchor = function(name, nativeAnchorId, nativeAnchorObject)
{
	this._setupInternal(name);
	this.m_nativeAnchorId = nativeAnchorId;
	this.m_nativeAnchorObject = nativeAnchorObject;
};
oFF.UiAnchorContainer.prototype.getNativeAnchorId = function()
{
	return this.m_nativeAnchorId;
};
oFF.UiAnchorContainer.prototype.getNativeAnchorObject = function()
{
	return this.m_nativeAnchorObject;
};
oFF.UiAnchorContainer.prototype.getNativeHookWrapperId = function()
{
	return oFF.XStringUtils.concatenate3(this.getNativeAnchorId(), "_", "root");
};
oFF.UiAnchorContainer.prototype.releaseObject = function()
{
	this.m_anchor = null;
	this.m_nativeAnchorObject = null;
	oFF.DfNameObject.prototype.releaseObject.call( this );
};

oFF.DfAppDialog = function() {};
oFF.DfAppDialog.prototype = new oFF.DfNameObject();
oFF.DfAppDialog.prototype._ff_c = "DfAppDialog";

oFF.DfAppDialog.prototype.m_uiManager = null;
oFF.DfAppDialog.prototype.setupDialog = function(uiManager, name)
{
	this._setupInternal(name);
	this.m_uiManager = uiManager;
};
oFF.DfAppDialog.prototype.getUiManager = function()
{
	return this.m_uiManager;
};

oFF.UiGenesis = function() {};
oFF.UiGenesis.prototype = new oFF.UiGenesisGeneric();
oFF.UiGenesis.prototype._ff_c = "UiGenesis";

oFF.UiGenesis.create = function(parent, position, operation, firstIndex, secondIndex)
{
	var genesis = new oFF.UiGenesis();
	genesis.m_parent = parent;
	genesis.m_position = position;
	genesis.m_operation = operation;
	genesis.m_firstIndex = firstIndex;
	genesis.m_secondIndex = secondIndex;
	return genesis;
};
oFF.UiGenesis.prototype.m_parent = null;
oFF.UiGenesis.prototype.m_position = null;
oFF.UiGenesis.prototype.m_operation = null;
oFF.UiGenesis.prototype.m_firstIndex = 0;
oFF.UiGenesis.prototype.m_secondIndex = 0;
oFF.UiGenesis.prototype.m_root = null;
oFF.UiGenesis.prototype.getComponentType = function()
{
	return null;
};
oFF.UiGenesis.prototype.newControlExt = function(uiType, styleClass, identifier, name, parent, operation, position, firstIndex, secondIndex)
{
	return this.m_parent.newControlExt(uiType, styleClass, identifier, name, parent, operation, position, firstIndex, secondIndex);
};
oFF.UiGenesis.prototype.newControl = function(uiType)
{
	return this.m_parent.newControl(uiType);
};
oFF.UiGenesis.prototype.newBasicControl = function(uiType, styleClass, identifier, name)
{
	return this.m_parent.newBasicControl(uiType, styleClass, identifier, name);
};
oFF.UiGenesis.prototype.newRoot = function(uiType)
{
	var newRoot = this.newControl(uiType);
	this.setRoot(newRoot);
	return newRoot;
};
oFF.UiGenesis.prototype.setRoot = function(newRoot)
{
	this.m_root = newRoot;
	this.clearUi();
	if (oFF.notNull(newRoot))
	{
		this.m_parent.attach(newRoot, this.m_operation, this.m_position, this.m_firstIndex, this.m_secondIndex);
	}
};
oFF.UiGenesis.prototype.getRoot = function()
{
	return this.m_root;
};
oFF.UiGenesis.prototype.getUiManager = function()
{
	return this.m_parent.getUiManager();
};
oFF.UiGenesis.prototype.getAnchor = function()
{
	return this.m_parent;
};
oFF.UiGenesis.prototype.releaseObject = function()
{
	this.clearUi();
	this.m_parent = null;
	this.m_root = null;
	this.m_position = null;
	this.m_operation = null;
	oFF.UiGenesisGeneric.prototype.releaseObject.call( this );
};
oFF.UiGenesis.prototype.clearUi = function()
{
	if (this.m_position === oFF.UiItemPosition.CONTENT && oFF.notNull(this.m_parent) && this.m_parent.isReleased() === false)
	{
		this.m_parent.clearContent();
	}
};
oFF.UiGenesis.prototype.getNativeAnchorId = function()
{
	return null;
};
oFF.UiGenesis.prototype.getNativeAnchorObject = function()
{
	return null;
};

oFF.UiContextSpaceFactory = function() {};
oFF.UiContextSpaceFactory.prototype = new oFF.XComponent();
oFF.UiContextSpaceFactory.prototype._ff_c = "UiContextSpaceFactory";

oFF.UiContextSpaceFactory.prototype.newSpacer = function(session)
{
	return oFF.UiContextSpace.create(null);
};

oFF.UiClientOperationConst = function() {};
oFF.UiClientOperationConst.prototype = new oFF.UiClientPropString();
oFF.UiClientOperationConst.prototype._ff_c = "UiClientOperationConst";

oFF.UiClientOperationConst.prototype.getComponentType = function()
{
	return oFF.UiComponentType.UI_PROPERTY_OP_CONSTANT;
};
oFF.UiClientOperationConst.prototype.getString = function(source)
{
	var constantValue = this.getConstantValue(source);
	if (oFF.isNull(constantValue))
	{
		return null;
	}
	return constantValue.getDocumentName();
};

oFF.UiClientPropAnimated = function() {};
oFF.UiClientPropAnimated.prototype = new oFF.UiClientPropBool();
oFF.UiClientPropAnimated.prototype._ff_c = "UiClientPropAnimated";

oFF.UiClientPropAnimated.prototype.setBoolValue = function(target, value)
{
	target.setAnimated(value);
};
oFF.UiClientPropAnimated.prototype.getBoolValue = function(source)
{
	return source.isAnimated();
};

oFF.UiClientPropAnimationDuration = function() {};
oFF.UiClientPropAnimationDuration.prototype = new oFF.UiClientPropInt();
oFF.UiClientPropAnimationDuration.prototype._ff_c = "UiClientPropAnimationDuration";

oFF.UiClientPropAnimationDuration.prototype.getIntValue = function(source)
{
	return source.getAnimationDuration();
};
oFF.UiClientPropAnimationDuration.prototype.setIntValue = function(target, value)
{
	target.setAnimationDuration(value);
};

oFF.UiClientPropApplyContentPadding = function() {};
oFF.UiClientPropApplyContentPadding.prototype = new oFF.UiClientPropBool();
oFF.UiClientPropApplyContentPadding.prototype._ff_c = "UiClientPropApplyContentPadding";

oFF.UiClientPropApplyContentPadding.prototype.setBoolValue = function(target, value)
{
	target.setApplyContentPadding(value);
};
oFF.UiClientPropApplyContentPadding.prototype.getBoolValue = function(source)
{
	return source.isApplyContentPadding();
};

oFF.UiClientPropBackgroundColor = function() {};
oFF.UiClientPropBackgroundColor.prototype = new oFF.UiClientPropString();
oFF.UiClientPropBackgroundColor.prototype._ff_c = "UiClientPropBackgroundColor";

oFF.UiClientPropBackgroundColor.prototype.setString = function(target, value)
{
	target.setBackgroundColor(oFF.UiColor.create(value));
};
oFF.UiClientPropBackgroundColor.prototype.getString = function(source)
{
	if (source.getBackgroundColor() !== null)
	{
		return source.getBackgroundColor().getCssValue();
	}
	return null;
};

oFF.UiClientPropBackgroundImageSrc = function() {};
oFF.UiClientPropBackgroundImageSrc.prototype = new oFF.UiClientPropString();
oFF.UiClientPropBackgroundImageSrc.prototype._ff_c = "UiClientPropBackgroundImageSrc";

oFF.UiClientPropBackgroundImageSrc.prototype.setString = function(target, value)
{
	target.setBackgroundImageSrc(value);
};
oFF.UiClientPropBackgroundImageSrc.prototype.getString = function(source)
{
	return source.getBackgroundImageSrc();
};

oFF.UiClientPropBorderColor = function() {};
oFF.UiClientPropBorderColor.prototype = new oFF.UiClientPropString();
oFF.UiClientPropBorderColor.prototype._ff_c = "UiClientPropBorderColor";

oFF.UiClientPropBorderColor.prototype.setString = function(target, value)
{
	target.setBorderColor(oFF.UiColor.create(value));
};
oFF.UiClientPropBorderColor.prototype.getString = function(source)
{
	if (source.getBorderColor() !== null)
	{
		return source.getBorderColor().getCssValue();
	}
	return null;
};

oFF.UiClientPropBorderWidth = function() {};
oFF.UiClientPropBorderWidth.prototype = new oFF.UiClientPropString();
oFF.UiClientPropBorderWidth.prototype._ff_c = "UiClientPropBorderWidth";

oFF.UiClientPropBorderWidth.prototype.getString = function(source)
{
	if (source.getBorderWidth() !== null)
	{
		return source.getBorderWidth().getCssValue();
	}
	return null;
};
oFF.UiClientPropBorderWidth.prototype.setString = function(target, value)
{
	target.setBorderWidth(oFF.UiCssBoxEdges.create(value));
};

oFF.UiClientPropBusy = function() {};
oFF.UiClientPropBusy.prototype = new oFF.UiClientPropBool();
oFF.UiClientPropBusy.prototype._ff_c = "UiClientPropBusy";

oFF.UiClientPropBusy.prototype.setBoolValue = function(target, value)
{
	target.setBusy(value);
};
oFF.UiClientPropBusy.prototype.getBoolValue = function(source)
{
	return source.isBusy();
};

oFF.UiClientPropCloseable = function() {};
oFF.UiClientPropCloseable.prototype = new oFF.UiClientPropBool();
oFF.UiClientPropCloseable.prototype._ff_c = "UiClientPropCloseable";

oFF.UiClientPropCloseable.prototype.setBoolValue = function(target, value)
{
	target.setCloseable(value);
};
oFF.UiClientPropCloseable.prototype.getBoolValue = function(source)
{
	return source.isCloseable();
};

oFF.UiClientPropCodeType = function() {};
oFF.UiClientPropCodeType.prototype = new oFF.UiClientPropString();
oFF.UiClientPropCodeType.prototype._ff_c = "UiClientPropCodeType";

oFF.UiClientPropCodeType.prototype.getString = function(source)
{
	return source.getCodeType();
};
oFF.UiClientPropCodeType.prototype.setString = function(target, value)
{
	target.setCodeType(value);
};

oFF.UiClientPropColor = function() {};
oFF.UiClientPropColor.prototype = new oFF.UiClientPropString();
oFF.UiClientPropColor.prototype._ff_c = "UiClientPropColor";

oFF.UiClientPropColor.prototype.setString = function(target, value)
{
	target.setColor(oFF.UiColor.create(value));
};
oFF.UiClientPropColor.prototype.getString = function(source)
{
	if (source.getColor() !== null)
	{
		return source.getColor().getCssValue();
	}
	return null;
};

oFF.UiClientPropColumnCount = function() {};
oFF.UiClientPropColumnCount.prototype = new oFF.UiClientPropInt();
oFF.UiClientPropColumnCount.prototype._ff_c = "UiClientPropColumnCount";

oFF.UiClientPropColumnCount.prototype.getIntValue = function(source)
{
	return source.getColumnCount();
};
oFF.UiClientPropColumnCount.prototype.setIntValue = function(target, value)
{
	target.setColumnCount(value);
};

oFF.UiClientPropColumnSpan = function() {};
oFF.UiClientPropColumnSpan.prototype = new oFF.UiClientPropInt();
oFF.UiClientPropColumnSpan.prototype._ff_c = "UiClientPropColumnSpan";

oFF.UiClientPropColumnSpan.prototype.getIntValue = function(source)
{
	return source.getColumnSpan();
};
oFF.UiClientPropColumnSpan.prototype.setIntValue = function(target, value)
{
	target.setColumnSpan(value);
};

oFF.UiClientPropCornerRadius = function() {};
oFF.UiClientPropCornerRadius.prototype = new oFF.UiClientPropString();
oFF.UiClientPropCornerRadius.prototype._ff_c = "UiClientPropCornerRadius";

oFF.UiClientPropCornerRadius.prototype.getString = function(source)
{
	if (source.getCornerRadius() !== null)
	{
		return source.getCornerRadius().getCssValue();
	}
	return null;
};
oFF.UiClientPropCornerRadius.prototype.setString = function(target, value)
{
	target.setCornerRadius(oFF.UiCssBoxEdges.create(value));
};

oFF.UiClientPropCount = function() {};
oFF.UiClientPropCount.prototype = new oFF.UiClientPropString();
oFF.UiClientPropCount.prototype._ff_c = "UiClientPropCount";

oFF.UiClientPropCount.prototype.setString = function(target, value)
{
	target.setCount(value);
};
oFF.UiClientPropCount.prototype.getString = function(source)
{
	return source.getCount();
};

oFF.UiClientPropCounter = function() {};
oFF.UiClientPropCounter.prototype = new oFF.UiClientPropInt();
oFF.UiClientPropCounter.prototype._ff_c = "UiClientPropCounter";

oFF.UiClientPropCounter.prototype.getIntValue = function(source)
{
	return source.getCounter();
};
oFF.UiClientPropCounter.prototype.setIntValue = function(target, value)
{
	target.setCounter(value);
};

oFF.UiClientPropCssClass = function() {};
oFF.UiClientPropCssClass.prototype = new oFF.UiClientPropString();
oFF.UiClientPropCssClass.prototype._ff_c = "UiClientPropCssClass";

oFF.UiClientPropCssClass.prototype.setString = function(target, value)
{
	target.setCssClass(value);
};
oFF.UiClientPropCssClass.prototype.getString = function(source)
{
	return source.getCssClass();
};

oFF.UiClientPropCustomParameters = function() {};
oFF.UiClientPropCustomParameters.prototype = new oFF.UiClientPropJson();
oFF.UiClientPropCustomParameters.prototype._ff_c = "UiClientPropCustomParameters";

oFF.UiClientPropCustomParameters.prototype.setJsonValue = function(target, value)
{
	target.setCustomParameters(value);
};
oFF.UiClientPropCustomParameters.prototype.getJsonValue = function(source)
{
	return source.getCustomParameters();
};

oFF.UiClientPropDataManifest = function() {};
oFF.UiClientPropDataManifest.prototype = new oFF.UiClientPropJson();
oFF.UiClientPropDataManifest.prototype._ff_c = "UiClientPropDataManifest";

oFF.UiClientPropDataManifest.prototype.setJsonValue = function(target, value)
{
	var jsonValue = null;
	if (oFF.notNull(value) && value.isStructure())
	{
		jsonValue = value;
	}
	target.setDataManifest(jsonValue);
};
oFF.UiClientPropDataManifest.prototype.getJsonValue = function(source)
{
	return source.getDataManifest();
};

oFF.UiClientPropDisplayFormat = function() {};
oFF.UiClientPropDisplayFormat.prototype = new oFF.UiClientPropString();
oFF.UiClientPropDisplayFormat.prototype._ff_c = "UiClientPropDisplayFormat";

oFF.UiClientPropDisplayFormat.prototype.setString = function(target, value)
{
	target.setDisplayFormat(value);
};
oFF.UiClientPropDisplayFormat.prototype.getString = function(source)
{
	return source.getDisplayFormat();
};

oFF.UiClientPropMaxDate = function() {};
oFF.UiClientPropMaxDate.prototype = new oFF.UiClientPropString();
oFF.UiClientPropMaxDate.prototype._ff_c = "UiClientPropMaxDate";

oFF.UiClientPropMaxDate.prototype.setString = function(target, value)
{
	target.setMaxDate(value);
};
oFF.UiClientPropMaxDate.prototype.getString = function(source)
{
	return source.getMaxDate();
};

oFF.UiClientPropMinDate = function() {};
oFF.UiClientPropMinDate.prototype = new oFF.UiClientPropString();
oFF.UiClientPropMinDate.prototype._ff_c = "UiClientPropMinDate";

oFF.UiClientPropMinDate.prototype.setString = function(target, value)
{
	target.setMinDate(value);
};
oFF.UiClientPropMinDate.prototype.getString = function(source)
{
	return source.getMinDate();
};

oFF.UiClientPropMinutesInterval = function() {};
oFF.UiClientPropMinutesInterval.prototype = new oFF.UiClientPropInt();
oFF.UiClientPropMinutesInterval.prototype._ff_c = "UiClientPropMinutesInterval";

oFF.UiClientPropMinutesInterval.prototype.getIntValue = function(source)
{
	return source.getMinutesInterval();
};
oFF.UiClientPropMinutesInterval.prototype.setIntValue = function(target, value)
{
	target.setMinutesInterval(value);
};

oFF.UiClientPropSecondsInterval = function() {};
oFF.UiClientPropSecondsInterval.prototype = new oFF.UiClientPropInt();
oFF.UiClientPropSecondsInterval.prototype._ff_c = "UiClientPropSecondsInterval";

oFF.UiClientPropSecondsInterval.prototype.getIntValue = function(source)
{
	return source.getSecondsInterval();
};
oFF.UiClientPropSecondsInterval.prototype.setIntValue = function(target, value)
{
	target.setSecondsInterval(value);
};

oFF.UiClientPropValueFormat = function() {};
oFF.UiClientPropValueFormat.prototype = new oFF.UiClientPropString();
oFF.UiClientPropValueFormat.prototype._ff_c = "UiClientPropValueFormat";

oFF.UiClientPropValueFormat.prototype.setString = function(target, value)
{
	target.setValueFormat(value);
};
oFF.UiClientPropValueFormat.prototype.getString = function(source)
{
	return source.getValueFormat();
};

oFF.UiClientPropDebounceTime = function() {};
oFF.UiClientPropDebounceTime.prototype = new oFF.UiClientPropInt();
oFF.UiClientPropDebounceTime.prototype._ff_c = "UiClientPropDebounceTime";

oFF.UiClientPropDebounceTime.prototype.setIntValue = function(target, value)
{
	target.setDebounceTime(value);
};
oFF.UiClientPropDebounceTime.prototype.getIntValue = function(source)
{
	return source.getDebounceTime();
};

oFF.UiClientPropDescription = function() {};
oFF.UiClientPropDescription.prototype = new oFF.UiClientPropString();
oFF.UiClientPropDescription.prototype._ff_c = "UiClientPropDescription";

oFF.UiClientPropDescription.prototype.getString = function(source)
{
	return source.getDescription();
};
oFF.UiClientPropDescription.prototype.setString = function(target, value)
{
	target.setDescription(value);
};

oFF.UiClientPropDraggable = function() {};
oFF.UiClientPropDraggable.prototype = new oFF.UiClientPropBool();
oFF.UiClientPropDraggable.prototype._ff_c = "UiClientPropDraggable";

oFF.UiClientPropDraggable.prototype.setBoolValue = function(target, value)
{
	target.setDraggable(value);
};
oFF.UiClientPropDraggable.prototype.getBoolValue = function(source)
{
	return source.isDraggable();
};

oFF.UiClientPropDropInfo = function() {};
oFF.UiClientPropDropInfo.prototype = new oFF.UiClientPropString();
oFF.UiClientPropDropInfo.prototype._ff_c = "UiClientPropDropInfo";

oFF.UiClientPropDropInfo.prototype.setString = function(target, value)
{
	var newDropInfo = null;
	if (oFF.XStringUtils.isNotNullAndNotEmpty(value))
	{
		newDropInfo = oFF.UiDropInfo.createByDropInfoString(value);
	}
	target.setDropInfo(newDropInfo);
};
oFF.UiClientPropDropInfo.prototype.getString = function(source)
{
	if (source.getDropInfo() !== null)
	{
		return source.getDropInfo().getAsString();
	}
	return null;
};

oFF.UiClientPropEditable = function() {};
oFF.UiClientPropEditable.prototype = new oFF.UiClientPropBool();
oFF.UiClientPropEditable.prototype._ff_c = "UiClientPropEditable";

oFF.UiClientPropEditable.prototype.setBoolValue = function(target, value)
{
	target.setEditable(value);
};
oFF.UiClientPropEditable.prototype.getBoolValue = function(source)
{
	return source.isEditable();
};

oFF.UiClientPropEnabled = function() {};
oFF.UiClientPropEnabled.prototype = new oFF.UiClientPropBool();
oFF.UiClientPropEnabled.prototype._ff_c = "UiClientPropEnabled";

oFF.UiClientPropEnabled.prototype.getBoolValue = function(source)
{
	return source.isEnabled();
};
oFF.UiClientPropEnabled.prototype.setBoolValue = function(target, value)
{
	target.setEnabled(value);
};

oFF.UiClientPropEnableReordering = function() {};
oFF.UiClientPropEnableReordering.prototype = new oFF.UiClientPropBool();
oFF.UiClientPropEnableReordering.prototype._ff_c = "UiClientPropEnableReordering";

oFF.UiClientPropEnableReordering.prototype.setBoolValue = function(target, value)
{
	target.setEnableReordering(value);
};
oFF.UiClientPropEnableReordering.prototype.getBoolValue = function(source)
{
	return source.isEnableReordering();
};

oFF.UiClientPropEnableSelectAll = function() {};
oFF.UiClientPropEnableSelectAll.prototype = new oFF.UiClientPropBool();
oFF.UiClientPropEnableSelectAll.prototype._ff_c = "UiClientPropEnableSelectAll";

oFF.UiClientPropEnableSelectAll.prototype.setBoolValue = function(target, value)
{
	target.setEnableSelectAll(value);
};
oFF.UiClientPropEnableSelectAll.prototype.getBoolValue = function(source)
{
	return source.isEnableSelectAll();
};

oFF.UiClientPropEndDate = function() {};
oFF.UiClientPropEndDate.prototype = new oFF.UiClientPropString();
oFF.UiClientPropEndDate.prototype._ff_c = "UiClientPropEndDate";

oFF.UiClientPropEndDate.prototype.getString = function(source)
{
	return source.getEndDate();
};
oFF.UiClientPropEndDate.prototype.setString = function(target, value)
{
	target.setEndDate(value);
};

oFF.UiClientPropExpandable = function() {};
oFF.UiClientPropExpandable.prototype = new oFF.UiClientPropBool();
oFF.UiClientPropExpandable.prototype._ff_c = "UiClientPropExpandable";

oFF.UiClientPropExpandable.prototype.setBoolValue = function(target, value)
{
	target.setExpandable(value);
};
oFF.UiClientPropExpandable.prototype.getBoolValue = function(source)
{
	return source.isExpandable();
};

oFF.UiClientPropExpanded = function() {};
oFF.UiClientPropExpanded.prototype = new oFF.UiClientPropBool();
oFF.UiClientPropExpanded.prototype._ff_c = "UiClientPropExpanded";

oFF.UiClientPropExpanded.prototype.setBoolValue = function(target, value)
{
	target.setExpanded(value);
};
oFF.UiClientPropExpanded.prototype.getBoolValue = function(source)
{
	return source.isExpanded();
};

oFF.UiClientPropFlex = function() {};
oFF.UiClientPropFlex.prototype = new oFF.UiClientPropString();
oFF.UiClientPropFlex.prototype._ff_c = "UiClientPropFlex";

oFF.UiClientPropFlex.prototype.setString = function(target, value)
{
	target.setFlex(value);
};
oFF.UiClientPropFlex.prototype.getString = function(source)
{
	return source.getFlex();
};

oFF.UiClientPropFontColor = function() {};
oFF.UiClientPropFontColor.prototype = new oFF.UiClientPropString();
oFF.UiClientPropFontColor.prototype._ff_c = "UiClientPropFontColor";

oFF.UiClientPropFontColor.prototype.setString = function(target, value)
{
	target.setFontColor(oFF.UiColor.create(value));
};
oFF.UiClientPropFontColor.prototype.getString = function(source)
{
	if (source.getFontColor() !== null)
	{
		return source.getFontColor().getCssValue();
	}
	return null;
};

oFF.UiClientPropFontSize = function() {};
oFF.UiClientPropFontSize.prototype = new oFF.UiClientPropString();
oFF.UiClientPropFontSize.prototype._ff_c = "UiClientPropFontSize";

oFF.UiClientPropFontSize.prototype.getString = function(source)
{
	if (source.getFontSize() !== null)
	{
		return source.getFontSize().getCssValue();
	}
	return null;
};
oFF.UiClientPropFontSize.prototype.setString = function(target, value)
{
	target.setFontSize(oFF.UiCssLength.create(value));
};

oFF.UiClientPropFooterHeight = function() {};
oFF.UiClientPropFooterHeight.prototype = new oFF.UiClientPropString();
oFF.UiClientPropFooterHeight.prototype._ff_c = "UiClientPropFooterHeight";

oFF.UiClientPropFooterHeight.prototype.setString = function(target, value)
{
	target.setFooterHeight(oFF.UiCssLength.create(value));
};
oFF.UiClientPropFooterHeight.prototype.getString = function(source)
{
	if (source.getFooterHeight() !== null)
	{
		return source.getFooterHeight().getCssValue();
	}
	return null;
};

oFF.UiClientPropHeaderHeight = function() {};
oFF.UiClientPropHeaderHeight.prototype = new oFF.UiClientPropString();
oFF.UiClientPropHeaderHeight.prototype._ff_c = "UiClientPropHeaderHeight";

oFF.UiClientPropHeaderHeight.prototype.setString = function(target, value)
{
	target.setHeaderHeight(oFF.UiCssLength.create(value));
};
oFF.UiClientPropHeaderHeight.prototype.getString = function(source)
{
	if (source.getHeaderHeight() !== null)
	{
		return source.getHeaderHeight().getCssValue();
	}
	return null;
};

oFF.UiClientPropHidden = function() {};
oFF.UiClientPropHidden.prototype = new oFF.UiClientPropBool();
oFF.UiClientPropHidden.prototype._ff_c = "UiClientPropHidden";

oFF.UiClientPropHidden.prototype.setBoolValue = oFF.noSupport;
oFF.UiClientPropHidden.prototype.getBoolValue = function(source)
{
	return source.isHidden();
};

oFF.UiClientPropIcon = function() {};
oFF.UiClientPropIcon.prototype = new oFF.UiClientPropString();
oFF.UiClientPropIcon.prototype._ff_c = "UiClientPropIcon";

oFF.UiClientPropIcon.prototype.getString = function(source)
{
	return source.getIcon();
};
oFF.UiClientPropIcon.prototype.setString = function(target, value)
{
	target.setIcon(value);
};

oFF.UiClientPropIconSize = function() {};
oFF.UiClientPropIconSize.prototype = new oFF.UiClientPropString();
oFF.UiClientPropIconSize.prototype._ff_c = "UiClientPropIconSize";

oFF.UiClientPropIconSize.prototype.getString = function(source)
{
	if (source.getIconSize() !== null)
	{
		return source.getIconSize().getCssValue();
	}
	return null;
};
oFF.UiClientPropIconSize.prototype.setString = function(target, value)
{
	target.setIconSize(oFF.UiCssLength.create(value));
};

oFF.UiClientPropSrc = function() {};
oFF.UiClientPropSrc.prototype = new oFF.UiClientPropString();
oFF.UiClientPropSrc.prototype._ff_c = "UiClientPropSrc";

oFF.UiClientPropSrc.prototype.setString = function(target, value)
{
	target.setSrc(value);
};
oFF.UiClientPropSrc.prototype.getString = function(source)
{
	return source.getSrc();
};

oFF.UiClientPropIntervalSelection = function() {};
oFF.UiClientPropIntervalSelection.prototype = new oFF.UiClientPropBool();
oFF.UiClientPropIntervalSelection.prototype._ff_c = "UiClientPropIntervalSelection";

oFF.UiClientPropIntervalSelection.prototype.setBoolValue = function(target, value)
{
	target.setIntervalSelection(value);
};
oFF.UiClientPropIntervalSelection.prototype.getBoolValue = function(source)
{
	return source.isIntervalSelection();
};

oFF.UiClientPropChecked = function() {};
oFF.UiClientPropChecked.prototype = new oFF.UiClientPropBool();
oFF.UiClientPropChecked.prototype._ff_c = "UiClientPropChecked";

oFF.UiClientPropChecked.prototype.getBoolValue = function(source)
{
	return source.isChecked();
};
oFF.UiClientPropChecked.prototype.setBoolValue = function(target, value)
{
	target.setChecked(value);
};

oFF.UiClientPropLabel = function() {};
oFF.UiClientPropLabel.prototype = new oFF.UiClientPropString();
oFF.UiClientPropLabel.prototype._ff_c = "UiClientPropLabel";

oFF.UiClientPropLabel.prototype.setString = function(target, value)
{
	target.setLabel(value);
};
oFF.UiClientPropLabel.prototype.getString = function(source)
{
	return source.getLabel();
};

oFF.UiClientPropMargin = function() {};
oFF.UiClientPropMargin.prototype = new oFF.UiClientPropString();
oFF.UiClientPropMargin.prototype._ff_c = "UiClientPropMargin";

oFF.UiClientPropMargin.prototype.setString = function(target, value)
{
	target.setMargin(oFF.UiCssBoxEdges.create(value));
};
oFF.UiClientPropMargin.prototype.getString = function(source)
{
	if (source.getMargin() !== null)
	{
		return source.getMargin().getCssValue();
	}
	return null;
};

oFF.UiClientPropMaximized = function() {};
oFF.UiClientPropMaximized.prototype = new oFF.UiClientPropBool();
oFF.UiClientPropMaximized.prototype._ff_c = "UiClientPropMaximized";

oFF.UiClientPropMaximized.prototype.setBoolValue = oFF.noSupport;
oFF.UiClientPropMaximized.prototype.getBoolValue = function(source)
{
	return source.isMaximized();
};

oFF.UiClientPropMaxLength = function() {};
oFF.UiClientPropMaxLength.prototype = new oFF.UiClientPropInt();
oFF.UiClientPropMaxLength.prototype._ff_c = "UiClientPropMaxLength";

oFF.UiClientPropMaxLength.prototype.setIntValue = function(target, value)
{
	target.setMaxLength(value);
};
oFF.UiClientPropMaxLength.prototype.getIntValue = function(source)
{
	return source.getMaxLength();
};

oFF.UiClientPropModelJson = function() {};
oFF.UiClientPropModelJson.prototype = new oFF.UiClientPropJson();
oFF.UiClientPropModelJson.prototype._ff_c = "UiClientPropModelJson";

oFF.UiClientPropModelJson.prototype.setJsonValue = function(target, value)
{
	target.setModelJson(value);
};
oFF.UiClientPropModelJson.prototype.getJsonValue = function(source)
{
	return source.getModelJson();
};

oFF.UiClientPropModified = function() {};
oFF.UiClientPropModified.prototype = new oFF.UiClientPropBool();
oFF.UiClientPropModified.prototype._ff_c = "UiClientPropModified";

oFF.UiClientPropModified.prototype.setBoolValue = function(target, value)
{
	target.setModified(value);
};
oFF.UiClientPropModified.prototype.getBoolValue = function(source)
{
	return source.isModified();
};

oFF.UiClientPropNode = function() {};
oFF.UiClientPropNode.prototype = new oFF.UiClientPropBool();
oFF.UiClientPropNode.prototype._ff_c = "UiClientPropNode";

oFF.UiClientPropNode.prototype.setBoolValue = function(target, value)
{
	target.setNode(value);
};
oFF.UiClientPropNode.prototype.getBoolValue = function(source)
{
	return source.isNode();
};

oFF.UiClientPropOffsetHeight = function() {};
oFF.UiClientPropOffsetHeight.prototype = new oFF.UiClientPropInt();
oFF.UiClientPropOffsetHeight.prototype._ff_c = "UiClientPropOffsetHeight";

oFF.UiClientPropOffsetHeight.prototype.setIntValue = oFF.noSupport;
oFF.UiClientPropOffsetHeight.prototype.getIntValue = function(source)
{
	return source.getOffsetHeight();
};

oFF.UiClientPropOffsetWidth = function() {};
oFF.UiClientPropOffsetWidth.prototype = new oFF.UiClientPropInt();
oFF.UiClientPropOffsetWidth.prototype._ff_c = "UiClientPropOffsetWidth";

oFF.UiClientPropOffsetWidth.prototype.setIntValue = oFF.noSupport;
oFF.UiClientPropOffsetWidth.prototype.getIntValue = function(source)
{
	return source.getOffsetWidth();
};

oFF.UiClientPropOffText = function() {};
oFF.UiClientPropOffText.prototype = new oFF.UiClientPropString();
oFF.UiClientPropOffText.prototype._ff_c = "UiClientPropOffText";

oFF.UiClientPropOffText.prototype.getString = function(source)
{
	return source.getOffText();
};
oFF.UiClientPropOffText.prototype.setString = function(target, value)
{
	target.setOffText(value);
};

oFF.UiClientPropOn = function() {};
oFF.UiClientPropOn.prototype = new oFF.UiClientPropBool();
oFF.UiClientPropOn.prototype._ff_c = "UiClientPropOn";

oFF.UiClientPropOn.prototype.getBoolValue = function(source)
{
	return source.isOn();
};
oFF.UiClientPropOn.prototype.setBoolValue = function(target, value)
{
	target.setOn(value);
};

oFF.UiClientPropOnText = function() {};
oFF.UiClientPropOnText.prototype = new oFF.UiClientPropString();
oFF.UiClientPropOnText.prototype._ff_c = "UiClientPropOnText";

oFF.UiClientPropOnText.prototype.getString = function(source)
{
	return source.getOnText();
};
oFF.UiClientPropOnText.prototype.setString = function(target, value)
{
	target.setOnText(value);
};

oFF.UiClientPropOpacity = function() {};
oFF.UiClientPropOpacity.prototype = new oFF.UiClientPropDouble();
oFF.UiClientPropOpacity.prototype._ff_c = "UiClientPropOpacity";

oFF.UiClientPropOpacity.prototype.setDoubleValue = function(target, value)
{
	target.setOpacity(value);
};
oFF.UiClientPropOpacity.prototype.getDoubleValue = function(source)
{
	return source.getOpacity();
};

oFF.UiClientPropOpen = function() {};
oFF.UiClientPropOpen.prototype = new oFF.UiClientPropBool();
oFF.UiClientPropOpen.prototype._ff_c = "UiClientPropOpen";

oFF.UiClientPropOpen.prototype.setBoolValue = oFF.noSupport;
oFF.UiClientPropOpen.prototype.getBoolValue = function(source)
{
	return source.isOpen();
};

oFF.UiClientPropOrder = function() {};
oFF.UiClientPropOrder.prototype = new oFF.UiClientPropInt();
oFF.UiClientPropOrder.prototype._ff_c = "UiClientPropOrder";

oFF.UiClientPropOrder.prototype.setIntValue = function(target, value)
{
	target.setOrder(value);
};
oFF.UiClientPropOrder.prototype.getIntValue = function(source)
{
	return source.getOrder();
};

oFF.UiClientPropPadding = function() {};
oFF.UiClientPropPadding.prototype = new oFF.UiClientPropString();
oFF.UiClientPropPadding.prototype._ff_c = "UiClientPropPadding";

oFF.UiClientPropPadding.prototype.setString = function(target, value)
{
	target.setPadding(oFF.UiCssBoxEdges.create(value));
};
oFF.UiClientPropPadding.prototype.getString = function(source)
{
	if (source.getPadding() !== null)
	{
		return source.getPadding().getCssValue();
	}
	return null;
};

oFF.UiClientPropPartiallyChecked = function() {};
oFF.UiClientPropPartiallyChecked.prototype = new oFF.UiClientPropBool();
oFF.UiClientPropPartiallyChecked.prototype._ff_c = "UiClientPropPartiallyChecked";

oFF.UiClientPropPartiallyChecked.prototype.setBoolValue = function(target, value)
{
	target.setPartiallyChecked(value);
};
oFF.UiClientPropPartiallyChecked.prototype.getBoolValue = function(source)
{
	return source.isPartiallyChecked();
};

oFF.UiClientPropPath = function() {};
oFF.UiClientPropPath.prototype = new oFF.UiClientPropString();
oFF.UiClientPropPath.prototype._ff_c = "UiClientPropPath";

oFF.UiClientPropPath.prototype.getString = function(source)
{
	return source.getPath();
};
oFF.UiClientPropPath.prototype.setString = function(target, value)
{
	target.setPath(value);
};

oFF.UiClientPropPercentValue = function() {};
oFF.UiClientPropPercentValue.prototype = new oFF.UiClientPropDouble();
oFF.UiClientPropPercentValue.prototype._ff_c = "UiClientPropPercentValue";

oFF.UiClientPropPercentValue.prototype.setDoubleValue = function(target, value)
{
	target.setPercentValue(value);
};
oFF.UiClientPropPercentValue.prototype.getDoubleValue = function(source)
{
	return source.getPercentValue();
};

oFF.UiClientPropPlaceholder = function() {};
oFF.UiClientPropPlaceholder.prototype = new oFF.UiClientPropString();
oFF.UiClientPropPlaceholder.prototype._ff_c = "UiClientPropPlaceholder";

oFF.UiClientPropPlaceholder.prototype.getString = function(source)
{
	return source.getPlaceholder();
};
oFF.UiClientPropPlaceholder.prototype.setString = function(target, value)
{
	target.setPlaceholder(value);
};

oFF.UiClientPropXPos = function() {};
oFF.UiClientPropXPos.prototype = new oFF.UiClientPropString();
oFF.UiClientPropXPos.prototype._ff_c = "UiClientPropXPos";

oFF.UiClientPropXPos.prototype.setString = function(target, value)
{
	target.setX(oFF.UiCssLength.create(value));
};
oFF.UiClientPropXPos.prototype.getString = function(source)
{
	if (source.getX() !== null)
	{
		return source.getX().getCssValue();
	}
	return null;
};

oFF.UiClientPropYPos = function() {};
oFF.UiClientPropYPos.prototype = new oFF.UiClientPropString();
oFF.UiClientPropYPos.prototype._ff_c = "UiClientPropYPos";

oFF.UiClientPropYPos.prototype.setString = function(target, value)
{
	target.setY(oFF.UiCssLength.create(value));
};
oFF.UiClientPropYPos.prototype.getString = function(source)
{
	if (source.getY() !== null)
	{
		return source.getY().getCssValue();
	}
	return null;
};

oFF.UiClientPropPressed = function() {};
oFF.UiClientPropPressed.prototype = new oFF.UiClientPropBool();
oFF.UiClientPropPressed.prototype._ff_c = "UiClientPropPressed";

oFF.UiClientPropPressed.prototype.setBoolValue = function(target, value)
{
	target.setPressed(value);
};
oFF.UiClientPropPressed.prototype.getBoolValue = function(source)
{
	return source.isPressed();
};

oFF.UiClientPropPrompt = function() {};
oFF.UiClientPropPrompt.prototype = new oFF.UiClientPropString();
oFF.UiClientPropPrompt.prototype._ff_c = "UiClientPropPrompt";

oFF.UiClientPropPrompt.prototype.getString = function(source)
{
	return source.getPrompt();
};
oFF.UiClientPropPrompt.prototype.setString = function(target, value)
{
	target.setPrompt(value);
};

oFF.UiClientQuasarSelectedName = function() {};
oFF.UiClientQuasarSelectedName.prototype = new oFF.UiClientPropString();
oFF.UiClientQuasarSelectedName.prototype._ff_c = "UiClientQuasarSelectedName";

oFF.UiClientQuasarSelectedName.prototype.setString = function(target, value)
{
	target.setSelectedName(value);
};
oFF.UiClientQuasarSelectedName.prototype.getString = function(source)
{
	return source.getSelectedName();
};

oFF.UiClientPropRequired = function() {};
oFF.UiClientPropRequired.prototype = new oFF.UiClientPropBool();
oFF.UiClientPropRequired.prototype._ff_c = "UiClientPropRequired";

oFF.UiClientPropRequired.prototype.setBoolValue = function(target, value)
{
	target.setRequired(value);
};
oFF.UiClientPropRequired.prototype.getBoolValue = function(source)
{
	return source.isRequired();
};

oFF.UiClientPropResizable = function() {};
oFF.UiClientPropResizable.prototype = new oFF.UiClientPropBool();
oFF.UiClientPropResizable.prototype._ff_c = "UiClientPropResizable";

oFF.UiClientPropResizable.prototype.setBoolValue = function(target, value)
{
	target.setResizable(value);
};
oFF.UiClientPropResizable.prototype.getBoolValue = function(source)
{
	return source.isResizable();
};

oFF.UiClientPropRotation = function() {};
oFF.UiClientPropRotation.prototype = new oFF.UiClientPropInt();
oFF.UiClientPropRotation.prototype._ff_c = "UiClientPropRotation";

oFF.UiClientPropRotation.prototype.getIntValue = function(source)
{
	return source.getRotation();
};
oFF.UiClientPropRotation.prototype.setIntValue = function(target, value)
{
	target.setRotation(value);
};

oFF.UiClientPropRowCount = function() {};
oFF.UiClientPropRowCount.prototype = new oFF.UiClientPropInt();
oFF.UiClientPropRowCount.prototype._ff_c = "UiClientPropRowCount";

oFF.UiClientPropRowCount.prototype.setIntValue = function(target, value)
{
	target.setRowCount(value);
};
oFF.UiClientPropRowCount.prototype.getIntValue = function(source)
{
	return source.getRowCount();
};

oFF.UiClientPropRowSpan = function() {};
oFF.UiClientPropRowSpan.prototype = new oFF.UiClientPropInt();
oFF.UiClientPropRowSpan.prototype._ff_c = "UiClientPropRowSpan";

oFF.UiClientPropRowSpan.prototype.getIntValue = function(source)
{
	return source.getRowSpan();
};
oFF.UiClientPropRowSpan.prototype.setIntValue = function(target, value)
{
	target.setRowSpan(value);
};

oFF.UiClientPropSectionStart = function() {};
oFF.UiClientPropSectionStart.prototype = new oFF.UiClientPropBool();
oFF.UiClientPropSectionStart.prototype._ff_c = "UiClientPropSectionStart";

oFF.UiClientPropSectionStart.prototype.setBoolValue = function(target, value)
{
	target.setSectionStart(value);
};
oFF.UiClientPropSectionStart.prototype.getBoolValue = function(source)
{
	return source.isSectionStart();
};

oFF.UiClientPropSelected = function() {};
oFF.UiClientPropSelected.prototype = new oFF.UiClientPropBool();
oFF.UiClientPropSelected.prototype._ff_c = "UiClientPropSelected";

oFF.UiClientPropSelected.prototype.setBoolValue = function(target, value)
{
	target.setSelected(value);
};
oFF.UiClientPropSelected.prototype.getBoolValue = function(source)
{
	return source.isSelected();
};

oFF.UiClientPropShowAddNewButton = function() {};
oFF.UiClientPropShowAddNewButton.prototype = new oFF.UiClientPropBool();
oFF.UiClientPropShowAddNewButton.prototype._ff_c = "UiClientPropShowAddNewButton";

oFF.UiClientPropShowAddNewButton.prototype.setBoolValue = function(target, value)
{
	target.setShowAddNewButton(value);
};
oFF.UiClientPropShowAddNewButton.prototype.getBoolValue = function(source)
{
	return source.isShowAddNewButton();
};

oFF.UiClientPropShowHeader = function() {};
oFF.UiClientPropShowHeader.prototype = new oFF.UiClientPropBool();
oFF.UiClientPropShowHeader.prototype._ff_c = "UiClientPropShowHeader";

oFF.UiClientPropShowHeader.prototype.setBoolValue = function(target, value)
{
	target.setShowHeader(value);
};
oFF.UiClientPropShowHeader.prototype.getBoolValue = function(source)
{
	return source.isShowHeader();
};

oFF.UiClientPropShowNavButton = function() {};
oFF.UiClientPropShowNavButton.prototype = new oFF.UiClientPropBool();
oFF.UiClientPropShowNavButton.prototype._ff_c = "UiClientPropShowNavButton";

oFF.UiClientPropShowNavButton.prototype.setBoolValue = function(target, value)
{
	target.setShowNavButton(value);
};
oFF.UiClientPropShowNavButton.prototype.getBoolValue = function(source)
{
	return source.isShowNavButton();
};

oFF.UiClientPropShowSorting = function() {};
oFF.UiClientPropShowSorting.prototype = new oFF.UiClientPropBool();
oFF.UiClientPropShowSorting.prototype._ff_c = "UiClientPropShowSorting";

oFF.UiClientPropShowSorting.prototype.setBoolValue = function(target, value)
{
	target.setShowSorting(value);
};
oFF.UiClientPropShowSorting.prototype.getBoolValue = function(source)
{
	return source.isShowSorting();
};

oFF.UiClientPropShowValue = function() {};
oFF.UiClientPropShowValue.prototype = new oFF.UiClientPropBool();
oFF.UiClientPropShowValue.prototype._ff_c = "UiClientPropShowValue";

oFF.UiClientPropShowValue.prototype.setBoolValue = function(target, value)
{
	target.setShowValue(value);
};
oFF.UiClientPropShowValue.prototype.getBoolValue = function(source)
{
	return source.isShowValue();
};

oFF.UiClientPropHeight = function() {};
oFF.UiClientPropHeight.prototype = new oFF.UiClientPropString();
oFF.UiClientPropHeight.prototype._ff_c = "UiClientPropHeight";

oFF.UiClientPropHeight.prototype.getString = function(source)
{
	if (source.getHeight() !== null)
	{
		return source.getHeight().getCssValue();
	}
	return null;
};
oFF.UiClientPropHeight.prototype.setString = function(target, value)
{
	target.setHeight(oFF.UiCssLength.create(value));
};

oFF.UiClientPropMaxHeight = function() {};
oFF.UiClientPropMaxHeight.prototype = new oFF.UiClientPropString();
oFF.UiClientPropMaxHeight.prototype._ff_c = "UiClientPropMaxHeight";

oFF.UiClientPropMaxHeight.prototype.getString = function(source)
{
	if (source.getMaxHeight() !== null)
	{
		return source.getMaxHeight().getCssValue();
	}
	return null;
};
oFF.UiClientPropMaxHeight.prototype.setString = function(target, value)
{
	target.setMaxHeight(oFF.UiCssLength.create(value));
};

oFF.UiClientPropMaxWidth = function() {};
oFF.UiClientPropMaxWidth.prototype = new oFF.UiClientPropString();
oFF.UiClientPropMaxWidth.prototype._ff_c = "UiClientPropMaxWidth";

oFF.UiClientPropMaxWidth.prototype.setString = function(target, value)
{
	target.setMaxWidth(oFF.UiCssLength.create(value));
};
oFF.UiClientPropMaxWidth.prototype.getString = function(source)
{
	if (source.getMaxWidth() !== null)
	{
		return source.getMaxWidth().getCssValue();
	}
	return null;
};

oFF.UiClientPropMinHeight = function() {};
oFF.UiClientPropMinHeight.prototype = new oFF.UiClientPropString();
oFF.UiClientPropMinHeight.prototype._ff_c = "UiClientPropMinHeight";

oFF.UiClientPropMinHeight.prototype.getString = function(source)
{
	if (source.getMinHeight() !== null)
	{
		return source.getMinHeight().getCssValue();
	}
	return null;
};
oFF.UiClientPropMinHeight.prototype.setString = function(target, value)
{
	target.setMinHeight(oFF.UiCssLength.create(value));
};

oFF.UiClientPropMinWidth = function() {};
oFF.UiClientPropMinWidth.prototype = new oFF.UiClientPropString();
oFF.UiClientPropMinWidth.prototype._ff_c = "UiClientPropMinWidth";

oFF.UiClientPropMinWidth.prototype.setString = function(target, value)
{
	target.setMinWidth(oFF.UiCssLength.create(value));
};
oFF.UiClientPropMinWidth.prototype.getString = function(source)
{
	if (source.getMinWidth() !== null)
	{
		return source.getMinWidth().getCssValue();
	}
	return null;
};

oFF.UiClientPropWidth = function() {};
oFF.UiClientPropWidth.prototype = new oFF.UiClientPropString();
oFF.UiClientPropWidth.prototype._ff_c = "UiClientPropWidth";

oFF.UiClientPropWidth.prototype.setString = function(target, value)
{
	target.setWidth(oFF.UiCssLength.create(value));
};
oFF.UiClientPropWidth.prototype.getString = function(source)
{
	if (source.getWidth() !== null)
	{
		return source.getWidth().getCssValue();
	}
	return null;
};

oFF.UiClientPropSliderMaximum = function() {};
oFF.UiClientPropSliderMaximum.prototype = new oFF.UiClientPropInt();
oFF.UiClientPropSliderMaximum.prototype._ff_c = "UiClientPropSliderMaximum";

oFF.UiClientPropSliderMaximum.prototype.setIntValue = function(target, value)
{
	target.setSliderMaximum(value);
};
oFF.UiClientPropSliderMaximum.prototype.getIntValue = function(source)
{
	return source.getSliderMaximum();
};

oFF.UiClientPropSliderMinimum = function() {};
oFF.UiClientPropSliderMinimum.prototype = new oFF.UiClientPropInt();
oFF.UiClientPropSliderMinimum.prototype._ff_c = "UiClientPropSliderMinimum";

oFF.UiClientPropSliderMinimum.prototype.setIntValue = function(target, value)
{
	target.setSliderMinimum(value);
};
oFF.UiClientPropSliderMinimum.prototype.getIntValue = function(source)
{
	return source.getSliderMinimum();
};

oFF.UiClientPropSliderStep = function() {};
oFF.UiClientPropSliderStep.prototype = new oFF.UiClientPropInt();
oFF.UiClientPropSliderStep.prototype._ff_c = "UiClientPropSliderStep";

oFF.UiClientPropSliderStep.prototype.getIntValue = function(source)
{
	return source.getSliderStep();
};
oFF.UiClientPropSliderStep.prototype.setIntValue = function(target, value)
{
	target.setSliderStep(value);
};

oFF.UiClientPropSliderUpperValue = function() {};
oFF.UiClientPropSliderUpperValue.prototype = new oFF.UiClientPropInt();
oFF.UiClientPropSliderUpperValue.prototype._ff_c = "UiClientPropSliderUpperValue";

oFF.UiClientPropSliderUpperValue.prototype.getIntValue = function(source)
{
	return source.getSliderUpperValue();
};
oFF.UiClientPropSliderUpperValue.prototype.setIntValue = function(target, value)
{
	target.setSliderUpperValue(value);
};

oFF.UiClientPropSliderValue = function() {};
oFF.UiClientPropSliderValue.prototype = new oFF.UiClientPropInt();
oFF.UiClientPropSliderValue.prototype._ff_c = "UiClientPropSliderValue";

oFF.UiClientPropSliderValue.prototype.getIntValue = function(source)
{
	return source.getSliderValue();
};
oFF.UiClientPropSliderValue.prototype.setIntValue = function(target, value)
{
	target.setSliderValue(value);
};

oFF.UiClientPropSplitterPosition = function() {};
oFF.UiClientPropSplitterPosition.prototype = new oFF.UiClientPropInt();
oFF.UiClientPropSplitterPosition.prototype._ff_c = "UiClientPropSplitterPosition";

oFF.UiClientPropSplitterPosition.prototype.getIntValue = function(source)
{
	return source.getSplitterPosition();
};
oFF.UiClientPropSplitterPosition.prototype.setIntValue = function(target, value)
{
	target.setSplitterPosition(value);
};

oFF.UiClientPropStartDate = function() {};
oFF.UiClientPropStartDate.prototype = new oFF.UiClientPropString();
oFF.UiClientPropStartDate.prototype._ff_c = "UiClientPropStartDate";

oFF.UiClientPropStartDate.prototype.getString = function(source)
{
	return source.getStartDate();
};
oFF.UiClientPropStartDate.prototype.setString = function(target, value)
{
	target.setStartDate(value);
};

oFF.UiClientPropSubtitle = function() {};
oFF.UiClientPropSubtitle.prototype = new oFF.UiClientPropString();
oFF.UiClientPropSubtitle.prototype._ff_c = "UiClientPropSubtitle";

oFF.UiClientPropSubtitle.prototype.getString = function(source)
{
	return source.getSubtitle();
};
oFF.UiClientPropSubtitle.prototype.setString = function(target, value)
{
	target.setSubtitle(value);
};

oFF.UiClientPropTag = function() {};
oFF.UiClientPropTag.prototype = new oFF.UiClientPropString();
oFF.UiClientPropTag.prototype._ff_c = "UiClientPropTag";

oFF.UiClientPropTag.prototype.getString = function(source)
{
	return source.getTag();
};
oFF.UiClientPropTag.prototype.setString = function(target, value)
{
	target.setTag(value);
};

oFF.UiClientPropText = function() {};
oFF.UiClientPropText.prototype = new oFF.UiClientPropString();
oFF.UiClientPropText.prototype._ff_c = "UiClientPropText";

oFF.UiClientPropText.prototype.setString = function(target, value)
{
	target.setText(value);
};
oFF.UiClientPropText.prototype.getString = function(source)
{
	return source.getText();
};

oFF.UiClientPropTextDecoration = function() {};
oFF.UiClientPropTextDecoration.prototype = new oFF.UiClientPropString();
oFF.UiClientPropTextDecoration.prototype._ff_c = "UiClientPropTextDecoration";

oFF.UiClientPropTextDecoration.prototype.setString = function(target, value)
{
	target.setTextDecoration(oFF.UiCssTextDecoration.create(value));
};
oFF.UiClientPropTextDecoration.prototype.getString = function(source)
{
	if (source.getTextDecoration() !== null)
	{
		return source.getTextDecoration().getCssValue();
	}
	return null;
};

oFF.UiClientPropId = function() {};
oFF.UiClientPropId.prototype = new oFF.UiClientPropString();
oFF.UiClientPropId.prototype._ff_c = "UiClientPropId";

oFF.UiClientPropId.prototype.getString = function(source)
{
	return source.getId();
};
oFF.UiClientPropId.prototype.setString = oFF.noSupport;

oFF.UiClientPropName = function() {};
oFF.UiClientPropName.prototype = new oFF.UiClientPropString();
oFF.UiClientPropName.prototype._ff_c = "UiClientPropName";

oFF.UiClientPropName.prototype.getString = function(source)
{
	return source.getName();
};
oFF.UiClientPropName.prototype.setString = function(target, value)
{
	target.setName(value);
};

oFF.UiClientPropTitle = function() {};
oFF.UiClientPropTitle.prototype = new oFF.UiClientPropString();
oFF.UiClientPropTitle.prototype._ff_c = "UiClientPropTitle";

oFF.UiClientPropTitle.prototype.getString = function(source)
{
	return source.getTitle();
};
oFF.UiClientPropTitle.prototype.setString = function(target, value)
{
	target.setTitle(value);
};

oFF.UiClientPropTooltip = function() {};
oFF.UiClientPropTooltip.prototype = new oFF.UiClientPropString();
oFF.UiClientPropTooltip.prototype._ff_c = "UiClientPropTooltip";

oFF.UiClientPropTooltip.prototype.setString = function(target, value)
{
	target.setTooltip(value);
};
oFF.UiClientPropTooltip.prototype.getString = function(source)
{
	return source.getTooltip();
};

oFF.UiClientPropValue = function() {};
oFF.UiClientPropValue.prototype = new oFF.UiClientPropString();
oFF.UiClientPropValue.prototype._ff_c = "UiClientPropValue";

oFF.UiClientPropValue.prototype.getString = function(source)
{
	return source.getValue();
};
oFF.UiClientPropValue.prototype.setString = function(target, value)
{
	target.setValue(value);
};

oFF.UiClientPropValueStateText = function() {};
oFF.UiClientPropValueStateText.prototype = new oFF.UiClientPropString();
oFF.UiClientPropValueStateText.prototype._ff_c = "UiClientPropValueStateText";

oFF.UiClientPropValueStateText.prototype.setString = function(target, value)
{
	target.setValueStateText(value);
};
oFF.UiClientPropValueStateText.prototype.getString = function(source)
{
	return source.getValueStateText();
};

oFF.UiClientPropVisible = function() {};
oFF.UiClientPropVisible.prototype = new oFF.UiClientPropBool();
oFF.UiClientPropVisible.prototype._ff_c = "UiClientPropVisible";

oFF.UiClientPropVisible.prototype.setBoolValue = function(target, value)
{
	target.setVisible(value);
};
oFF.UiClientPropVisible.prototype.getBoolValue = function(source)
{
	return source.isVisible();
};

oFF.UiClientPropMinRowCount = function() {};
oFF.UiClientPropMinRowCount.prototype = new oFF.UiClientPropInt();
oFF.UiClientPropMinRowCount.prototype._ff_c = "UiClientPropMinRowCount";

oFF.UiClientPropMinRowCount.prototype.getIntValue = function(source)
{
	return source.getMinRowCount();
};
oFF.UiClientPropMinRowCount.prototype.setIntValue = function(target, value)
{
	target.setMinRowCount(value);
};

oFF.UiClientPropVisibleRowCount = function() {};
oFF.UiClientPropVisibleRowCount.prototype = new oFF.UiClientPropInt();
oFF.UiClientPropVisibleRowCount.prototype._ff_c = "UiClientPropVisibleRowCount";

oFF.UiClientPropVisibleRowCount.prototype.getIntValue = function(source)
{
	return source.getVisibleRowCount();
};
oFF.UiClientPropVisibleRowCount.prototype.setIntValue = function(target, value)
{
	target.setVisibleRowCount(value);
};

oFF.UiClientPropWrapping = function() {};
oFF.UiClientPropWrapping.prototype = new oFF.UiClientPropBool();
oFF.UiClientPropWrapping.prototype._ff_c = "UiClientPropWrapping";

oFF.UiClientPropWrapping.prototype.setBoolValue = function(target, value)
{
	target.setWrapping(value);
};
oFF.UiClientPropWrapping.prototype.getBoolValue = function(source)
{
	return source.isWrapping();
};

oFF.UiFormItemDropdown = function() {};
oFF.UiFormItemDropdown.prototype = new oFF.DfUiFormItem();
oFF.UiFormItemDropdown.prototype._ff_c = "UiFormItemDropdown";

oFF.UiFormItemDropdown.DROPDOWN_EMPTY_ITEM_NAME = "UiFormItemDropdownEmptyItem";
oFF.UiFormItemDropdown.create = function(genesis, key, value, text, isRequired, dropdownItems, addEmptyItem)
{
	var newFormItem = new oFF.UiFormItemDropdown();
	newFormItem.setupInternal(genesis, key, value, text, isRequired, dropdownItems, addEmptyItem);
	return newFormItem;
};
oFF.UiFormItemDropdown.prototype.m_dropdownItems = null;
oFF.UiFormItemDropdown.prototype.m_addEmptyItem = false;
oFF.UiFormItemDropdown.prototype.releaseObject = function()
{
	this.m_dropdownItems = null;
	oFF.DfUiFormItem.prototype.releaseObject.call( this );
};
oFF.UiFormItemDropdown.prototype.setupInternal = function(genesis, key, value, text, isRequired, dropdownItems, addEmptyItem)
{
	this.m_dropdownItems = dropdownItems;
	this.m_addEmptyItem = addEmptyItem;
	this.setupFormItem(genesis, key, value, text, isRequired);
};
oFF.UiFormItemDropdown.prototype.createFormItemUi = function(genesis)
{
	var formItemDropdown = genesis.newControl(oFF.UiType.DROPDOWN);
	formItemDropdown.setRequired(this.isRequired());
	formItemDropdown.registerOnSelect(this);
	this.fillDropdownItems(formItemDropdown);
	return formItemDropdown;
};
oFF.UiFormItemDropdown.prototype.refreshModelValue = function()
{
	var formDropdown = this.getFormItemControl();
	var value = formDropdown.getSelectedName();
	value = oFF.XString.isEqual(value, oFF.UiFormItemDropdown.DROPDOWN_EMPTY_ITEM_NAME) ? null : value;
	this.updateModelValueByString(value);
};
oFF.UiFormItemDropdown.prototype.setInvalidState = function(reason)
{
	var formDropdown = this.getFormItemControl();
	formDropdown.setValueState(oFF.UiValueState.ERROR);
	formDropdown.setValueStateText(reason);
};
oFF.UiFormItemDropdown.prototype.setValidState = function()
{
	var formDropdown = this.getFormItemControl();
	formDropdown.setValueState(oFF.UiValueState.NONE);
	formDropdown.setValueStateText(null);
};
oFF.UiFormItemDropdown.prototype.updateControlValue = function()
{
	var formDropdown = this.getFormItemControl();
	formDropdown.setSelectedName(this.getModelValueAsString());
};
oFF.UiFormItemDropdown.prototype.getValueType = function()
{
	return oFF.XValueType.STRING;
};
oFF.UiFormItemDropdown.prototype.setEditable = function(editable)
{
	var formDropdown = this.getFormItemControl();
	formDropdown.setEditable(editable);
};
oFF.UiFormItemDropdown.prototype.fillDropdownItems = function(formItemDropdown)
{
	if (oFF.notNull(this.m_dropdownItems) && this.m_dropdownItems.size() > 0)
	{
		if (this.m_addEmptyItem)
		{
			var emptyDdItem = formItemDropdown.addNewItem();
			emptyDdItem.setName(oFF.UiFormItemDropdown.DROPDOWN_EMPTY_ITEM_NAME);
			emptyDdItem.setText("");
		}
		var keysIterator = this.m_dropdownItems.getKeysAsIteratorOfString();
		while (keysIterator.hasNext())
		{
			var tmpKey = keysIterator.next();
			var tmpText = this.m_dropdownItems.getByKey(tmpKey);
			var tmpDdItem = formItemDropdown.addNewItem();
			tmpDdItem.setName(tmpKey);
			tmpDdItem.setText(tmpText);
		}
		if (this.getValue() !== null && this.m_dropdownItems.containsKey(this.getModelValueAsString()))
		{
			formItemDropdown.setSelectedName(this.getModelValueAsString());
		}
		else
		{
			formItemDropdown.setSelectedItemByIndex(0);
		}
	}
};
oFF.UiFormItemDropdown.prototype.onSelect = function(event)
{
	this.validate();
	this.notifyValueChanged();
};

oFF.UiFormItemInput = function() {};
oFF.UiFormItemInput.prototype = new oFF.DfUiFormItem();
oFF.UiFormItemInput.prototype._ff_c = "UiFormItemInput";

oFF.UiFormItemInput.create = function(genesis, key, value, text, isRequired, placeholder, inputType)
{
	var newFormItem = new oFF.UiFormItemInput();
	newFormItem.setupInternal(genesis, key, value, text, isRequired, placeholder, inputType);
	return newFormItem;
};
oFF.UiFormItemInput.prototype.m_placeholder = null;
oFF.UiFormItemInput.prototype.m_inputType = null;
oFF.UiFormItemInput.prototype.releaseObject = function()
{
	oFF.DfUiFormItem.prototype.releaseObject.call( this );
};
oFF.UiFormItemInput.prototype.setupInternal = function(genesis, key, value, text, isRequired, placeholder, inputType)
{
	this.m_placeholder = placeholder;
	this.m_inputType = oFF.notNull(inputType) ? inputType : oFF.UiInputType.TEXT;
	this.setupFormItem(genesis, key, value, text, isRequired);
};
oFF.UiFormItemInput.prototype.createFormItemUi = function(genesis)
{
	var formItemInput = genesis.newControl(oFF.UiType.INPUT);
	formItemInput.setPlaceholder(this.m_placeholder);
	formItemInput.setText(this.getModelValueAsString());
	formItemInput.setInputType(this.m_inputType);
	formItemInput.setRequired(this.isRequired());
	formItemInput.registerOnLiveChange(this);
	formItemInput.registerOnEditingEnd(this);
	formItemInput.registerOnEnter(this);
	return formItemInput;
};
oFF.UiFormItemInput.prototype.refreshModelValue = function()
{
	var formInput = this.getFormItemControl();
	this.updateModelValueByString(formInput.getText());
};
oFF.UiFormItemInput.prototype.setInvalidState = function(reason)
{
	var formInput = this.getFormItemControl();
	formInput.setValueState(oFF.UiValueState.ERROR);
	formInput.setValueStateText(reason);
};
oFF.UiFormItemInput.prototype.setValidState = function()
{
	var formInput = this.getFormItemControl();
	formInput.setValueState(oFF.UiValueState.NONE);
	formInput.setValueStateText(null);
};
oFF.UiFormItemInput.prototype.updateControlValue = function()
{
	var formInput = this.getFormItemControl();
	formInput.setText(this.getModelValueAsString());
};
oFF.UiFormItemInput.prototype.getValueType = function()
{
	return oFF.XValueType.STRING;
};
oFF.UiFormItemInput.prototype.setEditable = function(editable)
{
	var formInput = this.getFormItemControl();
	formInput.setEditable(editable);
};
oFF.UiFormItemInput.prototype.onLiveChange = function(event)
{
	this.validate();
	this.notifyValueChanged();
};
oFF.UiFormItemInput.prototype.onEnter = function(event)
{
	this.notifyEnterPressed();
};
oFF.UiFormItemInput.prototype.onEditingEnd = function(event) {};

oFF.UiFormItemSwitch = function() {};
oFF.UiFormItemSwitch.prototype = new oFF.DfUiFormItem();
oFF.UiFormItemSwitch.prototype._ff_c = "UiFormItemSwitch";

oFF.UiFormItemSwitch.create = function(genesis, key, value, text)
{
	var newFormItem = new oFF.UiFormItemSwitch();
	newFormItem.setupInternal(genesis, key, value, text);
	return newFormItem;
};
oFF.UiFormItemSwitch.prototype.releaseObject = function()
{
	oFF.DfUiFormItem.prototype.releaseObject.call( this );
};
oFF.UiFormItemSwitch.prototype.setupInternal = function(genesis, key, value, text)
{
	this.setupFormItem(genesis, key, value, text, false);
};
oFF.UiFormItemSwitch.prototype.createFormItemUi = function(genesis)
{
	var formItemSwitch = genesis.newControl(oFF.UiType.SWITCH);
	formItemSwitch.setOn(this.getModelValueAsBoolean());
	formItemSwitch.setMargin(oFF.UiCssBoxEdges.create("0px auto 0px 0px"));
	formItemSwitch.registerOnChange(this);
	return formItemSwitch;
};
oFF.UiFormItemSwitch.prototype.isRequiredValid = function()
{
	return true;
};
oFF.UiFormItemSwitch.prototype.executeCustomValidator = function() {};
oFF.UiFormItemSwitch.prototype.refreshModelValue = function()
{
	var formSwitch = this.getFormItemControl();
	this.updateModelValueByBoolean(formSwitch.isOn());
};
oFF.UiFormItemSwitch.prototype.setInvalidState = function(reason) {};
oFF.UiFormItemSwitch.prototype.setValidState = function() {};
oFF.UiFormItemSwitch.prototype.updateControlValue = function()
{
	var formSwitch = this.getFormItemControl();
	formSwitch.setOn(this.getModelValueAsBoolean());
};
oFF.UiFormItemSwitch.prototype.getValueType = function()
{
	return oFF.XValueType.BOOLEAN;
};
oFF.UiFormItemSwitch.prototype.isEmpty = function()
{
	return false;
};
oFF.UiFormItemSwitch.prototype.setEditable = function(editable)
{
	var formSwitch = this.getFormItemControl();
	formSwitch.setEnabled(editable);
};
oFF.UiFormItemSwitch.prototype.onChange = function(event)
{
	this.validate();
	this.notifyValueChanged();
};

oFF.UiFormSection = function() {};
oFF.UiFormSection.prototype = new oFF.DfUiFormItem();
oFF.UiFormSection.prototype._ff_c = "UiFormSection";

oFF.UiFormSection.FORM_SECTION_VALUE_REQUIRED_TEXT = "Some required values are missing";
oFF.UiFormSection.FORM_SECTION_ERROR_WRAPPER_TAG = "ffFormSectionErrorWrapper";
oFF.UiFormSection.FORM_SECTION_ERROR_LABEL_TAG = "ffFormSectionErrorLabel";
oFF.UiFormSection.create = function(genesis, key, text, isHorizontal)
{
	var newFormItem = new oFF.UiFormSection();
	newFormItem.setupInternal(genesis, key, text, isHorizontal);
	return newFormItem;
};
oFF.UiFormSection.prototype.m_internalForm = null;
oFF.UiFormSection.prototype.m_errorWrapper = null;
oFF.UiFormSection.prototype.m_errorLbl = null;
oFF.UiFormSection.prototype.m_showSectionMarker = false;
oFF.UiFormSection.prototype.releaseObject = function()
{
	this.m_errorLbl = oFF.XObjectExt.release(this.m_errorLbl);
	this.m_errorWrapper = oFF.XObjectExt.release(this.m_errorWrapper);
	oFF.DfUiFormItem.prototype.releaseObject.call( this );
};
oFF.UiFormSection.prototype.setupInternal = function(genesis, key, text, isHorizontal)
{
	this.m_showSectionMarker = false;
	var newForm = oFF.UiForm.create(genesis, this);
	this.m_internalForm = newForm;
	newForm.setHorizontal(isHorizontal);
	this.setupFormItem(genesis, key, null, text, false);
	this.adjustFormLabelStyling();
	this.createErrorWrapper();
};
oFF.UiFormSection.prototype.adjustFormLabelStyling = function()
{
	var formLabel = this.getFormLabelControl().getFormControl();
	formLabel.setFontWeight(null);
	formLabel.setOpacity(0.9);
	formLabel.setFontSize(oFF.UiCssLength.create("0.9rem"));
	formLabel.setMargin(null);
	formLabel.setPadding(oFF.UiCssBoxEdges.create("0.2rem 0.3rem 0 0"));
};
oFF.UiFormSection.prototype.createErrorWrapper = function()
{
	var sectionWrapper = this.getFormControl();
	this.m_errorWrapper = sectionWrapper.addNewItemOfType(oFF.UiType.FLEX_LAYOUT);
	this.m_errorWrapper.setTag(oFF.UiFormSection.FORM_SECTION_ERROR_WRAPPER_TAG);
	this.m_errorWrapper.setDirection(oFF.UiFlexDirection.ROW);
	this.m_errorWrapper.setAlignItems(oFF.UiFlexAlignItems.CENTER);
	this.m_errorWrapper.useMaxWidth();
	this.m_errorWrapper.setPadding(oFF.UiCssBoxEdges.create("0.2rem 0.3rem 0 0"));
	this.m_errorWrapper.setVisible(false);
	var alertIcon = this.m_errorWrapper.addNewItemOfType(oFF.UiType.ICON);
	alertIcon.setIcon("alert");
	alertIcon.setEnabled(false);
	alertIcon.setColor(oFF.UiTheme.getCurrentTheme().getErrorColor());
	alertIcon.setIconSize(oFF.UiCssLength.create("0.75rem"));
	alertIcon.setMargin(oFF.UiCssBoxEdges.create("0 5px 0 0"));
	this.m_errorLbl = this.m_errorWrapper.addNewItemOfType(oFF.UiType.LABEL);
	this.m_errorLbl.setTag(oFF.UiFormSection.FORM_SECTION_ERROR_LABEL_TAG);
	this.m_errorLbl.setFontColor(oFF.UiTheme.getCurrentTheme().getErrorColor());
	this.m_errorLbl.setFontSize(oFF.UiCssLength.create("0.75rem"));
	this.m_errorLbl.setWrapping(false);
};
oFF.UiFormSection.prototype.createFormItemUi = function(genesis)
{
	return this.m_internalForm.getFormWrapper();
};
oFF.UiFormSection.prototype.isRequiredValid = function()
{
	var isRequiredValid = true;
	var formItemIterator = this.getAllFormItems().getIterator();
	while (formItemIterator.hasNext())
	{
		var tmpFormItem = formItemIterator.next();
		if (tmpFormItem.isRequired() && tmpFormItem.isEmpty())
		{
			isRequiredValid = false;
			break;
		}
	}
	return isRequiredValid;
};
oFF.UiFormSection.prototype.refreshModelValue = function()
{
	this.m_internalForm.submit(null);
};
oFF.UiFormSection.prototype.setInvalidState = function(reason)
{
	this.showSectionMarkerInternal(true, oFF.UiTheme.getCurrentTheme().getErrorColor());
	this.m_errorWrapper.setVisible(true);
	this.m_errorWrapper.setTooltip(reason);
	this.m_errorLbl.setText(reason);
};
oFF.UiFormSection.prototype.setValidState = function()
{
	this.showSectionMarkerInternal(this.m_showSectionMarker, oFF.UiTheme.getCurrentTheme().getLightGrayColor());
	this.m_errorWrapper.setVisible(false);
	this.m_errorWrapper.setTooltip(null);
	this.m_errorLbl.setText(null);
};
oFF.UiFormSection.prototype.updateControlValue = function() {};
oFF.UiFormSection.prototype.getValueRequiredText = function()
{
	if (oFF.XStringUtils.isNotNullAndNotEmpty(this.getCustomRequiredText()))
	{
		return this.getCustomRequiredText();
	}
	return oFF.UiFormSection.FORM_SECTION_VALUE_REQUIRED_TEXT;
};
oFF.UiFormSection.prototype.getValue = function()
{
	return this.m_internalForm.getJsonModel();
};
oFF.UiFormSection.prototype.setValue = function(value) {};
oFF.UiFormSection.prototype.getValueType = function()
{
	return oFF.XValueType.STRUCTURE;
};
oFF.UiFormSection.prototype.isRequired = function()
{
	var isRequired = false;
	var formItemIterator = this.getAllFormItems().getIterator();
	while (formItemIterator.hasNext())
	{
		var tmpFormItem = formItemIterator.next();
		if (tmpFormItem.isRequired())
		{
			isRequired = true;
			break;
		}
	}
	return isRequired;
};
oFF.UiFormSection.prototype.isEmpty = function()
{
	var isEmpty = true;
	var formItemIterator = this.getAllFormItems().getIterator();
	while (formItemIterator.hasNext())
	{
		var tmpFormItem = formItemIterator.next();
		if (!tmpFormItem.isEmpty())
		{
			isEmpty = false;
			break;
		}
	}
	return isEmpty;
};
oFF.UiFormSection.prototype.setEditable = function(editable)
{
	this.m_internalForm.getFormWrapper().setEnabled(editable);
};
oFF.UiFormSection.prototype.focus = function()
{
	if (oFF.notNull(this.m_internalForm) && this.m_internalForm.getAllFormItems().hasElements())
	{
		this.m_internalForm.getAllFormItems().get(0).focus();
	}
};
oFF.UiFormSection.prototype.showSectionMarker = function(showSectionMarker)
{
	this.m_showSectionMarker = showSectionMarker;
	this.showSectionMarkerInternal(showSectionMarker, oFF.UiTheme.getCurrentTheme().getLightGrayColor());
};
oFF.UiFormSection.prototype.getAllFormItems = function()
{
	return this.m_internalForm.getAllFormItems();
};
oFF.UiFormSection.prototype.getFormItemByKey = function(key)
{
	return this.m_internalForm.getFormItemByKey(key);
};
oFF.UiFormSection.prototype.removeFormItemByKey = function(key)
{
	return this.m_internalForm.removeFormItemByKey(key);
};
oFF.UiFormSection.prototype.hasFormItems = function()
{
	return this.m_internalForm.hasFormItems();
};
oFF.UiFormSection.prototype.clearFormItems = function()
{
	this.m_internalForm.clearFormItems();
};
oFF.UiFormSection.prototype.addInput = function(key, value, text, isRequired, placeholder, inputType)
{
	return this.m_internalForm.addInput(key, value, text, isRequired, placeholder, inputType);
};
oFF.UiFormSection.prototype.addSwitch = function(key, value, text)
{
	return this.m_internalForm.addSwitch(key, value, text);
};
oFF.UiFormSection.prototype.addDropdown = function(key, value, text, isRequired, dropdownItems, addEmptyItem)
{
	return this.m_internalForm.addDropdown(key, value, text, isRequired, dropdownItems, addEmptyItem);
};
oFF.UiFormSection.prototype.addFormSection = function(key, text, isHorizontal)
{
	return this.m_internalForm.addFormSection(key, text, isHorizontal);
};
oFF.UiFormSection.prototype.addFormButton = function(name, text, tooltip, icon, pressProcedure)
{
	return this.m_internalForm.addFormButton(name, text, tooltip, icon, pressProcedure);
};
oFF.UiFormSection.prototype.addFormLabel = function(name, text, tooltip)
{
	return this.m_internalForm.addFormLabel(name, text, tooltip);
};
oFF.UiFormSection.prototype.isSection = function()
{
	return true;
};
oFF.UiFormSection.prototype.showSectionMarkerInternal = function(showMarker, borderColor)
{
	if (showMarker)
	{
		this.getFormControl().setBorderStyle(oFF.UiBorderStyle.SOLID);
		this.getFormControl().setBorderWidth(oFF.UiCssBoxEdges.create("0px 0px 0px 2px"));
		this.getFormControl().setBorderColor(borderColor);
		this.getFormControl().setPadding(oFF.UiCssBoxEdges.create("0px 0px 0px 5px"));
	}
	else
	{
		this.getFormControl().setBorderStyle(null);
		this.getFormControl().setBorderWidth(null);
		this.getFormControl().setBorderColor(null);
		this.getFormControl().setPadding(null);
	}
};
oFF.UiFormSection.prototype.onFormEnteredPressed = function(form)
{
	this.notifyEnterPressed();
};
oFF.UiFormSection.prototype.onFormModelChanged = function(form, model)
{
	this.notifyValueChanged();
};

oFF.UiInfoDialog = function() {};
oFF.UiInfoDialog.prototype = new oFF.DfAppDialog();
oFF.UiInfoDialog.prototype._ff_c = "UiInfoDialog";

oFF.UiInfoDialog.staticSetup = function()
{
	oFF.UiAppDialogFactory.registerFactory("info", new oFF.UiInfoDialog());
	oFF.UiAppDialogFactory.registerFactory("variablescreen", new oFF.UiInfoDialog());
};
oFF.UiInfoDialog.prototype.newAppDialog = function(uiManager, name)
{
	var dialog = new oFF.UiInfoDialog();
	dialog.setupDialog(uiManager, name);
	return dialog;
};
oFF.UiInfoDialog.prototype.setDataProvider = function(name)
{
	oFF.XLogger.println(name);
	return this;
};
oFF.UiInfoDialog.prototype.open = function()
{
	var theDialog = this.getUiManager().newBasicControl(oFF.UiType.DIALOG, null, null, "MyDialog");
	theDialog.setTitle(this.getName());
	theDialog.open();
	return this;
};

oFF.DfUiManagerGeneric = function() {};
oFF.DfUiManagerGeneric.prototype = new oFF.DfSubSystem();
oFF.DfUiManagerGeneric.prototype._ff_c = "DfUiManagerGeneric";

oFF.DfUiManagerGeneric.prototype.m_anchorContainers = null;
oFF.DfUiManagerGeneric.prototype.m_uiElementsByName = null;
oFF.DfUiManagerGeneric.prototype.m_uiElementsByType = null;
oFF.DfUiManagerGeneric.prototype.m_freeGenesis = null;
oFF.DfUiManagerGeneric.prototype.setupSessionContext = function(session)
{
	oFF.DfSubSystem.prototype.setupProcessContext.call( this , session);
	this.m_anchorContainers = oFF.XHashMapByString.create();
	this.m_uiElementsByName = oFF.XHashMapByString.create();
	this.m_uiElementsByType = oFF.XHashMapByString.create();
};
oFF.DfUiManagerGeneric.prototype.releaseObject = function()
{
	this.m_anchorContainers = oFF.XObjectExt.release(this.m_anchorContainers);
	if (oFF.notNull(this.m_uiElementsByName))
	{
		this.m_uiElementsByName.clear();
		oFF.XObjectExt.release(this.m_uiElementsByName);
		this.m_uiElementsByName = null;
	}
	if (oFF.notNull(this.m_uiElementsByType))
	{
		this.m_uiElementsByType.clear();
		oFF.XObjectExt.release(this.m_uiElementsByType);
		this.m_uiElementsByType = null;
	}
	this.m_freeGenesis = oFF.XObjectExt.release(this.m_freeGenesis);
	oFF.DfSubSystem.prototype.releaseObject.call( this );
};
oFF.DfUiManagerGeneric.prototype.getLogLayer = function()
{
	return oFF.OriginLayer.APPLICATION;
};
oFF.DfUiManagerGeneric.prototype.getSubSystemType = function()
{
	return oFF.SubSystemType.GUI;
};
oFF.DfUiManagerGeneric.prototype.invokeOnEventingThread = function(code)
{
	code.initializeUi(this);
};
oFF.DfUiManagerGeneric.prototype.getAnchor = function()
{
	var name = null;
	if (this.m_anchorContainers.size() > 0)
	{
		name = this.m_anchorContainers.getKeysAsReadOnlyListOfString().get(0);
	}
	return this.getAnchorByName(name);
};
oFF.DfUiManagerGeneric.prototype.getAnchorByName = function(name)
{
	var anchorContainer = null;
	var anchorContext = null;
	if (oFF.notNull(name))
	{
		anchorContainer = this.m_anchorContainers.getByKey(name);
	}
	if (oFF.notNull(anchorContainer))
	{
		anchorContext = anchorContainer.getAnchor();
		if (oFF.isNull(anchorContext))
		{
			anchorContext = this.newAnchorContext(anchorContainer.getNativeAnchorId());
			anchorContainer.setAnchor(anchorContext);
		}
	}
	return anchorContext;
};
oFF.DfUiManagerGeneric.prototype.newAnchorContext = function(originId)
{
	var wrapperId = this.getAnchorWrapperId(originId);
	return this.newBasicControl(oFF.UiType.ROOT, null, wrapperId, wrapperId);
};
oFF.DfUiManagerGeneric.prototype.getAnchorWrapperId = function(originId)
{
	var buffer = oFF.XStringBuffer.create();
	if (oFF.notNull(originId))
	{
		buffer.append(originId);
		buffer.append("_");
	}
	buffer.append("root_");
	buffer.append(oFF.XSha1.createSHA1(oFF.XGuid.getGuid()));
	return buffer.toString();
};
oFF.DfUiManagerGeneric.prototype.setAnchor = oFF.noSupport;
oFF.DfUiManagerGeneric.prototype.setNativeAnchor = function(name, nativeAnchorId, nativeAnchorObject)
{
	if (oFF.notNull(name))
	{
		var root = oFF.UiAnchorContainer.create(name, nativeAnchorId, nativeAnchorObject);
		this.m_anchorContainers.put(name, root);
	}
};
oFF.DfUiManagerGeneric.prototype.getNativeAnchorId = function()
{
	var firstHookId = null;
	if (this.m_anchorContainers.size() > 0)
	{
		firstHookId = this.m_anchorContainers.getValuesAsReadOnlyList().get(0).getNativeAnchorId();
	}
	return firstHookId;
};
oFF.DfUiManagerGeneric.prototype.getNativeAnchorObject = function()
{
	var firstNativeAnchorObject = null;
	if (this.m_anchorContainers.size() > 0)
	{
		firstNativeAnchorObject = this.m_anchorContainers.getValuesAsReadOnlyList().get(0).getNativeAnchorObject();
	}
	return firstNativeAnchorObject;
};
oFF.DfUiManagerGeneric.prototype.newControlExt = function(uiType, styleClass, identifier, name, parent, operation, position, firstIndex, secondIndex)
{
	var theUiType = uiType;
	var theStyleClass = styleClass;
	if (oFF.notNull(parent))
	{
		if (oFF.isNull(theUiType))
		{
			theUiType = parent.getDefaultItemType();
			if (oFF.isNull(theStyleClass))
			{
				theStyleClass = parent.getUiStyleClass();
			}
		}
	}
	var retContext = null;
	if (oFF.notNull(theUiType))
	{
		retContext = this.newBasicControl(theUiType, theStyleClass, identifier, name);
		if (oFF.notNull(parent) && oFF.notNull(position) && oFF.notNull(operation))
		{
			parent.attach(retContext, operation, position, firstIndex, secondIndex);
		}
	}
	return retContext;
};
oFF.DfUiManagerGeneric.prototype.newControl = function(uiType)
{
	return this.newBasicControl(uiType, null, null, null);
};
oFF.DfUiManagerGeneric.prototype.newBasicControl = function(uiType, styleClass, identifier, name)
{
	var control = null;
	if (oFF.notNull(uiType))
	{
		var theStyleClass = styleClass;
		if (oFF.isNull(theStyleClass))
		{
			theStyleClass = this.getStyleClass(uiType);
		}
		var factory = uiType.getFactory(theStyleClass);
		if (oFF.notNull(factory))
		{
			var theIdentifier = identifier;
			if (oFF.XStringUtils.isNullOrEmpty(theIdentifier))
			{
				theIdentifier = this.generateIdWithType(uiType);
			}
			control = factory.newInstance();
			if (oFF.notNull(control))
			{
				control.prepare(this, uiType, theStyleClass, theIdentifier, name);
				control.initializeNative();
				this.addSelectableElement(control);
				this.doMasterPostprocessing(control);
			}
			else
			{
				this.logError2("Cannot create managed instance of UiType ", uiType.getName());
			}
		}
		else
		{
			this.logError2("Cannot create factory of UiType ", uiType.getName());
		}
	}
	return control;
};
oFF.DfUiManagerGeneric.prototype.getGenesis = function()
{
	var genesis = null;
	var anchor = this.getAnchor();
	if (oFF.notNull(anchor))
	{
		genesis = oFF.UiGenesis.create(anchor, oFF.UiItemPosition.CONTENT, oFF.UiOperation.SET, 0, 0);
	}
	return genesis;
};
oFF.DfUiManagerGeneric.prototype.getFreeGenesis = function()
{
	if (oFF.isNull(this.m_freeGenesis))
	{
		this.m_freeGenesis = oFF.UiFreeGenesis.create(this);
	}
	return this.m_freeGenesis;
};
oFF.DfUiManagerGeneric.prototype.addSelectableElement = function(uiElement)
{
	var name = uiElement.getName();
	if (oFF.notNull(name))
	{
		this.m_uiElementsByName.put(name, uiElement);
	}
	var type = uiElement.getUiType().getName();
	var elements = this.m_uiElementsByType.getByKey(type);
	if (oFF.isNull(elements))
	{
		elements = oFF.XList.create();
		this.m_uiElementsByType.put(type, elements);
	}
	elements.add(uiElement);
	this.addSelectableElementMaster(uiElement);
};
oFF.DfUiManagerGeneric.prototype.updateSelectableElementName = function(uiElement, oldName, newName)
{
	if (oFF.notNull(oldName))
	{
		this.m_uiElementsByName.remove(oldName);
	}
	if (oFF.notNull(newName))
	{
		this.m_uiElementsByName.put(newName, uiElement);
	}
};
oFF.DfUiManagerGeneric.prototype.removeSelectableElement = function(uiElement)
{
	var name = uiElement.getName();
	if (oFF.notNull(name))
	{
		this.m_uiElementsByName.remove(name);
	}
	var type = uiElement.getUiType().getName();
	var elements = this.m_uiElementsByType.getByKey(type);
	if (oFF.notNull(elements))
	{
		elements.removeElement(uiElement);
	}
	this.removeSelectableElementMaster(uiElement);
};
oFF.DfUiManagerGeneric.prototype.selectProviderComponents = function(operation, defaultDomain, contextObject, maximumCount)
{
	var components = oFF.XList.create();
	if (operation.getDomain() === oFF.SigSelDomain.DIALOG)
	{
		var dialog = oFF.UiAppDialogFactory.create(this, operation.getName());
		if (oFF.notNull(dialog))
		{
			components.add(dialog);
		}
	}
	else
	{
		var operationType = operation.getOperationType();
		if (operationType === oFF.SigSelType.MATCH_NAME)
		{
			var name = operation.getName();
			var element = this.m_uiElementsByName.getByKey(name);
			if (oFF.notNull(element))
			{
				components.add(element);
			}
		}
		else if (operationType === oFF.SigSelType.MATCH)
		{
			var selectedComponentType = operation.getSelectedComponentType();
			if (oFF.notNull(selectedComponentType))
			{
				var selectedElements = this.m_uiElementsByType.getByKey(selectedComponentType.getName());
				if (oFF.notNull(selectedElements))
				{
					var size = selectedElements.size();
					if (maximumCount !== -1 && size > maximumCount)
					{
						size = maximumCount;
					}
					for (var i = 0; i < size; i++)
					{
						components.add(selectedElements.get(i));
					}
				}
			}
		}
		else if (oFF.notNull(contextObject))
		{
			components.add(contextObject);
		}
	}
	return components;
};
oFF.DfUiManagerGeneric.prototype.getSelector = function()
{
	return this.getSession().getSelector();
};
oFF.DfUiManagerGeneric.prototype.getSigSelProviderSelector = function()
{
	return this;
};
oFF.DfUiManagerGeneric.prototype.select = function(sigSelExpression)
{
	var parser = oFF.SigSelParser.create();
	var result = parser.parse(sigSelExpression);
	var set = oFF.UiContextSpace.create(this);
	if (result.isValid())
	{
		var opList = result.getData();
		for (var i = 0; i < opList.size(); i++)
		{
			var operation = opList.get(i);
			var elements = this.selectProviderComponents(operation, null, null, -1);
			for (var k = 0; k < elements.size(); k++)
			{
				var currentContext = elements.get(k);
				set.addToSpace(currentContext);
			}
		}
	}
	return set;
};
oFF.DfUiManagerGeneric.prototype.setTheme = function(themeName, themeBaseUrl) {};

oFF.UiClientPropAlignContent = function() {};
oFF.UiClientPropAlignContent.prototype = new oFF.UiClientOperationConst();
oFF.UiClientPropAlignContent.prototype._ff_c = "UiClientPropAlignContent";

oFF.UiClientPropAlignContent.prototype.setString = function(target, value)
{
	var alignContent = null;
	if (oFF.notNull(value))
	{
		alignContent = oFF.UiFlexAlignContent.lookup(value);
	}
	target.setAlignContent(alignContent);
};
oFF.UiClientPropAlignContent.prototype.getConstantValue = function(source)
{
	return source.getAlignContent();
};
oFF.UiClientPropAlignContent.prototype.resolveConstant = function(value)
{
	return oFF.UiFlexAlignContent.lookup(value);
};

oFF.UiClientPropAlignItems = function() {};
oFF.UiClientPropAlignItems.prototype = new oFF.UiClientOperationConst();
oFF.UiClientPropAlignItems.prototype._ff_c = "UiClientPropAlignItems";

oFF.UiClientPropAlignItems.prototype.setString = function(target, value)
{
	var alignItems = null;
	if (oFF.notNull(value))
	{
		alignItems = oFF.UiFlexAlignItems.lookup(value);
	}
	target.setAlignItems(alignItems);
};
oFF.UiClientPropAlignItems.prototype.getConstantValue = function(source)
{
	return source.getAlignItems();
};
oFF.UiClientPropAlignItems.prototype.resolveConstant = function(value)
{
	return oFF.UiFlexAlignItems.lookup(value);
};

oFF.UiClientPropAlignSelf = function() {};
oFF.UiClientPropAlignSelf.prototype = new oFF.UiClientOperationConst();
oFF.UiClientPropAlignSelf.prototype._ff_c = "UiClientPropAlignSelf";

oFF.UiClientPropAlignSelf.prototype.setString = function(target, value)
{
	var alignSelf = null;
	if (oFF.notNull(value))
	{
		alignSelf = oFF.UiFlexAlignSelf.lookup(value);
	}
	target.setAlignSelf(alignSelf);
};
oFF.UiClientPropAlignSelf.prototype.getConstantValue = function(source)
{
	return source.getAlignSelf();
};
oFF.UiClientPropAlignSelf.prototype.resolveConstant = function(value)
{
	return oFF.UiFlexAlignSelf.lookup(value);
};

oFF.UiClientPropBorderStyle = function() {};
oFF.UiClientPropBorderStyle.prototype = new oFF.UiClientOperationConst();
oFF.UiClientPropBorderStyle.prototype._ff_c = "UiClientPropBorderStyle";

oFF.UiClientPropBorderStyle.prototype.setString = function(target, value)
{
	var borderStyle = null;
	if (oFF.notNull(value))
	{
		borderStyle = oFF.UiBorderStyle.lookup(value);
	}
	target.setBorderStyle(borderStyle);
};
oFF.UiClientPropBorderStyle.prototype.getConstantValue = function(source)
{
	return source.getBorderStyle();
};
oFF.UiClientPropBorderStyle.prototype.resolveConstant = function(value)
{
	return oFF.UiBorderStyle.lookup(value);
};

oFF.UiClientPropButtonType = function() {};
oFF.UiClientPropButtonType.prototype = new oFF.UiClientOperationConst();
oFF.UiClientPropButtonType.prototype._ff_c = "UiClientPropButtonType";

oFF.UiClientPropButtonType.prototype.setString = function(target, value)
{
	var buttonType = null;
	if (oFF.notNull(value))
	{
		buttonType = oFF.UiButtonType.lookup(value);
	}
	target.setButtonType(buttonType);
};
oFF.UiClientPropButtonType.prototype.getConstantValue = function(source)
{
	return source.getButtonType();
};
oFF.UiClientPropButtonType.prototype.resolveConstant = function(value)
{
	return oFF.UiButtonType.lookup(value);
};

oFF.UiClientPropDirection = function() {};
oFF.UiClientPropDirection.prototype = new oFF.UiClientOperationConst();
oFF.UiClientPropDirection.prototype._ff_c = "UiClientPropDirection";

oFF.UiClientPropDirection.prototype.setString = function(target, value)
{
	var direction = null;
	if (oFF.notNull(value))
	{
		direction = oFF.UiFlexDirection.lookup(value);
	}
	target.setDirection(direction);
};
oFF.UiClientPropDirection.prototype.getConstantValue = function(source)
{
	return source.getDirection();
};
oFF.UiClientPropDirection.prototype.resolveConstant = function(value)
{
	return oFF.UiFlexDirection.lookup(value);
};

oFF.UiClientPropFontStyle = function() {};
oFF.UiClientPropFontStyle.prototype = new oFF.UiClientOperationConst();
oFF.UiClientPropFontStyle.prototype._ff_c = "UiClientPropFontStyle";

oFF.UiClientPropFontStyle.prototype.setString = function(target, value)
{
	var theConstant = null;
	if (oFF.notNull(value))
	{
		theConstant = oFF.UiFontStyle.lookup(value);
	}
	target.setFontStyle(theConstant);
};
oFF.UiClientPropFontStyle.prototype.getConstantValue = function(source)
{
	return source.getFontStyle();
};
oFF.UiClientPropFontStyle.prototype.resolveConstant = function(value)
{
	return oFF.UiFontStyle.lookup(value);
};

oFF.UiClientPropFontWeight = function() {};
oFF.UiClientPropFontWeight.prototype = new oFF.UiClientOperationConst();
oFF.UiClientPropFontWeight.prototype._ff_c = "UiClientPropFontWeight";

oFF.UiClientPropFontWeight.prototype.setString = function(target, value)
{
	var theConstant = null;
	if (oFF.notNull(value))
	{
		theConstant = oFF.UiFontWeight.lookup(value);
	}
	target.setFontWeight(theConstant);
};
oFF.UiClientPropFontWeight.prototype.getConstantValue = function(source)
{
	return source.getFontWeight();
};
oFF.UiClientPropFontWeight.prototype.resolveConstant = function(value)
{
	return oFF.UiFontWeight.lookup(value);
};

oFF.UiClientPropFrameType = function() {};
oFF.UiClientPropFrameType.prototype = new oFF.UiClientOperationConst();
oFF.UiClientPropFrameType.prototype._ff_c = "UiClientPropFrameType";

oFF.UiClientPropFrameType.prototype.setString = function(target, value)
{
	var frameType = null;
	if (oFF.notNull(value))
	{
		frameType = oFF.UiFrameType.lookup(value);
	}
	target.setFrameType(frameType);
};
oFF.UiClientPropFrameType.prototype.getConstantValue = function(source)
{
	return source.getFrameType();
};
oFF.UiClientPropFrameType.prototype.resolveConstant = function(value)
{
	return oFF.UiFrameType.lookup(value);
};

oFF.UiClientPropHeaderMode = function() {};
oFF.UiClientPropHeaderMode.prototype = new oFF.UiClientOperationConst();
oFF.UiClientPropHeaderMode.prototype._ff_c = "UiClientPropHeaderMode";

oFF.UiClientPropHeaderMode.prototype.setString = function(target, value)
{
	var headerMode = null;
	if (oFF.notNull(value))
	{
		headerMode = oFF.UiIconTabBarHeaderMode.lookup(value);
	}
	target.setHeaderMode(headerMode);
};
oFF.UiClientPropHeaderMode.prototype.getConstantValue = function(source)
{
	return source.getHeaderMode();
};
oFF.UiClientPropHeaderMode.prototype.resolveConstant = function(value)
{
	return oFF.UiIconTabBarHeaderMode.lookup(value);
};

oFF.UiClientPropHighlight = function() {};
oFF.UiClientPropHighlight.prototype = new oFF.UiClientOperationConst();
oFF.UiClientPropHighlight.prototype._ff_c = "UiClientPropHighlight";

oFF.UiClientPropHighlight.prototype.setString = function(target, value)
{
	var messageType = null;
	if (oFF.notNull(value))
	{
		messageType = oFF.UiMessageType.lookup(value);
	}
	target.setHighlight(messageType);
};
oFF.UiClientPropHighlight.prototype.getConstantValue = function(source)
{
	return source.getHighlight();
};
oFF.UiClientPropHighlight.prototype.resolveConstant = function(value)
{
	return oFF.UiMessageType.lookup(value);
};

oFF.UiClientPropInputType = function() {};
oFF.UiClientPropInputType.prototype = new oFF.UiClientOperationConst();
oFF.UiClientPropInputType.prototype._ff_c = "UiClientPropInputType";

oFF.UiClientPropInputType.prototype.setString = function(target, value)
{
	var inputType = null;
	if (oFF.notNull(value))
	{
		inputType = oFF.UiInputType.lookup(value);
	}
	target.setInputType(inputType);
};
oFF.UiClientPropInputType.prototype.getConstantValue = function(source)
{
	return source.getInputType();
};
oFF.UiClientPropInputType.prototype.resolveConstant = function(value)
{
	return oFF.UiInputType.lookup(value);
};

oFF.UiClientPropJustifyContent = function() {};
oFF.UiClientPropJustifyContent.prototype = new oFF.UiClientOperationConst();
oFF.UiClientPropJustifyContent.prototype._ff_c = "UiClientPropJustifyContent";

oFF.UiClientPropJustifyContent.prototype.setString = function(target, value)
{
	var justifyContent = null;
	if (oFF.notNull(value))
	{
		justifyContent = oFF.UiFlexJustifyContent.lookup(value);
	}
	target.setJustifyContent(justifyContent);
};
oFF.UiClientPropJustifyContent.prototype.getConstantValue = function(source)
{
	return source.getJustifyContent();
};
oFF.UiClientPropJustifyContent.prototype.resolveConstant = function(value)
{
	return oFF.UiFlexJustifyContent.lookup(value);
};

oFF.UiClientPropListItemType = function() {};
oFF.UiClientPropListItemType.prototype = new oFF.UiClientOperationConst();
oFF.UiClientPropListItemType.prototype._ff_c = "UiClientPropListItemType";

oFF.UiClientPropListItemType.prototype.setString = function(target, value)
{
	var listType = null;
	if (oFF.notNull(value))
	{
		listType = oFF.UiListType.lookup(value);
	}
	target.setListItemType(listType);
};
oFF.UiClientPropListItemType.prototype.getConstantValue = function(source)
{
	return source.getListItemType();
};
oFF.UiClientPropListItemType.prototype.resolveConstant = function(value)
{
	return oFF.UiListType.lookup(value);
};

oFF.UiClientPropLoadState = function() {};
oFF.UiClientPropLoadState.prototype = new oFF.UiClientOperationConst();
oFF.UiClientPropLoadState.prototype._ff_c = "UiClientPropLoadState";

oFF.UiClientPropLoadState.prototype.setString = function(target, value)
{
	var loadState = null;
	if (oFF.notNull(value))
	{
		loadState = oFF.UiLoadState.lookup(value);
	}
	target.setLoadState(loadState);
};
oFF.UiClientPropLoadState.prototype.getConstantValue = function(source)
{
	return source.getLoadState();
};
oFF.UiClientPropLoadState.prototype.resolveConstant = function(value)
{
	return oFF.UiLoadState.lookup(value);
};

oFF.UiClientPropMessageType = function() {};
oFF.UiClientPropMessageType.prototype = new oFF.UiClientOperationConst();
oFF.UiClientPropMessageType.prototype._ff_c = "UiClientPropMessageType";

oFF.UiClientPropMessageType.prototype.setString = function(target, value)
{
	var messageType = null;
	if (oFF.notNull(value))
	{
		messageType = oFF.UiMessageType.lookup(value);
	}
	target.setMessageType(messageType);
};
oFF.UiClientPropMessageType.prototype.getConstantValue = function(source)
{
	return source.getMessageType();
};
oFF.UiClientPropMessageType.prototype.resolveConstant = function(value)
{
	return oFF.UiMessageType.lookup(value);
};

oFF.UiClientPropOverflow = function() {};
oFF.UiClientPropOverflow.prototype = new oFF.UiClientOperationConst();
oFF.UiClientPropOverflow.prototype._ff_c = "UiClientPropOverflow";

oFF.UiClientPropOverflow.prototype.setString = function(target, value)
{
	var overflow = null;
	if (oFF.notNull(value))
	{
		overflow = oFF.UiOverflow.lookup(value);
	}
	target.setOverflow(overflow);
};
oFF.UiClientPropOverflow.prototype.getConstantValue = function(source)
{
	return source.getOverflow();
};
oFF.UiClientPropOverflow.prototype.resolveConstant = function(value)
{
	return oFF.UiOverflow.lookup(value);
};

oFF.UiClientPropPlacement = function() {};
oFF.UiClientPropPlacement.prototype = new oFF.UiClientOperationConst();
oFF.UiClientPropPlacement.prototype._ff_c = "UiClientPropPlacement";

oFF.UiClientPropPlacement.prototype.setString = function(target, value)
{
	var placementType = null;
	if (oFF.notNull(value))
	{
		placementType = oFF.UiPlacementType.lookup(value);
	}
	target.setPlacement(placementType);
};
oFF.UiClientPropPlacement.prototype.getConstantValue = function(source)
{
	return source.getPlacement();
};
oFF.UiClientPropPlacement.prototype.resolveConstant = function(value)
{
	return oFF.UiPlacementType.lookup(value);
};

oFF.UiClientPropSelectionBehavior = function() {};
oFF.UiClientPropSelectionBehavior.prototype = new oFF.UiClientOperationConst();
oFF.UiClientPropSelectionBehavior.prototype._ff_c = "UiClientPropSelectionBehavior";

oFF.UiClientPropSelectionBehavior.prototype.setString = function(target, value)
{
	var selectionBehaviorValue = null;
	if (oFF.notNull(value))
	{
		selectionBehaviorValue = oFF.UiSelectionBehavior.lookup(value);
	}
	target.setSelectionBehavior(selectionBehaviorValue);
};
oFF.UiClientPropSelectionBehavior.prototype.getConstantValue = function(source)
{
	return source.getSelectionBehavior();
};
oFF.UiClientPropSelectionBehavior.prototype.resolveConstant = function(value)
{
	return oFF.UiSelectionBehavior.lookup(value);
};

oFF.UiClientPropSelectionMode = function() {};
oFF.UiClientPropSelectionMode.prototype = new oFF.UiClientOperationConst();
oFF.UiClientPropSelectionMode.prototype._ff_c = "UiClientPropSelectionMode";

oFF.UiClientPropSelectionMode.prototype.setString = function(target, value)
{
	var selectionModeValue = null;
	if (oFF.notNull(value))
	{
		selectionModeValue = oFF.UiSelectionMode.lookup(value);
	}
	target.setSelectionMode(selectionModeValue);
};
oFF.UiClientPropSelectionMode.prototype.getConstantValue = function(source)
{
	return source.getSelectionMode();
};
oFF.UiClientPropSelectionMode.prototype.resolveConstant = function(value)
{
	return oFF.UiSelectionMode.lookup(value);
};

oFF.UiClientPropState = function() {};
oFF.UiClientPropState.prototype = new oFF.UiClientOperationConst();
oFF.UiClientPropState.prototype._ff_c = "UiClientPropState";

oFF.UiClientPropState.prototype.setString = function(target, value)
{
	var valueState = null;
	if (oFF.notNull(value))
	{
		valueState = oFF.UiValueState.lookup(value);
	}
	target.setState(valueState);
};
oFF.UiClientPropState.prototype.getConstantValue = function(source)
{
	return source.getState();
};
oFF.UiClientPropState.prototype.resolveConstant = function(value)
{
	return oFF.UiValueState.lookup(value);
};

oFF.UiClientPropTextAlign = function() {};
oFF.UiClientPropTextAlign.prototype = new oFF.UiClientOperationConst();
oFF.UiClientPropTextAlign.prototype._ff_c = "UiClientPropTextAlign";

oFF.UiClientPropTextAlign.prototype.setString = function(target, value)
{
	var textAlign = oFF.UiTextAlign.lookup(value);
	if (oFF.notNull(textAlign))
	{
		target.setTextAlign(textAlign);
	}
};
oFF.UiClientPropTextAlign.prototype.getConstantValue = function(source)
{
	return source.getTextAlign();
};
oFF.UiClientPropTextAlign.prototype.resolveConstant = function(value)
{
	return oFF.UiTextAlign.lookup(value);
};

oFF.UiClientPropTileMode = function() {};
oFF.UiClientPropTileMode.prototype = new oFF.UiClientOperationConst();
oFF.UiClientPropTileMode.prototype._ff_c = "UiClientPropTileMode";

oFF.UiClientPropTileMode.prototype.setString = function(target, value)
{
	var tileMode = null;
	if (oFF.notNull(value))
	{
		tileMode = oFF.UiTileMode.lookup(value);
	}
	target.setTileMode(tileMode);
};
oFF.UiClientPropTileMode.prototype.getConstantValue = function(source)
{
	return source.getTileMode();
};
oFF.UiClientPropTileMode.prototype.resolveConstant = function(value)
{
	return oFF.UiTileMode.lookup(value);
};

oFF.UiClientPropValueState = function() {};
oFF.UiClientPropValueState.prototype = new oFF.UiClientOperationConst();
oFF.UiClientPropValueState.prototype._ff_c = "UiClientPropValueState";

oFF.UiClientPropValueState.prototype.setString = function(target, value)
{
	var valueState = null;
	if (oFF.notNull(value))
	{
		valueState = oFF.UiValueState.lookup(value);
	}
	target.setValueState(valueState);
};
oFF.UiClientPropValueState.prototype.getConstantValue = function(source)
{
	return source.getValueState();
};
oFF.UiClientPropValueState.prototype.resolveConstant = function(value)
{
	return oFF.UiValueState.lookup(value);
};

oFF.UiClientPropVisibleRowCountMode = function() {};
oFF.UiClientPropVisibleRowCountMode.prototype = new oFF.UiClientOperationConst();
oFF.UiClientPropVisibleRowCountMode.prototype._ff_c = "UiClientPropVisibleRowCountMode";

oFF.UiClientPropVisibleRowCountMode.prototype.setString = function(target, value)
{
	var visibleRowcountMode = oFF.UiVisibleRowCountMode.lookup(value);
	if (oFF.notNull(visibleRowcountMode))
	{
		target.setVisibleRowCountMode(visibleRowcountMode);
	}
};
oFF.UiClientPropVisibleRowCountMode.prototype.getConstantValue = function(source)
{
	return source.getVisibleRowCountMode();
};
oFF.UiClientPropVisibleRowCountMode.prototype.resolveConstant = function(value)
{
	return oFF.UiVisibleRowCountMode.lookup(value);
};

oFF.UiClientPropWrap = function() {};
oFF.UiClientPropWrap.prototype = new oFF.UiClientOperationConst();
oFF.UiClientPropWrap.prototype._ff_c = "UiClientPropWrap";

oFF.UiClientPropWrap.prototype.setString = function(target, value)
{
	var wrap = null;
	if (oFF.notNull(value))
	{
		wrap = oFF.UiFlexWrap.lookup(value);
	}
	target.setWrap(wrap);
};
oFF.UiClientPropWrap.prototype.getConstantValue = function(source)
{
	return source.getWrap();
};
oFF.UiClientPropWrap.prototype.resolveConstant = function(value)
{
	return oFF.UiFlexWrap.lookup(value);
};

oFF.UiBaseConstant = function() {};
oFF.UiBaseConstant.prototype = new oFF.XConstantWithParent();
oFF.UiBaseConstant.prototype._ff_c = "UiBaseConstant";

oFF.UiBaseConstant.createUiBaseConstant = function(a, name, lookup)
{
	return oFF.UiBaseConstant.createUiBaseConstantExt(a, name, lookup, null);
};
oFF.UiBaseConstant.createUiBaseConstantExt = function(a, name, lookup, parent)
{
	if (oFF.XStringUtils.isNullOrEmpty(name))
	{
		throw oFF.XException.createIllegalArgumentException("Missing name, you cannot create a UiBaseConstant without a name!");
	}
	a.setupExt(name, parent);
	if (oFF.notNull(lookup))
	{
		if (lookup.containsKey(name))
		{
			throw oFF.XException.createIllegalArgumentException(oFF.XStringUtils.concatenate2("UiBaseConstant already exists: ", name));
		}
		lookup.put(oFF.XString.toLowerCase(name), a);
	}
	return a;
};
oFF.UiBaseConstant.lookupConstant = function(name, lookup)
{
	var valueLower = oFF.XString.toLowerCase(name);
	return lookup.getByKey(valueLower);
};

oFF.UiAbstractConstant = function() {};
oFF.UiAbstractConstant.prototype = new oFF.XConstantWithParent();
oFF.UiAbstractConstant.prototype._ff_c = "UiAbstractConstant";

oFF.UiAbstractConstant.createUiConstant = function(a, name, lookup)
{
	return oFF.UiAbstractConstant.createUiConstantExt(a, name, null, null, lookup, null);
};
oFF.UiAbstractConstant.createUiConstantExt = function(a, name, documentName, cssValue, lookup, parent)
{
	var b = a;
	if (oFF.isNull(documentName))
	{
		b.setDocumentName(name);
	}
	else
	{
		b.setDocumentName(documentName);
	}
	b.setCssValue(cssValue);
	b.setupExt(name, parent);
	b.setDisplayName(oFF.XStringUtils.camelCaseToDisplayText(name));
	if (oFF.notNull(lookup))
	{
		if (lookup.containsKey(name))
		{
			throw oFF.XException.createIllegalArgumentException(oFF.XStringUtils.concatenate2("Constant already exists: ", name));
		}
		lookup.put(name, a);
		lookup.put(oFF.XString.toLowerCase(name), a);
		lookup.put(oFF.XString.toUpperCase(name), a);
		if (oFF.notNull(documentName))
		{
			lookup.put(documentName, a);
		}
	}
	return a;
};
oFF.UiAbstractConstant.prototype.m_displayName = null;
oFF.UiAbstractConstant.prototype.m_documentName = null;
oFF.UiAbstractConstant.prototype.m_cssValue = null;
oFF.UiAbstractConstant.prototype.setupExt = function(name, parent)
{
	oFF.XConstantWithParent.prototype.setupExt.call( this , name, parent);
};
oFF.UiAbstractConstant.prototype.getDisplayName = function()
{
	return this.m_displayName;
};
oFF.UiAbstractConstant.prototype.setDisplayName = function(displayName)
{
	this.m_displayName = displayName;
};
oFF.UiAbstractConstant.prototype.getDocumentName = function()
{
	return this.m_documentName;
};
oFF.UiAbstractConstant.prototype.setDocumentName = function(name)
{
	this.m_documentName = name;
};
oFF.UiAbstractConstant.prototype.getCssValue = function()
{
	return this.m_cssValue;
};
oFF.UiAbstractConstant.prototype.setCssValue = function(cssValue)
{
	this.m_cssValue = cssValue;
};

oFF.DfUiManager = function() {};
oFF.DfUiManager.prototype = new oFF.DfUiManagerGeneric();
oFF.DfUiManager.prototype._ff_c = "DfUiManager";

oFF.DfUiManager.prototype.m_styleMap = null;
oFF.DfUiManager.prototype.m_defaultStyleClass = null;
oFF.DfUiManager.prototype.m_deviceInfo = null;
oFF.DfUiManager.prototype.m_isValueTransferActive = false;
oFF.DfUiManager.prototype.m_callLevel = 0;
oFF.DfUiManager.prototype.m_resourceBaseLocation = null;
oFF.DfUiManager.prototype.m_fragment = null;
oFF.DfUiManager.prototype.m_uiIdTypeMap = null;
oFF.DfUiManager.prototype.m_uiElementsById = null;
oFF.DfUiManager.prototype.m_localization = null;
oFF.DfUiManager.prototype.setupSessionContext = function(session)
{
	oFF.DfUiManagerGeneric.prototype.setupSessionContext.call( this , session);
	this.m_defaultStyleClass = oFF.UiStyleClass.DESKTOP;
	this.m_deviceInfo = oFF.UiDeviceInfo.create();
	this.m_uiElementsById = oFF.XHashMapByString.create();
	this.m_styleMap = oFF.XHashMapByString.create();
	this.m_localization = oFF.I18nFactory.newInstance();
	this.m_fragment = oFF.NetworkEnv.getFragment();
	this.m_uiIdTypeMap = oFF.XHashMapByString.create();
};
oFF.DfUiManager.prototype.releaseObject = function()
{
	this.m_resourceBaseLocation = null;
	this.m_defaultStyleClass = null;
	this.m_localization = null;
	if (oFF.notNull(this.m_uiElementsById))
	{
		this.m_uiElementsById.clear();
		oFF.XObjectExt.release(this.m_uiElementsById);
		this.m_uiElementsById = null;
	}
	oFF.DfUiManagerGeneric.prototype.releaseObject.call( this );
};
oFF.DfUiManager.prototype.getLogLayer = function()
{
	return oFF.OriginLayer.APPLICATION;
};
oFF.DfUiManager.prototype.getMaster = function()
{
	return this;
};
oFF.DfUiManager.prototype.shutdown = oFF.noSupport;
oFF.DfUiManager.prototype.generateIdWithType = function(uiType)
{
	var intValue = this.m_uiIdTypeMap.getByKey(uiType.getName());
	if (oFF.isNull(intValue))
	{
		intValue = oFF.XIntegerValue.create(0);
		this.m_uiIdTypeMap.put(uiType.getName(), intValue);
	}
	var idPostfix = oFF.XInteger.convertToString(intValue.getInteger());
	intValue.setInteger(intValue.getInteger() + 1);
	var idValue = oFF.XStringUtils.concatenate3(uiType.getName(), "XId", idPostfix);
	return idValue;
};
oFF.DfUiManager.prototype.getNameDelimiter = function()
{
	return "-";
};
oFF.DfUiManager.prototype.setTimer = oFF.noSupport;
oFF.DfUiManager.prototype.getStyleClass = function(uiType)
{
	var styleClass = this.m_styleMap.getByKey(uiType.getName());
	if (oFF.notNull(styleClass))
	{
		return styleClass;
	}
	return this.m_defaultStyleClass;
};
oFF.DfUiManager.prototype.setStyleClass = function(uiType, styleClass)
{
	this.m_styleMap.put(uiType.getName(), styleClass);
};
oFF.DfUiManager.prototype.setDefaultStyleClass = function(styleClass)
{
	this.m_defaultStyleClass = styleClass;
};
oFF.DfUiManager.prototype.getDefaultStyleClass = function()
{
	return this.m_defaultStyleClass;
};
oFF.DfUiManager.prototype.getDeviceInfo = function()
{
	return this.m_deviceInfo;
};
oFF.DfUiManager.prototype.setDeviceInfo = function(newDeviceInfo)
{
	if (oFF.notNull(newDeviceInfo))
	{
		if (newDeviceInfo.isMobile())
		{
			this.setDefaultStyleClass(oFF.UiStyleClass.MOBILE);
		}
		else
		{
			this.setDefaultStyleClass(oFF.UiStyleClass.DESKTOP);
		}
		this.m_deviceInfo = newDeviceInfo;
	}
};
oFF.DfUiManager.prototype.setFragment = function(fragment)
{
	this.m_fragment = fragment;
	oFF.NetworkEnv.setFragment(fragment);
};
oFF.DfUiManager.prototype.getFragment = function()
{
	return this.m_fragment;
};
oFF.DfUiManager.prototype.startValueTransfer = function()
{
	this.m_isValueTransferActive = true;
};
oFF.DfUiManager.prototype.endValueTransfer = function()
{
	this.m_isValueTransferActive = false;
};
oFF.DfUiManager.prototype.incCallLevel = function()
{
	this.m_callLevel++;
};
oFF.DfUiManager.prototype.decCallLevel = function()
{
	this.m_callLevel--;
};
oFF.DfUiManager.prototype.isExternalCall0 = function()
{
	return this.m_isValueTransferActive === false && this.m_callLevel === 0;
};
oFF.DfUiManager.prototype.isExternalCall1 = function()
{
	return this.m_isValueTransferActive === false && this.m_callLevel === 1;
};
oFF.DfUiManager.prototype.setResourceBaseLocation = function(resourceBaseLocation)
{
	this.m_resourceBaseLocation = resourceBaseLocation;
};
oFF.DfUiManager.prototype.getResourceBaseLocation = function()
{
	return this.m_resourceBaseLocation;
};
oFF.DfUiManager.prototype.getPlatform = function()
{
	return oFF.XPlatform.getPlatform();
};
oFF.DfUiManager.prototype.getLocalization = function()
{
	if (oFF.isNull(this.m_localization))
	{
		this.m_localization = oFF.I18nFactory.newInstance();
	}
	return this.m_localization;
};
oFF.DfUiManager.prototype.doMasterPostprocessing = function(uiElement) {};
oFF.DfUiManager.prototype.addSelectableElementMaster = function(uiElement)
{
	var identifier = uiElement.getId();
	if (oFF.notNull(identifier))
	{
		this.m_uiElementsById.put(identifier, uiElement);
	}
};
oFF.DfUiManager.prototype.removeSelectableElementMaster = function(uiElement)
{
	var identifier = uiElement.getId();
	if (oFF.notNull(identifier))
	{
		this.m_uiElementsById.remove(identifier);
	}
};
oFF.DfUiManager.prototype.selectById = function(identifier)
{
	return this.m_uiElementsById.getByKey(identifier);
};
oFF.DfUiManager.prototype.getSelectableElementCount = function()
{
	return this.m_uiElementsById.size();
};
oFF.DfUiManager.prototype.getSelectableElements = function()
{
	return this.m_uiElementsById.getIterator();
};

oFF.SubSysGuiPrg = function() {};
oFF.SubSysGuiPrg.prototype = new oFF.DfProgramSubSys();
oFF.SubSysGuiPrg.prototype._ff_c = "SubSysGuiPrg";

oFF.SubSysGuiPrg.DEFAULT_PROGRAM_NAME = "@SubSys.Gui";
oFF.SubSysGuiPrg.prototype.m_uiManager = null;
oFF.SubSysGuiPrg.prototype.newProgram = function()
{
	var newObj = new oFF.SubSysGuiPrg();
	newObj.setup();
	return newObj;
};
oFF.SubSysGuiPrg.prototype.getSubSystemType = function()
{
	return oFF.SubSystemType.GUI;
};
oFF.SubSysGuiPrg.prototype.runProcess = function()
{
	var process = this.getProcess();
	this.m_uiManager = oFF.UiManagerFactory.newInstance(process);
	this.activateSubSystem(null, oFF.SubSystemStatus.ACTIVE);
	return false;
};
oFF.SubSysGuiPrg.prototype.getMainApi = function()
{
	return this.m_uiManager;
};

oFF.SubUiManager = function() {};
oFF.SubUiManager.prototype = new oFF.DfUiManagerGeneric();
oFF.SubUiManager.prototype._ff_c = "SubUiManager";

oFF.SubUiManager.create = function(parent, session)
{
	var newObj = new oFF.SubUiManager();
	newObj.setupSessionContext(session);
	newObj.m_parent = parent;
	return newObj;
};
oFF.SubUiManager.prototype.m_parent = null;
oFF.SubUiManager.prototype.releaseObject = function()
{
	this.m_parent = null;
	oFF.DfUiManagerGeneric.prototype.releaseObject.call( this );
};
oFF.SubUiManager.prototype.getMaster = function()
{
	return this.m_parent.getMaster();
};
oFF.SubUiManager.prototype.setTimer = function(milliseconds, listener, customIdentifier)
{
	this.getMaster().setTimer(milliseconds, listener, customIdentifier);
};
oFF.SubUiManager.prototype.shutdown = function()
{
	this.getMaster().shutdown();
};
oFF.SubUiManager.prototype.getNameDelimiter = function()
{
	return this.getMaster().getNameDelimiter();
};
oFF.SubUiManager.prototype.getStyleClass = function(uiType)
{
	return this.getMaster().getStyleClass(uiType);
};
oFF.SubUiManager.prototype.setStyleClass = function(uiType, styleClass)
{
	this.getMaster().setStyleClass(uiType, styleClass);
};
oFF.SubUiManager.prototype.getDefaultStyleClass = function()
{
	return this.getMaster().getDefaultStyleClass();
};
oFF.SubUiManager.prototype.setDefaultStyleClass = function(styleClass)
{
	this.getMaster().setDefaultStyleClass(styleClass);
};
oFF.SubUiManager.prototype.getDeviceInfo = function()
{
	return this.getMaster().getDeviceInfo();
};
oFF.SubUiManager.prototype.setDeviceInfo = function(newDeviceInfo)
{
	this.getMaster().setDeviceInfo(newDeviceInfo);
};
oFF.SubUiManager.prototype.setResourceBaseLocation = function(resourceBaseLocation)
{
	this.getMaster().setResourceBaseLocation(resourceBaseLocation);
};
oFF.SubUiManager.prototype.getResourceBaseLocation = function()
{
	return this.getMaster().getResourceBaseLocation();
};
oFF.SubUiManager.prototype.getFragment = function()
{
	return this.getMaster().getFragment();
};
oFF.SubUiManager.prototype.setFragment = function(fragment)
{
	this.getMaster().setFragment(fragment);
};
oFF.SubUiManager.prototype.generateIdWithType = function(uiType)
{
	return this.getMaster().generateIdWithType(uiType);
};
oFF.SubUiManager.prototype.getPlatform = function()
{
	return this.getMaster().getPlatform();
};
oFF.SubUiManager.prototype.getLocalization = function()
{
	return this.getMaster().getLocalization();
};
oFF.SubUiManager.prototype.incCallLevel = function()
{
	this.getMaster().incCallLevel();
};
oFF.SubUiManager.prototype.decCallLevel = function()
{
	this.getMaster().decCallLevel();
};
oFF.SubUiManager.prototype.isExternalCall1 = function()
{
	return this.getMaster().isExternalCall1();
};
oFF.SubUiManager.prototype.doMasterPostprocessing = function(uiElement)
{
	this.getMaster().doMasterPostprocessing(uiElement);
};
oFF.SubUiManager.prototype.addSelectableElementMaster = function(uiElement)
{
	this.getMaster().addSelectableElementMaster(uiElement);
};
oFF.SubUiManager.prototype.removeSelectableElementMaster = function(uiElement)
{
	this.getMaster().removeSelectableElementMaster(uiElement);
};
oFF.SubUiManager.prototype.getSelectableElementCount = function()
{
	return this.getMaster().getSelectableElementCount();
};
oFF.SubUiManager.prototype.getSelectableElements = function()
{
	return this.getMaster().getSelectableElements();
};
oFF.SubUiManager.prototype.selectById = function(identifier)
{
	return this.getMaster().selectById(identifier);
};

oFF.UiAggregation = function() {};
oFF.UiAggregation.prototype = new oFF.UiBaseConstant();
oFF.UiAggregation.prototype._ff_c = "UiAggregation";

oFF.UiAggregation.BUTTONS = null;
oFF.UiAggregation.CELLS = null;
oFF.UiAggregation.COLUMNS = null;
oFF.UiAggregation.DIALOG_BUTTONS = null;
oFF.UiAggregation.END_ICONS = null;
oFF.UiAggregation.ITEMS = null;
oFF.UiAggregation.MATRIX_LAYOUT_CELLS = null;
oFF.UiAggregation.MATRIX_LAYOUT_ROWS = null;
oFF.UiAggregation.PAGE_BUTTONS = null;
oFF.UiAggregation.PAGES = null;
oFF.UiAggregation.RADIO_BUTTONS = null;
oFF.UiAggregation.ROWS = null;
oFF.UiAggregation.SUGGESTIONS = null;
oFF.UiAggregation.TREE_TABLE_ROWS = null;
oFF.UiAggregation.RESPONSIVE_TABLE_COLUMNS = null;
oFF.UiAggregation.RESPONSIVE_TABLE_ROWS = null;
oFF.UiAggregation.RESPONSIVE_TABLE_CELLS = null;
oFF.UiAggregation.s_lookup = null;
oFF.UiAggregation.staticSetup = function()
{
	oFF.UiAggregation.s_lookup = oFF.XHashMapByString.create();
	oFF.UiAggregation.BUTTONS = oFF.UiAggregation.create("Buttons");
	oFF.UiAggregation.CELLS = oFF.UiAggregation.create("Cells");
	oFF.UiAggregation.COLUMNS = oFF.UiAggregation.create("Columns");
	oFF.UiAggregation.DIALOG_BUTTONS = oFF.UiAggregation.create("DialogButtons");
	oFF.UiAggregation.END_ICONS = oFF.UiAggregation.create("EndIcons");
	oFF.UiAggregation.ITEMS = oFF.UiAggregation.create("Items");
	oFF.UiAggregation.MATRIX_LAYOUT_CELLS = oFF.UiAggregation.create("MatrixLayoutCells");
	oFF.UiAggregation.MATRIX_LAYOUT_ROWS = oFF.UiAggregation.create("MatrixLayoutRows");
	oFF.UiAggregation.PAGE_BUTTONS = oFF.UiAggregation.create("PageButtons");
	oFF.UiAggregation.PAGES = oFF.UiAggregation.create("Pages");
	oFF.UiAggregation.RADIO_BUTTONS = oFF.UiAggregation.create("RadioButtons");
	oFF.UiAggregation.ROWS = oFF.UiAggregation.create("Rows");
	oFF.UiAggregation.SUGGESTIONS = oFF.UiAggregation.create("Suggestions");
	oFF.UiAggregation.TREE_TABLE_ROWS = oFF.UiAggregation.create("TreeTableRows");
	oFF.UiAggregation.RESPONSIVE_TABLE_COLUMNS = oFF.UiAggregation.create("ResponsiveTableColumns");
	oFF.UiAggregation.RESPONSIVE_TABLE_ROWS = oFF.UiAggregation.create("ResponsiveTableRows");
	oFF.UiAggregation.RESPONSIVE_TABLE_CELLS = oFF.UiAggregation.create("ResponsiveTableCells");
};
oFF.UiAggregation.setupItemTypes = function()
{
	oFF.UiAggregation.BUTTONS.setItemType(oFF.UiType.BUTTON);
	oFF.UiAggregation.CELLS.setItemType(oFF.UiType.TABLE_CELL);
	oFF.UiAggregation.COLUMNS.setItemType(oFF.UiType.TABLE_COLUMN);
	oFF.UiAggregation.DIALOG_BUTTONS.setItemType(oFF.UiType.DIALOG_BUTTON);
	oFF.UiAggregation.END_ICONS.setItemType(oFF.UiType.ICON);
	oFF.UiAggregation.ITEMS.setItemType(null);
	oFF.UiAggregation.MATRIX_LAYOUT_CELLS.setItemType(oFF.UiType.MATRIX_LAYOUT_CELL);
	oFF.UiAggregation.MATRIX_LAYOUT_ROWS.setItemType(oFF.UiType.MATRIX_LAYOUT_ROW);
	oFF.UiAggregation.PAGE_BUTTONS.setItemType(oFF.UiType.PAGE_BUTTON);
	oFF.UiAggregation.PAGES.setItemType(oFF.UiType.PAGE);
	oFF.UiAggregation.RADIO_BUTTONS.setItemType(oFF.UiType.RADIO_BUTTON);
	oFF.UiAggregation.ROWS.setItemType(oFF.UiType.TABLE_ROW);
	oFF.UiAggregation.SUGGESTIONS.setItemType(oFF.UiType.SUGGESTION_ITEM);
	oFF.UiAggregation.TREE_TABLE_ROWS.setItemType(oFF.UiType.TREE_TABLE_ROW);
	oFF.UiAggregation.RESPONSIVE_TABLE_COLUMNS.setItemType(oFF.UiType.RESPONSIVE_TABLE_COLUMN);
	oFF.UiAggregation.RESPONSIVE_TABLE_ROWS.setItemType(oFF.UiType.RESPONSIVE_TABLE_ROW);
	oFF.UiAggregation.RESPONSIVE_TABLE_CELLS.setItemType(oFF.UiType.RESPONSIVE_TABLE_CELL);
};
oFF.UiAggregation.create = function(name)
{
	var newConstant = oFF.UiBaseConstant.createUiBaseConstant(new oFF.UiAggregation(), name, oFF.UiAggregation.s_lookup);
	return newConstant;
};
oFF.UiAggregation.lookup = function(name)
{
	return oFF.UiBaseConstant.lookupConstant(name, oFF.UiAggregation.s_lookup);
};
oFF.UiAggregation.prototype.m_aggregationItemType = null;
oFF.UiAggregation.prototype.m_addMethodName = null;
oFF.UiAggregation.prototype.m_insertMethodName = null;
oFF.UiAggregation.prototype.m_removeMethodName = null;
oFF.UiAggregation.prototype.m_clearMethodName = null;
oFF.UiAggregation.prototype.m_addOp = null;
oFF.UiAggregation.prototype.m_insertOp = null;
oFF.UiAggregation.prototype.m_removeOp = null;
oFF.UiAggregation.prototype.m_clearOp = null;
oFF.UiAggregation.prototype.setItemType = function(itemType)
{
	this.m_aggregationItemType = itemType;
};
oFF.UiAggregation.prototype.getItemType = function()
{
	return this.m_aggregationItemType;
};
oFF.UiAggregation.prototype.getAddMethodName = function()
{
	if (oFF.XStringUtils.isNullOrEmpty(this.m_addMethodName))
	{
		this.m_addMethodName = this.generateAddMethodName();
	}
	return this.m_addMethodName;
};
oFF.UiAggregation.prototype.getInsertMethodName = function()
{
	if (oFF.XStringUtils.isNullOrEmpty(this.m_insertMethodName))
	{
		this.m_insertMethodName = this.generateInsertMethodName();
	}
	return this.m_insertMethodName;
};
oFF.UiAggregation.prototype.getRemoveMethodName = function()
{
	if (oFF.XStringUtils.isNullOrEmpty(this.m_removeMethodName))
	{
		this.m_removeMethodName = this.generateRemoveMethodName();
	}
	return this.m_removeMethodName;
};
oFF.UiAggregation.prototype.getClearMethodName = function()
{
	if (oFF.XStringUtils.isNullOrEmpty(this.m_clearMethodName))
	{
		this.m_clearMethodName = this.generateClearMethodName();
	}
	return this.m_clearMethodName;
};
oFF.UiAggregation.prototype.getAddOp = function()
{
	if (oFF.XStringUtils.isNotNullAndNotEmpty(this.getAddMethodName()) && oFF.isNull(this.m_addOp))
	{
		this.m_addOp = oFF.UiAllOperations.lookupOp(this.getAddMethodName());
	}
	return this.m_addOp;
};
oFF.UiAggregation.prototype.getInsertOp = function()
{
	if (oFF.XStringUtils.isNotNullAndNotEmpty(this.getAddMethodName()) && oFF.isNull(this.m_insertOp))
	{
		this.m_insertOp = oFF.UiAllOperations.lookupOp(this.getInsertMethodName());
	}
	return this.m_insertOp;
};
oFF.UiAggregation.prototype.getRemoveOp = function()
{
	if (oFF.XStringUtils.isNotNullAndNotEmpty(this.getRemoveMethodName()) && oFF.isNull(this.m_removeOp))
	{
		this.m_removeOp = oFF.UiAllOperations.lookupOp(this.getRemoveMethodName());
	}
	return this.m_removeOp;
};
oFF.UiAggregation.prototype.getClearOp = function()
{
	if (oFF.XStringUtils.isNotNullAndNotEmpty(this.getClearMethodName()) && oFF.isNull(this.m_clearOp))
	{
		this.m_clearOp = oFF.UiAllOperations.lookupOp(this.getClearMethodName());
	}
	return this.m_clearOp;
};
oFF.UiAggregation.prototype.getSingularName = function()
{
	if (oFF.XString.endsWith(this.getName(), "s"))
	{
		var strSize = oFF.XString.size(this.getName());
		return oFF.XString.substring(this.getName(), 0, strSize - 1);
	}
	return this.getName();
};
oFF.UiAggregation.prototype.generateAddMethodName = function()
{
	var singular = this.getSingularName();
	return oFF.XStringUtils.concatenate2("add", singular);
};
oFF.UiAggregation.prototype.generateInsertMethodName = function()
{
	var singular = this.getSingularName();
	return oFF.XStringUtils.concatenate2("insert", singular);
};
oFF.UiAggregation.prototype.generateRemoveMethodName = function()
{
	var singular = this.getSingularName();
	return oFF.XStringUtils.concatenate2("remove", singular);
};
oFF.UiAggregation.prototype.generateClearMethodName = function()
{
	return oFF.XStringUtils.concatenate2("clear", this.getName());
};

oFF.UiBaseInterface = function() {};
oFF.UiBaseInterface.prototype = new oFF.UiBaseConstant();
oFF.UiBaseInterface.prototype._ff_c = "UiBaseInterface";

oFF.UiBaseInterface.createUiBaseInterface = function(a, name, lookup)
{
	return oFF.UiBaseInterface.createUiBaseInterfaceWithParent(a, name, lookup, null);
};
oFF.UiBaseInterface.createUiBaseInterfaceWithParent = function(a, name, lookup, parent)
{
	var newConstant = oFF.UiBaseConstant.createUiBaseConstantExt(a, name, lookup, parent);
	a.setupBaseInterface();
	return newConstant;
};
oFF.UiBaseInterface.prototype.m_properties = null;
oFF.UiBaseInterface.prototype.m_aggregations = null;
oFF.UiBaseInterface.prototype.m_methods = null;
oFF.UiBaseInterface.prototype.m_events = null;
oFF.UiBaseInterface.prototype.m_interfaces = null;
oFF.UiBaseInterface.prototype.setupBaseInterface = function()
{
	this.m_properties = oFF.XList.create();
	this.m_events = oFF.XList.create();
	this.m_aggregations = oFF.XList.create();
	this.m_methods = oFF.XList.create();
	this.m_interfaces = oFF.XList.create();
};
oFF.UiBaseInterface.prototype.addProperty = function(property)
{
	if (this.hasProperty(property))
	{
		return;
	}
	this.m_properties.add(property);
};
oFF.UiBaseInterface.prototype.getProperties = function()
{
	return this.m_properties;
};
oFF.UiBaseInterface.prototype.getPropertyNamesSorted = function()
{
	return this.sortConstantsByName(this.m_properties);
};
oFF.UiBaseInterface.prototype.hasProperty = function(property)
{
	if (this.hasSuperType() && this.getSuperType().hasProperty(property))
	{
		return true;
	}
	return this.m_properties.contains(property);
};
oFF.UiBaseInterface.prototype.addAggregation = function(aggrDef)
{
	if (this.hasAggregation(aggrDef))
	{
		return;
	}
	this.m_aggregations.add(aggrDef);
};
oFF.UiBaseInterface.prototype.getAggregations = function()
{
	return this.m_aggregations;
};
oFF.UiBaseInterface.prototype.getAggregationNamesSorted = function()
{
	return this.sortConstantsByName(this.m_aggregations);
};
oFF.UiBaseInterface.prototype.hasAggregation = function(aggrDef)
{
	if (this.hasSuperType() && this.getSuperType().hasAggregation(aggrDef))
	{
		return true;
	}
	return this.m_aggregations.contains(aggrDef);
};
oFF.UiBaseInterface.prototype.addMethod = function(method)
{
	if (this.hasMethod(method))
	{
		return;
	}
	this.m_methods.add(method);
};
oFF.UiBaseInterface.prototype.getMethods = function()
{
	return this.m_methods;
};
oFF.UiBaseInterface.prototype.getMethodNamesSorted = function()
{
	return this.sortConstantsByName(this.m_methods);
};
oFF.UiBaseInterface.prototype.hasMethod = function(method)
{
	if (this.hasSuperType() && this.getSuperType().hasMethod(method))
	{
		return true;
	}
	return this.m_methods.contains(method);
};
oFF.UiBaseInterface.prototype.addEvent = function(eventDef)
{
	if (this.hasEvent(eventDef))
	{
		return;
	}
	this.m_events.add(eventDef);
};
oFF.UiBaseInterface.prototype.getEvents = function()
{
	return this.m_events;
};
oFF.UiBaseInterface.prototype.getEventNamesSorted = function()
{
	return this.sortConstantsByName(this.m_events);
};
oFF.UiBaseInterface.prototype.hasEvent = function(eventDef)
{
	if (this.hasSuperType() && this.getSuperType().hasEvent(eventDef))
	{
		return true;
	}
	return this.m_events.contains(eventDef);
};
oFF.UiBaseInterface.prototype.addInterface = function(interfaceDef)
{
	if (this.hasInterface(interfaceDef))
	{
		return;
	}
	this.m_interfaces.add(interfaceDef);
};
oFF.UiBaseInterface.prototype.getInterfaces = function()
{
	return this.m_interfaces;
};
oFF.UiBaseInterface.prototype.getInterfaceNamesSorted = function()
{
	return this.sortConstantsByName(this.m_interfaces);
};
oFF.UiBaseInterface.prototype.hasInterface = function(interfaceDef)
{
	if (this.hasSuperType() && this.getSuperType().hasInterface(interfaceDef))
	{
		return true;
	}
	return this.m_interfaces.contains(interfaceDef);
};
oFF.UiBaseInterface.prototype.setSuperType = function(type)
{
	this.setParent(type);
};
oFF.UiBaseInterface.prototype.getSuperType = function()
{
	return this.getParent();
};
oFF.UiBaseInterface.prototype.hasSuperType = function()
{
	return this.getSuperType() !== null;
};
oFF.UiBaseInterface.prototype.sortConstantsByName = function(constantsList)
{
	var tmpConstantNamesSorted = oFF.XListOfString.create();
	for (var i = 0; i < constantsList.size(); i++)
	{
		var tmpConstant = constantsList.get(i);
		tmpConstantNamesSorted.add(tmpConstant.getName());
	}
	tmpConstantNamesSorted.sortByDirection(oFF.XSortDirection.ASCENDING);
	return tmpConstantNamesSorted;
};

oFF.UiEvent = function() {};
oFF.UiEvent.prototype = new oFF.UiBaseConstant();
oFF.UiEvent.prototype._ff_c = "UiEvent";

oFF.UiEvent.ON_SELECT = null;
oFF.UiEvent.ON_SELECTION_CHANGE = null;
oFF.UiEvent.ON_CLICK = null;
oFF.UiEvent.ON_DOUBLE_CLICK = null;
oFF.UiEvent.ON_CONTEXT_MENU = null;
oFF.UiEvent.ON_OPEN = null;
oFF.UiEvent.ON_CLOSE = null;
oFF.UiEvent.ON_COLLAPSE = null;
oFF.UiEvent.ON_EXPAND = null;
oFF.UiEvent.ON_CHANGE = null;
oFF.UiEvent.ON_LIVE_CHANGE = null;
oFF.UiEvent.ON_DELETE = null;
oFF.UiEvent.ON_DETAIL_PRESS = null;
oFF.UiEvent.ON_ENTER = null;
oFF.UiEvent.ON_PRESS = null;
oFF.UiEvent.ON_LOAD_FINISHED = null;
oFF.UiEvent.ON_EDITING_BEGIN = null;
oFF.UiEvent.ON_EDITING_END = null;
oFF.UiEvent.ON_BACK = null;
oFF.UiEvent.ON_REFRESH = null;
oFF.UiEvent.ON_BEFORE_OPEN = null;
oFF.UiEvent.ON_BEFORE_CLOSE = null;
oFF.UiEvent.ON_AFTER_OPEN = null;
oFF.UiEvent.ON_AFTER_CLOSE = null;
oFF.UiEvent.ON_MOVE = null;
oFF.UiEvent.ON_MOVE_START = null;
oFF.UiEvent.ON_MOVE_END = null;
oFF.UiEvent.ON_RESIZE = null;
oFF.UiEvent.ON_SUGGESTION_SELECT = null;
oFF.UiEvent.ON_SCROLL = null;
oFF.UiEvent.ON_SCROLL_LOAD = null;
oFF.UiEvent.ON_HOVER = null;
oFF.UiEvent.ON_HOVER_END = null;
oFF.UiEvent.ON_PASTE = null;
oFF.UiEvent.ON_SELECTION_FINISH = null;
oFF.UiEvent.ON_SEARCH = null;
oFF.UiEvent.ON_BUTTON_PRESS = null;
oFF.UiEvent.ON_ERROR = null;
oFF.UiEvent.ON_READ_LINE_FINISHED = null;
oFF.UiEvent.ON_EXECUTE = null;
oFF.UiEvent.ON_TERMINATE = null;
oFF.UiEvent.ON_FILE_DROP = null;
oFF.UiEvent.ON_DROP = null;
oFF.UiEvent.ON_ITEM_SELECT = null;
oFF.UiEvent.ON_ITEM_CLOSE = null;
oFF.UiEvent.ON_TABLE_DRAG_AND_DROP = null;
oFF.UiEvent.s_lookup = null;
oFF.UiEvent.staticSetup = function()
{
	oFF.UiEvent.s_lookup = oFF.XHashMapByString.create();
	oFF.UiEvent.ON_SELECT = oFF.UiEvent.create("OnSelect");
	oFF.UiEvent.ON_SELECTION_CHANGE = oFF.UiEvent.create("OnSelectionChange");
	oFF.UiEvent.ON_CLICK = oFF.UiEvent.create("OnClick");
	oFF.UiEvent.ON_DOUBLE_CLICK = oFF.UiEvent.create("OnDoubleClick");
	oFF.UiEvent.ON_CONTEXT_MENU = oFF.UiEvent.create("OnContextMenu");
	oFF.UiEvent.ON_OPEN = oFF.UiEvent.create("OnOpen");
	oFF.UiEvent.ON_CLOSE = oFF.UiEvent.create("OnClose");
	oFF.UiEvent.ON_COLLAPSE = oFF.UiEvent.create("OnCollapse");
	oFF.UiEvent.ON_EXPAND = oFF.UiEvent.create("OnExpand");
	oFF.UiEvent.ON_CHANGE = oFF.UiEvent.create("OnChange");
	oFF.UiEvent.ON_LIVE_CHANGE = oFF.UiEvent.create("OnLiveChange");
	oFF.UiEvent.ON_DELETE = oFF.UiEvent.create("OnDelete");
	oFF.UiEvent.ON_DETAIL_PRESS = oFF.UiEvent.create("OnDetailPress");
	oFF.UiEvent.ON_ENTER = oFF.UiEvent.create("OnEnter");
	oFF.UiEvent.ON_PRESS = oFF.UiEvent.create("OnPress");
	oFF.UiEvent.ON_LOAD_FINISHED = oFF.UiEvent.create("OnLoadFinished");
	oFF.UiEvent.ON_EDITING_BEGIN = oFF.UiEvent.create("OnEditingBegin");
	oFF.UiEvent.ON_EDITING_END = oFF.UiEvent.create("OnEditingEnd");
	oFF.UiEvent.ON_BACK = oFF.UiEvent.create("OnBack");
	oFF.UiEvent.ON_REFRESH = oFF.UiEvent.create("OnRefresh");
	oFF.UiEvent.ON_BEFORE_OPEN = oFF.UiEvent.create("OnBeforeOpen");
	oFF.UiEvent.ON_BEFORE_CLOSE = oFF.UiEvent.create("OnBeforeClose");
	oFF.UiEvent.ON_AFTER_OPEN = oFF.UiEvent.create("OnAfterOpen");
	oFF.UiEvent.ON_AFTER_CLOSE = oFF.UiEvent.create("OnAfterClose");
	oFF.UiEvent.ON_MOVE = oFF.UiEvent.create("OnMove");
	oFF.UiEvent.ON_MOVE_START = oFF.UiEvent.create("OnMoveStart");
	oFF.UiEvent.ON_MOVE_END = oFF.UiEvent.create("OnMoveEnd");
	oFF.UiEvent.ON_RESIZE = oFF.UiEvent.create("OnResize");
	oFF.UiEvent.ON_SUGGESTION_SELECT = oFF.UiEvent.create("OnSuggestionSelect");
	oFF.UiEvent.ON_SCROLL = oFF.UiEvent.create("OnScroll");
	oFF.UiEvent.ON_SCROLL_LOAD = oFF.UiEvent.create("OnScrollLoad");
	oFF.UiEvent.ON_HOVER = oFF.UiEvent.create("OnHover");
	oFF.UiEvent.ON_HOVER_END = oFF.UiEvent.create("OnHoverEnd");
	oFF.UiEvent.ON_PASTE = oFF.UiEvent.create("OnPaste");
	oFF.UiEvent.ON_SELECTION_FINISH = oFF.UiEvent.create("OnSelectionFinish");
	oFF.UiEvent.ON_SEARCH = oFF.UiEvent.create("OnSearch");
	oFF.UiEvent.ON_BUTTON_PRESS = oFF.UiEvent.create("OnButtonPress");
	oFF.UiEvent.ON_ERROR = oFF.UiEvent.create("OnError");
	oFF.UiEvent.ON_READ_LINE_FINISHED = oFF.UiEvent.create("OnReadLineFinished");
	oFF.UiEvent.ON_EXECUTE = oFF.UiEvent.create("OnExecute");
	oFF.UiEvent.ON_TERMINATE = oFF.UiEvent.create("OnTerminate");
	oFF.UiEvent.ON_FILE_DROP = oFF.UiEvent.create("OnFileDrop");
	oFF.UiEvent.ON_DROP = oFF.UiEvent.create("OnDrop");
	oFF.UiEvent.ON_ITEM_SELECT = oFF.UiEvent.create("OnItemSelect");
	oFF.UiEvent.ON_ITEM_CLOSE = oFF.UiEvent.create("OnItemClose");
	oFF.UiEvent.ON_TABLE_DRAG_AND_DROP = oFF.UiEvent.create("OnTableDragAndDrop");
};
oFF.UiEvent.create = function(name)
{
	var newConstant = oFF.UiBaseConstant.createUiBaseConstant(new oFF.UiEvent(), name, oFF.UiEvent.s_lookup);
	return newConstant;
};
oFF.UiEvent.lookup = function(name)
{
	return oFF.UiBaseConstant.lookupConstant(name, oFF.UiEvent.s_lookup);
};
oFF.UiEvent.prototype.m_registerMethodName = null;
oFF.UiEvent.prototype.m_eventMethodName = null;
oFF.UiEvent.prototype.getRegisterMethodName = function()
{
	if (oFF.XStringUtils.isNullOrEmpty(this.m_registerMethodName))
	{
		this.m_registerMethodName = oFF.XStringUtils.concatenate2("register", this.getName());
	}
	return this.m_registerMethodName;
};
oFF.UiEvent.prototype.getRemoteName = function()
{
	if (oFF.XStringUtils.isNullOrEmpty(this.m_eventMethodName))
	{
		var firstString = oFF.XString.substring(this.getName(), 0, 1);
		var strSize = oFF.XString.size(this.getName());
		var restString = oFF.XString.substring(this.getName(), 1, strSize);
		var firstStringLower = oFF.XString.toLowerCase(firstString);
		this.m_eventMethodName = oFF.XStringUtils.concatenate2(firstStringLower, restString);
	}
	return this.m_eventMethodName;
};

oFF.UiMethod = function() {};
oFF.UiMethod.prototype = new oFF.UiBaseConstant();
oFF.UiMethod.prototype._ff_c = "UiMethod";

oFF.UiMethod.EXPAND_TO_LEVEL = null;
oFF.UiMethod.COLLAPSE_ALL = null;
oFF.UiMethod.OPEN = null;
oFF.UiMethod.OPEN_AT = null;
oFF.UiMethod.OPEN_AT_POSITION = null;
oFF.UiMethod.CLOSE = null;
oFF.UiMethod.PRINT = null;
oFF.UiMethod.PRINTLN = null;
oFF.UiMethod.FOCUS = null;
oFF.UiMethod.SHAKE = null;
oFF.UiMethod.SHOW_SUGGESTIONS = null;
oFF.UiMethod.CLOSE_SUGGESTIONS = null;
oFF.UiMethod.BACK = null;
oFF.UiMethod.SCROLL_TO = null;
oFF.UiMethod.SCROLL_TO_CONTROL = null;
oFF.UiMethod.POP_TO_PAGE = null;
oFF.UiMethod.MAXIMIZE = null;
oFF.UiMethod.RESTORE = null;
oFF.UiMethod.HIDE = null;
oFF.UiMethod.SHOW = null;
oFF.UiMethod.SELECT_TEXT = null;
oFF.UiMethod.FULLSCREEN = null;
oFF.UiMethod.START_READ_LINE = null;
oFF.UiMethod.BRING_TO_FRONT = null;
oFF.UiMethod.SIZE = null;
oFF.UiMethod.POSITION = null;
oFF.UiMethod.FRAME = null;
oFF.UiMethod.s_lookup = null;
oFF.UiMethod.staticSetup = function()
{
	oFF.UiMethod.s_lookup = oFF.XHashMapByString.create();
	oFF.UiMethod.EXPAND_TO_LEVEL = oFF.UiMethod.create("ExpandToLevel");
	oFF.UiMethod.COLLAPSE_ALL = oFF.UiMethod.create("CollapseAll");
	oFF.UiMethod.OPEN = oFF.UiMethod.create("Open");
	oFF.UiMethod.OPEN_AT = oFF.UiMethod.create("OpenAt");
	oFF.UiMethod.OPEN_AT_POSITION = oFF.UiMethod.create("OpenAtPosition");
	oFF.UiMethod.CLOSE = oFF.UiMethod.create("Close");
	oFF.UiMethod.PRINT = oFF.UiMethod.create("Print");
	oFF.UiMethod.PRINTLN = oFF.UiMethod.create("Println");
	oFF.UiMethod.FOCUS = oFF.UiMethod.create("Focus");
	oFF.UiMethod.SHAKE = oFF.UiMethod.create("Shake");
	oFF.UiMethod.SHOW_SUGGESTIONS = oFF.UiMethod.create("ShowSuggestions");
	oFF.UiMethod.CLOSE_SUGGESTIONS = oFF.UiMethod.create("CloseSuggestions");
	oFF.UiMethod.BACK = oFF.UiMethod.create("Back");
	oFF.UiMethod.SCROLL_TO = oFF.UiMethod.create("ScrollTo");
	oFF.UiMethod.SCROLL_TO_CONTROL = oFF.UiMethod.create("ScrollToControl");
	oFF.UiMethod.POP_TO_PAGE = oFF.UiMethod.create("PopToPage");
	oFF.UiMethod.MAXIMIZE = oFF.UiMethod.create("Maximize");
	oFF.UiMethod.RESTORE = oFF.UiMethod.create("Restore");
	oFF.UiMethod.HIDE = oFF.UiMethod.create("Hide");
	oFF.UiMethod.SHOW = oFF.UiMethod.create("Show");
	oFF.UiMethod.SELECT_TEXT = oFF.UiMethod.create("SelectText");
	oFF.UiMethod.FULLSCREEN = oFF.UiMethod.create("Fullscreen");
	oFF.UiMethod.START_READ_LINE = oFF.UiMethod.create("StartReadLine");
	oFF.UiMethod.BRING_TO_FRONT = oFF.UiMethod.create("BringToFront");
	oFF.UiMethod.SIZE = oFF.UiMethod.create("Size").setGroup();
	oFF.UiMethod.POSITION = oFF.UiMethod.create("Position").setGroup();
	oFF.UiMethod.FRAME = oFF.UiMethod.create("Frame").setGroup();
};
oFF.UiMethod.create = function(name)
{
	var newConstant = oFF.UiBaseConstant.createUiBaseConstant(new oFF.UiMethod(), name, oFF.UiMethod.s_lookup);
	newConstant.m_isGroup = false;
	return newConstant;
};
oFF.UiMethod.lookup = function(name)
{
	return oFF.UiBaseConstant.lookupConstant(name, oFF.UiMethod.s_lookup);
};
oFF.UiMethod.prototype.m_isGroup = false;
oFF.UiMethod.prototype.m_methodName = null;
oFF.UiMethod.prototype.setGroup = function()
{
	this.m_isGroup = true;
	return this;
};
oFF.UiMethod.prototype.getMethodName = function()
{
	if (this.m_isGroup === true)
	{
		return null;
	}
	if (oFF.XStringUtils.isNullOrEmpty(this.m_methodName))
	{
		var firstString = oFF.XString.substring(this.getName(), 0, 1);
		var strSize = oFF.XString.size(this.getName());
		var restString = oFF.XString.substring(this.getName(), 1, strSize);
		var firstStringLower = oFF.XString.toLowerCase(firstString);
		this.m_methodName = oFF.XStringUtils.concatenate2(firstStringLower, restString);
	}
	return this.m_methodName;
};
oFF.UiMethod.prototype.isGroup = function()
{
	return this.m_isGroup;
};

oFF.UiProperty = function() {};
oFF.UiProperty.prototype = new oFF.UiBaseConstant();
oFF.UiProperty.prototype._ff_c = "UiProperty";

oFF.UiProperty.ALIGN_ITEMS = null;
oFF.UiProperty.ALIGN_CONTENT = null;
oFF.UiProperty.ALIGN_SELF = null;
oFF.UiProperty.ANIMATED = null;
oFF.UiProperty.APPLY_CONTENT_PADDING = null;
oFF.UiProperty.ANIMATION_DURATION = null;
oFF.UiProperty.BACKGROUND_COLOR = null;
oFF.UiProperty.BACKGROUND_IMAGE_SRC = null;
oFF.UiProperty.BUTTON_TYPE = null;
oFF.UiProperty.BORDER_WIDTH = null;
oFF.UiProperty.BORDER_COLOR = null;
oFF.UiProperty.BORDER_STYLE = null;
oFF.UiProperty.BUSY = null;
oFF.UiProperty.COLUMN_COUNT = null;
oFF.UiProperty.COLUMN_SPAN = null;
oFF.UiProperty.CHECKED = null;
oFF.UiProperty.CORNER_RADIUS = null;
oFF.UiProperty.CLOSEABLE = null;
oFF.UiProperty.CHART_TYPE = null;
oFF.UiProperty.CUSTOM_OBJECT = null;
oFF.UiProperty.CONTENT = null;
oFF.UiProperty.COMMAND_HISTORY = null;
oFF.UiProperty.COUNTER = null;
oFF.UiProperty.CODE_TYPE = null;
oFF.UiProperty.CUSTOM_PARAMETERS = null;
oFF.UiProperty.COLOR = null;
oFF.UiProperty.CSS_CLASS = null;
oFF.UiProperty.COUNT = null;
oFF.UiProperty.DESCRIPTION = null;
oFF.UiProperty.DATA_MANIFEST = null;
oFF.UiProperty.DISPLAY_FORMAT = null;
oFF.UiProperty.DEBOUNCE_TIME = null;
oFF.UiProperty.DIRECTION = null;
oFF.UiProperty.DRAGGABLE = null;
oFF.UiProperty.DROP_INFO = null;
oFF.UiProperty.EDITABLE = null;
oFF.UiProperty.ENABLED = null;
oFF.UiProperty.EXPANDED = null;
oFF.UiProperty.ENABLE_SELECT_ALL = null;
oFF.UiProperty.EXPANDABLE = null;
oFF.UiProperty.END_DATE = null;
oFF.UiProperty.ENABLE_REORDERING = null;
oFF.UiProperty.FLEX = null;
oFF.UiProperty.FOOTER = null;
oFF.UiProperty.FOOTER_HEIGHT = null;
oFF.UiProperty.FONT_SIZE = null;
oFF.UiProperty.FONT_COLOR = null;
oFF.UiProperty.FONT_STYLE = null;
oFF.UiProperty.FONT_WEIGHT = null;
oFF.UiProperty.FIRST_VISIBLE_ROW = null;
oFF.UiProperty.FRAME_TYPE = null;
oFF.UiProperty.HEIGHT = null;
oFF.UiProperty.HIGHLIGHT = null;
oFF.UiProperty.HEADER = null;
oFF.UiProperty.HEADER_HEIGHT = null;
oFF.UiProperty.HIDDEN = null;
oFF.UiProperty.HEADER_MODE = null;
oFF.UiProperty.ICON = null;
oFF.UiProperty.ICON_SIZE = null;
oFF.UiProperty.ID = null;
oFF.UiProperty.IMAGE_URI = null;
oFF.UiProperty.IMAGE_DATA = null;
oFF.UiProperty.INPUT_TYPE = null;
oFF.UiProperty.INTERVAL_SELECTION = null;
oFF.UiProperty.JUSTIFY_CONTENT = null;
oFF.UiProperty.LABEL = null;
oFF.UiProperty.LIST_ITEM_TYPE = null;
oFF.UiProperty.LOAD_STATE = null;
oFF.UiProperty.MARGIN = null;
oFF.UiProperty.MAX_LENGTH = null;
oFF.UiProperty.MAX_DATE = null;
oFF.UiProperty.MIN_DATE = null;
oFF.UiProperty.MINUTES_INTERVAL = null;
oFF.UiProperty.MODEL_JSON = null;
oFF.UiProperty.MESSAGE_TYPE = null;
oFF.UiProperty.MIN_ROW_COUNT = null;
oFF.UiProperty.MAXIMIZED = null;
oFF.UiProperty.MODIFIED = null;
oFF.UiProperty.MAX_HEIGHT = null;
oFF.UiProperty.MAX_WIDTH = null;
oFF.UiProperty.MIN_HEIGHT = null;
oFF.UiProperty.MIN_WIDTH = null;
oFF.UiProperty.NAME = null;
oFF.UiProperty.NODE = null;
oFF.UiProperty.ON = null;
oFF.UiProperty.ON_TEXT = null;
oFF.UiProperty.OFF_TEXT = null;
oFF.UiProperty.OFFSET_HEIGHT = null;
oFF.UiProperty.OFFSET_WIDTH = null;
oFF.UiProperty.OPEN = null;
oFF.UiProperty.ORDER = null;
oFF.UiProperty.OPACITY = null;
oFF.UiProperty.OVERFLOW = null;
oFF.UiProperty.PATH = null;
oFF.UiProperty.PARENT = null;
oFF.UiProperty.PARTIALLY_CHECKED = null;
oFF.UiProperty.PLACEHOLDER = null;
oFF.UiProperty.PADDING = null;
oFF.UiProperty.PLACEMENT = null;
oFF.UiProperty.PRESSED = null;
oFF.UiProperty.PROMPT = null;
oFF.UiProperty.PERCENT_VALUE = null;
oFF.UiProperty.REQUIRED = null;
oFF.UiProperty.RESIZABLE = null;
oFF.UiProperty.ROW_COUNT = null;
oFF.UiProperty.ROW_SPAN = null;
oFF.UiProperty.ROTATION = null;
oFF.UiProperty.SECONDS_INTERVAL = null;
oFF.UiProperty.SELECTED = null;
oFF.UiProperty.SLIDER_MINIMUM = null;
oFF.UiProperty.SLIDER_MAXIMUM = null;
oFF.UiProperty.SLIDER_STEP = null;
oFF.UiProperty.SLIDER_VALUE = null;
oFF.UiProperty.SLIDER_UPPER_VALUE = null;
oFF.UiProperty.SPLITTER_POSITION = null;
oFF.UiProperty.SECTION_START = null;
oFF.UiProperty.SELECTION_MODE = null;
oFF.UiProperty.SELECTION_BEHAVIOR = null;
oFF.UiProperty.SRC = null;
oFF.UiProperty.SHOW_NAV_BUTTON = null;
oFF.UiProperty.SHOW_HEADER = null;
oFF.UiProperty.SHOW_SORTING = null;
oFF.UiProperty.SUB_HEADER = null;
oFF.UiProperty.START_DATE = null;
oFF.UiProperty.SHOW_VALUE = null;
oFF.UiProperty.SUBTITLE = null;
oFF.UiProperty.SHOW_ADD_NEW_BUTTON = null;
oFF.UiProperty.STATE = null;
oFF.UiProperty.TAG = null;
oFF.UiProperty.TEXT = null;
oFF.UiProperty.TEXT_ALIGN = null;
oFF.UiProperty.TEXT_DECORATION = null;
oFF.UiProperty.TOOLTIP = null;
oFF.UiProperty.TITLE = null;
oFF.UiProperty.TILE_MODE = null;
oFF.UiProperty.VALUE = null;
oFF.UiProperty.VALUE_FORMAT = null;
oFF.UiProperty.VALUE_STATE = null;
oFF.UiProperty.VALUE_STATE_TEXT = null;
oFF.UiProperty.VISIBLE = null;
oFF.UiProperty.VISIBLE_ROW_COUNT = null;
oFF.UiProperty.VISIBLE_ROW_COUNT_MODE = null;
oFF.UiProperty.X_POS = null;
oFF.UiProperty.Y_POS = null;
oFF.UiProperty.WIDTH = null;
oFF.UiProperty.WRAP = null;
oFF.UiProperty.WRAPPING = null;
oFF.UiProperty.s_lookup = null;
oFF.UiProperty.staticSetup = function()
{
	oFF.UiProperty.s_lookup = oFF.XHashMapByString.create();
	oFF.UiProperty.ALIGN_ITEMS = oFF.UiProperty.createExt("AlignItems", oFF.XValueType.UI_CONSTANT);
	oFF.UiProperty.ALIGN_CONTENT = oFF.UiProperty.createExt("AlignContent", oFF.XValueType.UI_CONSTANT);
	oFF.UiProperty.ALIGN_SELF = oFF.UiProperty.createExt("AlignSelf", oFF.XValueType.UI_CONSTANT);
	oFF.UiProperty.ANIMATED = oFF.UiProperty.createExt("Animated", oFF.XValueType.BOOLEAN);
	oFF.UiProperty.APPLY_CONTENT_PADDING = oFF.UiProperty.createExt("ApplyContentPadding", oFF.XValueType.BOOLEAN);
	oFF.UiProperty.ANIMATION_DURATION = oFF.UiProperty.createExt("AnimationDuration", oFF.XValueType.INTEGER);
	oFF.UiProperty.BACKGROUND_COLOR = oFF.UiProperty.createExt("BackgroundColor", oFF.XValueType.UI_COLOR);
	oFF.UiProperty.BACKGROUND_IMAGE_SRC = oFF.UiProperty.createExt("BackgroundImageSrc", oFF.XValueType.STRING);
	oFF.UiProperty.BUTTON_TYPE = oFF.UiProperty.createExt("ButtonType", oFF.XValueType.UI_CONSTANT);
	oFF.UiProperty.BORDER_WIDTH = oFF.UiProperty.createExt("BorderWidth", oFF.XValueType.UI_CSS_BOX_EDGES);
	oFF.UiProperty.BORDER_COLOR = oFF.UiProperty.createExt("BorderColor", oFF.XValueType.UI_COLOR);
	oFF.UiProperty.BORDER_STYLE = oFF.UiProperty.createExt("BorderStyle", oFF.XValueType.UI_CONSTANT);
	oFF.UiProperty.BUSY = oFF.UiProperty.createExt("Busy", oFF.XValueType.BOOLEAN);
	oFF.UiProperty.COLUMN_COUNT = oFF.UiProperty.createExt("ColumnCount", oFF.XValueType.INTEGER);
	oFF.UiProperty.COLUMN_SPAN = oFF.UiProperty.createExt("ColumnSpan", oFF.XValueType.INTEGER);
	oFF.UiProperty.CHECKED = oFF.UiProperty.createExt("Checked", oFF.XValueType.BOOLEAN);
	oFF.UiProperty.CORNER_RADIUS = oFF.UiProperty.createExt("CornerRadius", oFF.XValueType.UI_CSS_BOX_EDGES);
	oFF.UiProperty.CLOSEABLE = oFF.UiProperty.createExt("Closeable", oFF.XValueType.BOOLEAN);
	oFF.UiProperty.CHART_TYPE = oFF.UiProperty.createExt("ChartType", oFF.XValueType.UI_CONSTANT);
	oFF.UiProperty.CUSTOM_OBJECT = oFF.UiProperty.createExt("CustomObject", oFF.XValueType.OBJECT);
	oFF.UiProperty.CONTENT = oFF.UiProperty.createExt("Content", oFF.XValueType.UI_CONTROL);
	oFF.UiProperty.COMMAND_HISTORY = oFF.UiProperty.createExt("CommandHistory", oFF.XValueType.LIST);
	oFF.UiProperty.COUNTER = oFF.UiProperty.createExt("Counter", oFF.XValueType.INTEGER);
	oFF.UiProperty.CODE_TYPE = oFF.UiProperty.createExt("CodeType", oFF.XValueType.STRING);
	oFF.UiProperty.CUSTOM_PARAMETERS = oFF.UiProperty.createExt("CustomParameters", oFF.XValueType.STRUCTURE);
	oFF.UiProperty.COLOR = oFF.UiProperty.createExt("Color", oFF.XValueType.UI_COLOR);
	oFF.UiProperty.CSS_CLASS = oFF.UiProperty.createExt("CssClass", oFF.XValueType.STRING);
	oFF.UiProperty.COUNT = oFF.UiProperty.createExt("Count", oFF.XValueType.STRING);
	oFF.UiProperty.DESCRIPTION = oFF.UiProperty.createExt("Description", oFF.XValueType.STRING);
	oFF.UiProperty.DATA_MANIFEST = oFF.UiProperty.createExt("DataManifest", oFF.XValueType.STRUCTURE);
	oFF.UiProperty.DISPLAY_FORMAT = oFF.UiProperty.createExt("DisplayFormat", oFF.XValueType.STRING);
	oFF.UiProperty.DEBOUNCE_TIME = oFF.UiProperty.createExt("DebounceTime", oFF.XValueType.INTEGER);
	oFF.UiProperty.DIRECTION = oFF.UiProperty.createExt("Direction", oFF.XValueType.UI_CONSTANT);
	oFF.UiProperty.DRAGGABLE = oFF.UiProperty.createExt("Draggable", oFF.XValueType.BOOLEAN);
	oFF.UiProperty.DROP_INFO = oFF.UiProperty.createExt("DropInfo", oFF.XValueType.UI_DROP_INFO);
	oFF.UiProperty.EDITABLE = oFF.UiProperty.createExt("Editable", oFF.XValueType.BOOLEAN);
	oFF.UiProperty.ENABLED = oFF.UiProperty.createExt("Enabled", oFF.XValueType.BOOLEAN);
	oFF.UiProperty.EXPANDED = oFF.UiProperty.createExt("Expanded", oFF.XValueType.BOOLEAN);
	oFF.UiProperty.ENABLE_SELECT_ALL = oFF.UiProperty.createExt("EnableSelectAll", oFF.XValueType.BOOLEAN);
	oFF.UiProperty.EXPANDABLE = oFF.UiProperty.createExt("Expandable", oFF.XValueType.BOOLEAN);
	oFF.UiProperty.END_DATE = oFF.UiProperty.createExt("EndDate", oFF.XValueType.STRING);
	oFF.UiProperty.ENABLE_REORDERING = oFF.UiProperty.createExt("EnableReordering", oFF.XValueType.BOOLEAN);
	oFF.UiProperty.FLEX = oFF.UiProperty.createExt("Flex", oFF.XValueType.STRING);
	oFF.UiProperty.FOOTER = oFF.UiProperty.createExt("Footer", oFF.XValueType.UI_CONTROL);
	oFF.UiProperty.FOOTER_HEIGHT = oFF.UiProperty.createExt("FooterHeight", oFF.XValueType.UI_CSS_LENGTH);
	oFF.UiProperty.FONT_SIZE = oFF.UiProperty.createExt("FontSize", oFF.XValueType.UI_CSS_LENGTH);
	oFF.UiProperty.FONT_COLOR = oFF.UiProperty.createExt("FontColor", oFF.XValueType.UI_COLOR);
	oFF.UiProperty.FONT_STYLE = oFF.UiProperty.createExt("FontStyle", oFF.XValueType.UI_CONSTANT);
	oFF.UiProperty.FONT_WEIGHT = oFF.UiProperty.createExt("FontWeight", oFF.XValueType.UI_CONSTANT);
	oFF.UiProperty.FIRST_VISIBLE_ROW = oFF.UiProperty.createExt("FirstVisibleRow", oFF.XValueType.UI_CONTROL);
	oFF.UiProperty.FRAME_TYPE = oFF.UiProperty.createExt("FrameType", oFF.XValueType.UI_CONSTANT);
	oFF.UiProperty.HEIGHT = oFF.UiProperty.createExt("Height", oFF.XValueType.UI_CSS_LENGTH);
	oFF.UiProperty.HIGHLIGHT = oFF.UiProperty.createExt("Highlight", oFF.XValueType.UI_CONSTANT);
	oFF.UiProperty.HEADER = oFF.UiProperty.createExt("Header", oFF.XValueType.UI_CONTROL);
	oFF.UiProperty.HEADER_HEIGHT = oFF.UiProperty.createExt("HeaderHeight", oFF.XValueType.UI_CSS_LENGTH);
	oFF.UiProperty.HIDDEN = oFF.UiProperty.createExt("Hidden", oFF.XValueType.BOOLEAN).readOnly();
	oFF.UiProperty.HEADER_MODE = oFF.UiProperty.createExt("HeaderMode", oFF.XValueType.UI_CONSTANT);
	oFF.UiProperty.ICON = oFF.UiProperty.createExt("Icon", oFF.XValueType.STRING);
	oFF.UiProperty.ICON_SIZE = oFF.UiProperty.createExt("IconSize", oFF.XValueType.UI_CSS_LENGTH);
	oFF.UiProperty.ID = oFF.UiProperty.createExt("Id", oFF.XValueType.STRING).readOnly();
	oFF.UiProperty.IMAGE_URI = oFF.UiProperty.createExt("ImageUri", oFF.XValueType.STRING);
	oFF.UiProperty.IMAGE_DATA = oFF.UiProperty.createExt("ImageData", oFF.XValueType.STRING);
	oFF.UiProperty.INPUT_TYPE = oFF.UiProperty.createExt("InputType", oFF.XValueType.UI_CONSTANT);
	oFF.UiProperty.INTERVAL_SELECTION = oFF.UiProperty.createExt("IntervalSelection", oFF.XValueType.BOOLEAN);
	oFF.UiProperty.JUSTIFY_CONTENT = oFF.UiProperty.createExt("JustifyContent", oFF.XValueType.UI_CONSTANT);
	oFF.UiProperty.LABEL = oFF.UiProperty.createExt("Label", oFF.XValueType.STRING);
	oFF.UiProperty.LIST_ITEM_TYPE = oFF.UiProperty.createExt("ListItemType", oFF.XValueType.UI_CONSTANT);
	oFF.UiProperty.LOAD_STATE = oFF.UiProperty.createExt("LoadState", oFF.XValueType.UI_CONSTANT);
	oFF.UiProperty.MARGIN = oFF.UiProperty.createExt("Margin", oFF.XValueType.UI_CSS_BOX_EDGES);
	oFF.UiProperty.MAX_LENGTH = oFF.UiProperty.createExt("MaxLength", oFF.XValueType.INTEGER);
	oFF.UiProperty.MAX_DATE = oFF.UiProperty.createExt("MaxDate", oFF.XValueType.STRING);
	oFF.UiProperty.MIN_DATE = oFF.UiProperty.createExt("MinDate", oFF.XValueType.STRING);
	oFF.UiProperty.MINUTES_INTERVAL = oFF.UiProperty.createExt("MinutesInterval", oFF.XValueType.INTEGER);
	oFF.UiProperty.MODEL_JSON = oFF.UiProperty.createExt("ModelJson", oFF.XValueType.STRUCTURE);
	oFF.UiProperty.MESSAGE_TYPE = oFF.UiProperty.createExt("MessageType", oFF.XValueType.UI_CONSTANT);
	oFF.UiProperty.MIN_ROW_COUNT = oFF.UiProperty.createExt("MinRowCount", oFF.XValueType.INTEGER);
	oFF.UiProperty.MAXIMIZED = oFF.UiProperty.createExt("Maximized", oFF.XValueType.BOOLEAN).readOnly();
	oFF.UiProperty.MODIFIED = oFF.UiProperty.createExt("Modified", oFF.XValueType.BOOLEAN);
	oFF.UiProperty.MAX_HEIGHT = oFF.UiProperty.createExt("MaxHeight", oFF.XValueType.UI_CSS_LENGTH);
	oFF.UiProperty.MAX_WIDTH = oFF.UiProperty.createExt("MaxWidth", oFF.XValueType.UI_CSS_LENGTH);
	oFF.UiProperty.MIN_HEIGHT = oFF.UiProperty.createExt("MinHeight", oFF.XValueType.UI_CSS_LENGTH);
	oFF.UiProperty.MIN_WIDTH = oFF.UiProperty.createExt("MinWidth", oFF.XValueType.UI_CSS_LENGTH);
	oFF.UiProperty.NAME = oFF.UiProperty.createExt("Name", oFF.XValueType.STRING);
	oFF.UiProperty.NODE = oFF.UiProperty.createExt("Node", oFF.XValueType.BOOLEAN);
	oFF.UiProperty.ON = oFF.UiProperty.createExt("On", oFF.XValueType.BOOLEAN);
	oFF.UiProperty.ON_TEXT = oFF.UiProperty.createExt("OnText", oFF.XValueType.STRING);
	oFF.UiProperty.OFF_TEXT = oFF.UiProperty.createExt("OffText", oFF.XValueType.STRING);
	oFF.UiProperty.OFFSET_HEIGHT = oFF.UiProperty.createExt("OffsetHeight", oFF.XValueType.INTEGER).readOnly();
	oFF.UiProperty.OFFSET_WIDTH = oFF.UiProperty.createExt("OffsetWidth", oFF.XValueType.INTEGER).readOnly();
	oFF.UiProperty.OPEN = oFF.UiProperty.createExt("Open", oFF.XValueType.BOOLEAN).readOnly();
	oFF.UiProperty.ORDER = oFF.UiProperty.createExt("Order", oFF.XValueType.INTEGER);
	oFF.UiProperty.OPACITY = oFF.UiProperty.createExt("Opacity", oFF.XValueType.DOUBLE);
	oFF.UiProperty.OVERFLOW = oFF.UiProperty.createExt("Overflow", oFF.XValueType.UI_CONSTANT);
	oFF.UiProperty.PATH = oFF.UiProperty.createExt("Path", oFF.XValueType.STRING);
	oFF.UiProperty.PARENT = oFF.UiProperty.createExt("Parent", oFF.XValueType.UI_CONTROL).readOnly();
	oFF.UiProperty.PARTIALLY_CHECKED = oFF.UiProperty.createExt("PartiallyChecked", oFF.XValueType.BOOLEAN);
	oFF.UiProperty.PLACEHOLDER = oFF.UiProperty.createExt("Placeholder", oFF.XValueType.STRING);
	oFF.UiProperty.PADDING = oFF.UiProperty.createExt("Padding", oFF.XValueType.UI_CSS_BOX_EDGES);
	oFF.UiProperty.PLACEMENT = oFF.UiProperty.createExt("Placement", oFF.XValueType.UI_CONSTANT);
	oFF.UiProperty.PRESSED = oFF.UiProperty.createExt("Pressed", oFF.XValueType.BOOLEAN);
	oFF.UiProperty.PROMPT = oFF.UiProperty.createExt("Prompt", oFF.XValueType.STRING);
	oFF.UiProperty.PERCENT_VALUE = oFF.UiProperty.createExt("PercentValue", oFF.XValueType.DOUBLE);
	oFF.UiProperty.REQUIRED = oFF.UiProperty.createExt("Required", oFF.XValueType.BOOLEAN);
	oFF.UiProperty.RESIZABLE = oFF.UiProperty.createExt("Resizable", oFF.XValueType.BOOLEAN);
	oFF.UiProperty.ROW_COUNT = oFF.UiProperty.createExt("RowCount", oFF.XValueType.INTEGER);
	oFF.UiProperty.ROW_SPAN = oFF.UiProperty.createExt("RowSpan", oFF.XValueType.INTEGER);
	oFF.UiProperty.ROTATION = oFF.UiProperty.createExt("Rotation", oFF.XValueType.INTEGER);
	oFF.UiProperty.SECONDS_INTERVAL = oFF.UiProperty.createExt("SecondsInterval", oFF.XValueType.INTEGER);
	oFF.UiProperty.SELECTED = oFF.UiProperty.createExt("Selected", oFF.XValueType.BOOLEAN);
	oFF.UiProperty.SLIDER_MINIMUM = oFF.UiProperty.createExt("SliderMinimum", oFF.XValueType.INTEGER);
	oFF.UiProperty.SLIDER_MAXIMUM = oFF.UiProperty.createExt("SliderMaximum", oFF.XValueType.INTEGER);
	oFF.UiProperty.SLIDER_STEP = oFF.UiProperty.createExt("SliderStep", oFF.XValueType.INTEGER);
	oFF.UiProperty.SLIDER_VALUE = oFF.UiProperty.createExt("SliderValue", oFF.XValueType.INTEGER);
	oFF.UiProperty.SLIDER_UPPER_VALUE = oFF.UiProperty.createExt("SliderUpperValue", oFF.XValueType.INTEGER);
	oFF.UiProperty.SPLITTER_POSITION = oFF.UiProperty.createExt("SplitterPosition", oFF.XValueType.INTEGER);
	oFF.UiProperty.SECTION_START = oFF.UiProperty.createExt("SectionStart", oFF.XValueType.BOOLEAN);
	oFF.UiProperty.SELECTION_MODE = oFF.UiProperty.createExt("SelectionMode", oFF.XValueType.UI_CONSTANT);
	oFF.UiProperty.SELECTION_BEHAVIOR = oFF.UiProperty.createExt("SelectionBehavior", oFF.XValueType.UI_CONSTANT);
	oFF.UiProperty.SRC = oFF.UiProperty.createExt("Src", oFF.XValueType.STRING);
	oFF.UiProperty.SHOW_NAV_BUTTON = oFF.UiProperty.createExt("ShowNavButton", oFF.XValueType.BOOLEAN);
	oFF.UiProperty.SHOW_HEADER = oFF.UiProperty.createExt("ShowHeader", oFF.XValueType.BOOLEAN);
	oFF.UiProperty.SHOW_SORTING = oFF.UiProperty.createExt("ShowSorting", oFF.XValueType.BOOLEAN);
	oFF.UiProperty.SUB_HEADER = oFF.UiProperty.createExt("SubHeader", oFF.XValueType.UI_CONTROL);
	oFF.UiProperty.START_DATE = oFF.UiProperty.createExt("StartDate", oFF.XValueType.STRING);
	oFF.UiProperty.SHOW_VALUE = oFF.UiProperty.createExt("ShowValue", oFF.XValueType.BOOLEAN);
	oFF.UiProperty.SUBTITLE = oFF.UiProperty.createExt("Subtitle", oFF.XValueType.STRING);
	oFF.UiProperty.SHOW_ADD_NEW_BUTTON = oFF.UiProperty.createExt("ShowAddNewButton", oFF.XValueType.BOOLEAN);
	oFF.UiProperty.STATE = oFF.UiProperty.createExt("State", oFF.XValueType.UI_CONSTANT);
	oFF.UiProperty.TAG = oFF.UiProperty.createExt("Tag", oFF.XValueType.STRING);
	oFF.UiProperty.TEXT = oFF.UiProperty.createExt("Text", oFF.XValueType.STRING);
	oFF.UiProperty.TEXT_ALIGN = oFF.UiProperty.createExt("TextAlign", oFF.XValueType.UI_CONSTANT);
	oFF.UiProperty.TEXT_DECORATION = oFF.UiProperty.createExt("TextDecoration", oFF.XValueType.UI_CSS_TEXT_DECORATION);
	oFF.UiProperty.TOOLTIP = oFF.UiProperty.createExt("Tooltip", oFF.XValueType.STRING);
	oFF.UiProperty.TITLE = oFF.UiProperty.createExt("Title", oFF.XValueType.STRING);
	oFF.UiProperty.TILE_MODE = oFF.UiProperty.createExt("TileMode", oFF.XValueType.UI_CONSTANT);
	oFF.UiProperty.VALUE = oFF.UiProperty.createExt("Value", oFF.XValueType.STRING);
	oFF.UiProperty.VALUE_FORMAT = oFF.UiProperty.createExt("ValueFormat", oFF.XValueType.STRING);
	oFF.UiProperty.VALUE_STATE = oFF.UiProperty.createExt("ValueState", oFF.XValueType.UI_CONSTANT);
	oFF.UiProperty.VALUE_STATE_TEXT = oFF.UiProperty.createExt("ValueStateText", oFF.XValueType.STRING);
	oFF.UiProperty.VISIBLE = oFF.UiProperty.createExt("Visible", oFF.XValueType.BOOLEAN);
	oFF.UiProperty.VISIBLE_ROW_COUNT = oFF.UiProperty.createExt("VisibleRowCount", oFF.XValueType.INTEGER);
	oFF.UiProperty.VISIBLE_ROW_COUNT_MODE = oFF.UiProperty.createExt("VisibleRowCountMode", oFF.XValueType.UI_CONSTANT);
	oFF.UiProperty.X_POS = oFF.UiProperty.createExt("X", oFF.XValueType.UI_CSS_LENGTH);
	oFF.UiProperty.Y_POS = oFF.UiProperty.createExt("Y", oFF.XValueType.UI_CSS_LENGTH);
	oFF.UiProperty.WIDTH = oFF.UiProperty.createExt("Width", oFF.XValueType.UI_CSS_LENGTH);
	oFF.UiProperty.WRAP = oFF.UiProperty.createExt("Wrap", oFF.XValueType.UI_CONSTANT);
	oFF.UiProperty.WRAPPING = oFF.UiProperty.createExt("Wrapping", oFF.XValueType.BOOLEAN);
};
oFF.UiProperty.create = function(name)
{
	var newConstant = oFF.UiBaseConstant.createUiBaseConstant(new oFF.UiProperty(), name, oFF.UiProperty.s_lookup);
	return newConstant;
};
oFF.UiProperty.createExt = function(name, valType)
{
	var newConstant = oFF.UiProperty.create(name);
	newConstant.m_valueType = valType;
	newConstant.m_isReadOnly = false;
	return newConstant;
};
oFF.UiProperty.lookup = function(name)
{
	return oFF.UiBaseConstant.lookupConstant(name, oFF.UiProperty.s_lookup);
};
oFF.UiProperty.prototype.m_valueType = null;
oFF.UiProperty.prototype.m_setterMethodName = null;
oFF.UiProperty.prototype.m_getterMethodName = null;
oFF.UiProperty.prototype.m_clearMethodName = null;
oFF.UiProperty.prototype.m_isReadOnly = false;
oFF.UiProperty.prototype.getValueType = function()
{
	return this.m_valueType;
};
oFF.UiProperty.prototype.getSetterMethodName = function()
{
	if (oFF.XStringUtils.isNullOrEmpty(this.m_setterMethodName))
	{
		this.m_setterMethodName = this.generateSetterMethodName();
	}
	return this.m_setterMethodName;
};
oFF.UiProperty.prototype.getGetterMethodName = function()
{
	if (oFF.XStringUtils.isNullOrEmpty(this.m_getterMethodName))
	{
		this.m_getterMethodName = this.generateGetterMethodName();
	}
	return this.m_getterMethodName;
};
oFF.UiProperty.prototype.getClearMethodName = function()
{
	if (oFF.XStringUtils.isNullOrEmpty(this.m_clearMethodName))
	{
		this.m_clearMethodName = this.generateClearMethodName();
	}
	return this.m_clearMethodName;
};
oFF.UiProperty.prototype.isReadOnly = function()
{
	return this.m_isReadOnly;
};
oFF.UiProperty.prototype.generateSetterMethodName = function()
{
	if (this.isReadOnly())
	{
		return null;
	}
	var setterName = oFF.XStringUtils.concatenate2("set", this.getName());
	return setterName;
};
oFF.UiProperty.prototype.generateGetterMethodName = function()
{
	var getterName = oFF.XStringUtils.concatenate2("get", this.getName());
	if (this.getValueType() !== null)
	{
		if (this.getValueType().isEqualTo(oFF.XValueType.BOOLEAN))
		{
			getterName = oFF.XStringUtils.concatenate2("is", this.getName());
		}
	}
	return getterName;
};
oFF.UiProperty.prototype.generateClearMethodName = function()
{
	if (this.getValueType() !== oFF.XValueType.UI_CONTROL)
	{
		return null;
	}
	var clearName = oFF.XStringUtils.concatenate2("clear", this.getName());
	return clearName;
};
oFF.UiProperty.prototype.readOnly = function()
{
	this.m_isReadOnly = true;
	return this;
};

oFF.UiAlignment = function() {};
oFF.UiAlignment.prototype = new oFF.UiAbstractConstant();
oFF.UiAlignment.prototype._ff_c = "UiAlignment";

oFF.UiAlignment.AUTO = null;
oFF.UiAlignment.BEGIN = null;
oFF.UiAlignment.CENTER = null;
oFF.UiAlignment.FIRST_CELL = null;
oFF.UiAlignment.END = null;
oFF.UiAlignment.FORCE_LEFT = null;
oFF.UiAlignment.FORCE_RIGHT = null;
oFF.UiAlignment.BASELINE = null;
oFF.UiAlignment.s_lookup = null;
oFF.UiAlignment.staticSetup = function()
{
	oFF.UiAlignment.s_lookup = oFF.XHashMapByString.create();
	oFF.UiAlignment.AUTO = oFF.UiAlignment.create("Auto");
	oFF.UiAlignment.BEGIN = oFF.UiAlignment.create("Begin");
	oFF.UiAlignment.CENTER = oFF.UiAlignment.create("Center");
	oFF.UiAlignment.FIRST_CELL = oFF.UiAlignment.create("FirstCell");
	oFF.UiAlignment.END = oFF.UiAlignment.create("End");
	oFF.UiAlignment.FORCE_LEFT = oFF.UiAlignment.create("ForceLeft");
	oFF.UiAlignment.FORCE_RIGHT = oFF.UiAlignment.create("ForceRight");
	oFF.UiAlignment.BASELINE = oFF.UiAlignment.create("Baseline");
};
oFF.UiAlignment.create = function(name)
{
	return oFF.UiAbstractConstant.createUiConstant(new oFF.UiAlignment(), name, oFF.UiAlignment.s_lookup);
};
oFF.UiAlignment.lookup = function(name)
{
	return oFF.UiAlignment.s_lookup.getByKey(name);
};

oFF.UiAxisType = function() {};
oFF.UiAxisType.prototype = new oFF.UiAbstractConstant();
oFF.UiAxisType.prototype._ff_c = "UiAxisType";

oFF.UiAxisType.ROWS = null;
oFF.UiAxisType.COLUMNS = null;
oFF.UiAxisType.FREE = null;
oFF.UiAxisType.staticSetup = function()
{
	oFF.UiAxisType.ROWS = oFF.UiAxisType.create("Rows", true);
	oFF.UiAxisType.COLUMNS = oFF.UiAxisType.create("Columns", true);
	oFF.UiAxisType.FREE = oFF.UiAxisType.create("Free", false);
};
oFF.UiAxisType.create = function(name, drill)
{
	var newConstant = oFF.UiAbstractConstant.createUiConstant(new oFF.UiAxisType(), name, null);
	newConstant.m_isDrill = drill;
	return newConstant;
};
oFF.UiAxisType.prototype.m_isDrill = false;
oFF.UiAxisType.prototype.isDrillAxis = function()
{
	return this.m_isDrill;
};

oFF.UiBorderStyle = function() {};
oFF.UiBorderStyle.prototype = new oFF.UiAbstractConstant();
oFF.UiBorderStyle.prototype._ff_c = "UiBorderStyle";

oFF.UiBorderStyle.SOLID = null;
oFF.UiBorderStyle.DOTTED = null;
oFF.UiBorderStyle.DASHED = null;
oFF.UiBorderStyle.DOUBLE = null;
oFF.UiBorderStyle.GROOVE = null;
oFF.UiBorderStyle.RIDGE = null;
oFF.UiBorderStyle.INSET = null;
oFF.UiBorderStyle.OUTSET = null;
oFF.UiBorderStyle.NONE = null;
oFF.UiBorderStyle.s_lookup = null;
oFF.UiBorderStyle.staticSetup = function()
{
	oFF.UiBorderStyle.s_lookup = oFF.XHashMapByString.create();
	oFF.UiBorderStyle.SOLID = oFF.UiBorderStyle.createWithCss("Solid", "solid");
	oFF.UiBorderStyle.DOTTED = oFF.UiBorderStyle.createWithCss("Dotted", "dotted");
	oFF.UiBorderStyle.DASHED = oFF.UiBorderStyle.createWithCss("Dashed", "dashed");
	oFF.UiBorderStyle.DOUBLE = oFF.UiBorderStyle.createWithCss("Double", "double");
	oFF.UiBorderStyle.GROOVE = oFF.UiBorderStyle.createWithCss("Groove", "groove");
	oFF.UiBorderStyle.RIDGE = oFF.UiBorderStyle.createWithCss("Ridge", "ridge");
	oFF.UiBorderStyle.INSET = oFF.UiBorderStyle.createWithCss("Inset", "inset");
	oFF.UiBorderStyle.OUTSET = oFF.UiBorderStyle.createWithCss("Outset", "outset");
	oFF.UiBorderStyle.NONE = oFF.UiBorderStyle.createWithCss("None", "none");
};
oFF.UiBorderStyle.createWithCss = function(name, cssName)
{
	return oFF.UiAbstractConstant.createUiConstantExt(new oFF.UiBorderStyle(), name, cssName, cssName, oFF.UiBorderStyle.s_lookup, null);
};
oFF.UiBorderStyle.lookup = function(value)
{
	var valueUpper = oFF.XString.toUpperCase(value);
	return oFF.UiBorderStyle.s_lookup.getByKey(valueUpper);
};

oFF.UiButtonType = function() {};
oFF.UiButtonType.prototype = new oFF.UiAbstractConstant();
oFF.UiButtonType.prototype._ff_c = "UiButtonType";

oFF.UiButtonType.DEFAULT = null;
oFF.UiButtonType.DESTRUCTIVE = null;
oFF.UiButtonType.SUCCESS = null;
oFF.UiButtonType.TRANSPARENT = null;
oFF.UiButtonType.PRIMARY = null;
oFF.UiButtonType.s_lookup = null;
oFF.UiButtonType.staticSetup = function()
{
	oFF.UiButtonType.s_lookup = oFF.XHashMapByString.create();
	oFF.UiButtonType.DEFAULT = oFF.UiButtonType.create("Default");
	oFF.UiButtonType.DESTRUCTIVE = oFF.UiButtonType.create("Destructive");
	oFF.UiButtonType.SUCCESS = oFF.UiButtonType.create("Success");
	oFF.UiButtonType.TRANSPARENT = oFF.UiButtonType.create("Transparent");
	oFF.UiButtonType.PRIMARY = oFF.UiButtonType.create("Primary");
};
oFF.UiButtonType.create = function(name)
{
	var newConstant = oFF.UiAbstractConstant.createUiConstant(new oFF.UiButtonType(), name, oFF.UiButtonType.s_lookup);
	return newConstant;
};
oFF.UiButtonType.lookup = function(value)
{
	return oFF.UiButtonType.s_lookup.getByKey(value);
};

oFF.UiChartType = function() {};
oFF.UiChartType.prototype = new oFF.UiAbstractConstant();
oFF.UiChartType.prototype._ff_c = "UiChartType";

oFF.UiChartType.COLUMN = null;
oFF.UiChartType.COLUMN_STACKED = null;
oFF.UiChartType.COLUMN_STACKED_100 = null;
oFF.UiChartType.BAR = null;
oFF.UiChartType.AREA_STACKED = null;
oFF.UiChartType.AREA_STACKED_100 = null;
oFF.UiChartType.HORIZONTAL_AREA_STACKED = null;
oFF.UiChartType.HORIZONTAL_AREA_STACKED_100 = null;
oFF.UiChartType.LINE = null;
oFF.UiChartType.PIE = null;
oFF.UiChartType.DONUT = null;
oFF.UiChartType.SCATTER = null;
oFF.UiChartType.BUBBLE = null;
oFF.UiChartType.HEATMAP = null;
oFF.UiChartType.TREEMAP = null;
oFF.UiChartType.s_lookup = null;
oFF.UiChartType.staticSetup = function()
{
	oFF.UiChartType.s_lookup = oFF.XHashMapByString.create();
	oFF.UiChartType.COLUMN = oFF.UiChartType.create("Column");
	oFF.UiChartType.COLUMN_STACKED = oFF.UiChartType.create("ColumnStacked");
	oFF.UiChartType.COLUMN_STACKED_100 = oFF.UiChartType.create("ColumnStacked100");
	oFF.UiChartType.BAR = oFF.UiChartType.create("Bar");
	oFF.UiChartType.AREA_STACKED = oFF.UiChartType.create("AreaStacked");
	oFF.UiChartType.AREA_STACKED_100 = oFF.UiChartType.create("AreaStacked100");
	oFF.UiChartType.HORIZONTAL_AREA_STACKED = oFF.UiChartType.create("HorizontalAreaStacked");
	oFF.UiChartType.HORIZONTAL_AREA_STACKED_100 = oFF.UiChartType.create("HorizontalAreaStacked100");
	oFF.UiChartType.LINE = oFF.UiChartType.create("Line");
	oFF.UiChartType.PIE = oFF.UiChartType.create("Pie");
	oFF.UiChartType.DONUT = oFF.UiChartType.create("Donut");
	oFF.UiChartType.SCATTER = oFF.UiChartType.create("Scatter");
	oFF.UiChartType.BUBBLE = oFF.UiChartType.create("Bubble");
	oFF.UiChartType.HEATMAP = oFF.UiChartType.create("Heatmap");
	oFF.UiChartType.TREEMAP = oFF.UiChartType.create("Treemap");
};
oFF.UiChartType.create = function(name)
{
	return oFF.UiAbstractConstant.createUiConstantExt(new oFF.UiChartType(), name, null, null, oFF.UiChartType.s_lookup, null);
};

oFF.UiClientType = function() {};
oFF.UiClientType.prototype = new oFF.UiAbstractConstant();
oFF.UiClientType.prototype._ff_c = "UiClientType";

oFF.UiClientType.GENERIC = null;
oFF.UiClientType.HTML = null;
oFF.UiClientType.PDF = null;
oFF.UiClientType.POSTSCRIPT = null;
oFF.UiClientType.PCL = null;
oFF.UiClientType.EXCEL = null;
oFF.UiClientType.EXCEL_2000 = null;
oFF.UiClientType.CSV = null;
oFF.UiClientType.staticSetup = function()
{
	oFF.UiClientType.GENERIC = oFF.UiAbstractConstant.createUiConstant(new oFF.UiClientType(), "Generic", null);
	oFF.UiClientType.HTML = oFF.UiAbstractConstant.createUiConstant(new oFF.UiClientType(), "Html", null);
	oFF.UiClientType.PDF = oFF.UiAbstractConstant.createUiConstant(new oFF.UiClientType(), "Pdf", null);
	oFF.UiClientType.POSTSCRIPT = oFF.UiAbstractConstant.createUiConstant(new oFF.UiClientType(), "Postscript", null);
	oFF.UiClientType.PCL = oFF.UiAbstractConstant.createUiConstant(new oFF.UiClientType(), "Pcl", null);
	oFF.UiClientType.EXCEL = oFF.UiAbstractConstant.createUiConstant(new oFF.UiClientType(), "Excel", null);
	oFF.UiClientType.EXCEL_2000 = oFF.UiAbstractConstant.createUiConstant(new oFF.UiClientType(), "Excel2000", null);
	oFF.UiClientType.CSV = oFF.UiAbstractConstant.createUiConstant(new oFF.UiClientType(), "Csv", null);
};

oFF.UiComponentType = function() {};
oFF.UiComponentType.prototype = new oFF.XComponentType();
oFF.UiComponentType.prototype._ff_c = "UiComponentType";

oFF.UiComponentType.UI_PROPERTY_OP = null;
oFF.UiComponentType.UI_PROPERTY_OP_BOOL = null;
oFF.UiComponentType.UI_PROPERTY_OP_INT = null;
oFF.UiComponentType.UI_PROPERTY_OP_DOUBLE = null;
oFF.UiComponentType.UI_PROPERTY_OP_STRING = null;
oFF.UiComponentType.UI_PROPERTY_OP_CONSTANT = null;
oFF.UiComponentType.UI_PROPERTY_OP_JSON = null;
oFF.UiComponentType.UI_PROPERTY_OP_CONTROL = null;
oFF.UiComponentType.UI_CONTROL = null;
oFF.UiComponentType.staticSetupUiComponentType = function()
{
	oFF.UiComponentType.UI_PROPERTY_OP = oFF.UiComponentType.createUiComponentType("UiPropertyOp", oFF.XComponentType._UI);
	oFF.UiComponentType.UI_PROPERTY_OP_BOOL = oFF.UiComponentType.createUiComponentType("UiPropertyOpBool", oFF.UiComponentType.UI_PROPERTY_OP);
	oFF.UiComponentType.UI_PROPERTY_OP_INT = oFF.UiComponentType.createUiComponentType("UiPropertyOpInt", oFF.UiComponentType.UI_PROPERTY_OP);
	oFF.UiComponentType.UI_PROPERTY_OP_DOUBLE = oFF.UiComponentType.createUiComponentType("UiPropertyOpDouble", oFF.UiComponentType.UI_PROPERTY_OP);
	oFF.UiComponentType.UI_PROPERTY_OP_STRING = oFF.UiComponentType.createUiComponentType("UiPropertyOpString", oFF.UiComponentType.UI_PROPERTY_OP);
	oFF.UiComponentType.UI_PROPERTY_OP_CONSTANT = oFF.UiComponentType.createUiComponentType("UiPropertyOpConstant", oFF.UiComponentType.UI_PROPERTY_OP_STRING);
	oFF.UiComponentType.UI_PROPERTY_OP_JSON = oFF.UiComponentType.createUiComponentType("UiPropertyOpJson", oFF.UiComponentType.UI_PROPERTY_OP);
	oFF.UiComponentType.UI_PROPERTY_OP_CONTROL = oFF.UiComponentType.createUiComponentType("UiPropertyOpControl", oFF.UiComponentType.UI_PROPERTY_OP_STRING);
	oFF.UiComponentType.UI_CONTROL = oFF.UiComponentType.createUiComponentType("UiControl", oFF.XComponentType._UI);
};
oFF.UiComponentType.createUiComponentType = function(constant, parent)
{
	var mt = new oFF.UiComponentType();
	if (oFF.isNull(parent))
	{
		mt.setupExt(constant, oFF.XComponentType._UI);
	}
	else
	{
		mt.setupExt(constant, parent);
	}
	return mt;
};

oFF.UiCssSizeUnit = function() {};
oFF.UiCssSizeUnit.prototype = new oFF.UiAbstractConstant();
oFF.UiCssSizeUnit.prototype._ff_c = "UiCssSizeUnit";

oFF.UiCssSizeUnit.POINT = null;
oFF.UiCssSizeUnit.PIXEL = null;
oFF.UiCssSizeUnit.PICA = null;
oFF.UiCssSizeUnit.EM = null;
oFF.UiCssSizeUnit.REM = null;
oFF.UiCssSizeUnit.VW = null;
oFF.UiCssSizeUnit.VH = null;
oFF.UiCssSizeUnit.VMIN = null;
oFF.UiCssSizeUnit.VMAX = null;
oFF.UiCssSizeUnit.PERCENT = null;
oFF.UiCssSizeUnit.s_lookup = null;
oFF.UiCssSizeUnit.staticSetup = function()
{
	oFF.UiCssSizeUnit.s_lookup = oFF.XHashMapByString.create();
	oFF.UiCssSizeUnit.POINT = oFF.UiCssSizeUnit.createWithCss("Point", "pt");
	oFF.UiCssSizeUnit.PIXEL = oFF.UiCssSizeUnit.createWithCss("Pixel", "px");
	oFF.UiCssSizeUnit.PICA = oFF.UiCssSizeUnit.createWithCss("Pica", "pc");
	oFF.UiCssSizeUnit.PERCENT = oFF.UiCssSizeUnit.createWithCss("Percent", "%");
	oFF.UiCssSizeUnit.EM = oFF.UiCssSizeUnit.createWithCss("Em", "em");
	oFF.UiCssSizeUnit.REM = oFF.UiCssSizeUnit.createWithCss("Rem", "rem");
	oFF.UiCssSizeUnit.VW = oFF.UiCssSizeUnit.createWithCss("Vw", "vw");
	oFF.UiCssSizeUnit.VH = oFF.UiCssSizeUnit.createWithCss("Vh", "vh");
	oFF.UiCssSizeUnit.VMIN = oFF.UiCssSizeUnit.createWithCss("Vmin", "vmin");
	oFF.UiCssSizeUnit.VMAX = oFF.UiCssSizeUnit.createWithCss("Vmax", "vmax");
};
oFF.UiCssSizeUnit.createWithCss = function(name, cssName)
{
	return oFF.UiAbstractConstant.createUiConstantExt(new oFF.UiCssSizeUnit(), name, cssName, cssName, oFF.UiCssSizeUnit.s_lookup, null);
};
oFF.UiCssSizeUnit.lookup = function(name)
{
	return oFF.UiCssSizeUnit.s_lookup.getByKey(name);
};

oFF.UiDeviceEnvironment = function() {};
oFF.UiDeviceEnvironment.prototype = new oFF.UiAbstractConstant();
oFF.UiDeviceEnvironment.prototype._ff_c = "UiDeviceEnvironment";

oFF.UiDeviceEnvironment.UNKNOWN = null;
oFF.UiDeviceEnvironment.NATIVE = null;
oFF.UiDeviceEnvironment.BROWSER = null;
oFF.UiDeviceEnvironment.s_lookup = null;
oFF.UiDeviceEnvironment.staticSetup = function()
{
	oFF.UiDeviceEnvironment.s_lookup = oFF.XHashMapByString.create();
	oFF.UiDeviceEnvironment.UNKNOWN = oFF.UiDeviceEnvironment.create("Unknown");
	oFF.UiDeviceEnvironment.NATIVE = oFF.UiDeviceEnvironment.create("Native");
	oFF.UiDeviceEnvironment.BROWSER = oFF.UiDeviceEnvironment.create("Browser");
};
oFF.UiDeviceEnvironment.create = function(name)
{
	return oFF.UiAbstractConstant.createUiConstant(new oFF.UiDeviceEnvironment(), name, oFF.UiDeviceEnvironment.s_lookup);
};
oFF.UiDeviceEnvironment.lookup = function(name)
{
	return oFF.UiDeviceEnvironment.s_lookup.getByKey(name);
};
oFF.UiDeviceEnvironment.lookupWithDefault = function(name, defaultDeviceEnvironment)
{
	var tmpDeviceEnvironment = oFF.UiDeviceEnvironment.s_lookup.getByKey(name);
	if (oFF.notNull(tmpDeviceEnvironment))
	{
		return tmpDeviceEnvironment;
	}
	return defaultDeviceEnvironment;
};

oFF.UiDeviceFramework = function() {};
oFF.UiDeviceFramework.prototype = new oFF.UiAbstractConstant();
oFF.UiDeviceFramework.prototype._ff_c = "UiDeviceFramework";

oFF.UiDeviceFramework.UNKNOWN = null;
oFF.UiDeviceFramework.APPLE_UIKIT = null;
oFF.UiDeviceFramework.UI5 = null;
oFF.UiDeviceFramework.ORCA_REACT = null;
oFF.UiDeviceFramework.OFFICE_UI_FABRIC = null;
oFF.UiDeviceFramework.s_lookup = null;
oFF.UiDeviceFramework.staticSetup = function()
{
	oFF.UiDeviceFramework.s_lookup = oFF.XHashMapByString.create();
	oFF.UiDeviceFramework.UNKNOWN = oFF.UiDeviceFramework.create("Unknown");
	oFF.UiDeviceFramework.APPLE_UIKIT = oFF.UiDeviceFramework.create("AppleUiKit");
	oFF.UiDeviceFramework.UI5 = oFF.UiDeviceFramework.create("Ui5");
	oFF.UiDeviceFramework.ORCA_REACT = oFF.UiDeviceFramework.create("OrcaReact");
	oFF.UiDeviceFramework.OFFICE_UI_FABRIC = oFF.UiDeviceFramework.create("OfficeUiFabric");
};
oFF.UiDeviceFramework.create = function(name)
{
	return oFF.UiAbstractConstant.createUiConstant(new oFF.UiDeviceFramework(), name, oFF.UiDeviceFramework.s_lookup);
};
oFF.UiDeviceFramework.lookup = function(name)
{
	return oFF.UiDeviceFramework.s_lookup.getByKey(name);
};
oFF.UiDeviceFramework.lookupWithDefault = function(name, defaultDeviceFramework)
{
	var tmpDeviceFramework = oFF.UiDeviceFramework.s_lookup.getByKey(name);
	if (oFF.notNull(tmpDeviceFramework))
	{
		return tmpDeviceFramework;
	}
	return defaultDeviceFramework;
};

oFF.UiDeviceOs = function() {};
oFF.UiDeviceOs.prototype = new oFF.UiAbstractConstant();
oFF.UiDeviceOs.prototype._ff_c = "UiDeviceOs";

oFF.UiDeviceOs.UNKNOWN = null;
oFF.UiDeviceOs.MACOS = null;
oFF.UiDeviceOs.IOS = null;
oFF.UiDeviceOs.WINDOWS = null;
oFF.UiDeviceOs.ANDROID = null;
oFF.UiDeviceOs.LINUX = null;
oFF.UiDeviceOs.s_lookup = null;
oFF.UiDeviceOs.staticSetup = function()
{
	oFF.UiDeviceOs.s_lookup = oFF.XHashMapByString.create();
	oFF.UiDeviceOs.UNKNOWN = oFF.UiDeviceOs.create("Unknown");
	oFF.UiDeviceOs.MACOS = oFF.UiDeviceOs.create("MacOS");
	oFF.UiDeviceOs.IOS = oFF.UiDeviceOs.create("iOS");
	oFF.UiDeviceOs.WINDOWS = oFF.UiDeviceOs.create("Windows");
	oFF.UiDeviceOs.ANDROID = oFF.UiDeviceOs.create("Android");
	oFF.UiDeviceOs.LINUX = oFF.UiDeviceOs.create("Linux");
};
oFF.UiDeviceOs.create = function(name)
{
	return oFF.UiAbstractConstant.createUiConstant(new oFF.UiDeviceOs(), name, oFF.UiDeviceOs.s_lookup);
};
oFF.UiDeviceOs.lookup = function(name)
{
	return oFF.UiDeviceOs.s_lookup.getByKey(name);
};
oFF.UiDeviceOs.lookupWithDefault = function(name, defaultDeviceOs)
{
	var tmpDeviceOs = oFF.UiDeviceOs.s_lookup.getByKey(name);
	if (oFF.notNull(tmpDeviceOs))
	{
		return tmpDeviceOs;
	}
	return defaultDeviceOs;
};

oFF.UiDeviceType = function() {};
oFF.UiDeviceType.prototype = new oFF.UiAbstractConstant();
oFF.UiDeviceType.prototype._ff_c = "UiDeviceType";

oFF.UiDeviceType.UNKNOWN = null;
oFF.UiDeviceType.SMARTPHONE = null;
oFF.UiDeviceType.TABLET = null;
oFF.UiDeviceType.DESKTOP = null;
oFF.UiDeviceType.s_lookup = null;
oFF.UiDeviceType.staticSetup = function()
{
	oFF.UiDeviceType.s_lookup = oFF.XHashMapByString.create();
	oFF.UiDeviceType.UNKNOWN = oFF.UiDeviceType.create("Unknown");
	oFF.UiDeviceType.SMARTPHONE = oFF.UiDeviceType.create("Smartphone");
	oFF.UiDeviceType.TABLET = oFF.UiDeviceType.create("Tablet");
	oFF.UiDeviceType.DESKTOP = oFF.UiDeviceType.create("Desktop");
};
oFF.UiDeviceType.create = function(name)
{
	return oFF.UiAbstractConstant.createUiConstant(new oFF.UiDeviceType(), name, oFF.UiDeviceType.s_lookup);
};
oFF.UiDeviceType.lookup = function(name)
{
	return oFF.UiDeviceType.s_lookup.getByKey(name);
};
oFF.UiDeviceType.lookupWithDefault = function(name, defaultDeviceType)
{
	var tmpDeviceType = oFF.UiDeviceType.s_lookup.getByKey(name);
	if (oFF.notNull(tmpDeviceType))
	{
		return tmpDeviceType;
	}
	return defaultDeviceType;
};

oFF.UiDrillState = function() {};
oFF.UiDrillState.prototype = new oFF.UiAbstractConstant();
oFF.UiDrillState.prototype._ff_c = "UiDrillState";

oFF.UiDrillState.EXPANDED = null;
oFF.UiDrillState.EXPANDED_DOWN = null;
oFF.UiDrillState.EXPANDED_UP = null;
oFF.UiDrillState.COLLAPSED = null;
oFF.UiDrillState.LEAF = null;
oFF.UiDrillState.ATTRIBUTE = null;
oFF.UiDrillState.staticSetup = function()
{
	oFF.UiDrillState.EXPANDED = oFF.UiDrillState.create("Expanded", null);
	oFF.UiDrillState.EXPANDED_DOWN = oFF.UiDrillState.create("ExpandedDown", oFF.UiDrillState.EXPANDED);
	oFF.UiDrillState.EXPANDED_UP = oFF.UiDrillState.create("ExpandedUp", oFF.UiDrillState.EXPANDED);
	oFF.UiDrillState.COLLAPSED = oFF.UiDrillState.create("Collapsed", null);
	oFF.UiDrillState.LEAF = oFF.UiDrillState.create("Leaf", null);
	oFF.UiDrillState.ATTRIBUTE = oFF.UiDrillState.create("Attribute", null);
};
oFF.UiDrillState.create = function(constant, parent)
{
	return oFF.UiAbstractConstant.createUiConstantExt(new oFF.UiDrillState(), constant, null, null, null, parent);
};

oFF.UiDropEffect = function() {};
oFF.UiDropEffect.prototype = new oFF.UiAbstractConstant();
oFF.UiDropEffect.prototype._ff_c = "UiDropEffect";

oFF.UiDropEffect.COPY = null;
oFF.UiDropEffect.LINK = null;
oFF.UiDropEffect.MOVE = null;
oFF.UiDropEffect.NONE = null;
oFF.UiDropEffect.s_lookup = null;
oFF.UiDropEffect.staticSetup = function()
{
	oFF.UiDropEffect.s_lookup = oFF.XHashMapByString.create();
	oFF.UiDropEffect.COPY = oFF.UiDropEffect.create("Copy");
	oFF.UiDropEffect.LINK = oFF.UiDropEffect.create("Link");
	oFF.UiDropEffect.MOVE = oFF.UiDropEffect.create("Move");
	oFF.UiDropEffect.NONE = oFF.UiDropEffect.create("None");
};
oFF.UiDropEffect.create = function(name)
{
	var newConstant = oFF.UiAbstractConstant.createUiConstant(new oFF.UiDropEffect(), name, oFF.UiDropEffect.s_lookup);
	return newConstant;
};
oFF.UiDropEffect.lookup = function(value)
{
	var valueUpper = oFF.XString.toUpperCase(value);
	return oFF.UiDropEffect.s_lookup.getByKey(valueUpper);
};

oFF.UiDropLayout = function() {};
oFF.UiDropLayout.prototype = new oFF.UiAbstractConstant();
oFF.UiDropLayout.prototype._ff_c = "UiDropLayout";

oFF.UiDropLayout.DEFAULT = null;
oFF.UiDropLayout.HORIZONTAL = null;
oFF.UiDropLayout.VERTICAL = null;
oFF.UiDropLayout.s_lookup = null;
oFF.UiDropLayout.staticSetup = function()
{
	oFF.UiDropLayout.s_lookup = oFF.XHashMapByString.create();
	oFF.UiDropLayout.DEFAULT = oFF.UiDropLayout.create("Default");
	oFF.UiDropLayout.HORIZONTAL = oFF.UiDropLayout.create("Horizontal");
	oFF.UiDropLayout.VERTICAL = oFF.UiDropLayout.create("Vertical");
};
oFF.UiDropLayout.create = function(name)
{
	var newConstant = oFF.UiAbstractConstant.createUiConstant(new oFF.UiDropLayout(), name, oFF.UiDropLayout.s_lookup);
	return newConstant;
};
oFF.UiDropLayout.lookup = function(value)
{
	var valueUpper = oFF.XString.toUpperCase(value);
	return oFF.UiDropLayout.s_lookup.getByKey(valueUpper);
};

oFF.UiDropPosition = function() {};
oFF.UiDropPosition.prototype = new oFF.UiAbstractConstant();
oFF.UiDropPosition.prototype._ff_c = "UiDropPosition";

oFF.UiDropPosition.BETWEEN = null;
oFF.UiDropPosition.ON = null;
oFF.UiDropPosition.ON_OR_BETWEEN = null;
oFF.UiDropPosition.s_lookup = null;
oFF.UiDropPosition.staticSetup = function()
{
	oFF.UiDropPosition.s_lookup = oFF.XHashMapByString.create();
	oFF.UiDropPosition.BETWEEN = oFF.UiDropPosition.create("Between");
	oFF.UiDropPosition.ON = oFF.UiDropPosition.create("On");
	oFF.UiDropPosition.ON_OR_BETWEEN = oFF.UiDropPosition.create("OnOrBetween");
};
oFF.UiDropPosition.create = function(name)
{
	var newConstant = oFF.UiAbstractConstant.createUiConstant(new oFF.UiDropPosition(), name, oFF.UiDropPosition.s_lookup);
	return newConstant;
};
oFF.UiDropPosition.lookup = function(value)
{
	var valueUpper = oFF.XString.toUpperCase(value);
	return oFF.UiDropPosition.s_lookup.getByKey(valueUpper);
};

oFF.UiExtension = function() {};
oFF.UiExtension.prototype = new oFF.UiAbstractConstant();
oFF.UiExtension.prototype._ff_c = "UiExtension";

oFF.UiExtension.CENTER = null;
oFF.UiExtension.BEGIN = null;
oFF.UiExtension.END = null;
oFF.UiExtension.TOP = null;
oFF.UiExtension.BOTTOM = null;
oFF.UiExtension.staticSetup = function()
{
	oFF.UiExtension.CENTER = oFF.UiAbstractConstant.createUiConstant(new oFF.UiExtension(), "Center", null);
	oFF.UiExtension.BEGIN = oFF.UiAbstractConstant.createUiConstant(new oFF.UiExtension(), "Begin", null);
	oFF.UiExtension.END = oFF.UiAbstractConstant.createUiConstant(new oFF.UiExtension(), "End", null);
	oFF.UiExtension.TOP = oFF.UiAbstractConstant.createUiConstant(new oFF.UiExtension(), "Top", null);
	oFF.UiExtension.BOTTOM = oFF.UiAbstractConstant.createUiConstant(new oFF.UiExtension(), "Bottom", null);
};

oFF.UiFlexAlignContent = function() {};
oFF.UiFlexAlignContent.prototype = new oFF.UiAbstractConstant();
oFF.UiFlexAlignContent.prototype._ff_c = "UiFlexAlignContent";

oFF.UiFlexAlignContent.CENTER = null;
oFF.UiFlexAlignContent.END = null;
oFF.UiFlexAlignContent.SPACE_AROUND = null;
oFF.UiFlexAlignContent.SPACE_BETWEEN = null;
oFF.UiFlexAlignContent.START = null;
oFF.UiFlexAlignContent.STRETCH = null;
oFF.UiFlexAlignContent.INHERIT = null;
oFF.UiFlexAlignContent.s_lookup = null;
oFF.UiFlexAlignContent.staticSetup = function()
{
	oFF.UiFlexAlignContent.s_lookup = oFF.XHashMapByString.create();
	oFF.UiFlexAlignContent.CENTER = oFF.UiFlexAlignContent.create("Center");
	oFF.UiFlexAlignContent.END = oFF.UiFlexAlignContent.create("End");
	oFF.UiFlexAlignContent.SPACE_AROUND = oFF.UiFlexAlignContent.create("SpaceAround");
	oFF.UiFlexAlignContent.SPACE_BETWEEN = oFF.UiFlexAlignContent.create("SpaceBetween");
	oFF.UiFlexAlignContent.START = oFF.UiFlexAlignContent.create("Start");
	oFF.UiFlexAlignContent.STRETCH = oFF.UiFlexAlignContent.create("Stretch");
	oFF.UiFlexAlignContent.INHERIT = oFF.UiFlexAlignContent.create("Inherit");
};
oFF.UiFlexAlignContent.create = function(name)
{
	var newConstant = oFF.UiAbstractConstant.createUiConstant(new oFF.UiFlexAlignContent(), name, oFF.UiFlexAlignContent.s_lookup);
	return newConstant;
};
oFF.UiFlexAlignContent.lookup = function(value)
{
	var valueUpper = oFF.XString.toUpperCase(value);
	return oFF.UiFlexAlignContent.s_lookup.getByKey(valueUpper);
};

oFF.UiFlexAlignItems = function() {};
oFF.UiFlexAlignItems.prototype = new oFF.UiAbstractConstant();
oFF.UiFlexAlignItems.prototype._ff_c = "UiFlexAlignItems";

oFF.UiFlexAlignItems.BASELINE = null;
oFF.UiFlexAlignItems.CENTER = null;
oFF.UiFlexAlignItems.END = null;
oFF.UiFlexAlignItems.START = null;
oFF.UiFlexAlignItems.STRETCH = null;
oFF.UiFlexAlignItems.INHERIT = null;
oFF.UiFlexAlignItems.s_lookup = null;
oFF.UiFlexAlignItems.staticSetup = function()
{
	oFF.UiFlexAlignItems.s_lookup = oFF.XHashMapByString.create();
	oFF.UiFlexAlignItems.BASELINE = oFF.UiFlexAlignItems.create("Baseline");
	oFF.UiFlexAlignItems.CENTER = oFF.UiFlexAlignItems.create("Center");
	oFF.UiFlexAlignItems.END = oFF.UiFlexAlignItems.create("End");
	oFF.UiFlexAlignItems.START = oFF.UiFlexAlignItems.create("Start");
	oFF.UiFlexAlignItems.STRETCH = oFF.UiFlexAlignItems.create("Stretch");
	oFF.UiFlexAlignItems.INHERIT = oFF.UiFlexAlignItems.create("Inherit");
};
oFF.UiFlexAlignItems.create = function(name)
{
	var newConstant = oFF.UiAbstractConstant.createUiConstant(new oFF.UiFlexAlignItems(), name, oFF.UiFlexAlignItems.s_lookup);
	return newConstant;
};
oFF.UiFlexAlignItems.lookup = function(value)
{
	var valueUpper = oFF.XString.toUpperCase(value);
	return oFF.UiFlexAlignItems.s_lookup.getByKey(valueUpper);
};

oFF.UiFlexAlignSelf = function() {};
oFF.UiFlexAlignSelf.prototype = new oFF.UiAbstractConstant();
oFF.UiFlexAlignSelf.prototype._ff_c = "UiFlexAlignSelf";

oFF.UiFlexAlignSelf.AUTO = null;
oFF.UiFlexAlignSelf.BASELINE = null;
oFF.UiFlexAlignSelf.CENTER = null;
oFF.UiFlexAlignSelf.END = null;
oFF.UiFlexAlignSelf.START = null;
oFF.UiFlexAlignSelf.FLEX_END = null;
oFF.UiFlexAlignSelf.FLEX_START = null;
oFF.UiFlexAlignSelf.STRETCH = null;
oFF.UiFlexAlignSelf.s_lookup = null;
oFF.UiFlexAlignSelf.staticSetup = function()
{
	oFF.UiFlexAlignSelf.s_lookup = oFF.XHashMapByString.create();
	oFF.UiFlexAlignSelf.AUTO = oFF.UiFlexAlignSelf.createWithCss("Auto", "auto");
	oFF.UiFlexAlignSelf.BASELINE = oFF.UiFlexAlignSelf.createWithCss("Baseline", "baseline");
	oFF.UiFlexAlignSelf.CENTER = oFF.UiFlexAlignSelf.createWithCss("Center", "center");
	oFF.UiFlexAlignSelf.END = oFF.UiFlexAlignSelf.createWithCss("End", "end");
	oFF.UiFlexAlignSelf.START = oFF.UiFlexAlignSelf.createWithCss("Start", "start");
	oFF.UiFlexAlignSelf.FLEX_END = oFF.UiFlexAlignSelf.createWithCss("FlexEnd", "flex-end");
	oFF.UiFlexAlignSelf.FLEX_START = oFF.UiFlexAlignSelf.createWithCss("FlexStart", "flex-start");
	oFF.UiFlexAlignSelf.STRETCH = oFF.UiFlexAlignSelf.createWithCss("Stretch", "stretch");
};
oFF.UiFlexAlignSelf.createWithCss = function(name, cssValue)
{
	var newConstant = oFF.UiAbstractConstant.createUiConstantExt(new oFF.UiFlexAlignSelf(), name, cssValue, cssValue, oFF.UiFlexAlignSelf.s_lookup, null);
	return newConstant;
};
oFF.UiFlexAlignSelf.lookup = function(value)
{
	var valueUpper = oFF.XString.toUpperCase(value);
	return oFF.UiFlexAlignSelf.s_lookup.getByKey(valueUpper);
};

oFF.UiFlexDirection = function() {};
oFF.UiFlexDirection.prototype = new oFF.UiAbstractConstant();
oFF.UiFlexDirection.prototype._ff_c = "UiFlexDirection";

oFF.UiFlexDirection.ROW = null;
oFF.UiFlexDirection.ROW_REVERSE = null;
oFF.UiFlexDirection.COLUMN = null;
oFF.UiFlexDirection.COLUMN_REVERSE = null;
oFF.UiFlexDirection.INHERIT = null;
oFF.UiFlexDirection.s_lookup = null;
oFF.UiFlexDirection.staticSetup = function()
{
	oFF.UiFlexDirection.s_lookup = oFF.XHashMapByString.create();
	oFF.UiFlexDirection.ROW = oFF.UiFlexDirection.create("Row");
	oFF.UiFlexDirection.ROW_REVERSE = oFF.UiFlexDirection.create("RowReverse");
	oFF.UiFlexDirection.COLUMN = oFF.UiFlexDirection.create("Column");
	oFF.UiFlexDirection.COLUMN_REVERSE = oFF.UiFlexDirection.create("ColumnReverse");
	oFF.UiFlexDirection.INHERIT = oFF.UiFlexDirection.create("Inherit");
};
oFF.UiFlexDirection.create = function(name)
{
	var newConstant = oFF.UiAbstractConstant.createUiConstant(new oFF.UiFlexDirection(), name, oFF.UiFlexDirection.s_lookup);
	return newConstant;
};
oFF.UiFlexDirection.lookup = function(value)
{
	var valueUpper = oFF.XString.toUpperCase(value);
	return oFF.UiFlexDirection.s_lookup.getByKey(valueUpper);
};

oFF.UiFlexJustifyContent = function() {};
oFF.UiFlexJustifyContent.prototype = new oFF.UiAbstractConstant();
oFF.UiFlexJustifyContent.prototype._ff_c = "UiFlexJustifyContent";

oFF.UiFlexJustifyContent.CENTER = null;
oFF.UiFlexJustifyContent.END = null;
oFF.UiFlexJustifyContent.SPACE_AROUND = null;
oFF.UiFlexJustifyContent.SPACE_BETWEEN = null;
oFF.UiFlexJustifyContent.START = null;
oFF.UiFlexJustifyContent.INHERIT = null;
oFF.UiFlexJustifyContent.s_lookup = null;
oFF.UiFlexJustifyContent.staticSetup = function()
{
	oFF.UiFlexJustifyContent.s_lookup = oFF.XHashMapByString.create();
	oFF.UiFlexJustifyContent.CENTER = oFF.UiFlexJustifyContent.create("Center");
	oFF.UiFlexJustifyContent.END = oFF.UiFlexJustifyContent.create("End");
	oFF.UiFlexJustifyContent.SPACE_AROUND = oFF.UiFlexJustifyContent.create("SpaceAround");
	oFF.UiFlexJustifyContent.SPACE_BETWEEN = oFF.UiFlexJustifyContent.create("SpaceBetween");
	oFF.UiFlexJustifyContent.START = oFF.UiFlexJustifyContent.create("Start");
	oFF.UiFlexJustifyContent.INHERIT = oFF.UiFlexJustifyContent.create("Inherit");
};
oFF.UiFlexJustifyContent.create = function(name)
{
	var newConstant = oFF.UiAbstractConstant.createUiConstant(new oFF.UiFlexJustifyContent(), name, oFF.UiFlexJustifyContent.s_lookup);
	return newConstant;
};
oFF.UiFlexJustifyContent.lookup = function(value)
{
	var valueUpper = oFF.XString.toUpperCase(value);
	return oFF.UiFlexJustifyContent.s_lookup.getByKey(valueUpper);
};

oFF.UiFlexWrap = function() {};
oFF.UiFlexWrap.prototype = new oFF.UiAbstractConstant();
oFF.UiFlexWrap.prototype._ff_c = "UiFlexWrap";

oFF.UiFlexWrap.NO_WRAP = null;
oFF.UiFlexWrap.WRAP = null;
oFF.UiFlexWrap.WRAP_REVERSE = null;
oFF.UiFlexWrap.s_lookup = null;
oFF.UiFlexWrap.staticSetup = function()
{
	oFF.UiFlexWrap.s_lookup = oFF.XHashMapByString.create();
	oFF.UiFlexWrap.NO_WRAP = oFF.UiFlexWrap.create("NoWrap");
	oFF.UiFlexWrap.WRAP = oFF.UiFlexWrap.create("Wrap");
	oFF.UiFlexWrap.WRAP_REVERSE = oFF.UiFlexWrap.create("WrapReverse");
};
oFF.UiFlexWrap.create = function(name)
{
	var newConstant = oFF.UiAbstractConstant.createUiConstant(new oFF.UiFlexWrap(), name, oFF.UiFlexWrap.s_lookup);
	return newConstant;
};
oFF.UiFlexWrap.lookup = function(value)
{
	var valueUpper = oFF.XString.toUpperCase(value);
	return oFF.UiFlexWrap.s_lookup.getByKey(valueUpper);
};

oFF.UiFontStyle = function() {};
oFF.UiFontStyle.prototype = new oFF.UiAbstractConstant();
oFF.UiFontStyle.prototype._ff_c = "UiFontStyle";

oFF.UiFontStyle.NORMAL = null;
oFF.UiFontStyle.ITALIC = null;
oFF.UiFontStyle.s_lookup = null;
oFF.UiFontStyle.staticSetup = function()
{
	oFF.UiFontStyle.s_lookup = oFF.XHashMapByString.create();
	oFF.UiFontStyle.NORMAL = oFF.UiFontStyle.createWithCss("Normal", "normal");
	oFF.UiFontStyle.ITALIC = oFF.UiFontStyle.createWithCss("Italic", "italic");
};
oFF.UiFontStyle.createWithCss = function(name, cssValue)
{
	var newConstant = oFF.UiAbstractConstant.createUiConstantExt(new oFF.UiFontStyle(), name, null, cssValue, oFF.UiFontStyle.s_lookup, null);
	return newConstant;
};
oFF.UiFontStyle.lookup = function(value)
{
	var valueUpper = oFF.XString.toUpperCase(value);
	return oFF.UiFontStyle.s_lookup.getByKey(valueUpper);
};

oFF.UiFontWeight = function() {};
oFF.UiFontWeight.prototype = new oFF.UiAbstractConstant();
oFF.UiFontWeight.prototype._ff_c = "UiFontWeight";

oFF.UiFontWeight.NORMAL = null;
oFF.UiFontWeight.BOLD = null;
oFF.UiFontWeight.s_lookup = null;
oFF.UiFontWeight.staticSetup = function()
{
	oFF.UiFontWeight.s_lookup = oFF.XHashMapByString.create();
	oFF.UiFontWeight.NORMAL = oFF.UiFontWeight.createWithCss("Normal", "normal");
	oFF.UiFontWeight.BOLD = oFF.UiFontWeight.createWithCss("Bold", "bold");
};
oFF.UiFontWeight.createWithCss = function(name, cssValue)
{
	var newConstant = oFF.UiAbstractConstant.createUiConstantExt(new oFF.UiFontWeight(), name, null, cssValue, oFF.UiFontWeight.s_lookup, null);
	return newConstant;
};
oFF.UiFontWeight.lookup = function(value)
{
	var valueUpper = oFF.XString.toUpperCase(value);
	return oFF.UiFontWeight.s_lookup.getByKey(valueUpper);
};

oFF.UiFrameType = function() {};
oFF.UiFrameType.prototype = new oFF.UiAbstractConstant();
oFF.UiFrameType.prototype._ff_c = "UiFrameType";

oFF.UiFrameType.AUTO = null;
oFF.UiFrameType.ONE_BY_HALF = null;
oFF.UiFrameType.ONE_BY_ONE = null;
oFF.UiFrameType.TWO_BY_HALF = null;
oFF.UiFrameType.TWO_BY_ONE = null;
oFF.UiFrameType.s_lookup = null;
oFF.UiFrameType.staticSetup = function()
{
	oFF.UiFrameType.s_lookup = oFF.XHashMapByString.create();
	oFF.UiFrameType.AUTO = oFF.UiFrameType.create("Auto");
	oFF.UiFrameType.ONE_BY_HALF = oFF.UiFrameType.create("OneByHalf");
	oFF.UiFrameType.ONE_BY_ONE = oFF.UiFrameType.create("OneByOne");
	oFF.UiFrameType.TWO_BY_HALF = oFF.UiFrameType.create("TwoByHalf");
	oFF.UiFrameType.TWO_BY_ONE = oFF.UiFrameType.create("TwoByOne");
};
oFF.UiFrameType.create = function(name)
{
	var newConstant = oFF.UiAbstractConstant.createUiConstant(new oFF.UiFrameType(), name, oFF.UiFrameType.s_lookup);
	return newConstant;
};
oFF.UiFrameType.lookup = function(value)
{
	var valueUpper = oFF.XString.toUpperCase(value);
	return oFF.UiFrameType.s_lookup.getByKey(valueUpper);
};

oFF.UiHierarchyType = function() {};
oFF.UiHierarchyType.prototype = new oFF.UiAbstractConstant();
oFF.UiHierarchyType.prototype._ff_c = "UiHierarchyType";

oFF.UiHierarchyType.NONE = null;
oFF.UiHierarchyType.CHARACTERISTIC_HIERARCHY = null;
oFF.UiHierarchyType.AXIS_HIERARCHY = null;
oFF.UiHierarchyType.AXIS_HIERARCHY_DRILL = null;
oFF.UiHierarchyType.AXIS_HIERARCHY_DRILL_NO_DEFAULT = null;
oFF.UiHierarchyType.AXIS_HIERARCHY_EXPAND = null;
oFF.UiHierarchyType.staticSetup = function()
{
	oFF.UiHierarchyType.NONE = oFF.UiAbstractConstant.createUiConstantExt(new oFF.UiHierarchyType(), "None", null, null, null, null);
	oFF.UiHierarchyType.CHARACTERISTIC_HIERARCHY = oFF.UiAbstractConstant.createUiConstantExt(new oFF.UiHierarchyType(), "CharacteristicHierarchy", null, null, null, null);
	oFF.UiHierarchyType.AXIS_HIERARCHY = oFF.UiAbstractConstant.createUiConstantExt(new oFF.UiHierarchyType(), "AxisHierarchy", null, null, null, null);
	oFF.UiHierarchyType.AXIS_HIERARCHY_DRILL = oFF.UiAbstractConstant.createUiConstantExt(new oFF.UiHierarchyType(), "AxisHierarchyDrill", null, null, null, oFF.UiHierarchyType.AXIS_HIERARCHY);
	oFF.UiHierarchyType.AXIS_HIERARCHY_DRILL_NO_DEFAULT = oFF.UiAbstractConstant.createUiConstantExt(new oFF.UiHierarchyType(), "AxisHierachyDrill", null, null, null, oFF.UiHierarchyType.AXIS_HIERARCHY_DRILL);
	oFF.UiHierarchyType.AXIS_HIERARCHY_EXPAND = oFF.UiAbstractConstant.createUiConstantExt(new oFF.UiHierarchyType(), "AxisHierachyExpand", null, null, null, oFF.UiHierarchyType.AXIS_HIERARCHY);
};

oFF.UiIconTabBarHeaderMode = function() {};
oFF.UiIconTabBarHeaderMode.prototype = new oFF.UiAbstractConstant();
oFF.UiIconTabBarHeaderMode.prototype._ff_c = "UiIconTabBarHeaderMode";

oFF.UiIconTabBarHeaderMode.INLINE = null;
oFF.UiIconTabBarHeaderMode.STANDARD = null;
oFF.UiIconTabBarHeaderMode.s_lookup = null;
oFF.UiIconTabBarHeaderMode.staticSetup = function()
{
	oFF.UiIconTabBarHeaderMode.s_lookup = oFF.XHashMapByString.create();
	oFF.UiIconTabBarHeaderMode.INLINE = oFF.UiIconTabBarHeaderMode.create("Inline");
	oFF.UiIconTabBarHeaderMode.STANDARD = oFF.UiIconTabBarHeaderMode.create("Standard");
};
oFF.UiIconTabBarHeaderMode.create = function(name)
{
	var newConstant = oFF.UiAbstractConstant.createUiConstant(new oFF.UiIconTabBarHeaderMode(), name, oFF.UiIconTabBarHeaderMode.s_lookup);
	return newConstant;
};
oFF.UiIconTabBarHeaderMode.lookup = function(value)
{
	var valueUpper = oFF.XString.toUpperCase(value);
	return oFF.UiIconTabBarHeaderMode.s_lookup.getByKey(valueUpper);
};

oFF.UiInputType = function() {};
oFF.UiInputType.prototype = new oFF.UiAbstractConstant();
oFF.UiInputType.prototype._ff_c = "UiInputType";

oFF.UiInputType.TEXT = null;
oFF.UiInputType.NUMBER = null;
oFF.UiInputType.TIME = null;
oFF.UiInputType.DATE = null;
oFF.UiInputType.PASSWORD = null;
oFF.UiInputType.EMAIL = null;
oFF.UiInputType.URL = null;
oFF.UiInputType.s_lookup = null;
oFF.UiInputType.staticSetup = function()
{
	oFF.UiInputType.s_lookup = oFF.XHashMapByString.create();
	oFF.UiInputType.TEXT = oFF.UiInputType.create("Text");
	oFF.UiInputType.NUMBER = oFF.UiInputType.create("Number");
	oFF.UiInputType.TIME = oFF.UiInputType.create("Time");
	oFF.UiInputType.DATE = oFF.UiInputType.create("Date");
	oFF.UiInputType.PASSWORD = oFF.UiInputType.create("Password");
	oFF.UiInputType.EMAIL = oFF.UiInputType.create("Email");
	oFF.UiInputType.URL = oFF.UiInputType.create("Url");
};
oFF.UiInputType.create = function(name)
{
	return oFF.UiAbstractConstant.createUiConstant(new oFF.UiInputType(), name, oFF.UiInputType.s_lookup);
};
oFF.UiInputType.lookup = function(value)
{
	var valueUpper = oFF.XString.toUpperCase(value);
	return oFF.UiInputType.s_lookup.getByKey(valueUpper);
};

oFF.UiItemPosition = function() {};
oFF.UiItemPosition.prototype = new oFF.UiAbstractConstant();
oFF.UiItemPosition.prototype._ff_c = "UiItemPosition";

oFF.UiItemPosition.CENTER = null;
oFF.UiItemPosition.TOP = null;
oFF.UiItemPosition.BOTTOM = null;
oFF.UiItemPosition.LEFT = null;
oFF.UiItemPosition.RIGHT = null;
oFF.UiItemPosition.MIDDLE = null;
oFF.UiItemPosition.TOP_LEFT = null;
oFF.UiItemPosition.TOP_RIGHT = null;
oFF.UiItemPosition.BOTTOM_LEFT = null;
oFF.UiItemPosition.BOTTOM_RIGHT = null;
oFF.UiItemPosition.CONTENT = null;
oFF.UiItemPosition.COLUMN_ROW = null;
oFF.UiItemPosition.s_lookup = null;
oFF.UiItemPosition.staticSetup = function()
{
	oFF.UiItemPosition.s_lookup = oFF.XHashMapByString.create();
	oFF.UiItemPosition.TOP = oFF.UiItemPosition.create("Top");
	oFF.UiItemPosition.BOTTOM = oFF.UiItemPosition.create("Bottom");
	oFF.UiItemPosition.LEFT = oFF.UiItemPosition.create("Left");
	oFF.UiItemPosition.RIGHT = oFF.UiItemPosition.create("Right");
	oFF.UiItemPosition.MIDDLE = oFF.UiItemPosition.create("Middle");
	oFF.UiItemPosition.TOP_LEFT = oFF.UiItemPosition.create("TopLeft");
	oFF.UiItemPosition.TOP_RIGHT = oFF.UiItemPosition.create("TopRight");
	oFF.UiItemPosition.BOTTOM_LEFT = oFF.UiItemPosition.create("BottomLeft");
	oFF.UiItemPosition.BOTTOM_RIGHT = oFF.UiItemPosition.create("BottomRight");
	oFF.UiItemPosition.CENTER = oFF.UiItemPosition.create("Center");
	oFF.UiItemPosition.CONTENT = oFF.UiItemPosition.create("Content");
	oFF.UiItemPosition.COLUMN_ROW = oFF.UiItemPosition.create("ColumnRow");
};
oFF.UiItemPosition.create = function(name)
{
	return oFF.UiAbstractConstant.createUiConstant(new oFF.UiItemPosition(), name, oFF.UiItemPosition.s_lookup);
};
oFF.UiItemPosition.lookup = function(name)
{
	return oFF.UiItemPosition.s_lookup.getByKey(name);
};

oFF.UiListType = function() {};
oFF.UiListType.prototype = new oFF.UiAbstractConstant();
oFF.UiListType.prototype._ff_c = "UiListType";

oFF.UiListType.ACTIVE = null;
oFF.UiListType.DETAIL = null;
oFF.UiListType.DETAIL_AND_ACTIVE = null;
oFF.UiListType.INACTIVE = null;
oFF.UiListType.NAVIGATION = null;
oFF.UiListType.s_lookup = null;
oFF.UiListType.staticSetup = function()
{
	oFF.UiListType.s_lookup = oFF.XHashMapByString.create();
	oFF.UiListType.ACTIVE = oFF.UiListType.create("Active");
	oFF.UiListType.DETAIL = oFF.UiListType.create("Detail");
	oFF.UiListType.DETAIL_AND_ACTIVE = oFF.UiListType.create("DetailAndActive");
	oFF.UiListType.INACTIVE = oFF.UiListType.create("Inactive");
	oFF.UiListType.NAVIGATION = oFF.UiListType.create("Navigation");
};
oFF.UiListType.create = function(name)
{
	return oFF.UiAbstractConstant.createUiConstant(new oFF.UiListType(), name, oFF.UiListType.s_lookup);
};
oFF.UiListType.lookup = function(value)
{
	var valueUpper = oFF.XString.toUpperCase(value);
	return oFF.UiListType.s_lookup.getByKey(valueUpper);
};

oFF.UiLoadState = function() {};
oFF.UiLoadState.prototype = new oFF.UiAbstractConstant();
oFF.UiLoadState.prototype._ff_c = "UiLoadState";

oFF.UiLoadState.DISABLED = null;
oFF.UiLoadState.FAILED = null;
oFF.UiLoadState.LOADED = null;
oFF.UiLoadState.LOADING = null;
oFF.UiLoadState.s_lookup = null;
oFF.UiLoadState.staticSetup = function()
{
	oFF.UiLoadState.s_lookup = oFF.XHashMapByString.create();
	oFF.UiLoadState.DISABLED = oFF.UiLoadState.create("Disabled");
	oFF.UiLoadState.FAILED = oFF.UiLoadState.create("Failed");
	oFF.UiLoadState.LOADED = oFF.UiLoadState.create("Loaded");
	oFF.UiLoadState.LOADING = oFF.UiLoadState.create("Loading");
};
oFF.UiLoadState.create = function(name)
{
	var newConstant = oFF.UiAbstractConstant.createUiConstant(new oFF.UiLoadState(), name, oFF.UiLoadState.s_lookup);
	return newConstant;
};
oFF.UiLoadState.lookup = function(value)
{
	var valueUpper = oFF.XString.toUpperCase(value);
	return oFF.UiLoadState.s_lookup.getByKey(valueUpper);
};

oFF.UiMessageType = function() {};
oFF.UiMessageType.prototype = new oFF.UiAbstractConstant();
oFF.UiMessageType.prototype._ff_c = "UiMessageType";

oFF.UiMessageType.NONE = null;
oFF.UiMessageType.ERROR = null;
oFF.UiMessageType.INFORMATION = null;
oFF.UiMessageType.SUCCESS = null;
oFF.UiMessageType.WARNING = null;
oFF.UiMessageType.s_lookup = null;
oFF.UiMessageType.staticSetup = function()
{
	oFF.UiMessageType.s_lookup = oFF.XHashMapByString.create();
	oFF.UiMessageType.NONE = oFF.UiMessageType.create("None");
	oFF.UiMessageType.ERROR = oFF.UiMessageType.create("Error");
	oFF.UiMessageType.INFORMATION = oFF.UiMessageType.create("Information");
	oFF.UiMessageType.SUCCESS = oFF.UiMessageType.create("Success");
	oFF.UiMessageType.WARNING = oFF.UiMessageType.create("Warning");
};
oFF.UiMessageType.create = function(name)
{
	var newConstant = oFF.UiAbstractConstant.createUiConstant(new oFF.UiMessageType(), name, oFF.UiMessageType.s_lookup);
	return newConstant;
};
oFF.UiMessageType.lookup = function(value)
{
	var valueUpper = oFF.XString.toUpperCase(value);
	return oFF.UiMessageType.s_lookup.getByKey(valueUpper);
};

oFF.UiNodeType = function() {};
oFF.UiNodeType.prototype = new oFF.UiAbstractConstant();
oFF.UiNodeType.prototype._ff_c = "UiNodeType";

oFF.UiNodeType.LEAF = null;
oFF.UiNodeType.NODE = null;
oFF.UiNodeType.LIST = null;
oFF.UiNodeType.MAP = null;
oFF.UiNodeType.GRID = null;
oFF.UiNodeType.staticSetup = function()
{
	oFF.UiNodeType.LEAF = oFF.UiNodeType.create("Leaf", null);
	oFF.UiNodeType.NODE = oFF.UiNodeType.create("Node", null);
	oFF.UiNodeType.LIST = oFF.UiNodeType.create("List", oFF.UiNodeType.NODE);
	oFF.UiNodeType.MAP = oFF.UiNodeType.create("Map", oFF.UiNodeType.NODE);
	oFF.UiNodeType.GRID = oFF.UiNodeType.create("Grid", oFF.UiNodeType.NODE);
};
oFF.UiNodeType.create = function(name, parent)
{
	return oFF.UiAbstractConstant.createUiConstantExt(new oFF.UiNodeType(), name, null, null, null, parent);
};

oFF.UiNotificationType = function() {};
oFF.UiNotificationType.prototype = new oFF.UiAbstractConstant();
oFF.UiNotificationType.prototype._ff_c = "UiNotificationType";

oFF.UiNotificationType.ACTIVE = null;
oFF.UiNotificationType.PASSIVE = null;
oFF.UiNotificationType.CUSTOM_ACTION = null;
oFF.UiNotificationType.CLIENT_SCRIPT = null;
oFF.UiNotificationType.staticSetup = function()
{
	oFF.UiNotificationType.ACTIVE = oFF.UiAbstractConstant.createUiConstant(new oFF.UiNotificationType(), "Active", null);
	oFF.UiNotificationType.PASSIVE = oFF.UiAbstractConstant.createUiConstant(new oFF.UiNotificationType(), "Passive", null);
	oFF.UiNotificationType.CUSTOM_ACTION = oFF.UiAbstractConstant.createUiConstant(new oFF.UiNotificationType(), "CustomAction", null);
	oFF.UiNotificationType.CLIENT_SCRIPT = oFF.UiAbstractConstant.createUiConstant(new oFF.UiNotificationType(), "ClientScript", null);
};

oFF.UiOperation = function() {};
oFF.UiOperation.prototype = new oFF.UiAbstractConstant();
oFF.UiOperation.prototype._ff_c = "UiOperation";

oFF.UiOperation.SET = null;
oFF.UiOperation.ADD = null;
oFF.UiOperation.INSERT = null;
oFF.UiOperation.s_lookup = null;
oFF.UiOperation.staticSetup = function()
{
	oFF.UiOperation.s_lookup = oFF.XHashMapByString.create();
	oFF.UiOperation.SET = oFF.UiOperation.create("Set");
	oFF.UiOperation.ADD = oFF.UiOperation.create("Add");
	oFF.UiOperation.INSERT = oFF.UiOperation.create("Insert");
};
oFF.UiOperation.create = function(name)
{
	return oFF.UiAbstractConstant.createUiConstant(new oFF.UiOperation(), name, oFF.UiOperation.s_lookup);
};
oFF.UiOperation.lookup = function(name)
{
	return oFF.UiOperation.s_lookup.getByKey(name);
};

oFF.UiOverflow = function() {};
oFF.UiOverflow.prototype = new oFF.UiAbstractConstant();
oFF.UiOverflow.prototype._ff_c = "UiOverflow";

oFF.UiOverflow.AUTO = null;
oFF.UiOverflow.SCROLL = null;
oFF.UiOverflow.HIDDEN = null;
oFF.UiOverflow.VISIBLE = null;
oFF.UiOverflow.s_lookup = null;
oFF.UiOverflow.staticSetup = function()
{
	oFF.UiOverflow.s_lookup = oFF.XHashMapByString.create();
	oFF.UiOverflow.AUTO = oFF.UiOverflow.createWithCss("Auto", "auto");
	oFF.UiOverflow.SCROLL = oFF.UiOverflow.createWithCss("Scroll", "scroll");
	oFF.UiOverflow.HIDDEN = oFF.UiOverflow.createWithCss("Hidden", "hidden");
	oFF.UiOverflow.VISIBLE = oFF.UiOverflow.createWithCss("Visible", "visible");
};
oFF.UiOverflow.createWithCss = function(name, cssValue)
{
	var newConstant = oFF.UiAbstractConstant.createUiConstantExt(new oFF.UiOverflow(), name, cssValue, cssValue, oFF.UiOverflow.s_lookup, null);
	return newConstant;
};
oFF.UiOverflow.lookup = function(value)
{
	var valueUpper = oFF.XString.toUpperCase(value);
	return oFF.UiOverflow.s_lookup.getByKey(valueUpper);
};

oFF.UiPagingType = function() {};
oFF.UiPagingType.prototype = new oFF.UiAbstractConstant();
oFF.UiPagingType.prototype._ff_c = "UiPagingType";

oFF.UiPagingType.BY_PAGE = null;
oFF.UiPagingType.BY_ITEM = null;
oFF.UiPagingType.staticSetup = function()
{
	oFF.UiPagingType.BY_PAGE = oFF.UiAbstractConstant.createUiConstant(new oFF.UiPagingType(), "ByPage", null);
	oFF.UiPagingType.BY_ITEM = oFF.UiAbstractConstant.createUiConstant(new oFF.UiPagingType(), "ByLine", null);
};

oFF.UiPlacementType = function() {};
oFF.UiPlacementType.prototype = new oFF.UiAbstractConstant();
oFF.UiPlacementType.prototype._ff_c = "UiPlacementType";

oFF.UiPlacementType.AUTO = null;
oFF.UiPlacementType.RIGHT = null;
oFF.UiPlacementType.LEFT = null;
oFF.UiPlacementType.TOP = null;
oFF.UiPlacementType.BOTTOM = null;
oFF.UiPlacementType.HORIZONTAL = null;
oFF.UiPlacementType.VERTICAL = null;
oFF.UiPlacementType.s_lookup = null;
oFF.UiPlacementType.staticSetup = function()
{
	oFF.UiPlacementType.s_lookup = oFF.XHashMapByString.create();
	oFF.UiPlacementType.AUTO = oFF.UiPlacementType.create("Auto");
	oFF.UiPlacementType.RIGHT = oFF.UiPlacementType.create("Right");
	oFF.UiPlacementType.LEFT = oFF.UiPlacementType.create("Left");
	oFF.UiPlacementType.TOP = oFF.UiPlacementType.create("Top");
	oFF.UiPlacementType.BOTTOM = oFF.UiPlacementType.create("Bottom");
	oFF.UiPlacementType.HORIZONTAL = oFF.UiPlacementType.create("Horizontal");
	oFF.UiPlacementType.VERTICAL = oFF.UiPlacementType.create("Vertical");
};
oFF.UiPlacementType.create = function(name)
{
	var newConstant = oFF.UiAbstractConstant.createUiConstant(new oFF.UiPlacementType(), name, oFF.UiPlacementType.s_lookup);
	return newConstant;
};
oFF.UiPlacementType.lookup = function(value)
{
	var valueUpper = oFF.XString.toUpperCase(value);
	return oFF.UiPlacementType.s_lookup.getByKey(valueUpper);
};

oFF.UiPlatform = function() {};
oFF.UiPlatform.prototype = new oFF.UiAbstractConstant();
oFF.UiPlatform.prototype._ff_c = "UiPlatform";

oFF.UiPlatform.GENERIC = null;
oFF.UiPlatform.SWING = null;
oFF.UiPlatform.SWT = null;
oFF.UiPlatform.ECLIPSE_VIEW = null;
oFF.UiPlatform.SWT_STANDALONE = null;
oFF.UiPlatform.HTML = null;
oFF.UiPlatform.UI5 = null;
oFF.UiPlatform.WPF = null;
oFF.UiPlatform.IOS = null;
oFF.UiPlatform.ANDROID = null;
oFF.UiPlatform.s_lookup = null;
oFF.UiPlatform.s_active = null;
oFF.UiPlatform.staticSetup = function()
{
	oFF.UiPlatform.s_lookup = oFF.XHashMapByString.create();
	oFF.UiPlatform.GENERIC = oFF.UiPlatform.create("Generic", null);
	oFF.UiPlatform.SWING = oFF.UiPlatform.create("Swing", oFF.UiPlatform.GENERIC);
	oFF.UiPlatform.SWT = oFF.UiPlatform.create("SWT", oFF.UiPlatform.GENERIC);
	oFF.UiPlatform.SWT_STANDALONE = oFF.UiPlatform.create("SWTStandalone", oFF.UiPlatform.SWT);
	oFF.UiPlatform.ECLIPSE_VIEW = oFF.UiPlatform.create("EclipseView", oFF.UiPlatform.SWT);
	oFF.UiPlatform.HTML = oFF.UiPlatform.create("Html", oFF.UiPlatform.GENERIC);
	oFF.UiPlatform.UI5 = oFF.UiPlatform.create("SAPUi5", oFF.UiPlatform.HTML);
	oFF.UiPlatform.IOS = oFF.UiPlatform.create("IOS", oFF.UiPlatform.GENERIC);
	oFF.UiPlatform.ANDROID = oFF.UiPlatform.create("Android", oFF.UiPlatform.GENERIC);
	oFF.UiPlatform.WPF = oFF.UiPlatform.create("WPF", oFF.UiPlatform.GENERIC);
	oFF.UiPlatform.s_active = oFF.UiPlatform.GENERIC;
};
oFF.UiPlatform.create = function(name, parent)
{
	return oFF.UiAbstractConstant.createUiConstantExt(new oFF.UiPlatform(), name, null, null, oFF.UiPlatform.s_lookup, parent);
};
oFF.UiPlatform.lookup = function(name)
{
	return oFF.UiPlatform.s_lookup.getByKey(name);
};
oFF.UiPlatform.isActive = function(platform)
{
	return oFF.UiPlatform.s_active.isTypeOf(platform);
};
oFF.UiPlatform.setActivePlatform = function(platform)
{
	if (platform.isTypeOf(oFF.UiPlatform.s_active))
	{
		oFF.UiPlatform.s_active = platform;
	}
	else
	{
		throw oFF.XException.createIllegalArgumentException("Platform type is not a subtype of the current active type");
	}
};

oFF.UiPressedButtonType = function() {};
oFF.UiPressedButtonType.prototype = new oFF.UiAbstractConstant();
oFF.UiPressedButtonType.prototype._ff_c = "UiPressedButtonType";

oFF.UiPressedButtonType.DETAIL = null;
oFF.UiPressedButtonType.CLOSE = null;
oFF.UiPressedButtonType.MAXIMIZE = null;
oFF.UiPressedButtonType.HIDE = null;
oFF.UiPressedButtonType.DRILL = null;
oFF.UiPressedButtonType.ADD = null;
oFF.UiPressedButtonType.ICON = null;
oFF.UiPressedButtonType.s_lookup = null;
oFF.UiPressedButtonType.staticSetup = function()
{
	oFF.UiPressedButtonType.s_lookup = oFF.XHashMapByString.create();
	oFF.UiPressedButtonType.DETAIL = oFF.UiPressedButtonType.create("DetailBtn");
	oFF.UiPressedButtonType.CLOSE = oFF.UiPressedButtonType.create("CloseBtn");
	oFF.UiPressedButtonType.MAXIMIZE = oFF.UiPressedButtonType.create("MaximizeBtn");
	oFF.UiPressedButtonType.HIDE = oFF.UiPressedButtonType.create("HideBtn");
	oFF.UiPressedButtonType.DRILL = oFF.UiPressedButtonType.create("DrillBtn");
	oFF.UiPressedButtonType.ADD = oFF.UiPressedButtonType.create("AddBtn");
	oFF.UiPressedButtonType.ICON = oFF.UiPressedButtonType.create("IconBtn");
};
oFF.UiPressedButtonType.create = function(name)
{
	var newConstant = oFF.UiAbstractConstant.createUiConstant(new oFF.UiPressedButtonType(), name, oFF.UiPressedButtonType.s_lookup);
	return newConstant;
};
oFF.UiPressedButtonType.lookup = function(value)
{
	return oFF.UiPressedButtonType.s_lookup.getByKey(value);
};

oFF.UiRelativeDropPosition = function() {};
oFF.UiRelativeDropPosition.prototype = new oFF.UiAbstractConstant();
oFF.UiRelativeDropPosition.prototype._ff_c = "UiRelativeDropPosition";

oFF.UiRelativeDropPosition.BEFORE = null;
oFF.UiRelativeDropPosition.AFTER = null;
oFF.UiRelativeDropPosition.ON = null;
oFF.UiRelativeDropPosition.s_lookup = null;
oFF.UiRelativeDropPosition.staticSetup = function()
{
	oFF.UiRelativeDropPosition.s_lookup = oFF.XHashMapByString.create();
	oFF.UiRelativeDropPosition.BEFORE = oFF.UiRelativeDropPosition.create("Before");
	oFF.UiRelativeDropPosition.AFTER = oFF.UiRelativeDropPosition.create("After");
	oFF.UiRelativeDropPosition.ON = oFF.UiRelativeDropPosition.create("On");
};
oFF.UiRelativeDropPosition.create = function(name)
{
	var newConstant = oFF.UiAbstractConstant.createUiConstant(new oFF.UiRelativeDropPosition(), name, oFF.UiRelativeDropPosition.s_lookup);
	return newConstant;
};
oFF.UiRelativeDropPosition.lookup = function(value)
{
	var valueUpper = oFF.XString.toUpperCase(value);
	return oFF.UiRelativeDropPosition.s_lookup.getByKey(valueUpper);
};

oFF.UiSelectionBehavior = function() {};
oFF.UiSelectionBehavior.prototype = new oFF.UiAbstractConstant();
oFF.UiSelectionBehavior.prototype._ff_c = "UiSelectionBehavior";

oFF.UiSelectionBehavior.s_lookup = null;
oFF.UiSelectionBehavior.ROW = null;
oFF.UiSelectionBehavior.ROW_ONLY = null;
oFF.UiSelectionBehavior.ROW_SELECTOR = null;
oFF.UiSelectionBehavior.staticSetup = function()
{
	oFF.UiSelectionBehavior.s_lookup = oFF.XHashMapByString.create();
	oFF.UiSelectionBehavior.ROW = oFF.UiSelectionBehavior.create("Row");
	oFF.UiSelectionBehavior.ROW_ONLY = oFF.UiSelectionBehavior.create("RowOnly");
	oFF.UiSelectionBehavior.ROW_SELECTOR = oFF.UiSelectionBehavior.create("RowSelector");
};
oFF.UiSelectionBehavior.create = function(name)
{
	var newConstant = oFF.UiAbstractConstant.createUiConstant(new oFF.UiSelectionBehavior(), name, oFF.UiSelectionBehavior.s_lookup);
	return newConstant;
};
oFF.UiSelectionBehavior.lookup = function(value)
{
	var valueUpper = oFF.XString.toUpperCase(value);
	return oFF.UiSelectionBehavior.s_lookup.getByKey(valueUpper);
};

oFF.UiSelectionMode = function() {};
oFF.UiSelectionMode.prototype = new oFF.UiAbstractConstant();
oFF.UiSelectionMode.prototype._ff_c = "UiSelectionMode";

oFF.UiSelectionMode.s_lookup = null;
oFF.UiSelectionMode.NONE = null;
oFF.UiSelectionMode.SINGLE_SELECT = null;
oFF.UiSelectionMode.SINGLE_SELECT_LEFT = null;
oFF.UiSelectionMode.SINGLE_SELECT_MASTER = null;
oFF.UiSelectionMode.MULTI_SELECT = null;
oFF.UiSelectionMode.DELETE = null;
oFF.UiSelectionMode.staticSetup = function()
{
	oFF.UiSelectionMode.s_lookup = oFF.XHashMapByString.create();
	oFF.UiSelectionMode.NONE = oFF.UiSelectionMode.create("None");
	oFF.UiSelectionMode.SINGLE_SELECT = oFF.UiSelectionMode.create("SingleSelect");
	oFF.UiSelectionMode.SINGLE_SELECT_LEFT = oFF.UiSelectionMode.create("SingleSelectLeft");
	oFF.UiSelectionMode.SINGLE_SELECT_MASTER = oFF.UiSelectionMode.create("SingleSelectMaster");
	oFF.UiSelectionMode.MULTI_SELECT = oFF.UiSelectionMode.create("MultiSelect");
	oFF.UiSelectionMode.DELETE = oFF.UiSelectionMode.create("Delete");
};
oFF.UiSelectionMode.create = function(name)
{
	return oFF.UiAbstractConstant.createUiConstantExt(new oFF.UiSelectionMode(), name, name, null, oFF.UiSelectionMode.s_lookup, null);
};
oFF.UiSelectionMode.lookup = function(name)
{
	return oFF.UiSelectionMode.s_lookup.getByKey(name);
};
oFF.UiSelectionMode.lookupWithDefault = function(name, defaultValue)
{
	var result = oFF.UiSelectionMode.s_lookup.getByKey(name);
	if (oFF.isNull(result))
	{
		return defaultValue;
	}
	return result;
};
oFF.UiSelectionMode.prototype.isSingleSelect = function()
{
	return this === oFF.UiSelectionMode.SINGLE_SELECT || this === oFF.UiSelectionMode.SINGLE_SELECT_LEFT || this === oFF.UiSelectionMode.SINGLE_SELECT_MASTER;
};

oFF.UiSemanticCellStyle = function() {};
oFF.UiSemanticCellStyle.prototype = new oFF.UiAbstractConstant();
oFF.UiSemanticCellStyle.prototype._ff_c = "UiSemanticCellStyle";

oFF.UiSemanticCellStyle.NONE = null;
oFF.UiSemanticCellStyle.STANDARD = null;
oFF.UiSemanticCellStyle.DISABLED = null;
oFF.UiSemanticCellStyle.READ_ONLY = null;
oFF.UiSemanticCellStyle.ALTERNATING = null;
oFF.UiSemanticCellStyle.TRANSPARENT = null;
oFF.UiSemanticCellStyle.HEADER = null;
oFF.UiSemanticCellStyle.TITLE = null;
oFF.UiSemanticCellStyle.LEVEL1HEADER = null;
oFF.UiSemanticCellStyle.LEVEL2HEADER = null;
oFF.UiSemanticCellStyle.LEVEL3HEADER = null;
oFF.UiSemanticCellStyle.ALERT_9_BAD_STRONG = null;
oFF.UiSemanticCellStyle.ALERT_8_BAD_MEDIUM = null;
oFF.UiSemanticCellStyle.ALERT_7_BAD_LIGHT = null;
oFF.UiSemanticCellStyle.ALERT_6_CRITICAL_STRONG = null;
oFF.UiSemanticCellStyle.ALERT_5_CRITICAL_MEDIUM = null;
oFF.UiSemanticCellStyle.ALERT_4_CRITICAL_LIGHT = null;
oFF.UiSemanticCellStyle.ALERT_3_GOOD_LIGHT = null;
oFF.UiSemanticCellStyle.ALERT_2_GOOD_MEDIUM = null;
oFF.UiSemanticCellStyle.ALERT_1_GOOD_STRONG = null;
oFF.UiSemanticCellStyle.NEGATIVE = null;
oFF.UiSemanticCellStyle.POSITIVE = null;
oFF.UiSemanticCellStyle.TOTAL = null;
oFF.UiSemanticCellStyle.SUBTOTAL = null;
oFF.UiSemanticCellStyle.SUBTOTAL_LIGHT = null;
oFF.UiSemanticCellStyle.GROUP_HIGHLIGHTED = null;
oFF.UiSemanticCellStyle.GROUP_HIGHLIGHTED_LIGHT = null;
oFF.UiSemanticCellStyle.KEY_MEDIUM = null;
oFF.UiSemanticCellStyle.GROUP_LEVEL_1 = null;
oFF.UiSemanticCellStyle.GROUP_LEVEL_2 = null;
oFF.UiSemanticCellStyle.GROUP_LEVEL_3 = null;
oFF.UiSemanticCellStyle.HIERARCHY_LEVEL_1 = null;
oFF.UiSemanticCellStyle.HIERARCHY_LEVEL_2 = null;
oFF.UiSemanticCellStyle.HIERARCHY_LEVEL_3 = null;
oFF.UiSemanticCellStyle.HIERARCHY_LEVEL_4 = null;
oFF.UiSemanticCellStyle.FILTER = null;
oFF.UiSemanticCellStyle.FILTERICON = null;
oFF.UiSemanticCellStyle.MARKED = null;
oFF.UiSemanticCellStyle.SELECTED_1 = null;
oFF.UiSemanticCellStyle.SELECTED_2 = null;
oFF.UiSemanticCellStyle.SELECTED_3 = null;
oFF.UiSemanticCellStyle.SELECTED_4 = null;
oFF.UiSemanticCellStyle.SELECTED_5 = null;
oFF.UiSemanticCellStyle.s_lookup = null;
oFF.UiSemanticCellStyle.staticSetup = function()
{
	oFF.UiSemanticCellStyle.s_lookup = oFF.XHashMapByString.create();
	oFF.UiSemanticCellStyle.NONE = oFF.UiSemanticCellStyle.create("None", oFF.UiAlignment.FIRST_CELL);
	oFF.UiSemanticCellStyle.STANDARD = oFF.UiSemanticCellStyle.create("Standard", oFF.UiAlignment.END);
	oFF.UiSemanticCellStyle.DISABLED = oFF.UiSemanticCellStyle.create("Disabled", oFF.UiAlignment.END);
	oFF.UiSemanticCellStyle.READ_ONLY = oFF.UiSemanticCellStyle.create("ReadOnly", oFF.UiAlignment.END);
	oFF.UiSemanticCellStyle.ALTERNATING = oFF.UiSemanticCellStyle.create("Alternating", oFF.UiAlignment.END);
	oFF.UiSemanticCellStyle.TRANSPARENT = oFF.UiSemanticCellStyle.create("Transparent", oFF.UiAlignment.END);
	oFF.UiSemanticCellStyle.HEADER = oFF.UiSemanticCellStyle.create("Header", oFF.UiAlignment.FIRST_CELL);
	oFF.UiSemanticCellStyle.TITLE = oFF.UiSemanticCellStyle.create("Title", oFF.UiAlignment.FIRST_CELL);
	oFF.UiSemanticCellStyle.LEVEL1HEADER = oFF.UiSemanticCellStyle.create("Level1Header", oFF.UiAlignment.FIRST_CELL);
	oFF.UiSemanticCellStyle.LEVEL2HEADER = oFF.UiSemanticCellStyle.create("Level2Header", oFF.UiAlignment.FIRST_CELL);
	oFF.UiSemanticCellStyle.LEVEL3HEADER = oFF.UiSemanticCellStyle.create("Level3Header", oFF.UiAlignment.FIRST_CELL);
	oFF.UiSemanticCellStyle.ALERT_9_BAD_STRONG = oFF.UiSemanticCellStyle.create("AlertBadStrong", oFF.UiAlignment.END);
	oFF.UiSemanticCellStyle.ALERT_8_BAD_MEDIUM = oFF.UiSemanticCellStyle.create("AlertBadMedium", oFF.UiAlignment.END);
	oFF.UiSemanticCellStyle.ALERT_7_BAD_LIGHT = oFF.UiSemanticCellStyle.create("AlertBadLight", oFF.UiAlignment.END);
	oFF.UiSemanticCellStyle.ALERT_6_CRITICAL_STRONG = oFF.UiSemanticCellStyle.create("AlertCriticalStrong", oFF.UiAlignment.END);
	oFF.UiSemanticCellStyle.ALERT_5_CRITICAL_MEDIUM = oFF.UiSemanticCellStyle.create("AlertCriticalMedium", oFF.UiAlignment.END);
	oFF.UiSemanticCellStyle.ALERT_4_CRITICAL_LIGHT = oFF.UiSemanticCellStyle.create("AlertCriticalLight", oFF.UiAlignment.END);
	oFF.UiSemanticCellStyle.ALERT_3_GOOD_LIGHT = oFF.UiSemanticCellStyle.create("AlertGoodLight", oFF.UiAlignment.END);
	oFF.UiSemanticCellStyle.ALERT_2_GOOD_MEDIUM = oFF.UiSemanticCellStyle.create("AlertGoodMedium", oFF.UiAlignment.END);
	oFF.UiSemanticCellStyle.ALERT_1_GOOD_STRONG = oFF.UiSemanticCellStyle.create("AlertGoodStrong", oFF.UiAlignment.END);
	oFF.UiSemanticCellStyle.NEGATIVE = oFF.UiSemanticCellStyle.create("Negative", oFF.UiAlignment.END);
	oFF.UiSemanticCellStyle.POSITIVE = oFF.UiSemanticCellStyle.create("Positive", oFF.UiAlignment.END);
	oFF.UiSemanticCellStyle.TOTAL = oFF.UiSemanticCellStyle.create("Total", oFF.UiAlignment.END);
	oFF.UiSemanticCellStyle.SUBTOTAL = oFF.UiSemanticCellStyle.create("Subtotal", oFF.UiAlignment.END);
	oFF.UiSemanticCellStyle.SUBTOTAL_LIGHT = oFF.UiSemanticCellStyle.create("SubtotalLight", oFF.UiAlignment.END);
	oFF.UiSemanticCellStyle.GROUP_HIGHLIGHTED = oFF.UiSemanticCellStyle.create("GroupHighlighted", oFF.UiAlignment.END);
	oFF.UiSemanticCellStyle.GROUP_HIGHLIGHTED_LIGHT = oFF.UiSemanticCellStyle.create("GroupHighlightedLight", oFF.UiAlignment.END);
	oFF.UiSemanticCellStyle.KEY_MEDIUM = oFF.UiSemanticCellStyle.create("KeyMedium", oFF.UiAlignment.END);
	oFF.UiSemanticCellStyle.GROUP_LEVEL_1 = oFF.UiSemanticCellStyle.create("GroupLevel1", oFF.UiAlignment.END);
	oFF.UiSemanticCellStyle.GROUP_LEVEL_2 = oFF.UiSemanticCellStyle.create("GroupLevel2", oFF.UiAlignment.END);
	oFF.UiSemanticCellStyle.GROUP_LEVEL_3 = oFF.UiSemanticCellStyle.create("GroupLevel3", oFF.UiAlignment.END);
	oFF.UiSemanticCellStyle.HIERARCHY_LEVEL_1 = oFF.UiSemanticCellStyle.create("HierarchyLevel1", oFF.UiAlignment.BEGIN);
	oFF.UiSemanticCellStyle.HIERARCHY_LEVEL_2 = oFF.UiSemanticCellStyle.create("HierarchyLevel2", oFF.UiAlignment.BEGIN);
	oFF.UiSemanticCellStyle.HIERARCHY_LEVEL_3 = oFF.UiSemanticCellStyle.create("HierarchyLevel3", oFF.UiAlignment.BEGIN);
	oFF.UiSemanticCellStyle.HIERARCHY_LEVEL_4 = oFF.UiSemanticCellStyle.create("HierarchyLevel4", oFF.UiAlignment.BEGIN);
	oFF.UiSemanticCellStyle.FILTER = oFF.UiSemanticCellStyle.create("Filter", oFF.UiAlignment.BEGIN);
	oFF.UiSemanticCellStyle.FILTERICON = oFF.UiSemanticCellStyle.create("Filtericon", oFF.UiAlignment.BEGIN);
	oFF.UiSemanticCellStyle.MARKED = oFF.UiSemanticCellStyle.create("Marked", oFF.UiAlignment.BEGIN);
	oFF.UiSemanticCellStyle.SELECTED_1 = oFF.UiSemanticCellStyle.create("Selected1", oFF.UiAlignment.BEGIN);
	oFF.UiSemanticCellStyle.SELECTED_2 = oFF.UiSemanticCellStyle.create("Selected2", oFF.UiAlignment.BEGIN);
	oFF.UiSemanticCellStyle.SELECTED_3 = oFF.UiSemanticCellStyle.create("Selected3", oFF.UiAlignment.BEGIN);
	oFF.UiSemanticCellStyle.SELECTED_4 = oFF.UiSemanticCellStyle.create("Selected4", oFF.UiAlignment.BEGIN);
	oFF.UiSemanticCellStyle.SELECTED_5 = oFF.UiSemanticCellStyle.create("Selected5", oFF.UiAlignment.BEGIN);
};
oFF.UiSemanticCellStyle.create = function(name, horizontalAlignment)
{
	var object = oFF.UiAbstractConstant.createUiConstantExt(new oFF.UiSemanticCellStyle(), name, null, null, oFF.UiSemanticCellStyle.s_lookup, null);
	object.m_horizontalAlignment = horizontalAlignment;
	return object;
};
oFF.UiSemanticCellStyle.get = function(name)
{
	return oFF.UiSemanticCellStyle.s_lookup.getByKey(name);
};
oFF.UiSemanticCellStyle.prototype.m_horizontalAlignment = null;
oFF.UiSemanticCellStyle.prototype.getHorizontalAlignment = function()
{
	return this.m_horizontalAlignment;
};

oFF.UiSemanticDesign = function() {};
oFF.UiSemanticDesign.prototype = new oFF.UiAbstractConstant();
oFF.UiSemanticDesign.prototype._ff_c = "UiSemanticDesign";

oFF.UiSemanticDesign.STANDARD = null;
oFF.UiSemanticDesign.EMPHASIZED = null;
oFF.UiSemanticDesign.PREVIOUS = null;
oFF.UiSemanticDesign.NEXT = null;
oFF.UiSemanticDesign.TOGGLE = null;
oFF.UiSemanticDesign.staticSetup = function()
{
	oFF.UiSemanticDesign.EMPHASIZED = oFF.UiAbstractConstant.createUiConstant(new oFF.UiSemanticDesign(), "Emphasized", null);
	oFF.UiSemanticDesign.STANDARD = oFF.UiAbstractConstant.createUiConstant(new oFF.UiSemanticDesign(), "Standard", null);
	oFF.UiSemanticDesign.PREVIOUS = oFF.UiAbstractConstant.createUiConstant(new oFF.UiSemanticDesign(), "Previous", null);
	oFF.UiSemanticDesign.NEXT = oFF.UiAbstractConstant.createUiConstant(new oFF.UiSemanticDesign(), "Next", null);
	oFF.UiSemanticDesign.TOGGLE = oFF.UiAbstractConstant.createUiConstant(new oFF.UiSemanticDesign(), "Toggle", null);
};

oFF.UiSemanticTextColor = function() {};
oFF.UiSemanticTextColor.prototype = new oFF.UiAbstractConstant();
oFF.UiSemanticTextColor.prototype._ff_c = "UiSemanticTextColor";

oFF.UiSemanticTextColor.DEFAULT_VALUE = null;
oFF.UiSemanticTextColor.DIMINISHED = null;
oFF.UiSemanticTextColor.POSITIVE = null;
oFF.UiSemanticTextColor.CRITICAL = null;
oFF.UiSemanticTextColor.NEGATIVE = null;
oFF.UiSemanticTextColor.MARKED_1 = null;
oFF.UiSemanticTextColor.MARKED_2 = null;
oFF.UiSemanticTextColor.staticSetup = function()
{
	oFF.UiSemanticTextColor.DEFAULT_VALUE = oFF.UiAbstractConstant.createUiConstant(new oFF.UiSemanticTextColor(), "Default", null);
	oFF.UiSemanticTextColor.DIMINISHED = oFF.UiAbstractConstant.createUiConstant(new oFF.UiSemanticTextColor(), "Diminished", null);
	oFF.UiSemanticTextColor.POSITIVE = oFF.UiAbstractConstant.createUiConstant(new oFF.UiSemanticTextColor(), "Positive", null);
	oFF.UiSemanticTextColor.CRITICAL = oFF.UiAbstractConstant.createUiConstant(new oFF.UiSemanticTextColor(), "Critical", null);
	oFF.UiSemanticTextColor.NEGATIVE = oFF.UiAbstractConstant.createUiConstant(new oFF.UiSemanticTextColor(), "Negative", null);
	oFF.UiSemanticTextColor.MARKED_1 = oFF.UiAbstractConstant.createUiConstant(new oFF.UiSemanticTextColor(), "Marked1", null);
	oFF.UiSemanticTextColor.MARKED_2 = oFF.UiAbstractConstant.createUiConstant(new oFF.UiSemanticTextColor(), "Marked2", null);
};

oFF.UiSemanticTextStyle = function() {};
oFF.UiSemanticTextStyle.prototype = new oFF.UiAbstractConstant();
oFF.UiSemanticTextStyle.prototype._ff_c = "UiSemanticTextStyle";

oFF.UiSemanticTextStyle.STANDARD = null;
oFF.UiSemanticTextStyle.EMPHASIZED = null;
oFF.UiSemanticTextStyle.LABEL_SMALL = null;
oFF.UiSemanticTextStyle.LABEL = null;
oFF.UiSemanticTextStyle.HEADER_1 = null;
oFF.UiSemanticTextStyle.HEADER_2 = null;
oFF.UiSemanticTextStyle.HEADER_3 = null;
oFF.UiSemanticTextStyle.HEADER_4 = null;
oFF.UiSemanticTextStyle.GROUPTITLE = null;
oFF.UiSemanticTextStyle.LEGEND = null;
oFF.UiSemanticTextStyle.REFERENCE = null;
oFF.UiSemanticTextStyle.MONOSPACE = null;
oFF.UiSemanticTextStyle.s_lookup = null;
oFF.UiSemanticTextStyle.staticSetup = function()
{
	oFF.UiSemanticTextStyle.s_lookup = oFF.XHashMapByString.create();
	oFF.UiSemanticTextStyle.STANDARD = oFF.UiSemanticTextStyle.create("Standard");
	oFF.UiSemanticTextStyle.EMPHASIZED = oFF.UiSemanticTextStyle.create("Emphasized");
	oFF.UiSemanticTextStyle.LABEL_SMALL = oFF.UiSemanticTextStyle.create("LabelSmall");
	oFF.UiSemanticTextStyle.LABEL = oFF.UiSemanticTextStyle.create("Label");
	oFF.UiSemanticTextStyle.HEADER_1 = oFF.UiSemanticTextStyle.create("Header1");
	oFF.UiSemanticTextStyle.HEADER_2 = oFF.UiSemanticTextStyle.create("Header2");
	oFF.UiSemanticTextStyle.HEADER_3 = oFF.UiSemanticTextStyle.create("Header3");
	oFF.UiSemanticTextStyle.HEADER_4 = oFF.UiSemanticTextStyle.create("Header4");
	oFF.UiSemanticTextStyle.GROUPTITLE = oFF.UiSemanticTextStyle.create("Grouptitle");
	oFF.UiSemanticTextStyle.LEGEND = oFF.UiSemanticTextStyle.create("Legend");
	oFF.UiSemanticTextStyle.REFERENCE = oFF.UiSemanticTextStyle.create("Reference");
	oFF.UiSemanticTextStyle.MONOSPACE = oFF.UiSemanticTextStyle.create("Monospace");
};
oFF.UiSemanticTextStyle.create = function(name)
{
	return oFF.UiAbstractConstant.createUiConstant(new oFF.UiSemanticTextStyle(), name, oFF.UiSemanticTextStyle.s_lookup);
};
oFF.UiSemanticTextStyle.lookup = function(name)
{
	return oFF.UiSemanticTextStyle.s_lookup.getByKey(name);
};

oFF.UiStyleClass = function() {};
oFF.UiStyleClass.prototype = new oFF.UiAbstractConstant();
oFF.UiStyleClass.prototype._ff_c = "UiStyleClass";

oFF.UiStyleClass.MOBILE = null;
oFF.UiStyleClass.DESKTOP = null;
oFF.UiStyleClass.s_lookup = null;
oFF.UiStyleClass.staticSetup = function()
{
	oFF.UiStyleClass.s_lookup = oFF.XHashMapByString.create();
	oFF.UiStyleClass.MOBILE = oFF.UiStyleClass.create("Mobile", null);
	oFF.UiStyleClass.DESKTOP = oFF.UiStyleClass.create("Desktop", null);
};
oFF.UiStyleClass.create = function(name, parent)
{
	return oFF.UiAbstractConstant.createUiConstantExt(new oFF.UiStyleClass(), name, null, null, oFF.UiStyleClass.s_lookup, parent);
};
oFF.UiStyleClass.lookup = function(name)
{
	return oFF.UiStyleClass.s_lookup.getByKey(name);
};

oFF.UiTextAlign = function() {};
oFF.UiTextAlign.prototype = new oFF.UiAbstractConstant();
oFF.UiTextAlign.prototype._ff_c = "UiTextAlign";

oFF.UiTextAlign.LEFT = null;
oFF.UiTextAlign.RIGHT = null;
oFF.UiTextAlign.CENTER = null;
oFF.UiTextAlign.s_lookup = null;
oFF.UiTextAlign.staticSetup = function()
{
	oFF.UiTextAlign.s_lookup = oFF.XHashMapByString.create();
	oFF.UiTextAlign.LEFT = oFF.UiTextAlign.create("Left");
	oFF.UiTextAlign.RIGHT = oFF.UiTextAlign.create("Right");
	oFF.UiTextAlign.CENTER = oFF.UiTextAlign.create("Center");
};
oFF.UiTextAlign.create = function(name)
{
	var newConstant = oFF.UiAbstractConstant.createUiConstant(new oFF.UiTextAlign(), name, oFF.UiTextAlign.s_lookup);
	return newConstant;
};
oFF.UiTextAlign.lookup = function(value)
{
	var valueUpper = oFF.XString.toUpperCase(value);
	return oFF.UiTextAlign.s_lookup.getByKey(valueUpper);
};

oFF.UiTextDecorationLine = function() {};
oFF.UiTextDecorationLine.prototype = new oFF.UiAbstractConstant();
oFF.UiTextDecorationLine.prototype._ff_c = "UiTextDecorationLine";

oFF.UiTextDecorationLine.NONE = null;
oFF.UiTextDecorationLine.UNDERLINE = null;
oFF.UiTextDecorationLine.OVERLINE = null;
oFF.UiTextDecorationLine.LINE_THROUGH = null;
oFF.UiTextDecorationLine.s_lookup = null;
oFF.UiTextDecorationLine.staticSetup = function()
{
	oFF.UiTextDecorationLine.s_lookup = oFF.XHashMapByString.create();
	oFF.UiTextDecorationLine.NONE = oFF.UiTextDecorationLine.createWithCss("None", "none");
	oFF.UiTextDecorationLine.UNDERLINE = oFF.UiTextDecorationLine.createWithCss("Underline", "underline");
	oFF.UiTextDecorationLine.OVERLINE = oFF.UiTextDecorationLine.createWithCss("Overline", "overline");
	oFF.UiTextDecorationLine.LINE_THROUGH = oFF.UiTextDecorationLine.createWithCss("LineThrough", "line-through");
};
oFF.UiTextDecorationLine.createWithCss = function(name, cssName)
{
	return oFF.UiAbstractConstant.createUiConstantExt(new oFF.UiTextDecorationLine(), name, cssName, cssName, oFF.UiTextDecorationLine.s_lookup, null);
};
oFF.UiTextDecorationLine.lookup = function(name)
{
	return oFF.UiTextDecorationLine.s_lookup.getByKey(name);
};

oFF.UiTextDecorationStyle = function() {};
oFF.UiTextDecorationStyle.prototype = new oFF.UiAbstractConstant();
oFF.UiTextDecorationStyle.prototype._ff_c = "UiTextDecorationStyle";

oFF.UiTextDecorationStyle.SOLID = null;
oFF.UiTextDecorationStyle.DOUBLE = null;
oFF.UiTextDecorationStyle.DOTTED = null;
oFF.UiTextDecorationStyle.DASHED = null;
oFF.UiTextDecorationStyle.WAVY = null;
oFF.UiTextDecorationStyle.s_lookup = null;
oFF.UiTextDecorationStyle.staticSetup = function()
{
	oFF.UiTextDecorationStyle.s_lookup = oFF.XHashMapByString.create();
	oFF.UiTextDecorationStyle.SOLID = oFF.UiTextDecorationStyle.createWithCss("Solid", "solid");
	oFF.UiTextDecorationStyle.DOUBLE = oFF.UiTextDecorationStyle.createWithCss("Double", "double");
	oFF.UiTextDecorationStyle.DOTTED = oFF.UiTextDecorationStyle.createWithCss("Dotted", "dotted");
	oFF.UiTextDecorationStyle.DASHED = oFF.UiTextDecorationStyle.createWithCss("Dashed", "dashed");
	oFF.UiTextDecorationStyle.WAVY = oFF.UiTextDecorationStyle.createWithCss("Wavy", "wavy");
};
oFF.UiTextDecorationStyle.createWithCss = function(name, cssName)
{
	return oFF.UiAbstractConstant.createUiConstantExt(new oFF.UiTextDecorationStyle(), name, cssName, cssName, oFF.UiTextDecorationStyle.s_lookup, null);
};
oFF.UiTextDecorationStyle.lookup = function(name)
{
	var valueUpper = oFF.XString.toUpperCase(name);
	return oFF.UiTextDecorationStyle.s_lookup.getByKey(valueUpper);
};

oFF.UiTileMode = function() {};
oFF.UiTileMode.prototype = new oFF.UiAbstractConstant();
oFF.UiTileMode.prototype._ff_c = "UiTileMode";

oFF.UiTileMode.CONTENT_MODE = null;
oFF.UiTileMode.HEADER_MODE = null;
oFF.UiTileMode.LINE_MODE = null;
oFF.UiTileMode.s_lookup = null;
oFF.UiTileMode.staticSetup = function()
{
	oFF.UiTileMode.s_lookup = oFF.XHashMapByString.create();
	oFF.UiTileMode.CONTENT_MODE = oFF.UiTileMode.create("ContentMode");
	oFF.UiTileMode.HEADER_MODE = oFF.UiTileMode.create("HeaderMode");
	oFF.UiTileMode.LINE_MODE = oFF.UiTileMode.create("LineMode");
};
oFF.UiTileMode.create = function(name)
{
	var newConstant = oFF.UiAbstractConstant.createUiConstant(new oFF.UiTileMode(), name, oFF.UiTileMode.s_lookup);
	return newConstant;
};
oFF.UiTileMode.lookup = function(value)
{
	var valueUpper = oFF.XString.toUpperCase(value);
	return oFF.UiTileMode.s_lookup.getByKey(valueUpper);
};

oFF.UiValueException = function() {};
oFF.UiValueException.prototype = new oFF.UiAbstractConstant();
oFF.UiValueException.prototype._ff_c = "UiValueException";

oFF.UiValueException.NORMAL = null;
oFF.UiValueException.THE_NULL = null;
oFF.UiValueException.ZERO = null;
oFF.UiValueException.INVALID = null;
oFF.UiValueException.staticSetup = function()
{
	oFF.UiValueException.NORMAL = oFF.UiValueException.create("Normal", true);
	oFF.UiValueException.THE_NULL = oFF.UiValueException.create("Null", true);
	oFF.UiValueException.ZERO = oFF.UiValueException.create("Zero", true);
	oFF.UiValueException.INVALID = oFF.UiValueException.create("Invalid", false);
};
oFF.UiValueException.create = function(name, validValue)
{
	var newConstant = oFF.UiAbstractConstant.createUiConstant(new oFF.UiValueException(), name, null);
	newConstant.m_isValid = validValue;
	return newConstant;
};
oFF.UiValueException.prototype.m_isValid = false;
oFF.UiValueException.prototype.isValidValue = function()
{
	return this.m_isValid;
};

oFF.UiValueState = function() {};
oFF.UiValueState.prototype = new oFF.UiAbstractConstant();
oFF.UiValueState.prototype._ff_c = "UiValueState";

oFF.UiValueState.NONE = null;
oFF.UiValueState.ERROR = null;
oFF.UiValueState.INFORMATION = null;
oFF.UiValueState.SUCCESS = null;
oFF.UiValueState.WARNING = null;
oFF.UiValueState.s_lookup = null;
oFF.UiValueState.staticSetup = function()
{
	oFF.UiValueState.s_lookup = oFF.XHashMapByString.create();
	oFF.UiValueState.NONE = oFF.UiValueState.create("None");
	oFF.UiValueState.ERROR = oFF.UiValueState.create("Error");
	oFF.UiValueState.INFORMATION = oFF.UiValueState.create("Information");
	oFF.UiValueState.SUCCESS = oFF.UiValueState.create("Success");
	oFF.UiValueState.WARNING = oFF.UiValueState.create("Warning");
};
oFF.UiValueState.create = function(name)
{
	var newConstant = oFF.UiAbstractConstant.createUiConstant(new oFF.UiValueState(), name, oFF.UiValueState.s_lookup);
	return newConstant;
};
oFF.UiValueState.lookup = function(value)
{
	var valueUpper = oFF.XString.toUpperCase(value);
	return oFF.UiValueState.s_lookup.getByKey(valueUpper);
};

oFF.UiVisibleRowCountMode = function() {};
oFF.UiVisibleRowCountMode.prototype = new oFF.UiAbstractConstant();
oFF.UiVisibleRowCountMode.prototype._ff_c = "UiVisibleRowCountMode";

oFF.UiVisibleRowCountMode.AUTO = null;
oFF.UiVisibleRowCountMode.FIXED = null;
oFF.UiVisibleRowCountMode.INTERACTIVE = null;
oFF.UiVisibleRowCountMode.s_lookup = null;
oFF.UiVisibleRowCountMode.staticSetup = function()
{
	oFF.UiVisibleRowCountMode.s_lookup = oFF.XHashMapByString.create();
	oFF.UiVisibleRowCountMode.AUTO = oFF.UiVisibleRowCountMode.create("Auto");
	oFF.UiVisibleRowCountMode.FIXED = oFF.UiVisibleRowCountMode.create("Fixed");
	oFF.UiVisibleRowCountMode.INTERACTIVE = oFF.UiVisibleRowCountMode.create("Interactive");
};
oFF.UiVisibleRowCountMode.create = function(name)
{
	var newConstant = oFF.UiAbstractConstant.createUiConstant(new oFF.UiVisibleRowCountMode(), name, oFF.UiVisibleRowCountMode.s_lookup);
	return newConstant;
};
oFF.UiVisibleRowCountMode.lookup = function(value)
{
	var valueUpper = oFF.XString.toUpperCase(value);
	return oFF.UiVisibleRowCountMode.s_lookup.getByKey(valueUpper);
};

oFF.UiInterface = function() {};
oFF.UiInterface.prototype = new oFF.UiBaseInterface();
oFF.UiInterface.prototype._ff_c = "UiInterface";

oFF.UiInterface.BORDER = null;
oFF.UiInterface.FLEX_ITEM = null;
oFF.UiInterface.FLEX_CONTAINER = null;
oFF.UiInterface.FONT = null;
oFF.UiInterface.ROW = null;
oFF.UiInterface.WINDOW = null;
oFF.UiInterface.FRAME = null;
oFF.UiInterface.s_lookup = null;
oFF.UiInterface.staticSetup = function()
{
	oFF.UiInterface.s_lookup = oFF.XHashMapByString.create();
	oFF.UiInterface.BORDER = oFF.UiInterface.create("Border").prop(oFF.UiProperty.BORDER_STYLE).prop(oFF.UiProperty.BORDER_COLOR).prop(oFF.UiProperty.BORDER_WIDTH).prop(oFF.UiProperty.CORNER_RADIUS);
	oFF.UiInterface.FLEX_ITEM = oFF.UiInterface.create("FlexItem").prop(oFF.UiProperty.FLEX).prop(oFF.UiProperty.ALIGN_SELF).prop(oFF.UiProperty.ORDER);
	oFF.UiInterface.FLEX_CONTAINER = oFF.UiInterface.create("FlexContainer").prop(oFF.UiProperty.ALIGN_CONTENT).prop(oFF.UiProperty.ALIGN_ITEMS).prop(oFF.UiProperty.DIRECTION).prop(oFF.UiProperty.JUSTIFY_CONTENT).prop(oFF.UiProperty.WRAP);
	oFF.UiInterface.FONT = oFF.UiInterface.create("Font").prop(oFF.UiProperty.FONT_COLOR).prop(oFF.UiProperty.FONT_SIZE).prop(oFF.UiProperty.FONT_STYLE).prop(oFF.UiProperty.FONT_WEIGHT);
	oFF.UiInterface.ROW = oFF.UiInterface.create("Row").prop(oFF.UiProperty.SELECTED).event(oFF.UiEvent.ON_CLICK);
	oFF.UiInterface.FRAME = oFF.UiInterface.create("Frame").prop(oFF.UiProperty.WIDTH).prop(oFF.UiProperty.HEIGHT).prop(oFF.UiProperty.MIN_WIDTH).prop(oFF.UiProperty.MAX_WIDTH).prop(oFF.UiProperty.MIN_HEIGHT).prop(oFF.UiProperty.MAX_HEIGHT).prop(oFF.UiProperty.X_POS).prop(oFF.UiProperty.Y_POS).method(oFF.UiMethod.SIZE).method(oFF.UiMethod.POSITION).method(oFF.UiMethod.FRAME);
	oFF.UiInterface.WINDOW = oFF.UiInterface.create("Window").interf(oFF.UiInterface.FRAME).prop(oFF.UiProperty.TITLE).prop(oFF.UiProperty.OPEN).prop(oFF.UiProperty.MAXIMIZED).prop(oFF.UiProperty.HIDDEN).method(oFF.UiMethod.OPEN).method(oFF.UiMethod.CLOSE).method(oFF.UiMethod.MAXIMIZE).method(oFF.UiMethod.RESTORE).method(oFF.UiMethod.HIDE).method(oFF.UiMethod.SHOW).method(oFF.UiMethod.BRING_TO_FRONT).event(oFF.UiEvent.ON_OPEN).event(oFF.UiEvent.ON_CLOSE).event(oFF.UiEvent.ON_MOVE).event(oFF.UiEvent.ON_MOVE_START).event(oFF.UiEvent.ON_MOVE_END).event(oFF.UiEvent.ON_RESIZE).event(oFF.UiEvent.ON_BUTTON_PRESS).event(oFF.UiEvent.ON_FILE_DROP);
};
oFF.UiInterface.create = function(name)
{
	var newConstant = oFF.UiBaseInterface.createUiBaseInterface(new oFF.UiInterface(), name, oFF.UiInterface.s_lookup);
	return newConstant;
};
oFF.UiInterface.lookup = function(name)
{
	return oFF.UiBaseConstant.lookupConstant(name, oFF.UiInterface.s_lookup);
};
oFF.UiInterface.getAllUiInterfaces = function()
{
	return oFF.UiInterface.s_lookup.getIterator();
};
oFF.UiInterface.prototype.m_interfaceExtensionName = null;
oFF.UiInterface.prototype.prop = function(property)
{
	this.addProperty(property);
	return this;
};
oFF.UiInterface.prototype.aggregation = function(aggrDef)
{
	this.addAggregation(aggrDef);
	return this;
};
oFF.UiInterface.prototype.method = function(method)
{
	this.addMethod(method);
	return this;
};
oFF.UiInterface.prototype.event = function(eventDef)
{
	this.addEvent(eventDef);
	return this;
};
oFF.UiInterface.prototype.interf = function(interfaceDef)
{
	this.addInterface(interfaceDef);
	return this;
};
oFF.UiInterface.prototype.interfExtension = function(interfaceExtensionName)
{
	this.m_interfaceExtensionName = interfaceExtensionName;
	return this;
};
oFF.UiInterface.prototype.getInterfaceExtensionName = function()
{
	return this.m_interfaceExtensionName;
};
oFF.UiInterface.prototype.hasInterfaceExtension = function()
{
	return oFF.XStringUtils.isNotNullAndNotEmpty(this.m_interfaceExtensionName);
};

oFF.UiType = function() {};
oFF.UiType.prototype = new oFF.UiComponentType();
oFF.UiType.prototype._ff_c = "UiType";

oFF.UiType.ELEMENT = null;
oFF.UiType.BASE_CONTROL = null;
oFF.UiType.CONTROL = null;
oFF.UiType.ITEM = null;
oFF.UiType.FLOATING_CONTROL = null;
oFF.UiType.COMPOSITE = null;
oFF.UiType.LIST_ITEM_BASE = null;
oFF.UiType.TREE_ITEM_BASE = null;
oFF.UiType.COMBO_BOX_BASE = null;
oFF.UiType.ROOT = null;
oFF.UiType.BUTTON = null;
oFF.UiType.TOGGLE_BUTTON = null;
oFF.UiType.DROPDOWN_ITEM = null;
oFF.UiType.DROPDOWN = null;
oFF.UiType.COMBO_BOX = null;
oFF.UiType.MULTI_COMBO_BOX = null;
oFF.UiType.SLIDER = null;
oFF.UiType.RANGE_SLIDER = null;
oFF.UiType.TREE = null;
oFF.UiType.TREE_ITEM = null;
oFF.UiType.CUSTOM_TREE_ITEM = null;
oFF.UiType.TREE_TABLE = null;
oFF.UiType.TREE_TABLE_ROW = null;
oFF.UiType.INPUT = null;
oFF.UiType.SUGGESTION_ITEM = null;
oFF.UiType.SEARCH_FIELD = null;
oFF.UiType.LABEL = null;
oFF.UiType.LINK = null;
oFF.UiType.HTML = null;
oFF.UiType.WEB_ASSEMBLY = null;
oFF.UiType.IMAGE = null;
oFF.UiType.ICON = null;
oFF.UiType.CHECKBOX = null;
oFF.UiType.SWITCH = null;
oFF.UiType.DATE_PICKER = null;
oFF.UiType.TIME_PICKER = null;
oFF.UiType.DATE_TIME_PICKER = null;
oFF.UiType.CALENDAR = null;
oFF.UiType.RADIO_BUTTON_GROUP = null;
oFF.UiType.RADIO_BUTTON = null;
oFF.UiType.SEGMENTED_BUTTON = null;
oFF.UiType.SEGMENTED_BUTTON_ITEM = null;
oFF.UiType.TEXT = null;
oFF.UiType.TEXT_AREA = null;
oFF.UiType.TOOLBAR = null;
oFF.UiType.MENU = null;
oFF.UiType.MENU_ITEM = null;
oFF.UiType.TAB_BAR = null;
oFF.UiType.TAB_BAR_ITEM = null;
oFF.UiType.ICON_TAB_BAR = null;
oFF.UiType.ICON_TAB_BAR_ITEM = null;
oFF.UiType.NAVIGATION_CONTAINER = null;
oFF.UiType.PAGE = null;
oFF.UiType.PAGE_BUTTON = null;
oFF.UiType.HORIZONTAL_SPLITTER = null;
oFF.UiType.VERTICAL_SPLITTER = null;
oFF.UiType.CHART = null;
oFF.UiType.HIGH_CHART = null;
oFF.UiType.VIZ_FRAME = null;
oFF.UiType.MICRO_CHART = null;
oFF.UiType.CARD = null;
oFF.UiType.DIALOG = null;
oFF.UiType.DIALOG_BUTTON = null;
oFF.UiType.ALERT = null;
oFF.UiType.TOAST = null;
oFF.UiType.POPOVER = null;
oFF.UiType.PANEL = null;
oFF.UiType.TILE = null;
oFF.UiType.CODE_EDITOR = null;
oFF.UiType.CLOCK = null;
oFF.UiType.TABLE = null;
oFF.UiType.TABLE_COLUMN = null;
oFF.UiType.TABLE_ROW = null;
oFF.UiType.TABLE_CELL = null;
oFF.UiType.RESPONSIVE_TABLE = null;
oFF.UiType.RESPONSIVE_TABLE_COLUMN = null;
oFF.UiType.RESPONSIVE_TABLE_ROW = null;
oFF.UiType.RESPONSIVE_TABLE_CELL = null;
oFF.UiType.VIZ_GRID = null;
oFF.UiType.FIREFLY_GRID = null;
oFF.UiType.SAC_TABLE_GRID = null;
oFF.UiType.WINDOW = null;
oFF.UiType.TERMINAL = null;
oFF.UiType.LAUNCHPAD = null;
oFF.UiType.APP_ICON = null;
oFF.UiType.TASK_BAR = null;
oFF.UiType.TASK_BAR_BUTTON = null;
oFF.UiType.HORIZONTAL_LAYOUT = null;
oFF.UiType.VERTICAL_LAYOUT = null;
oFF.UiType.FLEX_LAYOUT = null;
oFF.UiType.FLOW_LAYOUT = null;
oFF.UiType.MATRIX_LAYOUT = null;
oFF.UiType.MATRIX_LAYOUT_ROW = null;
oFF.UiType.MATRIX_LAYOUT_CELL = null;
oFF.UiType.CANVAS_LAYOUT = null;
oFF.UiType.TILE_CONTAINER = null;
oFF.UiType.TILE_ITEM = null;
oFF.UiType.LIST = null;
oFF.UiType.LIST_ITEM = null;
oFF.UiType.CUSTOM_LIST_ITEM = null;
oFF.UiType.SCROLL_CONTAINER = null;
oFF.UiType.SPACER = null;
oFF.UiType.ACTIVITY_INDICATOR = null;
oFF.UiType.PROGRESS_INDICATOR = null;
oFF.UiType.FANCY_BUTTON = null;
oFF.UiType.ANALYTICAL_CARD = null;
oFF.UiType.UNDO_BUTTON = null;
oFF.UiType.REDO_BUTTON = null;
oFF.UiType.CONVENIENCE_CMDS_MENU = null;
oFF.UiType.OLAP_CMD_BUTTON = null;
oFF.UiType.OLAP_PIVOT_TABLE = null;
oFF.UiType.OLAP_CONTEXT_MENU = null;
oFF.UiType.s_flagLookup = null;
oFF.UiType._SUPPORTS_SELECTED_ITEM = "supportsSelectedItem";
oFF.UiType._SUPPORTS_SELECTED_ITEMS = "supportsSelectedItems";
oFF.UiType._SUPPORTS_VALUE_CHANGE = "supportsValueChange";
oFF.UiType._SUPPORTS_SLIDER_VALUE_CHANGE = "supportsSliderValueChange";
oFF.UiType._SUPPORTS_RANGE_SLIDER_VALUE_CHANGE = "supportsRangeSliderValueChange";
oFF.UiType._SUPPORTS_TEXT_CHANGE = "supportsTextChange";
oFF.UiType._SUPPORTS_CHECKED_CHANGE = "supportsCheckedChange";
oFF.UiType._SUPPORTS_ON_CHANGE = "supportsOnChange";
oFF.UiType._SUPPORTS_SELECTED_CHANGE = "supportsSelectedChange";
oFF.UiType._SUPPORTS_EXPANDED_CHANGE = "supportsExpandedChange";
oFF.UiType._SUPPORTS_COMMAND_HISTORY_CHANGE = "supportsCommandHistoryChange";
oFF.UiType._SUPPORTS_VISIBLE_ROW_COUNT_CHANGE = "supportsVisibleRowCountChange";
oFF.UiType._SUPPORTS_OPEN_CHANGE = "supportsOpenChange";
oFF.UiType._SUPPORTS_FIRST_VISIBLE_ROW_CHANGE = "supportsFirstVisibleRowChange";
oFF.UiType._SUPPORTS_NAVIGATION_PAGES_CHANGE = "supportsNavigationPagesChange";
oFF.UiType._SUPPORTS_MAXIMIZED_CHANGE = "supportsMaximizedChange";
oFF.UiType._SUPPORTS_HIDDEN_CHANGE = "supportsHiddenChange";
oFF.UiType._SUPPORTS_START_DATE_CHANGE = "supportsStartDateChange";
oFF.UiType._SUPPORTS_END_DATE_CHANGE = "supportsEndDateChange";
oFF.UiType._SUPPORTS_PRESSED_CHANGE = "supportsPressedChange";
oFF.UiType._SUPPORTS_OFFSET_HEIGHT_CHANGE = "supportsOffsetHeightChange";
oFF.UiType._SUPPORTS_OFFSET_WIDTH_CHANGE = "supportsOffsetWidthChange";
oFF.UiType.s_lookup = null;
oFF.UiType.staticSetup = function()
{
	oFF.UiProperty.staticSetup();
	oFF.UiAggregation.staticSetup();
	oFF.UiMethod.staticSetup();
	oFF.UiEvent.staticSetup();
	oFF.UiInterface.staticSetup();
	oFF.UiType.s_lookup = oFF.XHashMapByString.create();
	oFF.UiType.s_flagLookup = oFF.XHashMapByString.create();
	oFF.UiType.staticSetuBaseAbstractControls();
	oFF.UiType.staticSetupItems();
	oFF.UiType.staticSetupBasicControls();
	oFF.UiType.staticSetupLists();
	oFF.UiType.staticSetupGrids();
	oFF.UiType.staticSetupTrees();
	oFF.UiType.staticSetupFloatingControls();
	oFF.UiType.staticSetupIndexedLayout();
	oFF.UiType.staticSetupContentContainers();
	oFF.UiType.staticSetupItemContainers();
	oFF.UiType.staticSetupDataViz();
	oFF.UiType.staticSetupMisc();
	oFF.UiType.staticSetupCompositeControls();
	oFF.UiType.staticSetupTypeFallbacks();
	oFF.UiAggregation.setupItemTypes();
};
oFF.UiType.staticSetuBaseAbstractControls = function()
{
	oFF.UiType.ELEMENT = oFF.UiType.createAbstract("Element", "Interface for UI Elements.", null).prop(oFF.UiProperty.ID).prop(oFF.UiProperty.NAME).prop(oFF.UiProperty.PARENT).prop(oFF.UiProperty.TAG).prop(oFF.UiProperty.CSS_CLASS).prop(oFF.UiProperty.TOOLTIP).prop(oFF.UiProperty.CUSTOM_OBJECT).method(oFF.UiMethod.FOCUS);
	oFF.UiType.BASE_CONTROL = oFF.UiType.createAbstract("BaseControl", "Base interface for Controls.", oFF.UiType.ELEMENT).interf(oFF.UiInterface.FRAME).interf(oFF.UiInterface.BORDER).prop(oFF.UiProperty.ENABLED).prop(oFF.UiProperty.VISIBLE).prop(oFF.UiProperty.BACKGROUND_COLOR).prop(oFF.UiProperty.PADDING).prop(oFF.UiProperty.OPACITY);
	oFF.UiType.ITEM = oFF.UiType.createAbstract("Item", "Interface for Items.", oFF.UiType.ELEMENT).prop(oFF.UiProperty.ENABLED).prop(oFF.UiProperty.VISIBLE).prop(oFF.UiProperty.DRAGGABLE);
	oFF.UiType.CONTROL = oFF.UiType.createAbstract("Control", "Interface for Controls.", oFF.UiType.BASE_CONTROL).interf(oFF.UiInterface.FLEX_ITEM).prop(oFF.UiProperty.MARGIN).prop(oFF.UiProperty.DRAGGABLE).prop(oFF.UiProperty.DROP_INFO).event(oFF.UiEvent.ON_DROP);
	oFF.UiType.FLOATING_CONTROL = oFF.UiType.createAbstract("FloatingControl", "Interface for Floating Controls.", oFF.UiType.BASE_CONTROL).method(oFF.UiMethod.CLOSE);
	oFF.UiType.COMPOSITE = oFF.UiType.createAbstract("Composite", "Interface for Composites.", oFF.UiType.CONTROL);
};
oFF.UiType.staticSetupItems = function()
{
	oFF.UiType.LIST_ITEM_BASE = oFF.UiType.createAbstract("ListItemBase", "Interface for list items.", oFF.UiType.ITEM).interf(oFF.UiInterface.BORDER).prop(oFF.UiProperty.COUNTER).prop(oFF.UiProperty.HIGHLIGHT).prop(oFF.UiProperty.SELECTED).prop(oFF.UiProperty.LIST_ITEM_TYPE).prop(oFF.UiProperty.BUSY).prop(oFF.UiProperty.MARGIN).prop(oFF.UiProperty.BACKGROUND_COLOR).prop(oFF.UiProperty.PADDING).event(oFF.UiEvent.ON_CLICK).event(oFF.UiEvent.ON_DOUBLE_CLICK).event(oFF.UiEvent.ON_PRESS).event(oFF.UiEvent.ON_DETAIL_PRESS).event(oFF.UiEvent.ON_CONTEXT_MENU);
	oFF.UiType.TREE_ITEM_BASE = oFF.UiType.createAbstract("TreeItemBase", "Interface for tree items.", oFF.UiType.LIST_ITEM_BASE).addCapabilityFlag(oFF.UiType._SUPPORTS_EXPANDED_CHANGE).prop(oFF.UiProperty.NODE).prop(oFF.UiProperty.EXPANDED).event(oFF.UiEvent.ON_EXPAND).event(oFF.UiEvent.ON_COLLAPSE);
	oFF.UiType.SUGGESTION_ITEM = oFF.UiType.createItem("SuggestionItem", "Suggestion list item which display a text.").prop(oFF.UiProperty.TEXT);
	oFF.UiType.DROPDOWN_ITEM = oFF.UiType.createItem("DropdownItem", "Dropdown item which display a text.").prop(oFF.UiProperty.TEXT);
	oFF.UiType.MENU_ITEM = oFF.UiType.createItem("MenuItem", "The MenuItem control is used for creating items for the Menu control.").prop(oFF.UiProperty.TEXT).prop(oFF.UiProperty.ICON).prop(oFF.UiProperty.SECTION_START).aggregation(oFF.UiAggregation.ITEMS).event(oFF.UiEvent.ON_CLICK).event(oFF.UiEvent.ON_PRESS);
	oFF.UiType.MENU_ITEM.setDefaultItemType(oFF.UiType.MENU_ITEM);
	oFF.UiType.MENU_ITEM.setAllowedItemType(oFF.UiType.MENU_ITEM);
	oFF.UiType.SEGMENTED_BUTTON_ITEM = oFF.UiType.createItem("SegmentedButtonItem", "Used for creating buttons for the SegmentedButton control.").prop(oFF.UiProperty.TEXT).prop(oFF.UiProperty.ICON).prop(oFF.UiProperty.SELECTED).event(oFF.UiEvent.ON_PRESS);
	oFF.UiType.TILE_ITEM = oFF.UiType.createItem("TileItem", "The TileItem control is used for creating items for the TileContainer control.").prop(oFF.UiProperty.TEXT).prop(oFF.UiProperty.SRC).event(oFF.UiEvent.ON_CLICK).event(oFF.UiEvent.ON_DOUBLE_CLICK).event(oFF.UiEvent.ON_PRESS).event(oFF.UiEvent.ON_CONTEXT_MENU);
	oFF.UiType.LIST_ITEM = oFF.UiType.createListItem("ListItem", "List item which provides the most common use cases, e.g. icon, text and description.").prop(oFF.UiProperty.TEXT).prop(oFF.UiProperty.DESCRIPTION).prop(oFF.UiProperty.ICON);
	oFF.UiType.CUSTOM_LIST_ITEM = oFF.UiType.createListItem("CustomListItem", "List item which allows to customize standard list items with any kind of content.").prop(oFF.UiProperty.CONTENT);
	oFF.UiType.TREE_ITEM = oFF.UiType.createTreeItem("TreeItem", "The TreeItem control is used as an item for the Tree control and provides a title, image, etc.").prop(oFF.UiProperty.TEXT).prop(oFF.UiProperty.ICON);
	oFF.UiType.CUSTOM_TREE_ITEM = oFF.UiType.createTreeItem("CustomTreeItem", "Tree item which allows to customize standard tree items with any kind of content.").prop(oFF.UiProperty.CONTENT);
	oFF.UiType.TAB_BAR_ITEM = oFF.UiType.createItem("TabBarItem", "An item to be used in a TabBar.").prop(oFF.UiProperty.CONTENT).prop(oFF.UiProperty.TEXT).prop(oFF.UiProperty.DESCRIPTION).prop(oFF.UiProperty.ICON).prop(oFF.UiProperty.MODIFIED);
	oFF.UiType.ICON_TAB_BAR_ITEM = oFF.UiType.createItem("IconTabBarItem", "Represents a selectable item inside an IconTabBar.").prop(oFF.UiProperty.CONTENT).prop(oFF.UiProperty.TEXT).prop(oFF.UiProperty.ICON).prop(oFF.UiProperty.COUNT);
	oFF.UiType.TABLE_COLUMN = oFF.UiType.createItem("TableColumn", "The column allows you to define column specific properties that will be applied when rendering the table.").prop(oFF.UiProperty.TITLE).prop(oFF.UiProperty.WIDTH).prop(oFF.UiProperty.SHOW_SORTING);
	oFF.UiType.TABLE_CELL = oFF.UiType.createItem("TableCell", "The TableCell control acts as an abstract constrol which allows to define the content of a Table cell.").prop(oFF.UiProperty.TEXT).event(oFF.UiEvent.ON_CLICK);
	oFF.UiType.TABLE_ROW = oFF.UiType.createItem("TableRow", "The TableRow control is used to define a row of cells in a table.").prop(oFF.UiProperty.SELECTED).aggregation(oFF.UiAggregation.CELLS).event(oFF.UiEvent.ON_CLICK);
	oFF.UiType.RESPONSIVE_TABLE_COLUMN = oFF.UiType.createItem("ResponsiveTableColumn", "The ResponsiveTableColumn allows to define column specific properties that will be applied when rendering the ResponsiveTable.").setSuperType(oFF.UiType.TABLE_COLUMN);
	oFF.UiType.RESPONSIVE_TABLE_CELL = oFF.UiType.createItem("ResponsiveTableCell", "The ResponsiveTableCell control acts as an abstract constrol which allows to define the content of a ResponsiveTable cell.").setSuperType(oFF.UiType.TABLE_CELL).prop(oFF.UiProperty.BACKGROUND_COLOR);
	oFF.UiType.RESPONSIVE_TABLE_ROW = oFF.UiType.createItem("ResponsiveTableRow", "The ResponsiveTableRow control is used to define a row of cells in a ResponsiveTable.").prop(oFF.UiProperty.HIGHLIGHT).prop(oFF.UiProperty.SELECTED).prop(oFF.UiProperty.LIST_ITEM_TYPE).aggregation(oFF.UiAggregation.RESPONSIVE_TABLE_CELLS).event(oFF.UiEvent.ON_CLICK).event(oFF.UiEvent.ON_DOUBLE_CLICK).event(oFF.UiEvent.ON_PRESS).event(oFF.UiEvent.ON_DETAIL_PRESS);
	oFF.UiType.TREE_TABLE_ROW = oFF.UiType.createItem("TreeTableRow", "The TreeTableRow control is used to define a row of cells in a TreeTable.").setSuperType(oFF.UiType.TABLE_ROW).addCapabilityFlag(oFF.UiType._SUPPORTS_EXPANDED_CHANGE).prop(oFF.UiProperty.EXPANDED).aggregation(oFF.UiAggregation.TREE_TABLE_ROWS).event(oFF.UiEvent.ON_EXPAND).event(oFF.UiEvent.ON_COLLAPSE);
};
oFF.UiType.staticSetupBasicControls = function()
{
	oFF.UiType.BUTTON = oFF.UiType.createBasicControl("Button", "Enables users to trigger actions.").addReceiverBinding(oFF.SemanticBindingType.STRING, oFF.ProtocolBindingType.STRING).prop(oFF.UiProperty.TEXT).prop(oFF.UiProperty.ICON).prop(oFF.UiProperty.BUTTON_TYPE).event(oFF.UiEvent.ON_PRESS).event(oFF.UiEvent.ON_HOVER).event(oFF.UiEvent.ON_HOVER_END);
	oFF.UiType.TOGGLE_BUTTON = oFF.UiType.createBasicControl("ToggleButton", "An enhanced Button that can be toggled between pressed and normal state.").setSuperType(oFF.UiType.BUTTON).addCapabilityFlag(oFF.UiType._SUPPORTS_PRESSED_CHANGE).prop(oFF.UiProperty.PRESSED);
	oFF.UiType.LABEL = oFF.UiType.createBasicControl("Label", "Provides a textual label for displaying text.").interf(oFF.UiInterface.FONT).prop(oFF.UiProperty.TEXT).prop(oFF.UiProperty.TEXT_ALIGN).prop(oFF.UiProperty.WRAPPING).prop(oFF.UiProperty.TEXT_DECORATION).prop(oFF.UiProperty.REQUIRED);
	oFF.UiType.LINK = oFF.UiType.createBasicControl("Link", "A hyperlink control used to navigate to other apps and web pages or to trigger actions.").interf(oFF.UiInterface.FONT).prop(oFF.UiProperty.TEXT).prop(oFF.UiProperty.TEXT_ALIGN).prop(oFF.UiProperty.WRAPPING).prop(oFF.UiProperty.SRC).event(oFF.UiEvent.ON_PRESS);
	oFF.UiType.CHECKBOX = oFF.UiType.createBasicControl("Checkbox", "Allows the user to set a binary value, such as true/false.").addCapabilityFlag(oFF.UiType._SUPPORTS_CHECKED_CHANGE).prop(oFF.UiProperty.TEXT).prop(oFF.UiProperty.CHECKED).prop(oFF.UiProperty.WRAPPING).prop(oFF.UiProperty.PARTIALLY_CHECKED).event(oFF.UiEvent.ON_CHANGE);
	oFF.UiType.SWITCH = oFF.UiType.createBasicControl("Switch", "A variation of a Checkbox which enabled switching between binary states.").addCapabilityFlag(oFF.UiType._SUPPORTS_ON_CHANGE).prop(oFF.UiProperty.ON).prop(oFF.UiProperty.ON_TEXT).prop(oFF.UiProperty.OFF_TEXT).event(oFF.UiEvent.ON_CHANGE);
	oFF.UiType.TEXT = oFF.UiType.createBasicControl("Text", "Allows embedding of longer text paragraphs, that need text wrapping.").addReceiverBinding(oFF.SemanticBindingType.STRING, oFF.ProtocolBindingType.STRING).interf(oFF.UiInterface.FONT).prop(oFF.UiProperty.TEXT);
	oFF.UiType.TEXT_AREA = oFF.UiType.createBasicControl("TextArea", "An enhanced Text control that is used for multi-line input of text.").addReceiverBinding(oFF.SemanticBindingType.STRING, oFF.ProtocolBindingType.STRING).addCapabilityFlag(oFF.UiType._SUPPORTS_TEXT_CHANGE).interf(oFF.UiInterface.FONT).prop(oFF.UiProperty.TEXT).prop(oFF.UiProperty.PLACEHOLDER).prop(oFF.UiProperty.MAX_LENGTH).prop(oFF.UiProperty.EDITABLE).prop(oFF.UiProperty.BUSY).prop(oFF.UiProperty.DEBOUNCE_TIME).event(oFF.UiEvent.ON_LIVE_CHANGE).event(oFF.UiEvent.ON_EDITING_BEGIN).event(oFF.UiEvent.ON_EDITING_END).event(oFF.UiEvent.ON_ENTER).event(oFF.UiEvent.ON_PASTE).event(oFF.UiEvent.ON_FILE_DROP);
	oFF.UiType.SLIDER = oFF.UiType.createBasicControl("Slider", "The purpose of the control is to enable visual selection of a value in a continuous numerical range by moving an adjustable handle.").addCapabilityFlag(oFF.UiType._SUPPORTS_SLIDER_VALUE_CHANGE).prop(oFF.UiProperty.SLIDER_VALUE).prop(oFF.UiProperty.SLIDER_MINIMUM).prop(oFF.UiProperty.SLIDER_MAXIMUM).prop(oFF.UiProperty.SLIDER_STEP).event(oFF.UiEvent.ON_LIVE_CHANGE).event(oFF.UiEvent.ON_CHANGE);
	oFF.UiType.RANGE_SLIDER = oFF.UiType.createBasicControl("RangeSlider", "Represents a numerical interval and two handles to select a sub-range within it.").addCapabilityFlag(oFF.UiType._SUPPORTS_SLIDER_VALUE_CHANGE).addCapabilityFlag(oFF.UiType._SUPPORTS_RANGE_SLIDER_VALUE_CHANGE).prop(oFF.UiProperty.SLIDER_VALUE).prop(oFF.UiProperty.SLIDER_UPPER_VALUE).prop(oFF.UiProperty.SLIDER_MINIMUM).prop(oFF.UiProperty.SLIDER_MAXIMUM).prop(oFF.UiProperty.SLIDER_STEP).event(oFF.UiEvent.ON_LIVE_CHANGE).event(oFF.UiEvent.ON_CHANGE);
	oFF.UiType.IMAGE = oFF.UiType.createBasicControl("Image", "Can be used to display an image that can be loaded from a remote or local server.").prop(oFF.UiProperty.SRC).prop(oFF.UiProperty.ROTATION).event(oFF.UiEvent.ON_PRESS);
	oFF.UiType.ICON = oFF.UiType.createBasicControl("Icon", "The Icon control uses an embedded font to display easily scalable icons. Check 'SAP Icons' for possible values.").prop(oFF.UiProperty.ICON).prop(oFF.UiProperty.ICON_SIZE).prop(oFF.UiProperty.COLOR).event(oFF.UiEvent.ON_PRESS).event(oFF.UiEvent.ON_HOVER).event(oFF.UiEvent.ON_HOVER_END);
	oFF.UiType.INPUT = oFF.UiType.createBasicControl("Input", "Allows the user to enter and edit text or numeric values in one line.").addReceiverBinding(oFF.SemanticBindingType.STRING, oFF.ProtocolBindingType.STRING).addCapabilityFlag(oFF.UiType._SUPPORTS_TEXT_CHANGE).addSuggestions().interf(oFF.UiInterface.FONT).prop(oFF.UiProperty.TEXT).prop(oFF.UiProperty.PLACEHOLDER).prop(oFF.UiProperty.INPUT_TYPE).prop(oFF.UiProperty.REQUIRED).prop(oFF.UiProperty.MAX_LENGTH).prop(oFF.UiProperty.EDITABLE).prop(oFF.UiProperty.BUSY).prop(oFF.UiProperty.DEBOUNCE_TIME).prop(oFF.UiProperty.VALUE_STATE).prop(oFF.UiProperty.VALUE_STATE_TEXT).aggregation(oFF.UiAggregation.END_ICONS).method(oFF.UiMethod.SELECT_TEXT).event(oFF.UiEvent.ON_LIVE_CHANGE).event(oFF.UiEvent.ON_EDITING_BEGIN).event(oFF.UiEvent.ON_EDITING_END).event(oFF.UiEvent.ON_ENTER).event(oFF.UiEvent.ON_SUGGESTION_SELECT).event(oFF.UiEvent.ON_PASTE);
	oFF.UiType.SEARCH_FIELD = oFF.UiType.createBasicControl("SearchField", "An Input control variation configured for searching of specific items/text.").addReceiverBinding(oFF.SemanticBindingType.STRING, oFF.ProtocolBindingType.STRING).addCapabilityFlag(oFF.UiType._SUPPORTS_TEXT_CHANGE).addSuggestions().prop(oFF.UiProperty.TEXT).prop(oFF.UiProperty.PLACEHOLDER).prop(oFF.UiProperty.MAX_LENGTH).prop(oFF.UiProperty.BUSY).prop(oFF.UiProperty.DEBOUNCE_TIME).event(oFF.UiEvent.ON_LIVE_CHANGE).event(oFF.UiEvent.ON_EDITING_BEGIN).event(oFF.UiEvent.ON_EDITING_END).event(oFF.UiEvent.ON_SEARCH).event(oFF.UiEvent.ON_SUGGESTION_SELECT).event(oFF.UiEvent.ON_PASTE);
	oFF.UiType.DATE_PICKER = oFF.UiType.createBasicControl("DatePicker", "Enables the users to select a localized date between 0001-01-01 and 9999-12-31.").addCapabilityFlag(oFF.UiType._SUPPORTS_VALUE_CHANGE).prop(oFF.UiProperty.VALUE).prop(oFF.UiProperty.EDITABLE).prop(oFF.UiProperty.MIN_DATE).prop(oFF.UiProperty.MAX_DATE).prop(oFF.UiProperty.VALUE_FORMAT).prop(oFF.UiProperty.DISPLAY_FORMAT).prop(oFF.UiProperty.VALUE_STATE).prop(oFF.UiProperty.VALUE_STATE_TEXT).prop(oFF.UiProperty.DEBOUNCE_TIME).event(oFF.UiEvent.ON_CHANGE).event(oFF.UiEvent.ON_LIVE_CHANGE);
	oFF.UiType.TIME_PICKER = oFF.UiType.createBasicControl("TimePicker", "A single-field input control that enables the users to fill time related input fields.").addCapabilityFlag(oFF.UiType._SUPPORTS_VALUE_CHANGE).prop(oFF.UiProperty.VALUE).prop(oFF.UiProperty.EDITABLE).prop(oFF.UiProperty.VALUE_FORMAT).prop(oFF.UiProperty.DISPLAY_FORMAT).prop(oFF.UiProperty.MINUTES_INTERVAL).prop(oFF.UiProperty.SECONDS_INTERVAL).prop(oFF.UiProperty.VALUE_STATE).prop(oFF.UiProperty.VALUE_STATE_TEXT).prop(oFF.UiProperty.DEBOUNCE_TIME).event(oFF.UiEvent.ON_CHANGE).event(oFF.UiEvent.ON_LIVE_CHANGE);
	oFF.UiType.DATE_TIME_PICKER = oFF.UiType.createBasicControl("DateTimePicker", "Enables the users to select date (between 0001-01-01 and 9999-12-31) and time values in a combined input.").addCapabilityFlag(oFF.UiType._SUPPORTS_VALUE_CHANGE).prop(oFF.UiProperty.VALUE).prop(oFF.UiProperty.EDITABLE).prop(oFF.UiProperty.MIN_DATE).prop(oFF.UiProperty.MAX_DATE).prop(oFF.UiProperty.VALUE_FORMAT).prop(oFF.UiProperty.DISPLAY_FORMAT).prop(oFF.UiProperty.MINUTES_INTERVAL).prop(oFF.UiProperty.SECONDS_INTERVAL).prop(oFF.UiProperty.VALUE_STATE).prop(oFF.UiProperty.VALUE_STATE_TEXT).prop(oFF.UiProperty.DEBOUNCE_TIME).event(oFF.UiEvent.ON_CHANGE).event(oFF.UiEvent.ON_LIVE_CHANGE);
	oFF.UiType.CALENDAR = oFF.UiType.createBasicControl("Calendar", "Basic Calendar control which is used to pick a specifiec date. This calendar is used for DatePickers.").addCapabilityFlag(oFF.UiType._SUPPORTS_START_DATE_CHANGE).addCapabilityFlag(oFF.UiType._SUPPORTS_END_DATE_CHANGE).prop(oFF.UiProperty.START_DATE).prop(oFF.UiProperty.END_DATE).prop(oFF.UiProperty.INTERVAL_SELECTION).prop(oFF.UiProperty.MIN_DATE).prop(oFF.UiProperty.MAX_DATE).prop(oFF.UiProperty.VALUE_FORMAT).event(oFF.UiEvent.ON_CHANGE);
	oFF.UiType.ACTIVITY_INDICATOR = oFF.UiType.createBasicControl("ActivityIndicator", "Informs the user about an ongoing operation.").prop(oFF.UiProperty.TEXT).prop(oFF.UiProperty.SRC).prop(oFF.UiProperty.ICON_SIZE).prop(oFF.UiProperty.ANIMATION_DURATION);
	oFF.UiType.PROGRESS_INDICATOR = oFF.UiType.createBasicControl("ProgressIndicator", "Shows the progress of a process in a graphical way.").prop(oFF.UiProperty.TEXT).prop(oFF.UiProperty.ANIMATED).prop(oFF.UiProperty.PERCENT_VALUE).prop(oFF.UiProperty.SHOW_VALUE).prop(oFF.UiProperty.COLOR).prop(oFF.UiProperty.FONT_COLOR);
	oFF.UiType.SPACER = oFF.UiType.createBasicControl("Spacer", "Spacer control used to create empty space between other controls.").prop(oFF.UiProperty.BACKGROUND_IMAGE_SRC);
	oFF.UiType.HTML = oFF.UiType.createBasicControl("Html", "Embeds standard HTML in an UI control tree.").prop(oFF.UiProperty.VALUE).event(oFF.UiEvent.ON_LOAD_FINISHED);
	oFF.UiType.WEB_ASSEMBLY = oFF.UiType.createBasicControl("WebAssembly", "Allows to embed WebAsembly programs in an Ui control tree.").prop(oFF.UiProperty.SRC).method(oFF.UiMethod.FULLSCREEN).event(oFF.UiEvent.ON_LOAD_FINISHED).event(oFF.UiEvent.ON_ERROR);
	oFF.UiType.RADIO_BUTTON = oFF.UiType.createBasicControl("RadioButton", "RadioButton is a control similar to a Checkbox, but it allows you to choose only one of the predefined set of options.").addCapabilityFlag(oFF.UiType._SUPPORTS_SELECTED_CHANGE).prop(oFF.UiProperty.TEXT).prop(oFF.UiProperty.SELECTED).event(oFF.UiEvent.ON_CHANGE);
	oFF.UiType.CODE_EDITOR = oFF.UiType.createBasicControl("CodeEditor", "Allows to visualize source code of various types with syntax highlighting, line numbers in editable and read only mode.").addCapabilityFlag(oFF.UiType._SUPPORTS_TEXT_CHANGE).prop(oFF.UiProperty.TEXT).prop(oFF.UiProperty.CODE_TYPE).prop(oFF.UiProperty.EDITABLE).prop(oFF.UiProperty.BUSY).prop(oFF.UiProperty.DEBOUNCE_TIME).event(oFF.UiEvent.ON_LIVE_CHANGE).event(oFF.UiEvent.ON_EDITING_BEGIN).event(oFF.UiEvent.ON_EDITING_END).event(oFF.UiEvent.ON_ENTER).event(oFF.UiEvent.ON_PASTE).event(oFF.UiEvent.ON_FILE_DROP);
	oFF.UiType.CLOCK = oFF.UiType.createBasicControl("Clock", "Display a clock which shows the current time.").interf(oFF.UiInterface.FONT).event(oFF.UiEvent.ON_PRESS);
	oFF.UiType.APP_ICON = oFF.UiType.createBasicControl("AppIcon", "A control which displays a configurable app-like icon.").prop(oFF.UiProperty.TEXT).prop(oFF.UiProperty.SRC).event(oFF.UiEvent.ON_CLICK).event(oFF.UiEvent.ON_DOUBLE_CLICK).event(oFF.UiEvent.ON_MOVE).event(oFF.UiEvent.ON_MOVE_START).event(oFF.UiEvent.ON_MOVE_END).event(oFF.UiEvent.ON_CONTEXT_MENU);
	oFF.UiType.TASK_BAR_BUTTON = oFF.UiType.createBasicControl("TaskBarButton", "An variation of a Button that is used in the task bar.").prop(oFF.UiProperty.TEXT).prop(oFF.UiProperty.SRC).event(oFF.UiEvent.ON_PRESS).event(oFF.UiEvent.ON_CONTEXT_MENU);
	oFF.UiType.DIALOG_BUTTON = oFF.UiType.createBasicControl("DialogButton", "A variation of a button which is used in the dialog.").setSuperType(oFF.UiType.BUTTON);
	oFF.UiType.PAGE_BUTTON = oFF.UiType.createBasicControl("PageButton", "A variation of a button which can be used as a page button in a page header area.").setSuperType(oFF.UiType.BUTTON);
};
oFF.UiType.staticSetupLists = function()
{
	oFF.UiType.COMBO_BOX_BASE = oFF.UiType.createAbstractItemContainer("ComboBoxBase", "A Dropdown list variation which enables selecting and filtering values.", oFF.UiType.CONTROL, oFF.UiType.DROPDOWN_ITEM, oFF.UiType.DROPDOWN_ITEM).addCapabilityFlag(oFF.UiType._SUPPORTS_TEXT_CHANGE).prop(oFF.UiProperty.TEXT).prop(oFF.UiProperty.PLACEHOLDER).prop(oFF.UiProperty.REQUIRED).prop(oFF.UiProperty.VALUE_STATE).prop(oFF.UiProperty.VALUE_STATE_TEXT).prop(oFF.UiProperty.OPEN).method(oFF.UiMethod.OPEN).method(oFF.UiMethod.CLOSE).event(oFF.UiEvent.ON_SELECTION_CHANGE).event(oFF.UiEvent.ON_ENTER).event(oFF.UiEvent.ON_EDITING_BEGIN).event(oFF.UiEvent.ON_EDITING_END);
	oFF.UiType.DROPDOWN = oFF.UiType.createItemContainer("Dropdown", "The Dropdown control provides a list of predefined items that allows users to choose options and additionally trigger some actions.", oFF.UiType.DROPDOWN_ITEM, oFF.UiType.DROPDOWN_ITEM).addSingleSelection(oFF.UiAggregation.ITEMS).addSenderBinding(oFF.SemanticBindingType.STRING, oFF.ProtocolBindingType.STRING).prop(oFF.UiProperty.REQUIRED).prop(oFF.UiProperty.EDITABLE).prop(oFF.UiProperty.OPEN).prop(oFF.UiProperty.VALUE_STATE).prop(oFF.UiProperty.VALUE_STATE_TEXT).aggregation(oFF.UiAggregation.BUTTONS).method(oFF.UiMethod.OPEN).method(oFF.UiMethod.CLOSE).event(oFF.UiEvent.ON_SELECT);
	oFF.UiType.COMBO_BOX = oFF.UiType.createWithParent("ComboBox", "A Dropdown list variation which enables selecting and filtering values.", oFF.UiType.COMBO_BOX_BASE).addSingleSelection(oFF.UiAggregation.ITEMS).event(oFF.UiEvent.ON_CHANGE);
	oFF.UiType.MULTI_COMBO_BOX = oFF.UiType.createWithParent("MultiComboBox", "A ComboBox variation which allows the user to either type a value directly into the control or choose multiply items from the list of existing items.", oFF.UiType.COMBO_BOX_BASE).addMultiSelection(oFF.UiAggregation.ITEMS).event(oFF.UiEvent.ON_SELECTION_FINISH);
	oFF.UiType.LIST = oFF.UiType.createItemContainer("List", "The List control provides a container for list items. ", oFF.UiType.LIST_ITEM_BASE, oFF.UiType.LIST_ITEM).addMultiSelection(oFF.UiAggregation.ITEMS).prop(oFF.UiProperty.SELECTION_MODE).prop(oFF.UiProperty.BUSY).prop(oFF.UiProperty.HEADER).event(oFF.UiEvent.ON_SELECT).event(oFF.UiEvent.ON_SELECTION_CHANGE).event(oFF.UiEvent.ON_DELETE).event(oFF.UiEvent.ON_SCROLL_LOAD);
	oFF.UiType.RADIO_BUTTON_GROUP = oFF.UiType.createBasicControl("RadioButtonGroup", "This control is used as a wrapper for a group of RadioButton controls, which can be used as a single UI element.").addSingleSelection(oFF.UiAggregation.RADIO_BUTTONS).prop(oFF.UiProperty.COLUMN_COUNT).aggregation(oFF.UiAggregation.RADIO_BUTTONS).event(oFF.UiEvent.ON_SELECT);
	oFF.UiType.TILE_CONTAINER = oFF.UiType.createItemContainer("TileContainer", "The TileContainer control provides a container for tile items. ", oFF.UiType.TILE_ITEM, oFF.UiType.TILE_ITEM).event(oFF.UiEvent.ON_CONTEXT_MENU);
	oFF.UiType.TOOLBAR = oFF.UiType.createItemContainer("Toolbar", "Horizontal container most commonly used to display buttons, labels, selects and various other input controls.", oFF.UiType.CONTROL, null);
	oFF.UiType.SEGMENTED_BUTTON = oFF.UiType.createItemContainer("SegmentedButton", "A horizontal control made of multiple buttons, which can display a title or an image.", oFF.UiType.SEGMENTED_BUTTON_ITEM, oFF.UiType.SEGMENTED_BUTTON_ITEM).addSingleSelection(oFF.UiAggregation.ITEMS).event(oFF.UiEvent.ON_SELECTION_CHANGE);
	oFF.UiType.LAUNCHPAD = oFF.UiType.createItemContainer("Launchpad", "A desktop-like like control which can be used to show app icons in a clean and ordere way.", oFF.UiType.APP_ICON, oFF.UiType.APP_ICON).prop(oFF.UiProperty.BACKGROUND_IMAGE_SRC).prop(oFF.UiProperty.HEADER).prop(oFF.UiProperty.FOOTER).prop(oFF.UiProperty.HEADER_HEIGHT).prop(oFF.UiProperty.FOOTER_HEIGHT).event(oFF.UiEvent.ON_CONTEXT_MENU);
	oFF.UiType.TASK_BAR = oFF.UiType.createItemContainer("TaskBar", "A Horizontal container which displays TaskBarButton controls.", oFF.UiType.TASK_BAR_BUTTON, oFF.UiType.TASK_BAR_BUTTON).event(oFF.UiEvent.ON_CONTEXT_MENU);
};
oFF.UiType.staticSetupGrids = function()
{
	oFF.UiType.TABLE = oFF.UiType.createBasicControl("Table", "Provides a comprehensive set of features for displaying and dealing with vast amounts of data. The Table control supports desktop PCs and tablet devices. ").addCapabilityFlag(oFF.UiType._SUPPORTS_VISIBLE_ROW_COUNT_CHANGE).addCapabilityFlag(oFF.UiType._SUPPORTS_FIRST_VISIBLE_ROW_CHANGE).addMultiSelection(oFF.UiAggregation.ROWS).prop(oFF.UiProperty.SELECTION_MODE).prop(oFF.UiProperty.SELECTION_BEHAVIOR).prop(oFF.UiProperty.TITLE).prop(oFF.UiProperty.BUSY).prop(oFF.UiProperty.ENABLE_SELECT_ALL).prop(oFF.UiProperty.FOOTER).prop(oFF.UiProperty.VISIBLE_ROW_COUNT).prop(oFF.UiProperty.VISIBLE_ROW_COUNT_MODE).prop(oFF.UiProperty.MIN_ROW_COUNT).prop(oFF.UiProperty.FIRST_VISIBLE_ROW).aggregation(oFF.UiAggregation.COLUMNS).aggregation(oFF.UiAggregation.ROWS).event(oFF.UiEvent.ON_SELECT).event(oFF.UiEvent.ON_SELECTION_CHANGE).event(oFF.UiEvent.ON_SCROLL);
	oFF.UiType.RESPONSIVE_TABLE = oFF.UiType.createBasicControl("ResponsiveTable", "The ResponsiveTable control provides a set of sophisticated and convenience functions for responsive table design. For mobile devices, the recommended limit of table rows is 100 (based on 4 columns) to assure proper performance.").addMultiSelection(oFF.UiAggregation.RESPONSIVE_TABLE_ROWS).prop(oFF.UiProperty.SELECTION_MODE).prop(oFF.UiProperty.BUSY).prop(oFF.UiProperty.HEADER).aggregation(oFF.UiAggregation.RESPONSIVE_TABLE_COLUMNS).aggregation(oFF.UiAggregation.RESPONSIVE_TABLE_ROWS).event(oFF.UiEvent.ON_SELECT).event(oFF.UiEvent.ON_SELECTION_CHANGE).event(oFF.UiEvent.ON_DELETE).event(oFF.UiEvent.ON_SCROLL_LOAD);
};
oFF.UiType.staticSetupTrees = function()
{
	oFF.UiType.TREE = oFF.UiType.createItemContainer("Tree", "The Tree control provides a tree structure for displaying data in a hierarchy.", oFF.UiType.TREE_ITEM_BASE, oFF.UiType.TREE_ITEM).addMultiSelection(oFF.UiAggregation.ITEMS).prop(oFF.UiProperty.SELECTION_MODE).prop(oFF.UiProperty.EXPANDED).prop(oFF.UiProperty.TITLE).prop(oFF.UiProperty.BUSY).prop(oFF.UiProperty.HEADER).method(oFF.UiMethod.EXPAND_TO_LEVEL).method(oFF.UiMethod.COLLAPSE_ALL).event(oFF.UiEvent.ON_SELECT).event(oFF.UiEvent.ON_SELECTION_CHANGE).event(oFF.UiEvent.ON_EXPAND).event(oFF.UiEvent.ON_COLLAPSE).event(oFF.UiEvent.ON_DELETE);
	oFF.UiType.TREE_TABLE = oFF.UiType.createBasicControl("TreeTable", "The TreeTable control provides a comprehensive set of features to display hierarchical data.").addCapabilityFlag(oFF.UiType._SUPPORTS_VISIBLE_ROW_COUNT_CHANGE).addCapabilityFlag(oFF.UiType._SUPPORTS_FIRST_VISIBLE_ROW_CHANGE).addMultiSelection(oFF.UiAggregation.TREE_TABLE_ROWS).prop(oFF.UiProperty.SELECTION_MODE).prop(oFF.UiProperty.SELECTION_BEHAVIOR).prop(oFF.UiProperty.EXPANDED).prop(oFF.UiProperty.TITLE).prop(oFF.UiProperty.BUSY).prop(oFF.UiProperty.ENABLE_SELECT_ALL).prop(oFF.UiProperty.FOOTER).prop(oFF.UiProperty.VISIBLE_ROW_COUNT).prop(oFF.UiProperty.VISIBLE_ROW_COUNT_MODE).prop(oFF.UiProperty.MIN_ROW_COUNT).prop(oFF.UiProperty.FIRST_VISIBLE_ROW).aggregation(oFF.UiAggregation.COLUMNS).aggregation(oFF.UiAggregation.TREE_TABLE_ROWS).method(oFF.UiMethod.EXPAND_TO_LEVEL).method(oFF.UiMethod.COLLAPSE_ALL).event(oFF.UiEvent.ON_SELECT).event(oFF.UiEvent.ON_SELECTION_CHANGE).event(oFF.UiEvent.ON_EXPAND).event(oFF.UiEvent.ON_COLLAPSE).event(oFF.UiEvent.ON_SCROLL);
};
oFF.UiType.staticSetupFloatingControls = function()
{
	oFF.UiType.DIALOG = oFF.UiType.createContentContainer("Dialog", "A popup that interrupts the current processing and prompts the user for an action or an input in a modal mode.").setIsFloating().prop(oFF.UiProperty.TITLE).prop(oFF.UiProperty.OPEN).prop(oFF.UiProperty.BUSY).prop(oFF.UiProperty.ICON).prop(oFF.UiProperty.RESIZABLE).prop(oFF.UiProperty.STATE).prop(oFF.UiProperty.SHOW_HEADER).prop(oFF.UiProperty.DRAGGABLE).aggregation(oFF.UiAggregation.DIALOG_BUTTONS).method(oFF.UiMethod.OPEN).method(oFF.UiMethod.SHAKE).event(oFF.UiEvent.ON_BEFORE_OPEN).event(oFF.UiEvent.ON_BEFORE_CLOSE).event(oFF.UiEvent.ON_AFTER_OPEN).event(oFF.UiEvent.ON_AFTER_CLOSE).event(oFF.UiEvent.ON_OPEN).event(oFF.UiEvent.ON_CLOSE);
	oFF.UiType.ALERT = oFF.UiType.createBasicControl("Alert", "A popup that interrupts the current processing and displays a message to the user.").setIsFloating().prop(oFF.UiProperty.TITLE).prop(oFF.UiProperty.TEXT).prop(oFF.UiProperty.OPEN).method(oFF.UiMethod.OPEN).event(oFF.UiEvent.ON_CLOSE);
	oFF.UiType.TOAST = oFF.UiType.createBasicControl("Toast", "A small, non-disruptive popup for messages.").setIsFloating().prop(oFF.UiProperty.TEXT).prop(oFF.UiProperty.FONT_COLOR).prop(oFF.UiProperty.MESSAGE_TYPE).prop(oFF.UiProperty.OPEN).method(oFF.UiMethod.OPEN);
	oFF.UiType.POPOVER = oFF.UiType.createContentContainer("Popover", "Displays additional information for an object in a compact way.").setIsFloating().prop(oFF.UiProperty.TITLE).prop(oFF.UiProperty.OPEN).prop(oFF.UiProperty.BUSY).prop(oFF.UiProperty.PLACEMENT).prop(oFF.UiProperty.MARGIN).method(oFF.UiMethod.OPEN_AT).event(oFF.UiEvent.ON_BEFORE_OPEN).event(oFF.UiEvent.ON_BEFORE_CLOSE).event(oFF.UiEvent.ON_AFTER_OPEN).event(oFF.UiEvent.ON_AFTER_CLOSE);
	oFF.UiType.MENU = oFF.UiType.createItemContainer("Menu", "The Menu control represents a hierarchical menu. When opened on mobile devices it occupies the whole screen.", oFF.UiType.MENU_ITEM, oFF.UiType.MENU_ITEM).setIsFloating().method(oFF.UiMethod.OPEN_AT).method(oFF.UiMethod.OPEN_AT_POSITION).event(oFF.UiEvent.ON_CLOSE);
	oFF.UiType.WINDOW = oFF.UiType.createContentContainer("Window", "A window that does not interrupt the current processing and allows to display all kind of content.").setIsFloating().addCapabilityFlag(oFF.UiType._SUPPORTS_MAXIMIZED_CHANGE).addCapabilityFlag(oFF.UiType._SUPPORTS_HIDDEN_CHANGE).interf(oFF.UiInterface.WINDOW);
	oFF.UiType.TERMINAL = oFF.UiType.createBasicControl("Terminal", "A console-based ui control which emulates a text-based user interface.").setIsFloating().addCapabilityFlag(oFF.UiType._SUPPORTS_MAXIMIZED_CHANGE).addCapabilityFlag(oFF.UiType._SUPPORTS_HIDDEN_CHANGE).addCapabilityFlag(oFF.UiType._SUPPORTS_COMMAND_HISTORY_CHANGE).interf(oFF.UiInterface.WINDOW).prop(oFF.UiProperty.FONT_COLOR).prop(oFF.UiProperty.PATH).prop(oFF.UiProperty.PROMPT).prop(oFF.UiProperty.COMMAND_HISTORY).method(oFF.UiMethod.PRINT).method(oFF.UiMethod.PRINTLN).method(oFF.UiMethod.START_READ_LINE).event(oFF.UiEvent.ON_EXECUTE).event(oFF.UiEvent.ON_TERMINATE).event(oFF.UiEvent.ON_READ_LINE_FINISHED);
};
oFF.UiType.staticSetupIndexedLayout = function()
{
	oFF.UiType.FLEX_LAYOUT = oFF.UiType.createLayout("FlexLayout", "The Flex layout control builds the container for a flexible box layout.").interf(oFF.UiInterface.FLEX_CONTAINER).prop(oFF.UiProperty.BUSY).prop(oFF.UiProperty.OVERFLOW).event(oFF.UiEvent.ON_FILE_DROP);
	oFF.UiType.FLOW_LAYOUT = oFF.UiType.createLayout("FlowLayout", "The Flow layout arranges child item in a directional and responsive flow.").prop(oFF.UiProperty.BUSY).prop(oFF.UiProperty.OVERFLOW);
	oFF.UiType.CANVAS_LAYOUT = oFF.UiType.createLayout("CanvasLayout", "The Canvas layout allows to place the child items in an custom an absolute way.");
	oFF.UiType.HORIZONTAL_LAYOUT = oFF.UiType.createLayout("HorizontalLayout", "A layout that provides support for horizontal alignment of controls.");
	oFF.UiType.VERTICAL_LAYOUT = oFF.UiType.createLayout("VerticalLayout", "A layout that provides support for vertical alignment of controls.");
	oFF.UiType.MATRIX_LAYOUT_CELL = oFF.UiType.createContentContainer("MatrixLayoutCell", "The MatrixLayoutCell is used to define the content of a specific cell.").prop(oFF.UiProperty.COLUMN_SPAN).prop(oFF.UiProperty.ROW_SPAN);
	oFF.UiType.MATRIX_LAYOUT_ROW = oFF.UiType.createBasicControl("MatrixLayoutRow", "The MatrixLayoutRow control is used to define a row of cells in a MatrixLayout.").aggregation(oFF.UiAggregation.MATRIX_LAYOUT_CELLS);
	oFF.UiType.MATRIX_LAYOUT = oFF.UiType.createBasicControl("MatrixLayout", "A layout that arranges the child items in a grid-like way.").aggregation(oFF.UiAggregation.MATRIX_LAYOUT_ROWS);
};
oFF.UiType.staticSetupContentContainers = function()
{
	oFF.UiType.ROOT = oFF.UiType.createContentContainer("Root", "The main control used to render the UI Tree. Should not be created manually!");
	oFF.UiType.PANEL = oFF.UiType.createContentContainer("Panel", "A container control which has a header and a expandable content.").addCapabilityFlag(oFF.UiType._SUPPORTS_EXPANDED_CHANGE).prop(oFF.UiProperty.TEXT).prop(oFF.UiProperty.EXPANDABLE).prop(oFF.UiProperty.EXPANDED).prop(oFF.UiProperty.BUSY).prop(oFF.UiProperty.HEADER).event(oFF.UiEvent.ON_EXPAND).event(oFF.UiEvent.ON_COLLAPSE);
	oFF.UiType.SCROLL_CONTAINER = oFF.UiType.createContentContainer("ScrollContainer", "The ScrollContainer is a control that can display arbitrary content within a limited screen area and provides scrolling to make all content accessible.").prop(oFF.UiProperty.BUSY).method(oFF.UiMethod.SCROLL_TO).method(oFF.UiMethod.SCROLL_TO_CONTROL);
	oFF.UiType.PAGE = oFF.UiType.createContentContainer("Page", "A container control that holds one whole screen of an application. The page has three distinct areas that can hold content - a header, content area and a footer.").prop(oFF.UiProperty.TEXT).prop(oFF.UiProperty.BUSY).prop(oFF.UiProperty.SHOW_NAV_BUTTON).prop(oFF.UiProperty.SHOW_HEADER).prop(oFF.UiProperty.HEADER).prop(oFF.UiProperty.SUB_HEADER).prop(oFF.UiProperty.FOOTER).aggregation(oFF.UiAggregation.PAGE_BUTTONS);
	oFF.UiType.TILE = oFF.UiType.createContentContainer("Tile", "Displays header, subheader, and a customizable main area in a tile format.").prop(oFF.UiProperty.TITLE).prop(oFF.UiProperty.SUBTITLE).prop(oFF.UiProperty.LOAD_STATE).prop(oFF.UiProperty.FRAME_TYPE).prop(oFF.UiProperty.TILE_MODE).prop(oFF.UiProperty.BUSY).event(oFF.UiEvent.ON_PRESS);
};
oFF.UiType.staticSetupItemContainers = function()
{
	oFF.UiType.TAB_BAR = oFF.UiType.createItemContainer("TabBar", "A container control for managing multiple tabs, allowing the user to open and edit different items simultaneously.", oFF.UiType.TAB_BAR_ITEM, oFF.UiType.TAB_BAR_ITEM).addSingleSelection(oFF.UiAggregation.ITEMS).prop(oFF.UiProperty.BUSY).prop(oFF.UiProperty.SHOW_ADD_NEW_BUTTON).event(oFF.UiEvent.ON_ITEM_SELECT).event(oFF.UiEvent.ON_ITEM_CLOSE).event(oFF.UiEvent.ON_BUTTON_PRESS);
	oFF.UiType.ICON_TAB_BAR = oFF.UiType.createItemContainer("IconTabBar", "A container which represents a collection of tabs with associated content.", oFF.UiType.ICON_TAB_BAR_ITEM, oFF.UiType.ICON_TAB_BAR_ITEM).addSingleSelection(oFF.UiAggregation.ITEMS).prop(oFF.UiProperty.BUSY).prop(oFF.UiProperty.APPLY_CONTENT_PADDING).prop(oFF.UiProperty.ENABLE_REORDERING).prop(oFF.UiProperty.HEADER_MODE).event(oFF.UiEvent.ON_SELECT);
	oFF.UiType.NAVIGATION_CONTAINER = oFF.UiType.createBasicControl("NavigationContainer", "Handles hierarchical navigation between views or other controls.").addCapabilityFlag(oFF.UiType._SUPPORTS_NAVIGATION_PAGES_CHANGE).prop(oFF.UiProperty.BUSY).aggregation(oFF.UiAggregation.PAGES).method(oFF.UiMethod.POP_TO_PAGE).event(oFF.UiEvent.ON_BACK);
	oFF.UiType.HORIZONTAL_SPLITTER = oFF.UiType.createItemContainer("HorizontalSplitter", "A layout that contains several horizontal content areas.", oFF.UiType.CONTROL, null);
	oFF.UiType.VERTICAL_SPLITTER = oFF.UiType.createItemContainer("VerticalSplitter", "A layout that contains several vertical content areas.", oFF.UiType.CONTROL, null).prop(oFF.UiProperty.SPLITTER_POSITION);
};
oFF.UiType.staticSetupDataViz = function()
{
	oFF.UiType.CHART = oFF.UiType.createBasicControl("Chart", "A chart control to render highcharts based charts.").addReceiverBinding(oFF.SemanticBindingType.CHART, oFF.ProtocolBindingType.HIGH_CHART_PROTOCOL).prop(oFF.UiProperty.MODEL_JSON).prop(oFF.UiProperty.DATA_MANIFEST).prop(oFF.UiProperty.CHART_TYPE).prop(oFF.UiProperty.TEXT);
	oFF.UiType.HIGH_CHART = oFF.UiType.createBasicControl("HighChart", "A chart control to render highcharts based charts.").setSuperType(oFF.UiType.CHART).addReceiverBinding(oFF.SemanticBindingType.CHART, oFF.ProtocolBindingType.HIGH_CHART_PROTOCOL);
	oFF.UiType.VIZ_FRAME = oFF.UiType.createBasicControl("VizFrame", "A chart control to render VizFrame based charts.").setSuperType(oFF.UiType.CHART).addReceiverBinding(oFF.SemanticBindingType.CHART, oFF.ProtocolBindingType.VIZ_FRAME_PROTOCOL);
	oFF.UiType.MICRO_CHART = oFF.UiType.createBasicControl("MicroChart", "A chart control to render MicroChart based charts.").setSuperType(oFF.UiType.CHART).addReceiverBinding(oFF.SemanticBindingType.CHART, oFF.ProtocolBindingType.MICRO_CHART_PROTOCOL);
	oFF.UiType.VIZ_GRID = oFF.UiType.createBasicControl("VizGrid", "A basic grid control to render analytical grids.").addReceiverBinding(oFF.SemanticBindingType.TABLE, oFF.ProtocolBindingType.PLAIN_GRID).prop(oFF.UiProperty.TEXT).prop(oFF.UiProperty.MODEL_JSON).prop(oFF.UiProperty.DATA_MANIFEST);
	oFF.UiType.FIREFLY_GRID = oFF.UiType.createBasicControl("FireflyGrid", "A custom frefly grid control to render analytical grids.").addReceiverBinding(oFF.SemanticBindingType.TABLE, oFF.ProtocolBindingType.FIREFLY_GRID).prop(oFF.UiProperty.TEXT).prop(oFF.UiProperty.MODEL_JSON).prop(oFF.UiProperty.DATA_MANIFEST);
	oFF.UiType.SAC_TABLE_GRID = oFF.UiType.createBasicControl("SacTableGrid", "A SacGrid grid control to render analytical grids.").addReceiverBinding(oFF.SemanticBindingType.TABLE, oFF.ProtocolBindingType.SAC_TABLE_GRID).addCapabilityFlag(oFF.UiType._SUPPORTS_OFFSET_HEIGHT_CHANGE).addCapabilityFlag(oFF.UiType._SUPPORTS_OFFSET_WIDTH_CHANGE).prop(oFF.UiProperty.TEXT).prop(oFF.UiProperty.MODEL_JSON).prop(oFF.UiProperty.DATA_MANIFEST).prop(oFF.UiProperty.BUSY).prop(oFF.UiProperty.OFFSET_HEIGHT).prop(oFF.UiProperty.OFFSET_WIDTH).event(oFF.UiEvent.ON_CLICK).event(oFF.UiEvent.ON_CONTEXT_MENU).event(oFF.UiEvent.ON_SELECTION_CHANGE).event(oFF.UiEvent.ON_BUTTON_PRESS).event(oFF.UiEvent.ON_RESIZE).event(oFF.UiEvent.ON_TABLE_DRAG_AND_DROP).event(oFF.UiEvent.ON_LOAD_FINISHED).event(oFF.UiEvent.ON_SCROLL_LOAD);
	oFF.UiType.CARD = oFF.UiType.createBasicControl("Card", "A control that represents a container with a header and content.").addReceiverBinding(oFF.SemanticBindingType.KPI, oFF.ProtocolBindingType.SAP_KPI_PROTOCOL).prop(oFF.UiProperty.MODEL_JSON).prop(oFF.UiProperty.DATA_MANIFEST);
};
oFF.UiType.staticSetupMisc = function() {};
oFF.UiType.staticSetupCompositeControls = function()
{
	oFF.UiType.FANCY_BUTTON = oFF.UiType.createCompositeControl("FancyButton", "A fancy button composite control.").prop(oFF.UiProperty.TEXT).event(oFF.UiEvent.ON_PRESS);
	oFF.UiType.ANALYTICAL_CARD = oFF.UiType.createCompositeControl("AnalyticalCard", "A composite analytical card control to reneder analytical data and a chart.").addReceiverBinding(oFF.SemanticBindingType.KPI, oFF.ProtocolBindingType.SAP_KPI_PROTOCOL).addReceiverBinding(oFF.SemanticBindingType.CHART, oFF.ProtocolBindingType.HIGH_CHART_PROTOCOL).prop(oFF.UiProperty.MODEL_JSON).prop(oFF.UiProperty.DATA_MANIFEST);
	oFF.UiType.UNDO_BUTTON = oFF.UiType.createCompositeControl("UndoButton", "A undo composite control button used to undo olap based actions.");
	oFF.UiType.REDO_BUTTON = oFF.UiType.createCompositeControl("RedoButton", "A redo composite control button used to redo olap based actions.");
	oFF.UiType.CONVENIENCE_CMDS_MENU = oFF.UiType.createCompositeControl("ConvenienceCmdsMenu", "A composite control which displays a menu with a set of olap based actions.");
	oFF.UiType.OLAP_CMD_BUTTON = oFF.UiType.createCompositeControl("OlapCmdButton", "A olap command button composite control.").prop(oFF.UiProperty.PATH).prop(oFF.UiProperty.VALUE);
	oFF.UiType.OLAP_PIVOT_TABLE = oFF.UiType.createCompositeControl("OlapPivotTable", "A olap pivot table composite control.").addReceiverBinding(oFF.SemanticBindingType.TABLE, oFF.ProtocolBindingType.FIREFLY_GRID).prop(oFF.UiProperty.TEXT);
	oFF.UiType.OLAP_CONTEXT_MENU = oFF.UiType.createCompositeControl("OlapContextMenu", "A olap context menu composite control.");
};
oFF.UiType.staticSetupTypeFallbacks = function()
{
	oFF.UiType.ACTIVITY_INDICATOR.setFallbackType(oFF.UiType.BUTTON);
	oFF.UiType.SUGGESTION_ITEM.setFallbackType(oFF.UiType.DROPDOWN_ITEM);
	oFF.UiType.TILE_ITEM.setFallbackType(oFF.UiType.BUTTON);
	oFF.UiType.TILE_CONTAINER.setFallbackType(oFF.UiType.FLEX_LAYOUT);
	oFF.UiType.CANVAS_LAYOUT.setFallbackType(oFF.UiType.FLOW_LAYOUT);
	oFF.UiType.PAGE.setFallbackType(oFF.UiType.ICON_TAB_BAR_ITEM);
	oFF.UiType.NAVIGATION_CONTAINER.setFallbackType(oFF.UiType.ICON_TAB_BAR);
};
oFF.UiType.createExt = function(name, description, parentType, defaultItemType, nodeType)
{
	if (oFF.UiType.s_lookup.containsKey(name))
	{
		throw oFF.XException.createIllegalArgumentException(oFF.XStringUtils.concatenate2("UiType already exists: ", name));
	}
	var newConstant = new oFF.UiType();
	if (oFF.isNull(parentType))
	{
		newConstant.setupExt(name, oFF.UiType.ELEMENT);
	}
	else
	{
		newConstant.setupExt(name, parentType);
	}
	if (oFF.XStringUtils.isNotNullAndNotEmpty(description))
	{
		newConstant.m_description = description;
	}
	else
	{
		newConstant.m_description = "-";
	}
	newConstant.setDefaultItemType(defaultItemType);
	newConstant.m_uiFactoriesByStyle = oFF.XHashMapByString.create();
	newConstant.m_receiverBindings = oFF.XList.create();
	newConstant.m_receiverProtocolBindings = oFF.XList.create();
	newConstant.m_senderBindings = oFF.XList.create();
	newConstant.m_senderProtocolBindings = oFF.XList.create();
	newConstant.m_properties = oFF.XList.create();
	newConstant.m_events = oFF.XList.create();
	newConstant.m_aggregations = oFF.XList.create();
	newConstant.m_methods = oFF.XList.create();
	newConstant.m_interfaces = oFF.XList.create();
	newConstant.m_nodeType = nodeType;
	newConstant.m_isMultiSelectionSupported = false;
	newConstant.m_allowedItemType = null;
	newConstant.m_defaultItemType = null;
	oFF.UiType.s_lookup.put(name, newConstant);
	return newConstant;
};
oFF.UiType.createAbstract = function(name, description, parentType)
{
	var tmpParentType = parentType;
	if (oFF.isNull(tmpParentType))
	{
		tmpParentType = oFF.UiComponentType.UI_CONTROL;
	}
	var uiType = oFF.UiType.createExt(name, description, tmpParentType, null, null);
	uiType.setIsAbstractControl();
	return uiType;
};
oFF.UiType.createAbstractItemContainer = function(name, description, parentType, allowedType, defaultItemType)
{
	var uiType = oFF.UiType.createAbstract(name, description, parentType);
	uiType.aggregation(oFF.UiAggregation.ITEMS);
	uiType.setAllowedItemType(allowedType);
	uiType.setDefaultItemType(defaultItemType);
	return uiType;
};
oFF.UiType.createWithParent = function(name, description, parentType)
{
	var uiType = oFF.UiType.createExt(name, description, parentType, null, oFF.UiNodeType.NODE);
	return uiType;
};
oFF.UiType.createBasicControl = function(name, description)
{
	var uiType = oFF.UiType.createWithParent(name, description, oFF.UiType.CONTROL);
	return uiType;
};
oFF.UiType.createContentContainer = function(name, description)
{
	var uiType = oFF.UiType.createWithParent(name, description, oFF.UiType.CONTROL);
	uiType.prop(oFF.UiProperty.CONTENT);
	return uiType;
};
oFF.UiType.createItemContainer = function(name, description, allowedType, defaultItemType)
{
	var uiType = oFF.UiType.createExt(name, description, oFF.UiType.CONTROL, defaultItemType, oFF.UiNodeType.NODE);
	uiType.aggregation(oFF.UiAggregation.ITEMS);
	uiType.setAllowedItemType(allowedType);
	uiType.setDefaultItemType(defaultItemType);
	return uiType;
};
oFF.UiType.createItem = function(name, description)
{
	var uiType = oFF.UiType.createExt(name, description, oFF.UiType.ITEM, null, oFF.UiNodeType.LEAF);
	return uiType;
};
oFF.UiType.createListItem = function(name, description)
{
	var uiType = oFF.UiType.createExt(name, description, oFF.UiType.LIST_ITEM_BASE, null, oFF.UiNodeType.LEAF);
	return uiType;
};
oFF.UiType.createTreeItem = function(name, description)
{
	var uiType = oFF.UiType.createExt(name, description, oFF.UiType.TREE_ITEM_BASE, null, oFF.UiNodeType.LEAF);
	uiType.aggregation(oFF.UiAggregation.ITEMS);
	uiType.setDefaultItemType(uiType);
	uiType.setAllowedItemType(oFF.UiType.TREE_ITEM_BASE);
	return uiType;
};
oFF.UiType.createLayout = function(name, description)
{
	var uiType = oFF.UiType.createExt(name, description, oFF.UiType.CONTROL, null, oFF.UiNodeType.NODE);
	uiType.aggregation(oFF.UiAggregation.ITEMS);
	return uiType;
};
oFF.UiType.createContentContainerLegacy = function(name)
{
	var uiType = oFF.UiType.createExt(name, null, null, null, oFF.UiNodeType.MAP);
	uiType.prop(oFF.UiProperty.CONTENT);
	return uiType;
};
oFF.UiType.createControlExt = function(name, description, superType)
{
	var uiType = oFF.UiType.createExt(name, description, superType, null, oFF.UiNodeType.LEAF);
	return uiType;
};
oFF.UiType.createCompositeControl = function(name, description)
{
	var uiType = oFF.UiType.createExt(name, description, oFF.UiType.COMPOSITE, null, oFF.UiNodeType.LEAF);
	return uiType;
};
oFF.UiType.createList = function(name, superType, defaultItemType)
{
	var uiType = oFF.UiType.createExt(name, null, superType, defaultItemType, oFF.UiNodeType.LIST);
	return uiType;
};
oFF.UiType.lookupUiType = function(name)
{
	return oFF.UiType.s_lookup.getByKey(name);
};
oFF.UiType.getAllUiTypes = function()
{
	return oFF.UiType.s_lookup.getIterator();
};
oFF.UiType.getAllUiTypeNamesSorted = function()
{
	var tmpUiTypeNamesSorted = oFF.XListOfString.create();
	var allUiTypesIterator = oFF.UiType.getAllUiTypes();
	while (allUiTypesIterator.hasNext())
	{
		var tmpUiType = allUiTypesIterator.next();
		tmpUiTypeNamesSorted.add(tmpUiType.getName());
	}
	tmpUiTypeNamesSorted.sortByDirection(oFF.XSortDirection.ASCENDING);
	return tmpUiTypeNamesSorted;
};
oFF.UiType.lookupByCapabilityFlag = function(simpleFlag)
{
	return oFF.UiType.s_flagLookup.getByKey(simpleFlag);
};
oFF.UiType.prototype.m_uiFactoriesByStyle = null;
oFF.UiType.prototype.m_description = null;
oFF.UiType.prototype.m_isAbstractControl = false;
oFF.UiType.prototype.m_fallbackFactoryType = null;
oFF.UiType.prototype.m_allowedItemType = null;
oFF.UiType.prototype.m_defaultItemType = null;
oFF.UiType.prototype.m_nodeType = null;
oFF.UiType.prototype.m_capabilityFlags = null;
oFF.UiType.prototype.m_properties = null;
oFF.UiType.prototype.m_aggregations = null;
oFF.UiType.prototype.m_methods = null;
oFF.UiType.prototype.m_events = null;
oFF.UiType.prototype.m_interfaces = null;
oFF.UiType.prototype.m_selectionAggregation = null;
oFF.UiType.prototype.m_isMultiSelectionSupported = false;
oFF.UiType.prototype.m_receiverBindings = null;
oFF.UiType.prototype.m_senderBindings = null;
oFF.UiType.prototype.m_receiverProtocolBindings = null;
oFF.UiType.prototype.m_senderProtocolBindings = null;
oFF.UiType.prototype.m_firstPosition = null;
oFF.UiType.prototype.m_secondPosition = null;
oFF.UiType.prototype.getFactory = function(styleClass)
{
	oFF.XObjectExt.assertNotNullExt(styleClass, "Missing style class");
	var controlFactory = this.m_uiFactoriesByStyle.getByKey(styleClass.getName());
	if (oFF.isNull(controlFactory) && oFF.notNull(this.m_fallbackFactoryType))
	{
		controlFactory = this.m_fallbackFactoryType.getFactory(styleClass);
	}
	return controlFactory;
};
oFF.UiType.prototype.setFactory = function(uiFactory)
{
	this.setFactoryExt(uiFactory, oFF.UiStyleClass.DESKTOP);
	this.setFactoryExt(uiFactory, oFF.UiStyleClass.MOBILE);
};
oFF.UiType.prototype.setFactoryExt = function(uiFactory, styleClass)
{
	var myStyleClass = styleClass;
	oFF.XObjectExt.assertNotNullExt(myStyleClass, "No style class given");
	this.m_uiFactoriesByStyle.put(myStyleClass.getName(), uiFactory);
};
oFF.UiType.prototype.setFallbackType = function(type)
{
	this.m_fallbackFactoryType = type;
	return this;
};
oFF.UiType.prototype.getFallbackType = function()
{
	return this.m_fallbackFactoryType;
};
oFF.UiType.prototype.getAllowedItemType = function()
{
	if (oFF.notNull(this.m_allowedItemType))
	{
		return this.m_allowedItemType;
	}
	if (this.hasSuperType())
	{
		return this.getSuperType().getAllowedItemType();
	}
	return null;
};
oFF.UiType.prototype.setAllowedItemType = function(itemType)
{
	if (oFF.notNull(itemType))
	{
		this.m_allowedItemType = itemType;
	}
	return this;
};
oFF.UiType.prototype.getDefaultItemType = function()
{
	if (oFF.notNull(this.m_defaultItemType))
	{
		return this.m_defaultItemType;
	}
	if (this.hasSuperType())
	{
		return this.getSuperType().getDefaultItemType();
	}
	return null;
};
oFF.UiType.prototype.setDefaultItemType = function(itemType)
{
	if (oFF.notNull(itemType))
	{
		this.m_defaultItemType = itemType;
	}
	return this;
};
oFF.UiType.prototype.setSuperType = function(type)
{
	this.setParent(type);
	return this;
};
oFF.UiType.prototype.getSuperType = function()
{
	if (this.getParent() === oFF.UiComponentType.UI_CONTROL || !this.getParent().isTypeOf(oFF.UiComponentType.UI_CONTROL))
	{
		return null;
	}
	return this.getParent();
};
oFF.UiType.prototype.hasSuperType = function()
{
	return this.getSuperType() !== null;
};
oFF.UiType.prototype.hasIndexedChildren = function()
{
	return this.m_nodeType === oFF.UiNodeType.LIST;
};
oFF.UiType.prototype.hasNamedChildren = function()
{
	return this.m_nodeType === oFF.UiNodeType.MAP;
};
oFF.UiType.prototype.isItem = function()
{
	return this.isTypeOf(oFF.UiType.ITEM);
};
oFF.UiType.prototype.getNodeType = function()
{
	return this.m_nodeType;
};
oFF.UiType.prototype.setNodeType = function(nodeType)
{
	this.m_nodeType = nodeType;
};
oFF.UiType.prototype.isComposite = function()
{
	return this.isTypeOf(oFF.UiType.COMPOSITE);
};
oFF.UiType.prototype.isFloatingControl = function()
{
	return this.isTypeOf(oFF.UiType.FLOATING_CONTROL);
};
oFF.UiType.prototype.setIsAbstractControl = function()
{
	this.m_isAbstractControl = true;
	return this;
};
oFF.UiType.prototype.isAbstractControl = function()
{
	return this.m_isAbstractControl;
};
oFF.UiType.prototype.prop = function(property)
{
	if (this.hasProperty(property))
	{
		return this;
	}
	this.m_properties.add(property);
	return this;
};
oFF.UiType.prototype.getOwnProperties = function()
{
	return this.m_properties;
};
oFF.UiType.prototype.getOwnPropertyNamesSorted = function()
{
	return this.sortConstantsByName(this.m_properties);
};
oFF.UiType.prototype.hasProperty = function(property)
{
	if (this.getOwnProperties().contains(property))
	{
		return true;
	}
	var uiInterfacesList = this.getOwnInterfaces();
	var hasUiInterfaceProperty = oFF.XCollectionUtils.contains(uiInterfacesList,  function(tmpUiInterafce){
		return tmpUiInterafce.hasProperty(property);
	}.bind(this));
	if (hasUiInterfaceProperty)
	{
		return true;
	}
	if (this.hasSuperType() && this.getSuperType().hasProperty(property))
	{
		return true;
	}
	return false;
};
oFF.UiType.prototype.aggregation = function(aggrDef)
{
	if (this.hasAggregation(aggrDef))
	{
		return this;
	}
	this.m_aggregations.add(aggrDef);
	return this;
};
oFF.UiType.prototype.getOwnAggregations = function()
{
	return this.m_aggregations;
};
oFF.UiType.prototype.getOwnAggregationNamesSorted = function()
{
	return this.sortConstantsByName(this.m_aggregations);
};
oFF.UiType.prototype.hasAggregation = function(aggrDef)
{
	if (this.getOwnAggregations().contains(aggrDef))
	{
		return true;
	}
	var uiInterfacesList = this.getOwnInterfaces();
	var hasUiInterfaceAggregation = oFF.XCollectionUtils.contains(uiInterfacesList,  function(tmpUiInterafce){
		return tmpUiInterafce.hasAggregation(aggrDef);
	}.bind(this));
	if (hasUiInterfaceAggregation)
	{
		return true;
	}
	if (this.hasSuperType() && this.getSuperType().hasAggregation(aggrDef))
	{
		return true;
	}
	return false;
};
oFF.UiType.prototype.method = function(method)
{
	if (this.hasMethod(method))
	{
		return this;
	}
	this.m_methods.add(method);
	return this;
};
oFF.UiType.prototype.getOwnMethods = function()
{
	return this.m_methods;
};
oFF.UiType.prototype.getOwnMethodNamesSorted = function()
{
	return this.sortConstantsByName(this.m_methods);
};
oFF.UiType.prototype.hasMethod = function(method)
{
	if (this.getOwnMethods().contains(method))
	{
		return true;
	}
	var uiInterfacesList = this.getOwnInterfaces();
	var hasUiInterfaceMethod = oFF.XCollectionUtils.contains(uiInterfacesList,  function(tmpUiInterafce){
		return tmpUiInterafce.hasMethod(method);
	}.bind(this));
	if (hasUiInterfaceMethod)
	{
		return true;
	}
	if (this.hasSuperType() && this.getSuperType().hasMethod(method))
	{
		return true;
	}
	return false;
};
oFF.UiType.prototype.event = function(eventDef)
{
	if (this.hasEvent(eventDef))
	{
		return this;
	}
	this.m_events.add(eventDef);
	return this;
};
oFF.UiType.prototype.getOwnEvents = function()
{
	return this.m_events;
};
oFF.UiType.prototype.getOwnEventNamesSorted = function()
{
	return this.sortConstantsByName(this.m_events);
};
oFF.UiType.prototype.hasEvent = function(eventDef)
{
	if (this.getOwnEvents().contains(eventDef))
	{
		return true;
	}
	var uiInterfacesList = this.getOwnInterfaces();
	var hasUiInterfaceMethod = oFF.XCollectionUtils.contains(uiInterfacesList,  function(tmpUiInterafce){
		return tmpUiInterafce.hasEvent(eventDef);
	}.bind(this));
	if (hasUiInterfaceMethod)
	{
		return true;
	}
	if (this.hasSuperType() && this.getSuperType().hasEvent(eventDef))
	{
		return true;
	}
	return false;
};
oFF.UiType.prototype.interf = function(interfaceDef)
{
	if (this.hasInterface(interfaceDef))
	{
		return this;
	}
	this.m_interfaces.add(interfaceDef);
	return this;
};
oFF.UiType.prototype.getOwnInterfaces = function()
{
	return this.m_interfaces;
};
oFF.UiType.prototype.getOwnInterfaceNamesSorted = function()
{
	return this.sortConstantsByName(this.m_interfaces);
};
oFF.UiType.prototype.hasInterface = function(interfaceDef)
{
	if (this.hasSuperType() && this.getSuperType().hasInterface(interfaceDef))
	{
		return true;
	}
	return this.m_interfaces.contains(interfaceDef);
};
oFF.UiType.prototype.addSingleSelection = function(aggrDef)
{
	this.m_selectionAggregation = aggrDef;
	this.m_isMultiSelectionSupported = false;
	if (oFF.isNull(this.m_selectionAggregation))
	{
		this.m_selectionAggregation = oFF.UiAggregation.ITEMS;
	}
	this.addCapabilityFlag(oFF.UiType._SUPPORTS_SELECTED_ITEM);
	return this;
};
oFF.UiType.prototype.addMultiSelection = function(aggrDef)
{
	this.m_selectionAggregation = aggrDef;
	this.m_isMultiSelectionSupported = true;
	if (oFF.isNull(this.m_selectionAggregation))
	{
		this.m_selectionAggregation = oFF.UiAggregation.ITEMS;
	}
	this.addCapabilityFlag(oFF.UiType._SUPPORTS_SELECTED_ITEMS);
	return this;
};
oFF.UiType.prototype.getSelectionAggregation = function()
{
	return this.m_selectionAggregation;
};
oFF.UiType.prototype.supportsSelection = function()
{
	if (oFF.notNull(this.m_selectionAggregation))
	{
		return true;
	}
	return false;
};
oFF.UiType.prototype.supportsSingleSelection = function()
{
	if (this.supportsSelection() === false)
	{
		return false;
	}
	return !this.m_isMultiSelectionSupported;
};
oFF.UiType.prototype.supportsMultiSelection = function()
{
	if (this.supportsSelection() === false)
	{
		return false;
	}
	return this.m_isMultiSelectionSupported;
};
oFF.UiType.prototype.addReceiverBinding = function(binding, protocolBindingType)
{
	this.m_receiverBindings.add(binding);
	this.m_receiverProtocolBindings.add(protocolBindingType);
	return this;
};
oFF.UiType.prototype.addSenderBinding = function(binding, protocolBindingType)
{
	oFF.XBooleanUtils.checkFalse(this.m_senderBindings.size() > 0, "Currently only one semantic and protocol binding are supported for UiTypes");
	this.m_senderBindings.add(binding);
	this.m_senderProtocolBindings.add(protocolBindingType);
	return this;
};
oFF.UiType.prototype.getReceiverBindings = function()
{
	return this.m_receiverBindings;
};
oFF.UiType.prototype.getSenderBindings = function()
{
	return this.m_senderBindings;
};
oFF.UiType.prototype.getReceiverProtocolBindings = function(type)
{
	return this.m_receiverProtocolBindings;
};
oFF.UiType.prototype.getSenderProtocolBindings = function(type)
{
	return this.m_senderProtocolBindings;
};
oFF.UiType.prototype.getCapabilityFlags = function()
{
	return this.m_capabilityFlags;
};
oFF.UiType.prototype.hasCapabilityFlag = function(flag)
{
	if (oFF.isNull(this.m_capabilityFlags))
	{
		return false;
	}
	return this.m_capabilityFlags.contains(flag);
};
oFF.UiType.prototype.addCapabilityFlag = function(flag)
{
	if (oFF.isNull(this.m_capabilityFlags))
	{
		this.m_capabilityFlags = oFF.XHashSetOfString.create();
	}
	this.m_capabilityFlags.add(flag);
	var list = oFF.UiType.s_flagLookup.getByKey(flag);
	if (oFF.isNull(list))
	{
		list = oFF.XList.create();
		oFF.UiType.s_flagLookup.put(flag, list);
	}
	list.add(this);
	return this;
};
oFF.UiType.prototype.removeCapabilityFlag = function(flag)
{
	if (oFF.isNull(this.m_capabilityFlags))
	{
		return this;
	}
	this.m_capabilityFlags.removeElement(flag);
	var list = oFF.UiType.s_flagLookup.getByKey(flag);
	if (oFF.notNull(list))
	{
		list = oFF.UiType.s_flagLookup.getByKey(flag);
		list.removeElement(this);
	}
	return this;
};
oFF.UiType.prototype.getFirstPosition = function()
{
	return this.m_firstPosition;
};
oFF.UiType.prototype.getSecondPosition = function()
{
	return this.m_secondPosition;
};
oFF.UiType.prototype.setChildPositions = function(first, second)
{
	this.m_firstPosition = first;
	this.m_secondPosition = second;
};
oFF.UiType.prototype.getDescription = function()
{
	return this.m_description;
};
oFF.UiType.prototype.toString = function()
{
	var buffer = oFF.XStringBuffer.create().appendLine(this.getName());
	var parent = this.getParent();
	if (oFF.notNull(parent) && parent !== oFF.UiComponentType.UI_CONTROL)
	{
		buffer.append("Parent: ").appendLine(parent.getName());
	}
	var defaultItemType = this.getDefaultItemType();
	if (oFF.notNull(defaultItemType))
	{
		buffer.append("Default Item Type: ").appendLine(defaultItemType.getName());
	}
	return buffer.toString();
};
oFF.UiType.prototype.setIsFloating = function()
{
	this.setSuperType(oFF.UiType.FLOATING_CONTROL);
	this.addCapabilityFlag(oFF.UiType._SUPPORTS_OPEN_CHANGE);
	return this;
};
oFF.UiType.prototype.addSuggestions = function()
{
	this.aggregation(oFF.UiAggregation.SUGGESTIONS);
	this.method(oFF.UiMethod.SHOW_SUGGESTIONS);
	this.method(oFF.UiMethod.CLOSE_SUGGESTIONS);
	return this;
};
oFF.UiType.prototype.sortConstantsByName = function(constantsList)
{
	var tmpConstantNamesSorted = oFF.XListOfString.create();
	for (var i = 0; i < constantsList.size(); i++)
	{
		var tmpConstant = constantsList.get(i);
		tmpConstantNamesSorted.add(tmpConstant.getName());
	}
	tmpConstantNamesSorted.sortByDirection(oFF.XSortDirection.ASCENDING);
	return tmpConstantNamesSorted;
};

oFF.UiContextDummy = function() {};
oFF.UiContextDummy.prototype = new oFF.XObject();
oFF.UiContextDummy.prototype._ff_c = "UiContextDummy";

oFF.UiContextDummy.SINGLETON = null;
oFF.UiContextDummy.staticSetupMultithreading = function()
{
	oFF.UiContextDummy.getSingleton();
};
oFF.UiContextDummy.getSingleton = function()
{
	if (oFF.isNull(oFF.UiContextDummy.SINGLETON))
	{
		oFF.UiContextDummy.SINGLETON = new oFF.UiContextDummy();
	}
	return oFF.UiContextDummy.SINGLETON;
};
oFF.UiContextDummy.prototype.getUiManager = function()
{
	return null;
};
oFF.UiContextDummy.prototype.registerPropertyListener = function(listener, property, customIdentifier) {};
oFF.UiContextDummy.prototype.unregisterPropertyListener = function(listener, property) {};
oFF.UiContextDummy.prototype.setPropertyStringValue = function(property, value) {};
oFF.UiContextDummy.prototype.getComponentType = function()
{
	return null;
};
oFF.UiContextDummy.prototype.next = function()
{
	return this;
};
oFF.UiContextDummy.prototype.hasNext = function()
{
	return false;
};
oFF.UiContextDummy.prototype.setId = function(identifier)
{
	return this;
};
oFF.UiContextDummy.prototype.getId = function()
{
	return null;
};
oFF.UiContextDummy.prototype.getHeight = function()
{
	return null;
};
oFF.UiContextDummy.prototype.setHeight = function(height)
{
	return this;
};
oFF.UiContextDummy.prototype.getMargin = function()
{
	return null;
};
oFF.UiContextDummy.prototype.setMargin = function(margin)
{
	return this;
};
oFF.UiContextDummy.prototype.getBackgroundColor = function()
{
	return null;
};
oFF.UiContextDummy.prototype.setBackgroundColor = function(backgroundColor)
{
	return this;
};
oFF.UiContextDummy.prototype.getFontColor = function()
{
	return null;
};
oFF.UiContextDummy.prototype.setFontColor = function(fontColor)
{
	return this;
};
oFF.UiContextDummy.prototype.getCornerRadius = function()
{
	return null;
};
oFF.UiContextDummy.prototype.setCornerRadius = function(cornerRadius)
{
	return this;
};
oFF.UiContextDummy.prototype.setRotation = function(rotation)
{
	return this;
};
oFF.UiContextDummy.prototype.getRotation = function()
{
	return 0;
};
oFF.UiContextDummy.prototype.getBorderColor = function()
{
	return null;
};
oFF.UiContextDummy.prototype.setBorderColor = function(borderColor)
{
	return this;
};
oFF.UiContextDummy.prototype.getMinHeight = function()
{
	return null;
};
oFF.UiContextDummy.prototype.setMinHeight = function(minHeight)
{
	return this;
};
oFF.UiContextDummy.prototype.getMaxHeight = function()
{
	return null;
};
oFF.UiContextDummy.prototype.setMaxHeight = function(maxHeight)
{
	return this;
};
oFF.UiContextDummy.prototype.getMinWidth = function()
{
	return null;
};
oFF.UiContextDummy.prototype.setMinWidth = function(minWidth)
{
	return this;
};
oFF.UiContextDummy.prototype.getMaxWidth = function()
{
	return null;
};
oFF.UiContextDummy.prototype.setMaxWidth = function(maxWidth)
{
	return this;
};
oFF.UiContextDummy.prototype.getX = function()
{
	return null;
};
oFF.UiContextDummy.prototype.getY = function()
{
	return null;
};
oFF.UiContextDummy.prototype.setX = function(x)
{
	return this;
};
oFF.UiContextDummy.prototype.setY = function(y)
{
	return this;
};
oFF.UiContextDummy.prototype.setPosition = function(position)
{
	return this;
};
oFF.UiContextDummy.prototype.getPosition = function()
{
	return null;
};
oFF.UiContextDummy.prototype.getHeaderHeight = function()
{
	return null;
};
oFF.UiContextDummy.prototype.setHeaderHeight = function(headerHeight)
{
	return this;
};
oFF.UiContextDummy.prototype.getFooterHeight = function()
{
	return null;
};
oFF.UiContextDummy.prototype.setFooterHeight = function(footerHeight)
{
	return this;
};
oFF.UiContextDummy.prototype.isSelected = function()
{
	return false;
};
oFF.UiContextDummy.prototype.setSelected = function(selected)
{
	return this;
};
oFF.UiContextDummy.prototype.isBusy = function()
{
	return false;
};
oFF.UiContextDummy.prototype.setBusy = function(busy)
{
	return this;
};
oFF.UiContextDummy.prototype.isCloseable = function()
{
	return false;
};
oFF.UiContextDummy.prototype.setCloseable = function(isCloseable)
{
	return this;
};
oFF.UiContextDummy.prototype.isEditable = function()
{
	return true;
};
oFF.UiContextDummy.prototype.setEditable = function(editable)
{
	return this;
};
oFF.UiContextDummy.prototype.isChecked = function()
{
	return false;
};
oFF.UiContextDummy.prototype.setChecked = function(checked)
{
	return this;
};
oFF.UiContextDummy.prototype.isSortable = function()
{
	return false;
};
oFF.UiContextDummy.prototype.setSortable = function(sortable)
{
	return this;
};
oFF.UiContextDummy.prototype.getSortDirection = function()
{
	return null;
};
oFF.UiContextDummy.prototype.setSortDirection = function(sortOrder)
{
	return this;
};
oFF.UiContextDummy.prototype.getTooltip = function()
{
	return null;
};
oFF.UiContextDummy.prototype.setTooltip = function(tooltip)
{
	return this;
};
oFF.UiContextDummy.prototype.getDescription = function()
{
	return null;
};
oFF.UiContextDummy.prototype.setDescription = function(description)
{
	return this;
};
oFF.UiContextDummy.prototype.getLabel = function()
{
	return null;
};
oFF.UiContextDummy.prototype.setLabel = function(label)
{
	return this;
};
oFF.UiContextDummy.prototype.getValue = function()
{
	return null;
};
oFF.UiContextDummy.prototype.setValue = function(value)
{
	return this;
};
oFF.UiContextDummy.prototype.setInputType = function(inputType)
{
	return this;
};
oFF.UiContextDummy.prototype.getInputType = function()
{
	return null;
};
oFF.UiContextDummy.prototype.getSrc = function()
{
	return null;
};
oFF.UiContextDummy.prototype.setSrc = function(src)
{
	return this;
};
oFF.UiContextDummy.prototype.getBackgroundImageSrc = function()
{
	return null;
};
oFF.UiContextDummy.prototype.setBackgroundImageSrc = function(src)
{
	return this;
};
oFF.UiContextDummy.prototype.setSelectionMode = function(selectionMode)
{
	return this;
};
oFF.UiContextDummy.prototype.getSelectionMode = function()
{
	return null;
};
oFF.UiContextDummy.prototype.setSelectionBehavior = function(selectionBehavior)
{
	return this;
};
oFF.UiContextDummy.prototype.getSelectionBehavior = function()
{
	return null;
};
oFF.UiContextDummy.prototype.setListItemType = function(listItemType)
{
	return this;
};
oFF.UiContextDummy.prototype.getListItemType = function()
{
	return null;
};
oFF.UiContextDummy.prototype.hasButtons = function()
{
	return false;
};
oFF.UiContextDummy.prototype.getButtonCount = function()
{
	return 0;
};
oFF.UiContextDummy.prototype.getButton = function(index)
{
	return this;
};
oFF.UiContextDummy.prototype.getIndexOfButton = function(button)
{
	return 0;
};
oFF.UiContextDummy.prototype.getButtonByName = function(name)
{
	return this;
};
oFF.UiContextDummy.prototype.getButtons = function()
{
	return null;
};
oFF.UiContextDummy.prototype.newButton = function()
{
	return this;
};
oFF.UiContextDummy.prototype.addNewButton = function()
{
	return this;
};
oFF.UiContextDummy.prototype.addAllButtons = function(buttonList)
{
	return this;
};
oFF.UiContextDummy.prototype.addButton = function(button)
{
	return this;
};
oFF.UiContextDummy.prototype.insertButton = function(button, index)
{
	return this;
};
oFF.UiContextDummy.prototype.removeButton = function(button)
{
	return this;
};
oFF.UiContextDummy.prototype.clearButtons = function()
{
	return this;
};
oFF.UiContextDummy.prototype.hasDialogButtons = function()
{
	return false;
};
oFF.UiContextDummy.prototype.getDialogButtonCount = function()
{
	return 0;
};
oFF.UiContextDummy.prototype.getDialogButton = function(index)
{
	return this;
};
oFF.UiContextDummy.prototype.getIndexOfDialogButton = function(dialogButton)
{
	return 0;
};
oFF.UiContextDummy.prototype.getDialogButtonByName = function(name)
{
	return this;
};
oFF.UiContextDummy.prototype.getDialogButtons = function()
{
	return null;
};
oFF.UiContextDummy.prototype.newDialogButton = function()
{
	return this;
};
oFF.UiContextDummy.prototype.addNewDialogButton = function()
{
	return this;
};
oFF.UiContextDummy.prototype.addAllDialogButtons = function(dialogButtonList)
{
	return this;
};
oFF.UiContextDummy.prototype.addDialogButton = function(dialogButton)
{
	return this;
};
oFF.UiContextDummy.prototype.insertDialogButton = function(dialogButton, index)
{
	return this;
};
oFF.UiContextDummy.prototype.removeDialogButton = function(dialogButton)
{
	return this;
};
oFF.UiContextDummy.prototype.clearDialogButtons = function()
{
	return this;
};
oFF.UiContextDummy.prototype.hasPageButtons = function()
{
	return false;
};
oFF.UiContextDummy.prototype.getPageButtonCount = function()
{
	return 0;
};
oFF.UiContextDummy.prototype.getPageButton = function(index)
{
	return this;
};
oFF.UiContextDummy.prototype.getIndexOfPageButton = function(pageButton)
{
	return 0;
};
oFF.UiContextDummy.prototype.getPageButtonByName = function(name)
{
	return this;
};
oFF.UiContextDummy.prototype.getPageButtons = function()
{
	return null;
};
oFF.UiContextDummy.prototype.newPageButton = function()
{
	return this;
};
oFF.UiContextDummy.prototype.addNewPageButton = function()
{
	return this;
};
oFF.UiContextDummy.prototype.addAllPageButtons = function(pageButtonList)
{
	return this;
};
oFF.UiContextDummy.prototype.addPageButton = function(pageButton)
{
	return this;
};
oFF.UiContextDummy.prototype.insertPageButton = function(pageButton, index)
{
	return this;
};
oFF.UiContextDummy.prototype.removePageButton = function(pageButton)
{
	return this;
};
oFF.UiContextDummy.prototype.clearPageButtons = function()
{
	return this;
};
oFF.UiContextDummy.prototype.hasSuggestions = function()
{
	return false;
};
oFF.UiContextDummy.prototype.getSuggestionCount = function()
{
	return 0;
};
oFF.UiContextDummy.prototype.getSuggestion = function(index)
{
	return this;
};
oFF.UiContextDummy.prototype.getIndexOfSuggestion = function(suggestionItem)
{
	return 0;
};
oFF.UiContextDummy.prototype.getSuggestionByName = function(name)
{
	return this;
};
oFF.UiContextDummy.prototype.getSuggestions = function()
{
	return null;
};
oFF.UiContextDummy.prototype.newSuggestion = function()
{
	return this;
};
oFF.UiContextDummy.prototype.addNewSuggestion = function()
{
	return this;
};
oFF.UiContextDummy.prototype.addAllSuggestions = function(suggestionList)
{
	return this;
};
oFF.UiContextDummy.prototype.addSuggestion = function(suggestionItem)
{
	return this;
};
oFF.UiContextDummy.prototype.insertSuggestion = function(suggestionItem, index)
{
	return this;
};
oFF.UiContextDummy.prototype.removeSuggestion = function(suggestionItem)
{
	return this;
};
oFF.UiContextDummy.prototype.clearSuggestions = function()
{
	return this;
};
oFF.UiContextDummy.prototype.hasColumns = function()
{
	return false;
};
oFF.UiContextDummy.prototype.numberOfColumns = function()
{
	return 0;
};
oFF.UiContextDummy.prototype.getColumn = function(index)
{
	return this;
};
oFF.UiContextDummy.prototype.getIndexOfColumn = function(column)
{
	return 0;
};
oFF.UiContextDummy.prototype.getColumnByName = function(name)
{
	return this;
};
oFF.UiContextDummy.prototype.getColumns = function()
{
	return null;
};
oFF.UiContextDummy.prototype.newColumn = function()
{
	return this;
};
oFF.UiContextDummy.prototype.addNewColumn = function()
{
	return this;
};
oFF.UiContextDummy.prototype.addAllColumns = function(columnList)
{
	return this;
};
oFF.UiContextDummy.prototype.addColumn = function(column)
{
	return this;
};
oFF.UiContextDummy.prototype.insertColumn = function(column, index)
{
	return this;
};
oFF.UiContextDummy.prototype.removeColumn = function(column)
{
	return this;
};
oFF.UiContextDummy.prototype.clearColumns = function()
{
	return this;
};
oFF.UiContextDummy.prototype.hasRows = function()
{
	return false;
};
oFF.UiContextDummy.prototype.numberOfRows = function()
{
	return 0;
};
oFF.UiContextDummy.prototype.getRow = function(index)
{
	return this;
};
oFF.UiContextDummy.prototype.getIndexOfRow = function(row)
{
	return 0;
};
oFF.UiContextDummy.prototype.getRowByName = function(name)
{
	return this;
};
oFF.UiContextDummy.prototype.getRows = function()
{
	return null;
};
oFF.UiContextDummy.prototype.newRow = function()
{
	return this;
};
oFF.UiContextDummy.prototype.addNewRow = function()
{
	return this;
};
oFF.UiContextDummy.prototype.addAllRows = function(rowList)
{
	return this;
};
oFF.UiContextDummy.prototype.addRow = function(row)
{
	return this;
};
oFF.UiContextDummy.prototype.insertRow = function(row, index)
{
	return this;
};
oFF.UiContextDummy.prototype.removeRow = function(row)
{
	return this;
};
oFF.UiContextDummy.prototype.clearRows = function()
{
	return this;
};
oFF.UiContextDummy.prototype.hasCells = function()
{
	return false;
};
oFF.UiContextDummy.prototype.numberOfCells = function()
{
	return 0;
};
oFF.UiContextDummy.prototype.getCell = function(index)
{
	return this;
};
oFF.UiContextDummy.prototype.getIndexOfCell = function(cell)
{
	return 0;
};
oFF.UiContextDummy.prototype.getCellByName = function(name)
{
	return this;
};
oFF.UiContextDummy.prototype.getCells = function()
{
	return null;
};
oFF.UiContextDummy.prototype.newCell = function()
{
	return this;
};
oFF.UiContextDummy.prototype.addNewCell = function()
{
	return this;
};
oFF.UiContextDummy.prototype.addAllCells = function(cellList)
{
	return this;
};
oFF.UiContextDummy.prototype.addCell = function(cell)
{
	return this;
};
oFF.UiContextDummy.prototype.insertCell = function(cell, index)
{
	return this;
};
oFF.UiContextDummy.prototype.removeCell = function(cell)
{
	return this;
};
oFF.UiContextDummy.prototype.clearCells = function()
{
	return this;
};
oFF.UiContextDummy.prototype.hasEndIcons = function()
{
	return false;
};
oFF.UiContextDummy.prototype.getEndIconCount = function()
{
	return 0;
};
oFF.UiContextDummy.prototype.getEndIcon = function(index)
{
	return this;
};
oFF.UiContextDummy.prototype.getIndexOfEndIcon = function(endIcon)
{
	return 0;
};
oFF.UiContextDummy.prototype.getEndIconByName = function(name)
{
	return this;
};
oFF.UiContextDummy.prototype.getEndIcons = function()
{
	return null;
};
oFF.UiContextDummy.prototype.newEndIcon = function()
{
	return this;
};
oFF.UiContextDummy.prototype.addNewEndIcon = function()
{
	return this;
};
oFF.UiContextDummy.prototype.addAllEndIcons = function(endIconList)
{
	return this;
};
oFF.UiContextDummy.prototype.addEndIcon = function(endIcon)
{
	return this;
};
oFF.UiContextDummy.prototype.insertEndIcon = function(endIcon, index)
{
	return this;
};
oFF.UiContextDummy.prototype.removeEndIcon = function(endIcon)
{
	return this;
};
oFF.UiContextDummy.prototype.clearEndIcons = function()
{
	return this;
};
oFF.UiContextDummy.prototype.hasTreeTableRows = function()
{
	return false;
};
oFF.UiContextDummy.prototype.numberOfTreeTableRows = function()
{
	return 0;
};
oFF.UiContextDummy.prototype.getTreeTableRow = function(index)
{
	return this;
};
oFF.UiContextDummy.prototype.getIndexOfTreeTableRow = function(treeTableRow)
{
	return 0;
};
oFF.UiContextDummy.prototype.getTreeTableRowByName = function(name)
{
	return this;
};
oFF.UiContextDummy.prototype.getTreeTableRows = function()
{
	return null;
};
oFF.UiContextDummy.prototype.getOnlyChildTreeTableRows = function()
{
	return null;
};
oFF.UiContextDummy.prototype.newTreeTableRow = function()
{
	return this;
};
oFF.UiContextDummy.prototype.addNewTreeTableRow = function()
{
	return this;
};
oFF.UiContextDummy.prototype.addAllTreeTableRows = function(treeTableRowList)
{
	return this;
};
oFF.UiContextDummy.prototype.addTreeTableRow = function(treeTableRow)
{
	return this;
};
oFF.UiContextDummy.prototype.insertTreeTableRow = function(treeTableRow, index)
{
	return this;
};
oFF.UiContextDummy.prototype.removeTreeTableRow = function(treeTableRow)
{
	return this;
};
oFF.UiContextDummy.prototype.clearTreeTableRows = function()
{
	return this;
};
oFF.UiContextDummy.prototype.hasItems = function()
{
	return false;
};
oFF.UiContextDummy.prototype.getItemCount = function()
{
	return 0;
};
oFF.UiContextDummy.prototype.getItem = function(index)
{
	return this;
};
oFF.UiContextDummy.prototype.getIndexOfItem = function(item)
{
	return 0;
};
oFF.UiContextDummy.prototype.getItemByName = function(name)
{
	return this;
};
oFF.UiContextDummy.prototype.getItemById = function(itemId)
{
	return this;
};
oFF.UiContextDummy.prototype.getItems = function()
{
	return null;
};
oFF.UiContextDummy.prototype.newItemOfType = function(itemType)
{
	return this;
};
oFF.UiContextDummy.prototype.addNewItemOfType = function(itemType)
{
	return this;
};
oFF.UiContextDummy.prototype.insertNewItemOfType = function(itemType, index)
{
	return this;
};
oFF.UiContextDummy.prototype.addAllItems = function(itemList)
{
	return this;
};
oFF.UiContextDummy.prototype.addItem = function(item)
{
	return this;
};
oFF.UiContextDummy.prototype.insertItem = function(item, index)
{
	return this;
};
oFF.UiContextDummy.prototype.removeItem = function(item)
{
	return this;
};
oFF.UiContextDummy.prototype.clearItems = function()
{
	return this;
};
oFF.UiContextDummy.prototype.hasRadioButtons = function()
{
	return false;
};
oFF.UiContextDummy.prototype.getRadioButtonCount = function()
{
	return 0;
};
oFF.UiContextDummy.prototype.getRadioButton = function(index)
{
	return this;
};
oFF.UiContextDummy.prototype.getIndexOfRadioButton = function(radioButton)
{
	return 0;
};
oFF.UiContextDummy.prototype.getRadioButtonByName = function(name)
{
	return this;
};
oFF.UiContextDummy.prototype.getRadioButtons = function()
{
	return null;
};
oFF.UiContextDummy.prototype.newRadioButton = function()
{
	return this;
};
oFF.UiContextDummy.prototype.addNewRadioButton = function()
{
	return this;
};
oFF.UiContextDummy.prototype.addAllRadioButtons = function(radioButtonList)
{
	return this;
};
oFF.UiContextDummy.prototype.addRadioButton = function(radioButton)
{
	return this;
};
oFF.UiContextDummy.prototype.insertRadioButton = function(radioButton, index)
{
	return this;
};
oFF.UiContextDummy.prototype.removeRadioButton = function(radioButton)
{
	return this;
};
oFF.UiContextDummy.prototype.clearRadioButtons = function()
{
	return this;
};
oFF.UiContextDummy.prototype.hasMatrixLayoutCells = function()
{
	return false;
};
oFF.UiContextDummy.prototype.getMatrixLayoutCellCount = function()
{
	return 0;
};
oFF.UiContextDummy.prototype.getMatrixLayoutCell = function(index)
{
	return this;
};
oFF.UiContextDummy.prototype.getIndexOfMatrixLayoutCell = function(matrixLayoutCell)
{
	return 0;
};
oFF.UiContextDummy.prototype.getMatrixLayoutCellByName = function(name)
{
	return this;
};
oFF.UiContextDummy.prototype.getMatrixLayoutCells = function()
{
	return null;
};
oFF.UiContextDummy.prototype.newMatrixLayoutCell = function()
{
	return this;
};
oFF.UiContextDummy.prototype.addNewMatrixLayoutCell = function()
{
	return this;
};
oFF.UiContextDummy.prototype.addAllMatrixLayoutCells = function(matrixLayoutCellList)
{
	return this;
};
oFF.UiContextDummy.prototype.addMatrixLayoutCell = function(matrixLayoutCell)
{
	return this;
};
oFF.UiContextDummy.prototype.insertMatrixLayoutCell = function(matrixLayoutCell, index)
{
	return this;
};
oFF.UiContextDummy.prototype.removeMatrixLayoutCell = function(matrixLayoutCell)
{
	return this;
};
oFF.UiContextDummy.prototype.clearMatrixLayoutCells = function()
{
	return this;
};
oFF.UiContextDummy.prototype.hasMatrixLayoutRows = function()
{
	return false;
};
oFF.UiContextDummy.prototype.getMatrixLayoutRowCount = function()
{
	return 0;
};
oFF.UiContextDummy.prototype.getMatrixLayoutRow = function(index)
{
	return this;
};
oFF.UiContextDummy.prototype.getIndexOfMatrixLayoutRow = function(matrixLayoutRow)
{
	return 0;
};
oFF.UiContextDummy.prototype.getMatrixLayoutRowByName = function(name)
{
	return this;
};
oFF.UiContextDummy.prototype.getMatrixLayoutRows = function()
{
	return null;
};
oFF.UiContextDummy.prototype.newMatrixLayoutRow = function()
{
	return this;
};
oFF.UiContextDummy.prototype.addNewMatrixLayoutRow = function()
{
	return this;
};
oFF.UiContextDummy.prototype.addAllMatrixLayoutRows = function(matrixLayoutRowList)
{
	return this;
};
oFF.UiContextDummy.prototype.addMatrixLayoutRow = function(matrixLayoutRow)
{
	return this;
};
oFF.UiContextDummy.prototype.insertMatrixLayoutRow = function(matrixLayoutRow, index)
{
	return this;
};
oFF.UiContextDummy.prototype.removeMatrixLayoutRow = function(matrixLayoutRow)
{
	return this;
};
oFF.UiContextDummy.prototype.clearMatrixLayoutRows = function()
{
	return this;
};
oFF.UiContextDummy.prototype.hasResponsiveTableColumns = function()
{
	return false;
};
oFF.UiContextDummy.prototype.numberOfResponsiveTableColumns = function()
{
	return 0;
};
oFF.UiContextDummy.prototype.getResponsiveTableColumn = function(index)
{
	return this;
};
oFF.UiContextDummy.prototype.getIndexOfResponsiveTableColumn = function(column)
{
	return 0;
};
oFF.UiContextDummy.prototype.getResponsiveTableColumnByName = function(name)
{
	return this;
};
oFF.UiContextDummy.prototype.getResponsiveTableColumns = function()
{
	return null;
};
oFF.UiContextDummy.prototype.newResponsiveTableColumn = function()
{
	return this;
};
oFF.UiContextDummy.prototype.addNewResponsiveTableColumn = function()
{
	return this;
};
oFF.UiContextDummy.prototype.addAllResponsiveTableColumns = function(columnList)
{
	return this;
};
oFF.UiContextDummy.prototype.addResponsiveTableColumn = function(column)
{
	return this;
};
oFF.UiContextDummy.prototype.insertResponsiveTableColumn = function(column, index)
{
	return this;
};
oFF.UiContextDummy.prototype.removeResponsiveTableColumn = function(column)
{
	return this;
};
oFF.UiContextDummy.prototype.clearResponsiveTableColumns = function()
{
	return this;
};
oFF.UiContextDummy.prototype.hasResponsiveTableRows = function()
{
	return false;
};
oFF.UiContextDummy.prototype.numberOfResponsiveTableRows = function()
{
	return 0;
};
oFF.UiContextDummy.prototype.getResponsiveTableRow = function(index)
{
	return this;
};
oFF.UiContextDummy.prototype.getIndexOfResponsiveTableRow = function(row)
{
	return 0;
};
oFF.UiContextDummy.prototype.getResponsiveTableRowByName = function(name)
{
	return this;
};
oFF.UiContextDummy.prototype.getResponsiveTableRows = function()
{
	return null;
};
oFF.UiContextDummy.prototype.newResponsiveTableRow = function()
{
	return this;
};
oFF.UiContextDummy.prototype.addNewResponsiveTableRow = function()
{
	return this;
};
oFF.UiContextDummy.prototype.addAllResponsiveTableRows = function(rowList)
{
	return this;
};
oFF.UiContextDummy.prototype.addResponsiveTableRow = function(row)
{
	return this;
};
oFF.UiContextDummy.prototype.insertResponsiveTableRow = function(row, index)
{
	return this;
};
oFF.UiContextDummy.prototype.removeResponsiveTableRow = function(row)
{
	return this;
};
oFF.UiContextDummy.prototype.clearResponsiveTableRows = function()
{
	return this;
};
oFF.UiContextDummy.prototype.hasResponsiveTableCells = function()
{
	return false;
};
oFF.UiContextDummy.prototype.numberOfResponsiveTableCells = function()
{
	return 0;
};
oFF.UiContextDummy.prototype.getResponsiveTableCell = function(index)
{
	return this;
};
oFF.UiContextDummy.prototype.getIndexOfResponsiveTableCell = function(cell)
{
	return 0;
};
oFF.UiContextDummy.prototype.getResponsiveTableCellByName = function(name)
{
	return this;
};
oFF.UiContextDummy.prototype.getResponsiveTableCells = function()
{
	return null;
};
oFF.UiContextDummy.prototype.newResponsiveTableCell = function()
{
	return this;
};
oFF.UiContextDummy.prototype.addNewResponsiveTableCell = function()
{
	return this;
};
oFF.UiContextDummy.prototype.addAllResponsiveTableCells = function(cellList)
{
	return this;
};
oFF.UiContextDummy.prototype.addResponsiveTableCell = function(cell)
{
	return this;
};
oFF.UiContextDummy.prototype.insertResponsiveTableCell = function(cell, index)
{
	return this;
};
oFF.UiContextDummy.prototype.removeResponsiveTableCell = function(cell)
{
	return this;
};
oFF.UiContextDummy.prototype.clearResponsiveTableCells = function()
{
	return this;
};
oFF.UiContextDummy.prototype.hasPages = function()
{
	return false;
};
oFF.UiContextDummy.prototype.getPagesCount = function()
{
	return 0;
};
oFF.UiContextDummy.prototype.getPage = function(index)
{
	return this;
};
oFF.UiContextDummy.prototype.getIndexOfPage = function(page)
{
	return 0;
};
oFF.UiContextDummy.prototype.getPageByName = function(name)
{
	return this;
};
oFF.UiContextDummy.prototype.getPages = function()
{
	return null;
};
oFF.UiContextDummy.prototype.newPage = function()
{
	return this;
};
oFF.UiContextDummy.prototype.pushNewPage = function()
{
	return this;
};
oFF.UiContextDummy.prototype.getCurrentPage = function()
{
	return this;
};
oFF.UiContextDummy.prototype.pushPage = function(page)
{
	return this;
};
oFF.UiContextDummy.prototype.popPage = function()
{
	return this;
};
oFF.UiContextDummy.prototype.clearPages = function()
{
	return this;
};
oFF.UiContextDummy.prototype.isExpanded = function()
{
	return false;
};
oFF.UiContextDummy.prototype.setExpanded = function(isExpanded)
{
	return this;
};
oFF.UiContextDummy.prototype.expand = function()
{
	return this;
};
oFF.UiContextDummy.prototype.collapse = function()
{
	return this;
};
oFF.UiContextDummy.prototype.setNode = function(isNode)
{
	return this;
};
oFF.UiContextDummy.prototype.isNode = function()
{
	return false;
};
oFF.UiContextDummy.prototype.setRowCount = function(rowCount)
{
	return this;
};
oFF.UiContextDummy.prototype.getRowCount = function()
{
	return 0;
};
oFF.UiContextDummy.prototype.setColumnCount = function(columnCount)
{
	return this;
};
oFF.UiContextDummy.prototype.getColumnCount = function()
{
	return 0;
};
oFF.UiContextDummy.prototype.setRowIndex = function(index)
{
	return this;
};
oFF.UiContextDummy.prototype.getRowIndex = function()
{
	return 0;
};
oFF.UiContextDummy.prototype.setColumnIndex = function(index)
{
	return this;
};
oFF.UiContextDummy.prototype.getColumnIndex = function()
{
	return 0;
};
oFF.UiContextDummy.prototype.getActiveIndex = function()
{
	return 0;
};
oFF.UiContextDummy.prototype.setActiveIndex = function(index)
{
	return this;
};
oFF.UiContextDummy.prototype.setColumnSpan = function(span)
{
	return this;
};
oFF.UiContextDummy.prototype.getColumnSpan = function()
{
	return 0;
};
oFF.UiContextDummy.prototype.setRowSpan = function(span)
{
	return this;
};
oFF.UiContextDummy.prototype.getRowSpan = function()
{
	return 0;
};
oFF.UiContextDummy.prototype.setSemanticCellStyle = function(semanticCellStyle)
{
	return this;
};
oFF.UiContextDummy.prototype.getSemanticCellStyle = function()
{
	return null;
};
oFF.UiContextDummy.prototype.setTextDecoration = function(textDecoration)
{
	return this;
};
oFF.UiContextDummy.prototype.getTextDecoration = function()
{
	return null;
};
oFF.UiContextDummy.prototype.setSectionStart = function(sectionStart)
{
	return this;
};
oFF.UiContextDummy.prototype.isSectionStart = function()
{
	return false;
};
oFF.UiContextDummy.prototype.getDataManifest = function()
{
	return null;
};
oFF.UiContextDummy.prototype.setDataManifest = function(dataManifest) {};
oFF.UiContextDummy.prototype.isEnabled = function()
{
	return false;
};
oFF.UiContextDummy.prototype.setEnabled = function(enabled)
{
	return this;
};
oFF.UiContextDummy.prototype.isVisible = function()
{
	return false;
};
oFF.UiContextDummy.prototype.setVisible = function(visible)
{
	return this;
};
oFF.UiContextDummy.prototype.registerOnClick = function(listener)
{
	return this;
};
oFF.UiContextDummy.prototype.registerOnContextMenu = function(listener)
{
	return this;
};
oFF.UiContextDummy.prototype.registerOnDoubleClick = function(listener)
{
	return this;
};
oFF.UiContextDummy.prototype.registerOnPress = function(listener)
{
	return this;
};
oFF.UiContextDummy.prototype.registerOnChange = function(listener)
{
	return this;
};
oFF.UiContextDummy.prototype.registerOnLiveChange = function(listener)
{
	return this;
};
oFF.UiContextDummy.prototype.registerOnEnter = function(listener)
{
	return this;
};
oFF.UiContextDummy.prototype.registerOnSelect = function(listener)
{
	return this;
};
oFF.UiContextDummy.prototype.registerOnSelectionChange = function(listener)
{
	return this;
};
oFF.UiContextDummy.prototype.registerOnOpen = function(listener)
{
	return this;
};
oFF.UiContextDummy.prototype.registerOnClose = function(listener)
{
	return this;
};
oFF.UiContextDummy.prototype.registerOnEditingBegin = function(listener)
{
	return this;
};
oFF.UiContextDummy.prototype.registerOnEditingEnd = function(listener)
{
	return this;
};
oFF.UiContextDummy.prototype.registerOnBack = function(listener)
{
	return this;
};
oFF.UiContextDummy.prototype.registerOnExpand = function(listener)
{
	return this;
};
oFF.UiContextDummy.prototype.registerOnCollapse = function(listener)
{
	return this;
};
oFF.UiContextDummy.prototype.registerOnBeforeOpen = function(listener)
{
	return this;
};
oFF.UiContextDummy.prototype.registerOnBeforeClose = function(listener)
{
	return this;
};
oFF.UiContextDummy.prototype.registerOnAfterOpen = function(listener)
{
	return this;
};
oFF.UiContextDummy.prototype.registerOnAfterClose = function(listener)
{
	return this;
};
oFF.UiContextDummy.prototype.registerOnRefresh = function(listener)
{
	return this;
};
oFF.UiContextDummy.prototype.registerOnLoadFinished = function(listener)
{
	return this;
};
oFF.UiContextDummy.prototype.registerOnDelete = function(listener)
{
	return this;
};
oFF.UiContextDummy.prototype.registerOnDetailPress = function(listener)
{
	return this;
};
oFF.UiContextDummy.prototype.registerOnMove = function(listener)
{
	return this;
};
oFF.UiContextDummy.prototype.registerOnMoveStart = function(listener)
{
	return this;
};
oFF.UiContextDummy.prototype.registerOnMoveEnd = function(listener)
{
	return this;
};
oFF.UiContextDummy.prototype.registerOnResize = function(listener)
{
	return this;
};
oFF.UiContextDummy.prototype.registerOnSuggestionSelect = function(listener)
{
	return this;
};
oFF.UiContextDummy.prototype.registerOnScroll = function(listener)
{
	return this;
};
oFF.UiContextDummy.prototype.registerOnScrollLoad = function(listener)
{
	return this;
};
oFF.UiContextDummy.prototype.registerOnHover = function(listener)
{
	return this;
};
oFF.UiContextDummy.prototype.registerOnHoverEnd = function(listener)
{
	return this;
};
oFF.UiContextDummy.prototype.registerOnPaste = function(listener)
{
	return this;
};
oFF.UiContextDummy.prototype.registerOnSelectionFinish = function(listener)
{
	return this;
};
oFF.UiContextDummy.prototype.registerOnSearch = function(listener)
{
	return this;
};
oFF.UiContextDummy.prototype.registerOnButtonPress = function(listener)
{
	return this;
};
oFF.UiContextDummy.prototype.registerOnError = function(listener)
{
	return this;
};
oFF.UiContextDummy.prototype.registerOnReadLineFinished = function(listener)
{
	return this;
};
oFF.UiContextDummy.prototype.registerOnExecute = function(listener)
{
	return this;
};
oFF.UiContextDummy.prototype.registerOnTerminate = function(listener)
{
	return this;
};
oFF.UiContextDummy.prototype.registerOnFileDrop = function(listener)
{
	return this;
};
oFF.UiContextDummy.prototype.registerOnDrop = function(listener)
{
	return this;
};
oFF.UiContextDummy.prototype.registerOnItemClose = function(listener)
{
	return this;
};
oFF.UiContextDummy.prototype.registerOnItemSelect = function(listener)
{
	return this;
};
oFF.UiContextDummy.prototype.registerOnTableDragAndDrop = function(listener)
{
	return this;
};
oFF.UiContextDummy.prototype.setName = function(name)
{
	return this;
};
oFF.UiContextDummy.prototype.getName = function()
{
	return null;
};
oFF.UiContextDummy.prototype.getCustomObject = function()
{
	return null;
};
oFF.UiContextDummy.prototype.setCustomObject = function(customObject)
{
	return this;
};
oFF.UiContextDummy.prototype.setText = function(text)
{
	return this;
};
oFF.UiContextDummy.prototype.getText = function()
{
	return null;
};
oFF.UiContextDummy.prototype.getIcon = function()
{
	return null;
};
oFF.UiContextDummy.prototype.setIcon = function(icon)
{
	return this;
};
oFF.UiContextDummy.prototype.setButtonType = function(buttonType)
{
	return this;
};
oFF.UiContextDummy.prototype.getButtonType = function()
{
	return null;
};
oFF.UiContextDummy.prototype.setSize = function(size)
{
	return this;
};
oFF.UiContextDummy.prototype.getSize = function()
{
	return null;
};
oFF.UiContextDummy.prototype.useMaxHeight = function()
{
	return this;
};
oFF.UiContextDummy.prototype.useMaxWidth = function()
{
	return this;
};
oFF.UiContextDummy.prototype.useMaxSpace = function()
{
	return this;
};
oFF.UiContextDummy.prototype.getUiType = function()
{
	return null;
};
oFF.UiContextDummy.prototype.getUiStyleClass = function()
{
	return null;
};
oFF.UiContextDummy.prototype.setParent = function(parent)
{
	return this;
};
oFF.UiContextDummy.prototype.addNewItemAt = function(firstIndex, secondIndex)
{
	return this;
};
oFF.UiContextDummy.prototype.setNewItemAt = function(firstIndex, secondIndex)
{
	return this;
};
oFF.UiContextDummy.prototype.setNewItemAtExt = function(firstIndex, secondIndex)
{
	return this;
};
oFF.UiContextDummy.prototype.clearContent = function() {};
oFF.UiContextDummy.prototype.isEmpty = function()
{
	return false;
};
oFF.UiContextDummy.prototype.hasElements = function()
{
	return false;
};
oFF.UiContextDummy.prototype.size = function()
{
	return 0;
};
oFF.UiContextDummy.prototype.getParent = function()
{
	return this;
};
oFF.UiContextDummy.prototype.getContent = function()
{
	return this;
};
oFF.UiContextDummy.prototype.setContent = function(content)
{
	return this;
};
oFF.UiContextDummy.prototype.setNewContent = function(uiType)
{
	return this;
};
oFF.UiContextDummy.prototype.setNew = function(uiType, position)
{
	return this;
};
oFF.UiContextDummy.prototype.add = function(element) {};
oFF.UiContextDummy.prototype.addAll = function(other) {};
oFF.UiContextDummy.prototype.removeElement = function(element)
{
	return element;
};
oFF.UiContextDummy.prototype.insert = function(index, element) {};
oFF.UiContextDummy.prototype.set = function(index, element) {};
oFF.UiContextDummy.prototype.insertNew = function(uiType, index)
{
	return this;
};
oFF.UiContextDummy.prototype.addNew = function(uiType)
{
	return this;
};
oFF.UiContextDummy.prototype.clearChildItems = function() {};
oFF.UiContextDummy.prototype.removeAt = function(index)
{
	return this;
};
oFF.UiContextDummy.prototype.get = function(index)
{
	return this;
};
oFF.UiContextDummy.prototype.getChildItemByName = function(name)
{
	return this;
};
oFF.UiContextDummy.prototype.getChildItemById = function(itemId)
{
	return this;
};
oFF.UiContextDummy.prototype.getChildItemByNameRecursive = function(name)
{
	return this;
};
oFF.UiContextDummy.prototype.getIndex = function(element)
{
	return 0;
};
oFF.UiContextDummy.prototype.getChildItems = function()
{
	return null;
};
oFF.UiContextDummy.prototype.getDefaultItemType = function()
{
	return null;
};
oFF.UiContextDummy.prototype.insertNewItem = function(index)
{
	return this;
};
oFF.UiContextDummy.prototype.addNewItem = function()
{
	return this;
};
oFF.UiContextDummy.prototype.newControl = function(uiType)
{
	return this;
};
oFF.UiContextDummy.prototype.newControlExt = function(uiType, styleClass, identifier, name, parent, operation, position, firstIndex, secondIndex)
{
	return this;
};
oFF.UiContextDummy.prototype.newBasicControl = function(uiType, styleClass, identifier, name)
{
	return this;
};
oFF.UiContextDummy.prototype.getSliderMinimum = function()
{
	return 0;
};
oFF.UiContextDummy.prototype.setSliderMinimum = function(minimum)
{
	return this;
};
oFF.UiContextDummy.prototype.getSliderMaximum = function()
{
	return 0;
};
oFF.UiContextDummy.prototype.setSliderMaximum = function(maximum)
{
	return this;
};
oFF.UiContextDummy.prototype.getSliderValue = function()
{
	return 0;
};
oFF.UiContextDummy.prototype.setSliderValue = function(value)
{
	return this;
};
oFF.UiContextDummy.prototype.getSliderUpperValue = function()
{
	return 0;
};
oFF.UiContextDummy.prototype.setSliderUpperValue = function(value)
{
	return this;
};
oFF.UiContextDummy.prototype.getSliderStep = function()
{
	return 1;
};
oFF.UiContextDummy.prototype.setSliderStep = function(step)
{
	return this;
};
oFF.UiContextDummy.prototype.getModelJson = function()
{
	return null;
};
oFF.UiContextDummy.prototype.setModelJson = function(model)
{
	return this;
};
oFF.UiContextDummy.prototype.getChartType = function()
{
	return null;
};
oFF.UiContextDummy.prototype.setChartType = function(chartType)
{
	return this;
};
oFF.UiContextDummy.prototype.getTitle = function()
{
	return null;
};
oFF.UiContextDummy.prototype.setTitle = function(title)
{
	return this;
};
oFF.UiContextDummy.prototype.getSubtitle = function()
{
	return null;
};
oFF.UiContextDummy.prototype.setSubtitle = function(subtitle)
{
	return this;
};
oFF.UiContextDummy.prototype.getPlaceholder = function()
{
	return null;
};
oFF.UiContextDummy.prototype.setPlaceholder = function(placeholder)
{
	return this;
};
oFF.UiContextDummy.prototype.isRequired = function()
{
	return false;
};
oFF.UiContextDummy.prototype.setRequired = function(required)
{
	return this;
};
oFF.UiContextDummy.prototype.isResizable = function()
{
	return false;
};
oFF.UiContextDummy.prototype.setResizable = function(resizable)
{
	return this;
};
oFF.UiContextDummy.prototype.getBorderStyle = function()
{
	return null;
};
oFF.UiContextDummy.prototype.setBorderStyle = function(borderStyle)
{
	return this;
};
oFF.UiContextDummy.prototype.setState = function(state)
{
	return this;
};
oFF.UiContextDummy.prototype.getState = function()
{
	return null;
};
oFF.UiContextDummy.prototype.getAnimationDuration = function()
{
	return 0;
};
oFF.UiContextDummy.prototype.setAnimationDuration = function(animationDuration)
{
	return this;
};
oFF.UiContextDummy.prototype.getMaxDate = function()
{
	return null;
};
oFF.UiContextDummy.prototype.setMaxDate = function(maxDate)
{
	return this;
};
oFF.UiContextDummy.prototype.getMinDate = function()
{
	return null;
};
oFF.UiContextDummy.prototype.setMinDate = function(minDate)
{
	return this;
};
oFF.UiContextDummy.prototype.getDisplayFormat = function()
{
	return null;
};
oFF.UiContextDummy.prototype.setDisplayFormat = function(displayFormat)
{
	return this;
};
oFF.UiContextDummy.prototype.getValueFormat = function()
{
	return null;
};
oFF.UiContextDummy.prototype.setValueFormat = function(valueFormat)
{
	return this;
};
oFF.UiContextDummy.prototype.getMinutesInterval = function()
{
	return 1;
};
oFF.UiContextDummy.prototype.setMinutesInterval = function(minInterval)
{
	return this;
};
oFF.UiContextDummy.prototype.getSecondsInterval = function()
{
	return 1;
};
oFF.UiContextDummy.prototype.setSecondsInterval = function(secInterval)
{
	return this;
};
oFF.UiContextDummy.prototype.getMaxLength = function()
{
	return 0;
};
oFF.UiContextDummy.prototype.setMaxLength = function(maxLength)
{
	return this;
};
oFF.UiContextDummy.prototype.setTextAlign = function(textAlign)
{
	return this;
};
oFF.UiContextDummy.prototype.getTextAlign = function()
{
	return null;
};
oFF.UiContextDummy.prototype.setFontStyle = function(fontStyle)
{
	return this;
};
oFF.UiContextDummy.prototype.getFontStyle = function()
{
	return null;
};
oFF.UiContextDummy.prototype.setFontWeight = function(fontWeight)
{
	return this;
};
oFF.UiContextDummy.prototype.getFontWeight = function()
{
	return null;
};
oFF.UiContextDummy.prototype.getPath = function()
{
	return null;
};
oFF.UiContextDummy.prototype.setPath = function(path)
{
	return this;
};
oFF.UiContextDummy.prototype.getCounter = function()
{
	return 0;
};
oFF.UiContextDummy.prototype.setCounter = function(counter)
{
	return this;
};
oFF.UiContextDummy.prototype.isOpen = function()
{
	return false;
};
oFF.UiContextDummy.prototype.isMaximized = function()
{
	return false;
};
oFF.UiContextDummy.prototype.isHidden = function()
{
	return false;
};
oFF.UiContextDummy.prototype.setHighlight = function(messageType)
{
	return this;
};
oFF.UiContextDummy.prototype.getHighlight = function()
{
	return null;
};
oFF.UiContextDummy.prototype.setMessageType = function(messageType)
{
	return this;
};
oFF.UiContextDummy.prototype.getMessageType = function()
{
	return null;
};
oFF.UiContextDummy.prototype.setCommandHistory = function(commands)
{
	return this;
};
oFF.UiContextDummy.prototype.getCommandHistory = function()
{
	return null;
};
oFF.UiContextDummy.prototype.getLastCommandFromHistory = function()
{
	return null;
};
oFF.UiContextDummy.prototype.addCommandToHistory = function(command)
{
	return this;
};
oFF.UiContextDummy.prototype.clearCommandHistory = function()
{
	return this;
};
oFF.UiContextDummy.prototype.getVisibleRowCount = function()
{
	return 10;
};
oFF.UiContextDummy.prototype.setVisibleRowCount = function(visibleRowCount)
{
	return this;
};
oFF.UiContextDummy.prototype.setVisibleRowCountMode = function(visibleRowCountMode)
{
	return this;
};
oFF.UiContextDummy.prototype.getVisibleRowCountMode = function()
{
	return null;
};
oFF.UiContextDummy.prototype.getMinRowCount = function()
{
	return 5;
};
oFF.UiContextDummy.prototype.setMinRowCount = function(minRowCount)
{
	return this;
};
oFF.UiContextDummy.prototype.getFirstVisibleRow = function()
{
	return null;
};
oFF.UiContextDummy.prototype.setFirstVisibleRow = function(firstVisibleRow)
{
	return this;
};
oFF.UiContextDummy.prototype.getDebounceTime = function()
{
	return 0;
};
oFF.UiContextDummy.prototype.setDebounceTime = function(debounceTime)
{
	return this;
};
oFF.UiContextDummy.prototype.setDirection = function(direction)
{
	return this;
};
oFF.UiContextDummy.prototype.getDirection = function()
{
	return null;
};
oFF.UiContextDummy.prototype.setAlignItems = function(alignItems)
{
	return this;
};
oFF.UiContextDummy.prototype.getAlignItems = function()
{
	return null;
};
oFF.UiContextDummy.prototype.setAlignContent = function(alignContent)
{
	return this;
};
oFF.UiContextDummy.prototype.getAlignContent = function()
{
	return null;
};
oFF.UiContextDummy.prototype.setJustifyContent = function(justifyContent)
{
	return this;
};
oFF.UiContextDummy.prototype.getJustifyContent = function()
{
	return null;
};
oFF.UiContextDummy.prototype.setWrap = function(wrap)
{
	return this;
};
oFF.UiContextDummy.prototype.getWrap = function()
{
	return null;
};
oFF.UiContextDummy.prototype.setFlex = function(flex)
{
	return this;
};
oFF.UiContextDummy.prototype.getFlex = function()
{
	return null;
};
oFF.UiContextDummy.prototype.setAlignSelf = function(alignSelf)
{
	return this;
};
oFF.UiContextDummy.prototype.getAlignSelf = function()
{
	return null;
};
oFF.UiContextDummy.prototype.setOrder = function(order)
{
	return this;
};
oFF.UiContextDummy.prototype.getOrder = function()
{
	return 0;
};
oFF.UiContextDummy.prototype.setEnableSelectAll = function(enableSelectAll)
{
	return null;
};
oFF.UiContextDummy.prototype.isEnableSelectAll = function()
{
	return true;
};
oFF.UiContextDummy.prototype.getFooter = function()
{
	return this;
};
oFF.UiContextDummy.prototype.setFooter = function(footer)
{
	return this;
};
oFF.UiContextDummy.prototype.setNewFooter = function(uiType)
{
	return this;
};
oFF.UiContextDummy.prototype.clearFooter = function()
{
	return this;
};
oFF.UiContextDummy.prototype.isWrapping = function()
{
	return false;
};
oFF.UiContextDummy.prototype.setWrapping = function(wrapping)
{
	return this;
};
oFF.UiContextDummy.prototype.setValueState = function(valueState)
{
	return this;
};
oFF.UiContextDummy.prototype.getValueState = function()
{
	return null;
};
oFF.UiContextDummy.prototype.getValueStateText = function()
{
	return null;
};
oFF.UiContextDummy.prototype.setValueStateText = function(valueStateText)
{
	return this;
};
oFF.UiContextDummy.prototype.setPlacement = function(placementType)
{
	return this;
};
oFF.UiContextDummy.prototype.getPlacement = function()
{
	return null;
};
oFF.UiContextDummy.prototype.isShowNavButton = function()
{
	return true;
};
oFF.UiContextDummy.prototype.setShowNavButton = function(showNavButton)
{
	return this;
};
oFF.UiContextDummy.prototype.isShowHeader = function()
{
	return true;
};
oFF.UiContextDummy.prototype.setShowHeader = function(showHeader)
{
	return this;
};
oFF.UiContextDummy.prototype.getSubHeader = function()
{
	return this;
};
oFF.UiContextDummy.prototype.setSubHeader = function(subHeader)
{
	return this;
};
oFF.UiContextDummy.prototype.setNewSubHeader = function(uiType)
{
	return this;
};
oFF.UiContextDummy.prototype.clearSubHeader = function()
{
	return this;
};
oFF.UiContextDummy.prototype.getHeader = function()
{
	return this;
};
oFF.UiContextDummy.prototype.setHeader = function(header)
{
	return this;
};
oFF.UiContextDummy.prototype.setNewHeader = function(uiType)
{
	return this;
};
oFF.UiContextDummy.prototype.clearHeader = function()
{
	return this;
};
oFF.UiContextDummy.prototype.isOn = function()
{
	return false;
};
oFF.UiContextDummy.prototype.setOn = function(isOn)
{
	return this;
};
oFF.UiContextDummy.prototype.getTag = function()
{
	return null;
};
oFF.UiContextDummy.prototype.setTag = function(tag)
{
	return this;
};
oFF.UiContextDummy.prototype.getOnText = function()
{
	return null;
};
oFF.UiContextDummy.prototype.setOnText = function(onText)
{
	return this;
};
oFF.UiContextDummy.prototype.getOffText = function()
{
	return null;
};
oFF.UiContextDummy.prototype.setOffText = function(offText)
{
	return this;
};
oFF.UiContextDummy.prototype.getCodeType = function()
{
	return "javascript";
};
oFF.UiContextDummy.prototype.setCodeType = function(codeType)
{
	return this;
};
oFF.UiContextDummy.prototype.getCustomParameters = function()
{
	return null;
};
oFF.UiContextDummy.prototype.setCustomParameters = function(customParameters)
{
	return this;
};
oFF.UiContextDummy.prototype.isExpandable = function()
{
	return false;
};
oFF.UiContextDummy.prototype.setExpandable = function(expandable)
{
	return this;
};
oFF.UiContextDummy.prototype.setIntervalSelection = function(intervalSelection)
{
	return this;
};
oFF.UiContextDummy.prototype.isIntervalSelection = function()
{
	return false;
};
oFF.UiContextDummy.prototype.getStartDate = function()
{
	return null;
};
oFF.UiContextDummy.prototype.setStartDate = function(startDate)
{
	return this;
};
oFF.UiContextDummy.prototype.getEndDate = function()
{
	return null;
};
oFF.UiContextDummy.prototype.setEndDate = function(endDate)
{
	return this;
};
oFF.UiContextDummy.prototype.setPressed = function(pressed)
{
	return this;
};
oFF.UiContextDummy.prototype.isPressed = function()
{
	return false;
};
oFF.UiContextDummy.prototype.getOpacity = function()
{
	return 1.0;
};
oFF.UiContextDummy.prototype.setOpacity = function(opacity)
{
	return this;
};
oFF.UiContextDummy.prototype.getPrompt = function()
{
	return null;
};
oFF.UiContextDummy.prototype.setPrompt = function(prompt)
{
	return this;
};
oFF.UiContextDummy.prototype.isShowSorting = function()
{
	return false;
};
oFF.UiContextDummy.prototype.setShowSorting = function(showSorting)
{
	return this;
};
oFF.UiContextDummy.prototype.isShowValue = function()
{
	return true;
};
oFF.UiContextDummy.prototype.setShowValue = function(showValue)
{
	return this;
};
oFF.UiContextDummy.prototype.isAnimated = function()
{
	return true;
};
oFF.UiContextDummy.prototype.setAnimated = function(animated)
{
	return this;
};
oFF.UiContextDummy.prototype.getPercentValue = function()
{
	return 0;
};
oFF.UiContextDummy.prototype.setPercentValue = function(value)
{
	return this;
};
oFF.UiContextDummy.prototype.getColor = function()
{
	return null;
};
oFF.UiContextDummy.prototype.setColor = function(color)
{
	return this;
};
oFF.UiContextDummy.prototype.setOverflow = function(overflow)
{
	return this;
};
oFF.UiContextDummy.prototype.getOverflow = function()
{
	return null;
};
oFF.UiContextDummy.prototype.setLoadState = function(loadState)
{
	return this;
};
oFF.UiContextDummy.prototype.getLoadState = function()
{
	return null;
};
oFF.UiContextDummy.prototype.setFrameType = function(frameType)
{
	return this;
};
oFF.UiContextDummy.prototype.getFrameType = function()
{
	return null;
};
oFF.UiContextDummy.prototype.setTileMode = function(tileMode)
{
	return this;
};
oFF.UiContextDummy.prototype.getTileMode = function()
{
	return null;
};
oFF.UiContextDummy.prototype.isDraggable = function()
{
	return false;
};
oFF.UiContextDummy.prototype.setDraggable = function(draggable)
{
	return this;
};
oFF.UiContextDummy.prototype.getOffsetHeight = function()
{
	return 0;
};
oFF.UiContextDummy.prototype.getOffsetWidth = function()
{
	return 0;
};
oFF.UiContextDummy.prototype.setDropInfo = function(dropInfo)
{
	return this;
};
oFF.UiContextDummy.prototype.getDropInfo = function()
{
	return null;
};
oFF.UiContextDummy.prototype.getCssClass = function()
{
	return null;
};
oFF.UiContextDummy.prototype.setCssClass = function(cssClass)
{
	return this;
};
oFF.UiContextDummy.prototype.isPartiallyChecked = function()
{
	return false;
};
oFF.UiContextDummy.prototype.setPartiallyChecked = function(partiallyChecked)
{
	return this;
};
oFF.UiContextDummy.prototype.isApplyContentPadding = function()
{
	return true;
};
oFF.UiContextDummy.prototype.setApplyContentPadding = function(applyContentPadding)
{
	return this;
};
oFF.UiContextDummy.prototype.isEnableReordering = function()
{
	return false;
};
oFF.UiContextDummy.prototype.setEnableReordering = function(enableReordering)
{
	return this;
};
oFF.UiContextDummy.prototype.setHeaderMode = function(headerMode)
{
	return this;
};
oFF.UiContextDummy.prototype.getHeaderMode = function()
{
	return null;
};
oFF.UiContextDummy.prototype.getCount = function()
{
	return null;
};
oFF.UiContextDummy.prototype.setCount = function(count)
{
	return this;
};
oFF.UiContextDummy.prototype.isShowAddNewButton = function()
{
	return false;
};
oFF.UiContextDummy.prototype.setShowAddNewButton = function(showAddNewButton)
{
	return this;
};
oFF.UiContextDummy.prototype.isModified = function()
{
	return false;
};
oFF.UiContextDummy.prototype.setModified = function(modified)
{
	return this;
};
oFF.UiContextDummy.prototype.getSplitterPosition = function()
{
	return 0;
};
oFF.UiContextDummy.prototype.setSplitterPosition = function(splitterPosition)
{
	return this;
};
oFF.UiContextDummy.prototype.isCompositeControl = function()
{
	return false;
};
oFF.UiContextDummy.prototype.select = function(sigSelExpression)
{
	return this;
};
oFF.UiContextDummy.prototype.selectById = function(identifier)
{
	return this;
};
oFF.UiContextDummy.prototype.isSingleSelection = function()
{
	return false;
};
oFF.UiContextDummy.prototype.isSelectionSet = function()
{
	return false;
};
oFF.UiContextDummy.prototype.suspend = function()
{
	return this;
};
oFF.UiContextDummy.prototype.resume = function()
{
	return this;
};
oFF.UiContextDummy.prototype.invalidate = function()
{
	return this;
};
oFF.UiContextDummy.prototype.layout = function()
{
	return this;
};
oFF.UiContextDummy.prototype.invalidateModelContent = function()
{
	return this;
};
oFF.UiContextDummy.prototype.reset = function() {};
oFF.UiContextDummy.prototype.getSelectedItem = function()
{
	return this;
};
oFF.UiContextDummy.prototype.setSelectedItem = function(selectedItem)
{
	return this;
};
oFF.UiContextDummy.prototype.setSelectedItemByIndex = function(index)
{
	return this;
};
oFF.UiContextDummy.prototype.getSelectedName = function()
{
	return null;
};
oFF.UiContextDummy.prototype.setSelectedName = function(selectedName)
{
	return this;
};
oFF.UiContextDummy.prototype.hasSelectedItems = function()
{
	return false;
};
oFF.UiContextDummy.prototype.getSelectedItemCount = function()
{
	return 0;
};
oFF.UiContextDummy.prototype.getSelectedItems = function()
{
	return null;
};
oFF.UiContextDummy.prototype.setSelectedItems = function(selectedItems)
{
	return this;
};
oFF.UiContextDummy.prototype.addSelectedItem = function(selectedItem)
{
	return this;
};
oFF.UiContextDummy.prototype.removeSelectedItem = function(selectedItem)
{
	return this;
};
oFF.UiContextDummy.prototype.clearSelectedItems = function()
{
	return this;
};
oFF.UiContextDummy.prototype.openAt = function(control)
{
	return this;
};
oFF.UiContextDummy.prototype.openAtPosition = function(posX, posY)
{
	return this;
};
oFF.UiContextDummy.prototype.open = function()
{
	return this;
};
oFF.UiContextDummy.prototype.close = function()
{
	return this;
};
oFF.UiContextDummy.prototype.print = function(text) {};
oFF.UiContextDummy.prototype.println = function(text) {};
oFF.UiContextDummy.prototype.expandToLevel = function(level)
{
	return this;
};
oFF.UiContextDummy.prototype.collapseAll = function()
{
	return this;
};
oFF.UiContextDummy.prototype.focus = function()
{
	return this;
};
oFF.UiContextDummy.prototype.shake = function()
{
	return this;
};
oFF.UiContextDummy.prototype.showSuggestions = function()
{
	return this;
};
oFF.UiContextDummy.prototype.closeSuggestions = function()
{
	return this;
};
oFF.UiContextDummy.prototype.back = function()
{
	return this;
};
oFF.UiContextDummy.prototype.scrollTo = function(x, y, duration)
{
	return this;
};
oFF.UiContextDummy.prototype.scrollToControl = function(control, duration)
{
	return this;
};
oFF.UiContextDummy.prototype.popToPage = function(page)
{
	return this;
};
oFF.UiContextDummy.prototype.maximize = function(animated)
{
	return this;
};
oFF.UiContextDummy.prototype.restore = function(animated)
{
	return this;
};
oFF.UiContextDummy.prototype.hide = function(animated, refControl)
{
	return this;
};
oFF.UiContextDummy.prototype.show = function(animated, refControl)
{
	return this;
};
oFF.UiContextDummy.prototype.selectText = function(startIndex, endIndex)
{
	return this;
};
oFF.UiContextDummy.prototype.fullscreen = function()
{
	return this;
};
oFF.UiContextDummy.prototype.startReadLine = function(text, numOfChars)
{
	return this;
};
oFF.UiContextDummy.prototype.bringToFront = function()
{
	return this;
};
oFF.UiContextDummy.prototype.setFrame = function(x, y, width, height) {};
oFF.UiContextDummy.prototype.setFrameCss = function(xCss, yCss, widthCss, heightCss) {};
oFF.UiContextDummy.prototype.getNativeControl = function()
{
	return this;
};
oFF.UiContextDummy.prototype.getBaseControl = function()
{
	return this;
};
oFF.UiContextDummy.prototype.setBaseControl = function(baseControl)
{
	return this;
};
oFF.UiContextDummy.prototype.attach = function(child, operation, position, firstIndex, secondIndex)
{
	return this;
};
oFF.UiContextDummy.prototype.getListenerOnClick = function()
{
	return null;
};
oFF.UiContextDummy.prototype.getListenerOnContextMenu = function()
{
	return null;
};
oFF.UiContextDummy.prototype.getListenerOnDoubleClick = function()
{
	return null;
};
oFF.UiContextDummy.prototype.getListenerOnPress = function()
{
	return null;
};
oFF.UiContextDummy.prototype.getListenerOnChange = function()
{
	return null;
};
oFF.UiContextDummy.prototype.getListenerOnLiveChange = function()
{
	return null;
};
oFF.UiContextDummy.prototype.getListenerOnEnter = function()
{
	return null;
};
oFF.UiContextDummy.prototype.getListenerOnSelect = function()
{
	return null;
};
oFF.UiContextDummy.prototype.getListenerOnSelectionChange = function()
{
	return null;
};
oFF.UiContextDummy.prototype.getListenerOnOpen = function()
{
	return null;
};
oFF.UiContextDummy.prototype.getListenerOnClose = function()
{
	return null;
};
oFF.UiContextDummy.prototype.getListenerOnEditingBegin = function()
{
	return null;
};
oFF.UiContextDummy.prototype.getListenerOnEditingEnd = function()
{
	return null;
};
oFF.UiContextDummy.prototype.getListenerOnBack = function()
{
	return null;
};
oFF.UiContextDummy.prototype.getListenerOnExpand = function()
{
	return null;
};
oFF.UiContextDummy.prototype.getListenerOnCollapse = function()
{
	return null;
};
oFF.UiContextDummy.prototype.getListenerOnBeforeOpen = function()
{
	return null;
};
oFF.UiContextDummy.prototype.getListenerOnBeforeClose = function()
{
	return null;
};
oFF.UiContextDummy.prototype.getListenerOnAfterOpen = function()
{
	return null;
};
oFF.UiContextDummy.prototype.getListenerOnAfterClose = function()
{
	return null;
};
oFF.UiContextDummy.prototype.getListenerOnRefresh = function()
{
	return null;
};
oFF.UiContextDummy.prototype.getListenerOnLoadFinished = function()
{
	return null;
};
oFF.UiContextDummy.prototype.getListenerOnDelete = function()
{
	return null;
};
oFF.UiContextDummy.prototype.getListenerOnDetailPress = function()
{
	return null;
};
oFF.UiContextDummy.prototype.getListenerOnMove = function()
{
	return null;
};
oFF.UiContextDummy.prototype.getListenerOnMoveStart = function()
{
	return null;
};
oFF.UiContextDummy.prototype.getListenerOnMoveEnd = function()
{
	return null;
};
oFF.UiContextDummy.prototype.getListenerOnResize = function()
{
	return null;
};
oFF.UiContextDummy.prototype.getListenerOnSuggestionSelect = function()
{
	return null;
};
oFF.UiContextDummy.prototype.getListenerOnScroll = function()
{
	return null;
};
oFF.UiContextDummy.prototype.getListenerOnScrollLoad = function()
{
	return null;
};
oFF.UiContextDummy.prototype.getListenerOnHover = function()
{
	return null;
};
oFF.UiContextDummy.prototype.getListenerOnHoverEnd = function()
{
	return null;
};
oFF.UiContextDummy.prototype.getListenerOnPaste = function()
{
	return null;
};
oFF.UiContextDummy.prototype.getListenerOnSelectionFinish = function()
{
	return null;
};
oFF.UiContextDummy.prototype.getListenerOnSearch = function()
{
	return null;
};
oFF.UiContextDummy.prototype.getListenerOnButtonPress = function()
{
	return null;
};
oFF.UiContextDummy.prototype.getListenerOnError = function()
{
	return null;
};
oFF.UiContextDummy.prototype.getListenerOnReadLineFinished = function()
{
	return null;
};
oFF.UiContextDummy.prototype.getListenerOnExecute = function()
{
	return null;
};
oFF.UiContextDummy.prototype.getListenerOnTerminate = function()
{
	return null;
};
oFF.UiContextDummy.prototype.getListenerOnFileDrop = function()
{
	return null;
};
oFF.UiContextDummy.prototype.getListenerOnDrop = function()
{
	return null;
};
oFF.UiContextDummy.prototype.getListenerOnItemClose = function()
{
	return null;
};
oFF.UiContextDummy.prototype.getListenerOnItemSelect = function()
{
	return null;
};
oFF.UiContextDummy.prototype.getListenerOnTableDragAndDrop = function()
{
	return null;
};
oFF.UiContextDummy.prototype.getWidth = function()
{
	return null;
};
oFF.UiContextDummy.prototype.setWidth = function(width)
{
	return this;
};
oFF.UiContextDummy.prototype.getPadding = function()
{
	return null;
};
oFF.UiContextDummy.prototype.setPadding = function(padding)
{
	return this;
};
oFF.UiContextDummy.prototype.getFontSize = function()
{
	return null;
};
oFF.UiContextDummy.prototype.setFontSize = function(fontSize)
{
	return this;
};
oFF.UiContextDummy.prototype.getIconSize = function()
{
	return null;
};
oFF.UiContextDummy.prototype.setIconSize = function(iconSize)
{
	return this;
};
oFF.UiContextDummy.prototype.getValuesAsReadOnlyList = function()
{
	return null;
};
oFF.UiContextDummy.prototype.getIterator = function()
{
	return null;
};
oFF.UiContextDummy.prototype.contains = function(element)
{
	return false;
};
oFF.UiContextDummy.prototype.clear = function() {};
oFF.UiContextDummy.prototype.getBorderWidth = function()
{
	return null;
};
oFF.UiContextDummy.prototype.setBorderWidth = function(borderWidth)
{
	return this;
};
oFF.UiContextDummy.prototype.createArrayCopy = oFF.noSupport;
oFF.UiContextDummy.prototype.getNodeType = function()
{
	return null;
};
oFF.UiContextDummy.prototype.newItem = function()
{
	return this;
};
oFF.UiContextDummy.prototype.getOrigin = function()
{
	return this;
};
oFF.UiContextDummy.prototype.hasProperty = function(property)
{
	return false;
};
oFF.UiContextDummy.prototype.hasAggregation = function(aggrDef)
{
	return false;
};
oFF.UiContextDummy.prototype.hasMethod = function(method)
{
	return false;
};
oFF.UiContextDummy.prototype.hasEvent = function(eventDef)
{
	return false;
};
oFF.UiContextDummy.prototype.hasInterface = function(interfaceDef)
{
	return false;
};

oFF.UiContextSpace = function() {};
oFF.UiContextSpace.prototype = new oFF.XComponent();
oFF.UiContextSpace.prototype._ff_c = "UiContextSpace";

oFF.UiContextSpace.create = function(uiManager)
{
	var newObject = new oFF.UiContextSpace();
	newObject.setup();
	newObject.m_uiManager = uiManager;
	newObject.m_elements = oFF.XList.create();
	newObject.m_iteratorIndex = -1;
	return newObject;
};
oFF.UiContextSpace.prototype.m_uiManager = null;
oFF.UiContextSpace.prototype.m_elements = null;
oFF.UiContextSpace.prototype.m_iteratorIndex = 0;
oFF.UiContextSpace.prototype.getComponentType = function()
{
	return oFF.XComponentType._UI;
};
oFF.UiContextSpace.prototype.addComponent = function(component)
{
	this.addToSpace(component);
};
oFF.UiContextSpace.prototype.addToSpace = function(element)
{
	if (oFF.isNull(this.m_uiManager))
	{
		this.m_uiManager = element.getUiManager();
	}
	this.m_elements.add(element);
};
oFF.UiContextSpace.prototype.addAllToSpace = function(elements)
{
	this.m_elements.addAll(elements);
};
oFF.UiContextSpace.prototype.next = function()
{
	if (this.m_iteratorIndex >= this.m_elements.size() - 1)
	{
		throw oFF.XException.createIllegalStateException("Index out of bounds");
	}
	this.m_iteratorIndex++;
	return this.m_elements.get(this.m_iteratorIndex);
};
oFF.UiContextSpace.prototype.hasNext = function()
{
	if (this.m_elements.size() > 0)
	{
		return this.m_iteratorIndex < this.m_elements.size() - 1;
	}
	return false;
};
oFF.UiContextSpace.prototype.getUiManager = function()
{
	return this.m_uiManager;
};
oFF.UiContextSpace.prototype.select = function(sigSelExpression)
{
	return this.m_uiManager.select(sigSelExpression);
};
oFF.UiContextSpace.prototype.selectById = function(identifier)
{
	return this.m_uiManager.selectById(identifier);
};
oFF.UiContextSpace.prototype.getOrigin = function()
{
	if (this.m_elements.size() > 0)
	{
		return this.m_elements.get(0);
	}
	return null;
};
oFF.UiContextSpace.prototype.registerOnClick = function(listener)
{
	for (var i = 0; i < this.m_elements.size(); i++)
	{
		this.m_elements.get(i).registerOnClick(listener);
	}
	return this;
};
oFF.UiContextSpace.prototype.registerOnOpen = function(listener)
{
	for (var i = 0; i < this.m_elements.size(); i++)
	{
		this.m_elements.get(i).registerOnOpen(listener);
	}
	return this;
};
oFF.UiContextSpace.prototype.registerOnClose = function(listener)
{
	for (var i = 0; i < this.m_elements.size(); i++)
	{
		this.m_elements.get(i).registerOnClose(listener);
	}
	return this;
};
oFF.UiContextSpace.prototype.registerOnContextMenu = function(listener)
{
	for (var i = 0; i < this.m_elements.size(); i++)
	{
		this.m_elements.get(i).registerOnContextMenu(listener);
	}
	return this;
};
oFF.UiContextSpace.prototype.registerOnEnter = function(listener)
{
	for (var i = 0; i < this.m_elements.size(); i++)
	{
		this.m_elements.get(i).registerOnEnter(listener);
	}
	return this;
};
oFF.UiContextSpace.prototype.registerOnDoubleClick = function(listener)
{
	for (var i = 0; i < this.m_elements.size(); i++)
	{
		this.m_elements.get(i).registerOnDoubleClick(listener);
	}
	return this;
};
oFF.UiContextSpace.prototype.registerOnPress = function(listener)
{
	for (var i = 0; i < this.m_elements.size(); i++)
	{
		this.m_elements.get(i).registerOnPress(listener);
	}
	return this;
};
oFF.UiContextSpace.prototype.registerOnChange = function(listener)
{
	for (var i = 0; i < this.m_elements.size(); i++)
	{
		this.m_elements.get(i).registerOnChange(listener);
	}
	return this;
};
oFF.UiContextSpace.prototype.registerOnLiveChange = function(listener)
{
	for (var i = 0; i < this.m_elements.size(); i++)
	{
		this.m_elements.get(i).registerOnLiveChange(listener);
	}
	return this;
};
oFF.UiContextSpace.prototype.registerOnSelect = function(listener)
{
	for (var i = 0; i < this.m_elements.size(); i++)
	{
		this.m_elements.get(i).registerOnSelect(listener);
	}
	return this;
};
oFF.UiContextSpace.prototype.registerOnSelectionChange = function(listener)
{
	for (var i = 0; i < this.m_elements.size(); i++)
	{
		this.m_elements.get(i).registerOnSelectionChange(listener);
	}
	return this;
};
oFF.UiContextSpace.prototype.registerOnEditingBegin = function(listener)
{
	for (var i = 0; i < this.m_elements.size(); i++)
	{
		this.m_elements.get(i).registerOnEditingBegin(listener);
	}
	return this;
};
oFF.UiContextSpace.prototype.registerOnEditingEnd = function(listener)
{
	for (var i = 0; i < this.m_elements.size(); i++)
	{
		this.m_elements.get(i).registerOnEditingEnd(listener);
	}
	return this;
};
oFF.UiContextSpace.prototype.registerOnBack = function(listener)
{
	for (var i = 0; i < this.m_elements.size(); i++)
	{
		this.m_elements.get(i).registerOnBack(listener);
	}
	return this;
};
oFF.UiContextSpace.prototype.registerOnExpand = function(listener)
{
	for (var i = 0; i < this.m_elements.size(); i++)
	{
		this.m_elements.get(i).registerOnExpand(listener);
	}
	return this;
};
oFF.UiContextSpace.prototype.registerOnCollapse = function(listener)
{
	for (var i = 0; i < this.m_elements.size(); i++)
	{
		this.m_elements.get(i).registerOnCollapse(listener);
	}
	return this;
};
oFF.UiContextSpace.prototype.registerOnBeforeOpen = function(listener)
{
	for (var i = 0; i < this.m_elements.size(); i++)
	{
		this.m_elements.get(i).registerOnBeforeOpen(listener);
	}
	return this;
};
oFF.UiContextSpace.prototype.registerOnBeforeClose = function(listener)
{
	for (var i = 0; i < this.m_elements.size(); i++)
	{
		this.m_elements.get(i).registerOnBeforeClose(listener);
	}
	return this;
};
oFF.UiContextSpace.prototype.registerOnAfterOpen = function(listener)
{
	for (var i = 0; i < this.m_elements.size(); i++)
	{
		this.m_elements.get(i).registerOnAfterOpen(listener);
	}
	return this;
};
oFF.UiContextSpace.prototype.registerOnAfterClose = function(listener)
{
	for (var i = 0; i < this.m_elements.size(); i++)
	{
		this.m_elements.get(i).registerOnAfterClose(listener);
	}
	return this;
};
oFF.UiContextSpace.prototype.registerOnRefresh = function(listener)
{
	for (var i = 0; i < this.m_elements.size(); i++)
	{
		this.m_elements.get(i).registerOnRefresh(listener);
	}
	return this;
};
oFF.UiContextSpace.prototype.registerOnLoadFinished = function(listener)
{
	for (var i = 0; i < this.m_elements.size(); i++)
	{
		this.m_elements.get(i).registerOnLoadFinished(listener);
	}
	return this;
};
oFF.UiContextSpace.prototype.registerOnDelete = function(listener)
{
	for (var i = 0; i < this.m_elements.size(); i++)
	{
		this.m_elements.get(i).registerOnDelete(listener);
	}
	return this;
};
oFF.UiContextSpace.prototype.registerOnDetailPress = function(listener)
{
	for (var i = 0; i < this.m_elements.size(); i++)
	{
		this.m_elements.get(i).registerOnDetailPress(listener);
	}
	return this;
};
oFF.UiContextSpace.prototype.registerOnMove = function(listener)
{
	for (var i = 0; i < this.m_elements.size(); i++)
	{
		this.m_elements.get(i).registerOnMove(listener);
	}
	return this;
};
oFF.UiContextSpace.prototype.registerOnMoveStart = function(listener)
{
	for (var i = 0; i < this.m_elements.size(); i++)
	{
		this.m_elements.get(i).registerOnMoveStart(listener);
	}
	return this;
};
oFF.UiContextSpace.prototype.registerOnMoveEnd = function(listener)
{
	for (var i = 0; i < this.m_elements.size(); i++)
	{
		this.m_elements.get(i).registerOnMoveEnd(listener);
	}
	return this;
};
oFF.UiContextSpace.prototype.registerOnResize = function(listener)
{
	for (var i = 0; i < this.m_elements.size(); i++)
	{
		this.m_elements.get(i).registerOnResize(listener);
	}
	return this;
};
oFF.UiContextSpace.prototype.registerOnSuggestionSelect = function(listener)
{
	for (var i = 0; i < this.m_elements.size(); i++)
	{
		this.m_elements.get(i).registerOnSuggestionSelect(listener);
	}
	return this;
};
oFF.UiContextSpace.prototype.registerOnScroll = function(listener)
{
	for (var i = 0; i < this.m_elements.size(); i++)
	{
		this.m_elements.get(i).registerOnScroll(listener);
	}
	return this;
};
oFF.UiContextSpace.prototype.registerOnScrollLoad = function(listener)
{
	for (var i = 0; i < this.m_elements.size(); i++)
	{
		this.m_elements.get(i).registerOnScrollLoad(listener);
	}
	return this;
};
oFF.UiContextSpace.prototype.registerOnHover = function(listener)
{
	for (var i = 0; i < this.m_elements.size(); i++)
	{
		this.m_elements.get(i).registerOnHover(listener);
	}
	return this;
};
oFF.UiContextSpace.prototype.registerOnHoverEnd = function(listener)
{
	for (var i = 0; i < this.m_elements.size(); i++)
	{
		this.m_elements.get(i).registerOnHoverEnd(listener);
	}
	return this;
};
oFF.UiContextSpace.prototype.registerOnPaste = function(listener)
{
	for (var i = 0; i < this.m_elements.size(); i++)
	{
		this.m_elements.get(i).registerOnPaste(listener);
	}
	return this;
};
oFF.UiContextSpace.prototype.registerOnSelectionFinish = function(listener)
{
	for (var i = 0; i < this.m_elements.size(); i++)
	{
		this.m_elements.get(i).registerOnSelectionFinish(listener);
	}
	return this;
};
oFF.UiContextSpace.prototype.registerOnSearch = function(listener)
{
	for (var i = 0; i < this.m_elements.size(); i++)
	{
		this.m_elements.get(i).registerOnSearch(listener);
	}
	return this;
};
oFF.UiContextSpace.prototype.registerOnButtonPress = function(listener)
{
	for (var i = 0; i < this.m_elements.size(); i++)
	{
		this.m_elements.get(i).registerOnButtonPress(listener);
	}
	return this;
};
oFF.UiContextSpace.prototype.registerOnError = function(listener)
{
	for (var i = 0; i < this.m_elements.size(); i++)
	{
		this.m_elements.get(i).registerOnError(listener);
	}
	return this;
};
oFF.UiContextSpace.prototype.registerOnReadLineFinished = function(listener)
{
	for (var i = 0; i < this.m_elements.size(); i++)
	{
		this.m_elements.get(i).registerOnReadLineFinished(listener);
	}
	return this;
};
oFF.UiContextSpace.prototype.registerOnExecute = function(listener)
{
	for (var i = 0; i < this.m_elements.size(); i++)
	{
		this.m_elements.get(i).registerOnExecute(listener);
	}
	return this;
};
oFF.UiContextSpace.prototype.registerOnTerminate = function(listener)
{
	for (var i = 0; i < this.m_elements.size(); i++)
	{
		this.m_elements.get(i).registerOnTerminate(listener);
	}
	return this;
};
oFF.UiContextSpace.prototype.registerOnFileDrop = function(listener)
{
	for (var i = 0; i < this.m_elements.size(); i++)
	{
		this.m_elements.get(i).registerOnFileDrop(listener);
	}
	return this;
};
oFF.UiContextSpace.prototype.registerOnDrop = function(listener)
{
	for (var i = 0; i < this.m_elements.size(); i++)
	{
		this.m_elements.get(i).registerOnDrop(listener);
	}
	return this;
};
oFF.UiContextSpace.prototype.registerOnItemClose = function(listener)
{
	for (var i = 0; i < this.m_elements.size(); i++)
	{
		this.m_elements.get(i).registerOnItemClose(listener);
	}
	return this;
};
oFF.UiContextSpace.prototype.registerOnItemSelect = function(listener)
{
	for (var i = 0; i < this.m_elements.size(); i++)
	{
		this.m_elements.get(i).registerOnItemSelect(listener);
	}
	return this;
};
oFF.UiContextSpace.prototype.registerOnTableDragAndDrop = function(listener)
{
	for (var i = 0; i < this.m_elements.size(); i++)
	{
		this.m_elements.get(i).registerOnTableDragAndDrop(listener);
	}
	return this;
};
oFF.UiContextSpace.prototype.getListenerOnClick = function()
{
	if (this.m_elements.size() > 0)
	{
		return this.m_elements.get(0).getListenerOnClick();
	}
	return null;
};
oFF.UiContextSpace.prototype.getListenerOnContextMenu = function()
{
	if (this.m_elements.size() > 0)
	{
		return this.m_elements.get(0).getListenerOnContextMenu();
	}
	return null;
};
oFF.UiContextSpace.prototype.getListenerOnDoubleClick = function()
{
	if (this.m_elements.size() > 0)
	{
		return this.m_elements.get(0).getListenerOnDoubleClick();
	}
	return null;
};
oFF.UiContextSpace.prototype.getListenerOnPress = function()
{
	if (this.m_elements.size() > 0)
	{
		return this.m_elements.get(0).getListenerOnPress();
	}
	return null;
};
oFF.UiContextSpace.prototype.getListenerOnChange = function()
{
	if (this.m_elements.size() > 0)
	{
		return this.m_elements.get(0).getListenerOnChange();
	}
	return null;
};
oFF.UiContextSpace.prototype.getListenerOnLiveChange = function()
{
	if (this.m_elements.size() > 0)
	{
		return this.m_elements.get(0).getListenerOnLiveChange();
	}
	return null;
};
oFF.UiContextSpace.prototype.getListenerOnEnter = function()
{
	if (this.m_elements.size() > 0)
	{
		return this.m_elements.get(0).getListenerOnEnter();
	}
	return null;
};
oFF.UiContextSpace.prototype.getListenerOnSelect = function()
{
	if (this.m_elements.size() > 0)
	{
		return this.m_elements.get(0).getListenerOnSelect();
	}
	return null;
};
oFF.UiContextSpace.prototype.getListenerOnSelectionChange = function()
{
	if (this.m_elements.size() > 0)
	{
		return this.m_elements.get(0).getListenerOnSelectionChange();
	}
	return null;
};
oFF.UiContextSpace.prototype.getListenerOnOpen = function()
{
	if (this.m_elements.size() > 0)
	{
		return this.m_elements.get(0).getListenerOnOpen();
	}
	return null;
};
oFF.UiContextSpace.prototype.getListenerOnClose = function()
{
	if (this.m_elements.size() > 0)
	{
		return this.m_elements.get(0).getListenerOnClose();
	}
	return null;
};
oFF.UiContextSpace.prototype.getListenerOnEditingBegin = function()
{
	if (this.m_elements.size() > 0)
	{
		return this.m_elements.get(0).getListenerOnEditingBegin();
	}
	return null;
};
oFF.UiContextSpace.prototype.getListenerOnEditingEnd = function()
{
	if (this.m_elements.size() > 0)
	{
		return this.m_elements.get(0).getListenerOnEditingEnd();
	}
	return null;
};
oFF.UiContextSpace.prototype.getListenerOnBack = function()
{
	if (this.m_elements.size() > 0)
	{
		return this.m_elements.get(0).getListenerOnBack();
	}
	return null;
};
oFF.UiContextSpace.prototype.getListenerOnExpand = function()
{
	if (this.m_elements.size() > 0)
	{
		return this.m_elements.get(0).getListenerOnExpand();
	}
	return null;
};
oFF.UiContextSpace.prototype.getListenerOnCollapse = function()
{
	if (this.m_elements.size() > 0)
	{
		return this.m_elements.get(0).getListenerOnCollapse();
	}
	return null;
};
oFF.UiContextSpace.prototype.getListenerOnBeforeOpen = function()
{
	if (this.m_elements.size() > 0)
	{
		return this.m_elements.get(0).getListenerOnBeforeOpen();
	}
	return null;
};
oFF.UiContextSpace.prototype.getListenerOnBeforeClose = function()
{
	if (this.m_elements.size() > 0)
	{
		return this.m_elements.get(0).getListenerOnBeforeClose();
	}
	return null;
};
oFF.UiContextSpace.prototype.getListenerOnAfterOpen = function()
{
	if (this.m_elements.size() > 0)
	{
		return this.m_elements.get(0).getListenerOnAfterOpen();
	}
	return null;
};
oFF.UiContextSpace.prototype.getListenerOnAfterClose = function()
{
	if (this.m_elements.size() > 0)
	{
		return this.m_elements.get(0).getListenerOnAfterClose();
	}
	return null;
};
oFF.UiContextSpace.prototype.getListenerOnRefresh = function()
{
	if (this.m_elements.size() > 0)
	{
		return this.m_elements.get(0).getListenerOnRefresh();
	}
	return null;
};
oFF.UiContextSpace.prototype.getListenerOnLoadFinished = function()
{
	if (this.m_elements.size() > 0)
	{
		return this.m_elements.get(0).getListenerOnLoadFinished();
	}
	return null;
};
oFF.UiContextSpace.prototype.getListenerOnDelete = function()
{
	if (this.m_elements.size() > 0)
	{
		return this.m_elements.get(0).getListenerOnDelete();
	}
	return null;
};
oFF.UiContextSpace.prototype.getListenerOnDetailPress = function()
{
	if (this.m_elements.size() > 0)
	{
		return this.m_elements.get(0).getListenerOnDetailPress();
	}
	return null;
};
oFF.UiContextSpace.prototype.getListenerOnMove = function()
{
	if (this.m_elements.size() > 0)
	{
		return this.m_elements.get(0).getListenerOnMove();
	}
	return null;
};
oFF.UiContextSpace.prototype.getListenerOnMoveStart = function()
{
	if (this.m_elements.size() > 0)
	{
		return this.m_elements.get(0).getListenerOnMoveStart();
	}
	return null;
};
oFF.UiContextSpace.prototype.getListenerOnMoveEnd = function()
{
	if (this.m_elements.size() > 0)
	{
		return this.m_elements.get(0).getListenerOnMoveEnd();
	}
	return null;
};
oFF.UiContextSpace.prototype.getListenerOnResize = function()
{
	if (this.m_elements.size() > 0)
	{
		return this.m_elements.get(0).getListenerOnResize();
	}
	return null;
};
oFF.UiContextSpace.prototype.getListenerOnSuggestionSelect = function()
{
	if (this.m_elements.size() > 0)
	{
		return this.m_elements.get(0).getListenerOnSuggestionSelect();
	}
	return null;
};
oFF.UiContextSpace.prototype.getListenerOnScroll = function()
{
	if (this.m_elements.size() > 0)
	{
		return this.m_elements.get(0).getListenerOnScroll();
	}
	return null;
};
oFF.UiContextSpace.prototype.getListenerOnScrollLoad = function()
{
	if (this.m_elements.size() > 0)
	{
		return this.m_elements.get(0).getListenerOnScrollLoad();
	}
	return null;
};
oFF.UiContextSpace.prototype.getListenerOnHover = function()
{
	if (this.m_elements.size() > 0)
	{
		return this.m_elements.get(0).getListenerOnHover();
	}
	return null;
};
oFF.UiContextSpace.prototype.getListenerOnHoverEnd = function()
{
	if (this.m_elements.size() > 0)
	{
		return this.m_elements.get(0).getListenerOnHoverEnd();
	}
	return null;
};
oFF.UiContextSpace.prototype.getListenerOnPaste = function()
{
	if (this.m_elements.size() > 0)
	{
		return this.m_elements.get(0).getListenerOnPaste();
	}
	return null;
};
oFF.UiContextSpace.prototype.getListenerOnSelectionFinish = function()
{
	if (this.m_elements.size() > 0)
	{
		return this.m_elements.get(0).getListenerOnSelectionFinish();
	}
	return null;
};
oFF.UiContextSpace.prototype.getListenerOnSearch = function()
{
	if (this.m_elements.size() > 0)
	{
		return this.m_elements.get(0).getListenerOnSearch();
	}
	return null;
};
oFF.UiContextSpace.prototype.getListenerOnButtonPress = function()
{
	if (this.m_elements.size() > 0)
	{
		return this.m_elements.get(0).getListenerOnButtonPress();
	}
	return null;
};
oFF.UiContextSpace.prototype.getListenerOnError = function()
{
	if (this.m_elements.size() > 0)
	{
		return this.m_elements.get(0).getListenerOnError();
	}
	return null;
};
oFF.UiContextSpace.prototype.getListenerOnReadLineFinished = function()
{
	if (this.m_elements.size() > 0)
	{
		return this.m_elements.get(0).getListenerOnReadLineFinished();
	}
	return null;
};
oFF.UiContextSpace.prototype.getListenerOnExecute = function()
{
	if (this.m_elements.size() > 0)
	{
		return this.m_elements.get(0).getListenerOnExecute();
	}
	return null;
};
oFF.UiContextSpace.prototype.getListenerOnTerminate = function()
{
	if (this.m_elements.size() > 0)
	{
		return this.m_elements.get(0).getListenerOnTerminate();
	}
	return null;
};
oFF.UiContextSpace.prototype.getListenerOnFileDrop = function()
{
	if (this.m_elements.size() > 0)
	{
		return this.m_elements.get(0).getListenerOnFileDrop();
	}
	return null;
};
oFF.UiContextSpace.prototype.getListenerOnDrop = function()
{
	if (this.m_elements.size() > 0)
	{
		return this.m_elements.get(0).getListenerOnDrop();
	}
	return null;
};
oFF.UiContextSpace.prototype.getListenerOnItemClose = function()
{
	if (this.m_elements.size() > 0)
	{
		return this.m_elements.get(0).getListenerOnItemClose();
	}
	return null;
};
oFF.UiContextSpace.prototype.getListenerOnItemSelect = function()
{
	if (this.m_elements.size() > 0)
	{
		return this.m_elements.get(0).getListenerOnItemSelect();
	}
	return null;
};
oFF.UiContextSpace.prototype.getListenerOnTableDragAndDrop = function()
{
	if (this.m_elements.size() > 0)
	{
		return this.m_elements.get(0).getListenerOnTableDragAndDrop();
	}
	return null;
};
oFF.UiContextSpace.prototype.getParent = function()
{
	if (this.m_elements.size() > 0)
	{
		return this.m_elements.get(0).getParent();
	}
	return null;
};
oFF.UiContextSpace.prototype.setParent = function(parent)
{
	for (var i = 0; i < this.m_elements.size(); i++)
	{
		this.m_elements.get(i).setParent(parent);
	}
	return this;
};
oFF.UiContextSpace.prototype.setText = function(text)
{
	for (var i = 0; i < this.m_elements.size(); i++)
	{
		this.m_elements.get(i).setText(text);
	}
	return this;
};
oFF.UiContextSpace.prototype.getText = function()
{
	if (this.m_elements.size() > 0)
	{
		return this.m_elements.get(0).getText();
	}
	return null;
};
oFF.UiContextSpace.prototype.setTitle = function(title)
{
	for (var i = 0; i < this.m_elements.size(); i++)
	{
		this.m_elements.get(i).setTitle(title);
	}
	return this;
};
oFF.UiContextSpace.prototype.getTitle = function()
{
	if (this.m_elements.size() > 0)
	{
		return this.m_elements.get(0).getTitle();
	}
	return null;
};
oFF.UiContextSpace.prototype.setSubtitle = function(subtitle)
{
	for (var i = 0; i < this.m_elements.size(); i++)
	{
		this.m_elements.get(i).setSubtitle(subtitle);
	}
	return this;
};
oFF.UiContextSpace.prototype.getSubtitle = function()
{
	if (this.m_elements.size() > 0)
	{
		return this.m_elements.get(0).getSubtitle();
	}
	return null;
};
oFF.UiContextSpace.prototype.getWidth = function()
{
	if (this.m_elements.size() > 0)
	{
		return this.m_elements.get(0).getWidth();
	}
	return null;
};
oFF.UiContextSpace.prototype.setWidth = function(width)
{
	for (var i = 0; i < this.m_elements.size(); i++)
	{
		this.m_elements.get(i).setWidth(width);
	}
	return this;
};
oFF.UiContextSpace.prototype.getHeight = function()
{
	if (this.m_elements.size() > 0)
	{
		return this.m_elements.get(0).getHeight();
	}
	return null;
};
oFF.UiContextSpace.prototype.setHeight = function(height)
{
	for (var i = 0; i < this.m_elements.size(); i++)
	{
		this.m_elements.get(i).setHeight(height);
	}
	return this;
};
oFF.UiContextSpace.prototype.getMinHeight = function()
{
	if (this.m_elements.size() > 0)
	{
		return this.m_elements.get(0).getMinHeight();
	}
	return null;
};
oFF.UiContextSpace.prototype.setMinHeight = function(minHeight)
{
	for (var i = 0; i < this.m_elements.size(); i++)
	{
		this.m_elements.get(i).setMinHeight(minHeight);
	}
	return this;
};
oFF.UiContextSpace.prototype.getMaxHeight = function()
{
	if (this.m_elements.size() > 0)
	{
		return this.m_elements.get(0).getMaxHeight();
	}
	return null;
};
oFF.UiContextSpace.prototype.setMaxHeight = function(maxHeight)
{
	for (var i = 0; i < this.m_elements.size(); i++)
	{
		this.m_elements.get(i).setMaxHeight(maxHeight);
	}
	return this;
};
oFF.UiContextSpace.prototype.getMinWidth = function()
{
	if (this.m_elements.size() > 0)
	{
		return this.m_elements.get(0).getMinWidth();
	}
	return null;
};
oFF.UiContextSpace.prototype.setMinWidth = function(minWidth)
{
	for (var i = 0; i < this.m_elements.size(); i++)
	{
		this.m_elements.get(i).setMinWidth(minWidth);
	}
	return this;
};
oFF.UiContextSpace.prototype.getMaxWidth = function()
{
	if (this.m_elements.size() > 0)
	{
		return this.m_elements.get(0).getMaxWidth();
	}
	return null;
};
oFF.UiContextSpace.prototype.setMaxWidth = function(maxWidth)
{
	for (var i = 0; i < this.m_elements.size(); i++)
	{
		this.m_elements.get(i).setMaxWidth(maxWidth);
	}
	return this;
};
oFF.UiContextSpace.prototype.setX = function(x)
{
	for (var i = 0; i < this.m_elements.size(); i++)
	{
		this.m_elements.get(i).setX(x);
	}
	return this;
};
oFF.UiContextSpace.prototype.setY = function(y)
{
	for (var i = 0; i < this.m_elements.size(); i++)
	{
		this.m_elements.get(i).setY(y);
	}
	return this;
};
oFF.UiContextSpace.prototype.getX = function()
{
	if (this.m_elements.size() > 0)
	{
		return this.m_elements.get(0).getX();
	}
	return null;
};
oFF.UiContextSpace.prototype.getY = function()
{
	if (this.m_elements.size() > 0)
	{
		return this.m_elements.get(0).getY();
	}
	return null;
};
oFF.UiContextSpace.prototype.setPosition = function(position)
{
	for (var i = 0; i < this.m_elements.size(); i++)
	{
		this.m_elements.get(i).setPosition(position);
	}
	return this;
};
oFF.UiContextSpace.prototype.getPosition = function()
{
	if (this.m_elements.size() > 0)
	{
		return this.m_elements.get(0).getPosition();
	}
	return oFF.UiPosition.createEmpty();
};
oFF.UiContextSpace.prototype.setSize = function(size)
{
	for (var i = 0; i < this.m_elements.size(); i++)
	{
		this.m_elements.get(i).setSize(size);
	}
	return this;
};
oFF.UiContextSpace.prototype.getSize = function()
{
	if (this.m_elements.size() > 0)
	{
		return this.m_elements.get(0).getSize();
	}
	return oFF.UiSize.createEmpty();
};
oFF.UiContextSpace.prototype.useMaxWidth = function()
{
	for (var i = 0; i < this.m_elements.size(); i++)
	{
		this.m_elements.get(i).useMaxWidth();
	}
	return this;
};
oFF.UiContextSpace.prototype.useMaxHeight = function()
{
	for (var i = 0; i < this.m_elements.size(); i++)
	{
		this.m_elements.get(i).useMaxHeight();
	}
	return this;
};
oFF.UiContextSpace.prototype.useMaxSpace = function()
{
	for (var i = 0; i < this.m_elements.size(); i++)
	{
		this.m_elements.get(i).useMaxSpace();
	}
	return this;
};
oFF.UiContextSpace.prototype.setSelected = function(selected)
{
	for (var i = 0; i < this.m_elements.size(); i++)
	{
		this.m_elements.get(i).setSelected(selected);
	}
	return this;
};
oFF.UiContextSpace.prototype.isSelected = function()
{
	if (this.m_elements.size() > 0)
	{
		return this.m_elements.get(0).isSelected();
	}
	return false;
};
oFF.UiContextSpace.prototype.setVisible = function(visible)
{
	for (var i = 0; i < this.m_elements.size(); i++)
	{
		this.m_elements.get(i).setVisible(visible);
	}
	return this;
};
oFF.UiContextSpace.prototype.isVisible = function()
{
	if (this.m_elements.size() > 0)
	{
		return this.m_elements.get(0).isVisible();
	}
	return false;
};
oFF.UiContextSpace.prototype.setEnabled = function(enabled)
{
	for (var i = 0; i < this.m_elements.size(); i++)
	{
		this.m_elements.get(i).setEnabled(enabled);
	}
	return this;
};
oFF.UiContextSpace.prototype.isEnabled = function()
{
	if (this.m_elements.size() > 0)
	{
		return this.m_elements.get(0).isEnabled();
	}
	return false;
};
oFF.UiContextSpace.prototype.setExpanded = function(isExpanded)
{
	for (var i = 0; i < this.m_elements.size(); i++)
	{
		this.m_elements.get(i).setExpanded(isExpanded);
	}
	return this;
};
oFF.UiContextSpace.prototype.isExpanded = function()
{
	if (this.m_elements.size() > 0)
	{
		return this.m_elements.get(0).isExpanded();
	}
	return false;
};
oFF.UiContextSpace.prototype.expand = function()
{
	for (var i = 0; i < this.m_elements.size(); i++)
	{
		this.m_elements.get(i).expand();
	}
	return this;
};
oFF.UiContextSpace.prototype.collapse = function()
{
	for (var i = 0; i < this.m_elements.size(); i++)
	{
		this.m_elements.get(i).collapse();
	}
	return this;
};
oFF.UiContextSpace.prototype.clearChildItems = function()
{
	for (var i = 0; i < this.m_elements.size(); i++)
	{
		this.m_elements.get(i).clearChildItems();
	}
};
oFF.UiContextSpace.prototype.clearContent = function()
{
	for (var i = 0; i < this.m_elements.size(); i++)
	{
		this.m_elements.get(i).clearContent();
	}
};
oFF.UiContextSpace.prototype.setLabel = function(label)
{
	for (var i = 0; i < this.m_elements.size(); i++)
	{
		this.m_elements.get(i).setLabel(label);
	}
	return this;
};
oFF.UiContextSpace.prototype.getLabel = function()
{
	if (this.m_elements.size() > 0)
	{
		return this.m_elements.get(0).getLabel();
	}
	return null;
};
oFF.UiContextSpace.prototype.setSortDirection = function(sortOrder)
{
	for (var i = 0; i < this.m_elements.size(); i++)
	{
		this.m_elements.get(i).setSortDirection(sortOrder);
	}
	return this;
};
oFF.UiContextSpace.prototype.getSortDirection = function()
{
	if (this.m_elements.size() > 0)
	{
		return this.m_elements.get(0).getSortDirection();
	}
	return null;
};
oFF.UiContextSpace.prototype.setCloseable = function(isCloseable)
{
	for (var i = 0; i < this.m_elements.size(); i++)
	{
		this.m_elements.get(i).setCloseable(isCloseable);
	}
	return this;
};
oFF.UiContextSpace.prototype.isCloseable = function()
{
	if (this.m_elements.size() > 0)
	{
		return this.m_elements.get(0).isCloseable();
	}
	return false;
};
oFF.UiContextSpace.prototype.setSectionStart = function(sectionStart)
{
	for (var i = 0; i < this.m_elements.size(); i++)
	{
		this.m_elements.get(i).setSectionStart(sectionStart);
	}
	return this;
};
oFF.UiContextSpace.prototype.isSectionStart = function()
{
	if (this.m_elements.size() > 0)
	{
		return this.m_elements.get(0).isSectionStart();
	}
	return false;
};
oFF.UiContextSpace.prototype.setCustomObject = function(customObject)
{
	for (var i = 0; i < this.m_elements.size(); i++)
	{
		this.m_elements.get(i).setCustomObject(customObject);
	}
	return this;
};
oFF.UiContextSpace.prototype.getCustomObject = function()
{
	if (this.m_elements.size() > 0)
	{
		return this.m_elements.get(0).getCustomObject();
	}
	return null;
};
oFF.UiContextSpace.prototype.getPadding = function()
{
	if (this.m_elements.size() > 0)
	{
		return this.m_elements.get(0).getPadding();
	}
	return null;
};
oFF.UiContextSpace.prototype.setPadding = function(padding)
{
	for (var i = 0; i < this.m_elements.size(); i++)
	{
		this.m_elements.get(i).setPadding(padding);
	}
	return this;
};
oFF.UiContextSpace.prototype.getMargin = function()
{
	if (this.m_elements.size() > 0)
	{
		return this.m_elements.get(0).getMargin();
	}
	return null;
};
oFF.UiContextSpace.prototype.setMargin = function(margin)
{
	for (var i = 0; i < this.m_elements.size(); i++)
	{
		this.m_elements.get(i).setMargin(margin);
	}
	return this;
};
oFF.UiContextSpace.prototype.setBusy = function(busy)
{
	for (var i = 0; i < this.m_elements.size(); i++)
	{
		this.m_elements.get(i).setBusy(busy);
	}
	return this;
};
oFF.UiContextSpace.prototype.isBusy = function()
{
	if (this.m_elements.size() > 0)
	{
		return this.m_elements.get(0).isBusy();
	}
	return false;
};
oFF.UiContextSpace.prototype.setEditable = function(editable)
{
	for (var i = 0; i < this.m_elements.size(); i++)
	{
		this.m_elements.get(i).setEditable(editable);
	}
	return this;
};
oFF.UiContextSpace.prototype.isEditable = function()
{
	if (this.m_elements.size() > 0)
	{
		return this.m_elements.get(0).isEditable();
	}
	return true;
};
oFF.UiContextSpace.prototype.setChecked = function(checked)
{
	for (var i = 0; i < this.m_elements.size(); i++)
	{
		this.m_elements.get(i).setChecked(checked);
	}
	return this;
};
oFF.UiContextSpace.prototype.isChecked = function()
{
	if (this.m_elements.size() > 0)
	{
		return this.m_elements.get(0).isChecked();
	}
	return false;
};
oFF.UiContextSpace.prototype.setColumnSpan = function(span)
{
	for (var i = 0; i < this.m_elements.size(); i++)
	{
		this.m_elements.get(i).setColumnSpan(span);
	}
	return this;
};
oFF.UiContextSpace.prototype.getColumnSpan = function()
{
	if (this.m_elements.size() > 0)
	{
		return this.m_elements.get(0).getColumnSpan();
	}
	return 0;
};
oFF.UiContextSpace.prototype.setRowSpan = function(span)
{
	for (var i = 0; i < this.m_elements.size(); i++)
	{
		this.m_elements.get(i).setRowSpan(span);
	}
	return this;
};
oFF.UiContextSpace.prototype.getRowSpan = function()
{
	if (this.m_elements.size() > 0)
	{
		return this.m_elements.get(0).getRowSpan();
	}
	return 0;
};
oFF.UiContextSpace.prototype.setSortable = function(sortable)
{
	for (var i = 0; i < this.m_elements.size(); i++)
	{
		this.m_elements.get(i).setSortable(sortable);
	}
	return this;
};
oFF.UiContextSpace.prototype.isSortable = function()
{
	if (this.m_elements.size() > 0)
	{
		return this.m_elements.get(0).isSortable();
	}
	return false;
};
oFF.UiContextSpace.prototype.setName = function(name)
{
	for (var i = 0; i < this.m_elements.size(); i++)
	{
		this.m_elements.get(i).setName(name);
	}
	return this;
};
oFF.UiContextSpace.prototype.setId = function(identifier)
{
	for (var i = 0; i < this.m_elements.size(); i++)
	{
		this.m_elements.get(i).setId(identifier);
	}
	return this;
};
oFF.UiContextSpace.prototype.getName = function()
{
	if (this.m_elements.size() > 0)
	{
		return this.m_elements.get(0).getName();
	}
	return null;
};
oFF.UiContextSpace.prototype.getId = function()
{
	if (this.m_elements.size() > 0)
	{
		return this.m_elements.get(0).getId();
	}
	return null;
};
oFF.UiContextSpace.prototype.setTooltip = function(tooltip)
{
	for (var i = 0; i < this.m_elements.size(); i++)
	{
		this.m_elements.get(i).setTooltip(tooltip);
	}
	return this;
};
oFF.UiContextSpace.prototype.getTooltip = function()
{
	if (this.m_elements.size() > 0)
	{
		return this.m_elements.get(0).getTooltip();
	}
	return null;
};
oFF.UiContextSpace.prototype.setDescription = function(description)
{
	for (var i = 0; i < this.m_elements.size(); i++)
	{
		this.m_elements.get(i).setDescription(description);
	}
	return this;
};
oFF.UiContextSpace.prototype.getDescription = function()
{
	if (this.m_elements.size() > 0)
	{
		return this.m_elements.get(0).getDescription();
	}
	return null;
};
oFF.UiContextSpace.prototype.setIcon = function(icon)
{
	for (var i = 0; i < this.m_elements.size(); i++)
	{
		this.m_elements.get(i).setIcon(icon);
	}
	return this;
};
oFF.UiContextSpace.prototype.getIcon = function()
{
	if (this.m_elements.size() > 0)
	{
		return this.m_elements.get(0).getIcon();
	}
	return null;
};
oFF.UiContextSpace.prototype.setSrc = function(src)
{
	for (var i = 0; i < this.m_elements.size(); i++)
	{
		this.m_elements.get(i).setSrc(src);
	}
	return this;
};
oFF.UiContextSpace.prototype.getSrc = function()
{
	if (this.m_elements.size() > 0)
	{
		return this.m_elements.get(0).getSrc();
	}
	return null;
};
oFF.UiContextSpace.prototype.setValue = function(value)
{
	for (var i = 0; i < this.m_elements.size(); i++)
	{
		this.m_elements.get(i).setValue(value);
	}
	return this;
};
oFF.UiContextSpace.prototype.getValue = function()
{
	if (this.m_elements.size() > 0)
	{
		return this.m_elements.get(0).getValue();
	}
	return null;
};
oFF.UiContextSpace.prototype.setSelectionMode = function(selectionMode)
{
	for (var i = 0; i < this.m_elements.size(); i++)
	{
		this.m_elements.get(i).setSelectionMode(selectionMode);
	}
	return this;
};
oFF.UiContextSpace.prototype.getSelectionMode = function()
{
	if (this.m_elements.size() > 0)
	{
		return this.m_elements.get(0).getSelectionMode();
	}
	return null;
};
oFF.UiContextSpace.prototype.setSelectionBehavior = function(selectionBehavior)
{
	for (var i = 0; i < this.m_elements.size(); i++)
	{
		this.m_elements.get(i).setSelectionBehavior(selectionBehavior);
	}
	return this;
};
oFF.UiContextSpace.prototype.getSelectionBehavior = function()
{
	if (this.m_elements.size() > 0)
	{
		return this.m_elements.get(0).getSelectionBehavior();
	}
	return null;
};
oFF.UiContextSpace.prototype.setRowCount = function(rowCount)
{
	for (var i = 0; i < this.m_elements.size(); i++)
	{
		this.m_elements.get(i).setRowCount(rowCount);
	}
	return this;
};
oFF.UiContextSpace.prototype.getRowCount = function()
{
	if (this.m_elements.size() > 0)
	{
		return this.m_elements.get(0).getRowCount();
	}
	return 0;
};
oFF.UiContextSpace.prototype.setColumnCount = function(columnCount)
{
	for (var i = 0; i < this.m_elements.size(); i++)
	{
		this.m_elements.get(i).setColumnCount(columnCount);
	}
	return this;
};
oFF.UiContextSpace.prototype.getColumnCount = function()
{
	if (this.m_elements.size() > 0)
	{
		return this.m_elements.get(0).getColumnCount();
	}
	return 0;
};
oFF.UiContextSpace.prototype.setSliderMinimum = function(minimum)
{
	for (var i = 0; i < this.m_elements.size(); i++)
	{
		this.m_elements.get(i).setSliderMinimum(minimum);
	}
	return this;
};
oFF.UiContextSpace.prototype.getSliderMinimum = function()
{
	if (this.m_elements.size() > 0)
	{
		return this.m_elements.get(0).getSliderMinimum();
	}
	return 0;
};
oFF.UiContextSpace.prototype.setSliderMaximum = function(maximum)
{
	for (var i = 0; i < this.m_elements.size(); i++)
	{
		this.m_elements.get(i).setSliderMaximum(maximum);
	}
	return this;
};
oFF.UiContextSpace.prototype.getSliderMaximum = function()
{
	if (this.m_elements.size() > 0)
	{
		return this.m_elements.get(0).getSliderMaximum();
	}
	return 0;
};
oFF.UiContextSpace.prototype.setSliderValue = function(value)
{
	for (var i = 0; i < this.m_elements.size(); i++)
	{
		this.m_elements.get(i).setSliderValue(value);
	}
	return this;
};
oFF.UiContextSpace.prototype.getSliderValue = function()
{
	if (this.m_elements.size() > 0)
	{
		return this.m_elements.get(0).getSliderValue();
	}
	return 0;
};
oFF.UiContextSpace.prototype.getSliderUpperValue = function()
{
	if (this.m_elements.size() > 0)
	{
		return this.m_elements.get(0).getSliderUpperValue();
	}
	return 0;
};
oFF.UiContextSpace.prototype.setSliderUpperValue = function(value)
{
	for (var i = 0; i < this.m_elements.size(); i++)
	{
		this.m_elements.get(i).setSliderUpperValue(value);
	}
	return this;
};
oFF.UiContextSpace.prototype.getSliderStep = function()
{
	if (this.m_elements.size() > 0)
	{
		return this.m_elements.get(0).getSliderStep();
	}
	return 1;
};
oFF.UiContextSpace.prototype.setSliderStep = function(step)
{
	for (var i = 0; i < this.m_elements.size(); i++)
	{
		this.m_elements.get(i).setSliderStep(step);
	}
	return this;
};
oFF.UiContextSpace.prototype.setRowIndex = function(index)
{
	for (var i = 0; i < this.m_elements.size(); i++)
	{
		this.m_elements.get(i).setRowIndex(index);
	}
	return this;
};
oFF.UiContextSpace.prototype.getRowIndex = function()
{
	if (this.m_elements.size() > 0)
	{
		return this.m_elements.get(0).getRowIndex();
	}
	return 0;
};
oFF.UiContextSpace.prototype.setColumnIndex = function(index)
{
	for (var i = 0; i < this.m_elements.size(); i++)
	{
		this.m_elements.get(i).setColumnIndex(index);
	}
	return this;
};
oFF.UiContextSpace.prototype.getColumnIndex = function()
{
	if (this.m_elements.size() > 0)
	{
		return this.m_elements.get(0).getColumnIndex();
	}
	return 0;
};
oFF.UiContextSpace.prototype.setActiveIndex = function(index)
{
	for (var i = 0; i < this.m_elements.size(); i++)
	{
		this.m_elements.get(i).setActiveIndex(index);
	}
	return this;
};
oFF.UiContextSpace.prototype.getActiveIndex = function()
{
	if (this.m_elements.size() > 0)
	{
		return this.m_elements.get(0).getActiveIndex();
	}
	return 0;
};
oFF.UiContextSpace.prototype.setSplitterPosition = function(splitterPosition)
{
	for (var i = 0; i < this.m_elements.size(); i++)
	{
		this.m_elements.get(i).setSplitterPosition(splitterPosition);
	}
	return this;
};
oFF.UiContextSpace.prototype.getSplitterPosition = function()
{
	if (this.m_elements.size() > 0)
	{
		return this.m_elements.get(0).getSplitterPosition();
	}
	return 0;
};
oFF.UiContextSpace.prototype.setSemanticCellStyle = function(semanticCellStyle)
{
	for (var i = 0; i < this.m_elements.size(); i++)
	{
		this.m_elements.get(i).setSemanticCellStyle(semanticCellStyle);
	}
	return this;
};
oFF.UiContextSpace.prototype.getSemanticCellStyle = function()
{
	if (this.m_elements.size() > 0)
	{
		return this.m_elements.get(0).getSemanticCellStyle();
	}
	return null;
};
oFF.UiContextSpace.prototype.setTextDecoration = function(textDecoration)
{
	for (var i = 0; i < this.m_elements.size(); i++)
	{
		this.m_elements.get(i).setTextDecoration(textDecoration);
	}
	return this;
};
oFF.UiContextSpace.prototype.getTextDecoration = function()
{
	if (this.m_elements.size() > 0)
	{
		return this.m_elements.get(0).getTextDecoration();
	}
	return null;
};
oFF.UiContextSpace.prototype.setNode = function(isNode)
{
	for (var i = 0; i < this.m_elements.size(); i++)
	{
		this.m_elements.get(i).setNode(isNode);
	}
	return this;
};
oFF.UiContextSpace.prototype.isNode = function()
{
	if (this.m_elements.size() > 0)
	{
		return this.m_elements.get(0).isNode();
	}
	return false;
};
oFF.UiContextSpace.prototype.size = function()
{
	if (this.m_elements.size() > 0)
	{
		return this.m_elements.get(0).size();
	}
	return 0;
};
oFF.UiContextSpace.prototype.getUiType = function()
{
	if (this.m_elements.size() > 0)
	{
		return this.m_elements.get(0).getUiType();
	}
	return null;
};
oFF.UiContextSpace.prototype.getUiStyleClass = function()
{
	if (this.m_elements.size() > 0)
	{
		return this.m_elements.get(0).getUiStyleClass();
	}
	return null;
};
oFF.UiContextSpace.prototype.setModelJson = function(model)
{
	for (var i = 0; i < this.m_elements.size(); i++)
	{
		this.m_elements.get(i).setModelJson(model);
	}
	return this;
};
oFF.UiContextSpace.prototype.getModelJson = function()
{
	if (this.m_elements.size() > 0)
	{
		return this.m_elements.get(0).getModelJson();
	}
	return null;
};
oFF.UiContextSpace.prototype.isOpen = function()
{
	if (this.m_elements.size() > 0)
	{
		return this.m_elements.get(0).isOpen();
	}
	return false;
};
oFF.UiContextSpace.prototype.isMaximized = function()
{
	if (this.m_elements.size() > 0)
	{
		return this.m_elements.get(0).isMaximized();
	}
	return false;
};
oFF.UiContextSpace.prototype.isHidden = function()
{
	if (this.m_elements.size() > 0)
	{
		return this.m_elements.get(0).isHidden();
	}
	return false;
};
oFF.UiContextSpace.prototype.getOffsetHeight = function()
{
	if (this.m_elements.size() > 0)
	{
		return this.m_elements.get(0).getOffsetHeight();
	}
	return 0;
};
oFF.UiContextSpace.prototype.getOffsetWidth = function()
{
	if (this.m_elements.size() > 0)
	{
		return this.m_elements.get(0).getOffsetWidth();
	}
	return 0;
};
oFF.UiContextSpace.prototype.getSelectedItem = function()
{
	if (this.m_elements.size() > 0)
	{
		return this.m_elements.get(0).getSelectedItem();
	}
	return null;
};
oFF.UiContextSpace.prototype.setSelectedItem = function(selectedItem)
{
	for (var i = 0; i < this.m_elements.size(); i++)
	{
		this.m_elements.get(i).setSelectedItem(selectedItem);
	}
	return this;
};
oFF.UiContextSpace.prototype.setSelectedItemByIndex = function(index)
{
	if (this.m_elements.size() > 0)
	{
		return this.m_elements.get(0).setSelectedItemByIndex(index);
	}
	return null;
};
oFF.UiContextSpace.prototype.getSelectedName = function()
{
	if (this.m_elements.size() > 0)
	{
		return this.m_elements.get(0).getSelectedName();
	}
	return null;
};
oFF.UiContextSpace.prototype.setSelectedName = function(selectedName)
{
	for (var i = 0; i < this.m_elements.size(); i++)
	{
		this.m_elements.get(i).setSelectedName(selectedName);
	}
	return this;
};
oFF.UiContextSpace.prototype.hasSelectedItems = function()
{
	if (this.m_elements.size() > 0)
	{
		return this.m_elements.get(0).hasSelectedItems();
	}
	return false;
};
oFF.UiContextSpace.prototype.getSelectedItemCount = function()
{
	if (this.m_elements.size() > 0)
	{
		return this.m_elements.get(0).getSelectedItemCount();
	}
	return 0;
};
oFF.UiContextSpace.prototype.getSelectedItems = function()
{
	if (this.m_elements.size() > 0)
	{
		return this.m_elements.get(0).getSelectedItems();
	}
	return null;
};
oFF.UiContextSpace.prototype.setSelectedItems = function(selectedItems)
{
	for (var i = 0; i < this.m_elements.size(); i++)
	{
		this.m_elements.get(i).setSelectedItems(selectedItems);
	}
	return this;
};
oFF.UiContextSpace.prototype.addSelectedItem = function(selectedItem)
{
	for (var i = 0; i < this.m_elements.size(); i++)
	{
		this.m_elements.get(i).addSelectedItem(selectedItem);
	}
	return this;
};
oFF.UiContextSpace.prototype.removeSelectedItem = function(selectedItem)
{
	for (var i = 0; i < this.m_elements.size(); i++)
	{
		this.m_elements.get(i).removeSelectedItem(selectedItem);
	}
	return this;
};
oFF.UiContextSpace.prototype.clearSelectedItems = function()
{
	for (var i = 0; i < this.m_elements.size(); i++)
	{
		this.m_elements.get(i).clearSelectedItems();
	}
	return this;
};
oFF.UiContextSpace.prototype.openAt = function(control)
{
	for (var i = 0; i < this.m_elements.size(); i++)
	{
		this.m_elements.get(i).openAt(control);
	}
	return this;
};
oFF.UiContextSpace.prototype.openAtPosition = function(posX, posY)
{
	for (var i = 0; i < this.m_elements.size(); i++)
	{
		this.m_elements.get(i).openAtPosition(posX, posY);
	}
	return this;
};
oFF.UiContextSpace.prototype.open = function()
{
	for (var i = 0; i < this.m_elements.size(); i++)
	{
		this.m_elements.get(i).open();
	}
	return this;
};
oFF.UiContextSpace.prototype.close = function()
{
	for (var i = 0; i < this.m_elements.size(); i++)
	{
		this.m_elements.get(i).close();
	}
	return this;
};
oFF.UiContextSpace.prototype.print = function(text)
{
	for (var i = 0; i < this.m_elements.size(); i++)
	{
		this.m_elements.get(i).print(text);
	}
};
oFF.UiContextSpace.prototype.println = function(text)
{
	for (var i = 0; i < this.m_elements.size(); i++)
	{
		this.m_elements.get(i).println(text);
	}
};
oFF.UiContextSpace.prototype.expandToLevel = function(level)
{
	for (var i = 0; i < this.m_elements.size(); i++)
	{
		this.m_elements.get(i).expandToLevel(level);
	}
	return this;
};
oFF.UiContextSpace.prototype.collapseAll = function()
{
	for (var i = 0; i < this.m_elements.size(); i++)
	{
		this.m_elements.get(i).collapseAll();
	}
	return this;
};
oFF.UiContextSpace.prototype.focus = function()
{
	for (var i = 0; i < this.m_elements.size(); i++)
	{
		this.m_elements.get(i).focus();
	}
	return this;
};
oFF.UiContextSpace.prototype.shake = function()
{
	for (var i = 0; i < this.m_elements.size(); i++)
	{
		this.m_elements.get(i).shake();
	}
	return this;
};
oFF.UiContextSpace.prototype.showSuggestions = function()
{
	for (var i = 0; i < this.m_elements.size(); i++)
	{
		this.m_elements.get(i).showSuggestions();
	}
	return this;
};
oFF.UiContextSpace.prototype.closeSuggestions = function()
{
	for (var i = 0; i < this.m_elements.size(); i++)
	{
		this.m_elements.get(i).closeSuggestions();
	}
	return this;
};
oFF.UiContextSpace.prototype.back = function()
{
	for (var i = 0; i < this.m_elements.size(); i++)
	{
		this.m_elements.get(i).back();
	}
	return this;
};
oFF.UiContextSpace.prototype.scrollTo = function(x, y, duration)
{
	for (var i = 0; i < this.m_elements.size(); i++)
	{
		this.m_elements.get(i).scrollTo(x, y, duration);
	}
	return this;
};
oFF.UiContextSpace.prototype.scrollToControl = function(control, duration)
{
	for (var i = 0; i < this.m_elements.size(); i++)
	{
		this.m_elements.get(i).scrollToControl(control, duration);
	}
	return this;
};
oFF.UiContextSpace.prototype.popToPage = function(page)
{
	for (var i = 0; i < this.m_elements.size(); i++)
	{
		this.m_elements.get(i).popToPage(page);
	}
	return this;
};
oFF.UiContextSpace.prototype.maximize = function(animated)
{
	for (var i = 0; i < this.m_elements.size(); i++)
	{
		this.m_elements.get(i).maximize(animated);
	}
	return this;
};
oFF.UiContextSpace.prototype.restore = function(animated)
{
	for (var i = 0; i < this.m_elements.size(); i++)
	{
		this.m_elements.get(i).restore(animated);
	}
	return this;
};
oFF.UiContextSpace.prototype.hide = function(animated, refControl)
{
	for (var i = 0; i < this.m_elements.size(); i++)
	{
		this.m_elements.get(i).hide(animated, refControl);
	}
	return this;
};
oFF.UiContextSpace.prototype.show = function(animated, refControl)
{
	for (var i = 0; i < this.m_elements.size(); i++)
	{
		this.m_elements.get(i).show(animated, refControl);
	}
	return this;
};
oFF.UiContextSpace.prototype.selectText = function(startIndex, endIndex)
{
	for (var i = 0; i < this.m_elements.size(); i++)
	{
		this.m_elements.get(i).selectText(startIndex, endIndex);
	}
	return this;
};
oFF.UiContextSpace.prototype.fullscreen = function()
{
	for (var i = 0; i < this.m_elements.size(); i++)
	{
		this.m_elements.get(i).fullscreen();
	}
	return this;
};
oFF.UiContextSpace.prototype.startReadLine = function(text, numOfChars)
{
	for (var i = 0; i < this.m_elements.size(); i++)
	{
		this.m_elements.get(i).startReadLine(text, numOfChars);
	}
	return this;
};
oFF.UiContextSpace.prototype.bringToFront = function()
{
	for (var i = 0; i < this.m_elements.size(); i++)
	{
		this.m_elements.get(i).bringToFront();
	}
	return this;
};
oFF.UiContextSpace.prototype.setFrame = function(x, y, width, height)
{
	for (var i = 0; i < this.m_elements.size(); i++)
	{
		this.m_elements.get(i).setFrame(x, y, width, height);
	}
};
oFF.UiContextSpace.prototype.setFrameCss = function(xCss, yCss, widthCss, heightCss)
{
	for (var i = 0; i < this.m_elements.size(); i++)
	{
		this.m_elements.get(i).setFrameCss(xCss, yCss, widthCss, heightCss);
	}
};
oFF.UiContextSpace.prototype.hasButtons = function()
{
	if (this.m_elements.size() > 0)
	{
		return this.m_elements.get(0).hasButtons();
	}
	return false;
};
oFF.UiContextSpace.prototype.getButtonCount = function()
{
	if (this.m_elements.size() > 0)
	{
		return this.m_elements.get(0).getButtonCount();
	}
	return 0;
};
oFF.UiContextSpace.prototype.getButton = function(index)
{
	if (this.m_elements.size() > 0)
	{
		return this.m_elements.get(0).getButton(index);
	}
	return null;
};
oFF.UiContextSpace.prototype.getIndexOfButton = function(button)
{
	if (this.m_elements.size() > 0)
	{
		return this.m_elements.get(0).getIndexOfButton(button);
	}
	return 0;
};
oFF.UiContextSpace.prototype.getButtonByName = function(name)
{
	if (this.m_elements.size() > 0)
	{
		return this.m_elements.get(0).getButtonByName(name);
	}
	return null;
};
oFF.UiContextSpace.prototype.getButtons = function()
{
	if (this.m_elements.size() > 0)
	{
		return this.m_elements.get(0).getButtons();
	}
	return null;
};
oFF.UiContextSpace.prototype.newButton = function()
{
	if (this.m_elements.size() > 0)
	{
		return this.m_elements.get(0).newButton();
	}
	return null;
};
oFF.UiContextSpace.prototype.addNewButton = function()
{
	if (this.m_elements.size() > 0)
	{
		return this.m_elements.get(0).addNewButton();
	}
	return null;
};
oFF.UiContextSpace.prototype.addAllButtons = function(buttonList)
{
	if (this.m_elements.size() > 0)
	{
		this.m_elements.get(0).addAllButtons(buttonList);
	}
	return this;
};
oFF.UiContextSpace.prototype.addButton = function(button)
{
	if (this.m_elements.size() > 0)
	{
		this.m_elements.get(0).addButton(button);
	}
	return this;
};
oFF.UiContextSpace.prototype.insertButton = function(button, index)
{
	if (this.m_elements.size() > 0)
	{
		this.m_elements.get(0).insertButton(button, index);
	}
	return this;
};
oFF.UiContextSpace.prototype.removeButton = function(button)
{
	if (this.m_elements.size() > 0)
	{
		return this.m_elements.get(0).removeButton(button);
	}
	return this;
};
oFF.UiContextSpace.prototype.clearButtons = function()
{
	for (var i = 0; i < this.m_elements.size(); i++)
	{
		this.m_elements.get(i).clearButtons();
	}
	return this;
};
oFF.UiContextSpace.prototype.hasDialogButtons = function()
{
	if (this.m_elements.size() > 0)
	{
		return this.m_elements.get(0).hasDialogButtons();
	}
	return false;
};
oFF.UiContextSpace.prototype.getDialogButtonCount = function()
{
	if (this.m_elements.size() > 0)
	{
		return this.m_elements.get(0).getDialogButtonCount();
	}
	return 0;
};
oFF.UiContextSpace.prototype.getDialogButton = function(index)
{
	if (this.m_elements.size() > 0)
	{
		return this.m_elements.get(0).getDialogButton(index);
	}
	return null;
};
oFF.UiContextSpace.prototype.getIndexOfDialogButton = function(dialogButton)
{
	if (this.m_elements.size() > 0)
	{
		return this.m_elements.get(0).getIndexOfDialogButton(dialogButton);
	}
	return 0;
};
oFF.UiContextSpace.prototype.getDialogButtonByName = function(name)
{
	if (this.m_elements.size() > 0)
	{
		return this.m_elements.get(0).getDialogButtonByName(name);
	}
	return null;
};
oFF.UiContextSpace.prototype.getDialogButtons = function()
{
	if (this.m_elements.size() > 0)
	{
		return this.m_elements.get(0).getDialogButtons();
	}
	return null;
};
oFF.UiContextSpace.prototype.newDialogButton = function()
{
	if (this.m_elements.size() > 0)
	{
		return this.m_elements.get(0).newDialogButton();
	}
	return null;
};
oFF.UiContextSpace.prototype.addNewDialogButton = function()
{
	if (this.m_elements.size() > 0)
	{
		return this.m_elements.get(0).addNewDialogButton();
	}
	return null;
};
oFF.UiContextSpace.prototype.addAllDialogButtons = function(dialogButtonList)
{
	if (this.m_elements.size() > 0)
	{
		this.m_elements.get(0).addAllDialogButtons(dialogButtonList);
	}
	return this;
};
oFF.UiContextSpace.prototype.addDialogButton = function(dialogButton)
{
	if (this.m_elements.size() > 0)
	{
		this.m_elements.get(0).addDialogButton(dialogButton);
	}
	return this;
};
oFF.UiContextSpace.prototype.insertDialogButton = function(dialogButton, index)
{
	if (this.m_elements.size() > 0)
	{
		this.m_elements.get(0).insertDialogButton(dialogButton, index);
	}
	return this;
};
oFF.UiContextSpace.prototype.removeDialogButton = function(dialogButton)
{
	if (this.m_elements.size() > 0)
	{
		return this.m_elements.get(0).removeDialogButton(dialogButton);
	}
	return this;
};
oFF.UiContextSpace.prototype.clearDialogButtons = function()
{
	for (var i = 0; i < this.m_elements.size(); i++)
	{
		this.m_elements.get(i).clearDialogButtons();
	}
	return this;
};
oFF.UiContextSpace.prototype.hasPageButtons = function()
{
	if (this.m_elements.size() > 0)
	{
		return this.m_elements.get(0).hasPageButtons();
	}
	return false;
};
oFF.UiContextSpace.prototype.getPageButtonCount = function()
{
	if (this.m_elements.size() > 0)
	{
		return this.m_elements.get(0).getPageButtonCount();
	}
	return 0;
};
oFF.UiContextSpace.prototype.getPageButton = function(index)
{
	if (this.m_elements.size() > 0)
	{
		return this.m_elements.get(0).getPageButton(index);
	}
	return null;
};
oFF.UiContextSpace.prototype.getIndexOfPageButton = function(pageButton)
{
	if (this.m_elements.size() > 0)
	{
		return this.m_elements.get(0).getIndexOfPageButton(pageButton);
	}
	return 0;
};
oFF.UiContextSpace.prototype.getPageButtonByName = function(name)
{
	if (this.m_elements.size() > 0)
	{
		return this.m_elements.get(0).getPageButtonByName(name);
	}
	return null;
};
oFF.UiContextSpace.prototype.getPageButtons = function()
{
	if (this.m_elements.size() > 0)
	{
		return this.m_elements.get(0).getPageButtons();
	}
	return null;
};
oFF.UiContextSpace.prototype.newPageButton = function()
{
	if (this.m_elements.size() > 0)
	{
		return this.m_elements.get(0).newPageButton();
	}
	return null;
};
oFF.UiContextSpace.prototype.addNewPageButton = function()
{
	if (this.m_elements.size() > 0)
	{
		return this.m_elements.get(0).addNewPageButton();
	}
	return null;
};
oFF.UiContextSpace.prototype.addAllPageButtons = function(pageButtonList)
{
	if (this.m_elements.size() > 0)
	{
		this.m_elements.get(0).addAllPageButtons(pageButtonList);
	}
	return this;
};
oFF.UiContextSpace.prototype.addPageButton = function(pageButton)
{
	if (this.m_elements.size() > 0)
	{
		this.m_elements.get(0).addPageButton(pageButton);
	}
	return this;
};
oFF.UiContextSpace.prototype.insertPageButton = function(pageButton, index)
{
	if (this.m_elements.size() > 0)
	{
		this.m_elements.get(0).insertPageButton(pageButton, index);
	}
	return this;
};
oFF.UiContextSpace.prototype.removePageButton = function(pageButton)
{
	if (this.m_elements.size() > 0)
	{
		return this.m_elements.get(0).removePageButton(pageButton);
	}
	return this;
};
oFF.UiContextSpace.prototype.clearPageButtons = function()
{
	for (var i = 0; i < this.m_elements.size(); i++)
	{
		this.m_elements.get(i).clearPageButtons();
	}
	return this;
};
oFF.UiContextSpace.prototype.hasSuggestions = function()
{
	if (this.m_elements.size() > 0)
	{
		return this.m_elements.get(0).hasSuggestions();
	}
	return false;
};
oFF.UiContextSpace.prototype.getSuggestionCount = function()
{
	if (this.m_elements.size() > 0)
	{
		return this.m_elements.get(0).getSuggestionCount();
	}
	return 0;
};
oFF.UiContextSpace.prototype.getSuggestion = function(index)
{
	if (this.m_elements.size() > 0)
	{
		return this.m_elements.get(0).getSuggestion(index);
	}
	return null;
};
oFF.UiContextSpace.prototype.getIndexOfSuggestion = function(suggestionItem)
{
	if (this.m_elements.size() > 0)
	{
		return this.m_elements.get(0).getIndexOfSuggestion(suggestionItem);
	}
	return 0;
};
oFF.UiContextSpace.prototype.getSuggestionByName = function(name)
{
	if (this.m_elements.size() > 0)
	{
		return this.m_elements.get(0).getSuggestionByName(name);
	}
	return null;
};
oFF.UiContextSpace.prototype.getSuggestions = function()
{
	if (this.m_elements.size() > 0)
	{
		return this.m_elements.get(0).getSuggestions();
	}
	return null;
};
oFF.UiContextSpace.prototype.newSuggestion = function()
{
	if (this.m_elements.size() > 0)
	{
		return this.m_elements.get(0).newSuggestion();
	}
	return null;
};
oFF.UiContextSpace.prototype.addNewSuggestion = function()
{
	if (this.m_elements.size() > 0)
	{
		return this.m_elements.get(0).addNewSuggestion();
	}
	return null;
};
oFF.UiContextSpace.prototype.addAllSuggestions = function(suggestionList)
{
	if (this.m_elements.size() > 0)
	{
		this.m_elements.get(0).addAllSuggestions(suggestionList);
	}
	return this;
};
oFF.UiContextSpace.prototype.addSuggestion = function(suggestionItem)
{
	if (this.m_elements.size() > 0)
	{
		this.m_elements.get(0).addSuggestion(suggestionItem);
	}
	return this;
};
oFF.UiContextSpace.prototype.insertSuggestion = function(suggestionItem, index)
{
	if (this.m_elements.size() > 0)
	{
		this.m_elements.get(0).insertSuggestion(suggestionItem, index);
	}
	return this;
};
oFF.UiContextSpace.prototype.removeSuggestion = function(suggestionItem)
{
	if (this.m_elements.size() > 0)
	{
		return this.m_elements.get(0).removeSuggestion(suggestionItem);
	}
	return this;
};
oFF.UiContextSpace.prototype.clearSuggestions = function()
{
	for (var i = 0; i < this.m_elements.size(); i++)
	{
		this.m_elements.get(i).clearSuggestions();
	}
	return this;
};
oFF.UiContextSpace.prototype.hasColumns = function()
{
	if (this.m_elements.size() > 0)
	{
		return this.m_elements.get(0).hasColumns();
	}
	return false;
};
oFF.UiContextSpace.prototype.numberOfColumns = function()
{
	if (this.m_elements.size() > 0)
	{
		return this.m_elements.get(0).numberOfColumns();
	}
	return 0;
};
oFF.UiContextSpace.prototype.getColumn = function(index)
{
	if (this.m_elements.size() > 0)
	{
		return this.m_elements.get(0).getColumn(index);
	}
	return null;
};
oFF.UiContextSpace.prototype.getIndexOfColumn = function(column)
{
	if (this.m_elements.size() > 0)
	{
		return this.m_elements.get(0).getIndexOfColumn(column);
	}
	return 0;
};
oFF.UiContextSpace.prototype.getColumnByName = function(name)
{
	if (this.m_elements.size() > 0)
	{
		return this.m_elements.get(0).getColumnByName(name);
	}
	return null;
};
oFF.UiContextSpace.prototype.getColumns = function()
{
	if (this.m_elements.size() > 0)
	{
		return this.m_elements.get(0).getColumns();
	}
	return null;
};
oFF.UiContextSpace.prototype.newColumn = function()
{
	if (this.m_elements.size() > 0)
	{
		return this.m_elements.get(0).newColumn();
	}
	return null;
};
oFF.UiContextSpace.prototype.addNewColumn = function()
{
	if (this.m_elements.size() > 0)
	{
		return this.m_elements.get(0).addNewColumn();
	}
	return null;
};
oFF.UiContextSpace.prototype.addAllColumns = function(columnList)
{
	if (this.m_elements.size() > 0)
	{
		this.m_elements.get(0).addAllColumns(columnList);
	}
	return this;
};
oFF.UiContextSpace.prototype.addColumn = function(column)
{
	if (this.m_elements.size() > 0)
	{
		this.m_elements.get(0).addColumn(column);
	}
	return this;
};
oFF.UiContextSpace.prototype.insertColumn = function(column, index)
{
	if (this.m_elements.size() > 0)
	{
		this.m_elements.get(0).insertColumn(column, index);
	}
	return this;
};
oFF.UiContextSpace.prototype.removeColumn = function(column)
{
	if (this.m_elements.size() > 0)
	{
		return this.m_elements.get(0).removeColumn(column);
	}
	return this;
};
oFF.UiContextSpace.prototype.clearColumns = function()
{
	for (var i = 0; i < this.m_elements.size(); i++)
	{
		this.m_elements.get(i).clearColumns();
	}
	return this;
};
oFF.UiContextSpace.prototype.hasRows = function()
{
	if (this.m_elements.size() > 0)
	{
		return this.m_elements.get(0).hasRows();
	}
	return false;
};
oFF.UiContextSpace.prototype.numberOfRows = function()
{
	if (this.m_elements.size() > 0)
	{
		return this.m_elements.get(0).numberOfRows();
	}
	return 0;
};
oFF.UiContextSpace.prototype.getRow = function(index)
{
	if (this.m_elements.size() > 0)
	{
		return this.m_elements.get(0).getRow(index);
	}
	return null;
};
oFF.UiContextSpace.prototype.getIndexOfRow = function(row)
{
	if (this.m_elements.size() > 0)
	{
		return this.m_elements.get(0).getIndexOfRow(row);
	}
	return 0;
};
oFF.UiContextSpace.prototype.getRowByName = function(name)
{
	if (this.m_elements.size() > 0)
	{
		return this.m_elements.get(0).getRowByName(name);
	}
	return null;
};
oFF.UiContextSpace.prototype.getRows = function()
{
	if (this.m_elements.size() > 0)
	{
		return this.m_elements.get(0).getRows();
	}
	return null;
};
oFF.UiContextSpace.prototype.newRow = function()
{
	if (this.m_elements.size() > 0)
	{
		return this.m_elements.get(0).newRow();
	}
	return null;
};
oFF.UiContextSpace.prototype.addNewRow = function()
{
	if (this.m_elements.size() > 0)
	{
		return this.m_elements.get(0).addNewRow();
	}
	return null;
};
oFF.UiContextSpace.prototype.addAllRows = function(rowList)
{
	if (this.m_elements.size() > 0)
	{
		this.m_elements.get(0).addAllRows(rowList);
	}
	return this;
};
oFF.UiContextSpace.prototype.addRow = function(row)
{
	if (this.m_elements.size() > 0)
	{
		this.m_elements.get(0).addRow(row);
	}
	return this;
};
oFF.UiContextSpace.prototype.insertRow = function(row, index)
{
	if (this.m_elements.size() > 0)
	{
		this.m_elements.get(0).insertRow(row, index);
	}
	return this;
};
oFF.UiContextSpace.prototype.removeRow = function(row)
{
	if (this.m_elements.size() > 0)
	{
		return this.m_elements.get(0).removeRow(row);
	}
	return this;
};
oFF.UiContextSpace.prototype.clearRows = function()
{
	for (var i = 0; i < this.m_elements.size(); i++)
	{
		this.m_elements.get(i).clearRows();
	}
	return this;
};
oFF.UiContextSpace.prototype.hasCells = function()
{
	if (this.m_elements.size() > 0)
	{
		return this.m_elements.get(0).hasCells();
	}
	return false;
};
oFF.UiContextSpace.prototype.numberOfCells = function()
{
	if (this.m_elements.size() > 0)
	{
		return this.m_elements.get(0).numberOfCells();
	}
	return 0;
};
oFF.UiContextSpace.prototype.getCell = function(index)
{
	if (this.m_elements.size() > 0)
	{
		return this.m_elements.get(0).getCell(index);
	}
	return null;
};
oFF.UiContextSpace.prototype.getIndexOfCell = function(cell)
{
	if (this.m_elements.size() > 0)
	{
		return this.m_elements.get(0).getIndexOfCell(cell);
	}
	return 0;
};
oFF.UiContextSpace.prototype.getCellByName = function(name)
{
	if (this.m_elements.size() > 0)
	{
		return this.m_elements.get(0).getCellByName(name);
	}
	return null;
};
oFF.UiContextSpace.prototype.getCells = function()
{
	if (this.m_elements.size() > 0)
	{
		return this.m_elements.get(0).getCells();
	}
	return null;
};
oFF.UiContextSpace.prototype.newCell = function()
{
	if (this.m_elements.size() > 0)
	{
		return this.m_elements.get(0).newCell();
	}
	return null;
};
oFF.UiContextSpace.prototype.addNewCell = function()
{
	if (this.m_elements.size() > 0)
	{
		return this.m_elements.get(0).addNewCell();
	}
	return null;
};
oFF.UiContextSpace.prototype.addAllCells = function(cellList)
{
	if (this.m_elements.size() > 0)
	{
		this.m_elements.get(0).addAllCells(cellList);
	}
	return this;
};
oFF.UiContextSpace.prototype.addCell = function(cell)
{
	if (this.m_elements.size() > 0)
	{
		this.m_elements.get(0).addCell(cell);
	}
	return this;
};
oFF.UiContextSpace.prototype.insertCell = function(cell, index)
{
	if (this.m_elements.size() > 0)
	{
		this.m_elements.get(0).insertCell(cell, index);
	}
	return this;
};
oFF.UiContextSpace.prototype.removeCell = function(cell)
{
	if (this.m_elements.size() > 0)
	{
		return this.m_elements.get(0).removeCell(cell);
	}
	return this;
};
oFF.UiContextSpace.prototype.clearCells = function()
{
	for (var i = 0; i < this.m_elements.size(); i++)
	{
		this.m_elements.get(i).clearCells();
	}
	return this;
};
oFF.UiContextSpace.prototype.hasEndIcons = function()
{
	if (this.m_elements.size() > 0)
	{
		return this.m_elements.get(0).hasEndIcons();
	}
	return false;
};
oFF.UiContextSpace.prototype.getEndIconCount = function()
{
	if (this.m_elements.size() > 0)
	{
		return this.m_elements.get(0).getEndIconCount();
	}
	return 0;
};
oFF.UiContextSpace.prototype.getEndIcon = function(index)
{
	if (this.m_elements.size() > 0)
	{
		return this.m_elements.get(0).getEndIcon(index);
	}
	return null;
};
oFF.UiContextSpace.prototype.getIndexOfEndIcon = function(endIcon)
{
	if (this.m_elements.size() > 0)
	{
		return this.m_elements.get(0).getIndexOfEndIcon(endIcon);
	}
	return 0;
};
oFF.UiContextSpace.prototype.getEndIconByName = function(name)
{
	if (this.m_elements.size() > 0)
	{
		return this.m_elements.get(0).getEndIconByName(name);
	}
	return null;
};
oFF.UiContextSpace.prototype.getEndIcons = function()
{
	if (this.m_elements.size() > 0)
	{
		return this.m_elements.get(0).getEndIcons();
	}
	return null;
};
oFF.UiContextSpace.prototype.newEndIcon = function()
{
	if (this.m_elements.size() > 0)
	{
		return this.m_elements.get(0).newEndIcon();
	}
	return null;
};
oFF.UiContextSpace.prototype.addNewEndIcon = function()
{
	if (this.m_elements.size() > 0)
	{
		return this.m_elements.get(0).addNewEndIcon();
	}
	return null;
};
oFF.UiContextSpace.prototype.addAllEndIcons = function(endIconList)
{
	if (this.m_elements.size() > 0)
	{
		this.m_elements.get(0).addAllEndIcons(endIconList);
	}
	return this;
};
oFF.UiContextSpace.prototype.addEndIcon = function(endIcon)
{
	if (this.m_elements.size() > 0)
	{
		this.m_elements.get(0).addEndIcon(endIcon);
	}
	return this;
};
oFF.UiContextSpace.prototype.insertEndIcon = function(endIcon, index)
{
	if (this.m_elements.size() > 0)
	{
		this.m_elements.get(0).insertEndIcon(endIcon, index);
	}
	return this;
};
oFF.UiContextSpace.prototype.removeEndIcon = function(endIcon)
{
	if (this.m_elements.size() > 0)
	{
		return this.m_elements.get(0).removeEndIcon(endIcon);
	}
	return this;
};
oFF.UiContextSpace.prototype.clearEndIcons = function()
{
	for (var i = 0; i < this.m_elements.size(); i++)
	{
		this.m_elements.get(i).clearEndIcons();
	}
	return this;
};
oFF.UiContextSpace.prototype.hasTreeTableRows = function()
{
	if (this.m_elements.size() > 0)
	{
		return this.m_elements.get(0).hasTreeTableRows();
	}
	return false;
};
oFF.UiContextSpace.prototype.numberOfTreeTableRows = function()
{
	if (this.m_elements.size() > 0)
	{
		return this.m_elements.get(0).numberOfTreeTableRows();
	}
	return 0;
};
oFF.UiContextSpace.prototype.getTreeTableRow = function(index)
{
	if (this.m_elements.size() > 0)
	{
		return this.m_elements.get(0).getTreeTableRow(index);
	}
	return null;
};
oFF.UiContextSpace.prototype.getIndexOfTreeTableRow = function(treeTableRow)
{
	if (this.m_elements.size() > 0)
	{
		return this.m_elements.get(0).getIndexOfTreeTableRow(treeTableRow);
	}
	return 0;
};
oFF.UiContextSpace.prototype.getTreeTableRowByName = function(name)
{
	if (this.m_elements.size() > 0)
	{
		return this.m_elements.get(0).getTreeTableRowByName(name);
	}
	return null;
};
oFF.UiContextSpace.prototype.getTreeTableRows = function()
{
	if (this.m_elements.size() > 0)
	{
		return this.m_elements.get(0).getTreeTableRows();
	}
	return null;
};
oFF.UiContextSpace.prototype.getOnlyChildTreeTableRows = function()
{
	if (this.m_elements.size() > 0)
	{
		return this.m_elements.get(0).getOnlyChildTreeTableRows();
	}
	return null;
};
oFF.UiContextSpace.prototype.newTreeTableRow = function()
{
	if (this.m_elements.size() > 0)
	{
		return this.m_elements.get(0).newTreeTableRow();
	}
	return null;
};
oFF.UiContextSpace.prototype.addNewTreeTableRow = function()
{
	if (this.m_elements.size() > 0)
	{
		return this.m_elements.get(0).addNewTreeTableRow();
	}
	return null;
};
oFF.UiContextSpace.prototype.addAllTreeTableRows = function(treeTableRowList)
{
	if (this.m_elements.size() > 0)
	{
		this.m_elements.get(0).addAllTreeTableRows(treeTableRowList);
	}
	return this;
};
oFF.UiContextSpace.prototype.addTreeTableRow = function(treeTableRow)
{
	if (this.m_elements.size() > 0)
	{
		this.m_elements.get(0).addTreeTableRow(treeTableRow);
	}
	return this;
};
oFF.UiContextSpace.prototype.insertTreeTableRow = function(treeTableRow, index)
{
	if (this.m_elements.size() > 0)
	{
		this.m_elements.get(0).insertTreeTableRow(treeTableRow, index);
	}
	return this;
};
oFF.UiContextSpace.prototype.removeTreeTableRow = function(treeTableRow)
{
	if (this.m_elements.size() > 0)
	{
		return this.m_elements.get(0).removeTreeTableRow(treeTableRow);
	}
	return this;
};
oFF.UiContextSpace.prototype.clearTreeTableRows = function()
{
	for (var i = 0; i < this.m_elements.size(); i++)
	{
		this.m_elements.get(i).clearTreeTableRows();
	}
	return this;
};
oFF.UiContextSpace.prototype.hasItems = function()
{
	if (this.m_elements.size() > 0)
	{
		return this.m_elements.get(0).hasItems();
	}
	return false;
};
oFF.UiContextSpace.prototype.getItemCount = function()
{
	if (this.m_elements.size() > 0)
	{
		return this.m_elements.get(0).getItemCount();
	}
	return 0;
};
oFF.UiContextSpace.prototype.getItem = function(index)
{
	if (this.m_elements.size() > 0)
	{
		return this.m_elements.get(0).getItem(index);
	}
	return null;
};
oFF.UiContextSpace.prototype.getIndexOfItem = function(item)
{
	if (this.m_elements.size() > 0)
	{
		return this.m_elements.get(0).getIndexOfItem(item);
	}
	return 0;
};
oFF.UiContextSpace.prototype.getItemByName = function(name)
{
	if (this.m_elements.size() > 0)
	{
		return this.m_elements.get(0).getItemByName(name);
	}
	return null;
};
oFF.UiContextSpace.prototype.getItemById = function(itemId)
{
	if (this.m_elements.size() > 0)
	{
		return this.m_elements.get(0).getItemById(itemId);
	}
	return null;
};
oFF.UiContextSpace.prototype.getItems = function()
{
	if (this.m_elements.size() > 0)
	{
		return this.m_elements.get(0).getItems();
	}
	return null;
};
oFF.UiContextSpace.prototype.newItemOfType = function(itemType)
{
	if (this.m_elements.size() > 0)
	{
		return this.m_elements.get(0).newItemOfType(itemType);
	}
	return null;
};
oFF.UiContextSpace.prototype.addNewItemOfType = function(itemType)
{
	if (this.m_elements.size() > 0)
	{
		return this.m_elements.get(0).addNewItemOfType(itemType);
	}
	return null;
};
oFF.UiContextSpace.prototype.insertNewItemOfType = function(itemType, index)
{
	if (this.m_elements.size() > 0)
	{
		return this.m_elements.get(0).insertNewItemOfType(itemType, index);
	}
	return null;
};
oFF.UiContextSpace.prototype.addAllItems = function(itemList)
{
	if (this.m_elements.size() > 0)
	{
		this.m_elements.get(0).addAllItems(itemList);
	}
	return this;
};
oFF.UiContextSpace.prototype.addItem = function(item)
{
	if (this.m_elements.size() > 0)
	{
		this.m_elements.get(0).addItem(item);
	}
	return this;
};
oFF.UiContextSpace.prototype.insertItem = function(item, index)
{
	if (this.m_elements.size() > 0)
	{
		this.m_elements.get(0).insertItem(item, index);
	}
	return this;
};
oFF.UiContextSpace.prototype.removeItem = function(item)
{
	if (this.m_elements.size() > 0)
	{
		return this.m_elements.get(0).removeItem(item);
	}
	return this;
};
oFF.UiContextSpace.prototype.clearItems = function()
{
	for (var i = 0; i < this.m_elements.size(); i++)
	{
		this.m_elements.get(i).clearItems();
	}
	return this;
};
oFF.UiContextSpace.prototype.hasRadioButtons = function()
{
	if (this.m_elements.size() > 0)
	{
		return this.m_elements.get(0).hasRadioButtons();
	}
	return false;
};
oFF.UiContextSpace.prototype.getRadioButtonCount = function()
{
	if (this.m_elements.size() > 0)
	{
		return this.m_elements.get(0).getRadioButtonCount();
	}
	return 0;
};
oFF.UiContextSpace.prototype.getRadioButton = function(index)
{
	if (this.m_elements.size() > 0)
	{
		return this.m_elements.get(0).getRadioButton(index);
	}
	return null;
};
oFF.UiContextSpace.prototype.getIndexOfRadioButton = function(radioButton)
{
	if (this.m_elements.size() > 0)
	{
		return this.m_elements.get(0).getIndexOfRadioButton(radioButton);
	}
	return 0;
};
oFF.UiContextSpace.prototype.getRadioButtonByName = function(name)
{
	if (this.m_elements.size() > 0)
	{
		return this.m_elements.get(0).getRadioButtonByName(name);
	}
	return null;
};
oFF.UiContextSpace.prototype.getRadioButtons = function()
{
	if (this.m_elements.size() > 0)
	{
		return this.m_elements.get(0).getRadioButtons();
	}
	return null;
};
oFF.UiContextSpace.prototype.newRadioButton = function()
{
	if (this.m_elements.size() > 0)
	{
		return this.m_elements.get(0).newRadioButton();
	}
	return null;
};
oFF.UiContextSpace.prototype.addNewRadioButton = function()
{
	if (this.m_elements.size() > 0)
	{
		return this.m_elements.get(0).addNewRadioButton();
	}
	return null;
};
oFF.UiContextSpace.prototype.addAllRadioButtons = function(radioButtonList)
{
	if (this.m_elements.size() > 0)
	{
		this.m_elements.get(0).addAllRadioButtons(radioButtonList);
	}
	return this;
};
oFF.UiContextSpace.prototype.addRadioButton = function(radioButton)
{
	if (this.m_elements.size() > 0)
	{
		this.m_elements.get(0).addRadioButton(radioButton);
	}
	return this;
};
oFF.UiContextSpace.prototype.insertRadioButton = function(radioButton, index)
{
	if (this.m_elements.size() > 0)
	{
		this.m_elements.get(0).insertRadioButton(radioButton, index);
	}
	return this;
};
oFF.UiContextSpace.prototype.removeRadioButton = function(radioButton)
{
	if (this.m_elements.size() > 0)
	{
		return this.m_elements.get(0).removeRadioButton(radioButton);
	}
	return this;
};
oFF.UiContextSpace.prototype.clearRadioButtons = function()
{
	for (var i = 0; i < this.m_elements.size(); i++)
	{
		this.m_elements.get(i).clearRadioButtons();
	}
	return this;
};
oFF.UiContextSpace.prototype.hasMatrixLayoutCells = function()
{
	if (this.m_elements.size() > 0)
	{
		return this.m_elements.get(0).hasMatrixLayoutCells();
	}
	return false;
};
oFF.UiContextSpace.prototype.getMatrixLayoutCellCount = function()
{
	if (this.m_elements.size() > 0)
	{
		return this.m_elements.get(0).getMatrixLayoutCellCount();
	}
	return 0;
};
oFF.UiContextSpace.prototype.getMatrixLayoutCell = function(index)
{
	if (this.m_elements.size() > 0)
	{
		return this.m_elements.get(0).getMatrixLayoutCell(index);
	}
	return null;
};
oFF.UiContextSpace.prototype.getIndexOfMatrixLayoutCell = function(matrixLayoutCell)
{
	if (this.m_elements.size() > 0)
	{
		return this.m_elements.get(0).getIndexOfMatrixLayoutCell(matrixLayoutCell);
	}
	return 0;
};
oFF.UiContextSpace.prototype.getMatrixLayoutCellByName = function(name)
{
	if (this.m_elements.size() > 0)
	{
		return this.m_elements.get(0).getMatrixLayoutCellByName(name);
	}
	return null;
};
oFF.UiContextSpace.prototype.getMatrixLayoutCells = function()
{
	if (this.m_elements.size() > 0)
	{
		return this.m_elements.get(0).getMatrixLayoutCells();
	}
	return null;
};
oFF.UiContextSpace.prototype.newMatrixLayoutCell = function()
{
	if (this.m_elements.size() > 0)
	{
		return this.m_elements.get(0).newMatrixLayoutCell();
	}
	return null;
};
oFF.UiContextSpace.prototype.addNewMatrixLayoutCell = function()
{
	if (this.m_elements.size() > 0)
	{
		return this.m_elements.get(0).addNewMatrixLayoutCell();
	}
	return null;
};
oFF.UiContextSpace.prototype.addAllMatrixLayoutCells = function(matrixLayoutCellList)
{
	if (this.m_elements.size() > 0)
	{
		this.m_elements.get(0).addAllMatrixLayoutCells(matrixLayoutCellList);
	}
	return this;
};
oFF.UiContextSpace.prototype.addMatrixLayoutCell = function(matrixLayoutCell)
{
	if (this.m_elements.size() > 0)
	{
		this.m_elements.get(0).addMatrixLayoutCell(matrixLayoutCell);
	}
	return this;
};
oFF.UiContextSpace.prototype.insertMatrixLayoutCell = function(matrixLayoutCell, index)
{
	if (this.m_elements.size() > 0)
	{
		this.m_elements.get(0).insertMatrixLayoutCell(matrixLayoutCell, index);
	}
	return this;
};
oFF.UiContextSpace.prototype.removeMatrixLayoutCell = function(matrixLayoutCell)
{
	if (this.m_elements.size() > 0)
	{
		return this.m_elements.get(0).removeMatrixLayoutCell(matrixLayoutCell);
	}
	return this;
};
oFF.UiContextSpace.prototype.clearMatrixLayoutCells = function()
{
	for (var i = 0; i < this.m_elements.size(); i++)
	{
		this.m_elements.get(i).clearMatrixLayoutCells();
	}
	return this;
};
oFF.UiContextSpace.prototype.hasMatrixLayoutRows = function()
{
	if (this.m_elements.size() > 0)
	{
		return this.m_elements.get(0).hasMatrixLayoutRows();
	}
	return false;
};
oFF.UiContextSpace.prototype.getMatrixLayoutRowCount = function()
{
	if (this.m_elements.size() > 0)
	{
		return this.m_elements.get(0).getMatrixLayoutRowCount();
	}
	return 0;
};
oFF.UiContextSpace.prototype.getMatrixLayoutRow = function(index)
{
	if (this.m_elements.size() > 0)
	{
		return this.m_elements.get(0).getMatrixLayoutRow(index);
	}
	return null;
};
oFF.UiContextSpace.prototype.getIndexOfMatrixLayoutRow = function(matrixLayoutRow)
{
	if (this.m_elements.size() > 0)
	{
		return this.m_elements.get(0).getIndexOfMatrixLayoutRow(matrixLayoutRow);
	}
	return 0;
};
oFF.UiContextSpace.prototype.getMatrixLayoutRowByName = function(name)
{
	if (this.m_elements.size() > 0)
	{
		return this.m_elements.get(0).getMatrixLayoutRowByName(name);
	}
	return null;
};
oFF.UiContextSpace.prototype.getMatrixLayoutRows = function()
{
	if (this.m_elements.size() > 0)
	{
		return this.m_elements.get(0).getMatrixLayoutRows();
	}
	return null;
};
oFF.UiContextSpace.prototype.newMatrixLayoutRow = function()
{
	if (this.m_elements.size() > 0)
	{
		return this.m_elements.get(0).newMatrixLayoutRow();
	}
	return null;
};
oFF.UiContextSpace.prototype.addNewMatrixLayoutRow = function()
{
	if (this.m_elements.size() > 0)
	{
		return this.m_elements.get(0).addNewMatrixLayoutRow();
	}
	return null;
};
oFF.UiContextSpace.prototype.addAllMatrixLayoutRows = function(matrixLayoutRowList)
{
	if (this.m_elements.size() > 0)
	{
		this.m_elements.get(0).addAllMatrixLayoutRows(matrixLayoutRowList);
	}
	return this;
};
oFF.UiContextSpace.prototype.addMatrixLayoutRow = function(matrixLayoutRow)
{
	for (var i = 0; i < this.m_elements.size(); i++)
	{
		this.m_elements.get(i).addMatrixLayoutRow(matrixLayoutRow);
	}
	return this;
};
oFF.UiContextSpace.prototype.insertMatrixLayoutRow = function(matrixLayoutRow, index)
{
	if (this.m_elements.size() > 0)
	{
		this.m_elements.get(0).insertMatrixLayoutRow(matrixLayoutRow, index);
	}
	return this;
};
oFF.UiContextSpace.prototype.removeMatrixLayoutRow = function(matrixLayoutRow)
{
	for (var i = 0; i < this.m_elements.size(); i++)
	{
		this.m_elements.get(i).removeMatrixLayoutRow(matrixLayoutRow);
	}
	return this;
};
oFF.UiContextSpace.prototype.clearMatrixLayoutRows = function()
{
	for (var i = 0; i < this.m_elements.size(); i++)
	{
		this.m_elements.get(i).clearMatrixLayoutRows();
	}
	return this;
};
oFF.UiContextSpace.prototype.hasResponsiveTableColumns = function()
{
	if (this.m_elements.size() > 0)
	{
		return this.m_elements.get(0).hasResponsiveTableColumns();
	}
	return false;
};
oFF.UiContextSpace.prototype.numberOfResponsiveTableColumns = function()
{
	if (this.m_elements.size() > 0)
	{
		return this.m_elements.get(0).numberOfResponsiveTableColumns();
	}
	return 0;
};
oFF.UiContextSpace.prototype.getResponsiveTableColumn = function(index)
{
	if (this.m_elements.size() > 0)
	{
		return this.m_elements.get(0).getResponsiveTableColumn(index);
	}
	return null;
};
oFF.UiContextSpace.prototype.getIndexOfResponsiveTableColumn = function(column)
{
	if (this.m_elements.size() > 0)
	{
		return this.m_elements.get(0).getIndexOfResponsiveTableColumn(column);
	}
	return 0;
};
oFF.UiContextSpace.prototype.getResponsiveTableColumnByName = function(name)
{
	if (this.m_elements.size() > 0)
	{
		return this.m_elements.get(0).getResponsiveTableColumnByName(name);
	}
	return null;
};
oFF.UiContextSpace.prototype.getResponsiveTableColumns = function()
{
	if (this.m_elements.size() > 0)
	{
		return this.m_elements.get(0).getResponsiveTableColumns();
	}
	return null;
};
oFF.UiContextSpace.prototype.newResponsiveTableColumn = function()
{
	if (this.m_elements.size() > 0)
	{
		return this.m_elements.get(0).newResponsiveTableColumn();
	}
	return null;
};
oFF.UiContextSpace.prototype.addNewResponsiveTableColumn = function()
{
	if (this.m_elements.size() > 0)
	{
		return this.m_elements.get(0).addNewResponsiveTableColumn();
	}
	return null;
};
oFF.UiContextSpace.prototype.addAllResponsiveTableColumns = function(columnList)
{
	for (var i = 0; i < this.m_elements.size(); i++)
	{
		this.m_elements.get(i).addAllResponsiveTableColumns(columnList);
	}
	return this;
};
oFF.UiContextSpace.prototype.addResponsiveTableColumn = function(column)
{
	for (var i = 0; i < this.m_elements.size(); i++)
	{
		this.m_elements.get(i).addResponsiveTableColumn(column);
	}
	return this;
};
oFF.UiContextSpace.prototype.insertResponsiveTableColumn = function(column, index)
{
	if (this.m_elements.size() > 0)
	{
		this.m_elements.get(0).insertResponsiveTableColumn(column, index);
	}
	return this;
};
oFF.UiContextSpace.prototype.removeResponsiveTableColumn = function(column)
{
	for (var i = 0; i < this.m_elements.size(); i++)
	{
		this.m_elements.get(i).removeResponsiveTableColumn(column);
	}
	return this;
};
oFF.UiContextSpace.prototype.clearResponsiveTableColumns = function()
{
	for (var i = 0; i < this.m_elements.size(); i++)
	{
		this.m_elements.get(i).clearResponsiveTableColumns();
	}
	return this;
};
oFF.UiContextSpace.prototype.hasResponsiveTableRows = function()
{
	if (this.m_elements.size() > 0)
	{
		return this.m_elements.get(0).hasResponsiveTableRows();
	}
	return false;
};
oFF.UiContextSpace.prototype.numberOfResponsiveTableRows = function()
{
	if (this.m_elements.size() > 0)
	{
		return this.m_elements.get(0).numberOfResponsiveTableRows();
	}
	return 0;
};
oFF.UiContextSpace.prototype.getResponsiveTableRow = function(index)
{
	if (this.m_elements.size() > 0)
	{
		return this.m_elements.get(0).getResponsiveTableRow(index);
	}
	return null;
};
oFF.UiContextSpace.prototype.getIndexOfResponsiveTableRow = function(row)
{
	if (this.m_elements.size() > 0)
	{
		return this.m_elements.get(0).getIndexOfResponsiveTableRow(row);
	}
	return 0;
};
oFF.UiContextSpace.prototype.getResponsiveTableRowByName = function(name)
{
	if (this.m_elements.size() > 0)
	{
		return this.m_elements.get(0).getResponsiveTableRowByName(name);
	}
	return null;
};
oFF.UiContextSpace.prototype.getResponsiveTableRows = function()
{
	if (this.m_elements.size() > 0)
	{
		return this.m_elements.get(0).getResponsiveTableRows();
	}
	return null;
};
oFF.UiContextSpace.prototype.newResponsiveTableRow = function()
{
	if (this.m_elements.size() > 0)
	{
		return this.m_elements.get(0).newResponsiveTableRow();
	}
	return null;
};
oFF.UiContextSpace.prototype.addNewResponsiveTableRow = function()
{
	if (this.m_elements.size() > 0)
	{
		return this.m_elements.get(0).addNewResponsiveTableRow();
	}
	return null;
};
oFF.UiContextSpace.prototype.addAllResponsiveTableRows = function(rowList)
{
	for (var i = 0; i < this.m_elements.size(); i++)
	{
		this.m_elements.get(i).addAllResponsiveTableRows(rowList);
	}
	return this;
};
oFF.UiContextSpace.prototype.addResponsiveTableRow = function(row)
{
	for (var i = 0; i < this.m_elements.size(); i++)
	{
		this.m_elements.get(i).addResponsiveTableRow(row);
	}
	return this;
};
oFF.UiContextSpace.prototype.insertResponsiveTableRow = function(row, index)
{
	if (this.m_elements.size() > 0)
	{
		this.m_elements.get(0).insertResponsiveTableRow(row, index);
	}
	return this;
};
oFF.UiContextSpace.prototype.removeResponsiveTableRow = function(row)
{
	for (var i = 0; i < this.m_elements.size(); i++)
	{
		this.m_elements.get(i).removeResponsiveTableRow(row);
	}
	return this;
};
oFF.UiContextSpace.prototype.clearResponsiveTableRows = function()
{
	for (var i = 0; i < this.m_elements.size(); i++)
	{
		this.m_elements.get(i).clearResponsiveTableRows();
	}
	return this;
};
oFF.UiContextSpace.prototype.hasResponsiveTableCells = function()
{
	if (this.m_elements.size() > 0)
	{
		return this.m_elements.get(0).hasResponsiveTableCells();
	}
	return false;
};
oFF.UiContextSpace.prototype.numberOfResponsiveTableCells = function()
{
	if (this.m_elements.size() > 0)
	{
		return this.m_elements.get(0).numberOfResponsiveTableCells();
	}
	return 0;
};
oFF.UiContextSpace.prototype.getResponsiveTableCell = function(index)
{
	if (this.m_elements.size() > 0)
	{
		return this.m_elements.get(0).getResponsiveTableCell(index);
	}
	return null;
};
oFF.UiContextSpace.prototype.getIndexOfResponsiveTableCell = function(cell)
{
	if (this.m_elements.size() > 0)
	{
		return this.m_elements.get(0).getIndexOfResponsiveTableCell(cell);
	}
	return 0;
};
oFF.UiContextSpace.prototype.getResponsiveTableCellByName = function(name)
{
	if (this.m_elements.size() > 0)
	{
		return this.m_elements.get(0).getResponsiveTableCellByName(name);
	}
	return null;
};
oFF.UiContextSpace.prototype.getResponsiveTableCells = function()
{
	if (this.m_elements.size() > 0)
	{
		return this.m_elements.get(0).getResponsiveTableCells();
	}
	return null;
};
oFF.UiContextSpace.prototype.newResponsiveTableCell = function()
{
	if (this.m_elements.size() > 0)
	{
		return this.m_elements.get(0).newResponsiveTableCell();
	}
	return null;
};
oFF.UiContextSpace.prototype.addNewResponsiveTableCell = function()
{
	if (this.m_elements.size() > 0)
	{
		return this.m_elements.get(0).addNewResponsiveTableCell();
	}
	return null;
};
oFF.UiContextSpace.prototype.addAllResponsiveTableCells = function(cellList)
{
	for (var i = 0; i < this.m_elements.size(); i++)
	{
		this.m_elements.get(i).addAllResponsiveTableCells(cellList);
	}
	return this;
};
oFF.UiContextSpace.prototype.addResponsiveTableCell = function(cell)
{
	for (var i = 0; i < this.m_elements.size(); i++)
	{
		this.m_elements.get(i).addResponsiveTableCell(cell);
	}
	return this;
};
oFF.UiContextSpace.prototype.insertResponsiveTableCell = function(cell, index)
{
	if (this.m_elements.size() > 0)
	{
		this.m_elements.get(0).insertResponsiveTableCell(cell, index);
	}
	return this;
};
oFF.UiContextSpace.prototype.removeResponsiveTableCell = function(cell)
{
	for (var i = 0; i < this.m_elements.size(); i++)
	{
		this.m_elements.get(i).removeResponsiveTableCell(cell);
	}
	return this;
};
oFF.UiContextSpace.prototype.clearResponsiveTableCells = function()
{
	for (var i = 0; i < this.m_elements.size(); i++)
	{
		this.m_elements.get(i).clearResponsiveTableCells();
	}
	return this;
};
oFF.UiContextSpace.prototype.hasPages = function()
{
	if (this.m_elements.size() > 0)
	{
		return this.m_elements.get(0).hasPages();
	}
	return false;
};
oFF.UiContextSpace.prototype.getPagesCount = function()
{
	if (this.m_elements.size() > 0)
	{
		return this.m_elements.get(0).getPagesCount();
	}
	return 0;
};
oFF.UiContextSpace.prototype.getPage = function(index)
{
	if (this.m_elements.size() > 0)
	{
		return this.m_elements.get(0).getPage(index);
	}
	return null;
};
oFF.UiContextSpace.prototype.getIndexOfPage = function(page)
{
	if (this.m_elements.size() > 0)
	{
		return this.m_elements.get(0).getIndexOfPage(page);
	}
	return 0;
};
oFF.UiContextSpace.prototype.getPageByName = function(name)
{
	if (this.m_elements.size() > 0)
	{
		return this.m_elements.get(0).getPageByName(name);
	}
	return null;
};
oFF.UiContextSpace.prototype.getPages = function()
{
	if (this.m_elements.size() > 0)
	{
		return this.m_elements.get(0).getPages();
	}
	return null;
};
oFF.UiContextSpace.prototype.getCurrentPage = function()
{
	if (this.m_elements.size() > 0)
	{
		return this.m_elements.get(0).getCurrentPage();
	}
	return null;
};
oFF.UiContextSpace.prototype.newPage = function()
{
	if (this.m_elements.size() > 0)
	{
		return this.m_elements.get(0).newPage();
	}
	return null;
};
oFF.UiContextSpace.prototype.pushNewPage = function()
{
	if (this.m_elements.size() > 0)
	{
		return this.m_elements.get(0).pushNewPage();
	}
	return null;
};
oFF.UiContextSpace.prototype.pushPage = function(page)
{
	for (var i = 0; i < this.m_elements.size(); i++)
	{
		this.m_elements.get(i).pushPage(page);
	}
	return this;
};
oFF.UiContextSpace.prototype.popPage = function()
{
	if (this.m_elements.size() > 0)
	{
		return this.m_elements.get(0).popPage();
	}
	return null;
};
oFF.UiContextSpace.prototype.clearPages = function()
{
	for (var i = 0; i < this.m_elements.size(); i++)
	{
		this.m_elements.get(i).clearPages();
	}
	return this;
};
oFF.UiContextSpace.prototype.add = function(element) {};
oFF.UiContextSpace.prototype.addAll = oFF.noSupport;
oFF.UiContextSpace.prototype.addNew = oFF.noSupport;
oFF.UiContextSpace.prototype.addNewItem = oFF.noSupport;
oFF.UiContextSpace.prototype.setNewContent = oFF.noSupport;
oFF.UiContextSpace.prototype.setNew = oFF.noSupport;
oFF.UiContextSpace.prototype.insertNew = oFF.noSupport;
oFF.UiContextSpace.prototype.newControlExt = oFF.noSupport;
oFF.UiContextSpace.prototype.newItem = oFF.noSupport;
oFF.UiContextSpace.prototype.newBasicControl = oFF.noSupport;
oFF.UiContextSpace.prototype.insert = oFF.noSupport;
oFF.UiContextSpace.prototype.removeElement = oFF.noSupport;
oFF.UiContextSpace.prototype.removeAt = oFF.noSupport;
oFF.UiContextSpace.prototype.set = oFF.noSupport;
oFF.UiContextSpace.prototype.get = oFF.noSupport;
oFF.UiContextSpace.prototype.getChildItemByName = oFF.noSupport;
oFF.UiContextSpace.prototype.getChildItemById = oFF.noSupport;
oFF.UiContextSpace.prototype.getChildItemByNameRecursive = oFF.noSupport;
oFF.UiContextSpace.prototype.getIndex = oFF.noSupport;
oFF.UiContextSpace.prototype.getChildItems = oFF.noSupport;
oFF.UiContextSpace.prototype.getValuesAsReadOnlyList = oFF.noSupport;
oFF.UiContextSpace.prototype.getIterator = oFF.noSupport;
oFF.UiContextSpace.prototype.clear = oFF.noSupport;
oFF.UiContextSpace.prototype.contains = oFF.noSupport;
oFF.UiContextSpace.prototype.getChartType = oFF.noSupport;
oFF.UiContextSpace.prototype.setChartType = oFF.noSupport;
oFF.UiContextSpace.prototype.getContent = oFF.noSupport;
oFF.UiContextSpace.prototype.setContent = oFF.noSupport;
oFF.UiContextSpace.prototype.isCompositeControl = oFF.noSupport;
oFF.UiContextSpace.prototype.isSingleSelection = oFF.noSupport;
oFF.UiContextSpace.prototype.isSelectionSet = oFF.noSupport;
oFF.UiContextSpace.prototype.suspend = oFF.noSupport;
oFF.UiContextSpace.prototype.resume = oFF.noSupport;
oFF.UiContextSpace.prototype.invalidate = oFF.noSupport;
oFF.UiContextSpace.prototype.layout = oFF.noSupport;
oFF.UiContextSpace.prototype.invalidateModelContent = oFF.noSupport;
oFF.UiContextSpace.prototype.reset = oFF.noSupport;
oFF.UiContextSpace.prototype.setNewItemAt = oFF.noSupport;
oFF.UiContextSpace.prototype.setNewItemAtExt = oFF.noSupport;
oFF.UiContextSpace.prototype.addNewItemAt = oFF.noSupport;
oFF.UiContextSpace.prototype.getDefaultItemType = oFF.noSupport;
oFF.UiContextSpace.prototype.newControl = oFF.noSupport;
oFF.UiContextSpace.prototype.insertNewItem = oFF.noSupport;
oFF.UiContextSpace.prototype.isEmpty = oFF.noSupport;
oFF.UiContextSpace.prototype.hasElements = oFF.noSupport;
oFF.UiContextSpace.prototype.getNativeControl = function()
{
	if (this.m_elements.size() > 0)
	{
		return this.m_elements.get(0).getNativeControl();
	}
	return null;
};
oFF.UiContextSpace.prototype.getBaseControl = oFF.noSupport;
oFF.UiContextSpace.prototype.setBaseControl = oFF.noSupport;
oFF.UiContextSpace.prototype.hasProperty = function(property)
{
	if (this.m_elements.size() > 0)
	{
		return this.m_elements.get(0).hasProperty(property);
	}
	return false;
};
oFF.UiContextSpace.prototype.hasAggregation = function(aggrDef)
{
	if (this.m_elements.size() > 0)
	{
		return this.m_elements.get(0).hasAggregation(aggrDef);
	}
	return false;
};
oFF.UiContextSpace.prototype.hasMethod = function(method)
{
	if (this.m_elements.size() > 0)
	{
		return this.m_elements.get(0).hasMethod(method);
	}
	return false;
};
oFF.UiContextSpace.prototype.hasEvent = function(eventDef)
{
	if (this.m_elements.size() > 0)
	{
		return this.m_elements.get(0).hasEvent(eventDef);
	}
	return false;
};
oFF.UiContextSpace.prototype.hasInterface = function(interfaceDef)
{
	if (this.m_elements.size() > 0)
	{
		return this.m_elements.get(0).hasInterface(interfaceDef);
	}
	return false;
};
oFF.UiContextSpace.prototype.getBackgroundColor = function()
{
	if (this.m_elements.size() > 0)
	{
		return this.m_elements.get(0).getBackgroundColor();
	}
	return null;
};
oFF.UiContextSpace.prototype.setBackgroundColor = function(backgroundColor)
{
	for (var i = 0; i < this.m_elements.size(); i++)
	{
		this.m_elements.get(i).setBackgroundColor(backgroundColor);
	}
	return this;
};
oFF.UiContextSpace.prototype.getFontSize = function()
{
	if (this.m_elements.size() > 0)
	{
		return this.m_elements.get(0).getFontSize();
	}
	return null;
};
oFF.UiContextSpace.prototype.setFontSize = function(fontSize)
{
	for (var i = 0; i < this.m_elements.size(); i++)
	{
		this.m_elements.get(i).setFontSize(fontSize);
	}
	return this;
};
oFF.UiContextSpace.prototype.getIconSize = function()
{
	if (this.m_elements.size() > 0)
	{
		return this.m_elements.get(0).getIconSize();
	}
	return null;
};
oFF.UiContextSpace.prototype.setIconSize = function(iconSize)
{
	for (var i = 0; i < this.m_elements.size(); i++)
	{
		this.m_elements.get(i).setIconSize(iconSize);
	}
	return this;
};
oFF.UiContextSpace.prototype.getPlaceholder = function()
{
	if (this.m_elements.size() > 0)
	{
		return this.m_elements.get(0).getPlaceholder();
	}
	return null;
};
oFF.UiContextSpace.prototype.setPlaceholder = function(placeholder)
{
	for (var i = 0; i < this.m_elements.size(); i++)
	{
		this.m_elements.get(i).setPlaceholder(placeholder);
	}
	return this;
};
oFF.UiContextSpace.prototype.attach = function(child, operation, position, firstIndex, secondIndex)
{
	if (this.m_elements.size() > 0)
	{
		this.m_elements.get(0).attach(child, operation, position, firstIndex, secondIndex);
	}
	return this;
};
oFF.UiContextSpace.prototype.getFontColor = function()
{
	if (this.m_elements.size() > 0)
	{
		return this.m_elements.get(0).getFontColor();
	}
	return null;
};
oFF.UiContextSpace.prototype.setFontColor = function(fontColor)
{
	for (var i = 0; i < this.m_elements.size(); i++)
	{
		this.m_elements.get(i).setFontColor(fontColor);
	}
	return this;
};
oFF.UiContextSpace.prototype.setInputType = function(inputType)
{
	for (var i = 0; i < this.m_elements.size(); i++)
	{
		this.m_elements.get(i).setInputType(inputType);
	}
	return this;
};
oFF.UiContextSpace.prototype.getInputType = function()
{
	if (this.m_elements.size() > 0)
	{
		return this.m_elements.get(0).getInputType();
	}
	return null;
};
oFF.UiContextSpace.prototype.getCornerRadius = function()
{
	if (this.m_elements.size() > 0)
	{
		return this.m_elements.get(0).getCornerRadius();
	}
	return null;
};
oFF.UiContextSpace.prototype.setCornerRadius = function(cornerRadius)
{
	return this;
};
oFF.UiContextSpace.prototype.getDataManifest = function()
{
	if (this.m_elements.size() > 0)
	{
		return this.m_elements.get(0).getDataManifest();
	}
	return null;
};
oFF.UiContextSpace.prototype.setDataManifest = function(dataManifest)
{
	for (var i = 0; i < this.m_elements.size(); i++)
	{
		this.m_elements.get(i).setDataManifest(dataManifest);
	}
};
oFF.UiContextSpace.prototype.setListItemType = function(listItemType)
{
	for (var i = 0; i < this.m_elements.size(); i++)
	{
		this.m_elements.get(i).setListItemType(listItemType);
	}
	return this;
};
oFF.UiContextSpace.prototype.getListItemType = function()
{
	if (this.m_elements.size() > 0)
	{
		return this.m_elements.get(0).getListItemType();
	}
	return null;
};
oFF.UiContextSpace.prototype.setButtonType = function(buttonType)
{
	for (var i = 0; i < this.m_elements.size(); i++)
	{
		this.m_elements.get(i).setButtonType(buttonType);
	}
	return this;
};
oFF.UiContextSpace.prototype.getButtonType = function()
{
	if (this.m_elements.size() > 0)
	{
		return this.m_elements.get(0).getButtonType();
	}
	return null;
};
oFF.UiContextSpace.prototype.getBackgroundImageSrc = function()
{
	if (this.m_elements.size() > 0)
	{
		return this.m_elements.get(0).getBackgroundImageSrc();
	}
	return null;
};
oFF.UiContextSpace.prototype.setBackgroundImageSrc = function(src)
{
	for (var i = 0; i < this.m_elements.size(); i++)
	{
		this.m_elements.get(i).setBackgroundImageSrc(src);
	}
	return this;
};
oFF.UiContextSpace.prototype.setRotation = function(rotation)
{
	for (var i = 0; i < this.m_elements.size(); i++)
	{
		this.m_elements.get(i).setRotation(rotation);
	}
	return this;
};
oFF.UiContextSpace.prototype.getRotation = function()
{
	if (this.m_elements.size() > 0)
	{
		return this.m_elements.get(0).getRotation();
	}
	return 0;
};
oFF.UiContextSpace.prototype.isRequired = function()
{
	if (this.m_elements.size() > 0)
	{
		return this.m_elements.get(0).isRequired();
	}
	return false;
};
oFF.UiContextSpace.prototype.setRequired = function(required)
{
	for (var i = 0; i < this.m_elements.size(); i++)
	{
		this.m_elements.get(i).setRequired(required);
	}
	return this;
};
oFF.UiContextSpace.prototype.isResizable = function()
{
	if (this.m_elements.size() > 0)
	{
		return this.m_elements.get(0).isResizable();
	}
	return false;
};
oFF.UiContextSpace.prototype.setResizable = function(resizable)
{
	for (var i = 0; i < this.m_elements.size(); i++)
	{
		this.m_elements.get(i).setResizable(resizable);
	}
	return this;
};
oFF.UiContextSpace.prototype.getBorderStyle = function()
{
	if (this.m_elements.size() > 0)
	{
		return this.m_elements.get(0).getBorderStyle();
	}
	return null;
};
oFF.UiContextSpace.prototype.setBorderStyle = function(borderStyle)
{
	for (var i = 0; i < this.m_elements.size(); i++)
	{
		this.m_elements.get(i).setBorderStyle(borderStyle);
	}
	return this;
};
oFF.UiContextSpace.prototype.setState = function(state)
{
	for (var i = 0; i < this.m_elements.size(); i++)
	{
		this.m_elements.get(i).setState(state);
	}
	return this;
};
oFF.UiContextSpace.prototype.getState = function()
{
	if (this.m_elements.size() > 0)
	{
		return this.m_elements.get(0).getState();
	}
	return null;
};
oFF.UiContextSpace.prototype.getAnimationDuration = function()
{
	if (this.m_elements.size() > 0)
	{
		return this.m_elements.get(0).getAnimationDuration();
	}
	return 0;
};
oFF.UiContextSpace.prototype.setAnimationDuration = function(animationDuration)
{
	for (var i = 0; i < this.m_elements.size(); i++)
	{
		this.m_elements.get(i).setAnimationDuration(animationDuration);
	}
	return this;
};
oFF.UiContextSpace.prototype.getMaxDate = function()
{
	if (this.m_elements.size() > 0)
	{
		return this.m_elements.get(0).getMaxDate();
	}
	return null;
};
oFF.UiContextSpace.prototype.setMaxDate = function(maxDate)
{
	for (var i = 0; i < this.m_elements.size(); i++)
	{
		this.m_elements.get(i).setMaxDate(maxDate);
	}
	return this;
};
oFF.UiContextSpace.prototype.getMinDate = function()
{
	if (this.m_elements.size() > 0)
	{
		return this.m_elements.get(0).getMinDate();
	}
	return null;
};
oFF.UiContextSpace.prototype.setMinDate = function(minDate)
{
	for (var i = 0; i < this.m_elements.size(); i++)
	{
		this.m_elements.get(i).setMinDate(minDate);
	}
	return this;
};
oFF.UiContextSpace.prototype.getDisplayFormat = function()
{
	if (this.m_elements.size() > 0)
	{
		return this.m_elements.get(0).getDisplayFormat();
	}
	return null;
};
oFF.UiContextSpace.prototype.setDisplayFormat = function(displayFormat)
{
	for (var i = 0; i < this.m_elements.size(); i++)
	{
		this.m_elements.get(i).setDisplayFormat(displayFormat);
	}
	return this;
};
oFF.UiContextSpace.prototype.getValueFormat = function()
{
	if (this.m_elements.size() > 0)
	{
		return this.m_elements.get(0).getValueFormat();
	}
	return null;
};
oFF.UiContextSpace.prototype.setValueFormat = function(valueFormat)
{
	for (var i = 0; i < this.m_elements.size(); i++)
	{
		this.m_elements.get(i).setValueFormat(valueFormat);
	}
	return this;
};
oFF.UiContextSpace.prototype.getMinutesInterval = function()
{
	if (this.m_elements.size() > 0)
	{
		return this.m_elements.get(0).getMinutesInterval();
	}
	return 1;
};
oFF.UiContextSpace.prototype.setMinutesInterval = function(minInterval)
{
	for (var i = 0; i < this.m_elements.size(); i++)
	{
		this.m_elements.get(i).setMinutesInterval(minInterval);
	}
	return this;
};
oFF.UiContextSpace.prototype.getSecondsInterval = function()
{
	if (this.m_elements.size() > 0)
	{
		return this.m_elements.get(0).getSecondsInterval();
	}
	return 1;
};
oFF.UiContextSpace.prototype.setSecondsInterval = function(secInterval)
{
	for (var i = 0; i < this.m_elements.size(); i++)
	{
		this.m_elements.get(i).setSecondsInterval(secInterval);
	}
	return this;
};
oFF.UiContextSpace.prototype.getMaxLength = function()
{
	if (this.m_elements.size() > 0)
	{
		return this.m_elements.get(0).getMaxLength();
	}
	return 0;
};
oFF.UiContextSpace.prototype.setMaxLength = function(maxLength)
{
	for (var i = 0; i < this.m_elements.size(); i++)
	{
		this.m_elements.get(i).setMaxLength(maxLength);
	}
	return this;
};
oFF.UiContextSpace.prototype.setTextAlign = function(textAlign)
{
	for (var i = 0; i < this.m_elements.size(); i++)
	{
		this.m_elements.get(i).setTextAlign(textAlign);
	}
	return this;
};
oFF.UiContextSpace.prototype.getTextAlign = function()
{
	if (this.m_elements.size() > 0)
	{
		return this.m_elements.get(0).getTextAlign();
	}
	return null;
};
oFF.UiContextSpace.prototype.setFontStyle = function(fontStyle)
{
	for (var i = 0; i < this.m_elements.size(); i++)
	{
		this.m_elements.get(i).setFontStyle(fontStyle);
	}
	return this;
};
oFF.UiContextSpace.prototype.getFontStyle = function()
{
	if (this.m_elements.size() > 0)
	{
		return this.m_elements.get(0).getFontStyle();
	}
	return null;
};
oFF.UiContextSpace.prototype.setFontWeight = function(fontWeight)
{
	for (var i = 0; i < this.m_elements.size(); i++)
	{
		this.m_elements.get(i).setFontWeight(fontWeight);
	}
	return this;
};
oFF.UiContextSpace.prototype.getFontWeight = function()
{
	if (this.m_elements.size() > 0)
	{
		return this.m_elements.get(0).getFontWeight();
	}
	return null;
};
oFF.UiContextSpace.prototype.getPath = function()
{
	if (this.m_elements.size() > 0)
	{
		return this.m_elements.get(0).getPath();
	}
	return null;
};
oFF.UiContextSpace.prototype.setPath = function(path)
{
	for (var i = 0; i < this.m_elements.size(); i++)
	{
		this.m_elements.get(i).setPath(path);
	}
	return this;
};
oFF.UiContextSpace.prototype.getCounter = function()
{
	if (this.m_elements.size() > 0)
	{
		return this.m_elements.get(0).getCounter();
	}
	return 0;
};
oFF.UiContextSpace.prototype.setCounter = function(counter)
{
	for (var i = 0; i < this.m_elements.size(); i++)
	{
		this.m_elements.get(i).setCounter(counter);
	}
	return this;
};
oFF.UiContextSpace.prototype.setHighlight = function(messageType)
{
	for (var i = 0; i < this.m_elements.size(); i++)
	{
		this.m_elements.get(i).setHighlight(messageType);
	}
	return this;
};
oFF.UiContextSpace.prototype.getHighlight = function()
{
	if (this.m_elements.size() > 0)
	{
		return this.m_elements.get(0).getHighlight();
	}
	return null;
};
oFF.UiContextSpace.prototype.setMessageType = function(messageType)
{
	for (var i = 0; i < this.m_elements.size(); i++)
	{
		this.m_elements.get(i).setMessageType(messageType);
	}
	return this;
};
oFF.UiContextSpace.prototype.getMessageType = function()
{
	if (this.m_elements.size() > 0)
	{
		return this.m_elements.get(0).getMessageType();
	}
	return null;
};
oFF.UiContextSpace.prototype.setCommandHistory = function(commands)
{
	for (var i = 0; i < this.m_elements.size(); i++)
	{
		this.m_elements.get(i).setCommandHistory(commands);
	}
	return this;
};
oFF.UiContextSpace.prototype.getCommandHistory = function()
{
	if (this.m_elements.size() > 0)
	{
		return this.m_elements.get(0).getCommandHistory();
	}
	return null;
};
oFF.UiContextSpace.prototype.addCommandToHistory = function(command)
{
	for (var i = 0; i < this.m_elements.size(); i++)
	{
		this.m_elements.get(i).addCommandToHistory(command);
	}
	return this;
};
oFF.UiContextSpace.prototype.getLastCommandFromHistory = function()
{
	if (this.m_elements.size() > 0)
	{
		return this.m_elements.get(0).getLastCommandFromHistory();
	}
	return null;
};
oFF.UiContextSpace.prototype.clearCommandHistory = function()
{
	for (var i = 0; i < this.m_elements.size(); i++)
	{
		this.m_elements.get(i).clearCommandHistory();
	}
	return this;
};
oFF.UiContextSpace.prototype.getVisibleRowCount = function()
{
	if (this.m_elements.size() > 0)
	{
		return this.m_elements.get(0).getVisibleRowCount();
	}
	return 0;
};
oFF.UiContextSpace.prototype.setVisibleRowCount = function(visibleRowCount)
{
	for (var i = 0; i < this.m_elements.size(); i++)
	{
		this.m_elements.get(i).setVisibleRowCount(visibleRowCount);
	}
	return this;
};
oFF.UiContextSpace.prototype.setVisibleRowCountMode = function(visibleRowCountMode)
{
	for (var i = 0; i < this.m_elements.size(); i++)
	{
		this.m_elements.get(i).setVisibleRowCountMode(visibleRowCountMode);
	}
	return this;
};
oFF.UiContextSpace.prototype.getVisibleRowCountMode = function()
{
	if (this.m_elements.size() > 0)
	{
		return this.m_elements.get(0).getVisibleRowCountMode();
	}
	return null;
};
oFF.UiContextSpace.prototype.getMinRowCount = function()
{
	if (this.m_elements.size() > 0)
	{
		return this.m_elements.get(0).getMinRowCount();
	}
	return 0;
};
oFF.UiContextSpace.prototype.setMinRowCount = function(minRowCount)
{
	for (var i = 0; i < this.m_elements.size(); i++)
	{
		this.m_elements.get(i).setMinRowCount(minRowCount);
	}
	return this;
};
oFF.UiContextSpace.prototype.getFirstVisibleRow = function()
{
	if (this.m_elements.size() > 0)
	{
		return this.m_elements.get(0).getFirstVisibleRow();
	}
	return null;
};
oFF.UiContextSpace.prototype.setFirstVisibleRow = function(firstVisibleRow)
{
	for (var i = 0; i < this.m_elements.size(); i++)
	{
		this.m_elements.get(i).setFirstVisibleRow(firstVisibleRow);
	}
	return this;
};
oFF.UiContextSpace.prototype.getDebounceTime = function()
{
	if (this.m_elements.size() > 0)
	{
		return this.m_elements.get(0).getDebounceTime();
	}
	return 0;
};
oFF.UiContextSpace.prototype.setDebounceTime = function(debounceTime)
{
	for (var i = 0; i < this.m_elements.size(); i++)
	{
		this.m_elements.get(i).setDebounceTime(debounceTime);
	}
	return this;
};
oFF.UiContextSpace.prototype.setDirection = function(direction)
{
	for (var i = 0; i < this.m_elements.size(); i++)
	{
		this.m_elements.get(i).setDirection(direction);
	}
	return this;
};
oFF.UiContextSpace.prototype.getDirection = function()
{
	if (this.m_elements.size() > 0)
	{
		return this.m_elements.get(0).getDirection();
	}
	return null;
};
oFF.UiContextSpace.prototype.setAlignItems = function(alignItems)
{
	for (var i = 0; i < this.m_elements.size(); i++)
	{
		this.m_elements.get(i).setAlignItems(alignItems);
	}
	return this;
};
oFF.UiContextSpace.prototype.getAlignItems = function()
{
	if (this.m_elements.size() > 0)
	{
		return this.m_elements.get(0).getAlignItems();
	}
	return null;
};
oFF.UiContextSpace.prototype.setAlignContent = function(alignContent)
{
	for (var i = 0; i < this.m_elements.size(); i++)
	{
		this.m_elements.get(i).setAlignContent(alignContent);
	}
	return this;
};
oFF.UiContextSpace.prototype.getAlignContent = function()
{
	if (this.m_elements.size() > 0)
	{
		return this.m_elements.get(0).getAlignContent();
	}
	return null;
};
oFF.UiContextSpace.prototype.setJustifyContent = function(justifyContent)
{
	for (var i = 0; i < this.m_elements.size(); i++)
	{
		this.m_elements.get(i).setJustifyContent(justifyContent);
	}
	return this;
};
oFF.UiContextSpace.prototype.getJustifyContent = function()
{
	if (this.m_elements.size() > 0)
	{
		return this.m_elements.get(0).getJustifyContent();
	}
	return null;
};
oFF.UiContextSpace.prototype.setWrap = function(wrap)
{
	for (var i = 0; i < this.m_elements.size(); i++)
	{
		this.m_elements.get(i).setWrap(wrap);
	}
	return this;
};
oFF.UiContextSpace.prototype.getWrap = function()
{
	if (this.m_elements.size() > 0)
	{
		return this.m_elements.get(0).getWrap();
	}
	return null;
};
oFF.UiContextSpace.prototype.setFlex = function(flex)
{
	for (var i = 0; i < this.m_elements.size(); i++)
	{
		this.m_elements.get(i).setFlex(flex);
	}
	return this;
};
oFF.UiContextSpace.prototype.getFlex = function()
{
	if (this.m_elements.size() > 0)
	{
		return this.m_elements.get(0).getFlex();
	}
	return null;
};
oFF.UiContextSpace.prototype.setAlignSelf = function(alignSelf)
{
	for (var i = 0; i < this.m_elements.size(); i++)
	{
		this.m_elements.get(i).setAlignSelf(alignSelf);
	}
	return this;
};
oFF.UiContextSpace.prototype.getAlignSelf = function()
{
	if (this.m_elements.size() > 0)
	{
		return this.m_elements.get(0).getAlignSelf();
	}
	return null;
};
oFF.UiContextSpace.prototype.setOrder = function(order)
{
	for (var i = 0; i < this.m_elements.size(); i++)
	{
		this.m_elements.get(i).setOrder(order);
	}
	return this;
};
oFF.UiContextSpace.prototype.getOrder = function()
{
	if (this.m_elements.size() > 0)
	{
		return this.m_elements.get(0).getOrder();
	}
	return 0;
};
oFF.UiContextSpace.prototype.setEnableSelectAll = function(enableSelectAll)
{
	for (var i = 0; i < this.m_elements.size(); i++)
	{
		this.m_elements.get(i).setEnableSelectAll(enableSelectAll);
	}
	return this;
};
oFF.UiContextSpace.prototype.isEnableSelectAll = function()
{
	if (this.m_elements.size() > 0)
	{
		return this.m_elements.get(0).isEnableSelectAll();
	}
	return true;
};
oFF.UiContextSpace.prototype.getFooter = function()
{
	if (this.m_elements.size() > 0)
	{
		return this.m_elements.get(0).getFooter();
	}
	return null;
};
oFF.UiContextSpace.prototype.setFooter = function(footer)
{
	for (var i = 0; i < this.m_elements.size(); i++)
	{
		this.m_elements.get(i).setFooter(footer);
	}
	return this;
};
oFF.UiContextSpace.prototype.setNewFooter = function(uiType)
{
	for (var i = 0; i < this.m_elements.size(); i++)
	{
		return this.m_elements.get(i).setNewFooter(uiType);
	}
	return null;
};
oFF.UiContextSpace.prototype.clearFooter = function()
{
	for (var i = 0; i < this.m_elements.size(); i++)
	{
		this.m_elements.get(i).clearFooter();
	}
	return this;
};
oFF.UiContextSpace.prototype.isWrapping = function()
{
	if (this.m_elements.size() > 0)
	{
		return this.m_elements.get(0).isWrapping();
	}
	return true;
};
oFF.UiContextSpace.prototype.setWrapping = function(wrapping)
{
	for (var i = 0; i < this.m_elements.size(); i++)
	{
		this.m_elements.get(i).setWrapping(wrapping);
	}
	return this;
};
oFF.UiContextSpace.prototype.setValueState = function(valueState)
{
	for (var i = 0; i < this.m_elements.size(); i++)
	{
		this.m_elements.get(i).setValueState(valueState);
	}
	return this;
};
oFF.UiContextSpace.prototype.getValueState = function()
{
	if (this.m_elements.size() > 0)
	{
		return this.m_elements.get(0).getValueState();
	}
	return null;
};
oFF.UiContextSpace.prototype.getValueStateText = function()
{
	if (this.m_elements.size() > 0)
	{
		return this.m_elements.get(0).getValueStateText();
	}
	return null;
};
oFF.UiContextSpace.prototype.setValueStateText = function(valueStateText)
{
	for (var i = 0; i < this.m_elements.size(); i++)
	{
		this.m_elements.get(i).setValueStateText(valueStateText);
	}
	return this;
};
oFF.UiContextSpace.prototype.setPlacement = function(placementType)
{
	for (var i = 0; i < this.m_elements.size(); i++)
	{
		this.m_elements.get(i).setPlacement(placementType);
	}
	return this;
};
oFF.UiContextSpace.prototype.getPlacement = function()
{
	if (this.m_elements.size() > 0)
	{
		return this.m_elements.get(0).getPlacement();
	}
	return null;
};
oFF.UiContextSpace.prototype.isShowNavButton = function()
{
	if (this.m_elements.size() > 0)
	{
		return this.m_elements.get(0).isShowNavButton();
	}
	return true;
};
oFF.UiContextSpace.prototype.setShowNavButton = function(showNavButton)
{
	for (var i = 0; i < this.m_elements.size(); i++)
	{
		this.m_elements.get(i).setShowNavButton(showNavButton);
	}
	return this;
};
oFF.UiContextSpace.prototype.isShowHeader = function()
{
	if (this.m_elements.size() > 0)
	{
		return this.m_elements.get(0).isShowHeader();
	}
	return true;
};
oFF.UiContextSpace.prototype.setShowHeader = function(showHeader)
{
	for (var i = 0; i < this.m_elements.size(); i++)
	{
		this.m_elements.get(i).setShowHeader(showHeader);
	}
	return this;
};
oFF.UiContextSpace.prototype.getSubHeader = function()
{
	if (this.m_elements.size() > 0)
	{
		return this.m_elements.get(0).getSubHeader();
	}
	return null;
};
oFF.UiContextSpace.prototype.setSubHeader = function(subHeader)
{
	for (var i = 0; i < this.m_elements.size(); i++)
	{
		this.m_elements.get(i).setSubHeader(subHeader);
	}
	return this;
};
oFF.UiContextSpace.prototype.setNewSubHeader = function(uiType)
{
	for (var i = 0; i < this.m_elements.size(); i++)
	{
		return this.m_elements.get(i).setNewSubHeader(uiType);
	}
	return null;
};
oFF.UiContextSpace.prototype.clearSubHeader = function()
{
	for (var i = 0; i < this.m_elements.size(); i++)
	{
		this.m_elements.get(i).clearFooter();
	}
	return this;
};
oFF.UiContextSpace.prototype.getHeader = function()
{
	if (this.m_elements.size() > 0)
	{
		return this.m_elements.get(0).getHeader();
	}
	return null;
};
oFF.UiContextSpace.prototype.setHeader = function(header)
{
	for (var i = 0; i < this.m_elements.size(); i++)
	{
		this.m_elements.get(i).setHeader(header);
	}
	return this;
};
oFF.UiContextSpace.prototype.setNewHeader = function(uiType)
{
	for (var i = 0; i < this.m_elements.size(); i++)
	{
		return this.m_elements.get(i).setNewHeader(uiType);
	}
	return null;
};
oFF.UiContextSpace.prototype.clearHeader = function()
{
	for (var i = 0; i < this.m_elements.size(); i++)
	{
		this.m_elements.get(i).clearHeader();
	}
	return this;
};
oFF.UiContextSpace.prototype.isOn = function()
{
	if (this.m_elements.size() > 0)
	{
		return this.m_elements.get(0).isOn();
	}
	return false;
};
oFF.UiContextSpace.prototype.setOn = function(isOn)
{
	for (var i = 0; i < this.m_elements.size(); i++)
	{
		this.m_elements.get(i).setOn(isOn);
	}
	return this;
};
oFF.UiContextSpace.prototype.getTag = function()
{
	if (this.m_elements.size() > 0)
	{
		return this.m_elements.get(0).getTag();
	}
	return null;
};
oFF.UiContextSpace.prototype.setTag = function(tag)
{
	for (var i = 0; i < this.m_elements.size(); i++)
	{
		this.m_elements.get(i).setTag(tag);
	}
	return this;
};
oFF.UiContextSpace.prototype.getOnText = function()
{
	if (this.m_elements.size() > 0)
	{
		return this.m_elements.get(0).getOnText();
	}
	return null;
};
oFF.UiContextSpace.prototype.setOnText = function(onText)
{
	for (var i = 0; i < this.m_elements.size(); i++)
	{
		this.m_elements.get(i).setOnText(onText);
	}
	return this;
};
oFF.UiContextSpace.prototype.getOffText = function()
{
	if (this.m_elements.size() > 0)
	{
		return this.m_elements.get(0).getOffText();
	}
	return null;
};
oFF.UiContextSpace.prototype.setOffText = function(offText)
{
	for (var i = 0; i < this.m_elements.size(); i++)
	{
		this.m_elements.get(i).setOffText(offText);
	}
	return this;
};
oFF.UiContextSpace.prototype.getCodeType = function()
{
	if (this.m_elements.size() > 0)
	{
		return this.m_elements.get(0).getCodeType();
	}
	return "javascript";
};
oFF.UiContextSpace.prototype.setCodeType = function(codeType)
{
	for (var i = 0; i < this.m_elements.size(); i++)
	{
		this.m_elements.get(i).setCodeType(codeType);
	}
	return this;
};
oFF.UiContextSpace.prototype.getCustomParameters = function()
{
	if (this.m_elements.size() > 0)
	{
		return this.m_elements.get(0).getCustomParameters();
	}
	return null;
};
oFF.UiContextSpace.prototype.setCustomParameters = function(customParameters)
{
	for (var i = 0; i < this.m_elements.size(); i++)
	{
		this.m_elements.get(i).setCustomParameters(customParameters);
	}
	return this;
};
oFF.UiContextSpace.prototype.isExpandable = function()
{
	if (this.m_elements.size() > 0)
	{
		return this.m_elements.get(0).isExpandable();
	}
	return false;
};
oFF.UiContextSpace.prototype.setExpandable = function(expandable)
{
	for (var i = 0; i < this.m_elements.size(); i++)
	{
		this.m_elements.get(i).setExpandable(expandable);
	}
	return this;
};
oFF.UiContextSpace.prototype.setIntervalSelection = function(intervalSelection)
{
	for (var i = 0; i < this.m_elements.size(); i++)
	{
		this.m_elements.get(i).setIntervalSelection(intervalSelection);
	}
	return this;
};
oFF.UiContextSpace.prototype.isIntervalSelection = function()
{
	if (this.m_elements.size() > 0)
	{
		return this.m_elements.get(0).isIntervalSelection();
	}
	return false;
};
oFF.UiContextSpace.prototype.getStartDate = function()
{
	if (this.m_elements.size() > 0)
	{
		return this.m_elements.get(0).getStartDate();
	}
	return null;
};
oFF.UiContextSpace.prototype.setStartDate = function(startDate)
{
	for (var i = 0; i < this.m_elements.size(); i++)
	{
		this.m_elements.get(i).setStartDate(startDate);
	}
	return this;
};
oFF.UiContextSpace.prototype.getEndDate = function()
{
	if (this.m_elements.size() > 0)
	{
		return this.m_elements.get(0).getEndDate();
	}
	return null;
};
oFF.UiContextSpace.prototype.setEndDate = function(endDate)
{
	for (var i = 0; i < this.m_elements.size(); i++)
	{
		this.m_elements.get(i).setEndDate(endDate);
	}
	return this;
};
oFF.UiContextSpace.prototype.setPressed = function(pressed)
{
	for (var i = 0; i < this.m_elements.size(); i++)
	{
		this.m_elements.get(i).setPressed(pressed);
	}
	return this;
};
oFF.UiContextSpace.prototype.isPressed = function()
{
	if (this.m_elements.size() > 0)
	{
		return this.m_elements.get(0).isPressed();
	}
	return false;
};
oFF.UiContextSpace.prototype.getOpacity = function()
{
	if (this.m_elements.size() > 0)
	{
		return this.m_elements.get(0).getOpacity();
	}
	return 1.0;
};
oFF.UiContextSpace.prototype.setOpacity = function(opacity)
{
	for (var i = 0; i < this.m_elements.size(); i++)
	{
		this.m_elements.get(i).setOpacity(opacity);
	}
	return this;
};
oFF.UiContextSpace.prototype.getPrompt = function()
{
	if (this.m_elements.size() > 0)
	{
		return this.m_elements.get(0).getPrompt();
	}
	return null;
};
oFF.UiContextSpace.prototype.setPrompt = function(prompt)
{
	for (var i = 0; i < this.m_elements.size(); i++)
	{
		this.m_elements.get(i).setPrompt(prompt);
	}
	return this;
};
oFF.UiContextSpace.prototype.isShowSorting = function()
{
	if (this.m_elements.size() > 0)
	{
		return this.m_elements.get(0).isShowSorting();
	}
	return false;
};
oFF.UiContextSpace.prototype.setShowSorting = function(showSorting)
{
	for (var i = 0; i < this.m_elements.size(); i++)
	{
		this.m_elements.get(i).setShowSorting(showSorting);
	}
	return this;
};
oFF.UiContextSpace.prototype.isShowValue = function()
{
	if (this.m_elements.size() > 0)
	{
		return this.m_elements.get(0).isShowValue();
	}
	return true;
};
oFF.UiContextSpace.prototype.setShowValue = function(showValue)
{
	for (var i = 0; i < this.m_elements.size(); i++)
	{
		this.m_elements.get(i).setShowValue(showValue);
	}
	return this;
};
oFF.UiContextSpace.prototype.isAnimated = function()
{
	if (this.m_elements.size() > 0)
	{
		return this.m_elements.get(0).isAnimated();
	}
	return true;
};
oFF.UiContextSpace.prototype.setAnimated = function(animated)
{
	for (var i = 0; i < this.m_elements.size(); i++)
	{
		this.m_elements.get(i).setAnimated(animated);
	}
	return this;
};
oFF.UiContextSpace.prototype.getPercentValue = function()
{
	if (this.m_elements.size() > 0)
	{
		return this.m_elements.get(0).getPercentValue();
	}
	return 0;
};
oFF.UiContextSpace.prototype.setPercentValue = function(value)
{
	for (var i = 0; i < this.m_elements.size(); i++)
	{
		this.m_elements.get(i).setPercentValue(value);
	}
	return this;
};
oFF.UiContextSpace.prototype.getColor = function()
{
	if (this.m_elements.size() > 0)
	{
		return this.m_elements.get(0).getColor();
	}
	return null;
};
oFF.UiContextSpace.prototype.setColor = function(color)
{
	for (var i = 0; i < this.m_elements.size(); i++)
	{
		this.m_elements.get(i).setColor(color);
	}
	return this;
};
oFF.UiContextSpace.prototype.setOverflow = function(overflow)
{
	for (var i = 0; i < this.m_elements.size(); i++)
	{
		this.m_elements.get(i).setOverflow(overflow);
	}
	return this;
};
oFF.UiContextSpace.prototype.getOverflow = function()
{
	if (this.m_elements.size() > 0)
	{
		return this.m_elements.get(0).getOverflow();
	}
	return null;
};
oFF.UiContextSpace.prototype.setLoadState = function(loadState)
{
	for (var i = 0; i < this.m_elements.size(); i++)
	{
		this.m_elements.get(i).setLoadState(loadState);
	}
	return this;
};
oFF.UiContextSpace.prototype.getLoadState = function()
{
	if (this.m_elements.size() > 0)
	{
		return this.m_elements.get(0).getLoadState();
	}
	return null;
};
oFF.UiContextSpace.prototype.setFrameType = function(frameType)
{
	for (var i = 0; i < this.m_elements.size(); i++)
	{
		this.m_elements.get(i).setFrameType(frameType);
	}
	return this;
};
oFF.UiContextSpace.prototype.getFrameType = function()
{
	if (this.m_elements.size() > 0)
	{
		return this.m_elements.get(0).getFrameType();
	}
	return null;
};
oFF.UiContextSpace.prototype.setTileMode = function(tileMode)
{
	for (var i = 0; i < this.m_elements.size(); i++)
	{
		this.m_elements.get(i).setTileMode(tileMode);
	}
	return this;
};
oFF.UiContextSpace.prototype.getTileMode = function()
{
	if (this.m_elements.size() > 0)
	{
		return this.m_elements.get(0).getTileMode();
	}
	return null;
};
oFF.UiContextSpace.prototype.isDraggable = function()
{
	if (this.m_elements.size() > 0)
	{
		return this.m_elements.get(0).isDraggable();
	}
	return false;
};
oFF.UiContextSpace.prototype.setDraggable = function(draggable)
{
	for (var i = 0; i < this.m_elements.size(); i++)
	{
		this.m_elements.get(i).setDraggable(draggable);
	}
	return this;
};
oFF.UiContextSpace.prototype.setDropInfo = function(dropInfo)
{
	for (var i = 0; i < this.m_elements.size(); i++)
	{
		this.m_elements.get(i).setDropInfo(dropInfo);
	}
	return this;
};
oFF.UiContextSpace.prototype.getDropInfo = function()
{
	if (this.m_elements.size() > 0)
	{
		return this.m_elements.get(0).getDropInfo();
	}
	return null;
};
oFF.UiContextSpace.prototype.getCssClass = function()
{
	if (this.m_elements.size() > 0)
	{
		return this.m_elements.get(0).getCssClass();
	}
	return null;
};
oFF.UiContextSpace.prototype.setCssClass = function(cssClass)
{
	for (var i = 0; i < this.m_elements.size(); i++)
	{
		this.m_elements.get(i).setCssClass(cssClass);
	}
	return this;
};
oFF.UiContextSpace.prototype.isPartiallyChecked = function()
{
	if (this.m_elements.size() > 0)
	{
		return this.m_elements.get(0).isPartiallyChecked();
	}
	return false;
};
oFF.UiContextSpace.prototype.setPartiallyChecked = function(partiallyChecked)
{
	for (var i = 0; i < this.m_elements.size(); i++)
	{
		this.m_elements.get(i).setPartiallyChecked(partiallyChecked);
	}
	return this;
};
oFF.UiContextSpace.prototype.isApplyContentPadding = function()
{
	if (this.m_elements.size() > 0)
	{
		return this.m_elements.get(0).isApplyContentPadding();
	}
	return true;
};
oFF.UiContextSpace.prototype.setApplyContentPadding = function(applyContentPadding)
{
	for (var i = 0; i < this.m_elements.size(); i++)
	{
		this.m_elements.get(i).setApplyContentPadding(applyContentPadding);
	}
	return this;
};
oFF.UiContextSpace.prototype.isEnableReordering = function()
{
	if (this.m_elements.size() > 0)
	{
		return this.m_elements.get(0).isEnableReordering();
	}
	return false;
};
oFF.UiContextSpace.prototype.setEnableReordering = function(enableReordering)
{
	for (var i = 0; i < this.m_elements.size(); i++)
	{
		this.m_elements.get(i).setEnableReordering(enableReordering);
	}
	return this;
};
oFF.UiContextSpace.prototype.setHeaderMode = function(headerMode)
{
	for (var i = 0; i < this.m_elements.size(); i++)
	{
		this.m_elements.get(i).setHeaderMode(headerMode);
	}
	return this;
};
oFF.UiContextSpace.prototype.getHeaderMode = function()
{
	if (this.m_elements.size() > 0)
	{
		return this.m_elements.get(0).getHeaderMode();
	}
	return null;
};
oFF.UiContextSpace.prototype.getCount = function()
{
	if (this.m_elements.size() > 0)
	{
		return this.m_elements.get(0).getCount();
	}
	return null;
};
oFF.UiContextSpace.prototype.setCount = function(count)
{
	for (var i = 0; i < this.m_elements.size(); i++)
	{
		this.m_elements.get(i).setCount(count);
	}
	return this;
};
oFF.UiContextSpace.prototype.isShowAddNewButton = function()
{
	if (this.m_elements.size() > 0)
	{
		return this.m_elements.get(0).isShowAddNewButton();
	}
	return false;
};
oFF.UiContextSpace.prototype.setShowAddNewButton = function(showAddNewButton)
{
	for (var i = 0; i < this.m_elements.size(); i++)
	{
		this.m_elements.get(i).setShowAddNewButton(showAddNewButton);
	}
	return this;
};
oFF.UiContextSpace.prototype.isModified = function()
{
	if (this.m_elements.size() > 0)
	{
		return this.m_elements.get(0).isModified();
	}
	return false;
};
oFF.UiContextSpace.prototype.setModified = function(modified)
{
	for (var i = 0; i < this.m_elements.size(); i++)
	{
		this.m_elements.get(i).setModified(modified);
	}
	return this;
};
oFF.UiContextSpace.prototype.setBorderWidth = function(borderWidth)
{
	for (var i = 0; i < this.m_elements.size(); i++)
	{
		this.m_elements.get(i).setBorderWidth(borderWidth);
	}
	return this;
};
oFF.UiContextSpace.prototype.getBorderWidth = function()
{
	if (this.m_elements.size() > 0)
	{
		return this.m_elements.get(0).getBorderWidth();
	}
	return null;
};
oFF.UiContextSpace.prototype.getBorderColor = function()
{
	if (this.m_elements.size() > 0)
	{
		return this.m_elements.get(0).getBorderColor();
	}
	return null;
};
oFF.UiContextSpace.prototype.setBorderColor = function(borderColor)
{
	for (var i = 0; i < this.m_elements.size(); i++)
	{
		this.m_elements.get(i).setBorderColor(borderColor);
	}
	return this;
};
oFF.UiContextSpace.prototype.getHeaderHeight = function()
{
	if (this.m_elements.size() > 0)
	{
		return this.m_elements.get(0).getHeaderHeight();
	}
	return null;
};
oFF.UiContextSpace.prototype.setHeaderHeight = function(headerHeight)
{
	for (var i = 0; i < this.m_elements.size(); i++)
	{
		this.m_elements.get(i).setHeaderHeight(headerHeight);
	}
	return this;
};
oFF.UiContextSpace.prototype.getFooterHeight = function()
{
	if (this.m_elements.size() > 0)
	{
		return this.m_elements.get(0).getFooterHeight();
	}
	return null;
};
oFF.UiContextSpace.prototype.setFooterHeight = function(footerHeight)
{
	for (var i = 0; i < this.m_elements.size(); i++)
	{
		this.m_elements.get(i).setFooterHeight(footerHeight);
	}
	return this;
};
oFF.UiContextSpace.prototype.createArrayCopy = oFF.noSupport;
oFF.UiContextSpace.prototype.getNodeType = oFF.noSupport;

oFF.DfUiContext = function() {};
oFF.DfUiContext.prototype = new oFF.XComponent();
oFF.DfUiContext.prototype._ff_c = "DfUiContext";

oFF.DfUiContext.prototype.m_position = null;
oFF.DfUiContext.prototype.m_firstIndex = 0;
oFF.DfUiContext.prototype.m_secondIndex = 0;
oFF.DfUiContext.prototype.m_operation = null;
oFF.DfUiContext.prototype.m_uiManager = null;
oFF.DfUiContext.prototype.m_uiType = null;
oFF.DfUiContext.prototype.m_styleClass = null;
oFF.DfUiContext.prototype.m_id = null;
oFF.DfUiContext.prototype.m_parentAggregation = null;
oFF.DfUiContext.prototype.m_aggregations = null;
oFF.DfUiContext.prototype.m_properties = null;
oFF.DfUiContext.prototype.m_listeners = null;
oFF.DfUiContext.prototype.newInstance = oFF.noSupport;
oFF.DfUiContext.prototype.setup = function()
{
	oFF.XComponent.prototype.setup.call( this );
	this.m_properties = oFF.XHashMapByString.create();
	this.m_aggregations = oFF.XHashMapByString.create();
	this.m_listeners = oFF.XHashMapByString.create();
};
oFF.DfUiContext.prototype.prepare = function(uiManager, uiType, styleClass, identifier, name)
{
	this.m_uiManager = uiManager;
	this.m_uiType = uiType;
	this.m_styleClass = styleClass;
	this.setId(identifier);
	if (oFF.notNull(name))
	{
		this.putString(oFF.UiProperty.NAME.getName(), name);
	}
};
oFF.DfUiContext.prototype.releaseObject = function()
{
	var uiManager = this.getUiManager();
	if (oFF.notNull(uiManager))
	{
		uiManager.removeSelectableElement(this);
	}
	this.m_properties.clear();
	this.m_properties = oFF.XObjectExt.release(this.m_properties);
	this.m_aggregations.clear();
	this.m_aggregations = oFF.XObjectExt.release(this.m_aggregations);
	this.m_listeners.clear();
	this.m_listeners = oFF.XObjectExt.release(this.m_listeners);
	this.m_parentAggregation = null;
	this.m_id = null;
	this.m_operation = null;
	this.m_uiType = null;
	this.m_styleClass = null;
	this.m_position = null;
	this.m_operation = null;
	this.m_uiManager = null;
	oFF.XComponent.prototype.releaseObject.call( this );
};
oFF.DfUiContext.prototype.initializeNative = function() {};
oFF.DfUiContext.prototype.getOrigin = function()
{
	return this;
};
oFF.DfUiContext.prototype.addNewItem = function()
{
	return this.m_uiManager.newControlExt(null, this.getUiStyleClass(), null, null, this, oFF.UiOperation.ADD, oFF.UiItemPosition.CONTENT, -1, -1);
};
oFF.DfUiContext.prototype.addNewItemAt = function(firstIndex, secondIndex)
{
	return this.m_uiManager.newControlExt(null, this.getUiStyleClass(), null, null, this, oFF.UiOperation.SET, oFF.UiItemPosition.COLUMN_ROW, firstIndex, secondIndex);
};
oFF.DfUiContext.prototype.addNew = function(uiType)
{
	return this.m_uiManager.newControlExt(uiType, null, null, null, this, oFF.UiOperation.ADD, oFF.UiItemPosition.CONTENT, -1, -1);
};
oFF.DfUiContext.prototype.newControl = function(uiType)
{
	return this.m_uiManager.newControlExt(uiType, null, null, null, null, null, null, -1, -1);
};
oFF.DfUiContext.prototype.setNew = function(uiType, position)
{
	return this.m_uiManager.newControlExt(uiType, null, null, null, this, oFF.UiOperation.SET, position, -1, -1);
};
oFF.DfUiContext.prototype.newItem = function()
{
	return this.m_uiManager.newControlExt(null, null, null, null, this, null, null, -1, -1);
};
oFF.DfUiContext.prototype.insertNewItem = function(index)
{
	return this.m_uiManager.newControlExt(null, null, null, null, this, oFF.UiOperation.INSERT, oFF.UiItemPosition.CONTENT, index, 0);
};
oFF.DfUiContext.prototype.insertNew = function(uiType, index)
{
	return this.m_uiManager.newControlExt(uiType, null, null, null, this, oFF.UiOperation.INSERT, oFF.UiItemPosition.CONTENT, index, 0);
};
oFF.DfUiContext.prototype.setNewItemAt = function(firstIndex, secondIndex)
{
	return this.m_uiManager.newControlExt(null, null, null, null, this, oFF.UiOperation.SET, oFF.UiItemPosition.COLUMN_ROW, firstIndex, secondIndex);
};
oFF.DfUiContext.prototype.setNewItemAtExt = function(firstIndex, secondIndex)
{
	return this.m_uiManager.newControlExt(null, null, null, null, this, oFF.UiOperation.SET, oFF.UiItemPosition.COLUMN_ROW, firstIndex, secondIndex);
};
oFF.DfUiContext.prototype.newControlExt = function(uiType, styleClass, identifier, name, parent, operation, position, firstIndex, secondIndex)
{
	return this.m_uiManager.newControlExt(uiType, styleClass, identifier, name, parent, operation, position, firstIndex, secondIndex);
};
oFF.DfUiContext.prototype.newBasicControl = function(uiType, styleClass, identifier, name)
{
	return this.m_uiManager.newBasicControl(uiType, styleClass, identifier, name);
};
oFF.DfUiContext.prototype.attach = function(child, operation, position, firstIndex, secondIndex)
{
	if (operation === oFF.UiOperation.ADD)
	{
		this.add(child);
	}
	else if (operation === oFF.UiOperation.INSERT)
	{
		this.insert(firstIndex, child);
	}
	else if (operation === oFF.UiOperation.SET)
	{
		this.setContent(child);
	}
	else
	{
		oFF.noSupport();
	}
	return this;
};
oFF.DfUiContext.prototype.isEmpty = function()
{
	return this.size() === 0;
};
oFF.DfUiContext.prototype.hasElements = function()
{
	return this.size() > 0;
};
oFF.DfUiContext.prototype.size = function()
{
	var nodeType = this.getNodeType();
	if (nodeType === oFF.UiNodeType.LIST)
	{
		return this.getChildItems().size();
	}
	else if (nodeType === oFF.UiNodeType.MAP)
	{
		return this.getChildItems().size();
	}
	else if (nodeType === oFF.UiNodeType.NODE)
	{
		return this.getItemCount();
	}
	else
	{
		return 0;
	}
};
oFF.DfUiContext.prototype.clear = function()
{
	var nodeType = this.getNodeType();
	if (nodeType === oFF.UiNodeType.LIST)
	{
		this.clearChildItems();
	}
	else if (nodeType === oFF.UiNodeType.MAP)
	{
		this.clearContent();
	}
	else if (nodeType === oFF.UiNodeType.NODE)
	{
		this.clearChildItems();
		this.clearContent();
	}
};
oFF.DfUiContext.prototype.getIterator = oFF.noSupport;
oFF.DfUiContext.prototype.getValuesAsReadOnlyList = oFF.noSupport;
oFF.DfUiContext.prototype.contains = oFF.noSupport;
oFF.DfUiContext.prototype.addAll = function(other)
{
	oFF.XListUtils.addAllObjects(other, this);
};
oFF.DfUiContext.prototype.add = function(element)
{
	this.addItem(element);
};
oFF.DfUiContext.prototype.removeElement = function(element)
{
	var index = this.getChildItems().getIndex(element);
	if (index !== -1)
	{
		this.removeAt(index);
	}
	return element;
};
oFF.DfUiContext.prototype.insert = function(index, element)
{
	this.insertItem(element, index);
};
oFF.DfUiContext.prototype.removeAt = function(index)
{
	var itemToRemove = this.getItem(index);
	this.removeItem(itemToRemove);
	return itemToRemove;
};
oFF.DfUiContext.prototype.get = function(index)
{
	return this.getAggregationElementByIndex(oFF.UiAggregation.ITEMS, index);
};
oFF.DfUiContext.prototype.set = function(index, element)
{
	this.setElementIntoAggregation(index, element, oFF.UiAggregation.ITEMS);
};
oFF.DfUiContext.prototype.createArrayCopy = oFF.noSupport;
oFF.DfUiContext.prototype.next = function()
{
	return null;
};
oFF.DfUiContext.prototype.hasNext = function()
{
	return false;
};
oFF.DfUiContext.prototype.getChildItems = function()
{
	return this.getItems();
};
oFF.DfUiContext.prototype.clearChildItems = function()
{
	this.clearItems();
};
oFF.DfUiContext.prototype.getChildItemByName = function(name)
{
	var childItems = this.getChildItems();
	if (oFF.notNull(childItems) && oFF.notNull(name))
	{
		var size = childItems.size();
		for (var i = 0; i < size; i++)
		{
			var childItem = childItems.get(i);
			var childName = childItem.getName();
			if (oFF.notNull(childName) && oFF.XString.compare(name, childName) === 0)
			{
				return childItem;
			}
		}
	}
	return null;
};
oFF.DfUiContext.prototype.getChildItemById = function(itemId)
{
	var childItems = this.getChildItems();
	if (oFF.notNull(childItems) && oFF.notNull(itemId))
	{
		var size = childItems.size();
		for (var i = 0; i < size; i++)
		{
			var childItem = childItems.get(i);
			var childId = childItem.getId();
			if (oFF.notNull(childId) && oFF.XString.compare(itemId, childId) === 0)
			{
				return childItem;
			}
		}
	}
	return null;
};
oFF.DfUiContext.prototype.getChildItemByNameRecursive = function(name)
{
	var childItems = this.getChildItems();
	if (oFF.notNull(childItems) && oFF.notNull(name))
	{
		var size = childItems.size();
		for (var i = 0; i < size; i++)
		{
			var childItem = childItems.get(i);
			var childName = childItem.getName();
			if (oFF.notNull(childName) && oFF.XString.compare(name, childName) === 0)
			{
				return childItem;
			}
			childItem = childItem.getChildItemByNameRecursive(name);
			if (oFF.notNull(childItem))
			{
				return childItem;
			}
		}
	}
	return null;
};
oFF.DfUiContext.prototype.getIndex = function(element)
{
	return this.getIndexOfAggregationElement(oFF.UiAggregation.ITEMS, element);
};
oFF.DfUiContext.prototype.invalidate = function()
{
	return this;
};
oFF.DfUiContext.prototype.layout = function()
{
	return this;
};
oFF.DfUiContext.prototype.invalidateModelContent = function()
{
	return this;
};
oFF.DfUiContext.prototype.suspend = function()
{
	return this;
};
oFF.DfUiContext.prototype.resume = function()
{
	return this;
};
oFF.DfUiContext.prototype.getActiveIndex = function()
{
	return this.m_firstIndex;
};
oFF.DfUiContext.prototype.setActiveIndex = function(index)
{
	this.m_firstIndex = index;
	return this;
};
oFF.DfUiContext.prototype.getColumnIndex = function()
{
	return this.m_firstIndex;
};
oFF.DfUiContext.prototype.getRowIndex = function()
{
	return this.m_secondIndex;
};
oFF.DfUiContext.prototype.setRowIndex = function(index)
{
	return this;
};
oFF.DfUiContext.prototype.setColumnIndex = function(index)
{
	return this;
};
oFF.DfUiContext.prototype.getNativeControl = function()
{
	return null;
};
oFF.DfUiContext.prototype.getBaseControl = function()
{
	return this;
};
oFF.DfUiContext.prototype.setBaseControl = function(baseControl)
{
	return this;
};
oFF.DfUiContext.prototype.updatePropertyValue = function(property, value)
{
	if (oFF.notNull(property) && oFF.notNull(value))
	{
		var valType = value.getValueType();
		if (valType === oFF.XValueType.INTEGER)
		{
			this.putInteger(property.getName(), oFF.XConverterUtils.getInteger(value));
		}
		else if (valType === oFF.XValueType.BOOLEAN)
		{
			this.putBoolean(property.getName(), oFF.XConverterUtils.getBoolean(value));
		}
		else if (valType === oFF.XValueType.DOUBLE)
		{
			this.putDouble(property.getName(), oFF.XConverterUtils.getDouble(value));
		}
		else if (valType === oFF.XValueType.LONG)
		{
			this.putLong(property.getName(), oFF.XConverterUtils.getLong(value));
		}
		else if (valType === oFF.XValueType.STRING)
		{
			this.putString(property.getName(), oFF.XConverterUtils.getString(value));
		}
	}
};
oFF.DfUiContext.prototype.isSingleSelection = function()
{
	return true;
};
oFF.DfUiContext.prototype.isSelectionSet = function()
{
	return !this.isSingleSelection();
};
oFF.DfUiContext.prototype.isCompositeControl = function()
{
	if (this.getUiType() !== null)
	{
		return this.getUiType().isComposite();
	}
	return false;
};
oFF.DfUiContext.prototype.select = function(sigSelExpression)
{
	return this.getUiManager().select(sigSelExpression);
};
oFF.DfUiContext.prototype.selectById = function(identifier)
{
	return this.getUiManager().selectById(identifier);
};
oFF.DfUiContext.prototype.getDefaultItemType = function()
{
	return this.getUiType().getDefaultItemType();
};
oFF.DfUiContext.prototype.reset = function() {};
oFF.DfUiContext.prototype.hasProperty = function(property)
{
	if (this.getUiType() !== null)
	{
		return this.getUiType().hasProperty(property);
	}
	return false;
};
oFF.DfUiContext.prototype.hasAggregation = function(aggrDef)
{
	if (this.getUiType() !== null)
	{
		return this.getUiType().hasAggregation(aggrDef);
	}
	return false;
};
oFF.DfUiContext.prototype.hasMethod = function(method)
{
	if (this.getUiType() !== null)
	{
		return this.getUiType().hasMethod(method);
	}
	return false;
};
oFF.DfUiContext.prototype.hasEvent = function(eventDef)
{
	if (this.getUiType() !== null)
	{
		return this.getUiType().hasEvent(eventDef);
	}
	return false;
};
oFF.DfUiContext.prototype.hasInterface = function(interfaceDef)
{
	if (this.getUiType() !== null)
	{
		return this.getUiType().hasInterface(interfaceDef);
	}
	return false;
};
oFF.DfUiContext.prototype.setId = function(identifier)
{
	this.m_id = identifier;
	return this;
};
oFF.DfUiContext.prototype.setParent = function(parent)
{
	this.setObjectByName(oFF.UiProperty.PARENT.getName(), parent);
	return this;
};
oFF.DfUiContext.prototype.getUiManager = function()
{
	return this.m_uiManager;
};
oFF.DfUiContext.prototype.getComponentType = function()
{
	return this.getUiType();
};
oFF.DfUiContext.prototype.getNodeType = function()
{
	return this.m_uiType.getNodeType();
};
oFF.DfUiContext.prototype.getUiType = function()
{
	return this.m_uiType;
};
oFF.DfUiContext.prototype.getUiStyleClass = function()
{
	return this.m_styleClass;
};
oFF.DfUiContext.prototype.unlinkFromParentAggregation = function()
{
	this.setParent(null);
	this.setParentAggregation(null);
};
oFF.DfUiContext.prototype.linkToParentAggregation = function(parent, parentAggregation)
{
	if (this.getParent() !== null)
	{
		var parentContext = this.getParent();
		parentContext.removeElementFromAggregation(this, this.getParentAggregation());
	}
	if (oFF.notNull(parent) && oFF.notNull(parentAggregation))
	{
		this.setParent(parent);
		this.setParentAggregation(parentAggregation);
	}
};
oFF.DfUiContext.prototype.setSemanticCellStyle = oFF.noSupport;
oFF.DfUiContext.prototype.getSemanticCellStyle = oFF.noSupport;
oFF.DfUiContext.prototype.getSortDirection = oFF.noSupport;
oFF.DfUiContext.prototype.setSortDirection = oFF.noSupport;
oFF.DfUiContext.prototype.isSortable = oFF.noSupport;
oFF.DfUiContext.prototype.setSortable = oFF.noSupport;
oFF.DfUiContext.prototype.setRowCount = function(rowCount)
{
	this.putInteger(oFF.UiProperty.ROW_COUNT.getName(), rowCount);
	return this;
};
oFF.DfUiContext.prototype.getRowCount = function()
{
	return this.getIntegerByKeyExt(oFF.UiProperty.ROW_COUNT.getName(), 0);
};
oFF.DfUiContext.prototype.setColumnCount = function(columnCount)
{
	this.putInteger(oFF.UiProperty.COLUMN_COUNT.getName(), columnCount);
	return this;
};
oFF.DfUiContext.prototype.getColumnCount = function()
{
	return this.getIntegerByKeyExt(oFF.UiProperty.COLUMN_COUNT.getName(), 0);
};
oFF.DfUiContext.prototype.getName = function()
{
	return this.getStringByKey(oFF.UiProperty.NAME.getName());
};
oFF.DfUiContext.prototype.setName = function(name)
{
	var oldName = this.getName();
	this.m_uiManager.updateSelectableElementName(this, oldName, name);
	this.putString(oFF.UiProperty.NAME.getName(), name);
	return this;
};
oFF.DfUiContext.prototype.getText = function()
{
	return this.getStringByKeyExt(oFF.UiProperty.TEXT.getName(), null);
};
oFF.DfUiContext.prototype.setText = function(text)
{
	this.putString(oFF.UiProperty.TEXT.getName(), text);
	return this;
};
oFF.DfUiContext.prototype.getTooltip = function()
{
	return this.getStringByKeyExt(oFF.UiProperty.TOOLTIP.getName(), null);
};
oFF.DfUiContext.prototype.setTooltip = function(tooltip)
{
	this.putString(oFF.UiProperty.TOOLTIP.getName(), tooltip);
	return this;
};
oFF.DfUiContext.prototype.getDescription = function()
{
	return this.getStringByKeyExt(oFF.UiProperty.DESCRIPTION.getName(), null);
};
oFF.DfUiContext.prototype.setDescription = function(description)
{
	this.putString(oFF.UiProperty.DESCRIPTION.getName(), description);
	return this;
};
oFF.DfUiContext.prototype.getTitle = function()
{
	return this.getStringByKeyExt(oFF.UiProperty.TITLE.getName(), null);
};
oFF.DfUiContext.prototype.setTitle = function(title)
{
	this.putString(oFF.UiProperty.TITLE.getName(), title);
	return this;
};
oFF.DfUiContext.prototype.getSubtitle = function()
{
	return this.getStringByKeyExt(oFF.UiProperty.SUBTITLE.getName(), null);
};
oFF.DfUiContext.prototype.setSubtitle = function(subtitle)
{
	this.putString(oFF.UiProperty.SUBTITLE.getName(), subtitle);
	return this;
};
oFF.DfUiContext.prototype.getSrc = function()
{
	return this.getStringByKeyExt(oFF.UiProperty.SRC.getName(), null);
};
oFF.DfUiContext.prototype.setSrc = function(src)
{
	this.putString(oFF.UiProperty.SRC.getName(), src);
	return this;
};
oFF.DfUiContext.prototype.getIcon = function()
{
	return this.getStringByKeyExt(oFF.UiProperty.ICON.getName(), null);
};
oFF.DfUiContext.prototype.setIcon = function(icon)
{
	this.putString(oFF.UiProperty.ICON.getName(), icon);
	return this;
};
oFF.DfUiContext.prototype.getLabel = function()
{
	return this.getStringByKeyExt(oFF.UiProperty.LABEL.getName(), null);
};
oFF.DfUiContext.prototype.setLabel = function(label)
{
	this.putString(oFF.UiProperty.LABEL.getName(), label);
	return this;
};
oFF.DfUiContext.prototype.getValue = function()
{
	return this.getStringByKeyExt(oFF.UiProperty.VALUE.getName(), null);
};
oFF.DfUiContext.prototype.setValue = function(value)
{
	this.putString(oFF.UiProperty.VALUE.getName(), value);
	return this;
};
oFF.DfUiContext.prototype.isEnabled = function()
{
	return this.getBooleanByKeyExt(oFF.UiProperty.ENABLED.getName(), true);
};
oFF.DfUiContext.prototype.setEnabled = function(enabled)
{
	this.putBoolean(oFF.UiProperty.ENABLED.getName(), enabled);
	return this;
};
oFF.DfUiContext.prototype.isEditable = function()
{
	return this.getBooleanByKeyExt(oFF.UiProperty.EDITABLE.getName(), true);
};
oFF.DfUiContext.prototype.setEditable = function(editable)
{
	this.putBoolean(oFF.UiProperty.EDITABLE.getName(), editable);
	return this;
};
oFF.DfUiContext.prototype.isVisible = function()
{
	var defaultValue = this.getUiType().isTypeOf(oFF.UiType.DIALOG) === false;
	return this.getBooleanByKeyExt(oFF.UiProperty.VISIBLE.getName(), defaultValue);
};
oFF.DfUiContext.prototype.setVisible = function(visible)
{
	this.putBoolean(oFF.UiProperty.VISIBLE.getName(), visible);
	return this;
};
oFF.DfUiContext.prototype.isBusy = function()
{
	return this.getBooleanByKeyExt(oFF.UiProperty.BUSY.getName(), false);
};
oFF.DfUiContext.prototype.setBusy = function(busy)
{
	this.putBoolean(oFF.UiProperty.BUSY.getName(), busy);
	return this;
};
oFF.DfUiContext.prototype.isChecked = function()
{
	return this.getBooleanByKeyExt(oFF.UiProperty.CHECKED.getName(), false);
};
oFF.DfUiContext.prototype.setChecked = function(checked)
{
	this.putBoolean(oFF.UiProperty.CHECKED.getName(), checked);
	return this;
};
oFF.DfUiContext.prototype.isSelected = function()
{
	return this.getBooleanByKeyExt(oFF.UiProperty.SELECTED.getName(), false);
};
oFF.DfUiContext.prototype.setSelected = function(selected)
{
	this.putBoolean(oFF.UiProperty.SELECTED.getName(), selected);
	return this;
};
oFF.DfUiContext.prototype.setSelectionMode = function(selectionMode)
{
	return this.setObjectByName(oFF.UiProperty.SELECTION_MODE.getName(), selectionMode);
};
oFF.DfUiContext.prototype.getSelectionMode = function()
{
	return this.getObjectByNameWithDefault(oFF.UiProperty.SELECTION_MODE.getName(), oFF.UiSelectionMode.SINGLE_SELECT);
};
oFF.DfUiContext.prototype.setSelectionBehavior = function(selectionBehavior)
{
	return this.setObjectByName(oFF.UiProperty.SELECTION_BEHAVIOR.getName(), selectionBehavior);
};
oFF.DfUiContext.prototype.getSelectionBehavior = function()
{
	return this.getObjectByNameWithDefault(oFF.UiProperty.SELECTION_BEHAVIOR.getName(), oFF.UiSelectionBehavior.ROW_SELECTOR);
};
oFF.DfUiContext.prototype.setColumnSpan = function(span)
{
	this.putInteger(oFF.UiProperty.COLUMN_SPAN.getName(), span);
	return this;
};
oFF.DfUiContext.prototype.getColumnSpan = function()
{
	return this.getIntegerByKeyExt(oFF.UiProperty.COLUMN_SPAN.getName(), 1);
};
oFF.DfUiContext.prototype.setRowSpan = function(span)
{
	this.putInteger(oFF.UiProperty.ROW_SPAN.getName(), span);
	return this;
};
oFF.DfUiContext.prototype.getRowSpan = function()
{
	return this.getIntegerByKeyExt(oFF.UiProperty.ROW_SPAN.getName(), 1);
};
oFF.DfUiContext.prototype.getSplitterPosition = function()
{
	return this.getIntegerByKeyExt(oFF.UiProperty.SPLITTER_POSITION.getName(), 0);
};
oFF.DfUiContext.prototype.setSplitterPosition = function(splitterPosition)
{
	this.putInteger(oFF.UiProperty.SPLITTER_POSITION.getName(), splitterPosition);
	return this;
};
oFF.DfUiContext.prototype.getTextDecoration = function()
{
	return this.getObjectByNameWithDefault(oFF.UiProperty.TEXT_DECORATION.getName(), null);
};
oFF.DfUiContext.prototype.setTextDecoration = function(textDecoration)
{
	return this.setObjectByName(oFF.UiProperty.TEXT_DECORATION.getName(), textDecoration);
};
oFF.DfUiContext.prototype.isCloseable = function()
{
	return this.getBooleanByKeyExt(oFF.UiProperty.CLOSEABLE.getName(), false);
};
oFF.DfUiContext.prototype.setCloseable = function(isCloseable)
{
	this.putBoolean(oFF.UiProperty.CLOSEABLE.getName(), isCloseable);
	return this;
};
oFF.DfUiContext.prototype.setSectionStart = function(sectionStart)
{
	this.putBoolean(oFF.UiProperty.SECTION_START.getName(), sectionStart);
	return this;
};
oFF.DfUiContext.prototype.isSectionStart = function()
{
	return this.getBooleanByKeyExt(oFF.UiProperty.SECTION_START.getName(), false);
};
oFF.DfUiContext.prototype.getPlaceholder = function()
{
	return this.getStringByKeyExt(oFF.UiProperty.PLACEHOLDER.getName(), null);
};
oFF.DfUiContext.prototype.setPlaceholder = function(placeholder)
{
	this.putString(oFF.UiProperty.PLACEHOLDER.getName(), placeholder);
	return this;
};
oFF.DfUiContext.prototype.setInputType = function(inputType)
{
	return this.setObjectByName(oFF.UiProperty.INPUT_TYPE.getName(), inputType);
};
oFF.DfUiContext.prototype.getInputType = function()
{
	return this.getObjectByNameWithDefault(oFF.UiProperty.INPUT_TYPE.getName(), oFF.UiInputType.TEXT);
};
oFF.DfUiContext.prototype.setListItemType = function(listItemType)
{
	return this.setObjectByName(oFF.UiProperty.LIST_ITEM_TYPE.getName(), listItemType);
};
oFF.DfUiContext.prototype.getListItemType = function()
{
	return this.getObjectByNameWithDefault(oFF.UiProperty.LIST_ITEM_TYPE.getName(), oFF.UiListType.INACTIVE);
};
oFF.DfUiContext.prototype.setButtonType = function(buttonType)
{
	return this.setObjectByName(oFF.UiProperty.BUTTON_TYPE.getName(), buttonType);
};
oFF.DfUiContext.prototype.getButtonType = function()
{
	return this.getObjectByNameWithDefault(oFF.UiProperty.BUTTON_TYPE.getName(), oFF.UiButtonType.DEFAULT);
};
oFF.DfUiContext.prototype.getBackgroundImageSrc = function()
{
	return this.getStringByKeyExt(oFF.UiProperty.BACKGROUND_IMAGE_SRC.getName(), null);
};
oFF.DfUiContext.prototype.setBackgroundImageSrc = function(src)
{
	this.putString(oFF.UiProperty.BACKGROUND_IMAGE_SRC.getName(), src);
	return this;
};
oFF.DfUiContext.prototype.setRotation = function(rotation)
{
	this.putInteger(oFF.UiProperty.ROTATION.getName(), rotation);
	return this;
};
oFF.DfUiContext.prototype.getRotation = function()
{
	return this.getIntegerByKeyExt(oFF.UiProperty.ROTATION.getName(), 0);
};
oFF.DfUiContext.prototype.isRequired = function()
{
	return this.getBooleanByKeyExt(oFF.UiProperty.REQUIRED.getName(), false);
};
oFF.DfUiContext.prototype.setRequired = function(required)
{
	this.putBoolean(oFF.UiProperty.REQUIRED.getName(), required);
	return this;
};
oFF.DfUiContext.prototype.getMaxDate = function()
{
	return this.getStringByKeyExt(oFF.UiProperty.MAX_DATE.getName(), null);
};
oFF.DfUiContext.prototype.setMaxDate = function(maxDate)
{
	this.putString(oFF.UiProperty.MAX_DATE.getName(), maxDate);
	return this;
};
oFF.DfUiContext.prototype.getMinDate = function()
{
	return this.getStringByKeyExt(oFF.UiProperty.MIN_DATE.getName(), null);
};
oFF.DfUiContext.prototype.setMinDate = function(minDate)
{
	this.putString(oFF.UiProperty.MIN_DATE.getName(), minDate);
	return this;
};
oFF.DfUiContext.prototype.getDisplayFormat = function()
{
	return this.getStringByKeyExt(oFF.UiProperty.DISPLAY_FORMAT.getName(), null);
};
oFF.DfUiContext.prototype.setDisplayFormat = function(displayFormat)
{
	this.putString(oFF.UiProperty.DISPLAY_FORMAT.getName(), displayFormat);
	return this;
};
oFF.DfUiContext.prototype.getValueFormat = function()
{
	return this.getStringByKeyExt(oFF.UiProperty.VALUE_FORMAT.getName(), null);
};
oFF.DfUiContext.prototype.setValueFormat = function(valueFormat)
{
	this.putString(oFF.UiProperty.VALUE_FORMAT.getName(), valueFormat);
	return this;
};
oFF.DfUiContext.prototype.getMinutesInterval = function()
{
	return this.getIntegerByKeyExt(oFF.UiProperty.MINUTES_INTERVAL.getName(), 1);
};
oFF.DfUiContext.prototype.setMinutesInterval = function(minInterval)
{
	this.putInteger(oFF.UiProperty.MINUTES_INTERVAL.getName(), minInterval);
	return this;
};
oFF.DfUiContext.prototype.getSecondsInterval = function()
{
	return this.getIntegerByKeyExt(oFF.UiProperty.SECONDS_INTERVAL.getName(), 1);
};
oFF.DfUiContext.prototype.setSecondsInterval = function(secInterval)
{
	this.putInteger(oFF.UiProperty.SECONDS_INTERVAL.getName(), secInterval);
	return this;
};
oFF.DfUiContext.prototype.getMaxLength = function()
{
	return this.getIntegerByKeyExt(oFF.UiProperty.MAX_LENGTH.getName(), 0);
};
oFF.DfUiContext.prototype.setMaxLength = function(maxLength)
{
	this.putInteger(oFF.UiProperty.MAX_LENGTH.getName(), maxLength);
	return this;
};
oFF.DfUiContext.prototype.setTextAlign = function(textAlign)
{
	this.setObjectByName(oFF.UiProperty.TEXT_ALIGN.getName(), textAlign);
	return this;
};
oFF.DfUiContext.prototype.getTextAlign = function()
{
	return this.getObjectByNameWithDefault(oFF.UiProperty.TEXT_ALIGN.getName(), oFF.UiTextAlign.LEFT);
};
oFF.DfUiContext.prototype.setFontStyle = function(fontStyle)
{
	this.setObjectByName(oFF.UiProperty.FONT_STYLE.getName(), fontStyle);
	return this;
};
oFF.DfUiContext.prototype.getFontStyle = function()
{
	return this.getObjectByNameWithDefault(oFF.UiProperty.FONT_STYLE.getName(), null);
};
oFF.DfUiContext.prototype.setFontWeight = function(fontWeight)
{
	this.setObjectByName(oFF.UiProperty.FONT_WEIGHT.getName(), fontWeight);
	return this;
};
oFF.DfUiContext.prototype.getFontWeight = function()
{
	return this.getObjectByNameWithDefault(oFF.UiProperty.FONT_WEIGHT.getName(), null);
};
oFF.DfUiContext.prototype.getPath = function()
{
	return this.getStringByKeyExt(oFF.UiProperty.PATH.getName(), null);
};
oFF.DfUiContext.prototype.setPath = function(path)
{
	this.putString(oFF.UiProperty.PATH.getName(), path);
	return this;
};
oFF.DfUiContext.prototype.getCounter = function()
{
	return this.getIntegerByKeyExt(oFF.UiProperty.COUNTER.getName(), 0);
};
oFF.DfUiContext.prototype.setCounter = function(counter)
{
	this.putInteger(oFF.UiProperty.COUNTER.getName(), counter);
	return this;
};
oFF.DfUiContext.prototype.setHighlight = function(messageType)
{
	this.setObjectByName(oFF.UiProperty.HIGHLIGHT.getName(), messageType);
	return this;
};
oFF.DfUiContext.prototype.getHighlight = function()
{
	return this.getObjectByNameWithDefault(oFF.UiProperty.HIGHLIGHT.getName(), oFF.UiMessageType.NONE);
};
oFF.DfUiContext.prototype.setMessageType = function(messageType)
{
	this.setObjectByName(oFF.UiProperty.MESSAGE_TYPE.getName(), messageType);
	return this;
};
oFF.DfUiContext.prototype.getMessageType = function()
{
	return this.getObjectByNameWithDefault(oFF.UiProperty.MESSAGE_TYPE.getName(), oFF.UiMessageType.NONE);
};
oFF.DfUiContext.prototype.getVisibleRowCount = function()
{
	return this.getIntegerByKeyExt(oFF.UiProperty.VISIBLE_ROW_COUNT.getName(), 10);
};
oFF.DfUiContext.prototype.setVisibleRowCount = function(visibleRowCount)
{
	this.putInteger(oFF.UiProperty.VISIBLE_ROW_COUNT.getName(), visibleRowCount);
	return this;
};
oFF.DfUiContext.prototype.setVisibleRowCountMode = function(visibleRowCountMode)
{
	this.setObjectByName(oFF.UiProperty.VISIBLE_ROW_COUNT_MODE.getName(), visibleRowCountMode);
	return this;
};
oFF.DfUiContext.prototype.getVisibleRowCountMode = function()
{
	return this.getObjectByNameWithDefault(oFF.UiProperty.VISIBLE_ROW_COUNT_MODE.getName(), oFF.UiVisibleRowCountMode.FIXED);
};
oFF.DfUiContext.prototype.getMinRowCount = function()
{
	return this.getIntegerByKeyExt(oFF.UiProperty.MIN_ROW_COUNT.getName(), 5);
};
oFF.DfUiContext.prototype.setMinRowCount = function(minRowCount)
{
	this.putInteger(oFF.UiProperty.MIN_ROW_COUNT.getName(), minRowCount);
	return this;
};
oFF.DfUiContext.prototype.getFirstVisibleRow = function()
{
	return this.getObjectByNameWithDefault(oFF.UiProperty.FIRST_VISIBLE_ROW.getName(), null);
};
oFF.DfUiContext.prototype.setFirstVisibleRow = function(firstVisibleRow)
{
	this.setObjectByName(oFF.UiProperty.FIRST_VISIBLE_ROW.getName(), firstVisibleRow);
	return this;
};
oFF.DfUiContext.prototype.getDebounceTime = function()
{
	return this.getIntegerByKeyExt(oFF.UiProperty.DEBOUNCE_TIME.getName(), 0);
};
oFF.DfUiContext.prototype.setDebounceTime = function(debounceTime)
{
	this.putInteger(oFF.UiProperty.DEBOUNCE_TIME.getName(), debounceTime);
	return this;
};
oFF.DfUiContext.prototype.setDirection = function(direction)
{
	this.setObjectByName(oFF.UiProperty.DIRECTION.getName(), direction);
	return this;
};
oFF.DfUiContext.prototype.getDirection = function()
{
	return this.getObjectByNameWithDefault(oFF.UiProperty.DIRECTION.getName(), oFF.UiFlexDirection.ROW);
};
oFF.DfUiContext.prototype.setAlignItems = function(alignItems)
{
	this.setObjectByName(oFF.UiProperty.ALIGN_ITEMS.getName(), alignItems);
	return this;
};
oFF.DfUiContext.prototype.getAlignItems = function()
{
	return this.getObjectByNameWithDefault(oFF.UiProperty.ALIGN_ITEMS.getName(), oFF.UiFlexAlignItems.STRETCH);
};
oFF.DfUiContext.prototype.setAlignContent = function(alignContent)
{
	this.setObjectByName(oFF.UiProperty.ALIGN_CONTENT.getName(), alignContent);
	return this;
};
oFF.DfUiContext.prototype.getAlignContent = function()
{
	return this.getObjectByNameWithDefault(oFF.UiProperty.ALIGN_CONTENT.getName(), oFF.UiFlexAlignContent.STRETCH);
};
oFF.DfUiContext.prototype.setJustifyContent = function(justifyContent)
{
	this.setObjectByName(oFF.UiProperty.JUSTIFY_CONTENT.getName(), justifyContent);
	return this;
};
oFF.DfUiContext.prototype.getJustifyContent = function()
{
	return this.getObjectByNameWithDefault(oFF.UiProperty.JUSTIFY_CONTENT.getName(), oFF.UiFlexJustifyContent.START);
};
oFF.DfUiContext.prototype.setWrap = function(wrap)
{
	this.setObjectByName(oFF.UiProperty.WRAP.getName(), wrap);
	return this;
};
oFF.DfUiContext.prototype.getWrap = function()
{
	return this.getObjectByNameWithDefault(oFF.UiProperty.WRAP.getName(), oFF.UiFlexWrap.NO_WRAP);
};
oFF.DfUiContext.prototype.setFlex = function(flex)
{
	this.putString(oFF.UiProperty.FLEX.getName(), flex);
	return this;
};
oFF.DfUiContext.prototype.getFlex = function()
{
	return this.getStringByKeyExt(oFF.UiProperty.FLEX.getName(), null);
};
oFF.DfUiContext.prototype.setAlignSelf = function(alignSelf)
{
	this.setObjectByName(oFF.UiProperty.ALIGN_SELF.getName(), alignSelf);
	return this;
};
oFF.DfUiContext.prototype.getAlignSelf = function()
{
	return this.getObjectByNameWithDefault(oFF.UiProperty.ALIGN_SELF.getName(), null);
};
oFF.DfUiContext.prototype.setOrder = function(order)
{
	this.putInteger(oFF.UiProperty.ORDER.getName(), order);
	return this;
};
oFF.DfUiContext.prototype.getOrder = function()
{
	return this.getIntegerByKeyExt(oFF.UiProperty.ORDER.getName(), 0);
};
oFF.DfUiContext.prototype.setEnableSelectAll = function(enableSelectAll)
{
	this.putBoolean(oFF.UiProperty.ENABLE_SELECT_ALL.getName(), enableSelectAll);
	return this;
};
oFF.DfUiContext.prototype.isEnableSelectAll = function()
{
	return this.getBooleanByKeyExt(oFF.UiProperty.ENABLE_SELECT_ALL.getName(), true);
};
oFF.DfUiContext.prototype.isWrapping = function()
{
	return this.getBooleanByKeyExt(oFF.UiProperty.WRAPPING.getName(), false);
};
oFF.DfUiContext.prototype.setWrapping = function(wrapping)
{
	this.putBoolean(oFF.UiProperty.WRAPPING.getName(), wrapping);
	return this;
};
oFF.DfUiContext.prototype.setValueState = function(valueState)
{
	this.setObjectByName(oFF.UiProperty.VALUE_STATE.getName(), valueState);
	return this;
};
oFF.DfUiContext.prototype.getValueState = function()
{
	return this.getObjectByNameWithDefault(oFF.UiProperty.VALUE_STATE.getName(), oFF.UiValueState.NONE);
};
oFF.DfUiContext.prototype.getValueStateText = function()
{
	return this.getStringByKeyExt(oFF.UiProperty.VALUE_STATE_TEXT.getName(), null);
};
oFF.DfUiContext.prototype.setValueStateText = function(valueStateText)
{
	this.putString(oFF.UiProperty.VALUE_STATE_TEXT.getName(), valueStateText);
	return this;
};
oFF.DfUiContext.prototype.setPlacement = function(placementType)
{
	this.setObjectByName(oFF.UiProperty.PLACEMENT.getName(), placementType);
	return this;
};
oFF.DfUiContext.prototype.getPlacement = function()
{
	return this.getObjectByNameWithDefault(oFF.UiProperty.PLACEMENT.getName(), oFF.UiPlacementType.AUTO);
};
oFF.DfUiContext.prototype.isShowNavButton = function()
{
	return this.getBooleanByKeyExt(oFF.UiProperty.SHOW_NAV_BUTTON.getName(), true);
};
oFF.DfUiContext.prototype.setShowNavButton = function(showNavButton)
{
	this.putBoolean(oFF.UiProperty.SHOW_NAV_BUTTON.getName(), showNavButton);
	return this;
};
oFF.DfUiContext.prototype.isShowHeader = function()
{
	return this.getBooleanByKeyExt(oFF.UiProperty.SHOW_HEADER.getName(), true);
};
oFF.DfUiContext.prototype.setShowHeader = function(showHeader)
{
	this.putBoolean(oFF.UiProperty.SHOW_HEADER.getName(), showHeader);
	return this;
};
oFF.DfUiContext.prototype.isOn = function()
{
	return this.getBooleanByKeyExt(oFF.UiProperty.ON.getName(), false);
};
oFF.DfUiContext.prototype.setOn = function(isOn)
{
	this.putBoolean(oFF.UiProperty.ON.getName(), isOn);
	return this;
};
oFF.DfUiContext.prototype.setModelJson = function(model)
{
	return this.setObjectByName(oFF.UiProperty.MODEL_JSON.getName(), model);
};
oFF.DfUiContext.prototype.getModelJson = function()
{
	return this.getObjectByNameWithDefault(oFF.UiProperty.MODEL_JSON.getName(), null);
};
oFF.DfUiContext.prototype.setDataManifest = function(dataManifest)
{
	this.setObjectByName(oFF.UiProperty.DATA_MANIFEST.getName(), dataManifest);
};
oFF.DfUiContext.prototype.getDataManifest = function()
{
	return this.getObjectByNameWithDefault(oFF.UiProperty.DATA_MANIFEST.getName(), null);
};
oFF.DfUiContext.prototype.setCustomObject = function(customObject)
{
	return this.setObjectByName(oFF.UiProperty.CUSTOM_OBJECT.getName(), customObject);
};
oFF.DfUiContext.prototype.getCustomObject = function()
{
	return this.getObjectByNameWithDefault(oFF.UiProperty.CUSTOM_OBJECT.getName(), null);
};
oFF.DfUiContext.prototype.isExpanded = function()
{
	return this.getBooleanByKeyExt(oFF.UiProperty.EXPANDED.getName(), false);
};
oFF.DfUiContext.prototype.setExpanded = function(isExpanded)
{
	this.putBoolean(oFF.UiProperty.EXPANDED.getName(), isExpanded);
	return this;
};
oFF.DfUiContext.prototype.expand = function()
{
	this.setExpanded(true);
	return this;
};
oFF.DfUiContext.prototype.collapse = function()
{
	this.setExpanded(false);
	return this;
};
oFF.DfUiContext.prototype.isNode = function()
{
	return this.getBooleanByKeyExt(oFF.UiProperty.NODE.getName(), false);
};
oFF.DfUiContext.prototype.setNode = function(isNode)
{
	this.putBoolean(oFF.UiProperty.NODE.getName(), isNode);
	return this;
};
oFF.DfUiContext.prototype.getSliderMinimum = function()
{
	return this.getIntegerByKeyExt(oFF.UiProperty.SLIDER_MINIMUM.getName(), 0);
};
oFF.DfUiContext.prototype.setSliderMinimum = function(minimum)
{
	this.putInteger(oFF.UiProperty.SLIDER_MINIMUM.getName(), minimum);
	return this;
};
oFF.DfUiContext.prototype.getSliderMaximum = function()
{
	return this.getIntegerByKeyExt(oFF.UiProperty.SLIDER_MAXIMUM.getName(), 0);
};
oFF.DfUiContext.prototype.setSliderMaximum = function(maximum)
{
	this.putInteger(oFF.UiProperty.SLIDER_MAXIMUM.getName(), maximum);
	return this;
};
oFF.DfUiContext.prototype.getSliderValue = function()
{
	return this.getIntegerByKeyExt(oFF.UiProperty.SLIDER_VALUE.getName(), 0);
};
oFF.DfUiContext.prototype.setSliderValue = function(value)
{
	this.putInteger(oFF.UiProperty.SLIDER_VALUE.getName(), value);
	return this;
};
oFF.DfUiContext.prototype.getSliderUpperValue = function()
{
	return this.getIntegerByKeyExt(oFF.UiProperty.SLIDER_UPPER_VALUE.getName(), 0);
};
oFF.DfUiContext.prototype.setSliderUpperValue = function(value)
{
	this.putInteger(oFF.UiProperty.SLIDER_UPPER_VALUE.getName(), value);
	return this;
};
oFF.DfUiContext.prototype.getSliderStep = function()
{
	return this.getIntegerByKeyExt(oFF.UiProperty.SLIDER_STEP.getName(), 1);
};
oFF.DfUiContext.prototype.setSliderStep = function(step)
{
	this.putInteger(oFF.UiProperty.SLIDER_STEP.getName(), step);
	return this;
};
oFF.DfUiContext.prototype.getTag = function()
{
	return this.getStringByKeyExt(oFF.UiProperty.TAG.getName(), null);
};
oFF.DfUiContext.prototype.setTag = function(tag)
{
	this.putString(oFF.UiProperty.TAG.getName(), tag);
	return this;
};
oFF.DfUiContext.prototype.getOnText = function()
{
	return this.getStringByKeyExt(oFF.UiProperty.ON_TEXT.getName(), null);
};
oFF.DfUiContext.prototype.setOnText = function(onText)
{
	this.putString(oFF.UiProperty.ON_TEXT.getName(), onText);
	return this;
};
oFF.DfUiContext.prototype.getOffText = function()
{
	return this.getStringByKeyExt(oFF.UiProperty.OFF_TEXT.getName(), null);
};
oFF.DfUiContext.prototype.setOffText = function(offText)
{
	this.putString(oFF.UiProperty.OFF_TEXT.getName(), offText);
	return this;
};
oFF.DfUiContext.prototype.getCodeType = function()
{
	return this.getStringByKeyExt(oFF.UiProperty.CODE_TYPE.getName(), "javascript");
};
oFF.DfUiContext.prototype.setCodeType = function(codeType)
{
	this.putString(oFF.UiProperty.CODE_TYPE.getName(), codeType);
	return this;
};
oFF.DfUiContext.prototype.getCustomParameters = function()
{
	return this.getObjectByNameWithDefault(oFF.UiProperty.CUSTOM_PARAMETERS.getName(), null);
};
oFF.DfUiContext.prototype.setCustomParameters = function(customParameters)
{
	return this.setObjectByName(oFF.UiProperty.CUSTOM_PARAMETERS.getName(), customParameters);
};
oFF.DfUiContext.prototype.isExpandable = function()
{
	return this.getBooleanByKeyExt(oFF.UiProperty.EXPANDABLE.getName(), false);
};
oFF.DfUiContext.prototype.setExpandable = function(expandable)
{
	this.putBoolean(oFF.UiProperty.EXPANDABLE.getName(), expandable);
	return this;
};
oFF.DfUiContext.prototype.setIntervalSelection = function(intervalSelection)
{
	this.putBoolean(oFF.UiProperty.INTERVAL_SELECTION.getName(), intervalSelection);
	return this;
};
oFF.DfUiContext.prototype.isIntervalSelection = function()
{
	return this.getBooleanByKeyExt(oFF.UiProperty.INTERVAL_SELECTION.getName(), false);
};
oFF.DfUiContext.prototype.getStartDate = function()
{
	return this.getStringByKeyExt(oFF.UiProperty.START_DATE.getName(), null);
};
oFF.DfUiContext.prototype.setStartDate = function(startDate)
{
	this.putString(oFF.UiProperty.START_DATE.getName(), startDate);
	return this;
};
oFF.DfUiContext.prototype.getEndDate = function()
{
	return this.getStringByKeyExt(oFF.UiProperty.END_DATE.getName(), null);
};
oFF.DfUiContext.prototype.setEndDate = function(endDate)
{
	this.putString(oFF.UiProperty.END_DATE.getName(), endDate);
	return this;
};
oFF.DfUiContext.prototype.setPressed = function(pressed)
{
	this.putBoolean(oFF.UiProperty.PRESSED.getName(), pressed);
	return this;
};
oFF.DfUiContext.prototype.isPressed = function()
{
	return this.getBooleanByKeyExt(oFF.UiProperty.PRESSED.getName(), false);
};
oFF.DfUiContext.prototype.getOpacity = function()
{
	return this.getDoubleByKeyExt(oFF.UiProperty.OPACITY.getName(), 1.0);
};
oFF.DfUiContext.prototype.setOpacity = function(opacity)
{
	this.putDouble(oFF.UiProperty.OPACITY.getName(), opacity);
	return this;
};
oFF.DfUiContext.prototype.getPrompt = function()
{
	return this.getStringByKeyExt(oFF.UiProperty.PROMPT.getName(), null);
};
oFF.DfUiContext.prototype.setPrompt = function(prompt)
{
	this.putString(oFF.UiProperty.PROMPT.getName(), prompt);
	return this;
};
oFF.DfUiContext.prototype.isShowSorting = function()
{
	return this.getBooleanByKeyExt(oFF.UiProperty.SHOW_SORTING.getName(), false);
};
oFF.DfUiContext.prototype.setShowSorting = function(showSorting)
{
	this.putBoolean(oFF.UiProperty.SHOW_SORTING.getName(), showSorting);
	return this;
};
oFF.DfUiContext.prototype.isShowValue = function()
{
	return this.getBooleanByKeyExt(oFF.UiProperty.SHOW_VALUE.getName(), true);
};
oFF.DfUiContext.prototype.setShowValue = function(showValue)
{
	this.putBoolean(oFF.UiProperty.SHOW_VALUE.getName(), showValue);
	return this;
};
oFF.DfUiContext.prototype.isAnimated = function()
{
	return this.getBooleanByKeyExt(oFF.UiProperty.ANIMATED.getName(), true);
};
oFF.DfUiContext.prototype.setAnimated = function(animated)
{
	this.putBoolean(oFF.UiProperty.ANIMATED.getName(), animated);
	return this;
};
oFF.DfUiContext.prototype.getPercentValue = function()
{
	return this.getDoubleByKeyExt(oFF.UiProperty.PERCENT_VALUE.getName(), 0);
};
oFF.DfUiContext.prototype.setPercentValue = function(value)
{
	this.putDouble(oFF.UiProperty.PERCENT_VALUE.getName(), value);
	return this;
};
oFF.DfUiContext.prototype.setOverflow = function(overflow)
{
	this.setObjectByName(oFF.UiProperty.OVERFLOW.getName(), overflow);
	return this;
};
oFF.DfUiContext.prototype.getOverflow = function()
{
	return this.getObjectByNameWithDefault(oFF.UiProperty.OVERFLOW.getName(), null);
};
oFF.DfUiContext.prototype.setLoadState = function(loadState)
{
	this.setObjectByName(oFF.UiProperty.LOAD_STATE.getName(), loadState);
	return this;
};
oFF.DfUiContext.prototype.getLoadState = function()
{
	return this.getObjectByNameWithDefault(oFF.UiProperty.LOAD_STATE.getName(), oFF.UiLoadState.LOADED);
};
oFF.DfUiContext.prototype.setFrameType = function(frameType)
{
	this.setObjectByName(oFF.UiProperty.FRAME_TYPE.getName(), frameType);
	return this;
};
oFF.DfUiContext.prototype.getFrameType = function()
{
	return this.getObjectByNameWithDefault(oFF.UiProperty.FRAME_TYPE.getName(), oFF.UiFrameType.ONE_BY_ONE);
};
oFF.DfUiContext.prototype.setTileMode = function(tileMode)
{
	this.setObjectByName(oFF.UiProperty.TILE_MODE.getName(), tileMode);
	return this;
};
oFF.DfUiContext.prototype.getTileMode = function()
{
	return this.getObjectByNameWithDefault(oFF.UiProperty.TILE_MODE.getName(), oFF.UiTileMode.CONTENT_MODE);
};
oFF.DfUiContext.prototype.isDraggable = function()
{
	return this.getBooleanByKeyExt(oFF.UiProperty.DRAGGABLE.getName(), false);
};
oFF.DfUiContext.prototype.setDraggable = function(draggable)
{
	this.putBoolean(oFF.UiProperty.DRAGGABLE.getName(), draggable);
	return this;
};
oFF.DfUiContext.prototype.setDropInfo = function(dropInfo)
{
	this.setObjectByName(oFF.UiProperty.DROP_INFO.getName(), dropInfo);
	return this;
};
oFF.DfUiContext.prototype.getDropInfo = function()
{
	return this.getObjectByNameWithDefault(oFF.UiProperty.DROP_INFO.getName(), null);
};
oFF.DfUiContext.prototype.getCssClass = function()
{
	return this.getStringByKeyExt(oFF.UiProperty.CSS_CLASS.getName(), null);
};
oFF.DfUiContext.prototype.setCssClass = function(cssClass)
{
	this.putString(oFF.UiProperty.CSS_CLASS.getName(), cssClass);
	return this;
};
oFF.DfUiContext.prototype.isPartiallyChecked = function()
{
	return this.getBooleanByKeyExt(oFF.UiProperty.PARTIALLY_CHECKED.getName(), false);
};
oFF.DfUiContext.prototype.setPartiallyChecked = function(partiallyChecked)
{
	this.putBoolean(oFF.UiProperty.PARTIALLY_CHECKED.getName(), partiallyChecked);
	return this;
};
oFF.DfUiContext.prototype.isApplyContentPadding = function()
{
	return this.getBooleanByKeyExt(oFF.UiProperty.APPLY_CONTENT_PADDING.getName(), true);
};
oFF.DfUiContext.prototype.setApplyContentPadding = function(applyContentPadding)
{
	this.putBoolean(oFF.UiProperty.APPLY_CONTENT_PADDING.getName(), applyContentPadding);
	return this;
};
oFF.DfUiContext.prototype.isEnableReordering = function()
{
	return this.getBooleanByKeyExt(oFF.UiProperty.ENABLE_REORDERING.getName(), false);
};
oFF.DfUiContext.prototype.setEnableReordering = function(enableReordering)
{
	this.putBoolean(oFF.UiProperty.ENABLE_REORDERING.getName(), enableReordering);
	return this;
};
oFF.DfUiContext.prototype.setHeaderMode = function(headerMode)
{
	this.setObjectByName(oFF.UiProperty.HEADER_MODE.getName(), headerMode);
	return this;
};
oFF.DfUiContext.prototype.getHeaderMode = function()
{
	return this.getObjectByNameWithDefault(oFF.UiProperty.HEADER_MODE.getName(), oFF.UiIconTabBarHeaderMode.STANDARD);
};
oFF.DfUiContext.prototype.getCount = function()
{
	return this.getStringByKeyExt(oFF.UiProperty.COUNT.getName(), null);
};
oFF.DfUiContext.prototype.setCount = function(count)
{
	this.putString(oFF.UiProperty.COUNT.getName(), count);
	return this;
};
oFF.DfUiContext.prototype.isShowAddNewButton = function()
{
	return this.getBooleanByKeyExt(oFF.UiProperty.SHOW_ADD_NEW_BUTTON.getName(), false);
};
oFF.DfUiContext.prototype.setShowAddNewButton = function(showAddNewButton)
{
	this.putBoolean(oFF.UiProperty.SHOW_ADD_NEW_BUTTON.getName(), showAddNewButton);
	return this;
};
oFF.DfUiContext.prototype.isModified = function()
{
	return this.getBooleanByKeyExt(oFF.UiProperty.MODIFIED.getName(), false);
};
oFF.DfUiContext.prototype.setModified = function(modified)
{
	this.putBoolean(oFF.UiProperty.MODIFIED.getName(), modified);
	return this;
};
oFF.DfUiContext.prototype.isResizable = function()
{
	return this.getBooleanByKeyExt(oFF.UiProperty.RESIZABLE.getName(), false);
};
oFF.DfUiContext.prototype.setResizable = function(resizable)
{
	this.putBoolean(oFF.UiProperty.RESIZABLE.getName(), resizable);
	return this;
};
oFF.DfUiContext.prototype.getBorderStyle = function()
{
	return this.getObjectByNameWithDefault(oFF.UiProperty.BORDER_STYLE.getName(), null);
};
oFF.DfUiContext.prototype.setBorderStyle = function(borderStyle)
{
	this.setObjectByName(oFF.UiProperty.BORDER_STYLE.getName(), borderStyle);
	return this;
};
oFF.DfUiContext.prototype.setState = function(state)
{
	this.setObjectByName(oFF.UiProperty.STATE.getName(), state);
	return this;
};
oFF.DfUiContext.prototype.getState = function()
{
	return this.getObjectByNameWithDefault(oFF.UiProperty.STATE.getName(), oFF.UiValueState.NONE);
};
oFF.DfUiContext.prototype.getAnimationDuration = function()
{
	return this.getIntegerByKeyExt(oFF.UiProperty.ANIMATION_DURATION.getName(), 0);
};
oFF.DfUiContext.prototype.setAnimationDuration = function(animationDuration)
{
	this.putInteger(oFF.UiProperty.ANIMATION_DURATION.getName(), animationDuration);
	return this;
};
oFF.DfUiContext.prototype.getContent = function()
{
	return this.getObjectByNameWithDefault(oFF.UiProperty.CONTENT.getName(), null);
};
oFF.DfUiContext.prototype.setContent = function(content)
{
	this.setContentInternal(content);
	this.setObjectByName(oFF.UiProperty.CONTENT.getName(), content);
	return this;
};
oFF.DfUiContext.prototype.setNewContent = function(uiType)
{
	if (oFF.notNull(uiType))
	{
		var newContent = this.newBasicControl(uiType, null, null, null);
		this.setContent(newContent);
		return newContent;
	}
	return null;
};
oFF.DfUiContext.prototype.clearContent = function()
{
	this.setObjectByName(oFF.UiProperty.CONTENT.getName(), null);
};
oFF.DfUiContext.prototype.getFooter = function()
{
	return this.getObjectByNameWithDefault(oFF.UiProperty.FOOTER.getName(), null);
};
oFF.DfUiContext.prototype.setFooter = function(footer)
{
	this.setContentInternal(footer);
	this.setObjectByName(oFF.UiProperty.FOOTER.getName(), footer);
	return this;
};
oFF.DfUiContext.prototype.setNewFooter = function(uiType)
{
	if (oFF.notNull(uiType))
	{
		var newFooter = this.newBasicControl(uiType, null, null, null);
		this.setFooter(newFooter);
		return newFooter;
	}
	return null;
};
oFF.DfUiContext.prototype.clearFooter = function()
{
	this.setObjectByName(oFF.UiProperty.FOOTER.getName(), null);
	return this;
};
oFF.DfUiContext.prototype.getSubHeader = function()
{
	return this.getObjectByNameWithDefault(oFF.UiProperty.SUB_HEADER.getName(), null);
};
oFF.DfUiContext.prototype.setSubHeader = function(subHeader)
{
	this.setContentInternal(subHeader);
	this.setObjectByName(oFF.UiProperty.SUB_HEADER.getName(), subHeader);
	return this;
};
oFF.DfUiContext.prototype.setNewSubHeader = function(uiType)
{
	if (oFF.notNull(uiType))
	{
		var newSubHeader = this.newBasicControl(uiType, null, null, null);
		this.setSubHeader(newSubHeader);
		return newSubHeader;
	}
	return null;
};
oFF.DfUiContext.prototype.clearSubHeader = function()
{
	this.setObjectByName(oFF.UiProperty.SUB_HEADER.getName(), null);
	return this;
};
oFF.DfUiContext.prototype.getHeader = function()
{
	return this.getObjectByNameWithDefault(oFF.UiProperty.HEADER.getName(), null);
};
oFF.DfUiContext.prototype.setHeader = function(header)
{
	this.setContentInternal(header);
	this.setObjectByName(oFF.UiProperty.HEADER.getName(), header);
	return this;
};
oFF.DfUiContext.prototype.setNewHeader = function(uiType)
{
	if (oFF.notNull(uiType))
	{
		var newHeader = this.newBasicControl(uiType, null, null, null);
		this.setHeader(newHeader);
		return newHeader;
	}
	return null;
};
oFF.DfUiContext.prototype.clearHeader = function()
{
	this.setObjectByName(oFF.UiProperty.HEADER.getName(), null);
	return this;
};
oFF.DfUiContext.prototype.setCommandHistory = function(commands)
{
	this.setObjectByName(oFF.UiProperty.COMMAND_HISTORY.getName(), commands);
	return this;
};
oFF.DfUiContext.prototype.getCommandHistory = function()
{
	var tmpList = this.getObjectName(oFF.UiProperty.COMMAND_HISTORY.getName());
	if (oFF.isNull(tmpList))
	{
		return oFF.XListOfString.create();
	}
	return tmpList;
};
oFF.DfUiContext.prototype.addCommandToHistory = function(command)
{
	var tmpList = this.getObjectName(oFF.UiProperty.COMMAND_HISTORY.getName());
	if (oFF.isNull(tmpList))
	{
		tmpList = oFF.XListOfString.create();
	}
	tmpList.add(command);
	this.setCommandHistory(tmpList);
	return this;
};
oFF.DfUiContext.prototype.getLastCommandFromHistory = function()
{
	var tmpList = this.getCommandHistory();
	if (oFF.isNull(tmpList))
	{
		return null;
	}
	return tmpList.get(tmpList.size() - 1);
};
oFF.DfUiContext.prototype.clearCommandHistory = function()
{
	this.setCommandHistory(null);
	return this;
};
oFF.DfUiContext.prototype.getId = function()
{
	return this.m_id;
};
oFF.DfUiContext.prototype.getParent = function()
{
	return this.getObjectByNameWithDefault(oFF.UiProperty.PARENT.getName(), null);
};
oFF.DfUiContext.prototype.isOpen = function()
{
	return this.getBooleanByKeyExt(oFF.UiProperty.OPEN.getName(), false);
};
oFF.DfUiContext.prototype.isMaximized = function()
{
	return this.getBooleanByKeyExt(oFF.UiProperty.MAXIMIZED.getName(), false);
};
oFF.DfUiContext.prototype.isHidden = function()
{
	return this.getBooleanByKeyExt(oFF.UiProperty.HIDDEN.getName(), false);
};
oFF.DfUiContext.prototype.getX = function()
{
	return this.getObjectByNameWithDefault(oFF.UiProperty.X_POS.getName(), null);
};
oFF.DfUiContext.prototype.setX = function(x)
{
	this.setObjectByName(oFF.UiProperty.X_POS.getName(), x);
	return this;
};
oFF.DfUiContext.prototype.getY = function()
{
	return this.getObjectByNameWithDefault(oFF.UiProperty.Y_POS.getName(), null);
};
oFF.DfUiContext.prototype.setY = function(y)
{
	this.setObjectByName(oFF.UiProperty.Y_POS.getName(), y);
	return this;
};
oFF.DfUiContext.prototype.getHeight = function()
{
	return this.getObjectByNameWithDefault(oFF.UiProperty.HEIGHT.getName(), null);
};
oFF.DfUiContext.prototype.setHeight = function(height)
{
	this.setObjectByName(oFF.UiProperty.HEIGHT.getName(), height);
	return this;
};
oFF.DfUiContext.prototype.getWidth = function()
{
	return this.getObjectByNameWithDefault(oFF.UiProperty.WIDTH.getName(), null);
};
oFF.DfUiContext.prototype.setWidth = function(width)
{
	this.setObjectByName(oFF.UiProperty.WIDTH.getName(), width);
	return this;
};
oFF.DfUiContext.prototype.getPosition = function()
{
	return oFF.UiPosition.createExt(this.getX(), this.getY());
};
oFF.DfUiContext.prototype.setPosition = function(position)
{
	if (oFF.notNull(position))
	{
		this.setX(position.getX());
		this.setY(position.getY());
	}
	else
	{
		this.setX(null);
		this.setY(null);
	}
	return this;
};
oFF.DfUiContext.prototype.getSize = function()
{
	return oFF.UiSize.createExt(this.getWidth(), this.getHeight());
};
oFF.DfUiContext.prototype.setSize = function(size)
{
	if (oFF.notNull(size))
	{
		this.setWidth(size.getWidth());
		this.setHeight(size.getHeight());
	}
	else
	{
		this.setWidth(null);
		this.setHeight(null);
	}
	return this;
};
oFF.DfUiContext.prototype.getMinHeight = function()
{
	return this.getObjectByNameWithDefault(oFF.UiProperty.MIN_HEIGHT.getName(), null);
};
oFF.DfUiContext.prototype.setMinHeight = function(minHeight)
{
	this.setObjectByName(oFF.UiProperty.MIN_HEIGHT.getName(), minHeight);
	return this;
};
oFF.DfUiContext.prototype.getMaxHeight = function()
{
	return this.getObjectByNameWithDefault(oFF.UiProperty.MAX_HEIGHT.getName(), null);
};
oFF.DfUiContext.prototype.setMaxHeight = function(maxHeight)
{
	this.setObjectByName(oFF.UiProperty.MAX_HEIGHT.getName(), maxHeight);
	return this;
};
oFF.DfUiContext.prototype.getMinWidth = function()
{
	return this.getObjectByNameWithDefault(oFF.UiProperty.MIN_WIDTH.getName(), null);
};
oFF.DfUiContext.prototype.setMinWidth = function(minWidth)
{
	this.setObjectByName(oFF.UiProperty.MIN_WIDTH.getName(), minWidth);
	return this;
};
oFF.DfUiContext.prototype.getMaxWidth = function()
{
	return this.getObjectByNameWithDefault(oFF.UiProperty.MAX_WIDTH.getName(), null);
};
oFF.DfUiContext.prototype.setMaxWidth = function(maxWidth)
{
	this.setObjectByName(oFF.UiProperty.MAX_WIDTH.getName(), maxWidth);
	return this;
};
oFF.DfUiContext.prototype.useMaxWidth = function()
{
	return this.setWidth(oFF.UiCssLength.createExt(100, oFF.UiCssSizeUnit.PERCENT));
};
oFF.DfUiContext.prototype.useMaxHeight = function()
{
	return this.setHeight(oFF.UiCssLength.createExt(100, oFF.UiCssSizeUnit.PERCENT));
};
oFF.DfUiContext.prototype.useMaxSpace = function()
{
	this.useMaxHeight();
	this.useMaxWidth();
	return this;
};
oFF.DfUiContext.prototype.getOffsetHeight = function()
{
	return this.getIntegerByKeyExt(oFF.UiProperty.OFFSET_HEIGHT.getName(), 0);
};
oFF.DfUiContext.prototype.getOffsetWidth = function()
{
	return this.getIntegerByKeyExt(oFF.UiProperty.OFFSET_WIDTH.getName(), 0);
};
oFF.DfUiContext.prototype.getPadding = function()
{
	return this.getObjectByNameWithDefault(oFF.UiProperty.PADDING.getName(), null);
};
oFF.DfUiContext.prototype.setPadding = function(padding)
{
	return this.setObjectByName(oFF.UiProperty.PADDING.getName(), padding);
};
oFF.DfUiContext.prototype.getMargin = function()
{
	return this.getObjectByNameWithDefault(oFF.UiProperty.MARGIN.getName(), null);
};
oFF.DfUiContext.prototype.setMargin = function(margin)
{
	return this.setObjectByName(oFF.UiProperty.MARGIN.getName(), margin);
};
oFF.DfUiContext.prototype.getFontSize = function()
{
	return this.getObjectByNameWithDefault(oFF.UiProperty.FONT_SIZE.getName(), null);
};
oFF.DfUiContext.prototype.setFontSize = function(fontSize)
{
	return this.setObjectByName(oFF.UiProperty.FONT_SIZE.getName(), fontSize);
};
oFF.DfUiContext.prototype.getIconSize = function()
{
	return this.getObjectByNameWithDefault(oFF.UiProperty.ICON_SIZE.getName(), null);
};
oFF.DfUiContext.prototype.setIconSize = function(iconSize)
{
	return this.setObjectByName(oFF.UiProperty.ICON_SIZE.getName(), iconSize);
};
oFF.DfUiContext.prototype.getCornerRadius = function()
{
	return this.getObjectByNameWithDefault(oFF.UiProperty.CORNER_RADIUS.getName(), null);
};
oFF.DfUiContext.prototype.setCornerRadius = function(cornerRadius)
{
	return this.setObjectByName(oFF.UiProperty.CORNER_RADIUS.getName(), cornerRadius);
};
oFF.DfUiContext.prototype.getBorderWidth = function()
{
	return this.getObjectByNameWithDefault(oFF.UiProperty.BORDER_WIDTH.getName(), null);
};
oFF.DfUiContext.prototype.setBorderWidth = function(borderWidth)
{
	return this.setObjectByName(oFF.UiProperty.BORDER_WIDTH.getName(), borderWidth);
};
oFF.DfUiContext.prototype.getHeaderHeight = function()
{
	return this.getObjectByNameWithDefault(oFF.UiProperty.HEADER_HEIGHT.getName(), null);
};
oFF.DfUiContext.prototype.setHeaderHeight = function(headerHeight)
{
	return this.setObjectByName(oFF.UiProperty.HEADER_HEIGHT.getName(), headerHeight);
};
oFF.DfUiContext.prototype.getFooterHeight = function()
{
	return this.getObjectByNameWithDefault(oFF.UiProperty.FOOTER_HEIGHT.getName(), null);
};
oFF.DfUiContext.prototype.setFooterHeight = function(footerHeight)
{
	return this.setObjectByName(oFF.UiProperty.FOOTER_HEIGHT.getName(), footerHeight);
};
oFF.DfUiContext.prototype.setBorderColor = function(borderColor)
{
	return this.setObjectByName(oFF.UiProperty.BORDER_COLOR.getName(), borderColor);
};
oFF.DfUiContext.prototype.getBorderColor = function()
{
	return this.getObjectByNameWithDefault(oFF.UiProperty.BORDER_COLOR.getName(), null);
};
oFF.DfUiContext.prototype.setBackgroundColor = function(backgroundColor)
{
	this.setObjectByName(oFF.UiProperty.BACKGROUND_COLOR.getName(), backgroundColor);
	return this;
};
oFF.DfUiContext.prototype.getBackgroundColor = function()
{
	return this.getObjectByNameWithDefault(oFF.UiProperty.BACKGROUND_COLOR.getName(), null);
};
oFF.DfUiContext.prototype.setFontColor = function(fontColor)
{
	return this.setObjectByName(oFF.UiProperty.FONT_COLOR.getName(), fontColor);
};
oFF.DfUiContext.prototype.getFontColor = function()
{
	return this.getObjectByNameWithDefault(oFF.UiProperty.FONT_COLOR.getName(), null);
};
oFF.DfUiContext.prototype.getColor = function()
{
	return this.getObjectByNameWithDefault(oFF.UiProperty.COLOR.getName(), null);
};
oFF.DfUiContext.prototype.setColor = function(color)
{
	this.setObjectByName(oFF.UiProperty.COLOR.getName(), color);
	return this;
};
oFF.DfUiContext.prototype.hasButtons = function()
{
	return this.getButtonCount() > 0;
};
oFF.DfUiContext.prototype.getButtonCount = function()
{
	return this.getAggregationSize(oFF.UiAggregation.BUTTONS);
};
oFF.DfUiContext.prototype.getButton = function(index)
{
	return this.getAggregationElementByIndex(oFF.UiAggregation.BUTTONS, index);
};
oFF.DfUiContext.prototype.getIndexOfButton = function(button)
{
	return this.getIndexOfAggregationElement(oFF.UiAggregation.BUTTONS, button);
};
oFF.DfUiContext.prototype.getButtonByName = function(name)
{
	return this.getAggregationElementByName(oFF.UiAggregation.BUTTONS, name);
};
oFF.DfUiContext.prototype.getButtons = function()
{
	return this.getAggregation(oFF.UiAggregation.BUTTONS);
};
oFF.DfUiContext.prototype.newButton = function()
{
	var newButton = this.newBasicControl(oFF.UiType.BUTTON, null, null, null);
	return newButton;
};
oFF.DfUiContext.prototype.addNewButton = function()
{
	var newButton = this.newButton();
	this.addButton(newButton);
	return newButton;
};
oFF.DfUiContext.prototype.addAllButtons = function(buttonList)
{
	var size = buttonList.size();
	for (var i = 0; i < size; i++)
	{
		this.addButton(buttonList.get(i));
	}
	return this;
};
oFF.DfUiContext.prototype.addButton = function(button)
{
	this.addElementToAggregation(button, oFF.UiAggregation.BUTTONS);
	return this;
};
oFF.DfUiContext.prototype.insertButton = function(button, index)
{
	this.insertElementIntoAggregation(button, index, oFF.UiAggregation.BUTTONS);
	return this;
};
oFF.DfUiContext.prototype.removeButton = function(button)
{
	this.removeElementFromAggregation(button, oFF.UiAggregation.BUTTONS);
	return this;
};
oFF.DfUiContext.prototype.clearButtons = function()
{
	this.clearAggregation(oFF.UiAggregation.BUTTONS);
	return this;
};
oFF.DfUiContext.prototype.hasDialogButtons = function()
{
	return this.getDialogButtonCount() > 0;
};
oFF.DfUiContext.prototype.getDialogButtonCount = function()
{
	return this.getAggregationSize(oFF.UiAggregation.DIALOG_BUTTONS);
};
oFF.DfUiContext.prototype.getDialogButton = function(index)
{
	return this.getAggregationElementByIndex(oFF.UiAggregation.DIALOG_BUTTONS, index);
};
oFF.DfUiContext.prototype.getIndexOfDialogButton = function(dialogButton)
{
	return this.getIndexOfAggregationElement(oFF.UiAggregation.DIALOG_BUTTONS, dialogButton);
};
oFF.DfUiContext.prototype.getDialogButtonByName = function(name)
{
	return this.getAggregationElementByName(oFF.UiAggregation.DIALOG_BUTTONS, name);
};
oFF.DfUiContext.prototype.getDialogButtons = function()
{
	return this.getAggregation(oFF.UiAggregation.DIALOG_BUTTONS);
};
oFF.DfUiContext.prototype.newDialogButton = function()
{
	var newDialogButton = this.newBasicControl(oFF.UiType.DIALOG_BUTTON, null, null, null);
	return newDialogButton;
};
oFF.DfUiContext.prototype.addNewDialogButton = function()
{
	var newDialogButton = this.newDialogButton();
	this.addDialogButton(newDialogButton);
	return newDialogButton;
};
oFF.DfUiContext.prototype.addAllDialogButtons = function(dialogButtonList)
{
	var size = dialogButtonList.size();
	for (var i = 0; i < size; i++)
	{
		this.addDialogButton(dialogButtonList.get(i));
	}
	return this;
};
oFF.DfUiContext.prototype.addDialogButton = function(dialogButton)
{
	this.addElementToAggregation(dialogButton, oFF.UiAggregation.DIALOG_BUTTONS);
	return this;
};
oFF.DfUiContext.prototype.insertDialogButton = function(dialogButton, index)
{
	this.insertElementIntoAggregation(dialogButton, index, oFF.UiAggregation.DIALOG_BUTTONS);
	return this;
};
oFF.DfUiContext.prototype.removeDialogButton = function(dialogButton)
{
	this.removeElementFromAggregation(dialogButton, oFF.UiAggregation.DIALOG_BUTTONS);
	return this;
};
oFF.DfUiContext.prototype.clearDialogButtons = function()
{
	this.clearAggregation(oFF.UiAggregation.DIALOG_BUTTONS);
	return this;
};
oFF.DfUiContext.prototype.hasPageButtons = function()
{
	return this.getPageButtonCount() > 0;
};
oFF.DfUiContext.prototype.getPageButtonCount = function()
{
	return this.getAggregationSize(oFF.UiAggregation.PAGE_BUTTONS);
};
oFF.DfUiContext.prototype.getPageButton = function(index)
{
	return this.getAggregationElementByIndex(oFF.UiAggregation.PAGE_BUTTONS, index);
};
oFF.DfUiContext.prototype.getIndexOfPageButton = function(pageButton)
{
	return this.getIndexOfAggregationElement(oFF.UiAggregation.PAGE_BUTTONS, pageButton);
};
oFF.DfUiContext.prototype.getPageButtonByName = function(name)
{
	return this.getAggregationElementByName(oFF.UiAggregation.PAGE_BUTTONS, name);
};
oFF.DfUiContext.prototype.getPageButtons = function()
{
	return this.getAggregation(oFF.UiAggregation.PAGE_BUTTONS);
};
oFF.DfUiContext.prototype.newPageButton = function()
{
	var newNavigationPageButton = this.newBasicControl(oFF.UiType.PAGE_BUTTON, null, null, null);
	return newNavigationPageButton;
};
oFF.DfUiContext.prototype.addNewPageButton = function()
{
	var newNavigationPageButton = this.newPageButton();
	this.addPageButton(newNavigationPageButton);
	return newNavigationPageButton;
};
oFF.DfUiContext.prototype.addAllPageButtons = function(pageButtonList)
{
	var size = pageButtonList.size();
	for (var i = 0; i < size; i++)
	{
		this.addPageButton(pageButtonList.get(i));
	}
	return this;
};
oFF.DfUiContext.prototype.addPageButton = function(pageButton)
{
	this.addElementToAggregation(pageButton, oFF.UiAggregation.PAGE_BUTTONS);
	return this;
};
oFF.DfUiContext.prototype.insertPageButton = function(pageButton, index)
{
	this.insertElementIntoAggregation(pageButton, index, oFF.UiAggregation.PAGE_BUTTONS);
	return this;
};
oFF.DfUiContext.prototype.removePageButton = function(pageButton)
{
	this.removeElementFromAggregation(pageButton, oFF.UiAggregation.PAGE_BUTTONS);
	return this;
};
oFF.DfUiContext.prototype.clearPageButtons = function()
{
	this.clearAggregation(oFF.UiAggregation.PAGE_BUTTONS);
	return this;
};
oFF.DfUiContext.prototype.hasSuggestions = function()
{
	return this.getSuggestionCount() > 0;
};
oFF.DfUiContext.prototype.getSuggestionCount = function()
{
	return this.getAggregationSize(oFF.UiAggregation.SUGGESTIONS);
};
oFF.DfUiContext.prototype.getSuggestion = function(index)
{
	return this.getAggregationElementByIndex(oFF.UiAggregation.SUGGESTIONS, index);
};
oFF.DfUiContext.prototype.getIndexOfSuggestion = function(suggestionItem)
{
	return this.getIndexOfAggregationElement(oFF.UiAggregation.SUGGESTIONS, suggestionItem);
};
oFF.DfUiContext.prototype.getSuggestionByName = function(name)
{
	return this.getAggregationElementByName(oFF.UiAggregation.SUGGESTIONS, name);
};
oFF.DfUiContext.prototype.getSuggestions = function()
{
	return this.getAggregation(oFF.UiAggregation.SUGGESTIONS);
};
oFF.DfUiContext.prototype.newSuggestion = function()
{
	var newSuggestionItem = this.newBasicControl(oFF.UiType.SUGGESTION_ITEM, null, null, null);
	return newSuggestionItem;
};
oFF.DfUiContext.prototype.addNewSuggestion = function()
{
	var newSuggestionItem = this.newSuggestion();
	this.addSuggestion(newSuggestionItem);
	return newSuggestionItem;
};
oFF.DfUiContext.prototype.addAllSuggestions = function(suggestionList)
{
	var size = suggestionList.size();
	for (var i = 0; i < size; i++)
	{
		this.addSuggestion(suggestionList.get(i));
	}
	return this;
};
oFF.DfUiContext.prototype.addSuggestion = function(suggestionItem)
{
	this.addElementToAggregation(suggestionItem, oFF.UiAggregation.SUGGESTIONS);
	return this;
};
oFF.DfUiContext.prototype.insertSuggestion = function(suggestionItem, index)
{
	this.insertElementIntoAggregation(suggestionItem, index, oFF.UiAggregation.SUGGESTIONS);
	return this;
};
oFF.DfUiContext.prototype.removeSuggestion = function(suggestionItem)
{
	this.removeElementFromAggregation(suggestionItem, oFF.UiAggregation.SUGGESTIONS);
	return this;
};
oFF.DfUiContext.prototype.clearSuggestions = function()
{
	this.clearAggregation(oFF.UiAggregation.SUGGESTIONS);
	return this;
};
oFF.DfUiContext.prototype.hasColumns = function()
{
	return this.numberOfColumns() > 0;
};
oFF.DfUiContext.prototype.numberOfColumns = function()
{
	return this.getAggregationSize(oFF.UiAggregation.COLUMNS);
};
oFF.DfUiContext.prototype.getColumn = function(index)
{
	return this.getAggregationElementByIndex(oFF.UiAggregation.COLUMNS, index);
};
oFF.DfUiContext.prototype.getIndexOfColumn = function(column)
{
	return this.getIndexOfAggregationElement(oFF.UiAggregation.COLUMNS, column);
};
oFF.DfUiContext.prototype.getColumnByName = function(name)
{
	return this.getAggregationElementByName(oFF.UiAggregation.COLUMNS, name);
};
oFF.DfUiContext.prototype.getColumns = function()
{
	return this.getAggregation(oFF.UiAggregation.COLUMNS);
};
oFF.DfUiContext.prototype.newColumn = function()
{
	var newTableColumn = this.newBasicControl(oFF.UiType.TABLE_COLUMN, null, null, null);
	return newTableColumn;
};
oFF.DfUiContext.prototype.addNewColumn = function()
{
	var newTableColumn = this.newColumn();
	this.addColumn(newTableColumn);
	return newTableColumn;
};
oFF.DfUiContext.prototype.addAllColumns = function(columnList)
{
	var size = columnList.size();
	for (var i = 0; i < size; i++)
	{
		this.addColumn(columnList.get(i));
	}
	return this;
};
oFF.DfUiContext.prototype.addColumn = function(column)
{
	this.addElementToAggregation(column, oFF.UiAggregation.COLUMNS);
	return this;
};
oFF.DfUiContext.prototype.insertColumn = function(column, index)
{
	this.insertElementIntoAggregation(column, index, oFF.UiAggregation.COLUMNS);
	return this;
};
oFF.DfUiContext.prototype.removeColumn = function(column)
{
	this.removeElementFromAggregation(column, oFF.UiAggregation.COLUMNS);
	return this;
};
oFF.DfUiContext.prototype.clearColumns = function()
{
	this.clearAggregation(oFF.UiAggregation.COLUMNS);
	return this;
};
oFF.DfUiContext.prototype.hasRows = function()
{
	return this.numberOfRows() > 0;
};
oFF.DfUiContext.prototype.numberOfRows = function()
{
	return this.getAggregationSize(oFF.UiAggregation.ROWS);
};
oFF.DfUiContext.prototype.getRow = function(index)
{
	return this.getAggregationElementByIndex(oFF.UiAggregation.ROWS, index);
};
oFF.DfUiContext.prototype.getIndexOfRow = function(row)
{
	return this.getIndexOfAggregationElement(oFF.UiAggregation.ROWS, row);
};
oFF.DfUiContext.prototype.getRowByName = function(name)
{
	return this.getAggregationElementByName(oFF.UiAggregation.ROWS, name);
};
oFF.DfUiContext.prototype.getRows = function()
{
	return this.getAggregation(oFF.UiAggregation.ROWS);
};
oFF.DfUiContext.prototype.newRow = function()
{
	var newTableRow = this.newBasicControl(oFF.UiType.TABLE_ROW, null, null, null);
	return newTableRow;
};
oFF.DfUiContext.prototype.addNewRow = function()
{
	var newTableRow = this.newRow();
	this.addRow(newTableRow);
	return newTableRow;
};
oFF.DfUiContext.prototype.addAllRows = function(rowList)
{
	var size = rowList.size();
	for (var i = 0; i < size; i++)
	{
		this.addRow(rowList.get(i));
	}
	return this;
};
oFF.DfUiContext.prototype.addRow = function(row)
{
	this.addElementToAggregation(row, oFF.UiAggregation.ROWS);
	return this;
};
oFF.DfUiContext.prototype.insertRow = function(row, index)
{
	this.insertElementIntoAggregation(row, index, oFF.UiAggregation.ROWS);
	return this;
};
oFF.DfUiContext.prototype.removeRow = function(row)
{
	this.removeElementFromAggregation(row, oFF.UiAggregation.ROWS);
	return this;
};
oFF.DfUiContext.prototype.clearRows = function()
{
	this.clearAggregation(oFF.UiAggregation.ROWS);
	return this;
};
oFF.DfUiContext.prototype.hasCells = function()
{
	return this.numberOfCells() > 0;
};
oFF.DfUiContext.prototype.numberOfCells = function()
{
	return this.getAggregationSize(oFF.UiAggregation.CELLS);
};
oFF.DfUiContext.prototype.getCell = function(index)
{
	return this.getAggregationElementByIndex(oFF.UiAggregation.CELLS, index);
};
oFF.DfUiContext.prototype.getIndexOfCell = function(cell)
{
	return this.getIndexOfAggregationElement(oFF.UiAggregation.CELLS, cell);
};
oFF.DfUiContext.prototype.getCellByName = function(name)
{
	return this.getAggregationElementByName(oFF.UiAggregation.CELLS, name);
};
oFF.DfUiContext.prototype.getCells = function()
{
	return this.getAggregation(oFF.UiAggregation.CELLS);
};
oFF.DfUiContext.prototype.newCell = function()
{
	var newCell = this.newBasicControl(oFF.UiType.TABLE_CELL, null, null, null);
	return newCell;
};
oFF.DfUiContext.prototype.addNewCell = function()
{
	var newCell = this.newCell();
	this.addCell(newCell);
	return newCell;
};
oFF.DfUiContext.prototype.addAllCells = function(cellList)
{
	var size = cellList.size();
	for (var i = 0; i < size; i++)
	{
		this.addCell(cellList.get(i));
	}
	return this;
};
oFF.DfUiContext.prototype.addCell = function(cell)
{
	this.addElementToAggregation(cell, oFF.UiAggregation.CELLS);
	return this;
};
oFF.DfUiContext.prototype.insertCell = function(cell, index)
{
	this.insertElementIntoAggregation(cell, index, oFF.UiAggregation.CELLS);
	return this;
};
oFF.DfUiContext.prototype.removeCell = function(cell)
{
	this.removeElementFromAggregation(cell, oFF.UiAggregation.CELLS);
	return this;
};
oFF.DfUiContext.prototype.clearCells = function()
{
	this.clearAggregation(oFF.UiAggregation.CELLS);
	return this;
};
oFF.DfUiContext.prototype.hasEndIcons = function()
{
	return this.getEndIconCount() > 0;
};
oFF.DfUiContext.prototype.getEndIconCount = function()
{
	return this.getAggregationSize(oFF.UiAggregation.END_ICONS);
};
oFF.DfUiContext.prototype.getEndIcon = function(index)
{
	return this.getAggregationElementByIndex(oFF.UiAggregation.END_ICONS, index);
};
oFF.DfUiContext.prototype.getIndexOfEndIcon = function(endIcon)
{
	return this.getIndexOfAggregationElement(oFF.UiAggregation.END_ICONS, endIcon);
};
oFF.DfUiContext.prototype.getEndIconByName = function(name)
{
	return this.getAggregationElementByName(oFF.UiAggregation.END_ICONS, name);
};
oFF.DfUiContext.prototype.getEndIcons = function()
{
	return this.getAggregation(oFF.UiAggregation.END_ICONS);
};
oFF.DfUiContext.prototype.newEndIcon = function()
{
	var newIcon = this.newBasicControl(oFF.UiType.ICON, null, null, null);
	return newIcon;
};
oFF.DfUiContext.prototype.addNewEndIcon = function()
{
	var newIcon = this.newEndIcon();
	this.addEndIcon(newIcon);
	return newIcon;
};
oFF.DfUiContext.prototype.addAllEndIcons = function(endIconList)
{
	var size = endIconList.size();
	for (var i = 0; i < size; i++)
	{
		this.addEndIcon(endIconList.get(i));
	}
	return this;
};
oFF.DfUiContext.prototype.addEndIcon = function(endIcon)
{
	this.addElementToAggregation(endIcon, oFF.UiAggregation.END_ICONS);
	return this;
};
oFF.DfUiContext.prototype.insertEndIcon = function(endIcon, index)
{
	this.insertElementIntoAggregation(endIcon, index, oFF.UiAggregation.END_ICONS);
	return this;
};
oFF.DfUiContext.prototype.removeEndIcon = function(endIcon)
{
	this.removeElementFromAggregation(endIcon, oFF.UiAggregation.END_ICONS);
	return this;
};
oFF.DfUiContext.prototype.clearEndIcons = function()
{
	this.clearAggregation(oFF.UiAggregation.END_ICONS);
	return this;
};
oFF.DfUiContext.prototype.hasTreeTableRows = function()
{
	return this.numberOfTreeTableRows() > 0;
};
oFF.DfUiContext.prototype.numberOfTreeTableRows = function()
{
	return this.getAggregationSize(oFF.UiAggregation.TREE_TABLE_ROWS);
};
oFF.DfUiContext.prototype.getTreeTableRow = function(index)
{
	return this.getAggregationElementByIndex(oFF.UiAggregation.TREE_TABLE_ROWS, index);
};
oFF.DfUiContext.prototype.getIndexOfTreeTableRow = function(treeTableRow)
{
	return this.getIndexOfAggregationElement(oFF.UiAggregation.TREE_TABLE_ROWS, treeTableRow);
};
oFF.DfUiContext.prototype.getTreeTableRowByName = function(name)
{
	return this.getAggregationElementByName(oFF.UiAggregation.TREE_TABLE_ROWS, name);
};
oFF.DfUiContext.prototype.getTreeTableRows = function()
{
	return this.getTreeTableRowsRecursive(null);
};
oFF.DfUiContext.prototype.getOnlyChildTreeTableRows = function()
{
	return this.getAggregation(oFF.UiAggregation.TREE_TABLE_ROWS);
};
oFF.DfUiContext.prototype.newTreeTableRow = function()
{
	var newTreeTableRow = this.newBasicControl(oFF.UiType.TREE_TABLE_ROW, null, null, null);
	return newTreeTableRow;
};
oFF.DfUiContext.prototype.addNewTreeTableRow = function()
{
	var newTreeTableRow = this.newTreeTableRow();
	this.addTreeTableRow(newTreeTableRow);
	return newTreeTableRow;
};
oFF.DfUiContext.prototype.addAllTreeTableRows = function(treeTableRowList)
{
	var size = treeTableRowList.size();
	for (var i = 0; i < size; i++)
	{
		this.addTreeTableRow(treeTableRowList.get(i));
	}
	return this;
};
oFF.DfUiContext.prototype.addTreeTableRow = function(treeTableRow)
{
	this.addElementToAggregation(treeTableRow, oFF.UiAggregation.TREE_TABLE_ROWS);
	return this;
};
oFF.DfUiContext.prototype.insertTreeTableRow = function(treeTableRow, index)
{
	this.insertElementIntoAggregation(treeTableRow, index, oFF.UiAggregation.TREE_TABLE_ROWS);
	return this;
};
oFF.DfUiContext.prototype.removeTreeTableRow = function(treeTableRow)
{
	this.removeElementFromAggregation(treeTableRow, oFF.UiAggregation.TREE_TABLE_ROWS);
	return this;
};
oFF.DfUiContext.prototype.clearTreeTableRows = function()
{
	this.clearAggregation(oFF.UiAggregation.TREE_TABLE_ROWS);
	return this;
};
oFF.DfUiContext.prototype.getTreeTableRowsRecursive = function(controlList)
{
	var tmpAggregation = controlList;
	if (oFF.isNull(tmpAggregation))
	{
		tmpAggregation = oFF.XList.create();
	}
	var topLevelItems = this.getOnlyChildTreeTableRows();
	tmpAggregation.addAll(topLevelItems);
	for (var a = 0; a < topLevelItems.size(); a++)
	{
		var lowerItem = topLevelItems.get(a);
		lowerItem.getTreeTableRowsRecursive(tmpAggregation);
	}
	return tmpAggregation;
};
oFF.DfUiContext.prototype.hasItems = function()
{
	return this.getItemCount() > 0;
};
oFF.DfUiContext.prototype.getItemCount = function()
{
	return this.getAggregationSize(oFF.UiAggregation.ITEMS);
};
oFF.DfUiContext.prototype.getItem = function(index)
{
	return this.getAggregationElementByIndex(oFF.UiAggregation.ITEMS, index);
};
oFF.DfUiContext.prototype.getIndexOfItem = function(item)
{
	return this.getIndexOfAggregationElement(oFF.UiAggregation.ITEMS, item);
};
oFF.DfUiContext.prototype.getItemByName = function(name)
{
	return this.getAggregationElementByName(oFF.UiAggregation.ITEMS, name);
};
oFF.DfUiContext.prototype.getItemById = function(itemId)
{
	return this.getAggregationElementById(oFF.UiAggregation.ITEMS, itemId);
};
oFF.DfUiContext.prototype.getItems = function()
{
	return this.getAggregation(oFF.UiAggregation.ITEMS);
};
oFF.DfUiContext.prototype.newItemOfType = function(itemType)
{
	var newItem = this.newBasicControl(itemType, null, null, null);
	return newItem;
};
oFF.DfUiContext.prototype.addNewItemOfType = function(itemType)
{
	var newItem = this.newItemOfType(itemType);
	this.addItem(newItem);
	return newItem;
};
oFF.DfUiContext.prototype.insertNewItemOfType = function(itemType, index)
{
	var newItem = this.newItemOfType(itemType);
	this.insertItem(newItem, index);
	return newItem;
};
oFF.DfUiContext.prototype.addAllItems = function(itemList)
{
	if (oFF.notNull(itemList))
	{
		var size = itemList.size();
		for (var i = 0; i < size; i++)
		{
			this.addItem(itemList.get(i));
		}
	}
	return this;
};
oFF.DfUiContext.prototype.addItem = function(item)
{
	this.addElementToAggregation(item, oFF.UiAggregation.ITEMS);
	return this;
};
oFF.DfUiContext.prototype.insertItem = function(item, index)
{
	this.insertElementIntoAggregation(item, index, oFF.UiAggregation.ITEMS);
	return this;
};
oFF.DfUiContext.prototype.removeItem = function(item)
{
	this.removeElementFromAggregation(item, oFF.UiAggregation.ITEMS);
	return this;
};
oFF.DfUiContext.prototype.clearItems = function()
{
	this.clearAggregation(oFF.UiAggregation.ITEMS);
	return this;
};
oFF.DfUiContext.prototype.hasRadioButtons = function()
{
	return this.getRadioButtonCount() > 0;
};
oFF.DfUiContext.prototype.getRadioButtonCount = function()
{
	return this.getAggregationSize(oFF.UiAggregation.RADIO_BUTTONS);
};
oFF.DfUiContext.prototype.getRadioButton = function(index)
{
	return this.getAggregationElementByIndex(oFF.UiAggregation.RADIO_BUTTONS, index);
};
oFF.DfUiContext.prototype.getIndexOfRadioButton = function(radioButton)
{
	return this.getIndexOfAggregationElement(oFF.UiAggregation.RADIO_BUTTONS, radioButton);
};
oFF.DfUiContext.prototype.getRadioButtonByName = function(name)
{
	return this.getAggregationElementByName(oFF.UiAggregation.RADIO_BUTTONS, name);
};
oFF.DfUiContext.prototype.getRadioButtons = function()
{
	return this.getAggregation(oFF.UiAggregation.RADIO_BUTTONS);
};
oFF.DfUiContext.prototype.newRadioButton = function()
{
	var newRadioButton = this.newBasicControl(oFF.UiType.RADIO_BUTTON, null, null, null);
	return newRadioButton;
};
oFF.DfUiContext.prototype.addNewRadioButton = function()
{
	var newRadioButton = this.newRadioButton();
	this.addRadioButton(newRadioButton);
	return newRadioButton;
};
oFF.DfUiContext.prototype.addAllRadioButtons = function(radioButtonList)
{
	var size = radioButtonList.size();
	for (var i = 0; i < size; i++)
	{
		this.addRadioButton(radioButtonList.get(i));
	}
	return this;
};
oFF.DfUiContext.prototype.addRadioButton = function(radioButton)
{
	this.addElementToAggregation(radioButton, oFF.UiAggregation.RADIO_BUTTONS);
	return this;
};
oFF.DfUiContext.prototype.insertRadioButton = function(radioButton, index)
{
	this.insertElementIntoAggregation(radioButton, index, oFF.UiAggregation.RADIO_BUTTONS);
	return this;
};
oFF.DfUiContext.prototype.removeRadioButton = function(radioButton)
{
	this.removeElementFromAggregation(radioButton, oFF.UiAggregation.RADIO_BUTTONS);
	return this;
};
oFF.DfUiContext.prototype.clearRadioButtons = function()
{
	this.clearAggregation(oFF.UiAggregation.RADIO_BUTTONS);
	return this;
};
oFF.DfUiContext.prototype.hasMatrixLayoutCells = function()
{
	return this.getMatrixLayoutCellCount() > 0;
};
oFF.DfUiContext.prototype.getMatrixLayoutCellCount = function()
{
	return this.getAggregationSize(oFF.UiAggregation.MATRIX_LAYOUT_CELLS);
};
oFF.DfUiContext.prototype.getMatrixLayoutCell = function(index)
{
	return this.getAggregationElementByIndex(oFF.UiAggregation.MATRIX_LAYOUT_CELLS, index);
};
oFF.DfUiContext.prototype.getIndexOfMatrixLayoutCell = function(matrixLayoutCell)
{
	return this.getIndexOfAggregationElement(oFF.UiAggregation.MATRIX_LAYOUT_CELLS, matrixLayoutCell);
};
oFF.DfUiContext.prototype.getMatrixLayoutCellByName = function(name)
{
	return this.getAggregationElementByName(oFF.UiAggregation.MATRIX_LAYOUT_CELLS, name);
};
oFF.DfUiContext.prototype.getMatrixLayoutCells = function()
{
	return this.getAggregation(oFF.UiAggregation.MATRIX_LAYOUT_CELLS);
};
oFF.DfUiContext.prototype.newMatrixLayoutCell = function()
{
	var newMatrixLayoutCell = this.newBasicControl(oFF.UiType.MATRIX_LAYOUT_CELL, null, null, null);
	return newMatrixLayoutCell;
};
oFF.DfUiContext.prototype.addNewMatrixLayoutCell = function()
{
	var newMatrixLayoutCell = this.newMatrixLayoutCell();
	this.addMatrixLayoutCell(newMatrixLayoutCell);
	return newMatrixLayoutCell;
};
oFF.DfUiContext.prototype.addAllMatrixLayoutCells = function(matrixLayoutCellList)
{
	var size = matrixLayoutCellList.size();
	for (var i = 0; i < size; i++)
	{
		this.addMatrixLayoutCell(matrixLayoutCellList.get(i));
	}
	return this;
};
oFF.DfUiContext.prototype.addMatrixLayoutCell = function(matrixLayoutCell)
{
	this.addElementToAggregation(matrixLayoutCell, oFF.UiAggregation.MATRIX_LAYOUT_CELLS);
	return this;
};
oFF.DfUiContext.prototype.insertMatrixLayoutCell = function(matrixLayoutCell, index)
{
	this.insertElementIntoAggregation(matrixLayoutCell, index, oFF.UiAggregation.MATRIX_LAYOUT_CELLS);
	return this;
};
oFF.DfUiContext.prototype.removeMatrixLayoutCell = function(matrixLayoutCell)
{
	this.removeElementFromAggregation(matrixLayoutCell, oFF.UiAggregation.MATRIX_LAYOUT_CELLS);
	return this;
};
oFF.DfUiContext.prototype.clearMatrixLayoutCells = function()
{
	this.clearAggregation(oFF.UiAggregation.MATRIX_LAYOUT_CELLS);
	return this;
};
oFF.DfUiContext.prototype.hasMatrixLayoutRows = function()
{
	return this.getMatrixLayoutRowCount() > 0;
};
oFF.DfUiContext.prototype.getMatrixLayoutRowCount = function()
{
	return this.getAggregationSize(oFF.UiAggregation.MATRIX_LAYOUT_ROWS);
};
oFF.DfUiContext.prototype.getMatrixLayoutRow = function(index)
{
	return this.getAggregationElementByIndex(oFF.UiAggregation.MATRIX_LAYOUT_ROWS, index);
};
oFF.DfUiContext.prototype.getIndexOfMatrixLayoutRow = function(matrixLayoutRow)
{
	return this.getIndexOfAggregationElement(oFF.UiAggregation.MATRIX_LAYOUT_ROWS, matrixLayoutRow);
};
oFF.DfUiContext.prototype.getMatrixLayoutRowByName = function(name)
{
	return this.getAggregationElementByName(oFF.UiAggregation.MATRIX_LAYOUT_ROWS, name);
};
oFF.DfUiContext.prototype.getMatrixLayoutRows = function()
{
	return this.getAggregation(oFF.UiAggregation.MATRIX_LAYOUT_ROWS);
};
oFF.DfUiContext.prototype.newMatrixLayoutRow = function()
{
	var newMatrixLayoutRow = this.newBasicControl(oFF.UiType.MATRIX_LAYOUT_ROW, null, null, null);
	return newMatrixLayoutRow;
};
oFF.DfUiContext.prototype.addNewMatrixLayoutRow = function()
{
	var newMatrixLayoutRow = this.newMatrixLayoutRow();
	this.addMatrixLayoutRow(newMatrixLayoutRow);
	return newMatrixLayoutRow;
};
oFF.DfUiContext.prototype.addAllMatrixLayoutRows = function(matrixLayoutRowList)
{
	var size = matrixLayoutRowList.size();
	for (var i = 0; i < size; i++)
	{
		this.addMatrixLayoutRow(matrixLayoutRowList.get(i));
	}
	return this;
};
oFF.DfUiContext.prototype.addMatrixLayoutRow = function(matrixLayoutRow)
{
	this.addElementToAggregation(matrixLayoutRow, oFF.UiAggregation.MATRIX_LAYOUT_ROWS);
	return this;
};
oFF.DfUiContext.prototype.insertMatrixLayoutRow = function(matrixLayoutRow, index)
{
	this.insertElementIntoAggregation(matrixLayoutRow, index, oFF.UiAggregation.MATRIX_LAYOUT_ROWS);
	return this;
};
oFF.DfUiContext.prototype.removeMatrixLayoutRow = function(matrixLayoutRow)
{
	this.removeElementFromAggregation(matrixLayoutRow, oFF.UiAggregation.MATRIX_LAYOUT_ROWS);
	return this;
};
oFF.DfUiContext.prototype.clearMatrixLayoutRows = function()
{
	this.clearAggregation(oFF.UiAggregation.MATRIX_LAYOUT_ROWS);
	return this;
};
oFF.DfUiContext.prototype.hasResponsiveTableColumns = function()
{
	return this.numberOfResponsiveTableColumns() > 0;
};
oFF.DfUiContext.prototype.numberOfResponsiveTableColumns = function()
{
	return this.getAggregationSize(oFF.UiAggregation.RESPONSIVE_TABLE_COLUMNS);
};
oFF.DfUiContext.prototype.getResponsiveTableColumn = function(index)
{
	return this.getAggregationElementByIndex(oFF.UiAggregation.RESPONSIVE_TABLE_COLUMNS, index);
};
oFF.DfUiContext.prototype.getIndexOfResponsiveTableColumn = function(column)
{
	return this.getIndexOfAggregationElement(oFF.UiAggregation.RESPONSIVE_TABLE_COLUMNS, column);
};
oFF.DfUiContext.prototype.getResponsiveTableColumnByName = function(name)
{
	return this.getAggregationElementByName(oFF.UiAggregation.RESPONSIVE_TABLE_COLUMNS, name);
};
oFF.DfUiContext.prototype.getResponsiveTableColumns = function()
{
	return this.getAggregation(oFF.UiAggregation.RESPONSIVE_TABLE_COLUMNS);
};
oFF.DfUiContext.prototype.newResponsiveTableColumn = function()
{
	var newResponsiveTableColumn = this.newBasicControl(oFF.UiType.RESPONSIVE_TABLE_COLUMN, null, null, null);
	return newResponsiveTableColumn;
};
oFF.DfUiContext.prototype.addNewResponsiveTableColumn = function()
{
	var newResponsiveTableColumn = this.newResponsiveTableColumn();
	this.addResponsiveTableColumn(newResponsiveTableColumn);
	return newResponsiveTableColumn;
};
oFF.DfUiContext.prototype.addAllResponsiveTableColumns = function(columnList)
{
	var size = columnList.size();
	for (var i = 0; i < size; i++)
	{
		this.addResponsiveTableColumn(columnList.get(i));
	}
	return this;
};
oFF.DfUiContext.prototype.addResponsiveTableColumn = function(column)
{
	this.addElementToAggregation(column, oFF.UiAggregation.RESPONSIVE_TABLE_COLUMNS);
	return this;
};
oFF.DfUiContext.prototype.insertResponsiveTableColumn = function(column, index)
{
	this.insertElementIntoAggregation(column, index, oFF.UiAggregation.RESPONSIVE_TABLE_COLUMNS);
	return this;
};
oFF.DfUiContext.prototype.removeResponsiveTableColumn = function(column)
{
	this.removeElementFromAggregation(column, oFF.UiAggregation.RESPONSIVE_TABLE_COLUMNS);
	return this;
};
oFF.DfUiContext.prototype.clearResponsiveTableColumns = function()
{
	this.clearAggregation(oFF.UiAggregation.RESPONSIVE_TABLE_COLUMNS);
	return this;
};
oFF.DfUiContext.prototype.hasResponsiveTableRows = function()
{
	return this.numberOfResponsiveTableRows() > 0;
};
oFF.DfUiContext.prototype.numberOfResponsiveTableRows = function()
{
	return this.getAggregationSize(oFF.UiAggregation.RESPONSIVE_TABLE_ROWS);
};
oFF.DfUiContext.prototype.getResponsiveTableRow = function(index)
{
	return this.getAggregationElementByIndex(oFF.UiAggregation.RESPONSIVE_TABLE_ROWS, index);
};
oFF.DfUiContext.prototype.getIndexOfResponsiveTableRow = function(row)
{
	return this.getIndexOfAggregationElement(oFF.UiAggregation.RESPONSIVE_TABLE_ROWS, row);
};
oFF.DfUiContext.prototype.getResponsiveTableRowByName = function(name)
{
	return this.getAggregationElementByName(oFF.UiAggregation.RESPONSIVE_TABLE_ROWS, name);
};
oFF.DfUiContext.prototype.getResponsiveTableRows = function()
{
	return this.getAggregation(oFF.UiAggregation.RESPONSIVE_TABLE_ROWS);
};
oFF.DfUiContext.prototype.newResponsiveTableRow = function()
{
	var newResponsiveTableRow = this.newBasicControl(oFF.UiType.RESPONSIVE_TABLE_ROW, null, null, null);
	return newResponsiveTableRow;
};
oFF.DfUiContext.prototype.addNewResponsiveTableRow = function()
{
	var newResponsiveTableRow = this.newResponsiveTableRow();
	this.addResponsiveTableRow(newResponsiveTableRow);
	return newResponsiveTableRow;
};
oFF.DfUiContext.prototype.addAllResponsiveTableRows = function(rowList)
{
	var size = rowList.size();
	for (var i = 0; i < size; i++)
	{
		this.addResponsiveTableRow(rowList.get(i));
	}
	return this;
};
oFF.DfUiContext.prototype.addResponsiveTableRow = function(row)
{
	this.addElementToAggregation(row, oFF.UiAggregation.RESPONSIVE_TABLE_ROWS);
	return this;
};
oFF.DfUiContext.prototype.insertResponsiveTableRow = function(row, index)
{
	this.insertElementIntoAggregation(row, index, oFF.UiAggregation.RESPONSIVE_TABLE_ROWS);
	return this;
};
oFF.DfUiContext.prototype.removeResponsiveTableRow = function(row)
{
	this.removeElementFromAggregation(row, oFF.UiAggregation.RESPONSIVE_TABLE_ROWS);
	return this;
};
oFF.DfUiContext.prototype.clearResponsiveTableRows = function()
{
	this.clearAggregation(oFF.UiAggregation.RESPONSIVE_TABLE_ROWS);
	return this;
};
oFF.DfUiContext.prototype.hasResponsiveTableCells = function()
{
	return this.numberOfResponsiveTableCells() > 0;
};
oFF.DfUiContext.prototype.numberOfResponsiveTableCells = function()
{
	return this.getAggregationSize(oFF.UiAggregation.RESPONSIVE_TABLE_CELLS);
};
oFF.DfUiContext.prototype.getResponsiveTableCell = function(index)
{
	return this.getAggregationElementByIndex(oFF.UiAggregation.RESPONSIVE_TABLE_CELLS, index);
};
oFF.DfUiContext.prototype.getIndexOfResponsiveTableCell = function(cell)
{
	return this.getIndexOfAggregationElement(oFF.UiAggregation.RESPONSIVE_TABLE_CELLS, cell);
};
oFF.DfUiContext.prototype.getResponsiveTableCellByName = function(name)
{
	return this.getAggregationElementByName(oFF.UiAggregation.RESPONSIVE_TABLE_CELLS, name);
};
oFF.DfUiContext.prototype.getResponsiveTableCells = function()
{
	return this.getAggregation(oFF.UiAggregation.RESPONSIVE_TABLE_CELLS);
};
oFF.DfUiContext.prototype.newResponsiveTableCell = function()
{
	var newResponsiveTableRowCell = this.newBasicControl(oFF.UiType.RESPONSIVE_TABLE_CELL, null, null, null);
	return newResponsiveTableRowCell;
};
oFF.DfUiContext.prototype.addNewResponsiveTableCell = function()
{
	var newResponsiveTableRowCell = this.newResponsiveTableCell();
	this.addResponsiveTableCell(newResponsiveTableRowCell);
	return newResponsiveTableRowCell;
};
oFF.DfUiContext.prototype.addAllResponsiveTableCells = function(cellList)
{
	var size = cellList.size();
	for (var i = 0; i < size; i++)
	{
		this.addResponsiveTableCell(cellList.get(i));
	}
	return this;
};
oFF.DfUiContext.prototype.addResponsiveTableCell = function(cell)
{
	this.addElementToAggregation(cell, oFF.UiAggregation.RESPONSIVE_TABLE_CELLS);
	return this;
};
oFF.DfUiContext.prototype.insertResponsiveTableCell = function(cell, index)
{
	this.insertElementIntoAggregation(cell, index, oFF.UiAggregation.RESPONSIVE_TABLE_CELLS);
	return this;
};
oFF.DfUiContext.prototype.removeResponsiveTableCell = function(cell)
{
	this.removeElementFromAggregation(cell, oFF.UiAggregation.RESPONSIVE_TABLE_CELLS);
	return this;
};
oFF.DfUiContext.prototype.clearResponsiveTableCells = function()
{
	this.clearAggregation(oFF.UiAggregation.RESPONSIVE_TABLE_CELLS);
	return this;
};
oFF.DfUiContext.prototype.hasPages = function()
{
	return this.getPagesCount() > 0;
};
oFF.DfUiContext.prototype.getPagesCount = function()
{
	return this.getAggregationSize(oFF.UiAggregation.PAGES);
};
oFF.DfUiContext.prototype.getPage = function(index)
{
	return this.getAggregationElementByIndex(oFF.UiAggregation.PAGES, index);
};
oFF.DfUiContext.prototype.getIndexOfPage = function(page)
{
	return this.getIndexOfAggregationElement(oFF.UiAggregation.PAGES, page);
};
oFF.DfUiContext.prototype.getPageByName = function(name)
{
	return this.getAggregationElementByName(oFF.UiAggregation.PAGES, name);
};
oFF.DfUiContext.prototype.getPages = function()
{
	return this.getAggregation(oFF.UiAggregation.PAGES);
};
oFF.DfUiContext.prototype.getCurrentPage = function()
{
	if (this.hasPages())
	{
		var lastNavigationPage = this.getPage(this.getPagesCount() - 1);
		return lastNavigationPage;
	}
	return null;
};
oFF.DfUiContext.prototype.newPage = function()
{
	var newNavigationPage = this.newBasicControl(oFF.UiType.PAGE, null, null, null);
	return newNavigationPage;
};
oFF.DfUiContext.prototype.pushNewPage = function()
{
	var newNavigationPage = this.newPage();
	this.pushPage(newNavigationPage);
	return newNavigationPage;
};
oFF.DfUiContext.prototype.pushPage = function(page)
{
	this.addElementToAggregation(page, oFF.UiAggregation.PAGES);
	return this;
};
oFF.DfUiContext.prototype.popPage = function()
{
	var lastNavigationPage = this.getCurrentPage();
	if (oFF.notNull(lastNavigationPage))
	{
		this.removeElementFromAggregation(lastNavigationPage, oFF.UiAggregation.PAGES);
	}
	return lastNavigationPage;
};
oFF.DfUiContext.prototype.clearPages = function()
{
	this.clearAggregation(oFF.UiAggregation.PAGES);
	return this;
};
oFF.DfUiContext.prototype.removePagesFromStackTillPage = function(navigationPage)
{
	if (oFF.notNull(navigationPage) && navigationPage !== this.getCurrentPage())
	{
		var tmpNavigationPageList = this.getAggregation(oFF.UiAggregation.PAGES);
		var navigationPageIndex = tmpNavigationPageList.getIndex(navigationPage);
		if (navigationPageIndex !== -1)
		{
			tmpNavigationPageList = tmpNavigationPageList.sublist(0, navigationPageIndex + 1);
			this.setAggregation(oFF.UiAggregation.PAGES, tmpNavigationPageList);
		}
	}
};
oFF.DfUiContext.prototype.openAt = function(control)
{
	this.putBoolean(oFF.UiProperty.OPEN.getName(), true);
	return this;
};
oFF.DfUiContext.prototype.openAtPosition = function(posX, posY)
{
	this.putBoolean(oFF.UiProperty.OPEN.getName(), true);
	return this;
};
oFF.DfUiContext.prototype.open = function()
{
	this.putBoolean(oFF.UiProperty.OPEN.getName(), true);
	return this;
};
oFF.DfUiContext.prototype.close = function()
{
	this.putBoolean(oFF.UiProperty.OPEN.getName(), false);
	return this;
};
oFF.DfUiContext.prototype.expandToLevel = function(level)
{
	return this;
};
oFF.DfUiContext.prototype.collapseAll = function()
{
	return this;
};
oFF.DfUiContext.prototype.print = function(text) {};
oFF.DfUiContext.prototype.println = function(text) {};
oFF.DfUiContext.prototype.focus = function()
{
	return this;
};
oFF.DfUiContext.prototype.shake = function()
{
	return this;
};
oFF.DfUiContext.prototype.showSuggestions = function()
{
	return this;
};
oFF.DfUiContext.prototype.closeSuggestions = function()
{
	return this;
};
oFF.DfUiContext.prototype.back = function()
{
	return this;
};
oFF.DfUiContext.prototype.scrollTo = function(x, y, duration)
{
	return this;
};
oFF.DfUiContext.prototype.scrollToControl = function(control, duration)
{
	return this;
};
oFF.DfUiContext.prototype.popToPage = function(page)
{
	if (this.getUiType() === oFF.UiType.NAVIGATION_CONTAINER)
	{
		this.removePagesFromStackTillPage(page);
	}
	return this;
};
oFF.DfUiContext.prototype.maximize = function(animated)
{
	this.putBoolean(oFF.UiProperty.MAXIMIZED.getName(), true);
	return this;
};
oFF.DfUiContext.prototype.restore = function(animated)
{
	this.putBoolean(oFF.UiProperty.MAXIMIZED.getName(), false);
	return this;
};
oFF.DfUiContext.prototype.hide = function(animated, refControl)
{
	this.putBoolean(oFF.UiProperty.HIDDEN.getName(), true);
	return this;
};
oFF.DfUiContext.prototype.show = function(animated, refControl)
{
	this.putBoolean(oFF.UiProperty.HIDDEN.getName(), false);
	return this;
};
oFF.DfUiContext.prototype.selectText = function(startIndex, endIndex)
{
	return this;
};
oFF.DfUiContext.prototype.fullscreen = function()
{
	return this;
};
oFF.DfUiContext.prototype.startReadLine = function(text, numOfChars)
{
	return this;
};
oFF.DfUiContext.prototype.bringToFront = function()
{
	return this;
};
oFF.DfUiContext.prototype.setFrame = function(x, y, width, height)
{
	this.setPosition(oFF.UiPosition.create(x, y));
	this.setSize(oFF.UiSize.create(width, height));
};
oFF.DfUiContext.prototype.setFrameCss = function(xCss, yCss, widthCss, heightCss)
{
	this.setPosition(oFF.UiPosition.createByCss(xCss, yCss));
	this.setSize(oFF.UiSize.createByCss(widthCss, heightCss));
};
oFF.DfUiContext.prototype.registerOnEnter = function(listener)
{
	this.putEventListener(oFF.UiEvent.ON_ENTER, listener);
	return this;
};
oFF.DfUiContext.prototype.getListenerOnEnter = function()
{
	return this.getEventListener(oFF.UiEvent.ON_ENTER);
};
oFF.DfUiContext.prototype.registerOnSelect = function(listener)
{
	this.putEventListener(oFF.UiEvent.ON_SELECT, listener);
	return this;
};
oFF.DfUiContext.prototype.getListenerOnSelect = function()
{
	return this.getEventListener(oFF.UiEvent.ON_SELECT);
};
oFF.DfUiContext.prototype.registerOnSelectionChange = function(listener)
{
	this.putEventListener(oFF.UiEvent.ON_SELECTION_CHANGE, listener);
	return this;
};
oFF.DfUiContext.prototype.getListenerOnSelectionChange = function()
{
	return this.getEventListener(oFF.UiEvent.ON_SELECTION_CHANGE);
};
oFF.DfUiContext.prototype.registerOnDoubleClick = function(listener)
{
	this.putEventListener(oFF.UiEvent.ON_DOUBLE_CLICK, listener);
	return this;
};
oFF.DfUiContext.prototype.getListenerOnDoubleClick = function()
{
	return this.getEventListener(oFF.UiEvent.ON_DOUBLE_CLICK);
};
oFF.DfUiContext.prototype.registerOnPress = function(listener)
{
	this.putEventListener(oFF.UiEvent.ON_PRESS, listener);
	return this;
};
oFF.DfUiContext.prototype.getListenerOnPress = function()
{
	return this.getEventListener(oFF.UiEvent.ON_PRESS);
};
oFF.DfUiContext.prototype.registerOnOpen = function(listener)
{
	this.putEventListener(oFF.UiEvent.ON_OPEN, listener);
	return this;
};
oFF.DfUiContext.prototype.getListenerOnOpen = function()
{
	return this.getEventListener(oFF.UiEvent.ON_OPEN);
};
oFF.DfUiContext.prototype.registerOnClose = function(listener)
{
	this.putEventListener(oFF.UiEvent.ON_CLOSE, listener);
	return this;
};
oFF.DfUiContext.prototype.getListenerOnClose = function()
{
	return this.getEventListener(oFF.UiEvent.ON_CLOSE);
};
oFF.DfUiContext.prototype.registerOnBeforeOpen = function(listener)
{
	this.putEventListener(oFF.UiEvent.ON_BEFORE_OPEN, listener);
	return this;
};
oFF.DfUiContext.prototype.getListenerOnBeforeOpen = function()
{
	return this.getEventListener(oFF.UiEvent.ON_BEFORE_OPEN);
};
oFF.DfUiContext.prototype.registerOnBeforeClose = function(listener)
{
	this.putEventListener(oFF.UiEvent.ON_BEFORE_CLOSE, listener);
	return this;
};
oFF.DfUiContext.prototype.getListenerOnBeforeClose = function()
{
	return this.getEventListener(oFF.UiEvent.ON_BEFORE_CLOSE);
};
oFF.DfUiContext.prototype.registerOnAfterOpen = function(listener)
{
	this.putEventListener(oFF.UiEvent.ON_AFTER_OPEN, listener);
	return this;
};
oFF.DfUiContext.prototype.getListenerOnAfterOpen = function()
{
	return this.getEventListener(oFF.UiEvent.ON_AFTER_OPEN);
};
oFF.DfUiContext.prototype.registerOnAfterClose = function(listener)
{
	this.putEventListener(oFF.UiEvent.ON_AFTER_CLOSE, listener);
	return this;
};
oFF.DfUiContext.prototype.getListenerOnAfterClose = function()
{
	return this.getEventListener(oFF.UiEvent.ON_AFTER_CLOSE);
};
oFF.DfUiContext.prototype.registerOnChange = function(listener)
{
	this.putEventListener(oFF.UiEvent.ON_CHANGE, listener);
	return this;
};
oFF.DfUiContext.prototype.getListenerOnChange = function()
{
	return this.getEventListener(oFF.UiEvent.ON_CHANGE);
};
oFF.DfUiContext.prototype.registerOnLiveChange = function(listener)
{
	this.putEventListener(oFF.UiEvent.ON_LIVE_CHANGE, listener);
	return this;
};
oFF.DfUiContext.prototype.getListenerOnLiveChange = function()
{
	return this.getEventListener(oFF.UiEvent.ON_LIVE_CHANGE);
};
oFF.DfUiContext.prototype.registerOnEditingBegin = function(listener)
{
	this.putEventListener(oFF.UiEvent.ON_EDITING_BEGIN, listener);
	return this;
};
oFF.DfUiContext.prototype.getListenerOnEditingBegin = function()
{
	return this.getEventListener(oFF.UiEvent.ON_EDITING_BEGIN);
};
oFF.DfUiContext.prototype.registerOnEditingEnd = function(listener)
{
	this.putEventListener(oFF.UiEvent.ON_EDITING_END, listener);
	return this;
};
oFF.DfUiContext.prototype.getListenerOnEditingEnd = function()
{
	return this.getEventListener(oFF.UiEvent.ON_EDITING_END);
};
oFF.DfUiContext.prototype.registerOnBack = function(listener)
{
	this.putEventListener(oFF.UiEvent.ON_BACK, listener);
	return this;
};
oFF.DfUiContext.prototype.getListenerOnBack = function()
{
	return this.getEventListener(oFF.UiEvent.ON_BACK);
};
oFF.DfUiContext.prototype.registerOnRefresh = function(listener)
{
	this.putEventListener(oFF.UiEvent.ON_REFRESH, listener);
	return this;
};
oFF.DfUiContext.prototype.getListenerOnRefresh = function()
{
	return this.getEventListener(oFF.UiEvent.ON_REFRESH);
};
oFF.DfUiContext.prototype.registerOnClick = function(listener)
{
	this.putEventListener(oFF.UiEvent.ON_CLICK, listener);
	return this;
};
oFF.DfUiContext.prototype.getListenerOnClick = function()
{
	return this.getEventListener(oFF.UiEvent.ON_CLICK);
};
oFF.DfUiContext.prototype.registerOnContextMenu = function(listener)
{
	this.putEventListener(oFF.UiEvent.ON_CONTEXT_MENU, listener);
	return this;
};
oFF.DfUiContext.prototype.getListenerOnContextMenu = function()
{
	return this.getEventListener(oFF.UiEvent.ON_CONTEXT_MENU);
};
oFF.DfUiContext.prototype.registerOnExpand = function(listener)
{
	this.putEventListener(oFF.UiEvent.ON_EXPAND, listener);
	return this;
};
oFF.DfUiContext.prototype.getListenerOnExpand = function()
{
	return this.getEventListener(oFF.UiEvent.ON_EXPAND);
};
oFF.DfUiContext.prototype.registerOnCollapse = function(listener)
{
	this.putEventListener(oFF.UiEvent.ON_COLLAPSE, listener);
	return this;
};
oFF.DfUiContext.prototype.getListenerOnCollapse = function()
{
	return this.getEventListener(oFF.UiEvent.ON_COLLAPSE);
};
oFF.DfUiContext.prototype.registerOnLoadFinished = function(listener)
{
	this.putEventListener(oFF.UiEvent.ON_LOAD_FINISHED, listener);
	return this;
};
oFF.DfUiContext.prototype.getListenerOnLoadFinished = function()
{
	return this.getEventListener(oFF.UiEvent.ON_LOAD_FINISHED);
};
oFF.DfUiContext.prototype.registerOnDelete = function(listener)
{
	this.putEventListener(oFF.UiEvent.ON_DELETE, listener);
	return this;
};
oFF.DfUiContext.prototype.getListenerOnDelete = function()
{
	return this.getEventListener(oFF.UiEvent.ON_DELETE);
};
oFF.DfUiContext.prototype.registerOnDetailPress = function(listener)
{
	this.putEventListener(oFF.UiEvent.ON_DETAIL_PRESS, listener);
	return this;
};
oFF.DfUiContext.prototype.getListenerOnDetailPress = function()
{
	return this.getEventListener(oFF.UiEvent.ON_DETAIL_PRESS);
};
oFF.DfUiContext.prototype.registerOnMove = function(listener)
{
	this.putEventListener(oFF.UiEvent.ON_MOVE, listener);
	return this;
};
oFF.DfUiContext.prototype.getListenerOnMove = function()
{
	return this.getEventListener(oFF.UiEvent.ON_MOVE);
};
oFF.DfUiContext.prototype.registerOnMoveStart = function(listener)
{
	this.putEventListener(oFF.UiEvent.ON_MOVE_START, listener);
	return this;
};
oFF.DfUiContext.prototype.getListenerOnMoveStart = function()
{
	return this.getEventListener(oFF.UiEvent.ON_MOVE_START);
};
oFF.DfUiContext.prototype.registerOnMoveEnd = function(listener)
{
	this.putEventListener(oFF.UiEvent.ON_MOVE_END, listener);
	return this;
};
oFF.DfUiContext.prototype.getListenerOnMoveEnd = function()
{
	return this.getEventListener(oFF.UiEvent.ON_MOVE_END);
};
oFF.DfUiContext.prototype.registerOnResize = function(listener)
{
	this.putEventListener(oFF.UiEvent.ON_RESIZE, listener);
	return this;
};
oFF.DfUiContext.prototype.getListenerOnResize = function()
{
	return this.getEventListener(oFF.UiEvent.ON_RESIZE);
};
oFF.DfUiContext.prototype.registerOnSuggestionSelect = function(listener)
{
	this.putEventListener(oFF.UiEvent.ON_SUGGESTION_SELECT, listener);
	return this;
};
oFF.DfUiContext.prototype.getListenerOnSuggestionSelect = function()
{
	return this.getEventListener(oFF.UiEvent.ON_SUGGESTION_SELECT);
};
oFF.DfUiContext.prototype.registerOnScroll = function(listener)
{
	this.putEventListener(oFF.UiEvent.ON_SCROLL, listener);
	return this;
};
oFF.DfUiContext.prototype.getListenerOnScroll = function()
{
	return this.getEventListener(oFF.UiEvent.ON_SCROLL);
};
oFF.DfUiContext.prototype.registerOnScrollLoad = function(listener)
{
	this.putEventListener(oFF.UiEvent.ON_SCROLL_LOAD, listener);
	return this;
};
oFF.DfUiContext.prototype.getListenerOnScrollLoad = function()
{
	return this.getEventListener(oFF.UiEvent.ON_SCROLL_LOAD);
};
oFF.DfUiContext.prototype.registerOnHover = function(listener)
{
	this.putEventListener(oFF.UiEvent.ON_HOVER, listener);
	return this;
};
oFF.DfUiContext.prototype.getListenerOnHover = function()
{
	return this.getEventListener(oFF.UiEvent.ON_HOVER);
};
oFF.DfUiContext.prototype.registerOnHoverEnd = function(listener)
{
	this.putEventListener(oFF.UiEvent.ON_HOVER_END, listener);
	return this;
};
oFF.DfUiContext.prototype.getListenerOnHoverEnd = function()
{
	return this.getEventListener(oFF.UiEvent.ON_HOVER_END);
};
oFF.DfUiContext.prototype.registerOnPaste = function(listener)
{
	this.putEventListener(oFF.UiEvent.ON_PASTE, listener);
	return this;
};
oFF.DfUiContext.prototype.getListenerOnPaste = function()
{
	return this.getEventListener(oFF.UiEvent.ON_PASTE);
};
oFF.DfUiContext.prototype.registerOnSelectionFinish = function(listener)
{
	this.putEventListener(oFF.UiEvent.ON_SELECTION_FINISH, listener);
	return this;
};
oFF.DfUiContext.prototype.getListenerOnSelectionFinish = function()
{
	return this.getEventListener(oFF.UiEvent.ON_SELECTION_FINISH);
};
oFF.DfUiContext.prototype.registerOnSearch = function(listener)
{
	this.putEventListener(oFF.UiEvent.ON_SEARCH, listener);
	return this;
};
oFF.DfUiContext.prototype.getListenerOnSearch = function()
{
	return this.getEventListener(oFF.UiEvent.ON_SEARCH);
};
oFF.DfUiContext.prototype.registerOnButtonPress = function(listener)
{
	this.putEventListener(oFF.UiEvent.ON_BUTTON_PRESS, listener);
	return this;
};
oFF.DfUiContext.prototype.getListenerOnButtonPress = function()
{
	return this.getEventListener(oFF.UiEvent.ON_BUTTON_PRESS);
};
oFF.DfUiContext.prototype.registerOnError = function(listener)
{
	this.putEventListener(oFF.UiEvent.ON_ERROR, listener);
	return this;
};
oFF.DfUiContext.prototype.getListenerOnError = function()
{
	return this.getEventListener(oFF.UiEvent.ON_ERROR);
};
oFF.DfUiContext.prototype.registerOnReadLineFinished = function(listener)
{
	this.putEventListener(oFF.UiEvent.ON_READ_LINE_FINISHED, listener);
	return this;
};
oFF.DfUiContext.prototype.getListenerOnReadLineFinished = function()
{
	return this.getEventListener(oFF.UiEvent.ON_READ_LINE_FINISHED);
};
oFF.DfUiContext.prototype.registerOnExecute = function(listener)
{
	this.putEventListener(oFF.UiEvent.ON_EXECUTE, listener);
	return this;
};
oFF.DfUiContext.prototype.getListenerOnExecute = function()
{
	return this.getEventListener(oFF.UiEvent.ON_EXECUTE);
};
oFF.DfUiContext.prototype.registerOnTerminate = function(listener)
{
	this.putEventListener(oFF.UiEvent.ON_TERMINATE, listener);
	return this;
};
oFF.DfUiContext.prototype.getListenerOnTerminate = function()
{
	return this.getEventListener(oFF.UiEvent.ON_TERMINATE);
};
oFF.DfUiContext.prototype.registerOnFileDrop = function(listener)
{
	this.putEventListener(oFF.UiEvent.ON_FILE_DROP, listener);
	return this;
};
oFF.DfUiContext.prototype.getListenerOnFileDrop = function()
{
	return this.getEventListener(oFF.UiEvent.ON_FILE_DROP);
};
oFF.DfUiContext.prototype.registerOnDrop = function(listener)
{
	this.putEventListener(oFF.UiEvent.ON_DROP, listener);
	return this;
};
oFF.DfUiContext.prototype.getListenerOnDrop = function()
{
	return this.getEventListener(oFF.UiEvent.ON_DROP);
};
oFF.DfUiContext.prototype.registerOnItemClose = function(listener)
{
	this.putEventListener(oFF.UiEvent.ON_ITEM_CLOSE, listener);
	return this;
};
oFF.DfUiContext.prototype.getListenerOnItemClose = function()
{
	return this.getEventListener(oFF.UiEvent.ON_ITEM_CLOSE);
};
oFF.DfUiContext.prototype.registerOnItemSelect = function(listener)
{
	this.putEventListener(oFF.UiEvent.ON_ITEM_SELECT, listener);
	return this;
};
oFF.DfUiContext.prototype.getListenerOnItemSelect = function()
{
	return this.getEventListener(oFF.UiEvent.ON_ITEM_SELECT);
};
oFF.DfUiContext.prototype.registerOnTableDragAndDrop = function(listener)
{
	this.putEventListener(oFF.UiEvent.ON_TABLE_DRAG_AND_DROP, listener);
	return this;
};
oFF.DfUiContext.prototype.getListenerOnTableDragAndDrop = function()
{
	return this.getEventListener(oFF.UiEvent.ON_TABLE_DRAG_AND_DROP);
};
oFF.DfUiContext.prototype.getSelectedItem = function()
{
	var tmpSelAggregationAsList = this.getSelectionAggregationAsReadOnlyList();
	if (oFF.notNull(tmpSelAggregationAsList))
	{
		for (var a = 0; a < tmpSelAggregationAsList.size(); a++)
		{
			var aggrItem = tmpSelAggregationAsList.get(a);
			if (oFF.notNull(aggrItem) && aggrItem.isSelected() === true)
			{
				return aggrItem;
			}
		}
	}
	return null;
};
oFF.DfUiContext.prototype.setSelectedItem = function(selectedItem)
{
	this.deselectAllItems();
	if (oFF.notNull(selectedItem) && this.canItemBeSelected(selectedItem))
	{
		selectedItem.setSelected(true);
	}
	return this;
};
oFF.DfUiContext.prototype.setSelectedItemByIndex = function(index)
{
	this.deselectAllItems();
	var tmpSelAggregationAsList = this.getSelectionAggregationAsReadOnlyList();
	if (oFF.notNull(tmpSelAggregationAsList) && index < tmpSelAggregationAsList.size())
	{
		var aggrItem = tmpSelAggregationAsList.get(index);
		this.setSelectedItem(aggrItem);
	}
	return this;
};
oFF.DfUiContext.prototype.getSelectedName = function()
{
	var selectedItem = this.getSelectedItem();
	if (oFF.notNull(selectedItem))
	{
		return selectedItem.getName();
	}
	return null;
};
oFF.DfUiContext.prototype.setSelectedName = function(selectedName)
{
	var tmpSelAggregationAsList = this.getSelectionAggregationAsReadOnlyList();
	if (oFF.notNull(tmpSelAggregationAsList) && oFF.notNull(selectedName))
	{
		for (var i = 0; i < tmpSelAggregationAsList.size(); i++)
		{
			var tmpElement = tmpSelAggregationAsList.get(i);
			var childName = tmpElement.getName();
			if (oFF.notNull(childName) && oFF.XString.isEqual(selectedName, childName))
			{
				this.setSelectedItem(tmpElement);
				return this;
			}
		}
	}
	return this;
};
oFF.DfUiContext.prototype.hasSelectedItems = function()
{
	return this.getSelectedItemCount() > 0;
};
oFF.DfUiContext.prototype.getSelectedItemCount = function()
{
	return this.getSelectedItems().size();
};
oFF.DfUiContext.prototype.getSelectedItems = function()
{
	var tmpSelAggregation = this.getSelectionAggregationAsReadOnlyList();
	var tmpSelectedItems = oFF.XList.create();
	if (oFF.notNull(tmpSelAggregation))
	{
		for (var a = 0; a < tmpSelAggregation.size(); a++)
		{
			var aggrItem = tmpSelAggregation.get(a);
			if (oFF.notNull(aggrItem) && aggrItem.isSelected() === true)
			{
				tmpSelectedItems.add(aggrItem);
			}
		}
	}
	return tmpSelectedItems;
};
oFF.DfUiContext.prototype.setSelectedItems = function(selectedItems)
{
	this.deselectAllItems();
	if (oFF.isNull(selectedItems))
	{
		return this;
	}
	for (var a = 0; a < selectedItems.size(); a++)
	{
		var selectedItem = selectedItems.get(a);
		if (oFF.notNull(selectedItem) && this.canItemBeSelected(selectedItem))
		{
			selectedItem.setSelected(true);
		}
	}
	return this;
};
oFF.DfUiContext.prototype.addSelectedItem = function(selectedItem)
{
	if (oFF.notNull(selectedItem) && this.canItemBeSelected(selectedItem))
	{
		selectedItem.setSelected(true);
	}
	return this;
};
oFF.DfUiContext.prototype.removeSelectedItem = function(selectedItem)
{
	if (oFF.notNull(selectedItem) && this.canItemBeSelected(selectedItem))
	{
		selectedItem.setSelected(false);
	}
	return this;
};
oFF.DfUiContext.prototype.clearSelectedItems = function()
{
	this.deselectAllItems();
	return this;
};
oFF.DfUiContext.prototype.checkIfChildCanBeAdded = function(child, operation, aggrDef)
{
	if (operation === oFF.UiOperation.SET)
	{
		return;
	}
	if (oFF.notNull(child))
	{
		var myType = this.getUiType();
		var childType = child.getUiType();
		if (childType.isFloatingControl())
		{
			var errorMsg1 = oFF.XStringUtils.concatenate3("Control of type ", childType.getName(), " cannot have a parent, since it is a floating control. Do not attach it to a parent or use floatingControls section in a quasar document!");
			throw oFF.XException.createRuntimeException(errorMsg1);
		}
		if (childType === oFF.UiType.ROOT)
		{
			throw oFF.XException.createRuntimeException("UxRoot cannot be added as a child to a parent control. UxRoot should only be rendered at a native anchor id or native anchor object!");
		}
		if (oFF.notNull(aggrDef))
		{
			if (myType.hasAggregation(aggrDef) === false)
			{
				var errorMsg2 = oFF.XStringUtils.concatenate5("Control of type ", myType.getName(), " does not have the aggregation ", aggrDef.getName(), ".");
				throw oFF.XException.createRuntimeException(errorMsg2);
			}
		}
		if (myType.getAllowedItemType() !== null && aggrDef === oFF.UiAggregation.ITEMS)
		{
			if (childType.isTypeOf(myType.getAllowedItemType()) === false)
			{
				var errorMsg3 = oFF.XStringUtils.concatenate5("Control of type ", myType.getName(), " only accepts items of type ", myType.getAllowedItemType().getName(), ".");
				throw oFF.XException.createRuntimeException(errorMsg3);
			}
		}
	}
	else
	{
		throw oFF.XException.createRuntimeException("Cannot add 'null' as child to a parent. Something went wrong with child creation or 'null' was passed as a argument.");
	}
};
oFF.DfUiContext.prototype.setPropertyStringValue = function(property, value)
{
	oFF.UiUtils.setPropertyStringValue(this, property, value);
};
oFF.DfUiContext.prototype.hasNullByKey = function(name)
{
	return this.m_properties.containsKey(name) && this.m_properties.getByKey(name) === null;
};
oFF.DfUiContext.prototype.putNull = function(name)
{
	this.m_properties.put(name, null);
};
oFF.DfUiContext.prototype.putStringNotNull = function(name, stringValue)
{
	if (oFF.notNull(stringValue))
	{
		this.m_properties.put(name, oFF.XStringValue.create(stringValue));
	}
};
oFF.DfUiContext.prototype.putStringNotNullAndNotEmpty = function(name, stringValue)
{
	if (oFF.XStringUtils.isNotNullAndNotEmpty(stringValue))
	{
		this.m_properties.put(name, oFF.XStringValue.create(stringValue));
	}
};
oFF.DfUiContext.prototype.putString = function(name, stringValue)
{
	this.m_properties.put(name, oFF.XStringValue.create(stringValue));
};
oFF.DfUiContext.prototype.getStringByKey = function(name)
{
	return this.getStringByKeyExt(name, null);
};
oFF.DfUiContext.prototype.getStringByKeyExt = function(name, defaultValue)
{
	var value = this.m_properties.getByKey(name);
	if (this.m_properties.containsKey(name))
	{
		return value.getString();
	}
	return defaultValue;
};
oFF.DfUiContext.prototype.putDouble = function(name, doubleValue)
{
	this.m_properties.put(name, oFF.XDoubleValue.create(doubleValue));
};
oFF.DfUiContext.prototype.getDoubleByKey = function(name)
{
	return this.getDoubleByKeyExt(name, 0.0);
};
oFF.DfUiContext.prototype.getDoubleByKeyExt = function(name, defaultValue)
{
	var value = this.m_properties.getByKey(name);
	if (oFF.isNull(value))
	{
		return defaultValue;
	}
	return value.getDouble();
};
oFF.DfUiContext.prototype.putLong = function(name, longValue)
{
	this.m_properties.put(name, oFF.XLongValue.create(longValue));
};
oFF.DfUiContext.prototype.getLongByKey = function(name)
{
	return this.getLongByKeyExt(name, 0);
};
oFF.DfUiContext.prototype.getLongByKeyExt = function(name, defaultValue)
{
	var value = this.m_properties.getByKey(name);
	if (oFF.isNull(value))
	{
		return defaultValue;
	}
	return value.getLong();
};
oFF.DfUiContext.prototype.putBoolean = function(key, booleanValue)
{
	this.m_properties.put(key, oFF.XBooleanValue.create(booleanValue));
};
oFF.DfUiContext.prototype.getBooleanByKey = function(name)
{
	return this.getBooleanByKeyExt(name, false);
};
oFF.DfUiContext.prototype.getBooleanByKeyExt = function(name, defaultValue)
{
	var value = this.m_properties.getByKey(name);
	if (oFF.isNull(value))
	{
		return defaultValue;
	}
	return value.getBoolean();
};
oFF.DfUiContext.prototype.setObjectByName = function(name, value)
{
	if (oFF.notNull(value))
	{
		this.m_properties.put(name, value);
	}
	else
	{
		this.m_properties.remove(name);
	}
	return this;
};
oFF.DfUiContext.prototype.getObjectName = function(name)
{
	return this.getObjectByNameWithDefault(name, null);
};
oFF.DfUiContext.prototype.getObjectByNameWithDefault = function(name, defaultValue)
{
	var value = this.m_properties.getByKey(name);
	if (oFF.isNull(value))
	{
		return defaultValue;
	}
	return value;
};
oFF.DfUiContext.prototype.putInteger = function(name, intValue)
{
	this.m_properties.put(name, oFF.XIntegerValue.create(intValue));
};
oFF.DfUiContext.prototype.getIntegerByKey = function(name)
{
	return this.getIntegerByKeyExt(name, 0);
};
oFF.DfUiContext.prototype.getIntegerByKeyExt = function(name, defaultValue)
{
	var value = this.m_properties.getByKey(name);
	if (oFF.isNull(value))
	{
		return defaultValue;
	}
	return value.getInteger();
};
oFF.DfUiContext.prototype.setContentInternal = function(content)
{
	var theContext = content;
	this.checkIfChildCanBeAdded(theContext, oFF.UiOperation.SET, null);
	if (oFF.notNull(theContext))
	{
		theContext.setParent(this);
	}
};
oFF.DfUiContext.prototype.addElementToAggregation = function(element, aggrDef)
{
	if (oFF.notNull(element) && oFF.notNull(aggrDef))
	{
		var tmpAggregation = this.getAggregation(aggrDef);
		var theContext = element;
		this.checkIfChildCanBeAdded(theContext, oFF.UiOperation.ADD, aggrDef);
		if (tmpAggregation.contains(theContext) === false)
		{
			theContext.linkToParentAggregation(this, aggrDef);
			theContext.setActiveIndex(tmpAggregation.size());
			tmpAggregation.add(theContext);
			this.setAggregation(aggrDef, tmpAggregation);
		}
	}
};
oFF.DfUiContext.prototype.insertElementIntoAggregation = function(element, index, aggrDef)
{
	if (oFF.notNull(element) && oFF.notNull(aggrDef))
	{
		var tmpAggregation = this.getAggregation(aggrDef);
		if (index < 0 || index > tmpAggregation.size())
		{
			throw oFF.XException.createIllegalArgumentException("Illegal index");
		}
		var theContext = element;
		this.checkIfChildCanBeAdded(theContext, oFF.UiOperation.INSERT, aggrDef);
		if (tmpAggregation.contains(theContext) === false)
		{
			theContext.linkToParentAggregation(this, aggrDef);
			tmpAggregation.insert(index, theContext);
			this.setAggregation(aggrDef, tmpAggregation);
		}
	}
};
oFF.DfUiContext.prototype.removeElementFromAggregation = function(element, aggrDef)
{
	if (oFF.notNull(element) && oFF.notNull(aggrDef))
	{
		var tmpAggregation = this.getAggregation(aggrDef);
		var uiManager = this.getUiManager();
		uiManager.incCallLevel();
		var oldItem = tmpAggregation.removeElement(element);
		if (uiManager.isExternalCall1())
		{
			oldItem.setSelected(false);
			oldItem.unlinkFromParentAggregation();
		}
		this.setAggregation(aggrDef, tmpAggregation);
		uiManager.decCallLevel();
	}
};
oFF.DfUiContext.prototype.clearAggregation = function(aggrDef)
{
	if (oFF.notNull(aggrDef))
	{
		var tmpAggregation = this.getAggregation(aggrDef);
		if (oFF.notNull(tmpAggregation))
		{
			var uiManager = this.getUiManager();
			uiManager.incCallLevel();
			if (uiManager.isExternalCall1())
			{
				var aggrIterator = tmpAggregation.getIterator();
				while (aggrIterator.hasNext())
				{
					var tmpEle = aggrIterator.next();
					tmpEle.unlinkFromParentAggregation();
				}
			}
			tmpAggregation.clear();
			this.setAggregation(aggrDef, tmpAggregation);
			if (uiManager.isExternalCall1())
			{
				if (this.getUiType().supportsSelection())
				{
					var selectionAgr = this.getUiType().getSelectionAggregation();
					if (selectionAgr === aggrDef)
					{
						this.clearSelectedItems();
					}
				}
			}
			uiManager.decCallLevel();
		}
	}
};
oFF.DfUiContext.prototype.setElementIntoAggregation = function(index, element, aggrDef)
{
	var tmpAggregation = this.getAggregation(aggrDef);
	var theContext = element;
	if (tmpAggregation.contains(theContext) === false)
	{
		theContext.linkToParentAggregation(this, aggrDef);
		if (index >= 0 && index < tmpAggregation.size())
		{
			tmpAggregation.set(index, theContext);
			this.setAggregation(aggrDef, tmpAggregation);
			return;
		}
		throw oFF.XException.createIllegalArgumentException("Index out of bounds exception");
	}
};
oFF.DfUiContext.prototype.setParentAggregation = function(parentAggregation)
{
	this.m_parentAggregation = parentAggregation;
};
oFF.DfUiContext.prototype.getParentAggregation = function()
{
	return this.m_parentAggregation;
};
oFF.DfUiContext.prototype.getAggregation = function(aggrDef)
{
	var aggregationName = aggrDef.getName();
	var tmpAggregation = this.m_aggregations.getByKey(aggregationName);
	if (oFF.isNull(tmpAggregation))
	{
		return oFF.XList.create();
	}
	return tmpAggregation;
};
oFF.DfUiContext.prototype.setAggregation = function(aggrDef, aggregationItems)
{
	var aggregationName = aggrDef.getName();
	if (oFF.notNull(aggregationItems))
	{
		this.m_aggregations.put(aggregationName, aggregationItems);
	}
	else
	{
		this.m_aggregations.remove(aggregationName);
	}
};
oFF.DfUiContext.prototype.getAggregationSize = function(aggrDef)
{
	var tmpAggregationAsList = this.getAggregation(aggrDef);
	if (oFF.notNull(tmpAggregationAsList))
	{
		return tmpAggregationAsList.size();
	}
	return 0;
};
oFF.DfUiContext.prototype.getAggregationElementByIndex = function(aggrDef, index)
{
	var tmpAggregationAsList = this.getAggregation(aggrDef);
	if (oFF.notNull(tmpAggregationAsList) && tmpAggregationAsList.size() > index)
	{
		return tmpAggregationAsList.get(index);
	}
	return null;
};
oFF.DfUiContext.prototype.getIndexOfAggregationElement = function(aggrDef, element)
{
	var tmpAggregationAsList = this.getAggregation(aggrDef);
	if (oFF.notNull(tmpAggregationAsList))
	{
		for (var i = 0; i < tmpAggregationAsList.size(); i++)
		{
			if (element === tmpAggregationAsList.get(i))
			{
				return i;
			}
		}
	}
	return -1;
};
oFF.DfUiContext.prototype.getAggregationElementByName = function(aggrDef, name)
{
	var tmpAggregationAsList = this.getAggregation(aggrDef);
	if (oFF.notNull(tmpAggregationAsList) && oFF.notNull(name))
	{
		for (var i = 0; i < tmpAggregationAsList.size(); i++)
		{
			var tmpElement = tmpAggregationAsList.get(i);
			var childName = tmpElement.getName();
			if (oFF.notNull(childName) && oFF.XString.isEqual(name, childName))
			{
				return tmpElement;
			}
		}
	}
	return null;
};
oFF.DfUiContext.prototype.getAggregationElementById = function(aggrDef, elementId)
{
	var tmpAggregationAsList = this.getAggregation(aggrDef);
	if (oFF.notNull(tmpAggregationAsList) && oFF.notNull(elementId))
	{
		for (var i = 0; i < tmpAggregationAsList.size(); i++)
		{
			var tmpElement = tmpAggregationAsList.get(i);
			var tmpId = tmpElement.getId();
			if (oFF.notNull(tmpId) && oFF.XString.isEqual(elementId, tmpId))
			{
				return tmpElement;
			}
		}
	}
	return null;
};
oFF.DfUiContext.prototype.putEventListener = function(eventDef, listener)
{
	if (oFF.isNull(eventDef))
	{
		throw oFF.XException.createRuntimeException("Missing event definition. An event needs to be specified!");
	}
	this.m_listeners.put(eventDef.getName(), listener);
};
oFF.DfUiContext.prototype.getEventListener = function(eventDef)
{
	if (oFF.isNull(eventDef))
	{
		throw oFF.XException.createRuntimeException("Missing event definition. An event needs to be specified!");
	}
	return this.m_listeners.getByKey(eventDef.getName());
};
oFF.DfUiContext.prototype.deselectAllItems = function()
{
	var tmpSelAggregationAsList = this.getSelectionAggregationAsReadOnlyList();
	if (oFF.notNull(tmpSelAggregationAsList))
	{
		for (var a = 0; a < tmpSelAggregationAsList.size(); a++)
		{
			var aggrItem = tmpSelAggregationAsList.get(a);
			if (oFF.notNull(aggrItem) && aggrItem.isSelected() === true)
			{
				aggrItem.setSelected(false);
			}
		}
	}
};
oFF.DfUiContext.prototype.getSelectionAggregationAsReadOnlyList = function()
{
	if (this.getUiType().supportsSelection())
	{
		var selectionAggregation = this.getUiType().getSelectionAggregation();
		if (selectionAggregation === oFF.UiAggregation.TREE_TABLE_ROWS)
		{
			return this.getTreeTableRows();
		}
		var tmpAggregation = this.getAggregation(selectionAggregation);
		return tmpAggregation;
	}
	return null;
};
oFF.DfUiContext.prototype.canItemBeSelected = function(item)
{
	if (this.getUiType().supportsSelection())
	{
		var selectionAggregation = this.getUiType().getSelectionAggregation();
		if (oFF.notNull(selectionAggregation) && oFF.notNull(item))
		{
			if (selectionAggregation.getItemType() === null || selectionAggregation.getItemType().isEqualTo(item.getUiType()))
			{
				return true;
			}
		}
	}
	return false;
};
oFF.DfUiContext.prototype.getChartType = oFF.noSupport;
oFF.DfUiContext.prototype.setChartType = oFF.noSupport;
oFF.DfUiContext.prototype.getStringRepresentation = oFF.noSupport;
oFF.DfUiContext.prototype.getValueType = oFF.noSupport;
oFF.DfUiContext.prototype.toString = function()
{
	var stringBuffer = oFF.XStringBuffer.create();
	var uiType = this.getUiType();
	if (oFF.notNull(uiType))
	{
		stringBuffer.append(uiType.getName());
		stringBuffer.append(": ");
	}
	var name = this.getName();
	stringBuffer.appendLine(name);
	var keys = this.m_properties.getKeysAsIteratorOfString();
	while (keys.hasNext())
	{
		var currentKey = keys.next();
		var value = null;
		var valueObj = this.m_properties.getByKey(currentKey);
		if (oFF.notNull(valueObj) && oFF.XString.isEqual(currentKey, oFF.UiProperty.PARENT.getName()))
		{
			var tmpParent = valueObj;
			value = oFF.XStringUtils.concatenate4(tmpParent.getId(), "(", tmpParent.getName(), ")");
		}
		else if (oFF.notNull(valueObj))
		{
			value = valueObj.toString();
		}
		stringBuffer.append(currentKey).append(" = ").appendLine(value);
	}
	return stringBuffer.toString();
};

oFF.UiComposite = function() {};
oFF.UiComposite.prototype = new oFF.DfUiContext();
oFF.UiComposite.prototype._ff_c = "UiComposite";

oFF.UiComposite.prototype.m_baseControl = null;
oFF.UiComposite.prototype.initializeComposite = function() {};
oFF.UiComposite.prototype.releaseObject = function()
{
	this.m_baseControl = null;
	oFF.DfUiContext.prototype.releaseObject.call( this );
};
oFF.UiComposite.prototype.initializeNative = function()
{
	this.initializeComposite();
};
oFF.UiComposite.prototype.getBaseControl = function()
{
	return this.m_baseControl;
};
oFF.UiComposite.prototype.setBaseControl = function(baseControl)
{
	this.m_baseControl = baseControl;
	if (oFF.notNull(this.m_baseControl))
	{
		this.m_baseControl.setParent(this);
	}
	return this;
};
oFF.UiComposite.prototype.getNativeControl = function()
{
	if (oFF.notNull(this.m_baseControl))
	{
		return this.m_baseControl.getNativeControl();
	}
	var msg = oFF.XStringUtils.concatenate3("Error while rendering the ", this.getUiType().getName(), " composite control. No base control specified, cannot render!");
	this.getUiManager().getFreeGenesis().showErrorToast(msg);
	throw oFF.XException.createIllegalStateException(msg);
};

oFF.UiAnalyticalCard = function() {};
oFF.UiAnalyticalCard.prototype = new oFF.UiComposite();
oFF.UiAnalyticalCard.prototype._ff_c = "UiAnalyticalCard";

oFF.UiAnalyticalCard.create = function()
{
	var newObject = new oFF.UiAnalyticalCard();
	newObject.setup();
	return newObject;
};
oFF.UiAnalyticalCard.prototype.m_cardWrapper = null;
oFF.UiAnalyticalCard.prototype.m_card = null;
oFF.UiAnalyticalCard.prototype.m_chart = null;
oFF.UiAnalyticalCard.prototype.m_noKpiData = null;
oFF.UiAnalyticalCard.prototype.m_noChartData = null;
oFF.UiAnalyticalCard.prototype.m_errorWrapper = null;
oFF.UiAnalyticalCard.prototype.setup = function()
{
	oFF.UiComposite.prototype.setup.call( this );
};
oFF.UiAnalyticalCard.prototype.initializeComposite = function()
{
	this.m_cardWrapper = this.newControl(oFF.UiType.FLEX_LAYOUT);
	this.m_cardWrapper.setDirection(oFF.UiFlexDirection.COLUMN);
	this.m_cardWrapper.setWidth(oFF.UiCssLength.create("368px"));
	this.m_cardWrapper.setHeight(oFF.UiCssLength.create("462px"));
	this.m_cardWrapper.setBackgroundColor(oFF.UiColor.WHITE);
	this.m_noKpiData = this.m_cardWrapper.addNewItemOfType(oFF.UiType.FLEX_LAYOUT);
	this.m_noKpiData.setHeight(oFF.UiCssLength.create("152px"));
	this.m_noKpiData.setAlignItems(oFF.UiFlexAlignItems.CENTER);
	this.m_noKpiData.setJustifyContent(oFF.UiFlexJustifyContent.CENTER);
	this.m_noKpiData.addNewItemOfType(oFF.UiType.LABEL).setText("No Kpi data").setFontWeight(oFF.UiFontWeight.BOLD);
	this.m_noChartData = this.m_cardWrapper.addNewItemOfType(oFF.UiType.FLEX_LAYOUT);
	this.m_noChartData.setHeight(oFF.UiCssLength.create("310px"));
	this.m_noChartData.setAlignItems(oFF.UiFlexAlignItems.CENTER);
	this.m_noChartData.setJustifyContent(oFF.UiFlexJustifyContent.CENTER);
	this.m_noChartData.addNewItemOfType(oFF.UiType.LABEL).setText("No Chart data").setFontWeight(oFF.UiFontWeight.BOLD);
	this.m_card = this.m_cardWrapper.newItemOfType(oFF.UiType.CARD);
	this.m_card.setHeight(oFF.UiCssLength.createAuto());
	this.m_chart = this.m_cardWrapper.newItemOfType(oFF.UiType.CHART);
	this.m_chart.setHeight(oFF.UiCssLength.create("310px"));
	this.setBaseControl(this.m_cardWrapper);
};
oFF.UiAnalyticalCard.prototype.releaseObject = function()
{
	this.m_errorWrapper = oFF.XObjectExt.release(this.m_errorWrapper);
	this.m_noKpiData = oFF.XObjectExt.release(this.m_noKpiData);
	this.m_noChartData = oFF.XObjectExt.release(this.m_noChartData);
	this.m_chart = oFF.XObjectExt.release(this.m_chart);
	this.m_card = oFF.XObjectExt.release(this.m_card);
	this.m_cardWrapper = oFF.XObjectExt.release(this.m_cardWrapper);
	oFF.UiComposite.prototype.releaseObject.call( this );
};
oFF.UiAnalyticalCard.prototype.setModelJson = function(model)
{
	oFF.UiComposite.prototype.setModelJson.call( this , model);
	if (model.isStructure())
	{
		if (model.asStructure().containsKey("sap.card"))
		{
			this.m_cardWrapper.removeItem(this.m_noKpiData);
			this.m_cardWrapper.insertItem(this.m_card, 0);
			this.m_card.setModelJson(model);
		}
		else
		{
			this.m_cardWrapper.removeItem(this.m_noChartData);
			this.m_cardWrapper.addItem(this.m_chart);
			this.m_chart.setModelJson(model);
		}
	}
	return this;
};
oFF.UiAnalyticalCard.prototype.setDataManifest = function(dataManifest)
{
	oFF.UiComposite.prototype.setDataManifest.call( this , dataManifest);
	var hasError = dataManifest.getBooleanByKeyExt("HasError", false);
	if (hasError)
	{
		var errorText = dataManifest.getStringByKeyExt("ErrorText", "");
		if (oFF.XStringUtils.isNullOrEmpty(errorText))
		{
			errorText = "No error text specified";
		}
		if (oFF.isNull(this.m_errorWrapper))
		{
			this.m_errorWrapper = this.m_cardWrapper.addNewItemOfType(oFF.UiType.FLEX_LAYOUT);
			this.m_errorWrapper.setDirection(oFF.UiFlexDirection.COLUMN);
		}
		this.m_cardWrapper.setHeight(oFF.UiCssLength.create("562px"));
		this.m_errorWrapper.addNewItemOfType(oFF.UiType.TEXT).setText(errorText).setFontColor(oFF.UiColor.RED).setHeight(oFF.UiCssLength.create("100px"));
	}
};

oFF.UiFancyButton = function() {};
oFF.UiFancyButton.prototype = new oFF.UiComposite();
oFF.UiFancyButton.prototype._ff_c = "UiFancyButton";

oFF.UiFancyButton.create = function()
{
	var newObject = new oFF.UiFancyButton();
	newObject.setup();
	return newObject;
};
oFF.UiFancyButton.prototype.m_allowRegisterOnPress = false;
oFF.UiFancyButton.prototype.m_allowSetText = false;
oFF.UiFancyButton.prototype.m_button = null;
oFF.UiFancyButton.prototype.setup = function()
{
	oFF.UiComposite.prototype.setup.call( this );
	this.m_allowRegisterOnPress = true;
	this.m_allowSetText = true;
};
oFF.UiFancyButton.prototype.initializeComposite = function()
{
	var flexLayout = this.newControl(oFF.UiType.FLEX_LAYOUT);
	flexLayout.addNewItemOfType(oFF.UiType.LABEL).setText("[Left Label]");
	this.m_button = flexLayout.addNewItemOfType(oFF.UiType.BUTTON);
	this.m_button.setBackgroundColor(oFF.UiColor.create("#67d6ee"));
	this.m_button.setText("I am fancy!");
	flexLayout.addNewItemOfType(oFF.UiType.LABEL).setText("[Right Label]");
	this.setBaseControl(flexLayout);
};
oFF.UiFancyButton.prototype.releaseObject = function()
{
	this.m_button = oFF.XObjectExt.release(this.m_button);
	oFF.UiComposite.prototype.releaseObject.call( this );
};
oFF.UiFancyButton.prototype.setText = function(text)
{
	oFF.UiComposite.prototype.setText.call( this , text);
	if (this.m_allowSetText)
	{
		this.m_button.setText(text);
	}
	return this;
};
oFF.UiFancyButton.prototype.registerOnPress = function(listener)
{
	oFF.UiComposite.prototype.registerOnPress.call( this , listener);
	if (this.m_allowRegisterOnPress)
	{
		this.m_button.registerOnPress(listener);
	}
	return this;
};

oFF.UiModule = function() {};
oFF.UiModule.prototype = new oFF.DfModule();
oFF.UiModule.prototype._ff_c = "UiModule";

oFF.UiModule.s_module = null;
oFF.UiModule.getInstance = function()
{
	if (oFF.isNull(oFF.UiModule.s_module))
	{
		oFF.DfModule.checkInitialized(oFF.KernelNativeModule.getInstance());
		oFF.DfModule.checkInitialized(oFF.BindingModule.getInstance());
		oFF.UiModule.s_module = oFF.DfModule.startExt(new oFF.UiModule());
		oFF.UiComponentType.staticSetupUiComponentType();
		oFF.UiConstants.staticSetup();
		oFF.UiColor.staticSetup();
		oFF.UiCssSizeUnit.staticSetup();
		oFF.UiPlatform.staticSetup();
		oFF.UiStyleClass.staticSetup();
		oFF.UiDeviceType.staticSetup();
		oFF.UiDeviceOs.staticSetup();
		oFF.UiDeviceEnvironment.staticSetup();
		oFF.UiDeviceFramework.staticSetup();
		oFF.UiFontWeight.staticSetup();
		oFF.UiSemanticTextStyle.staticSetup();
		oFF.UiFontStyle.staticSetup();
		oFF.UiFontWeight.staticSetup();
		oFF.UiAlignment.staticSetup();
		oFF.UiTextAlign.staticSetup();
		oFF.UiSemanticCellStyle.staticSetup();
		oFF.UiBorderStyle.staticSetup();
		oFF.UiClientType.staticSetup();
		oFF.UiDrillState.staticSetup();
		oFF.UiSelectionMode.staticSetup();
		oFF.UiSelectionBehavior.staticSetup();
		oFF.UiHierarchyType.staticSetup();
		oFF.UiExtension.staticSetup();
		oFF.UiPagingType.staticSetup();
		oFF.UiConstants.staticSetup();
		oFF.UiItemPosition.staticSetup();
		oFF.UiOperation.staticSetup();
		oFF.UiInputType.staticSetup();
		oFF.UiListType.staticSetup();
		oFF.UiButtonType.staticSetup();
		oFF.UiNodeType.staticSetup();
		oFF.UiMessageType.staticSetup();
		oFF.UiVisibleRowCountMode.staticSetup();
		oFF.UiFlexDirection.staticSetup();
		oFF.UiFlexAlignItems.staticSetup();
		oFF.UiFlexAlignContent.staticSetup();
		oFF.UiFlexJustifyContent.staticSetup();
		oFF.UiFlexWrap.staticSetup();
		oFF.UiFlexAlignSelf.staticSetup();
		oFF.UiValueState.staticSetup();
		oFF.UiPlacementType.staticSetup();
		oFF.UiPressedButtonType.staticSetup();
		oFF.UiOverflow.staticSetup();
		oFF.UiLoadState.staticSetup();
		oFF.UiFrameType.staticSetup();
		oFF.UiTileMode.staticSetup();
		oFF.UiDropPosition.staticSetup();
		oFF.UiDropEffect.staticSetup();
		oFF.UiDropLayout.staticSetup();
		oFF.UiRelativeDropPosition.staticSetup();
		oFF.UiIconTabBarHeaderMode.staticSetup();
		oFF.UiTextDecorationLine.staticSetup();
		oFF.UiTextDecorationStyle.staticSetup();
		oFF.UiType.staticSetup();
		oFF.UiType.FANCY_BUTTON.setFactory(new oFF.UiFancyButtonFactory());
		oFF.UiType.ANALYTICAL_CARD.setFactory(new oFF.UiAnalyticalCardFactory());
		oFF.UiTheme.staticSetup();
		oFF.UiParamCode.staticSetupUiParam();
		oFF.UiParamAxColumns.staticSetup();
		oFF.UiParamAxRows.staticSetup();
		oFF.UiParamAxRowCells.staticSetup();
		oFF.UiParamAxName.staticSetup();
		oFF.UiParamAxText.staticSetup();
		oFF.UiParamAxWidthInPixel.staticSetup();
		oFF.UiParamAxColumnName.staticSetup();
		oFF.SigSelManager.registerFactory(oFF.XComponentType._UI, new oFF.UiContextSpaceFactory());
		oFF.UiAppDialogFactory.staticSetup();
		oFF.UiInfoDialog.staticSetup();
		oFF.UiManagerSubSystemFactory.staticSetup();
		oFF.ProgramRegistration.setProgramFactory(oFF.SubSysGuiPrg.DEFAULT_PROGRAM_NAME, new oFF.SubSysGuiPrg());
		oFF.DfModule.stopExt(oFF.UiModule.s_module);
	}
	return oFF.UiModule.s_module;
};
oFF.UiModule.prototype.getName = function()
{
	return "ff2200.ui";
};

oFF.UiModule.getInstance();

return sap.firefly;
	} );