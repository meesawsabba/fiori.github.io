/*!
 * 
		SAP UI development toolkit for HTML5 (SAPUI5)
		(c) Copyright 2009-2015 SAP SE. All rights reserved
	
 */
sap.ui.define(['./library','sap/ui/core/Control','./ProcessFlowConnectionRenderer'],function(l,C,P){"use strict";var a=C.extend("sap.suite.ui.commons.ProcessFlowConnection",{metadata:{library:"sap.suite.ui.commons",properties:{drawData:{type:"object[]",group:"Misc",defaultValue:null},zoomLevel:{type:"sap.suite.ui.commons.ProcessFlowZoomLevel",group:"Misc",defaultValue:"Two"},type:{type:"sap.suite.ui.commons.ProcessFlowConnectionType",group:"Appearance",defaultValue:"Normal",deprecated:true},state:{type:"sap.suite.ui.commons.ProcessFlowConnectionState",group:"Appearance",defaultValue:"Regular",deprecated:true}},defaultAggregation:"_labels",aggregations:{_labels:{type:"sap.suite.ui.commons.ProcessFlowConnectionLabel",multiple:true,singularName:"_label",visibility:"hidden"}}}});a.prototype._oResBundle=null;a.prototype._showLabels=false;a.prototype._oStateOrderMapping=null;a.prototype.init=function(){if(!this._oResBundle){this._oResBundle=sap.ui.getCore().getLibraryResourceBundle("sap.suite.ui.commons");}this._oStateOrderMapping={};this._oStateOrderMapping[l.ProcessFlowConnectionLabelState.Neutral]=1;this._oStateOrderMapping[l.ProcessFlowConnectionLabelState.Positive]=2;this._oStateOrderMapping[l.ProcessFlowConnectionLabelState.Critical]=3;this._oStateOrderMapping[l.ProcessFlowConnectionLabelState.Negative]=4;};a.prototype._getAriaText=function(t){var A="";var s=" "+this._oResBundle.getText('PF_CONNECTION_ENDS');if(this._isHorizontalLine(t)){A=this._oResBundle.getText('PF_CONNECTION_HORIZONTAL_LINE');if(t.arrow){A+=s;}}else if(this._isVerticalLine(t)){A=this._oResBundle.getText('PF_CONNECTION_VERTICAL_LINE');if(t.arrow){A+=s;}}else{A=this._oResBundle.getText('PF_CONNECTION_BRANCH');if(t.arrow){A+=s;}}return A;};a.prototype._getVisibleLabel=function(){var v=null;if(this.getAggregation("_labels")){var L=this.getAggregation("_labels");for(var i=0;i<L.length;i++){var c=L[i];if(c&&c.getMetadata().getName()==="sap.suite.ui.commons.ProcessFlowConnectionLabel"){if(v){if(this._oStateOrderMapping[v.getState()]<this._oStateOrderMapping[c.getState()]){v=c;}else if(this._oStateOrderMapping[v.getState()]===this._oStateOrderMapping[c.getState()]){if(v.getPriority()<c.getPriority()){v=c;}}}else{v=c;}}}}return v;};a.prototype._getShowLabels=function(){return a.prototype._showLabels;};a.prototype._setShowLabels=function(s){a.prototype._showLabels=s;};a.prototype._traverseConnectionData=function(){var c=this.getDrawData();if(!c){return{};}var t=this._createConnection(c);if(this.getAggregation("_labels")){t.labels=this.getAggregation("_labels");}return t;};a.prototype._isVerticalLine=function(c){return c.hasOwnProperty("left")&&!c.left.draw&&c.hasOwnProperty("right")&&!c.right.draw&&c.hasOwnProperty("top")&&c.top.draw&&c.hasOwnProperty("bottom")&&c.bottom.draw;};a.prototype._isHorizontalLine=function(c){return c.hasOwnProperty("left")&&c.left.draw&&c.hasOwnProperty("right")&&c.right.draw&&c.hasOwnProperty("top")&&!c.top.draw&&c.hasOwnProperty("bottom")&&!c.bottom.draw;};a.prototype._createConnection=function(c){var L={draw:false,type:"",state:""};var o={right:L,top:L,left:L,bottom:L,arrow:false};for(var i=0;i<c.length;i++){o.right=this._createLine(c[i],"r",o.right);o.top=this._createLine(c[i],"t",o.top);o.left=this._createLine(c[i],"l",o.left);o.bottom=this._createLine(c[i],"b",o.bottom);if(c[i].flowLine.indexOf("r")>=0){if(c[i].hasArrow){o.arrow=true;}}}return o;};a.prototype._createLine=function(c,d,b){var L={draw:b.draw,type:b.type,state:b.state};if(c.flowLine.indexOf(d)>=0){L.draw=true;if(c.targetNodeState===l.ProcessFlowNodeState.Neutral||c.targetNodeState===l.ProcessFlowNodeState.Positive||c.targetNodeState===l.ProcessFlowNodeState.Negative||c.targetNodeState===l.ProcessFlowNodeState.Critical){L.type=l.ProcessFlowConnectionType.Normal;}else if(c.targetNodeState===l.ProcessFlowNodeState.Planned||c.targetNodeState===l.ProcessFlowNodeState.PlannedNegative){if(L.type!==l.ProcessFlowConnectionType.Normal){L.type=l.ProcessFlowConnectionType.Planned;}}if(c.displayState===l.ProcessFlowDisplayState.Selected||c.displayState===l.ProcessFlowDisplayState.SelectedHighlighted||c.displayState===l.ProcessFlowDisplayState.SelectedHighlightedFocused||c.displayState===l.ProcessFlowDisplayState.SelectedFocused){L.state=l.ProcessFlowConnectionState.Selected;}else if(c.displayState===l.ProcessFlowDisplayState.Highlighted||c.displayState===l.ProcessFlowDisplayState.HighlightedFocused){if(L.state!==l.ProcessFlowConnectionState.Selected){L.state=l.ProcessFlowConnectionState.Highlighted;}}else if(c.displayState===l.ProcessFlowDisplayState.Regular||c.displayState===l.ProcessFlowDisplayState.RegularFocused){if(L.state!==l.ProcessFlowConnectionState.Highlighted&&L.state!==l.ProcessFlowConnectionState.Selected){L.state=l.ProcessFlowConnectionState.Regular;}}else if(c.displayState===l.ProcessFlowDisplayState.Dimmed||c.displayState===l.ProcessFlowDisplayState.DimmedFocused){if(L.state!==l.ProcessFlowConnectionState.Highlighted&&L.state!==l.ProcessFlowConnectionState.Regular&&L.state!==l.ProcessFlowConnectionState.Selected){L.state=l.ProcessFlowConnectionState.Dimmed;}}}return L;};a.prototype.addConnectionData=function(s){var t=this.getDrawData();if(!t){t=[];}t.push(s);this.setDrawData(t);return t;};a.prototype.destroyAggregation=function(A,s){this.removeAllAggregation("_labels",true);};return a;});
