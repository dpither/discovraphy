import type { IResponseDeserializer } from "@spotify/web-api-ts-sdk";

export default class CustomResponseDeserializer
	implements IResponseDeserializer
{
	public async deserialize<TReturnType>(
		response: Response,
	): Promise<TReturnType> {
		response.status;
		const text = await response.text();

		if (text.length > 0 && (text[0] === "{" || text[0] === "[")) {
			const json = JSON.parse(text);
			return json as TReturnType;
		}

		return null as TReturnType;
	}
}
