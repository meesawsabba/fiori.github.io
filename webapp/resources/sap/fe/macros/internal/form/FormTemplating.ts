import { ConnectedFieldsTypeTypes } from "@sap-ux/vocabularies-types";
import { getTextBinding } from "sap/fe/macros/field/FieldTemplating";
import { compileBinding, concat, ExpressionOrPrimitive } from "sap/fe/core/helpers/BindingExpression";
import { DataModelObjectPath, enhanceDataModelPath } from "sap/fe/core/templating/DataModelPathHelper";

const connectedFieldsTemplateRegex = /(?:({[^}]+})[^{]*)/g;
const connectedFieldsTemplateSubRegex = /{([^}]+)}(.*)/;
export const getLabelForConnectedFields = function(oConnectedFieldsPath: DataModelObjectPath) {
	const oConnectedFields: ConnectedFieldsTypeTypes = oConnectedFieldsPath.targetObject;
	// First we separate each group of `{TemplatePart} xxx`
	const aTemplateMatches = oConnectedFields.Template.toString().match(connectedFieldsTemplateRegex);
	if (aTemplateMatches) {
		const aPartsToConcat = aTemplateMatches.reduce((aPartsToConcat: ExpressionOrPrimitive<string>[], oMatch) => {
			// Then for each sub-group, we retrieve the name of the data object and the remaining text, if it exists
			const aSubMatch = oMatch.match(connectedFieldsTemplateSubRegex);
			if (aSubMatch && aSubMatch.length > 1) {
				const targetValue = aSubMatch[1];
				if ((oConnectedFields.Data as any)[targetValue]) {
					const oDataFieldPath = enhanceDataModelPath(
						oConnectedFieldsPath,
						// TODO Better type for the Edm.Dictionary
						(oConnectedFields.Data as any)[targetValue].fullyQualifiedName.replace(
							oConnectedFieldsPath.targetEntityType.fullyQualifiedName,
							""
						)
					);
					oDataFieldPath.targetObject = oDataFieldPath.targetObject.Value;
					aPartsToConcat.push(getTextBinding(oDataFieldPath, {}, true) as ExpressionOrPrimitive<string>);
					if (aSubMatch.length > 2) {
						aPartsToConcat.push(aSubMatch[2]);
					}
				}
			}
			return aPartsToConcat;
		}, []);
		return compileBinding(concat(...aPartsToConcat));
	}

	return "";
};
