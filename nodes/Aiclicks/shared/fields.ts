import type {
	IDataObject,
	IDisplayOptions,
	INodeExecutionData,
	INodeProperties,
	INodePropertyOptions,
	PostReceiveAction,
} from 'n8n-workflow';

export type Operation = {
	name: string;
	value: string;
	action: string;
	description: string;
	url: string;
	method?: 'GET' | 'POST';
	postReceive?: PostReceiveAction[];
};

export function rowsOf(data: IDataObject | IDataObject[]): IDataObject[] {
	if (Array.isArray(data)) return data;
	return Array.isArray(data.items) ? (data.items as IDataObject[]) : [data];
}

export async function unwrapData(items: INodeExecutionData[]): Promise<INodeExecutionData[]> {
	return items.flatMap(({ json }) => rowsOf(json.data as IDataObject).map((row) => ({ json: row })));
}

function toOptionWithRouting({
	url,
	method = 'GET',
	postReceive = [],
	...option
}: Operation): INodePropertyOptions {
	return {
		...option,
		routing: {
			request: { method, url },
			output: { postReceive: [unwrapData, ...postReceive] },
		},
	};
}

export function simplifyTo(fields: string[]): PostReceiveAction {
	const pickedFields = Object.fromEntries(fields.map((field) => [field, `={{$responseItem.${field}}}`]));
	return { type: 'setKeyValue', enabled: '={{$parameter.simplify}}', properties: pickedFields };
}

export function simplifyField(displayOptions: IDisplayOptions): INodeProperties {
	return {
		displayName: 'Simplify',
		name: 'simplify',
		type: 'boolean',
		default: true,
		description: 'Whether to return a simplified version of the response instead of the raw data',
		displayOptions,
	};
}

export function returnAllField(displayOptions: IDisplayOptions): INodeProperties {
	return {
		displayName: 'Return All',
		name: 'returnAll',
		type: 'boolean',
		default: false,
		description: 'Whether to return all results or only up to a given limit',
		displayOptions,
	};
}

export function limitField(
	displayOptions: IDisplayOptions,
	sendAs?: string,
	maxValue?: number,
): INodeProperties {
	return {
		displayName: 'Limit',
		name: 'limit',
		type: 'number',
		typeOptions: { minValue: 1, maxValue },
		default: 50,
		description: 'Max number of results to return',
		displayOptions: { show: { ...displayOptions.show, returnAll: [false] } },
		routing: {
			send: sendAs ? { type: 'query', property: sendAs } : undefined,
			output: { maxResults: '={{$value}}' },
		},
	};
}

export function operationSelector(resource: string, operations: Operation[]): INodeProperties {
	const firstOperation = operations[0].value;
	return {
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: { show: { resource: [resource] } },
		options: operations.map(toOptionWithRouting),
		default: firstOperation,
	};
}

export function shownFor(resource: string, operations: string[]): IDisplayOptions {
	return { show: { resource: [resource], operation: operations } };
}

export function domainField(
	displayOptions: IDisplayOptions,
	sendIn: 'query' | 'body' = 'query',
): INodeProperties {
	return {
		displayName: 'Domain',
		name: 'domainId',
		type: 'resourceLocator',
		default: { mode: 'list', value: '' },
		required: true,
		description: 'The tracked brand (domain) to read or change',
		displayOptions,
		modes: [
			{
				displayName: 'From List',
				name: 'list',
				type: 'list',
				placeholder: 'Select a domain...',
				typeOptions: { searchListMethod: 'getDomains', searchable: true },
			},
			{
				displayName: 'By ID',
				name: 'id',
				type: 'string',
				placeholder: 'e.g. 10df2f96-0683-43e8-9913-043dbf675a14',
			},
		],
		routing: {
			send: { type: sendIn, property: 'domain_id', value: '={{$parameter.domainId}}' },
		},
	};
}

export function daysField(displayOptions: IDisplayOptions): INodeProperties {
	return {
		displayName: 'Days',
		name: 'days',
		type: 'number',
		typeOptions: { minValue: 1, maxValue: 365 },
		default: 30,
		description: 'Trailing look-back window in days (1-365), counted back from today',
		displayOptions,
		routing: { send: { type: 'query', property: 'days' } },
	};
}

export function modelField(displayOptions: IDisplayOptions): INodeProperties {
	return {
		displayName: 'AI Model',
		name: 'model',
		type: 'string',
		default: 'all',
		description: 'Restrict to one AI channel by name (ChatGPT, Perplexity, Gemini, AI Overviews, Claude, ...) or "all"',
		displayOptions,
		routing: { send: { type: 'query', property: 'model' } },
	};
}

export const promptLinesToObjects =
	'={{$value.split("\\n").map(line => line.trim()).filter(Boolean).map(text => ({ text }))}}';

export const competitorLinesToObjects =
	'={{$value.split("\\n").map(line => line.split(",").map(part => part.trim())).filter(([website]) => website).map(([website, ...name]) => ({ competitor_domain: website, competitor_name: name.join(", ") || website }))}}';

export const commaSeparatedToArray = '={{$value.split(",").map(entry => entry.trim()).filter(Boolean)}}';

export function idField(
	displayName: string,
	name: string,
	property: string,
	displayOptions: IDisplayOptions,
	sendIn: 'query' | 'body' = 'query',
): INodeProperties {
	return {
		displayName,
		name,
		type: 'string',
		required: true,
		default: '',
		displayOptions,
		routing: { send: { type: sendIn, property } },
	};
}

export function idListField(
	displayName: string,
	name: string,
	property: string,
	displayOptions: IDisplayOptions,
	description: string,
	required = true,
): INodeProperties {
	return {
		displayName,
		name,
		type: 'string',
		required,
		default: '',
		description: `${description}, comma-separated`,
		displayOptions,
		routing: { send: { type: 'body', property, value: commaSeparatedToArray } },
	};
}

export function pageOptions(
	displayOptions: IDisplayOptions,
	maxPageSize: number,
	extraOptions: INodeProperties[] = [],
): INodeProperties {
	return {
		displayName: 'Options',
		name: 'options',
		type: 'collection',
		placeholder: 'Add Option',
		default: {},
		displayOptions,
		options: [
			{
				displayName: 'Page',
				name: 'page',
				type: 'number',
				typeOptions: { minValue: 1 },
				default: 1,
				description: '1-indexed page of results',
				routing: { send: { type: 'query', property: 'page' } },
			},
			{
				displayName: 'Page Size',
				name: 'size',
				type: 'number',
				typeOptions: { minValue: 1, maxValue: maxPageSize },
				default: maxPageSize,
				description: `Rows per page (max ${maxPageSize})`,
				routing: { send: { type: 'query', property: 'size' } },
			},
			...extraOptions,
		],
	};
}

export function sortDirectionOption(): INodeProperties {
	return {
		displayName: 'Sort Direction',
		name: 'sortDir',
		type: 'options',
		options: [
			{ name: 'Descending', value: 'desc' },
			{ name: 'Ascending', value: 'asc' },
		],
		default: 'desc',
		routing: { send: { type: 'query', property: 'sort_dir' } },
	};
}
