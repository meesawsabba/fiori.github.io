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
sap.ui.define(["require", "exports", "../../sina/ComparisonOperator", "./typeConverter", "../../sina/ComplexCondition", "../../sina/SimpleCondition", "../../core/errors", "./ComparisonOperator", "../../sina/LogicalOperator"], function (require, exports, ComparisonOperator_1, typeConverter, ComplexCondition_1, SimpleCondition_1, errors_1, ComparisonOperator_2, LogicalOperator_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.serialize = void 0;
    var ConditionSerializer = /** @class */ (function () {
        function ConditionSerializer(dataSource) {
            this.dataSource = dataSource;
        }
        ConditionSerializer.prototype.convertSinaToOdataOperator = function (sinaOperator) {
            switch (sinaOperator) {
                case ComparisonOperator_1.ComparisonOperator.Eq:
                    return "EQ";
                case ComparisonOperator_1.ComparisonOperator.Lt:
                    return "LT";
                case ComparisonOperator_1.ComparisonOperator.Gt:
                    return "GT";
                case ComparisonOperator_1.ComparisonOperator.Le:
                    return "LE";
                case ComparisonOperator_1.ComparisonOperator.Ge:
                    return "GE";
                case ComparisonOperator_1.ComparisonOperator.Co:
                    return "EQ";
                case ComparisonOperator_1.ComparisonOperator.Bw:
                    return "EQ";
                case ComparisonOperator_1.ComparisonOperator.Ew:
                    return "EQ";
                case LogicalOperator_1.LogicalOperator.And:
                    return "AND";
                case LogicalOperator_1.LogicalOperator.Or:
                    return "OR";
                default:
                    throw new errors_1.UnknownComparisonOperatorError("Unknown comparison operator " + sinaOperator);
            }
        };
        ConditionSerializer.prototype.serializeComplexCondition = function (condition) {
            var result = {
                ActAsQueryPart: false,
                Id: 1,
                OperatorType: this.convertSinaToOdataOperator(condition.operator),
                SubFilters: [],
            };
            var actAsQueryPartPath = "Schema[Namespace=ESH_SEARCH_SRV]>EntityType[Name=SearchFilter]>Property[Name=ActAsQueryPart]";
            if (condition.sina.provider.isQueryPropertySupported(actAsQueryPartPath)) {
                result.ActAsQueryPart = true;
            }
            var subConditions = condition.conditions;
            for (var i = 0; i < subConditions.length; ++i) {
                var subCondition = subConditions[i];
                result.SubFilters.push(this.serialize(subCondition));
            }
            return result;
        };
        ConditionSerializer.prototype.serializeSimpleCondition = function (condition) {
            var metadata = this.dataSource.getAttributeMetadata(condition.attribute);
            var type = metadata.type;
            var conditionObj = {
                ConditionAttribute: condition.attribute,
                ConditionOperator: this.convertSinaToOdataOperator(condition.operator),
                ConditionValue: typeConverter.sina2Odata(type, condition.value, {
                    operator: condition.operator,
                }),
                SubFilters: [],
            };
            return conditionObj;
        };
        ConditionSerializer.prototype.serializeBetweenCondition = function (condition) {
            var valueLow;
            var valueHigh;
            var rangeStartCondition = condition.conditions[0];
            var rangeEndCondition = condition.conditions[1];
            if (rangeStartCondition instanceof SimpleCondition_1.SimpleCondition && rangeEndCondition instanceof SimpleCondition_1.SimpleCondition) {
                var metadata = this.dataSource.getAttributeMetadata(rangeStartCondition.attribute);
                var type = metadata.type;
                if (rangeStartCondition.operator === ComparisonOperator_1.ComparisonOperator.Ge) {
                    valueLow = rangeStartCondition.value;
                    valueHigh = rangeEndCondition.value;
                }
                else {
                    valueLow = rangeEndCondition.value;
                    valueHigh = rangeStartCondition.value;
                }
                var conditionObj = {
                    ConditionAttribute: rangeStartCondition.attribute,
                    ConditionOperator: ComparisonOperator_2.ABAPODataComparisonOperator.Bt,
                    ConditionValue: typeConverter.sina2Odata(type, valueLow),
                    ConditionValueHigh: typeConverter.sina2Odata(type, valueHigh),
                    SubFilters: [],
                };
                return conditionObj;
            }
            throw new errors_1.InBetweenConditionInConsistent();
        };
        ConditionSerializer.prototype.serialize = function (condition) {
            if (condition instanceof ComplexCondition_1.ComplexCondition) {
                if (condition.operator === LogicalOperator_1.LogicalOperator.And &&
                    condition.conditions[0] &&
                    (condition.conditions[0].operator === ComparisonOperator_1.ComparisonOperator.Ge ||
                        condition.conditions[0].operator === ComparisonOperator_1.ComparisonOperator.Gt ||
                        condition.conditions[0].operator === ComparisonOperator_1.ComparisonOperator.Le ||
                        condition.conditions[0].operator === ComparisonOperator_1.ComparisonOperator.Lt)) {
                    if (condition.conditions.length === 1) {
                        // condition example: "" ... "100"
                        return this.serializeSimpleCondition(condition.conditions[0]);
                    }
                    // condition example: "10" ... "100"
                    return this.serializeBetweenCondition(condition);
                }
                return this.serializeComplexCondition(condition);
            }
            // condition example: "USA"
            if (condition instanceof SimpleCondition_1.SimpleCondition) {
                return this.serializeSimpleCondition(condition);
            }
        };
        return ConditionSerializer;
    }());
    function serialize(dataSource, condition) {
        var serializer = new ConditionSerializer(dataSource);
        return serializer.serialize(condition);
    }
    exports.serialize = serialize;
});
})();