/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)
        (c) Copyright 2009-2021 SAP SE. All rights reserved
    
 */

sap.ui.define(["sap/fe/core/converters/ConverterContext", "sap/base/util/merge", "sap/base/util/uid", "sap/base/util/deepClone"], function(
	ConverterContext,
	merge,
	uid,
	deepClone
) {
	"use strict";
	var fnGetOverrides = function(mControlConfiguration, sID) {
		var oProps = {};
		if (mControlConfiguration) {
			var oControlConfig = mControlConfiguration[sID];
			if (oControlConfig) {
				Object.keys(oControlConfig).forEach(function(sConfigKey) {
					oProps[sConfigKey] = oControlConfig[sConfigKey];
				});
			}
		}
		return oProps;
	};
	var fnSetDefaultValue = function(oProps, sPropName, oOverrideValue) {
		if (oProps[sPropName] === undefined) {
			oProps[sPropName] = oOverrideValue;
		}
	};

	/**
	 * @class Base class for all SAP Fiori elements building blocks. This class is not meant to be used as a stand-alone class.
	 *
	 * @hideconstructor
	 * @name sap.fe.macros.MacroMetadata
	 * @public
	 * @since 1.90.0
	 */
	var MacroMetadata = {
		metadata: {
			properties: {
				_flexId: {
					type: "string"
				}
			}
		},
		extend: function(fnName, oContent) {
			oContent.metadata.properties._flexId = MacroMetadata.metadata.properties._flexId;
			oContent.hasValidation = true;
			oContent.getOverrides = fnGetOverrides.bind(oContent);
			oContent.setDefaultValue = fnSetDefaultValue.bind(oContent);
			oContent.getConverterContext = function(oVisualizationObjectPath, contextPath, mSettings, mExtraParams) {
				var oAppComponent = mSettings.appComponent;
				var originalViewData = mSettings.models.viewData && mSettings.models.viewData.getData();
				var viewData = Object.assign({}, originalViewData);
				delete viewData.resourceBundle;
				viewData = deepClone(viewData);
				viewData.controlConfiguration = merge(viewData.controlConfiguration, mExtraParams);
				var oConverterContext = ConverterContext.createConverterContextForMacro(
					oVisualizationObjectPath.startingEntitySet.name,
					mSettings.models.metaModel,
					oAppComponent && oAppComponent.getDiagnostics(),
					merge,
					oVisualizationObjectPath.contextLocation,
					viewData
				);
				return oConverterContext;
			};
			oContent.createBindingContext = function(oData, mSettings) {
				var sContextPath = "/" + uid();
				mSettings.models.converterContext.setProperty(sContextPath, oData);
				return mSettings.models.converterContext.createBindingContext(sContextPath);
			};
			oContent.parseAggregation = function(oAggregation, fnCallback) {
				var oOutObjects = {};
				if (oAggregation && oAggregation.children.length > 0) {
					var children = oAggregation.children;
					for (var childIdx = 0; childIdx < children.length; childIdx++) {
						var childObject = fnCallback(children[childIdx], childIdx);
						if (childObject) {
							oOutObjects[childObject.key] = childObject;
						}
					}
				}
				return oOutObjects;
			};
			return oContent;
		}
	};
	return MacroMetadata;
});
