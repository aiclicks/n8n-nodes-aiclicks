import type { INodeProperties } from 'n8n-workflow';
import {
	daysField,
	domainField,
	operationSelector,
	pageField,
	pageSizeField,
	shownFor,
} from '../shared/fields';

const onChatgptAds = { show: { resource: ['chatgptAds'] } };
const onPaginated = shownFor('chatgptAds', ['getPrompts', 'getCards']);

export const chatgptAdsDescription: INodeProperties[] = [
	operationSelector('chatgptAds', [
		{
			name: 'Get KPIs',
			value: 'getKpis',
			action: 'Get ChatGPT ads KPIs',
			description: 'Prompts with ads, brand appearances, advertisers and ad cards, with deltas',
			url: '/api/v1/ads/kpis',
		},
		{
			name: 'Get Leaderboard',
			value: 'getLeaderboard',
			action: 'Get ChatGPT ads leaderboard',
			description: 'Brands advertising on ChatGPT for your prompts, ranked by coverage',
			url: '/api/v1/ads/leaderboard',
		},
		{
			name: 'Get Timeline',
			value: 'getTimeline',
			action: 'Get ChatGPT ads timeline',
			description: 'Daily ChatGPT ads activity',
			url: '/api/v1/ads/timeline',
		},
		{
			name: 'Get Prompts',
			value: 'getPrompts',
			action: 'Get prompts that triggered ChatGPT ads',
			description: 'Tracked prompts that triggered ChatGPT ads',
			url: '/api/v1/ads/prompts',
		},
		{
			name: 'Get Cards',
			value: 'getCards',
			action: 'Get ChatGPT ad cards',
			description: 'Individual ad cards (creatives and advertisers) seen for your prompts',
			url: '/api/v1/ads/cards',
		},
	]),
	domainField(onChatgptAds),
	daysField(onChatgptAds),
	pageField(onPaginated),
	pageSizeField(onPaginated, 'per_page'),
];
