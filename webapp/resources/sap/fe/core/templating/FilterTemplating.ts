import ConverterContext from "sap/fe/core/converters/ConverterContext";
import { Property } from "@sap-ux/annotation-converter";

export function getIsRequired(converterContext: ConverterContext, sPropertyPath: string): boolean {
	const entitySetAnnotations = converterContext.getEntitySet()?.annotations;
	const aRequiredProperties = entitySetAnnotations?.Capabilities?.FilterRestrictions?.RequiredProperties as any[];
	let bIsRequired = false;
	if (aRequiredProperties) {
		aRequiredProperties.forEach(function(oRequiredProperty) {
			if (sPropertyPath === oRequiredProperty?.value) {
				bIsRequired = true;
			}
		});
	}
	return bIsRequired;
}

export function isPropertyFilterable(converterContext: ConverterContext, valueListProperty: string): boolean | undefined {
	let bNotFilterable, bHidden;
	const entityType = converterContext.getEntityType();
	const entitySetAnnotations = converterContext.getEntitySet()?.annotations;
	const nonFilterableProperties = entitySetAnnotations?.Capabilities?.FilterRestrictions?.NonFilterableProperties as any[];
	const properties = entityType.entityProperties;
	properties.forEach((property: Property) => {
		const PropertyPath = property.name;
		if (PropertyPath === valueListProperty) {
			bHidden = property.annotations?.UI?.Hidden?.valueOf();
		}
	});
	if (nonFilterableProperties && nonFilterableProperties.length > 0) {
		for (let i = 0; i < nonFilterableProperties.length; i++) {
			const sPropertyName = nonFilterableProperties[i]?.value;
			if (sPropertyName === valueListProperty) {
				bNotFilterable = true;
			}
		}
	}
	return bNotFilterable || bHidden;
}
