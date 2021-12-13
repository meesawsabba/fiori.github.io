import ConverterContext from "../../ConverterContext";
import { annotationExpression, BindingExpression, compileBinding } from "sap/fe/core/helpers/BindingExpression";
enum AvatarShape {
	Circle = "Circle",
	Square = "Square"
}

export type Avatar = {
	src?: BindingExpression<string>;
	initials: BindingExpression<string>;
	fallbackIcon?: BindingExpression<string>;
	displayShape: BindingExpression<string>;
};

const isNaturalPerson = (converterContext: ConverterContext): Boolean => {
	return converterContext.getEntityType().annotations.Common?.IsNaturalPerson?.valueOf() === true;
};

const getFallBackIcon = (converterContext: ConverterContext): BindingExpression<string> | undefined => {
	const headerInfo = converterContext.getEntityType().annotations?.UI?.HeaderInfo;
	if (!headerInfo || (headerInfo && !headerInfo.ImageUrl && !headerInfo.TypeImageUrl)) {
		return undefined;
	}
	if (headerInfo.ImageUrl && headerInfo.TypeImageUrl) {
		return compileBinding(annotationExpression(headerInfo.TypeImageUrl));
	}
	return compileBinding(isNaturalPerson(converterContext) ? "sap-icon://person-placeholder" : "sap-icon://product");
};

const getSource = (converterContext: ConverterContext): BindingExpression<string> | undefined => {
	const headerInfo = converterContext.getEntityType().annotations?.UI?.HeaderInfo;
	if (!headerInfo || !(headerInfo.ImageUrl || headerInfo.TypeImageUrl)) {
		return undefined;
	}
	return compileBinding(annotationExpression(headerInfo.ImageUrl || headerInfo.TypeImageUrl));
};

export const getAvatar = (converterContext: ConverterContext): Avatar | undefined => {
	const headerInfo = converterContext.getEntityType().annotations?.UI?.HeaderInfo;
	const oSource: any = headerInfo && (headerInfo.ImageUrl || headerInfo.TypeImageUrl || headerInfo.Initials);
	if (!oSource) {
		return undefined;
	}
	return {
		src: getSource(converterContext),
		initials: compileBinding(annotationExpression(headerInfo?.Initials || "")),
		fallbackIcon: getFallBackIcon(converterContext),
		displayShape: compileBinding(isNaturalPerson(converterContext) ? AvatarShape.Circle : AvatarShape.Square)
	};
};
