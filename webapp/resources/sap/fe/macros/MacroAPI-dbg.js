/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)
 *      (c) Copyright 2009-2021 SAP SE. All rights reserved
 */
sap.ui.define(["sap/fe/core/helpers/ClassSupport", "sap/ui/core/Control", "sap/base/util/merge", "sap/base/util/uid", "sap/fe/macros/PhantomUtil", "sap/ui/core/util/XMLPreprocessor", "sap/fe/core/converters/ConverterContext"], function (ClassSupport, Control, merge, uid, PhantomUtil, XMLPreprocessor, ConverterContext) {
  "use strict";

  var _dec, _dec2, _dec3, _dec4, _class, _class2, _descriptor, _descriptor2, _descriptor3, _class3, _temp;

  var Property = ClassSupport.Property;
  var Aggregation = ClassSupport.Aggregation;
  var APIClass = ClassSupport.APIClass;

  function _initializerDefineProperty(target, property, descriptor, context) { if (!descriptor) return; Object.defineProperty(target, property, { enumerable: descriptor.enumerable, configurable: descriptor.configurable, writable: descriptor.writable, value: descriptor.initializer ? descriptor.initializer.call(context) : void 0 }); }

  function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

  function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

  function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

  function _get(target, property, receiver) { if (typeof Reflect !== "undefined" && Reflect.get) { _get = Reflect.get; } else { _get = function _get(target, property, receiver) { var base = _superPropBase(target, property); if (!base) return; var desc = Object.getOwnPropertyDescriptor(base, property); if (desc.get) { return desc.get.call(receiver); } return desc.value; }; } return _get(target, property, receiver || target); }

  function _superPropBase(object, property) { while (!Object.prototype.hasOwnProperty.call(object, property)) { object = _getPrototypeOf(object); if (object === null) break; } return object; }

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

  var MacroAPI = (_dec = APIClass("sap.fe.macros.MacroAPI"), _dec2 = Property({
    type: "string"
  }), _dec3 = Property({
    type: "string"
  }), _dec4 = Aggregation({
    type: "sap.ui.core.Control",
    multiple: false,
    isDefault: true
  }), _dec(_class = (_class2 = (_temp = _class3 = /*#__PURE__*/function (_Control) {
    _inherits(MacroAPI, _Control);

    var _super = _createSuper(MacroAPI);

    function MacroAPI(mSettings) {
      var _this;

      _classCallCheck(this, MacroAPI);

      for (var _len = arguments.length, others = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
        others[_key - 1] = arguments[_key];
      }

      _this = _super.call.apply(_super, [this, mSettings].concat(others));

      _initializerDefineProperty(_assertThisInitialized(_this), "contextPath", _descriptor, _assertThisInitialized(_this));

      _initializerDefineProperty(_assertThisInitialized(_this), "metaPath", _descriptor2, _assertThisInitialized(_this));

      _initializerDefineProperty(_assertThisInitialized(_this), "content", _descriptor3, _assertThisInitialized(_this));

      _defineProperty(_assertThisInitialized(_this), "modelResolved", false);

      MacroAPI.registerInstance(_assertThisInitialized(_this));
      return _this;
    }

    _createClass(MacroAPI, [{
      key: "rerender",
      value: function rerender() {
        this.content.rerender();
      }
    }, {
      key: "getDomRef",
      value: function getDomRef() {
        var oContent = this.content;
        return oContent ? oContent.getDomRef() : _get(_getPrototypeOf(MacroAPI.prototype), "getDomRef", this).call(this);
      }
    }, {
      key: "getController",
      value: function getController() {
        return this.getModel("$view").getObject().getController();
      }
    }, {
      key: "propagateProperties",
      value: function propagateProperties(vName) {
        var _this2 = this;

        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        _get(_getPrototypeOf(MacroAPI.prototype), "propagateProperties", this).call(this, vName);

        if (this.metadata.macroContexts && !this.modelResolved) {
          var oPageModel = this.getModel("_pageModel");

          if (oPageModel) {
            Object.keys(this.metadata.macroContexts).forEach(function (macroKeyName) {
              _this2[macroKeyName] = oPageModel.getObject(_this2[macroKeyName]);
            });
            this.modelResolved = true;
          }
        }
      }
    }], [{
      key: "registerInstance",
      value: function registerInstance(_instance) {
        if (!this.instanceMap.get(_instance.constructor)) {
          this.instanceMap.set(_instance.constructor, []);
        }

        this.instanceMap.get(_instance.constructor).push(_instance);
      }
      /**
       * Defines the path of the context used in the current page or block.
       * This setting is defined by the framework.
       *
       * @public
       */

    }, {
      key: "getAPI",
      value: function getAPI(oEvent) {
        var oSource = oEvent.getSource();

        while (oSource && !oSource.isA("sap.fe.macros.MacroAPI") && oSource.getParent) {
          oSource = oSource.getParent();
        }

        if (!oSource || !oSource.isA("sap.fe.macros.MacroAPI")) {
          var oSourceMap = this.instanceMap.get(this);
          oSource = oSourceMap[oSourceMap.length - 1];
        }

        return oSource && oSource.isA("sap.fe.macros.MacroAPI") && oSource;
      }
    }, {
      key: "setDefaultValue",
      value: function setDefaultValue(oProps, sPropName, oOverrideValue) {
        if (oProps[sPropName] === undefined) {
          oProps[sPropName] = oOverrideValue;
        }
      }
    }, {
      key: "register",
      value: function register() {
        PhantomUtil.register(this);
      }
    }, {
      key: "unregister",
      value: function unregister() {
        XMLPreprocessor.plugIn(null, this.namespace, this.macroName);
      }
    }]);

    return MacroAPI;
  }(Control), _defineProperty(_class3, "namespace", "sap.fe.macros"), _defineProperty(_class3, "macroName", "Macro"), _defineProperty(_class3, "fragment", "sap.fe.macros.Macro"), _defineProperty(_class3, "hasValidation", true), _defineProperty(_class3, "instanceMap", new WeakMap()), _defineProperty(_class3, "getConverterContext", function (oDataModelPath, contextPath, mSettings) {
    var oAppComponent = mSettings.appComponent;
    var viewData = mSettings.models.viewData && mSettings.models.viewData.getData();
    var oConverterContext = ConverterContext.createConverterContextForMacro(oDataModelPath.startingEntitySet.name, mSettings.models.metaModel, oAppComponent && oAppComponent.getDiagnostics(), merge, oDataModelPath.contextLocation, viewData);
    return oConverterContext;
  }), _defineProperty(_class3, "createBindingContext", function (oData, mSettings) {
    var sContextPath = "/" + uid();
    mSettings.models.converterContext.setProperty(sContextPath, oData);
    return mSettings.models.converterContext.createBindingContext(sContextPath);
  }), _temp), (_descriptor = _applyDecoratedDescriptor(_class2.prototype, "contextPath", [_dec2], {
    configurable: true,
    enumerable: true,
    writable: true,
    initializer: null
  }), _descriptor2 = _applyDecoratedDescriptor(_class2.prototype, "metaPath", [_dec3], {
    configurable: true,
    enumerable: true,
    writable: true,
    initializer: null
  }), _descriptor3 = _applyDecoratedDescriptor(_class2.prototype, "content", [_dec4], {
    configurable: true,
    enumerable: true,
    writable: true,
    initializer: null
  })), _class2)) || _class);
  return MacroAPI;
}, false);
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIk1hY3JvQVBJLnRzIl0sIm5hbWVzIjpbIk1hY3JvQVBJIiwiQVBJQ2xhc3MiLCJQcm9wZXJ0eSIsInR5cGUiLCJBZ2dyZWdhdGlvbiIsIm11bHRpcGxlIiwiaXNEZWZhdWx0IiwibVNldHRpbmdzIiwib3RoZXJzIiwicmVnaXN0ZXJJbnN0YW5jZSIsImNvbnRlbnQiLCJyZXJlbmRlciIsIm9Db250ZW50IiwiZ2V0RG9tUmVmIiwiZ2V0TW9kZWwiLCJnZXRPYmplY3QiLCJnZXRDb250cm9sbGVyIiwidk5hbWUiLCJtZXRhZGF0YSIsIm1hY3JvQ29udGV4dHMiLCJtb2RlbFJlc29sdmVkIiwib1BhZ2VNb2RlbCIsIk9iamVjdCIsImtleXMiLCJmb3JFYWNoIiwibWFjcm9LZXlOYW1lIiwiX2luc3RhbmNlIiwiaW5zdGFuY2VNYXAiLCJnZXQiLCJjb25zdHJ1Y3RvciIsInNldCIsInB1c2giLCJvRXZlbnQiLCJvU291cmNlIiwiZ2V0U291cmNlIiwiaXNBIiwiZ2V0UGFyZW50Iiwib1NvdXJjZU1hcCIsImxlbmd0aCIsIm9Qcm9wcyIsInNQcm9wTmFtZSIsIm9PdmVycmlkZVZhbHVlIiwidW5kZWZpbmVkIiwiUGhhbnRvbVV0aWwiLCJyZWdpc3RlciIsIlhNTFByZXByb2Nlc3NvciIsInBsdWdJbiIsIm5hbWVzcGFjZSIsIm1hY3JvTmFtZSIsIkNvbnRyb2wiLCJXZWFrTWFwIiwib0RhdGFNb2RlbFBhdGgiLCJjb250ZXh0UGF0aCIsIm9BcHBDb21wb25lbnQiLCJhcHBDb21wb25lbnQiLCJ2aWV3RGF0YSIsIm1vZGVscyIsImdldERhdGEiLCJvQ29udmVydGVyQ29udGV4dCIsIkNvbnZlcnRlckNvbnRleHQiLCJjcmVhdGVDb252ZXJ0ZXJDb250ZXh0Rm9yTWFjcm8iLCJzdGFydGluZ0VudGl0eVNldCIsIm5hbWUiLCJtZXRhTW9kZWwiLCJnZXREaWFnbm9zdGljcyIsIm1lcmdlIiwiY29udGV4dExvY2F0aW9uIiwib0RhdGEiLCJzQ29udGV4dFBhdGgiLCJ1aWQiLCJjb252ZXJ0ZXJDb250ZXh0Iiwic2V0UHJvcGVydHkiLCJjcmVhdGVCaW5kaW5nQ29udGV4dCJdLCJtYXBwaW5ncyI6IjtBQUFBO0FBQ0E7QUFDQTs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O01BUU1BLFEsV0FETEMsUUFBUSxDQUFDLHdCQUFELEMsVUF5QlBDLFFBQVEsQ0FBQztBQUFFQyxJQUFBQSxJQUFJLEVBQUU7QUFBUixHQUFELEMsVUFRUkQsUUFBUSxDQUFDO0FBQUVDLElBQUFBLElBQUksRUFBRTtBQUFSLEdBQUQsQyxVQUdSQyxXQUFXLENBQUM7QUFBRUQsSUFBQUEsSUFBSSxFQUFFLHFCQUFSO0FBQStCRSxJQUFBQSxRQUFRLEVBQUUsS0FBekM7QUFBZ0RDLElBQUFBLFNBQVMsRUFBRTtBQUEzRCxHQUFELEM7Ozs7O0FBNUJaLHNCQUFZQyxTQUFaLEVBQWtFO0FBQUE7O0FBQUE7O0FBQUEsd0NBQWZDLE1BQWU7QUFBZkEsUUFBQUEsTUFBZTtBQUFBOztBQUNqRSwrQ0FBTUQsU0FBTixTQUEyQkMsTUFBM0I7O0FBRGlFOztBQUFBOztBQUFBOztBQUFBLHNFQTJDakMsS0EzQ2lDOztBQUVqRVIsTUFBQUEsUUFBUSxDQUFDUyxnQkFBVDtBQUZpRTtBQUdqRTs7OzthQTRCRCxvQkFBVztBQUNWLGFBQUtDLE9BQUwsQ0FBYUMsUUFBYjtBQUNBOzs7YUFFRCxxQkFBWTtBQUNYLFlBQU1DLFFBQVEsR0FBRyxLQUFLRixPQUF0QjtBQUNBLGVBQU9FLFFBQVEsR0FBR0EsUUFBUSxDQUFDQyxTQUFULEVBQUgsMEVBQWY7QUFDQTs7O2FBQ0QseUJBQWdDO0FBQy9CLGVBQVEsS0FBS0MsUUFBTCxDQUFjLE9BQWQsQ0FBRCxDQUFnQ0MsU0FBaEMsR0FBNENDLGFBQTVDLEVBQVA7QUFDQTs7O2FBR0QsNkJBQW9CQyxLQUFwQixFQUE2QztBQUFBOztBQUM1QztBQUNBO0FBQ0EsMEZBQTBCQSxLQUExQjs7QUFDQSxZQUFJLEtBQUtDLFFBQUwsQ0FBY0MsYUFBZCxJQUEr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QUFTLENBQUNpRCxNQUFWLENBQWlCTyxTQUZRLEVBR3pCVixhQUFhLElBQUlBLGFBQWEsQ0FBQ1csY0FBZCxFQUhRLEVBSXpCQyxLQUp5QixFQUt6QmQsY0FBYyxDQUFDZSxlQUxVLEVBTXpCWCxRQU55QixDQUExQjtBQVFBLFdBQU9HLGlCQUFQO0FBQ0EsRyxvREFDNkIsVUFBU1MsS0FBVCxFQUF3QjVELFNBQXhCLEVBQXdDO0FBQ3JFLFFBQU02RCxZQUFZLEdBQUcsTUFBTUMsR0FBRyxFQUE5QjtBQUNBOUQsSUFBQUEsU0FBUyxDQUFDaUQsTUFBVixDQUFpQmMsZ0JBQWpCLENBQWtDQyxXQUFsQyxDQUE4Q0gsWUFBOUMsRUFBNERELEtBQTVEO0FBQ0EsV0FBTzVELFNBQVMsQ0FBQ2lELE1BQVYsQ0FBaUJjLGdCQUFqQixDQUFrQ0Usb0JBQWxDLENBQXVESixZQUF2RCxDQUFQO0FBQ0EsRzs7Ozs7Ozs7Ozs7Ozs7OztTQVNhcEUsUSIsInNvdXJjZVJvb3QiOiIuIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgQVBJQ2xhc3MsIEFnZ3JlZ2F0aW9uLCBQcm9wZXJ0eSwgUHJvcGVydGllc09mIH0gZnJvbSBcInNhcC9mZS9jb3JlL2hlbHBlcnMvQ2xhc3NTdXBwb3J0XCI7XG5pbXBvcnQgeyBDb250cm9sIH0gZnJvbSBcInNhcC91aS9jb3JlXCI7XG5pbXBvcnQgeyBEYXRhTW9kZWxPYmplY3RQYXRoIH0gZnJvbSBcInNhcC9mZS9jb3JlL3RlbXBsYXRpbmcvRGF0YU1vZGVsUGF0aEhlbHBlclwiO1xuaW1wb3J0IHsgbWVyZ2UsIHVpZCB9IGZyb20gXCJzYXAvYmFzZS91dGlsXCI7XG5pbXBvcnQgeyBQaGFudG9tVXRpbCB9IGZyb20gXCJzYXAvZmUvbWFjcm9zXCI7XG5pbXBvcnQgeyBYTUxQcmVwcm9jZXNzb3IgfSBmcm9tIFwic2FwL3VpL2NvcmUvdXRpbFwiO1xuaW1wb3J0IENvbnZlcnRlckNvbnRleHQgZnJvbSBcInNhcC9mZS9jb3JlL2NvbnZlcnRlcnMvQ29udmVydGVyQ29udGV4dFwiO1xuaW1wb3J0IHsgUGFnZUNvbnRyb2xsZXIgfSBmcm9tIFwic2FwL2ZlL2NvcmVcIjtcblxuQEFQSUNsYXNzKFwic2FwLmZlLm1hY3Jvcy5NYWNyb0FQSVwiKVxuY2xhc3MgTWFjcm9BUEkgZXh0ZW5kcyBDb250cm9sIHtcblx0c3RhdGljIG5hbWVzcGFjZTogc3RyaW5nID0gXCJzYXAuZmUubWFjcm9zXCI7XG5cdHN0YXRpYyBtYWNyb05hbWU6IHN0cmluZyA9IFwiTWFjcm9cIjtcblx0c3RhdGljIGZyYWdtZW50OiBzdHJpbmcgPSBcInNhcC5mZS5tYWNyb3MuTWFjcm9cIjtcblx0c3RhdGljIGhhc1ZhbGlkYXRpb246IGJvb2xlYW4gPSB0cnVlO1xuXHRzdGF0aWMgaW5zdGFuY2VNYXA6IFdlYWtNYXA8b2JqZWN0LCBvYmplY3RbXT4gPSBuZXcgV2Vha01hcDxvYmplY3QsIG9iamVjdFtdPigpO1xuXG5cdGNvbnN0cnVjdG9yKG1TZXR0aW5ncz86IFByb3BlcnRpZXNPZjxNYWNyb0FQST4sIC4uLm90aGVyczogYW55W10pIHtcblx0XHRzdXBlcihtU2V0dGluZ3MgYXMgYW55LCAuLi5vdGhlcnMpO1xuXHRcdE1hY3JvQVBJLnJlZ2lzdGVySW5zdGFuY2UodGhpcyk7XG5cdH1cblxuXHRzdGF0aWMgcmVnaXN0ZXJJbnN0YW5jZShfaW5zdGFuY2U6IGFueSkge1xuXHRcdGlmICghdGhpcy5pbnN0YW5jZU1hcC5nZXQoX2luc3RhbmNlLmNvbnN0cnVjdG9yKSkge1xuXHRcdFx0dGhpcy5pbnN0YW5jZU1hcC5zZXQoX2luc3RhbmNlLmNvbnN0cnVjdG9yLCBbXSk7XG5cdFx0fVxuXHRcdCh0aGlzLmluc3RhbmNlTWFwLmdldChfaW5zdGFuY2UuY29uc3RydWN0b3IpIGFzIG9iamVjdFtdKS5wdXNoKF9pbnN0YW5jZSk7XG5cdH1cblx0LyoqXG5cdCAqIERlZmluZXMgdGhlIHBhdGggb2YgdGhlIGNvbnRleHQgdXNlZCBpbiB0aGUgY3VycmVudCBwYWdlIG9yIGJsb2NrLlxuXHQgKiBUaGlzIHNldHRpbmcgaXMgZGVmaW5lZCBieSB0aGUgZnJhbWV3b3JrLlxuXHQgKlxuXHQgKiBAcHVibGljXG5cdCAqL1xuXHRAUHJvcGVydHkoeyB0eXBlOiBcInN0cmluZ1wiIH0pXG5cdGNvbnRleHRQYXRoITogc3RyaW5nO1xuXG5cdC8qKlxuXHQgKiBEZWZpbmVzIHRoZSByZWxhdGl2ZSBwYXRoIG9mIHRoZSBwcm9wZXJ0eSBpbiB0aGUgbWV0YW1vZGVsLCBiYXNlZCBvbiB0aGUgY3VycmVudCBjb250ZXh0UGF0aC5cblx0ICpcblx0ICogQHB1YmxpY1xuXHQgKi9cblx0QFByb3BlcnR5KHsgdHlwZTogXCJzdHJpbmdcIiB9KVxuXHRtZXRhUGF0aCE6IHN0cmluZztcblxuXHRAQWdncmVnYXRpb24oeyB0eXBlOiBcInNhcC51aS5jb3JlLkNvbnRyb2xcIiwgbXVsdGlwbGU6IGZhbHNlLCBpc0RlZmF1bHQ6IHRydWUgfSlcblx0Y29udGVudCE6IENvbnRyb2w7XG5cblx0cmVyZW5kZXIoKSB7XG5cdFx0dGhpcy5jb250ZW50LnJlcmVuZGVyKCk7XG5cdH1cblxuXHRnZXREb21SZWYoKSB7XG5cdFx0Y29uc3Qgb0NvbnRlbnQgPSB0aGlzLmNvbnRlbnQ7XG5cdFx0cmV0dXJuIG9Db250ZW50ID8gb0NvbnRlbnQuZ2V0RG9tUmVmKCkgOiBzdXBlci5nZXREb21SZWYoKTtcblx0fVxuXHRnZXRDb250cm9sbGVyKCk6IFBhZ2VDb250cm9sbGVyIHtcblx0XHRyZXR1cm4gKHRoaXMuZ2V0TW9kZWwoXCIkdmlld1wiKSBhcyBhbnkpLmdldE9iamVjdCgpLmdldENvbnRyb2xsZXIoKTtcblx0fVxuXHRwcml2YXRlIG1ldGFkYXRhOiBhbnk7XG5cdHByaXZhdGUgbW9kZWxSZXNvbHZlZDogYm9vbGVhbiA9IGZhbHNlO1xuXHRwcm9wYWdhdGVQcm9wZXJ0aWVzKHZOYW1lOiBzdHJpbmcgfCBib29sZWFuKSB7XG5cdFx0Ly8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIEB0eXBlc2NyaXB0LWVzbGludC9iYW4tdHMtY29tbWVudFxuXHRcdC8vIEB0cy1pZ25vcmVcblx0XHRzdXBlci5wcm9wYWdhdGVQcm9wZXJ0aWVzKHZOYW1lKTtcblx0XHRpZiAodGhpcy5tZXRhZGF0YS5tYWNyb0NvbnRleHRzICYmICF0aGlzLm1vZGVsUmVzb2x2ZWQpIHtcblx0XHRcdGNvbnN0IG9QYWdlTW9kZWwgPSB0aGlzLmdldE1vZGVsKFwiX3BhZ2VNb2RlbFwiKTtcblx0XHRcdGlmIChvUGFnZU1vZGVsKSB7XG5cdFx0XHRcdE9iamVjdC5rZXlzKHRoaXMubWV0YWRhdGEubWFjcm9Db250ZXh0cykuZm9yRWFjaCgobWFjcm9LZXlOYW1lOiBzdHJpbmcpID0+IHtcblx0XHRcdFx0XHR0aGlzW21hY3JvS2V5TmFtZSBhcyBrZXlvZiBNYWNyb0FQSV0gPSBvUGFnZU1vZGVsLmdldE9iamVjdCh0aGlzW21hY3JvS2V5TmFtZSBhcyBrZXlvZiBNYWNyb0FQSV0gYXMgc3RyaW5nKTtcblx0XHRcdFx0fSk7XG5cdFx0XHRcdHRoaXMubW9kZWxSZXNvbHZlZCA9IHRydWU7XG5cdFx0XHR9XG5cdFx0fVxuXHR9XG5cblx0c3RhdGljIGdldEFQSShvRXZlbnQ6IFVJNUV2ZW50KTogTWFjcm9BUEkge1xuXHRcdGxldCBvU291cmNlID0gb0V2ZW50LmdldFNvdXJjZSgpO1xuXHRcdHdoaWxlIChvU291cmNlICYmICFvU291cmNlLmlzQShcInNhcC5mZS5tYWNyb3MuTWFjcm9BUElcIikgJiYgb1NvdXJjZS5nZXRQYXJlbnQpIHtcblx0XHRcdG9Tb3VyY2UgPSBvU291cmNlLmdldFBhcmVudCgpO1xuXHRcdH1cblx0XHRpZiAoIW9Tb3VyY2UgfHwgIW9Tb3VyY2UuaXNBKFwic2FwLmZlLm1hY3Jvcy5NYWNyb0FQSVwiKSkge1xuXHRcdFx0Y29uc3Qgb1NvdXJjZU1hcCA9IHRoaXMuaW5zdGFuY2VNYXAuZ2V0KHRoaXMpIGFzIG9iamVjdFtdO1xuXHRcdFx0b1NvdXJjZSA9IG9Tb3VyY2VNYXBbb1NvdXJjZU1hcC5sZW5ndGggLSAxXTtcblx0XHR9XG5cdFx0cmV0dXJuIG9Tb3VyY2UgJiYgb1NvdXJjZS5pc0EoXCJzYXAuZmUubWFjcm9zLk1hY3JvQVBJXCIpICYmIG9Tb3VyY2U7XG5cdH1cblxuXHRzdGF0aWMgc2V0RGVmYXVsdFZhbHVlKG9Qcm9wczogYW55LCBzUHJvcE5hbWU6IHN0cmluZywgb092ZXJyaWRlVmFsdWU6IGFueSkge1xuXHRcdGlmIChvUHJvcHNbc1Byb3BOYW1lXSA9PT0gdW5kZWZpbmVkKSB7XG5cdFx0XHRvUHJvcHNbc1Byb3BOYW1lXSA9IG9PdmVycmlkZVZhbHVlO1xuXHRcdH1cblx0fVxuXHRzdGF0aWMgZ2V0Q29udmVydGVyQ29udGV4dCA9IGZ1bmN0aW9uKG9EYXRhTW9kZWxQYXRoOiBEYXRhTW9kZWxPYmplY3RQYXRoLCBjb250ZXh0UGF0aDogc3RyaW5nLCBtU2V0dGluZ3M6IGFueSkge1xuXHRcdGNvbnN0IG9BcHBDb21wb25lbnQgPSBtU2V0dGluZ3MuYXBwQ29tcG9uZW50O1xuXHRcdGNvbnN0IHZpZXdEYXRhID0gbVNldHRpbmdzLm1vZGVscy52aWV3RGF0YSAmJiBtU2V0dGluZ3MubW9kZWxzLnZpZXdEYXRhLmdldERhdGEoKTtcblx0XHRjb25zdCBvQ29udmVydGVyQ29udGV4dCA9IENvbnZlcnRlckNvbnRleHQuY3JlYXRlQ29udmVydGVyQ29udGV4dEZvck1hY3JvKFxuXHRcdFx0b0RhdGFNb2RlbFBhdGguc3RhcnRpbmdFbnRpdHlTZXQubmFtZSxcblx0XHRcdG1TZXR0aW5ncy5tb2RlbHMubWV0YU1vZGVsLFxuXHRcdFx0b0FwcENvbXBvbmVudCAmJiBvQXBwQ29tcG9uZW50LmdldERpYWdub3N0aWNzKCksXG5cdFx0XHRtZXJnZSxcblx0XHRcdG9EYXRhTW9kZWxQYXRoLmNvbnRleHRMb2NhdGlvbixcblx0XHRcdHZpZXdEYXRhXG5cdFx0KTtcblx0XHRyZXR1cm4gb0NvbnZlcnRlckNvbnRleHQ7XG5cdH07XG5cdHN0YXRpYyBjcmVhdGVCaW5kaW5nQ29udGV4dCA9IGZ1bmN0aW9uKG9EYXRhOiBvYmplY3QsIG1TZXR0aW5nczogYW55KSB7XG5cdFx0Y29uc3Qgc0NvbnRleHRQYXRoID0gXCIvXCIgKyB1aWQoKTtcblx0XHRtU2V0dGluZ3MubW9kZWxzLmNvbnZlcnRlckNvbnRleHQuc2V0UHJvcGVydHkoc0NvbnRleHRQYXRoLCBvRGF0YSk7XG5cdFx0cmV0dXJuIG1TZXR0aW5ncy5tb2RlbHMuY29udmVydGVyQ29udGV4dC5jcmVhdGVCaW5kaW5nQ29udGV4dChzQ29udGV4dFBhdGgpO1xuXHR9O1xuXHRzdGF0aWMgcmVnaXN0ZXIoKSB7XG5cdFx0UGhhbnRvbVV0aWwucmVnaXN0ZXIodGhpcyk7XG5cdH1cblx0c3RhdGljIHVucmVnaXN0ZXIoKSB7XG5cdFx0KFhNTFByZXByb2Nlc3NvciBhcyBhbnkpLnBsdWdJbihudWxsLCB0aGlzLm5hbWVzcGFjZSwgdGhpcy5tYWNyb05hbWUpO1xuXHR9XG59XG5cbmV4cG9ydCBkZWZhdWx0IE1hY3JvQVBJO1xuIl19