import type { ILoadOptionsFunctions, INodePropertyOptions } from 'n8n-workflow';
import { memocoreApiRequest } from '../shared/transport';
import type { TProjectWithColumns } from '../shared/types';

export async function getColumns(this: ILoadOptionsFunctions): Promise<INodePropertyOptions[]> {
	const project = this.getCurrentNodeParameter('project', { extractValue: true }) as string;
	if (!project) return [];

	const { columns } = await memocoreApiRequest<TProjectWithColumns>(
		this,
		'GET',
		`/projects/${project}`,
	);

	return columns.map((column) => ({
		name: column.name,
		value: column.name,
		description: column.description || column.type,
	}));
}
