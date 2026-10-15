import type { INodeProperties } from 'n8n-workflow';
import {
	commaSeparatedToArray,
	daysField,
	domainField,
	modelField,
	operationSelector,
	pageField,
	pageSizeField,
	shownFor,
} from '../shared/fields';

const onAdd = shownFor('prompt', ['add']);
const onGetMany = shownFor('prompt', ['getAll']);

export const promptDescription: INodeProperties[] = [
	operationSelector('prompt', [
		{
			name: 'Get Many',
			value: 'getAll',
			action: 'Get many prompts',
			description: 'List the prompts tracked for a domain',
			url: '/api/v1/prompts',
			isList: true,
		},
		{
			name: 'Add',
			value: 'add',
			action: 'Add a prompt',
			description: 'Track a new prompt for a domain. Uses one prompt credit.',
			url: '/api/v1/prompts',
			method: 'POST',
		},
		{
			name: 'Get Statistics',
			value: 'getStatistics',
			action: 'Get prompt statistics',
			description: 'Top prompts by mentions with a daily series of mentions, citations and position',
			url: '/api/v1/prompt-statistics-time-series',
		},
		{
			name: 'Get Fanout Queries',
			value: 'getFanoutQueries',
			action: 'Get fanout queries',
			description: 'Expanded query variants the AI engines ran on top of the tracked prompts',
			url: '/api/v1/fanout-queries',
		},
		{
			name: 'Get Tags',
			value: 'getTags',
			action: 'Get tags',
			description: 'List the tags defined for a domain, with their IDs',
			url: '/api/v1/tags',
		},
		{
			name: 'Get Topics',
			value: 'getTopics',
			action: 'Get topics',
			description: 'List the topics defined for a domain, with their IDs',
			url: '/api/v1/topics',
		},
	]),
	domainField(shownFor('prompt', ['getAll', 'getStatistics', 'getFanoutQueries', 'getTags', 'getTopics'])),
	domainField(onAdd, 'body'),
	pageField(onGetMany),
	pageSizeField(onGetMany, 'size'),
	daysField(shownFor('prompt', ['getStatistics', 'getFanoutQueries'])),
	modelField(shownFor('prompt', ['getFanoutQueries'])),
	{
		displayName: 'Limit',
		name: 'limit',
		type: 'number',
		typeOptions: { minValue: 1, maxValue: 100 },
		default: 50,
		description: 'Max number of results to return',
		displayOptions: shownFor('prompt', ['getStatistics']),
		routing: { send: { type: 'query', property: 'limit' } },
	},
	{
		displayName: 'Prompt Text',
		name: 'text',
		type: 'string',
		required: true,
		default: '',
		displayOptions: onAdd,
		routing: { send: { type: 'body', property: 'text' } },
	},
	{
		displayName: 'Additional Fields',
		name: 'additionalFields',
		type: 'collection',
		placeholder: 'Add Field',
		default: {},
		displayOptions: onAdd,
		options: [
			{
				displayName: 'Tag IDs',
				name: 'tagIds',
				type: 'string',
				default: '',
				description: 'Comma-separated tag IDs (from Get Tags). Leave unset to apply default tags.',
				routing: { send: { type: 'body', property: 'tag_ids', value: commaSeparatedToArray } },
			},
			{
				displayName: 'Topic IDs',
				name: 'topicIds',
				type: 'string',
				default: '',
				description: 'Comma-separated topic IDs (from Get Topics)',
				routing: { send: { type: 'body', property: 'topic_ids', value: commaSeparatedToArray } },
			},
		],
	},
];
