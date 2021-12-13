/*!
 * SAPUI5
 * (c) Copyright 2009-2021 SAP SE. All rights reserved.
 */

sap.ui.define([
	'sap/base/Log',
	'sap/ui/core/Core',
	'sap/ui/export/ExportBase',
	'sap/ui/export/ExportUtils',
	'sap/ui/model/odata/v4/ODataModel'
], function(Log, Core, ExportBase, ExportUtils, ODataModel) {
	'use strict';

	/**
	 * @constructor The <code>sap.ui.export.PortableDocument</code> class allows you to export table data from a UI5 application to a Portable Document Format (*.PDF) file.
	 *
	 * @author SAP SE
	 * @version 1.96.0
	 *
	 * @since 1.96
	 * @name sap.ui.export.PortableDocument
	 * @extends sap.ui.base.ExportBase
	 * @private
	 */
	var PortableDocument = ExportBase.extend('sap.ui.export.PortableDocument', {

		constructor: function(mSettings) {
			ExportBase.call(this, mSettings);
		}
	});

	/**
	 * Sets the data source configuration that will be used for exporting the data. If the passed parameter is null,
	 * the call will be ignored.
	 *
	 * @param {Object|sap.ui.model.ListBinding|sap.ui.model.TreeBinding} oDataSource Possible types are a data
	 * source configuration, a <code>sap.ui.model.ListBinding</code> or <code>sap.ui.model.TreeBinding</code>
	 * @returns {Object|null} - Valid dataSource object or null in case the dataSource configuration is not supported
	 *
	 * @since 1.96
	 * @public
	 */
	PortableDocument.prototype.processDataSource = function(oDataSource) {
		var mDataSource = null;
		var sDataSourceType = typeof oDataSource;

		if (!oDataSource) {
			return null;
		}

		if (sDataSourceType != 'object') {
			Log.error('Spreadsheet#processDataSource: Unable to apply data source of type ' + sDataSourceType);

			return null;
		}

		if (oDataSource.dataUrl && oDataSource.serviceUrl) {
			mDataSource = oDataSource;
		}

		if (oDataSource.isA && oDataSource.isA(['sap.ui.model.ListBinding', 'sap.ui.model.TreeBinding'])) {
			mDataSource = this.createDataSourceFromBinding(oDataSource);
		}

		return mDataSource;
	};

	/**
	 * Creates a valid dataSource configuration
	 *
	 * @param {sap.ui.model.ListBinding|sap.ui.model.TreeBinding} oBinding - A subclass of <code>sap.ui.model.ListBinding</code> or <code>sap.ui.model.TreeBinding</code>
	 * @returns {Object} - Valid data source configuration built upon the ListBinding
	 */
	 PortableDocument.prototype.createDataSourceFromBinding = function(oBinding) {

		/**
		 * Use empty array as default in case of <code>ListBinding</code> is not of type
		 * ClientListBinding and does not provide a getDownloadUrl function
		 */
		var oDataSource = null;

		/**
		 * If <code>ClientListBinding</code>, we use the binding path to receive the data from the underlying model
		 */
		if (oBinding.isA('sap.ui.model.ClientListBinding')) {
			Log.error('Unable to create dataSource configuration due to not supported Binding: ' + oBinding.getMetadata().getName());
		}

		if (oBinding.isA('sap.ui.model.ClientTreeBinding')) {
			Log.error('Unable to create dataSource configuration due to not supported Binding: ' + oBinding.getMetadata().getName());
		}

		/**
		 * All other <code>Bindings</code> need to provide a downloadUrl
		 */
		if (typeof oBinding.getDownloadUrl === 'function') {
			var oModel = oBinding.getModel(),
				sDataUrl = ExportUtils.interceptUrl(oBinding.getDownloadUrl('json')),
				sServiceUrl = ExportUtils.interceptUrl(oModel.sServiceUrl),
				bV4ODataModel = oModel.isA('sap.ui.model.odata.v4.ODataModel');

			var oDataUrl = new URL(sDataUrl, document.baseURI);
			oDataUrl.hash = '';
			oDataUrl.search = '';

			oDataSource = {
				type: 'odata',
				version: bV4ODataModel ? 4 : 2,
				dataUrl: oDataUrl.toString(),
				serviceUrl: sServiceUrl.split('/').slice(0, -4).join("/") + "/iwbep/common/0001/", // Requires the serviceUrl to end with a /
				headers: bV4ODataModel ?  oModel.getHttpHeaders(true) : oModel.getHeaders()
			};
		}

		return oDataSource;
	};

	/**
	 * Creates the DocumentDescription based on the given export
	 * settings and assigns a unique Id to it.
	 *
	 * @param {Object} oWorkbook Workbook settings of the export configuration
	 * @returns {Object} DocumentDescription object that contains all relevant export settings
	 * @private
	 */
	PortableDocument.prototype._createDocumentDescription = function(oWorkbook) {
		var oDocumentDescription, oMetaInfo;

		oDocumentDescription = {
			"Title": oWorkbook.context.title,
			"Format": {
				"PaperSize": "DIN_A4",
				"Orientation": "LANDSCAPE",
				"FontSize": 12
			},
			"CoverPage": [],
			"TableColumns": []
		};

		oMetaInfo = oWorkbook.context.metaInfo;

		/* Add metaInfo to CoverPage */
		if (oMetaInfo instanceof Array) {
			oMetaInfo.forEach(function(oGroup) {
				var oCoverPageGroup = {
					"Title": oGroup.name,
					"Content": []
				};

				oGroup.items.forEach(function(oItem) {
					oCoverPageGroup["Content"].push({
						"Name": oItem.key,
						"Value": oItem.value
					});
				});
				oDocumentDescription["CoverPage"].push(oCoverPageGroup);
			});
		}

		/* Add columns */
		oWorkbook.columns.forEach(function(oColumn){
			oDocumentDescription["TableColumns"].push({
				"Name": oColumn.property,
				"Header": oColumn.label
			});
		});

		return oDocumentDescription;
	};

	/**
	 * Applies default settings to the export configuration.
	 *
	 * @param {Object} mSettings Export configuration object
	 * @returns {Promise} Promise that gets resolved when the default settings have been applied
	 */
	PortableDocument.prototype.setDefaultExportSettings = function(mSettings) {
		var oContext = mSettings && mSettings.workbook && mSettings.workbook.context;

		if (!(oContext instanceof Object)) {
			oContext = mSettings.workbook.context = {};
		}

		if (typeof oContext.title === 'string') {
			return Promise.resolve();
		}

		return Core.getLibraryResourceBundle('sap.ui.export', true).then(function(oResourceBundle) {
			oContext.title = oResourceBundle.getText('XLSX_DEFAULT_TITLE');
		});
	};

	PortableDocument.prototype.createBuildPromise = function(mSettings) {
		var that = this;
		return new Promise(function(fnResolve, fnReject) {
			var oBinding, oDocumentDescription, oModel;

			oDocumentDescription = that._createDocumentDescription(mSettings.workbook);

			/* Create COMMON service model and bind to MyDocumentDescription entity */
			oModel = new ODataModel({
				serviceUrl: mSettings.dataSource.serviceUrl,
				synchronizationMode: 'None'
			});

			oBinding = oModel.bindList('/MyDocumentDescriptions');
			oBinding.attachCreateCompleted(function(oEvent) {
				var success = oEvent.getParameter('success');

				if (success) {
					fnResolve(oEvent.getParameter('context').getObject()['Id']);
				} else {
					fnReject();
				}
			});

			oBinding.create(oDocumentDescription);

		}).then(function(sDocumentDescriptionId) {
			return that.sendRequest(mSettings.dataSource.dataUrl, sDocumentDescriptionId).then(function(response) {
				ExportUtils.saveAsFile(response, mSettings.fileName);
			});
		});
	};

	/**
	 * Requests the generated PDF via HTTP GET from the OData service.
	 *
	 * @param {string} sUrl Absolute data URL of the OData entity that should be exported as PDF
	 * @param {string} sDocumentDescriptionId GUID of the DocumentDescription that should be used for creating the PDF
	 * @returns {Promise} A Promise that gets resolved after the XHR request
	 */
	PortableDocument.prototype.sendRequest = function(sUrl, sDocumentDescriptionId) {
		return new Promise(function(fnResolve, fnReject) {
			var oXHR = this.request = new XMLHttpRequest();

			/* Send GET request to receive PDF file */
			oXHR.open('GET', sUrl);
			oXHR.responseType = 'blob';
			oXHR.setRequestHeader("Accept", "application/pdf");
			oXHR.setRequestHeader("SAP-Document-Description-Id", sDocumentDescriptionId);

			oXHR.addEventListener('abort', function() {
				fnReject('Request aborted');
			});

			oXHR.addEventListener('error', function() {
				fnReject('Error occured while requesting data');
			});

			oXHR.addEventListener('load', function() {
				var status = oXHR.status;

				if (status >= 200 && status <= 400) {
					fnResolve(oXHR.response);
				} else {
					fnReject(oXHR.response);
				}
			});

			oXHR.send();
		}.bind(this));
	};

	/**
	 * Cancels the active request. If the request has not been sent
	 * or the response has been received already, this function has
	 * no effect.
	 *
	 * @function
	 * @name sap.ui.export.PortableDocument#cancel
	 * @since 1.96
	 * @public
	 */
	PortableDocument.prototype.cancel = function() {
		if (this.request && this.request.readyState != XMLHttpRequest.DONE) {
			this.request.abort();
			this.request = null;
		}
	};

	return PortableDocument;
});