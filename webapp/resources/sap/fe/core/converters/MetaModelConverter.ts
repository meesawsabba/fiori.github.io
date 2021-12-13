import { Annotation, AnnotationList, AnnotationRecord, Expression, ParserOutput } from "@sap-ux/vocabularies-types";
// This file is retrieved from @sap-ux/annotation-converter, shared code with tool suite
import { AnnotationConverter } from "sap/fe/core/converters/common";
import { ODataMetaModel } from "sap/ui/model/odata/v4";
import {
	ConverterOutput,
	EntitySet as _EntitySet,
	EntityType as _EntityType,
	NavigationProperty as _NavigationProperty
} from "@sap-ux/annotation-converter";
import {
	EntityType,
	EntitySet,
	Property,
	ComplexType,
	ReferentialConstraint,
	V4NavigationProperty,
	Action,
	Reference,
	EntityContainer,
	Singleton
} from "@sap-ux/vocabularies-types/dist/Parser";
import { Context } from "sap/ui/model";
import { DataModelObjectPath } from "sap/fe/core/templating/DataModelPathHelper";
import { generate } from "../helpers/StableIdHelper";

const VOCABULARY_ALIAS: any = {
	"Org.OData.Capabilities.V1": "Capabilities",
	"Org.OData.Core.V1": "Core",
	"Org.OData.Measures.V1": "Measures",
	"com.sap.vocabularies.Common.v1": "Common",
	"com.sap.vocabularies.UI.v1": "UI",
	"com.sap.vocabularies.Session.v1": "Session",
	"com.sap.vocabularies.Analytics.v1": "Analytics",
	"com.sap.vocabularies.PersonalData.v1": "PersonalData",
	"com.sap.vocabularies.Communication.v1": "Communication"
};

export type EnvironmentCapabilities = {
	Chart: boolean;
	MicroChart: boolean;
	UShell: boolean;
	IntentBasedNavigation: boolean;
};

export const DefaultEnvironmentCapabilities = {
	Chart: true,
	MicroChart: true,
	UShell: true,
	IntentBasedNavigation: true
};

type MetaModelAction = {
	$kind: "Action";
	$IsBound: boolean;
	$EntitySetPath: string;
	$Parameter: {
		$Type: string;
		$Name: string;
		$Nullable?: boolean;
		$MaxLength?: number;
		$Precision?: number;
		$Scale?: number;
		$isCollection?: boolean;
	}[];
	$ReturnType: {
		$Type: string;
	};
};

