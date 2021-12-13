import {
	CriticalityType,
	DataField,
	DataFieldAbstractTypes,
	DataFieldForAction,
	DataFieldForAnnotation,
	DataFieldForIntentBasedNavigation,
	DataFieldTypes,
	DataPoint,
	EnumValue,
	LineItem,
	PathAnnotationExpression,
	PresentationVariantTypeTypes,
	PropertyAnnotationValue,
	PropertyPath,
	SelectionVariantType,
	SelectOptionType,
	UIAnnotationTypes
} from "@sap-ux/vocabularies-types";
import {
	ActionType,
	AvailabilityType,
	CreationMode,
	FormatOptionsType,
	HorizontalAlign,
	ManifestTableColumn,
	NavigationSettingsConfiguration,
	NavigationTargetConfiguration,
	SelectionMode,
	TableColumnSettings,
	TableManifestConfiguration,
	TemplateType,
	VariantManagementType,
	ViewPathConfiguration,
	VisualizationType
} from "../../ManifestSettings";
import { EntityType, Property } from "@sap-ux/annotation-converter";
import { TableID } from "../../helpers/ID";
import {
	AnnotationAction,
	BaseAction,
	CustomAction,
	getActionsFromManifest,
	isActionNavigable,
	removeDuplicateActions
} from "sap/fe/core/converters/controls/Common/Action";
import { ConfigurableObject, CustomElement, insertCustomElements, Placement } from "sap/fe/core/converters/helpers/ConfigurableObject";
import {
	collectRelatedProperties,
	collectRelatedPropertiesRecursively,
	ComplexPropertyInfo,
	getDataFieldDataType,
	getSemanticObjectPath,
	isDataFieldAlwaysHidden,
	isDataFieldForActionAbstract,
	isDataFieldTypes
} from "sap/fe/core/converters/annotations/DataField";
import {
	and,
	annotationExpression,
	BindingExpression,
	bindingExpression,
	BindingExpressionExpression,
	compileBinding,
	constant,
	equal,
	Expression,
	ExpressionOrPrimitive,
	formatResult,
	ifElse,
	isBinding,
	isConstant,
	not,
	or,
	resolveBindingString
} from "sap/fe/core/helpers/BindingExpression";
import { Draft, bindingContextPathVisitor, singletonPathVisitor, UI } from "sap/fe/core/converters/helpers/BindingHelper";
import { KeyHelper } from "sap/fe/core/converters/helpers/Key";
import tableFormatters from "sap/fe/core/formatters/TableFormatter";
import { MessageType } from "sap/fe/core/formatters/TableFormatterTypes";
import {
	DataModelObjectPath,
	getTargetObjectPath,
	isPathDeletable,
	isPathSearchable,
	isPathInsertable,
	isPathUpdatable
} from "sap/fe/core/templating/DataModelPathHelper";
import { replaceSpecialChars } from "sap/fe/core/helpers/StableIdHelper";
import { IssueCategory, IssueSeverity, IssueType } from "sap/fe/core/converters/helpers/IssueManager";

import ManifestWrapper from "../../ManifestWrapper";
import ConverterContext from "../../ConverterContext";
import {
	isProperty,
	getAssociatedUnitProperty,
	getAssociatedCurrencyProperty,
	isPathExpression,
	getTargetValueOnDataPoint
} from "sap/fe/core/templating/PropertyHelper";
import { AggregationHelper } from "../../helpers/Aggregation";
import { DisplayMode, getDisplayMode, getTypeConfig } from "sap/fe/core/templating/UIFormatters";
import { getMessageTypeFromCriticalityType } from "./Criticality";
import { FilterFunctions } from "@sap-ux/vocabularies-types/dist/generated/Capabilities";
import { getNonSortablePropertiesRestrictions } from "sap/fe/core/templating/EntitySetHelper";

export type TableAnnotationConfiguration = {
	autoBindOnInit: boolean;
	collection: string;
	variantManagement: VariantManagementType;
	filterId?: string;
	id: string;
	navigationPath: string;
	p13nMode?: string;
	row?: {
		action?: string;
		press?: string;
		rowHighlighting: BindingExpression<MessageType>;
		rowNavigated: BindingExpression<boolean>;
	};
	selectionMode: string | undefined;
	show?: {
		create?: string | boolean;
		delete?: string | boolean;
		paste?: BindingExpression<boolean>;
		massEdit?: { visible: boolean | string; enabled: boolean | string };
	};
	displayMode?: boolean;
	threshold: number;
	entityName: string;
	sortConditions?: string;
	groupConditions?: string;
	aggregateConditions?: string;

	/** Create new entries */
	create: CreateBehaviour | CreateBehaviourExternal;
	parentEntityDeleteEnabled?: BindingExpression<boolean>;
	title: string;
	searchable: boolean;
};

/**
 * New entries are created within the app (default case)
 */
type CreateBehaviour = {
	mode: CreationMode;
	append: Boolean;
	newAction?: string;
	navigateToTarget?: string;
};

/**
 * New entries are created by navigating to some target
 */
type CreateBehaviourExternal = {
	mode: "External";
	outbound: string;
	outboundDetail: NavigationTargetConfiguration["outboundDetail"];
	navigationSettings: NavigationSettingsConfiguration;
};

export type TableCapabilityRestriction = {
	isDeletable: boolean;
	isUpdatable: boolean;
};

export type TableFiltersConfiguration = {
	enabled?: string | boolean;
	paths: [
		{
			annotationPath: string;
		}
	];
	showCounts?: boolean;
};

export type SelectionVariantConfiguration = {
	propertyNames: string[];
	text?: string;
};

export type TableControlConfiguration = {
	createAtEnd: boolean;
	creationMode: CreationMode;
	disableAddRowButtonForEmptyData: boolean;
	customValidationFunction: string | undefined;
	useCondensedTableLayout: boolean;
	enableExport: boolean;
	headerVisible: boolean;
	filters?: Record<string, TableFiltersConfiguration>;
	type: TableType;
	selectAll?: boolean;
	selectionLimit: number;
	multiSelectMode: string | undefined;
	enablePaste: boolean;
	enableFullScreen: boolean;
	showRowCount: boolean;
	enableMassEdit: boolean | undefined;
	enableAutoColumnWidth: boolean;
};

export type TableType = "GridTable" | "ResponsiveTable" | "AnalyticalTable";

enum ColumnType {
	Default = "Default", // Default Type
	Annotation = "Annotation",
	Slot = "Slot"
}

export type BaseTableColumn = ConfigurableObject & {
	id: string;
	width?: string;
	name: string;
	availability?: AvailabilityType;
	type: ColumnType; //Origin of the source where we are getting the templated information from,
	isNavigable?: boolean;
	settings?: TableColumnSettings;
	semanticObjectPath?: string;
	propertyInfos?: string[];
	caseSensitive?: boolean;
	sortable: boolean;
	horizontalAlign?: HorizontalAlign;
	formatOptions: FormatOptionsType;
};

export type CustomTableColumn = BaseTableColumn & {
	header?: string;
	template: string;
};

export type AnnotationTableColumn = BaseTableColumn & {
	annotationPath: string;
	relativePath: string;
	label?: string;
	groupLabel?: string;
	group?: string;
	isGroupable?: boolean;
	isKey?: boolean;
	unit?: string;
	exportSettings?: {
		template?: string;
		label?: string;
		fieldLabel?: string;
		wrap?: boolean;
		type?: string;
		inputFormat?: string;
		format?: string;
		scale?: number;
		delimiter?: boolean;
		trueValue?: boolean;
		falseValue?: boolean;
	};
	isDataPointFakeTargetProperty?: boolean;
	textArrangement?: {
		textProperty: string;
		mode: DisplayMode;
	};
	exportContactProperty?: string;
	additionalPropertyInfos?: string[];
	visualSettings?: VisualSettings;
	typeConfig?: object;
};

export type VisualSettings = {
	widthCalculation?: WidthCalculation;
};

export type WidthCalculation =
	| null
	| {
			minWidth?: number;
			maxWidth?: number;
			defaultWidth?: number;
			includeLabel?: boolean;
			gap?: number;
			// only relevant for complex types
			excludeProperties?: string | string[];
			verticalArrangement?: boolean;
	  };

export type TableColumn = CustomTableColumn | AnnotationTableColumn;

export type CustomColumn = CustomElement<TableColumn>;

export type AggregateData = {
	defaultAggregate: {
		contextDefiningProperties?: string[];
	};
	relativePath: string;
};

export type TableVisualization = {
	type: VisualizationType.Table;
	annotation: TableAnnotationConfiguration;
	control: TableControlConfiguration;
	columns: TableColumn[];
	actions: BaseAction[];
	aggregates?: Record<string, AggregateData>;
	enableAnalytics?: boolean;
	enableDataStateFilter: boolean;
	operationAvailableMap: string;
	operationAvailableProperties: string;
};

type SorterType = {
	name: string;
	descending: boolean;
};

/**
 * Returns an array of all annotation-based and manifest-based table actions.
 *
 * @param {LineItem} lineItemAnnotation
 * @param {string} visualizationPath
 * @param {ConverterContext} converterContext
 * @param {NavigationSettingsConfiguration} navigationSettings
 * @returns {BaseAction} The complete table actions
 */
export function getTableActions(
	lineItemAnnotation: LineItem,
	visualizationPath: string,
	converterContext: ConverterContext,
	navigationSettings?: NavigationSettingsConfiguration
): BaseAction[] {
	const aTableActions = getTableAnnotationActions(lineItemAnnotation, visualizationPath, converterContext);
	const aAnnotationActions = aTableActions.tableActions;
	const aHiddenActions = aTableActions.hiddenTableActions;
	return insertCustomElements(
		aAnnotationActions,
		getActionsFromManifest(
			converterContext.getManifestControlConfiguration(visualizationPath).actions,
			converterContext,
			aAnnotationActions,
			navigationSettings,
			true,
			aHiddenActions
		),
		{
			isNavigable: "overwrite",
			enableOnSelect: "overwrite",
			enableAutoScroll: "overwrite",
			enabled: "overwrite",
			defaultValuesExtensionFunction: "overwrite"
		}
	);
}

/**
 * Returns an array of all columns, annotation-based as well as manifest based.
 * They are sorted and some properties can be overwritten via the manifest (check out the keys that can be overwritten).
 *
 * @param {LineItem} lineItemAnnotation Collection of data fields for representation in a table or list
 * @param {string} visualizationPath
 * @param {ConverterContext} converterContext
 * @param {NavigationSettingsConfiguration} navigationSettings
 * @returns {TableColumn[]} Returns all table columns that should be available, regardless of templating or personalization or their origin
 */
export function getTableColumns(
	lineItemAnnotation: LineItem,
	visualizationPath: string,
	converterContext: ConverterContext,
	navigationSettings?: NavigationSettingsConfiguration
): TableColumn[] {
	const annotationColumns = getColumnsFromAnnotations(lineItemAnnotation, visualizationPath, converterContext);
	const manifestColumns = getColumnsFromManifest(
		converterContext.getManifestControlConfiguration(visualizationPath).columns,
		annotationColumns as AnnotationTableColumn[],
		converterContext,
		converterContext.getAnnotationEntityType(lineItemAnnotation),
		navigationSettings
	);

	return insertCustomElements(annotationColumns, manifestColumns, {
		width: "overwrite",
		isNavigable: "overwrite",
		availability: "overwrite",
		settings: "overwrite",
		horizontalAlign: "overwrite",
		formatOptions: "overwrite"
	});
}

/**
 * Retrieve the custom aggregation definitions from the entityType.
 *
 * @param entityType The target entity type.
 * @param tableColumns The array of columns for the entity type.
 * @param converterContext The converter context.
 * @returns The aggregate definitions from the entityType, or undefined if the entity doesn't support analytical queries.
 */
