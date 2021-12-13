/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)
        (c) Copyright 2009-2021 SAP SE. All rights reserved
    
 */
sap.ui.define([], function() {
	"use strict";

	/* This class contains helpers to be used at runtime to retrieve further information on the model */

	var ModelHelper = {
		/**
		 * Method to determine if the programming model is sticky.
		 *
		 * @function
		 * @name isStickySessionSupported
		 * @param {sap.ui.model.odata.v4.MetaModel} oMetaModel ODataModelMetaModel to check for sticky enabled entity
		 * @returns {boolean} Returns true if sticky, else false
		 */
		isStickySessionSupported: function(oMetaModel) {
			var oEntityContainer = oMetaModel.getObject("/");
			for (var sEntitySet in oEntityContainer) {
				if (
					oEntityContainer[sEntitySet].$kind === "EntitySet" &&
					oMetaModel.getObject("/" + sEntitySet + "@com.sap.vocabularies.Session.v1.StickySessionSupported")
				) {
					return true;
				}
			}
			return false;
		},

		/**
		 * Method to determine if the programming model is draft.
		 *
		 * @function
		 * @name isDraftSupported
		 * @param {sap.ui.model.odata.v4.MetaModel} oMetaModel ODataModelMetaModel of the context for which draft support shall be checked
		 * @param {string} sPath Path for which draft support shall be checked
		 * @returns {boolean} Returns true if draft, else false
		 */
		isDraftSupported: function(oMetaModel, sPath) {
			var oMetaContext = oMetaModel.getMetaContext(sPath),
				sTargetEntitySet = this.getTargetEntitySet(oMetaContext),
				oParentEntitySetContext,
				aParts;

			if (oMetaContext.getProperty && oMetaContext.getProperty() && oMetaContext.getProperty().$ContainsTarget === true) {
				aParts = oMetaModel
					.getMetaPath(sPath)
					.split("/")
					.filter(Boolean);
				if (aParts.length) {
					for (var i = aParts.length - 1; i >= 0; i--) {
						oParentEntitySetContext = oMetaModel.getMetaContext(oMetaModel.getMetaPath("/" + aParts[i]));
						if (oParentEntitySetContext.getObject("$kind") === "EntitySet") {
							sTargetEntitySet = this.getTargetEntitySet(oParentEntitySetContext);
							break;
						}
					}
				}
			} else {
				sTargetEntitySet = this.getTargetEntitySet(oMetaContext);
			}
			var oEntityContext = oMetaModel.getMetaContext(sTargetEntitySet);
			if (
				oEntityContext.getObject("@com.sap.vocabularies.Common.v1.DraftRoot") ||
				oEntityContext.getObject("@com.sap.vocabularies.Common.v1.DraftNode")
			) {
				return true;
			}
			return false;
		},

		/**
		 * Returns path to the target entity set via using navigation property binding.
		 *
		 * @function
		 * @name getTargetEntitySet
		 * @param {sap.ui.model.odata.v4.Context} oContext Context for which the target entity set shall be determined
		 * @returns {string} Returns path to the target entity set
		 */
		getTargetEntitySet: function(oContext) {
			var sPath = oContext.getPath();
			if (
				oContext.getObject("$kind") === "EntitySet" ||
				oContext.getObject("$kind") === "Action" ||
				oContext.getObject("0/$kind") === "Action"
			) {
				return sPath;
			}
			var sEntitySetPath = ModelHelper.getEntitySetPath(sPath);
			return "/" + oContext.getObject(sEntitySetPath);
		},

		/**
		 * Returns complete path to the entity set via using navigation property binding.
		 *
		 * @function
		 * @name getEntitySetPath
		 * @param {string} sPath Path for which complete entitySet path needs to be determined
		 * @returns {string} Returns complete path to the entity set
		 */
		getEntitySetPath: function(sPath) {
			return (
				"/" +
				sPath
					.split("/")
					.filter(ModelHelper.filterOutNavPropBinding)
					.join("/$NavigationPropertyBinding/")
			);
		},

		/**
		 * Gets the path for the items property of MultiValueField parameters.
		 *
		 * @function
		 * @name getActionParameterItemsModelPath
		 * @param {object} oParameter Action Parameter
		 * @returns {string} Returns the complete model path for the items property of MultiValueField parameters
		 */
		getActionParameterItemsModelPath: function(oParameter) {
			return oParameter && oParameter.$Name ? "{path: 'mvfview>/" + oParameter.$Name + "'}" : undefined;
		},

		filterOutNavPropBinding: function(sPathPart) {
			return sPathPart !== "" && sPathPart !== "$NavigationPropertyBinding";
		},

		/**
		 * Adds a setProperty to the created binding contexts of the internal JSON model.
		 *
		 * @function
		 * @name enhanceInternalJSONModel
		 * @param {sap.ui.model.json.JSONModel} Internal JSON Model which is enhanced
		 */

		enhanceInternalJSONModel: function(oInternalModel) {
			var fnBindContext = oInternalModel.bindContext;
			oInternalModel.bindContext = function(sPath, oContext, mParameters) {
				var oContext = fnBindContext.apply(this, arguments);
				var fnGetBoundContext = oContext.getBoundContext;

				oContext.getBoundContext = function() {
					var oBoundContext = fnGetBoundContext.apply(this, arguments);
					if (oBoundContext && !oBoundContext.setProperty) {
						oBoundContext.setProperty = function(sPath, value) {
							if (this.getObject() === undefined) {
								// initialize
								this.getModel().setProperty(this.getPath(), {});
							}
							this.getModel().setProperty(sPath, value, this);
						};
					}
					return oBoundContext;
				};
				return oContext;
			};
		},

		/**
		 * Returns whether filtering on the table is case sensitive.
		 *
		 * @param oMetaModel The instance of the meta model
		 * @returns {boolean|undefined} Returns 'false' if FilterFunctions annotation supports 'tolower', else 'true'
		 */
		isFilteringCaseSensitive: function(oMetaModel) {
			if (!oMetaModel) {
				return undefined;
			}
			var aFilterFunctions = oMetaModel.getObject("/@Org.OData.Capabilities.V1.FilterFunctions");
			// Get filter functions defined at EntityContainer and check for existence of 'tolower'
			return aFilterFunctions ? aFilterFunctions.indexOf("tolower") === -1 : true;
		}
	};
	return ModelHelper;
});
