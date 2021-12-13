/*!
 * (c) Copyright 2010-2019 SAP SE or an SAP affiliate company.
 */
sap.ui.define(["jquery.sap.global"],function(q){"use strict";q.sap.declare("sap.zen.crosstab.IHeaderCell");sap.zen.crosstab.IHeaderCell=function(h){this.getText=function(){return h.getText();};this.getId=function(){return h.getId();};this.getRow=function(){return h.getRow();};this.getCol=function(){return h.getCol();};};return sap.zen.crosstab.IHeaderCell;});
