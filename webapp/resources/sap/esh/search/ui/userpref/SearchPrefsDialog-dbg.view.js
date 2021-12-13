/*!
 * SAPUI5

		(c) Copyright 2009-2021 SAP SE. All rights reserved
	
 */
sap.ui.define([
    "sap/ui/core/mvc/View",
    "../i18n",
    "sap/m/Button",
    "sap/m/CheckBox",
    "sap/m/FlexBox",
    "sap/m/FlexItemData",
    "sap/m/Label",
    "sap/m/List",
    "sap/m/ListMode",
    "sap/m/MessageBox",
    "sap/m/StandardListItem",
    "sap/m/Title",
    "sap/m/VBox",
    "sap/ui/model/BindingMode",
], function (View, i18n, Button, CheckBox, FlexBox, FlexItemData, Label, List, ListMode, MessageBox, StandardListItem, Title, VBox, BindingMode) {
    "use strict";
    // search preferences dialog view
    // =======================================================================
    return View.extend("sap.esh.search.ui.userpref.SearchPrefsDialog", {
        createContent: function () {
            var that = this;
            var content;
            this.firstTimeBeforeRendering = true;
            // *********** upper area (always visilble) ******************
            // Title for Personalized Search
            var oTitlePersSearch = new Title({
                text: i18n.getText("sp.personalizedSearch"),
            });
            // CheckBox for Track Search Activities
            var oPersSearchCheckBox = new CheckBox({
                id: "personalizedSearchCheckbox",
                selected: {
                    path: "/personalizedSearch",
                    mode: BindingMode.TwoWay,
                },
                text: i18n.getText("sp.trackPersonalizedSearch"),
                enabled: "{/isPersonalizedSearchEditable}",
                layoutData: new FlexItemData({ growFactor: 1 }),
            });
            // Reset button
            var oResetButton = new Button({
                text: i18n.getText("sp.deleteSearchTracks"),
                press: this.resetHistory.bind(this),
                enabled: {
                    parts: ["/isPersonalizedSearchEditable", "/resetButtonWasClicked"],
                    formatter: function (isPersonalizedSearchEditable, resetButtonWasClicked) {
                        return isPersonalizedSearchEditable && !resetButtonWasClicked;
                    },
                },
            });
            var oPersSearchFlexBox = new FlexBox({
                items: [oPersSearchCheckBox, oResetButton],
            });
            var oPersSearchVBox = new VBox({
                items: [oTitlePersSearch, oPersSearchFlexBox],
            });
            // *********** lower area (Not always visilble depending on feature flag userDefinedDatasources) ******************
            //       if (this.getModel().searchModel.config.userDefinedDatasources) {
            // Title for Default Search Scope
            var oTitleDefaultSearch = new Title({
                text: i18n.getText("sp.defaultSearchScope"),
            });
            // Checkbox for using Personalized Search Scope (switch on/off)
            var oCheckBoxScope = new CheckBox({
                id: "defaultSearchScopeCheckbox",
                selected: {
                    path: "/favActive",
                    mode: BindingMode.TwoWay,
                },
                text: i18n.getText("sp.usePersSearchScope"),
            });
            // Headline for connector list
            var oListLabel = new Label({
                id: "connectorListLabel",
                text: i18n.getText("sp.connectorList"),
                visible: "{/favActive}",
                layoutData: new FlexItemData({ growFactor: 1 }),
            }).addStyleClass("sapUiSmallMarginTop");
            // Display selected count and total count of connectors in headline
            var oListCount = new Label({
                text: {
                    parts: ["/selectedDataSourceCount", "/dataSourceCount"],
                    formatter: function (selectedDataSourceCount, dataSourceCount) {
                        return i18n.getText("sp.connectorListCount", [
                            selectedDataSourceCount,
                            dataSourceCount,
                        ]);
                    },
                },
                visible: "{/favActive}",
            }).addStyleClass("sapUiSmallMarginTop");
            var oListHeadlineFlexBox = new FlexBox({
                items: [oListLabel, oListCount],
            });
            // Connector list
            var oList = new List({
                id: "connectorListId",
                mode: ListMode.MultiSelect,
                visible: "{/favActive}",
                selectionChange: function (oEvent) {
                    that.onListItemSelectionChange(oEvent);
                },
                growing: true,
                growingThreshold: 50,
                growingScrollToLoad: true,
            }).addStyleClass("sapUiTinyMarginTop");
            oList.bindAggregation("items", "/subDataSources", function () {
                var oListItem = new StandardListItem({
                    title: "{label}",
                    selected: "{selected}",
                });
                return oListItem;
            });
            // assemble
            var oDefaultSearchVBox = new VBox({
                items: [oTitleDefaultSearch, oCheckBoxScope, oListHeadlineFlexBox, oList],
                visible: "{/userDefinedDatasources}",
            }).addStyleClass("sapUiSmallMarginTop");
            var oSearchPrefsVBox = new VBox({
                items: [oPersSearchVBox, oDefaultSearchVBox],
            });
            content = [oSearchPrefsVBox];
            return content;
        },
        onBeforeRendering: function () {
            // first -> no model reload
            if (this.firstTimeBeforeRendering) {
                this.firstTimeBeforeRendering = false;
                return;
            }
            // reload model data
            this.getModel().reload();
        },
        resetHistory: function () {
            this.getModel()
                .resetProfile()
                .then(function () {
                // success: nothing to do here
            }, function (response) {
                // error: display error popup
                var errorText = i18n.getText("sp.resetFailed");
                errorText += "\n" + response;
                MessageBox.show(errorText, {
                    title: i18n.getText("sp.resetFailedTitle"),
                    icon: MessageBox.Icon.ERROR,
                    actions: [MessageBox.Action.OK],
                });
            });
        },
        // event: select listItem in connector list
        onListItemSelectionChange: function (oEvent) {
            this.getModel().setProperty("/selectedDataSourceCount", oEvent.getSource().getSelectedItems().length);
        },
    });
});
