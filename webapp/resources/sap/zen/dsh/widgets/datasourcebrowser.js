/*
 * SAPUI5
  (c) Copyright 2009-2021 SAP SE. All rights reserved
 */
sap.ui.define(["jquery.sap.global","sap/base/Log","sap/ui/core/mvc/XMLView","sap/ui/table/Table","sap/ui/model/json/JSONModel","sap/ui/model/resource/ResourceModel","sap/zen/dsh/utils/BaseHandler"],function(q,L,X,T,J,R,B){"use strict";X.extend("com.sap.ip.bi.DataSourceBrowser",{initDesignStudio:function(){},renderer:{},constructor:function(i,s){this.controlProperties=s.dsControlProperties;q.sap.registerModulePath("dsb","zen.res/zen.rt.components.ui5/datasourcebrowser/js");if(B.dispatcher.isMainMode()){X.call(this,i,{viewName:"dsb.dsb_m",type:sap.ui.core.mvc.ViewType.JSON});}else{X.call(this,i,{viewName:"dsb.dsb",type:sap.ui.core.mvc.ViewType.JSON});}return this;}});});
