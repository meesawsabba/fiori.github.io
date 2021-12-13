sap.ui.define(["sap/ovp/cards/v4/generic/Card.controller","sap/ui/thirdparty/jquery","sap/ui/model/json/JSONModel","sap/ovp/cards/OVPCardAsAPIUtils","sap/ovp/cards/CommonUtils","sap/ovp/cards/v4/V4AnnotationHelper","sap/ovp/app/OVPUtils","sap/ovp/cards/ovpLogger","sap/ovp/cards/jUtils","sap/ovp/cards/Filterhelper"],function(C,q,J,O,a,A,b,o,u,F){"use strict";var l=new o("OVP.v4.list.List");return C.extend("sap.ovp.cards.v4.list.List",{counter:0,arrayLength:0,minMaxModel:{},onInit:function(){C.prototype.onInit.apply(this,arguments);this.counter=0;this.minMaxModel=new J();this.minMaxModel.setData({minValue:0,maxValue:0});this.getView().setModel(this.minMaxModel,"minMaxModel");var t=this;this.eventhandler=function(c,d,f){if(t.getView().getModel().getMetaModel().getData){var m=t.getView().getModel().getMetaModel().getData();var g=t.getView().getModel('ovpCardProperties').getData().entityType.$Type;var r=F._getEntityRelevantFilters(m[g],f);r=F.mergeFilters(r,t.selectionVaraintFilter);try{t.getCardItemsBinding().filter(r);if(t.getKPIBinding()){t.getKPIBinding().filter(r);}}catch(e){}}};this.GloabalEventBus=sap.ui.getCore().getEventBus();if(this.oCardComponentData&&this.oCardComponentData.mainComponent){this.GloabalEventBus.subscribe("OVPGlobalfilter","OVPGlobalFilterSeacrhfired",t.eventhandler);}},onContactDetailsLinkPress:function(e){var p,s,B;s=e.getSource();p=s.getParent().getAggregation("items")[0];B=s.getBindingContext();if(!B){return;}p.bindElement(B.getPath());p.openBy(s);},onAfterRendering:function(){C.prototype.onAfterRendering.apply(this,arguments);var i=this.getCardPropertiesModel().getProperty("/imageSupported");var d=this.getCardPropertiesModel().getProperty("/densityStyle");if(i){var c=this.byId('ovpList');c.attachUpdateFinished(function(){this._addImageCss(d);}.bind(this));}if(!O.checkIfAPIIsUsed(this)&&this.getCardPropertiesModel().getProperty("/layoutDetail")==="resizable"){var e=this.oDashboardLayoutUtil.dashboardLayoutModel.getCardById(this.cardId);var h=Math.max(e.dashboardLayout.headerHeight,this.getHeaderHeight());var s=this.oDashboardLayoutUtil.getCardDomId(this.cardId);var f=document.getElementById(s);if(!e.dashboardLayout.autoSpan){f.getElementsByClassName('sapOvpWrapper')[0].style.height=(e.dashboardLayout.rowSpan*this.oDashboardLayoutUtil.ROW_HEIGHT_PX)-(h+2*this.oDashboardLayoutUtil.CARD_BORDER_PX)+"px";}if(e.dashboardLayout.showOnlyHeader){f.classList.add("sapOvpMinHeightContainer");}}if(!O.checkIfAPIIsUsed(this)){var g=this.getCardPropertiesModel();var j=this.getOwnerComponent().getModel("ui").getData().cards;var r=[];if(this.getMetaModel().getData){var k=this.getMetaModel().getData()[this.getEntitySet().$Type];this.selectionVaraintFilter=F.getSelectionVariantFilters(j,g,this.getEntityType());}var m=this.oCardComponentData.mainComponent;if(m.getGlobalFilter()){r=F._getEntityRelevantFilters(k,m.oGlobalFilter.getFilters());}if(m.getMacroFilterBar()){var n=m.aFilters;r=F._getEntityRelevantFilters(k,n);}r=F.mergeFilters(r,this.selectionVaraintFilter);if(this.getCardItemsBinding()){this.getCardItemsBinding().filter(r);}if(this.getKPIBinding()){this.getKPIBinding().filter(r);}}},_addImageCss:function(d){var L=this.byId('ovpList');var i=L.getItems();var c=false;var e=L.getDomRef().getAttribute("class");if(d==="cozy"){e=e+" sapOvpListImageCozy";}else{e=e+" sapOvpListImageCompact";}L.getDomRef().setAttribute("class",e);i.forEach(function(f){if(f.getIcon().indexOf("icon")!=-1){c=true;}});i.forEach(function(f){var g=f.getDomRef();var h;if(g&&g.children[0]&&g.children[0].children[0]){h=g.children[0].children[0];}var j=f.getDescription();var k=f.getIcon();var t=c;var m=f.getTitle();var n=m.split(' ').map(function(s){return s?s[0].toUpperCase():"";}).join('').substring(0,2);if(k!=""&&k.indexOf("icon")==-1){c=false;}if(c&&g.children[0]){q(g.children[0]).addClass("sapOvpIconListItem");}else if(g.children[0]){q(g.children[0]).addClass("sapOvpImageListItem");}if(h&&d==="cozy"&&c===false){if(h){var e=h.getAttribute("class");e=e+" sapOvpImageCozy";h.setAttribute("class",e);}}var p="";if(c===true&&j===""){p=d==="compact"?"sapOvpListWithIconNoDescCompact":"sapOvpListWithIconNoDescCozy";}else if(c===false&&j===""){p=d==="compact"?"sapOvpListWithImageNoDescCompact":"sapOvpListWithImageNoDescCozy";}else{p=d==="compact"?"sapOvpListWithImageIconCompact":"sapOvpListWithImageIconCozy";}f.addStyleClass(p);if(g&&g.children[0]&&k===""&&g.children[0].id!=="ovpIconImagePlaceHolder"){var r=document.createElement('div');r.innerText=n;r.setAttribute("id","ovpIconImagePlaceHolder");r.className=c===true?"sapOvpIconPlaceHolder":"sapOvpImagePlaceHolder";if(c===false&&d==="cozy"){r.className=r.className+" sapOvpImageCozy";}g.insertBefore(r,g.children[0]);}c=t;});},onListItemPress:function(e){var n=b.bCRTLPressed?b.constants.explace:b.constants.inplace;b.bCRTLPressed=false;if(O.checkIfAPIIsUsed(this)){if(this.checkAPINavigation()){a.onContentClicked(e);}}else{var N=this.getEntityNavigationEntries(e.getSource().getBindingContext(),this.getCardPropertiesModel().getProperty("/annotationPath"));this.doNavigation(e.getSource().getBindingContext(),N[0],n);}},getCardItemsBinding:function(){var c=this.getView().byId("ovpList");return c.getBinding("items");},_getMinMaxObjectFromContext:function(n){this.counter++;var e=this.getEntitySet(),s=this.getCardPropertiesModel().getProperty("/annotationPath");s="@"+s;var r=this.getMetaModel().getData(s).$Annotations[e.$Type][s];var c="/"+e.$Type+"/@"+s;var d=this.getMetaModel().createBindingContext(c),m={minValue:0,maxValue:0};if(A.isFirstDataPointPercentageUnit(d,r)){m.minValue=0;m.maxValue=100;return m;}var f=A.getFirstDataPointValue(d,r),g=this.getView().byId("ovpList"),h=g.getBinding("items"),j=h.getCurrentContexts();for(var i=0;n?i<n:i<j.length;i++){var k=j[i].getValue(f);var p=parseFloat(k,10);if(p<m.minValue){m.minValue=p;}else if(p>m.maxValue){m.maxValue=p;}}return m;},_updateMinMaxModel:function(n){var m=this._getMinMaxObjectFromContext(n);this.minMaxModel.setData({minValue:m.minValue,maxValue:m.maxValue});this.minMaxModel.refresh();return m;},returnBarChartValue:function(v){this._updateMinMaxModel();var V=parseFloat(v,10);return V;},getCardItemBindingInfo:function(){var L=this.getView().byId("ovpList");return L.getBindingInfo("items");},resizeCard:function(n,c){var N,i,h;try{var $=document.getElementById(this.oDashboardLayoutUtil.getCardDomId(this.cardId)),B=this.getCardItemBindingInfo(),H=this.getHeaderHeight(),d=this.getView().byId('ovpCardContentContainer').getDomRef();if(n.showOnlyHeader){d.classList.add('sapOvpContentHidden');N=0;}else{d.classList.remove('sapOvpContentHidden');h=H+c.dropDownHeight;i=n.rowSpan*n.iRowHeightPx-h;N=Math.abs(Math.floor(i/c.itemHeight));$.style.height=n.rowSpan*n.iRowHeightPx+'px';}d.style.height=(n.rowSpan*n.iRowHeightPx)-(H+2*n.iCardBorderPx)+"px";if(N!==B.length){B.length=N;n.noOfItems=B.length;this.getCardItemsBinding().refresh();}else{this._handleCountHeader();}}catch(e){l.warning("OVP resize: "+this.cardId+" catch "+e.toString());}},onExit:function(){C.prototype.onExit.apply(this,arguments);}});});
