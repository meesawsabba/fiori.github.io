/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)
        (c) Copyright 2009-2021 SAP SE. All rights reserved
    
 */

sap.ui.define(
	[
		"sap/fe/core/PageController",
		"sap/fe/core/controllerextensions/SideEffects",
		"sap/fe/core/controllerextensions/EditFlow",
		"sap/base/Log",
		"sap/base/util/ObjectPath",
		"sap/fe/core/CommonUtils",
		"sap/ui/mdc/p13n/StateUtil",
		"sap/fe/macros/table/Utils",
		"sap/fe/core/controllerextensions/InternalRouting",
		"sap/ui/Device",
		"sap/fe/core/controllerextensions/IntentBasedNavigation",
		"./overrides/IntentBasedNavigation",
		"sap/fe/core/controllerextensions/InternalIntentBasedNavigation",
		"sap/fe/macros/chart/ChartRuntime",
		"sap/fe/templates/ListReport/ExtensionAPI",
		"sap/fe/macros/filter/FilterUtils",
		"sap/fe/macros/chart/ChartUtils",
		"sap/fe/macros/DelegateUtil",
		"sap/ui/core/mvc/OverrideExecution",
		"sap/fe/core/controllerextensions/ViewState",
		"./overrides/ViewState",
		"sap/fe/templates/RootContainer/overrides/EditFlow",
		"sap/fe/core/helpers/EditState",
		"sap/fe/core/library",
		"sap/fe/core/controllerextensions/Share",
		"./overrides/Share",
		"sap/fe/macros/CommonHelper",
		"sap/fe/core/controllerextensions/KPIManagement",
		"sap/fe/templates/TableScroller",
		"sap/fe/core/controllerextensions/Placeholder"
	],
	function(
		PageController,
		SideEffects,
		EditFlow,
		Log,
		ObjectPath,
		CommonUtils,
		StateUtil,
		TableUtils,
		InternalRouting,
		Device,
		IntentBasedNavigation,
		IntentBasedNavigationOverride,
		InternalIntentBasedNavigation,
		ChartRuntime,
		ExtensionAPI,
		FilterUtils,
		ChartUtils,
		DelegateUtil,
		OverrideExecution,
		ViewState,
		ViewStateOverrides,
		EditFlowOverrides,
		EditState,
		CoreLibrary,
		Share,
		ShareOverrides,
		CommonHelper,
		KPIManagement,
		TableScroller,
		Placeholder
	) {
		"use strict";
		var TemplateContentView = CoreLibrary.TemplateContentView,
			InitialLoadMode = CoreLibrary.InitialLoadMode;

		return PageController.extend("sap.fe.templates.ListReport.ListReportController", {
			metadata: {
				methods: {
					getExtensionAPI: {
						"public": true,
						"final": true
					},
					onPageReady: {
						"public": false,
						"final": false,
						overrideExecution: OverrideExecution.After
					},
					onViewNeedsRefresh: {
						"public": true,
						"final": false,
						overrideExecution: OverrideExecution.After
					},
					onPendingFilters: {
						"public": true,
						"final": false,
						overrideExecution: OverrideExecution.After
					}
				}
			},
			_routing: InternalRouting.override({
				onAfterBinding: function(oContext, mParameters) {
					this.getView()
						.getController()
						._onAfterBinding(oContext, mParameters);
				}
			}),
			_intentBasedNavigation: InternalIntentBasedNavigation.override({
				getEntitySet: function() {
					return this.base.getCurrentEntitySet();
				}
			}),
			sideEffects: SideEffects,

			intentBasedNavigation: IntentBasedNavigation.override(IntentBasedNavigationOverride),
			share: Share.override(ShareOverrides),
			editFlow: EditFlow.override(EditFlowOverrides),
			viewState: ViewState.override(ViewStateOverrides),
			kpiManagement: KPIManagement,
			placeholder: Placeholder,

			getExtensionAPI: function() {
				if (!this.extensionAPI) {
					this.extensionAPI = new ExtensionAPI(this);
				}
				return this.extensionAPI;
			},

			onInit: function() {
				PageController.prototype.onInit.apply(this);
				var that = this;
				var aControls = this._getControls();
				var oInternalModelContext = this.getView().getBindingContext("internal");
				if (that._isMultiMode()) {
					var oMultiModeTab = that._getMultiModeControl();
					oInternalModelContext.setProperty("tabs", {
						selected: oMultiModeTab.getSelectedKey() || oMultiModeTab.getItems()[0].getKey()
					});
					aControls.forEach(function(oControl) {
						var oUpdateCounts = function() {
							that._updateCounts();
						};
						CommonUtils.addEventToBindingInfo(oControl, "dataRequested", oUpdateCounts);
					});
				}

				oInternalModelContext.setProperty("hasPendingFilters", true);
				oInternalModelContext.setProperty("appliedFilters", "");
				oInternalModelContext.setProperty("hideDraftInfo", false);
				oInternalModelContext.setProperty("uom", {});
				oInternalModelContext.setProperty("scalefactor", {});
				oInternalModelContext.setProperty("scalefactorNumber", {});
				oInternalModelContext.setProperty("currency", {});

				if (this._hasMultiVisualizations()) {
					var alpContentView = this._getDefaultPath();
					if (!Device.system.desktop && alpContentView === TemplateContentView.Hybrid) {
						alpContentView = TemplateContentView.Chart;
					}
					oInternalModelContext.setProperty("alpContentView", alpContentView);
				}

				// Store conditions from filter bar
				// this is later used before navigation to get conditions applied on the filter bar
				this.filterBarConditions = {};

				// As AppStateHandler.applyAppState triggers a navigation we want to make sure it will
				// happen after the routeMatch event has been processed (otherwise the router gets broken)
				this.getAppComponent()
					.getRouterProxy()
					.waitForRouteMatchBeforeNavigation();

				this._isMultiMode() && this._updateMultiControlHiddenStatus();

				FilterUtils.attachConditionHandling(this._getFilterBarControl());
			},
			onExit: function() {
				FilterUtils.detachConditionHandling(this._getFilterBarControl());

				delete this._sEntitySet;
				delete this.filterBarConditions;
				delete this._oListReportControl;
				delete this._bMultiMode;
				this.extensionAPI && this.extensionAPI.destroy();
				delete this.extensionAPI;
			},

			_onAfterBinding: function() {
				var aTables = this._getControls("table");
				var that = this;
				if (EditState.isEditStateDirty()) {
					var oTableBinding = this._getTableBinding();
					if (oTableBinding) {
						if (!this.sUpdateTimer) {
							this.sUpdateTimer = setTimeout(function() {
								oTableBinding.refresh();
								delete that.sUpdateTimer;
							}, 0);
						}

						// Update action enablement and visibility upon table data update.
						var fnUpdateTableActions = function() {
							that._updateTableActions(aTables);
							oTableBinding.detachDataReceived(fnUpdateTableActions);
						};
						oTableBinding.attachDataReceived(fnUpdateTableActions);
					}
					EditState.setEditStateProcessed();
				}

				if (!this.sUpdateTimer) {
					this._updateTableActions(aTables);
				}

				this.pageReady.waitFor(
					this.getAppComponent()
						.getAppStateHandler()
						.applyAppState()
				);
			},

			onBeforeRendering: function() {
				PageController.prototype.onBeforeRendering.apply(this);
			},

			onAfterRendering: function(oEvent) {
				var that = this;
				this.getView()
					.getModel("sap.fe.i18n")
					.getResourceBundle()
					.then(function(response) {
						that.oResourceBundle = response;
						var aControls = that._getControls();
						var sEntitySet = that.getView().getViewData().entitySet;
						var sText = CommonUtils.getTranslatedText(
							"T_OP_TABLE_AND_CHART_NO_DATA_TEXT",
							that.oResourceBundle,
							undefined,
							sEntitySet
						);
						aControls.forEach(function(oControl) {
							oControl.setNoDataText(sText);
						});
					})
					.catch(function(oError) {
						Log.error("Error while retrieving the resource bundle", oError);
					});
			},
			onPageReady: function(mParameters) {
				var oLastFocusedControl = mParameters.lastFocusedControl;
				var oView = this.getView();
				// set the focus to the first action button, or to the first editable input if in editable mode
				if (oLastFocusedControl && oLastFocusedControl.controlId && oLastFocusedControl.focusInfo) {
					var oFocusControl = oView.byId(oLastFocusedControl.controlId);
					if (oFocusControl) {
						oFocusControl.applyFocusInfo(oLastFocusedControl.focusInfo);
					}
				}

				// Enabling mandatory filter fields message dialog and focusing on them
				var oFilterBar = this._getFilterBarControl();
				if (oFilterBar && !oFilterBar.getShowMessages()) {
					oFilterBar.setShowMessages(true);
					oFilterBar.setFocusOnFirstErroneousField();
				}
			},

			/**
			 * Method called when the content of a list report view needs to be refreshed.
			 * This happens either when there is a change on the FilterBar and the search is triggered,
			 * or when a tab with custom content is selected.
			 * This method can be overwritten by the controller extension in case of customization.
			 *
			 * @param {map} mParameters Map containing the filter conditions of the FilterBar, the currentTabID
			 * and the view refresh cause (tabChanged or search).
			 * The map looks like this:
			 * <code><pre>
			 * 	{
			 * 		filterConditions: {
			 * 			Country: [
			 * 				{
			 * 					operator: "EQ"
			 *					validated: "NotValidated"
			 *					values: ["Germany", ...]
			 * 				},
			 * 				...
			 * 			]
			 * 			...
			 * 		},
			 *		currentTabId: "fe::CustomTab::tab1",
			 *		refreshCause: "tabChanged" | "search"
			 *	}
			 * </pre></code>
			 *
			 * @public
			 */
			onViewNeedsRefresh: function(mParameters) {},

			/**
			 * Method called when a filter or search value has been changed in the FilterBar,
			 * but has not been validated yet by the end user (with the 'Go' or 'Search' button).
			 * Typically, the content of the current tab is greyed out until the filters are validated.
			 * This method can be overwritten by the controller extension in case of customization.
			 *
			 * @public
			 */
			onPendingFilters: function() {},
			getCurrentEntitySet: function() {
				if (!this._sEntitySet) {
					var oDisplayedControl = (this._isMultiMode() && this._getCurrentControl()) || this._getTable();
					this._sEntitySet = oDisplayedControl.data("targetCollectionPath").slice(1);
				}
				return this._sEntitySet;
			},

			/**
			 * This method initiates the update of the enabled state of the DataFieldForAction and the visible state of the DataFieldForIBN buttons.
			 * @param aTables Array of tables in the list report
			 * @private
			 */
			_updateTableActions: function(aTables) {
				var aIBNActions = [];
				aTables.forEach(function(oTable) {
					aIBNActions = CommonUtils.getIBNActions(oTable, aIBNActions);
					// Update 'enabled' property of DataFieldForAction buttons on table toolbar
					// The same is also performed on Table selectionChange event
					var oInternalModelContext = oTable.getBindingContext("internal"),
						oActionOperationAvailableMap = JSON.parse(
							CommonHelper.parseCustomData(DelegateUtil.getCustomData(oTable, "operationAvailableMap"))
						),
						aSelectedContexts = oTable.getSelectedContexts();

					CommonUtils.setActionEnablement(oInternalModelContext, oActionOperationAvailableMap, aSelectedContexts);
				});
				CommonUtils.updateDataFieldForIBNButtonsVisibility(aIBNActions, this.getView());
			},

			/**
			 * This method scrolls to a specific row on all the available tables.
			 *
			 * @function
			 * @name sap.fe.templates.ListReport.ListReportController.controller#_scrollTablesToRow
			 * @param {string} sRowPath The path of the table row context to be scrolled to
			 */
			_scrollTablesToRow: function(sRowPath) {
				this._getControls("table").forEach(function(oTable) {
					TableScroller.scrollTableToRow(oTable, sRowPath);
				});
			},
			_getPageTitleInformation: function() {
				var that = this;
				return new Promise(function(resolve, reject) {
					var oTitleInfo = { title: "", subtitle: "", intent: "", icon: "" };
					oTitleInfo.title = that
						.getView()
						.getContent()[0]
						.data().ListReportTitle;
					oTitleInfo.subtitle = that
						.getView()
						.getContent()[0]
						.data().ListReportSubtitle;
					resolve(oTitleInfo);
				});
			},
			_getFilterBarControl: function() {
				return this.getView().byId(this._getFilterBarControlId());
			},
			_getSegmentedButton: function(sControl) {
				return this.getView().byId(this._getSegmentedButtonId(sControl));
			},
			_getSegmentedButtonId: function(sControl) {
				if (sControl === "Chart") {
					return this._getChart().data("segmentedButtonId");
				} else {
					return this._getTable().data("segmentedButtonId");
				}
			},
			_getFilterBarControlId: function() {
				return this.getView()
					.getContent()[0]
					.data("filterBarId");
			},
			_getChartControlId: function() {
				return this.getView()
					.getContent()[0]
					.data("singleChartId");
			},

			getChartControl: function() {
				return this.getView().byId(this._getChartControlId());
			},
			_getVisualFilterBarControl: function() {
				return this.getView().byId(this._getVisualFilterBarControlId());
			},
			_getVisualFilterBarControlId: function() {
				return this.getView()
					.getContent()[0]
					.data("visualFilterBarId");
			},
			_getMultiModeControl: function() {
				return this.getView().byId("fe::TabMultipleMode");
			},
			_getTableControlId: function() {
				return this.getView()
					.getContent()[0]
					.data("singleTableId");
			},
			_getCurrentControl: function() {
				if (!this._oListReportControl) {
					var oMultiModeTab = this._getMultiModeControl();
					this._oListReportControl = this.getView().byId(oMultiModeTab.getSelectedKey() || oMultiModeTab.getItems()[0].getKey());
				}
				return this._oListReportControl;
			},
			_getTable: function() {
				if (this._isMultiMode()) {
					var oControl = this._getCurrentControl();
					return oControl && oControl.isA("sap.ui.mdc.Table") ? oControl : undefined;
				}
				return this.getView().byId(this._getTableControlId());
			},
			_getChart: function() {
				return this.getView().byId(this._getChartControlId());
			},
			_getTableBinding: function(sTableId) {
				var oTableControl = sTableId ? this.getView().byId(sTableId) : this._getTable(),
					oBinding = oTableControl && oTableControl._getRowBinding();

				return oBinding;
			},
			_getControls: function(sKey) {
				var that = this;
				if (this._isMultiMode()) {
					var aControls = [];
					var oTabMultiMode = this._getMultiModeControl();
					oTabMultiMode.getItems().forEach(function(oItem) {
						var oControl = that.getView().byId(oItem.getKey());
						if (sKey) {
							if (oItem.getKey().indexOf("fe::" + sKey) > -1) {
								oControl && aControls.push(oControl);
							}
						} else {
							oControl && aControls.push(oControl);
						}
					});
					return aControls;
				}
				return sKey === "Chart" ? [this._getChart()] : [this._getTable()];
			},
			_getDefaultPath: function() {
				var defaultPath = this.getView()
					.getContent()[0]
					.data("defaultPath");
				switch (defaultPath) {
					case "primary":
						return TemplateContentView.Chart;
					case "secondary":
						return TemplateContentView.Table;
					case "both":
					default:
						return TemplateContentView.Hybrid;
				}
			},
			/**
			 * Method to know if ListReport is configured with Multiple Table mode.
			 *
			 * @function
			 * @name _isMultiMode
			 * @returns {boolean} Is Multiple Table mode set?
			 */
			_isMultiMode: function() {
				if (!this._oListReportControl) {
					this._bMultiMode = !!this._getMultiModeControl();
				}
				return this._bMultiMode;
			},
			/**
			 * Method to know if ListReport is configured with Multiple EntitySets.
			 *
			 * @function
			 * @name _isMultiEntitySets
			 * @returns {boolean} Is Multiple EntitySets configuration?
			 */
			_isMultiEntitySets: function() {
				return (
					this.getView()
						.getContent()[0]
						.data("isMultiEntitySets") === "true"
				);
			},
			_hasMultiVisualizations: function() {
				return (
					this.getView()
						.getContent()[0]
						.data("hasMultiVisualizations") === "true"
				);
			},
			_setShareModel: function() {
				// TODO: deactivated for now - currently there is no _templPriv anymore, to be discussed
				// this method is currently not called anymore from the init method

				var fnGetUser = ObjectPath.get("sap.ushell.Container.getUser");
				//var oManifest = this.getOwnerComponent().getAppComponent().getMetadata().getManifestEntry("sap.ui");
				//var sBookmarkIcon = (oManifest && oManifest.icons && oManifest.icons.icon) || "";

				//shareModel: Holds all the sharing relevant information and info used in XML view
				var oShareInfo = {
					bookmarkTitle: document.title, //To name the bookmark according to the app title.
					bookmarkCustomUrl: function() {
						var sHash = window.hasher.getHash();
						return sHash ? "#" + sHash : window.location.href;
					},
					/*
						To be activated once the FLP shows the count - see comment above
						bookmarkServiceUrl: function() {
							//var oTable = oTable.getInnerTable(); oTable is already the sap.fe table (but not the inner one)
							// we should use table.getListBindingInfo instead of the binding
							var oBinding = oTable.getBinding("rows") || oTable.getBinding("items");
							return oBinding ? fnGetDownloadUrl(oBinding) : "";
						},*/
					isShareInJamActive: !!fnGetUser && fnGetUser().isJamActive()
				};

				var oTemplatePrivateModel = this.getOwnerComponent().getModel("_templPriv");
				oTemplatePrivateModel.setProperty("/listReport/share", oShareInfo);
			},

			/**
			 * Hidden tables must be marked as hidden to avoid sending
			 * requests when FilterBar is changed or LR is initialized
			 * Best workflow would be to suspend table binding but
			 * if the user switch quickly between tabs the batch response of previous
			 * is recevied when previous tab is already disabled (binding is suspended) and
			 * generates error.
			 * A temporary solution (if we find better workflow) is to set a customData and don't trigger
			 * rebindTable if this customData is set to true.
			 */
			_updateMultiControlHiddenStatus: function() {
				var oDisplayedControl = this._getCurrentControl();
				if (this._isMultiMode() && oDisplayedControl) {
					var sDisplayControlId = oDisplayedControl.getId();
					var aControls = this._getControls();
					aControls.forEach(function(oControl) {
						var sControlId = oControl.getId();
						oControl.data("controlHidden", sControlId !== sDisplayControlId);
					});
				}
			},
			/**
			 * Method to update the local UI model of the page with the fields that are not applicable to the filter bar (this is specific to the multiple table scenario).
			 *
			 * @param {sap.ui.model.context} oInternalModelContext The internal model context
			 * @param {sap.ui.mdc.FilterBar} oFilterBar MDC filter bar
			 */
			_updateMultiNotApplicableFields: function(oInternalModelContext, oFilterBar) {
				var mCache = {};
				var ignoredFields = {},
					aTables = this._getControls("table"),
					aCharts = this._getControls("Chart");
				aTables.forEach(function(oTable) {
					var sTableEntityPath = oTable.data("targetCollectionPath"),
						sTableEntitySet = sTableEntityPath.slice(1),
						sTabId = oTable
							.getParent()
							.getParent()
							.getKey(),
						sCacheKey = sTableEntitySet + (oTable.data("enableAnalytics") === "true" ? "Analytical" : "Regular");
					if (!mCache[sCacheKey]) {
						mCache[sCacheKey] = FilterUtils.getNotApplicableFilters(oFilterBar, oTable);
					}
					ignoredFields[sTabId] = mCache[sCacheKey];
				});
				aCharts.forEach(function(oChart) {
					var sChartEntityPath = oChart.data("targetCollectionPath"),
						sChartEntitySet = sChartEntityPath.slice(1),
						sTabId = oChart
							.getParent()
							.getParent()
							.getKey(),
						sCacheKey = sChartEntitySet + "Chart";
					if (!mCache[sCacheKey]) {
						mCache[sCacheKey] = FilterUtils.getNotApplicableFilters(oFilterBar, oChart);
					}
					ignoredFields[sTabId] = mCache[sCacheKey];
				});
				oInternalModelContext.setProperty("tabs/ignoredFields", ignoredFields);
			},
			_updateMultiModeSelectedControl: function() {
				this._sEntitySet = undefined;
				this._oListReportControl = undefined;
				this._getCurrentControl();
			},
			_updateCounts: function() {
				this._updateMutliModeCounts();
			},
			/**
			 * Method to determine if a tab from the list report is a custom tab..
			 *
			 * @function
			 * @name _isCustomTab
			 * @returns {boolean} Determines if the tab is a custom tab.
			 */
			_isCustomTab: function() {
				var oMultiModeControl = this._getMultiModeControl();
				return oMultiModeControl && oMultiModeControl.getSelectedKey().indexOf("::CustomTab::") > -1;
			},
			_updateMutliModeCounts: function() {
				var that = this;
				var aBindingPromises = [];
				var oMultiModeControl = this._getMultiModeControl();
				if (oMultiModeControl && oMultiModeControl.data("showCounts") === "true" && !this._isCustomTab()) {
					var oDisplayedControl = this._getCurrentControl();
					var sDisplayedControlId = oDisplayedControl.getId();
					var aCompliantTabs = [];
					var aItems = oMultiModeControl.getItems();
					aItems.forEach(function(oItem) {
						var oControl = that.getView().byId(oItem.getKey());
						if (
							oControl &&
							!oControl.isA("sap.ui.mdc.ChartNew") &&
							(oItem.data("outdatedCounts") || oControl.getId() === sDisplayedControlId)
						) {
							aCompliantTabs.push({
								control: oControl,
								item: oItem
							});
						}
					});

					aBindingPromises = aCompliantTabs.map(function(mTab) {
						mTab.item.setCount("...");
						var oControl = mTab.control;
						var oFilterInfos = TableUtils.getFiltersInfoForSV(oControl, mTab.item.data("selectionVariant"));
						return TableUtils.getListBindingForCount(oControl, that.getView().getBindingContext(), {
							batchGroupId: oControl.getId() === sDisplayedControlId ? oControl.data("batchGroupId") : "$auto",
							additionalFilters: oFilterInfos.filters
						});
					});

					Promise.all(aBindingPromises)
						.then(function(aCounts) {
							for (var k in aCounts) {
								var oItem = aCompliantTabs[k].item;
								oItem.setCount(TableUtils.getCountFormatted(aCounts[k]));
								oItem.data("outdatedCounts", false);
							}
						})
						.catch(function(oError) {
							Log.error("Error while retrieving the values for the icon tab bar", oError);
						});
				}
			},
			_shouldAutoTriggerSearch: function(oVM) {
				if (
					this.getView().getViewData().initialLoad === InitialLoadMode.Auto &&
					(!oVM || oVM.getStandardVariantKey() === oVM.getCurrentVariantKey())
				) {
					var oFilterBar = this._getFilterBarControl(),
						oConditions = oFilterBar.getConditions();
					for (var sKey in oConditions) {
						// ignore filters starting with $ (e.g. $search, $editState)
						if (!sKey.startsWith("$") && Array.isArray(oConditions[sKey]) && oConditions[sKey].length) {
							return true;
						}
					}
				}

				return false;
			},
			_updateTable: function(oTable) {
				if (!oTable.isTableBound() || this.hasPendingChartChanges) {
					oTable.rebindTable();
					this.hasPendingChartChanges = false;
				}
			},
			_updateChart: function(oChart) {
				var oInnerChart = oChart.getControlDelegate()._getChart(oChart);
				if (!(oInnerChart && oInnerChart.isBound("data")) || this.hasPendingTableChanges) {
					oChart.getControlDelegate().rebindChart(oChart, oInnerChart.getBindingInfo("data"));
					this.hasPendingTableChanges = false;
				}
			},
			handlers: {
				onTabMultiModeChange: function(oEvent) {
					this._updateMultiModeSelectedControl();
					this._updateMultiControlHiddenStatus();
					var oFilterBar = this._getFilterBarControl();
					var oInternalModelContext = this.getView().getBindingContext("internal");
					var oDisplayedControl = this._getCurrentControl();
					var oMultiModeControl = this._getMultiModeControl();
					oInternalModelContext.setProperty("tabs/selected", oMultiModeControl.getSelectedKey());
					if (oFilterBar && oInternalModelContext.getProperty("hasPendingFilters") !== true) {
						// No pending filters into FilterBar
						if (this._isCustomTab()) {
							var oFilterConditions = oFilterBar.getFilterConditions();
							this.onViewNeedsRefresh({
								filterConditions: oFilterConditions,
								currentTabId: oMultiModeControl.getSelectedKey(),
								refreshCause: "tabChanged"
							});
						} else if (
							!oDisplayedControl.isA("sap.ui.mdc.ChartNew") &&
							(!oDisplayedControl.getRowBinding() || // first time the tab/table is displayed
								oDisplayedControl.data("outdatedRows") === true)
						) {
							// Search has been triggered on a different tab {}
							oDisplayedControl.rebindTable();
							oDisplayedControl.data("outdatedRows", false);
						} else if (
							oDisplayedControl.isA("sap.ui.mdc.ChartNew") &&
							(!oDisplayedControl
								.getControlDelegate()
								._getChart(oDisplayedControl)
								.getBinding("data") || // first time the tab/chart is displayed
								oDisplayedControl.data("outdatedRows") === true)
						) {
							var oInnerChart = oDisplayedControl.getControlDelegate()._getChart(oDisplayedControl);
							oDisplayedControl.getControlDelegate().rebindChart(oDisplayedControl, oInnerChart.getBindingInfo("data"));
							oDisplayedControl.data("outdatedRows", false);
						}
					}
					this.getExtensionAPI().updateAppState();
				},
				onFiltersChanged: function(oEvent) {
					var oFilterBar = this._getFilterBarControl(),
						oInternalModelContext = this.getView().getBindingContext("internal");
					// Pending filters into FilterBar to be used for custom views
					this.onPendingFilters();
					var bHideDraft = FilterUtils.getEditStateIsHideDraft(oFilterBar.getConditions());
					oInternalModelContext.setProperty("appliedFilters", oFilterBar.getAssignedFiltersText().filtersText);
					oInternalModelContext.setProperty("hasPendingFilters", true);
					oInternalModelContext.setProperty("hideDraftInfo", bHideDraft);
					if (oEvent.getParameter("conditionsBased")) {
						this.getExtensionAPI().updateAppState();
					}
				},
				onVariantSelected: function(oEvent) {
					var that = this,
						oVM = oEvent.getSource();
					// setTimeout cause the variant needs to be applied before judging the auto search or updating the app state
					setTimeout(function() {
						if (that._shouldAutoTriggerSearch(oVM)) {
							// the app state will be updated via onSearch handler
							return that._getFilterBarControl().triggerSearch();
						} else {
							that.getExtensionAPI().updateAppState();
						}
					}, 0);
				},
				onVariantSaved: function(oEvent) {
					var that = this;
					//TODO: Should remove this setTimeOut once Variant Management provides an api to fetch the current variant key on save!!!
					setTimeout(function() {
						that.getExtensionAPI().updateAppState();
					}, 1000);
				},
				onSearch: function(oEvent) {
					var that = this;
					var oFilterBar = this._getFilterBarControl();
					var oInternalModelContext = this.getView().getBindingContext("internal");
					var oMdcChart = this.getChartControl();
					oInternalModelContext.setProperty("hasPendingFilters", false);
					if (this._isMultiMode()) {
						var aControls = this._getControls(),
							oMultiModeControl = this._getMultiModeControl();
						if (oMultiModeControl && oMultiModeControl.data("showCounts") === "true") {
							var aItems = oMultiModeControl.getItems();
							aItems.forEach(function(oItem) {
								if (!oItem.getKey().indexOf("fe::Chart") > -1) {
									oItem.data("outdatedCounts", true);
								}
							});
						}
						if (!this._isCustomTab()) {
							var sDisplayedControlId = this._getCurrentControl().getId();
							this._updateMultiNotApplicableFields(oInternalModelContext, oFilterBar);
							aControls.forEach(function(oControl) {
								oControl.data("outdatedRows", oControl.getId() !== sDisplayedControlId);
							});
						} else {
							var oFilterConditions = oFilterBar.getFilterConditions();
							this.onViewNeedsRefresh({
								filterConditions: oFilterConditions,
								currentTabId: oMultiModeControl.getSelectedKey(),
								refreshCause: "search"
							});
						}
					}
					if (oMdcChart) {
						// disable bound actions TODO: this clears everything for the chart?
						oMdcChart.getBindingContext("internal").setProperty("", {});

						var oPageInternalModelContext = oMdcChart.getBindingContext("pageInternal");
						var sTemplateContentView = oPageInternalModelContext.getProperty(
							oPageInternalModelContext.getPath() + "/alpContentView"
						);
						if (sTemplateContentView === TemplateContentView.Chart) {
							this.hasPendingChartChanges = true;
						}
						if (sTemplateContentView === TemplateContentView.Table) {
							this.hasPendingTableChanges = true;
						}
					}
					// store filter bar conditions to use later while navigation
					StateUtil.retrieveExternalState(oFilterBar)
						.then(function(oExternalState) {
							that.filterBarConditions = oExternalState.filter;
						})
						.catch(function(oError) {
							Log.error("Error while retrieving the external state", oError);
						});
					if (this.getView().getViewData().liveMode === false) {
						this.getExtensionAPI().updateAppState();
					}
				},
				/**
				 * Triggers an outbound navigation when a user chooses the chevron.
				 *
				 * @param {object} oController
				 * @param {string} sOutboundTarget Name of the outbound target (needs to be defined in the manifest)
				 * @param {sap.ui.model.odata.v4.Context} oContext The context that contain the data for the target app
				 * @param {string} sCreatePath Create path when the chevron is created.
				 * @returns {Promise} Promise which is resolved once the navigation is triggered
				 * @ui5-restricted
				 * @final
				 */
				onChevronPressNavigateOutBound: function(oController, sOutboundTarget, oContext, sCreatePath) {
					return oController._intentBasedNavigation.onChevronPressNavigateOutBound(
						oController,
						sOutboundTarget,
						oContext,
						sCreatePath
					);
				},
				onChartSelectionChanged: function(oEvent) {
					var oMdcChart = oEvent.getSource().getContent(),
						oTable = this._getTable(),
						aData = oEvent.getParameter("data"),
						oInternalModelContext = this.getView().getBindingContext("internal");
					if (aData) {
						// update action buttons enablement / disablement
						ChartRuntime.fnUpdateChart(oEvent);
						// update selections on selection or deselection
						ChartUtils.setChartFilters(oMdcChart);
					}
					var sTemplateContentView = oInternalModelContext.getProperty(oInternalModelContext.getPath() + "/alpContentView");
					if (sTemplateContentView === TemplateContentView.Chart) {
						this.hasPendingChartChanges = true;
					} else {
						oTable && oTable.rebindTable();
						this.hasPendingChartChanges = false;
					}
				},
				onSegmentedButtonPressed: function(oEvent) {
					var sSelectedKey = oEvent.mParameters.key ? oEvent.mParameters.key : null;
					var oInternalModelContext = this.getView().getBindingContext("internal");
					oInternalModelContext.setProperty("alpContentView", sSelectedKey);
					var oSegmentedButton;
					var oChart = this._getChart();
					var oTable = this._getTable();
					var oSegmentedButtonDelegate = {
						onAfterRendering: function() {
							var aItems = oSegmentedButton.getItems();
							aItems.forEach(function(oItem) {
								if (oItem.getKey() === sSelectedKey) {
									oItem.focus();
								}
							});
							oSegmentedButton.removeEventDelegate(oSegmentedButtonDelegate);
						}
					};
					oSegmentedButton =
						sSelectedKey === TemplateContentView.Table ? this._getSegmentedButton("Table") : this._getSegmentedButton("Chart");
					if (oSegmentedButton !== oEvent.getSource()) {
						oSegmentedButton.addEventDelegate(oSegmentedButtonDelegate);
					}
					switch (sSelectedKey) {
						case TemplateContentView.Table:
							this._updateTable(oTable);
							break;
						case TemplateContentView.Chart:
							this._updateChart(oChart);
							break;
						case TemplateContentView.Hybrid:
							this._updateTable(oTable);
							this._updateChart(oChart);
							break;
						default:
							break;
					}
					this.getExtensionAPI().updateAppState();
				},
				onFiltersSegmentedButtonPressed: function(oEvent) {
					if (oEvent.getParameter("key") === "Compact") {
						this._getFilterBarControl().setVisible(true);
						this.getView()
							.byId(
								this.getView()
									.getContent()[0]
									.data("visualFilterBarId")
							)
							.setVisible(false);
					} else {
						this._getFilterBarControl().setVisible(false);
						this.getView()
							.byId(
								this.getView()
									.getContent()[0]
									.data("visualFilterBarId")
							)
							.setVisible(true);
					}
				}
			},
			formatters: {
				isDraftIndicatorVisible: function(
					sPropertyPath,
					sSemanticKeyHasDraftIndicator,
					HasDraftEntity,
					IsActiveEntity,
					hideDraftInfo
				) {
					if (
						IsActiveEntity !== undefined &&
						HasDraftEntity !== undefined &&
						(!IsActiveEntity || HasDraftEntity) &&
						!hideDraftInfo
					) {
						return sPropertyPath === sSemanticKeyHasDraftIndicator;
					} else {
						return false;
					}
				},
				/**
				 * Method to set the message text for the multi-EntitySet scenario when fields in the FilterBar need to be ignored.
				 *
				 * @param {Array} aIgnoredFields Array of ignored fields in the FilterBar for the current tab (multi EntitySet scenario)
				 * @param {string} sTabTitle Tab title
				 * @returns {string} Message text
				 */
				setTabMessageStrip: function(aIgnoredFields, sTabTitle) {
					var sText = "";
					if (Array.isArray(aIgnoredFields) && aIgnoredFields.length > 0 && sTabTitle) {
						var oFilterBar = this._getFilterBarControl(),
							sFilterBarEntityPath = oFilterBar.data("entityType"),
							oMetaModel = this.getView()
								.getModel()
								.getMetaModel(),
							oResourceBundle = sap.ui.getCore().getLibraryResourceBundle("sap.fe.templates"),
							aIgnoredLabels = aIgnoredFields.map(function(sProperty) {
								if (sProperty === "$search") {
									var oMacroResourceBundle = sap.ui.getCore().getLibraryResourceBundle("sap.fe.macros");
									return oMacroResourceBundle ? oMacroResourceBundle.getText("M_FILTERBAR_SEARCH") : "";
								}
								var sLabel = oMetaModel.getObject(
									sFilterBarEntityPath + sProperty + "@com.sap.vocabularies.Common.v1.Label"
								);
								return DelegateUtil.getLocalizedText(sLabel, oFilterBar);
							});
						if (oResourceBundle) {
							var sResource =
									"C_LR_MULTITABLES_" +
									(aIgnoredLabels.length === 1 ? "SINGLE" : "MULTI") +
									"_IGNORED_FILTER_" +
									(Device.system.desktop ? "LARGE" : "SMALL"),
								sLocalizedTableTitle = DelegateUtil.getLocalizedText(sTabTitle, oFilterBar);
							sText = oResourceBundle.getText(sResource, [aIgnoredLabels.join(", "), sLocalizedTableTitle]);
						}
					}
					return sText;
				}
			}
		});
	}
);
