/*! 
 * SAPUI5

		(c) Copyright 2009-2021 SAP SE. All rights reserved
	 
 */

/* global Proxy, Reflect, Symbol */

(function(){
sap.ui.define(["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.HierarchyNodePathParser = void 0;
    var HierarchyNodePathParser = /** @class */ (function () {
        function HierarchyNodePathParser(sina) {
            this.sina = sina;
        }
        // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
        HierarchyNodePathParser.prototype.parse = function (response) {
            var _this = this;
            var searchResponse = response;
            var hierarchyNodePaths = [];
            if (!searchResponse.data["@com.sap.vocabularies.Search.v1.ParentHierarchies"]) {
                return hierarchyNodePaths;
            }
            for (var _i = 0, _a = searchResponse.data["@com.sap.vocabularies.Search.v1.ParentHierarchies"]; _i < _a.length; _i++) {
                var parentHierarchy = _a[_i];
                hierarchyNodePaths.push(this.sina.createHierarchyNodePath({
                    name: parentHierarchy.scope,
                    path: parentHierarchy.hierarchy.map(function (node) {
                        return _this.sina.createHierarchyNode({ id: node.node_id, label: node.node_value });
                    }),
                }));
            }
            return hierarchyNodePaths;
        };
        return HierarchyNodePathParser;
    }());
    exports.HierarchyNodePathParser = HierarchyNodePathParser;
});
})();