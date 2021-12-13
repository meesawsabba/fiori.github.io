import { SapUiGenericAppPageSettings } from "../../common/page";

export interface SapUiAppV4 {
	pages: SapUiAppPageV4[] | SapUiGenericAppPageMapV4;
	_version?: string;
	settings?: object;
}

export interface SapUiGenericAppPageMapV4 {
	[key: string]: SapUiAppPageV4;
}

export interface SapUiNavDetailsV4 {
	detail?: {
		route?: string;
	};
}

export type SapUiPageSettingsV4 = SapUiGenericAppPageSettings & {
	entitySet?: string;
	navigation?: {
		[key: string]: SapUiNavDetailsV4;
	};
	controlConfiguration?: SapUiGenericAppPageSettings;
	content?: SapUi5RoutingTargetContent;
};

export interface SapUiAppPageV4 {
	type: string;
	id: string;
	name: string;
	options: {
		settings?: SapUiPageSettingsV4;
	};
}

export const enum FE_TEMPLATE_PAGES {
	OBJECT_PAGE = "sap.fe.templates.ObjectPage",
	LIST_REPORT = "sap.fe.templates.ListReport",
	ALP = "sap.fe.templates.AnalyticalListPage"
}
export interface SapUiAppPagesV4 {
	[key: string]: SapUiAppPageV4;
}
export interface SapUi5RoutingTargetContent {
	body?: SapUi5RoutingTargetContentBody;
}

export interface SapUi5RoutingTargetContentBody {
	sections?: SapUi5RoutingTargetContentSections;
}

export interface SapUi5RoutingTargetContentSections {
	[key: string]: SapUi5RoutingTargetContentSection;
}

export const enum SAPUI5_FRAGMENT_TYPE_V4 {
	XMLFragment = "XMLFragment"
}
export interface SapUi5RoutingTargetContentSection {
	// Currently only xml fragment is supported
	type: SAPUI5_FRAGMENT_TYPE_V4;
	name: string;
	title: string;
	position: SapUi5RoutingTargetContentPosition;
}

export enum SectionPositionV4 {
	AfterFacet = "AfterFacet",
	BeforeFacet = "BeforeFacet"
}

export interface SapUi5RoutingTargetContentPosition {
	placement: SectionPositionV4;
	anchor: string;
}
