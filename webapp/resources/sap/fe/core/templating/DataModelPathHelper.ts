import { EntitySet, EntityType, NavigationProperty, Property } from "@sap-ux/annotation-converter";
import { annotationExpression, constant, equal, Expression } from "sap/fe/core/helpers/BindingExpression";
import { NavigationPropertyRestrictionTypes } from "@sap-ux/vocabularies-types/dist/generated/Capabilities";
import { PropertyOrPath } from "sap/fe/core/templating/UIFormatters";
import { isAnnotationPathExpression, isPathExpression } from "sap/fe/core/templating/PropertyHelper";
import {
	FilterExpressionRestrictionTypeTypes,
	NavigationPropertyRestriction
} from "@sap-ux/vocabularies-types/types/generated/Capabilities";
import {
	EntitySetAnnotations_Capabilities,
	EntityTypeAnnotations_Capabilities
} from "@sap-ux/vocabularies-types/dist/generated/Capabilities_Edm";
import { PropertyPath } from "@sap-ux/vocabularies-types";

export type DataModelObjectPath = {
	startingEntitySet: EntitySet;
	contextLocation?: DataModelObjectPath;
	navigationProperties: NavigationProperty[];
	targetEntitySet?: EntitySet;
	targetEntityType: EntityType;
	targetObject: any;
};

export const getPathRelativeLocation = function(
	contextPath?: DataModelObjectPath,
	visitedNavProps: NavigationProperty[] = []
): NavigationProperty[] {
	if (!contextPath) {
		return visitedNavProps;
	} else {
		if (visitedNavProps.length >= contextPath.navigationProperties.length) {
			let remainingNavProps: NavigationProperty[] = [];
			contextPath.navigationProperties.forEach((navProp, navIndex) => {
				if (visitedNavProps[navIndex] !== navProp) {
					remainingNavProps.push(visitedNavProps[navIndex]);
				}
			});
			remainingNavProps = remainingNavProps.concat(visitedNavProps.slice(contextPath.navigationProperties.length));
			// Clean up NavProp -> Owner
			let currentIdx = 0;
			while (remainingNavProps.length > 1 && currentIdx != remainingNavProps.length - 1) {
				const currentNav = remainingNavProps[currentIdx];
				const nextNavProp = remainingNavProps[currentIdx + 1];
				if (currentNav.partner === nextNavProp.name) {
					remainingNavProps.splice(0, 2);
				} else {
					currentIdx++;
				}
			}
			return remainingNavProps;
		} else {
			let extraNavProp: NavigationProperty[] = [];
			visitedNavProps.forEach((navProp, navIndex) => {
				if (contextPath.navigationProperties[navIndex] !== navProp) {
					extraNavProp.push(visitedNavProps[navIndex]);
				}
			});
			extraNavProp = extraNavProp.concat(contextPath.navigationProperties.slice(visitedNavProps.length));
			// Clean up NavProp -> Owner
			let currentIdx = 0;
			while (extraNavProp.length > 1 && currentIdx != extraNavProp.length - 1) {
				const currentNav = extraNavProp[currentIdx];
				const nextNavProp = extraNavProp[currentIdx + 1];
				if (currentNav.partner === nextNavProp.name) {
					extraNavProp.splice(0, 2);
				} else {
					currentIdx++;
				}
			}
			extraNavProp = extraNavProp.map(navProp => {
				return navProp.targetType.navigationProperties.find(np => np.name === navProp.partner) as NavigationProperty;
			});
			return extraNavProp;
		}
	}
};

export const enhanceDataModelPath = function(
	dataModelObjectPath: DataModelObjectPath,
	propertyPath?: PropertyOrPath<Property>
): DataModelObjectPath {
	let sPropertyPath: string = "";
	if ((isPathExpression(propertyPath) || isAnnotationPathExpression(propertyPath)) && propertyPath.path) {
		sPropertyPath = propertyPath.path;
	} else if (typeof propertyPath === "string") {
		sPropertyPath = propertyPath as string;
	}
	let oTarget;
	if (isPathExpression(propertyPath) || isAnnotationPathExpression(propertyPath)) {
		oTarget = propertyPath.$target;
	} else if (dataModelObjectPath.targetEntityType) {
		oTarget = dataModelObjectPath.targetEntityType.resolvePath(sPropertyPath);
	} else {
		oTarget = dataModelObjectPath.targetObject;
	}
	const aPathSplit = sPropertyPath.split("/");
	let currentEntitySet = dataModelObjectPath.targetEntitySet;
	let currentEntityType = dataModelObjectPath.targetEntityType;
	const navigationProperties = dataModelObjectPath.navigationProperties.concat();
	// Process only if we have to go through navigation properties

	aPathSplit.reduce((reducedEntityType: EntityType | undefined, pathPart: string) => {
		if (!reducedEntityType) {
			return undefined;
		}
		const potentialNavProp = reducedEntityType.navigationProperties.find(navProp => navProp.name === pathPart);
		if (potentialNavProp) {
			navigationProperties.push(potentialNavProp);
			currentEntityType = potentialNavProp.targetType;
			if (currentEntitySet && currentEntitySet.navigationPropertyBinding.hasOwnProperty(pathPart)) {
				currentEntitySet = currentEntitySet.navigationPropertyBinding[pathPart];
			}
			return currentEntityType;
		}
		return undefined;
	}, dataModelObjectPath.targetEntityType);

	return {
		startingEntitySet: dataModelObjectPath.startingEntitySet,
		navigationProperties: navigationProperties,
		contextLocation: dataModelObjectPath.contextLocation,
		targetEntitySet: currentEntitySet,
		targetEntityType: currentEntityType,
		targetObject: oTarget
	};
};

