import type { INodeProperties } from 'n8n-workflow';
import { operationSelector } from '../shared/fields';

export const accountDescription: INodeProperties[] = [
	operationSelector('account', [
		{
			name: 'Validate Key',
			value: 'validateKey',
			action: 'Validate the API key',
			description: 'Confirm the API key works and list the team(s) it can access',
			url: '/api/v1/validate',
		},
	]),
];
