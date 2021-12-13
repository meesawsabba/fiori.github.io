/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)

        (c) Copyright 2009-2015 SAP SE. All rights reserved
    
 */

// Provides control sap.ui.vk.tools.DuplicateSvgHotspotTool
sap.ui.define([
	"sap/base/Log",
	"../library",
	"./Tool",
	"./DuplicateSvgHotspotToolHandler",
	"./DuplicateSvgHotspotToolGizmo"
], function(
	Log,
	vkLibrary,
	Tool,
	DuplicateSvgHotspotToolHandler,
	DuplicateSvgHotspotToolGizmo
) {
	"use strict";

	/**
	 * Constructor for a new DuplicateSvgHotspotTool.
	 *
	 * @class
	 * The DuplicateSvgHotspotTool allows applications to duplicate svg hotspots.

	 * @param {string} [sId] ID of the new tool instance. <code>sId</code>is generated automatically if no non-empty ID is given.
	 *                       Note: this can be omitted, regardless of whether <code>mSettings</code> will be provided or not.
	 * @param {object} [mSettings] An optional map/JSON object with initial property values, aggregated objects etc. for the new tool instance.
	 * @public
	 * @author SAP SE
	 * @version 1.96.0
	 * @extends sap.ui.vk.tools.Tool
	 * @alias sap.ui.vk.tools.DuplicateSvgHotspotTool
	 */
	var DuplicateSvgHotspotTool = Tool.extend("sap.ui.vk.tools.DuplicateSvgHotspotTool", /** @lends sap.ui.vk.tools.DuplicateSvgHotspotTool.prototype */ {
		metadata: {
			properties: {
				/**
				 * Parent node for new elements.
				 */
				parentNode: {
					type: "any",
					defaultValue: null
				},
				/**
				 * Defines a list of nodes to be duplicated.
				 */
				nodeList: {
					type: "any[]",
					defaultValue: []
				}
			},
			events: {
				/**
				 * Fired when the duplicated nodes are created.
				 */
				nodesCreated: {
					parameters: {
						/**
						 * Offset in x direction
						 */
						x: "float",
						/**
						 * Offset in y direction
						 */
						y: "float",
						/**
						 * Created nodes.
						 */
						nodes: "any[]",
						/**
						 * Request payload for a storage server to create a parametric primitive.
						 */
						request: "object"
					}
				}
			}
		},

		constructor: function(sId, mSettings) {
			// Treat tool instantiation as singleton
			if (DuplicateSvgHotspotTool._instance) {
				return DuplicateSvgHotspotTool._instance;
			}

			Tool.apply(this, arguments);

			// Configure dependencies
			this._viewport = null;
			this._handler = new DuplicateSvgHotspotToolHandler(this);

			DuplicateSvgHotspotTool._instance = this;
		}
	});

	// Override initialization method
	DuplicateSvgHotspotTool.prototype.init = function() {
		if (Tool.prototype.init) {
			Tool.prototype.init.call(this);
		}

		// set footprint for tool
		this.setFootprint(["sap.ui.vk.svg.Viewport"]);

		this.setAggregation("gizmo", new DuplicateSvgHotspotToolGizmo());
	};

	// Override the active property setter so that we execute activation / deactivation code at the same time
	DuplicateSvgHotspotTool.prototype.setActive = function(value, activeViewport, gizmoContainer) {
		Tool.prototype.setActive.call(this, value, activeViewport, gizmoContainer);

		var viewport = this._viewport;
		if (viewport) {
			if (value) {
				this._gizmo = this.getGizmo();
				if (this._gizmo) {
					this._gizmo.show(viewport, this);
				}

				this._addLocoHandler();
			} else {
				this._removeLocoHandler();

				if (this._gizmo) {
					this._gizmo.hide();
					this._gizmo = null;
				}
			}
		}

		return this;
	};

	/** MOVE TO BASE
	 * Queues a command for execution during the rendering cycle. All gesture operations should be called using this method.
	 *
	 * @param {function} command The command to be executed.
	 * @returns {sap.ui.vk.tools.DuplicateSvgHotspotTool} <code>this</code> to allow method chaining.
	 * @public
	 */
	DuplicateSvgHotspotTool.prototype.queueCommand = function(command) {
		if (this._addLocoHandler()) {
			if (this.isViewportType("sap.ui.vk.svg.Viewport")) {
				command();
			}
		}
		return this;
	};

	return DuplicateSvgHotspotTool;
});
