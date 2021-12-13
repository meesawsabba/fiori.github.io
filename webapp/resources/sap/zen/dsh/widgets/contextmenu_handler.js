/*
 * SAPUI5
  (c) Copyright 2009-2021 SAP SE. All rights reserved
 */
sap.ui.define(["jquery.sap.global","sap/zen/commons/thirdparty/lodash","sap/zen/dsh/utils/BaseHandler"],function(q,_,B){"use strict";var C=function(){B.apply(this,arguments);var t=this;this.aAllowedSemanticSources=[];this.oMenuItemToDialogJsonMap={};this.create=function(a,b){var e=b["id"];var i=this.createButton(e);this.init(i,b);i.setVisible(false);return i;};this.update=function(a,b){if(!sap.zen.designmode&&b!==undefined){if(!b.entries){return null;}this.aAllowedSemanticSources=[];if(b.navigation){if(b.navigation.allowed_semantic_sources){var i=0;var L=b.navigation.allowed_semantic_sources.length;if(L&&L>0){for(i=0;i<L;i++){this.aAllowedSemanticSources.push(b.navigation.allowed_semantic_sources[i].entry.semanticname);}}}}this.oMenuItemToDialogJsonMap={};var e=b.entries;if(b.dialog===true&&e){var w=e[0].entry;l(w.dialog);}else{var x=d(b,e,"0");B.dispatcher.registerContextMenu(x);var y=sap.ui.core.Popup.Dock;if(x.getItems().length>0){var z=t.clientX;if(sap.ui.getCore().getConfiguration().getRTL()===true){z=q(window).width()-t.clientX;}x.open(false,a.getFocusDomRef(),y.BeginTop,y.BeginTop,window,""+z+" "+t.clientY);f(a,x,b.context,(b.navigation&&b.navigation.notifyfiorijumpcommand)||"");}}}return a;};this.init=function(a,b){if(!sap.zen.designmode){var e=q(document);e.unbind("contextmenu");e.bind("contextmenu",u.bind(this,b));e.bind("keypress",function(i){var w=(i.keyCode?i.keyCode:i.which);if(w=="13"&&i.target&&i.target.getBoundingClientRect){var R=i.target.getBoundingClientRect();u.apply(this,[b,{clientX:R.left,clientY:R.top}]);}});}};this.getType=function(){return"contextmenu";};function d(a,e,i){var b="menu"+i;var w=sap.ui.getCore().getControl(b);if(w){w.destroyItems();w.destroy();}var x=t.createMenu(b);var y,z,D;var E=false;if(e){for(var F=0;F<e.length;F++){z=e[F].entry;D=i+"-"+F;y="item"+D;if(z.key){y="CONTEXT_MENU_"+z.key;}var M=t.createMenuItem(y,{text:z.text});if(z.disabled){M.setEnabled(false);}if(z.checked){M.setIcon("sap-icon://accept");}if(z.onSelect){M.attachSelect(new Function(z.onSelect));}if(z.entries){var S=d(a,z.entries,D);M.setSubmenu(S);}if(z.dialog){t.oMenuItemToDialogJsonMap[y]=z.dialog;M.attachSelect(l.bind(t));}if(z.startsSection&&E){M.setStartsSection(true);}x.addItem(M);E=true;}}var G;if(a.cssclass&&a.cssclass!==""){G=a.cssclass;}if(G){x.addStyleClass(G);}return x;}function f(e,M,i,N){var w=[];if(sap.ushell&&sap.ushell.Container){sap.ushell.Container.getServiceAsync("CrossApplicationNavigation").then(function(x){var I=[];if(i.dimension&&i.dimension.length>0){w.push(i.dimension);if(q.inArray(w[0],t.aAllowedSemanticSources)===-1){return;}}else{w=t.aAllowedSemanticSources;}var P=h(i);var S=j(i,P);k(i.filter,P);k(i.variables,P);var y;if(S!==undefined&&sap.zen.dsh.sapbi_page&&sap.zen.dsh.sapbi_page.appComponent){var z=x.createEmptyAppState(sap.zen.dsh.sapbi_page.appComponent);var D={"selectionVariant":S};z.setData(D);z.save();y=z.getKey();}var E=function(a){if(N&&N.length>0){N=N.replace("__HASH__",a);var b=new Function(N);b();return true;}return false;};var G=[];w.forEach(function(a){G.push([{semanticObject:a,params:P,ignoreFormFactor:false,ui5Component:sap.zen.dsh.sapbi_page.appComponent,appStateKey:y,compactIntents:false}]);});var F=x.hrefForAppSpecificHash("");if(F){var H=F.indexOf("?");F=F.substring(0,H>0?H:F.length-2);}x.getLinks(G).done(function(J){J.forEach(function(a){a[0].forEach(function(b){if(b.text&&b.intent&&b.intent!==F&&b.intent.indexOf(F+"?")!==0){I.push(b);}});});I.sort(function(a,b){return a.text.localeCompare(b.text);});if(I&&I.length>0){var K=M.getId()+"_JUMP_SUB";var O=sap.ui.getCore().getControl(K);if(O){O.destroyItems();O.destroy();}var L=null;var Q;var R=function(){if(sap.ushell&&sap.ushell.Container){sap.ushell.Container.getServiceAsync("CrossApplicationNavigation").then(function(x){if(!E(this.dsh_shellHash)){x.toExternal({target:{shellHash:t.dsh_shellHash}});}}.bind(this));}};for(Q=0;Q<I.length;++Q){var T;var U=I[Q];if(!M.bOpen){return null;}var V=e.getId()+"_FIORINAV_"+Q;var W=sap.ui.getCore().getControl(V);if(!W){W=t.createMenuItem(V,{text:U.text});}else{W.setText(U.text);}W.dsh_shellHash=U.intent;W.attachSelect(R.bind(W));if(!L){L=sap.ui.getCore().getControl(K);if(!L){L=t.createMenu(K);}}L.addItem(W);}if(L!==null&&M.bOpen===true){var X=e.getId()+"_"+i.menuitemid;T=t.createMenuItem(X,{text:i.text});T.setSubmenu(L);M.addItem(T);}}});}.bind(t));}}var A=function(S,a){var N;if(S){var L=S.length;if(L>0){for(var i=0;i<L;i++){N=S[i].dimension.name;if(N&&N.length>0&&!Object.prototype.hasOwnProperty.call(a,N)){if(S[i].dimension.selection){a[N]=[{"Sign":"I","Option":"EQ","Low":S[i].dimension.selection,"High":null}];}else if(S[i].dimension.selections&&S[i].dimension.selections.length>0){a[N]=S[i].dimension.selections.map(function(b){if(b.LowType!=="DATE"){return b;}var e={};for(var w in b){if(Object.prototype.hasOwnProperty.call(b,w)){e[w]=(w==="Low"||w==="High")&&b[w]?b[w]+"T00:00:00.000Z":b[w];}}return e;});}}}}}};var g=function(a,b){var S={};var e=[];b=b||{};for(var P in b){if(Object.prototype.hasOwnProperty.call(b,P)){S[P]=[{"Sign":"I","Option":"EQ","Low":b[P],"High":null}];}}A(a.filter,S);A(a.variables,S);for(var i in S){if(Object.prototype.hasOwnProperty.call(S,i)){e.push({"PropertyName":i,"Ranges":S[i]});}}if(e.length>0){return e;}};var h=function(a){if(!a){return;}var P={};if(a.member&&a.member.length>0){P[a.dimension]=a.member==="#"?"":a.member;if(a.memberType==="DATE"){P[a.dimension]=P[a.dimension]+"T00:00:00.000Z";}}var T,i,N;var b=a.tuple_elements;if(b){var L=b.length;for(i=0;i<L;i++){T=b[i].tuple_element;if(T.member&&T.member.length>0){N=T.dimension;if(!P[N]){P[N]=T.member==="#"?"":T.member;if(T.memberType==="DATE"){P[N]=P[N]+"T00:00:00.000Z";}}}}}return P;};var j=function(a,b){if(!a){return;}var S={};var e=g(a,b);if(e!==undefined){S.SelectOptions=e;S.SelectionVariantID=new Date().toISOString();S.Text="Temporary Variant "+S.SelectionVariantID;return S;}};var k=function(a,P){var N,S,b;if(a&&P){var L=a.length;if(L>0){for(var i=0;i<L;i++){N=a[i].dimension.name;if(N&&N.length>0){if(!P[N]){S=a[i].dimension.selection;if(S&&S.length>0){P[N]=S;}else{b=a[i].dimension.selections;if(b&&b.length===1){if(b[0].Sign&&b[0].Sign==="I"&&b[0].Option&&b[0].Option==="EQ"){P[N]=b[0].Low==="#"?"":b[0].Low;if(b[0].LowType==="DATE"){P[N]=P[N]+"T00:00:00.000Z";}}}}}}}}}};function l(e){var a;if(e.sId){var b=e.getParameters().id;a=t.oMenuItemToDialogJsonMap[b];}else{a=e;}t.oDialogResult={};t.oDialogResult["dlgtype"]=a.dlgtype;t.aDlgControls=[];var w=t.createDialog(b+"_"+a.dlgtype,{"modal":true});w.setResizable(false);w.setTitle(a.title);w.attachClosed(function(){w.destroyContent();w.destroy();t.aDlgControls=[];t.oDialogResult={};});m(w,a);var x=new sap.ui.layout.VerticalLayout(b+"_vlayout");w.addContent(x);var y=null;var z=0;if(a.elements){z=a.elements.length;}if(z<=1){y=n(w,a).bind(t);}for(var i=0;i<z;i++){var D=a.elements[i].element;o(D,x,y);}w.open();}function m(D,J){var a=t.createButton(D.getId()+"OK_BTN");a.setText(J.okbtntext);a.attachPress(n(D,J).bind(t));var b=t.createButton(D.getId()+"CANCEL_BTN");b.setText(J.cancelbtntext);b.attachPress(function(){D.close();});D.addButton(a);D.addButton(b);}function n(D,J){return function(){var a=t.aDlgControls.length;for(var i=0;i<a;i++){var b=t.aDlgControls[i];if(b){var e=b.control;b.fOkHandler(e);}}var w=JSON.stringify(t.oDialogResult);var x="\"";var y=new RegExp(x,"g");w=w.replace(y,"\\\"");D.close();var z=J.submitdialogcommand.replace("__JSON__",w);var E=new Function(z);E();};}function o(E,V,O){var a=E.type;var b;var w=null;var x=null;if(a==="dropdown"){if(E.text){b=t.createLabel(E.id+"_label");b.setText(E.text);b.setWidth("200px");V.addContent(b);}w=t.createDropdownBox(E.id);w.setWidth(E.id==="dd_hierarchy"?"400px":"200px");if(E.entries){var y;var z=E.entries.length;for(var i=0;i<z;i++){var D=E.entries[i].entry;var F=new sap.ui.core.ListItem();F.setKey(D.id);F.setText(D.text);if(D.selected){if(D.selected===true){if(B.dispatcher.isMainMode()){y=F;}else{y=D.text;}}}w.addItem(F);}}if(y){if(B.dispatcher.isMainMode()){w.setSelectedItem(y);}else{w.setValue(y);}}w.attachChange(function(){var e=w.getSelectedKey();if(e!=="multiple"){var G=w.getItems()[0];if(G.getKey()==="multiple"){w.removeItem(G);}}});V.addContent(w);x=p;}else if(a==="checkbox"){w=t.createCheckBox(E.id);w.setText(E.text);if(E.checked){w.setChecked(E.checked===true);}else{w.setChecked(false);}V.addContent(w);x=r;}else if(a==="input"){if(E.text){b=t.createLabel(E.id+"_label");b.setText(E.text);b.setWidth("200px");V.addContent(b);}w=t.createTextField(E.id);if(O&&w.attachSubmit){w.attachSubmit(O);}else if(O&&w.onsapenter){w.addEventDelegate({onsapenter:O});}w.setValue(E.value);V.addContent(w);x=s;}else if(a==="numeric_input"){if(E.text){b=t.createLabel(E.id+"_label");b.setText(E.text);b.setWidth("200px");V.addContent(b);}w=t.createTextField(E.id);w.attachBrowserEvent("keypress",function(e){var G=[48,49,50,51,52,53,54,55,56,57,0,8];if(!(q.inArray(e.which,G)>=0)){e.preventDefault();}});w.setValue(E.value);w.setWidth("100px");V.addContent(w);x=s;}if(w){t.aDlgControls.push({control:w,fOkHandler:x.bind(t)});}}function p(D){t.oDialogResult[D.getId()]=D.getSelectedKey();}function r(a){t.oDialogResult[a.getId()]=""+a.getChecked();}function s(i){t.oDialogResult[i.getId()]=""+i.getValue();}function u(a,e){if(!e.ctrlKey){B.dispatcher.cancelDragDropOperation();t.clientX=e.clientX;t.clientY=e.clientY;var b=v(e.clientX,e.clientY);var w;var x;if(q.browser.msie&&document.msElementsFromPoint!==undefined){var y=document.msElementsFromPoint(e.clientX,e.clientY);for(var i=0;i<y.length;i++){var z=q(y[i]);var D=B.dispatcher.getControlForId(z.attr("id"));if(D){x=sap.ui.getCore().byId(D.getId());break;}}}else{w=b.closest(".zenControl");x=sap.ui.getCore().byId(w.attr("id"));}if(x){var E=B.dispatcher.getHandlers(x.zenControlType);if(E&&E[0]){var F=E[0];var G=F.getContextMenuAction(a.contextmenuid,x,b);if(!G){}else{if(e){if(e.preventDefault){e.preventDefault();}if(e.stopPropagation){e.stopPropagation();}if(e.cancelBubble){e.cancelBubble=true;}}G();}}}}}function v(a,b){var e=q(window.document.elementFromPoint(a,b));var w=e.closest(".zenControl");var x=w.attr("id");var y=B.dispatcher.getControlForId(x);var z=[];if(y&&y.zenControlType==="xtable"){x=e.attr("id");while(x&&x.indexOf("droparea")>-1){z.push(e);e.css("display","none");e=q(window.document.elementFromPoint(a,b));x=e.attr("id");}for(var i=0;i<z.length;i++){z[i].css("display","block");}}return e;}};var c=new C();B.dispatcher.addHandlers(c.getType(),c);return c;});
