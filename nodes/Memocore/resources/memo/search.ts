import type { INodeProperties } from 'n8n-workflow';

const showOnlyForMemoSearch = {
	operation: ['search'],
	resource: ['memo'],
};

export const memoSearchDescription: INodeProperties[] = [
	{
		displayName: 'Search Query',
		name: 'query',
		type: 'string',
		default: '',
		placeholder: 'e.g. refund policy for annual plans',
		displayOptions: {
			show: showOnlyForMemoSearch,
		},
		description: 'What to look for. Leave empty to list the newest memos.',
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
			show: showOnlyForMemoSearch,
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
				...showOnlyForMemoSearch,
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
	{
		displayName: 'Filters',
		name: 'filters',
		type: 'collection',
		placeholder: 'Add Filter',
		default: {},
		displayOptions: {
			show: showOnlyForMemoSearch,
		},
		options: [
			{
				displayName: 'Archived Only',
				name: 'archived',
				type: 'boolean',
				default: false,
				description: 'Whether to search only deleted memos that are still in the archive',
				routing: {
					send: {
						type: 'query',
						property: 'archived',
					},
				},
			},
			{
				displayName: 'Exclude Tag Names or IDs',
				name: 'excludeTags',
				type: 'multiOptions',
				typeOptions: {
					loadOptionsMethod: 'getTags',
				},
				default: [],
				description:
					'Choose from the list, or specify IDs using an <a href="https://docs.n8n.io/code/expressions/">expression</a>',
				routing: {
					send: {
						type: 'query',
						property: 'exclude_tags',
					},
				},
			},
			{
				displayName: 'Meaning-Based Search',
				name: 'semantic',
				type: 'boolean',
				default: true,
				description:
					'Whether to match memos by meaning as well as by keywords. Turn off for exact keyword matching only.',
				routing: {
					send: {
						type: 'query',
						property: 'semantic',
					},
				},
			},
			{
				displayName: 'Tag Names or IDs',
				name: 'tags',
				type: 'multiOptions',
				typeOptions: {
					loadOptionsMethod: 'getTags',
				},
				default: [],
				description:
					'Choose from the list, or specify IDs using an <a href="https://docs.n8n.io/code/expressions/">expression</a>',
				routing: {
					send: {
						type: 'query',
						property: 'tags',
					},
				},
			},
		],
	},
];
