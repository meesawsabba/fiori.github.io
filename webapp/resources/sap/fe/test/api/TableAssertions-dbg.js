/*
 * ! SAP UI development toolkit for HTML5 (SAPUI5)
        (c) Copyright 2009-2021 SAP SE. All rights reserved
    
 */
sap.ui.define(
	[
		"./TableAPI",
		"sap/fe/test/Utils",
		"sap/ui/test/OpaBuilder",
		"sap/fe/test/builder/FEBuilder",
		"sap/fe/test/builder/MdcTableBuilder",
		"sap/fe/test/builder/MdcFilterFieldBuilder",
		"sap/ui/core/SortOrder",
		"./APIHelper"
	],
	function(TableAPI, Utils, OpaBuilder, FEBuilder, TableBuilder, FilterFieldBuilder, SortOrder, APIHelper) {
		"use strict";

		/**
		 * Constructs a new TableAssertions instance.
		 *
		 * @param {sap.fe.test.builder.TableBuilder} oBuilderInstance The builder instance used to interact with the UI
		 * @param {string} [vTableDescription] Description (optional) of the table to be used for logging messages
		 * @returns {sap.fe.test.api.TableAssertions} The new instance
		 * @alias sap.fe.test.api.TableAssertions
		 * @class
		 * @extends sap.fe.test.api.TableAPI
		 * @hideconstructor
		 * @public
		 */
		var TableAssertions = function(oBuilderInstance, vTableDescription) {
			return TableAPI.call(this, oBuilderInstance, vTableDescription);
		};
		TableAssertions.prototype = Object.create(TableAPI.prototype);
		TableAssertions.prototype.constructor = TableAssertions;
		TableAssertions.prototype.isAction = false;

		/**
		 * Checks the state of the table.
		 *
		 * @param {object} [mState] Defines the expected state of the table
		 * @returns {object} The result of the {@link sap.ui.test.Opa5#waitFor} function, to be used for chained statements
		 *
		 * @public
		 */
		TableAssertions.prototype.iCheckState = function(mState) {
			var oTableBuilder = this.getBuilder();
			return this.prepareResult(
				oTableBuilder
					.hasState(mState)
					.description(Utils.formatMessage("Checking table '{0}' in state '{1}'", this.getIdentifier(), mState))
					.execute()
			);
		};

		/**
		 * Checks the rows of a table.
		 * If <code>mRowValues</code> is provided, only rows with the corresponding values are considered.
		 * If <code>iNumberOfRows</code> is provided, the number of rows are checked with respect to the provided <code>mRowValues</code> (if set) or in total.
		 * If <code>iNumberOfRows</code> is omitted, it checks for at least one matching row.
		 * If <code>mState</code> is provided, the row must be in the given state.
		 *
		 * @param {object} [mRowValues] Defines the row values of the target row. The pattern is:
		 * <code><pre>
		 * 	{
		 * 		&lt;column-name-or-index>: &lt;expected-value>
		 *  }
		 * </pre></code>
		 * @param {number} [iExpectedNumberOfRows] The expected number of rows considering <code>mRowValues</code> and <code>mRowState</code>
		 * @param {object} [mState] Defines the expected state of the target row
		 * @param {Array} [vEmptyColumns] Defines the expected empty columns
		 * @returns {object} The result of the {@link sap.ui.test.Opa5#waitFor} function, to be used for chained statements
		 *
		 * @public
		 */
		TableAssertions.prototype.iCheckRows = function(mRowValues, iExpectedNumberOfRows, mState, vEmptyColumns) {
			var aArguments = Utils.parseArguments([Object, Number, Object, Array], arguments),
				iNumberOfRows = aArguments[1],
				aRowMatcher = TableAPI.createRowMatchers(aArguments[0], aArguments[2], undefined, aArguments[3]),
				oTableBuilder = this.getBuilder();

			// the order of the matchers matters here
			if (aRowMatcher.length) {
				// if matchers are defined, first match rows, then check number of results
				oTableBuilder.hasRows(aRowMatcher, true).has(function(aRows) {
					return Utils.isOfType(iNumberOfRows, Number) ? aRows.length === iNumberOfRows : aRows.length > 0;
				});
			} else {
				// if no row matchers are defined, check the numbers of row based on table (binding)
				oTableBuilder
					.hasNumberOfRows(iNumberOfRows)
					// but still ensure that matcher returns the row aggregation
					.hasRows(null, true);
			}

			return this.prepareResult(
				oTableBuilder
					.description(
						Utils.formatMessage(
							"Checking table '{0}' having {1} rows with values='{2}', state='{3}' and empty columns='{4}'",
							this.getIdentifier(),
							iNumberOfRows === undefined ? "> 0" : iNumberOfRows,
							aArguments[0],
							aArguments[2],
							aArguments[3]
						)
					)
					.execute()
			);
		};

		/**
		 * Checks the state of the CreationRow button in the table.
		 *
		 * @param {object} [mRowValues] Defines the expected row values. The pattern is:
		 * <code><pre>
		 * 	{
		 * 		&lt;column-name-or-index>: &lt;expected-value>
		 *  }
		 * </pre></code>
		 * @param {object} [mState] Defines the expected state of the target row
		 * @returns {object} The result of the {@link sap.ui.test.Opa5#waitFor} function, to be used for chained statements
		 *
		 * @public
		 */
		TableAssertions.prototype.iCheckCreationRow = function(mRowValues, mState) {
			var oTableBuilder = this.getBuilder();
			return this.prepareResult(
				oTableBuilder
					.has(
						OpaBuilder.Matchers.childrenMatcher(
							FEBuilder.create(this)
								.hasType("sap.ui.table.CreationRow")
								.has(TableBuilder.Row.Matchers.cellValues(mRowValues))
								.hasState(mState)
						)
					)
					.description(
						Utils.formatMessage(
							"Checking table '{0}' having a CreationRow with values='{1}' and state='{2}'",
							this.getIdentifier(),
							mRowValues,
							mState
						)
					)
					.execute()
			);
		};

		/**
		 * Checks the number of items in the quick-filter menu.
		 *
		 * @param {number} iExpectedNumberOfItems The expected number of quick-filter items
		 * @returns {object} The result of the {@link sap.ui.test.Opa5#waitFor} function, to be used for chained statements
		 *
		 * @public
		 */
		TableAssertions.prototype.iCheckQuickFilterItems = function(iExpectedNumberOfItems) {
			return this.prepareResult(
				this.getBuilder()
					.hasQuickFilterItems(iExpectedNumberOfItems)
					.description(
						Utils.formatMessage("Checking table '{0}' having  '{1}' item(s)", this.getIdentifier(), iExpectedNumberOfItems)
					)
					.execute()
			);
		};

		/**
		 * Checks the state of the columns of the table.
		 *
		 * @param {number} [iExpectedNumberOfColumns] The expected number of columns
		 * @param {object} [mColumnStateMap] A map of columns and their expected state. The map looks like
		 * <code><pre>
		 * 	{
		 * 		&lt;columnName | columnLabel | columnIndex>: {
		 *			header: "My header"
		 * 		}
		 * 	}
		 * </pre></code>
		 * @returns {object} The result of the {@link sap.ui.test.Opa5#waitFor} function, to be used for chained statements
		 *
		 * @public
		 */
		TableAssertions.prototype.iCheckColumns = function(iExpectedNumberOfColumns, mColumnStateMap) {
			var aArguments = Utils.parseArguments([Number, Object], arguments),
				mColumns = aArguments[1],
				iNumberOfColumns = aArguments[0],
				oTableBuilder = this.getBuilder();

			if (iNumberOfColumns !== undefined) {
				oTableBuilder.hasAggregationLength("columns", iNumberOfColumns);
			} else {
				oTableBuilder.hasAggregation("columns");
			}
			oTableBuilder.hasColumns(mColumns);

			return this.prepareResult(
				oTableBuilder
					.description(
						Utils.formatMessage(
							"Checking table '{0}' having {1} columns and column states='{2}'",
							this.getIdentifier(),
							iNumberOfColumns === undefined ? "> 0" : iNumberOfColumns,
							mColumns
						)
					)
					.execute()
			);
		};

		/**
		 * Checks the state of the cells of a table.
		 *
		 * @param {object | number} [vRowValues] Defines the row values of the target row. The pattern is:
		 * <code><pre>
		 * 	{
		 * 		&lt;column-name-or-index>: &lt;expected-value>
		 *  }
		 * </pre></code>
		 * Alternatively, the 0-based row index can be used.
		 * @param {object} mColumnStateMap A map of columns and their state. The map looks like
		 * <code><pre>
		 * 	{
		 * 		&lt;column-name-or-index>: {
		 *			header: "My header"
		 * 		}
		 * 	}
		 * </pre></code>
		 * @returns {object} The result of the {@link sap.ui.test.Opa5#waitFor} function, to be used for chained statements
		 *
		 * @public
		 */
		TableAssertions.prototype.iCheckCells = function(vRowValues, mColumnStateMap) {
			var mRows = arguments.length > 1 ? arguments[0] : undefined,
				mColumns = arguments.length > 1 ? arguments[1] : arguments[0],
				aRowMatcher = TableAPI.createRowMatchers(mRows, TableBuilder.Row.Matchers.cellProperties(mColumns)),
				oTableBuilder = this.getBuilder();

			return this.prepareResult(
				oTableBuilder
					.hasRows(aRowMatcher)
					.description(
						Utils.formatMessage(
							"Checking table '{0}' having cells properties '{2}' of rows with values '{1}'",
							this.getIdentifier(),
							mRows,
							mColumns
						)
					)
					.execute()
			);
		};

		/**
		 * Checks the state of a table action.
		 *
		 * @param {string | sap.fe.test.api.ActionIdentifier} vActionIdentifier The identifier of the action, or its label
		 * @param {object} [mState] Defines the expected state of the button
		 * @returns {object} The result of the {@link sap.ui.test.Opa5#waitFor} function, to be used for chained statements
		 *
		 * @public
		 */
		TableAssertions.prototype.iCheckAction = function(vActionIdentifier, mState) {
			var oTableBuilder = this.getBuilder(),
				vActionMatcher = this.createActionMatcher(vActionIdentifier),
				vAggregationMatcher = FEBuilder.Matchers.deepAggregationMatcher("actions/action", [
					vActionMatcher,
					FEBuilder.Matchers.states(mState)
				]);

			if (mState && mState.visible === false) {
				// two possibilities for non-visible action: either visible property is false, or the control wasn't rendered at all
				vAggregationMatcher = OpaBuilder.Matchers.some(
					vAggregationMatcher,
					OpaBuilder.Matchers.not(FEBuilder.Matchers.deepAggregationMatcher("actions/action", vActionMatcher))
				);
			}

			return this.prepareResult(
				oTableBuilder
					.has(vAggregationMatcher)
					.description(
						Utils.formatMessage(
							"Checking table '{0}' having action '{1}' with state='{2}'",
							this.getIdentifier(),
							vActionIdentifier.service === "StandardAction" ? vActionIdentifier.action : vActionIdentifier,
							mState
						)
					)
					.execute()
			);
		};

		/**
		 * Checks an action in the drop-down menu that is currently open.
		 *
		 * @param {object | string} vAction The label of the action, or its state
		 * @returns {object} The result of the {@link sap.ui.test.Opa5#waitFor} function, to be used for chained statements
		 *
		 * @public
		 */
		TableAssertions.prototype.iCheckMenuAction = function(vAction) {
			return this.prepareResult(APIHelper.createMenuActionCheckBuilder(vAction).execute());
		};

		/**
		 * Checks the <code>Delete</code> action of the table.
		 *
		 * @param {object} [mState] Defines the expected state of the button
		 * @returns {object} The result of the {@link sap.ui.test.Opa5#waitFor} function, to be used for chained statements
		 *
		 * @public
		 */
		TableAssertions.prototype.iCheckDelete = function(mState) {
			return this.iCheckAction({ service: "StandardAction", action: "Delete", unbound: true }, mState);
		};

		/**
		 * Checks the search field in the table toolbar. If the <code>sSearchText</code> parameter is <code>undefined</code>, the search text is not validated.
		 *
		 * @param {string} [sSearchText] The expected text in the search field
		 * @param {object} [mState] Defines the expected state of the search field
		 * @returns {object} The result of the {@link sap.ui.test.Opa5#waitFor} function that can be used for chaining statements
		 *
		 * @public
		 */
		TableAssertions.prototype.iCheckSearchField = function(sSearchText, mState) {
			var aArguments = Utils.parseArguments([String, Object], arguments),
				oTableBuilder = this.getBuilder();
			return this.prepareResult(
				oTableBuilder
					.hasSearchField(sSearchText, mState)
					.description(
						Utils.formatMessage(
							"Checking the search field on table '{0}' having search text '{1}' and state='{2}'",
							this.getIdentifier(),
							aArguments[0] || "",
							aArguments[1]
						)
					)
					.execute()
			);
		};

		/**
		 * Checks the <code>Create</code> action of the table.
		 *
		 * @param {object} [mState] Defines the expected state of the button
		 * @returns {object} The result of the {@link sap.ui.test.Opa5#waitFor} function, to be used for chained statements
		 *
		 * @public
		 */
		TableAssertions.prototype.iCheckCreate = function(mState) {
			return this.iCheckAction({ service: "StandardAction", action: "Create", unbound: true }, mState);
		};

		/**
		 * Checks the <code>Paste</code> action of the table.
		 *
		 * @param {object} [mState] Defines the expected state of the button
		 * @returns {object} The result of the {@link sap.ui.test.Opa5#waitFor} function, to be used for chained statements
		 *
		 * @public
		 */
		TableAssertions.prototype.iCheckPaste = function(mState) {
			return this.iCheckAction({ service: "StandardAction", action: "Paste", unbound: true }, mState);
		};

		/**
		 * Checks the <code>Fullscreen</code> action of the table.
		 *
		 * @param {object} [mState] Defines the expected state of the button
		 * @returns {object} The result of the {@link sap.ui.test.Opa5#waitFor} function, to be used for chained statements
		 *
		 * @public
		 */
		TableAssertions.prototype.iCheckFullScreen = function(mState) {
			return this.iCheckAction({ service: "StandardAction", action: "FullScreen", unbound: true }, mState);
		};

		TableAssertions.prototype._iCheckTableProvidedAction = function(sProvidedAction) {
			var oTableBuilder = this.getBuilder();
			return this.prepareResult(
				oTableBuilder["has" + sProvidedAction]()
					.description(
						Utils.formatMessage("Checking table '{0}' having button available for '{1}'", this.getIdentifier(), sProvidedAction)
					)
					.execute()
			);
		};

		/**
		 * Checks whether the adaptation button is available for the table.
		 *
		 * @returns {object} The result of the {@link sap.ui.test.Opa5#waitFor} function, to be used for chained statements
		 *
		 * @public
		 */
		TableAssertions.prototype.iCheckColumnAdaptation = function() {
			return this._iCheckTableProvidedAction("ColumnAdaptation");
		};

		/**
		 * Checks whether the sort button is available for the table.
		 *
		 * @returns {object} The result of the {@link sap.ui.test.Opa5#waitFor} function, to be used for chained statements
		 *
		 * @public
		 */
		TableAssertions.prototype.iCheckColumnSorting = function() {
			this.iOpenColumnSorting();
			TableBuilder.createSortingDialogBuilder(this.getOpaInstance()).execute();
			return this.iConfirmColumnSorting();
		};

		/**
		 * Checks whether the filter button is available for the table.
		 *
		 * @returns {object} The result of the {@link sap.ui.test.Opa5#waitFor} function, to be used for chained statements
		 *
		 * @public
		 */
		TableAssertions.prototype.iCheckColumnFiltering = function() {
			this.iOpenFilterDialog();
			TableBuilder.createFilteringDialogBuilder(this.getOpaInstance()).execute();
			return this.iConfirmFilterDialog();
			// return this._iCheckTableProvidedAction("ColumnAdaptation");
		};

		/**
		 * Checks whether the export button is available for the table.
		 *
		 * @returns {object} The result of the {@link sap.ui.test.Opa5#waitFor} function, to be used for chained statements
		 *
		 * @public
		 */
		TableAssertions.prototype.iCheckExport = function() {
			return this._iCheckTableProvidedAction("ColumnExport");
		};

		/**
		 * Checks the quick filter action of the table.
		 *
		 * @param {object} [mState] Defines the expected state of the control
		 * @returns {object} The result of the {@link sap.ui.test.Opa5#waitFor} function, to be used for chained statements
		 *
		 * @public
		 */
		TableAssertions.prototype.iCheckQuickFilter = function(mState) {
			var oTableBuilder = this.getBuilder();
			return this.prepareResult(
				oTableBuilder
					.hasAggregation("quickFilter", FEBuilder.Matchers.states(mState))
					.description(
						Utils.formatMessage(
							"Checking that table '{0}' has a QuickFilter Control with state='{1}'",
							this.getIdentifier(),
							mState
						)
					)
					.execute()
			);
		};

		/**
		 * Checks whether the column adaptation dialog is open.
		 *
		 * @returns {object} The result of the {@link sap.ui.test.Opa5#waitFor} function, to be used for chained statements
		 *
		 * @public
		 */
		TableAssertions.prototype.iCheckColumnAdaptationDialog = function() {
			var oAdaptationDialogBuilder = TableBuilder.createAdaptationDialogBuilder(this.getOpaInstance());
			return this.prepareResult(
				oAdaptationDialogBuilder
					.description(Utils.formatMessage("Checking column adaptation dialog for table '{0}'", this.getIdentifier()))
					.execute()
			);
		};

		/**
		 * Checks a field in the adaptation dialog.
		 *
		 * @param {string | sap.fe.test.api.ColumnIdentifier} vColumnIdentifier The identifier of the column, or its label
		 * @param {object} [mState] Defines the expected state of the field control in the adaptation dialog
		 * @returns {object} The result of the {@link sap.ui.test.Opa5#waitFor} function, to be used for chained statements
		 *
		 * @public
		 */
		TableAssertions.prototype.iCheckAdaptationColumn = function(vColumnIdentifier, mState) {
			return this.columnAdaptation(
				vColumnIdentifier,
				mState,
				undefined,
				Utils.formatMessage(
					"Checking adaptation column '{1}' on table '{0}' for state='{2}'",
					this.getIdentifier(),
					vColumnIdentifier,
					mState
				)
			);
		};

		/**
		 * Checks a field in the sorting dialog.
		 *
		 * @param {string | sap.fe.test.api.ColumnIdentifier} vColumnIdentifier The identifier of the column, or its label
		 * @param {sap.ui.core.SortOrder} [sSortOrder] The sort order of the column, default is {@link sap.ui.core.SortOrder.Ascending}
		 * @param {boolean} [bCheckPersonalization] Defines if the order is checked via sorting dialog, or via the column itself
		 * @returns {object} The result of the {@link sap.ui.test.Opa5#waitFor} function, to be used for chained statements
		 *
		 * @public
		 */
		TableAssertions.prototype.iCheckSortOrder = function(vColumnIdentifier, sSortOrder, bCheckPersonalization) {
			var aArguments = Utils.parseArguments([[String, Object], String, Boolean], arguments);
			sSortOrder = aArguments[1] || SortOrder.Ascending;
			bCheckPersonalization = aArguments[2];

			var sDescription = Utils.formatMessage(
				"Checking column '{1}' on table '{0}' to be sorted '{2}'",
				this.getIdentifier(),
				vColumnIdentifier,
				sSortOrder
			);

			// either check via sorting dialog...
			if (bCheckPersonalization) {
				var mState = {};
				mState.sortOrder = sSortOrder;
				return this.columnSorting(vColumnIdentifier, mState, undefined, sDescription);
			}

			// ... or check the columns itself (default)
			var mColumnDefinition = {};
			mColumnDefinition[Utils.isOfType(vColumnIdentifier, Object) ? vColumnIdentifier.name : vColumnIdentifier] = {
				sortOrder: sSortOrder
			};
			return this.prepareResult(
				this.getBuilder()
					.hasColumns(mColumnDefinition)
					.description(sDescription)
					.execute()
			);
		};

		/**
		 * Checks a filter field in the filter dialog.
		 *
		 * @param {string | sap.fe.test.api.ColumnIdentifier} vColumnIdentifier The identifier of the field, or its label
		 * @param {object} [mState] Defines the expected state of the field control in the filter dialog
		 * @returns {object} The result of the {@link sap.ui.test.Opa5#waitFor} function, to be used for chained statements
		 *
		 * @public
		 */
		TableAssertions.prototype.iCheckFilterField = function(vColumnIdentifier, mState) {
			var oFilterFieldBuilder = FilterFieldBuilder.create(this.getOpaInstance())
					.isDialogElement()
					.hasType("sap.ui.mdc.FilterField")
					.description(
						Utils.formatMessage(
							"Checking the filter field '{0}' of table '{1}' in state '{2}'",
							vColumnIdentifier,
							this.getIdentifier(),
							mState
						)
					),
				oFilterFieldMatcher = Utils.isOfType(vColumnIdentifier, String)
					? OpaBuilder.Matchers.properties({ label: vColumnIdentifier })
					: OpaBuilder.Matchers.properties({ fieldPath: vColumnIdentifier.name }),
				bDialogOpen,
				bCheckForNotVisible = mState && mState.visible === false,
				fnOpenDialog = this.iOpenFilterDialog.bind(this),
				fnCloseDialog = this.iConfirmFilterDialog.bind(this);

			if (bCheckForNotVisible) {
				oFilterFieldBuilder.check(function(aFoundFilterFields) {
					// every field should not match name/fieldPath
					return aFoundFilterFields.every(function(oFilterField) {
						return OpaBuilder.Matchers.not(oFilterFieldMatcher)(oFilterField);
					});
				});
			} else {
				oFilterFieldBuilder.has(oFilterFieldMatcher).checkNumberOfMatches(1);
				if (!Utils.isOfType(mState, [null, undefined])) {
					oFilterFieldBuilder.hasState(mState);
				}
			}

			return this.prepareResult(
				FEBuilder.create(this.getOpaInstance())
					.success(function() {
						bDialogOpen = FEBuilder.controlsExist(oFilterFieldBuilder);
						if (!bDialogOpen) {
							fnOpenDialog();
							oFilterFieldBuilder.success(fnCloseDialog);
						}
						return oFilterFieldBuilder.execute();
					})
					.execute()
			);
		};
		/**
		 * Checks a messageStrip on a table.
		 *
		 * @param {object} [mProperty] Defines the expected properties of the messageStrip in the table
		 * @returns {object} The result of the {@link sap.ui.test.Opa5#waitFor} function, to be used for chained statements
		 *
		 * @public
		 */
		TableAssertions.prototype.iCheckMessageStrip = function(mProperty) {
			var oTableBuilder = this.getBuilder();
			return this.prepareResult(
				oTableBuilder
					.has(
						OpaBuilder.Matchers.childrenMatcher(
							FEBuilder.create(this)
								.hasType("sap.m.MessageStrip")
								.hasProperties(mProperty)
						)
					)
					.description(
						Utils.formatMessage(
							"Checking table '{0}' having a MessageStrip with text ='{1}' and type ='{2}'",
							this.getIdentifier(),
							mProperty.text,
							mProperty.type
						)
					)
					.execute()
			);
		};

		/**
		 * Checks if a given column supports grouping.
		 * If <code>iExpectedNumber</code> and <code>sFieldLabel</code> are not provided, we just check that the column header has a group icon.
		 * If <code>iExpectedNumber</code> is provided, we check that the column has exactly this number of grouping options.
		 * If <code>sFieldLabel</code> is provided, we check that the column can be grouped on this field.
		 *
		 * @param {string | sap.fe.test.api.ColumnIdentifier | number} vColumnIdentifier The identifier of the column field, its label or index
		 * @param {number} iExpectedNumber The expected number of group options
		 * @param {string} sFieldLabel The target field to group on in case of a complex property
		 * @returns {object} The result of the {@link sap.ui.test.Opa5#waitFor} function, to be used for chained statements
		 */
		TableAssertions.prototype.iCheckGroupByColumn = function(vColumnIdentifier, iExpectedNumber, sFieldLabel) {
			var oTableBuilder = this.getBuilder(),
				vColumn = Utils.isOfType(vColumnIdentifier, Object) ? vColumnIdentifier.name : vColumnIdentifier;
			return this.prepareResult(
				oTableBuilder
					.hasGroupByColumn(vColumn, sFieldLabel, iExpectedNumber)
					.description(
						Utils.formatMessage(
							"Checking table '{0}' having {1} groupBy options for {2}{3}",
							this.getIdentifier(),
							iExpectedNumber === undefined ? "any" : iExpectedNumber,
							vColumnIdentifier,
							sFieldLabel ? "/" + sFieldLabel : ""
						)
					)
					.execute()
			);
		};

		/**
		 * Checks if a given column supports aggregations.
		 * If <code>iExpectedNumber</code> and <code>sFieldLabel</code> are not provided, we just check that the column header has an aggregation icon.
		 * If <code>iExpectedNumber</code> is provided, we check that the column has exactly this number of aggregation options.
		 * If <code>sFieldLabel</code> is provided, we check that the column can be aggregated on this field.
		 *
		 * @param {string | sap.fe.test.api.ColumnIdentifier | number} vColumnIdentifier The identifier of the column field, its label or index
		 * @param {number} iExpectedNumber The expected number of aggregation options
		 * @param {string} sFieldLabel The target field to aggregate on in case of a complex property
		 * @returns {object} The result of the {@link sap.ui.test.Opa5#waitFor} function, to be used for chained statements
		 */
		TableAssertions.prototype.iCheckAggregationColumn = function(vColumnIdentifier, iExpectedNumber, sFieldLabel) {
			var oTableBuilder = this.getBuilder(),
				vColumn = Utils.isOfType(vColumnIdentifier, Object) ? vColumnIdentifier.name : vColumnIdentifier;
			return this.prepareResult(
				oTableBuilder
					.hasAggregationColumn(vColumn, sFieldLabel, iExpectedNumber)
					.description(
						Utils.formatMessage(
							"Checking table '{0}' having {1} aggregate options for {2}{3}",
							this.getIdentifier(),
							iExpectedNumber === undefined ? "any" : iExpectedNumber,
							vColumnIdentifier,
							sFieldLabel ? "/" + sFieldLabel : ""
						)
					)
					.execute()
			);
		};

		return TableAssertions;
	}
);
