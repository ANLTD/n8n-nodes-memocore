import type {
	IAuthenticateGeneric,
	Icon,
	ICredentialTestRequest,
	ICredentialType,
	INodeProperties,
} from 'n8n-workflow';

export class MemocoreApi implements ICredentialType {
	name = 'memocoreApi';

	displayName = 'Memocore API';

	icon: Icon = { light: 'file:../icons/memocore.svg', dark: 'file:../icons/memocore.dark.svg' };

	documentationUrl = 'https://github.com/ANLTD/n8n-nodes-memocore?tab=readme-ov-file#credentials';

	properties: INodeProperties[] = [
		{
			displayName: 'API Key',
			name: 'apiKey',
			type: 'string',
			typeOptions: { password: true },
			required: true,
			default: '',
			description:
				'The key from your team page in memocore: Integrations → Catalog → n8n. It starts with mc_ck_.',
		},
		{
			displayName: 'Base URL',
			name: 'url',
			type: 'string',
			default: 'https://memocore.ai',
			description: 'Leave as is unless you run memocore at another address. No trailing slash.',
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
			baseURL: '={{$credentials.url}}/api/v1',
			url: '/projects',
			method: 'GET',
		},
	};
}
