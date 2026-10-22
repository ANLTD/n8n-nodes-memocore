import type { INodeProperties } from 'n8n-workflow';
import { projectSelect } from '../../shared/descriptions';

const showOnlyForProjects = {
	resource: ['project'],
};

export const projectDescription: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: showOnlyForProjects,
		},
		options: [
			{
				name: 'Get',
				value: 'get',
				action: 'Get a project',
				description: 'Get a project, with the columns of a table',
				routing: {
					request: {
						method: 'GET',
						url: '=/projects/{{$parameter.project}}',
					},
				},
			},
			{
				name: 'Get Many',
				value: 'getAll',
				action: 'Get many projects',
				description: 'Get the projects the API key can access',
				routing: {
					request: {
						method: 'GET',
						url: '/projects',
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
		...projectSelect,
		displayOptions: {
			show: {
				...showOnlyForProjects,
				operation: ['get'],
			},
		},
	},
	{
		displayName: 'Return All',
		name: 'returnAll',
		type: 'boolean',
		default: false,
		displayOptions: {
			show: {
				...showOnlyForProjects,
				operation: ['getAll'],
			},
		},
		description: 'Whether to return all results or only up to a given limit',
	},
	{
		displayName: 'Limit',
		name: 'limit',
		type: 'number',
		typeOptions: {
			minValue: 1,
		},
		default: 50,
		displayOptions: {
			show: {
				...showOnlyForProjects,
				operation: ['getAll'],
				returnAll: [false],
			},
		},
		description: 'Max number of results to return',
		routing: {
			output: {
				maxResults: '={{$value}}',
			},
		},
	},
];
