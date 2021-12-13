import {
	MultipleViewsConfiguration,
	ViewPathConfiguration,
	SingleViewPathConfiguration,
	VisualizationType,
	TemplateType,
	CombinedViewPathConfiguration,
	CustomViewTemplateConfiguration
} from "../ManifestSettings";
import { EntityType } from "@sap-ux/annotation-converter";
import {
	DataVisualizationAnnotations,
	DataVisualizationDefinition,
	getDataVisualizationConfiguration,
	getDefaultChart,
	getDefaultLineItem,
	getDefaultPresentationVariant,
	getSelectionPresentationVariant,
	isPresentationCompliant,
	getSelectionVariant,
	isSelectionPresentationCompliant
} from "../controls/Common/DataVisualization";
import {
	LineItem,
	PresentationVariantTypeTypes,
	SelectionPresentationVariantTypeTypes,
	SelectionVariantTypeTypes
} from "@sap-ux/vocabularies-types/dist/generated/UI";
import { UIAnnotationTerms } from "@sap-ux/vocabularies-types";
import { CustomTabID, FilterBarID, FilterVariantManagementID, TableID, ChartID } from "../helpers/ID";
import { TableVisualization } from "sap/fe/core/converters/controls/Common/Table";
import { ChartVisualization } from "sap/fe/core/converters/controls/Common/Chart";
import { BaseAction, getActionsFromManifest } from "sap/fe/core/converters/controls/Common/Action";
import { ConfigurableObject, insertCustomElements } from "sap/fe/core/converters/helpers/ConfigurableObject";
import { annotationExpression, compileBinding } from "sap/fe/core/helpers/BindingExpression";
import ConverterContext from "sap/fe/core/converters/ConverterContext";
import { KPIDefinition, getKPIDefinitions } from "../controls/Common/KPI";
import {
	getSelectionFields,
	getManifestFilterFields,
	getFilterBarhideBasicSearch,
	FilterField,
	CustomElementFilterField
} from "sap/fe/core/converters/controls/ListReport/FilterBar";

type ViewAnnotationsTypeTypes = SelectionPresentationVariantTypeTypes | SelectionVariantTypeTypes;
type VariantManagementDefinition = {
	id: string;
	targetControlIds: string;
};

type MultipleViewConfiguration = ViewPathConfiguration & {
	annotation?: DataVisualizationAnnotations;
};

type SingleViewConfiguration = {
	annotation?: DataVisualizationAnnotations;
};

type CustomViewConfiguration = CustomViewTemplateConfiguration & {
	type: string;
};

type ViewConfiguration = MultipleViewConfiguration | SingleViewConfiguration | CustomViewConfiguration;
type ViewAnnotationConfiguration = MultipleViewConfiguration | SingleViewConfiguration;

type ViewConverterSettings = ViewConfiguration & {
	converterContext?: ConverterContext;
};

type DefaultSemanticDate = ConfigurableObject & {
	operator: string;
};

export type ListReportDefinition = {
	mainEntitySet: string;
	mainEntityType: string; // entityType> at the start of LR templating
	singleTableId?: string; // only with single Table mode
	singleChartId?: string; // only with single Table mode
	showTabCounts?: boolean; // only with multi Table mode
	headerActions: BaseAction[];
	showPinnableToggle?: boolean;
	filterBar: {
		selectionFields: FilterField[];
		hideBasicSearch: boolean;
	};
	views: ListReportViewDefinition[];
	filterConditions: object;
	isMultiEntitySets: boolean;
	filterBarId: string;
	variantManagement: VariantManagementDefinition;
	hasMultiVisualizations: boolean;
	useSemanticDateRange?: boolean;
	filterInitialLayout?: string;
	filterLayout?: string;
	kpiDefinitions: KPIDefinition[];
};

export type ListReportViewDefinition = SingleViewDefinition | CustomViewDefinition | CombinedViewDefinition;

export type CombinedViewDefinition = {
	selectionVariantPath?: string; // only with on multi Table mode
	title?: string; // only with multi Table mode
	primaryVisualization: DataVisualizationDefinition;
	secondaryVisualization: DataVisualizationDefinition;
	tableControlId: string;
	chartControlId: string;
	defaultPath?: string;
};

