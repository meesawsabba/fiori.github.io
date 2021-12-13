/*!
 * SAPUI5
 * (c) Copyright 2009-2021 SAP SE. All rights reserved.
 */

sap.ui.define([
	"sap/ui/fl/changeHandler/Base",
	"sap/ui/comp/smartform/flexibility/changes/RenameField"
], function(
	Base,
	RenameField
) {
	"use strict";

	/**
	 * Change handler for combining smart form group elements (representing one or more fields).
	 *
	 * @alias sap.ui.comp.smartform.flexibility.changes.CombineFields
	 * @author SAP SE
	 * @version 1.96.0
	 * @experimental Since 1.46
	 */
	var CombineFields = { };

	CombineFields._evaluateElementForIndex = function(oModifier, aGroupElements) {
		var iMandatoryField = -1;

		return aGroupElements.reduce(function (previousPromise, oGroupElement) {
			return previousPromise
				.then(oModifier.getAggregation.bind(oModifier, oGroupElement, "fields"))
				.then(function (aSingleFields) {
					return Promise.all(aSingleFields.map(function (oSingleField) {
						iMandatoryField++;
						return oModifier.getProperty(oSingleField, "mandatory");
					}));
				});
		}, Promise.resolve())

		.then(function (bMandatory) {
			return bMandatory ? iMandatoryField : -1;
		});
	};

	/**
	 * Gets label property on a passed GroupElement.
	 * If this logic changes, also adapt the CombineFields change handler!
	 *
	 * @param {sap.ui.core.Control|Element} oControl Control that matches the change selector for reverting the change
	 * @param {sap.ui.core.util.reflection.BaseTreeModifier} oModifier - modifier for the controls
	 * @param {string} sPropertyName - Label property name
	 * @returns {Promise<string>} sPrevious - Previously set value
	 * @private
	 */
	CombineFields._getPreviousLabelPropertyOnControl = function(oControl, oModifier, sPropertyName) {
		return Promise.resolve()
		.then(oModifier.getProperty.bind(oModifier, oControl, sPropertyName))
		.then(function (vLabel) {
			if (vLabel && (typeof vLabel !== "string")) {
				sPropertyName = "text";
				oControl = vLabel;
			}

			return oModifier.getPropertyBindingOrProperty(oControl, sPropertyName);
		})
		.then(function (sPrevious) {
			return sPrevious ? sPrevious : "$$Handled_Internally$$";
		});
	};

	function combineSingleFields(oGroupElement, oSourceControl, oModifier, oView, i, aSingleFields) {
		if (oGroupElement !== oSourceControl) {
			var oParent = oModifier.getParent(oGroupElement);
			return aSingleFields.reduce(function (previousFieldsPromise, oSingleField, k) {
				return previousFieldsPromise
					.then(oModifier.removeAggregation.bind(oModifier, oGroupElement, "elements", oSingleField))
					.then(oModifier.insertAggregation.bind(oModifier, oSourceControl, "elements", oSingleField, i + k, oView));
			}, Promise.resolve())
			.then(oModifier.removeAggregation.bind(oModifier, oParent, "groupElements", oGroupElement))
			// The removed GroupElement must be destroyed when the app is closed, therefore it must be
			// placed in another aggregation (the "dependents" aggregation is invisible)
			.then(oModifier.insertAggregation.bind(oModifier, oParent, "dependents", oGroupElement, 0, oView));
		}
		return Promise.resolve();
	}

	/**
	 * Combines content from other smart group elements into the selected group element
	 *
	 * @param {sap.ui.fl.Change} oChange change wrapper object with instructions to be applied on the control map
	 * @param {sap.ui.comp.smartform.SmartForm|Element} oControl smartform control that matches the change selector for applying the change
	 * @param {object} mPropertyBag - map of properties
	 * @param {sap.ui.core.util.reflection.BaseTreeModifier} mPropertyBag.modifier - modifier for the controls
	 * @param {sap.ui.core.UIComponent} mPropertyBag.appComponent - component in which the change should be applied
	 * @param {object} mPropertyBag.view - view object or xml element representing an ui5 view
	 * @return {Promise} Resolving when fields are combined
	 * @public
	 */
	CombineFields.applyChange = function(oChange, oControl, mPropertyBag) {
		var oChangeDefinition = oChange.getDefinition();
		var oModifier = mPropertyBag.modifier;
		var oAppComponent = mPropertyBag.appComponent;
		var oView =  mPropertyBag.view;
		var oSourceControl = oModifier.bySelector(oChangeDefinition.content.sourceSelector, oAppComponent, oView);
		var aLabelText = [];
		var sPreviousLabel;
		var oText;
		var mRevertData;


		var aGroupElements = oChangeDefinition.content.combineFieldSelectors.map(function (oCombineFieldSelector) {
			return oModifier.bySelector(oCombineFieldSelector, oAppComponent, oView);
		});

		return this._collectRevertDataForElements(oModifier, aGroupElements, oAppComponent)
		.then(function (mCollectedData) {
			mRevertData = mCollectedData;
			return this._evaluateElementForIndex(oModifier, aGroupElements);
		}.bind(this))
		.then(function (iMandatoryFieldIndex) {
			if (iMandatoryFieldIndex > 0) {
				oModifier.setProperty(oSourceControl, "elementForLabel", iMandatoryFieldIndex);
			}
			var bIsRtl = sap.ui.getCore().getConfiguration().getRTL();
			return aGroupElements.reduce(function (previousPromise, oGroupElement, i) {
				return previousPromise.then(function () {
					var sLabel = "fieldLabel" + i.toString();
					oText = oChangeDefinition.texts[sLabel];
					if (oText && oText.value !== sPreviousLabel && oText.value.length > 0) {
						bIsRtl ? aLabelText.unshift(oText.value) : aLabelText.push(oText.value);
						sPreviousLabel = oText.value;
					}

					return oModifier.getAggregation(oGroupElement, "elements");
				})
				.then(function (aSingleFields) {
					return combineSingleFields(oGroupElement, oSourceControl, oModifier, oView, i, aSingleFields);
				});
			}, Promise.resolve());
		})
		.then(function () {
			// This is effectively a rename on a GroupElement, so the logic has to be as complex as in the rename change handler
			// -> If this logic changes in the rename change handler, adapt here as well! (and vice-versa)
			return RenameField.setLabelPropertyOnControl(oSourceControl, aLabelText.join("/"), oModifier, "label");
		})
		.then(function () {
			oChange.setRevertData(mRevertData);
		});
	};

	CombineFields._collectRevertDataForElements = function(oModifier, aGroupElements, oAppComponent){
		var mRevertData = {
			elementStates : []
		};

		var iFieldIndex = 0;
		var iLastFieldIndex = 0;

		return Promise.all(aGroupElements.map(function (oElement) {
			var oParent = oModifier.getParent(oElement);
			return Promise.all([
				oModifier.getAggregation(oElement, "elements"),
				oModifier.getAggregation(oParent, "groupElements"),
				this._getPreviousLabelPropertyOnControl(oElement, oModifier, "label"),
				oModifier.getProperty(oElement, "elementForLabel")
			])
			.then(function (aReturnValues) {
				iLastFieldIndex = iFieldIndex + aReturnValues[0].length - 1;

				// Save the fields' indices because we can't ensure that they will have stable ids
				// GroupElement1 = fields 0 to 1; GroupElement2 = fields 2 to 3; etc...
				mRevertData.elementStates.push({
					groupElementSelector: oModifier.getSelector(oModifier.getId(oElement), oAppComponent),
					parentSelector : oModifier.getSelector(oModifier.getId(oParent), oAppComponent),
					groupElementIndex : aReturnValues[1].indexOf(oElement),
					firstFieldIndex : iFieldIndex,
					lastFieldIndex: iLastFieldIndex,
					label: aReturnValues[2],
					elementForLabel: aReturnValues[3]
				});

				iFieldIndex = iLastFieldIndex + 1;
			});
		}.bind(this)))
		.then(function () {
			return mRevertData;
		});
	};

	/**
	 * Reverts applied change
	 *
	 * @param {sap.ui.fl.Change} oChange change wrapper object with instructions to be applied on the control map
	 * @param {sap.ui.comp.smartform.SmartForm} oSmartForm - SmartForm that matches the change selector for applying the change
	 * @param {object} mPropertyBag - Property bag containing the modifier and the view
	 * @param {object} mPropertyBag.modifier - modifier for the controls
	 * @param {object} mPropertyBag.view - application view
	 * @return {Promise} Resolves if successful
	 * @public
	 */
	CombineFields.revertChange = function(oChange, oSmartForm, mPropertyBag){
		var mRevertData = oChange.getRevertData();
		var oModifier = mPropertyBag.modifier;
		var oAppComponent = mPropertyBag.appComponent;
		var aFields = [];

		return mRevertData.elementStates.reduce(function (previousPromise, mElementState) {
			var oParent = mPropertyBag.modifier.bySelector(mElementState.parentSelector, oAppComponent);
			var oGroupElement = mPropertyBag.modifier.bySelector(mElementState.groupElementSelector, oAppComponent);
			return previousPromise
				.then(oModifier.getAggregation.bind(oModifier, oParent, "groupElements"))
				.then(function (oAggregation) {
					if (oAggregation.indexOf(oGroupElement) === -1) {
						// Removed group elements are placed in the "dependents" aggregation, so here they must be cleaned up
						return Promise.resolve()
							.then(oModifier.removeAggregation.bind(oModifier, oParent, "dependents", oGroupElement))
							.then(oModifier.insertAggregation.bind(oModifier, oParent, "groupElements", oGroupElement, mElementState.groupElementIndex));
					} else {
						// Collect all fields and remove them from the combined groupelement
						return Promise.resolve()
							.then(oModifier.getAggregation.bind(oModifier, oGroupElement, "elements"))
							.then(function (aReturnedFields) {
								aFields = aReturnedFields;
								return oModifier.removeAllAggregation(oGroupElement, "elements");
							});
					}
				});
		}, Promise.resolve())

		.then(function () {
			return mRevertData.elementStates.reduce(function(previousPromise, mElementState) {
				var oGroupElement;
				var sPreviousLabel;
				return previousPromise.then(function () {
					oGroupElement = oModifier.bySelector(mElementState.groupElementSelector, oAppComponent);
					var aInsertAggregationPromises = [];
					for (var i = mElementState.firstFieldIndex; i <= mElementState.lastFieldIndex; i++){
						// add the current field to the end of the aggregation
						aInsertAggregationPromises.push(oModifier.insertAggregation(oGroupElement, "elements", aFields[i], aFields.length));
					}
					return Promise.all(aInsertAggregationPromises);
				})
				.then(function () {
					// Label handling - if originally the label was set by a smartfield, this has to be the case after the revert as well
					// -> Set the label property to "undefined" + set the proper elementForLabel = SmartField will set the label
					sPreviousLabel = mElementState.label;
					if (sPreviousLabel === "$$Handled_Internally$$") {
						sPreviousLabel = undefined;
						return oModifier.getAggregation(oGroupElement, "fields");
					}
				})
				.then(function (aAggregations) {
					if (aAggregations && aAggregations.length) {
						var oElementForLabel = aAggregations[mElementState.elementForLabel];
						oModifier.setProperty(oElementForLabel, "textLabel", undefined);
					}
					oModifier.setProperty(oGroupElement, "elementForLabel", mElementState.elementForLabel);
					return RenameField.setLabelPropertyOnControl(oGroupElement, sPreviousLabel, oModifier, "label");
				});
			}, Promise.resolve());
		})

		.then(oChange.resetRevertData.bind(oChange));
	};

	/**
	 * Completes the change by adding change handler specific content
	 *
	 * @param {sap.ui.fl.Change} oChange change wrapper object to be completed
	 * @param {object} oSpecificChangeInfo - specific info object
	 * @param {object} oSpecificChangeInfo.combineElementIds ids of selected fields
	 *                                                     to be combined
	 * @param {object} mPropertyBag - map of properties
	 * @param {object} mPropertyBag.modifier - modifier for the controls
	 *
	 * @public
	 */
	CombineFields.completeChangeContent = function(oChange, oSpecificChangeInfo, mPropertyBag) {
		var oModifier = mPropertyBag.modifier;
		var oView = mPropertyBag.view;
		var oAppComponent = mPropertyBag.appComponent;
		var oChangeDefinition = oChange.getDefinition();

		var aCombineFieldIds = oSpecificChangeInfo.combineElementIds;
		if (aCombineFieldIds && aCombineFieldIds.length >= 2) {
			oChangeDefinition.content.combineFieldSelectors = aCombineFieldIds.map(function(sCombineFieldId) {
				return oModifier.getSelector(sCombineFieldId, oAppComponent);
			});
			oChange.addDependentControl(aCombineFieldIds, "combinedFields", mPropertyBag);
		} else {
			throw new Error("oSpecificChangeInfo.combineElementIds attribute required");
		}

		if (oSpecificChangeInfo.sourceControlId) {
			oChangeDefinition.content.sourceSelector = oModifier.getSelector(oSpecificChangeInfo.sourceControlId, oAppComponent);
			oChange.addDependentControl(oSpecificChangeInfo.sourceControlId, "sourceControl", mPropertyBag);
		} else {
			throw new Error("oSpecificChangeInfo.sourceControlId attribute required");
		}

		var sText;
		var sFieldLabel;
		var oGroupElement;
		for (var i = 0; i < oChangeDefinition.content.combineFieldSelectors.length; i++) {
			var mSelector = oChangeDefinition.content.combineFieldSelectors[i];
			oGroupElement = oModifier.bySelector(mSelector, oAppComponent, oView);
			sText = oGroupElement.getLabelText();
			if (sText) {
				sFieldLabel = "fieldLabel" + i;
				Base.setTextInChange(oChangeDefinition, sFieldLabel, sText, "XFLD");
			}
		}
	};

	CombineFields.getChangeVisualizationInfo = function(oChange) {
		return {
			affectedControls: [oChange.getDefinition().content.sourceSelector]
		};
	};

	return CombineFields;
},
/* bExport= */true);
