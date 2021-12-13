/*!
 * SAPUI5

		(c) Copyright 2009-2021 SAP SE. All rights reserved
	
 */
sap.ui.define([
    "sap/m/List",
    "sap/m/StandardListItem",
    "sap/m/GroupHeaderListItem",
    "sap/m/CustomListItem",
    "sap/m/Tree",
    "sap/m/StandardTreeItem",
    "sap/m/CustomTreeItem",
    "sap/m/Label",
    "sap/m/CheckBox",
    "sap/m/ListSeparators",
    "sap/m/ListMode",
    "sap/ui/model/BindingMode",
], function (List, StandardListItem, GroupHeaderListItem, CustomListItem, Tree, StandardTreeItem, CustomTreeItem, Label, CheckBox, ListSeparators, ListMode, BindingMode) {
    "use strict";
    return List.extend("sap.esh.search.ui.controls.SearchFacetHierarchy", {
        constructor: function (id, settings) {
            if (typeof id === "object") {
                settings = id;
                id = undefined;
            }
            jQuery.extend(settings, {
                showSeparators: ListSeparators.None,
                mode: ListMode.SingleSelectMaster,
                items: [],
            });
            return List.prototype.constructor.apply(this, [id, settings]);
        },
        init: function () {
            // heading
            this.addItem(new GroupHeaderListItem({ title: "{title}" }));
            // tree
            this.tree = new Tree({
                mode: ListMode.None,
                includeItemInSelection: true,
                selectionChange: function (event) {
                    var treeNode = event.getParameter("listItem").getBindingContext().getObject();
                    treeNode.toggleFilter(event.getParameter("selected"));
                },
                items: {
                    path: "node/childNodes",
                    factory: function (sId, oContext) {
                        var treeNode = oContext.getObject();
                        var label = new Label({
                            text: {
                                parts: ["label", "count"],
                                formatter: function (label, count) {
                                    return count ? label + " (" + count + ")" : label;
                                },
                            },
                        });
                        label.attachBrowserEvent("click", function () {
                            treeNode.toggleFilter();
                        });
                        return new CustomTreeItem({
                            content: [
                                new CheckBox({
                                    selected: {
                                        path: "selected",
                                        mode: BindingMode.OneWay,
                                    },
                                    partiallySelected: {
                                        path: "partiallySelected",
                                        mode: BindingMode.OneWay,
                                    },
                                    select: function (event) {
                                        var treeNode = event.getSource().getBindingContext().getObject();
                                        treeNode.toggleFilter();
                                    },
                                }),
                                label,
                            ],
                        });
                    },
                },
                toggleOpenState: function (event) {
                    event
                        .getParameter("itemContext")
                        .getObject()
                        .toggleExpand(event.getParameter("expanded"));
                },
            });
            this.addItem(new CustomListItem({
                content: this.tree,
            }));
            // register on after rendering for expanding tree nodes
            var delegate = {
                onAfterRendering: function () {
                    this.expandTreeNodes();
                }.bind(this),
            };
            this.addEventDelegate(delegate, this);
        },
        expandTreeNodes: function () {
            var facetModel = this.getBindingContext().getObject();
            var rootNode = facetModel.node;
            this.expandTreeNodeRecursively(rootNode, true);
        },
        expandTreeNodeRecursively: function (node, isRootNode) {
            if (node.expanded && !isRootNode) {
                this.doExpand(node);
            }
            if (!node.childNodes) {
                return;
            }
            for (var i = 0; i < node.childNodes.length; ++i) {
                var childNode = node.childNodes[i];
                this.expandTreeNodeRecursively(childNode);
            }
        },
        doExpand: function (node) {
            var items = this.tree.getItems();
            for (var i = 0; i < items.length; ++i) {
                var item = items[i];
                var itemNode = item.getBindingContext().getObject();
                if (itemNode === node) {
                    this.tree.expand(i);
                    return;
                }
            }
        },
        renderer: "sap.m.ListRenderer",
    });
});