export const getAggregateDefinitionsFromEntityType = function(
	entityType: EntityType,
	tableColumns: TableColumn[],
	converterContext: ConverterContext
): Record<string, AggregateData> | undefined {
	const aggregationHelper = new AggregationHelper(entityType, converterContext);

	function findColumnFromPath(path: string): TableColumn | undefined {
		return tableColumns.find(column => {
			const annotationColumn = column as AnnotationTableColumn;
			return annotationColumn.propertyInfos === undefined && annotationColumn.relativePath === path;
		});
	}

	if (!aggregationHelper.isAnalyticsSupported()) {
		return undefined;
	}

	// Keep a set of all currency/unit properties, as we don't want to consider them as aggregates
	// They are aggregates for technical reasons (to manage multi-units situations) but it doesn't make sense from a user standpoint
	const mCurrencyOrUnitProperties = new Set();
	tableColumns.forEach(oColumn => {
		const oTableColumn = oColumn as AnnotationTableColumn;
		if (oTableColumn.unit) {
			mCurrencyOrUnitProperties.add(oTableColumn.unit);
		}
	});

	const aCustomAggregateAnnotations = aggregationHelper.getCustomAggregateDefinitions();
	const mRawDefinitions: Record<string, string[]> = {};

	aCustomAggregateAnnotations.forEach(annotation => {
		const oAggregatedProperty = aggregationHelper._entityType.entityProperties.find(oProperty => {
			return oProperty.name === annotation.qualifier;
		});

		if (oAggregatedProperty) {
			const aContextDefiningProperties = annotation.annotations?.Aggregation?.ContextDefiningProperties;
			mRawDefinitions[oAggregatedProperty.name] = aContextDefiningProperties
				? aContextDefiningProperties.map(oCtxDefProperty => {
						return oCtxDefProperty.value;
				  })
				: [];
		}
	});
	const mResult: Record<string, AggregateData> = {};

	tableColumns.forEach(oColumn => {
		const oTableColumn = oColumn as AnnotationTableColumn;
		if (oTableColumn.propertyInfos === undefined && oTableColumn.relativePath) {
			const aRawContextDefiningProperties = mRawDefinitions[oTableColumn.relativePath];

			// Ignore aggregates corresponding to currencies or units of measure and dummy created property for datapoint target Value
			if (
				aRawContextDefiningProperties &&
				!mCurrencyOrUnitProperties.has(oTableColumn.name) &&
				!oTableColumn.isDataPointFakeTargetProperty
			) {
				mResult[oTableColumn.name] = {
					defaultAggregate: {},
					relativePath: oTableColumn.relativePath
				};
				const aContextDefiningProperties: string[] = [];
				aRawContextDefiningProperties.forEach(contextDefiningPropertyName => {
					const oColumn = findColumnFromPath(contextDefiningPropertyName);
					if (oColumn) {
						aContextDefiningProperties.push(oColumn.name);
					}
				});

				if (aContextDefiningProperties.length) {
					mResult[oTableColumn.name].defaultAggregate.contextDefiningProperties = aContextDefiningProperties;
				}
			}
		}
	});

	return mResult;
};

/**
 * Updates a table visualization for analytical use cases.
 *
 * @param tableVisualization The visualization to be updated
 * @param entityType The entity type displayed in the table
 * @param converterContext The converter context
 * @param presentationVariantAnnotation The presentationVariant annotation (if any)
 */
function updateTableVisualizationForAnalytics(
	tableVisualization: TableVisualization,
	entityType: EntityType,
	converterContext: ConverterContext,
	presentationVariantAnnotation?: PresentationVariantTypeTypes
) {
	if (tableVisualization.control.type === "AnalyticalTable") {
		const aggregatesDefinitions = getAggregateDefinitionsFromEntityType(entityType, tableVisualization.columns, converterContext);

		if (aggregatesDefinitions) {
			tableVisualization.enableAnalytics = true;
			tableVisualization.aggregates = aggregatesDefinitions;

			// Add group and sort conditions from the presentation variant
			tableVisualization.annotation.groupConditions = getGroupConditions(presentationVariantAnnotation, tableVisualization.columns);
			tableVisualization.annotation.aggregateConditions = getAggregateConditions(
				presentationVariantAnnotation,
				tableVisualization.columns
			);
		}

		tableVisualization.control.type = "GridTable"; // AnalyticalTable isn't a real type for the MDC:Table, so we always switch back to Grid
	}
}

/**
 * Get the navigation target path from manifest settings.
 *
 * @param converterContext The converter context
 * @param navigationPropertyPath The navigation path to check in the manifest settings
 * @returns Navigation path from manifest settings
 */
function getNavigationTargetPath(converterContext: ConverterContext, navigationPropertyPath: string) {
	const manifestWrapper = converterContext.getManifestWrapper();
	if (navigationPropertyPath && manifestWrapper.getNavigationConfiguration(navigationPropertyPath)) {
		const navConfig = manifestWrapper.getNavigationConfiguration(navigationPropertyPath);
		if (Object.keys(navConfig).length > 0) {
			return navigationPropertyPath;
		}
	}

	const dataModelPath = converterContext.getDataModelObjectPath();
	const contextPath = converterContext.getContextPath();
	const navConfigForContextPath = manifestWrapper.getNavigationConfiguration(contextPath);
	if (navConfigForContextPath && Object.keys(navConfigForContextPath).length > 0) {
		return contextPath;
	}

	return dataModelPath.targetEntitySet ? dataModelPath.targetEntitySet.name : dataModelPath.startingEntitySet.name;
}

/**
 * Sets the 'unit' and 'textArrangement' properties in columns when necessary.
 *
 * @param entityType The entity type displayed in the table
 * @param tableColumns The columns to be updated
 */
export function updateLinkedProperties(entityType: EntityType, tableColumns: TableColumn[]) {
	function findColumnByPath(path: string): TableColumn | undefined {
		return tableColumns.find(column => {
			const annotationColumn = column as AnnotationTableColumn;
			return annotationColumn.propertyInfos === undefined && annotationColumn.relativePath === path;
		});
	}

	tableColumns.forEach(oColumn => {
		const oTableColumn = oColumn as AnnotationTableColumn;
		if (oTableColumn.propertyInfos === undefined && oTableColumn.relativePath) {
			const oProperty = entityType.entityProperties.find(oProp => oProp.name === oTableColumn.relativePath);
			if (oProperty) {
				const sUnit = getAssociatedCurrencyProperty(oProperty)?.name || getAssociatedUnitProperty(oProperty)?.name;
				if (sUnit) {
					const oUnitColumn = findColumnByPath(sUnit);

					oTableColumn.unit = oUnitColumn?.name;
				}

				const displayMode = getDisplayMode(oProperty),
					textAnnotation = oProperty.annotations.Common?.Text;
				if (isPathExpression(textAnnotation) && displayMode !== "Value") {
					const oTextColumn = findColumnByPath(textAnnotation.path);
					if (oTextColumn && oTextColumn.name !== oTableColumn.name) {
						oTableColumn.textArrangement = {
							textProperty: oTextColumn.name,
							mode: displayMode
						};
					}
				}
			}
		}
	});
}

export function createTableVisualization(
	lineItemAnnotation: LineItem,
	visualizationPath: string,
	converterContext: ConverterContext,
	presentationVariantAnnotation?: PresentationVariantTypeTypes,
	isCondensedTableLayoutCompliant?: boolean,
	viewConfiguration?: ViewPathConfiguration
): TableVisualization {
	const tableManifestConfig = getTableManifestConfiguration(
		lineItemAnnotation,
		visualizationPath,
		converterContext,
		isCondensedTableLayoutCompliant
	);
	const { navigationPropertyPath } = splitPath(visualizationPath);
	const navigationTargetPath = getNavigationTargetPath(converterContext, navigationPropertyPath);
	const navigationSettings = converterContext.getManifestWrapper().getNavigationConfiguration(navigationTargetPath);
	const columns = getTableColumns(lineItemAnnotation, visualizationPath, converterContext, navigationSettings);
	const operationAvailableMap = getOperationAvailableMap(lineItemAnnotation, converterContext);

	const oVisualization: TableVisualization = {
		type: VisualizationType.Table,
		annotation: getTableAnnotationConfiguration(
			lineItemAnnotation,
			visualizationPath,
			converterContext,
			tableManifestConfig,
			columns,
			presentationVariantAnnotation,
			viewConfiguration
		),
		control: tableManifestConfig,
		actions: removeDuplicateActions(getTableActions(lineItemAnnotation, visualizationPath, converterContext, navigationSettings)),
		columns: columns,
		enableDataStateFilter: converterContext.getTemplateType() === "ObjectPage",
		operationAvailableMap: JSON.stringify(operationAvailableMap),
		operationAvailableProperties: getOperationAvailableProperties(operationAvailableMap, converterContext)
	};

	updateLinkedProperties(converterContext.getAnnotationEntityType(lineItemAnnotation), columns);
	updateTableVisualizationForAnalytics(
		oVisualization,
		converterContext.getAnnotationEntityType(lineItemAnnotation),
		converterContext,
		presentationVariantAnnotation
	);

	return oVisualization;
}

export function createDefaultTableVisualization(converterContext: ConverterContext): TableVisualization {
	const tableManifestConfig = getTableManifestConfiguration(undefined, "", converterContext, false);
	const columns = getColumnsFromEntityType({}, converterContext.getEntityType(), [], [], converterContext, tableManifestConfig.type);
	const operationAvailableMap = getOperationAvailableMap(undefined, converterContext);
	const oVisualization: TableVisualization = {
		type: VisualizationType.Table,
		annotation: getTableAnnotationConfiguration(undefined, "", converterContext, tableManifestConfig, columns),
		control: tableManifestConfig,
		actions: [],
		columns: columns,
		enableDataStateFilter: converterContext.getTemplateType() === "ObjectPage",
		operationAvailableMap: JSON.stringify(operationAvailableMap),
		operationAvailableProperties: getOperationAvailableProperties(operationAvailableMap, converterContext)
	};

	updateLinkedProperties(converterContext.getEntityType(), columns);
	updateTableVisualizationForAnalytics(oVisualization, converterContext.getEntityType(), converterContext);

	return oVisualization;
}

/**
 * Gets the map of Core.OperationAvailable property paths for all DataFieldForActions.
 *
 * @param lineItemAnnotation The instance of the line item
 * @param converterContext The instance of the converter context
 * @returns {Record<string, any>} The record containing all action names and their corresponding Core.OperationAvailable property paths
 */
function getOperationAvailableMap(lineItemAnnotation: LineItem | undefined, converterContext: ConverterContext): Record<string, any> {
	const operationAvailableMap: Record<string, any> = {};
	const addToMap = function(key: string, value: any) {
		if (key) {
			operationAvailableMap[key] = value;
		}
	};

	if (lineItemAnnotation) {
		lineItemAnnotation.forEach(dataField => {
			if (dataField.$Type === UIAnnotationTypes.DataFieldForAction) {
				const actionName = dataField.Action as string;
				if (actionName?.indexOf("/") < 0 && !dataField.Determining) {
					const actionTarget = dataField.ActionTarget;
					if (actionTarget?.annotations?.Core?.OperationAvailable === null) {
						// Annotation explicitly configured with null (action advertisement related)
						addToMap(actionName, null);
					} else if (actionTarget?.parameters?.length) {
						const bindingParameterFullName = actionTarget.parameters[0].fullyQualifiedName,
							targetExpression = annotationExpression(
								actionTarget?.annotations?.Core?.OperationAvailable,
								[],
								undefined,
								(path: string) => bindingContextPathVisitor(path, converterContext, bindingParameterFullName)
							) as BindingExpressionExpression<string>;

						if (targetExpression?.path) {
							addToMap(actionName, targetExpression.path);
						} else if (actionTarget?.annotations?.Core?.OperationAvailable !== undefined) {
							addToMap(actionName, targetExpression);
						}
					}
				}
			}
		});
	}

	return operationAvailableMap;
}

/**
 * Method to retrieve all property paths assigned to the Core.OperationAvailable annotation.
 *
 * @param {Record<string, any>} operationAvailableMap The record consisting of actions and their Core.OperationAvailable property paths
 * @param {ConverterContext} converterContext The instance of the converter context
 * @returns {string} The CSV string of all property paths associated with the Core.OperationAvailable annotation
 */
function getOperationAvailableProperties(operationAvailableMap: Record<string, any>, converterContext: ConverterContext): string {
	const properties = new Set();

	for (const actionName in operationAvailableMap) {
		const propertyName = operationAvailableMap[actionName];
		if (propertyName === null) {
			// Annotation configured with explicit 'null' (action advertisement relevant)
			properties.add(actionName);
		} else if (typeof propertyName === "string") {
			// Add property paths and not Constant values.
			properties.add(propertyName);
		}
	}

	if (properties.size) {
		// Some actions have an operation available based on property --> we need to load the HeaderInfo.Title property
		// so that the dialog on partial actions is displayed properly (BCP 2180271425)
		const entityType = converterContext.getEntityType();
		const titleProperty = (entityType.annotations?.UI?.HeaderInfo?.Title as DataFieldTypes)?.Value?.path;
		if (titleProperty) {
			properties.add(titleProperty);
		}
	}

	return Array.from(properties).join(",");
}

/**
 * Iterates over the DataFieldForAction and DataFieldForIntentBasedNavigation of a line item and
 * returns all the UI.Hidden annotation expressions.
 *
 * @param lineItemAnnotation Collection of data fields used for representation in a table or list
 * @param currentEntityType Current entity type
 * @param contextDataModelObjectPath Object path of the data model
 * @param isEntitySet
 * @returns All the `UI.Hidden` path expressions found in the relevant actions
 */
