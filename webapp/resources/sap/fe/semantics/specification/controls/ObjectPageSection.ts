import { ObjectPageSectionTableV4 } from "../controls/ObjectPageTable";
import { SAPUI5_FRAGMENT_CLASS } from "../common/webapp/manifest/sapUi5";

/**
 * Subsections
 * @isViewNode true
 */
export interface ObjectPageSubSections {
	subsections: GenericSections;
}

export type FieldType = object;

export interface ObjectPageSectionForm {
	[key: string]: FieldType;
}

export interface GenericSections {
	[key: string]: ObjectPageSectionTableV4 | ObjectPageSectionForm;
}

export const enum SectionPosition {
	After = "After",
	Before = "Before"
}

export const enum CustomSectionViewTypesV4 {
	XML = "XML"
}

/**
 * Custom Sections
 * @isViewNode true
 */
export interface CustomSections {
	/**
	 * Custom Sections
	 * @isViewNode true
	 */
	custom?: ObjectPageCustomSectionFragment[];
}

export interface ObjectPageCustomSectionBase {
	relatedFacet: string;
	relativePosition: SectionPosition;
	id: string;
	type: CustomSectionViewTypesV4;
	/**
	 * The label of the custom section, preferrable as an i18n key
	 * @i18nClassification TIT: Custom section title
	 */
	title: string;
}

/**
 * Fragment
 * @isViewNode true
 */
export interface ObjectPageCustomSectionFragment extends ObjectPageCustomSectionBase {
	className: typeof SAPUI5_FRAGMENT_CLASS;
	fragmentName: string;
}
