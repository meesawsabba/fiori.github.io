/*
 * SAPUI5
  (c) Copyright 2009-2021 SAP SE. All rights reserved
 */
sap.ui.define(["jquery.sap.global","sap/zen/commons/thirdparty/lodash","sap/zen/dsh/utils/BaseHandler"],function(q,_){"use strict";function t(a,e){if(!e){return a;}var h={data:[],metadata:[]};h.metadata=a.metadata;h.metadata.fields.push({"id":"Version","name":"Version","semanticType":"Dimension","type":"Dimension","dataType":"String"});w(a,e,h);return h;}function w(a,e,h){var b=false;var c;_.find(a.metadata.fields,function(d,g){if(d.id===e.dimension){c=g;return true;}});_.each(a.data,function(d){var n=_.clone(d);if(!b){b=_.some(d,function(v,g){return f(v,g,c,e.member);});}if(!b){n.push({"v":"AC","d":"ACTUALS"});}else{n.push("FC");}h.data.push(n);});}function f(m,d,a,b){var c=_.isObject(m)?m.v:m;return(d===a&&(!b||c===b));}function i(c){var a=["info/hichert_bar","info/hichert_column"];return _.indexOf(a,c)>=0;}return{"transformData":t,"isNeeded":i};});
