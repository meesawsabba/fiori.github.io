/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)
        (c) Copyright 2009-2021 SAP SE. All rights reserved
    
 */
sap.ui.define(["sap/fe/macros/DelegateUtil", "sap/ui/model/json/JSONModel", "sap/fe/macros/CommonHelper"], function(
	DelegateUtil,
	JSONModel,
	Common
) {
	"use strict";

	var Delegate = {
		/**
		 * @param {object} mPropertyBag Object with parameters as properties
		 * @param {sap.ui.core.util.reflection.BaseTreeModifier} mPropertyBag.modifier Modifier to harmonize access, creation and manipulation to controls in XML Views and JS Controls
		 * @param {sap.ui.core.UIComponent} [mPropertyBag.appComponent] Needed to calculate the correct ID in case you provide an selector
		 * @param {Element} [mPropertyBag.view] XML node of the view, required for XML case to create nodes and to find elements
		 * @param {object} [mPropertyBag.fieldSelector] Selector to calculate the ID for the control that is created
		 * @param {string} [mPropertyBag.fieldSelector.id] Control ID targeted by the change
		 * @param {boolean} [mPropertyBag.fieldSelector.isLocalId] `true` if the ID within the selector is a local ID or a global ID
		 * @param {string} mPropertyBag.bindingPath Runtime binding path the control should be bound to
		 * @param {object} mPropertyBag.payload Payload parameter attached to the delegate, undefined if no payload was assigned
		 * @param {string} mPropertyBag.controlType Control type of the element the delegate is attached to
		 * @param {string} mPropertyBag.aggregationName Name of the aggregation the delegate should provide additional elements
		 * @returns {Promise<sap.ui.fl.delegate.LayoutControlInfo>} Map containing the controls to add
		 */
		createLayout: function(mPropertyBag) {
			var oModifier = mPropertyBag.modifier,
				oMetaModel = mPropertyBag.appComponent && mPropertyBag.appComponent.getModel().getMetaModel(),
				oForm = mPropertyBag.element,
				sPath,
				oFormContainer,
				sPropertyPath,
				oMetaModelContext,
				oPropertyContext,
				sFormId;

			return Promise.resolve()
				.then(DelegateUtil.getCustomData.bind(DelegateUtil, oForm, "entitySet", oModifier))
				.then(function(sEntitySetCustomData) {
					if (!sEntitySetCustomData) {
						return DelegateUtil.getCustomData(oForm, "navigationPath", oModifier);
					}
					return sEntitySetCustomData;
				})
				.then(function(sEntitySet) {
					sPath = "/" + sEntitySet;
					oFormContainer = mPropertyBag.parentSelector
						? mPropertyBag.modifier.bySelector(mPropertyBag.parentSelector, mPropertyBag.appComponent, mPropertyBag.view)
						: undefined;
					return DelegateUtil.getCustomData(oFormContainer, "navigationPath", oModifier);
				})
				.then(function(sNavigationPath) {
					sPropertyPath = sNavigationPath ? sPath + "/" + sNavigationPath : sPath;
					oMetaModelContext = oMetaModel.getMetaContext(sPropertyPath);
					oPropertyContext = oMetaModel.createBindingContext(sPropertyPath + "/" + mPropertyBag.bindingPath);
					sFormId = mPropertyBag.element.sId || mPropertyBag.element.id;

					var oParameters = {
						sPropertyName: mPropertyBag.bindingPath,
						sBindingPath: sPath,
						sValueHelpType: "FormVH",
						oControl: oForm,
						oMetaModel: oMetaModel,
						oModifier: oModifier
					};

					var oValueHelp = Promise.all([
						DelegateUtil.isValueHelpRequired(oParameters),
						DelegateUtil.doesValueHelpExist(oParameters)
					]).then(function(aResults) {
						var bValueHelpRequired = aResults[0],
							bValueHelpExists = aResults[1];
						if (bValueHelpRequired && !bValueHelpExists) {
							return fnTemplateValueHelp("sap.fe.macros.flexibility.ValueHelpWrapper");
						}
						return Promise.resolve();
					});

					function fnTemplateValueHelp(sFragmentName) {
						var oThis = new JSONModel({
								id: sFormId,
								idPrefix: mPropertyBag.fieldSelector.id
							}),
							oPreprocessorSettings = {
								bindingContexts: {
									"entitySet": oMetaModelContext,
									"property": oPropertyContext,
									"this": oThis.createBindingContext("/")
								},
								models: {
									"this": oThis,
									"entitySet": oMetaModel,
									metaModel: oMetaModel,
									"property": oMetaModel
								}
							};

						return DelegateUtil.templateControlFragment(sFragmentName, oPreprocessorSettings, {}, oModifier);
					}

					function fnTemplateFragment(sFragmentName, oView) {
						var sOnChangeCustomData;
						return Promise.resolve()
							.then(DelegateUtil.getCustomData.bind(DelegateUtil, oForm, "onChange", oModifier))
							.then(function(sRetrievedCustomData) {
								sOnChangeCustomData = sRetrievedCustomData;
								return DelegateUtil.getCustomData(oForm, "displayMode", oModifier);
							})
							.then(function(sDisplayModeCustomData) {
								var oThis = new JSONModel({
										// properties and events of Field macro
										_flexId: mPropertyBag.fieldSelector.id,
										onChange: Common.removeEscapeCharacters(sOnChangeCustomData),
										displayMode: Common.removeEscapeCharacters(sDisplayModeCustomData)
									}),
									oPreprocessorSettings = {
										bindingContexts: {
											"entitySet": oMetaModelContext,
											"dataField": oPropertyContext,
											"this": oThis.createBindingContext("/")
										},
										models: {
											"this": oThis,
											"entitySet": oMetaModel,
											metaModel: oMetaModel,
											"dataField": oMetaModel
										}
									};
								return DelegateUtil.templateControlFragment(
									sFragmentName,
									oPreprocessorSettings,
									{ view: oView },
									oModifier
								);
							});
					}

					return oValueHelp.then(function(oValueHelp) {
						return fnTemplateFragment("sap.fe.macros.form.FormElement", mPropertyBag.view).then(function(oField) {
							return {
								control: oField,
								valueHelp: oValueHelp
							};
						});
					});
				});
		}
	};
	return Delegate;
});
