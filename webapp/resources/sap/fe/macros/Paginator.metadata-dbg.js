/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)
        (c) Copyright 2009-2021 SAP SE. All rights reserved
    
 */

sap.ui.define(["./MacroMetadata", "sap/fe/core/converters/MetaModelConverter"], function(MacroMetadata, MetaModelConverter) {
	"use strict";

	/**
	 * @classdesc
	 * Building block used to create a paginator control.
	 *
	 * Usage example:
	 * <pre>
	 * &lt;macro:Paginator /&gt;
	 * </pre>
	 *
	 * @class sap.fe.macros.Paginator
	 * @hideconstructor
	 * @public
	 * @since 1.94.0
	 */

	var Paginator = MacroMetadata.extend("sap.fe.macros.Paginator", {
		/**
		 * Name of the building block control.
		 */
		name: "Paginator",
		/**
		 * Namespace of the building block control
		 */
		namespace: "sap.fe.macros.internal",
		publicNamespace: "sap.fe.macros",
		publicName: "Paginator",
		/**
		 * Fragment source of the macro (optional) - if not set, fragment is generated from namespace and name
		 */
		fragment: "sap.fe.macros.Paginator",
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
			properties: {
				/**
				 * The identifier of the Paginator control.
				 */
				id: {
					type: "string",
					isPublic: true
				},
				/**
				 * The identifier to get the tooltip for the paginator buttons
				 */
				templateResourceBundle: {
					type: "boolean",
					defaultValue: true
				}
			}
		}
	});
	return Paginator;
});
