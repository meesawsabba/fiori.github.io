/*!
 * (c) Copyright 2010-2019 SAP SE or an SAP affiliate company.
 */
sap.ui.define(["jquery.sap.global"],function(q){"use strict";q.sap.declare("sap.zen.crosstab.rendering.DomElementProvider");sap.zen.crosstab.rendering.DomElementProvider=function(){var d={};this.addElement=function(i,D){d[i]=D;};this.getElement=function(i){return d[i];};};return sap.zen.crosstab.rendering.DomElementProvider;});
