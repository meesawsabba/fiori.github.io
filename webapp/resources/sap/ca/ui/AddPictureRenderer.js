/*
 * Copyright (C) 2009-2014 SAP SE or an SAP affiliate company. All rights reserved
 */
jQuery.sap.declare("sap.ca.ui.AddPictureRenderer");jQuery.sap.require("sap.ca.ui.JS.jquery-ui-widget");jQuery.sap.require("sap.ca.ui.JS.jquery-iframe-transport");jQuery.sap.require("sap.ca.ui.JS.jquery-fileupload");sap.ca.ui.AddPictureRenderer={};
sap.ca.ui.AddPictureRenderer.render=function(r,c){var e=c.getEditable();var b=c.getButtonPageType();var p=c.getPictures();var P=p.length;var m=c.getMaxPictureNumber();r.write("<div");r.writeControlData(c);r.addClass("sapCaUiAddPicture");r.addClass("sapUiHLayout");r.addClass("sapUiHLayoutNoWrap");r.writeClasses();var w=c.getWidth();var a=c.getPictureAlign();var d=(a==sap.ui.core.TextAlign.Right)?"sapCaUiPictureItemAlignRight":"sapCaUiPictureItemAlignLeft";if(w){r.addStyle("width",w);r.addStyle("text-align",a);}r.writeStyles();r.write(">");if(e){r.write("<div");r.addClass("sapCaAPAddButton");r.writeClasses();r.write(">");r.renderControl(c._getButton());if(P<m){r.write("<input type='file' accept='image/*' class='sapCaAPInputFile' ");if(jQuery.device.is.desktop){r.writeAttribute("tabindex","-1");}r.writeAttributeEscaped("id",c.getId()+"-capture");r.write(">");}if(P>0&&b==sap.ca.ui.AddPicture.BUTTON_PAGE_TYPE.TAB){r.write("<hr");r.addClass("sapCaUiHorizontalRuler");r.writeClasses();r.write("></hr>");}r.write("</div>");}r.write("<div ");r.writeAttributeEscaped("id",c.getId()+"-imageContainer");r.addClass("sapCaUiAddPictureHLayout");r.writeClasses();r.write(">");if(p){for(var i=0;i<P;i++){p[i]._addPictureId=c.getId();p[i].addStyleClass(d);if(!c.hasListeners("show")){p[i].addStyleClass("sapCaUiPictureItemNoPress");}var s=isNaN(parseInt(c.getItemSize(),10))?60:parseInt(c.getItemSize(),10);p[i]._width=s+"px";p[i]._height=s+"px";r.renderControl(p[i]);}}r.write("</div>");r.write("</div>");};
