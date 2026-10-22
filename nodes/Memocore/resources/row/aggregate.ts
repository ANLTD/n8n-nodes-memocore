import type { INodeProperties } from 'n8n-workflow';

const showOnlyForRowAggregate = {
	operation: ['aggregate'],
	resource: ['row'],
};

export const rowAggregateDescription: INodeProperties[] = [
	{
		displayName: 'Calculations',
		name: 'calculations',
		type: 'fixedCollection',
		typeOptions: {
			multipleValues: true,
		},
		placeholder: 'Add Calculation',
		default: {},
		displayOptions: {
			show: showOnlyForRowAggregate,
		},
		description: 'What to compute over the matching rows, up to 5. Leave empty to count them.',
		options: [
			{
				displayName: 'Calculation',
				name: 'calculation',
				values: [
					{
						displayName: 'Function',
						name: 'function',
						type: 'options',
						options: [
							{
								name: 'Average',
								value: 'avg',
							},
							{
								name: 'Count',
								value: 'count',
							},
							{
								name: 'Maximum',
								value: 'max',
							},
							{
								name: 'Minimum',
								value: 'min',
							},
							{
								name: 'Sum',
								value: 'sum',
							},
						],
						default: 'count',
					},
					{
						displayName: 'Column Name or ID',
						name: 'column',
						type: 'options',
						typeOptions: {
							loadOptionsMethod: 'getColumns',
							loadOptionsDependsOn: ['project.value'],
						},
						default: '',
						displayOptions: {
							hide: {
								function: ['count'],
							},
						},
						description:
							'A number column for Sum and Average, a number or date column for Minimum and Maximum. Choose from the list, or specify an ID using an <a href="https://docs.n8n.io/code/expressions/">expression</a>.',
					},
				],
			},
		],
	},
	{
		displayName: 'Group By',
		name: 'groupBy',
		type: 'fixedCollection',
		typeOptions: {
			multipleValues: true,
		},
		placeholder: 'Add Group',
		default: {},
		displayOptions: {
			show: showOnlyForRowAggregate,
		},
		description:
			'Compute separately for each value of these columns, up to 2. Leave empty for one total over all rows.',
		options: [
			{
				displayName: 'Group',
				name: 'group',
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
						displayName: 'Date Step',
						name: 'step',
						type: 'options',
						options: [
							{
								name: 'Day',
								value: 'day',
							},
							{
								name: 'Week',
								value: 'week',
							},
							{
								name: 'Month',
								value: 'month',
							},
							{
								name: 'Year',
								value: 'year',
							},
						],
						default: 'day',
						description:
							"For a date column: how wide each group is. Dates are grouped in the workflow's time zone.",
					},
				],
			},
		],
	},
];
