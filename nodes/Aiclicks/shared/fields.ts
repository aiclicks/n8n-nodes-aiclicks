import type { IDisplayOptions, INodeProperties, INodePropertyOptions } from 'n8n-workflow';

export type Operation = {
	name: string;
	value: string;
	action: string;
	description: string;
	url: string;
	method?: 'GET' | 'POST';
	isList?: boolean;
};

const unwrapData = { type: 'rootProperty' as const, properties: { property: 'data' } };
const splitItems = { type: 'rootProperty' as const, properties: { property: 'items' } };

function toOptionWithRouting({ url, method = 'GET', isList, ...option }: Operation): INodePropertyOptions {
	return {
		...option,
		routing: {
			request: { method, url },
			output: { postReceive: isList ? [unwrapData, splitItems] : [unwrapData] },
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

export function pageField(displayOptions: IDisplayOptions): INodeProperties {
	return {
		displayName: 'Page',
		name: 'page',
		type: 'number',
		typeOptions: { minValue: 1 },
		default: 1,
		description: '1-based page number',
		displayOptions,
		routing: { send: { type: 'query', property: 'page' } },
	};
}

export function pageSizeField(displayOptions: IDisplayOptions, property: string): INodeProperties {
	return {
		displayName: 'Page Size',
		name: 'pageSize',
		type: 'number',
		typeOptions: { minValue: 1, maxValue: 500 },
		default: 50,
		description: 'Rows per page (max 500)',
		displayOptions,
		routing: { send: { type: 'query', property } },
	};
}

export const commaSeparatedToArray = '={{$value.split(",").map(entry => entry.trim()).filter(Boolean)}}';
