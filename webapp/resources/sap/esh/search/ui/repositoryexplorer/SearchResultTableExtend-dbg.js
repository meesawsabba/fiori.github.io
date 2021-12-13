/*!
 * SAPUI5

		(c) Copyright 2009-2021 SAP SE. All rights reserved
	
 */
sap.ui.define(["../i18n", "sap/ui/core/CustomData", "sap/m/Button", "sap/m/ButtonType", "sap/m/MessageToast"], 
/**
 *
 * @param {*} i18n
 * @param {*} CustomData
 * @param {*} Button
 * @param {*} ButtonType
 * @param {*} MessageToast
 */
function (i18n, CustomData, Button, ButtonType, MessageToast) {
    "use strict";
    var module = {};
    jQuery.extend(module, {
        extendTableColumn: {
            column: {
                name: i18n.getText("actions"),
                attributeId: "SEARCH_TABLE_FAVORITE",
                width: "70px",
            },
            assembleCell: function (data) {
                var itemId = data.idAttribute.value;
                var isFavorite = !!data.favoriteUserId.value;
                return {
                    isExtendTableColumnCell: true,
                    iconFavorite: "sap-icon://favorite",
                    iconUnfavorite: "sap-icon://unfavorite",
                    itemId: itemId,
                    isFavorite: isFavorite,
                };
            },
            bindingFunction: function (bindingObject) {
                var isNoFavoriteId = "isNoFavorite";
                var isFavoriteId = "isFavorite";
                var currentFavoriteId = bindingObject.isFavorite ? isFavoriteId : isNoFavoriteId;
                var button = new Button({
                    icon: bindingObject.isFavorite
                        ? bindingObject.iconFavorite
                        : bindingObject.iconUnfavorite,
                    tooltip: bindingObject.isFavorite
                        ? i18n.getText("unfavorite")
                        : i18n.getText("favorite"),
                    type: ButtonType.Transparent,
                    customData: [
                        new CustomData({
                            key: "testid",
                            value: currentFavoriteId,
                            writeToDom: true,
                        }),
                    ],
                    press: function () {
                        var oMessageToastParams = {
                            closeOnBrowserNavigation: false,
                        }; // duration: usually 'undefined' for DWC message toast
                        var requestUrl = window.location.origin +
                            "/dwaas-core/repository/userfavorites?ids=" +
                            bindingObject.itemId;
                        this.setBusyIndicatorDelay(0);
                        this.setBusy(true);
                        if (this.getIcon() === bindingObject.iconUnfavorite) {
                            // add to favorites
                            this.getModel()
                                .sinaNext.provider.ajaxClient.request({
                                method: "POST",
                                url: requestUrl,
                            })
                                .then(function () {
                                this.setIcon(bindingObject.iconFavorite);
                                this.getModel().invalidateQuery();
                                this.setBusy(false);
                                this.addCustomData(new CustomData({
                                    key: "testid",
                                    value: isFavoriteId,
                                    writeToDom: true,
                                }));
                                // show toast message
                                MessageToast.show(i18n.getText("favoriteToast"), oMessageToastParams);
                            }.bind(this), function () {
                                this.setBusy(false);
                            }.bind(this));
                        }
                        else {
                            // remove from favorites
                            this.getModel()
                                .sinaNext.provider.ajaxClient.request({
                                method: "DELETE",
                                url: requestUrl,
                            })
                                .then(function () {
                                this.setIcon(bindingObject.iconUnfavorite);
                                this.getModel().invalidateQuery();
                                this.setBusy(false);
                                this.addCustomData(new CustomData({
                                    key: "testid",
                                    value: isNoFavoriteId,
                                    writeToDom: true,
                                }));
                                // show toast message
                                MessageToast.show(i18n.getText("unfavoriteToast"), oMessageToastParams);
                            }.bind(this), function () {
                                this.setBusy(false);
                            }.bind(this));
                        }
                    },
                });
                button.addStyleClass("sapUshellSearchTableFavorite");
                button.data("testid", currentFavoriteId, true);
                return button;
            },
        },
    });
    return module;
});
