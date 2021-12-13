import {
	ChartManifestConfiguration,
	ChartPersonalizationManifestSettings,
	VisualizationType,
	ActionType,
	TemplateType
} from "../../ManifestSettings";
import { ChartDefinitionTypeTypes, DataFieldAbstractTypes } from "@sap-ux/vocabularies-types";
import { AnnotationAction, BaseAction, getActionsFromManifest } from "sap/fe/core/converters/controls/Common/Action";
import { isDataFieldForActionAbstract } from "sap/fe/core/converters/annotations/DataField";
import { ChartID, FilterBarID } from "../../helpers/ID";
import { insertCustomElements } from "sap/fe/core/converters/helpers/ConfigurableObject";
import { KeyHelper } from "sap/fe/core/converters/helpers/Key";
import { getTargetObjectPath } from "sap/fe/core/templating/DataModelPathHelper";
import { AggregationHelper } from "../../helpers/Aggregation";
import ManifestWrapper from "../../ManifestWrapper";
import ConverterContext from "../../ConverterContext";

/**
 * @typedef ChartVisualization
 */
export type ChartVisualization = {
	type: VisualizationType.Chart;
	id: string;
	collection: string;
	entityName: string;
	personalization?: string;
	navigationPath: string;
	annotationPath: string;
	filterId?: string;
	vizProperties: string;
	actions: BaseAction[];
	title: string;
	autoBindOnInit: boolean | undefined;
	onSegmentedButtonPressed: string;
	visible: string;
	customAgg: object;
	transAgg: object;
	applySupported: object;
};

/**
 * Method to retrieve all chart actions from annotations.
 *
 * @param chartAnnotation
 * @param visualizationPath
 * @param converterContext
 * @returns {BaseAction[]} The table annotation actions
 */
function getChartActionsFromAnnotations(
	chartAnnotation: ChartDefinitionTypeTypes,
	visualizationPath: string,
	converterContext: ConverterContext
): BaseAction[] {
	const chartActions: BaseAction[] = [];
	if (chartAnnotation) {
		const aActions = chartAnnotation.Actions || [];
		aActions.forEach((dataField: DataFieldAbstractTypes) => {
			let chartAction: AnnotationAction | undefined;
			if (
				isDataFieldForActionAbstract(dataField) &&
				!(dataField.annotations?.UI?.Hidden?.valueOf() === true) &&
				!dataField.Inline &&
				!dataField.Determining &&
				!(dataField as any)?.ActionTarget?.isBound
			) {
				const key = KeyHelper.generateKeyFromDataField(dataField);
				switch (dataField.$Type) {
					case "com.sap.vocabularies.UI.v1.DataFieldForAction":
						chartAction = {
							type: ActionType.DataFieldForAction,
							annotationPath: converterContext.getEntitySetBasedAnnotationPath(dataField.fullyQualifiedName),
							key: key
						};
						break;

					case "com.sap.vocabularies.UI.v1.DataFieldForIntentBasedNavigation":
						chartAction = {
							type: ActionType.DataFieldForIntentBasedNavigation,
							annotationPath: converterContext.getEntitySetBasedAnnotationPath(dataField.fullyQualifiedName),
							key: key
						};
						break;
				}
			}
			if (chartAction) {
				chartActions.push(chartAction);
			}
		});
	}
	return chartActions;
}

export function getChartActions(
	chartAnnotation: ChartDefinitionTypeTypes,
	visualizationPath: string,
	converterContext: ConverterContext
): BaseAction[] {
	const aAnnotationActions: BaseAction[] = getChartActionsFromAnnotations(chartAnnotation, visualizationPath, converterContext);

	return insertCustomElements(
		aAnnotationActions,
		getActionsFromManifest(
			converterContext.getManifestControlConfiguration(visualizationPath).actions,
			converterContext,
			aAnnotationActions
		),
		{ enableOnSelect: "overwrite", enabled: "overwrite" }
	);
}

export function getP13nMode(visualizationPath: string, converterContext: ConverterContext): string | undefined {
	const manifestWrapper: ManifestWrapper = converterContext.getManifestWrapper();
	const chartManifestSettings: ChartManifestConfiguration = converterContext.getManifestControlConfiguration(visualizationPath);
	const hasVariantManagement: boolean = ["Page", "Control"].indexOf(manifestWrapper.getVariantManagement()) > -1;
	let personalization: ChartPersonalizationManifestSettings = true;
	const aPersonalization: string[] = [];
	if (chartManifestSettings?.chartSettings?.personalization !== undefined) {
		personalization = chartManifestSettings.chartSettings.personalization;
	}
	if (hasVariantManagement && personalization) {
		if (personalization === true) {
			return "Sort,Type,Item";
		} else if (typeof personalization === "object") {
			if (personalization.type) {
				aPersonalization.push("Type");
			}
			if (personalization.item) {
				aPersonalization.push("Item");
			}
			if (personalization.sort) {
				aPersonalization.push("Sort");
			}
			return aPersonalization.join(",");
		}
	}
	return undefined;
}

/**
 * Create the ChartVisualization configuration that will be used to display a chart via Chart Macro.
 *
 * @param {ChartDefinitionTypeTypes} chartAnnotation The target chart annotation
 * @param {string} visualizationPath The current visualization annotation path
 * @param {ConverterContext} converterContext The converter context
 * @param {boolean} doNotCheckApplySupported Flag that tells whether applysupported to be checked or not
 * @returns {ChartVisualization} The chart visualization based on the annotation
 */
