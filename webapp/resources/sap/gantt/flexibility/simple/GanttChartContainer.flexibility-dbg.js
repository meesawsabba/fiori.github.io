/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)

		(c) Copyright 2009-2015 SAP SE. All rights reserved
	
 */

sap.ui.define([
	"sap/gantt/utils/GanttFlexibilityUtils"
], function (GanttFlexibilityUtils) {
	"use strict";

	return {
		"hideControl": "default",
		"unhideControl": "default",
		"moveControls": "default",
		"GanttContainerZoomLevel": {
			"changeHandler": {
				applyChange: function (oChange, oControl, mPropertyBag) {
					var oModifier = mPropertyBag.modifier,
						oChangeDefinition = oChange.getDefinition(),
						sPropertyName = oChangeDefinition.content["propertyName"],
						newValue = oChangeDefinition.content["newValue"],
						oldValue = oChangeDefinition.content["oldValue"];
					oChange.setRevertData(oldValue);
					if (oControl.initialSettings) {
						oControl.initialSettings.zoomLevel = newValue;
					}
					oModifier.setPropertyBindingOrProperty(oControl, sPropertyName, newValue);
					return true;
				},
				revertChange: function (oChange, oControl, mPropertyBag) {
					var oModifier = mPropertyBag.modifier;
					var oldValue = oChange.getRevertData();
					var oChangeDefinition = oChange.getDefinition(),
						sPropertyName = oChangeDefinition.content["propertyName"];
					if (oControl.initialSettings) {
						oControl.initialSettings.zoomLevel = oldValue;
					}
					oModifier.setPropertyBindingOrProperty(oControl, sPropertyName, oldValue);
					oChange.resetRevertData();
					return true;
				},
				completeChangeContent: function (oChange, oSpecificChangeInfo, mPropertyBag) {
					return;
				},
				 getCondenserInfo : function(oChange) {
					return {
						affectedControl: oChange.getSelector(),
						classification: sap.ui.fl.condenser.Classification.LastOneWins,
						uniqueKey: "GanttContainerZoomLevel"
					};
				}
			},
			layers: {
				"USER": true // enables personalization which is by default disabled
			}
		},
		"GanttContainerEnableTimeScrollSync": GanttFlexibilityUtils.fnChangeHandler("GanttContainerEnableTimeScrollSync"),
		"GanttContainerEnableCursorLine": GanttFlexibilityUtils.fnChangeHandler("GanttContainerEnableCursorLine"),
		"GanttContainerEnableNowLine": GanttFlexibilityUtils.fnChangeHandler("GanttContainerEnableNowLine"),
		"GanttContainerEnableVerticalLine": GanttFlexibilityUtils.fnChangeHandler("GanttContainerEnableVerticalLine"),
		"GanttContainerEnableAdhocLine": GanttFlexibilityUtils.fnChangeHandler("GanttContainerEnableAdhocLine"),
		"GanttContainerEnableDeltaLine": GanttFlexibilityUtils.fnChangeHandler("GanttContainerEnableDeltaLine"),
		"GanttContainerEnableNonWorkingTime": GanttFlexibilityUtils.fnChangeHandler("GanttContainerEnableNonWorkingTime"),
		"GanttContainerDisplayType": GanttFlexibilityUtils.fnChangeHandler("GanttContainerDisplayType"),
		"GanttContainerEnableStatusBar": GanttFlexibilityUtils.fnChangeHandler("GanttContainerEnableStatusBar"),
		"GanttContainerCustom": {
			"changeHandler": {
				applyChange: function (oChange, oControl, mPropertyBag) {
					oControl.getVariantHandler().apply(oChange, oControl, mPropertyBag);
					oControl.getToolbar().updateCustomSettingsConfig();
					return true;
				},
				revertChange: function (oChange, oControl, mPropertyBag) {
					oControl.getVariantHandler().revert(oChange, oControl, mPropertyBag);
					oControl.getToolbar().updateCustomSettingsConfig();
					return true;
				},
				completeChangeContent: function (oChange, oSpecificChangeInfo, mPropertyBag) {
					// Add dependent control to apply variant changes after control is initialized
					var sContainerID = mPropertyBag.appComponent.createId(oSpecificChangeInfo.selector.id);
					var aDependentControlList = sap.ui.getCore().byId(sContainerID).getVariantHandler().getDependantControlID();
					if (aDependentControlList.length > 0) {
						aDependentControlList.forEach(function(sID){
							oChange.addDependentControl(sID, sID.toUpperCase(), mPropertyBag);
						});
					}
					return;
				},
				getCondenserInfo : function(oChange) {
					return {
						affectedControl: oChange.getSelector(),
						classification: sap.ui.fl.condenser.Classification.LastOneWins,
						uniqueKey: "GanttContainerCustom"
					};
				}
			},
			layers: {
				"USER": true // enables personalization which is by default disabled
			}
		},
		"ganttChartContainerSettings": GanttFlexibilityUtils.fnCustomisationChangeHandler("ganttChartContainerSettings")
	};
}, /* bExport= */ true);