function getUIHiddenExpForActionsRequiringContext(
	lineItemAnnotation: LineItem,
	currentEntityType: EntityType,
	contextDataModelObjectPath: DataModelObjectPath,
	isEntitySet: boolean
): Expression<boolean>[] {
	const aUiHiddenPathExpressions: Expression<boolean>[] = [];
	lineItemAnnotation.forEach(dataField => {
		// Check if the lineItem context is the same as that of the action:
		if (
			(dataField.$Type === UIAnnotationTypes.DataFieldForAction &&
				dataField?.ActionTarget?.isBound &&
				currentEntityType === dataField?.ActionTarget.sourceEntityType) ||
			(dataField.$Type === UIAnnotationTypes.DataFieldForIntentBasedNavigation &&
				dataField.RequiresContext &&
				dataField?.Inline?.valueOf() !== true)
		) {
			if (typeof dataField.annotations?.UI?.Hidden?.valueOf() === "object") {
				aUiHiddenPathExpressions.push(
					equal(
						getBindingExpFromContext(
							dataField as DataFieldForAction | DataFieldForIntentBasedNavigation,
							contextDataModelObjectPath,
							isEntitySet
						),
						false
					)
				);
			}
		}
	});
	return aUiHiddenPathExpressions;
}

/**
 * This method is used to change the context currently referenced by this binding by removing the last navigation property.
 *
 * It is used (specifically in this case), to transform a binding made for a NavProp context /MainObject/NavProp1/NavProp2,
 * into a binding on the previous context /MainObject/NavProp1.
 *
 * @param source DataFieldForAction | DataFieldForIntentBasedNavigation | CustomAction
 * @param contextDataModelObjectPath DataModelObjectPath
 * @param isEntitySet
 * @returns The binding expression
 */
function getBindingExpFromContext(
	source: DataFieldForAction | DataFieldForIntentBasedNavigation | CustomAction,
	contextDataModelObjectPath: DataModelObjectPath,
	isEntitySet: boolean
): Expression<any> {
	let sExpression: any | undefined;
	if (
		(source as DataFieldForAction)?.$Type === UIAnnotationTypes.DataFieldForAction ||
		(source as DataFieldForIntentBasedNavigation)?.$Type === UIAnnotationTypes.DataFieldForIntentBasedNavigation
	) {
		sExpression = (source as DataFieldForAction | DataFieldForIntentBasedNavigation)?.annotations?.UI?.Hidden;
	} else {
		sExpression = (source as CustomAction)?.visible;
	}
	let sPath: string;
	if (sExpression?.path) {
		sPath = sExpression.path;
	} else {
		sPath = sExpression;
	}
	if (sPath) {
		if ((source as CustomAction)?.visible) {
			sPath = sPath.substring(1, sPath.length - 1);
		}
		if (sPath.indexOf("/") > 0) {
			//check if the navigation property is correct:
			const aSplitPath = sPath.split("/");
			const sNavigationPath = aSplitPath[0];
			if (
				contextDataModelObjectPath?.targetObject?._type === "NavigationProperty" &&
				contextDataModelObjectPath.targetObject.partner === sNavigationPath
			) {
				return bindingExpression(aSplitPath.slice(1).join("/"));
			} else {
				return constant(true);
			}
			// In case there is no navigation property, if it's an entitySet, the expression binding has to be returned:
		} else if (isEntitySet) {
			return bindingExpression(sPath);
			// otherwise the expression binding cannot be taken into account for the selection mode evaluation:
		} else {
			return constant(true);
		}
	}
	return constant(true);
}

/**
 * Loop through the DataFieldForAction and DataFieldForIntentBasedNavigation of a line item and check
 * if at least one of them is always visible in the table toolbar (and requires a context).
 *
 * @param lineItemAnnotation Collection of data fields for representation in a table or list
 * @param currentEntityType Current Entity Type
 * @returns {boolean} `true` if there is at least 1 action that meets the criteria
 */
function hasBoundActionsAlwaysVisibleInToolBar(lineItemAnnotation: LineItem, currentEntityType: EntityType): boolean {
	return lineItemAnnotation.some(dataField => {
		if (
			(dataField.$Type === UIAnnotationTypes.DataFieldForAction ||
				dataField.$Type === UIAnnotationTypes.DataFieldForIntentBasedNavigation) &&
			dataField?.Inline?.valueOf() !== true &&
			(dataField.annotations?.UI?.Hidden?.valueOf() === false || dataField.annotations?.UI?.Hidden?.valueOf() === undefined)
		) {
			if (dataField.$Type === UIAnnotationTypes.DataFieldForAction) {
				// Check if the lineItem context is the same as that of the action:
				return dataField?.ActionTarget?.isBound && currentEntityType === dataField?.ActionTarget.sourceEntityType;
			} else if (dataField.$Type === UIAnnotationTypes.DataFieldForIntentBasedNavigation) {
				return dataField.RequiresContext;
			}
		}
		return false;
	});
}

function hasCustomActionsAlwaysVisibleInToolBar(manifestActions: Record<string, CustomAction>): boolean {
	return Object.keys(manifestActions).some(actionKey => {
		const action = manifestActions[actionKey];
		if (action.requiresSelection && action.visible?.toString() === "true") {
			return true;
		}
		return false;
	});
}

/**
 * Iterates over the custom actions (with key requiresSelection) declared in the manifest for the current line item and returns all the
 * visible key values as an expression.
 *
 * @param manifestActions The actions defined in the manifest
 * @returns Array<Expression<boolean>> All the visible path expressions of the actions that meet the criteria
 */
function getVisibleExpForCustomActionsRequiringContext(manifestActions: Record<string, CustomAction>): Expression<boolean>[] {
	const aVisiblePathExpressions: Expression<boolean>[] = [];
	if (manifestActions) {
		Object.keys(manifestActions).forEach(actionKey => {
			const action = manifestActions[actionKey];
			if (action.requiresSelection === true && action.visible !== undefined) {
				if (typeof action.visible === "string") {
					/*The final aim would be to check if the path expression depends on the parent context
					and considers only those expressions for the expression evaluation,
					but currently not possible from the manifest as the visible key is bound on the parent entity.
					Tricky to differentiate the path as it's done for the Hidden annotation.
					For the time being we consider all the paths of the manifest*/

					aVisiblePathExpressions.push(resolveBindingString(action?.visible?.valueOf()));
				}
			}
		});
	}
	return aVisiblePathExpressions;
}

/**
 * Evaluate if the path is statically deletable or updatable.
 *
 * @param converterContext
 * @returns {TableCapabilityRestriction} The table capabilities
 */
export function getCapabilityRestriction(converterContext: ConverterContext): TableCapabilityRestriction {
	const isDeletable = isPathDeletable(converterContext.getDataModelObjectPath());
	const isUpdatable = isPathUpdatable(converterContext.getDataModelObjectPath());
	return {
		isDeletable: !(isConstant(isDeletable) && isDeletable.value === false),
		isUpdatable: !(isConstant(isUpdatable) && isUpdatable.value === false)
	};
}

export function getSelectionMode(
	lineItemAnnotation: LineItem | undefined,
	visualizationPath: string,
	converterContext: ConverterContext,
	isEntitySet: boolean,
	targetCapabilities: TableCapabilityRestriction,
	isDeleteButtonVisible?: Expression<boolean>
): string | undefined {
	if (!lineItemAnnotation) {
		return SelectionMode.None;
	}
	const tableManifestSettings = converterContext.getManifestControlConfiguration(visualizationPath);
	let selectionMode = tableManifestSettings.tableSettings?.selectionMode;
	let aHiddenBindingExpressions: Expression<boolean>[] = [],
		aVisibleBindingExpressions: Expression<boolean>[] = [];
	const manifestActions = getActionsFromManifest(
		converterContext.getManifestControlConfiguration(visualizationPath).actions,
		converterContext,
		[],
		undefined,
		false
	);
	let isParentDeletable, parentEntitySetDeletable;
	if (converterContext.getTemplateType() === TemplateType.ObjectPage) {
		isParentDeletable = isPathDeletable(converterContext.getDataModelObjectPath(), undefined);
		parentEntitySetDeletable = isParentDeletable ? compileBinding(isParentDeletable, true) : isParentDeletable;
	}
	if (selectionMode && selectionMode === SelectionMode.None && isDeleteButtonVisible) {
		return compileBinding(ifElse(isDeleteButtonVisible, constant("Multi"), constant("None")));
	}
	if (!selectionMode || selectionMode === SelectionMode.Auto) {
		selectionMode = SelectionMode.Multi;
	}

	if (
		hasBoundActionsAlwaysVisibleInToolBar(lineItemAnnotation, converterContext.getEntityType()) ||
		hasCustomActionsAlwaysVisibleInToolBar(manifestActions)
	) {
		return selectionMode;
	}
	aHiddenBindingExpressions = getUIHiddenExpForActionsRequiringContext(
		lineItemAnnotation,
		converterContext.getEntityType(),
		converterContext.getDataModelObjectPath(),
		isEntitySet
	);
	aVisibleBindingExpressions = getVisibleExpForCustomActionsRequiringContext(manifestActions);

	// No action requiring a context:
	if (aHiddenBindingExpressions.length === 0 && aVisibleBindingExpressions.length === 0) {
		if (!isEntitySet) {
			if (targetCapabilities.isDeletable || parentEntitySetDeletable !== "false") {
				return compileBinding(
					ifElse(equal(bindingExpression("/editMode", "ui"), "Editable"), constant(selectionMode), constant(SelectionMode.None))
				);
			} else {
				return SelectionMode.None;
			}
			// EntitySet deletable:
		} else if (targetCapabilities.isDeletable) {
			return selectionMode;
			// EntitySet not deletable:
		} else {
			return SelectionMode.None;
		}
		// There are actions requiring a context:
	} else if (!isEntitySet) {
		if (targetCapabilities.isDeletable || parentEntitySetDeletable !== "false") {
			return compileBinding(
				ifElse(
					equal(bindingExpression("/editMode", "ui"), "Editable"),
					constant(selectionMode),
					ifElse(
						or(...aHiddenBindingExpressions.concat(aVisibleBindingExpressions)),
						constant(selectionMode),
						constant(SelectionMode.None)
					)
				)
			);
		} else {
			return compileBinding(
				ifElse(
					or(...aHiddenBindingExpressions.concat(aVisibleBindingExpressions)),
					constant(selectionMode),
					constant(SelectionMode.None)
				)
			);
		}
		//EntitySet deletable:
	} else if (targetCapabilities.isDeletable) {
		return SelectionMode.Multi;
		//EntitySet not deletable:
	} else {
		return compileBinding(
			ifElse(
				or(...aHiddenBindingExpressions.concat(aVisibleBindingExpressions)),
				constant(selectionMode),
				constant(SelectionMode.None)
			)
		);
	}
}

/**
 * Method to retrieve all table actions from annotations.
 *
 * @param lineItemAnnotation
 * @param visualizationPath
 * @param converterContext
 * @returns {Record<BaseAction, BaseAction>} The table annotation actions
 */
function getTableAnnotationActions(lineItemAnnotation: LineItem, visualizationPath: string, converterContext: ConverterContext) {
	const tableActions: BaseAction[] = [];
	const hiddenTableActions: BaseAction[] = [];
	if (lineItemAnnotation) {
		lineItemAnnotation.forEach((dataField: DataFieldAbstractTypes) => {
			let tableAction: AnnotationAction | undefined;
			if (
				isDataFieldForActionAbstract(dataField) &&
				!(dataField.annotations?.UI?.Hidden?.valueOf() === true) &&
				!dataField.Inline &&
				!dataField.Determining
			) {
				const key = KeyHelper.generateKeyFromDataField(dataField);
				switch (dataField.$Type) {
					case "com.sap.vocabularies.UI.v1.DataFieldForAction":
						tableAction = {
							type: ActionType.DataFieldForAction,
							annotationPath: converterContext.getEntitySetBasedAnnotationPath(dataField.fullyQualifiedName),
							key: key,
							visible: compileBinding(
								not(
									equal(
										annotationExpression(
											dataField.annotations?.UI?.Hidden,
											[],
											undefined,
											converterContext.getRelativeModelPathFunction()
										),
										true
									)
								)
							),
							isNavigable: true
						};
						break;

					case "com.sap.vocabularies.UI.v1.DataFieldForIntentBasedNavigation":
						tableAction = {
							type: ActionType.DataFieldForIntentBasedNavigation,
							annotationPath: converterContext.getEntitySetBasedAnnotationPath(dataField.fullyQualifiedName),
							key: key,
							visible: compileBinding(
								not(
									equal(
										annotationExpression(
											dataField.annotations?.UI?.Hidden,
											[],
											undefined,
											converterContext.getRelativeModelPathFunction()
										),
										true
									)
								)
							)
						};
						break;
					default:
						break;
				}
			} else if (dataField.annotations?.UI?.Hidden?.valueOf() === true) {
				hiddenTableActions.push({
					type: ActionType.Default,
					key: KeyHelper.generateKeyFromDataField(dataField)
				});
			}
			if (tableAction) {
				tableActions.push(tableAction);
			}
		});
	}
	return {
		tableActions: tableActions,
		hiddenTableActions: hiddenTableActions
	};
}

