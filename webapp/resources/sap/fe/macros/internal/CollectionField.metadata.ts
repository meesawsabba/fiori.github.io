/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)
        (c) Copyright 2009-2021 SAP SE. All rights reserved
    
 */

import { MacroMetadata } from "sap/fe/macros";
import * as MetaModelConverter from "sap/fe/core/converters/MetaModelConverter";
import { getDisplayMode } from "sap/fe/core/templating/UIFormatters";
import { UI } from "sap/fe/core/converters/helpers/BindingHelper";
import { getVisibleExpression, FieldFormatOptions, getValueBinding } from "sap/fe/macros/field/FieldTemplating";
import {
	and,
	ifElse,
	annotationExpression,
	BindingExpression,
	constant,
	compileBinding,
	Expression
} from "sap/fe/core/helpers/BindingExpression";
import * as DataModelPathHelper from "sap/fe/core/templating/DataModelPathHelper";
import { Property } from "@sap-ux/annotation-converter";

type MultiInputSettings = {
	text: Expression<string> | BindingExpression<string>;
	collection: BindingExpression<string>;
	key: Expression<string> | BindingExpression<string>;
};
/**
 * @classdesc
 * Building block for creating a CollectionField based on the metadata provided by OData V4.
 * <br>
 * Usually, a DataField annotation is expected
 *
 * Usage example:
 * <pre>
 * <internalMacro:CollectionField
 *   idPrefix="SomePrefix"
 *   contextPath="{entitySet>}"
 *   metaPath="{dataField>}"
 * />
 * </pre>
 *
 * @class sap.fe.macros.internal.CollectionField
 * @hideconstructor
 * @private
 * @experimental
 * @since 1.94.0
 */
const CollectionField = MacroMetadata.extend("sap.fe.macros.internal.CollectionField", {
	/**
	 * Define building block stereotype for documentation
	 */
	name: "CollectionField",
	/**
	 * Namespace of the building block
	 */
	namespace: "sap.fe.macros.internal",
	/**
	 * Fragment source of the building block (optional)
	 */
	fragment: "sap.fe.macros.internal.CollectionField",

	/**
	 * The metadata describing the building block
	 */
	metadata: {
		/**
		 * Define building block stereotype for documentation purpose
		 */
		stereotype: "xmlmacro",
		/**
		 * Properties.
		 */
		properties: {
			/**
			 * Prefix added to the generated ID of the field
			 */
			idPrefix: {
				type: "string"
			},
			/**
			 * Prefix added to the generated ID of the value help used for the field
			 */
			vhIdPrefix: {
				type: "string",
				defaultValue: "FieldValueHelp"
			},

			_vhFlexId: {
				type: "string",
				computed: true
			},
			/**
			 * Metadata path to the CollectionField.
			 * This property is usually a metadataContext pointing to a DataField having a Value that uses a 1:n navigation
			 */
			metaPath: {
				type: "sap.ui.model.Context",
				required: true,
				$kind: "Property"
			},
			/**
			 * Property added to associate the label with the CollectionField
			 */
			ariaLabelledBy: {
				type: "string"
			},
			formatOptions: {
				type: "object",
				properties: {}
			},
			/**
			 * Mandatory context to the CollectionField
			 */
			contextPath: {
				type: "sap.ui.model.Context",
				required: true,
				$kind: ["EntitySet", "NavigationProperty"]
			}
		}
	},
	create: function(oProps: any) {
		let oDataModelPath = MetaModelConverter.getInvolvedDataModelObjects(oProps.metaPath, oProps.contextPath);
		const oDataFieldConverted = MetaModelConverter.convertMetaModelContext(oProps.metaPath);
		const oPropertyPath = oDataFieldConverted.Value.$target;
		const sExtraPath = oDataFieldConverted.Value.path;

		oProps.visible = getVisibleExpression(oDataModelPath, oProps.formatOptions);
		if (sExtraPath && sExtraPath.length > 0) {
			oDataModelPath = DataModelPathHelper.enhanceDataModelPath(oDataModelPath, sExtraPath);
		}
		const bInsertable = DataModelPathHelper.isPathInsertable(oDataModelPath);
		const bDeletable = DataModelPathHelper.isPathDeletable(oDataModelPath);
		oProps.editMode = compileBinding(ifElse(and(bInsertable, bDeletable, UI.IsEditable), constant("Editable"), constant("Display")));
		oProps.displayMode = getDisplayMode(oPropertyPath, oDataModelPath);

		const multiInputSettings = CollectionField._getMultiInputSettings(oDataModelPath, oProps.formatOptions);
		oProps.text = multiInputSettings.text;
		oProps.collection = multiInputSettings.collection;
		oProps.key = multiInputSettings.key;
		return oProps;
	},
	_getMultiInputSettings: function(
		oPropertyDataModelObjectPath: DataModelPathHelper.DataModelObjectPath,
		formatOptions: FieldFormatOptions
	): MultiInputSettings {
		const collectionPath =
			"{path:'" +
			DataModelPathHelper.getTargetEntitySetPath(oPropertyDataModelObjectPath, true) +
			"',  parameters : { $$groupId : '$auto.Workers' } , templateShareable: false}";

		const navs = DataModelPathHelper.getTargetEntitySetNavigation(oPropertyDataModelObjectPath);
		const oRelativePropertyDataModelObjectPath = Object.assign({}, oPropertyDataModelObjectPath);
		if (oRelativePropertyDataModelObjectPath.contextLocation) {
			oRelativePropertyDataModelObjectPath.contextLocation.navigationProperties = navs;
		}
		const oPropertyDefinition =
			oPropertyDataModelObjectPath.targetObject.type === "PropertyPath"
				? (oPropertyDataModelObjectPath.targetObject.$target as Property)
				: (oPropertyDataModelObjectPath.targetObject as Property);
		const commonText = oPropertyDefinition.annotations?.Common?.Text;
		const relativeLocation = DataModelPathHelper.getPathRelativeLocation(
			oPropertyDataModelObjectPath.contextLocation,
			oPropertyDataModelObjectPath.navigationProperties
		).map(np => np.name);

		const textExpression = commonText
			? compileBinding(annotationExpression(commonText, relativeLocation) as Expression<string>)
			: getValueBinding(oRelativePropertyDataModelObjectPath, formatOptions, true);
		return {
			text: textExpression,
			collection: collectionPath,
			key: getValueBinding(oRelativePropertyDataModelObjectPath, formatOptions, true)
		};
	}
});

export default CollectionField;
