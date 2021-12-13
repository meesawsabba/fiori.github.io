/*!
 * SAPUI5

		(c) Copyright 2009-2021 SAP SE. All rights reserved
	
 */
if(!window.define){window.define=sap.ui.define;window.define.amd=true;}if(!window.require){window.require=sap.ui.require;}sap.ui.define(["../sinaNexTS/core/core","../sinaNexTS/sina/formatters/Formatter","../sinaNexTS/core/util"],function(c,F,u){"use strict";var R=function(){};R.prototype=c.extend(new F.Formatter(),{urlTemplates:{DWC_ERMODEL:"#/databuilder&/db/{{space_name}}/{{name}}",DWC_VIEW:"#/databuilder&/db/{{space_name}}/{{name}}",DWC_LOCAL_TABLE:"#/databuilder&/db/{{space_name}}/{{name}}",DWC_REMOTE_TABLE:"#/databuilder&/db/{{space_name}}/{{name}}",DWC_DAC:"#/authorizations&/auth/{{space_name}}/{{name}}/edit/",},initAsync:function(){},extractAttributes:function(a){var o={};var A=a.object.attributes;for(var i=0;i<A.length;++i){var b=A[i];o[b.id]=b.value;}return o;},formatAsync:function(r){for(var i=0;i<r.items.length;++i){var a=r.items[i];var b=this.extractAttributes(a);var d=this.urlTemplates[b["technical_type"]];if(!d){continue;}var e=u.evaluateTemplate(d,b);a.object.defaultNavigationTarget=r.sina._createNavigationTarget({label:"Hello World!",targetUrl:e,});a.object.defaultNavigationTarget.parent=a;}return Promise.resolve(r);},});return R;});
