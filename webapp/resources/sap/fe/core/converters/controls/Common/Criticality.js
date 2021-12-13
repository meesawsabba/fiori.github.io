/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)
 *      (c) Copyright 2009-2021 SAP SE. All rights reserved
 */
sap.ui.define(["sap/fe/core/formatters/TableFormatterTypes"],function(T){"use strict";var _={};var M=T.MessageType;function g(c){var m;switch(c){case"UI.CriticalityType/Negative":case"UI.CriticalityType/VeryNegative":m=M.Error;break;case"UI.CriticalityType/Critical":m=M.Warning;break;case"UI.CriticalityType/Positive":case"UI.CriticalityType/VeryPositive":m=M.Success;break;case"UI.CriticalityType/Information":m=M.Information;break;case"UI.CriticalityType/Neutral":default:m=M.None;}return m;}_.getMessageTypeFromCriticalityType=g;return _;},false);
