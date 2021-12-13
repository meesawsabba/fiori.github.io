// Formatters for the Object Page
import {
	and,
	ifElse,
	isEmpty,
	concat,
	annotationExpression,
	compileBinding,
	BindingExpression
} from "sap/fe/core/helpers/BindingExpression";
import { UI, Draft, Entity } from "sap/fe/core/converters/helpers/BindingHelper";
import { CommonUtils } from "sap/fe/core";
import { HeaderInfoType } from "@sap-ux/vocabularies-types";
import { DataModelObjectPath } from "sap/fe/core/templating/DataModelPathHelper";
import { addTextArrangementToBindingExpression, formatValueRecursively } from "sap/fe/macros/field/FieldTemplating";
import { DataFieldTypes } from "@sap-ux/vocabularies-types/dist/generated/UI";
import { isStickySessionSupported } from "sap/fe/core/templating/EntitySetHelper";
import { ResourceBundle } from "sap/base/i18n";

type ViewData = {
	resourceBundle: ResourceBundle;
	entitySet: string;
};

//```mermaid
// graph TD
// A[Object Page Title] -->|Get DataField Value| C{Evaluate Create Mode}
// C -->|In Create Mode| D{Is DataField Value empty}
// D -->|Yes| F{Is there a TypeName}
// F -->|Yes| G[Is there an custom title]
// G -->|Yes| G1[Show the custom title + 'TypeName']
// G -->|No| G2[Display the default title 'New + TypeName']
// F -->|No| H[Is there a custom title]
// H -->|Yes| I[Show the custom title]
// H -->|No| J[Show the default 'Unamned Object']
// D -->|No| E
// C -->|Not in create mode| E[Show DataField Value]
// ```
/**
 * Compute the title for the object page.
 * @param oHeaderInfo The @UI.HeaderInfo annotation content
 * @param oViewData The view data object we're currently on
 * @param fullContextPath The full context path used to reach that object page
 * @param oDraftRoot
 * @returns The binding expression for the object page title
 */
export const getExpressionForTitle = function(
	oHeaderInfo: HeaderInfoType | undefined,
	oViewData: ViewData,
	fullContextPath: DataModelObjectPath,
	oDraftRoot: Object | undefined
): BindingExpression<string> {
	const titleNoHeaderInfo = CommonUtils.getTranslatedText("T_NEW_OBJECT", oViewData.resourceBundle, undefined, oViewData.entitySet);

	const titleWithHeaderInfo = CommonUtils.getTranslatedText(
		"T_ANNOTATION_HELPER_DEFAULT_OBJECT_PAGE_HEADER_TITLE",
		oViewData.resourceBundle,
		undefined,
		oViewData.entitySet
	);

	const titleForActiveHeaderNoHeaderInfo = CommonUtils.getTranslatedText(
		"T_ANNOTATION_HELPER_DEFAULT_OBJECT_PAGE_HEADER_TITLE_NO_HEADER_INFO",
		oViewData.resourceBundle
	);

	let titleValueExpression = annotationExpression((oHeaderInfo?.Title as DataFieldTypes)?.Value);
	if ((oHeaderInfo?.Title as DataFieldTypes)?.Value?.$target?.annotations?.Common?.Text?.annotations?.UI?.TextArrangement) {
		// In case an explicit text arrangement was set we make use of it in the description as well
		titleValueExpression = addTextArrangementToBindingExpression(titleValueExpression, fullContextPath);
	}

	titleValueExpression = formatValueRecursively(titleValueExpression, fullContextPath);

	// If there is a TypeName defined, show the default title 'New + TypeName', otherwise show the custom title or the default 'New object'
	const createModeTitle = oHeaderInfo?.TypeName
		? concat(titleWithHeaderInfo, ": ", annotationExpression(oHeaderInfo.TypeName.toString()))
		: titleNoHeaderInfo;
	const activeExpression = oDraftRoot ? Entity.IsActive : true;

	return compileBinding(
		ifElse(
			// If Create Mode && Empty expression
			and(UI.IsCreateMode, titleValueExpression && isEmpty(titleValueExpression)),

			createModeTitle,
			// Otherwise show the default expression
			ifElse(
				and(activeExpression, titleValueExpression && isEmpty(titleValueExpression)),
				titleForActiveHeaderNoHeaderInfo,
				titleValueExpression
			)
		)
	);
};

/**
 * Retrieves the expression for the description of an object page.
 *
 * @param oHeaderInfo The @UI.HeaderInfo annotation content
 * @param fullContextPath The full context path used to reach that object page
 * @returns The binding expression for the object page description
 */
export const getExpressionForDescription = function(
	oHeaderInfo: HeaderInfoType | undefined,
	fullContextPath: DataModelObjectPath
): BindingExpression<string> {
	let bindingExpression = annotationExpression((oHeaderInfo?.Description as DataFieldTypes)?.Value);
	if ((oHeaderInfo?.Description as DataFieldTypes)?.Value?.$target?.annotations?.Common?.Text?.annotations?.UI?.TextArrangement) {
		// In case an explicit text arrangement was set we make use of it in the description as well
		bindingExpression = addTextArrangementToBindingExpression(bindingExpression, fullContextPath);
	}

	return compileBinding(formatValueRecursively(bindingExpression, fullContextPath));
};

/**
 * Return the expression for the save button.
 *
 * @param oViewData The current view data
 * @param fullContextPath The path used up until here
 * @returns The binding expression that shows the right save button text
 */
export const getExpressionForSaveButton = function(oViewData: ViewData, fullContextPath: DataModelObjectPath): BindingExpression<string> {
	const saveButtonText = CommonUtils.getTranslatedText("T_OP_OBJECT_PAGE_SAVE", oViewData.resourceBundle);
	const createButtonText = CommonUtils.getTranslatedText("T_OP_OBJECT_PAGE_CREATE", oViewData.resourceBundle);
	let saveExpression;
	if (isStickySessionSupported(fullContextPath.startingEntitySet)) {
		// If we're in sticky mode AND the ui is in create mode, show Create, else show Save
		saveExpression = ifElse(UI.IsCreateModeSticky, createButtonText, saveButtonText);
	} else {
		// If we're in draft AND the draft is a new object (!IsActiveEntity && !HasActiveEntity), show create, else show save
		saveExpression = ifElse(Draft.IsNewObject, createButtonText, saveButtonText);
	}
	return compileBinding(saveExpression);
};
