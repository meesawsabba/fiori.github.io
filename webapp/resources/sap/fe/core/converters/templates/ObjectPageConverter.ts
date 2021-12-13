import { FacetTypes } from "@sap-ux/vocabularies-types";
import { ManifestSection, ManifestSubSection, TemplateType } from "../ManifestSettings";
import { PageDefinition } from "../TemplateConverter";
import { EntityType } from "@sap-ux/annotation-converter";
import {
	createCustomSubSections,
	createSubSections,
	createCustomHeaderFacetSubSections,
	CustomObjectPageSection,
	ObjectPageSection,
	ObjectPageSubSection,
	FormSubSection
} from "../controls/ObjectPage/SubSection";
import { getHeaderFacetsFromAnnotations, getHeaderFacetsFromManifest, ObjectPageHeaderFacet } from "../controls/ObjectPage/HeaderFacet";
import { CustomSectionID, EditableHeaderSectionID, SectionID } from "../helpers/ID";
import { ConfigurableRecord, insertCustomElements, Placement, Position } from "../helpers/ConfigurableObject";
import { BaseAction, getActionsFromManifest, removeDuplicateActions } from "sap/fe/core/converters/controls/Common/Action";
import {
	getHeaderDefaultActions,
	getFooterDefaultActions,
	getHiddenHeaderActions
} from "sap/fe/core/converters/objectPage/HeaderAndFooterAction";
import { Avatar, getAvatar } from "../controls/ObjectPage/Avatar";
import {
	annotationExpression,
	bindingExpression,
	compileBinding,
	equal,
	not,
	ifElse,
	constant,
	BindingExpression,
	Expression
} from "sap/fe/core/helpers/BindingExpression";
import ConverterContext from "../ConverterContext";

export type ObjectPageDefinition = PageDefinition & {
	header: {
		visible: boolean;
		section?: ObjectPageSection;
		facets: ObjectPageHeaderFacet[];
		actions: BaseAction[];
		showContent: BindingExpression<boolean>;
		hasContent: boolean;
		avatar?: Avatar;
		title: {
			expandedImageVisible: BindingExpression<string>;
		};
	};
	sections: ObjectPageSection[];
	footerActions: BaseAction[];
	showAnchorBar: boolean;
	useIconTabBar: boolean;
};

const getSectionKey = (facetDefinition: FacetTypes, fallback: string): string => {
	return facetDefinition.ID?.toString() || facetDefinition.Label?.toString() || fallback;
};

/**
 * Creates a section that represents the editable header part; it is only visible in edit mode.
 *
 * @param converterContext The converter context
 * @param allHeaderFacets The converter context
 * @returns {ObjectPageSection} The section representing the editable header parts
 */
export function createEditableHeaderSection(
	converterContext: ConverterContext,
	allHeaderFacets: ObjectPageHeaderFacet[]
): ObjectPageSection {
	const editableHeaderSectionID = EditableHeaderSectionID();
	const headerFacets = converterContext.getEntityType().annotations?.UI?.HeaderFacets;
	const headerfacetSubSections = headerFacets ? createSubSections(headerFacets, converterContext, true) : [];
	const customHeaderFacetSubSections = createCustomHeaderFacetSubSections(converterContext);
	let allHeaderFacetsSubSections: ObjectPageSubSection[] = [];
	if (customHeaderFacetSubSections.length > 0) {
		// merge annotation based header facets and custom header facets in the right order
		let i = 0;
		allHeaderFacets.forEach(function(item) {
			// hidden header facets are not included in allHeaderFacets array => add them anyway
			while (headerfacetSubSections.length > i && headerfacetSubSections[i].visible === "false") {
				allHeaderFacetsSubSections.push(headerfacetSubSections[i]);
				i++;
			}
			if (
				headerfacetSubSections.length > i &&
				(item.key === headerfacetSubSections[i].key ||
					// for header facets with no id the keys of header facet and subsection are different => check only the last part
					item.key.slice(item.key.lastIndexOf("::") + 2) ===
						headerfacetSubSections[i].key.slice(headerfacetSubSections[i].key.lastIndexOf("::") + 2))
			) {
				allHeaderFacetsSubSections.push(headerfacetSubSections[i]);
				i++;
			} else {
				customHeaderFacetSubSections.forEach(function(customItem) {
					if (item.key === customItem.key) {
						allHeaderFacetsSubSections.push(customItem);
					}
				});
			}
		});
	} else {
		allHeaderFacetsSubSections = headerfacetSubSections;
	}
	const headerSection: ObjectPageSection = {
		id: editableHeaderSectionID,
		key: "EditableHeaderContent",
		title: "{sap.fe.i18n>T_COMMON_OBJECT_PAGE_HEADER_SECTION}",
		visible: "{= ${ui>/editMode} === 'Editable' }",
		subSections: allHeaderFacetsSubSections
	};
	return headerSection;
}

