sap.ui.define(["sap/ui/base/Object","sap/m/MessagePopover","sap/m/MessagePopoverItem","sap/ui/model/Filter","sap/ui/model/FilterOperator","sap/suite/ui/generic/template/lib/MessageUtils","sap/suite/ui/generic/template/genericUtilities/testableHelper",'sap/ui/core/Element',"sap/base/util/extend"],function(B,M,a,F,b,c,t,E,e){"use strict";F=t.observableConstructor(F,true);var p=new F({path:"persistent",operator:b.EQ,value1:false});var s=new F({path:"technical",operator:b.EQ,value1:false});var v=new F({path:"validation",operator:b.EQ,value1:true});var I=new F({filters:[v,new F({path:"validation",operator:b.EQ,value1:false})],and:true});function g(T,h,d){var C=h.controller;var u=C.getOwnerComponent().getModel("ui");var m=C.byId("showMessages");var f=T.oComponentUtils.isDraftEnabled();var A=false;var o;var j;function k(i){return!!(i&&T.oCommonUtils.getPositionableControlId(i));}function l(i,Y){return h.getGroupTitle?h.getGroupTitle(i,Y):"";}var n;var q=T.oCommonUtils.getDialogFragment("sap.suite.ui.generic.template.fragments.MessagePopover",{beforeOpen:function(){var Y=n.getCurrentContexts();if(h.prepareAllMessagesForNavigation){for(var i=0;i<Y.length;i++){var Z=Y[i].getObject();if(!k(Z.controlIds)){h.prepareAllMessagesForNavigation();return;}}}},isPositionable:k,getGroupTitle:l,titlePressed:function(i){c.navigateFromMessageTitleEvent(T.oCommonUtils,i,h.prepareForMessageNavigation);}});q.setModel(sap.ui.getCore().getMessageManager().getMessageModel(),"msg");n=q.getBinding("items");n.filter(I);var r;(function(){var Y=C.getOwnerComponent();r=new F({path:"target",operator:b.EQ,value1:"/"+Y.getEntitySet()});var Z=Y.getModel("_templPriv");Z.setProperty("/generic/messageCount",0);var $=T.oCommonUtils.getText("MESSAGE_BUTTON_TOOLTIP_P",0);Z.setProperty("/generic/messageButtonTooltip",$);if(h.messageSorter){n.sort(h.messageSorter);}n.attachChange(function(){var _=n.getLength();if(_>0){var a1=q.getItems();var b1=0;var c1,d1,e1;var f1={};for(var i=0;i<a1.length;i++){if(a1[i].getType()==="Error"){b1=b1+1;}else if(a1[i].getType()==="Warning"){c1=true;}else if(a1[i].getType()==="Success"){d1=true;}else{e1=true;}}if(b1>0){f1={messageSeverity:"Negative",icon:"sap-icon://message-error"};}else if(c1){f1={messageSeverity:"Critical",icon:"sap-icon://message-warning"};}else if(e1){f1={messageSeverity:"Neutral",icon:"sap-icon://message-information"};}else if(d1){f1={messageSeverity:"Success",icon:"sap-icon://message-success"};}Z.setProperty("/generic/messageBtnIcon",f1.icon);Z.setProperty("/generic/messageSeverity",f1.messageSeverity);}Z.setProperty("/generic/messageCount",_);Z.setProperty("/generic/errorMessageCount",b1>0?b1:undefined);$=T.oCommonUtils.getText(_===1?"MESSAGE_BUTTON_TOOLTIP_S":"MESSAGE_BUTTON_TOOLTIP_P",_);Z.setProperty("/generic/messageButtonTooltip",$);});})();var L=new F({filters:[v,new F({path:"controlIds",test:function(i){return!!T.oCommonUtils.getPositionableControlId(i);},caseSensitive:true})],and:true});var w=[];var x;var y=0;var N;var z;var D;function G(Y){if(Array.isArray(Y)){var Z=false;for(var i=0;i<Y.length;i++){Z=G(Y[i])||Z;}return Z;}if(Y instanceof Promise){Y.then(N);return false;}D.push(Y);return true;}function H(i){z=i;n.filter(z);}function J(){if(A){o=new F({filters:D,and:false});var i=[o,p];if(T.oServices.oApplication.needsToSuppressTechnicalStateMessages()){i.push(s);}j=new F({filters:i,and:true});H(new F({filters:[j,L],and:false}));}}function R(i,Y){if(i===y&&G(Y)){J();}}function K(i){var Y=i();return G(Y);}function O(){w.forEach(K);}function P(i){x=i;y++;N=R.bind(null,y);var Y=d&&!f&&u.getProperty("/createMode");D=d?[new F({path:Y?"target":"fullTarget",operator:b.StartsWith,value1:x}),r]:[];O();J();}function Q(i){w.push(i);if(x!==undefined&&K(i)){J();}}var S;function U(){S=S||function(){if(n.getLength()>0){q.navigateBack();q.openBy(m);}};setTimeout(S,0);}function V(i){A=i;if(i){if(D){J();}}else{D=null;H(I);}}function W(i){return i?L:z;}function X(i){return i?j:o;}return{adaptToContext:P,toggleMessagePopover:q.toggle.bind(q,m),showMessagePopover:U,registerMessageFilterProvider:Q,setEnabled:V,getMessageFilters:W,getContextFilter:X};}return B.extend("sap.suite.ui.generic.template.lib.MessageButtonHelper",{constructor:function(T,h,i){e(this,(t.testableStatic(g,"MessageButtonHelper"))(T,h,i));}});});
