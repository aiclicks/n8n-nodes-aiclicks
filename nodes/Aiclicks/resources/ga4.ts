import type { INodeProperties } from 'n8n-workflow';
import { daysField, domainField, operationSelector } from '../shared/fields';

const onGa4 = { show: { resource: ['ga4'] } };

export const ga4Description: INodeProperties[] = [
	operationSelector('ga4', [
		{
			name: 'Get Summary',
			value: 'getSummary',
			action: 'Get AI traffic summary',
			description: 'Sessions, users and pageviews from AI referrals, with the previous period',
			url: '/api/v1/ga4/summary',
		},
		{
			name: 'Get by LLM',
			value: 'getByLlm',
			action: 'Get AI traffic by LLM',
			description: 'AI-referred traffic broken out per assistant (ChatGPT, Perplexity, Claude, ...)',
			url: '/api/v1/ga4/by-llm',
		},
		{
			name: 'Get Timeline',
			value: 'getTimeline',
			action: 'Get AI traffic timeline',
			description: 'Daily AI-referred sessions per LLM source',
			url: '/api/v1/ga4/timeline',
		},
		{
			name: 'Get Top Pages',
			value: 'getTopPages',
			action: 'Get top pages for AI traffic',
			description: 'Pages that pull the most AI-referred sessions',
			url: '/api/v1/ga4/top-pages',
		},
		{
			name: 'Get Top Locations',
			value: 'getTopLocations',
			action: 'Get top locations for AI traffic',
			description: 'AI-referred sessions by country',
			url: '/api/v1/ga4/top-locations',
		},
		{
			name: 'Get Top Browsers',
			value: 'getTopBrowsers',
			action: 'Get top browsers for AI traffic',
			description: 'AI-referred sessions by browser',
			url: '/api/v1/ga4/top-browsers',
		},
		{
			name: 'Get Devices',
			value: 'getDevices',
			action: 'Get devices for AI traffic',
			description: 'AI-referred sessions by device category',
			url: '/api/v1/ga4/devices',
		},
		{
			name: 'Get Key Events',
			value: 'getKeyEvents',
			action: 'Get key events from AI traffic',
			description: 'Conversions attributed to AI-referred traffic',
			url: '/api/v1/ga4/key-events',
		},
	]),
	domainField(onGa4),
	daysField(onGa4),
	{
		displayName: 'Options',
		name: 'options',
		type: 'collection',
		placeholder: 'Add Option',
		default: {},
		displayOptions: onGa4,
		options: [
			{
				displayName: 'LLM Source',
				name: 'llmSource',
				type: 'string',
				default: '',
				placeholder: 'e.g. chatgpt',
				description: 'Only count traffic from one AI source (chatgpt, perplexity, claude, gemini, copilot)',
				routing: { send: { type: 'query', property: 'llm_source' } },
			},
		],
	},
];
