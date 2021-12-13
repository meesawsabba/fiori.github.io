/*!
 * SAPUI5
  (c) Copyright 2009-2021 SAP SE. All rights reserved
 */
/*global sap*/
sap.ui.define(
[
"sap/zen/dsh/firefly/ff1040.kernel.native"
],
function(oFF)
{
"use strict";

oFF.SerenityShell = function() {};
oFF.SerenityShell.prototype = new oFF.DfProgram();
oFF.SerenityShell.prototype._ff_c = "SerenityShell";

oFF.SerenityShell.DEFAULT_PROGRAM_NAME = "shell";
oFF.SerenityShell.createKernelShell = function(process)
{
	var newObj = new oFF.SerenityShell();
	newObj.setup();
	newObj.setProcess(process);
	return newObj;
};
oFF.SerenityShell.createShellByProcess = function(process)
{
	var startProcess = null;
	if (oFF.notNull(process))
	{
		startProcess = process;
	}
	else
	{
		var kernel = oFF.Kernel.getInstance();
		startProcess = kernel.getKernelProcess();
	}
	if (oFF.notNull(startProcess))
	{
		var newArgs = oFF.ProgramArgs.create();
		var startCfgBase = oFF.ProgramStartCfg.create(startProcess, "shell", null, newArgs);
		startCfgBase.setIsNewConsoleNeeded(true);
		startCfgBase.setIsCreatingChildProcess(false);
		startCfgBase.processExecution(oFF.SyncType.NON_BLOCKING, null, null);
	}
};
oFF.SerenityShell.prototype.m_useStartMarker = false;
oFF.SerenityShell.prototype.m_shellCommands = null;
oFF.SerenityShell.prototype.m_currentSubSession = null;
oFF.SerenityShell.prototype.newProgram = function()
{
	var newObj = new oFF.SerenityShell();
	newObj.setup();
	return newObj;
};
oFF.SerenityShell.prototype.setup = function()
{
	oFF.DfProgram.prototype.setup.call( this );
	this.m_shellCommands = oFF.XHashSetOfString.create();
	this.m_shellCommands.add("set");
	this.m_shellCommands.add("cd");
	this.m_shellCommands.add("rm");
	this.m_shellCommands.add("pwd");
};
oFF.SerenityShell.prototype.doSetupProgramMetadata = function(metadata)
{
	oFF.DfProgram.prototype.doSetupProgramMetadata.call( this , metadata);
	metadata.addParameterList("start", "Program with following arguments to start");
};
oFF.SerenityShell.prototype.initializeProgram = function()
{
	oFF.DfProgram.prototype.initializeProgram.call( this );
	this.registerOnProgramContainerOpen(this);
	this.registerOnProgramContainerClose(this);
};
oFF.SerenityShell.prototype.runProcess = function()
{
	if (this.getSession().hasCapability("terminal") === false)
	{
		this.m_useStartMarker = true;
	}
	var parameterList = this.getArgumentStructure().getListByKey("start");
	if (oFF.notNull(parameterList) && parameterList.size() > 0)
	{
		var startArgs = oFF.XListOfString.create();
		for (var k = 0; k < parameterList.size(); k++)
		{
			startArgs.add(parameterList.getStringAt(k));
		}
		var startCfg = oFF.ProgramStartCfg.createByCmdLineExt(this.getProcess(), startArgs, 0);
		startCfg.registerOnEvent(this);
		startCfg.processExecution(oFF.SyncType.BLOCKING, this, startCfg);
	}
	else
	{
		if (this.getStdin().supportsSyncType(oFF.SyncType.NON_BLOCKING))
		{
			this.readInputLine();
			return true;
		}
		else
		{
			while (true)
			{
				this.readInputLine();
			}
		}
	}
	return false;
};
oFF.SerenityShell.prototype.readInputLine = function()
{
	if (this.m_useStartMarker === true)
	{
		this.print(">> ");
	}
	var stdin = this.getStdin();
	stdin.readLine(this);
};
oFF.SerenityShell.prototype.onLineRead = function(text)
{
	var makeRoundtrip = false;
	if (oFF.XStringUtils.isNullOrEmpty(oFF.XString.trim(text)))
	{
		makeRoundtrip = true;
	}
	else
	{
		var stdout = this.getSession().getStdout();
		var startCfg = oFF.ProgramStartCfg.createByCmdLine(this.getProcess(), text);
		if (oFF.isNull(startCfg))
		{
			stdout.println(oFF.XStringUtils.concatenate2("Cannot find prg: ", text));
			makeRoundtrip = true;
		}
		else
		{
			var prgName = startCfg.getName();
			startCfg.setIsUsingParentEnvironment(this.m_shellCommands.contains(prgName));
			startCfg.registerOnEvent(this);
			startCfg.processExecution(oFF.SyncType.BLOCKING, this, startCfg);
		}
	}
	if (makeRoundtrip && this.getStdin().supportsSyncType(oFF.SyncType.NON_BLOCKING))
	{
		this.readInputLine();
	}
};
oFF.SerenityShell.prototype.onProgramStarted = function(extResult, program, customIdentifier)
{
	if (extResult.hasErrors())
	{
		var stdout = this.getSession().getStdout();
		stdout.println(extResult.getSummary());
	}
};
oFF.SerenityShell.prototype.onProgramTerminated = function(extResult, exitValues, canTerminate, customIdentifier) {};
oFF.SerenityShell.prototype.onProcessEvent = function(event, process, eventType)
{
	if (eventType === oFF.ProcessEventType.TERMINATED)
	{
		var supportsNonBlocking = this.getStdin().supportsSyncType(oFF.SyncType.NON_BLOCKING);
		if (supportsNonBlocking)
		{
			this.readInputLine();
		}
	}
};
oFF.SerenityShell.prototype.signalExit = function(exitCode)
{
	var supportsNonBlocking = this.getStdin().supportsSyncType(oFF.SyncType.NON_BLOCKING);
	if (supportsNonBlocking)
	{
		this.readInputLine();
	}
};
oFF.SerenityShell.prototype.getCurrentSubSession = function()
{
	return this.m_currentSubSession;
};
oFF.SerenityShell.prototype.getProcess = function()
{
	return this.getSession();
};
oFF.SerenityShell.prototype.onProgramContainerOpen = function(prgContainer)
{
	this.printWelcomeMessage();
};
oFF.SerenityShell.prototype.onProgramContainerClose = function(prgContainer) {};
oFF.SerenityShell.prototype.printWelcomeMessage = function()
{
	this.println("                      ______ _           __ _             ");
	this.println("                     |  ____(_)         / _| |            ");
	this.println("                     | |__   _ _ __ ___| |_| |_   _       ");
	this.println("                     |  __| | | '__/ _ \\  _| | | | |     ");
	this.println("                     | |    | | | |  __/ | | | |_| |      ");
	this.println("                     |_|    |_|_|  \\___|_| |_|\\__, |    ");
	this.println("                                               __/ |      ");
	this.println("                                              |___/       ");
	this.println("                                 \\     /                 ");
	this.println("                             \\    o ^ o    /             ");
	this.println("                               \\ (     ) /               ");
	this.println("                    ____________(       )____________     ");
	this.println("                   (     /   /  )       (  \\   \\     )  ");
	this.println("                   (___/___/__/           \\__\\___\\___) ");
	this.println("                      (     /  /(       )\\  \\     )     ");
	this.println("                       (__/___/ (       ) \\___\\__)      ");
	this.println("                               /(%%%%%%%)\\               ");
	this.println("                             /   (%%%%%)   \\             ");
	this.println("                                  (%%%)                   ");
	this.println("                                    !                     ");
	this.println("                                                          ");
	this.println("Welcome to the firefly shell!");
	this.println("Type 'help' to get started...");
	this.println("");
};

oFF.ShellCache = function() {};
oFF.ShellCache.prototype = new oFF.DfProgram();
oFF.ShellCache.prototype._ff_c = "ShellCache";

oFF.ShellCache.DEFAULT_PROGRAM_NAME = "cache";
oFF.ShellCache.prototype.m_command = null;
oFF.ShellCache.prototype.doSetupProgramMetadata = function(metadata)
{
	oFF.DfProgram.prototype.doSetupProgramMetadata.call( this , metadata);
	metadata.addParameter("command", " The command. Can be 'status', 'enable' or 'disable'. ");
};
oFF.ShellCache.prototype.newProgram = function()
{
	var newPrg = new oFF.ShellCache();
	newPrg.setup();
	return newPrg;
};
oFF.ShellCache.prototype.evalArguments = function()
{
	oFF.DfProgram.prototype.evalArguments.call( this );
	this.m_command = this.getArgumentStructure().getStringByKey("command");
};
oFF.ShellCache.prototype.runProcess = function()
{
	var process = this.getProcess();
	var kernel = process.getKernel();
	var subSystemContainer = kernel.getSubSystemContainer(oFF.SubSystemType.CACHE);
	var status = subSystemContainer.getStatus();
	var output = oFF.XStringBufferExt.create();
	output.setIndentationString("    ");
	output.appendLine("*** Cache ***");
	if (oFF.XString.isEqual(this.m_command, "status"))
	{
		output.append("Status: ").appendLine(status.getName());
		var messageCollection = subSystemContainer.getMessageCollection();
		if (messageCollection.getMessages().size() > 0)
		{
			output.appendLine("Messages:");
			output.appendLine(messageCollection.getSummary());
		}
		if (status === oFF.SubSystemStatus.ACTIVE)
		{
			var cacheManager = subSystemContainer.getMainApi();
			output.append("Type: ").appendLine(cacheManager.getCacheType());
			if (cacheManager.supportsNameSpaceEnumeration())
			{
				output.appendLine("Defined Caches:");
				output.indent();
				var nameSpaces = cacheManager.getNameSpaces();
				if (nameSpaces.size() > 0)
				{
					this.renderSubCache(cacheManager, output);
				}
				else
				{
					output.appendLine("None");
				}
				output.outdent();
			}
		}
	}
	this.print(output.toString());
	this.exitNow(0);
	return false;
};
oFF.ShellCache.prototype.renderSubCache = function(parent, output)
{
	var nameSpaces = parent.getNameSpaces();
	for (var i = 0; i < nameSpaces.size(); i++)
	{
		var name = nameSpaces.get(i);
		output.append("  ").append(name).append(" ");
		var cache = parent.getSubCache(name);
		if (cache.isEnabled() === true)
		{
			output.append("Active");
			output.append(" - ");
			if (cache.isReadEnabled())
			{
				output.append("R");
			}
			if (cache.isWriteEnabled())
			{
				output.append("W");
			}
		}
		else
		{
			output.append("Inactive");
		}
		output.append(" - Max Count: ");
		output.appendInt(cache.getMaxCount());
		output.append(" - Timeout: ");
		output.appendInt(cache.getValidityTime());
		output.append(" - Hits/Missed/Write: ");
		output.appendInt(cache.getHitCount());
		output.append("/");
		output.appendInt(cache.getMissedHitCount());
		output.append("/");
		output.appendInt(cache.getWriteCount());
		output.appendNewLine();
		output.indent();
		this.renderSubCache(cache, output);
		output.outdent();
	}
};

oFF.ShellCd = function() {};
oFF.ShellCd.prototype = new oFF.DfProgram();
oFF.ShellCd.prototype._ff_c = "ShellCd";

oFF.ShellCd.DEFAULT_PROGRAM_NAME = "cd";
oFF.ShellCd.prototype.m_param = null;
oFF.ShellCd.prototype.doSetupProgramMetadata = function(metadata)
{
	oFF.DfProgram.prototype.doSetupProgramMetadata.call( this , metadata);
	metadata.addParameter("directory", " Change the current directory to dir.");
};
oFF.ShellCd.prototype.newProgram = function()
{
	var newPrg = new oFF.ShellCd();
	newPrg.setup();
	return newPrg;
};
oFF.ShellCd.prototype.evalArguments = function()
{
	oFF.DfProgram.prototype.evalArguments.call( this );
	this.m_param = this.getArgumentStructure().getStringByKey("directory");
};
oFF.ShellCd.prototype.runProcess = function()
{
	var parentProcess = this.getProcess().getParentProcess();
	var currentWorkingDirectory = parentProcess.getCurrentWorkingDirectory();
	var curDir = oFF.XFile.createByUri(this.getSession(), currentWorkingDirectory);
	if (oFF.notNull(curDir))
	{
		var newDirectory = oFF.XUri.createChild(currentWorkingDirectory, this.m_param);
		newDirectory.normalizePath(true);
		var newCurDir = oFF.XFile.createByUri(this.getSession(), newDirectory);
		if (newCurDir.isExisting() && newCurDir.isDirectory())
		{
			parentProcess.setCurrentWorkingDirectory(newDirectory);
		}
		else
		{
			this.println(oFF.XStringUtils.concatenate3("'", this.m_param, "':  No such file or directory"));
		}
	}
	else
	{
		this.println(oFF.XStringUtils.concatenate3("'", this.m_param, "':  No valid path"));
	}
	this.exitNow(0);
	return false;
};

oFF.ShellDel = function() {};
oFF.ShellDel.prototype = new oFF.DfProgram();
oFF.ShellDel.prototype._ff_c = "ShellDel";

oFF.ShellDel.DEFAULT_PROGRAM_NAME = "del";
oFF.ShellDel.prototype.doSetupProgramMetadata = function(metadata)
{
	oFF.DfProgram.prototype.doSetupProgramMetadata.call( this , metadata);
};
oFF.ShellDel.prototype.newProgram = function()
{
	var newPrg = new oFF.ShellDel();
	newPrg.setup();
	return newPrg;
};
oFF.ShellDel.prototype.evalArguments = function()
{
	oFF.DfProgram.prototype.evalArguments.call( this );
};
oFF.ShellDel.prototype.runProcess = function()
{
	this.println("Del: ToDo!");
	this.exitNow(0);
	return false;
};

oFF.ShellDir = function() {};
oFF.ShellDir.prototype = new oFF.DfProgram();
oFF.ShellDir.prototype._ff_c = "ShellDir";

oFF.ShellDir.DEFAULT_PROGRAM_NAME = "dir";
oFF.ShellDir.PARAM_SHOW_DATE = "showdate";
oFF.ShellDir.prototype.m_showDate = false;
oFF.ShellDir.prototype.newProgram = function()
{
	var newPrg = new oFF.ShellDir();
	newPrg.setup();
	return newPrg;
};
oFF.ShellDir.prototype.doSetupProgramMetadata = function(metadata)
{
	oFF.DfProgram.prototype.doSetupProgramMetadata.call( this , metadata);
	metadata.addOption(oFF.ShellDir.PARAM_SHOW_DATE, null, "Output of date and time. Default is true.", oFF.XValueType.BOOLEAN);
};
oFF.ShellDir.prototype.evalArguments = function()
{
	oFF.DfProgram.prototype.evalArguments.call( this );
	this.m_showDate = this.getArgumentStructure().getBooleanByKeyExt(oFF.ShellDir.PARAM_SHOW_DATE, true);
};
oFF.ShellDir.prototype.runProcess = function()
{
	var process = this.getProcess();
	var current = process.getCurrentWorkingDirectory();
	this.log(current.toString());
	var buffer = oFF.XStringBuffer.create();
	var file = oFF.XFile.create(process, ".");
	var currentDirectory = file.getUrl();
	buffer.append(" Directory of ");
	buffer.append(currentDirectory);
	this.println(buffer.toString());
	this.println("");
	var children = file.getChildren();
	var sortedChildren = oFF.XList.create();
	sortedChildren.addAll(children);
	sortedChildren.sortByComparator(this);
	for (var i = 0; i < sortedChildren.size(); i++)
	{
		var fileInfo = this.getFileInfo(sortedChildren.get(i));
		this.println(fileInfo);
	}
	this.exitNow(0);
	return false;
};
oFF.ShellDir.prototype.getFileInfo = function(file)
{
	var result = oFF.XStringBuffer.create();
	if (this.m_showDate)
	{
		var ts = oFF.XDateTime.createWithMilliseconds(file.getLastModifiedTimestamp());
		result.append(ts.getDate().toIsoFormat()).append(" ").append(ts.getHourOfDay() < 10 ? "0" : "").appendInt(ts.getHourOfDay()).append(":").append(ts.getMinuteOfHour() < 10 ? "0" : "").appendInt(ts.getMinuteOfHour());
		result.append(" ");
	}
	var type = file.isDirectory() ? "<DIR> " : "      ";
	result.append(type);
	result.append(file.getName()).append(" ");
	return result.toString();
};
oFF.ShellDir.prototype.compare = function(o1, o2)
{
	if (o1.isDirectory() && o2.isDirectory() === false)
	{
		return -1;
	}
	else if (o1.isDirectory() === false && o2.isDirectory())
	{
		return 1;
	}
	else
	{
		var name1 = o1.getName();
		var name2 = o2.getName();
		return oFF.XString.compare(name1, name2);
	}
};

oFF.ShellGrep = function() {};
oFF.ShellGrep.prototype = new oFF.DfProgram();
oFF.ShellGrep.prototype._ff_c = "ShellGrep";

oFF.ShellGrep.DEFAULT_PROGRAM_NAME = "grep";
oFF.ShellGrep.prototype.newProgram = function()
{
	var newPrg = new oFF.ShellGrep();
	newPrg.setup();
	return newPrg;
};
oFF.ShellGrep.prototype.runProcess = function()
{
	this.println("Hello World!");
	this.exitNow(0);
	return false;
};

oFF.ShellHelp = function() {};
oFF.ShellHelp.prototype = new oFF.DfProgram();
oFF.ShellHelp.prototype._ff_c = "ShellHelp";

oFF.ShellHelp.DEFAULT_PROGRAM_NAME = "help";
oFF.ShellHelp.prototype.doSetupProgramMetadata = function(metadata)
{
	oFF.DfProgram.prototype.doSetupProgramMetadata.call( this , metadata);
};
oFF.ShellHelp.prototype.newProgram = function()
{
	var newPrg = new oFF.ShellHelp();
	newPrg.setup();
	return newPrg;
};
oFF.ShellHelp.prototype.evalArguments = function()
{
	oFF.DfProgram.prototype.evalArguments.call( this );
};
oFF.ShellHelp.prototype.runProcess = function()
{
	this.println("    _          _       ");
	this.println("   | |__   ___| |_ __  ");
	this.println("   | '_ \\ / _ \\ | '_ \\ ");
	this.println("   | | | |  __/ | |_) |");
	this.println("   |_| |_|\\___|_| .__/ ");
	this.println("                |_|  ");
	this.println("   ");
	this.println("There is not much yet here, but...");
	this.println("You can type 'listprgs' to see a list of available programs!");
	this.exitNow(0);
	return false;
};

oFF.ShellKill = function() {};
oFF.ShellKill.prototype = new oFF.DfProgram();
oFF.ShellKill.prototype._ff_c = "ShellKill";

oFF.ShellKill.DEFAULT_PROGRAM_NAME = "kill";
oFF.ShellKill.prototype.m_id = null;
oFF.ShellKill.prototype.m_text = null;
oFF.ShellKill.prototype.doSetupProgramMetadata = function(metadata)
{
	oFF.DfProgram.prototype.doSetupProgramMetadata.call( this , metadata);
	metadata.addMandatoryOption("id", "The id of the process to be killed.", "", oFF.XValueType.STRING);
};
oFF.ShellKill.prototype.newProgram = function()
{
	var newPrg = new oFF.ShellKill();
	newPrg.setup();
	return newPrg;
};
oFF.ShellKill.prototype.evalArguments = function()
{
	oFF.DfProgram.prototype.evalArguments.call( this );
	var args = this.getArguments();
	this.m_id = args.getStringByKey("id");
};
oFF.ShellKill.prototype.runProcess = function()
{
	if (oFF.XStringUtils.isNullOrEmpty(this.m_id))
	{
		this.println("No id given");
		this.exitNow(0);
		return false;
	}
	else
	{
		var kernel = this.getProcess().getKernel();
		var process = kernel.getChildProcessById(this.m_id);
		if (oFF.isNull(process))
		{
			this.println(oFF.XStringUtils.concatenate3("Cannot find a process with id '", this.m_id, "'"));
			this.exitNow(0);
			return false;
		}
		else
		{
			var startConfiguration = process.getProgramCfg();
			if (oFF.notNull(startConfiguration))
			{
				this.m_text = startConfiguration.getName();
			}
			if (oFF.XStringUtils.isNullOrEmpty(this.m_text))
			{
				this.m_text = this.m_id;
			}
			kernel.processShutdownProcess(null, this, null, this.m_id, false);
			return true;
		}
	}
};
oFF.ShellKill.prototype.onProcessTerminated = function(extResult, exitValues, customIdentifier)
{
	if (extResult.isValid())
	{
		this.println(oFF.XStringUtils.concatenate2("Process was successfully terminated: ", this.m_text));
	}
	else
	{
		this.println(oFF.XStringUtils.concatenate2("Failed to terminated process: ", this.m_text));
		var summary = extResult.getSummary();
		this.println(summary);
	}
	this.exitNow(0);
};

oFF.ShellListPrgs = function() {};
oFF.ShellListPrgs.prototype = new oFF.DfProgram();
oFF.ShellListPrgs.prototype._ff_c = "ShellListPrgs";

oFF.ShellListPrgs.DEFAULT_PROGRAM_NAME = "listprg";
oFF.ShellListPrgs.prototype.m_showDetails = false;
oFF.ShellListPrgs.prototype.newProgram = function()
{
	var newPrg = new oFF.ShellListPrgs();
	newPrg.setup();
	return newPrg;
};
oFF.ShellListPrgs.prototype.doSetupProgramMetadata = function(metadata)
{
	oFF.DfProgram.prototype.doSetupProgramMetadata.call( this , metadata);
	metadata.addOption("details", "Show detailed program infos", "true|false", oFF.XValueType.BOOLEAN);
};
oFF.ShellListPrgs.prototype.evalArguments = function()
{
	oFF.DfProgram.prototype.evalArguments.call( this );
	this.m_showDetails = this.getArguments().getBooleanByKey("details");
};
oFF.ShellListPrgs.prototype.runProcess = function()
{
	var allEntries = oFF.ProgramRegistration.getAllEntries();
	var sortedList = oFF.XListOfString.create();
	sortedList.addAll(allEntries.getKeysAsReadOnlyListOfString());
	sortedList.sortByDirection(oFF.XSortDirection.ASCENDING);
	if (this.m_showDetails)
	{
		this.printWithDetails(allEntries, sortedList);
	}
	else
	{
		this.printCompact(sortedList);
	}
	this.exitNow(0);
	return false;
};
oFF.ShellListPrgs.prototype.printCompact = function(sortedKeysList)
{
	this.println("Programs:");
	this.println("-----------");
	for (var i = 0; i < sortedKeysList.size(); i++)
	{
		this.println(oFF.XStringUtils.concatenate2("- ", sortedKeysList.get(i)));
	}
};
oFF.ShellListPrgs.prototype.printWithDetails = function(allManifests, sortedKeysList)
{
	var titleStr = this.generateFixedLengthStr("Program name:", 38);
	titleStr = oFF.XStringUtils.concatenate2(titleStr, this.generateFixedLengthStr("Display name:", 38));
	titleStr = oFF.XStringUtils.concatenate2(titleStr, this.generateFixedLengthStr("Author:", 38));
	this.println(titleStr);
	this.println("---------------------------------------------------------------------------------------------");
	for (var i = 0; i < sortedKeysList.size(); i++)
	{
		var tmpManifest = allManifests.getByKey(sortedKeysList.get(i));
		var detailStr = oFF.XStringUtils.concatenate2("- ", this.generateFixedLengthStr(sortedKeysList.get(i), 37));
		detailStr = oFF.XStringUtils.concatenate2(detailStr, this.generateFixedLengthStr(oFF.XStringUtils.concatenate2(" | ", tmpManifest.getDisplayName()), 35));
		detailStr = oFF.XStringUtils.concatenate2(detailStr, this.generateFixedLengthStr(oFF.XStringUtils.concatenate2(" | ", tmpManifest.getAuthor()), 35));
		this.println(detailStr);
		this.println("---------------------------------------------------------------------------------------------");
	}
};
oFF.ShellListPrgs.prototype.generateFixedLengthStr = function(inputStr, length)
{
	var tmpStr = "";
	if (oFF.XStringUtils.isNotNullAndNotEmpty(inputStr))
	{
		tmpStr = inputStr;
	}
	var strSize = oFF.XString.size(tmpStr);
	return oFF.XStringUtils.rightPad(tmpStr, " ", length - strSize);
};

oFF.ShellMkdir = function() {};
oFF.ShellMkdir.prototype = new oFF.DfProgram();
oFF.ShellMkdir.prototype._ff_c = "ShellMkdir";

oFF.ShellMkdir.DEFAULT_PROGRAM_NAME = "mkdir";
oFF.ShellMkdir.prototype.doSetupProgramMetadata = function(metadata)
{
	oFF.DfProgram.prototype.doSetupProgramMetadata.call( this , metadata);
};
oFF.ShellMkdir.prototype.newProgram = function()
{
	var newPrg = new oFF.ShellMkdir();
	newPrg.setup();
	return newPrg;
};
oFF.ShellMkdir.prototype.evalArguments = function()
{
	oFF.DfProgram.prototype.evalArguments.call( this );
};
oFF.ShellMkdir.prototype.runProcess = function()
{
	this.println("Mdir: Todo!");
	this.exitNow(0);
	return false;
};

oFF.ShellProcesses = function() {};
oFF.ShellProcesses.prototype = new oFF.DfProgram();
oFF.ShellProcesses.prototype._ff_c = "ShellProcesses";

oFF.ShellProcesses.DEFAULT_PROGRAM_NAME = "proc";
oFF.ShellProcesses.prototype.m_showAsTree = false;
oFF.ShellProcesses.prototype.doSetupProgramMetadata = function(metadata)
{
	oFF.DfProgram.prototype.doSetupProgramMetadata.call( this , metadata);
	metadata.addOption("tree", "Show the processes in a tree.", "true|false", oFF.XValueType.BOOLEAN);
};
oFF.ShellProcesses.prototype.newProgram = function()
{
	var newPrg = new oFF.ShellProcesses();
	newPrg.setup();
	return newPrg;
};
oFF.ShellProcesses.prototype.evalArguments = function()
{
	oFF.DfProgram.prototype.evalArguments.call( this );
	this.m_showAsTree = this.getArguments().getBooleanByKey("tree");
};
oFF.ShellProcesses.prototype.runProcess = function()
{
	var kernelProcess = this.getProcess().getKernel().getKernelProcess();
	var buffer = oFF.XStringBufferExt.create();
	buffer.appendLine("*** List of all processes ***");
	this.recursiveCollect(kernelProcess, buffer);
	buffer.appendLine("*****************************");
	this.println(buffer.toString());
	this.exitNow(0);
	return false;
};
oFF.ShellProcesses.prototype.recursiveCollect = function(process, buffer)
{
	buffer.append(process.getProcessId());
	buffer.append(" - ");
	var processType = process.getProcessType();
	buffer.append(processType.getName());
	var startConfiguration = process.getProgramCfg();
	if (oFF.notNull(startConfiguration))
	{
		buffer.append(" - ");
		buffer.append(startConfiguration.getName());
		var prgArgs = startConfiguration.getArguments();
		if (oFF.notNull(prgArgs))
		{
			var argumentString = prgArgs.getArgumentString();
			buffer.append(" ");
			buffer.append(argumentString);
		}
	}
	buffer.appendNewLine();
	if (this.m_showAsTree)
	{
		buffer.indent();
	}
	var children = process.getChildProcesses();
	for (var i = 0; i < children.size(); i++)
	{
		var child = children.get(i);
		this.recursiveCollect(child, buffer);
	}
	if (this.m_showAsTree)
	{
		buffer.outdent();
	}
};

oFF.ShellRmdir = function() {};
oFF.ShellRmdir.prototype = new oFF.DfProgram();
oFF.ShellRmdir.prototype._ff_c = "ShellRmdir";

oFF.ShellRmdir.DEFAULT_PROGRAM_NAME = "rmdir";
oFF.ShellRmdir.prototype.doSetupProgramMetadata = function(metadata)
{
	oFF.DfProgram.prototype.doSetupProgramMetadata.call( this , metadata);
};
oFF.ShellRmdir.prototype.newProgram = function()
{
	var newPrg = new oFF.ShellRmdir();
	newPrg.setup();
	return newPrg;
};
oFF.ShellRmdir.prototype.evalArguments = function()
{
	oFF.DfProgram.prototype.evalArguments.call( this );
};
oFF.ShellRmdir.prototype.runProcess = function()
{
	this.println("Rmdir: Todo!");
	this.exitNow(0);
	return false;
};

oFF.ShellSet = function() {};
oFF.ShellSet.prototype = new oFF.DfProgram();
oFF.ShellSet.prototype._ff_c = "ShellSet";

oFF.ShellSet.DEFAULT_PROGRAM_NAME = "set";
oFF.ShellSet.prototype.newProgram = function()
{
	var newPrg = new oFF.ShellSet();
	newPrg.setup();
	return newPrg;
};
oFF.ShellSet.prototype.doSetupProgramMetadata = function(metadata)
{
	oFF.DfProgram.prototype.doSetupProgramMetadata.call( this , metadata);
	metadata.addOption("resolve", null, "Resolve all inner variables", oFF.XValueType.BOOLEAN);
	metadata.addParameter("variable", "name=value");
};
oFF.ShellSet.prototype.runProcess = function()
{
	var session = this.getSession();
	var environment = session.getEnvironment();
	var stdo = session.getStdout();
	var variableAssign = this.getArgumentStructure().getStringByKey("variable");
	if (oFF.XStringUtils.isNullOrEmpty(variableAssign))
	{
		var resolve = this.getArgumentStructure().getBooleanByKeyExt("resolve", false);
		var variableNames = environment.getVariableNames();
		var sortedNames = oFF.XListOfString.createFromReadOnlyList(variableNames);
		sortedNames.sortByDirection(oFF.XSortDirection.ASCENDING);
		var buffer = oFF.XStringBuffer.create();
		for (var i = 0; i < sortedNames.size(); i++)
		{
			var name = sortedNames.get(i);
			var value;
			value = environment.getVariable(name);
			if (resolve === true)
			{
				value = environment.resolveString(value);
				if (oFF.isNull(value))
				{
					value = oFF.XStringUtils.concatenate2("Cannot resolve: ", value);
				}
			}
			buffer.append(name).append("=").append(value).appendNewLine();
		}
		stdo.println(buffer.toString());
	}
	else
	{
		var assignIndex = oFF.XString.indexOf(variableAssign, "=");
		if (assignIndex === -1)
		{
			stdo.println("Missing '=': The parameter assignment must be in the form 'name=value'.");
		}
		else
		{
			var theName = oFF.XString.substring(variableAssign, 0, assignIndex);
			var theValue = oFF.XString.substring(variableAssign, assignIndex + 1, -1);
			environment.setVariable(theName, theValue);
		}
	}
	this.exitNow(0);
	return false;
};

oFF.ShellTakeOver = function() {};
oFF.ShellTakeOver.prototype = new oFF.DfProgram();
oFF.ShellTakeOver.prototype._ff_c = "ShellTakeOver";

oFF.ShellTakeOver.DEFAULT_PROGRAM_NAME = "takeover";
oFF.ShellTakeOver.prototype.newProgram = function()
{
	var newPrg = new oFF.ShellTakeOver();
	newPrg.setup();
	return newPrg;
};
oFF.ShellTakeOver.prototype.doSetupProgramMetadata = function(metadata)
{
	oFF.DfProgram.prototype.doSetupProgramMetadata.call( this , metadata);
	metadata.addParameter("program", "the program to run");
	metadata.addParameter("containerId", "the id of the container to be hijacked");
};
oFF.ShellTakeOver.prototype.runProcess = function()
{
	this.println("Rendering...");
	var containerId = this.getArgumentStructure().getStringByKey("containerId");
	var program = this.getArgumentStructure().getStringByKey("program");
	if (oFF.XStringUtils.isNullOrEmpty(containerId))
	{
		containerId = "content";
	}
	if (oFF.XStringUtils.isNullOrEmpty(program))
	{
		program = "FireflyStudio";
	}
	this.doHijack(containerId, program);
	var newArgs = oFF.ProgramArgs.create();
	var startCfgBase = oFF.ProgramStartCfg.create(this.getProcess(), program, null, newArgs);
	startCfgBase.setIsNewConsoleNeeded(true);
	startCfgBase.setIsCreatingChildProcess(false);
	startCfgBase.setEnforcedOutputDevice(oFF.ProgramDevice.EMBEDDED);
	startCfgBase.setNativeAnchorId(containerId);
	startCfgBase.processExecution(oFF.SyncType.NON_BLOCKING, null, null);
	this.exitNow(0);
	return false;
};
oFF.ShellTakeOver.prototype.doHijack = function(containerId, program)
{
	this.println("No native code. Please implement native hijack process!");
};

oFF.ShellWget = function() {};
oFF.ShellWget.prototype = new oFF.DfProgram();
oFF.ShellWget.prototype._ff_c = "ShellWget";

oFF.ShellWget.DEFAULT_PROGRAM_NAME = "wget";
oFF.ShellWget.prototype.m_url = null;
oFF.ShellWget.prototype.m_uriObj = null;
oFF.ShellWget.prototype.doSetupProgramMetadata = function(metadata)
{
	oFF.DfProgram.prototype.doSetupProgramMetadata.call( this , metadata);
	metadata.addParameter("url", "The url to get");
};
oFF.ShellWget.prototype.newProgram = function()
{
	var newPrg = new oFF.ShellWget();
	newPrg.setup();
	return newPrg;
};
oFF.ShellWget.prototype.evalArguments = function()
{
	oFF.DfProgram.prototype.evalArguments.call( this );
	this.m_url = this.getArgumentStructure().getStringByKey("url");
};
oFF.ShellWget.prototype.runProcess = function()
{
	this.m_uriObj = oFF.XUri.createFromUrl(this.m_url);
	this.log2("Connecting to ", this.m_uriObj.toString());
	var httpClient = oFF.HttpClientFactory.newInstanceByConnection(this.getSession(), this.m_uriObj);
	if (oFF.notNull(httpClient))
	{
		var request = httpClient.getRequest();
		request.setFromUri(this.m_uriObj);
		httpClient.processHttpRequest(oFF.SyncType.BLOCKING, this, null);
	}
	else
	{
		this.println("Cannot create connection");
	}
	this.exitNow(0);
	return false;
};
oFF.ShellWget.prototype.onHttpResponse = function(extResult, response, customIdentifier)
{
	if (extResult.isValid())
	{
		var data = extResult.getData();
		if (oFF.notNull(data))
		{
			var output = data.getString();
			this.println(output);
		}
		else
		{
			this.println("No data available");
		}
	}
	else
	{
		this.log(extResult.getSummary());
	}
};

oFF.ShellWhoami = function() {};
oFF.ShellWhoami.prototype = new oFF.DfProgram();
oFF.ShellWhoami.prototype._ff_c = "ShellWhoami";

oFF.ShellWhoami.DEFAULT_PROGRAM_NAME = "whoami";
oFF.ShellWhoami.USER_ID = "userid";
oFF.ShellWhoami.TITLE = "title";
oFF.ShellWhoami.LAST_NAME = "lastname";
oFF.ShellWhoami.FIRST_NAME = "firstname";
oFF.ShellWhoami.FULL_NAME = "fullname";
oFF.ShellWhoami.DISPLAY_NAME = "display";
oFF.ShellWhoami.DEPARTMENT = "department";
oFF.ShellWhoami.DESCRIPTION = "description";
oFF.ShellWhoami.COST_CENTER = "costCenter";
oFF.ShellWhoami.ROOM_NUMBER = "roomNumber";
oFF.ShellWhoami.DELIVERY_OFFICE_NAME = "deliveryoffice";
oFF.ShellWhoami.COUNTRY = "country";
oFF.ShellWhoami.REGION = "region";
oFF.ShellWhoami.CITY = "city";
oFF.ShellWhoami.ZIP_CODE = "zip";
oFF.ShellWhoami.STREET_NAME = "street";
oFF.ShellWhoami.EMAIL = "mail";
oFF.ShellWhoami.PHONE_NUMBER = "phone";
oFF.ShellWhoami.FAX_NUMBER = "fax";
oFF.ShellWhoami.MOBILE = "mobile";
oFF.ShellWhoami.SAP_NAME = "sapName";
oFF.ShellWhoami.MANAGER = "manager";
oFF.ShellWhoami.THUMBNAIL_PHOTO = "thumbnail";
oFF.ShellWhoami.DATA_ACCESS_LANGUAGE = "datalanguage";
oFF.ShellWhoami.LANGUAGE = "language";
oFF.ShellWhoami.COMPANY = "company";
oFF.ShellWhoami.HOME_DIR = "unixdir";
oFF.ShellWhoami.ACCOUNT_TYPE = "accounttype";
oFF.ShellWhoami.USER_ENABLED = "enabled";
oFF.ShellWhoami.TELEPHONE_ASSISTANT = "assistentphone";
oFF.ShellWhoami.EXCHANGE_USAGE_LOCATION = "exchange";
oFF.ShellWhoami.SAP_OBJECT_STATUS = "sapobjectstatus";
oFF.ShellWhoami.DATE_FORMAT = "dateformat";
oFF.ShellWhoami.DECIMAL_FORMAT = "decimalformat";
oFF.ShellWhoami.TIME_FORMAT = "timeformat";
oFF.ShellWhoami.USR_NAME = "username";
oFF.ShellWhoami.prototype.m_buffer = null;
oFF.ShellWhoami.prototype.m_command = null;
oFF.ShellWhoami.prototype.m_isVerbose = false;
oFF.ShellWhoami.prototype.m_key = null;
oFF.ShellWhoami.prototype.m_value = null;
oFF.ShellWhoami.prototype.m_user = null;
oFF.ShellWhoami.prototype.doSetupProgramMetadata = function(metadata)
{
	oFF.DfProgram.prototype.doSetupProgramMetadata.call( this , metadata);
	metadata.addParameter("command", " The command. Can be 'set', 'save' or 'display'. Default is display.");
	metadata.addParameterList("params", "For 'set': name value");
	metadata.addOption("verbose", "When set to true, the keys are displayed", "true|false", oFF.XValueType.BOOLEAN);
};
oFF.ShellWhoami.prototype.newProgram = function()
{
	var newPrg = new oFF.ShellWhoami();
	newPrg.setup();
	return newPrg;
};
oFF.ShellWhoami.prototype.evalArguments = function()
{
	oFF.DfProgram.prototype.evalArguments.call( this );
	var args = this.getArgumentStructure();
	this.m_command = args.getStringByKey("command");
	var cmdParams = args.getListByKey("params");
	if (oFF.XString.isEqual(this.m_command, "set"))
	{
		if (cmdParams.size() > 0)
		{
			this.m_key = cmdParams.getStringAt(0);
		}
		if (cmdParams.size() > 1)
		{
			this.m_value = cmdParams.getStringAt(1);
		}
	}
	this.m_isVerbose = args.getBooleanByKeyExt("verbose", false);
};
oFF.ShellWhoami.prototype.runProcess = function()
{
	var doExit = true;
	this.m_user = this.getProcess().getUserProfile();
	if (oFF.XString.isEqual(this.m_command, "set"))
	{
		if (this.m_user.getServiceApiLevel() !== oFF.ServiceApiLevel.PERSONALIZATION)
		{
			this.println("Sorry, your current user profile is read-only and cannot be changed.");
		}
		else if (oFF.XStringUtils.isNullOrEmpty(this.m_key))
		{
			this.println("Key required (set key value). Set -verbose to see all keys.");
		}
		else if (oFF.XStringUtils.isNullOrEmpty(this.m_value))
		{
			this.println("Value required (set key value).");
		}
		else
		{
			if (oFF.XString.isEqual(this.m_key, oFF.ShellWhoami.TITLE))
			{
				this.m_user.setTitle(this.m_value);
			}
			else if (oFF.XString.isEqual(this.m_key, oFF.ShellWhoami.FIRST_NAME))
			{
				this.m_user.setFirstName(this.m_value);
			}
			else if (oFF.XString.isEqual(this.m_key, oFF.ShellWhoami.LAST_NAME))
			{
				this.m_user.setLastName(this.m_value);
			}
			else if (oFF.XString.isEqual(this.m_key, oFF.ShellWhoami.FULL_NAME))
			{
				this.m_user.setFullName(this.m_value);
			}
			else if (oFF.XString.isEqual(this.m_key, oFF.ShellWhoami.DISPLAY_NAME))
			{
				this.m_user.setDisplayName(this.m_value);
			}
			else if (oFF.XString.isEqual(this.m_key, oFF.ShellWhoami.SAP_NAME))
			{
				this.m_user.setSAPName(this.m_value);
			}
			else if (oFF.XString.isEqual(this.m_key, oFF.ShellWhoami.DESCRIPTION))
			{
				this.m_user.setDescription(this.m_value);
			}
			else if (oFF.XString.isEqual(this.m_key, oFF.ShellWhoami.LANGUAGE))
			{
				this.m_user.setLanguage(this.m_value);
			}
			else if (oFF.XString.isEqual(this.m_key, oFF.ShellWhoami.DATA_ACCESS_LANGUAGE))
			{
				this.m_user.setDataAccessLanguage(this.m_value);
			}
			else if (oFF.XString.isEqual(this.m_key, oFF.ShellWhoami.COMPANY))
			{
				this.m_user.setCompany(this.m_value);
			}
			else if (oFF.XString.isEqual(this.m_key, oFF.ShellWhoami.ROOM_NUMBER))
			{
				this.m_user.setRoomNumber(this.m_value);
			}
			else if (oFF.XString.isEqual(this.m_key, oFF.ShellWhoami.STREET_NAME))
			{
				this.m_user.setStreetName(this.m_value);
			}
		}
	}
	else if (oFF.XString.isEqual(this.m_command, "save"))
	{
		var subSystemContainer = this.getProcess().getKernel().getSubSystemContainer(oFF.SubSystemType.USER_PROFILE);
		var adminApi = subSystemContainer.getAdminApi();
		if (adminApi.canUserProfileSaved() === false)
		{
			this.println("Sorry, your current user profile is read-only and cannot be saved.");
		}
		else
		{
			this.print("Saving the user profile...");
			doExit = false;
			adminApi.processUserProfileSave(null, this, null);
		}
	}
	else
	{
		this.m_buffer = oFF.TwoColumnBuffer.create();
		this.appendName("User", null, false, this.m_user.getName());
		this.appendBoolean("Enabled", null, this.m_user.isUserEnabledDefault(), this.m_user.getUserEnabled());
		this.appendName("Title", oFF.ShellWhoami.TITLE, this.m_user.isTitleDefault(), this.m_user.getTitle());
		this.appendName("First name", oFF.ShellWhoami.FIRST_NAME, this.m_user.isFirstNameDefault(), this.m_user.getFirstName());
		this.appendName("Last name", oFF.ShellWhoami.LAST_NAME, this.m_user.isLastNameDefault(), this.m_user.getLastName());
		this.appendName("Full name", oFF.ShellWhoami.FULL_NAME, this.m_user.isFullNameDefault(), this.m_user.getFullName());
		this.appendName("Display name", oFF.ShellWhoami.DISPLAY_NAME, this.m_user.isDisplayNameDefault(), this.m_user.getDisplayName());
		this.appendName("SAP name", oFF.ShellWhoami.SAP_NAME, this.m_user.isSAPNameDefault(), this.m_user.getSAPName());
		this.appendName("Description", oFF.ShellWhoami.DESCRIPTION, this.m_user.isDescriptionDefault(), this.m_user.getDescription());
		this.appendName("Language", oFF.ShellWhoami.LANGUAGE, this.m_user.isLanguageDefault(), this.m_user.getLanguage());
		this.appendName("Data access language", oFF.ShellWhoami.DATA_ACCESS_LANGUAGE, this.m_user.isDataAccessLanguageDefault(), this.m_user.getDataAccessLanguage());
		this.appendName("Company", oFF.ShellWhoami.COMPANY, this.m_user.isCompanyDefault(), this.m_user.getCompany());
		this.appendName("Room number", oFF.ShellWhoami.ROOM_NUMBER, this.m_user.isRoomNumberDefault(), this.m_user.getRoomNumber());
		this.appendName("Street name", oFF.ShellWhoami.STREET_NAME, this.m_user.isStreetNameDefault(), this.m_user.getStreetName());
		this.appendName("City code", "streetcode", this.m_user.isCityCodeDefault(), this.m_user.getCityCode());
		this.appendName("City name", "cityname", this.m_user.isCityNameDefault(), this.m_user.getCityName());
		this.appendName("Region", "region", this.m_user.isRegionDefault(), this.m_user.getRegion());
		this.appendName("Country", "country", this.m_user.isCountryDefault(), this.m_user.getCountry());
		this.appendName("Delivery office", "deliveryoffice", this.m_user.isDeliveryOfficeNameDefault(), this.m_user.getDeliveryOfficeName());
		this.appendName("Cost center", "costcenter", this.m_user.isCostCenterDefault(), this.m_user.getCostCenter());
		this.appendName("Cost center id", "costcenterid", this.m_user.isCostCenterIdDefault(), this.m_user.getCostCenterId());
		this.appendName("Department", "department", this.m_user.isDepartmentDefault(), this.m_user.getDepartment());
		this.appendName("Org Unit", "orgunit", this.m_user.isOrgUnitDefault(), this.m_user.getOrgUnit());
		this.appendName("Phone number", "phonenumber", this.m_user.isPhoneNumberDefault(), this.m_user.getPhoneNumber());
		this.appendName("Mobile phone", "mobile", this.m_user.isMobilePhoneNumberDefault(), this.m_user.getMobilePhoneNumber());
		this.appendName("Assistent phone", "assistentphone", this.m_user.isTelephoneAssistantDefault(), this.m_user.getTelephoneAssistant());
		this.appendName("Fax number", "fax", this.m_user.isFaxNumberDefault(), this.m_user.getFaxNumber());
		this.appendName("Email", "email", this.m_user.isEmailAddressDefault(), this.m_user.getEmailAddress());
		this.appendName("Email product update", "productupdateemail", this.m_user.isEmailProductUpdateNotificationDefault(), this.m_user.getEmailProductUpdateNotification());
		this.appendName("Email system notification", "sysnotifyemail", this.m_user.isEmailSystemNotificationDefault(), this.m_user.getEmailSystemNotification());
		this.appendName("Manager", "manager", this.m_user.isManagerPersonNumberDefault(), this.m_user.getManagerPersonNumber());
		this.appendName("Decimal separator", "decsep", this.m_user.isDecimalSeparatorDefault(), this.m_user.getDecimalSeparator());
		this.appendName("Decimal grouping", "decgroup", this.m_user.isDecimalGroupingSeparatorDefault(), this.m_user.getDecimalGroupingSeparator());
		this.appendName("Decimal formatting", "decformat", this.m_user.isDecimalFormatDefault(), this.m_user.getDecimalFormat());
		this.appendName("Decimal example", null, false, this.m_user.getDecimalFormatExample());
		this.appendName("Scale formatting", "scale", this.m_user.isScaleFormattingDefault(), this.m_user.getScaleFormatting());
		this.appendName("Timezone id", "timezoneid", this.m_user.isTimeZoneIdDefault(), this.m_user.getTimeZoneId());
		this.appendName("Date formatting", "dateformat", this.m_user.isDateFormattingDefault(), this.m_user.getDateFormatting());
		this.appendName("Encryption token", "crypttoken", this.m_user.isEncryptionTokenDefault(), this.m_user.getEncryptionToken());
		this.appendName("Cache schema", "cacheschema", this.m_user.isCacheSchemaDefault(), this.m_user.getCacheSchema());
		this.appendName("Currency position", "currencypos", this.m_user.isCurrencyPositionDefault(), this.m_user.getCurrencyPosition());
		this.appendName("System tenant id", null, this.m_user.isTenantIdDefault(), this.m_user.getTenantId());
		this.appendName("Unix home", "unixhome", this.m_user.isUnixHomeDirectoryDefault(), this.m_user.getUnixHomeDirectory());
		this.println("Default values defined on the top layer are marked with a '*'");
		this.print(this.m_buffer.toString());
	}
	if (doExit === true)
	{
		this.exitNow(0);
		return false;
	}
	else
	{
		return true;
	}
};
oFF.ShellWhoami.prototype.appendName = function(description, key, isDefault, value)
{
	this.m_buffer.append(description);
	if (this.m_isVerbose && oFF.notNull(key))
	{
		this.m_buffer.append(" [");
		this.m_buffer.append(key);
		this.m_buffer.append("]");
	}
	this.m_buffer.append(": ");
	if (isDefault === true)
	{
		this.m_buffer.append("(*) ");
	}
	this.m_buffer.nextColumn();
	this.m_buffer.append(value);
	this.m_buffer.appendNewLine();
	return this.m_buffer;
};
oFF.ShellWhoami.prototype.appendBoolean = function(description, key, isDefault, value)
{
	this.m_buffer.append(description);
	if (this.m_isVerbose && oFF.notNull(key))
	{
		this.m_buffer.append(" [");
		this.m_buffer.append(key);
		this.m_buffer.append("]");
	}
	this.m_buffer.append(": ");
	if (isDefault === true)
	{
		this.m_buffer.append("(*) ");
	}
	this.m_buffer.nextColumn();
	this.m_buffer.appendBoolean(value);
	this.m_buffer.appendNewLine();
	return this.m_buffer;
};
oFF.ShellWhoami.prototype.onUserProfileSaved = function(extResult, userProfile, customIdentifier)
{
	if (extResult.isValid())
	{
		this.println("done!");
	}
	else
	{
		this.println("ERROR:");
		this.println(extResult.getSummary());
	}
	this.exitNow(0);
};

oFF.ShellModule = function() {};
oFF.ShellModule.prototype = new oFF.DfModule();
oFF.ShellModule.prototype._ff_c = "ShellModule";

oFF.ShellModule.s_module = null;
oFF.ShellModule.getInstance = function()
{
	if (oFF.isNull(oFF.ShellModule.s_module))
	{
		oFF.DfModule.checkInitialized(oFF.KernelNativeModule.getInstance());
		oFF.ShellModule.s_module = oFF.DfModule.startExt(new oFF.ShellModule());
		oFF.ProgramRegistration.setProgramFactory(oFF.SerenityShell.DEFAULT_PROGRAM_NAME, new oFF.SerenityShell());
		oFF.ProgramRegistration.setProgramFactory(oFF.ShellCache.DEFAULT_PROGRAM_NAME, new oFF.ShellCache());
		oFF.ProgramRegistration.setProgramFactory(oFF.ShellCd.DEFAULT_PROGRAM_NAME, new oFF.ShellCd());
		oFF.ProgramRegistration.setProgramFactory(oFF.ShellDel.DEFAULT_PROGRAM_NAME, new oFF.ShellDel());
		oFF.ProgramRegistration.setProgramFactory(oFF.ShellDir.DEFAULT_PROGRAM_NAME, new oFF.ShellDir());
		oFF.ProgramRegistration.setProgramFactory(oFF.ShellGrep.DEFAULT_PROGRAM_NAME, new oFF.ShellGrep());
		oFF.ProgramRegistration.setProgramFactory(oFF.ShellHelp.DEFAULT_PROGRAM_NAME, new oFF.ShellHelp());
		oFF.ProgramRegistration.setProgramFactory(oFF.ShellKill.DEFAULT_PROGRAM_NAME, new oFF.ShellKill());
		oFF.ProgramRegistration.setProgramFactory(oFF.ShellListPrgs.DEFAULT_PROGRAM_NAME, new oFF.ShellListPrgs());
		oFF.ProgramRegistration.setProgramFactory(oFF.ShellMkdir.DEFAULT_PROGRAM_NAME, new oFF.ShellMkdir());
		oFF.ProgramRegistration.setProgramFactory(oFF.ShellProcesses.DEFAULT_PROGRAM_NAME, new oFF.ShellProcesses());
		oFF.ProgramRegistration.setProgramFactory(oFF.ShellRmdir.DEFAULT_PROGRAM_NAME, new oFF.ShellRmdir());
		oFF.ProgramRegistration.setProgramFactory(oFF.ShellSet.DEFAULT_PROGRAM_NAME, new oFF.ShellSet());
		oFF.ProgramRegistration.setProgramFactory(oFF.ShellTakeOver.DEFAULT_PROGRAM_NAME, new oFF.ShellTakeOver());
		oFF.ProgramRegistration.setProgramFactory(oFF.ShellWget.DEFAULT_PROGRAM_NAME, new oFF.ShellWget());
		oFF.ProgramRegistration.setProgramFactory(oFF.ShellWhoami.DEFAULT_PROGRAM_NAME, new oFF.ShellWhoami());
		oFF.DfModule.stopExt(oFF.ShellModule.s_module);
	}
	return oFF.ShellModule.s_module;
};
oFF.ShellModule.prototype.getName = function()
{
	return "ff2040.shell";
};

oFF.ShellModule.getInstance();

return sap.firefly;
	} );