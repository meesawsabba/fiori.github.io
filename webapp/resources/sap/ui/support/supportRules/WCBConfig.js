/*!
 * OpenUI5
 * (c) Copyright 2009-2021 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(["sap/ui/thirdparty/jquery","sap/ui/thirdparty/URI"],function(q,U){"use strict";var D='_unnamed_frame_-_use_message_origin_';var W=function(o){this._sModulePath=o.modulePath;this._sReceivingWindow=o.receivingWindow;if(o.uriParams){this._sURIOrigin=o.uriParams&&o.uriParams.origin;this._sURIFrameId=o.uriParams&&o.uriParams.frameId;this._sOrigin=this.getOriginURIParameter(o.uriParams.origin);}return this;};W.prototype.getOrigin=function(){if(this._sOrigin){return this._sOrigin;}var m=new U(sap.ui.require.toUrl(this._sModulePath));var p=m.protocol()||window.location.protocol.replace(":","");var h=m.host()||window.location.host;this._sOrigin=p+"://"+h;return this._sOrigin;};W.prototype.getFrameId=function(){return q.sap.getUriParameters().get(this._sURIFrameId)||D;};W.prototype.getOriginURIParameter=function(){return q.sap.getUriParameters().get(this._sURIOrigin);};W.prototype.getReceivingWindow=function(){if(window.communicationWindows&&window.communicationWindows.hasOwnProperty(this._sReceivingWindow)){return window.communicationWindows[this._sReceivingWindow];}return window.opener||window.parent;};return W;},true);
