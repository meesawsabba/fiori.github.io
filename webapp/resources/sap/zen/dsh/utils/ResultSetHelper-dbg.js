/*
 * SAPUI5
  (c) Copyright 2009-2021 SAP SE. All rights reserved
 */
/*global sap*/
sap.ui.define(
  "sap/zen/dsh/utils/ResultSetHelper",
  [
    "sap/base/Log",
    "sap/zen/dsh/ValueType",
    "sap/zen/dsh/utils/ListHelper",
    "sap/zen/dsh/MemberType",
    "sap/zen/dsh/utils/ResourceBundle",
    "sap/zen/commons/thirdparty/lodash"
  ],
  function (Log, ValueType, ListHelper, MemberType,ResourceBundle, _) {
    "use strict";
    Log.info("ResultSetHelper loaded");
    function ResultSetHelper() {
      var that = this;
      that.dimensionMembersToList = function (oDim, oResultSet) {
        if (!oResultSet) {
          return null;
        }
        return _.filter(
          _.map(
            ListHelper.arrayFromIter(
              oResultSet.getAxis(oDim.getAxisType()).getTuplesIterator()
            ),
            function (o) {
              var oTE = o.getTupleElementByDimension(oDim);
              var oE = oTE && oTE.getDimensionMember();
              return oE ? {
                Name: oDim.isStructure() && oDim.getAllStructureMembers().getByKey(oE.getName()).getFieldValue(oDim.getDisplayKeyField()) ? oDim.getAllStructureMembers().getByKey(oE.getName()).getFieldValue(oDim.getDisplayKeyField()).getValue().getString() : oE.getName(),
                TechName: oE.getName(),
                Description: oE.getText()
              } : null;
            }
          ), _.identity);
      };
      that.tupleToObject = function (oTuple) {
        return _.reduce(
          oTuple.getElements().getListFromImplementation(),
          function (oC, oElement) {
            var sName = oElement.getDimensionMember().getName();
            oC[oElement.getDimension().getExternalName() || oElement.getDimension().getName()] = sName;
            return oC;
          }, {}
        );
      };
      that.flatten = function (oResultSet, oDP) {
        var oKyf = {};
        var oDim = {};
        var oMeasureDimension = (oDP.Chart.valDimension && (function(){
          return oResultSet.getQueryModel().getDimensionByName(
            oDP.Dimensions[oDP.Chart.valDimension].TechName);
        }())) || oResultSet.getQueryModel().getMeasureDimension();
        function tupleToList(oTuple) {
          return {
            tuple: oTuple,
            member: _.reduce(
              oTuple.getElements().getListFromImplementation(),
              function (oC, oElement) {
                var oKF1 =  oElement.getDimensionMember().getDimension().getKeyField();
                var oKF =  oElement.getDimensionMember().getDimension().getDisplayKeyField() || oKF1;
                var oTF = oElement.getDimensionMember().getDimension().getTextField() || oKF;
                if (oElement.getDimension() != oMeasureDimension) {
                  if (oC && oElement.getDimensionMember().getMemberType().getName() == MemberType.Member) {
                    var sDN = oElement.getDimension().getExternalName()||oElement.getDimension().getName();
                    oDim[sDN] = {
                      Name: sDN,
                      Description: oElement.getDimensionMember().getFieldValue(oTF).getString()
                    };
                    oC[sDN] = oElement.getDimensionMember().getFieldValue(oTF).getString();
                    return oC;
                  } else {
                    return oC;
                  }
                } else {
                  if(oElement.getDimension().isStructure()){
                    var oDMKFV =oElement.getDimensionMember().getKeyFieldValue();
                    if(oDMKFV){
                      var oSTM = oElement.getDimension().getStructureMemberByKey(
                        oDMKFV.getString()
                      ).getFieldValue(oKF) || oElement.getDimension().getStructureMemberByKey(
                        oDMKFV.getString()
                      ).getFieldValue(oKF1);
                      if( oSTM ){
                        oTuple.kyf = oSTM.getString();
                      }else{
                        Log.error("Structure member has no string represenation");
                      }
                    } else {
                      Log.error("Structure member has no string represenation");
                    }
                  }
                  else{
                    oTuple.kyf = oElement.getDimensionMember().getFieldValue(oKF).getString();
                  }
                  oKyf[oTuple.kyf]={
                    Name: oTuple.kyf,
                    Description:oElement.getDimensionMember().getFieldValue(oTF) ? oElement.getDimensionMember().getFieldValue(oTF).getString() :oTuple.kyf
                  };
                  return oC;
                }
              }
              , {}
            )
          };
        }
        function axisToTupleList(oAxis) {
          return _.map(
            ListHelper.arrayFromIter(
              oAxis.getTuplesIterator()
            ),
            tupleToList
          );
        }
        var aColTuples = _.filter(
          axisToTupleList(oResultSet.getColumnsAxis()), "member"
        );
        var aRowTuples =  _.filter(
          axisToTupleList(oResultSet.getRowsAxis()), "member"
        );
        var aFlatList = aRowTuples.length > 0 ? _.flatten(
          _.map(
            aRowTuples,
            function (oR) {
              return _.map(
                aColTuples,
                function (oC) {
                  var oRes = _.assign(_.clone(oR.member), oC.member);
                  var oDC = oResultSet.getDataCellByTuples(oC.tuple, oR.tuple);
                  if(oDC){
                    if (oDC.getDataCell()) {
                      if (oMeasureDimension) {
                        var oE1 = oDC.getDataCell().getReferenceStructureElement1();
                        var oE2 = oDC.getDataCell().getReferenceStructureElement2();
                        var s1 = (oE1 ? (oE1.getFieldValue(oE1.getDimension().getDisplayKeyField()) ? oE1.getFieldValue(oE1.getDimension().getDisplayKeyField()).getString() : oE1.getName()) : null);
                        var s2 = (oE2 ? (oE2.getFieldValue(oE2.getDimension().getDisplayKeyField()) ? oE2.getFieldValue(oE2.getDimension().getDisplayKeyField()).getString() : oE2.getName()) : null);
                        oRes[s1 || s2] = !(oDC.getValueException() === sap.firefly.ValueException.NULL_VALUE
                                           || oDC.getValueException() === sap.firefly.ValueException.UNDEFINED ) ? oDC.getValue() :0;
                      }
                    }else if( (oR.tuple && oR.tuple.kyf ) || (oC.tuple.kyf && oC.tuple.kyf)){
                      oRes[
                        (oR.tuple && oR.tuple.kyf ) || (oC.tuple.kyf && oC.tuple.kyf)
                      ] = !(
                        oDC.getValueException() === sap.firefly.ValueException.NULL_VALUE  ||
                          oDC.getValueException() === sap.firefly.ValueException.UNDEFINED
                      ) ? oDC.getValue() :0;
                    }
                  }
                  return oRes;
                }
              );
            }
          )
        ) : (aColTuples.length>0?_.map(
          aColTuples,
          function (oC) {
            var oRes = _.clone(oC.member);
            var oDC = oResultSet.getDataCell(oC.tuple.getAxisIndex(),0);
            if(oDC){
              if (oDC.getDataCell()) {
                if (oMeasureDimension) {
                  var oE1 = oDC.getDataCell().getReferenceStructureElement1();
                  var oE2 = oDC.getDataCell().getReferenceStructureElement2();
                  var s1 = (oE1 ? (oE1.getFieldValue(oE1.getDimension().getDisplayKeyField()) ? oE1.getFieldValue(oE1.getDimension().getDisplayKeyField()).getString() : oE1.getName()) : null);
                  var s2 = (oE2 ? (oE2.getFieldValue(oE2.getDimension().getDisplayKeyField()) ? oE2.getFieldValue(oE2.getDimension().getDisplayKeyField()).getString() : oE2.getName()) : null);
                  oRes[s1 || s2] = oDC.getValueException() !== sap.firefly.ValueException.NULL_VALUE ? oDC.getValue() :0;
                }
              }else if(  (oC.tuple.kyf && oC.tuple.kyf)){
                oRes[  (oC.tuple.kyf && oC.tuple.kyf)] = oDC.getValueException() !== sap.firefly.ValueException.NULL_VALUE ? oDC.getValue() :0;
              }
            }
            return oRes;
          }
        ):[]);
        return {
          FlatResultSet: aFlatList,
          Measures: _.map(oKyf,_.identity),
          Dimensions: _.map(oDim,_.identity)
        };
      };
      function barChartFeeds(aD, aM, oChart) {
        if (aD.length < 1 || aM.length < 1) {
          return {
            Messages: [{
              msgText: ResourceBundle.getText(
                "CHARTTYPE_NEEDS_SUPPORTED",
                [1, 1]
              )
            }]
          };
        }
        return {
          Feeds: [
            {
              uid: "categoryAxis",
              type: "Dimension",
              values: [
                oChart.catDimension || aD[0].Name
              ]
            },
            {
              uid: "valueAxis",
              type: "Measure",
              values: _.map(
                aM,
                function (o) {
                  return o.Name;
                }
              )
            }
          ]
        };
      }
      function pieChartFeeds(aD, aM) {
        return (aD.length < 1 || aM.length < 1) ? {
          Messages: [{
            msgText: ResourceBundle.getText(
              "CHARTTYPE_NEEDS_SUPPORTED",
              [1, 1]
            )
          }]
        } : {
          Feeds: [
            {
              uid: "color",
              type: "Dimension",
              values: [aD[0].Name]
            },
            {
              uid: "size",
              type: "Measure",
              values: [aM[0].Name]
            }
          ]
        };
      }
      function heatMapChartFeeds(aD, aM,oChart) {
        if ( aD.length < 2 || aM.length < 1) {
          return {
            Messages: [
              {
                msgText: ResourceBundle.getText(
                  "CHARTTYPE_NEEDS_SUPPORTED",
                  [1, 1]
                )
              }
            ]
          };
        }
        var aF = [
          {
            uid: "categoryAxis",
            type: "Dimension",
            values: [oChart.catDimension || aD[0].Name]
          },
          {
            uid: "color",
            type: "Measure",
            values: [aM[0].Name]
          }
        ];
        if (oChart.cat2Dimension) {
          aF.push({
            uid: "categoryAxis2",
            type: "Dimension",
            values: [oChart.cat2Dimension]
          });
        }
        return {
          Feeds: aF
        };
      }
      function stackedBarChartFeeds(aD, aM, oChart) {
        return (aD.length < 1 || aM.length < 1) ? {
          Messages: [
            {
              msgText: ResourceBundle.getText(
                "CHARTTYPE_NEEDS_SUPPORTED",
                [2, 1]
              )
            }
          ]
        } : {
          Feeds:[
            {
              uid: "valueAxis",
              type: "Measure",
              values: [aM[0].Name]
            },
            {
              uid: "categoryAxis",
              type: "Dimension",
              values: [oChart.catDimension || aD[0].Name]
            },{
              uid: "color",
              type: "Dimension",
              values: [oChart.colDimension]
            }
          ]
        };
      }
      function bubbleChartFeeds(aD, aM) {
        return (aD.length < 1 || aM.length < 3) ? {
          Messages: [
            {
              msgText: ResourceBundle.getText(
                "CHARTTYPE_NEEDS_SUPPORTED",
                [1, 3]
              )
            }
          ]
        } : {
          Feeds:[
            {
              uid: "valueAxis",
              type: "Measure",
              values: [aM[0].Name]
            },
            {
              uid: "valueAxis2",
              type: "Measure",
              values: [aM[1].Name]
            },
            {
              uid: "bubbleWidth",
              type: "Measure",
              values: [aM[2].Name]
            }, {
              uid: "color",
              type: "Dimension",
              values: [aD[0].Name]
            }
          ]
        };
      }
      function treeMapChartFeeds(aD, aM) {
        return (aD.length < 2 || aM.length < 3) ? {
          Messages: [
            {
              msgText: ResourceBundle.getText(
                "CHARTTYPE_NEEDS_SUPPORTED",
                [2, 2]
              )
            }
          ]
        } : {
          Feeds:[
            {
              uid: "title",
              type: "Dimension",
              values: [aD[0].Name]
            },
            {
              uid: "title",
              type: "Dimension",
              values: [aD[1].Name]
            },
            {
              uid: "color",
              type: "Measure",
              values: [aM[0].Name]
            },
            {
              uid: "weight",
              type: "Measure",
              values: [aM[1].Name]
            }
          ]
        };
      }
      function scatterChartFeeds(aD, aM) {
        return (aD.length < 1 || aM.length < 2) ? {
          Messages: [
            {
              msgText: ResourceBundle.getText(
                "CHARTTYPE_NEEDS_SUPPORTED",
                [1, 2]
              )
            }
          ]
        } : {
          Feeds:[
            {
              uid: "valueAxis",
              type: "Measure",
              values: [aM[0].Name]
            },
            {
              uid: "valueAxis2",
              type: "Measure",
              values: [aM[1].Name]
            },
            {
              uid: "color",
              type: "Dimension",
              values: [aD[0].Name]
            }
          ]};
      }
      function waterfallChartFeeds(aD, aM) {
        return (aD.length < 2 || aM.length < 1) ? {
          Messages: [{
            msgText: ResourceBundle.getText(
              "CHARTTYPE_NEEDS_SUPPORTED",
              [2, 1]
            )
          }]
        } : {Feeds:[
          {
            uid: "valueAxis",
            type: "Measure",
            values: [aM[0].Name]
          },
          {
            uid: "categoryAxis",
            type: "Dimension",
            values: [aD[0].Name]
          },
          {
            uid: "waterfallType",
            type: "Dimension",
            values: [aD[1].Name]
          }
        ]};
      }
      function lineChartFeeds(aD, aM) {
        return (aD.length < 1) ? {
          Messages: [{
            msgText: ResourceBundle.getText(
              "CHARTTYPE_NEED_SUPPORTED",
              [1]
            )
          }]
        } : {
          Feeds:[
            {
              uid: "categoryAxis",
              type: "Dimension",
              values: [
                aD[0].Name
              ]
            },
            {
              uid: "valueAxis",
              type: "Measure",
              values: _.map(
                aM,
                function (o) {
                  return o.Name;
                }
              )
            }
          ]};
      }
      function timeLineChartFeeds(aD, aM) {
        return (aD.length < 1) ? {
          Messages: [
            {
              msgText: ResourceBundle.getText( "CHARTTYPE_NEED_SUPPORTED",[1])
            }
          ]
        } : {
          Feeds: [
            {
              uid: "timeAxis",
              type: "Dimension",
              values: [
                aD[0].Name
              ]
            },
            {
              uid: "valueAxis",
              type: "Measure",
              values: _.map(
                aM,
                function (o) {
                  return o.Name;
                }
              )
            }
          ]
        };
      }
      function verticalBulletChartFeeds(aD, aM) {
        if (aD.length < 1 || aM.length < 3 && aM.length < 2) {
          return {
            Messages: [{
              msgText: ResourceBundle.getText(
                "CHARTTYPE_NEEDS_SUPPORTED",
                [1, 2]
              )
            }]
          };
        }
        var aF = [
          {
            uid: "actualValues",
            type: "Measure",
            values: [aM[0].Name]
          },
          {
            uid: "targetValues",
            type: "Measure",
            values: [aM[1].Name]
          },
          {
            uid: "categoryAxis",
            type: "Dimension",
            values: [aD[0].Name]
          }
        ];
        if (aM.length > 2) {
          aF.push({
            uid: "additionalValues",
            type: "Measure",
            values: [aM[2].Name]
          });
        }
        return {
          Feeds:
          aF
        };
      }
      that.calculateFeeds = function calculateFeeds(sChartType, aD, aM, oChart) {
        switch (sChartType) {
        case "bar":
          return barChartFeeds(aD, aM, oChart);
        case "column":
          return barChartFeeds(aD, aM,oChart);
        case "bubble":
          return bubbleChartFeeds(aD, aM);
        case "stacked_column":
          return stackedBarChartFeeds(aD, aM, oChart);
        case "pie":
          return pieChartFeeds(aD, aM);
        case "donut":
          return pieChartFeeds(aD, aM);
        case "stacked_bar":
          return stackedBarChartFeeds(aD, aM,oChart);
        case "vertical_bullet":
          return verticalBulletChartFeeds(aD, aM);
        case "horizontal_bullet":
          return verticalBulletChartFeeds(aD, aM);
        case "heatmap":
          return heatMapChartFeeds(aD, aM, oChart);
        case "line":
          return lineChartFeeds(aD, aM);
        case "time_line":
          return timeLineChartFeeds(aD, aM);
        case "scatter":
          return scatterChartFeeds(aD, aM);
        case "waterfall":
          return waterfallChartFeeds(aD, aM);
        case "horizontal_waterfall":
          return waterfallChartFeeds(aD, aM);
        case "treemap":
          return treeMapChartFeeds(aD, aM);
        default:
          return {
            Messages: [
              {
                msgText: ResourceBundle.getText(
                  "CHARTTYPE_NOT_SUPPORTED",
                  [sChartType])
              }
            ]
          };
        }
      };
      that.transformVariable = function (oVariable) {
        return {
          Name: oVariable.getNameExternal() || oVariable.getName(),
          Dimension: oVariable.getDimension && oVariable.getDimension() && (oVariable.getDimension().getExternalName() || oVariable.getDimension().getName()),
          ValueType: oVariable.getValueType().getName(),
          VariableType: oVariable.getVariableType().getName(),
          Description: oVariable.getText(),
          Mandatory: oVariable.isMandatory(),
          SupportsMultipleValues: oVariable.supportsMultipleValues(),
          TechName: oVariable.getName(),
          InputEnabled: oVariable.isInputEnabled(),
          Position: oVariable.getVariableOrder(),
          SupportsValueHelp: oVariable.supportsValueHelp && oVariable.supportsValueHelp(),
          Hints: {
            IsDate: oVariable.getValueType().getName() === ValueType.Date,
            IsNoDate: oVariable.getValueType().getName() !== ValueType.Date
          },
          MemberFilter: oVariable.getMemberFilter ? _.map(
            ListHelper.arrayFromList(oVariable.getMemberFilter()),
            function (oValue) {
              var oDim = oValue.getDimension();
              var sTextLow = oDim && oDim.getTextField() && oValue.getLow().getSupplementValueString(
                oValue.getDimension().getTextField().getName()
              ) ? oValue.getLow().getSupplementValueString( oValue.getDimension().getTextField().getName() ) : oValue.getLow().getString();
              var sTextHigh = oDim && oDim.getTextField() && oValue.getHigh().getSupplementValueString(
                oValue.getDimension().getTextField().getName()
              ) ? oValue.getHigh().getSupplementValueString(oValue.getDimension().getTextField().getName()) : oValue.getHigh().getString();
              var sText = sTextHigh ? [sTextLow, sTextHigh].join(" - ") : sTextLow;
              if (oValue.getSetSign() === sap.firefly.SetSign.EXCLUDING) {
                sText = "!( " + sText + ")";
              }
              return {
                Low: oValue.getLow().getString(),
                High: oValue.getHigh().getString(),
                ComparisonOperator: oValue.getComparisonOperator().getName(),
                Text: sText,
                IsExcluding: oValue.getSetSign().getName()
              };
            }
          ) : (function () {
            var s = oVariable.getValueByString();
            if (!s) {
              return [];
            }
            return [{
              Low: s,
              ComparisionOperator: "EQUAL",
              Text: s,
              IsExcluding: false
            }];
          }())
        };
      };
    }
    return new ResultSetHelper;
  }
);