function parsePropertyValue(
	annotationObject: any,
	propertyKey: string,
	currentTarget: string,
	annotationsLists: Record<string, AnnotationList>,
	oCapabilities: EnvironmentCapabilities
): any {
	let value;
	const currentPropertyTarget: string = currentTarget + "/" + propertyKey;
	const typeOfAnnotation = typeof annotationObject;
	if (annotationObject === null) {
		value = { type: "Null", Null: null };
	} else if (typeOfAnnotation === "string") {
		value = { type: "String", String: annotationObject };
	} else if (typeOfAnnotation === "boolean") {
		value = { type: "Bool", Bool: annotationObject };
	} else if (typeOfAnnotation === "number") {
		value = { type: "Int", Int: annotationObject };
	} else if (Array.isArray(annotationObject)) {
		value = {
			type: "Collection",
			Collection: annotationObject.map((subAnnotationObject, subAnnotationObjectIndex) =>
				parseAnnotationObject(
					subAnnotationObject,
					currentPropertyTarget + "/" + subAnnotationObjectIndex,
					annotationsLists,
					oCapabilities
				)
			)
		};
		if (annotationObject.length > 0) {
			if (annotationObject[0].hasOwnProperty("$PropertyPath")) {
				(value.Collection as any).type = "PropertyPath";
			} else if (annotationObject[0].hasOwnProperty("$Path")) {
				(value.Collection as any).type = "Path";
			} else if (annotationObject[0].hasOwnProperty("$NavigationPropertyPath")) {
				(value.Collection as any).type = "NavigationPropertyPath";
			} else if (annotationObject[0].hasOwnProperty("$AnnotationPath")) {
				(value.Collection as any).type = "AnnotationPath";
			} else if (annotationObject[0].hasOwnProperty("$Type")) {
				(value.Collection as any).type = "Record";
			} else if (annotationObject[0].hasOwnProperty("$If")) {
				(value.Collection as any).type = "If";
			} else if (annotationObject[0].hasOwnProperty("$Or")) {
				(value.Collection as any).type = "Or";
			} else if (annotationObject[0].hasOwnProperty("$And")) {
				(value.Collection as any).type = "And";
			} else if (annotationObject[0].hasOwnProperty("$Eq")) {
				(value.Collection as any).type = "Eq";
			} else if (annotationObject[0].hasOwnProperty("$Ne")) {
				(value.Collection as any).type = "Ne";
			} else if (annotationObject[0].hasOwnProperty("$Not")) {
				(value.Collection as any).type = "Not";
			} else if (annotationObject[0].hasOwnProperty("$Gt")) {
				(value.Collection as any).type = "Gt";
			} else if (annotationObject[0].hasOwnProperty("$Ge")) {
				(value.Collection as any).type = "Ge";
			} else if (annotationObject[0].hasOwnProperty("$Lt")) {
				(value.Collection as any).type = "Lt";
			} else if (annotationObject[0].hasOwnProperty("$Le")) {
				(value.Collection as any).type = "Le";
			} else if (annotationObject[0].hasOwnProperty("$Apply")) {
				(value.Collection as any).type = "Apply";
			} else if (typeof annotationObject[0] === "object") {
				// $Type is optional...
				(value.Collection as any).type = "Record";
			} else {
				(value.Collection as any).type = "String";
			}
		}
	} else if (annotationObject.$Path !== undefined) {
		value = { type: "Path", Path: annotationObject.$Path };
	} else if (annotationObject.$Decimal !== undefined) {
		value = { type: "Decimal", Decimal: parseFloat(annotationObject.$Decimal) };
	} else if (annotationObject.$PropertyPath !== undefined) {
		value = { type: "PropertyPath", PropertyPath: annotationObject.$PropertyPath };
	} else if (annotationObject.$NavigationPropertyPath !== undefined) {
		value = {
			type: "NavigationPropertyPath",
			NavigationPropertyPath: annotationObject.$NavigationPropertyPath
		};
	} else if (annotationObject.$If !== undefined) {
		value = { type: "If", If: annotationObject.$If };
	} else if (annotationObject.$And !== undefined) {
		value = { type: "And", And: annotationObject.$And };
	} else if (annotationObject.$Or !== undefined) {
		value = { type: "Or", Or: annotationObject.$Or };
	} else if (annotationObject.$Not !== undefined) {
		value = { type: "Not", Not: annotationObject.$Not };
	} else if (annotationObject.$Eq !== undefined) {
		value = { type: "Eq", Eq: annotationObject.$Eq };
	} else if (annotationObject.$Ne !== undefined) {
		value = { type: "Ne", Ne: annotationObject.$Ne };
	} else if (annotationObject.$Gt !== undefined) {
		value = { type: "Gt", Gt: annotationObject.$Gt };
	} else if (annotationObject.$Ge !== undefined) {
		value = { type: "Ge", Ge: annotationObject.$Ge };
	} else if (annotationObject.$Lt !== undefined) {
		value = { type: "Lt", Lt: annotationObject.$Lt };
	} else if (annotationObject.$Le !== undefined) {
		value = { type: "Le", Le: annotationObject.$Le };
	} else if (annotationObject.$Apply !== undefined) {
		value = { type: "Apply", Apply: annotationObject.$Apply, Function: annotationObject.$Function };
	} else if (annotationObject.$AnnotationPath !== undefined) {
		value = { type: "AnnotationPath", AnnotationPath: annotationObject.$AnnotationPath };
	} else if (annotationObject.$EnumMember !== undefined) {
		value = {
			type: "EnumMember",
			EnumMember: mapNameToAlias(annotationObject.$EnumMember.split("/")[0]) + "/" + annotationObject.$EnumMember.split("/")[1]
		};
	} else if (annotationObject.$Type) {
		value = {
			type: "Record",
			Record: parseAnnotationObject(annotationObject, currentTarget, annotationsLists, oCapabilities)
		};
	} else {
		value = {
			type: "Record",
			Record: parseAnnotationObject(annotationObject, currentTarget, annotationsLists, oCapabilities)
		};
	}

	return {
		name: propertyKey,
		value
	};
}
function mapNameToAlias(annotationName: string): string {
	let [pathPart, annoPart] = annotationName.split("@");
	if (!annoPart) {
		annoPart = pathPart;
		pathPart = "";
	} else {
		pathPart += "@";
	}
	const lastDot = annoPart.lastIndexOf(".");
	return pathPart + VOCABULARY_ALIAS[annoPart.substr(0, lastDot)] + "." + annoPart.substr(lastDot + 1);
}
function parseAnnotationObject(
	annotationObject: any,
	currentObjectTarget: string,
	annotationsLists: Record<string, AnnotationList>,
	oCapabilities: EnvironmentCapabilities
): Expression | AnnotationRecord | Annotation {
	let parsedAnnotationObject: any = {};
	const typeOfObject = typeof annotationObject;
	if (annotationObject === null) {
		parsedAnnotationObject = { type: "Null", Null: null };
	} else if (typeOfObject === "string") {
		parsedAnnotationObject = { type: "String", String: annotationObject };
	} else if (typeOfObject === "boolean") {
		parsedAnnotationObject = { type: "Bool", Bool: annotationObject };
	} else if (typeOfObject === "number") {
		parsedAnnotationObject = { type: "Int", Int: annotationObject };
	} else if (annotationObject.$AnnotationPath !== undefined) {
		parsedAnnotationObject = { type: "AnnotationPath", AnnotationPath: annotationObject.$AnnotationPath };
	} else if (annotationObject.$Path !== undefined) {
		parsedAnnotationObject = { type: "Path", Path: annotationObject.$Path };
	} else if (annotationObject.$Decimal !== undefined) {
		parsedAnnotationObject = { type: "Decimal", Decimal: parseFloat(annotationObject.$Decimal) };
	} else if (annotationObject.$PropertyPath !== undefined) {
		parsedAnnotationObject = { type: "PropertyPath", PropertyPath: annotationObject.$PropertyPath };
	} else if (annotationObject.$If !== undefined) {
		parsedAnnotationObject = { type: "If", If: annotationObject.$If };
	} else if (annotationObject.$And !== undefined) {
		parsedAnnotationObject = { type: "And", And: annotationObject.$And };
	} else if (annotationObject.$Or !== undefined) {
		parsedAnnotationObject = { type: "Or", Or: annotationObject.$Or };
	} else if (annotationObject.$Not !== undefined) {
		parsedAnnotationObject = { type: "Not", Not: annotationObject.$Not };
	} else if (annotationObject.$Eq !== undefined) {
		parsedAnnotationObject = { type: "Eq", Eq: annotationObject.$Eq };
	} else if (annotationObject.$Ne !== undefined) {
		parsedAnnotationObject = { type: "Ne", Ne: annotationObject.$Ne };
	} else if (annotationObject.$Gt !== undefined) {
		parsedAnnotationObject = { type: "Gt", Gt: annotationObject.$Gt };
	} else if (annotationObject.$Ge !== undefined) {
		parsedAnnotationObject = { type: "Ge", Ge: annotationObject.$Ge };
	} else if (annotationObject.$Lt !== undefined) {
		parsedAnnotationObject = { type: "Lt", Lt: annotationObject.$Lt };
	} else if (annotationObject.$Le !== undefined) {
		parsedAnnotationObject = { type: "Le", Le: annotationObject.$Le };
	} else if (annotationObject.$Apply !== undefined) {
		parsedAnnotationObject = { type: "Apply", Apply: annotationObject.$Apply, Function: annotationObject.$Function };
	} else if (annotationObject.$NavigationPropertyPath !== undefined) {
		parsedAnnotationObject = {
			type: "NavigationPropertyPath",
			NavigationPropertyPath: annotationObject.$NavigationPropertyPath
		};
	} else if (annotationObject.$EnumMember !== undefined) {
		parsedAnnotationObject = {
			type: "EnumMember",
			EnumMember: mapNameToAlias(annotationObject.$EnumMember.split("/")[0]) + "/" + annotationObject.$EnumMember.split("/")[1]
		};
	} else if (Array.isArray(annotationObject)) {
		const parsedAnnotationCollection = parsedAnnotationObject as any;
		parsedAnnotationCollection.collection = annotationObject.map((subAnnotationObject, subAnnotationIndex) =>
			parseAnnotationObject(subAnnotationObject, currentObjectTarget + "/" + subAnnotationIndex, annotationsLists, oCapabilities)
		);
		if (annotationObject.length > 0) {
			if (annotationObject[0].hasOwnProperty("$PropertyPath")) {
				(parsedAnnotationCollection.collection as any).type = "PropertyPath";
			} else if (annotationObject[0].hasOwnProperty("$Path")) {
				(parsedAnnotationCollection.collection as any).type = "Path";
			} else if (annotationObject[0].hasOwnProperty("$NavigationPropertyPath")) {
				(parsedAnnotationCollection.collection as any).type = "NavigationPropertyPath";
			} else if (annotationObject[0].hasOwnProperty("$AnnotationPath")) {
				(parsedAnnotationCollection.collection as any).type = "AnnotationPath";
			} else if (annotationObject[0].hasOwnProperty("$Type")) {
				(parsedAnnotationCollection.collection as any).type = "Record";
			} else if (annotationObject[0].hasOwnProperty("$If")) {
				(parsedAnnotationCollection.collection as any).type = "If";
			} else if (annotationObject[0].hasOwnProperty("$And")) {
				(parsedAnnotationCollection.collection as any).type = "And";
			} else if (annotationObject[0].hasOwnProperty("$Or")) {
				(parsedAnnotationCollection.collection as any).type = "Or";
			} else if (annotationObject[0].hasOwnProperty("$Eq")) {
				(parsedAnnotationCollection.collection as any).type = "Eq";
			} else if (annotationObject[0].hasOwnProperty("$Ne")) {
				(parsedAnnotationCollection.collection as any).type = "Ne";
			} else if (annotationObject[0].hasOwnProperty("$Not")) {
				(parsedAnnotationCollection.collection as any).type = "Not";
			} else if (annotationObject[0].hasOwnProperty("$Gt")) {
				(parsedAnnotationCollection.collection as any).type = "Gt";
			} else if (annotationObject[0].hasOwnProperty("$Ge")) {
				(parsedAnnotationCollection.collection as any).type = "Ge";
			} else if (annotationObject[0].hasOwnProperty("$Lt")) {
				(parsedAnnotationCollection.collection as any).type = "Lt";
			} else if (annotationObject[0].hasOwnProperty("$Le")) {
				(parsedAnnotationCollection.collection as any).type = "Le";
			} else if (annotationObject[0].hasOwnProperty("$Apply")) {
				(parsedAnnotationCollection.collection as any).type = "Apply";
			} else if (typeof annotationObject[0] === "object") {
				(parsedAnnotationCollection.collection as any).type = "Record";
			} else {
				(parsedAnnotationCollection.collection as any).type = "String";
			}
		}
	} else {
		if (annotationObject.$Type) {
			const typeValue = annotationObject.$Type;
			parsedAnnotationObject.type = typeValue; //`${typeAlias}.${typeTerm}`;
		}
		const propertyValues: any = [];
		Object.keys(annotationObject).forEach(propertyKey => {
			if (
				propertyKey !== "$Type" &&
				propertyKey !== "$If" &&
				propertyKey !== "$Apply" &&
				propertyKey !== "$And" &&
				propertyKey !== "$Or" &&
				propertyKey !== "$Ne" &&
				propertyKey !== "$Gt" &&
				propertyKey !== "$Ge" &&
				propertyKey !== "$Lt" &&
				propertyKey !== "$Le" &&
				propertyKey !== "$Not" &&
				propertyKey !== "$Eq" &&
				!propertyKey.startsWith("@")
			) {
				propertyValues.push(
					parsePropertyValue(annotationObject[propertyKey], propertyKey, currentObjectTarget, annotationsLists, oCapabilities)
				);
			} else if (propertyKey.startsWith("@")) {
				// Annotation of annotation
				createAnnotationLists(
					{ [propertyKey]: annotationObject[propertyKey] },
					currentObjectTarget,
					annotationsLists,
					oCapabilities
				);
			}
		});
		parsedAnnotationObject.propertyValues = propertyValues;
	}
	return parsedAnnotationObject;
}
function getOrCreateAnnotationList(target: string, annotationsLists: Record<string, AnnotationList>): AnnotationList {
	if (!annotationsLists.hasOwnProperty(target)) {
		annotationsLists[target] = {
			target: target,
			annotations: []
		};
	}
	return annotationsLists[target];
}

