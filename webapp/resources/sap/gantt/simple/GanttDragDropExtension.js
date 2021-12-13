/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)

		(c) Copyright 2009-2015 SAP SE. All rights reserved
	
 */
sap.ui.define(["sap/ui/thirdparty/jquery","sap/ui/events/KeyCodes","sap/ui/core/Core","sap/gantt/library","./GanttExtension","./CoordinateUtils","./GanttUtils","sap/gantt/misc/Format","./RenderUtils","sap/gantt/misc/Utility"],function(q,K,C,l,G,a,b,F,R,U){"use strict";var _=".sapGanttDragDrop";var e=["mousemove","mouseup","keydown"];var m="mousedown";var B=e.reduce(function(g,n){g[n]=n;return g;},{});B[m]=m;var E=e.map(function(s){return s+_;});var M=m+_;var I=3;var c=l.dragdrop.GhostAlignment;var S=l.dragdrop.SnapMode;var D=sap.gantt.DragOrientation;var d={dispatchEvent:function(o){var g=this._getDragDropExtension();if(o.type===B.mousedown){g.onMouseDown(o);}else if(o.type===B.mousemove){g.onMouseMove(o);}else if(o.type===B.mouseup){g.onMouseUp(o);}else if(o.type===B.keydown){g.onKeydown(o);}},addEventListeners:function(g){this.removeEventListeners(g);var s=q(g._getDragDropExtension().getDomRefs().ganttSvg);s.on(M,d.dispatchEvent.bind(g));var h=q(g._getDragDropExtension().getDomRefs().headerSvg);h.on(M,d.dispatchEvent.bind(g));},removeEventListeners:function(g){var s=q(g._getDragDropExtension().getDomRefs().ganttSvg);s.off(_);var h=q(g._getDragDropExtension().getDomRefs().headerSvg);h.off(_);},addDragDropEventListeners:function(g){this.removeDragDropEventListeners(g);E.forEach(function(s){q(document).on(s,d.dispatchEvent.bind(g));});},removeDragDropEventListeners:function(g){E.forEach(function(s){q(document).off(s);});}};var f=G.extend("sap.gantt.simple.GanttDragDropExtension",{_init:function(g,s){this._initDragStates();return"DragDropExtension";},_attachEvents:function(){var g=this.getGantt();d.addEventListeners(g);},_detachEvents:function(){var g=this.getGantt();d.removeEventListeners(g);}});f.prototype._initDragStates=function(){this.bDragging=false;this.adhocLineDrag=false;this.deltaLineDrag=false;this.adhocLineDragStart=false;this.deltaLineDragStart=false;this.isCursorlineDisabled=false;this.bElementDraggable=false;this.oAdhocLineElmDraggable=false;this.oDeltaLineElmDraggable=false;this.oMouseDownTarget=null;this.oLastDraggedShapeData=null;this.mDragPoint={};this.bDragging=false;this.dragGhost=null;this.prevDragPoint={};this.snapTimer=null;this.snapVal=0;this.isSnapping=false;this.cursorLineSnapPoint=null;};f.prototype.onAdhocMarkerMouseDown=function(o){var p=a.getEventSVGPoint(this.getDomRefs().headerSvg,o),g=o.target.getBBox();this.oMouseDownTarget=o.target;var s=C.byId(this.oMouseDownTarget.id),h={x:0,y:0};if(s){h=U.getShapeBias(s);}this.mDragPoint={cursorX:p.x,cursorY:p.y,shapeX:g.x,shapeY:g.y,shapeWidth:g.width,shapeBias:h};d.addDragDropEventListeners(this.getGantt());this.adhocLineDrag=true;};f.prototype.onDeltaAreaMouseDown=function(o){var p=a.getEventSVGPoint(this.getDomRefs().headerSvg,o),g=o.target.getBBox();this.oMouseDownTarget=o.target;var s=C.byId(this.oMouseDownTarget.id),h={x:0,y:0};if(s){h=U.getShapeBias(s);}this.mDragPoint={cursorX:p.x,cursorY:p.y,shapeX:g.x,shapeY:g.y,shapeWidth:g.width,shapeBias:h};var i=s.getParent();this.oLastDraggedShapeData={timeStamp:i.getTimeStamp(),endTimeStamp:i.getEndTimeStamp()};d.addDragDropEventListeners(this.getGantt());this.deltaLineDrag=true;};f.prototype.onAdhocLineDrop=function(o){if(this.oMouseDownTarget){var g=q(this.oMouseDownTarget).control(0,true).getParent();var h=this._getAdhocDropData(o);if(h){g.fireAdhoclineDrop(h);}if(this.isCursorlineDisabled){this.getGantt().setEnableCursorLine(true);}this.stopDragging();}};f.prototype.onDeltaLineDrop=function(o){if(this.oMouseDownTarget){var g=q(this.oMouseDownTarget).control(0,true).getParent();var h=this._getDeltaMarkerDropEvent(o);if(h){g.fireDeltalineDrop(h);}if(this.isCursorlineDisabled){this.getGantt().setEnableCursorLine(true);}this.stopDragging();}};f.prototype.onAdhocLineMove=function(o){if(!this.adhocLineDragStart){this.dragGhost=this.createDragGhost(this.oMouseDownTarget);this._hideScrollBarOnBody(true);this.adhocLineDragStart=true;if(this.getGantt().getEnableCursorLine()){this.getGantt().setEnableCursorLine(false);this.isCursorlineDisabled=true;}}else{this.onLineDrag(o);}};f.prototype.onDeltaLineMove=function(o){if(!this.deltaLineDragStart){this.dragGhost=this.createDragGhost(this.oMouseDownTarget);this._hideScrollBarOnBody(true);this.deltaLineDragStart=true;if(this.getGantt().getEnableCursorLine()){this.getGantt().setEnableCursorLine(false);this.isCursorlineDisabled=true;}}else{this.onLineDrag(o);}};f.prototype.onLineDrag=function(o){if(this.isValidDropZoneForLines(o)){this.updateCursorStyle("Move");this.updateHeaderCursorStyle("Move");}else{this.updateCursorStyle("not-allowed");this.updateHeaderCursorStyle("not-allowed");}this.showGhost(o);};f.prototype.onMouseDown=function(o){if(o.button!==0){return;}this._bGhostsPositioned=false;this.bMultipleGhosts=false;if(this.isEventTargetAdhocLine(o)){this.oAdhocLineElmDraggable=this.isAdhocLineDraggable(o);if(this.oAdhocLineElmDraggable){this.onAdhocMarkerMouseDown(o);return;}}if(this.isEventTargetDeltaLine(o)){this.oDeltaLineElmDraggable=this.isDeltaLineDraggable(o);if(this.oDeltaLineElmDraggable){this.onDeltaAreaMouseDown(o);return;}}if(!this.getGantt().getEnableSelectAndDrag()){var g=this.getShapeElementByTarget(o.target);if(g){this.shapeSelectedOnMouseDown=true;this.initiallySelected=g.getSelected();this.getGantt().getSelection().updateShape(g.getShapeUid(),{selected:true,ctrl:o.ctrlKey||o.metaKey,draggable:g.getDraggable(),time:g.getTime(),endTime:g.getEndTime()});}}this.bElementDraggable=this.isEventTargetDraggable(o);if(this.bElementDraggable){var p=a.getEventSVGPoint(this.getDomRefs().ganttSvg,o);var h=this.getDraggableDOMElement(o.target),s=C.byId(h.id),i=s.getDomRef("nonLabelGroup")?s.getDomRef("nonLabelGroup").getBBox():h.getBBox(),j={x:0,y:0};if(s){j=U.getShapeBias(s);}this.mDragPoint={cursorX:p.x,cursorY:p.y,shapeX:i.x,shapeY:i.y,shapeWidth:i.width,shapeBias:j};var g=this.getShapeElementByTarget(h);this.oMouseDownTarget=h;this.oLastDraggedShapeData={shapeUid:g.getShapeUid(),startTime:g.getTime(),endTime:g.getEndTime()};this.oSourceRow=this.getRowByShape(g);if(this.getGantt().getDragOrientation()===D.Horizontal){this.oCurrentRow=b.getRowInstancefromShape(g);}var k=b.getShapesWithUid(this._gantt.getId(),this._gantt.getSelectedShapeUid());this._aVisibleDraggableShapes=[];k.forEach(function(s){if(s&&s.getDraggable()&&s.sParentAggregationName!=="relationships"){this._aVisibleDraggableShapes.push(s);}}.bind(this));this.bMultipleGhosts=this._aVisibleDraggableShapes.length>1;this.mGhostLabelStyle={};d.addDragDropEventListeners(this.getGantt());}};f.prototype.updateCursorStyle=function(s,p){document.body.style.cursor=s;this.getDomRefs().ganttSvg.style.cursor=s;if(p){this.getDomRefs().ganttChart.style.pointerEvents=p;this.getDomRefs().gantt.style.pointerEvents="auto";this._bArePointerEventsDisabled=true;if(this.getDomRefs().ganttChartContainerToolbar){this.getDomRefs().ganttChartContainerToolbar.style.pointerEvents=p;}}else{if(this._bArePointerEventsDisabled){this.getDomRefs().ganttChart.style.removeProperty("pointer-Events");this.getDomRefs().gantt.style.removeProperty("pointer-Events");this._bArePointerEventsDisabled=false;if(this.getDomRefs().ganttChartContainerToolbar){this.getDomRefs().ganttChartContainerToolbar.style.removeProperty("pointer-Events");}}}};f.prototype.updateHeaderCursorStyle=function(s,p){this.getDomRefs().headerSvg.style.cursor=s;if(p){this.getDomRefs().ganttChart.style.pointerEvents=p;this.getDomRefs().gantt.style.pointerEvents="auto";this._bArePointerEventsDisabled=true;if(this.getDomRefs().ganttChartContainerToolbar){this.getDomRefs().ganttChartContainerToolbar.style.pointerEvents=p;}}else{if(this._bArePointerEventsDisabled){this.getDomRefs().ganttChart.style.removeProperty("pointer-Events");this.getDomRefs().gantt.style.removeProperty("pointer-Events");this._bArePointerEventsDisabled=false;if(this.getDomRefs().ganttChartContainerToolbar){this.getDomRefs().ganttChartContainerToolbar.style.removeProperty("pointer-Events");}}}};f.prototype.onMouseMove=function(o){if(this.skipEvent(o)){return;}if(!!this.adhocLineDrag&&!!this.oMouseDownTarget){this.onAdhocLineMove(o);return;}if(!!this.deltaLineDrag&&!!this.oMouseDownTarget){this.onDeltaLineMove(o);return;}if(this.bDragging===false){var n=a.getEventSVGPoint(this.getDomRefs().ganttSvg,o),g=this.isExceedDraggingThreshold(n),s=g&&this.isAllowedVerticalOrentationDrag();this.bDragging=s;this._aShapeNodes=[];this._aGhostImages=[];if(s&&this.oMouseDownTarget){this._hideScrollBarOnBody(true);var t=C.byId(this.oMouseDownTarget.id);this.oTargetDom=t.getDomRef("nonLabelGroup")?t.getDomRef("nonLabelGroup"):this.oMouseDownTarget;this.dragGhost=this.createDragGhost(this.oTargetDom,true);var T=this.oTargetDom.getBBox();if(this.bMultipleGhosts){var h=U.getShapeBias(t);this._coordinateDiff={};var r=C.getConfiguration().getRTL();var x=r?T.x+h.x+T.width:T.x+h.x;var y=T.y+h.y;this._aVisibleDraggableShapes.forEach(function(k){if(k.getId()!==this.oMouseDownTarget.id){var p=k.getDomRef("nonLabelGroup")?k.getDomRef("nonLabelGroup"):document.getElementById(k.getId());this.createDragGhost(p,false);var w=r?p.getBBox().width:0;h=U.getShapeBias(k);var u={xDiff:p.getBBox().x+h.x+w-x,yDiff:p.getBBox().y+h.y-y,shape:k};this._coordinateDiff[k.getId()]=u;}}.bind(this));}this._bFirstTimeDrag=true;var i=this._getDragStartEventData(o);if(i){this.getGantt().fireDragStart(i);}}else if(g){this.updateCursorStyle("not-allowed","none");}}else{var j=a.getEventSVGPoint(this.getDomRefs().ganttSvg,o);if(Object.keys(this.prevDragPoint).length===0||this.prevDragPoint.cursorX!==j.x||this.prevDragPoint.cursorY!==j.y){this.prevDragPoint={cursorX:j.x,cursorY:j.y};if(this.bMultipleGhosts&&this._bFirstTimeDrag){this.iGhostTimer=window.setTimeout(function(){this._updateGhostShapesPosition();}.bind(this),100);this._bGhostsPositioned=true;}this._bFirstTimeDrag=false;this.onDragging(o);}}};f.prototype._updateGhostShapesPosition=function(){var s=document.getElementsByClassName("sapGanttDragGhost");var g=document.getElementById("sapGanttDragGhostWrapper");if(g){var h=[],i;for(i=0;i<s.length;i++){h.push(s[i].offsetHeight);}while(document.getElementsByClassName("sapGanttDragGhost").length>1){g.lastElementChild.remove();}var j=h[0];for(i=1;i<this._aShapeNodes.length;i++){var o=this._aShapeNodes[i];var x=this._coordinateDiff[o.id].xDiff;var y=this._coordinateDiff[o.id].yDiff;var O={left:x+"px",top:y-j+"px"};var L=this._getGhostLabel(this._coordinateDiff[o.id].shape,o);var k="<div class='sapGanttDragGhost'>"+"<img class='sapGanttDragGhostImg' src='"+this._aGhostImages[i]+"'>"+L+"</div>";g.insertAdjacentHTML('beforeend',k);g.lastElementChild.style.left=O.left;g.lastElementChild.style.top=O.top;if(L!==""){this._updateGhostLabelStyle();}j+=h[i];}g.classList.remove("sapGanttDragElementHidden");}};f.prototype._getGhostLabel=function(s,o){if(!this.getGantt().getShowTextOnGhost()){return"";}var L="",t="",g="13px",h="#000",i="Arial";var v=s.getVerticalTextAlignment();var T=o.nextSibling;if(T&&T.tagName==="text"&&s.getShowTitle()&&s.getTitle()&&s.getTitle().length&&T.textContent&&T.textContent.length){t=T.textContent;g=T.style.fontSize||g;h=T.style.fill||h;i=T.style.fontFamily||i;}else{return L;}var r=C.getConfiguration().getRTL();var j="0px",k="0px";if(r){j=(o.getBBox().x-s.getXBias()+o.getBBox().width)-(T.getBBox().x+T.getBBox().width)+"px";}else{k=T.getBBox().x-(o.getBBox().x+s.getXBias())+"px";}var V=o.getBBox().height-T.getBBox().height;if(v==="Top"){V=0;}else if(v==="Center"){V=V/2;}this.mGhostLabelStyle={fontSize:g,color:h,fontFamily:i,top:V+"px",right:j,left:k};L="<div class='sapGanttDragGhostLabel'>"+t+"</div>";return L;};f.prototype._updateGhostLabelStyle=function(){var g=document.getElementsByClassName("sapGanttDragGhostLabel");var o=g[g.length-1];for(var s in this.mGhostLabelStyle){o.style[s]=this.mGhostLabelStyle[s];}};f.prototype.onMouseUp=function(o){if(this.bElementDraggable===true&&this.bDragging===false){this.stopDragging(o);this._initDragStates();return;}if(!!this.adhocLineDragStart&&!!this.oMouseDownTarget){this.onAdhocLineDrop(o);this._initDragStates();return;}if(!!this.deltaLineDragStart&&!!this.oMouseDownTarget){this.onDeltaLineDrop(o);this._initDragStates();return;}var g=this._getShapeDropEventData(o);this.stopDragging(o);if(g){this.getGantt().fireShapeDrop(g);}if(this.oMouseDownTarget){var h=this.getShapeElementByTarget(this.oMouseDownTarget);if(h){b.rerenderAssociatedRelationships(this.getGantt(),h);}}this._initDragStates();};f.prototype._getDragStartEventData=function(o){return{sourceGanttChart:this.getGantt(),draggedShapeDates:this._getDraggedShapeDates(),lastDraggedShapeUid:this.oLastDraggedShapeData.shapeUid,cursorDateTime:this._getGhostTime(o).cursorTime};};f.prototype._getShapeDropEventData=function(o){if(this.isValidDropZone(o)){var g=this.getGantt();var h;var s=this._getDraggedShapeDates();var t=this.getGanttChartByTarget(o.target);if(this.getGantt().getDragOrientation()===D.Horizontal){h=this.oCurrentRow;}else{h=b.getRowInstance(o,t.getTable());}var T=this.getShapeElementByTarget(o.target);var i=this._getGhostTime(o);return{sourceGanttChart:g,targetGanttChart:t,draggedShapeDates:s,lastDraggedShapeUid:this.oLastDraggedShapeData.shapeUid,targetRow:h,cursorDateTime:i.cursorTime,newDateTime:i.newDateTime,targetShape:T,sourceRowData:this.oSourceRow};}};f.prototype._getAdhocDropData=function(o){if(this.isValidDropZoneForLines(o)){var g=this.getGantt();var A=g.getAxisTime();var p=a.getEventSVGPoint(this.getDomRefs().headerSvg,o);var h=F.dateToAbapTimestamp(A.viewToTime(this.mDragPoint.cursorX));var i=F.dateToAbapTimestamp(A.viewToTime(p.x));return{newTimeStamp:i,oldTimeStamp:h};}};f.prototype._getGhostTime=function(o,p){var g=this.getGantt();var t=this.getGanttChartByTarget(o.target);var h=t!=null?(t.getId()!==g.getId()):false;var A=h?t.getAxisTime():g.getAxisTime();var i=h?window.document.getElementById(t.getId()+"-svg"):window.document.getElementById(g.getId()+"-svg");var s=this.mDragPoint.shapeBias.x;var j=p?a.getEventSVGPoint(i,o).x:a.getEventSVGPoint(i,o).x-s;if(g.getSnapMode()!==S.None){j=j-this.snapVal;}var k=A.viewToTime(j);var n=k;var r=C.getConfiguration().getRTL();var u=this.mDragPoint.shapeX+s,v=r?-this.mDragPoint.shapeWidth:this.mDragPoint.shapeWidth,w=this.mDragPoint.cursorX;var x=k;var y=k;var z=this.oLastDraggedShapeData.endTime-this.oLastDraggedShapeData.startTime;if(this.getGantt().getDragOrientation()===D.Vertical){x=this.oLastDraggedShapeData.startTime;y=this.oLastDraggedShapeData.endTime;n=x;}else{if(this.getGantt().getGhostAlignment()===c.Start){y=z?new Date(x.getTime()+z):A.viewToTime(j+v);n=k;}else if(this.getGantt().getGhostAlignment()===c.End){x=z?new Date(y.getTime()-z):A.viewToTime(j-v);n=k;}else if(this.getGantt().getGhostAlignment()===c.None){var N=r?(j-v-(w-u)):(j-(w-u));var H=A.viewToTime(N);x=H;y=z?new Date(x.getTime()+z):A.viewToTime(N+v);n=H;}}return{newDateTime:n,cursorTime:k,time:x,endTime:y};};f.prototype._getDeltaMarkerDropEvent=function(o){if(this.isValidDropZoneForLines(o)){var g=q(this.oMouseDownTarget).control(0,true).getParent();var r=C.getConfiguration().getRTL();var A=this.getGantt().getGhostAlignment();var h=this.getGantt().getAxisTime();var p=a.getEventSVGPoint(this.getDomRefs().headerSvg,o);var s,i;var j=this.mDragPoint.shapeWidth,k=this.mDragPoint.shapeX,n=this.mDragPoint.cursorX;if(A===c.Start){s=r?(p.x-j):p.x;i=r?p.x:p.x+j;}else if(A===c.None){s=p.x+(k-n);i=s+j;}else if(A===c.End){s=r?p.x:(p.x-j);i=r?p.x+j:p.x;}return{newStartTime:F.dateToAbapTimestamp(h.viewToTime(r?i:s)),newEndTime:F.dateToAbapTimestamp(h.viewToTime(r?s:i)),oldStartTime:g.getTimeStamp(),oldEndTime:g.getEndTimeStamp()};}};f.prototype._getDraggedShapeDates=function(){var s=this.getGantt().getSelection();var g=s.allSelectedDraggableUid();var o={};g.forEach(function(u){var h=s.getSelectedShapeDataByUid(u);o[u]={time:h.time,endTime:h.endTime};});return o;};f.prototype.getDroppedShapeStartTime=function(i,A,o){if(this.getGantt().getGhostAlignment()===c.None){var s=this.mDragPoint.shapeX,g=this.mDragPoint.shapeWidth,h=this.mDragPoint.cursorX;var r=C.getConfiguration().getRTL();var n=r?(i+g-(h-s)):(i-(h-s));var N=A.viewToTime(n),j=F.abapTimestampToDate(N);return j;}return o;};f.prototype.isValidDropZone=function(o){return q(o.target).closest("svg.sapGanttChartSvg").length===1;};f.prototype.isValidDropZoneForLines=function(o){return(q(o.target).closest("svg.sapGanttChartHeaderSvg").length===1||q(o.target).closest("svg.sapGanttChartSvg").length===1);};f.prototype._hideScrollBarOnBody=function(h){q(document.body).toggleClass("sapGanttDraggingOverflow",h);};f.prototype.onKeydown=function(o){if(this.skipEvent(o)){return;}if(o.keyCode===K.ESCAPE){this.stopDragging(o);this._initDragStates();}};f.prototype.stopDragging=function(o){this._enableTextSelection();this._avoidShapeSelectionAfterDragging();this.removeGhost();this.updateCursorStyle("default");this.updateHeaderCursorStyle("default");this._hideScrollBarOnBody(false);this._stopAutoScroll();d.removeDragDropEventListeners(this.getGantt());};f.prototype._avoidShapeSelectionAfterDragging=function(){if(this.bDragging&&this.oMouseDownTarget){var o=this.getShapeElementByTarget(this.oMouseDownTarget);window.setTimeout(function(){if(o){window.clearTimeout(o.iSingleClickTimer);}},100,this);}};f.prototype.isEventTargetDraggable=function(o){var s=this.getShapeElementByTarget(o.target);if(s){return s.getDraggable()&&(s.getSelected()||!this.getGantt().getEnableSelectAndDrag());}return false;};f.prototype.getShapeElementByTarget=function(t){return q(this.getDraggableDOMElement(t)).control(0,true);};f.prototype.getGanttChartByTarget=function(t){return q(t).closest("svg.sapGanttChartSvg").control(0,true);};f.prototype.isEventTargetAdhocLine=function(o){return(q(o.target).control(0,true)&&q(o.target).control(0,true).sParentAggregationName==='_marker');};f.prototype.isEventTargetDeltaLine=function(o){return(q(o.target).control(0,true)&&q(o.target).control(0,true).sParentAggregationName==='_headerDeltaArea');};f.prototype.isAdhocLineDraggable=function(o){var A=q(o.target).control(0,true).getParent();return A.getDraggable()&&A._getSelected();};f.prototype.isDeltaLineDraggable=function(o){var g=q(o.target).control(0,true).getParent();return(g.getDraggable()&&g._getIsSelected());};f.prototype.getDraggableDOMElement=function(t){return q(t).closest("["+b.SHAPE_ID_DATASET_KEY+"]").get(0);};f.prototype.isExceedDraggingThreshold=function(p){return Math.abs(p.x-this.mDragPoint.cursorX)>I||Math.abs(p.y-this.mDragPoint.cursorY)>I;};f.prototype.onDragging=function(o){if(this.dragGhost){this.isSnapping=false;var p=this.getGantt()._getPointerExtension();if(p.isPointerInGanttChart()===false){this.updateCursorStyle("not-allowed","none");this.updateHeaderCursorStyle("not-allowed","none");this._stopAutoScroll();}else{this.updateCursorStyle("move");}this.showGhost(o);this._disableTextSelection();if(this.getGantt().getSnapMode()!==S.None){this.executeSnappingEffect(o);}}};f.prototype.executeSnappingEffect=function(o){if(this.snapTimer){window.clearTimeout(this.snapTimer);this.snapTimer=null;}this.snapTimer=window.setTimeout(function(){this.showGhost(o,true);}.bind(this),100);};f.prototype._stopAutoScroll=function(){var p=this.getGantt()._getPointerExtension();p._bAutoScroll=false;};f.prototype.isDragging=function(){return this.bDragging;};f.prototype.isAdhocLineDragging=function(){return this.adhocLineDragStart;};f.prototype.isDeltaLineDragging=function(){return this.deltaLineDragStart;};f.prototype.skipEvent=function(o){return this.bElementDraggable===false&&this.oAdhocLineElmDraggable===false&&this.oDeltaLineElmDraggable===false;};f.prototype.showGhost=function(o,i){var A=this.getGantt().getGhostAlignment();var g=document.getElementById("sapGanttDragGhostWrapper");var O=(this.adhocLineDragStart||this.deltaLineDragStart)?this.calcGhostAligmentForLines(o,A):this.calcGhostOffsetByAlignment(o,A,i);if(this.adhocLineDragStart||this.deltaLineDragStart){var t=b.getTimeLabel(o,this.getGantt().getAxisTime(),this.getGantt().getLocale(),this.getDomRefs().headerSvg);document.getElementById("sapGanttDragText").innerText=t;}g.style.left=O.left;g.style.top=O.top;if(!this._bGhostsPositioned){g.classList.remove("sapGanttDragElementHidden");}};f.prototype.calcGhostAligmentForLines=function(o,A){var r=C.getConfiguration().getRTL();var i=a.xPosOfEvent(o);if(this.adhocLineDragStart){i-=(this.mDragPoint.shapeWidth/2);}if(this.deltaLineDragStart){var s=this.mDragPoint.shapeWidth,g=this.mDragPoint.shapeX,h=this.mDragPoint.cursorX;if(A===c.Start){i=r?(i-s):i;}else if(A===c.None){i=i+(g-h);}else if(A===c.End){i=r?i:(i-s);}}var j=a.getSvgScreenPoint(this.getDomRefs().headerSvg,{pageX:this.mDragPoint.cursorX,clientX:this.mDragPoint.cursorX,pageY:this.mDragPoint.cursorY,clientY:this.mDragPoint.cursorY});return{left:i+"px",top:j.y+"px"};};f.prototype.calcGhostOffsetByAlignment=function(o,A,i){var r=C.getConfiguration().getRTL();var s=this.mDragPoint.shapeWidth,g=this.mDragPoint.shapeX+this.mDragPoint.shapeBias.x,h=this.mDragPoint.cursorX;var j;var k=document.getElementById("sapGanttDragGhostWrapper").offsetWidth-document.getElementsByClassName("sapGanttDragGhostImg")[0].offsetWidth;var n=a.xPosOfEvent(o);if(this.getGantt().getDragOrientation()===D.Vertical){var p=a.getSvgScreenPoint(this.getDomRefs().ganttSvg,{pageX:this.mDragPoint.shapeX,clientX:this.mDragPoint.shapeX,pageY:this.mDragPoint.shapeY,clientY:this.mDragPoint.shapeY});j=p.x+this.mDragPoint.shapeBias.x;}else{if(A===c.Start){j=r?(n-s):n;}else if(A===c.None){j=n+(g-h);}else if(A===c.End){j=r?n:(n-s);}}var t=(a.getEventPosition(o).pageY-2);if(this.getGantt().getDragOrientation()===D.Horizontal){var u=a.getSvgScreenPoint(this.getDomRefs().ganttSvg,{pageX:this.mDragPoint.shapeX,clientX:this.mDragPoint.shapeX,pageY:this.mDragPoint.shapeY,clientY:this.mDragPoint.shapeY});t=u.y+this.mDragPoint.shapeBias.y;}if(i){this._generateSnapvalue(o,s);j=j-this.snapVal;}if(r&&this.bMultipleGhosts){j=j-k;}return{left:j+"px",top:t+"px"};};f.prototype._getSnapOffsetByAligment=function(g,A){var s={};var i=this.mDragPoint.shapeWidth;var h=C.getConfiguration().getRTL();if(A===c.Start){s.xPosStart=g.x;s.xPosEnd=h?(g.x-i):(g.x+i);}else if(A===c.End){s.xPosStart=h?(g.x+i):(g.x-i);s.xPosEnd=g.x;}else if(A===c.None){s.xPosStart=g.x-(this.mDragPoint.cursorX-this.mDragPoint.shapeX-this.mDragPoint.shapeBias.x);s.xPosEnd=s.xPosStart+i;}return s;};f.prototype._getSnappedTime=function(t,s,g,T){var h,i;var j=t%s;if(j>(s/2)){i=s-j;h=new Date(g.getTime()+(i*T));}else{i=j;h=new Date(g.getTime()-(i*T));}return h;};f.prototype._computeSnapping=function(g,r,h){var o=this.getGantt();var i=C.getConfiguration().getRTL();var A=this.getGantt().getGhostAlignment();var s=this.mDragPoint.shapeWidth;var j,k;if(o.getSnapMode()===S.Left){j=i?r-1:g-1;k=i?(h.x-j-s):(h.x-j);}else if(o.getSnapMode()===S.Right){j=i?g+1:r+1;k=i?(h.x-j):(h.x-j+s);}else{if(Math.abs(g)<Math.abs(r)){j=i?g-1:g-1;k=i?(h.x-j):(h.x-j);}else{j=i?r-1:r+1;k=i?(h.x-j-s):(h.x-j+s);}}if(Math.abs(j)<Math.abs(this.snapVal)){this.snapVal=j;if(A===c.Start){this.cursorLineSnapPoint=k;}else if(A===c.End){this.cursorLineSnapPoint=i?(k+s):(k-s);}else if(A===c.None){this.cursorLineSnapPoint=i?(k-this.mDragPoint.cursorX):(k-(this.mDragPoint.cursorX-this.mDragPoint.shapeX));}}};f.prototype._computeSnapByTime=function(s,g,h,i){var j=C.getConfiguration().getRTL();var o=this.getGantt();var A=o.getAxisTime();var k=(i[h].timeInterval)/60;var T=60000;var n=A.viewToTime(s.xPosStart);var p=A.viewToTime(s.xPosEnd);var r=n.getMinutes();var t=p.getMinutes();if(k>60){r=n.getHours();t=p.getHours();k=k/60;if(r%k===0||t%k===0){r=n.getMinutes()%30;t=p.getMinutes()%30;n.setMinutes(r);p.setMinutes(t);k=60;}else{n.setMinutes(0);p.setMinutes(0);T=3600000;}}else if(k<1){r=n.getSeconds();t=p.getSeconds();T=1000;k=k*60;}else{n.setSeconds(0);p.setSeconds(0);}if(r%k!==0||t%k!==0){var u=j?this._getSnappedTime(t,k,p,T):this._getSnappedTime(r,k,n,T);var v=j?this._getSnappedTime(r,k,n,T):this._getSnappedTime(t,k,p,T);var w=A.timeToView(u);var x=A.timeToView(v);if(j){this._computeSnapping(s.xPosEnd-w-1,s.xPosStart-x+1,g);}else{this._computeSnapping(s.xPosStart-w+1,s.xPosEnd-x-1,g);}g.x=g.x-this.snapVal;o._getPointerExtension()._toggleCursorLine(true,g);this.isSnapping=true;}else{this.snapVal=0;}};f.prototype._generateSnapvalue=function(o){var i=C.getConfiguration().getRTL();var A=this.getGantt().getGhostAlignment();var s=this.getDomRefs().ganttSvg;var g=a.getEventSVGPoint(s,o);var h=this._getSnapOffsetByAligment(g,A);var j=h.xPosStart;var k=h.xPosEnd;var y=g.y;var n=this.getGantt();var p=n._getPointerExtension();var r=n.getAxisTime();var t=r.getCurrentTickTimeIntervalKey();var u=n.getSnapTimeInterval();var z=r.getZoomStrategy();this.snapVal=Number.MAX_SAFE_INTEGER/2;if(u[t]&&u[t].timeInterval){this._computeSnapByTime(h,g,t,u);return;}var v=R.getGanttRenderWidth(n);var T=r.getTickTimeIntervalLabel(z.getTimeLineOption(),null,[0,v]);var w=T[1];w.forEach(function(x){this._computeSnapping(j-x.value,k-x.value,g);}.bind(this));var H=b.getVisibleElements(s,".sapGanttChartDeltaLine",".baseShapeSelection");H.forEach(function(O){var x=O.getBBox().x;this._computeSnapping(j-x,k-x,g);}.bind(this));var J=b.getVisibleElements(s,".sapGanttChartAdhocLine",".baseShapeSelection");J.forEach(function(O){var x=O.getBBox().x;this._computeSnapping(j-x,k-x,g);}.bind(this));var L=b.getVisibleElements(s,".sapGanttChartShapes",".baseShapeSelection");L.forEach(function(x){var O=x.getBBox().x,P=O+x.getBBox().width,Q=x.getBBox().y,V=Q+x.getBBox().height;var W=y+x.getBBox().height;if((y>Q&&y<V)||(W>Q&&W<V)){var X=i?(j-O):(j-P);var Y=i?(k-P):(k-O);this._computeSnapping(X,Y,g);}}.bind(this));var N=b.getVisibleElements(s,".calendarPattern","rect");N.forEach(function(x){var O=x.getBBox().x,P=O+x.getBBox().width;var Q=i?(j-O):(j-P);var V=i?(k-P):(k-O);this._computeSnapping(Q,V,g);}.bind(this));g.x=this.cursorLineSnapPoint;p._toggleCursorLine(true,g);this.isSnapping=true;};f.prototype.removeGhost=function(){this.dragGhost=null;var g=document.getElementById("sapGanttDragGhostWrapper");if(g){g.parentNode.removeChild(g);}};f.prototype.createDragGhost=function(L,t){var o=q("<div id='sapGanttDragGhostWrapper' class='sapGanttDragElementHidden'></div>");if(!this.bMultipleGhosts||t){q(document.body).append(o);}var g=document.createElement("canvas");var h=L.getBBox();g.width=this.normalizeGhostImageWidth(h.width);g.height=h.height;if(this.adhocLineDrag){var i=q(this.oMouseDownTarget).control(0,true).getParent()._getLine();var j=document.getElementById(i.sId);var k=q(this.oMouseDownTarget).control(0,true).getParent()._getHeaderLine();var n=document.getElementById(k.sId);var p=j.getBBox();var r=n.getBBox();g.height+=p.height+r.height;}if(this.deltaLineDrag){var s=q(this.oMouseDownTarget).control(0,true).getParent();var u=s._getStartLine();var v=s._getEndLine();var H=s._getHeaderStartLine();var w=s._getHeaderEndLine();var x=document.getElementById(u.sId);var y=document.getElementById(v.sId);var z=document.getElementById(H.sId);var A=document.getElementById(w.sId);var J={headerStartLine:z,startLine:x,headerEndLine:A,endLine:y};var N=z.getBBox();var O=x.getBBox();g.height+=O.height+N.height;}this.createGhostImage(L,g,n,j,J,t);return o;};f.prototype.normalizeGhostImageWidth=function(w){return w;};f.prototype.createGhostImage=function(L,g,h,i,j,t){var s=this.serializeClonedSvg(g,L,h,i,j);var k=this._b64EncodeUnicode(s);var n="data:image/svg+xml;base64,"+k;this.appendGhostImageToWrapper(L,n,t);};f.prototype._b64EncodeUnicode=function(s){return btoa(encodeURIComponent(s).replace(/%([0-9A-F]{2})/g,function t(g,p){return String.fromCharCode('0x'+p);}));};f.prototype.appendGhostImageToWrapper=function(L,g,t){var o=document.getElementById("sapGanttDragGhostWrapper");var s=this._getDragTextOverlayStyle(L);var T=t?"":"<div id='sapGanttDragText' class='sapGanttDragTextOverlay "+s.css+"'>"+"</div>";var h=C.byId(L.id);var i=!h&&L.parentNode&&C.byId(L.parentNode.id)instanceof sap.gantt.simple.BaseGroup;if(i){h=C.byId(L.parentNode.id);}if(t&&this.getGantt().getShowTextOnGhost()){T=this._getGhostLabel(h,L);}if(this.bMultipleGhosts){this._aShapeNodes.push(i?L.parentNode:L);this._aGhostImages.push(g);if(!t){T="";}}var j="<div class='sapGanttDragGhost'>"+"<img class='sapGanttDragGhostImg' src='"+g+"'>"+T+"</div>";o.insertAdjacentHTML('beforeend',j);if(t&&this.getGantt().getShowTextOnGhost()&&T!==""){this._updateGhostLabelStyle();}};f.prototype._getDragTextOverlayStyle=function(L){var r=C.getConfiguration().getRTL();var A=this.getGantt().getGhostAlignment();var s=this.mDragPoint.shapeWidth,i=this.mDragPoint.shapeX+this.mDragPoint.shapeBias.x,g=this.mDragPoint.cursorX;var h=g-i;var o=document.getElementById("sapGanttDragGhostWrapper");var j="";if(A===c.None){if(r){o.style.setProperty('--sapShapeDragTextOverlay-right-val',s-h+'px');}else{o.style.setProperty('--sapShapeDragTextOverlay-left-val',h+'px');}}else if(A===c.End){j="sapGanttDragTextOverlayGhostAlignEnd";}o.style.setProperty('--sapShapeDragTextOverlay-lineHeight',L.getBBox().height+'px');return{css:j};};f.prototype.serializeClonedSvg=function(g,o,h,i,j){var s=d3.ns.prefix.svg;var k=o.getBBox();var r=C.getConfiguration().getRTL();var n=document.createElementNS(s,"svg");n.setAttribute("width",g.width);n.setAttribute("height",g.height);var p=o.cloneNode(true);p.style.transform="translate(0, 0)";if(!this.getGantt().getShowTextOnGhost()){this.removeOriginalTextNode(p);}else if(r&&(p.tagName==="g"||p.tagName==="text")){this._aOriginalTextX=[];this._iCount=0;this._populateTextNodeX(o);this._repositionTextNode(p);}var t=document.createElementNS(s,"g");t.setAttribute("transform","translate("+-(k.x)+", "+-(k.y)+")");t.appendChild(p);if(this.adhocLineDrag){var u=h.cloneNode(true);var v=i.cloneNode(true);t.appendChild(u);t.appendChild(v);}if(this.deltaLineDrag){var w=j.headerStartLine.cloneNode(true);var x=j.startLine.cloneNode(true);var y=j.headerEndLine.cloneNode(true);var z=j.endLine.cloneNode(true);t.appendChild(w);t.appendChild(x);t.appendChild(y);t.appendChild(z);}var A=this.getGantt().getSvgDefs();if(A){var H=q(document.getElementById(A.getId())).get(0).cloneNode(true);n.appendChild(H);}n.appendChild(t);return new XMLSerializer().serializeToString(n);};f.prototype.removeOriginalTextNode=function(n){if(n.parentNode&&n.tagName==="text"){n.parentNode.removeChild(n);}var g=n.children||n.childNodes;var h=Array.prototype.slice.call(g);h.forEach(function(n){this.removeOriginalTextNode(n);}.bind(this));};f.prototype._repositionTextNode=function(n){if(n.tagName==="text"){n.setAttribute("x",this._aOriginalTextX[this._iCount]);this._iCount++;}var g=n.children||n.childNodes;var h=Array.prototype.slice.call(g);h.forEach(function(n){this._repositionTextNode(n);}.bind(this));};f.prototype._populateTextNodeX=function(n){if(n.tagName==="text"){var t=0;var T=n.getAttribute("text-anchor");var o=n.getBBox();if(T==="start"){t=o.x;}else if(T==="end"){t=o.x+o.width;}else{t=o.x+(o.width/2);}this._aOriginalTextX.push(t);}var g=n.children||n.childNodes;var h=Array.prototype.slice.call(g);h.forEach(function(n){this._populateTextNodeX(n);}.bind(this));};f.prototype.getNumberOfDragObject=function(L){var s=this.getGantt().getSelection();var i=s.numberOfSelectedDraggableShapes();var r=C.getLibraryResourceBundle("sap.gantt");var o=r.getText("GNT_DRAGGED_OBJECT");var O=r.getText("GNT_DRAGGED_OBJECTS");var g=i>1?O:o;return i+" "+g;};f.prototype._disableTextSelection=function(){q(document.body).attr("unselectable","on").css({"-moz-user-select":"none","-webkit-user-select":"none","user-select":"none"}).bind("selectstart",function(o){o.preventDefault();return false;});};f.prototype._enableTextSelection=function(){q(document.body).attr("unselectable","off").css({"-moz-user-select":"","-webkit-user-select":"","user-select":""}).unbind("selectstart");};f.prototype.isAllowedVerticalOrentationDrag=function(){var g=this.getGantt();if(g.getDragOrientation()===D.Vertical){return g.oSelection.numberOfSelectedDraggableShapes()<2;}return true;};f.prototype.getRowByShape=function(s){var o=b.getRowInstancefromShape(s);var g=o.clone();g=this._addBackOriginalGanttRowProperties(o,g);return g;};f.prototype._addBackOriginalGanttRowProperties=function(o,g){g.oPropagatedProperties=o._getPropertiesToPropagate();g.propagateProperties(true);g.oParent=o.getParent();return g;};return f;});
