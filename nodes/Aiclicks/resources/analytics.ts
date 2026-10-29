import type { INodeProperties } from 'n8n-workflow';
import {
	daysField,
	domainField,
	operationSelector,
	shownFor,
	simplifyField,
	simplifyTo,
} from '../shared/fields';

const operationsWithDays = [
	'getVisibility',
	'getMentions',
	'getCitability',
	'getCitationsTimeSeries',
	'getCitations',
	'getModelLeaderboard',
];

export const analyticsDescription: INodeProperties[] = [
	operationSelector('analytics', [
		{
			name: 'Get Visibility',
			value: 'getVisibility',
			action: 'Get visibility time series',
			description: 'Daily share of tracked AI answers that mention the brand',
			url: '/api/v1/visibility-time-series',
		},
		{
			name: 'Get Mentions',
			value: 'getMentions',
			action: 'Get mentions time series',
			description: 'Daily count of AI answers naming the brand',
			url: '/api/v1/mentions-time-series',
		},
		{
			name: 'Get Citability',
			value: 'getCitability',
			action: 'Get citability time series',
			description: "Daily score for how often the brand's URLs are cited, not just mentioned",
			url: '/api/v1/citability-time-series',
		},
		{
			name: 'Get Citations Time Series',
			value: 'getCitationsTimeSeries',
			action: 'Get citations time series',
			description: "Daily count of the brand's URLs appearing in AI answers",
			url: '/api/v1/citations-time-series',
		},
		{
			name: 'Get Citations',
			value: 'getCitations',
			action: 'Get cited URLs',
			description: 'URL-level citations across AI answers, sorted by frequency',
			url: '/api/v1/citations',
			postReceive: [
				simplifyTo([
					'url',
					'domain',
					'page_title',
					'page_type',
					'is_brand_owned',
					'mentioned',
					'competitors',
					'frequency',
					'mentions',
					'prompt_count',
					'models',
					'last_seen',
				]),
			],
		},
		{
			name: 'Get Brand Rankings',
			value: 'getBrandRankings',
			action: 'Get brand rankings',
			description: 'Current share-of-voice ranking of the brand against tracked competitors',
			url: '/api/v1/brand-rankings',
		},
		{
			name: 'Get Model Leaderboard',
			value: 'getModelLeaderboard',
			action: 'Get model leaderboard',
			description: 'How often each AI model (ChatGPT, Perplexity, AI Overviews, ...) surfaces the brand',
			url: '/api/v1/model-leaderboard',
		},
	]),
	domainField({ show: { resource: ['analytics'] } }),
	daysField(shownFor('analytics', operationsWithDays)),
	simplifyField(shownFor('analytics', ['getCitations'])),
	{
		displayName: 'Filters',
		name: 'filters',
		type: 'collection',
		placeholder: 'Add Filter',
		default: {},
		displayOptions: shownFor('analytics', ['getCitations']),
		options: [
			{
				displayName: 'Brand-Owned Pages',
				name: 'isBrandOwned',
				type: 'boolean',
				default: true,
				description:
					"Whether to return only the brand's own pages (true) or only third-party pages (false)",
				routing: { send: { type: 'query', property: 'is_brand_owned' } },
			},
			{
				displayName: 'Page Mentions Brand',
				name: 'mentioned',
				type: 'boolean',
				default: false,
				description:
					'Whether to return only cited pages that name the brand (true) or only pages that do not, including pages not scraped yet (false)',
				routing: { send: { type: 'query', property: 'mentioned' } },
			},
		],
	},
];
