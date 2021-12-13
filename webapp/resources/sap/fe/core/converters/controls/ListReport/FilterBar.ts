import {
	AvailabilityType,
	FilterFieldManifestConfiguration,
	FilterManifestConfiguration,
	FilterSettings,
	TemplateType
} from "../../ManifestSettings";
import { EntityType, NavigationProperty, Property } from "@sap-ux/annotation-converter";
import ConverterContext from "sap/fe/core/converters/ConverterContext";
import { AnnotationTerm, DataFieldAbstractTypes, DataFieldTypes, ReferenceFacetTypes, UIAnnotationTerms } from "@sap-ux/vocabularies-types";
import {
	getSelectionVariantConfiguration,
	SelectionVariantConfiguration,
	TableVisualization,
	isFilteringCaseSensitive
} from "sap/fe/core/converters/controls/Common/Table";
import { ConfigurableObject, CustomElement, insertCustomElements, Placement } from "sap/fe/core/converters/helpers/ConfigurableObject";
import { getVisualFilters, VisualFilters } from "sap/fe/core/converters/controls/ListReport/VisualFilters";
import { SelectOptionType, FieldGroupType, FieldGroup } from "@sap-ux/vocabularies-types/dist/generated/UI";
import { annotationExpression, compileBinding } from "sap/fe/core/helpers/BindingExpression";
import { getSelectionVariant } from "../Common/DataVisualization";
import { KeyHelper } from "sap/fe/core/converters/helpers/Key";
import { IssueType, IssueSeverity, IssueCategory } from "sap/fe/core/converters/helpers/IssueManager";
import { PropertyPath } from "@sap-ux/vocabularies-types/dist/Edm";

export type FilterField = ConfigurableObject & {
	conditionPath: string;
	availability: AvailabilityType;
	annotationPath: string;
	label?: string;
	template?: string;
	group?: string;
	groupLabel?: string;
	settings?: FilterSettings;
	isParameter?: boolean;
	visualFilter?: VisualFilters;
	caseSensitive?: boolean;
};

type FilterGroup = {
	group?: string;
	groupLabel?: string;
};

export type CustomElementFilterField = CustomElement<FilterField>;

/**
 * Enter all DataFields of a given FieldGroup into the filterFacetMap.
 *
 * @param {AnnotationTerm<FieldGroupType>} fieldGroup
 * @returns {Record<string, FilterGroup>} The map of facets for the given fieldGroup
 */
function getFieldGroupFilterGroups(fieldGroup: AnnotationTerm<FieldGroupType>): Record<string, FilterGroup> {
	const filterFacetMap: Record<string, FilterGroup> = {};
	fieldGroup.Data.forEach((dataField: DataFieldAbstractTypes) => {
		if (dataField.$Type === "com.sap.vocabularies.UI.v1.DataField") {
			filterFacetMap[dataField.Value.path] = {
				group: fieldGroup.fullyQualifiedName,
				groupLabel:
					compileBinding(
						annotationExpression(fieldGroup.Label || fieldGroup.annotations?.Common?.Label || fieldGroup.qualifier)
					) || fieldGroup.qualifier
			};
		}
	});
	return filterFacetMap;
}

function getExcludedFilterProperties(selectionVariants: SelectionVariantConfiguration[]): Record<string, boolean> {
	return selectionVariants.reduce((previousValue: Record<string, boolean>, selectionVariant) => {
		selectionVariant.propertyNames.forEach(propertyName => {
			previousValue[propertyName] = true;
		});
		return previousValue;
	}, {});
}

/**
 * Check that all the tables for a dedicated entityset are configured as analytical table.
 * @param {TableVisualization[]} listReportTables List Report tables
 * @param {string} contextPath
 * @returns {boolean} Is FilterBar search field hidden or not
 */
function checkAllTableForEntitySetAreAnalytical(listReportTables: TableVisualization[], contextPath: string | undefined) {
	if (contextPath && listReportTables.length > 0) {
		return listReportTables.every(visualization => {
			return visualization.enableAnalytics && contextPath === visualization.annotation.collection;
		});
	}
	return false;
}