function getHighlightRowBinding(
	criticalityAnnotation: PathAnnotationExpression<CriticalityType> | EnumValue<CriticalityType> | undefined,
	isDraftRoot: boolean,
	targetEntityType?: EntityType
): Expression<MessageType> {
	let defaultHighlightRowDefinition: MessageType | Expression<MessageType> = MessageType.None;
	if (criticalityAnnotation) {
		if (typeof criticalityAnnotation === "object") {
			defaultHighlightRowDefinition = annotationExpression(criticalityAnnotation) as Expression<MessageType>;
		} else {
			// Enum Value so we get the corresponding static part
			defaultHighlightRowDefinition = getMessageTypeFromCriticalityType(criticalityAnnotation);
		}
	}
	return ifElse(
		isDraftRoot && Draft.IsNewObject,
		MessageType.Information as MessageType,
		formatResult(
			[defaultHighlightRowDefinition, bindingExpression(`filteredMessages`, "internal")],
			tableFormatters.rowHighlighting,
			targetEntityType
		)
	);
}

function _getCreationBehaviour(
	lineItemAnnotation: LineItem | undefined,
	tableManifestConfiguration: TableControlConfiguration,
	converterContext: ConverterContext,
	navigationSettings: NavigationSettingsConfiguration
): TableAnnotationConfiguration["create"] {
	const navigation = navigationSettings?.create || navigationSettings?.detail;

	// cross-app
	if (navigation?.outbound && navigation.outboundDetail && navigationSettings?.create) {
		return {
			mode: "External",
			outbound: navigation.outbound,
			outboundDetail: navigation.outboundDetail,
			navigationSettings: navigationSettings
		};
	}

	let newAction;
	if (lineItemAnnotation) {
		// in-app
		const targetAnnotations = converterContext.getEntitySet()?.annotations;
		newAction = targetAnnotations?.Common?.DraftRoot?.NewAction || targetAnnotations?.Session?.StickySessionSupported?.NewAction; // TODO: Is there really no 'NewAction' on DraftNode? targetAnnotations?.Common?.DraftNode?.NewAction

		if (tableManifestConfiguration.creationMode === CreationMode.CreationRow && newAction) {
			// A combination of 'CreationRow' and 'NewAction' does not make sense
			// TODO: Or does it?
			throw Error(`Creation mode '${CreationMode.CreationRow}' can not be used with a custom 'new' action (${newAction})`);
		}
		if (navigation?.route) {
			// route specified
			return {
				mode: tableManifestConfiguration.creationMode,
				append: tableManifestConfiguration.createAtEnd,
				newAction: newAction?.toString(),
				navigateToTarget: tableManifestConfiguration.creationMode === CreationMode.NewPage ? navigation.route : undefined // navigate only in NewPage mode
			};
		}
	}

	// no navigation or no route specified - fallback to inline create if original creation mode was 'NewPage'
	if (tableManifestConfiguration.creationMode === CreationMode.NewPage) {
		tableManifestConfiguration.creationMode = CreationMode.Inline;
	}

	return {
		mode: tableManifestConfiguration.creationMode,
		append: tableManifestConfiguration.createAtEnd,
		newAction: newAction?.toString()
	};
}

const _getRowConfigurationProperty = function(
	lineItemAnnotation: LineItem | undefined,
	visualizationPath: string,
	converterContext: ConverterContext,
	navigationSettings: NavigationSettingsConfiguration,
	targetPath: string
) {
	let pressProperty, navigationTarget;
	let criticalityProperty: ExpressionOrPrimitive<MessageType> = MessageType.None;
	const targetEntityType = converterContext.getEntityType();
	if (navigationSettings && lineItemAnnotation) {
		navigationTarget = navigationSettings.display?.target || navigationSettings.detail?.outbound;
		if (navigationTarget) {
			pressProperty =
				".handlers.onChevronPressNavigateOutBound( $controller ,'" + navigationTarget + "', ${$parameters>bindingContext})";
		} else if (targetEntityType) {
			const targetEntitySet = converterContext.getEntitySet();
			navigationTarget = navigationSettings.detail?.route;
			if (navigationTarget) {
				criticalityProperty = getHighlightRowBinding(
					lineItemAnnotation.annotations?.UI?.Criticality,
					!!targetEntitySet?.annotations?.Common?.DraftRoot || !!targetEntitySet?.annotations?.Common?.DraftNode,
					targetEntityType
				);
				pressProperty =
					"API.onTableRowPress($event, $controller, ${$parameters>bindingContext}, { callExtension: true, targetPath: '" +
					targetPath +
					"', editable : " +
					(targetEntitySet?.annotations?.Common?.DraftRoot || targetEntitySet?.annotations?.Common?.DraftNode
						? "!${$parameters>bindingContext}.getProperty('IsActiveEntity')"
						: "undefined") +
					"})"; //Need to access to DraftRoot and DraftNode !!!!!!!
			} else {
				criticalityProperty = getHighlightRowBinding(lineItemAnnotation.annotations?.UI?.Criticality, false, targetEntityType);
			}
		}
	}
	const rowNavigatedExpression: Expression<boolean> = formatResult(
		[bindingExpression("/deepestPath", "internal")],
		tableFormatters.navigatedRow,
		targetEntityType
	);
	return {
		press: pressProperty,
		action: pressProperty ? "Navigation" : undefined,
		rowHighlighting: compileBinding(criticalityProperty),
		rowNavigated: compileBinding(rowNavigatedExpression)
	};
};

/**
 * Retrieve the columns from the entityType.
 *
 * @param columnsToBeCreated The columns to be created.
 * @param entityType The target entity type.
 * @param annotationColumns The array of columns created based on LineItem annotations.
 * @param nonSortableColumns The array of all non sortable column names.
 * @param converterContext The converter context.
 * @param tableType The table type.
 * @returns {AnnotationTableColumn[]} The column from the entityType
 */
export const getColumnsFromEntityType = function(
	columnsToBeCreated: Record<string, Property>,
	entityType: EntityType,
	annotationColumns: AnnotationTableColumn[] = [],
	nonSortableColumns: string[],
	converterContext: ConverterContext,
	tableType: TableType
): AnnotationTableColumn[] {
	const tableColumns: AnnotationTableColumn[] = [];
	// Catch already existing columns - which were added before by LineItem Annotations
	const aggregationHelper = new AggregationHelper(entityType, converterContext);

	entityType.entityProperties.forEach((property: Property) => {
		// Catch already existing columns - which were added before by LineItem Annotations
		const exists = annotationColumns.some(column => {
			return column.name === property.name;
		});

		// if target type exists, it is a complex property and should be ignored
		if (!property.targetType && !exists) {
			const relatedPropertiesInfo: ComplexPropertyInfo = collectRelatedProperties(
				property.name,
				property,
				converterContext,
				true,
				tableType
			);
			const relatedPropertyNames: string[] = Object.keys(relatedPropertiesInfo.properties);
			const additionalPropertyNames: string[] = Object.keys(relatedPropertiesInfo.additionalProperties);
			const columnInfo = getColumnDefinitionFromProperty(
				property,
				converterContext.getEntitySetBasedAnnotationPath(property.fullyQualifiedName),
				property.name,
				true,
				true,
				nonSortableColumns,
				aggregationHelper,
				converterContext
			);
			const semanticKeys = converterContext.getAnnotationsByTerm("Common", "com.sap.vocabularies.Common.v1.SemanticKey", [
				converterContext.getEntityType()
			])[0];
			const oColumnDraftIndicator = getDefaultDraftIndicatorForColumn(columnInfo.name, semanticKeys);
			if (Object.keys(oColumnDraftIndicator).length > 0) {
				columnInfo.formatOptions = {
					...oColumnDraftIndicator
				};
			}
			if (relatedPropertyNames.length > 0) {
				columnInfo.propertyInfos = relatedPropertyNames;
				columnInfo.exportSettings = {
					...columnInfo.exportSettings,
					template: relatedPropertiesInfo.exportSettingsTemplate,
					wrap: relatedPropertiesInfo.exportSettingsWrapping
				};

				// Collect information of related columns to be created.
				relatedPropertyNames.forEach(name => {
					columnsToBeCreated[name] = relatedPropertiesInfo.properties[name];
				});
			}

			if (additionalPropertyNames.length > 0) {
				columnInfo.additionalPropertyInfos = additionalPropertyNames;
				// Create columns for additional properties identified for ALP use case.
				additionalPropertyNames.forEach(name => {
					// Intentional overwrite as we require only one new PropertyInfo for a related Property.
					columnsToBeCreated[name] = relatedPropertiesInfo.additionalProperties[name];
				});
			}
			tableColumns.push(columnInfo);
		}
	});
	return tableColumns;
};

/**
 * Create a column definition from a property.
 * @param {Property} property Entity type property for which the column is created
 * @param {string} fullPropertyPath The full path to the target property
 * @param {string} relativePath The relative path to the target property based on the context
 * @param {boolean} useDataFieldPrefix Should be prefixed with "DataField::", else it will be prefixed with "Property::"
 * @param {boolean} availableForAdaptation Decides whether column should be available for adaptation
 * @param {string[]} nonSortableColumns The array of all non sortable column names
 * @param {AggregationHelper} aggregationHelper The aggregationHelper for the entity
 * @param {ConverterContext} converterContext The converter context
 * @returns {AnnotationTableColumn} The annotation column definition
 */
const getColumnDefinitionFromProperty = function(
	property: Property,
	fullPropertyPath: string,
	relativePath: string,
	useDataFieldPrefix: boolean,
	availableForAdaptation: boolean,
	nonSortableColumns: string[],
	aggregationHelper: AggregationHelper,
	converterContext: ConverterContext
): AnnotationTableColumn {
	const name = useDataFieldPrefix ? relativePath : "Property::" + relativePath;
	const key = (useDataFieldPrefix ? "DataField::" : "Property::") + replaceSpecialChars(relativePath);
	const semanticObjectAnnotationPath = getSemanticObjectPath(converterContext, property);
	const isHidden = property.annotations?.UI?.Hidden?.valueOf() === true;
	const groupPath: string | undefined = property.name ? _sliceAtSlash(property.name, true, false) : undefined;
	const isGroup: boolean = groupPath != property.name;
	const isDataPointFakeProperty: boolean = name.indexOf("@com.sap.vocabularies.UI.v1.DataPoint") > -1;
	const exportType: string = _getExportDataType(property.type);
	const sDateInputFormat: string | undefined = property.type === "Edm.Date" ? "YYYY-MM-DD" : undefined;
	const dataType: string | undefined = getDataFieldDataType(property);
	const propertyTypeConfig = !isDataPointFakeProperty ? getTypeConfig(property, dataType) : undefined;
	const oTypeConfig = !isDataPointFakeProperty
		? {
				className: property.type || dataType,
				oFormatOptions: propertyTypeConfig.formatOptions,
				oConstraints: propertyTypeConfig.constraints
		  }
		: undefined;
	const exportSettings = isDataPointFakeProperty
		? {
				template: getTargetValueOnDataPoint(property)
		  }
		: {
				type: exportType,
				inputFormat: sDateInputFormat,
				scale: property.scale,
				delimiter: property.type === "Edm.Int64" ? true : false,
				trueValue: property.type === "Edm.Boolean" ? "Yes" : undefined,
				falseValue: property.type === "Edm.Boolean" ? "No" : undefined
		  };
	return {
		key: key,
		isGroupable: !isDataPointFakeProperty && !isHidden ? aggregationHelper.isPropertyGroupable(property) : false,
		type: ColumnType.Annotation,
		label: _getLabel(property, isGroup),
		groupLabel: isGroup ? _getLabel(property) : null,
		group: isGroup ? groupPath : null,
		annotationPath: fullPropertyPath,
		semanticObjectPath: semanticObjectAnnotationPath,
		// A fake property was created for the TargetValue used on DataPoints, this property should be hidden and non sortable
		availability:
			!availableForAdaptation || isHidden || isDataPointFakeProperty ? AvailabilityType.Hidden : AvailabilityType.Adaptation,
		name: name,
		relativePath: isDataPointFakeProperty
			? (property as any).annotations?.UI?.DataFieldDefault?.Target?.$target?.Value?.path || (property as any).Value.path
			: relativePath,
		sortable: !isHidden && nonSortableColumns.indexOf(relativePath) === -1 && !isDataPointFakeProperty,
		isKey: property.isKey,
		isDataPointFakeTargetProperty: isDataPointFakeProperty,
		exportSettings: exportSettings,
		caseSensitive: isFilteringCaseSensitive(converterContext),
		typeConfig: oTypeConfig,
		visualSettings: isDataPointFakeProperty ? { widthCalculation: null } : undefined
	} as AnnotationTableColumn;
};

/**
 * Returns Boolean true for valid columns, false for invalid columns.
 *
 * @param {DataFieldAbstractTypes} dataField Different DataField types defined in the annotations
 * @returns {boolean} True for valid columns, false for invalid columns
 * @private
 */
