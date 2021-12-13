/*
 * SAPUI5
 * (c) Copyright 2009-2021 SAP SE. All rights reserved.
 */
sap.ui.define(["sap/ui/comp/smartfield/type/TextArrangement","sap/ui/comp/smartfield/type/String","sap/ui/model/ValidateException"],function(T,S,V){"use strict";var a=T.extend("sap.ui.comp.smartfield.type.TextArrangementString");a.prototype.getName=function(){return"sap.ui.comp.smartfield.type.TextArrangementString";};a.prototype.validateValue=function(v){var c=this.oConstraints||{},m=c.maxLength,s=v[0];if(this.oFormatOptions.textArrangement==="descriptionOnly"&&(s&&s.length>m)){throw new V(sap.ui.getCore().getLibraryResourceBundle("sap.ui.comp").getText("ENTER_A_VALID_VALUE"));}else{return T.prototype.validateValue.apply(this,arguments);}};a.prototype.getPrimaryType=function(){return S;};return a;});
