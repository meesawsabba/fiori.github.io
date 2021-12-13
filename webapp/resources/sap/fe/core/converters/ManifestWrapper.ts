import { ConfigurableRecord } from "sap/fe/core/converters/helpers/ConfigurableObject";
import {
	BaseManifestSettings,
	CombinedViewPathConfiguration,
	ContentDensitiesType,
	FilterManifestConfiguration,
	FormManifestConfiguration,
	ListReportManifestSettings,
	ManifestAction,
	ManifestHeaderFacet,
	ManifestSection,
	MultipleViewsConfiguration,
	NavigationSettingsConfiguration,
	ObjectPageManifestSettings,
	SingleViewPathConfiguration,
	ViewPathConfiguration,
	TemplateType,
	VariantManagementType,
	CustomViewTemplateConfiguration,
	ViewConfiguration,
	KPIConfiguration
} from "sap/fe/core/converters/ManifestSettings";

/**
 *
 */
class ManifestWrapper {
	/**
	 * Creates a wrapper object to ensure the data returned from the manifest is consistent and everything is merged correctly.
	 *
	 * @param {BaseManifestSettings} oManifestSettings The manifest settings for the current page
	 * @param {Function} mergeFn A function that will be used to perform the merge
	 * @returns {ManifestWrapper} The manifest wrapper object
	 */
	constructor(private oManifestSettings: BaseManifestSettings, private mergeFn: Function) {}

	/**
	 * Returns the current template type.
	 *
	 * @returns The type of the current template
	 */
	getTemplateType(): TemplateType {
		return this.oManifestSettings.converterType;
	}

	/**
	 * Checks whether the current environment is a desktop or not.
	 *
	 * @returns {boolean} `true` if we are on a desktop
	 */
	isDesktop(): boolean {
		return !!this.oManifestSettings.isDesktop;
	}

	/**
	 * Retrieves the form containers (field groups/identification) defined in the manifest.
	 *
	 * @param {string} facetTarget The target annotation path for this form
	 * @returns {FormManifestConfiguration} A set of manifest header facets indexed by an iterable key
	 */
	getFormContainer(facetTarget: string): FormManifestConfiguration {
		return this.oManifestSettings.controlConfiguration?.[facetTarget] as FormManifestConfiguration;
	}
	/**
	 * Retrieves the headerFacets defined in the manifest.
	 *
	 * @returns {ConfigurableRecord<ManifestHeaderFacet>} A set of manifest header facets indexed by an iterable key
	 */
	getHeaderFacets(): ConfigurableRecord<ManifestHeaderFacet> {
		return this.mergeFn(
			{},
			this.oManifestSettings.controlConfiguration?.["@com.sap.vocabularies.UI.v1.HeaderFacets"]?.facets,
			(this.oManifestSettings as ObjectPageManifestSettings).content?.header?.facets
		);
	}
	/**
	 * Retrieves the header actions defined in the manifest.
	 *
	 * @returns {ConfigurableRecord<ManifestAction>} A set of manifest actions indexed by an iterable key
	 */
	getHeaderActions(): ConfigurableRecord<ManifestAction> {
		return this.oManifestSettings.content?.header?.actions || {};
	}
	/**
	 * Retrieves the footer actions defined in the manifest.
	 *
	 * @returns {ConfigurableRecord<ManifestAction>} A set of manifest actions indexed by an iterable key
	 */
	getFooterActions(): ConfigurableRecord<ManifestAction> {
		return this.oManifestSettings.content?.footer?.actions || {};
	}

	/**
	 * Retrieves the variant management as defined in the manifest.
	 *
	 * @returns {VariantManagementType} A type of variant management
	 */
	getVariantManagement(): VariantManagementType {
		return this.oManifestSettings.variantManagement || VariantManagementType.None;
	}

	/**
	 * Retrieves the annotation Path for the SPV in the manifest.
	 *
	 * @returns {string|undefined} The annotation path for the default SPV or undefined.
	 */
	getDefaultTemplateAnnotationPath(): string | undefined {
		return this.oManifestSettings.defaultTemplateAnnotationPath;
	}

	/**
	 * Retrieves the control configuration as defined in the manifest for a specific annotation path.
	 *
	 * @param {string} sAnnotationPath The relative annotation path
	 * @private
	 * @returns {object} The control configuration
	 */
	getControlConfiguration(sAnnotationPath: string): any {
		return this.oManifestSettings?.controlConfiguration?.[sAnnotationPath] || {};
	}
	/**
	 * Retrieves the configured settings for a given navigation target.
	 *
	 * @param {string} navigationOrCollectionName The name of the navigation to check
	 * @returns {NavigationSettingsConfiguration} The navigation settings configuration
	 */
	getNavigationConfiguration(navigationOrCollectionName: string): NavigationSettingsConfiguration {
		return this.oManifestSettings?.navigation?.[navigationOrCollectionName] || {};
	}

	/**
	 * Retrieves the view level.
	 *
	 * @returns {number} The current view level
	 */
	getViewLevel(): number {
		return this.oManifestSettings?.viewLevel || -1;
	}

	/**
	 * Retrieves the contentDensities setting of the application.
	 *
	 * @returns {ContentDensitiesType} The current content density
	 */
	getContentDensities(): ContentDensitiesType {
		return (
			this.oManifestSettings?.contentDensities || {
				cozy: false,
				compact: false
			}
		);
	}

	/**
	 * Checks whether we are in FCL mode or not.
	 *
	 * @returns {boolean} `true` if we are in FCL
	 */
	isFclEnabled(): boolean {
		return !!this.oManifestSettings?.fclEnabled;
	}

