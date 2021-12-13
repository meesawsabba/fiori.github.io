/*!
 * SAPUI5

		(c) Copyright 2009-2021 SAP SE. All rights reserved
	
 */
sap.ui.define(["sap/esh/search/ui/SearchNavigationObject"], function (SearchNavigationObject) {
    "use strict";
    return SearchNavigationObject.extend("sap.esh.search.ui.SearchNavigationObjectForSinaNavTarget", {
        // eslint-disable-next-line no-unused-vars
        constructor: function (sinaNavigationTarget, model) {
            SearchNavigationObject.prototype.constructor.apply(this, arguments);
            this._sinaNavigationTarget = sinaNavigationTarget;
            this.setHref(sinaNavigationTarget.targetUrl);
            this.setText(sinaNavigationTarget.label);
            this.setTarget(sinaNavigationTarget.target);
            this.sina = this._sinaNavigationTarget.sina;
        },
        performNavigation: function (properties) {
            // TODO: shall be resumed when the situation in hana_odata side is clared
            // this.trackNavigation();
            this._model.config.beforeNavigation(this._model);
            this._sinaNavigationTarget.performNavigation(properties);
        },
        getResultSet: function () {
            return this.getResultSetItem().parent;
        },
        getResultSetItem: function () {
            var parent = this._sinaNavigationTarget.parent;
            if (this.sina.SearchResultSetItemAttribute &&
                parent instanceof this.sina.SearchResultSetItemAttribute) {
                // navigation target on attribute level -> parent is SearchResultSetItem
                parent = parent.parent;
            }
            if (this.sina.SearchResultSetItem && !(parent instanceof this.sina.SearchResultSetItem)) {
                throw "programm error";
            }
            if (this.sina.ObjectSuggestion && parent.parent instanceof this.sina.ObjectSuggestion) {
                // for object suggestions: item = object suggestion
                parent = parent.parent;
            }
            return parent;
        },
        getResultSetId: function () {
            return this.getResultSet().id;
        },
        getPositionInList: function () {
            var resultSet = this.getResultSet();
            var resultSetItem = this.getResultSetItem();
            return resultSet.items.indexOf(resultSetItem);
        },
    });
});
