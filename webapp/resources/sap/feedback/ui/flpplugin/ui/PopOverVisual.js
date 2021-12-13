/*!
 * SAPUI5

		(c) Copyright 2009-2020 SAP SE. All rights reserved
	
 */
sap.ui.define(["sap/ui/base/Object","../utils/Utils"],function(O,U){"use strict";return O.extend("sap.feedback.ui.flpplugin.ui.PopOverVisual",{constructor:function(){},show:function(){QSI.API.unload();QSI.API.load().then(function(){this._clickButton();}.bind(this));},_clickButton:function(){var h=U.getTriggerButton();if(h){h.click();}}});});
