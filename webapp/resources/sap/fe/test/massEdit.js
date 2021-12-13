/*
 * ! SAP UI development toolkit for HTML5 (SAPUI5)
        (c) Copyright 2009-2021 SAP SE. All rights reserved
    
 */
sap.ui.define([],function(){"use strict";var M={handleMassEditChange:function(s,v){var p=s&&s.getSelectedKey()&&s.getSelectedKey().split("/");var d=s&&s.getParent().getParent().getParent().getParent();var f=d&&d.getModel("fieldsInfo").getData();var D;if(p[0]==="Default"){D={keyValue:p[1],value:p[0]};}else if(p[0]==="ClearFieldValue"){D={keyValue:p[1],value:""};}else if(!p){var P=s.getId().substring(s.getId().lastIndexOf(":")+1);D={keyValue:P,value:v};}else{var r=p[0]&&f.values&&f.values[p[0]].filter(function(F){return F.text===s.getValue();});D=r&&r[0]&&r[0].textInfo?{keyValue:p[0],value:r[0].textInfo.value}:{keyValue:p[0],value:s.getValue()};}var e=false;for(var i=0;i<f.results.length;i++){if(f.results[i].keyValue===D.keyValue){e=i;}}if(e!==false){f.results[e]=D;}else{f.results.push(D);}}};return M;},true);
