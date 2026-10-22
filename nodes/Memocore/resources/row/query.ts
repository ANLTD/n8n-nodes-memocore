import type { INodeProperties } from 'n8n-workflow';

const showOnlyForRowQuery = {
	operation: ['query'],
	resource: ['row'],
};

const showOnlyForRowFilter = {
	operation: ['aggregate', 'query'],
	resource: ['row'],
};

export const rowQueryDescription: INodeProperties[] = [
	{
		displayName: 'Match',
		name: 'match',
		type: 'options',
		options: [
			{
				name: 'All Conditions',
				value: 'and',
			},
			{
				name: 'Any Condition',
				value: 'or',
			},
		],
		default: 'and',
		displayOptions: {
			show: showOnlyForRowFilter,
		},
		description: 'Whether a row must match every condition or at least one',
	},
	{
		displayName: 'Conditions',
		name: 'conditions',
		type: 'fixedCollection',
		typeOptions: {
			multipleValues: true,
		},
		placeholder: 'Add Condition',
		default: {},
		displayOptions: {
			show: showOnlyForRowFilter,
		},
		options: [
			{
				displayName: 'Condition',
				name: 'condition',
				values: [
					{
						displayName: 'Column Name or ID',
						name: 'column',
						type: 'options',
						typeOptions: {
							loadOptionsMethod: 'getColumns',
							loadOptionsDependsOn: ['project.value'],
						},
						default: '',
						description:
							'Choose from the list, or specify an ID using an <a href="https://docs.n8n.io/code/expressions/">expression</a>',
					},
					{
						displayName: 'Operator',
						name: 'operator',
						type: 'options',
						options: [
							{
								name: 'Contains',
								value: 'contains',
							},
							{
								name: 'Equals',
								value: 'eq',
							},
							{
								name: 'Greater Than',
								value: 'gt',
							},
							{
								name: 'Greater Than or Equal',
								value: 'gte',
							},
							{
								name: 'Is Empty',
								value: 'empty',
							},
							{
								name: 'Is Not Empty',
								value: 'not_empty',
							},
							{
								name: 'Is One Of',
								value: 'in',
							},
							{
								name: 'Less Than',
								value: 'lt',
							},
							{
								name: 'Less Than or Equal',
								value: 'lte',
							},
							{
								name: 'Not Equals',
								value: 'ne',
							},
						],
						default: 'eq',
					},
					{
						displayName: 'Value',
						name: 'value',
						type: 'string',
						default: '',
						displayOptions: {
							hide: {
								operator: ['empty', 'not_empty'],
							},
						},
						description:
							'The value to compare with. For "Is One Of", separate values with commas. Dates are ISO 8601, e.g. 2026-10-13.',
					},
				],
			},
		],
	},
	{
		displayName: 'Sort',
		name: 'sort',
		type: 'fixedCollection',
		typeOptions: {
			multipleValues: true,
		},
		placeholder: 'Add Sort Rule',
		default: {},
		displayOptions: {
			show: showOnlyForRowQuery,
		},
		description: 'Row order, up to 3 columns. Newest rows come first by default.',
		options: [
			{
				displayName: 'Sort Rule',
				name: 'sortRule',
				values: [
					{
						displayName: 'Column Name or ID',
						name: 'column',
						type: 'options',
						typeOptions: {
							loadOptionsMethod: 'getColumns',
							loadOptionsDependsOn: ['project.value'],
						},
						default: '',
						description:
							'Choose from the list, or specify an ID using an <a href="https://docs.n8n.io/code/expressions/">expression</a>',
					},
					{
						displayName: 'Direction',
						name: 'direction',
						type: 'options',
						options: [
							{
								name: 'Ascending',
								value: 'asc',
							},
							{
								name: 'Descending',
								value: 'desc',
							},
						],
						default: 'asc',
					},
				],
			},
		],
	},
	{
		displayName: 'Return All',
		name: 'returnAll',
		type: 'boolean',
		default: false,
		displayOptions: {
			show: showOnlyForRowQuery,
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
						rootProperty: 'rows',
						type: 'body',
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
				...showOnlyForRowQuery,
				returnAll: [false],
			},
		},
		description: 'Max number of results to return',
		routing: {
			send: {
				type: 'body',
				property: 'limit',
			},
			output: {
				maxResults: '={{$value}}',
			},
		},
	},
	{
		displayName: 'Options',
		name: 'options',
		type: 'collection',
		placeholder: 'Add Option',
		default: {},
		displayOptions: {
			show: showOnlyForRowQuery,
		},
		options: [
			{
				displayName: 'Return Column Names or IDs',
				name: 'columns',
				type: 'multiOptions',
				typeOptions: {
					loadOptionsMethod: 'getColumns',
					loadOptionsDependsOn: ['project.value'],
				},
				default: [],
				description:
					'Only these columns are returned in each row. Choose from the list, or specify IDs using an <a href="https://docs.n8n.io/code/expressions/">expression</a>.',
				routing: {
					send: {
						type: 'body',
						property: 'columns',
					},
				},
			},
		],
	},
];

export const rowFilterDescription: INodeProperties[] = [
	{
		displayName: 'Filters',
		name: 'filters',
		type: 'collection',
		placeholder: 'Add Filter',
		default: {},
		displayOptions: {
			show: showOnlyForRowFilter,
		},
		options: [
			{
				displayName: 'Archived Only',
				name: 'archived',
				type: 'boolean',
				default: false,
				description: 'Whether to use only deleted rows that are still in the archive',
				routing: {
					send: {
						type: 'body',
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
					'Rows with any of these tags are left out. Choose from the list, or specify IDs using an <a href="https://docs.n8n.io/code/expressions/">expression</a>.',
				routing: {
					send: {
						type: 'body',
						property: 'exclude_tags',
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
					'Only rows with all of these tags. Choose from the list, or specify IDs using an <a href="https://docs.n8n.io/code/expressions/">expression</a>.',
				routing: {
					send: {
						type: 'body',
						property: 'tags',
					},
				},
			},
		],
	},
];