const _isValidColumn = function(dataField: DataFieldAbstractTypes) {
	switch (dataField.$Type) {
		case UIAnnotationTypes.DataFieldForAction:
		case UIAnnotationTypes.DataFieldForIntentBasedNavigation:
			return !!dataField.Inline;
		case UIAnnotationTypes.DataFieldWithAction:
		case UIAnnotationTypes.DataFieldWithIntentBasedNavigation:
			return false;
		case UIAnnotationTypes.DataField:
		case UIAnnotationTypes.DataFieldWithUrl:
		case UIAnnotationTypes.DataFieldForAnnotation:
		case UIAnnotationTypes.DataFieldWithNavigationPath:
			return true;
		default:
		// Todo: Replace with proper Log statement once available
		//  throw new Error("Unhandled DataField Abstract type: " + dataField.$Type);
	}
};

/**
 * Returns label for property and dataField.
 * @param {DataFieldAbstractTypes | Property} property Entity type property or DataField defined in the annotations
 * @param isGroup
 * @returns {string} Label of the property or DataField
 * @private
 */
const _getLabel = function(property: DataFieldAbstractTypes | Property, isGroup: boolean = false): string | undefined {
	if (!property) {
		return undefined;
	}
	if (isProperty(property)) {
		const dataFieldDefault = property.annotations?.UI?.DataFieldDefault;
		if (dataFieldDefault && !dataFieldDefault.qualifier && dataFieldDefault.Label?.valueOf()) {
			return compileBinding(annotationExpression(dataFieldDefault.Label?.valueOf()));
		}
		return compileBinding(annotationExpression(property.annotations.Common?.Label?.valueOf() || property.name));
	} else if (isDataFieldTypes(property)) {
		if (!!isGroup && property.$Type === UIAnnotationTypes.DataFieldWithIntentBasedNavigation) {
			return compileBinding(annotationExpression(property.Label?.valueOf()));
		}
		return compileBinding(
			annotationExpression(
				property.Label?.valueOf() || property.Value?.$target?.annotations?.Common?.Label?.valueOf() || property.Value?.$target?.name
			)
		);
	} else if (property.$Type === UIAnnotationTypes.DataFieldForAnnotation) {
		return compileBinding(
			annotationExpression(
				property.Label?.valueOf() || (property.Target?.$target as DataPoint)?.Value?.$target?.annotations?.Common?.Label?.valueOf()
			)
		);
	} else {
		return compileBinding(annotationExpression(property.Label?.valueOf()));
	}
};

/**
 * Creates a PropertyInfo for each identified property consumed by a LineItem.
 *
 * @param {Record<string, Property>} columnsToBeCreated Identified properties.
 * @param existingColumns The list of columns created for LineItems and Properties of entityType.
 * @param nonSortableColumns The array of column names which cannot be sorted.
 * @param converterContext The converter context.
 * @param entityType The entity type for the LineItem
 * @returns {AnnotationTableColumn[]} The array of columns created.
 */
const _createRelatedColumns = function(
	columnsToBeCreated: Record<string, Property>,
	existingColumns: AnnotationTableColumn[],
	nonSortableColumns: string[],
	converterContext: ConverterContext,
	entityType: EntityType
): AnnotationTableColumn[] {
	const relatedColumns: AnnotationTableColumn[] = [];
	const relatedPropertyNameMap: Record<string, string> = {};
	const aggregationHelper = new AggregationHelper(entityType, converterContext);

	Object.keys(columnsToBeCreated).forEach(name => {
		const property = columnsToBeCreated[name],
			annotationPath = converterContext.getAbsoluteAnnotationPath(name),
			// Check whether the related column already exists.
			relatedColumn = existingColumns.find(column => column.name === name);
		if (relatedColumn === undefined) {
			// Case 1: Key contains DataField prefix to ensure all property columns have the same key format.
			// New created property column is set to hidden.
			relatedColumns.push(
				getColumnDefinitionFromProperty(
					property,
					annotationPath,
					name,
					true,
					false,
					nonSortableColumns,
					aggregationHelper,
					converterContext
				)
			);
		} else if (
			relatedColumn.annotationPath !== annotationPath ||
			(relatedColumn.propertyInfos && relatedColumn.propertyInfos.indexOf(name) !== -1)
		) {
			// Case 2: The existing column points to a LineItem (or)
			// Case 3: This is a self reference from an existing column and
			// both cases require a dummy PropertyInfo for setting correct export settings.

			const newName = "Property::" + name;

			// Checking whether the related property column has already been created in a previous iteration.
			if (!existingColumns.some(column => column.name === newName)) {
				// Create a new property column with 'Property::' prefix,
				// Set it to hidden as it is only consumed by Complex property infos.
				relatedColumns.push(
					getColumnDefinitionFromProperty(
						property,
						annotationPath,
						name,
						false,
						false,
						nonSortableColumns,
						aggregationHelper,
						converterContext
					)
				);
				relatedPropertyNameMap[name] = newName;
			}
		}
	});

	// The property 'name' has been prefixed with 'Property::' for uniqueness.
	// Update the same in other propertyInfos[] references which point to this property.
	existingColumns.forEach(column => {
		column.propertyInfos = column.propertyInfos?.map(propertyInfo => relatedPropertyNameMap[propertyInfo] ?? propertyInfo);
		column.additionalPropertyInfos = column.additionalPropertyInfos?.map(
			propertyInfo => relatedPropertyNameMap[propertyInfo] ?? propertyInfo
		);
	});

	return relatedColumns;
};

/**
 * Getting the Column Name
 * If it points to a DataField with one property or DataPoint with one property, it will use the property name
 * here to be consistent with the existing flex changes.
 *
 * @param {DataFieldAbstractTypes} dataField Different DataField types defined in the annotations
 * @returns {string} The name of annotation columns
 * @private
 */
const _getAnnotationColumnName = function(dataField: DataFieldAbstractTypes) {
	// This is needed as we have flexibility changes already that we have to check against
	if (isDataFieldTypes(dataField)) {
		return dataField.Value?.path;
	} else if (dataField.$Type === UIAnnotationTypes.DataFieldForAnnotation && (dataField.Target?.$target as DataPoint)?.Value?.path) {
		// This is for removing duplicate properties. For example, 'Progress' Property is removed if it is already defined as a DataPoint
		return (dataField.Target?.$target as DataPoint)?.Value.path;
	} else {
		return KeyHelper.generateKeyFromDataField(dataField);
	}
};

/**
 * Determines the relative path of the property with respect to the root entity.
 * @param dataField The `DataField` being processed.
 * @returns {string} The relative path
 */
const _getRelativePath = function(dataField: DataFieldAbstractTypes): string {
	let relativePath: string = "";

	switch (dataField.$Type) {
		case UIAnnotationTypes.DataField:
		case UIAnnotationTypes.DataFieldWithNavigationPath:
		case UIAnnotationTypes.DataFieldWithUrl:
			relativePath = (dataField as DataField)?.Value?.path;
			break;

		case UIAnnotationTypes.DataFieldForAnnotation:
			relativePath = (dataField as DataFieldForAnnotation)?.Target?.value;
			break;

		case UIAnnotationTypes.DataFieldForAction:
		case UIAnnotationTypes.DataFieldForIntentBasedNavigation:
			relativePath = KeyHelper.generateKeyFromDataField(dataField);
			break;
	}

	return relativePath;
};

const _sliceAtSlash = function(path: string, isLastSlash: boolean, isLastPart: boolean) {
	const iSlashIndex = isLastSlash ? path.lastIndexOf("/") : path.indexOf("/");

	if (iSlashIndex === -1) {
		return path;
	}
	return isLastPart ? path.substring(iSlashIndex + 1, path.length) : path.substring(0, iSlashIndex);
};

/**
 * Determine whether a column is sortable.
 *
 * @param dataField The data field being processed
 * @param propertyPath The property path
 * @param nonSortableColumns Collection of non-sortable column names as per annotation
 * @returns {boolean} True if the column is sortable
 */
const _isColumnSortable = function(dataField: DataFieldAbstractTypes, propertyPath: string, nonSortableColumns: string[]): boolean {
	let isSortable: boolean = false;
	if (nonSortableColumns.indexOf(propertyPath) === -1) {
		// Column is not marked as non-sortable via annotation
		switch (dataField.$Type) {
			case UIAnnotationTypes.DataField:
			case UIAnnotationTypes.DataFieldWithUrl:
				isSortable = true;
				break;

			case UIAnnotationTypes.DataFieldForIntentBasedNavigation:
			case UIAnnotationTypes.DataFieldForAction:
				// Action columns are not sortable
				isSortable = false;
				break;
		}
	}
	return isSortable;
};

/**
 * Returns whether filtering on the table is case sensitive.
 *
 * @param {ConverterContext} converterContext The instance of the converter context
 * @returns {boolean} Returns 'false' if FilterFunctions annotation supports 'tolower', else 'true'
 */
export const isFilteringCaseSensitive = function(converterContext: ConverterContext): boolean {
	const filterFunctions: FilterFunctions | undefined =
		converterContext.getEntitySet()?.annotations?.Capabilities?.FilterFunctions ||
		converterContext.getEntityContainer().annotations?.Capabilities?.FilterFunctions;
	return Array.isArray(filterFunctions) ? (filterFunctions as String[]).indexOf("tolower") === -1 : true;
};

/**
 * Returns default format options for text fields in a table.
 *
 * @returns {FormatOptionsType} Collection of format options with default values
 */
function getDefaultFormatOptionsForTable(): FormatOptionsType {
	return {
		textLinesEdit: 4
	};
}

/**
 * Returns default format options with draftIndicator for a column.
 * @param name
 * @param semanticKeys
 * @returns {FormatOptionsType} Collection of format options with default values
 */
function getDefaultDraftIndicatorForColumn(name: string, semanticKeys: any[]) {
	let bSemanticKeyFound = false;
	const aSemanticKeyValues: string[] = [];
	if (!semanticKeys) {
		return {};
	}
	for (let i = 0; i < semanticKeys.length; i++) {
		aSemanticKeyValues.push(semanticKeys[i].value);
		if (semanticKeys[i].value === name) {
			bSemanticKeyFound = true;
		}
	}
	if (bSemanticKeyFound) {
		return {
			hasDraftIndicator: true,
			semantickeys: aSemanticKeyValues
		};
	} else {
		return {};
	}
}

/**
 * Returns line items from metadata annotations.
 *
 * @param {LineItem} lineItemAnnotation Collection of data fields with their annotations
 * @param {string} visualizationPath The visualization path
 * @param {ConverterContext} converterContext The converter context
 * @returns {TableColumn[]} The columns from the annotations
 */
