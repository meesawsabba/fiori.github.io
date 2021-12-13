/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)

		(c) Copyright 2009-2015 SAP SE. All rights reserved
	
 */
sap.ui.define(["sap/gantt/changeHandlers/simple/GanttChartContainer","sap/gantt/utils/GanttCustomisationUtils"],function(G,a){"use strict";return{actions:{settings:a.designTimeSettings.bind(null,"TXT_DT_GANTT_CHART_CONTAINER",G.fnConfigureContainerSettings)},tool:{start:function(c){c.setProperty("_enableRTA",true);},stop:function(c){c.setProperty("_enableRTA",false);}}};});
