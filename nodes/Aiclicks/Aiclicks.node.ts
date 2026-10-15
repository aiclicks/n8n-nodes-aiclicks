import { NodeConnectionTypes, type INodeType, type INodeTypeDescription } from 'n8n-workflow';
import { getDomains } from './listSearch/getDomains';
import { accountDescription } from './resources/account';
import { analyticsDescription } from './resources/analytics';
import { chatgptAdsDescription } from './resources/chatgptAds';
import { competitorDescription } from './resources/competitor';
import { domainDescription } from './resources/domain';
import { ga4Description } from './resources/ga4';
import { promptDescription } from './resources/prompt';
import { sentimentDescription } from './resources/sentiment';

export class Aiclicks implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'AIclicks',
		name: 'aiclicks',
		icon: { light: 'file:../../icons/aiclicks.svg', dark: 'file:../../icons/aiclicks.svg' },
		group: ['input'],
		version: 1,
		subtitle: '={{$parameter["operation"] + ": " + $parameter["resource"]}}',
		description: 'Track brand visibility, citations, sentiment and AI traffic across AI search engines',
		defaults: { name: 'AIclicks' },
		usableAsTool: true,
		inputs: [NodeConnectionTypes.Main],
		outputs: [NodeConnectionTypes.Main],
		credentials: [{ name: 'aiclicksApi', required: true }],
		requestDefaults: {
			baseURL: 'https://api.aiclicks.io',
			headers: { Accept: 'application/json', 'Content-Type': 'application/json' },
		},
		properties: [
			{
				displayName: 'Resource',
				name: 'resource',
				type: 'options',
				noDataExpression: true,
				options: [
					{ name: 'Account', value: 'account' },
					{ name: 'Brand Metric', value: 'analytics' },
					{ name: 'ChatGPT Ad', value: 'chatgptAds' },
					{ name: 'Competitor', value: 'competitor' },
					{ name: 'Domain', value: 'domain' },
					{ name: 'GA4 AI Traffic', value: 'ga4' },
					{ name: 'Prompt', value: 'prompt' },
					{ name: 'Sentiment', value: 'sentiment' },
				],
				default: 'analytics',
			},
			...accountDescription,
			...analyticsDescription,
			...chatgptAdsDescription,
			...competitorDescription,
			...domainDescription,
			...ga4Description,
			...promptDescription,
			...sentimentDescription,
		],
	};

	methods = {
		listSearch: { getDomains },
	};
}
