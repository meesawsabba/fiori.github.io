/*! 
 * SAPUI5

		(c) Copyright 2009-2021 SAP SE. All rights reserved
	 
 */

/* global Proxy, Reflect, Symbol */

(function(){
/* eslint-disable max-classes-per-file */
/** Copyright 2019 SAP SE or an SAP affiliate company. All rights reserved. */
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
sap.ui.define(["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.deserialize = exports.FilterFunction = exports.CustomFunction = exports.DynamicView = exports.Alias = exports.PropertyAlias = exports.SEARCH_DEFAULTS = exports.ESOrderType = exports.ComparisonOperator = exports.SearchQueryComparisonOperator = exports.Expression = exports.SearchQueryPrefixOperator = exports.SearchQueryLogicalOperator = exports.LogicalOperator = exports.Property = exports.Near = exports.Phrase = exports.escapePhrase = exports.Term = exports.ScopeComparison = exports.Comparison = exports.RangeValues = exports.GeometryCollectionValues = exports.MultiPolygonValues = exports.PolygonValues = exports.MultiLineStringValues = exports.CircularStringValues = exports.LineStringValues = exports.MultiPointValues = exports.PointValues = exports.IntersectsOperator = exports.CoveredByOperator = exports.WithinOperator = exports.SpatialReferenceSystemsOperator = exports.InList = exports.InListOperator = exports.NearOperator = exports.HierarchyFacet = exports.ViewParameter = exports.StringValue = exports.NumberValue = exports.BooleanValue = exports.NullValue = exports.ListValues = exports.NearOrdering = exports.existValueInEnum = exports.escapeQueryWithDefaultLength = exports.escapeQueryWithCustomLength = exports.escapeQuery = exports.escapeDoubleQuoteAndBackslash = exports.escapeSingleQuote = void 0;
    var reservedCharacters = ["\\", "-", "(", ")", "~", "^", "?", "\"", ":", "'", "[", "]"]; //add new elements at the end of the array
    var reservedWords = ["AND", "OR", "NOT"];
    function replaceAll(original, search, replacement) {
        return original.split(search).join(replacement);
    }
    var escapeSingleQuote = function (value) {
        return value.replace(/'/g, "''");
    };
    exports.escapeSingleQuote = escapeSingleQuote;
    var escapeDoubleQuoteAndBackslash = function (value) {
        return value.replace(/\\/g, "\\\\").replace(/"/g, "\\\"");
    };
    exports.escapeDoubleQuoteAndBackslash = escapeDoubleQuoteAndBackslash;
    function escapeQuery(query) {
        var escapedQuery = query ? query.trim() : "";
        if (escapedQuery !== "") {
            for (var _i = 0, reservedCharacters_1 = reservedCharacters; _i < reservedCharacters_1.length; _i++) {
                var specialCharacter = reservedCharacters_1[_i];
                if (specialCharacter) {
                    if (specialCharacter === "'") {
                        escapedQuery = exports.escapeSingleQuote(escapedQuery);
                    }
                    else {
                        escapedQuery = replaceAll(escapedQuery, specialCharacter, "\\" + specialCharacter);
                    }
                }
            }
            for (var _a = 0, reservedWords_1 = reservedWords; _a < reservedWords_1.length; _a++) {
                var specialWord = reservedWords_1[_a];
                if (escapedQuery === specialWord) {
                    escapedQuery = "\"" + specialWord + "\"";
                }
                if (escapedQuery.startsWith(specialWord + " ")) {
                    escapedQuery = "\"" + specialWord + "\" " + escapedQuery.substring(specialWord.length + 1);
                }
                if (escapedQuery.endsWith(" " + specialWord)) {
                    escapedQuery = escapedQuery.substring(0, escapedQuery.length - (specialWord.length + 1)) + " \"" + specialWord + "\"";
                }
                //escapedQuery = replaceAll(escapedQuery, " " + specialWord + " ", " \"" + specialWord + "\" ");
                escapedQuery = escapedQuery.replace(new RegExp(" " + specialWord + " ", 'g'), " \"" + specialWord + "\" ");
            }
        }
        //if (escapedQuery === "") {
        //  escapedQuery = " ";
        //}
        return escapedQuery;
    }
    exports.escapeQuery = escapeQuery;
    function escapeQueryWithCustomLength(query, length) {
        return escapeQuery(query).substring(0, length);
    }
    exports.escapeQueryWithCustomLength = escapeQueryWithCustomLength;
    function escapeQueryWithDefaultLength(query) {
        return escapeQuery(query).substring(0, 1500);
    }
    exports.escapeQueryWithDefaultLength = escapeQueryWithDefaultLength;
    function existValueInEnum(type, value) {
        return Object.keys(type).filter(function (k) { return isNaN(Number(k)); }).filter(function (k) { return type[k] === value; }).length > 0;
    }
    exports.existValueInEnum = existValueInEnum;
    var NearOrdering;
    (function (NearOrdering) {
        NearOrdering["Ordered"] = "O";
        NearOrdering["Unordered"] = "U";
    })(NearOrdering = exports.NearOrdering || (exports.NearOrdering = {}));
    var ListValues = /** @class */ (function () {
        function ListValues(item) {
            this.clazz = this.constructor.name;
            this.values = item.values;
        }
        ListValues.prototype.toStatement = function () {
            return "[" + this.values.map(function (value) { return typeof value === "string" ? "'" + exports.escapeSingleQuote(value) + "'" : value.toStatement(); }).join(",") + "]";
        };
        return ListValues;
    }());
    exports.ListValues = ListValues;
    var NullValue = /** @class */ (function () {
        function NullValue() {
            this.clazz = this.constructor.name;
        }
        ;
        NullValue.prototype.toStatement = function () {
            return "null";
        };
        return NullValue;
    }());
    exports.NullValue = NullValue;
    var BooleanValue = /** @class */ (function () {
        function BooleanValue(item) {
            this.clazz = this.constructor.name;
            this.value = item.value;
        }
        ;
        BooleanValue.prototype.toStatement = function () {
            return this.value.toString();
        };
        return BooleanValue;
    }());
    exports.BooleanValue = BooleanValue;
    var NumberValue = /** @class */ (function () {
        function NumberValue(item) {
            this.clazz = this.constructor.name;
            this.value = item.value;
        }
        ;
        NumberValue.prototype.toStatement = function () {
            return String(this.value);
        };
        return NumberValue;
    }());
    exports.NumberValue = NumberValue;
    var StringValue = /** @class */ (function () {
        function StringValue(item) {
            this.clazz = this.constructor.name;
            this.value = item.value;
            this.isQuoted = item.isQuoted;
            this.isSingleQuoted = item.isSingleQuoted;
            this.withoutEnclosing = item.withoutEnclosing;
        }
        ;
        StringValue.prototype.toStatement = function () {
            if (this.withoutEnclosing) {
                return String(Number.parseFloat(this.value));
            }
            if (this.isQuoted) {
                return "\"" + exports.escapeDoubleQuoteAndBackslash(this.value) + "\"";
            }
            if (this.isSingleQuoted) {
                return "'" + exports.escapeSingleQuote(this.value) + "'";
            }
            return this.value;
        };
        return StringValue;
    }());
    exports.StringValue = StringValue;
    var ViewParameter = /** @class */ (function () {
        function ViewParameter(item) {
            this.clazz = this.constructor.name;
            this.param = item.param;
        }
        ViewParameter.prototype.toStatement = function () {
            return "param \"" + exports.escapeDoubleQuoteAndBackslash(this.param) + "\"";
        };
        return ViewParameter;
    }());
    exports.ViewParameter = ViewParameter;
    var HierarchyFacet = /** @class */ (function () {
        function HierarchyFacet(item) {
            this.clazz = this.constructor.name;
            this.facetColumn = item.facetColumn;
            this.rootIds = item.rootIds;
            this.levels = item.levels;
        }
        HierarchyFacet.prototype.toStatement = function () {
            return "(" + this.facetColumn + ",(" + this.rootIds.map(function (id) { return id ? "'" + id + "'" : "null"; }).join(",") + ")," + this.levels + ")";
        };
        return HierarchyFacet;
    }());
    exports.HierarchyFacet = HierarchyFacet;
    var NearOperator = /** @class */ (function () {
        function NearOperator(item) {
            this.clazz = this.constructor.name;
            this.distance = item.distance;
            this.ordering = item.ordering;
        }
        NearOperator.prototype.toStatement = function () {
            return ":NEAR(" + this.distance + (this.ordering ? "," + this.ordering : "") + "):";
        };
        return NearOperator;
    }());
    exports.NearOperator = NearOperator;
    var InListOperator;
    (function (InListOperator) {
        InListOperator["AND"] = "AND";
        InListOperator["OR"] = "OR";
    })(InListOperator = exports.InListOperator || (exports.InListOperator = {}));
    var InList = /** @class */ (function () {
        function InList(item) {
            this.clazz = this.constructor.name;
            this.operator = item.operator;
            this.values = item.values;
        }
        InList.prototype.toStatement = function () {
            return this.operator + "(" + this.values.join(" ") + ")";
        };
        return InList;
    }());
    exports.InList = InList;
    var SpatialReferenceSystemsOperatorBase = /** @class */ (function () {
        function SpatialReferenceSystemsOperatorBase(functionName, id) {
            this.clazz = this.constructor.name;
            this.functionName = functionName;
            this.id = id;
        }
        SpatialReferenceSystemsOperatorBase.prototype.toStatement = function () {
            return ":" + this.functionName + (this.id ? "(" + this.id + ")" : "") + ":";
        };
        return SpatialReferenceSystemsOperatorBase;
    }());
    var SpatialReferenceSystemsOperator = /** @class */ (function () {
        function SpatialReferenceSystemsOperator(item) {
            this.clazz = this.constructor.name;
            this.id = item.id;
        }
        SpatialReferenceSystemsOperator.prototype.toStatement = function () {
            return ":" + (this.id ? "(" + this.id + "):" : "");
        };
        return SpatialReferenceSystemsOperator;
    }());
    exports.SpatialReferenceSystemsOperator = SpatialReferenceSystemsOperator;
    var WithinOperator = /** @class */ (function (_super) {
        __extends(WithinOperator, _super);
        function WithinOperator(item) {
            return _super.call(this, "WITHIN", item.id) || this;
        }
        return WithinOperator;
    }(SpatialReferenceSystemsOperatorBase));
    exports.WithinOperator = WithinOperator;
    var CoveredByOperator = /** @class */ (function (_super) {
        __extends(CoveredByOperator, _super);
        function CoveredByOperator(item) {
            return _super.call(this, "COVERED_BY", item.id) || this;
        }
        return CoveredByOperator;
    }(SpatialReferenceSystemsOperatorBase));
    exports.CoveredByOperator = CoveredByOperator;
    var IntersectsOperator = /** @class */ (function (_super) {
        __extends(IntersectsOperator, _super);
        function IntersectsOperator(item) {
            return _super.call(this, "INTERSECTS", item.id) || this;
        }
        return IntersectsOperator;
    }(SpatialReferenceSystemsOperatorBase));
    exports.IntersectsOperator = IntersectsOperator;
    var pointCoordinates = function (item) { return item.x + " " + item.y; };
    var PointValues = /** @class */ (function () {
        function PointValues(point) {
            this.clazz = this.constructor.name;
            this.point = point;
        }
        PointValues.prototype.toStatement = function () {
            return "POINT(" + pointCoordinates(this.point) + ")";
        };
        return PointValues;
    }());
    exports.PointValues = PointValues;
    var MultiPointValues = /** @class */ (function () {
        function MultiPointValues(points) {
            this.clazz = this.constructor.name;
            this.points = points;
        }
        MultiPointValues.prototype.toStatement = function () {
            return "MULTIPOINT(" + this.points.map(function (point) { return "(" + pointCoordinates(point) + ")"; }).join(",") + ")";
        };
        return MultiPointValues;
    }());
    exports.MultiPointValues = MultiPointValues;
    var LineStringValues = /** @class */ (function () {
        function LineStringValues(points) {
            this.clazz = this.constructor.name;
            this.points = points;
        }
        LineStringValues.prototype.toStatement = function () {
            return "LINESTRING" + LineStringValues.toLineStringArray(this.points);
        };
        LineStringValues.toLineStringArray = function (points) {
            return "(" + points.map(function (point) { return pointCoordinates(point); }).join(", ") + ")";
        };
        return LineStringValues;
    }());
    exports.LineStringValues = LineStringValues;
    var CircularStringValues = /** @class */ (function (_super) {
        __extends(CircularStringValues, _super);
        function CircularStringValues(points) {
            return _super.call(this, points) || this;
        }
        CircularStringValues.prototype.toStatement = function () {
            return "CIRCULARSTRING" + LineStringValues.toLineStringArray(this.points);
        };
        return CircularStringValues;
    }(LineStringValues));
    exports.CircularStringValues = CircularStringValues;
    var MultiLineStringValues = /** @class */ (function () {
        function MultiLineStringValues(points) {
            this.clazz = this.constructor.name;
            this.lineStrings = points;
        }
        MultiLineStringValues.prototype.toStatement = function () {
            return "MULTILINESTRING(" + this.lineStrings.map(function (lineString) { return LineStringValues.toLineStringArray(lineString); }).join(", ") + ")";
        };
        return MultiLineStringValues;
    }());
    exports.MultiLineStringValues = MultiLineStringValues;
    var PolygonValues = /** @class */ (function (_super) {
        __extends(PolygonValues, _super);
        function PolygonValues(points) {
            return _super.call(this, points) || this;
        }
        PolygonValues.prototype.toStatement = function () {
            return "POLYGON" + PolygonValues.toPolygonStringArray(this.lineStrings);
        };
        PolygonValues.toPolygonStringArray = function (polygon) {
            return "(" + polygon.map(function (lineString) { return LineStringValues.toLineStringArray(lineString); }).join(", ") + ")";
        };
        return PolygonValues;
    }(MultiLineStringValues));
    exports.PolygonValues = PolygonValues;
    var MultiPolygonValues = /** @class */ (function () {
        function MultiPolygonValues(polygons) {
            this.clazz = this.constructor.name;
            this.polygons = polygons;
        }
        MultiPolygonValues.prototype.toStatement = function () {
            return "MULTIPOLYGON(" + this.polygons.map(function (polygon) { return PolygonValues.toPolygonStringArray(polygon); }).join(", ") + ")";
        };
        return MultiPolygonValues;
    }());
    exports.MultiPolygonValues = MultiPolygonValues;
    var GeometryCollectionValues = /** @class */ (function () {
        function GeometryCollectionValues(geometryCollection) {
            this.clazz = this.constructor.name;
            this.geometryCollection = geometryCollection;
        }
        GeometryCollectionValues.prototype.toStatement = function () {
            return "GEOMETRYCOLLECTION(" + this.geometryCollection.map(function (geometry) { return geometry.toStatement(); }).join(", ") + ")";
        };
        return GeometryCollectionValues;
    }());
    exports.GeometryCollectionValues = GeometryCollectionValues;
    var RangeValues = /** @class */ (function () {
        function RangeValues(item) {
            this.clazz = this.constructor.name;
            this.start = item.start;
            this.end = item.end;
            this.excludeStart = item.excludeStart;
            this.excludeEnd = item.excludeEnd;
        }
        RangeValues.prototype.toStatement = function () {
            return "" + (this.excludeStart ? "]" : "[") + escapeQuery(this.start.toString()) + " " + escapeQuery(this.end.toString()) + (this.excludeEnd ? "[" : "]");
        };
        return RangeValues;
    }());
    exports.RangeValues = RangeValues;
    var Comparison = /** @class */ (function () {
        function Comparison(item) {
            this.clazz = this.constructor.name;
            this.property = item.property;
            this.operator = item.operator;
            this.value = item.value;
            this.valueAsReservedWord = item.valueAsReservedWord;
            this.searchOptions = item.searchOptions;
        }
        Comparison.prototype.toStatement = function () {
            var escapeValueCharStart = "";
            var escapeValueCharEnd = "";
            /*
            if (existValueInEnum(ComparisonOperator, this.operator)) {
              if (this.valueAsReservedWord) {
                escapeValueCharStart = "";
                escapeValueCharEnd = "";
              } else {
                escapeValueCharStart = "'";
                escapeValueCharEnd = "'";
              }
            } else if (this.operator === SearchQueryComparisonOperator.Fuzzy) {
              escapeValueCharStart = "(";
              escapeValueCharEnd = ")";
            } */
            var isODataComparison = false;
            if (existValueInEnum(ComparisonOperator, this.operator)) {
                isODataComparison = true;
                if (this.value && ((this.value instanceof NullValue) || (this.value instanceof BooleanValue) || (this.value instanceof NumberValue) || (this.value instanceof ListValues) || (this.value instanceof ViewParameter))) {
                    this.valueAsReservedWord = true;
                }
                if (this.valueAsReservedWord) {
                    escapeValueCharStart = "";
                    escapeValueCharEnd = "";
                }
                else {
                    escapeValueCharStart = "'";
                    escapeValueCharEnd = "'";
                }
            }
            var propertyValues = typeof (this.property) === "string" ? this.property : this.property.toStatement();
            var valueQuery = "";
            if (this.value) {
                if (typeof (this.value) === "string") {
                    if (isODataComparison) {
                        valueQuery = exports.escapeSingleQuote(this.value);
                    }
                    else {
                        valueQuery = escapeQuery(this.value.toString());
                    }
                }
                else {
                    valueQuery = this.value.toStatement();
                }
                // valueQuery = typeof (this.value) === "string" ? escapeQuery(this.value.toString()) : this.value.toStatement();
            }
            var comparisonOperator = typeof (this.operator) === "string" ? this.operator : this.operator.toStatement();
            var comparisonStatement = propertyValues + comparisonOperator + escapeValueCharStart + valueQuery + escapeValueCharEnd;
            return addFuzzySearchOptions(comparisonStatement, this.searchOptions);
        };
        return Comparison;
    }());
    exports.Comparison = Comparison;
    var ScopeComparison = /** @class */ (function () {
        function ScopeComparison(item) {
            this.clazz = this.constructor.name;
            this.values = item.values;
        }
        ScopeComparison.prototype.toStatement = function () {
            if (this.values.length === 0) {
                throw new Error("ScopeComparison values cannot be empty");
            }
            return this.values.length > 1 ? "SCOPE:(" + this.values.join(" OR ") + ")" : "SCOPE:" + this.values[0];
        };
        return ScopeComparison;
    }());
    exports.ScopeComparison = ScopeComparison;
    var Term = /** @class */ (function () {
        function Term(item) {
            this.clazz = this.constructor.name;
            this.term = item.term;
            this.searchOptions = item.searchOptions;
            this.isQuoted = item.isQuoted;
            if (typeof (item.doEshEscaping) != 'undefined' && item.doEshEscaping != null) {
                this.doEshEscaping = item.doEshEscaping;
            }
            else {
                this.doEshEscaping = true;
            }
        }
        Term.prototype.toStatement = function () {
            var finalTerm;
            if (this.doEshEscaping) {
                finalTerm = this.isQuoted ? '"' + exports.escapePhrase(this.term) + '"' : escapeQuery(this.term);
            }
            else {
                finalTerm = this.isQuoted ? '"' + this.term + '"' : this.term;
            }
            return addFuzzySearchOptions(finalTerm, this.searchOptions);
        };
        return Term;
    }());
    exports.Term = Term;
    var escapePhrase = function (value) {
        var returnValue = value.replace(/\\/g, '\\\\');
        returnValue = returnValue.replace(/"/g, '\\"');
        // returnValue = returnValue.replace(/\*/g, '\\*'); // do not escape *
        returnValue = returnValue.replace(/\?/g, '\\?');
        returnValue = returnValue.replace(/\'/g, "''");
        return returnValue;
    };
    exports.escapePhrase = escapePhrase;
    var Phrase = /** @class */ (function () {
        function Phrase(item) {
            this.clazz = this.constructor.name;
            this.phrase = item.phrase;
            this.searchOptions = item.searchOptions;
            if (typeof (item.doEshEscaping) != 'undefined' && item.doEshEscaping != null) {
                this.doEshEscaping = item.doEshEscaping;
            }
            else {
                this.doEshEscaping = true;
            }
        }
        Phrase.prototype.toStatement = function () {
            var finalPhrase;
            if (this.doEshEscaping) {
                finalPhrase = exports.escapePhrase(this.phrase);
            }
            else {
                finalPhrase = this.phrase;
            }
            // return addFuzzySearchOptions("\"" + replaceAll(this.phrase, '"', '\\"') + "\"", this.searchOptions);
            // return addFuzzySearchOptions("\"" + this.phrase.replace(/"/g, '\\"') + "\"", this.searchOptions);
            // return addFuzzySearchOptions("\"" + escapePhrase(this.phrase) + "\"", this.searchOptions);
            return addFuzzySearchOptions("\"" + finalPhrase + "\"", this.searchOptions);
        };
        return Phrase;
    }());
    exports.Phrase = Phrase;
    var Near = /** @class */ (function () {
        function Near(item) {
            this.clazz = this.constructor.name;
            this.terms = item.terms;
            this.distance = item.distance;
            this.ordering = item.ordering;
            this.searchOptions = item.searchOptions;
        }
        Near.prototype.toStatement = function () {
            var values = [];
            this.terms.forEach(function (value) {
                values.push(typeof value === "string" ? value : value.toStatement());
            });
            var nearStatement = "NEAR(" + this.distance + (this.ordering ? "," + this.ordering : "") + "):(" + values.join(" ") + ")";
            return addFuzzySearchOptions(nearStatement, this.searchOptions);
        };
        return Near;
    }());
    exports.Near = Near;
    var Property = /** @class */ (function () {
        // searchOptions: ISearchOptions
        function Property(item) {
            this.clazz = this.constructor.name;
            this.property = item.property;
            this.prefixOperator = item.prefixOperator;
        }
        Property.prototype.toStatement = function () {
            if (this.prefixOperator) {
                return this.prefixOperator + " " + this.property;
            }
            return this.property;
        };
        return Property;
    }());
    exports.Property = Property;
    var LogicalOperator;
    (function (LogicalOperator) {
        LogicalOperator["and"] = "and";
        LogicalOperator["or"] = "or";
        LogicalOperator["not"] = "not";
    })(LogicalOperator = exports.LogicalOperator || (exports.LogicalOperator = {}));
    var SearchQueryLogicalOperator;
    (function (SearchQueryLogicalOperator) {
        SearchQueryLogicalOperator["AND"] = "AND";
        SearchQueryLogicalOperator["TIGHT_AND"] = "";
        SearchQueryLogicalOperator["OR"] = "OR";
        SearchQueryLogicalOperator["NOT"] = "NOT";
        SearchQueryLogicalOperator["ROW"] = "ROW";
        SearchQueryLogicalOperator["AUTH"] = "AUTH";
        SearchQueryLogicalOperator["FILTER"] = "FILTER";
        SearchQueryLogicalOperator["FILTERWF"] = "FILTERWF";
        SearchQueryLogicalOperator["BOOST"] = "BOOST";
    })(SearchQueryLogicalOperator = exports.SearchQueryLogicalOperator || (exports.SearchQueryLogicalOperator = {}));
    var SearchQueryPrefixOperator;
    (function (SearchQueryPrefixOperator) {
        SearchQueryPrefixOperator["AND"] = "AND";
        SearchQueryPrefixOperator["OR"] = "OR";
        SearchQueryPrefixOperator["NOT"] = "NOT";
        SearchQueryPrefixOperator["AND_NOT"] = "AND NOT";
        SearchQueryPrefixOperator["OR_NOT"] = "OR NOT";
    })(SearchQueryPrefixOperator = exports.SearchQueryPrefixOperator || (exports.SearchQueryPrefixOperator = {}));
    function addFuzzySearchOptions(item, searchOptions) {
        var returnStatement = item;
        if (searchOptions) {
            if (searchOptions.fuzzinessThreshold) {
                returnStatement = returnStatement + "~" + searchOptions.fuzzinessThreshold.toString();
            }
            if (searchOptions.fuzzySearchOptions) {
                if (!searchOptions.fuzzinessThreshold) {
                    returnStatement = returnStatement + "~0.8"; //default fuzzinessThreshold
                }
                returnStatement = returnStatement + "[" + searchOptions.fuzzySearchOptions + "]";
            }
            if (searchOptions.weight !== undefined) {
                returnStatement = returnStatement + "^" + searchOptions.weight;
            }
        }
        return returnStatement;
    }
    var Expression = /** @class */ (function () {
        function Expression(item) {
            this.clazz = this.constructor.name;
            this.operator = item.operator;
            this.items = item.items;
            this.searchOptions = item.searchOptions;
        }
        Expression.prototype.toStatement = function () {
            var returnStatement = "";
            switch (this.operator) {
                case SearchQueryLogicalOperator.ROW:
                case SearchQueryLogicalOperator.AUTH:
                case SearchQueryLogicalOperator.FILTER:
                case SearchQueryLogicalOperator.FILTERWF:
                case SearchQueryLogicalOperator.BOOST:
                    var operatorValue = this.items.map(function (i) { return i.toStatement(); }).join(" " + this.operator + " ");
                    if (!operatorValue.startsWith("(")) {
                        operatorValue = "(" + operatorValue + ")";
                    }
                    returnStatement = this.operator + ":" + operatorValue;
                    break;
                case SearchQueryLogicalOperator.NOT:
                    if (this.items.length > 1) {
                        throw new Error("Invalid operator. NOT operator is allowed only on a single item.");
                    }
                    returnStatement = "(NOT " + this.items[0].toStatement() + ")";
                    break;
                case LogicalOperator.not:
                    if (this.items.length > 1) {
                        throw new Error("Invalid operator. 'not' operator is allowed only on a single item.");
                    }
                    returnStatement = "not " + this.items[0].toStatement();
                    break;
                default:
                    if (!this.items || this.items.length == 0) {
                        return "";
                    }
                    else if (this.items.length > 1) {
                        var itemsScopes = this.items.filter(function (i) { return (i instanceof ScopeComparison); });
                        if (itemsScopes.length > 0) {
                            returnStatement = this.items.map(function (i) { return i.toStatement(); }).join("" + (this.operator === "" ? " " : " " + this.operator + " "));
                        }
                        else {
                            returnStatement = "(" + this.items.map(function (i) { return i.toStatement(); }).join("" + (this.operator === "" ? " " : " " + this.operator + " ")) + ")";
                        }
                    }
                    else {
                        returnStatement = this.items[0].toStatement();
                    }
                    break;
            }
            return addFuzzySearchOptions(returnStatement, this.searchOptions);
        };
        return Expression;
    }());
    exports.Expression = Expression;
    var SearchQueryComparisonOperator;
    (function (SearchQueryComparisonOperator) {
        // eslint-disable-next-line no-shadow
        SearchQueryComparisonOperator["Search"] = ":";
        SearchQueryComparisonOperator["EqualCaseInsensitive"] = ":EQ:";
        SearchQueryComparisonOperator["NotEqualCaseInsensitive"] = ":NE:";
        SearchQueryComparisonOperator["LessThanCaseInsensitive"] = ":LT:";
        SearchQueryComparisonOperator["LessThanOrEqualCaseInsensitive"] = ":LE:";
        SearchQueryComparisonOperator["GreaterThanCaseInsensitive"] = ":GT:";
        SearchQueryComparisonOperator["GreaterThanOrEqualCaseInsensitive"] = ":GE:";
        SearchQueryComparisonOperator["EqualCaseSensitive"] = ":EQ(S):";
        SearchQueryComparisonOperator["NotEqualCaseSensitive"] = ":NE(S):";
        SearchQueryComparisonOperator["LessThanCaseSensitive"] = ":LT(S):";
        SearchQueryComparisonOperator["LessThanOrEqualCaseSensitive"] = ":LE(S):";
        SearchQueryComparisonOperator["GreaterThanCaseSensitive"] = ":GT(S):";
        SearchQueryComparisonOperator["GreaterThanOrEqualCaseSensitive"] = ":GE(S):";
        SearchQueryComparisonOperator["IsNull"] = ":IS:NULL";
        SearchQueryComparisonOperator["BetweenCaseInsensitive"] = ":BT:";
        SearchQueryComparisonOperator["BetweenCaseSensitive"] = ":BT(S):";
        SearchQueryComparisonOperator["DescendantOf"] = ":DESCENDANT_OF:";
        SearchQueryComparisonOperator["ChildOf"] = ":CHILD_OF:";
    })(SearchQueryComparisonOperator = exports.SearchQueryComparisonOperator || (exports.SearchQueryComparisonOperator = {}));
    var ComparisonOperator;
    (function (ComparisonOperator) {
        ComparisonOperator["Equal"] = " eq ";
        ComparisonOperator["NotEqual"] = " ne ";
        ComparisonOperator["GreaterThan"] = " gt ";
        ComparisonOperator["LessThan"] = " lt ";
        ComparisonOperator["GreaterThanOrEqualTo"] = " ge ";
        ComparisonOperator["LessThanOrEqualTo"] = " le ";
        ComparisonOperator["Is"] = " is ";
        ComparisonOperator["In"] = " in ";
        ComparisonOperator["IsNot"] = " is not ";
    })(ComparisonOperator = exports.ComparisonOperator || (exports.ComparisonOperator = {}));
    var ESOrderType;
    (function (ESOrderType) {
        ESOrderType["Ascending"] = "ASC";
        ESOrderType["Descending"] = "DESC";
    })(ESOrderType = exports.ESOrderType || (exports.ESOrderType = {}));
    exports.SEARCH_DEFAULTS = {
        query: "",
        scope: "",
    };
    var PropertyAlias = /** @class */ (function () {
        function PropertyAlias(item) {
            this.clazz = this.constructor.name;
            this.path = item.path;
            this.alias = item.alias;
        }
        PropertyAlias.prototype.toStatement = function () {
            return this.path.join(".") + " " + this.alias;
            // return `${this.path.map((item)=> "\"" + escapeDoubleQuoteAndBackslash(item) + "\"").join(".")} ${this.alias}`;
        };
        return PropertyAlias;
    }());
    exports.PropertyAlias = PropertyAlias;
    var Alias = /** @class */ (function () {
        function Alias(item) {
            this.clazz = this.constructor.name;
            this.type = item.type;
            this.alias = item.alias;
        }
        Alias.prototype.toStatement = function () {
            return this.type + " " + this.alias;
            // return `"${escapeDoubleQuoteAndBackslash(this.type)}" ${this.alias}`;
        };
        return Alias;
    }());
    exports.Alias = Alias;
    var DynamicView = /** @class */ (function () {
        function DynamicView(item) {
            this.clazz = this.constructor.name;
            this.name = item.name;
            this.select = item.select;
            this.aliases = item.aliases;
            this.properties = item.properties;
            this.paths = item.paths;
            this.conditions = item.conditions;
        }
        DynamicView.prototype.toStatement = function () {
            var returnValue = {
                name: this.name,
                select: this.select.join(", "),
            };
            var listOfAliases = [];
            if (this.aliases) {
                returnValue.aliases = this.aliases.map(function (alias) { return alias.toStatement(); }).join(", ");
                listOfAliases = this.aliases.map(function (item) { return item.alias; });
            }
            returnValue.properties = this.properties.map(function (property) { return property.toStatement(); }).join(", ");
            returnValue.paths = this.paths.map(function (paths) { return paths.map(function (path) { return (typeof (path) === 'string') ? path : path.join("."); }).join('/'); }).join(", ");
            if (this.conditions) {
                returnValue.conditions = this.conditions.map(function (condition) { return condition.toStatement(); }).join(", ");
            }
            return Object.keys(returnValue).map(function (key) { return key + ": " + returnValue[key]; }).join("; ") + ";";
        };
        return DynamicView;
    }());
    exports.DynamicView = DynamicView;
    var CustomFunction = /** @class */ (function () {
        function CustomFunction(item) {
            this.clazz = this.constructor.name;
            this.name = item.name;
            this.arguments = item.arguments;
        }
        CustomFunction.prototype.toStatement = function () {
            var _this = this;
            var argumentsValue = '';
            if (this.arguments) {
                argumentsValue = Object.keys(this.arguments).map(function (key) {
                    var singleArgumentValue = key + "=";
                    if (_this.arguments && typeof (_this.arguments[key]) === 'string') {
                        singleArgumentValue = "'" + exports.escapeSingleQuote(_this.arguments[key]) + "'";
                    }
                    else if (_this.arguments && _this.arguments[key] && typeof (_this.arguments[key]) === 'object') {
                        if (typeof (_this.arguments[key].toStatement) === "function") {
                            if (_this.arguments[key] instanceof CustomFunction || _this.arguments[key] instanceof FilterFunction) {
                                singleArgumentValue = _this.arguments[key].toStatement();
                            }
                            else {
                                if (_this.arguments[key] instanceof NumberValue) {
                                    singleArgumentValue = _this.arguments[key].toStatement();
                                }
                                else {
                                    singleArgumentValue = "'" + _this.arguments[key].toStatement() + "'";
                                }
                            }
                        }
                        else if (Array.isArray(_this.arguments[key])) {
                            singleArgumentValue = "[" + _this.arguments[key].map(function (element) {
                                if (element instanceof NumberValue) {
                                    return element.toStatement();
                                }
                                else if (typeof (element) === 'string') {
                                    return "'" + exports.escapeSingleQuote(element) + "'";
                                }
                                else {
                                    return String(element);
                                }
                            }).join(",") + "]";
                        }
                        else {
                            throw new Error("Unexpected object: " + _this.arguments[key]);
                        }
                    }
                    else {
                        singleArgumentValue = String(_this.arguments ? String(_this.arguments[key]) : '');
                    }
                    return key + "=" + singleArgumentValue;
                }).join(",");
            }
            return (typeof (this.name) === "string" ? this.name : this.name.join(".")) + "(" + argumentsValue + ")";
        };
        return CustomFunction;
    }());
    exports.CustomFunction = CustomFunction;
    var FilterFunction = /** @class */ (function () {
        function FilterFunction(item) {
            this.clazz = this.constructor.name;
            this.customFunction = item.customFunction;
            this.oDataFilter = item.oDataFilter;
        }
        FilterFunction.prototype.toStatement = function () {
            var returnStatement;
            if (this.customFunction instanceof Expression) {
                var expressionStatement = "Search.search(query='" + this.customFunction.toStatement() + "')";
                if (this.oDataFilter) {
                    expressionStatement += " and " + this.oDataFilter.toStatement();
                }
                returnStatement = "filter(" + expressionStatement + ")";
            }
            else {
                returnStatement = "filter(" + this.customFunction.toStatement();
                if (this.oDataFilter) {
                    returnStatement += " and " + this.oDataFilter.toStatement();
                }
                returnStatement += ")";
            }
            return returnStatement;
        };
        return FilterFunction;
    }());
    exports.FilterFunction = FilterFunction;
    var deserialize = function (jsonO) {
        //const jsonO = JSON.parse(jsonStr);
        if (typeof jsonO === "object") {
            switch (jsonO.clazz) {
                case "Property":
                    return new Property(jsonO);
                case "Near":
                    jsonO.terms = jsonO.terms.map(function (item) { return exports.deserialize(item); });
                    return new Near(jsonO);
                case "Phrase":
                    return new Phrase(jsonO);
                case "RangeValues":
                    return new RangeValues(jsonO);
                case "GeometryCollectionValues":
                    return new GeometryCollectionValues(jsonO.geometryCollection.map(function (item) { return exports.deserialize(item); }));
                case "MultiPolygonValues":
                    return new MultiPolygonValues(jsonO.polygons);
                case "MultiLineStringValues":
                    return new MultiLineStringValues(jsonO.lineStrings);
                case "CircularStringValues":
                    return new CircularStringValues(jsonO.points);
                case "LineStringValues":
                    return new LineStringValues(jsonO.points);
                case "MultiPointValues":
                    return new MultiPointValues(jsonO.points);
                case "PointValues":
                    return new PointValues(jsonO.point);
                case "SpatialReferenceSystemsOperator":
                    return new SpatialReferenceSystemsOperator(jsonO);
                case "SpatialReferenceSystemsOperatorBase":
                    return new SpatialReferenceSystemsOperatorBase(jsonO);
                case "InList":
                    return new InList(jsonO);
                case "NearOperator":
                    return new NearOperator(jsonO);
                case "Term":
                    return new Term(jsonO);
                case "HierarchyFacet":
                    return new HierarchyFacet(jsonO);
                case "Comparison":
                    var deserializedComparison = new Comparison(jsonO);
                    if (typeof deserializedComparison.property === "object") {
                        deserializedComparison.property = exports.deserialize(deserializedComparison.property);
                    }
                    if (deserializedComparison.operator && typeof deserializedComparison.operator === "object") {
                        deserializedComparison.operator = exports.deserialize(deserializedComparison.operator);
                    }
                    if (deserializedComparison.value && typeof deserializedComparison.value === "object") {
                        deserializedComparison.value = exports.deserialize(deserializedComparison.value);
                    }
                    return deserializedComparison;
                case "ScopeComparison":
                    return new ScopeComparison(jsonO);
                case "WithinOperator":
                    return new WithinOperator(jsonO);
                case "PolygonValues":
                    return new PolygonValues(jsonO.lineStrings);
                case "CoveredByOperator":
                    return new CoveredByOperator(jsonO);
                case "IntersectsOperator":
                    return new IntersectsOperator(jsonO);
                case "Expression":
                    var returnExpression = new Expression(jsonO);
                    returnExpression.items = returnExpression.items.map(function (item) { return exports.deserialize(item); });
                    return returnExpression;
                case "DynamicView":
                    var returnDynamicView = new DynamicView(jsonO);
                    returnDynamicView.properties = returnDynamicView.properties.map(function (property) { return exports.deserialize(property); });
                    if (returnDynamicView.aliases) {
                        returnDynamicView.aliases = returnDynamicView.aliases.map(function (alias) { return exports.deserialize(alias); });
                    }
                    if (returnDynamicView.conditions) {
                        if (Array.isArray(returnDynamicView.conditions)) {
                            returnDynamicView.conditions = returnDynamicView.conditions.map(function (condition) { return exports.deserialize(condition); });
                        }
                        else {
                            returnDynamicView.conditions = exports.deserialize(returnDynamicView.conditions);
                        }
                    }
                    return returnDynamicView;
                case "Alias":
                    return new Alias(jsonO);
                case "PropertyAlias":
                    return new PropertyAlias(jsonO);
                case "ListValues":
                    var returnValue = new ListValues(jsonO);
                    returnValue.values = returnValue.values.map(function (element) { return exports.deserialize(element); });
                    return returnValue;
                case "ViewParameter":
                    return new ViewParameter(jsonO);
                case "NullValue":
                    return new NullValue();
                case "BooleanValue":
                    return new BooleanValue(jsonO);
                case "NumberValue":
                    return new NumberValue(jsonO);
                case "StringValue":
                    return new StringValue(jsonO);
                case "CustomFunction":
                    var returnCustomFunction_1 = new CustomFunction(jsonO);
                    if (returnCustomFunction_1.arguments) {
                        Object.keys(returnCustomFunction_1.arguments).map(function (key) {
                            if (returnCustomFunction_1.arguments && typeof (returnCustomFunction_1.arguments[key]) === 'object' && typeof (returnCustomFunction_1.arguments[key].clazz) === "string") {
                                if (["CustomFunction", "FilterFunction"].includes(returnCustomFunction_1.arguments[key].clazz)) {
                                    returnCustomFunction_1.arguments[key] = exports.deserialize(returnCustomFunction_1.arguments[key]);
                                }
                                else {
                                    throw new Error("Invalid statement in: " + key + " = " + returnCustomFunction_1.arguments[key]);
                                }
                            }
                        });
                    }
                    return returnCustomFunction_1;
                case "FilterFunction":
                    var returnFilterFunction = new FilterFunction(jsonO);
                    returnFilterFunction.customFunction = exports.deserialize(returnFilterFunction.customFunction);
                    if (returnFilterFunction.oDataFilter) {
                        returnFilterFunction.oDataFilter = exports.deserialize(returnFilterFunction.oDataFilter);
                    }
                    return returnFilterFunction;
                default:
                    throw new Error("not implemented: " + JSON.stringify(jsonO));
            }
        }
        return jsonO;
    };
    exports.deserialize = deserialize;
});
})();