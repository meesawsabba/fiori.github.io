/*
 * SAPUI5
  (c) Copyright 2009-2021 SAP SE. All rights reserved
 */
sap.ui.define(["sap/base/Log","sap/zen/dsh/firefly/library"],function(L){"use strict";L.info("Load staticMimeUrlCreate");sap.zen.createStaticMimeUrl=function(p){var s="";var l=p.lastIndexOf(".");var a=p.lastIndexOf("/");if(a>l){l=-1;}if(sap.zen.dsh.doReplaceDots){for(var i=0;i<p.length;i++){var c=p.charAt(i);if(i==l){s+=c;}else{if(c=="."){if(p.charAt(i+1)=="."){s+="..";i++;}else{s+="_";}}else{s+=c;}}}}return sap.zen.dsh.sapbi_page.staticMimeUrlPrefix+s;};sap.zen.createStaticSdkMimeUrl=function(s,p){s=s.replace(/\./g,"_");return"/designstudio_extensions/"+s+"/"+p;};return sap.zen.createStaticMimeUrl;});
