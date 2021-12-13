/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)
        (c) Copyright 2009-2021 SAP SE. All rights reserved
    
 */
sap.ui.define([], function() {
	"use strict";

	return {
		setCreationMode: function(bCreationMode) {
			var oUIModelContext = this.base.getView().getBindingContext("ui");
			oUIModelContext.getModel().setProperty("createMode", bCreationMode, oUIModelContext, true);
			if (this.getProgrammingModel() === "Sticky") {
				oUIModelContext.getModel().setProperty("createModeSticky", this.getTransactionHelper()._bCreateMode, oUIModelContext, true);
			}
		}
	};
});