function getSelectionVariants(
	lrTableVisualizations: TableVisualization[],
	converterContext: ConverterContext
): SelectionVariantConfiguration[] {
	const selectionVariantPaths: string[] = [];
	return lrTableVisualizations
		.map(visualization => {
			const tableFilters = visualization.control.filters;
			const tableSVConfigs: SelectionVariantConfiguration[] = [];
			for (const key in tableFilters) {
				if (Array.isArray(tableFilters[key].paths)) {
					const paths = tableFilters[key].paths;
					paths.forEach(path => {
						if (path && path.annotationPath && selectionVariantPaths.indexOf(path.annotationPath) === -1) {
							selectionVariantPaths.push(path.annotationPath);
							const selectionVariantConfig = getSelectionVariantConfiguration(path.annotationPath, converterContext);
							if (selectionVariantConfig) {
								tableSVConfigs.push(selectionVariantConfig);
							}
						}
					});
				}
			}
			return tableSVConfigs;
		})
		.reduce((svConfigs, selectionVariant) => svConfigs.concat(selectionVariant), []);
}

/**
 * Returns the condition path required for the condition model. It looks like follow:
 * <1:N-PropertyName>*\/<1:1-PropertyName>/<PropertyName>.
 *
 * @param entityType The root EntityTy[e
 * @param propertyPath The full path to the target property
 * @returns {string} The formatted condition path
 */
const _getConditionPath = function(entityType: EntityType, propertyPath: string): string {
	const parts = propertyPath.split("/");
	let partialPath;
	let key = "";
	while (parts.length) {
		let part = parts.shift() as string;
		partialPath = partialPath ? partialPath + "/" + part : part;
		const property: Property | NavigationProperty = entityType.resolvePath(partialPath);
		if (property._type === "NavigationProperty" && property.isCollection) {
			part += "*";
		}
		key = key ? key + "/" + part : part;
	}
	return key;
};

const _createFilterSelectionField = function(
	entityType: EntityType,
	property: Property,
	fullPropertyPath: string,
	includeHidden: boolean,
	converterContext: ConverterContext
): FilterField | undefined {
	// ignore complex property types and hidden annotated ones
	if (
		property !== undefined &&
		property.targetType === undefined &&
		(includeHidden || property.annotations?.UI?.Hidden?.valueOf() !== true)
	) {
		const targetEntityType = converterContext.getAnnotationEntityType(property);
		return {
			key: KeyHelper.getSelectionFieldKeyFromPath(fullPropertyPath),
			annotationPath: converterContext.getAbsoluteAnnotationPath(fullPropertyPath),
			conditionPath: _getConditionPath(entityType, fullPropertyPath),
			availability:
				property.annotations?.UI?.HiddenFilter?.valueOf() === true ? AvailabilityType.Hidden : AvailabilityType.Adaptation,
			label: compileBinding(annotationExpression(property.annotations.Common?.Label?.valueOf() || property.name)),
			group: targetEntityType.name,
			groupLabel: compileBinding(
				annotationExpression(targetEntityType?.annotations?.Common?.Label?.valueOf() || targetEntityType.name)
			)
		};
	}
	return undefined;
};

const _getSelectionFields = function(
	entityType: EntityType,
	navigationPath: string,
	properties: Array<Property> | undefined,
	includeHidden: boolean,
	converterContext: ConverterContext
): Record<string, FilterField> {
	const selectionFieldMap: Record<string, FilterField> = {};
	if (properties) {
		properties.forEach((property: Property) => {
			const propertyPath: string = property.name;
			const fullPath: string = (navigationPath ? navigationPath + "/" : "") + propertyPath;
			const selectionField = _createFilterSelectionField(entityType, property, fullPath, includeHidden, converterContext);
			if (selectionField) {
				selectionFieldMap[fullPath] = selectionField;
			}
		});
	}
	return selectionFieldMap;
};

