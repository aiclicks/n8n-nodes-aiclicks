import type { INodeProperties } from 'n8n-workflow';
import {
	daysField,
	domainField,
	idField,
	modelField,
	operationSelector,
	pageOptions,
	shownFor,
} from '../shared/fields';

const onSentiment = { show: { resource: ['sentiment'] } };
const onGetAnswers = shownFor('sentiment', ['getAnswers']);

export const sentimentDescription: INodeProperties[] = [
	operationSelector('sentiment', [
		{
			name: 'Get Overview',
			value: 'getOverview',
			action: 'Get sentiment overview',
			description: 'Positive vs negative split of how AI answers talk about the brand',
			url: '/api/v1/sentiment/overview',
		},
		{
			name: 'Get Time Series',
			value: 'getTimeSeries',
			action: 'Get sentiment time series',
			description: 'Daily positive-sentiment percentage',
			url: '/api/v1/sentiment/time-series',
		},
		{
			name: 'Get Themes',
			value: 'getThemes',
			action: 'Get sentiment themes',
			description: 'Themes AI answers raise about the brand, each tagged positive or negative',
			url: '/api/v1/sentiment/themes',
		},
		{
			name: 'Get Theme Sources',
			value: 'getThemeSources',
			action: 'Get sentiment theme sources',
			description: 'URLs cited when AI answers raise sentiment themes about the brand',
			url: '/api/v1/sentiment/theme-sources',
		},
		{
			name: 'Get Answers',
			value: 'getAnswers',
			action: 'Get answers for a theme',
			description: 'The AI answers behind one sentiment theme',
			url: '/api/v1/sentiment/answers',
		},
	]),
	domainField(onSentiment),
	daysField(shownFor('sentiment', ['getOverview', 'getTimeSeries', 'getThemes', 'getThemeSources'])),
	modelField(onSentiment),
	idField('Theme ID', 'themeId', 'theme_id', onGetAnswers),
	pageOptions(onGetAnswers, 100),
];
