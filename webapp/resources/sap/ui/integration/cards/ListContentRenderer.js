/*!
 * OpenUI5
 * (c) Copyright 2009-2021 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(["./BaseContentRenderer"],function(B){"use strict";var L=B.extend("sap.ui.integration.cards.ListContentRenderer",{apiVersion:2});L.renderContent=function(r,l){r.renderControl(l.getAggregation("_content"));if(l.getAggregation("_legend")){r.renderControl(l.getAggregation("_legend"));}};L.getMinHeight=function(c,C){if(!c||!c.maxItems||!c.item){return this.DEFAULT_MIN_HEIGHT;}var i=this.getItemMinHeight(c,C),a=parseInt(c.maxItems)||0;return(a*i)+"rem";};L.getItemMinHeight=function(c,C){if(!c||!c.item){return 0;}var i=this.isCompact(C),t=c.item,I=i?2:2.75,a;if(t.description||t.chart){I=5;}if(t.description&&t.chart){I=6;}if(t.attributes){a=Math.ceil(t.attributes.length/2);I+=a*1.5;}if(t.actionsStrip){I+=i?2.5:3.25;}return I;};return L;});
