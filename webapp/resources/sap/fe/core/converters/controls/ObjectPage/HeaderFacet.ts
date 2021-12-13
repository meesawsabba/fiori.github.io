import { ManifestHeaderFacet } from "sap/fe/core/converters/ManifestSettings";
import {
	ConfigurableObject,
	ConfigurableRecord,
	CustomElement,
	insertCustomElements,
	Placement,
	Position
} from "sap/fe/core/converters/helpers/ConfigurableObject";
import {
	DataFieldAbstractTypes,
	DataPoint,
	FacetTypes,
	FieldGroup,
	ReferenceFacetTypes,
	UIAnnotationTypes
} from "@sap-ux/vocabularies-types";
import { CustomHeaderFacetID, HeaderFacetContainerID, HeaderFacetFormID, HeaderFacetID } from "sap/fe/core/converters/helpers/ID";
import { annotationExpression, BindingExpression, compileBinding, equal, not } from "sap/fe/core/helpers/BindingExpression";
import { KeyHelper } from "sap/fe/core/converters/helpers/Key";
import { AnnotationFormElement, FormElement, FormElementType, getFormElementsFromManifest } from "../Common/Form";
import { getSemanticObjectPath } from "sap/fe/core/converters/annotations/DataField";
import { generate } from "../../../helpers/StableIdHelper";
import ConverterContext from "../../ConverterContext";

// region definitions
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Definitions: Header Facet Types, Generic OP Header Facet, Manifest Properties for Custom Header Facet
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export enum HeaderFacetType {
	Annotation = "Annotation",
	XMLFragment = "XMLFragment"
}

export enum FacetType {
	Reference = "Reference",
	Collection = "Collection"
}

export enum FlexDesignTimeType {
	Default = "Default",
	NotAdaptable = "not-adaptable", // disable all actions on that instance
	NotAdaptableTree = "not-adaptable-tree", // disable all actions on that instance and on all children of that instance
	NotAdaptableVisibility = "not-adaptable-visibility" // disable all actions that influence the visibility, namely reveal and remove
}

export type FlexSettings = {
	designtime?: FlexDesignTimeType;
};

type HeaderFormData = {
	id: string;
	label?: string;
	formElements: FormElement[];
};

enum HeaderDataPointType {
	ProgressIndicator = "ProgressIndicator",
	RatingIndicator = "RatingIndicator",
	Content = "Content"
}

type HeaderDataPointData = {
	type: HeaderDataPointType;
};

enum TargetAnnotationType {
	None = "None",
	DataPoint = "DataPoint",
	Chart = "Chart",
	Identification = "Identification",
	Contact = "Contact",
	Address = "Address",
	FieldGroup = "FieldGroup"
}

type BaseHeaderFacet = ConfigurableObject & {
	type?: HeaderFacetType; // Manifest or Metadata
	id: string;
	containerId: string;
	annotationPath?: string;
	flexSettings: FlexSettings;
	stashed: boolean;
	visible: BindingExpression<boolean>;
	targetAnnotationValue?: string;
	targetAnnotationType?: TargetAnnotationType;
};

type BaseReferenceFacet = BaseHeaderFacet & {
	facetType: FacetType.Reference;
};

type FieldGroupFacet = BaseReferenceFacet & {
	headerFormData?: HeaderFormData;
};

type DataPointFacet = BaseReferenceFacet & {
	headerDataPointData?: HeaderDataPointData;
};

type ReferenceFacet = FieldGroupFacet | DataPointFacet;

export type CollectionFacet = BaseHeaderFacet & {
	facetType: FacetType.Collection;
	facets: ReferenceFacet[];
};

export type ObjectPageHeaderFacet = ReferenceFacet | CollectionFacet;

export type CustomObjectPageHeaderFacet = CustomElement<ObjectPageHeaderFacet> & {
	fragmentName?: string;
	title?: string;
	subTitle?: string;
	stashed?: boolean;
	binding?: string;
	templateEdit?: string;
};

// endregion definitions

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Collect All Header Facets: Custom (via Manifest) and Annotation Based (via Metamodel)
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

/**
 * Retrieve header facets from annotations.
 *
 * @param {ConverterContext} converterContext
 *
 * @returns {ObjectPageHeaderFacet} Header facets from annotations
 */