export const getTargetEntitySetPath = function(dataModelObjectPath: DataModelObjectPath, bRelative: boolean = false): string {
	let targetEntitySetPath: string = "";
	if (!bRelative) {
		targetEntitySetPath += `/${dataModelObjectPath.startingEntitySet.name}`;
	}
	let currentEntitySet =
		bRelative && dataModelObjectPath.contextLocation?.targetEntitySet
			? dataModelObjectPath.contextLocation.targetEntitySet
			: dataModelObjectPath.startingEntitySet;
	let navigatedPaths: string[] = [];
	dataModelObjectPath.navigationProperties.forEach(navProp => {
		if (
			!bRelative ||
			!dataModelObjectPath.contextLocation ||
				!dataModelObjectPath.contextLocation?.navigationProperties.some(
					contextNavProp => contextNavProp.fullyQualifiedName === navProp.fullyQualifiedName
				)
		) {
			// in case of relative entitySetPath we don't consider navigationPath that are already in the context
			navigatedPaths.push(navProp.name);
		}
		if (currentEntitySet && currentEntitySet.navigationPropertyBinding.hasOwnProperty(navigatedPaths.join("/"))) {
			if (bRelative) {
				targetEntitySetPath += `${navigatedPaths.join("/")}`;
			} else {
				targetEntitySetPath += `/$NavigationPropertyBinding/${navigatedPaths.join("/")}/$`;
			}
			currentEntitySet = currentEntitySet.navigationPropertyBinding[navigatedPaths.join("/")];
			navigatedPaths = [];
		}
	});
	return targetEntitySetPath;
};

export const getTargetEntitySetNavigation = function(dataModelObjectPath: DataModelObjectPath): NavigationProperty[] {
	const visitedNavigationProperties: NavigationProperty[] = [];
	let currentEntitySet = dataModelObjectPath.startingEntitySet;
	let navigatedPaths: string[] = [];
	dataModelObjectPath.navigationProperties.forEach(navProp => {
		navigatedPaths.push(navProp.name);
		if (currentEntitySet && currentEntitySet.navigationPropertyBinding.hasOwnProperty(navigatedPaths.join("/"))) {
			visitedNavigationProperties.push(navProp);
			currentEntitySet = currentEntitySet.navigationPropertyBinding[navigatedPaths.join("/")];
			navigatedPaths = [];
		}
	});
	return visitedNavigationProperties;
};

export const getTargetObjectPath = function(dataModelObjectPath: DataModelObjectPath, bRelative: boolean = false): string {
	let path = "";
	if (!dataModelObjectPath.startingEntitySet) {
		return "/";
	}
	if (!bRelative) {
		path += `/${dataModelObjectPath.startingEntitySet.name}`;
	}
	if (dataModelObjectPath.navigationProperties.length > 0) {
		if (path.length > 0) {
			path += "/";
		}
		path += dataModelObjectPath.navigationProperties.map(navProp => navProp.name).join("/");
	}

	if (
		dataModelObjectPath.targetObject &&
		dataModelObjectPath.targetObject.name &&
		dataModelObjectPath.targetObject._type !== "NavigationProperty" &&
		dataModelObjectPath.targetObject._type !== "EntityType" &&
		dataModelObjectPath.targetObject !== dataModelObjectPath.startingEntitySet
	) {
		if (!path.endsWith("/")) {
			path += "/";
		}
		path += `${dataModelObjectPath.targetObject.name}`;
	} else if (dataModelObjectPath.targetObject && dataModelObjectPath.targetObject.hasOwnProperty("term")) {
		if (path.length > 0 && !path.endsWith("/")) {
			path += "/";
		}
		path += `@${dataModelObjectPath.targetObject.term}`;
	}
	return path;
};

