/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)
 *      (c) Copyright 2009-2021 SAP SE. All rights reserved
 */
sap.ui.define(["sap/ui/core/service/ServiceFactory", "sap/ui/core/service/Service"], function (ServiceFactory, Service) {
  "use strict";

  function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest(); }

  function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

  function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

  function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

  function _iterableToArrayLimit(arr, i) { var _i = arr == null ? null : typeof Symbol !== "undefined" && arr[Symbol.iterator] || arr["@@iterator"]; if (_i == null) return; var _arr = []; var _n = true; var _d = false; var _s, _e; try { for (_i = _i.call(arr); !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

  function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

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

  /**
   * Mock implementation of the ShellService for OpenFE
   *
   * @implements {IShellServices}
   * @private
   */
  var ShellServiceMock = /*#__PURE__*/function (_Service) {
    _inherits(ShellServiceMock, _Service);

    var _super = _createSuper(ShellServiceMock);

    function ShellServiceMock() {
      _classCallCheck(this, ShellServiceMock);

      return _super.apply(this, arguments);
    }

    _createClass(ShellServiceMock, [{
      key: "init",
      value: function init() {
        this.initPromise = Promise.resolve(this);
        this.instanceType = "mock";
      }
    }, {
      key: "getLinks",
      value: function getLinks(oArgs) {
        return Promise.resolve([]);
      }
    }, {
      key: "getLinksWithCache",
      value: function getLinksWithCache(oArgs) {
        return Promise.resolve([]);
      }
    }, {
      key: "toExternal",
      value: function toExternal(oNavArgumentsArr, oComponent) {
        return;
      }
    }, {
      key: "getStartupAppState",
      value: function getStartupAppState(oArgs) {
        return Promise.resolve(null);
      }
    }, {
      key: "backToPreviousApp",
      value: function backToPreviousApp() {
        return;
      }
    }, {
      key: "hrefForExternal",
      value: function hrefForExternal(oArgs, oComponent, bAsync) {
        return "";
      }
    }, {
      key: "getAppState",
      value: function getAppState(oComponent, sAppStateKey) {
        return Promise.resolve({});
      }
    }, {
      key: "createEmptyAppState",
      value: function createEmptyAppState(oComponent) {
        return Promise.resolve({});
      }
    }, {
      key: "isNavigationSupported",
      value: function isNavigationSupported(oNavArgumentsArr, oComponent) {
        return Promise.resolve({});
      }
    }, {
      key: "isInitialNavigation",
      value: function isInitialNavigation() {
        return false;
      }
    }, {
      key: "expandCompactHash",
      value: function expandCompactHash(sHashFragment) {
        return Promise.resolve({});
      }
    }, {
      key: "parseShellHash",
      value: function parseShellHash(sHash) {
        return {};
      }
    }, {
      key: "splitHash",
      value: function splitHash(sHash) {
        return Promise.resolve({});
      }
    }, {
      key: "constructShellHash",
      value: function constructShellHash(oNewShellHash) {
        return "";
      }
    }, {
      key: "setDirtyFlag",
      value: function setDirtyFlag(bDirty) {
        return;
      }
    }, {
      key: "registerDirtyStateProvider",
      value: function registerDirtyStateProvider(fnDirtyStateProvider) {
        return;
      }
    }, {
      key: "deregisterDirtyStateProvider",
      value: function deregisterDirtyStateProvider(fnDirtyStateProvider) {
        return;
      }
    }, {
      key: "createRenderer",
      value: function createRenderer() {
        return {};
      }
    }, {
      key: "getUser",
      value: function getUser() {
        return {};
      }
    }, {
      key: "hasUShell",
      value: function hasUShell() {
        return false;
      }
    }, {
      key: "registerNavigationFilter",
      value: function registerNavigationFilter(fnNavFilter) {
        return;
      }
    }, {
      key: "unregisterNavigationFilter",
      value: function unregisterNavigationFilter(fnNavFilter) {
        return;
      }
    }, {
      key: "setBackNavigation",
      value: function setBackNavigation(fnCallBack) {
        return;
      }
    }, {
      key: "setHierarchy",
      value: function setHierarchy(aHierarchyLevels) {
        return;
      }
    }, {
      key: "setTitle",
      value: function setTitle(sTitle) {
        return;
      }
    }, {
      key: "getContentDensity",
      value: function getContentDensity() {
        // in case there is no shell we probably need to look at the classes being defined on the body
        if (document.body.classList.contains("sapUiSizeCozy")) {
          return "cozy";
        } else if (document.body.classList.contains("sapUiSizeCompact")) {
          return "compact";
        } else {
          return "";
        }
      }
    }]);

    return ShellServiceMock;
  }(Service);
  /**
   * @typedef ShellServicesSettings
   * @private
   */


  /**
   * Wrap a JQuery Promise within a native {Promise}.
   *
   * @template {object} T
   * @param {jQuery.Promise<T>} jqueryPromise The original jquery promise
   * @returns {Promise<T>} A native promise wrapping the same object
   * @private
   */
  function wrapJQueryPromise(jqueryPromise) {
    return new Promise(function (resolve, reject) {
      // eslint-disable-next-line promise/catch-or-return
      jqueryPromise.done(resolve).fail(reject);
    });
  }
  /**
   * Base implementation of the ShellServices
   *
   * @implements {IShellServices}
   * @private
   */


  var ShellServices = /*#__PURE__*/function (_Service2) {
    _inherits(ShellServices, _Service2);

    var _super2 = _createSuper(ShellServices);

    function ShellServices() {
      _classCallCheck(this, ShellServices);

      return _super2.apply(this, arguments);
    }

    _createClass(ShellServices, [{
      key: "init",
      value: // !: means that we know it will be assigned before usage
      function init() {
        var _this = this;

        var oContext = this.getContext();
        var oComponent = oContext.scopeObject;
        this.oShellContainer = oContext.settings.shellContainer;
        this.instanceType = "real";
        this.linksCache = {};

        this.fnFindSemanticObjectsInCache = function (oArgs) {
          var _oArgs = oArgs;
          var aCachedSemanticObjects = [];
          var aNonCachedSemanticObjects = [];

          for (var i = 0; i < _oArgs.length; i++) {
            if (!!_oArgs[i][0] && !!_oArgs[i][0].semanticObject) {
              if (this.linksCache[_oArgs[i][0].semanticObject]) {
                aCachedSemanticObjects.push(this.linksCache[_oArgs[i][0].semanticObject].links);
                Object.defineProperty(oArgs[i][0], "links", {
                  value: this.linksCache[_oArgs[i][0].semanticObject].links
                });
              } else {
                aNonCachedSemanticObjects.push(_oArgs[i]);
              }
            }
          }

          return {
            oldArgs: oArgs,
            newArgs: aNonCachedSemanticObjects,
            cachedLinks: aCachedSemanticObjects
          };
        };

        this.initPromise = new Promise(function (resolve, reject) {
          _this.resolveFn = resolve;
          _this.rejectFn = reject;
        });
        var oCrossAppNavServicePromise = this.oShellContainer.getServiceAsync("CrossApplicationNavigation");
        var oUrlParsingServicePromise = this.oShellContainer.getServiceAsync("URLParsing");
        var oShellNavigationServicePromise = this.oShellContainer.getServiceAsync("ShellNavigation");
        var oShellUIServicePromise = oComponent.getService("ShellUIService");
        Promise.all([oCrossAppNavServicePromise, oUrlParsingServicePromise, oShellNavigationServicePromise, oShellUIServicePromise]).then(function (_ref) {
          var _ref2 = _slicedToArray(_ref, 4),
              oCrossAppNavService = _ref2[0],
              oUrlParsingService = _ref2[1],
              oShellNavigation = _ref2[2],
              oShellUIService = _ref2[3];

          _this.crossAppNavService = oCrossAppNavService;
          _this.urlParsingService = oUrlParsingService;
          _this.shellNavigation = oShellNavigation;
          _this.shellUIService = oShellUIService;

          _this.resolveFn();
        }).catch(this.rejectFn);
      }
      /**
       * Retrieves the target links configured for a given semantic object & action
       * Will retrieve the CrossApplicationNavigation
       * service reference call the getLinks method. In case service is not available or any exception
       * method throws exception error in console.
       *
       * @private
       * @ui5-restricted
       * @param {object} oArgs Check the definition of
       * sap.ushell.services.CrossApplicationNavigation=>getLinks arguments
       * @returns {Promise} Promise which will be resolved to target links array
       */

    }, {
      key: "getLinks",
      value: function getLinks(oArgs) {
        var _this2 = this;

        return new Promise(function (resolve, reject) {
          // eslint-disable-next-line promise/catch-or-return
          _this2.crossAppNavService.getLinks(oArgs).fail(function (oError) {
            reject(new Error(oError + " sap.fe.core.services.NavigationServiceFactory.getLinks"));
          }).then(resolve);
        });
      }
      /**
       * Retrieves the target links configured for a given semantic object & action in cache
       * Will retrieve the CrossApplicationNavigation
       * service reference call the getLinks method. In case service is not available or any exception
       * method throws exception error in console.
       *
       * @private
       * @ui5-restricted
       * @param {object} oArgs Check the definition of
       * sap.ushell.services.CrossApplicationNavigation=>getLinks arguments
       * @returns {Promise} Promise which will be resolved to target links array
       */

    }, {
      key: "getLinksWithCache",
      value: function getLinksWithCache(oArgs) {
        var _this3 = this;

        return new Promise(function (resolve, reject) {
          // eslint-disable-next-line promise/catch-or-return
          if (oArgs.length === 0) {
            resolve([]);
          } else {
            var aLinks;

            var oCacheResults = _this3.fnFindSemanticObjectsInCache(oArgs);

            if (oCacheResults.newArgs.length === 0) {
              resolve(oCacheResults.cachedLinks);
            } else {
              // eslint-disable-next-line promise/catch-or-return
              _this3.crossAppNavService.getLinks(oCacheResults.newArgs).fail(function (oError) {
                reject(new Error(oError + " sap.fe.core.services.NavigationServiceFactory.getLinksWithCache"));
              }).then(function (aLinks) {
                if (aLinks.length !== 0) {
                  var oSemanticObjectsLinks = {};

                  for (var i = 0; i < aLinks.length; i++) {
                    if (aLinks[i].length > 0 && oCacheResults.newArgs[i][0].links === undefined) {
                      oSemanticObjectsLinks[oCacheResults.newArgs[i][0].semanticObject] = {
                        links: aLinks[i]
                      };
                      _this3.linksCache = Object.assign(_this3.linksCache, oSemanticObjectsLinks);
                    }
                  }
                }

                if (oCacheResults.cachedLinks.length === 0) {
                  resolve(aLinks);
                } else {
                  var aMergedLinks = [];
                  var j = 0;

                  for (var k = 0; k < oCacheResults.oldArgs.length; k++) {
                    if (j < aLinks.length) {
                      if (aLinks[j].length > 0 && oCacheResults.oldArgs[k][0].semanticObject === oCacheResults.newArgs[j][0].semanticObject) {
                        aMergedLinks.push(aLinks[j]);
                        j++;
                      } else {
                        aMergedLinks.push(oCacheResults.oldArgs[k][0].links);
                      }
                    } else {
                      aMergedLinks.push(oCacheResults.oldArgs[k][0].links);
                    }
                  }

                  resolve(aMergedLinks);
                }
              });
            }
          }
        });
      }
      /**
       * Will retrieve the ShellContainer.
       *
       * @private
       * @ui5-restricted
       * sap.ushell.container
       * @returns {object} Object with predefined shellContainer methods
       */

    }, {
      key: "getShellContainer",
      value: function getShellContainer() {
        return this.oShellContainer;
      }
      /**
       * Will call toExternal method of CrossApplicationNavigation service with Navigation Arguments and oComponent.
       *
       * @private
       * @ui5-restricted
       * @param {Array} oNavArgumentsArr And
       * @param {object} oComponent Check the definition of
       * sap.ushell.services.CrossApplicationNavigation=>toExternal arguments
       * @returns {void}
       */

    }, {
      key: "toExternal",
      value: function toExternal(oNavArgumentsArr, oComponent) {
        this.crossAppNavService.toExternal(oNavArgumentsArr, oComponent);
      }
      /**
       * Retrieves the target startupAppState
       * Will check the existance of the ShellContainer and retrieve the CrossApplicationNavigation
       * service reference call the getStartupAppState method. In case service is not available or any exception
       * method throws exception error in console.
       *
       * @private
       * @ui5-restricted
       * @param {object} oArgs Check the definition of
       * sap.ushell.services.CrossApplicationNavigation=>getStartupAppState arguments
       * @returns {Promise} Promise which will be resolved to Object
       */

    }, {
      key: "getStartupAppState",
      value: function getStartupAppState(oArgs) {
        var _this4 = this;

        return new Promise(function (resolve, reject) {
          // JQuery Promise behaves differently
          // eslint-disable-next-line promise/catch-or-return
          _this4.crossAppNavService.getStartupAppState(oArgs).fail(function (oError) {
            reject(new Error(oError + " sap.fe.core.services.NavigationServiceFactory.getStartupAppState"));
          }).then(resolve);
        });
      }
      /**
       * Will call backToPreviousApp method of CrossApplicationNavigation service.
       *
       * @returns {void}
       * @private
       * @ui5-restricted
       */

    }, {
      key: "backToPreviousApp",
      value: function backToPreviousApp() {
        return this.crossAppNavService.backToPreviousApp();
      }
      /**
       * Will call hrefForExternal method of CrossApplicationNavigation service.
       *
       * @private
       * @ui5-restricted
       * @param {object} oArgs Check the definition of
       * @param {object} oComponent The appComponent
       * @param {boolean} bAsync Whether this call should be async or not
       * sap.ushell.services.CrossApplicationNavigation=>hrefForExternal arguments
       * @returns {string} Promise which will be resolved to string
       */

    }, {
      key: "hrefForExternal",
      value: function hrefForExternal(oArgs, oComponent, bAsync) {
        return this.crossAppNavService.hrefForExternal(oArgs, oComponent, !!bAsync);
      }
      /**
       * Will call getAppState method of CrossApplicationNavigation service with oComponent and oAppStateKey.
       *
       * @private
       * @ui5-restricted
       * @param {object} oComponent
       * @param {string} sAppStateKey Check the definition of
       * sap.ushell.services.CrossApplicationNavigation=>getAppState arguments
       * @returns {Promise} Promise which will be resolved to object
       */

    }, {
      key: "getAppState",
      value: function getAppState(oComponent, sAppStateKey) {
        return wrapJQueryPromise(this.crossAppNavService.getAppState(oComponent, sAppStateKey));
      }
      /**
       * Will call createEmptyAppState method of CrossApplicationNavigation service with oComponent.
       *
       * @private
       * @ui5-restricted
       * @param {object} oComponent Check the definition of
       * sap.ushell.services.CrossApplicationNavigation=>createEmptyAppState arguments
       * @returns {Promise} Promise which will be resolved to object
       */

    }, {
      key: "createEmptyAppState",
      value: function createEmptyAppState(oComponent) {
        return this.crossAppNavService.createEmptyAppState(oComponent);
      }
      /**
       * Will call isNavigationSupported method of CrossApplicationNavigation service with Navigation Arguments and oComponent.
       *
       * @private
       * @ui5-restricted
       * @param {Array} oNavArgumentsArr
       * @param {object} oComponent Check the definition of
       * sap.ushell.services.CrossApplicationNavigation=>isNavigationSupported arguments
       * @returns {Promise} Promise which will be resolved to object
       */

    }, {
      key: "isNavigationSupported",
      value: function isNavigationSupported(oNavArgumentsArr, oComponent) {
        return wrapJQueryPromise(this.crossAppNavService.isNavigationSupported(oNavArgumentsArr, oComponent));
      }
      /**
       * Will call isInitialNavigation method of CrossApplicationNavigation service.
       *
       * @private
       * @ui5-restricted
       * @returns {Promise} Promise which will be resolved to boolean
       */

    }, {
      key: "isInitialNavigation",
      value: function isInitialNavigation() {
        return this.crossAppNavService.isInitialNavigation();
      }
      /**
       * Will call expandCompactHash method of CrossApplicationNavigation service.
       *
       * @param {string} sHashFragment An (internal format) shell hash
       * @returns {Promise} A promise the success handler of the resolve promise get an expanded shell hash as first argument
       * @private
       * @ui5-restricted
       */

    }, {
      key: "expandCompactHash",
      value: function expandCompactHash(sHashFragment) {
        return this.crossAppNavService.expandCompactHash(sHashFragment);
      }
      /**
       * Will call parseShellHash method of URLParsing service with given sHash.
       *
       * @private
       * @ui5-restricted
       * @param {string} sHash Check the definition of
       * sap.ushell.services.URLParsing=>parseShellHash arguments
       * @returns {object}
       */

    }, {
      key: "parseShellHash",
      value: function parseShellHash(sHash) {
        return this.urlParsingService.parseShellHash(sHash);
      }
      /**
       * Will call splitHash method of URLParsing service with given sHash.
       *
       * @private
       * @ui5-restricted
       * @param {string} sHash Check the definition of
       * sap.ushell.services.URLParsing=>splitHash arguments
       * @returns {Promise} Promise which will be resolved to object
       */

    }, {
      key: "splitHash",
      value: function splitHash(sHash) {
        return this.urlParsingService.splitHash(sHash);
      }
      /**
       * Will call constructShellHash method of URLParsing service with given sHash.
       *
       * @private
       * @ui5-restricted
       * @param {object} oNewShellHash Check the definition of
       * sap.ushell.services.URLParsing=>constructShellHash arguments
       * @returns {string} Shell Hash string
       */

    }, {
      key: "constructShellHash",
      value: function constructShellHash(oNewShellHash) {
        return this.urlParsingService.constructShellHash(oNewShellHash);
      }
      /**
       * Will call setDirtyFlag method with given dirty state.
       *
       * @private
       * @ui5-restricted
       * @param {boolean} bDirty Check the definition of sap.ushell.Container.setDirtyFlag arguments
       */

    }, {
      key: "setDirtyFlag",
      value: function setDirtyFlag(bDirty) {
        this.oShellContainer.setDirtyFlag(bDirty);
      }
      /**
       * Will call registerDirtyStateProvider method with given dirty state provider callback method.
       *
       * @private
       * @ui5-restricted
       * @param {Function} fnDirtyStateProvider Check the definition of sap.ushell.Container.registerDirtyStateProvider arguments
       */

    }, {
      key: "registerDirtyStateProvider",
      value: function registerDirtyStateProvider(fnDirtyStateProvider) {
        this.oShellContainer.registerDirtyStateProvider(fnDirtyStateProvider);
      }
      /**
       * Will call deregisterDirtyStateProvider method with given dirty state provider callback method.
       *
       * @private
       * @ui5-restricted
       * @param {Function} fnDirtyStateProvider Check the definition of sap.ushell.Container.deregisterDirtyStateProvider arguments
       */

    }, {
      key: "deregisterDirtyStateProvider",
      value: function deregisterDirtyStateProvider(fnDirtyStateProvider) {
        this.oShellContainer.deregisterDirtyStateProvider(fnDirtyStateProvider);
      }
      /**
       * Will call createRenderer method of ushell container.
       *
       * @private
       * @ui5-restricted
       * @returns {object} Returns renderer object
       */

    }, {
      key: "createRenderer",
      value: function createRenderer() {
        return this.oShellContainer.createRenderer();
      }
      /**
       * Will call getUser method of ushell container.
       *
       * @private
       * @ui5-restricted
       * @returns {object} Returns User object
       */

    }, {
      key: "getUser",
      value: function getUser() {
        return this.oShellContainer.getUser();
      }
      /**
       * Will check if ushell container is available or not.
       *
       * @private
       * @ui5-restricted
       * @returns {boolean} Returns true
       */

    }, {
      key: "hasUShell",
      value: function hasUShell() {
        return true;
      }
      /**
       * Will call registerNavigationFilter method of shellNavigation.
       *
       * @param {Function} fnNavFilter The filter function to register
       * @returns {void}
       * @private
       * @ui5-restricted
       */

    }, {
      key: "registerNavigationFilter",
      value: function registerNavigationFilter(fnNavFilter) {
        this.shellNavigation.registerNavigationFilter(fnNavFilter);
      }
      /**
       * Will call unregisterNavigationFilter method of shellNavigation.
       *
       * @param {Function} fnNavFilter The filter function to unregister
       * @returns {void}
       * @private
       * @ui5-restricted
       */

    }, {
      key: "unregisterNavigationFilter",
      value: function unregisterNavigationFilter(fnNavFilter) {
        this.shellNavigation.unregisterNavigationFilter(fnNavFilter);
      }
      /**
       * Will call setBackNavigation method of ShellUIService
       * that displays the back button in the shell header.
       *
       * @param {Function} [fnCallBack] A callback function called when the button is clicked in the UI.
       * @returns {void}
       * @private
       * @ui5-restricted
       */

    }, {
      key: "setBackNavigation",
      value: function setBackNavigation(fnCallBack) {
        this.shellUIService.setBackNavigation(fnCallBack);
      }
      /**
       * Will call setHierarchy method of ShellUIService
       * that displays the given hierarchy in the shell header.
       *
       * @param {object[]} [aHierarchyLevels] An array representing hierarchies of the currently displayed app.
       * @returns {void}
       * @private
       * @ui5-restricted
       */

    }, {
      key: "setHierarchy",
      value: function setHierarchy(aHierarchyLevels) {
        this.shellUIService.setHierarchy(aHierarchyLevels);
      }
      /**
       * Will call setTitle method of ShellUIService
       * that displays the given title in the shell header.
       *
       * @param {string} [sTitle] The new title. The default title is set if this argument is not given.
       * @returns {void}
       * @private
       * @ui5-restricted
       */

    }, {
      key: "setTitle",
      value: function setTitle(sTitle) {
        this.shellUIService.setTitle(sTitle);
      }
      /**
       * Retrieves the currently defined content density.
       *
       * @returns {string} The content density value
       */

    }, {
      key: "getContentDensity",
      value: function getContentDensity() {
        return this.oShellContainer.getUser().getContentDensity();
      }
    }]);

    return ShellServices;
  }(Service);
  /**
   * Service Factory for the ShellServices
   *
   * @private
   */


  var ShellServicesFactory = /*#__PURE__*/function (_ServiceFactory) {
    _inherits(ShellServicesFactory, _ServiceFactory);

    var _super3 = _createSuper(ShellServicesFactory);

    function ShellServicesFactory() {
      _classCallCheck(this, ShellServicesFactory);

      return _super3.apply(this, arguments);
    }

    _createClass(ShellServicesFactory, [{
      key: "createInstance",
      value:
      /**
       * Creates either a standard or a mock Shell service depending on the configuration.
       *
       * @param {ServiceContext<ShellServicesSettings>} oServiceContext The shellservice context
       * @returns {Promise<IShellServices>} A promise for a shell service implementation
       * @see ServiceFactory#createInstance
       */
      function createInstance(oServiceContext) {
        oServiceContext.settings.shellContainer = sap.ushell && sap.ushell.Container;
        var oShellService = oServiceContext.settings.shellContainer ? new ShellServices(oServiceContext) : new ShellServiceMock(oServiceContext);
        return oShellService.initPromise.then(function () {
          // Enrich the appComponent with this method
          oServiceContext.scopeObject.getShellServices = function () {
            return oShellService;
          };

          return oShellService;
        });
      }
    }]);

    return ShellServicesFactory;
  }(ServiceFactory);

  return ShellServicesFactory;
}, false);
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIlNoZWxsU2VydmljZXNGYWN0b3J5LnRzIl0sIm5hbWVzIjpbIlNoZWxsU2VydmljZU1vY2siLCJpbml0UHJvbWlzZSIsIlByb21pc2UiLCJyZXNvbHZlIiwiaW5zdGFuY2VUeXBlIiwib0FyZ3MiLCJvTmF2QXJndW1lbnRzQXJyIiwib0NvbXBvbmVudCIsImJBc3luYyIsInNBcHBTdGF0ZUtleSIsInNIYXNoRnJhZ21lbnQiLCJzSGFzaCIsIm9OZXdTaGVsbEhhc2giLCJiRGlydHkiLCJmbkRpcnR5U3RhdGVQcm92aWRlciIsImZuTmF2RmlsdGVyIiwiZm5DYWxsQmFjayIsImFIaWVyYXJjaHlMZXZlbHMiLCJzVGl0bGUiLCJkb2N1bWVudCIsImJvZHkiLCJjbGFzc0xpc3QiLCJjb250YWlucyIsIlNlcnZpY2UiLCJ3cmFwSlF1ZXJ5UHJvbWlzZSIsImpxdWVyeVByb21pc2UiLCJyZWplY3QiLCJkb25lIiwiZmFpbCIsIlNoZWxsU2VydmljZXMiLCJvQ29udGV4dCIsImdldENvbnRleHQiLCJzY29wZU9iamVjdCIsIm9TaGVsbENvbnRhaW5lciIsInNldHRpbmdzIiwic2hlbGxDb250YWluZXIiLCJsaW5rc0NhY2hlIiwiZm5GaW5kU2VtYW50aWNPYmplY3RzSW5DYWNoZSIsIl9vQXJncyIsImFDYWNoZWRTZW1hbnRpY09iamVjdHMiLCJhTm9uQ2FjaGVkU2VtYW50aWNPYmplY3RzIiwiaSIsImxlbmd0aCIsInNlbWFudGljT2JqZWN0IiwicHVzaCIsImxpbmtzIiwiT2JqZWN0IiwiZGVmaW5lUHJvcGVydHkiLCJ2YWx1ZSIsIm9sZEFyZ3MiLCJuZXdBcmdzIiwiY2FjaGVkTGlua3MiLCJyZXNvbHZlRm4iLCJyZWplY3RGbiIsIm9Dcm9zc0FwcE5hdlNlcnZpY2VQcm9taXNlIiwiZ2V0U2VydmljZUFzeW5jIiwib1VybFBhcnNpbmdTZXJ2aWNlUHJvbWlzZSIsIm9TaGVsbE5hdmlnYXRpb25TZXJ2aWNlUHJvbWlzZSIsIm9TaGVsbFVJU2VydmljZVByb21pc2UiLCJnZXRTZXJ2aWNlIiwiYWxsIiwidGhlbiIsIm9Dcm9zc0FwcE5hdlNlcnZpY2UiLCJvVXJsUGFyc2luZ1NlcnZpY2UiLCJvU2hlbGxOYXZpZ2F0aW9uIiwib1NoZWxsVUlTZXJ2aWNlIiwiY3Jvc3NBcHBOYXZTZXJ2aWNlIiwidXJsUGFyc2luZ1NlcnZpY2UiLCJzaGVsbE5hdmlnYXRpb24iLCJzaGVsbFVJU2VydmljZSIsImNhdGNoIiwiZ2V0TGlua3MiLCJvRXJyb3IiLCJFcnJvciIsImFMaW5rcyIsIm9DYWNoZVJlc3VsdHMiLCJvU2VtYW50aWNPYmplY3RzTGlua3MiLCJ1bmRlZmluZWQiLCJhc3NpZ24iLCJhTWVyZ2VkTGlua3MiLCJqIiwiayIsInRvRXh0ZXJuYWwiLCJnZXRTdGFydHVwQXBwU3RhdGUiLCJiYWNrVG9QcmV2aW91c0FwcCIsImhyZWZGb3JFeHRlcm5hbCIsImdldEFwcFN0YXRlIiwiY3JlYXRlRW1wdHlBcHBTdGF0ZSIsImlzTmF2aWdhdGlvblN1cHBvcnRlZCIsImlzSW5pdGlhbE5hdmlnYXRpb24iLCJleHBhbmRDb21wYWN0SGFzaCIsInBhcnNlU2hlbGxIYXNoIiwic3BsaXRIYXNoIiwiY29uc3RydWN0U2hlbGxIYXNoIiwic2V0RGlydHlGbGFnIiwicmVnaXN0ZXJEaXJ0eVN0YXRlUHJvdmlkZXIiLCJkZXJlZ2lzdGVyRGlydHlTdGF0ZVByb3ZpZGVyIiwiY3JlYXRlUmVuZGVyZXIiLCJnZXRVc2VyIiwicmVnaXN0ZXJOYXZpZ2F0aW9uRmlsdGVyIiwidW5yZWdpc3Rlck5hdmlnYXRpb25GaWx0ZXIiLCJzZXRCYWNrTmF2aWdhdGlvbiIsInNldEhpZXJhcmNoeSIsInNldFRpdGxlIiwiZ2V0Q29udGVudERlbnNpdHkiLCJTaGVsbFNlcnZpY2VzRmFjdG9yeSIsIm9TZXJ2aWNlQ29udGV4dCIsInNhcCIsInVzaGVsbCIsIkNvbnRhaW5lciIsIm9TaGVsbFNlcnZpY2UiLCJnZXRTaGVsbFNlcnZpY2VzIiwiU2VydmljZUZhY3RvcnkiXSwibWFwcGluZ3MiOiI7QUFB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a0MsUUFBcEIsQ0FBNkJyRixNQUE3QjtBQUNBO0FBRUQ7QUFDRDtBQUNBO0FBQ0E7QUFDQTs7OzthQUNDLDZCQUE0QjtBQUMzQixlQUFRLEtBQUtlLGVBQUwsQ0FBcUJpRSxPQUFyQixFQUFELENBQXdDTSxpQkFBeEMsRUFBUDtBQUNBOzs7O0lBdGQwQmpGLE87QUF5ZDVCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7OztNQUNNa0Ysb0I7Ozs7Ozs7Ozs7Ozs7O0FBQ0w7QUFDRDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQyw4QkFBZUMsZUFBZixFQUFnRztBQUMvRkEsUUFBQUEsZUFBZSxDQUFDeEUsUUFBaEIsQ0FBeUJDLGNBQXpCLEdBQTBDd0UsR0FBRyxDQUFDQyxNQUFKLElBQWVELEdBQUcsQ0FBQ0MsTUFBSixDQUFXQyxTQUFwRTtBQUNBLFlBQU1DLGFBQWEsR0FBR0osZUFBZSxDQUFDeEUsUUFBaEIsQ0FBeUJDLGNBQXpCLEdBQ25CLElBQUlOLGFBQUosQ0FBa0I2RSxlQUFsQixDQURtQixHQUVuQixJQUFJMUcsZ0JBQUosQ0FBcUIwRyxlQUFyQixDQUZIO0FBR0EsZUFBT0ksYUFBYSxDQUFDN0csV0FBZCxDQUEwQjRELElBQTFCLENBQStCLFlBQU07QUFDM0M7QUFDQzZDLFVBQUFBLGVBQWUsQ0FBQzFFLFdBQWpCLENBQXFDK0UsZ0JBQXJDLEdBQXdEO0FBQUEsbUJBQU1ELGFBQU47QUFBQSxXQUF4RDs7QUFDQSxpQkFBT0EsYUFBUDtBQUNBLFNBSk0sQ0FBUDtBQUtBOzs7O0lBbEJpQ0UsYzs7U0FxQnBCUCxvQiIsInNvdXJjZVJvb3QiOiIuIiwic291cmNlc0NvbnRlbnQiOlsiLyogZXNsaW50LWRpc2FibGUgQHR5cGVzY3JpcHQtZXNsaW50L25vLXVudXNlZC12YXJzICovXG5cbmltcG9ydCB7IFNlcnZpY2VGYWN0b3J5LCBTZXJ2aWNlLCBTZXJ2aWNlQ29udGV4dCB9IGZyb20gXCJzYXAvdWkvY29yZS9zZXJ2aWNlXCI7XG5pbXBvcnQgeyBDb250YWluZXIsIENyb3NzQXBwbGljYXRpb25OYXZpZ2F0aW9uLCBTaGVsbE5hdmlnYXRpb24sIFVSTFBhcnNpbmcgfSBmcm9tIFwic2FwL3VzaGVsbC9zZXJ2aWNlc1wiO1xuaW1wb3J0IHsgQ29tcG9uZW50IH0gZnJvbSBcInNhcC91aS9jb3JlXCI7XG5cbi8qKlxuICogQGludGVyZmFjZSBJU2hlbGxTZXJ2aWNlc1xuICogQHByaXZhdGVcbiAqL1xuZXhwb3J0IGludGVyZmFjZSBJU2hlbGxTZXJ2aWNlcyB7XG5cdGluaXRQcm9taXNlOiBQcm9taXNlPElTaGVsbFNlcnZpY2VzPjtcblxuXHRnZXRMaW5rcyhvQXJnczogb2JqZWN0KTogUHJvbWlzZTxhbnk+O1xuXG5cdHRvRXh0ZXJuYWwob05hdkFyZ3VtZW50c0FycjogQXJyYXk8b2JqZWN0Piwgb0NvbXBvbmVudDogb2JqZWN0KTogdm9pZDtcblxuXHRnZXRTdGFydHVwQXBwU3RhdGUob0FyZ3M6IG9iamVjdCk6IFByb21pc2U8YW55PjtcblxuXHRiYWNrVG9QcmV2aW91c0FwcCgpOiB2b2lkO1xuXG5cdGhyZWZGb3JFeHRlcm5hbChvQXJncz86IG9iamVjdCwgb0NvbXBvbmVudD86IG9iamVjdCwgYkFzeW5jPzogYm9vbGVhbik6IHN0cmluZztcblxuXHRnZXRBcHBTdGF0ZShvQ29tcG9uZW50OiBDb21wb25lbnQsIHNBcHBTdGF0ZUtleTogc3RyaW5nKTogUHJvbWlzZTxhbnk+O1xuXG5cdGNyZWF0ZUVtcHR5QXBwU3RhdGUob0NvbXBvbmVudDogQ29tcG9uZW50KTogb2JqZWN0O1xuXG5cdGlzTmF2aWdhdGlvblN1cHBvcnRlZChvTmF2QXJndW1lbnRzQXJyOiBBcnJheTxvYmplY3Q+LCBvQ29tcG9uZW50OiBvYmplY3QpOiBQcm9taXNlPGFueT47XG5cblx0aXNJbml0aWFsTmF2aWdhdGlvbigpOiBib29sZWFuO1xuXG5cdGV4cGFuZENvbXBhY3RIYXNoKHNIYXNoRnJhZ21lbnQ6IHN0cmluZyk6IG9iamVjdDtcblxuXHRwYXJzZVNoZWxsSGFzaChzSGFzaDogc3RyaW5nKTogb2JqZWN0O1xuXG5cdHNwbGl0SGFzaChzSGFzaDogc3RyaW5nKTogb2JqZWN0O1xuXG5cdGNvbnN0cnVjdFNoZWxsSGFzaChvTmV3U2hlbGxIYXNoOiBvYmplY3QpOiBzdHJpbmc7XG5cblx0c2V0RGlydHlGbGFnKGJEaXJ0eTogYm9vbGVhbik6IHZvaWQ7XG5cblx0cmVnaXN0ZXJEaXJ0eVN0YXRlUHJvdmlkZXIoZm5EaXJ0eVN0YXRlUHJvdmlkZXI6IEZ1bmN0aW9uKTogdm9pZDtcblxuXHRkZXJlZ2lzdGVyRGlydHlTdGF0ZVByb3ZpZGVyKGZuRGlydHlTdGF0ZVByb3ZpZGVyOiBGdW5jdGlvbik6IHZvaWQ7XG5cblx0Y3JlYXRlUmVuZGVyZXIoKTogb2JqZWN0O1xuXG5cdGdldFVzZXIoKTogb2JqZWN0O1xuXG5cdGhhc1VTaGVsbCgpOiBib29sZWFuO1xuXG5cdHJlZ2lzdGVyTmF2aWdhdGlvbkZpbHRlcihmbk5hdkZpbHRlcjogRnVuY3Rpb24pOiB2b2lkO1xuXG5cdHVucmVnaXN0ZXJOYXZpZ2F0aW9uRmlsdGVyKGZuTmF2RmlsdGVyOiBGdW5jdGlvbik6IHZvaWQ7XG5cblx0c2V0QmFja05hdmlnYXRpb24oZm5DYWxsQmFjaz86IEZ1bmN0aW9uKTogdm9pZDtcblxuXHRzZXRIaWVyYXJjaHkoYUhpZXJhcmNoeUxldmVsczogQXJyYXk8b2JqZWN0Pik6IHZvaWQ7XG5cblx0c2V0VGl0bGUoc1RpdGxlOiBzdHJpbmcpOiB2b2lkO1xuXG5cdGdldENvbnRlbnREZW5zaXR5KCk6IHN0cmluZztcbn1cblxuLyoqXG4gKiBNb2NrIGltcGxlbWVudGF0aW9uIG9mIHRoZSBTaGVsbFNlcnZpY2UgZm9yIE9wZW5GRVxuICpcbiAqIEBpbXBsZW1lbnRzIHtJU2hlbGxTZXJ2aWNlc31cbiAqIEBwcml2YXRlXG4gKi9cbmNsYXNzIFNoZWxsU2VydmljZU1vY2sgZXh0ZW5kcyBTZXJ2aWNlPFNoZWxsU2VydmljZXNTZXR0aW5ncz4gaW1wbGVtZW50cyBJU2hlbGxTZXJ2aWNlcyB7XG5cdGluaXRQcm9taXNlITogUHJvbWlzZTxhbnk+O1xuXHRpbnN0YW5jZVR5cGUhOiBzdHJpbmc7XG5cblx0aW5pdCgpIHtcblx0XHR0aGlzLmluaXRQcm9taXNlID0gUHJvbWlzZS5yZXNvbHZlKHRoaXMpO1xuXHRcdHRoaXMuaW5zdGFuY2VUeXBlID0gXCJtb2NrXCI7XG5cdH1cblxuXHRnZXRMaW5rcyhvQXJnczogb2JqZWN0KSB7XG5cdFx0cmV0dXJuIFByb21pc2UucmVzb2x2ZShbXSk7XG5cdH1cblxuXHRnZXRMaW5rc1dpdGhDYWNoZShvQXJnczogb2JqZWN0KSB7XG5cdFx0cmV0dXJuIFByb21pc2UucmVzb2x2ZShbXSk7XG5cdH1cblxuXHR0b0V4dGVybmFsKG9OYXZBcmd1bWVudHNBcnI6IEFycmF5PG9iamVjdD4sIG9Db21wb25lbnQ6IG9iamVjdCkge1xuXHRcdHJldHVybjtcblx0fVxuXG5cdGdldFN0YXJ0dXBBcHBTdGF0ZShvQXJnczogb2JqZWN0KSB7XG5cdFx0cmV0dXJuIFByb21pc2UucmVzb2x2ZShudWxsKTtcblx0fVxuXG5cdGJhY2tUb1ByZXZpb3VzQXBwKCkge1xuXHRcdHJldHVybjtcblx0fVxuXG5cdGhyZWZGb3JFeHRlcm5hbChvQXJncz86IG9iamVjdCwgb0NvbXBvbmVudD86IG9iamVjdCwgYkFzeW5jPzogYm9vbGVhbikge1xuXHRcdHJldHVybiBcIlwiO1xuXHR9XG5cblx0Z2V0QXBwU3RhdGUob0NvbXBvbmVudDogb2JqZWN0LCBzQXBwU3RhdGVLZXk6IHN0cmluZykge1xuXHRcdHJldHVybiBQcm9taXNlLnJlc29sdmUoe30pO1xuXHR9XG5cblx0Y3JlYXRlRW1wdHlBcHBTdGF0ZShvQ29tcG9uZW50OiBvYmplY3QpIHtcblx0XHRyZXR1cm4gUHJvbWlzZS5yZXNvbHZlKHt9KTtcblx0fVxuXG5cdGlzTmF2aWdhdGlvblN1cHBvcnRlZChvTmF2QXJndW1lbnRzQXJyOiBBcnJheTxvYmplY3Q+LCBvQ29tcG9uZW50OiBvYmplY3QpIHtcblx0XHRyZXR1cm4gUHJvbWlzZS5yZXNvbHZlKHt9KTtcblx0fVxuXG5cdGlzSW5pdGlhbE5hdmlnYXRpb24oKSB7XG5cdFx0cmV0dXJuIGZhbHNlO1xuXHR9XG5cblx0ZXhwYW5kQ29tcGFjdEhhc2goc0hhc2hGcmFnbWVudDogc3RyaW5nKSB7XG5cdFx0cmV0dXJuIFByb21pc2UucmVzb2x2ZSh7fSk7XG5cdH1cblxuXHRwYXJzZVNoZWxsSGFzaChzSGFzaDogc3RyaW5nKSB7XG5cdFx0cmV0dXJuIHt9O1xuXHR9XG5cblx0c3BsaXRIYXNoKHNIYXNoOiBzdHJpbmcpIHtcblx0XHRyZXR1cm4gUHJvbWlzZS5yZXNvbHZlKHt9KTtcblx0fVxuXG5cdGNvbnN0cnVjdFNoZWxsSGFzaChvTmV3U2hlbGxIYXNoOiBvYmplY3QpIHtcblx0XHRyZXR1cm4gXCJcIjtcblx0fVxuXG5cdHNldERpcnR5RmxhZyhiRGlydHk6IGJvb2xlYW4pIHtcblx0XHRyZXR1cm47XG5cdH1cblxuXHRyZWdpc3RlckRpcnR5U3RhdGVQcm92aWRlcihmbkRpcnR5U3RhdGVQcm92aWRlcjogRnVuY3Rpb24pIHtcblx0XHRyZXR1cm47XG5cdH1cblxuXHRkZXJlZ2lzdGVyRGlydHlTdGF0ZVByb3ZpZGVyKGZuRGlydHlTdGF0ZVByb3ZpZGVyOiBGdW5jdGlvbikge1xuXHRcdHJldHVybjtcblx0fVxuXG5cdGNyZWF0ZVJlbmRlcmVyKCkge1xuXHRcdHJldHVybiB7fTtcblx0fVxuXG5cdGdldFVzZXIoKSB7XG5cdFx0cmV0dXJuIHt9O1xuXHR9XG5cblx0aGFzVVNoZWxsKCkge1xuXHRcdHJldHVybiBmYWxzZTtcblx0fVxuXG5cdHJlZ2lzdGVyTmF2aWdhdGlvbkZpbHRlcihmbk5hdkZpbHRlcjogRnVuY3Rpb24pOiB2b2lkIHtcblx0XHRyZXR1cm47XG5cdH1cblxuXHR1bnJlZ2lzdGVyTmF2aWdhdGlvbkZpbHRlcihmbk5hdkZpbHRlcjogRnVuY3Rpb24pOiB2b2lkIHtcblx0XHRyZXR1cm47XG5cdH1cblxuXHRzZXRCYWNrTmF2aWdhdGlvbihmbkNhbGxCYWNrPzogRnVuY3Rpb24pOiB2b2lkIHtcblx0XHRyZXR1cm47XG5cdH1cblxuXHRzZXRIaWVyYXJjaHkoYUhpZXJhcmNoeUxldmVsczogQXJyYXk8b2JqZWN0Pik6IHZvaWQge1xuXHRcdHJldHVybjtcblx0fVxuXG5cdHNldFRpdGxlKHNUaXRsZTogc3RyaW5nKTogdm9pZCB7XG5cdFx0cmV0dXJuO1xuXHR9XG5cblx0Z2V0Q29udGVudERlbnNpdHkoKTogc3RyaW5nIHtcblx0XHQvLyBpbiBjYXNlIHRoZXJlIGlzIG5vIHNoZWxsIHdlIHByb2JhYmx5IG5lZWQgdG8gbG9vayBhdCB0aGUgY2xhc3NlcyBiZWluZyBkZWZpbmVkIG9uIHRoZSBib2R5XG5cdFx0aWYgKGRvY3VtZW50LmJvZHkuY2xhc3NMaXN0LmNvbnRhaW5zKFwic2FwVWlTaXplQ296eVwiKSkge1xuXHRcdFx0cmV0dXJuIFwiY296eVwiO1xuXHRcdH0gZWxzZSBpZiAoZG9jdW1lbnQuYm9keS5jbGFzc0xpc3QuY29udGFpbnMoXCJzYXBVaVNpemVDb21wYWN0XCIpKSB7XG5cdFx0XHRyZXR1cm4gXCJjb21wYWN0XCI7XG5cdFx0fSBlbHNlIHtcblx0XHRcdHJldHVybiBcIlwiO1xuXHRcdH1cblx0fVxufVxuXG4vKipcbiAqIEB0eXBlZGVmIFNoZWxsU2VydmljZXNTZXR0aW5nc1xuICogQHByaXZhdGVcbiAqL1xuZXhwb3J0IHR5cGUgU2hlbGxTZXJ2aWNlc1NldHRpbmdzID0ge1xuXHRzaGVsbENvbnRhaW5lcj86IENvbnRhaW5lcjtcbn07XG5cbi8qKlxuICogV3JhcCBhIEpRdWVyeSBQcm9taXNlIHdpdGhpbiBhIG5hdGl2ZSB7UHJvbWlzZX0uXG4gKlxuICogQHRlbXBsYXRlIHtvYmplY3R9IFRcbiAqIEBwYXJhbSB7alF1ZXJ5LlByb21pc2U8VD59IGpxdWVyeVByb21pc2UgVGhlIG9yaWdpbmFsIGpxdWVyeSBwcm9taXNlXG4gKiBAcmV0dXJucyB7UHJvbWlzZTxUPn0gQSBuYXRpdmUgcHJvbWlzZSB3cmFwcGluZyB0aGUgc2FtZSBvYmplY3RcbiAqIEBwcml2YXRlXG4gKi9cbmZ1bmN0aW9uIHdyYXBKUXVlcnlQcm9taXNlPFQ+KGpxdWVyeVByb21pc2U6IGpRdWVyeS5Qcm9taXNlKTogUHJvbWlzZTxUPiB7XG5cdHJldHVybiBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XG5cdFx0Ly8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIHByb21pc2UvY2F0Y2gtb3ItcmV0dXJuXG5cdFx0anF1ZXJ5UHJvbWlzZS5kb25lKHJlc29sdmUgYXMgYW55KS5mYWlsKHJlamVjdCk7XG5cdH0pO1xufVxuXG4vKipcbiAqIEJhc2UgaW1wbGVtZW50YXRpb24gb2YgdGhlIFNoZWxsU2VydmljZXNcbiAqXG4gKiBAaW1wbGVtZW50cyB7SVNoZWxsU2VydmljZXN9XG4gKiBAcHJpdmF0ZVxuICovXG5jbGFzcyBTaGVsbFNlcnZpY2VzIGV4dGVuZHMgU2VydmljZTxSZXF1aXJlZDxTaGVsbFNlcnZpY2VzU2V0dGluZ3M+PiBpbXBsZW1lbnRzIElTaGVsbFNlcnZpY2VzIHtcblx0cmVzb2x2ZUZuOiBhbnk7XG5cdHJlamVjdEZuOiBhbnk7XG5cdGluaXRQcm9taXNlITogUHJvbWlzZTxhbnk+O1xuXHQvLyAhOiBtZWFucyB0aGF0IHdlIGtub3cgaXQgd2lsbCBiZSBhc3NpZ25lZCBiZWZvcmUgdXNhZ2Vcblx0Y3Jvc3NBcHBOYXZTZXJ2aWNlITogQ3Jvc3NBcHBsaWNhdGlvbk5hdmlnYXRpb247XG5cdHVybFBhcnNpbmdTZXJ2aWNlITogVVJMUGFyc2luZztcblx0c2hlbGxOYXZpZ2F0aW9uITogU2hlbGxOYXZpZ2F0aW9uO1xuXHRvU2hlbGxDb250YWluZXIhOiBDb250YWluZXI7XG5cdHNoZWxsVUlTZXJ2aWNlITogYW55O1xuXHRpbnN0YW5jZVR5cGUhOiBzdHJpbmc7XG5cdGxpbmtzQ2FjaGUhOiBhbnk7XG5cdGZuRmluZFNlbWFudGljT2JqZWN0c0luQ2FjaGU6IGFueTtcblxuXHRpbml0KCkge1xuXHRcdGNvbnN0IG9Db250ZXh0ID0gdGhpcy5nZXRDb250ZXh0KCk7XG5cdFx0Y29uc3Qgb0NvbXBvbmVudCA9IG9Db250ZXh0LnNjb3BlT2JqZWN0IGFzIGFueTtcblx0XHR0aGlzLm9TaGVsbENvbnRhaW5lciA9IG9Db250ZXh0LnNldHRpbmdzLnNoZWxsQ29udGFpbmVyO1xuXHRcdHRoaXMuaW5zdGFuY2VUeXBlID0gXCJyZWFsXCI7XG5cdFx0dGhpcy5saW5rc0NhY2hlID0ge307XG5cdFx0dGhpcy5mbkZpbmRTZW1hbnRpY09iamVjdHNJbkNhY2hlID0gZnVuY3Rpb24ob0FyZ3M6IGFueSk6IG9iamVjdCB7XG5cdFx0XHRjb25zdCBfb0FyZ3M6IGFueSA9IG9BcmdzO1xuXHRcdFx0Y29uc3QgYUNhY2hlZFNlbWFudGljT2JqZWN0cyA9IFtdO1xuXHRcdFx0Y29uc3QgYU5vbkNhY2hlZFNlbWFudGljT2JqZWN0cyA9IFtdO1xuXHRcdFx0Zm9yIChsZXQgaSA9IDA7IGkgPCBfb0FyZ3MubGVuZ3RoOyBpKyspIHtcblx0XHRcdFx0aWYgKCEhX29BcmdzW2ldWzBdICYmICEhX29BcmdzW2ldWzBdLnNlbWFudGljT2JqZWN0KSB7XG5cdFx0XHRcdFx0aWYgKHRoaXMubGlua3NDYWNoZVtfb0FyZ3NbaV1bMF0uc2VtYW50aWNPYmplY3RdKSB7XG5cdFx0XHRcdFx0XHRhQ2FjaGVkU2VtYW50aWNPYmplY3RzLnB1c2godGhpcy5saW5rc0NhY2hlW19vQXJnc1tpXVswXS5zZW1hbnRpY09iamVjdF0ubGlua3MpO1xuXHRcdFx0XHRcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KG9BcmdzW2ldWzBdLCBcImxpbmtzXCIsIHtcblx0XHRcdFx0XHRcdFx0dmFsdWU6IHRoaXMubGlua3NDYWNoZVtfb0FyZ3NbaV1bMF0uc2VtYW50aWNPYmplY3RdLmxpbmtzXG5cdFx0XHRcdFx0XHR9KTtcblx0XHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdFx0YU5vbkNhY2hlZFNlbWFudGljT2JqZWN0cy5wdXNoKF9vQXJnc1tpXSk7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9XG5cdFx0XHR9XG5cdFx0XHRyZXR1cm4geyBvbGRBcmdzOiBvQXJncywgbmV3QXJnczogYU5vbkNhY2hlZFNlbWFudGljT2JqZWN0cywgY2FjaGVkTGlua3M6IGFDYWNoZWRTZW1hbnRpY09iamVjdHMgfTtcblx0XHR9O1xuXHRcdHRoaXMuaW5pdFByb21pc2UgPSBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XG5cdFx0XHR0aGlzLnJlc29sdmVGbiA9IHJlc29sdmU7XG5cdFx0XHR0aGlzLnJlamVjdEZuID0gcmVqZWN0O1xuXHRcdH0pO1xuXHRcdGNvbnN0IG9Dcm9zc0FwcE5hdlNlcnZpY2VQcm9taXNlID0gdGhpcy5vU2hlbGxDb250YWluZXIuZ2V0U2VydmljZUFzeW5jKFwiQ3Jvc3NBcHBsaWNhdGlvbk5hdmlnYXRpb25cIik7XG5cdFx0Y29uc3Qgb1VybFBhcnNpbmdTZXJ2aWNlUHJvbWlzZSA9IHRoaXMub1NoZWxsQ29udGFpbmVyLmdldFNlcnZpY2VBc3luYyhcIlVSTFBhcnNpbmdcIik7XG5cdFx0Y29uc3Qgb1NoZWxsTmF2aWdhdGlvblNlcnZpY2VQcm9taXNlID0gdGhpcy5vU2hlbGxDb250YWluZXIuZ2V0U2VydmljZUFzeW5jKFwiU2hlbGxOYXZpZ2F0aW9uXCIpO1xuXHRcdGNvbnN0IG9TaGVsbFVJU2VydmljZVByb21pc2UgPSBvQ29tcG9uZW50LmdldFNlcnZpY2UoXCJTaGVsbFVJU2VydmljZVwiKTtcblx0XHRQcm9taXNlLmFsbChbb0Nyb3NzQXBwTmF2U2VydmljZVByb21pc2UsIG9VcmxQYXJzaW5nU2VydmljZVByb21pc2UsIG9TaGVsbE5hdmlnYXRpb25TZXJ2aWNlUHJvbWlzZSwgb1NoZWxsVUlTZXJ2aWNlUHJvbWlzZV0pXG5cdFx0XHQudGhlbigoW29Dcm9zc0FwcE5hdlNlcnZpY2UsIG9VcmxQYXJzaW5nU2VydmljZSwgb1NoZWxsTmF2aWdhdGlvbiwgb1NoZWxsVUlTZXJ2aWNlXSkgPT4ge1xuXHRcdFx0XHR0aGlzLmNyb3NzQXBwTmF2U2VydmljZSA9IG9Dcm9zc0FwcE5hdlNlcnZpY2U7XG5cdFx0XHRcdHRoaXMudXJsUGFyc2luZ1NlcnZpY2UgPSBvVXJsUGFyc2luZ1NlcnZpY2U7XG5cdFx0XHRcdHRoaXMuc2hlbGxOYXZpZ2F0aW9uID0gb1NoZWxsTmF2aWdhdGlvbjtcblx0XHRcdFx0dGhpcy5zaGVsbFVJU2VydmljZSA9IG9TaGVsbFVJU2VydmljZTtcblx0XHRcdFx0dGhpcy5yZXNvbHZlRm4oKTtcblx0XHRcdH0pXG5cdFx0XHQuY2F0Y2godGhpcy5yZWplY3RGbik7XG5cdH1cblxuXHQvKipcblx0ICogUmV0cmlldmVzIHRoZSB0YXJnZXQgbGlua3MgY29uZmlndXJlZCBmb3IgYSBnaXZlbiBzZW1hbnRpYyBvYmplY3QgJiBhY3Rpb25cblx0ICogV2lsbCByZXRyaWV2ZSB0aGUgQ3Jvc3NBcHBsaWNhdGlvbk5hdmlnYXRpb25cblx0ICogc2VydmljZSByZWZlcmVuY2UgY2FsbCB0aGUgZ2V0TGlua3MgbWV0aG9kLiBJbiBjYXNlIHNlcnZpY2UgaXMgbm90IGF2YWlsYWJsZSBvciBhbnkgZXhjZXB0aW9uXG5cdCAqIG1ldGhvZCB0aHJvd3MgZXhjZXB0aW9uIGVycm9yIGluIGNvbnNvbGUuXG5cdCAqXG5cdCAqIEBwcml2YXRlXG5cdCAqIEB1aTUtcmVzdHJpY3RlZFxuXHQgKiBAcGFyYW0ge29iamVjdH0gb0FyZ3MgQ2hlY2sgdGhlIGRlZmluaXRpb24gb2Zcblx0ICogc2FwLnVzaGVsbC5zZXJ2aWNlcy5Dcm9zc0FwcGxpY2F0aW9uTmF2aWdhdGlvbj0+Z2V0TGlua3MgYXJndW1lbnRzXG5cdCAqIEByZXR1cm5zIHtQcm9taXNlfSBQcm9taXNlIHdoaWNoIHdpbGwgYmUgcmVzb2x2ZWQgdG8gdGFyZ2V0IGxpbmtzIGFycmF5XG5cdCAqL1xuXHRnZXRMaW5rcyhvQXJnczogb2JqZWN0KSB7XG5cdFx0cmV0dXJuIG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcblx0XHRcdC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBwcm9taXNlL2NhdGNoLW9yLXJldHVyblxuXHRcdFx0dGhpcy5jcm9zc0FwcE5hdlNlcnZpY2Vcblx0XHRcdFx0LmdldExpbmtzKG9BcmdzKVxuXHRcdFx0XHQuZmFpbCgob0Vycm9yOiBhbnkpID0+IHtcblx0XHRcdFx0XHRyZWplY3QobmV3IEVycm9yKG9FcnJvciArIFwiIHNhcC5mZS5jb3JlLnNlcnZpY2VzLk5hdmlnYXRpb25TZXJ2aWNlRmFjdG9yeS5nZXRMaW5rc1wiKSk7XG5cdFx0XHRcdH0pXG5cdFx0XHRcdC50aGVuKHJlc29sdmUpO1xuXHRcdH0pO1xuXHR9XG5cblx0LyoqXG5cdCAqIFJldHJpZXZlcyB0aGUgdGFyZ2V0IGxpbmtzIGNvbmZpZ3VyZWQgZm9yIGEgZ2l2ZW4gc2VtYW50aWMgb2JqZWN0ICYgYWN0aW9uIGluIGNhY2hlXG5cdCAqIFdpbGwgcmV0cmlldmUgdGhlIENyb3NzQXBwbGljYXRpb25OYXZpZ2F0aW9uXG5cdCAqIHNlcnZpY2UgcmVmZXJlbmNlIGNhbGwgdGhlIGdldExpbmtzIG1ldGhvZC4gSW4gY2FzZSBzZXJ2aWNlIGlzIG5vdCBhdmFpbGFibGUgb3IgYW55IGV4Y2VwdGlvblxuXHQgKiBtZXRob2QgdGhyb3dzIGV4Y2VwdGlvbiBlcnJvciBpbiBjb25zb2xlLlxuXHQgKlxuXHQgKiBAcHJpdmF0ZVxuXHQgKiBAdWk1LXJlc3RyaWN0ZWRcblx0ICogQHBhcmFtIHtvYmplY3R9IG9BcmdzIENoZWNrIHRoZSBkZWZpbml0aW9uIG9mXG5cdCAqIHNhcC51c2hlbGwuc2VydmljZXMuQ3Jvc3NBcHBsaWNhdGlvbk5hdmlnYXRpb249PmdldExpbmtzIGFyZ3VtZW50c1xuXHQgKiBAcmV0dXJucyB7UHJvbWlzZX0gUHJvbWlzZSB3aGljaCB3aWxsIGJlIHJlc29sdmVkIHRvIHRhcmdldCBsaW5rcyBhcnJheVxuXHQgKi9cblx0Z2V0TGlua3NXaXRoQ2FjaGUob0FyZ3M6IG9iamVjdCkge1xuXHRcdHJldHVybiBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XG5cdFx0XHQvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgcHJvbWlzZS9jYXRjaC1vci1yZXR1cm5cblx0XHRcdGlmICgob0FyZ3MgYXMgT2JqZWN0W10pLmxlbmd0aCA9PT0gMCkge1xuXHRcdFx0XHRyZXNvbHZlKFtdKTtcblx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdGxldCBhTGlua3M7XG5cdFx0XHRcdGNvbnN0IG9DYWNoZVJlc3VsdHMgPSB0aGlzLmZuRmluZFNlbWFudGljT2JqZWN0c0luQ2FjaGUob0FyZ3MpO1xuXG5cdFx0XHRcdGlmIChvQ2FjaGVSZXN1bHRzLm5ld0FyZ3MubGVuZ3RoID09PSAwKSB7XG5cdFx0XHRcdFx0cmVzb2x2ZShvQ2FjaGVSZXN1bHRzLmNhY2hlZExpbmtzKTtcblx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHQvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgcHJvbWlzZS9jYXRjaC1vci1yZXR1cm5cblx0XHRcdFx0XHR0aGlzLmNyb3NzQXBwTmF2U2VydmljZVxuXHRcdFx0XHRcdFx0LmdldExpbmtzKG9DYWNoZVJlc3VsdHMubmV3QXJncylcblx0XHRcdFx0XHRcdC5mYWlsKChvRXJyb3I6IGFueSkgPT4ge1xuXHRcdFx0XHRcdFx0XHRyZWplY3QobmV3IEVycm9yKG9FcnJvciArIFwiIHNhcC5mZS5jb3JlLnNlcnZpY2VzLk5hdmlnYXRpb25TZXJ2aWNlRmFjdG9yeS5nZXRMaW5rc1dpdGhDYWNoZVwiKSk7XG5cdFx0XHRcdFx0XHR9KVxuXHRcdFx0XHRcdFx0LnRoZW4oKGFMaW5rczogYW55KSA9PiB7XG5cdFx0XHRcdFx0XHRcdGlmIChhTGlua3MubGVuZ3RoICE9PSAwKSB7XG5cdFx0XHRcdFx0XHRcdFx0Y29uc3Qgb1NlbWFudGljT2JqZWN0c0xpbmtzOiBhbnkgPSB7fTtcblxuXHRcdFx0XHRcdFx0XHRcdGZvciAobGV0IGkgPSAwOyBpIDwgYUxpbmtzLmxlbmd0aDsgaSsrKSB7XG5cdFx0XHRcdFx0XHRcdFx0XHRpZiAoYUxpbmtzW2ldLmxlbmd0aCA+IDAgJiYgb0NhY2hlUmVzdWx0cy5uZXdBcmdzW2ldWzBdLmxpbmtzID09PSB1bmRlZmluZWQpIHtcblx0XHRcdFx0XHRcdFx0XHRcdFx0b1NlbWFudGljT2JqZWN0c0xpbmtzW29DYWNoZVJlc3VsdHMubmV3QXJnc1tpXVswXS5zZW1hbnRpY09iamVjdF0gPSB7XG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0bGlua3M6IGFMaW5rc1tpXVxuXHRcdFx0XHRcdFx0XHRcdFx0XHR9O1xuXHRcdFx0XHRcdFx0XHRcdFx0XHR0aGlzLmxpbmtzQ2FjaGUgPSBPYmplY3QuYXNzaWduKHRoaXMubGlua3NDYWNoZSwgb1NlbWFudGljT2JqZWN0c0xpbmtzKTtcblx0XHRcdFx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHRcdH1cblxuXHRcdFx0XHRcdFx0XHRpZiAob0NhY2hlUmVzdWx0cy5jYWNoZWRMaW5rcy5sZW5ndGggPT09IDApIHtcblx0XHRcdFx0XHRcdFx0XHRyZXNvbHZlKGFMaW5rcyk7XG5cdFx0XHRcdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0XHRcdFx0Y29uc3QgYU1lcmdlZExpbmtzID0gW107XG5cdFx0XHRcdFx0XHRcdFx0bGV0IGogPSAwO1xuXG5cdFx0XHRcdFx0XHRcdFx0Zm9yIChsZXQgayA9IDA7IGsgPCBvQ2FjaGVSZXN1bHRzLm9sZEFyZ3MubGVuZ3RoOyBrKyspIHtcblx0XHRcdFx0XHRcdFx0XHRcdGlmIChqIDwgYUxpbmtzLmxlbmd0aCkge1xuXHRcdFx0XHRcdFx0XHRcdFx0XHRpZiAoXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0YUxpbmtzW2pdLmxlbmd0aCA+IDAgJiZcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRvQ2FjaGVSZXN1bHRzLm9sZEFyZ3Nba11bMF0uc2VtYW50aWNPYmplY3QgPT09IG9DYWNoZVJlc3VsdHMubmV3QXJnc1tqXVswXS5zZW1hbnRpY09iamVjdFxuXHRcdFx0XHRcdFx0XHRcdFx0XHQpIHtcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRhTWVyZ2VkTGlua3MucHVzaChhTGlua3Nbal0pO1xuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdGorKztcblx0XHRcdFx0XHRcdFx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRhTWVyZ2VkTGlua3MucHVzaChvQ2FjaGVSZXN1bHRzLm9sZEFyZ3Nba11bMF0ubGlua3MpO1xuXHRcdFx0XHRcdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdFx0XHRcdFx0XHRhTWVyZ2VkTGlua3MucHVzaChvQ2FjaGVSZXN1bHRzLm9sZEFyZ3Nba11bMF0ubGlua3MpO1xuXHRcdFx0XHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdFx0XHRyZXNvbHZlKGFNZXJnZWRMaW5rcyk7XG5cdFx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdH0pO1xuXHRcdFx0XHR9XG5cdFx0XHR9XG5cdFx0fSk7XG5cdH1cblxuXHQvKipcblx0ICogV2lsbCByZXRyaWV2ZSB0aGUgU2hlbGxDb250YWluZXIuXG5cdCAqXG5cdCAqIEBwcml2YXRlXG5cdCAqIEB1aTUtcmVzdHJpY3RlZFxuXHQgKiBzYXAudXNoZWxsLmNvbnRhaW5lclxuXHQgKiBAcmV0dXJucyB7b2JqZWN0fSBPYmplY3Qgd2l0aCBwcmVkZWZpbmVkIHNoZWxsQ29udGFpbmVyIG1ldGhvZHNcblx0ICovXG5cdGdldFNoZWxsQ29udGFpbmVyKCkge1xuXHRcdHJldHVybiB0aGlzLm9TaGVsbENvbnRhaW5lcjtcblx0fVxuXG5cdC8qKlxuXHQgKiBXaWxsIGNhbGwgdG9FeHRlcm5hbCBtZXRob2Qgb2YgQ3Jvc3NBcHBsaWNhdGlvbk5hdmlnYXRpb24gc2VydmljZSB3aXRoIE5hdmlnYXRpb24gQXJndW1lbnRzIGFuZCBvQ29tcG9uZW50LlxuXHQgKlxuXHQgKiBAcHJpdmF0ZVxuXHQgKiBAdWk1LXJlc3RyaWN0ZWRcblx0ICogQHBhcmFtIHtBcnJheX0gb05hdkFyZ3VtZW50c0FyciBBbmRcblx0ICogQHBhcmFtIHtvYmplY3R9IG9Db21wb25lbnQgQ2hlY2sgdGhlIGRlZmluaXRpb24gb2Zcblx0ICogc2FwLnVzaGVsbC5zZXJ2aWNlcy5Dcm9zc0FwcGxpY2F0aW9uTmF2aWdhdGlvbj0+dG9FeHRlcm5hbCBhcmd1bWVudHNcblx0ICogQHJldHVybnMge3ZvaWR9XG5cdCAqL1xuXHR0b0V4dGVybmFsKG9OYXZBcmd1bWVudHNBcnI6IEFycmF5PG9iamVjdD4sIG9Db21wb25lbnQ6IG9iamVjdCk6IHZvaWQge1xuXHRcdHRoaXMuY3Jvc3NBcHBOYXZTZXJ2aWNlLnRvRXh0ZXJuYWwob05hdkFyZ3VtZW50c0Fyciwgb0NvbXBvbmVudCk7XG5cdH1cblxuXHQvKipcblx0ICogUmV0cmlldmVzIHRoZSB0YXJnZXQgc3RhcnR1cEFwcFN0YXRlXG5cdCAqIFdpbGwgY2hlY2sgdGhlIGV4aXN0YW5jZSBvZiB0aGUgU2hlbGxDb250YWluZXIgYW5kIHJldHJpZXZlIHRoZSBDcm9zc0FwcGxpY2F0aW9uTmF2aWdhdGlvblxuXHQgKiBzZXJ2aWNlIHJlZmVyZW5jZSBjYWxsIHRoZSBnZXRTdGFydHVwQXBwU3RhdGUgbWV0aG9kLiBJbiBjYXNlIHNlcnZpY2UgaXMgbm90IGF2YWlsYWJsZSBvciBhbnkgZXhjZXB0aW9uXG5cdCAqIG1ldGhvZCB0aHJvd3MgZXhjZXB0aW9uIGVycm9yIGluIGNvbnNvbGUuXG5cdCAqXG5cdCAqIEBwcml2YXRlXG5cdCAqIEB1aTUtcmVzdHJpY3RlZFxuXHQgKiBAcGFyYW0ge29iamVjdH0gb0FyZ3MgQ2hlY2sgdGhlIGRlZmluaXRpb24gb2Zcblx0ICogc2FwLnVzaGVsbC5zZXJ2aWNlcy5Dcm9zc0FwcGxpY2F0aW9uTmF2aWdhdGlvbj0+Z2V0U3RhcnR1cEFwcFN0YXRlIGFyZ3VtZW50c1xuXHQgKiBAcmV0dXJucyB7UHJvbWlzZX0gUHJvbWlzZSB3aGljaCB3aWxsIGJlIHJlc29sdmVkIHRvIE9iamVjdFxuXHQgKi9cblx0Z2V0U3RhcnR1cEFwcFN0YXRlKG9BcmdzOiBDb21wb25lbnQpIHtcblx0XHRyZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xuXHRcdFx0Ly8gSlF1ZXJ5IFByb21pc2UgYmVoYXZlcyBkaWZmZXJlbnRseVxuXHRcdFx0Ly8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIHByb21pc2UvY2F0Y2gtb3ItcmV0dXJuXG5cdFx0XHR0aGlzLmNyb3NzQXBwTmF2U2VydmljZVxuXHRcdFx0XHQuZ2V0U3RhcnR1cEFwcFN0YXRlKG9BcmdzKVxuXHRcdFx0XHQuZmFpbCgob0Vycm9yOiBhbnkpID0+IHtcblx0XHRcdFx0XHRyZWplY3QobmV3IEVycm9yKG9FcnJvciArIFwiIHNhcC5mZS5jb3JlLnNlcnZpY2VzLk5hdmlnYXRpb25TZXJ2aWNlRmFjdG9yeS5nZXRTdGFydHVwQXBwU3RhdGVcIikpO1xuXHRcdFx0XHR9KVxuXHRcdFx0XHQudGhlbihyZXNvbHZlKTtcblx0XHR9KTtcblx0fVxuXG5cdC8qKlxuXHQgKiBXaWxsIGNhbGwgYmFja1RvUHJldmlvdXNBcHAgbWV0aG9kIG9mIENyb3NzQXBwbGljYXRpb25OYXZpZ2F0aW9uIHNlcnZpY2UuXG5cdCAqXG5cdCAqIEByZXR1cm5zIHt2b2lkfVxuXHQgKiBAcHJpdmF0ZVxuXHQgKiBAdWk1LXJlc3RyaWN0ZWRcblx0ICovXG5cdGJhY2tUb1ByZXZpb3VzQXBwKCkge1xuXHRcdHJldHVybiB0aGlzLmNyb3NzQXBwTmF2U2VydmljZS5iYWNrVG9QcmV2aW91c0FwcCgpO1xuXHR9XG5cblx0LyoqXG5cdCAqIFdpbGwgY2FsbCBocmVmRm9yRXh0ZXJuYWwgbWV0aG9kIG9mIENyb3NzQXBwbGljYXRpb25OYXZpZ2F0aW9uIHNlcnZpY2UuXG5cdCAqXG5cdCAqIEBwcml2YXRlXG5cdCAqIEB1aTUtcmVzdHJpY3RlZFxuXHQgKiBAcGFyYW0ge29iamVjdH0gb0FyZ3MgQ2hlY2sgdGhlIGRlZmluaXRpb24gb2Zcblx0ICogQHBhcmFtIHtvYmplY3R9IG9Db21wb25lbnQgVGhlIGFwcENvbXBvbmVudFxuXHQgKiBAcGFyYW0ge2Jvb2xlYW59IGJBc3luYyBXaGV0aGVyIHRoaXMgY2FsbCBzaG91bGQgYmUgYXN5bmMgb3Igbm90XG5cdCAqIHNhcC51c2hlbGwuc2VydmljZXMuQ3Jvc3NBcHBsaWNhdGlvbk5hdmlnYXRpb249PmhyZWZGb3JFeHRlcm5hbCBhcmd1bWVudHNcblx0ICogQHJldHVybnMge3N0cmluZ30gUHJvbWlzZSB3aGljaCB3aWxsIGJlIHJlc29sdmVkIHRvIHN0cmluZ1xuXHQgKi9cblx0aHJlZkZvckV4dGVybmFsKG9BcmdzOiBvYmplY3QsIG9Db21wb25lbnQ/OiBvYmplY3QsIGJBc3luYz86IGJvb2xlYW4pIHtcblx0XHRyZXR1cm4gdGhpcy5jcm9zc0FwcE5hdlNlcnZpY2UuaHJlZkZvckV4dGVybmFsKG9BcmdzLCBvQ29tcG9uZW50IGFzIG9iamVjdCwgISFiQXN5bmMpO1xuXHR9XG5cblx0LyoqXG5cdCAqIFdpbGwgY2FsbCBnZXRBcHBTdGF0ZSBtZXRob2Qgb2YgQ3Jvc3NBcHBsaWNhdGlvbk5hdmlnYXRpb24gc2VydmljZSB3aXRoIG9Db21wb25lbnQgYW5kIG9BcHBTdGF0ZUtleS5cblx0ICpcblx0ICogQHByaXZhdGVcblx0ICogQHVpNS1yZXN0cmljdGVkXG5cdCAqIEBwYXJhbSB7b2JqZWN0fSBvQ29tcG9uZW50XG5cdCAqIEBwYXJhbSB7c3RyaW5nfSBzQXBwU3RhdGVLZXkgQ2hlY2sgdGhlIGRlZmluaXRpb24gb2Zcblx0ICogc2FwLnVzaGVsbC5zZXJ2aWNlcy5Dcm9zc0FwcGxpY2F0aW9uTmF2aWdhdGlvbj0+Z2V0QXBwU3RhdGUgYXJndW1lbnRzXG5cdCAqIEByZXR1cm5zIHtQcm9taXNlfSBQcm9taXNlIHdoaWNoIHdpbGwgYmUgcmVzb2x2ZWQgdG8gb2JqZWN0XG5cdCAqL1xuXHRnZXRBcHBTdGF0ZShvQ29tcG9uZW50OiBDb21wb25lbnQsIHNBcHBTdGF0ZUtleTogc3RyaW5nKSB7XG5cdFx0cmV0dXJuIHdyYXBKUXVlcnlQcm9taXNlKHRoaXMuY3Jvc3NBcHBOYXZTZXJ2aWNlLmdldEFwcFN0YXRlKG9Db21wb25lbnQsIHNBcHBTdGF0ZUtleSkpO1xuXHR9XG5cblx0LyoqXG5cdCAqIFdpbGwgY2FsbCBjcmVhdGVFbXB0eUFwcFN0YXRlIG1ldGhvZCBvZiBDcm9zc0FwcGxpY2F0aW9uTmF2aWdhdGlvbiBzZXJ2aWNlIHdpdGggb0NvbXBvbmVudC5cblx0ICpcblx0ICogQHByaXZhdGVcblx0ICogQHVpNS1yZXN0cmljdGVkXG5cdCAqIEBwYXJhbSB7b2JqZWN0fSBvQ29tcG9uZW50IENoZWNrIHRoZSBkZWZpbml0aW9uIG9mXG5cdCAqIHNhcC51c2hlbGwuc2VydmljZXMuQ3Jvc3NBcHBsaWNhdGlvbk5hdmlnYXRpb249PmNyZWF0ZUVtcHR5QXBwU3RhdGUgYXJndW1lbnRzXG5cdCAqIEByZXR1cm5zIHtQcm9taXNlfSBQcm9taXNlIHdoaWNoIHdpbGwgYmUgcmVzb2x2ZWQgdG8gb2JqZWN0XG5cdCAqL1xuXHRjcmVhdGVFbXB0eUFwcFN0YXRlKG9Db21wb25lbnQ6IENvbXBvbmVudCkge1xuXHRcdHJldHVybiB0aGlzLmNyb3NzQXBwTmF2U2VydmljZS5jcmVhdGVFbXB0eUFwcFN0YXRlKG9Db21wb25lbnQpO1xuXHR9XG5cblx0LyoqXG5cdCAqIFdpbGwgY2FsbCBpc05hdmlnYXRpb25TdXBwb3J0ZWQgbWV0aG9kIG9mIENyb3NzQXBwbGljYXRpb25OYXZpZ2F0aW9uIHNlcnZpY2Ugd2l0aCBOYXZpZ2F0aW9uIEFyZ3VtZW50cyBhbmQgb0NvbXBvbmVudC5cblx0ICpcblx0ICogQHByaXZhdGVcblx0ICogQHVpNS1yZXN0cmljdGVkXG5cdCAqIEBwYXJhbSB7QXJyYXl9IG9OYXZBcmd1bWVudHNBcnJcblx0ICogQHBhcmFtIHtvYmplY3R9IG9Db21wb25lbnQgQ2hlY2sgdGhlIGRlZmluaXRpb24gb2Zcblx0ICogc2FwLnVzaGVsbC5zZXJ2aWNlcy5Dcm9zc0FwcGxpY2F0aW9uTmF2aWdhdGlvbj0+aXNOYXZpZ2F0aW9uU3VwcG9ydGVkIGFyZ3VtZW50c1xuXHQgKiBAcmV0dXJucyB7UHJvbWlzZX0gUHJvbWlzZSB3aGljaCB3aWxsIGJlIHJlc29sdmVkIHRvIG9iamVjdFxuXHQgKi9cblx0aXNOYXZpZ2F0aW9uU3VwcG9ydGVkKG9OYXZBcmd1bWVudHNBcnI6IEFycmF5PG9iamVjdD4sIG9Db21wb25lbnQ6IG9iamVjdCkge1xuXHRcdHJldHVybiB3cmFwSlF1ZXJ5UHJvbWlzZSh0aGlzLmNyb3NzQXBwTmF2U2VydmljZS5pc05hdmlnYXRpb25TdXBwb3J0ZWQob05hdkFyZ3VtZW50c0Fyciwgb0NvbXBvbmVudCkpO1xuXHR9XG5cblx0LyoqXG5cdCAqIFdpbGwgY2FsbCBpc0luaXRpYWxOYXZpZ2F0aW9uIG1ldGhvZCBvZiBDcm9zc0FwcGxpY2F0aW9uTmF2aWdhdGlvbiBzZXJ2aWNlLlxuXHQgKlxuXHQgKiBAcHJpdmF0ZVxuXHQgKiBAdWk1LXJlc3RyaWN0ZWRcblx0ICogQHJldHVybnMge1Byb21pc2V9IFByb21pc2Ugd2hpY2ggd2lsbCBiZSByZXNvbHZlZCB0byBib29sZWFuXG5cdCAqL1xuXHRpc0luaXRpYWxOYXZpZ2F0aW9uKCkge1xuXHRcdHJldHVybiB0aGlzLmNyb3NzQXBwTmF2U2VydmljZS5pc0luaXRpYWxOYXZpZ2F0aW9uKCk7XG5cdH1cblxuXHQvKipcblx0ICogV2lsbCBjYWxsIGV4cGFuZENvbXBhY3RIYXNoIG1ldGhvZCBvZiBDcm9zc0FwcGxpY2F0aW9uTmF2aWdhdGlvbiBzZXJ2aWNlLlxuXHQgKlxuXHQgKiBAcGFyYW0ge3N0cmluZ30gc0hhc2hGcmFnbWVudCBBbiAoaW50ZXJuYWwgZm9ybWF0KSBzaGVsbCBoYXNoXG5cdCAqIEByZXR1cm5zIHtQcm9taXNlfSBBIHByb21pc2UgdGhlIHN1Y2Nlc3MgaGFuZGxlciBvZiB0aGUgcmVzb2x2ZSBwcm9taXNlIGdldCBhbiBleHBhbmRlZCBzaGVsbCBoYXNoIGFzIGZpcnN0IGFyZ3VtZW50XG5cdCAqIEBwcml2YXRlXG5cdCAqIEB1aTUtcmVzdHJpY3RlZFxuXHQgKi9cblx0ZXhwYW5kQ29tcGFjdEhhc2goc0hhc2hGcmFnbWVudDogc3RyaW5nKSB7XG5cdFx0cmV0dXJuIHRoaXMuY3Jvc3NBcHBOYXZTZXJ2aWNlLmV4cGFuZENvbXBhY3RIYXNoKHNIYXNoRnJhZ21lbnQpO1xuXHR9XG5cblx0LyoqXG5cdCAqIFdpbGwgY2FsbCBwYXJzZVNoZWxsSGFzaCBtZXRob2Qgb2YgVVJMUGFyc2luZyBzZXJ2aWNlIHdpdGggZ2l2ZW4gc0hhc2guXG5cdCAqXG5cdCAqIEBwcml2YXRlXG5cdCAqIEB1aTUtcmVzdHJpY3RlZFxuXHQgKiBAcGFyYW0ge3N0cmluZ30gc0hhc2ggQ2hlY2sgdGhlIGRlZmluaXRpb24gb2Zcblx0ICogc2FwLnVzaGVsbC5zZXJ2aWNlcy5VUkxQYXJzaW5nPT5wYXJzZVNoZWxsSGFzaCBhcmd1bWVudHNcblx0ICogQHJldHVybnMge29iamVjdH1cblx0ICovXG5cdHBhcnNlU2hlbGxIYXNoKHNIYXNoOiBzdHJpbmcpIHtcblx0XHRyZXR1cm4gdGhpcy51cmxQYXJzaW5nU2VydmljZS5wYXJzZVNoZWxsSGFzaChzSGFzaCk7XG5cdH1cblxuXHQvKipcblx0ICogV2lsbCBjYWxsIHNwbGl0SGFzaCBtZXRob2Qgb2YgVVJMUGFyc2luZyBzZXJ2aWNlIHdpdGggZ2l2ZW4gc0hhc2guXG5cdCAqXG5cdCAqIEBwcml2YXRlXG5cdCAqIEB1aTUtcmVzdHJpY3RlZFxuXHQgKiBAcGFyYW0ge3N0cmluZ30gc0hhc2ggQ2hlY2sgdGhlIGRlZmluaXRpb24gb2Zcblx0ICogc2FwLnVzaGVsbC5zZXJ2aWNlcy5VUkxQYXJzaW5nPT5zcGxpdEhhc2ggYXJndW1lbnRzXG5cdCAqIEByZXR1cm5zIHtQcm9taXNlfSBQcm9taXNlIHdoaWNoIHdpbGwgYmUgcmVzb2x2ZWQgdG8gb2JqZWN0XG5cdCAqL1xuXHRzcGxpdEhhc2goc0hhc2g6IHN0cmluZykge1xuXHRcdHJldHVybiB0aGlzLnVybFBhcnNpbmdTZXJ2aWNlLnNwbGl0SGFzaChzSGFzaCk7XG5cdH1cblxuXHQvKipcblx0ICogV2lsbCBjYWxsIGNvbnN0cnVjdFNoZWxsSGFzaCBtZXRob2Qgb2YgVVJMUGFyc2luZyBzZXJ2aWNlIHdpdGggZ2l2ZW4gc0hhc2guXG5cdCAqXG5cdCAqIEBwcml2YXRlXG5cdCAqIEB1aTUtcmVzdHJpY3RlZFxuXHQgKiBAcGFyYW0ge29iamVjdH0gb05ld1NoZWxsSGFzaCBDaGVjayB0aGUgZGVmaW5pdGlvbiBvZlxuXHQgKiBzYXAudXNoZWxsLnNlcnZpY2VzLlVSTFBhcnNpbmc9PmNvbnN0cnVjdFNoZWxsSGFzaCBhcmd1bWVudHNcblx0ICogQHJldHVybnMge3N0cmluZ30gU2hlbGwgSGFzaCBzdHJpbmdcblx0ICovXG5cdGNvbnN0cnVjdFNoZWxsSGFzaChvTmV3U2hlbGxIYXNoOiBvYmplY3QpIHtcblx0XHRyZXR1cm4gdGhpcy51cmxQYXJzaW5nU2VydmljZS5jb25zdHJ1Y3RTaGVsbEhhc2gob05ld1NoZWxsSGFzaCk7XG5cdH1cblxuXHQvKipcblx0ICogV2lsbCBjYWxsIHNldERpcnR5RmxhZyBtZXRob2Qgd2l0aCBnaXZlbiBkaXJ0eSBzdGF0ZS5cblx0ICpcblx0ICogQHByaXZhdGVcblx0ICogQHVpNS1yZXN0cmljdGVkXG5cdCAqIEBwYXJhbSB7Ym9vbGVhbn0gYkRpcnR5IENoZWNrIHRoZSBkZWZpbml0aW9uIG9mIHNhcC51c2hlbGwuQ29udGFpbmVyLnNldERpcnR5RmxhZyBhcmd1bWVudHNcblx0ICovXG5cdHNldERpcnR5RmxhZyhiRGlydHk6IGJvb2xlYW4pIHtcblx0XHR0aGlzLm9TaGVsbENvbnRhaW5lci5zZXREaXJ0eUZsYWcoYkRpcnR5KTtcblx0fVxuXG5cdC8qKlxuXHQgKiBXaWxsIGNhbGwgcmVnaXN0ZXJEaXJ0eVN0YXRlUHJvdmlkZXIgbWV0aG9kIHdpdGggZ2l2ZW4gZGlydHkgc3RhdGUgcHJvdmlkZXIgY2FsbGJhY2sgbWV0aG9kLlxuXHQgKlxuXHQgKiBAcHJpdmF0ZVxuXHQgKiBAdWk1LXJlc3RyaWN0ZWRcblx0ICogQHBhcmFtIHtGdW5jdGlvbn0gZm5EaXJ0eVN0YXRlUHJvdmlkZXIgQ2hlY2sgdGhlIGRlZmluaXRpb24gb2Ygc2FwLnVzaGVsbC5Db250YWluZXIucmVnaXN0ZXJEaXJ0eVN0YXRlUHJvdmlkZXIgYXJndW1lbnRzXG5cdCAqL1xuXHRyZWdpc3RlckRpcnR5U3RhdGVQcm92aWRlcihmbkRpcnR5U3RhdGVQcm92aWRlcjogRnVuY3Rpb24pIHtcblx0XHR0aGlzLm9TaGVsbENvbnRhaW5lci5yZWdpc3RlckRpcnR5U3RhdGVQcm92aWRlcihmbkRpcnR5U3RhdGVQcm92aWRlcik7XG5cdH1cblxuXHQvKipcblx0ICogV2lsbCBjYWxsIGRlcmVnaXN0ZXJEaXJ0eVN0YXRlUHJvdmlkZXIgbWV0aG9kIHdpdGggZ2l2ZW4gZGlydHkgc3RhdGUgcHJvdmlkZXIgY2FsbGJhY2sgbWV0aG9kLlxuXHQgKlxuXHQgKiBAcHJpdmF0ZVxuXHQgKiBAdWk1LXJlc3RyaWN0ZWRcblx0ICogQHBhcmFtIHtGdW5jdGlvbn0gZm5EaXJ0eVN0YXRlUHJvdmlkZXIgQ2hlY2sgdGhlIGRlZmluaXRpb24gb2Ygc2FwLnVzaGVsbC5Db250YWluZXIuZGVyZWdpc3RlckRpcnR5U3RhdGVQcm92aWRlciBhcmd1bWVudHNcblx0ICovXG5cdGRlcmVnaXN0ZXJEaXJ0eVN0YXRlUHJvdmlkZXIoZm5EaXJ0eVN0YXRlUHJvdmlkZXI6IEZ1bmN0aW9uKSB7XG5cdFx0dGhpcy5vU2hlbGxDb250YWluZXIuZGVyZWdpc3RlckRpcnR5U3RhdGVQcm92aWRlcihmbkRpcnR5U3RhdGVQcm92aWRlcik7XG5cdH1cblxuXHQvKipcblx0ICogV2lsbCBjYWxsIGNyZWF0ZVJlbmRlcmVyIG1ldGhvZCBvZiB1c2hlbGwgY29udGFpbmVyLlxuXHQgKlxuXHQgKiBAcHJpdmF0ZVxuXHQgKiBAdWk1LXJlc3RyaWN0ZWRcblx0ICogQHJldHVybnMge29iamVjdH0gUmV0dXJucyByZW5kZXJlciBvYmplY3Rcblx0ICovXG5cdGNyZWF0ZVJlbmRlcmVyKCkge1xuXHRcdHJldHVybiB0aGlzLm9TaGVsbENvbnRhaW5lci5jcmVhdGVSZW5kZXJlcigpO1xuXHR9XG5cblx0LyoqXG5cdCAqIFdpbGwgY2FsbCBnZXRVc2VyIG1ldGhvZCBvZiB1c2hlbGwgY29udGFpbmVyLlxuXHQgKlxuXHQgKiBAcHJpdmF0ZVxuXHQgKiBAdWk1LXJlc3RyaWN0ZWRcblx0ICogQHJldHVybnMge29iamVjdH0gUmV0dXJucyBVc2VyIG9iamVjdFxuXHQgKi9cblx0Z2V0VXNlcigpIHtcblx0XHRyZXR1cm4gdGhpcy5vU2hlbGxDb250YWluZXIuZ2V0VXNlcigpO1xuXHR9XG5cblx0LyoqXG5cdCAqIFdpbGwgY2hlY2sgaWYgdXNoZWxsIGNvbnRhaW5lciBpcyBhdmFpbGFibGUgb3Igbm90LlxuXHQgKlxuXHQgKiBAcHJpdmF0ZVxuXHQgKiBAdWk1LXJlc3RyaWN0ZWRcblx0ICogQHJldHVybnMge2Jvb2xlYW59IFJldHVybnMgdHJ1ZVxuXHQgKi9cblx0aGFzVVNoZWxsKCkge1xuXHRcdHJldHVybiB0cnVlO1xuXHR9XG5cblx0LyoqXG5cdCAqIFdpbGwgY2FsbCByZWdpc3Rlck5hdmlnYXRpb25GaWx0ZXIgbWV0aG9kIG9mIHNoZWxsTmF2aWdhdGlvbi5cblx0ICpcblx0ICogQHBhcmFtIHtGdW5jdGlvbn0gZm5OYXZGaWx0ZXIgVGhlIGZpbHRlciBmdW5jdGlvbiB0byByZWdpc3RlclxuXHQgKiBAcmV0dXJucyB7dm9pZH1cblx0ICogQHByaXZhdGVcblx0ICogQHVpNS1yZXN0cmljdGVkXG5cdCAqL1xuXHRyZWdpc3Rlck5hdmlnYXRpb25GaWx0ZXIoZm5OYXZGaWx0ZXI6IEZ1bmN0aW9uKSB7XG5cdFx0dGhpcy5zaGVsbE5hdmlnYXRpb24ucmVnaXN0ZXJOYXZpZ2F0aW9uRmlsdGVyKGZuTmF2RmlsdGVyKTtcblx0fVxuXG5cdC8qKlxuXHQgKiBXaWxsIGNhbGwgdW5yZWdpc3Rlck5hdmlnYXRpb25GaWx0ZXIgbWV0aG9kIG9mIHNoZWxsTmF2aWdhdGlvbi5cblx0ICpcblx0ICogQHBhcmFtIHtGdW5jdGlvbn0gZm5OYXZGaWx0ZXIgVGhlIGZpbHRlciBmdW5jdGlvbiB0byB1bnJlZ2lzdGVyXG5cdCAqIEByZXR1cm5zIHt2b2lkfVxuXHQgKiBAcHJpdmF0ZVxuXHQgKiBAdWk1LXJlc3RyaWN0ZWRcblx0ICovXG5cdHVucmVnaXN0ZXJOYXZpZ2F0aW9uRmlsdGVyKGZuTmF2RmlsdGVyOiBGdW5jdGlvbikge1xuXHRcdHRoaXMuc2hlbGxOYXZpZ2F0aW9uLnVucmVnaXN0ZXJOYXZpZ2F0aW9uRmlsdGVyKGZuTmF2RmlsdGVyKTtcblx0fVxuXG5cdC8qKlxuXHQgKiBXaWxsIGNhbGwgc2V0QmFja05hdmlnYXRpb24gbWV0aG9kIG9mIFNoZWxsVUlTZXJ2aWNlXG5cdCAqIHRoYXQgZGlzcGxheXMgdGhlIGJhY2sgYnV0dG9uIGluIHRoZSBzaGVsbCBoZWFkZXIuXG5cdCAqXG5cdCAqIEBwYXJhbSB7RnVuY3Rpb259IFtmbkNhbGxCYWNrXSBBIGNhbGxiYWNrIGZ1bmN0aW9uIGNhbGxlZCB3aGVuIHRoZSBidXR0b24gaXMgY2xpY2tlZCBpbiB0aGUgVUkuXG5cdCAqIEByZXR1cm5zIHt2b2lkfVxuXHQgKiBAcHJpdmF0ZVxuXHQgKiBAdWk1LXJlc3RyaWN0ZWRcblx0ICovXG5cdHNldEJhY2tOYXZpZ2F0aW9uKGZuQ2FsbEJhY2s/OiBGdW5jdGlvbik6IHZvaWQge1xuXHRcdHRoaXMuc2hlbGxVSVNlcnZpY2Uuc2V0QmFja05hdmlnYXRpb24oZm5DYWxsQmFjayk7XG5cdH1cblxuXHQvKipcblx0ICogV2lsbCBjYWxsIHNldEhpZXJhcmNoeSBtZXRob2Qgb2YgU2hlbGxVSVNlcnZpY2Vcblx0ICogdGhhdCBkaXNwbGF5cyB0aGUgZ2l2ZW4gaGllcmFyY2h5IGluIHRoZSBzaGVsbCBoZWFkZXIuXG5cdCAqXG5cdCAqIEBwYXJhbSB7b2JqZWN0W119IFthSGllcmFyY2h5TGV2ZWxzXSBBbiBhcnJheSByZXByZXNlbnRpbmcgaGllcmFyY2hpZXMgb2YgdGhlIGN1cnJlbnRseSBkaXNwbGF5ZWQgYXBwLlxuXHQgKiBAcmV0dXJucyB7dm9pZH1cblx0ICogQHByaXZhdGVcblx0ICogQHVpNS1yZXN0cmljdGVkXG5cdCAqL1xuXHRzZXRIaWVyYXJjaHkoYUhpZXJhcmNoeUxldmVsczogQXJyYXk8b2JqZWN0Pik6IHZvaWQge1xuXHRcdHRoaXMuc2hlbGxVSVNlcnZpY2Uuc2V0SGllcmFyY2h5KGFIaWVyYXJjaHlMZXZlbHMpO1xuXHR9XG5cblx0LyoqXG5cdCAqIFdpbGwgY2FsbCBzZXRUaXRsZSBtZXRob2Qgb2YgU2hlbGxVSVNlcnZpY2Vcblx0ICogdGhhdCBkaXNwbGF5cyB0aGUgZ2l2ZW4gdGl0bGUgaW4gdGhlIHNoZWxsIGhlYWRlci5cblx0ICpcblx0ICogQHBhcmFtIHtzdHJpbmd9IFtzVGl0bGVdIFRoZSBuZXcgdGl0bGUuIFRoZSBkZWZhdWx0IHRpdGxlIGlzIHNldCBpZiB0aGlzIGFyZ3VtZW50IGlzIG5vdCBnaXZlbi5cblx0ICogQHJldHVybnMge3ZvaWR9XG5cdCAqIEBwcml2YXRlXG5cdCAqIEB1aTUtcmVzdHJpY3RlZFxuXHQgKi9cblx0c2V0VGl0bGUoc1RpdGxlOiBzdHJpbmcpOiB2b2lkIHtcblx0XHR0aGlzLnNoZWxsVUlTZXJ2aWNlLnNldFRpdGxlKHNUaXRsZSk7XG5cdH1cblxuXHQvKipcblx0ICogUmV0cmlldmVzIHRoZSBjdXJyZW50bHkgZGVmaW5lZCBjb250ZW50IGRlbnNpdHkuXG5cdCAqXG5cdCAqIEByZXR1cm5zIHtzdHJpbmd9IFRoZSBjb250ZW50IGRlbnNpdHkgdmFsdWVcblx0ICovXG5cdGdldENvbnRlbnREZW5zaXR5KCk6IHN0cmluZyB7XG5cdFx0cmV0dXJuICh0aGlzLm9TaGVsbENvbnRhaW5lci5nZXRVc2VyKCkgYXMgYW55KS5nZXRDb250ZW50RGVuc2l0eSgpO1xuXHR9XG59XG5cbi8qKlxuICogU2VydmljZSBGYWN0b3J5IGZvciB0aGUgU2hlbGxTZXJ2aWNlc1xuICpcbiAqIEBwcml2YXRlXG4gKi9cbmNsYXNzIFNoZWxsU2VydmljZXNGYWN0b3J5IGV4dGVuZHMgU2VydmljZUZhY3Rvcnk8U2hlbGxTZXJ2aWNlc1NldHRpbmdzPiB7XG5cdC8qKlxuXHQgKiBDcmVhdGVzIGVpdGhlciBhIHN0YW5kYXJkIG9yIGEgbW9jayBTaGVsbCBzZXJ2aWNlIGRlcGVuZGluZyBvbiB0aGUgY29uZmlndXJhdGlvbi5cblx0ICpcblx0ICogQHBhcmFtIHtTZXJ2aWNlQ29udGV4dDxTaGVsbFNlcnZpY2VzU2V0dGluZ3M+fSBvU2VydmljZUNvbnRleHQgVGhlIHNoZWxsc2VydmljZSBjb250ZXh0XG5cdCAqIEByZXR1cm5zIHtQcm9taXNlPElTaGVsbFNlcnZpY2VzPn0gQSBwcm9taXNlIGZvciBhIHNoZWxsIHNlcnZpY2UgaW1wbGVtZW50YXRpb25cblx0ICogQHNlZSBTZXJ2aWNlRmFjdG9yeSNjcmVhdGVJbnN0YW5jZVxuXHQgKi9cblx0Y3JlYXRlSW5zdGFuY2Uob1NlcnZpY2VDb250ZXh0OiBTZXJ2aWNlQ29udGV4dDxTaGVsbFNlcnZpY2VzU2V0dGluZ3M+KTogUHJvbWlzZTxJU2hlbGxTZXJ2aWNlcz4ge1xuXHRcdG9TZXJ2aWNlQ29udGV4dC5zZXR0aW5ncy5zaGVsbENvbnRhaW5lciA9IHNhcC51c2hlbGwgJiYgKHNhcC51c2hlbGwuQ29udGFpbmVyIGFzIENvbnRhaW5lcik7XG5cdFx0Y29uc3Qgb1NoZWxsU2VydmljZSA9IG9TZXJ2aWNlQ29udGV4dC5zZXR0aW5ncy5zaGVsbENvbnRhaW5lclxuXHRcdFx0PyBuZXcgU2hlbGxTZXJ2aWNlcyhvU2VydmljZUNvbnRleHQgYXMgU2VydmljZUNvbnRleHQ8UmVxdWlyZWQ8U2hlbGxTZXJ2aWNlc1NldHRpbmdzPj4pXG5cdFx0XHQ6IG5ldyBTaGVsbFNlcnZpY2VNb2NrKG9TZXJ2aWNlQ29udGV4dCk7XG5cdFx0cmV0dXJuIG9TaGVsbFNlcnZpY2UuaW5pdFByb21pc2UudGhlbigoKSA9PiB7XG5cdFx0XHQvLyBFbnJpY2ggdGhlIGFwcENvbXBvbmVudCB3aXRoIHRoaXMgbWV0aG9kXG5cdFx0XHQob1NlcnZpY2VDb250ZXh0LnNjb3BlT2JqZWN0IGFzIGFueSkuZ2V0U2hlbGxTZXJ2aWNlcyA9ICgpID0+IG9TaGVsbFNlcnZpY2U7XG5cdFx0XHRyZXR1cm4gb1NoZWxsU2VydmljZTtcblx0XHR9KTtcblx0fVxufVxuXG5leHBvcnQgZGVmYXVsdCBTaGVsbFNlcnZpY2VzRmFjdG9yeTtcbiJdfQ==