export function getHeaderFacetsFromAnnotations(converterContext: ConverterContext): ObjectPageHeaderFacet[] {
	const headerFacets: ObjectPageHeaderFacet[] = [];
	converterContext.getEntityType().annotations?.UI?.HeaderFacets?.forEach(facet => {
		const headerFacet: ObjectPageHeaderFacet | undefined = createHeaderFacet(facet, converterContext);
		if (headerFacet) {
			headerFacets.push(headerFacet);
		}
	});

	return headerFacets;
}

/**
 * Retrieve custom header facets from manifest.
 *
 * @param {ConfigurableRecord<ManifestHeaderFacet>} manifestCustomHeaderFacets
 *
 * @returns {Record<string, CustomObjectPageHeaderFacet>} HeaderFacets from manifest
 */
export function getHeaderFacetsFromManifest(
	manifestCustomHeaderFacets: ConfigurableRecord<ManifestHeaderFacet>
): Record<string, CustomObjectPageHeaderFacet> {
	const customHeaderFacets: Record<string, CustomObjectPageHeaderFacet> = {};

	Object.keys(manifestCustomHeaderFacets).forEach(manifestHeaderFacetKey => {
		const customHeaderFacet: ManifestHeaderFacet = manifestCustomHeaderFacets[manifestHeaderFacetKey];
		customHeaderFacets[manifestHeaderFacetKey] = createCustomHeaderFacet(customHeaderFacet, manifestHeaderFacetKey);
	});

	return customHeaderFacets;
}

/**
 * Retrieve stashed settings for header facets from manifest.
 *
 * @param {FacetTypes} facetDefinition
 * @param {FacetTypes} collectionFacetDefinition
 * @param {ConverterContext} converterContext
 *
 * @returns {boolean} Stashed setting for header facet or false
 */
export function getStashedSettingsForHeaderFacet(
	facetDefinition: FacetTypes,
	collectionFacetDefinition: FacetTypes,
	converterContext: ConverterContext
): boolean {
	// When a HeaderFacet is nested inside a CollectionFacet, stashing is not supported
	if (
		facetDefinition.$Type === UIAnnotationTypes.ReferenceFacet &&
		collectionFacetDefinition.$Type === UIAnnotationTypes.CollectionFacet
	) {
		return false;
	}
	const headerFacetID = generate([{ Facet: facetDefinition }]);
	const headerFacetsControlConfig = converterContext.getManifestWrapper().getHeaderFacets();
	const stashedSetting = headerFacetsControlConfig[headerFacetID]?.stashed;
	return stashedSetting === true;
}

/**
 * Retrieve flexibility designtime settings from manifest.
 *
 * @param {FacetTypes} facetDefinition
 * @param {FacetTypes} collectionFacetDefinition
 * @param {ConverterContext} converterContext
 *
 * @returns {FlexDesignTimeType} Designtime setting or default
 */
