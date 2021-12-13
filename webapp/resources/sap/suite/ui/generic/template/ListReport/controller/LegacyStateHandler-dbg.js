sap.ui.define(["sap/ui/base/Object", "sap/base/util/deepExtend", "sap/base/util/extend", "sap/base/util/Version", "sap/suite/ui/generic/template/genericUtilities/FeLogger", "sap/ui/generic/app/navigation/service/SelectionVariant",
	"sap/suite/ui/generic/template/genericUtilities/testableHelper"], function(BaseObject, deepExtend, extend, Version, FeLogger, SelectionVariant, testableHelper){
	"use strict";
	
	
	// Constants which are used as property names for storing custom filter data and generic filter data
	var dataPropertyNameCustom = "sap.suite.ui.generic.template.customData",
		dataPropertyNameExtension = "sap.suite.ui.generic.template.extensionData",
		dataPropertyNameGeneric = "sap.suite.ui.generic.template.genericData";
	
//	var oLogger = new FeLogger("ListReport.controller.legacyStateHelper").getLogger();


	// determines the version the state was written with (as far as possible)
	// return version as string or as Version object?
	function getVersionFromLegacyState(oLegacyState){
		// starting with 1.90, states carry version information of the release they were created => rely on that
		if (oLegacyState.version){
			return oLegacyState.version;
		}
		
		// in 1.86, dirty indicator for (SFB/Page) variant was introduced - if it exists, state is from 1.86 or newer
		// boolean flag - could be true or false, but not undefined
		if (oLegacyState.customData && oLegacyState.customData[dataPropertyNameGeneric] && oLegacyState.customData[dataPropertyNameGeneric].variantDirty !== undefined){
			return "1.86.0";
		}
		
		// in 1.58, extension data was introduced. 
		// However, this was done compatible in the sense that a state would still look identical unless extensions are really used, thus it cannot be fully identified.
		// I.e. a state could have been created with 1.58 or later, but we'd assume it to be older - but that's not a problem
		if (oLegacyState.customData && oLegacyState.customData[dataPropertyNameExtension]){
			return "1.58.0";
		}
		
		// in 1.36, custom data where separated into FE part ("generic") and application part ("custom") - so if these parts exist, the state is from 1.36 or newer
		if (oLegacyState.customData && oLegacyState.customData[dataPropertyNameCustom] && oLegacyState.customData[dataPropertyNameGeneric]){
			return "1.36.0";
		}
		
		// first delivery of FE was in 1.28 - so any state is at least from that release
		return "1.28.0";
	}
	
	function isNewerThen(oLegacyState, sVersion){
		// Using compareTo requires creation of version object for one of the two versions to compare.
		// Number of possible values for sVersion is limited (only the versions before a structure change happened), while the one contained in oLegacyState could be anyone.
		return Version(sVersion).compareTo(getVersionFromLegacyState(oLegacyState)) < 0;
	}
	

	function getMethods(oController){
		function mapFrom1_34(oState){
			if (isNewerThen(oState, "1.34.0")){
				return oState;
			}
			// with 1.36, customData has been differentiated in generic (containing only editStateFilter at that point in time) and custom (filters from extensions)
			
			var oNewCustomData = {};
			oNewCustomData[dataPropertyNameCustom] = oState.customData || {};
			oNewCustomData[dataPropertyNameGeneric] = {};
			if (oState.customData && oState.customData._editStateFilter){
				oNewCustomData[dataPropertyNameGeneric].editStateFilter = oState.customData._editStateFilter;
			}
			delete oNewCustomData[dataPropertyNameCustom]._editStateFilter; 
			oState.customData = oNewCustomData;	

			return oState;
		}
		
		function mapFrom1_85(oState){
			if (isNewerThen(oState, "1.85.0")){
				return oState;
			}
			// with 1.86, dirty indicator for (SFB/page) variant has been added 
			
			// for all old states, variant should be seen as dirty
			oState.customData[dataPropertyNameGeneric].variantDirty = true;
			return oState;
		}
		
		function mapFrom1_89(oState){
			if (isNewerThen(oState, "1.89.0")){
				return oState;
			}
			// with 1.90
			// - controlStates is introduced (map containing states per control, using (global) control id as key)
			// - table state (personalization) has been added (exception: multiple views with different tables)
			// - table variant id (only if control level variant management is used) has been moved to controlStates (as part of table state) (in multipleViews part of multipleViews state)
			
			deepExtend(oState, {
				version: "1.90.0",
				controlStates: {}
			});
			
			if (oState.tableVariantId){
				oState.controlStates[oController.getView().getId() + "--listReport"] = {
						sVariantId: oState.tableVariantId
				};
				delete oState.tableVariantId;
			}
			
			return oState;
		}
		
		function mapFrom1_93(oState){
			if (isNewerThen(oState, "1.93.0")){
				return oState;
			}
			// with 1.94
			// - using local id in control states (global id is superfluous, as the state is related to one view anyway - and it blows up the size of the state and makes it less readable)
			// - state of VM is stored in controlStates
			deepExtend(oState, {
				version: "1.94.0",
				controlStates: {}
			});
			
			var oView = oController.getView();
			for (var sGlobalId in oState.controlStates){
				var sLocalId = oView.getLocalId(sGlobalId);
				if (sLocalId){
					oState.controlStates[sLocalId] = oState.controlStates[sGlobalId];
					delete oState.controlStates[sGlobalId];
				}
			}
			
			oState.controlStates["template::PageVariant"] = {
					variantId: new SelectionVariant(oState.selectionVariant).getID(),
					modified: oState.customData[dataPropertyNameGeneric].variantDirty
				};
			
			delete oState.customData[dataPropertyNameGeneric].variantDirty;

			return oState;
		}
		
		function mapFrom1_94(oState){
			if (isNewerThen(oState, "1.94.0")){
				return oState;
			}
			// with 1.95
			// - worklist state stored in controlStates (in case of single view or single table mode) or in tableTabData.controlStates (in case of multiView with multiple tables)
			deepExtend(oState, {
				version: "1.95.0"
			});
			
			if (oState.customData[dataPropertyNameGeneric].Worklist){
				// different logic depending on sinlge view (or multi view with single table) on the one hand or multi view with multi tables on the other hand
				// relying on provided appState for that decision
				if (oState.customData[dataPropertyNameGeneric].tableTabData){
					extend(oState.customData[dataPropertyNameGeneric].tableTabData, {controlStates: {}});
					oState.customData[dataPropertyNameGeneric].tableTabData.controlStates["Table::Toolbar::SearchField-" + oState.customData[dataPropertyNameGeneric].tableTabData.selectedTab] = {
							searchString: oState.customData[dataPropertyNameGeneric].Worklist.searchString
					};
				} else {
					extend(oState, {controlStates: {}});
					oState.controlStates["Table::Toolbar::SearchField"] = {
							searchString: oState.customData[dataPropertyNameGeneric].Worklist.searchString
					};
				}
				delete oState.customData[dataPropertyNameGeneric].Worklist; 
			}
			
			return oState;
		}
		
		function getStateInCurrentFormat(oLegacyState){
			// whenever the structure of appState changes, a new mapping function can be added, that just realizes mapping for the latest step
			// note that the mapping functions per step modify the provided state object (and don't create a copy - but still return it to make use of reduce) - there's
			// no need to keep the intermediate versions, just the original provided state stays untouched
			
			return [mapFrom1_34, mapFrom1_85, mapFrom1_89, mapFrom1_93, mapFrom1_94].reduce(function(oState, fnMap){
				return fnMap(oState);
			}, deepExtend({}, oLegacyState));
		}

		// for productive use, only mapping to most current version makes sense
		// for testing however, testing mapping from one version to the next helps avoiding adoption all tests with every new version
		/* eslint-disable */
		testableHelper.testable(mapFrom1_34, "mapFrom1_34");
		testableHelper.testable(mapFrom1_85, "mapFrom1_85");
		testableHelper.testable(mapFrom1_89, "mapFrom1_89");
		testableHelper.testable(mapFrom1_93, "mapFrom1_93");
		testableHelper.testable(mapFrom1_94, "mapFrom1_94");
		/* eslint-disable */
		
		return {
			getStateInCurrentFormat: getStateInCurrentFormat
		};
	};

	
	return BaseObject.extend("sap.suite.ui.generic.template.ListReport.controller.LegacyStateHandler", {
		constructor: function(oController) {
			extend(this, getMethods(oController));
		}
	});
		
});
