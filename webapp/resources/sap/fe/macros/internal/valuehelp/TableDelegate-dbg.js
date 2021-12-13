/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)
        (c) Copyright 2009-2021 SAP SE. All rights reserved
    
 */
sap.ui.define(
	[
		"sap/ui/mdc/odata/v4/TableDelegate",
		"sap/ui/core/Core",
		"sap/ui/mdc/util/FilterUtil",
		"sap/ui/mdc/odata/v4/util/DelegateUtil",
		"sap/ui/mdc/odata/v4/FilterBarDelegate",
		"sap/ui/mdc/odata/v4/ODataMetaModelUtil",
		"sap/ui/mdc/odata/v4/TypeUtil",
		"sap/ui/model/Filter",
		"sap/ui/model/FilterOperator",
		"sap/base/Log",
		"sap/fe/macros/DelegateUtil",
		"sap/fe/core/helpers/ModelHelper"
	],
	function(
		TableDelegate,
		Core,
		FilterUtil,
		DelegateUtil,
		FilterBarDelegate,
		ODataMetaModelUtil,
		TypeUtil,
		Filter,
		FilterOperator,
		Log,
		MacrosDelegateUtil,
		ModelHelper
	) {
		"use strict";

		/**
		 * Test delegate for OData V4.
		 */
		var ODataTableDelegate = Object.assign({}, TableDelegate);

		ODataTableDelegate.fetchProperties = function(oTable) {
			var oModel = this._getModel(oTable);
			var pCreatePropertyInfos;

			if (!oModel) {
				pCreatePropertyInfos = new Promise(
					function(resolve) {
						oTable.attachModelContextChange(
							{
								resolver: resolve
							},
							onModelContextChange,
							this
						);
					}.bind(this)
				).then(
					function(oModel) {
						return this._createPropertyInfos(oTable, oModel);
					}.bind(this)
				);
			} else {
				pCreatePropertyInfos = this._createPropertyInfos(oTable, oModel);
			}

			return pCreatePropertyInfos.then(function(aProperties) {
				if (oTable.data) {
					oTable.data("$tablePropertyInfo", aProperties);
				}
				return aProperties;
			});
		};

		function onModelContextChange(oEvent, oData) {
			var oTable = oEvent.getSource();
			var oModel = this._getModel(oTable);

			if (oModel) {
				oTable.detachModelContextChange(onModelContextChange);
				oData.resolver(oModel);
			}
		}

		ODataTableDelegate._createPropertyInfos = function(oTable, oModel) {
			var oMetadataInfo = oTable.getDelegate().payload;
			var aProperties = [];
			var sEntitySetPath = "/" + oMetadataInfo.collectionName;
			var oMetaModel = oModel.getMetaModel();

			return oMetaModel.requestObject(sEntitySetPath + "@").then(function(mEntitySetAnnotations) {
				var oSortRestrictions = mEntitySetAnnotations["@Org.OData.Capabilities.V1.SortRestrictions"] || {};
				var oSortRestrictionsInfo = ODataMetaModelUtil.getSortRestrictionsInfo(oSortRestrictions);
				var oFilterRestrictions = mEntitySetAnnotations["@Org.OData.Capabilities.V1.FilterRestrictions"];
				var oFilterRestrictionsInfo = ODataMetaModelUtil.getFilterRestrictionsInfo(oFilterRestrictions);

				var customDataForColumns = MacrosDelegateUtil.getCustomData(oTable, "columns");
				customDataForColumns.customData.forEach(function(columnDef) {
					aProperties.push({
						name: columnDef.path,
						path: columnDef.path,
						label: columnDef.label,
						sortable: oSortRestrictionsInfo[columnDef.path]
							? oSortRestrictionsInfo[columnDef.path].sortable
							: columnDef.sortable,
						filterable: oFilterRestrictionsInfo[columnDef.path]
							? oFilterRestrictionsInfo[columnDef.path].filterable
							: columnDef.filterable,
						typeConfig: MacrosDelegateUtil.isTypeFilterable(columnDef.$Type)
							? oTable.getTypeUtil().getTypeConfig(columnDef.$Type)
							: undefined,
						maxConditions: ODataMetaModelUtil.isMultiValueFilterExpression(oFilterRestrictionsInfo.propertyInfo[columnDef.path])
							? -1
							: 1
					});
				});

				return aProperties;
			});
		};

		/**
		 * Updates the binding info with the relevant path and model from the metadata.
		 *
		 * @param {object} oMDCTable The MDC table instance
		 * @param {object} oMetadataInfo The metadataInfo set on the table
		 * @param {object} oBindingInfo The bindingInfo of the table
		 */
		ODataTableDelegate.updateBindingInfo = function(oMDCTable, oMetadataInfo, oBindingInfo) {
			TableDelegate.updateBindingInfo.apply(this, [oMDCTable, oMetadataInfo, oBindingInfo]);
			if (!oMDCTable) {
				return;
			}

			if (oMetadataInfo && oBindingInfo) {
				oBindingInfo.path = oBindingInfo.path || oMetadataInfo.collectionPath || "/" + oMetadataInfo.collectionName;
				oBindingInfo.model = oBindingInfo.model || oMetadataInfo.model;
			}
			// we add information to the binding by reading the more precise one we wrote in the customData
			//Object.assign(oBindingInfo, DelegateUtil.getCustomData(oMDCTable, "rowsBindingInfo"));

			if (!oBindingInfo) {
				oBindingInfo = {};
			}

			var oFilter = Core.byId(oMDCTable.getFilter()),
				bFilterEnabled = oMDCTable.isFilteringEnabled(),
				mConditions;
			var oInnerFilterInfo, oOuterFilterInfo;
			var aFilters = [];
			var aTableProperties = oMDCTable.data("$tablePropertyInfo");

			//TODO: consider a mechanism ('FilterMergeUtil' or enhance 'FilterUtil') to allow the connection between different filters)
			if (bFilterEnabled) {
				mConditions = oMDCTable.getConditions();
				oInnerFilterInfo = FilterUtil.getFilterInfo(oMDCTable, mConditions, aTableProperties);
				if (oInnerFilterInfo.filters) {
					aFilters.push(oInnerFilterInfo.filters);
				}
			}
			// if (!oBindingInfo.parameters) {
			// 	oBindingInfo.parameters = {};
			// }
			if (oFilter) {
				mConditions = oFilter.getConditions();
				if (mConditions) {
					var aParameterNames = DelegateUtil.getParameterNames(oFilter);
					oOuterFilterInfo = FilterUtil.getFilterInfo(oFilter, mConditions, aTableProperties, aParameterNames);

					if (oOuterFilterInfo.filters) {
						aFilters.push(oOuterFilterInfo.filters);
					}

					var sParameterPath = DelegateUtil.getParametersInfo(oFilter, mConditions);
					if (sParameterPath) {
						oBindingInfo.path = sParameterPath;
					}
				}

				// get the basic search
				oBindingInfo.parameters.$search = oFilter.getSearch() || undefined;
			}
			// add select to oBindingInfo (BCP 2170163012)
			oBindingInfo.parameters.$select = aTableProperties.reduce(function(sQuery, oProperty) {
				// Navigation properties (represented by X/Y) should not be added to $select.
				// ToDo : They should be added as $expand=X($select=Y) instead
				if (oProperty.path && oProperty.path.indexOf("/") === -1) {
					sQuery = sQuery ? sQuery + "," + oProperty.path : oProperty.path;
				}
				return sQuery;
			}, "");

			//If the entity is DraftEnabled add a DraftFilter
			if (ModelHelper.isDraftSupported(oMDCTable.getModel().getMetaModel(), oBindingInfo.path)) {
				aFilters.push(new Filter("IsActiveEntity", FilterOperator.EQ, true));
			}

			oBindingInfo.filters = new Filter(aFilters, true);
		};

		ODataTableDelegate.getFilterDelegate = function() {
			return FilterBarDelegate;
		};

		ODataTableDelegate.getTypeUtil = function(oPayload) {
			return TypeUtil;
		};

		ODataTableDelegate._getModel = function(oTable) {
			var oMetadataInfo = oTable.getDelegate().payload;
			return oTable.getModel(oMetadataInfo.model);
		};

		return ODataTableDelegate;
	}
);
