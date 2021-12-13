/*!
 * SAPUI5

		(c) Copyright 2009-2021 SAP SE. All rights reserved
	
 */
sap.ui.define(["./SearchHierarchyFacet"], function (SearchHierarchyFacet) {
    "use strict";
    var module = function () {
        this.init.apply(this, arguments);
        this.testCounter = 0;
        this.facetMap = {};
    };
    module.prototype = {
        init: function (model) {
            this.model = model;
        },
        getFacetAttributes: function (resultSet) {
            // display facets which are included in the server response
            var facetAttributes = [];
            for (var i = 0; i < resultSet.facets.length; ++i) {
                var facetResultSet = resultSet.facets[i];
                if (facetResultSet.type !== resultSet.sina.FacetType.Hierarchy) {
                    continue;
                }
                if (!facetResultSet.node) {
                    continue; // TODO: server error?
                }
                var facetAttribute = facetResultSet.query.attributeId;
                if (facetAttributes.indexOf(facetAttribute) >= 0) {
                    continue;
                }
                facetAttributes.push(facetAttribute);
            }
            // display facet for which filters are set
            var filterFacetAttributes = resultSet.query.filter.rootCondition.collectAttributes();
            for (var j = 0; j < filterFacetAttributes.length; ++j) {
                var filterFacetAttribute = filterFacetAttributes[j];
                var filterFacetAttributeMetadata = resultSet.query.filter.dataSource.getAttributeMetadata(filterFacetAttribute);
                if (!filterFacetAttributeMetadata.isHierarchy) {
                    continue;
                }
                if (facetAttributes.indexOf(filterFacetAttribute) >= 0) {
                    continue;
                }
                facetAttributes.push(filterFacetAttribute);
            }
            return facetAttributes;
        },
        getFacetFromResultSet: function (resultSet, attributeId) {
            for (var i = 0; i < resultSet.facets.length; ++i) {
                var facetResultSet = resultSet.facets[i];
                if (attributeId === facetResultSet.query.attributeId) {
                    return facetResultSet;
                }
            }
        },
        getFacet: function (resultSet, searchModel, attributeId) {
            var attributeMetadata = resultSet.query.filter.dataSource.getAttributeMetadata(attributeId);
            var facet = this.facetMap[attributeId];
            if (!facet) {
                facet = new SearchHierarchyFacet({
                    model: searchModel,
                    sina: resultSet.sina,
                    attributeId: attributeId,
                    title: attributeMetadata.label,
                    dataSource: resultSet.query.filter.dataSource,
                    filter: resultSet.query.filter,
                });
                this.facetMap[attributeId] = facet;
            }
            facet.filter = resultSet.query.filter;
            var containsAttribute = resultSet.query.filter.rootCondition.containsAttribute(attributeId);
            var hasExpandedChildNode = facet.node && facet.node.hasExpandedChildNode();
            var facetPromise;
            if (containsAttribute || hasExpandedChildNode) {
                facetPromise = facet.updateFromServer();
            }
            else {
                var facetResultSet = this.getFacetFromResultSet(resultSet, attributeId);
                facetPromise = facet.updateFromResultSet(facetResultSet);
            }
            facetPromise = facetPromise.then(function (facet) {
                facet.mixinFilterNodes();
                return facet;
            });
            return facetPromise;
        },
        getFacets: function (resultSet, searchModel) {
            // determine which facets to be displayed
            var facetAttributes = this.getFacetAttributes(resultSet);
            // create/update facets
            var facets = [];
            for (var i = 0; i < facetAttributes.length; ++i) {
                var facetAttribute = facetAttributes[i];
                var facetPromise = this.getFacet(resultSet, searchModel, facetAttribute);
                facets.push(facetPromise);
            }
            return Promise.all(facets).then(function (result) {
                return Array.from(result);
            });
        },
        handleDataSourceChanged: function () {
            this.facetMap = {};
        },
    };
    return module;
});
