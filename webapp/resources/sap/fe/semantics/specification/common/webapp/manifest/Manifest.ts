import { SapUi5V4 } from "../../../webapp/manifest/sapUi5";

export enum DataSourceType {
	OData = "OData",
	ODataAnnotation = "ODataAnnotation"
}
export interface SapApp {
	id?: string;
	title?: string;
	description?: string;
	dataSources?: SapAppDataSources;
	offline?: boolean;
}

export interface SapAppDataSources {
	[key: string]: SapAppDataSource;
	mainService: SapAppDataSource;
}

export interface SapAppDataSource {
	uri: string;
	type: DataSourceType;
	settings: SapAppDataSourceSettings;
}

export type ODataVersionType = "2.0" | "4.0";

export interface SapAppDataSourceSettings {
	//[key: string]: boolean | number | string | object;
	annotations?: string[];
	localUri?: string;
	odataVersion?: ODataVersionType;
}

export interface Manifest {
	_version?: string;
	"sap.app"?: SapApp;
	"sap.ui5"?: SapUi5V4;
}
