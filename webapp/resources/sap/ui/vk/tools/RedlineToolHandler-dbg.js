/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)

        (c) Copyright 2009-2015 SAP SE. All rights reserved
    
 */

// Provides control sap.ui.vk.tools.RedlineToolHandler
sap.ui.define([
	"sap/ui/base/EventProvider",
	"sap/ui/core/Core"
], function(
	EventProvider,
	core
) {
	"use strict";

	var RedlineToolHandler = EventProvider.extend("sap.ui.vk.tools.RedlineToolHandler", {
		metadata: {
		},
		constructor: function(tool) {
			this._priority = 0; // the priority of the handler
			this._tool = tool;
			this._rect = null;
			this._x = 0;
			this._y = 0;
			this._d = 0;
			this._zoomFactor = 1;
		}
	});

	RedlineToolHandler.prototype.destroy = function() {
		this._tool = null;
		this._rect = null;
	};

	RedlineToolHandler.prototype.init = function() {
		this._previousHoverTarget = null;
	};

	RedlineToolHandler.prototype.beginGesture = function(event) {
		// var viewport = this.getViewport();
		var gizmo = this._tool.getGizmo();
		if (gizmo && this._inside(event)) {
			event.handled = true;

			if (gizmo._textEditingElement) {
				var hit = this.hitTest(event.x, event.y);
				if (hit !== gizmo._textEditingElement && hit instanceof sap.ui.vk.RedlineElementText) {
					gizmo.editTextElement(hit);
					return;
				}

				event.passEvent = true; // pass event to the native textArea element

				if (hit === gizmo._textEditingElement) {
					return;
				}
			}

			this._gesture = true;

			if (gizmo._activeElement) {
				var boundingClientRect = gizmo.getDomRef().getBoundingClientRect(),
					pos = gizmo._toVirtualSpace(event.x - boundingClientRect.left - window.pageXOffset, event.y - boundingClientRect.top - window.pageYOffset);

				gizmo._activeElement.setOriginX(pos.x);
				gizmo._activeElement.setOriginY(pos.y);
				gizmo.rerender();
			} else {
				this._x = event.x;
				this._y = event.y;
				this._d = event.d;
				this._initd = event.d;
			}
		}
	};

	var THREEJS_VIEWPORT_TYPE = "sap.ui.vk.threejs.Viewport";
	var NATIVE_VIEWPORT_TYPE = "sap.ui.vk.NativeViewport";

	RedlineToolHandler.prototype._pan = function(event) {
		var viewport = this.getViewport(),
			gizmo = this._tool.getGizmo(),
			deltaX = event.x - this._x,
			deltaY = event.y - this._y;

		if (deltaX || deltaY) {
			this._x = event.x;
			this._y = event.y;

			gizmo.getRedlineElements().forEach(function(element) {
				element.setOriginX(element.getOriginX() + gizmo._toVirtualSpace(deltaX));
				element.setOriginY(element.getOriginY() + gizmo._toVirtualSpace(deltaY));
			});

			gizmo.rerender();

			var panningRatio = gizmo._getPanningRatio();
			var viewportController = viewport.getMetadata().getName() === THREEJS_VIEWPORT_TYPE ? viewport._viewportGestureHandler._cameraController : viewport;
			viewportController.beginGesture(0, 0);
			viewportController.pan(deltaX * panningRatio, deltaY * panningRatio);
			viewportController.endGesture();
		}
	};

	RedlineToolHandler.prototype._zoom = function(event) {
		var viewport = this.getViewport(),
			gizmo = this._tool.getGizmo(),
			zoomDelta = 1;

		var dd = event.d - this._d;
		this._d = event.d;

		if (this._initd > 0) {
			zoomDelta = 1 + dd * (1 / this._initd);
		} else if (event.n === 2) {
			if (event.points[0].y > event.points[1].y) {
				zoomDelta = Math.max(1 - dd * 0.005, 0.333);
			} else {
				zoomDelta = Math.min(1 + dd * 0.005, 3);
			}
		}

		zoomDelta = Math.min(Math.max(zoomDelta, 0.88), 1.12); // restriction of zoom because of Pinch on MacBook trackpad

		var viewportType = viewport.getMetadata().getName();
		var zoomInLimit = 32;
		var zoomOutLimit = 1 / 8;
		if (viewportType === NATIVE_VIEWPORT_TYPE) {
			// need to check zoom limit so we stay in sync
			zoomInLimit = viewport._getZoomInLimit();
			zoomOutLimit = viewport._getZoomOutLimit();
			this._zoomFactor = viewport._getZoomFactor();
		}

		zoomDelta = Math.min(Math.max(this._zoomFactor * zoomDelta, zoomOutLimit), zoomInLimit) / this._zoomFactor;
		this._zoomFactor *= zoomDelta;

		var offset = this._getOffset(gizmo.getDomRef());

		var scaleChange = 1 - zoomDelta,
			pivotPoint = gizmo._toVirtualSpace(event.x - offset.x, event.y - offset.y);

		gizmo.getRedlineElements().forEach(function(element) {
			element.applyZoom(zoomDelta);
			var originX = element.getOriginX(),
				originY = element.getOriginY();
			originX += (pivotPoint.x - originX) * scaleChange;
			originY += (pivotPoint.y - originY) * scaleChange;
			element.setOriginX(originX);
			element.setOriginY(originY);
		});

		gizmo.rerender();

		var viewportController = viewportType === THREEJS_VIEWPORT_TYPE ? viewport._viewportGestureHandler._cameraController : viewport;
		viewportController.beginGesture(event.x - offset.x, event.y - offset.y);
		viewportController.zoom(zoomDelta);
		viewportController.endGesture();
	};

	RedlineToolHandler.prototype.move = function(event) {
		var gizmo = this._tool.getGizmo();
		if (gizmo && this._gesture) {
			event.handled = true;

			if (gizmo._textEditingElement) {
				event.passEvent = true;
				return; // pass event to the native textArea element
			}

			if (gizmo._activeElement) {
				var boundingClientRect = gizmo.getDomRef().getBoundingClientRect(),
					x = event.x - boundingClientRect.left - window.pageXOffset,
					y = event.y - boundingClientRect.top - window.pageYOffset;
				if (event.event) {
					gizmo._activeElement.edit(x, y, event.event.shiftKey);
				} else {
					gizmo._activeElement.edit(x, y);
				}
			} else {
				if (event.n === 1 || event.n === 2) {
					this._pan(event);
				}

				if (event.n === 2 && !event.buttons) {
					this._zoom(event);
				}
			}
		}
	};

	RedlineToolHandler.prototype.endGesture = function(event) {
		var gizmo = this._tool.getGizmo();
		if (gizmo && this._inside(event)) {
			this._gesture = false;
			event.handled = true;

			if (gizmo._textEditingElement) {
				event.passEvent = true;
				return; // pass event to the native textArea element
			}

			if (gizmo._activeElement) {
				gizmo.addRedlineElement(gizmo._activeElement);
				// fire an event containing the current element
				var _activeElement = gizmo._activeElement;
				this._tool.stopAdding();

				this._tool.fireElementCreated({
					element: _activeElement
				});
			}
		}
	};

	RedlineToolHandler.prototype.hitTest = function(x, y) {
		var hit;
		var toleranceX = 6;
		var toleranceY = 6;

		var hitTest = function(x, y) {
			var htmlElement = document.elementFromPoint(x, y);
			if (htmlElement) {
				var element = core.byId(htmlElement.id || htmlElement.parentNode.id);
				if (element instanceof sap.ui.vk.RedlineElement) {
					return element;
				}
			}
		};

		hit = hitTest(x, y);
		if (!hit) {
			for (var y2 = y - toleranceY; y2 < y + toleranceY; y2++) {
				for (var x2 = x - toleranceX; x2 < x + toleranceX; x2++) {
					hit = hitTest(x2, y2);
					if (hit) {
						return hit;
					}
				}
			}
		}

		return hit ? hit : null;
	};

	RedlineToolHandler.prototype.click = function(event) {
		var gizmo = this._tool.getGizmo();
		if (!gizmo || gizmo.gizmo) {
			return;
		}
		var hit = this.hitTest(event.x, event.y);
		if (hit) {
			if (hit instanceof sap.ui.vk.RedlineElementText) {
				gizmo.editTextElement(hit);
				event.handled = true;
			}
			this._tool.fireElementClicked({ elementId: hit.getElementId() });
		}
	};

	RedlineToolHandler.prototype.hover = function(event) {
		var hit = this.hitTest(event.x, event.y);
		if (hit && hit.getElementId() != this._previousHoverTarget) {
			this._previousHoverTarget = hit.getElementId();
			this._tool.fireElementHovered({ elementId: hit.getElementId() });
		} else if (!hit && hit != this._previousHoverTarget) {
			this._previousHoverTarget = hit;
			this._tool.fireElementHovered({ elementId: null });
		}
	};

	RedlineToolHandler.prototype.doubleClick = function(event) { };

	RedlineToolHandler.prototype.contextMenu = function(event) { };

	RedlineToolHandler.prototype.getViewport = function() {
		return this._tool._viewport;
	};

	// GENERALIZE THIS FUNCTION
	RedlineToolHandler.prototype._getOffset = function(obj) {
		var rectangle = obj.getBoundingClientRect();
		var p = {
			x: rectangle.left + window.pageXOffset,
			y: rectangle.top + window.pageYOffset
		};
		return p;
	};

	// GENERALIZE THIS FUNCTION
	RedlineToolHandler.prototype._inside = function(event) {
		var id = this._tool._viewport.getIdForLabel();
		var domobj = document.getElementById(id);

		if (domobj == null) {
			return false;
		}

		var o = this._getOffset(domobj);
		this._rect = {
			x: o.x,
			y: o.y,
			w: domobj.offsetWidth,
			h: domobj.offsetHeight
		};

		return (event.x >= this._rect.x && event.x <= this._rect.x + this._rect.w && event.y >= this._rect.y && event.y <= this._rect.y + this._rect.h);
	};

	return RedlineToolHandler;
});
