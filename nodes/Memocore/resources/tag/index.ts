import type { INodeProperties } from 'n8n-workflow';

const showOnlyForTags = {
	resource: ['tag'],
};

const showOnlyForTagGetMany = {
	...showOnlyForTags,
	operation: ['getAll'],
};

export const tagDescription: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: showOnlyForTags,
		},
		options: [
			{
				name: 'Get Many',
				value: 'getAll',
				action: 'Get many tags',
				description: 'Get the tags of the projects the API key can access',
				routing: {
					request: {
						method: 'GET',
						url: '/tags',
					},
					output: {
						postReceive: [
							{
								type: 'rootProperty',
								properties: {
									property: 'items',
								},
							},
						],
					},
				},
			},
		],
		default: 'getAll',
	},
	{
		displayName: 'Search Query',
		name: 'query',
		type: 'string',
		default: '',
		displayOptions: {
			show: showOnlyForTagGetMany,
		},
		description: 'Find tags by name or by what they are for. Leave empty to list all tags.',
		routing: {
			send: {
				type: 'query',
				property: 'query',
			},
		},
	},
	{
		displayName: 'Return All',
		name: 'returnAll',
		type: 'boolean',
		default: false,
		displayOptions: {
			show: showOnlyForTagGetMany,
		},
		description: 'Whether to return all results or only up to a given limit',
		routing: {
			send: {
				paginate: '={{ $value }}',
			},
			operations: {
				pagination: {
					type: 'offset',
					properties: {
						limitParameter: 'limit',
						offsetParameter: 'skip',
						pageSize: 90,
						rootProperty: 'items',
						type: 'query',
					},
				},
			},
		},
	},
	{
		displayName: 'Limit',
		name: 'limit',
		type: 'number',
		typeOptions: {
			minValue: 1,
			maxValue: 90,
		},
		default: 50,
		displayOptions: {
			show: {
				...showOnlyForTagGetMany,
				returnAll: [false],
			},
		},
		description: 'Max number of results to return',
		routing: {
			send: {
				type: 'query',
				property: 'limit',
			},
			output: {
				maxResults: '={{$value}}',
			},
		},
	},
];