const _getSelectionFieldsByPath = function(
	entityType: EntityType,
	propertyPaths: Array<string> | undefined,
	includeHidden: boolean,
	converterContext: ConverterContext
): Record<string, FilterField> {
	let selectionFields: Record<string, FilterField> = {};
	if (propertyPaths) {
		propertyPaths.forEach((propertyPath: string) => {
			let localSelectionFields: Record<string, FilterField>;

			const property: Property | NavigationProperty = entityType.resolvePath(propertyPath);
			if (property === undefined) {
				return;
			}
			if (property._type === "NavigationProperty") {
				// handle navigation properties
				localSelectionFields = _getSelectionFields(
					entityType,
					propertyPath,
					property.targetType.entityProperties,
					includeHidden,
					converterContext
				);
			} else if (property.targetType !== undefined) {
				// handle ComplexType properties
				localSelectionFields = _getSelectionFields(
					entityType,
					propertyPath,
					property.targetType.properties,
					includeHidden,
					converterContext
				);
			} else {
				const navigationPath = propertyPath.includes("/")
					? propertyPath
							.split("/")
							.splice(0, 1)
							.join("/")
					: "";
				localSelectionFields = _getSelectionFields(entityType, navigationPath, [property], includeHidden, converterContext);
			}

			selectionFields = {
				...selectionFields,
				...localSelectionFields
			};
		});
	}
	return selectionFields;
};

const _getFilterField = function(
	filterFields: Record<string, FilterField>,
	propertyPath: string,
	converterContext: ConverterContext,
	entityType: EntityType
): FilterField | undefined {
	let filterField: FilterField | undefined = filterFields[propertyPath];
	if (filterField) {
		delete filterFields[propertyPath];
	} else {
		filterField = _createFilterSelectionField(entityType, entityType.resolvePath(propertyPath), propertyPath, true, converterContext);
	}
	if (!filterField) {
		converterContext.getDiagnostics().addIssue(IssueCategory.Annotation, IssueSeverity.High, IssueType.MISSING_SELECTIONFIELD);
	}
	// defined SelectionFields are available by default
	if (filterField) {
		filterField.availability = AvailabilityType.Default;
		filterField.isParameter = !!entityType.annotations?.Common?.ResultContext;
	}
	return filterField;
};

const _getDefaultFilterFields = function(
	filterFields: Record<string, FilterField>,
	aSelectOptions: any[],
	entityType: EntityType,
	converterContext: ConverterContext,
	excludedFilterProperties: Record<string, boolean>,
	annotatedSelectionFields: PropertyPath[]
): FilterField[] {
	const selectionFields: FilterField[] = [];
	const UISelectionFields: any = {};
	const properties = entityType.entityProperties;
	// Using entityType instead of entitySet
	annotatedSelectionFields?.forEach(SelectionField => {
		UISelectionFields[SelectionField.value] = true;
	});
	if (aSelectOptions && aSelectOptions.length > 0) {
		aSelectOptions?.forEach((selectOption: SelectOptionType) => {
			const propertyName: any = selectOption.PropertyName;
			const sPropertyPath: string = propertyName.value;
			const UISelectionFields: any = {};
			annotatedSelectionFields?.forEach(SelectionField => {
				UISelectionFields[SelectionField.value] = true;
			});
			if (!(sPropertyPath in excludedFilterProperties)) {
				if (!(sPropertyPath in UISelectionFields)) {
					const FilterField: FilterField | undefined = _getFilterField(filterFields, sPropertyPath, converterContext, entityType);
					if (FilterField) {
						selectionFields.push(FilterField);
					}
				}
			}
		});
	} else if (properties) {
		properties.forEach((property: Property) => {
			const defaultFilterValue = property.annotations?.Common?.FilterDefaultValue;
			const PropertyPath = property.name;
			if (!(PropertyPath in excludedFilterProperties)) {
				if (defaultFilterValue && !(PropertyPath in UISelectionFields)) {
					const FilterField: FilterField | undefined = _getFilterField(filterFields, PropertyPath, converterContext, entityType);
					if (FilterField) {
						selectionFields.push(FilterField);
					}
				}
			}
		});
	}
	return selectionFields;
};

/**
 * Get all Parameter filterFields in case of a parameterized service.
 * @param {ConverterContext} converterContext
 * @returns {FilterField[]} An array of parameter filterfields
 */
function _getParameterFields(converterContext: ConverterContext): FilterField[] {
	const dataModelObjectPath = converterContext.getDataModelObjectPath();
	const parameterEntityType = dataModelObjectPath.startingEntitySet.entityType;
	const isParameterized = !!parameterEntityType.annotations?.Common?.ResultContext;
	const parameterConverterContext =
		isParameterized && converterContext.getConverterContextFor("/" + dataModelObjectPath.startingEntitySet.name);

	const parameterFields = (parameterConverterContext
		? parameterEntityType.entityProperties.map(function(property) {
				return _getFilterField({} as Record<string, FilterField>, property.name, parameterConverterContext, parameterEntityType);
		  })
		: []) as FilterField[];

	return parameterFields;
}

