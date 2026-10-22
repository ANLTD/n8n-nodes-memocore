import type { FieldType, ILoadOptionsFunctions, ResourceMapperFields } from 'n8n-workflow';
import { memocoreApiRequest } from '../shared/transport';
import type { TColumnType, TProjectWithColumns } from '../shared/types';

const FIELD_TYPES: Record<TColumnType, FieldType> = {
	text: 'string',
	number: 'number',
	datetime: 'dateTime',
	checkbox: 'boolean',
	select: 'options',
	multiselect: 'array',
};

export async function getRowFields(this: ILoadOptionsFunctions): Promise<ResourceMapperFields> {
	const project = this.getNodeParameter('project', undefined, { extractValue: true }) as string;
	if (!project) return { fields: [] };

	const creating = this.getNodeParameter('operation', undefined) === 'create';

	const { columns } = await memocoreApiRequest<TProjectWithColumns>(
		this,
		'GET',
		`/projects/${project}`,
	);

	return {
		fields: columns.map((column) => ({
			id: column.name,
			displayName: column.name,
			required: creating && column.required,
			defaultMatch: false,
			canBeUsedToMatch: false,
			display: true,
			type: FIELD_TYPES[column.type],
			options:
				column.type === 'select'
					? column.options.map((option) => ({ name: option, value: option }))
					: undefined,
		})),
		emptyFieldsNotice: 'This table has no columns yet',
	};
}
