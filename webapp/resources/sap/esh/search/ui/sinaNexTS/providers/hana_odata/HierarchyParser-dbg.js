/*! 
 * SAPUI5

		(c) Copyright 2009-2021 SAP SE. All rights reserved
	 
 */

/* global Proxy, Reflect, Symbol */

(function(){
sap.ui.define(["require", "exports", "../../sina/HierarchyQuery"], function (require, exports, HierarchyQuery_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.HierarchyParser = void 0;
    var HierarchyParser = /** @class */ (function () {
        function HierarchyParser() {
        }
        HierarchyParser.prototype.parseHierarchyFacet = function (query, attributeMetadata, facetData) {
            var nodeId = query instanceof HierarchyQuery_1.HierarchyQuery ? query.nodeId : "$$ROOT$$";
            var hierarchyQuery = query.sina.createHierarchyQuery({
                filter: query.filter.clone(),
                attributeId: attributeMetadata.id,
                nodeId: nodeId,
            });
            var resultSet = query.sina._createHierarchyResultSet({
                query: hierarchyQuery,
                node: null,
                items: [],
                title: facetData["@com.sap.vocabularies.Common.v1.Label"],
            });
            var nodeMap = {};
            var nodes = [];
            for (var _i = 0, _a = facetData.Items; _i < _a.length; _i++) {
                var item = _a[_i];
                var id = item[attributeMetadata.id];
                // 1. create or update node
                var node_1 = nodeMap[id];
                if (!node_1) {
                    // 1.1 create node
                    node_1 = query.sina.createHierarchyNode({
                        id: id,
                        label: item[attributeMetadata.id + "@com.sap.vocabularies.Common.v1.Text"],
                        count: item._Count,
                        hasChildren: item._HasChildren,
                    });
                    nodes.push(node_1);
                    nodeMap[id] = node_1;
                }
                else {
                    // 1.2 update node
                    node_1.label = item[attributeMetadata.id + "@com.sap.vocabularies.Common.v1.Text"];
                    node_1.count = item._Count;
                }
                // 2. add node to parent node
                var parentId = JSON.parse(item._Parent)[attributeMetadata.id];
                var parentNode = nodeMap[parentId];
                if (!parentNode) {
                    parentNode = query.sina.createHierarchyNode({
                        id: parentId,
                    });
                    nodes.push(parentNode);
                    nodeMap[parentId] = parentNode;
                }
                parentNode.addChildNode(node_1);
            }
            var node = nodes.find(function (node) { return node.id === nodeId; });
            resultSet.node = node;
            return resultSet;
        };
        return HierarchyParser;
    }());
    exports.HierarchyParser = HierarchyParser;
});
})();