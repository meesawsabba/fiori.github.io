/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)
 *      (c) Copyright 2009-2021 SAP SE. All rights reserved
 */
sap.ui.define(["sap/fe/core/helpers/ClassSupport", "./MacroAPI", "sap/base/util/merge"], function (ClassSupport, MacroAPI, merge) {
  "use strict";

  var _dec, _dec2, _dec3, _dec4, _dec5, _dec6, _class, _class2, _descriptor, _descriptor2, _descriptor3, _descriptor4, _descriptor5, _descriptor6;

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
   * Building block used to create a chart based on the metadata provided by OData V4.
   * <br>
   * Usually, a contextPath and metaPath is expected.
   *
   *
   * Usage example:
   * <pre>
   * &lt;macro:Chart id="Mychart" contextPath="/RootEntity" metaPath="@com.sap.vocabularies.UI.v1.Chart" /&gt;
   * </pre>
   *
   * @alias sap.fe.macros.Chart
   * @public
   */
  var ChartAPI = (_dec = APIClass("sap.fe.macros.ChartAPI"), _dec2 = Property({
    type: "string"
  }), _dec3 = Property({
    type: "sap.ui.model.Context",
    required: true
  }), _dec4 = Property({
    type: "sap.ui.model.Context",
    required: true
  }), _dec5 = Property({
    type: "string",
    defaultValue: "MULTIPLE"
  }), _dec6 = Property({
    type: "boolean|string"
  }), _dec(_class = (_class2 = /*#__PURE__*/function (_MacroAPI) {
    _inherits(ChartAPI, _MacroAPI);

    var _super = _createSuper(ChartAPI);

    function ChartAPI() {
      var _this;

      _classCallCheck(this, ChartAPI);

      for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
        args[_key] = arguments[_key];
      }

      _this = _super.call.apply(_super, [this].concat(args));

      _initializerDefineProperty(_assertThisInitialized(_this), "id", _descriptor, _assertThisInitialized(_this));

      _initializerDefineProperty(_assertThisInitialized(_this), "metaPath", _descriptor2, _assertThisInitialized(_this));

      _initializerDefineProperty(_assertThisInitialized(_this), "contextPath", _descriptor3, _assertThisInitialized(_this));

      _initializerDefineProperty(_assertThisInitialized(_this), "selectionMode", _descriptor4, _assertThisInitialized(_this));

      _initializerDefineProperty(_assertThisInitialized(_this), "personalization", _descriptor5, _assertThisInitialized(_this));

      _initializerDefineProperty(_assertThisInitialized(_this), "selectionChange", _descriptor6, _assertThisInitialized(_this));

      return _this;
    }

    _createClass(ChartAPI, [{
      key: "handleSelectionChange",
      value: function handleSelectionChange(oEvent) {
        var aData = oEvent.getParameter("data");
        var bSelected = oEvent.getParameter("name") === "selectData";
        this.fireSelectionChange(merge({}, {
          data: aData,
          selected: bSelected
        }));
      }
    }]);

    return ChartAPI;
  }(MacroAPI), (_descriptor = _applyDecoratedDescriptor(_class2.prototype, "id", [_dec2], {
    configurable: true,
    enumerable: true,
    writable: true,
    initializer: null
  }), _descriptor2 = _applyDecoratedDescriptor(_class2.prototype, "metaPath", [_dec3], {
    configurable: true,
    enumerable: true,
    writable: true,
    initializer: null
  }), _descriptor3 = _applyDecoratedDescriptor(_class2.prototype, "contextPath", [_dec4], {
    configurable: true,
    enumerable: true,
    writable: true,
    initializer: null
  }), _descriptor4 = _applyDecoratedDescriptor(_class2.prototype, "selectionMode", [_dec5], {
    configurable: true,
    enumerable: true,
    writable: true,
    initializer: null
  }), _descriptor5 = _applyDecoratedDescriptor(_class2.prototype, "personalization", [_dec6], {
    configurable: true,
    enumerable: true,
    writable: true,
    initializer: null
  }), _descriptor6 = _applyDecoratedDescriptor(_class2.prototype, "selectionChange", [Event], {
    configurable: true,
    enumerable: true,
    writable: true,
    initializer: null
  }), _applyDecoratedDescriptor(_class2.prototype, "handleSelectionChange", [EventHandler], Object.getOwnPropertyDescriptor(_class2.prototype, "handleSelectionChange"), _class2.prototype)), _class2)) || _class);
  return ChartAPI;
}, false);
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIkNoYXJ0QVBJLnRzIl0sIm5hbWVzIjpbIkNoYXJ0QVBJIiwiQVBJQ2xhc3MiLCJQcm9wZXJ0eSIsInR5cGUiLCJyZXF1aXJlZCIsImRlZmF1bHRWYWx1ZSIsIm9FdmVudCIsImFEYXRhIiwiZ2V0UGFyYW1ldGVyIiwiYlNlbGVjdGVkIiwiZmlyZVNlbGVjdGlvbkNoYW5nZSIsIm1lcmdlIiwiZGF0YSIsInNlbGVjdGVkIiwiTWFjcm9BUEkiLCJFdmVudCIsIkV2ZW50SGFuZGxlciJdLCJtYXBwaW5ncyI6IjtBQUFBO0FBQ0E7QUFDQTs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtNQUVNQSxRLFdBRExDLFFBQVEsQ0FBQyx3QkFBRCxDLFVBUVBDLFFBQVEsQ0FBQztBQUFFQyxJQUFBQSxJQUFJLEVBQUU7QUFBUixHQUFELEMsVUFRUkQsUUFBUSxDQUFDO0FBQUVDLElBQUFBLElBQUksRUFBRSxzQkFBUjtBQUFnQ0MsSUFBQUEsUUFBUSxFQUFFO0FBQTFDLEdBQUQsQyxVQVFSRixRQUFRLENBQUM7QUFBRUMsSUFBQUEsSUFBSSxFQUFFLHNCQUFSO0FBQWdDQyxJQUFBQSxRQUFRLEVBQUU7QUFBMUMsR0FBRCxDLFVBUVJGLFFBQVEsQ0FBQztBQUFFQyxJQUFBQSxJQUFJLEVBQUUsUUFBUjtBQUFrQkUsSUFBQUEsWUFBWSxFQUFFO0FBQWhDLEdBQUQsQyxVQVFSSCxRQUFRLENBQUM7QUFBRUMsSUFBQUEsSUFBSSxFQUFFO0FBQVIsR0FBRCxDOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7YUFZVCwrQkFDc0JHLE1BRHRCLEVBQ3dDO0FBQ3ZDLFlBQU1DLEtBQUssR0FBR0QsTUFBTSxDQUFDRSxZQUFQLENBQW9CLE1BQXBCLENBQWQ7QUFDQSxZQUFNQyxTQUFTLEdBQUdILE1BQU0sQ0FBQ0UsWUFBUCxDQUFvQixNQUFwQixNQUFnQyxZQUFsRDtBQUNDLFlBQUQsQ0FBY0UsbUJBQWQsQ0FBa0NDLEtBQUssQ0FBQyxFQUFELEVBQUs7QUFBRUMsVUFBQUEsSUFBSSxFQUFFTCxLQUFSO0FBQWVNLFVBQUFBLFFBQVEsRUFBRUo7QUFBekIsU0FBTCxDQUF2QztBQUNBOzs7O0lBeERxQkssUTs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztzRkFnRHJCQyxLOzs7Ozs2RUFHQUMsWTtTQVFhaEIsUSIsInNvdXJjZVJvb3QiOiIuIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgQVBJQ2xhc3MsIFByb3BlcnR5LCBFdmVudEhhbmRsZXIsIEV2ZW50IH0gZnJvbSBcInNhcC9mZS9jb3JlL2hlbHBlcnMvQ2xhc3NTdXBwb3J0XCI7XG5pbXBvcnQgTWFjcm9BUEkgZnJvbSBcIi4vTWFjcm9BUElcIjtcbmltcG9ydCB7IG1lcmdlIH0gZnJvbSBcInNhcC9iYXNlL3V0aWxcIjtcblxuLyoqXG4gKiBCdWlsZGluZyBibG9jayB1c2VkIHRvIGNyZWF0ZSBhIGNoYXJ0IGJhc2VkIG9uIHRoZSBtZXRhZGF0YSBwcm92aWRlZCBieSBPRGF0YSBWNC5cbiAqIDxicj5cbiAqIFVzdWFsbHksIGEgY29udGV4dFBhdGggYW5kIG1ldGFQYXRoIGlzIGV4cGVjdGVkLlxuICpcbiAqXG4gKiBVc2FnZSBleGFtcGxlOlxuICogPHByZT5cbiAqICZsdDttYWNybzpDaGFydCBpZD1cIk15Y2hhcnRcIiBjb250ZXh0UGF0aD1cIi9Sb290RW50aXR5XCIgbWV0YVBhdGg9XCJAY29tLnNhcC52b2NhYnVsYXJpZXMuVUkudjEuQ2hhcnRcIiAvJmd0O1xuICogPC9wcmU+XG4gKlxuICogQGFsaWFzIHNhcC5mZS5tYWNyb3MuQ2hhcnRcbiAqIEBwdWJsaWNcbiAqL1xuQEFQSUNsYXNzKFwic2FwLmZlLm1hY3Jvcy5DaGFydEFQSVwiKVxuY2xhc3MgQ2hhcnRBUEkgZXh0ZW5kcyBNYWNyb0FQSSB7XG5cdC8qKlxuXHQgKlxuXHQgKiBJRCBvZiB0aGUgY2hhcnRcblx0ICpcblx0ICogQHB1YmxpY1xuXHQgKi9cblx0QFByb3BlcnR5KHsgdHlwZTogXCJzdHJpbmdcIiB9KVxuXHRpZCE6IHN0cmluZztcblxuXHQvKipcblx0ICogTWV0YWRhdGEgcGF0aCB0byB0aGUgcHJlc2VudGF0aW9uIChVSS5DaGFydCB3IG9yIHcvbyBxdWFsaWZpZXIpXG5cdCAqXG5cdCAqIEBwdWJsaWNcblx0ICovXG5cdEBQcm9wZXJ0eSh7IHR5cGU6IFwic2FwLnVpLm1vZGVsLkNvbnRleHRcIiwgcmVxdWlyZWQ6IHRydWUgfSlcblx0bWV0YVBhdGghOiBzdHJpbmc7XG5cblx0LyoqXG5cdCAqIE1ldGFkYXRhIHBhdGggdG8gdGhlIGVudGl0eVNldCBvciBuYXZpZ2F0aW9uUHJvcGVydHlcblx0ICpcblx0ICogQHB1YmxpY1xuXHQgKi9cblx0QFByb3BlcnR5KHsgdHlwZTogXCJzYXAudWkubW9kZWwuQ29udGV4dFwiLCByZXF1aXJlZDogdHJ1ZSB9KVxuXHRjb250ZXh0UGF0aCE6IHN0cmluZztcblxuXHQvKipcblx0ICogU3BlY2lmaWVzIHRoZSBzZWxlY3Rpb24gbW9kZVxuXHQgKlxuXHQgKiBAcHVibGljXG5cdCAqL1xuXHRAUHJvcGVydHkoeyB0eXBlOiBcInN0cmluZ1wiLCBkZWZhdWx0VmFsdWU6IFwiTVVMVElQTEVcIiB9KVxuXHRzZWxlY3Rpb25Nb2RlITogc3RyaW5nO1xuXG5cdC8qKlxuXHQgKiBQYXJhbWV0ZXIgd2hpY2ggc2V0cyB0aGUgcGVyc29uYWxpemF0aW9uIG9mIHRoZSBNREMgY2hhcnRcblx0ICpcblx0ICogQHB1YmxpY1xuXHQgKi9cblx0QFByb3BlcnR5KHsgdHlwZTogXCJib29sZWFufHN0cmluZ1wiIH0pXG5cdHBlcnNvbmFsaXphdGlvbiE6IGJvb2xlYW4gfCBzdHJpbmc7XG5cblx0LyoqXG5cdCAqIEFuIGV2ZW50IHRyaWdnZXJlZCB3aGVuIGNoYXJ0IHNlbGVjdGlvbnMgYXJlIGNoYW5nZWQuIFRoZSBldmVudCBjb250YWlucyBpbmZvcm1hdGlvbiBhYm91dCB0aGUgZGF0YSBzZWxlY3RlZC9kZXNlbGVjdGVkIGFuZFxuXHQgKiBib29sZWFuIGZsYWcgdGhhdCBpbmRpY2F0ZXMgd2hldGhlciBkYXRhIGlzIHNlbGVjdGVkIG9yIGRlc2VsZWN0ZWQuXG5cdCAqXG5cdCAqIEBwdWJsaWNcblx0ICovXG5cdEBFdmVudFxuXHRzZWxlY3Rpb25DaGFuZ2UhOiBGdW5jdGlvbjtcblxuXHRARXZlbnRIYW5kbGVyXG5cdGhhbmRsZVNlbGVjdGlvbkNoYW5nZShvRXZlbnQ6IFVJNUV2ZW50KSB7XG5cdFx0Y29uc3QgYURhdGEgPSBvRXZlbnQuZ2V0UGFyYW1ldGVyKFwiZGF0YVwiKTtcblx0XHRjb25zdCBiU2VsZWN0ZWQgPSBvRXZlbnQuZ2V0UGFyYW1ldGVyKFwibmFtZVwiKSA9PT0gXCJzZWxlY3REYXRhXCI7XG5cdFx0KHRoaXMgYXMgYW55KS5maXJlU2VsZWN0aW9uQ2hhbmdlKG1lcmdlKHt9LCB7IGRhdGE6IGFEYXRhLCBzZWxlY3RlZDogYlNlbGVjdGVkIH0pKTtcblx0fVxufVxuXG5leHBvcnQgZGVmYXVsdCBDaGFydEFQSTtcbiJdfQ==