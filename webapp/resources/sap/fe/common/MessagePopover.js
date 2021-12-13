/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)
        (c) Copyright 2009-2017 SAP SE. All rights reserved
    
 */
sap.ui.define(["sap/m/MessagePopover","sap/m/MessageItem","sap/fe/core/CommonUtils"],function(M,a,C){"use strict";var F=M.extend("sap.fe.common.MessagePopover",{metadata:{properties:{},events:{}},_fnFilterUponId:function(c,i){return c===i.getId();},init:function(){M.prototype.init.call(this,arguments);this.setModel(sap.ui.getCore().getMessageManager().getMessageModel(),"message");this.bindAggregation("items",{path:"message>/",template:new a({type:"{message>type}",title:"{message>message}",description:"{message>description}",longtextUrl:"{message>descriptionUrl}",subtitle:"{message>additionalText}",activeTitle:"{= ${message>controlIds}.length > 0 ? true : false}"})});this.setGroupItems(true);}});return F;},true);
