// Copyright (c) 2009-2020 SAP SE, All Rights Reserved
sap.ui.define(["sap/ui/core/Core","sap/ui/core/library","sap/m/library"],function(C,c,m){"use strict";sap.ui.getCore().initLibrary({name:"sap.ushell",version:"1.96.0",dependencies:["sap.ui.core","sap.m"],types:["sap.ushell.AllMyAppsState","sap.ushell.AppTitleState","sap.ushell.ContentNodeType","sap.ushell.components.container.ApplicationType","sap.ushell.DisplayFormat","sap.ushell.NavigationState","sap.ushell.ui.launchpad.ViewPortState","sap.ushell.ui.tile.State","sap.ushell.ui.tile.StateArrow","sap.ushell.UI5ComponentType","sap.ushell.VisualizationLoadState","sap.ushell.AppType"],interfaces:[],controls:["sap.ushell.components.container.ApplicationContainer","sap.ushell.components.factsheet.controls.PictureTile","sap.ushell.components.factsheet.controls.PictureViewer","sap.ushell.components.factsheet.controls.PictureViewerItem","sap.ushell.components.shell.Settings.userDefaults.UserDefaultsForm","sap.ushell.components.tiles.sbtilecontent","sap.ushell.renderers.fiori2.search.controls.CustomSearchResultListItem","sap.ushell.renderers.fiori2.search.controls.CustomSearchResultListItemContent","sap.ushell.renderers.fiori2.search.controls.DivContainer","sap.ushell.renderers.fiori2.search.controls.SearchAdvancedCondition","sap.ushell.renderers.fiori2.search.controls.SearchButton","sap.ushell.renderers.fiori2.search.controls.SearchFacet","sap.ushell.renderers.fiori2.search.controls.SearchFacetBarChart","sap.ushell.renderers.fiori2.search.controls.SearchFacetDialog","sap.ushell.renderers.fiori2.search.controls.SearchFacetFilter","sap.ushell.renderers.fiori2.search.controls.SearchFacetItem","sap.ushell.renderers.fiori2.search.controls.SearchFacetPieChart","sap.ushell.renderers.fiori2.search.controls.SearchFacetTabBar","sap.ushell.renderers.fiori2.search.controls.SearchFieldGroup","sap.ushell.renderers.fiori2.search.controls.SearchFilterBar","sap.ushell.renderers.fiori2.search.controls.SearchInput","sap.ushell.renderers.fiori2.search.controls.SearchLabel","sap.ushell.renderers.fiori2.search.controls.SearchLayout","sap.ushell.renderers.fiori2.search.controls.SearchLink","sap.ushell.renderers.fiori2.search.controls.SearchMultiSelectionControl","sap.ushell.renderers.fiori2.search.controls.SearchNoResultScreen","sap.ushell.renderers.fiori2.search.controls.SearchObjectSuggestionImage","sap.ushell.renderers.fiori2.search.controls.SearchRelatedObjectsToolbar","sap.ushell.renderers.fiori2.search.controls.SearchResultGrid","sap.ushell.renderers.fiori2.search.controls.SearchResultList","sap.ushell.renderers.fiori2.search.controls.SearchResultListContainer","sap.ushell.renderers.fiori2.search.controls.SearchResultListItem","sap.ushell.renderers.fiori2.search.controls.SearchResultListItemDocument","sap.ushell.renderers.fiori2.search.controls.SearchResultListItemNote","sap.ushell.renderers.fiori2.search.controls.SearchResultMap","sap.ushell.renderers.fiori2.search.controls.SearchResultTable","sap.ushell.renderers.fiori2.search.controls.SearchSelect","sap.ushell.renderers.fiori2.search.controls.SearchText","sap.ushell.renderers.fiori2.search.controls.SearchTilesContainer","sap.ushell.renderers.fiori2.search.controls.twitter.SearchTweet","sap.ushell.renderers.fiori2.search.inputhelp.SearchInputHelp","sap.ushell.renderers.fiori2.search.inputhelp.SearchInputHelpDialog","sap.ushell.renderers.fiori2.search.inputhelp.SearchInputHelpPage","sap.ushell.renderers.fiori2.search.inputhelp.SearchInputHelpWizard","sap.ushell.ui.launchpad.VizInstance","sap.ushell.ui.launchpad.VizInstanceAbap","sap.ushell.ui.launchpad.VizInstanceCdm","sap.ushell.ui.launchpad.VizInstanceLaunchPage","sap.ushell.ui.launchpad.VizInstanceLink","sap.ushell.ui.AppContainer","sap.ushell.ui.ContentNodeSelector","sap.ushell.ui.bookmark.ContentNodeTreeItem","sap.ushell.ui.CustomGroupHeaderListItem","sap.ushell.ui.ShellHeader","sap.ushell.ui.appfinder.AppBox","sap.ushell.ui.appfinder.PinButton","sap.ushell.ui.footerbar.AboutButton","sap.ushell.ui.footerbar.AddBookmarkButton","sap.ushell.ui.footerbar.ContactSupportButton","sap.ushell.ui.footerbar.JamDiscussButton","sap.ushell.ui.footerbar.JamShareButton","sap.ushell.ui.footerbar.LogoutButton","sap.ushell.ui.footerbar.SendAsEmailButton","sap.ushell.ui.footerbar.SettingsButton","sap.ushell.ui.footerbar.UserPreferencesButton","sap.ushell.ui.launchpad.ActionItem","sap.ushell.ui.launchpad.AnchorItem","sap.ushell.ui.launchpad.AnchorNavigationBar","sap.ushell.ui.launchpad.CatalogEntryContainer","sap.ushell.ui.launchpad.CatalogsContainer","sap.ushell.ui.launchpad.DashboardGroupsContainer","sap.ushell.ui.launchpad.GridContainer","sap.ushell.ui.launchpad.GroupHeaderActions","sap.ushell.ui.launchpad.GroupListItem","sap.ushell.ui.launchpad.LinkTileWrapper","sap.ushell.ui.launchpad.LoadingDialog","sap.ushell.ui.launchpad.Page","sap.ushell.ui.launchpad.Panel","sap.ushell.ui.launchpad.PlusTile","sap.ushell.ui.launchpad.Section","sap.ushell.ui.launchpad.Tile","sap.ushell.ui.launchpad.TileContainer","sap.ushell.ui.launchpad.TileState","sap.ushell.ui.launchpad.section.CompactArea","sap.ushell.ui.shell.FloatingContainer","sap.ushell.ui.shell.NavigationMiniTile","sap.ushell.ui.shell.OverflowListItem","sap.ushell.ui.shell.RightFloatingContainer","sap.ushell.ui.shell.ShellAppTitle","sap.ushell.ui.shell.ShellFloatingAction","sap.ushell.ui.shell.ShellFloatingActions","sap.ushell.ui.shell.ShellHeadItem","sap.ushell.ui.shell.ShellLayout","sap.ushell.ui.shell.ShellNavigationMenu","sap.ushell.ui.shell.ToolArea","sap.ushell.ui.shell.ToolAreaItem","sap.ushell.ui.tile.DynamicTile","sap.ushell.ui.tile.ImageTile","sap.ushell.ui.tile.StaticTile","sap.ushell.ui.tile.TileBase"],elements:["sap.ushell.ui.launchpad.AccessibilityCustomData"],extensions:{"sap.ui.support":{diagnosticPlugins:["sap/ushell/support/plugins/flpConfig/FlpConfigurationPlugin"]}}});var u=sap.ushell;u.AllMyAppsState={FirstLevel:"FirstLevel",SecondLevel:"SecondLevel",Details:"Details",FirstLevelSpread:"FirstLevelSpread"};u.AppTitleState={ShellNavMenuOnly:"ShellNavMenuOnly",AllMyAppsOnly:"AllMyAppsOnly",ShellNavMenu:"ShellNavMenu",AllMyApps:"AllMyApps"};u.UI5ComponentType={Application:"Application",Plugin:"Plugin",Visualization:"Visualization"};u.ContentNodeType={HomepageGroup:"HomepageGroup",Space:"Space",Page:"Page"};u.components.container.ApplicationType={NWBC:"NWBC",SAPUI5:"SAPUI5",TR:"TR",URL:"URL",WCF:"WCF",WDA:"WDA"};u.DisplayFormat={Standard:"standard",Compact:"compact",Flat:"flat",FlatWide:"flatWide",StandardWide:"standardWide"};u.NavigationState={InProgress:"InProgress",Finished:"Finished"};u.ui.launchpad.ViewPortState={Left:"Left",Center:"Center",Right:"Right",LeftCenter:"LeftCenter",CenterLeft:"CenterLeft",RightCenter:"RightCenter",CenterRight:"CenterRight"};u.ui.tile.State={Neutral:"Neutral",None:"None",Negative:"Negative",Error:"Error",Positive:"Positive",Success:"Success",Critical:"Critical",Warning:"Warning"};u.ui.tile.StateArrow={None:"None",Up:"Up",Down:"Down"};u.VisualizationLoadState={Loading:"Loading",Loaded:"Loaded",InsufficientRoles:"InsufficientRoles",OutOfRoleContext:"OutOfRoleContext",NoNavTarget:"NoNavTarget",Failed:"Failed",Disabled:"Disabled"};u.AppType={OVP:"OVP",SEARCH:"Search",FACTSHEET:"FactSheet",COPILOT:"Co-Pilot",URL:"External Link",APP:"Application"};return u;});
