/*!
 * SAPUI5

		(c) Copyright 2009-2021 SAP SE. All rights reserved
	
 */
sap.ui.define(["../i18n"],function(i){var m={};m.ESHUIError=function E(p){if(typeof p==="string"){this.message=p;}if(p){if(p.message){this.message=p.message;}if(p.previous){this.previous=p.previous;}}this.name="ESHUIError";this.stack=new Error().stack;};m.ESHUIConstructionError=function E(p){this.name="ESHUIConstructionError";this.message=i.getText("error.ESHUIConstructionError.message");this.stack=new Error().stack;this.previous=p;};m.UnknownDataSourceType=function U(p){this.name="UnknownDataSourceType";this.message=i.getText("error.UnknownDataSourceType.message");this.solution=i.getText("error.UnknownDataSourceType.solution");this.stack=new Error().stack;this.previous=p;};m.UnknownFacetType=function U(p){this.name="UnknownFacetType";this.message=i.getText("error.UnknownFacetType.message");this.solution=i.getText("error.UnknownFacetType.solution");this.stack=new Error().stack;this.previous=p;};m.ProgramError=function P(p){this.name="ProgramError";this.message=i.getText("error.TypeError.message");this.solution=i.getText("error.TypeError.solution");this.stack=new Error().stack;this.previous=p;};return m;});