/**
 * Determines if the FilterBar search field is hidden or not.
 *
 * @param {TableVisualization[]} listReportTables The list report tables
 * @param {ConverterContext} converterContext The converter context
 * @returns {boolean} The information if the FilterBar search field is hidden or not
 */
export const getFilterBarhideBasicSearch = function(listReportTables: TableVisualization[], converterContext: ConverterContext): boolean {
	if (
		converterContext.getManifestWrapper().hasMultipleVisualizations() ||
		converterContext.getTemplateType() === TemplateType.AnalyticalListPage
	) {
		return true;
	}
	// Tries to find a non-analytical table with the main entity set (page entity set) as collection
	// if at least one table matches these conditions, basic search field must be displayed.
	const sContextPath = converterContext.getContextPath();
	return checkAllTableForEntitySetAreAnalytical(listReportTables, sContextPath);
};

/**
 * Retrieves filter fields from the manifest.
 *
 * @param entityType The current entityType
 * @param converterContext The converter context
 * @returns {Record<string, CustomElementFilterField>} The filter fields defined in the manifest
 */
export const getManifestFilterFields = function(
	entityType: EntityType,
	converterContext: ConverterContext
): Record<string, CustomElementFilterField> {
	const fbConfig: FilterManifestConfiguration = converterContext.getManifestWrapper().getFilterConfiguration();
	const definedFilterFields: Record<string, FilterFieldManifestConfiguration> = fbConfig?.filterFields || {};
	const selectionFields: Record<string, FilterField> = _getSelectionFieldsByPath(
		entityType,
		Object.keys(definedFilterFields).map(key => KeyHelper.getPathFromSelectionFieldKey(key)),
		true,
		converterContext
	);
	const filterFields: Record<string, CustomElementFilterField> = {};

	for (const sKey in definedFilterFields) {
		const filterField = definedFilterFields[sKey];
		const propertyName = KeyHelper.getPathFromSelectionFieldKey(sKey);
		const selectionField = selectionFields[propertyName];
		const visualFilter = getVisualFilters(entityType, converterContext, sKey, definedFilterFields);
		filterFields[sKey] = {
			key: sKey,
			annotationPath: selectionField?.annotationPath,
			conditionPath: selectionField?.conditionPath || propertyName,
			template: filterField.template,
			label: filterField.label,
			position: filterField.position || { placement: Placement.After },
			availability: filterField.availability || AvailabilityType.Default,
			settings: filterField.settings,
			visualFilter: visualFilter
		};
	}
	return filterFields;
};

export const getFilterField = function(propertyPath: string, converterContext: ConverterContext, entityType: EntityType) {
	return _getFilterField({}, propertyPath, converterContext, entityType);
};

/**
 * Retrieve the configuration for the selection fields that will be used within the filter bar
 * This configuration takes into account annotation and the selection variants.
 *
 * @param {ConverterContext} converterContext
 * @param {TableVisualization[]} lrTables
 * @param {string} annotationPath
 * @returns {FilterSelectionField[]} An array of selection fields
 */
