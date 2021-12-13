/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)
        (c) Copyright 2009-2017 SAP SE. All rights reserved
    
 */
sap.ui.define(
	[
		"sap/m/Button",
		"sap/m/Dialog",
		"sap/m/library",
		"sap/fe/common/MessagePopover",
		"sap/fe/core/CommonUtils",
		"sap/ui/core/MessageType",
		"sap/ui/model/Filter",
		"sap/ui/model/Sorter",
		"sap/ui/model/FilterOperator",
		"sap/uxap/ObjectPageLayout",
		"sap/base/Log"
	],
	function(Button, Dialog, mLibrary, MessagePopover, CommonUtils, MessageType, Filter, Sorter, FilterOperator, ObjectPageLayout, Log) {
		"use strict";
		var ButtonType = mLibrary.ButtonType;
		var MessageButton = Button.extend("sap.fe.common.MessageButton", {
			metadata: {
				properties: {},
				events: {
					messageChange: {}
				},
				aggregations: {
					customFilters: {
						type: "sap.fe.common.MessageFilter",
						multiple: true,
						singularName: "customFilter"
					}
				}
			},
			renderer: {}
		});
		/**
		 *
		 * @param {object} sControlId
		 * @param {object} oItem
		 *
		 * @returns {boolean} True if the control ID matches the item ID
		 */
		function _fnFilterUponId(sControlId, oItem) {
			return sControlId === oItem.getId();
		}
		/**
		 *
		 * @param {Array} aControlIds
		 * @param {object} oItem
		 *
		 * @returns {boolean} True if matches the item ID matcheds with one of the controlIds
		 */
		function _fnFilterUponIds(aControlIds, oItem) {
			return aControlIds.some(function(sControlId) {
				if (sControlId === oItem.getId()) {
					return true;
				}
				return false;
			});
		}
		/**
		 * Method to set the button text, count and icon property based upon the message items
		 * ButtonType:  Possible settings for warning and error messages are 'critical' and 'negative'.
		 *
		 *
		 * @private
		 */
		function _setMessageData() {
			clearTimeout(this._setMessageDataTimeout);
			this._setMessageDataTimeout = setTimeout(
				function() {
					var sIcon,
						sButtonType = ButtonType.Default,
						oMessages = this.oMessagePopover.getItems(),
						iMessageLength = oMessages.length,
						oMessageCount = { Error: 0, Warning: 0, Success: 0, Information: 0 },
						oResourceBundle = sap.ui.getCore().getLibraryResourceBundle("sap.fe.core"),
						sMessageKey,
						sTooltipText,
						sMessageText;
					if (iMessageLength > 0) {
						for (var i = 0; i < iMessageLength; i++) {
							if (!oMessages[i].getType() || oMessages[i].getType() == "") {
								++oMessageCount["Information"];
							} else {
								++oMessageCount[oMessages[i].getType()];
							}
						}
						if (oMessageCount[MessageType.Error] > 0) {
							sButtonType = ButtonType.Negative;
						} else if (oMessageCount[MessageType.Critical] > 0 || oMessageCount[MessageType.Warning] > 0) {
							sButtonType = ButtonType.Critical;
						} else if (oMessageCount[MessageType.Success] > 0) {
							sButtonType = ButtonType.Success;
						} else if (oMessageCount[MessageType.Information] > 0) {
							sButtonType = ButtonType.Neutral;
						}
						if (oMessageCount.Error > 0) {
							this.setText(oMessageCount.Error);
						} else {
							this.setText("");
						}
						if (oMessageCount.Error === 1) {
							sMessageKey = "C_COMMON_SAPFE_ERROR_MESSAGES_PAGE_TITLE_ERROR";
						} else if (oMessageCount.Error > 1) {
							sMessageKey = "C_COMMON_SAPFE_ERROR_MESSAGES_PAGE_MULTIPLE_ERROR_TOOLTIP";
						} else if (!oMessageCount.Error && oMessageCount.Warning) {
							sMessageKey = "C_COMMON_SAPFE_ERROR_MESSAGES_PAGE_WARNING_TOOLTIP";
						} else if (!oMessageCount.Error && !oMessageCount.Warning && oMessageCount.Information) {
							sMessageKey = "C_MESSAGE_HANDLING_SAPFE_ERROR_MESSAGES_PAGE_TITLE_INFO";
						} else if (!oMessageCount.Error && !oMessageCount.Warning && !oMessageCount.Information && oMessageCount.Success) {
							sMessageKey = "C_MESSAGE_HANDLING_SAPFE_ERROR_MESSAGES_PAGE_TITLE_SUCCESS";
						}
						if (sMessageKey) {
							sMessageText = oResourceBundle.getText(sMessageKey);
							sTooltipText = oMessageCount.Error ? oMessageCount.Error + " " + sMessageText : sMessageText;
							this.setTooltip(sTooltipText);
						}
						this.setIcon(sIcon);
						this.setType(sButtonType);
						this.setVisible(true);
						var oView = sap.ui.getCore().byId(this.sViewId);
						if (oView) {
							var oPageReady = oView.getController().pageReady;
							oPageReady
								.waitPageReady()
								.then(
									function() {
										return this._applyGroupingAsync(oView);
									}.bind(this)
								)
								.finally(
									function() {
										this.fireMessageChange({
											iMessageLength: iMessageLength
										});
									}.bind(this)
								)
								.catch(function(e) {
									Log.error("fail grouping messages");
								});
						}
						if (iMessageLength > 1) {
							this.oMessagePopover.navigateBack();
						}
					} else {
						this.setVisible(false);
						this.fireMessageChange({
							iMessageLength: iMessageLength
						});
					}
				}.bind(this),
				100
			);
		}
		/**
		 * Method to set the filters based upon the message items
		 * The desired filter operation is:
		 * ( filters provided by user && ( validation = true && Control should be present in view ) || messages for the current matching context ).
		 *
		 * @private
		 */
		function _applyFiltersAndSort() {
			var aCustomFilters,
				oValidationFilters,
				oValidationAndContextFilter,
				oFilters,
				oBindingContext,
				sPath,
				sViewId,
				oSorter,
				oDialogFilter,
				aUserDefinedFilter = [],
				objectPageLayoutSections = null;
			function filterOutMessagesInDialog() {
				var fnTest = function(aControlIds) {
					var index = Infinity,
						oControl = sap.ui.getCore().byId(aControlIds[0]),
						errorFieldControl = sap.ui.getCore().byId(aControlIds[0]);
					while (oControl) {
						var fieldRankinDialog =
							oControl instanceof Dialog
								? errorFieldControl
										.getParent()
										.findElements(true)
										.indexOf(errorFieldControl)
								: Infinity;
						if (oControl instanceof Dialog) {
							if (index > fieldRankinDialog) {
								index = fieldRankinDialog;
								// Set the focus to the dialog's control
								errorFieldControl.focus();
							}
							// messages for sap.m.Dialog should not appear in the message button
							return false;
						}
						oControl = oControl.getParent();
					}
					return true;
				};
				return new Filter({
					path: "controlIds",
					test: fnTest,
					caseSensitive: true
				});
			}
			//Filter function to verify if the control is part of the current view or not
			function getCheckControlInViewFilter() {
				var fnTest = function(aControlIds) {
					if (!aControlIds.length) {
						return false;
					}
					var oControl = sap.ui.getCore().byId(aControlIds[0]);
					while (oControl) {
						if (oControl.getId() === sViewId) {
							return true;
						}
						if (oControl instanceof Dialog) {
							// messages for sap.m.Dialog should not appear in the message button
							return false;
						}
						oControl = oControl.getParent();
					}
					return false;
				};
				return new Filter({
					path: "controlIds",
					test: fnTest,
					caseSensitive: true
				});
			}
			if (!this.sViewId) {
				this.sViewId = this._getViewId(this.getId());
			}
			sViewId = this.sViewId;
			//Add the filters provided by the user
			aCustomFilters = this.getAggregation("customFilters");
			if (aCustomFilters) {
				aCustomFilters.forEach(function(filter) {
					aUserDefinedFilter.push(
						new Filter({
							path: filter.getProperty("path"),
							operator: filter.getProperty("operator"),
							value1: filter.getProperty("value1"),
							value2: filter.getProperty("value2")
						})
					);
				});
			}
			oBindingContext = this.getBindingContext();
			if (!oBindingContext) {
				this.setVisible(false);
				return;
			} else {
				sPath = oBindingContext.getPath();
				//Filter for filtering out only validation messages which are currently present in the view
				oValidationFilters = new Filter({
					filters: [
						new Filter({
							path: "validation",
							operator: FilterOperator.EQ,
							value1: true
						}),
						getCheckControlInViewFilter()
					],
					and: true
				});
				//Filter for filtering out the bound messages i.e target starts with the context path
				oValidationAndContextFilter = new Filter({
					filters: [
						oValidationFilters,
						new Filter({
							path: "target",
							operator: FilterOperator.StartsWith,
							value1: sPath
						})
					],
					and: false
				});
				oDialogFilter = new Filter({
					filters: [filterOutMessagesInDialog()]
				});
			}
			var oValidationContextDialogFilters = new Filter({
				filters: [oValidationAndContextFilter, oDialogFilter],
				and: true
			});
			// and finally - if there any - add custom filter (via OR)
			if (aUserDefinedFilter.length > 0) {
				oFilters = new Filter({
					filters: [aUserDefinedFilter, oValidationContextDialogFilters],
					and: false
				});
			} else {
				oFilters = oValidationContextDialogFilters;
			}
			this.oItemBinding.filter(oFilters);
			this.oObjectPageLayout = _getObjectPageLayout(this, this.oObjectPageLayout);
			// We support sorting only for ObjectPageLayout use-case.
			if (this.oObjectPageLayout) {
				var that = this;
				oSorter = new Sorter("", null, null, function(obj1, obj2) {
					var rankA, rankB;
					if (!objectPageLayoutSections) {
						objectPageLayoutSections = that.oObjectPageLayout && that.oObjectPageLayout.getSections();
					}
					rankA = _getMessageRank(obj1, objectPageLayoutSections);
					rankB = _getMessageRank(obj2, objectPageLayoutSections);
					if (rankA < rankB) {
						return -1;
					}
					if (rankA > rankB) {
						return 1;
					}
					return 0;
				});
				this.oItemBinding.sort(oSorter);
			}
		}
		/**
		 *
		 * @param {object} obj The message object
		 * @param {Array} aSections The array of sections in the object page
		 *
		 * @returns {number} The rank of the message
		 */
		function _getMessageRank(obj, aSections) {
			if (aSections) {
				var section, aSubSections, subSection, j, k, aElements, aAllElements, sectionRank;
				for (j = aSections.length - 1; j >= 0; --j) {
					// Loop over all sections
					section = aSections[j];
					aSubSections = section.getSubSections();
					for (k = aSubSections.length - 1; k >= 0; --k) {
						// Loop over all sub-sections
						subSection = aSubSections[k];
						aAllElements = subSection.findElements(true); // Get all elements inside a sub-section
						//Try to find the control 1 inside the sub section
						aElements = aAllElements.filter(_fnFilterUponId.bind(this, obj.getControlId()));
						sectionRank = j + 1;
						if (aElements.length > 0) {
							obj.sectionName = section.getTitle();
							obj.subSectionName = subSection.getTitle();
							return sectionRank * 10 + (k + 1);
						}
					}
				}
				//if sub section title is Other messages, we return a high number(rank), which ensures
				//that messages belonging to this sub section always come later in messagePopover
				if (!obj.sectionName && !obj.subSectionName && obj.persistent) {
					return 1;
				}
				return 999;
			}
			return 999;
		}
		/**
		 * The method that is called when a user clicks on the title of the message.
		 *
		 * @function
		 * @name _activeTitlePress
		 * @private
		 * @param {Event} oEvent Event object passed from the handler
		 */
		function _activeTitlePress(oEvent) {
			var oInternalModelContext = sap.ui.fl.Utils.getViewForControl(this).getBindingContext("internal");
			oInternalModelContext.setProperty("errorNavigationSectionFlag", true);
			var oItem = oEvent.getParameter("item"),
				oMessage = oItem.getBindingContext("message").getObject(),
				bIsBackendMessage = new RegExp("^/").test(oMessage.getTarget()),
				oControl,
				sSectionTitle,
				oView = sap.ui.getCore().byId(this.sViewId),
				oMessagePopover = this.oMessagePopover;

			if (oMessagePopover && oMessagePopover.isOpen()) {
				oMessagePopover.close();
			}

			var _focusOnMessageTargetControl = function(oMessage, oTargetMdcTable, iRowIndex, oMessageButton) {
				var aAllViewElements = oView.findElements(true);
				var aErroneousControls = oMessage
					.getControlIds()
					.filter(function(sControlId) {
						return aAllViewElements.some(function(oElem) {
							return oElem.getId() === sControlId;
						});
					})
					.map(function(sControlId) {
						return sap.ui.getCore().byId(sControlId);
					});
				var aNotTableErroneousControls = aErroneousControls.filter(function(oElem) {
					return !oElem.isA("sap.m.Table") && !oElem.isA("sap.ui.Table.table");
				});
				//The focus is set on Not Table control in priority
				if (aNotTableErroneousControls.length > 0) {
					aNotTableErroneousControls[0].focus();
				} else if (aErroneousControls.length > 0) {
					aErroneousControls[0].focus();
					var aTargetMdcTableRow = oTargetMdcTable.findElements(true, function(oElem) {
						return oElem.isA("sap.m.ColumnListItem");
					});
					if (aTargetMdcTableRow.length > 0 && aTargetMdcTableRow[0]) {
						var oTargetRow = aTargetMdcTableRow[iRowIndex];
						var oTargetCell = _getTargetCell(oTargetRow, oMessage);
						var sColumnName = oMessage
							.getTarget()
							.split("/")
							.pop();
						var oColFromTableSettings = oTargetMdcTable
							.getParent()
							.getTableDefinition()
							.columns.find(function(oColumn) {
								return oColumn.key === "DataField::" + sColumnName && oColumn.availability !== "Hidden";
							});
						if (oTargetCell) {
							var oTargetField = oTargetCell.isA("sap.fe.macros.FieldAPI")
								? oTargetCell.getContent().getContentEdit()[0]
								: oTargetCell
										.getItems()[0]
										.getContent()
										.getContentEdit()[0];
							oTargetField.focus();
						} else if (oColFromTableSettings) {
							aTargetMdcTableRow[iRowIndex].focus();
						} else {
							// control not found on table
							var errorProperty = oMessage
								.getTarget()
								.split("/")
								.pop();
							if (errorProperty) {
								oView.getModel("internal").setProperty("/messageTargetProperty", errorProperty);
							}
							oView.getController()._routing.navigateForwardToContext(oTargetRow.getBindingContext());
						}
					}
				}
			};

			function _getTargetCell(oTargetRow, oMessage) {
				var oTargetCell = oMessage.controlIds
					.map(function(sControlId) {
						var isControlInTable = oTargetRow.findElements(true, function(oElem) {
							return oElem.getId() === sControlId;
						});
						return isControlInTable.length > 0 ? sap.ui.getCore().byId(sControlId) : null;
					})
					.reduce(function(acc, val) {
						return val ? val : acc;
					});
				return oTargetCell;
			}

			//check if the pressed item is related to a table control
			if (oItem.getGroupName().indexOf("Table:") !== -1) {
				var oTargetMdcTable;
				if (bIsBackendMessage) {
					oTargetMdcTable = oMessage.controlIds
						.map(function(sControlId) {
							var oControl = sap.ui.getCore().byId(sControlId);
							var oParentControl = oControl && oControl.getParent();
							return oParentControl &&
								oParentControl.isA("sap.ui.mdc.Table") &&
								oParentControl.getHeader() === oItem.getGroupName().split(", Table: ")[1]
								? oParentControl
								: null;
						})
						.reduce(function(acc, val) {
							return val ? val : acc;
						});
					if (oTargetMdcTable) {
						sSectionTitle = oItem.getGroupName().split(", ")[0];
						_navigateFromMessageToSectionTableInIconTabBarMode(oTargetMdcTable, this.oObjectPageLayout, sSectionTitle)
							.then(
								function() {
									var oRefErrorContext = this._getTableRefErrorContext(oTargetMdcTable);
									var oRefError = oRefErrorContext.getProperty(
										oItem
											.getBindingContext("message")
											.getObject()
											.getId()
									);
									var _setFocusOnTargetField = function(oTargetMdcTable, iRowIndex, oMessageButton) {
										var aTargetMdcTableRow = _getMdcTableRows(oTargetMdcTable),
											iFirstVisibleRow = _getGridTable(oTargetMdcTable).getFirstVisibleRow();
										if (aTargetMdcTableRow.length > 0 && aTargetMdcTableRow[0]) {
											var oTargetRow = aTargetMdcTableRow[iRowIndex - iFirstVisibleRow],
												oTargetCell = _getTargetCell(oTargetRow, oMessage);
											var oFirstEditableField = oTargetRow.getCells().find(function(oCell) {
												return oCell.getEditable && oCell.getEditable();
											});
											var sColumnName = oMessage
												.getTarget()
												.split("/")
												.pop();
											var oColFromTableSettings = oTargetMdcTable
												.getParent()
												.getTableDefinition()
												.columns.find(function(oColumn) {
													return oColumn.key === "DataField::" + sColumnName && oColumn.availability !== "Hidden";
												});
											if (oTargetCell) {
												oTargetCell.focus();
											} else if (oColFromTableSettings) {
												oFirstEditableField
													.getContent()
													.getContentEdit()[0]
													.focus();
											} else {
												// control not found on table
												var errorProperty = oMessage
													.getTarget()
													.split("/")
													.pop();
												if (errorProperty) {
													oView.getModel("internal").setProperty("/messageTargetProperty", errorProperty);
												}
												oView.getController()._routing.navigateForwardToContext(oTargetRow.getBindingContext());
											}
											return { targetRow: oTargetRow, targetCell: oTargetCell };
										}
										return { targetRow: null, targetCell: null };
									};
									if (oTargetMdcTable.data("tableType") === "GridTable" && oRefError.rowIndex !== "") {
										var iFirstVisibleRow = _getGridTable(oTargetMdcTable).getFirstVisibleRow();
										oTargetMdcTable
											.scrollToIndex(oRefError.rowIndex)
											.then(function() {
												var aTargetMdcTableRow = _getMdcTableRows(oTargetMdcTable),
													iNewFirstVisibleRow,
													bScrollNeeded;
												if (aTargetMdcTableRow.length > 0 && aTargetMdcTableRow[0]) {
													iNewFirstVisibleRow = aTargetMdcTableRow[0].getParent().getFirstVisibleRow();
													bScrollNeeded = iFirstVisibleRow - iNewFirstVisibleRow !== 0;
												}
												if (bScrollNeeded) {
													//The scrollToIndex function does not wait for the UI update. As a workdaround, pending a fix from MDC (BCP: 2170251631) we use the event "UIUpdated".
													var oWaitControlIdAdded = new Promise(function(resolve) {
														sap.ui.getCore().attachEvent("UIUpdated", resolve);
													});
													return oWaitControlIdAdded;
												}
												return null;
											})
											.then(
												function() {
													setTimeout(
														function() {
															_setFocusOnTargetField(oTargetMdcTable, oRefError.rowIndex, this);
														}.bind(this),
														0
													);
												}.bind(this)
											)
											.catch(function(e) {
												Log.error("Error while focusing on error");
											});
									} else if (oTargetMdcTable.data("tableType") === "ResponsiveTable" && oRefError) {
										_focusOnMessageTargetControl.bind(this)(oMessage, oTargetMdcTable, oRefError.rowIndex, this);
									} else {
										_focusOnMessageTargetControl.bind(this)(oMessage);
									}
								}.bind(this)
							)
							.catch(function() {
								Log.error("Fail to navigate to Error control");
							});
					}
				} else {
					oControl = sap.ui.getCore().byId(oMessage.controlIds[0]);
					//If the control underlying the frontEnd message is not within the current section, we first go into the target section:
					var oSelectedSection = sap.ui.getCore().byId(this.oObjectPageLayout.getSelectedSection());
					if (oSelectedSection.findElements(true).indexOf(oControl) === -1) {
						sSectionTitle = oItem.getGroupName().split(", ")[0];
						_navigateFromMessageToSectionInIconTabBarMode(this.oObjectPageLayout, sSectionTitle);
					}
					oControl.focus();
				}
			} else {
				// focus on control
				sSectionTitle = oItem.getGroupName().split(", ")[0];
				_navigateFromMessageToSectionInIconTabBarMode(this.oObjectPageLayout, sSectionTitle);
				_focusOnMessageTargetControl(oMessage);
			}
		}
		/**
		 * Retrieves the section based on section title and visibility.
		 *
		 * @param {object} oObjectPage Object page.
		 * @param {string} sSectionTitle Section title.
		 * @returns {object}
		 * @private
		 * @ignore
		 */
		function _getSectionBySectionTitle(oObjectPage, sSectionTitle) {
			if (sSectionTitle) {
				var aSections = oObjectPage.getSections();
				var oSection;
				for (var i = 0; i < aSections.length; i++) {
					if (aSections[i].getVisible() && aSections[i].getTitle() === sSectionTitle) {
						oSection = aSections[i];
						break;
					}
				}
				return oSection;
			}
		}
		/**
		 * Navigates to the section if the object page uses an IconTabBar and if the current section is not the target of the navigation.
		 *
		 * @param {object} oObjectPage Object page.
		 * @param {string} sSectionTitle Section title.
		 * @private
		 * @ignore
		 */
		function _navigateFromMessageToSectionInIconTabBarMode(oObjectPage, sSectionTitle) {
			var bUseIconTabBar = oObjectPage.getUseIconTabBar();
			if (bUseIconTabBar) {
				var oSection = _getSectionBySectionTitle(oObjectPage, sSectionTitle);
				var sSelectedSectionId = oObjectPage.getSelectedSection();
				if (oSection && sSelectedSectionId !== oSection.getId()) {
					oObjectPage.setSelectedSection(oSection.getId());
				}
			}
		}
		function _navigateFromMessageToSectionTableInIconTabBarMode(oTable, oObjectPage, sSectionTitle) {
			var oRowBinding = oTable.getRowBinding();
			var oTableContext = oTable.getBindingContext();
			var oOPContext = oObjectPage.getBindingContext();
			var bShouldWaitForTableRefresh = !(oTableContext === oOPContext);
			_navigateFromMessageToSectionInIconTabBarMode(oObjectPage, sSectionTitle);
			return new Promise(function(resolve) {
				if (bShouldWaitForTableRefresh) {
					oRowBinding.attachEventOnce("change", function() {
						resolve();
					});
				} else {
					resolve();
				}
			});
		}
		/**
		 * Retrieves the MDC table if it is found among any of the parent elements.
		 *
		 * @param {object} oElement Control
		 * @returns {object} MDC table || undefined
		 * @private
		 * @ignore
		 */
		function _getMdcTable(oElement) {
			//check if the element has a table within any of its parents
			var oParentElement = oElement.getParent();
			while (oParentElement && !oParentElement.isA("sap.ui.mdc.Table")) {
				oParentElement = oParentElement.getParent();
			}
			var oMdcTable = oParentElement && oParentElement.isA("sap.ui.mdc.Table") ? oParentElement : undefined;
			return oMdcTable;
		}
		function _getGridTable(oMdcTable) {
			return oMdcTable.findElements(true, function(oElem) {
				return oElem.isA("sap.ui.table.Table");
			})[0];
		}
		/**
		 * Retrieves the table row (if available) containing the element.
		 *
		 * @param {object} oElement Control
		 * @returns {object} Table row || undefined
		 * @private
		 * @ignore
		 */
		function _getTableRow(oElement) {
			var oParentElement = oElement.getParent();
			while (
				oParentElement &&
				!oParentElement.isA("sap.ui.table.Row") &&
				!oParentElement.isA("sap.ui.table.CreationRow") &&
				!oParentElement.isA("sap.m.ColumnListItem")
			) {
				oParentElement = oParentElement.getParent();
			}
			var oTableRow =
				oParentElement &&
				(oParentElement.isA("sap.ui.table.Row") ||
					oParentElement.isA("sap.ui.table.CreationRow") ||
					oParentElement.isA("sap.m.ColumnListItem"))
					? oParentElement
					: undefined;
			return oTableRow;
		}
		/**
		 * Retrieves the index of the table row containing the element.
		 *
		 * @param {object} oElement Control
		 * @returns {object} Row index || undefined
		 * @private
		 * @ignore
		 */
		function _getTableRowIndex(oElement) {
			var oTableRow = _getTableRow(oElement),
				iRowIndex;
			if (oTableRow.isA("sap.ui.table.Row")) {
				iRowIndex = oTableRow.getIndex();
			} else {
				iRowIndex = oTableRow
					.getTable()
					.getItems()
					.findIndex(function(element) {
						return element.getId() === oTableRow.getId();
					});
			}
			return iRowIndex;
		}
		/**
		 * Retrieves the index of the table column containing the element.
		 *
		 * @param {object} oElement Control
		 * @returns {object} Column index || undefined
		 * @private
		 * @ignore
		 */
		function _getTableColumnIndex(oElement) {
			var getTargetCellIndex = function(oElement, oTargetRow) {
				return oTargetRow.getCells().findIndex(function(oCell) {
					return oCell.getId() === oElement.getId();
				});
			};
			var getTargetColumnIndex = function(oElement, oTargetRow) {
				var oTargetElement = oElement.getParent(),
					iTargetCellIndex = getTargetCellIndex(oTargetElement, oTargetRow);
				while (oTargetElement && iTargetCellIndex < 0) {
					oTargetElement = oTargetElement.getParent();
					iTargetCellIndex = getTargetCellIndex(oTargetElement, oTargetRow);
				}
				return iTargetCellIndex;
			};
			var oTargetRow = _getTableRow(oElement),
				iTargetColumnIndex;
			iTargetColumnIndex = getTargetColumnIndex(oElement, oTargetRow);
			if (oTargetRow.isA("sap.ui.table.CreationRow")) {
				var sTargetCellId = oTargetRow.getCells()[iTargetColumnIndex].getId(),
					aTableColumns = oTargetRow.getTable().getColumns();
				iTargetColumnIndex = aTableColumns.findIndex(function(column) {
					if (column.getCreationTemplate()) {
						return sTargetCellId.search(column.getCreationTemplate().getId()) > -1 ? true : false;
					} else {
						return false;
					}
				});
			}
			return iTargetColumnIndex;
		}
		function _getTableColInfo(oTable, sTableTargetColProperty) {
			var sTableTargetColName;
			var oTableTargetCol = oTable.getColumns().find(
				function(sTableTargetColProperty, column) {
					return column.getDataProperty() === sTableTargetColProperty;
				}.bind(this, sTableTargetColProperty)
			);
			if (!oTableTargetCol) {
				/* If the target column is not found, we check for a custom column */
				var oCustomColumn = oTable
					.getControlDelegate()
					.getColumnsFor(oTable)
					.find(function(oColumn) {
						if (!!oColumn.template && oColumn.propertyInfos) {
							return (
								oColumn.propertyInfos[0] === sTableTargetColProperty ||
								oColumn.propertyInfos[0].replace("Property::", "") === sTableTargetColProperty
							);
						} else {
							return false;
						}
					});
				if (oCustomColumn) {
					oTableTargetCol = oCustomColumn;
					sTableTargetColProperty = oTableTargetCol.name;

					sTableTargetColName = oTable
						.getColumns()
						.find(function(oColumn) {
							return sTableTargetColProperty === oColumn.getDataProperty();
						})
						.getHeader();
				} else {
					/* If the target column is not found, we check for a field group */
					var aColumns = oTable.getControlDelegate().getColumnsFor(oTable);
					oTableTargetCol = aColumns.find(
						function(aColumns, sTableTargetColProperty, oColumn) {
							if (oColumn.key.indexOf("::FieldGroup::") !== -1) {
								return oColumn.propertyInfos.find(function(oPropertyInfo) {
									return aColumns.find(function(oColumn) {
										return oColumn.relativePath === sTableTargetColProperty;
									});
								});
							}
						}.bind(this, aColumns, sTableTargetColProperty)
					);
					/* check if the column with the field group is visible in the table: */
					if (oTableTargetCol && oTableTargetCol.label) {
						var bIsTableTargetColVisible = oTable.getColumns().some(function(column) {
							return column.getHeader() === oTableTargetCol.label;
						});
					}
					sTableTargetColName = bIsTableTargetColVisible && oTableTargetCol.label;
					sTableTargetColProperty = bIsTableTargetColVisible && oTableTargetCol.key;
				}
			} else {
				sTableTargetColName = oTableTargetCol && oTableTargetCol.getHeader();
			}
			return { sTableTargetColName: sTableTargetColName, sTableTargetColProperty: sTableTargetColProperty };
		}
		function _getMdcTableRows(oMdcTable) {
			return oMdcTable.findElements(true, function(oElem) {
				return oElem.isA("sap.ui.table.Row");
			});
		}
		function _getTableColProperty(oTable, oMessageObject) {
			//this function escapes a string to use it as a regex
			var fnRegExpescape = function(string) {
				return string.replace(/[-\/\\^$*+?.()|[\]{}]/g, "\\$&");
			};
			// based on the target path of the message we retrieve the property name.
			// to achieve it we remove the bindingContext path and the row binding path from the target
			var sTableTargetColProperty = oMessageObject
				.getTarget()
				.replace(
					new RegExp(fnRegExpescape(oTable.getBindingContext().getPath() + "/" + oTable.getRowBinding().getPath()) + "\\(.*\\)/"),
					""
				);
			return sTableTargetColProperty;
		}
		function _getObjectPageLayout(oElement, oObjectPageLayout) {
			if (oObjectPageLayout) {
				return oObjectPageLayout;
			}
			oObjectPageLayout = oElement;
			//Iterate over parent till you have not reached the object page layout
			while (oObjectPageLayout && !(oObjectPageLayout instanceof ObjectPageLayout)) {
				oObjectPageLayout = oObjectPageLayout.getParent();
			}
			return oObjectPageLayout;
		}
		function _getCustomColumnInfo(oTable, iPosition) {
			var sTableColProperty = oTable.getColumns()[iPosition].getDataProperty();
			var oCustomColumn = oTable
				.getControlDelegate()
				.getColumnsFor(oTable)
				.find(function(oColumn) {
					return oColumn.name === sTableColProperty && !!oColumn.template;
				});
			return oCustomColumn;
		}
		function _getTableFirstColProperty(oTable) {
			var sTableFirstColProperty,
				oCustomColumnInfo = _getCustomColumnInfo(oTable, 0);
			if (oCustomColumnInfo) {
				if (oCustomColumnInfo.propertyInfos) {
					sTableFirstColProperty = oCustomColumnInfo.propertyInfos[0].replace("Property::", "");
				} else {
					sTableFirstColProperty = undefined;
				}
			} else {
				sTableFirstColProperty = oTable.getColumns()[0].getDataProperty();
			}
			return sTableFirstColProperty;
		}
		function _IsControlInTable(oTable, sControlId) {
			var oControl = sap.ui.getCore().byId(sControlId);
			if (!oControl.isA("sap.ui.table.Table") && !oControl.isA("sap.m.Table")) {
				return oTable.findElements(true, function(oElem) {
					return oElem.getId() === oControl;
				});
			}
			return false;
		}
		function _IsControlPartOfCreationRow(oControl) {
			var oParentControl = oControl.getParent();
			while (
				oParentControl &&
				!oParentControl.isA("sap.ui.table.Row") &&
				!oParentControl.isA("sap.ui.table.CreationRow") &&
				!oParentControl.isA("sap.m.ColumnListItem")
			) {
				oParentControl = oParentControl.getParent();
			}

			return !!oParentControl && oParentControl.isA("sap.ui.table.CreationRow");
		}
		function _setMessageSubtitle(
			message,
			oTableRowBindingContexts,
			oTableRowContext,
			sTableTargetColName,
			oResourceBundle,
			sTableTargetProperty,
			oTable,
			bIsCreationRow
		) {
			var sMessageSubtitle;
			var sTableFirstColProperty = _getTableFirstColProperty(oTable);
			var sColNameFromMessageObj = message
				.getBindingContext("message")
				.getObject()
				.getTarget()
				.split("/")
				.pop();
			var oColFromTableSettings = oTable
				.getParent()
				.getTableDefinition()
				.columns.find(function(item) {
					return item.key === "DataField::" + sColNameFromMessageObj;
				});
			var sColumnInfoText = oColFromTableSettings
				? oColFromTableSettings.label + " (" + oResourceBundle.getText("T_COLUMN_INDICATOR_IN_TABLE_DEFINITION") + ")"
				: oResourceBundle.getText("T_MESSAGE_ITEM_SUBTITLE_INDICATOR_UNKNOWN");

			if (bIsCreationRow) {
				sMessageSubtitle = CommonUtils.getTranslatedText("T_MESSAGE_ITEM_SUBTITLE", oResourceBundle, [
					oResourceBundle.getText("T_MESSAGE_ITEM_SUBTITLE_CREATION_ROW_INDICATOR"),
					sTableTargetColName ? sTableTargetColName : oResourceBundle.getText("T_MESSAGE_ITEM_SUBTITLE_INDICATOR_UNKNOWN")
				]);
			} else {
				var sTableFirstColProperty = _getTableFirstColProperty(oTable);
				sMessageSubtitle =
					oTableRowBindingContexts.length > 0
						? CommonUtils.getTranslatedText("T_MESSAGE_ITEM_SUBTITLE", oResourceBundle, [
								oTableRowContext && sTableFirstColProperty
									? oTableRowContext.getValue(sTableFirstColProperty)
									: oResourceBundle.getText("T_MESSAGE_ITEM_SUBTITLE_INDICATOR_UNKNOWN"),
								sTableTargetColName ? sTableTargetColName : sColumnInfoText
						  ])
						: null;
			}

			//set the subtitle
			message.setSubtitle(sMessageSubtitle);
			var oTableProperties = Object.keys(
				oTable
					.getModel()
					.getMetaModel()
					.getObject(oTable.data("entityType"))
			);
			// TODO: this logic would be moved to check the same at the template time to avoid the same check happening multiple times
			var oComponent = sap.ui.require("sap/ui/core/Component");
			var oNavObject = oTable && oComponent.getOwnerComponentFor(oTable) && oComponent.getOwnerComponentFor(oTable).getNavigation();
			var bSubOPConfigured = false;
			if (oNavObject && Object.keys(oNavObject).indexOf(oTable.getRowBinding().sPath) != -1) {
				bSubOPConfigured =
					oNavObject[oTable.getRowBinding().sPath] &&
					oNavObject[oTable.getRowBinding().sPath].detail &&
					oNavObject[oTable.getRowBinding().sPath].detail.route
						? true
						: false;
			}
			var bIsNavigationConfigured =
				bSubOPConfigured &&
				oTable.getRowAction() &&
				oTable.getRowAction().indexOf("Navigation") != -1 &&
				oTableProperties.indexOf(sTableTargetProperty) != -1
					? true
					: false;
			// Deactivation of the error link when the error column is not displayed
			// but The Link should be displayed if there is no subtitle
			message.setActiveTitle(
				!sMessageSubtitle ||
					bIsNavigationConfigured ||
					bIsCreationRow ||
					(!!sTableTargetColName ? !!oTableRowContext : !!sTableTargetColName)
			);
			return sMessageSubtitle;
		}
		function _bIsOrphanElement(oElement, aElements) {
			return !aElements.some(
				function(oElement, oElem) {
					var oParentElement = oElement.getParent();
					while (oParentElement && oParentElement !== oElem) {
						oParentElement = oParentElement.getParent();
					}
					return oParentElement ? true : false;
				}.bind(this, oElement)
			);
		}
		function _removeMessage(oMessage) {
			var oTemp = sap.ui
				.getCore()
				.getMessageManager()
				.getMessageModel()
				.getData();
			sap.ui
				.getCore()
				.getMessageManager()
				.removeAllMessages();
			oTemp.forEach(function(elt) {
				if (elt !== oMessage) {
					sap.ui
						.getCore()
						.getMessageManager()
						.addMessages([elt]);
				}
			});
		}
		MessageButton.prototype.init = function() {
			Button.prototype.init.apply(this, arguments);
			//press event handler attached to open the message popover
			this.attachPress(this.handleMessagePopoverPress, this);
			this.oMessagePopover = new MessagePopover();
			this.oItemBinding = this.oMessagePopover.getBinding("items");
			this.oItemBinding.attachChange(_setMessageData, this);
			var messageButtonId = this.getId();
			if (messageButtonId) {
				this.oMessagePopover.addCustomData(new sap.ui.core.CustomData({ key: "messageButtonId", value: messageButtonId }));
			}
			this.attachModelContextChange(_applyFiltersAndSort.bind(this));
			this.oMessagePopover.attachActiveTitlePress(_activeTitlePress.bind(this));
		};
		/**
		 * The method that is called when a user clicks on the MessageButton control.
		 *
		 * @param {object} oEvent Event object
		 */
		MessageButton.prototype.handleMessagePopoverPress = function(oEvent) {
			this.oMessagePopover.toggle(oEvent.getSource());
		};
		/**
		 * The method that groups the messages based on the section or subsection they belong to.
		 * This method force the loading of contexts for all tables before to apply the grouping.
		 *
		 * @param {object} oView Current view.
		 * @returns {Promise} Return promise.
		 *
		 * @private
		 */
		MessageButton.prototype._applyGroupingAsync = function(oView) {
			var aWaitForData = [];
			var oViewBindingContext = oView.getBindingContext();
			var _findTablesRelatedToMessages = function(oView) {
				var oRes = [];
				var aMessages = this.oItemBinding.getContexts().map(function(oContext) {
					return oContext.getObject();
				});
				var oViewContext = oView.getBindingContext();
				if (oViewContext) {
					var oObjectPage = oView.getContent()[0];
					this.getVisibleSectionsFromObjectPageLayout(oObjectPage).forEach(function(oSection) {
						oSection.getSubSections().forEach(function(oSubSection) {
							oSubSection.findElements(true).forEach(function(oElem) {
								if (oElem.isA("sap.ui.mdc.Table")) {
									for (var i = 0; i < aMessages.length; i++) {
										var oRowBinding = oElem.getRowBinding();
										if (oRowBinding) {
											var sElemeBindingPath = oViewContext.getPath() + "/" + oElem.getRowBinding().getPath();
											if (aMessages[i].target.indexOf(sElemeBindingPath) === 0) {
												oRes.push({ table: oElem, subsection: oSubSection });
												break;
											}
										}
									}
								}
							});
						});
					});
				}
				return oRes;
			};
			// Search for table related to Messages and initialize the binding context of the parent subsection to retrieve the data
			var oTables = _findTablesRelatedToMessages.bind(this)(oView);
			oTables.forEach(function(_oTable) {
				var oMDCTable = _oTable.table,
					oSubsection = _oTable.subsection;
				if (!oMDCTable.getBindingContext() || oMDCTable.getBindingContext().getPath() !== oViewBindingContext.getPath()) {
					oSubsection.setBindingContext(oViewBindingContext);
					if (!oMDCTable.getRowBinding().isLengthFinal()) {
						aWaitForData.push(
							new Promise(function(resolve) {
								oMDCTable.getRowBinding().attachEventOnce("dataReceived", function() {
									resolve();
								});
							})
						);
					}
				}
			});
			return Promise.all(aWaitForData)
				.then(
					function() {
						// the checkMessages call will refresh the controlIds for each messages
						oView.getModel().checkMessages();
						return new Promise(
							function(resolve) {
								setTimeout(
									function() {
										this._applyGrouping();
										resolve();
									}.bind(this),
									0
								);
							}.bind(this)
						);
					}.bind(this)
				)
				.catch(function() {
					Log.error("Error while grouping the messages in the messagePopOver");
				});
		};
		/**
		 * The method retrieves the visible sections from an objectpage.
		 *
		 * @param {object} oObjectPageLayout The objectPageLayout object for which we want to retrieve the visible sections.
		 * @returns {Array} Array of visible sections.
		 * @private
		 */
		MessageButton.prototype.getVisibleSectionsFromObjectPageLayout = function(oObjectPageLayout) {
			return oObjectPageLayout.getSections().filter(function(oSection) {
				return oSection.getVisible();
			});
		};
		/**
		 * The method that groups the messages based on the section or subsection they belong to.
		 *
		 * @private
		 */
		MessageButton.prototype._applyGrouping = function() {
			var aMessages, aSections;
			this.oObjectPageLayout = _getObjectPageLayout(this, this.oObjectPageLayout);
			if (!this.oObjectPageLayout) {
				return;
			}
			aMessages = this.oMessagePopover.getItems();
			aSections = this.getVisibleSectionsFromObjectPageLayout(this.oObjectPageLayout);
			var bEnableBinding = this._checkControlIdInSections(aMessages, false);
			if (bEnableBinding) {
				this._fnEnableBindings(aSections);
			}
		};
		/**
		 * The method retrieves the binding context for the refError object.
		 * The refError contains a map to store the indexes of the rows with errors.
		 *
		 * @param {object} oTable The table for which we want to get the refError Object.
		 * @returns {object} Context of the refError.
		 * @private
		 */
		MessageButton.prototype._getTableRefErrorContext = function(oTable) {
			var oModel = oTable.getModel("internal");
			//initialize the refError property if it doesn't exist
			if (!oTable.getBindingContext("internal").getProperty("refError")) {
				oModel.setProperty("refError", {}, oTable.getBindingContext("internal"));
			}
			var sRefErrorContextPath =
				oTable.getBindingContext("internal").getPath() +
				"/refError/" +
				oTable
					.getBindingContext()
					.getPath()
					.replace("/", "$") +
				"$" +
				oTable
					.getRowBinding()
					.getPath()
					.replace("/", "$");
			var oContext = oModel.getContext(sRefErrorContextPath);
			if (!oContext.getProperty("")) {
				oModel.setProperty("", {}, oContext);
			}
			return oContext;
		};
		MessageButton.prototype._getBackendMessageToRemove = function(oTable, oMessageObject, oErrorContext) {
			//Test if there is already a message for the same context:
			var oBackendMessageToRemove,
				oContext = this._getTableRefErrorContext(oTable),
				aMessageIds = Object.keys(oContext.getProperty()).filter(function(key) {
					return Object.keys(oContext.getProperty()[key]).every(function(childKey) {
						return key !== oMessageObject.getId() && oContext.getProperty()[key][childKey] === oErrorContext[childKey];
					});
				}),
				aValidMessageIds = sap.ui
					.getCore()
					.getMessageManager()
					.getMessageModel()
					.getData()
					.map(function(oelt) {
						return oelt.id;
					});
			if (aMessageIds.length > 0) {
				aValidMessageIds.indexOf(aMessageIds[0]);
				oBackendMessageToRemove = sap.ui
					.getCore()
					.getMessageManager()
					.getMessageModel()
					.getData()[aValidMessageIds.indexOf(aMessageIds[0])];
			}
			return oBackendMessageToRemove;
		};
		MessageButton.prototype._updateInternalModel = function(
			oTableRowContext,
			iRowIndex,
			sTableTargetColProperty,
			oTable,
			oMessageObject,
			bIsCreationRow
		) {
			var oTemp;
			if (bIsCreationRow) {
				oTemp = {
					rowIndex: "CreationRow",
					targetColProperty: sTableTargetColProperty ? sTableTargetColProperty : ""
				};
			} else {
				oTemp = {
					rowIndex: oTableRowContext ? iRowIndex : "",
					targetColProperty: sTableTargetColProperty ? sTableTargetColProperty : ""
				};
			}
			var oModel = oTable.getModel("internal"),
				oContext = this._getTableRefErrorContext(oTable);
			//we first remove the entries with obsolete message ids from the internal model before inserting the new error info :
			var aValidMessageIds = sap.ui
					.getCore()
					.getMessageManager()
					.getMessageModel()
					.getData()
					.map(function(oelt) {
						return oelt.id;
					}),
				aObsoleteMessagelIds;
			if (oContext.getProperty()) {
				aObsoleteMessagelIds = Object.keys(oContext.getProperty()).filter(function(internalMessageId) {
					return aValidMessageIds.indexOf(internalMessageId) === -1;
				});
				aObsoleteMessagelIds.forEach(function(obsoleteId) {
					delete oContext.getProperty()[obsoleteId];
				});
			}
			oModel.setProperty(
				oMessageObject.getId(),
				Object.assign({}, oContext.getProperty(oMessageObject.getId()) ? oContext.getProperty(oMessageObject.getId()) : {}, oTemp),
				oContext
			);
		};
		MessageButton.prototype._getControlFromMessageRelatingToSubSection = function(subSection, message) {
			var oMessageObject = message.getBindingContext("message").getObject();
			var aElements = subSection
				.findElements(true, function(oElem) {
					return _fnFilterUponIds(oMessageObject.getControlIds(), oElem);
				})
				.sort(function(a, b) {
					// controls are sorted in order to have the table on top of the array
					// it will help to compute the subtitle of the message based on the type of related controls
					if (a.isA("sap.ui.mdc.Table") && !b.isA("sap.ui.mdc.Table")) {
						return -1;
					}
					return 1;
				});
			return aElements;
		};
		/**
		 * The method that sets groups for transient messages.
		 *
		 * @param {object} message The message we want to compute group and subtitle.
		 * @param {string} sActionName The action name.
		 * @private
		 */

		MessageButton.prototype._setGroupLabelForTransientMsg = function(message, sActionName) {
			this.sLastActionText = this.sLastActionText
				? this.sLastActionText
				: sap.ui
						.getCore()
						.getLibraryResourceBundle("sap.fe.core")
						.getText("T_MESSAGE_BUTTON_SAPFE_MESSAGE_GROUP_LAST_ACTION");

			message.setGroupName(this.sLastActionText + ": " + sActionName);
		};

		/**
		 * The method that group messages and add the subtitle.
		 *
		 * @param {object} message The message we want to compute group and subtitle.
		 * @param {object} section The section containing the controls.
		 * @param {object} subSection The subsection containing the controls.
		 * @param {object} aElements List of controls from a subsection related to a message .
		 * @param {boolean} bMultipleSubSections True if there are more than 1 subsection in the section.
		 * @param {string} sActionName The action name.
		 * @returns {object} Return the control targeted by the message.
		 * @private
		 */

		MessageButton.prototype._computeMessageGroupAndSubTitle = function(
			message,
			section,
			subSection,
			aElements,
			bMultipleSubSections,
			sActionName
		) {
			this.oItemBinding.detachChange(_setMessageData, this);
			var oMessageObject = message.getBindingContext("message").getObject();
			var oElement,
				oTable,
				oTableRowBindingContexts,
				oTableRowContext,
				sTableHeader,
				sTableTargetProperty,
				sTableTargetColProperty,
				sTableTargetColName,
				l,
				iRowIndex,
				oTargetedControl,
				oResourceBundle = sap.ui.getCore().getLibraryResourceBundle("sap.fe.core"),
				bIsBackendMessage = new RegExp("^/").test(oMessageObject.getTarget()),
				oBackendMessageToRemove,
				bIsCreationRow;
			if (bIsBackendMessage) {
				for (l = 0; l < aElements.length; l++) {
					oElement = aElements[l];
					oTargetedControl = oElement;
					if (oElement.isA("sap.m.Table") || oElement.isA("sap.ui.table.Table")) {
						oTable = oElement.getParent();
						sTableHeader = oTable.getHeader();
						var oRowBinding = oTable.getRowBinding();
						if (oRowBinding && oRowBinding.isLengthFinal() && oTable.getBindingContext()) {
							sTableTargetColProperty = _getTableColProperty(oTable, oMessageObject);
							var oTableColInfo = _getTableColInfo(oTable, sTableTargetColProperty);
							oTableRowBindingContexts = oElement.isA("sap.ui.table.Table")
								? oRowBinding.getContexts()
								: oRowBinding.getCurrentContexts();
							sTableTargetColName = oTableColInfo.sTableTargetColName;
							sTableTargetProperty = sTableTargetColProperty;
							sTableTargetColProperty = oTableColInfo.sTableTargetColProperty;
							oTableRowContext = oTableRowBindingContexts.find(
								function(oMessageObject, rowContext) {
									return rowContext && oMessageObject.getTarget().indexOf(rowContext.getPath()) === 0;
								}.bind(this, oMessageObject)
							);
							var sControlId;
							if (!oTableRowContext) {
								sControlId = oMessageObject.controlIds.find(
									function(oTable, sId) {
										return _IsControlInTable(oTable, sId);
									}.bind(this, oTable)
								);
							}
							if (sControlId) {
								var oControl = sap.ui.getCore().byId(sControlId);
								bIsCreationRow = _IsControlPartOfCreationRow(oControl);
							}
							_setMessageSubtitle(
								message,
								oTableRowBindingContexts,
								oTableRowContext,
								sTableTargetColName,
								oResourceBundle,
								sTableTargetProperty,
								oTable,
								bIsCreationRow
							);
							iRowIndex = oTableRowContext && oTableRowContext.getIndex();
							this._updateInternalModel(oTableRowContext, iRowIndex, sTableTargetColProperty, oTable, oMessageObject);
						}
					} else {
						message.setActiveTitle(true);
						//check if the targeted control is a child of one of the other controls
						var bIsTargetedControlOrphan = _bIsOrphanElement(oTargetedControl, aElements);
						if (bIsTargetedControlOrphan) {
							//set the subtitle
							message.setSubtitle("");
							break;
						}
					}
				}
			} else {
				//There is only one elt as this is a frontEnd message
				oTargetedControl = aElements[0];
				oTable = _getMdcTable(oTargetedControl);
				if (oTable) {
					sTableHeader = oTable.getHeader();
					var iTargetColumnIndex = _getTableColumnIndex(oTargetedControl);
					sTableTargetColProperty =
						iTargetColumnIndex > -1 ? oTable.getColumns()[iTargetColumnIndex].getDataProperty() : undefined;
					sTableTargetProperty = sTableTargetColProperty;
					sTableTargetColName =
						sTableTargetColProperty && iTargetColumnIndex > -1
							? oTable.getColumns()[iTargetColumnIndex].getHeader()
							: undefined;
					bIsCreationRow = _getTableRow(oTargetedControl).isA("sap.ui.table.CreationRow");
					if (!bIsCreationRow) {
						iRowIndex = _getTableRowIndex(oTargetedControl);
						oTableRowBindingContexts = oTable.getRowBinding().getCurrentContexts();
						oTableRowContext = oTableRowBindingContexts[iRowIndex];
					}
					_setMessageSubtitle(
						message,
						oTableRowBindingContexts,
						oTableRowContext,
						sTableTargetColName,
						oResourceBundle,
						sTableTargetProperty,
						oTable,
						bIsCreationRow
					);
					this._updateInternalModel(oTableRowContext, iRowIndex, sTableTargetColProperty, oTable, oMessageObject, bIsCreationRow);
					if (oTableRowContext) {
						var oErrorContext = {
							rowIndex: oTableRowContext ? iRowIndex : "",
							targetColProperty: sTableTargetColProperty ? sTableTargetColProperty : ""
						};
						oBackendMessageToRemove = this._getBackendMessageToRemove(oTable, oMessageObject, oErrorContext);
					}
				}
			}
			if (oMessageObject.persistent && sActionName) {
				this._setGroupLabelForTransientMsg(message, sActionName);
			} else {
				message.setGroupName(
					section.getTitle() +
						(subSection.getTitle() && bMultipleSubSections ? ", " + subSection.getTitle() : "") +
						(sTableHeader
							? ", " + oResourceBundle.getText("T_MESSAGE_GROUP_TITLE_TABLE_DENOMINATOR") + ": " + sTableHeader
							: "")
				);
				var sViewId = this._getViewId(this.getId());
				var oView = sap.ui.getCore().byId(sViewId);
				var oMessageTargetProperty =
					oMessageObject.getTarget() &&
					oMessageObject
						.getTarget()
						.split("/")
						.pop();
				var oUIModel = oView.getModel("internal");
				if (
					oUIModel &&
					oUIModel.getProperty("/messageTargetProperty") &&
					oMessageTargetProperty &&
					oMessageTargetProperty == oUIModel.getProperty("/messageTargetProperty")
				) {
					this.oMessagePopover.fireActiveTitlePress({ "item": message });
					oUIModel.setProperty("/messageTargetProperty", false);
				}
			}
			this.oItemBinding.attachChange(_setMessageData, this);
			if (oBackendMessageToRemove && !bIsBackendMessage) {
				/*Pending further investigation, along with the deletion of the backendEnd message,
				we remove and reinsert all the other existing messages from the message manager to
				make the highlight	of the field on error persistent.*/
				_removeMessage(oBackendMessageToRemove);
			}
			return oTargetedControl;
		};
		MessageButton.prototype._checkControlIdInSections = function(aMessages, bEnableBinding) {
			var section, aSubSections, aVisibleSections, message, i, j, k;
			this.sGeneralGroupText = this.sGeneralGroupText
				? this.sGeneralGroupText
				: sap.ui
						.getCore()
						.getLibraryResourceBundle("sap.fe.core")
						.getText("T_MESSAGE_BUTTON_SAPFE_MESSAGE_GROUP_GENERAL");
			//Get all sections from the object page layout
			aVisibleSections = this.getVisibleSectionsFromObjectPageLayout(this.oObjectPageLayout);
			if (aVisibleSections) {
				var viewId = this._getViewId(this.getId());
				var oView = sap.ui.getCore().byId(viewId);
				var sActionName =
					oView && oView.getBindingContext("internal") && oView.getBindingContext("internal").getProperty("sActionName");
				if (sActionName) {
					oView.getBindingContext("internal").setProperty("sActionName", null);
				}
				for (i = aMessages.length - 1; i >= 0; --i) {
					// Loop over all messages
					message = aMessages[i];
					var bIsGeneralGroupName = true;
					for (j = aVisibleSections.length - 1; j >= 0; --j) {
						// Loop over all visible sections
						section = aVisibleSections[j];
						aSubSections = section.getSubSections();
						for (k = aSubSections.length - 1; k >= 0; --k) {
							// Loop over all sub-sections
							var subSection = aSubSections[k];
							var aControls = this._getControlFromMessageRelatingToSubSection(subSection, message);
							if (aControls.length > 0) {
								var oTargetedControl = this._computeMessageGroupAndSubTitle(
									message,
									section,
									subSection,
									aControls,
									aSubSections.length > 1,
									sActionName
								);
								// if we found table that matches with the message, we don't stop the loop
								// in case we find an additional control (eg mdc field) that also match with the message
								if (
									oTargetedControl &&
									!oTargetedControl.isA("sap.m.Table") &&
									!oTargetedControl.isA("sap.ui.table.Table")
								) {
									j = k = -1;
								}
								bIsGeneralGroupName = false;
							}
						}
					}
					if (bIsGeneralGroupName) {
						var oMessageObject = message.getBindingContext("message").getObject();
						message.setActiveTitle(false);
						if (oMessageObject.persistent && sActionName) {
							this._setGroupLabelForTransientMsg(message, sActionName);
						} else {
							message.setGroupName(this.sGeneralGroupText);
						}
					}
					if (!bEnableBinding && message.getGroupName() === this.sGeneralGroupText && this._findTargetForMessage(message)) {
						return true;
					}
				}
			}
		};
		MessageButton.prototype._findTargetForMessage = function(message) {
			var messageObject = message.getBindingContext("message") && message.getBindingContext("message").getObject();
			if (messageObject && messageObject.target) {
				var oMetaModel =
						this.oObjectPageLayout && this.oObjectPageLayout.getModel() && this.oObjectPageLayout.getModel().getMetaModel(),
					contextPath = oMetaModel && oMetaModel.getMetaPath(messageObject.target),
					oContextPathMetadata = oMetaModel && oMetaModel.getObject(contextPath);
				if (oContextPathMetadata && oContextPathMetadata.$kind == "Property") {
					return true;
				}
			}
		};
		MessageButton.prototype._fnEnableBindings = function(aSections) {
			for (var iSection = 0; iSection < aSections.length; iSection++) {
				var oSection = aSections[iSection];
				var nonTableChartcontrolFound = false;
				var aSubSections = oSection.getSubSections();
				for (var iSubSection = 0; iSubSection < aSubSections.length; iSubSection++) {
					var oSubSection = aSubSections[iSubSection];
					var oAllBlocks = oSubSection.getBlocks();
					if (oAllBlocks) {
						for (var block = 0; block < oSubSection.getBlocks().length; block++) {
							if (oAllBlocks[block].getContent && !oAllBlocks[block].getContent().isA("sap.fe.macros.TableAPI")) {
								nonTableChartcontrolFound = true;
								break;
							}
						}
						if (nonTableChartcontrolFound) {
							oSubSection.setBindingContext(undefined);
						}
					}
					if (oSubSection.getBindingContext() && this._findMessageGroupAfterRebinding()) {
						oSubSection
							.getBindingContext()
							.getBinding()
							.attachDataReceived(this._findMessageGroupAfterRebinding());
					}
				}
			}
		};
		MessageButton.prototype._findMessageGroupAfterRebinding = function() {
			var aMessages = this.oMessagePopover.getItems();
			this._checkControlIdInSections(aMessages, true);
		};
		/**
		 * The method that retrieves the view ID (HTMLView/XMLView/JSONview/JSView/Templateview) of any control.
		 *
		 * @param {string} sControlId ID of the control needed to retrieve the view ID
		 * @returns {string} The view ID of the control
		 */
		MessageButton.prototype._getViewId = function(sControlId) {
			var sViewId,
				oControl = sap.ui.getCore().byId(sControlId);
			while (oControl) {
				if (oControl instanceof sap.ui.core.mvc.View) {
					sViewId = oControl.getId();
					break;
				}
				oControl = oControl.getParent();
			}
			return sViewId;
		};
		return MessageButton;
	},
	/* bExport= */ true
);
