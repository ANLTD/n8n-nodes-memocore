import type {
	IDataObject,
	IExecuteSingleFunctions,
	IHttpRequestMethods,
	ILoadOptionsFunctions,
} from 'n8n-workflow';

export async function memocoreApiRequest<T>(
	context: ILoadOptionsFunctions | IExecuteSingleFunctions,
	method: IHttpRequestMethods,
	path: string,
	qs: IDataObject = {},
): Promise<T> {
	const credentials = await context.getCredentials<{ url: string }>('memocoreApi');
	const base_url = credentials.url.replace(/\/+$/, '');

	return (await context.helpers.httpRequestWithAuthentication.call(context, 'memocoreApi', {
		method,
		qs,
		url: `${base_url}/api/v1${path}`,
		json: true,
	})) as T;
}
