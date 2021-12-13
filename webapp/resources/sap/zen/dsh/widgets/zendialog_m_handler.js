/*
 * SAPUI5
  (c) Copyright 2009-2021 SAP SE. All rights reserved
 */
sap.ui.define(["jquery.sap.global","sap/zen/commons/thirdparty/lodash","sap/zen/dsh/utils/BaseHandler","sap/m/Dialog","sap/zen/commons/layout/MatrixLayout","sap/zen/commons/HAlign"],function(q,_,B,D,M,H){"use strict";sap.zen.ZenDialogHandler=function(){sap.zen.ZenDialogHandler.anchorDivId="sapbi_snippet_ROOT_DIALOG";B.apply(this,arguments);this.dispatcher=B.dispatcher;var t=this;this.oTopLevelControl=null;this.loadingIndicatorCssHasBeenSet=false;this.iVertPaddingAndBorderContribution=-1;this.bIsRuntimeMode=false;this.bBrowserResize=false;this.resizeTimer=null;this.resizeEndTimer=null;this.initialWindowHeight=0;this.initialWindowWidth=0;this.contentTdHeight=0;this.contentHeight=0;this.oDomContentArea=null;this.oDomContentDiv=null;this.bDialogClosing=false;this.createAndAdd=function(C,o,d,A,e){this.dispatcher.enableReady(false);this.bIsRuntimeMode=o.renderruntimeinitvarscreen;this.bBrowserResize=o.hookbrowserresize;this.iVertPaddingAndBorderContribution=-1;this.oTopLevelControl={};var l=this.validateDialogContent(this.oTopLevelControl,o,d);this.oTopLevelControl=null;if(!l){return null;}var f=null;if(this.bIsRuntimeMode===true){this.oTopLevelControl=new sap.m.Button(o["id"],{enabled:false});var h=this.oTopLevelControl.destroy;this.oTopLevelControl.destroy=function(){if(B.dispatcher.oCurrentVarDlg){B.dispatcher.oCurrentVarDlg.destroy();delete B.dispatcher.oCurrentVarDlg;}h.apply(this,arguments);};this.oTopLevelControl.aZenChildren=[];this.oTopLevelControl.aZenChildren.push(B.dispatcher.oCurrentVarDlg);if(typeof(sap.zen.dsh.DSH_deployment)!=="undefined"&&sap.zen.dsh.DSH_deployment===true){A(this.oTopLevelControl,e);}}else{this.oTopLevelControl=this.createMatrixLayout(o,d);f=this.oTopLevelControl;this.oTopLevelControl.aZenChildren=[];A(this.oTopLevelControl,d);}this.oTopLevelControl.oDialogProperties={oComponentProperties:null,oControlProperties:null,oMatrixLayout:f,oMsgComponent:null,oMsgControl:null,tContentComponents:[],oContentComponent:null,oContentControl:null};this.init(this.oTopLevelControl,o,d,true);this.hookBrowserResize();if(this.bIsRuntimeMode===true){this.openDialog();}return this.oTopLevelControl;};this.update=function(C,o,d){if(o){if(o.closeDialogCommand&&o.closeDialogCommand.length>0){sap.zen.ZenDialogHandler.closeDialog();setTimeout(function(){var l=new Function(o.closeDialogCommand);l();},0);}else{if(this.validateDialogContent(C,o,d)){this.init(C,o,d,false);}else{}}}};this.init=function(C,o,d,i){if(o.loadingIndicatorDelay){sap.zen.loadingIndicatorDelay=o.loadingIndicatorDelay;}if(!this.loadingIndicatorCssHasBeenSet){b();}this.extractDialogProperties(C,o,d,i);this.initDialog(C);};this.validateDialogContent=function(C,o,d){this.extractDialogProperties(C,o,d,false);if(o){if(!o.content||o.content.length>2){return false;}if(!C.oDialogProperties.oMsgComponent){if(!C.oDialogProperties.oContentComponent||(C.oDialogProperties.oContentComponent&&o.content.length>1)){return false;}}else{if(!C.oDialogProperties.oContentComponent&&o.content.length>1){return false;}}}else{return false;}return true;};this.extractDialogProperties=function(C,o,d,e){if(!C.oDialogProperties){C.oDialogProperties={oComponentProperties:null,oControlProperties:null,oMatrixLayout:null,oMsgComponent:null,oMsgControl:null,tContentComponents:[],oContentComponent:null,oContentControl:null};}C.oDialogProperties.oComponentProperties=d;C.oDialogProperties.oControlProperties=o;if(e){C.oDialogProperties.oMsgComponent=null;C.oDialogProperties.oMsgControl=null;C.oDialogProperties.tContentComponents=[];C.oDialogProperties.oContentComponent=null;C.oDialogProperties.oContentControl=null;}var l=null;var f=[];if(o.content&&o.content.length>0){for(var i=0;i<o.content.length;i++){var h=o.content[i];if(h&&h.component){if(h.component.type==="MESSAGEVIEW_COMPONENT"&&!l){l=h.component;}else{f.push(h.component);}}}}if(f&&f.length>0){C.oDialogProperties.tContentComponents=f;C.oDialogProperties.oContentComponent=C.oDialogProperties.tContentComponents[0];}if(C.oDialogProperties.oContentComponent){if(C.oDialogProperties.oContentComponent.content&&C.oDialogProperties.oContentComponent.content.control){C.oDialogProperties.oContentControl=this.dispatcher.getControlForId(C.oDialogProperties.oContentComponent.content.control.id);}}if(l){if(l.content&&l.content.control){C.oDialogProperties.oMsgComponent=l;C.oDialogProperties.oMsgControl=this.dispatcher.getControlForId(C.oDialogProperties.oMsgComponent.content.control.id);}}};this.initDialog=function(C){if(!C||!C.oDialogProperties||!C.oDialogProperties.oControlProperties){return;}if(!C.oDialog){C.oDialog=new D(C.getId()+"_dlg",{"title":C.oDialogProperties.oControlProperties.title?C.oDialogProperties.oControlProperties.title:C.oDialogProperties.oControlProperties.titletext,"showHeader":C.oDialogProperties.oControlProperties.displaytitle,"resizable":C.oDialogProperties.oControlProperties.canresize,"draggable":C.oDialogProperties.oControlProperties.canmove,"horizontalScrolling":false,"verticalScrolling":false,"contentHeight":"100%","contentWidth":Math.floor(window.innerWidth/2)+"px","afterOpen":function(){var l=this.$().find(".sapMDialogScroll");l.css("overflow-x","auto");var d;if(q.browser.mozilla){d=q(document.getElementById(C.oDialogProperties.oContentControl.getId()));d.css("display","inline-table");}else if(q.browser.webkit){d=q(document.getElementById(C.oDialogProperties.oContentControl.getId()));var e=d.parent();e.css("height","100%");}}});C.oDialog.addStyleClass("sapContrastPlus");C.oDialog.attachBrowserEvent("keydown",function(e){if(e.which===27){if(e.stopPropagation){e.stopPropagation();}if(e.cancelBubble){e.cancelBubble=true;}}});B.dispatcher.oCurrentVarDlg=C.oDialog;if(this.bIsRuntimeMode===true){B.dispatcher.oCurrentVarDlg.oDispatcherHook=this.oTopLevelControl;}}if(C.oDialog){if(C.oDialogProperties.oControlProperties.title){C.oDialog.setTitle(C.oDialogProperties.oControlProperties.title);}this.initDialogContent(C);this.initDialogButtons(C);this.initDialogMessage(C);}};this.initDialogContent=function(C){if(!C||!C.oDialog||!C.oDialogProperties){return;}if(C.oDialogProperties.oMatrixLayout){if(C.oDialogProperties.oContentComponent){var l=this.createMatrixLayoutContentArea();C.oDialogProperties.oMatrixLayout.addRow(l);}}var d=false;if(C.oDialogProperties.oMatrixLayout){if(C.oDialogProperties.oContentComponent){d=this.dispatcher.getComponentIdForControlId(C.oDialogProperties.oContentComponent.content.control.id)==null;}}else{if(C.oDialog){d=!C.oDialog.isOpen();}else{d=true;}}if(C.oDialogProperties.oContentComponent){if(d){C.oDialogProperties.oContentControl=this.dispatcher.dispatchCreateControl(C.oDialogProperties.oContentComponent);if(C.oDialogProperties.oContentComponent.id){this.oTopLevelControl.aZenChildren.push(C.oDialogProperties.oContentComponent.id);}C.oDialogProperties.oContentControl.setWidth("100%");C.oDialogProperties.oContentControl.setHeight("100%");if(C.oDialogProperties.oMatrixLayout){var e=this.getMatrixLayoutCell(C.oDialogProperties.oMatrixLayout,0,0);e.addContent(C.oDialogProperties.oContentControl);}this.dispatcher.updateComponentProperties(undefined,C.oDialogProperties.oContentComponent);}else{C.oDialogProperties.oContentControl=this.dispatcher.getControlForId(C.oDialogProperties.oContentComponent.content.control.id);this.dispatcher.dispatchUpdateControl(C.oDialogProperties.oContentComponent);this.dispatcher.updateComponentProperties(null,C.oDialogProperties.oContentComponent);}}var f=C.oDialogProperties.oMatrixLayout?C.oDialogProperties.oMatrixLayout:C.oDialogProperties.oContentControl;f.onAfterRendering=this.dialogCallbackOnAfterRendering(f,C);if(!C.oDialog.isOpen()){C.oDialog.addContent(f);}};this.initDialogButtons=function(C){if(!C||!C.oDialog||!C.oDialogProperties||!C.oDialogProperties.oControlProperties){return;}if(C.oDialogProperties.oMatrixLayout){var l=this.createMatrixLayoutButtonArea();C.oDialogProperties.oMatrixLayout.addRow(l);}var d=function(){if(this.zenOkBtn===true){B.dispatcher.enableReady(true);}if(this.zenOkBtn===true||this.zenCancelBtn===true){sap.zen.MessageViewHandler.setVariableScreen(false);}t.bDialogClosing=true;this.setEnabled(false);this.zenOnClick();};if(C.oDialogProperties.oControlProperties.buttons&&C.oDialogProperties.oControlProperties.buttons.length){var e=false;if(C.oDialogProperties.oMatrixLayout){if(C.oDialogProperties.oContentComponent){e=this.dispatcher.getComponentIdForControlId(C.oDialogProperties.oContentComponent.content.control.id)==null;}}else{if(C.oDialog){e=!C.oDialog.isOpen();}else{e=true;}}if(e){C.oDialog.removeAllButtons();}for(var i in C.oDialogProperties.oControlProperties.buttons){var f=C.oDialogProperties.oControlProperties.buttons[i].button;var h;if(f.rendered===true){if(e){h=this.createButton(f.name);h.setText(f.text);h.setEnabled(f.enabled);h.zenOkBtn=f.okBtn;h.zenCancelBtn=f.cancelBtn;if(f.okBtn===true){h.addStyleClass("zenDialogOkButton");}if(f.cancelBtn===true){h.addStyleClass("zenDialogCancelButton");}if(f.command){h.zenOnClick=new Function(f.command);h.attachPress(d);}else{h.setEnabled(false);}}else{h=sap.ui.getCore().getControl(f.name);var j=f.enabled;if(f.okBtn){j=j&&!C.oDialogProperties.oContentControl.hasClientError;}if(f.rendered===true){if(h){h.setEnabled(j);h.setVisible(true);}}else{if(h){h.setVisible(false);}}}}if(e&&h){C.oDialog.addButton(h);}if(f.statustodesigner===true){if(f.command){window.eclipse_setOkButtonEnabled(f.enabled);}else{window.eclipse_setOkButtonEnabled(false);}}}}};this.initDialogMessage=function(C){if(!C||!C.oDialogProperties){return;}if(C.oDialogProperties.oMsgComponent){var l=this.dispatcher.getComponentIdForControlId(C.oDialogProperties.oMsgComponent.content.control.id)==null;if(l){if(C.oDialogProperties.oMsgComponent.id){this.oTopLevelControl.aZenChildren.push(C.oDialogProperties.oMsgComponent.id);}sap.zen.MessageViewHandler.setVariableScreen(true);C.oDialogProperties.oMsgControl=this.dispatcher.dispatchCreateControl(C.oDialogProperties.oMsgComponent);if(C.oDialogProperties.oMatrixLayout){var d=this.getMatrixLayoutCell(C.oDialogProperties.oMatrixLayout,1,0);d.addContent(C.oDialogProperties.oMsgControl);}}else{C.oDialogProperties.oMsgControl=this.dispatcher.getControlForId(C.oDialogProperties.oMsgComponent.content.control.id);this.dispatcher.dispatchUpdateControl(C.oDialogProperties.oMsgComponent);this.dispatcher.updateComponentProperties(C.oDialogProperties.oMsgControl,C.oDialogProperties.oMsgComponent);}}};this.initDialogFooter=function(C){if(!C||!C.oDialog||!C.oDialogProperties.oMsgControl){return;}var l=this.getDialogFooter(C.oDialog);if(!l){return;}var d=[];d.push(C.oDialogProperties.oMsgControl);var e=l.getContent();if(e){for(var i=0;i<e.length;i++){var f=e[i];if(f&&f!==C.oDialogProperties.oMsgControl){d.push(f);}}}l.removeAllContent();for(i=0;i<d.length;i++){f=d[i];if(f){l.addContent(f);}}};this.getDialogFooter=function(d){var l=sap.ui.getCore().byId(d.getId()+"-footer");return l;};this.openDialog=function(){var l=B.dispatcher.oCurrentVarDlg;if(l){l.open();}};this.dialogCallbackOnAfterRendering=function(o,C){o.fOrigOnAfterRendering=o.onAfterRendering;var t=this;return function(){if(this.fOrigOnAfterRendering){this.fOrigOnAfterRendering();}t.initDialogFooter(C);};};function b(){var l="loading.gif?1.0.0";if(sap.zen.dsh.sapbi_isMobile){l="loadingMobile.gif";}var d="margin:-20px 0px 0px -100px; background-position:center;background-repeat:no-repeat;height:40px;width:200px;"+"background-image:url("+sap.zen.createStaticMimeUrl("zen.rt.client.servlet/resources/images/"+l)+");z-index:19994;position:absolute;top:50%;left:50%;";q("head").prepend("<style>.customLoadingIndicatorZenClass{"+d+"}</style>");t.loadingIndicatorCssHasBeenSet=true;}this.createMatrixLayout=function(C){var l=new M(C["id"],{"layoutFixed":false,"height":"100%","width":"100%"});l.addStyleClass("zenDialogMatrixLayout");l.fOrigOnAfterRendering=l.onAfterRendering;var t=this;l.onAfterRendering=function(){if(this.fOrigOnAfterRendering){this.fOrigOnAfterRendering();}t.calculateAndSetMatrixLayoutDialogDivSizes();t.setMatrixLayoutInitialSizes();if(t.bIsRuntimeMode){t.addMsgControlToMatrixLayoutAndReorderDialogButtons();}};if(C.onepageprompt){l.addStyleClass("zenDialogOnePage");}if(C.toplevelcssclass.length>0){l.addStyleClass(C.toplevelcssclass);}this.initMatrixLayoutRootArea();return l;};this.createMatrixLayoutContentArea=function(){var l=new sap.zen.commons.layout.MatrixLayoutCell();l.addStyleClass("zenDialogContentArea");var d=new sap.zen.commons.layout.MatrixLayoutRow();d.addStyleClass("zenDialogContentRow");d.addCell(l);return d;};this.createMatrixLayoutButtonArea=function(){var l=new sap.zen.commons.layout.MatrixLayoutCell({"hAlign":H.Begin});l.addStyleClass("zenDialogButtonArea");var d=new sap.zen.commons.layout.MatrixLayoutRow();d.addStyleClass("zenDialogButtonRow");d.addCell(l);return d;};this.getMatrixLayoutCell=function(m,r,d){var l=m.getRows()[r];var e=l.getCells()[d];return e;};this.initMatrixLayoutRootArea=function(){var l=q(document.getElementById(sap.zen.ZenDialogHandler.anchorDivId));if(!l.length){l=q("<div id=\""+sap.zen.ZenDialogHandler.anchorDivId+"\"></div>");q("body").append(l);}return l;};this.calculateAndSetMatrixLayoutDialogDivSizes=function(){this.oDomContentArea=q(".zenDialogContentArea");this.oDomContentDiv=this.oDomContentArea.children(0);if(!this.bIsRuntimeMode){var l=this.initMatrixLayoutRootArea();var d=parseInt(l.css("height"),10);var e=c();var f=d-e;var h=f-this.getMatrixLayoutVertPaddingAndBorderContribution(this.oDomContentArea);this.oDomContentDiv.css("height",h+"px");}else{q(document.getElementById(this.oTopLevelControl.oMatrixLayout.getId())).parent().css("padding","0px").css("height","100%");this.oDomContentDiv.css("height","100%");}};function c(){var l=g(".zenDialogTitleRow");l+=g(".zenDialogButtonRow");l+=g(".zenDialogResizeRow");return l;}function g(C){var l=0;var d=q(C);if(d&&d.length>0){l=d.outerHeight();}return l;}this.getMatrixLayoutVertPaddingAndBorderContribution=function(j){var l=0;var d;var v;if(this.iVertPaddingAndBorderContribution===-1){d=parseInt(j.css("padding-top"),10);l+=(isNaN(v)?0:d);d=parseInt(j.css("padding-bottom"),10);l+=(isNaN(v)?0:d);d=parseInt(j.css("border-top"),10);l+=(isNaN(v)?0:d);d=parseInt(j.css("border-bottom"),10);l+=(isNaN(v)?0:d);this.iVertPaddingAndBorderContribution=l;}return this.iVertPaddingAndBorderContribution;};this.setMatrixLayoutInitialSizes=function(){if(this.bBrowserResize){this.initialWindowHeight=parseInt(q(window).innerHeight(),10);this.initialWindowWidth=parseInt(q(window).innerWidth(),10);this.contentTdHeight=parseInt(this.oDomContentArea.css("height"),10)-1;this.contentHeight=parseInt(this.oDomContentDiv.css("height"),10)-1;}};this.addMsgControlToMatrixLayoutAndReorderDialogButtons=function(){var l=B.dispatcher.oCurrentVarDlg;if(l&&this.oTopLevelControl.oDialogProperties.oMsgControl){var d=this.getDialogFooter(l);if(d){var e=d.getContent();if(e&&e.length>0){var f=[];f.push(this.oTopLevelControl.oDialogProperties.oMsgControl);f.push(e[0]);for(var i=1;i<e.length;i++){if(e[i]!==this.oTopLevelControl.oDialogProperties.oMsgControl){f.push(e[i]);}}d.removeAllContent();for(i=0;i<f.length;i++){d.addContent(f[i]);}}}}};this.hookBrowserResize=function(){if(this.bBrowserResize===true){var t=this;q(window).resize(function(){clearTimeout(t.resizeTimer);t.resizeTimer=setTimeout((function(t){return function(){t.browserResizeListener();};})(t),50);});}};this.browserResizeListener=function(){clearTimeout(this.resizeEndTimer);var n=parseInt(q(window).innerHeight(),10);var d=n-this.initialWindowHeight;var e=parseInt(q(window).innerWidth(),10);var f=e-this.initialWindowWidth;if(d!==0){this.contentTdHeight+=d;this.contentHeight+=d;this.initialWindowHeight=n;this.oDomContentArea.css("height",this.contentTdHeight+"px");this.oDomContentDiv.css("height",this.contentHeight+"px");}if(f!==0){this.initialWindowWidth=e;}if(this.oTopLevelControl.oDialogProperties.oContentControl.ZEN_resize){this.oTopLevelControl.oDialogProperties.oContentControl.ZEN_resize();}this.resizeEndTimer=setTimeout((function(t,f,d){return function(){t.browserResizeEndEvent(f,d);};})(this,f,d),100);};this.browserResizeEndEvent=function(d,e){if(this.oTopLevelControl.oDialogProperties.oContentControl.ZEN_resizeEnd){this.oTopLevelControl.oDialogProperties.oContentControl.ZEN_resizeEnd(d,e);}};this.applyForChildren=function(C,f){if(C.aZenChildren){for(var i=0;i<C.aZenChildren.length;i++){var l=C.aZenChildren[i];var d=this.dispatcher.getRootControlForComponentId(l);if(d){var e=f(d);if(e){return e;}}}}return null;};this.getType=function(){return"zendialog";};};sap.zen.ZenDialogHandler.closeDialog=function(){var l=B.dispatcher.oCurrentVarDlg;if(l){var b=l.oDispatcherHook;B.dispatcher.dispatchRemove(b);}};var a=new sap.zen.ZenDialogHandler();B.dispatcher.addHandlers(a.getType(),a);return a;});
