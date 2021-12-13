sap.ui.define([], function() {
		"use strict";

	var oCore = sap.ui.getCore();

	function isControlOfType(sPathToType, oControl){
		var FNClass = sap.ui.require(sPathToType);
        return typeof FNClass === "function" && (oControl instanceof FNClass);
	}

	function focusControl(sControlId) {
		var oTarget = sControlId && oCore.byId(sControlId);
		if (oTarget) {
			oTarget.focus();
		}
	}
	
	// If oChild is identified to be invisible, null is returned. Otherwise its parent is returned.
	// If the parent does not exist a faulty value is returned.
	// This is a heuristic method.
	function getParentOfVisibleElement(oChild){
		if (oChild.getVisible && !oChild.getVisible()){
			return null;
		}
		return oChild.getParent() || oChild.oContainer; // For Components the navigation to the parent is not done by the getParent() method, but by the oContainer property.
	}

	// This method checks whether sElementId identifies an element which is visible and placed on this view.
	// onElementVisited is an optional function that will be called for each element fvisited starting at the element identified by sElementId until the decision could be made
	function isElementVisibleOnView(sElementId, oView, onElementVisited){
		onElementVisited = onElementVisited || Function.prototype;
		var bRet = false;
		for (var oElement = oView.getVisible() && oCore.byId(sElementId); oElement && !bRet; oElement = getParentOfVisibleElement(oElement)) {
			onElementVisited(oElement);
			bRet = oElement === oView;
		}
		return bRet;
	}
	
	// Return a list of all children of the given control (in the 'correct' order). Only implemented for certasin control types.
	function getChildren(oControl){
		if (oControl.getSections){
			return oControl.getSections();
		}
		if (isControlOfType("sap/uxap/ObjectPageSection", oControl)){
			return oControl.getSubSections();
		}
		if (isControlOfType("sap/uxap/ObjectPageSubSection", oControl)){
			return oControl.getBlocks().concat(oControl.getMoreBlocks());
		}		
		return [];
	}
	
	// Sorter that compares the position of two child controls which have a common parent.
	// Returns a positive integer when oChild1 is larger, a negative number if oChild2 is larger, and 0 if they are identical.
	// Depends on getChildren() being implemented for commonParent. If this is not the case, at least a reproducable order is guaranteed.
	function fnSortChildControls(oCommonParent, oChild1, oChild2){
		if (oChild1 === oChild2){
			return 0;
		}
		var aChildren = getChildren(oCommonParent);
		var iPos1 = aChildren.indexOf(oChild1);
		var iPos2 = aChildren.indexOf(oChild2);
		if (iPos1 < 0 && iPos2 < 0){ // if both children are not in the list of children we try to locate the controls in the DOM
			var oDomRef1 = oChild1.getDomRef();
			var oDomRef2 = oChild2.getDomRef();
			if (oDomRef1 && oDomRef2){
				var iPositionCompare = oDomRef1.compareDocumentPosition(oDomRef2);
				if (iPositionCompare & Node.DOCUMENT_POSITION_PRECEDING){
					return 1;
				}
				if (iPositionCompare & Node.DOCUMENT_POSITION_FOLLOWING){
					return -1;
				}				
			}
			return (oChild1.getId() < oChild2.getId()) ? -1 : 1; // if we cannot determine a reasonable order we still want to have a reproducable order
		}
		return (iPos1 >= 0 && iPos2 >= 0) ? (iPos1 - iPos2) : (iPos2 - iPos1); // if only one child has been identified in the list of children it takes precedence.
	}

	return {
		isSmartTable:      			isControlOfType.bind(null, "sap/ui/comp/smarttable/SmartTable"),
		isSmartField:				isControlOfType.bind(null, "sap/ui/comp/smartfield/SmartField"),
		isSmartChart:      			isControlOfType.bind(null, "sap/ui/comp/smartchart/SmartChart"),
		isUiTable:         			isControlOfType.bind(null, "sap/ui/table/Table"),
		isAnalyticalTable: 			isControlOfType.bind(null, "sap/ui/table/AnalyticalTable"),
		isTreeTable:       			isControlOfType.bind(null, "sap/ui/table/TreeTable"),
		isMTable:          			isControlOfType.bind(null, "sap/m/Table"),
		isSemanticObjectController: isControlOfType.bind(null, "sap/ui/comp/navpopover/SemanticObjectController"),
		isSmartList:	   			isControlOfType.bind(null, "sap/ui/comp/smartlist/SmartList"),
		isDynamicPage:	   			isControlOfType.bind(null, "sap/f/DynamicPage"),
		isObjectPageSection:		isControlOfType.bind(null, "sap/uxap/ObjectPageSection"),
		isSmartVariantManagement:	isControlOfType.bind(null, "sap/ui/comp/smartvariants/SmartVariantManagement"),
		isObjectObjectPageLayout:	isControlOfType.bind(null, "sap/uxap/ObjectPageLayout"),
		isSearchField:					isControlOfType.bind(null, "sap/m/SearchField"),
		focusControl: focusControl,
		isElementVisibleOnView: isElementVisibleOnView,
		sortChildControls: fnSortChildControls
	};
});
