/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)
        (c) Copyright 2009-2021 SAP SE. All rights reserved
    
 */
sap.ui.define(
	["sap/fe/macros/CommonHelper", "sap/base/Log", "sap/m/library"],
	function(CommonHelper, Log, mobilelibrary) {
		"use strict";

		/**
		 * Helper class used by MDC controls for OData(V4) specific handling
		 *
		 * @private
		 * @experimental This module is only for internal/experimental use!
		 */
		var ValueColor = mobilelibrary.ValueColor;

		var MicroChartHelper = {
			/**
			 * This function returns the Threshold Color for bullet micro chart.
			 *
			 * @param {string} sValue Threshold value provided in the annotations
			 * @param {object} iContext InterfaceContext with path to the threshold
			 * @returns {string} The indicator for Threshold Color
			 */
			getThresholdColor: function(sValue, iContext) {
				var oContext = iContext.context;
				var sPath = oContext.getPath();
				var sThresholdColor = ValueColor.Neutral;

				if (sPath.indexOf("DeviationRange") > -1) {
					sThresholdColor = ValueColor.Error;
				} else if (sPath.indexOf("ToleranceRange") > -1) {
					sThresholdColor = ValueColor.Critical;
				}
				return sThresholdColor;
			},

			/**
			 * To fetch measures from DataPoints.
			 *
			 * @param {object} oChartAnnotations Chart Annotations
			 * @param {object} oEntityTypeAnnotations EntityType Annotations
			 * @param {string} sChartType Chart Type used
			 * @returns {string} Containing all measures.
			 * @private
			 */
			getMeasurePropertyPaths: function(oChartAnnotations, oEntityTypeAnnotations, sChartType) {
				var aPropertyPath = [];

				if (!oEntityTypeAnnotations) {
					Log.warning("FE:Macro:MicroChart : Couldn't find annotations for the DataPoint.");
					return;
				}

				oChartAnnotations.Measures.forEach(function(sMeasure, iMeasure) {
					var iMeasureAttribute = CommonHelper.getMeasureAttributeIndex(iMeasure, oChartAnnotations),
						oMeasureAttribute =
							iMeasureAttribute > -1 &&
							oChartAnnotations.MeasureAttributes &&
							oChartAnnotations.MeasureAttributes[iMeasureAttribute],
						oDataPoint =
							oMeasureAttribute &&
							oEntityTypeAnnotations &&
							oEntityTypeAnnotations[oMeasureAttribute.DataPoint.$AnnotationPath];
					if (oDataPoint && oDataPoint.Value && oDataPoint.Value.$Path) {
						aPropertyPath.push(oDataPoint.Value.$Path);
					} else {
						Log.warning(
							"FE:Macro:MicroChart : Couldn't find DataPoint(Value) measure for the measureAttribute " +
								sChartType +
								" MicroChart."
						);
					}
				});

				return aPropertyPath.join(",");
			},

			/**
			 * This function returns the visible expression path.
			 *
			 * @returns {string} Expression Binding for the visible.
			 */
			getHiddenPathExpression: function() {
				if (!arguments[0] && !arguments[1]) {
					return true;
				} else if (arguments[0] === true || arguments[1] === true) {
					return false;
				} else {
					var hiddenPaths = [];
					[].forEach.call(arguments, function(hiddenProperty) {
						if (hiddenProperty && hiddenProperty.$Path) {
							hiddenPaths.push("%{" + hiddenProperty.$Path + "}");
						}
					});
					return "{= " + hiddenPaths.join(" || ") + " === true ? false : true }";
				}
			},

			/**
			 * This function returns the true/false to display chart.
			 *
			 * @param {object} chartType The chart type
			 * @param {object} sValue Datapoint value of Value
			 * @param {object} sMaxValue Datapoint value of MaximumValue
			 * @param {object|boolean} sValueHidden Hidden path object/boolean value for the referrenced property of value
			 * @param {object|boolean} sMaxValueHidden Hidden path object/boolean value for the referrenced property of MaxValue
			 * @returns {boolean} `true` or `false` to hide/show chart
			 */
			isNotAlwaysHidden: function(chartType, sValue, sMaxValue, sValueHidden, sMaxValueHidden) {
				if (sValueHidden === true) {
					this.logError(chartType, sValue);
				}
				if (sMaxValueHidden === true) {
					this.logError(chartType, sMaxValue);
				}
				if (sValueHidden === undefined && sMaxValueHidden === undefined) {
					return true;
				} else {
					return ((!sValueHidden || sValueHidden.$Path) && sValueHidden !== undefined) ||
						((!sMaxValueHidden || sMaxValueHidden.$Path) && sMaxValueHidden !== undefined)
						? true
						: false;
				}
			},

			/**
			 * This function is to log errors for missing datapoint properties.
			 *
			 * @param {string} chartType The chart type.
			 * @param {object} sValue Dynamic hidden property name.
			 */
			logError: function(chartType, sValue) {
				Log.error("Measure Property " + sValue.$Path + " is hidden for the " + chartType + " Micro Chart");
			},

			/**
			 * This function returns the formatted value with scale factor for the value displayed.
			 *
			 * @param {string} sPath Propertypath for the value
			 * @param {object} oProperty The Property for constraints
			 * @param {Integer} iFractionDigits No. of fraction digits specified from annotations
			 * @returns {string} Expression Binding for the value with scale.
			 */
			formatDecimal: function(sPath, oProperty, iFractionDigits) {
				var aConstraints = [],
					aFormatOptions = ["style: 'short'"],
					sScale = iFractionDigits || (oProperty && oProperty.$Scale) || 1,
					sBinding;

				if (sPath) {
					if (oProperty.$Nullable != undefined) {
						aConstraints.push("nullable: " + oProperty.$Nullable);
					}
					if (oProperty.$Precision != undefined) {
						aFormatOptions.push("precision: " + (oProperty.$Precision ? oProperty.$Precision : "1"));
					}
					aConstraints.push("scale: " + (sScale === "variable" ? "'" + sScale + "'" : sScale));

					sBinding =
						"{ path: '" +
						sPath +
						"'" +
						", type: 'sap.ui.model.odata.type.Decimal', constraints: { " +
						aConstraints.join(",") +
						" }, formatOptions: { " +
						aFormatOptions.join(",") +
						" } }";
				}
				return sBinding;
			},

			/**
			 * To fetch select parameters from annotations that need to be added to the list binding
			 *
			 * param {string} sGroupId groupId to be used(optional)
			 * param {string} sUoMPath unit of measure path
			 * param {string} oCriticality criticality for the chart
			 * param {object} oCC criticality calculation object conatining the paths.
			 * @returns {string} String containing all the propertypaths needed to be added to the $select query of the listbinding.
			 * @private
			 */
			getSelectParameters: function() {
				var aPropertyPath = [],
					oCC = arguments[1],
					aParameters = [];

				if (arguments[0]) {
					aParameters.push("$$groupId : '" + arguments[0] + "'");
				}
				if (arguments[2]) {
					aPropertyPath.push(arguments[2]);
				} else if (oCC) {
					for (var k in oCC) {
						if (!oCC[k].$EnumMember && oCC[k].$Path) {
							aPropertyPath.push(oCC[k].$Path);
						}
					}
				}

				for (var i = 3; i < arguments.length; i++) {
					if (arguments[i]) {
						aPropertyPath.push(arguments[i]);
					}
				}

				if (aPropertyPath.length) {
					aParameters.push("$select : '" + aPropertyPath.join(",") + "'");
				}

				return aParameters.join(",");
			},

			/**
			 * To fetch DataPoint Qualifiers of measures.
			 *
			 * @param {object} oChartAnnotations Chart Annotations
			 * @param {object} oEntityTypeAnnotations EntityType Annotations
			 * @param {string} sChartType Chart Type used
			 * @returns {string} Containing all Datapoint Qualifiers.
			 * @private
			 */
			getDataPointQualifiersForMeasures: function(oChartAnnotations, oEntityTypeAnnotations, sChartType) {
				var aQualifers = [],
					aMeasureAttributes = oChartAnnotations.MeasureAttributes,
					fnAddDataPointQualifier = function(oMeasure) {
						var sMeasure = oMeasure.$PropertyPath,
							sQualifer;
						aMeasureAttributes.forEach(function(oMeasureAttribute) {
							if (
								oEntityTypeAnnotations &&
								(oMeasureAttribute && oMeasureAttribute.Measure && oMeasureAttribute.Measure.$PropertyPath) === sMeasure &&
								oMeasureAttribute.DataPoint &&
								oMeasureAttribute.DataPoint.$AnnotationPath
							) {
								var sAnnotationPath = oMeasureAttribute.DataPoint.$AnnotationPath;
								if (oEntityTypeAnnotations[sAnnotationPath]) {
									sQualifer = sAnnotationPath.indexOf("#") ? sAnnotationPath.split("#")[1] : "";
									aQualifers.push(sQualifer);
								}
							}
						});
						if (sQualifer === undefined) {
							Log.warning(
								"FE:Macro:MicroChart : Couldn't find DataPoint(Value) measure for the measureAttribute for " +
									sChartType +
									" MicroChart."
							);
						}
					};

				if (!oEntityTypeAnnotations) {
					Log.warning("FE:Macro:MicroChart : Couldn't find annotations for the DataPoint " + sChartType + " MicroChart.");
				}
				oChartAnnotations.Measures.forEach(fnAddDataPointQualifier);
				return aQualifers.join(",");
			},

			/**
			 * This function is to log warnings for missing datapoint properties.
			 * @param {string} sChart The Chart type.
			 * @param {object} oError Object with properties from DataPoint.
			 */
			logWarning: function(sChart, oError) {
				for (var sKey in oError) {
					var sValue = oError[sKey];
					if (!sValue) {
						Log.warning(sKey + " parameter is missing for the " + sChart + " Micro Chart");
					}
				}
			},

			/**
			 * This function is used to get DisplayValue for comparison micro chart data aggregation.
			 * @param {object} oDataPoint Data point object.
			 * @param {object} oPathText Object after evaluating @com.sap.vocabularies.Common.v1.Text annotation
			 * @param {object} oValueTextPath Evaluation of @com.sap.vocabularies.Common.v1.Text/$Path/$ value of the annotation
			 * @param {object} oValueDataPointPath DataPoint>Value/$Path/$ value after evaluating annotation
			 * @returns {string} Expression binding for Display Value for comparison micro chart's aggregation data.
			 */
			getDisplayValueForMicroChart: function(oDataPoint, oPathText, oValueTextPath, oValueDataPointPath) {
				var sValueFormat = oDataPoint.ValueFormat && oDataPoint.ValueFormat.NumberOfFractionalDigits,
					sResult;
				if (oPathText) {
					sResult = MicroChartHelper.formatDecimal(oPathText["$Path"], oValueTextPath, sValueFormat);
				} else {
					sResult = MicroChartHelper.formatDecimal(oDataPoint.Value["$Path"], oValueDataPointPath, sValueFormat);
				}
				return sResult;
			},
			/**
			 * This function is used to check whether micro chart is enabled or not by checking properties, chart annotations, hidden properties.
			 * @param {string} sChartType MicroChart Type eg:- Bullet.
			 * @param {object} oDataPoint Data point object.
			 * @param {object} oDataPointValue Object with $Path annotation to get hidden value path
			 * @param {object} oChartAnnotations ChartAnnotation object
			 * @param {object} oDatapointMaxValue Object with $Path annotation to get hidden max value path
			 * @returns {boolean} `true` if the chart has all values and properties and also it is not always hidden sFinalDataPointValue && bMicrochartVisible.
			 */
			shouldMicroChartRender: function(sChartType, oDataPoint, oDataPointValue, oChartAnnotations, oDatapointMaxValue) {
				var aChartTypes = ["Area", "Column", "Comparison"],
					sDataPointValue = oDataPoint && oDataPoint.Value,
					sHiddenPath = oDataPointValue && oDataPointValue["com.sap.vocabularies.UI.v1.Hidden"],
					sChartAnnotationDimension = oChartAnnotations && oChartAnnotations.Dimensions && oChartAnnotations.Dimensions[0],
					oFinalDataPointValue =
						aChartTypes.indexOf(sChartType) > -1 ? sDataPointValue && sChartAnnotationDimension : sDataPointValue; // only for three charts in array
				if (sChartType === "Harvey") {
					var oDataPointMaximumValue = oDataPoint && oDataPoint.MaximumValue,
						sMaxValueHiddenPath = oDatapointMaxValue && oDatapointMaxValue["com.sap.vocabularies.UI.v1.Hidden"];
					return (
						sDataPointValue &&
						oDataPointMaximumValue &&
						MicroChartHelper.isNotAlwaysHidden(
							"Bullet",
							sDataPointValue,
							oDataPointMaximumValue,
							sHiddenPath,
							sMaxValueHiddenPath
						)
					);
				}
				return oFinalDataPointValue && MicroChartHelper.isNotAlwaysHidden(sChartType, sDataPointValue, undefined, sHiddenPath);
			},
			/**
			 * This function is used to get dataPointQualifiers for Column, Comparison and StackedBar micro charts.
			 *
			 * @param {string} sUiName
			 * @returns {*} Result string or undefined.
			 */
			getdataPointQualifiersForMicroChart: function(sUiName) {
				if (sUiName.indexOf("com.sap.vocabularies.UI.v1.DataPoint") === -1) {
					return undefined;
				}
				if (sUiName.indexOf("#") > -1) {
					return sUiName.split("#")[1];
				}
				return "";
			},
			/**
			 * This function is used to get colorPalette for comparison and HarveyBall Microcharts.
			 *
			 * @param {object} oDataPoint Data point object.
			 * @returns {*} Result string for colorPalette or undefined.
			 */
			getcolorPaletteForMicroChart: function(oDataPoint) {
				return oDataPoint.Criticality
					? undefined
					: "sapUiChartPaletteQualitativeHue1, sapUiChartPaletteQualitativeHue2, sapUiChartPaletteQualitativeHue3,          sapUiChartPaletteQualitativeHue4, sapUiChartPaletteQualitativeHue5, sapUiChartPaletteQualitativeHue6, sapUiChartPaletteQualitativeHue7,          sapUiChartPaletteQualitativeHue8, sapUiChartPaletteQualitativeHue9, sapUiChartPaletteQualitativeHue10, sapUiChartPaletteQualitativeHue11";
			},
			/**
			 * This function is used to get MeasureScale for Area, Column and Line micro charts.
			 *
			 * @param {object} oDataPoint Data point object.
			 * @returns {number} Datapoint valueformat or datapoint scale or 1.
			 */
			getMeasureScaleForMicroChart: function(oDataPoint) {
				if (oDataPoint.ValueFormat && oDataPoint.ValueFormat.NumberOfFractionalDigits) {
					return oDataPoint.ValueFormat.NumberOfFractionalDigits;
				}
				if (oDataPoint.Value && oDataPoint.Value["$Path"] && oDataPoint.Value["$Path"]["$Scale"]) {
					return oDataPoint.Value["$Path"]["$Scale"];
				}
				return 1;
			},
			/**
			 * This function is to return the binding expression of microchart.
			 *
			 * @param {string} sChartType The type of micro chart (Bullet, Radial etc.)
			 * @param {object} oMeasure Measure value for micro chart.
			 * @param {object} oThis `this`/current model for micro chart.
			 * @param {object} oCollection Collection object.
			 * @param {string} sUiName The @sapui.name in collection model is not accessible here from model hence need to pass it.
			 * @param {object} oDataPoint Data point object used in case of Harvey Ball micro chart
			 * @returns {string} The binding expression for micro chart.
			 * @private
			 */
			getBindingExpressionForMicrochart: function(sChartType, oMeasure, oThis, oCollection, sUiName, oDataPoint) {
				var bCondition = oCollection["$isCollection"] || oCollection["$kind"] === "EntitySet",
					sPath = bCondition ? "" : sUiName,
					sCurrencyOrUnit = MicroChartHelper.getCurrencyOrUnit(oMeasure),
					sDataPointCriticallity = "";
				switch (sChartType) {
					case "Radial":
						sCurrencyOrUnit = "";
						break;
					case "Harvey":
						sDataPointCriticallity = oDataPoint.Criticality ? oDataPoint.Criticality["$Path"] : "";
						break;
				}
				var sFunctionValue = MicroChartHelper.getSelectParameters(oThis.batchGroupId, "", sDataPointCriticallity, sCurrencyOrUnit),
					sBinding = "{ path: '" + sPath + "'" + ", parameters : {" + sFunctionValue + "} }";
				return sBinding;
			},
			/**
			 * This function is to return the UOMPath expression of the micro chart.
			 *
			 * @param {boolean} bShowOnlyChart Whether only chart should be rendered or not.
			 * @param {object} oMeasure Measures for the micro chart.
			 * @returns {string} UOMPath String for the micro chart.
			 * @private
			 */
			getUOMPathForMicrochart: function(bShowOnlyChart, oMeasure) {
				var bResult;
				if (oMeasure && !bShowOnlyChart) {
					bResult =
						(oMeasure["@Org.OData.Measures.V1.ISOCurrency"] && oMeasure["@Org.OData.Measures.V1.ISOCurrency"].$Path) ||
						(oMeasure["@Org.OData.Measures.V1.Unit"] && oMeasure["@Org.OData.Measures.V1.Unit"].$Path);
				}
				return bResult ? bResult : "";
			},

			/**
			 * This function is to return the aggregation binding expression of micro chart.
			 *
			 * @param {string} sAggregationType Aggregation type of chart (eg:- Point for AreaMicrochart)
			 * @param {object} oCollection Collection object.
			 * @param {object} oDataPoint Data point info for micro chart.
			 * @param {string} sUiName The @sapui.name in collection model is not accessible here from model hence need to pass it.
			 * @param {object} oDimension Micro chart Dimensions.
			 * @param {object} oMeasure Measure value for micro chart.
			 * @param {string} sMeasureOrDimensionBar The measure or dimension passed specifically in case of bar chart
			 * @returns {string} Aggregation binding expression for micro chart.
			 * @private
			 */
			getAggregationForMicrochart: function(
				sAggregationType,
				oCollection,
				oDataPoint,
				sUiName,
				oDimension,
				oMeasure,
				sMeasureOrDimensionBar
			) {
				var sPath = oCollection["$kind"] === "EntitySet" ? "/" : "",
					sPath = sPath + sUiName,
					sGroupId = "",
					sDataPointCriticallityCalc = "",
					sDataPointCriticallity = oDataPoint.Criticality ? oDataPoint.Criticality["$Path"] : "",
					sCurrencyOrUnit = MicroChartHelper.getUOMPathForMicrochart(false, oMeasure),
					sTargetValuePath = "",
					sDimensionPropertyPath = "";
				if (oDimension && oDimension.$PropertyPath && oDimension.$PropertyPath["@com.sap.vocabularies.Common.v1.Text"]) {
					sDimensionPropertyPath = oDimension.$PropertyPath["@com.sap.vocabularies.Common.v1.Text"].$Path;
				} else {
					sDimensionPropertyPath = oDimension.$PropertyPath;
				}
				switch (sAggregationType) {
					case "Points":
						sDataPointCriticallityCalc = oDataPoint && oDataPoint.CriticalityCalculation;
						sTargetValuePath = oDataPoint && oDataPoint.TargetValue && oDataPoint.TargetValue["$Path"];
						sDataPointCriticallity = "";
						break;
					case "Columns":
						sDataPointCriticallityCalc = oDataPoint && oDataPoint.CriticalityCalculation;
						break;
					case "LinePoints":
						sDataPointCriticallity = "";
						break;
					case "Bars":
						sDimensionPropertyPath = "";
						break;
				}
				var sFunctionValue = MicroChartHelper.getSelectParameters(
						sGroupId,
						sDataPointCriticallityCalc,
						sDataPointCriticallity,
						sCurrencyOrUnit,
						sTargetValuePath,
						sDimensionPropertyPath,
						sMeasureOrDimensionBar
					),
					sAggregationExpression = "{path:'" + sPath + "'" + ", parameters : {" + sFunctionValue + "} }";
				return sAggregationExpression;
			},
			getCurrencyOrUnit: function(oMeasure) {
				if (oMeasure["@Org.OData.Measures.V1.ISOCurrency"]) {
					return oMeasure["@Org.OData.Measures.V1.ISOCurrency"].$Path || oMeasure["@Org.OData.Measures.V1.ISOCurrency"];
				} else if (oMeasure["@Org.OData.Measures.V1.Unit"]) {
					return oMeasure["@Org.OData.Measures.V1.Unit"].$Path || oMeasure["@Org.OData.Measures.V1.Unit"];
				} else {
					return "";
				}
			}
		};

		return MicroChartHelper;
	},
	/* bExport= */ true
);
