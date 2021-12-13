/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)
 *      (c) Copyright 2009-2021 SAP SE. All rights reserved
 */
sap.ui.define(["sap/ui/core/service/ServiceFactory", "sap/ui/core/service/Service", "sap/fe/core/converters/MetaModelConverter", "sap/base/Log"], function (ServiceFactory, Service, MetaModelConverter, Log) {
  "use strict";

  var convertTypes = MetaModelConverter.convertTypes;

  function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) { symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); } keys.push.apply(keys, symbols); } return keys; }

  function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

  function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

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

  var SideEffectsService = /*#__PURE__*/function (_Service) {
    _inherits(SideEffectsService, _Service);

    var _super = _createSuper(SideEffectsService);

    function SideEffectsService() {
      _classCallCheck(this, SideEffectsService);

      return _super.apply(this, arguments);
    }

    _createClass(SideEffectsService, [{
      key: "init",
      value: // !: means that we know it will be assigned before usage
      function init() {
        this._oSideEffectsType = {
          oData: {
            entities: {},
            actions: {}
          },
          control: {}
        };
        this._bInitialized = false;
        this.initPromise = Promise.resolve(this);
      }
      /**
       * Adds a SideEffects control
       * SideEffects definition is added by a control to keep data up to date
       * These SideEffects get limited scope compared with SideEffects coming from an OData service:
       * - Only one SideEffects definition can be defined for the combination entity type - control Id
       * - Only SideEffects source properties are recognized and used to trigger SideEffects
       *
       * Ensure the sourceControlId matches the associated SAPUI5 control ID.
       *
       * @private
       * @ui5-restricted
       * @param {string} sEntityType Name of the entity type
       * @param {object} oSideEffect SideEffects definition
       */

    }, {
      key: "addControlSideEffects",
      value: function addControlSideEffects(sEntityType, oSideEffect) {
        if (oSideEffect.sourceControlId) {
          var oControlSideEffect = _objectSpread(_objectSpread({}, oSideEffect), {}, {
            fullyQualifiedName: sEntityType + "/SideEffectsForControl/" + oSideEffect.sourceControlId
          });

          var mEntityControlSideEffects = this._oSideEffectsType.control[sEntityType] || {};
          mEntityControlSideEffects[oControlSideEffect.sourceControlId] = oControlSideEffect;
          this._oSideEffectsType.control[sEntityType] = mEntityControlSideEffects;
        }
      }
      /**
       * Executes SideEffects action.
       *
       * @private
       * @ui5-restricted
       * @param {string} sTriggerAction Name of the action
       * @param {object} oContext Context
       * @param {string} sGroupId The group ID to be used for the request
       */

    }, {
      key: "executeAction",
      value: function executeAction(sTriggerAction, oContext, sGroupId) {
        var oTriggerAction = oContext.getModel().bindContext(sTriggerAction + "(...)", oContext);
        oTriggerAction.execute(sGroupId || oContext.getBinding().getUpdateGroupId());
      }
      /**
       * Gets converted OData metaModel.
       *
       * @private
       * @ui5-restricted
       * @returns {object} Converted OData metaModel
       */

    }, {
      key: "getConvertedMetaModel",
      value: function getConvertedMetaModel() {
        var oContext = this.getContext();
        var oComponent = oContext.scopeObject;
        var oMetaModel = oComponent.getModel().getMetaModel();
        return convertTypes(oMetaModel, this._oCapabilities);
      }
      /**
       * Gets the entity type of a context.
       *
       * @function
       * @name getEntityTypeFromContext
       * @param {object} oContext Context
       * @returns {string | undefined } Entity Type
       */

    }, {
      key: "getEntityTypeFromContext",
      value: function getEntityTypeFromContext(oContext) {
        var oMetaModel = oContext.getModel().getMetaModel(),
            sMetaPath = oMetaModel.getMetaPath(oContext.getPath()),
            sEntityType = oMetaModel.getObject(sMetaPath)["$Type"];
        return sEntityType;
      }
      /**
       * Gets the SideEffects that come from an OData service.
       *
       * @private
       * @ui5-restricted
       * @param {string} sEntityTypeName Name of the entity type
       * @returns {object} SideEffects dictionary
       */

    }, {
      key: "getODataEntitySideEffects",
      value: function getODataEntitySideEffects(sEntityTypeName) {
        return this._oSideEffectsType.oData.entities[sEntityTypeName] || {};
      }
      /**
       * Gets the SideEffects that come from an OData service.
       *
       * @private
       * @ui5-restricted
       * @param {string} sActionName Name of the action
       * @param {object} oContext Context
       * @returns {object} SideEffects definition
       */

    }, {
      key: "getODataActionSideEffects",
      value: function getODataActionSideEffects(sActionName, oContext) {
        if (oContext) {
          var sEntityType = this.getEntityTypeFromContext(oContext);

          if (sEntityType) {
            var _this$_oSideEffectsTy;

            return (_this$_oSideEffectsTy = this._oSideEffectsType.oData.actions[sEntityType]) === null || _this$_oSideEffectsTy === void 0 ? void 0 : _this$_oSideEffectsTy[sActionName];
          }
        }

        return undefined;
      }
      /**
       * Generates the dictionary for the SideEffects.
       *
       * @private
       * @ui5-restricted
       * @param oCapabilities The current capabilities
       */

    }, {
      key: "initializeSideEffects",
      value: function initializeSideEffects(oCapabilities) {
        var _this = this;

        this._oCapabilities = oCapabilities;

        if (!this._bInitialized) {
          var oConvertedMetaModel = this.getConvertedMetaModel();
          oConvertedMetaModel.entityTypes.forEach(function (entityType) {
            _this._oSideEffectsType.oData.entities[entityType.fullyQualifiedName] = _this._retrieveODataEntitySideEffects(entityType);
            _this._oSideEffectsType.oData.actions[entityType.fullyQualifiedName] = _this._retrieveODataActionsSideEffects(entityType); // only bound actions are analyzed since unbound ones don't get SideEffects
          });
          this._bInitialized = true;
        }
      }
      /**
       * Removes all SideEffects related to a control.
       *
       * @private
       * @ui5-restricted
       * @param {string} sControlId Control Id
       */

    }, {
      key: "removeControlSideEffects",
      value: function removeControlSideEffects(sControlId) {
        var _this2 = this;

        Object.keys(this._oSideEffectsType.control).forEach(function (sEntityType) {
          if (_this2._oSideEffectsType.control[sEntityType][sControlId]) {
            delete _this2._oSideEffectsType.control[sEntityType][sControlId];
          }
        });
      }
      /**
       * Request SideEffects on a specific context.
       *
       * @function
       * @name requestSideEffects
       * @param {Array} aPathExpressions Targets of SideEffects to be executed
       * @param {object} oContext Context where SideEffects need to be executed
       * @param {string} sGroupId The group ID to be used for the request
       * @returns {Promise} Promise on SideEffects request
       */

    }, {
      key: "requestSideEffects",
      value: function requestSideEffects(aPathExpressions, oContext, sGroupId) {
        this._logRequest(aPathExpressions, oContext);

        var oPromise;
        /**
         * Context.requestSideEffects either returns a promise or throws a new error. This return is caught if an error is thrown
         * to avoid breaking the promise chain.
         */

        try {
          oPromise = oContext.requestSideEffects(aPathExpressions, sGroupId);
        } catch (e) {
          oPromise = Promise.reject(e);
        }

        return oPromise;
      }
      /**
       * Request SideEffects for a navigation property on a specific context.
       *
       * @function
       * @name requestSideEffectsForNavigationProperty
       * @param {string} sNavigationProperty Navigation property
       * @param {object} oContext Context where SideEffects need to be executed
       * @returns {object} SideEffects request on SAPUI5 context
       */

    }, {
      key: "requestSideEffectsForNavigationProperty",
      value: function requestSideEffectsForNavigationProperty(sNavigationProperty, oContext) {
        var _this3 = this;

        var sBaseEntityType = this.getEntityTypeFromContext(oContext);

        if (sBaseEntityType) {
          var aSideEffects = this.getODataEntitySideEffects(sBaseEntityType);
          var aTargets = [];
          Object.keys(aSideEffects).filter( // Keep relevant SideEffects
          function (sAnnotationName) {
            var oSideEffects = aSideEffects[sAnnotationName];
            return (oSideEffects.SourceProperties || []).some(function (oPropertyPath) {
              return oPropertyPath.value.indexOf(sNavigationProperty) > -1;
            }) || (oSideEffects.SourceEntities || []).some(function (oNavigationPropertyPath) {
              return oNavigationPropertyPath.value === sNavigationProperty;
            });
          }).forEach(function (sAnnotationName) {
            var oSideEffects = aSideEffects[sAnnotationName];

            if (oSideEffects.TriggerAction) {
              _this3.executeAction(oSideEffects.TriggerAction, oContext);
            }

            (oSideEffects.TargetEntities || []).concat(oSideEffects.TargetProperties || []).forEach(function (mTarget) {
              return aTargets.push(mTarget);
            });
          }); // Remove duplicate properties

          aTargets = this._removeDuplicateTargets(aTargets);

          if (aTargets.length > 0) {
            return this.requestSideEffects(aTargets, oContext).catch(function (oError) {
              return Log.error("SideEffects - Error while processing SideEffects for Navigation Property " + sNavigationProperty, oError);
            });
          }
        }

        return Promise.resolve();
      }
      /**
       * Gets the SideEffects that come from controls.
       *
       * @private
       * @ui5-restricted
       * @param {string} sEntityTypeName Entity type Name
       * @returns {object} SideEffects dictionary
       */

    }, {
      key: "getControlEntitySideEffects",
      value: function getControlEntitySideEffects(sEntityTypeName) {
        return this._oSideEffectsType.control[sEntityTypeName] || {};
      }
      /**
       * Adds the text properties required for SideEffects
       * If a property has an associated text then this text needs to be added as targetProperties.
       *
       * @private
       * @ui5-restricted
       * @param {object} oSideEffect SideEffects definition
       * @param {object} mEntityType Entity type
       * @returns {object} SideEffects definition with added text properties
       */

    }, {
      key: "_addRequiredTextProperties",
      value: function _addRequiredTextProperties(oSideEffect, mEntityType) {
        var aInitialProperties = oSideEffect.TargetProperties || [],
            aEntitiesRequested = (oSideEffect.TargetEntities || []).map(function (navigation) {
          return navigation.$NavigationPropertyPath;
        });
        var aDerivedProperties = [];
        aInitialProperties.forEach(function (sPropertyPath) {
          var bIsStarProperty = sPropertyPath.endsWith("*"),
              // Can be '*' or '.../navProp/*'
          sNavigationPropertyPath = sPropertyPath.substring(0, sPropertyPath.lastIndexOf("/")),
              sRelativePath = sNavigationPropertyPath ? sNavigationPropertyPath + "/" : "",
              mTarget = mEntityType.resolvePath(sNavigationPropertyPath) || mEntityType;

          if (mTarget) {
            var _targetType;

            // mTarget can be an entity type, navigationProperty or or a complexType
            var aTargetEntityProperties = mTarget.entityProperties || ((_targetType = mTarget.targetType) === null || _targetType === void 0 ? void 0 : _targetType.properties) || mTarget.targetType.entityProperties;

            if (aTargetEntityProperties) {
              if (bIsStarProperty) {
                if (aTargetEntityProperties) {
                  // Add all required properties behind the *
                  aEntitiesRequested.push(sNavigationPropertyPath);
                  aDerivedProperties = aDerivedProperties.concat(aTargetEntityProperties.map(function (mProperty) {
                    return {
                      navigationPath: sRelativePath,
                      property: mProperty
                    };
                  }));
                }
              } else {
                aDerivedProperties.push({
                  property: aTargetEntityProperties.find(function (mProperty) {
                    return mProperty.name === sPropertyPath.split("/").pop();
                  }),
                  navigationPath: sRelativePath
                });
              }
            } else {
              Log.info("SideEffects - The entity type associated to property path " + sPropertyPath + " cannot be resolved");
            }
          } else {
            Log.info("SideEffects - The property path " + sPropertyPath + " cannot be resolved");
          }
        });
        aDerivedProperties.forEach(function (mPropertyInfo) {
          if (mPropertyInfo.property) {
            var _mPropertyInfo$proper, _mPropertyInfo$proper2, _mPropertyInfo$proper3;

            var sTargetTextPath = (_mPropertyInfo$proper = mPropertyInfo.property.annotations) === null || _mPropertyInfo$proper === void 0 ? void 0 : (_mPropertyInfo$proper2 = _mPropertyInfo$proper.Common) === null || _mPropertyInfo$proper2 === void 0 ? void 0 : (_mPropertyInfo$proper3 = _mPropertyInfo$proper2.Text) === null || _mPropertyInfo$proper3 === void 0 ? void 0 : _mPropertyInfo$proper3.path,
                sTextPathFromInitialEntity = mPropertyInfo.navigationPath + sTargetTextPath;
            /**
             * The property Text must be added only if the property is
             * - not part of a star property (.i.e '*' or 'navigation/*') or a targeted Entity
             * - not include into the initial targeted properties of SideEffects
             *  Indeed in the two listed cases, the property containing text will be/is requested by initial SideEffects configuration.
             */

            if (sTargetTextPath && aEntitiesRequested.indexOf(sTextPathFromInitialEntity.substring(0, sTextPathFromInitialEntity.lastIndexOf("/"))) === -1 && aInitialProperties.indexOf(sTextPathFromInitialEntity) === -1) {
              oSideEffect.TargetProperties.push(sTextPathFromInitialEntity);
            }
          }
        });
        return oSideEffect;
      }
      /**
       * Converts SideEffects to expected format
       *  - Converts SideEffects targets to expected format
       *  - Removes binding parameter from SideEffects targets properties
       *  - Adds the text properties
       *  - Replaces TargetProperties having reference to Source Properties for a SideEffects.
       *
       * @private
       * @ui5-restricted
       * @param {object} oSideEffects SideEffects definition
       * @param {string} sEntityType Name of the entity type
       * @param {string} sBindingParameter Name of the binding parameter
       * @returns {object} SideEffects definition
       */

    }, {
      key: "_convertSideEffects",
      value: function _convertSideEffects(oSideEffects, sEntityType, sBindingParameter) {
        var mEntityType = this.getConvertedMetaModel().entityTypes.find(function (oEntityType) {
          return oEntityType.fullyQualifiedName === sEntityType;
        });

        var oTempSideEffects = this._removeBindingParameter(this._convertTargetsFormat(oSideEffects), sBindingParameter);

        return mEntityType ? this._replaceReferencedProperties(this._addRequiredTextProperties(oTempSideEffects, mEntityType), mEntityType) : oTempSideEffects;
      }
      /**
       * Converts SideEffects targets (TargetEntities and TargetProperties) to expected format
       *  - TargetProperties as array of string
       *  - TargetEntities as array of object with property $NavigationPropertyPath.
       *
       * @private
       * @ui5-restricted
       * @param {object} oSideEffects SideEffects definition
       * @returns {object} Converted SideEffects
       */

    }, {
      key: "_convertTargetsFormat",
      value: function _convertTargetsFormat(oSideEffects) {
        var TargetProperties = (oSideEffects.TargetProperties || []).reduce(function (aTargetProperties, vTarget) {
          var sTarget = typeof vTarget === "string" && vTarget || vTarget.type === "PropertyPath" && vTarget.value;

          if (sTarget) {
            aTargetProperties.push(sTarget);
          } else {
            Log.error("SideEffects - Error while processing TargetProperties for SideEffects" + oSideEffects.fullyQualifiedName);
          }

          return aTargetProperties;
        }, []),
            TargetEntities = (oSideEffects.TargetEntities || []).map(function (mTargetEntity) {
          /**
           *  SideEffects that comes from SAP FE get TargetEntities with $NavigationPropertyPath whereas
           *  ones coming from the converted OData model gets a NavigationPropertyPath format
           *
           */
          return {
            "$NavigationPropertyPath": mTargetEntity.$NavigationPropertyPath || mTargetEntity.value || ""
          };
        });
        return _objectSpread(_objectSpread({}, oSideEffects), {
          TargetProperties: TargetProperties,
          TargetEntities: TargetEntities
        });
      }
      /**
       * Gets SideEffects related to an entity type or action that come from an OData Service
       * Internal routine to get, from converted oData metaModel, SideEffects related to a specific entity type or action
       * and to convert these SideEffects with expected format.
       *
       * @private
       * @ui5-restricted
       * @param {object} oSource Entity type or action
       * @returns {object} Array of SideEffects
       */

    }, {
      key: "_getSideEffectsFromSource",
      value: function _getSideEffectsFromSource(oSource) {
        var _this4 = this;

        var aSideEffects = [];
        var authorizedTypes = ["EntityType", "Action"];

        if (oSource._type && authorizedTypes.indexOf(oSource._type) > -1) {
          var mEntityType = oSource._type === "EntityType" ? oSource : oSource.sourceEntityType;

          if (mEntityType) {
            var _oSource$annotations;

            var mCommonAnnotation = ((_oSource$annotations = oSource.annotations) === null || _oSource$annotations === void 0 ? void 0 : _oSource$annotations.Common) || {};
            var mBindingParameter = (oSource.parameters || []).find(function (mParameter) {
              return mParameter.type === (mEntityType || oSource).fullyQualifiedName;
            });
            var sBindingParameter = mBindingParameter ? mBindingParameter.fullyQualifiedName.split("/")[1] : "";
            Object.keys(mCommonAnnotation).filter(function (sAnnotationName) {
              return mCommonAnnotation[sAnnotationName].$Type === "com.sap.vocabularies.Common.v1.SideEffectsType";
            }).forEach(function (sAnnotationName) {
              aSideEffects.push(_this4._convertSideEffects(mCommonAnnotation[sAnnotationName], mEntityType.fullyQualifiedName, sBindingParameter));
            });
          }
        }

        return aSideEffects;
      }
      /**
       * Logs SideEffects request.
       *
       * @private
       * @ui5-restricted
       * @param {Array} aPathExpressions SideEffects targets
       * @param {object} oContext Context
       */

    }, {
      key: "_logRequest",
      value: function _logRequest(aPathExpressions, oContext) {
        var sTargetPaths = aPathExpressions.reduce(function (sPaths, mTarget) {
          return sPaths + "\n\t\t" + (mTarget.$NavigationPropertyPath || mTarget || "");
        }, "");
        Log.debug("SideEffects - Request:\n\tContext path : " + oContext.getPath() + "\n\tProperty paths :" + sTargetPaths);
      }
      /**
       * Removes name of binding parameter on SideEffects targets.
       *
       * @private
       * @ui5-restricted
       * @param {object} oSideEffects SideEffects definition
       * @param {string} sBindingParameterName Name of binding parameter
       * @returns {object} SideEffects definition
       */

    }, {
      key: "_removeBindingParameter",
      value: function _removeBindingParameter(oSideEffects, sBindingParameterName) {
        if (sBindingParameterName) {
          var aTargets = ["TargetProperties", "TargetEntities"];
          aTargets.forEach(function (sTarget) {
            var mTarget = oSideEffects[sTarget];

            if (mTarget) {
              mTarget = mTarget.map(function (mProperty) {
                var bNavigationPropertyPath = mProperty.$NavigationPropertyPath !== undefined; // Need to test with undefined since  mProperty.$NavigationPropertyPath could be "" (empty string)

                var sValue = (bNavigationPropertyPath ? mProperty.$NavigationPropertyPath : mProperty).replace(new RegExp("^" + sBindingParameterName + "?."), "");
                return bNavigationPropertyPath ? {
                  $NavigationPropertyPath: sValue
                } : sValue;
              });
            }

            oSideEffects[sTarget] = mTarget;
          });
        }

        return oSideEffects;
      }
      /**
       * Remove duplicates in SideEffects targets.
       *
       * @private
       * @ui5-restricted
       * @param {Array} aTargets SideEffects targets
       * @returns {Array} SideEffects targets without duplicates
       */

    }, {
      key: "_removeDuplicateTargets",
      value: function _removeDuplicateTargets(aTargets) {
        return aTargets.filter(function (mTarget, iIndex, aTargets) {
          return aTargets.findIndex(function (mSearchTarget) {
            return mSearchTarget === mTarget || mTarget.$NavigationPropertyPath && mSearchTarget.$NavigationPropertyPath === mTarget.$NavigationPropertyPath // NavigationPropertyPath
            ;
          }) === iIndex;
        });
      }
      /**
       * Replaces TargetProperties having reference to Source Properties for a SideEffects
       * If a SideEffects Source Property is an navigation entity reference, the SideEffects Target Properties cannot be a property of this navigation entity.
       * Indeed this configuration leads to error into the OData V4 Model since response cannot be processed because this would mean that we merge properties of the new target into the old target of the navigation property.
       * In order to request new value of these target properties the SideEffects will request for the entire Entity instead of just a set of properties.
       * For the first version, we remove all navigation properties and replace them by targetEntities. This change could be improved in next version.
       *
       * @private
       * @ui5-restricted
       * @param {object} oSideEffect SideEffects definition
       * @param {object} mEntityType  Entity type
       * @returns {object} SideEffects definition without referenced target properties
       */

    }, {
      key: "_replaceReferencedProperties",
      value: function _replaceReferencedProperties(oSideEffect, mEntityType) {
        var bSideEffectsChanged = false;
        var aEntities = (oSideEffect.TargetEntities || []).map(function (mNavigation) {
          return mNavigation.$NavigationPropertyPath;
        }) || [],
            aProperties = [];
        oSideEffect.TargetProperties.forEach(function (sPropertyPath) {
          var bTargetChanged = false;
          var iLastPathSeparatorIndex = sPropertyPath.lastIndexOf("/");

          if (iLastPathSeparatorIndex !== -1) {
            var sNavigationPath = sPropertyPath.substring(0, iLastPathSeparatorIndex);
            var oTarget = mEntityType.resolvePath(sNavigationPath);

            if (oTarget && oTarget._type === "NavigationProperty") {
              //Test if it's not a property bound on complexType (_ComplexType/MyProperty)
              bSideEffectsChanged = true;
              bTargetChanged = true;

              if (!aEntities.includes(sNavigationPath)) {
                aEntities.push(sNavigationPath);
              }
            }
          }

          if (!bTargetChanged) {
            aProperties.push(sPropertyPath);
          }
        });

        if (bSideEffectsChanged) {
          oSideEffect.TargetProperties = aProperties;
          oSideEffect.TargetEntities = aEntities.map(function (sNavigationPath) {
            return {
              $NavigationPropertyPath: sNavigationPath
            };
          });
        }

        return oSideEffect;
      }
      /**
       * Gets SideEffects action type that come from an OData Service
       * Internal routine to get, from converted oData metaModel, SideEffects on actions
       * related to a specific entity type and to convert these SideEffects with
       * expected format.
       *
       * @private
       * @ui5-restricted
       * @param {object} mEntityType Entity type
       * @returns {object} Entity type SideEffects dictionary
       */

    }, {
      key: "_retrieveODataActionsSideEffects",
      value: function _retrieveODataActionsSideEffects(mEntityType) {
        var _this5 = this;

        var oSideEffects = {};
        var aActions = mEntityType.actions;

        if (aActions) {
          Object.keys(aActions).forEach(function (sActionName) {
            var oAction = mEntityType.actions[sActionName];
            var triggerActions = [];
            var pathExpressions = [];
            var aTargets = [];

            _this5._getSideEffectsFromSource(oAction).forEach(function (oSideEffect) {
              var sTriggerAction = oSideEffect.TriggerAction;
              aTargets = aTargets.concat(oSideEffect.TargetEntities || []).concat(oSideEffect.TargetProperties || []);

              if (sTriggerAction && triggerActions.indexOf(sTriggerAction) === -1) {
                triggerActions.push(sTriggerAction);
              }
            });

            pathExpressions = _this5._removeDuplicateTargets(aTargets);
            oSideEffects[sActionName] = {
              pathExpressions: pathExpressions,
              triggerActions: triggerActions
            };
          });
        }

        return oSideEffects;
      }
      /**
       * Gets SideEffects entity type that come from an OData Service
       * Internal routine to get, from converted oData metaModel, SideEffects
       * related to a specific entity type and to convert these SideEffects with
       * expected format.
       *
       * @private
       * @ui5-restricted
       * @param {object} mEntityType Entity type
       * @returns {object} Entity type SideEffects dictionary
       */

    }, {
      key: "_retrieveODataEntitySideEffects",
      value: function _retrieveODataEntitySideEffects(mEntityType) {
        var oEntitySideEffects = {};

        this._getSideEffectsFromSource(mEntityType).forEach(function (oSideEffects) {
          oEntitySideEffects[oSideEffects.fullyQualifiedName] = oSideEffects;
        });

        return oEntitySideEffects;
      }
    }, {
      key: "getInterface",
      value: function getInterface() {
        return this;
      }
    }]);

    return SideEffectsService;
  }(Service);

  var SideEffectsServiceFactory = /*#__PURE__*/function (_ServiceFactory) {
    _inherits(SideEffectsServiceFactory, _ServiceFactory);

    var _super2 = _createSuper(SideEffectsServiceFactory);

    function SideEffectsServiceFactory() {
      _classCallCheck(this, SideEffectsServiceFactory);

      return _super2.apply(this, arguments);
    }

    _createClass(SideEffectsServiceFactory, [{
      key: "createInstance",
      value: function createInstance(oServiceContext) {
        var SideEffectsServiceService = new SideEffectsService(oServiceContext);
        return SideEffectsServiceService.initPromise;
      }
    }]);

    return SideEffectsServiceFactory;
  }(ServiceFactory);

  return SideEffectsServiceFactory;
}, false);
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIlNpZGVFZmZlY3RzU2VydmljZUZhY3RvcnkudHMiXSwibmFtZXMiOlsiU2lkZUVmZmVjdHNTZXJ2aWNlIiwiX29TaWRlRWZmZWN0c1R5cGUiLCJvRGF0YSIsImVudGl0aWVzIiwiYWN0aW9ucyIsImNvbnRyb2wiLCJfYkluaXRpYWxpemVkIiwiaW5pdFByb21pc2UiLCJQcm9taXNlIiwicmVzb2x2ZSIsInNFbnRpdHlUeXBlIiwib1NpZGVFZmZlY3QiLCJzb3VyY2VDb250cm9sSWQiLCJvQ29udHJvbFNpZGVFZmZlY3QiLCJmdWxseVF1YWxpZmllZE5hbWUiLCJtRW50aXR5Q29udHJvbFNpZGVFZmZlY3RzIiwic1RyaWdnZXJBY3Rpb24iLCJvQ29udGV4dCIsInNHcm91cElkIiwib1RyaWdnZXJBY3Rpb24iLCJnZXRNb2RlbCIsImJpbmRDb250ZXh0IiwiZXhlY3V0ZSIsImdldEJpbmRpbmciLCJnZXRVcGRhdGVHcm91cElkIiwiZ2V0Q29udGV4dCIsIm9Db21wb25lbnQiLCJzY29wZU9iamVjdCIsIm9NZXRhTW9kZWwiLCJnZXRNZXRhTW9kZWwiLCJjb252ZXJ0VHlwZXMiLCJfb0NhcGFiaWxpdGllcyIsInNNZXRhUGF0aCIsImdldE1ldGFQYXRoIiwiZ2V0UGF0aCIsImdldE9iamVjdCIsInNFbnRpdHlUeXBlTmFtZSIsInNBY3Rpb25OYW1lIiwiZ2V0RW50aXR5VHlwZUZyb21Db250ZXh0IiwidW5kZWZpbmVkIiwib0NhcGFiaWxpdGllcyIsIm9Db252ZXJ0ZWRNZXRhTW9kZWwiLCJnZXRDb252ZXJ0ZWRNZXRhTW9kZWwiLCJlbnRpdHlUeXBlcyIsImZvckVhY2giLCJlbnRpdHlUeXBlIiwiX3JldHJpZXZlT0RhdGFFbnRpdHlTaWRlRWZmZWN0cyIsIl9yZXRyaWV2ZU9EYXRhQWN0aW9uc1NpZGVFZmZlY3RzIiwic0NvbnRyb2xJZCIsIk9iamVjdCIsImtleXMiLCJhUGF0aEV4cHJlc3Npb25zIiwiX2xvZ1JlcXVlc3QiLCJvUHJvbWlzZSIsInJlcXVlc3RTaWRlRWZmZWN0cyIsImUiLCJyZWplY3QiLCJzTmF2aWdhdGlvblByb3BlcnR5Iiwic0Jhc2VFbnRpdHlUeXBlIiwiYVNpZGVFZmZlY3RzIiwiZ2V0T0RhdGFFbnRpdHlTaWRlRWZmZWN0cyIsImFUYXJnZXRzIiwiZmlsdGVyIiwic0Fubm90YXRpb25OYW1lIiwib1NpZGVFZmZlY3RzIiwiU291cmNlUHJvcGVydGllcyIsInNvbWUiLCJvUHJvcGVydHlQYXRoIiwidmFsdWUiLCJpbmRleE9mIiwiU291cmNlRW50aXRpZXMiLCJvTmF2aWdhdGlvblByb3BlcnR5UGF0aCIsIlRyaWdnZXJBY3Rpb24iLCJleGVjdXRlQWN0aW9uIiwiVGFyZ2V0RW50aXRpZXMiLCJjb25jYXQiLCJUYXJnZXRQcm9wZXJ0aWVzIiwibVRhcmdldCIsInB1c2giLCJfcmVtb3ZlRHVwbGljYXRlVGFyZ2V0cyIsImxlbmd0aCIsImNhdGNoIiwib0Vycm9yIiwiTG9nIiwiZXJyb3IiLCJtRW50aXR5VHlwZSIsImFJbml0aWFsUHJvcGVydGllcyIsImFFbnRpdGllc1JlcXVlc3RlZCIsIm1hcCIsIm5hdmlnYXRpb24iLCIkTmF2aWdhdGlvblByb3BlcnR5UGF0aCIsImFEZXJpdmVkUHJvcGVydGllcyIsInNQcm9wZXJ0eVBhdGgiLCJiSXNTdGFyUHJvcGVydHkiLCJlbmRzV2l0aCIsInNOYXZpZ2F0aW9uUHJvcGVydHlQYXRoIiwic3Vic3RyaW5nIiwibGFzdEluZGV4T2YiLCJzUmVsYXRpdmVQYXRoIiwicmVzb2x2ZVBhdGgiLCJhVGFyZ2V0RW50aXR5UHJvcGVydGllcyIsImVudGl0eVByb3BlcnRpZXMiLCJ0YXJnZXRUeXBlIiwicHJvcGVydGllcyIsIm1Qcm9wZXJ0eSIsIm5hdmlnYXRpb25QYXRoIiwicHJvcGVydHkiLCJmaW5kIiwibmFtZSIsInNwbGl0IiwicG9wIiwiaW5mbyIsIm1Qcm9wZXJ0eUluZm8iLCJzVGFyZ2V0VGV4dFBhdGgiLCJhbm5vdGF0aW9ucyIsIkNvbW1vbiIsIlRleHQiLCJwYXRoIiwic1RleHRQYXRoRnJvbUluaXRpYWxFbnRpdHkiLCJzQmluZGluZ1BhcmFtZXRlciIsIm9FbnRpdHlUeXBlIiwib1RlbXBTaWRlRWZmZWN0cyIsIl9yZW1vdmVCaW5kaW5nUGFyYW1ldGVyIiwiX2NvbnZlcnRUYXJnZXRzRm9ybWF0IiwiX3JlcGxhY2VSZWZlcmVuY2VkUHJvcGVydGllcyIsIl9hZGRSZXF1aXJlZFRleHRQcm9wZXJ0aWVzIiwicmVkdWNlIiwiYVRhcmdldFByb3BlcnRpZXMiLCJ2VGFyZ2V0Iiwic1RhcmdldCIsInR5cGUiLCJtVGFyZ2V0RW50aXR5Iiwib1NvdXJjZSIsImF1dGhvcml6ZWRUeXBlcyIsIl90eXBlIiwic291cmNlRW50aXR5VHlwZSIsIm1Db21tb25Bbm5vdGF0aW9uIiwibUJpbmRpbmdQYXJhbWV0ZXIiLCJwYXJhbWV0ZXJzIiwibVBhcmFtZXRlciIsIiRUeXBlIiwiX2NvbnZlcnRTaWRlRWZmZWN0cyIsInNUYXJnZXRQYXRocyIsInNQYXRocyIsImRlYnVnIiwic0JpbmRpbmdQYXJhbWV0ZXJOYW1lIiwiYk5hdmlnYXRpb25Qcm9wZXJ0eVBhdGgiLCJzVmFsdWUiLCJyZXBsYWNlIiwiUmVnRXhwIiwiaUluZGV4IiwiZmluZEluZGV4IiwibVNlYXJjaFRhcmdldCIsImJTaWRlRWZmZWN0c0NoYW5nZWQiLCJhRW50aXRpZXMiLCJtTmF2aWdhdGlvbiIsImFQcm9wZXJ0aWVzIiwiYlRhcmdldENoYW5nZWQiLCJpTGFzdFBhdGhTZXBhcmF0b3JJbmRleCIsInNOYXZpZ2F0aW9uUGF0aCIsIm9UYXJnZXQiLCJpbmNsdWRlcyIsImFBY3Rpb25zIiwib0FjdGlvbiIsInRyaWdnZXJBY3Rpb25zIiwicGF0aEV4cHJlc3Npb25zIiwiX2dldFNpZGVFZmZlY3RzRnJvbVNvdXJjZSIsIm9FbnRpdHlTaWRlRWZmZWN0cyIsIlNlcnZpY2UiLCJTaWRlRWZmZWN0c1NlcnZpY2VGYWN0b3J5Iiwib1NlcnZpY2VDb250ZXh0IiwiU2lkZUVmZmVjdHNTZXJ2aWNlU2VydmljZSIsIlNlcnZpY2VGYWN0b3J5Il0sIm1hcHBpbmdzIjoiO0FBQUE7QUFDQTtBQUNBOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztNQXNFTUEsa0I7Ozs7Ozs7Ozs7Ozs7YUFLTDtBQUNBLHNCQUFPO0FBQ04sYUFBS0MsaUJBQUwsR0FBeUI7QUFDeEJDLFVBQUFBLEtBQUssRUFBRTtBQUNOQyxZQUFBQSxRQUFRLEVBQUUsRUFESjtBQUVOQyxZQUFBQSxPQUFPLEVBQUU7QUFGSCxXQURpQjtBQUt4QkMsVUFBQUEsT0FBTyxFQUFFO0FBTGUsU0FBekI7QUFPQSxhQUFLQyxhQUFMLEdBQXFCLEtBQXJCO0FBQ0EsYUFBS0MsV0FBTCxHQUFtQkMsT0FBTyxDQUFDQyxPQUFSLENBQWdCLElBQWhCLENBQW5CO0FBQ0E7QUFFRDtBQUNEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7O2FBQ0MsK0JBQTZCQyxXQUE3QixFQUFrREMsV0FBbEQsRUFBeUg7QUFDeEgsWUFBSUEsV0FBVyxDQUFDQyxlQUFoQixFQUFpQztBQUNoQyxjQUFNQyxrQkFBMEMsbUNBQzVDRixXQUQ0QztBQUUvQ0csWUFBQUEsa0JBQWtCLEVBQUVKLFdBQVcsR0FBRyx5QkFBZCxHQUEwQ0MsV0FBVyxDQUFDQztBQUYzQixZQUFoRDs7QUFJQSxjQUFNRyx5QkFBeUIsR0FBRyxLQUFLZCxpQkFBTCxDQUF1QkksT0FBdkIsQ0FBK0JLLFdBQS9CLEtBQStDLEVBQWpGO0FBQ0FLLFVBQUFBLHlCQUF5QixDQUFDRixrQkFBa0IsQ0FBQ0QsZUFBcEIsQ0FBekIsR0FBZ0VDLGtCQUFoRTtBQUNBLGVBQUtaLGlCQUFMLENBQXVCSSxPQUF2QixDQUErQkssV0FBL0IsSUFBOENLLHlCQUE5QztBQUNBO0FBQ0Q7QUFFRDtBQUNEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7Ozs7YUFDQyx1QkFBcUJDLGNBQXJCLEVBQTZDQyxRQUE3QyxFQUFnRUMsUUFBaEUsRUFBbUY7QUFDbEYsWUFBTUMsY0FBbUIsR0FBR0YsUUFBUSxDQUFDRyxRQUFULEdBQW9CQyxXQUFwQixDQUFnQ0wsY0FBYyxHQUFHLE9BQWpELEVBQTBEQyxRQUExRCxDQUE1QjtBQUNBRSxRQUFBQSxjQUFjLENBQUNHLE9BQWYsQ0FBdUJKLFFBQVEsSUFBS0QsUUFBRCxDQUFrQk0sVUFBbEIsR0FBK0JDLGdCQUEvQixFQUFuQztBQUNBO0FBRUQ7QUFDRDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7Ozs7YUFDQyxpQ0FBZ0Q7QUFDL0MsWUFBTVAsUUFBUSxHQUFHLEtBQUtRLFVBQUwsRUFBakI7QUFDQSxZQUFNQyxVQUFVLEdBQUdULFFBQVEsQ0FBQ1UsV0FBNUI7QUFDQSxZQUFNQyxVQUEwQixHQUFHRixVQUFVLENBQUNOLFFBQVgsR0FBc0JTLFlBQXRCLEVBQW5DO0FBQ0EsZUFBT0MsWUFBWSxDQUFDRixVQUFELEVBQWEsS0FBS0csY0FBbEIsQ0FBbkI7QUFDQTtBQUVEO0FBQ0Q7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7Ozs7YUFDQyxrQ0FBZ0NkLFFBQWhDLEVBQXVFO0FBQ3RFLFlBQU1XLFVBQVUsR0FBR1gsUUFBUSxDQUFDRyxRQUFULEdBQW9CUyxZQUFwQixFQUFuQjtBQUFBLFlBQ0NHLFNBQVMsR0FBSUosVUFBRCxDQUFvQkssV0FBcEIsQ0FBZ0NoQixRQUFRLENBQUNpQixPQUFULEVBQWhDLENBRGI7QUFBQSxZQUVDeEIsV0FBVyxHQUFHa0IsVUFBVSxDQUFDTyxTQUFYLENBQXFCSCxTQUFyQixFQUFnQyxPQUFoQyxDQUZmO0FBR0EsZUFBT3RCLFdBQVA7QUFDQTtBQUVEO0FBQ0Q7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7Ozs7YUFDQyxtQ0FBaUMwQixlQUFqQyxFQUFnRztBQUMvRixlQUFPLEtBQUtuQyxpQkFBTCxDQUF1QkMsS0FBdkIsQ0FBNkJDLFFBQTdCLENBQXNDaUMsZUFBdEMsS0FBMEQsRUFBakU7QUFDQTtBQUVEO0FBQ0Q7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7OzthQUNDLG1DQUFpQ0MsV0FBakMsRUFBc0RwQixRQUF0RCxFQUE2RztBQUM1RyxZQUFJQSxRQUFKLEVBQWM7QUFDYixjQUFNUCxXQUFXLEdBQUcsS0FBSzRCLHdCQUFMLENBQThCckIsUUFBOUIsQ0FBcEI7O0FBQ0EsY0FBSVAsV0FBSixFQUFpQjtBQUFBOztBQUNoQiw0Q0FBTyxLQUFLVCxpQkFBTCxDQUF1QkMsS0FBdkIsQ0FBNkJFLE9BQTdCLENBQXFDTSxXQUFyQyxDQUFQLDBEQUFPLHNCQUFvRDJCLFdBQXBELENBQVA7QUFDQTtBQUNEOztBQUNELGVBQU9FLFNBQVA7QUFDQTtBQUVEO0FBQ0Q7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7O2FBQ0MsK0JBQTZCQyxhQUE3QixFQUE0RTtBQUFBOztBQUMzRSxhQUFLVCxjQUFMLEdBQXNCUyxhQUF0Qjs7QUFDQSxZQUFJLENBQUMsS0FBS2xDLGFBQVYsRUFBeUI7QUFDeEIsY0FBTW1DLG1CQUFtQixHQUFHLEtBQUtDLHFCQUFMLEVBQTVCO0FBQ0FELFVBQUFBLG1CQUFtQixDQUFDRSxXQUFwQixDQUFnQ0MsT0FBaEMsQ0FBd0MsVUFBQUMsVUFBVSxFQUFJO0FBQ3JELFlBQUEsS0FBSSxDQUFDNUMsaUJBQUwsQ0FBdUJDLEtBQXZCLENBQTZCQyxRQUE3QixDQUFzQzBDLFVBQVUsQ0FBQy9CLGtCQUFqRCxJQUF1RSxLQUFJLENBQUNnQywrQkFBTCxDQUFxQ0QsVUFBckMsQ0FBdkU7QUFDQSxZQUFBLEtBQUksQ0FBQzVDLGlCQUFMLENBQXVCQyxLQUF2QixDQUE2QkUsT0FBN0IsQ0FBcUN5QyxVQUFVLENBQUMvQixrQkFBaEQsSUFBc0UsS0FBSSxDQUFDaUMsZ0NBQUwsQ0FBc0NGLFVBQXRDLENBQXRFLENBRnFELENBRW9FO0FBQ3pILFdBSEQ7QUFJQSxlQUFLdkMsYUFBTCxHQUFxQixJQUFyQjtBQUNBO0FBQ0Q7QUFFRDtBQUNEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7OzthQUNDLGtDQUFnQzBDLFVBQWhDLEVBQTBEO0FBQUE7O0FBQ3pEQyxRQUFBQSxNQUFNLENBQUNDLElBQVAsQ0FBWSxLQUFLakQsaUJBQUwsQ0FBdUJJLE9BQW5DLEVBQTRDdUMsT0FBNUMsQ0FBb0QsVUFBQWxDLFdBQVcsRUFBSTtBQUNsRSxjQUFJLE1BQUksQ0FBQ1QsaUJBQUwsQ0FBdUJJLE9BQXZCLENBQStCSyxXQUEvQixFQUE0Q3NDLFVBQTVDLENBQUosRUFBNkQ7QUFDNUQsbUJBQU8sTUFBSSxDQUFDL0MsaUJBQUwsQ0FBdUJJLE9BQXZCLENBQStCSyxXQUEvQixFQUE0Q3NDLFVBQTVDLENBQVA7QUFDQTtBQUNELFNBSkQ7QUFLQTtBQUVEO0FBQ0Q7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7O2FBQ0MsNEJBQTBCRyxnQkFBMUIsRUFBaUVsQyxRQUFqRSxFQUFvRkMsUUFBcEYsRUFBcUg7QUFDcEgsYUFBS2tDLFdBQUwsQ0FBaUJELGdCQUFqQixFQUFtQ2xDLFFBQW5DOztBQUNBLFlBQUlvQyxRQUFKO0FBQ0E7QUFDRjtBQUNBO0FBQ0E7O0FBQ0UsWUFBSTtBQUNIQSxVQUFBQSxRQUFRLEdBQUlwQyxRQUFELENBQWtCcUMsa0JBQWxCLENBQXFDSCxnQkFBckMsRUFBdURqQyxRQUF2RCxDQUFYO0FBQ0EsU0FGRCxDQUVFLE9BQU9xQyxDQUFQLEVBQVU7QUFDWEYsVUFBQUEsUUFBUSxHQUFHN0MsT0FBTyxDQUFDZ0QsTUFBUixDQUFlRCxDQUFmLENBQVg7QUFDQTs7QUFDRCxlQUFPRixRQUFQO0FBQ0E7QUFFRDtBQUNEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7Ozs7YUFDQyxpREFBK0NJLG1CQUEvQyxFQUE0RXhDLFFBQTVFLEVBQTZHO0FBQUE7O0FBQzVHLFlBQU15QyxlQUFlLEdBQUcsS0FBS3BCLHdCQUFMLENBQThCckIsUUFBOUIsQ0FBeEI7O0FBQ0EsWUFBSXlDLGVBQUosRUFBcUI7QUFDcEIsY0FBTUMsWUFBWSxHQUFHLEtBQUtDLHlCQUFMLENBQStCRixlQUEvQixDQUFyQjtBQUNBLGNBQUlHLFFBQTZCLEdBQUcsRUFBcEM7QUFDQVosVUFBQUEsTUFBTSxDQUFDQyxJQUFQLENBQVlTLFlBQVosRUFDRUcsTUFERixFQUVFO0FBQ0Esb0JBQUFDLGVBQWUsRUFBSTtBQUNsQixnQkFBTUMsWUFBa0MsR0FBR0wsWUFBWSxDQUFDSSxlQUFELENBQXZEO0FBQ0EsbUJBQ0MsQ0FBQ0MsWUFBWSxDQUFDQyxnQkFBYixJQUFpQyxFQUFsQyxFQUFzQ0MsSUFBdEMsQ0FDQyxVQUFBQyxhQUFhO0FBQUEscUJBQUlBLGFBQWEsQ0FBQ0MsS0FBZCxDQUFvQkMsT0FBcEIsQ0FBNEJaLG1CQUE1QixJQUFtRCxDQUFDLENBQXhEO0FBQUEsYUFEZCxLQUdBLENBQUNPLFlBQVksQ0FBQ00sY0FBYixJQUErQixFQUFoQyxFQUFvQ0osSUFBcEMsQ0FDQyxVQUFBSyx1QkFBdUI7QUFBQSxxQkFBSUEsdUJBQXVCLENBQUNILEtBQXhCLEtBQWtDWCxtQkFBdEM7QUFBQSxhQUR4QixDQUpEO0FBUUEsV0FiSCxFQWVFYixPQWZGLENBZVUsVUFBQW1CLGVBQWUsRUFBSTtBQUMzQixnQkFBTUMsWUFBa0MsR0FBR0wsWUFBWSxDQUFDSSxlQUFELENBQXZEOztBQUNBLGdCQUFJQyxZQUFZLENBQUNRLGFBQWpCLEVBQWdDO0FBQy9CLGNBQUEsTUFBSSxDQUFDQyxhQUFMLENBQW1CVCxZQUFZLENBQUNRLGFBQWhDLEVBQStDdkQsUUFBL0M7QUFDQTs7QUFDRCxhQUFFK0MsWUFBWSxDQUFDVSxjQUFkLElBQTBDLEVBQTNDLEVBQ0VDLE1BREYsQ0FDVVgsWUFBWSxDQUFDWSxnQkFBZCxJQUE0QyxFQURyRCxFQUVFaEMsT0FGRixDQUVVLFVBQUFpQyxPQUFPO0FBQUEscUJBQUloQixRQUFRLENBQUNpQixJQUFULENBQWNELE9BQWQsQ0FBSjtBQUFBLGFBRmpCO0FBR0EsV0F2QkYsRUFIb0IsQ0EyQnBCOztBQUNBaEIsVUFBQUEsUUFBUSxHQUFHLEtBQUtrQix1QkFBTCxDQUE2QmxCLFFBQTdCLENBQVg7O0FBQ0EsY0FBSUEsUUFBUSxDQUFDbUIsTUFBVCxHQUFrQixDQUF0QixFQUF5QjtBQUN4QixtQkFBTyxLQUFLMUIsa0JBQUwsQ0FBd0JPLFFBQXhCLEVBQWtDNUMsUUFBbEMsRUFBNENnRSxLQUE1QyxDQUFrRCxVQUFBQyxNQUFNO0FBQUEscUJBQzlEQyxHQUFHLENBQUNDLEtBQUosQ0FBVSw4RUFBOEUzQixtQkFBeEYsRUFBNkd5QixNQUE3RyxDQUQ4RDtBQUFBLGFBQXhELENBQVA7QUFHQTtBQUNEOztBQUNELGVBQU8xRSxPQUFPLENBQUNDLE9BQVIsRUFBUDtBQUNBO0FBRUQ7QUFDRDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7OzthQUNDLHFDQUFtQzJCLGVBQW5DLEVBQW9HO0FBQ25HLGVBQU8sS0FBS25DLGlCQUFMLENBQXVCSSxPQUF2QixDQUErQitCLGVBQS9CLEtBQW1ELEVBQTFEO0FBQ0E7QUFFRDtBQUNEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7OzthQUNDLG9DQUFtQ3pCLFdBQW5DLEVBQXFFMEUsV0FBckUsRUFBbUg7QUFDbEgsWUFBTUMsa0JBQTRCLEdBQUkzRSxXQUFXLENBQUNpRSxnQkFBWixJQUFnQyxFQUF0RTtBQUFBLFlBQ0NXLGtCQUE0QixHQUFHLENBQUM1RSxXQUFXLENBQUMrRCxjQUFaLElBQThCLEVBQS9CLEVBQW1DYyxHQUFuQyxDQUF1QyxVQUFBQyxVQUFVO0FBQUEsaUJBQUlBLFVBQVUsQ0FBQ0MsdUJBQWY7QUFBQSxTQUFqRCxDQURoQztBQUVBLFlBQUlDLGtCQUEyQyxHQUFHLEVBQWxEO0FBRUFMLFFBQUFBLGtCQUFrQixDQUFDMUMsT0FBbkIsQ0FBMkIsVUFBQWdELGFBQWEsRUFBSTtBQUMzQyxjQUFNQyxlQUFlLEdBQUdELGFBQWEsQ0FBQ0UsUUFBZCxDQUF1QixHQUF2QixDQUF4QjtBQUFBLGNBQXFEO0FBQ3BEQyxVQUFBQSx1QkFBK0IsR0FBR0gsYUFBYSxDQUFDSSxTQUFkLENBQXdCLENBQXhCLEVBQTJCSixhQUFhLENBQUNLLFdBQWQsQ0FBMEIsR0FBMUIsQ0FBM0IsQ0FEbkM7QUFBQSxjQUVDQyxhQUFhLEdBQUdILHVCQUF1QixHQUFHQSx1QkFBdUIsR0FBRyxHQUE3QixHQUFtQyxFQUYzRTtBQUFBLGNBR0NsQixPQUFZLEdBQUdRLFdBQVcsQ0FBQ2MsV0FBWixDQUF3QkosdUJBQXhCLEtBQW9EVixXQUhwRTs7QUFLQSxjQUFJUixPQUFKLEVBQWE7QUFBQTs7QUFDWjtBQUNBLGdCQUFNdUIsdUJBQW1DLEdBQ3ZDdkIsT0FBRCxDQUF3QndCLGdCQUF4QixvQkFDQ3hCLE9BQUQsQ0FBc0J5QixVQUR0QixnREFDQSxZQUFrQ0MsVUFEbEMsS0FFQzFCLE9BQUQsQ0FBZ0N5QixVQUFoQyxDQUEyQ0QsZ0JBSDVDOztBQUlBLGdCQUFJRCx1QkFBSixFQUE2QjtBQUM1QixrQkFBSVAsZUFBSixFQUFxQjtBQUNwQixvQkFBSU8sdUJBQUosRUFBNkI7QUFDNUI7QUFDQWIsa0JBQUFBLGtCQUFrQixDQUFDVCxJQUFuQixDQUF3QmlCLHVCQUF4QjtBQUNBSixrQkFBQUEsa0JBQWtCLEdBQUdBLGtCQUFrQixDQUFDaEIsTUFBbkIsQ0FDcEJ5Qix1QkFBdUIsQ0FBQ1osR0FBeEIsQ0FBNEIsVUFBQWdCLFNBQVMsRUFBSTtBQUN4QywyQkFBTztBQUNOQyxzQkFBQUEsY0FBYyxFQUFFUCxhQURWO0FBRU5RLHNCQUFBQSxRQUFRLEVBQUVGO0FBRkoscUJBQVA7QUFJQSxtQkFMRCxDQURvQixDQUFyQjtBQVFBO0FBQ0QsZUFiRCxNQWFPO0FBQ05iLGdCQUFBQSxrQkFBa0IsQ0FBQ2IsSUFBbkIsQ0FBd0I7QUFDdkI0QixrQkFBQUEsUUFBUSxFQUFFTix1QkFBdUIsQ0FBQ08sSUFBeEIsQ0FDVCxVQUFBSCxTQUFTO0FBQUEsMkJBQUlBLFNBQVMsQ0FBQ0ksSUFBVixLQUFtQmhCLGFBQWEsQ0FBQ2lCLEtBQWQsQ0FBb0IsR0FBcEIsRUFBeUJDLEdBQXpCLEVBQXZCO0FBQUEsbUJBREEsQ0FEYTtBQUl2Qkwsa0JBQUFBLGNBQWMsRUFBRVA7QUFKTyxpQkFBeEI7QUFNQTtBQUNELGFBdEJELE1Bc0JPO0FBQ05mLGNBQUFBLEdBQUcsQ0FBQzRCLElBQUosQ0FBUywrREFBK0RuQixhQUEvRCxHQUErRSxxQkFBeEY7QUFDQTtBQUNELFdBL0JELE1BK0JPO0FBQ05ULFlBQUFBLEdBQUcsQ0FBQzRCLElBQUosQ0FBUyxxQ0FBcUNuQixhQUFyQyxHQUFxRCxxQkFBOUQ7QUFDQTtBQUNELFNBeENEO0FBMENBRCxRQUFBQSxrQkFBa0IsQ0FBQy9DLE9BQW5CLENBQTJCLFVBQUFvRSxhQUFhLEVBQUk7QUFDM0MsY0FBSUEsYUFBYSxDQUFDTixRQUFsQixFQUE0QjtBQUFBOztBQUMzQixnQkFBTU8sZUFBZSw0QkFBSUQsYUFBYSxDQUFDTixRQUFkLENBQXVCUSxXQUEzQixvRkFBSSxzQkFBb0NDLE1BQXhDLHFGQUFJLHVCQUE0Q0MsSUFBaEQsMkRBQUcsdUJBQTJEQyxJQUFuRjtBQUFBLGdCQUNDQywwQkFBMEIsR0FBR04sYUFBYSxDQUFDUCxjQUFkLEdBQStCUSxlQUQ3RDtBQUVBO0FBQ0o7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFSSxnQkFDQ0EsZUFBZSxJQUNmMUIsa0JBQWtCLENBQUNsQixPQUFuQixDQUEyQmlELDBCQUEwQixDQUFDdEIsU0FBM0IsQ0FBcUMsQ0FBckMsRUFBd0NzQiwwQkFBMEIsQ0FBQ3JCLFdBQTNCLENBQXVDLEdBQXZDLENBQXhDLENBQTNCLE1BQ0MsQ0FBQyxDQUZGLElBR0FYLGtCQUFrQixDQUFDakIsT0FBbkIsQ0FBMkJpRCwwQkFBM0IsTUFBMkQsQ0FBQyxDQUo3RCxFQUtFO0FBQ0QzRyxjQUFBQSxXQUFXLENBQUNpRSxnQkFBWixDQUE2QkUsSUFBN0IsQ0FBa0N3QywwQkFBbEM7QUFDQTtBQUNEO0FBQ0QsU0FwQkQ7QUFzQkEsZUFBTzNHLFdBQVA7QUFDQTtBQUNEO0FBQ0Q7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7Ozs7YUFDQyw2QkFDQ3FELFlBREQsRUFFQ3RELFdBRkQsRUFHQzZHLGlCQUhELEVBSXdCO0FBQ3ZCLFlBQU1sQyxXQUFXLEdBQUksS0FBSzNDLHFCQUFMLEVBQUQsQ0FBa0RDLFdBQWxELENBQThEZ0UsSUFBOUQsQ0FBbUUsVUFBQWEsV0FBVyxFQUFJO0FBQ3JHLGlCQUFPQSxXQUFXLENBQUMxRyxrQkFBWixLQUFtQ0osV0FBMUM7QUFDQSxTQUZtQixDQUFwQjs7QUFHQSxZQUFNK0csZ0JBQWdCLEdBQUcsS0FBS0MsdUJBQUwsQ0FBNkIsS0FBS0MscUJBQUwsQ0FBMkIzRCxZQUEzQixDQUE3QixFQUF1RXVELGlCQUF2RSxDQUF6Qjs7QUFDQSxlQUFPbEMsV0FBVyxHQUNmLEtBQUt1Qyw0QkFBTCxDQUFrQyxLQUFLQywwQkFBTCxDQUFnQ0osZ0JBQWhDLEVBQWtEcEMsV0FBbEQsQ0FBbEMsRUFBa0dBLFdBQWxHLENBRGUsR0FFZm9DLGdCQUZIO0FBR0E7QUFFRDtBQUNEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7OzthQUNDLCtCQUE4QnpELFlBQTlCLEVBQXNIO0FBQ3JILFlBQU1ZLGdCQUEwQixHQUFHLENBQUVaLFlBQVksQ0FBQ1ksZ0JBQWQsSUFBNEMsRUFBN0MsRUFBaURrRCxNQUFqRCxDQUF3RCxVQUFTQyxpQkFBVCxFQUE0QkMsT0FBNUIsRUFBcUM7QUFDOUgsY0FBTUMsT0FBTyxHQUFJLE9BQU9ELE9BQVAsS0FBbUIsUUFBbkIsSUFBK0JBLE9BQWhDLElBQTZDQSxPQUFPLENBQUNFLElBQVIsS0FBaUIsY0FBakIsSUFBbUNGLE9BQU8sQ0FBQzVELEtBQXhHOztBQUNBLGNBQUk2RCxPQUFKLEVBQWE7QUFDWkYsWUFBQUEsaUJBQWlCLENBQUNqRCxJQUFsQixDQUF1Qm1ELE9BQXZCO0FBQ0EsV0FGRCxNQUVPO0FBQ045QyxZQUFBQSxHQUFHLENBQUNDLEtBQUosQ0FBVSwwRUFBMEVwQixZQUFZLENBQUNsRCxrQkFBakc7QUFDQTs7QUFDRCxpQkFBT2lILGlCQUFQO0FBQ0EsU0FSaUMsRUFRL0IsRUFSK0IsQ0FBbkM7QUFBQSxZQVNDckQsY0FBNkMsR0FBRyxDQUFFVixZQUFZLENBQUNVLGNBQWQsSUFBMEMsRUFBM0MsRUFBK0NjLEdBQS9DLENBQW1ELFVBQUEyQyxhQUFhLEVBQUk7QUFDbkg7QUFDSjtBQUNBO0FBQ0E7QUFDQTtBQUNJLGlCQUFPO0FBQUUsdUNBQTJCQSxhQUFhLENBQUN6Qyx1QkFBZCxJQUF5Q3lDLGFBQWEsQ0FBQy9ELEtBQXZELElBQWdFO0FBQTdGLFdBQVA7QUFDQSxTQVArQyxDQVRqRDtBQWlCQSwrQ0FBWUosWUFBWixHQUE2QjtBQUFFWSxVQUFBQSxnQkFBZ0IsRUFBaEJBLGdCQUFGO0FBQW9CRixVQUFBQSxjQUFjLEVBQWRBO0FBQXBCLFNBQTdCO0FBQ0E7QUFFRDtBQUNEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7OzthQUNDLG1DQUFrQzBELE9BQWxDLEVBQXdFO0FBQUE7O0FBQ3ZFLFlBQU16RSxZQUFvQyxHQUFHLEVBQTdDO0FBQ0EsWUFBTTBFLGVBQWUsR0FBRyxDQUFDLFlBQUQsRUFBZSxRQUFmLENBQXhCOztBQUNBLFlBQUlELE9BQU8sQ0FBQ0UsS0FBUixJQUFpQkQsZUFBZSxDQUFDaEUsT0FBaEIsQ0FBd0IrRCxPQUFPLENBQUNFLEtBQWhDLElBQXlDLENBQUMsQ0FBL0QsRUFBa0U7QUFDakUsY0FBTWpELFdBQW1DLEdBQUcrQyxPQUFPLENBQUNFLEtBQVIsS0FBa0IsWUFBbEIsR0FBaUNGLE9BQWpDLEdBQTJDQSxPQUFPLENBQUNHLGdCQUEvRjs7QUFDQSxjQUFJbEQsV0FBSixFQUFpQjtBQUFBOztBQUNoQixnQkFBTW1ELGlCQUFzQixHQUFHLHlCQUFBSixPQUFPLENBQUNsQixXQUFSLDhFQUFxQkMsTUFBckIsS0FBK0IsRUFBOUQ7QUFDQSxnQkFBTXNCLGlCQUFpQixHQUFHLENBQUVMLE9BQUQsQ0FBb0JNLFVBQXBCLElBQWtDLEVBQW5DLEVBQXVDL0IsSUFBdkMsQ0FDekIsVUFBQWdDLFVBQVU7QUFBQSxxQkFBSUEsVUFBVSxDQUFDVCxJQUFYLEtBQW9CLENBQUM3QyxXQUFXLElBQUkrQyxPQUFoQixFQUF5QnRILGtCQUFqRDtBQUFBLGFBRGUsQ0FBMUI7QUFHQSxnQkFBTXlHLGlCQUFpQixHQUFHa0IsaUJBQWlCLEdBQUdBLGlCQUFpQixDQUFDM0gsa0JBQWxCLENBQXFDK0YsS0FBckMsQ0FBMkMsR0FBM0MsRUFBZ0QsQ0FBaEQsQ0FBSCxHQUF3RCxFQUFuRztBQUNBNUQsWUFBQUEsTUFBTSxDQUFDQyxJQUFQLENBQVlzRixpQkFBWixFQUNFMUUsTUFERixDQUNTLFVBQUFDLGVBQWU7QUFBQSxxQkFBSXlFLGlCQUFpQixDQUFDekUsZUFBRCxDQUFqQixDQUFtQzZFLEtBQW5DLHFEQUFKO0FBQUEsYUFEeEIsRUFFRWhHLE9BRkYsQ0FFVSxVQUFBbUIsZUFBZSxFQUFJO0FBQzNCSixjQUFBQSxZQUFZLENBQUNtQixJQUFiLENBQ0MsTUFBSSxDQUFDK0QsbUJBQUwsQ0FBeUJMLGlCQUFpQixDQUFDekUsZUFBRCxDQUExQyxFQUE2RHNCLFdBQVcsQ0FBQ3ZFLGtCQUF6RSxFQUE2RnlHLGlCQUE3RixDQUREO0FBR0EsYUFORjtBQU9BO0FBQ0Q7O0FBQ0QsZUFBTzVELFlBQVA7QUFDQTtBQUVEO0FBQ0Q7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7Ozs7YUFDQyxxQkFBb0JSLGdCQUFwQixFQUEyRGxDLFFBQTNELEVBQThFO0FBQzdFLFlBQU02SCxZQUFZLEdBQUczRixnQkFBZ0IsQ0FBQzJFLE1BQWpCLENBQXdCLFVBQVNpQixNQUFULEVBQWlCbEUsT0FBakIsRUFBMEI7QUFDdEUsaUJBQU9rRSxNQUFNLEdBQUcsUUFBVCxJQUFzQmxFLE9BQUQsQ0FBeUNhLHVCQUF6QyxJQUFvRWIsT0FBcEUsSUFBK0UsRUFBcEcsQ0FBUDtBQUNBLFNBRm9CLEVBRWxCLEVBRmtCLENBQXJCO0FBR0FNLFFBQUFBLEdBQUcsQ0FBQzZELEtBQUosQ0FBVSw4Q0FBOEMvSCxRQUFRLENBQUNpQixPQUFULEVBQTlDLEdBQW1FLHNCQUFuRSxHQUE0RjRHLFlBQXRHO0FBQ0E7QUFFRDtBQUNEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7Ozs7YUFDQyxpQ0FBZ0M5RSxZQUFoQyxFQUFtRWlGLHFCQUFuRSxFQUF3SDtBQUN2SCxZQUFJQSxxQkFBSixFQUEyQjtBQUMxQixjQUFNcEYsUUFBUSxHQUFHLENBQUMsa0JBQUQsRUFBcUIsZ0JBQXJCLENBQWpCO0FBQ0FBLFVBQUFBLFFBQVEsQ0FBQ2pCLE9BQVQsQ0FBaUIsVUFBQXFGLE9BQU8sRUFBSTtBQUMzQixnQkFBSXBELE9BQU8sR0FBSWIsWUFBRCxDQUFzQmlFLE9BQXRCLENBQWQ7O0FBQ0EsZ0JBQUlwRCxPQUFKLEVBQWE7QUFDWkEsY0FBQUEsT0FBTyxHQUFHQSxPQUFPLENBQUNXLEdBQVIsQ0FBWSxVQUFDZ0IsU0FBRCxFQUFvQjtBQUN6QyxvQkFBTTBDLHVCQUF1QixHQUFHMUMsU0FBUyxDQUFDZCx1QkFBVixLQUFzQ25ELFNBQXRFLENBRHlDLENBQ3dDOztBQUNqRixvQkFBTTRHLE1BQU0sR0FBRyxDQUFDRCx1QkFBdUIsR0FBRzFDLFNBQVMsQ0FBQ2QsdUJBQWIsR0FBdUNjLFNBQS9ELEVBQTBFNEMsT0FBMUUsQ0FDZCxJQUFJQyxNQUFKLENBQVcsTUFBTUoscUJBQU4sR0FBOEIsSUFBekMsQ0FEYyxFQUVkLEVBRmMsQ0FBZjtBQUlBLHVCQUFPQyx1QkFBdUIsR0FBRztBQUFFeEQsa0JBQUFBLHVCQUF1QixFQUFFeUQ7QUFBM0IsaUJBQUgsR0FBeUNBLE1BQXZFO0FBQ0EsZUFQUyxDQUFWO0FBUUE7O0FBQ0FuRixZQUFBQSxZQUFELENBQXNCaUUsT0FBdEIsSUFBaUNwRCxPQUFqQztBQUNBLFdBYkQ7QUFjQTs7QUFDRCxlQUFPYixZQUFQO0FBQ0E7QUFFRDtBQUNEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7O2FBQ0MsaUNBQWdDSCxRQUFoQyxFQUFvRjtBQUNuRixlQUFPQSxRQUFRLENBQUNDLE1BQVQsQ0FDTixVQUFDZSxPQUFELEVBQWV5RSxNQUFmLEVBQXVCekYsUUFBdkI7QUFBQSxpQkFDQ0EsUUFBUSxDQUFDMEYsU0FBVCxDQUFtQixVQUFDQyxhQUFELEVBQXdCO0FBQzFDLG1CQUNDQSxhQUFhLEtBQUszRSxPQUFsQixJQUNDQSxPQUFPLENBQUNhLHVCQUFSLElBQW1DOEQsYUFBYSxDQUFDOUQsdUJBQWQsS0FBMENiLE9BQU8sQ0FBQ2EsdUJBRnZGLENBRWdIO0FBRmhIO0FBSUEsV0FMRCxNQUtPNEQsTUFOUjtBQUFBLFNBRE0sQ0FBUDtBQVNBO0FBRUQ7QUFDRDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7Ozs7YUFDQyxzQ0FBcUMzSSxXQUFyQyxFQUF1RTBFLFdBQXZFLEVBQXFIO0FBQ3BILFlBQUlvRSxtQkFBNEIsR0FBRyxLQUFuQztBQUNBLFlBQU1DLFNBQW1CLEdBQ3ZCLENBQUMvSSxXQUFXLENBQUMrRCxjQUFaLElBQThCLEVBQS9CLEVBQW1DYyxHQUFuQyxDQUF1QyxVQUFBbUUsV0FBVyxFQUFJO0FBQ3JELGlCQUFPQSxXQUFXLENBQUNqRSx1QkFBbkI7QUFDQSxTQUZELEtBRU0sRUFIUjtBQUFBLFlBSUNrRSxXQUFxQixHQUFHLEVBSnpCO0FBTUFqSixRQUFBQSxXQUFXLENBQUNpRSxnQkFBWixDQUE2QmhDLE9BQTdCLENBQXFDLFVBQUFnRCxhQUFhLEVBQUk7QUFDckQsY0FBSWlFLGNBQWMsR0FBRyxLQUFyQjtBQUNBLGNBQU1DLHVCQUF1QixHQUFHbEUsYUFBYSxDQUFDSyxXQUFkLENBQTBCLEdBQTFCLENBQWhDOztBQUNBLGNBQUk2RCx1QkFBdUIsS0FBSyxDQUFDLENBQWpDLEVBQW9DO0FBQ25DLGdCQUFNQyxlQUFlLEdBQUduRSxhQUFhLENBQUNJLFNBQWQsQ0FBd0IsQ0FBeEIsRUFBMkI4RCx1QkFBM0IsQ0FBeEI7QUFDQSxnQkFBTUUsT0FBTyxHQUFHM0UsV0FBVyxDQUFDYyxXQUFaLENBQXdCNEQsZUFBeEIsQ0FBaEI7O0FBQ0EsZ0JBQUlDLE9BQU8sSUFBSUEsT0FBTyxDQUFDMUIsS0FBUixLQUFrQixvQkFBakMsRUFBdUQ7QUFDdEQ7QUFDQW1CLGNBQUFBLG1CQUFtQixHQUFHLElBQXRCO0FBQ0FJLGNBQUFBLGNBQWMsR0FBRyxJQUFqQjs7QUFDQSxrQkFBSSxDQUFDSCxTQUFTLENBQUNPLFFBQVYsQ0FBbUJGLGVBQW5CLENBQUwsRUFBMEM7QUFDekNMLGdCQUFBQSxTQUFTLENBQUM1RSxJQUFWLENBQWVpRixlQUFmO0FBQ0E7QUFDRDtBQUNEOztBQUNELGNBQUksQ0FBQ0YsY0FBTCxFQUFxQjtBQUNwQkQsWUFBQUEsV0FBVyxDQUFDOUUsSUFBWixDQUFpQmMsYUFBakI7QUFDQTtBQUNELFNBbEJEOztBQW9CQSxZQUFJNkQsbUJBQUosRUFBeUI7QUFDeEI5SSxVQUFBQSxXQUFXLENBQUNpRSxnQkFBWixHQUErQmdGLFdBQS9CO0FBQ0FqSixVQUFBQSxXQUFXLENBQUMrRCxjQUFaLEdBQTZCZ0YsU0FBUyxDQUFDbEUsR0FBVixDQUFjLFVBQUF1RSxlQUFlLEVBQUk7QUFDN0QsbUJBQU87QUFDTnJFLGNBQUFBLHVCQUF1QixFQUFFcUU7QUFEbkIsYUFBUDtBQUdBLFdBSjRCLENBQTdCO0FBS0E7O0FBRUQsZUFBT3BKLFdBQVA7QUFDQTtBQUVEO0FBQ0Q7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7Ozs7YUFDQywwQ0FBeUMwRSxXQUF6QyxFQUF5RztBQUFBOztBQUN4RyxZQUFNckIsWUFBbUQsR0FBRyxFQUE1RDtBQUNBLFlBQU1rRyxRQUFRLEdBQUc3RSxXQUFXLENBQUNqRixPQUE3Qjs7QUFDQSxZQUFJOEosUUFBSixFQUFjO0FBQ2JqSCxVQUFBQSxNQUFNLENBQUNDLElBQVAsQ0FBWWdILFFBQVosRUFBc0J0SCxPQUF0QixDQUE4QixVQUFBUCxXQUFXLEVBQUk7QUFDNUMsZ0JBQU04SCxPQUFPLEdBQUc5RSxXQUFXLENBQUNqRixPQUFaLENBQW9CaUMsV0FBcEIsQ0FBaEI7QUFDQSxnQkFBTStILGNBQXdCLEdBQUcsRUFBakM7QUFDQSxnQkFBSUMsZUFBb0MsR0FBRyxFQUEzQztBQUNBLGdCQUFJeEcsUUFBNkIsR0FBRyxFQUFwQzs7QUFFQSxZQUFBLE1BQUksQ0FBQ3lHLHlCQUFMLENBQStCSCxPQUEvQixFQUF3Q3ZILE9BQXhDLENBQWdELFVBQUFqQyxXQUFXLEVBQUk7QUFDOUQsa0JBQU1LLGNBQWMsR0FBR0wsV0FBVyxDQUFDNkQsYUFBbkM7QUFDQVgsY0FBQUEsUUFBUSxHQUFHQSxRQUFRLENBQUNjLE1BQVQsQ0FBZ0JoRSxXQUFXLENBQUMrRCxjQUFaLElBQThCLEVBQTlDLEVBQWtEQyxNQUFsRCxDQUEwRGhFLFdBQVcsQ0FBQ2lFLGdCQUFiLElBQTJDLEVBQXBHLENBQVg7O0FBQ0Esa0JBQUk1RCxjQUFjLElBQUlvSixjQUFjLENBQUMvRixPQUFmLENBQXVCckQsY0FBdkIsTUFBMkMsQ0FBQyxDQUFsRSxFQUFxRTtBQUNwRW9KLGdCQUFBQSxjQUFjLENBQUN0RixJQUFmLENBQW9COUQsY0FBcEI7QUFDQTtBQUNELGFBTkQ7O0FBT0FxSixZQUFBQSxlQUFlLEdBQUcsTUFBSSxDQUFDdEYsdUJBQUwsQ0FBNkJsQixRQUE3QixDQUFsQjtBQUNBRyxZQUFBQSxZQUFZLENBQUMzQixXQUFELENBQVosR0FBNEI7QUFBRWdJLGNBQUFBLGVBQWUsRUFBZkEsZUFBRjtBQUFtQkQsY0FBQUEsY0FBYyxFQUFkQTtBQUFuQixhQUE1QjtBQUNBLFdBZkQ7QUFnQkE7O0FBQ0QsZUFBT3BHLFlBQVA7QUFDQTtBQUVEO0FBQ0Q7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7Ozs7YUFDQyx5Q0FBd0NxQixXQUF4QyxFQUF1RztBQUN0RyxZQUFNa0Ysa0JBQXdELEdBQUcsRUFBakU7O0FBQ0EsYUFBS0QseUJBQUwsQ0FBK0JqRixXQUEvQixFQUE0Q3pDLE9BQTVDLENBQW9ELFVBQUFvQixZQUFZLEVBQUk7QUFDbkV1RyxVQUFBQSxrQkFBa0IsQ0FBQ3ZHLFlBQVksQ0FBQ2xELGtCQUFkLENBQWxCLEdBQXNEa0QsWUFBdEQ7QUFDQSxTQUZEOztBQUdBLGVBQU91RyxrQkFBUDtBQUNBOzs7YUFFRCx3QkFBb0I7QUFDbkIsZUFBTyxJQUFQO0FBQ0E7Ozs7SUF6a0IrQkMsTzs7TUE0a0IzQkMseUI7Ozs7Ozs7Ozs7Ozs7YUFDTCx3QkFBZUMsZUFBZixFQUFxRTtBQUNwRSxZQUFNQyx5QkFBeUIsR0FBRyxJQUFJM0ssa0JBQUosQ0FBdUIwSyxlQUF2QixDQUFsQztBQUNBLGVBQU9DLHlCQUF5QixDQUFDcEssV0FBakM7QUFDQTs7OztJQUpzQ3FLLGM7O1NBT3pCSCx5QiIsInNvdXJjZVJvb3QiOiIuIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgU2VydmljZUZhY3RvcnksIFNlcnZpY2UsIFNlcnZpY2VDb250ZXh0IH0gZnJvbSBcInNhcC91aS9jb3JlL3NlcnZpY2VcIjtcbmltcG9ydCB7IENvbnZlcnRlck91dHB1dCwgRW50aXR5VHlwZSwgTmF2aWdhdGlvblByb3BlcnR5LCBQcm9wZXJ0eSB9IGZyb20gXCJAc2FwLXV4L2Fubm90YXRpb24tY29udmVydGVyXCI7XG5pbXBvcnQgeyBDb250ZXh0LCBPRGF0YU1ldGFNb2RlbCB9IGZyb20gXCJzYXAvdWkvbW9kZWwvb2RhdGEvdjRcIjtcbmltcG9ydCB7IGNvbnZlcnRUeXBlcywgRW52aXJvbm1lbnRDYXBhYmlsaXRpZXMgfSBmcm9tIFwic2FwL2ZlL2NvcmUvY29udmVydGVycy9NZXRhTW9kZWxDb252ZXJ0ZXJcIjtcbmltcG9ydCB7IENvbW1vbkFubm90YXRpb25UeXBlcywgUXVhbGlmaWVkTmFtZSB9IGZyb20gXCJAc2FwLXV4L3ZvY2FidWxhcmllcy10eXBlcy9kaXN0L2dlbmVyYXRlZC9Db21tb25cIjtcbmltcG9ydCB7IEFjdGlvbiwgTmF2aWdhdGlvblByb3BlcnR5UGF0aCwgUHJvcGVydHlQYXRoIH0gZnJvbSBcIkBzYXAtdXgvdm9jYWJ1bGFyaWVzLXR5cGVzXCI7XG5pbXBvcnQgeyBMb2cgfSBmcm9tIFwic2FwL2Jhc2VcIjtcblxudHlwZSBTaWRlRWZmZWN0c1NldHRpbmdzID0ge307XG5cbnR5cGUgU2lkZUVmZmVjdHNUYXJnZXRFbnRpdHlUeXBlID0ge1xuXHQkTmF2aWdhdGlvblByb3BlcnR5UGF0aDogc3RyaW5nO1xufTtcbnR5cGUgU2lkZUVmZmVjdHNUYXJnZXQgPSBTaWRlRWZmZWN0c1RhcmdldEVudGl0eVR5cGUgfCBzdHJpbmc7XG5cbnR5cGUgU2lkZUVmZmVjdHNUYXJnZXRUeXBlID0ge1xuXHRUYXJnZXRQcm9wZXJ0aWVzOiBzdHJpbmdbXTtcblx0VGFyZ2V0RW50aXRpZXM6IFNpZGVFZmZlY3RzVGFyZ2V0RW50aXR5VHlwZVtdO1xufTtcblxudHlwZSBCYXNlQW5ub3RhdGlvblNpZGVFZmZlY3RzVHlwZSA9IHtcblx0VGFyZ2V0UHJvcGVydGllczogc3RyaW5nW107XG5cdFRhcmdldEVudGl0aWVzOiBOYXZpZ2F0aW9uUHJvcGVydHlQYXRoW107XG5cdGZ1bGx5UXVhbGlmaWVkTmFtZTogc3RyaW5nO1xufTtcblxudHlwZSBCYXNlU2lkZUVmZmVjdHNUeXBlID0ge1xuXHRmdWxseVF1YWxpZmllZE5hbWU6IHN0cmluZztcbn0gJiBTaWRlRWZmZWN0c1RhcmdldFR5cGU7XG5cbnR5cGUgQWN0aW9uU2lkZUVmZmVjdHNUeXBlID0ge1xuXHRwYXRoRXhwcmVzc2lvbnM6IFNpZGVFZmZlY3RzVGFyZ2V0W107XG5cdHRyaWdnZXJBY3Rpb25zPzogUXVhbGlmaWVkTmFtZVtdO1xufTtcblxuZXhwb3J0IHR5cGUgQ29udHJvbFNpZGVFZmZlY3RzVHlwZSA9IFBhcnRpYWw8QmFzZVNpZGVFZmZlY3RzVHlwZT4gJiB7XG5cdGZ1bGx5UXVhbGlmaWVkTmFtZTogc3RyaW5nO1xuXHRTb3VyY2VQcm9wZXJ0aWVzOiBzdHJpbmdbXTtcblx0c291cmNlQ29udHJvbElkOiBzdHJpbmc7XG59O1xuXG5leHBvcnQgdHlwZSBPRGF0YVNpZGVFZmZlY3RzVHlwZSA9IEJhc2VTaWRlRWZmZWN0c1R5cGUgJiB7XG5cdFNvdXJjZVByb3BlcnRpZXM/OiBQcm9wZXJ0eVBhdGhbXTtcblx0U291cmNlRW50aXRpZXM/OiBOYXZpZ2F0aW9uUHJvcGVydHlQYXRoW107XG5cdFRyaWdnZXJBY3Rpb24/OiBRdWFsaWZpZWROYW1lO1xufTtcblxuZXhwb3J0IHR5cGUgU2lkZUVmZmVjdHNUeXBlID0gQ29udHJvbFNpZGVFZmZlY3RzVHlwZSB8IE9EYXRhU2lkZUVmZmVjdHNUeXBlO1xuXG5leHBvcnQgdHlwZSBPRGF0YVNpZGVFZmZlY3RzRW50aXR5RGljdGlvbmFyeSA9IFJlY29yZDxzdHJpbmcsIE9EYXRhU2lkZUVmZmVjdHNUeXBlPjtcbmV4cG9ydCB0eXBlIE9EYXRhU2lkZUVmZmVjdHNBY3Rpb25EaWN0aW9uYXJ5ID0gUmVjb3JkPHN0cmluZywgQWN0aW9uU2lkZUVmZmVjdHNUeXBlPjtcbmV4cG9ydCB0eXBlIENvbnRyb2xTaWRlRWZmZWN0c0VudGl0eURpY3Rpb25hcnkgPSBSZWNvcmQ8c3RyaW5nLCBDb250cm9sU2lkZUVmZmVjdHNUeXBlPjtcblxudHlwZSBTaWRlRWZmZWN0c09yaWdpblJlZ2lzdHJ5ID0ge1xuXHRvRGF0YToge1xuXHRcdGVudGl0aWVzOiB7XG5cdFx0XHRbZW50aXR5OiBzdHJpbmddOiBSZWNvcmQ8c3RyaW5nLCBPRGF0YVNpZGVFZmZlY3RzVHlwZT47XG5cdFx0fTtcblx0XHRhY3Rpb25zOiB7XG5cdFx0XHRbZW50aXR5OiBzdHJpbmddOiBSZWNvcmQ8c3RyaW5nLCBBY3Rpb25TaWRlRWZmZWN0c1R5cGU+O1xuXHRcdH07XG5cdH07XG5cdGNvbnRyb2w6IHtcblx0XHRbZW50aXR5OiBzdHJpbmddOiBSZWNvcmQ8c3RyaW5nLCBDb250cm9sU2lkZUVmZmVjdHNUeXBlPjtcblx0fTtcbn07XG5cbnR5cGUgRXh0cmFjdG9yUHJvcGVydHlJbmZvID0ge1xuXHRwcm9wZXJ0eTogUHJvcGVydHk7XG5cdG5hdmlnYXRpb25QYXRoPzogc3RyaW5nO1xufTtcblxuY2xhc3MgU2lkZUVmZmVjdHNTZXJ2aWNlIGV4dGVuZHMgU2VydmljZTxTaWRlRWZmZWN0c1NldHRpbmdzPiB7XG5cdGluaXRQcm9taXNlITogUHJvbWlzZTxhbnk+O1xuXHRfb1NpZGVFZmZlY3RzVHlwZSE6IFNpZGVFZmZlY3RzT3JpZ2luUmVnaXN0cnk7XG5cdF9vQ2FwYWJpbGl0aWVzITogRW52aXJvbm1lbnRDYXBhYmlsaXRpZXMgfCB1bmRlZmluZWQ7XG5cdF9iSW5pdGlhbGl6ZWQhOiBCb29sZWFuO1xuXHQvLyAhOiBtZWFucyB0aGF0IHdlIGtub3cgaXQgd2lsbCBiZSBhc3NpZ25lZCBiZWZvcmUgdXNhZ2Vcblx0aW5pdCgpIHtcblx0XHR0aGlzLl9vU2lkZUVmZmVjdHNUeXBlID0ge1xuXHRcdFx0b0RhdGE6IHtcblx0XHRcdFx0ZW50aXRpZXM6IHt9LFxuXHRcdFx0XHRhY3Rpb25zOiB7fVxuXHRcdFx0fSxcblx0XHRcdGNvbnRyb2w6IHt9XG5cdFx0fTtcblx0XHR0aGlzLl9iSW5pdGlhbGl6ZWQgPSBmYWxzZTtcblx0XHR0aGlzLmluaXRQcm9taXNlID0gUHJvbWlzZS5yZXNvbHZlKHRoaXMpO1xuXHR9XG5cblx0LyoqXG5cdCAqIEFkZHMgYSBTaWRlRWZmZWN0cyBjb250cm9sXG5cdCAqIFNpZGVFZmZlY3RzIGRlZmluaXRpb24gaXMgYWRkZWQgYnkgYSBjb250cm9sIHRvIGtlZXAgZGF0YSB1cCB0byBkYXRlXG5cdCAqIFRoZXNlIFNpZGVFZmZlY3RzIGdldCBsaW1pdGVkIHNjb3BlIGNvbXBhcmVkIHdpdGggU2lkZUVmZmVjdHMgY29taW5nIGZyb20gYW4gT0RhdGEgc2VydmljZTpcblx0ICogLSBPbmx5IG9uZSBTaWRlRWZmZWN0cyBkZWZpbml0aW9uIGNhbiBiZSBkZWZpbmVkIGZvciB0aGUgY29tYmluYXRpb24gZW50aXR5IHR5cGUgLSBjb250cm9sIElkXG5cdCAqIC0gT25seSBTaWRlRWZmZWN0cyBzb3VyY2UgcHJvcGVydGllcyBhcmUgcmVjb2duaXplZCBhbmQgdXNlZCB0byB0cmlnZ2VyIFNpZGVFZmZlY3RzXG5cdCAqXG5cdCAqIEVuc3VyZSB0aGUgc291cmNlQ29udHJvbElkIG1hdGNoZXMgdGhlIGFzc29jaWF0ZWQgU0FQVUk1IGNvbnRyb2wgSUQuXG5cdCAqXG5cdCAqIEBwcml2YXRlXG5cdCAqIEB1aTUtcmVzdHJpY3RlZFxuXHQgKiBAcGFyYW0ge3N0cmluZ30gc0VudGl0eVR5cGUgTmFtZSBvZiB0aGUgZW50aXR5IHR5cGVcblx0ICogQHBhcmFtIHtvYmplY3R9IG9TaWRlRWZmZWN0IFNpZGVFZmZlY3RzIGRlZmluaXRpb25cblx0ICovXG5cdHB1YmxpYyBhZGRDb250cm9sU2lkZUVmZmVjdHMoc0VudGl0eVR5cGU6IHN0cmluZywgb1NpZGVFZmZlY3Q6IE9taXQ8Q29udHJvbFNpZGVFZmZlY3RzVHlwZSwgXCJmdWxseVF1YWxpZmllZE5hbWVcIj4pOiB2b2lkIHtcblx0XHRpZiAob1NpZGVFZmZlY3Quc291cmNlQ29udHJvbElkKSB7XG5cdFx0XHRjb25zdCBvQ29udHJvbFNpZGVFZmZlY3Q6IENvbnRyb2xTaWRlRWZmZWN0c1R5cGUgPSB7XG5cdFx0XHRcdC4uLm9TaWRlRWZmZWN0LFxuXHRcdFx0XHRmdWxseVF1YWxpZmllZE5hbWU6IHNFbnRpdHlUeXBlICsgXCIvU2lkZUVmZmVjdHNGb3JDb250cm9sL1wiICsgb1NpZGVFZmZlY3Quc291cmNlQ29udHJvbElkXG5cdFx0XHR9O1xuXHRcdFx0Y29uc3QgbUVudGl0eUNvbnRyb2xTaWRlRWZmZWN0cyA9IHRoaXMuX29TaWRlRWZmZWN0c1R5cGUuY29udHJvbFtzRW50aXR5VHlwZV0gfHwge307XG5cdFx0XHRtRW50aXR5Q29udHJvbFNpZGVFZmZlY3RzW29Db250cm9sU2lkZUVmZmVjdC5zb3VyY2VDb250cm9sSWRdID0gb0NvbnRyb2xTaWRlRWZmZWN0O1xuXHRcdFx0dGhpcy5fb1NpZGVFZmZlY3RzVHlwZS5jb250cm9sW3NFbnRpdHlUeXBlXSA9IG1FbnRpdHlDb250cm9sU2lkZUVmZmVjdHM7XG5cdFx0fVxuXHR9XG5cblx0LyoqXG5cdCAqIEV4ZWN1dGVzIFNpZGVFZmZlY3RzIGFjdGlvbi5cblx0ICpcblx0ICogQHByaXZhdGVcblx0ICogQHVpNS1yZXN0cmljdGVkXG5cdCAqIEBwYXJhbSB7c3RyaW5nfSBzVHJpZ2dlckFjdGlvbiBOYW1lIG9mIHRoZSBhY3Rpb25cblx0ICogQHBhcmFtIHtvYmplY3R9IG9Db250ZXh0IENvbnRleHRcblx0ICogQHBhcmFtIHtzdHJpbmd9IHNHcm91cElkIFRoZSBncm91cCBJRCB0byBiZSB1c2VkIGZvciB0aGUgcmVxdWVzdFxuXHQgKi9cblx0cHVibGljIGV4ZWN1dGVBY3Rpb24oc1RyaWdnZXJBY3Rpb246IFN0cmluZywgb0NvbnRleHQ6IENvbnRleHQsIHNHcm91cElkPzogc3RyaW5nKSB7XG5cdFx0Y29uc3Qgb1RyaWdnZXJBY3Rpb246IGFueSA9IG9Db250ZXh0LmdldE1vZGVsKCkuYmluZENvbnRleHQoc1RyaWdnZXJBY3Rpb24gKyBcIiguLi4pXCIsIG9Db250ZXh0KTtcblx0XHRvVHJpZ2dlckFjdGlvbi5leGVjdXRlKHNHcm91cElkIHx8IChvQ29udGV4dCBhcyBhbnkpLmdldEJpbmRpbmcoKS5nZXRVcGRhdGVHcm91cElkKCkpO1xuXHR9XG5cblx0LyoqXG5cdCAqIEdldHMgY29udmVydGVkIE9EYXRhIG1ldGFNb2RlbC5cblx0ICpcblx0ICogQHByaXZhdGVcblx0ICogQHVpNS1yZXN0cmljdGVkXG5cdCAqIEByZXR1cm5zIHtvYmplY3R9IENvbnZlcnRlZCBPRGF0YSBtZXRhTW9kZWxcblx0ICovXG5cdHB1YmxpYyBnZXRDb252ZXJ0ZWRNZXRhTW9kZWwoKTogQ29udmVydGVyT3V0cHV0IHtcblx0XHRjb25zdCBvQ29udGV4dCA9IHRoaXMuZ2V0Q29udGV4dCgpO1xuXHRcdGNvbnN0IG9Db21wb25lbnQgPSBvQ29udGV4dC5zY29wZU9iamVjdCBhcyBhbnk7XG5cdFx0Y29uc3Qgb01ldGFNb2RlbDogT0RhdGFNZXRhTW9kZWwgPSBvQ29tcG9uZW50LmdldE1vZGVsKCkuZ2V0TWV0YU1vZGVsKCk7XG5cdFx0cmV0dXJuIGNvbnZlcnRUeXBlcyhvTWV0YU1vZGVsLCB0aGlzLl9vQ2FwYWJpbGl0aWVzKTtcblx0fVxuXG5cdC8qKlxuXHQgKiBHZXRzIHRoZSBlbnRpdHkgdHlwZSBvZiBhIGNvbnRleHQuXG5cdCAqXG5cdCAqIEBmdW5jdGlvblxuXHQgKiBAbmFtZSBnZXRFbnRpdHlUeXBlRnJvbUNvbnRleHRcblx0ICogQHBhcmFtIHtvYmplY3R9IG9Db250ZXh0IENvbnRleHRcblx0ICogQHJldHVybnMge3N0cmluZyB8IHVuZGVmaW5lZCB9IEVudGl0eSBUeXBlXG5cdCAqL1xuXHRwdWJsaWMgZ2V0RW50aXR5VHlwZUZyb21Db250ZXh0KG9Db250ZXh0OiBDb250ZXh0KTogc3RyaW5nIHwgdW5kZWZpbmVkIHtcblx0XHRjb25zdCBvTWV0YU1vZGVsID0gb0NvbnRleHQuZ2V0TW9kZWwoKS5nZXRNZXRhTW9kZWwoKSxcblx0XHRcdHNNZXRhUGF0aCA9IChvTWV0YU1vZGVsIGFzIGFueSkuZ2V0TWV0YVBhdGgob0NvbnRleHQuZ2V0UGF0aCgpKSxcblx0XHRcdHNFbnRpdHlUeXBlID0gb01ldGFNb2RlbC5nZXRPYmplY3Qoc01ldGFQYXRoKVtcIiRUeXBlXCJdO1xuXHRcdHJldHVybiBzRW50aXR5VHlwZTtcblx0fVxuXG5cdC8qKlxuXHQgKiBHZXRzIHRoZSBTaWRlRWZmZWN0cyB0aGF0IGNvbWUgZnJvbSBhbiBPRGF0YSBzZXJ2aWNlLlxuXHQgKlxuXHQgKiBAcHJpdmF0ZVxuXHQgKiBAdWk1LXJlc3RyaWN0ZWRcblx0ICogQHBhcmFtIHtzdHJpbmd9IHNFbnRpdHlUeXBlTmFtZSBOYW1lIG9mIHRoZSBlbnRpdHkgdHlwZVxuXHQgKiBAcmV0dXJucyB7b2JqZWN0fSBTaWRlRWZmZWN0cyBkaWN0aW9uYXJ5XG5cdCAqL1xuXHRwdWJsaWMgZ2V0T0RhdGFFbnRpdHlTaWRlRWZmZWN0cyhzRW50aXR5VHlwZU5hbWU6IHN0cmluZyk6IFJlY29yZDxzdHJpbmcsIE9EYXRhU2lkZUVmZmVjdHNUeXBlPiB7XG5cdFx0cmV0dXJuIHRoaXMuX29TaWRlRWZmZWN0c1R5cGUub0RhdGEuZW50aXRpZXNbc0VudGl0eVR5cGVOYW1lXSB8fCB7fTtcblx0fVxuXG5cdC8qKlxuXHQgKiBHZXRzIHRoZSBTaWRlRWZmZWN0cyB0aGF0IGNvbWUgZnJvbSBhbiBPRGF0YSBzZXJ2aWNlLlxuXHQgKlxuXHQgKiBAcHJpdmF0ZVxuXHQgKiBAdWk1LXJlc3RyaWN0ZWRcblx0ICogQHBhcmFtIHtzdHJpbmd9IHNBY3Rpb25OYW1lIE5hbWUgb2YgdGhlIGFjdGlvblxuXHQgKiBAcGFyYW0ge29iamVjdH0gb0NvbnRleHQgQ29udGV4dFxuXHQgKiBAcmV0dXJucyB7b2JqZWN0fSBTaWRlRWZmZWN0cyBkZWZpbml0aW9uXG5cdCAqL1xuXHRwdWJsaWMgZ2V0T0RhdGFBY3Rpb25TaWRlRWZmZWN0cyhzQWN0aW9uTmFtZTogc3RyaW5nLCBvQ29udGV4dD86IENvbnRleHQpOiBBY3Rpb25TaWRlRWZmZWN0c1R5cGUgfCB1bmRlZmluZWQge1xuXHRcdGlmIChvQ29udGV4dCkge1xuXHRcdFx0Y29uc3Qgc0VudGl0eVR5cGUgPSB0aGlzLmdldEVudGl0eVR5cGVGcm9tQ29udGV4dChvQ29udGV4dCk7XG5cdFx0XHRpZiAoc0VudGl0eVR5cGUpIHtcblx0XHRcdFx0cmV0dXJuIHRoaXMuX29TaWRlRWZmZWN0c1R5cGUub0RhdGEuYWN0aW9uc1tzRW50aXR5VHlwZV0/LltzQWN0aW9uTmFtZV07XG5cdFx0XHR9XG5cdFx0fVxuXHRcdHJldHVybiB1bmRlZmluZWQ7XG5cdH1cblxuXHQvKipcblx0ICogR2VuZXJhdGVzIHRoZSBkaWN0aW9uYXJ5IGZvciB0aGUgU2lkZUVmZmVjdHMuXG5cdCAqXG5cdCAqIEBwcml2YXRlXG5cdCAqIEB1aTUtcmVzdHJpY3RlZFxuXHQgKiBAcGFyYW0gb0NhcGFiaWxpdGllcyBUaGUgY3VycmVudCBjYXBhYmlsaXRpZXNcblx0ICovXG5cdHB1YmxpYyBpbml0aWFsaXplU2lkZUVmZmVjdHMob0NhcGFiaWxpdGllcz86IEVudmlyb25tZW50Q2FwYWJpbGl0aWVzKTogdm9pZCB7XG5cdFx0dGhpcy5fb0NhcGFiaWxpdGllcyA9IG9DYXBhYmlsaXRpZXM7XG5cdFx0aWYgKCF0aGlzLl9iSW5pdGlhbGl6ZWQpIHtcblx0XHRcdGNvbnN0IG9Db252ZXJ0ZWRNZXRhTW9kZWwgPSB0aGlzLmdldENvbnZlcnRlZE1ldGFNb2RlbCgpO1xuXHRcdFx0b0NvbnZlcnRlZE1ldGFNb2RlbC5lbnRpdHlUeXBlcy5mb3JFYWNoKGVudGl0eVR5cGUgPT4ge1xuXHRcdFx0XHR0aGlzLl9vU2lkZUVmZmVjdHNUeXBlLm9EYXRhLmVudGl0aWVzW2VudGl0eVR5cGUuZnVsbHlRdWFsaWZpZWROYW1lXSA9IHRoaXMuX3JldHJpZXZlT0RhdGFFbnRpdHlTaWRlRWZmZWN0cyhlbnRpdHlUeXBlKTtcblx0XHRcdFx0dGhpcy5fb1NpZGVFZmZlY3RzVHlwZS5vRGF0YS5hY3Rpb25zW2VudGl0eVR5cGUuZnVsbHlRdWFsaWZpZWROYW1lXSA9IHRoaXMuX3JldHJpZXZlT0RhdGFBY3Rpb25zU2lkZUVmZmVjdHMoZW50aXR5VHlwZSk7IC8vIG9ubHkgYm91bmQgYWN0aW9ucyBhcmUgYW5hbHl6ZWQgc2luY2UgdW5ib3VuZCBvbmVzIGRvbid0IGdldCBTaWRlRWZmZWN0c1xuXHRcdFx0fSk7XG5cdFx0XHR0aGlzLl9iSW5pdGlhbGl6ZWQgPSB0cnVlO1xuXHRcdH1cblx0fVxuXG5cdC8qKlxuXHQgKiBSZW1vdmVzIGFsbCBTaWRlRWZmZWN0cyByZWxhdGVkIHRvIGEgY29udHJvbC5cblx0ICpcblx0ICogQHByaXZhdGVcblx0ICogQHVpNS1yZXN0cmljdGVkXG5cdCAqIEBwYXJhbSB7c3RyaW5nfSBzQ29udHJvbElkIENvbnRyb2wgSWRcblx0ICovXG5cdHB1YmxpYyByZW1vdmVDb250cm9sU2lkZUVmZmVjdHMoc0NvbnRyb2xJZDogc3RyaW5nKTogdm9pZCB7XG5cdFx0T2JqZWN0LmtleXModGhpcy5fb1NpZGVFZmZlY3RzVHlwZS5jb250cm9sKS5mb3JFYWNoKHNFbnRpdHlUeXBlID0+IHtcblx0XHRcdGlmICh0aGlzLl9vU2lkZUVmZmVjdHNUeXBlLmNvbnRyb2xbc0VudGl0eVR5cGVdW3NDb250cm9sSWRdKSB7XG5cdFx0XHRcdGRlbGV0ZSB0aGlzLl9vU2lkZUVmZmVjdHNUeXBlLmNvbnRyb2xbc0VudGl0eVR5cGVdW3NDb250cm9sSWRdO1xuXHRcdFx0fVxuXHRcdH0pO1xuXHR9XG5cblx0LyoqXG5cdCAqIFJlcXVlc3QgU2lkZUVmZmVjdHMgb24gYSBzcGVjaWZpYyBjb250ZXh0LlxuXHQgKlxuXHQgKiBAZnVuY3Rpb25cblx0ICogQG5hbWUgcmVxdWVzdFNpZGVFZmZlY3RzXG5cdCAqIEBwYXJhbSB7QXJyYXl9IGFQYXRoRXhwcmVzc2lvbnMgVGFyZ2V0cyBvZiBTaWRlRWZmZWN0cyB0byBiZSBleGVjdXRlZFxuXHQgKiBAcGFyYW0ge29iamVjdH0gb0NvbnRleHQgQ29udGV4dCB3aGVyZSBTaWRlRWZmZWN0cyBuZWVkIHRvIGJlIGV4ZWN1dGVkXG5cdCAqIEBwYXJhbSB7c3RyaW5nfSBzR3JvdXBJZCBUaGUgZ3JvdXAgSUQgdG8gYmUgdXNlZCBmb3IgdGhlIHJlcXVlc3Rcblx0ICogQHJldHVybnMge1Byb21pc2V9IFByb21pc2Ugb24gU2lkZUVmZmVjdHMgcmVxdWVzdFxuXHQgKi9cblx0cHVibGljIHJlcXVlc3RTaWRlRWZmZWN0cyhhUGF0aEV4cHJlc3Npb25zOiBTaWRlRWZmZWN0c1RhcmdldFtdLCBvQ29udGV4dDogQ29udGV4dCwgc0dyb3VwSWQ/OiBzdHJpbmcpOiBQcm9taXNlPGFueT4ge1xuXHRcdHRoaXMuX2xvZ1JlcXVlc3QoYVBhdGhFeHByZXNzaW9ucywgb0NvbnRleHQpO1xuXHRcdGxldCBvUHJvbWlzZTogUHJvbWlzZTxhbnk+O1xuXHRcdC8qKlxuXHRcdCAqIENvbnRleHQucmVxdWVzdFNpZGVFZmZlY3RzIGVpdGhlciByZXR1cm5zIGEgcHJvbWlzZSBvciB0aHJvd3MgYSBuZXcgZXJyb3IuIFRoaXMgcmV0dXJuIGlzIGNhdWdodCBpZiBhbiBlcnJvciBpcyB0aHJvd25cblx0XHQgKiB0byBhdm9pZCBicmVha2luZyB0aGUgcHJvbWlzZSBjaGFpbi5cblx0XHQgKi9cblx0XHR0cnkge1xuXHRcdFx0b1Byb21pc2UgPSAob0NvbnRleHQgYXMgYW55KS5yZXF1ZXN0U2lkZUVmZmVjdHMoYVBhdGhFeHByZXNzaW9ucywgc0dyb3VwSWQpIGFzIFByb21pc2U8YW55Pjtcblx0XHR9IGNhdGNoIChlKSB7XG5cdFx0XHRvUHJvbWlzZSA9IFByb21pc2UucmVqZWN0KGUpO1xuXHRcdH1cblx0XHRyZXR1cm4gb1Byb21pc2U7XG5cdH1cblxuXHQvKipcblx0ICogUmVxdWVzdCBTaWRlRWZmZWN0cyBmb3IgYSBuYXZpZ2F0aW9uIHByb3BlcnR5IG9uIGEgc3BlY2lmaWMgY29udGV4dC5cblx0ICpcblx0ICogQGZ1bmN0aW9uXG5cdCAqIEBuYW1lIHJlcXVlc3RTaWRlRWZmZWN0c0Zvck5hdmlnYXRpb25Qcm9wZXJ0eVxuXHQgKiBAcGFyYW0ge3N0cmluZ30gc05hdmlnYXRpb25Qcm9wZXJ0eSBOYXZpZ2F0aW9uIHByb3BlcnR5XG5cdCAqIEBwYXJhbSB7b2JqZWN0fSBvQ29udGV4dCBDb250ZXh0IHdoZXJlIFNpZGVFZmZlY3RzIG5lZWQgdG8gYmUgZXhlY3V0ZWRcblx0ICogQHJldHVybnMge29iamVjdH0gU2lkZUVmZmVjdHMgcmVxdWVzdCBvbiBTQVBVSTUgY29udGV4dFxuXHQgKi9cblx0cHVibGljIHJlcXVlc3RTaWRlRWZmZWN0c0Zvck5hdmlnYXRpb25Qcm9wZXJ0eShzTmF2aWdhdGlvblByb3BlcnR5OiBzdHJpbmcsIG9Db250ZXh0OiBDb250ZXh0KTogUHJvbWlzZTxhbnk+IHtcblx0XHRjb25zdCBzQmFzZUVudGl0eVR5cGUgPSB0aGlzLmdldEVudGl0eVR5cGVGcm9tQ29udGV4dChvQ29udGV4dCk7XG5cdFx0aWYgKHNCYXNlRW50aXR5VHlwZSkge1xuXHRcdFx0Y29uc3QgYVNpZGVFZmZlY3RzID0gdGhpcy5nZXRPRGF0YUVudGl0eVNpZGVFZmZlY3RzKHNCYXNlRW50aXR5VHlwZSk7XG5cdFx0XHRsZXQgYVRhcmdldHM6IFNpZGVFZmZlY3RzVGFyZ2V0W10gPSBbXTtcblx0XHRcdE9iamVjdC5rZXlzKGFTaWRlRWZmZWN0cylcblx0XHRcdFx0LmZpbHRlcihcblx0XHRcdFx0XHQvLyBLZWVwIHJlbGV2YW50IFNpZGVFZmZlY3RzXG5cdFx0XHRcdFx0c0Fubm90YXRpb25OYW1lID0+IHtcblx0XHRcdFx0XHRcdGNvbnN0IG9TaWRlRWZmZWN0czogT0RhdGFTaWRlRWZmZWN0c1R5cGUgPSBhU2lkZUVmZmVjdHNbc0Fubm90YXRpb25OYW1lXTtcblx0XHRcdFx0XHRcdHJldHVybiAoXG5cdFx0XHRcdFx0XHRcdChvU2lkZUVmZmVjdHMuU291cmNlUHJvcGVydGllcyB8fCBbXSkuc29tZShcblx0XHRcdFx0XHRcdFx0XHRvUHJvcGVydHlQYXRoID0+IG9Qcm9wZXJ0eVBhdGgudmFsdWUuaW5kZXhPZihzTmF2aWdhdGlvblByb3BlcnR5KSA+IC0xXG5cdFx0XHRcdFx0XHRcdCkgfHxcblx0XHRcdFx0XHRcdFx0KG9TaWRlRWZmZWN0cy5Tb3VyY2VFbnRpdGllcyB8fCBbXSkuc29tZShcblx0XHRcdFx0XHRcdFx0XHRvTmF2aWdhdGlvblByb3BlcnR5UGF0aCA9PiBvTmF2aWdhdGlvblByb3BlcnR5UGF0aC52YWx1ZSA9PT0gc05hdmlnYXRpb25Qcm9wZXJ0eVxuXHRcdFx0XHRcdFx0XHQpXG5cdFx0XHRcdFx0XHQpO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0KVxuXHRcdFx0XHQuZm9yRWFjaChzQW5ub3RhdGlvbk5hbWUgPT4ge1xuXHRcdFx0XHRcdGNvbnN0IG9TaWRlRWZmZWN0czogT0RhdGFTaWRlRWZmZWN0c1R5cGUgPSBhU2lkZUVmZmVjdHNbc0Fubm90YXRpb25OYW1lXTtcblx0XHRcdFx0XHRpZiAob1NpZGVFZmZlY3RzLlRyaWdnZXJBY3Rpb24pIHtcblx0XHRcdFx0XHRcdHRoaXMuZXhlY3V0ZUFjdGlvbihvU2lkZUVmZmVjdHMuVHJpZ2dlckFjdGlvbiwgb0NvbnRleHQpO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0XHQoKG9TaWRlRWZmZWN0cy5UYXJnZXRFbnRpdGllcyBhcyBhbnlbXSkgfHwgW10pXG5cdFx0XHRcdFx0XHQuY29uY2F0KChvU2lkZUVmZmVjdHMuVGFyZ2V0UHJvcGVydGllcyBhcyBhbnlbXSkgfHwgW10pXG5cdFx0XHRcdFx0XHQuZm9yRWFjaChtVGFyZ2V0ID0+IGFUYXJnZXRzLnB1c2gobVRhcmdldCkpO1xuXHRcdFx0XHR9KTtcblx0XHRcdC8vIFJlbW92ZSBkdXBsaWNhdGUgcHJvcGVydGllc1xuXHRcdFx0YVRhcmdldHMgPSB0aGlzLl9yZW1vdmVEdXBsaWNhdGVUYXJnZXRzKGFUYXJnZXRzKTtcblx0XHRcdGlmIChhVGFyZ2V0cy5sZW5ndGggPiAwKSB7XG5cdFx0XHRcdHJldHVybiB0aGlzLnJlcXVlc3RTaWRlRWZmZWN0cyhhVGFyZ2V0cywgb0NvbnRleHQpLmNhdGNoKG9FcnJvciA9PlxuXHRcdFx0XHRcdExvZy5lcnJvcihcIlNpZGVFZmZlY3RzIC0gRXJyb3Igd2hpbGUgcHJvY2Vzc2luZyBTaWRlRWZmZWN0cyBmb3IgTmF2aWdhdGlvbiBQcm9wZXJ0eSBcIiArIHNOYXZpZ2F0aW9uUHJvcGVydHksIG9FcnJvcilcblx0XHRcdFx0KTtcblx0XHRcdH1cblx0XHR9XG5cdFx0cmV0dXJuIFByb21pc2UucmVzb2x2ZSgpO1xuXHR9XG5cblx0LyoqXG5cdCAqIEdldHMgdGhlIFNpZGVFZmZlY3RzIHRoYXQgY29tZSBmcm9tIGNvbnRyb2xzLlxuXHQgKlxuXHQgKiBAcHJpdmF0ZVxuXHQgKiBAdWk1LXJlc3RyaWN0ZWRcblx0ICogQHBhcmFtIHtzdHJpbmd9IHNFbnRpdHlUeXBlTmFtZSBFbnRpdHkgdHlwZSBOYW1lXG5cdCAqIEByZXR1cm5zIHtvYmplY3R9IFNpZGVFZmZlY3RzIGRpY3Rpb25hcnlcblx0ICovXG5cdHB1YmxpYyBnZXRDb250cm9sRW50aXR5U2lkZUVmZmVjdHMoc0VudGl0eVR5cGVOYW1lOiBzdHJpbmcpOiBSZWNvcmQ8c3RyaW5nLCBDb250cm9sU2lkZUVmZmVjdHNUeXBlPiB7XG5cdFx0cmV0dXJuIHRoaXMuX29TaWRlRWZmZWN0c1R5cGUuY29udHJvbFtzRW50aXR5VHlwZU5hbWVdIHx8IHt9O1xuXHR9XG5cblx0LyoqXG5cdCAqIEFkZHMgdGhlIHRleHQgcHJvcGVydGllcyByZXF1aXJlZCBmb3IgU2lkZUVmZmVjdHNcblx0ICogSWYgYSBwcm9wZXJ0eSBoYXMgYW4gYXNzb2NpYXRlZCB0ZXh0IHRoZW4gdGhpcyB0ZXh0IG5lZWRzIHRvIGJlIGFkZGVkIGFzIHRhcmdldFByb3BlcnRpZXMuXG5cdCAqXG5cdCAqIEBwcml2YXRlXG5cdCAqIEB1aTUtcmVzdHJpY3RlZFxuXHQgKiBAcGFyYW0ge29iamVjdH0gb1NpZGVFZmZlY3QgU2lkZUVmZmVjdHMgZGVmaW5pdGlvblxuXHQgKiBAcGFyYW0ge29iamVjdH0gbUVudGl0eVR5cGUgRW50aXR5IHR5cGVcblx0ICogQHJldHVybnMge29iamVjdH0gU2lkZUVmZmVjdHMgZGVmaW5pdGlvbiB3aXRoIGFkZGVkIHRleHQgcHJvcGVydGllc1xuXHQgKi9cblx0cHJpdmF0ZSBfYWRkUmVxdWlyZWRUZXh0UHJvcGVydGllcyhvU2lkZUVmZmVjdDogQmFzZVNpZGVFZmZlY3RzVHlwZSwgbUVudGl0eVR5cGU6IEVudGl0eVR5cGUpOiBCYXNlU2lkZUVmZmVjdHNUeXBlIHtcblx0XHRjb25zdCBhSW5pdGlhbFByb3BlcnRpZXM6IHN0cmluZ1tdID0gKG9TaWRlRWZmZWN0LlRhcmdldFByb3BlcnRpZXMgfHwgW10pIGFzIHN0cmluZ1tdLFxuXHRcdFx0YUVudGl0aWVzUmVxdWVzdGVkOiBzdHJpbmdbXSA9IChvU2lkZUVmZmVjdC5UYXJnZXRFbnRpdGllcyB8fCBbXSkubWFwKG5hdmlnYXRpb24gPT4gbmF2aWdhdGlvbi4kTmF2aWdhdGlvblByb3BlcnR5UGF0aCk7XG5cdFx0bGV0IGFEZXJpdmVkUHJvcGVydGllczogRXh0cmFjdG9yUHJvcGVydHlJbmZvW10gPSBbXTtcblxuXHRcdGFJbml0aWFsUHJvcGVydGllcy5mb3JFYWNoKHNQcm9wZXJ0eVBhdGggPT4ge1xuXHRcdFx0Y29uc3QgYklzU3RhclByb3BlcnR5ID0gc1Byb3BlcnR5UGF0aC5lbmRzV2l0aChcIipcIiksIC8vIENhbiBiZSAnKicgb3IgJy4uLi9uYXZQcm9wLyonXG5cdFx0XHRcdHNOYXZpZ2F0aW9uUHJvcGVydHlQYXRoOiBzdHJpbmcgPSBzUHJvcGVydHlQYXRoLnN1YnN0cmluZygwLCBzUHJvcGVydHlQYXRoLmxhc3RJbmRleE9mKFwiL1wiKSksXG5cdFx0XHRcdHNSZWxhdGl2ZVBhdGggPSBzTmF2aWdhdGlvblByb3BlcnR5UGF0aCA/IHNOYXZpZ2F0aW9uUHJvcGVydHlQYXRoICsgXCIvXCIgOiBcIlwiLFxuXHRcdFx0XHRtVGFyZ2V0OiBhbnkgPSBtRW50aXR5VHlwZS5yZXNvbHZlUGF0aChzTmF2aWdhdGlvblByb3BlcnR5UGF0aCkgfHwgbUVudGl0eVR5cGU7XG5cblx0XHRcdGlmIChtVGFyZ2V0KSB7XG5cdFx0XHRcdC8vIG1UYXJnZXQgY2FuIGJlIGFuIGVudGl0eSB0eXBlLCBuYXZpZ2F0aW9uUHJvcGVydHkgb3Igb3IgYSBjb21wbGV4VHlwZVxuXHRcdFx0XHRjb25zdCBhVGFyZ2V0RW50aXR5UHJvcGVydGllczogUHJvcGVydHlbXSA9XG5cdFx0XHRcdFx0KG1UYXJnZXQgYXMgRW50aXR5VHlwZSkuZW50aXR5UHJvcGVydGllcyB8fFxuXHRcdFx0XHRcdChtVGFyZ2V0IGFzIFByb3BlcnR5KS50YXJnZXRUeXBlPy5wcm9wZXJ0aWVzIHx8XG5cdFx0XHRcdFx0KG1UYXJnZXQgYXMgTmF2aWdhdGlvblByb3BlcnR5KS50YXJnZXRUeXBlLmVudGl0eVByb3BlcnRpZXM7XG5cdFx0XHRcdGlmIChhVGFyZ2V0RW50aXR5UHJvcGVydGllcykge1xuXHRcdFx0XHRcdGlmIChiSXNTdGFyUHJvcGVydHkpIHtcblx0XHRcdFx0XHRcdGlmIChhVGFyZ2V0RW50aXR5UHJvcGVydGllcykge1xuXHRcdFx0XHRcdFx0XHQvLyBBZGQgYWxsIHJlcXVpcmVkIHByb3BlcnRpZXMgYmVoaW5kIHRoZSAqXG5cdFx0XHRcdFx0XHRcdGFFbnRpdGllc1JlcXVlc3RlZC5wdXNoKHNOYXZpZ2F0aW9uUHJvcGVydHlQYXRoKTtcblx0XHRcdFx0XHRcdFx0YURlcml2ZWRQcm9wZXJ0aWVzID0gYURlcml2ZWRQcm9wZXJ0aWVzLmNvbmNhdChcblx0XHRcdFx0XHRcdFx0XHRhVGFyZ2V0RW50aXR5UHJvcGVydGllcy5tYXAobVByb3BlcnR5ID0+IHtcblx0XHRcdFx0XHRcdFx0XHRcdHJldHVybiB7XG5cdFx0XHRcdFx0XHRcdFx0XHRcdG5hdmlnYXRpb25QYXRoOiBzUmVsYXRpdmVQYXRoLFxuXHRcdFx0XHRcdFx0XHRcdFx0XHRwcm9wZXJ0eTogbVByb3BlcnR5XG5cdFx0XHRcdFx0XHRcdFx0XHR9O1xuXHRcdFx0XHRcdFx0XHRcdH0pXG5cdFx0XHRcdFx0XHRcdCk7XG5cdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHRcdGFEZXJpdmVkUHJvcGVydGllcy5wdXNoKHtcblx0XHRcdFx0XHRcdFx0cHJvcGVydHk6IGFUYXJnZXRFbnRpdHlQcm9wZXJ0aWVzLmZpbmQoXG5cdFx0XHRcdFx0XHRcdFx0bVByb3BlcnR5ID0+IG1Qcm9wZXJ0eS5uYW1lID09PSBzUHJvcGVydHlQYXRoLnNwbGl0KFwiL1wiKS5wb3AoKVxuXHRcdFx0XHRcdFx0XHQpIGFzIFByb3BlcnR5LFxuXHRcdFx0XHRcdFx0XHRuYXZpZ2F0aW9uUGF0aDogc1JlbGF0aXZlUGF0aFxuXHRcdFx0XHRcdFx0fSk7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdExvZy5pbmZvKFwiU2lkZUVmZmVjdHMgLSBUaGUgZW50aXR5IHR5cGUgYXNzb2NpYXRlZCB0byBwcm9wZXJ0eSBwYXRoIFwiICsgc1Byb3BlcnR5UGF0aCArIFwiIGNhbm5vdCBiZSByZXNvbHZlZFwiKTtcblx0XHRcdFx0fVxuXHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0TG9nLmluZm8oXCJTaWRlRWZmZWN0cyAtIFRoZSBwcm9wZXJ0eSBwYXRoIFwiICsgc1Byb3BlcnR5UGF0aCArIFwiIGNhbm5vdCBiZSByZXNvbHZlZFwiKTtcblx0XHRcdH1cblx0XHR9KTtcblxuXHRcdGFEZXJpdmVkUHJvcGVydGllcy5mb3JFYWNoKG1Qcm9wZXJ0eUluZm8gPT4ge1xuXHRcdFx0aWYgKG1Qcm9wZXJ0eUluZm8ucHJvcGVydHkpIHtcblx0XHRcdFx0Y29uc3Qgc1RhcmdldFRleHRQYXRoID0gKG1Qcm9wZXJ0eUluZm8ucHJvcGVydHkuYW5ub3RhdGlvbnM/LkNvbW1vbj8uVGV4dCBhcyBhbnkpPy5wYXRoLFxuXHRcdFx0XHRcdHNUZXh0UGF0aEZyb21Jbml0aWFsRW50aXR5ID0gbVByb3BlcnR5SW5mby5uYXZpZ2F0aW9uUGF0aCArIHNUYXJnZXRUZXh0UGF0aDtcblx0XHRcdFx0LyoqXG5cdFx0XHRcdCAqIFRoZSBwcm9wZXJ0eSBUZXh0IG11c3QgYmUgYWRkZWQgb25seSBpZiB0aGUgcHJvcGVydHkgaXNcblx0XHRcdFx0ICogLSBub3QgcGFydCBvZiBhIHN0YXIgcHJvcGVydHkgKC5pLmUgJyonIG9yICduYXZpZ2F0aW9uLyonKSBvciBhIHRhcmdldGVkIEVudGl0eVxuXHRcdFx0XHQgKiAtIG5vdCBpbmNsdWRlIGludG8gdGhlIGluaXRpYWwgdGFyZ2V0ZWQgcHJvcGVydGllcyBvZiBTaWRlRWZmZWN0c1xuXHRcdFx0XHQgKiAgSW5kZWVkIGluIHRoZSB0d28gbGlzdGVkIGNhc2VzLCB0aGUgcHJvcGVydHkgY29udGFpbmluZyB0ZXh0IHdpbGwgYmUvaXMgcmVxdWVzdGVkIGJ5IGluaXRpYWwgU2lkZUVmZmVjdHMgY29uZmlndXJhdGlvbi5cblx0XHRcdFx0ICovXG5cblx0XHRcdFx0aWYgKFxuXHRcdFx0XHRcdHNUYXJnZXRUZXh0UGF0aCAmJlxuXHRcdFx0XHRcdGFFbnRpdGllc1JlcXVlc3RlZC5pbmRleE9mKHNUZXh0UGF0aEZyb21Jbml0aWFsRW50aXR5LnN1YnN0cmluZygwLCBzVGV4dFBhdGhGcm9tSW5pdGlhbEVudGl0eS5sYXN0SW5kZXhPZihcIi9cIikpKSA9PT1cblx0XHRcdFx0XHRcdC0xICYmXG5cdFx0XHRcdFx0YUluaXRpYWxQcm9wZXJ0aWVzLmluZGV4T2Yoc1RleHRQYXRoRnJvbUluaXRpYWxFbnRpdHkpID09PSAtMVxuXHRcdFx0XHQpIHtcblx0XHRcdFx0XHRvU2lkZUVmZmVjdC5UYXJnZXRQcm9wZXJ0aWVzLnB1c2goc1RleHRQYXRoRnJvbUluaXRpYWxFbnRpdHkpO1xuXHRcdFx0XHR9XG5cdFx0XHR9XG5cdFx0fSk7XG5cblx0XHRyZXR1cm4gb1NpZGVFZmZlY3Q7XG5cdH1cblx0LyoqXG5cdCAqIENvbnZlcnRzIFNpZGVFZmZlY3RzIHRvIGV4cGVjdGVkIGZvcm1hdFxuXHQgKiAgLSBDb252ZXJ0cyBTaWRlRWZmZWN0cyB0YXJnZXRzIHRvIGV4cGVjdGVkIGZvcm1hdFxuXHQgKiAgLSBSZW1vdmVzIGJpbmRpbmcgcGFyYW1ldGVyIGZyb20gU2lkZUVmZmVjdHMgdGFyZ2V0cyBwcm9wZXJ0aWVzXG5cdCAqICAtIEFkZHMgdGhlIHRleHQgcHJvcGVydGllc1xuXHQgKiAgLSBSZXBsYWNlcyBUYXJnZXRQcm9wZXJ0aWVzIGhhdmluZyByZWZlcmVuY2UgdG8gU291cmNlIFByb3BlcnRpZXMgZm9yIGEgU2lkZUVmZmVjdHMuXG5cdCAqXG5cdCAqIEBwcml2YXRlXG5cdCAqIEB1aTUtcmVzdHJpY3RlZFxuXHQgKiBAcGFyYW0ge29iamVjdH0gb1NpZGVFZmZlY3RzIFNpZGVFZmZlY3RzIGRlZmluaXRpb25cblx0ICogQHBhcmFtIHtzdHJpbmd9IHNFbnRpdHlUeXBlIE5hbWUgb2YgdGhlIGVudGl0eSB0eXBlXG5cdCAqIEBwYXJhbSB7c3RyaW5nfSBzQmluZGluZ1BhcmFtZXRlciBOYW1lIG9mIHRoZSBiaW5kaW5nIHBhcmFtZXRlclxuXHQgKiBAcmV0dXJucyB7b2JqZWN0fSBTaWRlRWZmZWN0cyBkZWZpbml0aW9uXG5cdCAqL1xuXHRwcml2YXRlIF9jb252ZXJ0U2lkZUVmZmVjdHMoXG5cdFx0b1NpZGVFZmZlY3RzOiBCYXNlU2lkZUVmZmVjdHNUeXBlIHwgQmFzZUFubm90YXRpb25TaWRlRWZmZWN0c1R5cGUsXG5cdFx0c0VudGl0eVR5cGU6IHN0cmluZyB8IHVuZGVmaW5lZCxcblx0XHRzQmluZGluZ1BhcmFtZXRlcj86IHN0cmluZ1xuXHQpOiBPRGF0YVNpZGVFZmZlY3RzVHlwZSB7XG5cdFx0Y29uc3QgbUVudGl0eVR5cGUgPSAodGhpcy5nZXRDb252ZXJ0ZWRNZXRhTW9kZWwoKSBhcyBDb252ZXJ0ZXJPdXRwdXQpLmVudGl0eVR5cGVzLmZpbmQob0VudGl0eVR5cGUgPT4ge1xuXHRcdFx0cmV0dXJuIG9FbnRpdHlUeXBlLmZ1bGx5UXVhbGlmaWVkTmFtZSA9PT0gc0VudGl0eVR5cGU7XG5cdFx0fSk7XG5cdFx0Y29uc3Qgb1RlbXBTaWRlRWZmZWN0cyA9IHRoaXMuX3JlbW92ZUJpbmRpbmdQYXJhbWV0ZXIodGhpcy5fY29udmVydFRhcmdldHNGb3JtYXQob1NpZGVFZmZlY3RzKSwgc0JpbmRpbmdQYXJhbWV0ZXIpO1xuXHRcdHJldHVybiBtRW50aXR5VHlwZVxuXHRcdFx0PyB0aGlzLl9yZXBsYWNlUmVmZXJlbmNlZFByb3BlcnRpZXModGhpcy5fYWRkUmVxdWlyZWRUZXh0UHJvcGVydGllcyhvVGVtcFNpZGVFZmZlY3RzLCBtRW50aXR5VHlwZSksIG1FbnRpdHlUeXBlKVxuXHRcdFx0OiBvVGVtcFNpZGVFZmZlY3RzO1xuXHR9XG5cblx0LyoqXG5cdCAqIENvbnZlcnRzIFNpZGVFZmZlY3RzIHRhcmdldHMgKFRhcmdldEVudGl0aWVzIGFuZCBUYXJnZXRQcm9wZXJ0aWVzKSB0byBleHBlY3RlZCBmb3JtYXRcblx0ICogIC0gVGFyZ2V0UHJvcGVydGllcyBhcyBhcnJheSBvZiBzdHJpbmdcblx0ICogIC0gVGFyZ2V0RW50aXRpZXMgYXMgYXJyYXkgb2Ygb2JqZWN0IHdpdGggcHJvcGVydHkgJE5hdmlnYXRpb25Qcm9wZXJ0eVBhdGguXG5cdCAqXG5cdCAqIEBwcml2YXRlXG5cdCAqIEB1aTUtcmVzdHJpY3RlZFxuXHQgKiBAcGFyYW0ge29iamVjdH0gb1NpZGVFZmZlY3RzIFNpZGVFZmZlY3RzIGRlZmluaXRpb25cblx0ICogQHJldHVybnMge29iamVjdH0gQ29udmVydGVkIFNpZGVFZmZlY3RzXG5cdCAqL1xuXHRwcml2YXRlIF9jb252ZXJ0VGFyZ2V0c0Zvcm1hdChvU2lkZUVmZmVjdHM6IEJhc2VTaWRlRWZmZWN0c1R5cGUgfCBCYXNlQW5ub3RhdGlvblNpZGVFZmZlY3RzVHlwZSk6IEJhc2VTaWRlRWZmZWN0c1R5cGUge1xuXHRcdGNvbnN0IFRhcmdldFByb3BlcnRpZXM6IHN0cmluZ1tdID0gKChvU2lkZUVmZmVjdHMuVGFyZ2V0UHJvcGVydGllcyBhcyBhbnlbXSkgfHwgW10pLnJlZHVjZShmdW5jdGlvbihhVGFyZ2V0UHJvcGVydGllcywgdlRhcmdldCkge1xuXHRcdFx0XHRjb25zdCBzVGFyZ2V0ID0gKHR5cGVvZiB2VGFyZ2V0ID09PSBcInN0cmluZ1wiICYmIHZUYXJnZXQpIHx8ICh2VGFyZ2V0LnR5cGUgPT09IFwiUHJvcGVydHlQYXRoXCIgJiYgdlRhcmdldC52YWx1ZSk7XG5cdFx0XHRcdGlmIChzVGFyZ2V0KSB7XG5cdFx0XHRcdFx0YVRhcmdldFByb3BlcnRpZXMucHVzaChzVGFyZ2V0KTtcblx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHRMb2cuZXJyb3IoXCJTaWRlRWZmZWN0cyAtIEVycm9yIHdoaWxlIHByb2Nlc3NpbmcgVGFyZ2V0UHJvcGVydGllcyBmb3IgU2lkZUVmZmVjdHNcIiArIG9TaWRlRWZmZWN0cy5mdWxseVF1YWxpZmllZE5hbWUpO1xuXHRcdFx0XHR9XG5cdFx0XHRcdHJldHVybiBhVGFyZ2V0UHJvcGVydGllcztcblx0XHRcdH0sIFtdKSxcblx0XHRcdFRhcmdldEVudGl0aWVzOiBTaWRlRWZmZWN0c1RhcmdldEVudGl0eVR5cGVbXSA9ICgob1NpZGVFZmZlY3RzLlRhcmdldEVudGl0aWVzIGFzIGFueVtdKSB8fCBbXSkubWFwKG1UYXJnZXRFbnRpdHkgPT4ge1xuXHRcdFx0XHQvKipcblx0XHRcdFx0ICogIFNpZGVFZmZlY3RzIHRoYXQgY29tZXMgZnJvbSBTQVAgRkUgZ2V0IFRhcmdldEVudGl0aWVzIHdpdGggJE5hdmlnYXRpb25Qcm9wZXJ0eVBhdGggd2hlcmVhc1xuXHRcdFx0XHQgKiAgb25lcyBjb21pbmcgZnJvbSB0aGUgY29udmVydGVkIE9EYXRhIG1vZGVsIGdldHMgYSBOYXZpZ2F0aW9uUHJvcGVydHlQYXRoIGZvcm1hdFxuXHRcdFx0XHQgKlxuXHRcdFx0XHQgKi9cblx0XHRcdFx0cmV0dXJuIHsgXCIkTmF2aWdhdGlvblByb3BlcnR5UGF0aFwiOiBtVGFyZ2V0RW50aXR5LiROYXZpZ2F0aW9uUHJvcGVydHlQYXRoIHx8IG1UYXJnZXRFbnRpdHkudmFsdWUgfHwgXCJcIiB9O1xuXHRcdFx0fSk7XG5cdFx0cmV0dXJuIHsgLi4ub1NpZGVFZmZlY3RzLCAuLi57IFRhcmdldFByb3BlcnRpZXMsIFRhcmdldEVudGl0aWVzIH0gfTtcblx0fVxuXG5cdC8qKlxuXHQgKiBHZXRzIFNpZGVFZmZlY3RzIHJlbGF0ZWQgdG8gYW4gZW50aXR5IHR5cGUgb3IgYWN0aW9uIHRoYXQgY29tZSBmcm9tIGFuIE9EYXRhIFNlcnZpY2Vcblx0ICogSW50ZXJuYWwgcm91dGluZSB0byBnZXQsIGZyb20gY29udmVydGVkIG9EYXRhIG1ldGFNb2RlbCwgU2lkZUVmZmVjdHMgcmVsYXRlZCB0byBhIHNwZWNpZmljIGVudGl0eSB0eXBlIG9yIGFjdGlvblxuXHQgKiBhbmQgdG8gY29udmVydCB0aGVzZSBTaWRlRWZmZWN0cyB3aXRoIGV4cGVjdGVkIGZvcm1hdC5cblx0ICpcblx0ICogQHByaXZhdGVcblx0ICogQHVpNS1yZXN0cmljdGVkXG5cdCAqIEBwYXJhbSB7b2JqZWN0fSBvU291cmNlIEVudGl0eSB0eXBlIG9yIGFjdGlvblxuXHQgKiBAcmV0dXJucyB7b2JqZWN0fSBBcnJheSBvZiBTaWRlRWZmZWN0c1xuXHQgKi9cblx0cHJpdmF0ZSBfZ2V0U2lkZUVmZmVjdHNGcm9tU291cmNlKG9Tb3VyY2U6IGFueSk6IE9EYXRhU2lkZUVmZmVjdHNUeXBlW10ge1xuXHRcdGNvbnN0IGFTaWRlRWZmZWN0czogT0RhdGFTaWRlRWZmZWN0c1R5cGVbXSA9IFtdO1xuXHRcdGNvbnN0IGF1dGhvcml6ZWRUeXBlcyA9IFtcIkVudGl0eVR5cGVcIiwgXCJBY3Rpb25cIl07XG5cdFx0aWYgKG9Tb3VyY2UuX3R5cGUgJiYgYXV0aG9yaXplZFR5cGVzLmluZGV4T2Yob1NvdXJjZS5fdHlwZSkgPiAtMSkge1xuXHRcdFx0Y29uc3QgbUVudGl0eVR5cGU6IEVudGl0eVR5cGUgfCB1bmRlZmluZWQgPSBvU291cmNlLl90eXBlID09PSBcIkVudGl0eVR5cGVcIiA/IG9Tb3VyY2UgOiBvU291cmNlLnNvdXJjZUVudGl0eVR5cGU7XG5cdFx0XHRpZiAobUVudGl0eVR5cGUpIHtcblx0XHRcdFx0Y29uc3QgbUNvbW1vbkFubm90YXRpb246IGFueSA9IG9Tb3VyY2UuYW5ub3RhdGlvbnM/LkNvbW1vbiB8fCB7fTtcblx0XHRcdFx0Y29uc3QgbUJpbmRpbmdQYXJhbWV0ZXIgPSAoKG9Tb3VyY2UgYXMgQWN0aW9uKS5wYXJhbWV0ZXJzIHx8IFtdKS5maW5kKFxuXHRcdFx0XHRcdG1QYXJhbWV0ZXIgPT4gbVBhcmFtZXRlci50eXBlID09PSAobUVudGl0eVR5cGUgfHwgb1NvdXJjZSkuZnVsbHlRdWFsaWZpZWROYW1lXG5cdFx0XHRcdCk7XG5cdFx0XHRcdGNvbnN0IHNCaW5kaW5nUGFyYW1ldGVyID0gbUJpbmRpbmdQYXJhbWV0ZXIgPyBtQmluZGluZ1BhcmFtZXRlci5mdWxseVF1YWxpZmllZE5hbWUuc3BsaXQoXCIvXCIpWzFdIDogXCJcIjtcblx0XHRcdFx0T2JqZWN0LmtleXMobUNvbW1vbkFubm90YXRpb24pXG5cdFx0XHRcdFx0LmZpbHRlcihzQW5ub3RhdGlvbk5hbWUgPT4gbUNvbW1vbkFubm90YXRpb25bc0Fubm90YXRpb25OYW1lXS4kVHlwZSA9PT0gQ29tbW9uQW5ub3RhdGlvblR5cGVzLlNpZGVFZmZlY3RzVHlwZSlcblx0XHRcdFx0XHQuZm9yRWFjaChzQW5ub3RhdGlvbk5hbWUgPT4ge1xuXHRcdFx0XHRcdFx0YVNpZGVFZmZlY3RzLnB1c2goXG5cdFx0XHRcdFx0XHRcdHRoaXMuX2NvbnZlcnRTaWRlRWZmZWN0cyhtQ29tbW9uQW5ub3RhdGlvbltzQW5ub3RhdGlvbk5hbWVdLCBtRW50aXR5VHlwZS5mdWxseVF1YWxpZmllZE5hbWUsIHNCaW5kaW5nUGFyYW1ldGVyKVxuXHRcdFx0XHRcdFx0KTtcblx0XHRcdFx0XHR9KTtcblx0XHRcdH1cblx0XHR9XG5cdFx0cmV0dXJuIGFTaWRlRWZmZWN0cztcblx0fVxuXG5cdC8qKlxuXHQgKiBMb2dzIFNpZGVFZmZlY3RzIHJlcXVlc3QuXG5cdCAqXG5cdCAqIEBwcml2YXRlXG5cdCAqIEB1aTUtcmVzdHJpY3RlZFxuXHQgKiBAcGFyYW0ge0FycmF5fSBhUGF0aEV4cHJlc3Npb25zIFNpZGVFZmZlY3RzIHRhcmdldHNcblx0ICogQHBhcmFtIHtvYmplY3R9IG9Db250ZXh0IENvbnRleHRcblx0ICovXG5cdHByaXZhdGUgX2xvZ1JlcXVlc3QoYVBhdGhFeHByZXNzaW9uczogU2lkZUVmZmVjdHNUYXJnZXRbXSwgb0NvbnRleHQ6IENvbnRleHQpIHtcblx0XHRjb25zdCBzVGFyZ2V0UGF0aHMgPSBhUGF0aEV4cHJlc3Npb25zLnJlZHVjZShmdW5jdGlvbihzUGF0aHMsIG1UYXJnZXQpIHtcblx0XHRcdHJldHVybiBzUGF0aHMgKyBcIlxcblxcdFxcdFwiICsgKChtVGFyZ2V0IGFzIFNpZGVFZmZlY3RzVGFyZ2V0RW50aXR5VHlwZSkuJE5hdmlnYXRpb25Qcm9wZXJ0eVBhdGggfHwgbVRhcmdldCB8fCBcIlwiKTtcblx0XHR9LCBcIlwiKTtcblx0XHRMb2cuZGVidWcoXCJTaWRlRWZmZWN0cyAtIFJlcXVlc3Q6XFxuXFx0Q29udGV4dCBwYXRoIDogXCIgKyBvQ29udGV4dC5nZXRQYXRoKCkgKyBcIlxcblxcdFByb3BlcnR5IHBhdGhzIDpcIiArIHNUYXJnZXRQYXRocyk7XG5cdH1cblxuXHQvKipcblx0ICogUmVtb3ZlcyBuYW1lIG9mIGJpbmRpbmcgcGFyYW1ldGVyIG9uIFNpZGVFZmZlY3RzIHRhcmdldHMuXG5cdCAqXG5cdCAqIEBwcml2YXRlXG5cdCAqIEB1aTUtcmVzdHJpY3RlZFxuXHQgKiBAcGFyYW0ge29iamVjdH0gb1NpZGVFZmZlY3RzIFNpZGVFZmZlY3RzIGRlZmluaXRpb25cblx0ICogQHBhcmFtIHtzdHJpbmd9IHNCaW5kaW5nUGFyYW1ldGVyTmFtZSBOYW1lIG9mIGJpbmRpbmcgcGFyYW1ldGVyXG5cdCAqIEByZXR1cm5zIHtvYmplY3R9IFNpZGVFZmZlY3RzIGRlZmluaXRpb25cblx0ICovXG5cdHByaXZhdGUgX3JlbW92ZUJpbmRpbmdQYXJhbWV0ZXIob1NpZGVFZmZlY3RzOiBCYXNlU2lkZUVmZmVjdHNUeXBlLCBzQmluZGluZ1BhcmFtZXRlck5hbWU/OiBzdHJpbmcpOiBCYXNlU2lkZUVmZmVjdHNUeXBlIHtcblx0XHRpZiAoc0JpbmRpbmdQYXJhbWV0ZXJOYW1lKSB7XG5cdFx0XHRjb25zdCBhVGFyZ2V0cyA9IFtcIlRhcmdldFByb3BlcnRpZXNcIiwgXCJUYXJnZXRFbnRpdGllc1wiXTtcblx0XHRcdGFUYXJnZXRzLmZvckVhY2goc1RhcmdldCA9PiB7XG5cdFx0XHRcdGxldCBtVGFyZ2V0ID0gKG9TaWRlRWZmZWN0cyBhcyBhbnkpW3NUYXJnZXRdO1xuXHRcdFx0XHRpZiAobVRhcmdldCkge1xuXHRcdFx0XHRcdG1UYXJnZXQgPSBtVGFyZ2V0Lm1hcCgobVByb3BlcnR5OiBhbnkpID0+IHtcblx0XHRcdFx0XHRcdGNvbnN0IGJOYXZpZ2F0aW9uUHJvcGVydHlQYXRoID0gbVByb3BlcnR5LiROYXZpZ2F0aW9uUHJvcGVydHlQYXRoICE9PSB1bmRlZmluZWQ7IC8vIE5lZWQgdG8gdGVzdCB3aXRoIHVuZGVmaW5lZCBzaW5jZSAgbVByb3BlcnR5LiROYXZpZ2F0aW9uUHJvcGVydHlQYXRoIGNvdWxkIGJlIFwiXCIgKGVtcHR5IHN0cmluZylcblx0XHRcdFx0XHRcdGNvbnN0IHNWYWx1ZSA9IChiTmF2aWdhdGlvblByb3BlcnR5UGF0aCA/IG1Qcm9wZXJ0eS4kTmF2aWdhdGlvblByb3BlcnR5UGF0aCA6IG1Qcm9wZXJ0eSkucmVwbGFjZShcblx0XHRcdFx0XHRcdFx0bmV3IFJlZ0V4cChcIl5cIiArIHNCaW5kaW5nUGFyYW1ldGVyTmFtZSArIFwiPy5cIiksXG5cdFx0XHRcdFx0XHRcdFwiXCJcblx0XHRcdFx0XHRcdCk7XG5cdFx0XHRcdFx0XHRyZXR1cm4gYk5hdmlnYXRpb25Qcm9wZXJ0eVBhdGggPyB7ICROYXZpZ2F0aW9uUHJvcGVydHlQYXRoOiBzVmFsdWUgfSA6IHNWYWx1ZTtcblx0XHRcdFx0XHR9KTtcblx0XHRcdFx0fVxuXHRcdFx0XHQob1NpZGVFZmZlY3RzIGFzIGFueSlbc1RhcmdldF0gPSBtVGFyZ2V0O1xuXHRcdFx0fSk7XG5cdFx0fVxuXHRcdHJldHVybiBvU2lkZUVmZmVjdHM7XG5cdH1cblxuXHQvKipcblx0ICogUmVtb3ZlIGR1cGxpY2F0ZXMgaW4gU2lkZUVmZmVjdHMgdGFyZ2V0cy5cblx0ICpcblx0ICogQHByaXZhdGVcblx0ICogQHVpNS1yZXN0cmljdGVkXG5cdCAqIEBwYXJhbSB7QXJyYXl9IGFUYXJnZXRzIFNpZGVFZmZlY3RzIHRhcmdldHNcblx0ICogQHJldHVybnMge0FycmF5fSBTaWRlRWZmZWN0cyB0YXJnZXRzIHdpdGhvdXQgZHVwbGljYXRlc1xuXHQgKi9cblx0cHJpdmF0ZSBfcmVtb3ZlRHVwbGljYXRlVGFyZ2V0cyhhVGFyZ2V0czogU2lkZUVmZmVjdHNUYXJnZXRbXSk6IFNpZGVFZmZlY3RzVGFyZ2V0W10ge1xuXHRcdHJldHVybiBhVGFyZ2V0cy5maWx0ZXIoXG5cdFx0XHQobVRhcmdldDogYW55LCBpSW5kZXgsIGFUYXJnZXRzKSA9PlxuXHRcdFx0XHRhVGFyZ2V0cy5maW5kSW5kZXgoKG1TZWFyY2hUYXJnZXQ6IGFueSkgPT4ge1xuXHRcdFx0XHRcdHJldHVybiAoXG5cdFx0XHRcdFx0XHRtU2VhcmNoVGFyZ2V0ID09PSBtVGFyZ2V0IHx8IC8vIFByb3BlcnR5UGF0aFxuXHRcdFx0XHRcdFx0KG1UYXJnZXQuJE5hdmlnYXRpb25Qcm9wZXJ0eVBhdGggJiYgbVNlYXJjaFRhcmdldC4kTmF2aWdhdGlvblByb3BlcnR5UGF0aCA9PT0gbVRhcmdldC4kTmF2aWdhdGlvblByb3BlcnR5UGF0aCkgLy8gTmF2aWdhdGlvblByb3BlcnR5UGF0aFxuXHRcdFx0XHRcdCk7XG5cdFx0XHRcdH0pID09PSBpSW5kZXhcblx0XHQpO1xuXHR9XG5cblx0LyoqXG5cdCAqIFJlcGxhY2VzIFRhcmdldFByb3BlcnRpZXMgaGF2aW5nIHJlZmVyZW5jZSB0byBTb3VyY2UgUHJvcGVydGllcyBmb3IgYSBTaWRlRWZmZWN0c1xuXHQgKiBJZiBhIFNpZGVFZmZlY3RzIFNvdXJjZSBQcm9wZXJ0eSBpcyBhbiBuYXZpZ2F0aW9uIGVudGl0eSByZWZlcmVuY2UsIHRoZSBTaWRlRWZmZWN0cyBUYXJnZXQgUHJvcGVydGllcyBjYW5ub3QgYmUgYSBwcm9wZXJ0eSBvZiB0aGlzIG5hdmlnYXRpb24gZW50aXR5LlxuXHQgKiBJbmRlZWQgdGhpcyBjb25maWd1cmF0aW9uIGxlYWRzIHRvIGVycm9yIGludG8gdGhlIE9EYXRhIFY0IE1vZGVsIHNpbmNlIHJlc3BvbnNlIGNhbm5vdCBiZSBwcm9jZXNzZWQgYmVjYXVzZSB0aGlzIHdvdWxkIG1lYW4gdGhhdCB3ZSBtZXJnZSBwcm9wZXJ0aWVzIG9mIHRoZSBuZXcgdGFyZ2V0IGludG8gdGhlIG9sZCB0YXJnZXQgb2YgdGhlIG5hdmlnYXRpb24gcHJvcGVydHkuXG5cdCAqIEluIG9yZGVyIHRvIHJlcXVlc3QgbmV3IHZhbHVlIG9mIHRoZXNlIHRhcmdldCBwcm9wZXJ0aWVzIHRoZSBTaWRlRWZmZWN0cyB3aWxsIHJlcXVlc3QgZm9yIHRoZSBlbnRpcmUgRW50aXR5IGluc3RlYWQgb2YganVzdCBhIHNldCBvZiBwcm9wZXJ0aWVzLlxuXHQgKiBGb3IgdGhlIGZpcnN0IHZlcnNpb24sIHdlIHJlbW92ZSBhbGwgbmF2aWdhdGlvbiBwcm9wZXJ0aWVzIGFuZCByZXBsYWNlIHRoZW0gYnkgdGFyZ2V0RW50aXRpZXMuIFRoaXMgY2hhbmdlIGNvdWxkIGJlIGltcHJvdmVkIGluIG5leHQgdmVyc2lvbi5cblx0ICpcblx0ICogQHByaXZhdGVcblx0ICogQHVpNS1yZXN0cmljdGVkXG5cdCAqIEBwYXJhbSB7b2JqZWN0fSBvU2lkZUVmZmVjdCBTaWRlRWZmZWN0cyBkZWZpbml0aW9uXG5cdCAqIEBwYXJhbSB7b2JqZWN0fSBtRW50aXR5VHlwZSAgRW50aXR5IHR5cGVcblx0ICogQHJldHVybnMge29iamVjdH0gU2lkZUVmZmVjdHMgZGVmaW5pdGlvbiB3aXRob3V0IHJlZmVyZW5jZWQgdGFyZ2V0IHByb3BlcnRpZXNcblx0ICovXG5cdHByaXZhdGUgX3JlcGxhY2VSZWZlcmVuY2VkUHJvcGVydGllcyhvU2lkZUVmZmVjdDogQmFzZVNpZGVFZmZlY3RzVHlwZSwgbUVudGl0eVR5cGU6IEVudGl0eVR5cGUpOiBCYXNlU2lkZUVmZmVjdHNUeXBlIHtcblx0XHRsZXQgYlNpZGVFZmZlY3RzQ2hhbmdlZDogYm9vbGVhbiA9IGZhbHNlO1xuXHRcdGNvbnN0IGFFbnRpdGllczogc3RyaW5nW10gPVxuXHRcdFx0XHQob1NpZGVFZmZlY3QuVGFyZ2V0RW50aXRpZXMgfHwgW10pLm1hcChtTmF2aWdhdGlvbiA9PiB7XG5cdFx0XHRcdFx0cmV0dXJuIG1OYXZpZ2F0aW9uLiROYXZpZ2F0aW9uUHJvcGVydHlQYXRoO1xuXHRcdFx0XHR9KSB8fCBbXSxcblx0XHRcdGFQcm9wZXJ0aWVzOiBzdHJpbmdbXSA9IFtdO1xuXG5cdFx0b1NpZGVFZmZlY3QuVGFyZ2V0UHJvcGVydGllcy5mb3JFYWNoKHNQcm9wZXJ0eVBhdGggPT4ge1xuXHRcdFx0bGV0IGJUYXJnZXRDaGFuZ2VkID0gZmFsc2U7XG5cdFx0XHRjb25zdCBpTGFzdFBhdGhTZXBhcmF0b3JJbmRleCA9IHNQcm9wZXJ0eVBhdGgubGFzdEluZGV4T2YoXCIvXCIpO1xuXHRcdFx0aWYgKGlMYXN0UGF0aFNlcGFyYXRvckluZGV4ICE9PSAtMSkge1xuXHRcdFx0XHRjb25zdCBzTmF2aWdhdGlvblBhdGggPSBzUHJvcGVydHlQYXRoLnN1YnN0cmluZygwLCBpTGFzdFBhdGhTZXBhcmF0b3JJbmRleCk7XG5cdFx0XHRcdGNvbnN0IG9UYXJnZXQgPSBtRW50aXR5VHlwZS5yZXNvbHZlUGF0aChzTmF2aWdhdGlvblBhdGgpO1xuXHRcdFx0XHRpZiAob1RhcmdldCAmJiBvVGFyZ2V0Ll90eXBlID09PSBcIk5hdmlnYXRpb25Qcm9wZXJ0eVwiKSB7XG5cdFx0XHRcdFx0Ly9UZXN0IGlmIGl0J3Mgbm90IGEgcHJvcGVydHkgYm91bmQgb24gY29tcGxleFR5cGUgKF9Db21wbGV4VHlwZS9NeVByb3BlcnR5KVxuXHRcdFx0XHRcdGJTaWRlRWZmZWN0c0NoYW5nZWQgPSB0cnVlO1xuXHRcdFx0XHRcdGJUYXJnZXRDaGFuZ2VkID0gdHJ1ZTtcblx0XHRcdFx0XHRpZiAoIWFFbnRpdGllcy5pbmNsdWRlcyhzTmF2aWdhdGlvblBhdGgpKSB7XG5cdFx0XHRcdFx0XHRhRW50aXRpZXMucHVzaChzTmF2aWdhdGlvblBhdGgpO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0fVxuXHRcdFx0fVxuXHRcdFx0aWYgKCFiVGFyZ2V0Q2hhbmdlZCkge1xuXHRcdFx0XHRhUHJvcGVydGllcy5wdXNoKHNQcm9wZXJ0eVBhdGgpO1xuXHRcdFx0fVxuXHRcdH0pO1xuXG5cdFx0aWYgKGJTaWRlRWZmZWN0c0NoYW5nZWQpIHtcblx0XHRcdG9TaWRlRWZmZWN0LlRhcmdldFByb3BlcnRpZXMgPSBhUHJvcGVydGllcztcblx0XHRcdG9TaWRlRWZmZWN0LlRhcmdldEVudGl0aWVzID0gYUVudGl0aWVzLm1hcChzTmF2aWdhdGlvblBhdGggPT4ge1xuXHRcdFx0XHRyZXR1cm4ge1xuXHRcdFx0XHRcdCROYXZpZ2F0aW9uUHJvcGVydHlQYXRoOiBzTmF2aWdhdGlvblBhdGhcblx0XHRcdFx0fTtcblx0XHRcdH0pO1xuXHRcdH1cblxuXHRcdHJldHVybiBvU2lkZUVmZmVjdDtcblx0fVxuXG5cdC8qKlxuXHQgKiBHZXRzIFNpZGVFZmZlY3RzIGFjdGlvbiB0eXBlIHRoYXQgY29tZSBmcm9tIGFuIE9EYXRhIFNlcnZpY2Vcblx0ICogSW50ZXJuYWwgcm91dGluZSB0byBnZXQsIGZyb20gY29udmVydGVkIG9EYXRhIG1ldGFNb2RlbCwgU2lkZUVmZmVjdHMgb24gYWN0aW9uc1xuXHQgKiByZWxhdGVkIHRvIGEgc3BlY2lmaWMgZW50aXR5IHR5cGUgYW5kIHRvIGNvbnZlcnQgdGhlc2UgU2lkZUVmZmVjdHMgd2l0aFxuXHQgKiBleHBlY3RlZCBmb3JtYXQuXG5cdCAqXG5cdCAqIEBwcml2YXRlXG5cdCAqIEB1aTUtcmVzdHJpY3RlZFxuXHQgKiBAcGFyYW0ge29iamVjdH0gbUVudGl0eVR5cGUgRW50aXR5IHR5cGVcblx0ICogQHJldHVybnMge29iamVjdH0gRW50aXR5IHR5cGUgU2lkZUVmZmVjdHMgZGljdGlvbmFyeVxuXHQgKi9cblx0cHJpdmF0ZSBfcmV0cmlldmVPRGF0YUFjdGlvbnNTaWRlRWZmZWN0cyhtRW50aXR5VHlwZTogRW50aXR5VHlwZSk6IFJlY29yZDxzdHJpbmcsIEFjdGlvblNpZGVFZmZlY3RzVHlwZT4ge1xuXHRcdGNvbnN0IG9TaWRlRWZmZWN0czogUmVjb3JkPHN0cmluZywgQWN0aW9uU2lkZUVmZmVjdHNUeXBlPiA9IHt9O1xuXHRcdGNvbnN0IGFBY3Rpb25zID0gbUVudGl0eVR5cGUuYWN0aW9ucztcblx0XHRpZiAoYUFjdGlvbnMpIHtcblx0XHRcdE9iamVjdC5rZXlzKGFBY3Rpb25zKS5mb3JFYWNoKHNBY3Rpb25OYW1lID0+IHtcblx0XHRcdFx0Y29uc3Qgb0FjdGlvbiA9IG1FbnRpdHlUeXBlLmFjdGlvbnNbc0FjdGlvbk5hbWVdO1xuXHRcdFx0XHRjb25zdCB0cmlnZ2VyQWN0aW9uczogU3RyaW5nW10gPSBbXTtcblx0XHRcdFx0bGV0IHBhdGhFeHByZXNzaW9uczogU2lkZUVmZmVjdHNUYXJnZXRbXSA9IFtdO1xuXHRcdFx0XHRsZXQgYVRhcmdldHM6IFNpZGVFZmZlY3RzVGFyZ2V0W10gPSBbXTtcblxuXHRcdFx0XHR0aGlzLl9nZXRTaWRlRWZmZWN0c0Zyb21Tb3VyY2Uob0FjdGlvbikuZm9yRWFjaChvU2lkZUVmZmVjdCA9PiB7XG5cdFx0XHRcdFx0Y29uc3Qgc1RyaWdnZXJBY3Rpb24gPSBvU2lkZUVmZmVjdC5UcmlnZ2VyQWN0aW9uO1xuXHRcdFx0XHRcdGFUYXJnZXRzID0gYVRhcmdldHMuY29uY2F0KG9TaWRlRWZmZWN0LlRhcmdldEVudGl0aWVzIHx8IFtdKS5jb25jYXQoKG9TaWRlRWZmZWN0LlRhcmdldFByb3BlcnRpZXMgYXMgYW55W10pIHx8IFtdKTtcblx0XHRcdFx0XHRpZiAoc1RyaWdnZXJBY3Rpb24gJiYgdHJpZ2dlckFjdGlvbnMuaW5kZXhPZihzVHJpZ2dlckFjdGlvbikgPT09IC0xKSB7XG5cdFx0XHRcdFx0XHR0cmlnZ2VyQWN0aW9ucy5wdXNoKHNUcmlnZ2VyQWN0aW9uKTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH0pO1xuXHRcdFx0XHRwYXRoRXhwcmVzc2lvbnMgPSB0aGlzLl9yZW1vdmVEdXBsaWNhdGVUYXJnZXRzKGFUYXJnZXRzKTtcblx0XHRcdFx0b1NpZGVFZmZlY3RzW3NBY3Rpb25OYW1lXSA9IHsgcGF0aEV4cHJlc3Npb25zLCB0cmlnZ2VyQWN0aW9ucyB9O1xuXHRcdFx0fSk7XG5cdFx0fVxuXHRcdHJldHVybiBvU2lkZUVmZmVjdHM7XG5cdH1cblxuXHQvKipcblx0ICogR2V0cyBTaWRlRWZmZWN0cyBlbnRpdHkgdHlwZSB0aGF0IGNvbWUgZnJvbSBhbiBPRGF0YSBTZXJ2aWNlXG5cdCAqIEludGVybmFsIHJvdXRpbmUgdG8gZ2V0LCBmcm9tIGNvbnZlcnRlZCBvRGF0YSBtZXRhTW9kZWwsIFNpZGVFZmZlY3RzXG5cdCAqIHJlbGF0ZWQgdG8gYSBzcGVjaWZpYyBlbnRpdHkgdHlwZSBhbmQgdG8gY29udmVydCB0aGVzZSBTaWRlRWZmZWN0cyB3aXRoXG5cdCAqIGV4cGVjdGVkIGZvcm1hdC5cblx0ICpcblx0ICogQHByaXZhdGVcblx0ICogQHVpNS1yZXN0cmljdGVkXG5cdCAqIEBwYXJhbSB7b2JqZWN0fSBtRW50aXR5VHlwZSBFbnRpdHkgdHlwZVxuXHQgKiBAcmV0dXJucyB7b2JqZWN0fSBFbnRpdHkgdHlwZSBTaWRlRWZmZWN0cyBkaWN0aW9uYXJ5XG5cdCAqL1xuXHRwcml2YXRlIF9yZXRyaWV2ZU9EYXRhRW50aXR5U2lkZUVmZmVjdHMobUVudGl0eVR5cGU6IEVudGl0eVR5cGUpOiBSZWNvcmQ8c3RyaW5nLCBPRGF0YVNpZGVFZmZlY3RzVHlwZT4ge1xuXHRcdGNvbnN0IG9FbnRpdHlTaWRlRWZmZWN0czogUmVjb3JkPHN0cmluZywgT0RhdGFTaWRlRWZmZWN0c1R5cGU+ID0ge307XG5cdFx0dGhpcy5fZ2V0U2lkZUVmZmVjdHNGcm9tU291cmNlKG1FbnRpdHlUeXBlKS5mb3JFYWNoKG9TaWRlRWZmZWN0cyA9PiB7XG5cdFx0XHRvRW50aXR5U2lkZUVmZmVjdHNbb1NpZGVFZmZlY3RzLmZ1bGx5UXVhbGlmaWVkTmFtZV0gPSBvU2lkZUVmZmVjdHM7XG5cdFx0fSk7XG5cdFx0cmV0dXJuIG9FbnRpdHlTaWRlRWZmZWN0cztcblx0fVxuXG5cdGdldEludGVyZmFjZSgpOiBhbnkge1xuXHRcdHJldHVybiB0aGlzO1xuXHR9XG59XG5cbmNsYXNzIFNpZGVFZmZlY3RzU2VydmljZUZhY3RvcnkgZXh0ZW5kcyBTZXJ2aWNlRmFjdG9yeTxTaWRlRWZmZWN0c1NldHRpbmdzPiB7XG5cdGNyZWF0ZUluc3RhbmNlKG9TZXJ2aWNlQ29udGV4dDogU2VydmljZUNvbnRleHQ8U2lkZUVmZmVjdHNTZXR0aW5ncz4pIHtcblx0XHRjb25zdCBTaWRlRWZmZWN0c1NlcnZpY2VTZXJ2aWNlID0gbmV3IFNpZGVFZmZlY3RzU2VydmljZShvU2VydmljZUNvbnRleHQpO1xuXHRcdHJldHVybiBTaWRlRWZmZWN0c1NlcnZpY2VTZXJ2aWNlLmluaXRQcm9taXNlO1xuXHR9XG59XG5cbmV4cG9ydCBkZWZhdWx0IFNpZGVFZmZlY3RzU2VydmljZUZhY3Rvcnk7XG4iXX0=