/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)
 *      (c) Copyright 2009-2021 SAP SE. All rights reserved
 */
sap.ui.define(["sap/ui/core/service/ServiceFactory", "sap/ui/core/service/Service"], function (ServiceFactory, Service) {
  "use strict";

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

  var AsyncComponentService = /*#__PURE__*/function (_Service) {
    _inherits(AsyncComponentService, _Service);

    var _super = _createSuper(AsyncComponentService);

    function AsyncComponentService() {
      _classCallCheck(this, AsyncComponentService);

      return _super.apply(this, arguments);
    }

    _createClass(AsyncComponentService, [{
      key: "init",
      value: // !: means that we know it will be assigned before usage
      function init() {
        var _this = this;

        this.initPromise = new Promise(function (resolve, reject) {
          _this.resolveFn = resolve;
          _this.rejectFn = reject;
        });
        var oContext = this.getContext();
        var oComponent = oContext.scopeObject;

        var oServices = oComponent._getManifestEntry("/sap.ui5/services", true);

        Promise.all(Object.keys(oServices).filter(function (sServiceKey) {
          return oServices[sServiceKey].startup === "waitFor" && oServices[sServiceKey].factoryName !== "sap.fe.core.services.AsyncComponentService";
        }).map(function (sServiceKey) {
          return oComponent.getService(sServiceKey).then(function (oServiceInstance) {
            var sMethodName = "get".concat(sServiceKey[0].toUpperCase()).concat(sServiceKey.substr(1));

            if (!oComponent.hasOwnProperty(sMethodName)) {
              oComponent[sMethodName] = function () {
                return oServiceInstance;
              };
            }
          });
        })).then(function () {
          return oComponent.pRootControlLoaded || Promise.resolve();
        }).then(function () {
          // notifiy the component
          if (oComponent.onServicesStarted) {
            oComponent.onServicesStarted();
          }

          _this.resolveFn(_this);
        }).catch(this.rejectFn);
      }
    }]);

    return AsyncComponentService;
  }(Service);

  var AsyncComponentServiceFactory = /*#__PURE__*/function (_ServiceFactory) {
    _inherits(AsyncComponentServiceFactory, _ServiceFactory);

    var _super2 = _createSuper(AsyncComponentServiceFactory);

    function AsyncComponentServiceFactory() {
      _classCallCheck(this, AsyncComponentServiceFactory);

      return _super2.apply(this, arguments);
    }

    _createClass(AsyncComponentServiceFactory, [{
      key: "createInstance",
      value: function createInstance(oServiceContext) {
        var asyncComponentService = new AsyncComponentService(oServiceContext);
        return asyncComponentService.initPromise;
      }
    }]);

    return AsyncComponentServiceFactory;
  }(ServiceFactory);

  return AsyncComponentServiceFactory;
}, false);
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIkFzeW5jQ29tcG9uZW50U2VydmljZUZhY3RvcnkudHMiXSwibmFtZXMiOlsiQXN5bmNDb21wb25lbnRTZXJ2aWNlIiwiaW5pdFByb21pc2UiLCJQcm9taXNlIiwicmVzb2x2ZSIsInJlamVjdCIsInJlc29sdmVGbiIsInJlamVjdEZuIiwib0NvbnRleHQiLCJnZXRDb250ZXh0Iiwib0NvbXBvbmVudCIsInNjb3BlT2JqZWN0Iiwib1NlcnZpY2VzIiwiX2dldE1hbmlmZXN0RW50cnkiLCJhbGwiLCJPYmplY3QiLCJrZXlzIiwiZmlsdGVyIiwic1NlcnZpY2VLZXkiLCJzdGFydHVwIiwiZmFjdG9yeU5hbWUiLCJtYXAiLCJnZXRTZXJ2aWNlIiwidGhlbiIsIm9TZXJ2aWNlSW5zdGFuY2UiLCJzTWV0aG9kTmFtZSIsInRvVXBwZXJDYXNlIiwic3Vic3RyIiwiaGFzT3duUHJvcGVydHkiLCJwUm9vdENvbnRyb2xMb2FkZWQiLCJvblNlcnZpY2VzU3RhcnRlZCIsImNhdGNoIiwiU2VydmljZSIsIkFzeW5jQ29tcG9uZW50U2VydmljZUZhY3RvcnkiLCJvU2VydmljZUNvbnRleHQiLCJhc3luY0NvbXBvbmVudFNlcnZpY2UiLCJTZXJ2aWNlRmFjdG9yeSJdLCJtYXBwaW5ncyI6IjtBQUFBO0FBQ0E7QUFDQTs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O01BRU1BLHFCOzs7Ozs7Ozs7Ozs7O2FBSUw7QUFFQSxzQkFBTztBQUFBOztBQUNOLGFBQUtDLFdBQUwsR0FBbUIsSUFBSUMsT0FBSixDQUFZLFVBQUNDLE9BQUQsRUFBVUMsTUFBVixFQUFxQjtBQUNuRCxVQUFBLEtBQUksQ0FBQ0MsU0FBTCxHQUFpQkYsT0FBakI7QUFDQSxVQUFBLEtBQUksQ0FBQ0csUUFBTCxHQUFnQkYsTUFBaEI7QUFDQSxTQUhrQixDQUFuQjtBQUlBLFlBQU1HLFFBQVEsR0FBRyxLQUFLQyxVQUFMLEVBQWpCO0FBQ0EsWUFBTUMsVUFBVSxHQUFHRixRQUFRLENBQUNHLFdBQTVCOztBQUNBLFlBQU1DLFNBQVMsR0FBR0YsVUFBVSxDQUFDRyxpQkFBWCxDQUE2QixtQkFBN0IsRUFBa0QsSUFBbEQsQ0FBbEI7O0FBQ0FWLFFBQUFBLE9BQU8sQ0FBQ1csR0FBUixDQUNDQyxNQUFNLENBQUNDLElBQVAsQ0FBWUosU0FBWixFQUNFSyxNQURGLENBRUUsVUFBQUMsV0FBVztBQUFBLGlCQUNWTixTQUFTLENBQUNNLFdBQUQsQ0FBVCxDQUF1QkMsT0FBdkIsS0FBbUMsU0FBbkMsSUFDQVAsU0FBUyxDQUFDTSxXQUFELENBQVQsQ0FBdUJFLFdBQXZCLEtBQXVDLDRDQUY3QjtBQUFBLFNBRmIsRUFNRUMsR0FORixDQU1NLFVBQUFILFdBQVcsRUFBSTtBQUNuQixpQkFBT1IsVUFBVSxDQUFDWSxVQUFYLENBQXNCSixXQUF0QixFQUFtQ0ssSUFBbkMsQ0FBd0MsVUFBQ0MsZ0JBQUQsRUFBb0M7QUFDbEYsZ0JBQU1DLFdBQVcsZ0JBQVNQLFdBQVcsQ0FBQyxDQUFELENBQVgsQ0FBZVEsV0FBZixFQUFULFNBQXdDUixXQUFXLENBQUNTLE1BQVosQ0FBbUIsQ0FBbkIsQ0FBeEMsQ0FBakI7O0FBQ0EsZ0JBQUksQ0FBQ2pCLFVBQVUsQ0FBQ2tCLGNBQVgsQ0FBMEJILFdBQTFCLENBQUwsRUFBNkM7QUFDNUNmLGNBQUFBLFVBQVUsQ0FBQ2UsV0FBRCxDQUFWLEdBQTBCLFlBQVc7QUFDcEMsdUJBQU9ELGdCQUFQO0FBQ0EsZUFGRDtBQUdBO0FBQ0QsV0FQTSxDQUFQO0FBUUEsU0FmRixDQURELEVBa0JFRCxJQWxCRixDQWtCTyxZQUFNO0FBQ1gsaUJBQU9iLFVBQVUsQ0FBQ21CLGtCQUFYLElBQWlDMUIsT0FBTyxDQUFDQyxPQUFSLEVBQXhDO0FBQ0EsU0FwQkYsRUFxQkVtQixJQXJCRixDQXFCTyxZQUFNO0FBQ1g7QUFDQSxjQUFJYixVQUFVLENBQUNvQixpQkFBZixFQUFrQztBQUNqQ3BCLFlBQUFBLFVBQVUsQ0FBQ29CLGlCQUFYO0FBQ0E7O0FBQ0QsVUFBQSxLQUFJLENBQUN4QixTQUFMLENBQWUsS0FBZjtBQUNBLFNBM0JGLEVBNEJFeUIsS0E1QkYsQ0E0QlEsS0FBS3hCLFFBNUJiO0FBNkJBOzs7O0lBM0NrQ3lCLE87O01BOEM5QkMsNEI7Ozs7Ozs7Ozs7Ozs7YUFDTCx3QkFBZUMsZUFBZixFQUF3RTtBQUN2RSxZQUFNQyxxQkFBcUIsR0FBRyxJQUFJbEMscUJBQUosQ0FBMEJpQyxlQUExQixDQUE5QjtBQUNBLGVBQU9DLHFCQUFxQixDQUFDakMsV0FBN0I7QUFDQTs7OztJQUp5Q2tDLGM7O1NBTzVCSCw0QiIsInNvdXJjZVJvb3QiOiIuIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgU2VydmljZUZhY3RvcnksIFNlcnZpY2UsIFNlcnZpY2VDb250ZXh0IH0gZnJvbSBcInNhcC91aS9jb3JlL3NlcnZpY2VcIjtcblxudHlwZSBBc3luY0NvbXBvbmVudFNldHRpbmdzID0ge307XG5cbmNsYXNzIEFzeW5jQ29tcG9uZW50U2VydmljZSBleHRlbmRzIFNlcnZpY2U8QXN5bmNDb21wb25lbnRTZXR0aW5ncz4ge1xuXHRyZXNvbHZlRm46IGFueTtcblx0cmVqZWN0Rm46IGFueTtcblx0aW5pdFByb21pc2UhOiBQcm9taXNlPGFueT47XG5cdC8vICE6IG1lYW5zIHRoYXQgd2Uga25vdyBpdCB3aWxsIGJlIGFzc2lnbmVkIGJlZm9yZSB1c2FnZVxuXG5cdGluaXQoKSB7XG5cdFx0dGhpcy5pbml0UHJvbWlzZSA9IG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcblx0XHRcdHRoaXMucmVzb2x2ZUZuID0gcmVzb2x2ZTtcblx0XHRcdHRoaXMucmVqZWN0Rm4gPSByZWplY3Q7XG5cdFx0fSk7XG5cdFx0Y29uc3Qgb0NvbnRleHQgPSB0aGlzLmdldENvbnRleHQoKTtcblx0XHRjb25zdCBvQ29tcG9uZW50ID0gb0NvbnRleHQuc2NvcGVPYmplY3QgYXMgYW55O1xuXHRcdGNvbnN0IG9TZXJ2aWNlcyA9IG9Db21wb25lbnQuX2dldE1hbmlmZXN0RW50cnkoXCIvc2FwLnVpNS9zZXJ2aWNlc1wiLCB0cnVlKTtcblx0XHRQcm9taXNlLmFsbChcblx0XHRcdE9iamVjdC5rZXlzKG9TZXJ2aWNlcylcblx0XHRcdFx0LmZpbHRlcihcblx0XHRcdFx0XHRzU2VydmljZUtleSA9PlxuXHRcdFx0XHRcdFx0b1NlcnZpY2VzW3NTZXJ2aWNlS2V5XS5zdGFydHVwID09PSBcIndhaXRGb3JcIiAmJlxuXHRcdFx0XHRcdFx0b1NlcnZpY2VzW3NTZXJ2aWNlS2V5XS5mYWN0b3J5TmFtZSAhPT0gXCJzYXAuZmUuY29yZS5zZXJ2aWNlcy5Bc3luY0NvbXBvbmVudFNlcnZpY2VcIlxuXHRcdFx0XHQpXG5cdFx0XHRcdC5tYXAoc1NlcnZpY2VLZXkgPT4ge1xuXHRcdFx0XHRcdHJldHVybiBvQ29tcG9uZW50LmdldFNlcnZpY2Uoc1NlcnZpY2VLZXkpLnRoZW4oKG9TZXJ2aWNlSW5zdGFuY2U6IFNlcnZpY2U8YW55PikgPT4ge1xuXHRcdFx0XHRcdFx0Y29uc3Qgc01ldGhvZE5hbWUgPSBgZ2V0JHtzU2VydmljZUtleVswXS50b1VwcGVyQ2FzZSgpfSR7c1NlcnZpY2VLZXkuc3Vic3RyKDEpfWA7XG5cdFx0XHRcdFx0XHRpZiAoIW9Db21wb25lbnQuaGFzT3duUHJvcGVydHkoc01ldGhvZE5hbWUpKSB7XG5cdFx0XHRcdFx0XHRcdG9Db21wb25lbnRbc01ldGhvZE5hbWVdID0gZnVuY3Rpb24oKSB7XG5cdFx0XHRcdFx0XHRcdFx0cmV0dXJuIG9TZXJ2aWNlSW5zdGFuY2U7XG5cdFx0XHRcdFx0XHRcdH07XG5cdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0fSk7XG5cdFx0XHRcdH0pXG5cdFx0KVxuXHRcdFx0LnRoZW4oKCkgPT4ge1xuXHRcdFx0XHRyZXR1cm4gb0NvbXBvbmVudC5wUm9vdENvbnRyb2xMb2FkZWQgfHwgUHJvbWlzZS5yZXNvbHZlKCk7XG5cdFx0XHR9KVxuXHRcdFx0LnRoZW4oKCkgPT4ge1xuXHRcdFx0XHQvLyBub3RpZml5IHRoZSBjb21wb25lbnRcblx0XHRcdFx0aWYgKG9Db21wb25lbnQub25TZXJ2aWNlc1N0YXJ0ZWQpIHtcblx0XHRcdFx0XHRvQ29tcG9uZW50Lm9uU2VydmljZXNTdGFydGVkKCk7XG5cdFx0XHRcdH1cblx0XHRcdFx0dGhpcy5yZXNvbHZlRm4odGhpcyk7XG5cdFx0XHR9KVxuXHRcdFx0LmNhdGNoKHRoaXMucmVqZWN0Rm4pO1xuXHR9XG59XG5cbmNsYXNzIEFzeW5jQ29tcG9uZW50U2VydmljZUZhY3RvcnkgZXh0ZW5kcyBTZXJ2aWNlRmFjdG9yeTxBc3luY0NvbXBvbmVudFNldHRpbmdzPiB7XG5cdGNyZWF0ZUluc3RhbmNlKG9TZXJ2aWNlQ29udGV4dDogU2VydmljZUNvbnRleHQ8QXN5bmNDb21wb25lbnRTZXR0aW5ncz4pIHtcblx0XHRjb25zdCBhc3luY0NvbXBvbmVudFNlcnZpY2UgPSBuZXcgQXN5bmNDb21wb25lbnRTZXJ2aWNlKG9TZXJ2aWNlQ29udGV4dCk7XG5cdFx0cmV0dXJuIGFzeW5jQ29tcG9uZW50U2VydmljZS5pbml0UHJvbWlzZTtcblx0fVxufVxuXG5leHBvcnQgZGVmYXVsdCBBc3luY0NvbXBvbmVudFNlcnZpY2VGYWN0b3J5O1xuIl19