import type { INodeProperties } from 'n8n-workflow';
import { operationSelector, shownFor } from '../shared/fields';

const onCreate = shownFor('domain', ['create']);

export const domainDescription: INodeProperties[] = [
	operationSelector('domain', [
		{
			name: 'Get Many',
			value: 'getAll',
			action: 'Get many domains',
			description: 'List every domain (brand) the API key can read',
			url: '/api/v1/domains',
			isList: true,
		},
		{
			name: 'Create',
			value: 'create',
			action: 'Create a domain',
			description: 'Create a new brand with the prompts to track. Not reversible through the API.',
			url: '/api/v1/domains',
			method: 'POST',
		},
	]),
	{
		displayName: 'Team ID',
		name: 'teamId',
		type: 'string',
		required: true,
		default: '',
		description: 'UUID of the team to create the brand under (from Account → Validate Key)',
		displayOptions: onCreate,
		routing: { send: { type: 'body', property: 'team_id' } },
	},
	{
		displayName: 'Brand Name',
		name: 'name',
		type: 'string',
		required: true,
		default: '',
		displayOptions: onCreate,
		routing: { send: { type: 'body', property: 'name' } },
	},
	{
		displayName: 'Website',
		name: 'website',
		type: 'string',
		required: true,
		default: '',
		placeholder: 'e.g. example.com',
		displayOptions: onCreate,
		routing: { send: { type: 'body', property: 'website' } },
	},
	{
		displayName: 'Prompts',
		name: 'prompts',
		type: 'string',
		typeOptions: { rows: 5 },
		default: '',
		description: 'Prompts to track, one per line. Leave empty only if Generate Prompts is on.',
		displayOptions: onCreate,
		routing: {
			send: {
				type: 'body',
				property: 'prompts',
				value: '={{$value.split("\\n").map(line => line.trim()).filter(Boolean).map(text => ({ text }))}}',
			},
		},
	},
	{
		displayName: 'Generate Prompts',
		name: 'generatePrompts',
		type: 'boolean',
		default: false,
		description: 'Whether aiclicks should generate the prompts server-side instead of using the list above',
		displayOptions: onCreate,
		routing: { send: { type: 'body', property: 'generate_prompts' } },
	},
	{
		displayName: 'Additional Fields',
		name: 'additionalFields',
		type: 'collection',
		placeholder: 'Add Field',
		default: {},
		displayOptions: onCreate,
		options: [
			{
				displayName: 'Country',
				name: 'country',
				type: 'string',
				default: '',
				placeholder: 'e.g. US',
				routing: { send: { type: 'body', property: 'country' } },
			},
		],
	},
];
