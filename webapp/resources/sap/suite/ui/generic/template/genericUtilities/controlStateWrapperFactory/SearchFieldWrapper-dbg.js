sap.ui.define([], function() {
	"use strict";

	function SearchFieldWrapper(oSearchField) {
		function fnGetState() {
			return {
				searchString: oSearchField.getValue()
			};
		}

		function fnSetState(oState) {
			oSearchField.setValue(oState.searchString);
			// original implementation also called fireSearch. Seems to be superfluous (would fire the search event, on which worklisthandler is registered and finally calls rebindTable
			// when restoring from an appState of a worklist, always data should be shown at time of saving the state and thus automatically search would be triggered again
			// oSearchField.fireSearch();
		}

		function fnAttachStateChanged(fnHandler) {
			oSearchField.attachLiveChange(fnHandler);
		}

		return {
			getState: fnGetState,
			setState: fnSetState,
			attachStateChanged: fnAttachStateChanged
		};
	}

	return SearchFieldWrapper;
});