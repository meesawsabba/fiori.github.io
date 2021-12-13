/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)
        (c) Copyright 2009-2021 SAP SE. All rights reserved
    
 */

sap.ui.define(
	["sap/fe/core/templating/FilterHelper", "sap/ui/core/format/NumberFormat", "sap/ui/mdc/condition/Condition", "sap/base/Log"],
	function(FilterHelper, NumberFormat, Condition, Log) {
		"use strict";
		return {
			/**
			 * Applies the median scale to the chart data.
			 *
			 * @param {object} oInteractiveChart InteractiveChart in the VisualFilter control
			 * @param {object} oView Instance of the view
			 * @param {object} sVFId VisualFilter control ID
			 * @param {string} sInfoPath Internal model context path to store info.
			 */
			applyMedianScaleToChartData: function(oInteractiveChart, oView, sVFId, sInfoPath) {
				var aAggregation;
				var oData = [];
				var sMeasure = oInteractiveChart.data("measure");
				var oInternalModelContext = oView.getBindingContext("internal");
				aAggregation =
					(oInteractiveChart.getPoints && oInteractiveChart.getPoints()) ||
					(oInteractiveChart.getBars && oInteractiveChart.getBars()) ||
					(oInteractiveChart.getSegments && oInteractiveChart.getSegments());
				for (var i = 0; i < aAggregation.length; i++) {
					oData.push(aAggregation[i].getBindingContext().getObject());
				}
				var scaleFactor = this._getMedianScaleFactor(oData, sMeasure);
				if (scaleFactor && scaleFactor.iShortRefNumber && scaleFactor.scale) {
					oInternalModelContext.setProperty("scalefactor/" + sInfoPath, scaleFactor.scale);
					oInternalModelContext.setProperty("scalefactorNumber/" + sInfoPath, scaleFactor.iShortRefNumber);
				} else {
					oInternalModelContext.setProperty("scalefactor/" + sInfoPath, "");
					oInternalModelContext.setProperty("scalefactorNumber/" + sInfoPath, "");
					var oScaleTitle = oView.byId(sVFId + "::ScaleUoMTitle");
					var oMeasureDimensionTitle = oView.byId(sVFId + "::MeasureDimensionTitle");
					var sText = oScaleTitle.getText();
					if (sText === " | ") {
						oScaleTitle.setVisible(false);
						oMeasureDimensionTitle.setTooltip(oMeasureDimensionTitle.getText());
					}
				}
			},

			/**
			 * Returns the median scale factor.
			 *
			 * @param {object} oData VisualFilter data
			 * @param {string} sMeasureField Path of the measure
			 * @returns {object} Object containing scale and iShortRefNumber
			 */
			_getMedianScaleFactor: function(oData, sMeasureField) {
				oData.sort(function(a, b) {
					if (Number(a[sMeasureField]) < Number(b[sMeasureField])) {
						return -1;
					}
					if (Number(a[sMeasureField]) > Number(b[sMeasureField])) {
						return 1;
					}
					return 0;
				});
				if (oData.length > 0) {
					// get median index
					var iMid = oData.length / 2, // get mid of array
						// if iMid is whole number, array length is even, calculate median
						// if iMid is not whole number, array length is odd, take median as iMid - 1
						iMedian =
							iMid % 1 === 0
								? (parseFloat(oData[iMid - 1][sMeasureField]) + parseFloat(oData[iMid][sMeasureField])) / 2
								: parseFloat(oData[Math.floor(iMid)][sMeasureField]),
						// get scale factor on median
						val = iMedian,
						scaleFactor;
					for (var i = 0; i < 14; i++) {
						scaleFactor = Math.pow(10, i);
						if (Math.round(Math.abs(val) / scaleFactor) < 10) {
							break;
						}
					}
				}

				var fixedInteger = NumberFormat.getIntegerInstance({
					style: "short",
					showScale: false,
					shortRefNumber: scaleFactor
				});

				// apply scale factor to other values and check
				for (var i = 0; i < oData.length; i++) {
					var aData = oData[i],
						sScaledValue = fixedInteger.format(aData[sMeasureField]),
						aScaledValueParts = sScaledValue.split(".");
					// if scaled value has only 0 before decimal or 0 after decimal (example: 0.02)
					// then ignore this scale factor else proceed with this scale factor
					// if scaled value divided by 1000 is >= 1000 then also ignore scale factor
					if (
						(!aScaledValueParts[1] && parseInt(aScaledValueParts[0], 10) === 0) ||
						(aScaledValueParts[1] && parseInt(aScaledValueParts[0], 10) === 0 && aScaledValueParts[1].indexOf("0") === 0) ||
						sScaledValue / 1000 >= 1000
					) {
						scaleFactor = undefined;
						break;
					}
				}
				return {
					iShortRefNumber: scaleFactor,
					scale: scaleFactor ? fixedInteger.getScale() : ""
				};
			},

			/**
			 * Returns the formatted number according to the rules of VisualChartFilters.
			 *
			 * @param {string | number} value Value which needs to be formatted
			 * @param {string} scaleFactor ScaleFactor to which the value needs to be scaled
			 * @param {number} numberOfFractionalDigits NumberOfFractionalDigits digits in the decimals according to scale
			 * @param {string} currency Currency code
			 * @returns {number} The formatted number
			 */
			getFormattedNumber: function(value, scaleFactor, numberOfFractionalDigits, currency) {
				value = typeof value === "string" ? Number(value.replace(/,/g, "")) : value;

				if (currency) {
					var currencyFormat = NumberFormat.getCurrencyInstance({
						showMeasure: false
					});
					return currencyFormat.format(parseFloat(value), currency);
					// parseFloat(value) is required otherwise -ve value are wrongly rounded off
					// Example: "-1.9" rounds off to -1 instead of -2. however -1.9 rounds off to -2
				} else if (scaleFactor) {
					var fixedInteger = NumberFormat.getFloatInstance({
						style: "short",
						showScale: false,
						shortRefNumber: scaleFactor,
						shortDecimals: numberOfFractionalDigits
					});
					return fixedInteger.format(parseFloat(value));
				} else {
					var fixedInteger = NumberFormat.getFloatInstance({
						decimals: numberOfFractionalDigits
					});
					return fixedInteger.format(parseFloat(value));
				}
			},

			/**
			 * Applies the UOM to the title of the visual filter control.
			 *
			 * @param {object} oInteractiveChart InteractiveChart in the VisualFilter control
			 * @param {object} oContextData Data of the VisualFilter
			 * @param {object} oView Instance of the view
			 * @param {string} sInfoPath Internal model context path to store info.
			 */
			applyUOMToTitle: function(oInteractiveChart, oContextData, oView, sInfoPath) {
				var vUOM = oInteractiveChart.data("uom"),
					sUOM;
				var sCurrency;
				if (vUOM && vUOM["ISOCurrency"]) {
					sUOM = vUOM["ISOCurrency"];
					sCurrency = sUOM.$Path ? oContextData[sUOM.$Path] : sUOM;
				} else if (vUOM && vUOM["Unit"]) {
					sUOM = vUOM["Unit"];
				}
				if (sUOM) {
					var sUOMValue = sUOM.$Path ? oContextData[sUOM.$Path] : sUOM;
					var oInternalModelContext = oView.getBindingContext("internal");
					oInternalModelContext.setProperty("uom/" + sInfoPath, sUOMValue);
					if (sCurrency) {
						oInternalModelContext.setProperty("currency/" + sInfoPath, sUOMValue);
					}
				}
			},
			/**
			 * Updates the scale factor in the title of the visual filter.
			 *
			 * @param {object} oInteractiveChart InteractiveChart in the VisualFilter control
			 * @param {object} oView Instance of the view
			 * @param {object} sVFId VisualFilter control ID
			 * @param {string} sInfoPath Internal model context path to store info.
			 */
			updateChartScaleFactorTitle: function(oInteractiveChart, oView, sVFId, sInfoPath) {
				if (!oInteractiveChart.data("scalefactor")) {
					this.applyMedianScaleToChartData(oInteractiveChart, oView, sVFId, sInfoPath);
				} else {
					var fixedInteger = NumberFormat.getIntegerInstance({
						style: "short",
						showScale: false,
						shortRefNumber: oInteractiveChart.data("scalefactor")
					});
					var oInternalModelContext = oView.getBindingContext("internal");
					oInternalModelContext.setProperty("scalefactor/" + sInfoPath, fixedInteger.getScale());
				}
			},

			/**
			 *
			 * @param {string} s18nMessageTitle Text of the error message title.
			 * @param {string} s18nMessage Text of the error message description.
			 * @param {string} sInfoPath Internal model context path to store info.
			 * @param {object} oView Instance of the view.
			 */
			applyErrorMessageAndTitle: function(s18nMessageTitle, s18nMessage, sInfoPath, oView) {
				var oInternalModelContext = oView.getBindingContext("internal");
				oInternalModelContext.setProperty(sInfoPath, {});
				oInternalModelContext.setProperty(sInfoPath, {
					"errorMessageTitle": s18nMessageTitle,
					"errorMessage": s18nMessage,
					"showError": true
				});
			},
			/**
			 * Checks if multiple units are present.
			 *
			 * @param {object} oContexts Contexts of the VisualFilter
			 * @param {object} sUnitfield The path of the unit field
			 * @returns {boolean} Returns if multiple units are configured or not
			 */
			checkMulitUnit: function(oContexts, sUnitfield) {
				var aData = [];
				if (oContexts && sUnitfield) {
					for (var i = 0; i < oContexts.length; i++) {
						var aContextData = oContexts[i] && oContexts[i].getObject();
						aData.push(aContextData[sUnitfield]);
					}
				}
				return !!aData.reduce(function(data, key) {
					return data === key ? data : NaN;
				});
			},

			/**
			 * Sets an error message if multiple UOM are present.
			 *
			 * @param {object} oData Data of the VisualFilter control
			 * @param {object} oInteractiveChart InteractiveChart in the VisualFilter control
			 * @param {string} sInfoPath Internal model context path to store info.
			 * @param {string} oResourceBundle The resource bundle
			 * @param {string} oView Instance of the view
			 */
			setMultiUOMMessage: function(oData, oInteractiveChart, sInfoPath, oResourceBundle, oView) {
				var vUOM = oInteractiveChart.data("uom");
				var sIsCurrency = vUOM && vUOM["ISOCurrency"] && vUOM["ISOCurrency"].$Path;
				var sIsUnit = vUOM && vUOM["Unit"] && vUOM["Unit"].$Path;
				var sUnitfield = sIsCurrency || sIsUnit;
				var s18nMessageTitle, s18nMessage;
				if (sUnitfield) {
					if (!this.checkMulitUnit(oData, sUnitfield)) {
						if (sIsCurrency) {
							s18nMessageTitle = oResourceBundle.getText("M_VISUAL_FILTERS_ERROR_MESSAGE_TITLE");
							s18nMessage = oResourceBundle.getText("M_VISUAL_FILTERS_MULTIPLE_CURRENCY", sUnitfield);
							this.applyErrorMessageAndTitle(s18nMessageTitle, s18nMessage, sInfoPath, oView);
							Log.warning("Filter is set for multiple Currency for" + sUnitfield);
						} else if (sIsUnit) {
							s18nMessageTitle = oResourceBundle.getText("M_VISUAL_FILTERS_ERROR_MESSAGE_TITLE");
							s18nMessage = oResourceBundle.getText("M_VISUAL_FILTERS_MULTIPLE_UNIT", sUnitfield);
							this.applyErrorMessageAndTitle(s18nMessageTitle, s18nMessage, sInfoPath, oView);
							Log.warning("Filter is set for multiple UOMs for" + sUnitfield);
						}
					}
				}
			},

			/**
			 * Sets an error message if response data is empty.
			 *
			 * @param {string} sInfoPath Internal model context path to store info.
			 * @param {string} oResourceBundle The resource bundle
			 * @param {string} oView Instance of the view
			 */
			setNoDataMessage: function(sInfoPath, oResourceBundle, oView) {
				var s18nMessageTitle = oResourceBundle.getText("M_VISUAL_FILTERS_ERROR_MESSAGE_TITLE");
				var s18nMessage = oResourceBundle.getText("M_VISUAL_FILTER_NO_DATA_TEXT");
				this.applyErrorMessageAndTitle(s18nMessageTitle, s18nMessage, sInfoPath, oView);
			},
			convertFilterCondions: function(oFilterConditions) {
				var oConvertedConditions = {};
				Object.keys(oFilterConditions).forEach(function(sKey) {
					var aConvertedConditions = [];
					var aConditions = oFilterConditions[sKey];
					for (var i = 0; i < aConditions.length; i++) {
						var values = aConditions[i].value2 ? [aConditions[i].value1, aConditions[i].value2] : [aConditions[i].value1];
						aConvertedConditions.push(Condition.createCondition(aConditions[i].operator, values, null, null, "Validated"));
					}
					if (aConvertedConditions.length) {
						oConvertedConditions[sKey] = aConvertedConditions;
					}
				});
				return oConvertedConditions;
			},
			getCustomConditions: function(Range, oValidProperty, sPropertyName) {
				var value1, value2;
				if (oValidProperty.$Type === "Edm.DateTimeOffset") {
					value1 = this._parseDateTime(FilterHelper.getTypeCompliantValue(this._formatDateTime(Range.Low), oValidProperty.$Type));
					value2 = Range.High
						? this._parseDateTime(FilterHelper.getTypeCompliantValue(this._formatDateTime(Range.High), oValidProperty.$Type))
						: null;
				} else {
					value1 = Range.Low;
					value2 = Range.High ? Range.High : null;
				}
				return {
					operator: Range.Option ? FilterHelper.getOperator(Range.Option.$EnumMember || Range.Option) : null,
					value1: value1,
					value2: value2,
					path: sPropertyName
				};
			},
			_parseDateTime: function(sValue) {
				return this._getDateTimeTypeInstance().parseValue(sValue, "string");
			},
			_formatDateTime: function(sValue) {
				return this._getDateTimeTypeInstance().formatValue(sValue, "string");
			},
			_getDateTimeTypeInstance: function() {
				return new sap.ui.model.odata.type.DateTimeOffset(
					{ pattern: "yyyy-MM-ddTHH:mm:ssZ", calendarType: "Gregorian" },
					{ V4: true }
				);
			}
		};
	}
);
