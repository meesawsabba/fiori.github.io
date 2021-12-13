/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)
        (c) Copyright 2009-2021 SAP SE. All rights reserved
    
 */
sap.ui.define(["sap/ui/core/mvc/ControllerExtension", "sap/ui/core/mvc/OverrideExecution", "sap/ui/model/json/JSONModel"], function(
	ControllerExtension,
	OverrideExecution,
	JSONModel
) {
	"use strict";
	/**
	 * @class Controller extension providing hooks for the navigation using paginators
	 *
	 * @name sap.fe.core.controllerextensions.Paginator
	 * @hideconstructor
	 * @public
	 * @since 1.94.0
	 */
	return ControllerExtension.extend("sap.fe.core.controllerextensions.Paginator", {
		metadata: {
			methods: {
				initialize: {
					"final": true,
					"public": true
				},
				updateCurrentContext: {
					"final": true,
					"public": true
				},
				onContextUpdate: {
					"final": false,
					"public": true,
					overrideExecution: OverrideExecution.After
				}
			}
		},
		/**
		 * Initiates the paginator control.
		 * @function
		 * @param {string} oBinding ODataListBinding object
		 * @param {object} oContext Current context where the navigation is initiated
		 * @alias sap.fe.core.controllerextensions.Paginator#initialize
		 * @public
		 * @since 1.94.0
		 **/
		initialize: function(oBinding, oContext) {
			if (oBinding && oBinding.getCurrentContexts) {
				this._oListBinding = oBinding;
			}
			if (oContext) {
				this._oCurrentContext = oContext;
			}
			this._updateCurrentIndexAndButtonEnablement();
		},

		_updateCurrentIndexAndButtonEnablement: function() {
			var that = this;
			if (this._oCurrentContext && this._oListBinding) {
				var sPath = this._oCurrentContext.getPath();
				// Storing the currentIndex in global variable
				this._iCurrentIndex = this._oListBinding.getCurrentContexts().findIndex(function(oContext) {
					return oContext && oContext.getPath() === sPath;
				});
				var oCurrentIndexContext = this._oListBinding.getCurrentContexts()[this._iCurrentIndex];
				if (
					(!this._iCurrentIndex && this._iCurrentIndex !== 0) ||
					!oCurrentIndexContext ||
					this._oCurrentContext.getPath() !== oCurrentIndexContext.getPath()
				) {
					that._updateCurrentIndex();
				}
				that._handleButtonEnablement();
			}
		},

		_handleButtonEnablement: function() {
			//Enabling and Disabling the Buttons on change of the control context
			var that = this;
			var mButtonEnablementModel = that.base.getView().getModel("paginator");
			if (this._oListBinding && this._oListBinding.getCurrentContexts().length > 1 && this._iCurrentIndex > -1) {
				if (this._iCurrentIndex === this._oListBinding.getCurrentContexts().length - 1) {
					mButtonEnablementModel.setProperty("/navDownEnabled", false);
				} else {
					mButtonEnablementModel.setProperty("/navDownEnabled", true);
				}
				if (this._iCurrentIndex === 0) {
					mButtonEnablementModel.setProperty("/navUpEnabled", false);
				} else {
					mButtonEnablementModel.setProperty("/navUpEnabled", true);
				}
			} else {
				// Don't show the paginator buttons
				// 1. When no listbinding is available
				// 2. Only '1' or '0' context exists in the listBinding
				// 3. The current index is -ve, i.e the currentIndex is invalid.
				mButtonEnablementModel.setProperty("/navUpEnabled", false);
				mButtonEnablementModel.setProperty("/navDownEnabled", false);
			}
		},

		_updateCurrentIndex: function() {
			if (this._oCurrentContext && this._oListBinding) {
				var sPath = this._oCurrentContext.getPath();
				// Storing the currentIndex in global variable
				this._iCurrentIndex = this._oListBinding.getCurrentContexts().findIndex(function(oContext) {
					return oContext && oContext.getPath() === sPath;
				});
			}
		},

		updateCurrentContext: function(index) {
			var that = this;
			if (!this._oListBinding) {
				return;
			}
			var aCurrentContexts = this._oListBinding.getCurrentContexts();
			var iNewIndex = this._iCurrentIndex + index;
			if (aCurrentContexts[iNewIndex]) {
				this._iCurrentIndex = iNewIndex;
				that.onContextUpdate(aCurrentContexts[iNewIndex]);
			}
			that._handleButtonEnablement();
		},

		/**
		 * Returns the updated context after the paginator operation.
		 * @function
		 * @param {string} oContext Final context returned after the paginator action
		 * @alias sap.fe.core.controllerextensions.Paginator#onContextUpdate
		 * @public
		 * @since 1.94.0
		 **/
		onContextUpdate: function(oContext) {
			//To be overridden by the application
		},

		override: {
			onInit: function() {
				this._oView = this.base.getView();
				this._oView.setModel(
					new JSONModel({
						navUpEnabled: false,
						navDownEnabled: false
					}),
					"paginator"
				);
			}
		}
	});
});
