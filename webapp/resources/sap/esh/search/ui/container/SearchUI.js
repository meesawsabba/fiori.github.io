window.onload=
function(){sap.ui.loader.config({baseUrl:"../../../../../../resources/",paths:{"sap/esh/search/ui":"/resources/sap/esh/search/ui",},});sap.ui.require(["sap/esh/search/ui/SearchCompositeControl"],function(S){var c=sap.esh.search.ui.config||{};var d={searchOnStart:true,searchTerm:c.FF_bSearchtermNoAsterisk?"":"*",sinaConfiguration:{provider:"sample",},};var o=Object.assign(c,d);var a=new S(o);window.addEventListener("hashchange",function(){a.getModel().parseURL();},false);a.placeAt("content");});jQuery("html").css("overflow-y","auto");jQuery("html").css("height","100%");}
;
