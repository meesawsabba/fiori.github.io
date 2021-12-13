/*!
 * SAPUI5

		(c) Copyright 2009-2021 SAP SE. All rights reserved
	
 */
sap.ui.define(["./SearchResultListSelectionHandler","sap/m/MessageBox"],function(S,M){"use strict";return S.extend("sap.esh.search.ui.controls.SearchResultListSelectionHandlerNote",{isMultiSelectionAvailable:function(){return true;},actionsForDataSource:function(){var a=[{text:"Show Selected Items",action:function(s){var m="No Items were selected!";if(s.length>0){m="Following Items were selected:";for(var i=0;i<s.length;i++){m+="\n"+s[i].title;}}M.show(m,{icon:M.Icon.INFORMATION,title:"I'm a Custom Action for testing Multi-Selection",actions:[M.Action.OK],});},},];return a;},});});
