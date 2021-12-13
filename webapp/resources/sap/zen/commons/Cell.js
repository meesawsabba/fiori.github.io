/*
 * SAPUI5
  (c) Copyright 2009-2020 SAP SE. All rights reserved
 */
sap.ui.define("sap/zen/commons/Cell",["sap/ui/core/Element","sap/zen/commons/CellType"],function(E,C){"use strict";var c=E.extend("sap.zen.commons.Cell",{metadata:{library:"sap.zen.commons",properties:{displayValue:{type:"string"},cellType:{type:"sap.zen.commons.CellType",defaultValue:C.STANDARD},column:{type:"int",defaultValue:0},icon:{type:"string"},helpId:{type:"string"},valueState:{type:"sap.ui.core.ValueState"},row:{type:"int",defaultValue:0},displayLevel:{type:"int"},inputEnabled:{type:"boolean"},semanticClass:{"type":"string"},alertLevel:{type:"sap.zen.commons.AlertLevel"}}}});return c;});
