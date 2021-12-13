/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)

		(c) Copyright 2009-2015 SAP SE. All rights reserved
	
 */
sap.ui.define([
	"sap/base/util/merge",
	"./UtilizationChart"
], function(merge, UtilizationChart){
	"use strict";

	/**
	 * Constructor for a new Stock Chart
	 *
	 * @param {string} [sId] ID of the new control, generated automatically if no ID is given
	 * @param {object} [mSettings] Initial settings for the new control
	 *
	 * @class
	 * <p>
	 * Stock Chart (SC) is a complex shape, you can use it to visualize stock utilization on different dimensions.
	 * Each Stock dimension is represented by a line, you could define different colors for each dimension.
	 * </p>
	 *
	 *
	 * @extends sap.gantt.simple.UtilizationChart
	 *
	 * @author SAP SE
	 * @version 1.96.0
	 * @since 1.95
	 *
	 * @constructor
	 * @public
	 * @alias sap.gantt.simple.StockChart
	 */
	var StockChart = UtilizationChart.extend("sap.gantt.simple.StockChart", /** @lends sap.gantt.simple.StockChart.prototype */ {
		metadata: {
			library: "sap.gantt",
			properties: {
				/**
				 * Flag to show or hide the middle line in Stock Chart. By default the middle line is a gray dashed line
				 */
				showMiddleLine: { type: "boolean", defaultValue: true },
				/**
				 * Minimum value of the Chart.
				*/
                minValue:	{type: "float", group: "Misc", defaultValue: 0},
				/**
				 * Maximum value of the Chart.
				*/
                maxValue:   {type: "float", group: "Misc", defaultValue: 100}
			},
			defaultAggregation: "stockChartDimensions",
			aggregations: {
				/**
				 * Dimensions of the Stock Chart
				 */
				 stockChartDimensions: {
					type: "sap.gantt.simple.StockChartDimension",
					group : "Data"
				}
			}
		},
		renderer: {
			apiVersion: 2    // enable in-place DOM patching
		}
	});

	StockChart.prototype.applySettings = function(mSettings, oScope) {
		mSettings = mSettings || {};
		UtilizationChart.prototype.applySettings.call(this, mSettings, oScope);
	};

	/**
	 * Render a shape element with RenderManager
	 * @protected
	 * @param {object} oRm Render Manager
	 * @param {object} oElement shape instance
	 */
	StockChart.prototype.renderElement = function(oRm, oElement) {
		if (this.getStockChartDimensions().length === 0) {
			this._renderEmptyDomRefs(oRm, true/**bCloseTag*/);
			return;
		}

		this._renderEmptyDomRefs(oRm, false/**bCloseTag*/);

		var iX = this.getX(),
			iHeight = this.getHeight(),
			iY = this.getRowYCenter() - iHeight / 2,
			iWidth = this.getWidth();

		var mProp = {
			x: iX, y: iY, width: iWidth, height: iHeight
		};

		// 1. all dimension clip path
		this._renderDimensionClipPaths(oRm, mProp);

		// 2. middle indicator line
		this._renderMiddleLine(oRm, mProp);

		// 3. all dimension paths
		this._renderDimensionPaths(oRm, mProp);

		// 4. render tooltip rectangles
		this._renderTooltips(oRm, mProp);

		oRm.close("g");
	};

	/**
	 * @private
	*/
	StockChart.prototype._renderEmptyDomRefs = function(oRm, bClosedTag) {
		oRm.openStart("g", this);
		oRm.class("sapGanttStock");
		oRm.openEnd();
		if (bClosedTag) {
			oRm.close("g");
		}
	};

	/**
	 * @private
	*/
	StockChart.prototype._renderDimensionClipPaths = function(oRm, mProp) {
		var aDimensions = this.getStockChartDimensions();
		oRm.openStart("defs").openEnd();
		for (var iIndex = 0; iIndex < aDimensions.length; iIndex++) {

			oRm.openStart("clipPath", aDimensions[iIndex].getId() + "-clipPath");
			oRm.openEnd();
			this.renderDimensionPath(oRm, aDimensions[iIndex], mProp.y, mProp.height);
			oRm.close("clipPath");
		}
		oRm.close("defs");
	};

	/**
	 * @private
	*/
	StockChart.prototype._renderMiddleLine = function(oRm, mProp) {
		if (this.getShowMiddleLine()) {

			var iMiddleY = this._getMiddleLineY(mProp);

			oRm.openStart("path", this.getId() + "-middleLine");
			oRm.attr("d", "M " + mProp.x + " " + iMiddleY + " h " + mProp.width);
			oRm.class("sapGanttStockMiddleLine");
			oRm.openEnd().close("path");
		}
	};

	/**
	 * @private
	*/
	StockChart.prototype._getMiddleLineY = function(mProp) {
		var iThresholdHeight = this._getThresholdHeight(mProp.height);
		return (mProp.y + iThresholdHeight) + (mProp.height - iThresholdHeight) / 2;
	};

	/**
	 * @private
	*/
	StockChart.prototype._getThresholdHeight = function(iHeight) {
		return (iHeight) / (100);
	};

	/**
	 * @private
	*/
	StockChart.prototype._getClipPathIdOfDimension = function(oDimension) {
		return "url(#" + oDimension.getId() + "-clipPath)";
	};

	/**
	 * @private
	*/
	StockChart.prototype._renderDimensionPaths = function(oRm, mProp) {
		var iX = mProp.x,
			iY = mProp.y,
			iWidth = mProp.width,
			iHeight = mProp.height;
			var aNegtivePeriods = [];
			var aPositivePeriods = [];
		var aDimensions = this.getStockChartDimensions();
		for (var iIndex = 0; iIndex < aDimensions.length; iIndex++) {
			oRm.openStart("g").openEnd();
			var oDimension = aDimensions[iIndex];
			this.renderDimensionPath(oRm, oDimension, iY, iHeight, "scPath"/**sIdSuffix*/);

			//Check for NegativePeriods and create Individial Background Rectangle for both Positive and Negative Relative values
			//Else use the exiting apporach of Creating a single Rectangle with only positive Relative Values
			aNegtivePeriods = [];
			aPositivePeriods = [];
			for (var i = 0; i < oDimension.getStockChartPeriods().length; i++) {
				var oPeriod = oDimension.getStockChartPeriods()[i];
				oPeriod.getValue() < oDimension.getRelativePoint() ? aNegtivePeriods.push(oPeriod) : aPositivePeriods.push(oPeriod);
			}

			 var yOrigin = iHeight; // top row edge
			// If Positive and Negative are available split the height based on RelativePoint
			// and set the height of the Background Rectangle which contains the Capacity Color
			if (aNegtivePeriods.length > 0 && aPositivePeriods.length > 0) {
				for (var index = 0; index < 2; index++) {
					var iRelativePointValue = this._createTransform(oDimension.getRelativePoint());
					var iRelativePointPercentageHeight = iHeight * (iRelativePointValue / (100));
					var yRelativePoint = yOrigin - iRelativePointPercentageHeight;

					var mAttr = {
						id: oDimension.getId() + (index == 1  ? "-scRectNegative" : "-scRect"),
						x: iX,
						y: (index == 1  ? (iY + yRelativePoint) : iY),
						width: iWidth,
						height: (index == 1 ? iHeight - yRelativePoint : iHeight - (iHeight - yRelativePoint)),
						fill: (index == 1 ? oDimension.getRemainCapacityColorNegative() : oDimension.getRemainCapacityColor()),
						"fill-opacity": 0.5,
						"stroke-opacity": 0.5,
						"clip-path": this._getClipPathIdOfDimension(oDimension)
					};
					this.renderRectangleWithAttributes(oRm, mAttr);
				}
			} else if (aPositivePeriods.length > 0) {
				var mAttr = {
					id: oDimension.getId() + "-scRect",
					x: iX,
					y: iY,
					width: iWidth,
					height: iHeight,
					fill: oDimension.getRemainCapacityColor(),
					"fill-opacity": 0.5,
					"stroke-opacity": 0.5,
					"clip-path": this._getClipPathIdOfDimension(oDimension)
				};
				this.renderRectangleWithAttributes(oRm, mAttr);
			} else if (aNegtivePeriods.length > 0) {
				var mAttr = {
					id: oDimension.getId() + "-scRectNegative",
					x: iX,
					y: iY ,
					width: iWidth,
					height: iHeight ,
					fill: oDimension.getRemainCapacityColorNegative(),
					"fill-opacity": 0.5,
					"stroke-opacity": 0.5,
					"clip-path": this._getClipPathIdOfDimension(oDimension)
				};
				this.renderRectangleWithAttributes(oRm, mAttr);
			}
			oRm.close("g");
		}
	};

	/**
	 * @private
	*/
	StockChart.prototype._renderTooltips = function(oRm, mProp) {
		var iY = mProp.y,
			iHeight = mProp.height;

		oRm.openStart("g");
		oRm.class("sc-tooltips").openEnd();
		var aDimensionPoints = this.getAllDimensionPoints();
		aDimensionPoints.forEach(function(oPoint, iIndex, aPoints) {

			var oNextPoint = aPoints[iIndex + 1] || oPoint;

			var sTooltip = oPoint.tooltip;

			var bDifferentDimension = oPoint.name !== oNextPoint.name;
			if (bDifferentDimension) {
				sTooltip = oPoint.tooltip + "\n" + oNextPoint.tooltip;
			}

			var iX1 = this.toX(oPoint.from),
				bLastPoint = aPoints.length - 1 === iIndex,
				iX2 = this.toX(bLastPoint ? oNextPoint.to : oNextPoint.from),
				iWidth = Math.abs(iX2 - iX1);

			if (iWidth > 0) {
				// if and only if the rectangle has actual width, then render it
				// otherwise 0 width user can't see anything
				var mDefault = {
					opacity: 0,
					fillOpacity: 0,
					strokeOpacity: 0
				};

				var mAttr = merge({
					x: iX1,
					y: iY,
					width: iWidth,
					height: iHeight
				}, mDefault);

				this.renderRectangleWithAttributes(oRm, mAttr, sTooltip);
			}
		}.bind(this));
		oRm.close("g");
	};

	/**
	 * @private
	*/
	StockChart.prototype.getAllDimensionPoints = function() {
		var aAllPeriods = [];
		this.getStockChartDimensions().forEach(function(oDimension){
			var sName = oDimension.getName();
			oDimension.getStockChartPeriods().forEach(function(oPeriod, iIndex, aPeriods) {
				var sTooltip = oPeriod.getTooltip();
				if (!sTooltip) {
					sTooltip = sName + ":" + oPeriod.getValue();
				}

				if (oPeriod.getFrom() != oPeriod.getTo()) {
					aAllPeriods.push({
						name: sName,
						from: oPeriod.getFrom(),
						to: oPeriod.getFrom(),
						tooltip: sTooltip
					});
					aAllPeriods.push({
						name: sName,
						from: oPeriod.getTo(),
						to: oPeriod.getTo(),
						tooltip: sTooltip
					});
				} else {
					aAllPeriods.push({
						name: sName,
						from: oPeriod.getFrom(),
						to: oPeriod.getTo(),
						tooltip: sTooltip
					});
				}
			});
		});
		aAllPeriods.sort(function(a ,b){
			return a.from - b.from;
		});
		return aAllPeriods;
	};

	/**
	 * @private
	*/
	StockChart.prototype.renderDimensionPath = function(oRm, oDimension, iRowY, iRowHeight, sIdSuffix) {
		var aPeriods = oDimension.getStockChartPeriods();
		var d = "";

		for (var i = 0; i < aPeriods.length; i++) {
			var bFirst = (i === 0),
				bLast  = (i === aPeriods.length - 1);

			var oPeriod = aPeriods[i];
			var xPos1 = this.toX(oPeriod.getFrom());
			var xPos2 = this.toX(oPeriod.getTo());
			var vValue = oPeriod.getValue();

			if (vValue > (100)) {
				vValue = 100;
			}
			if (vValue < this.getMinValue()) {
				vValue = this.getMinValue();
			}

			//Get the YActual Value by converting the actual values to relative value between 0 - 100.
			//Convert the result to value between 0 - iRowHeight
			var yOrigin = iRowY + iRowHeight; // top row edge
			var iPercentageHeight = iRowHeight * (this._createTransform(vValue) / (100));
			var yActual = yOrigin - iPercentageHeight;

			//Convert the given Period values to relative values between 0 - 100
			//Create Midpoint to differentiate Positive / Negative periods based on RelativePoint
			var iRelativePointValue = this._createTransform(oDimension.getRelativePoint());
			var iRelativePointPercentageHeight = iRowHeight * (iRelativePointValue / (100));
			var iRelativePoint = yOrigin - iRelativePointPercentageHeight;

			d += (bFirst
					? " M " + xPos1 + " " + iRelativePoint
					: "")
				+ " L " + xPos1 + " " + yActual + " L " + xPos2 + " " + yActual +
				(bLast
					? " L " + xPos2 + " " + iRelativePoint
					: "");
		}

		if (sIdSuffix) {
			oRm.openStart("path", oDimension.getId() + "-" + sIdSuffix);
		} else {
			oRm.openStart("path");
		}
		oRm.attr("d", d);
		oRm.attr("fill", "none");
		oRm.attr("stroke-width", 2);
		oRm.attr("stroke", oDimension.getDimensionPathColor());
		oRm.class("sapGanttScDimensionPath");
		oRm.openEnd().close("path");
	};

	/**
	 * @private
	*/
	StockChart.prototype._createTransform = function(value) {
		var oldRange = {max: this.getMaxValue(), min: this.getMinValue()};
		var newRange = {max: 100, min: 0};
		var scale = (newRange.max - newRange.min) / (oldRange.max - oldRange.min);
		var newValue =  (value - oldRange.min) * scale;
		return newValue;
	};

	/**
	 * @private
	*/
	StockChart.prototype.destroy = function() {
		UtilizationChart.prototype.destroy.apply(this, arguments);
	};

	return StockChart;
}, /**bExport*/true);
