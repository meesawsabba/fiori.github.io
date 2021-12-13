/*!
 * SAPUI5

		(c) Copyright 2009-2021 SAP SE. All rights reserved
	
 */
sap.ui.define([], function () {
    var dummyId = "$$dummy$$";
    var createNode = function (properties) {
        var facet = properties.facet;
        var parentNode = null;
        var SearchHierarchyNode = function () {
            this.init.apply(this, arguments);
        };
        SearchHierarchyNode.prototype = {
            init: function (properties) {
                this.id = properties.id;
                this.label = properties.label;
                this.count = properties.count;
                this.expanded = properties.expanded || false;
                this.hasFilter = false;
                this.childNodes = [];
            },
            _setParentNode: function (pNode) {
                parentNode = pNode;
            },
            getParentNode: function () {
                return parentNode;
            },
            addChildNode: function (childNode) {
                this.childNodes.push(childNode);
                childNode._setParentNode(this);
            },
            addChildNodeAtPosition: function (insertionIndex, childNode) {
                this.childNodes.splice(insertionIndex, 0, childNode);
                childNode._setParentNode(this);
            },
            removeChildNode: function (childNode) {
                var index = this.childNodes.indexOf(childNode);
                this.childNodes.splice(index, 1);
                childNode._setParentNode(null);
            },
            getChildNodeById: function (id) {
                for (var i = 0; i < this.childNodes.length; ++i) {
                    var childNode = this.childNodes[i];
                    if (childNode.id === id) {
                        return childNode;
                    }
                }
                return null;
            },
            delete: function () {
                if (parentNode) {
                    parentNode.removeChildNode(this);
                }
                delete facet.nodeMap[this.id];
                this.deleteChildNodes();
            },
            deleteChildNodes: function () {
                for (var i = 0; i < this.childNodes.length; ++i) {
                    var childNode = this.childNodes[i];
                    if (childNode.id === dummyId) {
                        this.childNodes.splice(i, 1);
                        i--;
                        continue;
                    }
                    childNode.delete();
                    i--;
                }
            },
            visitChildNodesRecursively: function (callback) {
                for (var i = 0; i < this.childNodes.length; ++i) {
                    var childNode = this.childNodes[i];
                    if (childNode.id === dummyId) {
                        continue;
                    }
                    callback(childNode);
                    childNode.visitChildNodesRecursively(callback);
                }
            },
            visitParentNodesRecursively: function (callback) {
                var parentNode = this.getParentNode();
                if (parentNode) {
                    callback(parentNode);
                    parentNode.visitParentNodesRecursively(callback);
                }
            },
            hasChildNodes: function () {
                for (var i = 0; i < this.childNodes.length; ++i) {
                    var childNode = this.childNodes[i];
                    if (childNode.id === dummyId) {
                        continue;
                    }
                    return true;
                }
                return false;
            },
            isVisible: function () {
                var isExpanded = function (node) {
                    if (!node.expanded) {
                        return false;
                    }
                    var parentNode = node.getParentNode();
                    if (!parentNode) {
                        return true;
                    }
                    return isExpanded(parentNode);
                };
                var parentNode = this.getParentNode();
                if (!parentNode) {
                    return true;
                }
                return isExpanded(parentNode);
            },
            toggleExpand: function (expand) {
                if (expand) {
                    this.expanded = true;
                    this.fetchChildNodesFromServer().then(function (hierarchyResultSet) {
                        this.update(hierarchyResultSet.node);
                        facet.mixinFilterNodes();
                        facet.refreshUI(); // this calls model.setProperty -> show change in UI
                    }.bind(this));
                }
                else {
                    this.expanded = false;
                    this.deleteChildNodes();
                    this.childNodes.push({ id: dummyId, label: " " });
                    facet.mixinFilterNodes();
                    facet.refreshUI();
                }
            },
            toggleFilter: function () {
                if (this.selected) {
                    if (this.partiallySelected) {
                        // 1. checkbox with square
                        this.setFilter(true);
                        this.visitParentNodesRecursively(function (node) {
                            node.setFilter(false);
                        });
                        this.visitChildNodesRecursively(function (node) {
                            node.setFilter(false);
                        });
                    }
                    else {
                        // 2. selected checkbox
                        this.setFilter(false);
                    }
                }
                else {
                    // 3. not selected checkbox
                    this.setFilter(true);
                    this.visitParentNodesRecursively(function (node) {
                        node.setFilter(false);
                    });
                }
                facet.activateFilters();
            },
            setFilter: function (set) {
                var filterCondition = facet.sina.createSimpleCondition({
                    operator: facet.sina.ComparisonOperator.Eq,
                    attribute: facet.attributeId,
                    attributeLabel: facet.title,
                    value: this.id,
                    valueLabel: this.label,
                });
                var uiFilter = facet.model.getProperty("/uiFilter");
                if (set) {
                    uiFilter.autoInsertCondition(filterCondition);
                }
                else {
                    uiFilter.autoRemoveCondition(filterCondition);
                }
            },
            fetchChildNodesFromServer: function () {
                // assemble filter by removing attribute conditions of "own" facet attribute
                // (we want to show all children independend on the selection done in the "own" facet)
                var filter = facet.filter.clone();
                filter.rootCondition.removeAttributeConditions(facet.attributeId);
                // fetch sina result set
                return facet.sina
                    .createHierarchyQuery({
                    attributeId: facet.attributeId,
                    nodeId: this.id,
                    filter: filter,
                })
                    .getResultSetAsync()
                    .then(function (hierarchyResultSet) {
                    facet.updateStructureTree(hierarchyResultSet.node);
                    return hierarchyResultSet;
                });
            },
            hasExpandedChildNode: function () {
                for (var i = 0; i < this.childNodes.length; ++i) {
                    var childNode = this.childNodes[i];
                    if (childNode.id === dummyId) {
                        continue;
                    }
                    if (childNode.expanded || childNode.hasExpandedChildNode()) {
                        return true;
                    }
                }
                return false;
            },
            updateFromServer: function () {
                // recursively update the tree by fetching nodes from server
                return this.fetchChildNodesFromServer().then(function (hierarchyResultSet) {
                    this.update(hierarchyResultSet.node);
                    var childPromises = [];
                    for (var i = 0; i < this.childNodes.length; ++i) {
                        var childNode = this.childNodes[i];
                        if (childNode.id === dummyId) {
                            continue;
                        }
                        if (!childNode.expanded) {
                            continue;
                        }
                        childPromises.push(childNode.updateFromServer());
                    }
                    return Promise.all(childPromises);
                }.bind(this));
            },
            update: function (sinaNode) {
                // update node itself
                this.label = sinaNode.label;
                this.count = sinaNode.count;
                this.selected = false;
                // remove dummy child node if exists
                if (this.childNodes.length === 1 && this.childNodes[0].id === dummyId) {
                    this.childNodes.splice(0, 1);
                }
                // update children
                var childNode;
                for (var i = 0; i < sinaNode.childNodes.length; ++i) {
                    var sinaChildNode = sinaNode.childNodes[i];
                    if (i <= this.childNodes.length - 1) {
                        // 1 node exists at position i
                        childNode = this.childNodes[i];
                        if (childNode.id === sinaChildNode.id) {
                            // 1.1 correct node at position i
                        }
                        else {
                            // 1.2 wrong node at position i
                            childNode = this.getChildNodeById(sinaChildNode.id);
                            if (childNode) {
                                // 1.2.1 correct node at wrong position -> move node
                                this.removeChildNode(childNode);
                                this.addChildNodeAtPosition(i, childNode);
                            }
                            else {
                                // 1.2.2 no correct node exists -> create node
                                childNode = facet.createNode({
                                    id: sinaChildNode.id,
                                    label: sinaChildNode.label,
                                    count: sinaChildNode.count,
                                });
                                this.addChildNodeAtPosition(i, childNode);
                            }
                        }
                    }
                    else {
                        // 2 no node at position i
                        childNode = facet.createNode({
                            id: sinaChildNode.id,
                            label: sinaChildNode.label,
                            count: sinaChildNode.count,
                        });
                        this.addChildNode(childNode);
                    }
                    // recursion
                    childNode.update(sinaChildNode);
                }
                // delete superfluous nodes
                while (this.childNodes.length > sinaNode.childNodes.length) {
                    childNode = this.childNodes[this.childNodes.length - 1];
                    childNode.delete();
                }
                // add dummy child node in case we know there are children but children are not loaded
                if (this.childNodes.length === 0 && sinaNode.hasChildren) {
                    this.childNodes.push({ id: dummyId, label: " " });
                }
            },
        };
        return new SearchHierarchyNode(properties);
    };
    return { createNode: createNode };
});
