// This class handles the process of editing the objects on List Report. Editing is done in a dialog opened on List Report.
// Single object - Individual object can be selected for editing.
// Multiple objects - Multiple objects can be edited to provide same column values.
//
// - fnOnMultiEditButtonPress: The event handler for the multi edit button on the LR. It decides whether the selected contexts are updatable.
//                            - Yes: Open the Edit Dialog.
//                            - No: Opens a dialog to confirm continuation with only updatable context.
//
//- fnOpenMultiEditDialog: Opens the Edit Dialog and creates its content. Following tasks are performed to create content:
//                          1. Find the updatable and supported properties
//                          2. Create Smartmultiedit/Field for above properties
//                          3. Set smartmultiedit/Container as content of dialog.
//
//- fnOnSaveMultiEditDialog: Updates the changed contexts.


sap.ui.define([
    "sap/ui/base/Object",
    "sap/base/util/extend",
    "sap/ui/comp/smartform/Group",
    "sap/ui/comp/smartform/GroupElement",
    "sap/ui/comp/smartmultiedit/Field",
    "sap/ui/comp/smartform/SmartForm",
    "sap/ui/comp/smartmultiedit/Container",
    "sap/suite/ui/generic/template/genericUtilities/testableHelper",
    "sap/suite/ui/generic/template/js/StableIdHelper",
    "sap/suite/ui/generic/template/lib/MessageUtils"
], function (BaseObject, extend, Group, GroupElement, Field, SmartForm, Container, testableHelper, StableIdHelper, MessageUtils) {
    "use strict";
    function getMethods(oState, oController, oTemplateUtils) {
        var aUpdatableContexts, bShowVisibleColumns;
        function fnOnMultiEditButtonPress() {
            var aContexts = oState.oPresentationControlHandler.getSelectedContexts();
            aUpdatableContexts = aContexts.filter(oTemplateUtils.oCommonUtils.isContextEditable);
            if (aContexts.length === aUpdatableContexts.length) {
                fnOpenMultiEditDialog(aUpdatableContexts);
            } else {
                oTemplateUtils.oCommonUtils.getDialogFragmentAsync("sap.suite.ui.generic.template.ListReport.view.fragments.MultiEditConfirmation", {
                    onCancel: function (oEvent) {
                        var oDialog = oEvent.getSource().getParent();
                        oDialog.close();
                    },
                    onContinue: function (oEvent) {
                        var oDialog = oEvent.getSource().getParent();
                        fnOpenMultiEditDialog(aUpdatableContexts);
                        oDialog.close();
                    }
                }, "multiEditConfirmation").then(function (oMultiEditConfirmationDialog) {
                    var oMultiEditConfirmationModel = oMultiEditConfirmationDialog.getModel("multiEditConfirmation");
                    var sWarningTextKey = aUpdatableContexts.length === 1 ? "EDIT_REMAINING" : "EDIT_REMAINING_PLURAL";
                    var sWarningText = oTemplateUtils.oCommonUtils.getText(sWarningTextKey, [aContexts.length - aUpdatableContexts.length, aContexts.length, aUpdatableContexts.length]);
                    oMultiEditConfirmationModel.setProperty("/warningText", sWarningText);
                    oMultiEditConfirmationDialog.open();
                });
            }
        }

        function fnOpenMultiEditDialog(aUpdatableContexts) {
            var sSelectedTabKey = oState.oMultipleViewsHandler && oState.oMultipleViewsHandler.getSelectedKey();
            var sIdForMultiEditDialog = StableIdHelper.getStableId({
                type: "ListReportAction",
                subType: "MultiEditDialog",
                sQuickVariantKey : sSelectedTabKey
            });
            var oMultiEditDialog = oController.byId(sIdForMultiEditDialog);
            var sDialogTitle = aUpdatableContexts.length === 1 ? oTemplateUtils.oCommonUtils.getText("MULTI_EDIT_DIALOG_TITLE_SINGULAR") : oTemplateUtils.oCommonUtils.getText("MULTI_EDIT_DIALOG_TITLE_PLURAL", aUpdatableContexts.length);
            var oModel = new sap.ui.model.json.JSONModel();
            oModel.setProperty("/title", sDialogTitle);
            oMultiEditDialog.setModel(oModel,"localModel");
            bShowVisibleColumns = false;
            // In case annotationPath is given in manifest then content of dialog is already created at templating time.
            // Otherwise, content of dialog is created here from the visible columns of table. 
            if (oMultiEditDialog.getContent().length === 0) {
                bShowVisibleColumns = true;
                // get Columns to be shown for editing.
                var aShowColumns = fnGetColumnsToShow();
                //create Group of columns to be shown
                var oGroup = new Group();
                aShowColumns.forEach(function (oColumn) {
                    var oGroupElement = new GroupElement();
                    var oSmartmultieditField = new Field({
                        propertyName: oColumn.data("p13nData").leadingProperty,
                        useApplyToEmptyOnly: false
                    });
                    oGroupElement.addElement(oSmartmultieditField);
                    oGroup.addGroupElement(oGroupElement);
                });

                // we distroy the content of dailog everytime we close it, because when dialog is opened next time, the visible columns might have been changed
                // hence we need to create the content(Smart container and Smart Form) again.
                var oSmartForm = new SmartForm();
                var oContainer = new Container();
                /* getEntitySet should not be a method of PresentationControlHandler. For more details, refer to the comment 
			   	   mentioned before the method's definition in the class */
                var sEntitySet = oState.oPresentationControlHandler.getEntitySet();
                oContainer.setEntitySet(sEntitySet);
                oSmartForm.addGroup(oGroup);
                oContainer.setLayout(oSmartForm);
                oMultiEditDialog.addContent(oContainer);
            }
            oMultiEditDialog.getContent()[0].setContexts(aUpdatableContexts);
            oMultiEditDialog.open();
        }

        // get supported and updatable columns. Ignore actions, dataFieldForAnnotations and custom columns.
        // How to identify above cases:
        // actions - in CustomData actionButton = true
        // dataFieldForAnnotations - column key contains 'DataFieldForAnnotation'
        // custom columns - do not have leadingProperty
        //
        // Immuatble - either Immuatble should not be there. if it is there, it should be false. Only then property would be updatable.          
        function fnGetColumnsToShow() {
            var oMetaModel = oController.getOwnerComponent().getModel().getMetaModel();
            /* getEntitySet should not be a method of PresentationControlHandler. For more details, refer to the comment 
			   mentioned before the method's definition in the class */
            var oEntityType = oMetaModel.getODataEntityType(oMetaModel.getODataEntitySet(oState.oPresentationControlHandler.getEntitySet()).entityType);
            
            return oState.oPresentationControlHandler.getVisibleProperties().filter(function (oColumn) {
                var sColumnKey = oColumn.data("p13nData") && oColumn.data("p13nData").columnKey;
                var oProperty = oMetaModel.getODataProperty(oEntityType, oColumn.data("p13nData").leadingProperty);
                if (oProperty) {
                    return oColumn.getVisible() && (sColumnKey.indexOf("DataFieldForAnnotation") < 0) && !oColumn.data("p13nData").actionButton && !!oColumn.data("p13nData").leadingProperty
                        && oProperty["sap:updatable"] !== "false" && (!oProperty["Org.OData.Core.V1.Immutable"] || oProperty["Org.OData.Core.V1.Immutable"].Bool === "false");
                }
            });
        }

        function fnOnSaveMultiEditDialog(oEvent) {
            var oMultiEditDialog = oEvent.getSource().getParent();
            var oMultiEditContainer = oMultiEditDialog.getContent()[0];

            // getErroneousFieldsAndTokens returns fields with errors. The fields with errors are highlighted red by the smartMultiEdit control itself.
            // Save if there are no errors.
            // However getErroneousFieldsAndTokens triggers a call if changed fields include value help or drop down. This needs to be checked because validations should not trigger a backend call.
            var oValidationPromise = oMultiEditContainer.getErroneousFieldsAndTokens();
            oValidationPromise.then(function (aErrorFields) {
                if (aErrorFields.length === 0) {
                    oMultiEditDialog.close();
                    var oUpdatedData;
                    //Add updated field and value in oUpdatedData.
                    var fnPrepareUpdatedData = function (oData, oField) {
                        var sPropName = oField.getPropertyName(),
                            sUomPropertyName = oField.getUnitOfMeasurePropertyName();
                        oUpdatedData[sPropName] = oData[sPropName];
                        if (oField.isComposite()) {
                            oUpdatedData[sUomPropertyName] = oData[sUomPropertyName];
                        }
                    };
                    // Get all the updated objects, with the updated data object.
                    // Fields of oMultiEditContainer could be in one of the following states:
                    // 1. <Keep Existing Value>
                    // 2. <Replace Field Value>
                    // 3. <Clear Field Value>
                    // Filter fields with 2 and 3 values. For each field use fnHandler function to create an object with all the updated field and value pair.
                    //
                    // Following optimization can be done:
                    //          a. oUpdatedData can be derived only once. since updated field values would be same for all context.
                    //          a. explore getAllUpdatedContexts(false), this method return only the fields which are changed. For example if user choose 'Currency = EUR', from selected contexts this function would return only context where previous value was not EUR.
                    //              While exploring getAllUpdatedContexts(false), specially test cases with <Clear fields value>. Also if this approach is taken then oUpdatedData would be different for all contexts.
                    oMultiEditContainer.getAllUpdatedContexts(true).then(function (aUpdatedContexts) {
                        var aContextsToBeUpdated = [];
                        var aChangedFields = oMultiEditContainer.getFields().filter(function (oField) {
                            return !oField.isKeepExistingSelected();
                        });
                        if (aChangedFields && aChangedFields.length > 0) {
                            aUpdatedContexts.forEach(function (oUpdatedContext) {
                                oUpdatedData = {};
                                aChangedFields.forEach(fnPrepareUpdatedData.bind(null, oUpdatedContext.data));
                                aContextsToBeUpdated.push({
                                    sContextPath: oUpdatedContext.context.getPath(),
                                    oUpdateData: oUpdatedData
                                });
                            });
                            // While implementing backend error Handling, destroying the dialog content might shift to another place as a user can correct error and retrigger the Save.
                            if (bShowVisibleColumns) {
                                oMultiEditDialog.destroyContent();
                            }
                            var oSaveMultipleContextsPromise = oTemplateUtils.oServices.oCRUDManager.updateMultipleEntities(aContextsToBeUpdated);
                            oSaveMultipleContextsPromise.then(function () {
                                oState.oPresentationControlHandler.refresh();
                                MessageUtils.showSuccessMessageIfRequired(oTemplateUtils.oCommonUtils.getText("OBJECT_SAVED"), oTemplateUtils.oServices);
                            });
                        } else {
                            MessageUtils.showSuccessMessageIfRequired(oTemplateUtils.oCommonUtils.getText("OBJECT_NOT_MODIFIED"), oTemplateUtils.oServices);
                        }
                    });
                }
            });
        }

        function fnOnCancelMultiEditDialog(oEvent) {
            var oMultiEditDialog = oEvent.getSource().getParent();
            oMultiEditDialog.close();
            if (bShowVisibleColumns) {
                oMultiEditDialog.destroyContent();
            }
        }

        /* eslint-disable */
        var fnOnSaveMultiEditDialog = testableHelper.testable(fnOnSaveMultiEditDialog, "fnOnSaveMultiEditDialog");
        /* eslint-disable */

        // public instance methods
        return {
            onMultiEditButtonPress: fnOnMultiEditButtonPress,
            onSaveMultiEditDialog: fnOnSaveMultiEditDialog,
            onCancelMultiEditDialog: fnOnCancelMultiEditDialog

        };
    }

    return BaseObject.extend("sap.suite.ui.generic.template.ListReport.controller.MultiEditHandler", {
        constructor: function (oState, oController, oTemplateUtils) {
            extend(this, getMethods(oState, oController, oTemplateUtils));
        }
    });
});