/*!
 * SAPUI5

		(c) Copyright 2009-2021 SAP SE. All rights reserved
	
 */
sap.ui.define(["../i18n", "sap/m/Select", "sap/m/SelectType", "sap/ui/core/Item", "sap/ui/model/BindingMode"], function (i18n, Select, SelectType, Item, BindingMode) {
    "use strict";
    return Select.extend("sap.esh.search.ui.controls.SearchSelect", {
        constructor: function (sId, options) {
            options = jQuery.extend({}, {
                visible: "{/businessObjSearchEnabled}",
                autoAdjustWidth: true,
                items: {
                    path: "/dataSources",
                    template: new Item({
                        key: "{id}",
                        text: "{labelPlural}",
                    }),
                },
                selectedKey: {
                    path: "/uiFilter/dataSource/id",
                    mode: BindingMode.OneWay,
                },
                tooltip: i18n.getText("searchIn") + " {/uiFilter/dataSource/labelPlural}",
                change: function () {
                    var item = this.getSelectedItem();
                    var context = item.getBindingContext();
                    var dataSource = context.getObject();
                    this.getModel().setDataSource(dataSource, false);
                    this.getModel().abortSuggestions();
                    this.getModel().eventLogger.logEvent({
                        type: this.getModel().eventLogger.DROPDOWN_SELECT_DS,
                        dataSourceId: dataSource.id,
                    });
                },
                enabled: {
                    parts: [
                        {
                            path: "/initializingObjSearch",
                        },
                    ],
                    formatter: function (initializingObjSearch) {
                        return !initializingObjSearch;
                    },
                },
            }, options);
            Select.prototype.constructor.apply(this, [sId, options]);
            this.addStyleClass("searchSelect");
        },
        renderer: "sap.m.SelectRenderer",
        setDisplayMode: function (mode) {
            switch (mode) {
                case "icon":
                    this.setType(SelectType.IconOnly);
                    this.setIcon("sap-icon://slim-arrow-down");
                    break;
                case "default":
                    this.setType(SelectType.Default);
                    break;
                default:
                    break;
            }
        },
    });
});
