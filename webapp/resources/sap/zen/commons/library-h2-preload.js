//@ui5-bundle sap/zen/commons/library-h2-preload.js
/*!
 * SAPUI5
  (c) Copyright 2009-2020 SAP SE. All rights reserved
 */
sap.ui.predefine('sap/zen/commons/library',["sap/zen/commons/utils/jQuery","sap/base/Log","sap/zen/commons/CellType","sap/zen/commons/Format","sap/zen/commons/AlertLevel","sap/zen/commons/BackgroundDesign","sap/zen/commons/HAlign","sap/zen/commons/VAlign","sap/zen/commons/Padding","sap/zen/commons/Separation","sap/zen/commons/utils/Utilities","sap/zen/commons/wasabi/Olap","sap/ui/core/library","sap/m/library","sap/ui/layout/library"],function(q,L,C,F,A,B,H,V,P,S,U,O){"use strict";sap.ui.getCore().initLibrary({name:"sap.zen.commons",version:"1.96.0",dependencies:["sap.ui.core","sap.ui.layout","sap.m"],types:["sap.zen.commons.BackgroundDesign","sap.zen.commons.HAlign","sap.zen.commons.Padding","sap.zen.commons.Separation","sap.zen.commons.VAlign","sap.zen.commons.AlertLevel","sap.zen.commons.CellType","sap.zen.commons.Format"],interfaces:[],controls:["sap.zen.commons.layout.AbsoluteLayout","sap.zen.commons.layout.MatrixLayout","sap.zen.commons.Grid",],elements:["sap.zen.commons.layout.MatrixLayoutCell","sap.zen.commons.layout.MatrixLayoutRow","sap.zen.commons.layout.PositionContainer","sap.zen.commons.Cell",]});var t=sap.zen.commons;t.CellType=C;t.AlertLevel=A;t.Format=F;t.BackgroundDesign=B;t.HAlign=H;t.Padding=P;t.Separation=S;t.VAlign=V;t.Utilities=U;t.Log=L;t.getWorker=(function(){var w;return function(){if(!w){w=new O();}return w;};}());
t.getServerInfo=function(){return t.getWorker().getServerInfo();};
t.getResponse=function(p){return t.getWorker().getResponse(p);};
t.submitCube=function(p){return t.getWorker().submitCube(p);};
return sap.zen.commons;});
sap.ui.require.preload({
	"sap/zen/commons/manifest.json":'{"_version":"1.21.0","sap.app":{"id":"sap.zen.commons","type":"library","embeds":[],"applicationVersion":{"version":"1.96.0"},"title":"Layout components used by Design Studio.","description":"Layout components used by Design Studio.  NOT INTENDED FOR STANDALONE USAGE.","ach":"BI-RA-AD-EA","resources":"resources.json","offline":true},"sap.ui":{"technology":"UI5","supportedThemes":["base","sap_belize","sap_belize_hcb","sap_belize_hcw","sap_belize_plus","sap_bluecrystal","sap_fiori_3","sap_fiori_3_dark","sap_fiori_3_hcb","sap_fiori_3_hcw","sap_hcb","sap_horizon"]},"sap.ui5":{"dependencies":{"minUI5Version":"1.96","libs":{"sap.ui.core":{"minVersion":"1.96.0"},"sap.ui.layout":{"minVersion":"1.96.0"},"sap.m":{"minVersion":"1.96.0"}}},"library":{"i18n":false,"content":{"controls":["sap.zen.commons.layout.AbsoluteLayout","sap.zen.commons.layout.MatrixLayout","sap.zen.commons.Grid"],"elements":["sap.zen.commons.layout.MatrixLayoutCell","sap.zen.commons.layout.MatrixLayoutRow","sap.zen.commons.layout.PositionContainer","sap.zen.commons.Cell"],"types":["sap.zen.commons.BackgroundDesign","sap.zen.commons.HAlign","sap.zen.commons.Padding","sap.zen.commons.Separation","sap.zen.commons.VAlign","sap.zen.commons.AlertLevel","sap.zen.commons.CellType","sap.zen.commons.Format"],"interfaces":[]}}}}'
},"sap/zen/commons/library-h2-preload"
);
sap.ui.loader.config({depCacheUI5:{
"sap/zen/commons/Cell.js":["sap/ui/core/Element.js","sap/zen/commons/CellType.js"],
"sap/zen/commons/Grid.js":["sap/m/VBox.js","sap/ui/core/Control.js","sap/zen/commons/GridRenderer.js","sap/zen/commons/utils/GridUtils.js","sap/zen/commons/utils/jQuery.js"],
"sap/zen/commons/GridRenderer.js":["sap/zen/commons/Format.js","sap/zen/commons/library.js","sap/zen/commons/thirdparty/lodash.js","sap/zen/commons/utils/jQuery.js"],
"sap/zen/commons/SemanticStyle.js":["sap/ui/core/Element.js","sap/zen/commons/library.js","sap/zen/commons/thirdparty/lodash.js"],
"sap/zen/commons/SpreadSheet/CellInfo.js":["sap/zen/commons/SpreadSheet/CXpDataCellValueType.js","sap/zen/commons/SpreadSheet/CXpStyle.js"],
"sap/zen/commons/SpreadSheet/Workbook.js":["sap/zen/commons/thirdparty/xlsx-protobi.js"],
"sap/zen/commons/layout/AbsoluteLayout.js":["jquery.sap.global.js","sap/ui/core/Control.js","sap/zen/commons/layout/PositionContainer.js","sap/zen/commons/library.js"],
"sap/zen/commons/layout/AbsoluteLayoutRenderer.js":["jquery.sap.global.js"],
"sap/zen/commons/layout/MatrixLayout.js":["jquery.sap.global.js","sap/ui/core/Control.js","sap/ui/core/EnabledPropagator.js","sap/zen/commons/layout/MatrixLayoutCell.js","sap/zen/commons/layout/MatrixLayoutRow.js","sap/zen/commons/library.js"],
"sap/zen/commons/layout/MatrixLayoutCell.js":["jquery.sap.global.js","sap/ui/core/CustomStyleClassSupport.js","sap/ui/core/Element.js","sap/zen/commons/library.js"],
"sap/zen/commons/layout/MatrixLayoutRenderer.js":["sap/base/Log.js","sap/zen/commons/BackgroundDesign.js","sap/zen/commons/HAlign.js","sap/zen/commons/Padding.js","sap/zen/commons/Separation.js","sap/zen/commons/VAlign.js"],
"sap/zen/commons/layout/MatrixLayoutRow.js":["jquery.sap.global.js","sap/ui/core/CustomStyleClassSupport.js","sap/ui/core/Element.js","sap/zen/commons/library.js"],
"sap/zen/commons/layout/PositionContainer.js":["jquery.sap.global.js","sap/base/Log.js","sap/ui/core/Element.js","sap/zen/commons/library.js"],
"sap/zen/commons/library.js":["sap/base/Log.js","sap/m/library.js","sap/ui/core/library.js","sap/ui/layout/library.js","sap/zen/commons/AlertLevel.js","sap/zen/commons/BackgroundDesign.js","sap/zen/commons/CellType.js","sap/zen/commons/Format.js","sap/zen/commons/HAlign.js","sap/zen/commons/Padding.js","sap/zen/commons/Separation.js","sap/zen/commons/VAlign.js","sap/zen/commons/utils/Utilities.js","sap/zen/commons/utils/jQuery.js","sap/zen/commons/wasabi/Olap.js"],
"sap/zen/commons/thirdparty/xlsx-protobi.js":["sap/ui/thirdparty/jszip.js"],
"sap/zen/commons/utils/GridUtils.js":["sap/base/Log.js","sap/m/Input.js","sap/m/Link.js","sap/ui/core/CustomData.js","sap/ui/core/Icon.js","sap/zen/commons/Format.js","sap/zen/commons/thirdparty/lodash.js","sap/zen/commons/utils/ResourceBundle.js","sap/zen/commons/utils/Utilities.js","sap/zen/commons/utils/jQuery.js"],
"sap/zen/commons/utils/ResourceBundle.js":["sap/zen/commons/utils/ResourceModel.js"],
"sap/zen/commons/utils/ResourceModel.js":["sap/ui/model/resource/ResourceModel.js"],
"sap/zen/commons/utils/Utilities.js":["sap/base/Log.js","sap/zen/commons/utils/jQuery.js"],
"sap/zen/commons/utils/jQuery.js":["jquery.sap.global.js","sap/base/Log.js","sap/ui/thirdparty/jqueryui/jquery-ui-core.js","sap/ui/thirdparty/jqueryui/jquery-ui-draggable.js","sap/ui/thirdparty/jqueryui/jquery-ui-droppable.js","sap/ui/thirdparty/jqueryui/jquery-ui-mouse.js","sap/ui/thirdparty/jqueryui/jquery-ui-resizable.js","sap/ui/thirdparty/jqueryui/jquery-ui-sortable.js","sap/ui/thirdparty/jqueryui/jquery-ui-widget.js"],
"sap/zen/commons/wasabi/Olap.js":["sap/base/Log.js","sap/ui/core/routing/HashChanger.js"]
}});
//# sourceMappingURL=library-h2-preload.js.map