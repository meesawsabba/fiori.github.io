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

oFF.SxAppStoreAppItem = function() {};
oFF.SxAppStoreAppItem.prototype = new oFF.XObject();
oFF.SxAppStoreAppItem.prototype._ff_c = "SxAppStoreAppItem";

oFF.SxAppStoreAppItem.createAppStoreItem = function(studioApp, genesis, session, listener)
{
	if (oFF.isNull(studioApp))
	{
		throw oFF.XException.createRuntimeException("Cannot create an App Store app item instance without a reference studio app. Please sepcify a studio app!");
	}
	if (oFF.isNull(genesis))
	{
		throw oFF.XException.createRuntimeException("Cannot create an App Store app item instance without a genesis. Please sepcify a genesis!");
	}
	if (oFF.isNull(session))
	{
		throw oFF.XException.createRuntimeException("Cannot create an App Store app item instance without a session. Please sepcify a session!");
	}
	var appStoreAppItem = new oFF.SxAppStoreAppItem();
	appStoreAppItem.setupDialog(studioApp, genesis, session, listener);
	return appStoreAppItem;
};
oFF.SxAppStoreAppItem.prototype.m_studioApp = null;
oFF.SxAppStoreAppItem.prototype.m_genesis = null;
oFF.SxAppStoreAppItem.prototype.m_session = null;
oFF.SxAppStoreAppItem.prototype.m_appItemListItem = null;
oFF.SxAppStoreAppItem.prototype.m_addToLaunchpadBtn = null;
oFF.SxAppStoreAppItem.prototype.m_listener = null;
oFF.SxAppStoreAppItem.prototype.releaseObject = function()
{
	this.m_addToLaunchpadBtn = oFF.XObjectExt.release(this.m_addToLaunchpadBtn);
	this.m_appItemListItem = oFF.XObjectExt.release(this.m_appItemListItem);
	this.m_studioApp = null;
	this.m_genesis = null;
	this.m_session = null;
	this.m_listener = null;
	oFF.XObject.prototype.releaseObject.call( this );
};
oFF.SxAppStoreAppItem.prototype.setupDialog = function(studioApp, genesis, session, listener)
{
	this.m_studioApp = studioApp;
	this.m_genesis = genesis;
	this.m_session = session;
	this.m_listener = listener;
	this.buildAppItem();
};
oFF.SxAppStoreAppItem.prototype.buildAppItem = function()
{
	this.m_appItemListItem = this.m_genesis.newControl(oFF.UiType.CUSTOM_LIST_ITEM);
	this.m_appItemListItem.setListItemType(oFF.UiListType.INACTIVE);
	this.m_appItemListItem.setMargin(oFF.UiCssBoxEdges.create("5px"));
	this.m_appItemListItem.setBorderSize(oFF.UiCssLength.create("0px"));
	var appItemWrapperLayout = this.m_appItemListItem.setNewContent(oFF.UiType.FLEX_LAYOUT);
	appItemWrapperLayout.setTag("appItemLayout");
	appItemWrapperLayout.setDirection(oFF.UiFlexDirection.ROW);
	appItemWrapperLayout.setAlignItems(oFF.UiFlexAlignItems.START);
	appItemWrapperLayout.setFlex("auto");
	appItemWrapperLayout.useMaxSpace();
	appItemWrapperLayout.setBackgroundColor(oFF.UiColor.create("#f0f2f4"));
	appItemWrapperLayout.setCornerRadius(oFF.UiCssBoxEdges.create("10px"));
	appItemWrapperLayout.setBorderSize(oFF.UiCssLength.create("1px"));
	appItemWrapperLayout.setBorderColor(oFF.UiColor.create("#a0a8b0"));
	appItemWrapperLayout.setPadding(oFF.UiCssBoxEdges.create("5px"));
	appItemWrapperLayout.setTooltip(oFF.XStringUtils.concatenate2("by ", this.m_studioApp.getAuthor()));
	var appAppIcon = appItemWrapperLayout.addNewItemOfType(oFF.UiType.APP_ICON);
	appAppIcon.setName(oFF.XStringUtils.concatenate2(this.m_studioApp.getProgramName(), "_appStoreIcon"));
	appAppIcon.setFlex("0 0 auto");
	appAppIcon.setText("");
	appAppIcon.setSrc(this.m_studioApp.getResolvedAppIconImagePath(this.m_session));
	appAppIcon.setHeight(oFF.UiCssLength.create("77px"));
	appAppIcon.setPadding(oFF.UiCssBoxEdges.create("15px"));
	var appTileTitleDescWrapper = appItemWrapperLayout.addNewItemOfType(oFF.UiType.FLEX_LAYOUT);
	appTileTitleDescWrapper.setHeight(oFF.UiCssLength.create("90px"));
	appTileTitleDescWrapper.setFlex("1 1 70%");
	appTileTitleDescWrapper.setDirection(oFF.UiFlexDirection.COLUMN);
	appTileTitleDescWrapper.setAlignItems(oFF.UiFlexAlignItems.START);
	appTileTitleDescWrapper.setOverflow(oFF.UiOverflow.HIDDEN);
	appTileTitleDescWrapper.setMargin(oFF.UiCssBoxEdges.create("5px"));
	var appNameLbl = appTileTitleDescWrapper.addNewItemOfType(oFF.UiType.LABEL);
	appNameLbl.setTag("appNameLbl");
	appNameLbl.setText(this.m_studioApp.getDisplayName());
	appNameLbl.setTextAlign(oFF.UiTextAlign.CENTER);
	appNameLbl.setHeight(oFF.UiCssLength.create("30%"));
	appNameLbl.setFontSize(oFF.UiCssLength.create("140%"));
	appNameLbl.setFontColor(oFF.UiColor.BLACK);
	appNameLbl.setFontWeight(oFF.UiFontWeight.BOLD);
	appNameLbl.setMargin(oFF.UiCssBoxEdges.create("5px"));
	var appDescriptionLbl = appTileTitleDescWrapper.addNewItemOfType(oFF.UiType.LABEL);
	appDescriptionLbl.setTag("appDescriptionLbl");
	appDescriptionLbl.setText(this.m_studioApp.getDescription());
	appDescriptionLbl.setTextAlign(oFF.UiTextAlign.LEFT);
	appDescriptionLbl.setWrapping(true);
	appDescriptionLbl.setHeight(oFF.UiCssLength.create("70%"));
	appDescriptionLbl.setFontSize(oFF.UiCssLength.create("100%"));
	appDescriptionLbl.setMargin(oFF.UiCssBoxEdges.create("5px"));
	this.m_addToLaunchpadBtn = appItemWrapperLayout.addNewItemOfType(oFF.UiType.BUTTON);
	this.m_addToLaunchpadBtn.setName(oFF.XStringUtils.concatenate2(this.m_studioApp.getProgramName(), "_addToLaunchpadBtn"));
	this.m_addToLaunchpadBtn.setFlex("0 0 auto");
	this.m_addToLaunchpadBtn.setTag("addToLaunchpadBtn");
	this.m_addToLaunchpadBtn.setText("Add");
	this.m_addToLaunchpadBtn.setIcon("add");
	this.m_addToLaunchpadBtn.setMargin(oFF.UiCssBoxEdges.create("0px 20px 0px 0px"));
	this.m_addToLaunchpadBtn.setAlignSelf(oFF.UiFlexAlignSelf.CENTER);
	this.m_addToLaunchpadBtn.registerOnPress(this);
	this.updateAppItemAppStatus();
};
oFF.SxAppStoreAppItem.prototype.getAppItem = function()
{
	return this.m_appItemListItem;
};
oFF.SxAppStoreAppItem.prototype.getStudioApp = function()
{
	return this.m_studioApp;
};
oFF.SxAppStoreAppItem.prototype.updateAppItemAppStatus = function()
{
	if (this.m_studioApp.isVisibleOnLaunchpad() === true)
	{
		this.m_addToLaunchpadBtn.setEnabled(false);
		this.m_addToLaunchpadBtn.setButtonType(oFF.UiButtonType.DEFAULT);
		this.m_addToLaunchpadBtn.setTooltip("Aleady on launchpad");
	}
	else
	{
		this.m_addToLaunchpadBtn.setEnabled(true);
		this.m_addToLaunchpadBtn.setButtonType(oFF.UiButtonType.PRIMARY);
		this.m_addToLaunchpadBtn.setTooltip("Add to launchpad");
	}
};
oFF.SxAppStoreAppItem.prototype.onPress = function(event)
{
	var pressedItem = event.getControl();
	if (this.m_addToLaunchpadBtn === pressedItem && oFF.notNull(this.m_listener))
	{
		this.m_listener.onAddAppToLaunchpadPressed(this.m_studioApp);
		this.updateAppItemAppStatus();
	}
};

