/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)
        (c) Copyright 2009-2021 SAP SE. All rights reserved
    
 */
sap.ui.define(["sap/fe/macros/CommonHelper", "sap/fe/core/CommonUtils", "sap/ui/model/odata/v4/AnnotationHelper"], function(
	CommonHelper,
	CommonUtils,
	AnnotationHelper
) {
	"use strict";

	var FilterFieldHelper = {
		//FilterField
		isRequiredInFilter: function(path, oDetails) {
			var oModel = oDetails.context.getModel(),
				sPropertyPath = oDetails.context.getPath(),
				sPropertyLocationPath = CommonHelper.getLocationForPropertyPath(oModel, sPropertyPath),
				sProperty,
				oFilterRestrictions,
				bIsRequired = oModel.getObject(sPropertyLocationPath + "/@com.sap.vocabularies.Common.v1.ResultContext");

			if (!bIsRequired) {
				if (typeof path === "string") {
					sProperty = path;
				} else {
					sProperty = oModel.getObject(sPropertyPath + "@sapui.name");
				}
				oFilterRestrictions = oModel.getObject(sPropertyLocationPath + "@Org.OData.Capabilities.V1.FilterRestrictions");
				if (oFilterRestrictions && oFilterRestrictions.RequiredProperties) {
					bIsRequired = oFilterRestrictions.RequiredProperties.some(function(property) {
						return property.$PropertyPath === sProperty;
					});
				}
			}
			return bIsRequired;
		},
		maxConditions: function(path, oDetails) {
			var sPropertyLocationPath,
				sProperty,
				oFilterRestrictions,
				maxConditions = -1,
				oModel = oDetails.context.getModel(),
				sPropertyPath = oDetails.context.getPath();

			sPropertyLocationPath = CommonHelper.getLocationForPropertyPath(oModel, sPropertyPath);
			if (oModel.getObject(sPropertyLocationPath + "/@com.sap.vocabularies.Common.v1.ResultContext") === true) {
				return 1;
			}

			if (typeof path === "string") {
				sProperty = path;
			} else {
				sProperty = oModel.getObject(sPropertyPath + "@sapui.name");
			}
			oFilterRestrictions = CommonUtils.getFilterRestrictionsByPath(sPropertyLocationPath, oModel);
			var oProperty = oModel.getObject(sPropertyLocationPath + "/" + sProperty);
			if (!oProperty) {
				oProperty = oModel.getObject(sPropertyPath);
			}
			if (oProperty.$Type === "Edm.Boolean") {
				maxConditions = 1;
			} else if (
				oFilterRestrictions &&
				oFilterRestrictions.FilterAllowedExpressions &&
				oFilterRestrictions.FilterAllowedExpressions[sProperty]
			) {
				var sAllowedExpression = CommonUtils.getSpecificAllowedExpression(oFilterRestrictions.FilterAllowedExpressions[sProperty]);
				if (sAllowedExpression === "SingleValue" || sAllowedExpression === "SingleRange") {
					maxConditions = 1;
				}
			}
			return maxConditions;
		},
		/**
		 * To Create binding for mdc:filterfield conditions.
		 *
		 * @param {object} iContext An interface with context to the path to be considered for binding
		 * @param {object | string} vProperty The property to create the condition binding for
		 * @param {object} oEntityType The EntityType
		 * @returns {string} Expression binding for conditions for the field
		 */
		getConditionsBinding: function(iContext, vProperty, oEntityType) {
			var oPropertyInterface = iContext.getInterface(0),
				oMetaModel = oPropertyInterface.getModel(),
				sFullPropertyPath = oPropertyInterface.getPath(),
				sConditionPath = "",
				sEntityTypePath = iContext.getInterface(1).getPath(),
				aPropertyPathParts,
				i;

			if (oEntityType && oEntityType["$kind"] === "EntityType" && sFullPropertyPath.startsWith(sEntityTypePath)) {
				// in case:
				// 1. sFullPropertyPath is '/SOM/Name' and sEntityTypePath is '/SOM/'(normal scenario)
				// 2. sFullPropertyPath is '/Customer/Set/Name' and sEntityTypePath is '/Customer/Set/'(main entitytype proerty in parameterized case)
				sEntityTypePath = iContext.getInterface(1).getPath();
				var sPropertyPath = sFullPropertyPath.replace(sEntityTypePath, "");
				aPropertyPathParts = sPropertyPath.split("/");
			} else {
				// 1. sFullPropertyPath is '/Customer/Set/Name' and sEntityTypePath is '/Customer/P_CC'(parameter proerty in parameterized case)
				aPropertyPathParts = sFullPropertyPath.substring(1).split("/");
				sEntityTypePath = "/" + aPropertyPathParts.shift() + "/";
			}

			for (i = 0; i < aPropertyPathParts.length; ++i) {
				vProperty = oMetaModel.getProperty(sEntityTypePath + aPropertyPathParts.slice(0, i + 1).join("/"));
				if (vProperty.$kind === "NavigationProperty" && vProperty.$isCollection) {
					sConditionPath += aPropertyPathParts[i] + "*/";
				} else if (typeof vProperty !== "string") {
					sConditionPath += aPropertyPathParts[i] + "/";
				}
			}
			// remove the last slash from the conditionPath
			return "{$filters>/conditions/" + sConditionPath.substring(0, sConditionPath.length - 1) + "}";
		},
		constraints: function(oProperty, oInterface) {
			var sValue = AnnotationHelper.format(oProperty, oInterface),
				aMatches = sValue && sValue.match(/constraints:.*?({.*?})/),
				sConstraints = aMatches && aMatches[1];
			// Workaround. Add "V4: true" to DateTimeOffset constraints. AnnotationHelper is not aware of this flag.
			if (sValue.indexOf("sap.ui.model.odata.type.DateTimeOffset") > -1) {
				if (sConstraints) {
					sConstraints = sConstraints.substr(0, aMatches[1].indexOf("}")) + ", V4: true}";
				} else {
					sConstraints = "{V4: true}";
				}
			}
			// Remove {nullable:false} from the constraints as it prevents from having an empty filter field
			// in the case of a single-value filter
			if (sConstraints && sConstraints.indexOf("'nullable':false") >= 0) {
				sConstraints = sConstraints.replace(/,[ ]*'nullable':false/, "").replace(/'nullable':false[, ]*/, "");
			}
			return sConstraints || undefined;
		},
		formatOptions: function(oProperty, oInterface) {
			// as the Annotation helper always returns "parseKeepsEmptyString: true" we need to prevent this in case a property (of type string) is nullable
			// Filling oInterface.arguments with an array where the first parameter is null, and the second contains the "expected"
			// parseKeepsEmptyString value follows a proposal from the model colleagues to "overrule" the behavior of the AnnotationHelper
			if (oProperty.$Type === "Edm.String" && (!oProperty.hasOwnProperty("$Nullable") || oProperty.$Nullable === true)) {
				oInterface.arguments = [null, { parseKeepsEmptyString: false }];
			}
			var sValue = AnnotationHelper.format(oProperty, oInterface),
				aMatches = sValue && sValue.match(/formatOptions:.*?({.*?})/);
			return (aMatches && aMatches[1]) || undefined;
		}
	};
	FilterFieldHelper.getConditionsBinding.requiresIContext = true;
	return FilterFieldHelper;
});
