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
	const fields: IDataObject = {};

	for (const [column, value] of Object.entries(mapper.value ?? {})) {
		if (value === null || value === undefined || value === '') continue;
		fields[column] = value;
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
