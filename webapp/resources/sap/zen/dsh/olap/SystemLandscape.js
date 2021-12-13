/*
 * SAPUI5
  (c) Copyright 2009-2021 SAP SE. All rights reserved
 */
sap.ui.define("sap/zen/dsh/olap/SystemLandscape",[],function(){return[{systemName:"WASABI",protocol:"WASABI",systemType:"WASABI",authentication:"NONE"},{systemName:"localAbapAnalyticEngine",systemType:"BW",protocol:window.location.protocol==="http:"?"HTTP":"HTTPS",port:window.location.port,host:window.location.hostname,authentication:"NONE"},{systemName:"localHanaAnalyticEngine",systemType:"HANA",protocol:window.location.protocol==="http:"?"HTTP":"HTTPS",host:window.location.hostname,port:window.location.port,authentication:"NONE"},{systemName:"localDWCAnalyticEngine",systemType:"DWC",protocol:window.location.protocol==="http:"?"HTTP":"HTTPS",host:window.location.hostname,port:window.location.port,authentication:"NONE"}];})
