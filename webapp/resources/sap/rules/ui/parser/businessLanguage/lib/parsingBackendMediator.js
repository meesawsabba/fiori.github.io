jQuery.sap.declare("sap.rules.ui.parser.businessLanguage.lib.parsingBackendMediator");jQuery.sap.require("sap.rules.ui.parser.businessLanguage.lib.constants");jQuery.sap.require("sap.rules.ui.parser.resources.dependencies.lib.constantsBase");jQuery.sap.require("sap.rules.ui.parser.businessLanguage.lib.parseModel");jQuery.sap.require("sap.rules.ui.parser.businessLanguage.lib.parseUtils");jQuery.sap.require("sap.rules.ui.parser.resources.vocabulary.lib.parameterRuntimeServices");jQuery.sap.require("sap.rules.ui.parser.businessLanguage.lib.IDPLexer");jQuery.sap.require("sap.rules.ui.parser.businessLanguage.lib.IDPParser");jQuery.sap.require("sap.rules.ui.parser.businessLanguage.lib.autoCompleteUtils");jQuery.sap.require("sap.rules.ui.parser.businessLanguage.lib.parserTokens");jQuery.sap.require("sap.rules.ui.parser.businessLanguage.lib.antlr3_all_min");jQuery.sap.require("sap.rules.ui.parser.resources.vocabulary.lib.vocabularyDataProviderFactory");jQuery.sap.require("sap.rules.ui.parser.businessLanguage.lib.conversionUtils");jQuery.sap.require("sap.rules.ui.parser.businessLanguage.lib.valueHelpValidator");sap.rules.ui.parser.businessLanguage.lib.parsingBackendMediator=sap.rules.ui.parser.businessLanguage.lib.parsingBackendMediator||{};sap.rules.ui.parser.businessLanguage.lib.parsingBackendMediator.lib=(function(){var p=sap.rules.ui.parser.businessLanguage.lib.parseUtils.lib;var a=new p.parseUtilsLib();var c=sap.rules.ui.parser.businessLanguage.lib.constants.lib;var d=sap.rules.ui.parser.resources.dependencies.lib.constantsBase.lib;var b=sap.rules.ui.parser.businessLanguage.lib.parseModel.lib;var e=new b.parseModelLib();var f=sap.rules.ui.parser.resources.vocabulary.lib.parameterRuntimeServices;var g=sap.rules.ui.parser.businessLanguage.lib.autoCompleteUtils.lib;var h=new g.autoCompleteUtilsLib();var v=sap.rules.ui.parser.resources.vocabulary.lib.vocabularyDataProviderFactory.lib;var r=new v.vocaDataProviderFactoryLib();var I=sap.rules.ui.parser.businessLanguage.lib.IDPLexer.lib;var i=sap.rules.ui.parser.businessLanguage.lib.IDPParser.lib;var j=sap.rules.ui.parser.businessLanguage.lib.conversionUtils.lib;var k=new j.conversionUtilsLib();var o=sap.rules.ui.parser.businessLanguage.lib.antlr3_all_min.lib;var l=sap.rules.ui.parser.businessLanguage.lib.parserTokens.lib;var m=sap.rules.ui.parser.businessLanguage.lib.valueHelpValidator.lib;function q(){}q.prototype.getRELType=function u(n,s){var t;t=(n===undefined||n===null)?c.TYPE_ALL:n;if(s!==null&&s!==undefined&&s[c.propertiesEnum.isCollection]===true){t=a.getCollectionRelTypeFromBusinessDT(t);}return t;};q.prototype.parseExpression=function(s,t,u,w,x,y,z,C){function D(F,z){var A="";var B=z&&z.hasOwnProperty(c.propertiesEnum.locale);var Q=z&&z.hasOwnProperty(c.propertiesEnum.locale)&&z[c.propertiesEnum.locale].hasOwnProperty(c.propertiesEnum.convert)&&z[c.propertiesEnum.locale][c.propertiesEnum.convert].hasOwnProperty(c.propertiesEnum.source)&&z[c.propertiesEnum.locale][c.propertiesEnum.convert].hasOwnProperty(c.propertiesEnum.target)&&(z[c.propertiesEnum.locale][c.propertiesEnum.convert][c.propertiesEnum.source]===c.CODE_TEXT)&&(z[c.propertiesEnum.locale][c.propertiesEnum.convert][c.propertiesEnum.target]===c.DISPLAY_TEXT);if(!B||Q){var R=false;var S=false;var T="";var U='';if(typeof F!=='string'){A=F;}else{for(U in F){if(F.hasOwnProperty(U)){if(!F[U]){continue;}S=false;switch(F[U]){case"'":R=!R;break;case",":if(R===false){S=true;}break;}if(S===true){T+=';';}else{T+=F[U];}}}A=T;}}else{A=F;}return A;}try{jQuery.sap.log.debug("ParsingBackendMediator expression to parse: "+s);var E=e.createModelManger();E.vocaRTServ=u;E.vocabulary=y;E.mode=t;E.paramServ=w;E.flags=(z===undefined||z===null)?{}:z;x=this.getRELType(x,z);s=D(s,z);var F=s;if(s!==null&&(s!==undefined)){s=s.toString();s=s.replace(/(\r\n|\n|\r)/gm," ");s=s.replace(/\\/g,"\\\\");}if(s===null||s===undefined||a.isBlank(s)){var G={};G.status=c.statusEnum.SUCCESS;if(t===c.TOKEN_TYPES||(E.flags.hasOwnProperty(c.propertiesEnum.tokens)&&E.flags[c.propertiesEnum.tokens]===true)){G.tokens=[];if(s!==null&&s!==undefined){var n=F.length;var H=new a.TokenInfo(F,c.tokenTypesEnum.whitespace,null,0,n);G.tokens.push(H);}}if(t===c.VALIDATE_MODE||t===c.PARSE_MODE){G.errorDetails=null;G.model=null;G.cursorPosition=null;G.actualReturnType=c.TYPE_ALL;if((E.flags.hasOwnProperty(c.propertiesEnum.conversionOutput)&&((E.flags[c.propertiesEnum.conversionOutput]===c.conversionOutputEnum.toKeys)||(E.flags[c.propertiesEnum.conversionOutput]===c.conversionOutputEnum.toDescriptions)))||(z&&z.hasOwnProperty(c.propertiesEnum.locale)&&z[c.propertiesEnum.locale].hasOwnProperty(c.propertiesEnum.convert))){G.convertedExpression=F;}return G;}else if(t===c.TOKEN_TYPES){return G;}}E.expression=s;var J=new o.antlr.runtime.ANTLRStringStream(s);var K=new I(J);K.displayRecognitionError=function(A,B){var Q=K.getErrorHeader(B);var R=K.getErrorMessage(B,A);a.handleWarning(Q+" "+R);};var L=new o.antlr.runtime.CommonTokenStream(K);var M=new i(L);M.mode=t;M.displayRecognitionError=function(A,B){var Q=M.getErrorHeader(B);var R=M.getErrorMessage(B,A);a.handleWarning(Q+" "+R);};var N={};var O={};switch(t){case c.AUTOCOMPLETE_MODE:case c.AUTOCOMPLETE_MODE_LOWERCASE:jQuery.sap.log.debug("mode autocomplete");N.suggs=JSON.parse(h.getNextSuggestions(s,K,M,u,x,C));if(E.flags.hasOwnProperty(c.propertiesEnum.tokens)&&E.flags[c.propertiesEnum.tokens]===true){N.tokens=a.buildTokenTypes(M,F,E);}jQuery.sap.log.debug("ParsingBackendMediator: autocomplete responseObject: "+N);return N;case c.PARSE_MODE:case c.VALIDATE_MODE:jQuery.sap.log.debug("mode validate");a.parseWithValidation(K,M,x,e.getModelManger());N=e.getModelManger().parseResult.getParseResults();if(E.flags.hasOwnProperty(c.propertiesEnum.tokens)&&E.flags[c.propertiesEnum.tokens]===true){N.tokens=a.buildTokenTypes(M,F,E);}if(E.flags.hasOwnProperty(c.propertiesEnum.valueHelp)&&(N.status===c.statusEnum.SUCCESS)){m.handleExternalValueHelp(M,F,E,N);}if(k.needsConversion(E)){O=N.tokens||a.buildTokenTypes(M,F,E);N.convertedExpression=k.convert(u,y,E,O,F);}if(E.flags.hasOwnProperty(c.propertiesEnum.rootObjectContext)&&E.flags[c.propertiesEnum.rootObjectContext]===true){N.rootObjectContext=null;if(N.status===c.statusEnum.SUCCESS){N.rootObjectContext={};N.rootObjectContext.name=E[c.propertiesEnum.rootObjectContext].name;N.rootObjectContext.associations=E[c.propertiesEnum.rootObjectContext].assocs;}}return N;case c.TOKEN_TYPES:jQuery.sap.log.debug("mode token types");a.parseWithValidation(K,M,x,e.getModelManger());N.tokens=a.buildTokenTypes(M,F,E);N.status=c.statusEnum.SUCCESS;return N;default:a.handleError("Unknown mode",null,e.getModelManger());N=e.getModelManger().parseResult.getParseResults();return N;}}catch(P){e.getModelManger().parseResult.status=c.statusEnum.ERROR;jQuery.sap.log.error("ParsingBackendMediator error: "+P);return e.getModelManger().parseResult.getParseResults();}};q.prototype.convertExpressionToKeys=function(n,s,t,u,w,x){var y={};if(x){y=x;}y[c.propertiesEnum.conversionOutput]=c.conversionOutputEnum.toKeys;return this.parseExpression(n,c.VALIDATE_MODE,s,t,u,w,y);};q.prototype.convertExpressionToDescriptions=function(n,s,t,u,w,x){var y={};if(x){y=x;}y[c.propertiesEnum.conversionOutput]=c.conversionOutputEnum.toDescriptions;return this.parseExpression(n,c.VALIDATE_MODE,s,t,u,w,y);};q.prototype.parseInputRT=function(n,s,t,u,w,x,y){var z=null;if(u){z=new f.ParameterRuntimeServices(u,t,x);}return this.parseExpression(n,s,t,z,w,x,y);};q.prototype.parseInput=function(n,s,t,u,w,x,y){var z=null;z=r.getVocabularyDataProvider();return this.parseInputRT(n,s,z,u,w,x,y);};q.prototype.isReservedWord=function(s){var n=e.getModelManger();n.clearModelData();n.parseResult.clear();s=s.split(' ')[0];var t=new o.antlr.runtime.ANTLRStringStream(s);var u=new I(t);var w=new o.antlr.runtime.CommonTokenStream(u);var x=new i(w);var y=true;x.reportError=function(A){if((x.input.tokens.length>0)&&(x.input.tokens[0].type===l.NAVIGATION||x.input.tokens[0].type===l.TYPEATTRIBUTE||x.input.tokens[0].type===l.INT||x.input.tokens[0].type===l.STRING||x.input.tokens[0].type===l.ANYCHAR||x.input.tokens[0].type===undefined||x.input.tokens[0].type===null)){y=false;}};u.reportError=function(A){if((x.input.tokens.length>0)&&(x.input.tokens[0].type===l.NAVIGATION||x.input.tokens[0].type===l.TYPEATTRIBUTE||x.input.tokens[0].type===l.INT||x.input.tokens[0].type===l.STRING||x.input.tokens[0].type===undefined||x.input.tokens[0].type===null)){y=false;}};x.dummyRule();return y;};q.prototype.validateAndGetExpressionActualReturnTypeRT=function(n,s,t,u,w,x){var y={type:null,dataObject:null,businessDataType:null,unknownTokens:{},isCollection:false,errorDetails:null,isValid:false,dependenciesOutput:{}};if(u===undefined){u=null;}var z;if(x){z=x;}else{z={};z[c.propertiesEnum.unknownTokens]=true;z[d.PROPERTY_NAME_DEPENDENCIES_OUTPUT]=true;}if(w!==undefined&&w===false){z[c.propertiesEnum.raiseError]=false;}var A=this.parseExpression(s,c.VALIDATE_MODE,n,u,c.TYPE_ALL,t,z);if(A.actualReturnType){jQuery.sap.log.debug(A.actualReturnType);}if(A.status===c.statusEnum.ERROR){y.errorDetails=A.errorDetails;y.unknownTokens=A[c.propertiesEnum.unknownTokens];return y;}y.type=A.actualReturnType;y.dataObject=(A.hasOwnProperty(c.attributesNamesEnum.dataObject)?A.dataObject:null);y.isValid=true;var B=a.getBusinessDTFromRelType(y.type);y.isCollection=B[c.propertiesEnum.isCollection];y.businessDataType=B[c.propertiesEnum.businessType];y.dependenciesOutput=(A.hasOwnProperty(d.PROPERTY_NAME_DEPENDENCIES_OUTPUT)?A.dependenciesOutput:{});if(A.hasOwnProperty(c.propertiesEnum.convertedExpression)){y.convertedExpression=A.convertedExpression;}return y;};q.prototype.validateAndGetExpressionActualReturnType=function(n,s,t,u,w,x){var y=null;var z=null;y=r.getVocabularyDataProvider();if(n){if(u){z=new f.ParameterRuntimeServices(u,y,t);}}return this.validateAndGetExpressionActualReturnTypeRT(y,s,t,z,w,x);};q.prototype.validateExpression=function(n,s,t,u,w,x){var y=this.parseInput(s,u,n,x,w,t);var z={status:y.status,errorDetails:y.errorDetails};return z;};q.prototype.validateAndGetExpressionModel=function(n,s,t,u,w,x){var y=this.parseInput(s,u,n,x,w,t);return y.model;};q.prototype.getRELDependencies=function(n,s,t,u){var w={};w[d.PROPERTY_NAME_DEPENDENCIES_OUTPUT]=true;var x=this.parseInput(s,c.VALIDATE_MODE,n,u,c.TYPE_ALL,t,w);return x[d.PROPERTY_NAME_DEPENDENCIES_OUTPUT];};q.prototype.handleParse=function(n){if(!n.hasOwnProperty("expression")){return e.getModelManger().parseResult.getParseResults();}if(!n.hasOwnProperty("vocabulary")){n.vocabulary=null;}if(!n.hasOwnProperty("mode")){n.mode=c.VALIDATE_MODE;}if(!n.hasOwnProperty("returnType")){n.returnType=c.TYPE_ALL;}if(!n.hasOwnProperty("parameters")){n.parameters=null;}if(!n.hasOwnProperty(c.propertiesEnum.flags)){n.flags={};}return this.parseInput(n.expression,n.mode,n.connection,n.parameters,n.returnType,n.vocabulary,n.flags);};return{parsingBackendMediatorLib:q};}());