export function getDesignTimeMetadataSettingsForHeaderFacet(
	facetDefinition: FacetTypes,
	collectionFacetDefinition: FacetTypes,
	converterContext: ConverterContext
): FlexDesignTimeType {
	let designTimeMetadata: FlexDesignTimeType = FlexDesignTimeType.Default;
	const headerFacetID = generate([{ Facet: facetDefinition }]);

	// For HeaderFacets nested inside CollectionFacet RTA should be disabled, therefore set to "not-adaptable-tree"
	if (
		facetDefinition.$Type === UIAnnotationTypes.ReferenceFacet &&
		collectionFacetDefinition.$Type === UIAnnotationTypes.CollectionFacet
	) {
		designTimeMetadata = FlexDesignTimeType.NotAdaptableTree;
	} else {
		const headerFacetsControlConfig = converterContext.getManifestWrapper().getHeaderFacets();
		if (headerFacetID) {
			const designTime = headerFacetsControlConfig[headerFacetID]?.flexSettings?.designtime;
			switch (designTime) {
				case FlexDesignTimeType.NotAdaptable:
				case FlexDesignTimeType.NotAdaptableTree:
				case FlexDesignTimeType.NotAdaptableVisibility:
					designTimeMetadata = designTime;
			}
		}
	}
	return designTimeMetadata;
}

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Convert & Build Annotation Based Header Facets
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
function createReferenceHeaderFacet(
	facetDefinition: FacetTypes,
	collectionFacetDefinition: FacetTypes,
	converterContext: ConverterContext
): ReferenceFacet | undefined {
	if (facetDefinition.$Type === UIAnnotationTypes.ReferenceFacet && !(facetDefinition.annotations?.UI?.Hidden?.valueOf() === true)) {
		const headerFacetID = HeaderFacetID({ Facet: facetDefinition }),
			getHeaderFacetKey = (facetDefinition: FacetTypes, fallback: string): string => {
				return facetDefinition.ID?.toString() || facetDefinition.Label?.toString() || fallback;
			},
			targetAnnotationValue = facetDefinition.Target.value,
			targetAnnotationType = getTargetAnnotationType(facetDefinition);

		let headerFormData: HeaderFormData | undefined;
		let headerDataPointData: HeaderDataPointData | undefined;

		switch (targetAnnotationType) {
			case TargetAnnotationType.FieldGroup:
				headerFormData = getFieldGroupFormData(facetDefinition, converterContext);
				break;

			case TargetAnnotationType.DataPoint:
				headerDataPointData = getDataPointData(facetDefinition);
				break;
			// ToDo: Handle other cases
		}

		const { annotations } = facetDefinition;
		return {
			type: HeaderFacetType.Annotation,
			facetType: FacetType.Reference,
			id: headerFacetID,
			containerId: HeaderFacetContainerID({ Facet: facetDefinition }),
			key: getHeaderFacetKey(facetDefinition, headerFacetID),
			flexSettings: {
				designtime: getDesignTimeMetadataSettingsForHeaderFacet(facetDefinition, collectionFacetDefinition, converterContext)
			},
			stashed: getStashedSettingsForHeaderFacet(facetDefinition, collectionFacetDefinition, converterContext),
			visible: compileBinding(not(equal(annotationExpression(annotations?.UI?.Hidden?.valueOf()), true))),
			annotationPath: converterContext.getEntitySetBasedAnnotationPath(facetDefinition.fullyQualifiedName) + "/",
			targetAnnotationValue,
			targetAnnotationType,
			headerFormData,
			headerDataPointData
		};
	}

	return undefined;
}

function createCollectionHeaderFacet(
	collectionFacetDefinition: FacetTypes,
	converterContext: ConverterContext
): CollectionFacet | undefined {
	if (collectionFacetDefinition.$Type === UIAnnotationTypes.CollectionFacet) {
		const facets: ReferenceFacet[] = [],
			headerFacetID = HeaderFacetID({ Facet: collectionFacetDefinition }),
			getHeaderFacetKey = (facetDefinition: FacetTypes, fallback: string): string => {
				return facetDefinition.ID?.toString() || facetDefinition.Label?.toString() || fallback;
			};

		collectionFacetDefinition.Facets.forEach(facetDefinition => {
			const facet: ReferenceFacet | undefined = createReferenceHeaderFacet(
				facetDefinition,
				collectionFacetDefinition,
				converterContext
			);
			if (facet) {
				facets.push(facet);
			}
		});

		return {
			type: HeaderFacetType.Annotation,
			facetType: FacetType.Collection,
			id: headerFacetID,
			containerId: HeaderFacetContainerID({ Facet: collectionFacetDefinition }),
			key: getHeaderFacetKey(collectionFacetDefinition, headerFacetID),
			flexSettings: {
				designtime: getDesignTimeMetadataSettingsForHeaderFacet(
					collectionFacetDefinition,
					collectionFacetDefinition,
					converterContext
				)
			},
			stashed: getStashedSettingsForHeaderFacet(collectionFacetDefinition, collectionFacetDefinition, converterContext),
			visible: compileBinding(not(equal(annotationExpression(collectionFacetDefinition.annotations?.UI?.Hidden?.valueOf()), true))),
			annotationPath: converterContext.getEntitySetBasedAnnotationPath(collectionFacetDefinition.fullyQualifiedName) + "/",
			facets
		};
	}

	return undefined;
}

