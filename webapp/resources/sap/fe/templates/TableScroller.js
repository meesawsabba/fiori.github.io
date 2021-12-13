/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)
        (c) Copyright 2009-2021 SAP SE. All rights reserved
    
 */
sap.ui.define([],function(){"use strict";var T={scrollTableToRow:function(t,r){var o=t.getRowBinding();var g=function(){if(t.data().tableType==="GridTable"){return o.getContexts(0);}else{return o.getCurrentContexts();}};var f=function(){var b=g().find(function(i){return i&&i.getPath()===r;});if(b){t.scrollToIndex(b.getIndex());}};if(o){var a=g();if((a.length===0&&o.getLength()>0)||a.some(function(c){return c===undefined;})){o.attachEventOnce("dataReceived",f);}else{f();}}}};return T;},true);