export type CustomViewDefinition = {
	title?: string; // only with multi Table mode
	fragment: string;
	type: string;
	customTabId: string;
};
export type SingleViewDefinition = SingleTableViewDefinition | SingleChartViewDefinition;

export type BaseSingleViewDefinition = {
	selectionVariantPath?: string; // only with on multi Table mode
	title?: string; // only with multi Table mode
	presentation: DataVisualizationDefinition;
};

export type SingleTableViewDefinition = BaseSingleViewDefinition & {
	tableControlId?: string;
};

export type SingleChartViewDefinition = BaseSingleViewDefinition & {
	chartControlId?: string;
};

type ContentAreaID = {
	chartId: string;
	tableId: string;
};

/**
 * Retrieves all list report tables.
 * @param {ListReportViewDefinition[]} views The list report views configured in the manifest
 * @returns {TableVisualization[]} The list report table
 */
function getTableVisualizations(views: ListReportViewDefinition[]): TableVisualization[] {
	const tables: TableVisualization[] = [];
	views.forEach(function(view) {
		if (!(view as CustomViewDefinition).type) {
			const visualizations = (view as CombinedViewDefinition).secondaryVisualization
				? (view as CombinedViewDefinition).secondaryVisualization.visualizations
				: (view as SingleViewDefinition).presentation.visualizations;

			visualizations.forEach(function(visualization) {
				if (visualization.type === VisualizationType.Table) {
					tables.push(visualization);
				}
			});
		}
	});
	return tables;
}

function getChartVisualizations(views: ListReportViewDefinition[]): ChartVisualization[] {
	const charts: ChartVisualization[] = [];
	views.forEach(function(view) {
		if (!(view as CustomViewDefinition).type) {
			const visualizations = (view as CombinedViewDefinition).primaryVisualization
				? (view as CombinedViewDefinition).primaryVisualization.visualizations
				: (view as SingleViewDefinition).presentation.visualizations;

			visualizations.forEach(function(visualization) {
				if (visualization.type === VisualizationType.Chart) {
					charts.push(visualization);
				}
			});
		}
	});
	return charts;
}

const getDefaultSemanticDates = function(filterFields: Record<string, CustomElementFilterField>): Record<string, DefaultSemanticDate> {
	const defaultSemanticDates: any = {};
	for (const filterField in filterFields) {
		if (filterFields[filterField]?.settings?.defaultValues?.length) {
			defaultSemanticDates[filterField] = filterFields[filterField]?.settings?.defaultValues;
		}
	}
	return defaultSemanticDates;
};

/**
 * Find a visualization annotation that can be used for rendering the list report.
 *
 * @param {EntityType} entityType The current EntityType
 * @param converterContext
 * @param bIsALP
 * @returns {LineItem | PresentationVariantTypeTypes | undefined} A compliant annotation for rendering the list report
 */
function getCompliantVisualizationAnnotation(
	entityType: EntityType,
	converterContext: ConverterContext,
	bIsALP: Boolean
): LineItem | PresentationVariantTypeTypes | SelectionPresentationVariantTypeTypes | undefined {
	const annotationPath = converterContext.getManifestWrapper().getDefaultTemplateAnnotationPath();
	const selectionPresentationVariant = getSelectionPresentationVariant(entityType, annotationPath, converterContext);
	if (annotationPath && selectionPresentationVariant) {
		const presentationVariant = selectionPresentationVariant.PresentationVariant;
		if (!presentationVariant) {
			throw new Error("Presentation Variant is not configured in the SPV mentioned in the manifest");
		}
		const bPVComplaint = isPresentationCompliant(selectionPresentationVariant.PresentationVariant);
		if (!bPVComplaint) {
			return undefined;
		}
		if (isSelectionPresentationCompliant(selectionPresentationVariant, bIsALP)) {
			return selectionPresentationVariant;
		}
	}
	if (selectionPresentationVariant) {
		if (isSelectionPresentationCompliant(selectionPresentationVariant, bIsALP)) {
			return selectionPresentationVariant;
		}
	}
	const presentationVariant = getDefaultPresentationVariant(entityType);
	if (presentationVariant) {
		if (isPresentationCompliant(presentationVariant, bIsALP)) {
			return presentationVariant;
		}
	}
	if (!bIsALP) {
		const defaultLineItem = getDefaultLineItem(entityType);
		if (defaultLineItem) {
			return defaultLineItem;
		}
	}
	return undefined;
}

