/*!
 * SAPUI5
  (c) Copyright 2009-2021 SAP SE. All rights reserved
 */
/*global sap*/
/**
 * Initialization Code and shared classes of library sap.zen.dsh.
 */
sap.ui.define(
  [
    "sap/zen/dsh/NavigationCommandType",
    "sap/zen/dsh/Axis",
    "sap/zen/dsh/DataSourceType",
    "sap/zen/dsh/DimensionType",
    "sap/zen/dsh/SortType",
    "sap/zen/dsh/SortDirection",
    "sap/zen/dsh/DisplayType",
    "sap/zen/dsh/ComparisonOperator",
    "sap/zen/dsh/MemberType",
    "sap/zen/dsh/CellValueType",
    "sap/zen/dsh/ProtocolType",
    "sap/zen/dsh/ValueType",
    "sap/zen/dsh/SystemType",
    "sap/zen/dsh/SemanticRole",
    "sap/zen/dsh/WidgetType",
    "sap/zen/dsh/ValueHelpRangeOperation",
    "sap/zen/commons/thirdparty/lodash",
    "sap/zen/dsh/utils/dependencies",
    "sap/zen/dsh/utils/EmccLoader",
    "sap/ui/core/library",
    "sap/ui/layout/library",
    "sap/ui/table/library",
    "sap/m/library",
    "sap/ui/generic/app/library",
    "sap/zen/commons/library",
    "sap/zen/crosstab/library",
    "sap/ui/comp/library",
    "sap/m/library",
  ],
  function(
    NavigationCmdType, Axis, DataSourceType, DimType, SortType, SortDirection, DisplayType,
    ComparisonOperator, MemberType, CellValueType, ProtocolType, ValueType, SystemType, SemanticRole, WidgetType,
    ValueHelpRangeOperation
  ) {
    sap.ui.getCore().initLibrary(
      {
        name : "sap.zen.dsh",
        dependencies : [
          "sap.ui.core",
          "sap.ui.table",
          "sap.ui.layout",
          "sap.m",
          "sap.zen.commons",
          "sap.zen.crosstab",
          "sap.sac.grid"
        ],
        components:[
          "sap.zen.dsh.rsrt",
          "sap.zen.dsh.InACard"
        ],
        types: [
          "sap.zen.dsh.NavigationCmdType",
          "sap.zen.dsh.Axis",
          "sap.zen.dsh.CellValueType",
          "sap.zen.dsh.DimType",
          "sap.zen.dsh.DisplayType",
          "sap.zen.dsh.ProtocolType",
          "sap.zen.dsh.SortType",
          "sap.zen.dsh.SortDirection",
          "sap.zen.dsh.SystemType",
          "sap.zen.dsh.WidgetType",
          "sap.zen.dsh.DataSourceType",
          "sap.zen.dsh.ValueHelpRangeOperation"
        ],
        interfaces: [],
        controls: [
          "sap.zen.dsh.AnalyticGrid",
          "sap.zen.dsh.Dsh",
          "sap.zen.dsh.PivotTable",
          "sap.zen.dsh.InATile"
        ],
        models:[
          "sap.zen.dsh.olap.OlapModel"
        ],
        elements: [],
        noLibraryCSS: true,
        version: "1.96.0"
      }
    );
    /**
     * Design Studio Runtime Library.  Intended only to be used within S/4 HANA Fiori applications.
     *
     * @namespace
     * @name sap.zen.dsh
     * @public
     * @author SAP SE
     * @version 1.96.0
     */
    var thisLib = sap.zen.dsh;
    thisLib.Axis = Axis;
    thisLib.DimType = DimType;
    thisLib.DisplayType = DisplayType;
    thisLib.CellValueType = CellValueType;
    thisLib.NavigationCmdType = NavigationCmdType;
    thisLib.SortType = SortType;
    thisLib.SortDirection = SortDirection;
    thisLib.ComparisonOperator = ComparisonOperator;
    thisLib.ValueType = ValueType;
    thisLib.MemberType = MemberType;
    thisLib.ProtocolType=ProtocolType;
    thisLib.DataSourceType=DataSourceType;
    thisLib.SystemType=SystemType;
    thisLib.WidgetType=WidgetType;
    thisLib.SemanticRole=SemanticRole;
    thisLib.ValueHelpRangeOperation = ValueHelpRangeOperation;
    return sap.zen.dsh;
  }
);
