import { PhantomUtil } from "sap/fe/macros";
import { _MetadataRequestor } from "sap/ui/model/odata/v4/lib";
import { ODataMetaModel } from "sap/ui/model/odata/v4";
import { XMLPreprocessor } from "sap/ui/core/util";
import { Log } from "sap/base";
import xpath from "xpath";
import * as fs from "fs";
import { compileSources, to } from "@sap/cds-compiler";
import { format } from "prettier";
import { BindingParser } from "sap/ui/base";
import { AnyAnnotation, ConverterOutput, EntitySet, Property } from "@sap-ux/annotation-converter";
import { DataModelObjectPath } from "sap/fe/core/templating/DataModelPathHelper";
import { JSONModel } from "sap/ui/model/json";
import { InvisibleText } from "sap/ui/core";
import { ListReportManifestSettings, ObjectPageManifestSettings } from "sap/fe/core/converters/ManifestSettings";
import { IssueCategory, IssueSeverity } from "sap/fe/core/converters/helpers/IssueManager";
import { IDiagnostics } from "sap/fe/core/converters/TemplateConverter";
import { merge } from "sap/base/util";
import * as path from "path";
import ConverterContext from "sap/fe/core/converters/ConverterContext";
import SideEffectsFactory from "sap/fe/core/services/SideEffectsServiceFactory";

Log.setLevel(1 as any, "sap.ui.core.util.XMLPreprocessor");
jest.setTimeout(40000);

const nameSpaceMap = {
	"macros": "sap.fe.macros",
	"macro": "sap.fe.macros",
	"macrodata": "http://schemas.sap.com/sapui5/extension/sap.ui.core.CustomData/1",
	"log": "http://schemas.sap.com/sapui5/extension/sap.ui.core.CustomData/1",
	"unittest": "http://schemas.sap.com/sapui5/preprocessorextension/sap.fe.unittesting/1",
	"control": "sap.fe.core.controls",
	"core": "sap.ui.core",
	"m": "sap.m",
	"f": "sap.ui.layout.form",
	"mdc": "sap.ui.mdc",
	"mdcField": "sap.ui.mdc.field",
	"u": "sap.ui.unified",
	"macroMicroChart": "sap.fe.macros.microchart",
	"microChart": "sap.suite.ui.microchart"
};
const select = xpath.useNamespaces(nameSpaceMap);

export const registerMacro = function(macroMetadata: any) {
	PhantomUtil.register(macroMetadata);
};
export const unregisterMacro = function(macroMetadata: any) {
	XMLPreprocessor.plugIn(null, macroMetadata.namespace, macroMetadata.name);
	if (macroMetadata.publicName) {
		XMLPreprocessor.plugIn(null, macroMetadata.publicNamespace, macroMetadata.publicName);
	}
};
export const runXPathQuery = function(selector: string, xmldom: Node | undefined) {
	return select(selector, xmldom);
};

expect.extend({
	toHaveControl(xmldom, selector) {
		const nodes = runXPathQuery(`/root${selector}`, xmldom);
		return {
			message: () => {
				const outputXml = serializeXML(xmldom);
				return `did not find controls matching ${selector} in generated xml:\n ${outputXml}`;
			},
			pass: nodes && nodes.length >= 1
		};
	},
	toNotHaveControl(xmldom, selector) {
		const nodes = runXPathQuery(`/root${selector}`, xmldom);
		return {
			message: () => {
				const outputXml = serializeXML(xmldom);
				return `There is a control matching ${selector} in generated xml:\n ${outputXml}`;
			},
			pass: nodes && nodes.length === 0
		};
	}
});

export const getControlAttribute = function(controlSelector: string, attributeName: string, xmlDom: Node) {
	const selector = `string(/root${controlSelector}/@${attributeName})`;
	return runXPathQuery(selector, xmlDom);
};

