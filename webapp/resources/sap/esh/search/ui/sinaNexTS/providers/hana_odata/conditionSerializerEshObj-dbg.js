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
sap.ui.define(["require", "exports", "../../sina/DataSource", "../../sina/ComparisonOperator", "../../sina/LogicalOperator", "../../sina/ComplexCondition", "../../sina/AttributeType", "./typeConverter", "./eshObjects/src/index", "../../core/errors"], function (require, exports, DataSource_1, ComparisonOperator_1, LogicalOperator_1, ComplexCondition_1, AttributeType_1, typeConverter, index_1, errors_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.serialize = exports.ConditionSerializer = void 0;
    var ConditionSerializer = /** @class */ (function () {
        function ConditionSerializer(dataSource) {
            this.dataSource = dataSource;
        }
        ConditionSerializer.prototype.convertSinaToOdataOperator = function (sinaOperator, attributeMetadata) {
            switch (sinaOperator) {
                case ComparisonOperator_1.ComparisonOperator.Eq:
                    if (attributeMetadata === null || attributeMetadata === void 0 ? void 0 : attributeMetadata.isHierarchy) {
                        return index_1.SearchQueryComparisonOperator.DescendantOf;
                    }
                    else {
                        return index_1.SearchQueryComparisonOperator.EqualCaseSensitive;
                    }
                case ComparisonOperator_1.ComparisonOperator.Ne:
                    return index_1.SearchQueryComparisonOperator.NotEqualCaseSensitive;
                case ComparisonOperator_1.ComparisonOperator.Lt:
                    return index_1.SearchQueryComparisonOperator.LessThanCaseInsensitive;
                case ComparisonOperator_1.ComparisonOperator.Gt:
                    return index_1.SearchQueryComparisonOperator.GreaterThanCaseInsensitive;
                case ComparisonOperator_1.ComparisonOperator.Le:
                    return index_1.SearchQueryComparisonOperator.LessThanOrEqualCaseInsensitive;
                case ComparisonOperator_1.ComparisonOperator.Ge:
                    return index_1.SearchQueryComparisonOperator.GreaterThanOrEqualCaseInsensitive;
                case ComparisonOperator_1.ComparisonOperator.Co: // Contains only
                    return index_1.SearchQueryComparisonOperator.EqualCaseInsensitive;
                case ComparisonOperator_1.ComparisonOperator.Bw: // Begin with
                    return index_1.SearchQueryComparisonOperator.EqualCaseInsensitive;
                case ComparisonOperator_1.ComparisonOperator.Ew: // End with
                    return index_1.SearchQueryComparisonOperator.EqualCaseInsensitive;
                case ComparisonOperator_1.ComparisonOperator.DescendantOf:
                    return index_1.SearchQueryComparisonOperator.DescendantOf;
                case ComparisonOperator_1.ComparisonOperator.ChildOf:
                    return index_1.SearchQueryComparisonOperator.ChildOf;
                default:
                    throw new errors_1.UnknownComparisonOperatorError("Unknow comparison operator " + sinaOperator);
            }
        };
        ConditionSerializer.prototype.convertSinaToOdataLogicalOperator = function (sinaOperator) {
            switch (sinaOperator) {
                case LogicalOperator_1.LogicalOperator.And:
                    return index_1.SearchQueryLogicalOperator.AND;
                case LogicalOperator_1.LogicalOperator.Or:
                    return index_1.SearchQueryLogicalOperator.OR;
                default:
                    throw new errors_1.UnknownLogicalOperatorError("Unknow logical operator " + sinaOperator);
            }
        };
        ConditionSerializer.prototype.serializeComplexCondition = function (condition) {
            var result = new index_1.Expression({
                operator: this.convertSinaToOdataLogicalOperator(condition.operator),
                items: [],
            });
            var subConditions = condition.conditions;
            for (var i = 0; i < subConditions.length; ++i) {
                var subCondition = subConditions[i];
                result.items.push(this.serialize(subCondition));
            }
            return result;
        };
        ConditionSerializer.prototype.serializeSimpleCondition = function (condition) {
            var type = AttributeType_1.AttributeType.String;
            var metadata;
            if (this.dataSource instanceof DataSource_1.DataSource) {
                metadata = this.dataSource.getAttributeMetadata(condition.attribute);
                if (metadata && metadata.type) {
                    type = metadata.type;
                }
            }
            var conditionValue = typeConverter.sina2Odata(type, condition.value, {
                operator: condition.operator,
            });
            var conditionOperator = this.convertSinaToOdataOperator(condition.operator, metadata);
            return new index_1.Comparison({
                property: condition.attribute,
                operator: conditionOperator,
                value: new index_1.Phrase({ phrase: conditionValue }),
            });
        };
        ConditionSerializer.prototype.serializeBetweenCondition = function (condition) {
            var lowCondition = condition.conditions[0];
            var highCondition = condition.conditions[1];
            var type = AttributeType_1.AttributeType.String;
            if (this.dataSource instanceof DataSource_1.DataSource) {
                var metadata = this.dataSource.getAttributeMetadata(lowCondition.attribute);
                type = metadata.type || AttributeType_1.AttributeType.String;
            }
            var lowValue = typeConverter.sina2Odata(type, lowCondition.value, {
                operator: lowCondition.operator,
            });
            var highValue = typeConverter.sina2Odata(type, highCondition.value, {
                operator: highCondition.operator,
            });
            return new index_1.Expression({
                operator: index_1.SearchQueryLogicalOperator.AND,
                items: [
                    new index_1.Comparison({
                        property: lowCondition.attribute,
                        operator: index_1.SearchQueryComparisonOperator.GreaterThanOrEqualCaseInsensitive,
                        value: new index_1.StringValue({
                            value: lowValue,
                            isQuoted: true,
                        }),
                    }),
                    new index_1.Comparison({
                        property: lowCondition.attribute,
                        operator: index_1.SearchQueryComparisonOperator.LessThanOrEqualCaseInsensitive,
                        value: new index_1.StringValue({
                            value: highValue,
                            isQuoted: true,
                        }),
                    }),
                ],
            });
            // return new Comparison({
            //     property: lowCondition.attribute,
            //     operator: EshObjComparisonOperator.BetweenCaseInsensitive,
            //     value: new RangeValues({
            //         start: lowValue, // currently only support simple types of string and number, will be improved
            //         end: highValue,
            //     }),
            // });
        };
        ConditionSerializer.prototype.serialize = function (condition) {
            if (condition instanceof ComplexCondition_1.ComplexCondition) {
                if (condition.operator === LogicalOperator_1.LogicalOperator.And &&
                    condition.conditions.length > 1 &&
                    // TODO: Enum
                    condition.conditions[0] &&
                    (condition.conditions[0].operator === ComparisonOperator_1.ComparisonOperator.Ge ||
                        condition.conditions[0].operator === ComparisonOperator_1.ComparisonOperator.Gt ||
                        condition.conditions[0].operator === ComparisonOperator_1.ComparisonOperator.Le ||
                        condition.conditions[0].operator === ComparisonOperator_1.ComparisonOperator.Lt)) {
                    return this.serializeBetweenCondition(condition);
                }
                return this.serializeComplexCondition(condition);
            }
            return this.serializeSimpleCondition(condition);
        };
        return ConditionSerializer;
    }());
    exports.ConditionSerializer = ConditionSerializer;
    function serialize(dataSource, condition) {
        var serializer = new ConditionSerializer(dataSource);
        var result = serializer.serialize(condition);
        if (result instanceof index_1.Comparison) {
            result = new index_1.Expression({
                operator: index_1.SearchQueryLogicalOperator.TIGHT_AND,
                items: [result],
            });
        }
        return result;
    }
    exports.serialize = serialize;
});
})();