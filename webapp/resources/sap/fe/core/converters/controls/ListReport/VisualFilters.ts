import { EntityType } from "@sap-ux/annotation-converter";
import ConverterContext from "sap/fe/core/converters/ConverterContext";
import { FilterFieldManifestConfiguration } from "sap/fe/core/converters/ManifestSettings";
import { isPropertyFilterable, getIsRequired } from "sap/fe/core/templating/FilterTemplating";
import { compileBinding } from "sap/fe/core/helpers/BindingExpression";
import { checkFilterExpressionRestrictions } from "sap/fe/core/templating/DataModelPathHelper";
import { AggregationHelper } from "sap/fe/core/converters/helpers/Aggregation";
import { IssueType, IssueSeverity, IssueCategory } from "sap/fe/core/converters/helpers/IssueManager";
import { NavigationPropertyRestrictionTypes } from "@sap-ux/vocabularies-types/dist/generated/Capabilities";
import { AnnotationTerm } from "@sap-ux/vocabularies-types";
import { CustomAggregate } from "@sap-ux/vocabularies-types/dist/generated/Aggregation";

export type VisualFilters = {
	dimensionPath?: string;
	measurePath?: string;
	label?: string;
	chartAnnotation?: string;
	presentationAnnotation?: string;
	visible?: boolean;
	outParameter?: string;
	inParameters?: object[];
	contextPath?: string;
	selectionVariantAnnotation?: string;
	multipleSelectionAllowed?: boolean;
	required?: boolean;
	showOverlayInitially?: boolean;
	renderLineChart?: boolean;
	requiredProperties?: object[];
};

/**
 * Checks that measures and dimensions of the visual filter chart can be aggregated and grouped.
 * @param converterContext The converter context
 * @param chartAnnotation The chart annotation
 * @param aggregationHelper The aggregation helper
 * @returns {boolean | undefined }
 */
const _checkVFAggregation = function(
	converterContext: ConverterContext,
	chartAnnotation: any,
	aggregationHelper: any
): boolean | undefined {
	let sMeasurePath, bGroupable, bAggregatable;
	const sMeasure: string = chartAnnotation?.$target?.Measures[0]?.value;
	const sDimension: string = chartAnnotation?.$target?.Dimensions[0]?.value;
	const customAggregates = aggregationHelper.getCustomAggregateDefinitions();
	const aTransAggregations = aggregationHelper.getTransAggregations();

	if (
		customAggregates.some(function(custAgg: AnnotationTerm<CustomAggregate>) {
			return custAgg.qualifier === sMeasure;
		})
	) {
		sMeasurePath = sMeasure;
	} else if (aTransAggregations && aTransAggregations[0]) {
		const aAggregations = aTransAggregations[0];
		aAggregations.some(function(oAggregate: any) {
			if (oAggregate.Name === sMeasure) {
				sMeasurePath = oAggregate?.AggregatableProperty.value;
			}
		});
	}
	const aAggregatablePropsFromContainer = aggregationHelper.getAggregatableProperties();
	const aGroupablePropsFromContainer = aggregationHelper.getGroupableProperties();
	if (aAggregatablePropsFromContainer && aAggregatablePropsFromContainer.length) {
		for (const aggregatableProp of aAggregatablePropsFromContainer) {
			if (aggregatableProp?.Property?.value === sMeasurePath) {
				bAggregatable = true;
			}
		}
	}
	if (aGroupablePropsFromContainer && aGroupablePropsFromContainer.length) {
		for (const groupableProp of aGroupablePropsFromContainer) {
			if (groupableProp?.value === sDimension) {
				bGroupable = true;
			}
		}
	}
	return bAggregatable && bGroupable;
};

/**
 * Method to get the visual filters object for a property.
 * @param entityType The converter context
 * @param converterContext The chart annotation
 * @param sPropertyPath The aggregation helper
 * @param FilterFields The aggregation helper
 * @returns {VisualFilters | undefined }
 */
