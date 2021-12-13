/*!
 * (c) Copyright 2010-2019 SAP SE or an SAP affiliate company.
 */
sap.ui.define(["jquery.sap.global"],function(q){"use strict";q.sap.declare("sap.zen.crosstab.CrosstabHeaderInfo");sap.zen.crosstab.CrosstabHeaderInfo=function(c,h){var C=h.cols;var r=h.rows;var o=null;var R=null;var d={};var D={};var f={};var F={};var a=0;var b=0;var s=0;var A={};var e={};var g={};var j={};var i=0;var k=0;var m;var l;var p;var n={};function t(v){if(!n.hasOwnProperty(v)){n[v]={};}}function u(v,i){if(v[i].charname){v[i].sDimensionName=v[i].charname;delete v[i].charname;t(v[i].sDimensionName);}if(v[i].attrname){v[i].sAttributeName=v[i].attrname;delete v[i].attrname;}if(v[i].iskey){v[i].bIsKeyPresentation=v[i].iskey;delete v[i].iskey;}}if(C){for(i=0;i<C.length;i++){u(C,i);C[i].sAxisName="ROWS";C[i].iIndex=i;o=C[i];d[i]=o;if(f[o.sDimensionName]===undefined){f[o.sDimensionName]=i;}if(A[o.sDimensionName]===undefined){A[o.sDimensionName]=k;j[k]=i;k++;}}b=k;s=0;m=C.length-1;l=C[m].sDimensionName;for(i=m;i>0;i--){p=C[i-1].sDimensionName;if(p!==l){s=i;break;}}}if(r){k=0;for(i=0;i<r.length;i++){u(r,i);r[i].sAxisName="COLS";r[i].iIndex=i;R=r[i];D[i]=R;if(F[R.sDimensionName]===undefined){F[R.sDimensionName]=i;}if(e[R.sDimensionName]===undefined){e[R.sDimensionName]=k;g[k]=i;k++;}}a=k;}this.getDimensionNameByCol=function(v){if(d&&d[v]){return d[v].sDimensionName;}else{return null;}};this.getDimensionNameByRow=function(v){if(D&&D[v]){return D[v].sDimensionName;}else{return null;}};this.getFirstColForDimension=function(l){var v=-1;if(f[l]>=0){v=f[l];}return v;};this.getFirstRowForDimension=function(l){var v=-1;if(F[l]>=0){v=F[l];}return v;};this.getAbsoluteColIndexForDimension=function(l){var v=-1;if(A[l]>=0){v=A[l];}return v;};this.getAbsoluteRowIndexForDimension=function(l){var v=-1;if(e[l]>=0){v=e[l];}return v;};this.getRowForAbsoluteRow=function(v){var w=-1;if(g[v]>=0){w=g[v];}return w;};this.getColForAbsoluteCol=function(v){var w=-1;if(j[v]>=0){w=j[v];}return w;};this.getNumberOfDimensionsOnColsAxis=function(){if(r){return r.length;}return 0;};this.getNumberOfDimensionsOnRowsAxis=function(){if(C){return C.length;}return 0;};this.isColOfInnermostDimension=function(v){var w=this.getDimensionNameByCol(v);if(w){var x=this.getAbsoluteColIndexForDimension(w);if(x!==b-1){return false;}return true;}return false;};this.getStartColForInnermostDimension=function(){return s;};this.isRowOfInnermostDimension=function(v){var w=this.getDimensionNameByRow(v);if(w){var x=this.getAbsoluteRowIndexForDimension(w);if(x!==a-1){return false;}return true;}return false;};this.isBottomRightDimHeaderCell=function(v){return((this.isBottomRowDimHeaderCell(v)===true)&&(this.isRightColDimHeaderCell(v)===true));};this.isBottomRowDimHeaderCell=function(v){var M=c.getTableMaxDimHeaderRow();var I=((v.getTableRow()+v.getRowSpan()-1)===M);return I;};this.isRightColDimHeaderCell=function(v){var M=c.getTableMaxDimHeaderCol();var w=((v.getTableCol()+v.getColSpan()-1)===M);return w;};this.getDimensionInfoForNonSplitPivotCell=function(v){var w;if(v.getScalingAxis()==="ROWS"){w=r[v.getTableRow()];}else if(v.getScalingAxis()==="COLS"){w=C[v.getTableCol()];}return w;};this.getDimensionInfoForSplitPivotCell=function(v,S){var w;if(S){if(S=="ROWS"){w=C[v.getTableCol()];}else if(S=="COLS"){w=r[v.getTableRow()];}}return w;};this.getDimensionInfoByRowCol=function(v,S){var w=null;var x=v.getTableRow();var y=v.getTableCol();if(v.isPivotCell()===true){if(v.isSplitPivotCell()===true){w=this.getDimensionInfoForSplitPivotCell(v,S);}else{w=this.getDimensionInfoForNonSplitPivotCell(v);}}else if(this.isBottomRowDimHeaderCell(v)===true){if(C){w=C[y];}else{w=r[x];}}else if(this.isRightColDimHeaderCell(v)===true){if(r){w=r[x];}else{w=C[y];}}return w;};this.getDimensionInfoByRow=function(v){var w=null;if(r){w=r[v];}return w;};this.getDimensionInfoByCol=function(v){var w=null;if(C){w=C[v];}return w;};this.hasDimensionsOnRowsAxis=function(){if(C){return true;}return false;};this.hasDimensionsOnColsAxis=function(){if(r){return true;}return false;};this.findIndexInterval=function(v,w){var I;var x;var L;var y;var z={"iStartIndex":-1,"iEndIndex":-1};if(w==="ROWS"){x=C;}else if(w==="COLS"){x=r;}L=x.length;y=null;for(I=0;I<L&&z.iStartIndex<0;I++){y=x[I].sDimensionName;if(y===v){z.iStartIndex=I;}}if(z.iStartIndex>=0){for(I=z.iStartIndex;I<L&&z.iEndIndex<0;I++){y=x[I].sDimensionName;if(y!==v){z.iEndIndex=I-1;}}if(z.iEndIndex<0){z.iEndIndex=L-1;}}return z;};this.isEqualDimInfo=function(v,w){if(v.sDimensionName!==w.sDimensionName){return false;}if(v.sAttributeName!==w.sAttributeName){return false;}if(v.bIsKeyPresentation!==w.bIsKeyPresentation){return false;}if(v.bIsTextPresentation!==w.bIsTextPresentation){return false;}if(v.bIsMeasureStructure!==w.bIsMeasureStructure){return false;}if(v.bIsStructure!==w.bIsStructure){return false;}if(v.bIsScaling!==w.bIsScaling){return false;}return true;};this.includeBottomRightCell=function(i,v,w){var x;var y;var I=true;if(this.isBottomRightDimHeaderCell(v)===true){if(!v.isSplitPivotCell()&&i>0){x=w[i];y=w[i-1];I=(x.sDimensionName===y.sDimensionName)&&(!x.bIsScaling);}}return I;};this.getCellsForInterval=function(I,v){var w;var i=I.iStartIndex;var M=c.getTableMaxDimHeaderRow();var x=c.getTableMaxDimHeaderCol();var y=[];var z;var S=I.iStartIndex===I.iEndIndex;while(i<=I.iEndIndex){z=true;if(v==="ROWS"){w=c.getTableCellWithColSpan(M,i);z=S||this.includeBottomRightCell(i,w,C,r);i=i+w.getColSpan();}else if(v==="COLS"){w=c.getTableCellWithRowSpan(i,x);z=S||this.includeBottomRightCell(i,w,r,C);i=i+w.getRowSpan();}if(z===true){y.push(w);}}return y;};this.getCellsWithSameDimensionByDimInfo=function(v){var I;var w;var l;var x;if(v){l=v.sDimensionName;x=v.sAxisName;w=this.findIndexInterval(l,x);I=this.getCellsForInterval(w,x);}return I;};this.getCellsWithSameDimension=function(v,w){var x;var I;if(!w&&v.isPivotCell()===true&&v.isSplitPivotCell()===true){return[];}else{x=this.getDimensionInfoByRowCol(v,w);}I=this.getCellsWithSameDimensionByDimInfo(x);return I;};this.setupPivotCell=function(){var v;var I=false;var w=false;var x=-1;var y=-1;var z;var B;v=c.getTableCellWithSpans(c.getTableMaxDimHeaderRow(),c.getTableMaxDimHeaderCol());if(v){y=v.getTableRow();x=v.getTableCol();if(this.isBottomRightDimHeaderCell(v)===true){I=this.hasDimensionsOnRowsAxis()===true&&this.hasDimensionsOnColsAxis()===true;}v.setPivotCell(I);z=this.getDimensionInfoByCol(x);B=this.getDimensionInfoByRow(y);if(v.isPivotCell()===true){if(!(z&&z.bIsScaling)&&!(B&&B.bIsScaling)){w=true;}}v.setSplitPivotCell(w);if(z&&z.bIsScaling===true){v.setScalingAxis("ROWS");}else if(B&&B.bIsScaling===true){v.setScalingAxis("COLS");}}return v;};this.getDimensionInfoForMemberCell=function(v){if(v.getArea().isRowHeaderArea()){return C[v.getTableCol()];}else if(v.getArea().isColHeaderArea()){return r[v.getTableRow()];}return null;};this.getMemberCellsForSameDimension=function(v){var w;var E;if(v.getArea().isRowHeaderArea()){if(C){E=C[C.length-1].bIsScaling;}w=this.getRowHeaderMemberCellsForSameDimension(v,E);}else if(v.getArea().isColHeaderArea()){if(r){E=r[r.length-1].bIsScaling;}w=this.getColHeaderMemberCellsForSameDimension(v,E);}return w;};this.getRowHeaderMemberCellsForSameDimension=function(v,E){var w;var M;var x;var i=0;var I;var y;var z;w=this.getDimensionInfoByCol(v.getTableCol());I=this.findIndexInterval(w.sDimensionName,"ROWS");x=[];y=c.getRowHeaderArea();z=y.getColCnt()-1;i=I.iStartIndex;while(i<=I.iEndIndex){M=y.getCellWithColSpan(v.getRow(),i);if(M){if(E){if(M.getCol()<z){x.push(M);}}else{x.push(M);}i=i+M.getColSpan();}else{i++;}}return x;};this.getColHeaderMemberCellsForSameDimension=function(v,E){var w;var M;var x;var i=0;var I;var y;var z;w=this.getDimensionInfoByRow(v.getTableRow());I=this.findIndexInterval(w.sDimensionName,"COLS");x=[];y=c.getColumnHeaderArea();z=y.getRowCnt()-1;i=I.iStartIndex;while(i<=I.iEndIndex){M=y.getCellWithRowSpan(i,v.getCol());if(M){if(E){if(M.getRow()<z){x.push(M);}}else{x.push(M);}i=i+M.getRowSpan();}else{i++;}}return x;};this.findStartIndexOfPreviousDimension=function(v,w){var I;var M;var i;var x;var y;var z=0;var P;if(w==="ROWS"){I=C;}else if(w==="COLS"){I=r;}if(I){M=I.length-1;i=M;x=false;while(i>=0&&!x){y=I[i];if(y.sDimensionName===v){x=true;}else{i--;}}while(y.sDimensionName===v&&i>=0){y=I[i];if(y.sDimensionName===v){i--;}}P=y.sDimensionName;while(y.sDimensionName===P&&i>=0){y=I[i];if(y.sDimensionName!==P){z=i+1;}else{i--;}}}return z;};this.isFirstDimensionOnAxis=function(v){if(v.sAxisName==="ROWS"&&C){return C[0].sDimensionName===v.sDimensionName;}else if(v.sAxisName==="COLS"&&r){return r[0].sDimensionName===v.sDimensionName;}return true;};this.isDimensionInCrosstab=function(v){if(n){if(n.hasOwnProperty(v)){return true;}}return false;};this.hasOnlyMeasureStructure=function(){var I=null;var i=0;var H=false;if(!C&&r){I=r;}else if(!r&&C){I=C;}if(I&&I.length>0){H=true;for(i=0;i<I.length;i++){if(!I[i].bIsMeasureStructure){H=false;break;}}}return H;};};return sap.zen.crosstab.CrosstabHeaderInfo;});
