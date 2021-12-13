/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)
        (c) Copyright 2009-2021 SAP SE. All rights reserved
    
 */

sap.ui.define(
	[
		"./MacroMetadata",
		"sap/fe/macros/internal/helpers/DataPointTemplating",
		"sap/fe/core/converters/MetaModelConverter",
		"sap/fe/core/templating/CriticalityFormatters"
	],
	function(MacroMetadata, DatapointTemplating, MetaModelConverter, CriticalityFormatters) {
		"use strict";

		/**
		 * @classdesc
		 * Building block used specifically in an app using the flexible column layout to add the ‘expand’, ‘reduce’, and ‘close’ action buttons.
		 *
		 * Usage example:
		 * <pre>
		 * &lt;f:DynamicPageTitle id="incidentProcessFlowDynamicPageTitle"&gt;
		 *	 &lt;f:navigationActions&gt;
		 *	   &lt;macros:FlexibleColumnLayoutActions /&gt;
		 *	 &lt;/f:navigationActions&gt;
		 * &lt;/f:DynamicPageTitle&gt;
		 * &lt;macro:FlexibleColumnLayoutActions /&gt;
		 * </pre>
		 *
		 * @class sap.fe.macros.FlexibleColumnLayoutActions
		 * @hideconstructor
		 * @public
		 * @since 1.93.0
		 */

		var FlexibleColumnLayoutActions = MacroMetadata.extend("sap.fe.macros.FlexibleColumnLayoutActions", {
			/**
			 * Name of the macro control.
			 */
			name: "FlexibleColumnLayoutActions",
			/**
			 * Namespace of the macro control
			 */
			namespace: "sap.fe.macros",
			publicNamespace: "sap.fe.macros",
			publicName: "FlexibleColumnLayoutActions",
			/**
			 * Fragment source of the macro (optional) - if not set, fragment is generated from namespace and name
			 */
			fragment: "sap.fe.macros.FlexibleColumnLayoutActions",
			/**
			 * The metadata describing the macro control.
			 */
			metadata: {
				/**
				 * Defines the macro stereotype used in documentation.
				 */
				stereotype: "xmlmacro",
				/**
				 * Properties.
				 */
				properties: {}
			}
		});
		return FlexibleColumnLayoutActions;
	}
);