export const getSelectionFields = function(
	converterContext: ConverterContext,
	lrTables: TableVisualization[] = [],
	annotationPath: string = ""
): FilterField[] {
	// Fetch all selectionVariants defined in the different visualizations and different views (multi table mode)
	const selectionVariants: SelectionVariantConfiguration[] = getSelectionVariants(lrTables, converterContext);

	// create a map of properties to be used in selection variants
	const excludedFilterProperties: Record<string, boolean> = getExcludedFilterProperties(selectionVariants);
	const entityType = converterContext.getEntityType();
	const filterFacets = entityType.annotations.UI?.FilterFacets;
	let filterFacetMap: Record<string, FilterGroup> = {};

	const aFieldGroups = converterContext.getAnnotationsByTerm("UI", UIAnnotationTerms.FieldGroup);

	if (filterFacets === undefined || filterFacets.length < 0) {
		for (const i in aFieldGroups) {
			filterFacetMap = {
				...filterFacetMap,
				...getFieldGroupFilterGroups(aFieldGroups[i] as AnnotationTerm<FieldGroupType>)
			};
		}
	} else {
		filterFacetMap = filterFacets.reduce((previousValue: Record<string, FilterGroup>, filterFacet: ReferenceFacetTypes) => {
			for (let i = 0; i < (filterFacet.Target.$target as FieldGroup).Data.length; i++) {
				previousValue[((filterFacet.Target.$target as FieldGroup).Data[i] as DataFieldTypes).Value.path] = {
					group: filterFacet?.ID?.toString(),
					groupLabel: filterFacet?.Label?.toString()
				};
			}
			return previousValue;
		}, {});
	}

	let aSelectOptions: any[] = [];
	const selectionVariant = getSelectionVariant(entityType, converterContext);
	if (selectionVariant) {
		aSelectOptions = selectionVariant.SelectOptions;
	}

	// create a map of all potential filter fields based on...
	const filterFields: Record<string, FilterField> = {
		// ...non hidden properties of the entity
		..._getSelectionFields(entityType, "", entityType.entityProperties, false, converterContext),
		// ...additional manifest defined navigation properties
		..._getSelectionFieldsByPath(
			entityType,
			converterContext.getManifestWrapper().getFilterConfiguration().navigationProperties,
			false,
			converterContext
		)
	};

	//Filters which has to be added which is part of SV/Default annotations but not present in the SelectionFields
	const annotatedSelectionFields = ((annotationPath && converterContext.getEntityTypeAnnotation(annotationPath)?.annotation) ||
		entityType.annotations?.UI?.SelectionFields ||
		[]) as PropertyPath[];
	const defaultFilters = _getDefaultFilterFields(
		filterFields,
		aSelectOptions,
		entityType,
		converterContext,
		excludedFilterProperties,
		annotatedSelectionFields
	);
	const parameterFields = _getParameterFields(converterContext);

	// finally create final list of filter fields by adding the SelectionFields first (order matters)...
	let allFilters = parameterFields
		.concat(
			annotatedSelectionFields?.reduce((selectionFields: FilterField[], selectionField) => {
				const propertyPath = selectionField.value;
				if (!(propertyPath in excludedFilterProperties)) {
					const filterField: FilterField | undefined = _getFilterField(filterFields, propertyPath, converterContext, entityType);
					if (filterField) {
						filterField.group = "";
						filterField.groupLabel = "";
						selectionFields.push(filterField);
					}
				}
				return selectionFields;
			}, []) || []
		)
		// To add the FilterField which is not part of the Selection Fields but the property is mentioned in the Selection Variant
		.concat(defaultFilters || [])
		// ...and adding remaining filter fields, that are not used in a SelectionVariant (order doesn't matter)
		.concat(
			Object.keys(filterFields)
				.filter(propertyPath => !(propertyPath in excludedFilterProperties))
				.map(propertyPath => {
					return Object.assign(filterFields[propertyPath], filterFacetMap[propertyPath]);
				})
		);
	const sContextPath = converterContext.getContextPath();

	//if all tables are analytical tables "aggregatable" properties must be excluded
	if (checkAllTableForEntitySetAreAnalytical(lrTables, sContextPath)) {
		// Currently all agregates are root entity properties (no properties coming from navigation) and all
		// tables with same entitySet gets same aggreagte configuration that's why we can use first table into
		// LR to get aggregates (without currency/unit properties since we expect to be able to filter them).
		const aggregates = lrTables[0].aggregates;
		if (aggregates) {
			const aggregatableProperties: string[] = Object.keys(aggregates).map(aggregateKey => aggregates[aggregateKey].relativePath);
			allFilters = allFilters.filter(filterField => {
				return aggregatableProperties.indexOf(filterField.key) === -1;
			});
		}
	}

	const selectionFields = insertCustomElements(allFilters, getManifestFilterFields(entityType, converterContext), {
		"availability": "overwrite",
		label: "overwrite",
		position: "overwrite",
		template: "overwrite",
		settings: "overwrite",
		visualFilter: "overwrite"
	});

	// Add caseSensitive property to all selection fields.
	const isCaseSensitive = isFilteringCaseSensitive(converterContext);
	selectionFields.forEach(filterField => {
		filterField.caseSensitive = isCaseSensitive;
	});

	return selectionFields;
};
