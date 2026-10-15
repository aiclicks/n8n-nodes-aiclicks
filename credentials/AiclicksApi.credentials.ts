import type {
	IAuthenticateGeneric,
	Icon,
	ICredentialTestRequest,
	ICredentialType,
	INodeProperties,
} from 'n8n-workflow';

export class AiclicksApi implements ICredentialType {
	name = 'aiclicksApi';

	displayName = 'AIclicks API';

	icon: Icon = { light: 'file:../icons/aiclicks.svg', dark: 'file:../icons/aiclicks.svg' };

	documentationUrl = 'https://github.com/aiclicks/n8n-nodes-aiclicks?tab=readme-ov-file#credentials';

	properties: INodeProperties[] = [
		{
			displayName: 'API Key',
			name: 'apiKey',
			type: 'string',
			typeOptions: { password: true },
			default: '',
			placeholder: 'ak_live_...',
			description: 'Team or master API key from AIclicks Settings → Developers',
		},
	];

	authenticate: IAuthenticateGeneric = {
		type: 'generic',
		properties: {
			headers: {
				Authorization: '=Bearer {{$credentials.apiKey}}',
			},
		},
	};

	test: ICredentialTestRequest = {
		request: {
			baseURL: 'https://api.aiclicks.com',
			url: '/api/v1/validate',
			method: 'GET',
		},
	};
}
