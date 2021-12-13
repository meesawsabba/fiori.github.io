sap.ui.define([
    "sap/ui/base/Object",
    "sap/base/util/extend",
    "sap/suite/ui/generic/template/genericUtilities/controlHelper"
], function(BaseObject, extend, controlHelper) {
    "use strict";
    
	function getMethods(oController, oCommonUtils, oComponentUtils, oSmartTable) {
        function fnGetBinding() {
            var oTable = oSmartTable.getTable();
            return oTable.getBinding("rows") || oTable.getBinding("items");
        }

        function fnGetBindingPath() {
            return oSmartTable.getTableBindingPath();
        }

        function fnGetVisibleProperties() {
            return oSmartTable.getTable().getColumns();
		}

		function fnGetSelectedContexts() {
			var aSelectedContexts = [];
			var oInnerTable = oSmartTable.getTable();

			if (controlHelper.isMTable(oInnerTable)) {
				aSelectedContexts = oInnerTable.getSelectedContexts();
			} else if (controlHelper.isUiTable(oInnerTable)) {
				var oSelectionPlugin = oInnerTable.getPlugins().filter(function (oPlugin) {
					return oPlugin.isA("sap.ui.table.plugins.SelectionPlugin");
				})[0];
				var aIndex = oSelectionPlugin ? oSelectionPlugin.getSelectedIndices() : oInnerTable.getSelectedIndices();
				if (aIndex) { //Check added as getSelectedIndices() doesn't return anything if rows are not loaded
					var oContext;
					for (var i = 0; i < aIndex.length; i++) {
						oContext = oInnerTable.getContextByIndex(aIndex[i]);
						if (oContext) { // edge case handling where sap.ui.table maintains selection for a row when last item in the table is deleted
							aSelectedContexts.push(oContext);
						}
					}
				}
			}
			return aSelectedContexts;
		}

		function fnGetModel() {
			return oSmartTable.getModel();
		}

		function getTemplateSortOrder() {
			var aSortOrder = [];
			var oTemplateSortOrder = oSmartTable.getCustomData().find(function (element) {
				return element.getKey() === "TemplateSortOrder";
			});
			var sTemplateSortOrder = oTemplateSortOrder && oTemplateSortOrder.getValue();
			if (sTemplateSortOrder) {
				sTemplateSortOrder.split(", ").forEach(function (oSort) {
					var aSort = oSort.split(" ");
					aSortOrder.push({
						Property: aSort[0],
						Descending: aSort.length > 1
					});
				});
			}
			return aSortOrder;
		}
        
        function fnGetItems() {
            var oInnerTable = oSmartTable.getTable();
            return controlHelper.isUiTable(oInnerTable) ? oInnerTable.getRows() : oInnerTable.getItems();
        }

		function fnSetEnabledToolbarButtons() {
			/* TODO: the only information retrieved from the control itself is the selected contexts, its model and the toolbar. For this, we already have methods in this 
			   class, so ideally, this information should be passed to a corresponding method in commonUtils, that would not need to know the presentationControl.
			   So, setEnabledToolbarButtons method in commonUtils should be refactored accordingly. */
			return oCommonUtils.setEnabledToolbarButtons(oSmartTable);
		}

		function fnSetEnabledFooterButtons() {
			/* TODO: the only information retrieved from the control itself is the selected contexts and the entity set. So ideally, this information should be passed to a 
			   corresponding method in commonUtils, that would not need to know the presentationControl. So, setEnabledFooterButtons method in commonUtils should be refactored
			   accordingly.*/
			return oCommonUtils.setEnabledFooterButtons(oSmartTable);
		}

		function fnSetCurrentVariantId(sVariantId) {
			oSmartTable.attachAfterVariantInitialise(function () {
				oSmartTable.setCurrentVariantId(sVariantId);
			});
			// incase the control variant is already initialized
			oSmartTable.setCurrentVariantId(sVariantId);
		}

		function fnGetBindingInfo() {
			var oInnerTable = oSmartTable.getTable();
			if (controlHelper.isUiTable(oInnerTable)) {
				return oInnerTable.getBindingInfo("rows");
			} else if (controlHelper.isMTable(oInnerTable)) {
				return oInnerTable.getBindingInfo("items");
			}
		}

		/* @param {string} sBatchGroupId - Batch GroupId Id is used to merge the batch request
		   @param {boolean} bNoMessageRefresh - can be used to surpress the refresh of the header messages in edit mode. Used in lazy loading.*/
		function fnRefresh(sBatchGroupId, bNoMessageRefresh) {
			var oBindingInfo = fnGetBindingInfo();
			if (oBindingInfo && oBindingInfo.binding) {
				// Pass the BatchGroupId only if it is being supplied
				if (sBatchGroupId) {
					oBindingInfo.binding.refresh(sBatchGroupId);
				} else {
					oBindingInfo.binding.refresh();
				}

				if (!bNoMessageRefresh && oController.getView().getModel("ui").getProperty("/editable")) {
					oComponentUtils.messagesRefresh();
				}
			} else if (oSmartTable && oSmartTable.rebindTable) {
				oSmartTable.rebindTable();
			}
		}

        function fnRebind() {
            oSmartTable.rebindTable();
        }

		function fnApplyNavigationSortOrder(aNavigationSortOrder) {
			var oUiState = oSmartTable.getUiState();
			var oPresentationVariant = oUiState.getPresentationVariant();
			if (!oPresentationVariant.SortOrder) {
				oPresentationVariant.SortOrder = getTemplateSortOrder();
			}
			oPresentationVariant.SortOrder = oPresentationVariant.SortOrder.concat(aNavigationSortOrder);

			oUiState.setPresentationVariant(oPresentationVariant);
			oSmartTable.setUiState(oUiState);
		}

        function fnScrollToSelectedItemAsPerChildContext(sCurrentChildContext) {
            var oInnerTable = oSmartTable.getTable();
            if (controlHelper.isMTable(oInnerTable)){ // currently only mTable is supported
                var iIndex = oInnerTable.getItems().findIndex(function(oItem) {
                    return oItem.getBindingContextPath() === sCurrentChildContext;
                });
                if (iIndex > -1) {
                    oInnerTable.scrollToIndex(iIndex);
                }
            }
        }

		// public instance methods
		return {
            getBinding: fnGetBinding,
            getBindingPath: fnGetBindingPath,
            getSelectedContexts: fnGetSelectedContexts,
            getVisibleProperties: fnGetVisibleProperties,
            getItems: fnGetItems,
			getBindingInfo: fnGetBindingInfo,
			getModel: fnGetModel,
            setEnabledToolbarButtons: fnSetEnabledToolbarButtons,
            setEnabledFooterButtons: fnSetEnabledFooterButtons,
            setCurrentVariantId: fnSetCurrentVariantId,
            setCurrentTableVariantId: fnSetCurrentVariantId,
            setCurrentChartVariantId: Function.prototype,
            refresh: fnRefresh,
            rebind: fnRebind,
            applyNavigationSortOrder: fnApplyNavigationSortOrder,
            scrollToSelectedItemAsPerChildContext: fnScrollToSelectedItemAsPerChildContext
		};
	}

	return BaseObject.extend("sap.suite.ui.generic.template.lib.presentationControl.SmartTableHandler", {
		constructor: function(oController, oCommonUtils, oComponentUtils, oSmartTable) {
			extend(this, getMethods(oController, oCommonUtils, oComponentUtils, oSmartTable));
		}
	});
});