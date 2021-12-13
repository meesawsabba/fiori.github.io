/*!
 * SAPUI5
 * (c) Copyright 2009-2021 SAP SE. All rights reserved.
 */
sap.ui.define(["sap/ui/fl/changeHandler/MoveControls"],function(M){"use strict";var a=Object.assign({},M);a.applyChange=function(c,C,p){var m=Object.assign({},p,{targetAggregation:"groupElements",sourceAggregation:"groupElements"});return M.applyChange.call(this,c,C,m);};a.getCondenserInfo=function(c){var C=M.getCondenserInfo.call(this,c);C.targetAggregation="groupElements";return C;};return a;},true);
