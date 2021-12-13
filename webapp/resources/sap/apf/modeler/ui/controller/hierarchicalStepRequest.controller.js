sap.ui.define(["sap/apf/modeler/ui/controller/stepRequest.controller","sap/apf/modeler/ui/utils/textManipulator","sap/ui/thirdparty/jquery"],function(B,t,q){"use strict";var t=sap.apf.modeler.ui.utils.textManipulator;var o=sap.apf.modeler.ui.utils.optionsValueModelBuilder;var n=sap.apf.modeler.ui.utils.nullObjectChecker;return B.extend("sap.apf.modeler.ui.controller.hierarchicalStepRequest",{onBeforeRendering:function(){var c=this;c.byId("idOptionalPropertyLabel").setVisible(true);c.byId("idOptionalProperty").setVisible(true);c.byId("idOptionalRequestFieldLabel").setVisible(true);c.byId("idOptionalRequestField").setVisible(true);c.byId("idOptionalLabelDisplayOptionType").setVisible(true);c.byId("idOptionalSelectedPropertyLabel").setVisible(true);c.byId("idOptionalSelectedPropertyLabelText").setVisible(true);},setDisplayText:function(){var c=this;var T=c.getView().getViewData().oTextReader;c.byId("idSourceLabel").setText(T("source"));c.byId("idEntityLabel").setText(T("hierarchicalEntity"));c.byId("idOptionalPropertyLabel").setText(T("hierarchicalProperty"));c.byId("idSelectPropertiesLabel").setText(T("nonHierarchicalProperty"));c.byId("idOptionalRequestFieldLabel").setText(T("requiredFilters"));},setOptionalHierarchicalProperty:function(){var c=this;var d=q.Deferred();var m,s,h,v;s=c.byId("idSource").getValue();h=c.byId("idEntity").getSelectedKey();c.byId("idOptionalProperty").setModel(null);c.byId("idOptionalProperty").clearSelection();if(!n.checkIsNotNullOrUndefinedOrBlank(s)){d.resolve();return d.promise();}c.getHierarchicalProperty(s,h).done(function(a){var S=c.getSelectedHierarchicalProperty();if(n.checkIsNotNullOrUndefinedOrBlank(S)){v=c.validateSelectedValues(c,[S],a);a=v.aValues;S=v.aSelectedValues[0];}m=o.convert(a);c.byId("idOptionalProperty").setModel(m);if(!n.checkIsNotNullOrUndefinedOrBlank(S)||a.indexOf(S)===-1){S=a[0];if(n.checkIsNotNullOrUndefinedOrBlank(S)){c.byId("idOptionalProperty").setSelectedKey(S);}d.resolve();}else if(n.checkIsNotNullOrUndefinedOrBlank(S)){c.byId("idOptionalProperty").setSelectedKey(S);d.resolve();}});return d.promise();},setOptionalRequestFieldProperty:function(){var c=this;var a,m,s,f,N,v=[],S,h,H,b;N=[c.getView().getViewData().oTextReader("none")];S=c.oParentObject.getService();h=c.oParentObject.getEntitySet();H=c.getSelectedHierarchicalProperty();a=N;s=N[0];if(S&&h&&H){c.getHierarchyNodeIdAsPromise(S,h,H).done(function(d){f=c.oParentObject.getFilterProperties();if(n.checkIsNotNullOrUndefinedOrBlank(f)){v=c.validateSelectedValues(c,f,[d]);f=v.aValues;s=v.aSelectedValues;}if(d){b={key:d,name:H};a=a.concat(b);}else{a=a.concat(f);}});}m=o.convert(a);c.byId("idOptionalRequestField").setModel(m);c.byId("idOptionalRequestField").setSelectedKey(s);},handleChangeForOptionalProperty:function(e){var c=this;var T=c.getView().getViewData().oTextReader;var h=t.removePrefixText(c.byId("idOptionalProperty").getSelectedKey(),T(sap.apf.modeler.ui.utils.CONSTANTS.texts.NOTAVAILABLE));c.updateHierarchicalProperty(h);c.clearOptionalRequestFieldProperty();c.setOptionalRequestFieldProperty();c.oConfigurationEditor.setIsUnsaved();c.fireRelevantEvents(e);},addOrRemoveMandatoryFieldsAndRequiredFlag:function(r){var c=this;if(r===false){return;}c.byId("idSourceLabel").setRequired(r);c.byId("idEntityLabel").setRequired(r);c.byId("idOptionalPropertyLabel").setRequired(r);c.viewValidator.addFields(["idSource","idEntity","idOptionalProperty"]);},getAllEntitiesAsPromise:function(s){var c=this;return c.oConfigurationEditor.getAllHierarchicalEntitySetsOfServiceAsPromise(s);},getHierarchicalProperty:function(s,e){var c=this;return c.oConfigurationEditor.getHierarchicalPropertiesOfEntitySetAsPromise(s,e);},getHierarchyNodeIdAsPromise:function(s,e,h){var c=this;return c.oConfigurationEditor.getHierarchyNodeIdAsPromise(s,e,h);},getSelectedHierarchicalProperty:function(){var c=this;return c.oParentObject.getHierarchyProperty();},getAllEntitySetPropertiesAsPromise:function(s,e){var c=this;return c.oConfigurationEditor.getNonHierarchicalPropertiesOfEntitySet(s,e);},resetEntityAndProperties:function(){var c=this;c.clearEntity();c.byId("idEntity").setModel(null);c.byId("idEntity").setSelectedKey(undefined);c.clearHierarchicalProperty();c.byId("idOptionalProperty").setModel(null);c.byId("idOptionalProperty").setSelectedKey(undefined);c.clearSelectProperties();c.byId("idSelectProperties").setModel(null);c.byId("idSelectProperties").setSelectedKeys([]);},clearHierarchicalProperty:function(){var c=this;c.oParentObject.setHierarchyProperty(undefined);},updateHierarchicalProperty:function(h){var c=this;c.clearHierarchicalProperty();c.oParentObject.setHierarchyProperty(h);}});});
