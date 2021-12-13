/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)
        (c) Copyright 2009-2021 SAP SE. All rights reserved
    
 */

// ---------------------------------------------------------------------------------------
// Helper class used to help create content in the table/column and fill relevant metadata
// ---------------------------------------------------------------------------------------
// ---------------------------------------------------------------------------------------
sap.ui.define(
	[
		"sap/fe/macros/table/delegates/TableDelegate",
		"sap/fe/macros/DelegateUtil",
		"sap/fe/core/formatters/ValueFormatter",
		"sap/fe/macros/ResourceModel"
	],
	function(TableDelegate, DelegateUtil, ValueFormatter, ResourceModel) {
		"use strict";

		/**
		 * Helper class for sap.ui.mdc.Table.
		 * <h3><b>Note:</b></h3>
		 * The class is experimental and the API/behaviour is not finalised and hence this should not be used for productive usage.
		 *
		 * @author SAP SE
		 * @private
		 * @experimental
		 * @since 1.69
		 * @alias sap.fe.macros.TableDelegate
		 */

		var GROUPHEADER_FORMATTERS_DATA_KEY = "sap_fe_AnalyticalTableDelegate_groupHeaderFormatterMap";

		var AnalyticalTableDelegate = Object.assign({}, TableDelegate, {
			_setCachedFormatInfos: function(oTable, mFormatInfos) {
				// do not cache during templating, else it becomes part of the cached view
				if (oTable instanceof window.Element) {
					return;
				}
				DelegateUtil.setCustomData(oTable, GROUPHEADER_FORMATTERS_DATA_KEY, mFormatInfos);
			},

			_getCachedFormatInfos: function(oTable) {
				// properties are not cached during templating
				if (oTable instanceof window.Element) {
					return null;
				}
				return DelegateUtil.getCustomData(oTable, GROUPHEADER_FORMATTERS_DATA_KEY);
			},

			/**
			 * Fetches the property extensions.
			 * TODO: document structure of the extension.
			 *
			 * @param {sap.ui.mdc.Table} oTable Instance of the MDC table
			 * @returns {Promise<object<string, object>>} Key-value map, where the key is the name of the property, and the value is the extension
			 * @protected
			 */
			fetchPropertyExtensions: function(oTable) {
				var mCustomAggregates = this._getAggregatedPropertyMap(oTable);

				return Promise.resolve(mCustomAggregates || {});
			},

			fetchProperties: function(oTable) {
				var aColumns = this.getColumnsFor(oTable);

				// Cache the group header formatter infos
				var mFormatInfos = {};
				aColumns.forEach(function(oColumn) {
					if (oColumn.textArrangement) {
						var oDescriptionColumn = aColumns.find(function(oCol) {
							return oCol.name === oColumn.textArrangement.textProperty;
						});
						if (oDescriptionColumn) {
							mFormatInfos[oColumn.name] = {
								mode: oColumn.textArrangement.mode,
								valueProperty: oColumn.relativePath,
								descriptionProperty: oDescriptionColumn.relativePath,
								label: oColumn.label
							};
						}
					}
				});

				this._setCachedFormatInfos(oTable, mFormatInfos);

				return TableDelegate.fetchProperties.apply(this, [oTable]);
			},

			fetchPropertiesForBinding: function(oTable) {
				var that = this;

				return DelegateUtil.fetchModel(oTable).then(function(oModel) {
					if (!oModel) {
						return [];
					}
					return that._getCachedOrFetchPropertiesForEntity(
						oTable,
						DelegateUtil.getCustomData(oTable, "entityType"),
						oModel.getMetaModel(),
						undefined,
						true
					);
				});
			},

			formatGroupHeader: function(oTable, oContext, sProperty) {
				var mFormatInfos = this._getCachedFormatInfos(oTable),
					oFormatInfo = mFormatInfos && mFormatInfos[sProperty],
					sResult;

				if (oFormatInfo) {
					var sValue;

					switch (oFormatInfo.mode) {
						case "Description":
							sValue = oContext.getProperty(oFormatInfo.descriptionProperty);
							break;

						case "DescriptionValue":
							sValue = ValueFormatter.formatWithBrackets(
								oContext.getProperty(oFormatInfo.descriptionProperty),
								oContext.getProperty(oFormatInfo.valueProperty)
							);
							break;

						case "ValueDescription":
							sValue = ValueFormatter.formatWithBrackets(
								oContext.getProperty(oFormatInfo.valueProperty),
								oContext.getProperty(oFormatInfo.descriptionProperty)
							);
							break;
					}

					sResult = ResourceModel.getText("M_TABLE_GROUP_HEADER_TITLE", [oFormatInfo.label, sValue]);
				}

				return sResult;
			}
		});

		return AnalyticalTableDelegate;
	},
	/* bExport= */ false
);
