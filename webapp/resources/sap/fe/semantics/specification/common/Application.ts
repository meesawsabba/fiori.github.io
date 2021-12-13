import { Target } from "./page";
import { AppSettings as CommonSettingsV4, Pages as PagesV4 } from "../index";
import { FlexibleColumnLayoutType } from "./types";

export interface Application {
	$schema?: string;
	id?: string;
	pages?: PagesV4;
	home?: string;
	target?: Target;
	settings?: CommonSettingsV4;
}

export interface FlexibleColumnLayout {
	defaultTwoColumnLayoutType?: FlexibleColumnLayoutType;
	defaultThreeColumnLayoutType?: FlexibleColumnLayoutType;
}
