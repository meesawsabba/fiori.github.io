/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)
 *      (c) Copyright 2009-2021 SAP SE. All rights reserved
 */
sap.ui.define(["sap/ui/core/service/ServiceFactory", "sap/ui/core/service/Service", "../converters/MetaModelConverter", "sap/ui/VersionInfo"], function (ServiceFactory, Service, MetaModelConverter, VersionInfo) {
  "use strict";

  var DefaultEnvironmentCapabilities = MetaModelConverter.DefaultEnvironmentCapabilities;

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

  var EnvironmentCapabilitiesService = /*#__PURE__*/function (_Service) {
    _inherits(EnvironmentCapabilitiesService, _Service);

    var _super = _createSuper(EnvironmentCapabilitiesService);

    function EnvironmentCapabilitiesService() {
      _classCallCheck(this, EnvironmentCapabilitiesService);

      return _super.apply(this, arguments);
    }

    _createClass(EnvironmentCapabilitiesService, [{
      key: "init",
      value: // !: means that we know it will be assigned before usage
      function init() {
        var _this = this;

        this.initPromise = new Promise(function (resolve, reject) {
          _this.resolveFn = resolve;
          _this.rejectFn = reject;
        });
        var oContext = this.getContext();
        this.environmentCapabilities = Object.assign({}, DefaultEnvironmentCapabilities);
        VersionInfo.load(undefined).then(function (versionInfo) {
          _this.environmentCapabilities.Chart = !!versionInfo.libraries.find(function (lib) {
            return lib.name === "sap.viz";
          });
          _this.environmentCapabilities.MicroChart = !!versionInfo.libraries.find(function (lib) {
            return lib.name === "sap.suite.ui.microchart";
          });
          _this.environmentCapabilities.UShell = !!(sap && sap.ushell && sap.ushell.Container);
          _this.environmentCapabilities.IntentBasedNavigation = !!(sap && sap.ushell && sap.ushell.Container);
          _this.environmentCapabilities = Object.assign(_this.environmentCapabilities, oContext.settings);

          _this.resolveFn(_this);
        }).catch(this.rejectFn);
      }
    }, {
      key: "resolveLibrary",
      value: function resolveLibrary(libraryName) {
        return new Promise(function (resolve) {
          try {
            sap.ui.getCore().loadLibrary("".concat(libraryName.replace(/\./g, "/")), {
              async: true
            }).then(function () {
              resolve(true);
            }).catch(function () {
              resolve(false);
            });
          } catch (e) {
            resolve(false);
          }
        });
      }
    }, {
      key: "setCapabilities",
      value: function setCapabilities(oCapabilities) {
        this.environmentCapabilities = oCapabilities;
      }
    }, {
      key: "getCapabilities",
      value: function getCapabilities() {
        return this.environmentCapabilities;
      }
    }, {
      key: "getInterface",
      value: function getInterface() {
        return this;
      }
    }]);

    return EnvironmentCapabilitiesService;
  }(Service);

  var EnvironmentServiceFactory = /*#__PURE__*/function (_ServiceFactory) {
    _inherits(EnvironmentServiceFactory, _ServiceFactory);

    var _super2 = _createSuper(EnvironmentServiceFactory);

    function EnvironmentServiceFactory() {
      _classCallCheck(this, EnvironmentServiceFactory);

      return _super2.apply(this, arguments);
    }

    _createClass(EnvironmentServiceFactory, [{
      key: "createInstance",
      value: function createInstance(oServiceContext) {
        var environmentCapabilitiesService = new EnvironmentCapabilitiesService(oServiceContext);
        return environmentCapabilitiesService.initPromise;
      }
    }]);

    return EnvironmentServiceFactory;
  }(ServiceFactory);

  return EnvironmentServiceFactory;
}, false);
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIkVudmlyb25tZW50U2VydmljZUZhY3RvcnkudHMiXSwibmFtZXMiOlsiRW52aXJvbm1lbnRDYXBhYmlsaXRpZXNTZXJ2aWNlIiwiaW5pdFByb21pc2UiLCJQcm9taXNlIiwicmVzb2x2ZSIsInJlamVjdCIsInJlc29sdmVGbiIsInJlamVjdEZuIiwib0NvbnRleHQiLCJnZXRDb250ZXh0IiwiZW52aXJvbm1lbnRDYXBhYmlsaXRpZXMiLCJPYmplY3QiLCJhc3NpZ24iLCJEZWZhdWx0RW52aXJvbm1lbnRDYXBhYmlsaXRpZXMiLCJWZXJzaW9uSW5mbyIsImxvYWQiLCJ1bmRlZmluZWQiLCJ0aGVuIiwidmVyc2lvbkluZm8iLCJDaGFydCIsImxpYnJhcmllcyIsImZpbmQiLCJsaWIiLCJuYW1lIiwiTWljcm9DaGFydCIsIlVTaGVsbCIsInNhcCIsInVzaGVsbCIsIkNvbnRhaW5lciIsIkludGVudEJhc2VkTmF2aWdhdGlvbiIsInNldHRpbmdzIiwiY2F0Y2giLCJsaWJyYXJ5TmFtZSIsInVpIiwiZ2V0Q29yZSIsImxvYWRMaWJyYXJ5IiwicmVwbGFjZSIsImFzeW5jIiwiZSIsIm9DYXBhYmlsaXRpZXMiLCJTZXJ2aWNlIiwiRW52aXJvbm1lbnRTZXJ2aWNlRmFjdG9yeSIsIm9TZXJ2aWNlQ29udGV4dCIsImVudmlyb25tZW50Q2FwYWJpbGl0aWVzU2VydmljZSIsIlNlcnZpY2VGYWN0b3J5Il0sIm1hcHBpbmdzIjoiO0FBQUE7QUFDQTtBQUNBOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztNQUVNQSw4Qjs7Ozs7Ozs7Ozs7OzthQUtMO0FBRUEsc0JBQU87QUFBQTs7QUFDTixhQUFLQyxXQUFMLEdBQW1CLElBQUlDLE9BQUosQ0FBWSxVQUFDQyxPQUFELEVBQVVDLE1BQVYsRUFBcUI7QUFDbkQsVUFBQSxLQUFJLENBQUNDLFNBQUwsR0FBaUJGLE9BQWpCO0FBQ0EsVUFBQSxLQUFJLENBQUNHLFFBQUwsR0FBZ0JGLE1BQWhCO0FBQ0EsU0FIa0IsQ0FBbkI7QUFJQSxZQUFNRyxRQUFRLEdBQUcsS0FBS0MsVUFBTCxFQUFqQjtBQUNBLGFBQUtDLHVCQUFMLEdBQStCQyxNQUFNLENBQUNDLE1BQVAsQ0FBYyxFQUFkLEVBQWtCQyw4QkFBbEIsQ0FBL0I7QUFDQUMsUUFBQUEsV0FBVyxDQUFDQyxJQUFaLENBQWlCQyxTQUFqQixFQUNFQyxJQURGLENBQ08sVUFBQUMsV0FBVyxFQUFJO0FBQ3BCLFVBQUEsS0FBSSxDQUFDUix1QkFBTCxDQUE2QlMsS0FBN0IsR0FBcUMsQ0FBQyxDQUFDRCxXQUFXLENBQUNFLFNBQVosQ0FBc0JDLElBQXRCLENBQTJCLFVBQUNDLEdBQUQ7QUFBQSxtQkFBY0EsR0FBRyxDQUFDQyxJQUFKLEtBQWEsU0FBM0I7QUFBQSxXQUEzQixDQUF2QztBQUNBLFVBQUEsS0FBSSxDQUFDYix1QkFBTCxDQUE2QmMsVUFBN0IsR0FBMEMsQ0FBQyxDQUFDTixXQUFXLENBQUNFLFNBQVosQ0FBc0JDLElBQXRCLENBQzNDLFVBQUNDLEdBQUQ7QUFBQSxtQkFBY0EsR0FBRyxDQUFDQyxJQUFKLEtBQWEseUJBQTNCO0FBQUEsV0FEMkMsQ0FBNUM7QUFHQSxVQUFBLEtBQUksQ0FBQ2IsdUJBQUwsQ0FBNkJlLE1BQTdCLEdBQXNDLENBQUMsRUFBRUMsR0FBRyxJQUFJQSxHQUFHLENBQUNDLE1BQVgsSUFBcUJELEdBQUcsQ0FBQ0MsTUFBSixDQUFXQyxTQUFsQyxDQUF2QztBQUNBLFVBQUEsS0FBSSxDQUFDbEIsdUJBQUwsQ0FBNkJtQixxQkFBN0IsR0FBcUQsQ0FBQyxFQUFFSCxHQUFHLElBQUlBLEdBQUcsQ0FBQ0MsTUFBWCxJQUFxQkQsR0FBRyxDQUFDQyxNQUFKLENBQVdDLFNBQWxDLENBQXREO0FBQ0EsVUFBQSxLQUFJLENBQUNsQix1QkFBTCxHQUErQkMsTUFBTSxDQUFDQyxNQUFQLENBQWMsS0FBSSxDQUFDRix1QkFBbkIsRUFBNENGLFFBQVEsQ0FBQ3NCLFFBQXJELENBQS9COztBQUNBLFVBQUEsS0FBSSxDQUFDeEIsU0FBTCxDQUFlLEtBQWY7QUFDQSxTQVZGLEVBV0V5QixLQVhGLENBV1EsS0FBS3hCLFFBWGI7QUFZQTs7O2FBRUQsd0JBQWV5QixXQUFmLEVBQXNEO0FBQ3JELGVBQU8sSUFBSTdCLE9BQUosQ0FBWSxVQUFTQyxPQUFULEVBQWtCO0FBQ3BDLGNBQUk7QUFDSHNCLFlBQUFBLEdBQUcsQ0FBQ08sRUFBSixDQUNFQyxPQURGLEdBRUVDLFdBRkYsV0FFaUJILFdBQVcsQ0FBQ0ksT0FBWixDQUFvQixLQUFwQixFQUEyQixHQUEzQixDQUZqQixHQUVvRDtBQUFFQyxjQUFBQSxLQUFLLEVBQUU7QUFBVCxhQUZwRCxFQUdFcEIsSUFIRixDQUdPLFlBQVc7QUFDaEJiLGNBQUFBLE9BQU8sQ0FBQyxJQUFELENBQVA7QUFDQSxhQUxGLEVBTUUyQixLQU5GLENBTVEsWUFBVztBQUNqQjNCLGNBQUFBLE9BQU8sQ0FBQyxLQUFELENBQVA7QUFDQSxhQVJGO0FBU0EsV0FWRCxDQVVFLE9BQU9rQyxDQUFQLEVBQVU7QUFDWGxDLFlBQUFBLE9BQU8sQ0FBQyxLQUFELENBQVA7QUFDQTtBQUNELFNBZE0sQ0FBUDtBQWVBOzs7YUFFRCx5QkFBdUJtQyxhQUF2QixFQUErRDtBQUM5RCxhQUFLN0IsdUJBQUwsR0FBK0I2QixhQUEvQjtBQUNBOzs7YUFFRCwyQkFBeUI7QUFDeEIsZUFBTyxLQUFLN0IsdUJBQVo7QUFDQTs7O2FBRUQsd0JBQW9CO0FBQ25CLGVBQU8sSUFBUDtBQUNBOzs7O0lBeEQyQzhCLE87O01BMkR2Q0MseUI7Ozs7Ozs7Ozs7Ozs7YUFDTCx3QkFBZUMsZUFBZixFQUF5RTtBQUN4RSxZQUFNQyw4QkFBOEIsR0FBRyxJQUFJMUMsOEJBQUosQ0FBbUN5QyxlQUFuQyxDQUF2QztBQUNBLGVBQU9DLDhCQUE4QixDQUFDekMsV0FBdEM7QUFDQTs7OztJQUpzQzBDLGM7O1NBT3pCSCx5QiIsInNvdXJjZVJvb3QiOiIuIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgU2VydmljZUZhY3RvcnksIFNlcnZpY2UsIFNlcnZpY2VDb250ZXh0IH0gZnJvbSBcInNhcC91aS9jb3JlL3NlcnZpY2VcIjtcbmltcG9ydCB7IERlZmF1bHRFbnZpcm9ubWVudENhcGFiaWxpdGllcywgRW52aXJvbm1lbnRDYXBhYmlsaXRpZXMgfSBmcm9tIFwiLi4vY29udmVydGVycy9NZXRhTW9kZWxDb252ZXJ0ZXJcIjtcbmltcG9ydCB7IFZlcnNpb25JbmZvIH0gZnJvbSBcInNhcC91aVwiO1xuXG5jbGFzcyBFbnZpcm9ubWVudENhcGFiaWxpdGllc1NlcnZpY2UgZXh0ZW5kcyBTZXJ2aWNlPEVudmlyb25tZW50Q2FwYWJpbGl0aWVzPiB7XG5cdHJlc29sdmVGbjogYW55O1xuXHRyZWplY3RGbjogYW55O1xuXHRpbml0UHJvbWlzZSE6IFByb21pc2U8YW55Pjtcblx0ZW52aXJvbm1lbnRDYXBhYmlsaXRpZXMhOiBFbnZpcm9ubWVudENhcGFiaWxpdGllcztcblx0Ly8gITogbWVhbnMgdGhhdCB3ZSBrbm93IGl0IHdpbGwgYmUgYXNzaWduZWQgYmVmb3JlIHVzYWdlXG5cblx0aW5pdCgpIHtcblx0XHR0aGlzLmluaXRQcm9taXNlID0gbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xuXHRcdFx0dGhpcy5yZXNvbHZlRm4gPSByZXNvbHZlO1xuXHRcdFx0dGhpcy5yZWplY3RGbiA9IHJlamVjdDtcblx0XHR9KTtcblx0XHRjb25zdCBvQ29udGV4dCA9IHRoaXMuZ2V0Q29udGV4dCgpO1xuXHRcdHRoaXMuZW52aXJvbm1lbnRDYXBhYmlsaXRpZXMgPSBPYmplY3QuYXNzaWduKHt9LCBEZWZhdWx0RW52aXJvbm1lbnRDYXBhYmlsaXRpZXMpO1xuXHRcdFZlcnNpb25JbmZvLmxvYWQodW5kZWZpbmVkIGFzIGFueSlcblx0XHRcdC50aGVuKHZlcnNpb25JbmZvID0+IHtcblx0XHRcdFx0dGhpcy5lbnZpcm9ubWVudENhcGFiaWxpdGllcy5DaGFydCA9ICEhdmVyc2lvbkluZm8ubGlicmFyaWVzLmZpbmQoKGxpYjogYW55KSA9PiBsaWIubmFtZSA9PT0gXCJzYXAudml6XCIpO1xuXHRcdFx0XHR0aGlzLmVudmlyb25tZW50Q2FwYWJpbGl0aWVzLk1pY3JvQ2hhcnQgPSAhIXZlcnNpb25JbmZvLmxpYnJhcmllcy5maW5kKFxuXHRcdFx0XHRcdChsaWI6IGFueSkgPT4gbGliLm5hbWUgPT09IFwic2FwLnN1aXRlLnVpLm1pY3JvY2hhcnRcIlxuXHRcdFx0XHQpO1xuXHRcdFx0XHR0aGlzLmVudmlyb25tZW50Q2FwYWJpbGl0aWVzLlVTaGVsbCA9ICEhKHNhcCAmJiBzYXAudXNoZWxsICYmIHNhcC51c2hlbGwuQ29udGFpbmVyKTtcblx0XHRcdFx0dGhpcy5lbnZpcm9ubWVudENhcGFiaWxpdGllcy5JbnRlbnRCYXNlZE5hdmlnYXRpb24gPSAhIShzYXAgJiYgc2FwLnVzaGVsbCAmJiBzYXAudXNoZWxsLkNvbnRhaW5lcik7XG5cdFx0XHRcdHRoaXMuZW52aXJvbm1lbnRDYXBhYmlsaXRpZXMgPSBPYmplY3QuYXNzaWduKHRoaXMuZW52aXJvbm1lbnRDYXBhYmlsaXRpZXMsIG9Db250ZXh0LnNldHRpbmdzKTtcblx0XHRcdFx0dGhpcy5yZXNvbHZlRm4odGhpcyk7XG5cdFx0XHR9KVxuXHRcdFx0LmNhdGNoKHRoaXMucmVqZWN0Rm4pO1xuXHR9XG5cblx0cmVzb2x2ZUxpYnJhcnkobGlicmFyeU5hbWU6IHN0cmluZyk6IFByb21pc2U8Ym9vbGVhbj4ge1xuXHRcdHJldHVybiBuZXcgUHJvbWlzZShmdW5jdGlvbihyZXNvbHZlKSB7XG5cdFx0XHR0cnkge1xuXHRcdFx0XHRzYXAudWlcblx0XHRcdFx0XHQuZ2V0Q29yZSgpXG5cdFx0XHRcdFx0LmxvYWRMaWJyYXJ5KGAke2xpYnJhcnlOYW1lLnJlcGxhY2UoL1xcLi9nLCBcIi9cIil9YCwgeyBhc3luYzogdHJ1ZSB9KVxuXHRcdFx0XHRcdC50aGVuKGZ1bmN0aW9uKCkge1xuXHRcdFx0XHRcdFx0cmVzb2x2ZSh0cnVlKTtcblx0XHRcdFx0XHR9KVxuXHRcdFx0XHRcdC5jYXRjaChmdW5jdGlvbigpIHtcblx0XHRcdFx0XHRcdHJlc29sdmUoZmFsc2UpO1xuXHRcdFx0XHRcdH0pO1xuXHRcdFx0fSBjYXRjaCAoZSkge1xuXHRcdFx0XHRyZXNvbHZlKGZhbHNlKTtcblx0XHRcdH1cblx0XHR9KTtcblx0fVxuXG5cdHB1YmxpYyBzZXRDYXBhYmlsaXRpZXMob0NhcGFiaWxpdGllczogRW52aXJvbm1lbnRDYXBhYmlsaXRpZXMpIHtcblx0XHR0aGlzLmVudmlyb25tZW50Q2FwYWJpbGl0aWVzID0gb0NhcGFiaWxpdGllcztcblx0fVxuXG5cdHB1YmxpYyBnZXRDYXBhYmlsaXRpZXMoKSB7XG5cdFx0cmV0dXJuIHRoaXMuZW52aXJvbm1lbnRDYXBhYmlsaXRpZXM7XG5cdH1cblxuXHRnZXRJbnRlcmZhY2UoKTogYW55IHtcblx0XHRyZXR1cm4gdGhpcztcblx0fVxufVxuXG5jbGFzcyBFbnZpcm9ubWVudFNlcnZpY2VGYWN0b3J5IGV4dGVuZHMgU2VydmljZUZhY3Rvcnk8RW52aXJvbm1lbnRDYXBhYmlsaXRpZXM+IHtcblx0Y3JlYXRlSW5zdGFuY2Uob1NlcnZpY2VDb250ZXh0OiBTZXJ2aWNlQ29udGV4dDxFbnZpcm9ubWVudENhcGFiaWxpdGllcz4pIHtcblx0XHRjb25zdCBlbnZpcm9ubWVudENhcGFiaWxpdGllc1NlcnZpY2UgPSBuZXcgRW52aXJvbm1lbnRDYXBhYmlsaXRpZXNTZXJ2aWNlKG9TZXJ2aWNlQ29udGV4dCk7XG5cdFx0cmV0dXJuIGVudmlyb25tZW50Q2FwYWJpbGl0aWVzU2VydmljZS5pbml0UHJvbWlzZTtcblx0fVxufVxuXG5leHBvcnQgZGVmYXVsdCBFbnZpcm9ubWVudFNlcnZpY2VGYWN0b3J5O1xuIl19