	/**
	 * Checks whether the current settings (application / shell) allows us to use condensed layout.
	 *
	 * @returns {boolean} `true` if we can use the condensed layout, false otherwise
	 */
	isCondensedLayoutCompliant(): boolean {
		const manifestContentDensity = this.oManifestSettings?.contentDensities || {
			cozy: false,
			compact: false
		};
		const shellContentDensity = this.oManifestSettings?.shellContentDensity || "compact";
		let isCondensedLayoutCompliant = true;
		if ((manifestContentDensity?.cozy === true && manifestContentDensity?.compact !== true) || shellContentDensity === "cozy") {
			isCondensedLayoutCompliant = false;
		}
		return isCondensedLayoutCompliant;
	}

	//region OP Specific

	/**
	 * Retrieves the sections defined in the manifest.
	 *
	 * @returns {ConfigurableRecord<ManifestSection>} A set of manifest sections indexed by an iterable key
	 */
	getSections(): ConfigurableRecord<ManifestSection> {
		return this.mergeFn(
			{},
			this.oManifestSettings.controlConfiguration?.["@com.sap.vocabularies.UI.v1.Facets"]?.sections,
			(this.oManifestSettings as ObjectPageManifestSettings).content?.body?.sections
		);
	}

	/**
	 * Returns true of the header of the application is editable and should appear in the facets.
	 *
	 * @returns {boolean} `true` if the header if editable
	 */
	isHeaderEditable(): boolean {
		return this.getShowObjectPageHeader() && (this.oManifestSettings as ObjectPageManifestSettings).editableHeaderContent;
	}
	/**
	 * Returns true if we should show the object page header.
	 *
	 * @returns {boolean} `true` if the header should be displayed
	 */
	getShowAnchorBar(): boolean {
		return (this.oManifestSettings as ObjectPageManifestSettings).content?.header?.anchorBarVisible !== undefined
			? !!(this.oManifestSettings as ObjectPageManifestSettings).content?.header?.anchorBarVisible
			: true;
	}

	/**
	 * Defines whether or not the section will be displayed in different tabs.
	 *
	 * @returns {boolean} `true` if the icon tab bar should be used instead of scrolling
	 */
	useIconTabBar(): boolean {
		return this.getShowAnchorBar() && (this.oManifestSettings as ObjectPageManifestSettings).sectionLayout === "Tabs";
	}

	/**
	 * Returns true if the object page header is to be shown.
	 *
	 * @returns {boolean} `true` if the object page header is to be displayed
	 */
	getShowObjectPageHeader(): boolean {
		return (this.oManifestSettings as ObjectPageManifestSettings).content?.header?.visible !== undefined
			? !!(this.oManifestSettings as ObjectPageManifestSettings).content?.header?.visible
			: true;
	}

	//endregion OP Specific

	//region LR Specific

	/**
	 * Retrieves the multiple view configuration from the manifest.
	 *
	 * @returns {MultipleViewsConfiguration} The views that represent the manifest object
	 */
	getViewConfiguration(): MultipleViewsConfiguration | undefined {
		return (this.oManifestSettings as ListReportManifestSettings).views;
	}

	/**
	 * Retrieves the KPI configuration from the manifest.
	 *
	 * @returns {object} Returns a map between KPI names and their respective configuration
	 */
	getKPIConfiguration(): { [kpiName: string]: KPIConfiguration } {
		return (this.oManifestSettings as ListReportManifestSettings).keyPerformanceIndicators || {};
	}

	/**
	 * Retrieves the filter configuration from the manifest.
	 *
	 * @returns {FilterManifestConfiguration} The filter configuration from the manifest
	 */
	getFilterConfiguration(): FilterManifestConfiguration {
		return this.getControlConfiguration("@com.sap.vocabularies.UI.v1.SelectionFields");
	}
	/**
	 * Returns true if there are multiple entity sets to be displayed.
	 *
	 * @returns {boolean} `true` if there are multiple entity sets
	 */
	hasMultipleEntitySets(): boolean {
		const viewConfig = this.getViewConfiguration() || { paths: [] };
		const manifestEntitySet = this.oManifestSettings.entitySet;
		return (
			viewConfig.paths.find((path: ViewConfiguration) => {
				if ((path as CustomViewTemplateConfiguration)?.template) {
					return undefined;
				} else if (this.hasMultipleVisualizations(path as CombinedViewPathConfiguration)) {
					const { primary, secondary } = path as CombinedViewPathConfiguration;
					return (
						primary.some(path => path.entitySet && path.entitySet !== manifestEntitySet) ||
						secondary.some(path => path.entitySet && path.entitySet !== manifestEntitySet)
					);
				} else {
					path = path as SingleViewPathConfiguration;
					return path.entitySet && path.entitySet !== manifestEntitySet;
				}
			}) !== undefined
		);
	}

	/**
	 * Returns the context path for the template if it is specified in the manifest.
	 *
	 * @returns {string} The context path for the template
	 */
	getContextPath(): string | undefined {
		return this.oManifestSettings?.contextPath;
	}

	/**
	 * Returns true if there are multiple visualizations.
	 *
	 * @param {ViewPathConfiguration} path The path from the view
	 * @returns {boolean} `true` if there are multiple visualizations
	 */
	hasMultipleVisualizations(path?: ViewPathConfiguration): boolean {
		if (!path) {
			const viewConfig = this.getViewConfiguration() || { paths: [] };
			return viewConfig.paths.some(path => {
				return (
					(path as CombinedViewPathConfiguration).primary?.length > 0 &&
					(path as CombinedViewPathConfiguration).secondary?.length > 0
				);
			});
		}
		return (path as CombinedViewPathConfiguration).primary?.length > 0 && (path as CombinedViewPathConfiguration).secondary?.length > 0;
	}

	//end region LR Specific
}

export default ManifestWrapper;