function getTargetAnnotationType(facetDefinition: FacetTypes): TargetAnnotationType {
	let annotationType = TargetAnnotationType.None;
	const annotationTypeMap: Record<string, TargetAnnotationType> = {
		"com.sap.vocabularies.UI.v1.DataPoint": TargetAnnotationType.DataPoint,
		"com.sap.vocabularies.UI.v1.Chart": TargetAnnotationType.Chart,
		"com.sap.vocabularies.UI.v1.Identification": TargetAnnotationType.Identification,
		"com.sap.vocabularies.Communication.v1.Contact": TargetAnnotationType.Contact,
		"com.sap.vocabularies.Communication.v1.Address": TargetAnnotationType.Address,
		"com.sap.vocabularies.UI.v1.FieldGroup": TargetAnnotationType.FieldGroup
	};
	// ReferenceURLFacet and CollectionFacet do not have Target property.
	if (facetDefinition.$Type !== UIAnnotationTypes.ReferenceURLFacet && facetDefinition.$Type !== UIAnnotationTypes.CollectionFacet) {
		annotationType = annotationTypeMap[facetDefinition.Target?.$target?.term] || TargetAnnotationType.None;
	}

	return annotationType;
}

function getFieldGroupFormData(facetDefinition: ReferenceFacetTypes, converterContext: ConverterContext): HeaderFormData {
	// split in this from annotation + getFieldGroupFromDefault
	if (!facetDefinition) {
		throw new Error("Cannot get FieldGroup form data without facet definition");
	}

	const formElements = insertCustomElements(
		getFormElementsFromAnnotations(facetDefinition, converterContext),
		getFormElementsFromManifest(facetDefinition, converterContext)
	);

	return {
		id: HeaderFacetFormID({ Facet: facetDefinition }),
		label: facetDefinition.Label?.toString(),
		formElements
	};
}

/**
 * Creates an array of manifest-based FormElements.
 *
 * @param {FacetType} facetDefinition The definition of the facet
 * @param {ConverterContext} converterContext The converter context for the facet
 *
 * @returns {Array} Annotation-based FormElements
 */
function getFormElementsFromAnnotations(facetDefinition: FacetTypes, converterContext: ConverterContext): AnnotationFormElement[] {
	const annotationBasedFormElements: AnnotationFormElement[] = [];

	// ReferenceURLFacet and CollectionFacet do not have Target property.
	if (facetDefinition.$Type !== UIAnnotationTypes.ReferenceURLFacet && facetDefinition.$Type !== UIAnnotationTypes.CollectionFacet) {
		(facetDefinition.Target?.$target as FieldGroup)?.Data.forEach((dataField: DataFieldAbstractTypes) => {
			if (!(dataField.annotations?.UI?.Hidden?.valueOf() === true)) {
				const semanticObjectAnnotationPath = getSemanticObjectPath(converterContext, dataField);
				if (
					dataField.$Type === UIAnnotationTypes.DataField ||
					dataField.$Type === UIAnnotationTypes.DataFieldWithUrl ||
					dataField.$Type === UIAnnotationTypes.DataFieldWithNavigationPath
				) {
					const { annotations } = dataField;
					annotationBasedFormElements.push({
						isValueMultilineText: dataField.Value?.$target?.annotations?.UI?.MultiLineText?.valueOf() === true,
						type: FormElementType.Annotation,
						key: KeyHelper.generateKeyFromDataField(dataField),
						visible: compileBinding(not(equal(annotationExpression(annotations?.UI?.Hidden?.valueOf()), true))),
						label: dataField.Value?.$target?.annotations?.Common?.Label || dataField.Label,
						idPrefix: HeaderFacetFormID({ Facet: facetDefinition }, dataField),
						annotationPath: converterContext.getEntitySetBasedAnnotationPath(dataField.fullyQualifiedName) + "/",
						semanticObjectPath: semanticObjectAnnotationPath
					});
				} else if (dataField.$Type === UIAnnotationTypes.DataFieldForAnnotation) {
					const { annotations } = dataField;
					annotationBasedFormElements.push({
						// FIXME this is wrong
						isValueMultilineText: (dataField.Target?.$target?.annotations?.UI as any)?.MultiLineText?.valueOf() === true,
						type: FormElementType.Annotation,
						key: KeyHelper.generateKeyFromDataField(dataField),
						visible: compileBinding(not(equal(annotationExpression(annotations?.UI?.Hidden?.valueOf()), true))),
						label: dataField.Target?.$target?.annotations?.Common?.Label?.toString() || dataField.Label?.toString(),
						idPrefix: HeaderFacetFormID({ Facet: facetDefinition }, dataField),
						annotationPath: converterContext.getEntitySetBasedAnnotationPath(dataField.fullyQualifiedName) + "/",
						semanticObjectPath: semanticObjectAnnotationPath
					});
				}
			}
		});
	}

	return annotationBasedFormElements;
}

