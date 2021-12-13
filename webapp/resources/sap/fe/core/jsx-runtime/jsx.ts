import { ManagedObjectMetadata } from "sap/ui/base";

type ControlPropertyNames<T> = {
	[K in keyof T]: T[K] extends string | boolean | Function | number | undefined | string[] ? never : K;
}[keyof T];
type ControlProperties<T> = Partial<Record<ControlPropertyNames<T>, JSX.Element>>;
type NonControlProperties<T> = Partial<Omit<T, ControlPropertyNames<T>>>;
type ControlWithMetadata = {
	getMetadata(): ManagedObjectMetadata;
};
export type WrappedControl<T> = (mSettings: NonControlProperties<T> & { children?: JSX.Element | ControlProperties<T> }) => JSX.Element;

const writeChildren = function(val: string | string[]) {
	if (Array.isArray(val)) {
		return val.join("");
	} else {
		return val;
	}
};

const addChildAggregation = function(aggregationChildren: any, aggregationName: string, child: any) {
	if (child === undefined) {
		return;
	}
	if (!aggregationChildren[aggregationName]) {
		aggregationChildren[aggregationName] = [];
	}
	if (typeof child === "string" && child.trim().length > 0) {
		aggregationChildren[aggregationName].push(child);
	} else if (Array.isArray(child)) {
		child.forEach(subChild => {
			addChildAggregation(aggregationChildren, aggregationName, subChild);
		});
	} else {
		Object.keys(child).forEach(childKey => {
			addChildAggregation(aggregationChildren, childKey, child[childKey]);
		});
	}
};

const jsx = function<T>(
	type: ControlWithMetadata,
	mSettings: NonControlProperties<T> & { children?: JSX.Element | ControlProperties<T> }
): string {
	const metadata = type.getMetadata();
	const namesSplit = metadata.getName().split(".");

	const metadataProperties: { name: string }[] = (metadata.getAllProperties() as unknown) as { name: string }[];
	const metadataAggregations: { name: string }[] = (metadata.getAllAggregations() as unknown) as { name: string }[];

	const namespace = namesSplit.slice(0, -1);
	const name = namesSplit[namesSplit.length - 1];
	const namespaceAlias = namespace[namespace.length - 1];
	const tagName = `${namespaceAlias}:sap.fe.core`;
	const propertiesString: string[] = [];
	const aggregationString: string[] = [];
	const defaultAggregationName = metadata.getDefaultAggregationName();
	Object.keys(metadataProperties).forEach(propertyName => {
		if (mSettings.hasOwnProperty(propertyName)) {
			propertiesString.push(`${propertyName}="${(mSettings as any)[propertyName]}"`);
		}
	});
	const aggregationChildren: Record<string, string[]> = {
		[defaultAggregationName]: []
	};
	addChildAggregation(aggregationChildren, defaultAggregationName, mSettings.children);
	Object.keys(metadataAggregations).forEach(aggregationName => {
		if (aggregationChildren?.hasOwnProperty(aggregationName) && aggregationChildren[aggregationName].length > 0) {
			aggregationString.push(
				`<${namespaceAlias}:${aggregationName}>
						${writeChildren(aggregationChildren[aggregationName])}
					</${namespaceAlias}:${aggregationName}>`
			);
		}
		if (mSettings.hasOwnProperty(aggregationName)) {
			propertiesString.push(`${aggregationName}='${JSON.stringify((mSettings as any)[aggregationName])}'`);
		}
	});
	return `<${tagName} xmlns:${namespaceAlias}="${namespace.join(".")}" ${propertiesString.join(" ")}>${aggregationString.join(
		""
	)}</${tagName}>`;
};
export default jsx;
