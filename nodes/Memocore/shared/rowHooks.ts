import type {
	IDataObject,
	IExecuteSingleFunctions,
	IHttpRequestOptions,
	ResourceMapperValue,
} from 'n8n-workflow';

type TConditionInput = {
	column: string;
	operator: string;
	value?: string;
};

type TSortInput = {
	column: string;
	direction: 'asc' | 'desc';
};

const VALUELESS_OPERATORS = ['empty', 'not_empty'];

const DATE_WITHOUT_OFFSET = /^\d{4}-\d{2}-\d{2}(T\d{2}:\d{2}(:\d{2}(\.\d+)?)?)?$/;

function zoneOffsetMs(date: Date, timeZone: string): number {
	const parts = new Intl.DateTimeFormat('en-US', {
		timeZone,
		hourCycle: 'h23',
		year: 'numeric',
		month: '2-digit',
		day: '2-digit',
		hour: '2-digit',
		minute: '2-digit',
		second: '2-digit',
	}).formatToParts(date);
	const part = (type: string) => Number(parts.find((item) => item.type === type)?.value);
	const wallTime = Date.UTC(
		part('year'),
		part('month') - 1,
		part('day'),
		part('hour'),
		part('minute'),
		part('second'),
	);

	return wallTime - (date.getTime() - date.getUTCMilliseconds());
}

function toUtcIso(value: string, timeZone: string): string {
	const wallTime = new Date(`${value.includes('T') ? value : `${value}T00:00:00`}Z`).getTime();
	const guess = wallTime - zoneOffsetMs(new Date(wallTime), timeZone);

	return new Date(wallTime - zoneOffsetMs(new Date(guess), timeZone)).toISOString();
}

function toCondition(input: TConditionInput): IDataObject {
	if (VALUELESS_OPERATORS.includes(input.operator))
		return { column: input.column, op: input.operator };

	const value = input.value ?? '';
	if (input.operator === 'in') {
		return {
			column: input.column,
			op: 'in',
			value: value
				.split(',')
				.map((item) => item.trim())
				.filter(Boolean),
		};
	}

	return { column: input.column, op: input.operator, value };
}

export async function sendRowFields(
	this: IExecuteSingleFunctions,
	requestOptions: IHttpRequestOptions,
): Promise<IHttpRequestOptions> {
	const mapper = this.getNodeParameter('fields') as ResourceMapperValue;
	const dateColumns = (mapper.schema ?? [])
		.filter((field) => field.type === 'dateTime')
		.map((field) => field.id);
	const fields: IDataObject = {};

	for (const [column, value] of Object.entries(mapper.value ?? {})) {
		if (value === null || value === undefined || value === '') continue;
		fields[column] =
			dateColumns.includes(column) && typeof value === 'string' && DATE_WITHOUT_OFFSET.test(value)
				? toUtcIso(value, this.getTimezone())
				: value;
	}

	requestOptions.body = { ...(requestOptions.body as IDataObject | undefined), fields };

	return requestOptions;
}

export async function sendRowQuery(
	this: IExecuteSingleFunctions,
	requestOptions: IHttpRequestOptions,
): Promise<IHttpRequestOptions> {
	const match = this.getNodeParameter('match', 'and') as 'and' | 'or';
	const conditions = (this.getNodeParameter('conditions.condition', []) as TConditionInput[]).map(
		toCondition,
	);
	const sort = (this.getNodeParameter('sort.sortRule', []) as TSortInput[]).map((rule) => ({
		column: rule.column,
		order: rule.direction,
	}));

	const body: IDataObject = { ...(requestOptions.body as IDataObject | undefined) };
	if (conditions.length) body.where = { mode: match, conditions };
	if (sort.length) body.sort = sort;

	requestOptions.body = body;

	return requestOptions;
}
