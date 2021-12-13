//@ui5-bundle sap/gantt/designtime/library-preload.designtime.js
/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)

		(c) Copyright 2009-2015 SAP SE. All rights reserved
	
 */
sap.ui.predefine('sap/gantt/designtime/GanttChart.designtime',[],function(){"use strict";return{aggregations:{relationships:{ignore:true}}};},false);
sap.ui.predefine('sap/gantt/designtime/GanttChartWithTable.designtime',[],function(){"use strict";return{aggregations:{relationships:{ignore:true}}};},false);
sap.ui.predefine('sap/gantt/designtime/library.designtime',[],function(){"use strict";return{};});
sap.ui.predefine('sap/gantt/designtime/simple/AdhocLine.designtime',["sap/gantt/changeHandlers/simple/AdhocLine","sap/gantt/utils/GanttCustomisationUtils"],function(A,G){"use strict";return{domRef:function(l){return l._getMarker()&&l._getMarker().getDomRef();},aggregations:{_marker:{ignore:true},_line:{ignore:true},_headerLine:{ignore:true}},actions:{settings:G.designTimeSettings.bind(null,"TXT_DT_ADHOCLINE",A.fnConfigureALSettings)}};});
sap.ui.predefine('sap/gantt/designtime/simple/DeltaLine.designtime',["sap/gantt/changeHandlers/simple/DeltaLine","sap/gantt/utils/GanttCustomisationUtils"],function(D,G){"use strict";return{domRef:function(l){return l._getHeaderDeltaArea().getDomRef();},aggregations:{_marker:{ignore:true},_line:{ignore:true},_headerLine:{ignore:true}},actions:{settings:G.designTimeSettings.bind(null,"TXT_DT_DELTALINE",D.fnConfigureALSettings)}};});
sap.ui.predefine('sap/gantt/designtime/simple/GanttChartContainer.designtime',["sap/gantt/changeHandlers/simple/GanttChartContainer","sap/gantt/utils/GanttCustomisationUtils"],function(G,a){"use strict";return{actions:{settings:a.designTimeSettings.bind(null,"TXT_DT_GANTT_CHART_CONTAINER",G.fnConfigureContainerSettings)},tool:{start:function(c){c.setProperty("_enableRTA",true);},stop:function(c){c.setProperty("_enableRTA",false);}}};});
sap.ui.predefine('sap/gantt/designtime/simple/GanttChartWithTable.designtime',["sap/gantt/changeHandlers/simple/GanttChartWithTable","sap/gantt/utils/GanttCustomisationUtils"],function(G,a){"use strict";return{actions:{remove:{changeType:"hideControl",isEnabled:true},reveal:{changeType:"unhideControl",isEnabled:true},settings:a.designTimeSettings.bind(null,"TXT_DT_GANTT_CHART_WITH_TABLE",G.fnConfigureContainerSettings)},tool:{start:function(c){c.setProperty("_enableRTA",true);},stop:function(c){c.setProperty("_enableRTA",false);}}};});
sap.ui.predefine('sap/gantt/designtime/simple/Table.designtime',function(){"use strict";return{domRef:function(t){if(t._getRowMode().isA("sap.ui.table.rowmodes.AutoRowMode")){return t.$("sapUiTableCnt").get(0);}return t.getDomRef();},aggregations:{columns:{domRef:".sapUiTableCHA"},hScroll:{ignore:false},rows:{ignore:false},scrollContainers:[{domRef:function(t){return t.$("sapUiTableCnt").get(0);},aggregations:["rows"]}]}};});
//# sourceMappingURL=library-preload.designtime.js.map