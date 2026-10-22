import type { ILoadOptionsFunctions, INodeListSearchResult } from 'n8n-workflow';
import { memocoreApiRequest } from '../shared/transport';
import type { TProject } from '../shared/types';

async function searchProjects(
	context: ILoadOptionsFunctions,
	filter: string | undefined,
	only_tables: boolean,
): Promise<INodeListSearchResult> {
	const { items } = await memocoreApiRequest<{ items: TProject[] }>(context, 'GET', '/projects');
	const needle = filter?.trim().toLowerCase();

	const results = items
		.filter((project) => !only_tables || project.type === 'table')
		.filter((project) => !needle || project.name.toLowerCase().includes(needle))
		.map((project) => ({ name: project.name, value: project.id }));

	return { results };
}

export async function getProjects(
	this: ILoadOptionsFunctions,
	filter?: string,
): Promise<INodeListSearchResult> {
	return await searchProjects(this, filter, false);
}

export async function getTableProjects(
	this: ILoadOptionsFunctions,
	filter?: string,
): Promise<INodeListSearchResult> {
	return await searchProjects(this, filter, true);
}
