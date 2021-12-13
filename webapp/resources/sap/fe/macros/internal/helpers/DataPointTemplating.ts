import valueFormatters from "sap/fe/core/formatters/ValueFormatter";
import { getDisplayMode, EDM_TYPE_MAPPING, getBindingWithUnitOrCurrency } from "sap/fe/core/templating/UIFormatters";

import { DataModelObjectPath, enhanceDataModelPath, getPathRelativeLocation } from "sap/fe/core/templating/DataModelPathHelper";
import {
	Expression,
	annotationExpression,
	formatResult,
	BindingExpressionExpression,
	BindingExpression,
	compileBinding,
	bindingExpression,
	ComplexTypeExpression,
	unresolveableExpression
} from "sap/fe/core/helpers/BindingExpression";

import { getAssociatedUnitPropertyPath } from "sap/fe/core/templating/PropertyHelper";

import { AnnotationHelper } from "sap/ui/model/odata/v4";

export type DataPointFormatOptions = Partial<{
	measureDisplayMode: String;
}>;

const getDataPointTargetExpression = (oDataModelPath: any): Expression<string> => {
	return oDataModelPath?.TargetValue ? annotationExpression(oDataModelPath.TargetValue) : unresolveableExpression;
};

const oResourceModel = sap.ui.getCore().getLibraryResourceBundle("sap.fe.macros");

export const progressIndicatorDisplayValue = (oPropertyDataModelObjectPath: DataModelObjectPath): BindingExpression<string> => {
	const fieldValue = oPropertyDataModelObjectPath?.targetObject?.Value || "";
	const relativeLocation = getPathRelativeLocation(
		oPropertyDataModelObjectPath.contextLocation,
		oPropertyDataModelObjectPath.navigationProperties
	).map(np => np.name);
	const fieldValueExpression = annotationExpression(fieldValue, relativeLocation);
	const TargetExpression = getDataPointTargetExpression(oPropertyDataModelObjectPath.targetObject);

	if (fieldValueExpression && TargetExpression) {
		const sUnitPropertyPath = fieldValue?.$target ? getAssociatedUnitPropertyPath(fieldValue?.$target) : undefined;

		if (!sUnitPropertyPath) {
			const sUoMPercent = fieldValue.$target?.annotations?.Measures?.Unit?.charAt(0);
			if (sUoMPercent === "%") {
				return (compileBinding(fieldValueExpression) as string) + " %";
			} else {
				return oResourceModel.getText("T_COMMON_PROGRESS_INDICATOR_DISPLAY_VALUE_NO_UOM", [
					compileBinding(fieldValueExpression) as string,
					compileBinding(TargetExpression) as string
				]);
			}
		} else {
			return (
				oResourceModel.getText("T_COMMON_PROGRESS_INDICATOR_DISPLAY_VALUE_NO_UOM", [
					compileBinding(fieldValueExpression) as string,
					compileBinding(TargetExpression) as string
				]) +
				" " +
				compileBinding(bindingExpression(sUnitPropertyPath as string))
			);
		}
	}
	return undefined;
};

const buildRatingIndicatorSubtitleExpression = (oContext: any, mSampleSize: any): string | undefined => {
	if (mSampleSize) {
		return formatRatingIndicatorSubTitle(AnnotationHelper.value(mSampleSize, { context: oContext }));
	}
};
// returns the text for the Rating Indicator Subtitle (e.g. '7 reviews')
const formatRatingIndicatorSubTitle = (iSampleSizeValue: number): string | undefined => {
	if (iSampleSizeValue) {
		const sSubTitleLabel =
			iSampleSizeValue > 1
				? oResourceModel.getText("T_ANNOTATION_HELPER_RATING_INDICATOR_SUBTITLE_LABEL_PLURAL")
				: oResourceModel.getText("T_ANNOTATION_HELPER_RATING_INDICATOR_SUBTITLE_LABEL");
		return oResourceModel.getText("T_ANNOTATION_HELPER_RATING_INDICATOR_SUBTITLE", [String(iSampleSizeValue), sSubTitleLabel]);
	}
};

/**
 * This function is used to get the header text of rating indicator.
 * @param oContext
 * @param oDataPoint
 * @function param {object} oContext context of interface
 * param {object} oDataPoint data point object
 * @returns {string} Expression binding for rating indicator text
 */
export const getHeaderRatingIndicatorText = (oContext: any, oDataPoint: any): string | undefined => {
	if (oDataPoint && oDataPoint.SampleSize) {
		return buildRatingIndicatorSubtitleExpression(oContext, oDataPoint.SampleSize);
	} else if (oDataPoint && oDataPoint.Description) {
		const sModelValue = AnnotationHelper.value(oDataPoint.Description, { context: oContext });
		return "${path:" + sModelValue + "}";
	}
};
getHeaderRatingIndicatorText.requiresIContext = true;

const buildExpressionForDescription = (fieldValue: any): Expression<any> | undefined => {
	if (fieldValue?.$target?.annotations?.Common?.Text) {
		const oTextExpression = annotationExpression(fieldValue?.$target?.annotations?.Common?.Text) as BindingExpressionExpression<any>;
		oTextExpression.parameters = { "$$noPatch": true };
		return oTextExpression;
	}
	return undefined;
};

const getDecimalFormat = (
	outExpression: BindingExpression<any>,
	fieldValue: any,
	sNumberOfFractionalDigits: string
): BindingExpression<any> => {
	if (!outExpression.constraints) {
		outExpression.constraints = {};
	}
	outExpression.constraints = Object.assign(outExpression.constraints, {
		precision: fieldValue.$target.precision,
		scale: sNumberOfFractionalDigits ? sNumberOfFractionalDigits : fieldValue.$target.scale
	});
	return outExpression;
};

