/*!
 * SAPUI5
  (c) Copyright 2009-2021 SAP SE. All rights reserved
 */
sap.ui.define(["jquery.sap.global"],function(q){q.sap.declare("sap.zen.dsh.DshRenderer");sap.zen.dsh.DshRenderer={};sap.zen.dsh.DshRenderer.render=function(r,c){r.write("<div");r.writeControlData(c);r.addStyle("width",c.getWidth());r.addStyle("height",c.getHeight());r.addClass("sapZenDshDsh");r.addClass("sapUiBody");r.writeStyles();r.writeClasses();r.write(">");r.write("<div id=\""+c.getId()+"sapbi_snippet_ROOT\" ");r.writeAttribute("class","sapbi_snippet_ROOT");r.addClass("sapUiBody");r.write("style=\"");r.write("width:100%;");r.write("height:100%;");r.write("\">");r.write("</div>");r.write("</div>");};});
