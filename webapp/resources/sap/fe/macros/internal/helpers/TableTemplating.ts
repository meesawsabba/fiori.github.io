import { compileBinding, not, and, equal, constant, BindingExpression, resolveBindingString } from "sap/fe/core/helpers/BindingExpression";

/**
 * Method to compute the headerVisible property.
 *
 * @param {*} oProps Object containing the table properties
 * @returns {string} Expression binding for headerVisible
 */
export const buildExpressionForHeaderVisible = (oProps: any): BindingExpression<string> => {
	const headerBindingExpression = resolveBindingString(oProps?.header);
	const tabTileBindingExpression = resolveBindingString(oProps?.tabTitle);
	const headerVisibleBindingExpression = constant(oProps.headerVisible);
	return compileBinding(and(headerVisibleBindingExpression, not(equal(headerBindingExpression, tabTileBindingExpression))));
};
