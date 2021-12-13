/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)
 *      (c) Copyright 2009-2021 SAP SE. All rights reserved
 */
sap.ui.define(["sap/fe/core/helpers/ClassSupport", "./MacroAPI"], function (ClassSupport, MacroAPI) {
  "use strict";

  var _dec, _dec2, _dec3, _dec4, _dec5, _dec6, _dec7, _dec8, _class, _class2, _descriptor, _descriptor2, _descriptor3, _descriptor4, _descriptor5, _descriptor6, _descriptor7, _descriptor8;

  var Association = ClassSupport.Association;
  var Property = ClassSupport.Property;
  var Event = ClassSupport.Event;
  var EventHandler = ClassSupport.EventHandler;
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
   * Building block for creating a field based on the metadata provided by OData V4.
   * <br>
   * Usually, a DataField or DataPoint annotation is expected, but the field can also be used to display a property from the entity type.
   *
   *
   * Usage example:
   * <pre>
   * &lt;macro:Field id="MyField" metaPath="MyProperty" /&gt;
   * </pre>
   *
   * @alias sap.fe.macros.Field
   * @public
   */
  var FieldAPI = (_dec = APIClass("sap.fe.macros.FieldAPI"), _dec2 = Property({
    type: "boolean"
  }), _dec3 = Property({
    type: "boolean"
  }), _dec4 = Property({
    type: "string"
  }), _dec5 = Association({
    type: "sap.ui.core.Control",
    multiple: true,
    singularName: "ariaLabelledBy"
  }), _dec6 = Property({
    type: "boolean"
  }), _dec7 = Property({
    type: "sap.fe.macros.FieldFormatOptions"
  }), _dec8 = Property({
    type: "string"
  }), _dec(_class = (_class2 = /*#__PURE__*/function (_MacroAPI) {
    _inherits(FieldAPI, _MacroAPI);

    var _super = _createSuper(FieldAPI);

    function FieldAPI() {
      var _this;

      _classCallCheck(this, FieldAPI);

      for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
        args[_key] = arguments[_key];
      }

      _this = _super.call.apply(_super, [this].concat(args));

      _initializerDefineProperty(_assertThisInitialized(_this), "editable", _descriptor, _assertThisInitialized(_this));

      _initializerDefineProperty(_assertThisInitialized(_this), "readOnly", _descriptor2, _assertThisInitialized(_this));

      _initializerDefineProperty(_assertThisInitialized(_this), "id", _descriptor3, _assertThisInitialized(_this));

      _initializerDefineProperty(_assertThisInitialized(_this), "change", _descriptor4, _assertThisInitialized(_this));

      _initializerDefineProperty(_assertThisInitialized(_this), "ariaLabelledBy", _descriptor5, _assertThisInitialized(_this));

      _initializerDefineProperty(_assertThisInitialized(_this), "required", _descriptor6, _assertThisInitialized(_this));

      _initializerDefineProperty(_assertThisInitialized(_this), "formatOptions", _descriptor7, _assertThisInitialized(_this));

      _initializerDefineProperty(_assertThisInitialized(_this), "semanticObject", _descriptor8, _assertThisInitialized(_this));

      return _this;
    }

    _createClass(FieldAPI, [{
      key: "handleChange",
      value: function handleChange(oEvent) {
        this.fireChange({
          value: this.getValue(),
          isValid: oEvent.getParameter("valid")
        });
      }
    }, {
      key: "onBeforeRendering",
      value: function onBeforeRendering() {
        var oContent = this.getContent();

        if (oContent && oContent.addAriaLabelledBy) {
          var aAriaLabelledBy = this.getAriaLabelledBy();

          for (var i = 0; i < aAriaLabelledBy.length; i++) {
            var sId = aAriaLabelledBy[i];
            var aAriaLabelledBys = oContent.getAriaLabelledBy() || [];

            if (aAriaLabelledBys.indexOf(sId) === -1) {
              oContent.addAriaLabelledBy(sId);
            }
          }
        }
      }
    }, {
      key: "enhanceAccessibilityState",
      value: function enhanceAccessibilityState(_oElement, mAriaProps) {
        var oParent = this.getParent();

        if (oParent && oParent.enhanceAccessibilityState) {
          // use FieldWrapper as control, but aria properties of rendered inner control.
          oParent.enhanceAccessibilityState(this, mAriaProps);
        }

        return mAriaProps;
      }
    }, {
      key: "getAccessibilityInfo",
      value: function getAccessibilityInfo() {
        var oContent = this.content;
        return oContent && oContent.getAccessibilityInfo ? oContent.getAccessibilityInfo() : {};
      }
      /**
       * Retrieves the current value of the Field.
       *
       * @public
       * @returns The current value of the field
       */

    }, {
      key: "getValue",
      value: function getValue() {
        var oControl = this.content,
            aControls;

        if (oControl.isA("sap.fe.core.controls.FieldWrapper")) {
          aControls = oControl.getContentEdit() || [oControl.getContentDisplay()] || [];

          if (aControls.length === 1) {
            oControl = aControls[0];
          } else {
            throw "getting value not yet implemented for this field type";
          }
        }

        if (oControl.isA("sap.m.CheckBox")) {
          return oControl.getSelected();
        } else if (oControl.isA("sap.m.Input")) {
          return oControl.getValue();
        } else if (oControl.isA("sap.ui.mdc.Field")) {
          return oControl.getValue();
        } else if (oControl.isA("sap.m.TextArea")) {
          return oControl.getValue();
        } else {
          throw "getting value not yet implemented for this field type";
        }
      }
    }]);

    return FieldAPI;
  }(MacroAPI), (_descriptor = _applyDecoratedDescriptor(_class2.prototype, "editable", [_dec2], {
    configurable: true,
    enumerable: true,
    writable: true,
    initializer: null
  }), _descriptor2 = _applyDecoratedDescriptor(_class2.prototype, "readOnly", [_dec3], {
    configurable: true,
    enumerable: true,
    writable: true,
    initializer: null
  }), _descriptor3 = _applyDecoratedDescriptor(_class2.prototype, "id", [_dec4], {
    configurable: true,
    enumerable: true,
    writable: true,
    initializer: null
  }), _descriptor4 = _applyDecoratedDescriptor(_class2.prototype, "change", [Event], {
    configurable: true,
    enumerable: true,
    writable: true,
    initializer: null
  }), _descriptor5 = _applyDecoratedDescriptor(_class2.prototype, "ariaLabelledBy", [_dec5], {
    configurable: true,
    enumerable: true,
    writable: true,
    initializer: null
  }), _descriptor6 = _applyDecoratedDescriptor(_class2.prototype, "required", [_dec6], {
    configurable: true,
    enumerable: true,
    writable: true,
    initializer: null
  }), _descriptor7 = _applyDecoratedDescriptor(_class2.prototype, "formatOptions", [_dec7], {
    configurable: true,
    enumerable: true,
    writable: true,
    initializer: null
  }), _descriptor8 = _applyDecoratedDescriptor(_class2.prototype, "semanticObject", [_dec8], {
    configurable: true,
    enumerable: true,
    writable: true,
    initializer: null
  }), _applyDecoratedDescriptor(_class2.prototype, "handleChange", [EventHandler], Object.getOwnPropertyDescriptor(_class2.prototype, "handleChange"), _class2.prototype)), _class2)) || _class);
  return FieldAPI;
}, false);
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIkZpZWxkQVBJLnRzIl0sIm5hbWVzIjpbIkZpZWxkQVBJIiwiQVBJQ2xhc3MiLCJQcm9wZXJ0eSIsInR5cGUiLCJBc3NvY2lhdGlvbiIsIm11bHRpcGxlIiwic2luZ3VsYXJOYW1lIiwib0V2ZW50IiwiZmlyZUNoYW5nZSIsInZhbHVlIiwiZ2V0VmFsdWUiLCJpc1ZhbGlkIiwiZ2V0UGFyYW1ldGVyIiwib0NvbnRlbnQiLCJnZXRDb250ZW50IiwiYWRkQXJpYUxhYmVsbGVkQnkiLCJhQXJpYUxhYmVsbGVkQnkiLCJnZXRBcmlhTGFiZWxsZWRCeSIsImkiLCJsZW5ndGgiLCJzSWQiLCJhQXJpYUxhYmVsbGVkQnlzIiwiaW5kZXhPZiIsIl9vRWxlbWVudCIsIm1BcmlhUHJvcHMiLCJvUGFyZW50IiwiZ2V0UGFyZW50IiwiZW5oYW5jZUFjY2Vzc2liaWxpdHlTdGF0ZSIsImNvbnRlbnQiLCJnZXRBY2Nlc3NpYmlsaXR5SW5mbyIsIm9Db250cm9sIiwiYUNvbnRyb2xzIiwiaXNBIiwiZ2V0Q29udGVudEVkaXQiLCJnZXRDb250ZW50RGlzcGxheSIsImdldFNlbGVjdGVkIiwiTWFjcm9BUEkiLCJFdmVudCIsIkV2ZW50SGFuZGxlciJdLCJtYXBwaW5ncyI6IjtBQUFBO0FBQ0E7QUFDQTs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQTZCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO01BRU1BLFEsV0FETEMsUUFBUSxDQUFDLHdCQUFELEMsVUFXUEMsUUFBUSxDQUFDO0FBQUVDLElBQUFBLElBQUksRUFBRTtBQUFSLEdBQUQsQyxVQVVSRCxRQUFRLENBQUM7QUFBRUMsSUFBQUEsSUFBSSxFQUFFO0FBQVIsR0FBRCxDLFVBUVJELFFBQVEsQ0FBQztBQUFFQyxJQUFBQSxJQUFJLEVBQUU7QUFBUixHQUFELEMsVUFXUkMsV0FBVyxDQUFDO0FBQUVELElBQUFBLElBQUksRUFBRSxxQkFBUjtBQUErQkUsSUFBQUEsUUFBUSxFQUFFLElBQXpDO0FBQStDQyxJQUFBQSxZQUFZLEVBQUU7QUFBN0QsR0FBRCxDLFVBR1hKLFFBQVEsQ0FBQztBQUFFQyxJQUFBQSxJQUFJLEVBQUU7QUFBUixHQUFELEMsVUFRUkQsUUFBUSxDQUFDO0FBQUVDLElBQUFBLElBQUksRUFBRTtBQUFSLEdBQUQsQyxVQVVSRCxRQUFRLENBQUM7QUFBRUMsSUFBQUEsSUFBSSxFQUFFO0FBQVIsR0FBRCxDOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O2FBR1Qsc0JBQ2FJLE1BRGIsRUFDK0I7QUFDN0IsWUFBRCxDQUFjQyxVQUFkLENBQXlCO0FBQUVDLFVBQUFBLEtBQUssRUFBRSxLQUFLQyxRQUFMLEVBQVQ7QUFBMEJDLFVBQUFBLE9BQU8sRUFBRUosTUFBTSxDQUFDSyxZQUFQLENBQW9CLE9BQXBCO0FBQW5DLFNBQXpCO0FBQ0E7OzthQUVELDZCQUFvQjtBQUNuQixZQUFNQyxRQUFRLEdBQUksSUFBRCxDQUFjQyxVQUFkLEVBQWpCOztBQUNBLFlBQUlELFFBQVEsSUFBSUEsUUFBUSxDQUFDRSxpQkFBekIsRUFBNEM7QUFDM0MsY0FBTUMsZUFBZSxHQUFJLElBQUQsQ0FBY0MsaUJBQWQsRUFBeEI7O0FBRUEsZUFBSyxJQUFJQyxDQUFDLEdBQUcsQ0FBYixFQUFnQkEsQ0FBQyxHQUFHRixlQUFlLENBQUNHLE1BQXBDLEVBQTRDRCxDQUFDLEVBQTdDLEVBQWlEO0FBQ2hELGdCQUFNRSxHQUFHLEdBQUdKLGVBQWUsQ0FBQ0UsQ0FBRCxDQUEzQjtBQUNBLGdCQUFNRyxnQkFBZ0IsR0FBR1IsUUFBUSxDQUFDSSxpQkFBVCxNQUFnQyxFQUF6RDs7QUFDQSxnQkFBSUksZ0JBQWdCLENBQUNDLE9BQWpCLENBQXlCRixHQUF6QixNQUFrQyxDQUFDLENBQXZDLEVBQTBDO0FBQ3pDUCxjQUFBQSxRQUFRLENBQUNFLGlCQUFULENBQTJCSyxHQUEzQjtBQUNBO0FBQ0Q7QUFDRDtBQUNEOzs7YUFFRCxtQ0FBMEJHLFNBQTFCLEVBQTZDQyxVQUE3QyxFQUF5RTtBQUN4RSxZQUFNQyxPQUFPLEdBQUcsS0FBS0MsU0FBTCxFQUFoQjs7QUFFQSxZQUFJRCxPQUFPLElBQUtBLE9BQUQsQ0FBaUJFLHlCQUFoQyxFQUEyRDtBQUMxRDtBQUNDRixVQUFBQSxPQUFELENBQWlCRSx5QkFBakIsQ0FBMkMsSUFBM0MsRUFBaURILFVBQWpEO0FBQ0E7O0FBRUQsZUFBT0EsVUFBUDtBQUNBOzs7YUFDRCxnQ0FBK0I7QUFDOUIsWUFBTVgsUUFBUSxHQUFHLEtBQUtlLE9BQXRCO0FBQ0EsZUFBT2YsUUFBUSxJQUFJQSxRQUFRLENBQUNnQixvQkFBckIsR0FBNENoQixRQUFRLENBQUNnQixvQkFBVCxFQUE1QyxHQUE4RSxFQUFyRjtBQUNBO0FBQ0Q7QUFDRDtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7O2FBQ0Msb0JBQTZCO0FBQzVCLFlBQUlDLFFBQVEsR0FBRyxLQUFLRixPQUFwQjtBQUFBLFlBQ0NHLFNBREQ7O0FBR0EsWUFBSUQsUUFBUSxDQUFDRSxHQUFULENBQWEsbUNBQWIsQ0FBSixFQUF1RDtBQUN0REQsVUFBQUEsU0FBUyxHQUFJRCxRQUFELENBQTJCRyxjQUEzQixNQUErQyxDQUFFSCxRQUFELENBQTJCSSxpQkFBM0IsRUFBRCxDQUEvQyxJQUFtRyxFQUEvRzs7QUFDQSxjQUFJSCxTQUFTLENBQUNaLE1BQVYsS0FBcUIsQ0FBekIsRUFBNEI7QUFDM0JXLFlBQUFBLFFBQVEsR0FBR0MsU0FBUyxDQUFDLENBQUQsQ0FBcEI7QUFDQSxXQUZELE1BRU87QUFDTixrQkFBTSx1REFBTjtBQUNBO0FBQ0Q7O0FBRUQsWUFBSUQsUUFBUSxDQUFDRSxHQUFULENBQXVCLGdCQUF2QixDQUFKLEVBQThDO0FBQzdDLGlCQUFPRixRQUFRLENBQUNLLFdBQVQsRUFBUDtBQUNBLFNBRkQsTUFFTyxJQUFJTCxRQUFRLENBQUNFLEdBQVQsQ0FBb0IsYUFBcEIsQ0FBSixFQUF3QztBQUM5QyxpQkFBT0YsUUFBUSxDQUFDcEIsUUFBVCxFQUFQO0FBQ0EsU0FGTSxNQUVBLElBQUlvQixRQUFRLENBQUNFLEdBQVQsQ0FBdUIsa0JBQXZCLENBQUosRUFBZ0Q7QUFDdEQsaUJBQU9GLFFBQVEsQ0FBQ3BCLFFBQVQsRUFBUDtBQUNBLFNBRk0sTUFFQSxJQUFJb0IsUUFBUSxDQUFDRSxHQUFULENBQXVCLGdCQUF2QixDQUFKLEVBQThDO0FBQ3BELGlCQUFPRixRQUFRLENBQUNwQixRQUFULEVBQVA7QUFDQSxTQUZNLE1BRUE7QUFDTixnQkFBTSx1REFBTjtBQUNBO0FBQ0Q7Ozs7SUEvSHFCMEIsUTs7Ozs7Ozs7Ozs7Ozs7OzZFQW9DckJDLEs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7b0VBMkJBQyxZO1NBbUVhdEMsUSIsInNvdXJjZVJvb3QiOiIuIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgQVBJQ2xhc3MsIEV2ZW50SGFuZGxlciwgRXZlbnQsIFByb3BlcnR5LCBBc3NvY2lhdGlvbiB9IGZyb20gXCJzYXAvZmUvY29yZS9oZWxwZXJzL0NsYXNzU3VwcG9ydFwiO1xuaW1wb3J0IE1hY3JvQVBJIGZyb20gXCIuL01hY3JvQVBJXCI7XG5pbXBvcnQgeyBJbnB1dCwgQ2hlY2tCb3gsIFRleHRBcmVhIH0gZnJvbSBcInNhcC9tXCI7XG5pbXBvcnQgeyBGaWVsZCBhcyBtZGNGaWVsZCB9IGZyb20gXCJzYXAvdWkvbWRjXCI7XG5pbXBvcnQgeyBGaWVsZFdyYXBwZXIgfSBmcm9tIFwic2FwL2ZlL2NvcmUvY29udHJvbHNcIjtcbmltcG9ydCB7IENvbnRyb2wgfSBmcm9tIFwic2FwL3VpL2NvcmVcIjtcblxuLyoqXG4gKiBBZGRpdGlvbmFsIGZvcm1hdCBvcHRpb25zIGZvciB0aGUgZmllbGQuXG4gKlxuICogQGFsaWFzIHNhcC5mZS5tYWNyb3MuRmllbGRGb3JtYXRPcHRpb25zXG4gKiBAcHVibGljXG4gKi9cbmV4cG9ydCB0eXBlIEZpZWxkRm9ybWF0T3B0aW9ucyA9IHtcblx0LyoqXG5cdCAqICBEZWZpbmVzIGhvdyB0aGUgZmllbGQgdmFsdWUgYW5kIGFzc29jaWF0ZWQgdGV4dCB3aWxsIGJlIGRpc3BsYXllZCB0b2dldGhlci48YnIvPlxuXHQgKlxuXHQgKiAgQWxsb3dlZCB2YWx1ZXMgYXJlIFwiVmFsdWVcIiwgXCJEZXNjcmlwdGlvblwiLCBcIlZhbHVlRGVzY3JpcHRpb25cIiBhbmQgXCJEZXNjcmlwdGlvblZhbHVlXCJcblx0ICpcblx0ICogIEBwdWJsaWNcblx0ICovXG5cdGRpc3BsYXlNb2RlOiBzdHJpbmc7XG5cdC8qKlxuXHQgKiBEZWZpbmVzIGlmIGFuZCBob3cgdGhlIGZpZWxkIG1lYXN1cmUgd2lsbCBiZSBkaXNwbGF5ZWQuPGJyLz5cblx0ICpcblx0ICogQWxsb3dlZCB2YWx1ZXMgYXJlIFwiSGlkZGVuXCIgYW5kIFwiUmVhZE9ubHlcIlxuXHQgKlxuXHQgKiAgQHB1YmxpY1xuXHQgKi9cblx0bWVhc3VyZURpc3BsYXlNb2RlOiBzdHJpbmc7XG59O1xuLyoqXG4gKiBCdWlsZGluZyBibG9jayBmb3IgY3JlYXRpbmcgYSBmaWVsZCBiYXNlZCBvbiB0aGUgbWV0YWRhdGEgcHJvdmlkZWQgYnkgT0RhdGEgVjQuXG4gKiA8YnI+XG4gKiBVc3VhbGx5LCBhIERhdGFGaWVsZCBvciBEYXRhUG9pbnQgYW5ub3RhdGlvbiBpcyBleHBlY3RlZCwgYnV0IHRoZSBmaWVsZCBjYW4gYWxzbyBiZSB1c2VkIHRvIGRpc3BsYXkgYSBwcm9wZXJ0eSBmcm9tIHRoZSBlbnRpdHkgdHlwZS5cbiAqXG4gKlxuICogVXNhZ2UgZXhhbXBsZTpcbiAqIDxwcmU+XG4gKiAmbHQ7bWFjcm86RmllbGQgaWQ9XCJNeUZpZWxkXCIgbWV0YVBhdGg9XCJNeVByb3BlcnR5XCIgLyZndDtcbiAqIDwvcHJlPlxuICpcbiAqIEBhbGlhcyBzYXAuZmUubWFjcm9zLkZpZWxkXG4gKiBAcHVibGljXG4gKi9cbkBBUElDbGFzcyhcInNhcC5mZS5tYWNyb3MuRmllbGRBUElcIilcbmNsYXNzIEZpZWxkQVBJIGV4dGVuZHMgTWFjcm9BUEkge1xuXHQvKipcblx0ICogQW4gZXhwcmVzc2lvbiB0aGF0IGFsbG93cyB5b3UgdG8gY29udHJvbCB0aGUgZWRpdGFibGUgc3RhdGUgb2YgdGhlIGZpZWxkLlxuXHQgKlxuXHQgKiBJZiB5b3UgZG8gbm90IHNldCBhbnkgZXhwcmVzc2lvbiwgU0FQIEZpb3JpIGVsZW1lbnRzIGhvb2tzIGludG8gdGhlIHN0YW5kYXJkIGxpZmVjeWNsZSB0byBkZXRlcm1pbmUgaWYgdGhlIHBhZ2UgaXMgY3VycmVudGx5IGVkaXRhYmxlLlxuXHQgKiBQbGVhc2Ugbm90ZSB0aGF0IHlvdSBjYW5ub3Qgc2V0IGEgZmllbGQgdG8gZWRpdGFibGUgaWYgaXQgaGFzIGJlZW4gZGVmaW5lZCBpbiB0aGUgYW5ub3RhdGlvbiBhcyBub3QgZWRpdGFibGUuXG5cdCAqXG5cdCAqIEBwcml2YXRlXG5cdCAqIEBkZXByZWNhdGVkXG5cdCAqL1xuXHRAUHJvcGVydHkoeyB0eXBlOiBcImJvb2xlYW5cIiB9KVxuXHRlZGl0YWJsZSE6IGJvb2xlYW47XG5cblx0LyoqXG5cdCAqIEFuIGV4cHJlc3Npb24gdGhhdCBhbGxvd3MgeW91IHRvIGNvbnRyb2wgdGhlIHJlYWQtb25seSBzdGF0ZSBvZiB0aGUgZmllbGQuXG5cdCAqXG5cdCAqIElmIHlvdSBkbyBub3Qgc2V0IGFueSBleHByZXNzaW9uLCBTQVAgRmlvcmkgZWxlbWVudHMgaG9va3MgaW50byB0aGUgc3RhbmRhcmQgbGlmZWN5Y2xlIHRvIGRldGVybWluZSB0aGUgY3VycmVudCBzdGF0ZS5cblx0ICpcblx0ICogQHB1YmxpY1xuXHQgKi9cblx0QFByb3BlcnR5KHsgdHlwZTogXCJib29sZWFuXCIgfSlcblx0cmVhZE9ubHkhOiBib29sZWFuO1xuXG5cdC8qKlxuXHQgKiBUaGUgaWRlbnRpZmllciBvZiB0aGUgRmllbGQgY29udHJvbC5cblx0ICpcblx0ICogQHB1YmxpY1xuXHQgKi9cblx0QFByb3BlcnR5KHsgdHlwZTogXCJzdHJpbmdcIiB9KVxuXHRpZCE6IHN0cmluZztcblxuXHQvKipcblx0ICogQW4gZXZlbnQgY29udGFpbmluZyBkZXRhaWxzIGlzIHRyaWdnZXJlZCB3aGVuIHRoZSB2YWx1ZSBvZiB0aGUgZmllbGQgaXMgY2hhbmdlZC5cblx0ICpcblx0ICogQHB1YmxpY1xuXHQgKi9cblx0QEV2ZW50XG5cdGNoYW5nZSE6IEZ1bmN0aW9uO1xuXG5cdEBBc3NvY2lhdGlvbih7IHR5cGU6IFwic2FwLnVpLmNvcmUuQ29udHJvbFwiLCBtdWx0aXBsZTogdHJ1ZSwgc2luZ3VsYXJOYW1lOiBcImFyaWFMYWJlbGxlZEJ5XCIgfSlcblx0YXJpYUxhYmVsbGVkQnkhOiBDb250cm9sO1xuXG5cdEBQcm9wZXJ0eSh7IHR5cGU6IFwiYm9vbGVhblwiIH0pXG5cdHJlcXVpcmVkITogYm9vbGVhbjtcblxuXHQvKipcblx0ICogQSBzZXQgb2Ygb3B0aW9ucyB0aGF0IGNhbiBiZSBjb25maWd1cmVkLlxuXHQgKlxuXHQgKiBAcHVibGljXG5cdCAqL1xuXHRAUHJvcGVydHkoeyB0eXBlOiBcInNhcC5mZS5tYWNyb3MuRmllbGRGb3JtYXRPcHRpb25zXCIgfSlcblx0Zm9ybWF0T3B0aW9ucyE6IEZpZWxkRm9ybWF0T3B0aW9ucztcblxuXHQvKipcblx0ICogT3B0aW9uIHRvIGFkZCBzZW1hbnRpYyBvYmplY3RzIHRvIGEgZmllbGQuXG5cdCAqIFZhbGlkIG9wdGlvbnMgYXJlIGVpdGhlciBhIHNpbmdsZSBzZW1hbnRpYyBvYmplY3QsIGEgc3RyaW5naWZpZWQgYXJyYXkgb2Ygc2VtYW50aWMgb2JqZWN0c1xuXHQgKiBvciBhIHNpbmdsZSBiaW5kaW5nIGV4cHJlc3Npb24gcmV0dXJuaW5nIGVpdGhlciBhIHNpbmdsZSBzZW1hbnRpYyBvYmplY3Qgb3IgYW4gYXJyYXkgb2Ygc2VtYW50aWMgb2JqZWN0c1xuXHQgKlxuXHQgKiBAcHVibGljXG5cdCAqL1xuXHRAUHJvcGVydHkoeyB0eXBlOiBcInN0cmluZ1wiIH0pXG5cdHNlbWFudGljT2JqZWN0ITogc3RyaW5nO1xuXG5cdEBFdmVudEhhbmRsZXJcblx0aGFuZGxlQ2hhbmdlKG9FdmVudDogVUk1RXZlbnQpIHtcblx0XHQodGhpcyBhcyBhbnkpLmZpcmVDaGFuZ2UoeyB2YWx1ZTogdGhpcy5nZXRWYWx1ZSgpLCBpc1ZhbGlkOiBvRXZlbnQuZ2V0UGFyYW1ldGVyKFwidmFsaWRcIikgfSk7XG5cdH1cblxuXHRvbkJlZm9yZVJlbmRlcmluZygpIHtcblx0XHRjb25zdCBvQ29udGVudCA9ICh0aGlzIGFzIGFueSkuZ2V0Q29udGVudCgpO1xuXHRcdGlmIChvQ29udGVudCAmJiBvQ29udGVudC5hZGRBcmlhTGFiZWxsZWRCeSkge1xuXHRcdFx0Y29uc3QgYUFyaWFMYWJlbGxlZEJ5ID0gKHRoaXMgYXMgYW55KS5nZXRBcmlhTGFiZWxsZWRCeSgpO1xuXG5cdFx0XHRmb3IgKGxldCBpID0gMDsgaSA8IGFBcmlhTGFiZWxsZWRCeS5sZW5ndGg7IGkrKykge1xuXHRcdFx0XHRjb25zdCBzSWQgPSBhQXJpYUxhYmVsbGVkQnlbaV07XG5cdFx0XHRcdGNvbnN0IGFBcmlhTGFiZWxsZWRCeXMgPSBvQ29udGVudC5nZXRBcmlhTGFiZWxsZWRCeSgpIHx8IFtdO1xuXHRcdFx0XHRpZiAoYUFyaWFMYWJlbGxlZEJ5cy5pbmRleE9mKHNJZCkgPT09IC0xKSB7XG5cdFx0XHRcdFx0b0NvbnRlbnQuYWRkQXJpYUxhYmVsbGVkQnkoc0lkKTtcblx0XHRcdFx0fVxuXHRcdFx0fVxuXHRcdH1cblx0fVxuXG5cdGVuaGFuY2VBY2Nlc3NpYmlsaXR5U3RhdGUoX29FbGVtZW50OiBvYmplY3QsIG1BcmlhUHJvcHM6IG9iamVjdCk6IG9iamVjdCB7XG5cdFx0Y29uc3Qgb1BhcmVudCA9IHRoaXMuZ2V0UGFyZW50KCk7XG5cblx0XHRpZiAob1BhcmVudCAmJiAob1BhcmVudCBhcyBhbnkpLmVuaGFuY2VBY2Nlc3NpYmlsaXR5U3RhdGUpIHtcblx0XHRcdC8vIHVzZSBGaWVsZFdyYXBwZXIgYXMgY29udHJvbCwgYnV0IGFyaWEgcHJvcGVydGllcyBvZiByZW5kZXJlZCBpbm5lciBjb250cm9sLlxuXHRcdFx0KG9QYXJlbnQgYXMgYW55KS5lbmhhbmNlQWNjZXNzaWJpbGl0eVN0YXRlKHRoaXMsIG1BcmlhUHJvcHMpO1xuXHRcdH1cblxuXHRcdHJldHVybiBtQXJpYVByb3BzO1xuXHR9XG5cdGdldEFjY2Vzc2liaWxpdHlJbmZvKCk6IE9iamVjdCB7XG5cdFx0Y29uc3Qgb0NvbnRlbnQgPSB0aGlzLmNvbnRlbnQ7XG5cdFx0cmV0dXJuIG9Db250ZW50ICYmIG9Db250ZW50LmdldEFjY2Vzc2liaWxpdHlJbmZvID8gb0NvbnRlbnQuZ2V0QWNjZXNzaWJpbGl0eUluZm8oKSA6IHt9O1xuXHR9XG5cdC8qKlxuXHQgKiBSZXRyaWV2ZXMgdGhlIGN1cnJlbnQgdmFsdWUgb2YgdGhlIEZpZWxkLlxuXHQgKlxuXHQgKiBAcHVibGljXG5cdCAqIEByZXR1cm5zIFRoZSBjdXJyZW50IHZhbHVlIG9mIHRoZSBmaWVsZFxuXHQgKi9cblx0Z2V0VmFsdWUoKTogYm9vbGVhbiB8IHN0cmluZyB7XG5cdFx0bGV0IG9Db250cm9sID0gdGhpcy5jb250ZW50LFxuXHRcdFx0YUNvbnRyb2xzO1xuXG5cdFx0aWYgKG9Db250cm9sLmlzQShcInNhcC5mZS5jb3JlLmNvbnRyb2xzLkZpZWxkV3JhcHBlclwiKSkge1xuXHRcdFx0YUNvbnRyb2xzID0gKG9Db250cm9sIGFzIEZpZWxkV3JhcHBlcikuZ2V0Q29udGVudEVkaXQoKSB8fCBbKG9Db250cm9sIGFzIEZpZWxkV3JhcHBlcikuZ2V0Q29udGVudERpc3BsYXkoKV0gfHwgW107XG5cdFx0XHRpZiAoYUNvbnRyb2xzLmxlbmd0aCA9PT0gMSkge1xuXHRcdFx0XHRvQ29udHJvbCA9IGFDb250cm9sc1swXTtcblx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdHRocm93IFwiZ2V0dGluZyB2YWx1ZSBub3QgeWV0IGltcGxlbWVudGVkIGZvciB0aGlzIGZpZWxkIHR5cGVcIjtcblx0XHRcdH1cblx0XHR9XG5cblx0XHRpZiAob0NvbnRyb2wuaXNBPENoZWNrQm94PihcInNhcC5tLkNoZWNrQm94XCIpKSB7XG5cdFx0XHRyZXR1cm4gb0NvbnRyb2wuZ2V0U2VsZWN0ZWQoKTtcblx0XHR9IGVsc2UgaWYgKG9Db250cm9sLmlzQTxJbnB1dD4oXCJzYXAubS5JbnB1dFwiKSkge1xuXHRcdFx0cmV0dXJuIG9Db250cm9sLmdldFZhbHVlKCk7XG5cdFx0fSBlbHNlIGlmIChvQ29udHJvbC5pc0E8bWRjRmllbGQ+KFwic2FwLnVpLm1kYy5GaWVsZFwiKSkge1xuXHRcdFx0cmV0dXJuIG9Db250cm9sLmdldFZhbHVlKCk7XG5cdFx0fSBlbHNlIGlmIChvQ29udHJvbC5pc0E8VGV4dEFyZWE+KFwic2FwLm0uVGV4dEFyZWFcIikpIHtcblx0XHRcdHJldHVybiBvQ29udHJvbC5nZXRWYWx1ZSgpO1xuXHRcdH0gZWxzZSB7XG5cdFx0XHR0aHJvdyBcImdldHRpbmcgdmFsdWUgbm90IHlldCBpbXBsZW1lbnRlZCBmb3IgdGhpcyBmaWVsZCB0eXBlXCI7XG5cdFx0fVxuXHR9XG59XG5cbmV4cG9ydCBkZWZhdWx0IEZpZWxkQVBJO1xuIl19