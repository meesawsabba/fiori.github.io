/*
 * SAPUI5
  (c) Copyright 2009-2021 SAP SE. All rights reserved
 */
sap.ui.define(["jquery.sap.global","sap/zen/commons/thirdparty/lodash","sap/zen/dsh/utils/BaseHandler"],function(q,_){"use strict";function t(f,e){f.metadata.fields.push({id:"Type",name:"Type",semanticType:"Dimension",dataType:"String",type:"Dimension"});if(e.length>0){w(f,e);}return f;}function a(c){var d=["info/waterfall"];return _.indexOf(d,c)>=0;}function w(f,e){_.forEach(f.data,function(d){var c=_.some(e,function(r){var s=true;var m=[];_.forEach(d,function(v,i){if(_.isObject(v)){var g={};g[f.metadata.fields[i].id]=v.v;m.push(v);if(!b(r,g)){s=false;}}else{m.push(v);}});m=[];return s;});d.push(c?"total":"null");});}function b(o,c){var k=_.keys(c),l=k.length;if(o===null)return!l;var d=Object(o);for(var i=0;i<l;i++){var e=k[i];if(c[e]!==d[e]||!(e in d))return false;}return true;}return{transformData:t,isNeeded:a};});
