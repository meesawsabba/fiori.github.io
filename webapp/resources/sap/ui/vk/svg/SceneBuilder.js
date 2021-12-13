/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)

        (c) Copyright 2009-2015 SAP SE. All rights reserved
    
 */
sap.ui.define(["sap/base/Log","./Element","./Ellipse","./Rectangle","./Line","./Polyline","./Path","./Text","./Image","./LinearGradient","./OrthographicCamera","../View","../NodeContentType","../TransformationMatrix","../getResourceBundle","../totara/TotaraUtils"],function(L,E,a,R,b,P,c,T,I,d,O,V,N,f,g,h){"use strict";var S=function(r,e,i,j){this._rootNode=r;this._contentResource=e;this._resolve=i;this._reject=j;this._cameras=new Map();this._sceneIdTreeNodesMap=new Map();this._sceneIdRootNodeMap=new Map();this._materialMap=new Map();this._annotationsMap=new Map();this._annotationNodesMap=new Map();this._materialNodesMap=new Map();this._nodes=new Map();this._viewGroups=new Map();this._views=new Map();this._viewThumbnails=new Map();this._parametrics=new Map();this._geometries=new Map();this._geometryMeshes=new Map();this._meshNodes=new Map();this._meshSubmeshes=new Map();this._images=new Map();this._imageTextures=new Map();this._fillStyles=new Map();this._lineStyles=new Map();this._textStyles=new Map();this._joints=new Map();this._yIndex=1;this._detailsByImageId=new Map();this._materialsByTextureImageId=new Map();if(e){var l=e.getNodeProxy();var m=l.getNodeHierarchy();this._vkScene=m.getScene();var s=e.getSource();if(s&&s.name){this._sceneIdTreeNodesMap.set(s.name,this._nodes);this._sceneIdRootNodeMap.set(s.name,r);this._currentSceneId=s.name;}if(this._rootNode){this._rootNode.userData.skipIt=!e.getName();}}};S.prototype.setScene=function(i){if(i.result!==1){var e={status:i.result};switch(i.result){case-1:e.errorText=g().getText("LOADER_FILENOTFOUND");break;case-2:e.errorText=g().getText("LOADER_WRONGFILEFORMAT");break;case-3:e.errorText=g().getText("LOADER_WRONGPASSWORD");break;case-4:e.errorText=g().getText("LOADER_ERRORREADINGFILE");break;case-5:e.errorText=g().getText("LOADER_FILECONTENT");break;default:e.errorText=g().getText("LOADER_UNKNOWNERROR");}this._reject(e);}else{this._yIndex=1;this._rootNode.matrix[3]=i.upAxis===2?-1:1;var j=this._cameras.get(i.cameraId);L.info("setScene",JSON.stringify(i),j);this._resolve({node:this._rootNode,camera:j,backgroundTopColor:i.backgroundTopColor,backgroundBottomColor:i.backgroundBottomColor,contentResource:this._contentResource,builder:this});}};S.prototype.setRootNode=function(r,e,s,v){this._rootNode=r;r.sid=e;this._nodes.set(e,r);this._viewGroups=new Map();this._views=new Map();if(s){this._sceneIdTreeNodesMap.set(s,this._nodes);this._sceneIdRootNodeMap.set(s,r);this._currentSceneId=s;}if(v){this._vkScene=v;}return this;};S.prototype.setNodePersistentId=function(e,i,s){this._resetCurrentScene(s);e.sid=i;this._nodes.set(i,e);return true;};S.prototype.cleanup=function(){this._rootNode=null;this._currentSceneId=null;if(this._nodes){this._nodes.clear();}if(this._viewGroups){this._viewGroups.clear();}if(this._views){this._views.clear();}this._materialMap.clear();this._annotationsMap.clear();this._annotationNodesMap.clear();this._materialNodesMap.clear();this._sceneIdTreeNodesMap.clear();this._sceneIdRootNodeMap.clear();this._detailsByImageId.clear();this._materialsByTextureImageId.clear();this._fillStyles.clear();this._lineStyles.clear();this._textStyles.clear();};S.prototype.getNode=function(e,s){if(s){this._resetCurrentScene(s);if(this._nodes){return this._nodes.get(e);}}else{var i=this._sceneIdTreeNodesMap.values();var j=i.next();while(!j.done){var l=j.value.get(e);if(l){return l;}j=i.next();}}return null;};S.prototype._resetCurrentScene=function(s){if(s&&s!==this._currentSceneId){var e=this._sceneIdTreeNodesMap.get(s);if(e){this._nodes=e;}else{this._nodes=new Map();}var i=this._sceneIdRootNodeMap.get(s);if(i){this._rootNode=i;}else{this._rootNode=null;}this._currentSceneId=s;}};S.prototype.createCamera=function(e,s){this._resetCurrentScene(s);var i=new O();i.setUpDirection(Array.isArray(e.up)?e.up:[0,1,0]);i.setZoomFactor(e.zoom);i.setPosition(e.origin);this._cameras.set(e.id,i);return i;};S.prototype.getCamera=function(e){return this._cameras.get(e);};S.prototype.hasMesh=function(m){return this._meshSubmeshes.has(m);};S.prototype.hasImage=function(i){return this._images.has(i);};S.prototype.hasAnnotation=function(e){return this._annotationsMap.has(e);};function k(l){if(Array.isArray(l)){for(var i=0;i<l.length;i++){if(l[i].type===undefined||l[i].type==="mesh"||l[i].type==="line"){return l[i];}}}return null;}S.prototype.setMeshNode=function(e,m){this._setMeshNode(this._nodes.get(e),m);};S.prototype.setModelViewVisibilitySet=function(){};S.prototype.setAnimationPlaybacks=function(){};S.prototype.loadingFinished=function(i){L.info("loadingFinished",JSON.stringify(i));this._loader.fireContentLoadingFinished({source:this._contentResource,node:this._rootNode});};S.prototype.createThumbnail=function(i){var v=this._viewThumbnails.get(i.imageId);if(v){v.thumbnailData="data:image/"+"jpeg"+";base64,"+window.btoa(String.fromCharCode.apply(null,i.data));if(this._fireThumbnailLoaded){this._fireThumbnailLoaded({modelView:v});}}};S.prototype.insertSubmesh=function(s){if(!s.lods){return false;}var l=k(s.lods);if(!l){return false;}s.boundingBox=l.boundingBox;var e=this._geometries.get(l.id);if(e){var i=this._meshNodes.get(s.meshId);if(i){for(var j=0;j<i.length;j++){this._addGeometryToNode(i[j],e,s);}}}else{h.pushElementIntoMapArray(this._geometryMeshes,l.id,s);}h.pushElementIntoMapArray(this._meshSubmeshes,s.meshId,s);};S.prototype.getViewGroup=function(v,s){this._resetCurrentScene(s);var e=this._viewGroups.get(v);var i=[];if(e&&e.views){for(var j=0;j<e.views.length;j++){var l=e.views[j].id;var m=this._views.get(l);if(m){i.push(m);}}}return i;};S.prototype.insertViewGroup=function(i,s){this._resetCurrentScene(s);var v=this._viewGroups.get(i.id);if(!v){v=this._vkScene.createViewGroup({viewGroupId:i.id,name:i.name,description:i.description});this._viewGroups.set(i.id,v);}else{v.setViewGroupId(i.id);v.setName(i.name);v.setDescription(i.description);}v.type=i.type;v.metadata=i.metadata;v.veids=i.veids;v.views=i.views;v.sceneId=i.sceneId;return this;};S.prototype.insertView=function(v,s){this._resetCurrentScene(s);var e=this._vkScene.createView({viewId:v.viewId,name:v.name,description:v.description?"<pre class=\"sapVizKitViewGalleryStepDescriptionPre\">"+v.description+"</pre>":v.description,aspectRatio:v.safeAreaAspectRatio});e.userData={viewInfo:v};if(v.thumbnailId){var i=this._images.get(v.thumbnailId);if(i){e.thumbnailData=i;}else{this._viewThumbnails.set(v.thumbnailId,e);}}if(v.cameraId){e.setCamera(this._cameras.get(v.cameraId));}e.type=v.type;e.flyToTime=v.flyToTime;e.preDelay=v.preDelay;e.postDelay=v.postDelay;e.navigationMode=v.navigationMode;e.topColor=v.topColour;e.bottomColor=v.bottomColour;e.dimension=v.dimension;e.query=v.query;e.metadata=v.metadata;e.veids=v.veids;e.viewGroupId=v.viewGroupId;e.id=v.viewId;this._views.set(v.viewId,e);if(e.viewGroupId){var j=this._viewGroups.get(e.viewGroupId);if(j){j.addView(e);}}return this;};S.prototype.getView=function(v,s){this._resetCurrentScene(s);return this._views.get(v);};S.prototype.setViewCamera=function(e,v,s){this._resetCurrentScene(s);var i=this._cameras.get(e);var j=this._views.get(v);if(i&&j){j.setCamera(i);}return this;};S.prototype.getChildNodeIds=function(e,s,j){this._resetCurrentScene(s);var l=this._nodes.get(e);var m=[];if(!l){return m;}if(l&&l.children){for(var i=0;i<l.children.length;i++){var o=l.children[i];if(o.userData.treeNode&&o.userData.treeNode.sid){m.push(o.userData.treeNode.sid);}else if(j&&o.userData.submeshInfo&&o.userData.submeshInfo.id){m.push(o.userData.submeshInfo.id);}}}return m;};S.prototype.setViewNodeInfos=function(e,v,s){this._resetCurrentScene(s);var i=this._views.get(v);i.setNodeInfos(e);return this;};S.prototype.finalizeViewGroups=function(s){this._resetCurrentScene(s);var e=this._viewGroups.entries();var i=e.next();while(!i.done){var v=i.value[1];var j=i.value[0];if(!v||!v.views||!v.views.length){i=e.next();continue;}v.removeViews();for(var l=0;l<v.views.length;l++){var m=v.views[l].id;var o=this._views.get(m);if(o&&o.userData.viewInfo.thumbnailId&&!o.thumbnailData){var q=this._images.get(o.userData.viewInfo.thumbnailId);if(q){o.thumbnailData=q;}}if(o){o.viewGroupId=j;v.addView(o);}}i=e.next();}return this;};S.prototype.setVoxelThreshold=function(v){return this;};S.prototype.getVoxelThreshold=function(){return 0.0;};S.prototype.createNode=function(e,s){this._resetCurrentScene(s);var t=e.transform;var i=new E({sid:e.sid,name:e.name,matrix:f.convertTo3x2(t)});this._nodes.set(e.sid,i);var j=i.userData;if(e.metadata){j.metadata=e.metadata;}if(e.veids){j.veids=e.veids;}if(e.parametricId){j.parametricId=e.parametricId;var l=this._parametrics.get(e.parametricId);if(l){this.setParametricContent(e.sid,l,s);}}else if(e.meshId){this._setMeshNode(i,e.meshId);}j.treeNode=e;i.setVisible(1,e.visible?e.visible:true);if(e.visualisable===false){j.skipIt=true;}if(e.joints){e.joints.forEach(function(q){var o=this._nodes.get(q.parentSid);if(o){o.userData.jointNodes=o.userData.jointNodes||[];o.userData.jointNodes.push(i);}else{h.pushElementIntoMapArray(this._joints,q.parentSid,i);}},this);}var m=this._joints.get(e.sid);if(m){j.jointNodes=j.jointNodes?j.jointNodes.concat(m):m;}if(e.viewBox){j.viewBox=e.viewBox;}var o=this._nodes.get(e.parentId);(o||this._rootNode).add(i);if(e.contentType==="HOTSPOT"){i._vkSetNodeContentType(N.Hotspot);}else if(e.contentType==="ANNOTATION"){i._vkSetNodeContentType(N.Annotation);}return i;};S.prototype.preferMeshes=function(){return false;};S.prototype.createAnnotation=function(e,s){h.pushElementIntoMapArray(this._annotationNodesMap,e.annotationId,e.nodeId);var i=this.getAnnotation(e.annotationId);if(i){this.createImageNote(i,s);}};S.prototype.remove=function(e,s){this._resetCurrentScene(s);var t=this;e=[].concat(e);e.forEach(function(j){var l=t._nodes.get(j);if(l){t._nodes.delete(j);for(var i=0;i<l.children.length;i++){var m=l.children[i];if(m.userData&&m.userData.treeNode&&m.userData.treeNode.sid){t.remove(m.userData.treeNode.sid,s);}}}});return this;};S.prototype._addGeometryToNode=function(e,j,s){var m=s.materialId;var o=this._getMaterial(m);var q=j.data;var r=q.indices;var t=q.points;var v=new Float32Array([1,0,0,1,0,0]);if(j.isPositionQuantized&&s.boundingBox){}if(s.transform){}var i,w,x,y;var l=r.length;var z=[];if(j.isPolyline){for(i=0,w=-1;i<l;i+=2,w=y){x=r[i]*3;y=r[i+1]*3;if(x!==w){z.push({type:"move",points:[t[x],t[x+this._yIndex]]});z.push({type:"line",points:[t[y],t[y+this._yIndex]]});}else{z[z.length-1].points.push(t[y],t[y+this._yIndex]);}}}else{o=Object.assign(Object.assign({},o),{lineColor:[0,0,0,0],lineWidth:0});for(i=0;i<l;i+=3){w=r[i]*3;x=r[i+1]*3;y=r[i+2]*3;z.push({type:"move",points:[t[w],t[w+this._yIndex]]});z.push({type:"line",points:[t[x],t[x+this._yIndex],t[y],t[y+this._yIndex]]});z.push({type:"close"});}}var A=new c({segments:z,isTriangleMesh:!j.isPolyline,matrix:v,material:o,materialID:m,fillStyle:j.isPolyline?null:{colour:o.color},subelement:true});A.uid+="-g";e.add(A);h.pushElementIntoMapArray(this._materialNodesMap,m,A);};S.prototype.setGeometry=function(e){this._geometries.set(e.id,e);var i=this._geometryMeshes.get(e.id);if(i){for(var m=0;m<i.length;m++){var s=i[m];var j=this._meshNodes.get(s.meshId);if(j){for(var l=0;l<j.length;l++){this._addGeometryToNode(j[l],e,s);}}}}if(this._fireSceneUpdated){this._fireSceneUpdated();}return this;};S.prototype._setMeshNode=function(e,m){h.pushElementIntoMapArray(this._meshNodes,m,e);var s=this._meshSubmeshes.get(m);if(s){for(var i=0;i<s.length;i++){var j=s[i];var l=k(j.lods);if(l){var o=this._geometries.get(l.id);if(o){this._addGeometryToNode(e,o,j);}}}}};function n(s){var m=new Float32Array([1,0,0,1,0,0]);if(s.t){m[4]=s.t[0];m[5]=s.t[1];}if(s.r){var x=s.r[0],y=s.r[1],z=s.r[2],w=s.r[3];var e=x*y;var i=z*z;var j=w*z;m[0]=1-(y*y+i)*2;m[1]=(e+j)*2;m[2]=(e-j)*2;m[3]=1-(x*x+i)*2;}if(s.s){m[0]*=s.s[0];m[1]*=s.s[0];m[2]*=s.s[1];m[3]*=s.s[1];}return m;}S.prototype.setParametricContent=function(e,j,s){if(j==null){L.warning("Empty parametric content for node "+e);return;}this._parametrics.set(j.id,j);this._resetCurrentScene(s);var l=this._nodes.get(e);l.uid+="-p";var m=j.shapes;if(m){for(var i=0;i<m.length;i++){this._createObject(m[i],l);}}else{this._createObject(j,l);}};function p(e,i,r,j,l){return[e+r*Math.cos(l),i+j*Math.sin(l)];}S.prototype._createObject=function(e,i){e.matrix=n(e);e.subelement=true;if(e.materialID){e.material=this._getMaterial(e.materialID);}if(this._lineStyles&&e.stroke_id!==undefined){e.lineStyle=this._lineStyles.get(e.stroke_id);}if(this._fillStyles&&e.fill_id!==undefined){e.fillStyle=this._fillStyles.get(e.fill_id);if(e.fillStyle.gradient){var j=new d(e.fillStyle);e.fillStyle.fillURL="url(#"+j.uid+")";i.add(j);}}if(this._textStyles&&e.style_id!==undefined){e.style=this._textStyles.get(e.style_id);e.textStyles=this._textStyles;}var s;switch(e.type){case"arc":case"ellipticalArc":var l=e.cx||0;var m=e.cy||0;var r=e.major||e.radius;var o=e.minor||e.radius;var q=e.start>e.end?e.start-Math.PI*2:e.start;var t=e.end;e.segments=[{type:"move",points:p(l,m,r,o,q)},{type:"arc",major:r,minor:o,"short":Math.abs(t-q)<Math.PI,clockwise:t>q,points:p(l,m,r,o,t)}];s=new c(e);break;case"rectangle":s=new R(e);break;case"line":s=new b(e);break;case"polyline":s=new P(e);break;case"ellipse":case"circle":s=new a(e);break;case"text":if(this._rootNode.matrix[3]<0){e.matrix[2]*=-1;e.matrix[3]*=-1;}s=new T(e);break;case"path":s=new c(e);break;default:L.warning("Unsupported parametric type",e.type);s=null;break;}if(s){s.userData.po=e;s.uid+="-s";if(e.materialID){h.pushElementIntoMapArray(this._materialNodesMap,e.materialID,s);}i.add(s);}};S.prototype.createImageNote=function(e,s){this._resetCurrentScene(s);if(e.type==="image"){var m=e.label.materialId;if(!m){return;}var i=this._getMaterial(m);this._annotationsMap.set(e.id,e);var l=this._annotationNodesMap.get(e.id)||[];this._annotationNodesMap.delete(e.id);if(e.nodeId){l.push(e.nodeId);}for(var j=0;j<l.length;j++){var o=this._nodes.get(l[j]);if(o){var q=new I({materialID:m,material:i,subelement:true,matrix:[1,0,0,-1,0,0]});o.add(q);h.pushElementIntoMapArray(this._materialNodesMap,m,q);}}}};S.prototype.removeNode=function(e){this._nodes.delete(e.sid);};S.prototype.createMaterial=function(m){var t=[];var e=m.id;var i=this._getMaterial(e);i.lineColor=m.lineColour;i.lineWidth=m.lineWidth||1;i.lineStyle={width:m.lineWidth||1,haloWidth:m.lineHaloWidth||0,endCapStyle:m.lineEndRound?1:0,dashPattern:m.lineDashPattern||[],dashPatternScale:m.lineDashPatternScale,widthCoordinateSpace:m.lineWidthCoordinateSpace};if(m.emissiveColour){i.color=m.emissiveColour;}if(m.opacity!==undefined){i.opacity=m.opacity;}if(m.textureEmissive&&m.textureEmissive.length&&m.textureEmissive[0].imageId){var l=m.textureEmissive[0].imageId;if(this._images.has(l)){i.texture=this._images.get(l);}else{var o={imageId:m.textureEmissive[0].imageId};t.push(o);h.pushElementIntoMapArray(this._imageTextures,l,{materialId:e});if(!i.userData){i.userData={};}i.userData.imageIdsToLoad=new Set();i.userData.imageIdsToLoad.add(o.imageId);}i.textureWidth=m.textureEmissive[0].width;i.textureHeight=m.textureEmissive[0].height;h.pushElementIntoMapArray(this._materialsByTextureImageId,l,{materialId:e});}var q=this._materialNodesMap.get(e);if(q){for(var j=0;j<q.length;j++){q[j].setMaterial(i,true);}}return t;};S.prototype._getMaterial=function(m){return this._materialMap.get(m)||this._createTemporaryMaterial(m);};S.prototype._createTemporaryMaterial=function(m){var e={materialId:m,lineColor:[0,0,0,1],lineWidth:1};this._materialMap.set(m,e);return e;};S.prototype.checkMaterialExists=function(m,t){if(!this._materialMap.get(m)){if(t){this._createTemporaryMaterial(m);}return false;}return true;};S.prototype.materialNeeded=function(e){return false;};S.prototype.getAnnotation=function(e){return this._annotationsMap.get(e);};S.prototype.updateViewsForReplacedNodes=function(e){};S.prototype.insertFillStyle=function(e){this._fillStyles.set(e.veid,e);};S.prototype.insertLineStyle=function(l){this._lineStyles.set(l.veid,l);};S.prototype.insertTextStyle=function(t){this._textStyles.set(t.veid,t);};var u=function(i){var j="";try{var C=0x8000;var l=0;var m=i.length;var s;while(l<m){s=i.slice(l,Math.min(l+C,m));j+=String.fromCharCode.apply(null,s);l+=C;}}catch(e){j="";}return j;};S.prototype.createImage=function(i){if(i.binaryData.length<32){L.warning("SceneBuilder.createImage()","Can't create image from empty data");return this;}var e=new DataView(i.binaryData.buffer);var l=true;if(e.getUint8(0,true)===parseInt("0xFF",16)&&e.getUint8(1,true)===parseInt("0xD8",16)){l=false;}var o=u(i.binaryData);var q="data:image/"+(l?"png":"jpeg")+";base64,"+btoa(o);this._images.set(i.id,q);var r=this._imageTextures.get(i.id);if(r&&r.length){this._imageTextures.delete(i.id);r.forEach(function(m){var s=this._getMaterial(m.materialId);s.texture=q;if(s.userData&&s.userData.imageIdsToLoad&&s.userData.imageIdsToLoad.size){s.userData.imageIdsToLoad.delete(i.id);}var t=this._materialNodesMap.get(m.materialId);if(t){for(var j=0;j<t.length;j++){t[j].setMaterial(s,true);}}}.bind(this));}return this;};S.prototype.setViewThumbnail=function(i,v,s,t){this._resetCurrentScene(s);var e=this._views.get(v);var j=this._images.get(i);if(e&&j){if(e.userData!==undefined){if(e.userData.viewInfo.thumbnailId===i){e.thumbnailData=j;}}}return this;};return S;});
