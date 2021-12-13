/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)
 *      (c) Copyright 2009-2021 SAP SE. All rights reserved
 */
sap.ui.define(["sap/fe/core/helpers/ClassSupport", "./MacroAPI", "sap/base/util/merge"], function (ClassSupport, MacroAPI, merge) {
  "use strict";

  var _dec, _dec2, _class, _class2, _descriptor, _descriptor2, _descriptor3;

  var Event = ClassSupport.Event;
  var EventHandler = ClassSupport.EventHandler;
  var Property = ClassSupport.Property;
  var APIClass = ClassSupport.APIClass;

  function _initializerDefineProperty(target, property, descriptor, context) { if (!descriptor) return; Object.defineProperty(target, property, { enumerable: descriptor.enumerable, configurable: descriptor.configurable, writable: descriptor.writable, value: descriptor.initializer ? descriptor.initializer.call(context) : void 0 }); }

  function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

  function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

  function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

  function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

  function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

  function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = _getPrototypeOf(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = _getPrototypeOf(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return _possibleConstructorReturn(this, result); }; }

  function _possibleConstructorReturn(self, call) { if (call && (typeof call === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

  function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

  function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); return true; } catch (e) { return false; } }

  function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

  function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

  function _applyDecoratedDescriptor(target, property, decorators, descriptor, context) { var desc = {}; Object.keys(descriptor).forEach(function (key) { desc[key] = descriptor[key]; }); desc.enumerable = !!desc.enumerable; desc.configurable = !!desc.configurable; if ('value' in desc || desc.initializer) { desc.writable = true; } desc = decorators.slice().reverse().reduce(function (desc, decorator) { return decorator(target, property, desc) || desc; }, desc); if (context && desc.initializer !== void 0) { desc.value = desc.initializer ? desc.initializer.call(context) : void 0; desc.initializer = undefined; } if (desc.initializer === void 0) { Object.defineProperty(target, property, desc); desc = null; } return desc; }

  function _initializerWarningHelper(descriptor, context) { throw new Error('Decorating class property failed. Please ensure that ' + 'proposal-class-properties is enabled and runs after the decorators transform.'); }

  /**
   * Building block for creating a FilterBar based on the metadata provided by OData V4.
   * <br>
   * Usually, a SelectionFields annotation is expected.
   *
   *
   * Usage example:
   * <pre>
   * &lt;macro:FilterBar id="MyFilterBar" metaPath="@com.sap.vocabularies.UI.v1.SelectionFields" /&gt;
   * </pre>
   *
   * @alias sap.fe.macros.FilterBar
   * @public
   */
  var FilterBarAPI = (_dec = APIClass("sap.fe.macros.FilterBarAPI"), _dec2 = Property({
    type: "string"
  }), _dec(_class = (_class2 = /*#__PURE__*/function (_MacroAPI) {
    _inherits(FilterBarAPI, _MacroAPI);

    var _super = _createSuper(FilterBarAPI);

    function FilterBarAPI() {
      var _this;

      _classCallCheck(this, FilterBarAPI);

      for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
        args[_key] = arguments[_key];
      }

      _this = _super.call.apply(_super, [this].concat(args));

      _initializerDefineProperty(_assertThisInitialized(_this), "id", _descriptor, _assertThisInitialized(_this));

      _initializerDefineProperty(_assertThisInitialized(_this), "search", _descriptor2, _assertThisInitialized(_this));

      _initializerDefineProperty(_assertThisInitialized(_this), "filterChanged", _descriptor3, _assertThisInitialized(_this));

      return _this;
    }

    _createClass(FilterBarAPI, [{
      key: "handleSearch",
      value: function handleSearch(oEvent) {
        var oFilterBar = oEvent.getSource();
        var oEventParameters = oEvent.getParameters();

        if (oFilterBar) {
          var oConditions = oFilterBar.getFilterConditions();
          this.fireSearch(merge({
            conditions: oConditions
          }, oEventParameters));
        }
      }
    }, {
      key: "handleFilterChanged",
      value: function handleFilterChanged(oEvent) {
        var oFilterBar = oEvent.getSource();
        var oEventParameters = oEvent.getParameters();

        if (oFilterBar) {
          var oConditions = oFilterBar.getFilterConditions();
          this.fireFilterChanged(merge({
            conditions: oConditions
          }, oEventParameters));
        }
      }
    }]);

    return FilterBarAPI;
  }(MacroAPI), (_descriptor = _applyDecoratedDescriptor(_class2.prototype, "id", [_dec2], {
    configurable: true,
    enumerable: true,
    writable: true,
    initializer: null
  }), _descriptor2 = _applyDecoratedDescriptor(_class2.prototype, "search", [Event], {
    configurable: true,
    enumerable: true,
    writable: true,
    initializer: null
  }), _descriptor3 = _applyDecoratedDescriptor(_class2.prototype, "filterChanged", [Event], {
    configurable: true,
    enumerable: true,
    writable: true,
    initializer: null
  }), _applyDecoratedDescriptor(_class2.prototype, "handleSearch", [EventHandler], Object.getOwnPropertyDescriptor(_class2.prototype, "handleSearch"), _class2.prototype), _applyDecoratedDescriptor(_class2.prototype, "handleFilterChanged", [EventHandler], Object.getOwnPropertyDescriptor(_class2.prototype, "handleFilterChanged"), _class2.prototype)), _class2)) || _class);
  return FilterBarAPI;
}, false);
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIkZpbHRlckJhckFQSS50cyJdLCJuYW1lcyI6WyJGaWx0ZXJCYXJBUEkiLCJBUElDbGFzcyIsIlByb3BlcnR5IiwidHlwZSIsIm9FdmVudCIsIm9GaWx0ZXJCYXIiLCJnZXRTb3VyY2UiLCJvRXZlbnRQYXJhbWV0ZXJzIiwiZ2V0UGFyYW1ldGVycyIsIm9Db25kaXRpb25zIiwiZ2V0RmlsdGVyQ29uZGl0aW9ucyIsImZpcmVTZWFyY2giLCJtZXJnZSIsImNvbmRpdGlvbnMiLCJmaXJlRmlsdGVyQ2hhbmdlZCIsIk1hY3JvQVBJIiwiRXZlbnQiLCJFdmVudEhhbmRsZXIiXSwibWFwcGluZ3MiOiI7QUFBQTtBQUNBO0FBQ0E7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7TUFFTUEsWSxXQURMQyxRQUFRLENBQUMsNEJBQUQsQyxVQU9QQyxRQUFRLENBQUM7QUFBRUMsSUFBQUEsSUFBSSxFQUFFO0FBQVIsR0FBRCxDOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7YUFvQlQsc0JBQ2FDLE1BRGIsRUFDK0I7QUFDOUIsWUFBTUMsVUFBVSxHQUFHRCxNQUFNLENBQUNFLFNBQVAsRUFBbkI7QUFDQSxZQUFNQyxnQkFBZ0IsR0FBR0gsTUFBTSxDQUFDSSxhQUFQLEVBQXpCOztBQUNBLFlBQUlILFVBQUosRUFBZ0I7QUFDZixjQUFNSSxXQUFXLEdBQUdKLFVBQVUsQ0FBQ0ssbUJBQVgsRUFBcEI7QUFDQyxjQUFELENBQWNDLFVBQWQsQ0FBeUJDLEtBQUssQ0FBQztBQUFFQyxZQUFBQSxVQUFVLEVBQUVKO0FBQWQsV0FBRCxFQUE4QkYsZ0JBQTlCLENBQTlCO0FBQ0E7QUFDRDs7O2FBRUQsNkJBQ29CSCxNQURwQixFQUNzQztBQUNyQyxZQUFNQyxVQUFVLEdBQUdELE1BQU0sQ0FBQ0UsU0FBUCxFQUFuQjtBQUNBLFlBQU1DLGdCQUFnQixHQUFHSCxNQUFNLENBQUNJLGFBQVAsRUFBekI7O0FBQ0EsWUFBSUgsVUFBSixFQUFnQjtBQUNmLGNBQU1JLFdBQVcsR0FBR0osVUFBVSxDQUFDSyxtQkFBWCxFQUFwQjtBQUNDLGNBQUQsQ0FBY0ksaUJBQWQsQ0FBZ0NGLEtBQUssQ0FBQztBQUFFQyxZQUFBQSxVQUFVLEVBQUVKO0FBQWQsV0FBRCxFQUE4QkYsZ0JBQTlCLENBQXJDO0FBQ0E7QUFDRDs7OztJQTVDeUJRLFE7Ozs7OzZFQWN6QkMsSzs7Ozs7b0ZBU0FBLEs7Ozs7O29FQUdBQyxZLGdLQVVBQSxZO1NBV2FqQixZIiwic291cmNlUm9vdCI6Ii4iLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBBUElDbGFzcywgUHJvcGVydHksIEV2ZW50SGFuZGxlciwgRXZlbnQgfSBmcm9tIFwic2FwL2ZlL2NvcmUvaGVscGVycy9DbGFzc1N1cHBvcnRcIjtcbmltcG9ydCBNYWNyb0FQSSBmcm9tIFwiLi9NYWNyb0FQSVwiO1xuaW1wb3J0IHsgbWVyZ2UgfSBmcm9tIFwic2FwL2Jhc2UvdXRpbFwiO1xuXG4vKipcbiAqIEJ1aWxkaW5nIGJsb2NrIGZvciBjcmVhdGluZyBhIEZpbHRlckJhciBiYXNlZCBvbiB0aGUgbWV0YWRhdGEgcHJvdmlkZWQgYnkgT0RhdGEgVjQuXG4gKiA8YnI+XG4gKiBVc3VhbGx5LCBhIFNlbGVjdGlvbkZpZWxkcyBhbm5vdGF0aW9uIGlzIGV4cGVjdGVkLlxuICpcbiAqXG4gKiBVc2FnZSBleGFtcGxlOlxuICogPHByZT5cbiAqICZsdDttYWNybzpGaWx0ZXJCYXIgaWQ9XCJNeUZpbHRlckJhclwiIG1ldGFQYXRoPVwiQGNvbS5zYXAudm9jYWJ1bGFyaWVzLlVJLnYxLlNlbGVjdGlvbkZpZWxkc1wiIC8mZ3Q7XG4gKiA8L3ByZT5cbiAqXG4gKiBAYWxpYXMgc2FwLmZlLm1hY3Jvcy5GaWx0ZXJCYXJcbiAqIEBwdWJsaWNcbiAqL1xuQEFQSUNsYXNzKFwic2FwLmZlLm1hY3Jvcy5GaWx0ZXJCYXJBUElcIilcbmNsYXNzIEZpbHRlckJhckFQSSBleHRlbmRzIE1hY3JvQVBJIHtcblx0LyoqXG5cdCAqIFRoZSBpZGVudGlmaWVyIG9mIHRoZSBmaWx0ZXJiYXIgY29udHJvbC5cblx0ICpcblx0ICogQHB1YmxpY1xuXHQgKi9cblx0QFByb3BlcnR5KHsgdHlwZTogXCJzdHJpbmdcIiB9KVxuXHRpZCE6IHN0cmluZztcblxuXHQvKipcblx0ICogVGhpcyBldmVudCBpcyBmaXJlZCB3aGVuIHRoZSBHbyBidXR0b24gaXMgcHJlc3NlZCBvciBhZnRlciBhIGNvbmRpdGlvbiBjaGFuZ2UuXG5cdCAqXG5cdCAqIEBwdWJsaWNcblx0ICovXG5cdEBFdmVudFxuXHRzZWFyY2ghOiBGdW5jdGlvbjtcblxuXHQvKipcblx0ICogVGhpcyBldmVudCBpcyBmaXJlZCBhZnRlciBlaXRoZXIgYSBmaWx0ZXIgdmFsdWUgb3IgdGhlIHZpc2liaWxpdHkgb2YgYSBmaWx0ZXIgaXRlbSBoYXMgYmVlbiBjaGFuZ2VkLlxuXHQgKiBUaGUgZXZlbnQgY29udGFpbnMgY29uZGl0aW9ucyB0aGF0IHdpbGwgYmUgdXNlZCBhcyBmaWx0ZXJzLlxuXHQgKlxuXHQgKiBAcHVibGljXG5cdCAqL1xuXHRARXZlbnRcblx0ZmlsdGVyQ2hhbmdlZCE6IEZ1bmN0aW9uO1xuXG5cdEBFdmVudEhhbmRsZXJcblx0aGFuZGxlU2VhcmNoKG9FdmVudDogVUk1RXZlbnQpIHtcblx0XHRjb25zdCBvRmlsdGVyQmFyID0gb0V2ZW50LmdldFNvdXJjZSgpO1xuXHRcdGNvbnN0IG9FdmVudFBhcmFtZXRlcnMgPSBvRXZlbnQuZ2V0UGFyYW1ldGVycygpO1xuXHRcdGlmIChvRmlsdGVyQmFyKSB7XG5cdFx0XHRjb25zdCBvQ29uZGl0aW9ucyA9IG9GaWx0ZXJCYXIuZ2V0RmlsdGVyQ29uZGl0aW9ucygpO1xuXHRcdFx0KHRoaXMgYXMgYW55KS5maXJlU2VhcmNoKG1lcmdlKHsgY29uZGl0aW9uczogb0NvbmRpdGlvbnMgfSwgb0V2ZW50UGFyYW1ldGVycykpO1xuXHRcdH1cblx0fVxuXG5cdEBFdmVudEhhbmRsZXJcblx0aGFuZGxlRmlsdGVyQ2hhbmdlZChvRXZlbnQ6IFVJNUV2ZW50KSB7XG5cdFx0Y29uc3Qgb0ZpbHRlckJhciA9IG9FdmVudC5nZXRTb3VyY2UoKTtcblx0XHRjb25zdCBvRXZlbnRQYXJhbWV0ZXJzID0gb0V2ZW50LmdldFBhcmFtZXRlcnMoKTtcblx0XHRpZiAob0ZpbHRlckJhcikge1xuXHRcdFx0Y29uc3Qgb0NvbmRpdGlvbnMgPSBvRmlsdGVyQmFyLmdldEZpbHRlckNvbmRpdGlvbnMoKTtcblx0XHRcdCh0aGlzIGFzIGFueSkuZmlyZUZpbHRlckNoYW5nZWQobWVyZ2UoeyBjb25kaXRpb25zOiBvQ29uZGl0aW9ucyB9LCBvRXZlbnRQYXJhbWV0ZXJzKSk7XG5cdFx0fVxuXHR9XG59XG5cbmV4cG9ydCBkZWZhdWx0IEZpbHRlckJhckFQSTtcbiJdfQ==