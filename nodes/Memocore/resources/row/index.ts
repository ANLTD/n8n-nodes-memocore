import type { INodeProperties } from 'n8n-workflow';
import { tableSelect } from '../../shared/descriptions';
import { sendRowFields, sendRowQuery } from '../../shared/rowHooks';
import { rowQueryDescription } from './query';

const showOnlyForRows = {
	resource: ['row'],
};

export const rowDescription: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: showOnlyForRows,
		},
		options: [
			{
				name: 'Create',
				value: 'create',
				action: 'Create a row',
				description: 'Add a row to a table',
				routing: {
					request: {
						method: 'POST',
						url: '/memos',
						body: {
							project_id: '={{$parameter.project}}',
						},
					},
					send: {
						preSend: [sendRowFields],
					},
				},
			},
			{
				name: 'Delete',
				value: 'delete',
				action: 'Delete a row',
				description: 'Move a row to the archive, where it is erased after 45 days',
				routing: {
					request: {
						method: 'DELETE',
						url: '=/memos/{{encodeURIComponent($parameter.rowId)}}',
					},
				},
			},
			{
				name: 'Query',
				value: 'query',
				action: 'Query rows',
				description: 'Filter and sort the rows of a table',
				routing: {
					request: {
						method: 'POST',
						url: '=/projects/{{$parameter.project}}/rows/query',
					},
					send: {
						preSend: [sendRowQuery],
					},
					output: {
						postReceive: [
							{
								type: 'rootProperty',
								properties: {
									property: 'rows',
								},
							},
						],
					},
				},
			},
			{
				name: 'Update',
				value: 'update',
				action: 'Update a row',
				description: 'Change the values of a row. Columns you leave out keep their values.',
				routing: {
					request: {
						method: 'PUT',
						url: '=/memos/{{encodeURIComponent($parameter.rowId)}}',
					},
					send: {
						preSend: [sendRowFields],
					},
				},
			},
		],
		default: 'query',
	},
	{
		...tableSelect,
		displayOptions: {
			show: {
				...showOnlyForRows,
				operation: ['create', 'query', 'update'],
			},
		},
	},
	{
		displayName: 'Row ID',
		name: 'rowId',
		type: 'string',
		required: true,
		default: '',
		displayOptions: {
			show: {
				...showOnlyForRows,
				operation: ['delete', 'update'],
			},
		},
		description: 'The ID of the row',
	},
	{
		displayName: 'Columns',
		name: 'fields',
		type: 'resourceMapper',
		noDataExpression: true,
		default: {
			mappingMode: 'defineBelow',
			value: null,
		},
		required: true,
		displayOptions: {
			show: {
				...showOnlyForRows,
				operation: ['create', 'update'],
			},
		},
		typeOptions: {
			loadOptionsDependsOn: ['project.value', 'operation'],
			resourceMapper: {
				resourceMapperMethod: 'getRowFields',
				mode: 'add',
				fieldWords: {
					singular: 'column',
					plural: 'columns',
				},
				addAllFields: true,
				multiKeyMatch: false,
				supportAutoMap: true,
			},
		},
	},
	...rowQueryDescription,
];