export const getContextRelativeTargetObjectPath = function(
	dataModelObjectPath: DataModelObjectPath,
	forBindingExpression: boolean = false
): string | undefined {
	const navProperties = getPathRelativeLocation(dataModelObjectPath.contextLocation, dataModelObjectPath.navigationProperties);
	if (forBindingExpression) {
		if (navProperties.find(np => np.isCollection)) {
			return undefined;
		}
	}
	let path = navProperties.map(np => np.name).join("/");
	if (
		dataModelObjectPath.targetObject &&
		(dataModelObjectPath.targetObject.name ||
			(dataModelObjectPath.targetObject.type === "PropertyPath" && dataModelObjectPath.targetObject.value)) &&
		dataModelObjectPath.targetObject._type !== "NavigationProperty" &&
		dataModelObjectPath.targetObject !== dataModelObjectPath.startingEntitySet
	) {
		if (path.length > 0 && !path.endsWith("/")) {
			path += "/";
		}
		path +=
			dataModelObjectPath.targetObject.type === "PropertyPath"
				? `${dataModelObjectPath.targetObject.value}`
				: `${dataModelObjectPath.targetObject.name}`;
	} else if (dataModelObjectPath.targetObject && dataModelObjectPath.targetObject.hasOwnProperty("term")) {
		if (path.length > 0 && !path.endsWith("/")) {
			path += "/";
		}
		path += `@${dataModelObjectPath.targetObject.term}`;
		if (dataModelObjectPath.targetObject.hasOwnProperty("qualifier") && !!dataModelObjectPath.targetObject.qualifier) {
			path += `#${dataModelObjectPath.targetObject.qualifier}`;
		}
	} else if (!dataModelObjectPath.targetObject) {
		return undefined;
	}
	return path;
};

export const isPathUpdatable = function(
	dataModelObjectPath: DataModelObjectPath | undefined,
	propertyPath?: PropertyOrPath<Property>,
	bTableCase?: boolean
): Expression<boolean> {
	return checkOnPath(
		dataModelObjectPath,
		(annotationObject: NavigationPropertyRestriction | EntitySetAnnotations_Capabilities | EntityTypeAnnotations_Capabilities) => {
			return annotationObject?.UpdateRestrictions?.Updatable;
		},
		propertyPath,
		bTableCase
	);
};

export const isPathSearchable = function(
	dataModelObjectPath: DataModelObjectPath | undefined,
	propertyPath?: PropertyOrPath<Property>,
	bTableCase?: boolean
): Expression<boolean> {
	return checkOnPath(
		dataModelObjectPath,
		(annotationObject: NavigationPropertyRestriction | EntitySetAnnotations_Capabilities) => {
			return annotationObject?.SearchRestrictions?.Searchable;
		},
		propertyPath,
		bTableCase
	);
};

export const isPathDeletable = function(
	dataModelObjectPath: DataModelObjectPath | undefined,
	propertyPath?: PropertyOrPath<Property>,
	bTableCase?: boolean
): Expression<boolean> {
	return checkOnPath(
		dataModelObjectPath,
		(annotationObject: NavigationPropertyRestriction | EntitySetAnnotations_Capabilities | EntityTypeAnnotations_Capabilities) => {
			return annotationObject?.DeleteRestrictions?.Deletable;
		},
		propertyPath,
		bTableCase
	);
};

export const isPathInsertable = function(
	dataModelObjectPath: DataModelObjectPath | undefined,
	propertyPath?: PropertyOrPath<Property>
): Expression<boolean> {
	return checkOnPath(
		dataModelObjectPath,
		(annotationObject: NavigationPropertyRestriction | EntitySetAnnotations_Capabilities | EntityTypeAnnotations_Capabilities) => {
			return annotationObject?.InsertRestrictions?.Insertable;
		},
		propertyPath
	);
};

export const checkFilterExpressionRestrictions = function(
	dataModelObjectPath: DataModelObjectPath,
	allowedExpression: (string | undefined)[]
): Expression<boolean> {
	return checkOnPath(
		dataModelObjectPath,
		(annotationObject: NavigationPropertyRestriction | EntitySetAnnotations_Capabilities | EntityTypeAnnotations_Capabilities) => {
			if (annotationObject && "FilterRestrictions" in annotationObject) {
				const filterExpressionRestrictions: FilterExpressionRestrictionTypeTypes[] =
					(annotationObject?.FilterRestrictions?.FilterExpressionRestrictions as FilterExpressionRestrictionTypeTypes[]) || [];
				const currentObjectRestriction = filterExpressionRestrictions.find(restriction => {
					return (restriction.Property as PropertyPath).$target === dataModelObjectPath.targetObject;
				});
				if (currentObjectRestriction) {
					return allowedExpression.indexOf(currentObjectRestriction?.AllowedExpressions?.toString()) !== -1;
				} else {
					return false;
				}
			} else {
				return false;
			}
		}
	);
};

