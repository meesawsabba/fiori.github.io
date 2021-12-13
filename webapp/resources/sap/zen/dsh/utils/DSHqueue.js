/*
 * SAPUI5
  (c) Copyright 2009-2021 SAP SE. All rights reserved
 */
sap.ui.define(["sap/base/Log","sap/zen/dsh/utils/request","sap/zen/dsh/firefly/library"],function(L,R){"use strict";L.info("Load DSHqueue");R.containsCommand=function(){return true;};R.getCommandSequence=function(){return false;};R.zenSendCommandArrayWoEventWZenPVT=function(){return"";};sap.zen.dsh.buddhaHasSendLock=0;R.que.instance.isSendAllowed=function(){return sap.zen.dsh.buddhaHasSendLock===0;};sap.zen.dsh.putInQueue=function(f){var q=function(e){if(sap.zen.dsh.buddhaHasSendLock>0){R.que.instance.insertAtStart(e);}else{sap.zen.dsh.buddhaHasSendLock++;setTimeout(f,0);}};R.que.instance.push({"parameterArray":null,"bOnlyEmptyDeltaWillReturn":false,"funclet":q});R.que.instance.wanderQue(1);};});
