/*!
 * SAPUI5
  (c) Copyright 2009-2021 SAP SE. All rights reserved
 */
sap.ui.define(["sap/base/Log","sap/zen/dsh/utils/BaseHandler"],function(L){"use strict";L.info("Loaded ChartException");function C(s,l){this.name="Unexpected error";this.message=s;this.longMessage=l;}C.prototype=new Error();C.prototype.constructor=C;return C;});