export const checkOnPath = function(
	dataModelObjectPath: DataModelObjectPath | undefined,
	checkFunction: Function,
	propertyPath?: PropertyOrPath<Property>,
	bTableCase?: boolean
): Expression<boolean> {
	if (!dataModelObjectPath || !dataModelObjectPath.startingEntitySet) {
		return constant(true);
	}
	dataModelObjectPath = enhanceDataModelPath(dataModelObjectPath, propertyPath);

	let currentEntitySet: EntitySet | null = dataModelObjectPath.startingEntitySet;
	let parentEntitySet: EntitySet | null = null;
	let visitedNavigationPropsName: string[] = [];
	const allVisitedNavigationProps: NavigationProperty[] = [];
	let targetEntitySet: EntitySet | null = currentEntitySet;
	const targetEntityType: EntityType | null = dataModelObjectPath.targetEntityType;
	let resetVisitedNavProps = false;

	dataModelObjectPath.navigationProperties.forEach((navigationProperty: NavigationProperty) => {
		if (resetVisitedNavProps) {
			visitedNavigationPropsName = [];
		}
		visitedNavigationPropsName.push(navigationProperty.name);
		allVisitedNavigationProps.push(navigationProperty);
		if (!navigationProperty.containsTarget) {
			// We should have a navigationPropertyBinding associated with the path so far which can consist of ([ContainmentNavProp]/)*[NavProp]
			const fullNavigationPath = visitedNavigationPropsName.join("/");
			if (currentEntitySet && currentEntitySet.navigationPropertyBinding.hasOwnProperty(fullNavigationPath)) {
				parentEntitySet = currentEntitySet;
				currentEntitySet = currentEntitySet.navigationPropertyBinding[fullNavigationPath];
				targetEntitySet = currentEntitySet;
				// If we reached a navigation property with a navigationpropertybinding, we need to reset the visited path on the next iteration (if there is one)
				resetVisitedNavProps = true;
			} else {
				// We really should not end up here but at least let's try to avoid incorrect behavior
				parentEntitySet = currentEntitySet;
				currentEntitySet = null;
				resetVisitedNavProps = true;
			}
		} else {
			parentEntitySet = currentEntitySet;
			targetEntitySet = null;
		}
	});

	// At this point we have navigated down all the nav prop and we should have
	// The target entityset pointing to either null (in case of containment navprop a last part), or the actual target (non containment as target)
	// The parent entitySet pointing to the previous entityset used in the path
	// VisitedNavigationPath should contain the path up to this property

	// Restrictions should then be evaluated as ParentEntitySet.NavRestrictions[NavpropertyPath] || TargetEntitySet.Restrictions
	const fullNavigationPath = visitedNavigationPropsName.join("/");
	let restrictions, visitedNavProps;
	if (parentEntitySet !== null) {
		const _parentEntitySet: EntitySet = parentEntitySet;
		_parentEntitySet.annotations?.Capabilities?.NavigationRestrictions?.RestrictedProperties.forEach(
			(restrictedNavProp: NavigationPropertyRestrictionTypes) => {
				if (restrictedNavProp.NavigationProperty?.type === "NavigationPropertyPath") {
					const restrictionDefinition = checkFunction(restrictedNavProp);
					if (fullNavigationPath === restrictedNavProp.NavigationProperty.value && restrictionDefinition !== undefined) {
						const _allVisitedNavigationProps = allVisitedNavigationProps.slice(0, -1);
						if (targetEntitySet !== null) {
							visitedNavProps = _allVisitedNavigationProps;
						} else {
							if (_allVisitedNavigationProps.length === 0) {
								visitedNavProps = allVisitedNavigationProps.slice(0);
							} else {
								visitedNavProps = _allVisitedNavigationProps;
							}
						}
						restrictions = equal(
							annotationExpression(
								restrictionDefinition,
								getPathRelativeLocation(dataModelObjectPath?.contextLocation, visitedNavProps).map(np => np.name)
							),
							true
						);
					}
				}
			}
		);
	}
	let targetRestrictions;
	let restrictionDefinition = checkFunction(targetEntitySet?.annotations?.Capabilities);
	if (targetEntitySet === null && restrictionDefinition === undefined) {
		restrictionDefinition = checkFunction(targetEntityType?.annotations?.Capabilities);
	}
	if (restrictionDefinition !== undefined) {
		targetRestrictions = equal(
			annotationExpression(
				restrictionDefinition,
				getPathRelativeLocation(dataModelObjectPath.contextLocation, allVisitedNavigationProps).map(np => np.name)
			),
			true
		);
	}
	//object page table case in path based scenario's fallback to exisiting approach
	if (bTableCase && !restrictions && restrictionDefinition?.path) {
		const oResult: any = {
			"currentEntityRestriction": targetRestrictions
		};
		return oResult;
	}
	return restrictions || targetRestrictions || constant(true);
};
