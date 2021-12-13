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
sap.ui.define(["require", "exports", "../../core/core"], function (require, exports, core) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.parse = exports.ResultSetParser = void 0;
    var ResultSetParser = /** @class */ (function () {
        function ResultSetParser(options) {
            this.resultSet = options.resultSet;
        }
        ResultSetParser.prototype.parseNamedValue = function (namedValue) {
            var value;
            var name;
            var complexValue;
            for (var prop in namedValue) {
                switch (prop) {
                    case "Name":
                        name = namedValue[prop];
                        break;
                    case "Value":
                        value = namedValue[prop];
                        break;
                    default:
                        if (!complexValue) {
                            complexValue = {};
                        }
                        complexValue[prop] = namedValue[prop];
                }
            }
            if (complexValue) {
                complexValue.Value = value;
                return {
                    name: name,
                    value: complexValue,
                };
            }
            return {
                name: name,
                value: value,
            };
        };
        ResultSetParser.prototype.formatItem = function (item) {
            var list;
            if (item.NamedValues) {
                list = item.NamedValues;
            }
            if (!list) {
                return item;
            }
            var obj = {};
            for (var i = 0; i < list.length; ++i) {
                var namedValue = list[i];
                var parsedNamedValue = this.parseNamedValue(namedValue);
                obj[parsedNamedValue.name] = this.formatItem(parsedNamedValue.value);
            }
            return obj;
        };
        ResultSetParser.prototype.formatItems = function (items) {
            var result = {};
            for (var i = 0; i < items.length; ++i) {
                var item = items[i];
                var formattedItem = this.formatItem(item);
                core.extend(result, formattedItem);
            }
            return result;
        };
        ResultSetParser.prototype.parse = function () {
            // check for data
            if (!this.resultSet.Grids || !this.resultSet.Grids[0] || !this.resultSet.Grids[0].Axes) {
                return {
                    cells: [],
                    axes: [],
                };
            }
            // enhance result set:
            // -> create link to item lists in dimensions of axes
            this.enhance(this.resultSet);
            // get reference to grid,row axis,col axis
            var grid = this.resultSet.Grids[0];
            // parse
            if (grid.Cells.length > 0) {
                return this.parseWithCells(grid);
            }
            return this.parseWithoutCells(grid);
        };
        ResultSetParser.prototype.parseWithCells = function (grid) {
            var result = {
                axes: [],
                cells: [],
            };
            for (var i = 0; i < grid.Cells.length; i++) {
                var cell = grid.Cells[i];
                var items = [];
                for (var j = 0; j < cell.Index.length; j++) {
                    var index = cell.Index[j];
                    var axis = grid.Axes[j];
                    var axisItems = this.resolve(axis, index);
                    items.push.apply(items, axisItems);
                }
                var measureValue = core.extend({}, cell);
                delete measureValue.Index;
                items.push(measureValue);
                result.cells.push(this.formatItems(items));
            }
            return result;
        };
        ResultSetParser.prototype.parseWithoutCells = function (grid) {
            var result = {
                axes: [],
                cells: [],
            };
            for (var i = 0; i < grid.Axes.length; ++i) {
                var axis = grid.Axes[i];
                var axisElements = [];
                result.axes.push(axisElements);
                for (var j = 0; j < axis.Tuples.length; ++j) {
                    var items = this.resolve(axis, j);
                    axisElements.push(this.formatItems(items));
                }
            }
            return result;
        };
        ResultSetParser.prototype.resolve = function (axis, index) {
            var items = [];
            if (axis.Tuples.length === 0) {
                return items;
            }
            var tuples = axis.Tuples[index];
            for (var i = 0; i < tuples.length; ++i) {
                var itemIndex = tuples[i];
                var item = axis.Dimensions[i].ItemList.Items[itemIndex];
                items.push(item);
            }
            return items;
        };
        ResultSetParser.prototype.enhance = function (resultSet) {
            // create dictionary with item lists
            var itemListByName = {};
            for (var i = 0; i < resultSet.ItemLists.length; ++i) {
                var itemList = resultSet.ItemLists[i];
                itemListByName[itemList.Name] = itemList;
            }
            // loop at all dimensions and set link to item list
            for (var h = 0; h < resultSet.Grids.length; ++h) {
                var grid = resultSet.Grids[h];
                for (var j = 0; j < grid.Axes.length; ++j) {
                    var axis = grid.Axes[j];
                    for (var k = 0; k < axis.Dimensions.length; ++k) {
                        var dimension = axis.Dimensions[k];
                        dimension.ItemList = itemListByName[dimension.ItemListName];
                    }
                }
            }
        };
        return ResultSetParser;
    }());
    exports.ResultSetParser = ResultSetParser;
    function parse(resultSet) {
        var parser = new ResultSetParser({
            resultSet: resultSet,
        });
        return parser.parse();
    }
    exports.parse = parse;
});
})();