function removeChartAnnotations(annotationObject: any) {
	return annotationObject.filter((oRecord: any) => {
		if (oRecord.Target && oRecord.Target.$AnnotationPath) {
			return oRecord.Target.$AnnotationPath.indexOf("@com.sap.vocabularies.UI.v1.Chart") === -1;
		} else {
			return true;
		}
	});
}

function removeIBNAnnotations(annotationObject: any) {
	return annotationObject.filter((oRecord: any) => {
		return oRecord.$Type !== "com.sap.vocabularies.UI.v1.DataFieldForIntentBasedNavigation";
	});
}

function handlePresentationVariant(annotationObject: any) {
	return annotationObject.filter((oRecord: any) => {
		return oRecord.$AnnotationPath !== "@com.sap.vocabularies.UI.v1.Chart";
	});
}

function createAnnotationLists(
	annotationObjects: any,
	annotationTarget: string,
	annotationLists: Record<string, AnnotationList>,
	oCapabilities: EnvironmentCapabilities
) {
	if (Object.keys(annotationObjects).length === 0) {
		return;
	}
	const outAnnotationObject = getOrCreateAnnotationList(annotationTarget, annotationLists);
	if (!oCapabilities.MicroChart) {
		delete annotationObjects["@com.sap.vocabularies.UI.v1.Chart"];
	}

	for (let annotationKey in annotationObjects) {
		let annotationObject = annotationObjects[annotationKey];
		switch (annotationKey) {
			case "@com.sap.vocabularies.UI.v1.HeaderFacets":
				if (!oCapabilities.MicroChart) {
					annotationObject = removeChartAnnotations(annotationObject);
					annotationObjects[annotationKey] = annotationObject;
				}
				break;
			case "@com.sap.vocabularies.UI.v1.Identification":
				if (!oCapabilities.IntentBasedNavigation) {
					annotationObject = removeIBNAnnotations(annotationObject);
					annotationObjects[annotationKey] = annotationObject;
				}
				break;
			case "@com.sap.vocabularies.UI.v1.LineItem":
				if (!oCapabilities.IntentBasedNavigation) {
					annotationObject = removeIBNAnnotations(annotationObject);
					annotationObjects[annotationKey] = annotationObject;
				}
				if (!oCapabilities.MicroChart) {
					annotationObject = removeChartAnnotations(annotationObject);
					annotationObjects[annotationKey] = annotationObject;
				}
				break;
			case "@com.sap.vocabularies.UI.v1.FieldGroup":
				if (!oCapabilities.IntentBasedNavigation) {
					annotationObject.Data = removeIBNAnnotations(annotationObject.Data);
					annotationObjects[annotationKey] = annotationObject;
				}
				if (!oCapabilities.MicroChart) {
					annotationObject.Data = removeChartAnnotations(annotationObject.Data);
					annotationObjects[annotationKey] = annotationObject;
				}
				break;
			case "@com.sap.vocabularies.UI.v1.PresentationVariant":
				if (!oCapabilities.Chart && annotationObject.Visualizations) {
					annotationObject.Visualizations = handlePresentationVariant(annotationObject.Visualizations);
					annotationObjects[annotationKey] = annotationObject;
				}
				break;
			default:
				break;
		}

		let currentOutAnnotationObject = outAnnotationObject;

		// Check for annotation of annotation
		const annotationOfAnnotationSplit = annotationKey.split("@");
		if (annotationOfAnnotationSplit.length > 2) {
			currentOutAnnotationObject = getOrCreateAnnotationList(
				annotationTarget + "@" + annotationOfAnnotationSplit[1],
				annotationLists
			);
			annotationKey = annotationOfAnnotationSplit[2];
		} else {
			annotationKey = annotationOfAnnotationSplit[1];
		}

		const annotationQualifierSplit = annotationKey.split("#");
		const qualifier = annotationQualifierSplit[1];
		annotationKey = annotationQualifierSplit[0];

		const parsedAnnotationObject: any = {
			term: `${annotationKey}`,
			qualifier: qualifier
		};
		let currentAnnotationTarget = annotationTarget + "@" + parsedAnnotationObject.term;
		if (qualifier) {
			currentAnnotationTarget += "#" + qualifier;
		}
		let isCollection = false;
		const typeofAnnotation = typeof annotationObject;
		if (annotationObject === null) {
			parsedAnnotationObject.value = { type: "Bool", Bool: annotationObject };
		} else if (typeofAnnotation === "string") {
			parsedAnnotationObject.value = { type: "String", String: annotationObject };
		} else if (typeofAnnotation === "boolean") {
			parsedAnnotationObject.value = { type: "Bool", Bool: annotationObject };
		} else if (typeofAnnotation === "number") {
			parsedAnnotationObject.value = { type: "Int", Int: annotationObject };
		} else if (annotationObject.$If !== undefined) {
			parsedAnnotationObject.value = { type: "If", If: annotationObject.$If };
		} else if (annotationObject.$And !== undefined) {
			parsedAnnotationObject.value = { type: "And", And: annotationObject.$And };
		} else if (annotationObject.$Or !== undefined) {
			parsedAnnotationObject.value = { type: "Or", Or: annotationObject.$Or };
		} else if (annotationObject.$Not !== undefined) {
			parsedAnnotationObject.value = { type: "Not", Not: annotationObject.$Not };
		} else if (annotationObject.$Eq !== undefined) {
			parsedAnnotationObject.value = { type: "Eq", Eq: annotationObject.$Eq };
		} else if (annotationObject.$Ne !== undefined) {
			parsedAnnotationObject.value = { type: "Ne", Ne: annotationObject.$Ne };
		} else if (annotationObject.$Gt !== undefined) {
			parsedAnnotationObject.value = { type: "Gt", Gt: annotationObject.$Gt };
		} else if (annotationObject.$Ge !== undefined) {
			parsedAnnotationObject.value = { type: "Ge", Ge: annotationObject.$Ge };
		} else if (annotationObject.$Lt !== undefined) {
			parsedAnnotationObject.value = { type: "Lt", Lt: annotationObject.$Lt };
		} else if (annotationObject.$Le !== undefined) {
			parsedAnnotationObject.value = { type: "Le", Le: annotationObject.$Le };
		} else if (annotationObject.$Apply !== undefined) {
			parsedAnnotationObject.value = { type: "Apply", Apply: annotationObject.$Apply, Function: annotationObject.$Function };
		} else if (annotationObject.$Path !== undefined) {
			parsedAnnotationObject.value = { type: "Path", Path: annotationObject.$Path };
		} else if (annotationObject.$AnnotationPath !== undefined) {
			parsedAnnotationObject.value = {
				type: "AnnotationPath",
				AnnotationPath: annotationObject.$AnnotationPath
			};
		} else if (annotationObject.$Decimal !== undefined) {
			parsedAnnotationObject.value = { type: "Decimal", Decimal: parseFloat(annotationObject.$Decimal) };
		} else if (annotationObject.$EnumMember !== undefined) {
			parsedAnnotationObject.value = {
				type: "EnumMember",
				EnumMember: mapNameToAlias(annotationObject.$EnumMember.split("/")[0]) + "/" + annotationObject.$EnumMember.split("/")[1]
			};
		} else if (Array.isArray(annotationObject)) {
			isCollection = true;
			parsedAnnotationObject.collection = annotationObject.map((subAnnotationObject, subAnnotationIndex) =>
				parseAnnotationObject(
					subAnnotationObject,
					currentAnnotationTarget + "/" + subAnnotationIndex,
					annotationLists,
					oCapabilities
				)
			);
			if (annotationObject.length > 0) {
				if (annotationObject[0].hasOwnProperty("$PropertyPath")) {
					(parsedAnnotationObject.collection as any).type = "PropertyPath";
				} else if (annotationObject[0].hasOwnProperty("$Path")) {
					(parsedAnnotationObject.collection as any).type = "Path";
				} else if (annotationObject[0].hasOwnProperty("$NavigationPropertyPath")) {
					(parsedAnnotationObject.collection as any).type = "NavigationPropertyPath";
				} else if (annotationObject[0].hasOwnProperty("$AnnotationPath")) {
					(parsedAnnotationObject.collection as any).type = "AnnotationPath";
				} else if (annotationObject[0].hasOwnProperty("$Type")) {
					(parsedAnnotationObject.collection as any).type = "Record";
				} else if (annotationObject[0].hasOwnProperty("$If")) {
					(parsedAnnotationObject.collection as any).type = "If";
				} else if (annotationObject[0].hasOwnProperty("$Or")) {
					(parsedAnnotationObject.collection as any).type = "Or";
				} else if (annotationObject[0].hasOwnProperty("$Eq")) {
					(parsedAnnotationObject.collection as any).type = "Eq";
				} else if (annotationObject[0].hasOwnProperty("$Ne")) {
					(parsedAnnotationObject.collection as any).type = "Ne";
				} else if (annotationObject[0].hasOwnProperty("$Not")) {
					(parsedAnnotationObject.collection as any).type = "Not";
				} else if (annotationObject[0].hasOwnProperty("$Gt")) {
					(parsedAnnotationObject.collection as any).type = "Gt";
				} else if (annotationObject[0].hasOwnProperty("$Ge")) {
					(parsedAnnotationObject.collection as any).type = "Ge";
				} else if (annotationObject[0].hasOwnProperty("$Lt")) {
					(parsedAnnotationObject.collection as any).type = "Lt";
				} else if (annotationObject[0].hasOwnProperty("$Le")) {
					(parsedAnnotationObject.collection as any).type = "Le";
				} else if (annotationObject[0].hasOwnProperty("$And")) {
					(parsedAnnotationObject.collection as any).type = "And";
				} else if (annotationObject[0].hasOwnProperty("$Apply")) {
					(parsedAnnotationObject.collection as any).type = "Apply";
				} else if (typeof annotationObject[0] === "object") {
					(parsedAnnotationObject.collection as any).type = "Record";
				} else {
					(parsedAnnotationObject.collection as any).type = "String";
				}
			}
		} else {
			const record: AnnotationRecord = {
				propertyValues: []
			};
			if (annotationObject.$Type) {
				const typeValue = annotationObject.$Type;
				record.type = `${typeValue}`;
			}
			const propertyValues: any[] = [];
			for (const propertyKey in annotationObject) {
				if (propertyKey !== "$Type" && !propertyKey.startsWith("@")) {
					propertyValues.push(
						parsePropertyValue(
							annotationObject[propertyKey],
							propertyKey,
							currentAnnotationTarget,
							annotationLists,
							oCapabilities
						)
					);
				} else if (propertyKey.startsWith("@")) {
					// Annotation of record
					createAnnotationLists(
						{ [propertyKey]: annotationObject[propertyKey] },
						currentAnnotationTarget,
						annotationLists,
						oCapabilities
					);
				}
			}
			record.propertyValues = propertyValues;
			parsedAnnotationObject.record = record;
		}
		parsedAnnotationObject.isCollection = isCollection;
		currentOutAnnotationObject.annotations.push(parsedAnnotationObject);
	}
}

