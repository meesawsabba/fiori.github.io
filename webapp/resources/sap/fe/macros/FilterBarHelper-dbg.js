/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)
        (c) Copyright 2009-2021 SAP SE. All rights reserved
    
 */

/**
 * Filter Bar helper
 */
sap.ui.define(
	["sap/fe/macros/CommonHelper", "sap/fe/core/CommonUtils", "sap/fe/core/helpers/ModelHelper"],
	function(CommonHelper, CommonUtils, ModelHelper) {
		"use strict";

		var FilterBarHelper = {
			/*
			 * Method to check if the Basic Serch Field in FilterBar is visible.
			 * @function
			 * @name checkIfBasicSearchIsVisible
			 * @memberof sap.fe.macros.FilterBarHelper.js
			 * @param {object} - oContext: Interface to the arguemnts of the function
			 * @param {boolean} - hideBasicSearch: visibility of Basic Search Field
			 * @param {object} - oEntityType: entityType
			 * @return : {boolean} True, if property hideBasisSearch is not equal "true" and
			 * 					   either there are no SearchRestrictions or property SearchRestrictions.Searchable is equal true.
			 */
			checkIfBasicSearchIsVisible: function(oContext, hideBasicSearch, oEntityType) {
				var oInterface = oEntityType && oContext.getInterface(1);
				var sEntityTypePath = oInterface.getPath();
				var sEntitySetPath = ModelHelper.getEntitySetPath(sEntityTypePath);
				var searchRestrictionAnnotation = CommonUtils.getSearchRestrictions(sEntitySetPath, oInterface.getModel());

				if (hideBasicSearch === undefined) {
					return Boolean(searchRestrictionAnnotation && searchRestrictionAnnotation.Searchable);
				}
				if (hideBasicSearch !== "true") {
					return Boolean(!searchRestrictionAnnotation || searchRestrictionAnnotation.Searchable);
				}
				return false;
			}
		};

		FilterBarHelper.checkIfBasicSearchIsVisible.requiresIContext = true;

		return FilterBarHelper;
	},
	/* bExport= */ true
);
