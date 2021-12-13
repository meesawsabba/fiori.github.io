/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)
        (c) Copyright 2009-2021 SAP SE. All rights reserved
    
 */
import { MacroMetadata } from "sap/fe/macros";
import {
	bindingExpression,
	BindingExpressionExpression,
	compileBinding,
	formatResult,
	UnresolveableBindingExpression
} from "sap/fe/core/helpers/BindingExpression";
import kpiFormatters from "sap/fe/core/formatters/KPIFormatter";

/**
 * @classdesc A building block used to display a KPI in the Analytical List Page
 *
 * @hideconstructor
 * @class sap.fe.macros.KPITag
 * @private
 * @experimental
 */
const KPITag = MacroMetadata.extend("sap.fe.macros.KPITag", {
	/**
	 * Name
	 */
	name: "KPITag",
	/**
	 * Namespace
	 */
	namespace: "sap.fe.macros",
	/**
	 * Fragment source
	 */
	fragment: "sap.fe.macros.KPITag",
	/**
	 * Metadata
	 */
	metadata: {
		/**
		 * Define macro stereotype for documentation
		 */
		stereotype: "xmlmacro",
		/**
		 * Properties.
		 */
		properties: {
			/**
			 * The ID of the KPI
			 */
			id: {
				type: "string",
				required: true
			},
			/**
			 * Shall be true if the KPI value has an associated currency or unit of measure
			 */
			hasUnit: {
				type: "boolean",
				required: false
			},
			/**
			 * Path to the DataPoint annotation of the KPI
			 */
			metaPath: {
				type: "sap.ui.model.Context",
				required: true
			}
		},
		aggregations: {}
	},
	create: function(oProps: any) {
		// KPI tag label and tooltip
		const kpiTitle = oProps.metaPath.getProperty("Title");
		if (kpiTitle) {
			const bindingParts = kpiTitle.match(/{(.*)>(.*)}/); // Check if the title is a binding expr '{model>prop}'
			let titleExpression: BindingExpressionExpression<any> | UnresolveableBindingExpression;
			if (bindingParts) {
				// KPI title is a binding expression (localized)
				titleExpression = bindingExpression(bindingParts[2], bindingParts[1]);
			} else {
				// KPI Title is a constant
				titleExpression = kpiTitle;
			}

			const labelExpression = formatResult([titleExpression], kpiFormatters.labelFormat);
			oProps.label = compileBinding(labelExpression);

			const tooltipExpression = formatResult(
				[
					titleExpression,
					bindingExpression("/" + oProps.id + "/manifest/sap.card/data/json/mainValueUnscaled", "kpiModel"),
					bindingExpression("/" + oProps.id + "/manifest/sap.card/data/json/mainUnit", "kpiModel"),
					bindingExpression("/" + oProps.id + "/manifest/sap.card/data/json/mainCriticality", "kpiModel"),
					oProps.hasUnit
				],
				kpiFormatters.tooltipFormat
			);
			oProps.tooltip = compileBinding(tooltipExpression);
		}

		return oProps;
	}
});
export default KPITag;