const getView = function(viewConverterConfiguration: ViewConverterSettings): ListReportViewDefinition {
	let config = viewConverterConfiguration;
	if (config.converterContext) {
		let converterContext = config.converterContext;
		config = config as ViewAnnotationConfiguration;
		let presentation: DataVisualizationDefinition = getDataVisualizationConfiguration(
			config.annotation
				? converterContext.getRelativeAnnotationPath(config.annotation.fullyQualifiedName, converterContext.getEntityType())
				: "",
			true,
			converterContext,
			config as ViewPathConfiguration
		);
		let tableControlId = "";
		let chartControlId = "";
		let title: string | undefined = "";
		let selectionVariantPath = "";
		const isMultipleViewConfiguration = function(config: ViewConfiguration): config is MultipleViewConfiguration {
			return (config as MultipleViewConfiguration).key !== undefined;
		};
		const createVisualization = function(presentation: DataVisualizationDefinition, isPrimary?: boolean) {
			let defaultVisualization;
			for (const visualization of presentation.visualizations) {
				if (isPrimary && visualization.type === VisualizationType.Chart) {
					defaultVisualization = visualization;
					break;
				}
				if (!isPrimary && visualization.type === VisualizationType.Table) {
					defaultVisualization = visualization;
					break;
				}
			}
			const presentationCreated = Object.assign({}, presentation);
			if (defaultVisualization) {
				presentationCreated.visualizations = [defaultVisualization];
			}
			return presentationCreated;
		};
		const getPresentation = function(item: SingleViewPathConfiguration) {
			const resolvedTarget = converterContext.getEntityTypeAnnotation(item.annotationPath);
			const targetAnnotation = resolvedTarget.annotation as DataVisualizationAnnotations;
			converterContext = resolvedTarget.converterContext;
			const annotation = targetAnnotation;
			presentation = getDataVisualizationConfiguration(
				annotation
					? converterContext.getRelativeAnnotationPath(annotation.fullyQualifiedName, converterContext.getEntityType())
					: "",
				true,
				converterContext,
				config as ViewPathConfiguration
			);
			return presentation;
		};
		const createAlpView = function(
			presentations: DataVisualizationDefinition[],
			defaultPath: "both" | "primary" | "secondary" | undefined
		) {
			const primaryVisualization: DataVisualizationDefinition | undefined = createVisualization(presentations[0], true);
			chartControlId = (primaryVisualization?.visualizations[0] as ChartVisualization).id;
			const secondaryVisualization: DataVisualizationDefinition | undefined = createVisualization(
				presentations[1] ? presentations[1] : presentations[0]
			);
			tableControlId = (secondaryVisualization?.visualizations[0] as TableVisualization).annotation.id;
			if (primaryVisualization && secondaryVisualization) {
				const view: CombinedViewDefinition = {
					primaryVisualization,
					secondaryVisualization,
					tableControlId,
					chartControlId,
					defaultPath
				};
				return view;
			}
		};
		if (presentation?.visualizations?.length === 2 && converterContext.getTemplateType() === TemplateType.AnalyticalListPage) {
			const view: CombinedViewDefinition | undefined = createAlpView([presentation], "both");
			if (view) {
				return view;
			}
		} else if (
			converterContext.getManifestWrapper().hasMultipleVisualizations(config as ViewPathConfiguration) ||
			converterContext.getTemplateType() === TemplateType.AnalyticalListPage
		) {
			const { primary, secondary } = config as CombinedViewPathConfiguration;
			if (primary && primary.length && secondary && secondary.length) {
				const view: CombinedViewDefinition | undefined = createAlpView(
					[getPresentation(primary[0]), getPresentation(secondary[0])],
					(config as CombinedViewPathConfiguration).defaultPath
				);
				if (view) {
					return view;
				}
			} else {
				throw new Error("SecondaryItems in the Views is not present");
			}
		} else if (isMultipleViewConfiguration(config)) {
			// key exists only on multi tables mode
			const resolvedTarget = converterContext.getEntityTypeAnnotation((config as SingleViewPathConfiguration).annotationPath);
			const viewAnnotation: ViewAnnotationsTypeTypes = resolvedTarget.annotation as ViewAnnotationsTypeTypes;
			converterContext = resolvedTarget.converterContext;
			title = compileBinding(annotationExpression(viewAnnotation.Text));
			// Need to loop on table into views since multi table mode get specific configuration (hidden filters or Table Id)
			presentation.visualizations.forEach((visualizationDefinition, index) => {
				switch (visualizationDefinition.type) {
					case VisualizationType.Table:
						const tableVisualization = presentation.visualizations[index] as TableVisualization;
						const filters = tableVisualization.control.filters || {};
						filters.hiddenFilters = filters.hiddenFilters || { paths: [] };
						if (!(config as SingleViewPathConfiguration).keepPreviousPresonalization) {
							// Need to override Table Id to match with Tab Key (currently only table is managed in multiple view mode)
							tableVisualization.annotation.id = TableID((config as SingleViewPathConfiguration).key || "", "LineItem");
						}
						config = config as ViewAnnotationConfiguration;
						if (config && config.annotation && config.annotation.term === UIAnnotationTerms.SelectionPresentationVariant) {
							selectionVariantPath = (config.annotation as SelectionPresentationVariantTypeTypes).SelectionVariant.fullyQualifiedName.split(
								"@"
							)[1];
						} else {
							selectionVariantPath = (config as SingleViewPathConfiguration).annotationPath;
						}
						//Provide Selection Variant to hiddenFilters in order to set the SV filters to the table.
						//MDC Table overrides binding Filter and from SAP FE the only method where we are able to add
						//additional filter is 'rebindTable' into Table delegate.
						//To avoid implementing specific LR feature to SAP FE Macro Table, the filter(s) related to the Tab (multi table mode)
						//can be passed to macro table via parameter/context named filters and key hiddenFilters.
						filters.hiddenFilters.paths.push({ annotationPath: selectionVariantPath });
						tableVisualization.control.filters = filters;
						break;
					case VisualizationType.Chart:
						const chartVisualization = presentation.visualizations[index] as ChartVisualization;
						chartVisualization.id = ChartID((config as SingleViewPathConfiguration).key || "", "Chart");
						break;
					default:
						break;
				}
			});
		}
		presentation.visualizations.forEach(visualizationDefinition => {
			if (visualizationDefinition.type === VisualizationType.Table) {
				tableControlId = visualizationDefinition.annotation.id;
			} else if (visualizationDefinition.type === VisualizationType.Chart) {
				chartControlId = visualizationDefinition.id;
			}
		});
		return {
			presentation,
			tableControlId,
			chartControlId,
			title,
			selectionVariantPath
		};
	} else {
		config = config as CustomViewConfiguration;
		const title = config.label,
			fragment = config.template,
			type = config.type,
			customTabId = CustomTabID(config.key || "");
		return {
			title,
			fragment,
			type,
			customTabId
		};
	}
};

