import type { INodeProperties } from 'n8n-workflow';
import { idField, operationSelector, shownFor } from '../shared/fields';

export const accountDescription: INodeProperties[] = [
	operationSelector('account', [
		{
			name: 'Validate Key',
			value: 'validateKey',
			action: 'Validate the API key',
			description: 'Confirm the API key works and list the team(s) it can access',
			url: '/api/v1/validate',
		},
		{
			name: 'Get Team Usage',
			value: 'getTeamUsage',
			action: 'Get team usage',
			description: "A team's plan and how much of it is used: prompt credits, brands, competitors, models",
			url: '/api/v1/team-usage',
		},
	]),
	idField('Team ID', 'teamId', 'team_id', shownFor('account', ['getTeamUsage'])),
];
