import type { INodeProperties } from 'n8n-workflow';
import { projectSelect } from '../../shared/descriptions';

const showOnlyForMemoCreate = {
	operation: ['create'],
	resource: ['memo'],
};

export const memoOptionalFields: INodeProperties[] = [
	{
		displayName: 'Change Note',
		name: 'changes',
		type: 'string',
		default: '',
		description: "One line on what changed, shown in the memo's history",
		routing: {
			send: {
				type: 'body',
				property: 'changes',
			},
		},
	},
	{
		displayName: 'Expires In',
		name: 'expiresIn',
		type: 'string',
		default: '',
		placeholder: 'e.g. 7d',
		description:
			'How long the memo lives before it moves to the archive: 30m, 2h, 3d or 1w. Use "none" to keep it forever.',
		routing: {
			send: {
				type: 'body',
				property: 'expires_in',
			},
		},
	},
	{
		displayName: 'Search Hints',
		name: 'meta',
		type: 'string',
		typeOptions: {
			rows: 2,
		},
		default: '',
		description: 'Keywords and questions to find the memo by. Never shown to readers.',
		routing: {
			send: {
				type: 'body',
				property: 'meta',
			},
		},
	},
	{
		displayName: 'Summary',
		name: 'preview',
		type: 'string',
		default: '',
		description: 'A short public summary, up to 200 characters',
		routing: {
			send: {
				type: 'body',
				property: 'preview',
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
				type: 'body',
				property: 'tags',
			},
		},
	},
	{
		displayName: 'Title',
		name: 'title',
		type: 'string',
		default: '',
		routing: {
			send: {
				type: 'body',
				property: 'title',
			},
		},
	},
];

export const memoCreateDescription: INodeProperties[] = [
	{
		...projectSelect,
		displayOptions: {
			show: showOnlyForMemoCreate,
		},
		routing: {
			send: {
				type: 'body',
				property: 'project_id',
			},
		},
	},
	{
		displayName: 'Content',
		name: 'content',
		type: 'string',
		typeOptions: {
			rows: 5,
		},
		required: true,
		default: '',
		displayOptions: {
			show: showOnlyForMemoCreate,
		},
		description: 'The text of the memo',
		routing: {
			send: {
				type: 'body',
				property: 'content',
			},
		},
	},
	{
		displayName: 'Additional Fields',
		name: 'additionalFields',
		type: 'collection',
		placeholder: 'Add Field',
		default: {},
		displayOptions: {
			show: showOnlyForMemoCreate,
		},
		options: memoOptionalFields,
	},
];
