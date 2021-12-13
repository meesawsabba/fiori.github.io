/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)
        (c) Copyright 2009-2021 SAP SE. All rights reserved
    
 */
sap.ui.define(
	[
		"sap/ui/core/mvc/ControllerExtension",
		"sap/ui/core/mvc/OverrideExecution",
		"sap/base/Log",
		"sap/base/util/merge",
		"sap/ui/fl/apply/api/ControlVariantApplyAPI",
		"sap/ui/mdc/p13n/StateUtil",
		"sap/fe/navigation/library",
		"sap/fe/core/CommonUtils"
	],
	function(ControllerExtension, OverrideExecution, Log, mergeObjects, ControlVariantApplyAPI, StateUtil, NavLibrary, CommonUtils) {
		"use strict";

		// additionalStates are stored next to control IDs, so name clash avoidance needed. Fortunately IDs have restrictions:
		// "Allowed is a sequence of characters (capital/lowercase), digits, underscores, dashes, points and/or colons."
		// Therefore adding a symbol like # or @
		var ADDITIONAL_STATES_KEY = "#additionalStates",
			NavType = NavLibrary.NavType;

		///////////////////////////////////////////////////////////////////
		// methods to retrieve & apply states for the different controls //
		///////////////////////////////////////////////////////////////////

		var _mControlStateHandlerMap = {
			"sap.ui.fl.variants.VariantManagement": {
				retrieve: function(oVM) {
					return {
						"variantId": oVM.getModified() ? oVM.getId() : oVM.getCurrentVariantKey()
					};
				},
				apply: function(oVM, oControlState) {
					if (oControlState && oControlState.variantId !== undefined && oControlState.variantId !== oVM.getCurrentVariantKey()) {
						return ControlVariantApplyAPI.activateVariant({
							element: oVM,
							variantReference: oControlState.variantId
						});
					}
				}
			},
			"sap.m.IconTabBar": {
				retrieve: function(oTabBar) {
					return {
						selectedKey: oTabBar.getSelectedKey()
					};
				},
				apply: function(oTabBar, oControlState) {
					if (oControlState && oControlState.selectedKey) {
						var oSelectedItem = oTabBar.getItems().find(function(oItem) {
							return oItem.getKey() === oControlState.selectedKey;
						});
						if (oSelectedItem) {
							oTabBar.setSelectedItem(oSelectedItem);
						}
					}
				}
			},
			"sap.ui.mdc.FilterBar": {
				retrieve: function(oFilterBar) {
					return StateUtil.retrieveExternalState(oFilterBar).then(function(mFilterBarState) {
						// remove sensitive or view state irrelevant fields
						var aPropertiesInfo = oFilterBar.getPropertyInfoSet(),
							mFilter = mFilterBarState.filter || {};
						aPropertiesInfo
							.filter(function(oPropertyInfo) {
								return (
									mFilter[oPropertyInfo.path] &&
									(oPropertyInfo.removeFromAppState || mFilter[oPropertyInfo.path].length === 0)
								);
							})
							.forEach(function(oPropertyInfo) {
								delete mFilter[oPropertyInfo.path];
							});
						return mFilterBarState;
					});
				},
				apply: function(oFilterBar, oControlState) {
					if (oControlState) {
						return StateUtil.applyExternalState(oFilterBar, oControlState);
					}
				}
			},
			"sap.ui.mdc.Table": {
				retrieve: function(oTable) {
					return StateUtil.retrieveExternalState(oTable);
				},
				apply: function(oTable, oControlState) {
					if (oControlState) {
						return StateUtil.applyExternalState(oTable, oControlState);
					}
				},
				refreshBinding: function(oTable) {
					var oTableBinding = oTable.getRowBinding();
					if (oTableBinding) {
						var oRootBinding = oTableBinding.getRootBinding();
						if (oRootBinding === oTableBinding) {
							// absolute binding
							oTableBinding.refresh();
						} else {
							// relative binding
							var oHeaderContext = oTableBinding.getHeaderContext();
							var sGroupId = oTableBinding.getGroupId();

							if (oHeaderContext) {
								oHeaderContext.requestSideEffects([{ $NavigationPropertyPath: "" }], sGroupId);
							}
						}
					} else {
						Log.info("Table: " + oTable.getId() + " was not refreshed. No binding found!");
					}
				}
			},
			"sap.uxap.ObjectPageLayout": {
				retrieve: function(oOPLayout) {
					return {
						selectedSection: oOPLayout.getSelectedSection()
					};
				},
				apply: function(oOPLayout, oControlState) {
					oControlState && oOPLayout.setSelectedSection(oControlState.selectedSection);
				},
				refreshBinding: function(oOPLayout) {
					var oBindingContext = oOPLayout.getBindingContext();
					var oBinding = oBindingContext && oBindingContext.getBinding();
					if (oBinding) {
						var sMetaPath = CommonUtils.getMetaPathForContext(oBindingContext);
						var sStrategy = CommonUtils.getControlRefreshStrategyForContextPath(oOPLayout, sMetaPath);
						if (sStrategy === "self") {
							// Refresh main context and 1-1 navigation properties or OP
							var oModel = oBindingContext.getModel(),
								oMetaModel = oModel.getMetaModel(),
								oNavigationProperties =
									CommonUtils.getContextPathProperties(oMetaModel, sMetaPath, {
										$kind: "NavigationProperty"
									}) || {},
								aNavPropertiesToRequest = Object.keys(oNavigationProperties).reduce(function(aPrev, sNavProp) {
									if (oNavigationProperties[sNavProp].$isCollection !== true) {
										aPrev.push({ $NavigationPropertyPath: sNavProp });
									}
									return aPrev;
								}, []),
								aProperties = [{ $PropertyPath: "*" }],
								sGroupId = oBinding.getGroupId();

							oBindingContext.requestSideEffects(aProperties.concat(aNavPropertiesToRequest), sGroupId);
						} else if (sStrategy === "includingDependents") {
							// Complete refresh
							oBinding.refresh();
						}
					} else {
						Log.info("ObjectPage: " + oOPLayout.getId() + " was not refreshed. No binding found!");
					}
				}
			},
			"sap.fe.macros.table.QuickFilterContainer": {
				retrieve: function(oQuickFilter) {
					return {
						selectedKey: oQuickFilter.getSelectorKey()
					};
				},
				apply: function(oQuickFilter, oControlState) {
					oControlState && oQuickFilter.setSelectorKey(oControlState.selectedKey);
				}
			},
			"sap.m.SegmentedButton": {
				retrieve: function(oSegmentedButton) {
					return {
						selectedKey: oSegmentedButton.getSelectedKey()
					};
				},
				apply: function(oSegmentedButton, oControlState) {
					oControlState && oSegmentedButton.setSelectedKey(oControlState.selectedKey);
				}
			},
			"sap.m.Select": {
				retrieve: function(oSelect) {
					return {
						selectedKey: oSelect.getSelectedKey()
					};
				},
				apply: function(oSelect, oControlState) {
					oControlState && oSelect.setSelectedKey(oControlState.selectedKey);
				}
			},
			"sap.f.DynamicPage": {
				retrieve: function(oDynamicPage) {
					return {
						headerExpanded: oDynamicPage.getHeaderExpanded()
					};
				},
				apply: function(oDynamicPage, oControlState) {
					oControlState && oDynamicPage.setHeaderExpanded(oControlState.headerExpanded);
				}
			},
			"sap.ui.core.mvc.View": {
				retrieve: function(oView) {
					var oController = oView.getController();
					if (oController && oController.viewState) {
						return oController.viewState.retrieveViewState(oController.viewState);
					}
					return {};
				},
				apply: function(oView, oControlState, oNavParameters) {
					var oController = oView.getController();
					if (oController && oController.viewState) {
						return oController.viewState.applyViewState(oControlState, oNavParameters);
					}
				},
				refreshBinding: function(oView) {
					var oController = oView.getController();
					if (oController && oController.viewState) {
						return oController.viewState.refreshViewBindings();
					}
				}
			},
			"sap.ui.core.ComponentContainer": {
				retrieve: function(oComponentContainer) {
					var oComponent = oComponentContainer.getComponentInstance();
					if (oComponent) {
						return this.retrieveControlState(oComponent.getRootControl());
					}
					return {};
				},
				apply: function(oComponentContainer, oControlState, oNavParameters) {
					var oComponent = oComponentContainer.getComponentInstance();
					if (oComponent) {
						return this.applyControlState(oComponent.getRootControl(), oControlState, oNavParameters);
					}
				}
			}
		};

		/**
		 * @class A controller extension offering hooks for state handling
		 *
		 * If you need to maintain a specific state for your application, you can use the controller extension.
		 *
		 * @name sap.fe.core.controllerextensions.ViewState
		 * @hideconstructor
		 * @public
		 * @since 1.85.0
		 */
		var ViewState = ControllerExtension.extend("sap.fe.core.controllerextensions.ViewState", {
			metadata: {
				methods: {
					refreshViewBindings: { "public": true, "final": true },
					adaptBindingRefreshControls: {
						"public": true,
						"final": false,
						overrideExecution: OverrideExecution.After
					},
					getControlRefreshBindingHandler: {
						"public": false,
						"final": true
					},
					refreshControlBinding: {
						"public": false,
						"final": true
					},
					adaptBindingRefreshHandler: {
						"public": true,
						"final": false,
						overrideExecution: OverrideExecution.After
					},
					collectResults: { "public": false, "final": true },
					adaptControlStateHandler: {
						"public": true,
						"final": false,
						overrideExecution: OverrideExecution.After
					},
					getControlStateHandler: { "public": false, "final": true },
					adaptStateControls: {
						"public": true,
						"final": false,
						overrideExecution: OverrideExecution.After
					},
					retrieveAdditionalStates: {
						"public": true,
						"final": false,
						overrideExecution: OverrideExecution.After
					},
					retrieveViewState: { "public": true, "final": true },
					retrieveControlState: { "public": false, "final": true },
					applyInitialStateOnly: {
						"public": true,
						"final": false,
						overrideExecution: OverrideExecution.Instead
					},
					applyViewState: { "public": true, "final": true },
					applyControlState: { "public": false, "final": true },
					applyAdditionalStates: {
						"public": true,
						"final": false,
						overrideExecution: OverrideExecution.After
					},
					applyNavigationParameters: { "public": true, "final": false, overrideExecution: OverrideExecution.After },
					onBeforeStateApplied: { "public": true, "final": false, overrideExecution: OverrideExecution.After },
					onAfterStateApplied: { "public": true, "final": false, overrideExecution: OverrideExecution.After },
					onSuspend: { "public": true, "final": false, overrideExecution: OverrideExecution.After },
					onRestore: { "public": true, "final": false, overrideExecution: OverrideExecution.After }
				}
			},

			/**
			 * Constructor.
			 */
			constructor: function() {
				ControllerExtension.apply(this);
				var that = this;
				that._iRetrievingStateCounter = 0;
				this._pInitialStateApplied = new Promise(function(resolve) {
					that._pInitialStateAppliedResolve = resolve;
				});
			},

			/**
			 * @private
			 * @name sap.fe.core.controllerextensions.ViewState.getMetadata
			 * @function
			 */
			/**
			 * @private
			 * @name sap.fe.core.controllerextensions.ViewState.extend
			 * @function
			 */

			refreshViewBindings: function() {
				var that = this;
				return that.collectResults(that.base.viewState.adaptBindingRefreshControls).then(function(aControls) {
					var oPromiseChain = Promise.resolve();
					aControls
						.filter(function(oControl) {
							return oControl && oControl.isA && oControl.isA("sap.ui.base.ManagedObject");
						})
						.forEach(function(oControl) {
							oPromiseChain = oPromiseChain.then(that.refreshControlBinding.bind(that, oControl));
						});
					return oPromiseChain;
				});
			},
			/**
			 * This function should add all controls relevant for refreshing to the provided control array.
			 *
			 * This function is meant to be individually overridden by consuming controllers, but not to be called directly.
			 * The override execution is: {@link sap.ui.core.mvc.OverrideExecution.After}.
			 * @param {Array<sap.ui.base.ManagedObject>} aCollectedControls The collected controls
			 * @alias sap.fe.core.controllerextensions.ViewState#adaptBindingRefreshControls
			 * @protected
			 */
			adaptBindingRefreshControls: function(aCollectedControls) {},

			refreshControlBinding: function(oControl) {
				var oControlRefreshBindingHandler = this.getControlRefreshBindingHandler(oControl),
					oPromiseChain = Promise.resolve(),
					that = this;
				if (typeof oControlRefreshBindingHandler.refreshBinding !== "function") {
					Log.info("refreshBinding handler for control: " + oControl.getMetadata().getName() + " is not provided");
				} else {
					oPromiseChain = oPromiseChain.then(oControlRefreshBindingHandler.refreshBinding.bind(that, oControl));
				}
				return oPromiseChain;
			},

			/**
			 * Returns a map of <code>refreshBinding</code> function for a certain control.
			 *
			 * @param {sap.ui.base.ManagedObject} oControl The control to get state handler for
			 * @returns {object} A plain object with one function: <code>refreshBinding</code>
			 */

			getControlRefreshBindingHandler: function(oControl) {
				var oRefreshBindingHandler = {};
				if (oControl) {
					for (var sType in _mControlStateHandlerMap) {
						if (oControl.isA(sType)) {
							// pass only the refreshBinding handler in an object so that :
							// 1. Application has access only to refreshBinding and not apply and reterive at this stage
							// 2. Application modifications to the object will be reflected here (as we pass by reference)
							oRefreshBindingHandler["refreshBinding"] = _mControlStateHandlerMap[sType].refreshBinding || {};
							break;
						}
					}
				}
				this.base.viewState.adaptBindingRefreshHandler(oControl, oRefreshBindingHandler);
				return oRefreshBindingHandler;
			},
			/**
			 * Customize the <code>refreshBinding</code> function for a certain control.
			 *
			 * This function is meant to be individually overridden by consuming controllers, but not to be called directly.
			 * The override execution is: {@link sap.ui.core.mvc.OverrideExecution.After}.
			 *
			 * @param {sap.ui.base.ManagedObject} oControl The control for which the refresh handler is adapted.
			 * @param {Array<object>} oControlHandler A plain object which can have one function: <code>refreshBinding</code>
			 *
			 * @alias sap.fe.core.controllerextensions.ViewState#adaptBindingRefreshHandler
			 * @protected
			 */
			adaptBindingRefreshHandler: function(oControl, oControlHandler) {},

			/**
			 * Called when the application is suspended due to keep-alive mode.
			 *
			 * @alias sap.fe.core.controllerextensions.ViewState#onSuspend
			 * @public
			 */
			onSuspend: function() {},

			/**
			 * Called when the application is restored due to keep-alive mode.
			 *
			 * @alias sap.fe.core.controllerextensions.ViewState#onRestore
			 * @public
			 */
			onRestore: function() {},

			/**
			 * Destructor method for objects.
			 */
			destroy: function() {
				delete this._pInitialStateApplied;
				delete this._pInitialStateAppliedResolve;
				delete this._iRetrievingStateCounter;
				ControllerExtension.prototype.destroy.apply(this);
			},

			/**
			 * Helper function to enable multi override. It is adding an additional parameter (array) to the provided
			 * function (and its parameters), that will be evaluated via <code>Promise.all</code>.
			 *
			 * @param {Function} fnCall The function to be called
			 * @returns {Promise} A promise to be resolved with the result of all overrides
			 */
			collectResults: function(fnCall) {
				var aResults = [],
					aArguments = Array.prototype.slice.call(arguments, 1);
				aArguments.push(aResults);
				fnCall.apply(this, aArguments);
				return Promise.all(aResults);
			},

			/**
			 * Customize the <code>retrieve</code> and <code>apply</code> functions for a certain control.
			 *
			 * This function is meant to be individually overridden by consuming controllers, but not to be called directly.
			 * The override execution is: {@link sap.ui.core.mvc.OverrideExecution.After}.
			 *
			 * @param {sap.ui.base.ManagedObject} oControl The control to get state handler for
			 * @param {Array<object>} aControlHandler A list of plain objects with two functions: <code>retrieve</code> and <code>apply</code>
			 *
			 * @alias sap.fe.core.controllerextensions.ViewState#adaptControlStateHandler
			 * @protected
			 */
			adaptControlStateHandler: function(oControl, aControlHandler) {
				// to be overridden if needed
			},

			/**
			 * Returns a map of <code>retrieve</code> and <code>apply</code> functions for a certain control.
			 *
			 * @param {sap.ui.base.ManagedObject} oControl The control to get state handler for
			 * @returns {object} A plain object with two functions: <code>retrieve</code> and <code>apply</code>
			 */
			getControlStateHandler: function(oControl) {
				var aInternalControlStateHandler = [],
					aCustomControlStateHandler = [];
				if (oControl) {
					for (var sType in _mControlStateHandlerMap) {
						if (oControl.isA(sType)) {
							// avoid direct manipulation of internal _mControlStateHandlerMap
							aInternalControlStateHandler.push(Object.assign({}, _mControlStateHandlerMap[sType]));
							break;
						}
					}
				}
				this.base.viewState.adaptControlStateHandler(oControl, aCustomControlStateHandler);
				return aInternalControlStateHandler.concat(aCustomControlStateHandler);
			},

			/**
			 * This function should add all controls for given view that should be considered for the state handling to the provided control array.
			 *
			 * This function is meant to be individually overridden by consuming controllers, but not to be called directly.
			 * The override execution is: {@link sap.ui.core.mvc.OverrideExecution.After}.
			 * @param {Array<sap.ui.base.ManagedObject>} aCollectedControls The collected controls
			 * @alias sap.fe.core.controllerextensions.ViewState#adaptStateControls
			 * @protected
			 */
			adaptStateControls: function(aCollectedControls) {
				// to be overridden if needed
			},

			/**
			 * Returns the key to be used for given control.
			 *
			 * @param {sap.ui.base.ManagedObject} oControl The control to get state key for
			 * @returns {string} The key to be used for storing the controls state
			 */
			getStateKey: function(oControl) {
				return this.getView().getLocalId(oControl.getId()) || oControl.getId();
			},

			/**
			 * Retrieve the view state of this extensions view.
			 * When this function is called more than once before finishing, all but the final response will resolve to <code>undefined</code>.
			 *
			 * @returns {Promise} A promise resolving the view state
			 *
			 * @alias sap.fe.core.controllerextensions.ViewState#retrieveViewState
			 * @public
			 */
			retrieveViewState: function() {
				var that = this;
				++that._iRetrievingStateCounter;
				return that._pInitialStateApplied
					.then(function() {
						return that.collectResults(that.base.viewState.adaptStateControls);
					})
					.then(function(aControls) {
						return Promise.all(
							aControls
								.filter(function(oControl) {
									return oControl && oControl.isA && oControl.isA("sap.ui.base.ManagedObject");
								})
								.map(function(oControl) {
									return that.retrieveControlState(oControl).then(function(vResult) {
										return {
											key: that.getStateKey(oControl),
											value: vResult
										};
									});
								})
						);
					})
					.then(function(aResolvedStates) {
						return aResolvedStates.reduce(function(oStates, mState) {
							var oCurrentState = {};
							oCurrentState[mState.key] = mState.value;
							return mergeObjects(oStates, oCurrentState);
						}, {});
					})
					.then(function(oViewState) {
						return Promise.resolve(that._retrieveAdditionalStates()).then(function(mAdditionalStates) {
							if (mAdditionalStates && Object.keys(mAdditionalStates).length) {
								oViewState[ADDITIONAL_STATES_KEY] = mAdditionalStates;
							}
							return oViewState;
						});
					})
					.finally(function() {
						--that._iRetrievingStateCounter;
					})
					.then(function(oViewState) {
						return that._iRetrievingStateCounter === 0 ? oViewState : undefined;
					});
			},

			/**
			 * Extend the map of additional states (not control bound) to be added to the current view state of the given view.
			 *
			 * This function is meant to be individually overridden by consuming controllers, but not to be called directly.
			 * The override execution is: {@link sap.ui.core.mvc.OverrideExecution.After}.
			 *
			 * @param {object} mAdditionalStates The additional state
			 *
			 * @alias sap.fe.core.controllerextensions.ViewState#retrieveAdditionalStates
			 * @protected
			 */
			retrieveAdditionalStates: function(mAdditionalStates) {
				// to be overridden if needed
			},

			/**
			 * Returns a map of additional states (not control bound) to be added to the current view state of the given view.
			 *
			 * @returns {object | Promise<object>} Additional view states
			 */
			_retrieveAdditionalStates: function() {
				var mAdditionalStates = {};
				this.base.viewState.retrieveAdditionalStates(mAdditionalStates);
				return mAdditionalStates;
			},

			/**
			 * Returns the current state for the given control.
			 *
			 * @param {sap.ui.base.ManagedObject} oControl The object to get the state for
			 * @returns {Promise<object>} The state for the given control
			 */
			retrieveControlState: function(oControl) {
				var aControlStateHandlers = this.getControlStateHandler(oControl);
				return Promise.all(
					aControlStateHandlers.map(function(mControlStateHandler) {
						if (typeof mControlStateHandler.retrieve !== "function") {
							throw new Error(
								"controlStateHandler.retrieve is not a function for control: " + oControl.getMetadata().getName()
							);
						}
						return mControlStateHandler.retrieve.call(this, oControl);
					})
				).then(function(aStates) {
					return aStates.reduce(function(oFinalState, oCurrentState) {
						return mergeObjects(oFinalState, oCurrentState);
					}, {});
				});
			},

			/**
			 * Defines whether the view state should only be applied once initially.
			 *
			 * This function is meant to be individually overridden by consuming controllers, but not to be called directly.
			 * The override execution is: {@link sap.ui.core.mvc.OverrideExecution.Instead}.
			 *
			 * Important:
			 * You should only override this method for custom pages and not for the standard ListReportPage and ObjectPage!
			 *
			 * @returns {boolean} If <code>true</code>, only the initial view state is applied once,
			 * else any new view state is also applied on follow-up calls (default)
			 *
			 * @alias sap.fe.core.controllerextensions.ViewState#applyInitialStateOnly
			 * @protected
			 */
			applyInitialStateOnly: function() {
				return true;
			},
			/**
			 * Applies the given view state to this extensions view.
			 *
			 * @param {object} oViewState The view state to apply (can be undefined)
			 * @param {object} oNavParameter The current navigation parameter
			 * @param {sap.fe.navigation.NavType} oNavParameter.navigationType The actual navigation type
			 * @param {object} [oNavParameter.selectionVariant] The selectionVariant from the navigation
			 * @param {object} [oNavParameter.selectionVariantDefaults] The selectionVariant defaults from the navigation
			 * @param {boolean} [oNavParameter.requiresStandardVariant] Defines whether standard variant must be used in VM
			 *
			 * @returns {Promise} Promise for async state handling
			 *
			 * @alias sap.fe.core.controllerextensions.ViewState#applyViewState
			 * @public
			 */
			applyViewState: function(oViewState, oNavParameter) {
				var that = this;
				if (this.base.viewState.applyInitialStateOnly() && this._getInitialStateApplied()) {
					return Promise.resolve();
				}
				return this.collectResults(this.base.viewState.onBeforeStateApplied)
					.then(function() {
						return that.collectResults(that.base.viewState.adaptStateControls);
					})
					.then(function(aControls) {
						var oPromiseChain = Promise.resolve();
						aControls
							.filter(function(oControl) {
								return oControl && oControl.isA && oControl.isA("sap.ui.base.ManagedObject");
							})
							.forEach(function(oControl) {
								var sKey = that.getStateKey(oControl);
								oPromiseChain = oPromiseChain.then(
									that.applyControlState.bind(that, oControl, oViewState ? oViewState[sKey] : undefined, oNavParameter)
								);
							});
						return oPromiseChain;
					})
					.then(function() {
						if (oNavParameter.navigationType === NavType.iAppState) {
							return that.collectResults(
								that.base.viewState.applyAdditionalStates,
								oViewState ? oViewState[ADDITIONAL_STATES_KEY] : undefined
							);
						} else {
							return that.collectResults(that.base.viewState.applyNavigationParameters, oNavParameter);
						}
					})
					.finally(function() {
						return that.collectResults(that.base.viewState.onAfterStateApplied).then(that._setInitialStateApplied.bind(that));
					});
			},

			_setInitialStateApplied: function() {
				if (this._pInitialStateAppliedResolve) {
					var pInitialStateAppliedResolve = this._pInitialStateAppliedResolve;
					delete this._pInitialStateAppliedResolve;
					pInitialStateAppliedResolve();
				}
			},

			_getInitialStateApplied: function() {
				return !this._pInitialStateAppliedResolve;
			},

			/**
			 * Hook to react before a state for given view is applied.
			 *
			 * This function is meant to be individually overridden by consuming controllers, but not to be called directly.
			 * The override execution is: {@link sap.ui.core.mvc.OverrideExecution.After}.
			 *
			 * @param {Promise} aPromises Extensible array of promises to be resolved before continuing
			 *
			 * @alias sap.fe.core.controllerextensions.ViewState#onBeforeStateApplied
			 * @protected
			 */
			onBeforeStateApplied: function(aPromises) {},

			/**
			 * Hook to react when state for given view was applied.
			 *
			 * This function is meant to be individually overridden by consuming controllers, but not to be called directly.
			 * The override execution is: {@link sap.ui.core.mvc.OverrideExecution.After}.
			 *
			 * @param {Promise} aPromises Extensible array of promises to be resolved before continuing
			 *
			 * @alias sap.fe.core.controllerextensions.ViewState#onAfterStateApplied
			 * @protected
			 */
			onAfterStateApplied: function(aPromises) {},

			/**
			 * Applying additional, not control related, states - is called only if navigation type is iAppState.
			 *
			 * This function is meant to be individually overridden by consuming controllers, but not to be called directly.
			 * The override execution is: {@link sap.ui.core.mvc.OverrideExecution.After}.
			 *
			 * @param {object} oViewState The current view state
			 * @param {Promise} aPromises Extensible array of promises to be resolved before continuing
			 *
			 * @alias sap.fe.core.controllerextensions.ViewState#applyAdditionalStates
			 * @protected
			 */
			applyAdditionalStates: function(oViewState, aPromises) {
				// to be overridden if needed
			},

			/**
			 * Apply navigation parameters - is called only if navigation type is not iAppState.
			 *
			 * This function is meant to be individually overridden by consuming controllers, but not to be called directly.
			 * The override execution is: {@link sap.ui.core.mvc.OverrideExecution.After}.
			 *
			 * @param {object} oNavParameter The current navigation parameter
			 * @param {sap.fe.navigation.NavType} oNavParameter.navigationType The actual navigation type
			 * @param {object} [oNavParameter.selectionVariant] The selectionVariant from the navigation
			 * @param {object} [oNavParameter.selectionVariantDefaults] The selectionVariant defaults from the navigation
			 * @param {boolean} [oNavParameter.requiresStandardVariant] Defines whether standard variant must be used in VM
			 * @param {Promise} aPromises Extensible array of promises to be resolved before continuing
			 *
			 * @alias sap.fe.core.controllerextensions.ViewState#applyNavigationParameters
			 * @protected
			 */
			applyNavigationParameters: function(oNavParameter, aPromises) {
				// to be overridden if needed
			},

			/**
			 * Applying the given state to the given control.
			 *
			 * @param {sap.ui.base.ManagedObject} oControl The object to apply the given state
			 * @param {object} oControlState The state for the given control
			 * @param {object} oNavParameters The current navigation parameters
			 * @returns {any} Return a promise for async state handling
			 */
			applyControlState: function(oControl, oControlState, oNavParameters) {
				var aControlStateHandlers = this.getControlStateHandler(oControl),
					oPromiseChain = Promise.resolve(),
					that = this;
				aControlStateHandlers.forEach(function(mControlStateHandler) {
					if (typeof mControlStateHandler.apply !== "function") {
						throw new Error("controlStateHandler.apply is not a function for control: " + oControl.getMetadata().getName());
					}
					oPromiseChain = oPromiseChain.then(mControlStateHandler.apply.bind(that, oControl, oControlState, oNavParameters));
				});
				return oPromiseChain;
			}
		});

		return ViewState;
	}
);