function prepareProperty(propertyDefinition: any, entityTypeObject: EntityType | ComplexType, propertyName: string): Property {
	const propertyObject: Property = {
		_type: "Property",
		name: propertyName,
		fullyQualifiedName: `${entityTypeObject.fullyQualifiedName}/${propertyName}`,
		type: propertyDefinition.$Type,
		maxLength: propertyDefinition.$MaxLength,
		precision: propertyDefinition.$Precision,
		scale: propertyDefinition.$Scale,
		nullable: propertyDefinition.$Nullable
	};
	return propertyObject;
}

function prepareNavigationProperty(
	navPropertyDefinition: any,
	entityTypeObject: EntityType | ComplexType,
	navPropertyName: string
): V4NavigationProperty {
	let referentialConstraint: ReferentialConstraint[] = [];
	if (navPropertyDefinition.$ReferentialConstraint) {
		referentialConstraint = Object.keys(navPropertyDefinition.$ReferentialConstraint).map(sourcePropertyName => {
			return {
				sourceTypeName: entityTypeObject.name,
				sourceProperty: sourcePropertyName,
				targetTypeName: navPropertyDefinition.$Type,
				targetProperty: navPropertyDefinition.$ReferentialConstraint[sourcePropertyName]
			};
		});
	}
	const navigationProperty: V4NavigationProperty = {
		_type: "NavigationProperty",
		name: navPropertyName,
		fullyQualifiedName: `${entityTypeObject.fullyQualifiedName}/${navPropertyName}`,
		partner: navPropertyDefinition.$Partner,
		isCollection: navPropertyDefinition.$isCollection ? navPropertyDefinition.$isCollection : false,
		containsTarget: navPropertyDefinition.$ContainsTarget,
		targetTypeName: navPropertyDefinition.$Type,
		referentialConstraint
	};

	return navigationProperty;
}

