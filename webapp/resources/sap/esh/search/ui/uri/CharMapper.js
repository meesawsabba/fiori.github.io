/*!
 * SAPUI5

		(c) Copyright 2009-2021 SAP SE. All rights reserved
	
 */
sap.ui.define([],function(){var C=(function(){function C(c){this.charsToReplace=c;if(c.length===0){throw new Error("No characters to replace given");}if(c.length>10){throw new Error("Max number of chars to replace is 10");}this.charsToReplaceRegExp=[];for(var _=0,a=c;_<a.length;_++){var b=a[_];this.charsToReplaceRegExp.push(new RegExp(b,"g"));}this.replaceWithChars=["\uF0000","\uF0001","\uF0002","\uF0003","\uF0004","\uF0005","\uF0006","\uF0007","\uF0008","\uF0009",];this.replaceWithCharsRegExp=[];for(var d=0,e=this.replaceWithChars;d<e.length;d++){var r=e[d];this.replaceWithCharsRegExp.push(new RegExp(r,"g"));}}C.prototype.map=function(s){for(var i=0;i<this.charsToReplaceRegExp.length;i++){s=s.replace(this.charsToReplaceRegExp[i],this.replaceWithChars[i]);}return s;};C.prototype.unmap=function(s){for(var i=0;i<this.charsToReplaceRegExp.length;i++){s=s.replace(this.replaceWithCharsRegExp[i],this.charsToReplace[i]);}return s;};return C;}());return C;});