const getViews = function(
	converterContext: ConverterContext,
	settingsViews: MultipleViewsConfiguration | undefined
): ListReportViewDefinition[] {
	let viewConverterConfigs: ViewConverterSettings[] = [];
	if (settingsViews) {
		settingsViews.paths.forEach((path: ViewPathConfiguration | CustomViewTemplateConfiguration) => {
			if (converterContext.getManifestWrapper().hasMultipleVisualizations(path as ViewPathConfiguration)) {
				if (settingsViews.paths.length > 1) {
					throw new Error("ALP flavor cannot have multiple views");
				} else {
					path = path as CombinedViewPathConfiguration;
					viewConverterConfigs.push({
						converterContext: converterContext,
						primary: path.primary,
						secondary: path.secondary,
						defaultPath: path.defaultPath
					});
				}
			} else if ((path as CustomViewConfiguration).template) {
				path = path as CustomViewConfiguration;
				viewConverterConfigs.push({
					key: path.key,
					label: path.label,
					template: path.template,
					type: "Custom"
				});
			} else {
				path = path as SingleViewPathConfiguration;
				const manifestWrapper = converterContext.getManifestWrapper(),
					viewConverterContext = converterContext.getConverterContextFor(
						path.contextPath || (path.entitySet && "/" + path.entitySet) || converterContext.getContextPath()
					),
					entityType = viewConverterContext.getEntityType();

				if (entityType && viewConverterContext) {
					const annotationPath = manifestWrapper.getDefaultTemplateAnnotationPath();
					let annotation;
					const resolvedTarget = viewConverterContext.getEntityTypeAnnotation(path.annotationPath);
					const targetAnnotation = resolvedTarget.annotation as DataVisualizationAnnotations;
					const resolvedTargetconverterContext = resolvedTarget.converterContext;
					if (targetAnnotation) {
						if (targetAnnotation.term === UIAnnotationTerms.SelectionVariant) {
							if (annotationPath) {
								annotation = getSelectionPresentationVariant(
									viewConverterContext.getEntityType(),
									annotationPath,
									resolvedTargetconverterContext
								);
							} else {
								annotation = getDefaultLineItem(viewConverterContext.getEntityType()) as LineItem;
							}
						} else {
							annotation = targetAnnotation;
						}
						viewConverterConfigs.push({
							converterContext: viewConverterContext,
							annotation,
							annotationPath: path.annotationPath,
							keepPreviousPresonalization: path.keepPreviousPresonalization,
							key: path.key
						});
					}
				} else {
					// TODO Diagnostics message
				}
			}
		});
	} else {
		const entityType = converterContext.getEntityType();
		if (converterContext.getTemplateType() === TemplateType.AnalyticalListPage) {
			viewConverterConfigs = getAlpViewConfig(converterContext, viewConverterConfigs);
		} else {
			viewConverterConfigs.push({
				annotation: getCompliantVisualizationAnnotation(entityType, converterContext, false),
				converterContext: converterContext
			});
		}
	}
	return viewConverterConfigs.map(viewConverterConfig => {
		return getView(viewConverterConfig);
	});
};