export const serializeXML = function(xmlDom: Node) {
	const serializer = new window.XMLSerializer();
	const xmlString = serializer
		.serializeToString(xmlDom)
		.replace(/(?:[\t ]*(?:\r?\n|\r))+/g, "\n")
		.replace(/\\"/g, '"');
	return format(xmlString, { parser: "html" });
};

/**
 * Compile a CDS file into an EDMX file.
 *
 * @param {string} sCDSUrl The path to the file containing the CDS definition. This file MUST declare the namespace
 * sap.fe.test and a service JestService
 * @returns {string} The path of the generated EDMX
 */
export const compileCDS = function(sCDSUrl: string) {
	const cdsString = fs.readFileSync(sCDSUrl, "utf-8");
	const csn = compileSources({ "string.cds": cdsString }, {});
	const edmxContent = to.edmx(csn, { service: "sap.fe.test.JestService" });
	const dir = path.resolve(sCDSUrl, "..", "gen");
	const edmxUrl = path.resolve(dir, path.basename(sCDSUrl).replace(".cds", ".xml"));

	if (!fs.existsSync(dir)) {
		fs.mkdirSync(dir);
	}

	fs.writeFileSync(edmxUrl, edmxContent);
	return edmxUrl;
};

export const getFakeSideEffectsService = async function(oMetaModel: ODataMetaModel): Promise<any> {
	const oServiceContext = { scopeObject: {}, scopeType: "", settings: {} };
	return new SideEffectsFactory().createInstance(oServiceContext).then(function(oServiceInstance: any) {
		const oJestSideEffectsService = oServiceInstance.getInterface();
		oJestSideEffectsService.getContext = function() {
			return {
				scopeObject: {
					getModel: function() {
						return {
							getMetaModel: function() {
								return oMetaModel;
							}
						};
					}
				}
			};
		};
		return oJestSideEffectsService;
	});
};

export const getFakeDiagnostics = function(): IDiagnostics {
	const issues: any[] = [];
	return {
		addIssue(issueCategory: IssueCategory, issueSeverity: IssueSeverity, details: string): void {
			issues.push({
				issueCategory,
				issueSeverity,
				details
			});
		},
		getIssues(): any[] {
			return issues;
		},
		checkIfIssueExists(issueCategory: IssueCategory, issueSeverity: IssueSeverity, details: string): boolean {
			return issues.find(issue => {
				issue.issueCategory === issueCategory && issue.issueSeverity === issueSeverity && issue.details === details;
			});
		}
	};
};

export const getConverterContextForTest = function(
	convertedTypes: ConverterOutput,
	manifestSettings: ListReportManifestSettings | ObjectPageManifestSettings
) {
	const entitySet = convertedTypes.entitySets.find(es => es.name === manifestSettings.entitySet);
	const dataModelPath = getDataModelObjectPathForProperty(entitySet as EntitySet, entitySet);
	return new ConverterContext(convertedTypes, manifestSettings, getFakeDiagnostics(), merge, dataModelPath);
};
const metaModelCache: any = {};
export const getMetaModel = async function(sMetadataUrl: string) {
	const oRequestor = _MetadataRequestor.create({}, "4.0", {});
	if (!metaModelCache[sMetadataUrl]) {
		const oMetaModel = new ODataMetaModel(oRequestor, sMetadataUrl, undefined, null);
		await oMetaModel.fetchEntityContainer();
		metaModelCache[sMetadataUrl] = oMetaModel;
	}

	return metaModelCache[sMetadataUrl];
};

export const getDataModelObjectPathForProperty = function(
	entitySet: EntitySet,
	property?: Property | EntitySet | AnyAnnotation
): DataModelObjectPath {
	const targetPath: DataModelObjectPath = {
		startingEntitySet: entitySet,
		navigationProperties: [],
		targetObject: property,
		targetEntitySet: entitySet,
		targetEntityType: entitySet.entityType
	};
	targetPath.contextLocation = targetPath;
	return targetPath;
};

export const evaluateBinding = function(bindingString: string, ...args: any[]) {
	const bindingElement = BindingParser.complexParser(bindingString);
	return bindingElement.formatter.apply(undefined, args);
};

export const evaluateBindingWithModel = function(bindingString: string | undefined, modelContent: any) {
	const bindingElement = BindingParser.complexParser(bindingString);
	const jsonModel = new JSONModel(modelContent);
	const text = new InvisibleText();
	text.bindProperty("text", bindingElement);
	text.setModel(jsonModel);
	text.setBindingContext(jsonModel.createBindingContext("/"));
	return text.getText();
};

export const getTemplatingResult = async function(
	xmlInput: string,
	sMetadataUrl: string,
	mBindingContexts: { [x: string]: any; entitySet?: string },
	mModels: { [x: string]: any }
) {
	const templatedXml = `<root>${xmlInput}</root>`;
	const parser = new window.DOMParser();
	const xmlDoc = parser.parseFromString(templatedXml, "text/xml");
	// To ensure our macro can use #setBindingContext we ensure there is a pre existing JSONModel for converterContext
	// if not already passed to teh templating
	if (!mModels.hasOwnProperty("converterContext")) {
		mModels = Object.assign(mModels, { "converterContext": new JSONModel({}) });
	}

	const oMetaModel = await getMetaModel(sMetadataUrl);
	const oPreprocessorSettings: any = {
		models: Object.assign(
			{
				metaModel: oMetaModel
			},
			mModels
		),
		bindingContexts: {}
	};

	//Inject models and bindingContexts
	Object.keys(mBindingContexts).forEach(function(sKey) {
		/* Assert to make sure the annotations are in the test metadata -> avoid misleading tests */
		expect(typeof oMetaModel.getObject(mBindingContexts[sKey])).toBeDefined();
		const oModel = mModels[sKey] || oMetaModel;
		oPreprocessorSettings.bindingContexts[sKey] = oModel.createBindingContext(mBindingContexts[sKey]); //Value is sPath
		oPreprocessorSettings.models[sKey] = oModel;
	});

	//This context for macro testing
	if (oPreprocessorSettings.models["this"]) {
		oPreprocessorSettings.bindingContexts["this"] = oPreprocessorSettings.models["this"].createBindingContext("/");
	}

	return XMLPreprocessor.process(xmlDoc.firstElementChild!, { name: "Test Fragment" }, oPreprocessorSettings);
};

export const getTemplatedXML = async function(
	xmlInput: string,
	sMetadataUrl: string,
	mBindingContexts: { [x: string]: any; entitySet?: string },
	mModels: { [x: string]: any }
) {
	const templatedXML = await getTemplatingResult(xmlInput, sMetadataUrl, mBindingContexts, mModels);
	return serializeXML(templatedXML);
};
