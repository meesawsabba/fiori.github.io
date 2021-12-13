/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)
        (c) Copyright 2009-2021 SAP SE. All rights reserved
    
 */
sap.ui.define(
	["sap/fe/core/TemplateComponent"],
	function(TemplateComponent) {
		"use strict";

		/**
		 * @class Component that can be used as a wrapper component for custom pages.
		 *
		 * The component can be used in case you want to use SAP Fiori elements Building Blocks or XML template
		 * constructions. You can either extend the component and set the viewName and contextPath within your code
		 * or you can use it to wrap your custom XML view directly the manifest when you define your custom page
		 * under sapui5/routing/targets:
		 *
		 * <pre>
		 * "myCustomPage": {
		 *	"type": "Component",
		 *	"id": "myCustomPage",
		 *	"name": "sap.fe.core.fpm",
		 *	"title": "My Custom Page",
		 *	"options": {
		 *		"settings": {
		 *			"viewName": "myNamespace.myView",
		 *			"contextPath": "/MyEntitySet"
		 *			}
		 *		}
		 *	}
		 * </pre>
		 *
		 * @name sap.fe.core.fpm.Component
		 * @hideconstructor
		 * @public
		 * @experimental As of version 1.92.0
		 * @since 1.92.0
		 */

		var FPMComponent = TemplateComponent.extend("sap.fe.core.fpm.Component", {
			metadata: {
				properties: {
					/**
					 * Name of the XML view which is used for this page. The XML view can contain SAP Fiori elements
					 * Building Blocks and XML template constructions.
					 */
					viewName: {
						type: "string"
					}
				},
				manifest: "json"
			}
		});
		return FPMComponent;
	},
	/* bExport= */ true
);
