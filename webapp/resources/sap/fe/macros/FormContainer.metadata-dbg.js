/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)
        (c) Copyright 2009-2021 SAP SE. All rights reserved
    
 */

sap.ui.define(["./MacroMetadata"], function(MacroMetadata) {
	"use strict";

	/**
	 * @classdesc
	 * Building block for creating a FormContainer based on the provided OData V4 metadata.
	 *
	 *
	 * Usage example:
	 * <pre>
	 * &lt;macro:FormContainer
	 *   id="SomeId"
	 *   entitySet="{entitySet>}"
	 *   dataFieldCollection ="{dataFieldCollection>}"
	 *   title="someTitle"
	 *   navigationPath="{ToSupplier}"
	 *   visible=true
	 *   onChange=".handlers.onFieldValueChange"
	 * /&gt;
	 * </pre>
	 *
	 * @class sap.fe.macros.FormContainer
	 * @hideconstructor
	 * @private
	 * @experimental
	 */
	var FormContainer = MacroMetadata.extend("sap.fe.macros.FormContainer", {
		/**
		 * Name of the macro control.
		 */
		name: "FormContainer",
		/**
		 * Namespace of the macro control
		 */
		namespace: "sap.fe.macros",
		/**
		 * Fragment source of the macro (optional) - if not set, fragment is generated from namespace and name
		 */
		fragment: "sap.fe.macros.FormContainer",

		/**
		 * The metadata describing the macro control.
		 */
		metadata: {
			/**
			 * Defines macro stereotype used for documentation
			 */
			stereotype: "xmlmacro",
			/**
			 * Location of the designtime info
			 */
			designtime: "sap/fe/macros/FormContainer.designtime",
			/**
			 * Properties.
			 */
			properties: {
				/**
				 * Id of the FormContainer
				 */
				id: {
					type: "string"
				},
				/**
				 * Metadata path to the entity set
				 */
				entitySet: {
					type: "sap.ui.model.Context",
					required: true,
					$kind: ["EntitySet", "NavigationProperty"]
				},
				/**
				 * Metadata path to the dataFieldCollection
				 */
				dataFieldCollection: {
					type: "sap.ui.model.Context"
				},

				/**
				 * Control whether the form is in displayMode or not
				 */
				displayMode: {
					type: "boolean"
				},
				/**
				 * Title of the form container
				 */
				title: {
					type: "string"
				},
				/**
				 * Binding the form container using a navigation path
				 */
				navigationPath: {
					type: "string"
				},
				/**
				 * Binding the visibility of the form container using an expression binding or Boolean
				 */
				visible: {
					type: "string"
				},
				/**
				 * Flex designtime settings to be applied
				 */
				designtimeSettings: {
					type: "string",
					defaultValue: "sap/fe/macros/FormContainer.designtime"
				},
				actions: {
					type: "sap.ui.model.Context"
				}
			},

			events: {
				/**
				 * Change handler name
				 */
				onChange: {
					type: "function"
				}
			}
		}
	});

	return FormContainer;
});