function prepareEntitySet(entitySetDefinition: any, entitySetName: string, entityContainerName: string): EntitySet {
	const entitySetObject: EntitySet = {
		_type: "EntitySet",
		name: entitySetName,
		navigationPropertyBinding: {},
		entityTypeName: entitySetDefinition.$Type,
		fullyQualifiedName: `${entityContainerName}/${entitySetName}`
	};
	return entitySetObject;
}

function prepareSingleton(singletonDefinition: any, singletonName: string, entityContainerName: string): Singleton {
	const singletonObject: Singleton = {
		_type: "Singleton",
		name: singletonName,
		navigationPropertyBinding: {},
		typeName: singletonDefinition.$Type,
		fullyQualifiedName: `${entityContainerName}/${singletonName}`,
		nullable: true
	};
	return singletonObject;
}

function prepareComplexType(complexTypeDefinition: any, complexTypeName: string, namespace: string): ComplexType {
	const complexTypeObject: ComplexType = {
		_type: "ComplexType",
		name: complexTypeName.replace(namespace + ".", ""),
		fullyQualifiedName: complexTypeName,
		properties: [],
		navigationProperties: []
	};

	const complexTypeProperties = Object.keys(complexTypeDefinition)
		.filter(propertyNameOrNot => {
			if (propertyNameOrNot != "$Key" && propertyNameOrNot != "$kind") {
				return complexTypeDefinition[propertyNameOrNot].$kind === "Property";
			}
		})
		.sort((a, b) => (a > b ? 1 : -1))
		.map(propertyName => {
			return prepareProperty(complexTypeDefinition[propertyName], complexTypeObject, propertyName);
		});

	complexTypeObject.properties = complexTypeProperties;
	const complexTypeNavigationProperties = Object.keys(complexTypeDefinition)
		.filter(propertyNameOrNot => {
			if (propertyNameOrNot != "$Key" && propertyNameOrNot != "$kind") {
				return complexTypeDefinition[propertyNameOrNot].$kind === "NavigationProperty";
			}
		})
		.sort((a, b) => (a > b ? 1 : -1))
		.map(navPropertyName => {
			return prepareNavigationProperty(complexTypeDefinition[navPropertyName], complexTypeObject, navPropertyName);
		});
	complexTypeObject.navigationProperties = complexTypeNavigationProperties;
	return complexTypeObject;
}

