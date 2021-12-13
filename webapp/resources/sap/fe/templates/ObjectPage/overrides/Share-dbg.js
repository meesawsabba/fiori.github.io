/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)
        (c) Copyright 2009-2021 SAP SE. All rights reserved
    
 */
sap.ui.define(
	[
		"sap/ui/core/routing/HashChanger",
		"sap/fe/core/helpers/ModelHelper",
		"sap/fe/core/helpers/SemanticKeyHelper",
		"sap/ui/model/Filter",
		"sap/ui/model/FilterOperator",
		"sap/base/Log"
	],
	function(HashChanger, ModelHelper, SemanticKeyHelper, Filter, FilterOperator, Log) {
		"use strict";
		var bIsStickySupported, oUIModel, sEditMode;

		function createFilterToFetchActiveContext(mKeyValues, bIsActiveEntityDefined) {
			var aFilters,
				aKeys = Object.keys(mKeyValues);

			aFilters = aKeys.map(function(sKey) {
				var sValue = mKeyValues[sKey];
				if (sValue !== undefined) {
					return new Filter(sKey, FilterOperator.EQ, sValue);
				}
			});

			if (bIsActiveEntityDefined) {
				var oActiveFilter = new Filter({
					filters: [new Filter("SiblingEntity/IsActiveEntity", FilterOperator.EQ, true)],
					and: false
				});

				aFilters.push(oActiveFilter);
			}

			var oCombinedFilter = new Filter(aFilters, true);
			return oCombinedFilter;
		}

		function getActiveContextPath(oController, sPageEntityName, oFilter) {
			var oListBinding = oController
				.getView()
				.getBindingContext()
				.getModel()
				.bindList("/" + sPageEntityName, undefined, undefined, oFilter, { "$$groupId": "$auto.Heroes" });
			return oListBinding.requestContexts(0, 2).then(function(oContexts) {
				if (oContexts && oContexts.length) {
					return oContexts[0].getPath();
				}
			});
		}

		function getActiveContextInstances(oContext, oController, oEntitySet) {
			var aActiveContextpromises = [];
			var aPages = [];
			var sMetaPath = oContext
				.getModel()
				.getMetaModel()
				.getMetaPath(oContext.getPath());
			if (sMetaPath.indexOf("/") === 0) {
				sMetaPath = sMetaPath.substring(1);
			}
			var aMetaPathArray = sMetaPath.split("/");
			var sCurrentHashNoParams = HashChanger.getInstance()
				.getHash()
				.split("?")[0];
			var aCurrentHashArray = sCurrentHashNoParams.split("/");

			// oPageMap - creating an object that contains map of metapath name and it's technical details
			// which is required to create a filter to fetch the relavant/correct active context
			// Example: {SalesOrderManage:{technicalID:technicalIDValue}, _Item:{technicalID:technicalIDValue}} etc.,
			var oPageMap = {};
			var aPageHashArray = [];
			aCurrentHashArray.forEach(function(sPageHash) {
				var aKeyValues = sPageHash.substring(sPageHash.indexOf("(") + 1, sPageHash.length - 1).split(",");
				var mKeyValues = {};
				var sPageHashName = sPageHash.split("(")[0];
				oPageMap[sPageHashName] = {};
				aPageHashArray.push(sPageHashName);
				oPageMap[sPageHashName]["bIsActiveEntityDefined"] = true;
				for (var i = 0; i < aKeyValues.length; i++) {
					var sKeyAssignment = aKeyValues[i];
					var aParts = sKeyAssignment.split("=");
					var sKeyValue = aParts[1];
					var sKey = aParts[0];
					// In case if only one technical key is defined then the url just contains the technicalIDValue but not the technicalID
					// Example: SalesOrderManage(ID=11111129-aaaa-bbbb-cccc-ddddeeeeffff,IsActiveEntity=false)/_Item(11111129-aaaa-bbbb-cccc-ddddeeeeffff)
					// In above example SalesOrderItem has only one technical key defined, hence technicalID info is not present in the url
					// Hence in such cases we get technical key and use them to fetch active context
					if (sKeyAssignment.indexOf("=") === -1) {
						var oMetaModel = oContext.getModel().getMetaModel();
						var aTechnicalKeys = oMetaModel.getObject("/" + aPageHashArray.join("/") + "/$Type/$Key");
						sKeyValue = aParts[0];
						sKey = aTechnicalKeys[0];
						oPageMap[sPageHash.split("(")[0]]["bIsActiveEntityDefined"] = false;
					}

					if (sKey !== "IsActiveEntity") {
						if (sKeyValue.indexOf("'") === 0 && sKeyValue.lastIndexOf("'") === sKeyValue.length - 1) {
							// Remove the quotes from the value and decode special chars
							sKeyValue = decodeURIComponent(sKeyValue.substring(1, sKeyValue.length - 1));
						}
						mKeyValues[sKey] = sKeyValue;
					}
				}
				oPageMap[sPageHashName].mKeyValues = mKeyValues;
			});

			var oPageEntitySet = oEntitySet;
			aMetaPathArray.forEach(function(sNavigationPath) {
				var oPageInfo = {};
				var sPageEntitySetName =
					oPageEntitySet.$NavigationPropertyBinding && oPageEntitySet.$NavigationPropertyBinding[sNavigationPath];
				if (sPageEntitySetName) {
					oPageInfo.pageEntityName = oPageEntitySet.$NavigationPropertyBinding[sNavigationPath];
					oPageEntitySet =
						oContext
							.getModel()
							.getMetaModel()
							.getObject("/" + sPageEntitySetName) || oEntitySet;
				} else {
					oPageInfo.pageEntityName = sNavigationPath;
				}
				oPageInfo.mKeyValues = oPageMap[sNavigationPath].mKeyValues;
				oPageInfo.bIsActiveEntityDefined = oPageMap[sNavigationPath].bIsActiveEntityDefined;
				aPages.push(oPageInfo);
			});

			aPages.forEach(function(oPageInfo) {
				var oFilter = createFilterToFetchActiveContext(oPageInfo.mKeyValues, oPageInfo.bIsActiveEntityDefined);
				aActiveContextpromises.push(getActiveContextPath(oController, oPageInfo.pageEntityName, oFilter));
			});

			return aActiveContextpromises;
		}

		/**
		 * Method to fetch active context path's.
		 * @param {sap.ui.model.odata.v4.Context} oContext The Page Context
		 * @param oController
		 * @returns {Promise} Promise which is resolved once the active context's are fetched
		 */
		function getActiveContextPaths(oContext, oController) {
			var sCurrentHashNoParams = HashChanger.getInstance()
				.getHash()
				.split("?")[0];
			var sRootEntityName = sCurrentHashNoParams && sCurrentHashNoParams.substr(0, sCurrentHashNoParams.indexOf("("));
			if (sRootEntityName.indexOf("/") === 0) {
				sRootEntityName = sRootEntityName.substring(1);
			}
			var oEntitySet = oContext
				.getModel()
				.getMetaModel()
				.getObject("/" + sRootEntityName);
			var oPageContext = oContext;
			var aActiveContextpromises = getActiveContextInstances(oContext, oController, oEntitySet);
			if (aActiveContextpromises.length > 0) {
				return Promise.all(aActiveContextpromises)
					.then(function(aData) {
						var aActiveContextPaths = [];
						var oPageEntitySet = oEntitySet;
						if (aData[0].indexOf("/") === 0) {
							aActiveContextPaths.push(aData[0].substring(1));
						} else {
							aActiveContextPaths.push(aData[0]);
						}
						// In the active context paths identify and replace the entitySet Name with corresponding navigation property name
						// Required to form the url pointing to active context
						// Example : SalesOrderItem --> _Item, MaterialDetails --> _MaterialDetails etc.,
						for (var i = 1; i < aData.length; i++) {
							var sActiveContextPath = aData[i];
							var sNavigatioProperty = "";
							var sEntitySetName = sActiveContextPath && sActiveContextPath.substr(0, sActiveContextPath.indexOf("("));
							if (sEntitySetName.indexOf("/") === 0) {
								sEntitySetName = sEntitySetName.substring(1);
							}
							if (sActiveContextPath.indexOf("/") === 0) {
								sActiveContextPath = sActiveContextPath.substring(1);
							}
							sNavigatioProperty = Object.keys(oPageEntitySet.$NavigationPropertyBinding)[
								Object.values(oPageEntitySet.$NavigationPropertyBinding).indexOf(sEntitySetName)
							];
							if (sNavigatioProperty) {
								aActiveContextPaths.push(sActiveContextPath.replace(sEntitySetName, sNavigatioProperty));
								oPageEntitySet =
									oPageContext
										.getModel()
										.getMetaModel()
										.getObject("/" + sEntitySetName) || oEntitySet;
							} else {
								aActiveContextPaths.push(sActiveContextPath);
							}
						}
						return aActiveContextPaths;
					})
					.catch(function(oError) {
						Log.info("Failed to retrieve one or more active context path's", oError);
					});
			} else {
				return Promise.resolve();
			}
		}
		function fetchActiveContextPaths(oContext, oController) {
			var oPromise, aSemanticKeys;
			var sCurrentHashNoParams = HashChanger.getInstance()
				.getHash()
				.split("?")[0];
			if (oContext) {
				var oModel = oContext.getModel();
				var oMetaModel = oModel.getMetaModel();
				bIsStickySupported = ModelHelper.isStickySessionSupported(oMetaModel);
				var sRootEntityName = sCurrentHashNoParams && sCurrentHashNoParams.substr(0, sCurrentHashNoParams.indexOf("("));
				if (sRootEntityName.indexOf("/") === 0) {
					sRootEntityName = sRootEntityName.substring(1);
				}
				aSemanticKeys = SemanticKeyHelper.getSemanticKeys(oMetaModel, sRootEntityName);
			}
			// Fetch active context details incase of below scenario's(where page is not sticky supported(we do not have draft instance))
			// 1. In case of draft enabled Object page where semantic key based URL is not possible(like semantic keys are not modeled in the entity set)
			// 2. In case of draft enabled Sub Object Pages (where semantic bookmarking is not supported)
			var oViewData = oController.getView().getViewData();
			if (oContext && !bIsStickySupported && ((oViewData.viewLevel === 1 && !aSemanticKeys) || oViewData.viewLevel >= 2)) {
				oPromise = getActiveContextPaths(oContext, oController);
				return oPromise;
			} else {
				return Promise.resolve();
			}
		}

		/**
		 * Get share URL.
		 * @param sEditMode
		 * @param bIsStickySupported
		 * @param aActiveContextPaths
		 * @returns {string} The share URL
		 * @protected
		 * @static
		 */
		function getShareUrl(sEditMode, bIsStickySupported, aActiveContextPaths) {
			var sShareUrl;
			var sHash = HashChanger.getInstance().getHash();
			var sBasePath = HashChanger.getInstance().hrefForAppSpecificHash ? HashChanger.getInstance().hrefForAppSpecificHash("") : "";
			if (sEditMode === "Editable" && !bIsStickySupported && aActiveContextPaths) {
				sShareUrl = sBasePath + aActiveContextPaths.join("/");
			} else {
				sShareUrl = sHash ? sBasePath + sHash : window.location.hash;
			}
			return sShareUrl;
		}

		function getJamUrl(sEditMode, bIsStickySupported, aActiveContextPaths) {
			var sJamUrl;
			var sHash = HashChanger.getInstance().getHash();
			var sBasePath = HashChanger.getInstance().hrefForAppSpecificHash ? HashChanger.getInstance().hrefForAppSpecificHash("") : "";
			if (sEditMode === "Editable" && !bIsStickySupported && aActiveContextPaths) {
				sJamUrl = sBasePath + aActiveContextPaths.join("/");
			} else {
				sJamUrl = sHash ? sBasePath + sHash : window.location.hash;
			}
			// in case we are in cFLP scenario, the application is running
			// inside an iframe, and there for we need to get the cFLP URL
			// and not 'document.URL' that represents the iframe URL
			if (sap.ushell && sap.ushell.Container && sap.ushell.Container.runningInIframe && sap.ushell.Container.runningInIframe()) {
				sap.ushell.Container.getFLPUrl(true)
					.then(function(sUrl) {
						return sUrl.substr(0, sUrl.indexOf("#")) + sJamUrl;
					})
					.catch(function(sError) {
						Log.error("Could not retrieve cFLP URL for the sharing dialog (dialog will not be opened)", sError);
					});
			} else {
				return Promise.resolve(window.location.origin + window.location.pathname + sJamUrl);
			}
		}

		return {
			adaptShareMetadata: function(oShareMetadata) {
				var that = this;
				var oContext = this.base.getView().getBindingContext();
				oUIModel = this.base.getView().getModel("ui");
				sEditMode = oUIModel.getProperty("/editMode");
				return fetchActiveContextPaths(oContext, that.base.getView().getController()).then(function(aActiveContextPaths) {
					var aPromises = [];
					aPromises.push(
						that.base
							.getView()
							.getController()
							._getPageTitleInformation()
					);
					aPromises.push(getJamUrl(sEditMode, bIsStickySupported, aActiveContextPaths));
					return Promise.all(aPromises).then(function(oData) {
						var oPageTitleInfo = oData[0];
						var sJamUrl = oData[1];
						var sTitle = oPageTitleInfo.title;
						var sObjectSubtitle = oPageTitleInfo.subtitle.toString();
						if (sObjectSubtitle) {
							sTitle = sTitle + " - " + sObjectSubtitle;
						}
						oShareMetadata.tile = {
							title: oPageTitleInfo.title,
							subtitle: oPageTitleInfo.subtitle.toString()
						};
						oShareMetadata.email.title = sTitle;
						oShareMetadata.title = sTitle;
						oShareMetadata.url = getShareUrl(sEditMode, bIsStickySupported, aActiveContextPaths);
						oShareMetadata.jam.url = sJamUrl;
						return oShareMetadata;
					});
				});
			}
		};
	}
);
