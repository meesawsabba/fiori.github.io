/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)
 *      (c) Copyright 2009-2021 SAP SE. All rights reserved
 */
sap.ui.define(["sap/ui/core/mvc/ControllerExtension", "sap/fe/core/controllerextensions/ControllerExtensionMetadata", "../helpers/ClassSupport", "sap/fe/core/CommonUtils", "sap/fe/macros/field/FieldRuntime", "sap/base/Log"], function (ControllerExtension, ControllerExtensionMetadata, ClassSupport, CommonUtils, FieldRuntime, Log) {
  "use strict";

  var _dec, _dec2, _class, _class2;

  var Private = ClassSupport.Private;
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

  var SideEffectsControllerExtension = (_dec = UI5Class("sap.fe.core.controllerextensions.SideEffects", ControllerExtensionMetadata), _dec2 = Override(), _dec(_class = (_class2 = /*#__PURE__*/function (_ControllerExtension) {
    _inherits(SideEffectsControllerExtension, _ControllerExtension);

    var _super = _createSuper(SideEffectsControllerExtension);

    function SideEffectsControllerExtension() {
      _classCallCheck(this, SideEffectsControllerExtension);

      return _super.apply(this, arguments);
    }

    _createClass(SideEffectsControllerExtension, [{
      key: "onInit",
      value: function onInit() {
        this._oView = this.base.getView();
        this._oAppComponent = CommonUtils.getAppComponent(this._oView);
        this._oSideEffectsService = this._oAppComponent.getSideEffectsService();
        this._mFieldGroupQueue = {};
        this._aSourcePropertiesFailure = new Set();
        this._mFailedSideEffects = {};
      }
      /**
       * Clear recorded validation status for all properties.
       *
       * @function
       * @name clearPropertiesStatus
       */

    }, {
      key: "clearPropertiesStatus",
      value: function clearPropertiesStatus() {
        this._aSourcePropertiesFailure.clear();
      }
      /**
       * Gets failed SideEffects.
       *
       * @function
       * @name getRegisteredFailedRequests
       * @returns {object} Registered SideEffects requests that have failed
       */

    }, {
      key: "getRegisteredFailedRequests",
      value: function getRegisteredFailedRequests() {
        return this._mFailedSideEffects;
      }
      /**
       * Manages the workflow for SideEffects with related changes to a field
       * The following scenarios are managed:
       *  - Execute: triggers immediate SideEffects requests if the promise for the field event is fulfilled
       *  - Register: caches deferred SideEffects that will be executed when the FieldGroup is unfocused.
       *
       * @function
       * @name handleFieldChange
       * @param {object} oEvent SAPUI5 event that comes from a field change
       * @param {object} oFieldGroupPreRequisite Promise to be fulfilled before executing deferred SideEffects
       * @returns {object}  Promise on SideEffects request(s)
       */

    }, {
      key: "handleFieldChange",
      value: function handleFieldChange(oEvent, oFieldGroupPreRequisite) {
        var _this = this;

        var mEventFieldProperties = this._getFieldProperties(oEvent),
            aImmediateSideEffectsProperties = this._initializeFieldSideEffects(mEventFieldProperties, oFieldGroupPreRequisite);

        var bIsImmediateTriggered = false;
        return this._generateImmediatePromise(mEventFieldProperties).then(function () {
          bIsImmediateTriggered = true;
          return Promise.all(aImmediateSideEffectsProperties.map(function (mSideEffectsProperty) {
            return _this.requestSideEffects(mSideEffectsProperty.sideEffects, mSideEffectsProperty.context);
          }) || []);
        }).catch(function (oError) {
          if (bIsImmediateTriggered) {
            Log.debug("Error while processing Field SideEffects", oError);
          } else {
            /**
             * SideEffects have not been triggered since preRequisite validation fails so we need
             * to keep previously failed request as Failed request (to be retrigger on next change)
             */
            aImmediateSideEffectsProperties.filter(function (mImmediateSideEffects) {
              return mImmediateSideEffects.previouslyFailed === true;
            }).forEach(function (mImmediateSideEffects) {
              return _this._addFailedSideEffects(mImmediateSideEffects.sideEffects, mImmediateSideEffects.context);
            });
          }
        });
      }
      /**
       * Manages SideEffects with a related 'focus out' to a field group.
       *
       * @function
       * @name handleFieldGroupChange
       * @param {object} oEvent SAPUI5 Event
       * @returns {object} Promise on SideEffects request(s)
       */

    }, {
      key: "handleFieldGroupChange",
      value: function handleFieldGroupChange(oEvent) {
        // eslint-disable-next-line @typescript-eslint/no-this-alias
        var that = this,
            aDeferredSideEffects = [],
            aFieldGroupIds = oEvent.getParameter("fieldGroupIds");

        var getFieldGroupRequestPromise = function (oDeferredSideEffect) {
          var bIsRequestsTriggered = false;
          var oSideEffectProperty = oDeferredSideEffect.sideEffectProperty;
          var oContext = oSideEffectProperty.context;
          var sContextPath = oContext.getPath();

          var sEntityType = that._oSideEffectsService.getEntityTypeFromContext(oContext);

          var mEntityType = that._getEntityTypeFromFQN(sEntityType);

          return Promise.all(oDeferredSideEffect.promises).then(function () {
            bIsRequestsTriggered = true; //Deferred SideEffects are executed only if all sourceProperties have no registered failure.

            if (mEntityType && oSideEffectProperty.sideEffects.SourceProperties.every(function (sourceProperty) {
              if (sourceProperty.type === "PropertyPath") {
                var sId = that._generateStatusIndex(mEntityType, sourceProperty.value, oContext);

                if (sId) {
                  return !that._aSourcePropertiesFailure.has(sId);
                }
              }

              return true;
            })) {
              return that.requestSideEffects(oSideEffectProperty.sideEffects, oSideEffectProperty.context);
            }

            return null;
          }).catch(function (oError) {
            if (bIsRequestsTriggered) {
              Log.debug("Error while processing FieldGroup SideEffects on context " + sContextPath, oError);
            }
          }).finally(function () {
            delete that._mFieldGroupQueue[oSideEffectProperty.name][sContextPath];
          });
        };

        aFieldGroupIds.forEach(function (sFieldGroupId) {
          var _that$_mFieldGroupQue;

          /**
           * string "$$ImmediateRequest" is added to the SideEffects name during templating to know
           * if this SideEffects must be immediately executed requested (on field change) or must
           * be deferred (on field group focus out)
           *
           */
          var sSideEffectName = sFieldGroupId.replace("$$ImmediateRequest", "");
          var mContextDeferredSideEffects = (_that$_mFieldGroupQue = that._mFieldGroupQueue) === null || _that$_mFieldGroupQue === void 0 ? void 0 : _that$_mFieldGroupQue[sSideEffectName];

          if (mContextDeferredSideEffects) {
            Object.keys(mContextDeferredSideEffects).forEach(function (sContextPath) {
              var oDeferredSideEffect = mContextDeferredSideEffects[sContextPath];

              if (!oDeferredSideEffect.processStarted) {
                oDeferredSideEffect.processStarted = true;
                aDeferredSideEffects.push(oDeferredSideEffect);
              }
            });
          }
        });
        return Promise.all(aDeferredSideEffects.map(function (oDeferredSideEffect) {
          return getFieldGroupRequestPromise(oDeferredSideEffect);
        }));
      }
      /**
       * Adds a SideEffects control.
       *
       * @function
       * @name addControlSideEffects
       * @param {string} sEntityType Name of the entity where the SideEffects control will be registered
       * @param {object} oSideEffects SideEffects to register. Ensure the sourceControlId matches the associated SAPUI5 control ID.
       *
       */

    }, {
      key: "addControlSideEffects",
      value: function addControlSideEffects(sEntityType, oSideEffects) {
        this._oSideEffectsService.addControlSideEffects(sEntityType, oSideEffects);
      }
      /**
       * Removes the queue containing the failed SideEffects.
       *
       * @function
       * @name removeFailedSideEffects
       */

    }, {
      key: "removeFailedSideEffects",
      value: function removeFailedSideEffects() {
        this._mFailedSideEffects = {};
      }
      /**
       * Request SideEffects on a specific context.
       *
       * @function
       * @name requestSideEffects
       * @param {object} oSideEffects SideEffects to be executed
       * @param {object} oContext Context where SideEffects need to be executed
       * @returns {object} SideEffects request on SAPUI5 context
       */

    }, {
      key: "requestSideEffects",
      value: function requestSideEffects(oSideEffects, oContext) {
        var _this2 = this;

        var fResolver, fRejector;
        var oPromise = new Promise(function (resolve, reject) {
          fResolver = resolve;
          fRejector = reject;
        });
        var aTargets = (oSideEffects.TargetEntities || []).concat(oSideEffects.TargetProperties || []),
            sTriggerAction = oSideEffects.TriggerAction;

        if (sTriggerAction) {
          this._oSideEffectsService.executeAction(sTriggerAction, oContext);
        }

        this._oSideEffectsService.requestSideEffects(aTargets, oContext).then(function () {
          return fResolver();
        }).catch(function (oError) {
          _this2._addFailedSideEffects(oSideEffects, oContext);

          fRejector(oError);
        });

        return oPromise;
      }
      /**
       * Removes SideEffects created by a control.
       *
       * @function
       * @name removeControlSideEffects
       * @param {object} oControl SAPUI5 Control
       */

    }, {
      key: "removeControlSideEffects",
      value: function removeControlSideEffects(oControl) {
        var sControlId = oControl && oControl.isA && oControl.isA("sap.ui.base.ManagedObject") && oControl.getId();

        if (sControlId) {
          this._oSideEffectsService.removeControlSideEffects(sControlId);
        }
      }
      /**
       * Adds SideEffects to the queue of the failed SideEffects
       * The SideEffects will be retriggered on the next change on the same context.
       *
       * @function
       * @name _addFailedSideEffects
       * @param {object} oSideEffects SideEffects that need to be retriggered
       * @param {object} oContext Context where SideEffects have failed
       */

    }, {
      key: "_addFailedSideEffects",
      value: function _addFailedSideEffects(oSideEffects, oContext) {
        var sContextPath = oContext.getPath();
        this._mFailedSideEffects[sContextPath] = this._mFailedSideEffects[sContextPath] || [];

        var bIsNotAlreadyListed = this._mFailedSideEffects[sContextPath].every(function (mFailedSideEffects) {
          return oSideEffects.fullyQualifiedName !== mFailedSideEffects.fullyQualifiedName;
        });

        if (bIsNotAlreadyListed) {
          this._mFailedSideEffects[sContextPath].push(oSideEffects);
        }
      }
      /**
       * Generates the promise for the field group that is required before requesting SideEffects.
       * If the promise is rejected and only the field requires the SideEffects on this context, the SideEffects are removed from the
       * SideEffects queue.
       *
       * @function
       * @name _generateFieldGroupPromise
       * @param {object} mEventFieldProperties Field properties
       * @returns {object} Promise to be used for the validation of the field
       */

    }, {
      key: "_generateFieldGroupPromise",
      value: function _generateFieldGroupPromise(mEventFieldProperties) {
        // eslint-disable-next-line @typescript-eslint/no-this-alias
        var that = this;
        var bPromiseSuccess = true;
        return mEventFieldProperties.promise.then(function () {
          return bPromiseSuccess;
        }).catch(function () {
          bPromiseSuccess = false;
          return bPromiseSuccess;
        }).finally(function () {
          /**
           * Need to store the status of properties related to this field for deferred SideEffects
           * since all SourceProperties for this kind of SideEffects must be valid
           */
          that._saveFieldPropertiesStatus(mEventFieldProperties.field, bPromiseSuccess);
        });
      }
      /**
       * Generates the promise for the field that is required before requesting immediate SideEffects.
       *
       * @function
       * @name _generateImmediatePromise
       * @param {object} mEventFieldProperties Field properties
       * @returns {object} Promise to be used for the validation of the field
       */

    }, {
      key: "_generateImmediatePromise",
      value: function _generateImmediatePromise(mEventFieldProperties) {
        var oPromise = mEventFieldProperties.promise;
        return oPromise.then(function () {
          /**
           * If the field gets a FieldHelper, we need to wait until all fields changed by this FieldHelper have been set.
           * To achieve this, we ensure that all related bindings have been resolved.
           *
           * This resolution process is not managed by the Field Event Promise, so for fast user actions (like automation) it can lock the model
           * and no request can be executed.
           */
          var oField = mEventFieldProperties.field;
          var sFieldHelperId = oField.getFieldHelp && oField.getFieldHelp();

          if (sFieldHelperId) {
            var oFilterHelp = sap.ui.getCore().byId(sFieldHelperId);

            if (oFilterHelp) {
              return Promise.all(oFilterHelp.getOutParameters().map(function (oOutParameter) {
                var oBinding = oOutParameter.getBinding("value");
                return oBinding ? oBinding.requestValue() : Promise.resolve();
              }));
            }
          }

          return Promise.all([]);
        });
      }
      /**
       * Generates a status index.
       *
       * @function
       * @name _generateStatusIndex
       * @param {object} mEntityType The entity type
       * @param {string} sPropertyPath The property path
       * @param {object} oContext SAPUI5 Context
       * @returns {string | undefined} Index
       */

    }, {
      key: "_generateStatusIndex",
      value: function _generateStatusIndex(mEntityType, sPropertyPath, oContext) {
        var sContextPath = oContext.getPath();
        var mProperty = mEntityType.resolvePath(sPropertyPath);

        if (mProperty) {
          if (mProperty && mProperty._type === "Property") {
            return [mProperty.fullyQualifiedName, sContextPath].join("__");
          }
        }

        return undefined;
      }
      /**
       * Gets the appropriate context on which SideEffects can be requested.
       * The correct one must have the binding parameter $$patchWithoutSideEffects.
       *
       * @function
       * @name _getContextForSideEffects
       * @param {object} oSourceField Field
       * @param {string} sSideEffectEntityType Target entity type of the SideEffects annotation
       * @returns {object} SAPUI5 Context
       */

    }, {
      key: "_getContextForSideEffects",
      value: function _getContextForSideEffects(oSourceField, sSideEffectEntityType) {
        var oBindingContext = oSourceField.getBindingContext();

        var oContextForSideEffects = oBindingContext,
            sEntityType = this._oSideEffectsService.getEntityTypeFromContext(oBindingContext);

        if (sSideEffectEntityType !== sEntityType) {
          oContextForSideEffects = oBindingContext.getBinding().getContext();

          if (oContextForSideEffects) {
            sEntityType = this._oSideEffectsService.getEntityTypeFromContext(oContextForSideEffects);

            if (sSideEffectEntityType !== sEntityType) {
              oContextForSideEffects = oContextForSideEffects.getBinding().getContext();

              if (oContextForSideEffects) {
                sEntityType = this._oSideEffectsService.getEntityTypeFromContext(oContextForSideEffects);

                if (sSideEffectEntityType !== sEntityType) {
                  return undefined;
                }
              }
            }
          }
        }

        return oContextForSideEffects || undefined;
      }
      /**
       * Retrieves the EntityType based on its fully-qualified name.
       *
       * @param {string} sFullyQualifiedName The fully-qualified name
       * @returns {object} The entity type
       */

    }, {
      key: "_getEntityTypeFromFQN",
      value: function _getEntityTypeFromFQN(sFullyQualifiedName) {
        var mEntityType = this._oSideEffectsService.getConvertedMetaModel().entityTypes.find(function (oEntityType) {
          return oEntityType.fullyQualifiedName === sFullyQualifiedName;
        });

        return mEntityType;
      }
      /**
       * Gets the promise of the field validation that is required for the SideEffects process.
       *
       * @function
       * @name _getFieldPromise
       * @param {object} oEvent Field change event
       * @returns {object} Field promise
       */

    }, {
      key: "_getFieldPromise",
      value: function _getFieldPromise(oEvent) {
        var promise = oEvent.getParameter("promise") || Promise.resolve();
        return promise.then(function () {
          var oPromise = new Promise(function (resolve, reject) {
            if (!FieldRuntime.getFieldStateOnChange(oEvent).state.validity) {
              reject();
            } else {
              resolve(true);
            }
          });
          return oPromise;
        });
      }
      /**
       * Gets the properties of the field that are required for the SideEffects process.
       *
       * @function
       * @name _getFieldProperties
       * @param {object} oEvent Field change event
       * @returns {object} Field properties (event change promise, field, SideEffects related to this field)
       */

    }, {
      key: "_getFieldProperties",
      value: function _getFieldProperties(oEvent) {
        var oField = oEvent.getSource();
        return {
          promise: this._getFieldPromise(oEvent),
          field: oField,
          sideEffectsMap: this._getFieldSideEffectsMap(oField)
        };
      }
      /**
       * Gets the SideEffects map
       * These SideEffects are
       * - listed into FieldGroupIds (coming from an OData Service)
       * - generated by a control or controls and that configure this field as SourceProperties.
       *
       * @function
       * @name _getFieldSideEffectsMap
       * @param {object} oField Field
       * @returns {object} SideEffects map
       */

    }, {
      key: "_getFieldSideEffectsMap",
      value: function _getFieldSideEffectsMap(oField) {
        var _this3 = this;

        var mSideEffectsMap = {},
            aFieldGroupIds = oField.getFieldGroupIds(),
            sViewEntitySetSetName = this._oView.getViewData().entitySet,
            oViewEntitySet = this._oSideEffectsService.getConvertedMetaModel().entitySets.find(function (oEntitySet) {
          return oEntitySet.name === sViewEntitySetSetName;
        }); // SideEffects coming from an OData Service


        aFieldGroupIds.forEach(function (sFieldGroupId) {
          var _this3$_oSideEffectsS;

          var bIsImmediate = sFieldGroupId.indexOf("$$ImmediateRequest") !== -1,
              sName = sFieldGroupId.replace("$$ImmediateRequest", ""),
              aSideEffectParts = sName.split("#"),
              sSideEffectEntityType = aSideEffectParts[0],
              sSideEffectPath = sSideEffectEntityType + "@com.sap.vocabularies.Common.v1.SideEffects" + (aSideEffectParts.length === 2 ? "#" + aSideEffectParts[1] : ""),
              oSideEffect = (_this3$_oSideEffectsS = _this3._oSideEffectsService.getODataEntitySideEffects(sSideEffectEntityType)) === null || _this3$_oSideEffectsS === void 0 ? void 0 : _this3$_oSideEffectsS[sSideEffectPath],
              oContext = _this3._getContextForSideEffects(oField, sSideEffectEntityType);

          if (oSideEffect && oContext) {
            mSideEffectsMap[sName] = {
              name: sName,
              immediate: bIsImmediate,
              sideEffects: oSideEffect,
              context: oContext
            };
          }
        }); //SideEffects coming from control(s)

        if (sViewEntitySetSetName && oViewEntitySet) {
          var sViewEntityType = oViewEntitySet.entityType.fullyQualifiedName,
              mFieldPath = oField.getAggregation("customData").find(function (oCustomData) {
            return oCustomData.getKey() === "sourcePath";
          }),
              oContext = this._getContextForSideEffects(oField, sViewEntityType);

          if (mFieldPath && oContext) {
            var sFieldPath = mFieldPath.getValue().replace("/" + sViewEntitySetSetName + "/", ""),
                mControlEntityType = this._oSideEffectsService.getControlEntitySideEffects(sViewEntityType);

            Object.keys(mControlEntityType).forEach(function (sControlName) {
              var oControlSideEffects = mControlEntityType[sControlName];

              if (oControlSideEffects.SourceProperties.includes(sFieldPath)) {
                var sName = sControlName + "::" + sViewEntityType;
                mSideEffectsMap[sName] = {
                  name: sName,
                  immediate: true,
                  sideEffects: oControlSideEffects,
                  context: oContext
                };
              }
            });
          }
        }

        return mSideEffectsMap;
      }
      /**
       * Manages the SideEffects with related changes to a field
       * List: gets immediate SideEffects requests
       * Register: caches deferred SideEffects that will be executed when the FieldGroup is unfocused.
       *
       * @function
       * @name _initializeFieldSideEffects
       * @param {object} mEventFieldProperties Field event properties
       * @param {object} oFieldGroupPreRequisite Promise to be fulfilled before executing deferred SideEffects
       * @returns {Array}  Array of immediate SideEffects
       */

    }, {
      key: "_initializeFieldSideEffects",
      value: function _initializeFieldSideEffects(mEventFieldProperties, oFieldGroupPreRequisite) {
        var _this4 = this;

        var mFieldSideEffectsMap = mEventFieldProperties.sideEffectsMap,
            oFieldPromiseForFieldGroup = this._generateFieldGroupPromise(mEventFieldProperties),
            // Promise managing FieldGroup requests if Field promise fails
        mFailedSideEffectsName = {},
            aImmediateSideEffectsProperties = [];

        oFieldGroupPreRequisite = oFieldGroupPreRequisite || Promise.resolve();
        Object.keys(mFieldSideEffectsMap).forEach(function (sSideEffectName) {
          var oSideEffectProperty = mFieldSideEffectsMap[sSideEffectName],
              sSideEffectContextPath = oSideEffectProperty.context.getPath(),
              aFailedSideEffects = _this4._mFailedSideEffects[sSideEffectContextPath]; // Check if there is any previously failed request for this context

          if (aFailedSideEffects) {
            delete _this4._mFailedSideEffects[sSideEffectContextPath];
            mFailedSideEffectsName[sSideEffectContextPath] = {};
            aFailedSideEffects.forEach(function (mFailedSideEffects) {
              mFailedSideEffectsName[sSideEffectContextPath][mFailedSideEffects.fullyQualifiedName] = true;
              aImmediateSideEffectsProperties.push({
                name: sSideEffectName,
                previouslyFailed: true,
                sideEffects: mFailedSideEffects,
                context: oSideEffectProperty.context
              });
            });
          }

          if (oSideEffectProperty.immediate) {
            var _mFailedSideEffectsNa;

            // SideEffects will be executed immediately after event promise validation
            if (!((_mFailedSideEffectsNa = mFailedSideEffectsName[sSideEffectContextPath]) !== null && _mFailedSideEffectsNa !== void 0 && _mFailedSideEffectsNa[oSideEffectProperty.sideEffects.fullyQualifiedName])) {
              aImmediateSideEffectsProperties.push({
                name: sSideEffectName,
                sideEffects: oSideEffectProperty.sideEffects,
                context: oSideEffectProperty.context
              });
            }
          } else {
            // Add deferred SideEffects to the related dictionary
            _this4._mFieldGroupQueue[sSideEffectName] = _this4._mFieldGroupQueue[sSideEffectName] || {};
            var mSideEffectContextPath = _this4._mFieldGroupQueue[sSideEffectName][sSideEffectContextPath] || {
              promises: [],
              sideEffectProperty: oSideEffectProperty,
              processStarted: false
            };
            mSideEffectContextPath.promises = mSideEffectContextPath.promises.concat([oFieldPromiseForFieldGroup, oFieldGroupPreRequisite]);
            _this4._mFieldGroupQueue[sSideEffectName][sSideEffectContextPath] = mSideEffectContextPath;
          }
        });
        return aImmediateSideEffectsProperties;
      }
      /**
       * Saves the validation status of properties related to a field control.
       *
       * @param {object} oField Field
       * @param {boolean} bSuccess Status of the field validation
       */

    }, {
      key: "_saveFieldPropertiesStatus",
      value: function _saveFieldPropertiesStatus(oField, bSuccess) {
        var _this5 = this;

        var oBindingContext = oField.getBindingContext();

        var sEntityType = this._oSideEffectsService.getEntityTypeFromContext(oBindingContext);

        var mEntityType = this._getEntityTypeFromFQN(sEntityType);

        if (mEntityType) {
          // Retrieves all properties used by the field
          var oFieldBinding = this._getBindingForField(oField);

          var aFieldPaths = oFieldBinding.isA("sap.ui.model.CompositeBinding") ? (oFieldBinding.getBindings() || []).map(function (oBinding) {
            return oBinding.sPath;
          }) : [oFieldBinding.getPath()]; // Stores status for all properties

          aFieldPaths.forEach(function (sFieldPath) {
            var sId = _this5._generateStatusIndex(mEntityType, sFieldPath, oBindingContext);

            if (sId) {
              _this5._aSourcePropertiesFailure[bSuccess ? "delete" : "add"](sId);
            }
          });
        }
      }
      /**
       * Retrieves the property binding to the value of the field.
       *
       * @param oField Field
       * @returns {Binding}  Binding to the value
       */

    }, {
      key: "_getBindingForField",
      value: function _getBindingForField(oField) {
        var oBinding;

        if (oField.isA("sap.m.CheckBox")) {
          oBinding = oField.getBinding("selected");
        } else {
          oBinding = oField.getBinding("value");
        }

        return oBinding;
      }
    }]);

    return SideEffectsControllerExtension;
  }(ControllerExtension), (_applyDecoratedDescriptor(_class2.prototype, "onInit", [_dec2], Object.getOwnPropertyDescriptor(_class2.prototype, "onInit"), _class2.prototype), _applyDecoratedDescriptor(_class2.prototype, "clearPropertiesStatus", [Public, Final], Object.getOwnPropertyDescriptor(_class2.prototype, "clearPropertiesStatus"), _class2.prototype), _applyDecoratedDescriptor(_class2.prototype, "getRegisteredFailedRequests", [Public, Final], Object.getOwnPropertyDescriptor(_class2.prototype, "getRegisteredFailedRequests"), _class2.prototype), _applyDecoratedDescriptor(_class2.prototype, "handleFieldChange", [Public, Final], Object.getOwnPropertyDescriptor(_class2.prototype, "handleFieldChange"), _class2.prototype), _applyDecoratedDescriptor(_class2.prototype, "handleFieldGroupChange", [Public, Final], Object.getOwnPropertyDescriptor(_class2.prototype, "handleFieldGroupChange"), _class2.prototype), _applyDecoratedDescriptor(_class2.prototype, "addControlSideEffects", [Public, Final], Object.getOwnPropertyDescriptor(_class2.prototype, "addControlSideEffects"), _class2.prototype), _applyDecoratedDescriptor(_class2.prototype, "removeFailedSideEffects", [Public, Final], Object.getOwnPropertyDescriptor(_class2.prototype, "removeFailedSideEffects"), _class2.prototype), _applyDecoratedDescriptor(_class2.prototype, "requestSideEffects", [Public, Final], Object.getOwnPropertyDescriptor(_class2.prototype, "requestSideEffects"), _class2.prototype), _applyDecoratedDescriptor(_class2.prototype, "removeControlSideEffects", [Public, Final], Object.getOwnPropertyDescriptor(_class2.prototype, "removeControlSideEffects"), _class2.prototype), _applyDecoratedDescriptor(_class2.prototype, "_addFailedSideEffects", [Private, Final], Object.getOwnPropertyDescriptor(_class2.prototype, "_addFailedSideEffects"), _class2.prototype), _applyDecoratedDescriptor(_class2.prototype, "_getContextForSideEffects", [Private, Final], Object.getOwnPropertyDescriptor(_class2.prototype, "_getContextForSideEffects"), _class2.prototype)), _class2)) || _class);
  return SideEffectsControllerExtension;
}, false);
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIlNpZGVFZmZlY3RzLnRzIl0sIm5hbWVzIjpbIlNpZGVFZmZlY3RzQ29udHJvbGxlckV4dGVuc2lvbiIsIlVJNUNsYXNzIiwiQ29udHJvbGxlckV4dGVuc2lvbk1ldGFkYXRhIiwiT3ZlcnJpZGUiLCJfb1ZpZXciLCJiYXNlIiwiZ2V0VmlldyIsIl9vQXBwQ29tcG9uZW50IiwiQ29tbW9uVXRpbHMiLCJnZXRBcHBDb21wb25lbnQiLCJfb1NpZGVFZmZlY3RzU2VydmljZSIsImdldFNpZGVFZmZlY3RzU2VydmljZSIsIl9tRmllbGRHcm91cFF1ZXVlIiwiX2FTb3VyY2VQcm9wZXJ0aWVzRmFpbHVyZSIsIlNldCIsIl9tRmFpbGVkU2lkZUVmZmVjdHMiLCJjbGVhciIsIm9FdmVudCIsIm9GaWVsZEdyb3VwUHJlUmVxdWlzaXRlIiwibUV2ZW50RmllbGRQcm9wZXJ0aWVzIiwiX2dldEZpZWxkUHJvcGVydGllcyIsImFJbW1lZGlhdGVTaWRlRWZmZWN0c1Byb3BlcnRpZXMiLCJfaW5pdGlhbGl6ZUZpZWxkU2lkZUVmZmVjdHMiLCJiSXNJbW1lZGlhdGVUcmlnZ2VyZWQiLCJfZ2VuZXJhdGVJbW1lZGlhdGVQcm9taXNlIiwidGhlbiIsIlByb21pc2UiLCJhbGwiLCJtYXAiLCJtU2lkZUVmZmVjdHNQcm9wZXJ0eSIsInJlcXVlc3RTaWRlRWZmZWN0cyIsInNpZGVFZmZlY3RzIiwiY29udGV4dCIsImNhdGNoIiwib0Vycm9yIiwiTG9nIiwiZGVidWciLCJmaWx0ZXIiLCJtSW1tZWRpYXRlU2lkZUVmZmVjdHMiLCJwcmV2aW91c2x5RmFpbGVkIiwiZm9yRWFjaCIsIl9hZGRGYWlsZWRTaWRlRWZmZWN0cyIsInRoYXQiLCJhRGVmZXJyZWRTaWRlRWZmZWN0cyIsImFGaWVsZEdyb3VwSWRzIiwiZ2V0UGFyYW1ldGVyIiwiZ2V0RmllbGRHcm91cFJlcXVlc3RQcm9taXNlIiwib0RlZmVycmVkU2lkZUVmZmVjdCIsImJJc1JlcXVlc3RzVHJpZ2dlcmVkIiwib1NpZGVFZmZlY3RQcm9wZXJ0eSIsInNpZGVFZmZlY3RQcm9wZXJ0eSIsIm9Db250ZXh0Iiwic0NvbnRleHRQYXRoIiwiZ2V0UGF0aCIsInNFbnRpdHlUeXBlIiwiZ2V0RW50aXR5VHlwZUZyb21Db250ZXh0IiwibUVudGl0eVR5cGUiLCJfZ2V0RW50aXR5VHlwZUZyb21GUU4iLCJwcm9taXNlcyIsIlNvdXJjZVByb3BlcnRpZXMiLCJldmVyeSIsInNvdXJjZVByb3BlcnR5IiwidHlwZSIsInNJZCIsIl9nZW5lcmF0ZVN0YXR1c0luZGV4IiwidmFsdWUiLCJoYXMiLCJmaW5hbGx5IiwibmFtZSIsInNGaWVsZEdyb3VwSWQiLCJzU2lkZUVmZmVjdE5hbWUiLCJyZXBsYWNlIiwibUNvbnRleHREZWZlcnJlZFNpZGVFZmZlY3RzIiwiT2JqZWN0Iiwia2V5cyIsInByb2Nlc3NTdGFydGVkIiwicHVzaCIsIm9TaWRlRWZmZWN0cyIsImFkZENvbnRyb2xTaWRlRWZmZWN0cyIsImZSZXNvbHZlciIsImZSZWplY3RvciIsIm9Qcm9taXNlIiwicmVzb2x2ZSIsInJlamVjdCIsImFUYXJnZXRzIiwiVGFyZ2V0RW50aXRpZXMiLCJjb25jYXQiLCJUYXJnZXRQcm9wZXJ0aWVzIiwic1RyaWdnZXJBY3Rpb24iLCJUcmlnZ2VyQWN0aW9uIiwiZXhlY3V0ZUFjdGlvbiIsIm9Db250cm9sIiwic0NvbnRyb2xJZCIsImlzQSIsImdldElkIiwicmVtb3ZlQ29udHJvbFNpZGVFZmZlY3RzIiwiYklzTm90QWxyZWFkeUxpc3RlZCIsIm1GYWlsZWRTaWRlRWZmZWN0cyIsImZ1bGx5UXVhbGlmaWVkTmFtZSIsImJQcm9taXNlU3VjY2VzcyIsInByb21pc2UiLCJfc2F2ZUZpZWxkUHJvcGVydGllc1N0YXR1cyIsImZpZWxkIiwib0ZpZWxkIiwic0ZpZWxkSGVscGVySWQiLCJnZXRGaWVsZEhlbHAiLCJvRmlsdGVySGVscCIsInNhcCIsInVpIiwiZ2V0Q29yZSIsImJ5SWQiLCJnZXRPdXRQYXJhbWV0ZXJzIiwib091dFBhcmFtZXRlciIsIm9CaW5kaW5nIiwiZ2V0QmluZGluZyIsInJlcXVlc3RWYWx1ZSIsInNQcm9wZXJ0eVBhdGgiLCJtUHJvcGVydHkiLCJyZXNvbHZlUGF0aCIsIl90eXBlIiwiam9pbiIsInVuZGVmaW5lZCIsIm9Tb3VyY2VGaWVsZCIsInNTaWRlRWZmZWN0RW50aXR5VHlwZSIsIm9CaW5kaW5nQ29udGV4dCIsImdldEJpbmRpbmdDb250ZXh0Iiwib0NvbnRleHRGb3JTaWRlRWZmZWN0cyIsImdldENvbnRleHQiLCJzRnVsbHlRdWFsaWZpZWROYW1lIiwiZ2V0Q29udmVydGVkTWV0YU1vZGVsIiwiZW50aXR5VHlwZXMiLCJmaW5kIiwib0VudGl0eVR5cGUiLCJGaWVsZFJ1bnRpbWUiLCJnZXRGaWVsZFN0YXRlT25DaGFuZ2UiLCJzdGF0ZSIsInZhbGlkaXR5IiwiZ2V0U291cmNlIiwiX2dldEZpZWxkUHJvbWlzZSIsInNpZGVFZmZlY3RzTWFwIiwiX2dldEZpZWxkU2lkZUVmZmVjdHNNYXAiLCJtU2lkZUVmZmVjdHNNYXAiLCJnZXRGaWVsZEdyb3VwSWRzIiwic1ZpZXdFbnRpdHlTZXRTZXROYW1lIiwiZ2V0Vmlld0RhdGEiLCJlbnRpdHlTZXQiLCJvVmlld0VudGl0eVNldCIsImVudGl0eVNldHMiLCJvRW50aXR5U2V0IiwiYklzSW1tZWRpYXRlIiwiaW5kZXhPZiIsInNOYW1lIiwiYVNpZGVFZmZlY3RQYXJ0cyIsInNwbGl0Iiwic1NpZGVFZmZlY3RQYXRoIiwibGVuZ3RoIiwib1NpZGVFZmZlY3QiLCJnZXRPRGF0YUVudGl0eVNpZGVFZmZlY3RzIiwiX2dldENvbnRleHRGb3JTaWRlRWZmZWN0cyIsImltbWVkaWF0ZSIsInNWaWV3RW50aXR5VHlwZSIsImVudGl0eVR5cGUiLCJtRmllbGRQYXRoIiwiZ2V0QWdncmVnYXRpb24iLCJvQ3VzdG9tRGF0YSIsImdldEtleSIsInNGaWVsZFBhdGgiLCJnZXRWYWx1ZSIsIm1Db250cm9sRW50aXR5VHlwZSIsImdldENvbnRyb2xFbnRpdHlTaWRlRWZmZWN0cyIsInNDb250cm9sTmFtZSIsIm9Db250cm9sU2lkZUVmZmVjdHMiLCJpbmNsdWRlcyIsIm1GaWVsZFNpZGVFZmZlY3RzTWFwIiwib0ZpZWxkUHJvbWlzZUZvckZpZWxkR3JvdXAiLCJfZ2VuZXJhdGVGaWVsZEdyb3VwUHJvbWlzZSIsIm1GYWlsZWRTaWRlRWZmZWN0c05hbWUiLCJzU2lkZUVmZmVjdENvbnRleHRQYXRoIiwiYUZhaWxlZFNpZGVFZmZlY3RzIiwibVNpZGVFZmZlY3RDb250ZXh0UGF0aCIsImJTdWNjZXNzIiwib0ZpZWxkQmluZGluZyIsIl9nZXRCaW5kaW5nRm9yRmllbGQiLCJhRmllbGRQYXRocyIsImdldEJpbmRpbmdzIiwic1BhdGgiLCJDb250cm9sbGVyRXh0ZW5zaW9uIiwiUHVibGljIiwiRmluYWwiLCJQcml2YXRlIl0sIm1hcHBpbmdzIjoiO0FBQUE7QUFDQTtBQUNBOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O01BbURNQSw4QixXQURMQyxRQUFRLENBQUMsOENBQUQsRUFBaURDLDJCQUFqRCxDLFVBU1BDLFFBQVEsRTs7Ozs7Ozs7Ozs7OzthQUFULGtCQUNnQjtBQUNmLGFBQUtDLE1BQUwsR0FBZSxJQUFELENBQWNDLElBQWQsQ0FBbUJDLE9BQW5CLEVBQWQ7QUFDQSxhQUFLQyxjQUFMLEdBQXNCQyxXQUFXLENBQUNDLGVBQVosQ0FBNEIsS0FBS0wsTUFBakMsQ0FBdEI7QUFDQSxhQUFLTSxvQkFBTCxHQUE2QixLQUFLSCxjQUFOLENBQTZCSSxxQkFBN0IsRUFBNUI7QUFDQSxhQUFLQyxpQkFBTCxHQUF5QixFQUF6QjtBQUNBLGFBQUtDLHlCQUFMLEdBQWlDLElBQUlDLEdBQUosRUFBakM7QUFDQSxhQUFLQyxtQkFBTCxHQUEyQixFQUEzQjtBQUNBO0FBRUQ7QUFDRDtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7O2FBQ0MsaUNBRXFDO0FBQ3BDLGFBQUtGLHlCQUFMLENBQStCRyxLQUEvQjtBQUNBO0FBRUQ7QUFDRDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7Ozs7YUFDQyx1Q0FFaUU7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O0lBNW5CMkN5RSxtQiw2TkF3QjNDQyxNLEVBQ0FDLEssaUxBWUFELE0sRUFDQUMsSyw2S0FpQkFELE0sRUFDQUMsSyx3S0E2Q0FELE0sRUFDQUMsSyw0S0FrRkFELE0sRUFDQUMsSyw2S0FXQUQsTSxFQUNBQyxLLDBLQWNBRCxNLEVBQ0FDLEssMktBZ0NBRCxNLEVBQ0FDLEssOEtBa0JBQyxPLEVBQ0FELEssK0tBOEdBQyxPLEVBQ0FELEs7U0F3UWE1TCw4QiIsInNvdXJjZVJvb3QiOiIuIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgQ29udHJvbGxlckV4dGVuc2lvbiB9IGZyb20gXCJzYXAvdWkvY29yZS9tdmNcIjtcbmltcG9ydCB7IEJpbmRpbmcsIENvbnRleHQgfSBmcm9tIFwic2FwL3VpL21vZGVsXCI7XG5pbXBvcnQgeyBDaGVja0JveCB9IGZyb20gXCJzYXAvbVwiO1xuaW1wb3J0IHsgQ29udHJvbGxlckV4dGVuc2lvbk1ldGFkYXRhIH0gZnJvbSBcInNhcC9mZS9jb3JlL2NvbnRyb2xsZXJleHRlbnNpb25zXCI7XG5pbXBvcnQgeyBVSTVDbGFzcywgT3ZlcnJpZGUsIFB1YmxpYywgRmluYWwsIFByaXZhdGUgfSBmcm9tIFwiLi4vaGVscGVycy9DbGFzc1N1cHBvcnRcIjtcbmltcG9ydCB7IEFwcENvbXBvbmVudCwgQ29tbW9uVXRpbHMgfSBmcm9tIFwic2FwL2ZlL2NvcmVcIjtcbmltcG9ydCB7IENvbnRyb2wgfSBmcm9tIFwic2FwL3VpL2NvcmVcIjtcbmltcG9ydCB7XG5cdFNpZGVFZmZlY3RzVHlwZSxcblx0Q29udHJvbFNpZGVFZmZlY3RzVHlwZSxcblx0T0RhdGFTaWRlRWZmZWN0c1R5cGUsXG5cdENvbnRyb2xTaWRlRWZmZWN0c0VudGl0eURpY3Rpb25hcnlcbn0gZnJvbSBcInNhcC9mZS9jb3JlL3NlcnZpY2VzL1NpZGVFZmZlY3RzU2VydmljZUZhY3RvcnlcIjtcbmltcG9ydCB7IEZpZWxkUnVudGltZSB9IGZyb20gXCJzYXAvZmUvbWFjcm9zL2ZpZWxkXCI7XG5pbXBvcnQgeyBDb252ZXJ0ZXJPdXRwdXQsIFByb3BlcnR5UGF0aCwgRW50aXR5VHlwZSB9IGZyb20gXCJAc2FwLXV4L3ZvY2FidWxhcmllcy10eXBlc1wiO1xuaW1wb3J0IHsgTG9nIH0gZnJvbSBcInNhcC9iYXNlXCI7XG5cbnR5cGUgRmllbGRDb250cm9sID0gQ29udHJvbCAmIHtcblx0Z2V0RmllbGRIZWxwKCk6IHN0cmluZztcblx0Z2V0RmllbGRHcm91cElkcygpOiBzdHJpbmdbXTtcbn07XG5cbnR5cGUgRmllbGRFdmVudFByb3BlcnR5VHlwZSA9IHtcblx0cHJvbWlzZTogUHJvbWlzZTxhbnk+O1xuXHRmaWVsZDogRmllbGRDb250cm9sO1xuXHRzaWRlRWZmZWN0c01hcDogRmllbGRTaWRlRWZmZWN0RGljdGlvbmFyeTtcbn07XG5cbnR5cGUgRmllbGRTaWRlRWZmZWN0UHJvcGVydHlUeXBlID0ge1xuXHRuYW1lOiBzdHJpbmc7XG5cdGltbWVkaWF0ZT86IGJvb2xlYW47XG5cdGNvbnRleHQ6IENvbnRleHQ8YW55Pjtcblx0c2lkZUVmZmVjdHM6IFNpZGVFZmZlY3RzVHlwZTtcblx0cHJldmlvdXNseUZhaWxlZD86IGJvb2xlYW47XG59O1xuXG50eXBlIEZpZWxkU2lkZUVmZmVjdERpY3Rpb25hcnkgPSBSZWNvcmQ8c3RyaW5nLCBGaWVsZFNpZGVFZmZlY3RQcm9wZXJ0eVR5cGU+O1xuXG50eXBlIEZhaWxlZFNpZGVFZmZlY3REaWN0aW9uYXJ5ID0gUmVjb3JkPHN0cmluZywgU2lkZUVmZmVjdHNUeXBlW10+O1xuXG50eXBlIEZpZWxkR3JvdXBTaWRlRWZmZWN0VHlwZSA9IHtcblx0cHJvbWlzZXM6IFByb21pc2U8YW55PltdO1xuXHRzaWRlRWZmZWN0UHJvcGVydHk6IEZpZWxkU2lkZUVmZmVjdFByb3BlcnR5VHlwZTtcblx0cHJvY2Vzc1N0YXJ0ZWQ/OiBib29sZWFuO1xufTtcblxudHlwZSBGaWVsZEdyb3VwUXVldWVNYXBUeXBlID0ge1xuXHRbc2lkZUVmZmVjdE5hbWU6IHN0cmluZ106IHtcblx0XHRbY29udGV4dFBhdGg6IHN0cmluZ106IEZpZWxkR3JvdXBTaWRlRWZmZWN0VHlwZTtcblx0fTtcbn07XG5cbkBVSTVDbGFzcyhcInNhcC5mZS5jb3JlLmNvbnRyb2xsZXJleHRlbnNpb25zLlNpZGVFZmZlY3RzXCIsIENvbnRyb2xsZXJFeHRlbnNpb25NZXRhZGF0YSlcbmNsYXNzIFNpZGVFZmZlY3RzQ29udHJvbGxlckV4dGVuc2lvbiBleHRlbmRzIENvbnRyb2xsZXJFeHRlbnNpb24ge1xuXHRwcml2YXRlIF9vVmlldzogYW55O1xuXHRwcml2YXRlIF9vQXBwQ29tcG9uZW50ITogQXBwQ29tcG9uZW50O1xuXHRwcml2YXRlIF9tRmllbGRHcm91cFF1ZXVlITogRmllbGRHcm91cFF1ZXVlTWFwVHlwZTtcblx0cHJpdmF0ZSBfYVNvdXJjZVByb3BlcnRpZXNGYWlsdXJlITogU2V0PHN0cmluZz47XG5cdHByaXZhdGUgX29TaWRlRWZmZWN0c1NlcnZpY2UhOiBhbnk7XG5cdHByaXZhdGUgX21GYWlsZWRTaWRlRWZmZWN0cyE6IEZhaWxlZFNpZGVFZmZlY3REaWN0aW9uYXJ5O1xuXG5cdEBPdmVycmlkZSgpXG5cdHB1YmxpYyBvbkluaXQoKSB7XG5cdFx0dGhpcy5fb1ZpZXcgPSAodGhpcyBhcyBhbnkpLmJhc2UuZ2V0VmlldygpO1xuXHRcdHRoaXMuX29BcHBDb21wb25lbnQgPSBDb21tb25VdGlscy5nZXRBcHBDb21wb25lbnQodGhpcy5fb1ZpZXcpO1xuXHRcdHRoaXMuX29TaWRlRWZmZWN0c1NlcnZpY2UgPSAodGhpcy5fb0FwcENvbXBvbmVudCBhcyBhbnkpLmdldFNpZGVFZmZlY3RzU2VydmljZSgpO1xuXHRcdHRoaXMuX21GaWVsZEdyb3VwUXVldWUgPSB7fTtcblx0XHR0aGlzLl9hU291cmNlUHJvcGVydGllc0ZhaWx1cmUgPSBuZXcgU2V0KCk7XG5cdFx0dGhpcy5fbUZhaWxlZFNpZGVFZmZlY3RzID0ge307XG5cdH1cblxuXHQvKipcblx0ICogQ2xlYXIgcmVjb3JkZWQgdmFsaWRhdGlvbiBzdGF0dXMgZm9yIGFsbCBwcm9wZXJ0aWVzLlxuXHQgKlxuXHQgKiBAZnVuY3Rpb25cblx0ICogQG5hbWUgY2xlYXJQcm9wZXJ0aWVzU3RhdHVzXG5cdCAqL1xuXHRAUHVibGljXG5cdEBGaW5hbFxuXHRwdWJsaWMgY2xlYXJQcm9wZXJ0aWVzU3RhdHVzKCk6IHZvaWQge1xuXHRcdHRoaXMuX2FTb3VyY2VQcm9wZXJ0aWVzRmFpbHVyZS5jbGVhcigpO1xuXHR9XG5cblx0LyoqXG5cdCAqIEdldHMgZmFpbGVkIFNpZGVFZmZlY3RzLlxuXHQgKlxuXHQgKiBAZnVuY3Rpb25cblx0ICogQG5hbWUgZ2V0UmVnaXN0ZXJlZEZhaWxlZFJlcXVlc3RzXG5cdCAqIEByZXR1cm5zIHtvYmplY3R9IFJlZ2lzdGVyZWQgU2lkZUVmZmVjdHMgcmVxdWVzdHMgdGhhdCBoYXZlIGZhaWxlZFxuXHQgKi9cblx0QFB1YmxpY1xuXHRARmluYWxcblx0cHVibGljIGdldFJlZ2lzdGVyZWRGYWlsZWRSZXF1ZXN0cygpOiBGYWlsZWRTaWRlRWZmZWN0RGljdGlvbmFyeSB7XG5cdFx0cmV0dXJuIHRoaXMuX21GYWlsZWRTaWRlRWZmZWN0cztcblx0fVxuXG5cdC8qKlxuXHQgKiBNYW5hZ2VzIHRoZSB3b3JrZmxvdyBmb3IgU2lkZUVmZmVjdHMgd2l0aCByZWxhdGVkIGNoYW5nZXMgdG8gYSBmaWVsZFxuXHQgKiBUaGUgZm9sbG93aW5nIHNjZW5hcmlvcyBhcmUgbWFuYWdlZDpcblx0ICogIC0gRXhlY3V0ZTogdHJpZ2dlcnMgaW1tZWRpYXRlIFNpZGVFZmZlY3RzIHJlcXVlc3RzIGlmIHRoZSBwcm9taXNlIGZvciB0aGUgZmllbGQgZXZlbnQgaXMgZnVsZmlsbGVkXG5cdCAqICAtIFJlZ2lzdGVyOiBjYWNoZXMgZGVmZXJyZWQgU2lkZUVmZmVjdHMgdGhhdCB3aWxsIGJlIGV4ZWN1dGVkIHdoZW4gdGhlIEZpZWxkR3JvdXAgaXMgdW5mb2N1c2VkLlxuXHQgKlxuXHQgKiBAZnVuY3Rpb25cblx0ICogQG5hbWUgaGFuZGxlRmllbGRDaGFuZ2Vcblx0ICogQHBhcmFtIHtvYmplY3R9IG9FdmVudCBTQVBVSTUgZXZlbnQgdGhhdCBjb21lcyBmcm9tIGEgZmllbGQgY2hhbmdlXG5cdCAqIEBwYXJhbSB7b2JqZWN0fSBvRmllbGRHcm91cFByZVJlcXVpc2l0ZSBQcm9taXNlIHRvIGJlIGZ1bGZpbGxlZCBiZWZvcmUgZXhlY3V0aW5nIGRlZmVycmVkIFNpZGVFZmZlY3RzXG5cdCAqIEByZXR1cm5zIHtvYmplY3R9ICBQcm9taXNlIG9uIFNpZGVFZmZlY3RzIHJlcXVlc3Qocylcblx0ICovXG5cdEBQdWJsaWNcblx0QEZpbmFsXG5cdHB1YmxpYyBoYW5kbGVGaWVsZENoYW5nZShvRXZlbnQ6IFVJNUV2ZW50LCBvRmllbGRHcm91cFByZVJlcXVpc2l0ZT86IFByb21pc2U8YW55Pik6IFByb21pc2U8YW55PiB7XG5cdFx0Y29uc3QgbUV2ZW50RmllbGRQcm9wZXJ0aWVzID0gdGhpcy5fZ2V0RmllbGRQcm9wZXJ0aWVzKG9FdmVudCksXG5cdFx0XHRhSW1tZWRpYXRlU2lkZUVmZmVjdHNQcm9wZXJ0aWVzOiBGaWVsZFNpZGVFZmZlY3RQcm9wZXJ0eVR5cGVbXSA9IHRoaXMuX2luaXRpYWxpemVGaWVsZFNpZGVFZmZlY3RzKFxuXHRcdFx0XHRtRXZlbnRGaWVsZFByb3BlcnRpZXMsXG5cdFx0XHRcdG9GaWVsZEdyb3VwUHJlUmVxdWlzaXRlXG5cdFx0XHQpO1xuXG5cdFx0bGV0IGJJc0ltbWVkaWF0ZVRyaWdnZXJlZCA9IGZhbHNlO1xuXG5cdFx0cmV0dXJuIHRoaXMuX2dlbmVyYXRlSW1tZWRpYXRlUHJvbWlzZShtRXZlbnRGaWVsZFByb3BlcnRpZXMpXG5cdFx0XHQudGhlbigoKSA9PiB7XG5cdFx0XHRcdGJJc0ltbWVkaWF0ZVRyaWdnZXJlZCA9IHRydWU7XG5cdFx0XHRcdHJldHVybiBQcm9taXNlLmFsbChcblx0XHRcdFx0XHRhSW1tZWRpYXRlU2lkZUVmZmVjdHNQcm9wZXJ0aWVzLm1hcChtU2lkZUVmZmVjdHNQcm9wZXJ0eSA9PiB7XG5cdFx0XHRcdFx0XHRyZXR1cm4gdGhpcy5yZXF1ZXN0U2lkZUVmZmVjdHMobVNpZGVFZmZlY3RzUHJvcGVydHkuc2lkZUVmZmVjdHMsIG1TaWRlRWZmZWN0c1Byb3BlcnR5LmNvbnRleHQpO1xuXHRcdFx0XHRcdH0pIHx8IFtdXG5cdFx0XHRcdCk7XG5cdFx0XHR9KVxuXHRcdFx0LmNhdGNoKG9FcnJvciA9PiB7XG5cdFx0XHRcdGlmIChiSXNJbW1lZGlhdGVUcmlnZ2VyZWQpIHtcblx0XHRcdFx0XHRMb2cuZGVidWcoXCJFcnJvciB3aGlsZSBwcm9jZXNzaW5nIEZpZWxkIFNpZGVFZmZlY3RzXCIsIG9FcnJvcik7XG5cdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0LyoqXG5cdFx0XHRcdFx0ICogU2lkZUVmZmVjdHMgaGF2ZSBub3QgYmVlbiB0cmlnZ2VyZWQgc2luY2UgcHJlUmVxdWlzaXRlIHZhbGlkYXRpb24gZmFpbHMgc28gd2UgbmVlZFxuXHRcdFx0XHRcdCAqIHRvIGtlZXAgcHJldmlvdXNseSBmYWlsZWQgcmVxdWVzdCBhcyBGYWlsZWQgcmVxdWVzdCAodG8gYmUgcmV0cmlnZ2VyIG9uIG5leHQgY2hhbmdlKVxuXHRcdFx0XHRcdCAqL1xuXG5cdFx0XHRcdFx0YUltbWVkaWF0ZVNpZGVFZmZlY3RzUHJvcGVydGllc1xuXHRcdFx0XHRcdFx0LmZpbHRlcihtSW1tZWRpYXRlU2lkZUVmZmVjdHMgPT4gbUltbWVkaWF0ZVNpZGVFZmZlY3RzLnByZXZpb3VzbHlGYWlsZWQgPT09IHRydWUpXG5cdFx0XHRcdFx0XHQuZm9yRWFjaChtSW1tZWRpYXRlU2lkZUVmZmVjdHMgPT5cblx0XHRcdFx0XHRcdFx0dGhpcy5fYWRkRmFpbGVkU2lkZUVmZmVjdHMobUltbWVkaWF0ZVNpZGVFZmZlY3RzLnNpZGVFZmZlY3RzLCBtSW1tZWRpYXRlU2lkZUVmZmVjdHMuY29udGV4dClcblx0XHRcdFx0XHRcdCk7XG5cdFx0XHRcdH1cblx0XHRcdH0pO1xuXHR9XG5cblx0LyoqXG5cdCAqIE1hbmFnZXMgU2lkZUVmZmVjdHMgd2l0aCBhIHJlbGF0ZWQgJ2ZvY3VzIG91dCcgdG8gYSBmaWVsZCBncm91cC5cblx0ICpcblx0ICogQGZ1bmN0aW9uXG5cdCAqIEBuYW1lIGhhbmRsZUZpZWxkR3JvdXBDaGFuZ2Vcblx0ICogQHBhcmFtIHtvYmplY3R9IG9FdmVudCBTQVBVSTUgRXZlbnRcblx0ICogQHJldHVybnMge29iamVjdH0gUHJvbWlzZSBvbiBTaWRlRWZmZWN0cyByZXF1ZXN0KHMpXG5cdCAqL1xuXHRAUHVibGljXG5cdEBGaW5hbFxuXHRwdWJsaWMgaGFuZGxlRmllbGRHcm91cENoYW5nZShvRXZlbnQ6IFVJNUV2ZW50KTogUHJvbWlzZTxhbnk+IHtcblx0XHQvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgQHR5cGVzY3JpcHQtZXNsaW50L25vLXRoaXMtYWxpYXNcblx0XHRjb25zdCB0aGF0ID0gdGhpcyxcblx0XHRcdGFEZWZlcnJlZFNpZGVFZmZlY3RzOiBGaWVsZEdyb3VwU2lkZUVmZmVjdFR5cGVbXSA9IFtdLFxuXHRcdFx0YUZpZWxkR3JvdXBJZHM6IHN0cmluZ1tdID0gb0V2ZW50LmdldFBhcmFtZXRlcihcImZpZWxkR3JvdXBJZHNcIik7XG5cblx0XHRjb25zdCBnZXRGaWVsZEdyb3VwUmVxdWVzdFByb21pc2UgPSBmdW5jdGlvbihvRGVmZXJyZWRTaWRlRWZmZWN0OiBGaWVsZEdyb3VwU2lkZUVmZmVjdFR5cGUpIHtcblx0XHRcdGxldCBiSXNSZXF1ZXN0c1RyaWdnZXJlZCA9IGZhbHNlO1xuXHRcdFx0Y29uc3Qgb1NpZGVFZmZlY3RQcm9wZXJ0eSA9IG9EZWZlcnJlZFNpZGVFZmZlY3Quc2lkZUVmZmVjdFByb3BlcnR5O1xuXHRcdFx0Y29uc3Qgb0NvbnRleHQgPSBvU2lkZUVmZmVjdFByb3BlcnR5LmNvbnRleHQ7XG5cdFx0XHRjb25zdCBzQ29udGV4dFBhdGggPSBvQ29udGV4dC5nZXRQYXRoKCk7XG5cdFx0XHRjb25zdCBzRW50aXR5VHlwZSA9IHRoYXQuX29TaWRlRWZmZWN0c1NlcnZpY2UuZ2V0RW50aXR5VHlwZUZyb21Db250ZXh0KG9Db250ZXh0KTtcblx0XHRcdGNvbnN0IG1FbnRpdHlUeXBlID0gdGhhdC5fZ2V0RW50aXR5VHlwZUZyb21GUU4oc0VudGl0eVR5cGUpO1xuXG5cdFx0XHRyZXR1cm4gUHJvbWlzZS5hbGwob0RlZmVycmVkU2lkZUVmZmVjdC5wcm9taXNlcylcblx0XHRcdFx0LnRoZW4oZnVuY3Rpb24oKSB7XG5cdFx0XHRcdFx0YklzUmVxdWVzdHNUcmlnZ2VyZWQgPSB0cnVlO1xuXG5cdFx0XHRcdFx0Ly9EZWZlcnJlZCBTaWRlRWZmZWN0cyBhcmUgZXhlY3V0ZWQgb25seSBpZiBhbGwgc291cmNlUHJvcGVydGllcyBoYXZlIG5vIHJlZ2lzdGVyZWQgZmFpbHVyZS5cblx0XHRcdFx0XHRpZiAoXG5cdFx0XHRcdFx0XHRtRW50aXR5VHlwZSAmJlxuXHRcdFx0XHRcdFx0KG9TaWRlRWZmZWN0UHJvcGVydHkuc2lkZUVmZmVjdHMuU291cmNlUHJvcGVydGllcyBhcyBQcm9wZXJ0eVBhdGhbXSkuZXZlcnkoc291cmNlUHJvcGVydHkgPT4ge1xuXHRcdFx0XHRcdFx0XHRpZiAoc291cmNlUHJvcGVydHkudHlwZSA9PT0gXCJQcm9wZXJ0eVBhdGhcIikge1xuXHRcdFx0XHRcdFx0XHRcdGNvbnN0IHNJZCA9IHRoYXQuX2dlbmVyYXRlU3RhdHVzSW5kZXgobUVudGl0eVR5cGUsIHNvdXJjZVByb3BlcnR5LnZhbHVlLCBvQ29udGV4dCk7XG5cdFx0XHRcdFx0XHRcdFx0aWYgKHNJZCkge1xuXHRcdFx0XHRcdFx0XHRcdFx0cmV0dXJuICF0aGF0Ll9hU291cmNlUHJvcGVydGllc0ZhaWx1cmUuaGFzKHNJZCk7XG5cdFx0XHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHRcdHJldHVybiB0cnVlO1xuXHRcdFx0XHRcdFx0fSlcblx0XHRcdFx0XHQpIHtcblx0XHRcdFx0XHRcdHJldHVybiB0aGF0LnJlcXVlc3RTaWRlRWZmZWN0cyhvU2lkZUVmZmVjdFByb3BlcnR5LnNpZGVFZmZlY3RzLCBvU2lkZUVmZmVjdFByb3BlcnR5LmNvbnRleHQpO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0XHRyZXR1cm4gbnVsbDtcblx0XHRcdFx0fSlcblx0XHRcdFx0LmNhdGNoKG9FcnJvciA9PiB7XG5cdFx0XHRcdFx0aWYgKGJJc1JlcXVlc3RzVHJpZ2dlcmVkKSB7XG5cdFx0XHRcdFx0XHRMb2cuZGVidWcoXCJFcnJvciB3aGlsZSBwcm9jZXNzaW5nIEZpZWxkR3JvdXAgU2lkZUVmZmVjdHMgb24gY29udGV4dCBcIiArIHNDb250ZXh0UGF0aCwgb0Vycm9yKTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH0pXG5cdFx0XHRcdC5maW5hbGx5KCgpID0+IHtcblx0XHRcdFx0XHRkZWxldGUgdGhhdC5fbUZpZWxkR3JvdXBRdWV1ZVtvU2lkZUVmZmVjdFByb3BlcnR5Lm5hbWVdW3NDb250ZXh0UGF0aF07XG5cdFx0XHRcdH0pO1xuXHRcdH07XG5cblx0XHRhRmllbGRHcm91cElkcy5mb3JFYWNoKHNGaWVsZEdyb3VwSWQgPT4ge1xuXHRcdFx0LyoqXG5cdFx0XHQgKiBzdHJpbmcgXCIkJEltbWVkaWF0ZVJlcXVlc3RcIiBpcyBhZGRlZCB0byB0aGUgU2lkZUVmZmVjdHMgbmFtZSBkdXJpbmcgdGVtcGxhdGluZyB0byBrbm93XG5cdFx0XHQgKiBpZiB0aGlzIFNpZGVFZmZlY3RzIG11c3QgYmUgaW1tZWRpYXRlbHkgZXhlY3V0ZWQgcmVxdWVzdGVkIChvbiBmaWVsZCBjaGFuZ2UpIG9yIG11c3Rcblx0XHRcdCAqIGJlIGRlZmVycmVkIChvbiBmaWVsZCBncm91cCBmb2N1cyBvdXQpXG5cdFx0XHQgKlxuXHRcdFx0ICovXG5cdFx0XHRjb25zdCBzU2lkZUVmZmVjdE5hbWU6IHN0cmluZyA9IHNGaWVsZEdyb3VwSWQucmVwbGFjZShcIiQkSW1tZWRpYXRlUmVxdWVzdFwiLCBcIlwiKTtcblx0XHRcdGNvbnN0IG1Db250ZXh0RGVmZXJyZWRTaWRlRWZmZWN0cyA9IHRoYXQuX21GaWVsZEdyb3VwUXVldWU/LltzU2lkZUVmZmVjdE5hbWVdO1xuXHRcdFx0aWYgKG1Db250ZXh0RGVmZXJyZWRTaWRlRWZmZWN0cykge1xuXHRcdFx0XHRPYmplY3Qua2V5cyhtQ29udGV4dERlZmVycmVkU2lkZUVmZmVjdHMpLmZvckVhY2goc0NvbnRleHRQYXRoID0+IHtcblx0XHRcdFx0XHRjb25zdCBvRGVmZXJyZWRTaWRlRWZmZWN0ID0gbUNvbnRleHREZWZlcnJlZFNpZGVFZmZlY3RzW3NDb250ZXh0UGF0aF07XG5cdFx0XHRcdFx0aWYgKCFvRGVmZXJyZWRTaWRlRWZmZWN0LnByb2Nlc3NTdGFydGVkKSB7XG5cdFx0XHRcdFx0XHRvRGVmZXJyZWRTaWRlRWZmZWN0LnByb2Nlc3NTdGFydGVkID0gdHJ1ZTtcblx0XHRcdFx0XHRcdGFEZWZlcnJlZFNpZGVFZmZlY3RzLnB1c2gob0RlZmVycmVkU2lkZUVmZmVjdCk7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9KTtcblx0XHRcdH1cblx0XHR9KTtcblxuXHRcdHJldHVybiBQcm9taXNlLmFsbChcblx0XHRcdGFEZWZlcnJlZFNpZGVFZmZlY3RzLm1hcChvRGVmZXJyZWRTaWRlRWZmZWN0ID0+IHtcblx0XHRcdFx0cmV0dXJuIGdldEZpZWxkR3JvdXBSZXF1ZXN0UHJvbWlzZShvRGVmZXJyZWRTaWRlRWZmZWN0KTtcblx0XHRcdH0pXG5cdFx0KTtcblx0fVxuXG5cdC8qKlxuXHQgKiBBZGRzIGEgU2lkZUVmZmVjdHMgY29udHJvbC5cblx0ICpcblx0ICogQGZ1bmN0aW9uXG5cdCAqIEBuYW1lIGFkZENvbnRyb2xTaWRlRWZmZWN0c1xuXHQgKiBAcGFyYW0ge3N0cmluZ30gc0VudGl0eVR5cGUgTmFtZSBvZiB0aGUgZW50aXR5IHdoZXJlIHRoZSBTaWRlRWZmZWN0cyBjb250cm9sIHdpbGwgYmUgcmVnaXN0ZXJlZFxuXHQgKiBAcGFyYW0ge29iamVjdH0gb1NpZGVFZmZlY3RzIFNpZGVFZmZlY3RzIHRvIHJlZ2lzdGVyLiBFbnN1cmUgdGhlIHNvdXJjZUNvbnRyb2xJZCBtYXRjaGVzIHRoZSBhc3NvY2lhdGVkIFNBUFVJNSBjb250cm9sIElELlxuXHQgKlxuXHQgKi9cblx0QFB1YmxpY1xuXHRARmluYWxcblx0cHVibGljIGFkZENvbnRyb2xTaWRlRWZmZWN0cyhzRW50aXR5VHlwZTogc3RyaW5nLCBvU2lkZUVmZmVjdHM6IE9taXQ8Q29udHJvbFNpZGVFZmZlY3RzVHlwZSwgXCJmdWxseVF1YWxpZmllZE5hbWVcIj4pOiB2b2lkIHtcblx0XHR0aGlzLl9vU2lkZUVmZmVjdHNTZXJ2aWNlLmFkZENvbnRyb2xTaWRlRWZmZWN0cyhzRW50aXR5VHlwZSwgb1NpZGVFZmZlY3RzKTtcblx0fVxuXG5cdC8qKlxuXHQgKiBSZW1vdmVzIHRoZSBxdWV1ZSBjb250YWluaW5nIHRoZSBmYWlsZWQgU2lkZUVmZmVjdHMuXG5cdCAqXG5cdCAqIEBmdW5jdGlvblxuXHQgKiBAbmFtZSByZW1vdmVGYWlsZWRTaWRlRWZmZWN0c1xuXHQgKi9cblx0QFB1YmxpY1xuXHRARmluYWxcblx0cHVibGljIHJlbW92ZUZhaWxlZFNpZGVFZmZlY3RzKCk6IHZvaWQge1xuXHRcdHRoaXMuX21GYWlsZWRTaWRlRWZmZWN0cyA9IHt9O1xuXHR9XG5cblx0LyoqXG5cdCAqIFJlcXVlc3QgU2lkZUVmZmVjdHMgb24gYSBzcGVjaWZpYyBjb250ZXh0LlxuXHQgKlxuXHQgKiBAZnVuY3Rpb25cblx0ICogQG5hbWUgcmVxdWVzdFNpZGVFZmZlY3RzXG5cdCAqIEBwYXJhbSB7b2JqZWN0fSBvU2lkZUVmZmVjdHMgU2lkZUVmZmVjdHMgdG8gYmUgZXhlY3V0ZWRcblx0ICogQHBhcmFtIHtvYmplY3R9IG9Db250ZXh0IENvbnRleHQgd2hlcmUgU2lkZUVmZmVjdHMgbmVlZCB0byBiZSBleGVjdXRlZFxuXHQgKiBAcmV0dXJucyB7b2JqZWN0fSBTaWRlRWZmZWN0cyByZXF1ZXN0IG9uIFNBUFVJNSBjb250ZXh0XG5cdCAqL1xuXHRAUHVibGljXG5cdEBGaW5hbFxuXHRwdWJsaWMgcmVxdWVzdFNpZGVFZmZlY3RzKG9TaWRlRWZmZWN0czogU2lkZUVmZmVjdHNUeXBlLCBvQ29udGV4dDogQ29udGV4dDxhbnk+KTogUHJvbWlzZTxhbnk+IHtcblx0XHRsZXQgZlJlc29sdmVyOiBhbnksIGZSZWplY3RvcjogYW55O1xuXHRcdGNvbnN0IG9Qcm9taXNlID0gbmV3IFByb21pc2UoZnVuY3Rpb24ocmVzb2x2ZSwgcmVqZWN0KSB7XG5cdFx0XHRmUmVzb2x2ZXIgPSByZXNvbHZlO1xuXHRcdFx0ZlJlamVjdG9yID0gcmVqZWN0O1xuXHRcdH0pO1xuXHRcdGNvbnN0IGFUYXJnZXRzOiBhbnlbXSA9ICgob1NpZGVFZmZlY3RzLlRhcmdldEVudGl0aWVzIGFzIGFueVtdKSB8fCBbXSkuY29uY2F0KChvU2lkZUVmZmVjdHMuVGFyZ2V0UHJvcGVydGllcyBhcyBhbnlbXSkgfHwgW10pLFxuXHRcdFx0c1RyaWdnZXJBY3Rpb246IFN0cmluZyB8IHVuZGVmaW5lZCA9IChvU2lkZUVmZmVjdHMgYXMgT0RhdGFTaWRlRWZmZWN0c1R5cGUpLlRyaWdnZXJBY3Rpb247XG5cblx0XHRpZiAoc1RyaWdnZXJBY3Rpb24pIHtcblx0XHRcdHRoaXMuX29TaWRlRWZmZWN0c1NlcnZpY2UuZXhlY3V0ZUFjdGlvbihzVHJpZ2dlckFjdGlvbiwgb0NvbnRleHQpO1xuXHRcdH1cblxuXHRcdHRoaXMuX29TaWRlRWZmZWN0c1NlcnZpY2Vcblx0XHRcdC5yZXF1ZXN0U2lkZUVmZmVjdHMoYVRhcmdldHMsIG9Db250ZXh0KVxuXHRcdFx0LnRoZW4oKCkgPT4gZlJlc29sdmVyKCkpXG5cdFx0XHQuY2F0Y2goKG9FcnJvcjogYW55KSA9PiB7XG5cdFx0XHRcdHRoaXMuX2FkZEZhaWxlZFNpZGVFZmZlY3RzKG9TaWRlRWZmZWN0cywgb0NvbnRleHQpO1xuXHRcdFx0XHRmUmVqZWN0b3Iob0Vycm9yKTtcblx0XHRcdH0pO1xuXG5cdFx0cmV0dXJuIG9Qcm9taXNlO1xuXHR9XG5cblx0LyoqXG5cdCAqIFJlbW92ZXMgU2lkZUVmZmVjdHMgY3JlYXRlZCBieSBhIGNvbnRyb2wuXG5cdCAqXG5cdCAqIEBmdW5jdGlvblxuXHQgKiBAbmFtZSByZW1vdmVDb250cm9sU2lkZUVmZmVjdHNcblx0ICogQHBhcmFtIHtvYmplY3R9IG9Db250cm9sIFNBUFVJNSBDb250cm9sXG5cdCAqL1xuXHRAUHVibGljXG5cdEBGaW5hbFxuXHRwdWJsaWMgcmVtb3ZlQ29udHJvbFNpZGVFZmZlY3RzKG9Db250cm9sOiBDb250cm9sKTogdm9pZCB7XG5cdFx0Y29uc3Qgc0NvbnRyb2xJZCA9IG9Db250cm9sICYmIG9Db250cm9sLmlzQSAmJiBvQ29udHJvbC5pc0EoXCJzYXAudWkuYmFzZS5NYW5hZ2VkT2JqZWN0XCIpICYmIG9Db250cm9sLmdldElkKCk7XG5cblx0XHRpZiAoc0NvbnRyb2xJZCkge1xuXHRcdFx0dGhpcy5fb1NpZGVFZmZlY3RzU2VydmljZS5yZW1vdmVDb250cm9sU2lkZUVmZmVjdHMoc0NvbnRyb2xJZCk7XG5cdFx0fVxuXHR9XG5cblx0LyoqXG5cdCAqIEFkZHMgU2lkZUVmZmVjdHMgdG8gdGhlIHF1ZXVlIG9mIHRoZSBmYWlsZWQgU2lkZUVmZmVjdHNcblx0ICogVGhlIFNpZGVFZmZlY3RzIHdpbGwgYmUgcmV0cmlnZ2VyZWQgb24gdGhlIG5leHQgY2hhbmdlIG9uIHRoZSBzYW1lIGNvbnRleHQuXG5cdCAqXG5cdCAqIEBmdW5jdGlvblxuXHQgKiBAbmFtZSBfYWRkRmFpbGVkU2lkZUVmZmVjdHNcblx0ICogQHBhcmFtIHtvYmplY3R9IG9TaWRlRWZmZWN0cyBTaWRlRWZmZWN0cyB0aGF0IG5lZWQgdG8gYmUgcmV0cmlnZ2VyZWRcblx0ICogQHBhcmFtIHtvYmplY3R9IG9Db250ZXh0IENvbnRleHQgd2hlcmUgU2lkZUVmZmVjdHMgaGF2ZSBmYWlsZWRcblx0ICovXG5cdEBQcml2YXRlXG5cdEBGaW5hbFxuXHRwcml2YXRlIF9hZGRGYWlsZWRTaWRlRWZmZWN0cyhvU2lkZUVmZmVjdHM6IFNpZGVFZmZlY3RzVHlwZSwgb0NvbnRleHQ6IENvbnRleHQ8YW55Pik6IHZvaWQge1xuXHRcdGNvbnN0IHNDb250ZXh0UGF0aDogc3RyaW5nID0gb0NvbnRleHQuZ2V0UGF0aCgpO1xuXHRcdHRoaXMuX21GYWlsZWRTaWRlRWZmZWN0c1tzQ29udGV4dFBhdGhdID0gdGhpcy5fbUZhaWxlZFNpZGVFZmZlY3RzW3NDb250ZXh0UGF0aF0gfHwgW107XG5cdFx0Y29uc3QgYklzTm90QWxyZWFkeUxpc3RlZCA9IHRoaXMuX21GYWlsZWRTaWRlRWZmZWN0c1tzQ29udGV4dFBhdGhdLmV2ZXJ5KFxuXHRcdFx0bUZhaWxlZFNpZGVFZmZlY3RzID0+IG9TaWRlRWZmZWN0cy5mdWxseVF1YWxpZmllZE5hbWUgIT09IG1GYWlsZWRTaWRlRWZmZWN0cy5mdWxseVF1YWxpZmllZE5hbWVcblx0XHQpO1xuXHRcdGlmIChiSXNOb3RBbHJlYWR5TGlzdGVkKSB7XG5cdFx0XHR0aGlzLl9tRmFpbGVkU2lkZUVmZmVjdHNbc0NvbnRleHRQYXRoXS5wdXNoKG9TaWRlRWZmZWN0cyk7XG5cdFx0fVxuXHR9XG5cblx0LyoqXG5cdCAqIEdlbmVyYXRlcyB0aGUgcHJvbWlzZSBmb3IgdGhlIGZpZWxkIGdyb3VwIHRoYXQgaXMgcmVxdWlyZWQgYmVmb3JlIHJlcXVlc3RpbmcgU2lkZUVmZmVjdHMuXG5cdCAqIElmIHRoZSBwcm9taXNlIGlzIHJlamVjdGVkIGFuZCBvbmx5IHRoZSBmaWVsZCByZXF1aXJlcyB0aGUgU2lkZUVmZmVjdHMgb24gdGhpcyBjb250ZXh0LCB0aGUgU2lkZUVmZmVjdHMgYXJlIHJlbW92ZWQgZnJvbSB0aGVcblx0ICogU2lkZUVmZmVjdHMgcXVldWUuXG5cdCAqXG5cdCAqIEBmdW5jdGlvblxuXHQgKiBAbmFtZSBfZ2VuZXJhdGVGaWVsZEdyb3VwUHJvbWlzZVxuXHQgKiBAcGFyYW0ge29iamVjdH0gbUV2ZW50RmllbGRQcm9wZXJ0aWVzIEZpZWxkIHByb3BlcnRpZXNcblx0ICogQHJldHVybnMge29iamVjdH0gUHJvbWlzZSB0byBiZSB1c2VkIGZvciB0aGUgdmFsaWRhdGlvbiBvZiB0aGUgZmllbGRcblx0ICovXG5cdHByaXZhdGUgX2dlbmVyYXRlRmllbGRHcm91cFByb21pc2UobUV2ZW50RmllbGRQcm9wZXJ0aWVzOiBGaWVsZEV2ZW50UHJvcGVydHlUeXBlKTogUHJvbWlzZTxhbnk+IHtcblx0XHQvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgQHR5cGVzY3JpcHQtZXNsaW50L25vLXRoaXMtYWxpYXNcblx0XHRjb25zdCB0aGF0ID0gdGhpcztcblxuXHRcdGxldCBiUHJvbWlzZVN1Y2Nlc3MgPSB0cnVlO1xuXHRcdHJldHVybiBtRXZlbnRGaWVsZFByb3BlcnRpZXMucHJvbWlzZVxuXHRcdFx0LnRoZW4oZnVuY3Rpb24oKSB7XG5cdFx0XHRcdHJldHVybiBiUHJvbWlzZVN1Y2Nlc3M7XG5cdFx0XHR9KVxuXHRcdFx0LmNhdGNoKGZ1bmN0aW9uKCkge1xuXHRcdFx0XHRiUHJvbWlzZVN1Y2Nlc3MgPSBmYWxzZTtcblx0XHRcdFx0cmV0dXJuIGJQcm9taXNlU3VjY2Vzcztcblx0XHRcdH0pXG5cdFx0XHQuZmluYWxseSgoKSA9PiB7XG5cdFx0XHRcdC8qKlxuXHRcdFx0XHQgKiBOZWVkIHRvIHN0b3JlIHRoZSBzdGF0dXMgb2YgcHJvcGVydGllcyByZWxhdGVkIHRvIHRoaXMgZmllbGQgZm9yIGRlZmVycmVkIFNpZGVFZmZlY3RzXG5cdFx0XHRcdCAqIHNpbmNlIGFsbCBTb3VyY2VQcm9wZXJ0aWVzIGZvciB0aGlzIGtpbmQgb2YgU2lkZUVmZmVjdHMgbXVzdCBiZSB2YWxpZFxuXHRcdFx0XHQgKi9cblx0XHRcdFx0dGhhdC5fc2F2ZUZpZWxkUHJvcGVydGllc1N0YXR1cyhtRXZlbnRGaWVsZFByb3BlcnRpZXMuZmllbGQsIGJQcm9taXNlU3VjY2Vzcyk7XG5cdFx0XHR9KTtcblx0fVxuXG5cdC8qKlxuXHQgKiBHZW5lcmF0ZXMgdGhlIHByb21pc2UgZm9yIHRoZSBmaWVsZCB0aGF0IGlzIHJlcXVpcmVkIGJlZm9yZSByZXF1ZXN0aW5nIGltbWVkaWF0ZSBTaWRlRWZmZWN0cy5cblx0ICpcblx0ICogQGZ1bmN0aW9uXG5cdCAqIEBuYW1lIF9nZW5lcmF0ZUltbWVkaWF0ZVByb21pc2Vcblx0ICogQHBhcmFtIHtvYmplY3R9IG1FdmVudEZpZWxkUHJvcGVydGllcyBGaWVsZCBwcm9wZXJ0aWVzXG5cdCAqIEByZXR1cm5zIHtvYmplY3R9IFByb21pc2UgdG8gYmUgdXNlZCBmb3IgdGhlIHZhbGlkYXRpb24gb2YgdGhlIGZpZWxkXG5cdCAqL1xuXHRwcml2YXRlIF9nZW5lcmF0ZUltbWVkaWF0ZVByb21pc2UobUV2ZW50RmllbGRQcm9wZXJ0aWVzOiBGaWVsZEV2ZW50UHJvcGVydHlUeXBlKTogUHJvbWlzZTxhbnk+IHtcblx0XHRjb25zdCBvUHJvbWlzZSA9IG1FdmVudEZpZWxkUHJvcGVydGllcy5wcm9taXNlO1xuXHRcdHJldHVybiBvUHJvbWlzZS50aGVuKGZ1bmN0aW9uKCkge1xuXHRcdFx0LyoqXG5cdFx0XHQgKiBJZiB0aGUgZmllbGQgZ2V0cyBhIEZpZWxkSGVscGVyLCB3ZSBuZWVkIHRvIHdhaXQgdW50aWwgYWxsIGZpZWxkcyBjaGFuZ2VkIGJ5IHRoaXMgRmllbGRIZWxwZXIgaGF2ZSBiZWVuIHNldC5cblx0XHRcdCAqIFRvIGFjaGlldmUgdGhpcywgd2UgZW5zdXJlIHRoYXQgYWxsIHJlbGF0ZWQgYmluZGluZ3MgaGF2ZSBiZWVuIHJlc29sdmVkLlxuXHRcdFx0ICpcblx0XHRcdCAqIFRoaXMgcmVzb2x1dGlvbiBwcm9jZXNzIGlzIG5vdCBtYW5hZ2VkIGJ5IHRoZSBGaWVsZCBFdmVudCBQcm9taXNlLCBzbyBmb3IgZmFzdCB1c2VyIGFjdGlvbnMgKGxpa2UgYXV0b21hdGlvbikgaXQgY2FuIGxvY2sgdGhlIG1vZGVsXG5cdFx0XHQgKiBhbmQgbm8gcmVxdWVzdCBjYW4gYmUgZXhlY3V0ZWQuXG5cdFx0XHQgKi9cblx0XHRcdGNvbnN0IG9GaWVsZCA9IG1FdmVudEZpZWxkUHJvcGVydGllcy5maWVsZDtcblx0XHRcdGNvbnN0IHNGaWVsZEhlbHBlcklkID0gb0ZpZWxkLmdldEZpZWxkSGVscCAmJiBvRmllbGQuZ2V0RmllbGRIZWxwKCk7XG5cdFx0XHRpZiAoc0ZpZWxkSGVscGVySWQpIHtcblx0XHRcdFx0Y29uc3Qgb0ZpbHRlckhlbHA6IGFueSA9IHNhcC51aS5nZXRDb3JlKCkuYnlJZChzRmllbGRIZWxwZXJJZCk7XG5cdFx0XHRcdGlmIChvRmlsdGVySGVscCkge1xuXHRcdFx0XHRcdHJldHVybiBQcm9taXNlLmFsbChcblx0XHRcdFx0XHRcdChvRmlsdGVySGVscC5nZXRPdXRQYXJhbWV0ZXJzKCkgYXMgYW55W10pLm1hcChvT3V0UGFyYW1ldGVyID0+IHtcblx0XHRcdFx0XHRcdFx0Y29uc3Qgb0JpbmRpbmcgPSBvT3V0UGFyYW1ldGVyLmdldEJpbmRpbmcoXCJ2YWx1ZVwiKTtcblx0XHRcdFx0XHRcdFx0cmV0dXJuIG9CaW5kaW5nID8gb0JpbmRpbmcucmVxdWVzdFZhbHVlKCkgOiBQcm9taXNlLnJlc29sdmUoKTtcblx0XHRcdFx0XHRcdH0pXG5cdFx0XHRcdFx0KTtcblx0XHRcdFx0fVxuXHRcdFx0fVxuXHRcdFx0cmV0dXJuIFByb21pc2UuYWxsKFtdKTtcblx0XHR9KTtcblx0fVxuXG5cdC8qKlxuXHQgKiBHZW5lcmF0ZXMgYSBzdGF0dXMgaW5kZXguXG5cdCAqXG5cdCAqIEBmdW5jdGlvblxuXHQgKiBAbmFtZSBfZ2VuZXJhdGVTdGF0dXNJbmRleFxuXHQgKiBAcGFyYW0ge29iamVjdH0gbUVudGl0eVR5cGUgVGhlIGVudGl0eSB0eXBlXG5cdCAqIEBwYXJhbSB7c3RyaW5nfSBzUHJvcGVydHlQYXRoIFRoZSBwcm9wZXJ0eSBwYXRoXG5cdCAqIEBwYXJhbSB7b2JqZWN0fSBvQ29udGV4dCBTQVBVSTUgQ29udGV4dFxuXHQgKiBAcmV0dXJucyB7c3RyaW5nIHwgdW5kZWZpbmVkfSBJbmRleFxuXHQgKi9cblx0cHJpdmF0ZSBfZ2VuZXJhdGVTdGF0dXNJbmRleChtRW50aXR5VHlwZTogRW50aXR5VHlwZSwgc1Byb3BlcnR5UGF0aDogc3RyaW5nLCBvQ29udGV4dDogQ29udGV4dDxhbnk+KTogc3RyaW5nIHwgdW5kZWZpbmVkIHtcblx0XHRjb25zdCBzQ29udGV4dFBhdGggPSBvQ29udGV4dC5nZXRQYXRoKCk7XG5cdFx0Y29uc3QgbVByb3BlcnR5ID0gbUVudGl0eVR5cGUucmVzb2x2ZVBhdGgoc1Byb3BlcnR5UGF0aCk7XG5cdFx0aWYgKG1Qcm9wZXJ0eSkge1xuXHRcdFx0aWYgKG1Qcm9wZXJ0eSAmJiBtUHJvcGVydHkuX3R5cGUgPT09IFwiUHJvcGVydHlcIikge1xuXHRcdFx0XHRyZXR1cm4gW21Qcm9wZXJ0eS5mdWxseVF1YWxpZmllZE5hbWUsIHNDb250ZXh0UGF0aF0uam9pbihcIl9fXCIpO1xuXHRcdFx0fVxuXHRcdH1cblx0XHRyZXR1cm4gdW5kZWZpbmVkO1xuXHR9XG5cblx0LyoqXG5cdCAqIEdldHMgdGhlIGFwcHJvcHJpYXRlIGNvbnRleHQgb24gd2hpY2ggU2lkZUVmZmVjdHMgY2FuIGJlIHJlcXVlc3RlZC5cblx0ICogVGhlIGNvcnJlY3Qgb25lIG11c3QgaGF2ZSB0aGUgYmluZGluZyBwYXJhbWV0ZXIgJCRwYXRjaFdpdGhvdXRTaWRlRWZmZWN0cy5cblx0ICpcblx0ICogQGZ1bmN0aW9uXG5cdCAqIEBuYW1lIF9nZXRDb250ZXh0Rm9yU2lkZUVmZmVjdHNcblx0ICogQHBhcmFtIHtvYmplY3R9IG9Tb3VyY2VGaWVsZCBGaWVsZFxuXHQgKiBAcGFyYW0ge3N0cmluZ30gc1NpZGVFZmZlY3RFbnRpdHlUeXBlIFRhcmdldCBlbnRpdHkgdHlwZSBvZiB0aGUgU2lkZUVmZmVjdHMgYW5ub3RhdGlvblxuXHQgKiBAcmV0dXJucyB7b2JqZWN0fSBTQVBVSTUgQ29udGV4dFxuXHQgKi9cblx0QFByaXZhdGVcblx0QEZpbmFsXG5cdHByaXZhdGUgX2dldENvbnRleHRGb3JTaWRlRWZmZWN0cyhvU291cmNlRmllbGQ6IEZpZWxkQ29udHJvbCwgc1NpZGVFZmZlY3RFbnRpdHlUeXBlOiBzdHJpbmcpOiBDb250ZXh0PGFueT4gfCB1bmRlZmluZWQge1xuXHRcdGNvbnN0IG9CaW5kaW5nQ29udGV4dCA9IG9Tb3VyY2VGaWVsZC5nZXRCaW5kaW5nQ29udGV4dCgpO1xuXHRcdGxldCBvQ29udGV4dEZvclNpZGVFZmZlY3RzID0gb0JpbmRpbmdDb250ZXh0LFxuXHRcdFx0c0VudGl0eVR5cGUgPSB0aGlzLl9vU2lkZUVmZmVjdHNTZXJ2aWNlLmdldEVudGl0eVR5cGVGcm9tQ29udGV4dChvQmluZGluZ0NvbnRleHQpO1xuXG5cdFx0aWYgKHNTaWRlRWZmZWN0RW50aXR5VHlwZSAhPT0gc0VudGl0eVR5cGUpIHtcblx0XHRcdG9Db250ZXh0Rm9yU2lkZUVmZmVjdHMgPSAob0JpbmRpbmdDb250ZXh0IGFzIGFueSkuZ2V0QmluZGluZygpLmdldENvbnRleHQoKTtcblx0XHRcdGlmIChvQ29udGV4dEZvclNpZGVFZmZlY3RzKSB7XG5cdFx0XHRcdHNFbnRpdHlUeXBlID0gdGhpcy5fb1NpZGVFZmZlY3RzU2VydmljZS5nZXRFbnRpdHlUeXBlRnJvbUNvbnRleHQob0NvbnRleHRGb3JTaWRlRWZmZWN0cyk7XG5cdFx0XHRcdGlmIChzU2lkZUVmZmVjdEVudGl0eVR5cGUgIT09IHNFbnRpdHlUeXBlKSB7XG5cdFx0XHRcdFx0b0NvbnRleHRGb3JTaWRlRWZmZWN0cyA9IChvQ29udGV4dEZvclNpZGVFZmZlY3RzIGFzIGFueSkuZ2V0QmluZGluZygpLmdldENvbnRleHQoKTtcblx0XHRcdFx0XHRpZiAob0NvbnRleHRGb3JTaWRlRWZmZWN0cykge1xuXHRcdFx0XHRcdFx0c0VudGl0eVR5cGUgPSB0aGlzLl9vU2lkZUVmZmVjdHNTZXJ2aWNlLmdldEVudGl0eVR5cGVGcm9tQ29udGV4dChvQ29udGV4dEZvclNpZGVFZmZlY3RzKTtcblx0XHRcdFx0XHRcdGlmIChzU2lkZUVmZmVjdEVudGl0eVR5cGUgIT09IHNFbnRpdHlUeXBlKSB7XG5cdFx0XHRcdFx0XHRcdHJldHVybiB1bmRlZmluZWQ7XG5cdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9XG5cdFx0XHR9XG5cdFx0fVxuXG5cdFx0cmV0dXJuIG9Db250ZXh0Rm9yU2lkZUVmZmVjdHMgfHwgdW5kZWZpbmVkO1xuXHR9XG5cblx0LyoqXG5cdCAqIFJldHJpZXZlcyB0aGUgRW50aXR5VHlwZSBiYXNlZCBvbiBpdHMgZnVsbHktcXVhbGlmaWVkIG5hbWUuXG5cdCAqXG5cdCAqIEBwYXJhbSB7c3RyaW5nfSBzRnVsbHlRdWFsaWZpZWROYW1lIFRoZSBmdWxseS1xdWFsaWZpZWQgbmFtZVxuXHQgKiBAcmV0dXJucyB7b2JqZWN0fSBUaGUgZW50aXR5IHR5cGVcblx0ICovXG5cdHByaXZhdGUgX2dldEVudGl0eVR5cGVGcm9tRlFOKHNGdWxseVF1YWxpZmllZE5hbWU6IHN0cmluZyk6IEVudGl0eVR5cGUgfCB1bmRlZmluZWQge1xuXHRcdGNvbnN0IG1FbnRpdHlUeXBlID0gKHRoaXMuX29TaWRlRWZmZWN0c1NlcnZpY2UuZ2V0Q29udmVydGVkTWV0YU1vZGVsKCkgYXMgQ29udmVydGVyT3V0cHV0KS5lbnRpdHlUeXBlcy5maW5kKG9FbnRpdHlUeXBlID0+IHtcblx0XHRcdHJldHVybiBvRW50aXR5VHlwZS5mdWxseVF1YWxpZmllZE5hbWUgPT09IHNGdWxseVF1YWxpZmllZE5hbWU7XG5cdFx0fSk7XG5cdFx0cmV0dXJuIG1FbnRpdHlUeXBlO1xuXHR9XG5cblx0LyoqXG5cdCAqIEdldHMgdGhlIHByb21pc2Ugb2YgdGhlIGZpZWxkIHZhbGlkYXRpb24gdGhhdCBpcyByZXF1aXJlZCBmb3IgdGhlIFNpZGVFZmZlY3RzIHByb2Nlc3MuXG5cdCAqXG5cdCAqIEBmdW5jdGlvblxuXHQgKiBAbmFtZSBfZ2V0RmllbGRQcm9taXNlXG5cdCAqIEBwYXJhbSB7b2JqZWN0fSBvRXZlbnQgRmllbGQgY2hhbmdlIGV2ZW50XG5cdCAqIEByZXR1cm5zIHtvYmplY3R9IEZpZWxkIHByb21pc2Vcblx0ICovXG5cdHByaXZhdGUgX2dldEZpZWxkUHJvbWlzZShvRXZlbnQ6IFVJNUV2ZW50KTogUHJvbWlzZTxhbnk+IHtcblx0XHRjb25zdCBwcm9taXNlID0gb0V2ZW50LmdldFBhcmFtZXRlcihcInByb21pc2VcIikgfHwgUHJvbWlzZS5yZXNvbHZlKCk7XG5cblx0XHRyZXR1cm4gcHJvbWlzZS50aGVuKCgpID0+IHtcblx0XHRcdGNvbnN0IG9Qcm9taXNlID0gbmV3IFByb21pc2UoZnVuY3Rpb24ocmVzb2x2ZSwgcmVqZWN0KSB7XG5cdFx0XHRcdGlmICghRmllbGRSdW50aW1lLmdldEZpZWxkU3RhdGVPbkNoYW5nZShvRXZlbnQpLnN0YXRlLnZhbGlkaXR5KSB7XG5cdFx0XHRcdFx0cmVqZWN0KCk7XG5cdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0cmVzb2x2ZSh0cnVlKTtcblx0XHRcdFx0fVxuXHRcdFx0fSk7XG5cdFx0XHRyZXR1cm4gb1Byb21pc2U7XG5cdFx0fSk7XG5cdH1cblxuXHQvKipcblx0ICogR2V0cyB0aGUgcHJvcGVydGllcyBvZiB0aGUgZmllbGQgdGhhdCBhcmUgcmVxdWlyZWQgZm9yIHRoZSBTaWRlRWZmZWN0cyBwcm9jZXNzLlxuXHQgKlxuXHQgKiBAZnVuY3Rpb25cblx0ICogQG5hbWUgX2dldEZpZWxkUHJvcGVydGllc1xuXHQgKiBAcGFyYW0ge29iamVjdH0gb0V2ZW50IEZpZWxkIGNoYW5nZSBldmVudFxuXHQgKiBAcmV0dXJucyB7b2JqZWN0fSBGaWVsZCBwcm9wZXJ0aWVzIChldmVudCBjaGFuZ2UgcHJvbWlzZSwgZmllbGQsIFNpZGVFZmZlY3RzIHJlbGF0ZWQgdG8gdGhpcyBmaWVsZClcblx0ICovXG5cdHByaXZhdGUgX2dldEZpZWxkUHJvcGVydGllcyhvRXZlbnQ6IFVJNUV2ZW50KTogRmllbGRFdmVudFByb3BlcnR5VHlwZSB7XG5cdFx0Y29uc3Qgb0ZpZWxkOiBGaWVsZENvbnRyb2wgPSBvRXZlbnQuZ2V0U291cmNlKCk7XG5cblx0XHRyZXR1cm4ge1xuXHRcdFx0cHJvbWlzZTogdGhpcy5fZ2V0RmllbGRQcm9taXNlKG9FdmVudCksXG5cdFx0XHRmaWVsZDogb0ZpZWxkLFxuXHRcdFx0c2lkZUVmZmVjdHNNYXA6IHRoaXMuX2dldEZpZWxkU2lkZUVmZmVjdHNNYXAob0ZpZWxkKVxuXHRcdH07XG5cdH1cblxuXHQvKipcblx0ICogR2V0cyB0aGUgU2lkZUVmZmVjdHMgbWFwXG5cdCAqIFRoZXNlIFNpZGVFZmZlY3RzIGFyZVxuXHQgKiAtIGxpc3RlZCBpbnRvIEZpZWxkR3JvdXBJZHMgKGNvbWluZyBmcm9tIGFuIE9EYXRhIFNlcnZpY2UpXG5cdCAqIC0gZ2VuZXJhdGVkIGJ5IGEgY29udHJvbCBvciBjb250cm9scyBhbmQgdGhhdCBjb25maWd1cmUgdGhpcyBmaWVsZCBhcyBTb3VyY2VQcm9wZXJ0aWVzLlxuXHQgKlxuXHQgKiBAZnVuY3Rpb25cblx0ICogQG5hbWUgX2dldEZpZWxkU2lkZUVmZmVjdHNNYXBcblx0ICogQHBhcmFtIHtvYmplY3R9IG9GaWVsZCBGaWVsZFxuXHQgKiBAcmV0dXJucyB7b2JqZWN0fSBTaWRlRWZmZWN0cyBtYXBcblx0ICovXG5cdHByaXZhdGUgX2dldEZpZWxkU2lkZUVmZmVjdHNNYXAob0ZpZWxkOiBGaWVsZENvbnRyb2wpOiBGaWVsZFNpZGVFZmZlY3REaWN0aW9uYXJ5IHtcblx0XHRjb25zdCBtU2lkZUVmZmVjdHNNYXA6IEZpZWxkU2lkZUVmZmVjdERpY3Rpb25hcnkgPSB7fSxcblx0XHRcdGFGaWVsZEdyb3VwSWRzOiBzdHJpbmdbXSA9IG9GaWVsZC5nZXRGaWVsZEdyb3VwSWRzKCksXG5cdFx0XHRzVmlld0VudGl0eVNldFNldE5hbWUgPSB0aGlzLl9vVmlldy5nZXRWaWV3RGF0YSgpLmVudGl0eVNldCxcblx0XHRcdG9WaWV3RW50aXR5U2V0ID0gKHRoaXMuX29TaWRlRWZmZWN0c1NlcnZpY2UuZ2V0Q29udmVydGVkTWV0YU1vZGVsKCkgYXMgQ29udmVydGVyT3V0cHV0KS5lbnRpdHlTZXRzLmZpbmQob0VudGl0eVNldCA9PiB7XG5cdFx0XHRcdHJldHVybiBvRW50aXR5U2V0Lm5hbWUgPT09IHNWaWV3RW50aXR5U2V0U2V0TmFtZTtcblx0XHRcdH0pO1xuXG5cdFx0Ly8gU2lkZUVmZmVjdHMgY29taW5nIGZyb20gYW4gT0RhdGEgU2VydmljZVxuXHRcdGFGaWVsZEdyb3VwSWRzLmZvckVhY2goc0ZpZWxkR3JvdXBJZCA9PiB7XG5cdFx0XHRjb25zdCBiSXNJbW1lZGlhdGU6IGJvb2xlYW4gPSBzRmllbGRHcm91cElkLmluZGV4T2YoXCIkJEltbWVkaWF0ZVJlcXVlc3RcIikgIT09IC0xLFxuXHRcdFx0XHRzTmFtZTogc3RyaW5nID0gc0ZpZWxkR3JvdXBJZC5yZXBsYWNlKFwiJCRJbW1lZGlhdGVSZXF1ZXN0XCIsIFwiXCIpLFxuXHRcdFx0XHRhU2lkZUVmZmVjdFBhcnRzOiBzdHJpbmdbXSA9IHNOYW1lLnNwbGl0KFwiI1wiKSxcblx0XHRcdFx0c1NpZGVFZmZlY3RFbnRpdHlUeXBlOiBzdHJpbmcgPSBhU2lkZUVmZmVjdFBhcnRzWzBdLFxuXHRcdFx0XHRzU2lkZUVmZmVjdFBhdGg6IHN0cmluZyA9XG5cdFx0XHRcdFx0c1NpZGVFZmZlY3RFbnRpdHlUeXBlICtcblx0XHRcdFx0XHRcIkBjb20uc2FwLnZvY2FidWxhcmllcy5Db21tb24udjEuU2lkZUVmZmVjdHNcIiArXG5cdFx0XHRcdFx0KGFTaWRlRWZmZWN0UGFydHMubGVuZ3RoID09PSAyID8gXCIjXCIgKyBhU2lkZUVmZmVjdFBhcnRzWzFdIDogXCJcIiksXG5cdFx0XHRcdG9TaWRlRWZmZWN0OiBTaWRlRWZmZWN0c1R5cGUgfCB1bmRlZmluZWQgPSB0aGlzLl9vU2lkZUVmZmVjdHNTZXJ2aWNlLmdldE9EYXRhRW50aXR5U2lkZUVmZmVjdHMoc1NpZGVFZmZlY3RFbnRpdHlUeXBlKT8uW1xuXHRcdFx0XHRcdHNTaWRlRWZmZWN0UGF0aFxuXHRcdFx0XHRdLFxuXHRcdFx0XHRvQ29udGV4dDogQ29udGV4dDxhbnk+IHwgdW5kZWZpbmVkID0gdGhpcy5fZ2V0Q29udGV4dEZvclNpZGVFZmZlY3RzKG9GaWVsZCwgc1NpZGVFZmZlY3RFbnRpdHlUeXBlKTtcblx0XHRcdGlmIChvU2lkZUVmZmVjdCAmJiBvQ29udGV4dCkge1xuXHRcdFx0XHRtU2lkZUVmZmVjdHNNYXBbc05hbWVdID0ge1xuXHRcdFx0XHRcdG5hbWU6IHNOYW1lLFxuXHRcdFx0XHRcdGltbWVkaWF0ZTogYklzSW1tZWRpYXRlLFxuXHRcdFx0XHRcdHNpZGVFZmZlY3RzOiBvU2lkZUVmZmVjdCxcblx0XHRcdFx0XHRjb250ZXh0OiBvQ29udGV4dFxuXHRcdFx0XHR9O1xuXHRcdFx0fVxuXHRcdH0pO1xuXG5cdFx0Ly9TaWRlRWZmZWN0cyBjb21pbmcgZnJvbSBjb250cm9sKHMpXG5cdFx0aWYgKHNWaWV3RW50aXR5U2V0U2V0TmFtZSAmJiBvVmlld0VudGl0eVNldCkge1xuXHRcdFx0Y29uc3Qgc1ZpZXdFbnRpdHlUeXBlID0gb1ZpZXdFbnRpdHlTZXQuZW50aXR5VHlwZS5mdWxseVF1YWxpZmllZE5hbWUsXG5cdFx0XHRcdG1GaWVsZFBhdGg6IGFueSA9IChvRmllbGQuZ2V0QWdncmVnYXRpb24oXCJjdXN0b21EYXRhXCIpIGFzIGFueVtdKS5maW5kKG9DdXN0b21EYXRhID0+IHtcblx0XHRcdFx0XHRyZXR1cm4gb0N1c3RvbURhdGEuZ2V0S2V5KCkgPT09IFwic291cmNlUGF0aFwiO1xuXHRcdFx0XHR9KSxcblx0XHRcdFx0b0NvbnRleHQ6IENvbnRleHQ8YW55PiB8IHVuZGVmaW5lZCA9IHRoaXMuX2dldENvbnRleHRGb3JTaWRlRWZmZWN0cyhvRmllbGQsIHNWaWV3RW50aXR5VHlwZSk7XG5cblx0XHRcdGlmIChtRmllbGRQYXRoICYmIG9Db250ZXh0KSB7XG5cdFx0XHRcdGNvbnN0IHNGaWVsZFBhdGggPSBtRmllbGRQYXRoLmdldFZhbHVlKCkucmVwbGFjZShcIi9cIiArIHNWaWV3RW50aXR5U2V0U2V0TmFtZSArIFwiL1wiLCBcIlwiKSxcblx0XHRcdFx0XHRtQ29udHJvbEVudGl0eVR5cGUgPSB0aGlzLl9vU2lkZUVmZmVjdHNTZXJ2aWNlLmdldENvbnRyb2xFbnRpdHlTaWRlRWZmZWN0cyhcblx0XHRcdFx0XHRcdHNWaWV3RW50aXR5VHlwZVxuXHRcdFx0XHRcdCkgYXMgQ29udHJvbFNpZGVFZmZlY3RzRW50aXR5RGljdGlvbmFyeTtcblx0XHRcdFx0T2JqZWN0LmtleXMobUNvbnRyb2xFbnRpdHlUeXBlKS5mb3JFYWNoKHNDb250cm9sTmFtZSA9PiB7XG5cdFx0XHRcdFx0Y29uc3Qgb0NvbnRyb2xTaWRlRWZmZWN0czogU2lkZUVmZmVjdHNUeXBlID0gbUNvbnRyb2xFbnRpdHlUeXBlW3NDb250cm9sTmFtZV07XG5cdFx0XHRcdFx0aWYgKChvQ29udHJvbFNpZGVFZmZlY3RzLlNvdXJjZVByb3BlcnRpZXMgYXMgc3RyaW5nW10pLmluY2x1ZGVzKHNGaWVsZFBhdGgpKSB7XG5cdFx0XHRcdFx0XHRjb25zdCBzTmFtZSA9IHNDb250cm9sTmFtZSArIFwiOjpcIiArIHNWaWV3RW50aXR5VHlwZTtcblx0XHRcdFx0XHRcdG1TaWRlRWZmZWN0c01hcFtzTmFtZV0gPSB7XG5cdFx0XHRcdFx0XHRcdG5hbWU6IHNOYW1lLFxuXHRcdFx0XHRcdFx0XHRpbW1lZGlhdGU6IHRydWUsXG5cdFx0XHRcdFx0XHRcdHNpZGVFZmZlY3RzOiBvQ29udHJvbFNpZGVFZmZlY3RzLFxuXHRcdFx0XHRcdFx0XHRjb250ZXh0OiBvQ29udGV4dFxuXHRcdFx0XHRcdFx0fTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH0pO1xuXHRcdFx0fVxuXHRcdH1cblx0XHRyZXR1cm4gbVNpZGVFZmZlY3RzTWFwO1xuXHR9XG5cblx0LyoqXG5cdCAqIE1hbmFnZXMgdGhlIFNpZGVFZmZlY3RzIHdpdGggcmVsYXRlZCBjaGFuZ2VzIHRvIGEgZmllbGRcblx0ICogTGlzdDogZ2V0cyBpbW1lZGlhdGUgU2lkZUVmZmVjdHMgcmVxdWVzdHNcblx0ICogUmVnaXN0ZXI6IGNhY2hlcyBkZWZlcnJlZCBTaWRlRWZmZWN0cyB0aGF0IHdpbGwgYmUgZXhlY3V0ZWQgd2hlbiB0aGUgRmllbGRHcm91cCBpcyB1bmZvY3VzZWQuXG5cdCAqXG5cdCAqIEBmdW5jdGlvblxuXHQgKiBAbmFtZSBfaW5pdGlhbGl6ZUZpZWxkU2lkZUVmZmVjdHNcblx0ICogQHBhcmFtIHtvYmplY3R9IG1FdmVudEZpZWxkUHJvcGVydGllcyBGaWVsZCBldmVudCBwcm9wZXJ0aWVzXG5cdCAqIEBwYXJhbSB7b2JqZWN0fSBvRmllbGRHcm91cFByZVJlcXVpc2l0ZSBQcm9taXNlIHRvIGJlIGZ1bGZpbGxlZCBiZWZvcmUgZXhlY3V0aW5nIGRlZmVycmVkIFNpZGVFZmZlY3RzXG5cdCAqIEByZXR1cm5zIHtBcnJheX0gIEFycmF5IG9mIGltbWVkaWF0ZSBTaWRlRWZmZWN0c1xuXHQgKi9cblx0cHJpdmF0ZSBfaW5pdGlhbGl6ZUZpZWxkU2lkZUVmZmVjdHMoXG5cdFx0bUV2ZW50RmllbGRQcm9wZXJ0aWVzOiBGaWVsZEV2ZW50UHJvcGVydHlUeXBlLFxuXHRcdG9GaWVsZEdyb3VwUHJlUmVxdWlzaXRlPzogUHJvbWlzZTxhbnk+XG5cdCk6IEZpZWxkU2lkZUVmZmVjdFByb3BlcnR5VHlwZVtdIHtcblx0XHRjb25zdCBtRmllbGRTaWRlRWZmZWN0c01hcCA9IG1FdmVudEZpZWxkUHJvcGVydGllcy5zaWRlRWZmZWN0c01hcCxcblx0XHRcdG9GaWVsZFByb21pc2VGb3JGaWVsZEdyb3VwID0gdGhpcy5fZ2VuZXJhdGVGaWVsZEdyb3VwUHJvbWlzZShtRXZlbnRGaWVsZFByb3BlcnRpZXMpLCAvLyBQcm9taXNlIG1hbmFnaW5nIEZpZWxkR3JvdXAgcmVxdWVzdHMgaWYgRmllbGQgcHJvbWlzZSBmYWlsc1xuXHRcdFx0bUZhaWxlZFNpZGVFZmZlY3RzTmFtZTogYW55ID0ge30sXG5cdFx0XHRhSW1tZWRpYXRlU2lkZUVmZmVjdHNQcm9wZXJ0aWVzOiBGaWVsZFNpZGVFZmZlY3RQcm9wZXJ0eVR5cGVbXSA9IFtdO1xuXG5cdFx0b0ZpZWxkR3JvdXBQcmVSZXF1aXNpdGUgPSBvRmllbGRHcm91cFByZVJlcXVpc2l0ZSB8fCBQcm9taXNlLnJlc29sdmUoKTtcblxuXHRcdE9iamVjdC5rZXlzKG1GaWVsZFNpZGVFZmZlY3RzTWFwKS5mb3JFYWNoKHNTaWRlRWZmZWN0TmFtZSA9PiB7XG5cdFx0XHRjb25zdCBvU2lkZUVmZmVjdFByb3BlcnR5OiBGaWVsZFNpZGVFZmZlY3RQcm9wZXJ0eVR5cGUgPSBtRmllbGRTaWRlRWZmZWN0c01hcFtzU2lkZUVmZmVjdE5hbWVdLFxuXHRcdFx0XHRzU2lkZUVmZmVjdENvbnRleHRQYXRoID0gb1NpZGVFZmZlY3RQcm9wZXJ0eS5jb250ZXh0LmdldFBhdGgoKSxcblx0XHRcdFx0YUZhaWxlZFNpZGVFZmZlY3RzID0gdGhpcy5fbUZhaWxlZFNpZGVFZmZlY3RzW3NTaWRlRWZmZWN0Q29udGV4dFBhdGhdO1xuXG5cdFx0XHQvLyBDaGVjayBpZiB0aGVyZSBpcyBhbnkgcHJldmlvdXNseSBmYWlsZWQgcmVxdWVzdCBmb3IgdGhpcyBjb250ZXh0XG5cdFx0XHRpZiAoYUZhaWxlZFNpZGVFZmZlY3RzKSB7XG5cdFx0XHRcdGRlbGV0ZSB0aGlzLl9tRmFpbGVkU2lkZUVmZmVjdHNbc1NpZGVFZmZlY3RDb250ZXh0UGF0aF07XG5cdFx0XHRcdG1GYWlsZWRTaWRlRWZmZWN0c05hbWVbc1NpZGVFZmZlY3RDb250ZXh0UGF0aF0gPSB7fTtcblx0XHRcdFx0YUZhaWxlZFNpZGVFZmZlY3RzLmZvckVhY2gobUZhaWxlZFNpZGVFZmZlY3RzID0+IHtcblx0XHRcdFx0XHRtRmFpbGVkU2lkZUVmZmVjdHNOYW1lW3NTaWRlRWZmZWN0Q29udGV4dFBhdGhdW21GYWlsZWRTaWRlRWZmZWN0cy5mdWxseVF1YWxpZmllZE5hbWVdID0gdHJ1ZTtcblx0XHRcdFx0XHRhSW1tZWRpYXRlU2lkZUVmZmVjdHNQcm9wZXJ0aWVzLnB1c2goe1xuXHRcdFx0XHRcdFx0bmFtZTogc1NpZGVFZmZlY3ROYW1lLFxuXHRcdFx0XHRcdFx0cHJldmlvdXNseUZhaWxlZDogdHJ1ZSxcblx0XHRcdFx0XHRcdHNpZGVFZmZlY3RzOiBtRmFpbGVkU2lkZUVmZmVjdHMsXG5cdFx0XHRcdFx0XHRjb250ZXh0OiBvU2lkZUVmZmVjdFByb3BlcnR5LmNvbnRleHRcblx0XHRcdFx0XHR9KTtcblx0XHRcdFx0fSk7XG5cdFx0XHR9XG5cdFx0XHRpZiAob1NpZGVFZmZlY3RQcm9wZXJ0eS5pbW1lZGlhdGUpIHtcblx0XHRcdFx0Ly8gU2lkZUVmZmVjdHMgd2lsbCBiZSBleGVjdXRlZCBpbW1lZGlhdGVseSBhZnRlciBldmVudCBwcm9taXNlIHZhbGlkYXRpb25cblx0XHRcdFx0aWYgKCFtRmFpbGVkU2lkZUVmZmVjdHNOYW1lW3NTaWRlRWZmZWN0Q29udGV4dFBhdGhdPy5bb1NpZGVFZmZlY3RQcm9wZXJ0eS5zaWRlRWZmZWN0cy5mdWxseVF1YWxpZmllZE5hbWVdKSB7XG5cdFx0XHRcdFx0YUltbWVkaWF0ZVNpZGVFZmZlY3RzUHJvcGVydGllcy5wdXNoKHtcblx0XHRcdFx0XHRcdG5hbWU6IHNTaWRlRWZmZWN0TmFtZSxcblx0XHRcdFx0XHRcdHNpZGVFZmZlY3RzOiBvU2lkZUVmZmVjdFByb3BlcnR5LnNpZGVFZmZlY3RzLFxuXHRcdFx0XHRcdFx0Y29udGV4dDogb1NpZGVFZmZlY3RQcm9wZXJ0eS5jb250ZXh0XG5cdFx0XHRcdFx0fSk7XG5cdFx0XHRcdH1cblx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdC8vIEFkZCBkZWZlcnJlZCBTaWRlRWZmZWN0cyB0byB0aGUgcmVsYXRlZCBkaWN0aW9uYXJ5XG5cdFx0XHRcdHRoaXMuX21GaWVsZEdyb3VwUXVldWVbc1NpZGVFZmZlY3ROYW1lXSA9IHRoaXMuX21GaWVsZEdyb3VwUXVldWVbc1NpZGVFZmZlY3ROYW1lXSB8fCB7fTtcblx0XHRcdFx0Y29uc3QgbVNpZGVFZmZlY3RDb250ZXh0UGF0aCA9IHRoaXMuX21GaWVsZEdyb3VwUXVldWVbc1NpZGVFZmZlY3ROYW1lXVtzU2lkZUVmZmVjdENvbnRleHRQYXRoXSB8fCB7XG5cdFx0XHRcdFx0cHJvbWlzZXM6IFtdLFxuXHRcdFx0XHRcdHNpZGVFZmZlY3RQcm9wZXJ0eTogb1NpZGVFZmZlY3RQcm9wZXJ0eSxcblx0XHRcdFx0XHRwcm9jZXNzU3RhcnRlZDogZmFsc2Vcblx0XHRcdFx0fTtcblx0XHRcdFx0bVNpZGVFZmZlY3RDb250ZXh0UGF0aC5wcm9taXNlcyA9IG1TaWRlRWZmZWN0Q29udGV4dFBhdGgucHJvbWlzZXMuY29uY2F0KFtcblx0XHRcdFx0XHRvRmllbGRQcm9taXNlRm9yRmllbGRHcm91cCxcblx0XHRcdFx0XHRvRmllbGRHcm91cFByZVJlcXVpc2l0ZSBhcyBQcm9taXNlPGFueT5cblx0XHRcdFx0XSk7XG5cdFx0XHRcdHRoaXMuX21GaWVsZEdyb3VwUXVldWVbc1NpZGVFZmZlY3ROYW1lXVtzU2lkZUVmZmVjdENvbnRleHRQYXRoXSA9IG1TaWRlRWZmZWN0Q29udGV4dFBhdGg7XG5cdFx0XHR9XG5cdFx0fSk7XG5cdFx0cmV0dXJuIGFJbW1lZGlhdGVTaWRlRWZmZWN0c1Byb3BlcnRpZXM7XG5cdH1cblxuXHQvKipcblx0ICogU2F2ZXMgdGhlIHZhbGlkYXRpb24gc3RhdHVzIG9mIHByb3BlcnRpZXMgcmVsYXRlZCB0byBhIGZpZWxkIGNvbnRyb2wuXG5cdCAqXG5cdCAqIEBwYXJhbSB7b2JqZWN0fSBvRmllbGQgRmllbGRcblx0ICogQHBhcmFtIHtib29sZWFufSBiU3VjY2VzcyBTdGF0dXMgb2YgdGhlIGZpZWxkIHZhbGlkYXRpb25cblx0ICovXG5cdHByaXZhdGUgX3NhdmVGaWVsZFByb3BlcnRpZXNTdGF0dXMob0ZpZWxkOiBGaWVsZENvbnRyb2wsIGJTdWNjZXNzOiBib29sZWFuKTogdm9pZCB7XG5cdFx0Y29uc3Qgb0JpbmRpbmdDb250ZXh0ID0gb0ZpZWxkLmdldEJpbmRpbmdDb250ZXh0KCk7XG5cdFx0Y29uc3Qgc0VudGl0eVR5cGUgPSB0aGlzLl9vU2lkZUVmZmVjdHNTZXJ2aWNlLmdldEVudGl0eVR5cGVGcm9tQ29udGV4dChvQmluZGluZ0NvbnRleHQpO1xuXHRcdGNvbnN0IG1FbnRpdHlUeXBlID0gdGhpcy5fZ2V0RW50aXR5VHlwZUZyb21GUU4oc0VudGl0eVR5cGUpO1xuXHRcdGlmIChtRW50aXR5VHlwZSkge1xuXHRcdFx0Ly8gUmV0cmlldmVzIGFsbCBwcm9wZXJ0aWVzIHVzZWQgYnkgdGhlIGZpZWxkXG5cdFx0XHRjb25zdCBvRmllbGRCaW5kaW5nOiBhbnkgPSB0aGlzLl9nZXRCaW5kaW5nRm9yRmllbGQob0ZpZWxkKTtcblx0XHRcdGNvbnN0IGFGaWVsZFBhdGhzID0gb0ZpZWxkQmluZGluZy5pc0EoXCJzYXAudWkubW9kZWwuQ29tcG9zaXRlQmluZGluZ1wiKVxuXHRcdFx0XHQ/ICgob0ZpZWxkQmluZGluZyBhcyBhbnkpLmdldEJpbmRpbmdzKCkgfHwgW10pLm1hcCgob0JpbmRpbmc6IGFueSkgPT4gb0JpbmRpbmcuc1BhdGgpXG5cdFx0XHRcdDogW29GaWVsZEJpbmRpbmcuZ2V0UGF0aCgpXTtcblxuXHRcdFx0Ly8gU3RvcmVzIHN0YXR1cyBmb3IgYWxsIHByb3BlcnRpZXNcblx0XHRcdGFGaWVsZFBhdGhzLmZvckVhY2goKHNGaWVsZFBhdGg6IHN0cmluZykgPT4ge1xuXHRcdFx0XHRjb25zdCBzSWQgPSB0aGlzLl9nZW5lcmF0ZVN0YXR1c0luZGV4KG1FbnRpdHlUeXBlLCBzRmllbGRQYXRoLCBvQmluZGluZ0NvbnRleHQpO1xuXHRcdFx0XHRpZiAoc0lkKSB7XG5cdFx0XHRcdFx0dGhpcy5fYVNvdXJjZVByb3BlcnRpZXNGYWlsdXJlW2JTdWNjZXNzID8gXCJkZWxldGVcIiA6IFwiYWRkXCJdKHNJZCk7XG5cdFx0XHRcdH1cblx0XHRcdH0pO1xuXHRcdH1cblx0fVxuXG5cdC8qKlxuXHQgKiBSZXRyaWV2ZXMgdGhlIHByb3BlcnR5IGJpbmRpbmcgdG8gdGhlIHZhbHVlIG9mIHRoZSBmaWVsZC5cblx0ICpcblx0ICogQHBhcmFtIG9GaWVsZCBGaWVsZFxuXHQgKiBAcmV0dXJucyB7QmluZGluZ30gIEJpbmRpbmcgdG8gdGhlIHZhbHVlXG5cdCAqL1xuXHRwcml2YXRlIF9nZXRCaW5kaW5nRm9yRmllbGQob0ZpZWxkOiBGaWVsZENvbnRyb2wpOiBCaW5kaW5nIHtcblx0XHRsZXQgb0JpbmRpbmc6IEJpbmRpbmc7XG5cdFx0aWYgKG9GaWVsZC5pc0E8Q2hlY2tCb3g+KFwic2FwLm0uQ2hlY2tCb3hcIikpIHtcblx0XHRcdG9CaW5kaW5nID0gb0ZpZWxkLmdldEJpbmRpbmcoXCJzZWxlY3RlZFwiKTtcblx0XHR9IGVsc2Uge1xuXHRcdFx0b0JpbmRpbmcgPSBvRmllbGQuZ2V0QmluZGluZyhcInZhbHVlXCIpO1xuXHRcdH1cblx0XHRyZXR1cm4gb0JpbmRpbmc7XG5cdH1cbn1cblxuZXhwb3J0IGRlZmF1bHQgU2lkZUVmZmVjdHNDb250cm9sbGVyRXh0ZW5zaW9uO1xuIl19