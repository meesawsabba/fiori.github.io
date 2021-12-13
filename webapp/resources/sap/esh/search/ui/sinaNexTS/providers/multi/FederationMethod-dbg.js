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
sap.ui.define(["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.AdvancedRoundRobin = exports.RoundRobin = exports.Ranking = void 0;
    var Ranking = /** @class */ (function () {
        function Ranking() {
        }
        //sorting method according ranking
        Ranking.prototype.sort = function (resultSetItemList) {
            var results = [];
            for (var j = 0; j < resultSetItemList.length; j++) {
                results = results.concat(resultSetItemList[j]);
            }
            results.sort(function (a, b) {
                var ret = b.score - a.score; //high score is first
                return ret;
            });
            return results;
        };
        return Ranking;
    }());
    exports.Ranking = Ranking;
    var RoundRobin = /** @class */ (function () {
        function RoundRobin() {
        }
        //simple round robin method
        RoundRobin.prototype.sort = function (resultSetItemList) {
            var sortedResults = [];
            for (var i = 0; i < resultSetItemList.length; i++) {
                sortedResults = this.mergeMultiResults(sortedResults, resultSetItemList[i], i + 1);
            }
            return sortedResults;
        };
        RoundRobin.prototype.mergeMultiResults = function (firstResults, secondResults, mergeIndex) {
            if (mergeIndex < 1) {
                return [];
            }
            if (mergeIndex === 1) {
                return secondResults;
            }
            var firstLength = firstResults.length;
            var secondLength = secondResults.length;
            var results = [];
            for (var k = 0; k < firstLength; k++) {
                results.push(firstResults[k]);
            }
            for (var i = 0; i < firstLength; i++) {
                if (i >= secondLength) {
                    break;
                }
                results.splice(mergeIndex * (i + 1) - 1, 0, secondResults[i]);
            }
            if (secondLength > firstLength) {
                results = results.concat(secondResults.slice(firstLength - secondLength));
            }
            return results;
        };
        return RoundRobin;
    }());
    exports.RoundRobin = RoundRobin;
    var AdvancedRoundRobin = /** @class */ (function () {
        function AdvancedRoundRobin() {
        }
        //advanced round robin method
        AdvancedRoundRobin.prototype.sort = function (resultSetItemList) {
            var results = [];
            for (var j = 0; j < resultSetItemList.length; j++) {
                results = results.concat(resultSetItemList[j]);
            }
            var dataSourceId;
            //result list map, key: dataSourceId, value: array list of resultlist
            var dataSourceIdMap = {};
            for (var i = 0; i < results.length; i++) {
                dataSourceId = results[i].dataSource.id;
                if (!dataSourceIdMap[dataSourceId]) {
                    dataSourceIdMap[dataSourceId] = [];
                }
                dataSourceIdMap[dataSourceId].push(results[i]);
            }
            //array of objects: dataSouceId, high score, original index
            var dataSourceScoreArray = [];
            var index = 0;
            for (var key in dataSourceIdMap) {
                var item = dataSourceIdMap[key][0];
                dataSourceId = item.dataSource.id;
                var score = item.score;
                dataSourceScoreArray.push({
                    dataSourceId: dataSourceId,
                    score: score,
                    index: index,
                });
                index++;
            }
            //sort dataSourceScoreArray
            dataSourceScoreArray.sort(function (a, b) {
                var ret = b.score - a.score; //high score is first
                if (ret === 0) {
                    ret = a.index - b.index; //low index is first
                }
                return ret;
            });
            //rebuild the results
            var sortedResults = [];
            var dsIndex = 0;
            for (var r = 0; r < results.length;) {
                var selectDs = dataSourceScoreArray[dsIndex];
                var selectRs = dataSourceIdMap[selectDs.dataSourceId];
                if (selectRs.length > 0) {
                    sortedResults.push(selectRs.shift());
                    r++;
                }
                dsIndex = (dsIndex + 1) % dataSourceScoreArray.length;
            }
            return sortedResults;
        };
        return AdvancedRoundRobin;
    }());
    exports.AdvancedRoundRobin = AdvancedRoundRobin;
});
})();