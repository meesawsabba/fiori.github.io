/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)
        (c) Copyright 2009-2021 SAP SE. All rights reserved
    
 */
sap.ui.define(
	["sap/fe/macros/table/delegates/TableDelegate", "sap/fe/macros/table/delegates/ALPTableDelegateBaseMixin"],
	function(TableDelegate, ALPTableDelegateBaseMixin) {
		"use strict";

		/**
		 * Helper class for sap.ui.mdc.Table.
		 * <h3><b>Note:</b></h3>
		 * The class is experimental and the API/behaviour is not finalised and hence this should not be used for productive usage.
		 *
		 * @author SAP SE
		 * @private
		 * @experimental
		 * @since 1.69
		 * @alias sap.fe.macros.ALPTableDelegate
		 */

		var ALPTableDelegate = Object.assign({}, TableDelegate, ALPTableDelegateBaseMixin, {
			_getDelegateParentClass: function() {
				return TableDelegate;
			}
		});

		return ALPTableDelegate;
	},
	/* bExport= */ false
);