/**
 * Creates a definition for a section based on the Facet annotation.
 *
 * @param converterContext The converter context
 * @returns {ObjectPageSection[]} All sections
 */
function getSectionsFromAnnotation(converterContext: ConverterContext): ObjectPageSection[] {
	const entityType = converterContext.getEntityType();
	const objectPageSections: ObjectPageSection[] =
		entityType.annotations?.UI?.Facets?.map((facetDefinition: FacetTypes) =>
			getSectionFromAnnotation(facetDefinition, converterContext)
		) || [];
	return objectPageSections;
}

/**
 * Create an annotation based section.
 *
 * @param facet
 * @param converterContext
 * @returns {ObjectPageSection} The current section
 */
function getSectionFromAnnotation(facet: FacetTypes, converterContext: ConverterContext): ObjectPageSection {
	const sectionID = SectionID({ Facet: facet });
	const section: ObjectPageSection = {
		id: sectionID,
		key: getSectionKey(facet, sectionID),
		title: compileBinding(annotationExpression(facet.Label)),
		showTitle: !!facet.Label,
		visible: compileBinding(not(equal(annotationExpression(facet.annotations?.UI?.Hidden?.valueOf()), true))),
		subSections: createSubSections([facet], converterContext)
	};
	return section;
}

/**
 * Creates section definition based on manifest definition.
 * @param manifestSections The manifest defined sections
 * @param converterContext
 * @returns {Record<string, CustomObjectPageSection>} The manifest defined sections
 */
function getSectionsFromManifest(
	manifestSections: ConfigurableRecord<ManifestSection>,
	converterContext: ConverterContext
): Record<string, CustomObjectPageSection> {
	const sections: Record<string, CustomObjectPageSection> = {};
	Object.keys(manifestSections).forEach(manifestSectionKey => {
		sections[manifestSectionKey] = getSectionFromManifest(manifestSections[manifestSectionKey], manifestSectionKey, converterContext);
	});
	return sections;
}

/**
 * Create a manifest based custom section.
 * @param customSectionDefinition
 * @param sectionKey
 * @param converterContext
 * @returns {CustomObjectPageSection} The current custom section
 */
function getSectionFromManifest(
	customSectionDefinition: ManifestSection,
	sectionKey: string,
	converterContext: ConverterContext
): CustomObjectPageSection {
	const customSectionID = customSectionDefinition.id || CustomSectionID(sectionKey);
	let position: Position | undefined = customSectionDefinition.position;
	if (!position) {
		position = {
			placement: Placement.After
		};
	}
	let manifestSubSections: Record<string, ManifestSubSection>;
	if (!customSectionDefinition.subSections) {
		// If there is no subSection defined, we add the content of the custom section as subsections
		// and make sure to set the visibility to 'true', as the actual visibility is handled by the section itself
		manifestSubSections = {
			[sectionKey]: {
				...customSectionDefinition,
				position: undefined,
				visible: true
			}
		};
	} else {
		manifestSubSections = customSectionDefinition.subSections;
	}
	const subSections = createCustomSubSections(manifestSubSections, converterContext);

	const customSection: CustomObjectPageSection = {
		id: customSectionID,
		key: sectionKey,
		title: customSectionDefinition.title,
		showTitle: !!customSectionDefinition.title,
		visible: customSectionDefinition.visible !== undefined ? customSectionDefinition.visible : true,
		position: position,
		subSections: subSections as any
	};
	return customSection;
}