oFF.SxDlgUserSettings = function() {};
oFF.SxDlgUserSettings.prototype = new oFF.XObject();
oFF.SxDlgUserSettings.prototype._ff_c = "SxDlgUserSettings";

oFF.SxDlgUserSettings.createUserSettingsDialog = function(genesis, launchWallpaperSrc, selectedThemeName, listener)
{
	if (oFF.isNull(genesis))
	{
		throw oFF.XException.createRuntimeException("Cannot create a User Settings dialog instance without a genesis. Please sepcify a genesis!");
	}
	var userSettingsDlg = new oFF.SxDlgUserSettings();
	userSettingsDlg.setupDialog(genesis, launchWallpaperSrc, selectedThemeName, listener);
	return userSettingsDlg;
};
oFF.SxDlgUserSettings.prototype.m_userSettingsDialog = null;
oFF.SxDlgUserSettings.prototype.m_wallpaperSrcInput = null;
oFF.SxDlgUserSettings.prototype.m_genesis = null;
oFF.SxDlgUserSettings.prototype.m_listener = null;
oFF.SxDlgUserSettings.prototype.m_themeMap = null;
oFF.SxDlgUserSettings.prototype.releaseObject = function()
{
	this.m_userSettingsDialog = oFF.XObjectExt.release(this.m_userSettingsDialog);
	this.m_wallpaperSrcInput = oFF.XObjectExt.release(this.m_wallpaperSrcInput);
	this.m_themeMap = oFF.XObjectExt.release(this.m_themeMap);
	this.m_genesis = null;
	this.m_listener = null;
	oFF.XObject.prototype.releaseObject.call( this );
};
oFF.SxDlgUserSettings.prototype.setupDialog = function(genesis, launchWallpaperSrc, selectedThemeName, listener)
{
	this.m_genesis = genesis;
	this.m_listener = listener;
	this.m_themeMap = oFF.XHashMapOfStringByString.create();
	this.createThemeMap();
	this.buildDialogUi(genesis, launchWallpaperSrc, selectedThemeName);
};
oFF.SxDlgUserSettings.prototype.buildDialogUi = function(genesis, launchWallpaperSrc, selectedThemeName)
{
	this.m_userSettingsDialog = this.m_genesis.newControl(oFF.UiType.DIALOG);
	this.m_userSettingsDialog.setName("userSettingsDialog");
	this.m_userSettingsDialog.setTitle("User Settings");
	this.m_userSettingsDialog.setWidth(oFF.UiCssLength.create("500px"));
	this.m_userSettingsDialog.setPadding(oFF.UiCssBoxEdges.create("20px"));
	var closeUserSettingsDialogBtn = this.m_userSettingsDialog.addNewDialogButton();
	closeUserSettingsDialogBtn.setName("closeUserSettingsDialogBtn");
	closeUserSettingsDialogBtn.setText("Close");
	closeUserSettingsDialogBtn.registerOnPress(this);
	var dialogLayout = this.m_userSettingsDialog.setNewContent(oFF.UiType.FLEX_LAYOUT);
	dialogLayout.setName("dialogLayout");
	dialogLayout.useMaxSpace();
	dialogLayout.setDirection(oFF.UiFlexDirection.COLUMN);
	var wallpaperLbl = dialogLayout.addNewItemOfType(oFF.UiType.LABEL);
	wallpaperLbl.setText("Wallpaper");
	wallpaperLbl.setFontWeight(oFF.UiFontWeight.BOLD);
	wallpaperLbl.setMargin(oFF.UiCssBoxEdges.create("0px 0px 5px 0px"));
	this.m_wallpaperSrcInput = dialogLayout.addNewItemOfType(oFF.UiType.INPUT);
	this.m_wallpaperSrcInput.setName("wallpaperSrcInput");
	this.m_wallpaperSrcInput.setText(launchWallpaperSrc);
	this.m_wallpaperSrcInput.setPlaceholder("Enter wallpaper url");
	this.m_wallpaperSrcInput.setMargin(oFF.UiCssBoxEdges.create("0px 0px 5px 0px"));
	var desktopWallpaperButtonsContainer = dialogLayout.addNewItemOfType(oFF.UiType.HORIZONTAL_LAYOUT);
	desktopWallpaperButtonsContainer.setName("desktopWallpaperButtonsContainer");
	desktopWallpaperButtonsContainer.setWidth(oFF.UiCssLength.create("100%"));
	desktopWallpaperButtonsContainer.setMargin(oFF.UiCssBoxEdges.create("0px 0px 10px 0px"));
	var applyWallpaperBtn = desktopWallpaperButtonsContainer.addNewItemOfType(oFF.UiType.BUTTON);
	applyWallpaperBtn.setName("applyWallpaperBtn");
	applyWallpaperBtn.setText("Apply wallpaper");
	applyWallpaperBtn.setIcon("accept");
	applyWallpaperBtn.registerOnPress(this);
	applyWallpaperBtn.setMargin(oFF.UiCssBoxEdges.create("0px 10px 0px 0px"));
	var restoreDefaultWallpaperBtn = desktopWallpaperButtonsContainer.addNewItemOfType(oFF.UiType.BUTTON);
	restoreDefaultWallpaperBtn.setName("restoreDefaultWallpaperBtn");
	restoreDefaultWallpaperBtn.setText("Restore wallpaper");
	restoreDefaultWallpaperBtn.setIcon("reset");
	restoreDefaultWallpaperBtn.registerOnPress(this);
	var restoreLaunchpadIconsLbl = dialogLayout.addNewItemOfType(oFF.UiType.LABEL);
	restoreLaunchpadIconsLbl.setText("Restore launchpad icons to initial state");
	restoreLaunchpadIconsLbl.setFontWeight(oFF.UiFontWeight.BOLD);
	restoreLaunchpadIconsLbl.setMargin(oFF.UiCssBoxEdges.create("0px 0px 5px 0px"));
	var restoreLaunchpadIconsBtn = dialogLayout.addNewItemOfType(oFF.UiType.BUTTON);
	restoreLaunchpadIconsBtn.setName("restoreLaunchpadIconsBtn");
	restoreLaunchpadIconsBtn.setText("Restore launchpad icons");
	restoreLaunchpadIconsBtn.setIcon("reset");
	restoreLaunchpadIconsBtn.setWidth(oFF.UiCssLength.create("200px"));
	restoreLaunchpadIconsBtn.registerOnPress(this);
	restoreLaunchpadIconsBtn.setMargin(oFF.UiCssBoxEdges.create("0px 0px 10px 0px"));
	var restoreIconPositionsLbl = dialogLayout.addNewItemOfType(oFF.UiType.LABEL);
	restoreIconPositionsLbl.setText("Restore launchpad icon positions");
	restoreIconPositionsLbl.setFontWeight(oFF.UiFontWeight.BOLD);
	restoreIconPositionsLbl.setMargin(oFF.UiCssBoxEdges.create("0px 0px 5px 0px"));
	var restoreIconPositionsBtn = dialogLayout.addNewItemOfType(oFF.UiType.BUTTON);
	restoreIconPositionsBtn.setName("restoreIconPositionsBtn");
	restoreIconPositionsBtn.setText("Restore icon positions");
	restoreIconPositionsBtn.setIcon("reset");
	restoreIconPositionsBtn.setWidth(oFF.UiCssLength.create("200px"));
	restoreIconPositionsBtn.registerOnPress(this);
	restoreIconPositionsBtn.setMargin(oFF.UiCssBoxEdges.create("0px 0px 10px 0px"));
	var themeLbl = dialogLayout.addNewItemOfType(oFF.UiType.LABEL);
	themeLbl.setText("Theme");
	themeLbl.setFontWeight(oFF.UiFontWeight.BOLD);
	themeLbl.setMargin(oFF.UiCssBoxEdges.create("0px 0px 5px 0px"));
	var themeDropdown = dialogLayout.addNewItemOfType(oFF.UiType.DROPDOWN);
	themeDropdown.setName("themeDd");
	themeDropdown.setTooltip("Select a ui theme");
	themeDropdown.registerOnSelect(this);
	var themesKeyIterator = this.m_themeMap.getKeysAsIteratorOfString();
	while (themesKeyIterator.hasNext())
	{
		var themeKey = themesKeyIterator.next();
		var tmpDdItem = themeDropdown.addNewItem();
		tmpDdItem.setName(themeKey);
		tmpDdItem.setText(this.m_themeMap.getByKey(themeKey));
	}
	if (oFF.XStringUtils.isNotNullAndNotEmpty(selectedThemeName))
	{
		themeDropdown.setSelectedName(selectedThemeName);
	}
};
oFF.SxDlgUserSettings.prototype.openDialog = function()
{
	this.m_userSettingsDialog.open();
};
oFF.SxDlgUserSettings.prototype.setLaunchpadWallpaperSrc = function(launchWallpaperSrc)
{
	if (oFF.notNull(this.m_wallpaperSrcInput))
	{
		this.m_wallpaperSrcInput.setText(launchWallpaperSrc);
	}
};
oFF.SxDlgUserSettings.prototype.createThemeMap = function()
{
	if (oFF.isNull(this.m_themeMap))
	{
		this.m_themeMap = oFF.XHashMapOfStringByString.create();
	}
	this.m_themeMap.put("sap_belize", "SAP Belize");
	this.m_themeMap.put("sap_belize_hcb", "SAP Belize High Contrast Black");
	this.m_themeMap.put("sap_belize_hcw", "SAP Belize High Contrast White");
	this.m_themeMap.put("sap_belize_plus", "SAP Belize Plus");
	this.m_themeMap.put("sap_fiori_3", "SAP Quartz");
	this.m_themeMap.put("sap_fiori_3_dark", "SAP Quartz Dark");
	this.m_themeMap.put("sap_fiori_3_hcb", "SAP Quartz High Contrast Black");
	this.m_themeMap.put("sap_fiori_3_hcw", "SAP Quartz High Contrast White");
};
oFF.SxDlgUserSettings.prototype.onPress = function(event)
{
	var pressedItem = event.getControl();
	var name = pressedItem.getName();
	if (pressedItem.getUiType() === oFF.UiType.BUTTON)
	{
		if (oFF.XString.isEqual("restoreLaunchpadIconsBtn", name))
		{
			if (oFF.notNull(this.m_listener))
			{
				this.m_listener.onRestoreLaunchpadIconsPressed();
			}
		}
		if (oFF.XString.isEqual("restoreIconPositionsBtn", name))
		{
			if (oFF.notNull(this.m_listener))
			{
				this.m_listener.onRestoreIconPositionsPressed();
			}
		}
		if (oFF.XString.isEqual("applyWallpaperBtn", name))
		{
			if (oFF.notNull(this.m_listener))
			{
				this.m_listener.onApplyWallpaperPressed(this.m_wallpaperSrcInput.getText());
			}
		}
		if (oFF.XString.isEqual("restoreDefaultWallpaperBtn", name))
		{
			if (oFF.notNull(this.m_listener))
			{
				this.m_listener.onRestoreWallpaperPressed();
			}
		}
	}
	if (pressedItem.getUiType() === oFF.UiType.DIALOG_BUTTON)
	{
		if (oFF.XString.isEqual("closeUserSettingsDialogBtn", name))
		{
			this.m_userSettingsDialog.close();
		}
	}
};
oFF.SxDlgUserSettings.prototype.onSelect = function(event)
{
	var element = event.getControl();
	var selectedItem = event.getSelectedItem();
	if (element.getUiType() === oFF.UiType.DROPDOWN)
	{
		var themeName = selectedItem.getName();
		if (oFF.notNull(this.m_listener))
		{
			this.m_listener.onThemeChanged(themeName);
		}
	}
};