function prepareEntityKeys(entityTypeDefinition: any, oMetaModelData: any): any {
	if (!entityTypeDefinition.$Key && entityTypeDefinition.$BaseType) {
		return prepareEntityKeys(oMetaModelData[`${entityTypeDefinition.$BaseType}`], oMetaModelData);
	}
	return entityTypeDefinition.$Key || []; //handling of entity types without key as well as basetype
}

function prepareEntityType(entityTypeDefinition: any, entityTypeName: string, namespace: string, metaModelData: any): EntityType {
	const entityKeys: any = prepareEntityKeys(entityTypeDefinition, metaModelData);

	const entityTypeObject: EntityType = {
		_type: "EntityType",
		name: entityTypeName.replace(namespace + ".", ""),
		fullyQualifiedName: entityTypeName,
		keys: [],
		entityProperties: [],
		navigationProperties: []
	};

	const entityProperties = Object.keys(entityTypeDefinition)
		.filter(propertyNameOrNot => {
			if (propertyNameOrNot != "$Key" && propertyNameOrNot != "$kind") {
				return entityTypeDefinition[propertyNameOrNot].$kind === "Property";
			}
		})
		.map(propertyName => {
			return prepareProperty(entityTypeDefinition[propertyName], entityTypeObject, propertyName);
		});

	const navigationProperties = Object.keys(entityTypeDefinition)
		.filter(propertyNameOrNot => {
			if (propertyNameOrNot != "$Key" && propertyNameOrNot != "$kind") {
				return entityTypeDefinition[propertyNameOrNot].$kind === "NavigationProperty";
			}
		})
		.map(navPropertyName => {
			return prepareNavigationProperty(entityTypeDefinition[navPropertyName], entityTypeObject, navPropertyName);
		});

	entityTypeObject.keys = entityKeys
		.map((entityKey: string) => entityProperties.find((property: Property) => property.name === entityKey))
		.filter((property: Property) => property !== undefined);
	entityTypeObject.entityProperties = entityProperties;
	entityTypeObject.navigationProperties = navigationProperties;

	return entityTypeObject;
}
function prepareAction(actionName: string, actionRawData: MetaModelAction, namespace: string, entityContainerName: string): Action {
	let actionEntityType: string = "";
	let actionFQN = `${actionName}`;
	const actionShortName = actionName.substr(namespace.length + 1);
	if (actionRawData.$IsBound) {
		const bindingParameter = actionRawData.$Parameter[0];
		actionEntityType = bindingParameter.$Type;
		if (bindingParameter.$isCollection === true) {
			actionFQN = `${actionName}(Collection(${actionEntityType}))`;
		} else {
			actionFQN = `${actionName}(${actionEntityType})`;
		}
	} else {
		actionFQN = `${entityContainerName}/${actionShortName}`;
	}
	const parameters = actionRawData.$Parameter || [];
	return {
		_type: "Action",
		name: actionShortName,
		fullyQualifiedName: actionFQN,
		isBound: actionRawData.$IsBound,
		sourceType: actionEntityType,
		returnType: actionRawData.$ReturnType ? actionRawData.$ReturnType.$Type : "",
		parameters: parameters.map(param => {
			return {
				_type: "ActionParameter",
				isEntitySet: param.$Type === actionRawData.$EntitySetPath,
				fullyQualifiedName: `${actionFQN}/${param.$Name}`,
				type: param.$Type
				// TODO missing properties ?
			};
		})
	};
}
export function prepareEntityTypes(
	oMetaModel: ODataMetaModel,
	oCapabilities: EnvironmentCapabilities = DefaultEnvironmentCapabilities
): ParserOutput {
	const oMetaModelData = oMetaModel.getObject("/$");
	const annotationLists: Record<string, AnnotationList> = {};
	const entityTypes: EntityType[] = [];
	const entitySets: EntitySet[] = [];
	const singletons: Singleton[] = [];
	const complexTypes: ComplexType[] = [];
	const entityContainerName = oMetaModelData.$EntityContainer;
	let namespace = "";
	const schemaKeys = Object.keys(oMetaModelData).filter(metamodelKey => oMetaModelData[metamodelKey].$kind === "Schema");
	if (schemaKeys && schemaKeys.length > 0) {
		namespace = schemaKeys[0].substr(0, schemaKeys[0].length - 1);
	} else if (entityTypes && entityTypes.length) {
		namespace = entityTypes[0].fullyQualifiedName.replace(entityTypes[0].name, "");
		namespace = namespace.substr(0, namespace.length - 1);
	}
	Object.keys(oMetaModelData).forEach(sObjectName => {
		if (sObjectName !== "$kind") {
			switch (oMetaModelData[sObjectName].$kind) {
				case "EntityType":
					const entityType = prepareEntityType(oMetaModelData[sObjectName], sObjectName, namespace, oMetaModelData);
					// Check if there are filter facets defined for the entityType and if yes, check if all of them have an ID
					// The ID is optional, but it is internally taken for grouping filter fields and if it's not present
					// a fallback ID needs to be generated here.
					if (
						oMetaModelData.$Annotations[entityType.fullyQualifiedName] &&
						oMetaModelData.$Annotations[entityType.fullyQualifiedName]["@com.sap.vocabularies.UI.v1.FilterFacets"]
					) {
						oMetaModelData.$Annotations[entityType.fullyQualifiedName]["@com.sap.vocabularies.UI.v1.FilterFacets"].forEach(
							(filterFacetAnnotation: any) => {
								filterFacetAnnotation.ID = filterFacetAnnotation.ID || generate([{ Facet: filterFacetAnnotation }]);
							}
						);
					}
					entityType.entityProperties.forEach(entityProperty => {
						if (!oMetaModelData.$Annotations[entityProperty.fullyQualifiedName]) {
							oMetaModelData.$Annotations[entityProperty.fullyQualifiedName] = {};
						}
						if (
							!oMetaModelData.$Annotations[entityProperty.fullyQualifiedName]["@com.sap.vocabularies.UI.v1.DataFieldDefault"]
						) {
							oMetaModelData.$Annotations[entityProperty.fullyQualifiedName][
								"@com.sap.vocabularies.UI.v1.DataFieldDefault"
							] = {
								$Type: "com.sap.vocabularies.UI.v1.DataField",
								Value: { $Path: entityProperty.name }
							};
						}
					});
					entityTypes.push(entityType);
					break;
				case "ComplexType":
					const complexType = prepareComplexType(oMetaModelData[sObjectName], sObjectName, namespace);
					complexTypes.push(complexType);
					break;
			}
		}
	});

	const oEntityContainer = oMetaModelData[entityContainerName];
	Object.keys(oEntityContainer).forEach(sObjectName => {
		if (sObjectName !== "$kind") {
			switch (oEntityContainer[sObjectName].$kind) {
				case "EntitySet":
					const entitySet = prepareEntitySet(oEntityContainer[sObjectName], sObjectName, entityContainerName);
					entitySets.push(entitySet);
					break;
				case "Singleton":
					const singleton = prepareSingleton(oEntityContainer[sObjectName], sObjectName, entityContainerName);
					singletons.push(singleton);
					break;
			}
		}
	});

	let entityContainer: EntityContainer = {};
	if (entityContainerName) {
		entityContainer = {
			name: entityContainerName.replace(namespace + ".", ""),
			fullyQualifiedName: entityContainerName
		};
	}
	entitySets.forEach(entitySet => {
		const navPropertyBindings = oEntityContainer[entitySet.name].$NavigationPropertyBinding;
		if (navPropertyBindings) {
			Object.keys(navPropertyBindings).forEach(navPropName => {
				const targetEntitySet = entitySets.find(entitySetName => entitySetName.name === navPropertyBindings[navPropName]);
				if (targetEntitySet) {
					entitySet.navigationPropertyBinding[navPropName] = targetEntitySet;
				}
			});
		}
	});

	const actions: Action[] = Object.keys(oMetaModelData)
		.filter(key => {
			return Array.isArray(oMetaModelData[key]) && oMetaModelData[key].length > 0 && oMetaModelData[key][0].$kind === "Action";
		})
		.reduce((outActions: Action[], actionName) => {
			const actions = oMetaModelData[actionName];
			actions.forEach((action: MetaModelAction) => {
				outActions.push(prepareAction(actionName, action, namespace, entityContainerName));
			});
			return outActions;
		}, []);

	for (const target in oMetaModelData.$Annotations) {
		createAnnotationLists(oMetaModelData.$Annotations[target], target, annotationLists, oCapabilities);
	}

	// Sort by target length
	const outAnnotationLists = Object.keys(annotationLists)
		.sort((a, b) => (a.length >= b.length ? 1 : -1))
		.map(sAnnotationName => annotationLists[sAnnotationName]);
	const references: Reference[] = [];
	return {
		identification: "metamodelResult",
		version: "4.0",
		schema: {
			entityContainer,
			entitySets,
			entityTypes,
			complexTypes,
			singletons,
			associations: [],
			actions,
			namespace,
			annotations: {
				"metamodelResult": outAnnotationLists
			}
		},
		references: references
	};
}