const getColumnsFromAnnotations = function(
	lineItemAnnotation: LineItem,
	visualizationPath: string,
	converterContext: ConverterContext
): TableColumn[] {
	const entityType = converterContext.getAnnotationEntityType(lineItemAnnotation),
		annotationColumns: AnnotationTableColumn[] = [],
		columnsToBeCreated: Record<string, Property> = {},
		nonSortableColumns: string[] = getNonSortablePropertiesRestrictions(converterContext.getEntitySet()),
		tableManifestSettings: TableManifestConfiguration = converterContext.getManifestControlConfiguration(visualizationPath),
		tableType: TableType = tableManifestSettings?.tableSettings?.type || "ResponsiveTable";
	const semanticKeys = converterContext.getAnnotationsByTerm("Common", "com.sap.vocabularies.Common.v1.SemanticKey", [
		converterContext.getEntityType()
	])[0];
	if (lineItemAnnotation) {
		// Get columns from the LineItem Annotation
		lineItemAnnotation.forEach(lineItem => {
			if (!_isValidColumn(lineItem)) {
				return;
			}
			const semanticObjectAnnotationPath =
				isDataFieldTypes(lineItem) && lineItem.Value?.$target?.fullyQualifiedName
					? getSemanticObjectPath(converterContext, lineItem)
					: undefined;
			const relativePath = _getRelativePath(lineItem);
			// Determine properties which are consumed by this LineItem.
			const relatedPropertiesInfo: ComplexPropertyInfo = collectRelatedPropertiesRecursively(lineItem, converterContext, tableType);
			const relatedPropertyNames: string[] = Object.keys(relatedPropertiesInfo.properties);
			const additionalPropertyNames: string[] = Object.keys(relatedPropertiesInfo.additionalProperties);
			const groupPath: string = _sliceAtSlash(relativePath, true, false);
			const isGroup: boolean = groupPath != relativePath;
			const sLabel: string | undefined = _getLabel(lineItem, isGroup);
			const name = _getAnnotationColumnName(lineItem);
			const dataType: string | undefined = getDataFieldDataType(lineItem);
			const sDateInputFormat: string | undefined = dataType === "Edm.Date" ? "YYYY-MM-DD" : undefined;
			const formatOptions = {
				...getDefaultFormatOptionsForTable(),
				...getDefaultDraftIndicatorForColumn(name, semanticKeys)
			};
			const exportSettings = {
				template: relatedPropertiesInfo.exportSettingsTemplate,
				wrap: relatedPropertiesInfo.exportSettingsWrapping,
				type: dataType ? _getExportDataType(dataType, relatedPropertyNames.length > 1) : undefined,
				inputFormat: sDateInputFormat,
				delimiter: dataType === "Edm.Int64" ? true : false,
				trueValue: dataType === "Edm.Boolean" ? "Yes" : undefined,
				falseValue: dataType === "Edm.Boolean" ? "No" : undefined
			};
			const propertyTypeConfig = dataType && getTypeConfig(lineItem, dataType);
			const oTypeConfig = propertyTypeConfig
				? {
						className: dataType,
						oFormatOptions: {
							...formatOptions,
							...propertyTypeConfig.formatOptions
						},
						oConstraints: propertyTypeConfig.constraints
				  }
				: undefined;
			let visualSettings: VisualSettings = {};
			if (relatedPropertiesInfo.visualSettingsToBeExcluded) {
				// In case of text arrangement annotation with display mode as text only, exclude text property from the width calculation
				visualSettings = {
					widthCalculation: {
						excludeProperties: "Property::" + relatedPropertiesInfo.visualSettingsToBeExcluded
					}
				};
			} else if (!dataType || !oTypeConfig) {
				// for charts
				visualSettings.widthCalculation = null;
			}

			annotationColumns.push({
				key: KeyHelper.generateKeyFromDataField(lineItem),
				type: ColumnType.Annotation,
				label: sLabel,
				groupLabel: isGroup ? _getLabel(lineItem) : null,
				group: isGroup ? groupPath : null,
				annotationPath: converterContext.getEntitySetBasedAnnotationPath(lineItem.fullyQualifiedName),
				semanticObjectPath: semanticObjectAnnotationPath,
				availability: isDataFieldAlwaysHidden(lineItem) ? AvailabilityType.Hidden : AvailabilityType.Default,
				name: name,
				relativePath: relativePath,
				sortable: _isColumnSortable(lineItem, relativePath, nonSortableColumns),
				propertyInfos: relatedPropertyNames.length > 0 ? relatedPropertyNames : undefined,
				additionalPropertyInfos: additionalPropertyNames.length > 0 ? additionalPropertyNames : undefined,
				exportSettings: exportSettings,
				width: lineItem.annotations?.HTML5?.CssDefaults?.width || undefined,
				isNavigable: true,
				formatOptions: formatOptions,
				exportContactProperty: relatedPropertiesInfo.exportSettingsContactProperty,
				caseSensitive: isFilteringCaseSensitive(converterContext),
				typeConfig: oTypeConfig,
				visualSettings: visualSettings
			} as AnnotationTableColumn);

			// Collect information of related columns to be created.
			relatedPropertyNames.forEach(name => {
				columnsToBeCreated[name] = relatedPropertiesInfo.properties[name];
			});

			// Create columns for additional properties identified for ALP use case.
			additionalPropertyNames.forEach(name => {
				// Intentional overwrite as we require only one new PropertyInfo for a related Property.
				columnsToBeCreated[name] = relatedPropertiesInfo.additionalProperties[name];
			});
		});
	}

	// Get columns from the Properties of EntityType
	let tableColumns = getColumnsFromEntityType(
		columnsToBeCreated,
		entityType,
		annotationColumns,
		nonSortableColumns,
		converterContext,
		tableType
	);
	tableColumns = tableColumns.concat(annotationColumns);

	// Create a propertyInfo for each related property.
	const relatedColumns = _createRelatedColumns(columnsToBeCreated, tableColumns, nonSortableColumns, converterContext, entityType);
	tableColumns = tableColumns.concat(relatedColumns);

	return tableColumns;
};

/**
 * Gets the property names from the manifest and checks against existing properties already added by annotations.
 * If a not yet stored property is found it adds it for sorting and filtering only to the annotationColumns.
 * @param {string[] | undefined} properties
 * @param {AnnotationTableColumn[]} annotationColumns
 * @param {ConverterContext} converterContext
 * @param entityType
 * @returns {string[]} The columns from the annotations
 */
const _getPropertyNames = function(
	properties: string[] | undefined,
	annotationColumns: AnnotationTableColumn[],
	converterContext: ConverterContext,
	entityType: EntityType
): string[] | undefined {
	let matchedProperties: string[] | undefined;
	if (properties) {
		matchedProperties = properties.map(function(propertyPath) {
			const annotationColumn = annotationColumns.find(function(annotationColumn) {
				return annotationColumn.relativePath === propertyPath && annotationColumn.propertyInfos === undefined;
			});
			if (annotationColumn) {
				return annotationColumn.name;
			} else {
				const relatedColumns = _createRelatedColumns(
					{ [propertyPath]: entityType.resolvePath(propertyPath) },
					annotationColumns,
					[],
					converterContext,
					entityType
				);
				annotationColumns.push(relatedColumns[0]);
				return relatedColumns[0].name;
			}
		});
	}

	return matchedProperties;
};

const _appendCustomTemplate = function(properties: string[]): string {
	return properties
		.map(property => {
			return `{${properties.indexOf(property)}}`;
		})
		.join(`${"\n"}`);
};

/**
 * Retrieves the table column property value based on certain conditions.
 *
 * Manifest defined property value for custom / annotation columns
 * Default property value for custom column if not overwritten in manifest.
 *
 * @param {any} property The column property defined in the manifest
 * @param {any} defaultValue The default value of the property
 * @param {boolean} isAnnotationColumn Whether the column, defined in manifest, corresponds to an existing annotation column.
 * @returns {any} Determined property value for the column
 */
const _getManifestOrDefaultValue = function(property: any, defaultValue: any, isAnnotationColumn: boolean): any {
	if (property === undefined) {
		// If annotation column has no property defined in manifest,
		// do not overwrite it with manifest column's default value.
		return isAnnotationColumn ? undefined : defaultValue;
	}
	// Return what is defined in manifest.
	return property;
};

/**
 * Returns table column definitions from manifest.
 * @param columns
 * @param annotationColumns
 * @param converterContext
 * @param entityType
 * @param navigationSettings
 * @returns {Record<string, CustomColumn>} The columns from the manifest
 */
const getColumnsFromManifest = function(
	columns: Record<string, ManifestTableColumn>,
	annotationColumns: AnnotationTableColumn[],
	converterContext: ConverterContext,
	entityType: EntityType,
	navigationSettings?: NavigationSettingsConfiguration
): Record<string, CustomColumn> {
	const internalColumns: Record<string, CustomColumn> = {};

	for (const key in columns) {
		const manifestColumn = columns[key];
		// To identify the annotation column property overwrite via manifest use-case.
		const isAnnotationColumn = annotationColumns.some(column => column.key === key);
		KeyHelper.validateKey(key);
		const propertyInfos: string[] | undefined = _getPropertyNames(
			manifestColumn.properties,
			annotationColumns,
			converterContext,
			entityType
		);

		internalColumns[key] = {
			key: key,
			id: "CustomColumn::" + key,
			name: "CustomColumn::" + key,
			header: manifestColumn.header,
			width: manifestColumn.width || undefined,
			horizontalAlign: _getManifestOrDefaultValue(manifestColumn?.horizontalAlign, HorizontalAlign.Begin, isAnnotationColumn),
			type: manifestColumn.type === "Slot" ? ColumnType.Slot : ColumnType.Default,
			availability: _getManifestOrDefaultValue(manifestColumn?.availability, AvailabilityType.Default, isAnnotationColumn),
			template: manifestColumn.template || "undefined",
			position: {
				anchor: manifestColumn.position?.anchor,
				placement: manifestColumn.position === undefined ? Placement.After : manifestColumn.position.placement
			},
			isNavigable: isAnnotationColumn ? undefined : isActionNavigable(manifestColumn, navigationSettings, true),
			settings: manifestColumn.settings,
			sortable: false,
			propertyInfos: propertyInfos,
			formatOptions: {
				...getDefaultFormatOptionsForTable(),
				...manifestColumn.formatOptions
			},
			exportSettings: {
				template: propertyInfos ? _appendCustomTemplate(propertyInfos) : undefined,
				fieldLabel: propertyInfos ? manifestColumn.header : undefined,
				wrap: propertyInfos && propertyInfos.length > 1 ? true : false
			},
			caseSensitive: isFilteringCaseSensitive(converterContext)
		};
	}
	return internalColumns;
};

export function getP13nMode(
	visualizationPath: string,
	converterContext: ConverterContext,
	tableManifestConfiguration: TableControlConfiguration
): string | undefined {
	const manifestWrapper: ManifestWrapper = converterContext.getManifestWrapper();
	const tableManifestSettings: TableManifestConfiguration = converterContext.getManifestControlConfiguration(visualizationPath);
	const variantManagement: VariantManagementType = manifestWrapper.getVariantManagement();
	const aPersonalization: string[] = [];
	const bAnalyticalTable = tableManifestConfiguration.type === "AnalyticalTable";
	if (tableManifestSettings?.tableSettings?.personalization !== undefined) {
		// Personalization configured in manifest.
		const personalization: any = tableManifestSettings.tableSettings.personalization;
		if (personalization === true) {
			// Table personalization fully enabled.
			return bAnalyticalTable ? "Sort,Column,Filter,Group,Aggregate" : "Sort,Column,Filter";
		} else if (typeof personalization === "object") {
			// Specific personalization options enabled in manifest. Use them as is.
			if (personalization.sort) {
				aPersonalization.push("Sort");
			}
			if (personalization.column) {
				aPersonalization.push("Column");
			}
			if (personalization.filter) {
				aPersonalization.push("Filter");
			}
			if (personalization.group && bAnalyticalTable) {
				aPersonalization.push("Group");
			}
			if (personalization.aggregate && bAnalyticalTable) {
				aPersonalization.push("Aggregate");
			}
			return aPersonalization.length > 0 ? aPersonalization.join(",") : undefined;
		}
	} else {
		// No personalization configured in manifest.
		aPersonalization.push("Sort");
		aPersonalization.push("Column");
		if (variantManagement === VariantManagementType.Control) {
			// Feature parity with V2.
			// Enable table filtering by default only in case of Control level variant management.
			aPersonalization.push("Filter");
		}
		if (bAnalyticalTable) {
			aPersonalization.push("Group");
			aPersonalization.push("Aggregate");
		}
		return aPersonalization.join(",");
	}
	return undefined;
}

/**
 * Function to determine the visibility of the Delete button.
 *
 * @param converterContext The instance of the converter context
 * @param navigationPath Path to the navigation entity
 * @param isTargetDeletable Flag which determines whether a target is deletable
 * @param viewConfiguration The instance of the configuration for the view path
 * @returns {Expression<boolean>} The expression for the Delete button
 */
export function getDeleteVisible(
	converterContext: ConverterContext,
	navigationPath: string,
	isTargetDeletable: boolean,
	viewConfiguration?: ViewPathConfiguration
): Expression<boolean> {
	const currentEntitySet = converterContext.getEntitySet();
	const dataModelObjectPath = converterContext.getDataModelObjectPath();
	const visitedNavigationPaths = dataModelObjectPath.navigationProperties.map(navProp => navProp.name);
	const isDeleteHiddenExpression = currentEntitySet
		? annotationExpression(
				(currentEntitySet?.annotations.UI?.DeleteHidden as PropertyAnnotationValue<boolean>) || false,
				visitedNavigationPaths,
				undefined,
				(path: string) => singletonPathVisitor(path, converterContext, visitedNavigationPaths)
		  )
		: constant(false);
	const isDeleteHidden: any = compileBinding(isDeleteHiddenExpression);
	let isParentDeletable, parentEntitySetDeletable;
	if (converterContext.getTemplateType() === TemplateType.ObjectPage) {
		isParentDeletable = isPathDeletable(converterContext.getDataModelObjectPath(), navigationPath);
		parentEntitySetDeletable = isParentDeletable ? compileBinding(isParentDeletable) : isParentDeletable;
	}
	const bIsStickySessionSupported = converterContext.getDataModelObjectPath().startingEntitySet?.annotations?.Session
		?.StickySessionSupported
		? true
		: false;
	const bIsDraftRoot = currentEntitySet && currentEntitySet.annotations?.Common?.DraftRoot ? true : false;
	const bIsDraftNode = currentEntitySet && currentEntitySet.annotations?.Common?.DraftNode ? true : false;
	const bIsDraftParentEntityForContainment =
		converterContext.getDataModelObjectPath().targetObject?.containsTarget &&
		(converterContext.getDataModelObjectPath().startingEntitySet?.annotations?.Common?.DraftRoot ||
			converterContext.getDataModelObjectPath().startingEntitySet?.annotations?.Common?.DraftNode)
			? true
			: false;
	if (
		bIsDraftRoot ||
		bIsDraftNode ||
		bIsStickySessionSupported ||
		(!converterContext.getEntitySet() && bIsDraftParentEntityForContainment)
	) {
		//do not show case the delete button if parentEntitySetDeletable is false
		if (parentEntitySetDeletable === "false") {
			return constant(false);
			//OP
		} else if (parentEntitySetDeletable && isDeleteHidden !== "true") {
			//Delete Hidden in case of true and path based
			if (isDeleteHidden && isDeleteHidden !== "false") {
				return and(equal(bindingExpression("/editMode", "ui"), "Editable"), not(isDeleteHiddenExpression));
			} else {
				return equal(bindingExpression("/editMode", "ui"), "Editable");
			}
		} else if (
			isDeleteHidden === "true" ||
			!isTargetDeletable ||
			(viewConfiguration && converterContext.getManifestWrapper().hasMultipleVisualizations(viewConfiguration)) ||
			converterContext.getTemplateType() === TemplateType.AnalyticalListPage
		) {
			return constant(false);
		} else if (converterContext.getTemplateType() !== TemplateType.ListReport) {
			if (isDeleteHidden && isDeleteHidden === "false") {
				return and(equal(bindingExpression("/editMode", "ui"), "Editable"), not(isDeleteHiddenExpression));
			} else {
				return equal(bindingExpression("/editMode", "ui"), "Editable");
			}
		} else if (isBinding(isDeleteHiddenExpression)) {
			// UI.DeleteHidden annotation points to a path
			return not(isDeleteHiddenExpression);
		} else {
			return constant(true);
		}
	} else {
		return constant(false);
	}
}

