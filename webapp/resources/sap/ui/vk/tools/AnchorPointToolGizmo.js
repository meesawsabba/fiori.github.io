/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)

        (c) Copyright 2009-2015 SAP SE. All rights reserved
    
 */
sap.ui.define(["../getResourceBundle","../thirdparty/three","./Gizmo","./AnchorPointToolGizmoRenderer","./CoordinateSystem","./AxisColours","./AnchorPointToolOperation","sap/base/assert"],function(g,t,G,A,C,c,d,e){"use strict";var f=G.extend("sap.ui.vk.tools.AnchorPointToolGizmo",{metadata:{library:"sap.ui.vk"}});f.prototype.init=function(){if(G.prototype.init){G.prototype.init.apply(this);}this._createEditingForm(null,84);this._gizmoIndex=-1;this._handleIndex=-1;this._viewport=null;this._tool=null;this._sceneGizmo=new THREE.Scene();var l=new THREE.DirectionalLight(0xFFFFFF,0.5);l.position.set(1,3,2);this._sceneGizmo.add(l);this._sceneGizmo.add(new THREE.AmbientLight(0xFFFFFF,0.5));this._touchAreas=new THREE.Group();this._gizmo=new THREE.Group();this._sceneGizmo.add(this._gizmo);this._matViewProj=new THREE.Matrix4();this._gizmoSize=96;this._moveDelta=new THREE.Vector3();this._rotationDelta=new THREE.Vector3();function j(a,b,r){var s=96,u=1,v=24,w=4,x=48;a.multiplyScalar(1/s);var y=new THREE.CylinderBufferGeometry(u,u,s-v,4);var m=new THREE.Matrix4().makeBasis(new THREE.Vector3(a.y,a.z,a.x),a,new THREE.Vector3(a.z,a.x,a.y));m.setPosition(a.clone().multiplyScalar((s-v)*0.5));y.applyMatrix4(m);var z=new THREE.MeshLambertMaterial({color:b,transparent:true});var B=new THREE.Mesh(y,z);B.matrixAutoUpdate=false;B.userData.color=b;var D=new THREE.CylinderBufferGeometry(0,w,v,12,1);m.setPosition(a.clone().multiplyScalar(s-v*0.5));D.applyMatrix4(m);var E=new THREE.Mesh(D,z);E.matrixAutoUpdate=false;B.add(E);var F=new THREE.CylinderGeometry(x*0.5,x*0.5,x,12,1);F.applyMatrix4(m);var H=new THREE.CylinderGeometry(x*0.5,x*0.2,x,12,1);m.setPosition(a.clone().multiplyScalar(s*0.5));F.merge(H,m);r.add(new THREE.Mesh(F,z));return B;}function k(a,b,m){var r=new Float32Array(9);r[a]=r[b+6]=1;r[a+3]=r[b+3]=0.5;var v=new THREE.Vector3().setComponent(a,0.333);var s=new THREE.Vector3().setComponent(b,0.333);var q=new THREE.Geometry();q.vertices.push(new THREE.Vector3(),v,s,v.clone().add(s));q.faces.push(new THREE.Face3(0,2,1),new THREE.Face3(1,2,3));var u=new THREE.MeshBasicMaterial({color:0xFFFF00,opacity:0.5,transparent:true,visible:false,side:THREE.DoubleSide});var w=new THREE.Mesh(q,u);w.matrixAutoUpdate=false;w.userData.colors=r;var x=new THREE.BufferGeometry();var y=new Float32Array(9);y[a]=y[a+3]=y[b+3]=y[b+6]=0.333;x.setAttribute("position",new THREE.Float32BufferAttribute(y,3));x.setAttribute("color",new THREE.Float32BufferAttribute(r,3));var z=new THREE.Line(x,new THREE.LineBasicMaterial({vertexColors:THREE.VertexColors,transparent:true,linewidth:window.devicePixelRatio}));z.matrixAutoUpdate=false;w.add(z);var B=new THREE.Geometry();B.vertices.push(new THREE.Vector3(),v,s,v.clone().add(s));B.faces.push(new THREE.Face3(0,1,2),new THREE.Face3(2,1,3));m.add(new THREE.Mesh(B,new THREE.MeshBasicMaterial({side:THREE.DoubleSide})));return w;}function n(a,b,r,s){var q=new THREE.TorusBufferGeometry(r,1/96,4,s,Math.PI/2);if(a===0){q.rotateY(Math.PI/-2);}else if(a===1){q.rotateX(Math.PI/2);}var m=new THREE.Mesh(q,new THREE.MeshBasicMaterial({color:b,transparent:true}));m.matrixAutoUpdate=false;m.userData.color=b;return m;}function o(a,r,s){var q=new THREE.TorusBufferGeometry(r,16/96,4,s,Math.PI/2);if(a===0){q.rotateY(Math.PI/-2);}else if(a===1){q.rotateX(Math.PI/2);}return new THREE.Mesh(q,new THREE.MeshBasicMaterial({opacity:0.2,transparent:true}));}this._gizmo.add(j(new THREE.Vector3(1,0,0),c.x,this._touchAreas));this._gizmo.add(j(new THREE.Vector3(0,1,0),c.y,this._touchAreas));this._gizmo.add(j(new THREE.Vector3(0,0,1),c.z,this._touchAreas));this._gizmo.add(k(1,2,this._touchAreas));this._gizmo.add(k(2,0,this._touchAreas));this._gizmo.add(k(0,1,this._touchAreas));for(var i=0;i<3;i++){this._gizmo.add(n(i,c[["x","y","z"][i]],1,32));this._touchAreas.add(o(i,1,24));}var p=new THREE.MeshBasicMaterial({color:0x0080FF,opacity:0.5,transparent:true,side:THREE.DoubleSide});this._arcMesh=new THREE.Mesh(new THREE.Geometry(),p);this._arcMesh.visible=false;this._gizmo.add(this._arcMesh);this._axisTitles=this._createAxisTitles();this._sceneGizmo.add(this._axisTitles);var q=new THREE.Geometry();q.vertices.push(new THREE.Vector3(),new THREE.Vector3());this._line=new THREE.LineSegments(q,new THREE.LineBasicMaterial());this._line.frustumCulled=false;this._line.visible=false;this._gizmo.add(this._line);};f.prototype.hasDomElement=function(){return true;};f.prototype._updateHandlesVisibility=function(){var a=this._tool.getAllowOperation();var b=a!==d.Rotate;var j=a!==d.Move;var i;for(i=0;i<3;i++){this._touchAreas.children[i].visible=b;}for(i=3;i<6;i++){this._gizmo.children[i].visible=this._touchAreas.children[i].visible=b;}for(i=6;i<9;i++){this._gizmo.children[i].visible=this._touchAreas.children[i].visible=j;}};f.prototype._initAnchorPoint=function(v){v._anchorPoint=this._gizmo;};f.prototype.show=function(v,a){this._viewport=v;this._tool=a;this._updateHandlesVisibility();this._initAnchorPoint(v);};f.prototype.hide=function(){this._viewport=null;this._tool=null;};f.prototype.setPosition=function(p){this._gizmo.position.copy(p);this._gizmo.updateMatrixWorld();};f.prototype.setQuaternion=function(q){this._gizmo.quaternion.copy(q);this._gizmo.updateMatrixWorld();};f.prototype.getGizmoCount=function(){return 1;};f.prototype.getTouchObject=function(i){this._touchAreas.position.copy(this._gizmo.position);this._touchAreas.quaternion.copy(this._gizmo.quaternion);this._touchAreas.scale.copy(this._gizmo.scale);this._touchAreas.updateMatrixWorld(true);return this._touchAreas;};var h=[1,2,4,6,5,3,1,2,4];f.prototype.highlightHandle=function(a,b){var i;for(i=0;i<3;i++){var j=this._gizmo.children[i];var k=h[a]&(1<<i);var l=k?0xFFFF00:j.userData.color;j.material.color.setHex(l);j.children[0].material.color.setHex(l);this._axisTitles.children[i].material.color.setHex(l);}for(i=3;i<6;i++){var p=this._gizmo.children[i];p.material.visible=i===a;var m=p.children[0].geometry.attributes.color;m.copyArray(i===a?[1,1,0,1,1,0,1,1,0]:p.userData.colors);m.needsUpdate=true;p.children[0].material.opacity=(i===a||(b&&a===-1))?1:0.35;p.children[0].visible=(i===a||b);}for(i=6;i<9;i++){var n=this._gizmo.children[i];n.visible=this._tool.getAllowOperation()!==d.Move&&(i===a||b);n.material.color.setHex(i===a?0xFFFF00:n.userData.color);n.material.opacity=(i===a||(b&&a===-1))?1:0.35;}};f.prototype.selectHandle=function(i){this._handleIndex=i;if(i>=0&&i<3){this._units.setText(g().getText("TOOL_UNITS_MM"));}else if(i>=6&&i<9){this._units.setText(String.fromCharCode(176));}this._editingForm.rerender();this._viewport.setShouldRenderFrame();};f.prototype.beginGesture=function(){this._isMoved=false;this._isRotated=false;this._originPosition=new THREE.Vector3().setFromMatrixPosition(this._gizmo.matrixWorld);this._originQuaternion=this._gizmo.quaternion.clone();};f.prototype.endGesture=function(){if(this._isMoved){this._tool.fireMoved({x:this._moveDelta.x,y:this._moveDelta.y,z:this._moveDelta.z});}if(this._isRotated){this._tool.fireRotated({x:this._rotationDelta.x,y:this._rotationDelta.y,z:this._rotationDelta.z});}this._line.visible=false;this._arcMesh.visible=false;};f.prototype._setOffset=function(o,a){if(this._tool.fireEvent("moving",{x:o.x,y:o.y,z:o.z},true)){this._move(o);var m=new THREE.Matrix4().getInverse(this._gizmo.matrixWorld);var s=new THREE.Vector3().setFromMatrixScale(this._gizmo.matrixWorld);var n=this._gizmo.position.clone().applyMatrix4(m);o.copy(this._originPosition).applyMatrix4(m).sub(n).multiply(s);this._line.geometry.vertices[0].copy(o);this._line.geometry.verticesNeedUpdate=true;this._line.geometry.computeBoundingBox();o.set(Math.abs(o.x),Math.abs(o.y),Math.abs(o.z));o.multiplyScalar(1/Math.max(o.x,o.y,o.z));this._line.material.color.setRGB(o.x,o.y,o.z);this._line.visible=true;}};f.prototype._move=function(o){if(this._tool.getAllowOperation()===d.Rotate){return this;}this._isMoved=true;this._moveDelta.copy(o);this._gizmo.position.copy(this._originPosition).add(o);this._viewport.setShouldRenderFrame();};f.prototype.move=function(x,y,z){this.beginGesture();this._move(new THREE.Vector3(x,y,z||0));};f.prototype._setRotationAxisAngle=function(b,j,k){var l=(k-j)%(Math.PI*2);var m=[0,0,0];m[b]=l;m=new THREE.Euler().fromArray(m);if(this._tool.fireEvent("rotating",{x:THREE.Math.radToDeg(m.x),y:THREE.Math.radToDeg(m.y),z:THREE.Math.radToDeg(m.z)},true)){this._rotate(m);var v=[0,0,0];var o=new THREE.Vector3();var p=(b+1)%3,q=(b+2)%3;var i,n=Math.max(Math.ceil(Math.abs(l)*64/Math.PI),1);for(i=0;i<=n;i++){var a=j-l*(i/n);o.set(0,0,0).setComponent(p,Math.cos(a)).setComponent(q,Math.sin(a));v.push(o.x,o.y,o.z);}var r=[];for(i=0;i<n;i++){r.push(0,i+1,i+2);}var s=new THREE.BufferGeometry();s.setIndex(r);s.setAttribute("position",new THREE.Float32BufferAttribute(v,3));this._arcMesh.geometry=s;this._arcMesh.visible=true;}};f.prototype._rotate=function(a){if(this._tool.getAllowOperation()===d.Move){return this;}this._tool._deactivateScreenAlignment();this._isRotated=true;this._rotationDelta.set(THREE.Math.radToDeg(a.x),THREE.Math.radToDeg(a.y),THREE.Math.radToDeg(a.z));var q=new THREE.Quaternion().setFromEuler(a);this._gizmo.quaternion.copy(this._originQuaternion).multiply(q);this._viewport.setShouldRenderFrame();};f.prototype.rotate=function(x,y,z){this.beginGesture();this._rotate(new THREE.Euler(THREE.Math.degToRad(x||0),THREE.Math.degToRad(y||0),THREE.Math.degToRad(z||0)));};f.prototype._getValueLocaleOptions=function(){return(this._handleIndex>=0&&this._handleIndex<3)?{useGrouping:false}:{useGrouping:false,minimumFractionDigits:1,maximumFractionDigits:2};};f.prototype.getValue=function(){if(this._handleIndex>=0&&this._handleIndex<3){var a=new THREE.Vector3().setFromMatrixColumn(this._gizmo.matrixWorld,this._handleIndex).normalize();return a.dot(this._gizmo.position);}if(this._handleIndex>=6&&this._handleIndex<9){return THREE.Math.radToDeg(this._gizmo.rotation.reorder("YXZ")[["x","y","z"][this._handleIndex-6]]);}return 0;};f.prototype.setValue=function(v){if(this._handleIndex>=0&&this._handleIndex<3){var o=new THREE.Vector3().setFromMatrixColumn(this._gizmo.matrixWorld,this._handleIndex).normalize().multiplyScalar(v-this.getValue());this.beginGesture();this._move(o);this.endGesture();}else if(this._handleIndex>=6&&this._handleIndex<9){var a=this._gizmo.rotation.clone();a[["x","y","z"][this._handleIndex-6]]=THREE.Math.degToRad(v);var q=new THREE.Quaternion().setFromEuler(a);var b=this._gizmo.quaternion.clone().inverse().multiply(q);a.setFromQuaternion(b);this.beginGesture();this._rotate(a);this.endGesture();}};f.prototype.expandBoundingBox=function(b){if(this._viewport){this._expandBoundingBox(b,this._viewport.getCamera().getCameraRef(),true);}};f.prototype._updateGizmoTransformation=function(i,a){this._matViewProj.multiplyMatrices(a.projectionMatrix,a.matrixWorldInverse);var s=this._getGizmoScale(this._gizmo.position);this._gizmo.scale.setScalar(this._gizmoSize*s);this._gizmo.updateMatrixWorld(true);this._updateAxisTitles(this._axisTitles,this._gizmo,a,this._gizmoSize+18,s);this._line.scale.setScalar(1/(this._gizmoSize*s));};f.prototype._getEditingFormPosition=function(){var s=this._getGizmoScale(this._gizmo.position);var a=new THREE.Vector3();if(this._handleIndex>=0&&this._handleIndex<3){a.setFromMatrixColumn(this._gizmo.matrixWorld,this._handleIndex).normalize();}else if(this._handleIndex>=6&&this._handleIndex<9){var i=this._handleIndex%3;var b=this._extractBasis(this._gizmo.matrixWorld);a.copy(b[(i+1)%3]).add(b[(i+2)%3]).normalize();}return a.clone().multiplyScalar((this._gizmoSize+18)*s).add(this._gizmo.position).applyMatrix4(this._matViewProj);};f.prototype.render=function(){e(this._viewport&&this._viewport.getMetadata().getName()==="sap.ui.vk.threejs.Viewport","Can't render gizmo without sap.ui.vk.threejs.Viewport");var r=this._viewport.getRenderer(),a=this._viewport.getCamera().getCameraRef();r.clearDepth();this._updateGizmoTransformation(0,a);r.render(this._sceneGizmo,a);this._updateEditingForm((this._handleIndex>=0&&this._handleIndex<3)||(this._handleIndex>=6&&this._handleIndex<9),this._handleIndex%3);};return f;});
