/*
 * SAPUI5
  (c) Copyright 2009-2021 SAP SE. All rights reserved
 */
sap.ui.define("sap/zen/dsh/utils/Utilities",["sap/ui/core/Component","sap/zen/commons/thirdparty/lodash","sap/zen/dsh/dialogs/Component"],function(C,_){"use strict";var U=function(){var t=this;t.getDialogs=_.constant(C.create({name:"sap.zen.dsh.dialogs"}).then(function(o){return o.loaded();}).then(_.identity));t.trunc=Math.trunc||function(x){return isNaN(x)?NaN:(x>0?Math.floor(x):Math.ceil(x));};};return new U();});
