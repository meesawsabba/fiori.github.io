/*!
 * SAPUI5
  (c) Copyright 2009-2021 SAP SE. All rights reserved
 */
sap.ui.define(["sap/zen/dsh/firefly/ff1040.kernel.native"],function(f){"use strict";f.SerenityShell=function(){};f.SerenityShell.prototype=new f.DfProgram();f.SerenityShell.prototype._ff_c="SerenityShell";f.SerenityShell.DEFAULT_PROGRAM_NAME="shell";f.SerenityShell.createKernelShell=function(p){var n=new f.SerenityShell();n.setup();n.setProcess(p);return n;};f.SerenityShell.createShellByProcess=function(p){var s=null;if(f.notNull(p)){s=p;}else{var k=f.Kernel.getInstance();s=k.getKernelProcess();}if(f.notNull(s)){var n=f.ProgramArgs.create();var a=f.ProgramStartCfg.create(s,"shell",null,n);a.setIsNewConsoleNeeded(true);a.setIsCreatingChildProcess(false);a.processExecution(f.SyncType.NON_BLOCKING,null,null);}};f.SerenityShell.prototype.m_useStartMarker=false;f.SerenityShell.prototype.m_shellCommands=null;f.SerenityShell.prototype.m_currentSubSession=null;f.SerenityShell.prototype.newProgram=function(){var n=new f.SerenityShell();n.setup();return n;};f.SerenityShell.prototype.setup=function(){f.DfProgram.prototype.setup.call(this);this.m_shellCommands=f.XHashSetOfString.create();this.m_shellCommands.add("set");this.m_shellCommands.add("cd");this.m_shellCommands.add("rm");this.m_shellCommands.add("pwd");};f.SerenityShell.prototype.doSetupProgramMetadata=function(m){f.DfProgram.prototype.doSetupProgramMetadata.call(this,m);m.addParameterList("start","Program with following arguments to start");};f.SerenityShell.prototype.initializeProgram=function(){f.DfProgram.prototype.initializeProgram.call(this);this.registerOnProgramContainerOpen(this);this.registerOnProgramContainerClose(this);};f.SerenityShell.prototype.runProcess=function(){if(this.getSession().hasCapability("terminal")===false){this.m_useStartMarker=true;}var p=this.getArgumentStructure().getListByKey("start");if(f.notNull(p)&&p.size()>0){var s=f.XListOfString.create();for(var k=0;k<p.size();k++){s.add(p.getStringAt(k));}var a=f.ProgramStartCfg.createByCmdLineExt(this.getProcess(),s,0);a.registerOnEvent(this);a.processExecution(f.SyncType.BLOCKING,this,a);}else{if(this.getStdin().supportsSyncType(f.SyncType.NON_BLOCKING)){this.readInputLine();return true;}else{while(true){this.readInputLine();}}}return false;};f.SerenityShell.prototype.readInputLine=function(){if(this.m_useStartMarker===true){this.print(">> ");}var s=this.getStdin();s.readLine(this);};f.SerenityShell.prototype.onLineRead=function(t){var m=false;if(f.XStringUtils.isNullOrEmpty(f.XString.trim(t))){m=true;}else{var s=this.getSession().getStdout();var a=f.ProgramStartCfg.createByCmdLine(this.getProcess(),t);if(f.isNull(a)){s.println(f.XStringUtils.concatenate2("Cannot find prg: ",t));m=true;}else{var p=a.getName();a.setIsUsingParentEnvironment(this.m_shellCommands.contains(p));a.registerOnEvent(this);a.processExecution(f.SyncType.BLOCKING,this,a);}}if(m&&this.getStdin().supportsSyncType(f.SyncType.NON_BLOCKING)){this.readInputLine();}};f.SerenityShell.prototype.onProgramStarted=function(e,p,c){if(e.hasErrors()){var s=this.getSession().getStdout();s.println(e.getSummary());}};f.SerenityShell.prototype.onProgramTerminated=function(e,a,c,b){};f.SerenityShell.prototype.onProcessEvent=function(e,p,a){if(a===f.ProcessEventType.TERMINATED){var s=this.getStdin().supportsSyncType(f.SyncType.NON_BLOCKING);if(s){this.readInputLine();}}};f.SerenityShell.prototype.signalExit=function(e){var s=this.getStdin().supportsSyncType(f.SyncType.NON_BLOCKING);if(s){this.readInputLine();}};f.SerenityShell.prototype.getCurrentSubSession=function(){return this.m_currentSubSession;};f.SerenityShell.prototype.getProcess=function(){return this.getSession();};f.SerenityShell.prototype.onProgramContainerOpen=function(p){this.printWelcomeMessage();};f.SerenityShell.prototype.onProgramContainerClose=function(p){};f.SerenityShell.prototype.printWelcomeMessage=function(){this.println("                      ______ _           __ _             ");this.println("                     |  ____(_)         / _| |            ");this.println("                     | |__   _ _ __ ___| |_| |_   _       ");this.println("                     |  __| | | '__/ _ \\  _| | | | |     ");this.println("                     | |    | | | |  __/ | | | |_| |      ");this.println("                     |_|    |_|_|  \\___|_| |_|\\__, |    ");this.println("                                               __/ |      ");this.println("                                              |___/       ");this.println("                                 \\     /                 ");this.println("                             \\    o ^ o    /             ");this.println("                               \\ (     ) /               ");this.println("                    ____________(       )____________     ");this.println("                   (     /   /  )       (  \\   \\     )  ");this.println("                   (___/___/__/           \\__\\___\\___) ");this.println("                      (     /  /(       )\\  \\     )     ");this.println("                       (__/___/ (       ) \\___\\__)      ");this.println("                               /(%%%%%%%)\\               ");this.println("                             /   (%%%%%)   \\             ");this.println("                                  (%%%)                   ");this.println("                                    !                     ");this.println("                                                          ");this.println("Welcome to the firefly shell!");this.println("Type 'help' to get started...");this.println("");};f.ShellCache=function(){};f.ShellCache.prototype=new f.DfProgram();f.ShellCache.prototype._ff_c="ShellCache";f.ShellCache.DEFAULT_PROGRAM_NAME="cache";f.ShellCache.prototype.m_command=null;f.ShellCache.prototype.doSetupProgramMetadata=function(m){f.DfProgram.prototype.doSetupProgramMetadata.call(this,m);m.addParameter("command"," The command. Can be 'status', 'enable' or 'disable'. ");};f.ShellCache.prototype.newProgram=function(){var n=new f.ShellCache();n.setup();return n;};f.ShellCache.prototype.evalArguments=function(){f.DfProgram.prototype.evalArguments.call(this);this.m_command=this.getArgumentStructure().getStringByKey("command");};f.ShellCache.prototype.runProcess=function(){var p=this.getProcess();var k=p.getKernel();var s=k.getSubSystemContainer(f.SubSystemType.CACHE);var a=s.getStatus();var o=f.XStringBufferExt.create();o.setIndentationString("    ");o.appendLine("*** Cache ***");if(f.XString.isEqual(this.m_command,"status")){o.append("Status: ").appendLine(a.getName());var m=s.getMessageCollection();if(m.getMessages().size()>0){o.appendLine("Messages:");o.appendLine(m.getSummary());}if(a===f.SubSystemStatus.ACTIVE){var c=s.getMainApi();o.append("Type: ").appendLine(c.getCacheType());if(c.supportsNameSpaceEnumeration()){o.appendLine("Defined Caches:");o.indent();var n=c.getNameSpaces();if(n.size()>0){this.renderSubCache(c,o);}else{o.appendLine("None");}o.outdent();}}}this.print(o.toString());this.exitNow(0);return false;};f.ShellCache.prototype.renderSubCache=function(p,o){var n=p.getNameSpaces();for(var i=0;i<n.size();i++){var a=n.get(i);o.append("  ").append(a).append(" ");var c=p.getSubCache(a);if(c.isEnabled()===true){o.append("Active");o.append(" - ");if(c.isReadEnabled()){o.append("R");}if(c.isWriteEnabled()){o.append("W");}}else{o.append("Inactive");}o.append(" - Max Count: ");o.appendInt(c.getMaxCount());o.append(" - Timeout: ");o.appendInt(c.getValidityTime());o.append(" - Hits/Missed/Write: ");o.appendInt(c.getHitCount());o.append("/");o.appendInt(c.getMissedHitCount());o.append("/");o.appendInt(c.getWriteCount());o.appendNewLine();o.indent();this.renderSubCache(c,o);o.outdent();}};f.ShellCd=function(){};f.ShellCd.prototype=new f.DfProgram();f.ShellCd.prototype._ff_c="ShellCd";f.ShellCd.DEFAULT_PROGRAM_NAME="cd";f.ShellCd.prototype.m_param=null;f.ShellCd.prototype.doSetupProgramMetadata=function(m){f.DfProgram.prototype.doSetupProgramMetadata.call(this,m);m.addParameter("directory"," Change the current directory to dir.");};f.ShellCd.prototype.newProgram=function(){var n=new f.ShellCd();n.setup();return n;};f.ShellCd.prototype.evalArguments=function(){f.DfProgram.prototype.evalArguments.call(this);this.m_param=this.getArgumentStructure().getStringByKey("directory");};f.ShellCd.prototype.runProcess=function(){var p=this.getProcess().getParentProcess();var c=p.getCurrentWorkingDirectory();var a=f.XFile.createByUri(this.getSession(),c);if(f.notNull(a)){var n=f.XUri.createChild(c,this.m_param);n.normalizePath(true);var b=f.XFile.createByUri(this.getSession(),n);if(b.isExisting()&&b.isDirectory()){p.setCurrentWorkingDirectory(n);}else{this.println(f.XStringUtils.concatenate3("'",this.m_param,"':  No such file or directory"));}}else{this.println(f.XStringUtils.concatenate3("'",this.m_param,"':  No valid path"));}this.exitNow(0);return false;};f.ShellDel=function(){};f.ShellDel.prototype=new f.DfProgram();f.ShellDel.prototype._ff_c="ShellDel";f.ShellDel.DEFAULT_PROGRAM_NAME="del";f.ShellDel.prototype.doSetupProgramMetadata=function(m){f.DfProgram.prototype.doSetupProgramMetadata.call(this,m);};f.ShellDel.prototype.newProgram=function(){var n=new f.ShellDel();n.setup();return n;};f.ShellDel.prototype.evalArguments=function(){f.DfProgram.prototype.evalArguments.call(this);};f.ShellDel.prototype.runProcess=function(){this.println("Del: ToDo!");this.exitNow(0);return false;};f.ShellDir=function(){};f.ShellDir.prototype=new f.DfProgram();f.ShellDir.prototype._ff_c="ShellDir";f.ShellDir.DEFAULT_PROGRAM_NAME="dir";f.ShellDir.PARAM_SHOW_DATE="showdate";f.ShellDir.prototype.m_showDate=false;f.ShellDir.prototype.newProgram=function(){var n=new f.ShellDir();n.setup();return n;};f.ShellDir.prototype.doSetupProgramMetadata=function(m){f.DfProgram.prototype.doSetupProgramMetadata.call(this,m);m.addOption(f.ShellDir.PARAM_SHOW_DATE,null,"Output of date and time. Default is true.",f.XValueType.BOOLEAN);};f.ShellDir.prototype.evalArguments=function(){f.DfProgram.prototype.evalArguments.call(this);this.m_showDate=this.getArgumentStructure().getBooleanByKeyExt(f.ShellDir.PARAM_SHOW_DATE,true);};f.ShellDir.prototype.runProcess=function(){var p=this.getProcess();var c=p.getCurrentWorkingDirectory();this.log(c.toString());var b=f.XStringBuffer.create();var a=f.XFile.create(p,".");var d=a.getUrl();b.append(" Directory of ");b.append(d);this.println(b.toString());this.println("");var e=a.getChildren();var s=f.XList.create();s.addAll(e);s.sortByComparator(this);for(var i=0;i<s.size();i++){var g=this.getFileInfo(s.get(i));this.println(g);}this.exitNow(0);return false;};f.ShellDir.prototype.getFileInfo=function(a){var r=f.XStringBuffer.create();if(this.m_showDate){var t=f.XDateTime.createWithMilliseconds(a.getLastModifiedTimestamp());r.append(t.getDate().toIsoFormat()).append(" ").append(t.getHourOfDay()<10?"0":"").appendInt(t.getHourOfDay()).append(":").append(t.getMinuteOfHour()<10?"0":"").appendInt(t.getMinuteOfHour());r.append(" ");}var b=a.isDirectory()?"<DIR> ":"      ";r.append(b);r.append(a.getName()).append(" ");return r.toString();};f.ShellDir.prototype.compare=function(o,a){if(o.isDirectory()&&a.isDirectory()===false){return-1;}else if(o.isDirectory()===false&&a.isDirectory()){return 1;}else{var n=o.getName();var b=a.getName();return f.XString.compare(n,b);}};f.ShellGrep=function(){};f.ShellGrep.prototype=new f.DfProgram();f.ShellGrep.prototype._ff_c="ShellGrep";f.ShellGrep.DEFAULT_PROGRAM_NAME="grep";f.ShellGrep.prototype.newProgram=function(){var n=new f.ShellGrep();n.setup();return n;};f.ShellGrep.prototype.runProcess=function(){this.println("Hello World!");this.exitNow(0);return false;};f.ShellHelp=function(){};f.ShellHelp.prototype=new f.DfProgram();f.ShellHelp.prototype._ff_c="ShellHelp";f.ShellHelp.DEFAULT_PROGRAM_NAME="help";f.ShellHelp.prototype.doSetupProgramMetadata=function(m){f.DfProgram.prototype.doSetupProgramMetadata.call(this,m);};f.ShellHelp.prototype.newProgram=function(){var n=new f.ShellHelp();n.setup();return n;};f.ShellHelp.prototype.evalArguments=function(){f.DfProgram.prototype.evalArguments.call(this);};f.ShellHelp.prototype.runProcess=function(){this.println("    _          _       ");this.println("   | |__   ___| |_ __  ");this.println("   | '_ \\ / _ \\ | '_ \\ ");this.println("   | | | |  __/ | |_) |");this.println("   |_| |_|\\___|_| .__/ ");this.println("                |_|  ");this.println("   ");this.println("There is not much yet here, but...");this.println("You can type 'listprgs' to see a list of available programs!");this.exitNow(0);return false;};f.ShellKill=function(){};f.ShellKill.prototype=new f.DfProgram();f.ShellKill.prototype._ff_c="ShellKill";f.ShellKill.DEFAULT_PROGRAM_NAME="kill";f.ShellKill.prototype.m_id=null;f.ShellKill.prototype.m_text=null;f.ShellKill.prototype.doSetupProgramMetadata=function(m){f.DfProgram.prototype.doSetupProgramMetadata.call(this,m);m.addMandatoryOption("id","The id of the process to be killed.","",f.XValueType.STRING);};f.ShellKill.prototype.newProgram=function(){var n=new f.ShellKill();n.setup();return n;};f.ShellKill.prototype.evalArguments=function(){f.DfProgram.prototype.evalArguments.call(this);var a=this.getArguments();this.m_id=a.getStringByKey("id");};f.ShellKill.prototype.runProcess=function(){if(f.XStringUtils.isNullOrEmpty(this.m_id)){this.println("No id given");this.exitNow(0);return false;}else{var k=this.getProcess().getKernel();var p=k.getChildProcessById(this.m_id);if(f.isNull(p)){this.println(f.XStringUtils.concatenate3("Cannot find a process with id '",this.m_id,"'"));this.exitNow(0);return false;}else{var s=p.getProgramCfg();if(f.notNull(s)){this.m_text=s.getName();}if(f.XStringUtils.isNullOrEmpty(this.m_text)){this.m_text=this.m_id;}k.processShutdownProcess(null,this,null,this.m_id,false);return true;}}};f.ShellKill.prototype.onProcessTerminated=function(e,a,c){if(e.isValid()){this.println(f.XStringUtils.concatenate2("Process was successfully terminated: ",this.m_text));}else{this.println(f.XStringUtils.concatenate2("Failed to terminated process: ",this.m_text));var s=e.getSummary();this.println(s);}this.exitNow(0);};f.ShellListPrgs=function(){};f.ShellListPrgs.prototype=new f.DfProgram();f.ShellListPrgs.prototype._ff_c="ShellListPrgs";f.ShellListPrgs.DEFAULT_PROGRAM_NAME="listprg";f.ShellListPrgs.prototype.m_showDetails=false;f.ShellListPrgs.prototype.newProgram=function(){var n=new f.ShellListPrgs();n.setup();return n;};f.ShellListPrgs.prototype.doSetupProgramMetadata=function(m){f.DfProgram.prototype.doSetupProgramMetadata.call(this,m);m.addOption("details","Show detailed program infos","true|false",f.XValueType.BOOLEAN);};f.ShellListPrgs.prototype.evalArguments=function(){f.DfProgram.prototype.evalArguments.call(this);this.m_showDetails=this.getArguments().getBooleanByKey("details");};f.ShellListPrgs.prototype.runProcess=function(){var a=f.ProgramRegistration.getAllEntries();var s=f.XListOfString.create();s.addAll(a.getKeysAsReadOnlyListOfString());s.sortByDirection(f.XSortDirection.ASCENDING);if(this.m_showDetails){this.printWithDetails(a,s);}else{this.printCompact(s);}this.exitNow(0);return false;};f.ShellListPrgs.prototype.printCompact=function(s){this.println("Programs:");this.println("-----------");for(var i=0;i<s.size();i++){this.println(f.XStringUtils.concatenate2("- ",s.get(i)));}};f.ShellListPrgs.prototype.printWithDetails=function(a,s){var t=this.generateFixedLengthStr("Program name:",38);t=f.XStringUtils.concatenate2(t,this.generateFixedLengthStr("Display name:",38));t=f.XStringUtils.concatenate2(t,this.generateFixedLengthStr("Author:",38));this.println(t);this.println("---------------------------------------------------------------------------------------------");for(var i=0;i<s.size();i++){var b=a.getByKey(s.get(i));var d=f.XStringUtils.concatenate2("- ",this.generateFixedLengthStr(s.get(i),37));d=f.XStringUtils.concatenate2(d,this.generateFixedLengthStr(f.XStringUtils.concatenate2(" | ",b.getDisplayName()),35));d=f.XStringUtils.concatenate2(d,this.generateFixedLengthStr(f.XStringUtils.concatenate2(" | ",b.getAuthor()),35));this.println(d);this.println("---------------------------------------------------------------------------------------------");}};f.ShellListPrgs.prototype.generateFixedLengthStr=function(i,l){var t="";if(f.XStringUtils.isNotNullAndNotEmpty(i)){t=i;}var s=f.XString.size(t);return f.XStringUtils.rightPad(t," ",l-s);};f.ShellMkdir=function(){};f.ShellMkdir.prototype=new f.DfProgram();f.ShellMkdir.prototype._ff_c="ShellMkdir";f.ShellMkdir.DEFAULT_PROGRAM_NAME="mkdir";f.ShellMkdir.prototype.doSetupProgramMetadata=function(m){f.DfProgram.prototype.doSetupProgramMetadata.call(this,m);};f.ShellMkdir.prototype.newProgram=function(){var n=new f.ShellMkdir();n.setup();return n;};f.ShellMkdir.prototype.evalArguments=function(){f.DfProgram.prototype.evalArguments.call(this);};f.ShellMkdir.prototype.runProcess=function(){this.println("Mdir: Todo!");this.exitNow(0);return false;};f.ShellProcesses=function(){};f.ShellProcesses.prototype=new f.DfProgram();f.ShellProcesses.prototype._ff_c="ShellProcesses";f.ShellProcesses.DEFAULT_PROGRAM_NAME="proc";f.ShellProcesses.prototype.m_showAsTree=false;f.ShellProcesses.prototype.doSetupProgramMetadata=function(m){f.DfProgram.prototype.doSetupProgramMetadata.call(this,m);m.addOption("tree","Show the processes in a tree.","true|false",f.XValueType.BOOLEAN);};f.ShellProcesses.prototype.newProgram=function(){var n=new f.ShellProcesses();n.setup();return n;};f.ShellProcesses.prototype.evalArguments=function(){f.DfProgram.prototype.evalArguments.call(this);this.m_showAsTree=this.getArguments().getBooleanByKey("tree");};f.ShellProcesses.prototype.runProcess=function(){var k=this.getProcess().getKernel().getKernelProcess();var b=f.XStringBufferExt.create();b.appendLine("*** List of all processes ***");this.recursiveCollect(k,b);b.appendLine("*****************************");this.println(b.toString());this.exitNow(0);return false;};f.ShellProcesses.prototype.recursiveCollect=function(p,b){b.append(p.getProcessId());b.append(" - ");var a=p.getProcessType();b.append(a.getName());var s=p.getProgramCfg();if(f.notNull(s)){b.append(" - ");b.append(s.getName());var c=s.getArguments();if(f.notNull(c)){var d=c.getArgumentString();b.append(" ");b.append(d);}}b.appendNewLine();if(this.m_showAsTree){b.indent();}var e=p.getChildProcesses();for(var i=0;i<e.size();i++){var g=e.get(i);this.recursiveCollect(g,b);}if(this.m_showAsTree){b.outdent();}};f.ShellRmdir=function(){};f.ShellRmdir.prototype=new f.DfProgram();f.ShellRmdir.prototype._ff_c="ShellRmdir";f.ShellRmdir.DEFAULT_PROGRAM_NAME="rmdir";f.ShellRmdir.prototype.doSetupProgramMetadata=function(m){f.DfProgram.prototype.doSetupProgramMetadata.call(this,m);};f.ShellRmdir.prototype.newProgram=function(){var n=new f.ShellRmdir();n.setup();return n;};f.ShellRmdir.prototype.evalArguments=function(){f.DfProgram.prototype.evalArguments.call(this);};f.ShellRmdir.prototype.runProcess=function(){this.println("Rmdir: Todo!");this.exitNow(0);return false;};f.ShellSet=function(){};f.ShellSet.prototype=new f.DfProgram();f.ShellSet.prototype._ff_c="ShellSet";f.ShellSet.DEFAULT_PROGRAM_NAME="set";f.ShellSet.prototype.newProgram=function(){var n=new f.ShellSet();n.setup();return n;};f.ShellSet.prototype.doSetupProgramMetadata=function(m){f.DfProgram.prototype.doSetupProgramMetadata.call(this,m);m.addOption("resolve",null,"Resolve all inner variables",f.XValueType.BOOLEAN);m.addParameter("variable","name=value");};f.ShellSet.prototype.runProcess=function(){var s=this.getSession();var e=s.getEnvironment();var a=s.getStdout();var v=this.getArgumentStructure().getStringByKey("variable");if(f.XStringUtils.isNullOrEmpty(v)){var r=this.getArgumentStructure().getBooleanByKeyExt("resolve",false);var b=e.getVariableNames();var c=f.XListOfString.createFromReadOnlyList(b);c.sortByDirection(f.XSortDirection.ASCENDING);var d=f.XStringBuffer.create();for(var i=0;i<c.size();i++){var n=c.get(i);var g;g=e.getVariable(n);if(r===true){g=e.resolveString(g);if(f.isNull(g)){g=f.XStringUtils.concatenate2("Cannot resolve: ",g);}}d.append(n).append("=").append(g).appendNewLine();}a.println(d.toString());}else{var h=f.XString.indexOf(v,"=");if(h===-1){a.println("Missing '=': The parameter assignment must be in the form 'name=value'.");}else{var t=f.XString.substring(v,0,h);var j=f.XString.substring(v,h+1,-1);e.setVariable(t,j);}}this.exitNow(0);return false;};f.ShellTakeOver=function(){};f.ShellTakeOver.prototype=new f.DfProgram();f.ShellTakeOver.prototype._ff_c="ShellTakeOver";f.ShellTakeOver.DEFAULT_PROGRAM_NAME="takeover";f.ShellTakeOver.prototype.newProgram=function(){var n=new f.ShellTakeOver();n.setup();return n;};f.ShellTakeOver.prototype.doSetupProgramMetadata=function(m){f.DfProgram.prototype.doSetupProgramMetadata.call(this,m);m.addParameter("program","the program to run");m.addParameter("containerId","the id of the container to be hijacked");};f.ShellTakeOver.prototype.runProcess=function(){this.println("Rendering...");var c=this.getArgumentStructure().getStringByKey("containerId");var p=this.getArgumentStructure().getStringByKey("program");if(f.XStringUtils.isNullOrEmpty(c)){c="content";}if(f.XStringUtils.isNullOrEmpty(p)){p="FireflyStudio";}this.doHijack(c,p);var n=f.ProgramArgs.create();var s=f.ProgramStartCfg.create(this.getProcess(),p,null,n);s.setIsNewConsoleNeeded(true);s.setIsCreatingChildProcess(false);s.setEnforcedOutputDevice(f.ProgramDevice.EMBEDDED);s.setNativeAnchorId(c);s.processExecution(f.SyncType.NON_BLOCKING,null,null);this.exitNow(0);return false;};f.ShellTakeOver.prototype.doHijack=function(c,p){this.println("No native code. Please implement native hijack process!");};f.ShellWget=function(){};f.ShellWget.prototype=new f.DfProgram();f.ShellWget.prototype._ff_c="ShellWget";f.ShellWget.DEFAULT_PROGRAM_NAME="wget";f.ShellWget.prototype.m_url=null;f.ShellWget.prototype.m_uriObj=null;f.ShellWget.prototype.doSetupProgramMetadata=function(m){f.DfProgram.prototype.doSetupProgramMetadata.call(this,m);m.addParameter("url","The url to get");};f.ShellWget.prototype.newProgram=function(){var n=new f.ShellWget();n.setup();return n;};f.ShellWget.prototype.evalArguments=function(){f.DfProgram.prototype.evalArguments.call(this);this.m_url=this.getArgumentStructure().getStringByKey("url");};f.ShellWget.prototype.runProcess=function(){this.m_uriObj=f.XUri.createFromUrl(this.m_url);this.log2("Connecting to ",this.m_uriObj.toString());var h=f.HttpClientFactory.newInstanceByConnection(this.getSession(),this.m_uriObj);if(f.notNull(h)){var r=h.getRequest();r.setFromUri(this.m_uriObj);h.processHttpRequest(f.SyncType.BLOCKING,this,null);}else{this.println("Cannot create connection");}this.exitNow(0);return false;};f.ShellWget.prototype.onHttpResponse=function(e,r,c){if(e.isValid()){var d=e.getData();if(f.notNull(d)){var o=d.getString();this.println(o);}else{this.println("No data available");}}else{this.log(e.getSummary());}};f.ShellWhoami=function(){};f.ShellWhoami.prototype=new f.DfProgram();f.ShellWhoami.prototype._ff_c="ShellWhoami";f.ShellWhoami.DEFAULT_PROGRAM_NAME="whoami";f.ShellWhoami.USER_ID="userid";f.ShellWhoami.TITLE="title";f.ShellWhoami.LAST_NAME="lastname";f.ShellWhoami.FIRST_NAME="firstname";f.ShellWhoami.FULL_NAME="fullname";f.ShellWhoami.DISPLAY_NAME="display";f.ShellWhoami.DEPARTMENT="department";f.ShellWhoami.DESCRIPTION="description";f.ShellWhoami.COST_CENTER="costCenter";f.ShellWhoami.ROOM_NUMBER="roomNumber";f.ShellWhoami.DELIVERY_OFFICE_NAME="deliveryoffice";f.ShellWhoami.COUNTRY="country";f.ShellWhoami.REGION="region";f.ShellWhoami.CITY="city";f.ShellWhoami.ZIP_CODE="zip";f.ShellWhoami.STREET_NAME="street";f.ShellWhoami.EMAIL="mail";f.ShellWhoami.PHONE_NUMBER="phone";f.ShellWhoami.FAX_NUMBER="fax";f.ShellWhoami.MOBILE="mobile";f.ShellWhoami.SAP_NAME="sapName";f.ShellWhoami.MANAGER="manager";f.ShellWhoami.THUMBNAIL_PHOTO="thumbnail";f.ShellWhoami.DATA_ACCESS_LANGUAGE="datalanguage";f.ShellWhoami.LANGUAGE="language";f.ShellWhoami.COMPANY="company";f.ShellWhoami.HOME_DIR="unixdir";f.ShellWhoami.ACCOUNT_TYPE="accounttype";f.ShellWhoami.USER_ENABLED="enabled";f.ShellWhoami.TELEPHONE_ASSISTANT="assistentphone";f.ShellWhoami.EXCHANGE_USAGE_LOCATION="exchange";f.ShellWhoami.SAP_OBJECT_STATUS="sapobjectstatus";f.ShellWhoami.DATE_FORMAT="dateformat";f.ShellWhoami.DECIMAL_FORMAT="decimalformat";f.ShellWhoami.TIME_FORMAT="timeformat";f.ShellWhoami.USR_NAME="username";f.ShellWhoami.prototype.m_buffer=null;f.ShellWhoami.prototype.m_command=null;f.ShellWhoami.prototype.m_isVerbose=false;f.ShellWhoami.prototype.m_key=null;f.ShellWhoami.prototype.m_value=null;f.ShellWhoami.prototype.m_user=null;f.ShellWhoami.prototype.doSetupProgramMetadata=function(m){f.DfProgram.prototype.doSetupProgramMetadata.call(this,m);m.addParameter("command"," The command. Can be 'set', 'save' or 'display'. Default is display.");m.addParameterList("params","For 'set': name value");m.addOption("verbose","When set to true, the keys are displayed","true|false",f.XValueType.BOOLEAN);};f.ShellWhoami.prototype.newProgram=function(){var n=new f.ShellWhoami();n.setup();return n;};f.ShellWhoami.prototype.evalArguments=function(){f.DfProgram.prototype.evalArguments.call(this);var a=this.getArgumentStructure();this.m_command=a.getStringByKey("command");var c=a.getListByKey("params");if(f.XString.isEqual(this.m_command,"set")){if(c.size()>0){this.m_key=c.getStringAt(0);}if(c.size()>1){this.m_value=c.getStringAt(1);}}this.m_isVerbose=a.getBooleanByKeyExt("verbose",false);};f.ShellWhoami.prototype.runProcess=function(){var d=true;this.m_user=this.getProcess().getUserProfile();if(f.XString.isEqual(this.m_command,"set")){if(this.m_user.getServiceApiLevel()!==f.ServiceApiLevel.PERSONALIZATION){this.println("Sorry, your current user profile is read-only and cannot be changed.");}else if(f.XStringUtils.isNullOrEmpty(this.m_key)){this.println("Key required (set key value). Set -verbose to see all keys.");}else if(f.XStringUtils.isNullOrEmpty(this.m_value)){this.println("Value required (set key value).");}else{if(f.XString.isEqual(this.m_key,f.ShellWhoami.TITLE)){this.m_user.setTitle(this.m_value);}else if(f.XString.isEqual(this.m_key,f.ShellWhoami.FIRST_NAME)){this.m_user.setFirstName(this.m_value);}else if(f.XString.isEqual(this.m_key,f.ShellWhoami.LAST_NAME)){this.m_user.setLastName(this.m_value);}else if(f.XString.isEqual(this.m_key,f.ShellWhoami.FULL_NAME)){this.m_user.setFullName(this.m_value);}else if(f.XString.isEqual(this.m_key,f.ShellWhoami.DISPLAY_NAME)){this.m_user.setDisplayName(this.m_value);}else if(f.XString.isEqual(this.m_key,f.ShellWhoami.SAP_NAME)){this.m_user.setSAPName(this.m_value);}else if(f.XString.isEqual(this.m_key,f.ShellWhoami.DESCRIPTION)){this.m_user.setDescription(this.m_value);}else if(f.XString.isEqual(this.m_key,f.ShellWhoami.LANGUAGE)){this.m_user.setLanguage(this.m_value);}else if(f.XString.isEqual(this.m_key,f.ShellWhoami.DATA_ACCESS_LANGUAGE)){this.m_user.setDataAccessLanguage(this.m_value);}else if(f.XString.isEqual(this.m_key,f.ShellWhoami.COMPANY)){this.m_user.setCompany(this.m_value);}else if(f.XString.isEqual(this.m_key,f.ShellWhoami.ROOM_NUMBER)){this.m_user.setRoomNumber(this.m_value);}else if(f.XString.isEqual(this.m_key,f.ShellWhoami.STREET_NAME)){this.m_user.setStreetName(this.m_value);}}}else if(f.XString.isEqual(this.m_command,"save")){var s=this.getProcess().getKernel().getSubSystemContainer(f.SubSystemType.USER_PROFILE);var a=s.getAdminApi();if(a.canUserProfileSaved()===false){this.println("Sorry, your current user profile is read-only and cannot be saved.");}else{this.print("Saving the user profile...");d=false;a.processUserProfileSave(null,this,null);}}else{this.m_buffer=f.TwoColumnBuffer.create();this.appendName("User",null,false,this.m_user.getName());this.appendBoolean("Enabled",null,this.m_user.isUserEnabledDefault(),this.m_user.getUserEnabled());this.appendName("Title",f.ShellWhoami.TITLE,this.m_user.isTitleDefault(),this.m_user.getTitle());this.appendName("First name",f.ShellWhoami.FIRST_NAME,this.m_user.isFirstNameDefault(),this.m_user.getFirstName());this.appendName("Last name",f.ShellWhoami.LAST_NAME,this.m_user.isLastNameDefault(),this.m_user.getLastName());this.appendName("Full name",f.ShellWhoami.FULL_NAME,this.m_user.isFullNameDefault(),this.m_user.getFullName());this.appendName("Display name",f.ShellWhoami.DISPLAY_NAME,this.m_user.isDisplayNameDefault(),this.m_user.getDisplayName());this.appendName("SAP name",f.ShellWhoami.SAP_NAME,this.m_user.isSAPNameDefault(),this.m_user.getSAPName());this.appendName("Description",f.ShellWhoami.DESCRIPTION,this.m_user.isDescriptionDefault(),this.m_user.getDescription());this.appendName("Language",f.ShellWhoami.LANGUAGE,this.m_user.isLanguageDefault(),this.m_user.getLanguage());this.appendName("Data access language",f.ShellWhoami.DATA_ACCESS_LANGUAGE,this.m_user.isDataAccessLanguageDefault(),this.m_user.getDataAccessLanguage());this.appendName("Company",f.ShellWhoami.COMPANY,this.m_user.isCompanyDefault(),this.m_user.getCompany());this.appendName("Room number",f.ShellWhoami.ROOM_NUMBER,this.m_user.isRoomNumberDefault(),this.m_user.getRoomNumber());this.appendName("Street name",f.ShellWhoami.STREET_NAME,this.m_user.isStreetNameDefault(),this.m_user.getStreetName());this.appendName("City code","streetcode",this.m_user.isCityCodeDefault(),this.m_user.getCityCode());this.appendName("City name","cityname",this.m_user.isCityNameDefault(),this.m_user.getCityName());this.appendName("Region","region",this.m_user.isRegionDefault(),this.m_user.getRegion());this.appendName("Country","country",this.m_user.isCountryDefault(),this.m_user.getCountry());this.appendName("Delivery office","deliveryoffice",this.m_user.isDeliveryOfficeNameDefault(),this.m_user.getDeliveryOfficeName());this.appendName("Cost center","costcenter",this.m_user.isCostCenterDefault(),this.m_user.getCostCenter());this.appendName("Cost center id","costcenterid",this.m_user.isCostCenterIdDefault(),this.m_user.getCostCenterId());this.appendName("Department","department",this.m_user.isDepartmentDefault(),this.m_user.getDepartment());this.appendName("Org Unit","orgunit",this.m_user.isOrgUnitDefault(),this.m_user.getOrgUnit());this.appendName("Phone number","phonenumber",this.m_user.isPhoneNumberDefault(),this.m_user.getPhoneNumber());this.appendName("Mobile phone","mobile",this.m_user.isMobilePhoneNumberDefault(),this.m_user.getMobilePhoneNumber());this.appendName("Assistent phone","assistentphone",this.m_user.isTelephoneAssistantDefault(),this.m_user.getTelephoneAssistant());this.appendName("Fax number","fax",this.m_user.isFaxNumberDefault(),this.m_user.getFaxNumber());this.appendName("Email","email",this.m_user.isEmailAddressDefault(),this.m_user.getEmailAddress());this.appendName("Email product update","productupdateemail",this.m_user.isEmailProductUpdateNotificationDefault(),this.m_user.getEmailProductUpdateNotification());this.appendName("Email system notification","sysnotifyemail",this.m_user.isEmailSystemNotificationDefault(),this.m_user.getEmailSystemNotification());this.appendName("Manager","manager",this.m_user.isManagerPersonNumberDefault(),this.m_user.getManagerPersonNumber());this.appendName("Decimal separator","decsep",this.m_user.isDecimalSeparatorDefault(),this.m_user.getDecimalSeparator());this.appendName("Decimal grouping","decgroup",this.m_user.isDecimalGroupingSeparatorDefault(),this.m_user.getDecimalGroupingSeparator());this.appendName("Decimal formatting","decformat",this.m_user.isDecimalFormatDefault(),this.m_user.getDecimalFormat());this.appendName("Decimal example",null,false,this.m_user.getDecimalFormatExample());this.appendName("Scale formatting","scale",this.m_user.isScaleFormattingDefault(),this.m_user.getScaleFormatting());this.appendName("Timezone id","timezoneid",this.m_user.isTimeZoneIdDefault(),this.m_user.getTimeZoneId());this.appendName("Date formatting","dateformat",this.m_user.isDateFormattingDefault(),this.m_user.getDateFormatting());this.appendName("Encryption token","crypttoken",this.m_user.isEncryptionTokenDefault(),this.m_user.getEncryptionToken());this.appendName("Cache schema","cacheschema",this.m_user.isCacheSchemaDefault(),this.m_user.getCacheSchema());this.appendName("Currency position","currencypos",this.m_user.isCurrencyPositionDefault(),this.m_user.getCurrencyPosition());this.appendName("System tenant id",null,this.m_user.isTenantIdDefault(),this.m_user.getTenantId());this.appendName("Unix home","unixhome",this.m_user.isUnixHomeDirectoryDefault(),this.m_user.getUnixHomeDirectory());this.println("Default values defined on the top layer are marked with a '*'");this.print(this.m_buffer.toString());}if(d===true){this.exitNow(0);return false;}else{return true;}};f.ShellWhoami.prototype.appendName=function(d,k,i,v){this.m_buffer.append(d);if(this.m_isVerbose&&f.notNull(k)){this.m_buffer.append(" [");this.m_buffer.append(k);this.m_buffer.append("]");}this.m_buffer.append(": ");if(i===true){this.m_buffer.append("(*) ");}this.m_buffer.nextColumn();this.m_buffer.append(v);this.m_buffer.appendNewLine();return this.m_buffer;};f.ShellWhoami.prototype.appendBoolean=function(d,k,i,v){this.m_buffer.append(d);if(this.m_isVerbose&&f.notNull(k)){this.m_buffer.append(" [");this.m_buffer.append(k);this.m_buffer.append("]");}this.m_buffer.append(": ");if(i===true){this.m_buffer.append("(*) ");}this.m_buffer.nextColumn();this.m_buffer.appendBoolean(v);this.m_buffer.appendNewLine();return this.m_buffer;};f.ShellWhoami.prototype.onUserProfileSaved=function(e,u,c){if(e.isValid()){this.println("done!");}else{this.println("ERROR:");this.println(e.getSummary());}this.exitNow(0);};f.ShellModule=function(){};f.ShellModule.prototype=new f.DfModule();f.ShellModule.prototype._ff_c="ShellModule";f.ShellModule.s_module=null;f.ShellModule.getInstance=function(){if(f.isNull(f.ShellModule.s_module)){f.DfModule.checkInitialized(f.KernelNativeModule.getInstance());f.ShellModule.s_module=f.DfModule.startExt(new f.ShellModule());f.ProgramRegistration.setProgramFactory(f.SerenityShell.DEFAULT_PROGRAM_NAME,new f.SerenityShell());f.ProgramRegistration.setProgramFactory(f.ShellCache.DEFAULT_PROGRAM_NAME,new f.ShellCache());f.ProgramRegistration.setProgramFactory(f.ShellCd.DEFAULT_PROGRAM_NAME,new f.ShellCd());f.ProgramRegistration.setProgramFactory(f.ShellDel.DEFAULT_PROGRAM_NAME,new f.ShellDel());f.ProgramRegistration.setProgramFactory(f.ShellDir.DEFAULT_PROGRAM_NAME,new f.ShellDir());f.ProgramRegistration.setProgramFactory(f.ShellGrep.DEFAULT_PROGRAM_NAME,new f.ShellGrep());f.ProgramRegistration.setProgramFactory(f.ShellHelp.DEFAULT_PROGRAM_NAME,new f.ShellHelp());f.ProgramRegistration.setProgramFactory(f.ShellKill.DEFAULT_PROGRAM_NAME,new f.ShellKill());f.ProgramRegistration.setProgramFactory(f.ShellListPrgs.DEFAULT_PROGRAM_NAME,new f.ShellListPrgs());f.ProgramRegistration.setProgramFactory(f.ShellMkdir.DEFAULT_PROGRAM_NAME,new f.ShellMkdir());f.ProgramRegistration.setProgramFactory(f.ShellProcesses.DEFAULT_PROGRAM_NAME,new f.ShellProcesses());f.ProgramRegistration.setProgramFactory(f.ShellRmdir.DEFAULT_PROGRAM_NAME,new f.ShellRmdir());f.ProgramRegistration.setProgramFactory(f.ShellSet.DEFAULT_PROGRAM_NAME,new f.ShellSet());f.ProgramRegistration.setProgramFactory(f.ShellTakeOver.DEFAULT_PROGRAM_NAME,new f.ShellTakeOver());f.ProgramRegistration.setProgramFactory(f.ShellWget.DEFAULT_PROGRAM_NAME,new f.ShellWget());f.ProgramRegistration.setProgramFactory(f.ShellWhoami.DEFAULT_PROGRAM_NAME,new f.ShellWhoami());f.DfModule.stopExt(f.ShellModule.s_module);}return f.ShellModule.s_module;};f.ShellModule.prototype.getName=function(){return"ff2040.shell";};f.ShellModule.getInstance();return sap.firefly;});
