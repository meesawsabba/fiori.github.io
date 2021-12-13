/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)

		(c) Copyright 2009-2015 SAP SE. All rights reserved
	
 */
sap.ui.define(["sap/gantt/utils/GanttCustomisationUtils"],function(G){"use strict";var D={getDialogBox:function(d){return G.dialogBox(d,true);}};D.fnConfigureALSettings=function(s){return D.getDialogBox(s).then(function(c){return[{selectorControl:s,changeSpecificData:{changeType:"ganttDeltaLineSettings",content:c}}];});};return D;},true);
