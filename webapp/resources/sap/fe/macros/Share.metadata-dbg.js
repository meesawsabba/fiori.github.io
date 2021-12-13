/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)
        (c) Copyright 2009-2021 SAP SE. All rights reserved
    
 */

sap.ui.define(["./MacroMetadata"], function(MacroMetadata) {
	"use strict";

	/**
	 * @classdesc
	 * Building block used to create the ‘Share’ functionality.
	 * <br>
	 * Please note that the 'Share in SAP Jam' option is only available on platforms that are integrated with SAP Jam.
	 * <br>
	 * If you are consuming this macro in an environment where the SAP Fiori launchpad is not available, then the 'Save as Tile' option is not visible.
	 *
	 *
	 * Usage example:
	 * <pre>
	 * &lt;macro:Share
	 * 	id="someID"
	 *	visible="true"
	 * /&gt;
	 * </pre>
	 *
	 * @class sap.fe.macros.Share
	 * @hideconstructor
	 * @public
	 * @since 1.93.0
	 */
	var Share = MacroMetadata.extend("sap.fe.macros.Share", {
		/**
		 * Name of the macro control.
		 */
		name: "Share",
		/**
		 * Namespace of the macro control
		 */
		namespace: "sap.fe.macros.internal",
		publicNamespace: "sap.fe.macros",
		publicName: "Share",
		/**
		 * Fragment source of the macro (optional) - if not set, fragment is generated from namespace and name
		 */
		fragment: "sap.fe.macros.Share",
		/**
		 * The metadata describing the macro control.
		 */
		metadata: {
			/**
			 * Defines the macro stereotype used for documentation
			 */
			stereotype: "xmlmacro",
			/**
			 * Properties.
			 */
			properties: {
				/**
				 * The identifier of the share control.
				 */
				id: {
					type: "string",
					required: true,
					isPublic: true
				},
				/**
				 * Whether the share macro is visible or not.
				 */
				visible: {
					type: "boolean",
					defaultValue: true,
					isPublic: true
				},
				/**
				 * Whether the share shortcut exists or not.
				 */
				shortCutExists: {
					type: "boolean",
					defaultValue: false,
					isPublic: false
				}
			},

			events: {}
		}
	});

	return Share;
});
