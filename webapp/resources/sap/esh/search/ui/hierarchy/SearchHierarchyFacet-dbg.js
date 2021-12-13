/*!
 * SAPUI5

		(c) Copyright 2009-2021 SAP SE. All rights reserved
	
 */
sap.ui.define(["./SearchHierarchyNode", "./StructureTree"], function (SearchHierarchyNode, StructureTree) {
    var rootNodeId = "$$ROOT$$";
    var Facet = function () {
        this.init.apply(this, arguments);
    };
    Facet.prototype = {
        init: function (properties) {
            this.model = properties.model;
            this.sina = properties.sina;
            this.dataSource = properties.dataSource;
            this.attributeId = properties.attributeId;
            this.dimension = this.attributeId; // alias for compatability with the simple attribute facets
            this.title = properties.title;
            this.filter = properties.filter;
            this.facetType = "hierarchy";
            this.nodeMap = {};
            this.node = this.createNode({ id: rootNodeId, expanded: true });
            this.facetIndex = -1;
            this.structureTree = new StructureTree({ rootNode: { id: rootNodeId, label: "root" } });
            this.notDisplayedFilterConditions = [];
        },
        updateStructureTree: function (sinaNode) {
            this.structureTree.update(sinaNode);
        },
        createNode: function (properties) {
            properties.facet = this;
            var node = SearchHierarchyNode.createNode(properties);
            this.nodeMap[node.id] = node;
            return node;
        },
        refreshUI: function () {
            this.model.setProperty("/facets/" + this.facetIndex, this);
        },
        activateFilters: function () {
            this.model._firePerspectiveQuery({
                preserveFormerResults: false,
            });
            this.model.notifyFilterChanged();
        },
        updateFromServer: function () {
            return this.node.updateFromServer().then(function () {
                return this;
            }.bind(this));
        },
        updateFromResultSet: function (resultSet) {
            this.node.update(resultSet.node);
            this.updateStructureTree(resultSet.node);
            return Promise.resolve(this);
        },
        getComplexConditionOfFacet: function () {
            for (var i = 0; i < this.filter.rootCondition.conditions.length; ++i) {
                var complexCondition = this.filter.rootCondition.conditions[i];
                if (complexCondition.containsAttribute(this.attributeId)) {
                    return complexCondition;
                }
            }
            return null;
        },
        getFilterConditions: function () {
            var filterConditions = [];
            var complexCondition = this.getComplexConditionOfFacet();
            if (!complexCondition) {
                return filterConditions;
            }
            for (var i = 0; i < complexCondition.conditions.length; ++i) {
                var condition = complexCondition.conditions[i];
                filterConditions.push(condition);
            }
            return filterConditions;
        },
        mixinFilterNodes: function () {
            // reset filter flag for complete tree
            this.node.hasFilter = false;
            this.node.visitChildNodesRecursively(function (node) {
                node.hasFilter = false;
            });
            // update filter flag from filter conditions
            var nodeId;
            var notDisplayedFilterConditions = [];
            var filterConditions = this.getFilterConditions();
            for (var i = 0; i < filterConditions.length; ++i) {
                var filterCondition = filterConditions[i];
                nodeId = filterCondition.value;
                var node = this.nodeMap[nodeId];
                if (node) {
                    node.hasFilter = true;
                }
                else {
                    notDisplayedFilterConditions.push(filterCondition);
                }
            }
            // add tree nodes for filters not in tree
            for (var j = 0; j < notDisplayedFilterConditions.length; ++j) {
                var notDisplayedFilterCondition = notDisplayedFilterConditions[j];
                nodeId = notDisplayedFilterCondition.value;
                // try to add filter node via structure tree
                if (this.addMissingFilterNode(nodeId)) {
                    // in case of success delete from notDisplayedFilterConditions list
                    notDisplayedFilterConditions.splice(j, 1);
                    j--;
                }
            }
            this.notDisplayedFilterConditions = notDisplayedFilterConditions;
            this.calculateCheckboxStatus();
        },
        addMissingFilterNode: function (id) {
            var getOrCreateTreeNode = function (structureTreeNode) {
                var treeNode = this.nodeMap[structureTreeNode.id];
                if (treeNode) {
                    if (treeNode.isVisible()) {
                        return treeNode;
                    }
                    else {
                        return false;
                    }
                }
                if (!structureTreeNode.parentNode) {
                    throw new Error("program error parent node missing for " + structureTreeNode.id);
                }
                var parentTreeNode = getOrCreateTreeNode(structureTreeNode.parentNode);
                if (!parentTreeNode || !parentTreeNode.expanded) {
                    return false;
                }
                treeNode = this.createNode({
                    id: structureTreeNode.id,
                    label: structureTreeNode.label,
                    expanded: true,
                });
                parentTreeNode.addChildNode(treeNode);
                return treeNode;
            }.bind(this);
            var structureTreeNode = this.structureTree.getNode(id);
            if (!structureTreeNode) {
                return false;
            }
            var treeNode = getOrCreateTreeNode(structureTreeNode);
            if (!treeNode) {
                return false;
            }
            treeNode.hasFilter = true;
            return true;
        },
        calculateCheckboxStatus: function () {
            // reset
            this.node.selected = false;
            this.node.partiallySelected = false;
            this.node.visitChildNodesRecursively(function (node) {
                node.selected = false;
                node.partiallySelected = false;
            });
            // collect leafs
            var leafNodes = [];
            if (!this.node.hasChildNodes()) {
                leafNodes.push(this);
            }
            this.node.visitChildNodesRecursively(function (node) {
                if (!node.hasChildNodes()) {
                    leafNodes.push(node);
                }
            });
            // calculate selected and partiallySelected
            for (var i = 0; i < leafNodes.length; ++i) {
                var leafNode = leafNodes[i];
                this.calculateCheckboxStatusFromLeafNode(leafNode);
            }
        },
        calculateCheckboxStatusFromLeafNode: function (leafNode) {
            var node = leafNode;
            var markPartiallySelected = false;
            while (node) {
                if (node.selected && node.partiallySelected) {
                    return;
                }
                if (node.hasFilter) {
                    node.selected = true;
                    node.partiallySelected = false;
                    markPartiallySelected = true;
                }
                else {
                    if (markPartiallySelected) {
                        node.selected = true;
                        node.partiallySelected = true;
                    }
                }
                node = node.getParentNode();
            }
        },
    };
    return Facet;
});
