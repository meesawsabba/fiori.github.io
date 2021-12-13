/*!
 * SAPUI5
  (c) Copyright 2009-2021 SAP SE. All rights reserved
 */
/*global sap */
sap.ui.define(
  "sap/zen/dsh/ValueType",
  [
  ],
  function(){
    /**
     * Sort Type
     *
     * @enum {string}
     * @alias sap.zen.dsh.ValueType
     * @public
     */
    var ValueType = {
      /**
       * Amount
       * @public
       **/
      Amount: "Amount",
      /**
       * Array
       * @public
       **/
      Array: "Array",
      /**
       * Boolean
       * @public
       **/
      Boolean: "Boolean",
      /**
       * Byte Array
       * @public
       **/
      ByteArray: "ByteArray",
      /**
       * Calendar Date
       * @public
       **/
      CalendarDate: "CalendarDate",
      /**
       * Calendar Day
       * @public
       **/
      CalendarDay: "CalendarDay",
      /**
       * Character
       * @public
       **/
      Char: "Char",
      /**
       * Currency
       * @public
       **/
      Cuky: "Cuky",
      /**
       * Current Member
       * @public
       **/
      CurrentMember: "CurrentMember",
      /**
       * Date
       * @public
       **/
      Date: "Date",
      /**
       * Date Time
       * @public
       **/
      DateTime: "DateTime",
      /**
       * Decimal Float
       * @public
       **/
      DecimalFloat: "DecimalFloat",
      /**
       * Dimension Member
       * @public
       **/
      DimensionMember: "DimensionMember",
      /**
       * Double
       * @public
       **/
      Double: "Double",
      /**
       * Enum Constant
       * @public
       **/
      EnumConstant: "EnumConstant",
      /**
       * Integer
       * @public
       **/
      Integer: "Integer",
      /**
       * Key Value
       * @public
       **/
      KeyValue: "KeyValue",
      /**
       * Language
       * @public
       **/
      Language: "Language",
      /**
       * Line String
       * @public
       **/
      LineString: "LineString",
      /**
       * List
       * @public
       **/
      List: "List",
      /**
       * Long
       * @public
       **/
      Long: "Long",
      /**
       * Lower Case String
       * @public
       **/
      LowerCaseString: "LowerCaseString",
      /**
       * Multi Line String
       * @public
       **/
      MultiLineString: "MultiLineString",
      /**
       * Multi Point
       * @public
       **/
      MultiPoint: "MultiPoint",
      /**
       * Multi Polygon
       * @public
       **/
      MultiPolygon: "MultiPolygon",
      /**
       * Number
       * @public
       **/
      Number: "Number",
      /**
       * Numeric Character
       * @public
       **/
      Numc: "Numc",
      /**
       * Object
       * @public
       **/
      Object: "Object",
      /**
       * Option List
       * @public
       **/
      OptionList: "OptionList",
      /**
       * Option Value
       * @public
       **/
      OptionValue: "OptionValue",
      /**
       * Percent
       * @public
       **/
      Percent: "Percent",
      /**
       * Point
       * @public
       **/
      Point: "Point",
      /**
       * Polygon
       * @public
       **/
      Polygon: "Polygon",
      /**
       * Price
       * @public
       **/
      Price: "Price",
      /**
       * Properties
       * @public
       **/
      Properties: "Properties",
      /**
       * Quantitiy
       * @public
       **/
      Quantity: "Quantity",
      /**
       * String
       * @public
       **/
      String: "String",
      /**
       * Structure
       * @public
       **/
      Structure: "Structure",
      /**
       * Structure List
       * @public
       **/
      StructureList: "StructureList",
      /**
       * Time
       * @public
       **/
      Time: "Time",
      /**
       * Time Span
       * @public
       **/
      TimeSpan: "TimeSpan",
      /**
       * Color
       * @public
       **/
      UiColor: "UiColor",
      UiConstant: "UiConstant",
      UiControl: "UiControl",
      UiPosition: "UiPosition",
      UiSize: "UiSize",
      UiUnitValue: "UiUnitValue",
      /**
       * Unit
       * @public
       **/
      Unit: "Unit",
      Unsupported: "Unsupported",
      UpperCaseString: "UpperCaseString",
      /**
       * URI
       * @public
       **/
      Uri: "Uri",
      Variable: "Variable"
    };
    return ValueType;
  }
);
