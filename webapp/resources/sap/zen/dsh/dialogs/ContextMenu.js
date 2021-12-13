/*!
 * SAPUI5
  (c) Copyright 2009-2021 SAP SE. All rights reserved
 */
sap.ui.define("sap/zen/dsh/dialogs/ContextMenu",["sap/ui/core/Fragment","sap/zen/dsh/utils/ResourceModel","sap/zen/commons/thirdparty/lodash"],function(F,R,_){"use strict";var d;var r;function h(a){r=a;}function g(c){return c.runAsOwner(function(){return Promise.resolve(F.load({name:"sap.zen.dsh.fragment.ContextMenu",controller:{afterClose:function(){d.close();r(d.getModel("om"));}}})).then(function(D){d=D;d.setModel(R,"i18n");d.open=function(o,p,C,O){d.setModel(C,"cm");d.setModel(O,"om");_.forEach(d.getContent()[0].byId("cm").getItems(),function(i){i.setExpanded(false);});D.getContent()[0].getPivot=_.constant(p);d.openBy(o);return new Promise(h);};return d;});});}return g;});
