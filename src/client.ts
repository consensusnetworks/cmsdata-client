import fetch from "node-fetch";

interface QueryParams {
	filter?: string
	limit?: number;
	offset?: number;
	order?: string;
	sortBy?: string;
}


interface Dataset {
  identifier: string | string[];
  query?: QueryParams
}

interface fetchOptions {
	url : string;
	method: string;
	headers: object;
	params: QueryParams
}

type Result = {
	data: string | object;
	metadata?: object;
	error: Error | null;
}

class Client {
	query: QueryParams;
	dataset: Dataset;
	options: fetchOptions;
	result: Result;
	
	constructor(datasetId: Dataset['identifier']) {
		this.result = {
			data: "",
			error: null
		};
		this.query = {
			filter: '',
			limit: 100,
			offset: 0,
			order: '',
			sortBy: '',
		}
		this.dataset = {
			identifier: datasetId
		}
		this.options = {
			url: `https://data.cms.gov/data-api/v1/dataset/${datasetId}/data`,
			method: 'GET',
			headers: {
				'Content-Type': 'application/json',
			},
			params: this.query
		}
	}

	async get() {

		// check if we already fetched the resource
		if (this.result.data) {
			return this.result;
		}

		await this.getResource()
		return this.result;
	}

	private async getResource() {
		try {
			const res = await fetch(this.options.url, { method: this.options.method })

			if (res.status !== 200) {
				this.result.error = new Error(`HTTP ${res.status}`);
				return this.result;
			}
			const resource = await res.json()
			this.result.data = resource
			this.result.error = null
		} catch (e: any) {
			this.result.error = e;
		}
	}
}

function createClient(datasetId: Dataset['identifier']): Client {
	return new Client(datasetId);
}

module.exports = {
	createClient
}




