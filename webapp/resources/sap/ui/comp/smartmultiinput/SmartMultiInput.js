/*
 * ! SAPUI5
 * (c) Copyright 2009-2021 SAP SE. All rights reserved.
 */
sap.ui.define(["sap/ui/core/Core","sap/m/library","sap/m/List","sap/m/Popover","sap/m/StandardListItem",'sap/m/MultiInput','sap/m/MultiComboBox','sap/m/Token','sap/m/Tokenizer','sap/ui/comp/smartfield/SmartField','sap/ui/comp/odata/MetadataAnalyser',"sap/ui/model/ParseException","sap/ui/model/ValidateException",'sap/ui/model/BindingMode','sap/ui/comp/odata/ODataType','sap/ui/comp/providers/ValueHelpProvider',"sap/ui/comp/util/FormatUtil","sap/ui/core/format/DateFormat","sap/ui/comp/smartfilterbar/FilterProvider","sap/base/Log","sap/base/util/deepEqual","sap/ui/comp/library","sap/ui/core/library","sap/ui/core/ResizeHandler","sap/m/Link","sap/m/Text","sap/m/FlexBox","sap/m/HBox","sap/base/util/isEmptyObject"],function(C,M,L,P,S,a,b,T,c,d,e,f,V,B,O,g,F,D,h,j,k,l,m,R,n,o,p,H,q){"use strict";var r=l.valuehelpdialog.ValueHelpRangeOperation;var s=l.smartfilterbar.DisplayBehaviour;var t=l.smartfield.TextInEditModeSource;var u=m.ValueState;var v=M.PlacementType;var I="-mInput";var w="-mInputTokenizer";var x="-mInputHBox";var y="-mMoreLink";var z=sap.ui.getCore().getLibraryResourceBundle("sap.ui.comp");var A=d.extend("sap.ui.comp.smartmultiinput.SmartMultiInput",{metadata:{library:"sap.ui.comp",properties:{supportRanges:{type:"boolean",defaultValue:false},supportMultiSelect:{type:"boolean",defaultValue:true},enableODataSelect:{type:"boolean",defaultValue:false},requestAtLeastFields:{type:"string",defaultValue:""},textSeparator:{type:"string",defaultValue:null}},events:{beforeCreate:{allowPreventDefault:true,parameters:{oData:{type:"object"},mParameters:{type:"object"}}},beforeRemove:{allowPreventDefault:true,parameters:{mParameters:{type:"object"}}},tokenUpdate:{parameters:{type:{type:"string"},addedTokens:{type:"sap.m.Token[]"},removedTokens:{type:"sap.m.Token[]"}}},selectionChange:{parameters:{changedItem:{type:"sap.ui.core.Item"},selected:{type:"boolean"}}},selectionFinish:{parameters:{selectedItems:{type:"sap.ui.core.Item[]"}}}}},renderer:function(i,K){d.getMetadata().getRenderer().render(i,K);if(K._oEmptyDash){var N=K.getTokens().length>0?false:true;K._oEmptyDash.setVisible(N);if(N&&K._oMoreLink){K._oMoreLink.setVisible(false);}}}});A.prototype.getTokens=function(){if(this._isReadMode()&&this._oTokenizer){return this._oTokenizer.getTokens();}else if(this._oMultiComboBox&&this._oMultiComboBox.getAggregation("tokenizer")){return this._oMultiComboBox.getAggregation("tokenizer").getTokens();}else if(this._oMultiInput){return this._oMultiInput.getTokens();}return[];};A.prototype.getValue=function(){return this.getTokens();};A.prototype._createMultiInput=function(){var i=this._createAttributes();if(this._oMultiComboBox){this._oMultiComboBox.destroy();this._oMultiComboBox=null;}this._oMultiInput=new a(this.getId()+I,i);this._oMultiInput.attachChange(function(N){this._validateValueOnChange(N.getParameter("value"));},this);if(this.getBindingContext()){this._bindMultiInput();}this._oMultiInput.attachTokenUpdate(function(N){this._validateValueOnChange(this._oMultiInput.getValue());var Q=N.getParameters();delete Q.id;if(this.getBinding("value").getBindingMode()!=="TwoWay"||!this.getBindingContext()){if(N.getParameter("removedTokens")){N.getParameter("removedTokens").forEach(function(U){U.destroy();});}}this.fireTokenUpdate(Q);},this);var K={control:this._oMultiInput,onCreate:"_onMultiInputCreate",params:{type:{type:this._getType(),property:this._oFactory._oMetaData.property}}};this._initMultiInputValueHelp(K);return K;};A.prototype._createMultiComboBox=function(){var i=this._createAttributes();this._oMultiComboBox=new b(this.getId()+"mComboBox",i);if(this.getBindingContext()){this._bindMultiComboBox();}else{this._oMultiInput=this._oMultiComboBox._oTokenizer;}this._oMultiComboBox.attachSelectionChange(function(N){var Q=N.getParameters();delete Q.id;this.fireSelectionChange(Q);},this);this._oMultiComboBox.attachSelectionFinish(function(N){var Q=N.getParameters();delete Q.id;this.oLocalContext=[];this.fireSelectionFinish(Q);},this);var K={control:this._oMultiComboBox,onCreate:"_onCreate",params:{type:{type:this._getType(),property:this._oFactory._oMetaData.property},valuehelp:{annotation:this._getValueListAnnotation(),aggregation:"items",noDialog:true,noTypeAhead:true}}};return K;};A.prototype._createAttributes=function(){var N={width:true,textAlign:true,placeholder:true,tooltip:true,name:true,valueState:true,valueStateText:true};var i=this._oFactory.createAttributes(null,this._oFactory._oMetaData.property,N,{event:"change",parameter:"value"});return i;};function E(K){var N=K.getParameter("tokens"),Q,U,i=0,W=[],X=null,Y;this._onCancel();if(this.oControl instanceof sap.m.MultiInput){this.oControl.setValue("");var Z=this.oControl.getTokens();var $=[];var a1=[];var b1=[];Z.forEach(function(h1){var i1=N.some(function(k1){return h1.getKey()===k1.getKey();});if(!i1){a1.push(h1);}else{var j1=N.filter(function(k1){return h1.getKey()===k1.getKey();})[0];h1.setText(j1.getText());b1.push(h1);}});N.forEach(function(h1){var i1=Z.some(function(j1){return j1.getKey()===h1.getKey();});if(!i1){$.push(h1);b1.push(h1);}});this.oControl.setTokens(b1);var c1=this.oControl.getParent();if(c1.getBindingContext()&&c1.getBinding("value").getBindingMode()==="TwoWay"){var d1=c1._getModel(),e1=c1._getEntitySetName(),f1=d1._resolveGroup(e1),g1=d1.getDeferredGroups().indexOf(f1.groupId)>=0||d1.getDeferredBatchGroups().indexOf(f1.groupId)>=0;if(!g1&&(a1.length||$.length)&&b1.length){c1.setBusyIndicatorDelay(c1.getBusyIndicatorDelay());c1.setBusy(true);}}this.oControl.fireTokenUpdate({type:"tokensChanged",removedTokens:a1,addedTokens:$});i=N.length;while(i--){X=N[i].data("row");if(X){W.push(X);}}}else{if(N[0]){if(this.bIsSingleIntervalRange){Q=N[0].data("range");if(Q){if(this._sType==="datetime"){Y=D.getDateTimeInstance(Object.assign({},this._oDateFormatSettings,{UTC:false}));if(typeof Q.value1==="string"){Q.value1=new Date(Q.value1);}if(Q.operation==="BT"){if(typeof Q.value2==="string"){Q.value2=new Date(Q.value2);}U=Y.format(Q.value1)+"-"+Y.format(Q.value2);}else{U=Y.format(Q.value1);}}else{if(Q.operation==="BT"){U=Q.value1+"-"+Q.value2;}else{U=Q.value1;}}}}else{U=N[0].getKey();}X=N[0].data("row");if(X){W.push(X);}}this.oControl.setValue(U);this.oControl.fireChange({value:U,validated:true});}this._calculateAndSetFilterOutputData(W);}function G(i){var K,N,Q,U={};if(i&&this.mOutParams){for(K in this.mOutParams){if(K){N=this.mOutParams[K];if(N!==this.sKey){Q=i[N];U[K]=Q;}}}if(U&&!jQuery.isEmptyObject(U)){this.fireEvent("valueListChanged",{"changes":U});}}}function _(i,K){var N=document.createElement("span");N.style.whiteSpace="nowrap";N.innerHTML=i;N.className="sapMText";K.appendChild(N);var Q=K.childNodes;var U=Q[Q.length-1].offsetWidth;K.removeChild(K.childNodes[Q.length-1]);return U;}A.prototype._initMultiInputValueHelp=function(i){var K=this._getFilterType(this._oFactory._oMetaData.property.property),N={},Q=this._getDateFormatSettings(),U;this._oFactory._getValueHelpDialogTitle(N);if(this._getValueListAnnotation()){i.params.valuehelp={annotation:this._getValueListAnnotation(),aggregation:"suggestionRows",noDialog:false,noTypeAhead:false,supportMultiSelect:this.getSupportMultiSelect(),supportRanges:this.getBindingContext()?false:this.getSupportRanges(),type:K,displayBehaviour:this._getDisplayBehaviour()};}else if(this.getSupportRanges()&&!this.getBindingContext()){U=new g({fieldName:this._getPropertyName(),preventInitialDataFetchInValueHelpDialog:true,model:this.getModel(),control:this._oMultiInput,title:N.dialogtitle,supportMultiSelect:this.getSupportMultiSelect(),supportRanges:true,type:K,dateFormatSettings:Q,isUnrestrictedFilter:this._isTimeType(K),displayBehaviour:this._getDisplayBehaviour()});U._onOK=E;U._calculateAndSetODataModelOutputData=G;this._oMultiInput.addValidator(this._validateToken.bind(this));}else{this._oMultiInput.setShowValueHelp(false);this._oMultiInput.addValidator(this._validateToken.bind(this));}};A.prototype._bindMultiInput=function(){var i=this.getBinding("value").getBindingMode();switch(i){case B.OneTime:this._bindMultiInputOneTime();break;case B.OneWay:this._bindMultiInputOneWay();break;case B.TwoWay:default:this._bindMultiInputTwoWay();}};A.prototype._bindMultiInputOneTime=function(){var i=this;this._readNavigationPropertySet().then(function(K){K.results.forEach(function(N){var Q=N[i._getPropertyName()];var U=i._getDescriptionFieldName();var W=U?N[U]:"";i._oMultiInput.addToken(i._createToken(Q,W));});});};A.prototype._bindMultiInputOneWay=function(){this._bindMultiInputTokens(this._oMultiInput);};A.prototype._bindMultiInputTwoWay=function(){this._bindMultiInputTokens(this._oMultiInput);this._oMultiInput.attachTokenUpdate(function(i){i.getParameter("addedTokens").forEach(this._addToken.bind(this));i.getParameter("removedTokens").forEach(this._removeToken.bind(this));},this);};A.prototype._bindMultiInputTokens=function(i){var N=this._getNavigationPath(),K=this._getSelectExpandParameter();if(!q(K)){i.bindAggregation("tokens",{path:N,parameters:K,factory:this._tokensFactory.bind(this),events:{aggregatedDataStateChange:this._processDataState.bind(this)}});}else{i.bindAggregation("tokens",{path:N,factory:this._tokensFactory.bind(this),events:{aggregatedDataStateChange:this._processDataState.bind(this)}});}};A.prototype._processDataState=function(i){var K=i.getParameter("dataState"),N=this.getBinding("value");if(!K||!K.getChanges().messages){return;}if(N&&N.bIsBeingDestroyed){return;}var Q=K.getMessages();if(Q.length){var U=false;var W=Q[0];Q.forEach(function(X){if(X.getControlIds().indexOf(this.getId())==-1){X.addControlId(this.getId());U=true;}}.bind(this));this.setValueState(W.getType());this.setValueStateText(W.getMessage());if(U){C.getMessageManager().getMessageModel().checkUpdate(false,true);}}else{this.setValueState(u.None);this.setValueStateText("");}};A.prototype._getSelectExpandParameter=function(){var i={};if(this.getEnableODataSelect()){i.select=this._addODataSelectParameters();}if(this._oFactory._oMetaData.annotations.text&&this._oFactory._oMetaData.annotations.text.navigationPathHelp){i.expand=this._oFactory._oMetaData.annotations.text.navigationPathHelp;}return i;};A.prototype._addODataSelectParameters=function(i){var K=this._getPropertyName();if(this._getDescriptionFieldName()){K=K+","+this._getDescriptionFieldName();}if(this.getRequestAtLeastFields()){K=K+","+this.getRequestAtLeastFields();}return K;};A.prototype._checkFieldGroups=function(){var i,K,N=this.getMode();if(this.getBindingContext()&&this._oFactory&&this._oFactory._oMeta&&(N==="edit")&&!this._bSideEffects){var Q=this._oFactory._oMeta.entitySet,U=this.getModel().getMetaModel().getODataEntitySet(Q),W=this.getModel().getMetaModel().getODataEntityType(U.entityType);K={entitySet:U,entityType:W,path:this._getNavigationPath()};i=this._getView();if(i&&K){this._setFieldGroup(K,i);}}};A.prototype._bindMultiComboBox=function(){var i=this.getBinding("value").getBindingMode();switch(i){case B.OneTime:this._bindMultiComboBoxOneTime();break;case B.OneWay:this._bindMultiComboBoxOneWay();break;case B.TwoWay:default:this._bindMultiComboBoxTwoWay();}};A.prototype._bindMultiComboBoxOneTime=function(){var i=this;this._readNavigationPropertySet().then(function(K){var N=K.results.map(function(Q){return Q[i._getPropertyName()];});i._oMultiComboBox.setSelectedKeys(N);});};A.prototype._bindMultiComboBoxOneWay=function(){this._createAndAttachHelperMultiInput();};A.prototype._bindMultiComboBoxTwoWay=function(){this._createAndAttachHelperMultiInput();this.oLocalContext=[];this._oMultiComboBox.attachSelectionChange(function(i){var K=i.getParameter("selected"),N=i.getParameter("changedItem"),Q={},U,W,X;this.setValueState(u.None);this.setValueStateText("");if(K){Q[this._getPropertyName()]=N.getKey();X=N.getBindingContext("list")||N.getBindingContext();U=X.getProperty();this._getEntityType().key.propertyRef.forEach(function(Y){if(U&&U[Y.name]){Q[Y.name]=U[Y.name];}});}else{W=this._oMultiInput.getTokens().filter(function(Y){return Y.getKey()===N.getKey();})[0];}if(K){this.oLocalContext.push(this._createEntity(Q));}else{if(W){this._removeEntity(W.getBindingContext());}else{this.oLocalContext.forEach(function(Y,Z){if(Y.getProperty(this._getPropertyName())===N.getKey()){this._getModel().deleteCreatedEntry(Y);this.oLocalContext.splice(Z,1);}}.bind(this));}}},this);};A.prototype._readNavigationPropertySet=function(){var i=this;return new Promise(function(K,N){var Q=i.getBindingContext(),U=i._getModel(),W=i._getNavigationPath();U.read(W,{context:Q,success:function(X){K(X);},error:function(X){i.setValueState(u.Error);i.setValueStateText(X.responseText);N(X);}});});};A.prototype._createAndAttachHelperMultiInput=function(){this._oMultiInput=new a();this._oMultiInput.setBindingContext(this.getBindingContext());this._oMultiInput.setModel(this._getModel());this._bindMultiInputTokens(this._oMultiInput);var i=this._oMultiInput.getBinding("tokens");function K(){var N=this._oMultiInput.getTokens().map(function(Q){return Q.getKey();});if(this._oMultiComboBox){this._oMultiComboBox.setSelectedKeys(N);}}K.call(this);i.attachChange(K,this);};A.prototype._getReadTokenList=function(){if(!this.oReadTokenList){this.oReadTokenList=new L();this.addDependent(this.oReadTokenList);}return this.oReadTokenList;};A.prototype._getReadTokenListPopover=function(){if(!this.oReadTokenListPopover){this.oReadTokenListPopover=new P({showArrow:true,placement:v.Auto,showHeader:false,contentMinWidth:"auto",content:[this.oReadTokenList]});this.addDependent(this.oReadTokenListPopover);}return this.oReadTokenListPopover;};A.prototype._handleNMoreIndicatorPress=function(){var K=this.getTokens();if(!K){return;}var N=this._getReadTokenList();var Q=this._getReadTokenListPopover();N.removeAllItems();for(var i=0,U=K.length;i<U;i++){var W=K[i],X=new S({title:W.getText()});N.addItem(X);}if(this._oMoreLink.getDomRef()){Q.openBy(this._oMoreLink.getDomRef());}};A.prototype._onResize=function(){if(this._isReadMode()&&this._oTokenizer){this._deregisterResizeHandler();this._oTokenizer.setMaxWidth(this.$().width()+"px");this._oTokenizer.setRenderMode("Narrow");this._oTokenizer.scrollToEnd();if(this.getMode()==="display"&&this.getTokens().length>0){this._onDisplayResize();}this._registerResizeHandler();}};A.prototype._onDisplayResize=function(){var i=this.getDomRef().clientWidth,N=this._iHiddenLabelsCount?_("999 "+z.getText("POPOVER_DEFINE_MORE_LINKS"),this.getDomRef()):0,K=this._iHBoxWidth+N>i,Q=this._iHiddenLabelsCount&&(this._iHBoxWidth+N+this._iFirstHiddenTokenLength<i);if(K||Q){this._oHBox.removeAllItems();this.getTokens().forEach(function(U){this._oHBox.addItem(this._generateDisplayText(U.getText()));}.bind(this));}};A.prototype.onBeforeRendering=function(){if(d.prototype.onBeforeRendering){d.prototype.onBeforeRendering.apply(this,arguments);}this._deregisterResizeHandler();};A.prototype.onAfterRendering=function(){if(d.prototype.onAfterRendering){d.prototype.onAfterRendering.apply(this,arguments);}if(this.getMode()==="display"&&this.bControlNotRendered){this._oHBox.removeAllItems();this._oMoreLink.setVisible(false);this.getTokens().forEach(function(i){var K=this._generateDisplayText(i.getText());this._oHBox.addItem(K);},this);}this._registerResizeHandler();};A.prototype._registerResizeHandler=function(){if(!this._iResizeHandlerId){this._iResizeHandlerId=R.register(this,this._onResize.bind(this));}};A.prototype._deregisterResizeHandler=function(){if(this._iResizeHandlerId){R.deregister(this._iResizeHandlerId);this._iResizeHandlerId=null;}};A.prototype._createTokenizer=function(){this._oTokenizer=new c(this.getId()+w,{editable:false,visible:false,width:"100%"});this._oHBox=new H(this.getId()+x);this._oMoreLink=new n(this.getId()+y,{press:this._handleNMoreIndicatorPress.bind(this),ariaLabelledBy:this.getId()+"-label"});this._oEmptyDash=new o({text:"–",visible:true});var N=this._getNavigationPath(),i=this._getSelectExpandParameter();if(this.getBindingContext()){this._bindMultiInputTokens(this._oTokenizer);this._oHBox.bindAggregation("items",{path:N,parameters:i,factory:this._textFactory.bind(this)});}else{this.attachInnerControlsCreated(this._mirrorTokensToDisplayTokenizer,this);}var K=new p({height:"100%",items:[this._oEmptyDash,this._oHBox,this._oMoreLink,this._oTokenizer]});return{control:K,onCreate:"_onCreate"};};A.prototype._textFactory=function(i,K){var N=K.getProperty(this._getPropertyName()),Q=N instanceof Date?this._formatValue(N):N.toString(),U=this._getDescriptionFieldName(),W=U?K.getProperty(U):"",X=this._getFormattedText(Q,W),Y;if(this.getDomRef()){this.bControlNotRendered=false;Y=this._generateDisplayText(X);}else{this.bControlNotRendered=true;Y=new o({text:X});}if(this._oEmptyDash){this._oEmptyDash.setVisible(false);}return Y;};A.prototype._generateDisplayText=function(i){var K=this.getDomRef(),N=K.offsetWidth,Q=_("999 "+z.getText("POPOVER_DEFINE_MORE_LINKS"),K),U=new o(),W,X,Y;if(this._oHBox.getItems().length===0){this._iHBoxWidth=0;this._iHiddenLabelsCount=0;this._iFirstHiddenTokenLength=0;}this._oHBox.getItems().filter(function($){return!$.getVisible();}).forEach(function($){this._oHBox.removeItem($);}.bind(this));U.setTooltip(i);i=this._iHBoxWidth===0?i:"\u00a0"+this.getTextSeparator()+"\u00a0"+i;U.setText(i);var Z=_(i,K);this._iHBoxWidth+=Z;if(this._iHiddenLabelsCount===0&&this._iHBoxWidth<=N){this._oMoreLink.setVisible(false);}else{while(this._iHBoxWidth&&this._iHBoxWidth>N-Q){this._iHiddenLabelsCount+=1;if(this._oHBox.getItems()[0]){this._iFirstHiddenTokenLength=_(this._oHBox.getItems()[0].getText(),K);this._iHBoxWidth-=this._iFirstHiddenTokenLength;this._oHBox.removeItem(0);}else{this._iHBoxWidth-=Z;U.setVisible(false);}}if(this._oHBox.getItems().length===0&&this._iHiddenLabelsCount===1&&!U.getVisible()){this._iHiddenLabelsCount=0;this._iHBoxWidth+=Z;U.setVisible(true);this._oMoreLink.setVisible(false);}else{if(this._oHBox.getItems().length>0){W=this._oHBox.getItems()[0];W.setText(W.getTooltip());if(this._oHBox.getItems().length-1>0){X=this._oHBox.getItems()[(this._oHBox.getItems().length-1)];Y="\u00a0"+this.getTextSeparator()+"\u00a0"+X.getTooltip();X.setText(Y);}U.setText(U.getText()+"\u00a0"+this.getTextSeparator()+"\u00a0");}else{U.setText(U.getTooltip()+"\u00a0"+this.getTextSeparator()+"\u00a0");}this._oMoreLink.setVisible(true);this._oMoreLink.setText(this._iHiddenLabelsCount+" "+z.getText("POPOVER_DEFINE_MORE_LINKS"));}}return U;};A.prototype._mirrorTokensToDisplayTokenizer=function(){if(this.getMode()==="display"&&typeof this._oMultiInput!=="undefined"){this._oTokenizer.removeAllTokens();this._oHBox.removeAllItems();this._oMoreLink.setVisible(false);this._oMultiInput.getTokens().forEach(function(i){var N=new T({text:i.getText(),key:i.getKey()});this._oTokenizer.addToken(N);var K=this._generateDisplayText(i.getText());this._oHBox.addItem(K);},this);}};A.prototype.getTextSeparator=function(){var i=this.getProperty("textSeparator");if(i){return i;}return z.getText("SMARTMULTIINPUT_SEPARATOR");};A.prototype._tokensFactory=function(i,K){var N;this.setBusy(false);if(this._oFactory){var Q=K.getProperty(this._getPropertyName());var U=Q instanceof Date?this._formatValue(Q):Q.toString();var W=this._getDescriptionFieldName();var X=W?K.getProperty(W):"";N=this._createToken(U,X,K);}else{N=new T();}return N;};A.prototype._createToken=function(K,i,N){var Q=this._getFormattedText(K,i);var U;U=new T();U.setKey(K);U.setText(Q);return U;};A.prototype._addToken=function(i){var K={},N,Q,U,W=i.data("row"),X=i.data("range");K[this._getPropertyName()]=i.getKey();if(W){this._getEntityType().key.propertyRef.forEach(function(Z){if(W[Z.name]){K[Z.name]=W[Z.name];}});if(this._oFactory._aProviders&&this._oFactory._aProviders[0].mOutParams){var Y=this._oFactory._aProviders[0].mOutParams;for(Q in Y){if(Q&&Q!==this._getPropertyName()){U=Y[Q];K[Q]=W[U];}}}}if(X){K["range"]=X;}this.setValueState(u.None);this.setValueStateText("");N=this._createEntity(K);i.setBindingContext(N);};A.prototype._createEntity=function(i){var K=this._getModel(),N=this._getEntitySetName(),Q=K._resolveGroup(N),U=this._getNavigationPath(),W=this.fireBeforeCreate({oData:i,mParameters:Q});Q.refreshAfterChange=true;Q.context=this.getBindingContext();if(W){Q.properties=i;var X=K.createEntry(U,Q);return X;}};A.prototype._removeToken=function(i){this._removeEntity(i.getBindingContext());i.destroy();};A.prototype._removeEntity=function(i){var K=this._getModel(),N=this._getEntitySetName(),Q=K._resolveGroup(N),U=this.fireBeforeRemove({mParameters:Q});var W=K.getDeferredGroups().indexOf(Q.groupId)>=0||K.getDeferredBatchGroups().indexOf(Q.groupId)>=0;if(W&&this._entityHasPendingCreateChange(K,i)){K.deleteCreatedEntry(i);U=false;}Q.refreshAfterChange=true;Q.context=i;if(U){var X="";K.remove(X,Q);}};A.prototype._entityHasPendingCreateChange=function(i,K){var N=i.getPendingChanges();var Q=i.getKey(K);return!!N[Q]&&k(N[Q],K.getObject());};A.prototype._getEntityKeyProperties=function(i){var K=this._getModel(),N=K.oMetadata._getEntityTypeByPath(i.getPath()),Q={};N.key.propertyRef.forEach(function(U){var W=U.name;Q[W]=i.getProperty(W);});return Q;};A.prototype.checkClientError=function(){if(this.getMode()==="display"){return false;}return!this._validateMultiInput();};A.prototype.getRangeData=function(){var i=this.getTokens(),K=[];i.forEach(function(N){var Q;if(N.data("range")){Q=N.data("range");}else{Q=this._getDefaultTokenRangeData(N);}K.push(Q);},this);return K;};A.prototype.setRangeData=function(i){if(!this.getBindingContext()){var K=Array.isArray(i)?i:[i];if(!this._oMultiInput){var N=this.getEditable(),Q=this.getEnabled(),U=this.getContextEditable();this.setEditable(true);this.setEnabled(true);this.setContextEditable(true);this.setEditable(N);this.setEnabled(Q);this.setContextEditable(U);}this._oMultiInput.removeAllTokens();K.forEach(function(W){var X=this._getTokenTextFromRangeData(W);var Y=new T({text:X,key:X});Y.data("range",W);this._oMultiInput.addToken(Y);},this);this._mirrorTokensToDisplayTokenizer();}else{j.warning("setRangeData can only be used without property binding");}};A.prototype._getTokenTextFromRangeData=function(i){var K="";switch(i.operation){case r.EQ:K="="+i.value1;break;case r.GT:K=">"+i.value1;break;case r.GE:K=">="+i.value1;break;case r.LT:K="<"+i.value1;break;case r.LE:K="<="+i.value1;break;case r.Contains:K="*"+i.value1+"*";break;case r.StartsWith:K=i.value1+"*";break;case r.EndsWith:K="*"+i.value1;break;case r.BT:K=i.value1+"...";if(i.value2){K+=i.value2;}break;default:K="";}if(i.exclude&&K!==""){K="!("+K+")";}return K;};A.prototype._getComputedTextInEditModeSource=function(){var i=this.getTextInEditModeSource();if(this.isPropertyInitial("textInEditModeSource")&&this.getMode()==="edit"){i=t.None;}return i;};A.prototype.getFilter=function(){var i=[this._getPropertyName()],K={},N=this.getRangeData(),Q;K[this._getPropertyName()]={ranges:N,items:[]};Q=h.generateFilters(i,K);return Q&&Q.length===1&&Q[0];};A.prototype._getDefaultTokenRangeData=function(i){var K={exclude:false,operation:r.EQ,value1:this._parseValue(i.getKey()),value2:"",keyField:this._getPropertyName()};return K;};A.prototype._validateToken=function(i){var K=i.text;var N=this._validateValue(K);if(N){var Q=new T({key:K,text:K});if(this.getSupportRanges()){var U=this._getDefaultTokenRangeData(Q);Q.data("range",U);Q.setText("="+K);}return Q;}};A.prototype._validateMultiInput=function(){if(this._oMultiInput.getValueState()!==u.None){return false;}if(this.getRequired()&&this.getTokens().length===0){this.setValueStateText(sap.ui.getCore().getLibraryResourceBundle("sap.ui.comp").getText("VALUEHELPVALDLG_FIELDMESSAGE"));this.setValueState(u.Error);return false;}else{this.setValueState(u.None);this.setValueStateText("");return true;}};A.prototype._validateValueOnChange=function(i){if(i===""){this.setValueState(u.None);this.setValueStateText("");this._validateMultiInput();}else{this._validateValue(i);}};A.prototype._parseValue=function(i){return this._getType().parseValue(i,"string");};A.prototype._formatValue=function(i){return this._getType().formatValue(i,"string");};A.prototype._validateValue=function(i){try{var K=this._parseValue(i);this._getType().validateValue(K);this.setValueState(u.None);this.setValueStateText("");return true;}catch(N){this.setValueState(u.Error);this.setValueStateText(N.message);var Q={element:this._oMultiInput,property:"value",type:this._getType(),newValue:i,oldValue:null,exception:N,message:N.message};if(N instanceof f){this.fireParseError(Q);}else if(N instanceof V){this.fireValidationError(Q);}return false;}};A.prototype._getModel=function(){if(this._oFactory){return this._oFactory._oModel;}};A.prototype._getDateFormatSettings=function(){var i=this.data("dateFormatSettings");if(typeof i==="string"){try{i=JSON.parse(i);}catch(K){}}return i;};A.prototype._getNavigationPath=function(){return this._oFactory._oMetaData.navigationPath;};A.prototype._getDescriptionFieldName=function(){var i=this._oFactory._oMetaData.annotations.text;if(i){if(i.navigationPathHelp){return i.navigationPathHelp+"/"+i.property.property.name;}return i.property.property.name;}};A.prototype._getType=function(){if(!this._oType){var i;if(this._isEdmTimeType()){i=this._getDateFormatSettings();}this._oType=this._oFactory._oTypes.getType(this._oFactory._oMetaData.property,i);}return this._oType;};A.prototype._isEdmTimeType=function(){var i=["Edm.DateTime","Edm.DateTimeOffset","Edm.Time"];return i.indexOf(this._oFactory._oMetaData.property.property.type)>-1;};A.prototype._isTimeType=function(i){var K=["date","datetime","time"];return K.indexOf(i)>-1;};A.prototype._getPropertyName=function(){return this._oFactory._oMetaData.property.property.name;};A.prototype._getEntitySetName=function(){return this._oFactory._oMetaData.entitySet.name;};A.prototype._getEntityType=function(){return this._oFactory._oMetaData.entityType;};A.prototype._getValueListAnnotation=function(){return this._oFactory._oMetaData.annotations.valuelist;};A.prototype._getDisplayBehaviour=function(){var i=this._oFactory._getDisplayBehaviourConfiguration("defaultInputFieldDisplayBehaviour");if(!i||i===s.auto){i=s.descriptionAndId;}return i;};A.prototype._getFormattedText=function(K,i){var N=this._getDisplayBehaviour();return F.getFormattedExpressionFromDisplayBehaviour(N,K,i);};A.prototype._getFilterType=function(i){if(O.isNumeric(i.type)){return"numeric";}else if(i.type==="Edm.DateTime"&&i["sap:display-format"]==="Date"){return"date";}else if(i.type==="Edm.String"){return"string";}else if(i.type==="Edm.Boolean"){return"boolean";}else if(i.type==="Edm.Time"){return"time";}else if(i.type==="Edm.DateTimeOffset"){return"datetime";}return undefined;};A.prototype.setEntitySet=function(){d.prototype.setEntitySet.apply(this,arguments);this.updateBindingContext(false,this._getModel());return this;};A.prototype.bindProperty=function(i,K){d.prototype.bindProperty.apply(this,arguments);if(i==="value"){this.updateBindingContext(false,this._getModel());}return this;};A.prototype._checkComboBox=function(){var i=this._oFactory._oSelector.checkComboBox();return i&&i.combobox;};A.prototype._isReadMode=function(){return!this.getEditable()||!this.getEnabled()||!this.getContextEditable();};function J(){this._onCreate.apply(this,arguments);if(this._aProviders.length>0){this._aProviders[0]._onOK=E;this._aProviders.forEach(function(i){i._calculateAndSetODataModelOutputData=G;});}}A.prototype._init=function(){var i=this;d.prototype._init.apply(this,arguments);if(this._oFactory){this._oFactory._createMultiInput=this._createMultiInput.bind(this);this._oFactory._createMultiComboBox=this._createMultiComboBox.bind(this);this._oFactory._createTokenizer=this._createTokenizer.bind(this);this._oFactory._onMultiInputCreate=J;this._oFactory._oSelector.getCreator=function(){if(i._isReadMode()){return"_createTokenizer";}else if(i._checkComboBox()){return"_createMultiComboBox";}else{return"_createMultiInput";}};}};A.prototype.exit=function(){this._deregisterResizeHandler();if(this._oMultiInput){this._oMultiInput.destroy();}if(this._oMultiComboBox){this._oMultiComboBox.destroy();}if(this._oTokenizer){this._oTokenizer.destroy();}if(this._oHBox){this._oHBox.destroy();}this._oMultiInput=null;this._oMultiComboBox=null;this._oTokenizer=null;this._oHBox=null;d.prototype.exit.apply(this,arguments);};return A;});
