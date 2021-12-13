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
		"sap/ui/model/json/JSONModel",
		"sap/fe/macros/CommonHelper",
		"sap/fe/macros/table/Utils",
		"sap/fe/core/CommonUtils",
		"sap/fe/core/helpers/ModelHelper",
		"sap/fe/macros/DelegateUtil",
		"sap/ui/model/Filter",
		"sap/base/Log",
		"sap/ui/mdc/odata/v4/TypeUtil",
		"sap/fe/macros/FilterBarDelegate",
		"sap/fe/core/helpers/ExcelFormatHelper",
		"sap/fe/macros/table/TableHelper",
		"sap/fe/macros/ResourceModel",
		"sap/base/util/deepClone",
		"sap/ui/mdc/odata/v4/TableDelegate"
	],
	function(
		JSONModel,
		CommonHelper,
		TableUtils,
		CommonUtils,
		ModelHelper,
		DelegateUtil,
		Filter,
		Log,
		TypeUtil,
		FilterBarDelegate,
		ExcelFormat,
		TableHelper,
		ResourceModel,
		deepClone,
		TableDelegateBase
	) {
		"use strict";

		var FETCHED_PROPERTIES_DATA_KEY = "sap_fe_TableDelegate_propertyInfoMap";
		var FilterRestrictions = CommonUtils.FilterRestrictions;

		function _isLineItem(oPropertyInfo) {
			return oPropertyInfo && oPropertyInfo.metadataPath.includes("@com.sap.vocabularies.UI.v1.LineItem");
		}

		function _setCachedProperties(oTable, aFetchedProperties, bUseAdditionalProperties) {
			// do not cache during templating, else it becomes part of the cached view
			if (oTable instanceof window.Element) {
				return;
			}
			var key = bUseAdditionalProperties ? FETCHED_PROPERTIES_DATA_KEY + "_add" : FETCHED_PROPERTIES_DATA_KEY;
			DelegateUtil.setCustomData(oTable, key, aFetchedProperties);
		}

		function _getCachedProperties(oTable, bUseAdditionalProperties) {
			// properties are not cached during templating
			if (oTable instanceof window.Element) {
				return null;
			}
			var key = bUseAdditionalProperties ? FETCHED_PROPERTIES_DATA_KEY + "_add" : FETCHED_PROPERTIES_DATA_KEY;
			return DelegateUtil.getCustomData(oTable, key);
		}

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
		var ODataTableDelegate = Object.assign({}, TableDelegateBase, {
			getColumnsFor: function(oTable) {
				return CommonHelper.parseCustomData(DelegateUtil.getCustomData(oTable, "columns"));
			},

			_getAggregatedPropertyMap: function(oTable) {
				return CommonHelper.parseCustomData(DelegateUtil.getCustomData(oTable, "aggregates") || {});
			},

			_fetchPropertyInfo: function(oMetaModel, oColumnInfo, oTable, oAppComponent, bUseAdditionalProperties) {
				var sAbsoluteNavigationPath = oColumnInfo.annotationPath,
					oDataField = oMetaModel.getObject(oColumnInfo.annotationPath),
					oNavigationContext = oMetaModel.createBindingContext(sAbsoluteNavigationPath),
					oTypeConfig =
						oColumnInfo.typeConfig &&
						oColumnInfo.typeConfig.className &&
						DelegateUtil.isTypeFilterable(oColumnInfo.typeConfig.className)
							? TypeUtil.getTypeConfig(
									oColumnInfo.typeConfig.className,
									oColumnInfo.typeConfig.oFormatOptions,
									oColumnInfo.typeConfig.oConstraints
							  )
							: undefined,
					sDescription = null, // TODO this was erroneous - better having it empty for now
					bFilterable = CommonHelper.isPropertyFilterable(oColumnInfo.relativePath, { context: oNavigationContext }, oDataField),
					bComplexType = oColumnInfo.typeConfig && oColumnInfo.typeConfig.className.indexOf("Edm.") !== 0,
					sLabel = oColumnInfo.isDataPointFakeTargetProperty
						? ResourceModel.getText("TargetValue")
						: DelegateUtil.getLocalizedText(oColumnInfo.label, oAppComponent || oTable),
					bIsAnalyticalTable = DelegateUtil.getCustomData(oTable, "enableAnalytics") === "true",
					aAggregatedPropertyMapUnfilterable = bIsAnalyticalTable ? this._getAggregatedPropertyMap(oTable) : {},
					oExportSettings = oColumnInfo.exportSettings,
					exportFormat =
						oColumnInfo.typeConfig && oColumnInfo.typeConfig.className
							? this._getExportFormat(oColumnInfo.typeConfig.className)
							: undefined;

				if (oExportSettings) {
					if (exportFormat) {
						oExportSettings.format = exportFormat;
					}
					// Set the exportSettings template only if it exists.
					if (oExportSettings.template) {
						oExportSettings.template = oColumnInfo.exportSettings.template;
					}
					// Set the exportSettings label only if it exists.
					if (oExportSettings.label) {
						var sFieldGroupExportLabel = oExportSettings.label
							? DelegateUtil.getLocalizedText(oColumnInfo.exportSettings.label, oTable)
							: undefined;
						if (
							sFieldGroupExportLabel !== undefined &&
							!sap.ui
								.getCore()
								.getConfiguration()
								.getRTL()
						) {
							sLabel = sFieldGroupExportLabel + " - " + sLabel;
						} else {
							sLabel = sLabel + " - " + sFieldGroupExportLabel;
						}
					}
				}

				var oPropertyInfo = {
					name: oColumnInfo.name,
					metadataPath: sAbsoluteNavigationPath,
					groupLabel: oColumnInfo.groupLabel,
					group: oColumnInfo.group,
					label: sLabel,
					description: sDescription || sLabel,
					maxLength: oNavigationContext.$MaxLength,
					precision: oNavigationContext.$Precision,
					scale: oNavigationContext.$Scale,
					typeConfig: oTypeConfig,
					visible: oColumnInfo.availability !== "Hidden" && !bComplexType,
					exportSettings: oExportSettings,
					unit: oColumnInfo.unit
				};

				// Set visualSettings only if it exists
				if (oColumnInfo.visualSettings && Object.keys(oColumnInfo.visualSettings).length > 0) {
					oPropertyInfo.visualSettings = oColumnInfo.visualSettings;
				}
				if (exportFormat) {
					// For properties with date/time/dateTime data types, a gap needs to be added to properly render the column width on edit mode
					oPropertyInfo.visualSettings = { widthCalculation: { gap: 3 } };
				}

				// MDC expects  'propertyInfos' only for complex properties.
				// An empty array throws validation error and undefined value is unhandled.
				if (oColumnInfo.propertyInfos && oColumnInfo.propertyInfos.length) {
					oPropertyInfo.propertyInfos = oColumnInfo.propertyInfos;
					//only in case of complex properties, wrap the cell content	on the excel exported file
					oPropertyInfo.exportSettings.wrap = oColumnInfo.exportSettings.wrap;
					if (bUseAdditionalProperties && oColumnInfo.additionalPropertyInfos && oColumnInfo.additionalPropertyInfos.length) {
						oPropertyInfo.propertyInfos = oPropertyInfo.propertyInfos.concat(oColumnInfo.additionalPropertyInfos);
					}
				} else {
					// Add properties which are supported only by simple PropertyInfos.
					oPropertyInfo.path = oColumnInfo.relativePath;
					// TODO with the new complex property info, a lot of "Description" fields are added as filter/sort fields
					oPropertyInfo.sortable =
						oColumnInfo.sortable &&
						// TODO sorting by association properties is not supported by CAP/RAP (the created query is correct OData syntax)
						!oColumnInfo.relativePath.includes("/");
					oPropertyInfo.filterable =
						!oColumnInfo.isDataPointFakeTargetProperty &&
						bFilterable &&
						// TODO ignoring all properties that are not also available for adaptation for now, but proper concept required
						!oColumnInfo.relativePath.includes("/") &&
						(!bIsAnalyticalTable || !aAggregatedPropertyMapUnfilterable[oPropertyInfo.name]);
					oPropertyInfo.key = oColumnInfo.isKey;
					oPropertyInfo.groupable = oColumnInfo.isGroupable;
					oPropertyInfo.text = oColumnInfo.textArrangement && oColumnInfo.textArrangement.textProperty;
					oPropertyInfo.caseSensitive = oColumnInfo.caseSensitive;
				}

				return oPropertyInfo;
			},

			_fetchCustomPropertyInfo: function(oColumnInfo, oTable, oAppComponent) {
				var sLabel = DelegateUtil.getLocalizedText(oColumnInfo.header, oAppComponent || oTable); // Todo: To be removed once MDC provides translation support
				var oPropertyInfo = {
					name: oColumnInfo.name,
					groupLabel: null,
					group: null,
					label: sLabel,
					description: sLabel, // property?
					maxLength: undefined, // TBD
					precision: undefined, // TBD
					scale: undefined, // TBD
					type: "Edm.String", // TBD
					visible: oColumnInfo.availability !== "Hidden",
					exportSettings: {
						template: oColumnInfo.exportSettings.template
					}
				};

				// MDC expects 'propertyInfos' only for complex properties.
				// An empty array throws validation error and undefined value is unhandled.
				if (oColumnInfo.propertyInfos && oColumnInfo.propertyInfos.length) {
					oPropertyInfo.propertyInfos = oColumnInfo.propertyInfos;
					//only in case of complex properties, wrap the cell content on the excel exported file
					oPropertyInfo.exportSettings.wrap = oColumnInfo.exportSettings.wrap;
				} else {
					// Add properties which are supported only by simple PropertyInfos.
					oPropertyInfo.path = oColumnInfo.name;
					oPropertyInfo.sortable = false;
					oPropertyInfo.filterable = false;
				}
				return oPropertyInfo;
			},

			_fetchPropertiesForEntity: function(oTable, sEntityTypePath, oMetaModel, oAppComponent, bUseAdditionalProperties) {
				// when fetching properties, this binding context is needed - so lets create it only once and use if for all properties/data-fields/line-items
				var sBindingPath = ModelHelper.getEntitySetPath(sEntityTypePath),
					aFetchedProperties = [],
					oFR = CommonUtils.getFilterRestrictionsByPath(sBindingPath, oMetaModel),
					aNonFilterableProps = oFR[FilterRestrictions.NON_FILTERABLE_PROPERTIES],
					mAllowedExpressions = oFR[FilterRestrictions.ALLOWED_EXPRESSIONS],
					that = this;

				return Promise.resolve(that.getColumnsFor(oTable)).then(function(aColumns) {
					// DraftAdministrativeData does not work via 'entitySet/$NavigationPropertyBinding/DraftAdministrativeData'
					if (!aColumns) {
						return Promise.resolve([]);
					}
					var oPropertyInfo;
					aColumns.forEach(function(oColumnInfo) {
						if (oColumnInfo.formatOptions && oColumnInfo.formatOptions.hasDraftIndicator) {
							var oInternalBindingContext = oTable.getBindingContext("internal");
							var sInternalPath = oInternalBindingContext && oInternalBindingContext.getPath();
							if (
								oInternalBindingContext &&
								oInternalBindingContext.getProperty(sInternalPath + "/semanticKeyHasDraftIndicator") === undefined
							) {
								oInternalBindingContext.setProperty(sInternalPath + "/semanticKeyHasDraftIndicator", oColumnInfo.name);
							}
						}

						switch (oColumnInfo.type) {
							case "Annotation":
								oPropertyInfo = that._fetchPropertyInfo(
									oMetaModel,
									oColumnInfo,
									oTable,
									oAppComponent,
									bUseAdditionalProperties
								);
								if (oPropertyInfo && aNonFilterableProps.indexOf(oPropertyInfo.name) === -1) {
									if (mAllowedExpressions[oPropertyInfo.name]) {
										oPropertyInfo.filterExpression = CommonUtils.getSpecificAllowedExpression(
											mAllowedExpressions[oPropertyInfo.name]
										);
									} else {
										oPropertyInfo.filterExpression = "auto"; // default
									}
									oPropertyInfo.maxConditions = DelegateUtil.isMultiValue(oPropertyInfo) ? -1 : 1;
								}
								break;
							case "Slot":
							case "Default":
								oPropertyInfo = that._fetchCustomPropertyInfo(oColumnInfo, oTable, oAppComponent);
								break;
							default:
								throw new Error("unhandled switch case " + oColumnInfo.type);
						}
						aFetchedProperties.push(oPropertyInfo);
					});

					// Set the 'unit' property on the propertyInfos that need one
					aFetchedProperties.forEach(function(oPropertyInfo) {
						var sUnitName =
							oPropertyInfo.path && oPropertyInfo.exportSettings ? oPropertyInfo.exportSettings.unitProperty : undefined;
						if (sUnitName) {
							// Find the propertyInfo corresponding to the unit
							var oUnitPropertyInfo = aFetchedProperties.find(function(oProp) {
								return oProp.path === sUnitName;
							});
							if (oUnitPropertyInfo) {
								oPropertyInfo.unit = oUnitPropertyInfo.name;
							}
						}
					});

					return aFetchedProperties;
				});
			},

			_getCachedOrFetchPropertiesForEntity: function(oTable, sEntityTypePath, oMetaModel, oAppComponent, bUseAdditionalProperties) {
				var aFetchedProperties = _getCachedProperties(oTable, bUseAdditionalProperties);

				if (aFetchedProperties) {
					return Promise.resolve(aFetchedProperties);
				}
				return this._fetchPropertiesForEntity(oTable, sEntityTypePath, oMetaModel, oAppComponent, bUseAdditionalProperties).then(
					function(aFetchedProperties) {
						_setCachedProperties(oTable, aFetchedProperties, bUseAdditionalProperties);
						return aFetchedProperties;
					}
				);
			},

			_setTableNoDataText: function(oTable, oBindingInfo) {
				var sNoDataKey = "",
					oTableFilterInfo = TableUtils.getAllFilterInfo(oTable),
					suffixResourceKey = oBindingInfo.path.substr(1);

				var _getNoDataTextWithFilters = function() {
					if (oTable.data("hiddenFilters") || oTable.data("quickFilterKey")) {
						return "M_OP_TABLE_AND_CHART_NO_DATA_TEXT_WITH_FILTER_MULTI_VIEW";
					} else {
						return "T_OP_TABLE_AND_CHART_NO_DATA_TEXT_WITH_FILTER";
					}
				};
				var sFilterAssociation = oTable.getFilter();

				if (sFilterAssociation && !/BasicSearch$/.test(sFilterAssociation)) {
					// check if a FilterBar is associated to the Table (basic search on toolBar is excluded)
					if (oTableFilterInfo.search || (oTableFilterInfo.filters && oTableFilterInfo.filters.length)) {
						// check if table has any Filterbar filters or personalization filters
						sNoDataKey = _getNoDataTextWithFilters();
					} else {
						sNoDataKey = "T_OP_TABLE_AND_CHART_NO_DATA_TEXT";
					}
				} else {
					if (oTableFilterInfo.search || (oTableFilterInfo.filters && oTableFilterInfo.filters.length)) {
						//check if table has any personalization filters
						sNoDataKey = _getNoDataTextWithFilters();
					} else {
						sNoDataKey = "M_OP_TABLE_AND_CHART_OP_NO_FILTERS_NO_DATA_TEXT";
					}
				}
				if (sNoDataKey === "T_OP_TABLE_AND_CHART_NO_DATA_TEXT_WITH_FILTER" || sNoDataKey === "T_OP_TABLE_AND_CHART_NO_DATA_TEXT") {
					return oTable
						.getModel("sap.fe.i18n")
						.getResourceBundle()
						.then(function(oResourceBundle) {
							oTable.setNoDataText(CommonUtils.getTranslatedText(sNoDataKey, oResourceBundle, null, suffixResourceKey));
						})
						.catch(function(error) {
							Log.error(error);
						});
				} else {
					if (ResourceModel) {
						oTable.setNoDataText(ResourceModel.getText(sNoDataKey));
					}
				}
			},

			handleTableDataReceived: function(oTable, oInternalModelContext) {
				var oBinding = oTable && oTable.getRowBinding(),
					bDataReceivedAttached = oInternalModelContext && oInternalModelContext.getProperty("dataReceivedAttached");

				if (oInternalModelContext && !bDataReceivedAttached) {
					oBinding.attachDataReceived(function() {
						TableHelper.handleTableDeleteEnablementForSideEffects(oTable, oInternalModelContext);
						// Refresh the selected contexts to trigger re-calculation of enabled state of actions.
						oInternalModelContext.setProperty("selectedContexts", []);
						var aSelectedContexts = oTable.getSelectedContexts();
						oInternalModelContext.setProperty("selectedContexts", aSelectedContexts);
						oInternalModelContext.setProperty("numberOfSelectedContexts", aSelectedContexts.length);
					});
					oInternalModelContext.setProperty("dataReceivedAttached", true);
				}
			},

			rebindTable: function(oTable, oBindingInfo) {
				if (!oTable.data("controlHidden")) {
					TableUtils.clearSelection(oTable);
					TableDelegateBase.rebindTable.apply(this, [oTable, oBindingInfo]);
					TableUtils.onTableBound(oTable);
					this._setTableNoDataText(oTable, oBindingInfo);
					TableUtils.whenBound(oTable)
						.then(this.handleTableDataReceived(oTable, oTable.getBindingContext("internal")))
						.catch(function(oError) {
							Log.error("Error while waiting for the table to be bound", oError);
						});
				}
			},

			/**
			 * Fetches the relevant metadata for the table and returns property info array.
			 *
			 * @param {object} oTable Instance of the mdc Table
			 * @returns {Array} Array of property info
			 */
			fetchProperties: function(oTable) {
				var that = this;

				return DelegateUtil.fetchModel(oTable).then(function(oModel) {
					if (!oModel) {
						return [];
					}
					return that._getCachedOrFetchPropertiesForEntity(
						oTable,
						DelegateUtil.getCustomData(oTable, "entityType"),
						oModel.getMetaModel()
					);
				});
			},

			updateBindingInfo: function(oTable, oMetadataInfo, oBindingInfo) {
				TableDelegateBase.updateBindingInfo.apply(this, [oTable, oMetadataInfo, oBindingInfo]);
				if (!oTable.data("controlHidden")) {
					this._internalUpdateBindingInfo(oTable, oMetadataInfo, oBindingInfo);

					this._setTableNoDataText(oTable, oBindingInfo);
				}
			},

			_manageSemanticTargets: function(oMDCTable) {
				var oRowBinding = oMDCTable.getRowBinding();
				if (oRowBinding) {
					oRowBinding.attachEventOnce("dataRequested", function() {
						setTimeout(function() {
							var _oView = sap.ui.fl.Utils.getViewForControl(oMDCTable);
							if (_oView) {
								TableUtils.getSemanticTargetsFromTable(_oView.getController(), oMDCTable);
							}
						}, 0);
					});
				}
			},

			updateBinding: function(oTable, oBindingInfo, oBinding) {
				TableDelegateBase.updateBinding.apply(this, [oTable, oBindingInfo, oBinding]);
				oTable.fireEvent("bindingUpdated");
				this._manageSemanticTargets(oTable);
			},

			_internalUpdateBindingInfo: function(oTable, oMetadataInfo, oBindingInfo) {
				// We need to deepClone the info we get from the custom data, otherwise some of its subobjects (e.g. parameters) will
				// be shared with oBindingInfo and modified later (Object.assign only does a shallow clone)
				Object.assign(oBindingInfo, deepClone(DelegateUtil.getCustomData(oTable, "rowsBindingInfo")));
				/**
				 * Binding info might be suspended at the beginning when the first bindRows is called:
				 * To avoid duplicate requests but still have a binding to create new entries.				 *
				 * After the initial binding step, follow up bindings should not longer be suspended.
				 */
				if (oTable.getRowBinding()) {
					oBindingInfo.suspended = false;
				}

				var oFilter;
				var oFilterInfo = TableUtils.getAllFilterInfo(oTable);
				// Prepare binding info with filter/search parameters
				if (oFilterInfo.filters.length > 0) {
					oFilter = new Filter({ filters: oFilterInfo.filters, and: true });
				}
				if (oFilterInfo.bindingPath) {
					oBindingInfo.path = oFilterInfo.bindingPath;
				}

				var oDataStateIndicator = oTable.getDataStateIndicator();
				if (oDataStateIndicator && oDataStateIndicator.isFiltering()) {
					// Include filters on messageStrip
					if (oBindingInfo.filters.length > 0) {
						oFilter = new Filter({ filters: oBindingInfo.filters.concat(oFilterInfo.filters), and: true });
						TableUtils.updateBindingInfo(oBindingInfo, oFilterInfo, oFilter);
					}
				} else {
					TableUtils.updateBindingInfo(oBindingInfo, oFilterInfo, oFilter);
				}
			},

			_templateCustomColumnFragment: function(oColumnInfo, oView, oModifier, sTableId) {
				var oColumnModel = new JSONModel(oColumnInfo),
					oThis = new JSONModel({
						id: sTableId
					}),
					oPreprocessorSettings = {
						bindingContexts: {
							"this": oThis.createBindingContext("/"),
							"column": oColumnModel.createBindingContext("/")
						},
						models: {
							"this": oThis,
							"column": oColumnModel
						}
					};

				return DelegateUtil.templateControlFragment(
					"sap.fe.macros.table.CustomColumn",
					oPreprocessorSettings,
					{ view: oView },
					oModifier
				).then(function(oItem) {
					oColumnModel.destroy();
					return oItem;
				});
			},

			_getExportFormat: function(dataType) {
				switch (dataType) {
					case "Edm.Date":
						return ExcelFormat.getExcelDatefromJSDate();
					case "Edm.DateTimeOffset":
						return ExcelFormat.getExcelDateTimefromJSDateTime();
					case "Edm.TimeOfDay":
						return ExcelFormat.getExcelTimefromJSTime();
					default:
						return undefined;
				}
			},

			_getVHRelevantFields: function(oMetaModel, sMetadataPath, sBindingPath) {
				var aFields = [],
					oDataFieldData = oMetaModel.getObject(sMetadataPath),
					that = this;

				if (oDataFieldData.$kind && oDataFieldData.$kind === "Property") {
					oDataFieldData = oMetaModel.getObject(sMetadataPath + "@com.sap.vocabularies.UI.v1.DataFieldDefault");
					sMetadataPath = sMetadataPath + "@com.sap.vocabularies.UI.v1.DataFieldDefault";
				}
				switch (oDataFieldData.$Type) {
					case "com.sap.vocabularies.UI.v1.DataFieldForAnnotation":
						if (
							oMetaModel
								.getObject(sMetadataPath + "/Target/$AnnotationPath")
								.includes("com.sap.vocabularies.UI.v1.FieldGroup")
						) {
							oMetaModel.getObject(sMetadataPath + "/Target/$AnnotationPath/Data").forEach(function(oValue, iIndex) {
								aFields = aFields.concat(
									that._getVHRelevantFields(oMetaModel, sMetadataPath + "/Target/$AnnotationPath/Data/" + iIndex)
								);
							});
						}
						break;
					case "com.sap.vocabularies.UI.v1.DataFieldWithNavigationPath":
					case "com.sap.vocabularies.UI.v1.DataFieldWithUrl":
					case "com.sap.vocabularies.UI.v1.DataField":
						aFields.push(oMetaModel.getObject(sMetadataPath + "/Value/$Path"));
						break;
					case "com.sap.vocabularies.UI.v1.DataFieldForAction":
					case "com.sap.vocabularies.UI.v1.DataFieldForIntentBasedNavigation":
						break;
					default:
						// property
						// temporary workaround to make sure VH relevant field path do not contain the bindingpath
						if (sMetadataPath.indexOf(sBindingPath) === 0) {
							aFields.push(sMetadataPath.substring(sBindingPath.length + 1));
							break;
						}
						aFields.push(CommonHelper.getNavigationPath(sMetadataPath, true));
						break;
				}
				return aFields;
			},
			_setDraftIndicatorOnVisibleColumn: function(oTable, oColumnInfo) {
				var aColumns = this.getColumnsFor(oTable);
				if (aColumns) {
					var oInternalBindingContext = oTable.getBindingContext("internal");
					var sInternalPath = oInternalBindingContext.getPath();
					var aColumnsWithDraftIndicator = aColumns.filter(function(oColumn) {
						return oColumn.formatOptions && oColumn.formatOptions.hasDraftIndicator;
					});
					var aVisibleColumns = oTable.getColumns();
					var sAddVisibleColumnName, sVisibleColumnName, bFoundColumnVisibleWithDraft, sColumnNameWithDraftIndicator;
					for (var i = 0; i < aVisibleColumns.length; i++) {
						sVisibleColumnName = aVisibleColumns[i].getDataProperty();
						for (var j = 0; j < aColumnsWithDraftIndicator.length; j++) {
							sColumnNameWithDraftIndicator = aColumnsWithDraftIndicator[j].name;
							if (sVisibleColumnName === sColumnNameWithDraftIndicator) {
								bFoundColumnVisibleWithDraft = true;
								break;
							}
							if (oColumnInfo && oColumnInfo.name === sColumnNameWithDraftIndicator) {
								sAddVisibleColumnName = oColumnInfo.name;
							}
						}
						if (bFoundColumnVisibleWithDraft) {
							oInternalBindingContext.setProperty(sInternalPath + "/semanticKeyHasDraftIndicator", sVisibleColumnName);
							break;
						}
					}
					if (!bFoundColumnVisibleWithDraft && sAddVisibleColumnName) {
						oInternalBindingContext.setProperty(sInternalPath + "/semanticKeyHasDraftIndicator", sAddVisibleColumnName);
					}
				}
			},
			removeItem: function(oPropertyInfoName, oTable, mPropertyBag) {
				var doRemoveItem = true;
				var oModifier = mPropertyBag.modifier;
				var sDataProperty = oModifier.getProperty(oPropertyInfoName, "dataProperty");
				if (sDataProperty && sDataProperty.indexOf && sDataProperty.indexOf("InlineXML") !== -1) {
					oModifier.insertAggregation(oTable, "dependents", oPropertyInfoName);
					doRemoveItem = false;
				}
				this._setDraftIndicatorOnVisibleColumn(oTable);
				return Promise.resolve(doRemoveItem);
			},
			/**
			 * Invoked when a column is added using the table personalization dialog.
			 *
			 * @param {string} sPropertyInfoName Name of the property for which the column is added
			 * @param {sap.ui.mdc.Table} oTable Instance of table control
			 * @param {map} mPropertyBag Instance of property bag from the flexibility API
			 * @returns {Promise} Once resolved, a table column definition is returned
			 */
			addItem: function(sPropertyInfoName, oTable, mPropertyBag) {
				var oMetaModel = mPropertyBag.appComponent && mPropertyBag.appComponent.getModel().getMetaModel(),
					oModifier = mPropertyBag.modifier,
					sTableId = oModifier.getId(oTable),
					sPath,
					sGroupId,
					pValueHelp,
					oTableContext,
					oColumnInfo,
					oPropertyContext,
					oPropertyInfo,
					oParameters,
					aVHProperties,
					sEntityTypePath,
					aColumns = this.getColumnsFor(oTable),
					that = this;

				oColumnInfo = aColumns.find(function(oColumn) {
					return oColumn.name === sPropertyInfoName;
				});
				if (!oColumnInfo) {
					Log.error(sPropertyInfoName + " not found while adding column");
					return Promise.resolve(null);
				}
				this._setDraftIndicatorOnVisibleColumn(oTable, oColumnInfo);
				// render custom column
				if (oColumnInfo.type === "Default") {
					return this._templateCustomColumnFragment(oColumnInfo, mPropertyBag.view, oModifier, sTableId);
				}

				if (oColumnInfo.type === "Slot") {
					var aDependents = oModifier.getAggregation(oTable, "dependents");
					var oTarget;
					aDependents.forEach(function(oDependent) {
						var sDataProperty = oModifier.getProperty(oDependent, "dataProperty");
						if (sPropertyInfoName === sDataProperty) {
							oTarget = oDependent;
						}
					});
					if (oTarget) {
						return Promise.resolve(oTarget);
					}
				}
				// fall-back
				if (!oMetaModel) {
					return Promise.resolve(null);
				}

				return Promise.resolve()
					.then(DelegateUtil.getCustomData.bind(DelegateUtil, oTable, "metaPath", oModifier))
					.then(function(sRetrievedPath) {
						sPath = sRetrievedPath;
						return DelegateUtil.getCustomData(oTable, "entityType", oModifier);
					})
					.then(function(sRetrievedEntityTypePath) {
						sEntityTypePath = sRetrievedEntityTypePath;
						return DelegateUtil.getCustomData(oTable, "requestGroupId", oModifier);
					})
					.then(
						function(sRetrievedGroupId) {
							sGroupId = sRetrievedGroupId || undefined;
							oTableContext = oMetaModel.createBindingContext(sPath);

							// 1. check if this column has value help
							// 2. check if there is already a value help existing which can be re-used for the new column added

							return this._getCachedOrFetchPropertiesForEntity(
								oTable,
								sEntityTypePath,
								oMetaModel,
								mPropertyBag.appComponent
							).then(function(aFetchedProperties) {
								oPropertyInfo = aFetchedProperties.find(function(oInfo) {
									return oInfo.name === sPropertyInfoName;
								});

								oPropertyContext = oMetaModel.createBindingContext(oPropertyInfo.metadataPath);
								aVHProperties = that._getVHRelevantFields(oMetaModel, oPropertyInfo.metadataPath, sPath);
								oParameters = {
									sBindingPath: sPath,
									sValueHelpType: "TableValueHelp",
									oControl: oTable,
									oMetaModel: oMetaModel,
									oModifier: oModifier,
									oPropertyInfo: oPropertyInfo
								};
								pValueHelp = Promise.all(
									aVHProperties.map(function(sPropertyName) {
										var mParameters = Object.assign({}, oParameters, { sPropertyName: sPropertyName });

										return Promise.all([
											DelegateUtil.isValueHelpRequired(mParameters),
											DelegateUtil.doesValueHelpExist(mParameters)
										]).then(function(aResults) {
											var bValueHelpRequired = aResults[0],
												bValueHelpExists = aResults[1];
											if (bValueHelpRequired && !bValueHelpExists) {
												return fnTemplateValueHelp("sap.fe.macros.table.ValueHelp");
											}
											return Promise.resolve();
										});
									})
								);

								function fnTemplateValueHelp(sFragmentName) {
									var oThis = new JSONModel({
											id: sTableId,
											requestGroupId: sGroupId
										}),
										oPreprocessorSettings = {
											bindingContexts: {
												"this": oThis.createBindingContext("/"),
												"dataField": oPropertyContext
											},
											models: {
												"this": oThis,
												"dataField": oMetaModel,
												metaModel: oMetaModel
											}
										};

									return DelegateUtil.templateControlFragment(sFragmentName, oPreprocessorSettings, {}, oModifier)
										.then(function(oValueHelp) {
											if (oValueHelp) {
												return oModifier.insertAggregation(oTable, "dependents", oValueHelp, 0);
											}
										})
										.catch(function(oError) {
											//We always resolve the promise to ensure that the app does not crash
											Log.error("ValueHelp not loaded : " + oError.message);
											return Promise.resolve(null);
										})
										.finally(function() {
											oThis.destroy();
										});
								}

								function fnTemplateFragment(oPropertyInfo, oView) {
									var sFragmentName = _isLineItem(oPropertyInfo)
										? "sap.fe.macros.table.Column"
										: "sap.fe.macros.table.ColumnProperty";

									var bDisplayMode;
									var sTableTypeCustomData;
									var sOnChangeCustomData;
									var sCreationModeCustomData;

									return Promise.all([
										DelegateUtil.getCustomData(oTable, "displayModePropertyBinding", oModifier),
										DelegateUtil.getCustomData(oTable, "tableType", oModifier),
										DelegateUtil.getCustomData(oTable, "onChange", oModifier),
										DelegateUtil.getCustomData(oTable, "creationMode", oModifier)
									]).then(function(aCustomData) {
										bDisplayMode = aCustomData[0];
										sTableTypeCustomData = aCustomData[1];
										sOnChangeCustomData = aCustomData[2];
										sCreationModeCustomData = aCustomData[3];
										// Read Only and Column Edit Mode can both have three state
										// Undefined means that the framework decides what to do
										// True / Display means always read only
										// False / Editable means editable but while still respecting the low level principle (immutable property will not be editable)
										var columnEditMode;
										if (bDisplayMode !== undefined) {
											bDisplayMode = typeof bDisplayMode === "boolean" ? bDisplayMode : bDisplayMode === "true";
											columnEditMode = bDisplayMode ? "Display" : "Editable";
										}

										var oThis = new JSONModel({
												readOnly: bDisplayMode,
												columnEditMode: columnEditMode,
												tableType: sTableTypeCustomData,
												onChange: sOnChangeCustomData,
												id: sTableId,
												navigationPropertyPath: sPropertyInfoName,
												columnInfo: oColumnInfo,
												collection: {
													sPath: sPath,
													oModel: oMetaModel
												},
												creationMode: sCreationModeCustomData
											}),
											oPreprocessorSettings = {
												bindingContexts: {
													"entitySet": oTableContext,
													"collection": oTableContext,
													"dataField": oPropertyContext,
													"this": oThis.createBindingContext("/"),
													"column": oThis.createBindingContext("/columnInfo")
												},
												models: {
													"this": oThis,
													"entitySet": oMetaModel,
													"collection": oMetaModel,
													"dataField": oMetaModel,
													metaModel: oMetaModel,
													"column": oThis
												}
											};

										return DelegateUtil.templateControlFragment(
											sFragmentName,
											oPreprocessorSettings,
											{ view: oView },
											oModifier
										).finally(function() {
											oThis.destroy();
										});
									});
								}

								return pValueHelp.then(fnTemplateFragment.bind(this, oPropertyInfo, mPropertyBag.view));
							});
						}.bind(this)
					);
			},

			/**
			 * Provide the Table's filter delegate to provide basic filter functionality such as adding FilterFields.
			 *
			 * @returns {object} Object for the Tables filter personalization.
			 */
			getFilterDelegate: function() {
				return Object.assign({}, FilterBarDelegate, {
					addItem: function(sPropertyInfoName, oParentControl) {
						if (sPropertyInfoName.indexOf("Property::") === 0) {
							// Correct the name of complex property info references.
							sPropertyInfoName = sPropertyInfoName.replace("Property::", "");
						}
						return FilterBarDelegate.addItem(sPropertyInfoName, oParentControl);
					}
				});
			},

			/**
			 * Returns the typeutil attached to this delegate.
			 *
			 * @param {object} oPayload Delegate payload object
			 * @returns {sap.ui.mdc.util.TypeUtil} Any instance of TypeUtil
			 */
			getTypeUtil: function(oPayload) {
				return TypeUtil;
			}
		});

		return ODataTableDelegate;
	},
	/* bExport= */ false
);
