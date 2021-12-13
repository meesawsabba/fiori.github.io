const parser = new DOMParser();
export const xml = (strings: TemplateStringsArray, ...values: any[]) => {
	let outStr = "";
	let i;
	for (i = 0; i < values.length; i++) {
		outStr += strings[i];
		outStr += values[i];
	}
	outStr += strings[i];
	const xmlDoc = parser.parseFromString(outStr, "text/xml");
	return xmlDoc;
};
