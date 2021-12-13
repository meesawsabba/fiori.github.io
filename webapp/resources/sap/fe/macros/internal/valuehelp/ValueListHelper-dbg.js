/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)
        (c) Copyright 2009-2021 SAP SE. All rights reserved
    
 */
/* global Promise */
sap.ui.define(
	[
		"sap/ui/thirdparty/jquery",
		"sap/ui/core/XMLTemplateProcessor",
		"sap/ui/model/json/JSONModel",
		"sap/ui/core/util/XMLPreprocessor",
		"sap/ui/core/Fragment",
		"sap/ui/mdc/field/InParameter",
		"sap/ui/mdc/field/OutParameter",
		"sap/base/Log",
		"sap/ui/dom/units/Rem",
		"sap/fe/core/BusyLocker",
		"sap/fe/core/actions/messageHandling",
		"sap/ui/model/Filter",
		"sap/ui/model/FilterOperator",
		"sap/ui/model/FilterType",
		"sap/fe/core/helpers/ModelHelper",
		"sap/fe/core/CommonUtils",
		"sap/ui/mdc/odata/v4/ODataMetaModelUtil"
		//Just to be loaded for templating
		//"sap/ui/mdc/field/FieldValueHelp"
	],
	function(
		jQuery,
		XMLTemplateProcessor,
		JSONModel,
		XMLPreprocessor,
		Fragment,
		InParameter,
		OutParameter,
		Log,
		Rem,
		BusyLocker,
		messageHandling,
		Filter,
		FilterOperator,
		FilterType,
		ModelHelper,
		CommonUtils,
		ODataMetaModelUtil
	) {
		"use strict";
		var waitForPromise = {};
		var aCachedValueHelp = [];
		var aSuggestCachedValueHelp = [];

		function _hasImportanceHigh(oValueListContext) {
			return oValueListContext.Parameters.some(function(oParameter) {
				return (
					oParameter["@com.sap.vocabularies.UI.v1.Importance"] &&
					oParameter["@com.sap.vocabularies.UI.v1.Importance"].$EnumMember === "com.sap.vocabularies.UI.v1.ImportanceType/High"
				);
			});
		}

		function _entityIsSearchable(oValueListInfo) {
			var oCollectionAnnotations =
					oValueListInfo.valueListInfo.$model.getMetaModel().getObject("/" + oValueListInfo.valueListInfo.CollectionPath + "@") ||
					{},
				bSearchable =
					oCollectionAnnotations["@Org.OData.Capabilities.V1.SearchRestrictions"] &&
					oCollectionAnnotations["@Org.OData.Capabilities.V1.SearchRestrictions"].Searchable;
			return bSearchable === undefined ? true : bSearchable;
		}

		function _getCachedValueHelp(sValueHelpId) {
			return aCachedValueHelp.find(function(oVHElement) {
				return oVHElement.sVHId === sValueHelpId;
			});
		}
		function _getSuggestCachedValueHelp(sValueHelpId) {
			return aSuggestCachedValueHelp.find(function(oVHElement) {
				return oVHElement.sVHId === sValueHelpId;
			});
		}

		function _redundantDescription(oValueList, oVLParameter, bIsDropDownListe) {
			var oMetaModel = oValueList.$model.getMetaModel(),
				oPropertyAnnotations,
				sDescriptionPath,
				bIsTextOnly,
				aRelevantColumn,
				sRedundantColumn;
			var bFindRedundantColumn =
				oMetaModel.getObject(
					"/" + oValueList.CollectionPath + "/" + oVLParameter.ValueListProperty + "@com.sap.vocabularies.UI.v1.Hidden"
				) === true
					? false
					: true;
			var bConsiderImportanceHigh =
				bFindRedundantColumn &&
				!bIsDropDownListe &&
				_hasImportanceHigh(oValueList) &&
				oVLParameter["@com.sap.vocabularies.UI.v1.Importance"] &&
				oVLParameter["@com.sap.vocabularies.UI.v1.Importance"].$EnumMember === "com.sap.vocabularies.UI.v1.ImportanceType/High"
					? true
					: false;

			// Check some conditions for hidding redundant columns
			if (bFindRedundantColumn) {
				aRelevantColumn = oValueList.Parameters.filter(function(oParameter) {
					if (
						oParameter.ValueListProperty !== oVLParameter.ValueListProperty &&
						oVLParameter.$Type !== "com.sap.vocabularies.Common.v1.ValueListParameterInOut"
					) {
						oPropertyAnnotations = oMetaModel.getObject(
							"/" + oValueList.CollectionPath + "/" + oParameter.ValueListProperty + "@"
						);
						sDescriptionPath =
							oPropertyAnnotations &&
							oPropertyAnnotations["@com.sap.vocabularies.Common.v1.Text"] &&
							oPropertyAnnotations["@com.sap.vocabularies.Common.v1.Text"].$Path;
					}
					return sDescriptionPath && sDescriptionPath === oVLParameter.ValueListProperty;
				});
				aRelevantColumn.forEach(function(oParameter) {
					if (oParameter.ValueListProperty !== oVLParameter.ValueListProperty) {
						oPropertyAnnotations = oMetaModel.getObject(
							"/" + oValueList.CollectionPath + "/" + oParameter.ValueListProperty + "@"
						);
						// VH without Dialog (DDL)
						if (bIsDropDownListe) {
							if (
								oPropertyAnnotations["@com.sap.vocabularies.Common.v1.Text@com.sap.vocabularies.UI.v1.TextArrangement"] &&
								oPropertyAnnotations["@com.sap.vocabularies.Common.v1.Text@com.sap.vocabularies.UI.v1.TextArrangement"]
									.$EnumMember === "com.sap.vocabularies.UI.v1.TextArrangementType/TextSeparate"
							) {
								sRedundantColumn = undefined;
							} else {
								sRedundantColumn =
									oMetaModel.getObject(
										"/" +
											oValueList.CollectionPath +
											"/" +
											oParameter.ValueListProperty +
											"@com.sap.vocabularies.UI.v1.Hidden"
									) !== true && "{_VHUI>/hideColumn}";
							}
							// VH with Dialog
						} else {
							bIsTextOnly =
								oPropertyAnnotations["@com.sap.vocabularies.Common.v1.Text@com.sap.vocabularies.UI.v1.TextArrangement"] &&
								oPropertyAnnotations["@com.sap.vocabularies.Common.v1.Text@com.sap.vocabularies.UI.v1.TextArrangement"]
									.$EnumMember === "com.sap.vocabularies.UI.v1.TextArrangementType/TextOnly";
							if (bIsTextOnly) {
								sRedundantColumn =
									oMetaModel.getObject(
										"/" +
											oValueList.CollectionPath +
											"/" +
											oParameter.ValueListProperty +
											"@com.sap.vocabularies.UI.v1.Hidden"
									) !== true && "{_VHUI>/hideColumn}";
							}
							if (!oParameter["@com.sap.vocabularies.UI.v1.Importance"]) {
								if (!bIsTextOnly) {
									sRedundantColumn = undefined;
								} else {
									sRedundantColumn = bConsiderImportanceHigh ? "{_VHUI>/showColumnInTypeAhead}" : "{_VHUI>/hideColumn}";
								}
							}
						}
					}
				});
				return sRedundantColumn;
			}
		}

		function _getDefaultSortPropertyName(oValueList) {
			var sSortFieldName,
				metaModel = oValueList.$model.getMetaModel();
			var mEntitySetAnnotations = metaModel.getObject("/" + oValueList.CollectionPath + "@") || {};
			var oSortRestrictions = mEntitySetAnnotations["@Org.OData.Capabilities.V1.SortRestrictions"] || {};
			var oSortRestrictionsInfo = ODataMetaModelUtil.getSortRestrictionsInfo(oSortRestrictions);
			oValueList.Parameters.find(function(oElement) {
				if (
					metaModel.getObject(
						"/" +
							oValueList.CollectionPath +
							"/" +
							oElement.ValueListProperty +
							"@com.sap.vocabularies.Common.v1.Text@com.sap.vocabularies.UI.v1.TextArrangement/$EnumMember"
					) === "com.sap.vocabularies.UI.v1.TextArrangementType/TextOnly"
				) {
					sSortFieldName = metaModel.getObject(
						"/" + oValueList.CollectionPath + "/" + oElement.ValueListProperty + "@com.sap.vocabularies.Common.v1.Text/$Path"
					);
				} else {
					sSortFieldName = oElement.ValueListProperty;
				}
				return (
					(oElement.$Type == "com.sap.vocabularies.Common.v1.ValueListParameterInOut" ||
						oElement.$Type == "com.sap.vocabularies.Common.v1.ValueListParameterOut" ||
						oElement.$Type == "com.sap.vocabularies.Common.v1.ValueListParameterDisplayOnly") &&
					!(
						metaModel.getObject(
							"/" + oValueList.CollectionPath + "/" + oElement.ValueListProperty + "@com.sap.vocabularies.UI.v1.Hidden"
						) === true
					)
				);
			});
			if (sSortFieldName && (!oSortRestrictionsInfo[sSortFieldName] || oSortRestrictionsInfo[sSortFieldName].sortable)) {
				return sSortFieldName;
			} else {
				return undefined;
			}
		}

		function _build$SelectString(control) {
			var oViewData = control.getModel("viewData");
			if (oViewData) {
				var oData = oViewData.getData();
				if (oData) {
					var aColumns = oData.columns;
					if (aColumns) {
						return aColumns.reduce(function(sQuery, oProperty) {
							// Navigation properties (represented by X/Y) should not be added to $select.
							// ToDo : They should be added as $expand=X($select=Y) instead
							if (oProperty.path && oProperty.path.indexOf("/") === -1) {
								sQuery = sQuery ? sQuery + "," + oProperty.path : oProperty.path;
							}
							return sQuery;
						}, undefined);
					}
				}
			}
			return undefined;
		}

		/**
		 * Returns the condition path required for the condition model.
		 * For e.g. <1:N-PropertyName>*\/<1:1-PropertyName>/<PropertyName>.
		 *
		 * @param oMetaModel The metamodel instance
		 * @param sEntitySet The entity set path
		 * @param sProperty The property path
		 * @returns {string} The formatted condition path
		 * @private
		 */
		function _getConditionPath(oMetaModel, sEntitySet, sProperty) {
			var aParts = sProperty.split("/"),
				sPartialPath,
				sConditionPath = "";

			while (aParts.length) {
				var sPart = aParts.shift();
				sPartialPath = sPartialPath ? sPartialPath + "/" + sPart : sPart;
				var oProperty = oMetaModel.getObject(sEntitySet + "/" + sPartialPath);
				if (oProperty && oProperty.$kind === "NavigationProperty" && oProperty.$isCollection) {
					sPart += "*";
				}
				sConditionPath = sConditionPath ? sConditionPath + "/" + sPart : sPart;
			}
			return sConditionPath;
		}

		/**
		 * Returns array of column definitions corresponding to properties defined as Selection Fields on the CollectionPath entity set in a ValueHelp.
		 *
		 * @param oMetaModel The metamodel instance
		 * @param sEntitySet The entity set path
		 * @returns {object[]} Array of column definitions
		 * @private
		 */
		function _getColumnDefinitionFromSelectionFields(oMetaModel, sEntitySet) {
			var aColumnDefs = [],
				aSelectionFields = oMetaModel.getObject(sEntitySet + "/@com.sap.vocabularies.UI.v1.SelectionFields");

			if (aSelectionFields) {
				aSelectionFields.forEach(function(oSelectionField) {
					var sSelectionFieldPath = sEntitySet + "/" + oSelectionField.$PropertyPath,
						sConditionPath = _getConditionPath(oMetaModel, sEntitySet, oSelectionField.$PropertyPath),
						oPropertyAnnotations = oMetaModel.getObject(sSelectionFieldPath + "@"),
						oColumnDef = {
							path: sConditionPath,
							label: oPropertyAnnotations["@com.sap.vocabularies.Common.v1.Label"] || sSelectionFieldPath,
							sortable: true,
							filterable: CommonUtils.isPropertyFilterable(oMetaModel, sEntitySet, oSelectionField.$PropertyPath, false),
							$Type: oMetaModel.getObject(sSelectionFieldPath).$Type
						};
					aColumnDefs.push(oColumnDef);
				});
			}

			return aColumnDefs;
		}

		var ValueListHelper = {
			initializeCachedValueHelp: function() {
				// Destroy existing MDC value help objects
				aCachedValueHelp.forEach(function(oValueHelp) {
					if (!oValueHelp.oVHFilterBar.isDestroyed()) {
						oValueHelp.oVHFilterBar.destroy();
					}
					if (!oValueHelp.oVHDialogTable.isDestroyed()) {
						oValueHelp.oVHDialogTable.destroy();
					}
				});
				// initialize cache
				aCachedValueHelp = [];
				aSuggestCachedValueHelp = [];
			},

			getColumnVisibility: function(oValueList, oVLParameter, oSource) {
				var bIsDropDownListe = oSource && !!oSource.valueHelpWithFixedValues,
					sRedundantColumn = _redundantDescription(oValueList, oVLParameter, bIsDropDownListe);
				// Hide redundant column dependent on annotation (Text, TextArrangement, Importance, Hide)
				if (sRedundantColumn) {
					return sRedundantColumn;
				}
				if (bIsDropDownListe || !_hasImportanceHigh(oValueList)) {
					return undefined;
				} else if (
					oVLParameter &&
					oVLParameter["@com.sap.vocabularies.UI.v1.Importance"] &&
					oVLParameter["@com.sap.vocabularies.UI.v1.Importance"].$EnumMember === "com.sap.vocabularies.UI.v1.ImportanceType/High"
				) {
					return undefined;
				} else {
					return "{_VHUI>/showAllColumns}";
				}
			},
			getDialogTableColumnVisibility: function(oValueList, oVLParameter) {
				var oMetaModel = oValueList.$model.getMetaModel(),
					oPropertyAnnotations,
					sDescriptionPath,
					aRelevantColumn,
					bRedundantColumn = false;
				var bHiddenColumn =
					oMetaModel.getObject(
						"/" + oValueList.CollectionPath + "/" + oVLParameter.ValueListProperty + "@com.sap.vocabularies.UI.v1.Hidden"
					) === true && true;

				// Check some conditions for hidding redundant columns
				if (!bHiddenColumn) {
					aRelevantColumn = oValueList.Parameters.filter(function(oParameter) {
						if (
							oParameter.ValueListProperty !== oVLParameter.ValueListProperty &&
							oVLParameter.$Type !== "com.sap.vocabularies.Common.v1.ValueListParameterInOut"
						) {
							oPropertyAnnotations = oMetaModel.getObject(
								"/" + oValueList.CollectionPath + "/" + oParameter.ValueListProperty + "@"
							);
							sDescriptionPath =
								oPropertyAnnotations &&
								oPropertyAnnotations["@com.sap.vocabularies.Common.v1.Text"] &&
								oPropertyAnnotations["@com.sap.vocabularies.Common.v1.Text"].$Path;
						}
						return sDescriptionPath && sDescriptionPath === oVLParameter.ValueListProperty;
					});
					aRelevantColumn.forEach(function(oParameter) {
						if (oParameter.ValueListProperty !== oVLParameter.ValueListProperty) {
							oPropertyAnnotations = oMetaModel.getObject(
								"/" + oValueList.CollectionPath + "/" + oParameter.ValueListProperty + "@"
							);
							// VH with Dialog has Textarrangment with TextOnly
							if (
								oPropertyAnnotations["@com.sap.vocabularies.Common.v1.Text@com.sap.vocabularies.UI.v1.TextArrangement"] &&
								oPropertyAnnotations["@com.sap.vocabularies.Common.v1.Text@com.sap.vocabularies.UI.v1.TextArrangement"]
									.$EnumMember === "com.sap.vocabularies.UI.v1.TextArrangementType/TextOnly"
							) {
								bRedundantColumn =
									oMetaModel.getObject(
										"/" +
											oValueList.CollectionPath +
											"/" +
											oParameter.ValueListProperty +
											"@com.sap.vocabularies.UI.v1.Hidden"
									) !== true && true;
							}
						}
					});
				}
				return bHiddenColumn ? false : !bRedundantColumn;
			},

			getValueHelpTableSortConditions: function(oValueList, bSuggestion) {
				var sPresentationVariantQualifier =
						oValueList.PresentationVariantQualifier === "" ? "" : "#" + oValueList.PresentationVariantQualifier,
					sPresentationVariantPath =
						"/" +
						oValueList.CollectionPath +
						"/@com.sap.vocabularies.UI.v1.PresentationVariant" +
						sPresentationVariantQualifier;
				var oPresentationVariant = oValueList.$model.getMetaModel().getObject(sPresentationVariantPath);
				if (oPresentationVariant && oPresentationVariant.SortOrder) {
					var sSortConditions = {
						sorters: []
					};
					if (bSuggestion) {
						oPresentationVariant.SortOrder.forEach(function(oCondition) {
							var oSorter = {};
							oSorter.path = oCondition.Property.$PropertyPath;
							if (!!oCondition.Descending) {
								oSorter.descending = true;
							} else {
								oSorter.ascending = true;
							}
							sSortConditions.sorters.push(oSorter);
						});
						return "sorter: " + JSON.stringify(sSortConditions.sorters);
					} else {
						oPresentationVariant.SortOrder.forEach(function(oCondition) {
							var oSorter = {};
							oSorter.name = oCondition.Property.$PropertyPath;
							if (!!oCondition.Descending) {
								oSorter.descending = true;
							} else {
								oSorter.ascending = true;
							}
							sSortConditions.sorters.push(oSorter);
						});
						return JSON.stringify(sSortConditions);
					}
				} else if (!bSuggestion) {
					var oSorter = {},
						sSortConditions = {
							sorters: []
						};

					oSorter.name = _getDefaultSortPropertyName(oValueList);
					if (oSorter.name !== undefined) {
						oSorter.ascending = true;

						sSortConditions.sorters.push(oSorter);
					}

					return JSON.stringify(sSortConditions);
				}

				return undefined;
			},
			hasImportance: function(oValueListContext) {
				return _hasImportanceHigh(oValueListContext.getObject()) ? "Importance/High" : "None";
			},
			getMinScreenWidth: function(oValueList) {
				return _hasImportanceHigh(oValueList) ? "{= ${_VHUI>/minScreenWidth}}" : "416px";
			},
			getTableItemsParameters: function(oValueList, sRequestGroupId, bSuggestion, bValueHelpWithFixedValues) {
				var sSortFieldName,
					sParameters = "";

				var bSuspended = oValueList.Parameters.some(function(oParameter) {
					return bSuggestion || oParameter.$Type === "com.sap.vocabularies.Common.v1.ValueListParameterIn";
				});

				if (sRequestGroupId) {
					sParameters = ", parameters: {$$groupId: '" + sRequestGroupId + "'";
				}

				// add select to oBindingInfo (BCP 2180255956 / 2170163012)
				var sSelect = _build$SelectString(this);
				if (sSelect) {
					if (sParameters.length > 0) {
						sParameters = sParameters + ", '" + sSelect + "'";
					} else {
						sParameters = ", parameters: {$select: '" + sSelect + "'";
					}
				}

				if (sParameters.length > 0) {
					sParameters = sParameters + " }";
				}

				var sSortConditionFromPresentationVariant = ValueListHelper.getValueHelpTableSortConditions(oValueList, bSuggestion);

				var sLengthParameter = bValueHelpWithFixedValues ? "" : ", length: 10";

				if (sSortConditionFromPresentationVariant) {
					return (
						"{path: '/" +
						oValueList.CollectionPath +
						"'" +
						sParameters +
						", suspended : " +
						bSuspended +
						sLengthParameter +
						", " +
						sSortConditionFromPresentationVariant +
						"}"
					);
				} else {
					sSortFieldName = _getDefaultSortPropertyName(oValueList);
					var baseBinding =
						"{path: '/" + oValueList.CollectionPath + "'" + sParameters + ", suspended : " + bSuspended + sLengthParameter;
					if (!bSuggestion && sSortFieldName !== undefined) {
						baseBinding += ", sorter: {path: '" + sSortFieldName + "', ascending: true}";
					}
					baseBinding += "}";
					return baseBinding;
				}
			},
			getTableDelegate: function(oValueList) {
				return (
					"{name: 'sap/fe/macros/internal/valuehelp/TableDelegate', payload: {collectionName: '" +
					oValueList.CollectionPath +
					"'}}"
				);
			},
			getPropertyPath: function(oParameters) {
				return !oParameters.UnboundAction
					? oParameters.EntityTypePath + "/" + oParameters.Action + "/" + oParameters.Property
					: "/" + oParameters.Action.substring(oParameters.Action.lastIndexOf(".") + 1) + "/" + oParameters.Property;
			},
			getWaitForPromise: function() {
				return waitForPromise;
			},
			getValueListCollectionEntitySet: function(oValueListContext) {
				var mValueList = oValueListContext.getObject();
				return mValueList.$model.getMetaModel().createBindingContext("/" + mValueList.CollectionPath);
			},
			getValueListProperty: function(oPropertyContext) {
				var oValueListModel = oPropertyContext.getModel();
				var mValueList = oValueListModel.getObject("/");
				return mValueList.$model
					.getMetaModel()
					.createBindingContext("/" + mValueList.CollectionPath + "/" + oPropertyContext.getObject());
			},
			getValueListInfo: function(oFVH, oMetaModel, propertyPath, sConditionModel, oProperties) {
				var sKey,
					sDescriptionPath,
					sPropertyName = oMetaModel.getObject(propertyPath + "@sapui.name"),
					sPropertyPath,
					aInParameters = [],
					aOutParameters = [],
					sFieldPropertyPath = "";
				// Adding bAutoExpandSelect (second parameter of requestValueListInfo) as true by default
				return oMetaModel
					.requestValueListInfo(propertyPath, true, oFVH.getBindingContext())
					.then(function(mValueListInfo) {
						var bProcessInOut = oFVH.getInParameters().length + oFVH.getOutParameters().length === 0,
							oVHUIModel = oFVH.getModel("_VHUI"),
							qualifierForValidation = oVHUIModel.getProperty("/qualifierForValidation"),
							bSuggestion = oVHUIModel.getProperty("/isSuggestion"),
							hasValueListRelevantQualifiers = oVHUIModel.getProperty("/hasValueListRelevantQualifiers"),
							aCollectiveSearchItems = oFVH.getAggregation("collectiveSearchItems"),
							aValueHelpKeys = Object.keys(mValueListInfo),
							indexDefaultVH = aValueHelpKeys.indexOf(""),
							sValueHelpQualifier = aValueHelpKeys[0],
							sValueHelpId,
							isValueListWithFixedValues = oFVH
								.getModel()
								.getMetaModel()
								.getObject(propertyPath + "@")["@com.sap.vocabularies.Common.v1.ValueListWithFixedValues"];

						// ValueHelp w/o qualifier should be the first
						if (indexDefaultVH && indexDefaultVH > 0) {
							aValueHelpKeys.unshift(aValueHelpKeys[indexDefaultVH]);
							aValueHelpKeys.splice(indexDefaultVH + 1, 1);
						}
						// No valid qualifier should be handled in mdc
						if (sValueHelpQualifier === undefined) {
							return oFVH.getModel("_VHUI").setProperty("/noValidValueHelp", true);
						}
						// Multiple/Collective ValueHelp and/or ContextDependentValueHelp (ContextDependentValueHelp not used in LR-Filterbar, Action/Create-Dialog)
						if (hasValueListRelevantQualifiers || aValueHelpKeys.length > 1 || aCollectiveSearchItems.length > 1) {
							// Value help with ValueListWithFixedValues returns always key "", the $qualifier contains the value help qualifier
							if (isValueListWithFixedValues) {
								sValueHelpId =
									mValueListInfo[""].$qualifier === ""
										? oFVH.getId() + "::non-qualifier"
										: oFVH.getId() + "::qualifier::" + mValueListInfo[""].$qualifier;
								// Store in ValueHelp model
								oVHUIModel.setProperty("/valueHelpId", sValueHelpId);
								mValueListInfo = mValueListInfo[""];
							} else if (bSuggestion && aValueHelpKeys.indexOf(qualifierForValidation) > -1) {
								// In case of type-ahead the avaiable qualifer for validation is used
								sValueHelpId =
									qualifierForValidation === ""
										? oFVH.getId() + "::non-qualifier"
										: oFVH.getId() + "::qualifier::" + qualifierForValidation;
								// Store in ValueHelp model
								oVHUIModel.setProperty("/valueHelpId", sValueHelpId);
								oVHUIModel.setProperty("/collectiveSearchKey", qualifierForValidation);
								mValueListInfo = mValueListInfo[qualifierForValidation];
								oFVH.setProperty("validateInput", true);
							} else {
								// In case of context is changes --> may be collectiveSearchItem needs to be removed
								aCollectiveSearchItems.forEach(function(oItem) {
									if (!aValueHelpKeys.includes(oItem.getKey())) {
										oFVH.removeAggregation("collectiveSearchItems", oItem);
									}
								});
								// Drop-down (vh selection) only visible if more then 1 VH
								if (aValueHelpKeys.length === 1) {
									oFVH.removeAllAggregation("collectiveSearchItems");
									oProperties.collectiveSearchKey = undefined;
								} else {
									aValueHelpKeys.forEach(function(sValueHelpKey) {
										if (
											aCollectiveSearchItems.filter(function(oItem) {
												return oItem.getKey() === sValueHelpKey;
											}).length === 0
										) {
											oFVH.addAggregation(
												"collectiveSearchItems",
												new sap.ui.core.Item({
													key: sValueHelpKey,
													text: mValueListInfo[sValueHelpKey].Label,
													enabled: true
												})
											);
										}
									});
								}
								if (oProperties && oProperties.collectiveSearchKey !== undefined) {
									sValueHelpQualifier = oProperties.collectiveSearchKey;
								} else if (oProperties && oProperties.collectiveSearchKey === undefined) {
									sValueHelpQualifier = aValueHelpKeys[0];
									oProperties.collectiveSearchKey = aValueHelpKeys[0];
								}
								// Build ValueHelp Id
								sValueHelpId =
									sValueHelpQualifier === ""
										? oFVH.getId() + "::non-qualifier"
										: oFVH.getId() + "::qualifier::" + sValueHelpQualifier;
								// Store in ValueHelp model
								oFVH.getModel("_VHUI").setProperty("/valueHelpId", sValueHelpId);
								oFVH.getModel("_VHUI").setProperty("/collectiveSearchKey", sValueHelpQualifier);
								// Get ValueHelp by qualifier
								mValueListInfo = mValueListInfo[sValueHelpQualifier];
								if (
									!oFVH.getParent().isA("sap.ui.mdc.FilterBar") &&
									bSuggestion &&
									qualifierForValidation !== sValueHelpQualifier
								) {
									oFVH.setProperty("validateInput", false);
								}
							}
						} else {
							// Default ValueHelp (the first/only one) is normally ValueHelp w/o qualifier
							mValueListInfo = mValueListInfo[sValueHelpQualifier];
						}
						var sContextPrefix = "";

						if (oFVH.data("useMultiValueField") === "true" && oFVH.getBindingContext() && oFVH.getBindingContext().getPath()) {
							var aBindigContextParts = oFVH
								.getBindingContext()
								.getPath()
								.split("/");
							var aPropertyBindingParts = propertyPath.split("/");
							if (aPropertyBindingParts.length - aBindigContextParts.length > 1) {
								var aContextPrefixParts = [];
								for (var i = aBindigContextParts.length; i < aPropertyBindingParts.length - 1; i++) {
									aContextPrefixParts.push(aPropertyBindingParts[i]);
								}
								sContextPrefix = aContextPrefixParts.join("/") + "/";
							}
						}

						// Add column definitions for properties defined as Selection fields on the CollectionPath entity set.
						var oMetaModel = mValueListInfo.$model.getMetaModel(),
							sEntitySetPath = "/" + mValueListInfo.CollectionPath,
							aColumnDefs = _getColumnDefinitionFromSelectionFields(oMetaModel, sEntitySetPath),
							aParentFFNames;

						if (oFVH.getParent().isA("sap.ui.mdc.filterbar.vh.FilterBar")) {
							var oFB = oFVH.getParent();
							var aParentFilterFIelds = oFB.getFilterItems();
							aParentFFNames = aParentFilterFIelds.map(function(oFF) {
								return oFF.getFieldPath();
							});
						}

						// Determine the settings
						// TODO: since this is a static function we can't store the infos when filterbar is requested later
						mValueListInfo.Parameters.forEach(function(entry) {
							//All String fields are allowed for filter
							sPropertyPath = "/" + mValueListInfo.CollectionPath + "/" + entry.ValueListProperty;
							var oProperty = mValueListInfo.$model.getMetaModel().getObject(sPropertyPath),
								oPropertyAnnotations = mValueListInfo.$model.getMetaModel().getObject(sPropertyPath + "@") || {};

							// If oProperty is undefined, then the property coming for the entry isn't defined in
							// the metamodel, therefore we don't need to add it in the in/out parameters
							if (oProperty) {
								// Search for the *out Parameter mapped to the local property
								if (!sKey && entry.$Type.indexOf("Out") > 48 && entry.LocalDataProperty.$PropertyPath === sPropertyName) {
									//"com.sap.vocabularies.Common.v1.ValueListParameter".length = 49
									sFieldPropertyPath = sPropertyPath;
									sKey = entry.ValueListProperty;
									//Only the text annotation of the key can specify the description
									sDescriptionPath =
										oPropertyAnnotations["@com.sap.vocabularies.Common.v1.Text"] &&
										oPropertyAnnotations["@com.sap.vocabularies.Common.v1.Text"].$Path;
								}
								//Collect In and Out Parameter (except the field in question)
								if (
									bProcessInOut &&
									entry.$Type !== "com.sap.vocabularies.Common.v1.ValueListParameterDisplayOnly" &&
									entry.$Type !== "com.sap.vocabularies.Common.v1.ValueListParameterConstant" &&
									entry.LocalDataProperty &&
									entry.LocalDataProperty.$PropertyPath !== sPropertyName
								) {
									var sValuePath = "";

									if (sConditionModel && sConditionModel.length > 0) {
										if (
											oFVH.getParent().isA("sap.ui.mdc.Table") &&
											oFVH.getBindingContext() &&
											entry.$Type === "com.sap.vocabularies.Common.v1.ValueListParameterIn"
										) {
											// Special handling for value help used in filter dialog
											var aParts = entry.LocalDataProperty.$PropertyPath.split("/");
											if (aParts.length > 1) {
												var sFirstNavigationProperty = aParts[0];
												var oBoundEntity = oFVH
													.getModel()
													.getMetaModel()
													.getMetaContext(oFVH.getBindingContext().getPath());
												var sPathOfTable = oFVH
													.getParent()
													.getRowBinding()
													.getPath();
												if (oBoundEntity.getObject(sPathOfTable + "/$Partner") === sFirstNavigationProperty) {
													// Using the condition model doesn't make any sense in case an in-parameter uses a navigation property
													// referring to the partner. Therefore reducing the path and using the FVH context instead of the condition model
													sValuePath =
														"{" +
														entry.LocalDataProperty.$PropertyPath.replace(sFirstNavigationProperty + "/", "") +
														"}";
												}
											}
										}

										if (!sValuePath) {
											sValuePath =
												"{" + sConditionModel + ">/conditions/" + entry.LocalDataProperty.$PropertyPath + "}";
										}
									} else {
										sValuePath = "{" + sContextPrefix + entry.LocalDataProperty.$PropertyPath + "}";
									}

									//Out and InOut
									if (entry.$Type.indexOf("Out") > 48) {
										if (!aParentFFNames || aParentFFNames.indexOf(entry.LocalDataProperty.$PropertyPath) > -1) {
											// Filterbar inside VH doesn't have Adapt Filters dialog. Getting Filterfields for which out parameters can be applied.
											aOutParameters.push(
												new OutParameter({
													value: sValuePath,
													helpPath: entry.ValueListProperty
												})
											);
										}
									}
									//In and InOut
									if (entry.$Type.indexOf("In") > 48) {
										aInParameters.push(
											new InParameter({
												value: sValuePath,
												helpPath: entry.ValueListProperty,
												initialValueFilterEmpty: entry.InitialValueIsSignificant
											})
										);
									}
									//otherwise displayOnly and therefor not considered
								}
								// Collect Constant Parameter
								// We manage constants parameters as in parameters so that the value list table is filtered properly
								if (entry.$Type === "com.sap.vocabularies.Common.v1.ValueListParameterConstant") {
									aInParameters.push(
										new InParameter({
											value: entry.Constant,
											helpPath: entry.ValueListProperty
										})
									);
								}

								var sColumnPath = entry.ValueListProperty,
									sLabel = oPropertyAnnotations["@com.sap.vocabularies.Common.v1.Label"] || sColumnPath,
									sColumnPropertyType = oProperty.$Type;

								if (
									oPropertyAnnotations["@com.sap.vocabularies.Common.v1.Text"] &&
									oPropertyAnnotations[
										"@com.sap.vocabularies.Common.v1.Text@com.sap.vocabularies.UI.v1.TextArrangement"
									] &&
									oPropertyAnnotations["@com.sap.vocabularies.Common.v1.Text@com.sap.vocabularies.UI.v1.TextArrangement"]
										.$EnumMember === "com.sap.vocabularies.UI.v1.TextArrangementType/TextOnly"
								) {
									// the column property is the one coming from the text annotation
									sColumnPath = oPropertyAnnotations["@com.sap.vocabularies.Common.v1.Text"].$Path;
									var sTextPropertyPath = "/" + mValueListInfo.CollectionPath + "/" + sColumnPath;
									sColumnPropertyType = mValueListInfo.$model.getMetaModel().getObject(sTextPropertyPath).$Type;
								}
								var bColumnNotAlreadyDefined =
									aColumnDefs.findIndex(function(oCol) {
										return oCol.path === sColumnPath;
									}) === -1;
								if (bColumnNotAlreadyDefined) {
									var oColumnDef = {
										path: sColumnPath,
										label: sLabel,
										sortable: true,
										filterable: !oPropertyAnnotations["@com.sap.vocabularies.UI.v1.HiddenFilter"],
										$Type: sColumnPropertyType
									};
									aColumnDefs.push(oColumnDef);
								}
							}
						});
						return {
							keyValue: sKey,
							descriptionValue: sDescriptionPath,
							fieldPropertyPath: sFieldPropertyPath,
							inParameters: aInParameters,
							outParameters: aOutParameters,
							valueListInfo: mValueListInfo,
							columnDefs: aColumnDefs
						};
					})
					.catch(function(exc) {
						var sMsg =
							exc.status && exc.status === 404
								? "Metadata not found (" + exc.status + ") for value help of property " + propertyPath
								: exc.message;
						Log.error(sMsg);
						oFVH.destroyContent();
					});
			},
			_templateFragment: function(sFragmentName, oValueListInfo, oSourceModel, propertyPath) {
				var oFragment = XMLTemplateProcessor.loadTemplate(sFragmentName, "fragment"),
					mValueListInfo = oValueListInfo.valueListInfo,
					oValueListModel = new JSONModel(mValueListInfo),
					oValueListServiceMetaModel = mValueListInfo.$model.getMetaModel(),
					oViewData = new JSONModel({
						converterType: "ListReport",
						columns: oValueListInfo.columnDefs || null
					});

				return Promise.resolve(
					XMLPreprocessor.process(
						oFragment,
						{ name: sFragmentName },
						{
							//querySelector("*")
							bindingContexts: {
								valueList: oValueListModel.createBindingContext("/"),
								contextPath: oValueListServiceMetaModel.createBindingContext("/" + mValueListInfo.CollectionPath + "/"),
								source: oSourceModel.createBindingContext("/")
							},
							models: {
								valueList: oValueListModel,
								contextPath: oValueListServiceMetaModel,
								source: oSourceModel,
								metaModel: oValueListServiceMetaModel,
								viewData: oViewData
							}
						}
					)
				).then(function(oFragment) {
					var oLogInfo = { path: propertyPath, fragmentName: sFragmentName, fragment: oFragment };
					if (Log.getLevel() === Log.Level.DEBUG) {
						//In debug mode we log all generated fragments
						ValueListHelper.ALLFRAGMENTS = ValueListHelper.ALLFRAGMENTS || [];
						ValueListHelper.ALLFRAGMENTS.push(oLogInfo);
					}
					if (ValueListHelper.logFragment) {
						//One Tool Subscriber allowed
						setTimeout(function() {
							ValueListHelper.logFragment(oLogInfo);
						}, 0);
					}
					return Fragment.load({ definition: oFragment });
				});
			},
			createValueHelpDialog: function(propertyPath, oFVH, oTable, oFilterBar, oValueListInfo, bSuggestion) {
				var sFVHClass = oFVH.getMetadata().getName(),
					oWrapper = oFVH.getDialogContent && oFVH.getDialogContent(),
					sWrapperId = oWrapper && oWrapper.getId(),
					sValueHelpId = oFVH.getModel("_VHUI").getProperty("/valueHelpId"),
					that = this;

				//Only do this in case of context dependent value helps or other VH called the first time
				if ((!oTable || sValueHelpId !== undefined) && sFVHClass.indexOf("FieldValueHelp") > -1) {
					//Complete the field value help control
					oFVH.setTitle(oValueListInfo.valueListInfo.Label);
					oFVH.setKeyPath(oValueListInfo.keyValue);
					oFVH.setDescriptionPath(oValueListInfo.descriptionValue);
					oFVH.setFilterFields(_entityIsSearchable(oValueListInfo) ? "$search" : "");
				}
				var oSourceModel = new JSONModel({
					id: sValueHelpId || oFVH.getId(),
					groupId: oFVH.data("requestGroupId") || undefined,
					bSuggestion: bSuggestion,
					valueHelpWithFixedValues: oFVH
						.getModel()
						.getMetaModel()
						.getObject(propertyPath + "@")["@com.sap.vocabularies.Common.v1.ValueListWithFixedValues"]
				});

				oTable =
					oTable ||
					ValueListHelper._templateFragment(
						"sap.fe.macros.internal.valuehelp.ValueListDialogTable",
						oValueListInfo,
						oSourceModel,
						propertyPath
					);

				oFilterBar =
					oFilterBar ||
					ValueListHelper._templateFragment(
						"sap.fe.macros.internal.valuehelp.ValueListFilterBar",
						oValueListInfo,
						oSourceModel,
						propertyPath
					);

				return Promise.all([oTable, oFilterBar]).then(function(aControls) {
					var sValueHelpId = oFVH.getModel("_VHUI").getProperty("/valueHelpId"),
						sTableWidth,
						oTable = aControls[0],
						oFilterBar = aControls[1];
					if (oTable) {
						oTable.setModel(oValueListInfo.valueListInfo.$model);
						Log.info(
							"Value List - Dialog Table - XML content created [" + propertyPath + "]",
							oTable.getMetadata().getName(),
							"MDC Templating"
						);
					}
					if (oFilterBar) {
						oFilterBar.setModel(oValueListInfo.valueListInfo.$model);
						Log.info(
							"Value List- Filterbar - XML content created [" + propertyPath + "]",
							oFilterBar.getMetadata().getName(),
							"MDC Templating"
						);
					}

					if ((oFilterBar && oFilterBar !== oFVH.getFilterBar()) || (oFilterBar && sValueHelpId !== undefined)) {
						oFVH.setFilterBar(oFilterBar);
					} else {
						oFVH.addDependent(oFilterBar);
					}
					if (oTable !== oWrapper.getTable() || sValueHelpId !== undefined) {
						oWrapper.setTable(oTable);
						if (oFilterBar) {
							oTable.setFilter(oFilterBar.getId());
						}
						oTable.initialized();
						delete waitForPromise[sWrapperId];
					}
					// Different table width for type-ahead or dialog
					sTableWidth = that.getTableWidth(oTable, that._getWidthInRem(oFVH._getField()));
					oFVH.getModel("_VHUI").setProperty("/tableWidth", sTableWidth);
					oTable.setWidth("100%");
					// VH-Cache: In case of type-ahead only table is created, in case of VH-dialog the filterbar is created and needs to be cached
					if (sValueHelpId !== undefined) {
						var oSelectedCacheItem = _getCachedValueHelp(sValueHelpId);
						if (!oSelectedCacheItem) {
							aCachedValueHelp.push({
								sVHId: sValueHelpId,
								oVHDialogTable: oTable,
								oVHFilterBar: oFilterBar
							});
						} else if (oSelectedCacheItem && oSelectedCacheItem.oVHFilterBar === false) {
							aCachedValueHelp[aCachedValueHelp.indexOf(oSelectedCacheItem)].oVHFilterBar = oFilterBar;
						}
					}
				});
			},
			createValueHelpSuggest: function(propertyPath, oFVH, oTable, oValueListInfo, bSuggestion) {
				var oWrapper = oFVH.getSuggestContent && oFVH.getSuggestContent(),
					sWrapperId = oWrapper && oWrapper.getId(),
					sFVHClass = oFVH.getMetadata().getName(),
					sValueHelpId = oFVH.getModel("_VHUI").getProperty("/valueHelpId"),
					that = this;

				//Only do this in case of context dependent value helps or other VH called the first time
				if ((!oTable || sValueHelpId !== undefined) && sFVHClass.indexOf("FieldValueHelp") > -1) {
					//Complete the field value help control
					oFVH.setTitle(oValueListInfo.valueListInfo.Label);
					oFVH.setKeyPath(oValueListInfo.keyValue);
					oFVH.setDescriptionPath(oValueListInfo.descriptionValue);
					oFVH.setFilterFields(_entityIsSearchable(oValueListInfo) ? "$search" : "");
				}
				var oSourceModel = new JSONModel({
					id: sValueHelpId || oFVH.getId(),
					groupId: oFVH.data("requestGroupId") || undefined,
					bSuggestion: bSuggestion,
					valueHelpWithFixedValues: oFVH
						.getModel()
						.getMetaModel()
						.getObject(propertyPath + "@")["@com.sap.vocabularies.Common.v1.ValueListWithFixedValues"]
				});
				oTable =
					oTable ||
					ValueListHelper._templateFragment(
						"sap.fe.macros.internal.valuehelp.ValueListTable",
						oValueListInfo,
						oSourceModel,
						propertyPath
					);

				return Promise.all([oTable]).then(function(aControls) {
					var sTableWidth,
						oTable = aControls[0];
					if (oTable) {
						oTable.setModel(oValueListInfo.valueListInfo.$model);
						var oBinding = oTable.getBinding("items");
						oBinding.attachEventOnce("dataRequested", function() {
							BusyLocker.lock(oTable);
						});
						oBinding.attachEvent("dataReceived", function(oEvent) {
							if (BusyLocker.isLocked(oTable)) {
								BusyLocker.unlock(oTable);
							}
							if (oEvent.getParameter("error")) {
								// show the unbound messages but with a timeout as the messages are otherwise not yet in the message model
								setTimeout(messageHandling.showUnboundMessages, 0);
							}
						});

						//If the entity is DraftEnabled add a DraftFilter
						if (ModelHelper.isDraftSupported(oBinding.getModel().getMetaModel(), oBinding.getPath())) {
							oBinding.filter(new Filter("IsActiveEntity", FilterOperator.EQ, true), FilterType.Control);
						}

						Log.info(
							"Value List- suggest Table XML content created [" + propertyPath + "]",
							oTable.getMetadata().getName(),
							"MDC Templating"
						);
					}

					if (oTable !== oWrapper.getTable() || sValueHelpId !== undefined) {
						oWrapper.setTable(oTable);
						oTable.attachEventOnce("updateFinished", function() {
							oWrapper.invalidate(oTable);
						});
						delete waitForPromise[sWrapperId];
					}
					var isUnitValueHelp = oFVH.data("sourcePath") !== oFVH.data("originalPropertyPath");

					// handling of table-width for special case of predefined filter-bar variant where filter-field is not available yet
					var oFilterField = oFVH._getField();
					if (oFilterField.isA("sap.ui.mdc.FilterField") || oFilterField.isA("sap.ui.mdc.Field")) {
						sTableWidth = that.getTableWidth(oTable, that._getWidthInRem(oFilterField, isUnitValueHelp));
						oFVH.getModel("_VHUI").setProperty("/tableWidth", sTableWidth);
						oTable.setWidth(sTableWidth);
					} else {
						oFVH.getModel("_VHUI").setProperty("/tableWidth", undefined); // set to undefined in order to be checked later in showValueListInfo
					}

					if (sValueHelpId !== undefined) {
						var oSelectedCacheItem = _getSuggestCachedValueHelp(sValueHelpId);
						if (!oSelectedCacheItem) {
							aSuggestCachedValueHelp.push({
								sVHId: sValueHelpId,
								oVHSuggestTable: oTable
							});
						}
					}
				});
			},
			_getWidthInRem: function(oControl, isUnitValueHelp) {
				var $width = oControl.$().width();
				if (isUnitValueHelp && $width) {
					$width = 0.3 * $width;
				}
				var fWidth = $width ? parseFloat(Rem.fromPx($width)) : 0;
				return isNaN(fWidth) ? 0 : fWidth;
			},
			getTableWidth: function(oTable, fMinWidth) {
				var sWidth,
					aColumns = oTable.getColumns(),
					aVisibleColumns =
						(aColumns &&
							aColumns.filter(function(oColumn) {
								return oColumn && oColumn.getVisible && oColumn.getVisible();
							})) ||
						[],
					iSumWidth = aVisibleColumns.reduce(function(fSum, oColumn) {
						sWidth = oColumn.getWidth();
						if (sWidth && sWidth.endsWith("px")) {
							sWidth = Rem.fromPx(sWidth);
						}
						var fWidth = parseFloat(sWidth);
						return fSum + (isNaN(fWidth) ? 9 : fWidth);
					}, aVisibleColumns.length);
				return Math.max(iSumWidth, fMinWidth) + "em";
			},
			showValueListInfo: function(propertyPath, oFVH, bSuggestion, sConditionModel, oProperties) {
				var oModel = oFVH.getModel(),
					oMetaModel = oModel.getMetaModel(),
					oWrapper = oFVH.getDialogContent && oFVH.getDialogContent(),
					oSuggestWrapper = oFVH.getSuggestContent && oFVH.getSuggestContent(),
					sWrapperId,
					oDialogTable,
					oFilterBar,
					oSuggestTable,
					bExists,
					bIsDropDownList = oFVH.getProperty("noDialog"),
					oVHUIModel,
					sQualifierForValidation,
					sValueHelpId;
				if (bSuggestion) {
					sWrapperId = oSuggestWrapper && oSuggestWrapper.getId();
					oSuggestTable = oSuggestWrapper && oSuggestWrapper.getTable && oSuggestWrapper.getTable();
					bExists = oSuggestTable;
				} else {
					oDialogTable = oWrapper && oWrapper.getTable && oWrapper.getTable();
					oFilterBar = oFVH && oFVH.getFilterBar && oFVH.getFilterBar();
					sWrapperId = oWrapper && oWrapper.getId();
					bExists = oDialogTable && oFilterBar;
				}

				// setting the _VHUI model evaluated in the ValueListTable fragment
				oVHUIModel = oFVH.getModel("_VHUI");

				if (!oVHUIModel) {
					oVHUIModel = new JSONModel({});
					oFVH.setModel(oVHUIModel, "_VHUI");
					// Identifies the "ContextDependent-Scenario"
					oVHUIModel.setProperty(
						"/hasValueListRelevantQualifiers",
						!!oMetaModel.getObject(propertyPath + "@")["@com.sap.vocabularies.Common.v1.ValueListRelevantQualifiers"]
					);
					if (oFVH.getProperty("validateInput")) {
						sQualifierForValidation = oMetaModel.getObject(propertyPath + "@")[
							"@com.sap.vocabularies.Common.v1.ValueListForValidation"
						];
						sQualifierForValidation = sQualifierForValidation && sQualifierForValidation.replace(/\s/g, "");
						oVHUIModel.setProperty("/qualifierForValidation", sQualifierForValidation);
					}
				}
				oVHUIModel.setProperty("/isSuggestion", bSuggestion);
				oVHUIModel.setProperty("/showAllColumns", bIsDropDownList ? true : !bSuggestion);
				oVHUIModel.setProperty("/hideColumn", false);
				oVHUIModel.setProperty("/showColumnInTypeAhead", bSuggestion);
				oVHUIModel.setProperty("/minScreenWidth", !bSuggestion ? "418px" : undefined);
				sValueHelpId = oFVH.getModel("_VHUI").getProperty("/valueHelpId");
				if (oDialogTable) {
					oDialogTable.setWidth("100%");
				}

				// handling of special case of predefined variant: the table width can only be set late when field is available (see function createValueHelpSuggest)
				if (oSuggestTable) {
					var sTableWidth = oVHUIModel.getProperty("/tableWidth");
					if (!sTableWidth) {
						var isUnitValueHelp = oFVH.data("sourcePath") !== oFVH.data("originalPropertyPath");
						sTableWidth = this.getTableWidth(oSuggestTable, this._getWidthInRem(oFVH._getField(), isUnitValueHelp));
						oFVH.getModel("_VHUI").setProperty("/tableWidth", sTableWidth);
						oSuggestTable.setWidth(sTableWidth);
					}
				}

				// switch off internal caching
				if (
					(sValueHelpId !== undefined && oFVH.getBindingContext()) ||
					(oFVH.getModel("_VHUI").getProperty("/collectiveSearchKey") !== undefined &&
						oFVH.getModel("_VHUI").getProperty("/collectiveSearchKey") !== oProperties.collectiveSearchKey)
				) {
					oDialogTable = undefined;
					oFilterBar = undefined;
					oSuggestTable = undefined;
					bExists = undefined;
					delete waitForPromise[sWrapperId];
				}

				if (!bSuggestion && !oFilterBar && oFVH.getDependents().length > 0) {
					var oPotentialFilterBar = oFVH.getDependents()[0];
					if (oPotentialFilterBar.isA("sap.ui.mdc.filterbar.vh.FilterBar")) {
						oFilterBar = oPotentialFilterBar;
					}
				}
				if (waitForPromise[sWrapperId] || bExists) {
					return waitForPromise["promise" + sWrapperId];
				} else {
					if ((bSuggestion && !oSuggestTable) || (!bSuggestion && !oDialogTable)) {
						waitForPromise[sWrapperId] = true;
					}
					var oPromise = ValueListHelper.getValueListInfo(oFVH, oMetaModel, propertyPath, sConditionModel, oProperties)
						.then(function(oValueListInfo) {
							var sValueHelpId = oFVH.getModel("_VHUI").getProperty("/valueHelpId");
							if (oFVH.getModel("_VHUI").getProperty("/noValidValueHelp")) {
								Log.error("Context dependent value help not found");
								return oFVH.close();
							}
							var aInParameters = oValueListInfo && oValueListInfo.inParameters,
								aOutParameters = oValueListInfo && oValueListInfo.outParameters;
							if (oFVH.getOutParameters().length !== aOutParameters.length) {
								aOutParameters.forEach(function(oOutParameter) {
									oFVH.addOutParameter(oOutParameter);
								});
							}
							if (oFVH.getInParameters().length !== aInParameters.length) {
								aInParameters.forEach(function(oInParameter) {
									oFVH.addInParameter(oInParameter);
								});
							}
							if (bSuggestion) {
								var oSelectedSuggestCacheItem = _getSuggestCachedValueHelp(sValueHelpId);

								var oSuggestTable = oSelectedSuggestCacheItem ? oSelectedSuggestCacheItem.oVHSuggestTable : undefined;
								return (
									oValueListInfo &&
									ValueListHelper.createValueHelpSuggest(propertyPath, oFVH, oSuggestTable, oValueListInfo, bSuggestion)
								);
							} else {
								var oSelectedCacheItem = _getCachedValueHelp(sValueHelpId);
								if (oSelectedCacheItem) {
									oDialogTable = oSelectedCacheItem.oVHDialogTable;
									oFilterBar = oSelectedCacheItem.oVHFilterBar;
								}
								return (
									oValueListInfo &&
									ValueListHelper.createValueHelpDialog(
										propertyPath,
										oFVH,
										oDialogTable,
										oFilterBar,
										oValueListInfo,
										bSuggestion
									)
								);
							}
						})
						.catch(function(exc) {
							var sMsg =
								exc.status && exc.status === 404
									? "Metadata not found (" + exc.status + ") for value help of property " + propertyPath
									: exc.message;
							Log.error(sMsg);
							oFVH.destroyContent();
						});
					waitForPromise["promise" + sWrapperId] = oPromise;
					return oPromise;
				}
			},
			setValueListFilterFields: function(propertyPath, oFVH, bSuggestion, sConditionModel) {
				var oModel = oFVH.getModel(),
					oMetaModel = oModel.getMetaModel();
				// For ContextDependentValueHelp the func getValueListInfo is also called
				if (
					oFVH.getBindingContext() &&
					oFVH
						.getModel()
						.getMetaModel()
						.getObject(propertyPath + "@")["@com.sap.vocabularies.Common.v1.ValueListRelevantQualifiers"]
				) {
					return;
				}
				return ValueListHelper.getValueListInfo(oFVH, oMetaModel, propertyPath, sConditionModel).then(function(oValueListInfo) {
					oValueListInfo && oFVH.setFilterFields(_entityIsSearchable(oValueListInfo) ? "$search" : "");
				});
			},
			getColumnWidth: function(sDataFieldType, oValueList) {
				if (oValueList && oValueList.Parameters && oValueList.Parameters.length === 1) {
					// in case there is a single parameter its width needs to match the table's hence type is ignored
					return "auto";
				}
				switch (sDataFieldType) {
					case "Edm.Stream":
						return "7em";
					case "Edm.Boolean":
						return "8em";
					case "Edm.Date":
					case "Edm.TimeOfDay":
						return "9em";
					case "Edm.DateTimeOffset":
						return "12em";
					default:
						return "auto";
				}
			},
			fetchValuesOnInitialLoad: function(oValueListInfo) {
				if (oValueListInfo.FetchValues && oValueListInfo.FetchValues == 2) {
					return false;
				}
				return true;
			},
			getOutParameterPaths: function(aParameters) {
				var sPath = "";
				aParameters.forEach(function(oParameter) {
					if (oParameter.$Type.endsWith("Out")) {
						sPath += "{" + oParameter.ValueListProperty + "}";
					}
				});
				return sPath;
			}
		};
		return ValueListHelper;
	},
	/* bExport= */ true
);
