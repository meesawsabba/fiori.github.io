/*
 * ! SAPUI5
 * (c) Copyright 2009-2021 SAP SE. All rights reserved.
 */
sap.ui.define(["sap/ui/core/Core","sap/ui/core/library","sap/ui/comp/smartfield/type/String","sap/ui/comp/odata/type/NumericText","sap/ui/comp/odata/FiscalFormat","sap/ui/model/ValidateException"],function(C,c,S,N,F,V){"use strict";var a=S.extend("sap.ui.comp.odata.type.FiscalDate",{constructor:function(f,o,s){S.call(this,f,o);if(this.oConstraints&&this.oConstraints.isDigitSequence){N.call(this,f,o);}this.sAnotationType=s.anotationType;this.formatter=F.getDateInstance(Object.assign({format:a.oDateFormats[s.anotationType],calendarType:c.CalendarType.Gregorian},f));}});a.prototype.parseValue=function(v){if(v===""){return null;}if(this.oConstraints&&this.oConstraints.isDigitSequence){return this.formatter.parse(N.prototype.parseValue.apply(this,arguments));}return this.formatter.parse(S.prototype.parseValue.apply(this,arguments));};a.prototype.formatValue=function(v){var f;if(this.oConstraints&&this.oConstraints.isDigitSequence){f=N.prototype.formatValue.apply(this,arguments);}else{f=S.prototype.formatValue.apply(this,arguments);}if(f===null){return null;}return this.formatter.format(f);};a.prototype.validateValue=function(v){try{S.prototype.validateValue.apply(this,arguments);}catch(e){if(!this.formatter.validate(v)){throw new V(this.getErrorMessage(this.sAnotationType));}}if(v===null){return;}if(!this.formatter.validate(v)){throw new V(this.getErrorMessage(this.sAnotationType));}};a.prototype.destroy=function(){S.prototype.destroy.apply(this,arguments);if(this.formatter){this.formatter.destroy();this.formatter=null;}};a.prototype.getErrorMessage=function(A){var v;this.iFullYear=this.iFullYear||new Date().getFullYear().toString();switch(A){case"com.sap.vocabularies.Common.v1.IsFiscalYear":v=this.iFullYear;break;case"com.sap.vocabularies.Common.v1.IsFiscalPeriod":v="001";break;case"com.sap.vocabularies.Common.v1.IsFiscalYearPeriod":v=this.iFullYear+"001";break;case"com.sap.vocabularies.Common.v1.IsFiscalQuarter":v="1";break;case"com.sap.vocabularies.Common.v1.IsFiscalYearQuarter":v=this.iFullYear+"1";break;case"com.sap.vocabularies.Common.v1.IsFiscalWeek":v="01";break;case"com.sap.vocabularies.Common.v1.IsFiscalYearWeek":v=this.iFullYear+"01";break;case"com.sap.vocabularies.Common.v1.IsDayOfFiscalYear":v="1";break;case"com.sap.vocabularies.Common.v1.IsFiscalYearVariant":break;default:v=this.iFullYear;}return C.getLibraryResourceBundle("sap.ui.comp").getText("FISCAL_VALIDATION_FAILS",[this.formatValue(v,"string")]);};a.oDateFormats={"com.sap.vocabularies.Common.v1.IsFiscalYear":"YYYY","com.sap.vocabularies.Common.v1.IsFiscalPeriod":"PPP","com.sap.vocabularies.Common.v1.IsFiscalYearPeriod":"YYYYPPP","com.sap.vocabularies.Common.v1.IsFiscalQuarter":"Q","com.sap.vocabularies.Common.v1.IsFiscalYearQuarter":"YYYYQ","com.sap.vocabularies.Common.v1.IsFiscalWeek":"WW","com.sap.vocabularies.Common.v1.IsFiscalYearWeek":"YYYYWW","com.sap.vocabularies.Common.v1.IsDayOfFiscalYear":"d","com.sap.vocabularies.Common.v1.IsFiscalYearVariant":""};a.prototype.getName=function(){return"sap.ui.comp.odata.type.FiscalDate";};a.prototype.getFormatter=function(){return this.formatter;};return a;});
