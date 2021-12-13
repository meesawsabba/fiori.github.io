/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)
        (c) Copyright 2009-2021 SAP SE. All rights reserved
  
 */
/* eslint-disable no-console */

var fs = require("fs");

var XMLTemplateKeyWords = ["template", "FragmentDefinition"];

/**
 * @param dir
 * @returns {Promise}
 */
function pReaddir(dir) {
	"use strict";
	return new Promise(function(resolve, reject) {
		fs.readdir(dir, { withFileTypes: true }, function(err, items) {
			resolve(items);
		});
	});
}
/**
 * @param sFileName
 * @param sData
 * @param oOption
 * @returns {Promise}
 */
function pWriteFile(sFileName, sData, oOption) {
	"use strict";
	return new Promise(function(resolve, reject) {
		fs.writeFile(sFileName, sData, oOption, function(err) {
			if (err) {
				reject(err);
			} else {
				resolve();
			}
		});
	});
}
/**
 * @param sFile
 * @param options
 * @returns {Promise}
 */
function pReadFile(sFile, options) {
	"use strict";
	return new Promise(function(resolve, reject) {
		fs.readFile(sFile, options, function(err, data) {
			if (err) {
				reject(err);
			} else {
				resolve(data);
			}
		});
	});
}

/**
 * List recursively all files from a folder.
 * @param dir
 * @returns {Promise}
 */
function getFilesInDir(dir) {
	"use strict";
	return pReaddir(dir, { withFileTypes: true })
		.then(function(items) {
			if (items) {
				var pAllFiles = [];
				items.forEach(function(item) {
					if (item.isDirectory()) {
						pAllFiles = pAllFiles.concat(getFilesInDir(dir + "/" + item.name));
					} else {
						pAllFiles.push(Promise.resolve(dir + "/" + item.name));
					}
				});
				return Promise.all(pAllFiles);
			} else {
				return [];
			}
		})
		.then(function(items) {
			var afiles = [];
			items.forEach(function(item) {
				afiles = afiles.concat(item);
			});

			return afiles;
		});
}

/**
 * Retrieve the libraries from a definition file and store it in a Map.
 * @param sDirectoryPath
 * @param mLibrairies
 * @returns {Promise}
 */
function getLibrariesInDir(sDirectoryPath, mLibrairies) {
	"use strict";
	var sLibFileName = sDirectoryPath + "/.library";

	return pReadFile(sLibFileName, "utf8").then(function(sContent) {
		sContent.split("\n").forEach(function(sLine) {
			var aRes = sLine.match("<libraryName>(.*)</libraryName>");
			if (aRes !== null) {
				mLibrairies[aRes[1]] = "";
			}
		});
	});
}

/**
 * Scans script (JS/TS) files for references.
 * @param sFileName
 * @param oComponents
 * @returns {Promise}
 */
function processScriptFile(sFileName, oComponents) {
	"use strict";
	if (sFileName.indexOf("library.js") === -1 && sFileName.indexOf(".designtime.") === -1 && sFileName.indexOf(".support.") === -1) {
		// Ignore library and design-time files
		var sComponent = sFileName.substring(sFileName.indexOf("src/") + 4).replace(/\.[jt]s$/, "");
		oComponents[sComponent] = "";

		if (sFileName.endsWith(".js")) {
			return pReadFile(sFileName, "utf8").then(function(sJSCode) {
				process.stdout.write("Processing JS/TS file :" + sFileName + "\n");
				// Look for modules loaded using sap.ui.define
				var aModules = sJSCode.match(/sap.ui.define\(\s*\[([^\]]*)\]/);
				if (aModules) {
					var aModuleNames = aModules[1].split(",");
					aModuleNames.forEach(function(sModuleName) {
						if (sModuleName) {
							// Remove double quotes
							var a = sModuleName.match(/"([^"]*)"/);
							if (a && a[1].indexOf(".") < 0 && !a[1].startsWith("/sap/fe/")) {
								// script files from sap.fe are already processed directly --> we only look for files outside of sap.fe
								process.stdout.write("\tComponent :" + a[1] + "\n");
								oComponents[a[1]] = sFileName;
							}
						}
					});
				}
			});
		}
	}

	return null;
}

/**
 * Adds fragments files into a Map.
 * @param sFileName
 * @param aFragmentFiles
 */
function addFragmentFile(sFileName, aFragmentFiles) {
	"use strict";
	var sFragmentFileName = sFileName.substring(sFileName.indexOf("src/") + 4).replace(".fragment.xml", "");

	aFragmentFiles.push(sFragmentFileName);
}

