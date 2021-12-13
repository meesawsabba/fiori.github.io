import { EntityType, Property, EntitySet, NavigationProperty } from "@sap-ux/annotation-converter";
import { AnnotationTerm } from "@sap-ux/vocabularies-types";
import { AggregationAnnotationTerms, CustomAggregate } from "@sap-ux/vocabularies-types/dist/generated/Aggregation";
import { PropertyPath } from "@sap-ux/vocabularies-types/dist/Edm";
import ConverterContext from "../ConverterContext";
import {
	CollectionAnnotations_Aggregation,
	EntityTypeAnnotations_Aggregation,
	EntitySetAnnotations_Aggregation
} from "@sap-ux/vocabularies-types/types/generated/Aggregation_Edm";

/**
 * helper class for Aggregation annotations.
 */
export class AggregationHelper {
	_entityType: EntityType;
	_converterContext: ConverterContext;
	_bApplySupported: boolean;
	_aGroupableProperties?: PropertyPath[];
	_aAggregatableProperties?;
	_oAggregationAnnotationTarget: EntityType | EntitySet | NavigationProperty;
	oTargetAggregationAnnotations: any;
	/**
	 * Creates a helper for a specific entity type and a converter context.
	 *
	 * @param entityType The EntityType
	 * @param converterContext The ConverterContext
	 */
	constructor(entityType: EntityType, converterContext: ConverterContext) {
		this._entityType = entityType;
		this._converterContext = converterContext;

		this._oAggregationAnnotationTarget = this._determineAggregationAnnotationTarget();
		if (this._oAggregationAnnotationTarget?._type === "NavigationProperty") {
			this.oTargetAggregationAnnotations = this._oAggregationAnnotationTarget?.annotations
				?.Aggregation as CollectionAnnotations_Aggregation;
		} else if (this._oAggregationAnnotationTarget?._type === "EntityType") {
			this.oTargetAggregationAnnotations = this._oAggregationAnnotationTarget?.annotations
				?.Aggregation as EntityTypeAnnotations_Aggregation;
		} else if (this._oAggregationAnnotationTarget?._type === "EntitySet") {
			this.oTargetAggregationAnnotations = this._oAggregationAnnotationTarget?.annotations
				?.Aggregation as EntitySetAnnotations_Aggregation;
		}
		this._bApplySupported = this.oTargetAggregationAnnotations?.ApplySupported ? true : false;

		if (this._bApplySupported) {
			this._aGroupableProperties = this.oTargetAggregationAnnotations?.ApplySupported?.GroupableProperties as PropertyPath[];
			this._aAggregatableProperties = this.oTargetAggregationAnnotations?.ApplySupported?.AggregatableProperties;
		}
	}
	/**
	 * Determine the most appropriate target for the aggregation annotations.
	 *
	 * @returns  EntityType | EntitySet | NavigationProperty where aggregation annotations should be found.
	 */
	private _determineAggregationAnnotationTarget(): EntityType | EntitySet | NavigationProperty {
		const bIsParameterized = this._converterContext.getDataModelObjectPath()?.targetEntitySet?.entityType?.annotations?.Common
			?.ResultContext
			? true
			: false;
		let oAggregationAnnotationSource;

		// find ApplySupported
		if (bIsParameterized) {
			// if this is a parameterized view then applysupported can be found at either the navProp pointing to the result set or entityType.
			// If applySupported is present at both the navProp and the entityType then navProp is more specific so take annotations from there
			// targetObject in the converter context for a parameterized view is the navigation property pointing to th result set
			const oDataModelObjectPath = this._converterContext.getDataModelObjectPath();
			const oNavigationPropertyObject = oDataModelObjectPath?.targetObject;
			const oEntityTypeObject = oDataModelObjectPath?.targetEntityType;
			if (oNavigationPropertyObject?.annotations?.Aggregation?.ApplySupported) {
				oAggregationAnnotationSource = oNavigationPropertyObject;
			} else if (oEntityTypeObject?.annotations?.Aggregation?.ApplySupported) {
				oAggregationAnnotationSource = oEntityTypeObject;
			}
		} else {
			// For the time being, we ignore annotations at the container level, until the vocabulary is stabilized
			oAggregationAnnotationSource = this._converterContext.getEntitySet();
		}
		return oAggregationAnnotationSource;
	}

	/**
	 * Checks if the entity supports analytical queries.
	 *
	 * @returns `true` if analytical queries are supported, false otherwise.
	 */
	public isAnalyticsSupported(): boolean {
		return this._bApplySupported;
	}

	/**
	 * Checks if a property is groupable.
	 *
	 * @param property The property to check
	 * @returns `undefined` if the entity doesn't support analytical queries, true or false otherwise
	 */
	public isPropertyGroupable(property: Property): boolean | undefined {
		if (!this._bApplySupported) {
			return undefined;
		} else if (!this._aGroupableProperties || this._aGroupableProperties.length === 0) {
			// No groupableProperties --> all properties are groupable
			return true;
		} else {
			return this._aGroupableProperties.findIndex(path => path.$target.fullyQualifiedName === property.fullyQualifiedName) >= 0;
		}
	}

	/**
	 * Checks if a property is aggregatable.
	 *
	 * @param property The property to check
	 * @returns `undefined` if the entity doesn't support analytical queries, true or false otherwise
	 */
	public isPropertyAggregatable(property: Property): boolean | undefined {
		if (!this._bApplySupported) {
			return undefined;
		} else {
			// Get the custom aggregates
			const aCustomAggregateAnnotations: AnnotationTerm<
				CustomAggregate
			>[] = this._converterContext.getAnnotationsByTerm("Aggregation", AggregationAnnotationTerms.CustomAggregate, [
				this._oAggregationAnnotationTarget
			]);

			// Check if a custom aggregate has a qualifier that corresponds to the property name
			return aCustomAggregateAnnotations.some(annotation => {
				return property.name === annotation.qualifier;
			});
		}
	}

	public getGroupableProperties() {
		return this._aGroupableProperties;
	}

	public getAggregatableProperties() {
		return this._aAggregatableProperties;
	}

	public getTransAggregations() {
		const aTransAggregationAnnotations = this._converterContext.getAnnotationsByTerm(
			"Analytics",
			"com.sap.vocabularies.Analytics.v1.AggregatedProperties",
			[this._converterContext.getEntityContainer(), this._converterContext.getEntityType()]
		);
		return aTransAggregationAnnotations;
	}
	/**
	 * Returns the list of custom aggregate definitions for the entity type.
	 *
	 * @returns A map (propertyName --> array of context-defining property names) for each custom aggregate corresponding to a property. The array of
	 * context-defining property names is empty if the custom aggregate doesn't have any context-defining property.
	 */
	public getCustomAggregateDefinitions() {
		// Get the custom aggregates
		const aCustomAggregateAnnotations: AnnotationTerm<CustomAggregate>[] = this._converterContext.getAnnotationsByTerm(
			"Aggregation",
			AggregationAnnotationTerms.CustomAggregate,
			[this._oAggregationAnnotationTarget]
		);

		return aCustomAggregateAnnotations;
	}
}
