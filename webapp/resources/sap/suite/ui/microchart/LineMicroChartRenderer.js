/*!
 * SAPUI5
 * (c) Copyright 2009-2021 SAP SE. All rights reserved.
 */
sap.ui.define(['./library','sap/ui/core/theming/Parameters','sap/suite/ui/microchart/MicroChartRenderUtils','sap/m/library'],function(l,P,M,m){"use strict";var L={apiVersion:2};var a=l.LineType;var V=m.ValueColor;L.QUALITATIVE_CLASS="sapUiChartPaletteQualitativeHue";L.QUALITATIVE_MAX=22;L.render=function(r,c){if(c._hasData()){r.openStart("div",c);this._writeMainProperties(r,c);if(c._bSemanticMode){r.class("sapSuiteLMCSemanticMode");}if(c._bFocusMode){r.class("sapSuiteLMCFocusMode");}if(c._bNoBottomLabels||!c.getShowBottomLabels()){r.class("sapSuiteLMCNoBottomLabels");}if(c._bNoTopLabels||!c.getShowTopLabels()){r.class("sapSuiteLMCNoTopLabels");}r.openEnd();r.openStart("div");r.class("sapSuiteLMCVerticalAlignmentContainer");r.openEnd();this._renderLabelsTop(r,c);r.openStart("div");r.class("sapSuiteLMCContentWrapper");r.openEnd();this._renderCanvas(r,c);this._renderThresholdLabel(r,c);r.close("div");this._renderLabelsBottom(r,c);r.close("div");r.close("div");}else{this._renderNoData(r,c);}};L._writeMainProperties=function(r,c){var i=c.hasListeners("press");this._renderActiveProperties(r,c);var A=c.getTooltip_AsString(i);r.attr("role","figure");if(c.getAriaLabelledBy().length){r.accessibilityState(c);}else{r.attr("aria-label",A);}r.class("sapSuiteLMC");r.class("sapSuiteLMCSize"+c.getSize());r.style("width",c.getWidth());r.style("height",c.getHeight());};L._renderCanvas=function(r,c){var p;var b;r.openStart("div");r.class("sapSuiteLMCSvgCanvas");r.openEnd();if(c._bScalingValid){r.openStart("svg",c.getId()+"-sapSuiteLMCSvgElement");r.attr("focusable","false");r.class("sapSuiteLMCSvgElement");r.openEnd();this._renderThresholdLine(r,c);c._getLines().forEach(function(o,I){r.openStart("g",o);r.openEnd();b=o._getPoints().length;for(var i=1;i<b;i++){this._renderLine(r,c,I,o._aNormalizedPoints[i-1].x,o._aNormalizedPoints[i-1].y,o._aNormalizedPoints[i].x,o._aNormalizedPoints[i].y);}r.close("g");},this);r.close('svg');r.openStart("div",c.getId()+"-sapSuiteLMCPointsContainer");r.class("sapSuiteLMCPointsContainer");r.openEnd();c._getLines().forEach(function(o,i){p=o._getPoints();b=p.length;var s=o.getShowPoints(),d,e;if(o._bFocusMode||s){for(var j=0;j<b;j++){d=p[j];e=this._isPointEmphasized(d);if(!o._bFocusMode&&s||o._bFocusMode&&e&&d.getShow()){this._renderPoint(r,c,i,d,j,e);}}}},this);r.close("div");}r.close("div");};L._renderThresholdLabel=function(r,c){var v=c.getThresholdDisplayValue();if(this._isThresholdValue(c)&&c.getShowThresholdLine()&&c.getShowThresholdValue()){r.openStart("div");r.class("sapSuiteLMCThresholdLabelWrapper");r.openEnd();r.openStart("div");r.class("sapSuiteLMCThresholdLabel");r.openEnd();v=v?v:c.getThreshold();r.text(v);r.close("div");r.close("div");}};L._renderPoint=function(r,c,i,p,b,e){var o=c._getLines()[i],t=o.getType(),n=o._aNormalizedPoints[b],C=o.getColor(),d,s;if(n.x<0||n.x>100||n.y<0||n.y>100){return;}r.openStart("div");r.style("left",n.x+"%");r.style("top",(100-n.y)+"%");s=(t===a.Dotted)?"border-color":"background-color";r.class("sapSuiteLMCPoint"+t);if(o._bFocusMode&&o._bSemanticMode){d=p.getColor();if(V[d]){r.class("sapSuiteLMCPoint"+d);}else{r.style(s,this._getHexColor(d));}}else if(!o._bFocusMode&&o._bSemanticMode){if(p.getY()>=c.getThreshold()){if(V[C.above]){r.class("sapSuiteLMCPoint"+C.above);}else{r.style(s,this._getHexColor(C.above));}}else if(V[C.below]){r.class("sapSuiteLMCPoint"+C.below);}else{r.style(s,this._getHexColor(C.below));}}else if(!o._bSemanticMode&&typeof C==="string"){if(o.getColor()===V.Neutral){r.style(s,this._getQualitativeColor(i+1));}else if(V[C]){r.class("sapSuiteLMCPoint"+C);}else{r.style(s,this._getHexColor(C));}}else{r.style(s,this._getQualitativeColor(i+1));}r.class("sapSuiteLMCPoint");if(e&&p.getShow()){r.class("sapSuiteLMCPointEmphasized");}r.openEnd();r.close("div");};L._renderThresholdLine=function(r,c){if(this._isThresholdValue(c)&&c.getShowThresholdLine()){r.openStart("line");r.attr("x1","0%");r.attr("y1",(100-c._fNormalizedThreshold)+"%");r.attr("x2","100%");r.attr("y2",(100-c._fNormalizedThreshold)+"%");r.class("sapSuiteLMCLineThreshold");r.openEnd();r.close("line");}};L._isThresholdValue=function(c){return c._fNormalizedThreshold>=0&&c._fNormalizedThreshold<=100&&!c._bThresholdNull;};L._renderLine=function(r,c,i,s,S,e,E){if(this._isDimensionLineOutsideCanvas(c,s,e,"X")||this._isDimensionLineOutsideCanvas(c,S,E,"Y")){return;}var I,f,b=e-s,d=E-S;if((S-c._fNormalizedThreshold)*(E-c._fNormalizedThreshold)<0){I=s+(c._fNormalizedThreshold-S)*b/d;this._renderLine(r,c,i,s,S,I,c._fNormalizedThreshold);this._renderLine(r,c,i,I,c._fNormalizedThreshold,e,E);}else if(S*E<0){I=s-S*b/d;this._renderLine(r,c,i,s,S,I,0);this._renderLine(r,c,i,I,0,e,E);}else if((S-100)*(E-100)<0){I=s+(100-S)*b/d;this._renderLine(r,c,i,s,S,I,100);this._renderLine(r,c,i,I,100,e,E);}else if(s*e<0){f=S-s*d/b;this._renderLine(r,c,i,s,S,0,f);this._renderLine(r,c,i,0,f,e,E);}else if((s-100)*(e-100)<0){f=S+(100-s)*d/b;this._renderLine(r,c,i,s,S,100,f);this._renderLine(r,c,i,100,f,e,E);}else{this._displayLine(r,c,i,s,S,e,E);}};L._displayLine=function(r,c,i,s,S,e,E){var o=c._getLines()[i],C=o.getColor();r.openStart("line");r.attr("x1",s+"%");r.attr("y1",(100-S)+"%");r.attr("x2",e+"%");r.attr("y2",(100-E)+"%");r.class("sapSuiteLMCLine");r.class("sapSuiteLMCLine"+o.getType());if(o._bSemanticMode&&o._bFocusMode){r.class("sapSuiteLMCLineNeutral");}else if(o._bSemanticMode&&!o._bFocusMode){if(S>=c._fNormalizedThreshold&&E>=c._fNormalizedThreshold){if(V[C.above]){r.class("sapSuiteLMCLine"+C.above);}else{r.style("stroke",this._getHexColor(C.above));}}else if(V[C.below]){r.class("sapSuiteLMCLine"+C.below);}else{r.style("stroke",this._getHexColor(C.below));}}else if(!o._bSemanticMode&&typeof C==="string"){if(C===V.Neutral){r.style("stroke",this._getQualitativeColor(i+1));}else if(V[C]){r.class("sapSuiteLMCLine"+C);}else{r.style("stroke",this._getHexColor(C));}}else{r.style("stroke",this._getQualitativeColor(i+1));}r.openEnd();r.close("line");};L._getQualitativeColor=function(i){return this._getHexColor(this.QUALITATIVE_CLASS+(i%this.QUALITATIVE_MAX));};L._renderLabelsBottom=function(r,c){var s=c.getLeftBottomLabel(),R=c.getRightBottomLabel();if(!c.getShowBottomLabels()||(!s&&!R)){return;}r.openStart("div");r.class("sapSuiteLMCLabels");r.class("sapSuiteLMCLabelsBottom");r.openEnd();if((s&&s.length>0)||(R&&R.length>0)){r.openStart("div");r.class("sapSuiteLMCLeftBottomLabel");r.class("sapSuiteLMCLabel");r.openEnd();r.text(s);r.close("div");r.openStart("div");r.class("sapSuiteLMCRightBottomLabel");r.class("sapSuiteLMCLabel");r.openEnd();r.text(R);r.close("div");}r.close("div");};L._renderLabelsTop=function(r,c){var s=c.getLeftTopLabel(),R=c.getRightTopLabel(),o=c._getLines()[0];if(!c.getShowTopLabels()||(!s&&!R)){return;}var t="",T="",b="",d="",p,i,f,e,C;var A=function(h){r.style("color",h);};var S=function(h,I){var j="",k="";if(this._isPointEmphasized(h)&&h.getShow()){C=h.getColor();if(V[C]){j="sapSuiteLMCLabel"+C;}else{k=this._getHexColor(C);}}else{j="sapSuiteLMCLabelNeutral";}if(I){d=k;T=j;}else{b=k;t=j;}}.bind(this);if(o&&o._getPoints().length>1){p=o._getPoints();i=p.length;f=p[0];e=p[i-1];var g=o.getColor();if(o._bFocusMode&&o._bSemanticMode&&c._bScalingValid){S(f,false);S(e,true);}else if(!o._bFocusMode&&o._bSemanticMode&&c._bScalingValid&&o.getShowPoints()&&V[g.above]&&V[g.below]){if(f.getY()>=c.getThreshold()){t="sapSuiteLMCLabel"+g.above;}else{t="sapSuiteLMCLabel"+g.below;}if(e.getY()>=c.getThreshold()){T="sapSuiteLMCLabel"+g.above;}else{T="sapSuiteLMCLabel"+g.below;}}else{t="sapSuiteLMCLabelNeutral";T="sapSuiteLMCLabelNeutral";}}r.openStart("div");r.class("sapSuiteLMCLabels");r.class("sapSuiteLMCLabelsTop");r.openEnd();if((s&&s.length>0)||(R&&R.length>0)){r.openStart("div");r.class("sapSuiteLMCLeftTopLabel");r.class("sapSuiteLMCLabel");r.class(t);if(b){A(b);}r.openEnd();r.text(s);r.close("div");r.openStart("div");r.class("sapSuiteLMCRightTopLabel");r.class("sapSuiteLMCLabel");r.class(T);if(d){A(d);}r.openEnd();r.text(c.getRightTopLabel());r.close("div");}r.close("div");};L._isPointEmphasized=function(p){return p&&p.getMetadata().getName()==="sap.suite.ui.microchart.LineMicroChartEmphasizedPoint";};L._getHexColor=function(c){return P.get(c)||c;};L._isDimensionLineOutsideCanvas=function(c,s,e,b){var i=100,d=0;if(b==="X"&&c._minXScale===c._maxXScale){i=50;d=50;}else if(b==="Y"&&c._minYScale===c._maxYScale){i=50;d=50;}return((s>=i&&e>=i)&&!(s===i&&e===i))||((s<=d&&e<=d)&&!(s===d&&e===d));};M.extendMicroChartRenderer(L);return L;},true);
