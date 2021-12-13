/*!
 * OpenUI5
 * (c) Copyright 2009-2021 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(["sap/ui/core/Icon","./Input","./InputBase","./InputRenderer","sap/ui/core/Control","sap/ui/core/IconPool","sap/ui/core/LabelEnablement","sap/ui/core/message/MessageMixin","sap/ui/model/ValidateException","sap/ui/Device","sap/ui/core/library","sap/ui/core/Renderer","sap/m/library","./StepInputRenderer","sap/ui/events/KeyCodes","sap/base/Log"],function(I,a,b,c,C,d,L,M,V,D,f,R,l,S,K,g){"use strict";var h=l.InputType;var T=f.TextAlign;var j=f.ValueState;var k=l.StepInputValidationMode;var m=l.StepInputStepModeType;var n=C.extend("sap.m.StepInput",{metadata:{interfaces:["sap.ui.core.IFormContent"],library:"sap.m",designtime:"sap/m/designtime/StepInput.designtime",properties:{min:{type:"float",group:"Data"},max:{type:"float",group:"Data"},step:{type:"float",group:"Data",defaultValue:1},stepMode:{type:"sap.m.StepInputStepModeType",group:"Data",defaultValue:m.AdditionAndSubtraction},largerStep:{type:"float",group:"Data",defaultValue:2},value:{type:"float",group:"Data",defaultValue:0},name:{type:"string",group:"Misc",defaultValue:null},placeholder:{type:"string",group:"Misc",defaultValue:null},required:{type:"boolean",group:"Misc",defaultValue:false},width:{type:"sap.ui.core.CSSSize",group:"Dimension"},valueState:{type:"sap.ui.core.ValueState",group:"Data",defaultValue:j.None},valueStateText:{type:"string",group:"Misc",defaultValue:null},editable:{type:"boolean",group:"Behavior",defaultValue:true},enabled:{type:"boolean",group:"Behavior",defaultValue:true},displayValuePrecision:{type:"int",group:"Data",defaultValue:0},description:{type:"string",group:"Misc",defaultValue:null},fieldWidth:{type:"sap.ui.core.CSSSize",group:"Appearance",defaultValue:'50%'},textAlign:{type:"sap.ui.core.TextAlign",group:"Appearance",defaultValue:T.End},validationMode:{type:"sap.m.StepInputValidationMode",group:"Misc",defaultValue:k.FocusOut}},aggregations:{_input:{type:"sap.ui.core.Control",multiple:false,visibility:"hidden"}},associations:{ariaLabelledBy:{type:"sap.ui.core.Control",multiple:true,singularName:"ariaLabelledBy"},ariaDescribedBy:{type:"sap.ui.core.Control",multiple:true,singularName:"ariaDescribedBy"}},events:{change:{parameters:{value:{type:"string"}}}},dnd:{draggable:false,droppable:true}},constructor:function(i,s){C.prototype.constructor.apply(this,arguments);if(this.getEditable()){this._getOrCreateDecrementButton();this._getOrCreateIncrementButton();}if(typeof i!=="string"){s=i;}if(s&&s.value===undefined){this.setValue(this._getDefaultValue(undefined,s.max,s.min));}}});var o=sap.ui.getCore().getLibraryResourceBundle("sap.m");n.STEP_INPUT_INCREASE_BTN_TOOLTIP=o.getText("STEP_INPUT_INCREASE_BTN");n.STEP_INPUT_DECREASE_BTN_TOOLTIP=o.getText("STEP_INPUT_DECREASE_BTN");n.INITIAL_WAIT_TIMEOUT=500;n.ACCELLERATION=0.8;n.MIN_WAIT_TIMEOUT=50;n.INITIAL_SPEED=120;n._TOLERANCE=10;var F=["enabled","editable","name","placeholder","required","valueStateText","description","fieldWidth","textAlign"];var N=R.extend(c);N.apiVersion=2;N.writeInnerAttributes=function(r,e){var s=e.getParent(),A=this.getAccessibilityState(e);r.attr("type",e.getType().toLowerCase());if(sap.ui.getCore().getConfiguration().getRTL()){r.attr("dir","ltr");}A.disabled=null;r.accessibilityState(s,A);};N.getAccessibilityState=function(e){var A=c.getAccessibilityState(e),s=e.getParent(),i=s._getMin(),r=s._getMax(),t=s.getValue(),u=s.getDescription(),v=s.getAriaLabelledBy(),w=L.getReferencingLabels(s),x=s.getAriaDescribedBy().join(" "),y;A.valuenow=t;if(u){v.push(s._getInput().getId()+"-descr");}y=w.concat(v).join(" ");if(typeof i==="number"){A.valuemin=i;}if(typeof r==="number"){A.valuemax=r;}if(!s.getEditable()){A.readonly=true;}if(x){A.describedby=x;}if(y){A.labelledby=y;}return A;};var p=a.extend("sap.m.internal.NumericInput",{metadata:{library:"sap.m"},constructor:function(i,s){return a.apply(this,arguments);},renderer:N});p.prototype.onBeforeRendering=function(){b.prototype.onBeforeRendering.call(this);this.setWidth("100%");this._deregisterEvents();};p.prototype.setValue=function(v){a.prototype.setValue.apply(this,arguments);if(this.getDomRef()){this.getDomRef("inner").setAttribute("aria-valuenow",v);}return this;};M.call(n.prototype);n.prototype.init=function(){this._iRealPrecision=0;this._attachChange();this._bPaste=false;this._bNeedsVerification=false;this._bValueStatePreset=true;this._onmousewheel=this._onmousewheel.bind(this);window.addEventListener("contextmenu",function(e){if(this._btndown===false&&e.target.className.indexOf("sapMInputBaseIconContainer")!==-1){e.preventDefault();}}.bind(this));};n.prototype.onBeforeRendering=function(){var e=this._getMin(),i=this._getMax(),v=this._sOriginalValue||this.getValue(),E=this.getEditable();this._iRealPrecision=this._getRealValuePrecision();this._getInput().setValue(this._getFormattedValue(v));this._getInput().setValueState(this.getValueState());this._getInput().setTooltip(this.getTooltip());this._getOrCreateDecrementButton().setVisible(E);this._getOrCreateIncrementButton().setVisible(E);this._disableButtons(v,i,e);this.$().off(D.browser.firefox?"DOMMouseScroll":"mousewheel",this._onmousewheel);if(this._bNeedsVerification&&!this._bValueStatePreset){this._verifyValue();this._bNeedsVerification=false;}};n.prototype.onAfterRendering=function(){this.$().on(D.browser.firefox?"DOMMouseScroll":"mousewheel",this._onmousewheel);};n.prototype.exit=function(){this.$().off(D.browser.firefox?"DOMMouseScroll":"mousewheel",this._onmousewheel);this._sOriginalValue=null;};n.prototype.setProperty=function(P,v,s){C.prototype.setProperty.call(this,P,v,s);if(F.indexOf(P)>-1){this._getInput().setProperty(P,this.getProperty(P),s);}return this;};n.prototype.setValidationMode=function(v){if(this.getValidationMode()!==v){switch(v){case k.FocusOut:this._detachLiveChange();break;case k.LiveChange:this._attachLiveChange();break;}this.setProperty("validationMode",v);}return this;};n.prototype.setMin=function(e){if(e!==undefined&&!this._validateOptionalNumberProperty("min",e)){return this;}return this.setProperty("min",e);};n.prototype.setMax=function(e){if(e!==undefined&&!this._validateOptionalNumberProperty("max",e)){return this;}return this.setProperty("max",e);};n.prototype._validateOptionalNumberProperty=function(e,v){if(this._isNumericLike(v)){return true;}g.error("The value of property '"+e+"' must be a number");return false;};n.prototype.setDisplayValuePrecision=function(e){var v;if(q(e)){v=parseInt(e);}else{v=0;g.warning(this+": ValuePrecision ("+e+") is not correct. It should be a number between 0 and 20! Setting the default ValuePrecision:0.");}return this.setProperty("displayValuePrecision",v);};n.prototype._getIncrementButton=function(){var e=this._getInput().getAggregation("_endIcon")||[];var i=null;if(e.length){i=e[e.length-1];}return i;};n.prototype._getDecrementButton=function(){var e=this._getInput().getAggregation("_beginIcon");return e?e[0]:null;};n.prototype._createIncrementButton=function(){var i=this._getInput().addEndIcon({src:d.getIconURI("add"),id:this.getId()+"-incrementBtn",noTabStop:true,decorative:false,press:this._handleButtonPress.bind(this,1),tooltip:n.STEP_INPUT_INCREASE_BTN_TOOLTIP});i.getEnabled=function(){return!this._shouldDisableIncrementButton(Number(this._getInput().getValue()),this._getMax());}.bind(this);i.$().attr("tabindex","-1");this._attachEvents(i,true);i.addEventDelegate({onAfterRendering:function(){i.$().attr("tabindex","-1");}});return i;};n.prototype._createDecrementButton=function(){var i=this._getInput().addBeginIcon({src:d.getIconURI("less"),id:this.getId()+"-decrementBtn",noTabStop:true,decorative:false,press:this._handleButtonPress.bind(this,-1),tooltip:n.STEP_INPUT_DECREASE_BTN_TOOLTIP});i.getEnabled=function(){return!this._shouldDisableDecrementButton(Number(this._getInput().getValue()),this._getMin());}.bind(this);i.$().attr("tabindex","-1");this._attachEvents(i,false);i.addEventDelegate({onAfterRendering:function(){i.$().attr("tabindex","-1");}});return i;};n.prototype._getInput=function(){if(!this.getAggregation("_input")){var e=new p({id:this.getId()+"-input",textAlign:this.getTextAlign(),type:h.Number,editable:this.getEditable(),enabled:this.getEnabled(),description:this.getDescription(),fieldWidth:this.getFieldWidth(),liveChange:this._inputLiveChangeHandler});this.setAggregation("_input",e);}return this.getAggregation("_input");};n.prototype._changeValue=function(e){if((this._fTempValue!=this._fOldValue)||e){this.setValue(this._fTempValue);this.fireChange({value:this._fTempValue});}else{this._applyValue(this._fTempValue);this._disableButtons(Number(this._getInput().getValue()),this._getMax(),this._getMin());}return this;};n.prototype._handleButtonPress=function(e){if(!this._bSpinStarted){this._bDelayedEventFire=false;this._changeValueWithStep(e);this._btndown=false;this._changeValue();}else{this._bSpinStarted=false;}this._bNeedsVerification=true;return this;};n.prototype._changeValueWithStep=function(e){var i,r;if(isNaN(this._fTempValue)||this._fTempValue===undefined){this._fTempValue=this.getValue();}r=this._checkInputValue();this._fTempValue+=r;i=e!==0?this._calculateNewValue(e):this._fTempValue;if(e!==0||r!==0||this._bDelayedEventFire){this._fTempValue=i;}if(this._bDelayedEventFire){this._applyValue(i);this._disableButtons(Number(this._getFormattedValue(i)),this._getMax(),this._getMin());this._bNeedsVerification=true;}return this;};n.prototype._disableButtons=function(v,i,e){if(!this._isNumericLike(v)){return;}var r=this._getIncrementButton(),s=this._getDecrementButton(),t=this._shouldDisableDecrementButton(v,e),u=this._shouldDisableIncrementButton(v,i);s&&s.toggleStyleClass("sapMStepInputIconDisabled",t);r&&r.toggleStyleClass("sapMStepInputIconDisabled",u);return this;};n.prototype._shouldDisableDecrementButton=function(v,i){var e=this._isNumericLike(i),E=this.getEnabled(),r=e&&i>=v;return E?r:true;};n.prototype._shouldDisableIncrementButton=function(v,i){var e=this._isNumericLike(i),E=this.getEnabled(),r=e&&i<=v;return E?r:true;};n.prototype._verifyValue=function(){var e=this._getMin(),i=this._getMax(),v=parseFloat(this._getInput().getValue()),r=sap.ui.getCore().getLibraryResourceBundle("sap.ui.core"),B=this.getBinding("value"),s=B&&B.getType&&B.getType(),t=s&&s.oConstraints&&s.oConstraints.maximum,u=s&&s.oConstraints&&s.oConstraints.minimum,w,x=[],H=false,E;if(!this._isNumericLike(v)){return;}E=this;do{H=E.hasListeners("validationError");E=E.getEventingParent();}while(E&&!H);if(this._isMoreThanMax(v)){if(H&&t){return;}w=r.getText("EnterNumberMax",[i]);x.push("maximum");}else if(this._isLessThanMin(v)){if(H&&u){return;}w=r.getText("EnterNumberMin",[e]);x.push("minimum");}else if(this._areFoldChangeRequirementsFulfilled()&&(v%this.getStep()!==0)){w=r.getText("Float.Invalid");}if(w){this.setProperty("valueState",j.Error,true);this._getInput().setValueState(j.Error);this._getInput().setValueStateText(w);if(H){this.fireValidationError({element:this,exception:new V(w,x),id:this.getId(),message:w,property:"value"});}}else{this.setProperty("valueState",j.None,true);this._getInput().setValueState(j.None);}};n.prototype.setValueState=function(v){this._bValueStatePreset=true;this.setProperty("valueState",v);this._getInput().setValueState(v);return this;};n.prototype.setValue=function(v){var r;if(isNaN(v)||v===null){v=this._getDefaultValue(undefined,this._getMax(),this._getMin());}else{v=Number(v);}if(!this._validateOptionalNumberProperty("value",v)){return this;}this._sOriginalValue=v;this._applyValue(v);this._disableButtons(Number(this._getInput().getValue()),this._getMax(),this._getMin());if(v!==this._fOldValue){this._fOldValue=v;r=this.setProperty("value",v);}else{r=this;}this._iRealPrecision=this._getRealValuePrecision();this._fTempValue=v;this._bValueStatePreset=false;return r;};n.prototype._getFormattedValue=function(v){var P=this.getDisplayValuePrecision(),i,s;if(v==undefined){v=this.getValue();}if(P<=0){return parseFloat(v).toFixed(0);}s=v.toString().split(".");if(s.length===2){i=s[1].length;if(i>P){return parseFloat(v).toFixed(P);}return s[0]+"."+this._padZeroesRight(s[1],P);}else{return v.toString()+"."+this._padZeroesRight("0",P);}};n.prototype._padZeroesRight=function(v,e){var r="",s=v.length;for(var i=s;i<e;i++){r=r+"0";}r=v+r;return r;};n.prototype._checkInputValue=function(){var i=this._getInput().getValue(),e=0;if(i===""){i=this._getDefaultValue(i,this._getMax(),this._getMin()).toString();}if(this.getDisplayValuePrecision()===0){i=Math.round(Number(i.toLowerCase().split('e')[0])).toString();}if(this._getFormattedValue(this._fTempValue)!==i){e=Number(i)-this._fTempValue;}return e;};n.prototype.onsappageup=function(e){e.preventDefault();if(this.getEditable()){this._bDelayedEventFire=true;this._changeValueWithStep(this.getLargerStep());}};n.prototype.onsappagedown=function(e){e.preventDefault();if(this.getEditable()){this._bDelayedEventFire=true;this._changeValueWithStep(-this.getLargerStep());}};n.prototype.onsappageupmodifiers=function(e){if(this.getEditable()&&this._isNumericLike(this._getMax())&&!(e.ctrlKey||e.metaKey||e.altKey)&&e.shiftKey){this._bDelayedEventFire=true;this._fTempValue=Number(this._getInput().getValue());this._changeValueWithStep(this._getMax()-this._fTempValue);}};n.prototype.onsappagedownmodifiers=function(e){if(this.getEditable()&&this._isNumericLike(this._getMin())&&!(e.ctrlKey||e.metaKey||e.altKey)&&e.shiftKey){this._bDelayedEventFire=true;this._fTempValue=Number(this._getInput().getValue());this._changeValueWithStep(-(this._fTempValue-this._getMin()));}};n.prototype.onsapup=function(e){e.preventDefault();if(this.getEditable()){this._bDelayedEventFire=true;this._changeValueWithStep(1);e.setMarked();}};n.prototype.onsapdown=function(e){e.preventDefault();if(this.getEditable()){this._bDelayedEventFire=true;this._changeValueWithStep(-1);e.setMarked();}};n.prototype._onmousewheel=function(e){var i=this.getDomRef().contains(document.activeElement);if(i&&this.getEditable()&&this.getEnabled()){e.preventDefault();var O=e.originalEvent,r=O.detail?(-O.detail>0):(O.wheelDelta>0);this._bDelayedEventFire=true;this._changeValueWithStep((r?1:-1));}};n.prototype.onkeydown=function(e){var s,i,r;if(!this.getEditable()){return;}if(e.which===K.ENTER&&this._fTempValue!==this.getValue()){e.preventDefault();this._changeValue();return;}this._bPaste=(e.ctrlKey||e.metaKey)&&(e.which===K.V);if(e.which===K.ARROW_UP&&!e.altKey&&e.shiftKey&&(e.ctrlKey||e.metaKey)){i=this._getMax();this._fTempValue=Number(this._getInput().getValue());s=(i!==undefined)?i-this._fTempValue:0;}else if(e.which===K.ARROW_DOWN&&!e.altKey&&e.shiftKey&&(e.ctrlKey||e.metaKey)){r=this._getMin();this._fTempValue=Number(this._getInput().getValue());s=(r!==undefined)?-(this._fTempValue-r):0;}else if(e.which===K.ARROW_UP&&!(e.ctrlKey||e.metaKey||e.altKey)&&e.shiftKey){s=this.getLargerStep();}else if(e.which===K.ARROW_DOWN&&!(e.ctrlKey||e.metaKey||e.altKey)&&e.shiftKey){s=-this.getLargerStep();}else if(e.which===K.ARROW_UP&&(e.ctrlKey||e.metaKey)){s=1;}else if(e.which===K.ARROW_DOWN&&(e.ctrlKey||e.metaKey)){s=-1;}else if(e.which===K.ARROW_UP&&e.altKey){s=1;}else if(e.which===K.ARROW_DOWN&&e.altKey){s=-1;}if(s!==undefined){e.preventDefault();if(s!==0){this._bDelayedEventFire=true;this._changeValueWithStep(s);}}};n.prototype.onsapescape=function(e){if(this._fOldValue!==this._fTempValue){this._applyValue(this._fOldValue);this._bNeedsVerification=true;}};n.prototype._attachLiveChange=function(){this._getInput().attachLiveChange(this._liveChange,this);};n.prototype._detachLiveChange=function(){this._getInput().detachLiveChange(this._liveChange,this);};n.prototype._attachChange=function(){this._getInput().attachChange(this._change,this);};n.prototype._liveChange=function(){this._disableButtons(Number(this._getInput().getValue()),this._getMax(),this._getMin());this._verifyValue();};n.prototype._change=function(e){var O;var i=this._getInput().getValue();var r=this._isLessThanMin(i)||this._isMoreThanMax(i);if(!this._isButtonFocused()){if(!this._btndown||r){O=Number(this._getFormattedValue());if(this._fOldValue===undefined){this._fOldValue=O;}this._bDelayedEventFire=false;this._changeValueWithStep(0);this._changeValue();this._bNeedsVerification=true;}else{this._fTempValue=Number(this._getInput().getValue());}}};n.prototype._isMoreThanMax=function(v){return this._isNumericLike(this._getMax())&&this._getMax()<v;};n.prototype._isLessThanMin=function(v){return this._isNumericLike(this._getMin())&&this._getMin()>v;};n.prototype._applyValue=function(e){this._getInput().setValue(this._getFormattedValue(e));};n.prototype._calculateNewValue=function(s,i){if(i===undefined){i=s<0?false:true;}var e=this.getStep(),r=this._getMax(),t=this._getMin(),u=parseFloat(this._getDefaultValue(this._getInput().getValue(),r,t)),v=i?1:-1,w=Math.abs(e)*Math.abs(s),x=u+v*w,y;if(this._areFoldChangeRequirementsFulfilled()){x=y=this._calculateClosestFoldValue(u,w,v);}else{y=this._sumValues(this._fTempValue,w,v,this._iRealPrecision);}if(this._isNumericLike(r)&&x>=r){y=r;}if(this._isNumericLike(t)&&x<=t){y=t;}return y;};n.prototype._getRealValuePrecision=function(){var s=this.getValue().toString().split("."),e=this.getStep().toString().split("."),i,r;i=(!s[1])?0:s[1].length;r=(!e[1])?0:e[1].length;return(i>r)?i:r;};n.prototype._getOrCreateDecrementButton=function(){return this._getDecrementButton()||this._createDecrementButton();};n.prototype._getOrCreateIncrementButton=function(){return this._getIncrementButton()||this._createIncrementButton();};n.prototype._inputLiveChangeHandler=function(e){var v=this.getParent()._restrictCharsWhenDecimal(e);this.setProperty("value",v?v:e.getParameter("newValue"),true);};n.prototype._restrictCharsWhenDecimal=function(e){var i=e.getParameter("value").indexOf("."),r=this.getDisplayValuePrecision(),E=e.getParameter("value"),v;if(i>0&&r>=0){var s=E.split('.')[1],t=s?s.length:0,u=E.split('.')[0],w=r>0?E.substring(E.indexOf('.')+1,E.length):'';if(!this._bPaste){if(t>r){v=u+(r>0?"."+w.substr(0,r):'');this._showWrongValueVisualEffect();}}else{if(E.indexOf(".")){v=E.split('.')[0]+(r>0?"."+s.substring(0,r):'');}this._bPaste=false;}}else{v=E;}if(this._getInput()._getInputValue()!==v){this._getInput().updateDomValue(v);}return v;};n.prototype._showWrongValueVisualEffect=function(){var O=this.getValueState(),i=this._getInput();if(O===j.Error){return;}i.setValueState(j.Error);setTimeout(i["setValueState"].bind(i,O),1000);};n.prototype._getDefaultValue=function(v,e,i){if(v!==""&&v!==undefined){return Number(this._getInput().getValue());}if(this._isNumericLike(i)&&i>0){return i;}else if(this._isNumericLike(e)&&e<0){return e;}else{return 0;}};n.prototype._isNumericLike=function(v){return!isNaN(v)&&v!==null&&v!=="";};n.prototype._isInteger=function(v){return v===parseInt(v);};n.prototype._isButtonFocused=function(){return document.activeElement===this._getIncrementButton().getDomRef()||document.activeElement===this._getDecrementButton().getDomRef();};n.prototype._sumValues=function(v,e,s,P){var i=Math.pow(10,P),r=parseInt((v*i).toFixed(1)),t=parseInt((e*i).toFixed(1));return(r+(s*t))/i;};n.prototype._areFoldChangeRequirementsFulfilled=function(){return this.getStepMode()===m.Multiple&&this.getDisplayValuePrecision()===0&&this._isInteger(this.getStep())&&this._isInteger(this.getLargerStep());};n.prototype._calculateClosestFoldValue=function(v,s,i){var r=Math.floor(v),e=s;do{r+=i;e--;}while(r%s!==0&&e);if(r%s!==0){g.error("Wrong next/previous value "+r+" for "+v+", step: "+s+" and sign: "+i,this);}return r;};function q(v){return(typeof(v)==='number')&&!isNaN(v)&&v>=0&&v<=20;}n.prototype._calcWaitTimeout=function(){this._speed*=n.ACCELLERATION;this._waitTimeout=((this._waitTimeout-this._speed)<n.MIN_WAIT_TIMEOUT?n.MIN_WAIT_TIMEOUT:(this._waitTimeout-this._speed));return this._waitTimeout;};n.prototype._spinValues=function(i){this._spinTimeoutId=setTimeout(function(){if(this._btndown){this._bSpinStarted=true;this._bDelayedEventFire=true;this._changeValueWithStep(i?1:-1);this._disableButtons(Number(this._getInput().getValue()),this._getMax(),this._getMin());if((this._getIncrementButton().getEnabled()&&i)||(this._getDecrementButton().getEnabled()&&!i)){this._spinValues(i);}}}.bind(this),this._calcWaitTimeout());};n.prototype._attachEvents=function(B,i){var e={onmousedown:function(E){if(E.button===0&&!this._btndown){this._btndown=true;this._waitTimeout=n.INITIAL_WAIT_TIMEOUT;this._speed=n.INITIAL_SPEED;this._spinValues(i);}}.bind(this),onmouseup:function(E){if(D.system.desktop&&E.button===0){this._bDelayedEventFire=undefined;this._btndown=false;this._stopSpin();}}.bind(this),onmouseout:function(E){if(this._btndown){this._bDelayedEventFire=undefined;this._stopSpin();}}.bind(this),oncontextmenu:function(E){E.stopImmediatePropagation(true);if(E.originalEvent&&E.originalEvent.cancelable){E.preventDefault();}E.stopPropagation();},ontouchend:function(E){if(D.system.phone||D.system.tablet){this._bDelayedEventFire=undefined;this._btndown=false;this._stopSpin();}if(E.originalEvent&&E.originalEvent.cancelable){E.preventDefault();}if(i){this._getIncrementButton().invalidate();}else{this._getDecrementButton().invalidate();}}.bind(this)};B.addDelegate(e,true);};n.prototype._stopSpin=function(){this._resetSpinValues();if(this._bSpinStarted){this._changeValue();}};n.prototype._getMin=function(){var B=this.getBinding("value"),e=B&&B.getType&&B.getType(),s=e&&e.oConstraints&&e.oConstraints.minimum;return s?parseFloat(s):this.getMin();};n.prototype._getMax=function(){var B=this.getBinding("value"),e=B&&B.getType&&B.getType(),s=e&&e.oConstraints&&e.oConstraints.maximum;return s?parseFloat(s):this.getMax();};n.prototype.getIdForLabel=function(){return this._getInput().getIdForLabel();};n.prototype.onfocusout=function(e){if(!this._btndown){this._changeValueWithStep(0);if(this._bDelayedEventFire&&(this._fTempValue)!==this._fOldValue){this._bDelayedEventFire=undefined;this._changeValue();}}};n.prototype.getFocusDomRef=function(){return this.getAggregation("_input").getFocusDomRef();};n.prototype._resetSpinValues=function(){clearTimeout(this._spinTimeoutId);this._waitTimeout=500;this._speed=120;};n.prototype.getAccessibilityInfo=function(){return{type:sap.ui.getCore().getLibraryResourceBundle("sap.m").getText("ACC_CTR_TYPE_STEPINPUT"),description:this.getValue()||"",focusable:this.getEnabled(),enabled:this.getEnabled(),editable:this.getEnabled()&&this.getEditable()};};return n;});
