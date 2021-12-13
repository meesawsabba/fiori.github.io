/*!
 * SAPUI5

		(c) Copyright 2009-2021 SAP SE. All rights reserved
	
 */
sap.ui.define(["sap/esh/search/ui/eventlogging/EventConsumer"],function(E){"use strict";var m=function(){this.init.apply(this,arguments);};m.prototype=jQuery.extend(new E(),{init:function(s){this.sinaNext=s;},logEvent:function(e){this.sinaNext.logUserEvent(e);},});return m;});
