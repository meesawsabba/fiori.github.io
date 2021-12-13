/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)

		(c) Copyright 2009-2015 SAP SE. All rights reserved
	
 */
sap.ui.define(["sap/ui/rta/command/FlexCommand","sap/ui/fl/FlexControllerFactory","sap/ui/core/util/reflection/JsControlTreeModifier","sap/ui/fl/Utils","sap/base/util/merge","sap/base/util/extend","sap/suite/ui/generic/template/genericUtilities/FeError"],function(F,a,J,f,m,e,b){"use strict";var c="changeHandler.util.ChangeHandlerUtils";var A=F.extend("sap.suite.ui.generic.template.changeHandler.util.AnnotationPropertyCommand",{metadata:{library:"sap.suite.ui.generic.template",properties:{propertyName:{type:"string"},newValue:{type:"any"},semanticMeaning:{type:"string"},changeType:{type:"string",defaultValue:"propertyChange"}},associations:{},events:{}}});A.prototype._getChangeSpecificData=function(){var E=this.getElement();return{changeType:this.getChangeType(),selector:{id:this.getElementId(),type:E.getMetadata().getName()},content:{property:this.getPropertyName(),newValue:this.getNewValue(),semantic:this.getSemanticMeaning()}};};A.getSelector=function(C,o,d){var s=C;if(typeof s!=="string"){s=(C)?this.getId(C):undefined;}else if(!o){throw new b(c,"App Component instance needed to get a selector from string ID");}if(d&&(d.id||d.idIsLocal)){throw new b(c,"A selector of control with the ID '"+s+"' was requested, "+"but core properties were overwritten by the additionally passed information.");}var S=e({},d,{id:"",idIsLocal:false});S.id=s;return S;};A.createChange=function(C,o){var d,g;if(!o){throw new b(c,"A flexibility change cannot be created without a targeted control.");}var s=o.id||o.getId();if(!C.selector){C.selector={};}var h=o.appComponent||f.getAppComponentForControl(o);if(!h){throw new b(c,"No Application Component found - to offer flexibility the control with the id '"+s+"' has to have a valid relation to its owning application component.");}e(C.selector,A.getSelector(s,h));var i=a.createForControl(h);d=i.createBaseChange(C,h);var j=o.controlType||f.getControlType(o);if(!j){throw new b(c,"No control type found - the change handler can not be retrieved.");}g=i._getChangeHandler(d,j,o,J);if(g){g.completeChangeContent(d,C,{modifier:J,appComponent:h});}else{throw new b(c,"Change handler could not be retrieved for change "+JSON.stringify(C)+".");}return d;};A.prototype._createChangeFromData=function(C,d,v){if(d){C=m({},C,d);}C.jsOnly=this.getJsOnly();var M=this.getAppComponent().getModel("$FlexVariants");var V;if(M&&v){V=M.getCurrentVariantReference(v);}var g={"variantManagementReference":v,"variantReference":V};if(V){C=e({},C,g);}var o=A.createChange(C,this._validateControlForChange(d));if(d&&d.originalSelector){o.getDefinition().selector=A.getSelector(this.getSelector().id,this.getSelector().appComponent);o.setContent(e({},o.getContent(),d.content));}return o;};return A;},true);
