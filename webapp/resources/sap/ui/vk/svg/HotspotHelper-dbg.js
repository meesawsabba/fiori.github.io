/*!
* SAP UI development toolkit for HTML5 (SAPUI5)

        (c) Copyright 2009-2015 SAP SE. All rights reserved
    
*/

// Provides HotspotHelper class.

sap.ui.define([
	"../NodeContentType",
	"./Element",
	"./Rectangle",
	"sap/base/util/uid",
	"../TransformationMatrix",
	"../uuidv4"
], function(
	NodeContentType,
	Element,
	Rectangle,
	uid,
	TransformationMatrix,
	uuidv4
) {
	"use strict";

	var HotspotHelper = function() { };

	/**
	 * Creates a hotspot.
	 * @param {sap.ui.vk.svg.Scene} scene The active scene reference object.
	 * @param {sap.ui.vk.svg.Element} parentNode The reference object of the parent node where the created hotspot is added to.
	 * @param {sap.ui.vk.svg.Element[]} jointNodes Array of nodes to include into hotspot.
	 * @param {string} name The name of the new hotspot node.
	 * @param {object|undefined} nodeInfo Optional Json structure used to define node properties.
	 * @returns {sap.ui.vk.svg.Element} The reference object of the newly created hotspot node.
	 * @experimental
	 * @public
	 */
	HotspotHelper.prototype.createHotspot = function(scene, parentNode, jointNodes, name, nodeInfo) {
		var hotspotNode = scene.getDefaultNodeHierarchy().createNode(parentNode, name, null, NodeContentType.Hotspot, nodeInfo);
		this.updateHotspot(hotspotNode, jointNodes);
		return hotspotNode;
	};

	/**
	 * Deletes a hotspot.
	 * @param {sap.ui.vk.svg.Scene} scene The active scene reference object.
	 * @param {sap.ui.vk.svg.Element} hotspotNode Hotspot object to remove.
	 * @experimental
	 * @public
	 */
	HotspotHelper.prototype.removeHotspot = function(scene, hotspotNode) {
		scene.getDefaultNodeHierarchy().removeNode(hotspotNode);
	};

	/**
	 * Creates duplicates for a hotspot or list of hotspots.
	 * @param {sap.ui.vk.svg.Element|sap.ui.vk.svg.Element[]} hotspots Hotspot object to duplicate or list of hotspots.
	 * @param {sap.ui.vk.svg.Element} parentNode The reference object of the parent node where the created hotspot is added to.
	 * @param {float[]|null} transformationMatrix Position for duplicate of the first hotspot in the hotspots list.
	 *                                            If omitted, duplicated hotspots must be placed at a small offset from the original.
	 * @param {sap.ui.vk.svg.Viewport} viewport Viewport to determine duplicate hotspot offset if transformationMatrix not specified.
	 * @returns {sap.ui.vk.svg.Element|sap.ui.vk.svg.Element[]} Duplicated hotspots in a form can be passed to the backend service.
	 * @experimental
	 * @public
	 */
	HotspotHelper.prototype.duplicateHotspot = function(hotspots, parentNode, transformationMatrix, viewport) {
		hotspots = Array.isArray(hotspots) ? hotspots : [hotspots];
		var matrixOffset;
		if (transformationMatrix) {
			matrixOffset = Element._multiplyMatrices(Element._invertMatrix(hotspots[0]._matrixWorld()), transformationMatrix);
		} else if (viewport) {
			var rect = viewport._camera._transformRect({ x1: 0, y1: 0, x2: 30, y2: 30 });
			matrixOffset = [1, 0, 0, 1, rect.x2 - rect.x1, rect.y2 - rect.y1];
		}

		var parentMatrixWorldInv = Element._invertMatrix(parentNode._matrixWorld());
		var newHotspots = [];
		hotspots.forEach(function(hotspot) {
			var newHotspot = hotspot.clone();
			newHotspot.userData.duplicatedFrom = hotspot.sid;
			var matrixWorld = Element._multiplyMatrices(matrixOffset, hotspot._matrixWorld());
			var matrix = Element._multiplyMatrices(parentMatrixWorldInv, matrixWorld);
			newHotspot.matrix.set(matrix);
			parentNode.add(newHotspot);
			newHotspots.push(newHotspot);
		});

		return newHotspots.length === 1 ? newHotspots[0] : newHotspots;
	};

	/**
	 * Updates a hotspot.
	 * @param {sap.ui.vk.svg.Element} hotspotNode Hotspot object to update.
	 * @param {sap.ui.vk.svg.Element[]|null} jointNodes Array of nodes to include into hotspot.
	 * @param {undefined|float} forceOpacity Hotspot opacity.
	 * @experimental
	 * @private
	 */
	HotspotHelper.prototype.updateHotspot = function(hotspotNode, jointNodes, forceOpacity) {
		// remove all previous joint nodes
		var i = hotspotNode.children.length;
		while (i-- > 0) {
			var child = hotspotNode.children[i];
			if (child.userData.sourceJointNode !== undefined) {
				hotspotNode.remove(child);
			}
		}

		if (jointNodes) {
			hotspotNode.userData.jointNodes = Array.from(jointNodes);
		}

		var parentMatrixWorldInv = Element._invertMatrix(hotspotNode._matrixWorld());
		function addNodeGeometry(jointNode) {
			jointNode.traverse(function(child) {
				if (child.nodeContentType === NodeContentType.Hotspot || child.parent === hotspotNode) {
					return; // ignore this joint node because it is already embedded in the hotspot
				}
				var clone;
				if (child.type === "Image") {
					clone = new Rectangle({
						x: child.x,
						y: child.y,
						width: child.width,
						height: child.height
					});
				} else if (child.type !== "Group") {
					clone = new child.constructor().copy(child, false);
				}
				if (clone) {
					clone.matrix = Element._multiplyMatrices(parentMatrixWorldInv, child._matrixWorld());
					clone.userData.sourceJointNode = child;
					hotspotNode.add(clone);
				}
			});
		}

		jointNodes = hotspotNode.userData.jointNodes;
		if (jointNodes) {
			jointNodes.forEach(function(jointNode) {
				if (jointNode.nodeContentType !== NodeContentType.Hotspot && jointNode.parent !== hotspotNode) {// skip joint nodes already embedded in the hotspot
					addNodeGeometry(jointNode);
				}
			});
		}

		hotspotNode._initAsHotspot(forceOpacity);
	};

	HotspotHelper.prototype.getHotspotRelatedNodes = function(hotspotNode) {
		if (hotspotNode && hotspotNode.userData && hotspotNode.userData.jointNodes) {
			return hotspotNode.userData.jointNodes;
		}

		return [];
	};

	/**
	 * Creates a hotspot.
	 * @param {sap.ui.vk.svg.Scene} scene The active scene reference object.
	 * @param {sap.ui.vk.svg.Element[]} hotspots Array of nodes to be merged.
	 * @returns {any} object contains the follow fields
	 *          {any} <code>nodeRef</code> Merged hotspot node reference
	 *          {any} <code>request</code> Merged hotspots in a form can be passed to the backend service
	 * @experimental
	 * @public
	 */
	HotspotHelper.prototype.mergeHotspots = function(scene, hotspots) {
		var hierarchy = scene.getDefaultNodeHierarchy();
		var target = hierarchy.createNode(null, hotspots[0].name, null, NodeContentType.Hotspot, { sid: uid() });

		var targetJointNodes = [], nodesToBeRemoved = [];
		var targetMatrixWorldInv = Element._invertMatrix(target._matrixWorld());

		var contentTypeChecker = function(contentType, node) { return node._vkGetNodeContentType() === contentType; };
		hotspots.forEach(function(hotspot) {
			if (hotspot.children.every(contentTypeChecker.bind(null, NodeContentType.Hotspot))) {
				// Hotspot.children are all of content type Hotspot for linked (to own copies)
				var childCount = hotspot.children.length;

				while (childCount--) {
					var child = hotspot.children[0];
					var matrix = Element._multiplyMatrices(targetMatrixWorldInv, child._matrixWorld());

					hotspot.remove(child);
					target.add(child);

					child.matrix = matrix;
					targetJointNodes.push(child);
				}
				nodesToBeRemoved.push(hotspot);
			} else if (hotspot.children.every(contentTypeChecker.bind(null, NodeContentType.Regular))) {
				// Hotspot.children are all of content type Regular for embedded
				hotspot.parent.remove(hotspot);
				hotspot.setOpacity();
				target.add(hotspot);

				hotspot.matrix = Element._multiplyMatrices(targetMatrixWorldInv, hotspot._matrixWorld());
				targetJointNodes.push(hotspot);
			}
		});

		if (targetJointNodes) {
			target.userData.jointNodes = Array.from(targetJointNodes);
		}

		hierarchy.removeNode(nodesToBeRemoved);

		var nodes = [], parametrics = [], fillStyles = [], lineStyles = [], textStyles = [];
		var targetNode = {
			name: target.name,
			contentType: NodeContentType.Hotspot,
			joints: [],
			children: []
		};

		target.userData.jointNodes.forEach(function(jn, i) {
			var parametricContent = jn.getParametricContent(fillStyles, lineStyles, textStyles);
			parametrics.push(parametricContent);

			nodes.push({
				name: jn.name,
				transform: TransformationMatrix.convert3x2To4x3(jn.matrix),
				parametric: i,
				contentType: NodeContentType.Hotspot
			});

			targetNode.joints.push({
				child: i,
				type: "LINK",
				action: "bubble"
			});

			targetNode.children.push(i);
		});

		nodes.push(targetNode);

		hotspots.forEach(function(h) {
			nodes.push({ suppressed: true, sid: h.sid });
		});

		var currentView = scene.getViewStateManager().getCurrentView();

		return {
			nodeRef: target,
			request: {
				views: [
					{
						id: currentView.getViewId(),
						name: currentView.getName(),
						nodes: nodes
					}
				],
				parametrics: parametrics,
				fillstyles: fillStyles,
				linestyles: lineStyles,
				textStyles: textStyles
			}
		};
	};

	/**
	 * Creates a request payload for a storage server to create a parametric primitives for the specified elements.
	 * @param {sap.ui.vk.svg.Element|sap.ui.vk.svg.Element[]} elements The element reference or the array of element references.
	 * @param {sap.ui.vk.svg.Viewport} viewport The current Viewport.
	 * @returns {object} JSON payload for the request.
	 * @public
	 */
	HotspotHelper.prototype.createRequest = function(elements, viewport) {
		if (!elements || !viewport) {
			return null;
		}

		var nodes = [];
		var parametrics = [];
		var fillStyles = [];
		var lineStyles = [];
		var textStyles = [];
		var view = viewport && viewport._currentView;

		function pushNode(element, scene) {
			scene.setNodePersistentId(element, uuidv4());

			var nodeInfo = {
				name: element.name,
				transform: TransformationMatrix.convert3x2To4x3(element.matrix),
				veId: element.sid
			};

			if (element.nodeContentType === NodeContentType.Hotspot) {
				nodeInfo.contentType = "HOTSPOT";
			}

			if (element.userData.duplicatedFrom) {
				nodeInfo.duplicatedFrom = element.userData.duplicatedFrom;
				delete element.userData.duplicatedFrom;
			}

			var parametric = element.getParametricContent(fillStyles, lineStyles, textStyles);
			if (parametric) {
				nodeInfo.parametric = parametrics.length;
				parametrics.push(parametric);
			}

			var index = nodes.length;
			nodes.push(nodeInfo);

			var children = element.children;
			if (children.length > 0) {
				var childrenInfo = [];
				for (var i = 0; i < children.length; i++) {
					if (children[i].type === "Group") {
						childrenInfo.push(pushNode(children[i], scene));
					}
				}
				if (childrenInfo.length > 0) {
					nodeInfo.children = childrenInfo;
				}
			}

			return index;
		}

		var scene = viewport.getScene();
		(Array.isArray(elements) ? elements : [elements]).forEach(function(element) {
			pushNode(element, scene);
		});

		var request = {
			views: [{
				id: view && view.getViewId(),
				nodes: nodes
			}],
			parametrics: parametrics
		};

		if (fillStyles.length > 0) {
			request.fillstyles = fillStyles;
		}
		if (lineStyles.length > 0) {
			request.linestyles = lineStyles;
		}
		if (textStyles.length > 0) {
			request.textStyles = textStyles;
		}

		return request;
	};

	return HotspotHelper;
});
