// Copyright (c) 2009-2020 SAP SE, All Rights Reserved
sap.ui.define(["sap/ushell_abap/pbServices/ui2/Error","sap/ushell_abap/pbServices/ui2/Utils","sap/base/Log"],function(S,U,L){"use strict";var C=function(f,c){var a,o,b=[],r,I=true,d,s,R,g=[],t=this;function h(){if(I){throw new S(t+": page is just a stub","Page");}}function j(){if(!a){throw new S(t+": catalog is just an ID","Catalog");}}this.exit=function(){var T=t.toString();if(o){o.exit();}a=undefined;c=undefined;b=[];I=true;r=undefined;R=undefined;g=[];Object.keys(t).forEach(function(F){if(!/getCatalogData|getId|isStub|toString/.test(F)){delete t[F];}});f.forgetCatalog(t);L.debug("Exited: "+T,null,"Catalog");};this.getRemoteBaseUrl=function(){return t.addSystemToServiceUrl(a.type==="H"?"/sap/hba/apps/kpi/s/odata/hana_chip_catalog.xsodata/":a.baseUrl);};this.getRemoteCatalogService=function(){return f.getRemoteCatalogService(a)||{readChips:function(B,e,i,l,F){L.error("Catalog '"+a.id+"', type '"+a.type+"' not supported",null,"Catalog");U.callHandler(l.bind(null,{results:[]}),undefined,true);}};};function k(){var i,n,e;L.debug("Loaded: "+t,null,"Catalog");if(a.Chips){e=a.Chips.results||a.Chips;delete a.Chips;b=[];for(i=0,n=e.length;i<n;i+=1){b[i]=f.createChip(e[i]);}I=false;L.debug("Initialized: "+t,null,"Catalog");}delete a.CatalogPage;}this.read=function(i,l,F){var D;function m(e){a=e;k();D.resolve();}function n(e){a.Chips=e;k();D.resolve();}function p(e){e.results.forEach(function(v){v.remoteCatalogId=s;});n(e);}function q(){k();d=arguments;D.reject.apply(this,arguments);}function u(v){var w;if(v.remoteId){a=v;try{w=t.getRemoteBaseUrl();}catch(e){q(e.toString());return;}t.getRemoteCatalogService().readChips(w,a.remoteId,undefined,p,q);}else if(a&&i){n(v.Chips);}else{m(v);}}if(!r||r.state()!=="pending"){D=new jQuery.Deferred();r=D.promise();if(!a||(i&&!a.remoteId)){f.getPageBuildingService().readCatalog(s,u,D.reject.bind(D));}else{u.bind(this)(a);}}F=F||f.getPageBuildingService().getDefaultErrorHandler();r.done(U.callHandler.bind(null,l,F));r.fail(F);};this.addSystemToServiceUrl=function(e,i){if(e.indexOf("/")!==0||e.indexOf("//")===0){throw new S("addSystemToServiceUrl: Invalid URL: "+e,"Catalog");}i=i||this.getSystemAlias();if(/^[^?]*(;o=([\/;?]|$))/.test(e)){e=e.replace(/;o=([\/;?]|$)/,(i?";o="+i:"")+"$1");}else if(!/^[^?]*;o=/.test(e)&&i){e=e.replace(/(\/[^?]*?)(\/$|$|(\/?\?.*))/,"$1;o="+i+"$2");}if(sap.ui){sap.ui.getCore().getEventBus().publish("sap.ushell.Container","addRemoteSystemForServiceUrl",e);}return e;};this.clone=function(n,N,e,F){var i,l=function(E,m){return F(E,undefined,m);};if(a&&a.type==="REMOTE"){i=this.getCatalogData();delete i.id;i.domainId=n;if(N!==undefined){i.title=N;}f.createNewCatalog(i,e,F);}else{f.getPageBuildingService().cloneCatalog(this.getId(),n,N,function(m){f.createCatalog(m.id,e,l);},l);}};this.getCatalogData=function(){var e;if(!a){return undefined;}e=JSON.parse(JSON.stringify(a));delete e.__metadata;return e;};this.getCatalogPage=function(){j();if(a.type!=="P"&&a.type!=="CATALOG_PAGE"){return undefined;}if(!o){o=f.createPage(s);}return o;};this.getChips=function(){if(I){throw new S(t+": catalog is just a stub","Catalog");}return b.slice();};this.getDomainId=function(){return a&&a.domainId;};this.getId=function(){return s;};this.getSystemAlias=function(){return(a&&a.systemAlias)||undefined;};this.getTitle=function(){j();return a.title;};this.getType=function(){j();return a&&a.type;};this.isOutdated=function(){j();return(o&&!o.isStub()&&o.isOutdated())||a.outdated==="X";};this.isReadOnly=function(){h();return a.isReadOnly==="X";};this.isStub=function(){return I;};this.getCachedRemoteFailureArguments=function(){return d;};this.load=function(e,F){if(!I){throw new S("Catalog is not a stub anymore","Catalog");}this.read(false,e,F);};this.readChips=function(e,i,F){function l(p){p.results.forEach(function(q){f.createChip(q);});U.callHandler(i,F);}function m(p){p.results.forEach(function(q){q.remoteCatalogId=s;});l(p);}function n(p){a=p;if(a.remoteId){this.getRemoteCatalogService().readChips(this.getRemoteBaseUrl(),a.remoteId,e,m,F);}else{f.getPageBuildingService().readCatalogChips(s,e,l,F);}}if(!a){f.getPageBuildingService().readCatalog(s,n.bind(this),F,true);}else{n.bind(this)(a);}};this.readRegisteredChips=function(e,F){function i(){var D=new jQuery.Deferred(),l=g;g=[];if(l.length){t.readChips(l,D.resolve.bind(D),D.reject.bind(D));}else{D.resolve();}return D.promise();}if(!R||R.state()!=="pending"){R=i();}F=F||f.getPageBuildingService().getDefaultErrorHandler();R.fail(F).done(U.callHandler.bind(null,e,F));};this.refresh=function(e,F){this.read(true,e,F);};this.registerChip=function(e){if(R&&R.state()==="pending"){throw new S("Invalid state: registerChip while readRegisteredChips pending","Catalog");}g.push(e.getId());};this.remove=function(e,F){j();if(r&&r.state()==="pending"){throw new S("Catalog is being refreshed: "+this,"Catalog");}L.debug("Removing: "+this,null,"Catalog");f.getPageBuildingService().deleteCatalog(a,function(){this.exit();e();}.bind(this),F);};this.toString=function(v){var e=['Catalog({sId:"',s,'"',",bIsStub:",I];if(v){e.push(",oAlterEgo:",JSON.stringify(a),",oFactory:",f.toString(v),",aChips:",JSON.stringify(b));}e.push("})");return e.join("");};this.update=function(e,i,F){var n;j();if(Object.hasOwnProperty.call(e,"__metadata")){throw new S("Unsupported __metadata update","Catalog");}n=JSON.parse(JSON.stringify(a));Object.keys(e).forEach(function(N){n[N]=e[N];});I=true;d=undefined;f.getPageBuildingService().updateCatalog(n,function(){a=n;this.read(true,i,F);}.bind(this),function(){I=false;F=F||f.getPageBuildingService().getDefaultErrorHandler();F.apply(null,arguments);});};if(typeof c==="object"){s=c.id;if(c.remoteId){delete c.Chips;}a=c;k();}else if(typeof c==="string"){s=c;}if(!s){throw new S("Missing ID","Catalog");}L.debug("Created: "+this,null,"Catalog");};return C;},true);
