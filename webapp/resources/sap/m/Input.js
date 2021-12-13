/*!
 * OpenUI5
 * (c) Copyright 2009-2021 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(['./InputBase','./Popover','sap/ui/core/Item','./ColumnListItem','./GroupHeaderListItem','./StandardListItem','sap/ui/core/SeparatorItem','./List','./Table','./library','sap/ui/core/IconPool','sap/ui/Device','./SuggestionsPopover','./Toolbar','./ToolbarSpacer','./Button',"sap/ui/core/ResizeHandler","sap/ui/dom/containsOrEquals","sap/base/assert","sap/base/util/deepEqual","sap/m/inputUtils/wordStartsWithValue","sap/m/inputUtils/inputsDefaultFilter","sap/m/inputUtils/highlightDOMElements","sap/m/inputUtils/typeAhead","sap/ui/events/KeyCodes","sap/m/inputUtils/filterItems","sap/m/inputUtils/ListHelpers","sap/m/inputUtils/calculateSelectionStart","sap/m/inputUtils/selectionRange","./InputRenderer","sap/ui/base/ManagedObject","sap/ui/base/ManagedObjectObserver","sap/ui/thirdparty/jquery","sap/ui/dom/jquery/selectText"],function(I,P,a,C,G,S,b,L,T,l,c,D,d,e,f,B,R,g,h,j,w,k,m,t,K,n,o,p,s,q,M,r,Q){"use strict";var u=l.ListType;var v=l.InputTextFormatMode;var x=l.InputType;var y=l.ListMode;var z=l.ListSeparators;var A=I.extend("sap.m.Input",{metadata:{library:"sap.m",properties:{type:{type:"sap.m.InputType",group:"Data",defaultValue:x.Text},maxLength:{type:"int",group:"Behavior",defaultValue:0},dateFormat:{type:"string",group:"Misc",defaultValue:'YYYY-MM-dd',deprecated:true},showValueHelp:{type:"boolean",group:"Behavior",defaultValue:false},valueHelpIconSrc:{type:"sap.ui.core.URI",group:"Behavior",defaultValue:"sap-icon://value-help"},showSuggestion:{type:"boolean",group:"Behavior",defaultValue:false},valueHelpOnly:{type:"boolean",group:"Behavior",defaultValue:false},filterSuggests:{type:"boolean",group:"Behavior",defaultValue:true},maxSuggestionWidth:{type:"sap.ui.core.CSSSize",group:"Appearance",defaultValue:null},startSuggestion:{type:"int",group:"Behavior",defaultValue:1},showTableSuggestionValueHelp:{type:"boolean",group:"Behavior",defaultValue:true},description:{type:"string",group:"Misc",defaultValue:null},fieldWidth:{type:"sap.ui.core.CSSSize",group:"Appearance",defaultValue:'50%'},valueLiveUpdate:{type:"boolean",group:"Behavior",defaultValue:false},selectedKey:{type:"string",group:"Data",defaultValue:""},textFormatMode:{type:"sap.m.InputTextFormatMode",group:"Misc",defaultValue:v.Value},textFormatter:{type:"any",group:"Misc",defaultValue:""},suggestionRowValidator:{type:"any",group:"Misc",defaultValue:""},enableSuggestionsHighlighting:{type:"boolean",group:"Behavior",defaultValue:true},enableTableAutoPopinMode:{type:"boolean",group:"Behavior",defaultValue:false},autocomplete:{type:"boolean",group:"Behavior",defaultValue:true},showClearIcon:{type:"boolean",defaultValue:false},effectiveShowClearIcon:{type:"boolean",defaultValue:false,visibility:"hidden"}},defaultAggregation:"suggestionItems",aggregations:{suggestionItems:{type:"sap.ui.core.Item",multiple:true,singularName:"suggestionItem"},suggestionColumns:{type:"sap.m.Column",multiple:true,singularName:"suggestionColumn",bindable:"bindable",forwarding:{getter:"_getSuggestionsTable",aggregation:"columns"}},suggestionRows:{type:"sap.m.ColumnListItem",altTypes:["sap.m.GroupHeaderListItem"],multiple:true,singularName:"suggestionRow",bindable:"bindable",forwarding:{getter:"_getSuggestionsTable",aggregation:"items"}},_suggestionPopup:{type:"sap.ui.core.Control",multiple:false,visibility:"hidden"},_valueHelpIcon:{type:"sap.ui.core.Icon",multiple:false,visibility:"hidden"}},associations:{selectedItem:{type:"sap.ui.core.Item",multiple:false},selectedRow:{type:"sap.m.ColumnListItem",multiple:false}},events:{liveChange:{parameters:{value:{type:"string"},escPressed:{type:"boolean"},previousValue:{type:"string"}}},valueHelpRequest:{parameters:{fromSuggestions:{type:"boolean"}}},suggest:{parameters:{suggestValue:{type:"string"},suggestionColumns:{type:"sap.m.ListBase"}}},suggestionItemSelected:{parameters:{selectedItem:{type:"sap.ui.core.Item"},selectedRow:{type:"sap.m.ColumnListItem"}}},submit:{parameters:{value:{type:"string"}}}},designtime:"sap/m/designtime/Input.designtime"}});c.insertFontFaceStyle();A._DEFAULTFILTER_TABULAR=function(V,E){var F=E.getCells(),i=0;for(;i<F.length;i++){if(F[i].getText){if(w(F[i].getText(),V)){return true;}}}return false;};A._DEFAULTRESULT_TABULAR=function(E){if(!E||E.isA("sap.m.GroupHeaderListItem")){return"";}var F=E.getCells(),i=0;for(;i<F.length;i++){if(F[i].getText){return F[i].getText();}}return"";};A.prototype.init=function(){I.prototype.init.call(this);this._iSetCount=0;this._sProposedItemText=null;this._oRb=sap.ui.getCore().getLibraryResourceBundle("sap.m");if(this.getId().indexOf("popup-input")===-1){this._createSuggestionsPopover();}this._setTypedInValue("");this._bClearButtonPressed=false;this._bAfterOpenFinisihed=false;};A.prototype.exit=function(){I.prototype.exit.call(this);this._deregisterEvents();this.cancelPendingSuggest();if(this._iRefreshListTimeout){clearTimeout(this._iRefreshListTimeout);this._iRefreshListTimeout=null;}this._destroySuggestionsTable();if(this._getSuggestionsPopover()){this._oSuggestionPopup=null;this._oSuggPopover.destroy();this._oSuggPopover=null;}this.$().off("click");};A.prototype.onBeforeRendering=function(){var i=this.getSelectedKey(),E=this.getShowValueHelp()&&this.getEnabled()&&this.getEditable(),F=this.getProperty("effectiveShowClearIcon")&&this.getEnabled()&&this.getEditable(),H=this._oValueHelpIcon,J=this._getSuggestionsPopover(),N=J&&this._isSuggestionsPopoverOpen(),O=J&&J.getInput(),V=N?J._getValueStateHeader().getText():null,U=N?J._getValueStateHeader().getValueState():"";I.prototype.onBeforeRendering.call(this);if(this.getShowClearIcon()){this._getClearIcon().setProperty("visible",F);}else if(this._oClearButton){this._getClearIcon().setProperty("visible",false);}this._deregisterEvents();if(i&&!this.getSelectedItem()&&this.getSuggestionItemByKey(i)){this.setSelectedKey(i);}if(this.getShowSuggestion()){if(this.getShowTableSuggestionValueHelp()){this._addShowMoreButton();}else{this._removeShowMoreButton();}if(O){O.setType(this.getType());}}if(E){H=this._getValueHelpIcon();H.setProperty("visible",true,true);}else if(H){H.setProperty("visible",false,true);}if(!this.getWidth()){this.setProperty("width","100%",true);}if(this._hasTabularSuggestions()){this._getSuggestionsTable().setAutoPopinMode(this.getEnableTableAutoPopinMode());this._getSuggestionsTable().setContextualWidth(this.getEnableTableAutoPopinMode()?"Auto":"Inherit");}if(N&&((this.getValueStateText()&&V!==this.getValueStateText())||(this.getValueState()!==U)||(this.getFormattedValueStateText()))){this._updateSuggestionsPopoverValueState();}};A.prototype._getDisplayText=function(i){var E=this.getTextFormatter();if(E){return E(i);}var F=i.getText(),H=i.getKey(),J=this.getTextFormatMode();switch(J){case v.Key:return H;case v.ValueKey:return F+' ('+H+')';case v.KeyValue:return'('+H+') '+F;default:return F;}};A.prototype._onValueUpdated=function(i){if(this._bSelectingItem||i===this._sSelectedValue){return;}var E=this.getSelectedKey(),H,F=this._getSuggestionsPopover(),J=F&&F.getItemsContainer();if(E===''){return;}if(this._hasTabularSuggestions()){H=this._getSuggestionsTable()&&!!this._getSuggestionsTable().getSelectedItem();}else{H=J&&!!J.getSelectedItem();}if(H){return;}this.setProperty("selectedKey",'',true);this.setAssociation("selectedRow",null,true);this.setAssociation("selectedItem",null,true);this.fireSuggestionItemSelected({selectedItem:null,selectedRow:null});};A.prototype.setSelectionItem=function(i,E){this._bSelectingItem=true;if(!i){this.setAssociation("selectedItem",null,true);this.setValue('');return;}var F=this._iSetCount,N;this.setAssociation("selectedItem",i,true);this.setProperty("selectedKey",i.getKey(),true);if(E){this.fireSuggestionItemSelected({selectedItem:i});}if(F!==this._iSetCount){N=this.getValue();}else{N=this._getDisplayText(i);}this._sSelectedValue=N;this.updateInputField(N);if(this.bIsDestroyed){return;}if(!(this.isMobileDevice()&&this instanceof sap.m.MultiInput)){this._closeSuggestionPopup();}this._bSelectingItem=false;this._resetTypeAhead();};A.prototype.addSuggestionRowGroup=function(i,H,E){H=H||new G({title:M.escapeSettingsValue(i.text)||M.escapeSettingsValue(i.key)});this._createSuggestionPopupContent(true);this.addAggregation("suggestionRows",H,E);return H;};A.prototype.addSuggestionItemGroup=function(i,H,E){H=H||new b({text:M.escapeSettingsValue(i.text)||M.escapeSettingsValue(i.key)});this._createSuggestionPopupContent(false);this.addAggregation("suggestionItems",H,E);return H;};A.prototype.setSelectedItem=function(i){if(typeof i==="string"){i=sap.ui.getCore().byId(i);}if(i!==null&&!(i instanceof a)){return this;}this.setSelectionItem(i);return this;};A.prototype.setSelectedKey=function(i){i=this.validateProperty("selectedKey",i);this.setProperty("selectedKey",i,true);if(this._hasTabularSuggestions()){return this;}if(!i){this.setSelectionItem();return this;}var E=this.getSuggestionItemByKey(i);this.setSelectionItem(E);return this;};A.prototype.getSuggestionItemByKey=function(E){var F=this.getSuggestionItems()||[],H,i;for(i=0;i<F.length;i++){H=F[i];if(H.getKey()===E){return H;}}};A.prototype._getFormattedValueStateText=function(){var i=this._isSuggestionsPopoverOpen(),V=i?this._getSuggestionsPopover()._getValueStateHeader().getFormattedText():null;if(i&&V){return V;}else{return I.prototype.getFormattedValueStateText.call(this);}};A.prototype.setSelectionRow=function(i,E){if(!i){this.setAssociation("selectedRow",null,true);return;}this._bSelectingItem=true;var F,H=this.getSuggestionRowValidator();if(H){F=H(i);if(!(F instanceof a)){F=null;}}var J=this._iSetCount,N="",O;this.setAssociation("selectedRow",i,true);if(F){N=F.getKey();}this.setProperty("selectedKey",N,true);if(E){this.fireSuggestionItemSelected({selectedRow:i});}if(J!==this._iSetCount){O=this.getValue();}else{if(F){O=this._getDisplayText(F);}else{O=this._getRowResultFunction()(i);}}this._sSelectedValue=O;this.updateInputField(O);if(this.bIsDestroyed){return;}if(!(this.isMobileDevice()&&this instanceof sap.m.MultiInput&&this._isMultiLineMode)){this.setSelectionUpdatedFromList(false);this._closeSuggestionPopup();}this._bSelectingItem=false;};A.prototype.setSelectedRow=function(i){if(typeof i==="string"){i=sap.ui.getCore().byId(i);}if(i!==null&&!(i instanceof C)){return this;}this.setSelectionRow(i);return this;};A.prototype._getValueHelpIcon=function(){var i=this,E=this.getValueHelpIconSrc();if(!this._oValueHelpIcon){this._oValueHelpIcon=this.addEndIcon({id:this.getId()+"-vhi",src:E,useIconTooltip:false,alt:this._oRb.getText("INPUT_VALUEHELP_BUTTON"),decorative:false,noTabStop:true,press:function(F){if(!i.getValueHelpOnly()){var H=this.getParent(),$;if(D.support.touch){$=H.$('inner');$.attr('readonly','readonly');H.focus();$.removeAttr('readonly');}else{H.focus();}i.bValueHelpRequested=true;i._fireValueHelpRequest(false);}}});}else if(this._oValueHelpIcon.getSrc()!==E){this._oValueHelpIcon.setSrc(E);}return this._oValueHelpIcon;};A.prototype._getClearIcon=function(){var i=this;if(this._oClearButton){return this._oClearButton;}this._oClearButton=this.addEndIcon({src:c.getIconURI("decline"),noTabStop:true,visible:false,alt:this._oRb.getText("INPUT_CLEAR_ICON_ALT"),useIconTooltip:false,decorative:false,press:function(){if(i.getValue()!==""){i.fireChange({value:""});i.fireLiveChange({value:""});i.setValue("");i._bClearButtonPressed=true;setTimeout(function(){if(D.system.desktop){i.focus();i._closeSuggestionPopup();}},0);}}},0);return this._oClearButton;};A.prototype._fireValueHelpRequest=function(F){var i="";if(this.getShowSuggestion()&&!this.isMobileDevice()){i=this._getTypedInValue()||"";}else{i=this.getDOMValue();}this.fireValueHelpRequest({fromSuggestions:F,_userInputValue:i});};A.prototype._fireValueHelpRequestForValueHelpOnly=function(){if(this.getEnabled()&&this.getEditable()&&this.getShowValueHelp()&&this.getValueHelpOnly()){if(D.system.phone){this.focus();}this._fireValueHelpRequest(false);}};A.prototype.ontap=function(E){I.prototype.ontap.call(this,E);if(this.isValueHelpOnlyOpener(E.target)){this._fireValueHelpRequestForValueHelpOnly();}if(this.isMobileDevice()&&this.getEditable()&&this.getEnabled()&&this.getShowSuggestion()&&(!this._bClearButtonPressed)&&E.target.id!==this.getId()+"-vhi"){this._openSuggestionsPopover();}this._bClearButtonPressed=false;};A.prototype.setFilterFunction=function(F){if(F===null||F===undefined){this._fnFilter=k;return this;}h(typeof(F)==="function","Input.setFilterFunction: first argument fnFilter must be a function on "+this);this._fnFilter=F;return this;};A.prototype._getFilterFunction=function(F){if(typeof this._fnFilter==="function"&&!F){return this._fnFilter;}return!this._hasTabularSuggestions()?k:A._DEFAULTFILTER_TABULAR;};A.prototype.setRowResultFunction=function(F){var i;if(F===null||F===undefined){this._fnRowResultFilter=A._DEFAULTRESULT_TABULAR;return this;}h(typeof(F)==="function","Input.setRowResultFunction: first argument fnFilter must be a function on "+this);this._fnRowResultFilter=F;i=this.getSelectedRow();if(i){this.setSelectedRow(i);}return this;};A.prototype._getRowResultFunction=function(F){if(typeof this._fnRowResultFilter==="function"&&!F){return this._fnRowResultFilter;}return A._DEFAULTRESULT_TABULAR;};A.prototype.closeSuggestions=function(){this._closeSuggestionPopup();};A.prototype._doSelect=function(i,E){if(D.support.touch){return;}var F=this._$input[0];if(F){var $=this._$input;F.focus();$.selectText(i?i:0,E?E:$.val().length);}return this;};A.prototype._isIncrementalType=function(){var i=this.getType();if(i==="Number"||i==="Date"||i==="Datetime"||i==="Month"||i==="Time"||i==="Week"){return true;}return false;};A.prototype.onsapescape=function(E){if(this._isSuggestionsPopoverOpen()){E.originalEvent._sapui_handledByControl=true;this.setSelectionUpdatedFromList(false);this._closeSuggestionPopup();if(this._getTypedInValue()!==this.getValue()){this.setValue(this._getTypedInValue());}return;}if(this.getValueLiveUpdate()){this.setProperty("value",this.getLastValue(),true);}if(I.prototype.onsapescape){I.prototype.onsapescape.apply(this,arguments);}};A.prototype.onsapenter=function(E){var i=this._isSuggestionsPopoverOpen(),F=!this.hasStyleClass("sapMFocus")&&i,H=this._hasTabularSuggestions()?this.getSuggestionRows():this.getSuggestionItems(),V,J;this.cancelPendingSuggest();F&&this.setSelectionUpdatedFromList(true);if(this.getShowSuggestion()&&this._bDoTypeAhead&&i){J=this._getSuggestionsPopover().getItemsContainer().getSelectedItem();if(this._hasTabularSuggestions()){J&&this.setSelectionRow(J,true);}else{J&&this.setSelectionItem(o.getItemByListItem(H,J),true);}}if(i&&!this.isComposingCharacter()){this._closeSuggestionPopup();V=this.getDOMValue()?this.getDOMValue().length:null;this.selectText(V,V);}!F&&I.prototype.onsapenter.apply(this,arguments);if(this.getEnabled()&&this.getEditable()&&!(this.getValueHelpOnly()&&this.getShowValueHelp())){this.fireSubmit({value:this.getValue()});}if(!this.isMobileDevice()){this._resetTypeAhead();}};A.prototype.onsapfocusleave=function(E){var i=this._getSuggestionsPopover(),F=i&&i.getPopover(),H=F&&F.isA("sap.m.Popover"),J=E.relatedControlId&&sap.ui.getCore().byId(E.relatedControlId),N=J&&J.getFocusDomRef(),O=F&&N&&g(F.getDomRef(),N);if(H){if(O&&!i.getValueStateActiveState()){this._bPopupHasFocus=true;if(D.system.desktop&&j(F.getFocusDomRef(),N)||J.isA("sap.m.GroupHeaderListItem")){this.focus();}}else{if(this.getDOMValue()===this._sSelectedSuggViaKeyboard){this._sSelectedSuggViaKeyboard=null;}}}if(!O){I.prototype.onsapfocusleave.apply(this,arguments);}this.bValueHelpRequested=false;};A.prototype.onsaptabnext=function(){if(!this.isMobileDevice()&&this._sProposedItemText&&!this._bAfterOpenFinisihed){var i=this.getSuggestionItems().filter(function(E){return E.getText()===this._sProposedItemText;}.bind(this))[0];if(i){this.setSelectionItem(i,true);this.selectText(0,0);}}};A.prototype.onmousedown=function(E){if(this._isSuggestionsPopoverOpen()){E.stopPropagation();}};["onsapup","onsapdown","onsappageup","onsappagedown","onsaphome","onsapend"].forEach(function(N){A.prototype[N]=function(E){if((N==="onsapup"||N==="onsapdown")&&this.isComposingCharacter()){return;}if(this.getShowSuggestion()){this._getSuggestionsPopover().handleListNavigation(this,E);if(this._isIncrementalType()){E.setMarked();}this.setSelectionUpdatedFromList(true);}};});A.prototype.setSelectionUpdatedFromList=function(U){this._bSelectionUpdatedFromList=U;};A.prototype.getSelectionUpdatedFromList=function(){return this._bSelectionUpdatedFromList;};A.prototype.updateSelectionFromList=function(i){if(this._hasTabularSuggestions()&&(this.getSelectedRow()!==i)){this.setSelectionRow(i,true);}else{var N=o.getItemByListItem(this.getSuggestionItems(),i);N&&(this.getSelectedItem()!==N.getId())&&this.setSelectionItem(N,true);}this.setSelectionUpdatedFromList(false);};A.prototype._deregisterEvents=function(){this._deregisterPopupResize();if(this.isMobileDevice()&&this._getSuggestionsPopover()&&this._getSuggestionsPopover().getPopover()){this.$().off("click");}};A.prototype.updateSuggestionItems=function(){this._bSuspendInvalidate=true;this.updateAggregation("suggestionItems");this._synchronizeSuggestions();this._bSuspendInvalidate=false;return this;};A.prototype.invalidate=function(){if(!this._bSuspendInvalidate){I.prototype.invalidate.apply(this,arguments);}};A.prototype.cancelPendingSuggest=function(){if(this._iSuggestDelay){clearTimeout(this._iSuggestDelay);this._iSuggestDelay=null;}};A.prototype._triggerSuggest=function(V){var i=this._getSuggestionsPopover().getItemsContainer();this.cancelPendingSuggest();this._bShouldRefreshListItems=true;if(!V){V="";}if(V.length>=this.getStartSuggestion()){this._iSuggestDelay=setTimeout(function(){if(this._sPrevSuggValue!==V){this._bBindingUpdated=false;this.fireSuggest({suggestValue:V});if(!this._bBindingUpdated){this._refreshItemsDelayed();}this._sPrevSuggValue=V;}}.bind(this),300);}else if(this.isMobileDevice()){if(i instanceof T){i.addStyleClass("sapMInputSuggestionTableHidden");}else if(i&&i.destroyItems){i.destroyItems();}}else if(this._isSuggestionsPopoverOpen()){setTimeout(function(){var N=this.getDOMValue()||'';if(N.length<this.getStartSuggestion()){this._closeSuggestionPopup();}}.bind(this),0);}};A.prototype._shouldTriggerSuggest=function(){return!this._bPopupHasFocus&&!this.getStartSuggestion()&&!this.getValue()&&this.getShowSuggestion();};A.prototype.setShowTableSuggestionValueHelp=function(V){var i=this._getSuggestionsPopover();this.setProperty("showTableSuggestionValueHelp",V,true);if(!i.getPopover()){return this;}if(V){this._addShowMoreButton();}else{this._removeShowMoreButton();}return this;};A.prototype.onchange=function(E){if(this.getShowValueHelp()||this.getShowSuggestion()||this.getProperty("effectiveShowClearIcon")){return;}this.onChange(E);};A.prototype.oninput=function(E){I.prototype.oninput.call(this,E);if(E.isMarked("invalid")){return;}var V=this.getDOMValue(),i,F,H;if(this.getValueLiveUpdate()){this.setProperty("value",V,true);this._onValueUpdated(V);}this.fireLiveChange({value:V,newValue:V});this.addStyleClass("sapMFocus");if(this.getShowSuggestion()&&!this.isMobileDevice()){i=this._getSuggestionsPopover();F=i.getItemsContainer();this._triggerSuggest(V);if(F&&!i.getValueStateActiveState()){H=F&&F.getSelectedItem();F.removeStyleClass("sapMListFocus");H&&H.removeStyleClass("sapMLIBFocused");}else if(i.getValueStateActiveState()&&document.activeElement.tagName!=="A"){i._getValueStateHeader().removeStyleClass("sapMPseudoFocus");}}this._handleTypeAhead(this);};A.prototype.onkeydown=function(E){this._bDoTypeAhead=!D.os.android&&this.getAutocomplete()&&(E.which!==K.BACKSPACE)&&(E.which!==K.DELETE);};A.prototype.onkeyup=function(E){var V=this.getValue();var i=this.getLastValue();if([K.BACKSPACE,K.DELETE].indexOf(E.which)!==-1&&!V){this.setSelectedKey(null);(i!==V)&&this.setLastValue(i);}this.getShowClearIcon()&&this.setProperty("effectiveShowClearIcon",!!V);};A.prototype.getValue=function(){return this.getDomRef("inner")&&this._$input?this.getDOMValue():this.getProperty("value");};A.prototype._refreshItemsDelayed=function(){clearTimeout(this._iRefreshListTimeout);this._iRefreshListTimeout=setTimeout(this._refreshListItems.bind(this),0);};A.prototype._clearSuggestionPopupItems=function(){var i=this._getSuggestionsPopover().getItemsContainer();if(!i){return;}if(i instanceof T){i.removeSelections(true);}else{i.destroyItems();}};A.prototype._hideSuggestionPopup=function(){var i=this._getSuggestionsPopover(),E=i.getPopover(),F=i.getItemsContainer();if(!this.isMobileDevice()){if(this._isSuggestionsPopoverOpen()){this._sCloseTimer=setTimeout(function(){this.cancelPendingSuggest();if(this._getTypedInValue()){this.setDOMValue(this._getTypedInValue());}E.close();}.bind(this),0);}}else if(this._hasTabularSuggestions()&&F){F.addStyleClass("sapMInputSuggestionTableHidden");}this.$("SuggDescr").text("");this.$("inner").removeAttr("aria-activedescendant");};A.prototype._openSuggestionPopup=function(O){if(!this.isMobileDevice()){if(this._sCloseTimer){clearTimeout(this._sCloseTimer);this._sCloseTimer=null;}if(!this._isSuggestionsPopoverOpen()&&!this._sOpenTimer&&O!==false&&this.getShowSuggestion()){this._sOpenTimer=setTimeout(function(){this._sOpenTimer=null;this._getSuggestionsPopover()&&this._openSuggestionsPopover();}.bind(this),0);}}};A.prototype._applySuggestionAcc=function(N){var i="",E=this._oRb;setTimeout(function(){if(N===1){i=E.getText("INPUT_SUGGESTIONS_ONE_HIT");}else if(N>1){i=E.getText("INPUT_SUGGESTIONS_MORE_HITS",N);}else{i=E.getText("INPUT_SUGGESTIONS_NO_HIT");}this.$("SuggDescr").text(i);}.bind(this),0);};A.prototype._refreshListItems=function(){var i=this.getShowSuggestion(),E=this._bDoTypeAhead?this._getTypedInValue():(this.getDOMValue()||""),F,H;if(!i||!this._bShouldRefreshListItems||!this.getDomRef()||(!this.isMobileDevice()&&!this.$().hasClass("sapMInputFocused"))){return null;}this._clearSuggestionPopupItems();if(E.length<this.getStartSuggestion()){this._hideSuggestionPopup();return false;}F=this._getFilteredSuggestionItems(E);H=F.items.length;if(H>0){this._openSuggestionPopup(this.getValue().length>=this.getStartSuggestion());}else{this._hideSuggestionPopup();}this._applySuggestionAcc(H);};A.prototype.addSuggestionItem=function(i){this.addAggregation("suggestionItems",i,true);this._synchronizeSuggestions();this._createSuggestionPopupContent();return this;};A.prototype.insertSuggestionItem=function(i,E){this.insertAggregation("suggestionItems",E,i,true);this._synchronizeSuggestions();this._createSuggestionPopupContent();return this;};A.prototype.removeSuggestionItem=function(i){var E=this.removeAggregation("suggestionItems",i,true);this._synchronizeSuggestions();return E;};A.prototype.removeAllSuggestionItems=function(){var i=this.removeAllAggregation("suggestionItems",true);this._synchronizeSuggestions();return i;};A.prototype.destroySuggestionItems=function(){this.destroyAggregation("suggestionItems",true);this._synchronizeSuggestions();return this;};A.prototype.bindAggregation=function(){if(arguments[0]==="suggestionRows"||arguments[0]==="suggestionColumns"||arguments[0]==="suggestionItems"){this._createSuggestionPopupContent(arguments[0]==="suggestionRows"||arguments[0]==="suggestionColumns");this._bBindingUpdated=true;}return I.prototype.bindAggregation.apply(this,arguments);};A.prototype._closeSuggestionPopup=function(){this._bShouldRefreshListItems=false;this.cancelPendingSuggest();this._isSuggestionsPopoverOpen()&&this._getSuggestionsPopover().getPopover().close();if(!this.isMobileDevice()&&this.$().hasClass("sapMInputFocused")){this.openValueStateMessage();}this.$("SuggDescr").text("");this.$("inner").removeAttr("aria-activedescendant");this._sPrevSuggValue=null;};A.prototype._synchronizeSuggestions=function(){var i=this._getSuggestionsPopover(),E=i&&i.getInput(),F=E&&E.getFocusDomRef();if(document.activeElement===this.getFocusDomRef()||document.activeElement===F){this._bShouldRefreshListItems=true;this._refreshItemsDelayed();}if(!this.getDomRef()||this._isSuggestionsPopoverOpen()){return;}this._synchronizeSelection();};A.prototype._synchronizeSelection=function(){var i=this.getSelectedKey();if(!i){return;}if(this.getValue()&&!this.getSelectedItem()&&!this.getSelectedRow()){return;}this.setSelectedKey(i);};A.prototype.onfocusin=function(E){I.prototype.onfocusin.apply(this,arguments);this.addStyleClass("sapMInputFocused");if(!this.isMobileDevice()&&this._isSuggestionsPopoverOpen()){this.closeValueStateMessage();}if(this._shouldTriggerSuggest()){this._triggerSuggest(this.getValue());}this._bPopupHasFocus=undefined;this._sPrevSuggValue=null;};A.prototype.oncompositionend=function(E){I.prototype.oncompositionend.apply(this,arguments);if(!D.browser.firefox){this._handleTypeAhead(this);}};A.prototype._handleTypeAhead=function(i){var V=this.getValue();this._setTypedInValue(V);i._sProposedItemText=null;if(!this._bDoTypeAhead||V===""||V.length<this.getStartSuggestion()||document.activeElement!==this.getFocusDomRef()){return;}var H=i._hasTabularSuggestions(),E=H?i.getSuggestionRows():i.getSuggestionItems(),F=function(N){if(!N){return"";}return H?i._getRowResultFunction()(N):N.getText();};var J=t(V,this,E,function(N){return this._formatTypedAheadValue(F(N));}.bind(this));i._sProposedItemText=F(J[0]);};A.prototype._resetTypeAhead=function(i){i=i||this;i._sProposedItemText=null;this._setTypedInValue('');};A.prototype.onsapright=function(){var V=this.getValue();if(!this.getAutocomplete()){return;}if(this._getTypedInValue()!==V){this._setTypedInValue(V);this.fireLiveChange({value:V,newValue:V});}};A.prototype._formatTypedAheadValue=function(N){var i=this._getTypedInValue();if(N.toLowerCase().indexOf(i.toLowerCase())===0){return i.concat(N.substring(i.length,N.length));}else{return N;}};A.prototype.onsapshow=function(E){if(!this.getEnabled()||!this.getEditable()||!this.getShowValueHelp()){return;}this.bValueHelpRequested=true;this._fireValueHelpRequest(false);E.preventDefault();E.stopPropagation();};A.prototype.onsaphide=A.prototype.onsapshow;A.prototype.onsapselect=function(E){this._fireValueHelpRequestForValueHelpOnly();};A.prototype.onfocusout=function(E){I.prototype.onfocusout.apply(this,arguments);this.removeStyleClass("sapMInputFocused");this.$("SuggDescr").text("");};A.prototype._hasTabularSuggestions=function(){return!!(this.getAggregation("suggestionColumns")&&this.getAggregation("suggestionColumns").length);};A.prototype._getSuggestionsTable=function(){if(this._bIsBeingDestroyed){return null;}if(!this._oSuggestionsTable){this._oSuggestionsTable=this._createSuggestionsTable();}return this._oSuggestionsTable;};A.prototype._destroySuggestionsTable=function(){if(this._oSuggestionsTable){this._oSuggestionsTable.destroy();this._oSuggestionsTable=null;}};A.prototype._createSuggestionsTable=function(){var i;var E=new T(this.getId()+"-popup-table",{mode:y.SingleSelectMaster,showNoData:false,showSeparators:z.None,width:"100%",enableBusyIndicator:false,rememberSelections:false,itemPress:function(F){if(D.system.desktop){this.focus();}var H=F.getParameter("listItem");this.setSelectionRow(H,true);}.bind(this),sticky:[l.Sticky.ColumnHeaders]});E.addEventDelegate({onAfterRendering:function(){var F;if(!this.getEnableSuggestionsHighlighting()){return;}F=E.$().find('tbody .sapMLabel');m(F,this._getTypedInValue());}},this);if(this.isMobileDevice()){E.addStyleClass("sapMInputSuggestionTableHidden");}E.updateItems=function(){T.prototype.updateItems.apply(this,arguments);this._refreshItemsDelayed();return this;};i=new r(function(F){var H=F.mutation;var J=F.child;var N=F.name==="items";switch(H){case"insert":if(N){J.setType(u.Active);this._createSuggestionPopupContent(true);this._synchronizeSuggestions();}break;case"remove":if(N){this._synchronizeSuggestions();}break;default:break;}}.bind(this));i.observe(E,{aggregations:["items","columns"]});return E;};A.prototype.clone=function(){var i=I.prototype.clone.apply(this,arguments);i.setRowResultFunction(this._fnRowResultFilter);i.setValue(this.getValue());return i;};A.prototype.setValue=function(V){this._iSetCount++;I.prototype.setValue.call(this,V);this._onValueUpdated(V);this._setTypedInValue("");this.setProperty("effectiveShowClearIcon",!!V);return this;};A.prototype.setDOMValue=function(i){this._$input.val(i);};A.prototype.getDOMValue=function(){return this._$input.val();};A.prototype._getInputValue=function(){var V=I.prototype._getInputValue.apply(this,arguments);if(this.getMaxLength()>0){V=V.substring(0,this.getMaxLength());}return V;};A.prototype.setMaxLength=function(i){i=this.validateProperty("maxLength",i);this.setProperty("maxLength",i);this.updateDomValue(this.getProperty("value"));return this;};A.prototype.updateInputField=function(N){if(this._isSuggestionsPopoverOpen()&&this.isMobileDevice()){this._getSuggestionsPopover().getInput().setValue(N)._doSelect();}else{N=this._getInputValue(N);this.setDOMValue(N);this.onChange(null,null,N);}};A.prototype.getAccessibilityInfo=function(){var i=I.prototype.getAccessibilityInfo.apply(this,arguments);i.description=((i.description||"")+" "+this.getDescription()).trim();return i;};A.prototype.preventChangeOnFocusLeave=function(E){return this.bFocusoutDueRendering||this.bValueHelpRequested;};A.prototype._getShowMoreButton=function(){return this._getSuggestionsPopover().getShowMoreButton();};A.prototype._getShowMoreButtonPress=function(){var i,E=this._getTypedInValue();if(this.getShowTableSuggestionValueHelp()){if(E){i=E;this.updateDomValue(i);this._resetTypeAhead();this._setTypedInValue(i);}this._fireValueHelpRequest(true);this._closeSuggestionPopup();}};A.prototype._addShowMoreButton=function(){var i=this._getSuggestionsPopover();var E=i&&i.getPopover();if(!E||!this._hasTabularSuggestions()||this._getShowMoreButton()){return;}var F=new B({text:this._oRb.getText("INPUT_SUGGESTIONS_SHOW_ALL"),press:this._getShowMoreButtonPress.bind(this)});if(E.isA("sap.m.Dialog")){i.setShowMoreButton(F);}else{i.setShowMoreButton(new e({content:[new f(),F]}));}};A.prototype._removeShowMoreButton=function(){var i=this._getSuggestionsPopover();var E=i&&i.getPopover();if(E&&this._hasTabularSuggestions()&&this._getShowMoreButton()){i.removeShowMoreButton();}};A.prototype._hasShowSelectedButton=function(){return false;};A.prototype._createSuggestionPopupContent=function(i){var E=this._getSuggestionsPopover();var F=E.getItemsContainer();if(F&&((F.isA("sap.m.Table")&&!i)||(F.isA("sap.m.List")&&i))){F.destroy();F=null;this._destroySuggestionsTable();}if(this._bIsBeingDestroyed||!E||F){return;}E.initContent(this.getId(),i?this._getSuggestionsTable():null);if(!this._hasTabularSuggestions()&&!i){this._decorateSuggestionsPopoverList(E.getItemsContainer());}else{this._decorateSuggestionsPopoverTable();}};A.prototype._decorateSuggestionsPopoverList=function(i){if(!i||!i.isA("sap.m.List")){return;}i.addEventDelegate({onAfterRendering:function(){var E,F;if(!this.getEnableSuggestionsHighlighting()){return;}E=i.$().find('.sapMSLIInfo, .sapMSLITitleOnly');F=this._bDoTypeAhead?this._getTypedInValue():this.getValue();F=(F||"").toLowerCase();m(E,F);}},this);i.attachItemPress(function(E){if(D.system.desktop){this.focus();}var F=E.getParameter("listItem");if(!F.isA("sap.m.GroupHeaderListItem")){this.setSelectionItem(o.getItemByListItem(this.getSuggestionItems(),F),true);}},this);};A.prototype._decorateSuggestionsPopoverTable=function(){if(this.getShowTableSuggestionValueHelp()){this._addShowMoreButton();}};A.prototype._decoratePopupInput=function(i){if(!i){return;}i.setValueLiveUpdate(true);i.setValueState(this.getValueState());i.setShowValueHelp(this.getShowValueHelp());i.attachValueHelpRequest(function(){this.fireValueHelpRequest({fromSuggestions:true});this._getSuggestionsPopover().iPopupListSelectedIndex=-1;this._closeSuggestionPopup();}.bind(this));i.attachLiveChange(function(E){var V=E.getParameter("newValue");this.setDOMValue(this._getInputValue(this._getSuggestionsPopover().getInput().getValue()));this._triggerSuggest(V);this.fireLiveChange({value:V,newValue:V});}.bind(this));i._handleTypeAhead=function(){A.prototype._handleTypeAhead.call(i,this);}.bind(this);i._resetTypeAhead=function(){A.prototype._resetTypeAhead.call(i,this);}.bind(this);i.addEventDelegate({onsapenter:function(){this.setValue(this._sProposedItemText);}},this);return i;};A.prototype.forwardEventHandlersToSuggPopover=function(i){i.setOkPressHandler(this._closeSuggestionPopup.bind(this));i.setCancelPressHandler(this._closeSuggestionPopup.bind(this));};A.prototype._getSuggestionsPopover=function(){return this._oSuggPopover;};A.prototype._createSuggestionsPopover=function(){var i=this._oSuggPopover=new d(this);i.decorateParent(this);i.setInputLabels(this.getLabels.bind(this));this._createSuggestionsPopoverPopup();this.forwardEventHandlersToSuggPopover(i);i.attachEvent(d.M_EVENTS.SELECTION_CHANGE,function(E){var F=E.getParameter("newItem"),N=this.calculateNewValue(F),H=F&&F.isA("sap.m.GroupHeaderListItem"),J=this.getFocusDomRef(),O=J&&J.value.substring(0,J.selectionStart),U=E.getParameter("previousItem"),V=U&&U.isA("sap.m.GroupHeaderListItem"),W=p(s(J,V),N,O,V);if(!F||H){this.setDOMValue(O);}else{this.setDOMValue(N);W=(W===0&&N.indexOf(O)===0)?O.length:W;this._doSelect(W);}this._sSelectedSuggViaKeyboard=N;},this);if(this.getShowTableSuggestionValueHelp()){this._addShowMoreButton();}return this._oSuggPopover;};A.prototype.calculateNewValue=function(i){if(!i||(i&&i.isA("sap.m.GroupHeaderListItem"))){return"";}if(i.isA("sap.m.ColumnListItem")){return this._getInputValue(this._getRowResultFunction()(i));}if(i.isA("sap.m.StandardListItem")){return this._getInputValue(i.getTitle());}};A.prototype._createSuggestionsPopoverPopup=function(){var i=this._getSuggestionsPopover();var E;i.createSuggestionPopup(this,{showSelectedButton:this._hasShowSelectedButton()});this._decoratePopupInput(i.getInput());E=i.getPopover();E.attachBeforeOpen(function(){this._updateSuggestionsPopoverValueState();},this);E.attachBeforeClose(function(){this._updateSuggestionsPopoverValueState();},this);if(this.isMobileDevice()){E.attachBeforeClose(function(){this.setDOMValue(this._getInputValue(i.getInput().getValue()));this.onChange();},this).attachAfterClose(function(){var F=i.getItemsContainer();if(!F){return;}if(T&&!(F instanceof T)){F.destroyItems();}else{F.removeSelections(true);}}).attachAfterOpen(function(){this._triggerSuggest(this.getValue());this._refreshListItems();},this).attachBeforeOpen(function(){var F=i.getInput();["placeholder","maxLength","value","showClearIcon","effectiveShowClearIcon"].forEach(function(H){F.setProperty(H,this.getProperty(H));},this);},this);}else{E.attachAfterClose(function(){var F=this._getSuggestionsPopover().getItemsContainer();var H=F&&F.getSelectedItem();var J=this.getDomRef();if(this.getSelectionUpdatedFromList()){this.updateSelectionFromList(H);}if(!F){return;}this._bAfterOpenFinisihed=false;if(F instanceof T){H&&H.removeStyleClass("sapMLIBFocused");F.removeSelections(true);}else{F.destroyItems();}this._deregisterPopupResize();if(J&&J.contains(document.activeElement)){this.addStyleClass("sapMFocus");}},this).attachBeforeOpen(function(){i._sPopoverContentWidth=this.getMaxSuggestionWidth();i.resizePopup(this);this._registerPopupResize();this._bAfterOpenFinisihed=false;},this).attachAfterOpen(function(){this._bAfterOpenFinisihed=true;},this);}this.setAggregation("_suggestionPopup",E);this._oSuggestionPopup=E;};A.prototype._registerPopupResize=function(){var i=this._getSuggestionsPopover();this._sPopupResizeHandler=R.register(this,i.resizePopup.bind(i,this));};A.prototype._deregisterPopupResize=function(){if(this._sPopupResizeHandler){this._sPopupResizeHandler=R.deregister(this._sPopupResizeHandler);}};A.prototype.showItems=function(F){var i,E,H=this._getFilterFunction();if(!this.getEnabled()||!this.getEditable()){return;}this.setFilterFunction(F||function(){return true;});this._clearSuggestionPopupItems();i=this._getFilteredSuggestionItems(this.getDOMValue());E=i.items.length;if(E>0){this._openSuggestionPopup();}else{this._hideSuggestionPopup();}this._applySuggestionAcc(E);this.setFilterFunction(H);};A.prototype.shouldValueStateMessageBeOpened=function(){var i=I.prototype.shouldValueStateMessageBeOpened.apply(this,arguments);if(!i||this._isSuggestionsPopoverOpen()){return false;}return true;};A.prototype._isSuggestionsPopoverOpen=function(){return this._getSuggestionsPopover()&&this._getSuggestionsPopover().isOpen();};A.prototype.isMobileDevice=function(){return D.system.phone;};A.prototype._openSuggestionsPopover=function(){this.closeValueStateMessage();this._updateSuggestionsPopoverValueState();this._getSuggestionsPopover().getPopover().open();};A.prototype._updateSuggestionsPopoverValueState=function(){var i=this._getSuggestionsPopover(),V=this.getValueState(),N=this.getValueState()!==i._getValueStateHeader().getValueState(),E=this.getFormattedValueStateText(),F=this.getValueStateText();if(!i){return;}if(this._isSuggestionsPopoverOpen()&&!E&&!N){this.setFormattedValueStateText(i._getValueStateHeader().getFormattedText());}i.updateValueState(V,(E||F),this.getShowValueStateMessage());if(this.isMobileDevice()){i.getInput().setValueState(V);}};A.prototype.setShowValueHelp=function(i){var E=this._getSuggestionsPopover()&&this._getSuggestionsPopover().getInput();this.setProperty("showValueHelp",i);if(E){E.setShowValueHelp(i);}return this;};A.prototype.isValueHelpOnlyOpener=function(i){return true;};A.prototype._getFilteredSuggestionItems=function(V){var F,i=this._getSuggestionsPopover().getItemsContainer();if(this._hasTabularSuggestions()){if(this.isMobileDevice()&&i){i.removeStyleClass("sapMInputSuggestionTableHidden");}F=this.filterTabularItems(this.getSuggestionRows(),V);}else{F=n(this,this.getSuggestionItems(),V,this.getFilterSuggests(),true,this._getFilterFunction());this._mapItems(F);}return F;};A.prototype.filterTabularItems=function(i,V){var E,F=this.getFilterSuggests(),H=[],J=[],N=false,O=this._getFilterFunction();i.forEach(function(U){if(U.isA("sap.m.GroupHeaderListItem")){J.push({header:U,visible:false});}else{E=!F||O(V,U);U.setVisible(E);E&&H.push(U);if(!N&&E&&this._sProposedItemText===this._getRowResultFunction()(U)){U.setSelected(true);N=true;}if(J.length&&E){J[J.length-1].visible=true;}}},this);J.forEach(function(U){U.header.setVisible(U.visible);});this._getSuggestionsTable().invalidate();return{items:H,groups:J};};A.prototype._mapItems=function(F){var i=this.getSuggestionItems(),E=F.items,H=F.groups,J=H.map(function(W){return W.header;}),N=false,O=this._getSuggestionsPopover().getItemsContainer(),U,V;i.filter(function(W){return(E.indexOf(W)>-1)||(J.indexOf(W)>-1);}).map(function(W){U=o.createListItemFromCoreItem(W,true);O.addItem(U);if(!N&&this._sProposedItemText===W.getText()){U.setSelected(true);N=true;}return W;},this).filter(function(W){return J.indexOf(W)>-1;}).forEach(function(W){V=J.indexOf(W);if(V>-1){U=o.getListItem(W);U&&U.setVisible(H[V].visible);}});};A.prototype._setTypedInValue=function(V){this._sTypedInValue=V;return this;};A.prototype._getTypedInValue=function(){return this._sTypedInValue;};return A;});
