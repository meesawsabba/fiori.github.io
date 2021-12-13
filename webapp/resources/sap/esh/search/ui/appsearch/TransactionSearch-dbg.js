/*!
 * SAPUI5

		(c) Copyright 2009-2021 SAP SE. All rights reserved
	
 */
sap.ui.define([
// "../i18n",
// "sap/esh/search/ui/SearchHelper",
// "sap/m/GenericTile",
// "sap/m/TileContent",
// "sap/m/ImageContent"
], 
/**
 *
 */
function () {
    "use strict";
    var TransactionSearch = function () {
        this.init.apply(this, arguments);
    };
    TransactionSearch.prototype = {
        init: function () {
            // var that = this;
            // sap.ushell.Container.getServiceAsync(
            //     "CrossApplicationNavigation"
            // ).then(function (corssAppNavigator) {
            //     that.corssAppNavigator = corssAppNavigator;
            // });
        },
        prefetch: function () { },
        search: function () {
            // var that = this;
            // var results = {
            //     totalCount: 0,
            //     tiles: [],
            // };
            // // get transaction search datasource
            // that.oModel = sap.esh.search.ui.getModelSingleton({}, "flp");
            // var appSearchDataSource = that.oModel.getProperty(
            //     "/appSearchDataSource"
            // );
            // if (appSearchDataSource === null) {
            //     return results;
            // }
            // // build sina search query
            // var searchQuery = that.oModel.sinaNext.createSearchQuery();
            // searchQuery.skip = query.skip;
            // searchQuery.top = query.top;
            // searchQuery.filter.searchTerm = that._normalizeSearchTerm(
            //     query.searchTerm
            // );
            // searchQuery.filter.dataSource = appSearchDataSource;
            // // execute sina search query
            // return SearchHelper.convertPromiseTojQueryDeferred(
            //     that.oModel.sinaNext.provider.executeSearchQuery(searchQuery)
            // )
            //     .then(
            //         function (response) {
            //             results.totalCount = response.totalCount;
            //             return jQuery.when.apply(
            //                 null,
            //                 jQuery.map(
            //                     response.items,
            //                     this._formatTileAsync.bind(this)
            //                 )
            //             );
            //         }.bind(this)
            //     )
            //     .then(function () {
            //         results.tiles = [].slice.call(arguments);
            //         return results;
            //     });
            return Promise.resolve({
                totalCount: 0,
                items: [],
            });
        },
        // _getView: function (tile) {
        //     var view = new GenericTile({
        //         header: tile.title,
        //         subheader: tile.subtitle,
        //         //size: "Auto",
        //         tileContent: new TileContent({
        //             content: new ImageContent({
        //                 src: tile.icon,
        //             }),
        //             footer: i18n.getText(
        //                 "transactionText"
        //             ),
        //         }),
        //     });
        //     if (tile.isUshellSupported === false && tile.url.length === 0) {
        //         view.attachPress(function () {
        //             MessageBox.information(
        //                 i18n.getText(
        //                     "NavigationUnsupported"
        //                 ),
        //                 {
        //                     actions: [MessageBox.Action.OK],
        //                 }
        //             );
        //         });
        //     } else {
        //         view.attachPress(function () {
        //             window.open(tile.url, "_target", "noopener,noreferrer");
        //         });
        //     }
        //     view.eventLoggingData = {
        //         targetUrl: tile.url,
        //         title: tile.title,
        //     };
        //     return view;
        // },
        // _formatTileAsync: function (item) {
        //     var that = this;
        //     var itemData = {};
        //     var code = that._getTcode(item).value;
        //     var codeHighlighted = that._getTcode(item).valueHighlighted;
        //     var title = that._getTitle(item).value;
        //     var titleHighlighted =
        //         that._getTitle(item).valueHighlighted + " - " + codeHighlighted;
        //     var ushellUrl = that._getUshellUrl(item);
        //     var backendUrl = that._getBackendUrl(item);
        //     itemData = {
        //         type: "transaction",
        //         icon: "sap-icon://action",
        //         title: title, // in Tile, client-side highlighted
        //         label: titleHighlighted, // in suggestion, server-side highlighted
        //         subtitle: code,
        //         isUshellSupported: false,
        //         url: "",
        //         getView: function () {
        //             return that._getView(this);
        //         },
        //     };
        //     return that.corssAppNavigator.isIntentSupported([ushellUrl]).then(
        //         function (isSupported) {
        //             itemData.isUshellSupported =
        //                 isSupported[ushellUrl].supported;
        //             if (itemData.isUshellSupported) {
        //                 itemData.url = ushellUrl;
        //             } else {
        //                 itemData.url = backendUrl;
        //             }
        //             return itemData;
        //         },
        //         function () {
        //             itemData.url = backendUrl;
        //             return jQuery.resolve(itemData);
        //         }
        //     );
        // },
        // _normalizeSearchTerm: function (string) {
        //     if (string === "*") {   // asterisk
        //         return string;
        //     }
        //     var finalString = "";
        //     string = string.replace("*", " ");
        //     var stringList = string.split(" ");
        //     stringList.forEach(function (elem) {
        //         elem = " *" + elem + "* ";
        //         finalString = finalString + elem;
        //     });
        //     return finalString;
        // },
        // _getTitle: function (item) {
        //     var attributes = item.detailAttributes;
        //     var title = {
        //         value: "",
        //         valueHighlighted: "",
        //     };
        //     for (var i = 0; i < attributes.length; i++) {
        //         if (attributes[i].id === "TTEXT") {
        //             title.value =
        //                 attributes[i].value ||
        //                 i18n.getText(
        //                     "transactionText"
        //                 );
        //             title.valueHighlighted =
        //                 attributes[i].valueHighlighted || title.value;
        //             break;
        //         }
        //     }
        //     return title;
        // },
        // _getTcode: function (item) {
        //     var attributes = item.titleAttributes;
        //     var tCode = {
        //         value: "",
        //         valueHighlighted: "",
        //     };
        //     for (var i = 0; i < attributes.length; i++) {
        //         if (attributes[i].id === "TCODE") {
        //             tCode.value = attributes[i].value;
        //             tCode.valueHighlighted =
        //                 attributes[i].valueHighlighted || tCode.value;
        //             break;
        //         }
        //     }
        //     return tCode;
        // },
        // _getUshellUrl: function (item) {
        //     var that = this;
        //     var system = "";
        //     var tCode = "";
        //     if (this.oModel.sinaNext.provider.serverInfo) {
        //         system =
        //             "sap-system=" +
        //             that.oModel.sinaNext.provider.serverInfo.SystemId;
        //     }
        //     if (that._getTcode(item) !== "") {
        //         tCode = "&sap-ui2-tcode=" + that._getTcode(item).value;
        //     }
        //     return "#Shell-startGUI?" + system + tCode;
        // },
        // _getBackendUrl: function (item) {
        //     var that = this;
        //     var url = "";
        //     if (this.oModel.sinaNext.provider.serverInfo) {
        //         var host = that.oModel.sinaNext.provider.serverInfo.URL;
        //         var port = that.oModel.sinaNext.provider.serverInfo.Port;
        //         var client = that.oModel.sinaNext.provider.serverInfo.Client;
        //         var tCode = that._getTcode(item).value;
        //         if (host && port && client && tCode.length !== "") {
        //             url =
        //                 host +
        //                 ":" +
        //                 port +
        //                 "/sap/bc/gui/sap/its/webgui/?sap-client=" +
        //                 client +
        //                 "&~transaction=" +
        //                 tCode;
        //         }
        //     }
        //     return url;
        // },
    };
    return TransactionSearch;
});
