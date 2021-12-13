// Copyright (c) 2009-2020 SAP SE, All Rights Reserved
sap.ui.define(["sap/ui/thirdparty/jquery","sap/ui/base/Object","sap/ui/Device","sap/ui/model/Filter","sap/ushell/ui/launchpad/TileState","sap/ushell/components/_HomepageManager/PagingManager","sap/ushell/components/_HomepageManager/DashboardLoadingManager","sap/ushell/EventHub","sap/ushell/Config","sap/ushell/utils","sap/ushell/resources","sap/ushell/components/DestroyHelper","sap/ushell/components/GroupsHelper","sap/ushell/components/MessagingHelper","sap/m/GenericTile","sap/m/SelectDialog","sap/m/StandardListItem","sap/ushell/components/_HomepageManager/PersistentPageOperationAdapter","sap/ushell/components/_HomepageManager/TransientPageOperationAdapter","sap/ui/model/FilterOperator","sap/m/library","sap/ui/model/Context","sap/m/MessageToast","sap/base/Log","sap/ui/performance/Measurement","sap/ushell/components/ComponentKeysHandler"],function(Q,B,D,F,T,P,a,e,s,u,r,d,g,m,G,S,b,c,f,h,l,C,M,L,n,o){"use strict";var p=l.GenericTileScope;var t={PERSONALIZATION:"FLP: Personalization",RENAME_GROUP:"FLP: Rename Group",MOVE_GROUP:"FLP: Move Group",DELETE_GROUP:"FLP: Delete Group",RESET_GROUP:"FLP: Reset Group",DELETE_TILE:"FLP: Delete Tile",ADD_TILE:"FLP: Add Tile",MOVE_TILE:"FLP: Move Tile"};var v=[];return B.extend("sap.ushell.components.HomepageManager",{metadata:{publicMethods:["getModel","getDashboardView","loadPersonalizedGroups","resetGroupsOnFailure","addGroupToModel","addTileToGroup","deleteTilesFromGroup"]},analyticsConstants:t,constructor:function(i,j){if(sap.ushell.components.getHomepageManager){var H=sap.ushell.components.getHomepageManager();if(!H.view){H.setDashboardView(j.view);}return H;}this.oServiceLoadingPromise=sap.ushell.Container.getServiceAsync("LaunchPage").then(function(q){this.oPageBuilderService=q;this.oPageBuilderService.registerTileActionsProvider(this._addFLPActionsToTile.bind(this));this.oPageOperationAdapter=c.getInstance(q);this.bLinkPersonalizationSupported=this.oPageOperationAdapter.isLinkPersonalizationSupported();}.bind(this));sap.ui.getCore().attachThemeChanged(u.handleTilesVisibility);sap.ushell.components.getHomepageManager=(function(q){return function(){return q;};}(this));this.oModel=j.model;this.oRouter=j.router;this.oDashboardView=j.view;this.oSortableDeferred=new Q.Deferred();this.oSortableDeferred.resolve();this.registerEvents();this.tileViewUpdateQueue=[];this.tileViewUpdateTimeoutID=0;this.tileUuid=null;this.bIsGroupsModelLoading=false;this.bIsGroupsRequestPending=false;this.segmentsStore=[];this.bIsFirstSegment=true;this.bIsFirstSegmentViewLoaded=false;this.aGroupsFrame=null;this.iMinNumOfTilesForBlindLoading=this.oModel.getProperty("/optimizeTileLoadingThreshold")||100;this.bIsScrollModeAccordingKPI=false;this.oGroupNotLockedFilter=new F("isGroupLocked",h.EQ,false);this.oDashboardLoadingManager=new a("loadingManager",{oDashboardManager:this});if(this.oRouter){var k=this.oRouter.getTarget("home");k.attachDisplay(function(q){this.oDashboardView=q.getParameter("view");}.bind(this));}var E=s.last("/core/home/enableTransientMode");v.push(s.on("/core/home/enableTransientMode").do(function(N){if(E===N){return;}E=N;this._changeMode(N);}.bind(this)));this.oModel.bindProperty("/tileActionModeActive").attachChange(this._changeLinksScope.bind(this));this._aRequestQueue=[];this._bRequestRunning=false;return undefined;},_addRequest:function(R){this._aRequestQueue.push(R);if(!this._bRequestRunning){this._bRequestRunning=true;this._aRequestQueue.shift()();}},_checkRequestQueue:function(){if(this._aRequestQueue.length===0){this._bRequestRunning=false;}else{this._aRequestQueue.shift()();}},_requestFailed:function(){this._aRequestQueue=[];this._bRequestRunning=false;},isBlindLoading:function(){var i=s.last("/core/home/homePageGroupDisplay");if((i===undefined||i==="scroll")&&this.bIsScrollModeAccordingKPI){L.info("isBlindLoading reason IsScrollModeAccordingKPI and IsScrollMode: true");return true;}if(this.oModel.getProperty("/tileActionModeActive")){L.info("isBlindLoading reason TileActionModeActive : true");return true;}return false;},createMoveActionDialog:function(i){var j=this.oGroupNotLockedFilter,k=new S(i,{title:r.i18n.getText("moveTileDialog_title"),rememberSelections:false,search:function(E){var V=E.getParameter("value"),q=new F("title",h.Contains,V),w=E.getSource().getBinding("items");w.filter([q,j]);},contentWidth:"400px",contentHeight:"auto",confirm:function(E){var q=E.getParameter("selectedContexts");this.publishMoveActionEvents(q,i);}.bind(this),cancel:function(){var q=Q(".sapUshellTile[tabindex=\"0\"]")[0];if(q){q.focus();}},items:{path:"/groups",filters:[j],template:new b({title:"{title}"})}});return k;},publishMoveActionEvents:function(i,j){var E=sap.ui.getCore().getEventBus();if(i.length){var k=this.tileType==="link"?"links":"tiles",q=i[0].getObject().groupId,w={sTileId:this.tileUuid,sToItems:k,sFromItems:k,sTileType:k,toGroupId:i[0].getObject().groupId,toIndex:i[0].getObject()[this.tileType==="link"?"links":"tiles"].length,source:j};if(D.system.desktop){o.getInstance().then(function(x){w.callBack=x.callbackSetFocus.bind(x);E.publish("launchpad","scrollToGroup",{groupId:q});E.publish("launchpad","movetile",w);});}else{E.publish("launchpad","scrollToGroup",{groupId:q});E.publish("launchpad","movetile",w);}}},_changeLinksScope:function(E){var i=this;if(this.bLinkPersonalizationSupported){var I=E.getSource().getValue();this.oModel.getProperty("/groups").forEach(function(j,k){if(!j.isGroupLocked){i._changeGroupLinksScope(j,I?"Actions":"Display");}});}},_changeGroupLinksScope:function(i,j){var k=this;i.links.forEach(function(q,w){k._changeLinkScope(q.content[0],j);});},_changeLinkScope:function(i,j){var k;if(i.getScope){k=i;}else if(i.getContent){k=i.getContent()[0];}if(this.bLinkPersonalizationSupported&&k&&k.setScope){k.setScope(j);}},registerEvents:function(){var E=sap.ui.getCore().getEventBus();E.subscribe("launchpad","addBookmarkTile",this._createBookmark,this);E.subscribe("launchpad","tabSelected",this.getSegmentTabContentViews,this);E.subscribe("sap.ushell.services.Bookmark","bookmarkTileAdded",this._addBookmarkToModel,this);E.subscribe("sap.ushell.services.Bookmark","catalogTileAdded",this._refreshGroupInModel,this);E.subscribe("sap.ushell.services.Bookmark","bookmarkTileDeleted",this.loadPersonalizedGroups,this);E.subscribe("launchpad","loadDashboardGroups",this.loadPersonalizedGroups,this);E.subscribe("launchpad","createGroupAt",this._createGroupAt,this);E.subscribe("launchpad","deleteGroup",this._deleteGroup,this);E.subscribe("launchpad","resetGroup",this._resetGroup,this);E.subscribe("launchpad","changeGroupTitle",this._changeGroupTitle,this);E.subscribe("launchpad","moveGroup",this._moveGroup,this);E.subscribe("launchpad","deleteTile",this._deleteTile,this);E.subscribe("launchpad","movetile",this._moveTile,this);E.subscribe("launchpad","sortableStart",this._sortableStart,this);E.subscribe("launchpad","sortableStop",this._sortableStop,this);E.subscribe("launchpad","dashboardModelContentLoaded",this._modelLoaded,this);E.subscribe("launchpad","convertTile",this._convertTile,this);},_changeMode:function(i){var j=this.getModel().getProperty("/groups");if(i){this.oPageOperationAdapter=f.getInstance();var k=this.oPageOperationAdapter.transformGroupModel(j);this.getModel().setProperty("/groups",k);}else{this.oPageOperationAdapter=c.getInstance();d.destroyFLPAggregationModels(j);this.getModel().setProperty("/groups",[]);this.loadPersonalizedGroups();}},_addFLPActionsToTile:function(i){var A=[];if(s.last("/core/shell/enablePersonalization")){var j=this.bLinkPersonalizationSupported&&this.oPageOperationAdapter.isLinkPersonalizationSupported(i);A.push(this._getMoveTileAction(i));if(j){A.push(this._getConvertTileAction(i));}}return A;},_getConvertTileAction:function(i){var E=sap.ui.getCore().getEventBus(),j=this,k=j.oPageOperationAdapter.getTileType(i);return{text:k==="link"?r.i18n.getText("ConvertToTile"):r.i18n.getText("ConvertToLink"),press:function(q){var w={tile:q};if(D.system.desktop){o.getInstance().then(function(x){w.callBack=x.callbackSetFocus.bind(x);E.publish("launchpad","convertTile",w);});}else{E.publish("launchpad","convertTile",w);}}};},_getMoveTileAction:function(i){var j=this;return{text:r.i18n.getText("moveTileDialog_action"),press:function(){j.tileType=j.oPageOperationAdapter.getTileType(i);j.tileUuid=j.getModelTileById(j.oPageOperationAdapter.getTileId(i),j.tileType==="link"?"links":"tiles").uuid;var k=j.tileType==="tile"?j.moveTileDialog:j.moveLinkDialog;if(j.tileType==="tile"||j.tileType==="link"){if(!k){k=j.createMoveActionDialog("move"+j.tileType+"Dialog");k.setModel(j.oModel);if(j.tileType==="tile"){j.moveTileDialog=k;}else{j.moveLinkDialog=k;}}else{k.getBinding("items").filter([j.oGroupNotLockedFilter]);}k.open();}}};},_handleTileAppearanceAnimation:function(j){if(!j){return;}var k=["webkit",""];function q(w,x){for(var i=0;i<k.length;i++){x=x.toLowerCase();j.attachBrowserEvent(k[i]+x,function(E){if(E.originalEvent&&E.originalEvent.animationName==="sapUshellTileEntranceAnimation"){j.removeStyleClass("sapUshellTileEntrance");}},false);}}q(j,"AnimationEnd");j.addStyleClass("sapUshellTileEntrance");},destroy:function(){var E=sap.ui.getCore().getEventBus();E.unsubscribe("launchpad","addBookmarkTile",this._createBookmark,this);E.unsubscribe("launchpad","loadDashboardGroups",this.loadPersonalizedGroups,this);E.unsubscribe("launchpad","createGroupAt",this._createGroupAt,this);E.unsubscribe("launchpad","deleteGroup",this._deleteGroup,this);E.unsubscribe("launchpad","resetGroup",this._resetGroup,this);E.unsubscribe("launchpad","changeGroupTitle",this._changeGroupTitle,this);E.unsubscribe("launchpad","moveGroup",this._moveGroup,this);E.unsubscribe("launchpad","deleteTile",this._deleteTile,this);E.unsubscribe("launchpad","movetile",this._moveTile,this);E.unsubscribe("launchpad","sortableStart",this._sortableStart,this);E.unsubscribe("launchpad","sortableStop",this._sortableStop,this);E.unsubscribe("launchpad","dashboardModelContentLoaded",this._modelLoaded,this);sap.ui.getCore().detachThemeChanged(u.handleTilesVisibility);v.forEach(function(i){i.off();});c.destroy();f.destroy();sap.ushell.components.getHomepageManager=undefined;B.prototype.destroy.apply(this,arguments);},_sortableStart:function(){this.oSortableDeferred=new Q.Deferred();},_createBookmark:function(i,E,j){var k=j.group?j.group.object:"";delete j.group;function q(){sap.ushell.Container.getServiceAsync("Bookmark").then(function(w){w.addBookmark(j,k).always(this._checkRequestQueue.bind(this)).done(function(){m.showLocalizedMessage("tile_created_msg");}).fail(function(x){L.error("Failed to add bookmark",x,"sap.ushell.ui.footerbar.AddBookmarkButton");m.showLocalizedError("fail_to_add_tile_msg");});}.bind(this));}this._addRequest(q.bind(this));},_addBookmarkToModel:function(i,E,j){var k=j.tile,q,w=j.group,x,y,z,N,I;if(!j||!k){this.bIsGroupsModelDirty=true;if(!this.bGroupsModelLoadingInProcess){this._handleBookmarkModelUpdate();}return;}if(!w){q=this.getModel().getProperty("/groups");for(I=0;I<q.length;I++){if(q[I].isDefaultGroup===true){w=q[I].object;break;}}}y=this._getIndexOfGroupByObject(w);z=this.oModel.getProperty("/groups/"+y);x=this.oPageOperationAdapter.getPreparedTileModel(k,z.isGroupLocked);this.getTileView(x);z.tiles.push(x);z.visibilityModes=u.calcVisibilityModes(z,true);N=z.tiles.length;this._updateModelWithTileView(y,N);this.oModel.setProperty("/groups/"+y,z);},_refreshGroupInModel:function(i,E,j){var k=this;this.oPageOperationAdapter.refreshGroup(j).then(function(q){if(!q){return;}var w=k._getIndexOfGroupByObject(q.object);q.visibilityModes=u.calcVisibilityModes(q.object,true);k.oModel.setProperty("/groups/"+w,q);if(q.tiles){q.tiles.forEach(function(x){k.getTileView(x);});}});},_sortableStop:function(){this.oSortableDeferred.resolve();},_handleAfterSortable:function(i){return function(){var j=Array.prototype.slice.call(arguments);this.oSortableDeferred.done(function(){i.apply(null,j);});}.bind(this);},_createGroupAt:function(j,E,k){var q=parseInt(k.location,10),w=this.oModel.getProperty("/groups"),x=this.oPageOperationAdapter.getPreparedGroupModel(null,false,q===w.length,k),y=this.oModel,i;x.index=q;w.splice(q,0,x);for(i=0;i<w.length-1;i++){w[i].isLastGroup=false;}for(i=q+1;i<w.length;i++){w[i].index++;}y.setProperty("/groups",w);},_getIndexOfGroupByObject:function(i){var j=this.oModel.getProperty("/groups");return this.oPageOperationAdapter.getIndexOfGroup(j,i);},getTileActions:function(i){return this.oPageOperationAdapter.getTileActions(i);},addTileToGroup:function(i,j){var k=i+"/tiles",q=this.oModel.getProperty(i),N=this.oModel.getProperty(k).length;var w=this.oModel.getProperty(i+"/isGroupLocked"),x=this.oModel.getProperty("/personalization");q.tiles[N]=this.oPageOperationAdapter.getPreparedTileModel(j,w);this.getTileView(q.tiles[N]);q.visibilityModes=u.calcVisibilityModes(q,x);this._updateModelWithTileView(q.index,N);this.oModel.setProperty(i,q);},addTilesToGroupByCatalogTileId:function(j,k){var q=j.getBindingContext();for(var i=0;i<k.length;i++){this.addTileToGroupByCatalogTileId(q.sPath,k[i]);}},addTileToGroupByCatalogTileId:function(i,j){var N,k,q;if(!s.last("/core/home/enableTransientMode")){return;}q=this.oPageOperationAdapter.getTileModelByCatalogTileId(j);if(!q){return;}this.oDashboardLoadingManager.setTileResolved(q);N=this.oModel.getProperty(i+"/tiles").length;k=this.oModel.getProperty(i);k.tiles[N]=q;this.oModel.setProperty(i,k);},_getPathOfTile:function(i){var j=this.oModel.getProperty("/groups"),k=null,q=null,w,E=function(x,y){if(y.uuid===i){q=x;return false;}return undefined;};Q.each(j,function(x,y){Q.each(y.tiles,E);if(q!==null){k=x;w="tiles";return false;}Q.each(y.links,E);if(q!==null){k=x;w="links";return false;}return undefined;});return k!==null?"/groups/"+k+"/"+w+"/"+q:null;},_moveInArray:function(A,i,j){if(j>=A.length){var k=j-A.length;while((k--)+1){A.push(undefined);}}A.splice(j,0,A.splice(i,1)[0]);},_updateGroupIndices:function(A){var k;for(k=0;k<A.length;k++){A[k].index=k;}},_deleteGroup:function(i,E,j){var k=this,q=this.oModel,w=j.groupId,x=q.getProperty("/groups"),y=g.getIndexOfGroup(x,w),I=x.length-1===y,z=null,A,H;A=I?y-1:y;d.destroyFLPAggregationModel(q.getProperty("/groups/"+y));z=x.splice(y,1)[0];if(I){q.setProperty("/groups/"+A+"/isLastGroup",I);}q.setProperty("/groups",x);this._updateGroupIndices(x);if(A>=0){H=sap.ui.getCore().getEventBus();window.setTimeout(Q.proxy(H.publish,H,"launchpad","scrollToGroup",{groupId:q.getProperty("/groups")[A].groupId}),200);}function J(){k.oPageOperationAdapter.deleteGroup(z).then(function(){m.showLocalizedMessage("group_deleted_msg",[z.title]);k._checkRequestQueue.call(k);},function(){k._resetGroupsOnFailure("fail_to_delete_group_msg");});}this._addRequest(J);},_resetGroup:function(i,E,j){var k=this,q=j.groupId,w=this.oModel,x=w.getProperty("/groups"),y=g.getIndexOfGroup(x,q),z=k.oModel.getProperty("/groups/indexOfDefaultGroup")===y,A=w.getProperty("/groups/"+y),H,I;w.setProperty("/groups/"+y+"/sortable",false);function J(){k.oPageOperationAdapter.resetGroup(A,z).then(function(R){k._handleAfterSortable(function(q,O,K){var x=k.oModel.getProperty("/groups"),y=g.getIndexOfGroup(x,q);k._loadGroup(y,K||O);m.showLocalizedMessage("group_reset_msg",[O.title]);k.oModel.setProperty("/groups/"+y+"/sortable",true);H=sap.ui.getCore().byId("dashboardGroups").getGroupControlByGroupId(q);I=H.getBindingContext().getObject().links;if(I&&I.length&&!H.getIsGroupLocked()){k._changeGroupLinksScope(H.getBindingContext().getObject(),k.oModel.getProperty("/tileActionModeActive")?p.Actions:p.Display);}if(H){H.rerender();e.emit("updateGroups",Date.now());u.handleTilesVisibility();}})(q,A,R);k._checkRequestQueue.call(k);},function(){k._resetGroupsOnFailure("fail_to_reset_group_msg");});}this._addRequest(J);},_moveGroup:function(j,E,k){if(isNaN(k.fromIndex)){return;}var q=k.fromIndex,w=k.toIndex,x=this.oModel,y=x.getProperty("/groups"),A=x.getProperty("/tileActionModeActive"),z,H,I=this,i,J;if(!A){q=this._adjustFromGroupIndex(q,y);}z=y[q];H=z.groupId;if(!A){w=this._adjustToGroupIndex(w,y,H);}J=y[w];this._moveInArray(y,q,w);this._updateGroupIndices(y);for(i=0;i<y.length-1;i++){y[i].isLastGroup=false;}y[y.length-1].isLastGroup=true;x.setProperty("/groups",y);function K(){y=x.getProperty("/groups");var z=x.getProperty(g.getModelPathOfGroup(y,H));if(!z.object){return;}I.oPageOperationAdapter.getOriginalGroupIndex(J,y).then(function(N){var O={iFromIndex:q,iToIndex:w};return I.oPageOperationAdapter.moveGroup(z,N,O);}).then(I._checkRequestQueue.bind(I),function(){I._resetGroupsOnFailure("fail_to_move_group_msg");});}this._addRequest(K);},_adjustToGroupIndex:function(j,k,q){var w=0,I=false,i=0;for(i=0;i<k.length&&w<j;i++){if(k[i].isGroupVisible){if(k[i].groupId===q){I=true;}else{w++;}}}if(I){return i-1;}return i;},_adjustFromGroupIndex:function(j,k){var q=0,i;for(i=0;i<k.length;i++){if(k[i].isGroupVisible){q++;}if(q===j+1){return i;}}return j;},_changeGroupTitle:function(i,E,j){var k=this,N=j.newTitle,q=this.oModel.getProperty("/groups"),w=j.groupId,x=g.getIndexOfGroup(q,w),y=k.oModel.getProperty("/groups/indexOfDefaultGroup")===x,z=this.oModel.getProperty("/groups/"+x),O=z.title;this.oModel.setProperty("/groups/"+x+"/title",N);function A(){var I;if(z.isLastGroup){I=k.oPageOperationAdapter.addGroupAt(z,undefined,y);}else{var J=k.oModel.getProperty("/groups")[x+1];I=k.oPageOperationAdapter.getOriginalGroupIndex(J,q).then(function(K){return k.oPageOperationAdapter.addGroupAt(z,K,y);});}I.then(function(K){k._handleAfterSortable(function(R,U){var V=k.oModel.getProperty("/groups");var W=g.getIndexOfGroup(V,R);var X=V[W];Object.keys(U).forEach(function(Y){if(Y==="tiles"||Y==="links"){return;}X[Y]=U[Y];});k.oModel.refresh();k._checkRequestQueue.call(k);})(w,K);},function(){k._resetGroupsOnFailure("fail_to_create_group_msg");});}function H(){this.oPageOperationAdapter.renameGroup(z,N,O).then(function(){k._checkRequestQueue.call(k);},function(){k._resetGroupsOnFailure("fail_to_rename_group_msg");});}if(!z.object){this._checkRequestQueue.call(this);this._addRequest(A.bind(this));}else{this._addRequest(H.bind(this));}},addGroupToModel:function(i){var j=this.oPageOperationAdapter.getPreparedGroupModel(i,false,true,{isRendered:true}),k=this.oModel.getProperty("/groups"),q=k.length,w;if(q>0){k[q-1].isLastGroup=false;}j.index=q;k.push(j);this.oModel.setProperty("/groups/",k);w=new C(this.oModel,"/groups/"+q);return w;},_deleteTile:function(i,E,j){var k=this,q=j.tileId,w=this.oModel.getProperty("/groups"),I=j.items||"tiles";Q.each(w,function(x,y){var z=false;Q.each(y[I],function(A,H){if(H.uuid!==q){return true;}d.destroyTileModel(k.oModel.getProperty("/groups/"+x+"/"+I+"/"+A));var J=y[I].splice(A,1)[0],K=k.oModel.getProperty("/personalization");y.visibilityModes=u.calcVisibilityModes(y,K);k.oModel.setProperty("/groups/"+x,y);function N(){k.oPageOperationAdapter.removeTile(y,J).then(function(){k._checkRequestQueue.call(k);},function(){k._resetGroupsOnFailure("fail_to_remove_tile_msg");});}k._addRequest.call(k,N);u.handleTilesVisibility();z=true;return false;});return!z;});},deleteTilesFromGroup:function(i,R){var j=this.oModel.getProperty("/groups"),k=g.getIndexOfGroup(j,i),q=this.oModel.getProperty("/groups/"+k),w=[];["tiles","links"].forEach(function(A){w=q[A].filter(function(x){if(R.indexOf(x.uuid)<0){return true;}return false;});q[A]=w;});q.visibilityModes=u.calcVisibilityModes(q,true);this.oModel.setProperty("/groups/"+k,q);},_getGroupIndex:function(i){var j=this.oModel.getProperty("/groups"),k=this._getNewGroupInfo(j,i);if(k){return k.newGroupIndex;}return undefined;},_convertTile:function(i,E,j){var k=j.tile?j.tile:j,q=j.srcGroupId?this._getGroupIndex(j.srcGroupId):undefined,w=j.srcGroupId?this.oModel.getProperty("/groups/"+q):k.getParent().getBindingContext().getObject(),x=k.getBindingContext().sPath.split("/"),y=k.getBindingContext().getObject(),O=x[x.length-2],z=y.uuid,A=parseInt(x[x.length-1],10),H=j.toIndex!==undefined?j.toIndex:undefined,I=this.oModel.getProperty("/tileActionModeActive"),J=j.toGroupId?this._getGroupIndex(j.toGroupId):w.index,K=j.toGroupId?this.oModel.getProperty("/groups/"+J):w,N=this;var R=this._getIndexForConvert(O,A,H,w,K),U={"tileIndex":A,"groupIndex":q,"group":w};function V(){y.tileIsBeingMoved=true;var W=this.oPageOperationAdapter.moveTile(y,R,w,K,O==="links"?"tile":"link");W.then(function(X){N._showMoveTileMessage(y,w,K);N._handleAfterSortable(function(z,X){var Y=N._getPathOfTile(z),Z=X.content;if(Y){if(O==="tiles"){N._attachLinkPressHandlers(Z);N._changeLinkScope(Z,I?"Actions":"Display");}var $={"tileIndex":H,"groupIndex":J,"group":K},_={"tile":y,"view":Z,"type":O,"tileObj":X.object};y.tileIsBeingMoved=true;N.replaceTileViewAfterConvert(U,$,_);e.emit("updateGroups",Date.now());u.handleTilesVisibility();if(j.callBack){j.callBack(Z);}}})(z,X);N._checkRequestQueue.call(N);},function(){N._handleAfterSortable(N._resetGroupsOnFailure.bind(N))("fail_to_move_tile_msg");});}this._addRequest(V.bind(this));},replaceTileViewAfterConvert:function(i,j,k){var q=k.tile,w=q.content;q.tileIsBeingMoved=false;q.content=[k.view];q.object=k.tileObj;q.originalTileId=this.oPageOperationAdapter.getTileId(k.tileObj);i.group[k.type].splice(i.tileIndex,1);if(j.tileIndex!==undefined){j.group[k.type==="tiles"?"links":"tiles"].splice(j.tileIndex,0,q);}else{j.group[k.type==="tiles"?"links":"tiles"].push(q);}this.oModel.setProperty("/groups/"+j.groupIndex,j.group);this.oModel.setProperty("/groups/"+i.groupIndex,i.group);if(k.type==="links"){this._handleTileAppearanceAnimation(q.content[0].getParent());}else{this._handleTileAppearanceAnimation(q.content[0]);}if(w&&w[0]){w[0].destroy();}},_getIndexForConvert:function(i,j,k,q,w){var x;if(i==="tiles"){if(k!==undefined){x=w[i].length+k;}else{x=w[i].length+w.links.length;}if(q.groupId===w.groupId){x--;}}else{x=k||q.tiles.length;j+=q.tiles.length;}return{"tileIndex":j,"newTileIndex":x};},_getIndexForMove:function(i,j,k,q,w){var x;if(i==="tiles"){x=k!==undefined?k:q[i].length;}else{if(k!==undefined){x=q.tiles.length+k;}else{x=q.tiles.length+q.links.length;}j+=w.tiles.length;}return{"tileIndex":j,"newTileIndex":x};},_getTileInfo:function(i,j,I){var k;Q.each(i,function(q,w){var x=false;Q.each(w[I],function(y,z){if(z.uuid===j){k={"oTile":z,"tileIndex":y,"oGroup":w,"groupIndex":q};x=true;return false;}return undefined;});return!x;});return k;},_getNewGroupInfo:function(i,N){var j;Q.each(i,function(k,q){if(q.groupId===N){j={"oNewGroup":q,"newGroupIndex":k};}});return j;},_moveTile:function(i,E,j){var k=j.toIndex,N=j.toGroupId,q=j.sTileId,w=j.source,x=j.sTileType==="tiles"||j.sTileType==="tile"?"tile":"link",y=j.sToItems,z=j.sFromItems,A=this.oModel.getProperty("/tileActionModeActive"),H=this.oModel.getProperty("/groups"),I,J,K,O,R,U={},V=this;O=this._getTileInfo(H,q,z);R=this._getNewGroupInfo(H,N);if(O.oGroup.groupId===R.oNewGroup.groupId&&(w==="movetileDialog"||k===null||w==="movelinkDialog")){if(j.callBack&&O.oTile&&O.oTile.content&&O.oTile.content.length){j.callBack(O.oTile.content[0]);}return;}if(x==="link"){O.oTile.content[0].addStyleClass("sapUshellZeroOpacity");}if(x==="tile"&&y==="tiles"){if(k&&k>R.oNewGroup[y].length){k=R.oNewGroup[y].length;}}if(O.oGroup.groupId===N&&y===z){if(k===null||k===undefined){O.oGroup[y].splice(O.tileIndex,1);k=O.oGroup[y].length;O.oGroup[y].push(O.oTile);}else{k=this._adjustTileIndex(k,O.oTile,O.oGroup,y);this._moveInArray(O.oGroup[y],O.tileIndex,k);}this.oModel.setProperty("/groups/"+O.groupIndex+"/"+y,O.oGroup[y]);}else{K=this.oModel.getProperty("/personalization");O.oGroup[z].splice(O.tileIndex,1);O.oGroup.visibilityModes=u.calcVisibilityModes(O.oGroup,K);this.oModel.setProperty("/groups/"+O.groupIndex+"/"+z,O.oGroup[z]);if(k===null||k===undefined){k=R.oNewGroup[y].length;R.oNewGroup[y].push(O.oTile);}else{k=this._adjustTileIndex(k,O.oTile,R.oNewGroup,y);R.oNewGroup[y].splice(k,0,O.oTile);}R.oNewGroup.visibilityModes=u.calcVisibilityModes(R.oNewGroup,K);this.oModel.setProperty("/groups/"+R.newGroupIndex+"/"+y,R.oNewGroup[y]);}e.emit("updateGroups",Date.now());u.handleTilesVisibility();function W(){I=this.oModel.getProperty("/groups/"+O.groupIndex);J=this.oModel.getProperty("/groups/"+R.newGroupIndex);U=this._getIndexForMove(z,O.tileIndex,k,R.oNewGroup,I);O.oTile.tileIsBeingMoved=true;this.oPageOperationAdapter.moveTile(O.oTile,U,I,J,x).then(function(X){var Y=V._getPathOfTile(q);V._showMoveTileMessage(O.oTile,I,J);if(Y){V.oModel.setProperty(Y+"/object",X.object);V.oModel.setProperty(Y+"/originalTileId",X.originalTileId);var Z=V.oModel.getProperty(Y+"/content"),$=X.content;if(y==="links"){V._changeLinkScope($,A?"Actions":"Display");V._attachLinkPressHandlers($);V._handleTileAppearanceAnimation($);O.oTile.content=[$];V.oModel.setProperty(Y,Q.extend({},O.oTile));V.oModel.setProperty("/groups/"+R.newGroupIndex+"/"+y,V.oModel.getProperty("/groups/"+R.newGroupIndex+"/"+y));}else{V.oModel.setProperty(Y+"/content",[$]);}if(Z&&Z[0]){var _=$.onAfterRendering;$.onAfterRendering=function(){_.apply(this);Z[0].destroy();$.onAfterRendering=_;};}V.oModel.setProperty(Y+"/tileIsBeingMoved",false);if(j.callBack){j.callBack($);}}V._checkRequestQueue.call(V);},function(){V._resetGroupsOnFailure("fail_to_move_tile_msg");});}this._addRequest(W.bind(this));},_showMoveTileMessage:function(i,j,k){var q=this.oPageOperationAdapter.getTileTitle(i),w=k.title,x=r.i18n.getText("added_tile_to_group"),y=q+" "+x+" "+w;if(j.groupId!==k.groupId){M.show(y);}},_adjustTileIndex:function(j,k,q,I){var w=0,x=false,i=0;for(i=0;i<q[I].length&&w<j;i++){if(q[I][i].isTileIntentSupported){if(q[I][i]===k){x=true;}else{w++;}}}if(x){return i-1;}return i;},getModel:function(){return this.oModel;},getDashboardView:function(){return this.oDashboardView;},setDashboardView:function(i){this.oDashboardView=i;return this;},setTileVisible:function(i,V){this.oPageOperationAdapter.setTileVisible(i.object,V);},refreshTile:function(i){this.oPageOperationAdapter.refreshTile(i.object);},updateSettings:function(i){this.oModel=i.model||this.oModel;this.oConfig=i.config||this.oConfig;this.oRouter=i.router||this.oRouter;this.oDashboardView=i.view||this.oDashboardView;},_resetGroupsOnFailure:function(i,j){this._requestFailed();m.showLocalizedError(i,j);this.bStartLoadRemainSegment=false;this.loadPersonalizedGroups();this.oModel.updateBindings(true);},resetGroupsOnFailure:function(){this._resetGroupsOnFailure.apply(this,arguments);},_bindSegment:function(i,j){var k,q,w,x;for(k=0;k<j.length;k++){w=j[k];x=w.index;q=i[x];if(q){q.isRendered=true;q.tiles=q.tiles.concat(w.tiles);q.links=q.links.concat(w.links);}}return i;},createGroupsModelFrame:function(i,j){var k,q=[],O,w;w=function(x){var y=Q.extend({},x);y.tiles=[];y.pendingLinks=[];y.links=[];return y;};for(k=0;k<i.length;k++){O=i[k];q[k]=w(O);q[k].isRendered=false;q[k].visibilityModes=u.calcVisibilityModes(O,j);}return q;},_splitGroups:function(i,j){var k,q=[],w=0,I=this.oModel.getProperty("/homePageGroupDisplay")==="tabs",E=this.oModel.getProperty("/personalization"),x=0,y;var z=500;for(k=0;k<i.length;k++){y=i[k];q.push(y);if(!this.segmentsStore.length){w+=this.PagingManager.getGroupHeight(y,j===k,E);}else{x+=y.tiles.length+y.links.length;}if(I&&!this.segmentsStore.length&&w>0){q.loadTilesView=true;this.segmentsStore.push(q);q=[];w=0;}if(w>=1||x>=z){this.segmentsStore.push(q);q=[];w=0;x=0;}}if(q.length){this.segmentsStore.push(q);}},_processSegment:function(i){var j=this.segmentsStore.shift();if(!j){return i;}if(this.isBlindLoading()===false){if(this.oModel.getProperty("/homePageGroupDisplay")!=="tabs"||j.loadTilesView){this.getSegmentContentViews(j);}}i=this._bindSegment(i,j);return i;},getSegmentContentViews:function(i){var j,k,q,w;for(j=0;j<i.length;j++){q=i[j];for(k=0;k<q.tiles.length;k++){w=q.tiles[k];if(w.isTileIntentSupported){this.getTileView(w);}}for(k=0;k<q.links.length;k++){w=q.links[k];if(w.isTileIntentSupported){this.getTileView(w,q.index);}}}this.bIsFirstSegmentViewLoaded=true;},getSegmentTabContentViews:function(i,E,j){var k,q,w=j.iSelectedGroup,x;x=this.oModel.getProperty("/groups/"+w);for(k=0;k<x.tiles.length;k++){q=x.tiles[k];if(q.isTileIntentSupported){this.getTileView(q);}}for(k=0;k<x.links.length;k++){q=x.links[k];if(q.isTileIntentSupported){this.getTileView(q,w);}}},_handleBookmarkModelUpdate:function(){this.bIsGroupsModelDirty=false;this.bGroupsModelLoadingInProcess=true;this.loadPersonalizedGroups();},_modelLoaded:function(){this.bGroupsModelLoadingInProcess=false;if(this.bIsGroupsModelDirty){this._handleBookmarkModelUpdate();}},handleFirstSegmentLoaded:function(){var i=this.oModel.getProperty("/groups");if(this.aGroupsFrame){Array.prototype.push.apply(i,this.aGroupsFrame);this.aGroupsFrame=null;}this._initializeAnchorNavigationBar();if(!this.bStartLoadRemainSegment){this._processRemainingSegments();}},_initializeAnchorNavigationBar:function(){var A,i=sap.ushell.components.getHomepageManager().getDashboardView();A=i.getAnchorItemTemplate();this.oDashboardView.oAnchorNavigationBar.bindAggregation("groups",{path:"/groups",template:A});},_processRemainingSegments:function(){var U;if(this.segmentsStore.length>0){window.setTimeout(function(){U=this._processSegment(this.oModel.getProperty("/groups"));this.oModel.setProperty("/groups",U);this.bIsFirstSegment=false;this._processRemainingSegments();}.bind(this),0);}else{this.bIsGroupsModelLoading=false;this._updateModelWithTileView(0,0);u.handleTilesVisibility();sap.ui.getCore().getEventBus().publish("launchpad","dashboardModelContentLoaded");e.emit("updateGroups",Date.now());}},_setGroupModel:function(j){if(this.bIsGroupsModelLoading){L.info("Skip set the group model, because the group model is still loading");return;}var i=0,k,q=0,w=0,x=0,y,z,A=null,E,H,I=[];this.bIsGroupsModelLoading=true;try{q=this.oModel.getProperty("/groups").length;}catch(J){}for(i=j.length;i<q;++i){d.destroyFLPAggregationModel(this.oModel.getProperty("/groups/"+i));}if(!this.PagingManager){var K=Q("#dashboardGroups").width();if(!K){K=window.innerWidth;}var N=Q("#sapUshellDashboardPage-cont").height();if(N<100){N=window.innerHeight;}this.PagingManager=new P("dashboardPaging",{supportedElements:{tile:{className:"sapUshellTile"},link:{className:"sapUshellLinkTile"}},containerHeight:N,containerWidth:K});}j.forEach(function(O){if(O.isGroupVisible){w+=O.tiles.length;}});this.bIsScrollModeAccordingKPI=w>this.iMinNumOfTilesForBlindLoading;this.aGroupsFrame=this.createGroupsModelFrame(j,this.oModel.getProperty("/personalization"));for(i=0;i<this.aGroupsFrame.length;i++){if(this.aGroupsFrame[i].isGroupVisible&&this.aGroupsFrame[i].visibilityModes[0]){if(A===null){A=i;this.aGroupsFrame[i].isGroupSelected=true;this.oModel.setProperty("/iSelectedGroup",i);}x++;if(x>1){this.aGroupsFrame[A].showGroupHeader=false;break;}}}this._splitGroups(j,A);z=this.segmentsStore[0]?this.segmentsStore[0].length:0;y=this.aGroupsFrame.splice(0,z);n.start("FLP:DashboardManager._processSegment","_processSegment","FLP");I=this._processSegment(y);j.every(function(O,R){if(O.isDefaultGroup){k=R;return false;}return true;});I.indexOfDefaultGroup=k;if(this.oModel.getProperty("/homePageGroupDisplay")==="tabs"){E=this.getDashboardView();if(E){H=E.oDashboardGroupsBox;H.getBinding("groups").filter([E.oFilterSelectedGroup]);}}n.end("FLP:DashboardManager._processSegment");this.oModel.setProperty("/groups",I);this.aGroupModel=I;if(this.oDashboardView){e.once("firstSegmentCompleteLoaded").do(function(){u.setPerformanceMark("FLP-TTI-Homepage",{bUseUniqueMark:true});}).do(this.handleFirstSegmentLoaded.bind(this));}else{setTimeout(function(){Array.prototype.push.apply(this.aGroupModel,this.aGroupsFrame);this.aGroupsFrame=null;this.bStartLoadRemainSegment=true;this._processRemainingSegments();}.bind(this),0);}if(this.bIsFirstSegmentViewLoaded){e.emit("firstSegmentCompleteLoaded",true);}n.end("FLP:DashboardManager.loadGroupsFromArray");},getPreparedGroupModel:function(){return this.aGroupModel;},_loadGroup:function(i,N){var j=this,k="/groups/"+i,O=j.oModel.getProperty(k),I=O.isLastGroup,q=O.groupId;d.destroyFLPAggregationModel(O);if(q){N.groupId=q;}N.isLastGroup=I;N.index=i;N.isRendered=true;this.oModel.setProperty(k,N);},_hasPendingLinks:function(j){for(var i=0;i<j.length;i++){if(j[i].content[0]===undefined){return true;}}return false;},_addModelToTileViewUpdateQueue:function(i,j){this.tileViewUpdateQueue.push({uuid:i,view:j});},_updateModelWithTileView:function(i,j){var k=this;if(this.tileViewUpdateTimeoutID){clearTimeout(this.tileViewUpdateTimeoutID);}this.tileViewUpdateTimeoutID=window.setTimeout(function(){k.tileViewUpdateTimeoutID=undefined;k.oSortableDeferred.done(function(){k._updateModelWithTilesViews(i,j);});},50);},_updateGroupModelWithTilesViews:function(i,k,w,x){var y,U,z,A,E=k||0;for(var j=E;j<i.length;j=j+1){y=i[j];for(var q=0;q<this.tileViewUpdateQueue.length;q++){U=this.tileViewUpdateQueue[q];if(y.uuid===U.uuid){w.push(q);if(U.view){if(x){y.content=[U.view];}else{y.content[0].destroy();y.content=[U.view];}this.oDashboardLoadingManager.setTileResolved(y);z=this.oPageOperationAdapter.getTileSize(y.object);A=((z!==null)&&(z==="1x2"))||false;if(y.long!==A){y.long=A;}}else{y.content[0].setState("Failed");}break;}}}},_updateModelWithTilesViews:function(j,k){var q=this.oModel.getProperty("/groups"),w=j||0,x=[];if(!q||this.tileViewUpdateQueue.length===0){return;}for(var i=w;i<q.length;i=i+1){this._updateGroupModelWithTilesViews(q[i].tiles,k,x);if(q[i].links){this._updateGroupModelWithTilesViews(q[i].links,k,x,true);if(q[i].pendingLinks.length>0){if(!q[i].links){q[i].links=[];}q[i].links=q[i].links.concat(q[i].pendingLinks);q[i].pendingLinks=[];}}}var y=[],z;for(z=0;z<this.tileViewUpdateQueue.length;z++){if(x.indexOf(z)===-1){y.push(this.tileViewUpdateQueue[z]);}}this.tileViewUpdateQueue=y;this.oModel.setProperty("/groups",q);},getModelTileById:function(i,I){var j=this.oModel.getProperty("/groups"),k,q=false;j.every(function(w){w[I].every(function(x){if(x.uuid===i||x.originalTileId===i){k=x;q=true;}return!q;});return!q;});return k;},_attachLinkPressHandlers:function(V){var E=sap.ui.getCore().getEventBus(),i=V.attachPress?V:V.getContent()[0];i.attachPress(function(j){var k=V.getBindingContext().getObject().tileIsBeingMoved;if(!k&&this.getScope&&this.getScope()==="Actions"){switch(j.getParameters().action){case"Press":var q=V.getState?V.getState():"";if(q!=="Failed"){sap.ushell.components.homepage.ActionMode._openActionsMenu(j,V);}break;case"Remove":var w=V.getBindingContext().getObject().uuid;E.publish("launchpad","deleteTile",{tileId:w,items:"links"});break;default:break;}}else{E.publish("launchpad","dashboardTileLinkClick");}});},handleDisplayModeChange:function(N){this.oModel.setProperty("/homePageGroupDisplay",N);switch(N){case"scroll":this._handleDisplayModeChangeToScroll();break;case"tabs":this._handleDisplayModeChangeToTabs();break;}},_handleDisplayModeChangeToTabs:function(){var j=this.oModel.getProperty("/iSelectedGroup"),k=this.oModel.getProperty("/groups");if(k.length>0){for(var i=0;i<k.length;i++){this.oModel.setProperty("/groups/"+i+"/isGroupSelected",false);}this.oModel.setProperty("/groups/"+j+"/isGroupSelected",true);}},_handleDisplayModeChangeToScroll:function(){if(this.isBlindLoading()){return;}var k=this.oModel.getProperty("/groups"),q,w,x,y=[],i,j;for(i=0;i<k.length;i++){q=k[i];w=q.tiles||[];for(j=0;j<w.length;j++){x=w[j];if(x.content.length===0){this.getTileView(x,i);}}y=q.links||[];for(j=0;j<y.length;j++){this.getTileView(y[j],i);}}this.oModel.refresh(false);var z=this.oModel.getProperty("/iSelectedGroup");if(z){setTimeout(function(){sap.ui.getCore().getEventBus().publish("launchpad","scrollToGroup",{groupId:k[z].groupId});},100);}},getTileViewsFromArray:function(R){var i=this;if(R.length===0){return;}R.forEach(function(j){i.getTileView(j.oTile,j.iGroup);});this.oModel.refresh(false);if(this.bIsFirstSegmentViewLoaded===false){this.bIsFirstSegmentViewLoaded=true;e.emit("firstSegmentCompleteLoaded",true);}},getTileView:function(i,j){var k=this.oPageOperationAdapter.getTileType(i.object);if(this.oDashboardLoadingManager.isTileViewRequestIssued(i)){return;}this.oDashboardLoadingManager.setTileInProgress(i);this.oPageOperationAdapter.setTileVisible(i.object,false);if(k==="card"){this._loadCardData(i);}else{this._loadTileData(i,j,k);}},_loadCardData:function(i){var j=sap.ui.getCore().byId(i.controlId);if(j&&j.setManifest&&this.isBlindLoading()){j.setManifest(i.manifest);}i.content=[i.manifest];this.oDashboardLoadingManager.setTileResolved(i);},getCurrentHiddenGroupIds:function(i){return this.oPageOperationAdapter.getCurrentHiddenGroupIds(i);},_loadTileData:function(i,j,k){var q=this,w=this.oPageOperationAdapter.getTileView(i),x,y,z,U=this._addModelToTileViewUpdateQueue,A,N=false,E=i.uuid,H=false;if(w.state()==="resolved"){H=true;}w.done(function(V){if(V.oController&&V.oController.navigationTargetUrl&&!i.isCustomTile){i.target=V.oController.navigationTargetUrl;}A=V;if(A.getComponentInstance){n.average("FLP:getComponentInstance","get info for navMode","FLP1");var I=A.getComponentInstance().getComponentData();if(I&&I.properties){i.navigationMode=I.properties.navigationMode;}n.end("FLP:getComponentInstance");}q.oDashboardLoadingManager.setTileResolved(i);x=V.getMode?V.getMode():"ContentMode";if(q.bLinkPersonalizationSupported&&x==="LineMode"){q._attachLinkPressHandlers(A);if(j>=0){y=q.oModel.getProperty("/groups");if(y[j]){i.content=[A];z=q.oModel.getProperty("/groups/"+j+"/links");q.oModel.setProperty("/groups/"+j+"/links",[]);q.oModel.setProperty("/groups/"+j+"/links",z);}}}else if(q.isBlindLoading()){if(i.content&&i.content.length>0){i.content[0].destroy();}i.content=[A];if(j>=0&&!H){q.oModel.refresh(false);}}if(q.isBlindLoading()){var J=q.oPageOperationAdapter.getTileSize(i.object);var K=J==="1x2";if(i.long!==K){i.long=K;}}else if(x==="LineMode"){i.content=[A];if(N){z=q.oModel.getProperty("/groups/"+j+"/links");q.oModel.setProperty("/groups/"+j+"/links",[]);q.oModel.setProperty("/groups/"+j+"/links",z);}}else if(i.content.length===0){i.content=[A];}else{U.apply(q,[E,A]);q._updateModelWithTileView(0,0);}});w.fail(function(){if(q.oPageOperationAdapter.getTileType(i.object)==="link"&&q.bLinkPersonalizationSupported){A=q.oPageOperationAdapter.getFailedLinkView(i);q._attachLinkPressHandlers(A);}else{A=new T({state:"Failed"});}i.content=[A];});if(!A){if(q.oPageOperationAdapter.getTileType(i.object)==="link"){N=true;A=new G({mode:"LineMode"});}else{A=new T();}i.content=[A];}},loadPersonalizedGroups:function(){var i=this;var j=new Q.Deferred();if(this.bIsGroupsRequestPending){L.info("loadPersonalizedGroups was skipped because there is already a pending request.");j.reject();return j.promise();}this.bIsGroupsRequestPending=true;this.oServiceLoadingPromise.then(function(){return i.oPageOperationAdapter.getPage();}).then(function(k){i._setGroupModel(k);i.bIsGroupsRequestPending=false;j.resolve();}).catch(function(){m.showLocalizedError("fail_to_load_groups_msg");i.bIsGroupsRequestPending=false;});n.start("FLP:DashboardManager.loadPersonalizedGroups","loadPersonalizedGroups","FLP");return j.promise();}});});
