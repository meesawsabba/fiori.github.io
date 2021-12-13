/*!
 * SAPUI5

		(c) Copyright 2009-2021 SAP SE. All rights reserved
	
 */
sap.ui.define([], function () {
    var StructureTreeNode = function () {
        this.init.apply(this, arguments);
    };
    StructureTreeNode.prototype = {
        init: function (properties) {
            this.id = properties.id;
            this.label = properties.label;
            this.tree = properties.tree;
            this.childNodes = [];
            this.childNodeMap = {};
            this.parentNode = null;
        },
        addChildNode: function (node) {
            this.childNodes.push(node);
            this.childNodeMap[node.id] = node;
            node.parentNode = this;
        },
        update: function (sinaNode) {
            for (var i = 0; i < sinaNode.childNodes.length; ++i) {
                var sinaChildNode = sinaNode.childNodes[i];
                var childNode = this.childNodeMap[sinaChildNode.id];
                if (!childNode) {
                    childNode = this.tree.createNode({ id: sinaChildNode.id, label: sinaChildNode.label });
                    this.addChildNode(childNode);
                }
                childNode.update(sinaChildNode);
            }
        },
    };
    var StructureTree = function () {
        this.init.apply(this, arguments);
    };
    StructureTree.prototype = {
        init: function (properties) {
            this.nodeMap = {};
            this.node = this.createNode(properties.rootNode);
        },
        createNode: function (properties) {
            properties.tree = this;
            var node = new StructureTreeNode(properties);
            this.nodeMap[properties.id] = node;
            return node;
        },
        getNode: function (id) {
            return this.nodeMap[id];
        },
        update: function (sinaNode) {
            var node = this.nodeMap[sinaNode.id];
            if (!node) {
                throw new Error("structure tree update failed, node does not exist " + sinaNode.id);
            }
            node.update(sinaNode);
        },
    };
    return StructureTree;
});
