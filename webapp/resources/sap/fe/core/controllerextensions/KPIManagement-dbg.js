/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)
 *      (c) Copyright 2009-2021 SAP SE. All rights reserved
 */
sap.ui.define(["sap/ui/core/mvc/ControllerExtension", "sap/fe/core/controllerextensions/ControllerExtensionMetadata", "../helpers/ClassSupport", "sap/ui/model/json/JSONModel", "sap/base/Log", "sap/fe/core/formatters/TableFormatterTypes", "sap/ui/core/format/NumberFormat", "sap/ui/core/format/DateFormat", "sap/ui/core/Locale", "sap/ui/model/Filter", "sap/ui/model/Sorter", "sap/m/Popover", "sap/ui/integration/widgets/Card"], function (ControllerExtension, ControllerExtensionMetadata, ClassSupport, JSONModel, Log, TableFormatterTypes, NumberFormat, DateFormat, Locale, Filter, Sorter, Popover, Card) {
  "use strict";

  var _dec, _dec2, _dec3, _class, _class2;

  var MessageType = TableFormatterTypes.MessageType;
  var Public = ClassSupport.Public;
  var Override = ClassSupport.Override;
  var UI5Class = ClassSupport.UI5Class;

  function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

  function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

  function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

  function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

  function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

  function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = _getPrototypeOf(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = _getPrototypeOf(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return _possibleConstructorReturn(this, result); }; }

  function _possibleConstructorReturn(self, call) { if (call && (typeof call === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

  function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

  function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); return true; } catch (e) { return false; } }

  function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

  function _applyDecoratedDescriptor(target, property, decorators, descriptor, context) { var desc = {}; Object.keys(descriptor).forEach(function (key) { desc[key] = descriptor[key]; }); desc.enumerable = !!desc.enumerable; desc.configurable = !!desc.configurable; if ('value' in desc || desc.initializer) { desc.writable = true; } desc = decorators.slice().reverse().reduce(function (desc, decorator) { return decorator(target, property, desc) || desc; }, desc); if (context && desc.initializer !== void 0) { desc.value = desc.initializer ? desc.initializer.call(context) : void 0; desc.initializer = undefined; } if (desc.initializer === void 0) { Object.defineProperty(target, property, desc); desc = null; } return desc; }

  var MessageTypeFromCriticality = {
    "1": MessageType.Error,
    "2": MessageType.Warning,
    "3": MessageType.Success,
    "5": MessageType.Information
  };
  var ValueColorFromMessageType = {
    Error: "Error",
    Warning: "Critical",
    Success: "Good",
    Information: "None",
    None: "None"
  };
  /**
   * Function to get a message state from a calculated criticality of type 'Target'.
   *
   * @param {number} kpiValue The value of the KPI to be tested against.
   * @param {number[]} aThresholds Thresholds to be used [DeviationRangeLowValue,ToleranceRangeLowValue,AcceptanceRangeLowValue,AcceptanceRangeHighValue,ToleranceRangeHighValue,DeviationRangeHighValue].
   * @returns {MessageType} Returns the corresponding MessageType
   */

  function messageTypeFromTargetCalculation(kpiValue, aThresholds) {
    var criticalityProperty;

    if (aThresholds[0] !== undefined && aThresholds[0] !== null && kpiValue < aThresholds[0]) {
      criticalityProperty = MessageType.Error;
    } else if (aThresholds[1] !== undefined && aThresholds[1] !== null && kpiValue < aThresholds[1]) {
      criticalityProperty = MessageType.Warning;
    } else if (aThresholds[2] !== undefined && aThresholds[2] !== null && kpiValue < aThresholds[2]) {
      criticalityProperty = MessageType.None;
    } else if (aThresholds[5] !== undefined && aThresholds[5] !== null && kpiValue > aThresholds[5]) {
      criticalityProperty = MessageType.Error;
    } else if (aThresholds[4] !== undefined && aThresholds[4] !== null && kpiValue > aThresholds[4]) {
      criticalityProperty = MessageType.Warning;
    } else if (aThresholds[3] !== undefined && aThresholds[3] !== null && kpiValue > aThresholds[3]) {
      criticalityProperty = MessageType.None;
    } else {
      criticalityProperty = MessageType.Success;
    }

    return criticalityProperty;
  }
  /**
   * Function to get a message state from a calculated criticality of type 'Minimize'.
   *
   * @param {number} kpiValue The value of the KPI to be tested against.
   * @param {number[]} aThresholds Thresholds to be used [AcceptanceRangeHighValue,ToleranceRangeHighValue,DeviationRangeHighValue].
   * @returns {MessageType} Returns the corresponding MessageType
   */


  function messageTypeFromMinimizeCalculation(kpiValue, aThresholds) {
    var criticalityProperty;

    if (aThresholds[2] !== undefined && aThresholds[2] !== null && kpiValue > aThresholds[2]) {
      criticalityProperty = MessageType.Error;
    } else if (aThresholds[1] !== undefined && aThresholds[1] !== null && kpiValue > aThresholds[1]) {
      criticalityProperty = MessageType.Warning;
    } else if (aThresholds[0] !== undefined && aThresholds[0] !== null && kpiValue > aThresholds[0]) {
      criticalityProperty = MessageType.None;
    } else {
      criticalityProperty = MessageType.Success;
    }

    return criticalityProperty;
  }
  /**
   * Function to get a message state from a calculated criticality of type 'Maximize'.
   *
   * @param {number} kpiValue The value of the KPI to be tested against.
   * @param {number[]} aThresholds Thresholds to be used [DeviationRangeLowValue,ToleranceRangeLowValue,AcceptanceRangeLowValue].
   * @returns {MessageType} Returns the corresponding MessageType
   */


  function messageTypeFromMaximizeCalculation(kpiValue, aThresholds) {
    var criticalityProperty;

    if (aThresholds[0] !== undefined && aThresholds[0] !== null && kpiValue < aThresholds[0]) {
      criticalityProperty = MessageType.Error;
    } else if (aThresholds[1] !== undefined && aThresholds[1] !== null && kpiValue < aThresholds[1]) {
      criticalityProperty = MessageType.Warning;
    } else if (aThresholds[2] !== undefined && aThresholds[2] !== null && kpiValue < aThresholds[2]) {
      criticalityProperty = MessageType.None;
    } else {
      criticalityProperty = MessageType.Success;
    }

    return criticalityProperty;
  }
  /**
   * Function to calculate a DeviationIndicator value from a trend value.
   *
   * @param {number|string} trendValue The criticality values.
   * @returns {string} Returns the corresponding DeviationIndicator value
   */


  function deviationIndicatorFromTrendType(trendValue) {
    var deviationIndicator;

    switch (trendValue) {
      case 1: // StrongUp

      case "1":
      case 2: // Up

      case "2":
        deviationIndicator = "Up";
        break;

      case 4: // Down

      case "4":
      case 5: // StrongDown

      case "5":
        deviationIndicator = "Down";
        break;

      default:
        deviationIndicator = "None";
    }

    return deviationIndicator;
  }
  /**
   * Function to calculate a DeviationIndicator from a TrendCalculation.
   *
   * @param kpiValue The value of the KPI
   * @param referenceValue The reference value to compare with
   * @param isRelative True is the comparison is relative
   * @param aThresholds Array of thresholds [StrongDownDifference, DownDifference, UpDifference, StrongUpDifference]
   * @returns {sap.m.DeviationIndicator} Returns the corresponding DeviationIndicator value
   */


  function deviationIndicatorFromCalculation(kpiValue, referenceValue, isRelative, aThresholds) {
    var deviationIndicator;

    if (!aThresholds || isRelative && !referenceValue) {
      return "None";
    }

    var compValue = isRelative ? (kpiValue - referenceValue) / referenceValue : kpiValue - referenceValue;

    if (aThresholds[0] !== undefined && aThresholds[0] !== null && compValue <= aThresholds[0]) {
      // StrongDown --> Down
      deviationIndicator = "Down";
    } else if (aThresholds[1] !== undefined && aThresholds[1] !== null && compValue <= aThresholds[1]) {
      // Down --> Down
      deviationIndicator = "Down";
    } else if (aThresholds[3] !== undefined && aThresholds[3] !== null && compValue >= aThresholds[3]) {
      // StrongUp --> Up
      deviationIndicator = "Up";
    } else if (aThresholds[2] !== undefined && aThresholds[2] !== null && compValue >= aThresholds[2]) {
      // Up --> Up
      deviationIndicator = "Up";
    } else {
      // Sideways --> None
      deviationIndicator = "None";
    }

    return deviationIndicator;
  }
  /**
   * Creates a sap.ui.model.Filter from a filter definition.
   *
   * @param filterDefinition The filter definition
   * @returns Returns a sap.ui.model.Filter from the definition, or undefined if the definition is empty (no ranges)
   */


  function createFilterFromDefinition(filterDefinition) {
    if (filterDefinition.ranges.length === 0) {
      return undefined;
    } else if (filterDefinition.ranges.length === 1) {
      return new Filter(filterDefinition.propertyPath, filterDefinition.ranges[0].operator, filterDefinition.ranges[0].rangeLow, filterDefinition.ranges[0].rangeHigh);
    } else {
      var aRangeFilters = filterDefinition.ranges.map(function (range) {
        return new Filter(filterDefinition.propertyPath, range.operator, range.rangeLow, range.rangeHigh);
      });
      return new Filter({
        filters: aRangeFilters,
        and: false
      });
    }
  }

  function getFilterStringFromDefinition(filterDefinition) {
    var currentLocale = new Locale(sap.ui.getCore().getConfiguration().getLanguage());
    var resBundle = sap.ui.getCore().getLibraryResourceBundle("sap.fe.core");
    var dateFormat = DateFormat.getDateInstance({
      style: "medium"
    }, currentLocale);

    function formatRange(range) {
      var valueLow = filterDefinition.propertyType.indexOf("Edm.Date") === 0 ? dateFormat.format(new Date(range.rangeLow)) : range.rangeLow;
      var valueHigh = filterDefinition.propertyType.indexOf("Edm.Date") === 0 ? dateFormat.format(new Date(range.rangeHigh)) : range.rangeHigh;

      switch (range.operator) {
        case "BT":
          return "[" + valueLow + " - " + valueHigh + "]";

        case "Contains":
          return "*" + valueLow + "*";

        case "GE":
          return "\u2265" + valueLow;

        case "GT":
          return ">" + valueLow;

        case "LE":
          return "\u2264" + valueLow;

        case "LT":
          return "<" + valueLow;

        case "NB":
          return resBundle.getText("C_KPICARD_FILTERSTRING_NOT", ["[" + valueLow + " - " + valueHigh + "]"]);

        case "NE":
          return "\u2260" + valueLow;

        case "NotContains":
          return resBundle.getText("C_KPICARD_FILTERSTRING_NOT", ["*" + valueLow + "*"]);

        case "EQ":
        default:
          return valueLow;
      }
    }

    if (filterDefinition.ranges.length === 0) {
      return "";
    } else if (filterDefinition.ranges.length === 1) {
      return formatRange(filterDefinition.ranges[0]);
    } else {
      return "(" + filterDefinition.ranges.map(formatRange).join(",") + ")";
    }
  }

  function formatChartTitle(kpiDef) {
    var resBundle = sap.ui.getCore().getLibraryResourceBundle("sap.fe.core");

    function formatList(items) {
      if (items.length === 0) {
        return "";
      } else if (items.length === 1) {
        return items[0].label;
      } else {
        var res = items[0].label;

        for (var I = 1; I < items.length - 1; I++) {
          res += ", " + items[I].label;
        }

        return resBundle.getText("C_KPICARD_ITEMSLIST", [res, items[items.length - 1].label]);
      }
    }

    return resBundle.getText("C_KPICARD_CHARTTITLE", [formatList(kpiDef.chart.measures), formatList(kpiDef.chart.dimensions)]);
  }

  function updateChartLabelSettings(chartDefinition, oChartProperties) {
    switch (chartDefinition.chartType) {
      case "Donut":
        // Show data labels, do not show axis titles
        oChartProperties.categoryAxis = {
          title: {
            visible: false
          }
        };
        oChartProperties.valueAxis = {
          title: {
            visible: false
          },
          label: {
            formatString: "ShortFloat"
          }
        };
        oChartProperties.plotArea.dataLabel = {
          visible: true,
          type: "value",
          formatString: "ShortFloat_MFD2"
        };
        break;

      case "bubble":
        // Show axis title, bubble size legend, do not show data labels
        oChartProperties.valueAxis = {
          title: {
            visible: true
          },
          label: {
            formatString: "ShortFloat"
          }
        };
        oChartProperties.valueAxis2 = {
          title: {
            visible: true
          },
          label: {
            formatString: "ShortFloat"
          }
        };
        oChartProperties.legendGroup = {
          layout: {
            position: "bottom",
            alignment: "topLeft"
          }
        };
        oChartProperties.sizeLegend = {
          visible: true
        };
        oChartProperties.plotArea.dataLabel = {
          visible: false
        };
        break;

      case "scatter":
        // Do not show data labels and axis titles
        oChartProperties.valueAxis = {
          title: {
            visible: false
          },
          label: {
            formatString: "ShortFloat"
          }
        };
        oChartProperties.valueAxis2 = {
          title: {
            visible: false
          },
          label: {
            formatString: "ShortFloat"
          }
        };
        oChartProperties.plotArea.dataLabel = {
          visible: false
        };
        break;

      default:
        // Do not show data labels and axis titles
        oChartProperties.categoryAxis = {
          title: {
            visible: false
          }
        };
        oChartProperties.valueAxis = {
          title: {
            visible: false
          },
          label: {
            formatString: "ShortFloat"
          }
        };
        oChartProperties.plotArea.dataLabel = {
          visible: false
        };
    }
  }

  function filterMap(aObjects, aRoles) {
    if (aRoles && aRoles.length) {
      return aObjects.filter(function (dimension) {
        return aRoles.indexOf(dimension.role) >= 0;
      }).map(function (dimension) {
        return dimension.label;
      });
    } else {
      return aObjects.map(function (dimension) {
        return dimension.label;
      });
    }
  }

  function getScatterBubbleChartFeeds(chartDefinition) {
    var axis1Measures = filterMap(chartDefinition.measures, ["Axis1"]);
    var axis2Measures = filterMap(chartDefinition.measures, ["Axis2"]);
    var axis3Measures = filterMap(chartDefinition.measures, ["Axis3"]);
    var otherMeasures = filterMap(chartDefinition.measures, [undefined]);
    var seriesDimensions = filterMap(chartDefinition.dimensions, ["Series"]); // Get the first dimension with role "Category" for the shape

    var shapeDimension = chartDefinition.dimensions.find(function (dimension) {
      return dimension.role === "Category";
    }); // Measure for the x-Axis : first measure for Axis1, or for Axis2 if not found, or for Axis3 if not found

    var xMeasure = axis1Measures.shift() || axis2Measures.shift() || axis3Measures.shift() || otherMeasures.shift() || ""; // Measure for the y-Axis : first measure for Axis2, or second measure for Axis1 if not found, or first measure for Axis3 if not found

    var yMeasure = axis2Measures.shift() || axis1Measures.shift() || axis3Measures.shift() || otherMeasures.shift() || "";
    var res = [{
      "uid": "valueAxis",
      "type": "Measure",
      "values": [xMeasure]
    }, {
      "uid": "valueAxis2",
      "type": "Measure",
      "values": [yMeasure]
    }];

    if (chartDefinition.chartType === "bubble") {
      // Measure for the size of the bubble: first measure for Axis3, or remaining measure for Axis1/Axis2 if not found
      var sizeMeasure = axis3Measures.shift() || axis1Measures.shift() || axis2Measures.shift() || otherMeasures.shift() || "";
      res.push({
        "uid": "bubbleWidth",
        "type": "Measure",
        "values": [sizeMeasure]
      });
    } // Color (optional)


    if (seriesDimensions.length) {
      res.push({
        "uid": "color",
        "type": "Dimension",
        "values": seriesDimensions
      });
    } // Shape (optional)


    if (shapeDimension) {
      res.push({
        "uid": "shape",
        "type": "Dimension",
        "values": [shapeDimension.label]
      });
    }

    return res;
  }

  function getChartFeeds(chartDefinition) {
    var res;

    switch (chartDefinition.chartType) {
      case "Donut":
        res = [{
          "uid": "size",
          "type": "Measure",
          "values": filterMap(chartDefinition.measures)
        }, {
          "uid": "color",
          "type": "Dimension",
          "values": filterMap(chartDefinition.dimensions)
        }];
        break;

      case "bubble":
      case "scatter":
        res = getScatterBubbleChartFeeds(chartDefinition);
        break;

      case "vertical_bullet":
        res = [{
          "uid": "actualValues",
          "type": "Measure",
          "values": filterMap(chartDefinition.measures, [undefined, "Axis1"])
        }, {
          "uid": "targetValues",
          "type": "Measure",
          "values": filterMap(chartDefinition.measures, ["Axis2"])
        }, {
          "uid": "categoryAxis",
          "type": "Dimension",
          "values": filterMap(chartDefinition.dimensions, [undefined, "Category"])
        }, {
          "uid": "color",
          "type": "Dimension",
          "values": filterMap(chartDefinition.dimensions, ["Series"])
        }];
        break;

      default:
        res = [{
          "uid": "valueAxis",
          "type": "Measure",
          "values": filterMap(chartDefinition.measures)
        }, {
          "uid": "categoryAxis",
          "type": "Dimension",
          "values": filterMap(chartDefinition.dimensions, [undefined, "Category"])
        }, {
          "uid": "color",
          "type": "Dimension",
          "values": filterMap(chartDefinition.dimensions, ["Series"])
        }];
    }

    return res;
  }
  /**
   * @class A controller extension for managing the KPIs in an analytical list page
   *
   * @name sap.fe.core.controllerextensions.KPIManagement
   * @hideconstructor
   *
   * @private
   * @since 1.93.0
   */


  var KPIManagementControllerExtension = (_dec = UI5Class("sap.fe.core.controllerextensions.KPIManagement", ControllerExtensionMetadata), _dec2 = Override(), _dec3 = Override(), _dec(_class = (_class2 = /*#__PURE__*/function (_ControllerExtension) {
    _inherits(KPIManagementControllerExtension, _ControllerExtension);

    var _super = _createSuper(KPIManagementControllerExtension);

    function KPIManagementControllerExtension() {
      _classCallCheck(this, KPIManagementControllerExtension);

      return _super.apply(this, arguments);
    }

    _createClass(KPIManagementControllerExtension, [{
      key: "initCardManifest",
      value:
      /**
       * Creates the card manifest for a KPI definition and stores it in a JSON model.
       *
       * @param kpiDefinition The KPI definition
       * @param oKPIModel The JSON model in which the manifest will be stored
       */
      function initCardManifest(kpiDefinition, oKPIModel) {
        var _kpiDefinition$select;

        var oCardManifest = {
          "sap.app": {
            id: "sap.fe",
            type: "card"
          },
          "sap.ui": {
            technology: "UI5"
          },
          "sap.card": {
            type: "Analytical",
            data: {
              json: {}
            },
            header: {
              type: "Numeric",
              title: kpiDefinition.datapoint.title,
              subTitle: kpiDefinition.datapoint.description,
              unitOfMeasurement: "{mainUnit}",
              mainIndicator: {
                number: "{mainValueNoScale}",
                unit: "{mainValueScale}",
                state: "{mainState}",
                trend: "{trend}"
              }
            },
            content: {
              minHeight: "25rem",
              chartProperties: {
                plotArea: {},
                title: {
                  visible: true,
                  alignment: "left"
                }
              },
              data: {
                path: "/chartData"
              }
            }
          }
        }; // Add side indicators in the card header if a target is defined for the KPI

        if (kpiDefinition.datapoint.targetPath || kpiDefinition.datapoint.targetValue !== undefined) {
          var resBundle = sap.ui.getCore().getLibraryResourceBundle("sap.fe.core");
          oCardManifest["sap.card"].header.sideIndicators = [{
            title: resBundle.getText("C_KPICARD_INDICATOR_TARGET"),
            number: "{targetNumber}",
            unit: "{targetUnit}"
          }, {
            title: resBundle.getText("C_KPICARD_INDICATOR_DEVIATION"),
            number: "{deviationNumber}",
            unit: "%"
          }];
        } // Details of the card: filter descriptions


        if ((_kpiDefinition$select = kpiDefinition.selectionVariantFilterDefinitions) !== null && _kpiDefinition$select !== void 0 && _kpiDefinition$select.length) {
          var aDescriptions = [];
          kpiDefinition.selectionVariantFilterDefinitions.forEach(function (filterDefinition) {
            var desc = getFilterStringFromDefinition(filterDefinition);

            if (desc) {
              aDescriptions.push(desc);
            }
          });

          if (aDescriptions.length) {
            oCardManifest["sap.card"].header.details = aDescriptions.join(", ");
          }
        } // Chart settings: type, title, dimensions and measures in the manifest


        oCardManifest["sap.card"].content.chartType = kpiDefinition.chart.chartType;
        updateChartLabelSettings(kpiDefinition.chart, oCardManifest["sap.card"].content.chartProperties);
        oCardManifest["sap.card"].content.chartProperties.title.text = formatChartTitle(kpiDefinition);
        oCardManifest["sap.card"].content.dimensions = kpiDefinition.chart.dimensions.map(function (dimension) {
          return {
            label: dimension.label,
            value: "{" + dimension.name + "}"
          };
        });
        oCardManifest["sap.card"].content.measures = kpiDefinition.chart.measures.map(function (measure) {
          return {
            label: measure.label,
            value: "{" + measure.name + "}"
          };
        });
        oCardManifest["sap.card"].content.feeds = getChartFeeds(kpiDefinition.chart);
        oKPIModel.setProperty("/" + kpiDefinition.id, {
          manifest: oCardManifest
        });
      }
    }, {
      key: "onInit",
      value: function onInit() {
        var _this = this;

        this.aKPIDefinitions = this.getKPIData();

        if (this.aKPIDefinitions && this.aKPIDefinitions.length) {
          var oView = this.getView();
          var oAppComponent = oView.getController().getAppComponent(); // Create a JSON model to store KPI data

          var oKPIModel = new JSONModel();
          oView.setModel(oKPIModel, "kpiModel");
          this.aKPIDefinitions.forEach(function (kpiDefinition) {
            // Create the manifest for the KPI card and store it in the KPI model
            _this.initCardManifest(kpiDefinition, oKPIModel); // Load tag data for the KPI


            _this.loadKPITagData(kpiDefinition, oAppComponent.getModel(), oKPIModel).catch(function (err) {
              Log.error(err);
            });
          });
        }
      }
    }, {
      key: "onExit",
      value: function onExit() {
        var oKPIModel = this.getView().getModel("kpiModel");

        if (oKPIModel) {
          oKPIModel.destroy();
        }
      }
    }, {
      key: "getKPIData",
      value: function getKPIData() {
        var oView = this.getView(),
            sCustomData = oView.getContent()[0].data("KPIData");

        if (sCustomData) {
          var vData = typeof sCustomData === "string" ? JSON.parse(sCustomData) : sCustomData;

          if ("customData" in vData) {
            return vData["customData"];
          } else {
            return vData;
          }
        } else {
          return undefined;
        }
      }
    }, {
      key: "updateDatapointValueAndCurrency",
      value: function updateDatapointValueAndCurrency(kpiDefinition, kpiContext, oKPIModel) {
        var _kpiDefinition$datapo, _kpiDefinition$datapo2, _kpiDefinition$datapo3;

        var currentLocale = new Locale(sap.ui.getCore().getConfiguration().getLanguage());
        var rawUnit = (_kpiDefinition$datapo = kpiDefinition.datapoint.unit) !== null && _kpiDefinition$datapo !== void 0 && _kpiDefinition$datapo.isPath ? kpiContext.getProperty(kpiDefinition.datapoint.unit.value) : (_kpiDefinition$datapo2 = kpiDefinition.datapoint.unit) === null || _kpiDefinition$datapo2 === void 0 ? void 0 : _kpiDefinition$datapo2.value;
        var isPercentage = ((_kpiDefinition$datapo3 = kpiDefinition.datapoint.unit) === null || _kpiDefinition$datapo3 === void 0 ? void 0 : _kpiDefinition$datapo3.isCurrency) === false && rawUnit === "%"; // /////////////////////
        // Main KPI value

        var rawValue = Number.parseFloat(kpiContext.getProperty(kpiDefinition.datapoint.propertyPath)); // Value formatted with a scale

        var kpiValue = NumberFormat.getFloatInstance({
          style: isPercentage ? undefined : "short",
          minFractionDigits: 0,
          maxFractionDigits: 1,
          showScale: !isPercentage
        }, currentLocale).format(rawValue);
        oKPIModel.setProperty("/" + kpiDefinition.id + "/manifest/sap.card/data/json/mainValue", kpiValue); // Value without a scale

        var kpiValueUnscaled = NumberFormat.getFloatInstance({
          maxFractionDigits: 2,
          showScale: false,
          groupingEnabled: true
        }, currentLocale).format(rawValue);
        oKPIModel.setProperty("/" + kpiDefinition.id + "/manifest/sap.card/data/json/mainValueUnscaled", kpiValueUnscaled); // Value formatted with the scale omitted

        var kpiValueNoScale = NumberFormat.getFloatInstance({
          style: isPercentage ? undefined : "short",
          minFractionDigits: 0,
          maxFractionDigits: 1,
          showScale: false
        }, currentLocale).format(rawValue);
        oKPIModel.setProperty("/" + kpiDefinition.id + "/manifest/sap.card/data/json/mainValueNoScale", kpiValueNoScale); // Scale of the value

        var kpiValueScale = NumberFormat.getFloatInstance({
          style: isPercentage ? undefined : "short",
          decimals: 0,
          maxIntegerDigits: 0,
          showScale: true
        }, currentLocale).format(rawValue);
        oKPIModel.setProperty("/" + kpiDefinition.id + "/manifest/sap.card/data/json/mainValueScale", kpiValueScale); // /////////////////////
        // Unit or currency

        if (kpiDefinition.datapoint.unit && rawUnit) {
          if (kpiDefinition.datapoint.unit.isCurrency) {
            oKPIModel.setProperty("/" + kpiDefinition.id + "/manifest/sap.card/data/json/mainUnit", rawUnit);
          } else {
            // In case of unit of measure, we have to format it properly
            var kpiUnit = NumberFormat.getUnitInstance({
              showNumber: false
            }, currentLocale).format(rawValue, rawUnit);
            oKPIModel.setProperty("/" + kpiDefinition.id + "/manifest/sap.card/data/json/mainUnit", kpiUnit);
          }
        }
      }
    }, {
      key: "updateDatapointCriticality",
      value: function updateDatapointCriticality(kpiDefinition, kpiContext, oKPIModel) {
        var rawValue = Number.parseFloat(kpiContext.getProperty(kpiDefinition.datapoint.propertyPath));
        var criticalityValue = MessageType.None;

        if (kpiDefinition.datapoint.criticalityValue) {
          // Criticality is a fixed value
          criticalityValue = kpiDefinition.datapoint.criticalityValue;
        } else if (kpiDefinition.datapoint.criticalityPath) {
          // Criticality comes from another property (via a path)
          criticalityValue = MessageTypeFromCriticality[kpiContext.getProperty(kpiDefinition.datapoint.criticalityPath)] || MessageType.None;
        } else if (kpiDefinition.datapoint.criticalityCalculationThresholds && kpiDefinition.datapoint.criticalityCalculationMode) {
          // Criticality calculation
          switch (kpiDefinition.datapoint.criticalityCalculationMode) {
            case "UI.ImprovementDirectionType/Target":
              criticalityValue = messageTypeFromTargetCalculation(rawValue, kpiDefinition.datapoint.criticalityCalculationThresholds);
              break;

            case "UI.ImprovementDirectionType/Minimize":
              criticalityValue = messageTypeFromMinimizeCalculation(rawValue, kpiDefinition.datapoint.criticalityCalculationThresholds);
              break;

            case "UI.ImprovementDirectionType/Maximize":
            default:
              criticalityValue = messageTypeFromMaximizeCalculation(rawValue, kpiDefinition.datapoint.criticalityCalculationThresholds);
              break;
          }
        }

        oKPIModel.setProperty("/" + kpiDefinition.id + "/manifest/sap.card/data/json/mainCriticality", criticalityValue);
        oKPIModel.setProperty("/" + kpiDefinition.id + "/manifest/sap.card/data/json/mainState", ValueColorFromMessageType[criticalityValue] || "None");
      }
    }, {
      key: "updateDatapointTrend",
      value: function updateDatapointTrend(kpiDefinition, kpiContext, oKPIModel) {
        var rawValue = Number.parseFloat(kpiContext.getProperty(kpiDefinition.datapoint.propertyPath));
        var trendValue = "None";

        if (kpiDefinition.datapoint.trendValue) {
          // Trend is a fixed value
          trendValue = kpiDefinition.datapoint.trendValue;
        } else if (kpiDefinition.datapoint.trendPath) {
          // Trend comes from another property via a path
          trendValue = deviationIndicatorFromTrendType(kpiContext.getProperty(kpiDefinition.datapoint.trendPath));
        } else if (kpiDefinition.datapoint.trendCalculationReferenceValue !== undefined || kpiDefinition.datapoint.trendCalculationReferencePath) {
          // Calculated trend
          var trendReferenceValue;

          if (kpiDefinition.datapoint.trendCalculationReferenceValue !== undefined) {
            trendReferenceValue = kpiDefinition.datapoint.trendCalculationReferenceValue;
          } else {
            trendReferenceValue = Number.parseFloat(kpiContext.getProperty(kpiDefinition.datapoint.trendCalculationReferencePath || ""));
          }

          trendValue = deviationIndicatorFromCalculation(rawValue, trendReferenceValue, !!kpiDefinition.datapoint.trendCalculationIsRelative, kpiDefinition.datapoint.trendCalculationTresholds);
        }

        oKPIModel.setProperty("/" + kpiDefinition.id + "/manifest/sap.card/data/json/trend", trendValue);
      }
    }, {
      key: "updateTargetValue",
      value: function updateTargetValue(kpiDefinition, kpiContext, oKPIModel) {
        if (kpiDefinition.datapoint.targetValue === undefined && kpiDefinition.datapoint.targetPath === undefined) {
          return; // No target set for the KPI
        }

        var rawValue = Number.parseFloat(kpiContext.getProperty(kpiDefinition.datapoint.propertyPath));
        var currentLocale = new Locale(sap.ui.getCore().getConfiguration().getLanguage());
        var targetRawValue;

        if (kpiDefinition.datapoint.targetValue !== undefined) {
          targetRawValue = kpiDefinition.datapoint.targetValue;
        } else {
          targetRawValue = Number.parseFloat(kpiContext.getProperty(kpiDefinition.datapoint.targetPath || ""));
        }

        var deviationRawValue = targetRawValue !== 0 ? (rawValue - targetRawValue) / targetRawValue * 100 : undefined; // Formatting

        var targetValue = NumberFormat.getFloatInstance({
          style: "short",
          minFractionDigits: 0,
          maxFractionDigits: 1,
          showScale: false
        }, currentLocale).format(targetRawValue);
        var targetScale = NumberFormat.getFloatInstance({
          style: "short",
          decimals: 0,
          maxIntegerDigits: 0,
          showScale: true
        }, currentLocale).format(targetRawValue);
        oKPIModel.setProperty("/" + kpiDefinition.id + "/manifest/sap.card/data/json/targetNumber", targetValue);
        oKPIModel.setProperty("/" + kpiDefinition.id + "/manifest/sap.card/data/json/targetUnit", targetScale);

        if (deviationRawValue !== undefined) {
          var deviationValue = NumberFormat.getFloatInstance({
            minFractionDigits: 0,
            maxFractionDigits: 1,
            showScale: false
          }, currentLocale).format(deviationRawValue);
          oKPIModel.setProperty("/" + kpiDefinition.id + "/manifest/sap.card/data/json/deviationNumber", deviationValue);
        } else {
          oKPIModel.setProperty("/" + kpiDefinition.id + "/manifest/sap.card/data/json/deviationNumber", "N/A");
        }
      }
      /**
       * Loads tag data for a KPI, and stores it in the JSON KPI model.
       *
       * @param {KPIDefinition} kpiDefinition The definition of the KPI.
       * @param {ODataModel} oMainModel The model used to load the data.
       * @param {JSONModel} oKPIModel The JSON model where the data will be stored
       * @param loadFull If not true, loads only data for the KPI tag
       * @returns {Promise} Returns the promise that is resolved when data is loaded.
       */

    }, {
      key: "loadKPITagData",
      value: function loadKPITagData(kpiDefinition, oMainModel, oKPIModel, loadFull) {
        var _kpiDefinition$datapo4,
            _kpiDefinition$select2,
            _this2 = this;

        // If loadFull=false, then we're just loading data for the tag and we use the "$auto.LongRunners" groupID
        // If loadFull=true, we're loading data for the whole KPI (tag + card) and we use the default ("$auto") groupID
        var oListBinding = loadFull ? oMainModel.bindList("/" + kpiDefinition.entitySet) : oMainModel.bindList("/" + kpiDefinition.entitySet, undefined, undefined, undefined, {
          $$groupId: "$auto.LongRunners"
        });
        var oAggregate = {}; // Main value + currency/unit

        if ((_kpiDefinition$datapo4 = kpiDefinition.datapoint.unit) !== null && _kpiDefinition$datapo4 !== void 0 && _kpiDefinition$datapo4.isPath) {
          oAggregate[kpiDefinition.datapoint.propertyPath] = {
            unit: kpiDefinition.datapoint.unit.value
          };
        } else {
          oAggregate[kpiDefinition.datapoint.propertyPath] = {};
        } // Property for criticality


        if (kpiDefinition.datapoint.criticalityPath) {
          oAggregate[kpiDefinition.datapoint.criticalityPath] = {};
        } // Properties for trend and trend calculation


        if (loadFull) {
          if (kpiDefinition.datapoint.trendPath) {
            oAggregate[kpiDefinition.datapoint.trendPath] = {};
          }

          if (kpiDefinition.datapoint.trendCalculationReferencePath) {
            oAggregate[kpiDefinition.datapoint.trendCalculationReferencePath] = {};
          }

          if (kpiDefinition.datapoint.targetPath) {
            oAggregate[kpiDefinition.datapoint.targetPath] = {};
          }
        }

        oListBinding.setAggregation({
          aggregate: oAggregate
        }); // Manage SelectionVariant filters

        if ((_kpiDefinition$select2 = kpiDefinition.selectionVariantFilterDefinitions) !== null && _kpiDefinition$select2 !== void 0 && _kpiDefinition$select2.length) {
          var aFilters = kpiDefinition.selectionVariantFilterDefinitions.map(createFilterFromDefinition).filter(function (filter) {
            return filter !== undefined;
          });
          oListBinding.filter(aFilters);
        }

        return oListBinding.requestContexts(0, 1).then(function (aContexts) {
          if (aContexts.length) {
            var _kpiDefinition$datapo5, _kpiDefinition$datapo6;

            var rawUnit = (_kpiDefinition$datapo5 = kpiDefinition.datapoint.unit) !== null && _kpiDefinition$datapo5 !== void 0 && _kpiDefinition$datapo5.isPath ? aContexts[0].getProperty(kpiDefinition.datapoint.unit.value) : (_kpiDefinition$datapo6 = kpiDefinition.datapoint.unit) === null || _kpiDefinition$datapo6 === void 0 ? void 0 : _kpiDefinition$datapo6.value;

            if (kpiDefinition.datapoint.unit && !rawUnit) {
              // A unit/currency is defined, but its value is undefined --> multi-unit situation
              oKPIModel.setProperty("/" + kpiDefinition.id + "/manifest/sap.card/data/json/mainValue", "*");
              oKPIModel.setProperty("/" + kpiDefinition.id + "/manifest/sap.card/data/json/mainValueUnscaled", "*");
              oKPIModel.setProperty("/" + kpiDefinition.id + "/manifest/sap.card/data/json/mainValueNoScale", "*");
              oKPIModel.setProperty("/" + kpiDefinition.id + "/manifest/sap.card/data/json/mainValueScale", "");
              oKPIModel.setProperty("/" + kpiDefinition.id + "/manifest/sap.card/data/json/mainUnit", undefined);
              oKPIModel.setProperty("/" + kpiDefinition.id + "/manifest/sap.card/data/json/mainCriticality", MessageType.None);
              oKPIModel.setProperty("/" + kpiDefinition.id + "/manifest/sap.card/data/json/mainState", "None");
              oKPIModel.setProperty("/" + kpiDefinition.id + "/manifest/sap.card/data/json/trend", "None");
              oKPIModel.setProperty("/" + kpiDefinition.id + "/manifest/sap.card/data/json/targetNumber", undefined);
              oKPIModel.setProperty("/" + kpiDefinition.id + "/manifest/sap.card/data/json/targetUnit", undefined);
              oKPIModel.setProperty("/" + kpiDefinition.id + "/manifest/sap.card/data/json/deviationNumber", undefined);
            } else {
              _this2.updateDatapointValueAndCurrency(kpiDefinition, aContexts[0], oKPIModel);

              _this2.updateDatapointCriticality(kpiDefinition, aContexts[0], oKPIModel);

              if (loadFull) {
                _this2.updateDatapointTrend(kpiDefinition, aContexts[0], oKPIModel);

                _this2.updateTargetValue(kpiDefinition, aContexts[0], oKPIModel);
              }
            }
          }
        });
      }
      /**
       * Loads card data for a KPI, and stores it in the JSON KPI model.
       *
       * @param {KPIDefinition} kpiDefinition The definition of the KPI.
       * @param {ODataModel} oMainModel The model used to load the data.
       * @param {JSONModel} oKPIModel The JSON model where the data will be stored
       * @returns {Promise} Returns the promise that is resolved when data is loaded.
       */

    }, {
      key: "loadKPICardData",
      value: function loadKPICardData(kpiDefinition, oMainModel, oKPIModel) {
        var _kpiDefinition$select3;

        var oListBinding = oMainModel.bindList("/" + kpiDefinition.entitySet);
        var oGroup = {};
        var oAggregate = {};
        kpiDefinition.chart.dimensions.forEach(function (dimension) {
          oGroup[dimension.name] = {};
        });
        kpiDefinition.chart.measures.forEach(function (measure) {
          oAggregate[measure.name] = {};
        });
        oListBinding.setAggregation({
          group: oGroup,
          aggregate: oAggregate
        }); // Manage SelectionVariant filters

        if ((_kpiDefinition$select3 = kpiDefinition.selectionVariantFilterDefinitions) !== null && _kpiDefinition$select3 !== void 0 && _kpiDefinition$select3.length) {
          var aFilters = kpiDefinition.selectionVariantFilterDefinitions.map(createFilterFromDefinition).filter(function (filter) {
            return filter !== undefined;
          });
          oListBinding.filter(aFilters);
        } // Sorting


        if (kpiDefinition.chart.sortOrder) {
          oListBinding.sort(kpiDefinition.chart.sortOrder.map(function (sortInfo) {
            return new Sorter(sortInfo.name, sortInfo.descending);
          }));
        }

        return oListBinding.requestContexts(0, kpiDefinition.chart.maxItems).then(function (aContexts) {
          var chartData = aContexts.map(function (oContext) {
            var oData = {};
            kpiDefinition.chart.dimensions.forEach(function (dimension) {
              oData[dimension.name] = oContext.getProperty(dimension.name);
            });
            kpiDefinition.chart.measures.forEach(function (measure) {
              oData[measure.name] = oContext.getProperty(measure.name);
            });
            return oData;
          });
          oKPIModel.setProperty("/" + kpiDefinition.id + "/manifest/sap.card/data/json/chartData", chartData);
        });
      }
      /**
       * Gets the popover to display the KPI card
       * The popover and the contained card for the KPIs are created if necessary.
       * The popover is shared between all KPIs, so we create it only once.
       *
       * @param oKPITag The Tag that triggered the popover opening.
       * @returns The shared popover.
       */

    }, {
      key: "getPopover",
      value: function getPopover(oKPITag) {
        if (!this.oPopover) {
          this.oCard = new Card({
            width: "25rem",
            height: "auto"
          });
          this.oPopover = new Popover({
            id: "kpi-Popover",
            showHeader: false,
            placement: "Auto",
            content: [this.oCard]
          });
          oKPITag.addDependent(this.oPopover); // The first clicked tag gets the popover as dependent
        }

        return this.oPopover;
      }
    }, {
      key: "onKPIPressed",
      value: function onKPIPressed(oKPITag, kpiID) {
        var _this3 = this;

        var oKPIModel = oKPITag.getModel("kpiModel");

        if (this.aKPIDefinitions && this.aKPIDefinitions.length) {
          var kpiDefinition = this.aKPIDefinitions.find(function (oDef) {
            return oDef.id === kpiID;
          });

          if (kpiDefinition) {
            var oModel = oKPITag.getModel();
            var aPromises = [this.loadKPITagData(kpiDefinition, oModel, oKPIModel, true), this.loadKPICardData(kpiDefinition, oModel, oKPIModel)];
            var oPopover = this.getPopover(oKPITag);
            Promise.all(aPromises).then(function () {
              _this3.oCard.setManifest(oKPIModel.getProperty("/" + kpiID + "/manifest"));

              _this3.oCard.refresh();

              oPopover.openBy(oKPITag, false);
            }).catch(function (err) {
              Log.error(err);
            });
          }
        }
      }
    }]);

    return KPIManagementControllerExtension;
  }(ControllerExtension), (_applyDecoratedDescriptor(_class2.prototype, "onInit", [_dec2], Object.getOwnPropertyDescriptor(_class2.prototype, "onInit"), _class2.prototype), _applyDecoratedDescriptor(_class2.prototype, "onExit", [_dec3], Object.getOwnPropertyDescriptor(_class2.prototype, "onExit"), _class2.prototype), _applyDecoratedDescriptor(_class2.prototype, "onKPIPressed", [Public], Object.getOwnPropertyDescriptor(_class2.prototype, "onKPIPressed"), _class2.prototype)), _class2)) || _class);
  return KPIManagementControllerExtension;
}, false);
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIktQSU1hbmFnZW1lbnQudHMiXSwibmFtZXMiOlsiTWVzc2FnZVR5cGVGcm9tQ3JpdGljYWxpdHkiLCJNZXNzYWdlVHlwZSIsIkVycm9yIiwiV2FybmluZyIsIlN1Y2Nlc3MiLCJJbmZvcm1hdGlvbiIsIlZhbHVlQ29sb3JGcm9tTWVzc2FnZVR5cGUiLCJOb25lIiwibWVzc2FnZVR5cGVGcm9tVGFyZ2V0Q2FsY3VsYXRpb24iLCJrcGlWYWx1ZSIsImFUaHJlc2hvbGRzIiwiY3JpdGljYWxpdHlQcm9wZXJ0eSIsInVuZGVmaW5lZCIsIm1lc3NhZ2VUeXBlRnJvbU1pbmltaXplQ2FsY3VsYXRpb24iLCJtZXNzYWdlVHlwZUZyb21NYXhpbWl6ZUNhbGN1bGF0aW9uIiwiZGV2aWF0aW9uSW5kaWNhdG9yRnJvbVRyZW5kVHlwZSIsInRyZW5kVmFsdWUiLCJkZXZpYXRpb25JbmRpY2F0b3IiLCJkZXZpYXRpb25JbmRpY2F0b3JGcm9tQ2FsY3VsYXRpb24iLCJyZWZlcmVuY2VWYWx1ZSIsImlzUmVsYXRpdmUiLCJjb21wVmFsdWUiLCJjcmVhdGVGaWx0ZXJGcm9tRGVmaW5pdGlvbiIsImZpbHRlckRlZmluaXRpb24iLCJyYW5nZXMiLCJsZW5ndGgiLCJGaWx0ZXIiLCJwcm9wZXJ0eVBhdGgiLCJvcGVyYXRvciIsInJhbmdlTG93IiwicmFuZ2VIaWdoIiwiYVJhbmdlRmlsdGVycyIsIm1hcCIsInJhbmdlIiwiZmlsdGVycyIsImFuZCIsImdldEZpbHRlclN0cmluZ0Zyb21EZWZpbml0aW9uIiwiY3VycmVudExvY2FsZSIsIkxvY2FsZSIsInNhcCIsInVpIiwiZ2V0Q29yZSIsImdldENvbmZpZ3VyYXRpb24iLCJnZXRMYW5ndWFnZSIsInJlc0J1bmRsZSIsImdldExpYnJhcnlSZXNvdXJjZUJ1bmRsZSIsImRhdGVGb3JtYXQiLCJEYXRlRm9ybWF0IiwiZ2V0RGF0ZUluc3RhbmNlIiwic3R5bGUiLCJmb3JtYXRSYW5nZSIsInZhbHVlTG93IiwicHJvcGVydHlUeXBlIiwiaW5kZXhPZiIsImZvcm1hdCIsIkRhdGUiLCJ2YWx1ZUhpZ2giLCJnZXRUZXh0Iiwiam9pbiIsImZvcm1hdENoYXJ0VGl0bGUiLCJrcGlEZWYiLCJmb3JtYXRMaXN0IiwiaXRlbXMiLCJsYWJlbCIsInJlcyIsIkkiLCJjaGFydCIsIm1lYXN1cmVzIiwiZGltZW5zaW9ucyIsInVwZGF0ZUNoYXJ0TGFiZWxTZXR0aW5ncyIsImNoYXJ0RGVmaW5pdGlvbiIsIm9DaGFydFByb3BlcnRpZXMiLCJjaGFydFR5cGUiLCJjYXRlZ29yeUF4aXMiLCJ0aXRsZSIsInZpc2libGUiLCJ2YWx1ZUF4aXMiLCJmb3JtYXRTdHJpbmciLCJwbG90QXJlYSIsImRhdGFMYWJlbCIsInR5cGUiLCJ2YWx1ZUF4aXMyIiwibGVnZW5kR3JvdXAiLCJsYXlvdXQiLCJwb3NpdGlvbiIsImFsaWdubWVudCIsInNpemVMZWdlbmQiLCJmaWx0ZXJNYXAiLCJhT2JqZWN0cyIsImFSb2xlcyIsImZpbHRlciIsImRpbWVuc2lvbiIsInJvbGUiLCJnZXRTY2F0dGVyQnViYmxlQ2hhcnRGZWVkcyIsImF4aXMxTWVhc3VyZXMiLCJheGlzMk1lYXN1cmVzIiwiYXhpczNNZWFzdXJlcyIsIm90aGVyTWVhc3VyZXMiLCJzZXJpZXNEaW1lbnNpb25zIiwic2hhcGVEaW1lbnNpb24iLCJmaW5kIiwieE1lYXN1cmUiLCJzaGlmdCIsInlNZWFzdXJlIiwic2l6ZU1lYXN1cmUiLCJwdXNoIiwiZ2V0Q2hhcnRGZWVkcyIsIktQSU1hbmFnZW1lbnRDb250cm9sbGVyRXh0ZW5zaW9uIiwiVUk1Q2xhc3MiLCJDb250cm9sbGVyRXh0ZW5zaW9uTWV0YWRhdGEiLCJPdmVycmlkZSIsImtwaURlZmluaXRpb24iLCJvS1BJTW9kZWwiLCJvQ2FyZE1hbmlmZXN0IiwiaWQiLCJ0ZWNobm9sb2d5IiwiZGF0YSIsImpzb24iLCJoZWFkZXIiLCJkYXRhcG9pbnQiLCJzdWJUaXRsZSIsImRlc2NyaXB0aW9uIiwidW5pdE9mTWVhc3VyZW1lbnQiLCJtYWluSW5kaWNhdG9yIiwibnVtYmVyIiwidW5pdCIsInN0YXRlIiwidHJlbmQiLCJjb250ZW50IiwibWluSGVpZ2h0IiwiY2hhcnRQcm9wZXJ0aWVzIiwicGF0aCIsInRhcmdldFBhdGgiLCJ0YXJnZXRWYWx1ZSIsInNpZGVJbmRpY2F0b3JzIiwic2VsZWN0aW9uVmFyaWFudEZpbHRlckRlZmluaXRpb25zIiwiYURlc2NyaXB0aW9ucyIsImZvckVhY2giLCJkZXNjIiwiZGV0YWlscyIsInRleHQiLCJ2YWx1ZSIsIm5hbWUiLCJtZWFzdXJlIiwiZmVlZHMiLCJzZXRQcm9wZXJ0eSIsIm1hbmlmZXN0IiwiYUtQSURlZmluaXRpb25zIiwiZ2V0S1BJRGF0YSIsIm9WaWV3IiwiZ2V0VmlldyIsIm9BcHBDb21wb25lbnQiLCJnZXRDb250cm9sbGVyIiwiZ2V0QXBwQ29tcG9uZW50IiwiSlNPTk1vZGVsIiwic2V0TW9kZWwiLCJpbml0Q2FyZE1hbmlmZXN0IiwibG9hZEtQSVRhZ0RhdGEiLCJnZXRNb2RlbCIsImNhdGNoIiwiZXJyIiwiTG9nIiwiZXJyb3IiLCJkZXN0cm95Iiwic0N1c3RvbURhdGEiLCJnZXRDb250ZW50IiwidkRhdGEiLCJKU09OIiwicGFyc2UiLCJrcGlDb250ZXh0IiwicmF3VW5pdCIsImlzUGF0aCIsImdldFByb3BlcnR5IiwiaXNQZXJjZW50YWdlIiwiaXNDdXJyZW5jeSIsInJhd1ZhbHVlIiwiTnVtYmVyIiwicGFyc2VGbG9hdCIsIk51bWJlckZvcm1hdCIsImdldEZsb2F0SW5zdGFuY2UiLCJtaW5GcmFjdGlvbkRpZ2l0cyIsIm1heEZyYWN0aW9uRGlnaXRzIiwic2hvd1NjYWxlIiwia3BpVmFsdWVVbnNjYWxlZCIsImdyb3VwaW5nRW5hYmxlZCIsImtwaVZhbHVlTm9TY2FsZSIsImtwaVZhbHVlU2NhbGUiLCJkZWNpbWFscyIsIm1heEludGVnZXJEaWdpdHMiLCJrcGlVbml0IiwiZ2V0VW5pdEluc3RhbmNlIiwic2hvd051bWJlciIsImNyaXRpY2FsaXR5VmFsdWUiLCJjcml0aWNhbGl0eVBhdGgiLCJjcml0aWNhbGl0eUNhbGN1bGF0aW9uVGhyZXNob2xkcyIsImNyaXRpY2FsaXR5Q2FsY3VsYXRpb25Nb2RlIiwidHJlbmRQYXRoIiwidHJlbmRDYWxjdWxhdGlvblJlZmVyZW5jZVZhbHVlIiwidHJlbmRDYWxjdWxhdGlvblJlZmVyZW5jZVBhdGgiLCJ0cmVuZFJlZmVyZW5jZVZhbHVlIiwidHJlbmRDYWxjdWxhdGlvbklzUmVsYXRpdmUiLCJ0cmVuZENhbGN1bGF0aW9uVHJlc2hvbGRzIiwidGFyZ2V0UmF3VmFsdWUiLCJkZXZpYXRpb25SYXdWYWx1ZSIsInRhcmdldFNjYWxlIiwiZGV2aWF0aW9uVmFsdWUiLCJvTWFpbk1vZGVsIiwibG9hZEZ1bGwiLCJvTGlzdEJpbmRpbmciLCJiaW5kTGlzdCIsImVudGl0eVNldCIsIiQkZ3JvdXBJZCIsIm9BZ2dyZWdhdGUiLCJzZXRBZ2dyZWdhdGlvbiIsImFnZ3JlZ2F0ZSIsImFGaWx0ZXJzIiwicmVxdWVzdENvbnRleHRzIiwidGhlbiIsImFDb250ZXh0cyIsInVwZGF0ZURhdGFwb2ludFZhbHVlQW5kQ3VycmVuY3kiLCJ1cGRhdGVEYXRhcG9pbnRDcml0aWNhbGl0eSIsInVwZGF0ZURhdGFwb2ludFRyZW5kIiwidXBkYXRlVGFyZ2V0VmFsdWUiLCJvR3JvdXAiLCJncm91cCIsInNvcnRPcmRlciIsInNvcnQiLCJzb3J0SW5mbyIsIlNvcnRlciIsImRlc2NlbmRpbmciLCJtYXhJdGVtcyIsImNoYXJ0RGF0YSIsIm9Db250ZXh0Iiwib0RhdGEiLCJvS1BJVGFnIiwib1BvcG92ZXIiLCJvQ2FyZCIsIkNhcmQiLCJ3aWR0aCIsImhlaWdodCIsIlBvcG92ZXIiLCJzaG93SGVhZGVyIiwicGxhY2VtZW50IiwiYWRkRGVwZW5kZW50Iiwia3BpSUQiLCJvRGVmIiwib01vZGVsIiwiYVByb21pc2VzIiwibG9hZEtQSUNhcmREYXRhIiwiZ2V0UG9wb3ZlciIsIlByb21pc2UiLCJhbGwiLCJzZXRNYW5pZmVzdCIsInJlZnJlc2giLCJvcGVuQnkiLCJDb250cm9sbGVyRXh0ZW5zaW9uIiwiUHVibGljIl0sIm1hcHBpbmdzIjoiO0FBQUE7QUFDQTtBQUNBOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFjQSxNQUFNQSwwQkFBdUQsR0FBRztBQUMvRCxTQUFLQyxXQUFXLENBQUNDLEtBRDhDO0FBRS9ELFNBQUtELFdBQVcsQ0FBQ0UsT0FGOEM7QUFHL0QsU0FBS0YsV0FBVyxDQUFDRyxPQUg4QztBQUkvRCxTQUFLSCxXQUFXLENBQUNJO0FBSjhDLEdBQWhFO0FBT0EsTUFBTUMseUJBQXNELEdBQUc7QUFDOURKLElBQUFBLEtBQUssRUFBRSxPQUR1RDtBQUU5REMsSUFBQUEsT0FBTyxFQUFFLFVBRnFEO0FBRzlEQyxJQUFBQSxPQUFPLEVBQUUsTUFIcUQ7QUFJOURDLElBQUFBLFdBQVcsRUFBRSxNQUppRDtBQUs5REUsSUFBQUEsSUFBSSxFQUFFO0FBTHdELEdBQS9EO0FBUUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBQ0EsV0FBU0MsZ0NBQVQsQ0FBMENDLFFBQTFDLEVBQTREQyxXQUE1RCxFQUFxSDtBQUNwSCxRQUFJQyxtQkFBSjs7QUFFQSxRQUFJRCxXQUFXLENBQUMsQ0FBRCxDQUFYLEtBQW1CRSxTQUFuQixJQUFnQ0YsV0FBVyxDQUFDLENBQUQsQ0FBWCxLQUFtQixJQUFuRCxJQUEyREQsUUFBUSxHQUFHQyxXQUFXLENBQUMsQ0FBRCxDQUFyRixFQUEwRjtBQUN6RkMsTUFBQUEsbUJBQW1CLEdBQUdWLFdBQVcsQ0FBQ0MsS0FBbEM7QUFDQSxLQUZELE1BRU8sSUFBSVEsV0FBVyxDQUFDLENBQUQsQ0FBWCxLQUFtQkUsU0FBbkIsSUFBZ0NGLFdBQVcsQ0FBQyxDQUFELENBQVgsS0FBbUIsSUFBbkQsSUFBMkRELFFBQVEsR0FBR0MsV0FBVyxDQUFDLENBQUQsQ0FBckYsRUFBMEY7QUFDaEdDLE1BQUFBLG1CQUFtQixHQUFHVixXQUFXLENBQUNFLE9BQWxDO0FBQ0EsS0FGTSxNQUVBLElBQUlPLFdBQVcsQ0FBQyxDQUFELENBQVgsS0FBbUJFLFNBQW5CLElBQWdDRixXQUFXLENBQUMsQ0FBRCxDQUFYLEtBQW1CLElBQW5ELElBQTJERCxRQUFRLEdBQUdDLFdBQVcsQ0FBQyxDQUFELENBQXJGLEVBQTBGO0FBQ2hHQyxNQUFBQSxtQkFBbUIsR0FBR1YsV0FBVyxDQUFDTSxJQUFsQztBQUNBLEtBRk0sTUFFQSxJQUFJRyxXQUFXLENBQUMsQ0FBRCxDQUFYLEtBQW1CRSxTQUFuQixJQUFnQ0YsV0FBVyxDQUFDLENBQUQsQ0FBWCxLQUFtQixJQUFuRCxJQUEyREQsUUFBUSxHQUFHQyxXQUFXLENBQUMsQ0FBRCxDQUFyRixFQUEwRjtBQUNoR0MsTUFBQUEsbUJBQW1CLEdBQUdWLFdBQVcsQ0FBQ0MsS0FBbEM7QUFDQSxLQUZNLE1BRUEsSUFBSVEsV0FBVyxDQUFDLENBQUQsQ0FBWCxLQUFtQkUsU0FBbkIsSUFBZ0NGLFdBQVcsQ0FBQyxDQUFELENBQVgsS0FBbUIsSUFBbkQsSUFBMkRELFFBQVEsR0FBR0MsV0FBVyxDQUFDLENBQUQsQ0FBckYsRUFBMEY7QUFDaEdDLE1BQUFBLG1CQUFtQixHQUFHVixXQUFXLENBQUNFLE9BQWxDO0FBQ0EsS0FGTSxNQUVBLElBQUlPLFdBQVcsQ0FBQyxDQUFELENBQVgsS0FBbUJFLFNBQW5CLElBQWdDRixXQUFXLENBQUMsQ0FBRCxDQUFYLEtBQW1CLElBQW5ELElBQTJERCxRQUFRLEdBQUdDLFdBQVcsQ0FBQyxDQUFELENBQXJGLEVBQTBGO0FBQ2hHQyxNQUFBQSxtQkFBbUIsR0FBR1YsV0FBVyxDQUFDTSxJQUFsQztBQUNBLEtBRk0sTUFFQTtBQUNOSSxNQUFBQSxtQkFBbUIsR0FBR1YsV0FBVyxDQUFDRyxPQUFsQztBQUNBOztBQUVELFdBQU9PLG1CQUFQO0FBQ0E7QUFFRDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7O0FBQ0EsV0FBU0Usa0NBQVQsQ0FBNENKLFFBQTVDLEVBQThEQyxXQUE5RCxFQUF1SDtBQUN0SCxRQUFJQyxtQkFBSjs7QUFFQSxRQUFJRCxXQUFXLENBQUMsQ0FBRCxDQUFYLEtBQW1CRSxTQUFuQixJQUFnQ0YsV0FBVyxDQUFDLENBQUQsQ0FBWCxLQUFtQixJQUFuRCxJQUEyREQsUUFBUSxHQUFHQyxXQUFXLENBQUMsQ0FBRCxDQUFyRixFQUEwRjtBQUN6RkMsTUFBQUEsbUJBQW1CLEdBQUdWLFdBQVcsQ0FBQ0MsS0FBbEM7QUFDQSxLQUZELE1BRU8sSUFBSVEsV0FBVyxDQUFDLENBQUQsQ0FBWCxLQUFtQkUsU0FBbkIsSUFBZ0NGLFdBQVcsQ0FBQyxDQUFELENBQVgsS0FBbUIsSUFBbkQsSUFBMkRELFFBQVEsR0FBR0MsV0FBVyxDQUFDLENBQUQsQ0FBckYsRUFBMEY7QUFDaEdDLE1BQUFBLG1CQUFtQixHQUFHVixXQUFXLENBQUNFLE9BQWxDO0FBQ0EsS0FGTSxNQUVBLElBQUlPLFdBQVcsQ0FBQyxDQUFELENBQVgsS0FBbUJFLFNBQW5CLElBQWdDRixXQUFXLENBQUMsQ0FBRCxDQUFYLEtBQW1CLElBQW5ELElBQTJERCxRQUFRLEdBQUdDLFdBQVcsQ0FBQyxDQUFELENBQXJGLEVBQTBGO0FBQ2hHQyxNQUFBQSxtQkFBbUIsR0FBR1YsV0FBVyxDQUFDTSxJQUFsQztBQUNBLEtBRk0sTUFFQTtBQUNOSSxNQUFBQSxtQkFBbUIsR0FBR1YsV0FBVyxDQUFDRyxPQUFsQztBQUNBOztBQUVELFdBQU9PLG1CQUFQO0FBQ0E7QUFFRDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7O0FBQ0EsV0FBU0csa0NBQVQsQ0FBNENMLFFBQTVDLEVBQThEQyxXQUE5RCxFQUF1SDtBQUN0SCxRQUFJQyxtQkFBSjs7QUFFQSxRQUFJRCxXQUFXLENBQUMsQ0FBRCxDQUFYLEtBQW1CRSxTQUFuQixJQUFnQ0YsV0FBVyxDQUFDLENBQUQsQ0FBWCxLQUFtQixJQUFuRCxJQUEyREQsUUFBUSxHQUFHQyxXQUFXLENBQUMsQ0FBRCxDQUFyRixFQUEwRjtBQUN6RkMsTUFBQUEsbUJBQW1CLEdBQUdWLFdBQVcsQ0FBQ0MsS0FBbEM7QUFDQSxLQUZELE1BRU8sSUFBSVEsV0FBVyxDQUFDLENBQUQsQ0FBWCxLQUFtQkUsU0FBbkIsSUFBZ0NGLFdBQVcsQ0FBQyxDQUFELENBQVgsS0FBbUIsSUFBbkQsSUFBMkRELFFBQVEsR0FBR0MsV0FBVyxDQUFDLENBQUQsQ0FBckYsRUFBMEY7QUFDaEdDLE1BQUFBLG1CQUFtQixHQUFHVixXQUFXLENBQUNFLE9BQWxDO0FBQ0EsS0FGTSxNQUVBLElBQUlPLFdBQVcsQ0FBQyxDQUFELENBQVgsS0FBbUJFLFNBQW5CLElBQWdDRixXQUFXLENBQUMsQ0FBRCxDQUFYLEtBQW1CLElBQW5ELElBQTJERCxRQUFRLEdBQUdDLFdBQVcsQ0FBQyxDQUFELENBQXJGLEVBQTBGO0FBQ2hHQyxNQUFBQSxtQkFBbUIsR0FBR1YsV0FBVyxDQUFDTSxJQUFsQztBQUNBLEtBRk0sTUFFQTtBQUNOSSxNQUFBQSxtQkFBbUIsR0FBR1YsV0FBVyxDQUFDRyxPQUFsQztBQUNBOztBQUVELFdBQU9PLG1CQUFQO0FBQ0E7QUFFRDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7OztBQUNBLFdBQVNJLCtCQUFULENBQXlDQyxVQUF6QyxFQUE4RTtBQUM3RSxRQUFJQyxrQkFBSjs7QUFFQSxZQUFRRCxVQUFSO0FBQ0MsV0FBSyxDQUFMLENBREQsQ0FDUzs7QUFDUixXQUFLLEdBQUw7QUFDQSxXQUFLLENBQUwsQ0FIRCxDQUdTOztBQUNSLFdBQUssR0FBTDtBQUNDQyxRQUFBQSxrQkFBa0IsR0FBRyxJQUFyQjtBQUNBOztBQUVELFdBQUssQ0FBTCxDQVJELENBUVM7O0FBQ1IsV0FBSyxHQUFMO0FBQ0EsV0FBSyxDQUFMLENBVkQsQ0FVUzs7QUFDUixXQUFLLEdBQUw7QUFDQ0EsUUFBQUEsa0JBQWtCLEdBQUcsTUFBckI7QUFDQTs7QUFFRDtBQUNDQSxRQUFBQSxrQkFBa0IsR0FBRyxNQUFyQjtBQWhCRjs7QUFtQkEsV0FBT0Esa0JBQVA7QUFDQTtBQUVEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7O0FBQ0EsV0FBU0MsaUNBQVQsQ0FDQ1QsUUFERCxFQUVDVSxjQUZELEVBR0NDLFVBSEQsRUFJQ1YsV0FKRCxFQUtVO0FBQ1QsUUFBSU8sa0JBQUo7O0FBRUEsUUFBSSxDQUFDUCxXQUFELElBQWlCVSxVQUFVLElBQUksQ0FBQ0QsY0FBcEMsRUFBcUQ7QUFDcEQsYUFBTyxNQUFQO0FBQ0E7O0FBRUQsUUFBTUUsU0FBUyxHQUFHRCxVQUFVLEdBQUcsQ0FBQ1gsUUFBUSxHQUFHVSxjQUFaLElBQThCQSxjQUFqQyxHQUFrRFYsUUFBUSxHQUFHVSxjQUF6Rjs7QUFFQSxRQUFJVCxXQUFXLENBQUMsQ0FBRCxDQUFYLEtBQW1CRSxTQUFuQixJQUFnQ0YsV0FBVyxDQUFDLENBQUQsQ0FBWCxLQUFtQixJQUFuRCxJQUEyRFcsU0FBUyxJQUFJWCxXQUFXLENBQUMsQ0FBRCxDQUF2RixFQUE0RjtBQUMzRjtBQUNBTyxNQUFBQSxrQkFBa0IsR0FBRyxNQUFyQjtBQUNBLEtBSEQsTUFHTyxJQUFJUCxXQUFXLENBQUMsQ0FBRCxDQUFYLEtBQW1CRSxTQUFuQixJQUFnQ0YsV0FBVyxDQUFDLENBQUQsQ0FBWCxLQUFtQixJQUFuRCxJQUEyRFcsU0FBUyxJQUFJWCxXQUFXLENBQUMsQ0FBRCxDQUF2RixFQUE0RjtBQUNsRztBQUNBTyxNQUFBQSxrQkFBa0IsR0FBRyxNQUFyQjtBQUNBLEtBSE0sTUFHQSxJQUFJUCxXQUFXLENBQUMsQ0FBRCxDQUFYLEtBQW1CRSxTQUFuQixJQUFnQ0YsV0FBVyxDQUFDLENBQUQsQ0FBWCxLQUFtQixJQUFuRCxJQUEyRFcsU0FBUyxJQUFJWCxXQUFXLENBQUMsQ0FBRCxDQUF2RixFQUE0RjtBQUNsRztBQUNBTyxNQUFBQSxrQkFBa0IsR0FBRyxJQUFyQjtBQUNBLEtBSE0sTUFHQSxJQUFJUCxXQUFXLENBQUMsQ0FBRCxDQUFYLEtBQW1CRSxTQUFuQixJQUFnQ0YsV0FBVyxDQUFDLENBQUQsQ0FBWCxLQUFtQixJQUFuRCxJQUEyRFcsU0FBUyxJQUFJWCxXQUFXLENBQUMsQ0FBRCxDQUF2RixFQUE0RjtBQUNsRztBQUNBTyxNQUFBQSxrQkFBa0IsR0FBRyxJQUFyQjtBQUNBLEtBSE0sTUFHQTtBQUNOO0FBQ0FBLE1BQUFBLGtCQUFrQixHQUFHLE1BQXJCO0FBQ0E7O0FBRUQsV0FBT0Esa0JBQVA7QUFDQTtBQUVEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7O0FBQ0EsV0FBU0ssMEJBQVQsQ0FBb0NDLGdCQUFwQyxFQUE0RjtBQUMzRixRQUFJQSxnQkFBZ0IsQ0FBQ0MsTUFBakIsQ0FBd0JDLE1BQXhCLEtBQW1DLENBQXZDLEVBQTBDO0FBQ3pDLGFBQU9iLFNBQVA7QUFDQSxLQUZELE1BRU8sSUFBSVcsZ0JBQWdCLENBQUNDLE1BQWpCLENBQXdCQyxNQUF4QixLQUFtQyxDQUF2QyxFQUEwQztBQUNoRCxhQUFPLElBQUlDLE1BQUosQ0FDTkgsZ0JBQWdCLENBQUNJLFlBRFgsRUFFTkosZ0JBQWdCLENBQUNDLE1BQWpCLENBQXdCLENBQXhCLEVBQTJCSSxRQUZyQixFQUdOTCxnQkFBZ0IsQ0FBQ0MsTUFBakIsQ0FBd0IsQ0FBeEIsRUFBMkJLLFFBSHJCLEVBSU5OLGdCQUFnQixDQUFDQyxNQUFqQixDQUF3QixDQUF4QixFQUEyQk0sU0FKckIsQ0FBUDtBQU1BLEtBUE0sTUFPQTtBQUNOLFVBQU1DLGFBQWEsR0FBR1IsZ0JBQWdCLENBQUNDLE1BQWpCLENBQXdCUSxHQUF4QixDQUE0QixVQUFBQyxLQUFLLEVBQUk7QUFDMUQsZUFBTyxJQUFJUCxNQUFKLENBQVdILGdCQUFnQixDQUFDSSxZQUE1QixFQUEwQ00sS0FBSyxDQUFDTCxRQUFoRCxFQUE0RUssS0FBSyxDQUFDSixRQUFsRixFQUE0RkksS0FBSyxDQUFDSCxTQUFsRyxDQUFQO0FBQ0EsT0FGcUIsQ0FBdEI7QUFHQSxhQUFPLElBQUlKLE1BQUosQ0FBVztBQUNqQlEsUUFBQUEsT0FBTyxFQUFFSCxhQURRO0FBRWpCSSxRQUFBQSxHQUFHLEVBQUU7QUFGWSxPQUFYLENBQVA7QUFJQTtBQUNEOztBQUVELFdBQVNDLDZCQUFULENBQXVDYixnQkFBdkMsRUFBbUY7QUFDbEYsUUFBTWMsYUFBYSxHQUFHLElBQUlDLE1BQUosQ0FDckJDLEdBQUcsQ0FBQ0MsRUFBSixDQUNFQyxPQURGLEdBRUVDLGdCQUZGLEdBR0VDLFdBSEYsRUFEcUIsQ0FBdEI7QUFNQSxRQUFNQyxTQUFTLEdBQUdMLEdBQUcsQ0FBQ0MsRUFBSixDQUFPQyxPQUFQLEdBQWlCSSx3QkFBakIsQ0FBMEMsYUFBMUMsQ0FBbEI7QUFDQSxRQUFNQyxVQUFVLEdBQUdDLFVBQVUsQ0FBQ0MsZUFBWCxDQUEyQjtBQUFFQyxNQUFBQSxLQUFLLEVBQUU7QUFBVCxLQUEzQixFQUFnRFosYUFBaEQsQ0FBbkI7O0FBRUEsYUFBU2EsV0FBVCxDQUFxQmpCLEtBQXJCLEVBQXFEO0FBQ3BELFVBQU1rQixRQUFRLEdBQ2I1QixnQkFBZ0IsQ0FBQzZCLFlBQWpCLENBQThCQyxPQUE5QixDQUFzQyxVQUF0QyxNQUFzRCxDQUF0RCxHQUEwRFAsVUFBVSxDQUFDUSxNQUFYLENBQWtCLElBQUlDLElBQUosQ0FBU3RCLEtBQUssQ0FBQ0osUUFBZixDQUFsQixDQUExRCxHQUF3R0ksS0FBSyxDQUFDSixRQUQvRztBQUVBLFVBQU0yQixTQUFTLEdBQ2RqQyxnQkFBZ0IsQ0FBQzZCLFlBQWpCLENBQThCQyxPQUE5QixDQUFzQyxVQUF0QyxNQUFzRCxDQUF0RCxHQUEwRFAsVUFBVSxDQUFDUSxNQUFYLENBQWtCLElBQUlDLElBQUosQ0FBU3RCLEtBQUssQ0FBQ0gsU0FBZixDQUFsQixDQUExRCxHQUF5R0csS0FBSyxDQUFDSCxTQURoSDs7QUFHQSxjQUFRRyxLQUFLLENBQUNMLFFBQWQ7QUFDQyxhQUFLLElBQUw7QUFDQyxpQkFBTyxNQUFNdUIsUUFBTixHQUFpQixLQUFqQixHQUF5QkssU0FBekIsR0FBcUMsR0FBNUM7O0FBRUQsYUFBSyxVQUFMO0FBQ0MsaUJBQU8sTUFBTUwsUUFBTixHQUFpQixHQUF4Qjs7QUFFRCxhQUFLLElBQUw7QUFDQyxpQkFBTyxXQUFXQSxRQUFsQjs7QUFFRCxhQUFLLElBQUw7QUFDQyxpQkFBTyxNQUFNQSxRQUFiOztBQUVELGFBQUssSUFBTDtBQUNDLGlCQUFPLFdBQVdBLFFBQWxCOztBQUVELGFBQUssSUFBTDtBQUNDLGlCQUFPLE1BQU1BLFFBQWI7O0FBRUQsYUFBSyxJQUFMO0FBQ0MsaUJBQU9QLFNBQVMsQ0FBQ2EsT0FBVixDQUFrQiw0QkFBbEIsRUFBZ0QsQ0FBQyxNQUFNTixRQUFOLEdBQWlCLEtBQWpCLEdBQXlCSyxTQUF6QixHQUFxQyxHQUF0QyxDQUFoRCxDQUFQOztBQUVELGFBQUssSUFBTDtBQUNDLGlCQUFPLFdBQVdMLFFBQWxCOztBQUVELGFBQUssYUFBTDtBQUNDLGlCQUFPUCxTQUFTLENBQUNhLE9BQVYsQ0FBa0IsNEJBQWxCLEVBQWdELENBQUMsTUFBTU4sUUFBTixHQUFpQixHQUFsQixDQUFoRCxDQUFQOztBQUVELGFBQUssSUFBTDtBQUNBO0FBQ0MsaUJBQU9BLFFBQVA7QUE5QkY7QUFnQ0E7O0FBQ0QsUUFBSTVCLGdCQUFnQixDQUFDQyxNQUFqQixDQUF3QkMsTUFBeEIsS0FBbUMsQ0FBdkMsRUFBMEM7QUFDekMsYUFBTyxFQUFQO0FBQ0EsS0FGRCxNQUVPLElBQUlGLGdCQUFnQixDQUFDQyxNQUFqQixDQUF3QkMsTUFBeEIsS0FBbUMsQ0FBdkMsRUFBMEM7QUFDaEQsYUFBT3lCLFdBQVcsQ0FBQzNCLGdCQUFnQixDQUFDQyxNQUFqQixDQUF3QixDQUF4QixDQUFELENBQWxCO0FBQ0EsS0FGTSxNQUVBO0FBQ04sYUFBTyxNQUFNRCxnQkFBZ0IsQ0FBQ0MsTUFBakIsQ0FBd0JRLEdBQXhCLENBQTRCa0IsV0FBNUIsRUFBeUNRLElBQXpDLENBQThDLEdBQTlDLENBQU4sR0FBMkQsR0FBbEU7QUFDQTtBQUNEOztBQUVELFdBQVNDLGdCQUFULENBQTBCQyxNQUExQixFQUF5RDtBQUN4RCxRQUFNaEIsU0FBUyxHQUFHTCxHQUFHLENBQUNDLEVBQUosQ0FBT0MsT0FBUCxHQUFpQkksd0JBQWpCLENBQTBDLGFBQTFDLENBQWxCOztBQUVBLGFBQVNnQixVQUFULENBQW9CQyxLQUFwQixFQUE4RDtBQUM3RCxVQUFJQSxLQUFLLENBQUNyQyxNQUFOLEtBQWlCLENBQXJCLEVBQXdCO0FBQ3ZCLGVBQU8sRUFBUDtBQUNBLE9BRkQsTUFFTyxJQUFJcUMsS0FBSyxDQUFDckMsTUFBTixLQUFpQixDQUFyQixFQUF3QjtBQUM5QixlQUFPcUMsS0FBSyxDQUFDLENBQUQsQ0FBTCxDQUFTQyxLQUFoQjtBQUNBLE9BRk0sTUFFQTtBQUNOLFlBQUlDLEdBQUcsR0FBR0YsS0FBSyxDQUFDLENBQUQsQ0FBTCxDQUFTQyxLQUFuQjs7QUFDQSxhQUFLLElBQUlFLENBQUMsR0FBRyxDQUFiLEVBQWdCQSxDQUFDLEdBQUdILEtBQUssQ0FBQ3JDLE1BQU4sR0FBZSxDQUFuQyxFQUFzQ3dDLENBQUMsRUFBdkMsRUFBMkM7QUFDMUNELFVBQUFBLEdBQUcsSUFBSSxPQUFPRixLQUFLLENBQUNHLENBQUQsQ0FBTCxDQUFTRixLQUF2QjtBQUNBOztBQUVELGVBQU9uQixTQUFTLENBQUNhLE9BQVYsQ0FBa0IscUJBQWxCLEVBQXlDLENBQUNPLEdBQUQsRUFBTUYsS0FBSyxDQUFDQSxLQUFLLENBQUNyQyxNQUFOLEdBQWUsQ0FBaEIsQ0FBTCxDQUF3QnNDLEtBQTlCLENBQXpDLENBQVA7QUFDQTtBQUNEOztBQUVELFdBQU9uQixTQUFTLENBQUNhLE9BQVYsQ0FBa0Isc0JBQWxCLEVBQTBDLENBQUNJLFVBQVUsQ0FBQ0QsTUFBTSxDQUFDTSxLQUFQLENBQWFDLFFBQWQsQ0FBWCxFQUFvQ04sVUFBVSxDQUFDRCxNQUFNLENBQUNNLEtBQVAsQ0FBYUUsVUFBZCxDQUE5QyxDQUExQyxDQUFQO0FBQ0E7O0FBRUQsV0FBU0Msd0JBQVQsQ0FBa0NDLGVBQWxDLEVBQXVFQyxnQkFBdkUsRUFBb0c7QUFDbkcsWUFBUUQsZUFBZSxDQUFDRSxTQUF4QjtBQUNDLFdBQUssT0FBTDtBQUNDO0FBQ0FELFFBQUFBLGdCQUFnQixDQUFDRSxZQUFqQixHQUFnQztBQUMvQkMsVUFBQUEsS0FBSyxFQUFFO0FBQ05DLFlBQUFBLE9BQU8sRUFBRTtBQURIO0FBRHdCLFNBQWhDO0FBS0FKLFFBQUFBLGdCQUFnQixDQUFDSyxTQUFqQixHQUE2QjtBQUM1QkYsVUFBQUEsS0FBSyxFQUFFO0FBQ05DLFlBQUFBLE9BQU8sRUFBRTtBQURILFdBRHFCO0FBSTVCWixVQUFBQSxLQUFLLEVBQUU7QUFDTmMsWUFBQUEsWUFBWSxFQUFFO0FBRFI7QUFKcUIsU0FBN0I7QUFRQU4sUUFBQUEsZ0JBQWdCLENBQUNPLFFBQWpCLENBQTBCQyxTQUExQixHQUFzQztBQUNyQ0osVUFBQUEsT0FBTyxFQUFFLElBRDRCO0FBRXJDSyxVQUFBQSxJQUFJLEVBQUUsT0FGK0I7QUFHckNILFVBQUFBLFlBQVksRUFBRTtBQUh1QixTQUF0QztBQUtBOztBQUVELFdBQUssUUFBTDtBQUNDO0FBQ0FOLFFBQUFBLGdCQUFnQixDQUFDSyxTQUFqQixHQUE2QjtBQUM1QkYsVUFBQUEsS0FBSyxFQUFFO0FBQ05DLFlBQUFBLE9BQU8sRUFBRTtBQURILFdBRHFCO0FBSTVCWixVQUFBQSxLQUFLLEVBQUU7QUFDTmMsWUFBQUEsWUFBWSxFQUFFO0FBRFI7QUFKcUIsU0FBN0I7QUFRQU4sUUFBQUEsZ0JBQWdCLENBQUNVLFVBQWpCLEdBQThCO0FBQzdCUCxVQUFBQSxLQUFLLEVBQUU7QUFDTkMsWUFBQUEsT0FBTyxFQUFFO0FBREgsV0FEc0I7QUFJN0JaLFVBQUFBLEtBQUssRUFBRTtBQUNOYyxZQUFBQSxZQUFZLEVBQUU7QUFEUjtBQUpzQixTQUE5QjtBQVFBTixRQUFBQSxnQkFBZ0IsQ0FBQ1csV0FBakIsR0FBK0I7QUFDOUJDLFVBQUFBLE1BQU0sRUFBRTtBQUNQQyxZQUFBQSxRQUFRLEVBQUUsUUFESDtBQUVQQyxZQUFBQSxTQUFTLEVBQUU7QUFGSjtBQURzQixTQUEvQjtBQU1BZCxRQUFBQSxnQkFBZ0IsQ0FBQ2UsVUFBakIsR0FBOEI7QUFDN0JYLFVBQUFBLE9BQU8sRUFBRTtBQURvQixTQUE5QjtBQUdBSixRQUFBQSxnQkFBZ0IsQ0FBQ08sUUFBakIsQ0FBMEJDLFNBQTFCLEdBQXNDO0FBQUVKLFVBQUFBLE9BQU8sRUFBRTtBQUFYLFNBQXRDO0FBQ0E7O0FBRUQsV0FBSyxTQUFMO0FBQ0M7QUFDQUosUUFBQUEsZ0JBQWdCLENBQUNLLFNBQWpCLEdBQTZCO0FBQzVCRixVQUFBQSxLQUFLLEVBQUU7QUFDTkMsWUFBQUEsT0FBTyxFQUFFO0FBREgsV0FEcUI7QUFJNUJaLFVBQUFBLEtBQUssRUFBRTtBQUNOYyxZQUFBQSxZQUFZLEVBQUU7QUFEUjtBQUpxQixTQUE3QjtBQVFBTixRQUFBQSxnQkFBZ0IsQ0FBQ1UsVUFBakIsR0FBOEI7QUFDN0JQLFVBQUFBLEtBQUssRUFBRTtBQUNOQyxZQUFBQSxPQUFPLEVBQUU7QUFESCxXQURzQjtBQUk3QlosVUFBQUEsS0FBSyxFQUFFO0FBQ05jLFlBQUFBLFlBQVksRUFBRTtBQURSO0FBSnNCLFNBQTlCO0FBUUFOLFFBQUFBLGdCQUFnQixDQUFDTyxRQUFqQixDQUEwQkMsU0FBMUIsR0FBc0M7QUFBRUosVUFBQUEsT0FBTyxFQUFFO0FBQVgsU0FBdEM7QUFDQTs7QUFFRDtBQUNDO0FBQ0FKLFFBQUFBLGdCQUFnQixDQUFDRSxZQUFqQixHQUFnQztBQUMvQkMsVUFBQUEsS0FBSyxFQUFFO0FBQ05DLFlBQUFBLE9BQU8sRUFBRTtBQURIO0FBRHdCLFNBQWhDO0FBS0FKLFFBQUFBLGdCQUFnQixDQUFDSyxTQUFqQixHQUE2QjtBQUM1QkYsVUFBQUEsS0FBSyxFQUFFO0FBQ05DLFlBQUFBLE9BQU8sRUFBRTtBQURILFdBRHFCO0FBSTVCWixVQUFBQSxLQUFLLEVBQUU7QUFDTmMsWUFBQUEsWUFBWSxFQUFFO0FBRFI7QUFKcUIsU0FBN0I7QUFRQU4sUUFBQUEsZ0JBQWdCLENBQUNPLFFBQWpCLENBQTBCQyxTQUExQixHQUFzQztBQUFFSixVQUFBQSxPQUFPLEVBQUU7QUFBWCxTQUF0QztBQXpGRjtBQTJGQTs7QUFDRCxXQUFTWSxTQUFULENBQW1CQyxRQUFuQixFQUErRUMsTUFBL0UsRUFBMEg7QUFDekgsUUFBSUEsTUFBTSxJQUFJQSxNQUFNLENBQUNoRSxNQUFyQixFQUE2QjtBQUM1QixhQUFPK0QsUUFBUSxDQUNiRSxNQURLLENBQ0UsVUFBQUMsU0FBUyxFQUFJO0FBQ3BCLGVBQU9GLE1BQU0sQ0FBQ3BDLE9BQVAsQ0FBZXNDLFNBQVMsQ0FBQ0MsSUFBekIsS0FBa0MsQ0FBekM7QUFDQSxPQUhLLEVBSUw1RCxHQUpLLENBSUQsVUFBQTJELFNBQVMsRUFBSTtBQUNqQixlQUFPQSxTQUFTLENBQUM1QixLQUFqQjtBQUNBLE9BTkssQ0FBUDtBQU9BLEtBUkQsTUFRTztBQUNOLGFBQU95QixRQUFRLENBQUN4RCxHQUFULENBQWEsVUFBQTJELFNBQVMsRUFBSTtBQUNoQyxlQUFPQSxTQUFTLENBQUM1QixLQUFqQjtBQUNBLE9BRk0sQ0FBUDtBQUdBO0FBQ0Q7O0FBRUQsV0FBUzhCLDBCQUFULENBQW9DdkIsZUFBcEMsRUFBNEg7QUFDM0gsUUFBTXdCLGFBQWEsR0FBR1AsU0FBUyxDQUFDakIsZUFBZSxDQUFDSCxRQUFqQixFQUEyQixDQUFDLE9BQUQsQ0FBM0IsQ0FBL0I7QUFDQSxRQUFNNEIsYUFBYSxHQUFHUixTQUFTLENBQUNqQixlQUFlLENBQUNILFFBQWpCLEVBQTJCLENBQUMsT0FBRCxDQUEzQixDQUEvQjtBQUNBLFFBQU02QixhQUFhLEdBQUdULFNBQVMsQ0FBQ2pCLGVBQWUsQ0FBQ0gsUUFBakIsRUFBMkIsQ0FBQyxPQUFELENBQTNCLENBQS9CO0FBQ0EsUUFBTThCLGFBQWEsR0FBR1YsU0FBUyxDQUFDakIsZUFBZSxDQUFDSCxRQUFqQixFQUEyQixDQUFDdkQsU0FBRCxDQUEzQixDQUEvQjtBQUNBLFFBQU1zRixnQkFBZ0IsR0FBR1gsU0FBUyxDQUFDakIsZUFBZSxDQUFDRixVQUFqQixFQUE2QixDQUFDLFFBQUQsQ0FBN0IsQ0FBbEMsQ0FMMkgsQ0FPM0g7O0FBQ0EsUUFBTStCLGNBQWMsR0FBRzdCLGVBQWUsQ0FBQ0YsVUFBaEIsQ0FBMkJnQyxJQUEzQixDQUFnQyxVQUFBVCxTQUFTLEVBQUk7QUFDbkUsYUFBT0EsU0FBUyxDQUFDQyxJQUFWLEtBQW1CLFVBQTFCO0FBQ0EsS0FGc0IsQ0FBdkIsQ0FSMkgsQ0FZM0g7O0FBQ0EsUUFBTVMsUUFBUSxHQUFHUCxhQUFhLENBQUNRLEtBQWQsTUFBeUJQLGFBQWEsQ0FBQ08sS0FBZCxFQUF6QixJQUFrRE4sYUFBYSxDQUFDTSxLQUFkLEVBQWxELElBQTJFTCxhQUFhLENBQUNLLEtBQWQsRUFBM0UsSUFBb0csRUFBckgsQ0FiMkgsQ0FjM0g7O0FBQ0EsUUFBTUMsUUFBUSxHQUFHUixhQUFhLENBQUNPLEtBQWQsTUFBeUJSLGFBQWEsQ0FBQ1EsS0FBZCxFQUF6QixJQUFrRE4sYUFBYSxDQUFDTSxLQUFkLEVBQWxELElBQTJFTCxhQUFhLENBQUNLLEtBQWQsRUFBM0UsSUFBb0csRUFBckg7QUFDQSxRQUFNdEMsR0FBRyxHQUFHLENBQ1g7QUFDQyxhQUFPLFdBRFI7QUFFQyxjQUFRLFNBRlQ7QUFHQyxnQkFBVSxDQUFDcUMsUUFBRDtBQUhYLEtBRFcsRUFNWDtBQUNDLGFBQU8sWUFEUjtBQUVDLGNBQVEsU0FGVDtBQUdDLGdCQUFVLENBQUNFLFFBQUQ7QUFIWCxLQU5XLENBQVo7O0FBYUEsUUFBSWpDLGVBQWUsQ0FBQ0UsU0FBaEIsS0FBOEIsUUFBbEMsRUFBNEM7QUFDM0M7QUFDQSxVQUFNZ0MsV0FBVyxHQUFHUixhQUFhLENBQUNNLEtBQWQsTUFBeUJSLGFBQWEsQ0FBQ1EsS0FBZCxFQUF6QixJQUFrRFAsYUFBYSxDQUFDTyxLQUFkLEVBQWxELElBQTJFTCxhQUFhLENBQUNLLEtBQWQsRUFBM0UsSUFBb0csRUFBeEg7QUFDQXRDLE1BQUFBLEdBQUcsQ0FBQ3lDLElBQUosQ0FBUztBQUNSLGVBQU8sYUFEQztBQUVSLGdCQUFRLFNBRkE7QUFHUixrQkFBVSxDQUFDRCxXQUFEO0FBSEYsT0FBVDtBQUtBLEtBckMwSCxDQXVDM0g7OztBQUNBLFFBQUlOLGdCQUFnQixDQUFDekUsTUFBckIsRUFBNkI7QUFDNUJ1QyxNQUFBQSxHQUFHLENBQUN5QyxJQUFKLENBQVM7QUFDUixlQUFPLE9BREM7QUFFUixnQkFBUSxXQUZBO0FBR1Isa0JBQVVQO0FBSEYsT0FBVDtBQUtBLEtBOUMwSCxDQStDM0g7OztBQUNBLFFBQUlDLGNBQUosRUFBb0I7QUFDbkJuQyxNQUFBQSxHQUFHLENBQUN5QyxJQUFKLENBQVM7QUFDUixlQUFPLE9BREM7QUFFUixnQkFBUSxXQUZBO0FBR1Isa0JBQVUsQ0FBQ04sY0FBYyxDQUFDcEMsS0FBaEI7QUFIRixPQUFUO0FBS0E7O0FBQ0QsV0FBT0MsR0FBUDtBQUNBOztBQUVELFdBQVMwQyxhQUFULENBQXVCcEMsZUFBdkIsRUFBK0c7QUFDOUcsUUFBSU4sR0FBSjs7QUFFQSxZQUFRTSxlQUFlLENBQUNFLFNBQXhCO0FBQ0MsV0FBSyxPQUFMO0FBQ0NSLFFBQUFBLEdBQUcsR0FBRyxDQUNMO0FBQ0MsaUJBQU8sTUFEUjtBQUVDLGtCQUFRLFNBRlQ7QUFHQyxvQkFBVXVCLFNBQVMsQ0FBQ2pCLGVBQWUsQ0FBQ0gsUUFBakI7QUFIcEIsU0FESyxFQU1MO0FBQ0MsaUJBQU8sT0FEUjtBQUVDLGtCQUFRLFdBRlQ7QUFHQyxvQkFBVW9CLFNBQVMsQ0FBQ2pCLGVBQWUsQ0FBQ0YsVUFBakI7QUFIcEIsU0FOSyxDQUFOO0FBWUE7O0FBRUQsV0FBSyxRQUFMO0FBQ0EsV0FBSyxTQUFMO0FBQ0NKLFFBQUFBLEdBQUcsR0FBRzZCLDBCQUEwQixDQUFDdkIsZUFBRCxDQUFoQztBQUNBOztBQUVELFdBQUssaUJBQUw7QUFDQ04sUUFBQUEsR0FBRyxHQUFHLENBQ0w7QUFDQyxpQkFBTyxjQURSO0FBRUMsa0JBQVEsU0FGVDtBQUdDLG9CQUFVdUIsU0FBUyxDQUFDakIsZUFBZSxDQUFDSCxRQUFqQixFQUEyQixDQUFDdkQsU0FBRCxFQUFZLE9BQVosQ0FBM0I7QUFIcEIsU0FESyxFQU1MO0FBQ0MsaUJBQU8sY0FEUjtBQUVDLGtCQUFRLFNBRlQ7QUFHQyxvQkFBVTJFLFNBQVMsQ0FBQ2pCLGVBQWUsQ0FBQ0gsUUFBakIsRUFBMkIsQ0FBQyxPQUFELENBQTNCO0FBSHBCLFNBTkssRUFXTDtBQUNDLGlCQUFPLGNBRFI7QUFFQyxrQkFBUSxXQUZUO0FBR0Msb0JBQVVvQixTQUFTLENBQUNqQixlQUFlLENBQUNGLFVBQWpCLEVBQTZCLENBQUN4RCxTQUFELEVBQVksVUFBWixDQUE3QjtBQUhwQixTQVhLLEVBZ0JMO0FBQ0MsaUJBQU8sT0FEUjtBQUVDLGtCQUFRLFdBRlQ7QUFHQyxvQkFBVTJFLFNBQVMsQ0FBQ2pCLGVBQWUsQ0FBQ0YsVUFBakIsRUFBNkIsQ0FBQyxRQUFELENBQTdCO0FBSHBCLFNBaEJLLENBQU47QUFzQkE7O0FBRUQ7QUFDQ0osUUFBQUEsR0FBRyxHQUFHLENBQ0w7QUFDQyxpQkFBTyxXQURSO0FBRUMsa0JBQVEsU0FGVDtBQUdDLG9CQUFVdUIsU0FBUyxDQUFDakIsZUFBZSxDQUFDSCxRQUFqQjtBQUhwQixTQURLLEVBTUw7QUFDQyxpQkFBTyxjQURSO0FBRUMsa0JBQVEsV0FGVDtBQUdDLG9CQUFVb0IsU0FBUyxDQUFDakIsZUFBZSxDQUFDRixVQUFqQixFQUE2QixDQUFDeEQsU0FBRCxFQUFZLFVBQVosQ0FBN0I7QUFIcEIsU0FOSyxFQVdMO0FBQ0MsaUJBQU8sT0FEUjtBQUVDLGtCQUFRLFdBRlQ7QUFHQyxvQkFBVTJFLFNBQVMsQ0FBQ2pCLGVBQWUsQ0FBQ0YsVUFBakIsRUFBNkIsQ0FBQyxRQUFELENBQTdCO0FBSHBCLFNBWEssQ0FBTjtBQS9DRjs7QUFrRUEsV0FBT0osR0FBUDtBQUNBO0FBRUQ7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7TUFFTTJDLGdDLFdBRExDLFFBQVEsQ0FBQyxnREFBRCxFQUFtREMsMkJBQW5ELEMsVUF1R1BDLFFBQVEsRSxVQXdCUkEsUUFBUSxFOzs7Ozs7Ozs7Ozs7OztBQXpIVDtBQUNEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQyxnQ0FBMkJDLGFBQTNCLEVBQXlEQyxTQUF6RCxFQUEwRjtBQUFBOztBQUN6RixZQUFNQyxhQUFrQixHQUFHO0FBQzFCLHFCQUFXO0FBQ1ZDLFlBQUFBLEVBQUUsRUFBRSxRQURNO0FBRVZsQyxZQUFBQSxJQUFJLEVBQUU7QUFGSSxXQURlO0FBSzFCLG9CQUFVO0FBQ1RtQyxZQUFBQSxVQUFVLEVBQUU7QUFESCxXQUxnQjtBQVExQixzQkFBWTtBQUNYbkMsWUFBQUEsSUFBSSxFQUFFLFlBREs7QUFFWG9DLFlBQUFBLElBQUksRUFBRTtBQUNMQyxjQUFBQSxJQUFJLEVBQUU7QUFERCxhQUZLO0FBS1hDLFlBQUFBLE1BQU0sRUFBRTtBQUNQdEMsY0FBQUEsSUFBSSxFQUFFLFNBREM7QUFFUE4sY0FBQUEsS0FBSyxFQUFFcUMsYUFBYSxDQUFDUSxTQUFkLENBQXdCN0MsS0FGeEI7QUFHUDhDLGNBQUFBLFFBQVEsRUFBRVQsYUFBYSxDQUFDUSxTQUFkLENBQXdCRSxXQUgzQjtBQUlQQyxjQUFBQSxpQkFBaUIsRUFBRSxZQUpaO0FBS1BDLGNBQUFBLGFBQWEsRUFBRTtBQUNkQyxnQkFBQUEsTUFBTSxFQUFFLG9CQURNO0FBRWRDLGdCQUFBQSxJQUFJLEVBQUUsa0JBRlE7QUFHZEMsZ0JBQUFBLEtBQUssRUFBRSxhQUhPO0FBSWRDLGdCQUFBQSxLQUFLLEVBQUU7QUFKTztBQUxSLGFBTEc7QUFpQlhDLFlBQUFBLE9BQU8sRUFBRTtBQUNSQyxjQUFBQSxTQUFTLEVBQUUsT0FESDtBQUVSQyxjQUFBQSxlQUFlLEVBQUU7QUFDaEJwRCxnQkFBQUEsUUFBUSxFQUFFLEVBRE07QUFFaEJKLGdCQUFBQSxLQUFLLEVBQUU7QUFDTkMsa0JBQUFBLE9BQU8sRUFBRSxJQURIO0FBRU5VLGtCQUFBQSxTQUFTLEVBQUU7QUFGTDtBQUZTLGVBRlQ7QUFTUitCLGNBQUFBLElBQUksRUFBRTtBQUNMZSxnQkFBQUEsSUFBSSxFQUFFO0FBREQ7QUFURTtBQWpCRTtBQVJjLFNBQTNCLENBRHlGLENBMEN6Rjs7QUFDQSxZQUFJcEIsYUFBYSxDQUFDUSxTQUFkLENBQXdCYSxVQUF4QixJQUFzQ3JCLGFBQWEsQ0FBQ1EsU0FBZCxDQUF3QmMsV0FBeEIsS0FBd0N6SCxTQUFsRixFQUE2RjtBQUM1RixjQUFNZ0MsU0FBUyxHQUFHTCxHQUFHLENBQUNDLEVBQUosQ0FBT0MsT0FBUCxHQUFpQkksd0JBQWpCLENBQTBDLGFBQTFDLENBQWxCO0FBQ0FvRSxVQUFBQSxhQUFhLENBQUMsVUFBRCxDQUFiLENBQTBCSyxNQUExQixDQUFpQ2dCLGNBQWpDLEdBQWtELENBQ2pEO0FBQ0M1RCxZQUFBQSxLQUFLLEVBQUU5QixTQUFTLENBQUNhLE9BQVYsQ0FBa0IsNEJBQWxCLENBRFI7QUFFQ21FLFlBQUFBLE1BQU0sRUFBRSxnQkFGVDtBQUdDQyxZQUFBQSxJQUFJLEVBQUU7QUFIUCxXQURpRCxFQU1qRDtBQUNDbkQsWUFBQUEsS0FBSyxFQUFFOUIsU0FBUyxDQUFDYSxPQUFWLENBQWtCLCtCQUFsQixDQURSO0FBRUNtRSxZQUFBQSxNQUFNLEVBQUUsbUJBRlQ7QUFHQ0MsWUFBQUEsSUFBSSxFQUFFO0FBSFAsV0FOaUQsQ0FBbEQ7QUFZQSxTQXpEd0YsQ0EyRHpGOzs7QUFDQSxxQ0FBSWQsYUFBYSxDQUFDd0IsaUNBQWxCLGtEQUFJLHNCQUFpRDlHLE1BQXJELEVBQTZEO0FBQzVELGNBQU0rRyxhQUF1QixHQUFHLEVBQWhDO0FBQ0F6QixVQUFBQSxhQUFhLENBQUN3QixpQ0FBZCxDQUFnREUsT0FBaEQsQ0FBd0QsVUFBQWxILGdCQUFnQixFQUFJO0FBQzNFLGdCQUFNbUgsSUFBSSxHQUFHdEcsNkJBQTZCLENBQUNiLGdCQUFELENBQTFDOztBQUNBLGdCQUFJbUgsSUFBSixFQUFVO0FBQ1RGLGNBQUFBLGFBQWEsQ0FBQy9CLElBQWQsQ0FBbUJpQyxJQUFuQjtBQUNBO0FBQ0QsV0FMRDs7QUFPQSxjQUFJRixhQUFhLENBQUMvRyxNQUFsQixFQUEwQjtBQUN6QndGLFlBQUFBLGFBQWEsQ0FBQyxVQUFELENBQWIsQ0FBMEJLLE1BQTFCLENBQWlDcUIsT0FBakMsR0FBMkNILGFBQWEsQ0FBQzlFLElBQWQsQ0FBbUIsSUFBbkIsQ0FBM0M7QUFDQTtBQUNELFNBeEV3RixDQTBFekY7OztBQUNBdUQsUUFBQUEsYUFBYSxDQUFDLFVBQUQsQ0FBYixDQUEwQmUsT0FBMUIsQ0FBa0N4RCxTQUFsQyxHQUE4Q3VDLGFBQWEsQ0FBQzdDLEtBQWQsQ0FBb0JNLFNBQWxFO0FBQ0FILFFBQUFBLHdCQUF3QixDQUFDMEMsYUFBYSxDQUFDN0MsS0FBZixFQUFzQitDLGFBQWEsQ0FBQyxVQUFELENBQWIsQ0FBMEJlLE9BQTFCLENBQWtDRSxlQUF4RCxDQUF4QjtBQUNBakIsUUFBQUEsYUFBYSxDQUFDLFVBQUQsQ0FBYixDQUEwQmUsT0FBMUIsQ0FBa0NFLGVBQWxDLENBQWtEeEQsS0FBbEQsQ0FBd0RrRSxJQUF4RCxHQUErRGpGLGdCQUFnQixDQUFDb0QsYUFBRCxDQUEvRTtBQUNBRSxRQUFBQSxhQUFhLENBQUMsVUFBRCxDQUFiLENBQTBCZSxPQUExQixDQUFrQzVELFVBQWxDLEdBQStDMkMsYUFBYSxDQUFDN0MsS0FBZCxDQUFvQkUsVUFBcEIsQ0FBK0JwQyxHQUEvQixDQUFtQyxVQUFBMkQsU0FBUyxFQUFJO0FBQzlGLGlCQUFPO0FBQUU1QixZQUFBQSxLQUFLLEVBQUU0QixTQUFTLENBQUM1QixLQUFuQjtBQUEwQjhFLFlBQUFBLEtBQUssRUFBRSxNQUFNbEQsU0FBUyxDQUFDbUQsSUFBaEIsR0FBdUI7QUFBeEQsV0FBUDtBQUNBLFNBRjhDLENBQS9DO0FBR0E3QixRQUFBQSxhQUFhLENBQUMsVUFBRCxDQUFiLENBQTBCZSxPQUExQixDQUFrQzdELFFBQWxDLEdBQTZDNEMsYUFBYSxDQUFDN0MsS0FBZCxDQUFvQkMsUUFBcEIsQ0FBNkJuQyxHQUE3QixDQUFpQyxVQUFBK0csT0FBTyxFQUFJO0FBQ3hGLGlCQUFPO0FBQUVoRixZQUFBQSxLQUFLLEVBQUVnRixPQUFPLENBQUNoRixLQUFqQjtBQUF3QjhFLFlBQUFBLEtBQUssRUFBRSxNQUFNRSxPQUFPLENBQUNELElBQWQsR0FBcUI7QUFBcEQsV0FBUDtBQUNBLFNBRjRDLENBQTdDO0FBR0E3QixRQUFBQSxhQUFhLENBQUMsVUFBRCxDQUFiLENBQTBCZSxPQUExQixDQUFrQ2dCLEtBQWxDLEdBQTBDdEMsYUFBYSxDQUFDSyxhQUFhLENBQUM3QyxLQUFmLENBQXZEO0FBRUE4QyxRQUFBQSxTQUFTLENBQUNpQyxXQUFWLENBQXNCLE1BQU1sQyxhQUFhLENBQUNHLEVBQTFDLEVBQThDO0FBQzdDZ0MsVUFBQUEsUUFBUSxFQUFFakM7QUFEbUMsU0FBOUM7QUFHQTs7O2FBRUQsa0JBQ3NCO0FBQUE7O0FBQ3JCLGFBQUtrQyxlQUFMLEdBQXVCLEtBQUtDLFVBQUwsRUFBdkI7O0FBRUEsWUFBSSxLQUFLRCxlQUFMLElBQXdCLEtBQUtBLGVBQUwsQ0FBcUIxSCxNQUFqRCxFQUF5RDtBQUN4RCxjQUFNNEgsS0FBSyxHQUFHLEtBQUtDLE9BQUwsRUFBZDtBQUNBLGNBQU1DLGFBQWEsR0FBSUYsS0FBSyxDQUFDRyxhQUFOLEVBQUQsQ0FBMENDLGVBQTFDLEVBQXRCLENBRndELENBSXhEOztBQUNBLGNBQU16QyxTQUFTLEdBQUcsSUFBSTBDLFNBQUosRUFBbEI7QUFDQUwsVUFBQUEsS0FBSyxDQUFDTSxRQUFOLENBQWUzQyxTQUFmLEVBQTBCLFVBQTFCO0FBRUEsZUFBS21DLGVBQUwsQ0FBcUJWLE9BQXJCLENBQTZCLFVBQUExQixhQUFhLEVBQUk7QUFDN0M7QUFDQSxZQUFBLEtBQUksQ0FBQzZDLGdCQUFMLENBQXNCN0MsYUFBdEIsRUFBcUNDLFNBQXJDLEVBRjZDLENBSTdDOzs7QUFDQSxZQUFBLEtBQUksQ0FBQzZDLGNBQUwsQ0FBb0I5QyxhQUFwQixFQUFtQ3dDLGFBQWEsQ0FBQ08sUUFBZCxFQUFuQyxFQUEyRTlDLFNBQTNFLEVBQXNGK0MsS0FBdEYsQ0FBNEYsVUFBU0MsR0FBVCxFQUFtQjtBQUM5R0MsY0FBQUEsR0FBRyxDQUFDQyxLQUFKLENBQVVGLEdBQVY7QUFDQSxhQUZEO0FBR0EsV0FSRDtBQVNBO0FBQ0Q7OzthQUVELGtCQUNzQjtBQUNyQixZQUFNaEQsU0FBUyxHQUFHLEtBQUtzQyxPQUFMLEdBQWVRLFFBQWYsQ0FBd0IsVUFBeEIsQ0FBbEI7O0FBRUEsWUFBSTlDLFNBQUosRUFBZTtBQUNkQSxVQUFBQSxTQUFTLENBQUNtRCxPQUFWO0FBQ0E7QUFDRDs7O2FBRUQsc0JBQWtEO0FBQ2pELFlBQU1kLEtBQUssR0FBRyxLQUFLQyxPQUFMLEVBQWQ7QUFBQSxZQUNDYyxXQUFXLEdBQUdmLEtBQUssQ0FBQ2dCLFVBQU4sR0FBbUIsQ0FBbkIsRUFBc0JqRCxJQUF0QixDQUEyQixTQUEzQixDQURmOztBQUdBLFlBQUlnRCxXQUFKLEVBQWlCO0FBQ2hCLGNBQU1FLEtBQUssR0FBRyxPQUFPRixXQUFQLEtBQXVCLFFBQXZCLEdBQWtDRyxJQUFJLENBQUNDLEtBQUwsQ0FBV0osV0FBWCxDQUFsQyxHQUE0REEsV0FBMUU7O0FBQ0EsY0FBSSxnQkFBZ0JFLEtBQXBCLEVBQTJCO0FBQzFCLG1CQUFPQSxLQUFLLENBQUMsWUFBRCxDQUFaO0FBQ0EsV0FGRCxNQUVPO0FBQ04sbUJBQU9BLEtBQVA7QUFDQTtBQUNELFNBUEQsTUFPTztBQUNOLGlCQUFPMUosU0FBUDtBQUNBO0FBQ0Q7OzthQUVELHlDQUF3Q21HLGFBQXhDLEVBQXNFMEQsVUFBdEUsRUFBMkZ6RCxTQUEzRixFQUFzSDtBQUFBOztBQUNySCxZQUFNM0UsYUFBYSxHQUFHLElBQUlDLE1BQUosQ0FDckJDLEdBQUcsQ0FBQ0MsRUFBSixDQUNFQyxPQURGLEdBRUVDLGdCQUZGLEdBR0VDLFdBSEYsRUFEcUIsQ0FBdEI7QUFNQSxZQUFNK0gsT0FBTyxHQUFHLHlCQUFBM0QsYUFBYSxDQUFDUSxTQUFkLENBQXdCTSxJQUF4Qix3RUFBOEI4QyxNQUE5QixHQUNiRixVQUFVLENBQUNHLFdBQVgsQ0FBdUI3RCxhQUFhLENBQUNRLFNBQWQsQ0FBd0JNLElBQXhCLENBQTZCZ0IsS0FBcEQsQ0FEYSw2QkFFYjlCLGFBQWEsQ0FBQ1EsU0FBZCxDQUF3Qk0sSUFGWCwyREFFYix1QkFBOEJnQixLQUZqQztBQUlBLFlBQU1nQyxZQUFZLEdBQUcsMkJBQUE5RCxhQUFhLENBQUNRLFNBQWQsQ0FBd0JNLElBQXhCLGtGQUE4QmlELFVBQTlCLE1BQTZDLEtBQTdDLElBQXNESixPQUFPLEtBQUssR0FBdkYsQ0FYcUgsQ0Fhckg7QUFDQTs7QUFDQSxZQUFNSyxRQUFRLEdBQUdDLE1BQU0sQ0FBQ0MsVUFBUCxDQUFrQlIsVUFBVSxDQUFDRyxXQUFYLENBQXVCN0QsYUFBYSxDQUFDUSxTQUFkLENBQXdCNUYsWUFBL0MsQ0FBbEIsQ0FBakIsQ0FmcUgsQ0FpQnJIOztBQUNBLFlBQU1sQixRQUFRLEdBQUd5SyxZQUFZLENBQUNDLGdCQUFiLENBQ2hCO0FBQ0NsSSxVQUFBQSxLQUFLLEVBQUU0SCxZQUFZLEdBQUdqSyxTQUFILEdBQWUsT0FEbkM7QUFFQ3dLLFVBQUFBLGlCQUFpQixFQUFFLENBRnBCO0FBR0NDLFVBQUFBLGlCQUFpQixFQUFFLENBSHBCO0FBSUNDLFVBQUFBLFNBQVMsRUFBRSxDQUFDVDtBQUpiLFNBRGdCLEVBT2hCeEksYUFQZ0IsRUFRZmlCLE1BUmUsQ0FRUnlILFFBUlEsQ0FBakI7QUFTQS9ELFFBQUFBLFNBQVMsQ0FBQ2lDLFdBQVYsQ0FBc0IsTUFBTWxDLGFBQWEsQ0FBQ0csRUFBcEIsR0FBeUIsd0NBQS9DLEVBQXlGekcsUUFBekYsRUEzQnFILENBNkJySDs7QUFDQSxZQUFNOEssZ0JBQWdCLEdBQUdMLFlBQVksQ0FBQ0MsZ0JBQWIsQ0FDeEI7QUFDQ0UsVUFBQUEsaUJBQWlCLEVBQUUsQ0FEcEI7QUFFQ0MsVUFBQUEsU0FBUyxFQUFFLEtBRlo7QUFHQ0UsVUFBQUEsZUFBZSxFQUFFO0FBSGxCLFNBRHdCLEVBTXhCbkosYUFOd0IsRUFPdkJpQixNQVB1QixDQU9oQnlILFFBUGdCLENBQXpCO0FBUUEvRCxRQUFBQSxTQUFTLENBQUNpQyxXQUFWLENBQXNCLE1BQU1sQyxhQUFhLENBQUNHLEVBQXBCLEdBQXlCLGdEQUEvQyxFQUFpR3FFLGdCQUFqRyxFQXRDcUgsQ0F3Q3JIOztBQUNBLFlBQU1FLGVBQWUsR0FBR1AsWUFBWSxDQUFDQyxnQkFBYixDQUN2QjtBQUNDbEksVUFBQUEsS0FBSyxFQUFFNEgsWUFBWSxHQUFHakssU0FBSCxHQUFlLE9BRG5DO0FBRUN3SyxVQUFBQSxpQkFBaUIsRUFBRSxDQUZwQjtBQUdDQyxVQUFBQSxpQkFBaUIsRUFBRSxDQUhwQjtBQUlDQyxVQUFBQSxTQUFTLEVBQUU7QUFKWixTQUR1QixFQU92QmpKLGFBUHVCLEVBUXRCaUIsTUFSc0IsQ0FRZnlILFFBUmUsQ0FBeEI7QUFTQS9ELFFBQUFBLFNBQVMsQ0FBQ2lDLFdBQVYsQ0FBc0IsTUFBTWxDLGFBQWEsQ0FBQ0csRUFBcEIsR0FBeUIsK0NBQS9DLEVBQWdHdUUsZUFBaEcsRUFsRHFILENBb0RySDs7QUFDQSxZQUFNQyxhQUFhLEdBQUdSLFlBQVksQ0FBQ0MsZ0JBQWIsQ0FDckI7QUFDQ2xJLFVBQUFBLEtBQUssRUFBRTRILFlBQVksR0FBR2pLLFNBQUgsR0FBZSxPQURuQztBQUVDK0ssVUFBQUEsUUFBUSxFQUFFLENBRlg7QUFHQ0MsVUFBQUEsZ0JBQWdCLEVBQUUsQ0FIbkI7QUFJQ04sVUFBQUEsU0FBUyxFQUFFO0FBSlosU0FEcUIsRUFPckJqSixhQVBxQixFQVFwQmlCLE1BUm9CLENBUWJ5SCxRQVJhLENBQXRCO0FBU0EvRCxRQUFBQSxTQUFTLENBQUNpQyxXQUFWLENBQXNCLE1BQU1sQyxhQUFhLENBQUNHLEVBQXBCLEdBQXlCLDZDQUEvQyxFQUE4RndFLGFBQTlGLEVBOURxSCxDQWdFckg7QUFDQTs7QUFDQSxZQUFJM0UsYUFBYSxDQUFDUSxTQUFkLENBQXdCTSxJQUF4QixJQUFnQzZDLE9BQXBDLEVBQTZDO0FBQzVDLGNBQUkzRCxhQUFhLENBQUNRLFNBQWQsQ0FBd0JNLElBQXhCLENBQTZCaUQsVUFBakMsRUFBNkM7QUFDNUM5RCxZQUFBQSxTQUFTLENBQUNpQyxXQUFWLENBQXNCLE1BQU1sQyxhQUFhLENBQUNHLEVBQXBCLEdBQXlCLHVDQUEvQyxFQUF3RndELE9BQXhGO0FBQ0EsV0FGRCxNQUVPO0FBQ047QUFDQSxnQkFBTW1CLE9BQU8sR0FBR1gsWUFBWSxDQUFDWSxlQUFiLENBQTZCO0FBQUVDLGNBQUFBLFVBQVUsRUFBRTtBQUFkLGFBQTdCLEVBQW9EMUosYUFBcEQsRUFBbUVpQixNQUFuRSxDQUEwRXlILFFBQTFFLEVBQW9GTCxPQUFwRixDQUFoQjtBQUNBMUQsWUFBQUEsU0FBUyxDQUFDaUMsV0FBVixDQUFzQixNQUFNbEMsYUFBYSxDQUFDRyxFQUFwQixHQUF5Qix1Q0FBL0MsRUFBd0YyRSxPQUF4RjtBQUNBO0FBQ0Q7QUFDRDs7O2FBRUQsb0NBQW1DOUUsYUFBbkMsRUFBaUUwRCxVQUFqRSxFQUFzRnpELFNBQXRGLEVBQWlIO0FBQ2hILFlBQU0rRCxRQUFRLEdBQUdDLE1BQU0sQ0FBQ0MsVUFBUCxDQUFrQlIsVUFBVSxDQUFDRyxXQUFYLENBQXVCN0QsYUFBYSxDQUFDUSxTQUFkLENBQXdCNUYsWUFBL0MsQ0FBbEIsQ0FBakI7QUFFQSxZQUFJcUssZ0JBQWdCLEdBQUcvTCxXQUFXLENBQUNNLElBQW5DOztBQUNBLFlBQUl3RyxhQUFhLENBQUNRLFNBQWQsQ0FBd0J5RSxnQkFBNUIsRUFBOEM7QUFDN0M7QUFDQUEsVUFBQUEsZ0JBQWdCLEdBQUdqRixhQUFhLENBQUNRLFNBQWQsQ0FBd0J5RSxnQkFBM0M7QUFDQSxTQUhELE1BR08sSUFBSWpGLGFBQWEsQ0FBQ1EsU0FBZCxDQUF3QjBFLGVBQTVCLEVBQTZDO0FBQ25EO0FBQ0FELFVBQUFBLGdCQUFnQixHQUNmaE0sMEJBQTBCLENBQUN5SyxVQUFVLENBQUNHLFdBQVgsQ0FBdUI3RCxhQUFhLENBQUNRLFNBQWQsQ0FBd0IwRSxlQUEvQyxDQUFELENBQTFCLElBQStGaE0sV0FBVyxDQUFDTSxJQUQ1RztBQUVBLFNBSk0sTUFJQSxJQUFJd0csYUFBYSxDQUFDUSxTQUFkLENBQXdCMkUsZ0NBQXhCLElBQTREbkYsYUFBYSxDQUFDUSxTQUFkLENBQXdCNEUsMEJBQXhGLEVBQW9IO0FBQzFIO0FBQ0Esa0JBQVFwRixhQUFhLENBQUNRLFNBQWQsQ0FBd0I0RSwwQkFBaEM7QUFDQyxpQkFBSyxvQ0FBTDtBQUNDSCxjQUFBQSxnQkFBZ0IsR0FBR3hMLGdDQUFnQyxDQUFDdUssUUFBRCxFQUFXaEUsYUFBYSxDQUFDUSxTQUFkLENBQXdCMkUsZ0NBQW5DLENBQW5EO0FBQ0E7O0FBRUQsaUJBQUssc0NBQUw7QUFDQ0YsY0FBQUEsZ0JBQWdCLEdBQUduTCxrQ0FBa0MsQ0FDcERrSyxRQURvRCxFQUVwRGhFLGFBQWEsQ0FBQ1EsU0FBZCxDQUF3QjJFLGdDQUY0QixDQUFyRDtBQUlBOztBQUVELGlCQUFLLHNDQUFMO0FBQ0E7QUFDQ0YsY0FBQUEsZ0JBQWdCLEdBQUdsTCxrQ0FBa0MsQ0FDcERpSyxRQURvRCxFQUVwRGhFLGFBQWEsQ0FBQ1EsU0FBZCxDQUF3QjJFLGdDQUY0QixDQUFyRDtBQUlBO0FBbEJGO0FBb0JBOztBQUVEbEYsUUFBQUEsU0FBUyxDQUFDaUMsV0FBVixDQUFzQixNQUFNbEMsYUFBYSxDQUFDRyxFQUFwQixHQUF5Qiw4Q0FBL0MsRUFBK0Y4RSxnQkFBL0Y7QUFDQWhGLFFBQUFBLFNBQVMsQ0FBQ2lDLFdBQVYsQ0FDQyxNQUFNbEMsYUFBYSxDQUFDRyxFQUFwQixHQUF5Qix3Q0FEMUIsRUFFQzVHLHlCQUF5QixDQUFDMEwsZ0JBQUQsQ0FBekIsSUFBK0MsTUFGaEQ7QUFJQTs7O2FBRUQsOEJBQTZCakYsYUFBN0IsRUFBMkQwRCxVQUEzRCxFQUFnRnpELFNBQWhGLEVBQTJHO0FBQzFHLFlBQU0rRCxRQUFRLEdBQUdDLE1BQU0sQ0FBQ0MsVUFBUCxDQUFrQlIsVUFBVSxDQUFDRyxXQUFYLENBQXVCN0QsYUFBYSxDQUFDUSxTQUFkLENBQXdCNUYsWUFBL0MsQ0FBbEIsQ0FBakI7QUFFQSxZQUFJWCxVQUFVLEdBQUcsTUFBakI7O0FBRUEsWUFBSStGLGFBQWEsQ0FBQ1EsU0FBZCxDQUF3QnZHLFVBQTVCLEVBQXdDO0FBQ3ZDO0FBQ0FBLFVBQUFBLFVBQVUsR0FBRytGLGFBQWEsQ0FBQ1EsU0FBZCxDQUF3QnZHLFVBQXJDO0FBQ0EsU0FIRCxNQUdPLElBQUkrRixhQUFhLENBQUNRLFNBQWQsQ0FBd0I2RSxTQUE1QixFQUF1QztBQUM3QztBQUNBcEwsVUFBQUEsVUFBVSxHQUFHRCwrQkFBK0IsQ0FBQzBKLFVBQVUsQ0FBQ0csV0FBWCxDQUF1QjdELGFBQWEsQ0FBQ1EsU0FBZCxDQUF3QjZFLFNBQS9DLENBQUQsQ0FBNUM7QUFDQSxTQUhNLE1BR0EsSUFDTnJGLGFBQWEsQ0FBQ1EsU0FBZCxDQUF3QjhFLDhCQUF4QixLQUEyRHpMLFNBQTNELElBQ0FtRyxhQUFhLENBQUNRLFNBQWQsQ0FBd0IrRSw2QkFGbEIsRUFHTDtBQUNEO0FBQ0EsY0FBSUMsbUJBQUo7O0FBQ0EsY0FBSXhGLGFBQWEsQ0FBQ1EsU0FBZCxDQUF3QjhFLDhCQUF4QixLQUEyRHpMLFNBQS9ELEVBQTBFO0FBQ3pFMkwsWUFBQUEsbUJBQW1CLEdBQUd4RixhQUFhLENBQUNRLFNBQWQsQ0FBd0I4RSw4QkFBOUM7QUFDQSxXQUZELE1BRU87QUFDTkUsWUFBQUEsbUJBQW1CLEdBQUd2QixNQUFNLENBQUNDLFVBQVAsQ0FDckJSLFVBQVUsQ0FBQ0csV0FBWCxDQUF1QjdELGFBQWEsQ0FBQ1EsU0FBZCxDQUF3QitFLDZCQUF4QixJQUF5RCxFQUFoRixDQURxQixDQUF0QjtBQUdBOztBQUNEdEwsVUFBQUEsVUFBVSxHQUFHRSxpQ0FBaUMsQ0FDN0M2SixRQUQ2QyxFQUU3Q3dCLG1CQUY2QyxFQUc3QyxDQUFDLENBQUN4RixhQUFhLENBQUNRLFNBQWQsQ0FBd0JpRiwwQkFIbUIsRUFJN0N6RixhQUFhLENBQUNRLFNBQWQsQ0FBd0JrRix5QkFKcUIsQ0FBOUM7QUFNQTs7QUFFRHpGLFFBQUFBLFNBQVMsQ0FBQ2lDLFdBQVYsQ0FBc0IsTUFBTWxDLGFBQWEsQ0FBQ0csRUFBcEIsR0FBeUIsb0NBQS9DLEVBQXFGbEcsVUFBckY7QUFDQTs7O2FBRUQsMkJBQTBCK0YsYUFBMUIsRUFBd0QwRCxVQUF4RCxFQUE2RXpELFNBQTdFLEVBQXdHO0FBQ3ZHLFlBQUlELGFBQWEsQ0FBQ1EsU0FBZCxDQUF3QmMsV0FBeEIsS0FBd0N6SCxTQUF4QyxJQUFxRG1HLGFBQWEsQ0FBQ1EsU0FBZCxDQUF3QmEsVUFBeEIsS0FBdUN4SCxTQUFoRyxFQUEyRztBQUMxRyxpQkFEMEcsQ0FDbEc7QUFDUjs7QUFDRCxZQUFNbUssUUFBUSxHQUFHQyxNQUFNLENBQUNDLFVBQVAsQ0FBa0JSLFVBQVUsQ0FBQ0csV0FBWCxDQUF1QjdELGFBQWEsQ0FBQ1EsU0FBZCxDQUF3QjVGLFlBQS9DLENBQWxCLENBQWpCO0FBQ0EsWUFBTVUsYUFBYSxHQUFHLElBQUlDLE1BQUosQ0FDckJDLEdBQUcsQ0FBQ0MsRUFBSixDQUNFQyxPQURGLEdBRUVDLGdCQUZGLEdBR0VDLFdBSEYsRUFEcUIsQ0FBdEI7QUFPQSxZQUFJK0osY0FBSjs7QUFDQSxZQUFJM0YsYUFBYSxDQUFDUSxTQUFkLENBQXdCYyxXQUF4QixLQUF3Q3pILFNBQTVDLEVBQXVEO0FBQ3REOEwsVUFBQUEsY0FBYyxHQUFHM0YsYUFBYSxDQUFDUSxTQUFkLENBQXdCYyxXQUF6QztBQUNBLFNBRkQsTUFFTztBQUNOcUUsVUFBQUEsY0FBYyxHQUFHMUIsTUFBTSxDQUFDQyxVQUFQLENBQWtCUixVQUFVLENBQUNHLFdBQVgsQ0FBdUI3RCxhQUFhLENBQUNRLFNBQWQsQ0FBd0JhLFVBQXhCLElBQXNDLEVBQTdELENBQWxCLENBQWpCO0FBQ0E7O0FBQ0QsWUFBTXVFLGlCQUFpQixHQUFHRCxjQUFjLEtBQUssQ0FBbkIsR0FBd0IsQ0FBQzNCLFFBQVEsR0FBRzJCLGNBQVosSUFBOEJBLGNBQS9CLEdBQWlELEdBQXhFLEdBQThFOUwsU0FBeEcsQ0FsQnVHLENBb0J2Rzs7QUFDQSxZQUFNeUgsV0FBVyxHQUFHNkMsWUFBWSxDQUFDQyxnQkFBYixDQUNuQjtBQUNDbEksVUFBQUEsS0FBSyxFQUFFLE9BRFI7QUFFQ21JLFVBQUFBLGlCQUFpQixFQUFFLENBRnBCO0FBR0NDLFVBQUFBLGlCQUFpQixFQUFFLENBSHBCO0FBSUNDLFVBQUFBLFNBQVMsRUFBRTtBQUpaLFNBRG1CLEVBT25CakosYUFQbUIsRUFRbEJpQixNQVJrQixDQVFYb0osY0FSVyxDQUFwQjtBQVNBLFlBQU1FLFdBQVcsR0FBRzFCLFlBQVksQ0FBQ0MsZ0JBQWIsQ0FDbkI7QUFDQ2xJLFVBQUFBLEtBQUssRUFBRSxPQURSO0FBRUMwSSxVQUFBQSxRQUFRLEVBQUUsQ0FGWDtBQUdDQyxVQUFBQSxnQkFBZ0IsRUFBRSxDQUhuQjtBQUlDTixVQUFBQSxTQUFTLEVBQUU7QUFKWixTQURtQixFQU9uQmpKLGFBUG1CLEVBUWxCaUIsTUFSa0IsQ0FRWG9KLGNBUlcsQ0FBcEI7QUFVQTFGLFFBQUFBLFNBQVMsQ0FBQ2lDLFdBQVYsQ0FBc0IsTUFBTWxDLGFBQWEsQ0FBQ0csRUFBcEIsR0FBeUIsMkNBQS9DLEVBQTRGbUIsV0FBNUY7QUFDQXJCLFFBQUFBLFNBQVMsQ0FBQ2lDLFdBQVYsQ0FBc0IsTUFBTWxDLGFBQWEsQ0FBQ0csRUFBcEIsR0FBeUIseUNBQS9DLEVBQTBGMEYsV0FBMUY7O0FBRUEsWUFBSUQsaUJBQWlCLEtBQUsvTCxTQUExQixFQUFxQztBQUNwQyxjQUFNaU0sY0FBYyxHQUFHM0IsWUFBWSxDQUFDQyxnQkFBYixDQUN0QjtBQUNDQyxZQUFBQSxpQkFBaUIsRUFBRSxDQURwQjtBQUVDQyxZQUFBQSxpQkFBaUIsRUFBRSxDQUZwQjtBQUdDQyxZQUFBQSxTQUFTLEVBQUU7QUFIWixXQURzQixFQU10QmpKLGFBTnNCLEVBT3JCaUIsTUFQcUIsQ0FPZHFKLGlCQVBjLENBQXZCO0FBUUEzRixVQUFBQSxTQUFTLENBQUNpQyxXQUFWLENBQXNCLE1BQU1sQyxhQUFhLENBQUNHLEVBQXBCLEdBQXlCLDhDQUEvQyxFQUErRjJGLGNBQS9GO0FBQ0EsU0FWRCxNQVVPO0FBQ043RixVQUFBQSxTQUFTLENBQUNpQyxXQUFWLENBQXNCLE1BQU1sQyxhQUFhLENBQUNHLEVBQXBCLEdBQXlCLDhDQUEvQyxFQUErRixLQUEvRjtBQUNBO0FBQ0Q7QUFFRDtBQUNEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7Ozs7YUFDQyx3QkFBeUJILGFBQXpCLEVBQXVEK0YsVUFBdkQsRUFBK0U5RixTQUEvRSxFQUEwRytGLFFBQTFHLEVBQW1JO0FBQUE7QUFBQTtBQUFBOztBQUNsSTtBQUNBO0FBQ0EsWUFBTUMsWUFBWSxHQUFHRCxRQUFRLEdBQzFCRCxVQUFVLENBQUNHLFFBQVgsQ0FBb0IsTUFBTWxHLGFBQWEsQ0FBQ21HLFNBQXhDLENBRDBCLEdBRTFCSixVQUFVLENBQUNHLFFBQVgsQ0FBb0IsTUFBTWxHLGFBQWEsQ0FBQ21HLFNBQXhDLEVBQW1EdE0sU0FBbkQsRUFBOERBLFNBQTlELEVBQXlFQSxTQUF6RSxFQUFvRjtBQUFFdU0sVUFBQUEsU0FBUyxFQUFFO0FBQWIsU0FBcEYsQ0FGSDtBQUdBLFlBQU1DLFVBQTZDLEdBQUcsRUFBdEQsQ0FOa0ksQ0FRbEk7O0FBQ0Esc0NBQUlyRyxhQUFhLENBQUNRLFNBQWQsQ0FBd0JNLElBQTVCLG1EQUFJLHVCQUE4QjhDLE1BQWxDLEVBQTBDO0FBQ3pDeUMsVUFBQUEsVUFBVSxDQUFDckcsYUFBYSxDQUFDUSxTQUFkLENBQXdCNUYsWUFBekIsQ0FBVixHQUFtRDtBQUFFa0csWUFBQUEsSUFBSSxFQUFFZCxhQUFhLENBQUNRLFNBQWQsQ0FBd0JNLElBQXhCLENBQTZCZ0I7QUFBckMsV0FBbkQ7QUFDQSxTQUZELE1BRU87QUFDTnVFLFVBQUFBLFVBQVUsQ0FBQ3JHLGFBQWEsQ0FBQ1EsU0FBZCxDQUF3QjVGLFlBQXpCLENBQVYsR0FBbUQsRUFBbkQ7QUFDQSxTQWJpSSxDQWVsSTs7O0FBQ0EsWUFBSW9GLGFBQWEsQ0FBQ1EsU0FBZCxDQUF3QjBFLGVBQTVCLEVBQTZDO0FBQzVDbUIsVUFBQUEsVUFBVSxDQUFDckcsYUFBYSxDQUFDUSxTQUFkLENBQXdCMEUsZUFBekIsQ0FBVixHQUFzRCxFQUF0RDtBQUNBLFNBbEJpSSxDQW9CbEk7OztBQUNBLFlBQUljLFFBQUosRUFBYztBQUNiLGNBQUloRyxhQUFhLENBQUNRLFNBQWQsQ0FBd0I2RSxTQUE1QixFQUF1QztBQUN0Q2dCLFlBQUFBLFVBQVUsQ0FBQ3JHLGFBQWEsQ0FBQ1EsU0FBZCxDQUF3QjZFLFNBQXpCLENBQVYsR0FBZ0QsRUFBaEQ7QUFDQTs7QUFDRCxjQUFJckYsYUFBYSxDQUFDUSxTQUFkLENBQXdCK0UsNkJBQTVCLEVBQTJEO0FBQzFEYyxZQUFBQSxVQUFVLENBQUNyRyxhQUFhLENBQUNRLFNBQWQsQ0FBd0IrRSw2QkFBekIsQ0FBVixHQUFvRSxFQUFwRTtBQUNBOztBQUNELGNBQUl2RixhQUFhLENBQUNRLFNBQWQsQ0FBd0JhLFVBQTVCLEVBQXdDO0FBQ3ZDZ0YsWUFBQUEsVUFBVSxDQUFDckcsYUFBYSxDQUFDUSxTQUFkLENBQXdCYSxVQUF6QixDQUFWLEdBQWlELEVBQWpEO0FBQ0E7QUFDRDs7QUFFRDRFLFFBQUFBLFlBQVksQ0FBQ0ssY0FBYixDQUE0QjtBQUFFQyxVQUFBQSxTQUFTLEVBQUVGO0FBQWIsU0FBNUIsRUFqQ2tJLENBbUNsSTs7QUFDQSxzQ0FBSXJHLGFBQWEsQ0FBQ3dCLGlDQUFsQixtREFBSSx1QkFBaUQ5RyxNQUFyRCxFQUE2RDtBQUM1RCxjQUFNOEwsUUFBUSxHQUFHeEcsYUFBYSxDQUFDd0IsaUNBQWQsQ0FBZ0R2RyxHQUFoRCxDQUFvRFYsMEJBQXBELEVBQWdGb0UsTUFBaEYsQ0FBdUYsVUFBQUEsTUFBTSxFQUFJO0FBQ2pILG1CQUFPQSxNQUFNLEtBQUs5RSxTQUFsQjtBQUNBLFdBRmdCLENBQWpCO0FBR0FvTSxVQUFBQSxZQUFZLENBQUN0SCxNQUFiLENBQW9CNkgsUUFBcEI7QUFDQTs7QUFFRCxlQUFPUCxZQUFZLENBQUNRLGVBQWIsQ0FBNkIsQ0FBN0IsRUFBZ0MsQ0FBaEMsRUFBbUNDLElBQW5DLENBQXdDLFVBQUNDLFNBQUQsRUFBMEI7QUFDeEUsY0FBSUEsU0FBUyxDQUFDak0sTUFBZCxFQUFzQjtBQUFBOztBQUNyQixnQkFBTWlKLE9BQU8sR0FBRywwQkFBQTNELGFBQWEsQ0FBQ1EsU0FBZCxDQUF3Qk0sSUFBeEIsMEVBQThCOEMsTUFBOUIsR0FDYitDLFNBQVMsQ0FBQyxDQUFELENBQVQsQ0FBYTlDLFdBQWIsQ0FBeUI3RCxhQUFhLENBQUNRLFNBQWQsQ0FBd0JNLElBQXhCLENBQTZCZ0IsS0FBdEQsQ0FEYSw2QkFFYjlCLGFBQWEsQ0FBQ1EsU0FBZCxDQUF3Qk0sSUFGWCwyREFFYix1QkFBOEJnQixLQUZqQzs7QUFJQSxnQkFBSTlCLGFBQWEsQ0FBQ1EsU0FBZCxDQUF3Qk0sSUFBeEIsSUFBZ0MsQ0FBQzZDLE9BQXJDLEVBQThDO0FBQzdDO0FBQ0ExRCxjQUFBQSxTQUFTLENBQUNpQyxXQUFWLENBQXNCLE1BQU1sQyxhQUFhLENBQUNHLEVBQXBCLEdBQXlCLHdDQUEvQyxFQUF5RixHQUF6RjtBQUNBRixjQUFBQSxTQUFTLENBQUNpQyxXQUFWLENBQXNCLE1BQU1sQyxhQUFhLENBQUNHLEVBQXBCLEdBQXlCLGdEQUEvQyxFQUFpRyxHQUFqRztBQUNBRixjQUFBQSxTQUFTLENBQUNpQyxXQUFWLENBQXNCLE1BQU1sQyxhQUFhLENBQUNHLEVBQXBCLEdBQXlCLCtDQUEvQyxFQUFnRyxHQUFoRztBQUNBRixjQUFBQSxTQUFTLENBQUNpQyxXQUFWLENBQXNCLE1BQU1sQyxhQUFhLENBQUNHLEVBQXBCLEdBQXlCLDZDQUEvQyxFQUE4RixFQUE5RjtBQUNBRixjQUFBQSxTQUFTLENBQUNpQyxXQUFWLENBQXNCLE1BQU1sQyxhQUFhLENBQUNHLEVBQXBCLEdBQXlCLHVDQUEvQyxFQUF3RnRHLFNBQXhGO0FBQ0FvRyxjQUFBQSxTQUFTLENBQUNpQyxXQUFWLENBQXNCLE1BQU1sQyxhQUFhLENBQUNHLEVBQXBCLEdBQXlCLDhDQUEvQyxFQUErRmpILFdBQVcsQ0FBQ00sSUFBM0c7QUFDQXlHLGNBQUFBLFNBQVMsQ0FBQ2lDLFdBQVYsQ0FBc0IsTUFBTWxDLGFBQWEsQ0FBQ0csRUFBcEIsR0FBeUIsd0NBQS9DLEVBQXlGLE1BQXpGO0FBQ0FGLGNBQUFBLFNBQVMsQ0FBQ2lDLFdBQVYsQ0FBc0IsTUFBTWxDLGFBQWEsQ0FBQ0csRUFBcEIsR0FBeUIsb0NBQS9DLEVBQXFGLE1BQXJGO0FBQ0FGLGNBQUFBLFNBQVMsQ0FBQ2lDLFdBQVYsQ0FBc0IsTUFBTWxDLGFBQWEsQ0FBQ0csRUFBcEIsR0FBeUIsMkNBQS9DLEVBQTRGdEcsU0FBNUY7QUFDQW9HLGNBQUFBLFNBQVMsQ0FBQ2lDLFdBQVYsQ0FBc0IsTUFBTWxDLGFBQWEsQ0FBQ0csRUFBcEIsR0FBeUIseUNBQS9DLEVBQTBGdEcsU0FBMUY7QUFDQW9HLGNBQUFBLFNBQVMsQ0FBQ2lDLFdBQVYsQ0FBc0IsTUFBTWxDLGFBQWEsQ0FBQ0csRUFBcEIsR0FBeUIsOENBQS9DLEVBQStGdEcsU0FBL0Y7QUFDQSxhQWJELE1BYU87QUFDTixjQUFBLE1BQUksQ0FBQytNLCtCQUFMLENBQXFDNUcsYUFBckMsRUFBb0QyRyxTQUFTLENBQUMsQ0FBRCxDQUE3RCxFQUFrRTFHLFNBQWxFOztBQUNBLGNBQUEsTUFBSSxDQUFDNEcsMEJBQUwsQ0FBZ0M3RyxhQUFoQyxFQUErQzJHLFNBQVMsQ0FBQyxDQUFELENBQXhELEVBQTZEMUcsU0FBN0Q7O0FBRUEsa0JBQUkrRixRQUFKLEVBQWM7QUFDYixnQkFBQSxNQUFJLENBQUNjLG9CQUFMLENBQTBCOUcsYUFBMUIsRUFBeUMyRyxTQUFTLENBQUMsQ0FBRCxDQUFsRCxFQUF1RDFHLFNBQXZEOztBQUNBLGdCQUFBLE1BQUksQ0FBQzhHLGlCQUFMLENBQXVCL0csYUFBdkIsRUFBc0MyRyxTQUFTLENBQUMsQ0FBRCxDQUEvQyxFQUFvRDFHLFNBQXBEO0FBQ0E7QUFDRDtBQUNEO0FBQ0QsU0E3Qk0sQ0FBUDtBQThCQTtBQUVEO0FBQ0Q7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7Ozs7YUFDQyx5QkFBMEJELGFBQTFCLEVBQXdEK0YsVUFBeEQsRUFBZ0Y5RixTQUFoRixFQUFnSDtBQUFBOztBQUMvRyxZQUFNZ0csWUFBWSxHQUFHRixVQUFVLENBQUNHLFFBQVgsQ0FBb0IsTUFBTWxHLGFBQWEsQ0FBQ21HLFNBQXhDLENBQXJCO0FBQ0EsWUFBTWEsTUFBOEIsR0FBRyxFQUF2QztBQUNBLFlBQU1YLFVBQWtDLEdBQUcsRUFBM0M7QUFFQXJHLFFBQUFBLGFBQWEsQ0FBQzdDLEtBQWQsQ0FBb0JFLFVBQXBCLENBQStCcUUsT0FBL0IsQ0FBdUMsVUFBQTlDLFNBQVMsRUFBSTtBQUNuRG9JLFVBQUFBLE1BQU0sQ0FBQ3BJLFNBQVMsQ0FBQ21ELElBQVgsQ0FBTixHQUF5QixFQUF6QjtBQUNBLFNBRkQ7QUFHQS9CLFFBQUFBLGFBQWEsQ0FBQzdDLEtBQWQsQ0FBb0JDLFFBQXBCLENBQTZCc0UsT0FBN0IsQ0FBcUMsVUFBQU0sT0FBTyxFQUFJO0FBQy9DcUUsVUFBQUEsVUFBVSxDQUFDckUsT0FBTyxDQUFDRCxJQUFULENBQVYsR0FBMkIsRUFBM0I7QUFDQSxTQUZEO0FBR0FrRSxRQUFBQSxZQUFZLENBQUNLLGNBQWIsQ0FBNEI7QUFDM0JXLFVBQUFBLEtBQUssRUFBRUQsTUFEb0I7QUFFM0JULFVBQUFBLFNBQVMsRUFBRUY7QUFGZ0IsU0FBNUIsRUFYK0csQ0FnQi9HOztBQUNBLHNDQUFJckcsYUFBYSxDQUFDd0IsaUNBQWxCLG1EQUFJLHVCQUFpRDlHLE1BQXJELEVBQTZEO0FBQzVELGNBQU04TCxRQUFRLEdBQUd4RyxhQUFhLENBQUN3QixpQ0FBZCxDQUFnRHZHLEdBQWhELENBQW9EViwwQkFBcEQsRUFBZ0ZvRSxNQUFoRixDQUF1RixVQUFBQSxNQUFNLEVBQUk7QUFDakgsbUJBQU9BLE1BQU0sS0FBSzlFLFNBQWxCO0FBQ0EsV0FGZ0IsQ0FBakI7QUFHQW9NLFVBQUFBLFlBQVksQ0FBQ3RILE1BQWIsQ0FBb0I2SCxRQUFwQjtBQUNBLFNBdEI4RyxDQXdCL0c7OztBQUNBLFlBQUl4RyxhQUFhLENBQUM3QyxLQUFkLENBQW9CK0osU0FBeEIsRUFBbUM7QUFDbENqQixVQUFBQSxZQUFZLENBQUNrQixJQUFiLENBQ0NuSCxhQUFhLENBQUM3QyxLQUFkLENBQW9CK0osU0FBcEIsQ0FBOEJqTSxHQUE5QixDQUFrQyxVQUFBbU0sUUFBUSxFQUFJO0FBQzdDLG1CQUFPLElBQUlDLE1BQUosQ0FBV0QsUUFBUSxDQUFDckYsSUFBcEIsRUFBMEJxRixRQUFRLENBQUNFLFVBQW5DLENBQVA7QUFDQSxXQUZELENBREQ7QUFLQTs7QUFFRCxlQUFPckIsWUFBWSxDQUFDUSxlQUFiLENBQTZCLENBQTdCLEVBQWdDekcsYUFBYSxDQUFDN0MsS0FBZCxDQUFvQm9LLFFBQXBELEVBQThEYixJQUE5RCxDQUFtRSxVQUFDQyxTQUFELEVBQTBCO0FBQ25HLGNBQU1hLFNBQVMsR0FBR2IsU0FBUyxDQUFDMUwsR0FBVixDQUFjLFVBQVN3TSxRQUFULEVBQW1CO0FBQ2xELGdCQUFNQyxLQUEwQixHQUFHLEVBQW5DO0FBQ0ExSCxZQUFBQSxhQUFhLENBQUM3QyxLQUFkLENBQW9CRSxVQUFwQixDQUErQnFFLE9BQS9CLENBQXVDLFVBQUE5QyxTQUFTLEVBQUk7QUFDbkQ4SSxjQUFBQSxLQUFLLENBQUM5SSxTQUFTLENBQUNtRCxJQUFYLENBQUwsR0FBd0IwRixRQUFRLENBQUM1RCxXQUFULENBQXFCakYsU0FBUyxDQUFDbUQsSUFBL0IsQ0FBeEI7QUFDQSxhQUZEO0FBR0EvQixZQUFBQSxhQUFhLENBQUM3QyxLQUFkLENBQW9CQyxRQUFwQixDQUE2QnNFLE9BQTdCLENBQXFDLFVBQUFNLE9BQU8sRUFBSTtBQUMvQzBGLGNBQUFBLEtBQUssQ0FBQzFGLE9BQU8sQ0FBQ0QsSUFBVCxDQUFMLEdBQXNCMEYsUUFBUSxDQUFDNUQsV0FBVCxDQUFxQjdCLE9BQU8sQ0FBQ0QsSUFBN0IsQ0FBdEI7QUFDQSxhQUZEO0FBSUEsbUJBQU8yRixLQUFQO0FBQ0EsV0FWaUIsQ0FBbEI7QUFZQXpILFVBQUFBLFNBQVMsQ0FBQ2lDLFdBQVYsQ0FBc0IsTUFBTWxDLGFBQWEsQ0FBQ0csRUFBcEIsR0FBeUIsd0NBQS9DLEVBQXlGcUgsU0FBekY7QUFDQSxTQWRNLENBQVA7QUFlQTtBQUVEO0FBQ0Q7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7Ozs7YUFDQyxvQkFBcUJHLE9BQXJCLEVBQW1EO0FBQ2xELFlBQUksQ0FBQyxLQUFLQyxRQUFWLEVBQW9CO0FBQ25CLGVBQUtDLEtBQUwsR0FBYSxJQUFJQyxJQUFKLENBQVM7QUFDckJDLFlBQUFBLEtBQUssRUFBRSxPQURjO0FBRXJCQyxZQUFBQSxNQUFNLEVBQUU7QUFGYSxXQUFULENBQWI7QUFLQSxlQUFLSixRQUFMLEdBQWdCLElBQUlLLE9BQUosQ0FBWTtBQUMzQjlILFlBQUFBLEVBQUUsRUFBRSxhQUR1QjtBQUUzQitILFlBQUFBLFVBQVUsRUFBRSxLQUZlO0FBRzNCQyxZQUFBQSxTQUFTLEVBQUUsTUFIZ0I7QUFJM0JsSCxZQUFBQSxPQUFPLEVBQUUsQ0FBQyxLQUFLNEcsS0FBTjtBQUprQixXQUFaLENBQWhCO0FBT0FGLFVBQUFBLE9BQU8sQ0FBQ1MsWUFBUixDQUFxQixLQUFLUixRQUExQixFQWJtQixDQWFrQjtBQUNyQzs7QUFFRCxlQUFPLEtBQUtBLFFBQVo7QUFDQTs7O2FBRUQsc0JBQ29CRCxPQURwQixFQUNrQ1UsS0FEbEMsRUFDdUQ7QUFBQTs7QUFDdEQsWUFBTXBJLFNBQVMsR0FBRzBILE9BQU8sQ0FBQzVFLFFBQVIsQ0FBaUIsVUFBakIsQ0FBbEI7O0FBRUEsWUFBSSxLQUFLWCxlQUFMLElBQXdCLEtBQUtBLGVBQUwsQ0FBcUIxSCxNQUFqRCxFQUF5RDtBQUN4RCxjQUFNc0YsYUFBYSxHQUFHLEtBQUtvQyxlQUFMLENBQXFCL0MsSUFBckIsQ0FBMEIsVUFBU2lKLElBQVQsRUFBZTtBQUM5RCxtQkFBT0EsSUFBSSxDQUFDbkksRUFBTCxLQUFZa0ksS0FBbkI7QUFDQSxXQUZxQixDQUF0Qjs7QUFJQSxjQUFJckksYUFBSixFQUFtQjtBQUNsQixnQkFBTXVJLE1BQU0sR0FBR1osT0FBTyxDQUFDNUUsUUFBUixFQUFmO0FBQ0EsZ0JBQU15RixTQUFTLEdBQUcsQ0FDakIsS0FBSzFGLGNBQUwsQ0FBb0I5QyxhQUFwQixFQUFtQ3VJLE1BQW5DLEVBQTJDdEksU0FBM0MsRUFBc0QsSUFBdEQsQ0FEaUIsRUFFakIsS0FBS3dJLGVBQUwsQ0FBcUJ6SSxhQUFyQixFQUFvQ3VJLE1BQXBDLEVBQTRDdEksU0FBNUMsQ0FGaUIsQ0FBbEI7QUFJQSxnQkFBTTJILFFBQVEsR0FBRyxLQUFLYyxVQUFMLENBQWdCZixPQUFoQixDQUFqQjtBQUVBZ0IsWUFBQUEsT0FBTyxDQUFDQyxHQUFSLENBQVlKLFNBQVosRUFDRTlCLElBREYsQ0FDTyxZQUFNO0FBQ1gsY0FBQSxNQUFJLENBQUNtQixLQUFMLENBQVdnQixXQUFYLENBQXVCNUksU0FBUyxDQUFDNEQsV0FBVixDQUFzQixNQUFNd0UsS0FBTixHQUFjLFdBQXBDLENBQXZCOztBQUNBLGNBQUEsTUFBSSxDQUFDUixLQUFMLENBQVdpQixPQUFYOztBQUNBbEIsY0FBQUEsUUFBUSxDQUFDbUIsTUFBVCxDQUFnQnBCLE9BQWhCLEVBQXlCLEtBQXpCO0FBQ0EsYUFMRixFQU1FM0UsS0FORixDQU1RLFVBQUFDLEdBQUcsRUFBSTtBQUNiQyxjQUFBQSxHQUFHLENBQUNDLEtBQUosQ0FBVUYsR0FBVjtBQUNBLGFBUkY7QUFTQTtBQUNEO0FBQ0Q7Ozs7SUFqakI2QytGLG1CLHNXQXFoQjdDQyxNO1NBK0JhckosZ0MiLCJzb3VyY2VSb290IjoiLiIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IENvbnRyb2xsZXJFeHRlbnNpb24gfSBmcm9tIFwic2FwL3VpL2NvcmUvbXZjXCI7XG5pbXBvcnQgeyBDb250cm9sbGVyRXh0ZW5zaW9uTWV0YWRhdGEgfSBmcm9tIFwic2FwL2ZlL2NvcmUvY29udHJvbGxlcmV4dGVuc2lvbnNcIjtcbmltcG9ydCB7IFVJNUNsYXNzLCBPdmVycmlkZSwgUHVibGljIH0gZnJvbSBcIi4uL2hlbHBlcnMvQ2xhc3NTdXBwb3J0XCI7XG5pbXBvcnQgeyBKU09OTW9kZWwgfSBmcm9tIFwic2FwL3VpL21vZGVsL2pzb25cIjtcbmltcG9ydCB7IE9EYXRhTW9kZWwsIENvbnRleHQgfSBmcm9tIFwic2FwL3VpL21vZGVsL29kYXRhL3Y0XCI7XG5pbXBvcnQgeyBMb2cgfSBmcm9tIFwic2FwL2Jhc2VcIjtcbmltcG9ydCB7IEtQSUNoYXJ0RGVmaW5pdGlvbiwgS1BJRGVmaW5pdGlvbiB9IGZyb20gXCJzYXAvZmUvY29yZS9jb252ZXJ0ZXJzL2NvbnRyb2xzL0NvbW1vbi9LUElcIjtcbmltcG9ydCB7IEJhc2VDb250cm9sbGVyIH0gZnJvbSBcInNhcC9mZS9jb3JlXCI7XG5pbXBvcnQgeyBNZXNzYWdlVHlwZSB9IGZyb20gXCJzYXAvZmUvY29yZS9mb3JtYXR0ZXJzL1RhYmxlRm9ybWF0dGVyVHlwZXNcIjtcbmltcG9ydCB7IEZpbHRlckRlZmluaXRpb24sIFJhbmdlRGVmaW5pdGlvbiB9IGZyb20gXCJzYXAvZmUvY29yZS9jb252ZXJ0ZXJzL2hlbHBlcnMvU2VsZWN0aW9uVmFyaWFudEhlbHBlclwiO1xuaW1wb3J0IHsgTnVtYmVyRm9ybWF0LCBEYXRlRm9ybWF0IH0gZnJvbSBcInNhcC91aS9jb3JlL2Zvcm1hdFwiO1xuaW1wb3J0IHsgTG9jYWxlIH0gZnJvbSBcInNhcC91aS9jb3JlXCI7XG5pbXBvcnQgeyBGaWx0ZXIsIEZpbHRlck9wZXJhdG9yLCBTb3J0ZXIgfSBmcm9tIFwic2FwL3VpL21vZGVsXCI7XG5pbXBvcnQgeyBHZW5lcmljVGFnLCBQb3BvdmVyIH0gZnJvbSBcInNhcC9tXCI7XG5pbXBvcnQgeyBDYXJkIH0gZnJvbSBcInNhcC91aS9pbnRlZ3JhdGlvbi93aWRnZXRzXCI7XG5cbmNvbnN0IE1lc3NhZ2VUeXBlRnJvbUNyaXRpY2FsaXR5OiBSZWNvcmQ8c3RyaW5nLCBNZXNzYWdlVHlwZT4gPSB7XG5cdFwiMVwiOiBNZXNzYWdlVHlwZS5FcnJvcixcblx0XCIyXCI6IE1lc3NhZ2VUeXBlLldhcm5pbmcsXG5cdFwiM1wiOiBNZXNzYWdlVHlwZS5TdWNjZXNzLFxuXHRcIjVcIjogTWVzc2FnZVR5cGUuSW5mb3JtYXRpb25cbn07XG5cbmNvbnN0IFZhbHVlQ29sb3JGcm9tTWVzc2FnZVR5cGU6IFJlY29yZDxNZXNzYWdlVHlwZSwgc3RyaW5nPiA9IHtcblx0RXJyb3I6IFwiRXJyb3JcIixcblx0V2FybmluZzogXCJDcml0aWNhbFwiLFxuXHRTdWNjZXNzOiBcIkdvb2RcIixcblx0SW5mb3JtYXRpb246IFwiTm9uZVwiLFxuXHROb25lOiBcIk5vbmVcIlxufTtcblxuLyoqXG4gKiBGdW5jdGlvbiB0byBnZXQgYSBtZXNzYWdlIHN0YXRlIGZyb20gYSBjYWxjdWxhdGVkIGNyaXRpY2FsaXR5IG9mIHR5cGUgJ1RhcmdldCcuXG4gKlxuICogQHBhcmFtIHtudW1iZXJ9IGtwaVZhbHVlIFRoZSB2YWx1ZSBvZiB0aGUgS1BJIHRvIGJlIHRlc3RlZCBhZ2FpbnN0LlxuICogQHBhcmFtIHtudW1iZXJbXX0gYVRocmVzaG9sZHMgVGhyZXNob2xkcyB0byBiZSB1c2VkIFtEZXZpYXRpb25SYW5nZUxvd1ZhbHVlLFRvbGVyYW5jZVJhbmdlTG93VmFsdWUsQWNjZXB0YW5jZVJhbmdlTG93VmFsdWUsQWNjZXB0YW5jZVJhbmdlSGlnaFZhbHVlLFRvbGVyYW5jZVJhbmdlSGlnaFZhbHVlLERldmlhdGlvblJhbmdlSGlnaFZhbHVlXS5cbiAqIEByZXR1cm5zIHtNZXNzYWdlVHlwZX0gUmV0dXJucyB0aGUgY29ycmVzcG9uZGluZyBNZXNzYWdlVHlwZVxuICovXG5mdW5jdGlvbiBtZXNzYWdlVHlwZUZyb21UYXJnZXRDYWxjdWxhdGlvbihrcGlWYWx1ZTogbnVtYmVyLCBhVGhyZXNob2xkczogKG51bWJlciB8IHVuZGVmaW5lZCB8IG51bGwpW10pOiBNZXNzYWdlVHlwZSB7XG5cdGxldCBjcml0aWNhbGl0eVByb3BlcnR5OiBNZXNzYWdlVHlwZTtcblxuXHRpZiAoYVRocmVzaG9sZHNbMF0gIT09IHVuZGVmaW5lZCAmJiBhVGhyZXNob2xkc1swXSAhPT0gbnVsbCAmJiBrcGlWYWx1ZSA8IGFUaHJlc2hvbGRzWzBdKSB7XG5cdFx0Y3JpdGljYWxpdHlQcm9wZXJ0eSA9IE1lc3NhZ2VUeXBlLkVycm9yO1xuXHR9IGVsc2UgaWYgKGFUaHJlc2hvbGRzWzFdICE9PSB1bmRlZmluZWQgJiYgYVRocmVzaG9sZHNbMV0gIT09IG51bGwgJiYga3BpVmFsdWUgPCBhVGhyZXNob2xkc1sxXSkge1xuXHRcdGNyaXRpY2FsaXR5UHJvcGVydHkgPSBNZXNzYWdlVHlwZS5XYXJuaW5nO1xuXHR9IGVsc2UgaWYgKGFUaHJlc2hvbGRzWzJdICE9PSB1bmRlZmluZWQgJiYgYVRocmVzaG9sZHNbMl0gIT09IG51bGwgJiYga3BpVmFsdWUgPCBhVGhyZXNob2xkc1syXSkge1xuXHRcdGNyaXRpY2FsaXR5UHJvcGVydHkgPSBNZXNzYWdlVHlwZS5Ob25lO1xuXHR9IGVsc2UgaWYgKGFUaHJlc2hvbGRzWzVdICE9PSB1bmRlZmluZWQgJiYgYVRocmVzaG9sZHNbNV0gIT09IG51bGwgJiYga3BpVmFsdWUgPiBhVGhyZXNob2xkc1s1XSkge1xuXHRcdGNyaXRpY2FsaXR5UHJvcGVydHkgPSBNZXNzYWdlVHlwZS5FcnJvcjtcblx0fSBlbHNlIGlmIChhVGhyZXNob2xkc1s0XSAhPT0gdW5kZWZpbmVkICYmIGFUaHJlc2hvbGRzWzRdICE9PSBudWxsICYmIGtwaVZhbHVlID4gYVRocmVzaG9sZHNbNF0pIHtcblx0XHRjcml0aWNhbGl0eVByb3BlcnR5ID0gTWVzc2FnZVR5cGUuV2FybmluZztcblx0fSBlbHNlIGlmIChhVGhyZXNob2xkc1szXSAhPT0gdW5kZWZpbmVkICYmIGFUaHJlc2hvbGRzWzNdICE9PSBudWxsICYmIGtwaVZhbHVlID4gYVRocmVzaG9sZHNbM10pIHtcblx0XHRjcml0aWNhbGl0eVByb3BlcnR5ID0gTWVzc2FnZVR5cGUuTm9uZTtcblx0fSBlbHNlIHtcblx0XHRjcml0aWNhbGl0eVByb3BlcnR5ID0gTWVzc2FnZVR5cGUuU3VjY2Vzcztcblx0fVxuXG5cdHJldHVybiBjcml0aWNhbGl0eVByb3BlcnR5O1xufVxuXG4vKipcbiAqIEZ1bmN0aW9uIHRvIGdldCBhIG1lc3NhZ2Ugc3RhdGUgZnJvbSBhIGNhbGN1bGF0ZWQgY3JpdGljYWxpdHkgb2YgdHlwZSAnTWluaW1pemUnLlxuICpcbiAqIEBwYXJhbSB7bnVtYmVyfSBrcGlWYWx1ZSBUaGUgdmFsdWUgb2YgdGhlIEtQSSB0byBiZSB0ZXN0ZWQgYWdhaW5zdC5cbiAqIEBwYXJhbSB7bnVtYmVyW119IGFUaHJlc2hvbGRzIFRocmVzaG9sZHMgdG8gYmUgdXNlZCBbQWNjZXB0YW5jZVJhbmdlSGlnaFZhbHVlLFRvbGVyYW5jZVJhbmdlSGlnaFZhbHVlLERldmlhdGlvblJhbmdlSGlnaFZhbHVlXS5cbiAqIEByZXR1cm5zIHtNZXNzYWdlVHlwZX0gUmV0dXJucyB0aGUgY29ycmVzcG9uZGluZyBNZXNzYWdlVHlwZVxuICovXG5mdW5jdGlvbiBtZXNzYWdlVHlwZUZyb21NaW5pbWl6ZUNhbGN1bGF0aW9uKGtwaVZhbHVlOiBudW1iZXIsIGFUaHJlc2hvbGRzOiAobnVtYmVyIHwgdW5kZWZpbmVkIHwgbnVsbClbXSk6IE1lc3NhZ2VUeXBlIHtcblx0bGV0IGNyaXRpY2FsaXR5UHJvcGVydHk6IE1lc3NhZ2VUeXBlO1xuXG5cdGlmIChhVGhyZXNob2xkc1syXSAhPT0gdW5kZWZpbmVkICYmIGFUaHJlc2hvbGRzWzJdICE9PSBudWxsICYmIGtwaVZhbHVlID4gYVRocmVzaG9sZHNbMl0pIHtcblx0XHRjcml0aWNhbGl0eVByb3BlcnR5ID0gTWVzc2FnZVR5cGUuRXJyb3I7XG5cdH0gZWxzZSBpZiAoYVRocmVzaG9sZHNbMV0gIT09IHVuZGVmaW5lZCAmJiBhVGhyZXNob2xkc1sxXSAhPT0gbnVsbCAmJiBrcGlWYWx1ZSA+IGFUaHJlc2hvbGRzWzFdKSB7XG5cdFx0Y3JpdGljYWxpdHlQcm9wZXJ0eSA9IE1lc3NhZ2VUeXBlLldhcm5pbmc7XG5cdH0gZWxzZSBpZiAoYVRocmVzaG9sZHNbMF0gIT09IHVuZGVmaW5lZCAmJiBhVGhyZXNob2xkc1swXSAhPT0gbnVsbCAmJiBrcGlWYWx1ZSA+IGFUaHJlc2hvbGRzWzBdKSB7XG5cdFx0Y3JpdGljYWxpdHlQcm9wZXJ0eSA9IE1lc3NhZ2VUeXBlLk5vbmU7XG5cdH0gZWxzZSB7XG5cdFx0Y3JpdGljYWxpdHlQcm9wZXJ0eSA9IE1lc3NhZ2VUeXBlLlN1Y2Nlc3M7XG5cdH1cblxuXHRyZXR1cm4gY3JpdGljYWxpdHlQcm9wZXJ0eTtcbn1cblxuLyoqXG4gKiBGdW5jdGlvbiB0byBnZXQgYSBtZXNzYWdlIHN0YXRlIGZyb20gYSBjYWxjdWxhdGVkIGNyaXRpY2FsaXR5IG9mIHR5cGUgJ01heGltaXplJy5cbiAqXG4gKiBAcGFyYW0ge251bWJlcn0ga3BpVmFsdWUgVGhlIHZhbHVlIG9mIHRoZSBLUEkgdG8gYmUgdGVzdGVkIGFnYWluc3QuXG4gKiBAcGFyYW0ge251bWJlcltdfSBhVGhyZXNob2xkcyBUaHJlc2hvbGRzIHRvIGJlIHVzZWQgW0RldmlhdGlvblJhbmdlTG93VmFsdWUsVG9sZXJhbmNlUmFuZ2VMb3dWYWx1ZSxBY2NlcHRhbmNlUmFuZ2VMb3dWYWx1ZV0uXG4gKiBAcmV0dXJucyB7TWVzc2FnZVR5cGV9IFJldHVybnMgdGhlIGNvcnJlc3BvbmRpbmcgTWVzc2FnZVR5cGVcbiAqL1xuZnVuY3Rpb24gbWVzc2FnZVR5cGVGcm9tTWF4aW1pemVDYWxjdWxhdGlvbihrcGlWYWx1ZTogbnVtYmVyLCBhVGhyZXNob2xkczogKG51bWJlciB8IHVuZGVmaW5lZCB8IG51bGwpW10pOiBNZXNzYWdlVHlwZSB7XG5cdGxldCBjcml0aWNhbGl0eVByb3BlcnR5OiBNZXNzYWdlVHlwZTtcblxuXHRpZiAoYVRocmVzaG9sZHNbMF0gIT09IHVuZGVmaW5lZCAmJiBhVGhyZXNob2xkc1swXSAhPT0gbnVsbCAmJiBrcGlWYWx1ZSA8IGFUaHJlc2hvbGRzWzBdKSB7XG5cdFx0Y3JpdGljYWxpdHlQcm9wZXJ0eSA9IE1lc3NhZ2VUeXBlLkVycm9yO1xuXHR9IGVsc2UgaWYgKGFUaHJlc2hvbGRzWzFdICE9PSB1bmRlZmluZWQgJiYgYVRocmVzaG9sZHNbMV0gIT09IG51bGwgJiYga3BpVmFsdWUgPCBhVGhyZXNob2xkc1sxXSkge1xuXHRcdGNyaXRpY2FsaXR5UHJvcGVydHkgPSBNZXNzYWdlVHlwZS5XYXJuaW5nO1xuXHR9IGVsc2UgaWYgKGFUaHJlc2hvbGRzWzJdICE9PSB1bmRlZmluZWQgJiYgYVRocmVzaG9sZHNbMl0gIT09IG51bGwgJiYga3BpVmFsdWUgPCBhVGhyZXNob2xkc1syXSkge1xuXHRcdGNyaXRpY2FsaXR5UHJvcGVydHkgPSBNZXNzYWdlVHlwZS5Ob25lO1xuXHR9IGVsc2Uge1xuXHRcdGNyaXRpY2FsaXR5UHJvcGVydHkgPSBNZXNzYWdlVHlwZS5TdWNjZXNzO1xuXHR9XG5cblx0cmV0dXJuIGNyaXRpY2FsaXR5UHJvcGVydHk7XG59XG5cbi8qKlxuICogRnVuY3Rpb24gdG8gY2FsY3VsYXRlIGEgRGV2aWF0aW9uSW5kaWNhdG9yIHZhbHVlIGZyb20gYSB0cmVuZCB2YWx1ZS5cbiAqXG4gKiBAcGFyYW0ge251bWJlcnxzdHJpbmd9IHRyZW5kVmFsdWUgVGhlIGNyaXRpY2FsaXR5IHZhbHVlcy5cbiAqIEByZXR1cm5zIHtzdHJpbmd9IFJldHVybnMgdGhlIGNvcnJlc3BvbmRpbmcgRGV2aWF0aW9uSW5kaWNhdG9yIHZhbHVlXG4gKi9cbmZ1bmN0aW9uIGRldmlhdGlvbkluZGljYXRvckZyb21UcmVuZFR5cGUodHJlbmRWYWx1ZTogbnVtYmVyIHwgc3RyaW5nKTogc3RyaW5nIHtcblx0bGV0IGRldmlhdGlvbkluZGljYXRvcjogc3RyaW5nO1xuXG5cdHN3aXRjaCAodHJlbmRWYWx1ZSkge1xuXHRcdGNhc2UgMTogLy8gU3Ryb25nVXBcblx0XHRjYXNlIFwiMVwiOlxuXHRcdGNhc2UgMjogLy8gVXBcblx0XHRjYXNlIFwiMlwiOlxuXHRcdFx0ZGV2aWF0aW9uSW5kaWNhdG9yID0gXCJVcFwiO1xuXHRcdFx0YnJlYWs7XG5cblx0XHRjYXNlIDQ6IC8vIERvd25cblx0XHRjYXNlIFwiNFwiOlxuXHRcdGNhc2UgNTogLy8gU3Ryb25nRG93blxuXHRcdGNhc2UgXCI1XCI6XG5cdFx0XHRkZXZpYXRpb25JbmRpY2F0b3IgPSBcIkRvd25cIjtcblx0XHRcdGJyZWFrO1xuXG5cdFx0ZGVmYXVsdDpcblx0XHRcdGRldmlhdGlvbkluZGljYXRvciA9IFwiTm9uZVwiO1xuXHR9XG5cblx0cmV0dXJuIGRldmlhdGlvbkluZGljYXRvcjtcbn1cblxuLyoqXG4gKiBGdW5jdGlvbiB0byBjYWxjdWxhdGUgYSBEZXZpYXRpb25JbmRpY2F0b3IgZnJvbSBhIFRyZW5kQ2FsY3VsYXRpb24uXG4gKlxuICogQHBhcmFtIGtwaVZhbHVlIFRoZSB2YWx1ZSBvZiB0aGUgS1BJXG4gKiBAcGFyYW0gcmVmZXJlbmNlVmFsdWUgVGhlIHJlZmVyZW5jZSB2YWx1ZSB0byBjb21wYXJlIHdpdGhcbiAqIEBwYXJhbSBpc1JlbGF0aXZlIFRydWUgaXMgdGhlIGNvbXBhcmlzb24gaXMgcmVsYXRpdmVcbiAqIEBwYXJhbSBhVGhyZXNob2xkcyBBcnJheSBvZiB0aHJlc2hvbGRzIFtTdHJvbmdEb3duRGlmZmVyZW5jZSwgRG93bkRpZmZlcmVuY2UsIFVwRGlmZmVyZW5jZSwgU3Ryb25nVXBEaWZmZXJlbmNlXVxuICogQHJldHVybnMge3NhcC5tLkRldmlhdGlvbkluZGljYXRvcn0gUmV0dXJucyB0aGUgY29ycmVzcG9uZGluZyBEZXZpYXRpb25JbmRpY2F0b3IgdmFsdWVcbiAqL1xuZnVuY3Rpb24gZGV2aWF0aW9uSW5kaWNhdG9yRnJvbUNhbGN1bGF0aW9uKFxuXHRrcGlWYWx1ZTogbnVtYmVyLFxuXHRyZWZlcmVuY2VWYWx1ZTogbnVtYmVyLFxuXHRpc1JlbGF0aXZlOiBib29sZWFuLFxuXHRhVGhyZXNob2xkczogKG51bWJlciB8IHVuZGVmaW5lZCB8IG51bGwpW10gfCB1bmRlZmluZWRcbik6IHN0cmluZyB7XG5cdGxldCBkZXZpYXRpb25JbmRpY2F0b3I6IHN0cmluZztcblxuXHRpZiAoIWFUaHJlc2hvbGRzIHx8IChpc1JlbGF0aXZlICYmICFyZWZlcmVuY2VWYWx1ZSkpIHtcblx0XHRyZXR1cm4gXCJOb25lXCI7XG5cdH1cblxuXHRjb25zdCBjb21wVmFsdWUgPSBpc1JlbGF0aXZlID8gKGtwaVZhbHVlIC0gcmVmZXJlbmNlVmFsdWUpIC8gcmVmZXJlbmNlVmFsdWUgOiBrcGlWYWx1ZSAtIHJlZmVyZW5jZVZhbHVlO1xuXG5cdGlmIChhVGhyZXNob2xkc1swXSAhPT0gdW5kZWZpbmVkICYmIGFUaHJlc2hvbGRzWzBdICE9PSBudWxsICYmIGNvbXBWYWx1ZSA8PSBhVGhyZXNob2xkc1swXSkge1xuXHRcdC8vIFN0cm9uZ0Rvd24gLS0+IERvd25cblx0XHRkZXZpYXRpb25JbmRpY2F0b3IgPSBcIkRvd25cIjtcblx0fSBlbHNlIGlmIChhVGhyZXNob2xkc1sxXSAhPT0gdW5kZWZpbmVkICYmIGFUaHJlc2hvbGRzWzFdICE9PSBudWxsICYmIGNvbXBWYWx1ZSA8PSBhVGhyZXNob2xkc1sxXSkge1xuXHRcdC8vIERvd24gLS0+IERvd25cblx0XHRkZXZpYXRpb25JbmRpY2F0b3IgPSBcIkRvd25cIjtcblx0fSBlbHNlIGlmIChhVGhyZXNob2xkc1szXSAhPT0gdW5kZWZpbmVkICYmIGFUaHJlc2hvbGRzWzNdICE9PSBudWxsICYmIGNvbXBWYWx1ZSA+PSBhVGhyZXNob2xkc1szXSkge1xuXHRcdC8vIFN0cm9uZ1VwIC0tPiBVcFxuXHRcdGRldmlhdGlvbkluZGljYXRvciA9IFwiVXBcIjtcblx0fSBlbHNlIGlmIChhVGhyZXNob2xkc1syXSAhPT0gdW5kZWZpbmVkICYmIGFUaHJlc2hvbGRzWzJdICE9PSBudWxsICYmIGNvbXBWYWx1ZSA+PSBhVGhyZXNob2xkc1syXSkge1xuXHRcdC8vIFVwIC0tPiBVcFxuXHRcdGRldmlhdGlvbkluZGljYXRvciA9IFwiVXBcIjtcblx0fSBlbHNlIHtcblx0XHQvLyBTaWRld2F5cyAtLT4gTm9uZVxuXHRcdGRldmlhdGlvbkluZGljYXRvciA9IFwiTm9uZVwiO1xuXHR9XG5cblx0cmV0dXJuIGRldmlhdGlvbkluZGljYXRvcjtcbn1cblxuLyoqXG4gKiBDcmVhdGVzIGEgc2FwLnVpLm1vZGVsLkZpbHRlciBmcm9tIGEgZmlsdGVyIGRlZmluaXRpb24uXG4gKlxuICogQHBhcmFtIGZpbHRlckRlZmluaXRpb24gVGhlIGZpbHRlciBkZWZpbml0aW9uXG4gKiBAcmV0dXJucyBSZXR1cm5zIGEgc2FwLnVpLm1vZGVsLkZpbHRlciBmcm9tIHRoZSBkZWZpbml0aW9uLCBvciB1bmRlZmluZWQgaWYgdGhlIGRlZmluaXRpb24gaXMgZW1wdHkgKG5vIHJhbmdlcylcbiAqL1xuZnVuY3Rpb24gY3JlYXRlRmlsdGVyRnJvbURlZmluaXRpb24oZmlsdGVyRGVmaW5pdGlvbjogRmlsdGVyRGVmaW5pdGlvbik6IEZpbHRlciB8IHVuZGVmaW5lZCB7XG5cdGlmIChmaWx0ZXJEZWZpbml0aW9uLnJhbmdlcy5sZW5ndGggPT09IDApIHtcblx0XHRyZXR1cm4gdW5kZWZpbmVkO1xuXHR9IGVsc2UgaWYgKGZpbHRlckRlZmluaXRpb24ucmFuZ2VzLmxlbmd0aCA9PT0gMSkge1xuXHRcdHJldHVybiBuZXcgRmlsdGVyKFxuXHRcdFx0ZmlsdGVyRGVmaW5pdGlvbi5wcm9wZXJ0eVBhdGgsXG5cdFx0XHRmaWx0ZXJEZWZpbml0aW9uLnJhbmdlc1swXS5vcGVyYXRvciBhcyBGaWx0ZXJPcGVyYXRvcixcblx0XHRcdGZpbHRlckRlZmluaXRpb24ucmFuZ2VzWzBdLnJhbmdlTG93LFxuXHRcdFx0ZmlsdGVyRGVmaW5pdGlvbi5yYW5nZXNbMF0ucmFuZ2VIaWdoXG5cdFx0KTtcblx0fSBlbHNlIHtcblx0XHRjb25zdCBhUmFuZ2VGaWx0ZXJzID0gZmlsdGVyRGVmaW5pdGlvbi5yYW5nZXMubWFwKHJhbmdlID0+IHtcblx0XHRcdHJldHVybiBuZXcgRmlsdGVyKGZpbHRlckRlZmluaXRpb24ucHJvcGVydHlQYXRoLCByYW5nZS5vcGVyYXRvciBhcyBGaWx0ZXJPcGVyYXRvciwgcmFuZ2UucmFuZ2VMb3csIHJhbmdlLnJhbmdlSGlnaCk7XG5cdFx0fSk7XG5cdFx0cmV0dXJuIG5ldyBGaWx0ZXIoe1xuXHRcdFx0ZmlsdGVyczogYVJhbmdlRmlsdGVycyxcblx0XHRcdGFuZDogZmFsc2Vcblx0XHR9KTtcblx0fVxufVxuXG5mdW5jdGlvbiBnZXRGaWx0ZXJTdHJpbmdGcm9tRGVmaW5pdGlvbihmaWx0ZXJEZWZpbml0aW9uOiBGaWx0ZXJEZWZpbml0aW9uKTogc3RyaW5nIHtcblx0Y29uc3QgY3VycmVudExvY2FsZSA9IG5ldyBMb2NhbGUoXG5cdFx0c2FwLnVpXG5cdFx0XHQuZ2V0Q29yZSgpXG5cdFx0XHQuZ2V0Q29uZmlndXJhdGlvbigpXG5cdFx0XHQuZ2V0TGFuZ3VhZ2UoKVxuXHQpO1xuXHRjb25zdCByZXNCdW5kbGUgPSBzYXAudWkuZ2V0Q29yZSgpLmdldExpYnJhcnlSZXNvdXJjZUJ1bmRsZShcInNhcC5mZS5jb3JlXCIpO1xuXHRjb25zdCBkYXRlRm9ybWF0ID0gRGF0ZUZvcm1hdC5nZXREYXRlSW5zdGFuY2UoeyBzdHlsZTogXCJtZWRpdW1cIiB9LCBjdXJyZW50TG9jYWxlKTtcblxuXHRmdW5jdGlvbiBmb3JtYXRSYW5nZShyYW5nZTogUmFuZ2VEZWZpbml0aW9uKTogc3RyaW5nIHtcblx0XHRjb25zdCB2YWx1ZUxvdyA9XG5cdFx0XHRmaWx0ZXJEZWZpbml0aW9uLnByb3BlcnR5VHlwZS5pbmRleE9mKFwiRWRtLkRhdGVcIikgPT09IDAgPyBkYXRlRm9ybWF0LmZvcm1hdChuZXcgRGF0ZShyYW5nZS5yYW5nZUxvdykpIDogcmFuZ2UucmFuZ2VMb3c7XG5cdFx0Y29uc3QgdmFsdWVIaWdoID1cblx0XHRcdGZpbHRlckRlZmluaXRpb24ucHJvcGVydHlUeXBlLmluZGV4T2YoXCJFZG0uRGF0ZVwiKSA9PT0gMCA/IGRhdGVGb3JtYXQuZm9ybWF0KG5ldyBEYXRlKHJhbmdlLnJhbmdlSGlnaCkpIDogcmFuZ2UucmFuZ2VIaWdoO1xuXG5cdFx0c3dpdGNoIChyYW5nZS5vcGVyYXRvcikge1xuXHRcdFx0Y2FzZSBcIkJUXCI6XG5cdFx0XHRcdHJldHVybiBcIltcIiArIHZhbHVlTG93ICsgXCIgLSBcIiArIHZhbHVlSGlnaCArIFwiXVwiO1xuXG5cdFx0XHRjYXNlIFwiQ29udGFpbnNcIjpcblx0XHRcdFx0cmV0dXJuIFwiKlwiICsgdmFsdWVMb3cgKyBcIipcIjtcblxuXHRcdFx0Y2FzZSBcIkdFXCI6XG5cdFx0XHRcdHJldHVybiBcIlxcdTIyNjVcIiArIHZhbHVlTG93O1xuXG5cdFx0XHRjYXNlIFwiR1RcIjpcblx0XHRcdFx0cmV0dXJuIFwiPlwiICsgdmFsdWVMb3c7XG5cblx0XHRcdGNhc2UgXCJMRVwiOlxuXHRcdFx0XHRyZXR1cm4gXCJcXHUyMjY0XCIgKyB2YWx1ZUxvdztcblxuXHRcdFx0Y2FzZSBcIkxUXCI6XG5cdFx0XHRcdHJldHVybiBcIjxcIiArIHZhbHVlTG93O1xuXG5cdFx0XHRjYXNlIFwiTkJcIjpcblx0XHRcdFx0cmV0dXJuIHJlc0J1bmRsZS5nZXRUZXh0KFwiQ19LUElDQVJEX0ZJTFRFUlNUUklOR19OT1RcIiwgW1wiW1wiICsgdmFsdWVMb3cgKyBcIiAtIFwiICsgdmFsdWVIaWdoICsgXCJdXCJdKTtcblxuXHRcdFx0Y2FzZSBcIk5FXCI6XG5cdFx0XHRcdHJldHVybiBcIlxcdTIyNjBcIiArIHZhbHVlTG93O1xuXG5cdFx0XHRjYXNlIFwiTm90Q29udGFpbnNcIjpcblx0XHRcdFx0cmV0dXJuIHJlc0J1bmRsZS5nZXRUZXh0KFwiQ19LUElDQVJEX0ZJTFRFUlNUUklOR19OT1RcIiwgW1wiKlwiICsgdmFsdWVMb3cgKyBcIipcIl0pO1xuXG5cdFx0XHRjYXNlIFwiRVFcIjpcblx0XHRcdGRlZmF1bHQ6XG5cdFx0XHRcdHJldHVybiB2YWx1ZUxvdztcblx0XHR9XG5cdH1cblx0aWYgKGZpbHRlckRlZmluaXRpb24ucmFuZ2VzLmxlbmd0aCA9PT0gMCkge1xuXHRcdHJldHVybiBcIlwiO1xuXHR9IGVsc2UgaWYgKGZpbHRlckRlZmluaXRpb24ucmFuZ2VzLmxlbmd0aCA9PT0gMSkge1xuXHRcdHJldHVybiBmb3JtYXRSYW5nZShmaWx0ZXJEZWZpbml0aW9uLnJhbmdlc1swXSk7XG5cdH0gZWxzZSB7XG5cdFx0cmV0dXJuIFwiKFwiICsgZmlsdGVyRGVmaW5pdGlvbi5yYW5nZXMubWFwKGZvcm1hdFJhbmdlKS5qb2luKFwiLFwiKSArIFwiKVwiO1xuXHR9XG59XG5cbmZ1bmN0aW9uIGZvcm1hdENoYXJ0VGl0bGUoa3BpRGVmOiBLUElEZWZpbml0aW9uKTogc3RyaW5nIHtcblx0Y29uc3QgcmVzQnVuZGxlID0gc2FwLnVpLmdldENvcmUoKS5nZXRMaWJyYXJ5UmVzb3VyY2VCdW5kbGUoXCJzYXAuZmUuY29yZVwiKTtcblxuXHRmdW5jdGlvbiBmb3JtYXRMaXN0KGl0ZW1zOiB7IG5hbWU6IHN0cmluZzsgbGFiZWw6IHN0cmluZyB9W10pIHtcblx0XHRpZiAoaXRlbXMubGVuZ3RoID09PSAwKSB7XG5cdFx0XHRyZXR1cm4gXCJcIjtcblx0XHR9IGVsc2UgaWYgKGl0ZW1zLmxlbmd0aCA9PT0gMSkge1xuXHRcdFx0cmV0dXJuIGl0ZW1zWzBdLmxhYmVsO1xuXHRcdH0gZWxzZSB7XG5cdFx0XHRsZXQgcmVzID0gaXRlbXNbMF0ubGFiZWw7XG5cdFx0XHRmb3IgKGxldCBJID0gMTsgSSA8IGl0ZW1zLmxlbmd0aCAtIDE7IEkrKykge1xuXHRcdFx0XHRyZXMgKz0gXCIsIFwiICsgaXRlbXNbSV0ubGFiZWw7XG5cdFx0XHR9XG5cblx0XHRcdHJldHVybiByZXNCdW5kbGUuZ2V0VGV4dChcIkNfS1BJQ0FSRF9JVEVNU0xJU1RcIiwgW3JlcywgaXRlbXNbaXRlbXMubGVuZ3RoIC0gMV0ubGFiZWxdKTtcblx0XHR9XG5cdH1cblxuXHRyZXR1cm4gcmVzQnVuZGxlLmdldFRleHQoXCJDX0tQSUNBUkRfQ0hBUlRUSVRMRVwiLCBbZm9ybWF0TGlzdChrcGlEZWYuY2hhcnQubWVhc3VyZXMpLCBmb3JtYXRMaXN0KGtwaURlZi5jaGFydC5kaW1lbnNpb25zKV0pO1xufVxuXG5mdW5jdGlvbiB1cGRhdGVDaGFydExhYmVsU2V0dGluZ3MoY2hhcnREZWZpbml0aW9uOiBLUElDaGFydERlZmluaXRpb24sIG9DaGFydFByb3BlcnRpZXM6IGFueSk6IHZvaWQge1xuXHRzd2l0Y2ggKGNoYXJ0RGVmaW5pdGlvbi5jaGFydFR5cGUpIHtcblx0XHRjYXNlIFwiRG9udXRcIjpcblx0XHRcdC8vIFNob3cgZGF0YSBsYWJlbHMsIGRvIG5vdCBzaG93IGF4aXMgdGl0bGVzXG5cdFx0XHRvQ2hhcnRQcm9wZXJ0aWVzLmNhdGVnb3J5QXhpcyA9IHtcblx0XHRcdFx0dGl0bGU6IHtcblx0XHRcdFx0XHR2aXNpYmxlOiBmYWxzZVxuXHRcdFx0XHR9XG5cdFx0XHR9O1xuXHRcdFx0b0NoYXJ0UHJvcGVydGllcy52YWx1ZUF4aXMgPSB7XG5cdFx0XHRcdHRpdGxlOiB7XG5cdFx0XHRcdFx0dmlzaWJsZTogZmFsc2Vcblx0XHRcdFx0fSxcblx0XHRcdFx0bGFiZWw6IHtcblx0XHRcdFx0XHRmb3JtYXRTdHJpbmc6IFwiU2hvcnRGbG9hdFwiXG5cdFx0XHRcdH1cblx0XHRcdH07XG5cdFx0XHRvQ2hhcnRQcm9wZXJ0aWVzLnBsb3RBcmVhLmRhdGFMYWJlbCA9IHtcblx0XHRcdFx0dmlzaWJsZTogdHJ1ZSxcblx0XHRcdFx0dHlwZTogXCJ2YWx1ZVwiLFxuXHRcdFx0XHRmb3JtYXRTdHJpbmc6IFwiU2hvcnRGbG9hdF9NRkQyXCJcblx0XHRcdH07XG5cdFx0XHRicmVhaztcblxuXHRcdGNhc2UgXCJidWJibGVcIjpcblx0XHRcdC8vIFNob3cgYXhpcyB0aXRsZSwgYnViYmxlIHNpemUgbGVnZW5kLCBkbyBub3Qgc2hvdyBkYXRhIGxhYmVsc1xuXHRcdFx0b0NoYXJ0UHJvcGVydGllcy52YWx1ZUF4aXMgPSB7XG5cdFx0XHRcdHRpdGxlOiB7XG5cdFx0XHRcdFx0dmlzaWJsZTogdHJ1ZVxuXHRcdFx0XHR9LFxuXHRcdFx0XHRsYWJlbDoge1xuXHRcdFx0XHRcdGZvcm1hdFN0cmluZzogXCJTaG9ydEZsb2F0XCJcblx0XHRcdFx0fVxuXHRcdFx0fTtcblx0XHRcdG9DaGFydFByb3BlcnRpZXMudmFsdWVBeGlzMiA9IHtcblx0XHRcdFx0dGl0bGU6IHtcblx0XHRcdFx0XHR2aXNpYmxlOiB0cnVlXG5cdFx0XHRcdH0sXG5cdFx0XHRcdGxhYmVsOiB7XG5cdFx0XHRcdFx0Zm9ybWF0U3RyaW5nOiBcIlNob3J0RmxvYXRcIlxuXHRcdFx0XHR9XG5cdFx0XHR9O1xuXHRcdFx0b0NoYXJ0UHJvcGVydGllcy5sZWdlbmRHcm91cCA9IHtcblx0XHRcdFx0bGF5b3V0OiB7XG5cdFx0XHRcdFx0cG9zaXRpb246IFwiYm90dG9tXCIsXG5cdFx0XHRcdFx0YWxpZ25tZW50OiBcInRvcExlZnRcIlxuXHRcdFx0XHR9XG5cdFx0XHR9O1xuXHRcdFx0b0NoYXJ0UHJvcGVydGllcy5zaXplTGVnZW5kID0ge1xuXHRcdFx0XHR2aXNpYmxlOiB0cnVlXG5cdFx0XHR9O1xuXHRcdFx0b0NoYXJ0UHJvcGVydGllcy5wbG90QXJlYS5kYXRhTGFiZWwgPSB7IHZpc2libGU6IGZhbHNlIH07XG5cdFx0XHRicmVhaztcblxuXHRcdGNhc2UgXCJzY2F0dGVyXCI6XG5cdFx0XHQvLyBEbyBub3Qgc2hvdyBkYXRhIGxhYmVscyBhbmQgYXhpcyB0aXRsZXNcblx0XHRcdG9DaGFydFByb3BlcnRpZXMudmFsdWVBeGlzID0ge1xuXHRcdFx0XHR0aXRsZToge1xuXHRcdFx0XHRcdHZpc2libGU6IGZhbHNlXG5cdFx0XHRcdH0sXG5cdFx0XHRcdGxhYmVsOiB7XG5cdFx0XHRcdFx0Zm9ybWF0U3RyaW5nOiBcIlNob3J0RmxvYXRcIlxuXHRcdFx0XHR9XG5cdFx0XHR9O1xuXHRcdFx0b0NoYXJ0UHJvcGVydGllcy52YWx1ZUF4aXMyID0ge1xuXHRcdFx0XHR0aXRsZToge1xuXHRcdFx0XHRcdHZpc2libGU6IGZhbHNlXG5cdFx0XHRcdH0sXG5cdFx0XHRcdGxhYmVsOiB7XG5cdFx0XHRcdFx0Zm9ybWF0U3RyaW5nOiBcIlNob3J0RmxvYXRcIlxuXHRcdFx0XHR9XG5cdFx0XHR9O1xuXHRcdFx0b0NoYXJ0UHJvcGVydGllcy5wbG90QXJlYS5kYXRhTGFiZWwgPSB7IHZpc2libGU6IGZhbHNlIH07XG5cdFx0XHRicmVhaztcblxuXHRcdGRlZmF1bHQ6XG5cdFx0XHQvLyBEbyBub3Qgc2hvdyBkYXRhIGxhYmVscyBhbmQgYXhpcyB0aXRsZXNcblx0XHRcdG9DaGFydFByb3BlcnRpZXMuY2F0ZWdvcnlBeGlzID0ge1xuXHRcdFx0XHR0aXRsZToge1xuXHRcdFx0XHRcdHZpc2libGU6IGZhbHNlXG5cdFx0XHRcdH1cblx0XHRcdH07XG5cdFx0XHRvQ2hhcnRQcm9wZXJ0aWVzLnZhbHVlQXhpcyA9IHtcblx0XHRcdFx0dGl0bGU6IHtcblx0XHRcdFx0XHR2aXNpYmxlOiBmYWxzZVxuXHRcdFx0XHR9LFxuXHRcdFx0XHRsYWJlbDoge1xuXHRcdFx0XHRcdGZvcm1hdFN0cmluZzogXCJTaG9ydEZsb2F0XCJcblx0XHRcdFx0fVxuXHRcdFx0fTtcblx0XHRcdG9DaGFydFByb3BlcnRpZXMucGxvdEFyZWEuZGF0YUxhYmVsID0geyB2aXNpYmxlOiBmYWxzZSB9O1xuXHR9XG59XG5mdW5jdGlvbiBmaWx0ZXJNYXAoYU9iamVjdHM6IHsgbmFtZTogc3RyaW5nOyBsYWJlbDogc3RyaW5nOyByb2xlPzogc3RyaW5nIH1bXSwgYVJvbGVzPzogKHN0cmluZyB8IHVuZGVmaW5lZClbXSk6IHN0cmluZ1tdIHtcblx0aWYgKGFSb2xlcyAmJiBhUm9sZXMubGVuZ3RoKSB7XG5cdFx0cmV0dXJuIGFPYmplY3RzXG5cdFx0XHQuZmlsdGVyKGRpbWVuc2lvbiA9PiB7XG5cdFx0XHRcdHJldHVybiBhUm9sZXMuaW5kZXhPZihkaW1lbnNpb24ucm9sZSkgPj0gMDtcblx0XHRcdH0pXG5cdFx0XHQubWFwKGRpbWVuc2lvbiA9PiB7XG5cdFx0XHRcdHJldHVybiBkaW1lbnNpb24ubGFiZWw7XG5cdFx0XHR9KTtcblx0fSBlbHNlIHtcblx0XHRyZXR1cm4gYU9iamVjdHMubWFwKGRpbWVuc2lvbiA9PiB7XG5cdFx0XHRyZXR1cm4gZGltZW5zaW9uLmxhYmVsO1xuXHRcdH0pO1xuXHR9XG59XG5cbmZ1bmN0aW9uIGdldFNjYXR0ZXJCdWJibGVDaGFydEZlZWRzKGNoYXJ0RGVmaW5pdGlvbjogS1BJQ2hhcnREZWZpbml0aW9uKTogeyB1aWQ6IHN0cmluZzsgdHlwZTogc3RyaW5nOyB2YWx1ZXM6IHN0cmluZ1tdIH1bXSB7XG5cdGNvbnN0IGF4aXMxTWVhc3VyZXMgPSBmaWx0ZXJNYXAoY2hhcnREZWZpbml0aW9uLm1lYXN1cmVzLCBbXCJBeGlzMVwiXSk7XG5cdGNvbnN0IGF4aXMyTWVhc3VyZXMgPSBmaWx0ZXJNYXAoY2hhcnREZWZpbml0aW9uLm1lYXN1cmVzLCBbXCJBeGlzMlwiXSk7XG5cdGNvbnN0IGF4aXMzTWVhc3VyZXMgPSBmaWx0ZXJNYXAoY2hhcnREZWZpbml0aW9uLm1lYXN1cmVzLCBbXCJBeGlzM1wiXSk7XG5cdGNvbnN0IG90aGVyTWVhc3VyZXMgPSBmaWx0ZXJNYXAoY2hhcnREZWZpbml0aW9uLm1lYXN1cmVzLCBbdW5kZWZpbmVkXSk7XG5cdGNvbnN0IHNlcmllc0RpbWVuc2lvbnMgPSBmaWx0ZXJNYXAoY2hhcnREZWZpbml0aW9uLmRpbWVuc2lvbnMsIFtcIlNlcmllc1wiXSk7XG5cblx0Ly8gR2V0IHRoZSBmaXJzdCBkaW1lbnNpb24gd2l0aCByb2xlIFwiQ2F0ZWdvcnlcIiBmb3IgdGhlIHNoYXBlXG5cdGNvbnN0IHNoYXBlRGltZW5zaW9uID0gY2hhcnREZWZpbml0aW9uLmRpbWVuc2lvbnMuZmluZChkaW1lbnNpb24gPT4ge1xuXHRcdHJldHVybiBkaW1lbnNpb24ucm9sZSA9PT0gXCJDYXRlZ29yeVwiO1xuXHR9KTtcblxuXHQvLyBNZWFzdXJlIGZvciB0aGUgeC1BeGlzIDogZmlyc3QgbWVhc3VyZSBmb3IgQXhpczEsIG9yIGZvciBBeGlzMiBpZiBub3QgZm91bmQsIG9yIGZvciBBeGlzMyBpZiBub3QgZm91bmRcblx0Y29uc3QgeE1lYXN1cmUgPSBheGlzMU1lYXN1cmVzLnNoaWZ0KCkgfHwgYXhpczJNZWFzdXJlcy5zaGlmdCgpIHx8IGF4aXMzTWVhc3VyZXMuc2hpZnQoKSB8fCBvdGhlck1lYXN1cmVzLnNoaWZ0KCkgfHwgXCJcIjtcblx0Ly8gTWVhc3VyZSBmb3IgdGhlIHktQXhpcyA6IGZpcnN0IG1lYXN1cmUgZm9yIEF4aXMyLCBvciBzZWNvbmQgbWVhc3VyZSBmb3IgQXhpczEgaWYgbm90IGZvdW5kLCBvciBmaXJzdCBtZWFzdXJlIGZvciBBeGlzMyBpZiBub3QgZm91bmRcblx0Y29uc3QgeU1lYXN1cmUgPSBheGlzMk1lYXN1cmVzLnNoaWZ0KCkgfHwgYXhpczFNZWFzdXJlcy5zaGlmdCgpIHx8IGF4aXMzTWVhc3VyZXMuc2hpZnQoKSB8fCBvdGhlck1lYXN1cmVzLnNoaWZ0KCkgfHwgXCJcIjtcblx0Y29uc3QgcmVzID0gW1xuXHRcdHtcblx0XHRcdFwidWlkXCI6IFwidmFsdWVBeGlzXCIsXG5cdFx0XHRcInR5cGVcIjogXCJNZWFzdXJlXCIsXG5cdFx0XHRcInZhbHVlc1wiOiBbeE1lYXN1cmVdXG5cdFx0fSxcblx0XHR7XG5cdFx0XHRcInVpZFwiOiBcInZhbHVlQXhpczJcIixcblx0XHRcdFwidHlwZVwiOiBcIk1lYXN1cmVcIixcblx0XHRcdFwidmFsdWVzXCI6IFt5TWVhc3VyZV1cblx0XHR9XG5cdF07XG5cblx0aWYgKGNoYXJ0RGVmaW5pdGlvbi5jaGFydFR5cGUgPT09IFwiYnViYmxlXCIpIHtcblx0XHQvLyBNZWFzdXJlIGZvciB0aGUgc2l6ZSBvZiB0aGUgYnViYmxlOiBmaXJzdCBtZWFzdXJlIGZvciBBeGlzMywgb3IgcmVtYWluaW5nIG1lYXN1cmUgZm9yIEF4aXMxL0F4aXMyIGlmIG5vdCBmb3VuZFxuXHRcdGNvbnN0IHNpemVNZWFzdXJlID0gYXhpczNNZWFzdXJlcy5zaGlmdCgpIHx8IGF4aXMxTWVhc3VyZXMuc2hpZnQoKSB8fCBheGlzMk1lYXN1cmVzLnNoaWZ0KCkgfHwgb3RoZXJNZWFzdXJlcy5zaGlmdCgpIHx8IFwiXCI7XG5cdFx0cmVzLnB1c2goe1xuXHRcdFx0XCJ1aWRcIjogXCJidWJibGVXaWR0aFwiLFxuXHRcdFx0XCJ0eXBlXCI6IFwiTWVhc3VyZVwiLFxuXHRcdFx0XCJ2YWx1ZXNcIjogW3NpemVNZWFzdXJlXVxuXHRcdH0pO1xuXHR9XG5cblx0Ly8gQ29sb3IgKG9wdGlvbmFsKVxuXHRpZiAoc2VyaWVzRGltZW5zaW9ucy5sZW5ndGgpIHtcblx0XHRyZXMucHVzaCh7XG5cdFx0XHRcInVpZFwiOiBcImNvbG9yXCIsXG5cdFx0XHRcInR5cGVcIjogXCJEaW1lbnNpb25cIixcblx0XHRcdFwidmFsdWVzXCI6IHNlcmllc0RpbWVuc2lvbnNcblx0XHR9KTtcblx0fVxuXHQvLyBTaGFwZSAob3B0aW9uYWwpXG5cdGlmIChzaGFwZURpbWVuc2lvbikge1xuXHRcdHJlcy5wdXNoKHtcblx0XHRcdFwidWlkXCI6IFwic2hhcGVcIixcblx0XHRcdFwidHlwZVwiOiBcIkRpbWVuc2lvblwiLFxuXHRcdFx0XCJ2YWx1ZXNcIjogW3NoYXBlRGltZW5zaW9uLmxhYmVsXVxuXHRcdH0pO1xuXHR9XG5cdHJldHVybiByZXM7XG59XG5cbmZ1bmN0aW9uIGdldENoYXJ0RmVlZHMoY2hhcnREZWZpbml0aW9uOiBLUElDaGFydERlZmluaXRpb24pOiB7IHVpZDogc3RyaW5nOyB0eXBlOiBzdHJpbmc7IHZhbHVlczogc3RyaW5nW10gfVtdIHtcblx0bGV0IHJlczogeyB1aWQ6IHN0cmluZzsgdHlwZTogc3RyaW5nOyB2YWx1ZXM6IHN0cmluZ1tdIH1bXTtcblxuXHRzd2l0Y2ggKGNoYXJ0RGVmaW5pdGlvbi5jaGFydFR5cGUpIHtcblx0XHRjYXNlIFwiRG9udXRcIjpcblx0XHRcdHJlcyA9IFtcblx0XHRcdFx0e1xuXHRcdFx0XHRcdFwidWlkXCI6IFwic2l6ZVwiLFxuXHRcdFx0XHRcdFwidHlwZVwiOiBcIk1lYXN1cmVcIixcblx0XHRcdFx0XHRcInZhbHVlc1wiOiBmaWx0ZXJNYXAoY2hhcnREZWZpbml0aW9uLm1lYXN1cmVzKVxuXHRcdFx0XHR9LFxuXHRcdFx0XHR7XG5cdFx0XHRcdFx0XCJ1aWRcIjogXCJjb2xvclwiLFxuXHRcdFx0XHRcdFwidHlwZVwiOiBcIkRpbWVuc2lvblwiLFxuXHRcdFx0XHRcdFwidmFsdWVzXCI6IGZpbHRlck1hcChjaGFydERlZmluaXRpb24uZGltZW5zaW9ucylcblx0XHRcdFx0fVxuXHRcdFx0XTtcblx0XHRcdGJyZWFrO1xuXG5cdFx0Y2FzZSBcImJ1YmJsZVwiOlxuXHRcdGNhc2UgXCJzY2F0dGVyXCI6XG5cdFx0XHRyZXMgPSBnZXRTY2F0dGVyQnViYmxlQ2hhcnRGZWVkcyhjaGFydERlZmluaXRpb24pO1xuXHRcdFx0YnJlYWs7XG5cblx0XHRjYXNlIFwidmVydGljYWxfYnVsbGV0XCI6XG5cdFx0XHRyZXMgPSBbXG5cdFx0XHRcdHtcblx0XHRcdFx0XHRcInVpZFwiOiBcImFjdHVhbFZhbHVlc1wiLFxuXHRcdFx0XHRcdFwidHlwZVwiOiBcIk1lYXN1cmVcIixcblx0XHRcdFx0XHRcInZhbHVlc1wiOiBmaWx0ZXJNYXAoY2hhcnREZWZpbml0aW9uLm1lYXN1cmVzLCBbdW5kZWZpbmVkLCBcIkF4aXMxXCJdKVxuXHRcdFx0XHR9LFxuXHRcdFx0XHR7XG5cdFx0XHRcdFx0XCJ1aWRcIjogXCJ0YXJnZXRWYWx1ZXNcIixcblx0XHRcdFx0XHRcInR5cGVcIjogXCJNZWFzdXJlXCIsXG5cdFx0XHRcdFx0XCJ2YWx1ZXNcIjogZmlsdGVyTWFwKGNoYXJ0RGVmaW5pdGlvbi5tZWFzdXJlcywgW1wiQXhpczJcIl0pXG5cdFx0XHRcdH0sXG5cdFx0XHRcdHtcblx0XHRcdFx0XHRcInVpZFwiOiBcImNhdGVnb3J5QXhpc1wiLFxuXHRcdFx0XHRcdFwidHlwZVwiOiBcIkRpbWVuc2lvblwiLFxuXHRcdFx0XHRcdFwidmFsdWVzXCI6IGZpbHRlck1hcChjaGFydERlZmluaXRpb24uZGltZW5zaW9ucywgW3VuZGVmaW5lZCwgXCJDYXRlZ29yeVwiXSlcblx0XHRcdFx0fSxcblx0XHRcdFx0e1xuXHRcdFx0XHRcdFwidWlkXCI6IFwiY29sb3JcIixcblx0XHRcdFx0XHRcInR5cGVcIjogXCJEaW1lbnNpb25cIixcblx0XHRcdFx0XHRcInZhbHVlc1wiOiBmaWx0ZXJNYXAoY2hhcnREZWZpbml0aW9uLmRpbWVuc2lvbnMsIFtcIlNlcmllc1wiXSlcblx0XHRcdFx0fVxuXHRcdFx0XTtcblx0XHRcdGJyZWFrO1xuXG5cdFx0ZGVmYXVsdDpcblx0XHRcdHJlcyA9IFtcblx0XHRcdFx0e1xuXHRcdFx0XHRcdFwidWlkXCI6IFwidmFsdWVBeGlzXCIsXG5cdFx0XHRcdFx0XCJ0eXBlXCI6IFwiTWVhc3VyZVwiLFxuXHRcdFx0XHRcdFwidmFsdWVzXCI6IGZpbHRlck1hcChjaGFydERlZmluaXRpb24ubWVhc3VyZXMpXG5cdFx0XHRcdH0sXG5cdFx0XHRcdHtcblx0XHRcdFx0XHRcInVpZFwiOiBcImNhdGVnb3J5QXhpc1wiLFxuXHRcdFx0XHRcdFwidHlwZVwiOiBcIkRpbWVuc2lvblwiLFxuXHRcdFx0XHRcdFwidmFsdWVzXCI6IGZpbHRlck1hcChjaGFydERlZmluaXRpb24uZGltZW5zaW9ucywgW3VuZGVmaW5lZCwgXCJDYXRlZ29yeVwiXSlcblx0XHRcdFx0fSxcblx0XHRcdFx0e1xuXHRcdFx0XHRcdFwidWlkXCI6IFwiY29sb3JcIixcblx0XHRcdFx0XHRcInR5cGVcIjogXCJEaW1lbnNpb25cIixcblx0XHRcdFx0XHRcInZhbHVlc1wiOiBmaWx0ZXJNYXAoY2hhcnREZWZpbml0aW9uLmRpbWVuc2lvbnMsIFtcIlNlcmllc1wiXSlcblx0XHRcdFx0fVxuXHRcdFx0XTtcblx0fVxuXG5cdHJldHVybiByZXM7XG59XG5cbi8qKlxuICogQGNsYXNzIEEgY29udHJvbGxlciBleHRlbnNpb24gZm9yIG1hbmFnaW5nIHRoZSBLUElzIGluIGFuIGFuYWx5dGljYWwgbGlzdCBwYWdlXG4gKlxuICogQG5hbWUgc2FwLmZlLmNvcmUuY29udHJvbGxlcmV4dGVuc2lvbnMuS1BJTWFuYWdlbWVudFxuICogQGhpZGVjb25zdHJ1Y3RvclxuICpcbiAqIEBwcml2YXRlXG4gKiBAc2luY2UgMS45My4wXG4gKi9cbkBVSTVDbGFzcyhcInNhcC5mZS5jb3JlLmNvbnRyb2xsZXJleHRlbnNpb25zLktQSU1hbmFnZW1lbnRcIiwgQ29udHJvbGxlckV4dGVuc2lvbk1ldGFkYXRhKVxuY2xhc3MgS1BJTWFuYWdlbWVudENvbnRyb2xsZXJFeHRlbnNpb24gZXh0ZW5kcyBDb250cm9sbGVyRXh0ZW5zaW9uIHtcblx0cHJvdGVjdGVkIGFLUElEZWZpbml0aW9ucz86IEtQSURlZmluaXRpb25bXTtcblx0cHJvdGVjdGVkIG9DYXJkITogQ2FyZDtcblx0cHJvdGVjdGVkIG9Qb3BvdmVyITogUG9wb3ZlcjtcblxuXHQvKipcblx0ICogQ3JlYXRlcyB0aGUgY2FyZCBtYW5pZmVzdCBmb3IgYSBLUEkgZGVmaW5pdGlvbiBhbmQgc3RvcmVzIGl0IGluIGEgSlNPTiBtb2RlbC5cblx0ICpcblx0ICogQHBhcmFtIGtwaURlZmluaXRpb24gVGhlIEtQSSBkZWZpbml0aW9uXG5cdCAqIEBwYXJhbSBvS1BJTW9kZWwgVGhlIEpTT04gbW9kZWwgaW4gd2hpY2ggdGhlIG1hbmlmZXN0IHdpbGwgYmUgc3RvcmVkXG5cdCAqL1xuXHRwcm90ZWN0ZWQgaW5pdENhcmRNYW5pZmVzdChrcGlEZWZpbml0aW9uOiBLUElEZWZpbml0aW9uLCBvS1BJTW9kZWw6IEpTT05Nb2RlbDxhbnk+KTogdm9pZCB7XG5cdFx0Y29uc3Qgb0NhcmRNYW5pZmVzdDogYW55ID0ge1xuXHRcdFx0XCJzYXAuYXBwXCI6IHtcblx0XHRcdFx0aWQ6IFwic2FwLmZlXCIsXG5cdFx0XHRcdHR5cGU6IFwiY2FyZFwiXG5cdFx0XHR9LFxuXHRcdFx0XCJzYXAudWlcIjoge1xuXHRcdFx0XHR0ZWNobm9sb2d5OiBcIlVJNVwiXG5cdFx0XHR9LFxuXHRcdFx0XCJzYXAuY2FyZFwiOiB7XG5cdFx0XHRcdHR5cGU6IFwiQW5hbHl0aWNhbFwiLFxuXHRcdFx0XHRkYXRhOiB7XG5cdFx0XHRcdFx0anNvbjoge31cblx0XHRcdFx0fSxcblx0XHRcdFx0aGVhZGVyOiB7XG5cdFx0XHRcdFx0dHlwZTogXCJOdW1lcmljXCIsXG5cdFx0XHRcdFx0dGl0bGU6IGtwaURlZmluaXRpb24uZGF0YXBvaW50LnRpdGxlLFxuXHRcdFx0XHRcdHN1YlRpdGxlOiBrcGlEZWZpbml0aW9uLmRhdGFwb2ludC5kZXNjcmlwdGlvbixcblx0XHRcdFx0XHR1bml0T2ZNZWFzdXJlbWVudDogXCJ7bWFpblVuaXR9XCIsXG5cdFx0XHRcdFx0bWFpbkluZGljYXRvcjoge1xuXHRcdFx0XHRcdFx0bnVtYmVyOiBcInttYWluVmFsdWVOb1NjYWxlfVwiLFxuXHRcdFx0XHRcdFx0dW5pdDogXCJ7bWFpblZhbHVlU2NhbGV9XCIsXG5cdFx0XHRcdFx0XHRzdGF0ZTogXCJ7bWFpblN0YXRlfVwiLFxuXHRcdFx0XHRcdFx0dHJlbmQ6IFwie3RyZW5kfVwiXG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9LFxuXHRcdFx0XHRjb250ZW50OiB7XG5cdFx0XHRcdFx0bWluSGVpZ2h0OiBcIjI1cmVtXCIsXG5cdFx0XHRcdFx0Y2hhcnRQcm9wZXJ0aWVzOiB7XG5cdFx0XHRcdFx0XHRwbG90QXJlYToge30sXG5cdFx0XHRcdFx0XHR0aXRsZToge1xuXHRcdFx0XHRcdFx0XHR2aXNpYmxlOiB0cnVlLFxuXHRcdFx0XHRcdFx0XHRhbGlnbm1lbnQ6IFwibGVmdFwiXG5cdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0fSxcblx0XHRcdFx0XHRkYXRhOiB7XG5cdFx0XHRcdFx0XHRwYXRoOiBcIi9jaGFydERhdGFcIlxuXHRcdFx0XHRcdH1cblx0XHRcdFx0fVxuXHRcdFx0fVxuXHRcdH07XG5cblx0XHQvLyBBZGQgc2lkZSBpbmRpY2F0b3JzIGluIHRoZSBjYXJkIGhlYWRlciBpZiBhIHRhcmdldCBpcyBkZWZpbmVkIGZvciB0aGUgS1BJXG5cdFx0aWYgKGtwaURlZmluaXRpb24uZGF0YXBvaW50LnRhcmdldFBhdGggfHwga3BpRGVmaW5pdGlvbi5kYXRhcG9pbnQudGFyZ2V0VmFsdWUgIT09IHVuZGVmaW5lZCkge1xuXHRcdFx0Y29uc3QgcmVzQnVuZGxlID0gc2FwLnVpLmdldENvcmUoKS5nZXRMaWJyYXJ5UmVzb3VyY2VCdW5kbGUoXCJzYXAuZmUuY29yZVwiKTtcblx0XHRcdG9DYXJkTWFuaWZlc3RbXCJzYXAuY2FyZFwiXS5oZWFkZXIuc2lkZUluZGljYXRvcnMgPSBbXG5cdFx0XHRcdHtcblx0XHRcdFx0XHR0aXRsZTogcmVzQnVuZGxlLmdldFRleHQoXCJDX0tQSUNBUkRfSU5ESUNBVE9SX1RBUkdFVFwiKSxcblx0XHRcdFx0XHRudW1iZXI6IFwie3RhcmdldE51bWJlcn1cIixcblx0XHRcdFx0XHR1bml0OiBcInt0YXJnZXRVbml0fVwiXG5cdFx0XHRcdH0sXG5cdFx0XHRcdHtcblx0XHRcdFx0XHR0aXRsZTogcmVzQnVuZGxlLmdldFRleHQoXCJDX0tQSUNBUkRfSU5ESUNBVE9SX0RFVklBVElPTlwiKSxcblx0XHRcdFx0XHRudW1iZXI6IFwie2RldmlhdGlvbk51bWJlcn1cIixcblx0XHRcdFx0XHR1bml0OiBcIiVcIlxuXHRcdFx0XHR9XG5cdFx0XHRdO1xuXHRcdH1cblxuXHRcdC8vIERldGFpbHMgb2YgdGhlIGNhcmQ6IGZpbHRlciBkZXNjcmlwdGlvbnNcblx0XHRpZiAoa3BpRGVmaW5pdGlvbi5zZWxlY3Rpb25WYXJpYW50RmlsdGVyRGVmaW5pdGlvbnM/Lmxlbmd0aCkge1xuXHRcdFx0Y29uc3QgYURlc2NyaXB0aW9uczogc3RyaW5nW10gPSBbXTtcblx0XHRcdGtwaURlZmluaXRpb24uc2VsZWN0aW9uVmFyaWFudEZpbHRlckRlZmluaXRpb25zLmZvckVhY2goZmlsdGVyRGVmaW5pdGlvbiA9PiB7XG5cdFx0XHRcdGNvbnN0IGRlc2MgPSBnZXRGaWx0ZXJTdHJpbmdGcm9tRGVmaW5pdGlvbihmaWx0ZXJEZWZpbml0aW9uKTtcblx0XHRcdFx0aWYgKGRlc2MpIHtcblx0XHRcdFx0XHRhRGVzY3JpcHRpb25zLnB1c2goZGVzYyk7XG5cdFx0XHRcdH1cblx0XHRcdH0pO1xuXG5cdFx0XHRpZiAoYURlc2NyaXB0aW9ucy5sZW5ndGgpIHtcblx0XHRcdFx0b0NhcmRNYW5pZmVzdFtcInNhcC5jYXJkXCJdLmhlYWRlci5kZXRhaWxzID0gYURlc2NyaXB0aW9ucy5qb2luKFwiLCBcIik7XG5cdFx0XHR9XG5cdFx0fVxuXG5cdFx0Ly8gQ2hhcnQgc2V0dGluZ3M6IHR5cGUsIHRpdGxlLCBkaW1lbnNpb25zIGFuZCBtZWFzdXJlcyBpbiB0aGUgbWFuaWZlc3Rcblx0XHRvQ2FyZE1hbmlmZXN0W1wic2FwLmNhcmRcIl0uY29udGVudC5jaGFydFR5cGUgPSBrcGlEZWZpbml0aW9uLmNoYXJ0LmNoYXJ0VHlwZTtcblx0XHR1cGRhdGVDaGFydExhYmVsU2V0dGluZ3Moa3BpRGVmaW5pdGlvbi5jaGFydCwgb0NhcmRNYW5pZmVzdFtcInNhcC5jYXJkXCJdLmNvbnRlbnQuY2hhcnRQcm9wZXJ0aWVzKTtcblx0XHRvQ2FyZE1hbmlmZXN0W1wic2FwLmNhcmRcIl0uY29udGVudC5jaGFydFByb3BlcnRpZXMudGl0bGUudGV4dCA9IGZvcm1hdENoYXJ0VGl0bGUoa3BpRGVmaW5pdGlvbik7XG5cdFx0b0NhcmRNYW5pZmVzdFtcInNhcC5jYXJkXCJdLmNvbnRlbnQuZGltZW5zaW9ucyA9IGtwaURlZmluaXRpb24uY2hhcnQuZGltZW5zaW9ucy5tYXAoZGltZW5zaW9uID0+IHtcblx0XHRcdHJldHVybiB7IGxhYmVsOiBkaW1lbnNpb24ubGFiZWwsIHZhbHVlOiBcIntcIiArIGRpbWVuc2lvbi5uYW1lICsgXCJ9XCIgfTtcblx0XHR9KTtcblx0XHRvQ2FyZE1hbmlmZXN0W1wic2FwLmNhcmRcIl0uY29udGVudC5tZWFzdXJlcyA9IGtwaURlZmluaXRpb24uY2hhcnQubWVhc3VyZXMubWFwKG1lYXN1cmUgPT4ge1xuXHRcdFx0cmV0dXJuIHsgbGFiZWw6IG1lYXN1cmUubGFiZWwsIHZhbHVlOiBcIntcIiArIG1lYXN1cmUubmFtZSArIFwifVwiIH07XG5cdFx0fSk7XG5cdFx0b0NhcmRNYW5pZmVzdFtcInNhcC5jYXJkXCJdLmNvbnRlbnQuZmVlZHMgPSBnZXRDaGFydEZlZWRzKGtwaURlZmluaXRpb24uY2hhcnQpO1xuXG5cdFx0b0tQSU1vZGVsLnNldFByb3BlcnR5KFwiL1wiICsga3BpRGVmaW5pdGlvbi5pZCwge1xuXHRcdFx0bWFuaWZlc3Q6IG9DYXJkTWFuaWZlc3Rcblx0XHR9KTtcblx0fVxuXG5cdEBPdmVycmlkZSgpXG5cdHB1YmxpYyBvbkluaXQoKTogdm9pZCB7XG5cdFx0dGhpcy5hS1BJRGVmaW5pdGlvbnMgPSB0aGlzLmdldEtQSURhdGEoKTtcblxuXHRcdGlmICh0aGlzLmFLUElEZWZpbml0aW9ucyAmJiB0aGlzLmFLUElEZWZpbml0aW9ucy5sZW5ndGgpIHtcblx0XHRcdGNvbnN0IG9WaWV3ID0gdGhpcy5nZXRWaWV3KCk7XG5cdFx0XHRjb25zdCBvQXBwQ29tcG9uZW50ID0gKG9WaWV3LmdldENvbnRyb2xsZXIoKSBhcyBCYXNlQ29udHJvbGxlcikuZ2V0QXBwQ29tcG9uZW50KCkgYXMgYW55O1xuXG5cdFx0XHQvLyBDcmVhdGUgYSBKU09OIG1vZGVsIHRvIHN0b3JlIEtQSSBkYXRhXG5cdFx0XHRjb25zdCBvS1BJTW9kZWwgPSBuZXcgSlNPTk1vZGVsKCk7XG5cdFx0XHRvVmlldy5zZXRNb2RlbChvS1BJTW9kZWwsIFwia3BpTW9kZWxcIik7XG5cblx0XHRcdHRoaXMuYUtQSURlZmluaXRpb25zLmZvckVhY2goa3BpRGVmaW5pdGlvbiA9PiB7XG5cdFx0XHRcdC8vIENyZWF0ZSB0aGUgbWFuaWZlc3QgZm9yIHRoZSBLUEkgY2FyZCBhbmQgc3RvcmUgaXQgaW4gdGhlIEtQSSBtb2RlbFxuXHRcdFx0XHR0aGlzLmluaXRDYXJkTWFuaWZlc3Qoa3BpRGVmaW5pdGlvbiwgb0tQSU1vZGVsKTtcblxuXHRcdFx0XHQvLyBMb2FkIHRhZyBkYXRhIGZvciB0aGUgS1BJXG5cdFx0XHRcdHRoaXMubG9hZEtQSVRhZ0RhdGEoa3BpRGVmaW5pdGlvbiwgb0FwcENvbXBvbmVudC5nZXRNb2RlbCgpIGFzIE9EYXRhTW9kZWwsIG9LUElNb2RlbCkuY2F0Y2goZnVuY3Rpb24oZXJyOiBhbnkpIHtcblx0XHRcdFx0XHRMb2cuZXJyb3IoZXJyKTtcblx0XHRcdFx0fSk7XG5cdFx0XHR9KTtcblx0XHR9XG5cdH1cblxuXHRAT3ZlcnJpZGUoKVxuXHRwdWJsaWMgb25FeGl0KCk6IHZvaWQge1xuXHRcdGNvbnN0IG9LUElNb2RlbCA9IHRoaXMuZ2V0VmlldygpLmdldE1vZGVsKFwia3BpTW9kZWxcIikgYXMgSlNPTk1vZGVsPGFueT47XG5cblx0XHRpZiAob0tQSU1vZGVsKSB7XG5cdFx0XHRvS1BJTW9kZWwuZGVzdHJveSgpO1xuXHRcdH1cblx0fVxuXG5cdHByaXZhdGUgZ2V0S1BJRGF0YSgpOiBLUElEZWZpbml0aW9uW10gfCB1bmRlZmluZWQge1xuXHRcdGNvbnN0IG9WaWV3ID0gdGhpcy5nZXRWaWV3KCksXG5cdFx0XHRzQ3VzdG9tRGF0YSA9IG9WaWV3LmdldENvbnRlbnQoKVswXS5kYXRhKFwiS1BJRGF0YVwiKTtcblxuXHRcdGlmIChzQ3VzdG9tRGF0YSkge1xuXHRcdFx0Y29uc3QgdkRhdGEgPSB0eXBlb2Ygc0N1c3RvbURhdGEgPT09IFwic3RyaW5nXCIgPyBKU09OLnBhcnNlKHNDdXN0b21EYXRhKSA6IHNDdXN0b21EYXRhO1xuXHRcdFx0aWYgKFwiY3VzdG9tRGF0YVwiIGluIHZEYXRhKSB7XG5cdFx0XHRcdHJldHVybiB2RGF0YVtcImN1c3RvbURhdGFcIl07XG5cdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRyZXR1cm4gdkRhdGE7XG5cdFx0XHR9XG5cdFx0fSBlbHNlIHtcblx0XHRcdHJldHVybiB1bmRlZmluZWQ7XG5cdFx0fVxuXHR9XG5cblx0cHJpdmF0ZSB1cGRhdGVEYXRhcG9pbnRWYWx1ZUFuZEN1cnJlbmN5KGtwaURlZmluaXRpb246IEtQSURlZmluaXRpb24sIGtwaUNvbnRleHQ6IENvbnRleHQsIG9LUElNb2RlbDogSlNPTk1vZGVsPGFueT4pIHtcblx0XHRjb25zdCBjdXJyZW50TG9jYWxlID0gbmV3IExvY2FsZShcblx0XHRcdHNhcC51aVxuXHRcdFx0XHQuZ2V0Q29yZSgpXG5cdFx0XHRcdC5nZXRDb25maWd1cmF0aW9uKClcblx0XHRcdFx0LmdldExhbmd1YWdlKClcblx0XHQpO1xuXHRcdGNvbnN0IHJhd1VuaXQgPSBrcGlEZWZpbml0aW9uLmRhdGFwb2ludC51bml0Py5pc1BhdGhcblx0XHRcdD8ga3BpQ29udGV4dC5nZXRQcm9wZXJ0eShrcGlEZWZpbml0aW9uLmRhdGFwb2ludC51bml0LnZhbHVlKVxuXHRcdFx0OiBrcGlEZWZpbml0aW9uLmRhdGFwb2ludC51bml0Py52YWx1ZTtcblxuXHRcdGNvbnN0IGlzUGVyY2VudGFnZSA9IGtwaURlZmluaXRpb24uZGF0YXBvaW50LnVuaXQ/LmlzQ3VycmVuY3kgPT09IGZhbHNlICYmIHJhd1VuaXQgPT09IFwiJVwiO1xuXG5cdFx0Ly8gLy8vLy8vLy8vLy8vLy8vLy8vLy8vXG5cdFx0Ly8gTWFpbiBLUEkgdmFsdWVcblx0XHRjb25zdCByYXdWYWx1ZSA9IE51bWJlci5wYXJzZUZsb2F0KGtwaUNvbnRleHQuZ2V0UHJvcGVydHkoa3BpRGVmaW5pdGlvbi5kYXRhcG9pbnQucHJvcGVydHlQYXRoKSk7XG5cblx0XHQvLyBWYWx1ZSBmb3JtYXR0ZWQgd2l0aCBhIHNjYWxlXG5cdFx0Y29uc3Qga3BpVmFsdWUgPSBOdW1iZXJGb3JtYXQuZ2V0RmxvYXRJbnN0YW5jZShcblx0XHRcdHtcblx0XHRcdFx0c3R5bGU6IGlzUGVyY2VudGFnZSA/IHVuZGVmaW5lZCA6IFwic2hvcnRcIixcblx0XHRcdFx0bWluRnJhY3Rpb25EaWdpdHM6IDAsXG5cdFx0XHRcdG1heEZyYWN0aW9uRGlnaXRzOiAxLFxuXHRcdFx0XHRzaG93U2NhbGU6ICFpc1BlcmNlbnRhZ2Vcblx0XHRcdH0sXG5cdFx0XHRjdXJyZW50TG9jYWxlXG5cdFx0KS5mb3JtYXQocmF3VmFsdWUpO1xuXHRcdG9LUElNb2RlbC5zZXRQcm9wZXJ0eShcIi9cIiArIGtwaURlZmluaXRpb24uaWQgKyBcIi9tYW5pZmVzdC9zYXAuY2FyZC9kYXRhL2pzb24vbWFpblZhbHVlXCIsIGtwaVZhbHVlKTtcblxuXHRcdC8vIFZhbHVlIHdpdGhvdXQgYSBzY2FsZVxuXHRcdGNvbnN0IGtwaVZhbHVlVW5zY2FsZWQgPSBOdW1iZXJGb3JtYXQuZ2V0RmxvYXRJbnN0YW5jZShcblx0XHRcdHtcblx0XHRcdFx0bWF4RnJhY3Rpb25EaWdpdHM6IDIsXG5cdFx0XHRcdHNob3dTY2FsZTogZmFsc2UsXG5cdFx0XHRcdGdyb3VwaW5nRW5hYmxlZDogdHJ1ZVxuXHRcdFx0fSxcblx0XHRcdGN1cnJlbnRMb2NhbGVcblx0XHQpLmZvcm1hdChyYXdWYWx1ZSk7XG5cdFx0b0tQSU1vZGVsLnNldFByb3BlcnR5KFwiL1wiICsga3BpRGVmaW5pdGlvbi5pZCArIFwiL21hbmlmZXN0L3NhcC5jYXJkL2RhdGEvanNvbi9tYWluVmFsdWVVbnNjYWxlZFwiLCBrcGlWYWx1ZVVuc2NhbGVkKTtcblxuXHRcdC8vIFZhbHVlIGZvcm1hdHRlZCB3aXRoIHRoZSBzY2FsZSBvbWl0dGVkXG5cdFx0Y29uc3Qga3BpVmFsdWVOb1NjYWxlID0gTnVtYmVyRm9ybWF0LmdldEZsb2F0SW5zdGFuY2UoXG5cdFx0XHR7XG5cdFx0XHRcdHN0eWxlOiBpc1BlcmNlbnRhZ2UgPyB1bmRlZmluZWQgOiBcInNob3J0XCIsXG5cdFx0XHRcdG1pbkZyYWN0aW9uRGlnaXRzOiAwLFxuXHRcdFx0XHRtYXhGcmFjdGlvbkRpZ2l0czogMSxcblx0XHRcdFx0c2hvd1NjYWxlOiBmYWxzZVxuXHRcdFx0fSxcblx0XHRcdGN1cnJlbnRMb2NhbGVcblx0XHQpLmZvcm1hdChyYXdWYWx1ZSk7XG5cdFx0b0tQSU1vZGVsLnNldFByb3BlcnR5KFwiL1wiICsga3BpRGVmaW5pdGlvbi5pZCArIFwiL21hbmlmZXN0L3NhcC5jYXJkL2RhdGEvanNvbi9tYWluVmFsdWVOb1NjYWxlXCIsIGtwaVZhbHVlTm9TY2FsZSk7XG5cblx0XHQvLyBTY2FsZSBvZiB0aGUgdmFsdWVcblx0XHRjb25zdCBrcGlWYWx1ZVNjYWxlID0gTnVtYmVyRm9ybWF0LmdldEZsb2F0SW5zdGFuY2UoXG5cdFx0XHR7XG5cdFx0XHRcdHN0eWxlOiBpc1BlcmNlbnRhZ2UgPyB1bmRlZmluZWQgOiBcInNob3J0XCIsXG5cdFx0XHRcdGRlY2ltYWxzOiAwLFxuXHRcdFx0XHRtYXhJbnRlZ2VyRGlnaXRzOiAwLFxuXHRcdFx0XHRzaG93U2NhbGU6IHRydWVcblx0XHRcdH0sXG5cdFx0XHRjdXJyZW50TG9jYWxlXG5cdFx0KS5mb3JtYXQocmF3VmFsdWUpO1xuXHRcdG9LUElNb2RlbC5zZXRQcm9wZXJ0eShcIi9cIiArIGtwaURlZmluaXRpb24uaWQgKyBcIi9tYW5pZmVzdC9zYXAuY2FyZC9kYXRhL2pzb24vbWFpblZhbHVlU2NhbGVcIiwga3BpVmFsdWVTY2FsZSk7XG5cblx0XHQvLyAvLy8vLy8vLy8vLy8vLy8vLy8vLy9cblx0XHQvLyBVbml0IG9yIGN1cnJlbmN5XG5cdFx0aWYgKGtwaURlZmluaXRpb24uZGF0YXBvaW50LnVuaXQgJiYgcmF3VW5pdCkge1xuXHRcdFx0aWYgKGtwaURlZmluaXRpb24uZGF0YXBvaW50LnVuaXQuaXNDdXJyZW5jeSkge1xuXHRcdFx0XHRvS1BJTW9kZWwuc2V0UHJvcGVydHkoXCIvXCIgKyBrcGlEZWZpbml0aW9uLmlkICsgXCIvbWFuaWZlc3Qvc2FwLmNhcmQvZGF0YS9qc29uL21haW5Vbml0XCIsIHJhd1VuaXQpO1xuXHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0Ly8gSW4gY2FzZSBvZiB1bml0IG9mIG1lYXN1cmUsIHdlIGhhdmUgdG8gZm9ybWF0IGl0IHByb3Blcmx5XG5cdFx0XHRcdGNvbnN0IGtwaVVuaXQgPSBOdW1iZXJGb3JtYXQuZ2V0VW5pdEluc3RhbmNlKHsgc2hvd051bWJlcjogZmFsc2UgfSwgY3VycmVudExvY2FsZSkuZm9ybWF0KHJhd1ZhbHVlLCByYXdVbml0KTtcblx0XHRcdFx0b0tQSU1vZGVsLnNldFByb3BlcnR5KFwiL1wiICsga3BpRGVmaW5pdGlvbi5pZCArIFwiL21hbmlmZXN0L3NhcC5jYXJkL2RhdGEvanNvbi9tYWluVW5pdFwiLCBrcGlVbml0KTtcblx0XHRcdH1cblx0XHR9XG5cdH1cblxuXHRwcml2YXRlIHVwZGF0ZURhdGFwb2ludENyaXRpY2FsaXR5KGtwaURlZmluaXRpb246IEtQSURlZmluaXRpb24sIGtwaUNvbnRleHQ6IENvbnRleHQsIG9LUElNb2RlbDogSlNPTk1vZGVsPGFueT4pIHtcblx0XHRjb25zdCByYXdWYWx1ZSA9IE51bWJlci5wYXJzZUZsb2F0KGtwaUNvbnRleHQuZ2V0UHJvcGVydHkoa3BpRGVmaW5pdGlvbi5kYXRhcG9pbnQucHJvcGVydHlQYXRoKSk7XG5cblx0XHRsZXQgY3JpdGljYWxpdHlWYWx1ZSA9IE1lc3NhZ2VUeXBlLk5vbmU7XG5cdFx0aWYgKGtwaURlZmluaXRpb24uZGF0YXBvaW50LmNyaXRpY2FsaXR5VmFsdWUpIHtcblx0XHRcdC8vIENyaXRpY2FsaXR5IGlzIGEgZml4ZWQgdmFsdWVcblx0XHRcdGNyaXRpY2FsaXR5VmFsdWUgPSBrcGlEZWZpbml0aW9uLmRhdGFwb2ludC5jcml0aWNhbGl0eVZhbHVlO1xuXHRcdH0gZWxzZSBpZiAoa3BpRGVmaW5pdGlvbi5kYXRhcG9pbnQuY3JpdGljYWxpdHlQYXRoKSB7XG5cdFx0XHQvLyBDcml0aWNhbGl0eSBjb21lcyBmcm9tIGFub3RoZXIgcHJvcGVydHkgKHZpYSBhIHBhdGgpXG5cdFx0XHRjcml0aWNhbGl0eVZhbHVlID1cblx0XHRcdFx0TWVzc2FnZVR5cGVGcm9tQ3JpdGljYWxpdHlba3BpQ29udGV4dC5nZXRQcm9wZXJ0eShrcGlEZWZpbml0aW9uLmRhdGFwb2ludC5jcml0aWNhbGl0eVBhdGgpXSB8fCBNZXNzYWdlVHlwZS5Ob25lO1xuXHRcdH0gZWxzZSBpZiAoa3BpRGVmaW5pdGlvbi5kYXRhcG9pbnQuY3JpdGljYWxpdHlDYWxjdWxhdGlvblRocmVzaG9sZHMgJiYga3BpRGVmaW5pdGlvbi5kYXRhcG9pbnQuY3JpdGljYWxpdHlDYWxjdWxhdGlvbk1vZGUpIHtcblx0XHRcdC8vIENyaXRpY2FsaXR5IGNhbGN1bGF0aW9uXG5cdFx0XHRzd2l0Y2ggKGtwaURlZmluaXRpb24uZGF0YXBvaW50LmNyaXRpY2FsaXR5Q2FsY3VsYXRpb25Nb2RlKSB7XG5cdFx0XHRcdGNhc2UgXCJVSS5JbXByb3ZlbWVudERpcmVjdGlvblR5cGUvVGFyZ2V0XCI6XG5cdFx0XHRcdFx0Y3JpdGljYWxpdHlWYWx1ZSA9IG1lc3NhZ2VUeXBlRnJvbVRhcmdldENhbGN1bGF0aW9uKHJhd1ZhbHVlLCBrcGlEZWZpbml0aW9uLmRhdGFwb2ludC5jcml0aWNhbGl0eUNhbGN1bGF0aW9uVGhyZXNob2xkcyk7XG5cdFx0XHRcdFx0YnJlYWs7XG5cblx0XHRcdFx0Y2FzZSBcIlVJLkltcHJvdmVtZW50RGlyZWN0aW9uVHlwZS9NaW5pbWl6ZVwiOlxuXHRcdFx0XHRcdGNyaXRpY2FsaXR5VmFsdWUgPSBtZXNzYWdlVHlwZUZyb21NaW5pbWl6ZUNhbGN1bGF0aW9uKFxuXHRcdFx0XHRcdFx0cmF3VmFsdWUsXG5cdFx0XHRcdFx0XHRrcGlEZWZpbml0aW9uLmRhdGFwb2ludC5jcml0aWNhbGl0eUNhbGN1bGF0aW9uVGhyZXNob2xkc1xuXHRcdFx0XHRcdCk7XG5cdFx0XHRcdFx0YnJlYWs7XG5cblx0XHRcdFx0Y2FzZSBcIlVJLkltcHJvdmVtZW50RGlyZWN0aW9uVHlwZS9NYXhpbWl6ZVwiOlxuXHRcdFx0XHRkZWZhdWx0OlxuXHRcdFx0XHRcdGNyaXRpY2FsaXR5VmFsdWUgPSBtZXNzYWdlVHlwZUZyb21NYXhpbWl6ZUNhbGN1bGF0aW9uKFxuXHRcdFx0XHRcdFx0cmF3VmFsdWUsXG5cdFx0XHRcdFx0XHRrcGlEZWZpbml0aW9uLmRhdGFwb2ludC5jcml0aWNhbGl0eUNhbGN1bGF0aW9uVGhyZXNob2xkc1xuXHRcdFx0XHRcdCk7XG5cdFx0XHRcdFx0YnJlYWs7XG5cdFx0XHR9XG5cdFx0fVxuXG5cdFx0b0tQSU1vZGVsLnNldFByb3BlcnR5KFwiL1wiICsga3BpRGVmaW5pdGlvbi5pZCArIFwiL21hbmlmZXN0L3NhcC5jYXJkL2RhdGEvanNvbi9tYWluQ3JpdGljYWxpdHlcIiwgY3JpdGljYWxpdHlWYWx1ZSk7XG5cdFx0b0tQSU1vZGVsLnNldFByb3BlcnR5KFxuXHRcdFx0XCIvXCIgKyBrcGlEZWZpbml0aW9uLmlkICsgXCIvbWFuaWZlc3Qvc2FwLmNhcmQvZGF0YS9qc29uL21haW5TdGF0ZVwiLFxuXHRcdFx0VmFsdWVDb2xvckZyb21NZXNzYWdlVHlwZVtjcml0aWNhbGl0eVZhbHVlXSB8fCBcIk5vbmVcIlxuXHRcdCk7XG5cdH1cblxuXHRwcml2YXRlIHVwZGF0ZURhdGFwb2ludFRyZW5kKGtwaURlZmluaXRpb246IEtQSURlZmluaXRpb24sIGtwaUNvbnRleHQ6IENvbnRleHQsIG9LUElNb2RlbDogSlNPTk1vZGVsPGFueT4pIHtcblx0XHRjb25zdCByYXdWYWx1ZSA9IE51bWJlci5wYXJzZUZsb2F0KGtwaUNvbnRleHQuZ2V0UHJvcGVydHkoa3BpRGVmaW5pdGlvbi5kYXRhcG9pbnQucHJvcGVydHlQYXRoKSk7XG5cblx0XHRsZXQgdHJlbmRWYWx1ZSA9IFwiTm9uZVwiO1xuXG5cdFx0aWYgKGtwaURlZmluaXRpb24uZGF0YXBvaW50LnRyZW5kVmFsdWUpIHtcblx0XHRcdC8vIFRyZW5kIGlzIGEgZml4ZWQgdmFsdWVcblx0XHRcdHRyZW5kVmFsdWUgPSBrcGlEZWZpbml0aW9uLmRhdGFwb2ludC50cmVuZFZhbHVlO1xuXHRcdH0gZWxzZSBpZiAoa3BpRGVmaW5pdGlvbi5kYXRhcG9pbnQudHJlbmRQYXRoKSB7XG5cdFx0XHQvLyBUcmVuZCBjb21lcyBmcm9tIGFub3RoZXIgcHJvcGVydHkgdmlhIGEgcGF0aFxuXHRcdFx0dHJlbmRWYWx1ZSA9IGRldmlhdGlvbkluZGljYXRvckZyb21UcmVuZFR5cGUoa3BpQ29udGV4dC5nZXRQcm9wZXJ0eShrcGlEZWZpbml0aW9uLmRhdGFwb2ludC50cmVuZFBhdGgpKTtcblx0XHR9IGVsc2UgaWYgKFxuXHRcdFx0a3BpRGVmaW5pdGlvbi5kYXRhcG9pbnQudHJlbmRDYWxjdWxhdGlvblJlZmVyZW5jZVZhbHVlICE9PSB1bmRlZmluZWQgfHxcblx0XHRcdGtwaURlZmluaXRpb24uZGF0YXBvaW50LnRyZW5kQ2FsY3VsYXRpb25SZWZlcmVuY2VQYXRoXG5cdFx0KSB7XG5cdFx0XHQvLyBDYWxjdWxhdGVkIHRyZW5kXG5cdFx0XHRsZXQgdHJlbmRSZWZlcmVuY2VWYWx1ZTogbnVtYmVyO1xuXHRcdFx0aWYgKGtwaURlZmluaXRpb24uZGF0YXBvaW50LnRyZW5kQ2FsY3VsYXRpb25SZWZlcmVuY2VWYWx1ZSAhPT0gdW5kZWZpbmVkKSB7XG5cdFx0XHRcdHRyZW5kUmVmZXJlbmNlVmFsdWUgPSBrcGlEZWZpbml0aW9uLmRhdGFwb2ludC50cmVuZENhbGN1bGF0aW9uUmVmZXJlbmNlVmFsdWU7XG5cdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHR0cmVuZFJlZmVyZW5jZVZhbHVlID0gTnVtYmVyLnBhcnNlRmxvYXQoXG5cdFx0XHRcdFx0a3BpQ29udGV4dC5nZXRQcm9wZXJ0eShrcGlEZWZpbml0aW9uLmRhdGFwb2ludC50cmVuZENhbGN1bGF0aW9uUmVmZXJlbmNlUGF0aCB8fCBcIlwiKVxuXHRcdFx0XHQpO1xuXHRcdFx0fVxuXHRcdFx0dHJlbmRWYWx1ZSA9IGRldmlhdGlvbkluZGljYXRvckZyb21DYWxjdWxhdGlvbihcblx0XHRcdFx0cmF3VmFsdWUsXG5cdFx0XHRcdHRyZW5kUmVmZXJlbmNlVmFsdWUsXG5cdFx0XHRcdCEha3BpRGVmaW5pdGlvbi5kYXRhcG9pbnQudHJlbmRDYWxjdWxhdGlvbklzUmVsYXRpdmUsXG5cdFx0XHRcdGtwaURlZmluaXRpb24uZGF0YXBvaW50LnRyZW5kQ2FsY3VsYXRpb25UcmVzaG9sZHNcblx0XHRcdCk7XG5cdFx0fVxuXG5cdFx0b0tQSU1vZGVsLnNldFByb3BlcnR5KFwiL1wiICsga3BpRGVmaW5pdGlvbi5pZCArIFwiL21hbmlmZXN0L3NhcC5jYXJkL2RhdGEvanNvbi90cmVuZFwiLCB0cmVuZFZhbHVlKTtcblx0fVxuXG5cdHByaXZhdGUgdXBkYXRlVGFyZ2V0VmFsdWUoa3BpRGVmaW5pdGlvbjogS1BJRGVmaW5pdGlvbiwga3BpQ29udGV4dDogQ29udGV4dCwgb0tQSU1vZGVsOiBKU09OTW9kZWw8YW55Pikge1xuXHRcdGlmIChrcGlEZWZpbml0aW9uLmRhdGFwb2ludC50YXJnZXRWYWx1ZSA9PT0gdW5kZWZpbmVkICYmIGtwaURlZmluaXRpb24uZGF0YXBvaW50LnRhcmdldFBhdGggPT09IHVuZGVmaW5lZCkge1xuXHRcdFx0cmV0dXJuOyAvLyBObyB0YXJnZXQgc2V0IGZvciB0aGUgS1BJXG5cdFx0fVxuXHRcdGNvbnN0IHJhd1ZhbHVlID0gTnVtYmVyLnBhcnNlRmxvYXQoa3BpQ29udGV4dC5nZXRQcm9wZXJ0eShrcGlEZWZpbml0aW9uLmRhdGFwb2ludC5wcm9wZXJ0eVBhdGgpKTtcblx0XHRjb25zdCBjdXJyZW50TG9jYWxlID0gbmV3IExvY2FsZShcblx0XHRcdHNhcC51aVxuXHRcdFx0XHQuZ2V0Q29yZSgpXG5cdFx0XHRcdC5nZXRDb25maWd1cmF0aW9uKClcblx0XHRcdFx0LmdldExhbmd1YWdlKClcblx0XHQpO1xuXG5cdFx0bGV0IHRhcmdldFJhd1ZhbHVlOiBudW1iZXI7XG5cdFx0aWYgKGtwaURlZmluaXRpb24uZGF0YXBvaW50LnRhcmdldFZhbHVlICE9PSB1bmRlZmluZWQpIHtcblx0XHRcdHRhcmdldFJhd1ZhbHVlID0ga3BpRGVmaW5pdGlvbi5kYXRhcG9pbnQudGFyZ2V0VmFsdWU7XG5cdFx0fSBlbHNlIHtcblx0XHRcdHRhcmdldFJhd1ZhbHVlID0gTnVtYmVyLnBhcnNlRmxvYXQoa3BpQ29udGV4dC5nZXRQcm9wZXJ0eShrcGlEZWZpbml0aW9uLmRhdGFwb2ludC50YXJnZXRQYXRoIHx8IFwiXCIpKTtcblx0XHR9XG5cdFx0Y29uc3QgZGV2aWF0aW9uUmF3VmFsdWUgPSB0YXJnZXRSYXdWYWx1ZSAhPT0gMCA/ICgocmF3VmFsdWUgLSB0YXJnZXRSYXdWYWx1ZSkgLyB0YXJnZXRSYXdWYWx1ZSkgKiAxMDAgOiB1bmRlZmluZWQ7XG5cblx0XHQvLyBGb3JtYXR0aW5nXG5cdFx0Y29uc3QgdGFyZ2V0VmFsdWUgPSBOdW1iZXJGb3JtYXQuZ2V0RmxvYXRJbnN0YW5jZShcblx0XHRcdHtcblx0XHRcdFx0c3R5bGU6IFwic2hvcnRcIixcblx0XHRcdFx0bWluRnJhY3Rpb25EaWdpdHM6IDAsXG5cdFx0XHRcdG1heEZyYWN0aW9uRGlnaXRzOiAxLFxuXHRcdFx0XHRzaG93U2NhbGU6IGZhbHNlXG5cdFx0XHR9LFxuXHRcdFx0Y3VycmVudExvY2FsZVxuXHRcdCkuZm9ybWF0KHRhcmdldFJhd1ZhbHVlKTtcblx0XHRjb25zdCB0YXJnZXRTY2FsZSA9IE51bWJlckZvcm1hdC5nZXRGbG9hdEluc3RhbmNlKFxuXHRcdFx0e1xuXHRcdFx0XHRzdHlsZTogXCJzaG9ydFwiLFxuXHRcdFx0XHRkZWNpbWFsczogMCxcblx0XHRcdFx0bWF4SW50ZWdlckRpZ2l0czogMCxcblx0XHRcdFx0c2hvd1NjYWxlOiB0cnVlXG5cdFx0XHR9LFxuXHRcdFx0Y3VycmVudExvY2FsZVxuXHRcdCkuZm9ybWF0KHRhcmdldFJhd1ZhbHVlKTtcblxuXHRcdG9LUElNb2RlbC5zZXRQcm9wZXJ0eShcIi9cIiArIGtwaURlZmluaXRpb24uaWQgKyBcIi9tYW5pZmVzdC9zYXAuY2FyZC9kYXRhL2pzb24vdGFyZ2V0TnVtYmVyXCIsIHRhcmdldFZhbHVlKTtcblx0XHRvS1BJTW9kZWwuc2V0UHJvcGVydHkoXCIvXCIgKyBrcGlEZWZpbml0aW9uLmlkICsgXCIvbWFuaWZlc3Qvc2FwLmNhcmQvZGF0YS9qc29uL3RhcmdldFVuaXRcIiwgdGFyZ2V0U2NhbGUpO1xuXG5cdFx0aWYgKGRldmlhdGlvblJhd1ZhbHVlICE9PSB1bmRlZmluZWQpIHtcblx0XHRcdGNvbnN0IGRldmlhdGlvblZhbHVlID0gTnVtYmVyRm9ybWF0LmdldEZsb2F0SW5zdGFuY2UoXG5cdFx0XHRcdHtcblx0XHRcdFx0XHRtaW5GcmFjdGlvbkRpZ2l0czogMCxcblx0XHRcdFx0XHRtYXhGcmFjdGlvbkRpZ2l0czogMSxcblx0XHRcdFx0XHRzaG93U2NhbGU6IGZhbHNlXG5cdFx0XHRcdH0sXG5cdFx0XHRcdGN1cnJlbnRMb2NhbGVcblx0XHRcdCkuZm9ybWF0KGRldmlhdGlvblJhd1ZhbHVlKTtcblx0XHRcdG9LUElNb2RlbC5zZXRQcm9wZXJ0eShcIi9cIiArIGtwaURlZmluaXRpb24uaWQgKyBcIi9tYW5pZmVzdC9zYXAuY2FyZC9kYXRhL2pzb24vZGV2aWF0aW9uTnVtYmVyXCIsIGRldmlhdGlvblZhbHVlKTtcblx0XHR9IGVsc2Uge1xuXHRcdFx0b0tQSU1vZGVsLnNldFByb3BlcnR5KFwiL1wiICsga3BpRGVmaW5pdGlvbi5pZCArIFwiL21hbmlmZXN0L3NhcC5jYXJkL2RhdGEvanNvbi9kZXZpYXRpb25OdW1iZXJcIiwgXCJOL0FcIik7XG5cdFx0fVxuXHR9XG5cblx0LyoqXG5cdCAqIExvYWRzIHRhZyBkYXRhIGZvciBhIEtQSSwgYW5kIHN0b3JlcyBpdCBpbiB0aGUgSlNPTiBLUEkgbW9kZWwuXG5cdCAqXG5cdCAqIEBwYXJhbSB7S1BJRGVmaW5pdGlvbn0ga3BpRGVmaW5pdGlvbiBUaGUgZGVmaW5pdGlvbiBvZiB0aGUgS1BJLlxuXHQgKiBAcGFyYW0ge09EYXRhTW9kZWx9IG9NYWluTW9kZWwgVGhlIG1vZGVsIHVzZWQgdG8gbG9hZCB0aGUgZGF0YS5cblx0ICogQHBhcmFtIHtKU09OTW9kZWx9IG9LUElNb2RlbCBUaGUgSlNPTiBtb2RlbCB3aGVyZSB0aGUgZGF0YSB3aWxsIGJlIHN0b3JlZFxuXHQgKiBAcGFyYW0gbG9hZEZ1bGwgSWYgbm90IHRydWUsIGxvYWRzIG9ubHkgZGF0YSBmb3IgdGhlIEtQSSB0YWdcblx0ICogQHJldHVybnMge1Byb21pc2V9IFJldHVybnMgdGhlIHByb21pc2UgdGhhdCBpcyByZXNvbHZlZCB3aGVuIGRhdGEgaXMgbG9hZGVkLlxuXHQgKi9cblx0cHJvdGVjdGVkIGxvYWRLUElUYWdEYXRhKGtwaURlZmluaXRpb246IEtQSURlZmluaXRpb24sIG9NYWluTW9kZWw6IE9EYXRhTW9kZWwsIG9LUElNb2RlbDogSlNPTk1vZGVsPGFueT4sIGxvYWRGdWxsPzogYm9vbGVhbik6IGFueSB7XG5cdFx0Ly8gSWYgbG9hZEZ1bGw9ZmFsc2UsIHRoZW4gd2UncmUganVzdCBsb2FkaW5nIGRhdGEgZm9yIHRoZSB0YWcgYW5kIHdlIHVzZSB0aGUgXCIkYXV0by5Mb25nUnVubmVyc1wiIGdyb3VwSURcblx0XHQvLyBJZiBsb2FkRnVsbD10cnVlLCB3ZSdyZSBsb2FkaW5nIGRhdGEgZm9yIHRoZSB3aG9sZSBLUEkgKHRhZyArIGNhcmQpIGFuZCB3ZSB1c2UgdGhlIGRlZmF1bHQgKFwiJGF1dG9cIikgZ3JvdXBJRFxuXHRcdGNvbnN0IG9MaXN0QmluZGluZyA9IGxvYWRGdWxsXG5cdFx0XHQ/IG9NYWluTW9kZWwuYmluZExpc3QoXCIvXCIgKyBrcGlEZWZpbml0aW9uLmVudGl0eVNldClcblx0XHRcdDogb01haW5Nb2RlbC5iaW5kTGlzdChcIi9cIiArIGtwaURlZmluaXRpb24uZW50aXR5U2V0LCB1bmRlZmluZWQsIHVuZGVmaW5lZCwgdW5kZWZpbmVkLCB7ICQkZ3JvdXBJZDogXCIkYXV0by5Mb25nUnVubmVyc1wiIH0pO1xuXHRcdGNvbnN0IG9BZ2dyZWdhdGU6IFJlY29yZDxzdHJpbmcsIHsgdW5pdD86IHN0cmluZyB9PiA9IHt9O1xuXG5cdFx0Ly8gTWFpbiB2YWx1ZSArIGN1cnJlbmN5L3VuaXRcblx0XHRpZiAoa3BpRGVmaW5pdGlvbi5kYXRhcG9pbnQudW5pdD8uaXNQYXRoKSB7XG5cdFx0XHRvQWdncmVnYXRlW2twaURlZmluaXRpb24uZGF0YXBvaW50LnByb3BlcnR5UGF0aF0gPSB7IHVuaXQ6IGtwaURlZmluaXRpb24uZGF0YXBvaW50LnVuaXQudmFsdWUgfTtcblx0XHR9IGVsc2Uge1xuXHRcdFx0b0FnZ3JlZ2F0ZVtrcGlEZWZpbml0aW9uLmRhdGFwb2ludC5wcm9wZXJ0eVBhdGhdID0ge307XG5cdFx0fVxuXG5cdFx0Ly8gUHJvcGVydHkgZm9yIGNyaXRpY2FsaXR5XG5cdFx0aWYgKGtwaURlZmluaXRpb24uZGF0YXBvaW50LmNyaXRpY2FsaXR5UGF0aCkge1xuXHRcdFx0b0FnZ3JlZ2F0ZVtrcGlEZWZpbml0aW9uLmRhdGFwb2ludC5jcml0aWNhbGl0eVBhdGhdID0ge307XG5cdFx0fVxuXG5cdFx0Ly8gUHJvcGVydGllcyBmb3IgdHJlbmQgYW5kIHRyZW5kIGNhbGN1bGF0aW9uXG5cdFx0aWYgKGxvYWRGdWxsKSB7XG5cdFx0XHRpZiAoa3BpRGVmaW5pdGlvbi5kYXRhcG9pbnQudHJlbmRQYXRoKSB7XG5cdFx0XHRcdG9BZ2dyZWdhdGVba3BpRGVmaW5pdGlvbi5kYXRhcG9pbnQudHJlbmRQYXRoXSA9IHt9O1xuXHRcdFx0fVxuXHRcdFx0aWYgKGtwaURlZmluaXRpb24uZGF0YXBvaW50LnRyZW5kQ2FsY3VsYXRpb25SZWZlcmVuY2VQYXRoKSB7XG5cdFx0XHRcdG9BZ2dyZWdhdGVba3BpRGVmaW5pdGlvbi5kYXRhcG9pbnQudHJlbmRDYWxjdWxhdGlvblJlZmVyZW5jZVBhdGhdID0ge307XG5cdFx0XHR9XG5cdFx0XHRpZiAoa3BpRGVmaW5pdGlvbi5kYXRhcG9pbnQudGFyZ2V0UGF0aCkge1xuXHRcdFx0XHRvQWdncmVnYXRlW2twaURlZmluaXRpb24uZGF0YXBvaW50LnRhcmdldFBhdGhdID0ge307XG5cdFx0XHR9XG5cdFx0fVxuXG5cdFx0b0xpc3RCaW5kaW5nLnNldEFnZ3JlZ2F0aW9uKHsgYWdncmVnYXRlOiBvQWdncmVnYXRlIH0pO1xuXG5cdFx0Ly8gTWFuYWdlIFNlbGVjdGlvblZhcmlhbnQgZmlsdGVyc1xuXHRcdGlmIChrcGlEZWZpbml0aW9uLnNlbGVjdGlvblZhcmlhbnRGaWx0ZXJEZWZpbml0aW9ucz8ubGVuZ3RoKSB7XG5cdFx0XHRjb25zdCBhRmlsdGVycyA9IGtwaURlZmluaXRpb24uc2VsZWN0aW9uVmFyaWFudEZpbHRlckRlZmluaXRpb25zLm1hcChjcmVhdGVGaWx0ZXJGcm9tRGVmaW5pdGlvbikuZmlsdGVyKGZpbHRlciA9PiB7XG5cdFx0XHRcdHJldHVybiBmaWx0ZXIgIT09IHVuZGVmaW5lZDtcblx0XHRcdH0pIGFzIEZpbHRlcltdO1xuXHRcdFx0b0xpc3RCaW5kaW5nLmZpbHRlcihhRmlsdGVycyk7XG5cdFx0fVxuXG5cdFx0cmV0dXJuIG9MaXN0QmluZGluZy5yZXF1ZXN0Q29udGV4dHMoMCwgMSkudGhlbigoYUNvbnRleHRzOiBDb250ZXh0W10pID0+IHtcblx0XHRcdGlmIChhQ29udGV4dHMubGVuZ3RoKSB7XG5cdFx0XHRcdGNvbnN0IHJhd1VuaXQgPSBrcGlEZWZpbml0aW9uLmRhdGFwb2ludC51bml0Py5pc1BhdGhcblx0XHRcdFx0XHQ/IGFDb250ZXh0c1swXS5nZXRQcm9wZXJ0eShrcGlEZWZpbml0aW9uLmRhdGFwb2ludC51bml0LnZhbHVlKVxuXHRcdFx0XHRcdDoga3BpRGVmaW5pdGlvbi5kYXRhcG9pbnQudW5pdD8udmFsdWU7XG5cblx0XHRcdFx0aWYgKGtwaURlZmluaXRpb24uZGF0YXBvaW50LnVuaXQgJiYgIXJhd1VuaXQpIHtcblx0XHRcdFx0XHQvLyBBIHVuaXQvY3VycmVuY3kgaXMgZGVmaW5lZCwgYnV0IGl0cyB2YWx1ZSBpcyB1bmRlZmluZWQgLS0+IG11bHRpLXVuaXQgc2l0dWF0aW9uXG5cdFx0XHRcdFx0b0tQSU1vZGVsLnNldFByb3BlcnR5KFwiL1wiICsga3BpRGVmaW5pdGlvbi5pZCArIFwiL21hbmlmZXN0L3NhcC5jYXJkL2RhdGEvanNvbi9tYWluVmFsdWVcIiwgXCIqXCIpO1xuXHRcdFx0XHRcdG9LUElNb2RlbC5zZXRQcm9wZXJ0eShcIi9cIiArIGtwaURlZmluaXRpb24uaWQgKyBcIi9tYW5pZmVzdC9zYXAuY2FyZC9kYXRhL2pzb24vbWFpblZhbHVlVW5zY2FsZWRcIiwgXCIqXCIpO1xuXHRcdFx0XHRcdG9LUElNb2RlbC5zZXRQcm9wZXJ0eShcIi9cIiArIGtwaURlZmluaXRpb24uaWQgKyBcIi9tYW5pZmVzdC9zYXAuY2FyZC9kYXRhL2pzb24vbWFpblZhbHVlTm9TY2FsZVwiLCBcIipcIik7XG5cdFx0XHRcdFx0b0tQSU1vZGVsLnNldFByb3BlcnR5KFwiL1wiICsga3BpRGVmaW5pdGlvbi5pZCArIFwiL21hbmlmZXN0L3NhcC5jYXJkL2RhdGEvanNvbi9tYWluVmFsdWVTY2FsZVwiLCBcIlwiKTtcblx0XHRcdFx0XHRvS1BJTW9kZWwuc2V0UHJvcGVydHkoXCIvXCIgKyBrcGlEZWZpbml0aW9uLmlkICsgXCIvbWFuaWZlc3Qvc2FwLmNhcmQvZGF0YS9qc29uL21haW5Vbml0XCIsIHVuZGVmaW5lZCk7XG5cdFx0XHRcdFx0b0tQSU1vZGVsLnNldFByb3BlcnR5KFwiL1wiICsga3BpRGVmaW5pdGlvbi5pZCArIFwiL21hbmlmZXN0L3NhcC5jYXJkL2RhdGEvanNvbi9tYWluQ3JpdGljYWxpdHlcIiwgTWVzc2FnZVR5cGUuTm9uZSk7XG5cdFx0XHRcdFx0b0tQSU1vZGVsLnNldFByb3BlcnR5KFwiL1wiICsga3BpRGVmaW5pdGlvbi5pZCArIFwiL21hbmlmZXN0L3NhcC5jYXJkL2RhdGEvanNvbi9tYWluU3RhdGVcIiwgXCJOb25lXCIpO1xuXHRcdFx0XHRcdG9LUElNb2RlbC5zZXRQcm9wZXJ0eShcIi9cIiArIGtwaURlZmluaXRpb24uaWQgKyBcIi9tYW5pZmVzdC9zYXAuY2FyZC9kYXRhL2pzb24vdHJlbmRcIiwgXCJOb25lXCIpO1xuXHRcdFx0XHRcdG9LUElNb2RlbC5zZXRQcm9wZXJ0eShcIi9cIiArIGtwaURlZmluaXRpb24uaWQgKyBcIi9tYW5pZmVzdC9zYXAuY2FyZC9kYXRhL2pzb24vdGFyZ2V0TnVtYmVyXCIsIHVuZGVmaW5lZCk7XG5cdFx0XHRcdFx0b0tQSU1vZGVsLnNldFByb3BlcnR5KFwiL1wiICsga3BpRGVmaW5pdGlvbi5pZCArIFwiL21hbmlmZXN0L3NhcC5jYXJkL2RhdGEvanNvbi90YXJnZXRVbml0XCIsIHVuZGVmaW5lZCk7XG5cdFx0XHRcdFx0b0tQSU1vZGVsLnNldFByb3BlcnR5KFwiL1wiICsga3BpRGVmaW5pdGlvbi5pZCArIFwiL21hbmlmZXN0L3NhcC5jYXJkL2RhdGEvanNvbi9kZXZpYXRpb25OdW1iZXJcIiwgdW5kZWZpbmVkKTtcblx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHR0aGlzLnVwZGF0ZURhdGFwb2ludFZhbHVlQW5kQ3VycmVuY3koa3BpRGVmaW5pdGlvbiwgYUNvbnRleHRzWzBdLCBvS1BJTW9kZWwpO1xuXHRcdFx0XHRcdHRoaXMudXBkYXRlRGF0YXBvaW50Q3JpdGljYWxpdHkoa3BpRGVmaW5pdGlvbiwgYUNvbnRleHRzWzBdLCBvS1BJTW9kZWwpO1xuXG5cdFx0XHRcdFx0aWYgKGxvYWRGdWxsKSB7XG5cdFx0XHRcdFx0XHR0aGlzLnVwZGF0ZURhdGFwb2ludFRyZW5kKGtwaURlZmluaXRpb24sIGFDb250ZXh0c1swXSwgb0tQSU1vZGVsKTtcblx0XHRcdFx0XHRcdHRoaXMudXBkYXRlVGFyZ2V0VmFsdWUoa3BpRGVmaW5pdGlvbiwgYUNvbnRleHRzWzBdLCBvS1BJTW9kZWwpO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0fVxuXHRcdFx0fVxuXHRcdH0pO1xuXHR9XG5cblx0LyoqXG5cdCAqIExvYWRzIGNhcmQgZGF0YSBmb3IgYSBLUEksIGFuZCBzdG9yZXMgaXQgaW4gdGhlIEpTT04gS1BJIG1vZGVsLlxuXHQgKlxuXHQgKiBAcGFyYW0ge0tQSURlZmluaXRpb259IGtwaURlZmluaXRpb24gVGhlIGRlZmluaXRpb24gb2YgdGhlIEtQSS5cblx0ICogQHBhcmFtIHtPRGF0YU1vZGVsfSBvTWFpbk1vZGVsIFRoZSBtb2RlbCB1c2VkIHRvIGxvYWQgdGhlIGRhdGEuXG5cdCAqIEBwYXJhbSB7SlNPTk1vZGVsfSBvS1BJTW9kZWwgVGhlIEpTT04gbW9kZWwgd2hlcmUgdGhlIGRhdGEgd2lsbCBiZSBzdG9yZWRcblx0ICogQHJldHVybnMge1Byb21pc2V9IFJldHVybnMgdGhlIHByb21pc2UgdGhhdCBpcyByZXNvbHZlZCB3aGVuIGRhdGEgaXMgbG9hZGVkLlxuXHQgKi9cblx0cHJvdGVjdGVkIGxvYWRLUElDYXJkRGF0YShrcGlEZWZpbml0aW9uOiBLUElEZWZpbml0aW9uLCBvTWFpbk1vZGVsOiBPRGF0YU1vZGVsLCBvS1BJTW9kZWw6IEpTT05Nb2RlbDxhbnk+KTogYW55IHtcblx0XHRjb25zdCBvTGlzdEJpbmRpbmcgPSBvTWFpbk1vZGVsLmJpbmRMaXN0KFwiL1wiICsga3BpRGVmaW5pdGlvbi5lbnRpdHlTZXQpO1xuXHRcdGNvbnN0IG9Hcm91cDogUmVjb3JkPHN0cmluZywgT2JqZWN0PiA9IHt9O1xuXHRcdGNvbnN0IG9BZ2dyZWdhdGU6IFJlY29yZDxzdHJpbmcsIE9iamVjdD4gPSB7fTtcblxuXHRcdGtwaURlZmluaXRpb24uY2hhcnQuZGltZW5zaW9ucy5mb3JFYWNoKGRpbWVuc2lvbiA9PiB7XG5cdFx0XHRvR3JvdXBbZGltZW5zaW9uLm5hbWVdID0ge307XG5cdFx0fSk7XG5cdFx0a3BpRGVmaW5pdGlvbi5jaGFydC5tZWFzdXJlcy5mb3JFYWNoKG1lYXN1cmUgPT4ge1xuXHRcdFx0b0FnZ3JlZ2F0ZVttZWFzdXJlLm5hbWVdID0ge307XG5cdFx0fSk7XG5cdFx0b0xpc3RCaW5kaW5nLnNldEFnZ3JlZ2F0aW9uKHtcblx0XHRcdGdyb3VwOiBvR3JvdXAsXG5cdFx0XHRhZ2dyZWdhdGU6IG9BZ2dyZWdhdGVcblx0XHR9KTtcblxuXHRcdC8vIE1hbmFnZSBTZWxlY3Rpb25WYXJpYW50IGZpbHRlcnNcblx0XHRpZiAoa3BpRGVmaW5pdGlvbi5zZWxlY3Rpb25WYXJpYW50RmlsdGVyRGVmaW5pdGlvbnM/Lmxlbmd0aCkge1xuXHRcdFx0Y29uc3QgYUZpbHRlcnMgPSBrcGlEZWZpbml0aW9uLnNlbGVjdGlvblZhcmlhbnRGaWx0ZXJEZWZpbml0aW9ucy5tYXAoY3JlYXRlRmlsdGVyRnJvbURlZmluaXRpb24pLmZpbHRlcihmaWx0ZXIgPT4ge1xuXHRcdFx0XHRyZXR1cm4gZmlsdGVyICE9PSB1bmRlZmluZWQ7XG5cdFx0XHR9KSBhcyBGaWx0ZXJbXTtcblx0XHRcdG9MaXN0QmluZGluZy5maWx0ZXIoYUZpbHRlcnMpO1xuXHRcdH1cblxuXHRcdC8vIFNvcnRpbmdcblx0XHRpZiAoa3BpRGVmaW5pdGlvbi5jaGFydC5zb3J0T3JkZXIpIHtcblx0XHRcdG9MaXN0QmluZGluZy5zb3J0KFxuXHRcdFx0XHRrcGlEZWZpbml0aW9uLmNoYXJ0LnNvcnRPcmRlci5tYXAoc29ydEluZm8gPT4ge1xuXHRcdFx0XHRcdHJldHVybiBuZXcgU29ydGVyKHNvcnRJbmZvLm5hbWUsIHNvcnRJbmZvLmRlc2NlbmRpbmcpO1xuXHRcdFx0XHR9KVxuXHRcdFx0KTtcblx0XHR9XG5cblx0XHRyZXR1cm4gb0xpc3RCaW5kaW5nLnJlcXVlc3RDb250ZXh0cygwLCBrcGlEZWZpbml0aW9uLmNoYXJ0Lm1heEl0ZW1zKS50aGVuKChhQ29udGV4dHM6IENvbnRleHRbXSkgPT4ge1xuXHRcdFx0Y29uc3QgY2hhcnREYXRhID0gYUNvbnRleHRzLm1hcChmdW5jdGlvbihvQ29udGV4dCkge1xuXHRcdFx0XHRjb25zdCBvRGF0YTogUmVjb3JkPHN0cmluZywgYW55PiA9IHt9O1xuXHRcdFx0XHRrcGlEZWZpbml0aW9uLmNoYXJ0LmRpbWVuc2lvbnMuZm9yRWFjaChkaW1lbnNpb24gPT4ge1xuXHRcdFx0XHRcdG9EYXRhW2RpbWVuc2lvbi5uYW1lXSA9IG9Db250ZXh0LmdldFByb3BlcnR5KGRpbWVuc2lvbi5uYW1lKTtcblx0XHRcdFx0fSk7XG5cdFx0XHRcdGtwaURlZmluaXRpb24uY2hhcnQubWVhc3VyZXMuZm9yRWFjaChtZWFzdXJlID0+IHtcblx0XHRcdFx0XHRvRGF0YVttZWFzdXJlLm5hbWVdID0gb0NvbnRleHQuZ2V0UHJvcGVydHkobWVhc3VyZS5uYW1lKTtcblx0XHRcdFx0fSk7XG5cblx0XHRcdFx0cmV0dXJuIG9EYXRhO1xuXHRcdFx0fSk7XG5cblx0XHRcdG9LUElNb2RlbC5zZXRQcm9wZXJ0eShcIi9cIiArIGtwaURlZmluaXRpb24uaWQgKyBcIi9tYW5pZmVzdC9zYXAuY2FyZC9kYXRhL2pzb24vY2hhcnREYXRhXCIsIGNoYXJ0RGF0YSk7XG5cdFx0fSk7XG5cdH1cblxuXHQvKipcblx0ICogR2V0cyB0aGUgcG9wb3ZlciB0byBkaXNwbGF5IHRoZSBLUEkgY2FyZFxuXHQgKiBUaGUgcG9wb3ZlciBhbmQgdGhlIGNvbnRhaW5lZCBjYXJkIGZvciB0aGUgS1BJcyBhcmUgY3JlYXRlZCBpZiBuZWNlc3NhcnkuXG5cdCAqIFRoZSBwb3BvdmVyIGlzIHNoYXJlZCBiZXR3ZWVuIGFsbCBLUElzLCBzbyB3ZSBjcmVhdGUgaXQgb25seSBvbmNlLlxuXHQgKlxuXHQgKiBAcGFyYW0gb0tQSVRhZyBUaGUgVGFnIHRoYXQgdHJpZ2dlcmVkIHRoZSBwb3BvdmVyIG9wZW5pbmcuXG5cdCAqIEByZXR1cm5zIFRoZSBzaGFyZWQgcG9wb3Zlci5cblx0ICovXG5cdHByb3RlY3RlZCBnZXRQb3BvdmVyKG9LUElUYWc6IEdlbmVyaWNUYWcpOiBQb3BvdmVyIHtcblx0XHRpZiAoIXRoaXMub1BvcG92ZXIpIHtcblx0XHRcdHRoaXMub0NhcmQgPSBuZXcgQ2FyZCh7XG5cdFx0XHRcdHdpZHRoOiBcIjI1cmVtXCIsXG5cdFx0XHRcdGhlaWdodDogXCJhdXRvXCJcblx0XHRcdH0pO1xuXG5cdFx0XHR0aGlzLm9Qb3BvdmVyID0gbmV3IFBvcG92ZXIoe1xuXHRcdFx0XHRpZDogXCJrcGktUG9wb3ZlclwiLFxuXHRcdFx0XHRzaG93SGVhZGVyOiBmYWxzZSxcblx0XHRcdFx0cGxhY2VtZW50OiBcIkF1dG9cIixcblx0XHRcdFx0Y29udGVudDogW3RoaXMub0NhcmRdXG5cdFx0XHR9KTtcblxuXHRcdFx0b0tQSVRhZy5hZGREZXBlbmRlbnQodGhpcy5vUG9wb3Zlcik7IC8vIFRoZSBmaXJzdCBjbGlja2VkIHRhZyBnZXRzIHRoZSBwb3BvdmVyIGFzIGRlcGVuZGVudFxuXHRcdH1cblxuXHRcdHJldHVybiB0aGlzLm9Qb3BvdmVyO1xuXHR9XG5cblx0QFB1YmxpY1xuXHRwdWJsaWMgb25LUElQcmVzc2VkKG9LUElUYWc6IGFueSwga3BpSUQ6IHN0cmluZyk6IHZvaWQge1xuXHRcdGNvbnN0IG9LUElNb2RlbCA9IG9LUElUYWcuZ2V0TW9kZWwoXCJrcGlNb2RlbFwiKSBhcyBKU09OTW9kZWw8YW55PjtcblxuXHRcdGlmICh0aGlzLmFLUElEZWZpbml0aW9ucyAmJiB0aGlzLmFLUElEZWZpbml0aW9ucy5sZW5ndGgpIHtcblx0XHRcdGNvbnN0IGtwaURlZmluaXRpb24gPSB0aGlzLmFLUElEZWZpbml0aW9ucy5maW5kKGZ1bmN0aW9uKG9EZWYpIHtcblx0XHRcdFx0cmV0dXJuIG9EZWYuaWQgPT09IGtwaUlEO1xuXHRcdFx0fSk7XG5cblx0XHRcdGlmIChrcGlEZWZpbml0aW9uKSB7XG5cdFx0XHRcdGNvbnN0IG9Nb2RlbCA9IG9LUElUYWcuZ2V0TW9kZWwoKTtcblx0XHRcdFx0Y29uc3QgYVByb21pc2VzID0gW1xuXHRcdFx0XHRcdHRoaXMubG9hZEtQSVRhZ0RhdGEoa3BpRGVmaW5pdGlvbiwgb01vZGVsLCBvS1BJTW9kZWwsIHRydWUpLFxuXHRcdFx0XHRcdHRoaXMubG9hZEtQSUNhcmREYXRhKGtwaURlZmluaXRpb24sIG9Nb2RlbCwgb0tQSU1vZGVsKVxuXHRcdFx0XHRdO1xuXHRcdFx0XHRjb25zdCBvUG9wb3ZlciA9IHRoaXMuZ2V0UG9wb3ZlcihvS1BJVGFnKTtcblxuXHRcdFx0XHRQcm9taXNlLmFsbChhUHJvbWlzZXMpXG5cdFx0XHRcdFx0LnRoZW4oKCkgPT4ge1xuXHRcdFx0XHRcdFx0dGhpcy5vQ2FyZC5zZXRNYW5pZmVzdChvS1BJTW9kZWwuZ2V0UHJvcGVydHkoXCIvXCIgKyBrcGlJRCArIFwiL21hbmlmZXN0XCIpKTtcblx0XHRcdFx0XHRcdHRoaXMub0NhcmQucmVmcmVzaCgpO1xuXHRcdFx0XHRcdFx0b1BvcG92ZXIub3BlbkJ5KG9LUElUYWcsIGZhbHNlKTtcblx0XHRcdFx0XHR9KVxuXHRcdFx0XHRcdC5jYXRjaChlcnIgPT4ge1xuXHRcdFx0XHRcdFx0TG9nLmVycm9yKGVycik7XG5cdFx0XHRcdFx0fSk7XG5cdFx0XHR9XG5cdFx0fVxuXHR9XG59XG5cbmV4cG9ydCBkZWZhdWx0IEtQSU1hbmFnZW1lbnRDb250cm9sbGVyRXh0ZW5zaW9uO1xuIl19