sap.ui.define([
	"sap/ui/base/Object",
	"sap/ui/core/mvc/ControllerExtension",
	"sap/ui/generic/app/navigation/service/NavError",
	"sap/suite/ui/generic/template/listTemplates/listUtils",
	"sap/ui/generic/app/navigation/service/SelectionVariant",
	"sap/ui/comp/state/UIState",
	"sap/suite/ui/generic/template/genericUtilities/FeLogger",
	"sap/base/util/deepEqual",
	"sap/base/util/extend",
	"sap/base/util/isEmptyObject",
	"sap/suite/ui/generic/template/genericUtilities/FeError",
	"sap/ui/Device",
	"sap/suite/ui/generic/template/listTemplates/semanticDateRangeTypeHelper",
	"sap/suite/ui/generic/template/ListReport/controller/LegacyStateHandler",
	"sap/suite/ui/generic/template/genericUtilities/testableHelper",
	"sap/suite/ui/generic/template/js/StableIdHelper"
], function(BaseObject, ControllerExtension, NavError, listUtils, SelectionVariant, UIState, FeLogger, deepEqual, extend,
	isEmptyObject, FeError, Device, semanticDateRangeTypeHelper, LegacyStateHandler, testableHelper, StableIdHelper) {
	"use strict";

	var	sClassName = "ListReport.controller.IappStateHandler";
	var oFeLogger = new FeLogger(sClassName);
	var oLogger = oFeLogger.getLogger();
	var oLevel = oFeLogger.Level;
	// Constants which are used as property names for storing custom filter data and generic filter data
	var dataPropertyNameCustom = "sap.suite.ui.generic.template.customData",
		dataPropertyNameExtension = "sap.suite.ui.generic.template.extensionData",
		dataPropertyNameGeneric = "sap.suite.ui.generic.template.genericData";

	function fnLogInfo(sMessage, vDetails){
		if (sap.ui.support) { //only if support assistant is loaded
			var iLevel = oLogger.getLevel();
			if (iLevel < oLevel.INFO) {
				oLogger.setLevel(oLevel.INFO);
			}
		}
		var sDetails;
		if (typeof vDetails === "string"){
			sDetails = vDetails;
		} else {
			sDetails = "";
			var sDelim = "";
			for (var sKey in vDetails){
				sDetails = sDetails + sDelim + sKey + ": " + vDetails[sKey];
				sDelim = "; ";
			}
		}
		oLogger.info(sMessage, sDetails, "sap.suite.ui.generic.template.ListReport.controller.IappStateHandler");
	}

	function getMethods(oState, oController, oTemplateUtils) {
		var oLegacyStateHandler = new LegacyStateHandler(oController);


		// don't apply any results from appstate analysis to SFB before this event
		// -> should actually be handled by (wrapper for) SFB
		var onSmartFilterBarInitialized;
		var oSmartFilterBarInitializedPromise = new Promise(function(fnResolve){
			onSmartFilterBarInitialized = fnResolve;
		});

		// Create a wrappers for controls carrying a state
		// DynamicPage state: header pinned
		var oDynamicPage = oController.byId(StableIdHelper.getStableId({type: "ListReportPage", subType: "DynamicPage"}));
		var oDynamicPageWrapper = oTemplateUtils.oCommonUtils.getControlStateWrapper(oDynamicPage);
		// SmartVariantManagement state: Selected Variant and whether it's dirty
		var oSmartVariantManagement = oState.oSmartFilterbar.getSmartVariant();
		var oSmartVariantManagementWrapper = oTemplateUtils.oCommonUtils.getControlStateWrapper(oSmartVariantManagement, {oSFB: oState.oSmartFilterbar});
		// SmartTable state: Table Settings and (in case of control level variant management) selected variant and whether it's dirty
		// In case of multipleViews with multiple tables (mode "multi"), each tab has an own table or chart, which has an own state, so multipleViewsHandler has to take care of storing/restoring their
		// states (in its part of the appState stored in genericData.tableTabData)
		// In this case, mutliViewsHandler exchanges oState.oPresentationControlHandler (setting it always to the current visible one), so don't rely on that to get the wrapper. Getting the wrapper by using the id
		// (without providing optional parameter sQuickVariantKey) gives us a dummy wrapper in multi tables case and a meaningful one in single table case.
		var oSmartTableWrapper = oTemplateUtils.oCommonUtils.getControlStateWrapper(oController.byId(StableIdHelper.getStableId({type: "ListReportTable", subType: "SmartTable"})));
		// SearchField state: Value of searchfield
		// Exists only in case of worklist. In case of worklist with multiple views with multiple tables, same is true as for SmartTable - in any case, wrapper is robust (returning dummy wrapper in
		// case control is not found)
		var oSearchFieldWrapper = oTemplateUtils.oCommonUtils.getControlStateWrapper(oController.byId(StableIdHelper.getStableId({type: "ListReportAction", subType: "SearchField"})));

		// TODO: get rid of parameter for changeIappState (indicating whether data (up to date with filterbar) should be shown). There should not be
		// a need to answer this question for every event, that can trigger a new appState, but only once in the control that is actually responsible
		// for that, resp. its wrapper (i.e. SFB - a change to a filter would set it to false, a press on go would set it to true (maybe only after the
		// corresponding request has returned)
		oDynamicPageWrapper.attachStateChanged(function(){
			changeIappState(areDataShownInTable());
		});
		oSmartVariantManagementWrapper.attachStateChanged(function(){
			changeIappState(areDataShownInTable());
		});
		oSmartTableWrapper.attachStateChanged(function(){
			changeIappState(areDataShownInTable());
		});
		oSearchFieldWrapper.attachStateChanged(function(){
			changeIappState(areDataShownInTable());
		});

		var oNavigationHandler = oTemplateUtils.oServices.oApplication.getNavigationHandler();
		var bSmartVariantManagement = oController.getOwnerComponent().getSmartVariantManagement();

		var bIgnoreFilterChange = false; // In some cases we trigger the filter change event ourselves but do not want to update the appState. Then this flag is temporarily set.
		var oSettings = oTemplateUtils.oComponentUtils.getSettings();

		oState.oSmartFilterbar.setSuppressSelection(true);
		var bInitialisation = true; // This flag depicts the initial state of the application. It would be changed once the appState is added to the application.

		var getByDefaultNonVisibleCustomFilterNames = (function(){
			var aNonVisibleCustomFilterNames;
			return function(){
				aNonVisibleCustomFilterNames = aNonVisibleCustomFilterNames || oState.oSmartFilterbar.getNonVisibleCustomFilterNames();
				return aNonVisibleCustomFilterNames;
			};
		})();

		function areDataShownInTable(){
			var oTemplatePrivateModel = oTemplateUtils.oComponentUtils.getTemplatePrivateModel();
			return oTemplatePrivateModel.getProperty("/generic/bDataAreShownInTable");
		}

		// trigger loading data
		// this happens a bit different in different situations:
		// - "standard" ListReport: SFB.search takes care of loading table data (assumption: by calling rebindTable)
		// - multiple views with multiple tables: SFB.search only raises search event, MultipleTablesModeHelper is registered and ensures to refresh the current table, all counts, and invalidate the
		//		other tabs
		// - worklist: oWorklistHandler.performWorklistSearch reads value from searchfield, adds id to table custom data, and calls rebindTable (TODO: should be refactored, rebindTable should be
		//		sufficient (value of searchfield should be read from there), maybe with similar mechanism as multiplTables (or get rid of invisible SFB?))
		// Note: In worklist case, we also need to call this when loading a variant. In other cases, variant has a flag executeOnSelect, and SMV takes care of triggereing search depending on that. In
		//		worklist, this flag doesn't exist, but each change needs (i.e. also loading a variant) needs to execute a search
		// This method is NOT intended to do any checks to analyze, whether loading data is actually needed - that should be done before
		function loadData(){
			if (oState.oWorklistData.bWorkListEnabled) {
				// TODO: rethink multipleViews case: Should search be triggered from multipleViews handler?
				var oEvent = {
						getSource: function(){
							return oState.oWorklistData.oSearchField;
						},
						getId: Function.prototype
				};
				oState.oWorklistHandler.performWorklistSearch(oEvent);
			} else {
				oState.oSmartFilterbar.search();
			}
		}

		function getPageState() {
			var oCustomAndGenericData = {}; // object to be returned by this function

			// first determine the generic information
			// Determine information about visible custom filters
			var aVisibleCustomFieldNames = [];
			var aByDefaultNonVisibleCustomFilterNames = getByDefaultNonVisibleCustomFilterNames();
			for (var i = 0; i < aByDefaultNonVisibleCustomFilterNames.length; i++){ // loop over all custom fields which are not visible in filterbar by default
				var sName = aByDefaultNonVisibleCustomFilterNames[i];
				if (oState.oSmartFilterbar.isVisibleInFilterBarByName(sName)){ // custom field is visible in filterbar now
					aVisibleCustomFieldNames.push(sName);
				}
			}
			var oGenericData = {
				suppressDataSelection: !areDataShownInTable(),
				visibleCustomFields: aVisibleCustomFieldNames
			};
			oCustomAndGenericData[dataPropertyNameGeneric] = oGenericData;
			if (oTemplateUtils.oComponentUtils.isDraftEnabled()) {
				var oTemplatePrivateModel = oTemplateUtils.oComponentUtils.getTemplatePrivateModel();
				oGenericData.editStateFilter = oTemplatePrivateModel.getProperty("/listReport/vDraftState");
				var bActiveStateFilter = oTemplatePrivateModel.getProperty("/listReport/activeObjectEnabled");
				oGenericData.activeStateFilter = bActiveStateFilter;
			}
			var sSelectedKeyPropertyName = oState.oMultipleViewsHandler.getSelectedKeyPropertyName();
			if (sSelectedKeyPropertyName) {
				var oTableViewData = oState.oMultipleViewsHandler.getContentForIappState();
				if (oTableViewData){
					oGenericData[sSelectedKeyPropertyName] = oTableViewData.state;
				}
			}

			// second allow classical break-outs to add their custom state
			var oCustomData = {};
			oCustomAndGenericData[dataPropertyNameCustom] = oCustomData;
			oController.getCustomAppStateDataExtension(oCustomData);

			// thirdallow all extensions to add their custom state
			var oExtensionData; // collects all extension state information (as map extension-namespace -> state). Initialized on demand
			var bIsAllowed = true; // check for synchronous calls
			// the following function will be passed to all extensions. It gives them the possibility to provide their state as oAppState
			// Therefore, they must identify themselves via their instance of ControllerExtension.
			var fnSetAppStateData = function(oControllerExtension, oAppState){
				if (!(oControllerExtension instanceof ControllerExtension)){
					throw new FeError(sClassName, "State must always be set with respect to a ControllerExtension");
				}
				if (!bIsAllowed){
					throw new FeError(sClassName, "State must always be provided synchronously");
				}
				if (oAppState){ // faulty app-state information will not be stored
					oExtensionData = oExtensionData || Object.create(null);
					var sExtensionId = oControllerExtension.getMetadata().getNamespace(); // extension is identified by its namespace
					oExtensionData[sExtensionId] = oAppState;
				}
			};
			oController.templateBaseExtension.provideExtensionAppStateData(fnSetAppStateData);
			bIsAllowed = false;
			if (oExtensionData){
				oCustomAndGenericData[dataPropertyNameExtension] = oExtensionData;
			}

			return oCustomAndGenericData;
		}

		function getCurrentAppState() {
			// state of SFB
			var oSFBUiState = oState.oSmartFilterbar.getUiState();
			// not in a useful format, so we need to do some adaptations
			// TODO: move these to a wrapper for SFB
			// some adaptations need to be done on selectionVariant, but we must not change the one referenced in UIState (used by the SFB itself), thus creating a new one with same content:
			var oSelectionVariant = new SelectionVariant(JSON.stringify(oSFBUiState.getSelectionVariant()));
			// 1. adaptation: visible filter fields
			/*
			 * Special handling for selection fields, for which defaults are defined: If a field is visible in the
			 * SmartFilterBar and the user has cleared the input value, the field is not included in the selection
			 * variant, which is returned by getDataSuiteFormat() of the SmartFilterBar. But since it was cleared by
			 * purpose, we have to store the selection with the value "", in order to set it again to an empty value,
			 * when restoring the selection after a back navigation. Otherwise, the default value would be set.
			 */
			var aVisibleFields = oController.getVisibleSelectionsWithDefaults();
			for (var i = 0; i < aVisibleFields.length; i++) {
				if (!oSelectionVariant.getValue(aVisibleFields[i])) {
					oSelectionVariant.addSelectOption(aVisibleFields[i], "I", "EQ", "");
				}
			}

			// 2. adaptation: id of variant (should not be part of SFB, but of SVM!)
			//If variant is dirty and if the selection variant has id, making the same empty for the filters to be applied correctly.
			// variant id is stored by SmartVariantManagementStateWrapper - no need to store with selection variant additionally
			// TODO: check restoring (whether id == "" or not is evaluated)
//			if (oSmartVariantManagement && oSmartVariantManagement.currentVariantGetModified() && oSelectionVariant.getID()) {
				oSelectionVariant.setID("");
//			}

			// 3. adaptation: delete select options for special properties in custom data neede to allow storing additional information in variant. SFB/SVM creates select options for them in a useless
			//		way, which should not be added to the appState. See also comment in onBeforeSFBVariantFetch
			fnRemoveCustomAndGenericData(oSelectionVariant);

			// finally, the state of SFB consist of the (adapted) selectionVariant and the semanticDates (currently added as separate property of appState)

			var mControlStates = {};
			// in case of multipleViews with multiple tables, no oSmartTableWrapper exists (instead, multipleViewsHandler is caring for the states of SmartTables/SmartCharts)
			if (oSmartTableWrapper.getLocalId()){
				mControlStates[oSmartTableWrapper.getLocalId()] = oSmartTableWrapper.getState();
			}
			// Use this control state to the pinned status at the time of restore
			mControlStates[oDynamicPageWrapper.getLocalId()] = oDynamicPageWrapper.getState();
			if (oSmartVariantManagementWrapper.getLocalId()){
				mControlStates[oSmartVariantManagementWrapper.getLocalId()] = oSmartVariantManagementWrapper.getState();
			}

			if (oSearchFieldWrapper.getLocalId()){
				mControlStates[oSearchFieldWrapper.getLocalId()] = oSearchFieldWrapper.getState();
			}

			return {
				version: sap.ui.version, // storing creation version of appState to allow better mapping for future structure changes
				selectionVariant: oSelectionVariant.toJSONString(),
				customData: getPageState(),
				semanticDates: oSFBUiState.getSemanticDates(),
				controlStates: mControlStates
			};
		}

		function fnRestoreGenericFilterState(oGenericData, bApplySearchIfConfigured) {
			var oTemplatePrivateModel = oTemplateUtils.oComponentUtils.getTemplatePrivateModel();
			if (oGenericData && oTemplateUtils.oComponentUtils.isDraftEnabled()){
				oTemplatePrivateModel.setProperty("/listReport/vDraftState", oGenericData.editStateFilter);
				oTemplatePrivateModel.setProperty("/listReport/activeObjectEnabled", !!oGenericData.activeStateFilter);
				oState.oMultipleViewsHandler.restoreActiveButtonState(oGenericData);
			}
			// Restore information about visible custom filters
			var aVisibleCustomFields = oGenericData && oGenericData.visibleCustomFields;
			if (aVisibleCustomFields && aVisibleCustomFields.length > 0){
				var aItems = oState.oSmartFilterbar.getAllFilterItems();
				for (var i = 0; i < aItems.length; i++){
					var oItem = aItems[i];
					var sName = oItem.getName();
					if (aVisibleCustomFields.indexOf(sName) !== -1){
						oItem.setVisibleInFilterBar(true);
					}
				}
			}
			setDataShownInTable(bApplySearchIfConfigured && !(oGenericData && oGenericData.suppressDataSelection));

			var sSelectedKeyPropertyName = oState.oMultipleViewsHandler.getSelectedKeyPropertyName();
			if (sSelectedKeyPropertyName && oGenericData[sSelectedKeyPropertyName]) {
				oState.oMultipleViewsHandler.restoreFromIappState(oGenericData[sSelectedKeyPropertyName]);
			}

			if (areDataShownInTable()){
				loadData();
			}
		}

		function handleVariantIdPassedViaURLParams(oNewUrlParameters) {
			if (bSmartVariantManagement) {
				var sPageVariantId = oNewUrlParameters['sap-ui-fe-variant-id'];
				if (sPageVariantId && sPageVariantId[0]) {
					oSmartVariantManagement.setCurrentVariantId(sPageVariantId[0]);
				}
			} else {
				var aPageVariantId = oNewUrlParameters['sap-ui-fe-variant-id'],
					aFilterBarVariantId = oNewUrlParameters['sap-ui-fe-filterbar-variant-id'],
					aChartVariantId = oNewUrlParameters['sap-ui-fe-chart-variant-id'],
					aTableVariantId = oNewUrlParameters['sap-ui-fe-table-variant-id'];

				applyControlVariantId(aFilterBarVariantId && aFilterBarVariantId[0], aChartVariantId && aChartVariantId[0], aTableVariantId && aTableVariantId[0], aPageVariantId && aPageVariantId[0]);
			}
		}
		function applyControlVariantId(sFilterBarVariantId, sChartVariantId, sTableVariantId, sPageVariantId) {
			if (sFilterBarVariantId || sPageVariantId) {
				oSmartVariantManagement.setCurrentVariantId(sFilterBarVariantId || sPageVariantId);
			}

			if (sTableVariantId || sPageVariantId) {
				oState.oPresentationControlHandler.setCurrentVariantId(sTableVariantId || sPageVariantId);
			}

			oState.oMultipleViewsHandler.setControlVariant(sChartVariantId, sTableVariantId);
		}

		// method is responsible for retrieving custom filter state. The corresponding extension-method has a more generic name
		// for historical reasons (change would be incompatible).
		function fnRestoreCustomFilterState(oCustomData) {
			oController.restoreCustomAppStateDataExtension(oCustomData || {});
		}

		// method is responsible for retrieving state for all extensions.
		// More precisely, oExtensionData is a map Extension-namespace -> state that has been stored by the corresponding extension.
		// This method enables each extension to restore its state accordingly.
		function fnRestoreExtensionFilterState(oExtensionData){
			if (!oExtensionData){
				return; // the app-state does not contain state information for extensions
			}
			var bIsAllowed = true; // check for synchronous calls
			// the following function will be passed to all extensions. It gives them the possibility to retrieve their state.
			// Therefore, they must identify themselves via their instance of ControllerExtension.
			var fnGetAppStateData = function(oControllerExtension){
				if (!(oControllerExtension instanceof ControllerExtension)){
					throw new FeError(sClassName, "State must always be retrieved with respect to a ControllerExtension");
				}
				var sExtensionId = oControllerExtension.getMetadata().getNamespace();
				if (!bIsAllowed){
					throw new FeError(sClassName, "State must always be restored synchronously");
				}
				return oExtensionData[sExtensionId];
			};
			oController.templateBaseExtension.restoreExtensionAppStateData(fnGetAppStateData);
			bIsAllowed = false;
		}

		// This method is responsible for restoring the data which have been stored via getPageState.
		// No need to care for historic format: already mapped using legacyStateHandler (in applyState in iAppState case and in fnRestoreExtendedFilterDataOnAfterSFBVariantLoad when restoring from a
		// variant)
		function fnRestorePageState(oCustomAndGenericData, bApplySearchIfConfigured) {
			fnRestoreExtensionFilterState(oCustomAndGenericData[dataPropertyNameExtension]);
			fnRestoreCustomFilterState(oCustomAndGenericData[dataPropertyNameCustom]);
			fnRestoreGenericFilterState(oCustomAndGenericData[dataPropertyNameGeneric], bApplySearchIfConfigured);

			// according to SFB needed to recalculate adapt filters count also for extension filters
			oState.oSmartFilterbar.fireFilterChange();
		}

		function setDataShownInTable(bDataAreShown) {
			var oTemplatePrivateModel = oTemplateUtils.oComponentUtils.getTemplatePrivateModel();
			// in case of livemode, always data should be shown (as each filter change also triggers a new request)
			// for sake of simplicity, we just check this here - although it might be clearer, to check it at the places, where this flag is usually set to false
			// (on startup depending on several options, when a filter is changed, and when loading a variant (depending on its settings)).
			// However, correct handling of adapt filters dialog (esp. combination of reset and cancel (which does not really revert to the state before dialog was opened))
			// would have to be checked.
			// Anyway, there could be also one behavioral difference: When invalid filter value is entered, this triggers a filterChange, but no search event. If required
			// overlay could be set in this case (by setting bDataAreShownInTable to false) - but this seems not to be necessary, as invalid filter is also marked
			oTemplatePrivateModel.setProperty("/generic/bDataAreShownInTable", bDataAreShown || oState.oSmartFilterbar.getLiveMode());
		}

		// the search is automatically performed by the SmartTable so we only need to
		// - ensure that all cached data for the object pages are refreshed, too
		// - update our internal state (data are shown in table)
		// - Collapse of filter bar once user press Go (only for phone device)
		function onSearchPressed() {
			oState.refreshModel();
			oState.oIappStateHandler.changeIappState(true);
			if (Device.system.phone) {
				collapseLRHeaderonLoad();
			}
		}

		// This method is called when the data selection for the table is triggered (bDataAreShown = true).
		// It is responsible for:
		// - triggering the creation of a new appState if neccessary
		function changeIappState(bDataAreShown){
			fnLogInfo("changeIappState called", {
				bDataAreShown: bDataAreShown,
				bDataAreShownInTable: areDataShownInTable(),
				bIgnoreFilterChange: bIgnoreFilterChange
			});
			// don't consider filter changes while the dialog is open or the application is in initial state
			if (bIgnoreFilterChange || oState.oSmartFilterbar.isDialogOpen() || bInitialisation) {
				return;
			}
			setDataShownInTable(bDataAreShown);

			// inform statePreserver about change already here (not just in fnStoreCurrentAppStateAndAdjustURL) to allow own handling of dealing with multiple state changes
			// overlapping each other
			// no need to check whether the state actually has changed (just pressing go again to refresh the data is no state change) - this is done by statePreserver
			oTemplateUtils.oComponentUtils.stateChanged();
		}

		/*
		The function is to add default values in Display Currency parameter if it is not there in the Selection Variant
        @param {object} Selection Variant
`		@param {object} App data
		*/
		function addDisplayCurrency(oAppData) {
			var aMandatoryFilterItems = oState.oSmartFilterbar.determineMandatoryFilterItems(),
			sDisplayCurrency;
			for (var item = 0; item < aMandatoryFilterItems.length; item++) {
				if (aMandatoryFilterItems[item].getName().indexOf("P_DisplayCurrency") !== -1) {
					if (oAppData.oDefaultedSelectionVariant.getSelectOption("DisplayCurrency") && oAppData.oDefaultedSelectionVariant.getSelectOption("DisplayCurrency")[0] && oAppData.oDefaultedSelectionVariant.getSelectOption("DisplayCurrency")[0].Low) {
						sDisplayCurrency = oAppData.oDefaultedSelectionVariant.getSelectOption("DisplayCurrency")[0].Low;
						if (sDisplayCurrency) {
							oAppData.oSelectionVariant.addParameter("P_DisplayCurrency", sDisplayCurrency);
						}
					}
					break;
				}
			}
		}

		/*
		The function checks if the mandatory filters are filled. Returns true if atleast one mandatory filter is not filled
		*/
		function isMandatoryFilterFilled() {
			var aMandatoryFilterItems = oState.oSmartFilterbar.determineMandatoryFilterItems();
			var aFiltersWithValues = oState.oSmartFilterbar.getFiltersWithValues();

			return aMandatoryFilterItems.every(function(sItem) {
				return aFiltersWithValues.includes(sItem);
			});
		}

		/*
			This method is called when an LR app is the target of an external navigation and the XAppState data contains a presentationVariant.
			The sorting from this presentationVariant is then applied to the table.

			To achieve this, we fetch the UiState of the table and add the sort order from the app state to the presentationvariant in the UiState.
			All the other information in the PresentationVariant(ex. RequestAtLeast, Visualizations etc) remains as is.
		*/
		function setControlSortOrder(vPresentationVariant) {
			//PresentationVariant coming from the navigation context could either be a string or an object.
			var oPresentationVariant = typeof vPresentationVariant === "string" ? JSON.parse(vPresentationVariant) : vPresentationVariant;
			var aNavigationSortOrder = oPresentationVariant && oPresentationVariant.SortOrder;
			oState.oPresentationControlHandler.applyNavigationSortOrder(aNavigationSortOrder);
		}

		function fnAdaptToAppStateIappState(oAppData){
			// incase semantic date field is present, parseNavigation returns semanticDates in stringified format and otherwise an empty object
			var oSemanticDates = (typeof oAppData.semanticDates === "string" ? JSON.parse(oAppData.semanticDates) : oAppData.semanticDates) || {};
			// if there is a navigation from external application to worklist,
			// the filters from external application should not be applied since the worklist does not show smartfilterbar
			// and there is no way for the user to modify the applied filters. Hence not applying the filters only if it is worklist

			// in case of navigation with URL parameters but no xAppState, no CustomData is provided
			oAppData.customData = oAppData.customData || {};

			fnHidePlaceHolder(areDataShownInTable());
			fnAdaptOtherControlsToAppState(oAppData.controlStates);
			// applying selection variant to SFB has to happen AFTER setting variant id to SmartVariantManagement - otherwise setting standard variant in case of dirty variant in appState would
			// set back and thus override any other values in SFB coming directly from appState
			// This shows that there is actually a dependency, which should be handled inside a Wrapper.
			// Clarify: Which wrapper should be used as the outer one (and know about the other one)
			// - SmartVariantManagementWrapper: Seems to be more logical and better to support also pageVariantManagement
			// -SmartFilterBarWrapper: Would be more consistent to existing Wrappers for Table/Chart (actually, there both is implemented in one Wrapper), and to original logic of SFB/SVM (APIs are provided from
			// SFB, although they might make more sense to be provided from SVM)
			if (!oState.oWorklistData.bWorkListEnabled) {
				fnApplySelectionVariantToSFB(oAppData.oSelectionVariant || "",  oAppData.selectionVariant || "", true, oSemanticDates, false);
			}
			// fnRestorePageState has even to be called later (after applying SelectionVariant), as it triggers the search (depending on executeOnSelect of variant) and checks for collapsing the header
			// this shows another dependency. Triggering search should be treated separately (after all other states have been restored). Collapsing header needs to be checked (currently happening after search, but
			// shouldn't it be handled by dynamicPageWrapper solely?)
			fnRestorePageState(oAppData.customData, true);

		}

		function fnAdaptToAppStateNavigation(oAppData, oURLParameters){
			handleVariantIdPassedViaURLParams(oURLParameters);
			//Apply sort order coming from the XAppState to the smart table.
			if (oAppData.presentationVariant !== undefined) {
				setControlSortOrder(oAppData.presentationVariant);
			}
			if ((oAppData.oSelectionVariant.getSelectOptionsPropertyNames().indexOf("DisplayCurrency") === -1) && (oAppData.oSelectionVariant.getSelectOptionsPropertyNames().indexOf("P_DisplayCurrency") === -1) && (oAppData.oSelectionVariant.getParameterNames().indexOf("P_DisplayCurrency") === -1)) {
				addDisplayCurrency(oAppData);
			}
			var oStartupObject = {
					selectionVariant: oAppData.oSelectionVariant,
					urlParameters: oURLParameters,
					selectedQuickVariantSelectionKey: "",
					// incase semantic date field is present, parseNavigation returns semanticDates in stringified format and otherwise an empty object
					semanticDates: (typeof oAppData.semanticDates === "string" ? JSON.parse(oAppData.semanticDates) : oAppData.semanticDates) || {}
			};
			// if there is a navigation from external application to worklist,
			// the filters from external application should not be applied since the worklist does not show smartfilterbar
			// and there is no way for the user to modify the applied filters. Hence not applying the filters only if it is worklist
			if (!oState.oWorklistData.bWorkListEnabled) {
				// Call the extension to modify selectionVariant or semanticDates or set tab for NavType !== iAppState as iAppState would have the modified SV values
				// or saved selected tab and hence there is no need to modify them again
				oController.modifyStartupExtension(oStartupObject);

				if (oState.oSmartFilterbar.isCurrentVariantStandard()) {
					semanticDateRangeTypeHelper.setSemanticDateRangeDefaultValue(oSettings, oState.oSmartFilterbar, oStartupObject.semanticDates, oStartupObject.urlParameters || {});
				}
				fnApplySelectionVariantToSFB(oStartupObject.selectionVariant, oAppData.selectionVariant || "", true, oStartupObject.semanticDates, false);
			}

			if (oState.oWorklistData.bWorkListEnabled) {
				loadData();
			}
			
			// ensure to call restoreCustomAppStateDataExtension for compatibility
			fnRestoreCustomFilterState();
			
			// restore old behavior (calling fnRestorePageState({}, true);) => initialize bShouldDataBeLoaded = true
			// TODO: refactor/combine with code below intended to analyze whether data should be loaded

			oState.oMultipleViewsHandler.handleStartUpObject(oStartupObject);

			// TO-DO: To discuss with the UX on the loading behaviour of the apps during cross-app nav w.r.t the different data load settings possible.
			// If the app is reached via cross-app navigation by UX decision the data should be shown immediately
			var bShouldDataBeLoaded = true;	// originally global variable, now local, with same initialization

			// If the NavType is iAppState the question of automated data selection is already settled.
			// Otherwise it must be done now. Note that automatisms have been disabled during startup
			// This is the case in FCL scenarios, when navigating from an automatically filled list to a detail.
			// Treat Worklist differently
			if (!oState.oWorklistData.bWorkListEnabled){
				if (!oState.oSmartFilterbar.getLiveMode() && !oState.oSmartFilterbar.isCurrentVariantStandard()) {
					bShouldDataBeLoaded = oState.oSmartFilterbar.isCurrentVariantExecuteOnSelectEnabled();
				}

				setDataShownInTable(bShouldDataBeLoaded);
				if (bShouldDataBeLoaded) {
					oState.oSmartFilterbar.search();
					//collapse header if execute on select is checked or enableautobinding is set and the device type is not desktop
					if (!Device.system.desktop) {
						collapseLRHeaderonLoad();
					}
				}
				fnHidePlaceHolder(bShouldDataBeLoaded);
			}

			// IappState needs to be created on app launch in every scenario, irrespective of filter(s) set or load behavior of the application
			changeIappState(bShouldDataBeLoaded);
		}


		function fnAdaptToAppStateStartUpInitial(oURLParameters){
			handleVariantIdPassedViaURLParams(oURLParameters);

			//oStartupObject to be passed to the extension where urlParameters and selectedQuickVariantSelectionKey are optional
			var oStartupObject = {
					selectionVariant: "",
					urlParameters: oURLParameters, // can only contain "technical" parameters (starting with "sap-")
					selectedQuickVariantSelectionKey: "",
					// in case semantic date field is present, parseNavigation returns semanticDates in stringified format and otherwise an empty object
					semanticDates:  {}
			};
			var oSFBUiState = oState.oSmartFilterbar.getUiState();
			var oSFBSelectionVariant = new SelectionVariant(JSON.stringify(oSFBUiState.getSelectionVariant()));

			// this condition is used to modify selection variant or semantic date when sNavType is initial.
			// do not expose generic and custom data through ext for modification
			fnRemoveCustomAndGenericData(oSFBSelectionVariant);
			var oSFBSelectionVariantCopy = JSON.parse(JSON.stringify(oSFBSelectionVariant));

			var oSFBSemanticDates = oSFBUiState.getSemanticDates();
			oStartupObject.selectionVariant = oSFBSelectionVariant;
			oStartupObject.semanticDates = oSFBSemanticDates;
			oController.modifyStartupExtension(oStartupObject);
			if (!(deepEqual(JSON.parse(JSON.stringify(oStartupObject.selectionVariant)), oSFBSelectionVariantCopy) && deepEqual(oStartupObject.semanticDates, oSFBSemanticDates))) {
				fnApplySelectionVariantToSFB(oStartupObject.selectionVariant, "", true, oStartupObject.semanticDates, true);
			}

			// ensure to call restoreCustomAppStateDataExtension for compatibility
			fnRestoreCustomFilterState();
			
			// restore old behavior (calling fnRestorePageState({}, true);) => initialize bShouldDataBeLoaded = true
			// TODO: refactor/combine with code below intended to analyze whether data should be loaded
			
			oState.oMultipleViewsHandler.handleStartUpObject(oStartupObject);

			var bShouldDataBeLoaded = true;	// originally global variable, now local, with same initialization

			// If the NavType is iAppState the question of automated data selection is already settled.
			// Otherwise it must be done now. Note that automatisms have been disabled during startup
			// However, if bShouldDataBeLoaded is already true, the data have already been selected and nothing needs to be done anymore.
			// This is the case in FCL scenarios, when navigating from an automatically filled list to a detail.
			// Treat Worklist differently
			if (oState.oWorklistData.bWorkListEnabled || oState.oSmartFilterbar.getLiveMode()) {
				// TODO: Also in livemode, availability of mandatory filter values should be checked first (otherwise, mandatory filters are marked (red border) immediately, which would not be the case
				// according to SFBs logic). Could also be discussed with UX, but no known requirement yet => for the time being, just skip this check for simplicity.
				loadData();
			} else {
				if (oState.oSmartFilterbar.isCurrentVariantStandard()) {
					// check for the default value if set on semantic data range
					semanticDateRangeTypeHelper.setSemanticDateRangeDefaultValue(oSettings, oState.oSmartFilterbar, oStartupObject.semanticDates || {}, oStartupObject.urlParameters);

					oSmartVariantManagement.setExecuteOnStandard(getInitialLoadBehaviourSettings(false));

					var bApplyAutomaticallyValueInSVM = oSmartVariantManagement.getExecuteOnStandard(); // holds the actual apply automatically checkbox value set in the app
					if (bApplyAutomaticallyValueInSVM || oSettings.variantManagementHidden) {
						var bInitialLoadAsPerManifest = getInitialLoadBehaviourSettings(true);
						bShouldDataBeLoaded = bInitialLoadAsPerManifest === undefined ? bApplyAutomaticallyValueInSVM : bInitialLoadAsPerManifest;
					} else {
						bShouldDataBeLoaded = false;
					}

				} else {
					bShouldDataBeLoaded = oState.oSmartFilterbar.isCurrentVariantExecuteOnSelectEnabled();
				}

				setDataShownInTable(bShouldDataBeLoaded);
				if (bShouldDataBeLoaded) {
					oState.oSmartFilterbar.search();
					//collapse header if execute on select is checked or enableautobinding is set and the device type is not desktop
					if (!Device.system.desktop) {
						collapseLRHeaderonLoad();
					}
				}
				fnHidePlaceHolder(bShouldDataBeLoaded);
			}

			//Set the variant to clean when the user has not altered the filters on the initial load of the app(no navigation context).
			oSmartVariantManagement && oSmartVariantManagement.currentVariantSetModified(false);

			// IappState needs to be created on app launch in every scenario, irrespective of filter(s) set or load behavior of the application
			changeIappState(bShouldDataBeLoaded);
		}

		function fnArrayContainsSameEnteries(aFirstComparate, aSecondComparate) {
			return deepEqual(aFirstComparate.map(JSON.stringify).sort(), aSecondComparate.map(JSON.stringify).sort());
		}

		function fnAdaptToAppStateStartUpWithParameters(oAppData, oURLParameters){
			handleVariantIdPassedViaURLParams(oURLParameters);

			//oStartupObject to be passed to the extension where urlParameters and selectedQuickVariantSelectionKey are optional
			var oStartupObject = {
				selectionVariant: oAppData.oSelectionVariant,
				urlParameters: oURLParameters,
				selectedQuickVariantSelectionKey: "",
				// incase semantic date field is present, parseNavigation returns semanticDates in stringified format and otherwise an empty object
				semanticDates: (typeof oAppData.semanticDates === "string" ? JSON.parse(oAppData.semanticDates) : oAppData.semanticDates) || {}
			};
			//Apply sort order coming from the XAppState to the smart table.
			if (oAppData.presentationVariant !== undefined) {
				setControlSortOrder(oAppData.presentationVariant);
			}
			var oSFBUiState = oState.oSmartFilterbar.getUiState();
			var oSFBSelectionVariant = new SelectionVariant(JSON.stringify(oSFBUiState.getSelectionVariant()));
			fnRemoveCustomAndGenericData(oSFBSelectionVariant);
			var oSFBSelectionVariantCopy = JSON.parse(JSON.stringify(oSFBSelectionVariant));
			var oSFBSemanticDates = oSFBUiState.getSemanticDates();
			if ((oAppData.oSelectionVariant.getSelectOptionsPropertyNames().indexOf("DisplayCurrency") === -1) && (oAppData.oSelectionVariant.getSelectOptionsPropertyNames().indexOf("P_DisplayCurrency") === -1) && (oAppData.oSelectionVariant.getParameterNames().indexOf("P_DisplayCurrency") === -1)) {
				addDisplayCurrency(oAppData);
			}
			// if there is a navigation from external application to worklist,
			// the filters from external application should not be applied since the worklist does not show smartfilterbar
			// and there is no way for the user to modify the applied filters. Hence not applying the filters only if it is worklist
			if (!oState.oWorklistData.bWorkListEnabled) {
				// Call the extension to modify selectionVariant or semanticDates or set tab for NavType !== iAppState as iAppState would have the modified SV values
				// or saved selected tab and hence there is no need to modify them again
				if (oState.oSmartFilterbar.isCurrentVariantStandard()) {
					// given variant has only default values (set by user in FLP), and variant (already loaded) is not user specific
					// => default values have to be added without removing existing values (but overriding them if values for the same filter exist)
					// in case of modify extension, if given variant has only default values, if these values are modified through extension,
					// then they will be replaced in the filterbar accordingly
					oController.modifyStartupExtension(oStartupObject);

					semanticDateRangeTypeHelper.setSemanticDateRangeDefaultValue(oSettings, oState.oSmartFilterbar, oStartupObject.semanticDates, oStartupObject.urlParameters);

					/* If there are user default value(s) set from FLP settings, standard variant should be set to dirty.
					   However, in cases where standard variant's properties has the same value as in the startup parameters, then user default value(s) would
					   have no effect on the standard variant and thus, it should be clean. */
					var aFilterItemNames = oState.oSmartFilterbar.getAllFilterItems().map(function (oFilterItem) {
						return oFilterItem.getName();
					});
					var aRelevantSelectOptions = oAppData.oSelectionVariant.toJSONObject().SelectOptions.filter(function (oSelectOption) {
						return aFilterItemNames.includes(oSelectOption.PropertyName);
					});
					if (!fnArrayContainsSameEnteries(oSFBSelectionVariant.toJSONObject().SelectOptions, aRelevantSelectOptions)) {
						fnApplySelectionVariantToSFB(listUtils.getMergedVariants([oSFBSelectionVariant, oStartupObject.selectionVariant]), oAppData.selectionVariant, true, oStartupObject.semanticDates, false);
						oSmartVariantManagement.currentVariantSetModified(true);
					}
				} else {
					oStartupObject.selectionVariant = oSFBSelectionVariant;
					oStartupObject.semanticDates = oSFBSemanticDates;
					oController.modifyStartupExtension(oStartupObject);
					// only if the extension modifies the selection variant or the semanticDates, then set it to smart filter bar again
					if (!(deepEqual(JSON.parse(JSON.stringify(oStartupObject.selectionVariant)), oSFBSelectionVariantCopy) && deepEqual(oStartupObject.semanticDates, oSFBSemanticDates))) {
						fnApplySelectionVariantToSFB(oStartupObject.selectionVariant, oAppData.selectionVariant, true, oStartupObject.semanticDates, false);
					}
				}
			}

			if (oState.oWorklistData.bWorkListEnabled || oState.oSmartFilterbar.getLiveMode()) {
				// TODO: Also in livemode, availability of mandatory filter values should be checked first (otherwise, mandatory filters are marked (red border) immediately, which would not be the case
				// according to SFBs logic). Could also be discussed with UX, but no known requirement yet => for the time being, just skip this check for simplicity.
				loadData();
			}
			// ensure to call restoreCustomAppStateDataExtension for compatibility
			fnRestoreCustomFilterState();
			
			// restore old behavior (calling fnRestorePageState({}, true);) => initialize bShouldDataBeLoaded = true
			// TODO: refactor/combine with code below intended to analyze whether data should be loaded
			oState.oMultipleViewsHandler.handleStartUpObject(oStartupObject);

			var bShouldDataBeLoaded = true;	// originally global variable, now local, with same initialization

			// If the NavType is iAppState the question of automated data selection is already settled.
			// Otherwise it must be done now. Note that automatisms have been disabled during startup
			// However, if bShouldDataBeLoaded is already true, the data have already been selected and nothing needs to be done anymore.
			// This is the case in FCL scenarios, when navigating from an automatically filled list to a detail.
			// Treat Worklist differently
			if (!oState.oWorklistData.bWorkListEnabled && !oState.oSmartFilterbar.getLiveMode()) {
				// If the app is reached via cross-app navigation by UX decision the data should be shown immediately
				if (oState.oSmartFilterbar.isCurrentVariantStandard()) {
					oSmartVariantManagement.setExecuteOnStandard(getInitialLoadBehaviourSettings(false));

					var bApplyAutomaticallyValueInSVM = oSmartVariantManagement.getExecuteOnStandard(); // holds the actual apply automatically checkbox value set in the app
					if (bApplyAutomaticallyValueInSVM || oSettings.variantManagementHidden) {
						var bInitialLoadAsPerManifest = getInitialLoadBehaviourSettings(true);
						bShouldDataBeLoaded = bInitialLoadAsPerManifest === undefined ? bApplyAutomaticallyValueInSVM : bInitialLoadAsPerManifest;
					} else {
						bShouldDataBeLoaded = false;
					}
				} else {
					bShouldDataBeLoaded = oState.oSmartFilterbar.isCurrentVariantExecuteOnSelectEnabled();
				}

				setDataShownInTable(bShouldDataBeLoaded);
				if (bShouldDataBeLoaded) {
					oState.oSmartFilterbar.search();
					//collapse header if execute on select is checked or enableautobinding is set and the device type is not desktop
					if (!Device.system.desktop) {
						collapseLRHeaderonLoad();
					}
				}
				fnHidePlaceHolder(bShouldDataBeLoaded);
			}

			// IappState needs to be created on app launch in every scenario, irrespective of filter(s) set or load behavior of the application
			changeIappState(bShouldDataBeLoaded);
		}


		// This method is called asynchronously from fnParseUrlAndApplyAppState in case of external navigation (xAppState or UrlParameters) or initial startup
		// as soon as the appstate-information from the url has been parsed completely.
		// In case of  restoring from iAppState, it's called by applyState, which is in turn called from statePreserver, that
		// already takes care of not trying to apply an appstate that is not valid anymore.
		// task of this method is (now always when it's called!) only to adapt the state of all relevant controls to the provided one
		function fnAdaptToAppState(oAppData, oURLParameters, sNavType){
			fnLogInfo("fnAdaptToAppState called", {
				sNavType: sNavType
			});

			oState.oSmartFilterbar.setSuppressSelection(false);
			bInitialisation = false;
			// separate 3 different cases
			// - restore from iAppState
			// - adapt to navigation parameters
			// - initial startup from scratch (including parameters provided from FLP!)

			switch (sNavType){
			case sap.ui.generic.app.navigation.service.NavType.iAppState:
				fnAdaptToAppStateIappState(oAppData);
				break;
			case sap.ui.generic.app.navigation.service.NavType.initial:
				// "technical" URL parameters are possible even in that case. NavigationHandler treats everything starting with "sap-" as technical.
				// some of them (at least 'sap-ui-fe*variant-id') are relevant
				fnAdaptToAppStateStartUpInitial(oURLParameters);
				break;
			case sap.ui.generic.app.navigation.service.NavType.xAppState:
			case sap.ui.generic.app.navigation.service.NavType.URLParams:
				if (oAppData.bNavSelVarHasDefaultsOnly){
					fnAdaptToAppStateStartUpWithParameters(oAppData, oURLParameters);
				} else {
					fnAdaptToAppStateNavigation(oAppData, oURLParameters);
				}
				break;
			default:
				fnAdaptToAppState.apply(this, arguments);
			}
		}

		function fnAdaptOtherControlsToAppState(mControlsStates) {
			Object.keys(mControlsStates).forEach(function(sLocalId){
				oTemplateUtils.oCommonUtils.getControlStateWrapper(oController.byId(sLocalId)).setState(mControlsStates[sLocalId]);
			});
		}

		function applyState(oState){
			if (!oState) {
				// no iAppState key in Url, that means
				// - we are definitely in startUp case (while navigating inside the app, there's always an appState - even if it cannot be stored)
				// - there might be other parameters (URL parameters or xAppSate), so we need to call navigationHandler to parse the URL
				// Remark: in case of an appState key in the URL, that could not be analyzed, we should NOT call navigationHandler to parse. In this case, we get an empty object
				// (in contrast to undefined when there's no appstate key)

				return oSmartFilterBarInitializedPromise.then(fnParseUrlAndApplyAppState); // return prmoise to inform controller, when startup is finished
			}

			// transfer state to most current version - assuming overriding here will not harm
			oState = oLegacyStateHandler.getStateInCurrentFormat(oState);
			// enhance appData to the format needed by fnAdaptToAppState
			var oAppData = extend({
// data from appState (i.e. provided by getCurrentState, thus stored in LREP and retrieved from there, and therefore provided in oState again)
// just providing defaults
//				customData: {}, // not necessary, as we have a fallback in fnAdaptToAppState again
//				selectionVariant: undefined,
//				tableVariantId: "",    // -> sTableVariantId, not necessary, as we have a fallback in fnAdaptToAppState again
// id for the appState in the URL - as storing and restoring from URL is task of the statePreserver, we should only be interested in the data here
// data provided with fixed values from navigationHandler in case of iAppState
//				bNavSelVarHasDefaultsOnly: false,	// -> bHasOnlyDefaults, not needed as ndefined is faulthy anyway
				oDefaultedSelectionVariant: new SelectionVariant(), // only accessed to check for P_DisplayCurrency - can this be relevant?
// data that seems to be irrelevant as we don't access them
//				presentationVariant: {}, // only accessed if navType not iAppState (intended for navigation ...)
//				valueTexts: {},
// data that needs to be derived from the other data
				// analysis of navigationHandler -> seems to be wrong. oState.selectionVariant is already stringified
				//				oSelectionVariant: new SelectionVariant(JSON.stringify(oState.selectionVariant || {}))  // -> oSelectionVariant
				oSelectionVariant: new SelectionVariant(oState && oState.selectionVariant)  // -> oSelectionVariant
// remaining: still to be analyzed which category they belong to
			}, oState
//			, {
// data that needs to be derived and override original values
//				selectionVariant: JSON.stringify(oState.selectionVariant || {})  // -> sSelectionVariant, fallback to "" (instead of "{}")?! - immer auch oSelectionVariant verfügbar (simplification possible), sSelectionVaraint used to compare with realized appState, unteschied zwischen "" und "{}" relevant?
//			}
			);
			oSmartFilterBarInitializedPromise.then(function(){
				// fallback to navType intial, if appState is given in URL, but could not be analyzed => oState is an empty Object
				fnAdaptToAppState(oAppData, {} /* URLparameter are irrelevant if restoring from iAppState */, isEmptyObject(oState) ? sap.ui.generic.app.navigation.service.NavType.initial : sap.ui.generic.app.navigation.service.NavType.iAppState);
			});
			return oSmartFilterBarInitializedPromise; // to inform controller, when startup is finished
		}

		function fnParseUrlAndApplyAppState(){
			var oRet = new Promise(function(fnResolve){
				try {
					var oParseNavigationPromise = oNavigationHandler.parseNavigation();
					oParseNavigationPromise.done(function(oAppData, oURLParameters, sNavType){
						if (sNavType !== sap.ui.generic.app.navigation.service.NavType.iAppState) { // handled via state preserver
							// navType initial has also to be handled here, as in that case the call from state preserver happens to early (we don't even know
							// at that time, whether navtype is initial, URLparams or xAppState when started from FLP with user default values set)
							fnAdaptToAppState(oAppData, oURLParameters, sNavType);
						}
						fnResolve();
					});
					oParseNavigationPromise.fail(function(oNavError, oURLParameters, sNavType){
						/* Parsing app state has failed, so we cannot set the correct state
						 * But at least we should get into a consistent state again, so the user can continue using the app
						 */
						oLogger.warning(oNavError.getErrorCode() + "app state could not be parsed - continuing with empty state");
						fnAdaptToAppState({}, oURLParameters, sap.ui.generic.app.navigation.service.NavType.initial); // Use NavType initial, as this will enforce selection in case auto-binding is true.
						fnResolve();
					});
				} catch (oError){
					// in case of an appState key in URL, but no ushell service, navigation handler throws an error (without any additional information)
					// => treat like NavType initial
					// RemarK: Without call to fnAdaptToApState (i.e. assuming (empty) iAppState is being handled by statePreserver), we would miss to apply e.g. dataload settings
					// could be improved by better separation of parsing iAppState from parameters
					// (i.e. if URL contains iAppState
					//		that can be parsed: restore from that one
					//		that cannot be parsed (for whatever reason): initial startup
					//	only if URL contains no iAppState: parse URL parameters)
					fnHidePlaceHolder();
					fnAdaptToAppState({}, {}, sap.ui.generic.app.navigation.service.NavType.initial); // Use NavType initial, as this will enforce selection in case auto-binding is true.
					fnResolve();
				}
			});
			return oRet;
		}

		// The smart filterbar is triggering this event in order to ensure that we update all stat information within the Smart Filterbar
		// This happens in two scenarios:
		// a) The user saves the current state as a variant -> In this case the SFB needs to know what to save
		// b) The user opens the 'Adapt filters' dialog -> In this case the current state needs to be remembered by the SFB, such that they can reset to this state if the user wants to
		function onBeforeSFBVariantFetch(){
			// In scenario b) no new appstate needs to be created (this only needs to happen when the user changes some filters on the dialog and closes the dialog)
			// In scenario a) a new appstate should be written (containing the new variant name) but the filters should not be considered as being changed.
			// The creation of a new appstate will be triggered by event onAfterSFBVariantSave.
			// Conclusion: We can disconnect from the filter change event while this method is running
			bIgnoreFilterChange = true;

			// check whether variant is dirty when dialog is opened already here, because it would marked as dirty anyway in fireFilterChange
			// as this event is also called in other cases (e.g. scenario a) above), only rely the flag if the dialog is opened
//			bDialogOpenedWithDirtyVariant = oSmartVariantManagement && oSmartVariantManagement.currentVariantGetModified();

			// To store the filter data, when the user creates a new variant, the variant management requests the data from the SFB. To enable also data for custom filters to be
			// stored, therefore we have to provide the custom data to the SFB. (Format doesn't matter - when the variant is loaded, in onAfterSFBVariantLoad we just get the same
			// data back by getFilterData and call the extension to restore its data.)



			// in case of SmartVariantManagement (which means one SmartVariantManagement control used for the whole page - so maybe PageVariantManagement would be the better name), all states of any
			// controls, that should be stored with the variant, have to be provided here. SVM itself only takes care of state of SFB (without custom filters)

			// old logic: get full appState, and take its customData (which is actually custom from point of view of navigationHandler for storing iAppState, and therefore not relevant at all anymore)
			// as only customData is of interest, no need to get "full" appState (in the format formally required by navigationHandler)

			var oCustomData = getPageState();
			// better logic: add all the data, that are custom from the SFB point of view for the SVM: custom (= extension + editState) filters and in case of PageVariantManagement other control states
			// for the time being: start with old approach, and add necessary data (esp. for other controls) according to new one

			// strange behviour of SFB/SVM:
			// - a property added here to customData is added also as filter (i.e. one level above) to the ui state (see in FilterBar.getUIState -> _getDataSuiteFormat -> VariantConverterTo.convert ->
			//		_getValue)
			// - uses "" + value, i.e. if property is an object, we get a non-sense select option with low = "[Object object]"
			// - mixing name spaces (filters are actually propertyNames from OData service!) - so we cannot know, whether the property name we (need to!) add here will also be used in service!
			// - in case of clash, this seems to be merged into the SelectOptions (i.e. there are SelectionOptions for the actual filter plus the non-sense SelectOption)
			// => Ideally, we should avoid a clash. However, this seems not possible (strictly), as naming of properties seem to allow more or less everything.
			// Currently best chance: use [dataPropertyNameGeneric], as this has already been used in past, and remove it when reading UIState (like partly also done in the past)
			// TODO: clarify with SFB/SVM how to get a clean solution

			oCustomData[dataPropertyNameGeneric].controlStates = Object.create(null);
			if (bSmartVariantManagement){
				// first try: only take care of SearchField
				if (oSearchFieldWrapper.getLocalId()){
					oCustomData[dataPropertyNameGeneric].controlStates[oSearchFieldWrapper.getLocalId()] = oSearchFieldWrapper.getState();
				}
			}
			//For the filter bar to be able to store the current state as a new variant and then this new variant would never be dirty
			oState.oSmartFilterbar.setCustomFilterData(oCustomData);
			bIgnoreFilterChange = false; // connect to the filter change event again
		}

		function onAfterSFBVariantSave(){
			changeIappState(areDataShownInTable());
		}

		// Set data for extended filters (extension filters and edit state filter) when a variant is loaded.
		// Todo: Clarify whether other data add to iAppState should be restored
		// (Currently everything is restored that is added to _CUSTOM. Assumption: In case of page variant management, everything should be considered, in case of
		// control variant management only the filters)
		function fnRestoreExtendedFilterDataOnAfterSFBVariantLoad(oEvent){
			// The data to be restored has been set to SFB's _CUSTOM data when the variant was saved and can be retrieved from there now
			var oCustomData = oState.oSmartFilterbar.getCustomFilterData();

			// in case of variant saved with old release, we might need to map custom data to most current format
			// preliminary: use legacyStateHandler (which is actually intended to map appStates, not just variant customData) to achieve the same
			// TODO: check, whether this fits completely...
			// Note: This might contain some additional data not relevant here, esp. variant dirty indicator. This would be set to true, as at the point in time
			// it was introduced, that was the best possible assumption for older states. This would be wrong here (user switches to a variant, so that should always be clean),
			// but this doesn't matter, as fnRestorePageState only restores filter (extensions - from SFB point of view) state, in particular not the state of SmartVariantManagement (to
			// which the dirty incidicator actually belongs)
			oCustomData = oLegacyStateHandler.getStateInCurrentFormat({customData: oCustomData}).customData;

			// restore any custom filter (from point ov view of SFB): custom (from FE point of View), extension and our own [dataPropertyNameGeneric]
			// ("our own" currently means: editStateFilter, activeButtonState, visibleCustomFields, dataShown, selected view in case of multiple views - at least the last 2 ones are questionable)
			// everything needed here should actually be part of the state of the SFB - but it's not the complete state, as the SFB restores the value of standard filters already itself
			// TODO: when wrapper for SFB is created, check whether this could used here (as part of controlSatets) anyway
			fnRestorePageState(oCustomData);

			// In case of page variant management, restore also the state of all other controls. No need to check bSmartVariantManagement, as this is already done when creating the variant.
			// Here, nearly everything should be contained. Only exceptions: State of SVM itself, dataShown, maybe header collapsed/pinned
			// preliminary: check controlStates (not provided in case of old variants). Target: mapping to be done with legacyHandler
			if (oCustomData[dataPropertyNameGeneric].controlStates){
				fnAdaptOtherControlsToAppState(oCustomData[dataPropertyNameGeneric].controlStates);
			}

			// Only difference in worklist: any change, i.e. also loading a variant, has to directly trigger a new request.
			// If we apply variant (as per appState), don't trigger search here, but later from appState restoring itself
			if (oState.oWorklistData.bWorkListEnabled && oEvent.getParameter("context") !== "SET_VM_ID") {
				loadData();
			}
		}

		// write new iAppState if state of VM is changed (user selects different variant or current filters are saved as new variant)
		function fnChangeIappStateOnAfterSFBVariantLoad(oEvent){
			var sContext = oEvent.getParameter("context");
			// When user selects a new variant the same actually also leads to filterChange event, so additional creation of iAppState here
			// would not be needed - but if user saves current filter state as new variant, old appState would contain old variant key, so it has to be renewed. Unfortuantely, these two
			// situations cannot be distinguished (both use context undefined). All other contexts do not change the state of
			if (!sContext) {
				setDataShownInTable(oEvent.getParameter("executeOnSelect"));
				collapseLRHeaderonLoad();
				changeIappState(areDataShownInTable());
			}
		}

		function onAfterSFBVariantLoad(oEvent) {
			// event is fired whenever SFB needs to load a variant, which can happen in different situations. According to SFB, these can be differentiated by the parameter "context" in the following way:
			// context			situation (according to SFB)														own observation
			// "CANCEL"			user uses cancel in adapt filters dialog											only when changes done before, also in UI adaptation
			// "RESET"			user uses reset in adapt filters dialog
			// "SET_VM_ID"		API SmartVariantManagemnet.setCurrentVariantId is called
			// "DATA_SUITE"		API SFB.setUiState is called														only if selection variant in ui state has an id (different from "")
			// "INIT"			initialization of SmartVariantMAnagement if default variant is not standard
			// "KEY_USER"		UI adaptation																		when user leaves adapt filter dialog with "ok" in UI adaptation
			// undefined		all other cases																		when user selects a different variant

			// VM takes part in appState in two roles
			// a) controlling the state of different controls (SFB)
			// b) with its own state (selected variant and dirty indicator) being part of iAppState

			// regarding a), while SFB takes care to set the data for standard filters (created via annotation), for others (extension filters, edit state filter, anything else that should be controlled by VM
			// (currently anything else we add to iAppState, but maybe that's only correct in case of page variant management)) we have to set it (independent of the context).
			fnRestoreExtendedFilterDataOnAfterSFBVariantLoad(oEvent);

			// regarding b), we have to ensure a new iAppState is written, if data has changed
			fnChangeIappStateOnAfterSFBVariantLoad(oEvent);

//			// special scenario providing third reason to react one this event, if user uses reset on adapt filters dialog: currently not reproducible
//			var sContext = oEvent.getParameter("context");
//			// reset is only available on the adapt filters dialog, so it makes sense to check bDialogOpenedWithDirtyVariant
//			if (sContext === "RESET" && bDialogOpenedWithDirtyVariant){
//				// reset on the dialog reset to the persisted version of the variant, even if cancel is used later - but does not trigger a selection
//				// (even if variant is marked as execute on select)
//				// Thus, as variant was dirty before, this is a change in filter, but no (current) data are shown in the table afterwards
//				oAdaptFiltersDialogOpenPromise.then(changeIappState.bind(null, false));
//			}
		}

		function onFiltersDialogBeforeOpen(){
//			oAdaptFiltersDialogOpenPromise = new Promise(function(resolve){
//				fnResolveAdaptFiltersDialog = resolve;
//			});

		}

		function onFiltersDialogClosed(){
//			fnResolveAdaptFiltersDialog();
			// resetting bDialogOpenedWithDirtyVariant here is of no value, as it would also be set in other cases (e.g. when saving the current state as variant)
			// i.e. it makes only sense to check the flag when the adapt filters dialog is open
		}

		function onAfterTableVariantSave() {
			if (!bSmartVariantManagement){
				changeIappState(areDataShownInTable());
			}
		}

		function onAfterApplyTableVariant() {
			if (!bSmartVariantManagement){
				changeIappState(areDataShownInTable());
			}
		}

		function onSmartFilterBarInitialise(){
			oState.oSmartFilterbar.attachFiltersDialogClosed(oTemplateUtils.oComponentUtils.stateChanged);
			// clarify: do we need to attach oTemplateUtils.oComponentUtils.stateChanged here?
			// actually, it seems that filterChange event is anyway raised again by SFB after dialog is closed (with "go")
		}

		//collapse dynamic header if data is preloaded in LR on launch
		function collapseLRHeaderonLoad(){
			// if no data is shown, expand header
			// if data is supposed to be shown and there are mandatory filters, expand header
			// if data is shown and there are no mandatory filters, collapse header
			var oTemplatePrivateModel = oController.getOwnerComponent().getModel("_templPriv");
			oTemplatePrivateModel.setProperty("/listReport/isHeaderExpanded", !areDataShownInTable() || !isMandatoryFilterFilled());
		}

		/* This function calls the setUiState API of smartfilterbar to set the Ui State
		 * @param  {object} oSelectionVariant -  Selection variant object
		 * @param {boolean} bReplace -  Property bReplace decides whether to replace existing filter data
                 * @param {boolean} bStrictMode - Defines the filter/parameter determination, based on the name.
		*/
		function fnSetFiltersUsingUIState(oSelectionVariant, bReplace, bStrictMode, oSemanticDates) {
			var oUiState = new UIState({
				selectionVariant : oSelectionVariant,
				semanticDates: oSemanticDates
			});
			oState.oSmartFilterbar.setUiState(oUiState, {
				replace: bReplace,
				strictMode: bStrictMode
			});
		}

        /*
		The function removes superfluos Custom and Generic data from the SelectVariant (these dataproperies are meant only for the _custom data in iAppState)
		@param {object} Selection Variant
		*/
		function fnRemoveCustomAndGenericData(oSelectionVariant) {
			[dataPropertyNameExtension, dataPropertyNameCustom, dataPropertyNameGeneric].forEach(oSelectionVariant.removeSelectOption.bind(oSelectionVariant));
		}

		/**
		 * This function apply selection properties to the smart filter bar
		 * @param  {object} oSelectionVariant
		 * @param  {string} sSelectionVariant
		 * @return {void}
		 */
		function applySelectionProperties(oSelectionVariant, sSelectionVariant, bNavTypeInitial) {
			// even when the nav type is initial, due to modifystartup extension,new fields can be added to smartfilterbar
			if (oSelectionVariant && (sSelectionVariant !== "" || bNavTypeInitial)){
				var aSelectionVariantProperties = oSelectionVariant.getParameterNames().concat(
					oSelectionVariant.getSelectOptionsPropertyNames());
				for (var i = 0; i < aSelectionVariantProperties.length; i++) {
					oState.oSmartFilterbar.addFieldToAdvancedArea(aSelectionVariantProperties[i]);
				}
			}
		}

		// map property values for property with name sFirstProperty to values for property with name sSecondProperty in oSelectionVariant
		function fnAlignSelectOptions(oSelectionVariant, sFirstProperty, sSecondProperty){
			if (oSelectionVariant.getParameter(sFirstProperty) && !oSelectionVariant.getParameter(sSecondProperty)){
				oSelectionVariant.addParameter(sSecondProperty, oSelectionVariant.getParameter(sFirstProperty));
			}
			if (oSelectionVariant.getSelectOption(sFirstProperty) && !oSelectionVariant.getSelectOption(sSecondProperty)){
				var aSelectOption = oSelectionVariant.getSelectOption(sFirstProperty);
				aSelectOption.forEach(function(oSelectOption){
					oSelectionVariant.addSelectOption(sSecondProperty, oSelectOption.Sign, oSelectOption.Option, oSelectOption.Low, oSelectOption.High);
				});
			}
		}

		function fnMapEditableFieldFor(oSelectionVariant){
			var oMetaModel = oController.getOwnerComponent().getModel().getMetaModel();
			var sEntitySet = oController.getOwnerComponent().getEntitySet();
			var oEntityType = oMetaModel.getODataEntityType(oMetaModel.getODataEntitySet(sEntitySet).entityType);
			oEntityType.property.forEach(function(oProperty){
				if (oProperty["com.sap.vocabularies.Common.v1.EditableFieldFor"]){
					// annotation property names follow their type, so PropertyPath is the right property to look at - String has to be supported for compatibility reasons
					var sKeyProperty = oProperty["com.sap.vocabularies.Common.v1.EditableFieldFor"].PropertyPath || oProperty["com.sap.vocabularies.Common.v1.EditableFieldFor"].String;
					var sForEditProperty = oProperty.name;
					// map key fields to corresponding for edit properties to provide values in SFB (without mapping in FLP)
					fnAlignSelectOptions(oSelectionVariant, sKeyProperty, sForEditProperty);
					// and vice versa if field is mapped in FLP (formerly recommended), but original field used in SFB (never recommended)
					fnAlignSelectOptions(oSelectionVariant, sForEditProperty, sKeyProperty);
				}
			});
		}

		function fnApplySelectionVariantToSFB(oSelectionVariant, sSelectionVariant, bReplace, oSemanticDates, bNavTypeInitial){
			fnMapEditableFieldFor(oSelectionVariant);
			if (bReplace) {
				oState.oSmartFilterbar.clearVariantSelection();
			}
			applySelectionProperties(oSelectionVariant, sSelectionVariant, bNavTypeInitial);
			fnSetFiltersUsingUIState(oSelectionVariant.toJSONObject(), bReplace, /* bStrictMode = */ false, oSemanticDates);
		}

		/* This method would hide placeholder if table would not show data on load
		 * if bDataAreShownInTable is true, then the placeholder is removed when table data is received */
		function fnHidePlaceHolder(bDataAreShownInTable){
			if (!bDataAreShownInTable || !isMandatoryFilterFilled()){
				oTemplateUtils.oComponentUtils.hidePlaceholder();
			}
		}

		/**
		 * This method is called in two scenarios:
		 *  1) When we need to decide the value of Apply Automatically checkbox
		 *  2) When we need to decide whether to load the data in smart table
		 * @param {boolean} bDataLoadCase whether the method was called to decide data load of a smart table or in any other case. As of now, the other
		 * case is wherein we need to decide the value of Apply Automatically checkbox to be set.
		 */
		function getInitialLoadBehaviourSettings(bDataLoadCase) {
			var bInitialLoad;
			if (oState.bLoadListAndFirstEntryOnStartup) {
				bInitialLoad = true;
			} else {
				var enableAutoBindingForMultiViews = oState.oMultipleViewsHandler.getOriginalEnableAutoBinding();
				var sLoadBehaviour = oSettings.dataLoadSettings && oSettings.dataLoadSettings.loadDataOnAppLaunch;
				if (sLoadBehaviour === "" || sLoadBehaviour === undefined && (enableAutoBindingForMultiViews !== null && enableAutoBindingForMultiViews !== undefined)) {
					bInitialLoad = enableAutoBindingForMultiViews && isMandatoryFilterFilled();
				} else {
					if (bDataLoadCase) {
						if (sLoadBehaviour === "ifAnyFilterExist" || sLoadBehaviour === undefined || sLoadBehaviour === "") {
							bInitialLoad = oState.oSmartFilterbar.getFiltersWithValues().length > 0 && isMandatoryFilterFilled();
						} else if (oSettings.variantManagementHidden) {
							if (sLoadBehaviour === "never") {
								bInitialLoad = false;
							} else if (sLoadBehaviour === "always") {
								bInitialLoad = isMandatoryFilterFilled();
							}
						}
					} else {
						bInitialLoad = sLoadBehaviour === "never" ? false : isMandatoryFilterFilled();
					}
				}
			}
			return bInitialLoad;
		}

		/* eslint-disable */
		testableHelper.testable(getInitialLoadBehaviourSettings, "getInitialLoadBehaviourSettings");
		/* eslint-disable */

		return {
			areDataShownInTable: areDataShownInTable,
			setDataShownInTable: setDataShownInTable,
			onSearchPressed: onSearchPressed,
			changeIappState: changeIappState,
			onFiltersDialogBeforeOpen: onFiltersDialogBeforeOpen,
			onFiltersDialogClosed: onFiltersDialogClosed,
			onSmartFilterBarInitialise: onSmartFilterBarInitialise,
			onSmartFilterBarInitialized: onSmartFilterBarInitialized,
			onBeforeSFBVariantFetch: onBeforeSFBVariantFetch,
			onAfterSFBVariantSave: onAfterSFBVariantSave,
			onAfterSFBVariantLoad: onAfterSFBVariantLoad,
			onAfterTableVariantSave: onAfterTableVariantSave,
			onAfterApplyTableVariant: onAfterApplyTableVariant,
			applyState: applyState,
			getCurrentAppState: getCurrentAppState, // separation of concerns - only provide state, statePreserver responsible for storing it
			setFiltersUsingUIState : fnSetFiltersUsingUIState
		};
	}

	return BaseObject.extend("sap.suite.ui.generic.template.ListReport.controller.IappStateHandler", {
		constructor: function(oState, oController, oTemplateUtils) {
			extend(this, getMethods(oState, oController, oTemplateUtils));
		}
	});
});
