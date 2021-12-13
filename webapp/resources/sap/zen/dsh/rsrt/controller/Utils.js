/*!
 * SAPUI5
  (c) Copyright 2009-2021 SAP SE. All rights reserved
 */
sap.ui.define("sap/zen/dsh/rsrt/controller/Utils",["sap/ui/core/routing/HashChanger","sap/zen/dsh/library","sap/zen/dsh/utils/Utilities","sap/viz/ui5/controls/common/feeds/FeedItem","sap/viz/ui5/api/env/Format","sap/zen/commons/thirdparty/lodash"],function(H,e,U,F,C,a,_){"use strict";var b=sap.ui.getCore().getLibraryResourceBundle("sap.zen.dsh");return{Params:_.reduce(decodeURIComponent(window.location.search.substring(1)).split("&"),function(o,s){var p=s.split("=");o[p[0]]=p[1];return o;},{}),NavService:sap.ushell.Container&&sap.ushell.Container.getService("CrossApplicationNavigation"),Utilities:U,trunc:Math.trunc||function(x){if(isNaN(x)){return NaN;}if(x>0){return Math.floor(x);}return Math.ceil(x);},HashChanger:new H(),getChartTypes:function(){return _.map(_.filter(e.ChartType,function(s){return s!==e.ChartType.PivotTable;}),function(s){return{key:s,name:b.getText(s)};});}};});
