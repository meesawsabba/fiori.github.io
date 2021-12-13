/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)
        (c) Copyright 2009-2021 SAP SE. All rights reserved
    
 */
sap.ui.define(["sap/fe/macros/ResourceModel","sap/fe/macros/CommonHelper","sap/fe/core/CommonUtils","sap/ui/model/odata/v4/AnnotationHelper","sap/ui/base/ManagedObject","sap/base/Log","sap/ui/model/json/JSONModel","sap/fe/core/helpers/StableIdHelper","sap/fe/macros/internal/valuehelp/ValueListHelper","sap/fe/core/templating/UIFormatters","sap/fe/core/helpers/BindingExpression"],function(R,C,a,A,M,L,J,S,V,U,B){"use strict";var I="@Org.OData.Measures.V1.ISOCurrency",b="@Org.OData.Measures.V1.Unit";function _(i){var m=i.getModel(),f=i.getSetting("sap.fe.macros.internal.Field"),s=f.sideEffects;if(s){return Promise.resolve(s);}s={};return m.requestObject("/$").then(function(e){var c=function(k){return e[k]["$kind"]==="EntityType";},d=function(E,h,o){var q=(h.indexOf("#")>-1&&h.substr(h.indexOf("#")))||"",j=o.SourceProperties||[],k=o.SourceEntities||[],p=[];j.forEach(function(l){var P=l["$PropertyPath"],n=P.indexOf("/")>0?"/"+E+"/"+P.substr(0,P.lastIndexOf("/")+1)+"@sapui.name":false,r=!n?Promise.resolve(E):m.requestObject(n);P=n?P.substr(P.lastIndexOf("/")+1):P;p.push(r.then(function(O){s[O]=s[O]||[[],{}];s[O][1][P]=s[O][1][P]||[];s[O][1][P].push(E+q+((j.length===1&&"$$ImmediateRequest")||""));}));});k.forEach(function(l){var n=l["$NavigationPropertyPath"],r;if(n===""){r=Promise.resolve(E);}else{r=m.requestObject("/"+E+"/"+n+"/@sapui.name");}p.push(r.then(function(O){s[O]=s[O]||[[],{}];s[O][0].push(E+q+"$$ImmediateRequest");}));});return Promise.all(p);},g=function(E){return m.requestObject("/"+E+"@").then(function(o){var h=Object.keys(o).filter(function(j){return j.indexOf("@com.sap.vocabularies.Common.v1.SideEffects")>-1;}).map(function(j){return d(E,j,o[j]);});return Promise.all(h);});};return Promise.all(Object.keys(e).filter(c).map(g)).then(function(){f.sideEffects=s;return s;});});}var F={displayMode:function(p,c){var t=p["@com.sap.vocabularies.Common.v1.Text"],T=t&&((p&&p["@com.sap.vocabularies.Common.v1.Text@com.sap.vocabularies.UI.v1.TextArrangement"])||(c&&c["@com.sap.vocabularies.UI.v1.TextArrangement"]));if(T){if(T.$EnumMember==="com.sap.vocabularies.UI.v1.TextArrangementType/TextOnly"){return"Description";}else if(T.$EnumMember==="com.sap.vocabularies.UI.v1.TextArrangementType/TextLast"){return"ValueDescription";}return"DescriptionValue";}return t?"DescriptionValue":"Value";},buildExpressionForTextValue:function(p,d){var m=d.context.getModel(),P=d.context.getPath(),t=m.createBindingContext(P+"@com.sap.vocabularies.Common.v1.Text"),T=t.getProperty(),s=T?A.value(T,{context:t}):undefined,e="",p=A.getNavigationPath(p);if(p.indexOf("/")>-1&&s){e=p.replace(/[^\/]*$/,s.substr(1,s.length-2));}else{e=s;}if(e){e="{ path : '"+e.replace(/^\{+/g,"").replace(/\}+$/g,"")+"', parameters: {'$$noPatch': true}}";}return e;},buildTargetPathFromDataModelObjectPath:function(d){var s=d.startingEntitySet.name;var p="/"+s;var n=d.navigationProperties;for(var i=0;i<n.length;i++){p+="/"+n[i].name;}return p;},hasSemanticObjectTargets:function(s,c,p,P){var d=F.buildTargetPathFromDataModelObjectPath(P);var e=d+"/"+p.path;var f;if(!!(s&&s.$Path)){f=B.compileBinding(B.bindingExpression(s.$Path));}if(e&&s&&(s.length>0||f)){var g=e.replace(/\//g,"_");if(!f){var h="pageInternal>semanticsTargets/"+s+"/"+g+(!c?"/HasTargetsNotFiltered":"/HasTargets");return"{parts:[{path:'"+h+"'}], formatter:'FieldRuntime.hasTargets'}";}else{return undefined;}}else{return false;}},isNotAlwaysHidden:function(d,D){var c=D.context,i=false;if(d.Value&&d.Value.$Path){i=c.getObject("Value/$Path@com.sap.vocabularies.UI.v1.Hidden");}if(!i||i.$Path){i=c.getObject("@com.sap.vocabularies.UI.v1.Hidden");if(!i||i.$Path){i=false;}}return!i;},getRequiredForDataField:function(f,e,p){var E;if(!f){f=p;}if(e==="Display"||e==="ReadOnly"||e==="Disabled"){return false;}if(f&&e){if(e.startsWith("{")){e="{ui>/editMode}";}if(e.indexOf("{")>-1){E="%"+e+" === 'Editable'";}if(f.indexOf("{")>-1){var s="%"+f+" === 7";return e==="Editable"?"{="+s+"}":"{= "+s+" && "+E+"}";}else{return e==="Editable"?f=="com.sap.vocabularies.Common.v1.FieldControlType/Mandatory":f=="com.sap.vocabularies.Common.v1.FieldControlType/Mandatory"&&"{= "+E+"}";}}return false;},isRequired:function(f,e){if(e==="Display"||e==="ReadOnly"||e==="Disabled"){return false;}if(f){if(M.bindingParser(f)){var E="{= %"+f+" === 7}";return E;}else{return f=="com.sap.vocabularies.Common.v1.FieldControlType/Mandatory";}}return false;},_getDraftAdministrativeDataType:function(m,e){return m.requestObject("/"+e+"/DraftAdministrativeData/");},getBindingForDraftAdminBlockInline:function(c,e){return F._getDraftAdministrativeDataType(c.getModel(),e).then(function(d){var f=[];if(d.InProcessByUserDescription){f.push("${DraftAdministrativeData/InProcessByUserDescription}");}f.push("${DraftAdministrativeData/InProcessByUser}");if(d.LastChangedByUserDescription){f.push("${DraftAdministrativeData/LastChangedByUserDescription}");}f.push("${DraftAdministrativeData/LastChangedByUser}");return"{= %{HasDraftEntity} ? ("+f.join(" || ")+") : '' }";});},propertyName:function(p,i){var P;if(typeof p==="string"){if(i.context.getPath().indexOf("$Path")>-1||i.context.getPath().indexOf("$PropertyPath")>-1){P=p;}}else if(p.$Path||p.$PropertyPath){var s=p.$Path?"/$Path":"/$PropertyPath";var c=i.context.getPath();P=i.context.getObject(c+s+"/$@sapui.name");}else if(p.Value&&p.Value.$Path){P=p.Value.$Path;}else{P=i.context.getObject("@sapui.name");}return P;},getFieldGroupIds:function(c,p){if(!p){return undefined;}var i=c.getInterface(0);return _(i).then(function(s){var P=p,o=c.getPath(1).substr(1),d=P.indexOf("/")>0,f,e;P=d?P.substr(P.lastIndexOf("/")+1):P;f=(s[o]&&s[o][0].concat(s[o][1][P]||[]))||[];if(f.length){e=f.reduce(function(r,g){return(r&&r+","+g)||g;});}return e;});},fieldControl:function(p,i){var m=i&&i.context.getModel();var P=i&&i.context.getPath();var f=m&&m.createBindingContext(P+"@com.sap.vocabularies.Common.v1.FieldControl");var o=f&&f.getProperty();if(o){if(o.hasOwnProperty("$EnumMember")){return o.$EnumMember;}else if(o.hasOwnProperty("$Path")){return A.value(o,{context:f});}}else{return undefined;}},getNavigationEntity:function(p,c){var o=(c&&c.context)||p,n=A.getNavigationPath(o.getPath())+"/",P=o.getObject().$Path,N="",s=P.split("/").pop();if(P.indexOf("/")>-1){N=P.substring(0,P.lastIndexOf("/"))+"/";n+=N;}var e=o.getObject(n),k=Object.keys(e),l=k.length,i=0;for(;i<l;i++){if(e[k[i]].$kind==="NavigationProperty"&&e[k[i]].$ReferentialConstraint&&e[k[i]].$ReferentialConstraint.hasOwnProperty(s)){return c?A.getNavigationBinding(N+k[i]):n+k[i];}}},valueHelpProperty:function(p,i){var c=p.getPath(),o=p.getObject()||{},P=o.$Path?c+"/$Path":c,s=P+"@",d=p.getObject(s),e;if(d){e=(d.hasOwnProperty(I)&&I)||(d.hasOwnProperty(b)&&b);if(e&&!i){var u=P+e+"/$Path";if(p.getObject(u)){P=u;}}}return P;},valueHelpPropertyForFilterField:function(p){return F.valueHelpProperty(p,true);},getIDForFieldValueHelp:function(f,i,o,p){if(f){return f;}var P=p;if(o!==p){P=o+"::"+p;}return S.generate([i,P]);},getFieldHelpPropertyForFilterField:function(p,v,P,s,h){if(p==="Edm.Boolean"&&!h){return undefined;}return F.getIDForFieldValueHelp(null,v||"FilterFieldValueHelp",P,s);},getSemanticKeyTitle:function(p,P,d,t,s,D){var n=R.getText("T_NEW_OBJECT");var u=R.getText("T_ANNOTATION_HELPER_DEFAULT_OBJECT_PAGE_HEADER_TITLE_NO_HEADER_INFO");var N,c;var e;var f=function(v){N="($"+v+" === '' || $"+v+" === undefined || $"+v+" === null ? '"+n+"': $"+v+")";c="($"+v+" === '' || $"+v+" === undefined || $"+v+" === null ? '"+u+"': $"+v+")";return("(!%{IsActiveEntity} ? !%{HasActiveEntity} ? "+N+" : "+c+" : "+c+")");};var g=function(v,i){var E;if(D){E=f(v);return i?"{= "+E+"}":E;}else{return i?v:"$"+v;}};if(p){if(t&&s!=="ObjectIdentifier"){var T=t.$EnumMember;if(T==="com.sap.vocabularies.UI.v1.TextArrangementType/TextFirst"){e=g(p,false);return("{= "+e+" +' (' + "+"($"+P+(d?" || ${"+d+"}":"")+") +')' }");}else if(T==="com.sap.vocabularies.UI.v1.TextArrangementType/TextLast"){e=g(p,false);return("{= ($"+P+(d?" || ${"+d+"}":"")+")"+" + ' (' + "+e+" +')' }");}else{return g(p,true);}}else{return g(p,true);}}else{return g(P,true);}},getObjectIdentifierText:function(t,T,p,d){if(t){if(T&&(T.$EnumMember==="com.sap.vocabularies.UI.v1.TextArrangementType/TextOnly"||T.$EnumMember==="com.sap.vocabularies.UI.v1.TextArrangementType/TextSeparate")){return undefined;}else{return p||"{"+d+"}";}}return undefined;},getSemanticObjectsList:function(p){var c=p;var s=[];for(var k in c.getObject()){if(k.indexOf("com.sap.vocabularies.Common.v1.SemanticObject")>-1&&k.indexOf("com.sap.vocabularies.Common.v1.SemanticObjectMapping")===-1&&k.indexOf("com.sap.vocabularies.Common.v1.SemanticObjectUnavailableActions")===-1){var d=c.getObject()[k];if(typeof d==="object"){d=A.value(d,{context:p});}if(s.indexOf(d)===-1){s.push(d);}}}var o=new J(s);o.$$valueAsPromise=true;return o.createBindingContext("/");},getSemanticObjectsQualifiers:function(p){var c=p;var q=[];var f=function(g){return q.find(function(o){return o.qualifier===g;});};for(var k in c.getObject()){if(k.indexOf("com.sap.vocabularies.Common.v1.SemanticObject#")>-1||k.indexOf("com.sap.vocabularies.Common.v1.SemanticObjectMapping#")>-1||k.indexOf("com.sap.vocabularies.Common.v1.SemanticObjectUnavailableActions#")>-1){var d=c.getObject()[k],e=k.split("#")[0],g=k.split("#")[1],h=f(g);if(!h){h={qualifier:g};h[e]=d;q.push(h);}else{h[e]=d;}}}q=q.filter(function(o){return!!o["@com.sap.vocabularies.Common.v1.SemanticObject"];});var Q=new J(q);Q.$$valueAsPromise=true;return Q.createBindingContext("/");},getSemanticObjectsWithAnnotations:function(p){var c=p;var s=[];var f=function(q){return s.find(function(g){return g.qualifier===q;});};for(var k in c.getObject()){if(k.indexOf("com.sap.vocabularies.Common.v1.SemanticObject")>-1||k.indexOf("com.sap.vocabularies.Common.v1.SemanticObjectMapping")>-1||k.indexOf("com.sap.vocabularies.Common.v1.SemanticObjectUnavailableActions")>-1){if(k.indexOf("#")>-1){var d=c.getObject()[k],e=k.split("#")[0],q=k.split("#")[1],l=f(q);if(k==="@com.sap.vocabularies.Common.v1.SemanticObject"&&typeof d==="object"){d=A.value(d[0],{context:p});}if(!l){l={qualifier:q};l[e]=d;s.push(l);}else{l[e]=d;}}else{var d=c.getObject()[k],e,q;if(k.indexOf("com.sap.vocabularies.Common.v1.SemanticObjectMapping")>-1){e="@com.sap.vocabularies.Common.v1.SemanticObjectMapping";}else if(k.indexOf("com.sap.vocabularies.Common.v1.SemanticObjectUnavailableActions")>-1){e="@com.sap.vocabularies.Common.v1.SemanticObjectUnavailableActions";}else if(k.indexOf("com.sap.vocabularies.Common.v1.SemanticObject")>-1){e="@com.sap.vocabularies.Common.v1.SemanticObject";}var l=f("main");if(k==="@com.sap.vocabularies.Common.v1.SemanticObject"&&typeof d==="object"){d=A.value(d,{context:p});}if(!l){l={qualifier:"main"};l[e]=d;s.push(l);}else{l[e]=d;}}}}s=s.filter(function(Q){return!!Q["@com.sap.vocabularies.Common.v1.SemanticObject"];});var o=new J(s);o.$$valueAsPromise=true;return o.createBindingContext("/");},hasSemanticObjectsWithPath:function(s,t){var c=false;for(var i=0;i<s.length;i++){if(s[i]&&s[i].value&&s[i].value.indexOf("{")===0){c=true;break;}}return c;},computeLinkParameters:function(d,e,s,c,f,g,m,n,p,h){if(!!h){if(!(h[0]==="[")){s.push(h);}else{JSON.parse(h).forEach(function(i){s.push(i);});}if(c&&c.length==0){c=undefined;}}return Promise.resolve().then(function(v){var i=[],j=[];var r=c&&c.filter(function(k){return k.qualifier==="main";})[0]["@com.sap.vocabularies.Common.v1.SemanticObject"];if(c){c.forEach(function(k){if(k["@com.sap.vocabularies.Common.v1.SemanticObjectUnavailableActions"]){var u={semanticObject:k["@com.sap.vocabularies.Common.v1.SemanticObject"],actions:k["@com.sap.vocabularies.Common.v1.SemanticObjectUnavailableActions"]};j.push(u);}if(k["@com.sap.vocabularies.Common.v1.SemanticObjectMapping"]){var l=[];k["@com.sap.vocabularies.Common.v1.SemanticObjectMapping"].forEach(function(q){l.push({key:q.LocalProperty.$PropertyPath,value:q.SemanticObjectProperty});});var o={semanticObject:k["@com.sap.vocabularies.Common.v1.SemanticObject"],items:l};i.push(o);}});return JSON.stringify({name:d,payload:{semanticObjects:s,entityType:e,semanticObjectUnavailableActions:j,semanticObjectMappings:i,semanticPrimaryActions:[],mainSemanticObject:r,propertyPathLabel:p,dataField:f,contact:g,navigationPath:n}});}else{return JSON.stringify({name:d,payload:{semanticObjects:s,entityType:e,semanticObjectUnavailableActions:j,semanticObjectMappings:i,semanticPrimaryActions:[],mainSemanticObject:r,propertyPathLabel:p,dataField:f,contact:g,navigationPath:n}});}});},_getPrimaryIntents:function(s){var p=[];if(s){var u=sap.ushell&&sap.ushell.Container;var o=u&&u.getService("CrossApplicationNavigation");s.forEach(function(c){if(typeof c==="string"){p.push(o.getPrimaryIntent(c,{}));}});}return Promise.all(p).then(function(c){return c;}).catch(function(e){L.error("Error fetching primary intents",e);});},checkPrimaryActions:function(s){return new Promise(function(r){return F._getPrimaryIntents(s&&s.semanticObjects).then(function(c){s.semanticPrimaryActions=c;var p=s.semanticObjects&&s.mainSemanticObject&&s.semanticPrimaryActions[s.semanticObjects.indexOf(s.mainSemanticObject)];var u=sap.ushell&&sap.ushell.Container;var x=u&&u.getService("CrossApplicationNavigation");var d=x.hrefForExternal();if(s.mainSemanticObject&&p!==null&&p.intent!==d){for(var i=0;i<s.semanticObjectUnavailableActions.length;i++){if(s.mainSemanticObject.indexOf(s.semanticObjectUnavailableActions[i].semanticObject)===0){for(var j=0;j<s.semanticObjectUnavailableActions[i].actions.length;j++){if(p.intent.split("-")[1].indexOf(s.semanticObjectUnavailableActions[i].actions[j])===0){r(false);}}}}r(true);}else{r(false);}});}).catch(function(e){L.error("Error in checkPrimaryActions",e);});},getPrimaryAction:function(s){return s.semanticPrimaryActions[s.semanticObjects.indexOf(s.mainSemanticObject)].intent?s.semanticPrimaryActions[s.semanticObjects.indexOf(s.mainSemanticObject)].intent:s.primaryIntentAction;},operators:function(c,p,u,s){if(!p){return undefined;}var o=c.getInterface(0).getModel(1).createBindingContext(c.getInterface(0).getPath(1));var P=F.propertyName(p,{context:o});var m=o.getModel(),d=o.getPath(),e=C.getLocationForPropertyPath(m,d),t=p.$Type;return a.getOperatorsForProperty(P,e,o,t,u,s);},getPropertyContextForQuickViewForm:function(d){var t=d.getObject("$Type");if(t==="com.sap.vocabularies.UI.v1.DataField"||t==="com.sap.vocabularies.UI.v1.DataFieldWithUrl"){var i=d.getInterface(),m=i.getModel(),p=i.getPath();p=p+(p.endsWith("/")?"Value":"/Value");return m.createBindingContext(p);}else{return d;}},getPropertyPathForQuickViewForm:function(p){if(p&&p.getObject("$Path")){var i=p.getInterface(),m=i.getModel(),P=i.getPath();P=P+(P.endsWith("/")?"$Path":"/$Path");return m.createBindingContext(P);}return p;},isDataFieldActionButtonVisible:function(t,d,i,o){return d["@com.sap.vocabularies.UI.v1.Hidden"]!==true&&(i!==true||o!==false);},getPressEventForDataFieldActionButton:function(t,d){var i="Isolated";if(d.InvocationGrouping&&d.InvocationGrouping.$EnumMember==="com.sap.vocabularies.UI.v1.OperationGroupingType/ChangeSet"){i="ChangeSet";}var c=t.navigateAfterAction;c=c==="false"?false:true;var p={contexts:"${$source>/}.getBindingContext()",invocationGrouping:C.addSingleQuotes(i),model:"${$source>/}.getModel()",label:C.addSingleQuotes(d.Label),isNavigable:c};return C.generateFunction(".editFlow.invokeAction",C.addSingleQuotes(d.Action),C.objectToString(p));},isNumericDataType:function(d){var c=d;if(c!==undefined){var n=["Edm.Int16","Edm.Int32","Edm.Int64","Edm.Byte","Edm.SByte","Edm.Single","Edm.Decimal","Edm.Double"];return n.indexOf(c)===-1?false:true;}else{return false;}},isDateOrTimeDataType:function(p){if(p!==undefined){var d=["Edm.DateTimeOffset","Edm.DateTime","Edm.Date","Edm.TimeOfDay","Edm.Time"];return d.indexOf(p)>-1;}else{return false;}},isDateTimeDataType:function(p){if(p!==undefined){var d=["Edm.DateTimeOffset","Edm.DateTime"];return d.indexOf(p)>-1;}else{return false;}},isDateDataType:function(p){return p==="Edm.Date";},isTimeDataType:function(p){if(p!==undefined){var d=["Edm.TimeOfDay","Edm.Time"];return d.indexOf(p)>-1;}else{return false;}},getUnderlyingPropertyDataType:function(o,m,e,t){var T="@com.sap.vocabularies.Common.v1.Text",s="@com.sap.vocabularies.Common.v1.Text@com.sap.vocabularies.UI.v1.TextArrangement";if(!!o&&!!o[s]&&o[s].$EnumMember==="com.sap.vocabularies.UI.v1.TextArrangementType/TextOnly"&&!!o[T]&&!!o[T].$Path){return m.getObject(e+"/"+o[T].$Path+"/$Type");}return t;},getColumnAlignment:function(d,t){var e=t.collection.sPath,m=t.collection.oModel;if((d["$Type"]==="com.sap.vocabularies.UI.v1.DataFieldForAction"||d["$Type"]==="com.sap.vocabularies.UI.v1.DataFieldForIntentBasedNavigation")&&d.Inline&&d.IconUrl){return"Center";}var s=m.getObject(e+"/@com.sap.vocabularies.Common.v1.SemanticKey");if(d["$Type"]==="com.sap.vocabularies.UI.v1.DataField"){var p=d.Value.$Path;var i=s&&!s.every(function(k){return k.$PropertyPath!==p;});if(i){return"Begin";}}return F.getDataFieldAlignment(d,m,e);},getPropertyAlignment:function(t,f,c){var d="Begin";var T=f?f.textAlignMode:"";switch(T){case"Form":if(this.isNumericDataType(t)){d="Begin";if(c){d=U.getAlignmentExpression(c,"Begin","End");}}break;default:if(this.isNumericDataType(t)||this.isDateOrTimeDataType(t)){d="End";}break;}return d;},getDataFieldAlignment:function(d,m,e,f,c){var D,s="Begin",t,o;if(d["$Type"]==="com.sap.vocabularies.UI.v1.DataFieldForAnnotation"){D=d.Target.$AnnotationPath;if(d.Target["$AnnotationPath"]&&d.Target["$AnnotationPath"].indexOf("com.sap.vocabularies.UI.v1.FieldGroup")>=0){var g=m.getObject(e+"/"+D);for(var i=0;i<g.Data.length;i++){t=m.getObject(e+"/"+D+"/Data/"+i.toString()+"/Value/$Path/$Type");o=m.getObject(e+"/"+D+"/Data/"+i.toString()+"/Value/$Path@");t=this.getUnderlyingPropertyDataType(o,m,e,t);s=this.getPropertyAlignment(t,f,c);if(s==="Begin"){break;}}return s;}else if(d.Target["$AnnotationPath"]&&d.Target["$AnnotationPath"].indexOf("com.sap.vocabularies.UI.v1.DataPoint")>=0&&m.getObject(e+"/"+D+"/Visualization/$EnumMember")==="com.sap.vocabularies.UI.v1.VisualizationType/Rating"){return s;}else{t=m.getObject(e+"/"+D+"/$Type");if(t==="com.sap.vocabularies.UI.v1.DataPointType"){t=m.getObject(e+"/"+D+"/Value/$Path/$Type");o=m.getObject(e+"/"+D+"/Value/$Path@");t=this.getUnderlyingPropertyDataType(o,m,e,t);}s=this.getPropertyAlignment(t,f,c);}}else{D=d.Value.$Path;t=m.getObject(e+"/"+D+"/$Type");o=m.getObject(e+"/"+D+"@");t=this.getUnderlyingPropertyDataType(o,m,e,t);if(!(m.getObject(e+"/")["$Key"].indexOf(D)===0)){s=this.getPropertyAlignment(t,f,c);}}return s;},getTypeAlignment:function(c,d,f,e,o,p){var i=c.getInterface(0);var m=i.getModel();if(e==="/undefined"&&p&&p.$target){e="/"+p.$target.fullyQualifiedName.split("/")[0];}return F.getDataFieldAlignment(d,m,e,f,o);},getImportance:function(d,s,f){if(!d["@com.sap.vocabularies.UI.v1.Importance"]){if(s&&s.length>0){var m=s.map(function(k){return k.$PropertyPath;});switch(d.$Type){case"com.sap.vocabularies.UI.v1.DataFieldForAnnotation":if(d.Target&&d.Target.$AnnotationPath&&d.Target.$AnnotationPath.indexOf("@com.sap.vocabularies.UI.v1.FieldGroup")>-1){return f.some(function(o){return(o.Value&&o.Value.$Path&&o.$Type!=="com.sap.vocabularies.UI.v1.DataFieldForAnnotation"&&m.includes(o.Value.$Path));})?"High":"None";}break;default:if(d.Value&&d.Value.$Path){return m.includes(d.Value.$Path)?"High":"None";}}}return"None";}else{switch(d["@com.sap.vocabularies.UI.v1.Importance"].$EnumMember){case"com.sap.vocabularies.UI.v1.ImportanceType/High":return"High";case"com.sap.vocabularies.UI.v1.ImportanceType/Medium":return"Medium";case"com.sap.vocabularies.UI.v1.ImportanceType/Low":return"Low";default:return"None";}}},isDataFieldActionButtonEnabled:function(d,i,o,s){if(i!==true){return"true";}return(o===null?"{= !${#"+d.Action+"} ? false : true }":o)?s:"true";},getLabelTextForDataField:function(e,p,P,s,u,c){var r;var d=e["@com.sap.vocabularies.Common.v1.DraftRoot"];r=F.getSemanticKeyTitle(p["@com.sap.vocabularies.Common.v1.Text"]&&P,s,u,p["@com.sap.vocabularies.Common.v1.Text@com.sap.vocabularies.UI.v1.TextArrangement"],c,d);return r;},getMultipleLinesForDataField:function(t,p,P){if(t.wrap==="false"){return false;}if(p!=="Edm.String"){return P;}if(t.editMode==="Display"){return true;}if(t.editMode.indexOf("{")>-1){return"{= ${ui>/editMode} === 'Display' ? true : "+P+"}";}return P;},hasValueHelpAnnotation:function(p){if(p){return(p["@com.sap.vocabularies.Common.v1.ValueListReferences"]||p["@com.sap.vocabularies.Common.v1.ValueListMapping"]||p["@com.sap.vocabularies.Common.v1.ValueList"]);}},getAPDialogDisplayFormat:function(p,i){var o,m=i.context.getModel(),c=i.context.getPath(),P=p.$Name||i.context.getProperty(c+"@sapui.name"),d=m.getObject(c+"@"),v=d["@com.sap.vocabularies.Common.v1.ValueList"]||d["@com.sap.vocabularies.Common.v1.ValueListMapping"]||d["@com.sap.vocabularies.Common.v1.ValueListReferences"],g=function(e){var f=e.Parameters.find(function(h){return h.LocalDataProperty&&h.LocalDataProperty.$PropertyPath===P;});return f&&f.ValueListProperty;},s;if(d["@com.sap.vocabularies.Common.v1.TextArrangement"]||d["@com.sap.vocabularies.Common.v1.Text@com.sap.vocabularies.UI.v1.TextArrangement"]){return a.computeDisplayMode(d,undefined);}else if(v){if(v.CollectionPath){s=g(v);if(!s){return"Value";}o=m.getObject("/"+v.CollectionPath+"/"+s+"@");return o&&o["@com.sap.vocabularies.Common.v1.Text"]?a.computeDisplayMode(o,undefined):"Value";}else{return m.requestValueListInfo(c,true).then(function(e){s=g(e[""]);if(!s){return"Value";}o=e[""].$model.getMetaModel().getObject("/"+e[""]["CollectionPath"]+"/"+s+"@");return o&&o["@com.sap.vocabularies.Common.v1.Text"]?a.computeDisplayMode(o,undefined):"Value";});}}else{return"Value";}},getActionParameterDialogFieldHelp:function(o,s,p){return this.hasValueHelpAnnotation(o)?S.generate([s,p]):undefined;},getFieldValueHelpDelegate:function(i,e,s,p){return C.objectToString({name:C.addSingleQuotes("sap/fe/macros/FieldValueHelpDelegate"),payload:{propertyPath:C.addSingleQuotes(V.getPropertyPath({UnboundAction:!i,EntityTypePath:e,Action:s,Property:p}))}});},_getEntitySetFromMultiLevel:function(c,p,s,d,D){var n=p.split("/").filter(Boolean);n=n.filter(function(P){return P!=="$NavigationPropertyBinding";});if(n.length>0){for(var i=d;i<n.length-D;i++){s="/"+c.getObject(s+"/$NavigationPropertyBinding/"+n[i]);}}return s;},getPropertyCollection:function(p,c){var o=(c&&c.context)||p;var P=o.getPath(),m=P.split("/").filter(Boolean),s=m[0],d=o.getObject("$Path"),f="/"+s;if(P.indexOf("/@com.sap.vocabularies.")>-1){var i=P.indexOf("/@com.sap.vocabularies.");var e=P.substring(0,i);f=F._getEntitySetFromMultiLevel(o,e,f,1,0);}if(d&&d.indexOf("/")>-1){f=F._getEntitySetFromMultiLevel(o,d,f,0,1);}return f;},getUnitOrCurrency:function(p){var P=p.getObject();var s=p.sPath;if(P["@Org.OData.Measures.V1.ISOCurrency"]){s=s+"Org.OData.Measures.V1.ISOCurrency";}else{s=s+"Org.OData.Measures.V1.Unit";}return s;},hasStaticUnitOrCurrency:function(p){return p["@Org.OData.Measures.V1.ISOCurrency"]?!p["@Org.OData.Measures.V1.ISOCurrency"].$Path:!p["@Org.OData.Measures.V1.Unit"].$Path;},getStaticUnitOrCurrency:function(p,f){if(f&&f.measureDisplayMode!=="Hidden"){return(p["@Org.OData.Measures.V1.ISOCurrency"]||p["@Org.OData.Measures.V1.Unit"]);}},getEmptyIndicatorTrigger:function(c,s,f){if(f){return c?f:"inactive";}return c?s:"inactive";},getBindingInfoForTextArrangement:function(t,d,D){if(d&&d.$EnumMember&&d.$EnumMember==="com.sap.vocabularies.UI.v1.TextArrangementType/TextOnly"&&D){return"{"+D.Value.$Path+"}";}},semanticKeyFormat:function(r,i){i.arguments=[{},{groupingEnabled:false}];var s=A.format(r,i);return s;},getIsMediaContentTypeNullExpr:function(p,o){o=o||"===";return"{= %{"+p+"@odata.mediaContentType} "+o+" null }";},getPathForIconSource:function(p){var i="{= FIELDRUNTIME.getIconForMimeType(%{"+p+"@odata.mediaContentType})}";return i;},getFilenameExpr:function(f,n){if(f){if(f.indexOf("{")===0){return"{= $"+f+" ? $"+f+" : '"+n+"'}";}return f;}return n;}};F.buildExpressionForTextValue.requiresIContext=true;F.getRequiredForDataField.requiresIContext=true;F.getBindingForDraftAdminBlockInline.requiresIContext=true;F.getFieldGroupIds.requiresIContext=true;F.fieldControl.requiresIContext=true;F.getTypeAlignment.requiresIContext=true;F.getPropertyCollection.requiresIContext=true;F.getAPDialogDisplayFormat.requiresIContext=true;F.operators.requiresIContext=true;F.semanticKeyFormat.requiresIContext=true;return F;},true);
