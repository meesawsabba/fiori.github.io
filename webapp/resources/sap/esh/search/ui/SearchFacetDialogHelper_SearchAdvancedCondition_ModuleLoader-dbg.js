/*!
 * SAPUI5

		(c) Copyright 2009-2021 SAP SE. All rights reserved
	
 */
(function () {
    "use strict";
    sap.ui.define(["sap/esh/search/ui/SearchFacetDialogHelper", "sap/esh/search/ui/controls/SearchAdvancedCondition"], function (SearchFacetDialogHelper, SearchAdvancedCondition) {
        SearchFacetDialogHelper.setSearchAdvancedCondition(SearchAdvancedCondition);
        SearchAdvancedCondition.setSearchFacetDialogHelper(SearchFacetDialogHelper);
    });
})(window);