export function createChartVisualization(
	chartAnnotation: ChartDefinitionTypeTypes,
	visualizationPath: string,
	converterContext: ConverterContext,
	doNotCheckApplySupported?: boolean
): ChartVisualization {
	const aggregationHelper = new AggregationHelper(converterContext.getEntityType(), converterContext);
	if (!doNotCheckApplySupported && !aggregationHelper.isAnalyticsSupported()) {
		throw new Error("ApplySupported is not added to the annotations");
	}
	const aTransAggAnnos = converterContext.getEntityType().annotations.Analytics?.AggregatedProperties as any;
	const transAggLabels = {} as any;

	for (let i = 0; aTransAggAnnos && i < aTransAggAnnos.length; i++) {
		transAggLabels[aTransAggAnnos[i].Name] = {
			label: aTransAggAnnos[i]?.annotations?.Common?.Label
		};
	}

	const aCustomAggregates = aggregationHelper.getCustomAggregateDefinitions();
	const mCustomAggregates = {} as any;
	if (aCustomAggregates) {
		for (let i = 0; i < aCustomAggregates.length; i++) {
			const aContextDefiningProperties = aCustomAggregates[i].annotations?.Aggregation?.ContextDefiningProperties;
			mCustomAggregates[aCustomAggregates[i].qualifier] = {
				name: aCustomAggregates[i].qualifier,
				label: "Custom Aggregate (" + aCustomAggregates[i].qualifier + ")",
				sortable: true,
				sortOrder: "both",
				contextDefiningProperty: aContextDefiningProperties
					? aContextDefiningProperties.map(oCtxDefProperty => {
							return oCtxDefProperty.value;
					  })
					: []
			};
		}
	}

	const aTransAggregations = aggregationHelper.getTransAggregations()[0];
	const mTransAggregations = {} as any;
	if (aTransAggregations) {
		for (let i = 0; i < aTransAggregations.length; i++) {
			mTransAggregations[aTransAggregations[i].Name] = {
				name: aTransAggregations[i].Name,
				propertyPath: aTransAggregations[i].AggregatableProperty.valueOf().value,
				aggregationMethod: aTransAggregations[i].AggregationMethod,
				label:
					aTransAggregations[i].Name in transAggLabels
						? transAggLabels[aTransAggregations[i].Name].label
						: "Aggregatable property (" + aTransAggregations[i].Name + ")",
				sortable: true,
				sortOrder: "both",
				custom: false
			};
		}
	}

	const aAggProps = aggregationHelper.getAggregatableProperties();
	const aGrpProps = aggregationHelper.getGroupableProperties();
	const mApplySupported = {} as any;
	mApplySupported.$Type = "Org.OData.Aggregation.V1.ApplySupportedType";
	mApplySupported.AggregatableProperties = [];
	mApplySupported.GroupableProperties = [];

	for (let i = 0; aAggProps && i < aAggProps.length; i++) {
		const obj = {
			$Type: aAggProps[i]?.$Type,
			Property: {
				$PropertyPath: aAggProps[i]?.Property?.value
			}
		};

		mApplySupported.AggregatableProperties.push(obj);
	}

	for (let i = 0; aGrpProps && i < aGrpProps.length; i++) {
		const obj = { $PropertyPath: aGrpProps[i]?.value };

		mApplySupported.GroupableProperties.push(obj);
	}

	const chartActions = getChartActions(chartAnnotation, visualizationPath, converterContext);
	let [navigationPropertyPath /*, annotationPath*/] = visualizationPath.split("@");
	if (navigationPropertyPath.lastIndexOf("/") === navigationPropertyPath.length - 1) {
		// Drop trailing slash
		navigationPropertyPath = navigationPropertyPath.substr(0, navigationPropertyPath.length - 1);
	}
	const title: any = converterContext.getDataModelObjectPath().targetEntityType.annotations?.UI?.HeaderInfo?.TypeNamePlural;
	const dataModelPath = converterContext.getDataModelObjectPath();
	const isEntitySet: boolean = navigationPropertyPath.length === 0;
	const entityName: string = dataModelPath.targetEntitySet ? dataModelPath.targetEntitySet.name : dataModelPath.startingEntitySet.name;
	const sFilterbarId = isEntitySet ? FilterBarID(converterContext.getContextPath()) : undefined;
	const oVizProperties = {
		"legendGroup": {
			"layout": {
				"position": "bottom"
			}
		}
	};
	let autoBindOnInit: boolean | undefined;
	if (converterContext.getTemplateType() === TemplateType.ObjectPage) {
		autoBindOnInit = true;
	} else if (
		converterContext.getTemplateType() === TemplateType.ListReport ||
		converterContext.getTemplateType() === TemplateType.AnalyticalListPage
	) {
		autoBindOnInit = false;
	}
	const hasMultipleVisualizations =
		converterContext.getManifestWrapper().hasMultipleVisualizations() || converterContext.getTemplateType() === "AnalyticalListPage";
	const onSegmentedButtonPressed = hasMultipleVisualizations ? ".handlers.onSegmentedButtonPressed" : "";
	const visible = hasMultipleVisualizations ? "{= ${pageInternal>alpContentView} !== 'Table'}" : "true";
	return {
		type: VisualizationType.Chart,
		id: ChartID(isEntitySet ? entityName : navigationPropertyPath, VisualizationType.Chart),
		collection: getTargetObjectPath(converterContext.getDataModelObjectPath()),
		entityName: entityName,
		personalization: getP13nMode(visualizationPath, converterContext),
		navigationPath: navigationPropertyPath,
		annotationPath: converterContext.getAbsoluteAnnotationPath(visualizationPath),
		filterId: sFilterbarId,
		vizProperties: JSON.stringify(oVizProperties),
		actions: chartActions,
		title: title,
		autoBindOnInit: autoBindOnInit,
		onSegmentedButtonPressed: onSegmentedButtonPressed,
		visible: visible,
		customAgg: mCustomAggregates,
		transAgg: mTransAggregations,
		applySupported: mApplySupported
	};
}
