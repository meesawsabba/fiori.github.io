/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)

		(c) Copyright 2009-2015 SAP SE. All rights reserved
	
 */
sap.ui.define(["sap/gantt/def/SvgDefs"],function(S){"use strict";var C=S.extend("sap.gantt.def.cal.CalendarDefs",{metadata:{library:"sap.gantt",aggregations:{defs1:{type:"sap.gantt.def.DefBase",multiple:true,visibility:"public",singularName:"def1",bindable:"bindable"},defs2:{type:"sap.gantt.def.DefBase",multiple:true,visibility:"public",singularName:"def2",bindable:"bindable"},defs3:{type:"sap.gantt.def.DefBase",multiple:true,visibility:"public",singularName:"def3",bindable:"bindable"},defs4:{type:"sap.gantt.def.DefBase",multiple:true,visibility:"public",singularName:"def4",bindable:"bindable"},defs5:{type:"sap.gantt.def.DefBase",multiple:true,visibility:"public",singularName:"def5",bindable:"bindable"}}}});C.prototype.getRefString=function(c){var i="";if(this.getParent()&&this.getParent().getId()){i=this.getParent().getId();}return"url(#"+i+"_"+c+")";};C.prototype.getDefNode=function(c){var r={"id":this.getId(),"defNodes":[]};for(var i=0;i<c.length;i++){r.defNodes.push(c[i].getDefNode());}return r;};return C;},true);
