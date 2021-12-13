/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)
        (c) Copyright 2009-2021 SAP SE. All rights reserved
  
 */
sap.ui.define(["sap/base/util/LoaderExtensions", "sap/base/Log"], function(LoaderExtensions, Log) {
	"use strict";

	var START_DELAY = 1000;
	var CHUNK_SIZE = 5;
	var CHUNK_INTERVAL = 1000;

	var FilePreload = {
		/**
		 * Checks if a given module is already loaded by the UI5 loader.
		 *
		 * @param {string} sPath Path of the module
		 * @returns {boolean} True or False
		 */
		_isModuleLoaded: function(sPath) {
			var aSegments = sPath.split("/"),
				oContext = window,
				i = 0;

			while (i < aSegments.length && oContext) {
				oContext = oContext[aSegments[i]];
				i++;
			}

			return oContext !== undefined;
		},

		/**
		 * Loads a collection of libraries.
		 *
		 * @param {Array} aLibraries Array of library names
		 * @returns {Promise} Promise resolved once the libraries are loaded
		 */
		_loadLibraries: function(aLibraries) {
			return this._waitUntilHomeIsDisplayed()
				.then(function() {
					return sap.ui.getCore().loadLibraries(aLibraries);
				})
				.catch(function(oError) {
					Log.error("sap.fe.plugins.Preload: Error while preloading libraries - " + oError.message);
				});
		},

		/**
		 * Loads a collaction of modules using a chunked approach.
		 *
		 * @param {Array} aModuleList List of (modules) paths
		 * @returns {Promise} Promise resolved when all chunks are loaded
		 */
		_loadModulesByChunks: function(aModuleList) {
			// Remove modules that are already loaded
			var i;
			for (i = aModuleList.length - 1; i >= 0; i--) {
				var sModuleName = aModuleList[i];
				if (this._isModuleLoaded(sModuleName)) {
					aModuleList.splice(i, 1);
				}
			}

			// Create chunks
			var aTotalSize = aModuleList.length,
				chunkCount = Math.ceil(aTotalSize / this.iChunkSize);

			if (chunkCount === 0) {
				return Promise.resolve();
			} else {
				var aChunks = [],
					that = this;
				for (i = 0; i < chunkCount; i++) {
					aChunks.push(aModuleList.slice(i * this.iChunkSize, i * this.iChunkSize + this.iChunkSize));
				}

				// Start the chunk load
				return new Promise(function(resolve, reject) {
					that._processChunk(aChunks, 0, resolve);
				});
			}
		},

		/**
		 * Loads a file chunk.
		 *
		 * @param {Array} aChunks All files chunks
		 * @param {number} iChunkIndex File chunk to load
		 * @param {Function} fnResolve Resolve function to be called when all chunks are loaded
		 */
		_processChunk: function(aChunks, iChunkIndex, fnResolve) {
			var that = this;

			if (iChunkIndex >= aChunks.length) {
				fnResolve();
			} else {
				var aChunkData = aChunks[iChunkIndex];
				that._waitUntilHomeIsDisplayed()
					.then(function() {
						sap.ui.require(
							aChunkData,
							function(oEvent) {
								Log.debug(
									"sap.fe.plugins.Preload: Chunk [" + iChunkIndex + "] loaded (" + JSON.stringify(aChunkData) + ")"
								);
								// Load next chunk after delay
								setTimeout(function() {
									that._processChunk(aChunks, iChunkIndex + 1, fnResolve);
								}, that.iChunkInterval);
							},
							function() {
								Log.error("sap.fe.plugins.Preload: failed to load library chunk: " + JSON.stringify(aChunkData));
								// Load next chunk after delay
								setTimeout(function() {
									that._processChunk(aChunks, iChunkIndex + 1, fnResolve);
								}, that.iChunkInterval);
							}
						);
					})
					.catch(function() {
						// Unknown error, this shouldn't happen
						Log.error("sap.fe.plugins.Preload: unknown error - Aborting");
						fnResolve();
					});
			}
		},

		/**
		 * Waits until the FLP home page is displayed on the screen.
		 *
		 * @returns {Promise} Resolved when the Home page is displayed
		 */
		_waitUntilHomeIsDisplayed: function() {
			var fnResolve;

			function onAppLoaded() {
				var ALFService = sap.ushell.Container.getService("AppLifeCycle"),
					bIsHomePage = ALFService.getCurrentApplication().homePage;

				if (bIsHomePage) {
					// We're back on the home page, we can resume _processChunks
					ALFService.detachAppLoaded(onAppLoaded);
					Log.info("sap.fe.plugins.Preload: preload resumed");

					fnResolve();
				}
			}

			if (sap.ushell.Container.getService("AppLifeCycle").getCurrentApplication().homePage === false) {
				// An app has been loaded --> return a Promise that will be resolved when the home page is displayed again
				Log.info("sap.fe.plugins.Preload: preload paused");
				return new Promise(function(resolve, reject) {
					sap.ushell.Container.getService("AppLifeCycle").attachAppLoaded(onAppLoaded);
					fnResolve = resolve;
				});
			} else {
				return Promise.resolve();
			}
		},

		/**
		 * Starts the preload process.
		 *
		 * @param {object} oConfig
		 * @param {number} oConfig.startUpDelay Interval (in ms) before we start the preload process
		 * @param {number} oConfig.chunkSize Size of the chunks (number of files loaded at the same time)
		 * @param {number} oConfig.chunkInterval Interval (in ms) between 2 chunk load
		 */
		start: function(oConfig) {
			var startUpDelay = oConfig.startUpDelay || START_DELAY,
				that = this;

			this.iChunkSize = oConfig.chunkSize || CHUNK_SIZE;
			this.iChunkInterval = oConfig.chunkInterval || CHUNK_INTERVAL;

			setTimeout(function() {
				Log.info("sap.fe.plugins.Preload: preload starting");

				var aPreloadList = LoaderExtensions.loadResource("/sap/fe/plugins/preload/data/components.json"),
					aLibraries = LoaderExtensions.loadResource("/sap/fe/plugins/preload/data/libraries.json");

				that._loadLibraries(aLibraries)
					.then(function() {
						return that._loadModulesByChunks(aPreloadList);
					})
					.then(function() {
						Log.info("sap.fe.plugins.Preload: preload finished");
					})
					.catch(function(oError) {
						Log.error("sap.fe.plugins.Preload: Error while preloading data - " + oError.message);
					});
			}, startUpDelay);
		}
	};

	return FilePreload;
});
