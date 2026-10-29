import type { INodeProperties } from 'n8n-workflow';
import { flattenDomainItems } from '../shared/domains';
import {
	domainField,
	limitField,
	operationSelector,
	promptLinesToObjects,
	returnAllField,
	shownFor,
} from '../shared/fields';

const onCreate = shownFor('domain', ['create']);
const onGetMany = shownFor('domain', ['getAll']);

export const domainDescription: INodeProperties[] = [
	operationSelector('domain', [
		{
			name: 'Get Many',
			value: 'getAll',
			action: 'Get many domains',
			description: 'List every domain (brand) the API key can read',
			url: '/api/v1/domains',
			postReceive: [flattenDomainItems],
		},
		{
			name: 'Create',
			value: 'create',
			action: 'Create a domain',
			description: 'Create a new brand with the prompts to track. Not reversible through the API.',
			url: '/api/v1/domains',
			method: 'POST',
		},
		{
			name: 'Get Status',
			value: 'getStatus',
			action: 'Get domain status',
			description: "Where a domain's analysis stands, e.g. whether the first run has finished",
			url: '/api/v1/domain-status',
		},
	]),
	domainField(shownFor('domain', ['getStatus'])),
	returnAllField(onGetMany),
	limitField(onGetMany),
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
				value: promptLinesToObjects,
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
			{
				displayName: 'Pitch Brand',
				name: 'isPitch',
				type: 'boolean',
				default: false,
				description:
					'Whether to create a 7-day pitch brand for a prospect. Agency teams on Pro or higher only; uses a pitch credit instead of a brand slot and allows at most 25 prompts.',
				routing: { send: { type: 'body', property: 'is_pitch' } },
			},
		],
	},
];
