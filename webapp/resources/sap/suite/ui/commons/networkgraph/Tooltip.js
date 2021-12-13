/*!
 * 
		SAP UI development toolkit for HTML5 (SAPUI5)
		(c) Copyright 2009-2015 SAP SE. All rights reserved
	
 */
sap.ui.define(["sap/ui/thirdparty/jquery","./SvgBase","./Line","./Node","./Group","sap/m/ResponsivePopover","sap/m/Popover","sap/m/List","sap/m/OverflowToolbar","sap/m/Button","sap/m/CustomListItem","sap/m/FlexBox","sap/m/HBox","sap/m/IconTabBar","sap/m/IconTabFilter","sap/m/Panel","sap/m/StandardListItem","sap/m/Text","sap/m/ToolbarSpacer","sap/ui/core/Icon","sap/m/FlexItemData","sap/ui/core/library","sap/m/library",'sap/ui/Device'],function(q,S,L,N,G,R,P,a,O,B,C,F,H,I,b,c,d,T,e,f,g,h,M,D){"use strict";var i=M.PlacementType;var r=sap.ui.getCore().getLibraryResourceBundle("sap.suite.ui.commons");var j=S.extend("sap.suite.ui.commons.networkgraph.Tooltip",{metadata:{library:"sap.suite.ui.commons",events:{afterOpen:{},afterClose:{}}}});j.prototype.init=function(){this._oPopover=null;this._oElement=null;};j.prototype.create=function(p){var o;this._oPopover=new R(this.getId()+"-tooltip",{showHeader:false,placement:this.getParent()._bIsRtl?i.PreferredLeftOrFlip:i.PreferredRightOrFlip,afterOpen:function(){this.fireAfterOpen();}.bind(this),afterClose:function(){this.fireAfterClose();}.bind(this),beforeOpen:function(){this._fnCreate();}.bind(this),contentWidth:"350px"}).addStyleClass("sapSuiteUiCommonsNetworkTooltip");this._oSimpleTooltip=new P({contentMinWidth:"350px",showHeader:false});this.addDependent(this._oPopover);o=this._oPopover.getAggregation("_popup");if(o){o._afterAdjustPositionAndArrowHook=function(){var $=this.$("arrow"),t=this.$().position().top,A=$.position().top,k=15,w=q(window).height(),n=t+A-k;if(w>n+this.$().height()){$.css("top",k+"px");this.$().css("top",n+"px");}};}};j.prototype.instantClose=function(){var p=this._oPopover.getAggregation("_popup");if(p&&p.oPopup&&p.oPopup.close){p.oPopup.close(0);}if(this._oSimpleTooltip.oPopup&&this._oSimpleTooltip.oPopup.close){this._oSimpleTooltip.oPopup.close(0);}};j.prototype.close=function(){this._oPopover.close();};j.prototype.openDetail=function(A){var o=A.opener||this._getOpener(A.item,A.point);if(A.item instanceof N&&!A.item._hasDetailData()){this._oSimpleTooltip.removeAllContent();this._appendHeader(A.item.getTitle(),this._oSimpleTooltip);this._oSimpleTooltip.openBy(o);return;}this._fnCreate=this._createDetail;this._oElement=A.item;this._oPopover.openBy(o);};j.prototype._createDetail=function(){var k=this._getTooltipCreateFunction(this._oElement);this._oPopover.removeAllContent();this._appendFooter();k(this._oElement);};j.prototype.openLink=function(A){this._oElement=A.item;this._fnCreate=this._createLink;this._oPopover.openBy(A.opener);};j.prototype._createLink=function(A){var l=new a(),o=this._oElement;this._oPopover.removeAllContent();this._appendHeader(r.getText("NETWORK_GRAPH_TOOLTIP_EXTERNAL_LINKS"));o.getActionLinks().forEach(function(k){l.addItem(new C({content:[new H({renderType:"Bare",items:k.clone(null,null,{cloneChildren:true,cloneBindings:false}).addStyleClass("sapUiTinyMargin")})]}));});this._oPopover.addContent(l);this._appendFooter();};j.prototype._getOpener=function(o,p){if(o instanceof L&&p){if(this._oElement===o&&this._tooltipRect){var x=parseInt(this._tooltipRect.getAttribute("x"),10),y=parseInt(this._tooltipRect.getAttribute("y"),10),k=10;if((Math.abs(x-p.x)<k)&&(Math.abs(y-p.y)<k)){return this._tooltipRect;}}this._cleanUpLineTooltip();this._tooltipRect=this._createElement("rect",{x:p.x,y:p.y,width:D.browser.firefox?0.01:0,height:D.browser.firefox?0.01:0});this.getParent().$svg.append(this._tooltipRect);return this._tooltipRect;}return o;};j.prototype._getTooltipCreateFunction=function(o){if(o instanceof N){return this._createNodeTooltip.bind(this);}if(o instanceof L){return this._createLineTooltip.bind(this);}if(o instanceof G){return this._createGroupTooltip.bind(this);}return null;};j.prototype._cleanUpLineTooltip=function(){if(this._tooltipRect){q(this._tooltipRect).remove();}};j.prototype._appendDescription=function(o,w){if(o.getDescription()){w=w||this._oPopover;w.addContent(new c({content:new T({textAlign:"Initial",text:o.getDescription()}).addStyleClass("sapSuiteUiCommonsNetworkTooltipDescription")}).addStyleClass("sapSuiteUiCommonsNetworkTooltipArea"));}};j.prototype._appendAttributes=function(A,w){var l=new a(),o=w||this._oPopover;if(A.length>0){A.forEach(function(k){l.addItem(new C({content:[new H({items:[new T({layoutData:[new g({baseSize:"50%"})],text:k.getLabel()}),new T({layoutData:[new g({baseSize:"50%"})],text:k.getValue(),width:"100%",textAlign:h.TextAlign.End})]}).addStyleClass("sapSuiteUiCommonsNetworkTooltipLine")]}));o.addContent(l);});}};j.prototype._appendNodesList=function(o,w){var l=new a();o.aNodes.forEach(function(n){if(n.getTitle()){l.addItem(new d({title:n.getTitle(),icon:n.getIcon()}));}});w.addContent(l);};j.prototype._appendFooter=function(){var t=this;this.oCloseButton=new B({text:r.getText("NETWORK_GRAPH_CLOSE"),press:function(){t._oPopover.close();}});this._oPopover.setEndButton(this.oCloseButton);this._oPopover.setInitialFocus(this.oCloseButton);};j.prototype._appendHeader=function(t,p){p=p||this._oPopover;if(t){var o=new T({width:"100%",textAlign:h.TextAlign.Center,text:t});p.insertContent(new c({width:"100%",content:[o]}).addStyleClass("sapSuiteUiCommonsNetworkTooltipArea"),0);p.addAriaLabelledBy(o);}};j.prototype._createGroupTooltip=function(o){var k=function(){return o.getAttributes().length>0||o.getDescription();};var l,n;this._appendHeader(o.getTitle());if(k()){n=new b({text:r.getText("NETWORK_GRAPH_TOOLTIP_LIST_OF_NODES")});l=new b({text:r.getText("NETWORK_GRAPH_TOOLTIP_INFORMATION")});this._oPopover.addContent(new I({items:[l,n]}));this._oPopover.addStyleClass("sapSuiteUiCommonsNetworkGroupTooltipTabBar");this._appendDescription(o,l);this._appendAttributes(o.getAttributes(),l);this._appendNodesList(o,n);}else{this._appendNodesList(o,this._oPopover);}};j.prototype._createNodeTooltip=function(n){this._appendDescription(n);this._appendAttributes(n.getAttributes());this._appendHeader(n.getTitle());};j.prototype._createLineTooltip=function(l,p){var k=function(){var s=new T({width:"50%",text:l.getFromNode().getTitle()}).addStyleClass("sapSuiteUiCommonsNetworkGraphNoPointerEvents sapSuiteUiCommonsNetworkLineTooltipLabel"),o=new f({src:"sap-icon://arrow-right"}).addStyleClass("sapUiTinyMarginEnd sapSuiteUiCommonsNetworkGraphNoPointerEvents sapSuiteUiCommonsNetworkLineTooltipFromToIcon"),n=new f({src:"sap-icon://arrow-left"}).addStyleClass("sapUiTinyMarginBegin sapSuiteUiCommonsNetworkGraphNoPointerEvents sapSuiteUiCommonsNetworkLineTooltipFromToIcon"),t=new T({textAlign:h.TextAlign.End,width:"50%",text:l.getToNode().getTitle()}).addStyleClass("sapSuiteUiCommonsNetworkGraphNoPointerEvents sapSuiteUiCommonsNetworkLineTooltipLabel"),u=new F({renderType:"Bare",width:"100%",justifyContent:"Center",items:[s]}).addStyleClass("sapSuiteUiCommonsNetworkLineTooltipFromTo");l._isBothArrow()?u.addItem(n):o.addStyleClass("sapUiTinyMarginBegin");u.addItem(o);u.addItem(t);return u;},m=function(){var t=l.getTitle();this._oPopover.addContent(k());if(t){this._appendHeader(t);}this._appendDescription(l);this._appendAttributes(l.getAttributes());}.bind(this);m(l);};return j;});
