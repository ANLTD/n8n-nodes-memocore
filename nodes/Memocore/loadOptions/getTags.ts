import type { ILoadOptionsFunctions, INodePropertyOptions } from 'n8n-workflow';
import { memocoreApiRequest } from '../shared/transport';
import type { TTag } from '../shared/types';

export async function getTags(this: ILoadOptionsFunctions): Promise<INodePropertyOptions[]> {
	const { items } = await memocoreApiRequest<{ items: TTag[] }>(this, 'GET', '/tags', {
		limit: 90,
	});

	return items.map((tag) => ({ name: tag.name, value: tag.id, description: tag.context }));
}
