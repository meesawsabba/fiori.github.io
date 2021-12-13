/*!
 * SAPUI5

		(c) Copyright 2009-2021 SAP SE. All rights reserved
	
 */
// iteration 0 : Holger
sap.ui.define(["./SearchResultListSelectionHandler", "sap/m/MessageBox"], function (SearchResultListSelectionHandler, MessageBox) {
    "use strict";
    return SearchResultListSelectionHandler.extend("sap.esh.search.ui.controls.SearchResultListSelectionHandlerNote", {
        isMultiSelectionAvailable: function () {
            return true;
        },
        actionsForDataSource: function () {
            var actions = [
                {
                    text: "Show Selected Items",
                    action: function (selection) {
                        var message = "No Items were selected!";
                        if (selection.length > 0) {
                            message = "Following Items were selected:";
                            for (var i = 0; i < selection.length; i++) {
                                message += "\n" + selection[i].title;
                            }
                        }
                        MessageBox.show(message, {
                            icon: MessageBox.Icon.INFORMATION,
                            title: "I'm a Custom Action for testing Multi-Selection",
                            actions: [MessageBox.Action.OK],
                        });
                    },
                },
            ];
            return actions;
        },
    });
});
