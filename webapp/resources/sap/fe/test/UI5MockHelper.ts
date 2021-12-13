/**
 * Mock class for a V4 Context
 */

import { Context, ODataListBinding, ODataContextBinding, ODataMetaModel, ODataModel } from "sap/ui/model/odata/v4";

export class MockContext implements Partial<Context> {
	public constructor(private oValues: any, private oBinding?: any) {}

	public getProperty = jest.fn((key: string) => {
		return this.oValues[key];
	});
	public getObject = jest.fn((key: string) => {
		return this.oValues[key];
	});
	public getPath = jest.fn(() => {
		return this.oValues["$path"];
	});

	public getBinding = jest.fn(() => {
		return this.oBinding;
	});
}

export class MockControl {
	public getBindingInfo = jest.fn();
	public getBinding = jest.fn();
}

/**
 * Mock class for OData V4 ListBinding
 */
export class MockListBinding implements Partial<ODataListBinding> {
	private aMockContexts: MockContext[];

	public constructor(aContexts?: any[]) {
		aContexts = aContexts || [];

		this.aMockContexts = aContexts.map(context => {
			return new MockContext(context, this);
		});
	}

	public isA(sClassName: string): boolean {
		return sClassName === "sap.ui.model.odata.v4.ODataListBinding";
	}

	// Mocked API
	public setAggregation = jest.fn();
	public filter = jest.fn();
	public sort = jest.fn();

	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	public requestContexts = jest.fn((...args) => {
		return Promise.resolve((this.aMockContexts as any) as Context[]);
	});
	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	public getCurrentContexts = jest.fn((...args) => {
		return (this.aMockContexts as any) as Context[];
	});
}

export class MockContextBinding implements Partial<ODataContextBinding> {
	private oMockContext: MockContext;

	public constructor(oContext?: any) {
		this.oMockContext = new MockContext(oContext || {}, this);
	}

	public isA(sClassName: string): boolean {
		return sClassName === "sap.ui.model.odata.v4.ODataContextBinding";
	}
	public getInternalMockContext(): MockContext {
		return this.oMockContext;
	}

	// Mocked API
	public getBoundContext = jest.fn(() => {
		return (this.oMockContext as any) as Context;
	});
	public attachEventOnce = jest.fn();
}

/**
 * Mock class for OData V4 MetaModel
 */
export class MockMetaModel implements Partial<ODataMetaModel> {
	private oMetaContext: MockContext;

	public constructor(oMetaData?: any) {
		this.oMetaContext = new MockContext(oMetaData || {});
	}

	// Mocked API
	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	public getMetaContext = jest.fn((sPath: string) => {
		return (new MockContext({ $path: sPath }) as any) as Context;
	});
	public getObject = jest.fn((sPath: string) => {
		return this.oMetaContext.getProperty(sPath);
	});
}

/**
 * Mock class for OData V4 Model
 */

export class MockModel implements Partial<ODataModel> {
	private oMetaModel?: MockMetaModel;

	public constructor(private mockListBinding?: MockListBinding, private mockContextBinding?: MockContextBinding) {}

	// Factories
	static modelFromListBinding(mockListBinding: MockListBinding): MockModel {
		return new MockModel(mockListBinding);
	}
	static modelFromContextBinding(mockContextBinding: MockContextBinding): MockModel {
		return new MockModel(undefined, mockContextBinding);
	}

	public setMetaModel(oMetaModel: MockMetaModel) {
		this.oMetaModel = oMetaModel;
	}

	// Mocked API
	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	public bindList = jest.fn((...args) => {
		return (this.mockListBinding as any) as ODataListBinding;
	});
	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	public bindContext = jest.fn((...args) => {
		return (this.mockContextBinding as any) as ODataContextBinding;
	});
	public getMetaModel = jest.fn(() => {
		return (this.oMetaModel as any) as ODataMetaModel;
	});
}