function getDataPointData(facetDefinition: FacetTypes): HeaderDataPointData {
	let type = HeaderDataPointType.Content;
	if (facetDefinition.$Type === UIAnnotationTypes.ReferenceFacet) {
		if ((facetDefinition.Target?.$target as DataPoint)?.Visualization === "UI.VisualizationType/Progress") {
			type = HeaderDataPointType.ProgressIndicator;
		} else if ((facetDefinition.Target?.$target as DataPoint)?.Visualization === "UI.VisualizationType/Rating") {
			type = HeaderDataPointType.RatingIndicator;
		}
	}

	return { type };
}

/**
 * Creates an annotation-based header facet.
 *
 * @param {FacetTypes} facetDefinition The definition of the facet
 * @param {ConverterContext} converterContext The converter context
 *
 * @returns {ObjectPageHeaderFacet} The created annotation-based header facet
 */
function createHeaderFacet(facetDefinition: FacetTypes, converterContext: ConverterContext): ObjectPageHeaderFacet | undefined {
	let headerFacet: ObjectPageHeaderFacet | undefined;
	switch (facetDefinition.$Type) {
		case UIAnnotationTypes.ReferenceFacet:
			headerFacet = createReferenceHeaderFacet(facetDefinition, facetDefinition, converterContext);
			break;

		case UIAnnotationTypes.CollectionFacet:
			headerFacet = createCollectionHeaderFacet(facetDefinition, converterContext);
			break;
	}

	return headerFacet;
}

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Convert & Build Manifest Based Header Facets
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

function generateBinding(requestGroupId?: string): string | undefined {
	if (!requestGroupId) {
		return undefined;
	}
	const groupId =
		["Heroes", "Decoration", "Workers", "LongRunners"].indexOf(requestGroupId) !== -1 ? "$auto." + requestGroupId : requestGroupId;

	return "{ path : '', parameters : { $$groupId : '" + groupId + "' } }";
}

/**
 * Create a manifest based custom header facet.
 *
 * @param {ManifestHeaderFacet} customHeaderFacetDefinition
 * @param {string} headerFacetKey
 *
 * @returns {CustomObjectPageHeaderFacet} The manifest based custom header facet created
 */
function createCustomHeaderFacet(customHeaderFacetDefinition: ManifestHeaderFacet, headerFacetKey: string): CustomObjectPageHeaderFacet {
	const customHeaderFacetID = CustomHeaderFacetID(headerFacetKey);

	let position: Position | undefined = customHeaderFacetDefinition.position;
	if (!position) {
		position = {
			placement: Placement.After
		};
	}
	// TODO for an non annotation fragment the name is mandatory -> Not checked
	return {
		facetType: FacetType.Reference,
		facets: [],
		type: customHeaderFacetDefinition.type,
		id: customHeaderFacetID,
		containerId: customHeaderFacetID,
		key: headerFacetKey,
		position: position,
		visible: customHeaderFacetDefinition.visible,
		fragmentName: customHeaderFacetDefinition.template || customHeaderFacetDefinition.name,
		title: customHeaderFacetDefinition.title,
		subTitle: customHeaderFacetDefinition.subTitle,
		stashed: customHeaderFacetDefinition.stashed || false,
		flexSettings: { ...{ designtime: FlexDesignTimeType.Default }, ...customHeaderFacetDefinition.flexSettings },
		binding: generateBinding(customHeaderFacetDefinition.requestGroupId),
		templateEdit: customHeaderFacetDefinition.templateEdit
	};
}
