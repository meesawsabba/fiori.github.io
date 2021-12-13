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
sap.ui.define(["require", "exports", "./SinaObject", "./SimpleCondition", "./ComplexCondition", "./LogicalOperator", "../core/errors"], function (require, exports, SinaObject_1, SimpleCondition_1, ComplexCondition_1, LogicalOperator_1, errors_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.Filter = void 0;
    var Filter = /** @class */ (function (_super) {
        __extends(Filter, _super);
        function Filter(properties) {
            var _a, _b, _c;
            var _this = _super.call(this, properties) || this;
            _this.searchTerm = "";
            _this.rootCondition = new ComplexCondition_1.ComplexCondition({ sina: _this.sina });
            _this.dataSource = (_a = properties.dataSource) !== null && _a !== void 0 ? _a : _this.sina.getAllDataSource();
            _this.searchTerm = (_b = properties.searchTerm) !== null && _b !== void 0 ? _b : _this.searchTerm;
            _this.rootCondition = (_c = properties.rootCondition) !== null && _c !== void 0 ? _c : _this.rootCondition;
            return _this;
        }
        Filter.prototype.setSearchTerm = function (searchTerm) {
            this.searchTerm = searchTerm;
        };
        Filter.prototype.setRootCondition = function (rootCondition) {
            this.rootCondition = rootCondition;
        };
        Filter.prototype.clone = function () {
            return new Filter({
                sina: this.sina,
                dataSource: this.dataSource,
                searchTerm: this.searchTerm,
                rootCondition: this.rootCondition.clone(),
            });
        };
        Filter.prototype.equals = function (other) {
            return (other instanceof Filter &&
                this.dataSource === other.dataSource &&
                this.searchTerm === other.searchTerm &&
                this.rootCondition.equals(other.rootCondition));
        };
        Filter.prototype._getAttribute = function (condition) {
            if (condition instanceof SimpleCondition_1.SimpleCondition) {
                return condition.attribute;
            }
            for (var i = 0; i < condition.conditions.length; ++i) {
                var attribute = this._getAttribute(condition.conditions[i]);
                if (attribute) {
                    return attribute;
                }
            }
        };
        Filter.prototype.setDataSource = function (dataSource) {
            if (this.dataSource === dataSource) {
                return;
            }
            this.dataSource = dataSource;
            this.resetConditions();
        };
        Filter.prototype.resetConditions = function () {
            this.rootCondition.resetConditions();
        };
        Filter.prototype.autoInsertCondition = function (condition) {
            // consistency check
            if (!(this.rootCondition instanceof ComplexCondition_1.ComplexCondition)) {
                throw new errors_1.CanOnlyAutoInsertComplexConditionError("cannot auto insert condition - condition is not a complex condition");
            }
            // identify complex condition which is responsible for the attribute -> matchCondition
            var attribute = this._getAttribute(condition);
            var matchCondition, currentCondition;
            for (var i = 0; i < this.rootCondition.conditions.length; ++i) {
                currentCondition = this.rootCondition.conditions[i];
                var currentAttribute = this._getAttribute(currentCondition);
                if (currentAttribute === attribute) {
                    matchCondition = currentCondition;
                    break;
                }
            }
            // if there is no matchCondition -> create
            if (!matchCondition) {
                matchCondition = this.sina.createComplexCondition({
                    operator: LogicalOperator_1.LogicalOperator.Or,
                });
                this.rootCondition.addCondition(matchCondition);
            }
            // prevent duplicate conditions
            for (var j = 0; j < matchCondition.conditions.length; ++j) {
                currentCondition = matchCondition.conditions[j];
                if (currentCondition.equals(condition)) {
                    return;
                }
            }
            // add condition
            matchCondition.addCondition(condition);
        };
        Filter.prototype.autoRemoveCondition = function (condition) {
            // helper
            var removeCondition = function (complexCondition, condition) {
                for (var i = 0; i < complexCondition.conditions.length; ++i) {
                    var subCondition = complexCondition.conditions[i];
                    if (subCondition.equals(condition)) {
                        complexCondition.removeConditionAt(i);
                        i--;
                        continue;
                    }
                    if (subCondition instanceof ComplexCondition_1.ComplexCondition) {
                        removeCondition(subCondition, condition);
                        if (subCondition.conditions.length === 0) {
                            complexCondition.removeConditionAt(i);
                            i--;
                            continue;
                        }
                    }
                }
            };
            // remove
            removeCondition(this.rootCondition, condition);
        };
        Filter.prototype.toJson = function () {
            return {
                dataSource: this.dataSource.toJson(),
                searchTerm: this.searchTerm,
                rootCondition: this.rootCondition.toJson(),
            };
        };
        return Filter;
    }(SinaObject_1.SinaObject));
    exports.Filter = Filter;
});
})();