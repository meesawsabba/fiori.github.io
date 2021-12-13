/*!
 * SAPUI5

		(c) Copyright 2009-2021 SAP SE. All rights reserved
	
 */
(function(g){"use strict";sap.ui.define(["sap/esh/search/ui/controls/SearchResultListSelectionHandler","sap/base/Log"],function(D,L){var a=D.getMetadata().getName();var u={esDevConfig:{type:"object",},multiSelect:{type:"bool",},sinaProvider:{type:"string",},odataProvider:{type:"bool",},searchBusinessObjects:{type:"bool",},charts:{type:"bool",},maps:{type:"bool",},mapProdiver:{type:"object",},newpie:{type:"bool",},personalizationStorage:{type:"string",},boSuggestions:{type:"bool",},_tweetAttribute:{type:"string",},_eshClickableObjectType:{type:"bool",},defaultSearchScopeApps:{type:"bool",},searchScopeWithoutAll:{type:"bool",},suggestionKeyboardRelaxationTime:{type:"int",},suggestionStartingCharacters:{type:"int",},hideListView:{type:"bool",},gridView:{type:"bool",},defaultResultViewType:{type:"string",},enableMultiSelectionResultItems:{type:"bool",},updateUrl:{type:"bool",},renderUrl:{type:"function",},isSearchUrl:{type:"function",},beforeNavigation:{type:"function",},getCustomToolbar:{type:"function",},quickSelectDataSources:{type:"object",},initAsync:{type:"function",},layoutUseResponsiveSplitter:{type:"bool",},facetPanelWidthInPercent:{type:"int",},FF_facetPanelUnifiedHeaderStyling:{type:"bool",},searchFilterBarShowWithFacets:{type:"bool",},searchBarDoNotHideForNoResults:{type:"bool",},pageSize:{type:"int",},FF_layoutWithoutPage:{type:"bool",},titleColumnName:{type:"string",},titleColumnWidth:{type:"string",},extendTableColumn:{type:"object",},searchInAttibuteFacetPostion:{type:"object",},cleanUpSpaceFilters:{type:"function",},setSearchInLabelIconBindings:{type:"function",},getSearchInFacetListMode:{type:"function",},checkAndSetSpaceIcon:{type:"function",},hasSpaceFiltersOnly:{type:"function",},showSpaceFacetInShowMoreDialog:{type:"function",},getSpaceFacetId:{type:"function",},bNoAppSearch:{type:"bool",},bResetSearchTermOnQuickSelectDataSourceItemPress:{type:"bool",},FF_bSearchtermNoAsterisk:{type:"bool",},bPlaceHolderFixedValue:{type:"bool",},FF_bOptimizedQuickSelectDataSourceLabels:{type:"bool",},selectionChange:{type:"function",},metaDataJsonType:{type:"bool",},facetVisibility:{type:"bool",},defaultDataSource:{type:"string",},displayNoResultsPageBackButton:{type:"bool",},displayNoResultsPageSearchAllButton:{type:"bool",},displayFacetPanelInCaseOfNoResults:{type:"bool",},browserTitleOverwritten:{type:"bool",},isUshell:{type:"bool",},userDefinedDatasources:{type:"bool",},};var S=function(){this.init.apply(this,arguments);};S.prototype={init:function(c){if(c&&Object.keys(c).length>0&&!c.isUshell){jQuery.extend(this,c);}else{this.readUshellConfiguration();this.readOutdatedUshellConfiguration();}if(c&&c.isUshell){this.isUshell=true;}else{this.isUshell=false;}this.setDefaults();this.updateConfigFromUrlParameters();this.setModulePaths();this.createDefaultDataSourceConfig();},setModulePaths:function(){if(!this.modulePaths){return;}for(var i=0;i<this.modulePaths.length;++i){var m=this.modulePaths[i];var b=m.urlPrefix.replace("${host}",window.location.protocol+"//"+window.location.host);jQuery.sap.registerModulePath(m.moduleName,b);}},readUshellConfiguration:function(){try{var c=g["sap-ushell-config"].renderers.fiori2.componentData.config.esearch;jQuery.extend(true,this,c);}catch(e){}},readOutdatedUshellConfiguration:function(){try{var c=g["sap-ushell-config"].renderers.fiori2.componentData.config;if(typeof c.searchBusinessObjects!=="undefined"&&typeof this.searchBusinessObjects==="undefined"){if(c.searchBusinessObjects==="hidden"||c.searchBusinessObjects===false){this.searchBusinessObjects=false;}else{this.searchBusinessObjects=true;}}if(typeof c.enableSearch!=="undefined"&&typeof this.enableSearch==="undefined"){this.enableSearch=c.enableSearch;}}catch(e){}},setDefaults:function(){if(typeof this.searchBusinessObjects==="undefined"){this.searchBusinessObjects=true;}if(typeof this.odataProvider==="undefined"){this.odataProvider=false;}if(typeof this.multiSelect==="undefined"){this.multiSelect=true;}if(typeof this.charts==="undefined"){this.charts=true;}if(typeof this.maps==="undefined"){this.maps=undefined;}if(typeof this.mapProvider==="undefined"){this.mapProvider=undefined;}if(typeof this.newpie==="undefined"){this.newpie=false;}if(typeof this.dataSources==="undefined"){this.dataSources={};}if(typeof this.enableSearch==="undefined"){this.enableSearch=true;}if(typeof this.personalizationStorage==="undefined"){this.personalizationStorage="auto";}if(typeof this.boSuggestions==="undefined"){this.boSuggestions=false;}if(typeof this._eshClickableObjectType==="undefined"){this._eshClickableObjectType=true;}if(typeof this.defaultSearchScopeApps==="undefined"){this.defaultSearchScopeApps=false;}if(typeof this.searchScopeWithoutAll==="undefined"){this.searchScopeWithoutAll=false;}if(typeof this.suggestionKeyboardRelaxationTime==="undefined"){this.suggestionKeyboardRelaxationTime=400;}if(typeof this.suggestionStartingCharacters==="undefined"){this.suggestionStartingCharacters=3;}if(typeof this.hideListView==="undefined"){this.hideListView=false;}if(typeof this.defaultResultViewType==="undefined"){this.defaultResultViewType=undefined;}if(typeof this.gridView==="undefined"){this.gridView=false;}if(typeof this.enableMultiSelectionResultItems==="undefined"){this.enableMultiSelectionResultItems=false;}if(typeof this.updateUrl==="undefined"){this.updateUrl=true;}if(typeof this.renderUrl==="undefined"){this.renderUrl=this.renderUrl;}if(typeof this.isSearchUrl==="undefined"){this.isSearchUrl=this.isSearchUrl;}if(typeof this.beforeNavigation==="undefined"){this.beforeNavigation=this.beforeNavigation;}if(typeof this.getCustomToolbar==="undefined"){this.getCustomToolbar=this.getCustomToolbar;}if(typeof this.getCustomNoResultScreen==="undefined"){this.getCustomNoResultScreen=function(){return;};}if(typeof this.quickSelectDataSources==="undefined"){this.quickSelectDataSources=[];}if(typeof this.initAsync==="undefined"){this.initAsync=this.initAsync;}if(typeof this.pageSize==="undefined"){this.pageSize=10;}if(typeof this.layoutUseResponsiveSplitter==="undefined"){this.layoutUseResponsiveSplitter=false;}if(typeof this.facetPanelWidthInPercent==="undefined"){this.facetPanelWidthInPercent=25;}if(typeof this.FF_facetPanelUnifiedHeaderStyling==="undefined"){this.FF_facetPanelUnifiedHeaderStyling=false;}if(typeof this.searchFilterBarShowWithFacets==="undefined"){this.searchFilterBarShowWithFacets=false;}if(typeof this.searchBarDoNotHideForNoResults==="undefined"){this.searchBarDoNotHideForNoResults=false;}if(typeof this.FF_layoutWithoutPage==="undefined"){this.FF_layoutWithoutPage=false;}if(typeof this.searchInAttibuteFacetPostion==="undefined"){this.searchInAttibuteFacetPostion={};}if(typeof this.cleanUpSpaceFilters==="undefined"){this.cleanUpSpaceFilters=this.cleanUpSpaceFilters;}if(typeof this.setSearchInLabelIconBindings==="undefined"){this.setSearchInLabelIconBindings=this.setSearchInLabelIconBindings;}if(typeof this.getSearchInFacetListMode==="undefined"){this.getSearchInFacetListMode=this.getSearchInFacetListMode;}if(typeof this.checkAndSetSpaceIcon==="undefined"){this.checkAndSetSpaceIcon=this.checkAndSetSpaceIcon;}if(typeof this.hasSpaceFiltersOnly==="undefined"){this.hasSpaceFiltersOnly=this.hasSpaceFiltersOnly;}if(typeof this.showSpaceFacetInShowMoreDialog==="undefined"){this.showSpaceFacetInShowMoreDialog=this.showSpaceFacetInShowMoreDialog;}if(typeof this.getSpaceFacetId==="undefined"){this.getSpaceFacetId=this.getSpaceFacetId;}if(typeof this.bNoAppSearch==="undefined"){this.bNoAppSearch=false;}if(typeof this.bResetSearchTermOnQuickSelectDataSourceItemPress==="undefined"){this.bResetSearchTermOnQuickSelectDataSourceItemPress=false;}if(typeof this.FF_bSearchtermNoAsterisk==="undefined"){this.FF_bSearchtermNoAsterisk=false;}if(typeof this.bPlaceHolderFixedValue==="undefined"){this.bPlaceHolderFixedValue=false;}if(typeof this.FF_bOptimizedQuickSelectDataSourceLabels==="undefined"){this.FF_bOptimizedQuickSelectDataSourceLabels=false;}if(typeof this.selectionChange==="undefined"){this.selectionChange=function(){};}if(typeof this.metaDataJsonType==="undefined"){this.metaDataJsonType=false;}if(typeof this.facetVisibility==="undefined"){this.facetVisibility=undefined;}if(typeof this.defaultDataSource==="undefined"){this.defaultDataSource=undefined;}if(typeof this.displayNoResultsPageBackButton==="undefined"){this.displayNoResultsPageBackButton=false;}if(typeof this.displayNoResultsPageSearchAllButton==="undefined"){this.displayNoResultsPageSearchAllButton=false;}if(typeof this.displayFacetPanelInCaseOfNoResults==="undefined"){this.displayFacetPanelInCaseOfNoResults=false;}if(typeof this.browserTitleOverwritten==="undefined"){this.browserTitleOverwritten=true;}if(typeof this.userDefinedDatasources==="undefined"){this.userDefinedDatasources=true;}this.dataSourceConfigurations={};this.dataSourceConfigurations_Regexes=[];if(this.dataSources){for(var i=0;i<this.dataSources.length;i++){var d=this.dataSources[i];if(d.id){this.dataSourceConfigurations[d.id]=d;}else if(d.regex){var f=d.regexFlags||undefined;var r=new RegExp(d.regex,f);if(r){d.regex=r;this.dataSourceConfigurations_Regexes.push(d);}}else{var m="Following datasource configuration does neither include a valid id nor a regular expression, therefore it is ignored:\n"+JSON.stringify(d);L.warning(m,"sap.esh.search.ui.SearchConfiguration");}}}this.dataSources=undefined;this.documentDataSource={searchResultListItem:"sap.esh.search.ui.controls.SearchResultListItemDocument",};this.dataSourceConfigurations.noteprocessorurl=this.dataSourceConfigurations.noteprocessorurl||{};this.dataSourceConfigurations.noteprocessorurl.searchResultListItem=this.dataSourceConfigurations.noteprocessorurl.searchResultListItem||"sap.esh.search.ui.controls.SearchResultListItemNote";this.dataSourceConfigurations.noteprocessorurl.searchResultListSelectionHandler=this.dataSourceConfigurations.noteprocessorurl.searchResultListSelectionHandler||"sap.esh.search.ui.controls.SearchResultListSelectionHandlerNote";},createDefaultDataSourceConfig:function(){this.defaultDataSourceConfig={searchResultListItem:undefined,searchResultListItemControl:undefined,searchResultListItemContent:undefined,searchResultListItemContentControl:undefined,searchResultListSelectionHandler:a,searchResultListSelectionHandlerControl:D,};},updateConfigFromUrlParameters:function(){var p=this.parseUrlParameters();for(var b in p){if(b==="demoMode"){this.searchBusinessObjects=true;this.enableSearch=true;continue;}var c=u[b];if(!c){continue;}var v=p[b];if(b==="esDevConfig"){var d=JSON.parse(v);Object.assign(this,d);continue;}switch(c.type){case"bool":v=v==="true"||v==="";break;default:}this[b]=v;}},parseUrlParameters:function(){if(!URLSearchParams){return{};}var b=new URLSearchParams(window.location.search);return Object.fromEntries(b.entries());},parseSearchUrlParameters:function(s){return s;},loadCustomModulesAsync:function(){var t=this;if(t._loadCustomModulesProm){return t._loadCustomModulesProm;}var d,b=[];for(var c in t.dataSourceConfigurations){d=t.loadCustomModulesForDataSourceIdAsync(c);b.push(d);}t._loadCustomModulesProm=Promise.all(b);return t._loadCustomModulesProm;},loadCustomModulesForDataSourcesAsync:function(d,b){var c=[];for(var i=0;i<d.length;i++){var e=(Array.isArray(b)&&b.length>i&&b[i])||{};var f=this.loadCustomModulesForDataSourceAsync(d[i],e);c.push(f);}return Promise.all(c);},loadCustomModulesForDataSourceAsync:function(d,b){b=b||{};return this.loadCustomModulesForDataSourceIdAsync(d.id,b);},loadCustomModulesForDataSourceIdAsync:function(d,b){if(!d){return Promise.resolve();}this._dataSourceLoadingProms=this._dataSourceLoadingProms||{};var c=this._dataSourceLoadingProms[d];if(!c){var e=[{moduleAttrName:"searchResultListItem",controlAttrName:"searchResultListItemControl",},{moduleAttrName:"searchResultListItemContent",controlAttrName:"searchResultListItemContentControl",},{moduleAttrName:"searchResultListSelectionHandler",controlAttrName:"searchResultListSelectionHandlerControl",},];var f=this._prepareDataSourceConfigurationForDataSource(d,b);var h,j=[];for(var i=0;i<e.length;i++){h=this._doLoadCustomModulesAsync(d,f,e[i].moduleAttrName,e[i].controlAttrName);j.push(h);}c=Promise.all(j);c._resolvedOrFailed=false;c.then(function(){c._resolvedOrFailed=true;});this._dataSourceLoadingProms[d]=c;}return c;},_doLoadCustomModulesAsync:function(d,b,m,c,f,h){var t=this;return new Promise(function(r){if(b[m]&&(!b[c]||b[c]==t.defaultDataSourceConfig[c])){try{sap.ui.require([b[m].replace(/[.]/g,"/")],function(j){b[c]=j;r();});}catch(e){var i="Could not load custom module '"+b[m]+"' for data source with id '"+d+"'. ";i+="Falling back to default data source configuration.";L.warning(i,"sap.esh.search.ui.SearchConfiguration");b[m]=f||t.defaultDataSourceConfig[m];b[c]=h||t.defaultDataSourceConfig[c];r();}}else{if(!b[c]){b[m]=f||t.defaultDataSourceConfig[m];b[c]=h||t.defaultDataSourceConfig[c];}r();}});},getDataSourceConfig:function(d){if(this._dataSourceLoadingProms&&this._dataSourceLoadingProms[d.id]&&!this._dataSourceLoadingProms[d.id]._resolvedOrFailed){return this.defaultDataSourceConfig;}var c=this.dataSourceConfigurations[d.id];if(!c){c=this.defaultDataSourceConfig;this.dataSourceConfigurations[d.id]=c;}return c;},_prepareDataSourceConfigurationForDataSource:function(d,b){var c={};if(this.dataSourceConfigurations[d]){c=this.dataSourceConfigurations[d];}else{for(var i=0;i<this.dataSourceConfigurations_Regexes.length;i++){if(this.dataSourceConfigurations_Regexes[i].regex.test(d)){c=this.dataSourceConfigurations_Regexes[i];break;}}}if(b&&b.isDocumentConnector){if(!c.searchResultListItem){c.searchResultListItem=this.documentDataSource.searchResultListItem;}else{var m="Will attempt to load '"+c.searchResultListItem+"' instead of '"+this.documentDataSource.searchResultListItem+"' for data source '"+d+"'";L.warning(m,"sap.esh.search.ui.SearchConfiguration");}}this.dataSourceConfigurations[d]=c;return c;},getSina:function(){return{};},renderSearchUrl:function(p){return"#Action-search&/top="+p.top+"&filter="+p.filter;},isSearchUrl:function(b){return b.indexOf("#Action-search")===0;},getCustomToolbar:function(){return[];},initAsync:function(){return;},beforeNavigation:function(){return;},};S.create=function(c){return new S(c);};return S;});})(window);