oFF.SxStudioApp = function() {};
oFF.SxStudioApp.prototype = new oFF.DfNameObject();
oFF.SxStudioApp.prototype._ff_c = "SxStudioApp";

oFF.SxStudioApp.DUMMY_APP_ICON_BASE64 = "data:image/png;base64,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";
oFF.SxStudioApp.createApp = function(programName)
{
	if (oFF.XStringUtils.isNullOrEmpty(programName))
	{
		throw oFF.XException.createRuntimeException("Cannot create an app without a program name. Please specify an program name for the app.");
	}
	var studioApp = new oFF.SxStudioApp();
	studioApp.setupExt(programName);
	return studioApp;
};
oFF.SxStudioApp.prototype.m_programCfg = null;
oFF.SxStudioApp.prototype.m_appIcon = null;
oFF.SxStudioApp.prototype.m_prgManifest = null;
oFF.SxStudioApp.prototype.setupExt = function(programName)
{
	this._setupInternal(programName);
	this.m_prgManifest = oFF.ProgramRegistration.getProgramManifest(programName);
	if (oFF.isNull(this.m_prgManifest))
	{
		throw oFF.XException.createRuntimeException("Program with the specified name cannot be found! Failed to create studio app!");
	}
};
oFF.SxStudioApp.prototype.releaseObject = function()
{
	this.m_appIcon = null;
	this.m_prgManifest = null;
	this.m_programCfg = oFF.XObjectExt.release(this.m_programCfg);
	oFF.DfNameObject.prototype.releaseObject.call( this );
};
oFF.SxStudioApp.prototype.getProgramName = function()
{
	return this.getName();
};
oFF.SxStudioApp.prototype.getProgramConfig = function()
{
	if (oFF.isNull(this.m_programCfg))
	{
		this.m_programCfg = oFF.ProgramStartCfg.create(null, this.getProgramName(), null, null);
	}
	return this.m_programCfg;
};
oFF.SxStudioApp.prototype.isInitiallyVisibleOnLaunchpad = function()
{
	return this.getProgramManifest().isInitiallyVisibleOnLaunchpad();
};
oFF.SxStudioApp.prototype.isVisibleOnLaunchpad = function()
{
	return this.getAppIcon() !== null;
};
oFF.SxStudioApp.prototype.getDisplayName = function()
{
	return this.getProgramManifest().getDisplayName();
};
oFF.SxStudioApp.prototype.getAuthor = function()
{
	return this.getProgramManifest().getAuthor();
};
oFF.SxStudioApp.prototype.getDescription = function()
{
	return this.getProgramManifest().getDescription();
};
oFF.SxStudioApp.prototype.getIconImagePath = function()
{
	return this.getProgramManifest().getIconPath();
};
oFF.SxStudioApp.prototype.getProgramManifest = function()
{
	return this.m_prgManifest;
};
oFF.SxStudioApp.prototype.getResolvedAppIconImagePath = function(session)
{
	var iconPath = null;
	if (oFF.notNull(session) && oFF.XStringUtils.isNotNullAndNotEmpty(this.getIconImagePath()))
	{
		iconPath = session.resolvePath(this.getIconImagePath());
	}
	return iconPath;
};
oFF.SxStudioApp.prototype.getDummyIconImageBase64 = function()
{
	return oFF.SxStudioApp.DUMMY_APP_ICON_BASE64;
};
oFF.SxStudioApp.prototype.getAppIcon = function()
{
	return this.m_appIcon;
};
oFF.SxStudioApp.prototype.setAppIcon = function(appIcon)
{
	this.m_appIcon = appIcon;
};

oFF.SxAppStoreDialog = function() {};
oFF.SxAppStoreDialog.prototype = new oFF.DfUiProgram();
oFF.SxAppStoreDialog.prototype._ff_c = "SxAppStoreDialog";

