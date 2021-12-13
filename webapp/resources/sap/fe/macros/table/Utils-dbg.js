/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)
        (c) Copyright 2009-2021 SAP SE. All rights reserved
    
 */

sap.ui.define(
	[
		"sap/ui/model/Filter",
		"sap/ui/core/format/NumberFormat",
		"sap/fe/core/CommonUtils",
		"sap/fe/macros/CommonHelper",
		"sap/fe/macros/filter/FilterUtils",
		"sap/base/Log",
		"sap/fe/macros/DelegateUtil",
		"sap/fe/core/helpers/ModelHelper",
		"sap/fe/core/converters/MetaModelConverter",
		"sap/fe/core/converters/ConverterContext",
		"sap/base/util/merge",
		"sap/fe/core/helpers/BindingExpression"
	],
	function(
		Filter,
		NumberFormat,
		CommonUtils,
		CommonHelper,
		FilterUtils,
		Log,
		DelegateUtil,
		ModelHelper,
		MetaModelConverter,
		ConverterContext,
		merge,
		BindingExpression
	) {
		"use strict";

		/**
		 * Get filter information for a SelectionVariant annotation.
		 *
		 * @param {object} oTable The table instance
		 * @param {string} sSvPath Relative SelectionVariant annotation path
		 * @returns {object} Information on filters
		 *  filters: array of sap.ui.model.filters
		 * text: selection Variant text property
		 * @private
		 * @ui5-restricted
		 */
		function getFiltersInfoForSV(oTable, sSvPath) {
			var sEntityTypePath = oTable.data("entityType"),
				oMetaModel = CommonUtils.getAppComponent(oTable).getMetaModel(),
				oSelectionVariant = oMetaModel.getObject(sEntityTypePath + "@" + sSvPath),
				mPropertyFilters = {},
				aFilters = [],
				aPaths = [],
				sText = "";
			if (oSelectionVariant) {
				sText = oSelectionVariant.Text;
				(oSelectionVariant.SelectOptions || [])
					.filter(function(oSelectOption) {
						return oSelectOption && oSelectOption.PropertyName && oSelectOption.PropertyName.$PropertyPath;
					})
					.forEach(function(oSelectOption) {
						var sPath = oSelectOption.PropertyName.$PropertyPath;
						if (!aPaths.includes(sPath)) {
							aPaths.push(sPath);
						}
						for (var j in oSelectOption.Ranges) {
							var oRange = oSelectOption.Ranges[j];
							mPropertyFilters[sPath] = (mPropertyFilters[sPath] || []).concat(
								new Filter(sPath, oRange.Option.$EnumMember.split("/").pop(), oRange.Low, oRange.High)
							);
						}
					});

				for (var sPropertyPath in mPropertyFilters) {
					aFilters.push(
						new Filter({
							filters: mPropertyFilters[sPropertyPath],
							and: false
						})
					);
				}
			}

			return {
				properties: aPaths,
				filters: aFilters,
				text: sText
			};
		}

		/**
		 * Gets all the hidden filters of the table that are configured using the table building block containing the parameter 'filters'.
		 *
		 * @param {object} oTable The table instance
		 * @returns {Array} Information on filters
		 * @private
		 * @ui5-restricted
		 */
		function getHiddenFilters(oTable) {
			var aFilters = [],
				hiddenFilters = oTable.data("hiddenFilters");
			if (hiddenFilters && Array.isArray(hiddenFilters.paths)) {
				hiddenFilters.paths.forEach(function(mPath) {
					var oSvFilter = getFiltersInfoForSV(oTable, mPath.annotationPath);
					aFilters = aFilters.concat(oSvFilter.filters);
				});
			}
			return aFilters;
		}

		/**
		 * Gets all the quick filters of the table that are configured using the table building block containing the parameter 'filters'.
		 *
		 * @param {object} oTable The table instance
		 * @returns {Array} Information on filters
		 * @private
		 * @ui5-restricted
		 */
		function getQuickFilter(oTable) {
			var aFilters = [],
				sQuickFilterKey = DelegateUtil.getCustomData(oTable, "quickFilterKey");
			if (sQuickFilterKey) {
				aFilters = aFilters.concat(getFiltersInfoForSV(oTable, sQuickFilterKey).filters);
			}
			return aFilters;
		}

		/**
		 * Gets all the selected quick and hidden filters of the table that are configured using the table building block containing the parameter 'filters'.
		 *
		 * @param {object} oTable The table instance
		 * @returns {Array} Information on filters
		 * @private
		 * @ui5-restricted
		 */
		function getTableFilters(oTable) {
			return getQuickFilter(oTable).concat(getHiddenFilters(oTable));
		}

		/**
		 * Creates the ListBinding context request for a table with additional filters.
		 *
		 * @param {object} oTable The table instance
		 * @param {sap.ui.model.Context} oPageBinding  The page binding context where the table is set
		 * @param {object} oParams Additional settings for the list binding
		 *    oParams: {
		 * 		batchGroupId: 	group ID to be used for read requests triggered by this binding
		 * 		additionalFilters: Filters to be added to the table filters for items or the rows count
		 * }
		 * @returns {Promise} Promise containing the list binding context request
		 * @private
		 * @ui5-restricted
		 */
		function getListBindingForCount(oTable, oPageBinding, oParams) {
			var oBindingInfo = oTable.data("rowsBindingInfo"),
				oDataModel = oTable.getModel(),
				oListBinding,
				oTableContextFilter,
				sBatchId = oParams.batchGroupId || "",
				oFilterInfo = getFilterInfo(oTable),
				aFilters = Array.isArray(oParams.additionalFilters) ? oParams.additionalFilters : [],
				sBindingPath = oFilterInfo.bindingPath ? oFilterInfo.bindingPath : oBindingInfo.path;

			aFilters = aFilters.concat(oFilterInfo.filters).concat(getP13nFilters(oTable));
			oTableContextFilter = new Filter({
				filters: aFilters,
				and: true
			});

			oListBinding = oDataModel.bindList(
				(oPageBinding ? oPageBinding.getPath() + "/" : "") + sBindingPath,
				oTable.getBindingContext(),
				null,
				oTableContextFilter,
				{
					$count: true,
					$$groupId: sBatchId || "$auto",
					$search: oFilterInfo.search
				}
			);
			return oListBinding.requestContexts(0, 1).then(function(oContext) {
				var iCount = oContext && oContext.length ? oContext[0].getBinding().getLength() : 0;
				oListBinding.destroy();
				return iCount;
			});
		}

		/**
		 * Manage List Binding request related to Counts on QuickFilter control and update text
		 * in line with batch result.
		 *
		 * @param {object} oTable Table Instance
		 * @param {sap.ui.model.Context} oPageBinding  Page Binding Context where the Table is set
		 * @param {object} mParams Object containing additional filters
		 * @private
		 * @ui5-restricted
		 */

		function getCountFormatted(iCount) {
			var oCountFormatter = NumberFormat.getIntegerInstance({ groupingEnabled: true });
			return oCountFormatter.format(iCount);
		}

		function getFilterInfo(oTable) {
			var isAnalyticalEnabled = DelegateUtil.getCustomData(oTable, "enableAnalytics"),
				aIgnoreProperties = [];

			function _getRelativePathArrayFromAggregates(oTable) {
				var mAggregates = CommonHelper.parseCustomData(DelegateUtil.getCustomData(oTable, "aggregates") || {});
				return Object.keys(mAggregates).map(function(sAggregateName) {
					return mAggregates[sAggregateName].relativePath;
				});
			}

			if (isAnalyticalEnabled === "true" || isAnalyticalEnabled === true) {
				aIgnoreProperties = aIgnoreProperties.concat(["search"]).concat(_getRelativePathArrayFromAggregates(oTable));
			}
			var oFilter = FilterUtils.getFilterInfo(oTable.getFilter(), {
				ignoredProperties: aIgnoreProperties,
				targetControl: oTable
			});
			return oFilter;
		}

		/**
		 * Retrieves all filters configured in Table filter personalization dialog.
		 *
		 * @param {sap.ui.mdc.Table} oTable Table instance
		 * @returns {Array} Filters configured in table personalization dialog
		 * @private
		 * @ui5-restricted
		 */
		function getP13nFilters(oTable) {
			var aP13nMode = oTable.getP13nMode();
			if (aP13nMode && aP13nMode.indexOf("Filter") > -1) {
				var aP13nProperties = (DelegateUtil.getCustomData(oTable, "sap_fe_TableDelegate_propertyInfoMap") || []).filter(function(
						oTableProperty
					) {
						return oTableProperty && !(oTableProperty.filterable === false);
					}),
					oFilterInfo = FilterUtils.getFilterInfo(oTable, { propertiesMetadata: aP13nProperties });
				if (oFilterInfo && oFilterInfo.filters) {
					return oFilterInfo.filters;
				}
			}
			return [];
		}

		function getAllFilterInfo(oTable) {
			var oIFilterInfo = getFilterInfo(oTable);
			return {
				filters: oIFilterInfo.filters.concat(getTableFilters(oTable), getP13nFilters(oTable)),
				search: oIFilterInfo.search,
				bindingPath: oIFilterInfo.bindingPath
			};
		}

		/**
		 * Returns a promise that is resolved with the table itself when the table was bound.
		 *
		 * @param {sap.ui.mdc.Table} oTable The table to check for binding
		 * @returns {Promise} A Promise that will be resolved when table is bound
		 */
		function whenBound(oTable) {
			return _getOrCreateBoundPromiseInfo(oTable).promise;
		}

		/**
		 * If not yet happened, it resolves the table bound promise.
		 *
		 * @param {sap.ui.mdc.Table} oTable The table that was bound
		 */
		function onTableBound(oTable) {
			var oBoundPromiseInfo = _getOrCreateBoundPromiseInfo(oTable);
			if (oBoundPromiseInfo.resolve) {
				oBoundPromiseInfo.resolve(oTable);
				oTable.data("boundPromiseResolve", null);
			}
		}

		function _getOrCreateBoundPromiseInfo(oTable) {
			if (!oTable.data("boundPromise")) {
				var fnResolve;
				oTable.data(
					"boundPromise",
					new Promise(function(resolve) {
						fnResolve = resolve;
					})
				);
				if (oTable.isBound()) {
					fnResolve(oTable);
				} else {
					oTable.data("boundPromiseResolve", fnResolve);
				}
			}
			return { promise: oTable.data("boundPromise"), resolve: oTable.data("boundPromiseResolve") };
		}

		function updateBindingInfo(oBindingInfo, oFilterInfo, oFilter) {
			oBindingInfo.filters = oFilter;
			if (oFilterInfo.search) {
				oBindingInfo.parameters.$search = oFilterInfo.search;
			} else {
				oBindingInfo.parameters.$search = undefined;
			}
		}

		function fnGetSemanticTargetsFromTable(oController, oTable) {
			var oView = oController.getView();
			var oInternalModelContext = oView.getBindingContext("internal");
			if (oInternalModelContext) {
				var sEntitySet = DelegateUtil.getCustomData(oTable, "targetCollectionPath");
				if (sEntitySet) {
					var oComponent = oController.getOwnerComponent();
					var oAppComponent = sap.ui.core.Component.getOwnerComponentFor(oComponent);
					var oMetaModel = oAppComponent.getMetaModel();
					var oShellServiceHelper = CommonUtils.getShellServices(oAppComponent);
					var sCurrentHash = oShellServiceHelper.hrefForExternal();
					var oColumns = DelegateUtil.getCustomData(oTable, "columns");
					var aSemanticObjectsForGetLinks = [];
					var aSemanticObjects = [];
					var sPath,
						sAnnotationPath,
						oProperty,
						aPath = [];
					var _oSemanticObject;
					var aSemanticObjectsPromises = [];

					if (sCurrentHash && sCurrentHash.indexOf("?") !== -1) {
						// sCurrentHash can contain query string, cut it off!
						sCurrentHash = sCurrentHash.split("?")[0];
					}

					for (var i = 0; i < oColumns.customData.length; i++) {
						sAnnotationPath = oColumns.customData[i].annotationPath;
						//this check is required in cases where custom columns are configured via manifest where there is no provision for an annotation path.
						if (sAnnotationPath) {
							oProperty = oMetaModel.getObject(sAnnotationPath);
							if (oProperty && oProperty.$kind === "Property") {
								sPath = oColumns.customData[i].annotationPath;
							} else if (oProperty && oProperty.$Type === "com.sap.vocabularies.UI.v1.DataField") {
								sPath = sEntitySet + "/" + oMetaModel.getObject(sAnnotationPath + "/Value/$Path");
							}
						}
						if (sPath) {
							if (!(oMetaModel.getObject(sPath + "@com.sap.vocabularies.Common.v1.SemanticObject") === undefined)) {
								if (aPath.indexOf(sPath) === -1) {
									aPath.push(sPath);
									aSemanticObjectsPromises.push(
										CommonUtils.getSemanticObjectPromise(oAppComponent, oView, oMetaModel, sPath)
									);
								}
							}
						}
						sPath = undefined;
					}

					if (aSemanticObjectsPromises.length === 0) {
						return Promise.resolve();
					} else {
						Promise.all(aSemanticObjectsPromises)
							.then(function(aValues) {
								var aGetLinksPromises = [],
									sSemObjExpression;
								var aSemanticObjectsResolved = aValues.filter(function(element) {
									if (element.semanticObject && typeof element.semanticObject.semanticObject === "object") {
										sSemObjExpression = BindingExpression.compileBinding(
											BindingExpression.bindingExpression(element.semanticObject.semanticObject.$Path)
										);
										element.semanticObject.semanticObject = sSemObjExpression;
										element.semanticObjectForGetLinks[0].semanticObject = sSemObjExpression;
										return true;
									} else if (element) {
										return element.semanticObject !== undefined;
									} else {
										return false;
									}
								});
								for (var j = 0; j < aSemanticObjectsResolved.length; j++) {
									_oSemanticObject = aSemanticObjectsResolved[j];
									if (
										_oSemanticObject &&
										_oSemanticObject.semanticObject &&
										!(_oSemanticObject.semanticObject.semanticObject.indexOf("{") === 0)
									) {
										aSemanticObjectsForGetLinks.push(_oSemanticObject.semanticObjectForGetLinks);
										aSemanticObjects.push({
											semanticObject:
												_oSemanticObject.semanticObject && _oSemanticObject.semanticObject.semanticObject,
											unavailableActions: _oSemanticObject.unavailableActions,
											path: aSemanticObjectsResolved[j].semanticObjectPath
										});
										aGetLinksPromises.push(
											oShellServiceHelper.getLinksWithCache([_oSemanticObject.semanticObjectForGetLinks])
										); //aSemanticObjectsForGetLinks));
									}
								}
								return CommonUtils.updateSemanticTargets(
									aGetLinksPromises,
									aSemanticObjects,
									oInternalModelContext,
									sCurrentHash
								);
							})
							.catch(function(oError) {
								Log.error("fnGetSemanticTargetsFromTable: Cannot get Semantic Objects", oError);
							});
					}
				}
			}
		}

		function clearSelection(oTable) {
			oTable.clearSelection();
			var oInternalModelContext = oTable.getBindingContext("internal");
			if (oInternalModelContext) {
				oInternalModelContext.setProperty("deleteEnabled", false);
				oInternalModelContext.setProperty("numberOfSelectedContexts", 0);
				oInternalModelContext.setProperty("selectedContexts", []);
				oInternalModelContext.setProperty("deletableContexts", []);
			}
		}

		var oTableUtils = {
			getCountFormatted: getCountFormatted,
			getHiddenFilters: getHiddenFilters,
			getFiltersInfoForSV: getFiltersInfoForSV,
			getTableFilters: getTableFilters,
			getListBindingForCount: getListBindingForCount,
			getFilterInfo: getFilterInfo,
			getP13nFilters: getP13nFilters,
			getAllFilterInfo: getAllFilterInfo,
			whenBound: whenBound,
			onTableBound: onTableBound,
			getSemanticTargetsFromTable: fnGetSemanticTargetsFromTable,
			updateBindingInfo: updateBindingInfo,
			clearSelection: clearSelection
		};

		return oTableUtils;
	}
);