const mMetaModelMap: Record<string, ParserOutput> = {};

/**
 * Convert the ODataMetaModel into another format that allow for easy manipulation of the annotations.
 *
 * @param {ODataMetaModel} oMetaModel The current oDataMetaModel
 * @param oCapabilities The current capabilities
 * @returns {ConverterOutput} An object containing object like annotation
 */
export function convertTypes(oMetaModel: ODataMetaModel, oCapabilities?: EnvironmentCapabilities): ConverterOutput {
	const sMetaModelId = (oMetaModel as any).id;
	if (!mMetaModelMap.hasOwnProperty(sMetaModelId)) {
		const parsedOutput = prepareEntityTypes(oMetaModel, oCapabilities);
		mMetaModelMap[sMetaModelId] = AnnotationConverter.convertTypes(parsedOutput);
	}
	return (mMetaModelMap[sMetaModelId] as any) as ConverterOutput;
}

export function deleteModelCacheData(oMetaModel: ODataMetaModel) {
	delete mMetaModelMap[(oMetaModel as any).id];
}

export function convertMetaModelContext(oMetaModelContext: Context<ODataMetaModel>, bIncludeVisitedObjects: boolean = false): any {
	const oConverterOutput = convertTypes(oMetaModelContext.getModel());
	const sPath = oMetaModelContext.getPath();

	const aPathSplit = sPath.split("/");
	let targetEntitySet: _EntitySet = oConverterOutput.entitySets.find(entitySet => entitySet.name === aPathSplit[1]) as _EntitySet;
	let relativePath = aPathSplit.slice(2).join("/");

	const localObjects: any[] = [targetEntitySet];
	while (relativePath && relativePath.length > 0 && relativePath.startsWith("$NavigationPropertyBinding")) {
		let relativeSplit = relativePath.split("/");
		let idx = 0;
		let currentEntitySet, sNavPropToCheck;

		relativeSplit = relativeSplit.slice(1); // Removing "$NavigationPropertyBinding"
		while (!currentEntitySet && relativeSplit.length > idx && relativeSplit[idx] !== "$NavigationPropertyBinding") {
			// Finding the correct entitySet for the navigaiton property binding example: "Set/_SalesOrder"
			sNavPropToCheck = relativeSplit.slice(0, idx + 1).join("/");
			currentEntitySet = targetEntitySet && targetEntitySet.navigationPropertyBinding[sNavPropToCheck];
			idx++;
		}
		if (!currentEntitySet) {
			// Fall back to Single nav prop if entitySet is not found.
			sNavPropToCheck = relativeSplit[0];
		}
		const aNavProps = sNavPropToCheck?.split("/") || [];
		let targetEntityType = targetEntitySet && targetEntitySet.entityType;
		for (const sNavProp of aNavProps) {
			// Pushing all nav props to the visited objects. example: "Set", "_SalesOrder" for "Set/_SalesOrder"(in NavigationPropertyBinding)
			const targetNavProp = targetEntityType && targetEntityType.navigationProperties.find(navProp => navProp.name === sNavProp);
			if (targetNavProp) {
				localObjects.push(targetNavProp);
				targetEntityType = targetNavProp.targetType;
			} else {
				break;
			}
		}
		targetEntitySet =
			(targetEntitySet && currentEntitySet) || (targetEntitySet && targetEntitySet.navigationPropertyBinding[relativeSplit[0]]);
		if (targetEntitySet) {
			// Pushing the target entitySet to visited objects
			localObjects.push(targetEntitySet);
		}
		// Re-calculating the relative path
		relativePath = relativeSplit.slice(aNavProps.length || 1).join("/");
	}
	if (relativePath.startsWith("$Type")) {
		// We're anyway going to look on the entityType...
		relativePath = aPathSplit.slice(3).join("/");
	}
	if (targetEntitySet && relativePath.length) {
		const oTarget = targetEntitySet.entityType.resolvePath(relativePath, bIncludeVisitedObjects);
		if (oTarget) {
			if (bIncludeVisitedObjects) {
				oTarget.visitedObjects = localObjects.concat(oTarget.visitedObjects);
			}
		} else if (targetEntitySet.entityType && targetEntitySet.entityType.actions) {
			// if target is an action or an action parameter
			const actions = targetEntitySet.entityType && targetEntitySet.entityType.actions;
			const relativeSplit = relativePath.split("/");
			if (actions[relativeSplit[0]]) {
				const action = actions[relativeSplit[0]];
				if (relativeSplit[1] && action.parameters) {
					const parameterName = relativeSplit[1];
					const targetParameter = action.parameters.find(parameter => {
						return parameter.fullyQualifiedName.endsWith("/" + parameterName);
					});
					return targetParameter;
				} else if (relativePath.length === 1) {
					return action;
				}
			}
		}
		return oTarget;
	} else {
		if (bIncludeVisitedObjects) {
			return {
				target: targetEntitySet,
				visitedObjects: localObjects
			};
		}
		return targetEntitySet;
	}
}

