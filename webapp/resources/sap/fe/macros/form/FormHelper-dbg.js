/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)
        (c) Copyright 2009-2021 SAP SE. All rights reserved
    
 */
sap.ui.define(
	[],
	function() {
		"use strict";

		/**
		 * Helper class used by MDC controls for OData(V4) specific handling
		 *
		 * @private
		 * @experimental This module is only for internal/experimental use!
		 */
		var FormHelper = {
			/*
			 * Method to check if a collectionFacet needs to be rendered as a Form.
			 * @function
			 * @name checkIfCollectionFacetNeedsToBeRendered
			 * @memberof sap.fe.macros.form.FormHelper.js
			 * @param {Object} - oCollectionFacet : CollectionFacet object to be rendered containing ReferenceFacets
			 * @param {String} - sPartOfPreview : PartOfPreview that needs to checked against the ReferenceFacets
			 * @return : {boolean} True, if at least one match is found with partofpreview against ReferenceFacets. Else, returns false
			 */
			checkIfCollectionFacetNeedsToBeRendered: function(oCollectionFacet, sPartOfPreview) {
				if (oCollectionFacet.$Type === "com.sap.vocabularies.UI.v1.CollectionFacet" && oCollectionFacet.Facets.length) {
					var fnCheckPartOfPreview = function(controlProperty, oReferenceFacet) {
						var annotatedTerm = oReferenceFacet["@com.sap.vocabularies.UI.v1.PartOfPreview"];
						return (
							(controlProperty !== "false" && annotatedTerm !== false) ||
							(controlProperty === "false" && annotatedTerm === false)
						);
					};
					var aReferenceFacet = oCollectionFacet.Facets;
					return aReferenceFacet.some(fnCheckPartOfPreview.bind(null, sPartOfPreview));
				}
				return false;
			},

			/*
			 * Method that checks, if a reference facet needs to be assigned to either "blocks" or "moreBlocks" (tagged by subsection property "partOfPreview!)
			 * @function isReferenceFacetPartOfPreview
			 * @memberof sap.fe.macros.form.FormHelper.js
			 * @param {Object} - oReferenceFacet : Reference facet that needs to be assigned
			 * @param {String} - sPartOfPreview : Subsection property "partOfPreview" that needs to aligned with the reference facet's annotation "PartOfPreview!
			 * @return : {boolean} True, if the ReferenceFacet has the same annotation as the subsection's property "partOfPreview"
			 */
			isReferenceFacetPartOfPreview: function(oReferenceFacet, sPartOfPreview) {
				if (oReferenceFacet.$Type === "com.sap.vocabularies.UI.v1.ReferenceFacet") {
					var annotatedTerm = oReferenceFacet["@com.sap.vocabularies.UI.v1.PartOfPreview"];
					return (
						(sPartOfPreview === "true" && annotatedTerm !== false) || (sPartOfPreview === "false" && annotatedTerm === false)
					);
				}
				return false;
			},

			/**
			 * Creates and returns a select query with the selected fields from the parameters passed.
			 *
			 * @param {Array} aSemanticKeys SemanticKeys included in the entity set
			 * @returns {string} The fields to be included in the select query
			 */
			create$Select: function(aSemanticKeys) {
				var sSelectedFields = "";
				aSemanticKeys.forEach(function(oSemanticKey) {
					sSelectedFields += sSelectedFields ? "," + oSemanticKey.$PropertyPath : oSemanticKey.$PropertyPath;
				});
				return sSelectedFields;
			},

			/**
			 * Generates the binding expression for the form.
			 *
			 * @param {string} sNavigationPath The navigation path defined for the entity
			 * @param {Array} aSemanticKeys SemanticKeys included in the entity set
			 * @returns {string} The Binding expression including path and $select query as parameter depending on the function parameters
			 */
			generateBindingExpression: function(sNavigationPath, aSemanticKeys) {
				if (!sNavigationPath && !aSemanticKeys) {
					return "";
				}
				var oBinding = {
					path: sNavigationPath || ""
				};
				if (aSemanticKeys) {
					oBinding.parameters = { $select: FormHelper.create$Select(aSemanticKeys) };
				}
				return JSON.stringify(oBinding);
			},

			getNavigationPath: function(oEntitySet) {
				var sPath = oEntitySet.getPath ? oEntitySet.getPath() : oEntitySet;

				return sPath;
			},

			/**
			 * Generates CSS margin classes for a form.
			 * @param {string} sMarginClass The margin class to be added to default form class
			 * @param {boolean} bisFirstFacetAContact Checks if a contact quickViewFacet is used
			 * @returns {string} The expression for the CSS margin class of a form
			 */
			getMarginClass: function(sMarginClass, bisFirstFacetAContact) {
				var sFormMarginClasses =
					sMarginClass !== "" && bisFirstFacetAContact
						? "sapUxAPObjectPageSubSectionAlignContent " + sMarginClass
						: "sapUxAPObjectPageSubSectionAlignContent";
				return sFormMarginClasses;
			}
		};

		return FormHelper;
	},
	/* bExport= */ true
);
