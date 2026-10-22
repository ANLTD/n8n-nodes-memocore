import type { INodeProperties } from 'n8n-workflow';

export const projectSelect: INodeProperties = {
	displayName: 'Project',
	name: 'project',
	type: 'resourceLocator',
	default: { mode: 'list', value: '' },
	required: true,
	description: 'A project the API key can access',
	modes: [
		{
			displayName: 'From List',
			name: 'list',
			type: 'list',
			placeholder: 'Select a project...',
			typeOptions: {
				searchListMethod: 'getProjects',
				searchable: true,
			},
		},
		{
			displayName: 'ID',
			name: 'id',
			type: 'string',
			placeholder: 'e.g. 6a367392721eafb07a1274b2',
		},
	],
};

export const tableSelect: INodeProperties = {
	...projectSelect,
	displayName: 'Table',
	description: 'A table project the API key can access',
	modes: [
		{
			displayName: 'From List',
			name: 'list',
			type: 'list',
			placeholder: 'Select a table...',
			typeOptions: {
				searchListMethod: 'getTableProjects',
				searchable: true,
			},
		},
		{
			displayName: 'ID',
			name: 'id',
			type: 'string',
			placeholder: 'e.g. 6a367392721eafb07a1274b2',
		},
	],
};
