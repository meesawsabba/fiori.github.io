/*!
 * SAPUI5
  (c) Copyright 2009-2021 SAP SE. All rights reserved
 */
/*global sap, Promise */
sap.ui.define(
  "sap/zen/dsh/olap/DataProvider",
  [
    "sap/base/Log",
    "sap/zen/commons/Format",
    "sap/zen/dsh/Axis",
    "sap/zen/commons/CellType",
    "sap/zen/dsh/DimensionType",
    "sap/zen/dsh/DisplayType",
    "sap/zen/dsh/ComparisonOperator",
    "sap/zen/dsh/utils/Utilities",
    "sap/zen/dsh/utils/SyncActionHelper",
    "sap/zen/dsh/utils/ListHelper",
    "sap/zen/dsh/utils/TokenHelper",
    "sap/zen/dsh/utils/ResultSetHelper",
    "sap/zen/dsh/utils/ResourceBundle",
    "sap/zen/commons/SpreadSheet/CellInfo",
    "sap/zen/commons/SpreadSheet/CXpStyle",
    "sap/zen/commons/thirdparty/lodash"
  ], /*eslint-disable max-params*/
  function (
    Log, Format, Axis, CellType, DimensionType, DisplayType,
    ComparisonOperator, Utilities, SyncActionHelper, ListHelper, TokenHelper,
    ResultSetHelper, ResourceBundle, CellInfo, CXpStyle, _
  ) {
    "use strict";
    /*eslint-disable max-statements*/
    /**
     * Constructor for a new DataProvider.
     *
     * A DataProvider represents a navigatable queryManager and allows to access and change
     * data from servers providing the <a href="https://wiki.scn.sap.com/wiki/display/BI/OT-BICS-INA" target="_blank">InA Protocol</a>.
     *
     * @class
     * A <code>DataProvider</code> is referencing a CDS view that is
     * annotated as an <a href="https://help.sap.com/viewer/cc0c305d2fab47bd808adcad3ca7ee9d/LATEST/en-US/c2dd92fb83784c4a87e16e66abeeacbd.html" target="_blank">AnalyitcQuery</a>.
     *
     * Instances of this class should only be created by the {sap.zen.dsh.olap.OlapModel}.
     * The <code>OlapModel</code> populates it's exposed data via Binding to Controls. The structure of
     * data exposed by a <ode>DataProvider</code> is as follows:
     *
     *  <b>Structure of Exposed Data</b>
     *
     * <ul>
     * <li><code>Grid/Cells</code>: The list of all <code>Cell</code> representing the data retrieved via <code>DataProvider</code></li>
     * <li><code>FreeDimensions</code>: The list of all Dimensions lying in the Free Axis
     * <ul>
     * <li><code>Name</code>: the external name of the dimension
     * <li> <code>Description</code>: the language dependant description of the dimension
     * <li> <code>IsStructure</code>: boolean flag indicating whether the dimension is a structure
     * </ul>
     * </li>
     * <li>RowsDimensions: The list of all Dimensions lying on the Rows Axis
     * <ul>
     * <li> Name: the external name of the dimension
     * <li> Description: the language dependant description of the dimension
     * <li> IsStructure: boolean flag indicating whether the dimension is a structure
     * </ul>
     * </li>
     *  * <li>ColumnsDimensions: The list of all Dimensions lying on the Columns Axis
     * <ul>
     * <li> Name: the external name of the dimension
     * <li> Description: the language dependant description of the dimension
     * <li> IsStructure: boolean flag indicating whether the dimension is a structure
     * </ul>
     * </li>
     * <li>Conditions: list of conditions (result set filters)</li>
     * <li>Exceptions: list of exceptions (conditional formats)</li>
     * <li>StructureMembers: list of structure members (collection of Members of all Structure Dimension)</li>
     * </ul>
     * @param  {sap.zen.dsh.olap.OlapModel} oOlapModel the model to which the DataProvider belongs
     * @param {string} sDataProviderName name of the DataProvider
     * @param {function} fVariableUpdater Update function for the variable collection of the <code>OlapModel</code>
     * @param {function} fUndoUpdater update function for update state
     * @param {object} oApplication the firefly application associated to the <code>OlapModel</code>
     * @param {object} oQueryManager the firefly queryManager that is wrapped by the <code>DataProvider</code>
     * @author SAP SE
     * @version 1.96.0
     * @public
     * @alias sap.zen.dsh.olap.DataProvider
     */
    var DataProvider = function (oOlapModel, fVariableUpdater, fUndoUpdater, oApplication, oQueryManager, sDataProviderName) {
      var that = this;
      var oQueryModel = null;
      var oResultSet;
      var oDialogs = Utilities.getDialogs();
      var bInputEnabled = true;
      
      function getOperatorFromComparisonOperator(o) {
        switch (o) {
        case sap.firefly.ComparisonOperator.EQUAL:
          return "EQ";
        case sap.firefly.ComparisonOperator.LESS_THAN:
          return "LT";
        case sap.firefly.ComparisonOperator.LESS_EQUAL:
          return "LE";
        case sap.firefly.ComparisonOperator.GREATER_THAN:
          return "GT";
        case sap.firefly.ComparisonOperator.GREATER_EQUAL:
          return "GE";
        case sap.firefly.ComparisonOperator.BETWEEN:
          return "BT";
        case sap.firefly.ComparisonOperator.NOT_EQUAL:
          return "NE";
        default:
          throw new Error("Invalid Operator: " + o.getName());
        }
      }
      
      // function getComparisonOperatorFromString(s){
      //   switch(s){
      //   case "EQ": return sap.firefly.ComparisonOperator.EQUAL;
      //   case "LT": return sap.firefly.ComparisonOperator.LESS_THAN;
      //   case "LE": return sap.firefly.ComparisonOperator.LESS_EQUAL;
      //   case "GT": return sap.firefly.ComparisonOperator.GREATER_THAN;
      //   case "GE": return sap.firefly.ComparisonOperator.GREATER_EQUAL;
      //   case "BT": return sap.firefly.ComparisonOperator.BETWEEN;
      //   case "NE": return sap.firefly.ComparisonOperator.NOT_EQUAL;
      //   default: throw new Error("Invalid Operator: " + s);
      //   }
      // }
      var oVariableMapping = {};
      that.OffsetCol = 0;
      that.Messages = [];
      that.Name = sDataProviderName;
      that.OffsetRow = 0;
      that.SuppressRepetition = true;
      that.Chart = {
        chartType: "column",
        vizProperties: {
          categoryAxis: {
            axisLine: {
              size: 1,
              visible: true
            },
            title: {
              visible: true
            },
            axisTick: {
              visible: true
            },
            label: {
              alignment: "center",
              visible: true
            }
          },
          categoryAxis2: {
            axisLine: {
              size: 1,
              visible: true
            },
            title: {
              visible: true
            },
            axisTick: {
              visible: true
            },
            label: {
              alignment: "center",
              visible: true
            }
          },
          valueAxis2: {
            size: 1,
            visible: true
          },
          legend: {
            visible: true
          },
          title: {
            visible: true
          },
          axisTick: {
            visible: true
          },
          label: {
            alignment: "center",
            visible: true
          },
          valueAxis: {
            axisLine: {
              size: 1,
              visible: true
            },
            title: {
              visible: true
            },
            axisTick: {
              visible: true
            },
            label: {
              alignment: "Right",
              visible: true
            }
          }
        }
      };
      var sFormat = Format.ExcelStyle;
      oQueryManager.setRequestCellDocumentID(true);
      that.produceGraph = function () {
        that.Graph = {
          nodes: [
            {
              key: 0,
              title: "Iron Man",
              group: 1,
              status: "Error",
              icon: "sap-icon://key-user-settings",
              attributes: [
                {
                  label: "Release date",
                  value: "May 2, 2008"
                }, {
                  label: "Director",
                  value: "Jon Favreau"
                }
              ]
            }, {
              "key": 1,
              "title": "Iron Man 2",
              "group": 1,
              "status": "Error",
              "icon": "sap-icon://key-user-settings",
              "attributes": [
                {
                  "label": "Release date",
                  "value": "May 7, 2010"
                }, {
                  "label": "Director",
                  "value": "Jon Favreau"
                }
              ]
            }, {
              "key": 2,
              "title": "The Incredible Hulk",
              "group": 1,
              "icon": "sap-icon://theater",
              "attributes": [
                {
                  "label": "Release date",
                  "value": "June 13, 2008"
                }, {
                  "label": "Director",
                  "value": "Louis Leterrier"
                }
              ]
            }, {
              "key": 3,
              "title": "Thor",
              "group": 1,
              "status": "Warning",
              "icon": "sap-icon://wrench",
              "attributes": [
                {
                  "label": "Release date",
                  "value": "May 6, 2011"
                }, {
                  "label": "Director",
                  "value": "Kenneth Branagh"
                }
              ]
            }, {
              "key": 4,
              "title": "Captain America: The First Avenger",
              "group": 1,
              "status": "Success",
              "icon": "sap-icon://unfavorite",
              "attributes": [
                {
                  "label": "Release date",
                  "value": "July 22, 2011"
                }, {
                  "label": "Director",
                  "value": "Joe Johnston"
                }
              ]
            }, {
              "key": 5,
              "title": "Marvel's The Avengers",
              "group": 1,
              "status": "Error",
              "icon": "sap-icon://text-color",
              "attributes": [
                {
                  "label": "Release date",
                  "value": "May 4, 2012"
                }, {
                  "label": "Director",
                  "value": "Joss Whedon"
                }
              ]
            }, {
              "key": 6,
              "title": "Iron Man 3",
              "group": 2,
              "status": "Error",
              "icon": "sap-icon://key-user-settings",
              "attributes": [
                {
                  "label": "Release date",
                  "value": "May 3, 2013"
                }, {
                  "label": "Director",
                  "value": "Shane Black"
                }
              ]
            }, {
              "key": 7,
              "title": "Thor: The Dark World",
              "group": 2,
              "status": "Warning",
              "icon": "sap-icon://wrench",
              "attributes": [
                {
                  "label": "Release date",
                  "value": "November 8, 2013"
                }, {
                  "label": "Director",
                  "value": "Alan Taylor"
                }
              ]
            }, {
              "key": 8,
              "title": "Captain America: The Winter Soldier",
              "group": 2,
              "status": "Success",
              "icon": "sap-icon://unfavorite",
              "attributes": [
                {
                  "label": "Release date",
                  "value": "April 4, 2014"
                }, {
                  "label": "Director",
                  "value": "Anthony & Joe Russo"
                }
              ]
            }, {
              "key": 9,
              "title": "Doctor Strange",
              "group": 3,
              "icon": "sap-icon://activate",
              "attributes": [
                {
                  "label": "Release date",
                  "value": "November 4, 2016"
                }, {
                  "label": "Director",
                  "value": "Scott Derrickson"
                }
              ]
            }, {
              "key": 10,
              "title": "Avengers: Age of Ultron",
              "group": 2,
              "status": "Error",
              "icon": "sap-icon://text-color",
              "attributes": [
                {
                  "label": "Release date",
                  "value": "May 1, 2015"
                }, {
                  "label": "Director",
                  "value": "Joss Whedon"
                }
              ]
            }, {
              "key": 11,
              "title": "Ant-Man and the Wasp",
              "group": 3,
              "icon": "sap-icon://chain-link",
              "attributes": [
                {
                  "label": "Release date",
                  "value": "July 6, 2018"
                }, {
                  "label": "Director",
                  "value": "Peyton Reed"
                }
              ]
            }, {
              "key": 12,
              "title": "Thor: Ragnarok",
              "group": 3,
              "status": "Warning",
              "icon": "sap-icon://wrench",
              "attributes": [
                {
                  "label": "Release date",
                  "value": "November 3, 2017"
                }, {
                  "label": "Director",
                  "value": "Taika Waititi"
                }
              ]
            }, {
              "key": 13,
              "title": "Ant-Man",
              "group": 2,
              "icon": "sap-icon://chain-link",
              "attributes": [
                {
                  "label": "Release date",
                  "value": "July 17, 2015"
                }, {
                  "label": "Director",
                  "value": "Peyton Reed"
                }
              ]
            }, {
              "key": 14,
              "title": "Captain America: Civil War",
              "group": 3,
              "status": "Success",
              "icon": "sap-icon://unfavorite",
              "attributes": [
                {
                  "label": "Release date",
                  "value": "May 6, 2016"
                }, {
                  "label": "Director",
                  "value": "Anthony & Joe Russo"
                }
              ]
            }, {
              "key": 15,
              "title": "Guardians of the Galaxy",
              "group": 2,
              "icon": "sap-icon://shield",
              "attributes": [
                {
                  "label": "Release date",
                  "value": "August 1, 2014"
                }, {
                  "label": "Director",
                  "value": "James Gunn"
                }
              ]
            }, {
              "key": 16,
              "title": "Spider-Man: Homecoming",
              "group": 3,
              "icon": "sap-icon://tree",
              "attributes": [
                {
                  "label": "Release date",
                  "value": "July 7, 2017"
                }, {
                  "label": "Director",
                  "value": "Jon Watts"
                }
              ]
            }, {
              "key": 17,
              "title": "Black Panther",
              "group": 3,
              "icon": "sap-icon://circle-task-2",
              "attributes": [
                {
                  "label": "Release date",
                  "value": "February 16, 2018"
                }, {
                  "label": "Director",
                  "value": "Ryan Coogler"
                }
              ]
            }, {
              "key": 18,
              "title": "Guardians of the Galaxy Vol. 2",
              "icon": "sap-icon://shield",
              "group": 3,
              "attributes": [
                {
                  "label": "Release date",
                  "value": "May 5, 2017"
                }, {
                  "label": "Director",
                  "value": "James Gunn"
                }
              ]
            }, {
              "key": 19,
              "title": "'Avengers 4'",
              "group": 3,
              "status": "Error",
              "icon": "sap-icon://text-color",
              "attributes": [
                {
                  "label": "Release date",
                  "value": "May 3, 2019"
                }, {
                  "label": "Director",
                  "value": "Anthony & Joe Russo"
                }
              ]
            }, {
              "key": 20,
              "title": "Avengers: Infinity War",
              "group": 3,
              "status": "Error",
              "icon": "sap-icon://text-color",
              "attributes": [
                {
                  "label": "Release date",
                  "value": "April 27, 2018"
                }, {
                  "label": "Director",
                  "value": "Anthony & Joe Russo"
                }
              ]
            }
          ],
          lines: [
            {"from": 0, "to": 1},
            {"from": 1, "to": 5},
            {"from": 2, "to": 5},
            {"from": 3, "to": 5},
            {"from": 4, "to": 5},
            {"from": 5, "to": 6},
            {"from": 5, "to": 7},
            {"from": 5, "to": 8},
            {"from": 6, "to": 10},
            {"from": 7, "to": 10},
            {"from": 8, "to": 10},
            {"from": 9, "to": 12},
            {"from": 10, "to": 12},
            {"from": 10, "to": 13},
            {"from": 13, "to": 11},
            {"from": 10, "to": 14},
            {"from": 13, "to": 14},
            {"from": 14, "to": 16},
            {"from": 14, "to": 17},
            {"from": 12, "to": 20},
            {"from": 16, "to": 20},
            {"from": 17, "to": 20},
            {"from": 15, "to": 18},
            {"from": 18, "to": 20},
            {"from": 5, "to": 19},
            {"from": 10, "to": 19},
            {"from": 20, "to": 19}
          ]
        };
        oOlapModel.checkUpdate();
      };
      that.setFormat = function (s) {
        sFormat = s;
        if (that.Grid) {
          that.Grid.format = sFormat;
        }
        oOlapModel.checkUpdate();
      };
      that.setOffsetCol = function (n) {
        that.virtualOffsetCol = n;
        return that;
      };
      that.setOffsetRow = function (n) {
        that.virtualOffsetRow = n;
        return that;
      };
      var oCT;
      that.getStructureMembers = function (sDim) {
        var oDim = oQueryManager.getQueryModel().getDimensionByName(that.Dimensions[sDim].TechName);
        var oKeyField = oDim.getDisplayKeyField();
        var oDynFilter = _.reduce(
          that.getFilterOfDim(sDim),
          function (oCurr, oMember) {
            oCurr[oMember.Low] = true;
            return oCurr;
          }, {});
        return _.map(
          ListHelper.arrayFromList(oDim.getAllStructureMembers()),
          function (oMem) {
            return {
              Name: oMem.getFieldValue(oKeyField) ? oMem.getFieldValue(oKeyField).getValue().getString() : oMem.getName(),
              TechName: oMem.getName(),
              Description: oMem.getText(),
              isInFilter: !!oDynFilter[oMem.getName()]
            };
          }
        );
      };
      
      function updateMetaData(oFlatResult) {
        oCT = oQueryManager.getQueryModel().getCurrencyTranslationManager() && oQueryManager.getQueryModel().getCurrencyTranslationManager().getCurrencyTranslationDetails();
        that.AllowsNewLines = false;
        that.Functions = [];
        that.HasVariables = false;
        that.CurrencyTranslation = oCT && {
          Name: oCT.getCurrencyTranslationName(),
          Target: oCT.getCurrencyTranslationTarget()
        };
        if (that.Grid) {
          that.Grid.inputEnabled = _.some(
            that.Grid.Cells,
            function (o) {
              return o.Input;
            }
          );
          that.Grid.input = that.Grid.inputEnabled && bInputEnabled;
          that.Grid.DataChanged = oOlapModel.getPlanningService() ? oOlapModel.getPlanningService().getPlanningContext().hasChangedData() : false;
          if (sap.ushell && sap.ushell.Container && oOlapModel.getPlanningService()) {
            sap.ushell.Container.setDirtyFlag(oOlapModel.getPlanningService().getPlanningContext().hasChangedData());
          }
        }
        fUndoUpdater(oApplication.getUndoManager().getAvailableUndoStepCount() > 0);
        that.QueryTitle = oQueryManager.getQueryModel().getText() || oQueryManager.getQueryModel().getDataSource().getName();
        that.QueryName = oQueryManager.getQueryModel().getDataSource().getName();
        that.QueryType = oQueryManager.getQueryModel().getDataSource().getType().getName();
        that.SystemName = oQueryManager.getSystemDescription().getName();
        that.HasVariables = oQueryManager.getQueryModel().getVariableContainer().hasVariables();
        oVariableMapping = _.reduce(
          ListHelper.arrayFromIter(
            oQueryManager.getQueryModel().getVariables().getIterator()
          ),
          function (oC, o) {
            oC[o.getNameExternal() || o.getName()] = o.getName();
            return oC;
          }, oVariableMapping);
        if (oQueryManager.getQueryModel().getCubeInfo()) {
          that.CreatedBy = oQueryManager.getQueryModel().getCubeInfo().getCreatedBy();
          that.CreatedOn = (function () {
            var oD = oQueryManager.getQueryModel().getCubeInfo().getCreatedOn();
            return oD ? new Date(
              [
                oD.getYear(),
                oD.getMonthOfYear(),
                oD.getDayOfMonth()
              ].join("-")
            ) : new Date();
          }());
          that.CreatedOnText = that.QueryDueDateText = sap.ui.core.format.DateFormat.getDateInstance({
            style: "medium"
          }).format(
            that.CreatedOn
          );
          that.QueryDueDate = (function () {
            var oD = oQueryManager.getQueryModel().getCubeInfo().getDueDate();
            return oD ? new Date(
              [
                oD.getYear(),
                oD.getMonthOfYear(),
                oD.getDayOfMonth()
              ].join("-")
            ) : new Date();
          }());
          that.QueryDueDateText = sap.ui.core.format.DateFormat.getDateInstance({
            style: "medium"
          }).format(
            that.QueryDueDate
          );
          if (oQueryManager.getQueryModel().getResultAlignment()) {
            that.ResultAlignmentRows = oQueryManager.getQueryModel().getResultAlignment().getName();
            that.ResultAlignmentColumns = oQueryManager.getQueryModel().getResultAlignment().getName();
          }
          that.LastUpdated = (function () {
            var oD = oQueryManager.getQueryModel().getCubeInfo().getUpdatedOn();
            return oD ? new Date(
              [
                oD.getYear(),
                oD.getMonthOfYear(),
                oD.getDayOfMonth()
              ].join("-")
            ) : new Date();
          }());
          that.LastUpdatedBy = oQueryManager.getQueryModel().getCubeInfo().getUpdatedBy();
          that.LastUpdatedText = sap.ui.core.format.DateFormat.getDateInstance({
            style: "medium"
          }).format(
            that.LastUpdated
          );
        }
        that.HasCurrencyTranslation = (function () {
          var oMC = oQueryManager.getQueryModel().getModelCapabilities();
          return (oMC.supportsCurrencyTranslation() || oMC.supportsQueryCurrencyTranslation()) &&
            oCT && oQueryManager.getQueryModel().getCurrencyTranslationEnabledType() !== "NoCurrency";
        }());
        oQueryModel = oQueryManager.getQueryModel();
        var oSortingManager = oQueryModel.getSortingManager();
        
        function getSorting(o) {
          if (oSortingManager.supportsDimensionSorting(o, null)) {
            return o.getResultSetSorting().getDirection().getName();
          } else {
            return null;
          }
        }
        
        that.Dimensions = _.reduce(
          ListHelper.arrayFromList(
            oQueryModel.getDimensions()
          ),
          function (oC, o) {
            var oAxis = o.getAxis();
            if (o.getDimensionType().getName() === DimensionType.MeasureStructure) {
              o.getExternalName = _.constant("MeasureStructure");
            } else if (
              o.getDimensionType().getName() === DimensionType.SecondaryStructure
            ) {
              o.getExternalName = _.constant("NonMeasureStructure");
            }
            oC[o.getExternalName() || o.getName()] = {
              Name: o.getExternalName() || o.getName(),
              TechName: o.getName(),
              Description: o.getText(),
              Axis: oAxis.getName(),
              Type: o.getDimensionType().getName(),
              HierarchyActive: o.isHierarchyActive(),
              HasFilter: !!o.getFilter(),
              SortDirection: getSorting(o),
              Position: oAxis.getDimensionIndex(o.getName()),
              LastPosition: oAxis.getDimensionCount() - 1,
              IsStructure: o.getDimensionType().getName() === DimensionType.MeasureStructure || o.getDimensionType().getName() === DimensionType.SecondaryStructure,
              IsMeasureStructure: o.getDimensionType().getName() === DimensionType.MeasureStructure || o.getDimensionType().getName() === DimensionType.SecondaryStructure
            };
            if (o.getDimensionType().getName() === DimensionType.MeasureStructure || o.getDimensionType().getName() === DimensionType.SecondaryStructure) {
              var oKeyField = o.getDisplayKeyField();
              oC[o.getExternalName() || o.getName()].Members = _.map(
                ListHelper.arrayFromList(o.getAllStructureMembers()),
                function (oMem) {
                  return {
                    Name: oMem.getFieldValue(o.getDisplayKeyField()) ? oMem.getFieldValue(oKeyField).getValue().getString() : oMem.getName(),
                    TechName: oMem.getName(),
                    Description: oMem.getText()
                  };
                }
              );
            }
            return oC;
          }, {});
        that.FreeDimensions = _.sortBy(
          _.filter(that.Dimensions, {
            Axis: Axis.Free
          }), "Description");
        that.ColumnsDimensions = _.sortBy(
          _.filter(that.Dimensions, {
            Axis: Axis.Columns
          }), "Position");
        that.RowsDimensions = _.sortBy(
          _.filter(that.Dimensions, {
            Axis: Axis.Rows
          }), "Postion"
        );
        that.FlatDimensions = _.filter(
          _.concat(that.RowsDimensions, that.ColumnsDimensions),
          function (oD) {
            return !oD.IsMeasureStructure;
          });
        that.AllDimensions = _.sortBy(
          _.concat(
            that.RowsDimensions,
            that.ColumnsDimensions,
            that.FreeDimensions
          ), "Description"
        );
        if (!that.Chart.catDimension) {
          that.Chart.catDimension = that.FlatDimensions.length ? that.FlatDimensions[0].Name : null;
        }
        if (!that.Chart.cat2Dimension) {
          that.Chart.cat2Dimension = that.FlatDimensions.length > 1 ? that.FlatDimensions[1].Name : null;
        }
        var measureName = oQueryManager.getQueryModel().getMeasureDimension().getExternalName() || oQueryManager.getQueryModel().getMeasureDimension().getName();
        var oMD = oQueryManager.getQueryModel().getMeasureDimension() ? that.Dimensions[measureName] : null;
        if (!that.Chart.valDimension && oMD) {
          that.Chart.valDimension = oMD.Name;
        }
        if (!that.Chart.val2Dimension && oMD) {
          that.Chart.val2Dimension = oMD.Name;
        }
        that.Chart.vizProperties.title.text = that.QueryTitle || that.QueryName;
        var aM = oQueryManager.getQueryModel().getMeasureDimension() &&
          oMD.Members || [];
        if (oFlatResult) {
          that.FlatResultSet = oFlatResult.FlatResultSet;
          that.Chart.Measures = oFlatResult.Measures;
          that.Chart.Dimensions = oFlatResult.Dimensions;
        } else {
          that.Measures = aM;
        }
        that.Conditions = _.map(
          oQueryManager.getQueryModel().getConditionManager() ? ListHelper.arrayFromList(oQueryManager.getQueryModel().getConditionManager()) : [],
          function (o) {
            return {
              Name: o.getName(),
              Description: o.getText(),
              StatusText: ResourceBundle.getText(o.isActive() ? "ACTIVE" : "INACTIVE"),
              active: o.isActive()
            };
          });
        that.Exceptions = _.map(
          oQueryManager.getQueryModel().getExceptionManager() ?
            ListHelper.arrayFromList(oQueryManager.getQueryModel().getExceptionManager()) : [],
          function (o) {
            return {
              Name: o.getName(),
              Description: o.getText(),
              StatusText: ResourceBundle.getText(o.isActive() ? "ACTIVE" : "INACTIVE"),
              active: o.isActive()
            };
          });
        (function (oCH) {
          that.Chart.Feeds = oCH.Feeds;
          that.Chart.Messages = oCH.Messages;
        }(ResultSetHelper.calculateFeeds(
          that.Chart.chartType,
          that.Chart.Dimensions || [],
          that.Chart.Measures || [],
          that.Chart
        )));
      }
      
      updateMetaData();
      that.getInfoProviderName = function () {
        var oIP = oQueryManager.getQueryModel().getInfoProvider();
        return oIP ? oIP.getName() : "";
      };
      that.getInfoProviderText = function () {
        var oIP = oQueryManager.getQueryModel().getInfoProvider();
        return oIP ? oIP.getText() : "";
      };
      that.variablePrompt = function (sTitle) {
        var fResolve, fReject;
        
        function handleDialog(resolve, reject) {
          fResolve = resolve;
          fReject = reject;
        }
        
        sap.firefly.VdDragonflyEntryPoint.createEntryPoint(
          sTitle || that.QueryTitle, oQueryManager.getOlapEnv().getVariableProcessor(), {
            onRenderDone: _.constant(null),
            onBeforeSubmit: _.constant(null),
            onOk: function () {
              var aQMgr = ListHelper.arrayFromList(oQueryManager.getOlapEnv().getAllAreaQueryManager());
              Promise.all(
                _.map(aQMgr, function (o) {
                  return SyncActionHelper.syncActionToPromise(
                    o.processQueryExecution, o, []
                  );
                })
              ).then(function () {
                fResolve(null);
              }).catch(function (oError) {
                fReject(oError);
              });
            },
            onCancel: function () {
              fResolve(null);
            }
          }).open();
        return new Promise(handleDialog);
      };
      that.setInputEnabled = function (b) {
        oQueryManager.getPlanningManager().setDataEntryEnabled(b);
        bInputEnabled = b;
        return that;
      };
      (function () {
        var sSuppressUnit = null;
        that.suppressUnit =
          function (sUnit) {
            sSuppressUnit = sUnit;
          };
        that.getSuppressedUnit = function () {
          return sSuppressUnit;
        };
      }());
      that.openAxisDialog = function () {
        var oFdEP = sap.firefly.AldEntryPoint.createEntryPoint(oApplication);
        var fResolve;
        
        function handleDialog(resolve) {
          fResolve = resolve;
        }
        
        oFdEP.openAldDialog(
          ResourceBundle.getText("QUERY_SETTINGS",[that.QueryTitle]), oQueryModel, {
            onSubmit: function () {
              fResolve(true);
              fResolve = null;
            },
            onClose: function () {
              if (fResolve) {
                fResolve(false);
              }
            }
          });
        return new Promise(handleDialog);
      };
      that.openCellDialog = function (sDim1, sMember1, sDim2, sMember2) {
        var o = that.Dimensions[sDim1];
        if (!o || !o.IsStructure) {
          throw new Error("Dimension is not a structure:" + sDim1);
        }
        var oField1 = oQueryManager.getQueryModel().getDimensionByName(o.TechName).getDisplayKeyField();
        var oM1 = _.find(ListHelper.arrayFromList(oQueryManager.getQueryModel().getDimensionByName(that.Dimensions[sDim1].TechName).getAllStructureMembers()), function (o) {
          var oVal = o.getFieldValue(oField1);
          var s = oVal ? oVal.getString() : o.getName();
          return s === sMember1;
        });
        if (!oM1) {
          throw new Error("Member " + sMember1 + " not found in structure: " + sDim1);
        }
        var oM2;
        if (sDim2) {
          var oD2 = that.Dimensions[sDim2];
          if (!oD2 || !oD2.IsStructure) {
            throw new Error("Dimension is not a structure:" + sDim2);
          }
          var oField2 = oQueryManager.getQueryModel().getDimensionByName(that.Dimensions[sDim2].TechName).getDisplayKeyField();
          oM2 = _.find(ListHelper.arrayFromList(oQueryManager.getQueryModel().getDimensionByName(that.Dimensions[sDim2].TechName).getAllStructureMembers()), function (o) {
            var oVal = o.getFieldValue(oField2);
            var s = oVal ? oVal.getString() : o.getName();
            return s === sMember2;
          });
          if (!oM2) {
            throw new Error("Member " + sMember2 + " not found in structure: " + sDim2);
          }
        }
        var fResolve;
        
        function handleDialog(resolve) {
          fResolve = resolve;
        }
        
        var oProm = new Promise(handleDialog);
        var oCD = sap.firefly.DataCellDialogDragonflyEntryPoint.createEntryPoint(oQueryManager);
        oCD.setI18nProvider( ResourceBundle, null );
        oCD.openDataCellPropertiesDialog(
          {
            onDataCellOk: function () {
              var fLocalResolve = fResolve;
              fResolve = null;
              return fLocalResolve(true);
            },
            onDataCellClose: function () {
              if (fResolve) {
                fResolve(false);
              }
              oCD.close();
            }
          },
          oQueryManager,
          oM1.getName(),
          oM2 ? oM2.getName() : null
        );
        return oProm;
      };
      that.openDimDialog = function (sDim) {
        var oEntryPoint = sap.firefly.DdEntryPoint.createEntryPoint(oApplication);
        var oDim = oQueryManager.getQueryModel().getDimensionByName(
          that.Dimensions[sDim].TechName
        );
        var fResolve;
        oEntryPoint.setI18nProvider(
          {
            getText: function (sID) {
              return ResourceBundle.getText(sID.substr(5)); //Remove prefix I18N_
            },
            getTextWithPlaceholder: function (sID, sPlaceHolder) {
              return ResourceBundle.getText(sID.substr(5), sPlaceHolder); //Remove prefix I18N_
            }
          },
          null
        );
        
        function handleDialog(resolve) {
          fResolve = resolve;
        }
        
        oEntryPoint.openDimensionDialog(
          ResourceBundle.getText("DD_DIMENSION_SETTINGS",[oDim.getText()]), oDim, {
            onSubmit: function () {
              fResolve(true);
            },
            onClose: function () {
              fResolve(false);
            }
          });
        return new Promise(handleDialog);
      };
      that.setResultVisibility = function (sDim, sResultVisibility) {
        oQueryModel.getDimensionByName(that.Dimensions[sDim].TechName).setResultVisibility(sap.firefly.ResultVisibility[sResultVisibility]);
        return that.getResultSet();
      };
      that.setDimensionDisplay = function (sDim, sDisplayType) {
        var oQueryModel = oQueryManager.getQueryModel();
        var oDim = oQueryModel.getDimensionByName(that.Dimensions[sDim].TechName);
        var oKeyField = oDim.getDisplayKeyField() || oDim.getKeyField();
        var oTextField = oDim.getTextField();
        var oRF = oDim.getResultSetFields();
        var aField =
          _.filter(
            ListHelper.arrayFromList(oRF).map(function (o) {
              return o;
            }),
            function (oField) {
              return oField !== oDim.getKeyField() && oField !== oDim.getTextField() && oField !== oDim.getDisplayKeyField();
            }
          );
        oRF.clear();
        switch (sDisplayType) {
        case DisplayType.Key:
          oRF.add(oKeyField);
          break;
        case DisplayType.Text:
          oRF.add(oTextField);
          break;
        case DisplayType.KeyText:
          oRF.add(oKeyField);
          oRF.add(oTextField);
          break;
        case DisplayType.TextKey:
          oRF.add(oTextField);
          oRF.add(oKeyField);
          break;
        }
        _.forEach(aField, function (oField) {
          oRF.add(oField);
        });
        return that.getResultSet();
      };
      that.isVariableInputEnabled = function (sVar) {
        var sName = oVariableMapping[sVar];
        if (!sName) {
          return false;
        }
        var oVariable = oQueryManager.getQueryModel().getVariable(sName);
        return !!oVariable && oVariable.isInputEnabled && oVariable.isInputEnabled();
      };
      that.hasVariableValueHelp = function (sVar) {
        var oVariable = oQueryManager.getQueryModel().getVariable(sVar);
        return !!oVariable && oVariable.supportsValueHelp && oVariable.supportsValueHelp();
      };
      
      function addSupplement(valueBag, field, value) {
        if (field != null && value != null) {
          valueBag.addSupplementValue(field.getName(), value);
        }
      }
      
      function updateMemberFilter(oDim, filter, oSel) {
        var keyField = oDim.getKeyField();
        var displayKeyField = oDim.getDisplayKeyField() !== keyField ? oDim.getDisplayKeyField() : null;
        var textField = oDim.getTextField();
        filter.addSupplementField(displayKeyField);
        filter.addSupplementField(textField);
        for (var i = 0; i < oSel.size(); i++) {
          var selectedItem = oSel.get(i);
          var filterElement = filter.addNewCartesianElement();
          filterElement.setComparisonOperator(sap.firefly.ComparisonOperator.EQUAL);
          filterElement.setField(keyField);
          var low = filterElement.getLow();
          low.setValue(sap.firefly.XValueUtil.getValueFromString(selectedItem.getKey(), keyField.getValueType()));
          addSupplement(low, displayKeyField, selectedItem.getDisplayKey());
          addSupplement(low, textField, selectedItem.getText());
        }
      }
      
      that.applySelectionToVariable = function (sVar, aSelectedFdItems) {
        var variable = oQueryManager.getQueryModel().getVariable(oOlapModel.getProperty("/variables/" + sVar + "/TechName"));
        if (!variable || !variable.isInputEnabled()) {
          return;
        }
        
        if (variable.getVariableType() === sap.firefly.VariableType.DIMENSION_MEMBER_VARIABLE) {
          var oDim = variable.getDimension();
          var oMemberFilter = variable.getMemberFilter();
          oMemberFilter.clear();
          updateMemberFilter(oDim, oMemberFilter, aSelectedFdItems);
        } else {
          if (!aSelectedFdItems.isEmpty()) {
            variable.setValueByStringExt(aSelectedFdItems.get(0).getKey(), true);
          }
        }
        fVariableUpdater(oQueryManager);
      };
      
      that.openVariableSelector = function (sVar) {
        if (!oOlapModel.getProperty("/variables/" + sVar).SupportsValueHelp) {
          throw new Error("No Value help for variable " + sVar);
        }
        if (oQueryManager.isReinitNeeded()) {
          oQueryManager.reInitVariablesAfterSubmit(sap.firefly.SyncType.BLOCKING, null, null);
        }
        var variable = oQueryManager.getQueryModel().getVariable(oOlapModel.getProperty("/variables/" + sVar + "/TechName"));
        var oDim = variable.getDimension();
        var fdEntryPoint = sap.firefly.FdEntryPoint.createEntryPoint(oApplication, ResourceBundle.getText("SELECTOR", [oDim.getText()]));
        var fdConfig = fdEntryPoint.getConfiguration();
        fdConfig.setAlwaysShowSelectionContainer(true);
        fdConfig.setFunctionalValuesEnabled(true);
        fdConfig.setMultiSelection(variable.supportsMultipleValues());
        // var selectedItems = createSelection(variable.getMemberFilter());
        // fdConfig.setSelection(selectedItems);
        fdConfig.setDetermineSelectionFromContext(true);
        fdEntryPoint.getUiContext().getLocalization().setExternalLocalization( sap.firefly.OrcaI18nMapping.create(), ResourceBundle );
        var fResolve;
        
        function handleDialog(resolve) {
          fResolve = resolve;
        }
        
        fdEntryPoint.openWithVariable(variable, {
          onFilterDialogOk: function (oSel) {
            fResolve(oSel);
          },
          onFilterDialogCancel: function () {
            fResolve(null);
          }
        });
        
        var oDefer = new Promise(handleDialog);
        return oDefer.then(function (oSel) {
          if (!oSel) {
            return false;
          }
          return oSel;
        });
      };
      that.openCurrencyTranslationDialog = function () {
        var fResolve;
        
        function handleDialog(resolve) {
          fResolve = resolve;
        }
        
        var oEntryPoint = sap.firefly.CtEntryPoint.createEntryPoint(oApplication);
        oEntryPoint.setI18nProvider( ResourceBundle, null );
        oEntryPoint.openQCTDialog(
          ResourceBundle.getText("QCT_CURRENCY_TRANSLATION"),
          oQueryManager.getQueryModel().getCurrencyTranslationManager(),
          {
            onSubmit: function () {
              fResolve(true);
              fResolve = null;
            },
            onClose: function () {
              if (fResolve) {
                fResolve(false);
              }
            }
          }
        );
        return new Promise(handleDialog);
      };
      that.getFilterOfDim = function (sDim) {
        var oDim = oQueryManager.getQueryModel().getDimensionByName(that.Dimensions[sDim].TechName);
  
        function getFilterElementText(filterOperation) {
          var keyField = oDim.getKeyField();
          var displayKeyField = oDim.getDisplayKeyField() !== keyField ? oDim.getDisplayKeyField() : null;
          var textField = oDim.getTextField();
          var low = filterOperation.getLow();
          var filterElementValue= null;
          if(displayKeyField != null)
          {
            filterElementValue = low.getSupplementValueString(displayKeyField.getName());
          }
          if(!filterElementValue && textField){
            filterElementValue = low.getSupplementValueString(textField.getName());
          }
          return filterElementValue;
        }
  
        return _.map(
          ListHelper.arrayFromList(
            oQueryManager.getQueryModel().getFilter().getDynamicFilter().getCartesianListByField(oDim.getKeyField())),
          function (filterOperation) {
            return {
              ComparisonOperator: getOperatorFromComparisonOperator(filterOperation.getComparisonOperator()),
              Text: getFilterElementText(filterOperation),
              Low: filterOperation.getLow().getString(),
              High: filterOperation.getHigh().getString(),
              IsExcluding: filterOperation.getSetSign() === sap.firefly.SetSign.EXCLUDING
            };
          });
      };
      
      
      that.openSelector = function (sDimensionName) {
        var oDim = oQueryManager.getQueryModel().getDimensionByName(that.Dimensions[sDimensionName].TechName);
        if (!oQueryModel.getFilter().getDynamicFilter().isCartesianProduct()) {
          throw new Error("Filter to complex");
        }
        var fResolve;
        
        function handleDialog(resolve) {
          fResolve = resolve;
        }
        
        return Promise.resolve(null).then(
          function () {
            var fdEntryPoint = sap.firefly.FdEntryPoint.createEntryPoint(oApplication, ResourceBundle.getText("SELECTOR", [oDim.getText()]));
            var oFdConfig = fdEntryPoint.getConfiguration();
            oFdConfig.setFunctionalValuesEnabled(true);
            oFdConfig.setMultiSelection(true);
            //oFdConfig.setSelection(createSelection(oDim.getFilter()));
            oFdConfig.setDetermineSelectionFromContext(true);
            fdEntryPoint.getUiContext().getLocalization().setExternalLocalization( sap.firefly.OrcaI18nMapping.create(), ResourceBundle );
            fdEntryPoint.openWithDimension(oDim, {
              onFilterDialogOk: function (oSel) {
                fResolve(oSel);
              },
              onFilterDialogCancel: function () {
                fResolve(false);
              }
            });
            
            var oDefer = new Promise(handleDialog);
            return oDefer.then(
              function (oSel) {
                if (!oSel) {
                  return false;
                }
                var filter = oDim.getFilter();
                if (filter != null) {
                  filter.clear();
                } else {
                  var dynamicFilter = oDim.getQueryModel().getFilter().getDynamicFilter();
                  filter = dynamicFilter.getCartesianListWithDefault(oDim);
                }
                updateMemberFilter(oDim, filter, oSel);
                return true;
              }
            );
          }
        );
      };
      that.setAxesLayout = function (oLayout) {
        _.forEach(_.map(that.FlatDimensions, "Name"), function (sDim) {
          oQueryManager.getQueryModel().getAxis(sap.firefly.AxisType.FREE).add(
            oQueryManager.getQueryModel().getDimensionByName(
              that.Dimensions[sDim].TechName
            )
          );
        });
        _.forEach(oLayout.rows, function (sDim) {
          oQueryManager.getQueryModel().getAxis(sap.firefly.AxisType.ROWS).add(
            oQueryManager.getQueryModel().getDimensionByName(
              that.Dimensions[sDim].TechName
            )
          );
        });
        _.forEach(oLayout.columns, function (sDim) {
          oQueryManager.getQueryModel().getAxis(sap.firefly.AxisType.COLUMNS).add(
            oQueryManager.getQueryModel().getDimensionByName(
              that.Dimensions[sDim].TechName
            )
          );
        });
        return that;
      };
      that.removeDrilldown = function (sDim) {
        oQueryManager.getQueryModel().getAxis(sap.firefly.AxisType.FREE).add(
          oQueryManager.getQueryModel().getDimensionByName(
            that.Dimensions[sDim].TechName
          )
        );
        return that.getResultSet();
      };
      that.drilldown = function (sDim1, sDim2) {
        var oQM = oQueryManager.getQueryModel();
        if (sDim1) {
          var oDim = oQM.getDimensionByName(
            that.Dimensions[sDim1].TechName
          );
          var oAxis = oQM.getAxesManager().getRowsAxis().getDimensionCount() ? oDim.getAxis() : oQM.getAxesManager().getRowsAxis();
          var nPosit = !oAxis.getDimensionCount() ? 0 : oDim.getDimension().getAxis().getDimensionIndex(oDim.getName()) + 1;
          oAxis.insert(nPosit, oQM.getDimensionByName(
            that.Dimensions[sDim2].TechName
          ));
        } else {
          oQM.getAxesManager().getRowsAxis().insert(
            oQM.getAxesManager().getRowsAxis().getDimensionCount(), oQM.getDimensionByName(
              that.Dimensions[sDim2].TechName
            )
          );
        }
        return that.getResultSet();
      };
      that.moveUp = function (sDim) {
        var oQM = oQueryManager.getQueryModel();
        var oDim = oQM.getDimensionByName(that.Dimensions[sDim].TechName);
        var oAxis = oDim.getAxis();
        var nPosit = oAxis.getDimensionIndex(oDim.getName()) - 1;
        oAxis.insert(nPosit, oDim);
        return that;
      };
      that.moveDown = function (sDim) {
        var oQM = oQueryManager.getQueryModel();
        var oDim = oQM.getDimensionByName(that.Dimensions[sDim].TechName);
        var oAxis = oDim.getAxis();
        var nPosit = oAxis.getDimensionIndex(oDim.getName()) + 1;
        oAxis.insert(nPosit, oDim);
        return that;
      };
      that.setDisplayHierarchy = function (sDim, bActive, sName, sVersion) {
        var oQM = oQueryManager.getQueryModel();
        var oDim = oQM.getDimensionByName(that.Dimensions[sDim].TechName);
        if (sName) {
          oDim.setHierarchyName(sName);
          if (sVersion) {
            oDim.setHierarchyVersion(sVersion);
          }
        }
        oDim.setHierarchyActive(bActive);
        return that;
      };
      that.getScalingFactor = function (sMeasureMember, sNonMeasureMember) {
        var measureStructure = that.Dimensions.MeasureStructure;
        if (!measureStructure) {
          throw new Error("No measure Structure");
        }
        var oNonMeasureStructure = sNonMeasureMember ? that.Dimensions.NonMeasureStructure : null;
        var sMeasureDimName = measureStructure.TechName;
        var aMeasureMembers = ListHelper.arrayFromList(
          oQueryManager.getQueryModel().getDimensionByName(sMeasureDimName).getAllStructureMembers()
        );
        var oMeasureDimDisplayField = oQueryManager.getQueryModel().getDimensionByName(sMeasureDimName).getDisplayKeyField();
        var oMeasureMember = (function () {
          var oM = _.find(aMeasureMembers, function (o) {
            var oVal = o.getFieldValue(oMeasureDimDisplayField);
            var s = oVal ? oVal.getString() : o.getName();
            return s === sMeasureMember;
          });
          if (!oM) {
            throw new Error("Member " + sMeasureMember + " not found in structure: " + sMeasureDimName);
          }
          return oM;
        }());
        if (!oNonMeasureStructure) {
          return oMeasureMember.getNumericShift() ? -1 * oMeasureMember.getNumericShift().getInteger() : 0;
        }
        else {
          var sNonMeasureDimName = oNonMeasureStructure.TechName;
          var aNonMeasureMembers = ListHelper.arrayFromList(
            oQueryManager.getQueryModel().getDimensionByName(sNonMeasureDimName).getAllStructureMembers()
          );
          var oNonMeasureDimDisplayField = oQueryManager.getQueryModel().getDimensionByName(sNonMeasureDimName).getDisplayKeyField();
          var oNonMeasureMember = (function () {
            var oM = _.find(aNonMeasureMembers, function (o) {
              var oVal = o.getFieldValue(oNonMeasureDimDisplayField);
              var s = oVal ? oVal.getString() : o.getName();
              return s === sNonMeasureMember;
            });
            if (!oM) {
              throw new Error("Member " + sMeasureMember + " not found in structure: " + sMeasureDimName);
            }
            return oM;
          }());
          var aQC = ListHelper.arrayFromIter(oQueryManager.getQueryModel().getQueryDataCells().getIterator());
          var oQC = _.find(aQC, function (o) {
            return o.hasMemberReference(oMeasureMember) && o.hasMemberReference(oNonMeasureMember);
          });
          if (!oQC) {
            throw new Error("Invalid Query Cell");
          }
          return oQC.getScalingFactor();
        }
      };
     
      that.setScalingFactor = function (nFactor, sMeasureMember, sNonMeasureMember) {
        var oMeasureStructure = that.Dimensions.MeasureStructure;
        if (!oMeasureStructure) {
          throw new Error("No measure Structure");
        }
        var oNonMeasureStructure = sNonMeasureMember ? that.Dimensions.NonMeasureStructure : null;
        var sMeasureDimName = oMeasureStructure.TechName;
        var aStructureMembers = ListHelper.arrayFromList(
          oQueryManager.getQueryModel().getDimensionByName(sMeasureDimName).getAllStructureMembers()
        );
        var oField = oQueryManager.getQueryModel().getDimensionByName(sMeasureDimName).getDisplayKeyField();
        var oMeasureMember = (function () {
          var oM = _.find(aStructureMembers, function (o) {
            var oVal = o.getFieldValue(oField);
            var s = oVal ? oVal.getString() : o.getName();
            return s === sMeasureMember;
          });
          if (!oM) {
            throw new Error("Member " + sMeasureMember + " not found in structure: " + sMeasureDimName);
          }
          return oM;
        }());
        if (!oNonMeasureStructure) {
          oMeasureMember.setNumericShift(-1 * nFactor);
          return that;
        } else {
          var nonMeasureDimName = oNonMeasureStructure.TechName;
          var aNonMeasureStructureMembers = ListHelper.arrayFromList(
            oQueryManager.getQueryModel().getDimensionByName(nonMeasureDimName).getAllStructureMembers()
          );
          oField = oQueryManager.getQueryModel().getDimensionByName(nonMeasureDimName).getDisplayKeyField();
          var oM2 = (function () {
            var oM = _.find(aNonMeasureStructureMembers, function (o) {
              var oVal = o.getFieldValue(oField);
              var s = oVal ? oVal.getString() : o.getName();
              return s === sNonMeasureMember;
            });
            if (!oM) {
              throw new Error("Member " + sNonMeasureMember + " not found in structure: " + nonMeasureDimName);
            }
            return oM;
          }());
          var aQueryCells = ListHelper.arrayFromIter(oQueryManager.getQueryModel().getQueryDataCells().getIterator());
          aQueryCells = _.filter(aQueryCells, function (o) {
            return o.hasMemberReference(oMeasureMember) && o.hasMemberReference(oM2);
          });
          if (!aQueryCells || aQueryCells.length < 1) {
            throw new Error("Invalid Query Cell");
          }
          return _.forEach(aQueryCells, function (oQueryCell) {
            oQueryCell.setScalingFactor(nFactor);
          });
        }
      };
      that.setDecimalPlaces = function (nNumberOfDecimalPlaces, sMeasureMember, sNonMeasureMember) {
        var oMeasureStructure = that.Dimensions.MeasureStructure;
        if (!oMeasureStructure) {
          throw new Error("No measure Structure");
        }
        var oNonMeasureStructure = sNonMeasureMember ? that.Dimensions.NonMeasureStructure : null;
        var sMeasureDimName = oMeasureStructure.TechName;
        var aStructureMembers = ListHelper.arrayFromList(
          oQueryManager.getQueryModel().getDimensionByName(sMeasureDimName).getAllStructureMembers()
        );
        var oField = oQueryManager.getQueryModel().getDimensionByName(sMeasureDimName).getDisplayKeyField();
        var oMeasureMember = (function () {
          var oM = _.find(aStructureMembers, function (o) {
            var oVal = o.getFieldValue(oField);
            var s = oVal ? oVal.getString() : o.getName();
            return s === sMeasureMember;
          });
          if (!oM) {
            throw new Error("Member " + sMeasureMember + " not found in structure: " + sMeasureDimName);
          }
          return oM;
        }());
        if (!oNonMeasureStructure) {
          oMeasureMember.setNumericScale(nNumberOfDecimalPlaces);
          return that;
        } else {
          var nonMeasureDimName = oNonMeasureStructure.TechName;
          var aNonMeasureStructureMembers = ListHelper.arrayFromList(
            oQueryManager.getQueryModel().getDimensionByName(nonMeasureDimName).getAllStructureMembers()
          );
          oField = oQueryManager.getQueryModel().getDimensionByName(nonMeasureDimName).getDisplayKeyField();
          var oStructureMember = (function () {
            var oM = _.find(aNonMeasureStructureMembers, function (o) {
              var oVal = o.getFieldValue(oField);
              var s = oVal ? oVal.getString() : o.getName();
              return s === sNonMeasureMember;
            });
            if (!oM) {
              throw new Error("Member " + sNonMeasureMember + " not found in structure: " + nonMeasureDimName);
            }
            return oM;
          }());
          var aQueryCells = ListHelper.arrayFromIter(oQueryManager.getQueryModel().getQueryDataCells().getIterator());
          aQueryCells = _.filter(aQueryCells, function (o) {
            return o.hasMemberReference(oMeasureMember) && o.hasMemberReference(oStructureMember);
          });
          if (!aQueryCells || aQueryCells.length < 1) {
            throw new Error("Invalid Query Cell");
          }
          return _.forEach(aQueryCells, function (oQueryCell) {
            oQueryCell.setDecimalPlaces(nNumberOfDecimalPlaces);
          });
        }
      };
      that.getDecimalPlaces = function (sMeasureMember, sNonMeasureMember) {
        var measureDim = that.Dimensions.MeasureStructure;
        if (!measureDim) {
          throw new Error("No measure Structure");
        }
        var oNonMeasureDim = sNonMeasureMember ? that.Dimensions.NonMeasureStructure : null;
        var sMeasureDimName = measureDim.TechName;
        var aMeasureMembers = ListHelper.arrayFromList(
          oQueryManager.getQueryModel().getDimensionByName(sMeasureDimName).getAllStructureMembers()
        );
        var oMeasureDisplayField = oQueryManager.getQueryModel().getDimensionByName(sMeasureDimName).getDisplayKeyField();
        var oMeasureMember = (function () {
          var oM = _.find(aMeasureMembers, function (o) {
            var oVal = o.getFieldValue(oMeasureDisplayField);
            var s = oVal ? oVal.getString() : o.getName();
            return s === sMeasureMember;
          });
          if (!oM) {
            throw new Error("Member " + sMeasureMember + " not found in measureDim: " + sMeasureDimName);
          }
          return oM;
        }());
        if (!oNonMeasureDim) {
          return oMeasureMember.getNumericScale();
        }
        else {
          var sNonMeasureDimName = oNonMeasureDim.TechName;
          var aNonMeasureMembers = ListHelper.arrayFromList(
            oQueryManager.getQueryModel().getDimensionByName(sNonMeasureDimName).getAllStructureMembers()
          );
          var oNonMeasureDisplayField = oQueryManager.getQueryModel().getDimensionByName(sNonMeasureDimName).getDisplayKeyField();
          var oNonMeasureMember = (function () {
            var oM = _.find(aNonMeasureMembers, function (o) {
              var oVal = o.getFieldValue(oNonMeasureDisplayField);
              var s = oVal ? oVal.getString() : o.getName();
              return s === sNonMeasureMember;
            });
            if (!oM) {
              throw new Error("Member " + sNonMeasureMember + " not found in measureDim: " + sNonMeasureDimName);
            }
            return oM;
          }());
          var aQC = ListHelper.arrayFromIter(oQueryManager.getQueryModel().getQueryDataCells().getIterator());
          var oQC = _.find(aQC, function (o) {
            return o.hasMemberReference(oMeasureMember) && o.hasMemberReference(oNonMeasureMember);
          });
          if (!oQC) {
            throw new Error("Invalid Query Cell");
          }
          return oQC.getDecimalPlaces();
        }
      };
      that.setFilter = function (sDim, oVariant) {
        var oD = that.Dimensions[sDim];
        var aMem = [];
        if (typeof oVariant === "string") {
          aMem.push(oVariant);
        } else {
          aMem = oVariant;
        }
        sap.firefly.QFilterUtil.clearSelectionsInContainerByDimension(
          that.Dimensions[sDim].TechName,
          oQueryManager.getQueryModel().getFilter().getDynamicFilter()
        );
        var sDimName = that.Dimensions[sDim].TechName;
        var oFFDimension = oQueryManager.getQueryModel().getDimensionByName(sDimName);
        var aM = oD.IsStructure ? ListHelper.arrayFromList( oFFDimension.getAllStructureMembers()) : [];
        var oField = oD.IsStructure ? oFFDimension.getDisplayKeyField() : null;
        _.forEach(aMem, function (sMember) {
          var s = oD.IsStructure ? (function () {
            var oM = _.find(aM, function (o) {
              var oVal = o.getFieldValue(oField);
              var s = oVal ? oVal.getString() : o.getName();
              return s === sMember;
            });
            if (!oM) {
              throw new Error("Member " + sMember + " not found in structure: " + sDimName);
            }
            return oM.getName();
          }()) : sMember;
          oQueryManager.getQueryModel().getFilter().getDynamicFilter().addSingleMemberFilterByName(
            sDimName, s, sap.firefly.ComparisonOperator.EQUAL
          );
        });
        return that;
      };
      that.removeFilter = function (sDim) {
        sap.firefly.QFilterUtil.clearSelectionsInContainerByDimension(
          that.Dimensions[sDim].TechName,
          oQueryManager.getQueryModel().getFilter().getDynamicFilter()
        );
        return that;
      };
      that.filterAndDrillDown = function (sDim1, sMember, sDim2) {
        var oQM = oQueryManager.getQueryModel();
        var oD = that.Dimensions[sDim1];
        var s = oD.IsStructure ? _.find(oD.Members, function (o) {
          return o.Name === sMember;
        }).TechName : sMember;
        oQM.getFilter().getDynamicFilter().addSingleMemberFilterByName(
          that.Dimensions[sDim1].TechName, s, sap.firefly.ComparisonOperator.EQUAL
        );
        var oDim = oQM.getDimensionByName(that.Dimensions[sDim1].TechName);
        oDim.getAxis().add(oQM.getDimensionByName(that.Dimensions[sDim2].TechName));
        oQM.getAxis(sap.firefly.AxisType.FREE).add(oDim);
        return that;
      };
      that.sort = function (sDim, direction, type, sMember) {
        var oDim = oQueryManager.getQueryModel().getDimensionByName(that.Dimensions[sDim].TechName);
        if (that.Dimensions[sDim].IsStructure) {
          var oCC = oQueryManager.getConvenienceCommands();
          oCC.clearSort(null, null);
          oCC.sortByMeasure(_.find(that.Dimensions[sDim].Members, function (oM) {
            return oM.Name === sMember;
          }).TechName, sap.firefly.XSortDirection[direction]);
        } else {
          oDim.getResultSetSorting().setDirection(sap.firefly.XSortDirection[direction]);
          if (type) {
            oDim.getResultSetSorting().setSortType(sap.firefly.SortType[type]);
          }
        }
        return that;
      };
      that.toRows = function (sDim) {
        var oQM = oQueryManager.getQueryModel();
        oQM.getAxis(
          sap.firefly.AxisType.ROWS
        ).add(oQM.getQueryModel().getDimensionByName(that.Dimensions[sDim].TechName));
        return that;
      };
      that.toColumns = function (sDim) {
        var oQM = oQueryManager.getQueryModel();
        oQM.getAxis(
          sap.firefly.AxisType.COLUMNS
        ).add(
          oQM.getQueryModel().getDimensionByName(that.Dimensions[sDim].TechName)
        );
        return that;
      };
      that.drill = function (sDim, nIndex, bKeepOffset) {
        var oDim = oQueryManager.getQueryModel().getDimensionByName(that.Dimensions[sDim].TechName);
        var oTE = oResultSet.getAxis(oDim.getAxisType()).getTupleAt(nIndex).getTupleElementByDimension(
          oDim
        );
        oTE.setNextDrillState(
          oTE.getDrillState() !== sap.firefly.DrillState.COLLAPSED ? sap.firefly.DrillState.COLLAPSED : sap.firefly.DrillState.EXPANDED
        );
        return that.getResultSet(bKeepOffset);
      };
      that.exchange = function (sDim1, sDim2) {
        var oQM = oQueryManager.getQueryModel();
        var oD1 = oQM.getDimensionByName(that.Dimensions[sDim1].TechName);
        var oD2 = oQM.getDimensionByName(that.Dimensions[sDim2].TechName);
        var oD2A = oD2.getAxis();
        oD1.getAxis().insert(oD1.getDimension().getAxis().getDimensionIndex(that.Dimensions[sDim1].TechName) + 1, oD2);
        oD2A.add(oD1);
        return that;
      };
      that.submitVariables = function () {
        return SyncActionHelper.syncActionToPromise(
          oQueryManager.submitVariables,
          oQueryManager,
          []
        ).then(
          function (oRes) {
            updateMetaData();
            if (oRes && oRes.getMessages().length) {
              oOlapModel.addMessages(ListHelper.arrayFromList(
                oRes.getMessages()
              ).map(function (o) {
                var sSeverity = o.getSeverity().getName();
                if (sSeverity === "Info") {
                  sSeverity = "Information";
                }
                return {
                  Text: o.getText(),
                  Severity: sSeverity,
                  Code: o.getCode(),
                  MessageClass: o.getMessageClass(),
                  LongTextUri: o.getMessageClass() ? [
                    "/sap/opu/odata/iwbep/message_text;o=LOCAL/T100_longtexts(MSGID='",
                    encodeURIComponent(o.getMessageClass()), "',MSGNO='", encodeURIComponent(o.getCode()), ",',MESSAGE_V1='',MESSAGE_V2='',MESSAGE_V3='',MESSAGE_V4='')/$value"
                  ].join("") : null
                };
              }));
            }
            fVariableUpdater(oQueryManager);
            oOlapModel.checkUpdate();
          }
        ).catch(
          function (oError) {
            oOlapModel.addMessages(oError.getMessages ? oError.getMessages() : []);
            if (!oError.getMessages) {
              throw oError;
            }
            that.Grid = null;
            oOlapModel.checkUpdate();
          }
        );
      };
      var oStep;
      that.setPlanValue = function (nIndex, sValue) {
        var oCell = that.Grid.Cells[nIndex];
        var oDC = oQueryManager.getCursorResultSet().getDataCell(oCell.DataColumn, oCell.DataRow);
        oDC.setNewValueExternal(sValue);
        if (oDC.getValueException() !== sap.firefly.ValueException.NULL_VALUE) {
          oCell.DisplayValue = oDC.getString();
          if (sValue === oCell.DisplayValue) {
            oCell.valueState = "Success";
          } else {
            oCell.valueState = "Warning";
          }
        } else {
          oCell.DisplayValue = sValue;
          oCell.valueState = "Success";
        }
        oOlapModel.checkUpdate();
        return that;
      };
      that.transferValue = function () {
        oQueryManager.transferNewValues();
        return that;
      };
      that.getResultSet = function (bKeepOffset) {
        if (!bKeepOffset) {
          that.setOffsetCol(0);
          that.setOffsetRow(0);
        }
        if (oStep) {
          oApplication.getSession().notifyInterruptStep(oStep, false);
        }
        if (oQueryManager.hasChangedCells()) {
          oQueryManager.transferNewValues();
        }
        oQueryManager.setOffsetColumns(that.virtualOffsetCol);
        oQueryManager.setOffsetRows(that.virtualOffsetRow);
        oQueryManager.setMaxRows(oOlapModel.getLimit().rowLimit);
        oQueryManager.setMaxColumns(oOlapModel.getLimit().colLimit);
        oOlapModel.fireRequestSent({infoObject: that.Name});
        return SyncActionHelper.syncActionToPromise(
          oQueryManager.processQueryExecution,
          oQueryManager,
          []
        ).then(
          function (oResultSetContainer) {
            oStep = sap.firefly.XInterruptStep.create();
            oApplication.getSession().notifyInterruptStep(oStep, true);
            oResultSet = oResultSetContainer.getClassicResultSet();
            var oFFG = (function () {
              var fioriGrid = sap.firefly.FioriGridFactory.createFioriGrid(
                oResultSet
              );
              if (that.getSuppressedUnit()) {
                fioriGrid.setSuppressUnit(that.getSuppressedUnit());
              }
              _.map(
                oOlapModel.getSemanticStyles(),
                function (sSemantic, sMember) {
                  fioriGrid.addSemanticStyle(sMember, sSemantic);
                }
              );
              return fioriGrid.exportToFireflyGrid(that.SuppressRepetition);
            }());
            that.Grid = oFFG.convertToNative();
            that.Grid.format = sFormat;
            that.Grid.virtualOffsetCol = that.virtualOffsetCol;
            that.Grid.virtualOffsetRow = that.virtualOffsetRow;
            if (!that.Grid.Cells || that.Grid.Cells.length === 0) {
              that.Grid.Cells = [{
                Column: 0,
                Row: 0,
                DisplayValue: ResourceBundle.getText("no_data"),
                CellType: CellType.EMPTY
              }];
            }
            that.Grid.fixedRows = oFFG.getIntegerByKey("FixedRows");
            that.Grid.fixedColumns = oFFG.getIntegerByKey("FixedColumns");
            var n = oResultSet.getAxis(sap.firefly.AxisType.ROWS).getTuplesCountTotal();
            if (n === -1) {
              n = oResultSet.getAxis(sap.firefly.AxisType.ROWS).getTuplesCount();
            }
            that.Grid.virtualRows = n;
            n = oResultSet.getAxis(sap.firefly.AxisType.COLUMNS).getTuplesCountTotal();
            if (n === -1) {
              n = oResultSet.getAxis(sap.firefly.AxisType.COLUMNS).getTuplesCount();
            }
            that.Grid.virtualColumns = n;
            updateMetaData(ResultSetHelper.flatten(oResultSet, that));
            if (oResultSet.getMessages().length) {
              oOlapModel.addMessages(ListHelper.arrayFromList(
                oResultSet.getMessages()
              ).map(function (o) {
                var sSeverity = o.getSeverity().getName();
                if (sSeverity === "Info") {
                  sSeverity = "Information";
                }
                return {
                  Text: o.getText(),
                  Severity: sSeverity,
                  Code: o.getCode(),
                  MessageClass: o.getMessageClass(),
                  LongTextUri: o.getMessageClass() ? [
                    "/sap/opu/odata/iwbep/message_text;o=LOCAL/T100_longtexts(MSGID='",
                    encodeURIComponent(o.getMessageClass()), "',MSGNO='", encodeURIComponent(o.getCode()), ",',MESSAGE_V1='',MESSAGE_V2='',MESSAGE_V3='',MESSAGE_V4='')/$value"
                  ].join("") : null
                };
              }));
            }
            oOlapModel.checkUpdate();
            oOlapModel.fireRequestCompleted({infoObject: that.Name});
            return that;
          }
        ).catch(
          function (oError) {
            oOlapModel.addMessages(oError.getMessages ? oError.getMessages() : []);
            if (!oError.getMessages) {
              throw oError;
            }
            oOlapModel.checkUpdate(true);
            oOlapModel.fireRequestFailed({});
            return that;
          });
      };
      that.getRRITargets = function (nRow, nColumn) {
        var rriTargetManager = oQueryManager.getRriTargetManager();
        if (!rriTargetManager) {
          return Promise.resolve([]);
        }
        rriTargetManager.setResultSetContext(nRow, nColumn);
        var fResolve, fReject;
        
        function handleDialog(resolve, reject) {
          fResolve = resolve;
          fReject = reject;
        }
        
        rriTargetManager.processRriTargetResolution(sap.firefly.SyncType.NON_BLOCKING, {
          onRriTargetResolution: function (oRes) {
            if (oRes.hasErrors()) {
              fReject(oRes.getMessages());
            } else {
              var oUrlParsing = sap.ushell ? sap.ushell.Container.getService(
                "URLParsing"
              ) : {
                isIntentUrl: _.constant(false)
              };
              fResolve(_.filter(
                oRes.getData().getListFromImplementation().map(
                  function (o) {
                    return o.getParameters().getMapFromImplementation();
                  }),
                function (o) {
                  return oUrlParsing.isIntentUrl(o.URL) || !!o.URL.match(/#/);
                }
              ).map(
                function (o) {
                  o.URL = o.URL.split("#")[1];
                  return o;
                }));
            }
          }
        });
        return new Promise(handleDialog);
      };
      that.refreshLeaveMsg = function () {
        return that.getResultSet(false);
      };
      that.synchronize = function (bKeepOffset) {
        oOlapModel.clearMessages();
        return that.getResultSet(bKeepOffset);
      };
      that.getColumnSelection = function (nIndex) {
        return ResultSetHelper.tupleToObject(
          oResultSet.getColumnsAxis().getTupleAt(nIndex)
        );
      };
      that.getRowSelection = function (nIndex) {
        return ResultSetHelper.tupleToObject(
          oResultSet.getRowsAxis().getTupleAt(nIndex)
        );
      };
      that.getSelection = function (nRowIndex, nColumIndex) {
        return _.assign(
          nRowIndex >= 0 && nRowIndex < oResultSet.getRowsAxis().getTuplesCount() ? ResultSetHelper.tupleToObject(
            oResultSet.getRowsAxis().getTupleAt(nRowIndex)
          ) : {},
          nColumIndex >= 0 && nColumIndex < oResultSet.getColumnsAxis().getTuplesCount() ? ResultSetHelper.tupleToObject(
            oResultSet.getColumnsAxis().getTupleAt(nColumIndex)
          ) : {}
        );
      };
      that.setSuppressRepetition = function (b) {
        that.SuppressRepetition = b;
      };
      that.getMemberCatalog = function (sDim, sTextSel) {
        var fResolve, fReject;
        
        function handle(resolve, reject) {
          fResolve = resolve;
          fReject = reject;
        }
        
        var oDim = oQueryManager.getQueryModel().getDimensionByName(that.Dimensions[sDim].TechName);
        var oDKF = oDim.getDisplayKeyField() || oDim.getKeyField();
        var oTF = oDim.getTextField() || oDim.getDisplayKeyField();
        var oKF = oDim.getKeyField();
        oDim.clearSelectorFilter();
        oDim.getSelectorFields().clear();
        oDim.getSelectorFields().add(oDim.getKeyField());
        oDim.getSelectorFields().add(oDim.getDisplayKeyField());
        oDim.getSelectorFields().add(
          oDim.getTextField() || oDim.getDisplayKeyField()
        );
        oDim.setSelectorFilterOnDisplayKey(true);
        if (sTextSel) {
          oDim.addSelectorFilterForKey(
            sTextSel, sap.firefly.ComparisonOperator.MATCH
          );
          oDim.addSelectorFilterForText(
            sTextSel, sap.firefly.ComparisonOperator.MATCH
          );
        }
        var oProm = new Promise(handle);
        oDim.processValueHelpResultSet(
          sap.firefly.SyncType.NON_BLOCKING,
          {
            onValuehelpExecuted: function (oExtResult) {
              return oExtResult.hasErrors() ? fReject(
                SyncActionHelper.reject(oExtResult)
              ) : fResolve(oExtResult.getData());
            }
          },
          null
        );
        return oProm.then(function (oData) {
          var oRows = oData.getClassicResultSet().getRowsAxis();
          var aList = _.range(
            oRows.getTuplesCount()
          ).map(
            function (nIndex) {
              var oTP = oRows.getTupleAt(nIndex);
              return {
                key: oTP.getStringByField(oKF),
                displayKey: oTP.getStringByField(oDKF) ||
                  oTP.getStringByField(oKF),
                description: oTP.getStringByField(oTF) ||
                  oTP.getStringByField(oDKF) ||
                  oTP.getStringByField(oKF)
              };
            }
          );
          return {
            catalog: aList
          };
        });
      };
      that.readHierarchy = function (sDim, nLevel) {
        var fResolve, fReject;
        
        function handle(resolve, reject) {
          fResolve = resolve;
          fReject = reject;
        }
        
        var oHelpValueProvider = oQueryManager.getValueHelpProvider();
        var oDim = oQueryManager.getQueryModel().getDimensionByName(that.Dimensions[sDim].TechName);
        var nOldLevel = oDim.getInitialDrillLevel();
        oDim.setSelectorInitialDrillLevel(nLevel);
        var oProm = new Promise(handle);
        oHelpValueProvider.processValueHelp(oDim, sap.firefly.SyncType.NON_BLOCKING, {
          onValuehelpExecuted: function (oExtResult) {
            return oExtResult.hasErrors() ? fReject(
              SyncActionHelper.reject(oExtResult.getErrors())
            ) : fResolve(oExtResult.getData());
          }
        }, null, null);
        return oProm.then(function (oData) {
          function prodNode(oNode) {
            if (!oNode) {
              return {};
            }
            var oChildren = oNode.getChildren();
            return {
              Name: oNode.getName(),
              Text: oNode.getDimensionMember().getText() || oNode.getDimensionMember(oNode.getDimension().getHierarchyDisplayKeyField()).getValue().getString(),
              hierNodes: oChildren ? _.map(oChildren.getListFromImplementation(), prodNode) : null
            };
          }
          
          oDim.setSelectorInitialDrillLevel(nOldLevel);
          var aRoots = _.filter(
            oData.getListFromImplementation(),
            function (oNode) {
              return !oNode.getParentNode();
            });
          return aRoots.length === 1 ? prodNode(
            aRoots[0]
          ) : {
            Name: "$Root",
            Text: ResourceBundle.getText("ARTIFICIAL_ROOT"),
            hierNodes: _.map(aRoots, prodNode)
          };
        });
      };
      that.hasVariable = function (sVariable) {
        var sName = oVariableMapping[sVariable];
        if (!sName) {
          return false;
        }
        var oVariable = oQueryManager.getQueryModel().getVariable(
          sName
        );
        return !!oVariable && oVariable.isInputEnabled();
      };
      that.setVariableValue = function (sVariable, aRange) {
        var oVariable = oQueryManager.getQueryModel().getVariable(
          oVariableMapping[sVariable]
        );
        if (!oVariable) {
          return that;
        }
        if (!oVariable.isInputEnabled()) {
          throw new Error("Variable not input enabled");
        }
        oVariable.clear();
        if(!aRange){
          return that;
        }
        var oMemberFilter = oVariable.getMemberFilter ? oVariable.getMemberFilter() : null;
        _.forEach(aRange, function (oRange) {
          if (oMemberFilter) {
            var filterElement = oMemberFilter.addNewCartesianElement();
            var oAccess = sap.firefly.XValueAccess.createWithType(oVariable.getValueType());
            oAccess.parseString(oRange.Low);
            filterElement.getLow().setValue(oAccess.getValue());
            if (oRange.High) {
              oAccess = sap.firefly.XValueAccess.createWithType(oVariable.getValueType());
              oAccess.parseString(oRange.High);
              filterElement.getHigh().setValue(oAccess.getValue());
            }
            filterElement.setComparisonOperator(sap.firefly.ComparisonOperator[oRange.Comparison]);
            filterElement.setSetSign(sap.firefly.SetSign[oRange.IsExcluding ? "EXCLUDING" : "INCLUDING"]);
            var oKNC = oVariable.getDimension().getFirstFieldByType(sap.firefly.PresentationType.KEY_NOT_COMPOUND);
            if (oKNC) {
              filterElement.setField(oKNC);
            }
          } else {
            oVariable.setValueByStringExt(oRange.Low, true);
          }
        });
        fVariableUpdater(oQueryManager);
        return that;
      };
      that.deserialize = function (s) {
        oQueryManager.getQueryModel().deserializeExt(sap.firefly.QModelFormat.INA_REPOSITORY, s);
      };
      that.serialize = function () {
        return oQueryManager.getQueryModel().serializeToContentExt(sap.firefly.QModelFormat.INA_REPOSITORY, null).getString();
      };
      that.openCreateFormulaDialog = function (sDim) {
        return oDialogs.then(function (oDialogs) {
          return oDialogs.Formular.open(oOlapModel, sDataProviderName, sDim);
        });
      };
      that.openConditionDialog = function () {
        return oDialogs.then(function (oDialogs) {
          return oDialogs.Condition;
        }).then(function (oDlg) {
          return oDlg.open(oOlapModel, sDataProviderName);
        });
      };
      that.openExceptionDialog = function () {
        return oDialogs.then(
          function (oDialogs) {
            return oDialogs.Exception.open(oOlapModel, sDataProviderName);
          });
      };
      that.openCreateRestrictionDialog = function (sDim, sMem) {
        return oDialogs.then(function (oDialogs) {
          return oDialogs.Restriction.open(oOlapModel, sDataProviderName, sDim, sMem);
        });
      };
      that.getResultRequest = function () {
        return oQueryManager.getResultsetContainer().getResultSetManager().getDataRequest().convertToNative();
      };
      that.getQueryView = function () {
        return oQueryManager.getQueryModel().serializeToElement(sap.firefly.QModelFormat.INA_DATA).convertToNative();
      };
      that.getMemberDescription = function (sDim, sMem) {
        if (that.Dimensions[sDim].IsStructure) {
          return _.find(that.Dimensions[sDim].Members, function (oM) {
            return oM.Name === sMem;
          }).Description;
        } else {
          var oMem = _.find(
            ListHelper.arrayFromList(
              oQueryManager.getQueryModel().getDimensionByName(sDim).getAllDimensionMembers()
            ),
            function (o) {
              return o.getName() === sMem;
            });
          if (!oMem) {
            Log.error("Could not find measure");
            return "";
          }
          return oMem.getText();
        }
      };
      that.addRestriction = function (o) {
        var oQM = oQueryManager.getQueryModel();
        var oRestKyf = oQueryManager.getQueryModel().getMeasureDimension().addNewRestrictedMeasure(
          ["REST_", Date.now()].join("_"),
          o.Description
        );
        var oFilter = oRestKyf.getFilter();
        oFilter.addSingleMemberFilterByDimension(
          oQueryManager.getQueryModel().getMeasureDimension(),
          _.find(that.Dimensions[o.Dimension].Members, function (oM) {
            return oM.Name === o.Keyfigure;
          }).TechName, sap.firefly.ComparisonOperator.EQUAL);
        _.forEach(
          o.Dimensions,
          function (oDim) {
            if (oDim.ConstantSelection) {
              oRestKyf.addExternalDimensionToIgnore(that.Dimensions[oDim.Name].TechName);
            }
            _.forEach(
              oDim.Values,
              function (oV) {
                oFilter.addSingleMemberFilterByDimension(
                  oQM.getDimensionByName(
                    that.Dimensions[oDim.Name].TechName, oV.Low, sap.firefly.ComparisonOperator[oV.ComparisonOperator]
                  ),
                  oV.Low
                );
              });
          });
        if (
          oQueryManager.getQueryModel().getFilter().getDynamicFilter().getDimensionsUsedInFilter().contains(
            oQueryManager.getQueryModel().getMeasureDimension().getName()
          )
        ) {
          oQueryManager.getQueryModel().getFilter().getDynamicFilter().addSingleMemberFilterByName(
            oQueryManager.getQueryModel().getMeasureDimension().getName(), oRestKyf.getName(), sap.firefly.ComparisonOperator.EQUAL
          );
        }
        return that;
      };
      that.addFormula = function (sDim, sDescription, oParseTree, sExcAggregation, sExcAggregationDim) {
        var oMembers = _.reduce(
          that.getStructureMembers(sDim),
          function (oC, oM) {
            oC[oM.Name] = oM;
            return oC;
          }, {});
        return Promise.resolve(null).then(function () {
          var oDim = oQueryManager.getQueryModel().getDimensionByName(that.Dimensions[sDim].TechName);
          
          function createConstantFormula(oNode) {
            var oRes = sap.firefly.QFactory.newFormulaConstant(oQueryManager);
            oRes.setString(oNode.left);
            return oRes;
          }
          
          function createOperatorFormula(oNode) {
            var oRes = sap.firefly.QFactory.newFormulaFunctionWithName(oQueryManager, oNode.operator);
            oRes.add(createFE(oNode.left));
            oRes.add(createFE(oNode.right));
            return oRes;
          }
          
          function createFE(oNode) {
            switch (oNode.operator) {
            case "Variable":
              return sap.firefly.QFactory.newFormulaMemberWithName(oQueryManager, oMembers[oNode.left].TechName);
            case "Literal":
              return createConstantFormula(oNode);
            case "+":
            case "-":
            case "*":
            case "/":
              return createOperatorFormula(oNode);
            default:
              throw new Error("Invalid operator:" + oNode.operator);
            }
          }
          
          var sId = ["CALC_", Date.now()].join("");
          var oFormula = oDim.addNewFormulaMeasure(sId, sDescription);
          if (sExcAggregation && sExcAggregation !== "DEFAULT" && sExcAggregationDim) {
            oFormula.setAggregationType(sap.firefly.AggregationType[sExcAggregation]);
            oFormula.addExceptionAggregationDimension(oQueryManager.getQueryModel().getDimensionByName(that.Dimensions[sExcAggregationDim].TechName));
          }
          oFormula.setNumericShift(0);
          oFormula.setNumericScale(2);
          oFormula.setNumericPrecision(31);
          oFormula.setFormula(createFE(oParseTree));
          if (oQueryManager.getQueryModel().getFilter().getDynamicFilter().getDimensionsUsedInFilter().contains(sDim)) {
            oQueryManager.getQueryModel().getFilter().getDynamicFilter().addSingleMemberFilterByName(
              that.Dimensions[sDim].TechName, sId, sap.firefly.ComparisonOperator.EQUAL
            );
          }
          return that;
        });
      };
      that.addException = function (oData) {
        return Promise.resolve(null).then(function () {
          var sId = ["EXC_", Date.now()].join("");
          var oExc = oQueryManager.getQueryModel().getExceptionManager().newException(
            sId,
            oData.Description
          );
          var oStru = oQueryManager.getQueryModel().getDimensionByName(that.Dimensions[oData.Structure1Key].TechName);
          var oMem = that.Dimensions[oData.Structure1Key].Members[parseInt(oData.measure1, 10)];
          oExc.setMeasure(oStru.getStructureMember(
            oMem.TechName
          ));
          var oThreshold = oExc.newThreshold(oData.Value, sap.firefly.AlertLevel[oData.alertLevel]);
          oThreshold.setOperator(sap.firefly.ComparisonOperator[oData.operator]);
          oExc.addThreshold(oThreshold);
          oQueryManager.getQueryModel().getExceptionManager().add(oExc);
          return that;
        });
      };
      that.addCondition = function (oData) {
        return Promise.resolve(null).then(function () {
          var sId = ["COND_", Date.now()].join("");
          var oCond = oQueryManager.getQueryModel().getConditionManager().addNewCondition(
            sId);
          oCond.setDescription(oData.Description);
          oCond.setText(oData.Description);
          var oStru = oQueryManager.getQueryModel().getDimensionByName(that.Dimensions[oData.Structure1Key].TechName);
          var sEltId = _.find(that.Dimensions[oData.Structure1Key].Members, function (oM) {
            return oData.measure1 === oM.Name;
          }).TechName;
          if (!sEltId) {
            throw new Error("Invalid measure");
          }
          oCond.setDimensionEvaluationType(sap.firefly.ConditionDimensionEvaluationType.ALL_IN_DRILL_DOWN);
          var oThreshold = oCond.createThreshold();
          var oStruMem = oStru.getStructureMember(sEltId);
          if (!oStruMem) {
            throw new Error("Invalid measure");
          }
          oThreshold.addMeasureCoordinate(oStruMem);
          //Top N
          oThreshold.setComparisonOperator(sap.firefly.ConditionComparisonOperator[oData.operator]);
          oThreshold.getLow().setString(oData.Value);
          return that;
        });
      };
      that.setExceptionActive = function (sName, bActive) {
        oQueryManager.getQueryModel().getExceptionManager().getByKey(sName).setActive(bActive);
        return that.getResultSet();
      };
      that.setConditionActive = function (sName, bActive) {
        oQueryManager.getQueryModel().getConditionManager().getByKey(sName).setActive(bActive);
        return that.getResultSet();
      };
      that.blendWithDataProvider = function (sSecondaryDP, oDef) {
        Log.info(sSecondaryDP);
        Log.info(oDef);
        return null;
      };
      that.exportToExcel = function (oWorkBook) {
        var oS = _.reduce(
          _.groupBy(that.Grid.Cells, "Row"),
          function (oSheet, oRow) {
            _.reduce(
              oRow,
              function (oR, oC) {
                var oCellInfo = new CellInfo();
                oCellInfo.setFormattedValue(oC.DisplayValue);
                var sStyle;
                switch (oC.CellType) {
                case CellType.HEADER:
                  sStyle = CXpStyle.HEADER;
                  break;
                case CellType.TITLE:
                  sStyle = CXpStyle.GROUP;
                  break;
                default:
                  sStyle = CXpStyle.STANDARD;
                }
                oCellInfo.setStyle(sStyle);
                oWorkBook.setCell(
                  oWorkBook.addCell(oR),
                  oCellInfo
                );
                return oR;
              },
              oWorkBook.createRow(oSheet)
            );
            return oSheet;
          },
          oWorkBook.addWorksheet(that.QueryName)
        );
        oWorkBook.closeWorkSheet(oS);
        return that;
      };
      that.resetToDefault = function (){
        oQueryManager.getConvenienceCommands().resetToDefault();
      };
    };
    /**
     * hasVariable Checks whether a Variable is influencing the DataProvider
     * @param {string} the Name of the Variable
     * @return {boolean} Whether the vairable influences the DataProvider
     * @public
     */
    DataProvider.prototype.hasVariable = function () {
    };
    /**
     * Distribute the dimension among the rows and columns
     * @param {object} mLayout an Object containing a <code>rows</code> member referencing a string array containing the names of the dimensions
     *                       and a <code>columns</code> member referencing a string array containing the dimension on the columns. The order in the array
     *                       control the positon on the axis.
     * @return {this} resolving to the <code>DataProvider</code> to allow chaining. In case that a the Currency Translation Settings have been changed
     * in the dialog, the new resultset was retrieved before the promise gets resolved.
     * @public
     */
    DataProvider.prototype.setAxesLayout = function () {
    };
    /**
     * Open a dialog that allows to display and change the property of a <code>Query Cell</code> of the <code>DataProvider</code>.
     * @param {string} [sDim1] the external name of the first structure
     * @param {string} [sMem1] the external name of the member of the first structure
     * @param {string} [sDim2] the external name of the second structure
     * @param {string} [sMem2] the external name of the member of the second structure
     * @return {Promise<this>} resolving to the <code>DataProvider</code> to allow chaining. In case that a the Currency Translation Settings have been changed
     * in the dialog, the new resultset was retrieved before the promise gets resolved.
     * @public
     */
    DataProvider.prototype.openCellDialog = function () {
    };
    /**
     * Open a dialog that allows to display and change the property of an <code>Axis</code> of the <code>DataProvider</code>.
     * @param {string} sDim the external name of the Dimension
     * @return {Promise<boolean>} indicator whether the dialog was confirmed or canceled
     * @public
     */
    DataProvider.prototype.openAxisDialog = function () {
    };
    /**
     * Open a dialog that allows to display and change the currency translation settings of the <code>DataProvider</code>.
     * @return {Promise<boolean>} indicator whether the dialog was confirmed or canceled
     * in the dialog, the new resultset was retrieved before the promise gets resolved.
     * @public
     */
    DataProvider.prototype.openCurrencyTranslationDialog = function () {
    };
    /**
     * Open a dialog that allows to create a new Condition. That is a criterium on measure values for result set filtering.
     * @return {Promise<this>} resolving to the <code>DataProvider</code> to allow chaining. In case that a new Condition was created in
     * the dialog, the new resultset was retrieved before the promise gets resolved.
     * @public
     */
    DataProvider.prototype.openConditionDialog = function () {
    };
    /**
     * Open a dialog that allows to create a new Exception. That is a criterium for conditional formatting.
     * @return {Promise<boolean>} indicator whether the dialog was confirmed or canceled
     * @public
     */
    DataProvider.prototype.openExceptionDialog = function () {
    };
    /**
     * Open a dialog to display and change the settings of a dimension of the <code>DataProvider</code>
     * @param {string} sDim the external name of the Dimension
     * @return {Promise<boolean>} indicator whether the dialog was confirmed or canceled
     * @public
     */
    DataProvider.prototype.openDimDialog = function () {
    };
    /**
     * Open a dialog to display and change the filter on a dimension of the <code>DataProvider</code>
     * @param {string} sDimensionName the external name of the Dimension
     * @return {Promise} resolving to a boolean which is false when the dialog is cancelled and true if is was closed with Ok and dynamic filters of the given dimension are updated
     * @public
     */
    DataProvider.prototype.openSelector = function () {
    };
    /**
     * Set the filter for a dimension
     * @param {string} sDim the external name
     * @param {object} oFilter the filter
     * @return {{this} resolving to the <code>DataProvider</code> to allow chaining.
     * @public
     */
    DataProvider.prototype.setFilter = function () {
    };
    /**
     * Remove the filter of a dimension
     * @param {string} sDim the external name
     * @return {this} resolving to the <code>DataProvider</code> to allow chaining.
     * @public
     */
    DataProvider.prototype.removeFilter = function () {
    };
    /**
     * Filter a dimension by one member and drillown another dimension
     * @param {string} sDim1 the external name of the  Dimension to be filtered
     * @param {string} sMember the filter
     * @param {string} sDim2 the dimension to be drilled
     * @return {this} resolving to the <code>DataProvider</code> to allow chaining.
     * @public
     */
    DataProvider.prototype.filterAndDrillDown = function () {
    };
    /**
     * Sort the members of a dimension
     * @param {string} sDim the external name of the  Dimension
     * @param {sap.zen.dsh.SortType} type of sorting
     * @param {sap.zen.dsh.SortDirection} direction of sorting
     * @param {string} [sMember] in case of a structure the measure according to which is sorted
     * @return {Promise<this>} resolving to the <code>DataProvider</code> to allow chaining.
     * @public
     */
    DataProvider.prototype.sort = function () {
    };
    /**
     * Move a dimension to the rows axis
     * @param {string} sDim the external name of the  Dimension
     * @return {this} resolving to the <code>DataProvider</code> to allow chaining.
     * @public
     */
    DataProvider.prototype.toRows = function () {
    };
    /**
     * Move a dimension to the columns axis
     * @param {string} sDim the external name of the  Dimension
     * @return {this} resolving to the <code>DataProvider</code> to allow chaining.
     * @public
     */
    DataProvider.prototype.toColumns = function () {
    };
    /**
     * Do a drill operation on a dimension member on an Axis
     * @param {string} sDim the external name of the  Dimension
     * @param {int} nIndex the Tuple Index of the member in the resultset.
     * @return {this} resolving to the <code>DataProvider</code> to allow chaining.
     * @public
     */
    DataProvider.prototype.drill = function () {
    };
    /**
     * Exchange the axis and position of two dimensions
     * @param {string} sDim1 the external name of the first Dimension
     * @param {string} sDim2 the external name of the second Dimension
     * @return {Promise<this>} resolving to the <code>DataProvider</code> to allow chaining.
     * @public
     */
    DataProvider.prototype.exchange = function () {
    };
    /**
     * submit the value of the input enabled queries to the InA Server
     * @return {Promise<this>} resolving to the <code>DataProvider</code> to allow chaining.
     * @public
     */
    DataProvider.prototype.submitVariables = function () {
    };
    /**
     * set a data value to an input entabled cell
     * @param {int} nIndex Index of the data cell in the Grid aggregation of the <code>DataProvider</code>
     * @param {float} fValue the new value of the data cell
     * @return{Promise<this>} resolving to the <code>DataProvider</code> to allow chaining.
     * @public
     */
    DataProvider.prototype.setPlanValue = function () {
    };
    /**
     * transfer the entered data values to the InA Server
     * @return {Promise<this>} resolving to the <code>DataProvider</code> to allow chaining.
     * @public
     */
    DataProvider.prototype.transferValue = function () {
    };
    /**
     * get the current resultset from the InA Server
     * @return {Promise<this>} resolving to the <code>DataProvider</code> to allow chaining.
     * @public
     */
    DataProvider.prototype.getResultSet = function () {
    };
    /**
     * get the list of the jump targets associated to a datacell defined via
     * the report report interface.
     * @param {int} nRow Row of the data cell
     * @param {int} nColumn Column of the data cell
     * @return {Promise<this>} resolving to the List of jump targets.
     * @public
     */
    DataProvider.prototype.getRRITargets = function () {
    };
    /**
     *  set the state of an exception (aka conditional format).
     * @param {string} sName name of the exception
     * @param {boolean} bActive Target state of the exception
     * @return {Promise<this>} resolving to the <code>DataProvider</code> to allow chaining.
     * @public
     */
    DataProvider.prototype.setExceptionActive = function () {
    };
    /**
     * add a new condition (aka resultset filter).
     * @param {object} oData Condition Definiton
     * @param {boolean} bActive Target state of the condition
     * @return {Promise<this>} resolving to the <code>DataProvider</code> to allow chaining.
     * @public
     */
    DataProvider.prototype.addCondition = function () {
    };
    /**
     * move a dimension one position up on it's axis
     * @param {string} sName name of the dimension
     * @param {boolean} bActive Target state of the condition
     * @return {this} the <code>DataProvider</code> to allow chaining.
     * @public
     */
    DataProvider.prototype.moveUp = function () {
    };
    /**
     * move a dimension one position down on it's axis
     * @param {string} sName name of the dimension
     * @param {boolean} bActive Target state of the condition
     * @return {this} the <code>DataProvider</code> to allow chaining.
     * @public
     */
    DataProvider.prototype.moveDown = function () {
    };
    /**
     * set the state of a condition (aka result set filter).
     * @param {string} sName name of the condition
     * @param {boolean} bActive Target state of the condition
     * @return {Promise<this>} resolving to the <code>DataProvider</code> to allow chaining.
     * @public
     */
    DataProvider.prototype.setConditionActive = function () {
    };
    /**
     * open the dialog that allows to display and change the axis layout.
     * @return {Promise<this>} resolving to the <code>DataProvider</code> to allow chaining.
     * @public
     */
    /**
     * Set Display Hierachy
     * @return {this} resolving to the <code>DataProvider</code> to allow chaining.
     * @param {string} sDim  the external name of the structure on which the new restriction is created
     * @param {boolean} bActive whether the hierarchy should be activated
     * @param {string} sHierachy the  name of the hierarchy (optional)
     * @param {string} sVersion the version of the hierarchy (optional)
     * @public
     */
    DataProvider.prototype.setDisplayHierarchy = function () {
    };
    /**
     * open the dialog that allows to create a new Formula.
     * @return {Promise<this>} resolving to the <code>DataProvider</code> to allow chaining.
     * @param {string} sDim  the external name of the structure on which the new restriction is created
     * @public
     */
    DataProvider.prototype.openCreateFormulaDialog = function () {
    };
    /**
     * open the dialog that allows to create a new restriction.
     * @return {Promise<this>} resolving to the <code>DataProvider</code> to allow chaining.
     * @param {string} sDim  the external name of the structure on which the new restriction is created
     * @param {string} sMember the external name of the member that will be restricted
     * @public
     */
    DataProvider.prototype.openCreateRestrictionDialog = function () {
    };
    
    /**
     * get the list of filters of a dimension
     * @param {string} sDim the name of the dimension
     * from which the filter is retrieved
     * @return {object[]} list of a range with components
     * <ul>
     * <li><code>Low</code>: The Low value of the range
     * <li><code>High</code>: The High value of the range
     * <li><code>Operator</code>: The Operator: EQ,LE,..,BT
     * <ul>
     * @public
     */
    DataProvider.prototype.getFilterOfDim = function () {
    };
    /**
     * retrieve the data of the current naviation state <code>DataProvider</code> from the InA Server.
     * @return {Promise<this>} to allow chaining.
     * @public
     */
    DataProvider.prototype.synchronize = function () {
    };
    /**
     * sets the format property of the dataprovider, this can influence the
     * resultset that is aggregated in the <code>Grid.Cells</code> collection.
     * Its main purpose is to influence the visualisation of a <code>sap.zen.dsh.PivotTable</code>
     * @param {sap.zen.commons.Format} sFormat the format to be used
     * @public
     */
    DataProvider.prototype.setFormat = function () {
    };
    /**
     * Gets the scaling factor of a measure
     * @param {string} sMeasureMember the Member of the Measure Structure
     * @param {string} sNonMeasureMember the Member of the Non Measure Structure
     * @return {int} the exponent of the scaling factor in Base 10
     * @public
     */
    DataProvider.prototype.getScalingFactor = function () {
    };
    /**
     * Sets the scaling factor of a measure/query cell
     * @param {int} nFactor the exponential of the scaling factor
     * @param {string} sMeasureMember the Member of the Measure Structure
     * @param {string} sNonMeasureMember the Member of the Non Measure Structure
     * @return {this} the DataProvider
     * @public
     */
    DataProvider.prototype.setScalingFactor = function () {
    };
    /**
     * Gets the scaling factor of a measure or data cell
     * @param {string} sMeasureMember the Member of the Measure Structure
     * @param {string} sNonMeasureMember the Member of the Non Measure Structure, if this is not given the value for the sMeasureMember is returned
     * @return {int} the current decimal places setting
     * @public
     */
    DataProvider.prototype.getDecimalPlaces = function () {
    };
    /**
     * Sets the number of decimal  of a measure/query cell
     * @param {int} nNumberOfDecimalPlaces number of the decimal palaces to be shown after the separator
     * @param {string} sMeasureMember the Member of the Measure Structure
     * @param {string} the Member of the Non Measure Structure, if this is not given the setting is applied for the whole sMeasureMember
     * @return {this} the DataProvider
     * @public
     */
    DataProvider.prototype.setDecimalPlaces = function () {
    };
    /**
     * suppress a unit/currency from being populated to the result cells
     * @param {string} sUnit the key of the suppressed unit
     * @return {this} the dataprovider to allow chaining
     * @public
     */
    DataProvider.prototype.suppressUnit = function () {
    };
    
    /**
     * Update the variable with given name from teh values from value help dialog
     * @param {string} sVar, sUnit the key of the suppressed unit
     * @return {object[]} aSelectedFdItems selection from selector dialog
     * @private
     */
    DataProvider.prototype.applySelectionToVariable = function () {
    };
  
    /**
     * Resets this data provider to the state after the metadata import
     * @public
     */
    DataProvider.prototype.resetToDefault = function () {
    };
    return DataProvider;
  }
);
