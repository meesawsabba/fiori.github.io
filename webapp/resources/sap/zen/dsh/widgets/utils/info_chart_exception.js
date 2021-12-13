/*
 * SAPUI5
  (c) Copyright 2009-2021 SAP SE. All rights reserved
 */
sap.ui.define(["jquery.sap.global","sap/zen/dsh/utils/BaseHandler"],function(){"use strict";function I(k,c){if(!(this instanceof I)){return new I(k,c);}this.message=k;this.context=c;if(Error.captureStackTrace){Error.captureStackTrace(this,this.constructor);}return null;}I.prototype=new Error();I.prototype.constructor=I;I.prototype.name="InfoChartException";return I;});
