import { ConfigurableRecord, Position, Positionable } from "./helpers/ConfigurableObject";
import { FlexSettings, HeaderFacetType } from "sap/fe/core/converters/controls/ObjectPage/HeaderFacet";
import { BindingExpression } from "sap/fe/core/helpers/BindingExpression";
import { TableType } from "./controls/Common/Table";

export enum TemplateType {
	ListReport = "ListReport",
	ObjectPage = "ObjectPage",
	AnalyticalListPage = "AnalyticalListPage"
}

export enum ActionType {
	DataFieldForAction = "ForAction",
	DataFieldForIntentBasedNavigation = "ForNavigation",
	Default = "Default",
	Primary = "Primary",
	Secondary = "Secondary",
	SwitchToActiveObject = "SwitchToActiveObject",
	SwitchToDraftObject = "SwitchToDraftObject",
	DefaultApply = "DefaultApply",
	Menu = "Menu"
}

export type ManifestSideContent = {
	template: string;
	equalSplit?: boolean;
};

export enum VisualizationType {
	Table = "Table",
	Chart = "Chart"
}

export enum VariantManagementType {
	Page = "Page",
	Control = "Control",
	None = "None"
}

export type ContentDensitiesType = {
	compact?: boolean;
	cozy?: boolean;
};

export enum CreationMode {
	NewPage = "NewPage",
	Inline = "Inline",
	CreationRow = "CreationRow"
}

export enum AvailabilityType {
	Default = "Default",
	Adaptation = "Adaptation",
	Hidden = "Hidden"
}

export enum HorizontalAlign {
	End = "End",
	Begin = "Begin",
	Center = "Center"
}

export type TableColumnSettings = {
	microChartSize?: string;
	showMicroChartLabel?: boolean;
};

/**
 * Collection of format options for multiline text fields on a form or in a table
 */
export type FormatOptionsType = {
	hasDraftIndicator?: boolean;
	semantickeys?: string[];
	textLinesEdit?: number;
	textMaxCharactersDisplay?: number;
	textExpandBehaviorDisplay?: string;
};

/**
 * Configuration of a KPI in the manifest
 */
export type KPIConfiguration = {
	model?: string;
	entitySet: string;
	qualifier: string;
};

/**
 * @typedef BaseManifestSettings
 */
export type BaseManifestSettings = {
	content?: {
		header?: {
			facets?: ConfigurableRecord<ManifestHeaderFacet>;
			actions?: ConfigurableRecord<ManifestAction>;
		};
		footer?: {
			actions?: ConfigurableRecord<ManifestAction>;
		};
	};
	controlConfiguration?: {
		[annotationPath: string]: ControlManifestConfiguration;
	} & {
		"@com.sap.vocabularies.UI.v1.LineItem"?: TableManifestConfiguration;
		"@com.sap.vocabularies.UI.v1.Facets"?: FacetsControlConfiguration;
		"@com.sap.vocabularies.UI.v1.HeaderFacets"?: HeaderFacetsControlConfiguration;
		"@com.sap.vocabularies.UI.v1.SelectionFields"?: FilterManifestConfiguration;
	};
	converterType: TemplateType;
	entitySet: string;
	navigation?: {
		[navigationPath: string]: NavigationSettingsConfiguration;
	};
	viewLevel?: number;
	fclEnabled?: boolean;
	contextPath?: string;
	variantManagement?: VariantManagementType;
	defaultTemplateAnnotationPath?: string;
	contentDensities?: ContentDensitiesType;
	shellContentDensity?: string;
	isDesktop?: boolean;
};

export type NavigationTargetConfiguration = {
	outbound?: string;
	outboundDetail?: {
		semanticObject: string;
		action: string;
		parameters?: any;
	};
	route?: string;
};

/**
 * @typedef NavigationSettingsConfiguration
 */
export type NavigationSettingsConfiguration = {
	create?: NavigationTargetConfiguration;
	detail?: NavigationTargetConfiguration;
	display?: {
		outbound?: string;
		target?: string; // for compatibility
		route?: string;
	};
};

type HeaderFacetsControlConfiguration = {
	facets: ConfigurableRecord<ManifestHeaderFacet>;
};

type FacetsControlConfiguration = {
	sections: ConfigurableRecord<ManifestSection>;
};

type ManifestFormElement = Positionable & {
	template: string;
	label?: string;
	formatOptions?: FormatOptionsType;
};

export type FormManifestConfiguration = {
	fields: ConfigurableRecord<ManifestFormElement>;
};

export type ControlManifestConfiguration =
	| TableManifestConfiguration
	| ChartManifestConfiguration
	| FacetsControlConfiguration
	| HeaderFacetsControlConfiguration
	| FormManifestConfiguration
	| FilterManifestConfiguration;

/** Object Page **/

export type ObjectPageManifestSettings = BaseManifestSettings & {
	content?: {
		header?: {
			visible?: boolean;
			anchorBarVisible?: boolean;
			facets?: ConfigurableRecord<ManifestHeaderFacet>;
		};
		body?: {
			sections?: ConfigurableRecord<ManifestSection>;
		};
	};
	editableHeaderContent: boolean;
	sectionLayout: "Tabs" | "Page";
};

/**
 * @typedef ManifestHeaderFacet
 */
export type ManifestHeaderFacet = {
	type?: HeaderFacetType;
	name?: string;
	template?: string;
	position?: Position;
	visible?: BindingExpression<boolean>;
	title?: string;
	subTitle?: string;
	stashed?: boolean;
	flexSettings?: FlexSettings;
	requestGroupId?: string;
	templateEdit?: string;
};

/**
 * @typedef ManifestSection
 */
