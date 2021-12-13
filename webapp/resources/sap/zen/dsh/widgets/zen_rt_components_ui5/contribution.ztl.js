/*
 * SAPUI5
  (c) Copyright 2009-2021 SAP SE. All rights reserved
 */
sap.ui.define(["jquery.sap.global"],function(q){q.sap.declare("sap.zen.dsh.zen_rt_components_ui5");sap.zen.dsh.com_sap_ip_bi_FormattedTextView={setHtmlText:function(h){this.htmlText=h;},getHtmlText:function(){return this.htmlText;}};sap.zen.dsh.com_sap_ip_bi_FragmentGallery={getSelectedId:function(){return this.selectedId;},setSelectedId:function(i){this.selectedId=i;},addItem:function(a){if(a!=undefined&&a!=null){var k=a.id;var t=a.title;var b=a.imageUrl;var d=a.description;var c="{\"key\": \""+k+"\", \"text\" : \""+t+"\", \"image\" : \""+b+"\", \"description\" : \""+d+"\"}";var e=JSON.parse("["+c+"]");var f=false;if(this.items===undefined||this.items===""){this.items=JSON.stringify(e);}else{var g=JSON.parse(this.items);for(var i=0;i<g.length;i++){if(g[i].key==k){f=true;}}if(!f){this.items=JSON.stringify(g.concat(e));}}}},addItems:function(a){for(var i=0;i<a.length;i++){this.addItem(a[i]);}},removeItem:function(a){var b=JSON.parse(this.items);var c=-1;for(var i=0;i<b.length;i++){if(a!=null&&a!=undefined){if(b[i].key==a){c=i;}}else{if(b[i].id==this.selectedId){c=i;}}}if(c>-1){b.splice(c,1);}this.items=JSON.stringify(b);},removeAllItems:function(){var i=[];this.items=JSON.stringify(i);}};sap.zen.dsh.com_sap_ip_bi_DataSourceBrowser={getRootFolders:function(b){return sap.zen.dsh.COMPONENTS[this.owner].getRootFolders(b);},getChildren:function(p){return sap.zen.dsh.COMPONENTS[this.owner].getChildren(p);},searchDataSources:function(s){return sap.zen.dsh.COMPONENTS[this.owner].searchDataSources(s);},close:function(a){sap.zen.dsh.COMPONENTS[this.owner].dialogClosed(a);}};sap.zen.dsh.com_sap_ip_bi_SelectionTable={setDataSelection:function(s){this.data=this.stringifySelection(s);},getVisualSelection:function(){return this.visSelection;},setVisualSelection:function(s){this.visSelection=this.stringifySelection(s);},getSelectedMember:function(d){var j={};if(this.visSelection){j=JSON.parse(this.visSelection);}var m=j[d];return this.createMember(d,m);},setSelectionShape:function(s){this.selectionShape=s;},getCurrentSelectionShape:function(){return this.currrentSelectionShape;},getDataSourceNames:function(){var d=sap.zen.dsh.APPLICATION.getDataSources();return d.map(function(v){return v.get_VariableName();});},getDataSourceByName:function(n){var d=sap.zen.dsh.COMPONENTS[n];if(d.loadDataSource){d.loadDataSource();}return d;}};sap.zen.dsh.IconBackgroundShapeEnumfield={};sap.zen.dsh.IconBackgroundShape={RECTANGLE:"RECTANGLE",ELLIPSIS:"ELLIPSIS",NONE:"NONE"};sap.zen.dsh.com_sap_ip_bi_Icon={getBackgroundColor:function(){return this.backgroundColor;},setBackgroundColor:function(b){this.backgroundColor=b;},getColor:function(){return this.color;},setColor:function(c){this.color=c;},getIconUri:function(){return this.iconUri;},setIconUri:function(i){this.iconUri=i;},getSizeFactor:function(){return this.sizeFactor;},setSizeFactor:function(s){this.sizeFactor=s;},getBackgroundShape:function(){return this.backgroundShape;},setBackgroundShape:function(b){this.backgroundShape=b;},getTooltip:function(){return this.tooltip;},setTooltip:function(t){this.tooltip=t;}};sap.zen.dsh.SwitchModeEnumfield={};sap.zen.dsh.SwitchMode={OnOff:"OnOff",Blank:"Blank",AcceptReject:"AcceptReject"};sap.zen.dsh.com_sap_ip_bi_Switch={isEnabled:function(){return this.enabled;},setEnabled:function(n){this.enabled=n;},getTooltip:function(){return this.tooltip;},setTooltip:function(n){this.tooltip=n;},getMode:function(){return this.mode;},setMode:function(n){this.mode=n;},isOn:function(){return this.state;},setOn:function(n){this.state=n;}};sap.zen.dsh.LinkStyleEnumfield={};sap.zen.dsh.LinkStyle={Normal:"Normal",Subtle:"Subtle",Emphasized:"Emphasized"};sap.zen.dsh.com_sap_ip_bi_Link={setText:function(t){this.text=t;},getText:function(){return this.text;},setEnabled:function(e){this.enabled=e;},isEnabled:function(){return this.enabled;},setTooltip:function(v){this.tooltip=v;},getTooltip:function(){return this.tooltip;},setUrl:function(u){this.url=u;},getUrl:function(){return this.url;},setStyle:function(v){this.style=v;},getStyle:function(){return this.style;}};sap.zen.dsh.ProgressIndicatorStateEnumfield={};sap.zen.dsh.ProgressIndicatorState={None:"None",Error:"Error",Warning:"Warning",Success:"Success"};sap.zen.dsh.com_sap_ip_bi_ProgressIndicator={getText:function(){return this.text;},setText:function(v){this.text=v;},getState:function(){return this.state;},setState:function(v){this.state=v;},getPercentValue:function(){return this.percentValue;},setPercentValue:function(v){this.percentValue=v;},getTooltip:function(){return this.tooltip;},setTooltip:function(v){this.tooltip=v;}};sap.zen.dsh.com_sap_ip_bi_TextArea={setValue:function(v){this.value=v;},getValue:function(){return this.value;},setEnabled:function(e){this.enabled=e;},isEnabled:function(){return this.enabled;},setEditable:function(e){this.editable=e;},isEditable:function(){return this.editable;},setTooltip:function(v){this.tooltip=v;},getTooltip:function(){return this.tooltip;}};sap.zen.dsh.com_sap_ip_bi_SegmentedButton={getSelectedText:function(){return this.selectedText;},getSelectedValue:function(){return this.selectedValue;},setSelectedValue:function(v){this.selectedValue=v;},removeAllItems:function(){this.ButtonItems=[];},removeItem:function(v){var a=this.ButtonItems;for(var i=a.length-1;i>0;i--){if(a[i].value==v){a.splice(i,1);}}this.ButtonItems=a;},setItemEnabled:function(v,e){var a=this.ButtonItems;for(var i=0;i<a.length;i++){if(a[i].value==v){a[i]={value:a[i].value,text:a[i].text,image:a[i].icon,disabled:!e};}}this.ButtonItems=a;},isItemEnabled:function(v){var a=this.ButtonItems;for(var i=0;i<a.length;i++){if(a[i].value==v){return!a[i].disabled;}}},addItem:function(v,t,i,a){var b=this.ButtonItems||[];if(a==null||a==undefined){b.push({value:v,text:t==null||t==undefined?"":t,image:i==null||i==undefined?"":i,enabled:true});}else{b.splice(a,0,{value:v,text:t==null||t==undefined?"":t,image:i==null||i==undefined?"":i,enabled:true});}this.ButtonItems=b;}};});
