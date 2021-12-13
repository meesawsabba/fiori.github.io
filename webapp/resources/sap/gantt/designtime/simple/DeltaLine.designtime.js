/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)

		(c) Copyright 2009-2015 SAP SE. All rights reserved
	
 */
sap.ui.define(["sap/gantt/changeHandlers/simple/DeltaLine","sap/gantt/utils/GanttCustomisationUtils"],function(D,G){"use strict";return{domRef:function(l){return l._getHeaderDeltaArea().getDomRef();},aggregations:{_marker:{ignore:true},_line:{ignore:true},_headerLine:{ignore:true}},actions:{settings:G.designTimeSettings.bind(null,"TXT_DT_DELTALINE",D.fnConfigureALSettings)}};});
