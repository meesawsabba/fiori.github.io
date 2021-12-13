import { TableSettings } from "../controls";

/**
 * Table
 * @isViewNode true
 */
export interface ObjectPageTable extends TableSettings {
	/**
	 * By setting enableFullScreen to true you can enable the full screen mode for this table; this will display a new button on the table toolbar allowing the user to open the table in a fullscreen dialog.
	 */
	enableFullScreen?: boolean;
	/**
	 * In the Object Page tables, it is possible to add several items at a time by copying and pasting data from an excel file, if this property is set to true.
	 */
	enablePaste?: boolean;
}

/**
 * Table Section
 * @isViewNode true
 */
export interface ObjectPageSectionTableV4 {
	table?: ObjectPageTable;
}
