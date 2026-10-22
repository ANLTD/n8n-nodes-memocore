import type { INodeProperties } from 'n8n-workflow';
import { memoOptionalFields } from './create';

const showOnlyForMemoUpdate = {
	operation: ['update'],
	resource: ['memo'],
};

export const memoUpdateDescription: INodeProperties[] = [
	{
		displayName: 'Update Fields',
		name: 'updateFields',
		type: 'collection',
		placeholder: 'Add Field',
		default: {},
		displayOptions: {
			show: showOnlyForMemoUpdate,
		},
		options: [
			{
				displayName: 'Content',
				name: 'content',
				type: 'string',
				typeOptions: {
					rows: 5,
				},
				default: '',
				description: 'The new text of the memo. Replaces the old text.',
				routing: {
					send: {
						type: 'body',
						property: 'content',
					},
				},
			},
			...memoOptionalFields,
		],
	},
];
