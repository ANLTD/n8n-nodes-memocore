import type { INodeProperties } from 'n8n-workflow';
import { memoCreateDescription } from './create';
import { memoSearchDescription } from './search';
import { memoUpdateDescription } from './update';

const showOnlyForMemos = {
	resource: ['memo'],
};

export const memoDescription: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: showOnlyForMemos,
		},
		options: [
			{
				name: 'Create',
				value: 'create',
				action: 'Create a memo',
				description: 'Save a new memo to a project',
				routing: {
					request: {
						method: 'POST',
						url: '/memos',
					},
				},
			},
			{
				name: 'Delete',
				value: 'delete',
				action: 'Delete a memo',
				description: 'Move a memo to the archive, where it is erased after 45 days',
				routing: {
					request: {
						method: 'DELETE',
						url: '=/memos/{{encodeURIComponent($parameter.memoId)}}',
					},
				},
			},
			{
				name: 'Get',
				value: 'get',
				action: 'Get a memo',
				description: 'Get the full text of a memo',
				routing: {
					request: {
						method: 'GET',
						url: '=/memos/{{encodeURIComponent($parameter.memoId)}}',
					},
				},
			},
			{
				name: 'Search',
				value: 'search',
				action: 'Search memos',
				description: 'Find memos by meaning and keywords',
				routing: {
					request: {
						method: 'GET',
						url: '/memos',
						arrayFormat: 'repeat',
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
			{
				name: 'Update',
				value: 'update',
				action: 'Update a memo',
				description: 'Change the text, tags or other fields of a memo',
				routing: {
					request: {
						method: 'PUT',
						url: '=/memos/{{encodeURIComponent($parameter.memoId)}}',
					},
				},
			},
		],
		default: 'search',
	},
	{
		displayName: 'Memo ID',
		name: 'memoId',
		type: 'string',
		required: true,
		default: '',
		displayOptions: {
			show: {
				...showOnlyForMemos,
				operation: ['delete', 'get', 'update'],
			},
		},
		description: 'The ID of the memo',
	},
	...memoSearchDescription,
	...memoCreateDescription,
	...memoUpdateDescription,
];
