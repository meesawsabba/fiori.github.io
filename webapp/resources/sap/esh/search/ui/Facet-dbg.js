/*!
 * SAPUI5

		(c) Copyright 2009-2021 SAP SE. All rights reserved
	
 */
// @ts-check
sap.ui.define([], 
/**
 * @this sap.esh.search.ui.controls.Facet
 */
function () {
    "use strict";
    var Facet = function () {
        this.init.apply(this, arguments);
    };
    Facet.prototype = {
        /**
         * @this sap.esh.search.ui.controls.Facet
         */
        init: function (properties) {
            this.title = properties.title;
            this.facetType = properties.facetType; //datasource or attribute
            this.dimension = properties.dimension;
            this.dataType = properties.dataType;
            this.matchingStrategy = properties.matchingStrategy;
            this.items = properties.items || [];
            this.totalCount = properties.totalCount;
            this.visible = properties.visible || true;
        },
        /**
         * Checks if the facet has the given filter condition
         * @param   {object}  filterCondition the condition to check for in this facet
         * @returns {Boolean} true if the filtercondition was found in this facet
         */
        /**
         * @this sap.esh.search.ui.controls.Facet
         */
        hasFilterCondition: function (filterCondition) {
            for (var i = 0, len = this.items.length; i < len; i++) {
                var fc = this.items[i].filterCondition || this.items[i];
                if (fc.equals && fc.equals(filterCondition)) {
                    return true;
                }
            }
            return false;
        },
        /**
         * Checks if this facet has at least one filter condition
         * @returns {Boolean} true if it has at least one filter condition, false otherwise
         */
        /**
         * @this sap.esh.search.ui.controls.Facet
         */
        hasFilterConditions: function () {
            for (var i = 0, len = this.items.length; i < len; i++) {
                if (this.items[i].filterCondition) {
                    return true;
                }
            }
            return false;
        },
        /**
         * @this sap.esh.search.ui.controls.Facet
         */
        removeItem: function (facetItem) {
            for (var i = 0, len = this.items.length; i < len; i++) {
                var fc = this.items[i].filterCondition || this.items[i];
                if (fc.equals && facetItem.filterCondition && fc.equals(facetItem.filterCondition)) {
                    return this.items.splice(i, 1);
                }
            }
        },
    };
    return Facet;
});