export type ManifestSection = {
	title?: string;
	id?: string;
	name?: string;
	visible?: BindingExpression<boolean>;
	position?: Position;
	template?: string;
	subSections?: Record<string, ManifestSubSection>;
	actions?: Record<string, ManifestAction>;
};

export type ManifestSubSection = {
	id?: string;
	name?: string;
	template?: string;
	title?: string;
	position?: Position;
	visible?: BindingExpression<boolean>;
	actions?: Record<string, ManifestAction>;
	sideContent?: ManifestSideContent;
};

/** List Report **/

export type ListReportManifestSettings = BaseManifestSettings & {
	initialLoad?: boolean;
	views?: MultipleViewsConfiguration;
	keyPerformanceIndicators?: {
		[kpiName: string]: KPIConfiguration;
	};
};

export type ViewPathConfiguration = SingleViewPathConfiguration | CombinedViewPathConfiguration;

export type ViewConfiguration = ViewPathConfiguration | CustomViewTemplateConfiguration;

export type CustomViewTemplateConfiguration = {
	key?: string;
	label: string;
	template: string;
};

export type SingleViewPathConfiguration = {
	keepPreviousPresonalization?: boolean;
	key?: string;
	entitySet?: string;
	annotationPath: string;
	contextPath?: string;
};

export type CombinedViewPathConfiguration = {
	primary: SingleViewPathConfiguration[];
	secondary: SingleViewPathConfiguration[];
	defaultPath?: "both" | "primary" | "secondary";
	key?: string;
};

/**
 * @typedef MultipleViewsConfiguration
 */
export type MultipleViewsConfiguration = {
	paths: ViewConfiguration[];
	showCounts?: boolean;
};

/** Filter Configuration **/

/** @typedef FilterManifestConfiguration **/
export type FilterManifestConfiguration = {
	filterFields?: Record<string, FilterFieldManifestConfiguration>;
	navigationProperties?: string[];
	useSemanticDateRange?: boolean;
	initialLayout?: string;
	layout?: string;
};

export type FilterFieldManifestConfiguration = Positionable & {
	label?: string;
	template?: string;
	availability?: AvailabilityType;
	settings?: FilterSettings;
	visualFilter?: visualFilterConfiguration;
};

export type visualFilterConfiguration = {
	valueList?: string;
};

export type OperatorConfiguration = {
	path: string;
	equals?: string;
	contains?: string;
	exclude: boolean;
};

export type DefaultOperator = {
	operator: string;
};

export type FilterSettings = {
	operatorConfiguration?: OperatorConfiguration[];
	defaultValues?: DefaultOperator[];
};

/** Chart Configuration **/

export type ChartPersonalizationManifestSettings =
	| boolean
	| {
			sort: boolean;
			type: boolean;
			item: boolean;
	  };

export type ChartManifestConfiguration = {
	chartSettings: {
		personalization: ChartPersonalizationManifestSettings;
	};
};

export type ActionAfterExecutionConfiguration = {
	navigateToInstance?: boolean;
	enableAutoScroll?: boolean;
};

/** Table Configuration **/

/**
 * @typedef ManifestAction
 */
export type ManifestAction = {
	menu?: string[];
	visible?: string;
	enabled?: string;
	position?: Position;
	press?: string;
	text?: string;
	__noWrap?: boolean;
	enableOnSelect?: string;
	defaultValuesFunction?: string;
	requiresSelection?: boolean;
	afterExecution?: ActionAfterExecutionConfiguration;
	inline?: boolean;
	determining?: boolean;
	facetName?: string;
};

export type ManifestTableColumnOverride = Positionable & {
	width?: string;
	horizontalAlign?: HorizontalAlign;
	afterExecution?: ActionAfterExecutionConfiguration;
	settings?: TableColumnSettings;
	formatOptions?: FormatOptionsType;
};

export type ManifestTableColumn = Positionable & {
	header: string;
	width?: string;
	type?: string;
	horizontalAlign?: HorizontalAlign;
	template: string;
	afterExecution?: ActionAfterExecutionConfiguration;
	availability?: AvailabilityType;
	settings?: TableColumnSettings;
	formatOptions?: FormatOptionsType;
	properties?: string[];
};

export type TableManifestConfiguration = {
	tableSettings?: TableManifestSettingsConfiguration;
	actions?: Record<string, ManifestAction>;
	columns?: Record<string, ManifestTableColumn | ManifestTableColumnOverride>;
};

export enum SelectionMode {
	Auto = "Auto",
	None = "None",
	Multi = "Multi",
	Single = "Single"
}

export type TablePersonalizationConfiguration =
	| boolean
	| {
			sort: boolean;
			column: boolean;
			filter: boolean;
			group: boolean;
			aggregate: boolean;
	  };

export type TableManifestSettingsConfiguration = {
	creationMode?: {
		disableAddRowButtonForEmptyData?: boolean;
		customValidationFunction?: string;
		createAtEnd?: boolean;
		name?: CreationMode;
	};
	enableExport?: boolean;
	quickVariantSelection?: {
		paths: [
			{
				annotationPath: string;
			}
		];
		hideTableTitle?: boolean;
		showCounts?: boolean;
	};
	personalization?: TablePersonalizationConfiguration;
	/**
	 * Defines how many items in a table can be selected. You have the following options:
	 * => by defining 'None' you can fully disable the list selection
	 * => by defining 'Single' you allow only one item to be selected
	 * => by defining 'Multi' you allow several items to be selected
	 * => by using 'Auto' you leave the default definition 'None', except if there is an action that requires a selection (such as deleting, or IBN)
	 */
	selectionMode?: SelectionMode;
	type?: TableType;
	condensedTableLayout?: boolean;
	selectAll?: boolean;
	selectionLimit?: number;
	enablePaste?: boolean;
	enableFullScreen?: boolean;
	enableMassEdit?: boolean;
};
