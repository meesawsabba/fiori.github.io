/*!
 * SAPUI5
 * (c) Copyright 2009-2021 SAP SE. All rights reserved.
 */
sap.ui.define(['./library','sap/ui/core/Element'],function(l,E){"use strict";var I=E.extend("sap.suite.ui.microchart.InteractiveLineChartPoint",{metadata:{library:"sap.suite.ui.microchart",properties:{label:{type:"string",group:"Misc",defaultValue:null},secondaryLabel:{type:"string",group:"Misc",defaultValue:null},selected:{type:"boolean",group:"Appearance",defaultValue:false},value:{type:"float",group:"Data",defaultValue:null},displayedValue:{type:"string",group:"Data",defaultValue:null},color:{type:"sap.m.ValueColor",group:"Misc",defaultValue:"Neutral"}}}});I.prototype.init=function(){this._bNullValue=true;this._oRb=sap.ui.getCore().getLibraryResourceBundle("sap.suite.ui.microchart");};I.prototype.validateProperty=function(p,v){if(p==="value"&&(v===null||v===undefined)){this._bNullValue=true;}else if(p==="value"){this._bNullValue=false;}return E.prototype.validateProperty.apply(this,arguments);};I.prototype.getTooltip_AsString=function(){var t=this.getTooltip_Text();this._bCustomTooltip=true;if(!t){t=this._createTooltipText();this._bCustomTooltip=false;}else if(l._isTooltipSuppressed(t)){t=null;}return t;};I.prototype._createTooltipText=function(){var t="";var L=this.getLabel();if(L&&L.length>0){t=L+":\n";}if(this._bNullValue){t+=this._oRb.getText("INTERACTIVECHART_NA");}else{t+=this.getValue();}var c=this._getSemanticColor();if(c){t+=" "+c;}return t;};I.prototype._getSemanticColor=function(){var c=this.getColor();var p=this.getParent();if(p&&p._bSemanticTooltip){return this._oRb.getText("SEMANTIC_COLOR_"+c.toUpperCase());}return"";};I.prototype._getAreaTooltip=function(){var t=this.getTooltip_AsString();if(t&&!this._bCustomTooltip){t=t.replace("\n"," ");}return t;};return I;});
