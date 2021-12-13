/*!
 * SAPUI5

		(c) Copyright 2009-2021 SAP SE. All rights reserved
	
 */
sap.ui.define([], function () {
    var FacetItem = function () {
        this.init.apply(this, arguments);
    };
    FacetItem.prototype = {
        init: function (properties) {
            properties = properties || {};
            this.selected = properties.selected || false;
            this.level = properties.level || 0;
            this.filterCondition = properties.filterCondition;
            this.value = properties.value || ""; //value here means count
            this.label = typeof properties.label === "undefined" ? "" : properties.label + "";
            this.facetTitle = properties.facetTitle || "";
            this.facetAttribute = properties.facetAttribute || "";
            this.valueLabel = this.value;
            this.advanced = properties.advanced || false;
            this.listed = properties.listed || false;
            this.icon = properties.icon;
            this.visible = properties.visible || true;
        },
        equals: function (otherFacetItem) {
            return (this.facetTitle === otherFacetItem.facetTitle &&
                this.label === otherFacetItem.label &&
                this.value === otherFacetItem.value &&
                this.filterCondition.equals(otherFacetItem.filterCondition));
        },
        clone: function () {
            var newFacetItem = new FacetItem();
            newFacetItem.facetTitle = this.facetTitle;
            newFacetItem.selected = this.selected;
            newFacetItem.label = this.label;
            newFacetItem.icon = this.icon;
            newFacetItem.level = this.level;
            newFacetItem.value = this.value;
            newFacetItem.valueLabel = this.valueLabel;
            newFacetItem.filterCondition = this.filterCondition.clone();
            return newFacetItem;
        },
    };
    return FacetItem;
});
