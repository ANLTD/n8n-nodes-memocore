import { NodeConnectionTypes, type INodeType, type INodeTypeDescription } from 'n8n-workflow';
import { getProjects, getTableProjects } from './listSearch/getProjects';
import { getColumns } from './loadOptions/getColumns';
import { getProjectOptions } from './loadOptions/getProjectOptions';
import { getTags } from './loadOptions/getTags';
import { getRowFields } from './resourceMapping/getRowFields';
import { memoDescription } from './resources/memo';
import { projectDescription } from './resources/project';
import { rowDescription } from './resources/row';
import { tagDescription } from './resources/tag';

export class Memocore implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'Memocore',
		name: 'memocore',
		icon: { light: 'file:../../icons/memocore.svg', dark: 'file:../../icons/memocore.dark.svg' },
		group: ['transform'],
		version: 1,
		subtitle: '={{$parameter["operation"] + ": " + $parameter["resource"]}}',
		description: "Search, save and update your team's memory in memocore",
		defaults: {
			name: 'Memocore',
		},
		usableAsTool: true,
		inputs: [NodeConnectionTypes.Main],
		outputs: [NodeConnectionTypes.Main],
		credentials: [
			{
				name: 'memocoreApi',
				required: true,
			},
		],
		requestDefaults: {
			baseURL: '={{$credentials.url}}/api/v1',
			headers: {
				Accept: 'application/json',
				'Content-Type': 'application/json',
			},
		},
		properties: [
			{
				displayName: 'Resource',
				name: 'resource',
				type: 'options',
				noDataExpression: true,
				options: [
					{
						name: 'Memo',
						value: 'memo',
					},
					{
						name: 'Project',
						value: 'project',
					},
					{
						name: 'Row',
						value: 'row',
					},
					{
						name: 'Tag',
						value: 'tag',
					},
				],
				default: 'memo',
			},
			...memoDescription,
			...rowDescription,
			...projectDescription,
			...tagDescription,
		],
	};

	methods = {
		listSearch: {
			getProjects,
			getTableProjects,
		},
		loadOptions: {
			getColumns,
			getProjectOptions,
			getTags,
		},
		resourceMapping: {
			getRowFields,
		},
	};
}
