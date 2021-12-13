/*!
 * (c) Copyright 2010-2019 SAP SE or an SAP affiliate company.
 */
sap.ui.define(["jquery.sap.global"],function(q){"use strict";q.sap.declare("sap.zen.crosstab.IDataCell");sap.zen.crosstab.IDataCell=function(d){this.getText=function(){return d.getText();};this.getId=function(){return d.getId();};this.getRow=function(){return d.getRow();};this.getCol=function(){return d.getCol();};};return sap.zen.crosstab.IDataCell;});