/**
 * Returns the enablement for the 'Mass Edit' button
 *
 * @param converterContext The converterContext
 * @param bMassEditVisible The visibility of the 'Mass Edit' button
 * @returns {*} Expression or Boolean value for the enablement of the 'Mass Edit' button
 */

export function getEnablementMassEdit(
	converterContext: ConverterContext,
	bMassEditVisible: string | boolean | undefined
): string | boolean {
	if (bMassEditVisible) {
		const isParentUpdatable: any = isPathUpdatable(converterContext.getDataModelObjectPath(), undefined, true);
		//when updatable is path based and pointing to current entity set property, that case is handled in table helper and runtime
		if (isParentUpdatable?.currentEntityRestriction) {
			return false;
		}
		const oExpression: any = compileBinding(isParentUpdatable);
		return isParentUpdatable
			? "{= %{internal>numberOfSelectedContexts} >= 2 && " + compileBinding(isParentUpdatable, oExpression) + "}"
			: false;
	}
	return false;
}

/**
 * Returns the visibility for the 'Mass Edit' button
 *
 * @param converterContext The converterContext
 * @param tableManifestConfiguration The manifest configuration for the table
 * @param targetCapabilities The target capability restrictions for the table
 * @param selectionMode The selection mode for the table
 * @returns {*} Expression or Boolean value for the visibility of the 'Mass Edit' button
 */

export function getVisibilityMassEdit(
	converterContext: ConverterContext,
	tableManifestConfiguration: TableControlConfiguration,
	targetCapabilities: TableCapabilityRestriction,
	selectionMode: string | undefined
): boolean | string | undefined {
	const entitySet = converterContext.getEntitySet(),
		bUpdateHidden: any = entitySet && entitySet?.annotations.UI?.UpdateHidden?.valueOf(),
		bMassEditEnabled: boolean = tableManifestConfiguration?.enableMassEdit || false,
		iSelectionLimit: number = tableManifestConfiguration?.selectionLimit;
	let bMassEditVisible: boolean = true;
	if ((selectionMode && selectionMode === "Single") || (iSelectionLimit && iSelectionLimit < 2)) {
		bMassEditVisible = false;
	} else if (selectionMode && (selectionMode === "Auto" || selectionMode === "None")) {
		bMassEditVisible = true;
	}
	if (targetCapabilities?.isUpdatable !== false && bMassEditVisible && bMassEditEnabled) {
		if (bUpdateHidden && typeof bUpdateHidden === "boolean") {
			return !bUpdateHidden && converterContext.getTemplateType() === TemplateType.ObjectPage ? compileBinding(UI.IsEditable) : false;
		} else if (bUpdateHidden && bUpdateHidden?.path) {
			return converterContext.getTemplateType() === TemplateType.ObjectPage
				? compileBinding(and(equal(UI.IsEditable, true), equal(annotationExpression(bUpdateHidden), false)))
				: false;
		}
		return converterContext.getTemplateType() === TemplateType.ObjectPage ? compileBinding(UI.IsEditable) : false;
	}
	return false;
}

/**
 * Function to determine the visibility of the Create button.
 *
 * @param converterContext The instance of the converter context
 * @param creationMode The mode used for creation
 * @param isInsertable Annotation expression of InsertRestrictions.Insertable
 * @param viewConfiguration The instance of the configuration for the view path
 * @returns {Expression<boolean>} Expression or Boolean value of the 'UI.CreateHidden' annotation
 */
export function getCreateVisible(
	converterContext: ConverterContext,
	creationMode: CreationMode | "External",
	isInsertable: Expression<boolean>,
	viewConfiguration?: ViewPathConfiguration
): Expression<boolean> {
	const currentEntitySet = converterContext.getEntitySet();
	const dataModelObjectPath = converterContext.getDataModelObjectPath();
	const visitedNavigationPaths = dataModelObjectPath.navigationProperties.map(navProp => navProp.name);
	const isCreateHidden: Expression<boolean> = currentEntitySet
		? annotationExpression(
				(currentEntitySet?.annotations.UI?.CreateHidden as PropertyAnnotationValue<boolean>) || false,
				visitedNavigationPaths,
				undefined,
				(path: string) => singletonPathVisitor(path, converterContext, visitedNavigationPaths)
		  )
		: constant(false);

	// if there is a custom new action the create button will be bound against this new action (instead of a POST action).
	// The visibility of the create button then depends on the new action's OperationAvailable annotation (instead of the insertRestrictions):
	// OperationAvailable = true or undefined -> create is visible
	// OperationAvailable = false -> create is not visible
	const newActionName: BindingExpression<string> = currentEntitySet?.annotations.Common?.DraftRoot?.NewAction?.toString();
	const showCreateForNewAction = newActionName
		? annotationExpression(
				converterContext?.getEntityType().actions[newActionName].annotations?.Core?.OperationAvailable?.valueOf(),
				[],
				true,
				(path: string) => singletonPathVisitor(path, converterContext, [])
		  )
		: undefined;
	// - If it's statically not insertable -> create is not visible
	// - If create is statically hidden -> create is not visible
	// - If it's an ALP template -> create is not visible
	// -
	// - Otherwise
	// 	 - If the create mode is external -> create is visible
	// 	 - If we're on the list report ->
	// 	 	- If UI.CreateHidden points to a property path -> provide a negated binding to this path
	// 	 	- Otherwise, create is visible
	// 	 - Otherwise
	// 	   - This depends on the value of the the UI.IsEditable
	return ifElse(
		or(
			or(
				equal(showCreateForNewAction, false),
				and(isConstant(isInsertable), equal(isInsertable, false), equal(showCreateForNewAction, undefined))
			),
			isConstant(isCreateHidden) && equal(isCreateHidden, true),
			or(
				viewConfiguration ? converterContext.getManifestWrapper().hasMultipleVisualizations(viewConfiguration) : false,
				converterContext.getTemplateType() === TemplateType.AnalyticalListPage
			)
		),
		false,
		ifElse(
			creationMode === "External",
			true,
			ifElse(
				converterContext.getTemplateType() === TemplateType.ListReport,
				ifElse(isBinding(isCreateHidden), not(isCreateHidden), true),
				and(not(isCreateHidden), UI.IsEditable)
			)
		)
	);
}

/**
 * Returns the visibility for the Paste button.
 *
 * @param converterContext The instance of the converter context
 * @param creationBehaviour The chosen behavior of creation
 * @param isInsertable The expression which denotes insert restrictions
 * @param pasteEnabledInManifest The flag which denotes the paste enablement status via manifest
 * @param viewConfiguration The instance of the configuration for the view path
 * @returns {Expression<boolean>} Expression or Boolean value of the UI.CreateHidden annotation
 */
export function getPasteEnabled(
	converterContext: ConverterContext,
	creationBehaviour: TableAnnotationConfiguration["create"],
	isInsertable: Expression<boolean>,
	pasteEnabledInManifest: boolean,
	viewConfiguration?: ViewPathConfiguration
): Expression<boolean> {
	// If create is not visible -> it's not enabled
	// If create is visible ->
	// 	 If it's in the ListReport -> not enabled
	//	 If it's insertable -> enabled
	return ifElse(
		pasteEnabledInManifest && equal(getCreateVisible(converterContext, creationBehaviour.mode, isInsertable, viewConfiguration), true),
		converterContext.getTemplateType() === TemplateType.ObjectPage && isInsertable,
		false
	);
}

/**
 * Returns a JSON string containing the sort conditions for the presentation variant.
 *
 * @param converterContext The instance of the converter context
 * @param {PresentationVariantTypeTypes | undefined} presentationVariantAnnotation Presentation variant annotation
 * @param columns Table columns processed by the converter
 * @returns {string | undefined} Sort conditions for a presentation variant.
 */
function getSortConditions(
	converterContext: ConverterContext,
	presentationVariantAnnotation: PresentationVariantTypeTypes | undefined,
	columns: TableColumn[]
): string | undefined {
	// Currently navigation property is not supported as sorter
	const nonSortableProperties = getNonSortablePropertiesRestrictions(converterContext.getEntitySet());
	let sortConditions: string | undefined;
	if (presentationVariantAnnotation?.SortOrder) {
		const sorters: SorterType[] = [];
		const conditions = {
			sorters: sorters
		};
		presentationVariantAnnotation.SortOrder.forEach(condition => {
			const conditionProperty = condition.Property;
			if (conditionProperty && nonSortableProperties.indexOf(conditionProperty.$target?.name) === -1) {
				const infoName = convertPropertyPathsToInfoNames([conditionProperty], columns)[0];
				if (infoName) {
					conditions.sorters.push({
						name: infoName,
						descending: !!condition.Descending
					});
				}
			}
		});
		sortConditions = conditions.sorters.length ? JSON.stringify(conditions) : undefined;
	}
	return sortConditions;
}

/**
 * Converts an array of propertyPath to an array of propertyInfo names.
 *
 * @param paths the array to be converted
 * @param columns the array of propertyInfos
 * @returns an array of propertyInfo names
 */

function convertPropertyPathsToInfoNames(paths: PropertyPath[], columns: TableColumn[]): string[] {
	const infoNames: string[] = [];
	paths.forEach(currentPath => {
		if (currentPath?.$target?.name) {
			const propertyInfo = columns.find(column => {
				const annotationColumn = column as AnnotationTableColumn;
				return !annotationColumn.propertyInfos && annotationColumn.relativePath === currentPath?.$target?.name;
			});
			if (propertyInfo) {
				infoNames.push(propertyInfo.name);
			}
		}
	});

	return infoNames;
}

/**
 * Returns a JSON string containing Presentation Variant group conditions.
 *
 * @param {PresentationVariantTypeTypes | undefined} presentationVariantAnnotation Presentation variant annotation
 * @param columns Converter processed table columns
 * @returns {string | undefined} Group conditions for a Presentation variant.
 */
function getGroupConditions(
	presentationVariantAnnotation: PresentationVariantTypeTypes | undefined,
	columns: TableColumn[]
): string | undefined {
	let groupConditions: string | undefined;
	if (presentationVariantAnnotation?.GroupBy) {
		const aGroupBy = presentationVariantAnnotation.GroupBy as PropertyPath[];
		const aGroupLevels = convertPropertyPathsToInfoNames(aGroupBy, columns).map(infoName => {
			return { name: infoName };
		});

		groupConditions = aGroupLevels.length ? JSON.stringify({ groupLevels: aGroupLevels }) : undefined;
	}
	return groupConditions;
}

/**
 * Returns a JSON string containing Presentation Variant aggregate conditions.
 *
 * @param {PresentationVariantTypeTypes | undefined} presentationVariantAnnotation Presentation variant annotation
 * @param columns Converter processed table columns
 * @returns {string | undefined} Group conditions for a Presentation variant.
 */
function getAggregateConditions(
	presentationVariantAnnotation: PresentationVariantTypeTypes | undefined,
	columns: TableColumn[]
): string | undefined {
	let aggregateConditions: string | undefined;
	if (presentationVariantAnnotation?.Total) {
		const aTotals = presentationVariantAnnotation.Total as PropertyPath[];
		const aggregates: Record<string, object> = {};
		convertPropertyPathsToInfoNames(aTotals, columns).forEach(infoName => {
			aggregates[infoName] = {};
		});

		aggregateConditions = JSON.stringify(aggregates);
	}

	return aggregateConditions;
}

