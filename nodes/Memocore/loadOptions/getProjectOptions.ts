import type { ILoadOptionsFunctions, INodePropertyOptions } from 'n8n-workflow';
import { memocoreApiRequest } from '../shared/transport';
import type { TProject } from '../shared/types';

export async function getProjectOptions(
	this: ILoadOptionsFunctions,
): Promise<INodePropertyOptions[]> {
	const { items } = await memocoreApiRequest<{ items: TProject[] }>(this, 'GET', '/projects');

	return items.map((project) => ({
		name: project.name,
		value: project.id,
		description: project.description,
	}));
}
