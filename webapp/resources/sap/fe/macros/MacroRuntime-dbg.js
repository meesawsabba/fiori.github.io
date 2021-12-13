/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)
 *      (c) Copyright 2009-2021 SAP SE. All rights reserved
 */
sap.ui.define([], function () {
  "use strict";

  var _exports = {};

  var parser = new DOMParser();

  var xml = function (strings) {
    var outStr = "";
    var i;

    for (var _len = arguments.length, values = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
      values[_key - 1] = arguments[_key];
    }

    for (i = 0; i < values.length; i++) {
      outStr += strings[i];
      outStr += values[i];
    }

    outStr += strings[i];
    var xmlDoc = parser.parseFromString(outStr, "text/xml");
    return xmlDoc;
  };

  _exports.xml = xml;
  return _exports;
}, false);
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIk1hY3JvUnVudGltZS50cyJdLCJuYW1lcyI6WyJwYXJzZXIiLCJET01QYXJzZXIiLCJ4bWwiLCJzdHJpbmdzIiwib3V0U3RyIiwiaSIsInZhbHVlcyIsImxlbmd0aCIsInhtbERvYyIsInBhcnNlRnJvbVN0cmluZyJdLCJtYXBwaW5ncyI6IjtBQUFBO0FBQ0E7QUFDQTs7Ozs7O0FBRkEsTUFBTUEsTUFBTSxHQUFHLElBQUlDLFNBQUosRUFBZjs7QUFDTyxNQUFNQyxHQUFHLEdBQUcsVUFBQ0MsT0FBRCxFQUFxRDtBQUN2RSxRQUFJQyxNQUFNLEdBQUcsRUFBYjtBQUNBLFFBQUlDLENBQUo7O0FBRnVFLHNDQUFsQkMsTUFBa0I7QUFBbEJBLE1BQUFBLE1BQWtCO0FBQUE7O0FBR3ZFLFNBQUtELENBQUMsR0FBRyxDQUFULEVBQVlBLENBQUMsR0FBR0MsTUFBTSxDQUFDQyxNQUF2QixFQUErQkYsQ0FBQyxFQUFoQyxFQUFvQztBQUNuQ0QsTUFBQUEsTUFBTSxJQUFJRCxPQUFPLENBQUNFLENBQUQsQ0FBakI7QUFDQUQsTUFBQUEsTUFBTSxJQUFJRSxNQUFNLENBQUNELENBQUQsQ0FBaEI7QUFDQTs7QUFDREQsSUFBQUEsTUFBTSxJQUFJRCxPQUFPLENBQUNFLENBQUQsQ0FBakI7QUFDQSxRQUFNRyxNQUFNLEdBQUdSLE1BQU0sQ0FBQ1MsZUFBUCxDQUF1QkwsTUFBdkIsRUFBK0IsVUFBL0IsQ0FBZjtBQUNBLFdBQU9JLE1BQVA7QUFDQSxHQVZNIiwic291cmNlUm9vdCI6Ii4iLCJzb3VyY2VzQ29udGVudCI6WyJjb25zdCBwYXJzZXIgPSBuZXcgRE9NUGFyc2VyKCk7XG5leHBvcnQgY29uc3QgeG1sID0gKHN0cmluZ3M6IFRlbXBsYXRlU3RyaW5nc0FycmF5LCAuLi52YWx1ZXM6IGFueVtdKSA9PiB7XG5cdGxldCBvdXRTdHIgPSBcIlwiO1xuXHRsZXQgaTtcblx0Zm9yIChpID0gMDsgaSA8IHZhbHVlcy5sZW5ndGg7IGkrKykge1xuXHRcdG91dFN0ciArPSBzdHJpbmdzW2ldO1xuXHRcdG91dFN0ciArPSB2YWx1ZXNbaV07XG5cdH1cblx0b3V0U3RyICs9IHN0cmluZ3NbaV07XG5cdGNvbnN0IHhtbERvYyA9IHBhcnNlci5wYXJzZUZyb21TdHJpbmcob3V0U3RyLCBcInRleHQveG1sXCIpO1xuXHRyZXR1cm4geG1sRG9jO1xufTtcbiJdfQ==