export function getTableAnnotationConfiguration(
	lineItemAnnotation: LineItem | undefined,
	visualizationPath: string,
	converterContext: ConverterContext,
	tableManifestConfiguration: TableControlConfiguration,
	columns: TableColumn[],
	presentationVariantAnnotation?: PresentationVariantTypeTypes,
	viewConfiguration?: ViewPathConfiguration
): TableAnnotationConfiguration {
	// Need to get the target
	const { navigationPropertyPath } = splitPath(visualizationPath);
	const title: any = converterContext.getDataModelObjectPath().targetEntityType.annotations?.UI?.HeaderInfo?.TypeNamePlural;
	const entitySet = converterContext.getDataModelObjectPath().targetEntitySet;
	const pageManifestSettings: ManifestWrapper = converterContext.getManifestWrapper();
	const hasAbsolutePath = navigationPropertyPath.length === 0,
		p13nMode: string | undefined = getP13nMode(visualizationPath, converterContext, tableManifestConfiguration),
		id = navigationPropertyPath ? TableID(visualizationPath) : TableID(converterContext.getContextPath(), "LineItem");
	const targetCapabilities = getCapabilityRestriction(converterContext);
	const isDeleteButtonVisible = getDeleteVisible(
		converterContext,
		navigationPropertyPath,
		targetCapabilities.isDeletable,
		viewConfiguration
	);
	const selectionMode = getSelectionMode(
		lineItemAnnotation,
		visualizationPath,
		converterContext,
		hasAbsolutePath,
		targetCapabilities,
		isDeleteButtonVisible
	);
	let threshold = navigationPropertyPath ? 10 : 30;
	if (presentationVariantAnnotation?.MaxItems) {
		threshold = presentationVariantAnnotation.MaxItems.valueOf() as number;
	}
	const navigationTargetPath = getNavigationTargetPath(converterContext, navigationPropertyPath);
	const navigationSettings = pageManifestSettings.getNavigationConfiguration(navigationTargetPath);
	const creationBehaviour = _getCreationBehaviour(lineItemAnnotation, tableManifestConfiguration, converterContext, navigationSettings);
	let isParentDeletable: any, parentEntitySetDeletable;
	if (converterContext.getTemplateType() === TemplateType.ObjectPage) {
		isParentDeletable = isPathDeletable(converterContext.getDataModelObjectPath(), undefined, true);
		if (isParentDeletable?.currentEntityRestriction) {
			parentEntitySetDeletable = undefined;
		} else {
			parentEntitySetDeletable = isParentDeletable ? compileBinding(isParentDeletable, true) : isParentDeletable;
		}
	}
	const dataModelObjectPath = converterContext.getDataModelObjectPath();
	const isInsertable: Expression<boolean> = isPathInsertable(dataModelObjectPath);
	const variantManagement: VariantManagementType = pageManifestSettings.getVariantManagement();
	const bMassEditVisible: any = getVisibilityMassEdit(converterContext, tableManifestConfiguration, targetCapabilities, selectionMode);
	const isSearchable = isPathSearchable(converterContext.getDataModelObjectPath());

	return {
		id: id,
		entityName: entitySet ? entitySet.name : "",
		collection: getTargetObjectPath(converterContext.getDataModelObjectPath()),
		navigationPath: navigationPropertyPath,
		row: _getRowConfigurationProperty(
			lineItemAnnotation,
			visualizationPath,
			converterContext,
			navigationSettings,
			navigationTargetPath
		),
		p13nMode: p13nMode,
		show: {
			"delete": compileBinding(isDeleteButtonVisible),
			create: compileBinding(getCreateVisible(converterContext, creationBehaviour?.mode, isInsertable)),
			paste: compileBinding(
				getPasteEnabled(
					converterContext,
					creationBehaviour,
					isInsertable,
					tableManifestConfiguration.enablePaste,
					viewConfiguration
				)
			),
			massEdit: {
				visible: bMassEditVisible,
				enabled: getEnablementMassEdit(converterContext, bMassEditVisible)
			}
		},
		displayMode: isInDisplayMode(converterContext, viewConfiguration),
		create: creationBehaviour,
		selectionMode: selectionMode,
		autoBindOnInit:
			converterContext.getTemplateType() !== TemplateType.ListReport &&
			converterContext.getTemplateType() !== TemplateType.AnalyticalListPage &&
			!(viewConfiguration && converterContext.getManifestWrapper().hasMultipleVisualizations(viewConfiguration)),
		variantManagement: variantManagement === "Control" && !p13nMode ? VariantManagementType.None : variantManagement,
		threshold: threshold,
		sortConditions: getSortConditions(converterContext, presentationVariantAnnotation, columns),
		parentEntityDeleteEnabled: parentEntitySetDeletable,
		title: title,
		searchable: tableManifestConfiguration.type !== "AnalyticalTable" && !(isConstant(isSearchable) && isSearchable.value === false)
	};
}

function _getExportDataType(dataType: string, isComplexProperty: boolean = false): string {
	let exportDataType: string = "String";
	if (isComplexProperty) {
		return exportDataType;
	} else {
		switch (dataType) {
			case "Edm.Decimal":
			case "Edm.Int32":
			case "Edm.Int64":
			case "Edm.Double":
			case "Edm.Byte":
				exportDataType = "Number";
				break;
			case "Edm.DateOfTime":
			case "Edm.Date":
				exportDataType = "Date";
				break;
			case "Edm.DateTimeOffset":
				exportDataType = "DateTime";
				break;
			case "Edm.TimeOfDay":
				exportDataType = "Time";
				break;
			case "Edm.Boolean":
				exportDataType = "Boolean";
				break;
			default:
				exportDataType = "String";
		}
	}
	return exportDataType;
}

function isInDisplayMode(converterContext: ConverterContext, viewConfiguration?: ViewPathConfiguration): boolean {
	const templateType = converterContext.getTemplateType();
	if (
		templateType === TemplateType.ListReport ||
		templateType === TemplateType.AnalyticalListPage ||
		(viewConfiguration && converterContext.getManifestWrapper().hasMultipleVisualizations(viewConfiguration))
	) {
		return true;
	}
	// updatable will be handled at the property level
	return false;
}

/**
 * Split the visualization path into the navigation property path and annotation.
 *
 * @param visualizationPath
 * @returns {object}
 */
export function splitPath(visualizationPath: string) {
	let [navigationPropertyPath, annotationPath] = visualizationPath.split("@");

	if (navigationPropertyPath.lastIndexOf("/") === navigationPropertyPath.length - 1) {
		// Drop trailing slash
		navigationPropertyPath = navigationPropertyPath.substr(0, navigationPropertyPath.length - 1);
	}
	return { navigationPropertyPath, annotationPath };
}

export function getSelectionVariantConfiguration(
	selectionVariantPath: string,
	converterContext: ConverterContext
): SelectionVariantConfiguration | undefined {
	const resolvedTarget = converterContext.getEntityTypeAnnotation(selectionVariantPath);
	const selection: SelectionVariantType = resolvedTarget.annotation as SelectionVariantType;

	if (selection) {
		const propertyNames: string[] = [];
		selection.SelectOptions?.forEach((selectOption: SelectOptionType) => {
			const propertyName: any = selectOption.PropertyName;
			const PropertyPath: string = propertyName.value;
			if (propertyNames.indexOf(PropertyPath) === -1) {
				propertyNames.push(PropertyPath);
			}
		});
		return {
			text: selection?.Text?.toString(),
			propertyNames: propertyNames
		};
	}
	return undefined;
}

export function getTableManifestConfiguration(
	lineItemAnnotation: LineItem | undefined,
	visualizationPath: string,
	converterContext: ConverterContext,
	checkCondensedLayout: boolean = false
): TableControlConfiguration {
	const tableManifestSettings: TableManifestConfiguration = converterContext.getManifestControlConfiguration(visualizationPath);
	const tableSettings = (tableManifestSettings && tableManifestSettings.tableSettings) || {};
	let quickSelectionVariant: any;
	const quickFilterPaths: { annotationPath: string }[] = [];
	let enableExport = true;
	let creationMode = CreationMode.NewPage;
	let filters;
	let createAtEnd = true;
	let disableAddRowButtonForEmptyData = false;
	let customValidationFunction;
	let condensedTableLayout = false;
	let hideTableTitle = false;
	let tableType: TableType = "ResponsiveTable";
	let enableFullScreen = false;
	let selectionLimit = 200;
	let multiSelectMode;
	const enableAutoColumnWidth = true;
	let enablePaste = converterContext.getTemplateType() === "ObjectPage";
	const isCondensedTableLayoutCompliant = checkCondensedLayout && converterContext.getManifestWrapper().isCondensedLayoutCompliant();
	const entityType = converterContext.getEntityType();
	const aggregationHelper = new AggregationHelper(entityType, converterContext);
	if (lineItemAnnotation) {
		const targetEntityType = converterContext.getAnnotationEntityType(lineItemAnnotation);
		tableSettings?.quickVariantSelection?.paths?.forEach((path: { annotationPath: string }) => {
			quickSelectionVariant = targetEntityType.resolvePath("@" + path.annotationPath);
			// quickSelectionVariant = converterContext.getEntityTypeAnnotation(path.annotationPath);
			if (quickSelectionVariant) {
				quickFilterPaths.push({ annotationPath: path.annotationPath });
			}
			filters = {
				quickFilters: {
					enabled:
						converterContext.getTemplateType() === TemplateType.ListReport
							? "{= ${pageInternal>hasPendingFilters} !== true}"
							: true,
					showCounts: tableSettings?.quickVariantSelection?.showCounts,
					paths: quickFilterPaths
				}
			};
		});
		creationMode = tableSettings.creationMode?.name || creationMode;
		createAtEnd = tableSettings.creationMode?.createAtEnd !== undefined ? tableSettings.creationMode?.createAtEnd : true;
		customValidationFunction = tableSettings.creationMode?.customValidationFunction;
		// if a custom validation function is provided, disableAddRowButtonForEmptyData should not be considered, i.e. set to false
		disableAddRowButtonForEmptyData = !customValidationFunction ? !!tableSettings.creationMode?.disableAddRowButtonForEmptyData : false;
		condensedTableLayout = tableSettings.condensedTableLayout !== undefined ? tableSettings.condensedTableLayout : false;
		hideTableTitle = !!tableSettings.quickVariantSelection?.hideTableTitle;
		tableType = tableSettings?.type || "ResponsiveTable";
		if (converterContext.getTemplateType() !== "ObjectPage") {
			if (tableSettings?.type === "AnalyticalTable" && !aggregationHelper.isAnalyticsSupported()) {
				tableType = "GridTable";
			}
			if (!tableSettings?.type) {
				if (converterContext.getManifestWrapper().isDesktop() && aggregationHelper.isAnalyticsSupported()) {
					tableType = "AnalyticalTable";
				} else {
					tableType = "ResponsiveTable";
				}
			}
		}
		enableFullScreen = tableSettings.enableFullScreen || false;
		if (enableFullScreen === true && converterContext.getTemplateType() === TemplateType.ListReport) {
			enableFullScreen = false;
			converterContext
				.getDiagnostics()
				.addIssue(IssueCategory.Manifest, IssueSeverity.Low, IssueType.FULLSCREENMODE_NOT_ON_LISTREPORT);
		}
		selectionLimit = tableSettings.selectAll === true || tableSettings.selectionLimit === 0 ? 0 : tableSettings.selectionLimit || 200;
		if (tableType === "ResponsiveTable") {
			if (
				converterContext.getTemplateType() === TemplateType.ListReport ||
				converterContext.getTemplateType() === TemplateType.AnalyticalListPage
			) {
				multiSelectMode = !!tableSettings.selectAll ? "Default" : "ClearAll";
			}
			if (converterContext.getTemplateType() === TemplateType.ObjectPage) {
				if (converterContext.getManifestWrapper().useIconTabBar()) {
					multiSelectMode = !!tableSettings.selectAll ? "Default" : "ClearAll";
				} else {
					multiSelectMode = tableSettings.selectAll === false ? "ClearAll" : "Default";
				}
			}
		}
		enablePaste = converterContext.getTemplateType() === "ObjectPage" && tableSettings.enablePaste !== false;
		enableExport =
			tableSettings.enableExport !== undefined
				? tableSettings.enableExport
				: converterContext.getTemplateType() !== "ObjectPage" || enablePaste;
	}
	return {
		filters: filters,
		type: tableType,
		enableFullScreen: enableFullScreen,
		headerVisible: !(quickSelectionVariant && hideTableTitle),
		enableExport: enableExport,
		creationMode: creationMode,
		createAtEnd: createAtEnd,
		disableAddRowButtonForEmptyData: disableAddRowButtonForEmptyData,
		customValidationFunction: customValidationFunction,
		useCondensedTableLayout: condensedTableLayout && isCondensedTableLayoutCompliant,
		selectionLimit: selectionLimit,
		multiSelectMode: multiSelectMode,
		enablePaste: enablePaste,
		showRowCount:
			!tableSettings?.quickVariantSelection?.showCounts && !converterContext.getManifestWrapper().getViewConfiguration()?.showCounts,
		enableMassEdit: tableSettings?.enableMassEdit,
		enableAutoColumnWidth: enableAutoColumnWidth
	};
}