/**
 * Retrieves the ObjectPage header actions (both the default ones and the custom ones defined in the manifest).
 *
 * @param {ConverterContext} converterContext The converter context
 * @returns An array containing all the actions for this ObjectPage header
 */
export const getHeaderActions = function(converterContext: ConverterContext): BaseAction[] {
	const aAnnotationHeaderActions: BaseAction[] = getHeaderDefaultActions(converterContext);
	const manifestWrapper = converterContext.getManifestWrapper();
	const headerActions = insertCustomElements(
		aAnnotationHeaderActions,
		getActionsFromManifest(
			manifestWrapper.getHeaderActions(),
			converterContext,
			aAnnotationHeaderActions,
			undefined,
			undefined,
			getHiddenHeaderActions(converterContext)
		),
		{ isNavigable: "overwrite", enabled: "overwrite", defaultValuesExtensionFunction: "overwrite" }
	);
	return removeDuplicateActions(headerActions);
};

/**
 * Retrieves the ObjectPage footer actions (both the default ones and the custom ones defined in the manifest).
 *
 * @param {ConverterContext} converterContext The converter context
 * @returns An array containing all the actions for this ObjectPage footer
 */
export const getFooterActions = function(converterContext: ConverterContext): BaseAction[] {
	const manifestWrapper = converterContext.getManifestWrapper();
	const aAnnotationFooterActions: BaseAction[] = getFooterDefaultActions(manifestWrapper.getViewLevel(), converterContext);
	const footerActions = insertCustomElements(
		aAnnotationFooterActions,
		getActionsFromManifest(manifestWrapper.getFooterActions(), converterContext, aAnnotationFooterActions),
		{ isNavigable: "overwrite", enabled: "overwrite", defaultValuesExtensionFunction: "overwrite" }
	);
	return footerActions;
};

/**
 * Retrieves and merges the ObjectPage sections defined in the annotation and in the manifest.
 *
 * @param {ConverterContext} converterContext The converter context
 * @returns An array of sections.
 */
export const getSections = function(converterContext: ConverterContext): ObjectPageSection[] {
	const manifestWrapper = converterContext.getManifestWrapper();
	const sections = insertCustomElements(
		getSectionsFromAnnotation(converterContext),
		getSectionsFromManifest(manifestWrapper.getSections(), converterContext),
		{
			"title": "overwrite",
			"visible": "overwrite",
			"subSections": {
				"actions": "merge",
				"title": "overwrite",
				"sideContent": "overwrite"
			}
		}
	);
	// Level Adjustment for "Mixed" Collection Facets:
	// ==============================================
	// The manifest definition of custom side contents and actions still needs to be aligned for "Mixed" collection facets:
	// Collection facets containing tables gain an extra reference facet as a table wrapper to ensure, that the table is always
	// placed in an own individual Object Page Block; this additional hierarchy level is unknown to app developers, which are
	// defining the side content and actions in the manifest at collection facet level; now, since the sideContent always needs
	// to be assigned to a block, we need to move the sideContent of from a mixed collection facet to its first child reference facet.
	// ==============================================
	sections.forEach(function(section) {
		section.subSections?.forEach(function(subSection) {
			if (subSection.type === "Mixed" && subSection.sideContent != undefined && subSection.content && subSection.content.length > 0) {
				// 1. Copy sideContent / actions to the SubSection's content
				// 2. Delete sideContent / actions at the (invalid) manifest level
				if ((subSection as FormSubSection).sideContent) {
					subSection.content[0].sideContent = subSection.sideContent;
					subSection.sideContent = undefined;
				}
				if ((subSection as FormSubSection).actions.length > 0) {
					(subSection.content[0] as FormSubSection).actions = (subSection as FormSubSection).actions;
					(subSection as FormSubSection).actions = [];
				}
			}
		});
	});
	return sections;
};