/**
 * Get all components from an XML view and store it into a Map.
 * @param sFileName
 * @param oComponents
 * @returns {Promise}
 */
function processXMLFile(sFileName, oComponents) {
	"use strict";
	return pReadFile(sFileName, "utf8").then(function(sXml) {
		var aXmlSplitted = sXml.split("\n");
		process.stdout.write("Processing XML file :" + sFileName + "\n");
		aXmlSplitted.forEach(function(sLine) {
			var aModule = sLine.match(/xmlns:{0,1}([a-zA-Z]*)="([a-zA-Z.]*)"/);
			if (aModule) {
				var sLibrary = aModule[2];
				var sLibraryAlias = aModule[1] ? aModule[1] + ":" : "";
				aXmlSplitted.forEach(function(sLine2) {
					var aComponent = sLine2.match("<" + sLibraryAlias + "([A-Z][a-zA-Z.]*)(\r|$| |>)");
					if (aComponent && XMLTemplateKeyWords.indexOf(aComponent[1]) === -1) {
						var sComponent = sLibrary.replace(/\./g, "/") + "/" + aComponent[1] + "";
						if (sComponent.indexOf("sap/fe/") === -1) {
							// script files from sap.fe are already processed directly --> we only look for files outside of sap.fe
							oComponents[sComponent] = sFileName;
							process.stdout.write("\tComponent :" + sComponent + "\n");
						}
					}
				});
			}
		});
	});
}

/**
 * @param sFileName
 * @param mComponents
 * @param aFragmentFiles
 * @returns {Promise}
 */
function processSingleFile(sFileName, mComponents, aFragmentFiles) {
	"use strict";
	var oFilePromise;

	sFileName = sFileName.replace(/\\/g, "/");

	if (sFileName.endsWith(".xml")) {
		oFilePromise = processXMLFile(sFileName, mComponents);
		if (sFileName.endsWith("fragment.xml")) {
			addFragmentFile(sFileName, aFragmentFiles);
		}
	} else if (sFileName.endsWith(".js") || sFileName.endsWith(".ts")) {
		oFilePromise = processScriptFile(sFileName, mComponents);
	}

	return oFilePromise;
}

/**
 * @param aFileNames
 * @param mComponents
 * @param aFragmentFiles
 * @returns {Promise}
 */
function processFiles(aFileNames, mComponents, aFragmentFiles) {
	"use strict";
	var aPromises = [];

	for (var I = 0; I < aFileNames.length; I++) {
		var oFilePromise = processSingleFile(aFileNames[I], mComponents, aFragmentFiles);
		if (oFilePromise) {
			aPromises.push(oFilePromise);
		}
	}

	return Promise.all(aPromises);
}

function main() {
	"use strict";
	if (process.argv.length < 3) {
		process.stdout.write("missing parameters. Please use --help\n");
		return;
	} else if (process.argv[2] === "--help") {
		process.stdout.write(
			"Usage: getDependencies <dir1> <dir2> ... , where <dirN> is a path to a directory to look for XML views and FE components (javascript files)\n"
		);
		return;
	}

	var aDirectories = [],
		sOutDir = "./",
		mComponents = { "sap/m/routing/Router": "", "sap/f/routing/Router": "", "sap/ui/model/odata/v4/ODataModel": "" },
		mLibraries = { "sap.fe.templates": "" },
		aPromises = [],
		aFragmentFiles = [];

	for (var I = 2; I < process.argv.length; I++) {
		if (process.argv[I] !== "--out-dir") {
			aDirectories.push(process.argv[I]);
		} else if (I < process.argv.length - 1) {
			I++;
			sOutDir = process.argv[I];
		}
	}

	if (!sOutDir.endsWith("/")) {
		sOutDir += "/";
	}

	aDirectories.forEach(function(sDirectoryPath) {
		// Parse the .library file
		aPromises.push(getLibrariesInDir(sDirectoryPath, mLibraries));

		// Get all files in the directory and process them
		aPromises.push(
			getFilesInDir(sDirectoryPath).then(function(aFilesInDir) {
				return processFiles(aFilesInDir, mComponents, aFragmentFiles);
			})
		);
	});

	Promise.all(aPromises)
		.then(function() {
			// Create output files
			pWriteFile(sOutDir + "libraries.json", JSON.stringify(Object.keys(mLibraries)), "utf-8");
			pWriteFile(sOutDir + "components.json", JSON.stringify(Object.keys(mComponents)), "utf-8");
			pWriteFile(sOutDir + "fragments.json", JSON.stringify(aFragmentFiles), "utf-8");
		})
		.catch(function(error) {
			process.stderr.write("Error (" + error.code + "): " + error.message + "\n");
		});
}

main();
