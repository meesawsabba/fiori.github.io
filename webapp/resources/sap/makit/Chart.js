/*!
 * SAPUI5
 * (c) Copyright 2009-2021 SAP SE. All rights reserved.
 */
sap.ui.define(["./library","./MakitLib","./CategoryAxis","./ValueAxis","./ValueBubble","./Row","./ChartRenderer","sap/ui/core/Control","sap/ui/core/Element","sap/ui/core/RenderManager","sap/ui/core/ResizeHandler","sap/ui/thirdparty/jquery","sap/base/Log","sap/base/assert"],function(m,M,C,V,a,R,b,c,E,d,e,q,L,f){"use strict";var g=m.LegendPosition;var h=m.ChartType;var j=c.extend("sap.makit.Chart",{metadata:{deprecated:true,library:"sap.makit",properties:{width:{type:"sap.ui.core.CSSSize",group:"Dimension",defaultValue:'100%'},height:{type:"sap.ui.core.CSSSize",group:"Dimension",defaultValue:'100%'},type:{type:"sap.makit.ChartType",group:"Appearance",defaultValue:h.Column},showRangeSelector:{type:"boolean",group:"Appearance",defaultValue:true},showTableView:{type:"boolean",group:"Misc",defaultValue:false},legendPosition:{type:"sap.makit.LegendPosition",group:"Misc",defaultValue:null},lineThickness:{type:"float",group:"Misc",defaultValue:1},showTableValue:{type:"boolean",group:"Misc",defaultValue:true},maxSliceCount:{type:"int",group:"Misc",defaultValue:12},primaryColorPalette:{type:"any",group:"Misc",defaultValue:null},showTotalValue:{type:"boolean",group:"Misc",defaultValue:false},numberOfVisibleCategories:{type:"int",group:"Misc",defaultValue:null},rangeSelectorStartPosition:{type:"int",group:"Misc",defaultValue:0}},aggregations:{rows:{type:"sap.makit.Row",multiple:true,singularName:"row",bindable:"bindable",deprecated:true},columns:{type:"sap.makit.Column",multiple:true,singularName:"column",bindable:"bindable",deprecated:true},series:{type:"sap.makit.Series",multiple:false,deprecated:true},values:{type:"sap.makit.Value",multiple:true,singularName:"value",deprecated:true},categoryRegions:{type:"sap.makit.Category",multiple:true,singularName:"categoryRegion",deprecated:true},category:{type:"sap.makit.Category",multiple:false,deprecated:true},categoryAxis:{type:"sap.makit.CategoryAxis",multiple:false,deprecated:true},valueAxis:{type:"sap.makit.ValueAxis",multiple:false,deprecated:true},valueBubble:{type:"sap.makit.ValueBubble",multiple:false,deprecated:true}},events:{doubletap:{},tap:{},longpress:{}}}});j.prototype.init=function(){this._makitChart=null;this._parentCurrentHeight=0;this._selectedCatIdx=0;this._chartTypeDefined=false;this._legendPosDefined=false;this._createRowsCalled=false;this._datarows=[];this._styleClasses=[];this.setCategoryAxis(new C());this.setValueAxis(new V());this.setValueBubble(new a());this.setPrimaryColorPalette(null);if(this.getType()===h.Pie||this.getType()===h.Donut){this.setLegendPosition(g.Left);}else{this.setLegendPosition(g.None);}this.attachEvent("_change",this._onPropertyChanged);sap.ui.getCore().attachThemeChanged(this._applyCSS,this);};j.prototype.onBeforeRendering=function(o){this.fireEvent("_beforeRendering",this);if(this.getDomRef()&&!d.isPreservedContent(this.getDomRef())){d.preserveContent(this.getDomRef(),true,false);}};j.prototype.onAfterRendering=function(o){this.fireEvent("_afterRendering",this);var $=q(document.getElementById("sap-ui-dummy-"+this.getId()));var i=d.findPreservedContent(this.getId());var k=null;if(i.length==0){this.fireEvent("_createMAKitObject",this);this._createChartObject();k=new q(this.getDomRef());$.replaceWith(k);var p=document.getElementById(this.getParent().getId());this._parentCurrentHeight=p.offsetHeight;e.register(p,q.proxy(this._onResize,this));}else if(i.length>0){this.fireEvent("_restoreMAKitObject",this);$.replaceWith(i);}else{$.remove();}if(k){this._makitChart.showRangeSelectorView(this.getShowRangeSelector());this._makitChart.showTableView(this.getShowTableView());this._makitChart.setGraphLineWidth(this.getLineThickness());this._makitChart.showTableValue(this.getShowTableValue());this._makitChart.setMaxPies(this.getMaxSliceCount());this._makitChart.setPalette(this.getPrimaryColorPalette());this._makitChart.setProperty("ShowTotal",this.getShowTotalValue());this._makitChart.setNumberOfVisibleCategories(this.getNumberOfVisibleCategories());this._makitChart.setRangeSelectorStartPosition(this.getRangeSelectorStartPosition());}this._setDataTable();};j.prototype.addStyleClass=function(s,S){if(this._styleClasses.indexOf(s)===-1){this._styleClasses.push(s);}if(this._makitChart){c.prototype.addStyleClass.call(this,s,S);}return this;};j.prototype.removeStyleClass=function(s,S){var i=this._styleClasses.indexOf(s);if(i>-1){this._styleClasses.splice(i,1);}if(this._makitChart){c.prototype.removeStyleClass.call(this,s,S);}return this;};j.prototype.bindAggregation=function(n,B){if(n==="rows"){if(typeof B=="string"){B={path:arguments[1],template:arguments[2],sorter:arguments[3],filters:arguments[4]};}B.template=undefined;B.factory=function(){};return E.prototype.bindAggregation.call(this,n,B);}return E.prototype.bindAggregation.apply(this,arguments);};j.prototype.addRow=function(r){L.error("The control manages the rows aggregation. The method \"addRow\" cannot be used programmatically!");};j.prototype.insertRow=function(r,i){L.error("The control manages the rows aggregation. The method \"insertRow\" cannot be used programmatically!");};j.prototype.removeRow=function(r){L.error("The control manages the rows aggregation. The method \"removeRow\" cannot be used programmatically!");};j.prototype.removeAllRows=function(){L.error("The control manages the rows aggregation. The method \"removeAllRows\" cannot be used programmatically!");};j.prototype.destroyRows=function(r){L.error("The control manages the rows aggregation. The method \"destroyRows\" cannot be used programmatically!");};j.prototype.updateRows=function(){this.fireEvent("_startUpdateRows",this);this._createRows();this._createRowsCalled=true;if(this._makitChart){this._setDataTable();}this.fireEvent("_endUpdateRows",this);};j.prototype.setValueBubble=function(v){if(v instanceof a){E.prototype.setAggregation.call(this,"valueBubble",v,false);v.attachEvent("_change",this._onValueBubbleChanged,this);if(this._makitChart){var i=v.toObject();this._makitChart.setValueBubbleStyle(i);if(this._makitChart.isValueBubbleVisible()!=i.visible){this._makitChart.showValueBubble(i.visible);}}}else{throw new Error("valueBubble property must be of type sap.makit.ValueBubble");}return this;};j.prototype.setCategory=function(o){var i=this.getCategoryRegions();if(i.length>0){this.removeCategoryRegion(0);}this.insertCategoryRegion(o,0);return this;};j.prototype.getCategory=function(o){var i=this.getCategoryRegions();return i[0];};j.prototype.destroyCategory=function(){this.removeCategoryRegion(0);return this;};j.prototype.addCategoryRegion=function(o){E.prototype.addAggregation.call(this,"categoryRegions",o,false);o.attachEvent("_change",{type:"categories"},this._onDataRegionPropChanged,this);return this;};j.prototype.insertCategoryRegion=function(o,i){E.prototype.insertAggregation.call(this,"categoryRegions",o,i,false);o.attachEvent("_change",{type:"categories"},this._onDataRegionPropChanged,this);return this;};j.prototype.removeCategoryRegion=function(o){var r=E.prototype.removeAggregation.call(this,"categoryRegions",o,false);if(r!=null){o.detachEvent("_change",this._onDataRegionPropChanged,this);}return r;};j.prototype.removeAllCategoryRegions=function(){var r=E.prototype.removeAllAggregation.call(this,"categoryRegions",false);var l=r.length;var i;for(i=0;i<l;i++){r[i].detachEvent("_change",this._onDataRegionPropChanged,this);}return r;};j.prototype.addValue=function(v){E.prototype.addAggregation.call(this,"values",v,false);v.attachEvent("_change",{type:"values"},this._onDataRegionPropChanged,this);return this;};j.prototype.insertValue=function(v,i){E.prototype.insertAggregation.call(this,"values",v,i,false);v.attachEvent("_change",{type:"values"},this._onDataRegionPropChanged,this);return this;};j.prototype.removeValue=function(v){var r=E.prototype.removeAggregation.call(this,"values",v,false);if(r!=null){r.detachEvent("_change",this._onDataRegionPropChanged,this);}return r;};j.prototype.removeAllValues=function(){var r=E.prototype.removeAllAggregation.call(this,"values",false);var l=r.length;var i;for(i=0;i<l;i++){r[i].detachEvent("_change",this._onDataRegionPropChanged,this);}return r;};j.prototype.setSeries=function(s){E.prototype.setAggregation.call(this,"series",s,false);s.attachEvent("_change",{type:"series"},this._onDataRegionPropChanged,this);return this;};j.prototype.setValueAxis=function(v){if(v instanceof V){E.prototype.setAggregation.call(this,"valueAxis",v,false);v.attachEvent("_change",{axis:"values"},this._onAxisPropChanged,this);}else{throw new Error("valueAxis property must be of type sap.makit.ValueAxis");}return this;};j.prototype.setCategoryAxis=function(o){if(o instanceof C){E.prototype.setAggregation.call(this,"categoryAxis",o,false);o.attachEvent("_change",{axis:"category"},this._onAxisPropChanged,this);}else{throw new Error("categoryAxis property must be of type sap.makit.CategoryAxis");}return this;};j.prototype.setPrimaryColorPalette=function(o){if(o==null||(o instanceof Array&&o.length>0)){E.prototype.setProperty.call(this,"primaryColorPalette",o,false);if(this._makitChart){this._makitChart.setPalette(o);}}else{throw new Error("primaryColorPalette property must be an array");}return this;};j.prototype._setRealHeight=function(i){var k=this.getDomRef();var p=k.style.height;var n="0px";if(i.indexOf("%")>-1){var l=document.getElementById(this.getParent().getId());var o=parseInt(i);var r=Math.ceil(l.offsetHeight*(o/100));n=r+"px";}else{n=i;}if(p!=n){k.style.height=n;}};j.prototype._createRows=function(){this.fireEvent("_startCreateRows",this);var t=new R(this.getId()+"-dummyrows");var k=this.getColumns();for(var i=0,l=k.length;i<l;i++){var o=k[i];if(o){var n=o.clone("col"+i);n.detachEvent("_change",this._onColumnPropChanged,this);for(var p in o.mProperties){if(o.mProperties.hasOwnProperty(p)){n.setProperty(p,o.getProperty(p),false);}}n.data("sap-ui-colindex",i);t.addAggregation("cells",n);n.unbindAggregation("name",true);}}this.fireEvent("_endColumn",this);this.destroyAggregation("rows");this.fireEvent("_endDestroyRows",this);var r=undefined;var B=this.getBinding("rows");if(B){r=B.getContexts();}var s=B.getLength();this._datarows=[];var u=this.getBindingInfo("rows");var v=undefined;if(u&&u.model){v=u.model;}this.fireEvent("_endPrepareRows",this);for(var i=0;i<s;i++){if(r&&r[i]){var n=t.clone("row"+i);n.setBindingContext(r[i],v);this.addAggregation("rows",n);this._datarows.push(n._datarow);}}this.fireEvent("_endCreateRows",this);t.destroy();};j.prototype._createChartObject=function(){var k=this.getDomRef();f(k,"Chart's DomRef is not ready");k.style.width=this.getWidth();this._setRealHeight(this.getHeight());this._makitChart=new window.$MA.Chart(this.getId(),true);var t=this;this._makitChart.bind("initialized",function(){t._makitChart.showToolBar(false);t._setMakitChartProperties();});this._makitChart.bind("beforerender",function(){t.fireEvent("_makitBeforeRender",t);});this._makitChart.bind("renderstart",function(){t.fireEvent("_makitRenderStart",t);});this._makitChart.bind("renderend",function(){t.fireEvent("_makitRenderEnd",t);});this._makitChart.bind("animationend",function(){t.fireEvent("_makitAnimationEnd",t);});var s=this._getChartSyntax();this._makitChart.create(s);this._makitChart.bind("tap",function(p){t._selectedCatIdx=t._makitChart.getSelectedCategoryIndex();t.fireTap(p);});this._makitChart.bind("doubletap",function(p){t.fireEvent("doubletap",p);});this._makitChart.bind("longpress",function(p){t._selectedCatIdx=t._makitChart.getSelectedCategoryIndex();t.fireEvent("longpress",p);});var l=this._styleClasses.length;for(var i=0;i<l;i++){this.addStyleClass(this._styleClasses[i]);}this._applyCSS();};j.prototype._setMakitChartProperties=function(){if(!this._makitChart){return;}this._makitChart.setLegend(this.getLegendPosition().toLowerCase());if(this._dataInitialized){this._makitChart.showTableView(this.getShowTableView());this._makitChart.showRangeSelectorView(this.getShowRangeSelector());this._makitChart.setGraphLineWidth(this.getLineThickness());this._makitChart.showTableValue(this.getShowTableValue());this._makitChart.setPalette(this.getPrimaryColorPalette());this._makitChart.setProperty("ShowTotal",this.getShowTotalValue());this._makitChart.setNumberOfVisibleCategories(this.getNumberOfVisibleCategories());this._makitChart.setRangeSelectorStartPosition(this.getRangeSelectorStartPosition());}var v=this.getValueBubble();if(v){var i=v.toObject();this._makitChart.setValueBubbleStyle(i);if(this._makitChart.isValueBubbleVisible()!=i.visible){this._makitChart.showValueBubble(i.visible);}}};j.prototype.addColumn=function(v){E.prototype.addAggregation.call(this,"columns",v,false);v.attachEvent("_change",{type:"columns"},this._onColumnPropChanged,this);return this;};j.prototype._getChartSyntax=function(){var k=this.getCategoryAxis();var l=this.getCategoryRegions();var n=l.length;if(n>0){var i;var o="<Categories";if(k){if(k.getDisplayAll()){o+=' display ="'+k.getDisplayAll()+'"';}}o+=">";var p="";for(i=n-1;i>=0;i--){var t=l[i].getDisplayName();if(t&&t.length>0){p+=t+" | ";}}p=p.substr(0,p.length-3);for(i=0;i<n;i++){var r=l[i];o+='<Category column ="'+r.getColumn()+'"';if(r.getFormat()){o+=' format ="'+r.getFormat()+'"';}if(i==0){o+=' displayname ="'+p+'"';}if(k){o+=' showprimaryline ="'+k.getShowPrimaryLine()+'"';o+=' showgrid ="'+k.getShowGrid()+'"';o+=' showlabel ="'+k.getShowLabel()+'"';o+=' thickness ="'+k.getThickness()+'"';o+=' color ="'+k.getColor()+'"';o+=' sortorder ="'+k.getSortOrder().toLowerCase()+'"';o+=' displaylastlabel ="'+k.getDisplayLastLabel()+'"';}o+=' />';}o+="</Categories>";}else{throw new Error("Chart '"+this.getId()+"' needs at least one Category data region");}var s=this.getSeries();var u='';if(s){u='<Series Column ="'+s.getColumn()+'"';if(s.getFormat()){u+=' format ="'+s.getFormat()+'"';}if(s.getDisplayName()){u+=' displayname ="'+s.getDisplayName()+'"';}u+='/>';}var v=this.getValueAxis();var w='<Values>';if(v){w='<Values';w+=' showprimaryline ="'+v.getShowPrimaryLine()+'"';w+=' showgrid ="'+v.getShowGrid()+'"';w+=' showlabel ="'+v.getShowLabel()+'"';w+=' thickness ="'+v.getThickness()+'"';w+=' color ="'+v.getColor()+'"';if(v.getMin()!==""){w+=' min ="'+v.getMin()+'"';}if(v.getMax()!==""){w+=' max ="'+v.getMax()+'"';}w+='>';}var x=this.getValues();var y=x.length;if(y==0){throw new Error("Chart '"+this.getId()+"' needs at least one Value data region");}var z;for(var i=0;i<y;i++){z=x[i];w+='<Value Expression ="'+z.getExpression()+'"';if(z.getFormat()){w+=' format ="'+z.getFormat()+'"';}if(z.getDisplayName()){w+=' displayname ="'+z.getDisplayName()+'"';}if(z.getLocale()!==""){w+=' Locale ="'+z.getLocale()+'"';}w+='/>';}w+='</Values>';var A=this.getType().toLowerCase();var B=null;if(A==="donut"||A==="pie"){B=A;A="pie";}var D='<Chart ChartType ="'+A+'"';if(B!==null){D+=' PieStyle ="'+B+'"';}D+=' >';D+=o;if(s){D+=u;}D+=w;D+='</Chart>';return D;};j.prototype._setDataTable=function(){this._setDataTableTimer=this._setDataTableTimer||setTimeout(function(){f(this._makitChart,"_makitChart is not initialized");if(this._datarows&&this._datarows.length>0){this.fireEvent("_createDataTable",this);var k=this._datarows;var l=new window.$MA.DataTable();var n=this.getColumns();var o=n.length;if(o==0){n=this.getRows()[0].getCells();o=n.length;}for(var i=0;i<o;i++){l.addColumn(n[i].getName(),n[i].getType());}l.addRows(k);this.fireEvent("_beforeSetDataTable",this);this._makitChart.setDataTable(l);this._dataInitialized=true;}this._setDataTableTimer=undefined;}.bind(this),150);};j.prototype._applyCSS=function(o){if(this._makitChart){this._makitChart.applyCSS();}};j.prototype._onResize=function(o){var p=document.getElementById(this.getParent().getId());var i=p.offsetHeight;var k=p.offsetWidth;if((this._parentCurrentHeight!=i&&i>0)||i<5){this._setRealHeight(this.getHeight());this._parentCurrentHeight=p.offsetHeight;}if(this._makitChart!=null&&i>0&&k>0){this._makitChart.refresh();}};j.prototype._onPropertyChanged=function(o){var n=o.mParameters["name"];var i=o.mParameters["newValue"];if(n==="type"&&!this._chartTypeDefined){this._chartTypeDefined=true;if(!this._legendPosDefined){if(i===h.Pie||i===h.Donut){this.setLegendPosition(g.Left);}else{this.setLegendPosition(g.None);}}}else if(n==="legendPosition"&&!this._legendPosDefined){this._legendPosDefined=true;}if(this._makitChart){if(n==="type"){var t=i.toLowerCase();var p=null;this._makitChart.setProperty("ChartType",t);if(t==="donut"||t==="pie"){p=t;t="pie";this._makitChart.setProperty("PieStyle",p);}}else if(n==="showRangeSelector"){this._makitChart.showRangeSelectorView(i);}else if(n==="showTableView"){this._makitChart.showTableView(i);}else if(n==="legendPosition"){this._makitChart.setLegend(i.toLowerCase());}else if(n==="width"){this.getDomRef().style.width=this.getWidth();}else if(n==="height"){this._setRealHeight(i);}else if(n==="lineThickness"){this._makitChart.setGraphLineWidth(i);}else if(n==="maxSliceCount"){this._makitChart.setMaxPies(i);}else if(n==="showTableValue"){this._makitChart.showTableValue(i);}else if(n==="primaryColorPalette"){this._makitChart.setPalette(i);}else if(n==="showTotalValue"){this._makitChart.setProperty("ShowTotal",i);}else if(n==="numberOfVisibleCategories"){this._makitChart.setNumberOfVisibleCategories(i);}else if(n==="rangeSelectorStartPosition"){this._makitChart.setRangeSelectorStartPosition(i);}this._makitChart.setSelectedCategoryIndex(this._selectedCatIdx);this._makitChart.refresh();}};j.prototype._onColumnPropChanged=function(o,D){var p=o.mParameters;if(p["name"]=="name"&&this._createRowsCalled){L.info("Column name property is changed due to name has been binded");this._createRows();}};j.prototype._onDataRegionPropChanged=function(o,D){f(D,"oData is expected to be set in _onDataRegionPropChanged");if(!this._makitChart){return;}var p=o.mParameters;if(D["type"]=="values"){var v=o.oSource;var k=this.indexOfValue(v);if(k>-1){this._makitChart.setProperty(D["type"]+"["+k+"]."+p["name"],p["newValue"]);}}else if(D["type"]=="categories"){var l=o.oSource;var k=this.indexOfCategoryRegion(l);var n=p["name"];if(k>-1){if(n=="displayName"){var r=this.getCategoryRegions();var i,s="",t=r.length;for(i=0;i<t;i++){s+=r[i].getDisplayName();if(i!=t-1){s+=" | ";}}this._makitChart.setProperty("category."+n,p["newValue"]);}else{this._makitChart.setProperty(D["type"]+"["+k+"]."+n,p["newValue"]);}}}else{this._makitChart.setProperty(D["type"]+"."+p["name"],p["newValue"]);}};j.prototype._onAxisPropChanged=function(o,D){f(D,"oData is expected to be set in _onAxisPropChanged");if(!this._makitChart){return;}var p=o.mParameters;var n=p["name"].toLowerCase();var v=p["newValue"];var i=D["axis"];if(n==="sortorder"){v=v.toLowerCase();}else if(n==="displayall"){i="categories";n="display";if(!v){v="";}}this._makitChart.setProperty(i+"."+n,v);if(n==="sortorder"){this._setDataTable();}};j.prototype._onValueBubbleChanged=function(o){if(!this._makitChart){return;}var v=this.getValueBubble().toObject();this._makitChart.setValueBubbleStyle(v);if(this._makitChart.isValueBubbleVisible()!=v.visible){this._makitChart.showValueBubble(v.visible);}this._makitChart.refresh();};j.prototype.getSelectedCategory=function(){var s=undefined;if(this._makitChart){s=this._makitChart.getSelectedCategory();}return s;};j.prototype.getSelectedSeries=function(){var s=undefined;if(this._makitChart){s=this._makitChart.getSelectedSeries();}return s;};j.prototype.getNumberOfCategories=function(){var n=undefined;if(this._makitChart){n=this._makitChart.getNumberOfCategories();}return n;};j.prototype.getSelectedCategoryGroup=function(){var s=undefined;if(this._makitChart){s=this._makitChart.getSelectedCategoryGroup();}return s;};return j;});
