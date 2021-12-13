/*!
 * SAPUI5
  (c) Copyright 2009-2021 SAP SE. All rights reserved
 */
sap.ui.define("sap/zen/dsh/olap/OlapPropertyBinding",["sap/base/util/deepEqual","sap/ui/model/ChangeReason","sap/ui/model/PropertyBinding","sap/zen/dsh/olap/calculateId","sap/zen/commons/thirdparty/lodash"],function(d,C,P,c,_){"use strict";var O=P.extend("sap.zen.dsh.OlapPropertyBinding",{constructor:function(m,p,a,b){var t=this;var e=a;var v=null;P.apply(t,[m,p,e,b]);function f(){var r=m.resolve(p,e);return r?m.getProperty(r):null;}t.getValue=function(){return v;};t.setValue=function(o){var s=m.resolve(p,e);m.setProperty(s,o);};t.setContext=function(o){if(e!==o){sap.ui.getCore().getMessageManager().removeMessages(t.getDataState().getControlMessages(),true);e=o;t.checkUpdate();}else{t.checkUpdate();}};t.getId=_.constant(c());t.checkUpdate=function(F){var V=f();if(F||!d(V,v)){v=V;t.getDataState().setValue(v);t.checkDataState();t._fireChange({reason:C.Change});}};}});return O;});