const getValueFormatted = (
	oPropertyDataModelPath: DataModelObjectPath,
	fieldValue: any,
	sPropertyType: string,
	sNumberOfFractionalDigits: string
): BindingExpressionExpression<string> => {
	let outExpression: BindingExpression<any>;
	const relativeLocation =
		fieldValue?.path?.indexOf("/") === -1
			? getPathRelativeLocation(oPropertyDataModelPath.contextLocation, oPropertyDataModelPath.navigationProperties).map(
					np => np.name
			  )
			: [];
	outExpression = annotationExpression(fieldValue, relativeLocation);
	if (sPropertyType) {
		outExpression.type = EDM_TYPE_MAPPING[sPropertyType]?.type;
	}
	switch (sPropertyType) {
		case "Edm.Decimal":
			// for the listReport, the decimal fields are formatted by returning a string
			// for the facets of the OP, the decimal fields are formatted by returning a promise, so we manage all the cases
			outExpression = getDecimalFormat(outExpression, fieldValue, sNumberOfFractionalDigits);
			break;
		case "Edm.String":
			if (!outExpression.formatOptions) {
				outExpression.formatOptions = {};
			}
			if (!outExpression.constraints) {
				outExpression.constraints = {};
			}
			outExpression.formatOptions.parseKeepsEmptyString = true;
			break;
		default:
	}
	return outExpression as BindingExpressionExpression<string>;
};

export const buildFieldBindingExpression = (
	oDataModelPath: DataModelObjectPath,
	oProperty: any,
	dataPointFormatOptions: DataPointFormatOptions,
	bMeasureDisplayModeEnabled: boolean
): BindingExpression<string> => {
	const oDataPoint = oDataModelPath.targetObject;
	const oDataPointValue = oDataPoint?.Value || "";
	const oFormatOptions = oProperty.formatOptions;
	const oDescription = buildExpressionForDescription(oDataPointValue);
	const sPropertyType = oDataPointValue?.$target?.type;
	let sNumberOfFractionalDigits;

	if (sPropertyType === "Edm.Decimal" && oDataPoint.ValueFormat) {
		if (oDataPoint.ValueFormat.NumberOfFractionalDigits) {
			sNumberOfFractionalDigits = oDataPoint.ValueFormat.NumberOfFractionalDigits;
		}
	}
	const oPropertyDataModelObjectPath = enhanceDataModelPath(oDataModelPath, oDataPointValue.path);
	const oFormatedValue = getValueFormatted(oPropertyDataModelObjectPath, oDataPointValue, sPropertyType, sNumberOfFractionalDigits);
	const sDisplayMode = oDescription
		? oFormatOptions.displayMode || getDisplayMode(oDataPointValue, oPropertyDataModelObjectPath)
		: "Value";
	let oBindingExpression: any;
	switch (sDisplayMode) {
		case "Description":
			oBindingExpression = oDescription;
			break;
		case "ValueDescription":
			oBindingExpression = formatResult([oFormatedValue, oDescription], valueFormatters.formatWithBrackets);
			break;
		case "DescriptionValue":
			oBindingExpression = formatResult([oDescription, oFormatedValue], valueFormatters.formatWithBrackets);
			break;
		default:
			if (
				oPropertyDataModelObjectPath.targetObject?.annotations?.Measures?.Unit ||
				oPropertyDataModelObjectPath.targetObject?.annotations?.Measures?.ISOCurrency
			) {
				oBindingExpression = getBindingWithUnitOrCurrency(oPropertyDataModelObjectPath, oFormatedValue);
				if (oBindingExpression && bMeasureDisplayModeEnabled && dataPointFormatOptions?.measureDisplayMode !== "ReadOnly") {
					(oBindingExpression as ComplexTypeExpression<String>).formatOptions = {
						...(oBindingExpression as ComplexTypeExpression<String>).formatOptions,
						showMeasure: false
					};
				}
			} else {
				oBindingExpression = oFormatedValue;
			}
	}

	return compileBinding(oBindingExpression);
};

/**
 * Method to calculate the percentage value of Progress Indicator. Basic formula is Value/Target * 100.
 *
 * @param {*} oPropertyDataModelObjectPath
 * @returns {Binding} Expression binding that will calculate the percent value to be shown in progress indicator. Formula given above.
 */
export const buildExpressionForProgressIndicatorPercentValue = (oPropertyDataModelObjectPath: DataModelObjectPath): string | undefined => {
	const fieldValue = oPropertyDataModelObjectPath?.targetObject?.Value || "";
	const relativeLocation = getPathRelativeLocation(
		oPropertyDataModelObjectPath.contextLocation,
		oPropertyDataModelObjectPath.navigationProperties
	).map(np => np.name);
	const fieldValueExpression = annotationExpression(fieldValue, relativeLocation);
	const TargetExpression = getDataPointTargetExpression(oPropertyDataModelObjectPath.targetObject);
	const sUnitPropertyPath = fieldValue?.$target ? getAssociatedUnitPropertyPath(fieldValue.$target) : undefined;
	const UnitExpression = sUnitPropertyPath ? bindingExpression(sUnitPropertyPath) : "";

	const oExpressionTemplate = formatResult([fieldValueExpression, TargetExpression, UnitExpression], valueFormatters.computePercentage);

	return compileBinding(oExpressionTemplate);
};