function getAlpViewConfig(converterContext: ConverterContext, viewConfigs: ViewConverterSettings[]): ViewConverterSettings[] {
	const entityType = converterContext.getEntityType();
	const annotation = getCompliantVisualizationAnnotation(entityType, converterContext, true);
	let chart, table;
	if (annotation) {
		viewConfigs.push({
			annotation: annotation,
			converterContext
		});
	} else {
		chart = getDefaultChart(entityType);
		table = getDefaultLineItem(entityType);
		if (chart && table) {
			const primary: SingleViewPathConfiguration[] = [{ annotationPath: chart.term }];
			const secondary: SingleViewPathConfiguration[] = [{ annotationPath: table.term }];
			viewConfigs.push({
				converterContext: converterContext,
				primary: primary,
				secondary: secondary,
				defaultPath: "both"
			});
		}
	}
	return viewConfigs;
}

export const getHeaderActions = function(converterContext: ConverterContext): BaseAction[] {
	const manifestWrapper = converterContext.getManifestWrapper();
	return insertCustomElements([], getActionsFromManifest(manifestWrapper.getHeaderActions(), converterContext));
};

export const checkChartFilterBarId = function(views: ListReportViewDefinition[], filterBarId: string) {
	views.forEach(view => {
		if (!(view as CustomViewDefinition).type) {
			const presentation: DataVisualizationDefinition = (view as SingleViewDefinition).presentation;
			presentation.visualizations.forEach(visualizationDefinition => {
				if (visualizationDefinition.type === VisualizationType.Chart && visualizationDefinition.filterId !== filterBarId) {
					visualizationDefinition.filterId = filterBarId;
				}
			});
		}
	});
};

/**
 * Creates the ListReportDefinition for multiple entity sets (multiple table mode).
 *
 * @param converterContext The converter context
 * @returns {ListReportDefinition} The list report definition based on annotation + manifest
 */
