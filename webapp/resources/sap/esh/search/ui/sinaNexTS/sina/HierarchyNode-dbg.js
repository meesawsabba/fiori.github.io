/*! 
 * SAPUI5

		(c) Copyright 2009-2021 SAP SE. All rights reserved
	 
 */

/* global Proxy, Reflect, Symbol */

(function(){
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
sap.ui.define(["require", "exports", "./SinaObject"], function (require, exports, SinaObject_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.HierarchyNode = void 0;
    var HierarchyNode = /** @class */ (function (_super) {
        __extends(HierarchyNode, _super);
        function HierarchyNode(properties) {
            var _this = _super.call(this, properties) || this;
            _this.id = properties.id;
            _this.label = properties.label;
            _this.count = properties.count;
            _this.hasChildren = properties.hasChildren;
            _this.parentNode = null;
            _this.childNodes = [];
            _this.childNodeMap = {};
            return _this;
        }
        HierarchyNode.prototype.equals = function (other) {
            return this.id === other.id;
        };
        HierarchyNode.prototype.addChildNode = function (child) {
            if (this.childNodeMap[child.id]) {
                return;
            }
            this.childNodes.push(child);
            this.childNodeMap[child.id] = child;
            child.parentNode = this;
        };
        return HierarchyNode;
    }(SinaObject_1.SinaObject));
    exports.HierarchyNode = HierarchyNode;
});
})();