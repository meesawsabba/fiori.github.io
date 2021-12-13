/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)
        (c) Copyright 2009-2021 SAP SE. All rights reserved
    
 */
sap.ui.define(
	[
		"sap/fe/macros/ResourceModel",
		"sap/fe/macros/CommonHelper",
		"sap/fe/core/CommonUtils",
		"sap/ui/model/odata/v4/AnnotationHelper",
		"sap/ui/base/ManagedObject",
		"sap/base/Log",
		"sap/ui/model/json/JSONModel",
		"sap/fe/core/helpers/StableIdHelper",
		"sap/fe/macros/internal/valuehelp/ValueListHelper",
		"sap/fe/core/templating/UIFormatters",
		"sap/fe/core/helpers/BindingExpression"
	],
	function(
		ResourceModel,
		CommonHelper,
		CommonUtils,
		AnnotationHelper,
		ManagedObject,
		Log,
		JSONModel,
		StableIdHelper,
		ValueListHelper,
		UIFormatters,
		BindingExpression
	) {
		"use strict";
		var ISOCurrency = "@Org.OData.Measures.V1.ISOCurrency",
			Unit = "@Org.OData.Measures.V1.Unit";

		/**
		 * What does the map look like?
		 *    {
		 *  	'namespace.of.entityType' : [
		 * 			[namespace.of.entityType1#Qualifier,namespace.of.entityType2#Qualifier], --> Search For: mappingSourceEntities
		 * 			{
		 * 				'property' : [namespace.of.entityType3#Qualifier,namespace.of.entityType4#Qualifier] --> Search For: mappingSourceProperties
		 * 			}
		 * 	}.
		 *
		 * @param {object} oInterface Interface instance
		 * @returns {Promise} Promise resolved when the map is ready and provides the map
		 */
		function _generateSideEffectsMap(oInterface) {
			var oMetaModel = oInterface.getModel(),
				oFieldSettings = oInterface.getSetting("sap.fe.macros.internal.Field"),
				oSideEffects = oFieldSettings.sideEffects;

			// Generate map once
			if (oSideEffects) {
				return Promise.resolve(oSideEffects);
			}

			oSideEffects = {};
			return oMetaModel.requestObject("/$").then(function(oEverything) {
				var // just get the entity types
					fnFilterEntityTypes = function(sKey) {
						return oEverything[sKey]["$kind"] === "EntityType";
					},
					// map each side effect
					fnMapSideEffect = function(sEntityType, sSideEffectAnnotation, oSideEffectAnnotation) {
						var sQualifier =
								(sSideEffectAnnotation.indexOf("#") > -1 &&
									sSideEffectAnnotation.substr(sSideEffectAnnotation.indexOf("#"))) ||
								"",
							aSourceProperties = oSideEffectAnnotation.SourceProperties || [],
							aSourceEntities = oSideEffectAnnotation.SourceEntities || [],
							// for each source property, source entity, there could be a oMetaModel.requestObject(...) to get the target entity type of the navigation involved
							aPromises = [];
						aSourceProperties.forEach(function(oSourceProperty) {
							var sPath = oSourceProperty["$PropertyPath"],
								// if the property path has a navigation, get the target entity type of the navigation
								sNavigationPath =
									sPath.indexOf("/") > 0
										? "/" + sEntityType + "/" + sPath.substr(0, sPath.lastIndexOf("/") + 1) + "@sapui.name"
										: false,
								pOwnerEntity = !sNavigationPath ? Promise.resolve(sEntityType) : oMetaModel.requestObject(sNavigationPath);

							sPath = sNavigationPath ? sPath.substr(sPath.lastIndexOf("/") + 1) : sPath;

							aPromises.push(
								pOwnerEntity.then(function(sOwnerEntityType) {
									oSideEffects[sOwnerEntityType] = oSideEffects[sOwnerEntityType] || [[], {}];
									oSideEffects[sOwnerEntityType][1][sPath] = oSideEffects[sOwnerEntityType][1][sPath] || [];
									// if there is only one source property, side effect request is required immediately
									oSideEffects[sOwnerEntityType][1][sPath].push(
										sEntityType + sQualifier + ((aSourceProperties.length === 1 && "$$ImmediateRequest") || "")
									); // --> mappingSourceProperties
								})
							);
						});
						aSourceEntities.forEach(function(oSourceEntity) {
							var sNavigationPath = oSourceEntity["$NavigationPropertyPath"],
								pOwnerEntity;
							// Source entities will have an empty path, meaning same as the target entity type of the side effect annotation
							// or will always have navigation, get target entity for this navigation path
							if (sNavigationPath === "") {
								pOwnerEntity = Promise.resolve(sEntityType);
							} else {
								pOwnerEntity = oMetaModel.requestObject("/" + sEntityType + "/" + sNavigationPath + "/@sapui.name");
							}
							aPromises.push(
								pOwnerEntity.then(function(sOwnerEntityType) {
									oSideEffects[sOwnerEntityType] = oSideEffects[sOwnerEntityType] || [[], {}];
									// side effects for fields referenced via source entities must always be requested immediately
									oSideEffects[sOwnerEntityType][0].push(sEntityType + sQualifier + "$$ImmediateRequest"); // --> mappingSourceEntities
								})
							);
						});
						// returned promise is resolved when all the source properties and source entities of the side effect have been mapped
						return Promise.all(aPromises);
					},
					// map each entity type which has side effects annotated
					fnMapEntityType = function(sEntityType) {
						return oMetaModel.requestObject("/" + sEntityType + "@").then(function(oAnnotations) {
							var aSideEffects = Object.keys(oAnnotations)
								.filter(function(sAnnotation) {
									return sAnnotation.indexOf("@com.sap.vocabularies.Common.v1.SideEffects") > -1;
								})
								.map(function(sSideEffectAnnotation) {
									return fnMapSideEffect(sEntityType, sSideEffectAnnotation, oAnnotations[sSideEffectAnnotation]);
								});
							// returned promise is resolved when all the side effects annotated on this entity type have been mapped
							return Promise.all(aSideEffects);
						});
					};
				// get everything --> filter the entity types which have side effects annotated --> map each side effect --> then return the map
				// returned promise is resolved when the map is ready
				return Promise.all(
					Object.keys(oEverything)
						.filter(fnFilterEntityTypes)
						.map(fnMapEntityType)
				).then(function() {
					oFieldSettings.sideEffects = oSideEffects;
					return oSideEffects;
				});
			});
		}

		/**
		 * Helper class used by MDC controls for OData(V4) specific handling
		 *
		 * @private
		 * @experimental This module is only for internal/experimental use!
		 */
		var FieldHelper = {
			/**
			 * Determine how to show the value by analyzing Text and TextArrangement Annotations.
			 *
			 * @function
			 * @name sap.fe.macros.field.FieldHelper#displayMode
			 * @memberof sap.fe.macros.field.FieldHelper
			 * @static
			 * @param {object} oPropertyAnnotations The Property annotations
			 * @param {object} oCollectionAnnotations The EntityType annotations
			 * @returns {string} The display mode of the field
			 * @private
			 * @ui5-restricted
			 **/
			displayMode: function(oPropertyAnnotations, oCollectionAnnotations) {
				var oTextAnnotation = oPropertyAnnotations["@com.sap.vocabularies.Common.v1.Text"],
					oTextArrangementAnnotation =
						oTextAnnotation &&
						((oPropertyAnnotations &&
							oPropertyAnnotations["@com.sap.vocabularies.Common.v1.Text@com.sap.vocabularies.UI.v1.TextArrangement"]) ||
							(oCollectionAnnotations && oCollectionAnnotations["@com.sap.vocabularies.UI.v1.TextArrangement"]));

				if (oTextArrangementAnnotation) {
					if (oTextArrangementAnnotation.$EnumMember === "com.sap.vocabularies.UI.v1.TextArrangementType/TextOnly") {
						return "Description";
					} else if (oTextArrangementAnnotation.$EnumMember === "com.sap.vocabularies.UI.v1.TextArrangementType/TextLast") {
						return "ValueDescription";
					}
					//Default should be TextFirst if there is a Text annotation and neither TextOnly nor TextLast are set
					return "DescriptionValue";
				}
				return oTextAnnotation ? "DescriptionValue" : "Value";
			},
			buildExpressionForTextValue: function(sPropertyPath, oDataField) {
				var oMetaModel = oDataField.context.getModel(),
					sPath = oDataField.context.getPath(),
					oTextAnnotationContext = oMetaModel.createBindingContext(sPath + "@com.sap.vocabularies.Common.v1.Text"),
					oTextAnnotation = oTextAnnotationContext.getProperty(),
					sTextExpression = oTextAnnotation
						? AnnotationHelper.value(oTextAnnotation, { context: oTextAnnotationContext })
						: undefined,
					sExpression = "",
					sPropertyPath = AnnotationHelper.getNavigationPath(sPropertyPath);
				if (sPropertyPath.indexOf("/") > -1 && sTextExpression) {
					sExpression = sPropertyPath.replace(/[^\/]*$/, sTextExpression.substr(1, sTextExpression.length - 2));
				} else {
					sExpression = sTextExpression;
				}
				if (sExpression) {
					sExpression =
						"{ path : '" + sExpression.replace(/^\{+/g, "").replace(/\}+$/g, "") + "', parameters: {'$$noPatch': true}}";
				}
				return sExpression;
			},

			buildTargetPathFromDataModelObjectPath: function(oDataModelObjectPath) {
				var sSartEntitySet = oDataModelObjectPath.startingEntitySet.name;
				var sPath = "/" + sSartEntitySet;
				var aNavigationProperties = oDataModelObjectPath.navigationProperties;
				for (var i = 0; i < aNavigationProperties.length; i++) {
					sPath += "/" + aNavigationProperties[i].name;
				}
				return sPath;
			},
			hasSemanticObjectTargets: function(
				sSemanticObject,
				aSemanticObjectUnavailableActions,
				oProperty,
				oPropertyDataModelObjectPath
			) {
				var sPropertyLocationPath = FieldHelper.buildTargetPathFromDataModelObjectPath(oPropertyDataModelObjectPath);
				var sPropertyPath = sPropertyLocationPath + "/" + oProperty.path;
				var sBindingExpression;
				if (!!(sSemanticObject && sSemanticObject.$Path)) {
					sBindingExpression = BindingExpression.compileBinding(BindingExpression.bindingExpression(sSemanticObject.$Path));
				}
				if (sPropertyPath && sSemanticObject && (sSemanticObject.length > 0 || sBindingExpression)) {
					var sAlternatePath = sPropertyPath.replace(/\//g, "_"); //replaceAll("/","_");
					if (!sBindingExpression) {
						var sBindingPath =
							"pageInternal>semanticsTargets/" +
							sSemanticObject +
							"/" +
							sAlternatePath +
							(!aSemanticObjectUnavailableActions ? "/HasTargetsNotFiltered" : "/HasTargets");
						return "{parts:[{path:'" + sBindingPath + "'}], formatter:'FieldRuntime.hasTargets'}";
					} else {
						// Semantic Object Name is a path
						return undefined;
					}
				} else {
					return false;
				}
			},
			isNotAlwaysHidden: function(oDataField, oDetails) {
				var oContext = oDetails.context,
					isAlwaysHidden = false;
				if (oDataField.Value && oDataField.Value.$Path) {
					isAlwaysHidden = oContext.getObject("Value/$Path@com.sap.vocabularies.UI.v1.Hidden");
				}
				if (!isAlwaysHidden || isAlwaysHidden.$Path) {
					isAlwaysHidden = oContext.getObject("@com.sap.vocabularies.UI.v1.Hidden");
					if (!isAlwaysHidden || isAlwaysHidden.$Path) {
						isAlwaysHidden = false;
					}
				}
				return !isAlwaysHidden;
			},

			getRequiredForDataField: function(oFieldControl, sEditMode, sPropertyFieldControl) {
				var sEditExpression;
				if (!oFieldControl) {
					oFieldControl = sPropertyFieldControl;
				}
				if (sEditMode === "Display" || sEditMode === "ReadOnly" || sEditMode === "Disabled") {
					return false;
				}
				//sEditMode returns Binding in few cases hence resolving the binding
				if (oFieldControl && sEditMode) {
					// If the editMode we received was not a static value we only want to check
					// compared to the page editMode and not to the actually mode for the field (so not including fieldcontrol and the likes)
					if (sEditMode.startsWith("{")) {
						sEditMode = "{ui>/editMode}";
					}
					if (sEditMode.indexOf("{") > -1) {
						sEditExpression = "%" + sEditMode + " === 'Editable'";
					}
					if (oFieldControl.indexOf("{") > -1) {
						var sExpression = "%" + oFieldControl + " === 7";
						return sEditMode === "Editable" ? "{=" + sExpression + "}" : "{= " + sExpression + " && " + sEditExpression + "}";
					} else {
						return sEditMode === "Editable"
							? oFieldControl == "com.sap.vocabularies.Common.v1.FieldControlType/Mandatory"
							: oFieldControl == "com.sap.vocabularies.Common.v1.FieldControlType/Mandatory" && "{= " + sEditExpression + "}";
					}
				}
				return false;
			},
			isRequired: function(oFieldControl, sEditMode) {
				if (sEditMode === "Display" || sEditMode === "ReadOnly" || sEditMode === "Disabled") {
					return false;
				}
				if (oFieldControl) {
					if (ManagedObject.bindingParser(oFieldControl)) {
						var sExpression = "{= %" + oFieldControl + " === 7}";
						return sExpression;
					} else {
						return oFieldControl == "com.sap.vocabularies.Common.v1.FieldControlType/Mandatory";
					}
				}
				return false;
			},

			_getDraftAdministrativeDataType: function(oMetaModel, sEntityType) {
				return oMetaModel.requestObject("/" + sEntityType + "/DraftAdministrativeData/");
			},

			getBindingForDraftAdminBlockInline: function(iContext, sEntityType) {
				return FieldHelper._getDraftAdministrativeDataType(iContext.getModel(), sEntityType).then(function(oDADEntityType) {
					var aBindings = [];

					if (oDADEntityType.InProcessByUserDescription) {
						aBindings.push("${DraftAdministrativeData/InProcessByUserDescription}");
					}

					aBindings.push("${DraftAdministrativeData/InProcessByUser}");

					if (oDADEntityType.LastChangedByUserDescription) {
						aBindings.push("${DraftAdministrativeData/LastChangedByUserDescription}");
					}

					aBindings.push("${DraftAdministrativeData/LastChangedByUser}");

					return "{= %{HasDraftEntity} ? (" + aBindings.join(" || ") + ") : '' }";
				});
			},

			/**
			 * Computed annotation that returns vProperty for a string and @sapui.name for an object.
			 *
			 * @param {*} vProperty The property
			 * @param {object} oInterface The interface instance
			 * @returns {string} The property name
			 */
			propertyName: function(vProperty, oInterface) {
				var sPropertyName;
				if (typeof vProperty === "string") {
					if (oInterface.context.getPath().indexOf("$Path") > -1 || oInterface.context.getPath().indexOf("$PropertyPath") > -1) {
						// We could end up with a pure string property (no $Path), and this is not a real property in that case
						sPropertyName = vProperty;
					}
				} else if (vProperty.$Path || vProperty.$PropertyPath) {
					var sPath = vProperty.$Path ? "/$Path" : "/$PropertyPath";
					var sContextPath = oInterface.context.getPath();
					sPropertyName = oInterface.context.getObject(sContextPath + sPath + "/$@sapui.name");
				} else if (vProperty.Value && vProperty.Value.$Path) {
					sPropertyName = vProperty.Value.$Path;
				} else {
					sPropertyName = oInterface.context.getObject("@sapui.name");
				}

				return sPropertyName;
			},

			/**
			 * This method getFieldGroupIDs uses a map stored in preprocessing data for the macro Field
			 * _generateSideEffectsMap generates this map once during templating for the first macro field
			 * and then reuses it. Map exists only during templating.
			 * The map is used to set the field group IDs for the macro field.
			 * A field group ID has the format -- namespace.of.entityType#Qualifier
			 * where 'namespace.of.entityType' is the target entity type of the side effect annotation
			 * and 'Qualifier' is the qualififer of the side effect annotation.
			 * This information is enough to identify the side effect annotation.
			 *
			 * @param {object} oContext Context instance
			 * @param {string} sPropertyPath Property path
			 * @returns {Promise<number>|undefined} A promise which provides a string of field group IDs separated by a comma
			 */
			getFieldGroupIds: function(oContext, sPropertyPath) {
				if (!sPropertyPath) {
					return undefined;
				}
				var oInterface = oContext.getInterface(0);
				// generate the mapping for side effects or get the generated map if it is already generated
				return _generateSideEffectsMap(oInterface).then(function(oSideEffects) {
					var sPath = sPropertyPath,
						sOwnerEntityType = oContext.getPath(1).substr(1),
						bIsNavigationPath = sPath.indexOf("/") > 0,
						aFieldGroupIds,
						sFieldGroupIds;
					sPath = bIsNavigationPath ? sPath.substr(sPath.lastIndexOf("/") + 1) : sPath;
					// add to fieldGroupIds, all side effects which mention sPath as source property or sOwnerEntityType as source entity
					aFieldGroupIds =
						(oSideEffects[sOwnerEntityType] &&
							oSideEffects[sOwnerEntityType][0].concat(oSideEffects[sOwnerEntityType][1][sPath] || [])) ||
						[];
					if (aFieldGroupIds.length) {
						sFieldGroupIds = aFieldGroupIds.reduce(function(sResult, sId) {
							return (sResult && sResult + "," + sId) || sId;
						});
					}
					return sFieldGroupIds; //"ID1,ID2,ID3..."
				});
			},
			fieldControl: function(sPropertyPath, oInterface) {
				var oModel = oInterface && oInterface.context.getModel();
				var sPath = oInterface && oInterface.context.getPath();
				var oFieldControlContext = oModel && oModel.createBindingContext(sPath + "@com.sap.vocabularies.Common.v1.FieldControl");
				var oFieldControl = oFieldControlContext && oFieldControlContext.getProperty();
				if (oFieldControl) {
					if (oFieldControl.hasOwnProperty("$EnumMember")) {
						return oFieldControl.$EnumMember;
					} else if (oFieldControl.hasOwnProperty("$Path")) {
						return AnnotationHelper.value(oFieldControl, { context: oFieldControlContext });
					}
				} else {
					return undefined;
				}
			},
			/**
			 * Method to get the navigation entity(the entity where should i look for the available quick view facets)
			 *    -Loop over all navigation property
			 *    -Look into ReferentialConstraint constraint
			 *    -If ReferentialConstraint.Property = property(Semantic Object) ==> success QuickView Facets from this entity type can be retrieved
			 * @function
			 * @name getNavigationEntity
			 * @memberof sap.fe.macros.field.FieldHelper.js
			 * @param {object} oProperty property object on which semantic object is configured
			 * @param {object} oContext Metadata Context(Not passed when called with template:with)
			 * @returns {string|undefined} - if called with context then navigation entity relative binding like "{supplier}" is returned
			 *    else context path for navigation entity for templating is returned  e.g “/Products/$Type/supplier”
			 *  where Products - Parent entity, supplier - Navigation entity name
			 */

			getNavigationEntity: function(oProperty, oContext) {
				var oContextObject = (oContext && oContext.context) || oProperty,
					//Get the entity type path ex. /Products/$Type from /Products/$Type@com.sap.vocabularies.UI.v1.HeaderInfo/Description/Value...
					sNavigationPath = AnnotationHelper.getNavigationPath(oContextObject.getPath()) + "/",
					sPropertyPath = oContextObject.getObject().$Path,
					sNavigationPart = "",
					sPropertyName = sPropertyPath.split("/").pop();

				if (sPropertyPath.indexOf("/") > -1) {
					// Navigation property detected.
					sNavigationPart = sPropertyPath.substring(0, sPropertyPath.lastIndexOf("/")) + "/";
					sNavigationPath += sNavigationPart;
				}

				//Get the entity set object
				var oEntitySet = oContextObject.getObject(sNavigationPath),
					//Get the navigation entity details
					aKeys = Object.keys(oEntitySet),
					length = aKeys.length,
					index = 0;

				for (; index < length; index++) {
					if (
						oEntitySet[aKeys[index]].$kind === "NavigationProperty" &&
						oEntitySet[aKeys[index]].$ReferentialConstraint &&
						oEntitySet[aKeys[index]].$ReferentialConstraint.hasOwnProperty(sPropertyName)
					) {
						return oContext
							? AnnotationHelper.getNavigationBinding(sNavigationPart + aKeys[index])
							: sNavigationPath + aKeys[index];
					}
				}
			},

			/**
			 * Method to get the valuehelp property from a DataField or a PropertyPath(in case of SeclectionField)
			 * Priority form where to get the field property value(example: "Name" or "Supplier"):
			 * 1. If oPropertyContext.getObject() has key '$Path', then we take the value at '$Path'.
			 * 2. Else, value at oPropertyContext.getObject().
			 * In case, there exists ISOCurrency or Unit annotations for the field property, then Path at the ISOCurrency
			 * or Unit annotations of the field property is considered.
			 *
			 * @memberof sap.fe.macros.field.FieldHelper.js
			 * @param {object} oPropertyContext The context from which valuehelp property need to be extracted.
			 * @param {boolean} bInFilterField Whether or not we're in the filter field and should ignore
			 * @returns {string}
			 */
			valueHelpProperty: function(oPropertyContext, bInFilterField) {
				/* For currency (and later Unit) we need to forward the value help to the annotated field */
				var sContextPath = oPropertyContext.getPath(),
					oContent = oPropertyContext.getObject() || {},
					sPath = oContent.$Path ? sContextPath + "/$Path" : sContextPath,
					sAnnoPath = sPath + "@",
					oPropertyAnnotations = oPropertyContext.getObject(sAnnoPath),
					sAnnotation;
				if (oPropertyAnnotations) {
					sAnnotation =
						(oPropertyAnnotations.hasOwnProperty(ISOCurrency) && ISOCurrency) ||
						(oPropertyAnnotations.hasOwnProperty(Unit) && Unit);
					if (sAnnotation && !bInFilterField) {
						var sUnitOrCurrencyPath = sPath + sAnnotation + "/$Path";
						// we check that the currency or unit is a Property and not a fixed value
						if (oPropertyContext.getObject(sUnitOrCurrencyPath)) {
							sPath = sUnitOrCurrencyPath;
						}
					}
				}
				return sPath;
			},

			/**
			 * Dedicated method to avoid looking for unit properties.
			 *
			 * @param oPropertyContext
			 * @returns {string}
			 */
			valueHelpPropertyForFilterField: function(oPropertyContext) {
				return FieldHelper.valueHelpProperty(oPropertyContext, true);
			},

			/**
			 * Method to generate the ID for Value Help.
			 *
			 * @function
			 * @name getIDForFieldValueHelp
			 * @memberof sap.fe.macros.field.FieldHelper.js
			 * @param {string} sFlexId Flex ID of the current object
			 * @param {string} sIdPrefix Prefix for the ValueHelp ID
			 * @param {string} sOriginalPropertyName Name of the property
			 * @param {string} sPropertyName Name of the ValueHelp Property
			 * @returns {string} The ID generated for the ValueHelp
			 */
			getIDForFieldValueHelp: function(sFlexId, sIdPrefix, sOriginalPropertyName, sPropertyName) {
				if (sFlexId) {
					return sFlexId;
				}
				var sProperty = sPropertyName;
				if (sOriginalPropertyName !== sPropertyName) {
					sProperty = sOriginalPropertyName + "::" + sPropertyName;
				}
				return StableIdHelper.generate([sIdPrefix, sProperty]);
			},

			/**
			 * Method to get the fieldHelp property of the Filter Field.
			 *
			 * @function
			 * @name getFieldHelpPropertyForFilterField
			 * @memberof sap.fe.macros.field.FieldHelper.js
			 * @param {string} sPropertyType The $Type of the property
			 * @param {string} sVhIdPrefix ID Prefix of the value help
			 * @param {string} sPropertyName Property Name
			 * @param {string} sValueHelpPropertyName Value help property name
			 * @param {boolean} bHasValueListWithFixedValues `true` if there is a value list with fixed value annotation
			 * @returns {string} The field help property of Value Help
			 */
			getFieldHelpPropertyForFilterField: function(
				sPropertyType,
				sVhIdPrefix,
				sPropertyName,
				sValueHelpPropertyName,
				bHasValueListWithFixedValues
			) {
				if (sPropertyType === "Edm.Boolean" && !bHasValueListWithFixedValues) {
					return undefined;
				}
				return FieldHelper.getIDForFieldValueHelp(
					null,
					sVhIdPrefix || "FilterFieldValueHelp",
					sPropertyName,
					sValueHelpPropertyName
				);
			},
			/**
			 * Method to get semantic key title
			 * @function
			 * @name getSemanticKeyTitle
			 * @memberof sap.fe.macros.field.FieldHelper.js
			 * @param {string} sPropertyTextValue String containing the binding of text associated to the property
			 * @param {string} sPropertyValue String containing the binding of a property
			 * @param {string} sDataField String containing the name of a data field
			 * @param {object} oTextArrangement Object containing the text arrangement
			 * @param {string} sSemanticKeyStyle enum containing the style of the semantic key
			 * @param {object} oDraftRoot Draft root object
			 * @returns {string} - Binding that resolves to the title of the semantic key
			 */

			getSemanticKeyTitle: function(sPropertyTextValue, sPropertyValue, sDataField, oTextArrangement, sSemanticKeyStyle, oDraftRoot) {
				var sNewObject = ResourceModel.getText("T_NEW_OBJECT");
				var sUnnamedObject = ResourceModel.getText("T_ANNOTATION_HELPER_DEFAULT_OBJECT_PAGE_HEADER_TITLE_NO_HEADER_INFO");
				var sNewObjectExpression, sUnnnamedObjectExpression;
				var sSemanticKeyTitleExpression;
				var addNewObjectUnNamedObjectExpression = function(sValue) {
					sNewObjectExpression =
						"($" +
						sValue +
						" === '' || $" +
						sValue +
						" === undefined || $" +
						sValue +
						" === null ? '" +
						sNewObject +
						"': $" +
						sValue +
						")";
					sUnnnamedObjectExpression =
						"($" +
						sValue +
						" === '' || $" +
						sValue +
						" === undefined || $" +
						sValue +
						" === null ? '" +
						sUnnamedObject +
						"': $" +
						sValue +
						")";
					return (
						"(!%{IsActiveEntity} ? !%{HasActiveEntity} ? " +
						sNewObjectExpression +
						" : " +
						sUnnnamedObjectExpression +
						" : " +
						sUnnnamedObjectExpression +
						")"
					);
				};
				var buildExpressionForSemantickKeyTitle = function(sValue, bIsExpressionBinding) {
					var sExpression;
					if (oDraftRoot) {
						//check if it is draft root so that we can add NewObject and UnnamedObject feature
						sExpression = addNewObjectUnNamedObjectExpression(sValue);
						return bIsExpressionBinding ? "{= " + sExpression + "}" : sExpression;
					} else {
						return bIsExpressionBinding ? sValue : "$" + sValue;
					}
				};

				if (sPropertyTextValue) {
					// check for text association
					if (oTextArrangement && sSemanticKeyStyle !== "ObjectIdentifier") {
						// check if text arrangement is present and table type is GridTable
						var sTextArrangement = oTextArrangement.$EnumMember;
						if (sTextArrangement === "com.sap.vocabularies.UI.v1.TextArrangementType/TextFirst") {
							// Eg: English (EN)
							sSemanticKeyTitleExpression = buildExpressionForSemantickKeyTitle(sPropertyTextValue, false);
							return (
								"{= " +
								sSemanticKeyTitleExpression +
								" +' (' + " +
								"($" +
								sPropertyValue +
								(sDataField ? " || ${" + sDataField + "}" : "") +
								") +')' }"
							);
						} else if (sTextArrangement === "com.sap.vocabularies.UI.v1.TextArrangementType/TextLast") {
							// Eg: EN (English)
							sSemanticKeyTitleExpression = buildExpressionForSemantickKeyTitle(sPropertyTextValue, false);
							return (
								"{= ($" +
								sPropertyValue +
								(sDataField ? " || ${" + sDataField + "}" : "") +
								")" +
								" + ' (' + " +
								sSemanticKeyTitleExpression +
								" +')' }"
							);
						} else {
							// for a Grid table when text is available and text arrangement is TextOnly or TextSeperate or no text arrangement then we return Text
							return buildExpressionForSemantickKeyTitle(sPropertyTextValue, true);
						}
					} else {
						return buildExpressionForSemantickKeyTitle(sPropertyTextValue, true);
					}
				} else {
					// if there is no text association then we return the property value
					return buildExpressionForSemantickKeyTitle(sPropertyValue, true);
				}
			},

			getObjectIdentifierText: function(oTextAnnotation, oTextArrangementAnnotation, sPropertyValueBinding, sDataFieldName) {
				if (oTextAnnotation) {
					// There is a text annotation. In this case, the ObjectIdentifier shows:
					//  - the *text* as the ObjectIdentifier's title
					//  - the *value* as the ObjectIdentifier's text
					//
					// So if the TextArrangement is #TextOnly or #TextSeparate, do not set the ObjectIdentifier's text
					// property
					if (
						oTextArrangementAnnotation &&
						(oTextArrangementAnnotation.$EnumMember === "com.sap.vocabularies.UI.v1.TextArrangementType/TextOnly" ||
							oTextArrangementAnnotation.$EnumMember === "com.sap.vocabularies.UI.v1.TextArrangementType/TextSeparate")
					) {
						return undefined;
					} else {
						return sPropertyValueBinding || "{" + sDataFieldName + "}";
					}
				}

				// no text annotation: the property value is part of the ObjectIdentifier's title already
				return undefined;
			},

			getSemanticObjectsList: function(propertyAnnotations) {
				// look for annotations SemanticObject with and without qualifier
				// returns : list of SemanticObjects
				var annotations = propertyAnnotations;
				var aSemanticObjects = [];
				for (var key in annotations.getObject()) {
					// var qualifier;
					if (
						key.indexOf("com.sap.vocabularies.Common.v1.SemanticObject") > -1 &&
						key.indexOf("com.sap.vocabularies.Common.v1.SemanticObjectMapping") === -1 &&
						key.indexOf("com.sap.vocabularies.Common.v1.SemanticObjectUnavailableActions") === -1
					) {
						var semanticObjectValue = annotations.getObject()[key];
						if (typeof semanticObjectValue === "object") {
							semanticObjectValue = AnnotationHelper.value(semanticObjectValue, { context: propertyAnnotations });
						}
						if (aSemanticObjects.indexOf(semanticObjectValue) === -1) {
							aSemanticObjects.push(semanticObjectValue);
						}
					}
				}
				var oSemanticObjectsModel = new JSONModel(aSemanticObjects);
				oSemanticObjectsModel.$$valueAsPromise = true;
				return oSemanticObjectsModel.createBindingContext("/");
			},
			getSemanticObjectsQualifiers: function(propertyAnnotations) {
				// look for annotations SemanticObject, SemanticObjectUnavailableActions, SemanticObjectMapping
				// returns : list of qualifiers (array of objects with qualifiers : {qualifier, SemanticObject, SemanticObjectUnavailableActions, SemanticObjectMapping for this qualifier}
				var annotations = propertyAnnotations;
				var qualifiersAnnotations = [];
				var findObject = function(qualifier) {
					return qualifiersAnnotations.find(function(object) {
						return object.qualifier === qualifier;
					});
				};
				for (var key in annotations.getObject()) {
					// var qualifier;
					if (
						key.indexOf("com.sap.vocabularies.Common.v1.SemanticObject#") > -1 ||
						key.indexOf("com.sap.vocabularies.Common.v1.SemanticObjectMapping#") > -1 ||
						key.indexOf("com.sap.vocabularies.Common.v1.SemanticObjectUnavailableActions#") > -1
					) {
						var annotationContent = annotations.getObject()[key],
							annotation = key.split("#")[0],
							qualifier = key.split("#")[1],
							qualifierObject = findObject(qualifier);

						if (!qualifierObject) {
							qualifierObject = {
								qualifier: qualifier
							};
							qualifierObject[annotation] = annotationContent;
							qualifiersAnnotations.push(qualifierObject);
						} else {
							qualifierObject[annotation] = annotationContent;
						}
					}
				}
				qualifiersAnnotations = qualifiersAnnotations.filter(function(oQualifier) {
					return !!oQualifier["@com.sap.vocabularies.Common.v1.SemanticObject"];
				});
				var oQualifiersModel = new JSONModel(qualifiersAnnotations);
				oQualifiersModel.$$valueAsPromise = true;
				return oQualifiersModel.createBindingContext("/");
			},
			// returns array of semanticObjects including main and additional, with their mapping and unavailable Actions
			getSemanticObjectsWithAnnotations: function(propertyAnnotations) {
				// look for annotations SemanticObject, SemanticObjectUnavailableActions, SemanticObjectMapping
				// returns : list of qualifiers (array of objects with qualifiers : {qualifier, SemanticObject, SemanticObjectUnavailableActions, SemanticObjectMapping for this qualifier}
				var annotations = propertyAnnotations;
				var semanticObjectList = [];
				var findObject = function(qualifier) {
					return semanticObjectList.find(function(object) {
						return object.qualifier === qualifier;
					});
				};
				for (var key in annotations.getObject()) {
					// var qualifier;
					if (
						key.indexOf("com.sap.vocabularies.Common.v1.SemanticObject") > -1 ||
						key.indexOf("com.sap.vocabularies.Common.v1.SemanticObjectMapping") > -1 ||
						key.indexOf("com.sap.vocabularies.Common.v1.SemanticObjectUnavailableActions") > -1
					) {
						if (key.indexOf("#") > -1) {
							var annotationContent = annotations.getObject()[key],
								annotation = key.split("#")[0],
								qualifier = key.split("#")[1],
								listItem = findObject(qualifier);
							if (key === "@com.sap.vocabularies.Common.v1.SemanticObject" && typeof annotationContent === "object") {
								annotationContent = AnnotationHelper.value(annotationContent[0], { context: propertyAnnotations });
							}
							if (!listItem) {
								listItem = {
									qualifier: qualifier
								};
								listItem[annotation] = annotationContent;
								semanticObjectList.push(listItem);
							} else {
								listItem[annotation] = annotationContent;
							}
						} else {
							var annotationContent = annotations.getObject()[key],
								annotation,
								qualifier;
							if (key.indexOf("com.sap.vocabularies.Common.v1.SemanticObjectMapping") > -1) {
								annotation = "@com.sap.vocabularies.Common.v1.SemanticObjectMapping";
							} else if (key.indexOf("com.sap.vocabularies.Common.v1.SemanticObjectUnavailableActions") > -1) {
								annotation = "@com.sap.vocabularies.Common.v1.SemanticObjectUnavailableActions";
							} else if (key.indexOf("com.sap.vocabularies.Common.v1.SemanticObject") > -1) {
								annotation = "@com.sap.vocabularies.Common.v1.SemanticObject";
							}
							var listItem = findObject("main");
							if (key === "@com.sap.vocabularies.Common.v1.SemanticObject" && typeof annotationContent === "object") {
								annotationContent = AnnotationHelper.value(annotationContent, { context: propertyAnnotations });
							}
							if (!listItem) {
								listItem = {
									qualifier: "main"
								};
								listItem[annotation] = annotationContent;
								semanticObjectList.push(listItem);
							} else {
								listItem[annotation] = annotationContent;
							}
						}
					}
				}
				// filter if no semanticObject was defined
				semanticObjectList = semanticObjectList.filter(function(oQualifier) {
					return !!oQualifier["@com.sap.vocabularies.Common.v1.SemanticObject"];
				});
				var oSemanticObjectsModel = new JSONModel(semanticObjectList);
				oSemanticObjectsModel.$$valueAsPromise = true;
				return oSemanticObjectsModel.createBindingContext("/");
			},
			hasSemanticObjectsWithPath: function(aSemanticObjects, oThis) {
				var bSemanticObjectHasAPath = false;
				for (var i = 0; i < aSemanticObjects.length; i++) {
					if (aSemanticObjects[i] && aSemanticObjects[i].value && aSemanticObjects[i].value.indexOf("{") === 0) {
						bSemanticObjectHasAPath = true;
						break;
					}
				}
				return bSemanticObjectHasAPath;
			},
			// returns the list of parameters to pass to the Link delegates
			computeLinkParameters: function(
				delegateName,
				entityType,
				semanticObjectsList,
				semanticObjectsWithAnnotations,
				dataField,
				contact,
				mainSemanticObject,
				navigationPath,
				propertyPathLabel,
				customSemanticObject
			) {
				if (!!customSemanticObject) {
					// the custom semantic objects are either a single string/key to custom data or a stringified array
					if (!(customSemanticObject[0] === "[")) {
						// customSemanticObject = "semanticObject" | "{bindingExpression}"
						semanticObjectsList.push(customSemanticObject);
					} else {
						// customSemanticObject = '["semanticObject1","semanticObject2"]'
						JSON.parse(customSemanticObject).forEach(function(semanticObject) {
							semanticObjectsList.push(semanticObject);
						});
					}
					if (semanticObjectsWithAnnotations && semanticObjectsWithAnnotations.length == 0) {
						semanticObjectsWithAnnotations = undefined;
					}
				}

				return Promise.resolve().then(function(aValues) {
					var semanticObjectMappings = [],
						semanticObjectUnavailableActions = [];
					var sResolveMainSemanticObject =
						semanticObjectsWithAnnotations &&
						semanticObjectsWithAnnotations.filter(function(annotation) {
							return annotation.qualifier === "main";
						})[0]["@com.sap.vocabularies.Common.v1.SemanticObject"];
					if (semanticObjectsWithAnnotations) {
						semanticObjectsWithAnnotations.forEach(function(semObject) {
							if (semObject["@com.sap.vocabularies.Common.v1.SemanticObjectUnavailableActions"]) {
								var unAvailableAction = {
									semanticObject: semObject["@com.sap.vocabularies.Common.v1.SemanticObject"],
									actions: semObject["@com.sap.vocabularies.Common.v1.SemanticObjectUnavailableActions"]
								};
								semanticObjectUnavailableActions.push(unAvailableAction);
							}
							if (semObject["@com.sap.vocabularies.Common.v1.SemanticObjectMapping"]) {
								var items = [];
								semObject["@com.sap.vocabularies.Common.v1.SemanticObjectMapping"].forEach(function(mappingItem) {
									items.push({
										key: mappingItem.LocalProperty.$PropertyPath,
										value: mappingItem.SemanticObjectProperty
									});
								});
								var mapping = {
									semanticObject: semObject["@com.sap.vocabularies.Common.v1.SemanticObject"],
									items: items
								};
								semanticObjectMappings.push(mapping);
							}
						});
						return JSON.stringify({
							name: delegateName,
							payload: {
								semanticObjects: semanticObjectsList,
								entityType: entityType,
								semanticObjectUnavailableActions: semanticObjectUnavailableActions,
								semanticObjectMappings: semanticObjectMappings,
								semanticPrimaryActions: [],
								mainSemanticObject: sResolveMainSemanticObject,
								propertyPathLabel: propertyPathLabel,
								dataField: dataField,
								contact: contact,
								navigationPath: navigationPath
							}
						});
					} else {
						return JSON.stringify({
							name: delegateName,
							payload: {
								semanticObjects: semanticObjectsList,
								entityType: entityType,
								semanticObjectUnavailableActions: semanticObjectUnavailableActions,
								semanticObjectMappings: semanticObjectMappings,
								semanticPrimaryActions: [],
								mainSemanticObject: sResolveMainSemanticObject,
								propertyPathLabel: propertyPathLabel,
								dataField: dataField,
								contact: contact,
								navigationPath: navigationPath
							}
						});
					}
				});
			},
			_getPrimaryIntents: function(aSemanticObjectsList) {
				var aPromises = [];
				if (aSemanticObjectsList) {
					var oUshellContainer = sap.ushell && sap.ushell.Container;
					var oService = oUshellContainer && oUshellContainer.getService("CrossApplicationNavigation");
					aSemanticObjectsList.forEach(function(semObject) {
						if (typeof semObject === "string") {
							aPromises.push(oService.getPrimaryIntent(semObject, {}));
						}
					});
				}
				return Promise.all(aPromises)
					.then(function(aSemObjectPrimaryAction) {
						return aSemObjectPrimaryAction;
					})
					.catch(function(oError) {
						Log.error("Error fetching primary intents", oError);
					});
			},
			checkPrimaryActions: function(oSemantics) {
				return new Promise(function(resolve) {
					return FieldHelper._getPrimaryIntents(oSemantics && oSemantics.semanticObjects).then(function(
						aSemanticObjectsPrimaryActions
					) {
						oSemantics.semanticPrimaryActions = aSemanticObjectsPrimaryActions;
						var oPrimaryAction =
							oSemantics.semanticObjects &&
							oSemantics.mainSemanticObject &&
							oSemantics.semanticPrimaryActions[oSemantics.semanticObjects.indexOf(oSemantics.mainSemanticObject)];
						var oUshellContainer = sap.ushell && sap.ushell.Container;
						var oXApplNavigation = oUshellContainer && oUshellContainer.getService("CrossApplicationNavigation");
						var sCurrentHash = oXApplNavigation.hrefForExternal();
						if (oSemantics.mainSemanticObject && oPrimaryAction !== null && oPrimaryAction.intent !== sCurrentHash) {
							for (var i = 0; i < oSemantics.semanticObjectUnavailableActions.length; i++) {
								if (
									oSemantics.mainSemanticObject.indexOf(oSemantics.semanticObjectUnavailableActions[i].semanticObject) ===
									0
								) {
									for (var j = 0; j < oSemantics.semanticObjectUnavailableActions[i].actions.length; j++) {
										if (
											oPrimaryAction.intent
												.split("-")[1]
												.indexOf(oSemantics.semanticObjectUnavailableActions[i].actions[j]) === 0
										) {
											resolve(false);
										}
									}
								}
							}
							resolve(true);
						} else {
							resolve(false);
						}
					});
				}).catch(function(oError) {
					Log.error("Error in checkPrimaryActions", oError);
				});
			},
			getPrimaryAction: function(oSemantics) {
				return oSemantics.semanticPrimaryActions[oSemantics.semanticObjects.indexOf(oSemantics.mainSemanticObject)].intent
					? oSemantics.semanticPrimaryActions[oSemantics.semanticObjects.indexOf(oSemantics.mainSemanticObject)].intent
					: oSemantics.primaryIntentAction;
			},
			operators: function(iContext, oProperty, bUseSemanticDateRange, sSettings) {
				if (!oProperty) {
					return undefined;
				}
				// Complete possible set of Operators for AllowedExpression Types
				var oContext = iContext
					.getInterface(0)
					.getModel(1)
					.createBindingContext(iContext.getInterface(0).getPath(1));
				var sProperty = FieldHelper.propertyName(oProperty, { context: oContext });
				var oModel = oContext.getModel(),
					sPropertyPath = oContext.getPath(),
					sPropertyLocationPath = CommonHelper.getLocationForPropertyPath(oModel, sPropertyPath),
					sType = oProperty.$Type;
				return CommonUtils.getOperatorsForProperty(
					sProperty,
					sPropertyLocationPath,
					oContext,
					sType,
					bUseSemanticDateRange,
					sSettings
				);
			},
			/**
			 * Return the property context for usage in QuickViewForm.
			 *
			 * @param {sap.ui.model.Context} oDataFieldContext Context of the data field or associated property
			 * @returns {sap.ui.model.Context} Binding context
			 */
			getPropertyContextForQuickViewForm: function(oDataFieldContext) {
				var sType = oDataFieldContext.getObject("$Type");
				if (sType === "com.sap.vocabularies.UI.v1.DataField" || sType === "com.sap.vocabularies.UI.v1.DataFieldWithUrl") {
					// Create a binding context to the property from the data field.
					var oInterface = oDataFieldContext.getInterface(),
						oModel = oInterface.getModel(),
						sPath = oInterface.getPath();
					sPath = sPath + (sPath.endsWith("/") ? "Value" : "/Value");
					return oModel.createBindingContext(sPath);
				} else {
					// It is a property. Just return the context as it is.
					return oDataFieldContext;
				}
			},
			/**
			 * Return the binding context corresponding to the property path.
			 *
			 * @param oPropertyContext Context of the property
			 * @returns {sap.ui.model.Context} Binding context
			 */
			getPropertyPathForQuickViewForm: function(oPropertyContext) {
				if (oPropertyContext && oPropertyContext.getObject("$Path")) {
					var oInterface = oPropertyContext.getInterface(),
						oModel = oInterface.getModel(),
						sPath = oInterface.getPath();
					sPath = sPath + (sPath.endsWith("/") ? "$Path" : "/$Path");
					return oModel.createBindingContext(sPath);
				}

				return oPropertyContext;
			},
			/*
			 * Method to get visible expression for DataFieldActionButton
			 * @function
			 * @name isDataFieldActionButtonVisible
			 * @param {object} oThis - Current Object
			 * @param {object} oDataField - DataPoint's Value
			 * @param {boolean} bIsBound - DataPoint action bound
			 * @param {object} oActionContext - ActionContext Value
			 * @return {boolean} - returns boolean
			 */
			isDataFieldActionButtonVisible: function(oThis, oDataField, bIsBound, oActionContext) {
				return oDataField["@com.sap.vocabularies.UI.v1.Hidden"] !== true && (bIsBound !== true || oActionContext !== false);
			},
			/**
			 * Method to get press event for DataFieldActionButton.
			 *
			 * @function
			 * @name getPressEventForDataFieldActionButton
			 * @param {object} oThis Current Object
			 * @param {object} oDataField DataPoint's Value
			 * @returns {string} The binding expression for the DataFieldActionButton press event
			 */
			getPressEventForDataFieldActionButton: function(oThis, oDataField) {
				var sInvocationGrouping = "Isolated";
				if (
					oDataField.InvocationGrouping &&
					oDataField.InvocationGrouping.$EnumMember === "com.sap.vocabularies.UI.v1.OperationGroupingType/ChangeSet"
				) {
					sInvocationGrouping = "ChangeSet";
				}
				var bIsNavigable = oThis.navigateAfterAction;
				bIsNavigable = bIsNavigable === "false" ? false : true;
				var oParams = {
					contexts: "${$source>/}.getBindingContext()",
					invocationGrouping: CommonHelper.addSingleQuotes(sInvocationGrouping),
					model: "${$source>/}.getModel()",
					label: CommonHelper.addSingleQuotes(oDataField.Label),
					isNavigable: bIsNavigable
				};

				return CommonHelper.generateFunction(
					".editFlow.invokeAction",
					CommonHelper.addSingleQuotes(oDataField.Action),
					CommonHelper.objectToString(oParams)
				);
			},

			isNumericDataType: function(sDataFieldType) {
				var _sDataFieldType = sDataFieldType;
				if (_sDataFieldType !== undefined) {
					var aNumericDataTypes = [
						"Edm.Int16",
						"Edm.Int32",
						"Edm.Int64",
						"Edm.Byte",
						"Edm.SByte",
						"Edm.Single",
						"Edm.Decimal",
						"Edm.Double"
					];
					return aNumericDataTypes.indexOf(_sDataFieldType) === -1 ? false : true;
				} else {
					return false;
				}
			},

			isDateOrTimeDataType: function(sPropertyType) {
				if (sPropertyType !== undefined) {
					var aDateTimeDataTypes = ["Edm.DateTimeOffset", "Edm.DateTime", "Edm.Date", "Edm.TimeOfDay", "Edm.Time"];
					return aDateTimeDataTypes.indexOf(sPropertyType) > -1;
				} else {
					return false;
				}
			},
			isDateTimeDataType: function(sPropertyType) {
				if (sPropertyType !== undefined) {
					var aDateDataTypes = ["Edm.DateTimeOffset", "Edm.DateTime"];
					return aDateDataTypes.indexOf(sPropertyType) > -1;
				} else {
					return false;
				}
			},
			isDateDataType: function(sPropertyType) {
				return sPropertyType === "Edm.Date";
			},
			isTimeDataType: function(sPropertyType) {
				if (sPropertyType !== undefined) {
					var aDateDataTypes = ["Edm.TimeOfDay", "Edm.Time"];
					return aDateDataTypes.indexOf(sPropertyType) > -1;
				} else {
					return false;
				}
			},

			/**
			 * Method to return the underlying property data type in case TextArrangement annotation of Text annotation 'TextOnly' exists.
			 *
			 * @param {object} oAnnotations All the annotations of a property
			 * @param {object} oModel An instance of OData v4 model
			 * @param {string} sEntityPath The path to root Entity
			 * @param {string} sType The property data type
			 * @returns {string} The underlying property data type for TextOnly annotated property, otherwise the original data type.
			 * @private
			 */
			getUnderlyingPropertyDataType: function(oAnnotations, oModel, sEntityPath, sType) {
				var sTextAnnotation = "@com.sap.vocabularies.Common.v1.Text",
					sTextArrangementAnnotation = "@com.sap.vocabularies.Common.v1.Text@com.sap.vocabularies.UI.v1.TextArrangement";
				if (
					!!oAnnotations &&
					!!oAnnotations[sTextArrangementAnnotation] &&
					oAnnotations[sTextArrangementAnnotation].$EnumMember === "com.sap.vocabularies.UI.v1.TextArrangementType/TextOnly" &&
					!!oAnnotations[sTextAnnotation] &&
					!!oAnnotations[sTextAnnotation].$Path
				) {
					return oModel.getObject(sEntityPath + "/" + oAnnotations[sTextAnnotation].$Path + "/$Type");
				}

				return sType;
			},

			getColumnAlignment: function(oDataField, oTable) {
				var sEntityPath = oTable.collection.sPath,
					oModel = oTable.collection.oModel;
				if (
					(oDataField["$Type"] === "com.sap.vocabularies.UI.v1.DataFieldForAction" ||
						oDataField["$Type"] === "com.sap.vocabularies.UI.v1.DataFieldForIntentBasedNavigation") &&
					oDataField.Inline &&
					oDataField.IconUrl
				) {
					return "Center";
				}
				// Columns containing a Semantic Key must be Begin aligned
				var aSemanticKeys = oModel.getObject(sEntityPath + "/@com.sap.vocabularies.Common.v1.SemanticKey");
				if (oDataField["$Type"] === "com.sap.vocabularies.UI.v1.DataField") {
					var sPropertyPath = oDataField.Value.$Path;
					var bIsSemanticKey =
						aSemanticKeys &&
						!aSemanticKeys.every(function(oKey) {
							return oKey.$PropertyPath !== sPropertyPath;
						});
					if (bIsSemanticKey) {
						return "Begin";
					}
				}
				return FieldHelper.getDataFieldAlignment(oDataField, oModel, sEntityPath);
			},
			/**
			 * Get alignment based only on the property.
			 * @param {string} sType The property's type
			 * @param {object} oFormatOptions The field format options
			 * @param {object} [oComputedEditMode] The computed Edit mode of the property is empty when directly called from the ColumnProperty fragment
			 * @returns {string}
			 */
			getPropertyAlignment: function(sType, oFormatOptions, oComputedEditMode) {
				var sDefaultAlignment = "Begin";
				var sTextAlignment = oFormatOptions ? oFormatOptions.textAlignMode : "";
				switch (sTextAlignment) {
					case "Form":
						if (this.isNumericDataType(sType)) {
							sDefaultAlignment = "Begin";
							if (oComputedEditMode) {
								sDefaultAlignment = UIFormatters.getAlignmentExpression(oComputedEditMode, "Begin", "End");
							}
						}
						break;
					default:
						if (this.isNumericDataType(sType) || this.isDateOrTimeDataType(sType)) {
							sDefaultAlignment = "End";
						}
						break;
				}
				return sDefaultAlignment;
			},

			getDataFieldAlignment: function(oDataField, oModel, sEntityPath, oFormatOptions, oComputedEditMode) {
				var sDataFieldPath,
					sDefaultAlignment = "Begin",
					sType,
					oAnnotations;

				if (oDataField["$Type"] === "com.sap.vocabularies.UI.v1.DataFieldForAnnotation") {
					sDataFieldPath = oDataField.Target.$AnnotationPath;
					if (
						oDataField.Target["$AnnotationPath"] &&
						oDataField.Target["$AnnotationPath"].indexOf("com.sap.vocabularies.UI.v1.FieldGroup") >= 0
					) {
						var oFieldGroup = oModel.getObject(sEntityPath + "/" + sDataFieldPath);

						for (var i = 0; i < oFieldGroup.Data.length; i++) {
							sType = oModel.getObject(sEntityPath + "/" + sDataFieldPath + "/Data/" + i.toString() + "/Value/$Path/$Type");
							oAnnotations = oModel.getObject(sEntityPath + "/" + sDataFieldPath + "/Data/" + i.toString() + "/Value/$Path@");
							sType = this.getUnderlyingPropertyDataType(oAnnotations, oModel, sEntityPath, sType);
							sDefaultAlignment = this.getPropertyAlignment(sType, oFormatOptions, oComputedEditMode);

							if (sDefaultAlignment === "Begin") {
								break;
							}
						}
						return sDefaultAlignment;
					} else if (
						oDataField.Target["$AnnotationPath"] &&
						oDataField.Target["$AnnotationPath"].indexOf("com.sap.vocabularies.UI.v1.DataPoint") >= 0 &&
						oModel.getObject(sEntityPath + "/" + sDataFieldPath + "/Visualization/$EnumMember") ===
							"com.sap.vocabularies.UI.v1.VisualizationType/Rating"
					) {
						return sDefaultAlignment;
					} else {
						sType = oModel.getObject(sEntityPath + "/" + sDataFieldPath + "/$Type");
						if (sType === "com.sap.vocabularies.UI.v1.DataPointType") {
							sType = oModel.getObject(sEntityPath + "/" + sDataFieldPath + "/Value/$Path/$Type");
							oAnnotations = oModel.getObject(sEntityPath + "/" + sDataFieldPath + "/Value/$Path@");
							sType = this.getUnderlyingPropertyDataType(oAnnotations, oModel, sEntityPath, sType);
						}
						sDefaultAlignment = this.getPropertyAlignment(sType, oFormatOptions, oComputedEditMode);
					}
				} else {
					sDataFieldPath = oDataField.Value.$Path;
					sType = oModel.getObject(sEntityPath + "/" + sDataFieldPath + "/$Type");
					oAnnotations = oModel.getObject(sEntityPath + "/" + sDataFieldPath + "@");
					sType = this.getUnderlyingPropertyDataType(oAnnotations, oModel, sEntityPath, sType);
					if (!(oModel.getObject(sEntityPath + "/")["$Key"].indexOf(sDataFieldPath) === 0)) {
						sDefaultAlignment = this.getPropertyAlignment(sType, oFormatOptions, oComputedEditMode);
					}
				}
				return sDefaultAlignment;
			},
			getTypeAlignment: function(oContext, oDataField, oFormatOptions, sEntityPath, oComputedEditMode, oProperty) {
				var oInterface = oContext.getInterface(0);
				var oModel = oInterface.getModel();

				if (sEntityPath === "/undefined" && oProperty && oProperty.$target) {
					sEntityPath = "/" + oProperty.$target.fullyQualifiedName.split("/")[0];
				}
				return FieldHelper.getDataFieldAlignment(oDataField, oModel, sEntityPath, oFormatOptions, oComputedEditMode);
			},

			getImportance: function(oDataField, aSemanticKeys, aFieldGroupData) {
				//Evaluate default Importance is not set excplicitely
				if (!oDataField["@com.sap.vocabularies.UI.v1.Importance"]) {
					//Check if semanticKeys are defined at the EntitySet level
					if (aSemanticKeys && aSemanticKeys.length > 0) {
						var mSemanticKeys = aSemanticKeys.map(function(oKey) {
							return oKey.$PropertyPath;
						});

						switch (oDataField.$Type) {
							case "com.sap.vocabularies.UI.v1.DataFieldForAnnotation":
								//If a FieldGroup contains a semanticKey, importance set to High
								if (
									oDataField.Target &&
									oDataField.Target.$AnnotationPath &&
									oDataField.Target.$AnnotationPath.indexOf("@com.sap.vocabularies.UI.v1.FieldGroup") > -1
								) {
									return aFieldGroupData.some(function(oFieldGroupDataField) {
										return (
											oFieldGroupDataField.Value &&
											oFieldGroupDataField.Value.$Path &&
											oFieldGroupDataField.$Type !== "com.sap.vocabularies.UI.v1.DataFieldForAnnotation" &&
											mSemanticKeys.includes(oFieldGroupDataField.Value.$Path)
										);
									})
										? "High"
										: "None";
								}
								break;
							default:
								//If current field is a semanticKey, importance set to High
								if (oDataField.Value && oDataField.Value.$Path) {
									return mSemanticKeys.includes(oDataField.Value.$Path) ? "High" : "None";
								}
						}
					}
					return "None";
				} else {
					switch (oDataField["@com.sap.vocabularies.UI.v1.Importance"].$EnumMember) {
						case "com.sap.vocabularies.UI.v1.ImportanceType/High":
							return "High";
						case "com.sap.vocabularies.UI.v1.ImportanceType/Medium":
							return "Medium";
						case "com.sap.vocabularies.UI.v1.ImportanceType/Low":
							return "Low";
						default:
							return "None";
					}
				}
			},

			/**
			 * Method to get enabled expression for DataFieldActionButton.
			 *
			 * @function
			 * @name isDataFieldActionButtonEnabled
			 * @param {object} oDataField DataPoint's Value
			 * @param {boolean} bIsBound DataPoint action bound
			 * @param {object} oActionContext ActionContext Value
			 * @param {string} sActionContextFormat Formatted value of ActionContext
			 * @returns {*} A boolean or string expression for enabled property
			 */
			isDataFieldActionButtonEnabled: function(oDataField, bIsBound, oActionContext, sActionContextFormat) {
				if (bIsBound !== true) {
					return "true";
				}
				return (oActionContext === null
				? "{= !${#" + oDataField.Action + "} ? false : true }"
				: oActionContext)
					? sActionContextFormat
					: "true";
			},
			/**
			 * Method to get labelText for DataField.
			 *
			 * @function
			 * @name getLabelTextForDataField
			 * @param {object} oEntitySetModel The EntitySet model Object
			 * @param {object} oPropertyPath The Property path's object
			 * @param {string} sPropertyPathBuildExpression The evaluated value of expression ${property>$Path@@FIELD.buildExpressionForTextValue}
			 * @param {string} sPropertyValue Property value from model
			 * @param {string} sUiName The sapui.name annotation value
			 * @param sSemanticKeyStyle
			 * @returns {string} The binding expression for datafield label.
			 */
			getLabelTextForDataField: function(
				oEntitySetModel,
				oPropertyPath,
				sPropertyPathBuildExpression,
				sPropertyValue,
				sUiName,
				sSemanticKeyStyle
			) {
				var sResult;
				var oDraftRoot = oEntitySetModel["@com.sap.vocabularies.Common.v1.DraftRoot"];
				sResult = FieldHelper.getSemanticKeyTitle(
					oPropertyPath["@com.sap.vocabularies.Common.v1.Text"] && sPropertyPathBuildExpression,
					sPropertyValue,
					sUiName,
					oPropertyPath["@com.sap.vocabularies.Common.v1.Text@com.sap.vocabularies.UI.v1.TextArrangement"],
					sSemanticKeyStyle,
					oDraftRoot
				);
				return sResult;
			},
			/**
			 * Method to get MultipleLines for DataField.
			 *
			 * @function
			 * @name getMultipleLinesForDataField
			 * @param {object} oThis Current Object
			 * @param {string} sPropertyType Property type
			 * @param {string} sPropertyMultiLineText Property multiline text
			 * @returns {*} The binding expression to determine if a data field should be multiline or not
			 */
			getMultipleLinesForDataField: function(oThis, sPropertyType, sPropertyMultiLineText) {
				if (oThis.wrap === "false") {
					return false;
				}
				if (sPropertyType !== "Edm.String") {
					return sPropertyMultiLineText;
				}
				if (oThis.editMode === "Display") {
					return true;
				}
				if (oThis.editMode.indexOf("{") > -1) {
					// If the editMode is computed then we just care about the page editMode to determine if the multiline property should be taken into account
					return "{= ${ui>/editMode} === 'Display' ? true : " + sPropertyMultiLineText + "}";
				}
				return sPropertyMultiLineText;
			},

			/**
			 * Method to check ValueListReferences, ValueListMapping and ValueList inside ActionParameters for FieldHelp.
			 *
			 * @function
			 * @name hasValueHelp
			 * @param {object} oPropertyAnnotations Action parameter object
			 * @returns {boolean} `true` if there is a ValueList* annotation defined
			 */
			hasValueHelpAnnotation: function(oPropertyAnnotations) {
				if (oPropertyAnnotations) {
					return (
						oPropertyAnnotations["@com.sap.vocabularies.Common.v1.ValueListReferences"] ||
						oPropertyAnnotations["@com.sap.vocabularies.Common.v1.ValueListMapping"] ||
						oPropertyAnnotations["@com.sap.vocabularies.Common.v1.ValueList"]
					);
				}
			},
			/**
			 * Method to get display property for ActionParameter dialog.
			 *
			 * 	@function
			 * @name getAPDialogDisplayFormat
			 * @param {object} oProperty The action parameter instance
			 * @param {object} oInterface The interface for context instance
			 * @returns {string} The display format  for an action parameter Field
			 */
			getAPDialogDisplayFormat: function(oProperty, oInterface) {
				var oAnnotation,
					oModel = oInterface.context.getModel(),
					sContextPath = oInterface.context.getPath(),
					sPropertyName = oProperty.$Name || oInterface.context.getProperty(sContextPath + "@sapui.name"),
					oActionParameterAnnotations = oModel.getObject(sContextPath + "@"),
					oValueHelpAnnotation =
						oActionParameterAnnotations["@com.sap.vocabularies.Common.v1.ValueList"] ||
						oActionParameterAnnotations["@com.sap.vocabularies.Common.v1.ValueListMapping"] ||
						oActionParameterAnnotations["@com.sap.vocabularies.Common.v1.ValueListReferences"],
					getValueListPropertyName = function(oValueList) {
						var oValueListParameter = oValueList.Parameters.find(function(oParameter) {
							return oParameter.LocalDataProperty && oParameter.LocalDataProperty.$PropertyPath === sPropertyName;
						});
						return oValueListParameter && oValueListParameter.ValueListProperty;
					},
					sValueListPropertyName;
				if (
					oActionParameterAnnotations["@com.sap.vocabularies.Common.v1.TextArrangement"] ||
					oActionParameterAnnotations["@com.sap.vocabularies.Common.v1.Text@com.sap.vocabularies.UI.v1.TextArrangement"]
				) {
					return CommonUtils.computeDisplayMode(oActionParameterAnnotations, undefined);
				} else if (oValueHelpAnnotation) {
					if (oValueHelpAnnotation.CollectionPath) {
						// get the name of the corresponding property in value list collection
						sValueListPropertyName = getValueListPropertyName(oValueHelpAnnotation);
						if (!sValueListPropertyName) {
							return "Value";
						}
						// get text for this property
						oAnnotation = oModel.getObject("/" + oValueHelpAnnotation.CollectionPath + "/" + sValueListPropertyName + "@");
						return oAnnotation && oAnnotation["@com.sap.vocabularies.Common.v1.Text"]
							? CommonUtils.computeDisplayMode(oAnnotation, undefined)
							: "Value";
					} else {
						return oModel.requestValueListInfo(sContextPath, true).then(function(oValueListInfo) {
							// get the name of the corresponding property in value list collection
							sValueListPropertyName = getValueListPropertyName(oValueListInfo[""]);
							if (!sValueListPropertyName) {
								return "Value";
							}
							// get text for this property
							oAnnotation = oValueListInfo[""].$model
								.getMetaModel()
								.getObject("/" + oValueListInfo[""]["CollectionPath"] + "/" + sValueListPropertyName + "@");
							return oAnnotation && oAnnotation["@com.sap.vocabularies.Common.v1.Text"]
								? CommonUtils.computeDisplayMode(oAnnotation, undefined)
								: "Value";
						});
					}
				} else {
					return "Value";
				}
			},
			/**
			 * Method to get display property for ActionParameter dialog FieldHelp.
			 *
			 * @function
			 * @name getActionParameterDialogFieldHelp
			 * @param {object} oActionParameter Action parameter object
			 * @param {string} sSapUIName Action sapui name
			 * @param {string} sParamName The parameter name
			 * @returns {string} The ID of the fieldHelp used by this action parameter
			 */
			getActionParameterDialogFieldHelp: function(oActionParameter, sSapUIName, sParamName) {
				return this.hasValueHelpAnnotation(oActionParameter) ? StableIdHelper.generate([sSapUIName, sParamName]) : undefined;
			},
			/**
			 * Method to get display property for ActionParameter dialog delegate.
			 *
			 * @function
			 * @name getFieldValueHelpDelegate
			 * @param {boolean} bIsBound Action is bound
			 * @param {string} sETypePath The EntityType Path
			 * @param {string} sSapUIName The name of the Action
			 * @param {string} sParamName The name of the ActionParameter
			 * @returns {string} The delegate configuration object as a stirng
			 */
			getFieldValueHelpDelegate: function(bIsBound, sETypePath, sSapUIName, sParamName) {
				return CommonHelper.objectToString({
					name: CommonHelper.addSingleQuotes("sap/fe/macros/FieldValueHelpDelegate"),
					payload: {
						propertyPath: CommonHelper.addSingleQuotes(
							ValueListHelper.getPropertyPath({
								UnboundAction: !bIsBound,
								EntityTypePath: sETypePath,
								Action: sSapUIName,
								Property: sParamName
							})
						)
					}
				});
			},
			/**
			 * Method to fetch entity from a path containing multiple associations.
			 *
			 * @function
			 * @name _getEntitySetFromMultiLevel
			 * @param {object} oContext The context whose path is to be checked
			 * @param {string} sPath The path from which entity has to be fetched
			 * @param {string} sSourceEntity The entity path in which nav entity exists
			 * @param {integer} iStart The start index : beginning parts of the path to be ignored
			 * @param {integer} iDiff The diff index : end parts of the path to be ignored
			 * @returns {string} The path of the entity set
			 */
			_getEntitySetFromMultiLevel: function(oContext, sPath, sSourceEntity, iStart, iDiff) {
				var aNavParts = sPath.split("/").filter(Boolean);
				aNavParts = aNavParts.filter(function(sPart) {
					return sPart !== "$NavigationPropertyBinding";
				});
				if (aNavParts.length > 0) {
					for (var i = iStart; i < aNavParts.length - iDiff; i++) {
						sSourceEntity = "/" + oContext.getObject(sSourceEntity + "/$NavigationPropertyBinding/" + aNavParts[i]);
					}
				}
				return sSourceEntity;
			},
			/**
			 * Method to find the entity of the property.
			 *
			 * @function
			 * @name getPropertyCollection
			 * @param {object} oProperty The context from which datafield's path needs to be extracted.
			 * @param {object} oContextObject The Metadata Context(Not passed when called with template:with)
			 * @returns {string} The entity set path of the property
			 */
			getPropertyCollection: function(oProperty, oContextObject) {
				var oContext = (oContextObject && oContextObject.context) || oProperty;
				var sPath = oContext.getPath(),
					aMainEntityParts = sPath.split("/").filter(Boolean),
					sMainEntity = aMainEntityParts[0],
					sPropertyPath = oContext.getObject("$Path"),
					sFieldSourceEntity = "/" + sMainEntity;
				// checking against prefix of annotations, ie. @com.sap.vocabularies.
				// as annotation path can be of a line item, field group or facet
				if (sPath.indexOf("/@com.sap.vocabularies.") > -1) {
					var iAnnoIndex = sPath.indexOf("/@com.sap.vocabularies.");
					var sInnerPath = sPath.substring(0, iAnnoIndex);
					// the facet or line item's entity could be a navigation entity
					sFieldSourceEntity = FieldHelper._getEntitySetFromMultiLevel(oContext, sInnerPath, sFieldSourceEntity, 1, 0);
				}
				if (sPropertyPath && sPropertyPath.indexOf("/") > -1) {
					// the field within facet or line item could be from a navigation entity
					sFieldSourceEntity = FieldHelper._getEntitySetFromMultiLevel(oContext, sPropertyPath, sFieldSourceEntity, 0, 1);
				}
				return sFieldSourceEntity;
			},
			/**
			 * Method used in a template with to retrieve the currency or the unit property inside a templating variable.
			 * @param oPropertyAnnotations
			 * @returns {string} The annotationPath to be dealt with by template:with
			 */
			getUnitOrCurrency: function(oPropertyAnnotations) {
				var oPropertyAnnotationsObject = oPropertyAnnotations.getObject();
				var sAnnotationPath = oPropertyAnnotations.sPath;
				if (oPropertyAnnotationsObject["@Org.OData.Measures.V1.ISOCurrency"]) {
					sAnnotationPath = sAnnotationPath + "Org.OData.Measures.V1.ISOCurrency";
				} else {
					sAnnotationPath = sAnnotationPath + "Org.OData.Measures.V1.Unit";
				}

				return sAnnotationPath;
			},
			hasStaticUnitOrCurrency: function(oPropertyAnnotations) {
				return oPropertyAnnotations["@Org.OData.Measures.V1.ISOCurrency"]
					? !oPropertyAnnotations["@Org.OData.Measures.V1.ISOCurrency"].$Path
					: !oPropertyAnnotations["@Org.OData.Measures.V1.Unit"].$Path;
			},
			getStaticUnitOrCurrency: function(oPropertyAnnotations, oFormatOptions) {
				if (oFormatOptions && oFormatOptions.measureDisplayMode !== "Hidden") {
					return (
						oPropertyAnnotations["@Org.OData.Measures.V1.ISOCurrency"] || oPropertyAnnotations["@Org.OData.Measures.V1.Unit"]
					);
				}
			},
			getEmptyIndicatorTrigger: function(bActive, sBinding, sFullTextBinding) {
				if (sFullTextBinding) {
					return bActive ? sFullTextBinding : "inactive";
				}
				return bActive ? sBinding : "inactive";
			},
			/**
			 * When the value displayed is in text arrangement TextOnly we also want to retrieve the Text value for tables even if we don't show it.
			 * This method will return the value of the original data field.
			 *
			 * @param {object} oThis Current Object
			 * @param {object} oDataFieldTextArrangement DataField using text arrangement annotation
			 * @param {object} oDataField DataField containing the value using text arrangement annotation
			 * @returns {string} The binding to the value
			 */
			getBindingInfoForTextArrangement: function(oThis, oDataFieldTextArrangement, oDataField) {
				if (
					oDataFieldTextArrangement &&
					oDataFieldTextArrangement.$EnumMember &&
					oDataFieldTextArrangement.$EnumMember === "com.sap.vocabularies.UI.v1.TextArrangementType/TextOnly" &&
					oDataField
				) {
					return "{" + oDataField.Value.$Path + "}";
				}
			},

			semanticKeyFormat: function(vRaw, oInterface) {
				// The Empty argument ensures that "groupingEnabled" is added to "formatOptions"
				oInterface.arguments = [{}, { groupingEnabled: false }];
				var sReturnPath = AnnotationHelper.format(vRaw, oInterface);
				return sReturnPath;
			},
			getIsMediaContentTypeNullExpr: function(sPropertyPath, sOperator) {
				sOperator = sOperator || "===";
				return "{= %{" + sPropertyPath + "@odata.mediaContentType} " + sOperator + " null }";
			},
			getPathForIconSource: function(sPropertyPath) {
				var sIconSrcPath = "{= FIELDRUNTIME.getIconForMimeType(%{" + sPropertyPath + "@odata.mediaContentType})}";
				return sIconSrcPath;
			},
			getFilenameExpr: function(sFilename, sNoFilenameText) {
				if (sFilename) {
					if (sFilename.indexOf("{") === 0) {
						// filename is referenced via path, i.e. @Core.ContentDisposition.Filename : path
						return "{= $" + sFilename + " ? $" + sFilename + " : '" + sNoFilenameText + "'}";
					}
					// static filename, i.e. @Core.ContentDisposition.Filename : 'someStaticName'
					return sFilename;
				}
				// no @Core.ContentDisposition.Filename
				return sNoFilenameText;
			}
		};

		FieldHelper.buildExpressionForTextValue.requiresIContext = true;
		FieldHelper.getRequiredForDataField.requiresIContext = true;
		FieldHelper.getBindingForDraftAdminBlockInline.requiresIContext = true;
		FieldHelper.getFieldGroupIds.requiresIContext = true;
		FieldHelper.fieldControl.requiresIContext = true;
		FieldHelper.getTypeAlignment.requiresIContext = true;
		FieldHelper.getPropertyCollection.requiresIContext = true;
		FieldHelper.getAPDialogDisplayFormat.requiresIContext = true;
		FieldHelper.operators.requiresIContext = true;
		FieldHelper.semanticKeyFormat.requiresIContext = true;

		return FieldHelper;
	},
	/* bExport= */
	true
);
