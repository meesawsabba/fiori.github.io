/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)

		(c) Copyright 2009-2015 SAP SE. All rights reserved
	
 */
sap.ui.define(["sap/gantt/utils/GanttCustomisationUtils"],function(G){"use strict";var A={getDialogBox:function(a){return G.dialogBox(a,false);}};A.fnConfigureALSettings=function(s){return A.getDialogBox(s).then(function(c){return[{selectorControl:s,changeSpecificData:{changeType:"ganttAdhocLineSettings",content:c}}];});};return A;},true);
