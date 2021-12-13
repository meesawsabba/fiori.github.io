/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)
 *      (c) Copyright 2009-2021 SAP SE. All rights reserved
 */
sap.ui.define([], function () {
  "use strict";

  var _exports = {};

  var Placement;

  (function (Placement) {
    Placement["After"] = "After";
    Placement["Before"] = "Before";
    Placement["End"] = "End";
  })(Placement || (Placement = {}));

  _exports.Placement = Placement;

  /**
   * Recursive method that order the keys based on a position information.
   *
   * @param positioningItems
   * @param anchor
   * @param sorted
   * @param visited
   * @returns {number} The order of the current item
   */
  var orderPositioningItemRecursively = function (positioningItems, anchor, sorted, visited) {
    var insertIndex = sorted.indexOf(anchor);

    if (insertIndex !== -1) {
      return insertIndex;
    }

    var anchorItem = positioningItems[anchor];

    if (anchorItem === undefined) {
      //return sorted.length;
      throw new Error("position anchor not found: " + anchor);
    }

    visited[anchor] = anchorItem;

    if (anchorItem && !(anchorItem.anchor in visited)) {
      insertIndex = orderPositioningItemRecursively(positioningItems, anchorItem.anchor, sorted, visited);

      if (anchorItem.placement !== Placement.Before) {
        ++insertIndex;
      }
    } else {
      insertIndex = sorted.length;
    }

    sorted.splice(insertIndex, 0, anchor);
    return insertIndex;
  };

  function isArrayConfig(config) {
    return typeof config === "object";
  }

  function applyOverride(overwritableKeys, sourceItem, customElement) {
    var outItem = sourceItem || customElement;

    for (var overwritableKey in overwritableKeys) {
      if (Object.hasOwnProperty.call(overwritableKeys, overwritableKey)) {
        var overrideConfig = overwritableKeys[overwritableKey];

        if (sourceItem !== null) {
          switch (overrideConfig) {
            case "overwrite":
              if (customElement.hasOwnProperty(overwritableKey) && customElement[overwritableKey] !== undefined) {
                sourceItem[overwritableKey] = customElement[overwritableKey];
              }

              break;

            case "merge":
            default:
              var subItem = sourceItem[overwritableKey] || [];
              var subConfig = {};

              if (isArrayConfig(overrideConfig)) {
                subConfig = overrideConfig;
              }

              if (Array.isArray(subItem)) {
                sourceItem[overwritableKey] = insertCustomElements(subItem, customElement && customElement[overwritableKey] || {}, subConfig);
              }

              break;
          }
        } else {
          switch (overrideConfig) {
            case "overwrite":
              if (customElement.hasOwnProperty(overwritableKey) && customElement[overwritableKey] !== undefined) {
                outItem[overwritableKey] = customElement[overwritableKey];
              }

              break;

            case "merge":
            default:
              var _subConfig = {};

              if (isArrayConfig(overrideConfig)) {
                _subConfig = overrideConfig;
              }

              outItem[overwritableKey] = insertCustomElements([], customElement && customElement[overwritableKey] || {}, _subConfig);
              break;
          }
        }
      }
    }

    return outItem;
  }
  /**
   * Insert a set of custom elements in the right position in an original collection.
   *
   * @template T
   * @param rootElements A list of "ConfigurableObject" which means object that have a unique "key"
   * @param customElements An object containing extra object to add, they are indexed by a key and have a "position" object
   * @param overwritableKeys The list of keys from the original object that can be overwritten in case a custom element has the same "key"
   * @returns {T[]} An ordered array of elements including the custom ones
   */


  function insertCustomElements(rootElements, customElements) {
    var overwritableKeys = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
    var firstAnchor = rootElements.length ? rootElements[0].key : null;
    var rootElementsWithoutLast = rootElements.filter(function (rootElement) {
      var _rootElement$position;

      return ((_rootElement$position = rootElement.position) === null || _rootElement$position === void 0 ? void 0 : _rootElement$position.placement) !== Placement.End;
    });
    var lastAnchor = rootElements.length ? rootElements[rootElementsWithoutLast.length - 1].key : null;
    var endElement;
    var positioningItems = {};
    var itemsPerKey = {};
    rootElements.forEach(function (rootElement) {
      var _rootElement$position2;

      if (((_rootElement$position2 = rootElement.position) === null || _rootElement$position2 === void 0 ? void 0 : _rootElement$position2.placement) === Placement.End && !endElement) {
        endElement = rootElement;
      } else {
        var _rootElement$position3, _rootElement$position4;

        positioningItems[rootElement.key] = {
          anchor: ((_rootElement$position3 = rootElement.position) === null || _rootElement$position3 === void 0 ? void 0 : _rootElement$position3.anchor) || rootElement.key,
          placement: ((_rootElement$position4 = rootElement.position) === null || _rootElement$position4 === void 0 ? void 0 : _rootElement$position4.placement) || Placement.After
        };
      }

      itemsPerKey[rootElement.key] = rootElement;
    });
    Object.keys(customElements).forEach(function (customElementKey) {
      var _customElement$menu;

      var customElement = customElements[customElementKey];
      var anchor = customElement.position.anchor; // If no placement defined we are After

      if (!customElement.position.placement) {
        customElement.position.placement = Placement.After;
      } // If no anchor we're either After the last anchor or Before the first


      if (!anchor) {
        var potentialAnchor = customElement.position.placement === Placement.After ? lastAnchor : firstAnchor;
        customElement.position.anchor = potentialAnchor ? potentialAnchor : customElementKey;
      } // Adding bound/unbound actions to menu


      customElement.menu = customElement === null || customElement === void 0 ? void 0 : (_customElement$menu = customElement.menu) === null || _customElement$menu === void 0 ? void 0 : _customElement$menu.map(function (menu) {
        var _itemsPerKey$menu$key;

        return (_itemsPerKey$menu$key = itemsPerKey[menu.key]) !== null && _itemsPerKey$menu$key !== void 0 ? _itemsPerKey$menu$key : menu;
      });

      if (itemsPerKey[customElement.key]) {
        itemsPerKey[customElement.key] = applyOverride(overwritableKeys, itemsPerKey[customElement.key], customElement); //Position is overwritten for filter fields if there is a change in manifest

        if (anchor && customElement.position && overwritableKeys.position && overwritableKeys.position === "overwrite") {
          positioningItems[customElement.key] = itemsPerKey[customElement.key].position;
        }
        /**
         * anchor check is added to make sure change in properties in the manifest does not affect the position of the field.
         * Otherwise, when no position is mentioned in manifest for an altered field, the position is changed as
         * per the potential anchor
         */

      } else {
        itemsPerKey[customElement.key] = applyOverride(overwritableKeys, null, customElement);
        positioningItems[customElement.key] = customElement.position;
      }
    });
    var sortedKeys = [];
    Object.keys(positioningItems).forEach(function (positionItemKey) {
      orderPositioningItemRecursively(positioningItems, positionItemKey, sortedKeys, {});
    });
    var outElements = sortedKeys.map(function (key) {
      return itemsPerKey[key];
    });

    if (endElement) {
      outElements.push(endElement);
    }

    return outElements;
  }

  _exports.insertCustomElements = insertCustomElements;
  return _exports;
}, false);
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIkNvbmZpZ3VyYWJsZU9iamVjdC50cyJdLCJuYW1lcyI6WyJQbGFjZW1lbnQiLCJvcmRlclBvc2l0aW9uaW5nSXRlbVJlY3Vyc2l2ZWx5IiwicG9zaXRpb25pbmdJdGVtcyIsImFuY2hvciIsInNvcnRlZCIsInZpc2l0ZWQiLCJpbnNlcnRJbmRleCIsImluZGV4T2YiLCJhbmNob3JJdGVtIiwidW5kZWZpbmVkIiwiRXJyb3IiLCJwbGFjZW1lbnQiLCJCZWZvcmUiLCJsZW5ndGgiLCJzcGxpY2UiLCJpc0FycmF5Q29uZmlnIiwiY29uZmlnIiwiYXBwbHlPdmVycmlkZSIsIm92ZXJ3cml0YWJsZUtleXMiLCJzb3VyY2VJdGVtIiwiY3VzdG9tRWxlbWVudCIsIm91dEl0ZW0iLCJvdmVyd3JpdGFibGVLZXkiLCJPYmplY3QiLCJoYXNPd25Qcm9wZXJ0eSIsImNhbGwiLCJvdmVycmlkZUNvbmZpZyIsInN1Ykl0ZW0iLCJzdWJDb25maWciLCJBcnJheSIsImlzQXJyYXkiLCJpbnNlcnRDdXN0b21FbGVtZW50cyIsInJvb3RFbGVtZW50cyIsImN1c3RvbUVsZW1lbnRzIiwiZmlyc3RBbmNob3IiLCJrZXkiLCJyb290RWxlbWVudHNXaXRob3V0TGFzdCIsImZpbHRlciIsInJvb3RFbGVtZW50IiwicG9zaXRpb24iLCJFbmQiLCJsYXN0QW5jaG9yIiwiZW5kRWxlbWVudCIsIml0ZW1zUGVyS2V5IiwiZm9yRWFjaCIsIkFmdGVyIiwia2V5cyIsImN1c3RvbUVsZW1lbnRLZXkiLCJwb3RlbnRpYWxBbmNob3IiLCJtZW51IiwibWFwIiwic29ydGVkS2V5cyIsInBvc2l0aW9uSXRlbUtleSIsIm91dEVsZW1lbnRzIiwicHVzaCJdLCJtYXBwaW5ncyI6IjtBQUFBO0FBQ0E7QUFDQTs7Ozs7O01BR1lBLFM7O2FBQUFBLFM7QUFBQUEsSUFBQUEsUztBQUFBQSxJQUFBQSxTO0FBQUFBLElBQUFBLFM7S0FBQUEsUyxLQUFBQSxTOzs7O0FBcUJaO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7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LEdBQWYsQ0FBaEIsR0FBc0NRLFdBQVcsQ0FBQ3ZCLGFBQWEsQ0FBQ2UsR0FBZixDQUFYLENBQStCSSxRQUFyRTtBQUNBO0FBQ0Q7QUFDSDtBQUNBO0FBQ0E7QUFDQTs7QUFDRyxPQVpELE1BWU87QUFDTkksUUFBQUEsV0FBVyxDQUFDdkIsYUFBYSxDQUFDZSxHQUFmLENBQVgsR0FBaUNsQixhQUFhLENBQUNDLGdCQUFELEVBQW1CLElBQW5CLEVBQXlCRSxhQUF6QixDQUE5QztBQUNBbEIsUUFBQUEsZ0JBQWdCLENBQUNrQixhQUFhLENBQUNlLEdBQWYsQ0FBaEIsR0FBc0NmLGFBQWEsQ0FBQ21CLFFBQXBEO0FBQ0E7QUFDRCxLQWxDRDtBQW1DQSxRQUFNWSxVQUFvQixHQUFHLEVBQTdCO0FBRUE1QixJQUFBQSxNQUFNLENBQUN1QixJQUFQLENBQVk1QyxnQkFBWixFQUE4QjBDLE9BQTlCLENBQXNDLFVBQUFRLGVBQWUsRUFBSTtBQUN4RG5ELE1BQUFBLCtCQUErQixDQUFDQyxnQkFBRCxFQUFtQmtELGVBQW5CLEVBQW9DRCxVQUFwQyxFQUFnRCxFQUFoRCxDQUEvQjtBQUNBLEtBRkQ7QUFJQSxRQUFNRSxXQUFXLEdBQUdGLFVBQVUsQ0FBQ0QsR0FBWCxDQUFlLFVBQUFmLEdBQUc7QUFBQSxhQUFJUSxXQUFXLENBQUNSLEdBQUQsQ0FBZjtBQUFBLEtBQWxCLENBQXBCOztBQUNBLFFBQUlPLFVBQUosRUFBZ0I7QUFDZlcsTUFBQUEsV0FBVyxDQUFDQyxJQUFaLENBQWlCWixVQUFqQjtBQUNBOztBQUNELFdBQU9XLFdBQVA7QUFDQSIsInNvdXJjZVJvb3QiOiIuIiwic291cmNlc0NvbnRlbnQiOlsiZXhwb3J0IHR5cGUgUG9zaXRpb24gPSB7XG5cdGFuY2hvcj86IHN0cmluZztcblx0cGxhY2VtZW50OiBQbGFjZW1lbnQ7XG59O1xuXG5leHBvcnQgZW51bSBQbGFjZW1lbnQge1xuXHRBZnRlciA9IFwiQWZ0ZXJcIixcblx0QmVmb3JlID0gXCJCZWZvcmVcIixcblx0RW5kID0gXCJFbmRcIlxufVxuZXhwb3J0IHR5cGUgQ29uZmlndXJhYmxlT2JqZWN0S2V5ID0gc3RyaW5nO1xuZXhwb3J0IHR5cGUgQ29uZmlndXJhYmxlT2JqZWN0ID0gUG9zaXRpb25hYmxlICYge1xuXHRrZXk6IENvbmZpZ3VyYWJsZU9iamVjdEtleTtcbn07XG5cbmV4cG9ydCB0eXBlIEN1c3RvbUVsZW1lbnQ8VCBleHRlbmRzIENvbmZpZ3VyYWJsZU9iamVjdD4gPSBUICYge1xuXHRwb3NpdGlvbjogUG9zaXRpb247XG5cdG1lbnU/OiBhbnlbXSB8IHVuZGVmaW5lZDtcbn07XG5cbmV4cG9ydCB0eXBlIFBvc2l0aW9uYWJsZSA9IHtcblx0cG9zaXRpb24/OiBQb3NpdGlvbjtcbn07XG5cbmV4cG9ydCB0eXBlIENvbmZpZ3VyYWJsZVJlY29yZDxUPiA9IFJlY29yZDxDb25maWd1cmFibGVPYmplY3RLZXksIFQ+O1xuXG4vKipcbiAqIFJlY3Vyc2l2ZSBtZXRob2QgdGhhdCBvcmRlciB0aGUga2V5cyBiYXNlZCBvbiBhIHBvc2l0aW9uIGluZm9ybWF0aW9uLlxuICpcbiAqIEBwYXJhbSBwb3NpdGlvbmluZ0l0ZW1zXG4gKiBAcGFyYW0gYW5jaG9yXG4gKiBAcGFyYW0gc29ydGVkXG4gKiBAcGFyYW0gdmlzaXRlZFxuICogQHJldHVybnMge251bWJlcn0gVGhlIG9yZGVyIG9mIHRoZSBjdXJyZW50IGl0ZW1cbiAqL1xuY29uc3Qgb3JkZXJQb3NpdGlvbmluZ0l0ZW1SZWN1cnNpdmVseSA9IChcblx0cG9zaXRpb25pbmdJdGVtczogUmVjb3JkPHN0cmluZywgUmVxdWlyZWQ8UG9zaXRpb24+Pixcblx0YW5jaG9yOiBzdHJpbmcsXG5cdHNvcnRlZDogc3RyaW5nW10sXG5cdHZpc2l0ZWQ6IFJlY29yZDxzdHJpbmcsIFJlcXVpcmVkPFBvc2l0aW9uPj5cbik6IG51bWJlciA9PiB7XG5cdGxldCBpbnNlcnRJbmRleCA9IHNvcnRlZC5pbmRleE9mKGFuY2hvcik7XG5cdGlmIChpbnNlcnRJbmRleCAhPT0gLTEpIHtcblx0XHRyZXR1cm4gaW5zZXJ0SW5kZXg7XG5cdH1cblx0Y29uc3QgYW5jaG9ySXRlbTogUmVxdWlyZWQ8UG9zaXRpb24+ID0gcG9zaXRpb25pbmdJdGVtc1thbmNob3JdO1xuXHRpZiAoYW5jaG9ySXRlbSA9PT0gdW5kZWZpbmVkKSB7XG5cdFx0Ly9yZXR1cm4gc29ydGVkLmxlbmd0aDtcblx0XHR0aHJvdyBuZXcgRXJyb3IoXCJwb3NpdGlvbiBhbmNob3Igbm90IGZvdW5kOiBcIiArIGFuY2hvcik7XG5cdH1cblxuXHR2aXNpdGVkW2FuY2hvcl0gPSBhbmNob3JJdGVtO1xuXHRpZiAoYW5jaG9ySXRlbSAmJiAhKGFuY2hvckl0ZW0uYW5jaG9yIGluIHZpc2l0ZWQpKSB7XG5cdFx0aW5zZXJ0SW5kZXggPSBvcmRlclBvc2l0aW9uaW5nSXRlbVJlY3Vyc2l2ZWx5KHBvc2l0aW9uaW5nSXRlbXMsIGFuY2hvckl0ZW0uYW5jaG9yLCBzb3J0ZWQsIHZpc2l0ZWQpO1xuXHRcdGlmIChhbmNob3JJdGVtLnBsYWNlbWVudCAhPT0gUGxhY2VtZW50LkJlZm9yZSkge1xuXHRcdFx0KytpbnNlcnRJbmRleDtcblx0XHR9XG5cdH0gZWxzZSB7XG5cdFx0aW5zZXJ0SW5kZXggPSBzb3J0ZWQubGVuZ3RoO1xuXHR9XG5cblx0c29ydGVkLnNwbGljZShpbnNlcnRJbmRleCwgMCwgYW5jaG9yKTtcblx0cmV0dXJuIGluc2VydEluZGV4O1xufTtcblxudHlwZSBPdmVycmlkZVR5cGUgPSBcIm1lcmdlXCIgfCBcIm92ZXJ3cml0ZVwiIHwgXCJpZ25vcmVcIjtcbnR5cGUgQXJyYXlPdmVycmlkZVR5cGU8QXJyYXlUeXBlPiA9IE92ZXJyaWRlS2V5czxBcnJheVR5cGU+O1xuXG50eXBlIEVsZW1lbnRUeXBlPFQ+ID0gVCBleHRlbmRzIGFueVtdID8gVFtudW1iZXJdIDogVDtcbnR5cGUgT3ZlcnJpZGVLZXlzPFQ+ID0ge1xuXHRbUCBpbiBrZXlvZiBUXT86IE92ZXJyaWRlVHlwZSB8IEFycmF5T3ZlcnJpZGVUeXBlPEVsZW1lbnRUeXBlPFRbUF0+Pjtcbn07XG5cbmZ1bmN0aW9uIGlzQXJyYXlDb25maWc8VD4oY29uZmlnOiBPdmVycmlkZVR5cGUgfCBBcnJheU92ZXJyaWRlVHlwZTxUPiB8IHVuZGVmaW5lZCk6IGNvbmZpZyBpcyBBcnJheU92ZXJyaWRlVHlwZTxUPiB7XG5cdHJldHVybiB0eXBlb2YgY29uZmlnID09PSBcIm9iamVjdFwiO1xufVxuXG5mdW5jdGlvbiBhcHBseU92ZXJyaWRlPFQgZXh0ZW5kcyBPYmplY3Q+KG92ZXJ3cml0YWJsZUtleXM6IE92ZXJyaWRlS2V5czxUPiwgc291cmNlSXRlbTogVCB8IG51bGwsIGN1c3RvbUVsZW1lbnQ6IFQpOiBUIHtcblx0Y29uc3Qgb3V0SXRlbTogVCA9IHNvdXJjZUl0ZW0gfHwgY3VzdG9tRWxlbWVudDtcblx0Zm9yIChjb25zdCBvdmVyd3JpdGFibGVLZXkgaW4gb3ZlcndyaXRhYmxlS2V5cykge1xuXHRcdGlmIChPYmplY3QuaGFzT3duUHJvcGVydHkuY2FsbChvdmVyd3JpdGFibGVLZXlzLCBvdmVyd3JpdGFibGVLZXkpKSB7XG5cdFx0XHRjb25zdCBvdmVycmlkZUNvbmZpZyA9IG92ZXJ3cml0YWJsZUtleXNbb3ZlcndyaXRhYmxlS2V5XTtcblx0XHRcdGlmIChzb3VyY2VJdGVtICE9PSBudWxsKSB7XG5cdFx0XHRcdHN3aXRjaCAob3ZlcnJpZGVDb25maWcpIHtcblx0XHRcdFx0XHRjYXNlIFwib3ZlcndyaXRlXCI6XG5cdFx0XHRcdFx0XHRpZiAoY3VzdG9tRWxlbWVudC5oYXNPd25Qcm9wZXJ0eShvdmVyd3JpdGFibGVLZXkpICYmIGN1c3RvbUVsZW1lbnRbb3ZlcndyaXRhYmxlS2V5XSAhPT0gdW5kZWZpbmVkKSB7XG5cdFx0XHRcdFx0XHRcdHNvdXJjZUl0ZW1bb3ZlcndyaXRhYmxlS2V5XSA9IGN1c3RvbUVsZW1lbnRbb3ZlcndyaXRhYmxlS2V5XTtcblx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdGJyZWFrO1xuXHRcdFx0XHRcdGNhc2UgXCJtZXJnZVwiOlxuXHRcdFx0XHRcdGRlZmF1bHQ6XG5cdFx0XHRcdFx0XHRjb25zdCBzdWJJdGVtID0gc291cmNlSXRlbVtvdmVyd3JpdGFibGVLZXldIHx8IChbXSBhcyBhbnlbXSk7XG5cdFx0XHRcdFx0XHRsZXQgc3ViQ29uZmlnID0ge307XG5cdFx0XHRcdFx0XHRpZiAoaXNBcnJheUNvbmZpZyhvdmVycmlkZUNvbmZpZykpIHtcblx0XHRcdFx0XHRcdFx0c3ViQ29uZmlnID0gb3ZlcnJpZGVDb25maWc7XG5cdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHRpZiAoQXJyYXkuaXNBcnJheShzdWJJdGVtKSkge1xuXHRcdFx0XHRcdFx0XHRzb3VyY2VJdGVtW292ZXJ3cml0YWJsZUtleV0gPSBpbnNlcnRDdXN0b21FbGVtZW50cyhcblx0XHRcdFx0XHRcdFx0XHRzdWJJdGVtLFxuXHRcdFx0XHRcdFx0XHRcdChjdXN0b21FbGVtZW50ICYmIChjdXN0b21FbGVtZW50W292ZXJ3cml0YWJsZUtleV0gYXMgUmVjb3JkPHN0cmluZywgQ3VzdG9tRWxlbWVudDxhbnk+PikpIHx8IHt9LFxuXHRcdFx0XHRcdFx0XHRcdHN1YkNvbmZpZ1xuXHRcdFx0XHRcdFx0XHQpIGFzIGFueTtcblx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdGJyZWFrO1xuXHRcdFx0XHR9XG5cdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRzd2l0Y2ggKG92ZXJyaWRlQ29uZmlnKSB7XG5cdFx0XHRcdFx0Y2FzZSBcIm92ZXJ3cml0ZVwiOlxuXHRcdFx0XHRcdFx0aWYgKGN1c3RvbUVsZW1lbnQuaGFzT3duUHJvcGVydHkob3ZlcndyaXRhYmxlS2V5KSAmJiBjdXN0b21FbGVtZW50W292ZXJ3cml0YWJsZUtleV0gIT09IHVuZGVmaW5lZCkge1xuXHRcdFx0XHRcdFx0XHRvdXRJdGVtW292ZXJ3cml0YWJsZUtleV0gPSBjdXN0b21FbGVtZW50W292ZXJ3cml0YWJsZUtleV07XG5cdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHRicmVhaztcblx0XHRcdFx0XHRjYXNlIFwibWVyZ2VcIjpcblx0XHRcdFx0XHRkZWZhdWx0OlxuXHRcdFx0XHRcdFx0bGV0IHN1YkNvbmZpZyA9IHt9O1xuXHRcdFx0XHRcdFx0aWYgKGlzQXJyYXlDb25maWcob3ZlcnJpZGVDb25maWcpKSB7XG5cdFx0XHRcdFx0XHRcdHN1YkNvbmZpZyA9IG92ZXJyaWRlQ29uZmlnO1xuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0b3V0SXRlbVtvdmVyd3JpdGFibGVLZXldID0gaW5zZXJ0Q3VzdG9tRWxlbWVudHMoXG5cdFx0XHRcdFx0XHRcdFtdIGFzIGFueVtdLFxuXHRcdFx0XHRcdFx0XHQoY3VzdG9tRWxlbWVudCAmJiAoY3VzdG9tRWxlbWVudFtvdmVyd3JpdGFibGVLZXldIGFzIFJlY29yZDxzdHJpbmcsIEN1c3RvbUVsZW1lbnQ8YW55Pj4pKSB8fCB7fSxcblx0XHRcdFx0XHRcdFx0c3ViQ29uZmlnXG5cdFx0XHRcdFx0XHQpIGFzIGFueTtcblx0XHRcdFx0XHRcdGJyZWFrO1xuXHRcdFx0XHR9XG5cdFx0XHR9XG5cdFx0fVxuXHR9XG5cdHJldHVybiBvdXRJdGVtO1xufVxuXG4vKipcbiAqIEluc2VydCBhIHNldCBvZiBjdXN0b20gZWxlbWVudHMgaW4gdGhlIHJpZ2h0IHBvc2l0aW9uIGluIGFuIG9yaWdpbmFsIGNvbGxlY3Rpb24uXG4gKlxuICogQHRlbXBsYXRlIFRcbiAqIEBwYXJhbSByb290RWxlbWVudHMgQSBsaXN0IG9mIFwiQ29uZmlndXJhYmxlT2JqZWN0XCIgd2hpY2ggbWVhbnMgb2JqZWN0IHRoYXQgaGF2ZSBhIHVuaXF1ZSBcImtleVwiXG4gKiBAcGFyYW0gY3VzdG9tRWxlbWVudHMgQW4gb2JqZWN0IGNvbnRhaW5pbmcgZXh0cmEgb2JqZWN0IHRvIGFkZCwgdGhleSBhcmUgaW5kZXhlZCBieSBhIGtleSBhbmQgaGF2ZSBhIFwicG9zaXRpb25cIiBvYmplY3RcbiAqIEBwYXJhbSBvdmVyd3JpdGFibGVLZXlzIFRoZSBsaXN0IG9mIGtleXMgZnJvbSB0aGUgb3JpZ2luYWwgb2JqZWN0IHRoYXQgY2FuIGJlIG92ZXJ3cml0dGVuIGluIGNhc2UgYSBjdXN0b20gZWxlbWVudCBoYXMgdGhlIHNhbWUgXCJrZXlcIlxuICogQHJldHVybnMge1RbXX0gQW4gb3JkZXJlZCBhcnJheSBvZiBlbGVtZW50cyBpbmNsdWRpbmcgdGhlIGN1c3RvbSBvbmVzXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBpbnNlcnRDdXN0b21FbGVtZW50czxUIGV4dGVuZHMgQ29uZmlndXJhYmxlT2JqZWN0Pihcblx0cm9vdEVsZW1lbnRzOiBUW10sXG5cdGN1c3RvbUVsZW1lbnRzOiBSZWNvcmQ8c3RyaW5nLCBDdXN0b21FbGVtZW50PFQ+Pixcblx0b3ZlcndyaXRhYmxlS2V5czogT3ZlcnJpZGVLZXlzPFQ+ID0ge31cbik6IFRbXSB7XG5cdGNvbnN0IGZpcnN0QW5jaG9yID0gcm9vdEVsZW1lbnRzLmxlbmd0aCA/IHJvb3RFbGVtZW50c1swXS5rZXkgOiBudWxsO1xuXHRjb25zdCByb290RWxlbWVudHNXaXRob3V0TGFzdCA9IHJvb3RFbGVtZW50cy5maWx0ZXIocm9vdEVsZW1lbnQgPT4ge1xuXHRcdHJldHVybiByb290RWxlbWVudC5wb3NpdGlvbj8ucGxhY2VtZW50ICE9PSBQbGFjZW1lbnQuRW5kO1xuXHR9KTtcblx0Y29uc3QgbGFzdEFuY2hvciA9IHJvb3RFbGVtZW50cy5sZW5ndGggPyByb290RWxlbWVudHNbcm9vdEVsZW1lbnRzV2l0aG91dExhc3QubGVuZ3RoIC0gMV0ua2V5IDogbnVsbDtcblx0bGV0IGVuZEVsZW1lbnQ6IFQgfCB1bmRlZmluZWQ7XG5cdGNvbnN0IHBvc2l0aW9uaW5nSXRlbXM6IFJlY29yZDxzdHJpbmcsIFJlcXVpcmVkPFBvc2l0aW9uPj4gPSB7fTtcblx0Y29uc3QgaXRlbXNQZXJLZXk6IFJlY29yZDxzdHJpbmcsIFQ+ID0ge307XG5cdHJvb3RFbGVtZW50cy5mb3JFYWNoKHJvb3RFbGVtZW50ID0+IHtcblx0XHRpZiAocm9vdEVsZW1lbnQucG9zaXRpb24/LnBsYWNlbWVudCA9PT0gUGxhY2VtZW50LkVuZCAmJiAhZW5kRWxlbWVudCkge1xuXHRcdFx0ZW5kRWxlbWVudCA9IHJvb3RFbGVtZW50O1xuXHRcdH0gZWxzZSB7XG5cdFx0XHRwb3NpdGlvbmluZ0l0ZW1zW3Jvb3RFbGVtZW50LmtleV0gPSB7XG5cdFx0XHRcdGFuY2hvcjogcm9vdEVsZW1lbnQucG9zaXRpb24/LmFuY2hvciB8fCByb290RWxlbWVudC5rZXksXG5cdFx0XHRcdHBsYWNlbWVudDogcm9vdEVsZW1lbnQucG9zaXRpb24/LnBsYWNlbWVudCB8fCBQbGFjZW1lbnQuQWZ0ZXJcblx0XHRcdH07XG5cdFx0fVxuXHRcdGl0ZW1zUGVyS2V5W3Jvb3RFbGVtZW50LmtleV0gPSByb290RWxlbWVudDtcblx0fSk7XG5cdE9iamVjdC5rZXlzKGN1c3RvbUVsZW1lbnRzKS5mb3JFYWNoKGN1c3RvbUVsZW1lbnRLZXkgPT4ge1xuXHRcdGNvbnN0IGN1c3RvbUVsZW1lbnQgPSBjdXN0b21FbGVtZW50c1tjdXN0b21FbGVtZW50S2V5XTtcblx0XHRjb25zdCBhbmNob3IgPSBjdXN0b21FbGVtZW50LnBvc2l0aW9uLmFuY2hvcjtcblx0XHQvLyBJZiBubyBwbGFjZW1lbnQgZGVmaW5lZCB3ZSBhcmUgQWZ0ZXJcblx0XHRpZiAoIWN1c3RvbUVsZW1lbnQucG9zaXRpb24ucGxhY2VtZW50KSB7XG5cdFx0XHRjdXN0b21FbGVtZW50LnBvc2l0aW9uLnBsYWNlbWVudCA9IFBsYWNlbWVudC5BZnRlcjtcblx0XHR9XG5cdFx0Ly8gSWYgbm8gYW5jaG9yIHdlJ3JlIGVpdGhlciBBZnRlciB0aGUgbGFzdCBhbmNob3Igb3IgQmVmb3JlIHRoZSBmaXJzdFxuXHRcdGlmICghYW5jaG9yKSB7XG5cdFx0XHRjb25zdCBwb3RlbnRpYWxBbmNob3IgPSBjdXN0b21FbGVtZW50LnBvc2l0aW9uLnBsYWNlbWVudCA9PT0gUGxhY2VtZW50LkFmdGVyID8gbGFzdEFuY2hvciA6IGZpcnN0QW5jaG9yO1xuXHRcdFx0Y3VzdG9tRWxlbWVudC5wb3NpdGlvbi5hbmNob3IgPSBwb3RlbnRpYWxBbmNob3IgPyBwb3RlbnRpYWxBbmNob3IgOiBjdXN0b21FbGVtZW50S2V5O1xuXHRcdH1cblxuXHRcdC8vIEFkZGluZyBib3VuZC91bmJvdW5kIGFjdGlvbnMgdG8gbWVudVxuXHRcdGN1c3RvbUVsZW1lbnQubWVudSA9IGN1c3RvbUVsZW1lbnQ/Lm1lbnU/Lm1hcChtZW51ID0+IHtcblx0XHRcdHJldHVybiBpdGVtc1BlcktleVttZW51LmtleV0gPz8gbWVudTtcblx0XHR9KTtcblxuXHRcdGlmIChpdGVtc1BlcktleVtjdXN0b21FbGVtZW50LmtleV0pIHtcblx0XHRcdGl0ZW1zUGVyS2V5W2N1c3RvbUVsZW1lbnQua2V5XSA9IGFwcGx5T3ZlcnJpZGUob3ZlcndyaXRhYmxlS2V5cywgaXRlbXNQZXJLZXlbY3VzdG9tRWxlbWVudC5rZXldLCBjdXN0b21FbGVtZW50KTtcblxuXHRcdFx0Ly9Qb3NpdGlvbiBpcyBvdmVyd3JpdHRlbiBmb3IgZmlsdGVyIGZpZWxkcyBpZiB0aGVyZSBpcyBhIGNoYW5nZSBpbiBtYW5pZmVzdFxuXHRcdFx0aWYgKGFuY2hvciAmJiBjdXN0b21FbGVtZW50LnBvc2l0aW9uICYmIG92ZXJ3cml0YWJsZUtleXMucG9zaXRpb24gJiYgb3ZlcndyaXRhYmxlS2V5cy5wb3NpdGlvbiA9PT0gXCJvdmVyd3JpdGVcIikge1xuXHRcdFx0XHRwb3NpdGlvbmluZ0l0ZW1zW2N1c3RvbUVsZW1lbnQua2V5XSA9IGl0ZW1zUGVyS2V5W2N1c3RvbUVsZW1lbnQua2V5XS5wb3NpdGlvbiBhcyBSZXF1aXJlZDxQb3NpdGlvbj47XG5cdFx0XHR9XG5cdFx0XHQvKipcblx0XHRcdCAqIGFuY2hvciBjaGVjayBpcyBhZGRlZCB0byBtYWtlIHN1cmUgY2hhbmdlIGluIHByb3BlcnRpZXMgaW4gdGhlIG1hbmlmZXN0IGRvZXMgbm90IGFmZmVjdCB0aGUgcG9zaXRpb24gb2YgdGhlIGZpZWxkLlxuXHRcdFx0ICogT3RoZXJ3aXNlLCB3aGVuIG5vIHBvc2l0aW9uIGlzIG1lbnRpb25lZCBpbiBtYW5pZmVzdCBmb3IgYW4gYWx0ZXJlZCBmaWVsZCwgdGhlIHBvc2l0aW9uIGlzIGNoYW5nZWQgYXNcblx0XHRcdCAqIHBlciB0aGUgcG90ZW50aWFsIGFuY2hvclxuXHRcdFx0ICovXG5cdFx0fSBlbHNlIHtcblx0XHRcdGl0ZW1zUGVyS2V5W2N1c3RvbUVsZW1lbnQua2V5XSA9IGFwcGx5T3ZlcnJpZGUob3ZlcndyaXRhYmxlS2V5cywgbnVsbCwgY3VzdG9tRWxlbWVudCk7XG5cdFx0XHRwb3NpdGlvbmluZ0l0ZW1zW2N1c3RvbUVsZW1lbnQua2V5XSA9IGN1c3RvbUVsZW1lbnQucG9zaXRpb24gYXMgUmVxdWlyZWQ8UG9zaXRpb24+O1xuXHRcdH1cblx0fSk7XG5cdGNvbnN0IHNvcnRlZEtleXM6IHN0cmluZ1tdID0gW107XG5cblx0T2JqZWN0LmtleXMocG9zaXRpb25pbmdJdGVtcykuZm9yRWFjaChwb3NpdGlvbkl0ZW1LZXkgPT4ge1xuXHRcdG9yZGVyUG9zaXRpb25pbmdJdGVtUmVjdXJzaXZlbHkocG9zaXRpb25pbmdJdGVtcywgcG9zaXRpb25JdGVtS2V5LCBzb3J0ZWRLZXlzLCB7fSk7XG5cdH0pO1xuXG5cdGNvbnN0IG91dEVsZW1lbnRzID0gc29ydGVkS2V5cy5tYXAoa2V5ID0+IGl0ZW1zUGVyS2V5W2tleV0pO1xuXHRpZiAoZW5kRWxlbWVudCkge1xuXHRcdG91dEVsZW1lbnRzLnB1c2goZW5kRWxlbWVudCk7XG5cdH1cblx0cmV0dXJuIG91dEVsZW1lbnRzO1xufVxuIl19