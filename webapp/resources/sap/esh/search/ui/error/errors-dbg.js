/*!
 * SAPUI5

		(c) Copyright 2009-2021 SAP SE. All rights reserved
	
 */
// @ts-check
sap.ui.define(["../i18n"], 
/**
 *
 * @param {*} i18n
 */
function (i18n) {
    var module = {};
    // generic ESH UI Error, DON'T USE THAT but create your own more specific error!
    module.ESHUIError = function ESHUIError(properties) {
        if (typeof properties === "string") {
            this.message = properties;
        }
        if (properties) {
            if (properties.message) {
                this.message = properties.message;
            }
            if (properties.previous) {
                this.previous = properties.previous;
            }
        }
        this.name = "ESHUIError";
        this.stack = new Error().stack;
    };
    module.ESHUIConstructionError = function ESHUIConstructionError(previousError) {
        this.name = "ESHUIConstructionError";
        this.message = i18n.getText("error.ESHUIConstructionError.message");
        this.stack = new Error().stack;
        this.previous = previousError;
    };
    module.UnknownDataSourceType = function UnknownDataSourceType(previousError) {
        this.name = "UnknownDataSourceType";
        this.message = i18n.getText("error.UnknownDataSourceType.message");
        this.solution = i18n.getText("error.UnknownDataSourceType.solution");
        this.stack = new Error().stack;
        this.previous = previousError;
    };
    module.UnknownFacetType = function UnknownFacetType(previousError) {
        this.name = "UnknownFacetType";
        this.message = i18n.getText("error.UnknownFacetType.message");
        this.solution = i18n.getText("error.UnknownFacetType.solution");
        this.stack = new Error().stack;
        this.previous = previousError;
    };
    module.ProgramError = function ProgramError(previousError) {
        this.name = "ProgramError";
        this.message = i18n.getText("error.TypeError.message");
        this.solution = i18n.getText("error.TypeError.solution");
        this.stack = new Error().stack;
        this.previous = previousError;
    };
    return module;
});