type ConverterObject = {
	_type: string;
	name: string;
};
export type ResolvedTarget = {
	target?: ConverterObject;
	visitedObjects: ConverterObject[];
};

export function getInvolvedDataModelObjects(
	oMetaModelContext: Context<ODataMetaModel>,
	oEntitySetMetaModelContext?: Context<ODataMetaModel>
): DataModelObjectPath {
	const metaModelContext = convertMetaModelContext(oMetaModelContext, true);
	let targetEntitySetLocation;
	if (oEntitySetMetaModelContext && oEntitySetMetaModelContext.getPath() !== "/") {
		targetEntitySetLocation = getInvolvedDataModelObjects(oEntitySetMetaModelContext);
	}
	return getInvolvedDataModelObjectFromPath(metaModelContext, targetEntitySetLocation);
}

export function getInvolvedDataModelObjectFromPath(
	metaModelContext: ResolvedTarget,
	targetEntitySetLocation?: DataModelObjectPath
): DataModelObjectPath {
	const dataModelObjects = metaModelContext.visitedObjects.filter(
		(visitedObject: any) => visitedObject && visitedObject.hasOwnProperty("_type") && visitedObject._type !== "EntityType"
	);
	if (metaModelContext.target && metaModelContext.target.hasOwnProperty("_type") && metaModelContext.target._type !== "EntityType") {
		dataModelObjects.push(metaModelContext.target);
	}
	const navigationProperties: _NavigationProperty[] = [];
	const rootEntitySet: _EntitySet = dataModelObjects[0] as _EntitySet;
	// currentEntitySet can be undefined.
	let currentEntitySet: _EntitySet | undefined = rootEntitySet as _EntitySet;
	let currentEntityType: _EntityType = rootEntitySet.entityType;
	let i = 1;
	let currentObject;
	let navigatedPaths = [];
	while (i < dataModelObjects.length) {
		currentObject = dataModelObjects[i++];
		if (currentObject._type === "NavigationProperty") {
			navigatedPaths.push(currentObject.name);
			navigationProperties.push(currentObject as _NavigationProperty);
			currentEntityType = (currentObject as _NavigationProperty).targetType;
			if (currentEntitySet && currentEntitySet.navigationPropertyBinding.hasOwnProperty(navigatedPaths.join("/"))) {
				currentEntitySet = currentEntitySet.navigationPropertyBinding[currentObject.name];
				navigatedPaths = [];
			} else {
				currentEntitySet = undefined;
			}
		}
		if (currentObject._type === "EntitySet") {
			currentEntitySet = currentObject as _EntitySet;
			currentEntityType = currentEntitySet.entityType;
		}
	}

	if (targetEntitySetLocation && targetEntitySetLocation.startingEntitySet !== rootEntitySet) {
		// In case the entityset is not starting from the same location it may mean that we are doing too much work earlier for some reason
		// As such we need to redefine the context source for the targetEntitySetLocation
		const startingIndex = dataModelObjects.indexOf(targetEntitySetLocation.startingEntitySet);
		if (startingIndex !== -1) {
			// If it's not found I don't know what we can do (probably nothing)
			const requiredDataModelObjects = dataModelObjects.slice(0, startingIndex);
			targetEntitySetLocation.startingEntitySet = rootEntitySet;
			targetEntitySetLocation.navigationProperties = requiredDataModelObjects
				.filter((object: any) => object._type === "NavigationProperty")
				.concat(targetEntitySetLocation.navigationProperties) as _NavigationProperty[];
		}
	}
	const outDataModelPath = {
		startingEntitySet: rootEntitySet,
		targetEntitySet: currentEntitySet,
		targetEntityType: currentEntityType,
		targetObject: metaModelContext.target,
		navigationProperties,
		contextLocation: targetEntitySetLocation
	};
	if (!outDataModelPath.contextLocation) {
		outDataModelPath.contextLocation = outDataModelPath;
	}
	return outDataModelPath;
}
