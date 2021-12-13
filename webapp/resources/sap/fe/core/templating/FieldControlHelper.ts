import { equal, Expression, ExpressionOrPrimitive, or, annotationExpression } from "sap/fe/core/helpers/BindingExpression";

/**
 * Create the binding expression to check if the property is non editable or not.
 *
 * @param {object} oTarget The target property or DataField
 * @returns {ExpressionOrPrimitive<boolean>} The binding expression resolving to a boolean being true if it's non editable
 */
export const isNonEditableExpression = function(oTarget: any): Expression<boolean> {
	return or(isReadOnlyExpression(oTarget), isDisabledExpression(oTarget));
};

/**
 * Create the binding expression to check if the property is read only or not.
 *
 * @param {object} oTarget The target property or DataField
 * @returns {ExpressionOrPrimitive<boolean>} The binding expression resolving to a boolean being true if it's read only
 */
export const isReadOnlyExpression = function(oTarget: any): ExpressionOrPrimitive<boolean> {
	const oFieldControlValue = oTarget?.annotations?.Common?.FieldControl?.valueOf();
	if (typeof oFieldControlValue === "object") {
		return !!oFieldControlValue && equal(annotationExpression(oFieldControlValue) as ExpressionOrPrimitive<number>, 1);
	}
	return oFieldControlValue === "Common.FieldControlType/ReadOnly";
};

/**
 * Create the binding expression to check if the property is disabled or not.
 *
 * @param {object} oTarget The target property or DataField
 * @returns {ExpressionOrPrimitive<boolean>} The binding expression resolving to a boolean being true if it's disabled
 */
export const isDisabledExpression = function(oTarget: any): ExpressionOrPrimitive<boolean> {
	const oFieldControlValue = oTarget?.annotations?.Common?.FieldControl?.valueOf();
	if (typeof oFieldControlValue === "object") {
		return !!oFieldControlValue && equal(annotationExpression(oFieldControlValue) as ExpressionOrPrimitive<number>, 0);
	}
	return oFieldControlValue === "Common.FieldControlType/Inapplicable";
};

/**
 * Create the binding expression to check if the property is read only or not.
 *
 * @param {object} oTarget The target property or DataField
 * @returns {ExpressionOrPrimitive<boolean>} The binding expression resolving to a boolean being true if it's read only
 */
export const isRequiredExpression = function(oTarget: any): ExpressionOrPrimitive<boolean> {
	const oFieldControlValue = oTarget?.annotations?.Common?.FieldControl?.valueOf();
	if (typeof oFieldControlValue === "object") {
		return !!oFieldControlValue && equal(annotationExpression(oFieldControlValue) as ExpressionOrPrimitive<number>, 7);
	}
	return oFieldControlValue === "Common.FieldControlType/Mandatory";
};
