sap.ui.define([
    "sap/ui/base/Object",
    "sap/base/util/extend",
    "sap/suite/ui/generic/template/lib/presentationControl/SmartTableHandler",
    "sap/suite/ui/generic/template/lib/presentationControl/SmartListHandler",
    "sap/suite/ui/generic/template/lib/presentationControl/SmartChartHandler",
    "sap/suite/ui/generic/template/genericUtilities/controlHelper"
], function (BaseObject, extend, SmartTableHandler, SmartListHandler, SmartChartHandler, controlHelper) {
    "use strict";
    /* This factory class now primarily handles smart table or smart list or smart chart in the List Report but could also be extended to ALP and Object Page.
       It maintains the smart controls handlers in a map and when a handler is requested for any specific smart control, it checks whether the handler for the
       requested smart control already exists in the map and if it does, same is returned otherwise, a new handler instance for the requested smart control is
       created, put in the map (for future references) and returned to the caller.
       This class is instantiated per view i.e in the oServices object of TemplateAssembler class.
       The interface of each of the handlers is as follow:

       getBinding:                  returns a binding object for a specific property (items or rows) of the smart control.
       getBindingPath:              returns a string representing binding path that is used during the binding of the smart control.
       getItems:                    returns an array containing the content of items aggregation.
       getSelectedContexts:         returns an array of selected items contexts for each smart control.
       getVisibleProperties:        returns an array of the currently visible entities like columns of a smart table.
       getBindingInfo:              returns the binding info for the given property (items or rows) which contains information about path, binding object, sorter, filter etc.
       getModel:                    returns the smart control's model.
       setEnabledToolbarButtons:    used to set the enablement of toolbar button on user's selection interaction on the smart control.
       setEnabledFooterButtons:     used to set the enablement of footer button on user's selection interaction on the smart control.
       setCurrentVariantId:         used to set the variant of the smart control.
       setCurrentTableVariantId:    used to set the variant of the smart table.
       setCurrentChartVariantId:    used to set the variant of the smart table.
       refresh:                     used to refresh the data of the smart control.
       rebind:                      used to trigger binding call on the inner control used in the smart control. The binding of a control represents the contexts
                                    which determines its overall content and presentation. Rebinding a control leads to an implicit call to refresh its data as well.
       applyNavigationSortOrder:    used to set a final sort order to the smart control in case of external navigation scenario. */

    function getMethods(oController, oCommonUtils, oComponentUtils) {
        /* Currently only 'activeButtonTableState' custom data is being used in MultipleTablesModeHelper class. 
           The existing design of setting custom data in fragment at template time and fetching the same in its controller at runtime is not
           correct as we can get all the required details at runtime itself. Thus, ideally the below two methods i.e. getActiveButtonTableStateCustomData 
           and setActiveButtonTableStateCustomData should not be needed.
           Earlier, some custom data was being stored in respective control (SmartTable and SmartChart) in multiple tables mode and in case of
           single table mode, it was being stored in the switching control (SegmentedButton or the Select control). In order to make it consistent,
           those custom data have been set in IconTabFilter in multiple tables mode. This has resulted in having repeatetive custom data in control
           and its corresponding switching control in both the cases [already present for single table mode].
           TODO: First the custom data from the control's fragment should be removed and it should only be present in the switching control. It would
           require adaptation at few places wherein custom data is being fetched from the control.
           Then as a second step, custom data from the switching control should also be removed which will result in removing the below two 
           aforementioned methods as well. */
        function getActiveButtonTableStateCustomData(oControl) {
            var aControlCustomData = oControl.getCustomData();
            for (var i = 0; i < aControlCustomData.length; i++) {
                var sKey = aControlCustomData[i].getKey();
                if (sKey && sKey === "activeButtonTableState") {
                    return aControlCustomData[i];
                }
            }
        }

        function setActiveButtonTableStateCustomData(oControl, bValue) {
            var oCustomData = getActiveButtonTableStateCustomData(oControl);
            if (oCustomData) {
                oControl.removeCustomData(oCustomData);
            }
            oControl.addCustomData(new sap.ui.core.CustomData({
                key: "activeButtonTableState",
                value: bValue
            }));
        }

        /* In case of multiple tables mode, the entitySet is actually derived from the manifest settings for the corresponding tab and in all other 
           cases, its derived from the component and thus getting the entity set from the control is just a detour as the same has been set by the 
           framework in the corresponding control's fragment.
           TODO: To adapt all the places wherein this method is being consumed and make sure to eliminate the dependency of getting the entity set from
           the control. 
           One such example is CreateWithDialogHandler. Instead of calling this method, fragments who calls the CreateWithDialog fragment has the information
           about its current control's entity set and it should be passed on the onPress event of the save button of the create with dialog popup which will
           remove the need to fetching the entity set from this method.
           Similary, all other instance should also get adapted accordingly */
        function getEntitySet(oControl) {
            return oControl.getEntitySet();
        }

        function getId(oControl) {
            return oControl.getId();
        }

        // map of all handlers (for the given control) identified by local id
        var mImplementingHandlers = {};
        return {
            getPresentationControlHandler: function (oControl) {
                if (!oControl) {
                    return;
                }
                
                var sId = oController.getView().getLocalId(oControl.getId());
                if (!mImplementingHandlers[sId]) {
                    var oHandler;
                    switch (true) {
                        case controlHelper.isSmartTable(oControl):
                            oHandler = new SmartTableHandler(oController, oCommonUtils, oComponentUtils, oControl);
                            break;
                        case controlHelper.isSmartChart(oControl):
                            oHandler = new SmartChartHandler(oController, oCommonUtils, oComponentUtils, oControl);
                            break;
                        case controlHelper.isSmartList(oControl):
                            oHandler = new SmartListHandler(oController, oCommonUtils, oComponentUtils, oControl);
                            break;
                        default:
                            return undefined;
                    }
                    oHandler.getActiveButtonTableStateCustomData = getActiveButtonTableStateCustomData.bind(null, oControl);
                    oHandler.setActiveButtonTableStateCustomData = setActiveButtonTableStateCustomData.bind(null, oControl);
                    oHandler.getEntitySet = getEntitySet.bind(null, oControl);
                    oHandler.getId = getId.bind(null, oControl);
                    mImplementingHandlers[sId] = oHandler;
                }
                return mImplementingHandlers[sId];
            }
        }; 
    }

    return BaseObject.extend("sap.suite.ui.generic.template.lib.presentationControl.PresentationControlHandlerFactory", {
        constructor: function (oController, oCommonUtils, oComponentUtils) {
            extend(this, getMethods(oController, oCommonUtils, oComponentUtils));
        }
    });
});