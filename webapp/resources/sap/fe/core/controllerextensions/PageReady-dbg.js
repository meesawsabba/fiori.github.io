/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)
 *      (c) Copyright 2009-2021 SAP SE. All rights reserved
 */
sap.ui.define(["sap/ui/core/mvc/ControllerExtension", "sap/ui/core/mvc/OverrideExecution", "sap/fe/core/controllerextensions/ControllerExtensionMetadata", "sap/ui/core/Component", "sap/fe/core/CommonUtils", "sap/ui/base/EventProvider", "sap/base/Log", "../helpers/ClassSupport", "sap/fe/core/services/TemplatedViewServiceFactory"], function (ControllerExtension, OverrideExecution, ControllerExtensionMetadata, Component, CommonUtils, EventProvider, Log, ClassSupport, TemplatedViewServiceFactory) {
  "use strict";

  var _dec, _dec2, _dec3, _dec4, _dec5, _dec6, _dec7, _class, _class2;

  var Private = ClassSupport.Private;
  var Extensible = ClassSupport.Extensible;
  var Final = ClassSupport.Final;
  var Public = ClassSupport.Public;
  var Override = ClassSupport.Override;
  var UI5Class = ClassSupport.UI5Class;

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

  function _applyDecoratedDescriptor(target, property, decorators, descriptor, context) { var desc = {}; Object.keys(descriptor).forEach(function (key) { desc[key] = descriptor[key]; }); desc.enumerable = !!desc.enumerable; desc.configurable = !!desc.configurable; if ('value' in desc || desc.initializer) { desc.writable = true; } desc = decorators.slice().reverse().reduce(function (desc, decorator) { return decorator(target, property, desc) || desc; }, desc); if (context && desc.initializer !== void 0) { desc.value = desc.initializer ? desc.initializer.call(context) : void 0; desc.initializer = undefined; } if (desc.initializer === void 0) { Object.defineProperty(target, property, desc); desc = null; } return desc; }

  var PageReadyControllerExtension = (_dec = UI5Class("sap.fe.core.controllerextensions.PageReady", ControllerExtensionMetadata), _dec2 = Override(), _dec3 = Override(), _dec4 = Override("_routing"), _dec5 = Override("_routing"), _dec6 = Override("_routing"), _dec7 = Extensible(OverrideExecution.Instead), _dec(_class = (_class2 = /*#__PURE__*/function (_ControllerExtension) {
    _inherits(PageReadyControllerExtension, _ControllerExtension);

    var _super = _createSuper(PageReadyControllerExtension);

    function PageReadyControllerExtension() {
      _classCallCheck(this, PageReadyControllerExtension);

      return _super.apply(this, arguments);
    }

    _createClass(PageReadyControllerExtension, [{
      key: "onInit",
      value: function onInit() {
        var _this = this;

        this._nbWaits = 0;
        this._bSeachTriggered = false;
        this._oEventProvider = this._oEventProvider ? this._oEventProvider : new EventProvider();
        this._oView = this.base.getView();
        this._oAppComponent = CommonUtils.getAppComponent(this._oView);
        this._oPageComponent = Component.getOwnerComponentFor(this._oView);

        if (this._oPageComponent && this._oPageComponent.attachContainerDefined) {
          this._oPageComponent.attachContainerDefined(function (oEvent) {
            return _this.registerContainer(oEvent.getParameter("container"));
          });
        } else {
          this.registerContainer(this._oView);
        }

        var oPlaceholder = this._oAppComponent.getRootControl().getController().getPlaceholder();

        if (oPlaceholder.isPlaceholderDebugEnabled()) {
          this.attachEvent("pageReady", null, function () {
            oPlaceholder.getPlaceholderDebugStats().iPageReadyEventTimestamp = Date.now();
          }, this);
          this.attachEvent("heroesBatchReceived", null, function () {
            oPlaceholder.getPlaceholderDebugStats().iHeroesBatchReceivedEventTimestamp = Date.now();
          }, this);
        }
      }
    }, {
      key: "onExit",
      value: function onExit() {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        delete this._oAppComponent;
        this._oContainer && this._oContainer.removeEventDelegate(this._fnContainerDelegate);
      }
    }, {
      key: "waitFor",
      value: function waitFor(oPromise) {
        var _this2 = this;

        this._nbWaits++;
        oPromise.finally(function () {
          setTimeout(function () {
            _this2._nbWaits--;
          }, 0);
        }).catch(null);
      }
    }, {
      key: "onRouteMatched",
      value: function onRouteMatched() {
        this._bIsPageReady = false;
      }
    }, {
      key: "onRouteMatchedFinished",
      value: function onRouteMatchedFinished() {
        this.checkPageReadyDebounced();
      }
    }, {
      key: "onAfterBinding",
      value: function onAfterBinding(oBindingContext) {
        var _this3 = this;

        if (!this._bAfterBindingAlreadyApplied) {
          this._bAfterBindingAlreadyApplied = true;
          var aBoundElements = [];
          var aNotBoundMDCTables = [];
          var iRequested = 0;
          var iReceived = 0;

          var fnRequested = function (oEvent) {
            oEvent.getSource().detachDataRequested(fnRequested);
            iRequested++;
            _this3.bDataReceived = false;
          };

          var fnReceived = function (oEvent) {
            switch (oEvent.getSource().sGroupId) {
              case "$auto.Workers":
                _this3._oEventProvider.fireEvent("workersBatchReceived");

                break;

              case "$auto.Heroes":
                _this3._oEventProvider.fireEvent("heroesBatchReceived");

                break;

              default:
            }

            oEvent.getSource().detachDataReceived(fnReceived);
            iReceived++;

            if (iReceived >= iRequested && iRequested !== 0) {
              iRequested = 0;
              iReceived = 0;
              _this3.bDataReceived = true;

              _this3.checkPageReadyDebounced();
            }
          };

          var fnSearch = function (oEvent) {
            var aMDCTables = aNotBoundMDCTables.filter(function (oElem) {
              if (oEvent.getSource().sId === oElem.getFilter() && oElem.getVisible()) {
                return true;
              }

              return false;
            });

            if (aMDCTables.length > 0) {
              _this3._bSeachTriggered = true;
            }

            aMDCTables.forEach(function (oMDCTable) {
              var oRowBinding = oMDCTable.getRowBinding();

              var fnAttachDataEvents = function () {
                oRowBinding.attachDataRequested(fnRequested);
                oRowBinding.attachDataReceived(function (oEvent) {
                  fnReceived(oEvent);
                  _this3._bSeachTriggered = false;
                });
                aBoundElements.push(oRowBinding);
              };

              if (oRowBinding) {
                fnAttachDataEvents();
              } else {
                oMDCTable.attachEventOnce("bindingUpdated", null, function () {
                  oRowBinding = oMDCTable.getRowBinding();
                  fnAttachDataEvents();
                }, null);
              }
            });
          };

          if (this.isContextExpected() && oBindingContext === undefined) {
            // Force to mention we are expecting data
            this.bHasContext = false;
            return;
          } else {
            this.bHasContext = true;
          }

          this.attachEventOnce("pageReady", null, function () {
            aBoundElements.forEach(function (oElement) {
              oElement.detachEvent("dataRequested", fnRequested);
              oElement.detachEvent("dataReceived", fnReceived);
              oElement.detachEvent("search", fnSearch);
            });
            _this3._bAfterBindingAlreadyApplied = false;
            aBoundElements = [];
          }, null);

          if (oBindingContext) {
            var mainObjectBinding = oBindingContext.getBinding();
            mainObjectBinding.attachDataRequested(fnRequested);
            mainObjectBinding.attachDataReceived(fnReceived);
            aBoundElements.push(mainObjectBinding);
          }

          var aTableInitializedPromises = [];

          this._oView.findAggregatedObjects(true, function (oElement) {
            var oObjectBinding = oElement.getObjectBinding();

            if (oObjectBinding) {
              // Register on all object binding (mostly used on object pages)
              oObjectBinding.attachDataRequested(fnRequested);
              oObjectBinding.attachDataReceived(fnReceived);
              aBoundElements.push(oObjectBinding);
            } else {
              var aBindingKeys = Object.keys(oElement.mBindingInfos);

              if (aBindingKeys.length > 0) {
                aBindingKeys.forEach(function (sPropertyName) {
                  var oListBinding = oElement.mBindingInfos[sPropertyName].binding; // Register on all list binding, good for basic tables, problematic for MDC, see above

                  if (oListBinding && oListBinding.isA("sap.ui.model.odata.v4.ODataListBinding")) {
                    oListBinding.attachDataRequested(fnRequested);
                    oListBinding.attachDataReceived(fnReceived);
                    aBoundElements.push(oListBinding);
                  }
                });
              }
            } // This is dirty but MDC Table has a weird loading lifecycle


            if (oElement.isA("sap.ui.mdc.Table")) {
              _this3.bTablesLoaded = false; // access binding only after table is bound

              aTableInitializedPromises.push(oElement.initialized().then(function () {
                var oRowBinding = oElement.getRowBinding();

                if (oRowBinding) {
                  oRowBinding.attachDataRequested(fnRequested);
                  oRowBinding.attachDataReceived(fnReceived);
                  aBoundElements.push(oRowBinding);
                } else {
                  aNotBoundMDCTables.push(oElement);
                }
              }).catch(function (oError) {
                Log.error("Cannot find a bound table", oError);
              }));
            } else if (oElement.isA("sap.fe.core.controls.FilterBar")) {
              oElement.attachEvent("search", fnSearch);
              aBoundElements.push(oElement);
            }
          });

          if (aTableInitializedPromises.length > 0) {
            Promise.all(aTableInitializedPromises).then(function () {
              _this3.bTablesLoaded = true;

              _this3.checkPageReadyDebounced();
            }).catch(function (oError) {
              Log.info("There was an error with one or multiple table", oError);
              _this3.bTablesLoaded = true;

              _this3.checkPageReadyDebounced();
            });
          }
        }
      }
    }, {
      key: "isPageReady",
      value: function isPageReady() {
        return this._bIsPageReady;
      }
    }, {
      key: "waitPageReady",
      value: function waitPageReady() {
        var _this4 = this;

        return new Promise(function (resolve) {
          if (_this4.isPageReady()) {
            resolve();
          } else {
            _this4.attachEventOnce("pageReady", null, function () {
              resolve();
            }, _this4);
          }
        });
      }
    }, {
      key: "attachEventOnce",
      value: function attachEventOnce(sEventId, oData, fnFunction, oListener) {
        // eslint-disable-next-line prefer-rest-params
        return this._oEventProvider.attachEventOnce(sEventId, oData, fnFunction, oListener);
      }
    }, {
      key: "attachEvent",
      value: function attachEvent(sEventId, oData, fnFunction, oListener) {
        // eslint-disable-next-line prefer-rest-params
        return this._oEventProvider.attachEvent(sEventId, oData, fnFunction, oListener);
      }
    }, {
      key: "detachEvent",
      value: function detachEvent(sEventId, fnFunction) {
        // eslint-disable-next-line prefer-rest-params
        return this._oEventProvider.detachEvent(sEventId, fnFunction);
      }
    }, {
      key: "registerContainer",
      value: function registerContainer(oContainer) {
        var _this5 = this;

        this._oContainer = oContainer;
        this._fnContainerDelegate = {
          onBeforeShow: function () {
            _this5.bShown = false;
            _this5._bIsPageReady = false;
          },
          onBeforeHide: function () {
            _this5.bShown = false;
            _this5._bIsPageReady = false;
          },
          onAfterShow: function () {
            _this5.bShown = true;

            _this5._checkPageReady(true);
          }
        };

        this._oContainer.addEventDelegate(this._fnContainerDelegate);
      }
    }, {
      key: "isContextExpected",
      value: function isContextExpected() {
        return false;
      }
    }, {
      key: "checkPageReadyDebounced",
      value: function checkPageReadyDebounced() {
        var _this6 = this;

        if (this.pageReadyTimer) {
          clearTimeout(this.pageReadyTimer);
        }

        this.pageReadyTimer = setTimeout(function () {
          _this6._checkPageReady();
        }, 200);
      }
    }, {
      key: "_checkPageReady",
      value: function _checkPageReady() {
        var _this7 = this;

        var bFromNav = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : false;

        var fnUIUpdated = function () {
          // Wait until the UI is no longer dirty
          if (!sap.ui.getCore().getUIDirty()) {
            sap.ui.getCore().detachEvent("UIUpdated", fnUIUpdated);
            _this7._bWaitingForRefresh = false;
            setTimeout(function () {
              _this7._checkPageReady();
            }, 20);
          }
        }; // In case UIUpdate does not get called, check if UI is not dirty and then call _checkPageReady


        var checkUIUpdated = function () {
          if (sap.ui.getCore().getUIDirty()) {
            setTimeout(checkUIUpdated, 500);
          } else if (_this7._bWaitingForRefresh) {
            _this7._bWaitingForRefresh = false;
            sap.ui.getCore().detachEvent("UIUpdated", fnUIUpdated);

            _this7._checkPageReady();
          }
        };

        if (this.bShown && this.bDataReceived !== false && this.bTablesLoaded !== false && (!this.isContextExpected() || this.bHasContext) // Either no context is expected or there is one
        ) {
          if (this.bDataReceived === true && !bFromNav && !this._bWaitingForRefresh && sap.ui.getCore().getUIDirty()) {
            // If we requested data we get notified as soon as the data arrived, so before the next rendering tick
            this.bDataReceived = undefined;
            this._bWaitingForRefresh = true;
            sap.ui.getCore().attachEvent("UIUpdated", fnUIUpdated);
            setTimeout(checkUIUpdated, 500);
          } else if (!this._bWaitingForRefresh && sap.ui.getCore().getUIDirty() || this._nbWaits !== 0 || TemplatedViewServiceFactory.getNumberOfViewsInCreationState() > 0 || this._bSeachTriggered) {
            this._bWaitingForRefresh = true;
            sap.ui.getCore().attachEvent("UIUpdated", fnUIUpdated);
            setTimeout(checkUIUpdated, 500);
          } else if (!this._bWaitingForRefresh) {
            // In the case we're not waiting for any data (navigating back to a page we already have loaded)
            // just wait for a frame to fire the event.
            this._bIsPageReady = true;

            this._oEventProvider.fireEvent("pageReady");
          }
        }
      }
    }]);

    return PageReadyControllerExtension;
  }(ControllerExtension), (_applyDecoratedDescriptor(_class2.prototype, "onInit", [_dec2], Object.getOwnPropertyDescriptor(_class2.prototype, "onInit"), _class2.prototype), _applyDecoratedDescriptor(_class2.prototype, "onExit", [_dec3], Object.getOwnPropertyDescriptor(_class2.prototype, "onExit"), _class2.prototype), _applyDecoratedDescriptor(_class2.prototype, "waitFor", [Public, Final], Object.getOwnPropertyDescriptor(_class2.prototype, "waitFor"), _class2.prototype), _applyDecoratedDescriptor(_class2.prototype, "onRouteMatched", [_dec4], Object.getOwnPropertyDescriptor(_class2.prototype, "onRouteMatched"), _class2.prototype), _applyDecoratedDescriptor(_class2.prototype, "onRouteMatchedFinished", [_dec5], Object.getOwnPropertyDescriptor(_class2.prototype, "onRouteMatchedFinished"), _class2.prototype), _applyDecoratedDescriptor(_class2.prototype, "onAfterBinding", [_dec6], Object.getOwnPropertyDescriptor(_class2.prototype, "onAfterBinding"), _class2.prototype), _applyDecoratedDescriptor(_class2.prototype, "isPageReady", [Public, Final], Object.getOwnPropertyDescriptor(_class2.prototype, "isPageReady"), _class2.prototype), _applyDecoratedDescriptor(_class2.prototype, "waitPageReady", [Public, Final], Object.getOwnPropertyDescriptor(_class2.prototype, "waitPageReady"), _class2.prototype), _applyDecoratedDescriptor(_class2.prototype, "attachEventOnce", [Public, Final], Object.getOwnPropertyDescriptor(_class2.prototype, "attachEventOnce"), _class2.prototype), _applyDecoratedDescriptor(_class2.prototype, "attachEvent", [Public, Final], Object.getOwnPropertyDescriptor(_class2.prototype, "attachEvent"), _class2.prototype), _applyDecoratedDescriptor(_class2.prototype, "detachEvent", [Public, Final], Object.getOwnPropertyDescriptor(_class2.prototype, "detachEvent"), _class2.prototype), _applyDecoratedDescriptor(_class2.prototype, "isContextExpected", [Private, _dec7], Object.getOwnPropertyDescriptor(_class2.prototype, "isContextExpected"), _class2.prototype)), _class2)) || _class);
  return PageReadyControllerExtension;
}, false);
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIlBhZ2VSZWFkeS50cyJdLCJuYW1lcyI6WyJQYWdlUmVhZHlDb250cm9sbGVyRXh0ZW5zaW9uIiwiVUk1Q2xhc3MiLCJDb250cm9sbGVyRXh0ZW5zaW9uTWV0YWRhdGEiLCJPdmVycmlkZSIsIkV4dGVuc2libGUiLCJPdmVycmlkZUV4ZWN1dGlvbiIsIkluc3RlYWQiLCJfbmJXYWl0cyIsIl9iU2VhY2hUcmlnZ2VyZWQiLCJfb0V2ZW50UHJvdmlkZXIiLCJFdmVudFByb3ZpZGVyIiwiX29WaWV3IiwiYmFzZSIsImdldFZpZXciLCJfb0FwcENvbXBvbmVudCIsIkNvbW1vblV0aWxzIiwiZ2V0QXBwQ29tcG9uZW50IiwiX29QYWdlQ29tcG9uZW50IiwiQ29tcG9uZW50IiwiZ2V0T3duZXJDb21wb25lbnRGb3IiLCJhdHRhY2hDb250YWluZXJEZWZpbmVkIiwib0V2ZW50IiwicmVnaXN0ZXJDb250YWluZXIiLCJnZXRQYXJhbWV0ZXIiLCJvUGxhY2Vob2xkZXIiLCJnZXRSb290Q29udHJvbCIsImdldENvbnRyb2xsZXIiLCJnZXRQbGFjZWhvbGRlciIsImlzUGxhY2Vob2xkZXJEZWJ1Z0VuYWJsZWQiLCJhdHRhY2hFdmVudCIsImdldFBsYWNlaG9sZGVyRGVidWdTdGF0cyIsImlQYWdlUmVhZHlFdmVudFRpbWVzdGFtcCIsIkRhdGUiLCJub3ciLCJpSGVyb2VzQmF0Y2hSZWNlaXZlZEV2ZW50VGltZXN0YW1wIiwiX29Db250YWluZXIiLCJyZW1vdmVFdmVudERlbGVnYXRlIiwiX2ZuQ29udGFpbmVyRGVsZWdhdGUiLCJvUHJvbWlzZSIsImZpbmFsbHkiLCJzZXRUaW1lb3V0IiwiY2F0Y2giLCJfYklzUGFnZVJlYWR5IiwiY2hlY2tQYWdlUmVhZHlEZWJvdW5jZWQiLCJvQmluZGluZ0NvbnRleHQiLCJfYkFmdGVyQmluZGluZ0FscmVhZHlBcHBsaWVkIiwiYUJvdW5kRWxlbWVudHMiLCJhTm90Qm91bmRNRENUYWJsZXMiLCJpUmVxdWVzdGVkIiwiaVJlY2VpdmVkIiwiZm5SZXF1ZXN0ZWQiLCJnZXRTb3VyY2UiLCJkZXRhY2hEYXRhUmVxdWVzdGVkIiwiYkRhdGFSZWNlaXZlZCIsImZuUmVjZWl2ZWQiLCJzR3JvdXBJZCIsImZpcmVFdmVudCIsImRldGFjaERhdGFSZWNlaXZlZCIsImZuU2VhcmNoIiwiYU1EQ1RhYmxlcyIsImZpbHRlciIsIm9FbGVtIiwic0lkIiwiZ2V0RmlsdGVyIiwiZ2V0VmlzaWJsZSIsImxlbmd0aCIsImZvckVhY2giLCJvTURDVGFibGUiLCJvUm93QmluZGluZyIsImdldFJvd0JpbmRpbmciLCJmbkF0dGFjaERhdGFFdmVudHMiLCJhdHRhY2hEYXRhUmVxdWVzdGVkIiwiYXR0YWNoRGF0YVJlY2VpdmVkIiwicHVzaCIsImF0dGFjaEV2ZW50T25jZSIsImlzQ29udGV4dEV4cGVjdGVkIiwidW5kZWZpbmVkIiwiYkhhc0NvbnRleHQiLCJvRWxlbWVudCIsImRldGFjaEV2ZW50IiwibWFpbk9iamVjdEJpbmRpbmciLCJnZXRCaW5kaW5nIiwiYVRhYmxlSW5pdGlhbGl6ZWRQcm9taXNlcyIsImZpbmRBZ2dyZWdhdGVkT2JqZWN0cyIsIm9PYmplY3RCaW5kaW5nIiwiZ2V0T2JqZWN0QmluZGluZyIsImFCaW5kaW5nS2V5cyIsIk9iamVjdCIsImtleXMiLCJtQmluZGluZ0luZm9zIiwic1Byb3BlcnR5TmFtZSIsIm9MaXN0QmluZGluZyIsImJpbmRpbmciLCJpc0EiLCJiVGFibGVzTG9hZGVkIiwiaW5pdGlhbGl6ZWQiLCJ0aGVuIiwib0Vycm9yIiwiTG9nIiwiZXJyb3IiLCJQcm9taXNlIiwiYWxsIiwiaW5mbyIsInJlc29sdmUiLCJpc1BhZ2VSZWFkeSIsInNFdmVudElkIiwib0RhdGEiLCJmbkZ1bmN0aW9uIiwib0xpc3RlbmVyIiwib0NvbnRhaW5lciIsIm9uQmVmb3JlU2hvdyIsImJTaG93biIsIm9uQmVmb3JlSGlkZSIsIm9uQWZ0ZXJTaG93IiwiX2NoZWNrUGFnZVJlYWR5IiwiYWRkRXZlbnREZWxlZ2F0ZSIsInBhZ2VSZWFkeVRpbWVyIiwiY2xlYXJUaW1lb3V0IiwiYkZyb21OYXYiLCJmblVJVXBkYXRlZCIsInNhcCIsInVpIiwiZ2V0Q29yZSIsImdldFVJRGlydHkiLCJfYldhaXRpbmdGb3JSZWZyZXNoIiwiY2hlY2tVSVVwZGF0ZWQiLCJUZW1wbGF0ZWRWaWV3U2VydmljZUZhY3RvcnkiLCJnZXROdW1iZXJPZlZpZXdzSW5DcmVhdGlvblN0YXRlIiwiQ29udHJvbGxlckV4dGVuc2lvbiIsIlB1YmxpYyIsIkZpbmFsIiwiUHJpdmF0ZSJdLCJtYXBwaW5ncyI6IjtBQUFBO0FBQ0E7QUFDQTs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7TUFTTUEsNEIsV0FETEMsUUFBUSxDQUFDLDRDQUFELEVBQStDQywyQkFBL0MsQyxVQW1CUEMsUUFBUSxFLFVBb0NSQSxRQUFRLEUsVUFvQlJBLFFBQVEsQ0FBQyxVQUFELEMsVUFJUkEsUUFBUSxDQUFDLFVBQUQsQyxVQUtSQSxRQUFRLENBQUMsVUFBRCxDLFVBOE5SQyxVQUFVLENBQUNDLGlCQUFpQixDQUFDQyxPQUFuQixDOzs7Ozs7Ozs7Ozs7O2FBL1JYLGtCQUNnQjtBQUFBOztBQUNmLGFBQUtDLFFBQUwsR0FBZ0IsQ0FBaEI7QUFDQSxhQUFLQyxnQkFBTCxHQUF3QixLQUF4QjtBQUNBLGFBQUtDLGVBQUwsR0FBdUIsS0FBS0EsZUFBTCxHQUF1QixLQUFLQSxlQUE1QixHQUE4QyxJQUFJQyxhQUFKLEVBQXJFO0FBQ0EsYUFBS0MsTUFBTCxHQUFlLElBQUQsQ0FBY0MsSUFBZCxDQUFtQkMsT0FBbkIsRUFBZDtBQUNBLGFBQUtDLGNBQUwsR0FBc0JDLFdBQVcsQ0FBQ0MsZUFBWixDQUE0QixLQUFLTCxNQUFqQyxDQUF0QjtBQUNBLGFBQUtNLGVBQUwsR0FBdUJDLFNBQVMsQ0FBQ0Msb0JBQVYsQ0FBK0IsS0FBS1IsTUFBcEMsQ0FBdkI7O0FBRUEsWUFBSSxLQUFLTSxlQUFMLElBQXdCLEtBQUtBLGVBQUwsQ0FBcUJHLHNCQUFqRCxFQUF5RTtBQUN4RSxlQUFLSCxlQUFMLENBQXFC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QWlCN0YsV0FBakIsQ0FBNkIsV0FBN0IsRUFBMEMwRixXQUExQztBQUNBL0UsWUFBQUEsVUFBVSxDQUFDcUYsY0FBRCxFQUFpQixHQUFqQixDQUFWO0FBQ0EsV0FORCxNQU1PLElBQ0wsQ0FBQyxLQUFLRCxtQkFBTixJQUE2QkosR0FBRyxDQUFDQyxFQUFKLENBQU9DLE9BQVAsR0FBaUJDLFVBQWpCLEVBQTlCLElBQ0EsS0FBS3BILFFBQUwsS0FBa0IsQ0FEbEIsSUFFQXVILDJCQUEyQixDQUFDQywrQkFBNUIsS0FBZ0UsQ0FGaEUsSUFHQSxLQUFLdkgsZ0JBSkMsRUFLTDtBQUNELGlCQUFLb0gsbUJBQUwsR0FBMkIsSUFBM0I7QUFDQUosWUFBQUEsR0FBRyxDQUFDQyxFQUFKLENBQU9DLE9BQVAsR0FBaUI3RixXQUFqQixDQUE2QixXQUE3QixFQUEwQzBGLFdBQTFDO0FBQ0EvRSxZQUFBQSxVQUFVLENBQUNxRixjQUFELEVBQWlCLEdBQWpCLENBQVY7QUFDQSxXQVRNLE1BU0EsSUFBSSxDQUFDLEtBQUtELG1CQUFWLEVBQStCO0FBQ3JDO0FBQ0E7QUFDQSxpQkFBS2xGLGFBQUwsR0FBcUIsSUFBckI7O0FBQ0EsaUJBQUtqQyxlQUFMLENBQXFCK0MsU0FBckIsQ0FBK0IsV0FBL0I7QUFDQTtBQUNEO0FBQ0Q7Ozs7SUFsWHlDd0UsbUIsaVdBOER6Q0MsTSxFQUNBQyxLLHlvQkFtTEFELE0sRUFDQUMsSyx5SkFLQUQsTSxFQUNBQyxLLDZKQWtCQUQsTSxFQUNBQyxLLDJKQUtBRCxNLEVBQ0FDLEssdUpBS0FELE0sRUFDQUMsSyw2SkF3QkFDLE87U0FxRWFuSSw0QiIsInNvdXJjZVJvb3QiOiIuIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgQ29udHJvbGxlckV4dGVuc2lvbiwgT3ZlcnJpZGVFeGVjdXRpb24sIFZpZXcgfSBmcm9tIFwic2FwL3VpL2NvcmUvbXZjXCI7XG5pbXBvcnQgeyBDb250cm9sbGVyRXh0ZW5zaW9uTWV0YWRhdGEgfSBmcm9tIFwic2FwL2ZlL2NvcmUvY29udHJvbGxlcmV4dGVuc2lvbnNcIjtcbmltcG9ydCB7IENvbXBvbmVudCB9IGZyb20gXCJzYXAvdWkvY29yZVwiO1xuaW1wb3J0IHsgQXBwQ29tcG9uZW50LCBDb21tb25VdGlscyB9IGZyb20gXCJzYXAvZmUvY29yZVwiO1xuaW1wb3J0IHsgTWFuYWdlZE9iamVjdCwgRXZlbnRQcm92aWRlciB9IGZyb20gXCJzYXAvdWkvYmFzZVwiO1xuaW1wb3J0IHsgTG9nIH0gZnJvbSBcInNhcC9iYXNlXCI7XG5pbXBvcnQgeyBDb250ZXh0IH0gZnJvbSBcInNhcC91aS9tb2RlbFwiO1xuaW1wb3J0IHsgVUk1Q2xhc3MsIE92ZXJyaWRlLCBQdWJsaWMsIEZpbmFsLCBFeHRlbnNpYmxlLCBQcml2YXRlIH0gZnJvbSBcIi4uL2hlbHBlcnMvQ2xhc3NTdXBwb3J0XCI7XG5pbXBvcnQgeyBUZW1wbGF0ZWRWaWV3U2VydmljZUZhY3RvcnkgfSBmcm9tIFwic2FwL2ZlL2NvcmUvc2VydmljZXNcIjtcblxuQFVJNUNsYXNzKFwic2FwLmZlLmNvcmUuY29udHJvbGxlcmV4dGVuc2lvbnMuUGFnZVJlYWR5XCIsIENvbnRyb2xsZXJFeHRlbnNpb25NZXRhZGF0YSlcbmNsYXNzIFBhZ2VSZWFkeUNvbnRyb2xsZXJFeHRlbnNpb24gZXh0ZW5kcyBDb250cm9sbGVyRXh0ZW5zaW9uIHtcblx0cHJpdmF0ZSBfb0V2ZW50UHJvdmlkZXIhOiBFdmVudFByb3ZpZGVyO1xuXHRwcml2YXRlIF9vVmlldzogYW55O1xuXHRwcml2YXRlIF9vQXBwQ29tcG9uZW50ITogQXBwQ29tcG9uZW50O1xuXHRwcml2YXRlIF9vUGFnZUNvbXBvbmVudCE6IGFueTtcblx0cHJpdmF0ZSBfb0NvbnRhaW5lciE6IGFueTtcblx0cHJpdmF0ZSBfYkFmdGVyQmluZGluZ0FscmVhZHlBcHBsaWVkITogYm9vbGVhbjtcblx0cHJpdmF0ZSBfZm5Db250YWluZXJEZWxlZ2F0ZTogYW55O1xuXHRwcml2YXRlIF9uYldhaXRzITogbnVtYmVyO1xuXHRwcml2YXRlIF9iU2VhY2hUcmlnZ2VyZWQhOiBib29sZWFuO1xuXHRwcml2YXRlIF9iSXNQYWdlUmVhZHkhOiBib29sZWFuO1xuXHRwcml2YXRlIF9iV2FpdGluZ0ZvclJlZnJlc2ghOiBib29sZWFuO1xuXHRwcml2YXRlIGJTaG93biE6IGJvb2xlYW47XG5cdHByaXZhdGUgYkhhc0NvbnRleHQhOiBib29sZWFuO1xuXHRwcml2YXRlIGJEYXRhUmVjZWl2ZWQ6IGJvb2xlYW4gfCB1bmRlZmluZWQ7XG5cdHByaXZhdGUgYlRhYmxlc0xvYWRlZDogYm9vbGVhbiB8IHVuZGVmaW5lZDtcblx0cHJpdmF0ZSBwYWdlUmVhZHlUaW1lcjogTm9kZUpTLlRpbWVvdXQgfCB1bmRlZmluZWQ7XG5cblx0QE92ZXJyaWRlKClcblx0cHVibGljIG9uSW5pdCgpIHtcblx0XHR0aGlzLl9uYldhaXRzID0gMDtcblx0XHR0aGlzLl9iU2VhY2hUcmlnZ2VyZWQgPSBmYWxzZTtcblx0XHR0aGlzLl9vRXZlbnRQcm92aWRlciA9IHRoaXMuX29FdmVudFByb3ZpZGVyID8gdGhpcy5fb0V2ZW50UHJvdmlkZXIgOiBuZXcgRXZlbnRQcm92aWRlcigpO1xuXHRcdHRoaXMuX29WaWV3ID0gKHRoaXMgYXMgYW55KS5iYXNlLmdldFZpZXcoKTtcblx0XHR0aGlzLl9vQXBwQ29tcG9uZW50ID0gQ29tbW9uVXRpbHMuZ2V0QXBwQ29tcG9uZW50KHRoaXMuX29WaWV3KTtcblx0XHR0aGlzLl9vUGFnZUNvbXBvbmVudCA9IENvbXBvbmVudC5nZXRPd25lckNvbXBvbmVudEZvcih0aGlzLl9vVmlldyk7XG5cblx0XHRpZiAodGhpcy5fb1BhZ2VDb21wb25lbnQgJiYgdGhpcy5fb1BhZ2VDb21wb25lbnQuYXR0YWNoQ29udGFpbmVyRGVmaW5lZCkge1xuXHRcdFx0dGhpcy5fb1BhZ2VDb21wb25lbnQuYXR0YWNoQ29udGFpbmVyRGVmaW5lZCgob0V2ZW50OiBVSTVFdmVudCkgPT4gdGhpcy5yZWdpc3RlckNvbnRhaW5lcihvRXZlbnQuZ2V0UGFyYW1ldGVyKFwiY29udGFpbmVyXCIpKSk7XG5cdFx0fSBlbHNlIHtcblx0XHRcdHRoaXMucmVnaXN0ZXJDb250YWluZXIodGhpcy5fb1ZpZXcpO1xuXHRcdH1cblxuXHRcdGNvbnN0IG9QbGFjZWhvbGRlciA9ICgodGhpcy5fb0FwcENvbXBvbmVudC5nZXRSb290Q29udHJvbCgpIGFzIFZpZXcpLmdldENvbnRyb2xsZXIoKSBhcyBhbnkpLmdldFBsYWNlaG9sZGVyKCk7XG5cdFx0aWYgKG9QbGFjZWhvbGRlci5pc1BsYWNlaG9sZGVyRGVidWdFbmFibGVkKCkpIHtcblx0XHRcdHRoaXMuYXR0YWNoRXZlbnQoXG5cdFx0XHRcdFwicGFnZVJlYWR5XCIsXG5cdFx0XHRcdG51bGwsXG5cdFx0XHRcdCgpID0+IHtcblx0XHRcdFx0XHRvUGxhY2Vob2xkZXIuZ2V0UGxhY2Vob2xkZXJEZWJ1Z1N0YXRzKCkuaVBhZ2VSZWFkeUV2ZW50VGltZXN0YW1wID0gRGF0ZS5ub3coKTtcblx0XHRcdFx0fSxcblx0XHRcdFx0dGhpc1xuXHRcdFx0KTtcblx0XHRcdHRoaXMuYXR0YWNoRXZlbnQoXG5cdFx0XHRcdFwiaGVyb2VzQmF0Y2hSZWNlaXZlZFwiLFxuXHRcdFx0XHRudWxsLFxuXHRcdFx0XHQoKSA9PiB7XG5cdFx0XHRcdFx0b1BsYWNlaG9sZGVyLmdldFBsYWNlaG9sZGVyRGVidWdTdGF0cygpLmlIZXJvZXNCYXRjaFJlY2VpdmVkRXZlbnRUaW1lc3RhbXAgPSBEYXRlLm5vdygpO1xuXHRcdFx0XHR9LFxuXHRcdFx0XHR0aGlzXG5cdFx0XHQpO1xuXHRcdH1cblx0fVxuXG5cdEBPdmVycmlkZSgpXG5cdHB1YmxpYyBvbkV4aXQoKSB7XG5cdFx0Ly8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIEB0eXBlc2NyaXB0LWVzbGludC9iYW4tdHMtY29tbWVudFxuXHRcdC8vIEB0cy1pZ25vcmVcblx0XHRkZWxldGUgdGhpcy5fb0FwcENvbXBvbmVudDtcblx0XHR0aGlzLl9vQ29udGFpbmVyICYmIHRoaXMuX29Db250YWluZXIucmVtb3ZlRXZlbnREZWxlZ2F0ZSh0aGlzLl9mbkNvbnRhaW5lckRlbGVnYXRlKTtcblx0fVxuXG5cdEBQdWJsaWNcblx0QEZpbmFsXG5cdHB1YmxpYyB3YWl0Rm9yKG9Qcm9taXNlOiBhbnkpIHtcblx0XHR0aGlzLl9uYldhaXRzKys7XG5cdFx0b1Byb21pc2Vcblx0XHRcdC5maW5hbGx5KCgpID0+IHtcblx0XHRcdFx0c2V0VGltZW91dCgoKSA9PiB7XG5cdFx0XHRcdFx0dGhpcy5fbmJXYWl0cy0tO1xuXHRcdFx0XHR9LCAwKTtcblx0XHRcdH0pXG5cdFx0XHQuY2F0Y2gobnVsbCk7XG5cdH1cblx0QE92ZXJyaWRlKFwiX3JvdXRpbmdcIilcblx0b25Sb3V0ZU1hdGNoZWQoKSB7XG5cdFx0dGhpcy5fYklzUGFnZVJlYWR5ID0gZmFsc2U7XG5cdH1cblx0QE92ZXJyaWRlKFwiX3JvdXRpbmdcIilcblx0b25Sb3V0ZU1hdGNoZWRGaW5pc2hlZCgpIHtcblx0XHR0aGlzLmNoZWNrUGFnZVJlYWR5RGVib3VuY2VkKCk7XG5cdH1cblxuXHRAT3ZlcnJpZGUoXCJfcm91dGluZ1wiKVxuXHRvbkFmdGVyQmluZGluZyhvQmluZGluZ0NvbnRleHQ6IENvbnRleHQ8YW55Pikge1xuXHRcdGlmICghdGhpcy5fYkFmdGVyQmluZGluZ0FscmVhZHlBcHBsaWVkKSB7XG5cdFx0XHR0aGlzLl9iQWZ0ZXJCaW5kaW5nQWxyZWFkeUFwcGxpZWQgPSB0cnVlO1xuXHRcdFx0bGV0IGFCb3VuZEVsZW1lbnRzOiBhbnlbXSA9IFtdO1xuXHRcdFx0Y29uc3QgYU5vdEJvdW5kTURDVGFibGVzOiBhbnlbXSA9IFtdO1xuXHRcdFx0bGV0IGlSZXF1ZXN0ZWQgPSAwO1xuXHRcdFx0bGV0IGlSZWNlaXZlZCA9IDA7XG5cdFx0XHRjb25zdCBmblJlcXVlc3RlZCA9IChvRXZlbnQ6IFVJNUV2ZW50KSA9PiB7XG5cdFx0XHRcdG9FdmVudC5nZXRTb3VyY2UoKS5kZXRhY2hEYXRhUmVxdWVzdGVkKGZuUmVxdWVzdGVkKTtcblx0XHRcdFx0aVJlcXVlc3RlZCsrO1xuXHRcdFx0XHR0aGlzLmJEYXRhUmVjZWl2ZWQgPSBmYWxzZTtcblx0XHRcdH07XG5cdFx0XHRjb25zdCBmblJlY2VpdmVkID0gKG9FdmVudDogVUk1RXZlbnQpID0+IHtcblx0XHRcdFx0c3dpdGNoIChvRXZlbnQuZ2V0U291cmNlKCkuc0dyb3VwSWQpIHtcblx0XHRcdFx0XHRjYXNlIFwiJGF1dG8uV29ya2Vyc1wiOlxuXHRcdFx0XHRcdFx0dGhpcy5fb0V2ZW50UHJvdmlkZXIuZmlyZUV2ZW50KFwid29ya2Vyc0JhdGNoUmVjZWl2ZWRcIik7XG5cdFx0XHRcdFx0XHRicmVhaztcblx0XHRcdFx0XHRjYXNlIFwiJGF1dG8uSGVyb2VzXCI6XG5cdFx0XHRcdFx0XHR0aGlzLl9vRXZlbnRQcm92aWRlci5maXJlRXZlbnQoXCJoZXJvZXNCYXRjaFJlY2VpdmVkXCIpO1xuXHRcdFx0XHRcdFx0YnJlYWs7XG5cdFx0XHRcdFx0ZGVmYXVsdDpcblx0XHRcdFx0fVxuXHRcdFx0XHRvRXZlbnQuZ2V0U291cmNlKCkuZGV0YWNoRGF0YVJlY2VpdmVkKGZuUmVjZWl2ZWQpO1xuXHRcdFx0XHRpUmVjZWl2ZWQrKztcblx0XHRcdFx0aWYgKGlSZWNlaXZlZCA+PSBpUmVxdWVzdGVkICYmIGlSZXF1ZXN0ZWQgIT09IDApIHtcblx0XHRcdFx0XHRpUmVxdWVzdGVkID0gMDtcblx0XHRcdFx0XHRpUmVjZWl2ZWQgPSAwO1xuXHRcdFx0XHRcdHRoaXMuYkRhdGFSZWNlaXZlZCA9IHRydWU7XG5cdFx0XHRcdFx0dGhpcy5jaGVja1BhZ2VSZWFkeURlYm91bmNlZCgpO1xuXHRcdFx0XHR9XG5cdFx0XHR9O1xuXHRcdFx0Y29uc3QgZm5TZWFyY2ggPSAob0V2ZW50OiBVSTVFdmVudCkgPT4ge1xuXHRcdFx0XHRjb25zdCBhTURDVGFibGVzID0gYU5vdEJvdW5kTURDVGFibGVzLmZpbHRlcihvRWxlbSA9PiB7XG5cdFx0XHRcdFx0aWYgKG9FdmVudC5nZXRTb3VyY2UoKS5zSWQgPT09IG9FbGVtLmdldEZpbHRlcigpICYmIG9FbGVtLmdldFZpc2libGUoKSkge1xuXHRcdFx0XHRcdFx0cmV0dXJuIHRydWU7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHRcdHJldHVybiBmYWxzZTtcblx0XHRcdFx0fSk7XG5cdFx0XHRcdGlmIChhTURDVGFibGVzLmxlbmd0aCA+IDApIHtcblx0XHRcdFx0XHR0aGlzLl9iU2VhY2hUcmlnZ2VyZWQgPSB0cnVlO1xuXHRcdFx0XHR9XG5cdFx0XHRcdGFNRENUYWJsZXMuZm9yRWFjaCgob01EQ1RhYmxlOiBhbnkpID0+IHtcblx0XHRcdFx0XHRsZXQgb1Jvd0JpbmRpbmcgPSBvTURDVGFibGUuZ2V0Um93QmluZGluZygpO1xuXHRcdFx0XHRcdGNvbnN0IGZuQXR0YWNoRGF0YUV2ZW50cyA9ICgpID0+IHtcblx0XHRcdFx0XHRcdG9Sb3dCaW5kaW5nLmF0dGFjaERhdGFSZXF1ZXN0ZWQoZm5SZXF1ZXN0ZWQpO1xuXHRcdFx0XHRcdFx0b1Jvd0JpbmRpbmcuYXR0YWNoRGF0YVJlY2VpdmVkKChvRXZlbnQ6IGFueSkgPT4ge1xuXHRcdFx0XHRcdFx0XHRmblJlY2VpdmVkKG9FdmVudCk7XG5cdFx0XHRcdFx0XHRcdHRoaXMuX2JTZWFjaFRyaWdnZXJlZCA9IGZhbHNlO1xuXHRcdFx0XHRcdFx0fSk7XG5cdFx0XHRcdFx0XHRhQm91bmRFbGVtZW50cy5wdXNoKG9Sb3dCaW5kaW5nKTtcblx0XHRcdFx0XHR9O1xuXHRcdFx0XHRcdGlmIChvUm93QmluZGluZykge1xuXHRcdFx0XHRcdFx0Zm5BdHRhY2hEYXRhRXZlbnRzKCk7XG5cdFx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHRcdG9NRENUYWJsZS5hdHRhY2hFdmVudE9uY2UoXG5cdFx0XHRcdFx0XHRcdFwiYmluZGluZ1VwZGF0ZWRcIixcblx0XHRcdFx0XHRcdFx0bnVsbCxcblx0XHRcdFx0XHRcdFx0KCkgPT4ge1xuXHRcdFx0XHRcdFx0XHRcdG9Sb3dCaW5kaW5nID0gb01EQ1RhYmxlLmdldFJvd0JpbmRpbmcoKTtcblx0XHRcdFx0XHRcdFx0XHRmbkF0dGFjaERhdGFFdmVudHMoKTtcblx0XHRcdFx0XHRcdFx0fSxcblx0XHRcdFx0XHRcdFx0bnVsbFxuXHRcdFx0XHRcdFx0KTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH0pO1xuXHRcdFx0fTtcblx0XHRcdGlmICh0aGlzLmlzQ29udGV4dEV4cGVjdGVkKCkgJiYgb0JpbmRpbmdDb250ZXh0ID09PSB1bmRlZmluZWQpIHtcblx0XHRcdFx0Ly8gRm9yY2UgdG8gbWVudGlvbiB3ZSBhcmUgZXhwZWN0aW5nIGRhdGFcblx0XHRcdFx0dGhpcy5iSGFzQ29udGV4dCA9IGZhbHNlO1xuXHRcdFx0XHRyZXR1cm47XG5cdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHR0aGlzLmJIYXNDb250ZXh0ID0gdHJ1ZTtcblx0XHRcdH1cblxuXHRcdFx0dGhpcy5hdHRhY2hFdmVudE9uY2UoXG5cdFx0XHRcdFwicGFnZVJlYWR5XCIsXG5cdFx0XHRcdG51bGwsXG5cdFx0XHRcdCgpID0+IHtcblx0XHRcdFx0XHRhQm91bmRFbGVtZW50cy5mb3JFYWNoKChvRWxlbWVudDogYW55KSA9PiB7XG5cdFx0XHRcdFx0XHRvRWxlbWVudC5kZXRhY2hFdmVudChcImRhdGFSZXF1ZXN0ZWRcIiwgZm5SZXF1ZXN0ZWQpO1xuXHRcdFx0XHRcdFx0b0VsZW1lbnQuZGV0YWNoRXZlbnQoXCJkYXRhUmVjZWl2ZWRcIiwgZm5SZWNlaXZlZCk7XG5cdFx0XHRcdFx0XHRvRWxlbWVudC5kZXRhY2hFdmVudChcInNlYXJjaFwiLCBmblNlYXJjaCk7XG5cdFx0XHRcdFx0fSk7XG5cdFx0XHRcdFx0dGhpcy5fYkFmdGVyQmluZGluZ0FscmVhZHlBcHBsaWVkID0gZmFsc2U7XG5cdFx0XHRcdFx0YUJvdW5kRWxlbWVudHMgPSBbXTtcblx0XHRcdFx0fSxcblx0XHRcdFx0bnVsbFxuXHRcdFx0KTtcblx0XHRcdGlmIChvQmluZGluZ0NvbnRleHQpIHtcblx0XHRcdFx0Y29uc3QgbWFpbk9iamVjdEJpbmRpbmcgPSAob0JpbmRpbmdDb250ZXh0IGFzIGFueSkuZ2V0QmluZGluZygpO1xuXHRcdFx0XHRtYWluT2JqZWN0QmluZGluZy5hdHRhY2hEYXRhUmVxdWVzdGVkKGZuUmVxdWVzdGVkKTtcblx0XHRcdFx0bWFpbk9iamVjdEJpbmRpbmcuYXR0YWNoRGF0YVJlY2VpdmVkKGZuUmVjZWl2ZWQpO1xuXHRcdFx0XHRhQm91bmRFbGVtZW50cy5wdXNoKG1haW5PYmplY3RCaW5kaW5nKTtcblx0XHRcdH1cblxuXHRcdFx0Y29uc3QgYVRhYmxlSW5pdGlhbGl6ZWRQcm9taXNlczogUHJvbWlzZTxhbnk+W10gPSBbXTtcblx0XHRcdHRoaXMuX29WaWV3LmZpbmRBZ2dyZWdhdGVkT2JqZWN0cyh0cnVlLCAob0VsZW1lbnQ6IGFueSkgPT4ge1xuXHRcdFx0XHRjb25zdCBvT2JqZWN0QmluZGluZyA9IG9FbGVtZW50LmdldE9iamVjdEJpbmRpbmcoKTtcblx0XHRcdFx0aWYgKG9PYmplY3RCaW5kaW5nKSB7XG5cdFx0XHRcdFx0Ly8gUmVnaXN0ZXIgb24gYWxsIG9iamVjdCBiaW5kaW5nIChtb3N0bHkgdXNlZCBvbiBvYmplY3QgcGFnZXMpXG5cdFx0XHRcdFx0b09iamVjdEJpbmRpbmcuYXR0YWNoRGF0YVJlcXVlc3RlZChmblJlcXVlc3RlZCk7XG5cdFx0XHRcdFx0b09iamVjdEJpbmRpbmcuYXR0YWNoRGF0YVJlY2VpdmVkKGZuUmVjZWl2ZWQpO1xuXHRcdFx0XHRcdGFCb3VuZEVsZW1lbnRzLnB1c2gob09iamVjdEJpbmRpbmcpO1xuXHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdGNvbnN0IGFCaW5kaW5nS2V5cyA9IE9iamVjdC5rZXlzKG9FbGVtZW50Lm1CaW5kaW5nSW5mb3MpO1xuXHRcdFx0XHRcdGlmIChhQmluZGluZ0tleXMubGVuZ3RoID4gMCkge1xuXHRcdFx0XHRcdFx0YUJpbmRpbmdLZXlzLmZvckVhY2goc1Byb3BlcnR5TmFtZSA9PiB7XG5cdFx0XHRcdFx0XHRcdGNvbnN0IG9MaXN0QmluZGluZyA9IG9FbGVtZW50Lm1CaW5kaW5nSW5mb3Nbc1Byb3BlcnR5TmFtZV0uYmluZGluZztcblx0XHRcdFx0XHRcdFx0Ly8gUmVnaXN0ZXIgb24gYWxsIGxpc3QgYmluZGluZywgZ29vZCBmb3IgYmFzaWMgdGFibGVzLCBwcm9ibGVtYXRpYyBmb3IgTURDLCBzZWUgYWJvdmVcblx0XHRcdFx0XHRcdFx0aWYgKG9MaXN0QmluZGluZyAmJiBvTGlzdEJpbmRpbmcuaXNBKFwic2FwLnVpLm1vZGVsLm9kYXRhLnY0Lk9EYXRhTGlzdEJpbmRpbmdcIikpIHtcblx0XHRcdFx0XHRcdFx0XHRvTGlzdEJpbmRpbmcuYXR0YWNoRGF0YVJlcXVlc3RlZChmblJlcXVlc3RlZCk7XG5cdFx0XHRcdFx0XHRcdFx0b0xpc3RCaW5kaW5nLmF0dGFjaERhdGFSZWNlaXZlZChmblJlY2VpdmVkKTtcblx0XHRcdFx0XHRcdFx0XHRhQm91bmRFbGVtZW50cy5wdXNoKG9MaXN0QmluZGluZyk7XG5cdFx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdH0pO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0fVxuXHRcdFx0XHQvLyBUaGlzIGlzIGRpcnR5IGJ1dCBNREMgVGFibGUgaGFzIGEgd2VpcmQgbG9hZGluZyBsaWZlY3ljbGVcblx0XHRcdFx0aWYgKG9FbGVtZW50LmlzQShcInNhcC51aS5tZGMuVGFibGVcIikpIHtcblx0XHRcdFx0XHR0aGlzLmJUYWJsZXNMb2FkZWQgPSBmYWxzZTtcblx0XHRcdFx0XHQvLyBhY2Nlc3MgYmluZGluZyBvbmx5IGFmdGVyIHRhYmxlIGlzIGJvdW5kXG5cdFx0XHRcdFx0YVRhYmxlSW5pdGlhbGl6ZWRQcm9taXNlcy5wdXNoKFxuXHRcdFx0XHRcdFx0b0VsZW1lbnRcblx0XHRcdFx0XHRcdFx0LmluaXRpYWxpemVkKClcblx0XHRcdFx0XHRcdFx0LnRoZW4oKCkgPT4ge1xuXHRcdFx0XHRcdFx0XHRcdGNvbnN0IG9Sb3dCaW5kaW5nID0gb0VsZW1lbnQuZ2V0Um93QmluZGluZygpO1xuXHRcdFx0XHRcdFx0XHRcdGlmIChvUm93QmluZGluZykge1xuXHRcdFx0XHRcdFx0XHRcdFx0b1Jvd0JpbmRpbmcuYXR0YWNoRGF0YVJlcXVlc3RlZChmblJlcXVlc3RlZCk7XG5cdFx0XHRcdFx0XHRcdFx0XHRvUm93QmluZGluZy5hdHRhY2hEYXRhUmVjZWl2ZWQoZm5SZWNlaXZlZCk7XG5cdFx0XHRcdFx0XHRcdFx0XHRhQm91bmRFbGVtZW50cy5wdXNoKG9Sb3dCaW5kaW5nKTtcblx0XHRcdFx0XHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdFx0XHRcdFx0YU5vdEJvdW5kTURDVGFibGVzLnB1c2gob0VsZW1lbnQpO1xuXHRcdFx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdFx0fSlcblx0XHRcdFx0XHRcdFx0LmNhdGNoKGZ1bmN0aW9uKG9FcnJvcjogRXJyb3IpIHtcblx0XHRcdFx0XHRcdFx0XHRMb2cuZXJyb3IoXCJDYW5ub3QgZmluZCBhIGJvdW5kIHRhYmxlXCIsIG9FcnJvciBhcyBhbnkpO1xuXHRcdFx0XHRcdFx0XHR9KVxuXHRcdFx0XHRcdCk7XG5cdFx0XHRcdH0gZWxzZSBpZiAob0VsZW1lbnQuaXNBKFwic2FwLmZlLmNvcmUuY29udHJvbHMuRmlsdGVyQmFyXCIpKSB7XG5cdFx0XHRcdFx0b0VsZW1lbnQuYXR0YWNoRXZlbnQoXCJzZWFyY2hcIiwgZm5TZWFyY2gpO1xuXHRcdFx0XHRcdGFCb3VuZEVsZW1lbnRzLnB1c2gob0VsZW1lbnQpO1xuXHRcdFx0XHR9XG5cdFx0XHR9KTtcblx0XHRcdGlmIChhVGFibGVJbml0aWFsaXplZFByb21pc2VzLmxlbmd0aCA+IDApIHtcblx0XHRcdFx0UHJvbWlzZS5hbGwoYVRhYmxlSW5pdGlhbGl6ZWRQcm9taXNlcylcblx0XHRcdFx0XHQudGhlbigoKSA9PiB7XG5cdFx0XHRcdFx0XHR0aGlzLmJUYWJsZXNMb2FkZWQgPSB0cnVlO1xuXHRcdFx0XHRcdFx0dGhpcy5jaGVja1BhZ2VSZWFkeURlYm91bmNlZCgpO1xuXHRcdFx0XHRcdH0pXG5cdFx0XHRcdFx0LmNhdGNoKG9FcnJvciA9PiB7XG5cdFx0XHRcdFx0XHRMb2cuaW5mbyhcIlRoZXJlIHdhcyBhbiBlcnJvciB3aXRoIG9uZSBvciBtdWx0aXBsZSB0YWJsZVwiLCBvRXJyb3IpO1xuXHRcdFx0XHRcdFx0dGhpcy5iVGFibGVzTG9hZGVkID0gdHJ1ZTtcblx0XHRcdFx0XHRcdHRoaXMuY2hlY2tQYWdlUmVhZHlEZWJvdW5jZWQoKTtcblx0XHRcdFx0XHR9KTtcblx0XHRcdH1cblx0XHR9XG5cdH1cblxuXHRAUHVibGljXG5cdEBGaW5hbFxuXHRwdWJsaWMgaXNQYWdlUmVhZHkoKSB7XG5cdFx0cmV0dXJuIHRoaXMuX2JJc1BhZ2VSZWFkeTtcblx0fVxuXG5cdEBQdWJsaWNcblx0QEZpbmFsXG5cdHB1YmxpYyB3YWl0UGFnZVJlYWR5KCk6IFByb21pc2U8dm9pZD4ge1xuXHRcdHJldHVybiBuZXcgUHJvbWlzZShyZXNvbHZlID0+IHtcblx0XHRcdGlmICh0aGlzLmlzUGFnZVJlYWR5KCkpIHtcblx0XHRcdFx0cmVzb2x2ZSgpO1xuXHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0dGhpcy5hdHRhY2hFdmVudE9uY2UoXG5cdFx0XHRcdFx0XCJwYWdlUmVhZHlcIixcblx0XHRcdFx0XHRudWxsLFxuXHRcdFx0XHRcdCgpID0+IHtcblx0XHRcdFx0XHRcdHJlc29sdmUoKTtcblx0XHRcdFx0XHR9LFxuXHRcdFx0XHRcdHRoaXNcblx0XHRcdFx0KTtcblx0XHRcdH1cblx0XHR9KTtcblx0fVxuXG5cdEBQdWJsaWNcblx0QEZpbmFsXG5cdHB1YmxpYyBhdHRhY2hFdmVudE9uY2Uoc0V2ZW50SWQ6IHN0cmluZywgb0RhdGE6IGFueSwgZm5GdW5jdGlvbjogRnVuY3Rpb24sIG9MaXN0ZW5lcjogYW55KSB7XG5cdFx0Ly8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIHByZWZlci1yZXN0LXBhcmFtc1xuXHRcdHJldHVybiB0aGlzLl9vRXZlbnRQcm92aWRlci5hdHRhY2hFdmVudE9uY2Uoc0V2ZW50SWQsIG9EYXRhLCBmbkZ1bmN0aW9uLCBvTGlzdGVuZXIpO1xuXHR9XG5cdEBQdWJsaWNcblx0QEZpbmFsXG5cdHB1YmxpYyBhdHRhY2hFdmVudChzRXZlbnRJZDogc3RyaW5nLCBvRGF0YTogYW55LCBmbkZ1bmN0aW9uOiBGdW5jdGlvbiwgb0xpc3RlbmVyOiBhbnkpIHtcblx0XHQvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgcHJlZmVyLXJlc3QtcGFyYW1zXG5cdFx0cmV0dXJuIHRoaXMuX29FdmVudFByb3ZpZGVyLmF0dGFjaEV2ZW50KHNFdmVudElkLCBvRGF0YSwgZm5GdW5jdGlvbiwgb0xpc3RlbmVyKTtcblx0fVxuXHRAUHVibGljXG5cdEBGaW5hbFxuXHRwdWJsaWMgZGV0YWNoRXZlbnQoc0V2ZW50SWQ6IHN0cmluZywgZm5GdW5jdGlvbjogRnVuY3Rpb24pIHtcblx0XHQvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgcHJlZmVyLXJlc3QtcGFyYW1zXG5cdFx0cmV0dXJuIHRoaXMuX29FdmVudFByb3ZpZGVyLmRldGFjaEV2ZW50KHNFdmVudElkLCBmbkZ1bmN0aW9uKTtcblx0fVxuXHRwcml2YXRlIHJlZ2lzdGVyQ29udGFpbmVyKG9Db250YWluZXI6IE1hbmFnZWRPYmplY3QpIHtcblx0XHR0aGlzLl9vQ29udGFpbmVyID0gb0NvbnRhaW5lcjtcblx0XHR0aGlzLl9mbkNvbnRhaW5lckRlbGVnYXRlID0ge1xuXHRcdFx0b25CZWZvcmVTaG93OiAoKSA9PiB7XG5cdFx0XHRcdHRoaXMuYlNob3duID0gZmFsc2U7XG5cdFx0XHRcdHRoaXMuX2JJc1BhZ2VSZWFkeSA9IGZhbHNlO1xuXHRcdFx0fSxcblx0XHRcdG9uQmVmb3JlSGlkZTogKCkgPT4ge1xuXHRcdFx0XHR0aGlzLmJTaG93biA9IGZhbHNlO1xuXHRcdFx0XHR0aGlzLl9iSXNQYWdlUmVhZHkgPSBmYWxzZTtcblx0XHRcdH0sXG5cdFx0XHRvbkFmdGVyU2hvdzogKCkgPT4ge1xuXHRcdFx0XHR0aGlzLmJTaG93biA9IHRydWU7XG5cdFx0XHRcdHRoaXMuX2NoZWNrUGFnZVJlYWR5KHRydWUpO1xuXHRcdFx0fVxuXHRcdH07XG5cdFx0dGhpcy5fb0NvbnRhaW5lci5hZGRFdmVudERlbGVnYXRlKHRoaXMuX2ZuQ29udGFpbmVyRGVsZWdhdGUpO1xuXHR9XG5cblx0QFByaXZhdGVcblx0QEV4dGVuc2libGUoT3ZlcnJpZGVFeGVjdXRpb24uSW5zdGVhZClcblx0cHVibGljIGlzQ29udGV4dEV4cGVjdGVkKCkge1xuXHRcdHJldHVybiBmYWxzZTtcblx0fVxuXG5cdHB1YmxpYyBjaGVja1BhZ2VSZWFkeURlYm91bmNlZCgpIHtcblx0XHRpZiAodGhpcy5wYWdlUmVhZHlUaW1lcikge1xuXHRcdFx0Y2xlYXJUaW1lb3V0KHRoaXMucGFnZVJlYWR5VGltZXIpO1xuXHRcdH1cblx0XHR0aGlzLnBhZ2VSZWFkeVRpbWVyID0gc2V0VGltZW91dCgoKSA9PiB7XG5cdFx0XHR0aGlzLl9jaGVja1BhZ2VSZWFkeSgpO1xuXHRcdH0sIDIwMCk7XG5cdH1cblxuXHRwdWJsaWMgX2NoZWNrUGFnZVJlYWR5KGJGcm9tTmF2OiBib29sZWFuID0gZmFsc2UpIHtcblx0XHRjb25zdCBmblVJVXBkYXRlZCA9ICgpID0+IHtcblx0XHRcdC8vIFdhaXQgdW50aWwgdGhlIFVJIGlzIG5vIGxvbmdlciBkaXJ0eVxuXHRcdFx0aWYgKCFzYXAudWkuZ2V0Q29yZSgpLmdldFVJRGlydHkoKSkge1xuXHRcdFx0XHRzYXAudWkuZ2V0Q29yZSgpLmRldGFjaEV2ZW50KFwiVUlVcGRhdGVkXCIsIGZuVUlVcGRhdGVkKTtcblx0XHRcdFx0dGhpcy5fYldhaXRpbmdGb3JSZWZyZXNoID0gZmFsc2U7XG5cdFx0XHRcdHNldFRpbWVvdXQoKCkgPT4ge1xuXHRcdFx0XHRcdHRoaXMuX2NoZWNrUGFnZVJlYWR5KCk7XG5cdFx0XHRcdH0sIDIwKTtcblx0XHRcdH1cblx0XHR9O1xuXG5cdFx0Ly8gSW4gY2FzZSBVSVVwZGF0ZSBkb2VzIG5vdCBnZXQgY2FsbGVkLCBjaGVjayBpZiBVSSBpcyBub3QgZGlydHkgYW5kIHRoZW4gY2FsbCBfY2hlY2tQYWdlUmVhZHlcblx0XHRjb25zdCBjaGVja1VJVXBkYXRlZCA9ICgpID0+IHtcblx0XHRcdGlmIChzYXAudWkuZ2V0Q29yZSgpLmdldFVJRGlydHkoKSkge1xuXHRcdFx0XHRzZXRUaW1lb3V0KGNoZWNrVUlVcGRhdGVkLCA1MDApO1xuXHRcdFx0fSBlbHNlIGlmICh0aGlzLl9iV2FpdGluZ0ZvclJlZnJlc2gpIHtcblx0XHRcdFx0dGhpcy5fYldhaXRpbmdGb3JSZWZyZXNoID0gZmFsc2U7XG5cdFx0XHRcdHNhcC51aS5nZXRDb3JlKCkuZGV0YWNoRXZlbnQoXCJVSVVwZGF0ZWRcIiwgZm5VSVVwZGF0ZWQpO1xuXHRcdFx0XHR0aGlzLl9jaGVja1BhZ2VSZWFkeSgpO1xuXHRcdFx0fVxuXHRcdH07XG5cblx0XHRpZiAoXG5cdFx0XHR0aGlzLmJTaG93biAmJlxuXHRcdFx0dGhpcy5iRGF0YVJlY2VpdmVkICE9PSBmYWxzZSAmJlxuXHRcdFx0dGhpcy5iVGFibGVzTG9hZGVkICE9PSBmYWxzZSAmJlxuXHRcdFx0KCF0aGlzLmlzQ29udGV4dEV4cGVjdGVkKCkgfHwgdGhpcy5iSGFzQ29udGV4dCkgLy8gRWl0aGVyIG5vIGNvbnRleHQgaXMgZXhwZWN0ZWQgb3IgdGhlcmUgaXMgb25lXG5cdFx0KSB7XG5cdFx0XHRpZiAodGhpcy5iRGF0YVJlY2VpdmVkID09PSB0cnVlICYmICFiRnJvbU5hdiAmJiAhdGhpcy5fYldhaXRpbmdGb3JSZWZyZXNoICYmIHNhcC51aS5nZXRDb3JlKCkuZ2V0VUlEaXJ0eSgpKSB7XG5cdFx0XHRcdC8vIElmIHdlIHJlcXVlc3RlZCBkYXRhIHdlIGdldCBub3RpZmllZCBhcyBzb29uIGFzIHRoZSBkYXRhIGFycml2ZWQsIHNvIGJlZm9yZSB0aGUgbmV4dCByZW5kZXJpbmcgdGlja1xuXHRcdFx0XHR0aGlzLmJEYXRhUmVjZWl2ZWQgPSB1bmRlZmluZWQ7XG5cdFx0XHRcdHRoaXMuX2JXYWl0aW5nRm9yUmVmcmVzaCA9IHRydWU7XG5cdFx0XHRcdHNhcC51aS5nZXRDb3JlKCkuYXR0YWNoRXZlbnQoXCJVSVVwZGF0ZWRcIiwgZm5VSVVwZGF0ZWQpO1xuXHRcdFx0XHRzZXRUaW1lb3V0KGNoZWNrVUlVcGRhdGVkLCA1MDApO1xuXHRcdFx0fSBlbHNlIGlmIChcblx0XHRcdFx0KCF0aGlzLl9iV2FpdGluZ0ZvclJlZnJlc2ggJiYgc2FwLnVpLmdldENvcmUoKS5nZXRVSURpcnR5KCkpIHx8XG5cdFx0XHRcdHRoaXMuX25iV2FpdHMgIT09IDAgfHxcblx0XHRcdFx0VGVtcGxhdGVkVmlld1NlcnZpY2VGYWN0b3J5LmdldE51bWJlck9mVmlld3NJbkNyZWF0aW9uU3RhdGUoKSA+IDAgfHxcblx0XHRcdFx0dGhpcy5fYlNlYWNoVHJpZ2dlcmVkXG5cdFx0XHQpIHtcblx0XHRcdFx0dGhpcy5fYldhaXRpbmdGb3JSZWZyZXNoID0gdHJ1ZTtcblx0XHRcdFx0c2FwLnVpLmdldENvcmUoKS5hdHRhY2hFdmVudChcIlVJVXBkYXRlZFwiLCBmblVJVXBkYXRlZCk7XG5cdFx0XHRcdHNldFRpbWVvdXQoY2hlY2tVSVVwZGF0ZWQsIDUwMCk7XG5cdFx0XHR9IGVsc2UgaWYgKCF0aGlzLl9iV2FpdGluZ0ZvclJlZnJlc2gpIHtcblx0XHRcdFx0Ly8gSW4gdGhlIGNhc2Ugd2UncmUgbm90IHdhaXRpbmcgZm9yIGFueSBkYXRhIChuYXZpZ2F0aW5nIGJhY2sgdG8gYSBwYWdlIHdlIGFscmVhZHkgaGF2ZSBsb2FkZWQpXG5cdFx0XHRcdC8vIGp1c3Qgd2FpdCBmb3IgYSBmcmFtZSB0byBmaXJlIHRoZSBldmVudC5cblx0XHRcdFx0dGhpcy5fYklzUGFnZVJlYWR5ID0gdHJ1ZTtcblx0XHRcdFx0dGhpcy5fb0V2ZW50UHJvdmlkZXIuZmlyZUV2ZW50KFwicGFnZVJlYWR5XCIpO1xuXHRcdFx0fVxuXHRcdH1cblx0fVxufVxuXG5leHBvcnQgZGVmYXVsdCBQYWdlUmVhZHlDb250cm9sbGVyRXh0ZW5zaW9uO1xuIl19