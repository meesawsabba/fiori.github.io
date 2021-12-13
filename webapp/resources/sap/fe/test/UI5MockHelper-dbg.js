/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)
 *      (c) Copyright 2009-2021 SAP SE. All rights reserved
 */
sap.ui.define([], function () {
  "use strict";

  var _exports = {};

  function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

  function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

  function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

  function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

  /**
   * Mock class for a V4 Context
   */
  var MockContext = function MockContext(oValues, oBinding) {
    var _this = this;

    _classCallCheck(this, MockContext);

    _defineProperty(this, "getProperty", jest.fn(function (key) {
      return _this.oValues[key];
    }));

    _defineProperty(this, "getObject", jest.fn(function (key) {
      return _this.oValues[key];
    }));

    _defineProperty(this, "getPath", jest.fn(function () {
      return _this.oValues["$path"];
    }));

    _defineProperty(this, "getBinding", jest.fn(function () {
      return _this.oBinding;
    }));

    this.oValues = oValues;
    this.oBinding = oBinding;
  };

  _exports.MockContext = MockContext;

  var MockControl = function MockControl() {
    _classCallCheck(this, MockControl);

    _defineProperty(this, "getBindingInfo", jest.fn());

    _defineProperty(this, "getBinding", jest.fn());
  };
  /**
   * Mock class for OData V4 ListBinding
   */


  _exports.MockControl = MockControl;

  var MockListBinding = /*#__PURE__*/function () {
    function MockListBinding(aContexts) {
      var _this2 = this;

      _classCallCheck(this, MockListBinding);

      _defineProperty(this, "setAggregation", jest.fn());

      _defineProperty(this, "filter", jest.fn());

      _defineProperty(this, "sort", jest.fn());

      _defineProperty(this, "requestContexts", jest.fn(function () {
        return Promise.resolve(_this2.aMockContexts);
      }));

      _defineProperty(this, "getCurrentContexts", jest.fn(function () {
        return _this2.aMockContexts;
      }));

      aContexts = aContexts || [];
      this.aMockContexts = aContexts.map(function (context) {
        return new MockContext(context, _this2);
      });
    }

    _exports.MockListBinding = MockListBinding;

    _createClass(MockListBinding, [{
      key: "isA",
      value: function isA(sClassName) {
        return sClassName === "sap.ui.model.odata.v4.ODataListBinding";
      } // Mocked API

    }]);

    return MockListBinding;
  }();

  _exports.MockListBinding = MockListBinding;

  var MockContextBinding = /*#__PURE__*/function () {
    function MockContextBinding(oContext) {
      var _this3 = this;

      _classCallCheck(this, MockContextBinding);

      _defineProperty(this, "getBoundContext", jest.fn(function () {
        return _this3.oMockContext;
      }));

      _defineProperty(this, "attachEventOnce", jest.fn());

      this.oMockContext = new MockContext(oContext || {}, this);
    }

    _exports.MockContextBinding = MockContextBinding;

    _createClass(MockContextBinding, [{
      key: "isA",
      value: function isA(sClassName) {
        return sClassName === "sap.ui.model.odata.v4.ODataContextBinding";
      }
    }, {
      key: "getInternalMockContext",
      value: function getInternalMockContext() {
        return this.oMockContext;
      } // Mocked API

    }]);

    return MockContextBinding;
  }();
  /**
   * Mock class for OData V4 MetaModel
   */


  _exports.MockContextBinding = MockContextBinding;

  var MockMetaModel = function MockMetaModel(oMetaData) {
    var _this4 = this;

    _classCallCheck(this, MockMetaModel);

    _defineProperty(this, "getMetaContext", jest.fn(function (sPath) {
      return new MockContext({
        $path: sPath
      });
    }));

    _defineProperty(this, "getObject", jest.fn(function (sPath) {
      return _this4.oMetaContext.getProperty(sPath);
    }));

    this.oMetaContext = new MockContext(oMetaData || {});
  } // Mocked API
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  ;
  /**
   * Mock class for OData V4 Model
   */


  _exports.MockMetaModel = MockMetaModel;

  var MockModel = /*#__PURE__*/function () {
    function MockModel(mockListBinding, mockContextBinding) {
      var _this5 = this;

      _classCallCheck(this, MockModel);

      _defineProperty(this, "bindList", jest.fn(function () {
        return _this5.mockListBinding;
      }));

      _defineProperty(this, "bindContext", jest.fn(function () {
        return _this5.mockContextBinding;
      }));

      _defineProperty(this, "getMetaModel", jest.fn(function () {
        return _this5.oMetaModel;
      }));

      this.mockListBinding = mockListBinding;
      this.mockContextBinding = mockContextBinding;
    } // Factories


    _exports.MockModel = MockModel;

    _createClass(MockModel, [{
      key: "setMetaModel",
      value: function setMetaModel(oMetaModel) {
        this.oMetaModel = oMetaModel;
      } // Mocked API
      // eslint-disable-next-line @typescript-eslint/no-unused-vars

    }], [{
      key: "modelFromListBinding",
      value: function modelFromListBinding(mockListBinding) {
        return new MockModel(mockListBinding);
      }
    }, {
      key: "modelFromContextBinding",
      value: function modelFromContextBinding(mockContextBinding) {
        return new MockModel(undefined, mockContextBinding);
      }
    }]);

    return MockModel;
  }();

  _exports.MockModel = MockModel;
  return _exports;
}, false);
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIlVJNU1vY2tIZWxwZXIudHMiXSwibmFtZXMiOlsiTW9ja0NvbnRleHQiLCJvVmFsdWVzIiwib0JpbmRpbmciLCJqZXN0IiwiZm4iLCJrZXkiLCJNb2NrQ29udHJvbCIsIk1vY2tMaXN0QmluZGluZyIsImFDb250ZXh0cyIsIlByb21pc2UiLCJyZXNvbHZlIiwiYU1vY2tDb250ZXh0cyIsIm1hcCIsImNvbnRleHQiLCJzQ2xhc3NOYW1lIiwiTW9ja0NvbnRleHRCaW5kaW5nIiwib0NvbnRleHQiLCJvTW9ja0NvbnRleHQiLCJNb2NrTWV0YU1vZGVsIiwib01ldGFEYXRhIiwic1BhdGgiLCIkcGF0aCIsIm9NZXRhQ29udGV4dCIsImdldFByb3BlcnR5IiwiTW9ja01vZGVsIiwibW9ja0xpc3RCaW5kaW5nIiwibW9ja0NvbnRleHRCaW5kaW5nIiwib01ldGFNb2RlbCIsInVuZGVmaW5lZCJdLCJtYXBwaW5ncyI6IjtBQUFBO0FBQ0E7QUFDQTs7Ozs7Ozs7Ozs7Ozs7QUFGQTtBQUNBO0FBQ0E7TUFJYUEsVyxHQUNaLHFCQUEyQkMsT0FBM0IsRUFBaURDLFFBQWpELEVBQWlFO0FBQUE7O0FBQUE7O0FBQUEseUNBRTVDQyxJQUFJLENBQUNDLEVBQUwsQ0FBUSxVQUFDQyxHQUFELEVBQWlCO0FBQzdDLGFBQU8sS0FBSSxDQUFDSixPQUFMLENBQWFJLEdBQWIsQ0FBUDtBQUNBLEtBRm9CLENBRjRDOztBQUFBLHVDQUs5Q0YsSUFBSSxDQUFDQyxFQUFMLENBQVEsVUFBQ0MsR0FBRCxFQUFpQjtBQUMzQyxhQUFPLEtBQUksQ0FBQ0osT0FBTCxDQUFhSSxHQUFiLENBQVA7QUFDQSxLQUZrQixDQUw4Qzs7QUFBQSxxQ0FRaERGLElBQUksQ0FBQ0MsRUFBTCxDQUFRLFlBQU07QUFDOUIsYUFBTyxLQUFJLENBQUNILE9BQUwsQ0FBYSxPQUFiLENBQVA7QUFDQSxLQUZnQixDQVJnRDs7QUFBQSx3Q0FZN0NFLElBQUksQ0FBQ0MsRUFBTCxDQUFRLFlBQU07QUFDakMsYUFBTyxLQUFJLENBQUNGLFFBQVo7QUFDQSxLQUZtQixDQVo2Qzs7QUFBQSxTQUF0Q0QsT0FBc0MsR0FBdENBLE9BQXNDO0FBQUEsU0FBaEJDLFFBQWdCLEdBQWhCQSxRQUFnQjtBQUFFLEc7Ozs7TUFpQnZESSxXOzs7NENBQ1lILElBQUksQ0FBQ0MsRUFBTCxFOzt3Q0FDSkQsSUFBSSxDQUFDQyxFQUFMLEU7O0FBR3JCO0FBQ0E7QUFDQTs7Ozs7TUFDYUcsZTtBQUdaLDZCQUFtQkMsU0FBbkIsRUFBc0M7QUFBQTs7QUFBQTs7QUFBQSw4Q0FhZEwsSUFBSSxDQUFDQyxFQUFMLEVBYmM7O0FBQUEsc0NBY3RCRCxJQUFJLENBQUNDLEVBQUwsRUFkc0I7O0FBQUEsb0NBZXhCRCxJQUFJLENBQUNDLEVBQUwsRUFmd0I7O0FBQUEsK0NBa0JiRCxJQUFJLENBQUNDLEVBQUwsQ0FBUSxZQUFhO0FBQzdDLGVBQU9LLE9BQU8sQ0FBQ0MsT0FBUixDQUFpQixNQUFJLENBQUNDLGFBQXRCLENBQVA7QUFDQSxPQUZ3QixDQWxCYTs7QUFBQSxrREFzQlZSLElBQUksQ0FBQ0MsRUFBTCxDQUFRLFlBQWE7QUFDaEQsZUFBUSxNQUFJLENBQUNPLGFBQWI7QUFDQSxPQUYyQixDQXRCVTs7QUFDckNILE1BQUFBLFNBQVMsR0FBR0EsU0FBUyxJQUFJLEVBQXpCO0FBRUEsV0FBS0csYUFBTCxHQUFxQkgsU0FBUyxDQUFDSSxHQUFWLENBQWMsVUFBQUMsT0FBTyxFQUFJO0FBQzdDLGVBQU8sSUFBSWIsV0FBSixDQUFnQmEsT0FBaEIsRUFBeUIsTUFBekIsQ0FBUDtBQUNBLE9BRm9CLENBQXJCO0FBR0E7Ozs7OzthQUVELGFBQVdDLFVBQVgsRUFBd0M7QUFDdkMsZUFBT0EsVUFBVSxLQUFLLHdDQUF0QjtBQUNBLE8sQ0FFRDs7Ozs7Ozs7O01BZVlDLGtCO0FBR1osZ0NBQW1CQyxRQUFuQixFQUFtQztBQUFBOztBQUFBOztBQUFBLCtDQVlWYixJQUFJLENBQUNDLEVBQUwsQ0FBUSxZQUFNO0FBQ3RDLGVBQVEsTUFBSSxDQUFDYSxZQUFiO0FBQ0EsT0FGd0IsQ0FaVTs7QUFBQSwrQ0FlVmQsSUFBSSxDQUFDQyxFQUFMLEVBZlU7O0FBQ2xDLFdBQUthLFlBQUwsR0FBb0IsSUFBSWpCLFdBQUosQ0FBZ0JnQixRQUFRLElBQUksRUFBNUIsRUFBZ0MsSUFBaEMsQ0FBcEI7QUFDQTs7Ozs7O2FBRUQsYUFBV0YsVUFBWCxFQUF3QztBQUN2QyxlQUFPQSxVQUFVLEtBQUssMkNBQXRCO0FBQ0E7OzthQUNELGtDQUE2QztBQUM1QyxlQUFPLEtBQUtHLFlBQVo7QUFDQSxPLENBRUQ7Ozs7OztBQU9EO0FBQ0E7QUFDQTs7Ozs7TUFDYUMsYSxHQUdaLHVCQUFtQkMsU0FBbkIsRUFBb0M7QUFBQTs7QUFBQTs7QUFBQSw0Q0FNWmhCLElBQUksQ0FBQ0MsRUFBTCxDQUFRLFVBQUNnQixLQUFELEVBQW1CO0FBQ2xELGFBQVEsSUFBSXBCLFdBQUosQ0FBZ0I7QUFBRXFCLFFBQUFBLEtBQUssRUFBRUQ7QUFBVCxPQUFoQixDQUFSO0FBQ0EsS0FGdUIsQ0FOWTs7QUFBQSx1Q0FTakJqQixJQUFJLENBQUNDLEVBQUwsQ0FBUSxVQUFDZ0IsS0FBRCxFQUFtQjtBQUM3QyxhQUFPLE1BQUksQ0FBQ0UsWUFBTCxDQUFrQkMsV0FBbEIsQ0FBOEJILEtBQTlCLENBQVA7QUFDQSxLQUZrQixDQVRpQjs7QUFDbkMsU0FBS0UsWUFBTCxHQUFvQixJQUFJdEIsV0FBSixDQUFnQm1CLFNBQVMsSUFBSSxFQUE3QixDQUFwQjtBQUNBLEcsQ0FFRDtBQUNBOztBQVNEO0FBQ0E7QUFDQTs7Ozs7TUFFYUssUztBQUdaLHVCQUEyQkMsZUFBM0IsRUFBc0VDLGtCQUF0RSxFQUErRztBQUFBOztBQUFBOztBQUFBLHdDQWdCN0Z2QixJQUFJLENBQUNDLEVBQUwsQ0FBUSxZQUFhO0FBQ3RDLGVBQVEsTUFBSSxDQUFDcUIsZUFBYjtBQUNBLE9BRmlCLENBaEI2Rjs7QUFBQSwyQ0FvQjFGdEIsSUFBSSxDQUFDQyxFQUFMLENBQVEsWUFBYTtBQUN6QyxlQUFRLE1BQUksQ0FBQ3NCLGtCQUFiO0FBQ0EsT0FGb0IsQ0FwQjBGOztBQUFBLDRDQXVCekZ2QixJQUFJLENBQUNDLEVBQUwsQ0FBUSxZQUFNO0FBQ25DLGVBQVEsTUFBSSxDQUFDdUIsVUFBYjtBQUNBLE9BRnFCLENBdkJ5Rjs7QUFBQSxXQUFwRkYsZUFBb0YsR0FBcEZBLGVBQW9GO0FBQUEsV0FBekNDLGtCQUF5QyxHQUF6Q0Esa0JBQXlDO0FBQUUsSyxDQUVqSDs7Ozs7OzthQVFBLHNCQUFvQkMsVUFBcEIsRUFBK0M7QUFDOUMsYUFBS0EsVUFBTCxHQUFrQkEsVUFBbEI7QUFDQSxPLENBRUQ7QUFDQTs7OzthQVpBLDhCQUE0QkYsZUFBNUIsRUFBeUU7QUFDeEUsZUFBTyxJQUFJRCxTQUFKLENBQWNDLGVBQWQsQ0FBUDtBQUNBOzs7YUFDRCxpQ0FBK0JDLGtCQUEvQixFQUFrRjtBQUNqRixlQUFPLElBQUlGLFNBQUosQ0FBY0ksU0FBZCxFQUF5QkYsa0JBQXpCLENBQVA7QUFDQSIsInNvdXJjZVJvb3QiOiIuIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBNb2NrIGNsYXNzIGZvciBhIFY0IENvbnRleHRcbiAqL1xuXG5pbXBvcnQgeyBDb250ZXh0LCBPRGF0YUxpc3RCaW5kaW5nLCBPRGF0YUNvbnRleHRCaW5kaW5nLCBPRGF0YU1ldGFNb2RlbCwgT0RhdGFNb2RlbCB9IGZyb20gXCJzYXAvdWkvbW9kZWwvb2RhdGEvdjRcIjtcblxuZXhwb3J0IGNsYXNzIE1vY2tDb250ZXh0IGltcGxlbWVudHMgUGFydGlhbDxDb250ZXh0PiB7XG5cdHB1YmxpYyBjb25zdHJ1Y3Rvcihwcml2YXRlIG9WYWx1ZXM6IGFueSwgcHJpdmF0ZSBvQmluZGluZz86IGFueSkge31cblxuXHRwdWJsaWMgZ2V0UHJvcGVydHkgPSBqZXN0LmZuKChrZXk6IHN0cmluZykgPT4ge1xuXHRcdHJldHVybiB0aGlzLm9WYWx1ZXNba2V5XTtcblx0fSk7XG5cdHB1YmxpYyBnZXRPYmplY3QgPSBqZXN0LmZuKChrZXk6IHN0cmluZykgPT4ge1xuXHRcdHJldHVybiB0aGlzLm9WYWx1ZXNba2V5XTtcblx0fSk7XG5cdHB1YmxpYyBnZXRQYXRoID0gamVzdC5mbigoKSA9PiB7XG5cdFx0cmV0dXJuIHRoaXMub1ZhbHVlc1tcIiRwYXRoXCJdO1xuXHR9KTtcblxuXHRwdWJsaWMgZ2V0QmluZGluZyA9IGplc3QuZm4oKCkgPT4ge1xuXHRcdHJldHVybiB0aGlzLm9CaW5kaW5nO1xuXHR9KTtcbn1cblxuZXhwb3J0IGNsYXNzIE1vY2tDb250cm9sIHtcblx0cHVibGljIGdldEJpbmRpbmdJbmZvID0gamVzdC5mbigpO1xuXHRwdWJsaWMgZ2V0QmluZGluZyA9IGplc3QuZm4oKTtcbn1cblxuLyoqXG4gKiBNb2NrIGNsYXNzIGZvciBPRGF0YSBWNCBMaXN0QmluZGluZ1xuICovXG5leHBvcnQgY2xhc3MgTW9ja0xpc3RCaW5kaW5nIGltcGxlbWVudHMgUGFydGlhbDxPRGF0YUxpc3RCaW5kaW5nPiB7XG5cdHByaXZhdGUgYU1vY2tDb250ZXh0czogTW9ja0NvbnRleHRbXTtcblxuXHRwdWJsaWMgY29uc3RydWN0b3IoYUNvbnRleHRzPzogYW55W10pIHtcblx0XHRhQ29udGV4dHMgPSBhQ29udGV4dHMgfHwgW107XG5cblx0XHR0aGlzLmFNb2NrQ29udGV4dHMgPSBhQ29udGV4dHMubWFwKGNvbnRleHQgPT4ge1xuXHRcdFx0cmV0dXJuIG5ldyBNb2NrQ29udGV4dChjb250ZXh0LCB0aGlzKTtcblx0XHR9KTtcblx0fVxuXG5cdHB1YmxpYyBpc0Eoc0NsYXNzTmFtZTogc3RyaW5nKTogYm9vbGVhbiB7XG5cdFx0cmV0dXJuIHNDbGFzc05hbWUgPT09IFwic2FwLnVpLm1vZGVsLm9kYXRhLnY0Lk9EYXRhTGlzdEJpbmRpbmdcIjtcblx0fVxuXG5cdC8vIE1vY2tlZCBBUElcblx0cHVibGljIHNldEFnZ3JlZ2F0aW9uID0gamVzdC5mbigpO1xuXHRwdWJsaWMgZmlsdGVyID0gamVzdC5mbigpO1xuXHRwdWJsaWMgc29ydCA9IGplc3QuZm4oKTtcblxuXHQvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgQHR5cGVzY3JpcHQtZXNsaW50L25vLXVudXNlZC12YXJzXG5cdHB1YmxpYyByZXF1ZXN0Q29udGV4dHMgPSBqZXN0LmZuKCguLi5hcmdzKSA9PiB7XG5cdFx0cmV0dXJuIFByb21pc2UucmVzb2x2ZSgodGhpcy5hTW9ja0NvbnRleHRzIGFzIGFueSkgYXMgQ29udGV4dFtdKTtcblx0fSk7XG5cdC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBAdHlwZXNjcmlwdC1lc2xpbnQvbm8tdW51c2VkLXZhcnNcblx0cHVibGljIGdldEN1cnJlbnRDb250ZXh0cyA9IGplc3QuZm4oKC4uLmFyZ3MpID0+IHtcblx0XHRyZXR1cm4gKHRoaXMuYU1vY2tDb250ZXh0cyBhcyBhbnkpIGFzIENvbnRleHRbXTtcblx0fSk7XG59XG5cbmV4cG9ydCBjbGFzcyBNb2NrQ29udGV4dEJpbmRpbmcgaW1wbGVtZW50cyBQYXJ0aWFsPE9EYXRhQ29udGV4dEJpbmRpbmc+IHtcblx0cHJpdmF0ZSBvTW9ja0NvbnRleHQ6IE1vY2tDb250ZXh0O1xuXG5cdHB1YmxpYyBjb25zdHJ1Y3RvcihvQ29udGV4dD86IGFueSkge1xuXHRcdHRoaXMub01vY2tDb250ZXh0ID0gbmV3IE1vY2tDb250ZXh0KG9Db250ZXh0IHx8IHt9LCB0aGlzKTtcblx0fVxuXG5cdHB1YmxpYyBpc0Eoc0NsYXNzTmFtZTogc3RyaW5nKTogYm9vbGVhbiB7XG5cdFx0cmV0dXJuIHNDbGFzc05hbWUgPT09IFwic2FwLnVpLm1vZGVsLm9kYXRhLnY0Lk9EYXRhQ29udGV4dEJpbmRpbmdcIjtcblx0fVxuXHRwdWJsaWMgZ2V0SW50ZXJuYWxNb2NrQ29udGV4dCgpOiBNb2NrQ29udGV4dCB7XG5cdFx0cmV0dXJuIHRoaXMub01vY2tDb250ZXh0O1xuXHR9XG5cblx0Ly8gTW9ja2VkIEFQSVxuXHRwdWJsaWMgZ2V0Qm91bmRDb250ZXh0ID0gamVzdC5mbigoKSA9PiB7XG5cdFx0cmV0dXJuICh0aGlzLm9Nb2NrQ29udGV4dCBhcyBhbnkpIGFzIENvbnRleHQ7XG5cdH0pO1xuXHRwdWJsaWMgYXR0YWNoRXZlbnRPbmNlID0gamVzdC5mbigpO1xufVxuXG4vKipcbiAqIE1vY2sgY2xhc3MgZm9yIE9EYXRhIFY0IE1ldGFNb2RlbFxuICovXG5leHBvcnQgY2xhc3MgTW9ja01ldGFNb2RlbCBpbXBsZW1lbnRzIFBhcnRpYWw8T0RhdGFNZXRhTW9kZWw+IHtcblx0cHJpdmF0ZSBvTWV0YUNvbnRleHQ6IE1vY2tDb250ZXh0O1xuXG5cdHB1YmxpYyBjb25zdHJ1Y3RvcihvTWV0YURhdGE/OiBhbnkpIHtcblx0XHR0aGlzLm9NZXRhQ29udGV4dCA9IG5ldyBNb2NrQ29udGV4dChvTWV0YURhdGEgfHwge30pO1xuXHR9XG5cblx0Ly8gTW9ja2VkIEFQSVxuXHQvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgQHR5cGVzY3JpcHQtZXNsaW50L25vLXVudXNlZC12YXJzXG5cdHB1YmxpYyBnZXRNZXRhQ29udGV4dCA9IGplc3QuZm4oKHNQYXRoOiBzdHJpbmcpID0+IHtcblx0XHRyZXR1cm4gKG5ldyBNb2NrQ29udGV4dCh7ICRwYXRoOiBzUGF0aCB9KSBhcyBhbnkpIGFzIENvbnRleHQ7XG5cdH0pO1xuXHRwdWJsaWMgZ2V0T2JqZWN0ID0gamVzdC5mbigoc1BhdGg6IHN0cmluZykgPT4ge1xuXHRcdHJldHVybiB0aGlzLm9NZXRhQ29udGV4dC5nZXRQcm9wZXJ0eShzUGF0aCk7XG5cdH0pO1xufVxuXG4vKipcbiAqIE1vY2sgY2xhc3MgZm9yIE9EYXRhIFY0IE1vZGVsXG4gKi9cblxuZXhwb3J0IGNsYXNzIE1vY2tNb2RlbCBpbXBsZW1lbnRzIFBhcnRpYWw8T0RhdGFNb2RlbD4ge1xuXHRwcml2YXRlIG9NZXRhTW9kZWw/OiBNb2NrTWV0YU1vZGVsO1xuXG5cdHB1YmxpYyBjb25zdHJ1Y3Rvcihwcml2YXRlIG1vY2tMaXN0QmluZGluZz86IE1vY2tMaXN0QmluZGluZywgcHJpdmF0ZSBtb2NrQ29udGV4dEJpbmRpbmc/OiBNb2NrQ29udGV4dEJpbmRpbmcpIHt9XG5cblx0Ly8gRmFjdG9yaWVzXG5cdHN0YXRpYyBtb2RlbEZyb21MaXN0QmluZGluZyhtb2NrTGlzdEJpbmRpbmc6IE1vY2tMaXN0QmluZGluZyk6IE1vY2tNb2RlbCB7XG5cdFx0cmV0dXJuIG5ldyBNb2NrTW9kZWwobW9ja0xpc3RCaW5kaW5nKTtcblx0fVxuXHRzdGF0aWMgbW9kZWxGcm9tQ29udGV4dEJpbmRpbmcobW9ja0NvbnRleHRCaW5kaW5nOiBNb2NrQ29udGV4dEJpbmRpbmcpOiBNb2NrTW9kZWwge1xuXHRcdHJldHVybiBuZXcgTW9ja01vZGVsKHVuZGVmaW5lZCwgbW9ja0NvbnRleHRCaW5kaW5nKTtcblx0fVxuXG5cdHB1YmxpYyBzZXRNZXRhTW9kZWwob01ldGFNb2RlbDogTW9ja01ldGFNb2RlbCkge1xuXHRcdHRoaXMub01ldGFNb2RlbCA9IG9NZXRhTW9kZWw7XG5cdH1cblxuXHQvLyBNb2NrZWQgQVBJXG5cdC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBAdHlwZXNjcmlwdC1lc2xpbnQvbm8tdW51c2VkLXZhcnNcblx0cHVibGljIGJpbmRMaXN0ID0gamVzdC5mbigoLi4uYXJncykgPT4ge1xuXHRcdHJldHVybiAodGhpcy5tb2NrTGlzdEJpbmRpbmcgYXMgYW55KSBhcyBPRGF0YUxpc3RCaW5kaW5nO1xuXHR9KTtcblx0Ly8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIEB0eXBlc2NyaXB0LWVzbGludC9uby11bnVzZWQtdmFyc1xuXHRwdWJsaWMgYmluZENvbnRleHQgPSBqZXN0LmZuKCguLi5hcmdzKSA9PiB7XG5cdFx0cmV0dXJuICh0aGlzLm1vY2tDb250ZXh0QmluZGluZyBhcyBhbnkpIGFzIE9EYXRhQ29udGV4dEJpbmRpbmc7XG5cdH0pO1xuXHRwdWJsaWMgZ2V0TWV0YU1vZGVsID0gamVzdC5mbigoKSA9PiB7XG5cdFx0cmV0dXJuICh0aGlzLm9NZXRhTW9kZWwgYXMgYW55KSBhcyBPRGF0YU1ldGFNb2RlbDtcblx0fSk7XG59XG4iXX0=