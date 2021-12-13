/*!
 * SAPUI5
  (c) Copyright 2009-2021 SAP SE. All rights reserved
 */
sap.ui.define("sap/zen/dsh/utils/PromiseQueue",["sap/base/Log","sap/zen/commons/thirdparty/lodash"],function(L,_){"use strict";function P(){var t=this;var p=Promise.resolve(null);t.addPromise=function(f){p=p.then(f).catch(function(e){L.error(e);});return p;};}return P;});