oFF.SxAppStoreDialog.DEFAULT_PROGRAM_NAME = "StudioAppStoreDialog";
oFF.SxAppStoreDialog.createRunner = function()
{
	var runner = oFF.KernelBoot.createByName(oFF.SxAppStoreDialog.DEFAULT_PROGRAM_NAME);
	return runner;
};
oFF.SxAppStoreDialog.createNewAppStoreDialogProgram = function()
{
	var prg = new oFF.SxAppStoreDialog();
	prg.setup();
	return prg;
};
oFF.SxAppStoreDialog.prototype.m_studioApps = null;
oFF.SxAppStoreDialog.prototype.m_listener = null;
oFF.SxAppStoreDialog.prototype.m_appStoreAppList = null;
oFF.SxAppStoreDialog.prototype.m_searchInput = null;
oFF.SxAppStoreDialog.prototype.m_allAppListItems = null;
oFF.SxAppStoreDialog.prototype.newProgram = function()
{
	var prg = new oFF.SxAppStoreDialog();
	prg.setup();
	return prg;
};
oFF.SxAppStoreDialog.prototype.doSetupProgramMetadata = function(metadata)
{
	oFF.DfUiProgram.prototype.doSetupProgramMetadata.call( this , metadata);
};
oFF.SxAppStoreDialog.prototype.evalArguments = function()
{
	oFF.DfUiProgram.prototype.evalArguments.call( this );
};
oFF.SxAppStoreDialog.prototype.initializeProgram = function()
{
	oFF.DfUiProgram.prototype.initializeProgram.call( this );
	this.setupInternal();
};
oFF.SxAppStoreDialog.prototype.releaseObject = function()
{
	this.m_studioApps = null;
	this.m_listener = null;
	this.m_searchInput = oFF.XObjectExt.release(this.m_searchInput);
	this.m_appStoreAppList = oFF.XObjectExt.release(this.m_appStoreAppList);
	this.m_allAppListItems.clear();
	this.m_allAppListItems = oFF.XObjectExt.release(this.m_allAppListItems);
	oFF.DfUiProgram.prototype.releaseObject.call( this );
};
oFF.SxAppStoreDialog.prototype.getLogSeverity = function()
{
	return oFF.DfUiProgram.prototype.getLogSeverity.call( this );
};
oFF.SxAppStoreDialog.prototype.getDefaultProgramDevice = function()
{
	return oFF.ProgramDevice.DIALOG;
};
oFF.SxAppStoreDialog.prototype.getMenuBarDisplayName = function()
{
	return oFF.SxAppStoreDialog.DEFAULT_PROGRAM_NAME;
};
oFF.SxAppStoreDialog.prototype.isShowMenuBar = function()
{
	return false;
};
oFF.SxAppStoreDialog.prototype.getDialogButtons = function(genesis)
{
	return null;
};
oFF.SxAppStoreDialog.prototype.getDefaultContainerSize = function()
{
	return oFF.UiSize.createByCss("700px", "80vh");
};
oFF.SxAppStoreDialog.prototype.setupInternal = function()
{
	this.m_studioApps = this.getArguments().getXObjectByKey("studioApps");
	this.m_listener = this.getArguments().getXObjectByKey("listener");
	this.m_allAppListItems = oFF.XList.create();
	this.setTitle("Firefly App Store");
};
oFF.SxAppStoreDialog.prototype.buildUi = function(genesis)
{
	oFF.DfUiProgram.prototype.buildUi.call( this , genesis);
	var appStoreDialogLayout = genesis.newControl(oFF.UiType.FLEX_LAYOUT);
	appStoreDialogLayout.setName("appStoreDialogLayout");
	appStoreDialogLayout.useMaxSpace();
	appStoreDialogLayout.setDirection(oFF.UiFlexDirection.COLUMN);
	this.m_searchInput = appStoreDialogLayout.addNewItemOfType(oFF.UiType.SEARCH_FIELD);
	this.m_searchInput.setName("appStoreAppSearchField");
	this.m_searchInput.setPlaceholder("Search app...");
	this.m_searchInput.setPadding(oFF.UiCssBoxEdges.create("10px"));
	this.m_searchInput.setHeight(oFF.UiCssLength.create("45px"));
	this.m_searchInput.registerOnSearch(this);
	this.m_searchInput.registerOnLiveChange(this);
	this.m_searchInput.setDebounceTime(1000);
	this.m_appStoreAppList = appStoreDialogLayout.addNewItemOfType(oFF.UiType.LIST);
	this.m_appStoreAppList.setName("appStoreAppList");
	this.m_appStoreAppList.useMaxSpace();
	this.m_appStoreAppList.setSelectionMode(oFF.UiSelectionMode.NONE);
	this.m_appStoreAppList.setPadding(oFF.UiCssBoxEdges.create("20px"));
	this.prepareAppList();
	this.updateAppList();
	genesis.setRoot(appStoreDialogLayout);
};
oFF.SxAppStoreDialog.prototype.updateAppList = function()
{
	this.m_appStoreAppList.clearItems();
	this.m_appStoreAppList.addAllItems(this.m_allAppListItems);
};
oFF.SxAppStoreDialog.prototype.prepareAppList = function()
{
	if (oFF.notNull(this.m_appStoreAppList))
	{
		if (oFF.notNull(this.m_studioApps) && this.m_studioApps.size() > 0)
		{
			var studioAppsIterator = this.m_studioApps.getIterator();
			while (studioAppsIterator.hasNext())
			{
				var tmpStudioApp = studioAppsIterator.next();
				var newAppStoreItem = oFF.SxAppStoreAppItem.createAppStoreItem(tmpStudioApp, this.m_genesis, this.getSession(), this.m_listener);
				if (oFF.notNull(newAppStoreItem))
				{
					var tmpAppItemListItem = newAppStoreItem.getAppItem();
					tmpAppItemListItem.setCustomObject(tmpStudioApp);
					this.m_allAppListItems.add(tmpAppItemListItem);
				}
			}
		}
	}
};
oFF.SxAppStoreDialog.prototype.filterAppList = function(searchText, clearButtonPressed)
{
	this.m_appStoreAppList.clearItems();
	if (clearButtonPressed === false)
	{
		for (var a = 0; a < this.m_allAppListItems.size(); a++)
		{
			var tmpListItem = this.m_allAppListItems.get(a);
			var tmpStudioApp = tmpListItem.getCustomObject();
			if (oFF.XString.containsString(oFF.XString.toLowerCase(tmpStudioApp.getDisplayName()), oFF.XString.toLowerCase(searchText)))
			{
				this.m_appStoreAppList.addItem(tmpListItem);
			}
		}
	}
	else
	{
		this.m_appStoreAppList.addAllItems(this.m_allAppListItems);
	}
};
oFF.SxAppStoreDialog.prototype.onLiveChange = function(event)
{
	if (event.getControl() === this.m_searchInput)
	{
		this.filterAppList(event.getControl().getText(), false);
	}
};
oFF.SxAppStoreDialog.prototype.onSearch = function(event)
{
	var didPressClearButton = event.getParameters().getBooleanByKeyExt(oFF.UiControlEvent.PARAM_CLEAR_BUTTON_PRESSED, false);
	var searchText = event.getParameters().getStringByKeyExt(oFF.UiControlEvent.PARAM_SEARCH_TEXT, "");
	this.filterAppList(searchText, didPressClearButton);
};

oFF.StudioClient = function() {};
oFF.StudioClient.prototype = new oFF.DfUiProgram();
oFF.StudioClient.prototype._ff_c = "StudioClient";