export function getVisualFilters(
	entityType: EntityType,
	converterContext: ConverterContext,
	sPropertyPath: string,
	FilterFields: Record<string, FilterFieldManifestConfiguration>
): VisualFilters | undefined {
	const visualFilter: VisualFilters = {};
	const oVisualFilter: FilterFieldManifestConfiguration = FilterFields[sPropertyPath];
	if (oVisualFilter && oVisualFilter?.visualFilter && oVisualFilter?.visualFilter?.valueList) {
		const oVFPath = oVisualFilter?.visualFilter?.valueList;
		const annotationQualifierSplit = oVFPath.split("#");
		const qualifierVL = annotationQualifierSplit.length > 1 ? "ValueList#" + annotationQualifierSplit[1] : annotationQualifierSplit[0];
		const property = entityType.resolvePath(sPropertyPath);
		const valueList: any = property?.annotations?.Common[qualifierVL];
		if (valueList) {
			const collectionPath = valueList?.CollectionPath;
			let collectionPathConverterContext = converterContext.getConverterContextFor(
				"/" + (collectionPath || converterContext.getEntitySet()?.name)
			);
			const valueListParams = valueList?.Parameters;
			let outParameter: any;
			const inParameters: Array<object> = [];
			let aParameters: Array<string> = [];
			if (!collectionPathConverterContext.getDataModelObjectPath().targetEntitySet) {
				const resolvedTarget = collectionPathConverterContext.getEntityTypeAnnotation("");
				collectionPathConverterContext = resolvedTarget.converterContext;
			}
			const parameterEntityType = collectionPathConverterContext.getParameterEntityType();
			aParameters = parameterEntityType
				? parameterEntityType.keys.map(function(key) {
						return key.name;
				  })
				: [];
			if (converterContext.getContextPath() === collectionPathConverterContext.getContextPath()) {
				aParameters.forEach(function(parameter: any) {
					inParameters.push({
						localDataProperty: parameter,
						valueListProperty: parameter
					});
				});
			}
			if (valueListParams) {
				for (const valueListParam of valueListParams) {
					const localDataProperty = (valueListParam as any).LocalDataProperty?.value;
					const valueListProperty = (valueListParam as any).ValueListProperty;
					if (
						(valueListParam?.$Type === "com.sap.vocabularies.Common.v1.ValueListParameterInOut" ||
							valueListParam?.$Type === "com.sap.vocabularies.Common.v1.ValueListParameterOut") &&
						sPropertyPath === localDataProperty
					) {
						outParameter = valueListParam;
					}
					if (
						(valueListParam?.$Type === "com.sap.vocabularies.Common.v1.ValueListParameterInOut" ||
							valueListParam?.$Type === "com.sap.vocabularies.Common.v1.ValueListParameterIn") &&
						sPropertyPath !== localDataProperty
					) {
						const bNotFilterable = isPropertyFilterable(collectionPathConverterContext, valueListProperty);
						if (!bNotFilterable) {
							inParameters.push({
								localDataProperty: localDataProperty,
								valueListProperty: valueListProperty
							});
						}
					}
				}
			}
			if (inParameters && inParameters.length) {
				inParameters.forEach(function(oInParameter: any) {
					const mainEntitySetInMappingAllowedExpression = compileBinding(
						checkFilterExpressionRestrictions(
							converterContext
								.getConverterContextFor(converterContext.getAbsoluteAnnotationPath(oInParameter?.localDataProperty))
								.getDataModelObjectPath(),
							["SingleValue"]
						)
					);
					const valueListEntitySetInMappingAllowedExpression = compileBinding(
						checkFilterExpressionRestrictions(
							collectionPathConverterContext
								.getConverterContextFor(
									collectionPathConverterContext.getAbsoluteAnnotationPath(oInParameter?.valueListProperty)
								)
								.getDataModelObjectPath(),
							["SingleValue"]
						)
					);
					if (valueListEntitySetInMappingAllowedExpression === "true" && mainEntitySetInMappingAllowedExpression === "false") {
						throw new Error(
							"FilterRestrictions of " + sPropertyPath + " in MainEntitySet and ValueListEntitySet are different"
						);
					}
				});
			}
			const pvQualifier = valueList?.PresentationVariantQualifier;
			const svQualifier = valueList?.SelectionVariantQualifier;
			const pvAnnotation: any = collectionPathConverterContext?.getEntityTypeAnnotation("@UI.PresentationVariant#" + pvQualifier)
				?.annotation;
			const aggregationHelper = new AggregationHelper(collectionPathConverterContext.getEntityType(), collectionPathConverterContext);
			if (!aggregationHelper.isAnalyticsSupported()) {
				return;
			}
			if (pvAnnotation) {
				const aVisualizations = pvAnnotation?.Visualizations;
				const contextPath = "/" + valueList?.CollectionPath || "/" + collectionPathConverterContext?.getEntitySet()?.name;
				visualFilter.contextPath = contextPath;
				let chartAnnotation;
				for (const visualization of aVisualizations) {
					if (visualization.$target?.term === "com.sap.vocabularies.UI.v1.Chart") {
						chartAnnotation = visualization;
						break;
					}
				}
				if (chartAnnotation) {
					const _bgetVFAggregation: boolean | undefined = _checkVFAggregation(
						collectionPathConverterContext,
						chartAnnotation,
						aggregationHelper
					);
					if (!_bgetVFAggregation) {
						return;
					}
					const bDimensionHidden: boolean = chartAnnotation?.$target?.Dimensions[0]?.$target?.annotations?.UI?.Hidden?.valueOf();
					const bDimensionHiddenFilter: boolean = chartAnnotation?.$target?.Dimensions[0]?.$target?.annotations?.UI?.HiddenFilter?.valueOf();
					if (bDimensionHidden === true || bDimensionHiddenFilter === true) {
						return;
					} else if (aVisualizations && aVisualizations.length) {
						visualFilter.chartAnnotation = chartAnnotation
							? collectionPathConverterContext?.getAbsoluteAnnotationPath(
									chartAnnotation.fullyQualifiedName + "/$AnnotationPath/"
							  )
							: undefined;
						visualFilter.presentationAnnotation = pvAnnotation
							? collectionPathConverterContext?.getAbsoluteAnnotationPath(pvAnnotation.fullyQualifiedName + "/")
							: undefined;
						visualFilter.outParameter = outParameter?.LocalDataProperty?.value;
						visualFilter.inParameters = inParameters;
						const bIsRange = checkFilterExpressionRestrictions(
							converterContext
								.getConverterContextFor(converterContext.getAbsoluteAnnotationPath(sPropertyPath))
								.getDataModelObjectPath(),
							["SingleRange", "MultiRange"]
						);

						if (compileBinding(bIsRange) === "true") {
							throw new Error("Range AllowedExpression is not supported for visual filters");
						}

						const bIsMainEntitySetSingleSelection: any = checkFilterExpressionRestrictions(
							converterContext
								.getConverterContextFor(converterContext.getAbsoluteAnnotationPath(sPropertyPath))
								.getDataModelObjectPath(),
							["SingleValue"]
						);
						visualFilter.multipleSelectionAllowed = compileBinding(!bIsMainEntitySetSingleSelection.value) as any;
						visualFilter.required = getIsRequired(converterContext, sPropertyPath);
						let svAnnotation: any;
						if (svQualifier) {
							svAnnotation = collectionPathConverterContext?.getEntityTypeAnnotation("@UI.SelectionVariant#" + svQualifier)
								?.annotation;
							visualFilter.selectionVariantAnnotation = svAnnotation
								? collectionPathConverterContext?.getAbsoluteAnnotationPath(svAnnotation.fullyQualifiedName + "/")
								: undefined;
						}
						let requiredProperties = [];
						if (parameterEntityType) {
							const sEntitySet = collectionPath.split("/")[0];
							const sNavigationProperty = collectionPath.split("/")[1];
							const oEntitySetConverterContext = converterContext.getConverterContextFor("/" + sEntitySet);
							const aRestrictedProperties = oEntitySetConverterContext?.getDataModelObjectPath().startingEntitySet
								?.annotations?.Capabilities?.NavigationRestrictions?.RestrictedProperties;
							const oRestrictedProperty = aRestrictedProperties?.find(
								(restrictedNavProp: NavigationPropertyRestrictionTypes) => {
									if (restrictedNavProp.NavigationProperty?.type === "NavigationPropertyPath") {
										return restrictedNavProp.NavigationProperty.value === sNavigationProperty;
									}
								}
							);
							requiredProperties = oRestrictedProperty?.FilterRestrictions?.RequiredProperties as any[];
						} else {
							const entitySetAnnotations = collectionPathConverterContext.getEntitySet()?.annotations;
							requiredProperties = entitySetAnnotations?.Capabilities?.FilterRestrictions?.RequiredProperties as any[];
						}
						let requiredPropertyPaths: Array<object> = [];
						if (requiredProperties?.length) {
							requiredProperties.forEach(function(oRequireProperty: any) {
								requiredPropertyPaths.push(oRequireProperty.value);
							});
						}
						requiredPropertyPaths = requiredPropertyPaths.concat(aParameters);
						visualFilter.requiredProperties = requiredPropertyPaths;
						if (visualFilter.requiredProperties?.length) {
							if (!visualFilter.inParameters || !visualFilter.inParameters.length) {
								if (!visualFilter.selectionVariantAnnotation) {
									visualFilter.showOverlayInitially = true;
								} else {
									let selectOptions =
										svAnnotation?.SelectOptions?.map((oSelectOption: any) => oSelectOption.PropertyName.value) || [];
									const parameterOptions =
										svAnnotation?.Parameters?.map((oParameterOption: any) => oParameterOption.PropertyName.value) || [];
									selectOptions = selectOptions.concat(parameterOptions);
									requiredPropertyPaths = requiredPropertyPaths.sort();
									selectOptions = selectOptions.sort();
									visualFilter.showOverlayInitially = requiredPropertyPaths.some(function(sPath) {
										return selectOptions.indexOf(sPath) === -1;
									});
								}
							} else {
								visualFilter.showOverlayInitially = false;
							}
						} else {
							visualFilter.showOverlayInitially = false;
						}
						const sDimensionType = chartAnnotation?.$target?.Dimensions[0]?.$target?.type;
						if (
							!(
								sDimensionType === "Edm.DateTimeOffset" ||
								sDimensionType === "Edm.Date" ||
								sDimensionType === "Edm.TimeOfDay"
							) &&
							chartAnnotation.$target.ChartType === "UI.ChartType/Line"
						) {
							visualFilter.renderLineChart = false;
						} else {
							visualFilter.renderLineChart = true;
						}
					}
				} else {
					converterContext
						.getDiagnostics()
						.addIssue(IssueCategory.Annotation, IssueSeverity.High, IssueType.MALFORMED_VISUALFILTERS.CHART);
				}
			} else {
				converterContext
					.getDiagnostics()
					.addIssue(IssueCategory.Annotation, IssueSeverity.High, IssueType.MALFORMED_VISUALFILTERS.PRESENTATIONVARIANT);
			}
		} else {
			converterContext
				.getDiagnostics()
				.addIssue(IssueCategory.Annotation, IssueSeverity.High, IssueType.MALFORMED_VISUALFILTERS.VALUELIST);
		}
	} else {
		converterContext.getDiagnostics().addIssue(IssueCategory.Manifest, IssueSeverity.High, IssueType.MALFORMED_VISUALFILTERS.VALUELIST);
	}
	if (Object.keys(visualFilter).length > 1) {
		return visualFilter;
	}
}
