/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)
        (c) Copyright 2009-2021 SAP SE. All rights reserved
    
 */
sap.ui.define(
	[
		"sap/fe/macros/ResourceModel",
		"sap/ui/model/odata/v4/AnnotationHelper",
		"sap/base/Log",
		"sap/fe/core/CommonUtils",
		"sap/fe/navigation/SelectionVariant",
		"sap/fe/core/helpers/StableIdHelper",
		"sap/fe/core/helpers/ModelHelper",
		"sap/ui/model/Context",
		"sap/ui/Device",
		"sap/m/library"
	],
	function(
		ResourceModel,
		ODataModelAnnotationHelper,
		Log,
		CommonUtils,
		SelectionVariant,
		StableIdHelper,
		ModelHelper,
		Context,
		Device,
		mobilelibrary
	) {
		"use strict";
		var ValueColor = mobilelibrary.ValueColor;
		var Helper = {
			getPathToKey: function(oCtx) {
				return oCtx.getObject();
			},

			/**
			 * Determines if a field is visible.
			 *
			 * @param {object} target Target instance
			 * @param {object} oInterface Interface instance
			 * @returns {string|boolean} Returns true, false, or expression with path, for example "{= !${IsActiveEntity} }"
			 */
			isVisible: function(target, oInterface) {
				var oModel = oInterface.context.getModel(),
					sPropertyPath = oInterface.context.getPath(),
					oAnnotations = oModel.getObject(sPropertyPath + "@"),
					hidden = oAnnotations["@com.sap.vocabularies.UI.v1.Hidden"];

				return typeof hidden === "object" ? "{= !${" + hidden.$Path + "} }" : !hidden;
			},

			/**
			 * Determine if the action opens up a dialog.
			 *
			 * @param oActionContext
			 * @param oInterface
			 * @returns {boolean} `true` if a dialog is needed
			 */
			isDialog: function(oActionContext, oInterface) {
				var oModel = oInterface.context.getModel(),
					sPropertyPath = oInterface.context.getPath(),
					isCritical = oModel.getObject(sPropertyPath + "/@$ui5.overload@com.sap.vocabularies.Common.v1.IsActionCritical");
				if (isCritical) {
					return "Dialog";
				} else if (oActionContext) {
					var oAction = Array.isArray(oActionContext) ? oActionContext[0] : oActionContext;
					if (oAction.$Parameter && oAction.$Parameter.length > 1) {
						return "Dialog";
					} else {
						return "None";
					}
				}
			},
			/**
			 * Determine if field is editable.
			 *
			 * @param {object} target Target instance
			 * @param {object} oInterface Interface instance
			 * @returns {string} A Binding Expression to determine if a field should be editable or not.
			 */
			getParameterEditMode: function(target, oInterface) {
				var oModel = oInterface.context.getModel(),
					sPropertyPath = oInterface.context.getPath(),
					oAnnotations = oModel.getObject(sPropertyPath + "@"),
					fieldControl = oAnnotations["@com.sap.vocabularies.Common.v1.FieldControl"],
					immutable = oAnnotations["@Org.OData.Core.V1.Immutable"],
					computed = oAnnotations["@Org.OData.Core.V1.Computed"];

				if (fieldControl && fieldControl.$Path) {
					if (fieldControl.$Path === "ReadOnly") {
						return sap.ui.mdc.enum.EditMode.ReadOnly;
					} else {
						return (
							"{= %{" +
							fieldControl.$Path +
							"} ? " +
							"'" +
							sap.ui.mdc.enum.EditMode.ReadOnly +
							"'" +
							" : " +
							"'" +
							sap.ui.mdc.enum.EditMode.Editable +
							"'" +
							" }"
						);
					}
				}

				if (fieldControl && fieldControl.$EnumMember) {
					if (fieldControl.$EnumMember === "com.sap.vocabularies.Common.v1.FieldControlType/ReadOnly") {
						return sap.ui.mdc.enum.EditMode.ReadOnly;
					}
				}

				if (immutable || computed) {
					return sap.ui.mdc.enum.EditMode.ReadOnly;
				}

				return sap.ui.mdc.enum.EditMode.Editable;
			},
			/**
			 * Get the complete metapath to the target.
			 *
			 * @param target
			 * @param oInterface
			 * @returns {string | undefined}
			 */
			getMetaPath: function(target, oInterface) {
				return (oInterface && oInterface.context && oInterface.context.getPath()) || undefined;
			},
			isDesktop: function() {
				return Device.system.desktop === true;
			},
			getTargetCollection: function(oContext, navCollection) {
				var sPath = oContext.getPath(),
					aParts,
					entitySet,
					navigationCollection;
				if (
					oContext.getMetadata().getName() === "sap.ui.model.Context" &&
					(oContext.getObject("$kind") === "EntitySet" || oContext.getObject("$ContainsTarget") === true)
				) {
					return sPath;
				}
				if (oContext.getModel) {
					sPath =
						(oContext.getModel().getMetaPath && oContext.getModel().getMetaPath(sPath)) ||
						oContext
							.getModel()
							.getMetaModel()
							.getMetaPath(sPath);
				}
				//Supporting sPath of any format, either '/<entitySet>/<navigationCollection>' <OR> '/<entitySet>/$Type/<navigationCollection>'
				aParts = sPath.split("/").filter(function(sPart) {
					return sPart && sPart != "$Type";
				}); //filter out empty strings and parts referring to '$Type'
				entitySet = "/" + aParts[0];
				if (aParts.length === 1) {
					return entitySet;
				}
				navigationCollection = navCollection === undefined ? aParts.slice(1).join("/$NavigationPropertyBinding/") : navCollection;
				return entitySet + "/$NavigationPropertyBinding/" + navigationCollection; // used in gotoTargetEntitySet method in the same file
			},

			isPropertyFilterable: function(property, oInterface, oDataField) {
				var oModel = oInterface.context.getModel(),
					sPropertyPath = oInterface.context.getPath(),
					// LoacationPath would be the prefix of sPropertyPath, example: sPropertyPath = '/Customer/Set/Name' -> sPropertyLocationPath = '/Customer/Set'
					sPropertyLocationPath = Helper.getLocationForPropertyPath(oModel, sPropertyPath),
					sProperty = sPropertyPath.replace(sPropertyLocationPath + "/", "");

				if (
					oDataField &&
					(oDataField.$Type === "com.sap.vocabularies.UI.v1.DataFieldForAction" ||
						oDataField.$Type === "com.sap.vocabularies.UI.v1.DataFieldForIntentBasedNavigation")
				) {
					return false;
				}

				return CommonUtils.isPropertyFilterable(oModel, sPropertyLocationPath, sProperty);
			},

			getLocationForPropertyPath: function(oModel, sPropertyPath) {
				var iLength;
				var sCollectionPath = sPropertyPath.slice(0, sPropertyPath.lastIndexOf("/"));
				if (oModel.getObject(sCollectionPath + "/$kind") === "EntityContainer") {
					iLength = sCollectionPath.length + 1;
					sCollectionPath = sPropertyPath.slice(iLength, sPropertyPath.indexOf("/", iLength));
				}
				return sCollectionPath;
			},
			gotoActionParameter: function(oContext) {
				var sPath = oContext.getPath(),
					sPropertyName = oContext.getObject(sPath + "/$Name");
				var sContext;
				if (sPath.indexOf("@$ui5.overload") > -1) {
					sContext = sPath.split("@$ui5.overload")[0];
				} else {
					// For Unbound Actions in Action Parameter Dialogs
					var aAction = sPath.split("/0/")[0].split(".");
					sContext = "/" + aAction[aAction.length - 1] + "/";
				}
				return sContext + sPropertyName;
			},

			/**
			 * Returns the entity set name from the entity type name.
			 *
			 * @param {object} oMetaModel OData v4 metamodel instance
			 * @param {string} sEntityType EntityType of the actiom
			 * @returns {string} The EntitySet of the bound action
			 * @private
			 * @ui5-restricted
			 */
			getEntitySetName: function(oMetaModel, sEntityType) {
				var oEntityContainer = oMetaModel.getObject("/");
				for (var key in oEntityContainer) {
					if (typeof oEntityContainer[key] === "object" && oEntityContainer[key].$Type === sEntityType) {
						return key;
					}
				}
			},
			/**
			 * Returns the metamodel path correctly for bound actions if used with bReturnOnlyPath as true,
			 * else returns an object which has 3 properties related to the action. They are the entity set name,
			 * the $Path value of the OperationAvailable annotation and the binding parameter name. If
			 * bCheckStaticValue is true, returns the static value of OperationAvailable annotation, if present.
			 * e.g. for bound action someNameSpace.SomeBoundAction
			 * of entity set SomeEntitySet, the string "/SomeEntitySet/someNameSpace.SomeBoundAction" is returned.
			 *
			 * @param {oAction} oAction The context object of the action
			 * @param {boolean} bReturnOnlyPath If false, additional info is returned along with metamodel path to the bound action
			 * @param {string} sActionName The name of the bound action of the form someNameSpace.SomeBoundAction
			 * @param {boolean} bCheckStaticValue If true, the static value of OperationAvailable is returned, if present
			 * @returns {string|object} The string or object as specified by bReturnOnlyPath
			 * @private
			 * @ui5-restricted
			 */
			getActionPath: function(oAction, bReturnOnlyPath, sActionName, bCheckStaticValue) {
				var sContextPath = oAction.getPath().split("/@")[0];

				sActionName = !sActionName ? oAction.getObject(oAction.getPath()) : sActionName;

				if (sActionName && sActionName.indexOf("(") > -1) {
					// action bound to another entity type
					sActionName = sActionName.split("(")[0];
				} else {
					// TODO: this logic sounds wrong, to be corrected
					var sEntityTypeName = oAction.getObject(sContextPath).$Type;
					var sEntityName = this.getEntitySetName(oAction.getModel(), sEntityTypeName);
					if (sEntityName) {
						sContextPath = "/" + sEntityName;
					}
				}

				if (bCheckStaticValue) {
					return oAction.getObject(sContextPath + "/" + sActionName + "@Org.OData.Core.V1.OperationAvailable");
				}
				if (bReturnOnlyPath) {
					return sContextPath + "/" + sActionName;
				} else {
					return {
						sContextPath: sContextPath,
						sProperty: oAction.getObject(sContextPath + "/" + sActionName + "@Org.OData.Core.V1.OperationAvailable/$Path"),
						sBindingParameter: oAction.getObject(sContextPath + "/" + sActionName + "/@$ui5.overload/0/$Parameter/0/$Name")
					};
				}
			},
			/**
			 * Helper to get Edit Mode for a DataField or Rating Indicator.
			 *
			 * @function
			 * @name getEditMode
			 * @memberof sap.fe.macros.CommonHelper
			 * @param {object} oAnnotations Object containing all the Annotations of a Field
			 * @param {string} sDataFieldType Type of the Field
			 * @param {object} oFieldControl Object containing FieldControl Type for a Field
			 * @param {string} sEditMode Edit Mode fetched from the parent of the field
			 * @param {string} sCreateMode Create Mode fetched from the parent of the field. This is used to check if the object is in create mode or edit mode so as to correcltly render the immutable fields
			 * @param oUoMFieldControl
			 * @param {object} oEntityType Entity Type
			 * @param {string} sPropertyPath The property path
			 * @returns {string|boolean} A runtime binding or fixed string value for Field true/false for Rating Indicator
			 */
			getEditMode: function(
				oAnnotations,
				sDataFieldType,
				oFieldControl,
				sEditMode,
				sCreateMode,
				oUoMFieldControl,
				oEntityType,
				sPropertyPath
			) {
				if (sEditMode === "Display" || sEditMode === "ReadOnly" || sEditMode === "Disabled") {
					// the edit mode is hardcoded to a non-editable mode so no need to check any annotations
					return sEditMode;
				}
				var bComputed,
					bImmutable,
					sSemiExpression,
					sExpression,
					bDisplayOnly,
					sCheckUiEditMode,
					sFieldControlForUoM,
					sEditableReadOnly,
					bCanCreateProperty,
					sIsFieldControlPathReadOnly,
					sIsFieldControlPathDisabled,
					bIsKey = oEntityType && oEntityType.$Key.indexOf(sPropertyPath) > -1;

				if (
					sDataFieldType === "com.sap.vocabularies.UI.v1.DataFieldWithUrl" ||
					(oAnnotations &&
						oAnnotations["@com.sap.vocabularies.Common.v1.SemanticObject"] &&
						!(
							oAnnotations["@com.sap.vocabularies.Common.v1.ValueListReferences"] ||
							oAnnotations["@com.sap.vocabularies.Common.v1.ValueListMapping"] ||
							oAnnotations["@com.sap.vocabularies.Common.v1.ValueList"] ||
							oAnnotations["@com.sap.vocabularies.Common.v1.ValueListWithFixedValues"]
						))
				) {
					return "Display";
				}
				if (oAnnotations && oAnnotations["@Org.OData.Core.V1.Computed"]) {
					bComputed = oAnnotations["@Org.OData.Core.V1.Computed"].Bool
						? oAnnotations["@Org.OData.Core.V1.Computed"].Bool == "true"
						: true;
				}
				if (oAnnotations && oAnnotations["@Org.OData.Core.V1.Immutable"]) {
					bImmutable = oAnnotations["@Org.OData.Core.V1.Immutable"].Bool
						? oAnnotations["@Org.OData.Core.V1.Immutable"].Bool == "true"
						: true;
				}

				if (bIsKey && !bComputed && bImmutable) {
					// non-computed key shall be only editable in new transient contexts
					// TODO: ui mode is not considered but as a simple version expect new transient contexts as editable
					// anything else doesn't make any sense -> to be refactored (as the whole method)
					return "{= %{@$ui5.context.isTransient} === true ? 'Editable' : 'Display'}";
				}

				bDisplayOnly = bComputed || bImmutable || bIsKey;
				if (sCreateMode && sCreateMode.indexOf("{") === 0) {
					sCreateMode = "$" + sCreateMode;
				}
				bCanCreateProperty = typeof bComputed === "undefined" ? typeof bImmutable === "undefined" : !bComputed;
				if (oFieldControl) {
					if (oFieldControl.indexOf("{") === 0) {
						sIsFieldControlPathReadOnly = "$" + oFieldControl + " === '1'";
						sIsFieldControlPathDisabled = "$" + oFieldControl + " === '0'";
					} else {
						bDisplayOnly = bDisplayOnly || oFieldControl == "com.sap.vocabularies.Common.v1.FieldControlType/ReadOnly";
					}
				}
				var sEditableExpression;
				var sDisplayOrReadOnly;
				var sDisplayOrDisabled;
				var sFieldControlDisplayOrReadOnly;

				if (sIsFieldControlPathReadOnly) {
					sFieldControlDisplayOrReadOnly =
						sEditMode === "Editable" ? "'ReadOnly'" : "$" + sEditMode + " === 'Editable' ? 'ReadOnly'  : 'Display'";
					if (bCanCreateProperty) {
						sDisplayOrReadOnly =
							sEditMode === "Editable"
								? sCreateMode + " ? 'Editable' : 'ReadOnly'"
								: "$" + sEditMode + " === 'Editable' ? " + sCreateMode + "? 'Editable' : 'ReadOnly'  : 'Display'";
						sDisplayOrDisabled =
							sEditMode === "Editable" ? "'Disabled'" : "$" + sEditMode + " === 'Editable' ? 'Disabled' : 'Display'";
					} else {
						sDisplayOrReadOnly =
							sEditMode === "Editable" ? "'ReadOnly'" : "$" + sEditMode + " === 'Editable' ? 'ReadOnly' : 'Display'";
						sDisplayOrDisabled =
							sEditMode === "Editable" ? "'Disabled'" : "$" + sEditMode + " === 'Editable' ? 'Disabled' : 'Display'";
					}
				} else {
					sDisplayOrReadOnly = "'Display'";
					sDisplayOrDisabled = "'Display'";
					sFieldControlDisplayOrReadOnly = "'Display'";
				}
				sCheckUiEditMode = sEditMode && sEditMode.indexOf("{") === 0 ? "$" + sEditMode : "'" + sEditMode + "'";
				if (bDisplayOnly) {
					if (!bCanCreateProperty) {
						if (sEditMode && sEditMode.indexOf("{") === 0) {
							return "{= " + sDisplayOrReadOnly + "}";
						}
						sDisplayOrReadOnly = sDisplayOrReadOnly.split("'") && sDisplayOrReadOnly.split("'")[1];
						return sDisplayOrReadOnly;
					} else {
						if (sIsFieldControlPathReadOnly) {
							if (sCreateMode && sCreateMode.indexOf("$") === 0) {
								return (
									"{= " +
									sCreateMode +
									" ? (" +
									sIsFieldControlPathDisabled +
									"? " +
									"'Disabled'" +
									" : " +
									sIsFieldControlPathReadOnly +
									"? " +
									"'ReadOnly'" +
									" : " +
									sCheckUiEditMode +
									") : " +
									sDisplayOrReadOnly +
									"}"
								);
							} else if (sCreateMode == "true") {
								return (
									"{= " +
									sIsFieldControlPathDisabled +
									"? " +
									"'Disabled'" +
									" : " +
									sIsFieldControlPathReadOnly +
									"? " +
									"'ReadOnly'" +
									" : " +
									"${ui>/editMode} === 'Editable'" +
									"}"
								);
							} else {
								return "{= " + sDisplayOrReadOnly + "}";
							}
						} else if (oFieldControl == "com.sap.vocabularies.Common.v1.FieldControlType/ReadOnly") {
							sCheckUiEditMode = "'ReadOnly'";
						}
						if (sCreateMode && sCreateMode.indexOf("$") === 0) {
							return "{= " + sCreateMode + " ?" + "${ui>/editMode} === 'Editable'" + " : " + sDisplayOrReadOnly + "}";
						} else if (sCreateMode == "true") {
							return "{= " + sCheckUiEditMode + "}";
						} else {
							return "{= " + sDisplayOrReadOnly + "}";
						}
					}
				}
				if (sIsFieldControlPathReadOnly) {
					if (oUoMFieldControl && oUoMFieldControl.indexOf("{") === 0) {
						sCheckUiEditMode = "$" + oUoMFieldControl + " === '1' ? 'EditableReadOnly' : " + sCheckUiEditMode;
					} else if (oUoMFieldControl === "com.sap.vocabularies.Common.v1.FieldControlType/ReadOnly") {
						sCheckUiEditMode = "EditableReadOnly";
					}
					sSemiExpression =
						sIsFieldControlPathDisabled +
						" ? " +
						sDisplayOrDisabled +
						" :" +
						sIsFieldControlPathReadOnly +
						" ? " +
						sFieldControlDisplayOrReadOnly +
						" :" +
						sCheckUiEditMode;
					sEditableExpression = "{= " + sSemiExpression + "}";
				} else if (
					oUoMFieldControl &&
					(oUoMFieldControl.indexOf("{") === 0 || oUoMFieldControl === "com.sap.vocabularies.Common.v1.FieldControlType/ReadOnly")
				) {
					sFieldControlForUoM = oUoMFieldControl.indexOf("{") === 0 ? "$" + oUoMFieldControl + " === '1'" : undefined;
					sEditableReadOnly =
						sEditMode === "Editable"
							? "'EditableReadOnly'"
							: "$" + sEditMode + " === 'Editable' ? 'EditableReadOnly' : 'Display'";
					if (sFieldControlForUoM) {
						sSemiExpression = sFieldControlForUoM + " ? " + sEditableReadOnly + " :" + sCheckUiEditMode;
					} else {
						sSemiExpression = sEditableReadOnly;
					}
					sEditableExpression = "{= " + sSemiExpression + "}";
				} else {
					sSemiExpression = sCheckUiEditMode;
					sEditableExpression = sEditMode;
				}
				var sExpressionForCreatemode;
				if (sCreateMode && sCreateMode.indexOf("$") === 0) {
					sExpressionForCreatemode = "{= " + sCreateMode + " ? " + sDisplayOrReadOnly + " : " + sSemiExpression + "}";
				} else if (sCreateMode == "true") {
					sExpressionForCreatemode = "{= " + sDisplayOrReadOnly + "}";
				} else {
					sExpressionForCreatemode = "{= " + sSemiExpression + "}";
				}
				sExpression = bCanCreateProperty ? sEditableExpression : sExpressionForCreatemode;
				return sExpression;
			},

			getNavigationContext: function(oContext) {
				return ODataModelAnnotationHelper.getNavigationPath(oContext.getPath());
			},

			/**
			 * Returns the path without the entity type (potentially first) and property (last) part (optional).
			 * The result can be an empty string if it is a simple direct property.
			 *
			 * If and only if the given property path starts with a slash (/), it is considered that the entity type
			 * is part of the path and will be stripped away.
			 *
			 * @param sPropertyPath
			 * @param bKeepProperty
			 * @returns {string} The navigation path
			 */
			getNavigationPath: function(sPropertyPath, bKeepProperty) {
				var bStartsWithEntityType = sPropertyPath.startsWith("/");
				var aParts = sPropertyPath.split("/").filter(function(part) {
					return !!part;
				});
				if (bStartsWithEntityType) {
					aParts.shift();
				}
				if (!bKeepProperty) {
					aParts.pop();
				}
				return aParts.join("/");
			},

			/**
			 * Returns the correct metamodel path for bound actions.
			 *
			 * Since this method is called irrespective of the action type, this will be applied to unbound actions.
			 * In such a case, if an incorrect path is returned, it is ignored during templating.
			 *
			 * Example: for the bound action someNameSpace.SomeBoundAction of entity set SomeEntitySet,
			 * the string "/SomeEntitySet/someNameSpace.SomeBoundAction" is returned.
			 * @function
			 * @static
			 * @name sap.fe.macros.CommonHelper.getActionContext
			 * @memberof sap.fe.macros.CommonHelper
			 * @param {object} oAction Context object for the action
			 * @returns {string} Correct metamodel path for bound and incorrect path for unbound actions
			 * @private
			 * @ui5-restricted
			 **/
			getActionContext: function(oAction) {
				return Helper.getActionPath(oAction, true);
			},
			/**
			 * Returns the metamodel path correctly for overloaded bound actions. For unbound actions,
			 * the incorrect path is returned, but ignored during templating.
			 * e.g. for bound action someNameSpace.SomeBoundAction of entity set SomeEntitySet,
			 * the string "/SomeEntitySet/someNameSpace.SomeBoundAction/@$ui5.overload/0" is returned.
			 * @function
			 * @static
			 * @name sap.fe.macros.CommonHelper.getPathToBoundActionOverload
			 * @memberof sap.fe.macros.CommonHelper
			 * @param {object} oAction The context object for the action
			 * @returns {string} The correct metamodel path for bound action overload and incorrect path for unbound actions
			 * @private
			 * @ui5-restricted
			 **/
			getPathToBoundActionOverload: function(oAction) {
				var sPath = Helper.getActionPath(oAction, true);
				return sPath + "/@$ui5.overload/0";
			},

			/**
			 * Returns the string with single quotes.
			 *
			 * @function
			 * @memberof sap.fe.macros.CommonHelper
			 * @param {string} sValue Some string that needs to be converted into single quotes
			 * @returns {string} - String with single quotes
			 **/
			addSingleQuotes: function(sValue) {
				return "'" + sValue + "'";
			},

			/**
			 * Returns function string,
			 * First argument of generateFunction is name of the generated function string.
			 * Remaining arguments of generateFunction are args to generated function string.
			 * @function
			 * @memberof sap.fe.macros.CommonHelper
			 * @param {string} sFuncName Some string for the function name
			 * @returns {string} - Function string depends on args passed
			 **/
			generateFunction: function(sFuncName) {
				var sParams = "";
				for (var i = 1; i < arguments.length; i++) {
					sParams += arguments[i];
					if (i < arguments.length - 1) {
						sParams += ", ";
					}
				}

				var sFunction = sFuncName + "()";
				if (sParams) {
					sFunction = sFuncName + "(" + sParams + ")";
				}
				return sFunction;
			},
			/*
			 * Returns the visibility expression for datapoint title/link
			 *
			 * @function
			 * @param {string} [sPath] annotation path of data point or Microchart
			 * @param {boolean} [bLink] true if link visibility is being determined, false if title visibility is being determined
			 * @param {boolean} [bFieldVisibility] true if field is vsiible, false otherwise
			 * @returns  {string} sVisibilityExp Used to get the  visibility binding for DataPoints title in the Header.
			 *
			 */

			getHeaderDataPointLinkVisibility: function(sPath, bLink, bFieldVisibility) {
				var sVisibilityExp;
				if (bFieldVisibility) {
					sVisibilityExp = bLink
						? "{= ${internal>isHeaderDPLinkVisible/" + sPath + "} === true && " + bFieldVisibility + "}"
						: "{= ${internal>isHeaderDPLinkVisible/" + sPath + "} !== true && " + bFieldVisibility + "}";
				} else {
					sVisibilityExp = bLink
						? "{= ${internal>isHeaderDPLinkVisible/" + sPath + "} === true}"
						: "{= ${internal>isHeaderDPLinkVisible/" + sPath + "} !== true}";
				}
				return sVisibilityExp;
			},

			/**
			 * Converts object to string(different from JSON.stringify or.toString).
			 *
			 * @function
			 * @memberof sap.fe.macros.CommonHelper
			 * @param {string} oParams Some object
			 * @returns {string} - Object string
			 **/
			objectToString: function(oParams) {
				var iNumberOfKeys = Object.keys(oParams).length,
					sParams = "";

				for (var sKey in oParams) {
					var sValue = oParams[sKey];
					if (sValue && typeof sValue === "object") {
						sValue = this.objectToString(sValue);
					}
					sParams += sKey + ": " + sValue;
					if (iNumberOfKeys > 1) {
						--iNumberOfKeys;
						sParams += ", ";
					}
				}

				var sObject = "{ " + sParams + "}";
				return sObject;
			},

			/**
			 * Removes escape characters (\) from an expression.
			 *
			 * @function
			 * @memberof sap.fe.macros.CommonHelper
			 * @param {string} sExpression An expression with escape characters
			 * @returns {string} Expression string without escape characters or undefined
			 **/
			removeEscapeCharacters: function(sExpression) {
				return sExpression ? sExpression.replace(/\\?\\([{}])/g, "$1") : undefined;
			},

			/**
			 * Makes updates to a stringified object so that it works properly in a template by adding ui5Object:true.
			 *
			 * @param {string} sStringified
			 * @returns {string} The updated string representation of the object
			 */
			stringifyObject: function(sStringified) {
				if (!sStringified) {
					return undefined;
				} else {
					var oObject = JSON.parse(sStringified);
					if (typeof oObject === "object" && !Array.isArray(oObject)) {
						var oUI5Object = {
							ui5object: true
						};
						Object.assign(oUI5Object, oObject);
						return JSON.stringify(oUI5Object);
					} else {
						var sType = Array.isArray(oObject) ? "Array" : typeof oObject;
						Log.error("Unexpected object type in stringifyObject (" + sType + ") - only works with object");
						throw new Error("stringifyObject only works with objects!");
					}
				}
			},

			/**
			 * Create a string representation of the given data, taking care that it is not treated as a binding expression.
			 *
			 * @param {object} vData The data to stringify
			 * @returns {string} The string representation of the data.
			 */
			stringifyCustomData: function(vData) {
				var oObject = {
					ui5object: true
				};
				oObject["customData"] = vData instanceof Context ? vData.getObject() : vData;
				return JSON.stringify(oObject);
			},

			/**
			 * Parses the given data, potentially unwraps the data.
			 *
			 * @param {object | string} vData The data to parse
			 * @returns {object} The result of the data parsing
			 */
			parseCustomData: function(vData) {
				var vData = typeof vData === "string" ? JSON.parse(vData) : vData;
				if ("customData" in vData) {
					return vData["customData"];
				}
				return vData;
			},
			/**
			 * @function
			 * @name _getDraftAdministrativeDataType
			 * @param {object} oMetaModel
			 * @param {string} sEntityType The EntityType name
			 * @returns {object} The DraftAdministrativeData
			 */
			_getDraftAdministrativeDataType: function(oMetaModel, sEntityType) {
				return oMetaModel.requestObject("/" + sEntityType + "/DraftAdministrativeData/");
			},
			/**
			 * @function
			 * @name getPopoverText
			 * @param {iContext} iContext
			 * @param {string} sEntityType The EntityType name
			 * @returns {string} The Binding Expression for the draft popover
			 */
			getPopoverText: function(iContext, sEntityType) {
				return Helper._getDraftAdministrativeDataType(iContext.getModel(), sEntityType).then(function(oDADEntityType) {
					var sBinding =
						"{parts: [{path: 'HasDraftEntity', targetType: 'any'}, " +
						//"{path: 'DraftAdministrativeData/LastChangeDateTime'}, " +
						"{path: 'DraftAdministrativeData/InProcessByUser'}, " +
						"{path: 'DraftAdministrativeData/LastChangedByUser'} ";
					if (oDADEntityType.InProcessByUserDescription) {
						sBinding += " ,{path: 'DraftAdministrativeData/InProcessByUserDescription'}";
					}

					if (oDADEntityType.LastChangedByUserDescription) {
						sBinding += ", {path: 'DraftAdministrativeData/LastChangedByUserDescription'}";
					}
					sBinding += "], formatter: 'sap.fe.macros.field.FieldRuntime.formatDraftOwnerTextInPopover'}";
					return sBinding;
				});
			},
			getContextPath: function(oValue, oInterface) {
				return oInterface && oInterface.context && oInterface.context.getPath();
			},
			/**
			 * Returns a stringified JSON object containing  Presentation Variant sort conditions.
			 * @param {object} oPresentationVariant Presentation variant Annotation
			 * @param sPresentationVariantPath
			 * @returns {string} Stringified JSON object
			 */
			getSortConditions: function(oPresentationVariant, sPresentationVariantPath) {
				if (
					oPresentationVariant &&
					this._isPresentationVariantAnnotation(sPresentationVariantPath) &&
					oPresentationVariant.SortOrder
				) {
					var aSortConditions = {
						sorters: []
					};
					oPresentationVariant.SortOrder.forEach(function(oCondition) {
						var oSorter = {};
						oSorter.name = oCondition.Property.$PropertyPath;
						oSorter.descending = !!oCondition.Descending;
						aSortConditions.sorters.push(oSorter);
					});
					return JSON.stringify(aSortConditions);
				}
				return undefined;
			},
			_isPresentationVariantAnnotation: function(sAnnotationPath) {
				return (
					sAnnotationPath.indexOf("@com.sap.vocabularies.UI.v1.PresentationVariant") > -1 ||
					sAnnotationPath.indexOf("@com.sap.vocabularies.UI.v1.SelectionPresentationVariant") > -1
				);
			},
			createPresentationPathContext: function(oPresentationContext) {
				var aPaths = oPresentationContext.sPath.split("@") || [];
				var oModel = oPresentationContext.getModel();
				if (aPaths.length && aPaths[aPaths.length - 1].indexOf("com.sap.vocabularies.UI.v1.SelectionPresentationVariant") > -1) {
					var sPath = oPresentationContext.sPath.split("/PresentationVariant")[0];
					return oModel.createBindingContext(sPath + "@sapui.name");
				}
				return oModel.createBindingContext(oPresentationContext.sPath + "@sapui.name");
			},
			getPressHandlerForDataFieldForIBN: function(oDataField, sContext, bNavigateWithConfirmationDialog) {
				var mNavigationParameters = {
					navigationContexts: sContext ? sContext : "${$source>/}.getBindingContext()"
				};
				if (oDataField.RequiresContext && !oDataField.Inline && bNavigateWithConfirmationDialog) {
					mNavigationParameters.applicableContexts =
						"${internal>ibn/" + oDataField.SemanticObject + "-" + oDataField.Action + "/aApplicable/}";
					mNavigationParameters.notApplicableContexts =
						"${internal>ibn/" + oDataField.SemanticObject + "-" + oDataField.Action + "/aNotApplicable/}";
					mNavigationParameters.label = "'" + oDataField.Label + "'";
				}
				if (oDataField.Mapping) {
					mNavigationParameters.semanticObjectMapping = this.addSingleQuotes(JSON.stringify(oDataField.Mapping));
				}
				return this.generateFunction(
					bNavigateWithConfirmationDialog
						? "._intentBasedNavigation.navigateWithConfirmationDialog"
						: "._intentBasedNavigation.navigate",
					this.addSingleQuotes(oDataField.SemanticObject),
					this.addSingleQuotes(oDataField.Action),
					this.objectToString(mNavigationParameters)
				);
			},
			getEntitySet: function(oContext) {
				var sPath = oContext.getPath();
				return ModelHelper.getEntitySetPath(sPath);
			},
			_isRatingIndicator: function(oControl) {
				if (oControl.isA("sap.fe.core.controls.FieldWrapper")) {
					var vContentDisplay = Array.isArray(oControl.getContentDisplay())
						? oControl.getContentDisplay()[0]
						: oControl.getContentDisplay();
					if (vContentDisplay && vContentDisplay.isA("sap.m.RatingIndicator")) {
						return true;
					}
				}
				return false;
			},
			_updateStyleClassForRatingIndicator: function(oFieldWrapper, bLast) {
				var vContentDisplay = Array.isArray(oFieldWrapper.getContentDisplay())
					? oFieldWrapper.getContentDisplay()[0]
					: oFieldWrapper.getContentDisplay();
				var vContentEdit = Array.isArray(oFieldWrapper.getContentEdit())
					? oFieldWrapper.getContentEdit()[0]
					: oFieldWrapper.getContentEdit();

				if (bLast) {
					vContentDisplay.addStyleClass("sapUiNoMarginBottom");
					vContentDisplay.addStyleClass("sapUiNoMarginTop");
					vContentEdit.removeStyleClass("sapUiTinyMarginBottom");
				} else {
					vContentDisplay.addStyleClass("sapUiNoMarginBottom");
					vContentDisplay.removeStyleClass("sapUiNoMarginTop");
					vContentEdit.addStyleClass("sapUiTinyMarginBottom");
				}
			},

			/**
			 * Handles the visibility of form menu actions both in path based and static value scenarios.
			 *
			 * @function
			 * @memberof sap.fe.macros.CommonHelper
			 * @param {*} sVisibleValue Either static boolean values or Array of path expressions for visibility of menu button.
			 * @returns {*} The binding expression determining the visibility of menu actions.
			 **/
			handleVisibilityOfMenuActions: function(sVisibleValue) {
				var combinedConditions = [];
				if (Array.isArray(sVisibleValue)) {
					for (var i = 0; i < sVisibleValue.length; i++) {
						if (sVisibleValue[i].split("{=").length > 0) {
							sVisibleValue[i] = sVisibleValue[i].split("{=")[1].slice(0, -1);
						}
						combinedConditions.push("(" + sVisibleValue[i] + ")");
					}
				}
				return combinedConditions.length > 0 ? "{= " + combinedConditions.join(" || ") + "}" : sVisibleValue;
			},
			/**
			 * Method to do the calculation of criticality in case CriticalityCalculation present in the annotation
			 *
			 * The calculation is done by comparing a value to the threshold values relevant for the specified improvement direction.
			 * For improvement direction Target, the criticality is calculated using both low and high threshold values. It will be
			 *
			 * - Positive if the value is greater than or equal to AcceptanceRangeLowValue and lower than or equal to AcceptanceRangeHighValue
			 * - Neutral if the value is greater than or equal to ToleranceRangeLowValue and lower than AcceptanceRangeLowValue OR greater than AcceptanceRangeHighValue and lower than or equal to ToleranceRangeHighValue
			 * - Critical if the value is greater than or equal to DeviationRangeLowValue and lower than ToleranceRangeLowValue OR greater than ToleranceRangeHighValue and lower than or equal to DeviationRangeHighValue
			 * - Negative if the value is lower than DeviationRangeLowValue or greater than DeviationRangeHighValue
			 *
			 * For improvement direction Minimize, the criticality is calculated using the high threshold values. It is
			 * - Positive if the value is lower than or equal to AcceptanceRangeHighValue
			 * - Neutral if the value is greater than AcceptanceRangeHighValue and lower than or equal to ToleranceRangeHighValue
			 * - Critical if the value is greater than ToleranceRangeHighValue and lower than or equal to DeviationRangeHighValue
			 * - Negative if the value is greater than DeviationRangeHighValue
			 *
			 * For improvement direction Maximize, the criticality is calculated using the low threshold values. It is
			 *
			 * - Positive if the value is greater than or equal to AcceptanceRangeLowValue
			 * - Neutral if the value is less than AcceptanceRangeLowValue and greater than or equal to ToleranceRangeLowValue
			 * - Critical if the value is lower than ToleranceRangeLowValue and greater than or equal to DeviationRangeLowValue
			 * - Negative if the value is lower than DeviationRangeLowValue
			 *
			 * Thresholds are optional. For unassigned values, defaults are determined in this order:
			 *
			 * - For DeviationRange, an omitted LowValue translates into the smallest possible number (-INF), an omitted HighValue translates into the largest possible number (+INF)
			 * - For ToleranceRange, an omitted LowValue will be initialized with DeviationRangeLowValue, an omitted HighValue will be initialized with DeviationRangeHighValue
			 * - For AcceptanceRange, an omitted LowValue will be initialized with ToleranceRangeLowValue, an omitted HighValue will be initialized with ToleranceRangeHighValue.
			 *
			 * @param {string} sImprovementDirection ImprovementDirection to be used for creating the criticality binding
			 * @param {string} sValue Value from Datapoint to be measured
			 * @param {string} sDeviationLow ExpressionBinding for Lower Deviation level
			 * @param {string} sToleranceLow ExpressionBinding for Lower Tolerance level
			 * @param {string} sAcceptanceLow ExpressionBinding for Lower Acceptance level
			 * @param {string} sAcceptanceHigh ExpressionBinding for Higher Acceptance level
			 * @param {string} sToleranceHigh ExpressionBinding for Higher Tolerance level
			 * @param {string} sDeviationHigh ExpressionBinding for Higher Deviation level
			 * @returns {string} Returns criticality calculation as expression binding
			 */
			getCriticalityCalculationBinding: function(
				sImprovementDirection,
				sValue,
				sDeviationLow,
				sToleranceLow,
				sAcceptanceLow,
				sAcceptanceHigh,
				sToleranceHigh,
				sDeviationHigh
			) {
				var sCriticalityExpression = ValueColor.Neutral; // Default Criticality State

				sValue = "%" + sValue;

				// Setting Unassigned Values
				sDeviationLow = sDeviationLow || -Infinity;
				sToleranceLow = sToleranceLow || sDeviationLow;
				sAcceptanceLow = sAcceptanceLow || sToleranceLow;
				sDeviationHigh = sDeviationHigh || Infinity;
				sToleranceHigh = sToleranceHigh || sDeviationHigh;
				sAcceptanceHigh = sAcceptanceHigh || sToleranceHigh;

				// Dealing with Decimal and Path based bingdings
				sDeviationLow = sDeviationLow && (+sDeviationLow ? +sDeviationLow : "%" + sDeviationLow);
				sToleranceLow = sToleranceLow && (+sToleranceLow ? +sToleranceLow : "%" + sToleranceLow);
				sAcceptanceLow = sAcceptanceLow && (+sAcceptanceLow ? +sAcceptanceLow : "%" + sAcceptanceLow);
				sAcceptanceHigh = sAcceptanceHigh && (+sAcceptanceHigh ? +sAcceptanceHigh : "%" + sAcceptanceHigh);
				sToleranceHigh = sToleranceHigh && (+sToleranceHigh ? +sToleranceHigh : "%" + sToleranceHigh);
				sDeviationHigh = sDeviationHigh && (+sDeviationHigh ? +sDeviationHigh : "%" + sDeviationHigh);

				// Creating runtime expression binding from criticality calculation for Criticality State
				if (sImprovementDirection.indexOf("Minimize") > -1) {
					sCriticalityExpression =
						"{= " +
						sValue +
						" <= " +
						sAcceptanceHigh +
						" ? '" +
						ValueColor.Good +
						"' : " +
						sValue +
						" <= " +
						sToleranceHigh +
						" ? '" +
						ValueColor.Neutral +
						"' : " +
						"(" +
						sDeviationHigh +
						" && " +
						sValue +
						" <= " +
						sDeviationHigh +
						") ? '" +
						ValueColor.Critical +
						"' : '" +
						ValueColor.Error +
						"' }";
				} else if (sImprovementDirection.indexOf("Maximize") > -1) {
					sCriticalityExpression =
						"{= " +
						sValue +
						" >= " +
						sAcceptanceLow +
						" ? '" +
						ValueColor.Good +
						"' : " +
						sValue +
						" >= " +
						sToleranceLow +
						" ? '" +
						ValueColor.Neutral +
						"' : " +
						"(" +
						sDeviationLow +
						" && " +
						sValue +
						" >= " +
						sDeviationLow +
						") ? '" +
						ValueColor.Critical +
						"' : '" +
						ValueColor.Error +
						"' }";
				} else if (sImprovementDirection.indexOf("Target") > -1) {
					sCriticalityExpression =
						"{= (" +
						sValue +
						" <= " +
						sAcceptanceHigh +
						" && " +
						sValue +
						" >= " +
						sAcceptanceLow +
						") ? '" +
						ValueColor.Good +
						"' : " +
						"((" +
						sValue +
						" >= " +
						sToleranceLow +
						" && " +
						sValue +
						" < " +
						sAcceptanceLow +
						") || (" +
						sValue +
						" > " +
						sAcceptanceHigh +
						" && " +
						sValue +
						" <= " +
						sToleranceHigh +
						")) ? '" +
						ValueColor.Neutral +
						"' : " +
						"((" +
						sDeviationLow +
						" && (" +
						sValue +
						" >= " +
						sDeviationLow +
						") && (" +
						sValue +
						" < " +
						sToleranceLow +
						")) || ((" +
						sValue +
						" > " +
						sToleranceHigh +
						") && " +
						sDeviationHigh +
						" && (" +
						sValue +
						" <= " +
						sDeviationHigh +
						"))) ? '" +
						ValueColor.Critical +
						"' : '" +
						ValueColor.Error +
						"' }";
				} else {
					Log.warning("Case not supported, returning the default Value Neutral");
				}

				return sCriticalityExpression;
			},
			/**
			 * This function returns the criticality indicator from annotations if criticality is EnumMember.
			 *
			 * @param {string} sCriticality Criticality provided in the annotations
			 * @returns {sIndicator} Return the indicator for criticality
			 * @private
			 */
			_getCriticalityFromEnum: function(sCriticality) {
				var sIndicator;
				if (sCriticality === "com.sap.vocabularies.UI.v1.CriticalityType/Negative") {
					sIndicator = ValueColor.Error;
				} else if (sCriticality === "com.sap.vocabularies.UI.v1.CriticalityType/Positive") {
					sIndicator = ValueColor.Good;
				} else if (sCriticality === "com.sap.vocabularies.UI.v1.CriticalityType/Critical") {
					sIndicator = ValueColor.Critical;
				} else {
					sIndicator = ValueColor.Neutral;
				}
				return sIndicator;
			},
			getValueCriticality: function(sDimension, aValueCriticality) {
				var sResult,
					aValues = [];
				if (aValueCriticality && aValueCriticality.length > 0) {
					aValueCriticality.forEach(function(oVC) {
						if (oVC.Value && oVC.Criticality.$EnumMember) {
							var sValue =
								"${" +
								sDimension +
								"} === '" +
								oVC.Value +
								"' ? '" +
								Helper._getCriticalityFromEnum(oVC.Criticality.$EnumMember) +
								"'";
							aValues.push(sValue);
						}
					});
					sResult = aValues.length > 0 && aValues.join(" : ") + " : undefined";
				}
				return sResult ? "{= " + sResult + " }" : undefined;
			},
			/**
			 * To fetch measure attribute index.
			 *
			 * @param {Integer} iMeasure Chart Annotations
			 * @param {object} oChartAnnotations Chart Annotations
			 * @returns {string} MeasureAttribute index.
			 * @private
			 */
			getMeasureAttributeIndex: function(iMeasure, oChartAnnotations) {
				var aMeasures = oChartAnnotations.Measures,
					bMeasureAttributeExists,
					aMeasureAttributes = oChartAnnotations.MeasureAttributes,
					sMeasurePropertyPath = aMeasures && aMeasures[iMeasure] && aMeasures[iMeasure].$PropertyPath,
					iMeasureAttribute = -1,
					fnCheckMeasure = function(sMeasure, oMeasureAttribute, index) {
						if ((oMeasureAttribute && oMeasureAttribute.Measure && oMeasureAttribute.Measure.$PropertyPath) === sMeasure) {
							iMeasureAttribute = index;
							return true;
						}
					};
				if (aMeasureAttributes) {
					bMeasureAttributeExists = aMeasureAttributes.some(fnCheckMeasure.bind(null, sMeasurePropertyPath));
				}
				return bMeasureAttributeExists && iMeasureAttribute > -1 && iMeasureAttribute;
			},
			/**
			 * This function returns the measureAttribute for the measure.
			 *
			 * @param {object} oContext Context to the measure annotation
			 * @returns {string} Path to the measureAttribute of the measure
			 */
			getMeasureAttributeForMeasure: function(oContext) {
				var oMetaModel = oContext.getModel(),
					sMeasurePath = oContext.getPath(),
					sChartAnnotationPath = sMeasurePath.substring(0, sMeasurePath.lastIndexOf("Measure")),
					iMeasure = sMeasurePath.replace(/.*\//, "");

				return oMetaModel.requestObject(sChartAnnotationPath).then(function(oChartAnnotations) {
					var aMeasureAttributes = oChartAnnotations.MeasureAttributes,
						iMeasureAttribute = Helper.getMeasureAttributeIndex(iMeasure, oChartAnnotations);
					var sMeasureAttributePath =
						iMeasureAttribute > -1 && aMeasureAttributes[iMeasureAttribute] && aMeasureAttributes[iMeasureAttribute].DataPoint
							? sChartAnnotationPath + "MeasureAttributes/" + iMeasureAttribute + "/"
							: Log.warning("DataPoint missing for the measure") && undefined;
					return sMeasureAttributePath ? sMeasureAttributePath + "DataPoint/$AnnotationPath/" : sMeasureAttributePath;
				});
			},
			/**
			 * Method to determine if the contained navigation property has a draft root/node parent entitySet.
			 *
			 * @function
			 * @name isDraftParentEntityForContainment
			 * @param {object} oTargetCollectionContainsTarget Target collection has ContainsTarget property
			 * @param {object} oTableMetadata Table metadata for which draft support shall be checked
			 * @returns {boolean} Returns true if draft
			 */
			isDraftParentEntityForContainment: function(oTargetCollectionContainsTarget, oTableMetadata) {
				if (oTargetCollectionContainsTarget) {
					if (oTableMetadata && oTableMetadata.parentEntitySet && oTableMetadata.parentEntitySet.sPath) {
						var sParentEntitySetPath = oTableMetadata.parentEntitySet.sPath;
						var oDraftRoot = oTableMetadata.parentEntitySet.oModel.getObject(
							sParentEntitySetPath + "@com.sap.vocabularies.Common.v1.DraftRoot"
						);
						var oDraftNode = oTableMetadata.parentEntitySet.oModel.getObject(
							sParentEntitySetPath + "@com.sap.vocabularies.Common.v1.DraftNode"
						);
						if (oDraftRoot || oDraftNode) {
							return true;
						} else {
							return false;
						}
					}
				} else {
					return false;
				}
			},

			/**
			 * Ensures the data is processed as defined in the template.
			 * Since the property Data is of the type 'object', it may not be in the same order as required by the template.
			 *
			 * @function
			 * @memberof sap.fe.macros.CommonHelper
			 * @param {object} dataElement The data that is currently being processed.
			 * @returns {string} The correct path according to the template.
			 **/
			getDataFromTemplate: function(dataElement) {
				var splitPath = dataElement.getPath().split("/");
				var dataKey = splitPath[splitPath.length - 1];
				var connectedDataPath = "/" + splitPath.slice(1, -2).join("/") + "/@";
				var connectedObject = dataElement.getObject(connectedDataPath);
				var template = connectedObject.Template;
				var splitTemp = template.split("}");
				var tempArray = [];
				for (var i = 0; i < splitTemp.length - 1; i++) {
					var key = splitTemp[i].split("{")[1].trim();
					tempArray.push(key);
				}
				var index = Object.keys(connectedObject.Data).indexOf(dataKey) - 1;
				return "/" + splitPath.slice(1, -2).join("/") + "/Data/" + tempArray[index];
			},

			/**
			 * Checks if the end of the template has been reached.
			 *
			 * @function
			 * @memberof sap.fe.macros.CommonHelper
			 * @param {object} target The target of the connected fields.
			 * @param {object} element The element that is currently being processed.
			 * @returns {boolean} True or False (depending on the template index).
			 **/
			notLastIndex: function(target, element) {
				var template = target.Template;
				var splitTemp = template.split("}");
				var tempArray = [];
				var isLastIndex = false;
				for (var i = 0; i < splitTemp.length - 1; i++) {
					var dataKey = splitTemp[i].split("{")[1].trim();
					tempArray.push(dataKey);
				}

				tempArray.forEach(function(template) {
					if (target.Data[template] === element && tempArray.indexOf(template) !== tempArray.length - 1) {
						isLastIndex = true;
					}
				});
				return isLastIndex;
			},

			/**
			 * Determines the delimiter from the template.
			 *
			 * @function
			 * @memberof sap.fe.macros.CommonHelper
			 * @param {string} template The template string.
			 * @returns {string} The delimiter in the template string.
			 **/
			getDelimiter: function(template) {
				return template
					.split("}")[1]
					.split("{")[0]
					.trim();
			},

			getParameters: function(oContext, oInterface) {
				if (oContext) {
					var oMetaModel = oInterface.context.getModel();
					var sPath = oInterface.context.getPath();
					var oParameterInfo = CommonUtils.getParameterInfo(oMetaModel, sPath);
					if (oParameterInfo.parameterProperties) {
						return Object.keys(oParameterInfo.parameterProperties);
					}
				}
				return [];
			}
		};

		Helper.isPropertyFilterable.requiresIContext = true;
		Helper.getPopoverText.requiresIContext = true;

		return Helper;
	},
	/* bExport= */
	true
);