oFF.StudioClient.DEFAULT_PROGRAM_NAME = "FireflyStudio";
oFF.StudioClient.DEFAULT_LAUNCHPAD_WALLPAPER_URL = "${ff_mimes}/images/studio/background.jpg";
oFF.StudioClient.LAUNCHPAD_VISIBLE_PROGRAM_NAMES_KEY = "studio_launchpadVisibleProgramNames";
oFF.StudioClient.LAUNCHPAD_ICON_POSITION_KEY_PREFIX = "studio_launchpadIconPosition_";
oFF.StudioClient.LAUNCHPAD_WALLPAPER_SRC_KEY = "studio_launchpadWallperSrc";
oFF.StudioClient.LAUNCHPAD_UI_THEME_KEY = "studio_uiTheme";
oFF.StudioClient.STATUS_BAR_EDGE_SPACING = "10px";
oFF.StudioClient.UNISEX_USER_ICON_BASE64 = "data:image/jpeg;base64,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";
oFF.StudioClient.SAP_LOGO_IMAGE = "data:image/gif;base64,R0lGODlhPAAsAPcAAAAAAAuOxQGe3BGk3iGq4DGw40G25VC852DC6XDI64DP7pDV8KDb8rDh9MDn9s/t+N/z++/5/f///wAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAACH5BAEAAP8ALAAAAAA8ACwAAAj/AP8JHEiwoMGDCBMqXMiwocOHECNKnEixosWLGDNq3Mixo8ePICEKGEmypMmTKFOqRBng4MqXMGOabOlSps2bJWnWxMkTps6dCBxIGCohQgMEA0o6WLqUAMmgTJkySOB05U+XAx4Q3Uq0wEgEXBWQVMA1rMqrLrWWJeqAZAOuEMau3Sr2JNqDB7g+cKBWgoGRBNb+FUB2LtGkOR0WHnqA5IAEdQUkWMtg5GIJgPtKaEzyLsLLD6qehLA2guWtJA3Q7QxxMlcHSEsW2PqWKALCqEfmJVrXc8IBEeYyqMpgK3CiDXATFTDggObGvhMKKBC89N/qEh4IKE6UwOXSA6JLmxdAgHvZCK6HJhAAlihkw0MViB8/8nHtrdg3T9/64HvY+fSVRIBm8CG3VVRUASgdAQ4MNpJ5Bc4100XbDQXBUgRGWFZiFwWmoQQXkhaBA6StxRpG7Wm4gEnpcTWSggyRt0CJRD2AQH5eCSghjDGWZMCPiPUkAI89CpkSkUUaOWFHStr1UZMchiTllFRWaeWVWGap5ZZcdullQwEBADs=";
oFF.StudioClient.createRunner = function()
{
	var runner = oFF.KernelBoot.createByName(oFF.StudioClient.DEFAULT_PROGRAM_NAME);
	return runner;
};
oFF.StudioClient.prototype.m_studioApps = null;
oFF.StudioClient.prototype.m_uiRoot = null;
oFF.StudioClient.prototype.m_launchpad = null;
oFF.StudioClient.prototype.m_input = null;
oFF.StudioClient.prototype.m_runButton = null;
oFF.StudioClient.prototype.m_taskBarSection = null;
oFF.StudioClient.prototype.m_userInfoSection = null;
oFF.StudioClient.prototype.m_userlbl = null;
oFF.StudioClient.prototype.m_userPhotoThumbnail = null;
oFF.StudioClient.prototype.m_notificationAreaPopover = null;
oFF.StudioClient.prototype.m_userSettingsDialog = null;
oFF.StudioClient.prototype.m_launchpadVisibleAppIds = null;
oFF.StudioClient.prototype.m_selectedUiTheme = null;
oFF.StudioClient.prototype.m_userProfile = null;
oFF.StudioClient.prototype.newProgram = function()
{
	var studioClient = new oFF.StudioClient();
	studioClient.setup();
	return studioClient;
};
oFF.StudioClient.prototype.doSetupProgramMetadata = function(metadata)
{
	oFF.DfUiProgram.prototype.doSetupProgramMetadata.call( this , metadata);
};
oFF.StudioClient.prototype.evalArguments = function()
{
	oFF.DfUiProgram.prototype.evalArguments.call( this );
};
oFF.StudioClient.prototype.initializeProgram = function()
{
	oFF.DfUiProgram.prototype.initializeProgram.call( this );
	this.initInternal();
};
oFF.StudioClient.prototype.releaseObject = function()
{
	this.m_uiRoot = oFF.XObjectExt.release(this.m_uiRoot);
	this.m_launchpad = oFF.XObjectExt.release(this.m_launchpad);
	this.m_input = oFF.XObjectExt.release(this.m_input);
	this.m_runButton = oFF.XObjectExt.release(this.m_runButton);
	this.m_userSettingsDialog = oFF.XObjectExt.release(this.m_userSettingsDialog);
	this.m_userProfile = oFF.XObjectExt.release(this.m_userProfile);
	this.m_taskBarSection = oFF.XObjectExt.release(this.m_taskBarSection);
	this.m_userInfoSection = oFF.XObjectExt.release(this.m_userInfoSection);
	this.m_userPhotoThumbnail = oFF.XObjectExt.release(this.m_userPhotoThumbnail);
	this.m_userlbl = oFF.XObjectExt.release(this.m_userlbl);
	this.m_notificationAreaPopover = oFF.XObjectExt.release(this.m_notificationAreaPopover);
	this.m_studioApps.clear();
	this.m_studioApps = oFF.XObjectExt.release(this.m_studioApps);
	oFF.DfUiProgram.prototype.releaseObject.call( this );
};
oFF.StudioClient.prototype.getLogSeverity = function()
{
	return oFF.DfUiProgram.prototype.getLogSeverity.call( this );
};
oFF.StudioClient.prototype.getMenuBarDisplayName = function()
{
	return oFF.StudioClient.DEFAULT_PROGRAM_NAME;
};
oFF.StudioClient.prototype.getDefaultProgramDevice = function()
{
	return oFF.ProgramDevice.WINDOW;
};
oFF.StudioClient.prototype.initInternal = function()
{
	this.initApps();
	this.setSystemOption(oFF.ApplicationSystemOption.NONE);
	this.initVisibleLaunchpadApps();
	var kernel = this.getProcess().getKernel();
	kernel.registerOnEvent(this);
};
oFF.StudioClient.prototype.buildUi = function(genesis)
{
	oFF.DfUiProgram.prototype.buildUi.call( this , genesis);
	var headerArea = genesis.newControl(oFF.UiType.FLEX_LAYOUT);
	headerArea.setDirection(oFF.UiFlexDirection.ROW);
	headerArea.setAlignItems(oFF.UiFlexAlignItems.CENTER);
	headerArea.setWrap(oFF.UiFlexWrap.NO_WRAP);
	headerArea.setBackgroundColor(oFF.UiColor.createByRgba(63, 81, 97, 1.0));
	headerArea.addNewItemOfType(oFF.UiType.SPACER).setWidth(oFF.UiCssLength.create(oFF.StudioClient.STATUS_BAR_EDGE_SPACING));
	headerArea.addNewItemOfType(oFF.UiType.IMAGE).setSrc(oFF.StudioClient.SAP_LOGO_IMAGE);
	this.addTopBarSectionSeparator(headerArea);
	this.m_input = headerArea.addNewItemOfType(oFF.UiType.INPUT);
	this.m_input.setWidth(oFF.UiCssLength.create("300px"));
	this.m_input.registerOnEnter(this);
	this.m_runButton = headerArea.addNewItemOfType(oFF.UiType.BUTTON);
	this.m_runButton.setName("runBtn");
	this.m_runButton.setText("Run");
	this.m_runButton.registerOnPress(this);
	this.addTopBarSectionSeparator(headerArea);
	this.m_taskBarSection = headerArea.addNewItemOfType(oFF.UiType.TASK_BAR);
	this.m_taskBarSection.setFlex("1 10000 auto");
	this.addTopBarSectionSeparator(headerArea);
	headerArea.addNewItemOfType(oFF.UiType.BUTTON).setName("javaDocBtn").setIcon("documents").setTooltip("Firefly Javadoc").setButtonType(oFF.UiButtonType.PRIMARY).registerOnPress(this);
	headerArea.addNewItemOfType(oFF.UiType.SPACER).setWidth(oFF.UiCssLength.create("10px"));
	headerArea.addNewItemOfType(oFF.UiType.BUTTON).setName("appStoreBtn").setIcon("widgets").setTooltip("Firefly AppStore").setButtonType(oFF.UiButtonType.PRIMARY).registerOnPress(this);
	headerArea.addNewItemOfType(oFF.UiType.SPACER).setWidth(oFF.UiCssLength.create("10px"));
	headerArea.addNewItemOfType(oFF.UiType.BUTTON).setName("userSettingsBtn").setIcon("settings").setTooltip("User Settings").setButtonType(oFF.UiButtonType.PRIMARY).registerOnPress(this);
	this.m_userInfoSection = headerArea.addNewItemOfType(oFF.UiType.FLEX_LAYOUT);
	this.m_userInfoSection.setDirection(oFF.UiFlexDirection.ROW);
	this.m_userInfoSection.setAlignItems(oFF.UiFlexAlignItems.CENTER);
	this.m_userInfoSection.setWrap(oFF.UiFlexWrap.NO_WRAP);
	this.m_userInfoSection.setVisible(false);
	this.addTopBarSectionSeparator(this.m_userInfoSection);
	this.m_userlbl = this.m_userInfoSection.addNewItemOfType(oFF.UiType.LABEL);
	this.m_userlbl.setText("Loading...");
	this.m_userlbl.setFontColor(oFF.UiColor.WHITE);
	this.m_userInfoSection.addNewItemOfType(oFF.UiType.SPACER).setWidth(oFF.UiCssLength.create("8px"));
	this.m_userPhotoThumbnail = this.m_userInfoSection.addNewItemOfType(oFF.UiType.IMAGE);
	this.m_userPhotoThumbnail.setSrc(oFF.StudioClient.UNISEX_USER_ICON_BASE64);
	this.m_userPhotoThumbnail.setHeight(oFF.UiCssLength.create("28px"));
	this.m_userPhotoThumbnail.setWidth(oFF.UiCssLength.create("28px"));
	this.m_userPhotoThumbnail.setCornerRadius(oFF.UiCssBoxEdges.create("50%"));
	this.m_userPhotoThumbnail.registerOnPress(this);
	this.addTopBarSectionSeparator(headerArea);
	var notificationIcon = headerArea.addNewItemOfType(oFF.UiType.ICON);
	notificationIcon.setName("notificationIcon");
	notificationIcon.setIcon("bell");
	notificationIcon.setFontColor(oFF.UiColor.GREY.newColorWithAlpha(0.85));
	notificationIcon.setFontSize(oFF.UiCssLength.create("20px"));
	notificationIcon.registerOnPress(this);
	this.addTopBarSectionSeparator(headerArea);
	var clockControl = headerArea.addNewItemOfType(oFF.UiType.CLOCK);
	clockControl.setFontColor(oFF.UiColor.WHITE);
	clockControl.setFontSize(oFF.UiCssLength.create("15px"));
	clockControl.registerOnPress(this);
	headerArea.addNewItemOfType(oFF.UiType.SPACER).setWidth(oFF.UiCssLength.create(oFF.StudioClient.STATUS_BAR_EDGE_SPACING));
	this.m_launchpad = genesis.newControl(oFF.UiType.LAUNCHPAD);
	this.m_launchpad.useMaxSpace();
	this.m_launchpad.setHeader(headerArea);
	var wallpaperSrc = this.getApplication().getUserManager().getUserSettings().getStringByKeyExt(oFF.StudioClient.LAUNCHPAD_WALLPAPER_SRC_KEY, oFF.StudioClient.DEFAULT_LAUNCHPAD_WALLPAPER_URL);
	this.applyLaunchpadWallpaper(wallpaperSrc, true);
	var studioAppsIterator = this.getAllAvailableApps().getIterator();
	while (studioAppsIterator.hasNext())
	{
		var studioApp = studioAppsIterator.next();
		if (oFF.XString.containsString(this.m_launchpadVisibleAppIds, studioApp.getProgramName()) === false)
		{
			continue;
		}
		this.addAppToLaunchpad(studioApp);
	}
	genesis.setRoot(this.m_launchpad);
	this.displayUserProfile();
	this.initUiTheme();
};
oFF.StudioClient.prototype.initApps = function()
{
	this.m_studioApps = oFF.XHashMapByString.create();
	var orderedAllEntries = oFF.ProgramRegistration.getOrderedAllEntries();
	for (var i = 0; i < orderedAllEntries.size(); i++)
	{
		var manifest = orderedAllEntries.get(i);
		if (manifest.isAvailableInAppStore())
		{
			var programName = manifest.getProgramName();
			var newApp = oFF.SxStudioApp.createApp(programName);
			this.m_studioApps.put(programName, newApp);
		}
	}
};
oFF.StudioClient.prototype.getAllAvailableApps = function()
{
	if (oFF.isNull(this.m_studioApps))
	{
		this.m_studioApps = oFF.XHashMapByString.create();
	}
	return this.m_studioApps;
};
oFF.StudioClient.prototype.executeProgram = function(startCfg)
{
	var startCfgBase = startCfg;
	startCfgBase.setParentProcess(this.getProcess());
	startCfgBase.setIsNewConsoleNeeded(true);
	startCfgBase.setIsCreatingChildProcess(true);
	startCfgBase.processExecution(oFF.SyncType.NON_BLOCKING, null, null);
};
oFF.StudioClient.prototype.launchApp = function(studioApp, programDevice)
{
	if (oFF.notNull(studioApp))
	{
		var prgCfg = studioApp.getProgramConfig();
		prgCfg.setEnforcedOutputDevice(programDevice);
		this.executeProgram(prgCfg);
	}
};
oFF.StudioClient.prototype.initVisibleLaunchpadApps = function()
{
	this.m_launchpadVisibleAppIds = this.getApplication().getUserManager().getUserSettings().getStringByKeyExt(oFF.StudioClient.LAUNCHPAD_VISIBLE_PROGRAM_NAMES_KEY, "");
	if (oFF.XStringUtils.isNullOrEmpty(this.m_launchpadVisibleAppIds) === true)
	{
		var studioAppsIterator = this.getAllAvailableApps().getIterator();
		while (studioAppsIterator.hasNext())
		{
			var tmpStudioApp = studioAppsIterator.next();
			if (tmpStudioApp.isInitiallyVisibleOnLaunchpad() === true)
			{
				this.m_launchpadVisibleAppIds = oFF.XStringUtils.concatenate3(this.m_launchpadVisibleAppIds, tmpStudioApp.getProgramName(), ",");
			}
		}
		this.getApplication().getUserManager().getUserSettings().putString(oFF.StudioClient.LAUNCHPAD_VISIBLE_PROGRAM_NAMES_KEY, this.m_launchpadVisibleAppIds);
	}
};
oFF.StudioClient.prototype.addAppToLaunchpad = function(studioApp)
{
	if (oFF.notNull(studioApp))
	{
		var newAppIcon = this.m_genesis.newControl(oFF.UiType.APP_ICON);
		newAppIcon.setName(studioApp.getProgramName());
		newAppIcon.setText(studioApp.getDisplayName());
		if (studioApp.getIconImagePath() !== null)
		{
			var iconPath = this.getSession().resolvePath(studioApp.getIconImagePath());
			newAppIcon.setSrc(iconPath);
		}
		newAppIcon.setCustomObject(studioApp);
		newAppIcon.registerOnDoubleClick(this);
		newAppIcon.registerOnContextMenu(this);
		newAppIcon.registerOnMoveEnd(this);
		var positionStorageKey = oFF.XStringUtils.concatenate2(oFF.StudioClient.LAUNCHPAD_ICON_POSITION_KEY_PREFIX, studioApp.getProgramName());
		var positionStr = this.getApplication().getUserManager().getUserSettings().getStringByKeyExt(positionStorageKey, null);
		if (oFF.XStringUtils.isNotNullAndNotEmpty(positionStr))
		{
			var iconPos = oFF.UiPosition.createByString(positionStr);
			newAppIcon.setX(iconPos.getX());
			newAppIcon.setY(iconPos.getY());
		}
		this.m_launchpad.addItem(newAppIcon);
		var appId = studioApp.getProgramName();
		if (oFF.XString.containsString(this.m_launchpadVisibleAppIds, appId) === false)
		{
			this.m_launchpadVisibleAppIds = oFF.XStringUtils.concatenate3(this.m_launchpadVisibleAppIds, appId, ",");
			this.getApplication().getUserManager().getUserSettings().putString(oFF.StudioClient.LAUNCHPAD_VISIBLE_PROGRAM_NAMES_KEY, this.m_launchpadVisibleAppIds);
		}
		studioApp.setAppIcon(newAppIcon);
	}
};
oFF.StudioClient.prototype.removeAppFromLaunchpad = function(studioApp)
{
	if (oFF.notNull(studioApp))
	{
		var appId = studioApp.getProgramName();
		if (oFF.XString.containsString(this.m_launchpadVisibleAppIds, appId) === true)
		{
			this.m_launchpadVisibleAppIds = oFF.XString.replace(this.m_launchpadVisibleAppIds, oFF.XStringUtils.concatenate2(appId, ","), "");
			this.getApplication().getUserManager().getUserSettings().putString(oFF.StudioClient.LAUNCHPAD_VISIBLE_PROGRAM_NAMES_KEY, this.m_launchpadVisibleAppIds);
		}
		if (studioApp.isVisibleOnLaunchpad())
		{
			var iconToRemove = studioApp.getAppIcon();
			if (iconToRemove.getParent() !== null)
			{
				this.m_launchpad.removeItem(iconToRemove);
				studioApp.setAppIcon(null);
			}
		}
	}
};
oFF.StudioClient.prototype.applyLaunchpadWallpaper = function(url, isInitial)
{
	if (oFF.notNull(this.m_launchpad))
	{
		var bgImagePath = this.getSession().resolvePath(url);
		if (oFF.XStringUtils.isNotNullAndNotEmpty(bgImagePath) && oFF.XFile.createByUri(this.getSession(), oFF.XUri.createFromUrl(bgImagePath)) !== null)
		{
			this.m_launchpad.setBackgroundImageSrc(bgImagePath);
			if (isInitial === false)
			{
				this.getApplication().getUserManager().getUserSettings().putString(oFF.StudioClient.LAUNCHPAD_WALLPAPER_SRC_KEY, url);
				this.getGenesis().showSuccessToast("Wallpaper changed!");
			}
		}
		else
		{
			this.getGenesis().showErrorToast("Could not retrieve the specified wallpaper!");
		}
	}
};
oFF.StudioClient.prototype.restoreDefaultLaunchpadApps = function()
{
	var studioAppsIterator = this.getAllAvailableApps().getIterator();
	while (studioAppsIterator.hasNext())
	{
		var tmpStudioApp = studioAppsIterator.next();
		if (tmpStudioApp.isInitiallyVisibleOnLaunchpad() === true)
		{
			if (tmpStudioApp.isVisibleOnLaunchpad() === false)
			{
				this.addAppToLaunchpad(tmpStudioApp);
			}
		}
		else
		{
			if (tmpStudioApp.isVisibleOnLaunchpad() === true)
			{
				this.removeAppFromLaunchpad(tmpStudioApp);
			}
		}
	}
	this.getGenesis().showSuccessToast("Launchpad icons successfully restored to default!");
};
oFF.StudioClient.prototype.restoreLaunchpadIconPositions = function()
{
	var studioAppsIterator = this.getAllAvailableApps().getIterator();
	while (studioAppsIterator.hasNext())
	{
		var studioApp = studioAppsIterator.next();
		this.resetStudioAppIconPosition(studioApp);
	}
	this.getGenesis().showSuccessToast("Launchpad icon positions restored!");
};
oFF.StudioClient.prototype.resetStudioAppIconPosition = function(studioApp)
{
	if (oFF.notNull(studioApp))
	{
		var positionStorageKey = oFF.XStringUtils.concatenate2(oFF.StudioClient.LAUNCHPAD_ICON_POSITION_KEY_PREFIX, studioApp.getName());
		this.getApplication().getUserManager().getUserSettings().removeKey(positionStorageKey);
		var tmpAppIcon = studioApp.getAppIcon();
		if (oFF.notNull(tmpAppIcon))
		{
			tmpAppIcon.setPosition(null);
		}
	}
};
oFF.StudioClient.prototype.addTopBarSectionSeparator = function(layout)
{
	layout.addNewItemOfType(oFF.UiType.SPACER).setWidth(oFF.UiCssLength.create("10px"));
	layout.addNewItemOfType(oFF.UiType.SPACER).setWidth(oFF.UiCssLength.create("1px")).setHeight(oFF.UiCssLength.create("24px")).setBackgroundColor(oFF.UiColor.createByRgba(0, 0, 0, 0.3));
	layout.addNewItemOfType(oFF.UiType.SPACER).setWidth(oFF.UiCssLength.create("10px"));
};
oFF.StudioClient.prototype.openUserSettings = function()
{
	if (oFF.isNull(this.m_userSettingsDialog))
	{
		var wallpaperSrc = this.getApplication().getUserManager().getUserSettings().getStringByKeyExt(oFF.StudioClient.LAUNCHPAD_WALLPAPER_SRC_KEY, oFF.StudioClient.DEFAULT_LAUNCHPAD_WALLPAPER_URL);
		this.m_userSettingsDialog = oFF.SxDlgUserSettings.createUserSettingsDialog(this.m_genesis, wallpaperSrc, this.m_selectedUiTheme, this);
	}
	this.m_userSettingsDialog.openDialog();
};
oFF.StudioClient.prototype.openAppStore = function()
{
	var appStoreDlgManifest = oFF.ProgramRegistration.getProgramManifest(oFF.SxAppStoreDialog.DEFAULT_PROGRAM_NAME);
	var appStoreDlgStartCfg = oFF.ProgramStartCfg.create(this.getProcess(), appStoreDlgManifest.getName(), null, null);
	var tmpArgs = appStoreDlgStartCfg.getArguments();
	tmpArgs.putXObject("studioApps", this.getAllAvailableApps());
	tmpArgs.putXObject("listener", this);
	this.executeProgram(appStoreDlgStartCfg);
};
oFF.StudioClient.prototype.openJavaDoc = function()
{
	var javadocDlgStartCfg = oFF.ProgramStartCfg.create(this.getProcess(), "JavadocDialog", null, null);
	this.executeProgram(javadocDlgStartCfg);
};
oFF.StudioClient.prototype.openUserInfoDialog = function()
{
	var userProfileDlgManifest = oFF.ProgramRegistration.getProgramManifest("UserProfileDialog");
	var userProfileDlgStartCfg = oFF.ProgramStartCfg.create(this.getProcess(), userProfileDlgManifest.getName(), null, null);
	var tmpArgs = userProfileDlgStartCfg.getArguments();
	tmpArgs.putXObject("userProfile", this.m_userProfile);
	this.executeProgram(userProfileDlgStartCfg);
};
oFF.StudioClient.prototype.openCalendarDialog = function()
{
	var calendarDlgStartCfg = oFF.ProgramStartCfg.create(this.getProcess(), "CalendarDialog", null, null);
	this.executeProgram(calendarDlgStartCfg);
};
oFF.StudioClient.prototype.openNotificationArea = function(notifcationIcon)
{
	if (oFF.isNull(this.m_notificationAreaPopover))
	{
		this.m_notificationAreaPopover = this.m_genesis.newControl(oFF.UiType.POPOVER);
		this.m_notificationAreaPopover.setName("studioNotificationArea");
		this.m_notificationAreaPopover.setBackgroundColor(oFF.UiColor.create("#659DBD"));
		this.m_notificationAreaPopover.setPlacement(oFF.UiPlacementType.BOTTOM);
		this.m_notificationAreaPopover.setWidth(oFF.UiCssLength.create("400px"));
		this.m_notificationAreaPopover.setHeight(oFF.UiCssLength.create("50%"));
		this.m_notificationAreaPopover.setPadding(oFF.UiCssBoxEdges.create("5px"));
		this.m_notificationAreaPopover.setMargin(oFF.UiCssBoxEdges.create("5px"));
		var popoverLayout = this.m_notificationAreaPopover.setNewContent(oFF.UiType.FLEX_LAYOUT);
		popoverLayout.useMaxSpace();
		popoverLayout.setAlignContent(oFF.UiFlexAlignContent.CENTER);
		popoverLayout.setJustifyContent(oFF.UiFlexJustifyContent.CENTER);
		var noNewMessagesLbl = popoverLayout.addNewItemOfType(oFF.UiType.LABEL);
		noNewMessagesLbl.setText("No new notifications!");
		noNewMessagesLbl.setFontColor(oFF.UiColor.WHITE);
		noNewMessagesLbl.setFontSize(oFF.UiCssLength.create("17px"));
	}
	if (this.m_notificationAreaPopover.isOpen())
	{
		this.m_notificationAreaPopover.close();
	}
	else
	{
		this.m_notificationAreaPopover.openAt(notifcationIcon);
	}
};
oFF.StudioClient.prototype.createAppIconMenu = function(appIcon)
{
	var tmpStudioApp = appIcon.getCustomObject();
	var contextMenu = this.m_genesis.newControl(oFF.UiType.MENU);
	contextMenu.setName("iconContextMenu");
	if (tmpStudioApp.getProgramManifest().getOutputDevice() !== oFF.ProgramDevice.CONSOLE)
	{
		var openInMenuItem = contextMenu.addNewItem();
		openInMenuItem.setName("openInMenuItem");
		openInMenuItem.setText("Open in...");
		openInMenuItem.setIcon("switch-views");
		var openInWindowSubMenuItem = openInMenuItem.addNewItem();
		openInWindowSubMenuItem.setName("openInWindowSubMenuItem");
		openInWindowSubMenuItem.setText("Window");
		openInWindowSubMenuItem.setIcon("header");
		openInWindowSubMenuItem.registerOnPress(this);
		openInWindowSubMenuItem.setCustomObject(appIcon);
		var openInDialogSubMenuItem = openInMenuItem.addNewItem();
		openInDialogSubMenuItem.setName("openInDialogSubMenuItem");
		openInDialogSubMenuItem.setText("Dialog");
		openInDialogSubMenuItem.setIcon("popup-window");
		openInDialogSubMenuItem.registerOnPress(this);
		openInDialogSubMenuItem.setCustomObject(appIcon);
	}
	var resetIconPosMenuItem = contextMenu.addNewItem();
	resetIconPosMenuItem.setName("resetIconPosMenuItem");
	resetIconPosMenuItem.setText("Reset icon position");
	resetIconPosMenuItem.setIcon("grid");
	resetIconPosMenuItem.setSectionStart(true);
	resetIconPosMenuItem.registerOnPress(this);
	resetIconPosMenuItem.setCustomObject(appIcon);
	var removeIconMenuItem = contextMenu.addNewItem();
	removeIconMenuItem.setName("removeIconMenuItem");
	removeIconMenuItem.setText("Remove from launchpad");
	removeIconMenuItem.setIcon("delete");
	removeIconMenuItem.registerOnPress(this);
	removeIconMenuItem.setCustomObject(appIcon);
	return contextMenu;
};
oFF.StudioClient.prototype.initUiTheme = function()
{
	this.m_selectedUiTheme = this.getApplication().getUserManager().getUserSettings().getStringByKeyExt(oFF.StudioClient.LAUNCHPAD_UI_THEME_KEY, null);
	if (!oFF.XString.isEqual(this.m_selectedUiTheme, "sap_belize"))
	{
		this.setTheme(this.m_selectedUiTheme);
	}
};
oFF.StudioClient.prototype.setTheme = function(themeName)
{
	if (oFF.XStringUtils.isNotNullAndNotEmpty(themeName))
	{
		this.m_selectedUiTheme = themeName;
		this.getUiManager().setTheme(themeName, null);
	}
};
oFF.StudioClient.prototype.addTaskbarElement = function(process)
{
	var newTaskBarBtn = null;
	if (oFF.notNull(process))
	{
		var resolvedIconPath = process.getProgramCfg().getProgramManifest().getResolvedIconPath(this.getSession());
		newTaskBarBtn = this.m_taskBarSection.addNewItem();
		newTaskBarBtn.setText(process.getProgramContainer().getTitle());
		newTaskBarBtn.setTooltip(process.getProgramCfg().getProgramManifest().getDisplayName());
		newTaskBarBtn.setSrc(resolvedIconPath);
	}
	else
	{
		this.getGenesis().showWarningToast("Error! Failed to create taskbar button for launched program!");
	}
	return newTaskBarBtn;
};
oFF.StudioClient.prototype.onPress = function(event)
{
	var pressedItem = event.getControl();
	var pressedParent = pressedItem.getParent();
	var name = pressedItem.getName();
	var parentName = pressedParent.getName();
	if (pressedItem.getUiType() === oFF.UiType.BUTTON)
	{
		if (oFF.XString.isEqual("runBtn", name) || pressedItem === this.m_runButton)
		{
			this.onEnter(null);
		}
		if (oFF.XString.isEqual("userSettingsBtn", name))
		{
			this.openUserSettings();
		}
		if (oFF.XString.isEqual("appStoreBtn", name))
		{
			this.openAppStore();
		}
		if (oFF.XString.isEqual("javaDocBtn", name))
		{
			this.openJavaDoc();
		}
	}
	if (pressedItem.getUiType() === oFF.UiType.IMAGE)
	{
		if (pressedItem === this.m_userPhotoThumbnail)
		{
			this.openUserInfoDialog();
		}
	}
	if (pressedItem.getUiType() === oFF.UiType.MENU_ITEM)
	{
		var tmpIcon = pressedItem.getCustomObject();
		var tmpStudioApp = tmpIcon.getCustomObject();
		if (oFF.XString.isEqual(parentName, "iconContextMenu"))
		{
			switch (name)
			{
				case "removeIconMenuItem":
					this.removeAppFromLaunchpad(tmpStudioApp);
					break;

				case "resetIconPosMenuItem":
					this.resetStudioAppIconPosition(tmpStudioApp);
					break;

				default:
			}
		}
		else if (oFF.XString.isEqual(parentName, "openInMenuItem"))
		{
			switch (name)
			{
				case "openInWindowSubMenuItem":
					this.launchApp(tmpStudioApp, oFF.ProgramDevice.WINDOW);
					break;

				case "openInDialogSubMenuItem":
					this.launchApp(tmpStudioApp, oFF.ProgramDevice.DIALOG);
					break;

				default:
			}
		}
	}
	if (pressedItem.getUiType() === oFF.UiType.CLOCK)
	{
		this.openCalendarDialog();
	}
	if (pressedItem.getUiType() === oFF.UiType.ICON)
	{
		if (oFF.XString.isEqual("notificationIcon", name))
		{
			this.openNotificationArea(pressedItem);
		}
	}
};
oFF.StudioClient.prototype.onDoubleClick = function(event)
{
	var dblClickedItem = event.getControl();
	if (dblClickedItem.getUiType() === oFF.UiType.APP_ICON)
	{
		var studioApp = dblClickedItem.getCustomObject();
		this.launchApp(studioApp, null);
	}
};
oFF.StudioClient.prototype.onEnter = function(event)
{
	var text = this.m_input.getText();
	var startCfg = oFF.ProgramStartCfg.createByCmdLine(this.getSession(), text);
	if (oFF.notNull(startCfg))
	{
		this.executeProgram(startCfg);
	}
};
oFF.StudioClient.prototype.onContextMenu = function(event)
{
	var control = event.getControl();
	var posX = event.getParameters().getIntegerByKeyExt(oFF.UiControlEvent.PARAM_CLICK_X, 0);
	var posY = event.getParameters().getIntegerByKeyExt(oFF.UiControlEvent.PARAM_CLICK_Y, 0);
	var contextMenu = null;
	if (control.getUiType() === oFF.UiType.APP_ICON)
	{
		contextMenu = this.createAppIconMenu(control);
	}
	if (oFF.notNull(contextMenu))
	{
		contextMenu.openAtPosition(posX, posY);
	}
};
oFF.StudioClient.prototype.onMoveEnd = function(event)
{
	var control = event.getControl();
	if (control.getUiType() === oFF.UiType.APP_ICON)
	{
		var appName = control.getName();
		var positionStorageKey = oFF.XStringUtils.concatenate2(oFF.StudioClient.LAUNCHPAD_ICON_POSITION_KEY_PREFIX, appName);
		var positionStr = oFF.XStringUtils.concatenate4(oFF.XInteger.convertToString(event.getOffsetX()), "px, ", oFF.XInteger.convertToString(event.getOffsetY()), "px");
		this.getApplication().getUserManager().getUserSettings().putString(positionStorageKey, positionStr);
	}
};
oFF.StudioClient.prototype.displayUserProfile = function()
{
	var userProfile = this.getProcess().getSubSystem(oFF.SubSystemType.USER_PROFILE);
	if (oFF.notNull(userProfile))
	{
		this.m_userProfile = userProfile;
		var userName = oFF.XStringUtils.concatenate3(this.m_userProfile.getLastName(), ", ", this.m_userProfile.getFirstName());
		this.m_userlbl.setText(userName);
		var thumbnailPhoto = this.m_userProfile.getThumbnailPhotoEncoded();
		if (oFF.XStringUtils.isNotNullAndNotEmpty(thumbnailPhoto))
		{
			this.m_userPhotoThumbnail.setSrc(thumbnailPhoto);
		}
		this.m_userInfoSection.setVisible(true);
	}
	else
	{
		this.log("User info could not be retrieved!");
	}
};
oFF.StudioClient.prototype.onApplyWallpaperPressed = function(newLanuchpadWallpaperSrc)
{
	if (oFF.XStringUtils.isNotNullAndNotEmpty(newLanuchpadWallpaperSrc))
	{
		this.applyLaunchpadWallpaper(newLanuchpadWallpaperSrc, false);
	}
};
oFF.StudioClient.prototype.onRestoreWallpaperPressed = function()
{
	this.applyLaunchpadWallpaper(oFF.StudioClient.DEFAULT_LAUNCHPAD_WALLPAPER_URL, false);
	this.m_userSettingsDialog.setLaunchpadWallpaperSrc(oFF.StudioClient.DEFAULT_LAUNCHPAD_WALLPAPER_URL);
};
oFF.StudioClient.prototype.onRestoreLaunchpadIconsPressed = function()
{
	this.restoreDefaultLaunchpadApps();
};
oFF.StudioClient.prototype.onRestoreIconPositionsPressed = function()
{
	this.restoreLaunchpadIconPositions();
};
oFF.StudioClient.prototype.onThemeChanged = function(themeName)
{
	this.setTheme(themeName);
	this.getApplication().getUserManager().getUserSettings().putString(oFF.StudioClient.LAUNCHPAD_UI_THEME_KEY, themeName);
};
oFF.StudioClient.prototype.onAddAppToLaunchpadPressed = function(studioApp)
{
	if (oFF.notNull(studioApp))
	{
		this.addAppToLaunchpad(studioApp);
	}
};
oFF.StudioClient.prototype.onProcessEvent = function(event, process, eventType)
{
	if (eventType === oFF.ProcessEventType.PROGRAM_STARTED && process.isWindowBasedUiProgram())
	{
		var prgContainer = process.getProgramCfg().getProgramContainer();
		if (oFF.notNull(prgContainer) && !prgContainer.isModalContainer())
		{
			var newTaskBarBtn = this.addTaskbarElement(process);
			if (oFF.notNull(newTaskBarBtn))
			{
				var windowContainer = prgContainer;
				windowContainer.setTaskBarButton(newTaskBarBtn);
			}
		}
	}
};

oFF.StudioModule = function() {};
oFF.StudioModule.prototype = new oFF.DfModule();
oFF.StudioModule.prototype._ff_c = "StudioModule";

oFF.StudioModule.s_module = null;
oFF.StudioModule.getInstance = function()
{
	if (oFF.isNull(oFF.StudioModule.s_module))
	{
		oFF.DfModule.checkInitialized(oFF.UiProgramModule.getInstance());
		oFF.StudioModule.s_module = oFF.DfModule.startExt(new oFF.StudioModule());
		oFF.RegistrationService.getInstance();
		oFF.ProgramRegistration.setProgramFactory(oFF.StudioClient.DEFAULT_PROGRAM_NAME, new oFF.StudioClient());
		oFF.ProgramRegistration.setProgramFactory(oFF.SxAppStoreDialog.DEFAULT_PROGRAM_NAME, new oFF.SxAppStoreDialog());
		oFF.DfModule.stopExt(oFF.StudioModule.s_module);
	}
	return oFF.StudioModule.s_module;
};
oFF.StudioModule.prototype.getName = function()
{
	return "ff8100.studio";
};

oFF.StudioModule.getInstance();

return sap.firefly;
	} );