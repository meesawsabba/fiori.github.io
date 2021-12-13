/*! 
 * SAPUI5

		(c) Copyright 2009-2021 SAP SE. All rights reserved
	 
 */

/* global Proxy, Reflect, Symbol */

(function(){
/*!
 * SAPUI5

		(c) Copyright 2009-2021 SAP SE. All rights reserved
	
 */
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
sap.ui.define(["require", "exports", "./errors"], function (require, exports, errors_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.LabelCalculator = void 0;
    var DuplicateException = /** @class */ (function (_super) {
        __extends(DuplicateException, _super);
        function DuplicateException(properties) {
            var _a;
            var _this = this;
            properties.message = (_a = properties.message) !== null && _a !== void 0 ? _a : "Duplicate node";
            _this = _super.call(this, {
                message: properties.message,
                name: "DuplicateException",
            }) || this;
            _this.node = properties.node;
            return _this;
        }
        return DuplicateException;
    }(errors_1.ESHClientError));
    var Node = /** @class */ (function () {
        function Node(parent, nodeId, labelCalculator) {
            this.parent = parent;
            this.nodeId = nodeId;
            this.labelCalculator = labelCalculator;
            this.childMap = {};
            this.children = [];
        }
        Node.prototype.insert = function (keyPath, obj) {
            // check for end of recursion
            if (keyPath.length === 0) {
                this.data = this.labelCalculator.options.data(obj);
                this.obj = obj;
                this.calculateLabel();
                return;
            }
            // insert recursively into tree
            var key = keyPath[0];
            var subNode = this.childMap[key];
            if (keyPath.length === 1 && subNode) {
                throw new DuplicateException({
                    node: subNode,
                });
            }
            if (!subNode) {
                subNode = new Node(this, key, this.labelCalculator);
                this.childMap[key] = subNode;
                this.children.push(subNode);
                if (this.children.length === 2) {
                    this.children[0].recalculateLabels();
                    // whenever a node gets a sibling -> recalculate labels of node because due to
                    // the sibling we need to add more keys to the label to make the label unique
                }
            }
            subNode.insert(keyPath.slice(1), obj);
        };
        Node.prototype.recalculateLabels = function () {
            var leafs = [];
            this.collectLeafs(leafs);
            for (var i = 0; i < leafs.length; ++i) {
                leafs[i].calculateLabel();
            }
        };
        Node.prototype.collectLeafs = function (leafs) {
            if (this.isLeaf()) {
                leafs.push(this);
                return;
            }
            for (var i = 0; i < this.children.length; ++i) {
                this.children[i].collectLeafs(leafs);
            }
        };
        Node.prototype.isLeaf = function () {
            return this.children.length === 0;
        };
        Node.prototype.hasSibling = function () {
            return this.parent && this.parent.children.length >= 2;
        };
        Node.prototype.isChildOfRoot = function () {
            return this.parent && this.parent.nodeId === "__ROOT";
        };
        Node.prototype.collectPath = function (keyPath, force) {
            if (!this.parent) {
                return;
            }
            if (force || this.hasSibling() || this.isChildOfRoot()) {
                keyPath.push(this.nodeId);
                force = true;
            }
            if (this.parent) {
                this.parent.collectPath(keyPath, force);
            }
        };
        Node.prototype.calculateLabel = function () {
            // collect keys = labels
            var keyPath = [];
            this.collectPath(keyPath);
            keyPath.reverse();
            // calculate label
            this.labelCalculator.options.setLabel(this.obj, keyPath, this.data);
        };
        return Node;
    }());
    var LabelCalculator = /** @class */ (function () {
        function LabelCalculator(options) {
            this.options = options;
            this.rootNode = new Node(null, "__ROOT", this);
        }
        LabelCalculator.prototype.calculateLabel = function (obj) {
            var key = this.options.key(obj);
            try {
                // insert datasource into datasource tree
                // for the inserted datasource a unique label is calculated
                // for datasource in sibling tree branches the label is recalculated
                this.rootNode.insert(key, obj);
            }
            catch (e) {
                if (e.name === "DuplicateException") {
                    this.options.setFallbackLabel(e.node.obj, e.node.data); // set fallback label for already existing node
                    this.options.setFallbackLabel(obj, this.options.data(obj)); // and for duplicate node
                    return;
                }
                throw e;
            }
        };
        return LabelCalculator;
    }());
    exports.LabelCalculator = LabelCalculator;
});
})();