/**
 * Determines if the ObjectPage has header content.
 *
 * @param converterContext The instance of the converter context
 * @returns {boolean} `true` if there is at least on header facet
 */
function hasHeaderContent(converterContext: ConverterContext): boolean {
	const manifestWrapper = converterContext.getManifestWrapper();
	return (
		(converterContext.getEntityType().annotations?.UI?.HeaderFacets || []).length > 0 ||
		Object.keys(manifestWrapper.getHeaderFacets()).length > 0
	);
}

/**
 * Gets the expression to evaluate the visibility of the header content.
 *
 * @param converterContext The instance of the converter context
 * @returns {BindingExpression<boolean>} The binding expression for the Delete button
 */
function getShowHeaderContentExpression(converterContext: ConverterContext): Expression<any> {
	const manifestWrapper = converterContext.getManifestWrapper();
	return ifElse(
		!hasHeaderContent(converterContext),
		constant(false),
		ifElse(
			equal(manifestWrapper.isHeaderEditable(), false),
			constant(true),
			not(equal(bindingExpression("/editMode", "ui"), "Editable"))
		)
	);
}

/**
 * Gets the binding expression to evaluate the visibility of the header content.
 *
 * @param converterContext The instance of the converter context
 * @returns {BindingExpression<boolean>} The binding expression for the Delete button
 */
export const getShowHeaderContent = function(converterContext: ConverterContext): BindingExpression<boolean> {
	return compileBinding(getShowHeaderContentExpression(converterContext));
};

/**
 * Gets the binding expression to evaluate the visibility of the avatar when the header is in expanded state.
 *
 * @param converterContext The instance of the converter context
 * @returns {BindingExpression<string>} The binding expression for the Delete button
 */
export const getExpandedImageVisible = function(converterContext: ConverterContext): BindingExpression<string> {
	return compileBinding(not(getShowHeaderContentExpression(converterContext)));
};

export const convertPage = function(converterContext: ConverterContext): ObjectPageDefinition {
	const manifestWrapper = converterContext.getManifestWrapper();
	let headerSection: ObjectPageSection | undefined;
	const entityType: EntityType = converterContext.getEntityType();
	// Retrieve all header facets (from annotations & custom)
	const headerFacets = insertCustomElements(
		getHeaderFacetsFromAnnotations(converterContext),
		getHeaderFacetsFromManifest(manifestWrapper.getHeaderFacets())
	);

	// Retrieve the page header actions
	const headerActions = getHeaderActions(converterContext);

	// Retrieve the page footer actions
	const footerActions = getFooterActions(converterContext);

	if (manifestWrapper.isHeaderEditable() && (entityType.annotations.UI?.HeaderFacets || entityType.annotations.UI?.HeaderInfo)) {
		headerSection = createEditableHeaderSection(converterContext, headerFacets);
	}

	const sections = getSections(converterContext);

	return {
		template: TemplateType.ObjectPage,
		header: {
			visible: manifestWrapper.getShowObjectPageHeader(),
			section: headerSection,
			facets: headerFacets,
			actions: headerActions,
			showContent: getShowHeaderContent(converterContext),
			hasContent: hasHeaderContent(converterContext),
			avatar: getAvatar(converterContext),
			title: {
				expandedImageVisible: getExpandedImageVisible(converterContext)
			}
		},
		sections: sections,
		footerActions: footerActions,
		showAnchorBar: manifestWrapper.getShowAnchorBar(),
		useIconTabBar: manifestWrapper.useIconTabBar()
	};
};
