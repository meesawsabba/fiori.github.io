/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)
        (c) Copyright 2009-2021 SAP SE. All rights reserved
    
 */
sap.ui.define(
	[
		"sap/base/Log",
		"sap/ui/model/odata/v4/AnnotationHelper",
		"sap/fe/macros/CommonHelper",
		"sap/ui/core/format/NumberFormat",
		"sap/fe/macros/ResourceModel",
		"sap/fe/macros/ODataMetaModelUtil",
		"sap/fe/core/templating/FilterHelper",
		"sap/fe/core/templating/CriticalityFormatters",
		"sap/fe/macros/field/FieldTemplating",
		"sap/fe/core/controls/filterbar/utils/VisualFilterUtils",
		"sap/fe/core/helpers/StableIdHelper",
		"sap/ui/mdc/odata/v4/TypeUtil",
		"sap/fe/macros/filter/FilterFieldHelper",
		"sap/ui/model/odata/v4/ODataUtils",
		"sap/base/util/JSTokenizer",
		"sap/ui/mdc/condition/ConditionConverter",
		"sap/fe/core/CommonUtils"
	],
	function(
		Log,
		ODataModelAnnotationHelper,
		CommonHelper,
		NumberFormat,
		ResourceModel,
		ODataMetaModelUtil,
		FilterHelper,
		CriticalityFormatters,
		FieldTemplating,
		VisualFilterUtils,
		StableIdHelper,
		TypeUtil,
		FilterFieldHelper,
		ODataUtils,
		JSTokenizer,
		ConditionConverter,
		CommonUtils
	) {
		"use strict";

		var InteractiveChartHelper = {
			getChartDisplayedValue: function(value, oValueFormat, sMetaPath) {
				//var sType = "" + value + "@odata.type";
				var sInfoPath = StableIdHelper.generate([sMetaPath]);
				return (
					"{parts:[{path:'" +
					value +
					"',type:'sap.ui.model.odata.type.Decimal', constraints:{'nullable':false}}" +
					(oValueFormat && oValueFormat.ScaleFactor
						? ",{value:'" + oValueFormat.ScaleFactor.$Decimal + "'}"
						: ",{path:'internal>scalefactorNumber/" + sInfoPath + "'}") +
					(oValueFormat && oValueFormat.NumberOfFractionalDigits
						? ",{value:'" + oValueFormat.NumberOfFractionalDigits + "'}"
						: ",{value:'0'}") +
					",{path:'internal>currency/" +
					sInfoPath +
					"'}" +
					"], formatter:'VisualFilterRuntime.scaleVisualFilterValue'}"
				); //+ sType.split('#').length ? sType.split('#')[1] : 'Decimal' + "}";
			},
			getChartValue: function(oValue) {
				return "{path:'" + oValue + "',type:'sap.ui.model.odata.type.Decimal', constraints:{'nullable':false}}";
			},
			getChart: function(oMetaPath) {
				var oModel = oMetaPath.getModel();
				var oPresentationVariant = oModel.getObject(oMetaPath.getPath());
				var aVisualizations = oPresentationVariant.Visualizations;
				for (var i = 0; i < aVisualizations.length; i++) {
					if (aVisualizations[i].$AnnotationPath.indexOf("com.sap.vocabularies.UI.v1.Chart") > -1) {
						var sCollectionPath = ODataModelAnnotationHelper.getNavigationPath(oMetaPath.getPath());
						return oModel.createBindingContext(sCollectionPath + "/" + aVisualizations[i].$AnnotationPath);
					}
				}
				return undefined;
			},
			getChartLabel: function() {
				return arguments[2];
			},
			getAggregationBinding: function(
				oInterface,
				oChartAnnotations,
				oCollection,
				oTextAssociation,
				oDimensionType,
				aSortOrder,
				selectionVariantAnnotation,
				bCustomAggregate,
				oAggregation,
				bUoMHasCustomAggregate,
				aParameters,
				oFilterBarContext
			) {
				var oContextPath = oFilterBarContext.getProperty("contextPath");
				var sEntityType = oContextPath ? oContextPath.getPath() : "";
				var sDimension = oChartAnnotations.Dimensions[0].$PropertyPath;
				var sMeasure = oChartAnnotations.Measures[0].$PropertyPath,
					sBinding,
					sFilterExpression,
					aFilters = [],
					sAggregationExpression,
					sUOMExpression,
					sTextAssociationExpression,
					filterConditions,
					sBindingPath,
					entityTypeProperties;
				var sCollectionName =
					oCollection.$kind == "NavigationProperty"
						? oInterface.getPath(1)
						: (oCollection.$kind == "EntitySet" ? "/" : "") +
						  oInterface.getModel(1).getObject(oInterface.getPath(1) + "@sapui.name");
				var vUOM = InteractiveChartHelper.getUoM(
					oInterface,
					oChartAnnotations,
					oCollection,
					undefined,
					bCustomAggregate,
					oAggregation
				);
				var entitySetPath = oInterface.getInterface(1).getPath(),
					oMetaModel = oInterface.getInterface(1).getModel();
				if (selectionVariantAnnotation && selectionVariantAnnotation.getObject()) {
					var entityTypeProperties = oMetaModel.getObject(entitySetPath + "/");
					filterConditions = FilterHelper.getFiltersConditionsFromSelectionVariant(
						entityTypeProperties,
						selectionVariantAnnotation.getObject(),
						VisualFilterUtils.getCustomConditions.bind(VisualFilterUtils)
					);
					for (var sPath in filterConditions) {
						var aConditions = filterConditions[sPath];
						aConditions.forEach(function(oCondition) {
							if (!oCondition.isParameter) {
								aFilters.push(oCondition);
							}
						});
					}
				}
				if (sEntityType !== sCollectionName + "/" && aParameters && aParameters.length && filterConditions) {
					var aParams = [];
					var convertedFilterConditions = VisualFilterUtils.convertFilterCondions(filterConditions);
					var parameterProperties = CommonUtils.getParameterInfo(oMetaModel, sCollectionName).parameterProperties;
					for (var i = 0; i < aParameters.length; i++) {
						var oProperty = parameterProperties[aParameters[i]];
						var sEntityPath = entitySetPath.split("/")[1];
						var oPropertyContext = oMetaModel.createBindingContext("/" + sEntityPath + "/" + aParameters[i]);
						var oFormatOptions = JSTokenizer.parseJS(
							FilterFieldHelper.formatOptions(oProperty, { context: oPropertyContext }) || "{}"
						);
						var oConstraints = JSTokenizer.parseJS(
							FilterFieldHelper.constraints(oProperty, { context: oPropertyContext }) || "{}"
						);
						var typeConfig = TypeUtil.getTypeConfig(oProperty.$Type, oFormatOptions, oConstraints);
						var oCondition = convertedFilterConditions[aParameters[i]];
						var oConditionInternal = oCondition ? oCondition[0] : undefined;
						if (oConditionInternal) {
							var mInternalParameterCondition = ConditionConverter.toType(oConditionInternal, typeConfig, TypeUtil);
							var sEdmType = typeConfig.className;
							var sValue = encodeURIComponent(ODataUtils.formatLiteral(mInternalParameterCondition.values[0], sEdmType));
							sValue = sValue.replaceAll("'", "\\'");
							aParams.push(aParameters[i] + "=" + sValue);
						}
					}

					var sParameterEntitySet = sCollectionName.slice(0, sCollectionName.lastIndexOf("/"));
					var sTargetNavigation = sCollectionName.substring(sCollectionName.lastIndexOf("/") + 1);
					// create parameter context
					sBindingPath = sParameterEntitySet + "(" + aParams.toString() + ")/" + sTargetNavigation;
					sCollectionName = sBindingPath;
				}
				if (bCustomAggregate) {
					//custom aggregate for a currency or unit of measure corresponding to this aggregatable property
					if (bUoMHasCustomAggregate) {
						sAggregationExpression = vUOM && vUOM.$Path ? "{ 'unit' : '" + vUOM.$Path + "' }" : "{}";
						sUOMExpression = "";
					} else {
						sAggregationExpression = "{}";
						sUOMExpression = vUOM && vUOM.$Path ? ", '" + vUOM.$Path + "' : {}" : "";
					}
				} else if (
					oAggregation &&
					oAggregation.AggregatableProperty &&
					oAggregation.AggregatableProperty.value &&
					oAggregation.AggregationMethod
				) {
					sAggregationExpression =
						"{ 'name' : '" + oAggregation.AggregatableProperty.value + "', 'with' : '" + oAggregation.AggregationMethod + "'}";
					sUOMExpression = vUOM && vUOM.$Path ? ", '" + vUOM.$Path + "' : {}" : "";
				}
				sTextAssociationExpression = oTextAssociation ? "' : { 'additionally' : ['" + oTextAssociation.$Path + "'] }" : "' : { }";
				sFilterExpression = JSON.stringify(aFilters);
				sBinding =
					"{path: '" +
					sCollectionName +
					"', templateShareable: true, suspended : true, 'filters' : " +
					sFilterExpression +
					",'parameters' : {" +
					InteractiveChartHelper.getSortOrder(oChartAnnotations, oDimensionType, aSortOrder) +
					", '$$aggregation' : {'aggregate' : {'" +
					sMeasure +
					"' : " +
					sAggregationExpression +
					"},'group' : {'" +
					sDimension +
					sTextAssociationExpression +
					sUOMExpression +
					"} } }" +
					InteractiveChartHelper.getMaxItems(oChartAnnotations) +
					"}";
				return sBinding;
			},
			getSortOrder: function(oChartAnnotations, sDimensionType, aSortOrder) {
				if (
					oChartAnnotations.ChartType.$EnumMember === "com.sap.vocabularies.UI.v1.ChartType/Donut" ||
					oChartAnnotations.ChartType.$EnumMember === "com.sap.vocabularies.UI.v1.ChartType/Bar"
				) {
					if (
						aSortOrder &&
						aSortOrder.length &&
						aSortOrder[0].Property.$PropertyPath === oChartAnnotations.Measures[0].$PropertyPath
					) {
						return "'$orderby' : '" + aSortOrder[0].Property.$PropertyPath + (aSortOrder[0].Descending ? " desc'" : "'");
					} else {
						return "'$orderby' : '" + oChartAnnotations.Measures[0].$PropertyPath + " desc'";
					}
				} else {
					if (sDimensionType === "Edm.Date" || sDimensionType === "Edm.Time" || sDimensionType === "Edm.DateTimeOffset") {
						return "'$orderby' : '" + oChartAnnotations.Dimensions[0].$PropertyPath + "'";
					} else {
						if (
							aSortOrder &&
							aSortOrder.length &&
							aSortOrder[0].Property.$PropertyPath === oChartAnnotations.Dimensions[0].$PropertyPath
						) {
							return "'$orderby' : '" + aSortOrder[0].Property.$PropertyPath + (aSortOrder[0].Descending ? " desc'" : "'");
						} else {
							return "'$orderby' : '" + oChartAnnotations.Dimensions[0].$PropertyPath + "'";
						}
					}
				}
			},
			getMaxItems: function(oChartAnnotations) {
				if (oChartAnnotations.ChartType.$EnumMember === "com.sap.vocabularies.UI.v1.ChartType/Bar") {
					return ",'startIndex' : 0,'length' : 3";
				} else if (oChartAnnotations.ChartType.$EnumMember === "com.sap.vocabularies.UI.v1.ChartType/Line") {
					return ",'startIndex' : 0,'length' : 6";
				} else {
					return "";
				}
			},
			getColorBinding: function(iContext, oDataPoint, oDimension) {
				var oModel = iContext.getModel(0);
				var oDimensionPath = iContext.getPath(1);
				var aValueCriticality = oModel.getObject(oDimensionPath + "$PropertyPath@com.sap.vocabularies.UI.v1.ValueCriticality");
				oDataPoint = oDataPoint.targetObject;
				if (oDataPoint.Criticality) {
					return CriticalityFormatters.buildExpressionForCriticalityColorMicroChart(oDataPoint);
				} else if (oDataPoint.CriticalityCalculation) {
					var oDirection =
						oDataPoint.CriticalityCalculation.ImprovementDirection &&
						oDataPoint.CriticalityCalculation.ImprovementDirection.$EnumMember;
					var oDataPointValue = ODataModelAnnotationHelper.value(oDataPoint.Value, { context: iContext.getInterface(0) });
					var oDeviationRangeLowValue = ODataModelAnnotationHelper.value(
						oDataPoint.CriticalityCalculation.DeviationRangeLowValue,
						{ context: iContext.getInterface(0) }
					);
					var oToleranceRangeLowValue = ODataModelAnnotationHelper.value(
						oDataPoint.CriticalityCalculation.ToleranceRangeLowValue,
						{ context: iContext.getInterface(0) }
					);
					var oAcceptanceRangeLowValue = ODataModelAnnotationHelper.value(
						oDataPoint.CriticalityCalculation.AcceptanceRangeLowValue,
						{ context: iContext.getInterface(0) }
					);
					var oAcceptanceRangeHighValue = ODataModelAnnotationHelper.value(
						oDataPoint.CriticalityCalculation.AcceptanceRangeHighValue,
						{ context: iContext.getInterface(0) }
					);
					var oToleranceRangeHighValue = ODataModelAnnotationHelper.value(
						oDataPoint.CriticalityCalculation.ToleranceRangeHighValue,
						{ context: iContext.getInterface(0) }
					);
					var oDeviationRangeHighValue = ODataModelAnnotationHelper.value(
						oDataPoint.CriticalityCalculation.DeviationRangeHighValue,
						{ context: iContext.getInterface(0) }
					);
					return CommonHelper.getCriticalityCalculationBinding(
						oDirection,
						oDataPointValue,
						oDeviationRangeLowValue,
						oToleranceRangeLowValue,
						oAcceptanceRangeLowValue,
						oAcceptanceRangeHighValue,
						oToleranceRangeHighValue,
						oDeviationRangeHighValue
					);
				} else if (aValueCriticality.length) {
					return CommonHelper.getValueCriticality(oDimension.$PropertyPath, aValueCriticality);
				} else {
					return undefined;
				}
			},
			getScaleUoMTitle: function(
				oInterface,
				oChartAnnotation,
				oCollection,
				sMetaPath,
				bCustomAggregate,
				oAggregation,
				sSeperator,
				bIsToolTip
			) {
				var oModel = oInterface.getModel(0);
				var sScaleFactor = oModel.getObject(
					oInterface.getPath(0) + "/MeasureAttributes/0/DataPoint/$AnnotationPath/ValueFormat/ScaleFactor/$Decimal"
				);
				var sInfoPath = StableIdHelper.generate([sMetaPath]);
				var fixedInteger = NumberFormat.getIntegerInstance({
					style: "short",
					showScale: false,
					shortRefNumber: sScaleFactor
				});
				var sScale = fixedInteger.getScale();
				var vUOM = InteractiveChartHelper.getUoM(
					oInterface,
					oChartAnnotation,
					oCollection,
					undefined,
					bCustomAggregate,
					oAggregation
				);
				var sExpression;
				vUOM = vUOM && (vUOM.$Path ? "${internal>uom/" + sInfoPath + "}" : "'" + vUOM + "'");
				sScale = sScale ? "'" + sScale + "'" : "${internal>scalefactor/" + sInfoPath + "}";
				if (sSeperator) {
					sSeperator = sSeperator;
				} else {
					sSeperator = "|";
				}
				sSeperator = vUOM ? "' " + sSeperator + " ' + " : "";
				sExpression = sScale && vUOM ? sSeperator + sScale + " + ' ' + " + vUOM : sSeperator + (sScale || vUOM);
				return bIsToolTip ? sExpression : "{= " + sExpression + "}";
			},
			getMeasureDimensionTitle: function(oInterface, oChartAnnotation, oCollection, bCustomAggregate, oAggregation) {
				var oModel = oInterface.getModel(0);
				var sMeasureLabel;
				var sMeasurePath = oModel.getObject(oInterface.getPath(0) + "/Measures/0/$PropertyPath");
				var sDimensionPath = oModel.getObject(oInterface.getPath(0) + "/Dimensions/0/$PropertyPath");
				var sDimensionLabel = InteractiveChartHelper.getLabel(oModel, oInterface, "Dimensions");
				if (!bCustomAggregate && oAggregation) {
					// check if the label is part of aggregated properties (Transformation aggregates)
					sMeasureLabel = oAggregation.annotations && oAggregation.annotations.Common && oAggregation.annotations.Common.Label;
					if (sMeasureLabel === undefined) {
						sMeasureLabel = sMeasureLabel = InteractiveChartHelper.getLabel(oModel, oInterface, "Measures");
					}
				} else {
					sMeasureLabel = InteractiveChartHelper.getLabel(oModel, oInterface, "Measures");
				}
				if (sMeasureLabel === undefined) {
					sMeasureLabel = sMeasurePath;
				}
				if (sDimensionLabel === undefined) {
					sDimensionLabel = sDimensionPath;
				}
				return (
					ResourceModel &&
					ResourceModel.getText("M_INTERACTIVE_CHART_HELPER_VISUALFILTER_MEASURE_DIMENSION_TITLE", [
						sMeasureLabel,
						sDimensionLabel
					])
				);
			},
			getLabel: function(oModel, oInterface, sProperty) {
				var sLabel = oModel.getObject(
					oInterface.getPath(0) + "/" + sProperty + "/0/$PropertyPath@com.sap.vocabularies.Common.v1.Label"
				);
				return sLabel;
			},

			getToolTip: function(oInterface, oChartAnnotation, oCollection, sMetaPath, bCustomAggregate, oAggregation, bRenderLineChart) {
				var sChartType = oChartAnnotation && oChartAnnotation["ChartType"] && oChartAnnotation["ChartType"]["$EnumMember"];

				var sMeasureDimensionToolTip = InteractiveChartHelper.getMeasureDimensionTitle(
					oInterface,
					oChartAnnotation,
					oCollection,
					bCustomAggregate,
					oAggregation
				);
				if (bRenderLineChart === "false" && sChartType === "com.sap.vocabularies.UI.v1.ChartType/Line") {
					return "{= '" + sMeasureDimensionToolTip + "'}";
				}

				var sSeperator = ResourceModel.getText("M_INTERACTIVE_CHART_HELPER_VISUALFILTER_TOOLTIP_SEPERATOR");
				var sInfoPath = StableIdHelper.generate([sMetaPath]);
				var sScaleUOMTooltip = InteractiveChartHelper.getScaleUoMTitle(
					oInterface,
					oChartAnnotation,
					oCollection,
					sInfoPath,
					bCustomAggregate,
					oAggregation,
					sSeperator,
					true
				);
				return "{= '" + sMeasureDimensionToolTip + (sScaleUOMTooltip ? "' + " + sScaleUOMTooltip : "'") + "}";
			},
			getUoM: function(oInterface, oChartAnnotation, oCollection, isCustomData, bCustomAggregate, oAggregation) {
				var oModel = oInterface.getModel(0);
				var vISOCurrency = oModel.getObject(oInterface.getPath(0) + "/Measures/0/$PropertyPath@Org.OData.Measures.V1.ISOCurrency");
				var vUnit = oModel.getObject(oInterface.getPath(0) + "/Measures/0/$PropertyPath@Org.OData.Measures.V1.Unit");
				var sMeasurePath = oModel.getObject(oInterface.getPath(0) + "/Measures/0/$PropertyPath");
				var sAggregatablePropertyPath;
				if (!bCustomAggregate && oAggregation) {
					sAggregatablePropertyPath = oAggregation.AggregatableProperty && oAggregation.AggregatableProperty.value;
				} else {
					sAggregatablePropertyPath = sMeasurePath;
				}
				var _getUOM = function(vUOM, sAnnotation) {
					var sUOM = sAnnotation && sAnnotation.split("V1.")[1];
					var oUOM = {};
					if (vUOM) {
						// check if the UOM is part of Measure annotations(Custom aggregates)
						oUOM[sUOM] = vUOM;
						return isCustomData && vUOM.$Path ? JSON.stringify(oUOM) : vUOM;
					} else if (sAggregatablePropertyPath) {
						// check if the UOM is part of base property annotations(Transformation aggregates)
						vUOM = oInterface.getModel(1).getObject(oInterface.getPath(1) + "/" + sAggregatablePropertyPath + sAnnotation);
						oUOM[sUOM] = vUOM;
						return vUOM && isCustomData && vUOM.$Path ? JSON.stringify(oUOM) : vUOM;
					}
				};
				return _getUOM(vISOCurrency, "@Org.OData.Measures.V1.ISOCurrency") || _getUOM(vUnit, "@Org.OData.Measures.V1.Unit");
			},
			getScaleFactor: function(oValueFormat) {
				if (oValueFormat && oValueFormat.ScaleFactor) {
					return oValueFormat.ScaleFactor.$Decimal;
				}
				return undefined;
			},
			getUoMVisiblity: function(oInterface, oChartAnnotation, bShowError) {
				var sChartType = oChartAnnotation && oChartAnnotation["ChartType"] && oChartAnnotation["ChartType"]["$EnumMember"];
				if (bShowError) {
					return false;
				} else if (
					!(
						sChartType === "com.sap.vocabularies.UI.v1.ChartType/Bar" ||
						sChartType === "com.sap.vocabularies.UI.v1.ChartType/Line"
					)
				) {
					return false;
				} else {
					return true;
				}
			},
			getInParameterFiltersBinding: function(aInParameters) {
				if (aInParameters.length > 0) {
					var aParts = [],
						sPaths = "";
					aInParameters.forEach(function(oInParameter) {
						if (oInParameter.localDataProperty) {
							aParts.push("{path:'$filters>/conditions/" + oInParameter.localDataProperty + "'}");
						}
					});
					if (aParts.length > 0) {
						sPaths = aParts.join();
						return (
							"{parts:[" + sPaths + "], formatter:'sap.fe.macros.visualfilters.VisualFilterRuntime.getFiltersFromConditions'}"
						);
					} else {
						return undefined;
					}
				} else {
					return undefined;
				}
			},

			getfilterCountBinding: function(oInterface, oChartAnnotation) {
				var sDimension = oChartAnnotation.Dimensions[0].$PropertyPath;
				return (
					"{path:'$filters>/conditions/" +
					sDimension +
					"', formatter:'sap.fe.macros.visualfilters.VisualFilterRuntime.getFilterCounts'}"
				);
			}
		};

		InteractiveChartHelper.getfilterCountBinding.requiresIContext = true;
		InteractiveChartHelper.getColorBinding.requiresIContext = true;
		InteractiveChartHelper.getAggregationBinding.requiresIContext = true;
		InteractiveChartHelper.getUoM.requiresIContext = true;
		InteractiveChartHelper.getScaleUoMTitle.requiresIContext = true;
		InteractiveChartHelper.getToolTip.requiresIContext = true;
		InteractiveChartHelper.getMeasureDimensionTitle.requiresIContext = true;
		InteractiveChartHelper.getUoMVisiblity.requiresIContext = true;
		return InteractiveChartHelper;
	},
	/* bExport= */ true
);