export const convertPage = function(converterContext: ConverterContext): ListReportDefinition {
	const entityType = converterContext.getEntityType();
	const sContextPath = converterContext.getContextPath();

	if (!sContextPath) {
		// If we don't have an entitySet at this point we have an issue I'd say
		throw new Error(
			"An EntitySet is required to be able to display a ListReport, please adjust your `entitySet` property to point to one."
		);
	}
	const manifestWrapper = converterContext.getManifestWrapper();
	const viewsDefinition: MultipleViewsConfiguration | undefined = manifestWrapper.getViewConfiguration();
	const hasMultipleEntitySets = manifestWrapper.hasMultipleEntitySets();
	const views: ListReportViewDefinition[] = getViews(converterContext, viewsDefinition);
	const showTabCounts = viewsDefinition ? viewsDefinition?.showCounts || hasMultipleEntitySets : undefined; // with multi EntitySets, tab counts are displayed by default
	const lrTableVisualizations = getTableVisualizations(views);
	const lrChartVisualizations = getChartVisualizations(views);
	const showPinnableToggle = lrTableVisualizations.some(table => table.control.type === "ResponsiveTable");
	let singleTableId = "";
	let singleChartId = "";
	const filterBarId = FilterBarID(sContextPath);
	const filterVariantManagementID = FilterVariantManagementID(filterBarId);
	let targetControlIds = [filterBarId].concat(
		lrTableVisualizations.map(visualization => {
			return visualization.annotation.id;
		})
	);
	targetControlIds = targetControlIds.concat(
		lrChartVisualizations.map(visualization => {
			return visualization.id;
		})
	);
	const fbConfig = manifestWrapper.getFilterConfiguration();
	const filterInitialLayout = fbConfig?.initialLayout !== undefined ? fbConfig?.initialLayout.toLowerCase() : "compact";
	const filterLayout = fbConfig?.layout !== undefined ? fbConfig?.layout.toLowerCase() : "compact";
	const useSemanticDateRange = fbConfig.useSemanticDateRange !== undefined ? fbConfig.useSemanticDateRange : true;

	const oConfig = getContentAreaId(converterContext, views);
	if (oConfig) {
		singleChartId = oConfig.chartId;
		singleTableId = oConfig.tableId;
	}
	const selectionFields = getSelectionFields(converterContext, lrTableVisualizations);

	const hideBasicSearch = getFilterBarhideBasicSearch(lrTableVisualizations, converterContext);
	const selectionVariant = getSelectionVariant(entityType, converterContext);
	const defaultSemanticDates: any = useSemanticDateRange
		? getDefaultSemanticDates(getManifestFilterFields(entityType, converterContext))
		: {};
	// Sort header actions according to position attributes in manifest
	const headerActions = getHeaderActions(converterContext);
	const hasMultiVisualizations: boolean =
		manifestWrapper.hasMultipleVisualizations() || converterContext.getTemplateType() === TemplateType.AnalyticalListPage;
	if (hasMultipleEntitySets) {
		checkChartFilterBarId(views, filterBarId);
	}

	return {
		mainEntitySet: sContextPath,
		mainEntityType: sContextPath + "/",
		singleTableId,
		singleChartId,
		showTabCounts,
		headerActions,
		showPinnableToggle: showPinnableToggle,
		filterBar: {
			selectionFields,
			hideBasicSearch
		},
		views: views,
		filterBarId,
		filterConditions: {
			selectionVariant: selectionVariant,
			defaultSemanticDates: defaultSemanticDates
		},
		variantManagement: {
			id: filterVariantManagementID,
			targetControlIds: targetControlIds.join(",")
		},
		isMultiEntitySets: hasMultipleEntitySets,
		hasMultiVisualizations: hasMultiVisualizations,
		useSemanticDateRange,
		filterInitialLayout,
		filterLayout,
		kpiDefinitions: getKPIDefinitions(converterContext)
	};
};

function getContentAreaId(converterContext: ConverterContext, views: ListReportViewDefinition[]): ContentAreaID | undefined {
	let singleTableId = "",
		singleChartId = "";
	if (
		converterContext.getManifestWrapper().hasMultipleVisualizations() ||
		converterContext.getTemplateType() === TemplateType.AnalyticalListPage
	) {
		for (let view of views) {
			view = view as CombinedViewDefinition;
			if (view.chartControlId && view.tableControlId) {
				singleChartId = view.chartControlId;
				singleTableId = view.tableControlId;
				break;
			}
		}
	} else {
		for (let view of views) {
			view = view as SingleViewDefinition;
			if (!singleTableId && (view as SingleTableViewDefinition).tableControlId) {
				singleTableId = (view as SingleTableViewDefinition).tableControlId || "";
			}
			if (!singleChartId && (view as SingleChartViewDefinition).chartControlId) {
				singleChartId = (view as SingleChartViewDefinition).chartControlId || "";
			}
			if (singleChartId && singleTableId) {
				break;
			}
		}
	}
	if (singleTableId || singleChartId) {
		return {
			chartId: singleChartId,
			tableId: singleTableId
		};
	}
	return undefined;
}
