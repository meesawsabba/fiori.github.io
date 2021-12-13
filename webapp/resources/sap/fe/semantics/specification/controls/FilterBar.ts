export type SelectionField = object;

/**
 * Selection Fields
 * @isViewNode true
 */
export interface SelectionFields {
	[key: string]: SelectionField;
}

/**
 * Filter Bar
 * @isViewNode true
 */
export interface FilterBar {
	/**
	 * @isViewNode true
	 */
	selectionFields?: SelectionFields;
}
